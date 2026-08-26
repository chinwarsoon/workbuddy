"use strict";

  const $ = id => document.getElementById(id);
  const uid = p => p + Math.random().toString(36).slice(2,8);
  const esc = s => String(s==null?"":s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  const cap = s => (s||"").charAt(0).toUpperCase()+ (s||"").slice(1);
  const todayStr = () => new Date().toISOString().slice(0,10);
  let edDirty = false;
  let exportSel = new Set();

  // ---- State ----
  const state = {
    projects: [], disciplines: [], statuses: [], priorities: [], actions: [],
    referencePoints: [],
    loadedFile: null,
    expanded: {},
    nextId: 1,
    perspective: 'actions',
    selection: { actions:null, projects:null, disciplines:null, reports:'status', search:'overdue', settings:'appearance', help:'start' },
    searchOpen: null,
    filter: '',
    pendingAdd: null,
    editTarget: null,
    editingId: null,
    layout: { activity:true, sidebar:true, right:true, topbar:true, dark:false, sw:260, rw:300, theme:'light', treeIndent:16 },
    members: [],
    migrated: false,
    dataDirty: false,
    setupDirty: false,
    customFields: [],
    // UI settings — loaded from setup.json; falls back to these built-in defaults.
    setup: {
      brand: { accent: '#0066CC' },
      appearance: { dark:false, activity:true, sidebar:true, right:true, topbar:true, theme:'light', panelWidths:{ sidebar:260, right:300 } },
      labels: {},
      defaultView: { perspective:'actions', reports:'status', search:'overdue', settings:'appearance', help:'start' },
      help: {},
      reports: null,
      filters: null
    }
  };

  // ---- Schema-driven status / member helpers ----
  const CURRENT_SCHEMA = 3;   // bump when the JSON schema changes; drives legacy migration detection
  // Curated, distinguishable status palette — first 6 are semantic anchors so the
  // seed statuses (Pending/In Progress/Completed/Blocked/On Hold/Not Started) get
  // meaningful colors; hue AND lightness vary so adjacent statuses stay separable.
  const STATUS_PALETTE = ['#E7DAFF','#D6E4FF','#D7F5DD','#FFD2D2','#FFE9BD','#E2E8F0','#CFEFFE','#EAFBD0','#FFD6EC','#FCE7F3','#E5E7EB','#FEF3C7'];
  const STATUS_SWATCH_NAMES = ['Purple','Blue','Green','Red','Amber','Slate','Cyan','Lime','Pink','Rose','Gray','Light Amber'];
  const slug = s => String(s==null?'':s).toLowerCase().trim().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'') || 'x';
  function normStatus(s, i){
    if(typeof s==='string') return { id: slug(s), label:s, color: STATUS_PALETTE[i%STATUS_PALETTE.length], builtin:false };
    const o = s||{};
    return { id: o.id||slug(o.label||('status-'+(i+1))), label: o.label||o.id||('Status '+(i+1)), color: o.color||STATUS_PALETTE[i%STATUS_PALETTE.length], builtin: !!o.builtin };
  }
  function normMember(m){
    if(typeof m==='string') return { id: uid('m'), name:m, initials:m, role:'', disciplineId:'', left:false, deletedOn:'', color:'' };
    const o=m||{}; return { id:o.id||uid('m'), name:o.name||'', initials:o.initials||o.name||'', role:o.role||'', disciplineId:o.disciplineId||'', left:!!o.left, deletedOn:o.deletedOn||'', color:o.color||'' };
  }
  function findStatus(s){ if(!s) return null; const k=String(s).toLowerCase(); return state.statuses.find(x=>(x.id&&x.id.toLowerCase()===k)||x.label.toLowerCase()===k)||null; }
  function statusLabel(s){ const st=findStatus(s); return st? st.label : (s||'—'); }
  function statusColor(s){ const st=findStatus(s); return st? st.color : '#EFEAFB'; }
  function textOn(hex){ const c=(hex||'#EFEAFB').replace('#',''); const r=parseInt(c.substr(0,2),16)||0, g=parseInt(c.substr(2,2),16)||0, b=parseInt(c.substr(4,2),16)||0; return (0.299*r+0.587*g+0.114*b)>150? '#1d1d1f' : '#ffffff'; }
  function statusStyle(s){ const bg=statusColor(s); return `background:${bg};color:${textOn(bg)}`; }
  function toHex6(c){ if(!c) return '#EFEAFB'; if(c[0]==='#'&&c.length===4) return '#'+c.slice(1).split('').map(x=>x+x).join(''); return c; }
  const projName = id => (state.projects.find(p=>p.id===id)||{}).name || '—';
  const discName = id => (state.disciplines.find(d=>d.id===id)||{}).name || '—';
  const liveActions = () => state.actions.filter(a=>!a.deleted);
  const actionsOf = (pid,did) => liveActions().filter(a=>a.projectId===pid && a.disciplineId===did);
  // ---- Schema v3 decomposition (parent/child WBS), max 3 tiers (ISS-11) ----
  const MAX_TIER = 3;
  // 新建动作 / 子动作的默认工期（天）。父动作为只读汇总，不写 schedule。
  const DEFAULT_DURATION = 0;
  const childrenOf = id => liveActions().filter(a=>a.parentId===id);
  function actionTier(aOrId){
    const start = (typeof aOrId==='object' && aOrId) ? aOrId : state.actions.find(x=>x.id===aOrId);
    let a=start, t=1; const seen=new Set();
    while(a && a.parentId!=null && !seen.has(a.id)){ seen.add(a.id); const p=state.actions.find(x=>x.id===a.parentId); if(!p) break; t++; a=p; }
    return t;
  }
  // Duration-weighted progress rollup (ISS-21): Σ(子进度 × 子工期) / Σ子工期，父级只读。
  // 工期来源：leaf 的 schedule.duration（天，数字），无工期视为 1。
  function rollupParent(a){
    const kids=childrenOf(a.id); const total=kids.length;
    const done=kids.filter(k=>aStatusId(k)===(findStatus('Completed')||{}).id).length;
    if(total===0) return { count:0, done:0, pct:0, planStart:null, planFinish:null, duration:0, progress:0 };
    // Duration-weighted progress
    let weightedSum=0, durSum=0;
    kids.forEach(k=>{
      const d = (k.schedule && Number.isFinite(+k.schedule.duration)) ? +k.schedule.duration : 1;
      const p = Number.isFinite(+k.progress) ? +k.progress : 0;
      weightedSum += p * d; durSum += d;
    });
    const progress = durSum ? Math.round(weightedSum / durSum) : 0;
    // Rollup dates from leaf schedules
    const leafKids = kids.filter(k=>childrenOf(k.id).length===0 && k.schedule && k.schedule.planStart);
    let planStart=null, planFinish=null, duration=0;
    if(leafKids.length){
      const starts = leafKids.map(k=>new Date(k.schedule.planStart));
      const finishes = leafKids.map(k=> k.schedule.duration ? new Date(new Date(k.schedule.planStart).getTime()+k.schedule.duration*86400000) : new Date(k.schedule.planStart));
      planStart = new Date(Math.min(...starts)).toISOString().slice(0,10);
      planFinish = new Date(Math.max(...finishes)).toISOString().slice(0,10);
      duration = Math.round((new Date(planFinish)-new Date(planStart))/86400000) + 1;
    }
    return { count:total, done, pct: total? Math.round(done/total*100):0, planStart, planFinish, duration, progress };
  }
  // ---- Schema v3 dependency network (ISS-14/16/17) ----
  const DEP_TYPES = ['FS','SS','FF','SF'];   // Finish-to-Start / Start-to-Start / Finish-to-Finish / Start-to-Finish
  function normReferencePoint(r){ const o=r||{}; return { id:o.id||uid('r'), name:o.name||'Reference', date:o.date||'', projectId:o.projectId||'' }; }
  function actionDeps(a){ return Array.isArray(a.deps) ? a.deps : []; }
  // CPM-style cycle guard: walk forward from predId via its action deps; if we reach
  // aId, the new link would close a loop. Reference-point predecessors never continue the walk.
  function wouldCreateCycle(aId, predId){
    const seen = new Set(); let stack = [predId];
    while(stack.length){
      const cur = stack.pop();
      if(cur === aId) return true;
      if(seen.has(cur)) continue;
      seen.add(cur);
      const act = state.actions.find(x=>x.id===cur);
      if(act) actionDeps(act).forEach(d=>{ if(d.predKind==='action') stack.push(d.predId); });
    }
    return false;
  }
  function depLabel(d){
    const pre = d.predKind==='reference' ? ('◇ '+((state.referencePoints.find(r=>r.id===d.predId)||{}).name||'Ref'))
                                          : ('#'+d.predId+' '+((state.actions.find(x=>x.id===d.predId)||{}).title||'?'));
    return pre + ' · ' + d.type + (d.lag ? ' ('+(d.lag>0?'+':'')+d.lag+'d)' : '');
  }
  // Info 状态常量（系统内置，ISS-22）
  const INFO_STATUS_ID = 'info';
  // 判断 action 是否参与排期：有 planStart 且状态不是 Info
  function isScheduled(a){
    if(!a) return false;
    if(!a.schedule || !a.schedule.planStart) return false;
    if(aStatusId(a)===INFO_STATUS_ID) return false;
    return true;
  }
  // WBS 冲突守卫（ISS-33）：禁止依赖自己的祖先或子孙（非环但排期自相矛盾）
  // 返回 true 表示该依赖会产生 WBS 冲突
  function wouldCreateWbsConflict(aId, predId){
    const a = state.actions.find(x=>x.id===aId);
    const pred = state.actions.find(x=>x.id===predId);
    if(!a || !pred) return false;
    // 向上找祖先
    let cur = a;
    while(cur && cur.parentId!=null){
      if(cur.parentId===predId) return true;
      cur = state.actions.find(x=>x.id===cur.parentId);
    }
    // 向下找子孙（广度优先）
    const queue = [predId];
    const seen = new Set();
    while(queue.length){
      const cid = queue.shift();
      if(seen.has(cid)) continue;
      seen.add(cid);
      if(cid===aId) return true;
      childrenOf(cid).forEach(ch=>queue.push(ch.id));
    }
    return false;
  }
  // Schema v2: assignee resolution is id-first, with orphan name fallbacks kept for rectification.
  const memberNameById = id => (state.members.find(m=>m.id===id)||{}).name || '';
  const assigneeList = a => {
    const ids = Array.isArray(a.assignedToIds) ? a.assignedToIds.filter(Boolean) : [];
    const byId = ids.map(id=>memberNameById(id)).filter(Boolean);
    const byName = Array.isArray(a.assignedToNames) ? a.assignedToNames.filter(Boolean) : [];
    const legacy = Array.isArray(a.assignedTo) ? a.assignedTo.filter(Boolean) : (a.assignedTo ? String(a.assignedTo).split(',').map(s=>s.trim()).filter(Boolean) : []);
    return [...new Set([...byId, ...byName, ...legacy])];
  };
  const assigneesTxt = a => assigneeList(a).join(', ') || '—';
  const aStatusId = a => a.statusId || (findStatus(a.status)||{}).id || '';
  const aStatusLabel = a => a.statusLabel || statusLabel(a.statusId || a.status);
  const aStatusStyle = a => a.statusLabel ? 'background:#F5F5F7;color:#9A9A9A;' : statusStyle(a.statusId);
  const aPriorityId = a => a.priorityId || (findPriority(a.priority)||{}).id || '';
  const aPriorityLabel = a => a.priorityLabel || priorityLabel(a.priorityId || a.priority);
  const aPriorityStyle = a => a.priorityLabel ? 'background:#F5F5F7;color:#9A9A9A;' : priorityStyle(a.priorityId);
  const creatorName = a => a.createdByName || memberNameById(a.createdById) || a.createdBy || '—';
  const priorityRank = a => { const i=state.priorities.findIndex(p=>p.id===aPriorityId(a)); return i<0?999:i; };
  const projStats = pId => {
    const acts = liveActions().filter(a=>a.projectId===pId);
    const total = acts.length;
    const done = acts.filter(a=>aStatusId(a)===(findStatus('Completed')||{}).id).length;
    const blocked = acts.filter(a=>aStatusId(a)===(findStatus('Blocked')||{}).id).length;
    return { total, done, blocked, pct: total? Math.round(done/total*100):0 };
  };

  // ---- Per-project scoping (A1): global catalog + per-project assignments ----
  const projById = id => state.projects.find(p=>p.id===id) || null;
  const projectDisciplineIds = p => (p && Array.isArray(p.disciplineIds)) ? p.disciplineIds.slice() : (p ? [] : []);
  const projectDisciplines = p => projectDisciplineIds(p).map(id=>state.disciplines.find(d=>d.id===id)).filter(Boolean);
  const projectMemberIds = p => (p && Array.isArray(p.memberIds)) ? p.memberIds.slice() : (p ? state.members.filter(m=>!m.left).map(m=>m.id) : []);
  const projectMembers = p => projectMemberIds(p).map(id=>state.members.find(m=>m.id===id)).filter(Boolean);
  function ensureProjectLists(p){
    if(!p) return p;
    if(p.code===undefined || p.code===null) p.code='';
    if(!Array.isArray(p.disciplineIds)) p.disciplineIds = state.disciplines.map(d=>d.id);
    if(!Array.isArray(p.memberIds) && state.members.length) p.memberIds = state.members.filter(m=>!m.left).map(m=>m.id);
    if(!Array.isArray(p.customFieldKeys)) p.customFieldKeys = [];
    if(!Array.isArray(p.customFields)) p.customFields = [];
    return p;
  }
  function populateDisciplineSelect(sel, projectId, val){
    const list = projectDisciplines(projById(projectId));
    let opts = list.map(d=>`<option value="${esc(d.id)}"${d.id===val?' selected':''}>${esc(d.name)}</option>`).join('');
    if(val && !list.some(d=>d.id===val)) opts += `<option value="${esc(val)}" selected>${esc((state.disciplines.find(d=>d.id===val)||{}).name||val)} (not in project)</option>`;
    sel.innerHTML = opts || '<option value="">— no disciplines —</option>';
  }

  // ---- Custom Fields (Phase 3, ISS-28) ----
  // Global catalog in setup.json: customFields[]
  // Per-project enablement: project.customFieldKeys[] (keys from global catalog)
  // Per-project local fields: project.customFields[] (full defs, merged at runtime)
  // Action values: action.custom{} keyed by field `key` (stable string)
  const CUSTOM_FIELD_TYPES = ['text','number','date','select','multiselect','boolean','url','email'];
  const CUSTOM_FIELD_KEY_RE = /^[a-z][a-z0-9_ ]*$/;
  function normCustomField(f, i){
    const o = f || {};
    return {
      id: o.id || uid('cf'),
      key: o.key || ('field'+(i+1)),
      label: o.label || ('Field '+(i+1)),
      type: CUSTOM_FIELD_TYPES.includes(o.type) ? o.type : 'text',
      options: Array.isArray(o.options) ? o.options.filter(Boolean) : null,
      required: !!o.required,
      default: o.default !== undefined ? o.default : defaultForType(o.type),
      description: o.description || ''
    };
  }
  function defaultForType(type){
    switch(type){
      case 'number': return 0;
      case 'boolean': return false;
      case 'date': return todayStr();
      case 'select': return null; // first option handled at render
      case 'multiselect': return [];
      case 'url':
      case 'email':
      case 'text':
      default: return '';
    }
  }
  function validateCustomFieldKey(key){
    return CUSTOM_FIELD_KEY_RE.test(String(key||'').trim());
  }
  // Auto-generate a stable, unique custom-field key from its label (readonly in UI).
  // Example: "Budget (CNY)" -> "budget cny"; bumps a suffix if it collides.
  function generateCustomFieldKey(label, existingKeys){
    const used = new Set(((existingKeys||[]).map(k=>String(k).toLowerCase())));
    let base = String(label||'').toLowerCase().trim().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim().replace(/\s/g,' ');
    if(!base) base = 'field';
    let key = base, n=2;
    while(used.has(key)){ key = base+' '+n; n++; }
    return key;
  }
  // Merge global catalog + project local fields, filtered by project.customFieldKeys
  function getCustomFieldsForProject(pid){
    const p = projById(pid);
    if(!p) return [];
    const global = (state.customFields || []).map(f=>normCustomField(f));
    const local = (p.customFields || []).map(f=>normCustomField(f));
    const enabledKeys = new Set((p.customFieldKeys || []).filter(k=>global.some(g=>g.key===k)));
    const merged = [...global.filter(g=>enabledKeys.has(g.key)), ...local];
    // deduplicate by key (local wins)
    const seen = new Set();
    return merged.filter(f=>{
      if(seen.has(f.key)) return false;
      seen.add(f.key);
      return true;
    });
  }
  // Get a single field def by key for a project
  function getCustomFieldDef(pid, key){
    return getCustomFieldsForProject(pid).find(f=>f.key===key) || null;
  }
  // Apply default values to action.custom for a project
  function applyCustomFieldDefaults(action){
    if(!action.projectId) return;
    const fields = getCustomFieldsForProject(action.projectId);
    const custom = action.custom || {};
    fields.forEach(f=>{
      if(custom[f.key] === undefined || custom[f.key] === null || custom[f.key] === ''){
        const def = f.default;
        if(def !== undefined && def !== null) custom[f.key] = (typeof def==='function') ? def() : def;
      }
    });
    if(Object.keys(custom).length) action.custom = custom;
  }

  // ---- Priority metadata (schema-driven, lives in action.json) ----
  const PRIORITY_PALETTE = ['#FDECEC','#FFE1BD','#E6F0FF','#E2E8F0','#E3F5E9','#FCE7F3'];
  function normPriority(p, i){
    if(typeof p==='string') return { id: slug(p), label:p, color: PRIORITY_PALETTE[i%PRIORITY_PALETTE.length] };
    const o=p||{}; return { id:o.id||slug(o.label||('priority-'+(i+1))), label:o.label||o.id||('Priority '+(i+1)), color:o.color||PRIORITY_PALETTE[i%PRIORITY_PALETTE.length] };
  }
  function findPriority(p){ if(!p) return null; const k=String(p).toLowerCase(); return state.priorities.find(x=>(x.id&&x.id.toLowerCase()===k)||x.label.toLowerCase()===k)||null; }
  function priorityLabel(p){ const pr=findPriority(p); return pr? pr.label : (p||'—'); }
  function priorityColor(p){ const pr=findPriority(p); return pr? pr.color : '#EFEAFB'; }
  function priorityStyle(p){ const bg=priorityColor(p); return `background:${bg};color:${textOn(bg)}`; }

  // ---- i18n: field labels sourced from setup.json (fallback to English) ----
  function L(key, fallback){ return (state.setup.labels && state.setup.labels[key]) || fallback; }

  // ---- Minimal safe markdown -> HTML (for setup-driven help articles) ----
  function mdToHtml(md){
    if(!md) return '';
    const inline = s => esc(s).replace(/\*\*([^*]+)\*\*/g,'<b>$1</b>').replace(/`([^`]+)`/g,'<code>$1</code>');
    return String(md).split(/\n{2,}/).map(block=>{
      const t=block.trim();
      const h=t.match(/^(#{1,3})\s+(.*)$/); if(h) return `<h${h[1].length} class="ed-section-h">${inline(h[2])}</h${h[1].length}>`;
      if(/^[-*]\s/.test(t)) return '<ul>'+t.split(/\n/).map(li=>'<li>'+inline(li.replace(/^[-*]\s/,''))+'</li>').join('')+'</ul>';
      return '<p>'+inline(t)+'</p>';
    }).join('');
  }

  // ---- Setup (setup.json) application ----
  function applyBrand(){ document.documentElement.style.setProperty('--accent', (state.setup.brand && state.setup.brand.accent) || '#0066CC'); }
  function evalWhere(a, where){
    if(!where || !where.length) return true;
    return where.every(c=>{
      let v=a[c.field]; let val=c.value;
      if(val==='__today__') val=todayStr();
      const empty = v==null || v==='' || (Array.isArray(v)&&v.length===0);
      switch(c.op){
        case 'eq': return String(v)===String(val);
        case 'ne': return String(v)!==String(val);
        case 'lt': return v<val;
        case 'gt': return v>val;
        case 'empty': return empty;
        case 'notempty': return !empty;
        default: return true;
      }
    });
  }
  const BUILTIN_REPORTS=[{id:'status',label:'By Status'},{id:'discipline',label:'By Discipline'},{id:'project',label:'By Project'},{id:'assignee',label:'By Assignee'},{id:'priority',label:'By Priority'}];
  const BUILTIN_FILTERS=[
    {id:'overdue',label:'Overdue',fn:()=>liveActions().filter(a=>a.due && a.due<todayStr() && aStatusId(a)!==((findStatus('Completed')||{}).id))},
    {id:'blocked',label:'Blocked',fn:()=>liveActions().filter(a=>aStatusId(a)===(findStatus('Blocked')||{}).id)},
    {id:'notstarted',label:'Not Started',fn:()=>liveActions().filter(a=>aStatusId(a)===(findStatus('Not Started')||{}).id)},
    {id:'unassigned',label:'Unassigned',fn:()=>liveActions().filter(a=>!assigneeList(a).length)},
    {id:'all',label:'All Actions',fn:()=>liveActions()}
  ];
  function applySetup(s){
    s = s || {};
    if(s.brand && s.brand.accent) state.setup.brand.accent = s.brand.accent;
    if(s.appearance){ const a=s.appearance, pw=a.panelWidths||{};
      state.layout = Object.assign(state.layout, {
        activity: a.activity!==undefined?!!a.activity:state.layout.activity,
        sidebar:  a.sidebar!==undefined?!!a.sidebar:state.layout.sidebar,
        right:    a.right!==undefined?!!a.right:state.layout.right,
        topbar:   a.topbar!==undefined?!!a.topbar:state.layout.topbar,
        dark:     !!a.dark, sw: Number(pw.sidebar)||state.layout.sw, rw: Number(pw.right)||state.layout.rw,
        theme:    a.theme||state.layout.theme,
        treeIndent: (typeof a.treeIndent==='number') ? a.treeIndent : (state.layout.treeIndent||16)
      });
    }
    if(s.labels) state.setup.labels = Object.assign({}, state.setup.labels, s.labels);
    if(s.defaultView) state.setup.defaultView = Object.assign({}, state.setup.defaultView, s.defaultView);
    if(s.help && Array.isArray(s.help)){ const o={}; s.help.forEach(h=>{ if(h&&h.id) o[h.id]={title:h.title||h.id, body:h.body||''}; }); state.setup.help=o; }
    if(s.customFields && Array.isArray(s.customFields)) state.customFields = s.customFields.map(f=>normCustomField(f));
    REPORTS = (s.reports && s.reports.length) ? s.reports.map(r=>({id:r.id,label:r.label})) : BUILTIN_REPORTS.slice();
    FILTERS = (s.filters && s.filters.length) ? s.filters.map(f=>({id:f.id,label:f.label,fn:()=>liveActions().filter(a=>evalWhere(a,f.where||[]))})) : BUILTIN_FILTERS.slice();
    state.setup.reports = (s.reports && s.reports.length) ? s.reports : [];
    state.setup.filters = (s.filters && s.filters.length) ? s.filters : [];
    HELPTOPICS.length=0;
    if(Object.keys(state.setup.help).length) Object.keys(state.setup.help).forEach(k=>HELPTOPICS.push({id:k,label:state.setup.help[k].title}));
    else BUILTIN_HELP_TOPICS.forEach(t=>HELPTOPICS.push(t));
    // default view
    const dv=state.setup.defaultView;
    if(dv && dv.perspective) state.perspective=dv.perspective;
    if(dv) state.selection = Object.assign({}, state.selection, { reports:dv.reports||'status', search:dv.search||'overdue', settings:dv.settings||'appearance', help:dv.help||'start' });
    applyBrand(); applyLayout(); refresh(); updateStatusbar(); updateSaveButtons();
  }
  const BUILTIN_HELP_TOPICS=[{id:'start',label:'Getting started'},{id:'tree',label:'Tree navigation'},{id:'persp',label:'Perspectives'},{id:'data',label:'Import / Export'},{id:'keys',label:'Keyboard shortcuts'}];
  const BUILTIN_HELP_MD = {
    start:{ title:'Getting started', body:'# Getting started\n\nActionTracker helps you organize work across projects and disciplines. Use the left icon rail to switch **perspectives** — each one swaps both the left panel and the main panel.\n\nStart in **Actions**: expand a project, then a discipline, and click an action to see its detail.' },
    tree:{ title:'Tree navigation', body:'# Tree navigation (Actions)\n\nThe left panel is a read-only navigation hierarchy: **Project → Discipline → Action**.\n\n- Click a chevron (▾ / ▸) to expand or collapse a group.\n- Click an action (or its **✎**) to open it inline in the main panel — every field is directly editable.\n- Click a discipline\'s **+** to add a new action.\n- Projects, disciplines, statuses and member names are added or edited only in **Settings**.' },
    persp:{ title:'Perspectives', body:'# Perspectives\n\nEach icon is a perspective that defines both panels:\n\n- **Actions**: tree + detail\n- **Projects**: list + dashboard\n- **Disciplines**: list + cross-project breakdown\n- **Reports**: types + chart\n- **Search**: saved filters + results\n- **Settings / Help**: sections + articles\n\nAll list values — **Projects**, **Disciplines**, **Statuses** and **Members** (names) — are managed only in **Settings**.' },
    data:{ title:'Import / Export', body:'# Import / Export\n\n**Quick Actions** (right panel) holds the main buttons: **Save Actions** / **Save Settings** write `action.json` / `setup.json`, **Export** opens the Word/Excel drawer, plus Import, Layout and **Help**. The top-bar **⋯** menu mirrors these and adds Create, data folder and theme — so they stay reachable even when the right panel is hidden or on narrow screens.\n\n- **Save Actions** writes the current dataset as `action.json`.\n- **Save Settings** writes the UI configuration (brand, labels, default view, help, reports, filters) as `setup.json`.\n\nOn Chromium both pickers open in the data folder you set; elsewhere they download.' },
    keys:{ title:'Keyboard shortcuts', body:'# Keyboard shortcuts\n\n- **Ctrl/Cmd + 1…7** — jump to a perspective.\n- **Ctrl/Cmd + S** — Save Actions (action.json) · **Ctrl/Cmd + Shift + S** — Save Settings (setup.json).\n- **Ctrl/Cmd + E** — open Export · **Ctrl/Cmd + ,** — Settings.\n- **Enter** — commit an inline rename in Settings.\n- **Esc** — cancel an inline edit, close a modal or a mobile drawer.' }
  };

  // ---- Perspective menus ----
  let REPORTS = BUILTIN_REPORTS.slice();
  let FILTERS = BUILTIN_FILTERS.slice();
  let HELPTOPICS = BUILTIN_HELP_TOPICS.slice();
  const SETSECTIONS=[{id:'appearance',label:'Appearance'},{id:'layout',label:'Layout'},{id:'projects',label:'Projects'},{id:'disciplines',label:'Disciplines'},{id:'members',label:'Members'},{id:'fields',label:'Statuses'},{id:'priorities',label:'Priorities'},{id:'referencepoints',label:'Reference Points'},{id:'customfields',label:'Custom Fields'},{id:'data',label:'Data'},{id:'deleted',label:'Deleted'}];

  // ---- Render dispatchers ----
  function renderSidebar(){
    const heads = {
      actions:['ACTIONS','All actions'], projects:['PROJECTS','All projects'],
      disciplines:['DISCIPLINES','All disciplines'], reports:['REPORTS','Report types'],
      search:['SEARCH','Saved filters'], settings:['SETTINGS','Sections'], help:['HELP','Topics']
    };
    const h = heads[state.perspective];
    $('sideHead').textContent=h[0]; $('sideSub').textContent=h[1];
    $('sideToolbar').innerHTML = toolbarHtml();
    const tf=$('treeFilter'); if(tf){ tf.value=state.filter; tf.oninput=e=>{ state.filter=e.target.value; renderSideBody(); }; }
    renderSideBody();
  }
  function toolbarHtml(){
    if(state.perspective==='actions') return `<input id="treeFilter" placeholder="Filter actions…" />`;
    return '';
  }
  function renderSideBody(){
    const p=state.perspective;
    if(p==='actions') return renderTreeBody();
    if(p==='projects') return renderProjSide();
    if(p==='disciplines') return renderDiscSide();
    if(p==='reports') return renderReportSide();
    if(p==='search') return renderSearchSide();
    if(p==='settings') return renderSettingsSide();
    if(p==='help') return renderHelpSide();
  }
  function renderMain(){
    const p=state.perspective;
    // Subhead (action node badge + identity) belongs only to the Actions perspective.
    // Hide it on every other perspective so it never leaks a stale action title.
    if(p!=='actions'){ const s=$('edSubhead'); if(s){ s.innerHTML=''; s.style.display='none'; } }
    if(p==='actions') return renderActionsMain();
    if(p==='projects') return renderProjectsMain();
    if(p==='disciplines') return renderDisciplinesMain();
    if(p==='reports') return renderReportsMain();
    if(p==='search') return renderSearchMain();
    if(p==='settings') return renderSettingsMain();
    if(p==='help') return renderHelpMain();
  }
  function refresh(){ renderSideBody(); renderMain(); updateSaveButtons(); }
  function markDataDirty(){ state.dataDirty=true; updateSaveButtons(); }
  function markSetupDirty(){ state.setupDirty=true; updateSaveButtons(); }
  function updateSaveButtons(){
    ['tbSaveActions','rpSaveActions'].forEach(id=>{ const a=$(id); if(a){ const was=a.dataset.d; a.disabled = !state.dataDirty; if(state.dataDirty && was!=='1') flashBtn(a); a.dataset.d = state.dataDirty?'1':'0'; } });
    ['tbSaveSettings','rpSaveSettings'].forEach(id=>{ const s=$(id); if(s){ const was=s.dataset.d; s.disabled = !state.setupDirty; if(state.setupDirty && was!=='1') flashBtn(s); s.dataset.d = state.setupDirty?'1':'0'; } });
    const es=$('aeSave'); if(es){ const was=es.dataset.d; es.disabled = !edDirty; if(edDirty && was!=='1') flashBtn(es); es.dataset.d = edDirty?'1':'0'; }
    syncTopbarUnsaved();
  }
  function flashBtn(el){ if(!el) return; el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  // Guard: if there are unsaved changes (actions or settings) and the user tries to
  // navigate away (switch perspective/selection or close the window), inform them.
  async function confirmSaveBeforeLeave(){
    if(!state.dataDirty && !state.setupDirty) return true;
    const which=[state.dataDirty?'Actions':'', state.setupDirty?'Settings':''].filter(Boolean).join(' + ');
    if(!confirm('You have unsaved '+which+' changes. Save before leaving?')) return false;
    try{ if(state.dataDirty) await writeDataFile(); }catch(e){}
    if(state.dataDirty) return false; // save was cancelled (picker aborted) — stay
    try{ if(state.setupDirty) await saveSetupFile(); }catch(e){}
    return !state.setupDirty;
  }
  window.addEventListener('beforeunload', e=>{ if(state.dataDirty || state.setupDirty){ e.preventDefault(); e.returnValue=''; } });
  async function setPerspective(p){
    if(!await confirmSaveBeforeLeave()) return false;
    state.perspective=p;
    document.querySelectorAll('.abtn[data-p]').forEach(b=>b.classList.toggle('active', b.dataset.p===p));
    renderSidebar(); renderMain();
    return true;
  }
  async function selectNode(id){
    if(!await confirmSaveBeforeLeave()) return false;
    state.selection[state.perspective]=id; refresh();
    return true;
  }

  // Top bar crumb mirrors the editor breadcrumb (perspective / selection)
  function renderTopbarCrumb(bread){
    const parts=String(bread||'Actions').split(' / ');
    return parts.map((p,i)=> i<parts.length-1
      ? `<span>${esc(p)}</span><span class="sep">/</span>`
      : `<span class="cur">${esc(p)}</span>`).join('');
  }
  function setEdTop(bread, btnLabel, handler){
    const t=$('edTop');
    t.innerHTML = `<div class="ed-bread" id="edBread">${esc(bread)}</div>` + (btnLabel?`<button class="btn primary" id="edTopBtn" style="border-radius:18px;padding:8px 16px;">${esc(btnLabel)}</button>`:'');
    if(btnLabel) $('edTopBtn').onclick=handler;
    const cr=$('tbCrumb'); if(cr) cr.innerHTML = renderTopbarCrumb(bread);
  }

  // ---- Layout ----
  function setSwitch(el,on){
    if(!el) return;
    el.classList.toggle('on',on);
    el.setAttribute('role','switch');
    el.setAttribute('aria-checked', on?'true':'false');
    if(el.getAttribute('tabindex')==null) el.tabIndex=0;
  }
  function applyLayout(){
    const L=state.layout;
    document.body.classList.toggle('hide-topbar', !L.topbar);
    document.body.classList.toggle('hide-activity', !L.activity);
    document.body.classList.toggle('hide-sidebar', !L.sidebar);
    document.body.classList.toggle('hide-right', !L.right);
    document.body.classList.toggle('dark', L.dark);
    document.documentElement.style.setProperty('--sw', L.sw+'px');
    document.documentElement.style.setProperty('--rw', L.rw+'px');
    document.documentElement.style.setProperty('--tree-indent', (L.treeIndent||16)+'px');
  }
  function syncLayoutModal(){
    setSwitch($('swTop'), state.layout.topbar);
    setSwitch($('swActivity'), state.layout.activity);
    setSwitch($('swSidebar'), state.layout.sidebar);
    setSwitch($('swRight'), state.layout.right);
    setSwitch($('swDark'), state.layout.dark);
    $('rwSidebar').value=state.layout.sw; $('rwSidebarVal').textContent=state.layout.sw;
    $('rwRight').value=state.layout.rw; $('rwRightVal').textContent=state.layout.rw;
  }
  // ---- Toast ----
  let toastT;
  function toast(msg){ const t=$('toast'); t.textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),1800); }
