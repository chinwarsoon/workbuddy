"use strict";

  // Inline SVG glyphs for persistent-at-rest affordances (ISS-39 / ISS-45) — symbols, not emoji.
  const FC_GLYPH_EDIT = '<svg class="fc-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
  const FC_GLYPH_LOCK = '<svg class="fc-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
  const FC_GLYPH_WARN = '<svg class="fc-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 2 20h20z"/><line x1="12" y1="9" x2="12" y2="14"/><circle cx="12" cy="17" r="0.7" fill="currentColor" stroke="none"/></svg>';

  // ---- Tree (Actions perspective) ----
  // Uniform per-level indent step (configurable in Settings → Layout, default 16px).
  function treePad(level){ return 8 + (level||0) * (state.layout.treeIndent||16); }
  // Empty-state leaf shown when a node has no actions; `level` keeps it aligned under its parent.
  function emptyLeaf(pid, did, level){
    return `<div class="empty-leaf" style="padding-left:${treePad(level||2)}px">No actions yet<br><button class="empty-cta" type="button" data-addact="${pid}::${did}">+ Add action</button></div>`;
  }
  function renderTreeBody(){
    const tree=$('sideBody');
    const f=state.filter.trim().toLowerCase();
    const matches = a => !f || (a.title.toLowerCase().includes(f) || projName(a.projectId).toLowerCase().includes(f) || discName(a.disciplineId).toLowerCase().includes(f));
    const branchMatches = a => matches(a) || childrenOf(a.id).some(branchMatches);
    let html='';
    state.projects.forEach(p=>{
      const pkey='p'+p.id; const open=!!state.expanded[pkey];
      const pacts=liveActions().filter(a=>a.projectId===p.id);
      if(f && !pacts.some(branchMatches)) return;
      html += nodeRow('project', pkey, p.id, open, esc(p.name), pacts.length, null, 0);
      if(open){
        // --- Tree structure (per project) ---
        //   Project (lvl 0, tile)
        //     ├─ <disciplines WITH actions> (lvl 1)
        //     │    └─ actions (lvl 2)
        //     └─ Unassigned (lvl 1)            ← one per project, always present, at the BOTTOM
        //          ├─ <disciplines w/o actions> (lvl 2 → expand: "no actions yet" + Add)
        //          └─ <discipline-less actions> (lvl 2)
        const discAll = projectDisciplines(p);
        const discWith = discAll.filter(d => actionsOf(p.id, d.id).length > 0);
        const discEmpty = discAll.filter(d => actionsOf(p.id, d.id).length === 0);
        const unassigned = liveActions().filter(a => a.projectId === p.id && !a.disciplineId);
        const ukey = p.id + '::__un';
        const uop = !!state.expanded[ukey];
        const uEmpty = f ? discEmpty.filter(d => d.name.toLowerCase().includes(f)) : discEmpty;
        const uRoots = unassigned.filter(a => {
          if (!a.parentId) return true;
          const par = state.actions.find(x => x.id === a.parentId);
          if (!par || par.deleted) return true;
          return !(par.projectId === p.id && !par.disciplineId);
        });
        const uActs = uRoots.filter(branchMatches).sort((x, y) => priorityRank(x) - priorityRank(y));
        // Disciplines WITH actions rendered first (lvl 1)
        discWith.forEach(d => {
          const dkey = p.id + '::d' + d.id; const dop = !!state.expanded[dkey];
          const all = actionsOf(p.id, d.id);
          const roots = all.filter(a => {
            if (!a.parentId) return true;
            const par = state.actions.find(x => x.id === a.parentId);
            if (!par || par.deleted) return true;
            if (par.disciplineId !== d.id || par.projectId !== p.id) return true;
            return false;
          });
          const acts = roots.filter(branchMatches).sort((x, y) => priorityRank(x) - priorityRank(y));
          if (f && acts.length === 0) return;
          html += nodeRow('discipline', dkey, d.id, dop, esc(d.name), all.length, p.id, 1);
          if (dop && (!f || acts.length)) {
            acts.forEach(a => { html += renderActionNode(a, 0, branchMatches); });
            if (acts.length === 0) html += emptyLeaf(p.id, d.id, 2);
          }
        });
        // Unassigned node rendered LAST (bottom of the project tree), always present
        if (!(f && uEmpty.length === 0 && uActs.length === 0)) {
          html += nodeRow('discipline', ukey, '__un_' + p.id, uop, 'Unassigned', discEmpty.length + unassigned.length, p.id, 1);
          if (uop) {
            // empty disciplines nested under Unassigned (lvl 2); expand → empty state
            uEmpty.forEach(d => {
              const dkey = ukey + '::d' + d.id; const dop = !!state.expanded[dkey];
              html += nodeRow('discipline', dkey, d.id, dop, esc(d.name), 0, p.id, 2);
              if (dop) html += emptyLeaf(p.id, d.id, 3);
            });
            // discipline-less actions nested under Unassigned (lvl 2)
            if (uActs.length) uActs.forEach(a => { html += renderActionNode(a, 0, branchMatches); });
            else if (!uEmpty.length) html += emptyLeaf(p.id, '', 2);
          }
        }
      }
    });
    tree.innerHTML = html;
    tree.querySelectorAll('[data-addact]').forEach(b=>b.onclick=()=>{ const [pid,did]=b.dataset.addact.split('::'); openModalCreate(pid, did); });
    const ti=$('tmpInput'); if(ti){ ti.focus(); ti.select(); }
  }
  function nodeRow(type, key, id, open, name, count, projectId, level){
    const pad = treePad(level||0);
    const unCls = (type==='discipline' && String(id).indexOf('__un_')===0) ? ' unassigned' : '';
    const chev = type==='action' ? '' : (open ? '▾' : '▸');
    let ctrl = '';
    if(type==='action'){
      ctrl = `<span class="tcontrols"><span class="tbtn edit" data-act="edit-action" title="Edit action">✎</span></span>`;
    } else if(type==='discipline'){
      ctrl = `<span class="tcontrols"><span class="tbtn add" data-act="add-action" title="Add action">+</span></span>`;
    }
    const pidAttr = projectId ? ` data-pid="${projectId}"` : '';
    return `<div class="tnode ${type}${unCls}" data-type="${type}" data-id="${id}" data-key="${key}"${pidAttr} tabindex="0" style="padding-left:${pad}px">`
         + `<span class="tchev">${chev}</span>`
         + (type==='action' ? `<span class="tdot"></span>` : '')
         + `<span class="tname">${name}</span><span class="tcount">${count}</span>`
         + ctrl + `</div>`;
  }
  // Recursive WBS node — a parent action gets an expandable chevron + nested children.
  function renderActionNode(a, depth, branchMatches){
    const kids=childrenOf(a.id);
    const hasKids=kids.length>0;
    const akey='a'+a.id; const open=!!state.expanded[akey];
    const sel=a.id===state.selection.actions?' sel':'';
    const r=rollupParent(a);
    const badge = hasKids ? `<span class="tcount sum" title="${r.count} sub-action(s), ${r.pct}% complete">∑ ${r.count}</span>` : '';
    const lead = hasKids ? `<span class="tchev act-chev" data-act="toggle-action" data-id="${a.id}" title="Toggle sub-actions">${open?'▾':'▸'}</span>` : `<span class="tdot"></span>`;
    let html = `<div class="tnode action${sel}" data-type="action" data-id="${a.id}" data-key="${akey}" style="padding-left:${treePad(2+depth)}px">${lead}`
      + `<span class="tname">${esc(a.title)}</span>${badge}`
      + `<span class="tcount" style="${aPriorityStyle(a)}">${esc(aPriorityLabel(a))}</span>`
      + `<span class="tcount">${esc(aStatusLabel(a))}</span>`
      + `<span class="tcontrols"><span class="tbtn edit" data-act="edit-action" title="Edit action">✎</span></span></div>`;
    if(hasKids && open){
      kids.filter(branchMatches).sort((x,y)=>priorityRank(x)-priorityRank(y)).forEach(k=>{ html += renderActionNode(k, depth+1, branchMatches); });
    }
    return html;
  }
  // ---- Sidebar lists ----
  function renderProjSide(){
    const sel=state.selection.projects; let html='';
    state.projects.forEach(p=>{
      const s=projStats(p.id); const on=p.id===sel?' sel':'';
      html+=`<div class="sitem${on}" data-id="${p.id}" tabindex="0">
        <div class="sitem-top"><span class="sname">${esc(p.name)}</span><span class="scount">${s.total}</span></div>
        <div class="sbar"><div class="sbar-fill" style="width:${s.pct}%"></div></div>
        <div class="sitem-sub">${s.pct}% done · ${s.blocked} blocked</div></div>`;
    });
    $('sideBody').innerHTML = html || `<div class="empty-leaf">No projects yet — add one via the tree <b>+</b> or Settings.</div>`;
  }
  function renderDiscSide(){
    const sel=state.selection.disciplines; let html='';
    state.disciplines.forEach(d=>{
      const acts=liveActions().filter(a=>a.disciplineId===d.id);
      const projs=[...new Set(acts.map(a=>a.projectId))].length; const on=d.id===sel?' sel':'';
      html+=`<div class="sitem${on}" data-id="${d.id}" tabindex="0"><div class="sitem-top"><span class="sname">${esc(d.name)}</span><span class="scount">${acts.length}</span></div><div class="sitem-sub">${projs} project(s)</div></div>`;
    });
    $('sideBody').innerHTML = html || `<div class="empty-leaf">No disciplines yet — add one via the tree <b>+</b> or Settings.</div>`;
  }
  function renderReportSide(){
    const sel=state.selection.reports;
    $('sideBody').innerHTML = REPORTS.map(r=>`<div class="sitem${r.id===sel?' sel':''}" data-id="${r.id}" tabindex="0"><span class="sname">${esc(r.label)}</span></div>`).join('');
  }
  function renderSearchSide(){
    const sel=state.selection.search;
    $('sideBody').innerHTML = FILTERS.map(f=>`<div class="sitem${f.id===sel?' sel':''}" data-id="${f.id}" tabindex="0"><span class="sname">${esc(f.label)}</span><span class="scount">${f.fn().length}</span></div>`).join('');
  }
  function renderSettingsSide(){
    const sel=state.selection.settings;
    $('sideBody').innerHTML = SETSECTIONS.map(s=>`<div class="sitem${s.id===sel?' sel':''}" data-id="${s.id}" tabindex="0"><span class="sname">${esc(s.label)}</span></div>`).join('');
  }
  function renderHelpSide(){
    const sel=state.selection.help;
    $('sideBody').innerHTML = HELPTOPICS.map(t=>`<div class="sitem${t.id===sel?' sel':''}" data-id="${t.id}" tabindex="0"><span class="sname">${esc(t.label)}</span></div>`).join('');
  }
  // ---- Main panels ----
  // Read-only detail (Search): reuses the same tabulated report as the inline
  // editor's live preview so fields are never duplicated between views.
  function actionDetailHtml(a){
    const hist = (a.history||[]).map(h=>`<div class="hist-row">${esc(h.d)} — ${esc(h.t)}</div>`).join('') || '<div class="hist-row">No history</div>';
    return `<div class="ae-report">${reportHtml(a)}</div>
      <div class="ed-section-h">Update history</div>
      ${hist}
      <div class="ed-actions"><button class="btn primary" id="edEdit">Edit</button><button class="btn ghost" id="edDelete">Delete</button></div>`;
  }
  function bindActionDetail(a){
    $('edEdit').onclick=async ()=>{ if(await setPerspective('actions')){ state.selection.actions=a.id; refresh(); } };
    $('edDelete').onclick=()=>deleteAction(a);
  }
  // Tabulated report — shared by the live preview, the read-only detail view and the Word export.
  function reportDepsHtml(a){
    const items = childrenOf(a.id).length>0 ? consolidatedDeps(a) : actionDeps(a).map(d=>({dep:d, srcs:null}));
    if(!items.length) return '—';
    return items.map(e=>{
      const text = esc(depLabel(e.dep));
      const src = (e.srcs && e.srcs.size) ? ' <span class="dep-src">('+esc([...e.srcs].join(', '))+')</span>' : '';
      return text + src;
    }).join('<br>');
  }
  function reportHtml(a){
    const createdOn = a.createdOn || (a.history && a.history[0] && typeof a.history[0].d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(a.history[0].d) ? a.history[0].d : '');
    const meta = `<table class="ae-report-tbl">`
      + `<tr><th>Project</th><td>${esc(projName(a.projectId))}</td><th>Discipline</th><td>${esc(discName(a.disciplineId))}</td></tr>`
      + `<tr><th>Priority</th><td><span class="badge" style="height:22px;${aPriorityStyle(a)}">${esc(aPriorityLabel(a))}</span></td><th>Status</th><td><span class="badge" style="height:22px;${aStatusStyle(a)}">${esc(aStatusLabel(a))}</span></td></tr>`
      + `<tr><th>Due</th><td>${esc(a.due||'—')}</td><th>Assigned to</th><td>${esc(assigneesTxt(a))}</td></tr>`
      + `<tr><th>Created by</th><td>${esc(creatorName(a))}</td><th>Created On</th><td>${esc(createdOn||'—')}</td></tr>`
      + `<tr><th>Dependencies</th><td colspan="3">${reportDepsHtml(a)}</td></tr>`
      + `</table>`;
    const logRows=(a.detailLog&&a.detailLog.length) ? a.detailLog.map(r=>{
      const imgs=(Array.isArray(r.images)&&r.images.length) ? '<div class="ae-rep-imgs">'+r.images.map(im=>`<a class="ae-rep-img" href="#" data-src="${esc(im.src)}" data-name="${esc(im.name||'image')}">📎 ${esc(im.name||'image')}</a>`).join('')+'</div>' : '';
      return `<tr><td>${esc(r.date||'')}</td><td>${esc(r.text||'')}${imgs}</td></tr>`;
    }).join('') : `<tr><td colspan="2" class="ae-empty-row">No entries</td></tr>`;
    const logTable = `<table class="ae-report-tbl"><thead><tr><th class="ae-log-date">Date</th><th>Detail</th></tr></thead><tbody>${logRows}</tbody></table>`;
    const customRows = a.projectId ? getCustomFieldsForProject(a.projectId).filter(f=>(a.custom||{})[f.key]!==undefined && (a.custom||{})[f.key]!=='').map(f=>{
      const v=(a.custom||{})[f.key];
      const disp = Array.isArray(v) ? v.join(', ') : (f.type==='boolean' ? (v?'Yes':'No') : String(v));
      return `<tr><th>${esc(f.label)}</th><td>${esc(disp)}</td></tr>`;
    }).join('') : '';
    const customTable = customRows ? `<div class="ae-report-h">Custom Fields</div><table class="ae-report-tbl">${customRows}</table>` : '';
    return `<div class="ae-report-title">${esc(a.title)}</div>${meta}<div class="ae-report-h">Description (dated detail log)</div>${logTable}${customTable}`;
  }
  function renderActionsMain(){
    edDirty=false;
    const a=state.actions.find(x=>x.id===state.selection.actions);
    if(!a){ renderActionTop(null); renderActionSubhead(null); $('edBody').innerHTML=`<p class="ed-desc">Select an action from the tree, or create a new one.</p>`; return; }
    renderActionTop(a);
    renderActionSubhead(a);
    $('edBody').innerHTML=renderActionEditor(a); bindActionEditor(a);
  }
  function renderActionTop(a){
    const t=$('edTop'); const dis=!a; const atMax = a? actionTier(a)>=MAX_TIER : true;
    const isChild = !!(a && a.parentId!=null);
    t.innerHTML = `<div class="ed-bread" id="edBread">${esc(a?('Actions / '+a.title):'Actions')}</div>`
      + `<div class="ed-top-actions">`
      + `<button class="btn primary" id="aeSave"${dis?' disabled':''}>Save</button>`
      + `<button class="btn" id="aeNew">+ New Action</button>`
      + `<button class="btn" id="aeAddSub"${dis||atMax?' disabled':''} title="Add a sub-action under this action">+ Sub-action</button>`
      + `<button class="btn" id="aeSplit"${dis||atMax?' disabled':''} title="Split this action into 2 sub-actions">Split</button>`
      + (isChild?`<button class="btn" id="aePromote" title="Promote this sub-action one level up (to its immediate parent's level)">↑ Promote</button>`:'')
      + `<button class="btn ghost" id="aeDelete"${dis?' disabled':''}>Delete</button>`
      + `</div>`;
    const cr=$('tbCrumb'); if(cr) cr.innerHTML = renderTopbarCrumb(a?('Actions / '+a.title):'Actions');
    $('aeNew').onclick=()=>openModalCreate(null,null);
    if(a){ $('aeSave').onclick=()=>saveInlineAction(a); $('aeDelete').onclick=()=>deleteAction(a); $('aeAddSub').onclick=()=>addSubAction(a.id); $('aeSplit').onclick=()=>splitIntoSubactions(a); if(isChild) $('aePromote').onclick=()=>promoteAction(a); }
  }
  // --- Subhead (sticky, read-only identity bar) — ISS-42 / ISS-45 ---
  function renderActionSubhead(a){
    const el=$('edSubhead'); if(!el) return;
    if(!a){ el.innerHTML=''; el.style.display='none'; return; }
    el.style.display='';
    el.innerHTML = `<div class="ed-sh-inner">
      <div class="ed-sh-row1">
        <input class="input ed-sh-title" id="aeTitle" value="${esc(a.title)}" aria-label="Action title" />
        <span class="ed-sh-id">#${a.id}</span>
      </div>
      <div class="ed-sh-meta">
        <span class="sh-chip"><span class="sh-k">${esc(L('project','Project'))}</span><span class="sh-v">${esc(projName(a.projectId))}</span><span class="sh-lock" title="Locked — set at creation, cannot be changed">${FC_GLYPH_LOCK}</span></span>
        <span class="sh-chip"><span class="sh-k">${esc(L('discipline','Discipline'))}</span><span class="sh-v">${esc(discName(a.disciplineId))}</span><span class="sh-lock" title="Locked — set at creation, cannot be changed">${FC_GLYPH_LOCK}</span></span>
        <span class="sh-chip"><span class="sh-k">${esc(L('status','Status'))}</span><span class="sh-v sh-status" id="shStatus" style="${statusStyle(a.statusId)}">${esc(aStatusLabel(a))}</span></span>
        <span class="sh-chip"><span class="sh-k">${esc(L('createdBy','Created by'))}</span><span class="sh-v">${esc((state.members.find(m=>String(m.id)===String(a.createdById))||{}).name || a.createdByName || '—')}</span></span>
        <span class="sh-chip"><span class="sh-k">${esc(L('createdOn','Created on'))}</span><span class="sh-v">${esc(a.createdOn||'—')}</span></span>
      </div>
    </div>`;
  }
  // --- Focus cells: click-to-edit popovers with focus management (ISS-39/41/44/47) ---
  let __focusDocBound = false;
  function closeAllFocusPops(){
    document.querySelectorAll('#edBody .focus-cell.open').forEach(c=>{
      c.classList.remove('open'); c.setAttribute('aria-expanded','false');
      const p=c.querySelector('.focus-pop'); if(p) p.hidden=true;
    });
  }
  function isOverdue(rec){
    if(!rec.due) return false;
    const done = (findStatus(rec.statusId)||{}).label === 'Completed' || rec.statusLabel === 'Completed';
    if(done) return false;
    return rec.due < todayStr();
  }
  // Reads the LIVE selection from the popover controls (not from `a`, which is only
  // written at save time). This is what makes the focus cell update instantly when a
  // drop-down / seg / picker value changes inside the popover.
  function syncFocusDisplays(a){
    const seg=$('aeSeg'), pr=$('aePriority'), asg=$('aeAssignee'), dueEl=$('aeDue');
    const sid = seg ? selectedSeg(seg) : (a.statusId||'');
    const pid = pr ? selectedPriority(pr) : (a.priorityId||'');
    const dueVal = dueEl ? (dueEl.value||'') : (a.due||'');
    const fs=$('fvStatus'); if(fs){ fs.textContent=statusLabel(sid); fs.setAttribute('style', statusStyle(sid)); }
    const fp=$('fvPriority'); if(fp){ fp.textContent=priorityLabel(pid); fp.setAttribute('style', priorityStyle(pid)); }
    const fd=$('fvDue'); if(fd){ fd.textContent=dueVal||'—'; const cell=fd.closest('.focus-cell'); if(cell) cell.classList.toggle('overdue', isOverdue({due:dueVal, statusId:sid, statusLabel:statusLabel(sid)})); }
    const fa=$('fvAssignee'); if(fa){ fa.textContent = asg ? (()=>{ const s=selectedAssignees(asg); return s.ids.map(id=>(state.members.find(m=>String(m.id)===String(id))||{}).name).concat(s.orphans).join(', ')||'—'; })() : assigneesTxt(a); }
    const fpr=$('fvProgress'); if(fpr) fpr.textContent=(a.progress||0)+'%';
    const sh=$('shStatus'); if(sh){ sh.textContent=statusLabel(sid); sh.setAttribute('style', statusStyle(sid)); }
  }
  function bindFocusCells(a){
    if(!__focusDocBound){
      document.addEventListener('click', e=>{ if(!e.target.closest('#edBody .focus-cell')) closeAllFocusPops(); });
      __focusDocBound=true;
    }
    document.querySelectorAll('#edBody .focus-cell[data-edit]').forEach(cell=>{
      const pop=cell.querySelector('.focus-pop');
      const toggle=()=>{
        const wasOpen=!pop.hidden;
        closeAllFocusPops();
        if(wasOpen) return;
        pop.hidden=false; cell.classList.add('open'); cell.setAttribute('aria-expanded','true');
        const f=pop.querySelector('input, select, button, textarea'); if(f) f.focus();
      };
      cell.addEventListener('click', e=>{ if(e.target.closest('.focus-pop')) return; e.stopPropagation(); toggle(); });
      cell.addEventListener('keydown', e=>{
        if(e.key==='Enter' || e.key===' '){ e.preventDefault(); toggle(); }
        else if(e.key==='Escape'){ if(!pop.hidden){ closeAllFocusPops(); cell.focus(); } }
      });
      pop.addEventListener('click', e=>e.stopPropagation());
      pop.addEventListener('keydown', e=>{ if(e.key==='Escape'){ closeAllFocusPops(); cell.focus(); } });
    });
  }
  // --- Dependency warning badge on the folded Dependencies header (ISS-40) ---
  function updateDepBadge(a){
    const badge=$('depBadge'); if(!badge) return;
    const types=new Set();
    actionDeps(a).forEach(d=>{ const w=depWarn(a,d); if(w){ w.replace('⚠','').split('·').forEach(p=>{ const t=p.trim(); if(t) types.add(t); }); } });
    if(!types.size){ badge.style.display='none'; badge.innerHTML=''; return; }
    badge.style.display='';
    badge.innerHTML = FC_GLYPH_WARN + '<span>'+esc([...types].join(' · '))+'</span>';
  }
  function renderActionEditor(a){
    const r=rollupParent(a);
    const logRows = (a.detailLog||[]).map((r,i)=>logRowHtml(i,r)).join('');
    const histRows = (a.history||[]).map(h=>`<div class="hist-row">${esc(h.d)} — ${esc(h.t)}</div>`).join('') || '<div class="hist-row">No history</div>';
    const isParent = childrenOf(a.id).length > 0;
    const schedule = a.schedule || {};
    return `<div class="ae">
      ${ isParent ? `<div class="ae-parent-note">∑ Parent of ${r.count} sub-action(s) · ${r.pct}% complete (rollup: progress ${r.progress}%, plan ${r.planStart||'—'} → ${r.planFinish||'—'}, ${r.duration}d) — schedule/progress/deps are read-only</div>` : '' }
      <!-- Project / Discipline / Creator: locked for this action (set at creation). Hidden selects kept so save/load keep working. -->
      <div class="ae-hidden" hidden>
        <select class="input ae-cinput" id="aeProject"></select>
        <select class="input ae-cinput" id="aeDiscipline"></select>
        <select class="input ae-cinput" id="aeCreator"></select>
      </div>
      <!-- FOCUS AREA: primary metadata, click a value to edit (ISS-39/41/43/44/46/47) -->
      <div class="focus" role="group" aria-label="Primary metadata — click a value to edit">
        <div class="focus-grid">
          <div class="focus-cell" data-edit="assignee" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" title="Click to edit">
            <span class="focus-label">${esc(L('assignedTo','Assigned to'))}</span>
            <span class="focus-value" id="fvAssignee">${esc(assigneesTxt(a))}</span>
            <span class="focus-glyph" aria-hidden="true">${FC_GLYPH_EDIT}</span>
            <div class="focus-pop" hidden><div class="assignee-pick" id="aeAssignee"></div></div>
          </div>
          <div class="focus-cell" data-edit="due" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" title="Click to edit">
            <span class="focus-label">${esc(L('due','Due date'))}</span>
            <span class="focus-value" id="fvDue">${esc(a.due||'—')}</span>
            <span class="focus-glyph" aria-hidden="true">${FC_GLYPH_EDIT}</span>
            <div class="focus-pop" hidden><input class="input ae-cinput" id="aeDue" type="date" value="${esc(a.due||'')}" /></div>
          </div>
          <div class="focus-cell" data-edit="status" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" title="Click to edit">
            <span class="focus-label">${esc(L('status','Status'))}</span>
            <span class="focus-value s-on" id="fvStatus" style="${statusStyle(a.statusId)}">${esc(aStatusLabel(a))}</span>
            <span class="focus-glyph" aria-hidden="true">${FC_GLYPH_EDIT}</span>
            <div class="focus-pop" hidden><div class="seg" id="aeSeg"></div></div>
          </div>
          <div class="focus-cell" data-edit="priority" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" title="Click to edit">
            <span class="focus-label">${esc(L('priority','Priority'))}</span>
            <span class="focus-value p-on" id="fvPriority" style="${priorityStyle(a.priorityId)}">${esc(aPriorityLabel(a))}</span>
            <span class="focus-glyph" aria-hidden="true">${FC_GLYPH_EDIT}</span>
            <div class="focus-pop" hidden><div class="seg" id="aePriority"></div></div>
          </div>
          ${ isParent ? `
          <div class="focus-cell locked" aria-disabled="true" title="Locked — rolled up from sub-actions">
            <span class="focus-label">${esc(L('progress','Progress'))}</span>
            <span class="focus-value">${r.progress||0}% · rolled up</span>
            <span class="focus-lock" aria-hidden="true">${FC_GLYPH_LOCK}</span>
          </div>` : `
          <div class="focus-cell" data-edit="progress" tabindex="0" role="button" aria-haspopup="true" aria-expanded="false" title="Click to edit">
            <span class="focus-label">${esc(L('progress','Progress'))}</span>
            <span class="focus-value" id="fvProgress">${a.progress||0}%</span>
            <span class="focus-glyph" aria-hidden="true">${FC_GLYPH_EDIT}</span>
            <div class="focus-pop" hidden><div class="ae-progress-wrap"><input type="range" id="aeProgress" min="0" max="100" value="${a.progress||0}" style="flex:1" /><span id="aeProgressVal" style="width:48px;text-align:right">${a.progress||0}%</span></div></div>
          </div>` }
        </div>
      </div>
      <hr class="ae-divider" />
      <div class="ed-section-h" style="margin:0 0 8px">Description — dated detail log</div>
      <div class="ae-log-wrap">
        <table class="ae-log" id="aeLog"><thead><tr><th class="ae-log-date">Date</th><th>Detail</th><th></th></tr></thead><tbody id="aeLogBody">${logRows}</tbody></table>
        <div class="ae-log-hint">Enter = new line inside a cell · Ctrl+Enter (or + Add row) = append a new row</div>
        <button class="btn" id="aeAddRow">+ Add row</button>
      </div>
      ${ !isParent ? `
      <details class="fold">
        <summary class="fold-sum">${esc(L('dependencies','Dependencies'))}<span class="fold-badge" id="depBadge"></span></summary>
        <div class="fold-body">
          <div id="aeDeps" class="ae-deps"></div>
          <button class="btn" id="aeAddDep" type="button" style="margin-top:6px">+ Add dependency</button>
        </div>
      </details>
      <details class="fold">
        <summary class="fold-sum">${esc(L('schedule','Schedule'))}</summary>
        <div class="fold-body"><div class="ae-schedule-grid" id="aeSchedule"></div></div>
      </details>` : '' }
      ${ renderCustomFieldsSection(a) }
      <details class="fold">
        <summary class="fold-sum">Update history</summary>
        <div class="fold-body"><div class="ae-history">${histRows}</div></div>
      </details>
      <details class="fold">
        <summary class="fold-sum">Live preview — tabulated report</summary>
        <div class="fold-body"><div class="ae-report" id="aeReport">${reportHtml(a)}</div></div>
      </details>
    </div>`;
  }
  function logRowHtml(i, r){
    const initImgs=(Array.isArray(r.images)?r.images:[]);
    const imgs=(initImgs.length) ? initImgs.map(im=>`<span class="ae-img-chip" data-src="${esc(im.src)}" data-name="${esc(im.name||'image')}" title="Click to review"><img src="${esc(im.src)}" alt="${esc(im.name||'image')}" />${esc(im.name||'image')}<button class="ae-img-rm" title="Remove">✕</button></span>`).join('') : '';
    return `<tr class="ae-log-row" data-i="${i}" data-imgs="${esc(JSON.stringify(initImgs))}"><td><input type="date" class="ae-log-date" value="${esc(r.date||'')}" /></td>`
      + `<td><textarea class="ae-log-text" rows="2">${esc(r.text||'')}</textarea>`
      + `<div class="ae-img-row">${imgs}</div>`
      + `<div class="ae-img-ctl"><button class="ae-add-img" type="button" title="Attach a picture (file picker)">📎 Attach</button><input class="ae-link-img" type="text" placeholder="Link existing: assets/pictures/name.png" /><button class="ae-add-link" type="button" title="Use the link above">🔗 Link</button><input type="file" class="ae-file" accept="image/*" hidden /></div>`
      + `</td><td><button class="ae-log-del" title="Delete row">✕</button></td></tr>`;
  }
  // ---- ISS-28: Custom Fields section in the action editor (Phase 3 MVP) ----
  function customFieldInputHtml(f, val){
    const v = (val===undefined||val===null)? '' : val;
    const cid = 'cf_'+f.key;
    if(f.type==='text' || f.type==='url' || f.type==='email')
      return `<input class="input cf-inp" id="${cid}" type="${f.type==='text'?'text':f.type}" value="${esc(v)}" placeholder="${esc(f.description||'')}" />`;
    if(f.type==='number')
      return `<input class="input cf-inp" id="${cid}" type="number" step="any" value="${esc(v)}" />`;
    if(f.type==='date')
      return `<input class="input cf-inp" id="${cid}" type="date" value="${esc(v)}" />`;
    if(f.type==='boolean')
      return `<label class="cf-toggle"><input type="checkbox" id="${cid}" ${v?'checked':''} /><span>Enabled</span></label>`;
    if(f.type==='select')
      return `<select class="input cf-inp" id="${cid}"><option value="">— pick —</option>${(f.options||[]).map(o=>`<option value="${esc(o)}"${String(o)===String(v)?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
    if(f.type==='multiselect'){
      const arr = Array.isArray(v) ? v : (String(v).length? [v] : []);
      return `<select class="input cf-inp" id="${cid}" multiple size="${Math.min(4,(f.options||[]).length||2)}">${(f.options||[]).map(o=>`<option value="${esc(o)}"${arr.includes(o)?' selected':''}>${esc(o)}</option>`).join('')}</select>`;
    }
    return `<input class="input cf-inp" id="${cid}" type="text" value="${esc(v)}" />`;
  }
  function renderCustomFieldsSection(a){
    const fields = a.projectId ? getCustomFieldsForProject(a.projectId) : [];
    if(!fields.length) return '';
    const rows = fields.map(f=>{
      const val = (a.custom && a.custom[f.key] !== undefined) ? a.custom[f.key] : (f.default!==undefined && f.default!==null ? f.default : '');
      return `<div class="ae-crow"><div class="ae-cfield ae-span"><span class="ae-clabel">${esc(f.label)}${f.required?' *':''}</span>${customFieldInputHtml(f, val)}</div></div>`;
    }).join('');
    return `<details class="fold"><summary class="fold-sum">Custom Fields</summary><div class="fold-body"><div class="ae-customfields">${rows}</div></div></details>`;
  }
  function readCustomFieldsInto(a){
    const fields = a.projectId ? getCustomFieldsForProject(a.projectId) : [];
    if(!fields.length) return;
    if(!a.custom) a.custom = {};
    fields.forEach(f=>{
      const el = $('cf_'+f.key); if(!el) return;
      let val;
      if(f.type==='boolean') val = el.checked;
      else if(f.type==='multiselect') val = [...el.selectedOptions].map(o=>o.value);
      else if(f.type==='number'){ const n=parseFloat(el.value); val = isNaN(n) ? (el.value===''? '' : el.value) : n; }
      else val = el.value;
      // omit empty values to keep the stored object clean
      if(val===undefined || val===null || val==='' || (Array.isArray(val)&&val.length===0)){ delete a.custom[f.key]; }
      else a.custom[f.key] = val;
    });
  }
  function bindCustomFields(a){
    if(!a || !a.projectId) return;
    const fields = getCustomFieldsForProject(a.projectId);
    fields.forEach(f=>{
      const el=$('cf_'+f.key); if(!el) return;
      const onEdit=()=>markDirty(a);
      el.addEventListener('input', onEdit);
      el.addEventListener('change', onEdit);
    });
  }
  // ---- Schema v3 dependency editor (ISS-14/15/16/17) ----
  // Each row carries a STABLE uid (rowKey) so warnings are keyed by identity, not
  // array position. `a.deps` is the authoritative store; every change re-reads
  // rows into it BEFORE re-rendering, so switching Action/Reference never loses
  // the other fields.
  function renderDepEditor(a){
    const box=$('aeDeps'); if(!box) return;
    const deps=actionDeps(a);
    deps.forEach(d=>{ if(d.rowKey==null) d.rowKey=nextDepKey(); });   // assign stable keys to migrated/legacy deps
    const actOpts = ()=> liveActions().filter(x=>x.id!==a.id).map(x=>{
      const other = x.projectId!==a.projectId;
      return `<option value="${x.id}"${other?' data-otherproject="1"':''}>#${x.id} ${esc(x.title)}${other?' · '+esc(projName(x.projectId)):''}</option>`;
    }).join('');
    const refOpts = ()=> (state.referencePoints||[]).map(r=>`<option value="${esc(r.id)}">◇ ${esc(r.name||'Ref')}${r.date?' · '+esc(r.date):''}</option>`).join('');
    box.innerHTML = deps.map(d=>{
      const i=d.rowKey!=null?d.rowKey:0;
      const sel = d.predKind==='reference'
        ? `<select class="dep-pred" data-i="${i}"><option value="">—</option>${refOpts().replace(`value="${esc(d.predId)}"`,`value="${esc(d.predId)}" selected`)}</select>`
        : `<select class="dep-pred" data-i="${i}"><option value="">—</option>${actOpts().replace('value="'+d.predId+'"','value="'+d.predId+'" selected')}</select>`;
      return `<div class="dep-row" data-i="${i}">
        <select class="dep-kind" data-i="${i}"><option value="action"${d.predKind!=='reference'?' selected':''}>Action</option><option value="reference"${d.predKind==='reference'?' selected':''}>Reference</option></select>
        ${sel}
        <select class="dep-type" data-i="${i}">${DEP_TYPES.map(t=>`<option value="${t}"${t===(d.type||'FS')?' selected':''}>${t}</option>`).join('')}</select>
        <input class="dep-lag" type="number" step="1" data-i="${i}" value="${d.lag||0}" title="Lag (days, signed)" style="width:64px" />
        <span class="dep-warn" data-warn="${i}">${depWarn(a,d)}</span>
        <button class="dep-del" data-i="${i}" title="Remove dependency">✕</button>
      </div>`;
    }).join('') || '<div class="dep-empty">No dependencies yet.</div>';
    box.querySelectorAll('select,input.dep-lag').forEach(el=>el.onchange=()=>{ readDepsInto(a); renderDepEditor(a); markDirty(a); });
    box.querySelectorAll('.dep-kind').forEach(sel=>sel.onchange=()=>{
      const i=+sel.dataset.i; const d=a.deps.find(x=>x.rowKey===i);
      if(d){ d.predKind = sel.value==='reference' ? 'reference' : 'action'; d.predId=null; }   // reset pred on kind switch so the dropdown is rebuilt clean
      renderDepEditor(a);
    });
    box.querySelectorAll('.dep-del').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; a.deps=a.deps.filter(x=>x.rowKey!==i); renderDepEditor(a); markDirty(a); });
    const addBtn=$('aeAddDep'); if(addBtn) addBtn.onclick=()=>{
      a.deps=a.deps||[]; const first=liveActions().find(x=>x.id!==a.id);
      a.deps.push({ rowKey: nextDepKey(), predKind:'action', predId: first?first.id:0, type:'FS', lag:0 });
      renderDepEditor(a); markDirty(a);
    };
    updateDepBadge(a);
  }
  let __depKeySeq = 1;
  function nextDepKey(){ return __depKeySeq++; }
  function depWarn(a, d){
    if(d.predKind==='action'){
      if(!state.actions.find(x=>x.id===d.predId)) return '⚠ missing';
      const pre=state.actions.find(x=>x.id===d.predId);
      // Cycle detection runs for ALL action refs, same- or cross-project (the graph
      // walk in wouldCreateCycle is project-agnostic). Cross-project is still allowed
      // but flagged, and a cycle is flagged even when it spans projects.
      const parts=[];
      if(wouldCreateCycle(a.id, d.predId)) parts.push('cycle');
      if(pre.projectId!==a.projectId) parts.push('different project');
      if(wouldCreateWbsConflict(a.id, d.predId)) parts.push('same WBS');
      if(parts.length) return '⚠ ' + parts.join(' · ');
    } else if(!state.referencePoints.find(r=>r.id===d.predId)) return '⚠ missing ref';
    return '';
  }
  // Parent (summary) actions are read-only for deps: show a consolidated, de-duplicated
  // view of dependencies drawn from the parent's own deps + every sub-action's deps.
  // Each entry records which source(s) reference it (parent / sub-action titles).
  function consolidatedDeps(a){
    const out = new Map();
    const add = (d, srcLabel) => {
      const key = d.predKind+'|'+d.predId+'|'+(d.type||'FS')+'|'+(d.lag||0);
      if(!out.has(key)) out.set(key, { dep:d, srcs:new Set() });
      out.get(key).srcs.add(srcLabel);
    };
    actionDeps(a).forEach(d=>add(d, 'parent'));
    childrenOf(a.id).forEach(k=>actionDeps(k).forEach(d=>add(d, k.title||('#'+k.id))));
    return [...out.values()];
  }
  function renderDepSummaryHtml(a){
    const items = consolidatedDeps(a);
    if(!items.length) return '<div class="dep-empty">No dependencies from sub-actions.</div>';
    return items.map(e=>{
      const w = depWarn(a, e.dep);
      const srcTxt = e.srcs.size ? [...e.srcs].join(', ') : '';
      return `<div class="dep-row ro">
        <span class="dep-summary-text">${esc(depLabel(e.dep))}</span>
        ${srcTxt?`<span class="dep-src" title="Referenced by">↳ ${esc(srcTxt)}</span>`:''}
        ${w?`<span class="dep-warn">${w}</span>`:''}
      </div>`;
    }).join('');
  }
  // Schedule editor for leaf actions (ISS-20)
  function renderScheduleEditor(a){
    const box=$('aeSchedule'); if(!box) return;
    const s=a.schedule||{};
    box.innerHTML = `<div class="ae-sched-row"><span class="ae-sched-label">Plan Start</span><input type="date" class="ae-sched-input" id="aeSchedPlanStart" value="${esc(s.planStart||'')}" /></div>
      <div class="ae-sched-row"><span class="ae-sched-label">Duration (days)</span><input type="number" class="ae-sched-input" id="aeSchedDuration" min="0" step="1" value="${Number.isFinite(+s.duration)?s.duration:DEFAULT_DURATION}" /></div>
      <div class="ae-sched-row"><span class="ae-sched-label">Forecast Start</span><input type="date" class="ae-sched-input" id="aeSchedForecastStart" value="${esc(s.forecastStart||'')}" /></div>
      <div class="ae-sched-row"><span class="ae-sched-label">Forecast Finish</span><input type="date" class="ae-sched-input" id="aeSchedForecastFinish" value="${esc(s.forecastFinish||'')}" /></div>
      <div class="ae-sched-row"><span class="ae-sched-label">Actual Start</span><input type="date" class="ae-sched-input" id="aeSchedActualStart" value="${esc(s.actualStart||'')}" /></div>
      <div class="ae-sched-row"><span class="ae-sched-label">Actual Finish</span><input type="date" class="ae-sched-input" id="aeSchedActualFinish" value="${esc(s.actualFinish||'')}" /></div>`;
    ['aeSchedPlanStart','aeSchedDuration','aeSchedForecastStart','aeSchedForecastFinish','aeSchedActualStart','aeSchedActualFinish'].forEach(id=>{
      const el=$(id); if(el) el.addEventListener('input', ()=>markDirty(a));
    });
  }
  function readScheduleInto(a){
    const s=a.schedule||{};
    s.planStart=$('aeSchedPlanStart')?.value||'';
    s.duration=$('aeSchedDuration')?.value!==''?parseInt($('aeSchedDuration').value,10):'';
    s.forecastStart=$('aeSchedForecastStart')?.value||'';
    s.forecastFinish=$('aeSchedForecastFinish')?.value||'';
    s.actualStart=$('aeSchedActualStart')?.value||'';
    s.actualFinish=$('aeSchedActualFinish')?.value||'';
    a.schedule=s;
  }
  function readProgressInto(a){
    a.progress = $('aeProgress')?.value!=='' ? parseInt($('aeProgress').value,10) : 0;
    const val=$('aeProgressVal'); if(val) val.textContent = a.progress+'%';
    if(a.progress===100 && a.statusId!==INFO_STATUS_ID){
      const completed = findStatus('Completed');
      if(completed && a.statusId!==completed.id){
        toast('Progress reached 100% — consider setting status to Completed');
      }
    }
  }
  function readDepsInto(a){
    const box=$('aeDeps'); if(!box) return;
    box.querySelectorAll('.dep-row').forEach(row=>{
      const i=+row.dataset.i;
      const kind=row.querySelector('.dep-kind').value;
      const pred=row.querySelector('.dep-pred').value;
      const type=row.querySelector('.dep-type').value;
      const lag=parseInt(row.querySelector('.dep-lag').value,10)||0;
      const d=a.deps.find(x=>x.rowKey===i);
      if(d){ d.predKind=kind==='reference'?'reference':'action'; d.predId=kind==='reference'?pred:parseInt(pred,10); d.type=type; d.lag=lag; }
    });
    // refresh warnings by stable key (cycle/same-project may have changed)
    box.querySelectorAll('.dep-row').forEach(row=>{
      const i=+row.dataset.i; const w=row.querySelector('.dep-warn');
      const d=a.deps.find(x=>x.rowKey===i);
      if(w) w.textContent = d ? depWarn(a, d) : '';
    });
  }
  function bindActionEditor(a){
    populateSelect($('aeProject'), state.projects, a.projectId);
    populateDisciplineSelect($('aeDiscipline'), a.projectId, a.disciplineId);
    populateMemberSelect($('aeCreator'), a.createdById, a.projectId, a.createdByName);
    renderAssigneePicker($('aeAssignee'), a, a.projectId);
    renderSeg($('aeSeg'), a.statusId, a.statusLabel);
    renderPrioritySeg($('aePriority'), a.priorityId, a.priorityLabel);
    const isParent = childrenOf(a.id).length > 0;
    if(!isParent){
      renderDepEditor(a);
      renderScheduleEditor(a);
      const prog=$('aeProgress'); if(prog){ prog.addEventListener('input', ()=>{ readProgressInto(a); markDirty(a); const fp=$('fvProgress'); if(fp) fp.textContent=a.progress+'%'; }); }
    }
    const onEdit=()=>markDirty(a);
    ['aeTitle','aeDue'].forEach(id=>{ const el=$(id); if(el) el.addEventListener('input', ()=>{ onEdit(); if(id==='aeDue'){ syncFocusDisplays(a); } }); });
    $('aeProject').addEventListener('change', onEdit);
    $('aeDiscipline').addEventListener('change', onEdit);
    $('aeCreator').addEventListener('change', onEdit);
    // Project change cascades: discipline options + member pickers follow the new project.
    $('aeProject').addEventListener('change', ()=>{
      const p=$('aeProject').value;
      const keep=$('aeDiscipline').value;
      const first=(projectDisciplines(projById(p))[0]||{}).id;
      populateDisciplineSelect($('aeDiscipline'), p, projectDisciplines(projById(p)).some(d=>d.id===keep)?keep:first);
      renderAssigneePicker($('aeAssignee'), pickState($('aeAssignee')), p);
      populateMemberSelect($('aeCreator'), $('aeCreator').value, p);
    });
    $('aeAssignee').querySelectorAll('button[data-id]').forEach(b=>b.onclick=()=>{ b.classList.toggle('on'); b.setAttribute('aria-pressed', b.classList.contains('on')?'true':'false'); onEdit(); syncFocusDisplays(a); });
    $('aeAssignee').querySelectorAll('button.orphan').forEach(b=>b.onclick=()=>{ b.remove(); onEdit(); });
    $('aeSeg').querySelectorAll('button').forEach(b=>b.addEventListener('click', ()=>{ onEdit(); syncFocusDisplays(a); }));
    $('aePriority').querySelectorAll('button').forEach(b=>b.addEventListener('click', ()=>{ onEdit(); syncFocusDisplays(a); }));
    document.querySelectorAll('#aeLogBody .ae-log-row').forEach(row=>bindLogRow(row,a));
    $('aeAddRow').onclick=()=>appendLogRow(a);
    bindCustomFields(a);
    bindFocusCells(a);
    syncFocusDisplays(a);
    if(!isParent) updateDepBadge(a);
    // Preview (live report) image links open the review lightbox.
    const rep=$('aeReport'); if(rep) rep.addEventListener('click', e=>{ const t=e.target.closest('.ae-rep-img'); if(t){ e.preventDefault(); openImgReview(t.dataset.src, t.dataset.name); } });
    const save=$('aeSave'); if(save){ save.disabled=!edDirty; save.onclick=()=>saveInlineAction(a); }
    const del=$('aeDelete'); if(del) del.onclick=()=>deleteAction(a);
  }
  function markDirty(a){
    edDirty=true;
    state.dataDirty=true; updateSaveButtons();
    const b=$('aeSave'); if(b) b.disabled=false;
    if(a) syncPreview(a);
  }
  function bindLogRow(row,a){
    row.querySelectorAll('.ae-log-date, .ae-log-text').forEach(el=>el.addEventListener('input', ()=>markDirty(a)));
    const ta=row.querySelector('.ae-log-text');
    if(ta) ta.addEventListener('keydown', e=>{ if(e.key==='Enter' && e.ctrlKey){ e.preventDefault(); appendLogRow(a); } });
    row.querySelector('.ae-log-del').addEventListener('click', ()=>{ row.remove(); markDirty(a); });
    // --- Picture attachments (rule 1: link / rule 2: embed / rule 3: Chromium download) ---
    const fileInput=row.querySelector('.ae-file');
    const addImgBtn=row.querySelector('.ae-add-img');
    const linkInput=row.querySelector('.ae-link-img');
    const linkBtn=row.querySelector('.ae-add-link');
    const imgRow=row.querySelector('.ae-img-row');
    function readImages(){ try{ return JSON.parse(row.dataset.imgs||'null') || []; }catch(e){ return []; } }
    function writeImages(arr){ row.dataset.imgs=JSON.stringify(arr); renderChips(arr, imgRow, row); markDirty(a); }
    if(addImgBtn) addImgBtn.addEventListener('click', ()=>fileInput && fileInput.click());
    if(fileInput) fileInput.addEventListener('change', async ()=>{
      const f=fileInput.files && fileInput.files[0]; fileInput.value=''; if(!f) return;
      const arr=readImages();
      // Rule 3: Chromium -> download into assets/pictures/ and store the new relative URL.
      if(window.showDirectoryPicker && typeof writePictureToAssets==='function'){
        const rel=await writePictureToAssets(f);
        if(rel){ arr.push({ name:f.name, src:rel }); writeImages(arr); toast('Saved to '+rel); return; }
      }
      // Rule 2: any other location -> always embed as data: URL (no loss).
      const dataUrl=await fileToDataUrl(f);
      arr.push({ name:f.name, src:dataUrl }); writeImages(arr);
    });
    if(linkBtn) linkBtn.addEventListener('click', ()=>{
      const v=(linkInput.value||'').trim(); if(!v) return;
      const arr=readImages(); arr.push({ name:v.split('/').pop()||v, src:v }); writeImages(arr); linkInput.value='';
    });
    // Rule 1: invalid/missing link -> broken image + inline error (handled in renderChips).
    renderChips(readImages(), imgRow, row);
  }
  function appendLogRow(a){
    const tb=$('aeLogBody'); const i=tb.children.length;
    tb.insertAdjacentHTML('beforeend', logRowHtml(i, {date: todayStr(), text:''}));
    bindLogRow(tb.lastElementChild, a);
    markDirty(a);
  }
  // --- Picture helpers ---
  function fileToDataUrl(file){ return new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); }); }
  function collectLogImages(row){ try{ return JSON.parse(row.dataset.imgs||'null') || []; }catch(e){ return []; } }
  function renderChips(arr, imgRow, row){
    if(!imgRow) return;
    imgRow.innerHTML = arr.map((im,idx)=>`<span class="ae-img-chip" data-idx="${idx}" data-src="${esc(im.src)}" data-name="${esc(im.name||'image')}" title="Click to review">`+
      `<img src="${esc(im.src)}" alt="${esc(im.name||'image')}" onerror="this.parentNode.classList.add('broken')" />`+
      `${esc(im.name||'image')}<button class="ae-img-rm" title="Remove">✕</button></span>`).join('');
    imgRow.querySelectorAll('.ae-img-chip').forEach(chip=>{
      chip.addEventListener('click', e=>{ if(e.target.classList.contains('ae-img-rm')) return; openImgReview(chip.dataset.src, chip.dataset.name); });
      chip.querySelector('.ae-img-rm').addEventListener('click', e=>{ e.stopPropagation(); const i=+chip.dataset.idx; const a=arr.slice(); a.splice(i,1); row.dataset.imgs=JSON.stringify(a); renderChips(a, imgRow, row); markDirty(state.actions.find(x=>x.id===state.selection.actions)); });
    });
  }
  // --- Image review lightbox ---
  function openImgReview(src, name){
    const m=$('imgReviewModal'); if(!m) return;
    $('imgReviewName').textContent=name||'image';
    const body=$('imgReviewBody');
    body.innerHTML='';
    const img=document.createElement('img'); img.src=src; img.className='img-review-img'; img.alt=name||'image';
    img.onerror=()=>{ body.innerHTML='<div class="img-review-err">⚠ Picture could not be loaded.<br>This link is invalid or the file is missing.<br><span class="img-review-src">'+esc(src)+'</span></div>'; };
    body.appendChild(img);
    const dl=$('imgReviewDownload');
    if(dl){ dl.onclick=()=>{ const a=document.createElement('a'); a.href=src; a.download=name||'image'; a.click(); }; }
    m.classList.add('open');
  }
  function closeImgReview(){ const m=$('imgReviewModal'); if(m) m.classList.remove('open'); }
  if($('imgReviewClose')) $('imgReviewClose').onclick=closeImgReview;
  if($('imgReviewClose2')) $('imgReviewClose2').onclick=closeImgReview;
  if($('imgReviewModal')) $('imgReviewModal').onclick=e=>{ if(e.target===$('imgReviewModal')) closeImgReview(); };

  // ---- ISS-23 / ISS-24: delete with parent protection + dependency-impact confirmation ----
  function deleteAction(a){
    if(!a) return;
    // ISS-23: a parent (summary) action that still has sub-actions cannot be deleted.
    const kids = childrenOf(a.id);
    if(kids.length){
      toast(`Cannot delete "${a.title}" — it has ${kids.length} sub-action(s). Promote or move them first.`);
      return;
    }
    // ISS-24: list every dependency link that would be removed, then confirm in a custom modal.
    const impact = buildDeleteImpact(a);
    showDeleteConfirm(a, impact);
  }
  function buildDeleteImpact(a){
    const outbound = actionDeps(a).map(d=>({ text: depLabel(d) }));
    const inbound = [];
    liveActions().forEach(x=>{
      if(x.id===a.id) return;
      (Array.isArray(x.deps)?x.deps:[]).forEach(d=>{ if(d.predKind==='action' && d.predId===a.id) inbound.push({ text: depLabel(d), from: x.title }); });
    });
    return { outbound, inbound };
  }
  function showDeleteConfirm(a, impact){
    const total = impact.outbound.length + impact.inbound.length;
    const row = (tag, text, sub) => `<li><span class="dc-tag">${esc(tag)}</span><span class="dc-text">${esc(text)}${sub?` <span class="dc-sub">← ${esc(sub)}</span>`:''}</span></li>`;
    const obHtml = impact.outbound.length ? `<ul class="dc-list">${impact.outbound.map(d=>row('Outbound', d.text)).join('')}</ul>` : `<p class="dc-empty">— none</p>`;
    const ibHtml = impact.inbound.length ? `<ul class="dc-list">${impact.inbound.map(d=>row('Inbound', d.text, d.from)).join('')}</ul>` : `<p class="dc-empty">— none</p>`;
    $('dcBody').innerHTML =
      `<p class="dc-intro">Delete <b>#${a.id} ${esc(a.title)}</b>? These dependency links will be removed:</p>`
      + `<div class="dc-sec-h">Outbound — this action depends on</div>${obHtml}`
      + `<div class="dc-sec-h">Inbound — other actions depend on this</div>${ibHtml}`
      + `<p class="dc-total"><b>${total}</b> link(s) in total will be removed. The action stays in action.json until physically removed in Settings → Deleted.</p>`;
    const modal=$('delConfirmModal');
    modal.onclick=e=>{ if(e.target===modal) hideDeleteConfirm(); };
    $('dcClose').onclick=hideDeleteConfirm;
    $('dcCancel').onclick=hideDeleteConfirm;
    $('dcConfirm').onclick=()=>{ hideDeleteConfirm(); softDeleteAction(a); };
    modal.classList.add('open');
    const f=$('dcConfirm'); if(f) f.focus();
  }
  function hideDeleteConfirm(){ const m=$('delConfirmModal'); if(m) m.classList.remove('open'); }
  function softDeleteAction(a){
    if(!a || a.deleted) return;
    const outboundCount = actionDeps(a).length;
    // ISS-24: drop every inbound link that points at this action from all other actions.
    let inboundRemoved = 0;
    state.actions.forEach(x=>{
      if(x.id===a.id) return;
      if(Array.isArray(x.deps) && x.deps.length){
        const before = x.deps.length;
        x.deps = x.deps.filter(d=> !(d.predKind==='action' && d.predId===a.id));
        inboundRemoved += before - x.deps.length;
      }
    });
    // outbound links belong to this (now deleted) action and are dropped with it.
    a.deps = [];
    a.deleted = true; a.deletedOn = todayStr();
    if(state.selection.actions===a.id) state.selection.actions = (liveActions()[0]&&liveActions()[0].id) || null;
    markDataDirty(); refresh();
    const total = inboundRemoved + outboundCount;
    toast(`Action deleted. ${total} dependency link(s) removed — Save Actions to persist`);
  }
  function restoreAction(a){
    if(!a || !a.deleted) return;
    a.deleted = false; a.deletedOn = '';
    markDataDirty(); refresh(); toast('Action restored — Save Actions to persist');
  }
  function syncPreview(a){
    const status=($('aeSeg').querySelector('button.on')||{}).dataset ? $('aeSeg').querySelector('button.on').dataset.s : a.statusId;
    const priority=($('aePriority').querySelector('button.on')||{}).dataset ? $('aePriority').querySelector('button.on').dataset.p : a.priorityId;
    const pid=$('aeProject').value, did=$('aeDiscipline').value;
    const due=$('aeDue').value, creator=$('aeCreator').value;
    const as=selectedAssignees($('aeAssignee'));
    readDepsInto(a);
    const isParent = childrenOf(a.id).length > 0;
    if(!isParent){
      readScheduleInto(a);
      readProgressInto(a);
    }
    const live=Object.assign({}, a, {
      title:$('aeTitle').value, statusId:status, priorityId:priority, projectId:pid, disciplineId:did, due,
      assignedToIds:as.ids, assignedToNames:as.orphans, createdById:creator, deps: a.deps.slice(),
      schedule: a.schedule||{}, progress: a.progress||0,
      detailLog:[...document.querySelectorAll('#aeLogBody .ae-log-row')].map(tr=>{ const imgs=collectLogImages(tr); return { date:tr.querySelector('.ae-log-date').value, text:tr.querySelector('.ae-log-text').value, images: imgs }; })
    });
    const rep=$('aeReport'); if(rep) rep.innerHTML=reportHtml(live);
    const b=$('edBread'); if(b) b.textContent='Actions / '+$('aeTitle').value;
    const cr=$('tbCrumb'); if(cr) cr.innerHTML = renderTopbarCrumb('Actions / '+$('aeTitle').value);
  }
  async function saveInlineAction(a){
    const title=$('aeTitle').value.trim(); if(!title){ toast('Title required'); return; }
    a.title=title;
    a.projectId=$('aeProject').value;
    a.disciplineId=$('aeDiscipline').value;
    const st=selectedSeg($('aeSeg')); if(st){ a.statusId=st; delete a.statusLabel; }
    const pr=selectedPriority($('aePriority')); if(pr){ a.priorityId=pr; delete a.priorityLabel; }
    a.due=$('aeDue').value;
    const as=selectedAssignees($('aeAssignee'));
    a.assignedToIds=as.ids; a.assignedToNames=as.orphans; delete a.assignedTo;
    const cr=$('aeCreator').value; a.createdById=cr; if(cr) delete a.createdByName;
    readDepsInto(a);
    readCustomFieldsInto(a);
    const isParent = childrenOf(a.id).length > 0;
    if(!isParent){
      readScheduleInto(a);
      readProgressInto(a);
    }
    delete a.dependsOn;
    a.detailLog=[...document.querySelectorAll('#aeLogBody .ae-log-row')].map(tr=>{ const imgs=collectLogImages(tr); return { date: tr.querySelector('.ae-log-date').value, text: tr.querySelector('.ae-log-text').value, images: imgs }; });
    a.history=a.history||[]; a.history.push({d:todayStr(), t:'Edited inline'});
    edDirty=false; state.dataDirty=false; updateSaveButtons();
    refresh();
    toast('Action updated');
    try{ await writeDataFile(); }catch(e){}
  }
  function renderProjectsMain(){
    const p=state.projects.find(x=>x.id===state.selection.projects);
    if(!p){ setEdTop('Projects'); $('edBody').innerHTML=`<p class="ed-desc">Select a project from the left to view its dashboard. Projects are managed in <b>Settings → Projects</b>.</p>`; return; }
    const s=projStats(p.id);
    const discCounts = state.disciplines.map(d=>{ const n=liveActions().filter(a=>a.projectId===p.id&&a.disciplineId===d.id).length; return {d,n}; }).filter(x=>x.n>0);
    const recent = liveActions().filter(a=>a.projectId===p.id).slice(-5).reverse();
    setEdTop('Projects / '+p.name,'+ Add Action',()=>openModalCreate(p.id, state.disciplines[0]&&state.disciplines[0].id));
    $('edBody').innerHTML = `
      <h1 class="ed-title">${esc(p.name)}</h1>
      <div class="sbar wide"><div class="sbar-fill" style="width:${s.pct}%"></div></div>
      <div class="ed-desc">${s.pct}% complete · ${s.total} actions · ${s.blocked} blocked</div>
      <div class="ed-section-h">Disciplines</div>
      <div class="dep-flow">${discCounts.map(x=>`<div class="dep-chip">${esc(discName(x.d.id))} <b>${x.n}</b></div>`).join('')||'<span class="ed-desc">No actions yet.</span>'}</div>
      <div class="ed-section-h">Recent actions</div>
      ${recent.map(a=>`<div class="meta-row linkrow" data-actid="${a.id}">${esc(a.title)} — <span class="badge" style="height:20px;${aStatusStyle(a)}">${esc(aStatusLabel(a))}</span></div>`).join('')||`<div class="ed-desc">No actions yet in this project — add your first one.</div><div class="ed-actions empty-main"><button class="btn primary" id="pAddAct" type="button">+ Add action</button></div>`}`;
    const pa=$('pAddAct'); if(pa) pa.onclick=()=>openModalCreate(p.id, state.disciplines[0]&&state.disciplines[0].id);
    $('edBody').querySelectorAll('[data-actid]').forEach(r=>r.onclick=async ()=>{ if(await setPerspective('actions')) selectNode(parseInt(r.dataset.actid,10)); });
  }
  function renderDisciplinesMain(){
    const d=state.disciplines.find(x=>x.id===state.selection.disciplines);
    if(!d){ setEdTop('Disciplines'); $('edBody').innerHTML=`<p class="ed-desc">Select a discipline from the left to see its cross-project breakdown.</p>`; return; }
    const acts=liveActions().filter(a=>a.disciplineId===d.id);
    const byProj={}; acts.forEach(a=>{ (byProj[a.projectId]=byProj[a.projectId]||[]).push(a); });
    setEdTop('Disciplines / '+d.name);
    let html=`<h1 class="ed-title">${esc(d.name)}</h1><div class="ed-desc">${acts.length} actions across ${Object.keys(byProj).length} project(s).</div>`;
    Object.keys(byProj).forEach(pid=>{
      html+=`<div class="ed-section-h">${esc(projName(pid))}</div>`;
      html+=byProj[pid].map(a=>`<div class="meta-row linkrow" data-actid="${a.id}">${esc(a.title)} — <span class="badge" style="height:20px;${aStatusStyle(a)}">${esc(aStatusLabel(a))}</span></div>`).join('');
    });
    if(!acts.length) html+=`<div class="ed-desc">No actions assigned to this discipline yet — add your first one.</div><div class="ed-actions empty-main"><button class="btn primary" id="dAddAct" type="button">+ Add action</button></div>`;
    $('edBody').innerHTML=html;
    const da=$('dAddAct'); if(da) da.onclick=()=>openModalCreate(state.projects[0]&&state.projects[0].id, d.id);
    $('edBody').querySelectorAll('[data-actid]').forEach(r=>r.onclick=async ()=>{ if(await setPerspective('actions')) selectNode(parseInt(r.dataset.actid,10)); });
  }
  function renderReportsMain(){
    const r=state.selection.reports||'status';
    const label=(REPORTS.find(x=>x.id===r)||{}).label||'';
    setEdTop('Reports / '+label);
    let data=[];
    if(r==='status'){ const m={}; liveActions().forEach(a=>m[aStatusLabel(a)]=(m[aStatusLabel(a)]||0)+1); data=Object.keys(m).map(k=>({k,v:m[k]})).sort((a,b)=>{ const ia=state.statuses.findIndex(s=>s.label===a.k), ib=state.statuses.findIndex(s=>s.label===b.k); return (ia<0?999:ia)-(ib<0?999:ib); }); }
    else if(r==='discipline'){ const m={}; liveActions().forEach(a=>{ const n=discName(a.disciplineId); m[n]=(m[n]||0)+1; }); data=Object.keys(m).map(k=>({k,v:m[k]})); }
    else if(r==='project'){ const m={}; liveActions().forEach(a=>{ const n=projName(a.projectId); m[n]=(m[n]||0)+1; }); data=Object.keys(m).map(k=>({k,v:m[k]})); }
    else if(r==='assignee'){ const m={}; liveActions().forEach(a=>{ const list=assigneeList(a); if(list.length) list.forEach(n=>m[n]=(m[n]||0)+1); else m['Unassigned']=(m['Unassigned']||0)+1; }); data=Object.keys(m).map(k=>({k,v:m[k]})); }
    else if(r==='priority'){ const m={}; liveActions().forEach(a=>{ const n=aPriorityLabel(a); m[n]=(m[n]||0)+1; }); data=Object.keys(m).map(k=>({k,v:m[k]})).sort((a,b)=>{ const ia=state.priorities.findIndex(p=>p.label===a.k), ib=state.priorities.findIndex(p=>p.label===b.k); return (ia<0?999:ia)-(ib<0?999:ib); }); }
    const max=Math.max(1,...data.map(d=>d.v));
    const barColor = d => r==='status' ? statusColor(d.k) : r==='priority' ? priorityColor(d.k) : '';
    $('edBody').innerHTML=`<h1 class="ed-title">${esc(label)}</h1>
      <div class="ed-section-h">${data.reduce((s,d)=>s+d.v,0)} actions</div>
      ${data.map(d=>{ const col=barColor(d); return `<div class="rpt-row"><span class="rpt-label">${esc(d.k)}</span><div class="rpt-bar"><div class="rpt-fill" style="width:${Math.round(d.v/max*100)}%${col?`;background:${col}`:''}"></div></div><span class="rpt-val">${d.v}</span></div>`; }).join('')}
      ${data.length?'':'<div class="ed-desc">No actions yet — add an action to see reports.</div><div class="ed-actions empty-main"><button class="btn primary" id="rptAddAct" type="button">+ Add action</button></div>'}`;
    const ra=$('rptAddAct'); if(ra) ra.onclick=()=>openModalCreate(null,null);
  }
  function renderSearchMain(){
    const f=state.selection.search;
    const def=FILTERS.find(x=>x.id===f)||FILTERS[0];
    if(state.searchOpen){
      const a=state.actions.find(x=>x.id===state.searchOpen);
      if(a){ setEdTop('Search / '+def.label); $('edBody').innerHTML=`<button class="btn" id="srchBack" style="margin-bottom:12px">← Back to results</button>`+actionDetailHtml(a); $('srchBack').onclick=()=>{ state.searchOpen=null; renderMain(); }; bindActionDetail(a); return; }
      state.searchOpen=null;
    }
    setEdTop('Search / '+def.label);
    const list=def.fn();
    $('edBody').innerHTML=`<div class="ed-section-h">${list.length} result(s)</div>`+ (list.length? list.map(a=>`<div class="meta-row linkrow" data-actid="${a.id}">${esc(a.title)} — <span class="badge b-disc">${esc(projName(a.projectId))}</span> <span class="badge" style="height:20px;${aStatusStyle(a)}">${esc(aStatusLabel(a))}</span></div>`).join('') : `<div class="ed-desc">No matching actions.</div>`);
    $('edBody').querySelectorAll('[data-actid]').forEach(r=>r.onclick=()=>{ state.searchOpen=parseInt(r.dataset.actid,10); renderMain(); });
  }
  // ---- Sidebar interactions ----
  $('sideBody').addEventListener('click', e=>{
    if(e.target.closest('input')) return;
    if(state.perspective!=='actions'){ const it=e.target.closest('.sitem'); if(it) selectNode(it.dataset.id); return; }
    // Tree logic
    const ctrlBtn=e.target.closest('[data-act]');
    if(ctrlBtn){
      const node=e.target.closest('.tnode');
      const type=node.dataset.type, id=node.dataset.id, pid=node.dataset.pid, act=ctrlBtn.dataset.act;
      if(act==='add-action'){ openModalCreate(pid, (node.classList.contains('unassigned') ? '' : id)); }
      else if(act==='edit-action'){ selectNode(parseInt(id,10)); }
      else if(act==='toggle-action'){ state.expanded['a'+id]=!state.expanded['a'+id]; renderSideBody(); }
      return;
    }
    const chev=e.target.closest('.tchev');
    if(chev){ const node=e.target.closest('.tnode'); state.expanded[node.dataset.key]=!state.expanded[node.dataset.key]; renderSideBody(); return; }
    const actionRow=e.target.closest('.tnode.action'); if(actionRow){ selectNode(parseInt(actionRow.dataset.id,10)); return; }
    const groupRow=e.target.closest('.tnode.project, .tnode.discipline'); if(groupRow){ state.expanded[groupRow.dataset.key]=!state.expanded[groupRow.dataset.key]; renderSideBody(); }
  });
  $('sideBody').addEventListener('keydown', e=>{
    if(e.target.id==='tmpInput'){
      if(e.key==='Enter'){ commitTmp(e.target.value); }
      else if(e.key==='Escape'){ e.stopPropagation(); state.pendingAdd=null; state.editTarget=null; renderSideBody(); renderMain(); }
    } else if((e.key==='Enter'||e.key===' ') && e.target.classList && (e.target.classList.contains('tnode')||e.target.classList.contains('sitem'))){
      e.preventDefault(); e.target.click();
    }
  });
  function commitTmp(val){
    val=(val||'').trim();
    if(!val){ state.pendingAdd=null; state.editTarget=null; renderSideBody(); return; }
    if(state.pendingAdd){
      if(state.pendingAdd.type==='project'){
        const id=uid('p'); state.projects.push(ensureProjectLists({id, name:val})); state.expanded['p'+id]=true; toast('Project added');
      } else {
        const id=uid('d'); const pid=state.pendingAdd.projectId;
        state.disciplines.push({id, name:val}); const pj=projById(pid); if(pj){ ensureProjectLists(pj); if(!pj.disciplineIds.includes(id)) pj.disciplineIds.push(id); } state.expanded[pid+'::d'+id]=true; state.expanded['p'+pid]=true; toast('Discipline added');
      }
      state.pendingAdd=null;
    } else if(state.editTarget){
      if(state.editTarget.type==='project'){ const p=state.projects.find(x=>x.id===state.editTarget.id); if(p) p.name=val; }
      else { const d=state.disciplines.find(x=>x.id===state.editTarget.id); if(d) d.name=val; }
      state.editTarget=null; toast('Renamed');
    }
    markDataDirty(); refresh();
  }
  function deleteNode(type, id){
    if(type==='project'){
      const p=state.projects.find(x=>x.id===id); if(!p) return;
      const n=state.actions.filter(a=>a.projectId===id).length;
      if(!confirm(`Delete project "${p.name}"${n?` and its ${n} action(s)`:''}?`)) return;
      state.actions=state.actions.filter(a=>a.projectId!==id);
      state.projects=state.projects.filter(x=>x.id!==id);
      delete state.expanded['p'+id]; toast('Project deleted');
    } else {
      const d=state.disciplines.find(x=>x.id===id); if(!d) return;
      const n=state.actions.filter(a=>a.disciplineId===id).length;
      if(!confirm(`Delete discipline "${d.name}"${n?` and its ${n} action(s)`:''}?`)) return;
      state.actions=state.actions.filter(a=>a.disciplineId!==id);
      state.disciplines=state.disciplines.filter(x=>x.id!==id);
      state.projects.forEach(pr=>{ if(Array.isArray(pr.disciplineIds)) pr.disciplineIds=pr.disciplineIds.filter(x=>x!==id); });
      state.projects.forEach(p=>delete state.expanded[p.id+'::d'+id]); toast('Discipline deleted');
    }
    if(state.selection.actions && !state.actions.find(a=>a.id===state.selection.actions)) state.selection.actions=null;
    if(state.selection.projects===id) state.selection.projects=null;
    if(state.selection.disciplines===id) state.selection.disciplines=null;
    markDataDirty(); refresh();
  }
