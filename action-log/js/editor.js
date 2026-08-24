"use strict";

  // ---- Action modal ----
  function populateSelect(sel, items, val){ sel.innerHTML=items.map(i=>`<option value="${i.id}"${i.id===val?' selected':''}>${esc(i.name)}</option>`).join(''); }
  function populateMemberSelect(sel, valId, projectId, snapName){
    const members = (projectId ? projectMembers(projById(projectId)) : state.members).filter(m=>m.name && !m.left);
    let opts=['<option value="">—</option>'];
    members.forEach(m=>{ if(m.name) opts.push(`<option value="${esc(m.id)}"${m.id===valId?' selected':''}>${esc(m.name+(m.role? ' · '+m.role:''))}</option>`); });
    if(snapName && !members.some(m=>m.id===valId)) opts.push(`<option value="" selected disabled>— snapshot: ${esc(snapName)} —</option>`);
    sel.innerHTML=opts.join('');
  }
  function renderSeg(container, selectedId, orphanLabel){
    const items = state.statuses.slice();
    const sel = selectedId || '';
    container.innerHTML=items.map(s=>`<button data-s="${esc(s.id)}" aria-pressed="${s.id===sel?'true':'false'}" class="${s.id===sel?'on':''}" style="${statusStyle(s.id)}">${esc(s.label)}</button>`).join('');
    if(orphanLabel) container.insertAdjacentHTML('afterbegin', `<button class="orphan" disabled type="button" title="This status no longer exists — pick one below">⚠ ${esc(orphanLabel)} (deleted)</button>`);
    container.querySelectorAll('button').forEach(b=>b.onclick=()=>{ container.querySelectorAll('button').forEach(x=>{ x.classList.remove('on'); x.setAttribute('aria-pressed','false'); }); b.classList.add('on'); b.setAttribute('aria-pressed','true'); });
  }
  function selectedSeg(container){ const on=container.querySelector('button.on'); return on?on.dataset.s:(state.statuses[0]?state.statuses[0].id:''); }
  // Multi-assignee picker (schema v2): chips carry member ids; orphan name chips kept for rectification.
  // projectId filters to the project's assigned members (unassigned are hidden).
  function renderAssigneePicker(container, action, projectId){
    if(!container) return;
    const act = action || {};
    const selIds = new Set(Array.isArray(act.assignedToIds)?act.assignedToIds.filter(Boolean):[]);
    const members = projectId ? projectMembers(projById(projectId)) : state.members;
    const list = members.filter(m=>m.name && !m.left);
    const html = list.map(m=>{
      const on = selIds.has(m.id);
      return `<button type="button" class="assignee-chip${on?' on':''}" data-id="${esc(m.id)}" data-n="${esc(m.name)}" aria-pressed="${on?'true':'false'}" title="${esc(m.role||'')}">${esc(m.name)}</button>`;
    }).join('');
    const orphans = (act.assignedToNames||[]).filter(Boolean).map(n=>`<button type="button" class="assignee-chip orphan" data-name="${esc(n)}" data-n="${esc(n)}" title="Member no longer exists — click to remove">${esc(n)} ⚠</button>`).join('');
    container.innerHTML = (list.length>8 ? `<input class="asm-filter" type="text" placeholder="Filter members…" />` : '')
      + (html || (orphans?'':'<span class="form-hint" style="margin:0">No members assigned to this project — add them in Settings → Members.</span>'))
      + orphans;
    const fi=container.querySelector('.asm-filter');
    if(fi) fi.oninput=()=>{ const q=fi.value.trim().toLowerCase(); container.querySelectorAll('.assignee-chip').forEach(b=>b.style.display = (!q || b.dataset.n.toLowerCase().includes(q)) ? '' : 'none'); };
  }
  function selectedAssignees(container){ if(!container) return { ids:[], orphans:[] }; return { ids:[...container.querySelectorAll('button.on[data-id]')].map(b=>b.dataset.id), orphans:[...container.querySelectorAll('.assignee-chip.orphan[data-name]')].map(b=>b.dataset.name) }; }
  const pickState = el => { const s=selectedAssignees(el); return { assignedToIds:s.ids, assignedToNames:s.orphans }; };
  function renderPrioritySeg(container, selectedId, orphanLabel){
    const items = state.priorities.slice();
    const def = selectedId || ((state.priorities.find(p=>p.label==='Medium')||state.priorities[0]||{}).id) || '';
    container.innerHTML=items.map(p=>`<button data-p="${esc(p.id)}" aria-pressed="${p.id===def?'true':'false'}" class="${p.id===def?'on':''}" style="${priorityStyle(p.id)}">${esc(p.label)}</button>`).join('');
    if(orphanLabel) container.insertAdjacentHTML('afterbegin', `<button class="orphan" disabled type="button" title="This priority no longer exists — pick one below">⚠ ${esc(orphanLabel)} (deleted)</button>`);
    container.querySelectorAll('button').forEach(b=>b.onclick=()=>{ container.querySelectorAll('button').forEach(x=>{ x.classList.remove('on'); x.setAttribute('aria-pressed','false'); }); b.classList.add('on'); b.setAttribute('aria-pressed','true'); });
  }
  function selectedPriority(container){ const on=container.querySelector('button.on'); return on?on.dataset.p:''; }
  // ---- Modal focus management (WCAG 2.4.3): focus first control on open, restore on close ----
  function openModalBox(id){
    const b=$(id); if(!b) return;
    b._lastFocus = document.activeElement;
    b.classList.add('open');
    const f=b.querySelector('input,select,textarea,button,[tabindex]:not([tabindex="-1"])');
    if(f) f.focus();
  }
  function closeModalBox(id){
    const b=$(id); if(!b) return;
    b.classList.remove('open');
    if(b._lastFocus && b._lastFocus.focus) b._lastFocus.focus();
  }
  function openModalCreate(pid, did){
    state.editingId=null; $('modalTitle').textContent='New Action';
    $('mTitle').value=''; $('mDesc').value='';
    const proj = pid || (state.projects[0] && state.projects[0].id) || '';
    populateSelect($('mProject'), state.projects, proj);
    populateDisciplineSelect($('mDiscipline'), proj, did || (projectDisciplines(projById(proj))[0]||{}).id || '');
    renderSeg($('mSeg'), ((findStatus('Pending')||state.statuses[0]||{}).id) || '');
    renderPrioritySeg($('mPriority'), ((state.priorities.find(p=>p.label==='Medium')||state.priorities[0]||{}).id) || '');
    $('mDue').value=''; $('mDepends').value='';
    renderAssigneePicker($('mAssignee'), {assignedToIds:[],assignedToNames:[]}, proj);
    populateMemberSelect($('mCreator'), '', proj);
    $('mProject').onchange=()=>{ const p=$('mProject').value;
      populateDisciplineSelect($('mDiscipline'), p, (projectDisciplines(projById(p))[0]||{}).id || '');
      renderAssigneePicker($('mAssignee'), pickState($('mAssignee')), p);
      populateMemberSelect($('mCreator'), $('mCreator').value, p);
    };
    $('actionModal').classList.add('open');
    const first=$('mTitle'); if(first) first.focus();
  }
  function modalSave(){
    const title=$('mTitle').value.trim(); if(!title){ toast('Title required'); return; }
    const desc=$('mDesc').value;
    const as=selectedAssignees($('mAssignee'));
    const data={ title, projectId:$('mProject').value, disciplineId:$('mDiscipline').value, statusId:selectedSeg($('mSeg')), priorityId:selectedPriority($('mPriority')), due:$('mDue').value, assignedToIds:as.ids, assignedToNames:as.orphans, createdById:$('mCreator').value, parentId:null, deps:[], schedule:{duration:DEFAULT_DURATION}, progress:0 };
    data.id=state.nextId++; data.history=[{d:todayStr(), t:'Created'}];
    data.createdOn = todayStr();
    data.detailLog = desc ? [{date: todayStr(), text: desc}] : [];
    state.actions.push(data); state.selection.actions=data.id; state.dataDirty=true; updateSaveButtons(); toast('Action created');
    closeModalBox('actionModal'); refresh();
  }
  // ---- Schema v3 decomposition: create sub-actions under a parent (ISS-11/12) ----
  function createChild(parentId, title){
    const p = state.actions.find(x=>x.id===parentId);
    if(!p) return null;
    if(actionTier(p) >= MAX_TIER){ toast('Max '+MAX_TIER+'-tier depth reached — a tier-'+MAX_TIER+' action cannot have sub-actions.'); return null; }
    const child = { id: state.nextId++, title: title||'Sub-action', projectId:p.projectId, disciplineId:p.disciplineId, statusId:p.statusId, priorityId:p.priorityId, assignedToIds:(p.assignedToIds||[]).slice(), assignedToNames:(p.assignedToNames||[]).slice(), createdById:p.createdById, parentId:parentId, history:[{d:todayStr(), t:'Created (sub-action)'}], createdOn: todayStr(), detailLog:[], schedule:{duration:DEFAULT_DURATION}, progress:0 };
    state.actions.push(child);
    return child;
  }
  function addSubAction(parentId){
    const c=createChild(parentId,'Sub-action'); if(!c) return;
    state.dataDirty=true; updateSaveButtons(); state.selection.actions=c.id; state.expanded['a'+parentId]=true; refresh(); toast('Sub-action added');
  }
  function splitIntoSubactions(a){
    if(actionTier(a) >= MAX_TIER){ toast('Tier-'+MAX_TIER+' action cannot be split further — create a new top-level action and link it with a dependency.'); return; }
    const c1=createChild(a.id,'Sub-action 1'); if(!c1) return;
    const c2=createChild(a.id,'Sub-action 2');
    // ISS-34: 入向依赖（别人依赖原 action）复制给两个子项；出向依赖（原 action 依赖别人）保留在原 action（UI 隐藏）。
    state.actions.forEach(x=>{
      if(x.deps && x.deps.length){
        x.deps.forEach(d=>{
          if(d.predKind==='action' && d.predId===a.id){
            // 入向依赖：复制给 c1 和 c2（新 rowKey）
            x.deps.push({ rowKey: nextDepKey(), predKind:'action', predId:c1.id, type:d.type, lag:d.lag });
            x.deps.push({ rowKey: nextDepKey(), predKind:'action', predId:c2.id, type:d.type, lag:d.lag });
          }
        });
      }
    });
    state.dataDirty=true; updateSaveButtons(); state.selection.actions=c1.id; state.expanded['a'+a.id]=true; refresh(); toast('Split into 2 sub-actions');
  }
  // ---- ISS-23: promote a sub-action one level up (to its immediate parent's level), NOT to the root ----
  function promoteAction(a){
    if(!a || a.parentId==null) return;
    const parent = state.actions.find(x=>x.id===a.parentId);
    // move up exactly one level: become a sibling of the current parent
    a.parentId = parent ? (parent.parentId!=null ? parent.parentId : null) : null;
    state.selection.actions = a.id;
    markDataDirty(); refresh(); toast('Promoted one level up');
  }
  $('modalSave').onclick=modalSave;
  $('modalCancel').onclick=()=>closeModalBox('actionModal');
  $('modalClose').onclick=()=>closeModalBox('actionModal');
  $('mAddStatus').onclick=()=>{ closeModalBox('actionModal'); state.selection.settings='fields'; setPerspective('settings'); };
