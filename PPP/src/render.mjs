/* PPP render - extracted from the Procurement-Dashboard.html inline script (I-76, P1).
   Revision 1.0 - 2026-10-30 - opencode (AI): first extraction; behaviour unchanged.
   Revision 1.6 - 2026-11-01 - opencode (AI): P7. The split header follows spec 7.2.15:
     one .splitcard container, a .vheadwrap header port, a --ds-sbw gutter column, body-derived
     column widths and a ResizeObserver lock-step, all through syncSplitTable().
   Revision 1.5 - 2026-11-01 - opencode (AI): P6.3. KPI cards carry a status class and two lines only;
     
enderKPIs() writes no sub-line and no inline colour; CSV actions use the shared .btn-secondary.
   Revision 1.4 - 2026-11-01 - opencode (AI): P6.2. Panels conform to spec 4-4.5:
     setupPanels() (DOM-order number, Help/Collapse, persisted collapse), splitTable() for the
     four bounded tables, the drill-down button contract, the validation count strip and Rules
     table, and the benchmark rendered from BENCH_ROWS.
   Revision 1.3 - 2026-10-30 - opencode (AI): P6.1. Shared shell: two-row header, menu bar with
     Load / Export / Search / Warnings / layout, left navigation sidebar, warning area inside the
     content zone. Search is a real S4 filter; Settings holds the theme picker.
   Revision 1.2 - 2026-10-30 - opencode (AI): P3. Absent values (blank or formula error) are
     skipped by every tally, and W-FORMULA notices route to the error banner as fatal strips.
   Revision 1.1 - 2026-10-30 - opencode (AI): P2. One deriveView() step computes every count,
     average and list; each render function paints a part of that view and nothing else. The
     remaining UI state (PO window, bars toggle, overdue stage, look-ahead horizon) lives in
     STATE. STAGES and the stage date helpers are imported from pipeline.mjs. */

import { parseXlsx } from './xlsx-reader.mjs';
import { buildModel, validate, fmt, LOOKUP_HEADERS, STAGES, todayMidnight, stageDue, stageIsOverdue } from './pipeline.mjs';

function esc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function trunc(s,n){ s=String(s==null?'':s); return s.length>n? s.slice(0,n-1)+'…' : s; }
/* I-25 (cleaned 2026-09-16): the former `normPerson()` helper was dead code —
   defined and never called, so V-12 could never fire. The engineer tally keys on
   the raw trimmed string, so variants like "Dilip/Siva" vs "Dilip / Siva" are
   reported as distinct values by design (the workbook is the place to fix them,
   and V-12 surfaces them when they appear). Removed rather than wired up: adding
   a normaliser here would silently merge genuinely different entries. */
function safeCall(fn, errId){ try{ fn(); }catch(e){ const el=document.getElementById(errId); if(el) el.innerHTML='<div class="empty ds-bad">Chart error: '+esc(e.message)+'</div>'; console.error(e); } }
function openBanner(b, ctx){ b.style.display='block'; const h=b.offsetHeight; if(h){ document.documentElement.style.setProperty('--banner-h', h+'px'); document.body.classList.add('banner-open'); document.body.classList.toggle('banner-welcome', ctx==='welcome'); } }
function closeBanner(b){ b.style.display='none'; b.innerHTML=''; document.body.classList.remove('banner-open','banner-welcome'); document.documentElement.style.removeProperty('--banner-h'); }
function showError(msg){
  /* S1/S2 failure: the dashboard is not shown, so the message goes on the welcome card. The
     #errBanner inside the content zone is only for warnings on a loaded dashboard (§3.1). */
  const w=document.getElementById('welcomeErr');
  if(w){ w.hidden=false; w.innerHTML='<b>Load failed.</b> '+esc(msg)+' &nbsp;·&nbsp; press F12 → Console for the full trace.'; }
  const dash=document.getElementById('dash');
  if(dash) dash.style.display='none';
  const welcome=document.getElementById('welcome');
  if(welcome) welcome.style.display='flex';
}
function toast(msg){ const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2200); }

/* ============== build ============== */
/* STATE (I-30): single source of truth. The view is a pure function of
   STATE — handlers mutate STATE, then call render(); the DOM is write-only.
   Replaces the old trio DB / LAST_REPORT / SELECTED_CATS + scattered
   localStorage reads. P2 moved the last module-level state into this object:
   the PO period window, the bars toggle, the overdue stage and the look-ahead
   cache all live here (or in the derived view) now. */
export const STATE = {
  model:null,                       // {project, packages, lookups, lookupMeta, statusCanon, codeInfo}
  report:null,                      // validation report
  view:null,                        // S4 output — the only source the renderers paint from
  filter:{ cats:null }, // cats:null = all categories. Stage selection is NOT here — it is the `ovlStage` seg preference (§7.5)
  search:'',                        // menu-bar search text (D12)
  searchField:'all',                // which column the search applies to (B5 picker)
  chartView:{ packages:'status', data:'dqByRule' }, // interactive panel selected breakdowns
  prefs:{ chartType:{}, poBars:true }, // chartType: key -> 'bar' | 'pie' (persisted); poBars is session-only
  poWin:{ from:0, to:0, _n:0 },     // PO period window over month indices
  ui:{ typeFilterBound:false, collapsed:{}, valCols:{ value:true, message:true } } // panel state + one-time DOM wiring guards
};

/* ---- chart-type preference (persisted, I-30) ---- */
function prefKey(k){ return 'ppp-chart-'+k; }
function getPref(k){
  if(STATE.prefs.chartType[k]==null){
    let v='bar'; try{ v=localStorage.getItem(prefKey(k))||'bar'; }catch(e){}
    STATE.prefs.chartType[k]=v;
  }
  return STATE.prefs.chartType[k];
}
function setPref(k,v){ STATE.prefs.chartType[k]=v; try{ localStorage.setItem(prefKey(k),v); }catch(e){} }

function catLabel(k){ return k==='__blank__'?'(Unassigned)':k; }

/* Type filter (Panel 1 chrome). The category list is part of the derived view; the DOM wiring is
   bound once, and later renders only rewrite the panel HTML and the label. */
function buildTypeFilter(cats){
  const allChk=!STATE.filter.cats || STATE.filter.cats.size===cats.length;
  const sel=allChk?cats.length:(STATE.filter.cats?STATE.filter.cats.size:0);
  let html='<div class="tf-head"><label><input type="checkbox" id="tfAll" '+(allChk?'checked':'')+'> <b>All Categories</b></label>';
  html+='<div class="tf-note">Choose one or more categories; every panel follows the selection.</div>';
  html+='<div class="tf-divider"></div></div>';
  html+='<div class="tf-list">';
  cats.forEach(k=>{
    const chk=allChk||STATE.filter.cats.has(k);
    html+='<label title="'+esc(catLabel(k))+'"><input type="checkbox" class="tf-cat" data-cat="'+esc(k)+'" '+(chk?'checked':'')+'><span class="tf-name">'+esc(catLabel(k))+'</span></label>';
  });
  html+='</div>';
  html+='<div class="tf-foot"><span id="tfFoot">'+(allChk?('All '+cats.length+' selected'):(sel+' of '+cats.length+' selected'))+'</span><button type="button" class="tf-reset" id="tfReset">Reset</button></div>';
  document.getElementById('tfPanel').innerHTML=html;
  updateTfLabel();
  if(STATE.ui.typeFilterBound) return;
  STATE.ui.typeFilterBound=true;

  /* One delegated listener on the panel element. The panel HTML is repainted on every render, so
     listeners attached to the child checkboxes would be discarded with them. */
  document.getElementById('tfPanel').addEventListener('click', e=>{
    const t=e.target||{};
    if(t.id==='tfReset'){
      STATE.filter.cats=null;
      document.querySelectorAll('.tf-cat').forEach(b=>{ b.checked=true; });
      document.getElementById('tfAll').checked=true;
      updateTfLabel(); render();
    }
  });
  document.getElementById('tfPanel').addEventListener('change', e=>{
    const t=e.target||{};
    if(t.id==='tfAll'){
      document.querySelectorAll('.tf-cat').forEach(b=>{ b.checked=t.checked; });
      STATE.filter.cats = t.checked ? null : new Set();
    } else if(t.classList && t.classList.contains('tf-cat')){
      const checked=[...document.querySelectorAll('.tf-cat:checked')].map(b=>b.getAttribute('data-cat'));
      const all=document.querySelectorAll('.tf-cat');
      if(checked.length===all.length){ STATE.filter.cats=null; document.getElementById('tfAll').checked=true; }
      else { STATE.filter.cats=new Set(checked); document.getElementById('tfAll').checked=false; }
    } else return;
    updateTfLabel(); render();
  });
}

function updateTfLabel(){
  const cats=(STATE.view&&STATE.view.catList)||[];
  const allChk=!STATE.filter.cats||STATE.filter.cats.size===cats.length;
  const sel=allChk?cats.length:(STATE.filter.cats?STATE.filter.cats.size:0);
  const btn=document.getElementById('tfBtn');
  const lbl=document.getElementById('tfLabel');
  const badge=document.getElementById('tfCount');
  if(lbl) lbl.textContent='Categories';
  if(btn){
    btn.classList.toggle('is-filtered', !allChk);
    btn.title = allChk ? 'All categories' : sel+' of '+cats.length+' categories selected';
  }
  if(badge){ badge.textContent=String(sel); badge.hidden=allChk; }
  const foot=document.getElementById('tfFoot');
  if(foot) foot.textContent = allChk ? ('All '+cats.length+' selected') : (sel+' of '+cats.length+' selected');
}

/* ============== S4 — the single aggregation step ============== */
/* deriveView() is the ONLY place that counts, averages or groups. Every number the page shows is
   produced here once, from the full model and STATE, and returned as one view object. The render
   functions below paint that view; they never re-filter or re-count (D10, §3.8 S4/S5). */
export function deriveView(model, state){
  const report = state.report;
  const today = todayMidnight();
  const all = model.packages;

  /* I-57: an empty Set means "none selected". Keep it equal to "all" so the dashboard is never
     silently empty; the filter button still says "None selected". */
  const cats = state.filter.cats;
  const q = String(state.search||'').trim().toLowerCase();
  const inCats = (!cats || cats.size===0) ? all : all.filter(p=>cats.has(p.itemCategory||'__blank__'));
  /* D12: search is one more AND filter over the package record. The picker (B5) narrows the column. */
  const SEARCH_FIELDS={title:p=>p.title,packageNo:p=>p.packageNo,discipline:p=>p.discipline,itemCategory:p=>p.itemCategory,status:p=>p.status};
  const searchField=(state.searchField&&SEARCH_FIELDS[state.searchField])?state.searchField:'all';
  const active = !q ? inCats : inCats.filter(p=>{
    const hay = searchField==='all'
      ? [p.title,p.packageNo,p.discipline,p.itemCategory,p.status].map(v=>String(v==null?'':v).toLowerCase()).join(' ')
      : String(SEARCH_FIELDS[searchField](p)==null?'':SEARCH_FIELDS[searchField](p)).toLowerCase();
    return hay.includes(q);
  });

  const catList = [...new Set(all.map(p=>p.itemCategory||'__blank__'))]
    .sort((a,b)=>{ if(a==='__blank__') return 1; if(b==='__blank__') return -1; return a.localeCompare(b); });

  /* ---- status bar ---- */
  const total = all.length;
  const shown = active.length;
  const started = active.filter(p=>p.status&&p.status!=='Not Start').length;
  /* Absent values are excluded from the denominator (blank status is not a status). */
  const withStatus = active.filter(p=>p.status!=null && String(p.status).trim()!=='').length;
  const pct = withStatus ? Math.round(started/withStatus*100) : 0;
  const filt = (!cats||cats.size===0) ? 'All categories'
    : cats.size+' categor'+(cats.size>1?'ies':'y')+' selected';
  const status = { total, shown, started, withStatus, pct, filt, today, search:q, searchField };

  /* ---- Panel 1: KPI cards ---- */
  const T=active.length;
  const canon=model.statusCanon||(v=>String(v==null?'':v));
  const st=tallyBy(active,p=>canon(p.status));   // absent statuses are skipped
  const notStart=st['Not Start']||0;
  const delivered=active.filter(p=>{ const d=String(canon(p.status)).toLowerCase(); return d.includes('delivered')||d.includes('receive inspection'); }).length;
  const stTotal=Object.values(st).reduce((a,b)=>a+b,0);
  const startedPct=stTotal?Math.round((stTotal-notStart)/stTotal*100):0;
  const lt=active.filter(p=>p.leadTime!=null&&!isNaN(p.leadTime)).length;
  const eng=active.filter(p=>p.engineer!=null&&String(p.engineer).trim()!=='').length;
  const poIssued=active.filter(p=>p.poActual!=null&&p.poActual!=='').length;
  /* Empty view guard: a filter can match nothing, and n/0 must not print NaN. */
  const pctOf=n=>T?Math.round(n/T*100):0;
  /* Spec §5: exactly two lines per card (value + label) and a status class that sets the top strip. */
  const kpis=[
    {v:T,l:'Total Packages',c:'',n:T,den:T,pct:T?100:0,def:'Every package in the current filter.'},
    {v:startedPct+'%',l:'Started (≠ Not Start)',c:startedPct>=60?'ok':startedPct>=40?'amb':'warn',n:stTotal-notStart,den:stTotal,pct:startedPct,def:'At least one procurement stage is started; packages with a blank status are excluded from the share.'},
    {v:poIssued,l:'PO Issued',c:T&&poIssued/T>=0.5?'ok':'warn',n:poIssued,den:T,pct:pctOf(poIssued),def:'A PO Actual date exists, which is the only evidence that a PO is issued.'},
    {v:pctOf(delivered)+'%',l:'Delivered / RI',c:delivered>0?'ok':'warn',n:delivered,den:T,pct:pctOf(delivered),def:'Status is Delivered or Receive Inspection.'},
    {v:lt+'/'+T,l:'Lead-time estimated',c:T&&lt/T>=0.5?'ok':'warn',n:lt,den:T,pct:pctOf(lt),def:'An estimated lead time is recorded for the package.'},
    {v:eng+'/'+T,l:'Engineer assigned',c:'ok',n:eng,den:T,pct:pctOf(eng),def:'An engineer name is recorded for the package.'}
  ];

  /* ---- Panel 2: interactive chart items (every breakdown, computed once) ---- */
  const interactive = {
    packages: {
      status: statusItems(active, model),
      discipline: tallyItems(active,'discipline',{sort:true}),
      itemCategory: tallyItems(active,'itemCategory',{sort:true, blankLabel:'Unassigned'}),
      criticality: critItems(active, model),
      engineer: tallyItems(active,'engineer',{sort:true, blankLabel:'Unassigned'}),
      supplierBuyerPE: supplierBuyerPEItems(active),
      stageOverdue: stageOverdueItems(active, today),
      scheduleHealth: scheduleHealthItems(active, today)
    },
    data: {
      dqByRule: dqByRuleItems(model, report),
      dqByPackage: dqByPackageItems(model, report),
      dqByDiscipline: dqByDisciplineItems(model, report)
    }
  };

  /* ---- Panel 3: PO plan / forecast / actual ---- */
  /* The DOMAIN is project-level (full package set) so the axis never moves with the category
     filter (I-70); the COUNTS use the filtered set. */
  const domDates=[];
  all.forEach(p=>['poPlan','poForecast','poActual'].forEach(f=>{ const d=p[f]; if(d instanceof Date && !isNaN(d)) domDates.push(d); }));
  let po = null;
  if(domDates.length){
    const psVal=model.project.startDate;
    const projStart=(psVal instanceof Date && !isNaN(psVal))?psVal:null;
    let dataMin=null,maxD=null;
    domDates.forEach(d=>{ if(!dataMin||d<dataMin)dataMin=d; if(!maxD||d>maxD)maxD=d; });
    const tlStart=(projStart&&dataMin&&dataMin<projStart)?dataMin:(projStart||dataMin);
    let end=new Date(maxD.getFullYear(),maxD.getMonth()+1,1);
    if(projStart){ const ps=new Date(projStart.getFullYear(),projStart.getMonth(),1); if(ps>end) end=ps; }
    const months=[]; { let c=new Date(tlStart.getFullYear(),tlStart.getMonth(),1), e=new Date(end.getFullYear(),end.getMonth(),1); while(c<=e){ months.push(ym(c)); c.setMonth(c.getMonth()+1); } }
    const n=months.length;
    const idx=m=>months.indexOf(m);
    const pMonth=Array(n).fill(0), fMonth=Array(n).fill(0), aMonth=Array(n).fill(0);
    active.forEach(r=>{
      let i;
      if(r.poPlan instanceof Date&&!isNaN(r.poPlan)&&(i=idx(ym(r.poPlan)))>=0) pMonth[i]++;
      const f=r.poForecast||r.poPlan;                       // forecast blanks fall back to plan
      if(f instanceof Date&&!isNaN(f)&&(i=idx(ym(f)))>=0) fMonth[i]++;
      if(r.poActual instanceof Date&&!isNaN(r.poActual)&&(i=idx(ym(r.poActual)))>=0) aMonth[i]++;
    });
    const pCum=pMonth.slice(), fCum=fMonth.slice(), aCum=aMonth.slice();
    for(let i=1;i<n;i++){ pCum[i]+=pCum[i-1]; fCum[i]+=fCum[i-1]; aCum[i]+=aCum[i-1]; }
    const hasForecast=all.some(p=>p.poForecast instanceof Date&&!isNaN(p.poForecast));
    const projStartIdx=projStart?idx(ym(projStart)):-1;
    const todayIdx=idx(ym(today));
    const lastIdxOf=arr=>{ let k=-1; for(let i=0;i<arr.length;i++) if(arr[i]>0) k=i; return k; };
    const lastPlanIdx=lastIdxOf(pMonth), lastForecastIdx=lastIdxOf(fMonth), lastActualIdx=lastIdxOf(aMonth);
    const actualEndIdx=Math.max(lastActualIdx, todayIdx);
    /* Default / reset the window ONLY when the domain month count changes (a new file). */
    const win=state.poWin;
    if(!win||win._n!==n){ state.poWin={from:0,to:n-1,_n:n}; }
    state.poWin.from=Math.min(state.poWin.from,n-1); state.poWin.to=Math.min(state.poWin.to,n-1);
    if(state.poWin.from>state.poWin.to){ const t=state.poWin.from; state.poWin.from=state.poWin.to; state.poWin.to=t; }
    po={months,pNew:pMonth,fNew:fMonth,aNew:aMonth,pCum,fCum,aCum,projStartIdx,todayIdx,hasForecast,
        lastPlanIdx,lastForecastIdx,lastActualIdx,actualEndIdx,
        projStartLabel:projStart?fmt(projStart):'', projStart,
        window:{from:state.poWin.from,to:state.poWin.to}};
  }

  /* ---- Panel 4: PO look-ahead ---- */
  const h=lookHorizon();
  const lookEnd=new Date(today.getFullYear(), today.getMonth()+h, today.getDate());
  const isDate=d=>d instanceof Date&&!isNaN(d);
  const lookList=active.filter(p=>isDate(p.poPlan)&&p.poPlan>=today&&p.poPlan<=lookEnd&&!isDate(p.poActual))
    .sort((a,b)=>a.poPlan-b.poPlan);
  const look={list:lookList, end:lookEnd, from:today, h};

  /* ---- Panel 5: overdue by stage ---- */
  /* Collect every overdue row first, then pick the ONE stage to display (§7.5). Counting before
     selecting lets the default land on a stage that actually has rows. */
  const ovlAll=[];
  active.forEach(p=>{
    OVL_STAGES.forEach(([k,lab])=>{
      if(stageIsOverdue(p,k,today)){
        const due=p[k+'Plan'];
        ovlAll.push({p,k,lab,due,days:Math.round((today-due)/86400000)});
      }
    });
  });
  ovlAll.sort((a,b)=>a.due-b.due);
  const ovlCounts={}; OVL_STAGES.forEach(([k])=>ovlCounts[k]=0); ovlAll.forEach(r=>ovlCounts[r.k]++);
  let ovlSel=state.prefs.chartType.ovlStage;
  if(ovlSel==null) ovlSel=getPref('ovlStage');   // honour the saved choice on first render
  if(OVL_KEYS.indexOf(ovlSel)<0){
    ovlSel=(OVL_STAGES.find(([k])=>ovlCounts[k]>0)||OVL_STAGES[0])[0];
    state.prefs.chartType.ovlStage=ovlSel;   // resolved once, then kept until the user changes it
  }
  const overdue={ all:ovlAll, counts:ovlCounts, sel:ovlSel, rows:ovlAll.filter(r=>r.k===ovlSel), today };

  /* ---- Panel 7: validation ---- */
  const iss=(report&&report.issues)||[];
  const sys=iss.filter(i=>i.kind==='system');
  const warns=(report&&report.warnings)||[];   // W-FORMULA, §3.8.4
  const data=iss.filter(i=>i.kind==='data');
  const counts={error:0,warning:0,info:0};
  data.forEach(i=>{ if(counts[i.sev]!=null) counts[i.sev]++; });
  const refs=[], refIdx={};
  iss.forEach(i=>{ if(!(i.code in refIdx)){ refIdx[i.code]=refs.length; refs.push({code:i.code,desc:i.desc||'',group:i.group||'',trigger:i.trigger||'',kind:i.kind||'',sev:i.sev||'info'}); } });
  refs.sort((a,b)=>String(a.code).localeCompare(String(b.code)));
  const issues={ sys, warns, banner:sys.concat(warns), data, counts, refs, total:(report&&report.total)||0 };

  return { active, catList, status, kpis, issues, panels:{ interactive, po, look, overdue } };
}

/* S4 boundary: a derive failure keeps the dashboard on screen and reports in the banner. */
function stageError(stage, err){
  const b=document.getElementById('errBanner');
  if(b){
    b.innerHTML='<div class="sys-banner-item fatal">⛔ <b>'+esc(stage)+' failed</b> '+esc(err.message)+'</div>';
    openBanner(b,'dash');
  }
  console.error('['+stage+']', err);
}

/* Single render entry (I-30): one derive step, then paint-only renderers. */
export function render(){
  if(!STATE.model) return;
  let v;
  try{ v=deriveView(STATE.model, STATE); }
  catch(e){ stageError('S4 derive', e); return; }
  STATE.view=v;
  safeCall(()=>buildTypeFilter(v.catList), 'tfPanel');
  safeCall(()=>renderValidation(v, STATE.model), 'vcard');
  safeCall(()=>renderKPIs(v.kpis), 'kpis');
  safeCall(()=>renderInteractive(v), 'charts');
  safeCall(()=>renderPOMonthly(v.panels.po), 'poCum');
  safeCall(()=>renderLookAhead(v.panels.look), 'lookahead'); // operational as-of = today; horizon = user-selected calendar months (1/2/3/4/6, default 3)
  safeCall(()=>renderOverdueList(v.panels.overdue), 'ovlList'); // P1 — overdue measured against real TODAY
  safeCall(()=>renderBenchmark(), 'benchmark');
  safeCall(()=>updateStatusBar(v.status), 'statusBar');
  safeCall(()=>paintFilterArea(v), 'filterArea');
  safeCall(()=>paintWarnings(v), 'warnBtn');
  safeCall(()=>setupPanels(), 'panels');
  safeCall(()=>syncAllSplits(), 'split');
}

/* Active-filter strip inside the content zone (§3.1 data-shell="filter-area"). */
function paintFilterArea(v){
  const el=document.getElementById('filterArea'); if(!el) return;
  const chips=[];
  const cats=STATE.filter.cats;
  if(cats && cats.size) chips.push('<span class="fchip">'+esc(cats.size+' of '+v.catList.length+' categories')+'</span>');
  if(v.status.search){ const lab={all:'All columns',title:'Title',packageNo:'Package no.',discipline:'Discipline',itemCategory:'Item category',status:'Status'}[v.status.searchField]||'All columns'; chips.push('<span class="fchip">Search ('+esc(lab)+'): '+esc(v.status.search)+'</span>'); }
  el.innerHTML=chips.join('');
}

/* Warning toggle: the count is derived; the user controls visibility only. */
function paintWarnings(v){
  const n=(v.issues.banner||[]).length;
  const c=document.getElementById('warnCount'); if(c) c.textContent=String(n);
  const b=document.getElementById('warnBtn');
  if(b){ b.setAttribute('aria-pressed', String(!STATE.ui.warnHidden)); b.classList.toggle('active', n>0); }
}

/* Live status bar (MDL .status-bar equivalent): fixed bottom, navy, white text. */
function updateStatusBar(s){
  const bar=document.getElementById('statusBar'); if(!bar) return;
  bar.hidden=false;
  bar.innerHTML='<span>'+s.total+' packages</span>'
    +'<span>'+s.shown+' shown</span>'
    +'<span>'+s.started+' started ('+s.pct+'%)</span>'
    +'<span>As-of '+fmt(s.today)+'</span>'
    +'<span>Filter: '+s.filt+'</span>';
}

/* I-31 (Wave 2): split the former buildDashboard() into three single-purpose
   functions so the data layer (03) and logic layer (04) become unit-testable:
     parseWorkbook()  -> locate the PPP + Code sheets
     buildModel()     -> parse contract, map columns, read lookups, build packages
     buildDashboard() -> thin orchestrator: wire the view, validate, render */
export function buildDashboard(result, filename){
  const {model, vctx} = buildModel(result, filename);
  STATE.model = model;

  STATE.filter.cats=null;

  /* S3 boundary: a validation failure does NOT hide the dashboard (§3.8.2 rule 8). The system
     notice goes to #errBanner through the normal validation renderer and the page stays usable. */
  let report;
  try { report = validate(model.packages, vctx); }
  catch(err){
    console.error(err);
    report = { total:1, issues:[{ kind:'system', sev:'error', code:'VALIDATE', pkg:'—', field:'', value:'',
      msg:'Validation failed: '+err.message, desc:'', group:'', trigger:'' }] };
  }
  STATE.report = report;
  STATE.model.warnings = report.warnings || [];

  /* reveal ONLY after validation has run — no empty-dashboard flash */
  document.getElementById('welcome').style.display='none';
  const dashEl=document.getElementById('dash');
  dashEl.style.display='';
  dashEl.classList.remove('hidden');
  const werr=document.getElementById('welcomeErr'); if(werr) werr.hidden=true;
  const dashTitle=(vctx.codeMeta&&vctx.codeMeta['Dashboard Title'])?String(vctx.codeMeta['Dashboard Title']).trim():'';
  document.getElementById('projTitle').textContent=STATE.model.project.title||'—';
  document.getElementById('dashTitle').textContent=dashTitle;
  const ps=STATE.model.project.startDate;
  document.getElementById('metaLine').textContent=(STATE.model.project.client?STATE.model.project.client+' · ':'')+(STATE.model.project.code?STATE.model.project.code+' · ':'')+'Project start '+(ps&&!isNaN(ps)?fmt(ps):'—')+' · As-of '+fmt(todayMidnight());

  render();

  window.scrollTo(0,0);
}

function renderCodeMap(model){
  const ci=model.codeInfo||{}, LM=model.lookupMeta||{};
  const parts=[];
  parts.push('<b>Code sheet:</b> '+(ci.fieldCount||0)+' field mapping(s) read from A/B');
  parts.push(ci.hasTypes ? ('Data Type (C): '+ci.typeCount+' value(s)') : 'Data Type (C): <span class="ds-warn">empty — all fields default to Text</span>');
  /* I-11: report where the Error table was found, so the rule wording's origin
     is verifiable on screen just like the lookup blocks below. */
  parts.push(ci.errorCodeCol
    ? ('Error table: col '+(ci.errorDescCol||'?')+' · code col '+ci.errorCodeCol+' · '+ci.errorCount+' code(s)'+(ci.errorSeverityCol?' · sev col '+ci.errorSeverityCol:'')+(ci.errorGroupCol?' · group col '+ci.errorGroupCol:''))
    : 'Error table: <span class="ds-warn">not found</span>');
  /* Derived from lookupMeta itself — no hardcoded key list, so a block added or
     removed in one place (LOOKUP_HEADERS) shows up here automatically (I-49).
     Each block reports its description column AND its paired code column, with
     each column's OWN value count — a code column whose header exists but whose
     body is blank renders "(empty)" instead of silently borrowing the
     description column's count, which would claim data that is not in the sheet. */
  const lk=Object.values(LM).map(v=>{
    if(!v.col) return v.title+': <span class="ds-warn">not found</span>';
    let s=v.title+': col '+v.col+' ('+v.n+')';
    if(v.codeCol && v.codeCol!==v.col)
      s+=' · code col '+v.codeCol+(v.codeN ? ' ('+v.codeN+')' : ' <span class="ds-warn">(empty)</span>');
    return s;
  });
  return parts.join(' · ')+'<br>'+lk.join(' · ');
}
/* I-11: one line per rule code that appears in this report, showing the wording
   the business maintains in the Code sheet Error table (Code!Q:V).
   Deduplicated on purpose — the table below can legitimately list the same rule
   100+ times, so repeating the definition on every row would be pure noise.
   P2: the dedupe list comes from deriveView; this function only paints it. */
/* §4.5 rule reference: one row per fired rule code, never one card per rule. */
/* Spec 7.2.4: severity is one flat fixed-size icon per tier, on an inner span. */
function sevIcon(sev){
  const s=sev==='error'?'error':(sev==='warning'?'warning':'info');
  const label=s==='error'?'Error':(s==='warning'?'Warning':'Info');
  const shape = s==='error'
    ? '<circle cx="7" cy="7" r="6" fill="#C62828"/><path d="M4.3 4.3l5.4 5.4M9.7 4.3l-5.4 5.4" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>'
    : (s==='warning'
      ? '<path d="M7 1.4l6 11.2H1z" fill="#F9A825"/><path d="M7 5v4M7 10.6v1" stroke="#3a2a00" stroke-width="1.5" stroke-linecap="round"/>'
      : '<circle cx="7" cy="7" r="6" fill="#1E88E5"/><path d="M7 6v5M7 3.6v1" stroke="#fff" stroke-width="1.7" stroke-linecap="round"/>');
  return '<span class="sev sev-'+s+'"><svg class="sev-svg" width="14" height="14" viewBox="0 0 14 14" role="img" aria-label="'+label+'">'+shape+'</svg></span>';
}
function renderRuleRef(refs, data){
  const el=document.getElementById('vref'); if(!el) return;
  if(!refs.length){ el.innerHTML='<div class="empty">No rule fired.</div>'; return; }
  const n={}; (data||[]).forEach(i=>{ n[i.code]=(n[i.code]||0)+1; });
  el.innerHTML='<table class="ds-table"><colgroup><col style="width:52px"><col style="width:86px"><col style="width:18%"><col><col style="width:70px"></colgroup>'
    +'<thead><tr><th scope="col">Sev</th><th scope="col">Code</th>'
    +'<th scope="col">Group</th><th scope="col">Description</th><th scope="col" class="num">Count</th></tr></thead><tbody>'
    +refs.map(r=>'<tr><td>'+sevIcon(r.sev||'info')+'</td>'
      +'<td class="rulecell"'+(r.desc?' title="'+esc(r.desc)+'"':'')+'><code>'+esc(r.code)+'</code></td>'
      +'<td>'+esc(r.group||'—')+'</td>'
      +'<td>'+(r.desc?esc(r.desc):'<span class="ds-warn">not listed in the Error table — the dashboard\u2019s built-in wording is used</span>')+'</td>'
      +'<td class="num">'+(n[r.code]||0)+'</td></tr>').join('')+'</tbody></table>';
}
const VAL_COLS=[['value','Value'],['message','Message']];
function splitTable(cols, headRows, bodyRows){
  const cg='<colgroup>'+cols.map(c=>'<col'+(c.w?' style="width:'+c.w+'"':'')+'>').join('')+'</colgroup>';
  const fcg=cg.replace('</colgroup>','<col class="ds-gut" style="width:var(--ds-sbw,0px)"></colgroup>');
  const th=cols.map(c=>'<th scope="col"'+(c.num?' class="num"':'')+(c.align?' style="text-align:'+c.align+'"':'')+'>'+c.label+'</th>').join('');
  return '<div class="ds-split splitcard"><div class="vheadwrap"><table class="ds-table ds-head vheadtab">'+fcg
    +'<thead><tr>'+th+'<th class="ds-gut" aria-hidden="true"></th></tr></thead></table></div>'
    +'<div class="tableScroll"><table class="ds-table">'+cg+'<tbody>'+bodyRows+'</tbody></table></div></div>';
}
/* 7.2.15 (3,5,6) - ONE shared pairing helper: pin the fragment to the body width + scrollbar,
   give every data column the body's real width, hand the remainder to the gutter, keep
   --ds-sbw in sync with a ResizeObserver, and follow the body's horizontal scroll. */
function syncSplitTable(split){
  const hd=split.querySelector('table.ds-head'), sc=split.querySelector('.tableScroll');
  const port=split.querySelector('.vheadwrap');
  if(!hd||!sc||!port) return;
  const bt=sc.querySelector('table.ds-table'); if(!bt) return;
  const bw=bt.offsetWidth||sc.clientWidth, sb=Math.max(0,sc.offsetWidth-sc.clientWidth);
  hd.style.setProperty('--ds-sbw',sb+'px');
  hd.style.width=(bw+sb)+'px';
  const cols=[...hd.querySelectorAll('colgroup col')];
  const gut=cols.length&&cols[cols.length-1].classList.contains('ds-gut')?cols.pop():null;
  const row=[...bt.querySelectorAll('tbody tr')].find(r=>r.children.length>1);
  const cells=row?[...row.children]:[];
  let sum=0;
  cols.forEach((c,i)=>{ const w=cells[i]?cells[i].getBoundingClientRect().width:parseFloat(c.style.width); if(w>0){ c.style.width=w+'px'; sum+=w; } });
  if(gut) gut.style.width=Math.max(0,(bw+sb)-sum)+'px';
  if(port.scrollLeft!==sc.scrollLeft) port.scrollLeft=sc.scrollLeft;
}
function syncAllSplits(){
  document.querySelectorAll('.ds-split.splitcard').forEach(sp=>{
    syncSplitTable(sp);
    if(sp.__ro) return;
    const sc=sp.querySelector('.tableScroll'); if(!sc) return;
    const run=()=>{ try{ syncSplitTable(sp); }catch(e){} };
    try{ if(typeof ResizeObserver==='function'){ sp.__ro=new ResizeObserver(run); sp.__ro.observe(sc); } }catch(e){}
    sc.addEventListener('scroll',()=>{ const port=sp.querySelector('.vheadwrap'); if(port) port.scrollLeft=sc.scrollLeft; },{passive:true});
  });
}
function renderValidation(view, model){
  const iss=view.issues;
  document.getElementById('vmap').innerHTML = renderCodeMap(model);
  renderRuleRef(iss.refs, iss.data);
  const dc=iss.counts;
  const n=document.getElementById('vcount'); if(n) n.textContent=(iss.total||0)+' issues';
  document.getElementById('vchips').innerHTML =
    (dc.error?'<span class="vchip e">'+dc.error+' Error'+(dc.error>1?'s':'')+'</span>':'')+
    (dc.warning?'<span class="vchip w">'+dc.warning+' Warning'+(dc.warning>1?'s':'')+'</span>':'')+
    (dc.info?'<span class="vchip i">'+dc.info+' Info</span>':'')+
    (iss.total?'':'<span class="vchip ok">No issues</span>');
  const sb=document.getElementById('errBanner');
  if(sb){
    if(iss.banner.length){
      sb.innerHTML=iss.banner.map(i=>{
        const fatal=(i.level==='fatal'||i.sev==='error');
        const cls=fatal?'fatal':(i.sev==='info'?'info':'warn');
        const ic=fatal?'⛔':(i.sev==='info'?'ℹ️':'⚠️');
        return '<div class="sys-banner-item '+cls+'">'+ic+' <b>'+esc(i.code||'SYSTEM')+'</b> '+esc(i.msg||i.message||'')+'</div>';
      }).join('');
      openBanner(sb,'dash');
      sb.classList.toggle('hidden', !!STATE.ui.warnHidden);
    } else { closeBanner(sb); }
  }
  const rows=iss.data;
  const cols=[{label:'Sev',w:'6%'},{label:'Rule',w:'12%'},{label:'Package',w:'24%'},{label:'Field',w:'14%'}]
    .concat(STATE.ui.valCols.value?[{label:'Value',w:'12%'}]:[])
    .concat(STATE.ui.valCols.message?[{label:'Message'}]:[]);
  const body=rows.map(i=>'<tr><td>'+sevIcon(i.sev)+'</td>'
    +'<td class="rulecell"'+(i.desc?' title="'+esc(i.desc)+'"':'')+'>'+esc(i.code)+'</td>'
    +'<td>'+esc(trunc(i.pkg,28))+'</td><td>'+esc(i.field)+'</td>'
    +(STATE.ui.valCols.value?'<td>'+esc(trunc(i.value,26))+'</td>':'')
    +(STATE.ui.valCols.message?'<td>'+esc(i.msg)+'</td>':'')+'</tr>').join('');
  document.getElementById('vtable').innerHTML=rows.length?splitTable(cols, null, body):'<div class="empty">No data issues.</div>';
  const sub=document.getElementById('vsub');
  if(sub) sub.textContent=rows.length+' rows';
}

/* ============== charts ============== */
const PIE_COLORS=['#1E88E5','#2E7D32','#F9A825','#C62828','#64748B','#7E57C2','#26A69A','#EC407A','#8D6E63','#42A5F5','#9CCC65','#FF7043'];
/* Chart geometry + colour palette (I-35 / I-34). Centralised so a dimension
   or colour is changed in one place. Colours stay literal hex (not CSS vars)
   because the chart SVG is serialised to a PNG, where document CSS custom
   properties do not resolve. */
export const CHART = {
  W:760, RW:46, padT:12, RH:30, BH:18,
  pie:{ R:100, r:58, cx:130, legendX:290, rowH:24, topN:8 },
  group:{ h:280, padL:34, padR:10, padT:18, padB:48 },
  ink:'#0F2D52', muted:'#64748B', grey:'#B8C2CC', accent:'#1E88E5',
  accentDark:'#0b2240', goodDark:'#2E7D32',
  axis:'#D9E1E8', grid:'#EDF1F5', white:'#FFFFFF'
};
/* The METRICS registry + renderCat + svgStage were replaced by the interactive
   breakdown panel (INTER_BREAK / renderInteractive) — see above. The shared
   providers (statusItems, critItems, tallyItems) and chart helpers (svgHBar,
   svgPie) are still used by that panel. */

function tally(pkgs, field){ const m={}; pkgs.forEach(p=>{ const v=p[field]; if(v==null||String(v).trim()==='') return; m[v]=(m[v]||0)+1; }); return m; }
function tallyBy(pkgs, fn){ const m={}; pkgs.forEach(p=>{ const v=fn(p); if(v==null||String(v).trim()==='') return; const k=String(v); m[k]=(m[k]||0)+1; }); return m; }
function tallyItems(pkgs, field, opts={}){
  const t=tally(pkgs,field);
  let list=Object.entries(t);
  if(opts.order) list=opts.order.filter(k=>t[k]!=null).map(k=>[k,t[k]]);
  else if(opts.sort) list.sort((a,b)=>b[1]-a[1]);
  return list.map(([k,v])=>({label:(opts.label&&opts.label[k])?opts.label[k]:(k==='(blank)'&&opts.blankLabel?opts.blankLabel:k), value:v}));
}
export function svgHBar(items, opts={}){
  const W=CHART.W, RW=CHART.RW, padT=CHART.padT, RH=CHART.RH, BH=CHART.BH;
  const maxLen=Math.max(8,...items.map(i=>String(i.label).length));
  const LW=opts.LW||Math.min(360, Math.max(160, maxLen*7+16));
  const H=padT+items.length*RH+8;
  const maxV=Math.max(1,...items.map(i=>i.value));
  const plotX=LW, plotW=W-LW-RW;
  const id=opts.svgId||('svg-'+Math.random().toString(36).slice(2));
  let s='<svg id="'+id+'" role="img" aria-label="'+esc(opts.ariaLabel||'bar chart')+'" xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" style="width:100%;height:'+H+'px;display:block">';
  items.forEach((it,idx)=>{
    const y=padT+idx*RH; const bw=Math.max(2,(it.value/maxV)*plotW);
    /* Each bar gets its OWN categorical colour, drawn from the same palette (and the same
       position indexing) the pie uses, so a category keeps one colour across bar ↔ pie.
       A semantic per-item colour (e.g. status counts) still overrides the palette. */
    const col=it.color||PIE_COLORS[idx%PIE_COLORS.length];
    const maxChars=Math.floor((LW-16)/7);
    const tot=items.reduce((a,b)=>a+b.value,0)||0;
    const share=tot?Math.round(it.value/tot*100):0;
    const tip='<div class="tt-h">'+esc(it.label)+'</div><div class="tt-r"><span><span class="tt-sw" style="background:'+col+'"></span>'+esc(opts.unit||'Packages')+'</span><b>'+it.value+'</b></div><div class="tt-f"><span>Total '+tot+'</span><b>'+share+'%</b></div>';
    s+='<rect x="'+plotX+'" y="'+y+'" width="'+plotW+'" height="'+RH+'" fill="transparent" data-tip="'+esc(tip)+'"/>';
    s+='<text x="'+(LW-10)+'" y="'+(y+BH-4)+'" text-anchor="end" fill="'+CHART.ink+'" style="font-size:13px" data-tip="'+esc(tip)+'">'+esc(trunc(it.label,maxChars))+'</text>';
    s+='<rect x="'+plotX+'" y="'+y+'" width="'+bw+'" height="'+BH+'" rx="4" fill="'+col+'" data-label="'+esc(it.label)+'" data-value="'+it.value+'" data-tip="'+esc(tip)+'"/>';
    s+='<text x="'+(plotX+bw+8)+'" y="'+(y+BH-4)+'" fill="'+CHART.muted+'" style="font-size:13px" data-tip="'+esc(tip)+'">'+it.value+'</text>';
  });
  return s+'</svg>';
}
function polar(cx,cy,r,a){ return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; }
function donutPath(cx,cy,R,r,a0,a1){
  const large=(a1-a0)>Math.PI?1:0;
  const p0=polar(cx,cy,R,a0), p1=polar(cx,cy,R,a1), p2=polar(cx,cy,r,a1), p3=polar(cx,cy,r,a0);
  return 'M'+p0[0].toFixed(2)+' '+p0[1].toFixed(2)+' A'+R+' '+R+' 0 '+large+' 1 '+p1[0].toFixed(2)+' '+p1[1].toFixed(2)+
         ' L'+p2[0].toFixed(2)+' '+p2[1].toFixed(2)+' A'+r+' '+r+' 0 '+large+' 0 '+p3[0].toFixed(2)+' '+p3[1].toFixed(2)+' Z';
}
/* I-26: `topN` collapses the tail into one grey slice. The merged slice now
   carries the labels it swallowed, because otherwise the pie *deletes* them —
   the reader sees "Other (2 categories)" and cannot tell which two.
   `otherLabels` is rendered as a tooltip in svgPie(); the visible label text is
   deliberately left alone (any copy change is a separate approval). */
export function topN(items,n){
  if(items.length<=n) return items.slice();
  const sorted=items.slice().sort((a,b)=>b.value-a.value);
  const top=sorted.slice(0,n), rest=sorted.slice(n);
  const otherVal=rest.reduce((s,i)=>s+i.value,0);
  const out=top.slice();
  if(otherVal>0) out.push({label:'Other ('+rest.length+' categories)',value:otherVal,color:CHART.grey,otherLabels:rest.map(i=>i.label)});
  return out;
}
export function svgPie(items, opts={}){
  const W=CHART.W;
  /* I-26: the slice cap is a token now (was a literal 8 buried here), so raising
     or lowering it is one edit in CHART. The cap is a LEGIBILITY limit, not a
     data limit — the bar chart shows every value; the pie answers "who are the
     big ones". The trailing `.filter(i=>i.value>0)` that used to follow topN()
     was a no-op: every input already passed the filter above, and topN() only
     appends "Other" when its sum is > 0. Removed rather than left in place as a
     decoration that reads like a guarantee. */
  const data=topN(items.filter(i=>i.value>0),CHART.pie.topN);
  const total=data.reduce((s,i)=>s+i.value,0);
  if(!total) return '<div class="empty">No data to chart.</div>';
  const R=CHART.pie.R, r=CHART.pie.r, cx=CHART.pie.cx, legendX=CHART.pie.legendX, rowH=CHART.pie.rowH;
  const H=Math.max(230, 24+data.length*rowH+20);
  const cy=H/2;
  const id=opts.svgId||('svg-'+Math.random().toString(36).slice(2));
  let s='<svg id="'+id+'" role="img" aria-label="'+esc(opts.ariaLabel||'pie chart')+'" xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" style="width:100%;height:'+H+'px;display:block">';
  let a0=-Math.PI/2;
  data.forEach((it,i)=>{
    const frac=it.value/total; const a1=a0+frac*Math.PI*2;
    const col=it.color||PIE_COLORS[i%PIE_COLORS.length];
    /* I-26: a merged slice lists what it swallowed, so the collapse is never
       silent. The visible legend text is still `it.label` — unchanged copy. */
    const ttl=it.label+(it.otherLabels&&it.otherLabels.length?' — '+it.otherLabels.join(', '):'');
    const d = frac>=0.9999 ? (donutPath(cx,cy,R,r,a0,a0+Math.PI)+' '+donutPath(cx,cy,R,r,a0+Math.PI,a0+Math.PI*2)) : donutPath(cx,cy,R,r,a0,a1);
    const tip='<div class="tt-h">'+esc(ttl)+'</div><div class="tt-r"><span><span class="tt-sw" style="background:'+col+'"></span>'+esc(opts.unit||'Packages')+'</span><b>'+it.value+'</b></div><div class="tt-f"><span>Total '+total+'</span><b>'+Math.round(frac*100)+'%</b></div>';
    s+='<path d="'+d+'" fill="'+col+'" stroke="'+CHART.white+'" stroke-width="1.5" data-label="'+esc(it.label)+'" data-value="'+it.value+'" data-tip="'+esc(tip)+'"/>';
    a0=a1;
  });
  s+='<text x="'+cx+'" y="'+(cy-3)+'" text-anchor="middle" fill="'+CHART.ink+'" style="font-size:26px;font-weight:700">'+total+'</text>';
  s+='<text x="'+cx+'" y="'+(cy+15)+'" text-anchor="middle" fill="'+CHART.muted+'" style="font-size:13px">packages</text>';
  data.forEach((it,i)=>{
    const y=24+i*rowH; const col=it.color||PIE_COLORS[i%PIE_COLORS.length];
    const ttl=it.label+(it.otherLabels&&it.otherLabels.length?' — '+it.otherLabels.join(', '):'');
    const share=Math.round(it.value/total*100);
    const tip='<div class="tt-h">'+esc(ttl)+'</div><div class="tt-r"><span><span class="tt-sw" style="background:'+col+'"></span>'+esc(opts.unit||'Packages')+'</span><b>'+it.value+'</b></div><div class="tt-f"><span>Total '+total+'</span><b>'+share+'%</b></div>';
    s+='<rect x="'+legendX+'" y="'+(y-9)+'" width="11" height="11" rx="2.5" fill="'+col+'" data-tip="'+esc(tip)+'"/>';
    s+='<text x="'+(legendX+18)+'" y="'+y+'" fill="'+CHART.ink+'" style="font-size:14px" data-tip="'+esc(tip)+'">'+esc(trunc(it.label,32))+'</text>';
    s+='<text x="'+(W-10)+'" y="'+y+'" text-anchor="end" fill="'+CHART.muted+'" style="font-size:14px">'+it.value+' · '+Math.round(it.value/total*100)+'%</text>';
  });
  return s+'</svg>';
}
function svgGrouped(cats, opts, series, lines){
  const id=opts&&opts.svgId?opts.svgId:('svg-'+Math.random().toString(36).slice(2));
  const w=Math.max(380, cats.length*64+50), h=CHART.group.h, padL=CHART.group.padL, padR=CHART.group.padR, padT=CHART.group.padT, padB=CHART.group.padB;
  const plotW=w-padL-padR, plotH=h-padT-padB;
  const maxV=Math.max(1,...series.flatMap(s=>s.values),...(lines||[]).flatMap(l=>l.values));
  let s='<svg id="'+id+'" role="img" aria-label="'+esc((opts&&opts.ariaLabel)||'chart')+'" xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" style="width:100%;height:'+h+'px;display:block">';
  s+='<line x1="'+padL+'" y1="'+padT+'" x2="'+padL+'" y2="'+(padT+plotH)+'" stroke="'+CHART.axis+'"/>';
  s+='<line x1="'+padL+'" y1="'+(padT+plotH)+'" x2="'+(w-padR)+'" y2="'+(padT+plotH)+'" stroke="'+CHART.axis+'"/>';
  for(let i=0;i<=4;i++){ const v=Math.round(maxV*i/4), y=padT+plotH-(v/maxV)*plotH; s+='<text x="'+(padL-6)+'" y="'+(y+3)+'" text-anchor="end" fill="'+CHART.muted+'" style="font-size:13px">'+v+'</text><line x1="'+padL+'" y1="'+y+'" x2="'+(w-padR)+'" y2="'+y+'" stroke="'+CHART.grid+'"/>'; }
  const gw=plotW/cats.length, n=series.length, bw=Math.min(18,(gw*0.66)/n);
  cats.forEach((c,ci)=>{ const gx=padL+ci*gw+gw/2; series.forEach((ser,si)=>{ const v=ser.values[ci], bh=(v/maxV)*plotH, x=gx-(n*bw)/2+si*bw, y=padT+plotH-bh;
    s+='<rect x="'+x+'" y="'+y+'" width="'+(bw-2)+'" height="'+bh+'" fill="'+ser.color+'" rx="2"><title>'+esc(c)+': '+ser.name+' = '+v+'</title></rect>'; });
    s+='<text x="'+gx+'" y="'+(padT+plotH+15)+'" text-anchor="middle" fill="'+CHART.muted+'" style="font-size:13px">'+esc(c)+'</text>'; });
  /* overlay lines */
  if(lines&&lines.length){
    lines.forEach(line=>{
      const pts=line.values.map((v,ci)=>{ const gx=padL+ci*gw+gw/2; const y=padT+plotH-(v/maxV)*plotH; return gx+','+y; });
      if(pts.length>1) s+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="'+line.color+'" stroke-width="2" stroke-dasharray="'+(line.dash||'')+'" stroke-linejoin="round" stroke-linecap="round"/>';
      pts.forEach((pt,ci)=>{ const [cx2,cy2]=pt.split(','); s+='<circle cx="'+cx2+'" cy="'+cy2+'" r="3" fill="'+line.color+'"><title>'+esc(cats[ci])+': '+line.name+' = '+line.values[ci]+'</title></circle>'; });
    });
  }
  let lx=padL;
  series.forEach(ser=>{ s+='<rect x="'+lx+'" y="'+(h-12)+'" width="10" height="10" fill="'+ser.color+'" rx="2"/><text x="'+(lx+14)+'" y="'+(h-3)+'" fill="'+CHART.ink+'" style="font-size:13px">'+ser.name+'</text>'; lx+=14+ser.name.length*6+18; });
  if(lines&&lines.length) lines.forEach(line=>{ s+='<line x1="'+lx+'" y1="'+(h-7)+'" x2="'+(lx+16)+'" y2="'+(h-7)+'" stroke="'+line.color+'" stroke-width="2" stroke-dasharray="'+(line.dash||'')+'"/><text x="'+(lx+20)+'" y="'+(h-3)+'" fill="'+CHART.ink+'" style="font-size:13px">'+line.name+'</text>'; lx+=20+line.name.length*6+18; });
  return s+'</svg>';
}

/* ============== Interactive chart panel ==============
   One panel replaces the 5 per-category metric cards + Stage Coverage.
   Pick a breakdown from the dropdown, toggle bar/pie **per card** via
   getPref('inter-<id>') — each chart keeps its own chart type. Card A = Packages (full breakdown list incl.
   Stage Overdue / Schedule Health, both built on the shared stageIsOverdue());
   Card B = Data Quality (by Rule / Package / Discipline). */
const INTER_BREAK = {
  packages: [
    ['status','Status'], ['discipline','Discipline'], ['itemCategory','Item Category'],
    ['criticality','Criticality'], ['engineer','Engineer'],
    ['supplierBuyerPE','Supplier / Buyer / PE'],
    ['stageOverdue','Stage Overdue'], ['scheduleHealth','Schedule Health']
  ],
  data: [
    ['dqByRule','By Rule'], ['dqByPackage','By Package'], ['dqByDiscipline','By Discipline']
  ]
};

/* Items come from the derived view — every breakdown is already computed once in deriveView. */
function interItems(view, card, name){
  const pack=view.panels.interactive[card]||{};
  return pack[name]||[];
}
function interCardBody(view, card, name, mode, svgId){
  const items=interItems(view, card, name);
  if(!items.length) return '<div class="empty">No data for this breakdown.</div>';
  /* No separate HTML legend: bar and pie both label each slice / bar directly inside the SVG,
     so an extra legend below the chart just duplicates it. */
  const unit=(card==='data')?'Issues':'Packages';
  const first='<div class="tt-h">'+esc(name)+'</div><div class="tt-r"><span>'+items.length+' categories</span><b>'+items.reduce((a,b)=>a+b.value,0)+' '+unit.toLowerCase()+'</b></div>';
  return '<div class="chartwrap" tabindex="0" role="group" aria-label="'+esc(name)+' chart; focus or hover a point for detail" data-tip-first="'+esc(first)+'">'
    + (mode==='pie' ? svgPie(items,{svgId, ariaLabel:name+' distribution — pie', unit}) : svgHBar(items,{svgId, ariaLabel:name+' distribution — bar', unit}))
    + '</div>';
}
function supplierBuyerPEItems(pkgs){
  const m={};
  pkgs.forEach(p=>['supplier','buyer','pe'].forEach(f=>{ const v=p[f]; if(v!=null&&String(v).trim()!==''){ const k=String(v).trim(); m[k]=(m[k]||0)+1; } }));
  return Object.entries(m).map(([k,v])=>({label:k,value:v})).sort((a,b)=>b.value-a.value);
}
function stageOverdueItems(pkgs, today){
  return STAGES.map(([k,,lab])=>({label:lab, value:pkgs.filter(p=>stageIsOverdue(p,k,today)).length, color:'#C62828'}));
}
function scheduleHealth(p, today){
  if(STAGES.some(([k])=>stageIsOverdue(p,k,today))) return 'Overdue';
  const atRisk=STAGES.some(([k])=>{
    const f=p[k+'Forecast'], pl=p[k+'Plan'];
    if(f&&pl&&f>pl) return true;
    const due=stageDue(p,k);
    return !!(due && (due-today)>=0 && (due-today)<=30*86400000);
  });
  return atRisk ? 'At-risk' : 'On-track';
}
function scheduleHealthItems(pkgs, today){
  const t={'On-track':0,'At-risk':0,'Overdue':0};
  pkgs.forEach(p=>{ t[scheduleHealth(p,today)]++; });
  const col={'On-track':'#2E7D32','At-risk':'#F9A825','Overdue':'#C62828'};
  return ['On-track','At-risk','Overdue'].map(k=>({label:k,value:t[k],color:col[k]}));
}
function dqByRuleItems(model, report){
  const iss=(report&&report.issues)||[];
  const m={}; iss.forEach(i=>{ const k=i.code||'(none)'; m[k]=(m[k]||0)+1; });
  return Object.entries(m).map(([k,v])=>({label:k,value:v})).sort((a,b)=>b.value-a.value);
}
function dqByPackageItems(model, report){
  const iss=(report&&report.issues)||[];
  const byId=Object.fromEntries(model.packages.map(p=>[p.id,p]));
  const m={}; iss.forEach(i=>{ if(i.pkg!=null&&i.pkg!=='—'){ m[i.pkg]=(m[i.pkg]||0)+1; } });
  let list=Object.entries(m).map(([id,v])=>({label:(byId[id]&&byId[id].title)||('pkg '+id), value:v})).sort((a,b)=>b.value-a.value);
  if(list.length>20) list=list.slice(0,20);
  return list;
}
function dqByDisciplineItems(model, report){
  const iss=(report&&report.issues)||[];
  const byId=Object.fromEntries(model.packages.map(p=>[p.id,p.discipline||'(blank)']));
  const m={}; iss.forEach(i=>{ if(i.pkg!=null&&i.pkg!=='—'){ const d=byId[i.pkg]||'(unknown)'; m[d]=(m[d]||0)+1; } });
  return Object.entries(m).map(([k,v])=>({label:k,value:v})).sort((a,b)=>b.value-a.value);
}
/* Panel 2 = "Interactive Chart": a bordered panel that owns the shared controls
   (Help ?, Collapse −/+), exactly like MDL, while each chart card inside keeps only its
   own controls (breakdown select, per-card Bar/Pie, Copy image, Download PNG).
   The collapsed flag is carried as a class on #charts itself, which is NOT replaced when
   renderInteractive() rewrites the innerHTML — so collapse survives every filter change. */
function renderInteractive(view){
  const host=document.getElementById('charts'); if(!host) return;
  const cards=[
    {id:'packages', title:'Packages',     breaks:INTER_BREAK.packages, view:STATE.chartView.packages, svgId:'svg-inter-pkg',  bodyId:'inter-body-pkg'},
    {id:'data',     title:'Data Quality', breaks:INTER_BREAK.data,     view:STATE.chartView.data,     svgId:'svg-inter-data', bodyId:'inter-body-data'}
  ];
  /* §4 / §4.1: the panel head owns Help + Collapse; each chart card owns its own controls,
     right-aligned above its plot. */
  const head='<div class="panel-head"><h2>Interactive Chart</h2><div class="panel-actions"></div></div>';
  host.innerHTML = head + '<div class="grid">' + cards.map(c=>{
    /* I-58: chart type is stored PER CARD (`inter-<id>`) so switching one chart no longer
       flips every other chart on the page. */
    const mode=getPref('inter-'+c.id);
    const sel='<select class="inter-sel" data-card="'+c.id+'" aria-label="'+c.title+' breakdown dimension">'
      + c.breaks.map(([k,l])=>'<option value="'+k+'"'+(k===c.view?' selected':'')+'>'+l+'</option>').join('')
      + '</select>';
    const seg='<div class="seg" data-key="inter-'+c.id+'" role="group" aria-label="'+c.title+' chart type">'
      + '<button type="button" data-t="bar" class="'+(mode==='bar'?'on':'')+'" aria-pressed="'+(mode==='bar')+'">Bar</button>'
      + '<button type="button" data-t="pie" class="'+(mode==='pie'?'on':'')+'" aria-pressed="'+(mode==='pie')+'">Pie</button></div>';
    const tools='<div class="table-tools">'+sel+seg
      + '<button type="button" class="btn-secondary" data-svg="'+c.svgId+'" data-act="dl">⤓ PNG</button>'
      + '<button type="button" class="btn-secondary" data-svg="'+c.svgId+'" data-act="copy">⧉ Copy</button></div>';
    return '<section class="c-card" data-card="'+c.id+'">'
      + '<div class="table-head"><h3 class="tt">'+c.title+'</h3>'+tools+'</div>'
      + '<div class="inter-body" id="'+c.bodyId+'">'+interCardBody(view,c.id,c.view,mode,c.svgId)+'</div>'
      + '</section>';
  }).join('') + '</div>';
  document.querySelectorAll('#charts .inter-sel').forEach(sel=>{
    sel.addEventListener('change',()=>{ const card=sel.getAttribute('data-card'); STATE.chartView[card]=sel.value; render(); });
  });
}

/* ---- categorical providers ---- */
function statusItems(pkgs, model){
  const L=model.lookups||{};
  const descs=(L.status||[]).map(s=>String(s).trim());
  const canon=model.statusCanon||(v=>String(v==null?'':v));
  const t=tally(pkgs,'status');
  const items=[], used=new Set();
  if(descs.length){
    descs.forEach(d=>{
      let n=0;
      Object.entries(t).forEach(([k,v])=>{ if(canon(k)===d){ n+=v; used.add(k); } });
      items.push({label:d,value:n});
    });
  }
  Object.entries(t).forEach(([k,v])=>{
    if(used.has(k)) return;
    if(k==='(blank)'){ items.push({label:'Not Specified (blank)',value:v,color:CHART.grey}); return; }
    items.push({label:canon(k)||k, value:v});
  });
  return items;
}
function critItems(pkgs, model){
  const L=model.lookups||{};
  const codes=(L.criticalityCode||[]).map(s=>String(s).trim());
  const descs=(L.criticality||[]).map(s=>String(s).trim());
  const keys=codes.length?codes:['0','1','2','3','4'];
  const fb={'0':'Not Applicable','1':'Factory In-house QC','2':'Third Party Inspection','3':'Witness Point','4':'FAT Record Submission'};
  const known=new Set(keys);
  /* I-55: match against BOTH the code (e.g. "2") AND the description (e.g.
     "Third Party Inspection"). Workbooks that store descriptions in column I
     were previously falling into "not in Code list" or blank, making the chart
     silently wrong. Same dual-match pattern as statusItems(). */
  const descSet=new Set(descs.map(d=>d.toLowerCase()));
  const items=keys.map((k,i)=>{
    const d=descs[i]||fb[k]||'';
    const dLower=d.toLowerCase();
    return {label:k+(d?' — '+trunc(d,38):''), value:pkgs.filter(p=>{
      const v=String(p.criticality==null?'':p.criticality).trim();
      return v===k || (dLower && v.toLowerCase()===dLower);
    }).length};
  });
  const extra={};
  pkgs.forEach(p=>{ const v=p.criticality; if(v==null||v==='') return; const s=String(v).trim(); if(!known.has(s) && !descSet.has(s.toLowerCase())) extra[s]=(extra[s]||0)+1; });
  Object.entries(extra).forEach(([k,v])=>items.push({label:k+' (not in Code list)',value:v,color:'#F9A825'}));
  return items;
}
function leadStats(pkgs){
  const vals=pkgs.map(p=>p.leadTime).filter(v=>v!=null&&!isNaN(v)).map(Number);
  const avg=vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0;
  return {vals,avg,withN:vals.length,blankN:pkgs.length-vals.length};
}
function leadItems(pkgs, mode){
  const st=leadStats(pkgs);
  const b={le90:0,b91_180:0,b181_270:0,gt270:0};
  st.vals.forEach(v=>{ if(v<=90)b.le90++; else if(v<=180)b.b91_180++; else if(v<=270)b.b181_270++; else b.gt270++; });
  const buckets=[{label:'≤ 90 days',value:b.le90},{label:'91 – 180 days',value:b.b91_180},{label:'181 – 270 days',value:b.b181_270},{label:'> 270 days',value:b.gt270}];
  if(mode==='pie') return buckets;
  return [{label:'Estimated',value:st.withN},{label:'Not estimated',value:st.blankN,color:'#B8C2CC'}].concat(buckets);
}
/* renderCat() and svgStage() were removed with the per-category metric cards;
   the interactive panel (renderInteractive) now owns all categorical charts. */

/* ============== KPI / tables ============== */
/* Paint-only: the six cards and their status classes come from deriveView. Spec §5: two lines,
   no sub-line, no inline colour — the status class carries the 3 px top strip. */
function tipForKPI(k){
  const rows='<div class="tt-r"><span>Value</span><b>'+esc(k.v)+'</b></div>'
    +'<div class="tt-r"><span>Of packages</span><b>'+k.n+' of '+k.den+'</b></div>'
    +'<div class="tt-f"><span>Share</span><b>'+k.pct+'%</b></div>';
  return '<div class="tt-h">'+esc(k.l)+'</div>'+rows+'<div class="tt-r" style="margin-top:4px"><span>'+esc(k.def)+'</span></div>';
}
/* Spec 4.6: ONE floating detail window for chart points and KPI cards. The binder is
   delegated, shows the payload only when the active datum changes, and never re-renders per move. */
let tipEl=null, tipKey=null;
function ensureTip(){
  if(!tipEl){
    tipEl=document.createElement('div'); tipEl.className='chart-tip'; tipEl.setAttribute('role','tooltip');
    (document.body||document.documentElement).appendChild(tipEl);
  }
  return tipEl;
}
function showTip(html,left,top){
  const el=ensureTip();
  if(tipKey!==html){ el.innerHTML=html; tipKey=html; }
  el.classList.add('show');
  const w=el.offsetWidth, h=el.offsetHeight;
  let x=left, y=top;
  if(x+w>window.innerWidth-4) x=window.innerWidth-4-w;
  if(y+h>window.innerHeight-4) y=top-h-28;
  if(x<4) x=4; if(y<4) y=4;
  el.style.left=x+'px'; el.style.top=y+'px';
}
function hideTip(){ if(tipEl) tipEl.classList.remove('show'); }
/* Spec 4.6 snap line: one dashed vertical line in the hovered chart, moved to the datum. */
function setSnap(node, x){
  const svg=node&&node.closest?node.closest('svg'):null;
  const ln=svg?svg.querySelector('.chart-snap'):null;
  if(!ln) return;
  if(x==null){ ln.style.display='none'; return; }
  ln.setAttribute('x1',x); ln.setAttribute('x2',x);
  ln.style.display='';
}
function initTips(){
  const node=e=>e.target&&e.target.closest?e.target.closest('[data-tip]'):null;
  document.addEventListener('pointermove',e=>{
    const t=node(e); if(!t||e.pointerType==='touch') return;
    showTip(t.getAttribute('data-tip'),e.clientX+14,e.clientY+14);
    setSnap(t,t.getAttribute('data-snap'));
  },{passive:true});
  document.addEventListener('pointerout',e=>{
    const t=node(e); if(!t) return;
    if(e.relatedTarget&&t.contains(e.relatedTarget)) return;
    hideTip(); setSnap(t,null);
  });
  document.addEventListener('pointerdown',e=>{
    const t=node(e);
    if(t){ showTip(t.getAttribute('data-tip'),e.clientX+14,e.clientY+14); setSnap(t,t.getAttribute('data-snap')); }
    else hideTip();
  });
  document.addEventListener('focusin',e=>{
    const t=e.target&&e.target.closest?(e.target.closest('[data-tip-first]')||e.target.closest('[data-tip]')):null;
    if(t){ const b=t.getBoundingClientRect(); showTip(t.getAttribute('data-tip-first')||t.getAttribute('data-tip'),b.left,b.bottom+6); }
  });
  document.addEventListener('focusout',()=>{ hideTip(); document.querySelectorAll('.chart-snap').forEach(l=>{ l.style.display='none'; }); });
  window.addEventListener('scroll',()=>{ hideTip(); document.querySelectorAll('.chart-snap').forEach(l=>{ l.style.display='none'; }); },true);
}
function renderKPIs(kpis){
  document.getElementById('kpis').innerHTML=kpis.map(k=>'<div class="kpi'+(k.c?' '+k.c:'')+'" tabindex="0" role="group" aria-label="'+esc(k.l)+': '+esc(k.v)+'" data-tip="'+esc(tipForKPI(k))+'"><div class="v">'+k.v+'</div><div class="l">'+k.l+'</div></div>').join('');
}
/* S-Curve panel (mirrors MDL renderCurvePanel): two side-by-side charts —
   cumulative S-curve + monthly bars — over a project-start-anchored month
   range whose end = last PO date + 3 months. Project start (Code!Project Start Date)
   = red dashed vertical line; today = grey line.
   Operational "as-of" is the current date, not the project start date.
   P2: the month domain, the counts and the period window are computed in deriveView; this
   module keeps only the paint step and the slider wiring. */
function ym(d){ return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0'); }
function mLabel(ymStr){ const a=ymStr.split('-'); return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][(+a[1])-1]+" '"+a[0].slice(2); }

function renderPOMonthly(po){
  if(!po){
    document.getElementById('poChart').innerHTML='<div class="empty">PO dates are not stored as Excel dates in this file. Update the PO Plan / Forecast / Actual columns to real dates, then reload.</div>';
    document.getElementById('poProjNote').textContent='';
    document.getElementById('poWinMsg').textContent='';
    return;
  }
  const n=po.months.length;
  const wf=document.querySelector('#poWin .wf'), wt=document.querySelector('#poWin .wt');
  if(wf){ wf.min=0; wf.max=n-1; wf.value=po.window.from; }
  if(wt){ wt.min=0; wt.max=n-1; wt.value=po.window.to; }
  const note=document.getElementById('poProjNote');
  if(note) note.innerHTML = po.projStart ? ('Project start: <b>'+esc(po.projStartLabel)+'</b> &middot; red dashed line = project start, grey line = today') : 'Grey line = today';
  drawPPSCurve();
}
/* Panel 3 = ONE combined chart sharing a single time axis AND a single y-scale: monthly BARS
   (that month's count) + cumulative S-curve LINES (running total) are plotted against the same
   numbers, so a bar and a curve point with equal value sit at the same height. All three series
   are ALWAYS drawn: when a package has no Forecast date the data already falls back to the Plan
   date, so Forecast can never be "missing" — it mirrors Plan when the column is blank. */
function svgPoCombo(P,a,b,opts){
  const showBars=STATE.prefs.poBars;
  const cats=P.months.slice(a,b+1), m=cats.length;
  if(m<=0) return '<div class="empty">No months in range.</div>';
  const h=CHART.group.h+34, padL=CHART.group.padL, padR=18, padT=CHART.group.padT, padB=CHART.group.padB;
  /* 3.4.1: follow the host width, never a first-render width. 320 px is the floor. */
  const w=Math.max(320, Math.floor((opts&&opts.w)||Math.max(440, m*64+padL+padR))), plotW=w-padL-padR, plotH=h-padT-padB;
  /* All three series are ALWAYS drawn: when a package has no Forecast date the data already
     falls back to the Plan date, so Forecast can never be "missing" — it mirrors Plan when the
     column is blank. Each series is cut off at the last month holding that kind of date. */
  const bars=[
    {name:'Planned', color:'#1E88E5',v:P.pNew,cut:P.lastPlanIdx},
    {name:'Forecast',color:'#F9A825',v:P.fNew,cut:P.lastForecastIdx},
    {name:'Actual',  color:'#2E7D32',v:P.aNew,cut:P.lastActualIdx}
  ];
  const lines=[
    {name:'Cum. Plan',    color:'#1E88E5',v:P.pCum,dash:'6,3',cut:P.lastPlanIdx},
    {name:'Cum. Forecast',color:'#F9A825',v:P.fCum,dash:'2,2',cut:P.lastForecastIdx},
    {name:'Cum. Actual',  color:'#2E7D32',v:P.aCum,dash:'',   cut:P.actualEndIdx}
  ];
  const sl=o=>o.v.slice(a,b+1);
  /* SINGLE shared y-scale (§4.2). Two independent axes (bars on barMax, curves on cumMax) made
     the same number render at two different heights — a bar of 5 looked taller than a cumulative
     point of 5, which read as "the cumulative curve is lower than the bar". One scale keeps
     monthly and cumulative values directly comparable. */
  const maxV=Math.max(1,...bars.flatMap(sl),...lines.flatMap(sl));
  const gw=plotW/m, cx=i=>padL+i*gw+gw/2;
  const y=v=>padT+plotH-(v/maxV)*plotH;
  let s='<svg id="svg-po" role="img" aria-label="PO plan, forecast and actual: monthly bars with cumulative S-curve" xmlns="http://www.w3.org/2000/svg" width="'+w+'" height="'+h+'" viewBox="0 0 '+w+' '+h+'" style="width:'+w+'px;height:'+h+'px;display:block">';
  s+='<line x1="'+padL+'" y1="'+padT+'" x2="'+padL+'" y2="'+(padT+plotH)+'" stroke="'+CHART.axis+'"/>';
  s+='<line x1="'+padL+'" y1="'+(padT+plotH)+'" x2="'+(padL+plotW)+'" y2="'+(padT+plotH)+'" stroke="'+CHART.axis+'"/>';
  for(let i=0;i<=4;i++){
    const gv=Math.round(maxV*i/4), gy=y(gv);
    s+='<text x="'+(padL-6)+'" y="'+(gy+3)+'" text-anchor="end" fill="'+CHART.muted+'" style="font-size:13px">'+gv+'</text>';
    s+='<line x1="'+padL+'" y1="'+gy+'" x2="'+(padL+plotW)+'" y2="'+gy+'" stroke="'+CHART.grid+'"/>';
  }
  s+='<text x="'+(padL-6)+'" y="'+(padT-6)+'" text-anchor="end" fill="'+CHART.muted+'" style="font-size:13px">Pkgs</text>';
  cats.forEach((c,ci)=>{
    const ai=a+ci, lab=mLabel(c);
    if(showBars){
      const nb=bars.length, bw=Math.min(18,(gw*0.62)/nb);
      bars.forEach((se,si)=>{
        if(se.cut!==undefined && ai>se.cut) return;   // stop at this series' last real date
        const v=se.v[ai], bh=(v/maxV)*plotH, x=cx(ci)-(nb*bw)/2+si*bw, y=padT+plotH-bh;
        s+='<rect x="'+x.toFixed(1)+'" y="'+y.toFixed(1)+'" width="'+(bw-2).toFixed(1)+'" height="'+Math.max(0,bh).toFixed(1)+'" fill="'+se.color+'" rx="2" data-month="'+esc(lab)+'" data-series="'+esc(se.name)+'" data-value="'+v+'" data-tip="'+esc(tipForMonth(ci))+'"/>';
        /* value printed above every non-zero bar */
        if(v>0&&bw>=9) s+='<text x="'+(x+(bw-2)/2).toFixed(1)+'" y="'+(y-3).toFixed(1)+'" text-anchor="middle" fill="'+CHART.ink+'" style="font-size:12px">'+v+'</text>';
      });
    }
    s+='<text x="'+cx(ci).toFixed(1)+'" y="'+(padT+plotH+15)+'" text-anchor="middle" fill="'+CHART.muted+'" style="font-size:13px" data-tip="'+esc(tipForMonth(ci))+'">'+esc(lab)+'</text>';
  });
  lines.forEach(se=>{
    const xs=[],vals=[];
    for(let abs=a;abs<=b;abs++){
      if(se.cut!==undefined && abs>se.cut) break;   // stop at this series' last real date
      xs.push(abs); vals.push(se.v[abs]);
    }
    if(!vals.length) return;   // nothing recorded yet -> draw nothing, never a flat zero line
    const pts=vals.map((v,i)=>cx(xs[i]-a).toFixed(1)+','+y(v).toFixed(1));
    if(pts.length>1) s+='<polyline points="'+pts.join(' ')+'" fill="none" stroke="'+se.color+'" stroke-width="2.5" stroke-dasharray="'+se.dash+'" stroke-linejoin="round" stroke-linecap="round"/>';
    vals.forEach((v,i)=>{ s+='<circle cx="'+cx(xs[i]-a).toFixed(1)+'" cy="'+y(v).toFixed(1)+'" r="3" fill="'+se.color+'" data-month="'+esc(mLabel(cats[xs[i]-a]))+'" data-series="'+esc(se.name)+'" data-value="'+v+'" data-tip="'+esc(tipForMonth(xs[i]-a))+'"/>'; });
  });
  function vAt(se,ai){ return (se.cut===undefined||ai<=se.cut)?se.v[ai]:0; }
  function grandTotal(){ let g=0; for(let ai=a;ai<=b;ai++) g+=vAt(bars[0],ai)+vAt(bars[1],ai)+vAt(bars[2],ai); return g; }
  function tipForMonth(ci){ const GT=grandTotal(); const ai=a+ci, pv=vAt(bars[0],ai), fv=vAt(bars[1],ai), av=vAt(bars[2],ai), tot=pv+fv+av;
    const sw=c=>'<span class="tt-sw" style="background:'+c+'"></span>';
    const pct=GT?Math.round(tot/GT*100):0;
    return '<div class="tt-h">'+esc(mLabel(cats[ci]))+'</div>'
      +'<div class="tt-r"><span>'+sw('#1E88E5')+'Planned</span><b>'+pv+'</b></div>'
      +'<div class="tt-r"><span>'+sw('#F9A825')+'Forecast</span><b>'+fv+'</b></div>'
      +'<div class="tt-r"><span>'+sw('#2E7D32')+'Actual</span><b>'+av+'</b></div>'
      +'<div class="tt-f"><span>Month total '+tot+'</span><b>'+pct+'%</b></div>'; }
  const mkY=(idx,color,dash,label)=>{ if(idx<a||idx>b) return ''; const x=cx(idx-a).toFixed(1); return '<line x1="'+x+'" y1="'+padT+'" x2="'+x+'" y2="'+(padT+plotH)+'" stroke="'+color+'" stroke-width="1.5" stroke-dasharray="'+dash+'"/><text x="'+x+'" y="'+(padT+11)+'" text-anchor="middle" fill="'+color+'" style="font-size:13px">'+label+'</text>'; };
  cats.forEach((c,ci)=>{ const bx=padL+ci*gw; s+='<rect class="po-band" x="'+bx.toFixed(1)+'" y="'+padT+'" width="'+gw.toFixed(1)+'" height="'+plotH+'" fill="transparent" data-snap="'+(bx+gw/2).toFixed(1)+'" data-tip="'+esc(tipForMonth(ci))+'"/>'; });
  s+='<line class="chart-snap" x1="0" x2="0" y1="'+padT+'" y2="'+(padT+plotH)+'" style="display:none"/>';
  if(P.projStartIdx>=0) s+=mkY(P.projStartIdx,'#C62828','5,3','Start');
  if(P.todayIdx>=0) s+=mkY(P.todayIdx,'#B8C2CC','2,2','Today');
  let lx=padL;
  if(showBars) bars.forEach(se=>{ s+='<rect x="'+lx+'" y="'+(h-13)+'" width="10" height="10" fill="'+se.color+'" rx="2"></rect><text x="'+(lx+14)+'" y="'+(h-4)+'" fill="'+CHART.ink+'" style="font-size:13px">'+se.name+'</text>'; lx+=14+se.name.length*7+20; });
  lines.forEach(se=>{ s+='<line x1="'+lx+'" y1="'+(h-8)+'" x2="'+(lx+16)+'" y2="'+(h-8)+'" stroke="'+se.color+'" stroke-width="2.5" stroke-dasharray="'+se.dash+'"/><text x="'+(lx+20)+'" y="'+(h-4)+'" fill="'+CHART.ink+'" style="font-size:13px">'+se.name+'</text>'; lx+=20+se.name.length*7+20; });
  return s+'</svg>';
}
function drawPPSCurve(){
  const P=STATE.view&&STATE.view.panels.po; if(!P) return;
  const a=STATE.poWin.from, b=STATE.poWin.to;
  const host=document.getElementById('poChart');
  const avail=Math.max(320, host&&host.clientWidth?host.clientWidth:760);
  const svg=svgPoCombo(P,a,b,{w:avail});
  if(host && !host.__ro && typeof ResizeObserver==='function'){
    let last=avail;
    host.__ro=new ResizeObserver(()=>{
      const w=host.clientWidth;
      if(Math.abs(w-last)>8){ last=w; requestAnimationFrame(()=>{ try{ drawPPSCurve(); }catch(e){} }); }
    });
    host.__ro.observe(host);
  }
  if(!host) return;
  host.setAttribute('tabindex','0'); host.setAttribute('role','group');
  host.setAttribute('aria-label','PO plan, forecast and actual chart; focus or hover a month for detail');
  host.innerHTML=svg;
  const first=host.querySelector('[data-tip]');
  host.setAttribute('data-tip-first', first ? first.getAttribute('data-tip') : '');
  const msg=document.getElementById('poWinMsg'); if(msg) msg.textContent=P.months[a]+' → '+P.months[b]+'  ('+(b-a+1)+'/'+P.months.length+' months)';
}
/* "Bars" toggle - hides the monthly bars so the cumulative S-curve can be read on its own.
   Wired from boot() so importing this module in Node has no DOM side effect. */
function wirePoBars(){
  const btn=document.getElementById('poBarsBtn'); if(!btn) return;
  const sync=()=>{ btn.setAttribute('aria-pressed',String(STATE.prefs.poBars)); btn.style.opacity=STATE.prefs.poBars?'1':'.55'; };
  btn.addEventListener('click',()=>{ STATE.prefs.poBars=!STATE.prefs.poBars; sync(); drawPPSCurve(); });
  sync();
}
function svgLine(P,a,b){
  const cats=P.months.slice(a,b+1), m=cats.length;
  if(m<=0) return '<div class="empty">No months in range.</div>';
  const H=CHART.group.h, padL=CHART.group.padL, padR=CHART.group.padR, padT=CHART.group.padT, padB=CHART.group.padB;
  const W=Math.max(380, m*46+padL+padR), plotW=W-padL-padR, plotH=H-padT-padB;
  const maxV=Math.max(1,...P.pCum.slice(a,b+1),...(P.hasForecast?P.fCum.slice(a,b+1):[]),...P.aCum.slice(a,b+1));
  let s='<svg role="img" aria-label="Cumulative PO S-curve" xmlns="http://www.w3.org/2000/svg" width="'+W+'" height="'+H+'" viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block">';
  s+='<line x1="'+padL+'" y1="'+padT+'" x2="'+padL+'" y2="'+(padT+plotH)+'" stroke="'+CHART.axis+'"/>';
  s+='<line x1="'+padL+'" y1="'+(padT+plotH)+'" x2="'+(W-padR)+'" y2="'+(padT+plotH)+'" stroke="'+CHART.axis+'"/>';
  for(let i=0;i<=4;i++){ const v=Math.round(maxV*i/4), y=padT+plotH-(v/maxV)*plotH;
    s+='<text x="'+(padL-6)+'" y="'+(y+3)+'" text-anchor="end" fill="'+CHART.muted+'" style="font-size:13px">'+v+'</text>';
    s+='<line x1="'+padL+'" y1="'+y+'" x2="'+(W-padR)+'" y2="'+y+'" stroke="'+CHART.grid+'"/>'; }
  const xAt=i=> padL + (m===1?plotW/2: i*plotW/(m-1));
  const yAt=v=> padT+plotH-(v/maxV)*plotH;
  const mk=(absIdx,color,dash,label)=>{ if(absIdx<a||absIdx>b) return ''; const x=xAt(absIdx-a); return '<line x1="'+x+'" y1="'+padT+'" x2="'+x+'" y2="'+(padT+plotH)+'" stroke="'+color+'" stroke-width="1.5" stroke-dasharray="'+dash+'"/><text x="'+x+'" y="'+(padT-5)+'" text-anchor="middle" fill="'+color+'" style="font-size:13px">'+label+'</text>'; };
  if(P.projStartIdx>=0) s+=mk(P.projStartIdx,'#C62828','5,3','Start');
  if(P.todayIdx>=0) s+=mk(P.todayIdx,'#B8C2CC','2,2','Today');
  const series=[{name:'Plan',color:CHART.accent,vals:P.pCum}];
  if(P.hasForecast) series.splice(1,0,{name:'Forecast',color:'#F9A825',vals:P.fCum});
  series.push({name:'Actual',color:CHART.goodDark,vals:P.aCum});
  series.forEach(se=>{
    const pts=se.vals.slice(a,b+1).map((v,i)=>xAt(i)+','+yAt(v)).join(' ');
    s+='<polyline points="'+pts+'" fill="none" stroke="'+se.color+'" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    s+='<circle cx="'+xAt(m-1)+'" cy="'+yAt(se.vals[b])+'" r="3" fill="'+se.color+'"/>';
  });
  const step=Math.max(1,Math.ceil(m/12));
  cats.forEach((c,i)=>{ if(i%step===0||i===m-1){ s+='<text x="'+xAt(i)+'" y="'+(padT+plotH+15)+'" text-anchor="middle" fill="'+CHART.muted+'" style="font-size:13px">'+mLabel(c)+'</text>'; } });
  let lx=padL;
  series.forEach(se=>{ s+='<rect x="'+lx+'" y="'+(H-12)+'" width="10" height="10" fill="'+se.color+'" rx="2"/><text x="'+(lx+14)+'" y="'+(H-3)+'" fill="'+CHART.ink+'" style="font-size:13px">'+se.name+'</text>'; lx+=14+se.name.length*7+18; });
  s+='</svg>';
  return s;
}
/* Panel 4 = PO Look-Ahead: a bounded, scrollable DATA TABLE (§4.3) over a selectable horizon.
   A long package list must never stretch the page, so the rows live in a fixed-height scroller
   with a sticky header. The horizon is a persisted preference, like every other chart control. */
const LOOK_HORIZONS=[1,2,3,4,6];
const LOOK_DEFAULT=3;
function lookHorizon(){
  const v=parseInt(getPref('look'),10);
  return LOOK_HORIZONS.indexOf(v)>=0 ? v : LOOK_DEFAULT;
}
function syncLookSeg(){
  const cur=lookHorizon();
  document.querySelectorAll('#lookWin .seg button').forEach(b=>{
    const on=b.getAttribute('data-t')===String(cur);
    b.classList.toggle('on',on); b.setAttribute('aria-pressed',String(on));
  });
}
/* Paint-only (§4.3 bounded table). The rows, the window and the horizon are in deriveView; the
   CSV export reads the same view.look, so the file always matches the rows on screen.
   §4.3 / §7.2.15: the header table stays outside the scroller (split header). */
function renderLookAhead(look){
  const host=document.getElementById('lookahead'); if(!host) return;
  const list=look.list;
  const sub=document.getElementById('lookSub');
  if(sub) sub.textContent='PO Plan from '+fmt(look.from)+' to '+fmt(look.end)+' ('+list.length+' packages)';
  syncLookSeg();
  const lbl=look.h===1?'month':look.h+' months';
  if(!list.length){ host.innerHTML='<div class="empty">No POs planned in the next '+lbl+'.</div>'; return; }
  const DAY=86400000;
  const cols=[{label:'Package',w:'34%'},{label:'Discipline',w:'16%'},{label:'PO Plan',w:'16%'},{label:'In (days)',num:true,w:'12%'},{label:'Status',w:'22%'}];
  const body=list.map(p=>'<tr><th scope="row">'+esc(p.title)+'</th><td>'+esc(p.discipline||'—')+'</td><td>'+fmt(p.poPlan)+'</td>'
      +'<td class="num">'+Math.max(0,Math.round((p.poPlan-look.from)/DAY))+'</td><td>'+esc(p.status||'—')+'</td></tr>').join('');
  host.innerHTML=splitTable(cols, null, body);
}
/* Canonical overdue test (date-based, measured vs real TODAY):
   OVERDUE IS ANCHORED TO THE PLAN (committed baseline) DATE ONLY — a Forecast is a
   managerial estimate and must NOT clear or re-baseline overdue (product decision
   2026-10-07). Rule: Plan present && Plan < today && Actual absent => overdue. An
   Actual present => stage DONE => NOT overdue. Shared by the Overdue-by-Stage list,
   the Stage-Overdue chart and Schedule Health so all views use the same test.
   P2: todayMidnight / stageDue / stageIsOverdue and STAGES are imported from pipeline.mjs. */


/* ---- P1: Overdue-by-Stage list ----
   Overdue is anchored to the PLAN date (committed baseline), measured against the
   REAL current date (today), not the project snapshot: Plan present && Plan < today &&
   Actual absent. A Forecast estimate does NOT remove a row (only an Actual does) —
   see stageIsOverdue. The inline filter (buildOverdueFilter) lets the user surface
   only the stage(s) they care about (e.g. PO Issue, MR Issue). */
const OVL_STAGES=STAGES.map(s=>[s[0],s[2]]); // overdue-list view uses the "Issue/Approval" wording

/* Stage selector = the standard SEGMENTED CONTROL (§7.5): single-select, ONE stage at a time.
   Options come from the shared STAGES constant, so the stage set can never drift. Behaviour comes
   from the delegated `.seg` handler — no per-button listeners. */
const OVL_KEYS=OVL_STAGES.map(s=>s[0]);
function buildOverdueFilter(sel){
  const el=document.getElementById('ovlFilter'); if(!el) return;
  el.innerHTML=OVL_STAGES.map(([k,lab])=>{
    const on=(k===sel);
    return '<button type="button" data-t="'+k+'" class="'+(on?'on':'')+'" aria-pressed="'+on+'">'+esc(lab)+'</button>';
  }).join('');
}

/* Paint-only: the overdue rows, the per-stage counts and the resolved selection are in
   deriveView. */
function renderOverdueList(ov){
  const sel=ov.sel, rows=ov.rows, counts=ov.counts, today=ov.today;
  buildOverdueFilter(sel);   // keep the seg in sync with the resolved selection
  const selLab=(OVL_STAGES.find(([k])=>k===sel)||['',''])[1];
  const sub=document.getElementById('ovlSub');
  const el=document.getElementById('ovlList');
  if(sub) sub.textContent='Overdue by stage — '+OVL_STAGES.map(([k,lab])=>lab+' '+counts[k]).join(' · ')+'  ·  showing '+selLab+' ('+rows.length+' rows)';
  if(!rows.length){ if(el) el.innerHTML='<div class="empty">No overdue packages for '+esc(selLab)+'.</div>'; return; }
  const cols=[{label:'',w:'32px',align:'center'},{label:'Package',w:'24%'},{label:'Discipline',w:'11%'},{label:'Overdue Stage',w:'12%'},
    {label:'Plan',w:'9%'},{label:'Forecast',w:'9%'},{label:'Overdue',num:true,w:'9%'},{label:'Status',w:'14%'}];
  const body=rows.map(r=>{
      const did='ovld-'+String(r.p.id).replace(/[^\w-]/g,'_');
      return '<tr class="expandable" data-pkg="'+esc(r.p.id)+'">'
        + '<td class="drill-cell"><button type="button" class="drill-btn" aria-expanded="false" aria-controls="'+did+'" title="Show package detail" aria-label="Show package detail"><span class="drill-chev">▸</span></button></td>'
        + '<td>'+esc(r.p.title)+'</td><td>'+esc(r.p.discipline||'—')+'</td><td>'+esc(r.lab)+'</td>'
        + '<td>'+(r.p[r.k+'Plan']?fmt(r.p[r.k+'Plan']):'—')+'</td><td>'+(r.p[r.k+'Forecast']?fmt(r.p[r.k+'Forecast']):'—')+'</td>'
        + '<td class="num">'+r.days+' d</td><td>'+esc(r.p.status||'—')+'</td></tr>'
        + '<tr class="sub" id="'+did+'" hidden><td colspan="8">'+pkgDetailHTML(r.p, today)+'</td></tr>';
    }).join('');
  if(el) el.innerHTML=splitTable(cols, null, body);
}

/* Inline detail for an expanded overdue row (I-62): full package record,
   the 5-stage Plan/Forecast/Actual grid (overdue cells flagged via the shared
   stageIsOverdue), and this package's own data-quality findings. */
function pkgDetailHTML(p, today){
  const meta=[['Package No.',p.packageNo],['Discipline',p.discipline],['Item Category',p.itemCategory],
              ['Criticality',p.criticality],['Status',p.status],['Lead Time',p.leadTime!=null?p.leadTime+' wk':''],
              ['Engineer',p.engineer],['Supplier',p.supplier],['Buyer',p.buyer],['PE',p.pe]];
  const metaHtml=meta.filter(m=>m[1]!=null&&m[1]!=='').map(m=>'<span class="kv"><b>'+esc(m[0])+':</b> '+esc(m[1])+'</span>').join('');
  const stageRows=STAGES.map(([k,short])=>{
    const od=stageIsOverdue(p,k,today);
    return '<tr'+(od?' class="over"':'')+'><th scope="row">'+esc(short)+'</th><td>'+(p[k+'Plan']?fmt(p[k+'Plan']):'—')+'</td><td>'+(p[k+'Forecast']?fmt(p[k+'Forecast']):'—')+'</td><td>'+(p[k+'Actual']?fmt(p[k+'Actual']):'—')+'</td><td>'+(od?'⚠ overdue':'')+'</td></tr>';
  }).join('');
  const allIss=(STATE.report&&STATE.report.issues)?STATE.report.issues:[];
  const issues=allIss.filter(i=>i.pkg===p.id);
  const issueHtml=issues.length
    ? issues.map(i=>'<li><span class="vchip '+(i.sev==='error'?'e':i.sev==='warning'?'w':'i')+'">'+esc(i.sev)+'</span> <b>'+esc(i.code)+'</b> '+esc(i.msg)+'</li>').join('')
    : '<li class="muted">No data-quality issues for this package.</li>';
  /* I-61: surface project-wide data tallies (pkg:'—' && kind:'data': V-05, V-14, V-23, V-25)
     inside the drill-down too, so a package-level reviewer always sees them. System aggregate
     issues (kind:'system') stay in the top banner, not here. */
  const agg=allIss.filter(i=>i.pkg==='—' && i.kind==='data');
  const aggHtml=agg.length
    ? agg.map(i=>'<li><span class="vchip '+(i.sev==='error'?'e':i.sev==='warning'?'w':'i')+'">'+esc(i.sev)+'</span> <b>'+esc(i.code)+'</b> '+esc(i.msg)+'</li>').join('')
    : '';
  return '<div class="sub-inner">'
    + '<div class="ovl-meta">'+metaHtml+'</div>'
    + '<table class="ds-table stage-grid"><thead><tr><th scope="col">Stage</th><th scope="col">Plan</th><th scope="col">Forecast</th><th scope="col">Actual</th><th scope="col">Flag</th></tr></thead><tbody>'+stageRows+'</tbody></table>'
    + '<div class="ovl-v"><div class="ovl-vh">Validation — this package</div><ul class="ovl-vlist">'+issueHtml+'</ul>'
    + (aggHtml?'<div class="ovl-vh">Validation — project-wide</div><ul class="ovl-vlist">'+aggHtml+'</ul>':'')
    + '</div>'
    + '</div>';
}

/* ACCORDION (§4.4): only ONE detail may be open at a time — opening a row closes any
   other open row, so the table never grows into a wall of nested detail. The button is the
   accessible control; the whole row is a pointer shortcut. */
function toggleOvlDetail(row){
  const btn=row.querySelector('.drill-btn');
  const d=btn && document.getElementById(btn.getAttribute('aria-controls'));
  if(!d) return;
  const willOpen=d.hasAttribute('hidden');
  const list=document.getElementById('ovlList');
  if(list) list.querySelectorAll('.sub:not([hidden])').forEach(o=>{
    if(o===d) return;
    o.setAttribute('hidden','');
    const prev=o.previousElementSibling;
    const pb=prev&&prev.querySelector('.drill-btn');
    if(pb) pb.setAttribute('aria-expanded','false');
  });
  d.toggleAttribute('hidden');
  btn.setAttribute('aria-expanded', String(willOpen));
}

const BENCH_ROWS=[['Power transformer','36–78 weeks','252–546'],['MV/HV switchgear','20–40 weeks','140–280'],['Generator (std)','12–20 weeks','84–140'],['Chiller','16–24 weeks','112–168'],['Pump (std)','8–14 weeks','56–98'],['Cooling tower','12–20 weeks','84–140'],['Air handling unit','12–18 weeks','84–126'],['Motor control center','26–40 weeks','182–280'],['SCADA / PLC','20–30 weeks','140–210'],['Structural steel','16–36 weeks','112–252'],['Elevator / escalator','24–40 weeks','168–280'],['Fire & life-safety','16–30 weeks','112–210']];
function renderBenchmark(){
  const host=document.getElementById('benchTable'); if(!host) return;
  const cols=[{label:'Equipment Category',w:'52%'},{label:'Typical Lead Time',num:true,w:'26%'},{label:'Approx Days',num:true,w:'22%'}];
  const body=BENCH_ROWS.map(r=>'<tr><th scope="row">'+r[0]+'</th><td class="num">'+r[1]+'</td><td class="num">'+r[2]+'</td></tr>').join('');
  host.innerHTML=splitTable(cols, '', body);
  const sub=document.getElementById('benchSub'); if(sub) sub.textContent=BENCH_ROWS.length+' rows';
}
export function benchCsvRows(){
  return [['Equipment Category','Typical Lead Time','Approx Days']].concat(BENCH_ROWS.map(r=>r.slice()));
}


/* ============== chart → image ============== */
async function chartToCanvas(svgEl){
  const xml=new XMLSerializer().serializeToString(svgEl);
  const src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml);
  const natW=svgEl.width.baseVal.value||svgEl.viewBox.baseVal.width||760;
  const natH=svgEl.height.baseVal.value||svgEl.viewBox.baseVal.height||280;
  // Clamp the raster size so a long S-curve timeline can't exceed the browser's max canvas
  // dimension (which silently yields a 0-sized / null canvas and breaks export).
  const MAX=16000; let scale=2; while(scale>0.5 && (natW*scale>MAX||natH*scale>MAX)) scale-=0.25;
  const w=Math.max(1,Math.round(natW*scale)), h=Math.max(1,Math.round(natH*scale));
  const img=new Image();
  await new Promise((res,rej)=>{ img.onload=res; img.onerror=()=>rej(new Error('SVG could not be rasterised')); img.src=src; });
  const canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle=CHART.white; ctx.fillRect(0,0,w,h);
  ctx.drawImage(img,0,0,w,h);
  return canvas;
}
/* Accepts either a Blob or a data: URL. The anchor is attached to the document before the
   click so downloads work reliably even when the dashboard is opened directly from disk
   (file:// / opaque origin), where a detached anchor is sometimes ignored. */
function downloadBlob(blobOrUrl,name){
  const a=document.createElement('a');
  a.href=(typeof blobOrUrl==='string')?blobOrUrl:URL.createObjectURL(blobOrUrl);
  a.download=name; a.rel='noopener';
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ a.remove(); if(typeof blobOrUrl!=='string'){ try{ URL.revokeObjectURL(a.href); }catch(e){} } }, 4000);
}
async function copyChart(svgId,name){
  const el=document.getElementById(svgId); if(!el){ toast('Nothing to export'); return; }
  let canvas;
  try{ canvas=await chartToCanvas(el); }catch(e){ toast('Export failed: '+e.message); return; }
  // Prefer the OS clipboard (image). Fall back to a PNG file download everywhere else.
  try{
    if(navigator.clipboard && window.ClipboardItem && canvas.toBlob){
      const blob=await new Promise(r=>canvas.toBlob(r,'image/png'));
      if(blob){ await navigator.clipboard.write([new ClipboardItem({'image/png':blob})]); toast('Chart copied to clipboard'); return; }
    }
  }catch(e){ /* fall through to file download */ }
  try{ downloadBlob(canvas.toDataURL('image/png'), name+'.png'); toast('Copied as PNG download'); }
  catch(e2){ toast('Copy failed: '+e2.message); }
}
/* ============== load flow ============== */
async function handleFile(f){
  if(!f) return;
  try{
    const buf=await f.arrayBuffer();
    let result;
    /* I-56: a CSV export carries only the Package Plan, never the Code sheet
       (column mappings / lookups), so feeding it to buildDashboard throws a
       cryptic "No Code sheet found". Reject it up front with an actionable
       message instead of letting the load fail partway. */
    if(f.name.toLowerCase().endsWith('.csv')){
      throw new Error('CSV export cannot be re-imported — it contains only the Package Plan, not the Code sheet (column mappings). Please load the original .xlsx workbook.');
    }
    result=await parseXlsx(buf);
    if(!result || Object.keys(result).length===0) throw new Error('No sheets parsed.');
    buildDashboard(result, f.name);
  }catch(err){ showError(err.message); console.error(err); }
}
/* Phase B: dark-theme toggle (persisted in localStorage) */
function getTheme(){ try{ return localStorage.getItem('ppp-chart-theme'); }catch(e){ return null; } }
const THEMES=['light','dark','sky','ocean','presentation'];
function applyTheme(t){ const d=document.documentElement; const v=THEMES.indexOf(t)>=0?t:'light'; if(v==='light'){ d.removeAttribute('data-theme'); } else { d.setAttribute('data-theme',v); } const b=document.getElementById('themeBtn'); if(b) b.textContent = (v==='light') ? '🌙' : '☀'; }
function toggleTheme(){ const cur = document.documentElement.getAttribute('data-theme')==='dark' ? 'dark' : 'light'; const next = cur==='dark' ? 'light' : 'dark'; try{ localStorage.setItem('ppp-chart-theme', next); }catch(e){} applyTheme(next); }
/* Help modal (MDL pattern): one shared popup opened per-panel via the HELP map */
const HELP = {
  general:{title:'Using this dashboard',body:`
<h4>Getting around</h4>
<p>Pick a page in the left panel. The title bar shows the active page. Load a workbook from the menu bar;
Export downloads either the validation list or the PO look-ahead list as CSV.</p>
<h4>Filtering</h4>
<p><b>Categories</b> narrows the package set. <b>Search</b> filters by the column chosen in its picker (all columns by default), covering package title, package number,
discipline or status. Both combine, and every panel updates.</p>
<h4>Settings and Help</h4>
<p><b>Settings</b> (left panel, bottom) holds the theme. <b>Help</b> opens this dialog; each panel also has
its own <code>?</code> button.</p>
<h4>Warning area</h4>
<p>Warnings from the loaded workbook appear inside the content area. The menu-bar button shows the count
and hides or shows them.</p>`},
  kpiPanel:{title:'KPI Overview — Panel 1',body:`
<h4>What it shows</h4>
<p>Six headline metrics for the procurement package plan currently in view.</p>
<ul>
  <li><b>Total Packages</b> — every package loaded from the Package Plan sheet.</li>
  <li><b>Started (≠ Not Start)</b> — share progressed beyond "Not Start". Green ≥60% · Amber ≥40% · Red &lt;40%.</li>
  <li><b>PO Issued</b> — packages that have a PO Actual date recorded (PO issued), regardless of due date.
    <ul>
      <li><b>Due date</b> = PO Forecast if present, otherwise PO Plan.</li>
      <li>Counts only when the due date is before today <em>and</em> there is no PO Actual — a PO Actual means the PO is complete, so it is never an issue.</li>
      <li>Packages with <em>no</em> PO Plan/Forecast date are not counted here (cannot determine a due date).</li>
      <li>Red if any, green if none — this is the same number shown in the Overdue-by-Stage "PO Issue" row and the Schedule-Health "Overdue" tally.</li>
    </ul>
  </li>
  <li><b>Delivered / RI</b> — share with status Delivered or Receive Inspection.</li>
  <li><b>Lead-time estimated</b> — packages with an Estimate Lead Time value (coverage %).</li>
  <li><b>Engineer assigned</b> — packages with a Design Engineer filled (coverage %).</li>
</ul>`},
  charts:{title:'Interactive Chart — Panel 2',body:`
<h4>What it shows</h4>
<p>Two chart cards side by side: <b>Packages</b> (any breakdown of the package set) and
<b>Data Quality</b> (open issues by rule / package / discipline).</p>
<h4>Per-card controls</h4>
<ul>
  <li><b>Breakdown</b> dropdown — the dimension each card groups by (status, item category,
      discipline, engineer, lead-time band, …).</li>
  <li><b>Bar / Pie</b> — applies to <em>that chart only</em>; each card keeps its own choice.</li>
  <li><b>⤓ PNG</b> / <b>⧉ Copy</b> — export that single chart (PNG file or clipboard).</li>
</ul>
<h4>Panel-level controls</h4>
<ul>
  <li><b>?</b> — this help popup.</li>
  <li><b>Collapse</b> (<code>−</code>/<code>+</code>) — hides both chart cards.</li>
</ul>`},
  scPanel:{title:'PO Plan vs Actual — Panel 3',body:`
<h4>What it shows</h4>
<p>One combined chart on a single time axis and a <b>single y-scale</b>: <b>monthly bars</b> = POs
due in that month, and <b>cumulative S-curve lines</b> = running totals. Both use the same scale
and the one value axis on the left, so a bar and a curve point with the same value sit at the
same height. Plan, Forecast and Actual are each drawn as both a bar series and a cumulative
line.</p>
<p>Drag the <b>Period window</b> From / To sliders to focus a date range. <b>Bars</b> toggles the
monthly bars off so the cumulative S-curve can be read alone.
Forecast is always shown — a package with no Forecast date falls back to its <b>Plan</b> date, so
the Forecast series mirrors Plan when that column is blank. Plan and Forecast stop at their last
real date; the cumulative <b>Actual</b> line runs through <b>today</b>, while Actual bars stop at
the latest month with an actual PO. Each bar shows its count above it. The red dashed line marks
project start, the grey line marks today. Use ⤓ PNG / ⧉ Copy to export.</p>
<ul>
  <li>Drag the <b>Period window</b> sliders to focus a date range.</li>
  <li>The red dashed line marks project start; the grey line marks today.</li>
</ul>`},
  lookPanel:{title:'PO Look-Ahead — Panel 4',body:`
<h4>What it shows</h4>
<p>Packages whose <b>PO Plan</b> date falls inside the selected horizon, earliest first, in a
scrollable data table. It is <b>forward-looking only</b>: a package whose PO has already been
issued (it has a PO Actual date) is complete and is not listed.</p>
<h4>Controls</h4>
<ul>
  <li><b>Horizon</b> (<code>1m</code> / <code>2m</code> / <code>3m</code> / <code>4m</code> /
      <code>6m</code>) — how far ahead to look, in <b>calendar months</b> from today. The choice
      is remembered between sessions.</li>
  <li><b>⤓ CSV</b> — download the list exactly as shown (same horizon, same filter, same sort)
      as a CSV file, ready to open in Excel.</li>
</ul>
<h4>Columns</h4>
<ul>
  <li><b>Package</b>, <b>Discipline</b>, <b>PO Plan</b> (the planned PO date).</li>
  <li><b>In (days)</b> — days from today to that PO Plan date; sort the eye by the smallest
      number to see what is most urgent.</li>
  <li><b>Status</b> — current procurement status.</li>
</ul>
<p>The row count is shown next to the horizon control. The table is a fixed-height scroller, so a
long list never stretches the page — scroll inside it to see the rest.</p>`},
  ovlPanel:{title:'Overdue by Stage — Panel 5',body:`
<h4>What it shows</h4>
<p>Packages past their due date, with a drill-down into each package.</p>
<h4>Controls</h4>
<ul>
  <li><b>Stage</b> (<code>MR Issue</code> / <code>PO Issue</code> / <code>VD Approval</code> /
      <code>FAT</code> / <code>ROS</code>) — shows <b>one stage at a time</b>. The choice is
      remembered between sessions. The count for <em>every</em> stage stays visible next to the
      control, so you can see where the overdue work sits without switching.</li>
  <li>Click a row (or press <b>Enter</b> / <b>Space</b>) to expand its detail: the full package
      record, the 5-stage Plan / Forecast / Actual grid, and that package's validation issues.
      <b>Only one row can be open at a time</b> — opening another closes the previous one.</li>
</ul>
<p>The table is a fixed-height scroller, so a long overdue list never stretches the page.</p>`},
  benchPanel:{title:'Lead Time Benchmark — Panel 6',body:`
<h4>What it shows</h4>
<p>External 2026 industry reference lead times for equipment categories. Use to sanity-check the Estimated Lead Time on each package and confirm with the vendor at quotation.</p>`},
  vcard:{title:'Data Validation — Panel 7',body:`
<h4>What it shows</h4>
<p>System / config checks run against the PPP data and the Code sheet. Per-package data issues are listed below; use <b>Export CSV</b> for the full list. System / config notices now appear in the top warning bar above the dashboard; fix the source data in Excel and reload to clear per-package issues.</p>`},
};
let helpModalEl=null;
function ensureHelpModal(){
  if(helpModalEl) return helpModalEl;
  const m=document.createElement('div'); m.className='help-modal'; m.hidden=true;
  m.innerHTML='<div class="box" role="dialog" aria-modal="true"><header><h3 id="helpTitle"></h3><button class="close" title="Close" aria-label="Close help">✕</button></header><div class="body" id="helpBody"></div></div>';
  m.addEventListener('click',e=>{ if(e.target===m) m.hidden=true; });
  m.querySelector('.close').onclick=()=>{ m.hidden=true; };
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!m.hidden) m.hidden=true; });
  (document.body||document.documentElement).appendChild(m);
  helpModalEl=m; return m;
}
function openHelp(id){
  const h=HELP[id]; if(!h) return;
  const m=ensureHelpModal();
  m.querySelector('#helpTitle').textContent=h.title;
  m.querySelector('#helpBody').innerHTML=h.body;
  m.hidden=false;
}
/* §4 panel chrome for every top-level panel: number by DOM order (after render), title row with
   Help `?` left of Collapse `−`, and a collapse state that outlives the re-rendered element. */
function panelCollapsed(id){
  if(STATE.ui.collapsed[id]==null){
    let v=false; try{ v=localStorage.getItem('ppp-pc-'+id)==='1'; }catch(e){}
    STATE.ui.collapsed[id]=v;
  }
  return STATE.ui.collapsed[id];
}
function setupPanels(){
  const body=document.getElementById('dashBody'); if(!body||!body.querySelectorAll) return;
  const panels=[...body.querySelectorAll(':scope > .card')];
  panels.forEach((sec,i)=>{
    if(!sec.id) return;
    sec.setAttribute('data-panel', String(i+1));
    let head=sec.querySelector(':scope > .panel-head');
    if(!head){
      head=document.createElement('div'); head.className='panel-head';
      const h2=sec.querySelector(':scope > h2');
      if(h2){ h2.replaceWith(head); head.appendChild(h2); }
      else sec.insertBefore(head, sec.firstChild);
    }
    let actions=head.querySelector(':scope > .panel-actions');
    if(!actions){ actions=document.createElement('div'); actions.className='panel-actions'; head.appendChild(actions); }
    if(!actions.querySelector('[data-help]')){
      const b=document.createElement('button'); b.type='button'; b.className='icon-btn'; b.textContent='?';
      b.setAttribute('aria-label','Panel help'); b.title='Panel help'; b.setAttribute('data-help',sec.id);
      actions.insertBefore(b, actions.firstChild);
    }
    let tog=actions.querySelector('[data-collapse-panel]');
    if(!tog){
      tog=document.createElement('button'); tog.type='button'; tog.className='icon-btn';
      tog.setAttribute('data-collapse-panel',''); tog.setAttribute('aria-label','Collapse or expand panel');
      tog.title='Collapse / expand';
      actions.appendChild(tog);
    }
    const col=panelCollapsed(sec.id);
    sec.classList.toggle('collapsed', col);
    tog.textContent=col?'+':'−';
    tog.setAttribute('aria-expanded',String(!col));
    tog.setAttribute('aria-controls',sec.id);
  });
}
/* CSV row builders (exported so the tests can assert the exact file content). Pure: no DOM. */
function isoDay(d){ if(!(d instanceof Date)||isNaN(d)) return ''; const p=n=>String(n).padStart(2,'0'); return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate()); }
export function lookCsvRows(look){
  if(!look||!look.list||!look.list.length) return [];
  const from=look.from, DAY=86400000;
  return [['Package','Discipline','PO Plan','In (days)','Status']].concat(
    look.list.map(p=>[p.title,p.discipline||'',isoDay(p.poPlan),Math.max(0,Math.round((p.poPlan-from)/DAY)),p.status||'']));
}
export function overdueCsvRows(ov){
  if(!ov||!ov.rows||!ov.rows.length) return [];
  return [['Package','Discipline','Overdue Stage','Plan','Forecast','Overdue (days)','Status']].concat(
    ov.rows.map(r=>[r.p.title,r.p.discipline||'',r.lab,isoDay(r.p[r.k+'Plan']),isoDay(r.p[r.k+'Forecast']),r.days,r.p.status||'']));
}
export function validationCsvRows(report){
  if(!report||!report.issues||!report.issues.length) return [];
  return [['Severity','Rule','Package','Field','Value','Message']].concat(
    report.issues.map(i=>[i.sev,i.code,i.pkg,i.field,i.value,i.msg]));
}
export function rowsToCsv(rows){
  return rows.map(r=>r.map(v=>'"'+String(v==null?'':v).replace(/"/g,'""')+'"').join(',')).join('\r\n');
}

/* ============== P6.1 shell wiring ============== */
let settingsModalEl=null;
function ensureSettingsModal(){
  if(settingsModalEl) return settingsModalEl;
  const m=document.createElement('div'); m.className='help-modal'; m.hidden=true;
  m.innerHTML='<div class="box" role="dialog" aria-modal="true"><header><h3>Settings</h3>' +
    '<button class="close" title="Close" aria-label="Close settings">✕</button></header>' +
    '<div class="body"><div class="settings-row"><div><div class="lbl">Theme</div>' +
    '<div class="hint">Applied to this browser and remembered.</div></div>' +
    '<div class="theme-opts">' +
      ['light','dark','sky','ocean','presentation'].map(x=>'<button type="button" data-theme-opt="'+x+'">'+x.charAt(0).toUpperCase()+x.slice(1)+'</button>').join('') +
      '</div></div>' +
    '<div class="settings-row"><div><div class="lbl">KPI density</div>' +
    '<div class="hint">Use the layout button in the menu bar. It cycles 6 → 3 → 2 columns.</div></div>' +
    '<div class="hint" id="settingsLayout">1</div></div></div></div>';
  m.addEventListener('click',e=>{ if(e.target===m) m.hidden=true; });
  m.querySelector('.close').onclick=()=>{ m.hidden=true; };
  m.querySelectorAll('[data-theme-opt]').forEach(b=>b.onclick=()=>{
    const opt=b.getAttribute('data-theme-opt');
    try{ localStorage.setItem('ppp-chart-theme', opt); }catch(e){}
    applyTheme(opt);
    syncThemeOpts();
  });
  (document.body||document.documentElement).appendChild(m);
  settingsModalEl=m; return m;
}
function syncThemeOpts(){
  const cur=THEMES.indexOf(getTheme())>=0?getTheme():'light';
  document.querySelectorAll('[data-theme-opt]').forEach(b=>b.classList.toggle('active', b.getAttribute('data-theme-opt')===cur));
}
function applyLayout(){
  const n=parseInt(getPref('layout'),10);
  const mode=[1,2,3].includes(n)?n:1;
  const body=document.getElementById('dashBody'); if(body) body.setAttribute('data-layout',String(mode));
  const lab=document.getElementById('settingsLayout'); if(lab) lab.textContent=String(mode);
}
function wireShell(){
  /* left sidebar: toggle (menu bar), resize, navigation */
  const sb=document.getElementById('navSidebar');
  const toggle=document.getElementById('sbToggle');
  if(toggle&&sb) toggle.onclick=()=>{
    const col=sb.classList.toggle('collapsed');
    toggle.setAttribute('aria-expanded',String(!col));
  };
  /* 3.4.1 / 3.2: on a narrow viewport the sidebar starts collapsed (the toggle still opens it),
     so navigation stays reachable at every width without consuming the content column. */
  if(sb && toggle && window.innerWidth<=820){
    sb.classList.add('collapsed');
    toggle.setAttribute('aria-expanded','false');
  }
  const rz=document.getElementById('sbResize');
  if(rz&&sb){
    let startX=0,startW=160,drag=false;
    rz.addEventListener('mousedown',e=>{ drag=true; startX=e.clientX; startW=sb.getBoundingClientRect().width; e.preventDefault(); });
    window.addEventListener('mousemove',e=>{
      if(!drag) return;
      const w=Math.min(320,Math.max(140,startW+(e.clientX-startX)));
      sb.style.width=w+'px';
    });
    window.addEventListener('mouseup',()=>{
      if(!drag) return; drag=false;
      try{ localStorage.setItem('ppp-sidebar-w',String(Math.round(sb.getBoundingClientRect().width))); }catch(e){}
    });
    try{ const w=parseInt(localStorage.getItem('ppp-sidebar-w'),10); if(w>=140&&w<=320) sb.style.width=w+'px'; }catch(e){}
  }
  const pageName=document.getElementById('pageName');
  const PAGE_LABELS={overview:'Overview',schedule:'PO Schedule',overdue:'Overdue',quality:'Data Quality'};
  const dashBody=document.getElementById('dashBody');
  function setPage(p){
    const v=PAGE_LABELS[p]?p:'overview';
    if(dashBody) dashBody.setAttribute('data-page',v);
    document.querySelectorAll('.sb-item[data-page]').forEach(b=>b.classList.toggle('active', b.getAttribute('data-page')===v));
    if(pageName) pageName.textContent=PAGE_LABELS[v];
    try{ localStorage.setItem('ppp-page',v); }catch(e){}
    try{ if(typeof syncAllSplits==='function') syncAllSplits(); }catch(e){}
  }
  document.querySelectorAll('.sb-item[data-page]').forEach(btn=>{
    btn.onclick=()=>setPage(btn.getAttribute('data-page'));
  });
  let savedPage='overview'; try{ savedPage=localStorage.getItem('ppp-page')||'overview'; }catch(e){}
  setPage(savedPage);
  initTips();
  const settingsBtn=document.getElementById('settingsBtn');
  if(settingsBtn) settingsBtn.onclick=()=>{ const m=ensureSettingsModal(); syncThemeOpts(); m.hidden=false; };
  const helpBtn=document.getElementById('helpBtn');
  if(helpBtn) helpBtn.onclick=()=>openHelp('general');

  /* menu bar: export, search, warnings, layout */
  const exportBtn=document.getElementById('exportBtn');
  const exportMenu=document.getElementById('exportMenu');
  if(exportBtn&&exportMenu) exportBtn.onclick=e=>{
    e.stopPropagation();
    const open=exportMenu.classList.toggle('open');
    exportBtn.setAttribute('aria-expanded',String(open));
  };
  document.querySelectorAll('#exportMenu [data-export]').forEach(b=>b.onclick=()=>{
    exportMenu.classList.remove('open'); exportBtn.setAttribute('aria-expanded','false');
    if(b.getAttribute('data-export')==='val') exportValidationCsv(); else exportLookCsv();
  });
  const searchBtn=document.getElementById('searchBtn');
  const searchPop=document.getElementById('searchPop');
  const searchInput=document.getElementById('searchInput');
  const searchCol=document.getElementById('searchCol');
  if(searchCol){
    try{ const v=localStorage.getItem('ppp-search-field'); if(v) STATE.searchField=v; }catch(e){}
    const opts=searchCol.options;
    if(opts && opts.length){
      if(![...opts].some(o=>o.value===STATE.searchField)) STATE.searchField='all';
      searchCol.value=STATE.searchField;
    } else if(!searchCol.options){ STATE.searchField=STATE.searchField||'all'; }
    searchCol.addEventListener('change',()=>{
      STATE.searchField=searchCol.value;
      try{ localStorage.setItem('ppp-search-field',STATE.searchField); }catch(e){}
      render();
    });
  }
  if(searchBtn&&searchPop) searchBtn.onclick=e=>{
    e.stopPropagation();
    const open=searchPop.classList.toggle('open');
    searchBtn.setAttribute('aria-expanded',String(open));
    if(open&&searchInput) searchInput.focus();
  };
  const searchGo=document.getElementById('searchGo');
  if(searchGo&&searchInput){
    searchGo.onclick=()=>{ STATE.search=searchInput.value; render(); searchInput.focus(); };
  }
  if(searchInput){
    let timer=null;
    searchInput.value=STATE.search||'';
    searchInput.addEventListener('input',()=>{
      clearTimeout(timer);
      timer=setTimeout(()=>{ STATE.search=searchInput.value; render(); },120);
    });
    searchInput.addEventListener('keydown',e=>{
    if(e.key==='Enter'){ e.preventDefault(); STATE.search=searchInput.value; render(); return; }
    if(e.key==='Escape'){ searchPop.classList.remove('open'); searchBtn.setAttribute('aria-expanded','false'); }
  });
  }
  const warnBtn=document.getElementById('warnBtn');
  if(warnBtn) warnBtn.onclick=()=>{
    STATE.ui.warnHidden=!STATE.ui.warnHidden;
    const b=document.getElementById('errBanner'); if(b) b.classList.toggle('hidden',!!STATE.ui.warnHidden);
    warnBtn.setAttribute('aria-pressed',String(!STATE.ui.warnHidden));
  };
  const layoutBtn=document.getElementById('layoutBtn');
  if(layoutBtn) layoutBtn.onclick=()=>{
    const raw=parseInt(getPref('layout'),10);
    const cur=[1,2,3].includes(raw)?raw:1;
    const next=cur===1?2:cur===2?3:1;
    setPref('layout',next);
    applyLayout();
  };
  applyLayout();

  /* one document click closes the popovers */
  document.addEventListener('click',e=>{
    [['exportMenu','exportBtn'],['searchPop','searchBtn']].forEach(([mid,bid])=>{
      const m=document.getElementById(mid), b=document.getElementById(bid);
      if(!m||!b) return;
      if(!m.contains(e.target) && !b.contains(e.target)){
        m.classList.remove('open'); b.setAttribute('aria-expanded','false');
      }
    });
  });

  /* clear a hidden warning area when new warning content arrives */
  STATE.ui.warnHidden=false;
}

/* S6 - all DOM wiring runs once, from boot(). Importing this module in Node has no DOM side effect. */
export function boot(){
wirePoBars();
document.getElementById('tfBtn').addEventListener('click',e=>{
  e.stopPropagation();
  const panel=document.getElementById('tfPanel');
  const open=panel.classList.toggle('open');
  document.getElementById('tfBtn').setAttribute('aria-expanded', open);
});
document.addEventListener('click',e=>{
  if(!document.getElementById('tfWrap').contains(e.target)){
    document.getElementById('tfPanel').classList.remove('open');
    document.getElementById('tfBtn').setAttribute('aria-expanded','false');
  }
});
document.getElementById('ovlList').addEventListener('click', e=>{
  const btn=e.target.closest('.drill-btn');
  if(btn){ const row=btn.closest('.expandable'); if(row) toggleOvlDetail(row); return; }
  const row=e.target.closest('.expandable'); if(row) toggleOvlDetail(row);
});
document.getElementById('ovlList').addEventListener('keydown', e=>{
  if(e.key!=='Enter' && e.key!==' ') return;
  const row=e.target.closest('.expandable'); if(!row) return;
  e.preventDefault(); toggleOvlDetail(row);
});
document.getElementById('dash').addEventListener('click',e=>{
  const hbtn=e.target.closest('[data-help]');
  if(hbtn){ openHelp(hbtn.getAttribute('data-help')); return; }
  const cbtn=e.target.closest('[data-collapse-panel]');
  if(cbtn){
    const sec=cbtn.closest('.card'); if(!sec) return;
    const col=!sec.classList.contains('collapsed');
    STATE.ui.collapsed[sec.id]=col;
    try{ localStorage.setItem('ppp-pc-'+sec.id, col?'1':'0'); }catch(err){}
    sec.classList.toggle('collapsed',col);
    cbtn.textContent=col?'+':'−';
    cbtn.setAttribute('aria-expanded',String(!col));
    return;
  }
  const seg=e.target.closest('.seg');
  if(seg){ const btn=e.target.closest('button'); if(btn){ const key=seg.getAttribute('data-key'), t=btn.getAttribute('data-t');
    if(key==='interactive'||key.indexOf('inter-')===0){ setPref(key,t); render(); }
    else if(key==='look'){ setPref(key,t); render(); }  /* horizon change re-derives and repaints */
    else if(key==='ovlStage'){ setPref(key,t); render(); }  /* stage change re-derives and repaints */
    else { setPref(key,t); } } return; }
  /* I-71: both text actions are now .btn-secondary, so the class no longer discriminates them —
     data-act is the behaviour hook and .btn-secondary is purely the shared A3 presentation class. */
  const copy=e.target.closest('[data-act="copy"]'), dl=e.target.closest('[data-act="dl"]');
  if(copy){ const id=copy.getAttribute('data-svg'); copyChart(id,(document.getElementById('projTitle').textContent||'chart')+' '+(id||'chart')); }
  if(dl){ const id=dl.getAttribute('data-svg'); const el=document.getElementById(id); if(el){ chartToCanvas(el).then(c=>{ downloadBlob(c.toDataURL('image/png'), (document.getElementById('projTitle').textContent||'chart')+' '+(id||'chart')+'.png'); toast('Downloaded PNG'); }).catch(err=>toast('Export failed: '+err.message)); } else { toast('Nothing to export'); } }
});
function exportLookCsv(){
  const L=STATE.view&&STATE.view.panels.look;
  const rows=lookCsvRows(L);
  if(!rows.length){ toast('Nothing to export'); return; }
  downloadBlob(new Blob(['\ufeff'+rowsToCsv(rows)],{type:'text/csv;charset=utf-8'}), (document.getElementById('projTitle').textContent||'packages')+' - PO look-ahead '+L.h+'m.csv');
  toast('Look-ahead exported ('+L.list.length+' rows)');
}
function exportValidationCsv(){
  const rows=validationCsvRows(STATE.report);
  if(!rows.length){ toast('Nothing to export'); return; }
  downloadBlob(new Blob(['\ufeff'+rowsToCsv(rows)],{type:'text/csv;charset=utf-8'}), (document.getElementById('projTitle').textContent||'validation')+' - validation report.csv');
  toast('Validation report exported');
}
function exportOverdueCsv(){
  const ov=STATE.view&&STATE.view.panels.overdue;
  const rows=overdueCsvRows(ov);
  if(!rows.length){ toast('Nothing to export'); return; }
  downloadBlob(new Blob(['\ufeff'+rowsToCsv(rows)],{type:'text/csv;charset=utf-8'}), (document.getElementById('projTitle').textContent||'packages')+' - overdue '+ov.sel+'.csv');
  toast('Overdue list exported ('+ov.rows.length+' rows)');
}
function exportBenchCsv(){
  const rows=benchCsvRows();
  downloadBlob(new Blob(['\ufeff'+rowsToCsv(rows)],{type:'text/csv;charset=utf-8'}), (document.getElementById('projTitle').textContent||'lead time')+' - benchmark.csv');
  toast('Benchmark list exported ('+(rows.length-1)+' rows)');
}
/* §7.8 — CSV export of the look-ahead list: same UTF-8 BOM rule as the validation report, and
   the exported rows are exactly the rows on screen (same filter, same sort, same horizon). */
const lookExp=document.getElementById('lookExport'); if(lookExp) lookExp.addEventListener('click', exportLookCsv);
const vExp=document.getElementById('vExport'); if(vExp) vExp.addEventListener('click', exportValidationCsv);
const ovlExp=document.getElementById('ovlExport'); if(ovlExp) ovlExp.addEventListener('click', exportOverdueCsv);
const benchExp=document.getElementById('benchExport'); if(benchExp) benchExp.addEventListener('click', exportBenchCsv);
const vCols=document.getElementById('vCols');
if(vCols) vCols.addEventListener('click', ()=>{
  const cols=STATE.ui.valCols;
  const compact=cols.value||cols.message;   // full → compact (hide Value + Message) → full
  cols.value=!compact; cols.message=!compact;
  vCols.setAttribute('aria-pressed', String(compact));
  vCols.textContent=compact?'Columns':'Columns';
  if(STATE.view) safeCall(()=>renderValidation(STATE.view, STATE.model), 'vcard');
});
const fileInput=document.getElementById('fileInput');
document.getElementById('openBtn').onclick=()=>fileInput.click();
const loadBtn=document.getElementById('loadBtn'); if(loadBtn) loadBtn.onclick=()=>fileInput.click();
fileInput.onchange=e=>{ const f=e.target.files[0]; if(f) handleFile(f); e.target.value=''; };
const _cpy=document.getElementById('cpyYear'); if(_cpy) _cpy.textContent=new Date().getFullYear();
applyTheme(getTheme());
wireShell();
(function(){
  const win=document.getElementById('poWin'); if(!win) return;
  const wf=win.querySelector('.wf'), wt=win.querySelector('.wt');
  if(wf) wf.addEventListener('input',()=>{ if(!STATE.view||!STATE.view.panels.po)return; STATE.poWin.from=+wf.value; drawPPSCurve(); });
  if(wt) wt.addEventListener('input',()=>{ if(!STATE.view||!STATE.view.panels.po)return; STATE.poWin.to=+wt.value; drawPPSCurve(); });
})();
const drop=document.getElementById('drop');
drop.onclick=e=>{ if(e.target.id!=='openBtn') fileInput.click(); };
['dragenter','dragover'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.add('hover');}));
['dragleave','drop'].forEach(ev=>drop.addEventListener(ev,e=>{e.preventDefault();drop.classList.remove('hover');}));
drop.addEventListener('drop',e=>{ const f=e.dataTransfer.files[0]; if(f) handleFile(f); });
}

