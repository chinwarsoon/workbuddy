"use strict";

  function renderSettingsMain(){
    const sec=state.selection.settings||'appearance';
    const label=(SETSECTIONS.find(x=>x.id===sec)||{}).label||'';
    const L=state.layout;
    setEdTop('Settings / '+label);
    if(sec==='appearance'){
      $('edBody').innerHTML=`
        <div class="toggle"><span>Dark theme</span><div class="switch ${L.dark?'on':''}" id="stDark"></div></div>
        <div class="toggle"><span>Brand accent</span><input type="color" id="stAccent" value="${esc(toHex6(state.setup.brand.accent||'#0066CC'))}" style="width:44px;height:28px;border:none;background:none;padding:0;cursor:pointer;" title="Accent color — saved to setup.json" /></div>
        <div class="ed-actions" style="margin-top:14px"><button class="btn" id="stSetView">Use current view as default</button><span class="form-hint" style="margin:0 0 0 12px">Default: ${esc(state.setup.defaultView.perspective||'actions')}</span></div>`;
      $('stDark').onclick=()=>{ L.dark=!L.dark; applyLayout(); markSetupDirty(); renderSideBody(); renderMain(); };
      setSwitch($('stDark'), L.dark);
      $('stAccent').oninput=e=>{ state.setup.brand.accent=toHex6(e.target.value); applyBrand(); markSetupDirty(); };
      $('stSetView').onclick=()=>{ state.setup.defaultView.perspective=state.perspective; markSetupDirty(); renderMain(); toast('Default view set to '+state.perspective); };
    } else if(sec==='layout'){
      $('edBody').innerHTML=`
        <div class="toggle"><span>Top bar</span><div class="switch ${L.topbar?'on':''}" id="stTop"></div></div>
        <div class="toggle"><span>Activity bar</span><div class="switch ${L.activity?'on':''}" id="stAct"></div></div>
        <div class="toggle"><span>Sidebar</span><div class="switch ${L.sidebar?'on':''}" id="stSide"></div></div>
        <div class="toggle"><span>Right panel</span><div class="switch ${L.right?'on':''}" id="stRight"></div></div>
        <div class="slider-row"><span style="width:90px">Sidebar</span><input type="range" id="stSw" min="180" max="360" value="${L.sw}" /><span id="stSwV">${L.sw}</span></div>
        <div class="slider-row"><span style="width:90px">Right</span><input type="range" id="stRw" min="220" max="380" value="${L.rw}" /><span id="stRwV">${L.rw}</span></div>
        <div class="slider-row"><span style="width:90px">Tree indent</span><input type="range" id="stTi" min="0" max="40" step="2" value="${L.treeIndent||16}" /><span id="stTiV">${L.treeIndent||16}</span></div>`;
      $('stTop').onclick=()=>{ L.topbar=!L.topbar; applyLayout(); markSetupDirty(); renderMain(); };
      $('stAct').onclick=()=>{ L.activity=!L.activity; applyLayout(); markSetupDirty(); renderMain(); };
      $('stSide').onclick=()=>{ L.sidebar=!L.sidebar; applyLayout(); markSetupDirty(); renderMain(); };
      $('stRight').onclick=()=>{ L.right=!L.right; applyLayout(); markSetupDirty(); renderMain(); };
      setSwitch($('stTop'), L.topbar);
      setSwitch($('stAct'), L.activity);
      setSwitch($('stSide'), L.sidebar);
      setSwitch($('stRight'), L.right);
      $('stSw').oninput=e=>{ L.sw=+e.target.value; $('stSwV').textContent=L.sw; applyLayout(); markSetupDirty(); };
      $('stRw').oninput=e=>{ L.rw=+e.target.value; $('stRwV').textContent=L.rw; applyLayout(); markSetupDirty(); };
      $('stTi').oninput=e=>{ L.treeIndent=+e.target.value; $('stTiV').textContent=L.treeIndent; applyLayout(); markSetupDirty(); renderSideBody(); };
    } else if(sec==='projects'){
      renderManagedList('projects');
    } else if(sec==='disciplines'){
      renderDisciplinePanel();
    } else if(sec==='members'){
      renderMembersList();
    } else if(sec==='fields'){
      renderColorList(state.statuses, 'statuses');
    } else if(sec==='priorities'){
      renderColorList(state.priorities, 'priorities');
    } else if(sec==='customfields'){
      renderCustomFields();
    } else if(sec==='actiontypes'){
      renderActionTypes();
    } else if(sec==='referencepoints'){
      renderReferencePoints();
    } else if(sec==='data'){
      const jsonA = serializeData();
      const jsonS = serializeSetup();
      const folderName = dataDirHandle ? esc(dataDirHandle.name) : 'not set';
      const fsApi = !!window.showDirectoryPicker;
      $('edBody').innerHTML=`<p class="ed-desc">Two files drive this app: <b>action.json</b> (business data) and <b>setup.json</b> (UI settings). Set a <b>data folder</b> once and every Save / Download / Import / Export picker will open there.</p>
        <div class="ed-actions" style="margin-top:8px"><button class="btn" id="dtFolder">${fsApi?'Set data folder':'Data folder (Chromium only)'}</button><span class="ed-desc" style="margin:0">Current: <b id="dtFolderName">${folderName}</b></span></div>
        <div class="ed-actions" style="margin-top:8px"><button class="btn primary" id="dtExp">Save Actions (action.json)</button><button class="btn" id="dtExpS">Save Settings (setup.json)</button><button class="btn" id="dtImp">Import…</button></div>
        <div class="ed-section-h">action.json (data)</div><div class="json-box">${esc(JSON.stringify(jsonA,null,2))}</div>
        <div class="ed-section-h">setup.json (UI settings)</div><div class="json-box">${esc(JSON.stringify(jsonS,null,2))}</div>`;
      $('dtExp').onclick=writeDataFile;
      $('dtExpS').onclick=saveSetupFile;
      $('dtImp').onclick=importViaPicker;
      const df=$('dtFolder'); if(df) df.onclick=setDataFolder;
    } else if(sec==='deleted'){
      const del = state.actions.filter(a=>a.deleted);
      const rows = del.map(a=>`<label class="lm-item del-row" style="cursor:pointer">
        <input type="checkbox" class="del-chk" value="${a.id}" />
        <span class="nm">${esc(a.title)}</span>
        <span class="ex-sub">${esc(projName(a.projectId))} · ${esc(discName(a.disciplineId))} · deleted ${esc(a.deletedOn||'—')}</span>
      </label>`).join('');
      $('edBody').innerHTML = `<h1 class="ed-title">Deleted actions</h1>
        <p class="ed-desc">Deleted actions are hidden from the tree, dashboards, reports and exports, and stay in <b>action.json</b> until you physically remove them here. Deleting a list item never touches deleted actions — in the reassign dialog you decide for each one.</p>
        <div class="ed-actions" style="margin-top:8px">
          <button class="btn primary" id="dlSelAll">Select all</button>
          <button class="btn" id="dlRestore">Restore selected</button>
          <button class="btn ghost" id="dlRemove">Remove selected (from action.json)</button>
          <span class="ed-desc" style="margin:0 0 0 10px"><b id="dlCount">${del.length}</b> deleted</span>
        </div>
        <div class="lm-list" id="dlList">${rows||'<div class="lm-empty">No deleted actions.</div>'}</div>`;
      const setSel = all => $('dlList').querySelectorAll('.del-chk').forEach(c=>c.checked=all);
      $('dlSelAll').onclick=()=>{ const all=[...$('dlList').querySelectorAll('.del-chk')].every(c=>c.checked); setSel(!all); };
      $('dlRestore').onclick=()=>{ const sel=[...$('dlList').querySelectorAll('.del-chk:checked')].map(c=>+c.value); if(!sel.length){ toast('Select deleted actions first'); return; } sel.forEach(id=>restoreAction(state.actions.find(a=>a.id===id))); renderSettingsMain(); };
      $('dlRemove').onclick=()=>{ const sel=[...$('dlList').querySelectorAll('.del-chk:checked')].map(c=>+c.value); if(!sel.length){ toast('Select deleted actions first'); return; }
        // ISS-31 (Option B): block permanent removal while any selected action is
        // still referenced by a LIVE action — prevents silent dangling dependents.
        const blocked = inboundRefsForPurge(sel);
        if(blocked.length){ showPurgeBlockedModal(blocked, sel.length); return; }
        if(!confirm('Physically remove '+sel.length+' deleted action(s) from action.json? This cannot be undone.')) return;
        state.actions = state.actions.filter(a=>!sel.includes(a.id));
        if(state.selection.actions && !state.actions.find(a=>a.id===state.selection.actions)) state.selection.actions=null;
        markDataDirty(); renderSettingsMain(); refresh(); toast('Removed '+sel.length+' action(s) — Save Actions to persist'); };
    }
  }
  function renderMembersList(){
    setEdTop('Settings / Members');
    const mems = state.members.filter(m=>!m.left);
    const leftMems = state.members.filter(m=>m.left);
    const discOptions = cur => '<option value="">— none —</option>' + state.disciplines.map(d=>`<option value="${esc(d.id)}"${d.id===cur?' selected':''}>${esc(d.name)}</option>`).join('');
    const COLS = '1.6fr 1fr 1.2fr 1.5fr 30px';
    const rowHtml = m => `<div class="lm-item lm-member" data-id="${esc(m.id)}" style="grid-template-columns:${COLS}">
      <input class="lm-inp" data-f="name" placeholder="Name" value="${esc(m.name||'')}" />
      <input class="lm-inp" data-f="initials" placeholder="Initials" value="${esc(m.initials||'')}" />
      <input class="lm-inp" data-f="role" placeholder="Title" value="${esc(m.role||'')}" />
      <select class="lm-inp" data-f="disciplineId" title="Discipline">${discOptions(m.disciplineId||'')}</select>
      <button class="lm-mini del" title="Mark as left">🚪</button>
    </div>`;
    const pblocks = state.projects.map(p=>`<div class="proj-block"><span class="nm">${esc(p.name)}</span><span class="scount">${projectMembers(p).length} member(s)</span><button class="btn" id="pmMem_${esc(p.id)}">Select members…</button></div>`).join('');
    const lrows = leftMems.map(m=>`<div class="proj-block"><span class="nm">${esc(m.name)}</span><span class="scount">${esc(m.role||'')} · left ${esc(m.deletedOn||'—')}</span><button class="btn" data-restore="${esc(m.id)}">Restore</button><button class="btn ghost" data-remove="${esc(m.id)}">Remove permanently</button></div>`).join('');
    $('edBody').innerHTML = `<p class="ed-desc">Members are referenced by the <b>Assigned to</b> and <b>Created by</b> fields. Add or edit here — discipline is picked from the discipline catalog. Deleting marks a member as <b>left</b>: the record is kept so past assignments stay readable.</p>
      ${mems.length>8?'<input class="lm-filter" id="memFilter" type="text" placeholder="Filter members…" />':''}
      <div class="lm-list" id="memList">
        <div class="lm-head" style="grid-template-columns:${COLS}"><span>Name</span><span>Initials</span><span>Title</span><span>Discipline</span><span></span></div>
        ${mems.map(rowHtml).join('') || '<div class="lm-empty">No active members yet.</div>'}
      </div>
      <div class="ed-actions"><button class="btn" id="mAddMember">+ Add member</button></div>
      <div class="ed-section-h">Left members (${leftMems.length})</div>
      ${lrows || '<div class="lm-empty">No members have left.</div>'}
      <div class="ed-section-h">Per-project members</div>
      <p class="ed-desc">Only members assigned to a project appear in that project's action pickers — unassigned names are hidden there. Assignment is a pop-up selection.</p>
      ${pblocks || '<div class="lm-empty">No projects yet.</div>'}`;
    const bindRow = row=>{
      const getM = ()=>{
        const id=row.dataset.id;
        if(id==='__new__') return null;
        return state.members.find(x=>x.id===id);
      };
      row.querySelectorAll('input,select').forEach(f=>{
        const commit=()=>{
          let m = getM();
          if(!m){
            if(row.dataset.id!=='__new__') return;
            const vals={}; row.querySelectorAll('input,select').forEach(x=>vals[x.dataset.f]=x.value);
            if(!vals.name && !vals.initials && !vals.role && !vals.disciplineId) return; // untouched ghost -> stay pending
            m = normMember({ name:vals.name, initials:vals.initials, role:vals.role, disciplineId:vals.disciplineId });
            state.members.push(m); row.dataset.id=m.id; markDataDirty();
          }
          if(m && String(m[f.dataset.f]||'') !== String(f.value||'')){ m[f.dataset.f]=f.value; markDataDirty(); }
        };
        f.addEventListener('input', commit);
        f.addEventListener('change', commit);
      });
      const nameInp = row.querySelector('[data-f="name"]');
      if(nameInp) nameInp.addEventListener('blur', ()=>{ if(row.dataset.id==='__new__' && !nameInp.value.trim()) row.remove(); });
      row.querySelector('.del').onclick=()=>{
        const id=row.dataset.id; if(id==='__new__'){ row.remove(); return; }
        markLeftMember(id);
      };
    };
    $('edBody').querySelectorAll('.lm-member').forEach(bindRow);
    $('edBody').querySelectorAll('[data-restore]').forEach(b=>b.onclick=()=>restoreMember(b.dataset.restore));
    $('edBody').querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>requestDelete('member', b.dataset.remove, ()=>renderMembersList()));
    $('mAddMember').onclick=()=>{
      const div=document.createElement('div');
      div.className='lm-item lm-member'; div.dataset.id='__new__'; div.style.gridTemplateColumns=COLS;
      div.innerHTML=`<input class="lm-inp" data-f="name" placeholder="Name" /><input class="lm-inp" data-f="initials" placeholder="Initials" /><input class="lm-inp" data-f="role" placeholder="Title" /><select class="lm-inp" data-f="disciplineId">${discOptions('')}</select><button class="lm-mini del" title="Delete">🗑</button>`;
      $('memList').appendChild(div); bindRow(div);
      const fi=div.querySelector('[data-f="name"]'); if(fi) fi.focus();
    };
    const fi=$('memFilter'); if(fi) fi.oninput=e=>{
      const q=e.target.value.trim().toLowerCase();
      $('memList').querySelectorAll('.lm-member').forEach(row=>{ row.style.display = (!q || (row.textContent||'').toLowerCase().includes(q)) ? '' : 'none'; });
    };
    state.projects.forEach(p=>{ const b=$('pmMem_'+p.id); if(b) b.onclick=()=>openProjectMemberModal(p.id); });
  }
  function renderColorList(list, kind){
    const isPrio = kind==='priorities';
    // ISS-75: statuses gain a 3-letter short-code column (editable, shown in the compact
    // detail-log meta pill). Priorities carry no code, so their layout stays 3 columns.
    const COLS = kind==='statuses' ? '30px 1fr 72px 30px' : '30px 1fr 30px';
    setEdTop('Settings / '+(isPrio?'Priorities':'Statuses'));
    const rowHtml = o => {
      if(kind==='statuses' && o.builtin){
        return `<div class="lm-item lm-member lm-builtin" data-id="${esc(o.id)}" style="grid-template-columns:${COLS}">
          <span class="sw-trigger" style="background:${esc(toHex6(o.color))}" title="${esc(o.label)} (system built-in)"></span>
          <span class="builtin-label">${esc(o.label)} <span class="builtin-tag">Built-in</span></span>
          <input data-f="code" class="cl-code" placeholder="PEN" maxlength="3" value="${esc(o.code||'')}" title="Short code shown in the detail-log status pill" />
          <span class="builtin-lock" title="System status — read only">🔒</span>
        </div>`;
      }
      const codeCell = kind==='statuses'
        ? `<input data-f="code" class="cl-code" placeholder="PEN" maxlength="3" value="${esc(o.code||'')}" title="Short code shown in the detail-log status pill" />`
        : '';
      return `<div class="lm-item lm-member" data-id="${esc(o.id)}" style="grid-template-columns:${COLS}">
        <span class="sw-trigger" data-swatch style="background:${esc(toHex6(o.color))}" title="Color — ${esc(o.label)}"></span>
        <input data-f="label" placeholder="${isPrio?'Priority':'Status'}" value="${esc(o.label||'')}" />
        ${codeCell}
        <button class="lm-mini del" title="Delete">🗑</button>
      </div>`;
    };
    const headCols = kind==='statuses'
      ? '<span>Color</span><span>Label</span><span>Code</span><span></span>'
      : '<span>Color</span><span>Label</span><span></span>';
    $('edBody').innerHTML = `<p class="ed-desc">${isPrio
        ? 'Priorities are managed here only — label and color. Deleting one is blocked while any action uses it: reassign those actions first, nothing is deleted silently.'
        : 'Statuses are managed here only — label, color and a 3-letter <b>short code</b>. The code is shown in the compact detail-log status pill (a coloured dot carries the colour, so you never have to memorise it); it is auto-derived from the label but you can override it here.'}</p>
      ${list.length>8?'<input class="lm-filter" id="clFilter" type="text" placeholder="Filter…" />':''}
      <div class="lm-list" id="clList">
        <div class="lm-head" style="grid-template-columns:${COLS}">${headCols}</div>
        ${list.map(rowHtml).join('') || '<div class="lm-empty">No '+kind+' yet.</div>'}
      </div>
      <div class="ed-actions"><button class="btn" id="clAdd">+ Add ${isPrio?'priority':'status'}</button></div>`;
    const bind = row => {
      bindStdRow(row, list, {
        fields:['label','code'],
        create: vals => {
          const lb=String(vals.label||'').trim(); if(!lb) return null;
          if(list.some(x=>String(x.label||'').toLowerCase()===lb.toLowerCase())){ toast((isPrio?'Priority':'Status')+' already exists'); return null; }
          const st = isPrio ? normPriority(lb, list.length) : normStatus(lb, list.length);
          const c = String(vals.code||'').trim().toUpperCase().replace(/[^A-Z]/g,'').slice(0,3);
          if(c) st.code = c;
          return st;
        },
        delConfirm: id => true,
        onRemove: id=>requestDelete(isPrio?'priority':'status', id, ()=>renderColorList(list, kind))
      });
      const sw=row.querySelector('[data-swatch]');
      if(sw && row.dataset.id!=='__new__') sw.onclick=e=>{ e.stopPropagation(); openStatusColorPop(list, row.dataset.id, sw); };
    };
    $('edBody').querySelectorAll('.lm-member').forEach(row=>{
      // Built-in statuses are locked for label/colour but their short code IS editable (ISS-75).
      if(row.classList.contains('lm-builtin')){
        const codeEl=row.querySelector('[data-f="code"]');
        if(codeEl) codeEl.addEventListener('input', ()=>{ const o=list.find(x=>x.id===row.dataset.id); if(o){ o.code=codeEl.value.trim().toUpperCase().replace(/[^A-Z]/g,'').slice(0,3); markDataDirty(); } });
        return;
      }
      bind(row);
    });
    $('clAdd').onclick=()=>{
      const div=document.createElement('div'); div.className='lm-item lm-member'; div.dataset.id='__new__'; div.style.gridTemplateColumns=COLS;
      const codeCell = kind==='statuses' ? '<input data-f="code" class="cl-code" placeholder="PEN" maxlength="3" title="Short code" />' : '';
      div.innerHTML=`<span class="sw-trigger" data-swatch style="background:#EFEAFB" title="Color"></span><input data-f="label" placeholder="${isPrio?'Priority':'Status'}" />${codeCell}<button class="lm-mini del" title="Delete">🗑</button>`;
      $('clList').appendChild(div); bind(div);
      const fi=div.querySelector('[data-f="label"]'); if(fi) fi.focus();
    };
    const fi=$('clFilter'); if(fi) fi.oninput=e=>{
      const q=e.target.value.trim().toLowerCase();
      $('clList').querySelectorAll('.lm-member').forEach(row=>{ row.style.display = (!q || (row.textContent||'').toLowerCase().includes(q)) ? '' : 'none'; });
    };
  }
  function renderDisciplinePanel(){
    setEdTop('Settings / Disciplines');
    const list = state.disciplines;
    const COLS='1fr 30px';
    const rowHtml = d => `<div class="lm-item lm-member" data-id="${esc(d.id)}" style="grid-template-columns:${COLS}">
      <input data-f="name" placeholder="Name" value="${esc(d.name||'')}" />
      <button class="lm-mini del" title="Delete">🗑</button>
    </div>`;
    const blocks = state.projects.map(p=>`<div class="proj-block"><span class="nm">${esc(p.name)}</span><span class="scount">${projectDisciplines(p).length} discipline(s)</span><button class="btn" id="pdBtn_${esc(p.id)}">Select disciplines…</button></div>`).join('');
    $('edBody').innerHTML = `<p class="ed-desc">Global catalog — add, rename or delete a discipline here. Per project: choose which catalog disciplines apply via pop-up selection; unassigned ones are hidden in that project's tree and pickers. Deleting a discipline also removes its actions.</p>
      ${list.length>8?'<input class="lm-filter" id="dcFilter" type="text" placeholder="Filter disciplines…" />':''}
      <div class="lm-list" id="dcList">
        <div class="lm-head" style="grid-template-columns:${COLS}"><span>Name</span><span></span></div>
        ${list.map(rowHtml).join('') || '<div class="lm-empty">No disciplines yet.</div>'}
      </div>
      <div class="ed-actions"><button class="btn" id="dcAdd">+ Add discipline</button></div>
      <div class="ed-section-h">Per-project disciplines</div>
      <p class="ed-desc">Check = assigned to that project (shown in its tree & pickers). Order = tree display order.</p>
      ${blocks || '<div class="lm-empty">No projects yet.</div>'}`;
    const bind = row => bindStdRow(row, list, {
      fields:['name'],
      create: vals => vals.name.trim() ? { id:uid('d'), name:vals.name.trim() } : null,
      delConfirm: id => true,
      onRemove: id => requestDelete('discipline', id, ()=>renderDisciplinePanel())
    });
    $('edBody').querySelectorAll('.lm-member').forEach(bind);
    $('dcAdd').onclick=()=>{
      const div=document.createElement('div'); div.className='lm-item lm-member'; div.dataset.id='__new__'; div.style.gridTemplateColumns=COLS;
      div.innerHTML=`<input data-f="name" placeholder="Name" /><button class="lm-mini del" title="Delete">🗑</button>`;
      $('dcList').appendChild(div); bind(div);
      const fi=div.querySelector('[data-f="name"]'); if(fi) fi.focus();
    };
    const fi=$('dcFilter'); if(fi) fi.oninput=e=>{
      const q=e.target.value.trim().toLowerCase();
      $('dcList').querySelectorAll('.lm-member').forEach(row=>{ row.style.display = (!q || (row.textContent||'').toLowerCase().includes(q)) ? '' : 'none'; });
    };
    state.projects.forEach(p=>{ const b=$('pdBtn_'+p.id); if(b) b.onclick=()=>openProjectDisciplineModal(p.id); });
  }
  // Generic per-project management popup (complete modal window)
  function openProjectModal(title, bodyHtml, onDone){
    $('pmTitle').textContent=title;
    if(bodyHtml) $('pmBody').innerHTML=bodyHtml;
    $('pmDone').onclick=()=>{ closeModalBox('projectModal'); if(onDone) onDone(); };
    $('pmClose').onclick=()=>closeModalBox('projectModal');
    openModalBox('projectModal');
  }
  function openProjectDisciplineModal(pid){
    const p=projById(pid); if(!p) return;
    ensureProjectLists(p);
    const render=()=>{
      const q=((($('pdFilter')||{}).value)||'').trim().toLowerCase();
      const rows = state.disciplines.map(d=>{
        if(q && !d.name.toLowerCase().includes(q)) return '';
        const on=p.disciplineIds.includes(d.id);
        return `<div class="pm-row" data-d="${esc(d.id)}">
          <input type="checkbox" class="pd-chk" ${on?'checked':''} />
          <span class="nm">${esc(d.name)}</span>
          <span class="pm-move"><button type="button" class="pm-mini" data-mv="up" title="Move up">↑</button><button type="button" class="pm-mini" data-mv="down" title="Move down">↓</button></span>
        </div>`;
      }).join('');
      $('pmBody').innerHTML = `<input class="asm-filter" id="pdFilter" type="text" placeholder="Filter disciplines…" />
        <div class="lm-list">${rows||'<div class="lm-empty">No matching disciplines.</div>'}</div>
        <p class="form-hint">Check = assigned to ${esc(p.name)} (shown in its tree & pickers). Order = tree display order.</p>`;
      const fi=$('pdFilter'); if(fi) fi.oninput=render;
      $('pmBody').querySelectorAll('.pd-chk').forEach(c=>c.onchange=()=>{
        const id=c.closest('.pm-row').dataset.d;
        if(c.checked){ if(!p.disciplineIds.includes(id)) p.disciplineIds.push(id); }
        else p.disciplineIds = p.disciplineIds.filter(x=>x!==id);
        markDataDirty();
      });
      $('pmBody').querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{
        const id=b.closest('.pm-row').dataset.d; const i=p.disciplineIds.indexOf(id); if(i<0) return;
        const j=i+(b.dataset.mv==='up'?-1:1);
        if(j<0 || j>=p.disciplineIds.length) return;
        [p.disciplineIds[i],p.disciplineIds[j]]=[p.disciplineIds[j],p.disciplineIds[i]];
        markDataDirty(); render();
      });
    };
    openProjectModal('Disciplines — '+p.name, '', ()=>{ refresh(); toast('Project disciplines updated — Save Actions to persist'); });
    render();
  }
  function openProjectMemberModal(pid){
    const p=projById(pid); if(!p) return;
    ensureProjectLists(p);
    const render=()=>{
      const q=((($('pmFilter')||{}).value)||'').trim().toLowerCase();
      const rows = state.members.filter(m=>m.name && !m.left).map(m=>{
        if(q && !(m.name+' '+(m.role||'')).toLowerCase().includes(q)) return '';
        const on=p.memberIds.includes(m.id);
        return `<div class="pm-row" data-m="${esc(m.id)}"><input type="checkbox" class="pm-chk" ${on?'checked':''} /><span class="nm">${esc(m.name+(m.role?' · '+m.role:''))}</span></div>`;
      }).join('');
      $('pmBody').innerHTML = `<input class="asm-filter" id="pmFilter" type="text" placeholder="Filter members…" />
        <div class="lm-list">${rows||'<div class="lm-empty">No matching members.</div>'}</div>
        <p class="form-hint">Check = assigned to ${esc(p.name)}; only these appear in its action pickers.</p>`;
      const fi=$('pmFilter'); if(fi) fi.oninput=render;
      $('pmBody').querySelectorAll('.pm-chk').forEach(c=>c.onchange=()=>{
        const id=c.closest('.pm-row').dataset.m;
        if(c.checked){ if(!p.memberIds.includes(id)) p.memberIds.push(id); }
        else p.memberIds = p.memberIds.filter(x=>x!==id);
        markDataDirty();
      });
    };
    openProjectModal('Members — '+p.name, '', ()=>{ refresh(); toast('Project members updated — Save Actions to persist'); });
    render();
  }
  // Standard always-editable list row: ghost-create on first input, live commit, confirm+remove.
  // opts.setupDirty=true marks setup.json (not data) dirty — used by the custom-field catalog.
  function bindStdRow(row, list, opts){
    const mark = ()=> opts.setupDirty ? markSetupDirty() : markDataDirty();
    const get = ()=> row.dataset.id==='__new__' ? null : (list.find(x=>x.id===row.dataset.id)||null);
    row.querySelectorAll('input,select').forEach(f=>{
      const commit=()=>{
        let o=get();
        if(!o){
          if(row.dataset.id!=='__new__') return;
          const vals={}; row.querySelectorAll('input,select').forEach(x=>vals[x.dataset.f]=x.value);
          if(!opts.fields.some(x=>vals[x] && String(vals[x]).trim())) return; // untouched ghost
          o=opts.create(vals);
          if(!o) return; // rejected (duplicate/invalid) -> stays ghost
          list.push(o); row.dataset.id=o.id; mark();
          if(opts.afterCreate) opts.afterCreate(row, o);   // e.g. write the auto key to the readonly Key field
        }
        if(o && String(o[f.dataset.f]||'')!==String(f.value||'')){ o[f.dataset.f]=f.value; mark(); }
      };
      f.addEventListener('input', commit);
      f.addEventListener('change', commit);
    });
    const first=row.querySelector('[data-f]');
    if(first) first.addEventListener('blur', ()=>{ if(row.dataset.id==='__new__' && !String(first.value||'').trim()) row.remove(); });
    row.querySelector('.del').onclick=()=>{
      const id=row.dataset.id; if(id==='__new__'){ row.remove(); return; }
      if(opts.delConfirm && !opts.delConfirm(id)) return;
      opts.onRemove(id);
    };
  }
  // ---- ISS-31: Physical delete dependency guard (Option B: block, don't auto-strip) ----
  // Scan ALL actions (incl. soft-deleted) for inbound deps pointing into the given targetIds.
  function inboundRefsForPurge(targetIds){
    const targets = new Set(targetIds);
    const refs = [];
    state.actions.forEach(a => {
      if(!a.deps || !a.deps.length) return;
      a.deps.forEach(dep => {
        if(dep.predKind === 'action' && targets.has(dep.predId)){
          refs.push({ actionId: a.id, actionTitle: a.title, depType: dep.type || 'FS', lag: dep.lag || 0, deleted: !!a.deleted });
        }
      });
    });
    return refs;
  }
  // Reuse #delConfirmModal to show a blocking warning listing the live inbound refs.
  function showPurgeBlockedModal(refs, totalSelected){
    const live = refs.filter(r => !r.deleted);
    const dead = refs.filter(r => r.deleted);
    const lines = [];
    if(live.length){
      lines.push('<p class="ed-desc">⛔ <b>Physical removal blocked</b> — ' + live.length + ' of ' + totalSelected + ' selected action(s) are still referenced by <b>live actions</b>. Remove or reassign those dependencies first, then retry.</p>');
      lines.push('<div class="ed-section-h">Blocking live references</div>');
      live.forEach(r => lines.push(`<div class="rs-row"><span class="rs-t">${esc(r.actionTitle)}</span><em class="rs-k">${r.depType}</em><span class="rs-k">${r.lag ? 'lag ' + r.lag + 'd' : 'lag 0'}</span></div>`));
    }
    if(dead.length){
      lines.push('<div class="ed-section-h rs-soft-h">Also referenced by ' + dead.length + ' deleted action(s) — harmless but shown for completeness</div>');
      dead.forEach(r => lines.push(`<div class="rs-row"><span class="rs-t">${esc(r.actionTitle)}</span><em class="rs-k">${r.depType}</em><span class="rs-k">${r.lag ? 'lag ' + r.lag + 'd' : 'lag 0'}</span></div>`));
    }
    lines.push('<p class="form-hint">No action was removed. Fix the dependencies above, then try again.</p>');
    $('dcTitle').textContent = 'Cannot remove — dependencies exist';
    $('dcBody').innerHTML = lines.join('');
    $('dcConfirm').textContent = 'OK';
    $('dcConfirm').onclick = () => { closeModalBox('delConfirmModal'); };
    $('dcCancel').onclick = () => { closeModalBox('delConfirmModal'); };
    $('dcClose').onclick = () => { closeModalBox('delConfirmModal'); };
    openModalBox('delConfirmModal');
  }

  // ---- Delete guard: reference scan + blocked reassign (no cascade, no silent loss) ----
  function referencesOf(kind, id){
    const refs = { actions:[], members:[], projects:[] };
    state.actions.forEach(a=>{
      const hit = kind==='project' ? a.projectId===id
        : kind==='discipline' ? a.disciplineId===id
        : kind==='status' ? a.statusId===id
        : kind==='priority' ? a.priorityId===id
        : kind==='member' ? ((Array.isArray(a.assignedToIds)&&a.assignedToIds.includes(id)) || a.createdById===id)
        : kind==='customfield' ? (a.custom && a.custom[id] !== undefined && a.custom[id] !== null && a.custom[id] !== '')
        : false;
      if(hit) refs.actions.push(a);
    });
    if(kind==='discipline') state.members.forEach(m=>{ if(m.disciplineId===id) refs.members.push(m); });
    if(kind==='discipline') state.projects.forEach(p=>{ if(Array.isArray(p.disciplineIds)&&p.disciplineIds.includes(id)) refs.projects.push(p); });
    if(kind==='member') state.projects.forEach(p=>{ if(Array.isArray(p.memberIds)&&p.memberIds.includes(id)) refs.projects.push(p); });
    return refs;
  }
  function itemLabel(kind, id){
    if(kind==='project') return (state.projects.find(x=>x.id===id)||{}).name || id;
    if(kind==='discipline') return (state.disciplines.find(x=>x.id===id)||{}).name || id;
    if(kind==='status') return (state.statuses.find(x=>x.id===id)||{}).label || id;
    if(kind==='priority') return (state.priorities.find(x=>x.id===id)||{}).label || id;
    if(kind==='customfield') return (state.customFields.find(x=>x.id===id)||{}).label || id;
    if(kind==='actiontype') return (state.actionTypes.find(x=>x.id===id)||{}).label || id;
    return (state.members.find(x=>x.id===id)||{}).name || id;
  }
  function candidatesOf(kind){
    if(kind==='project') return state.projects.map(p=>({id:p.id,label:p.name}));
    if(kind==='discipline') return state.disciplines.map(d=>({id:d.id,label:d.name}));
    if(kind==='status') return state.statuses.map(s=>({id:s.id,label:s.label}));
    if(kind==='priority') return state.priorities.map(p=>({id:p.id,label:p.label}));
    if(kind==='actiontype') return (state.actionTypes||[]).map(t=>({id:t.id,label:t.label}));
    return [];
  }
  function performDelete(kind, id){
    if(kind==='project'){ state.projects = state.projects.filter(x=>x.id!==id); if(state.selection.projects===id) state.selection.projects=null; }
    else if(kind==='discipline'){
      state.disciplines = state.disciplines.filter(x=>x.id!==id);
      state.projects.forEach(pr=>{ if(Array.isArray(pr.disciplineIds)) pr.disciplineIds=pr.disciplineIds.filter(x=>x!==id); });
      state.projects.forEach(p=>delete state.expanded[p.id+'::d'+id]);
      if(state.selection.disciplines===id) state.selection.disciplines=null;
    }
    else if(kind==='status') state.statuses = state.statuses.filter(x=>x.id!==id);
    else if(kind==='priority') state.priorities = state.priorities.filter(x=>x.id!==id);
    else if(kind==='member'){
      state.members = state.members.filter(x=>x.id!==id);
      state.projects.forEach(p=>{ if(Array.isArray(p.memberIds)) p.memberIds=p.memberIds.filter(x=>x!==id); });
    }
    else if(kind==='customfield'){ deleteCustomField(id, reRender || (()=>renderCustomFields())); }
    else if(kind==='actiontype'){ deleteActionType(id, reRender || (()=>renderActionTypes())); }
    if(state.selection.actions && !state.actions.find(a=>a.id===state.selection.actions)) state.selection.actions=null;
  }
  // ISS-28: delete a custom field definition. If any action holds a value for the
  // field key, block silently-permanent loss by confirming the value wipe first.
  function deleteCustomField(id, reRender){
    const f = (state.customFields||[]).find(x=>x.id===id); if(!f) return;
    const key = f.key;
    const refs = state.actions.filter(a=>a.custom && a.custom[key]!==undefined && a.custom[key]!==null && a.custom[key]!=='');
    if(refs.length){
      if(!confirm(`Field "${f.label}" is used by ${refs.length} action(s). Delete it and clear all those values? This cannot be undone.`)) return;
      state.actions.forEach(a=>{ if(a.custom) delete a.custom[key]; });
    } else {
      if(!confirm(`Delete custom field "${f.label}"?`)) return;
    }
    state.customFields = (state.customFields||[]).filter(x=>x.id!==id);
    // also drop from any project enablement / local lists
    state.projects.forEach(p=>{ if(Array.isArray(p.customFieldKeys)) p.customFieldKeys=p.customFieldKeys.filter(k=>k!==key); if(Array.isArray(p.customFields)) p.customFields=p.customFields.filter(x=>x.key!==key); });
    markSetupDirty(); if(reRender) reRender(); refresh(); toast('Custom field deleted — Save Settings to persist');
  }
  function requestDelete(kind, id, reRender){
    if(kind==='customfield'){ deleteCustomField(id, reRender); return; }
    const refs = referencesOf(kind, id);
    if(!refs.actions.length && !refs.members.length){
      if(!confirm(`Delete "${itemLabel(kind,id)}"?`)) return;
      performDelete(kind, id); markDataDirty(); reRender(); refresh(); toast(cap(kind)+' deleted — Save Actions to persist');
      return;
    }
    openReassignModal(kind, id, reRender);
  }
  function openReassignModal(kind, id, reRender){
    const label = itemLabel(kind, id);
    const refs = referencesOf(kind, id);
    const live = refs.actions.filter(a=>!a.deleted);
    const soft = refs.actions.filter(a=>a.deleted);
    const cands = candidatesOf(kind).filter(c=>c.id!==id);
    const noCand = cands.length===0;
    const hasActionRows = (live.length + soft.length) > 0;
    const blockNoCand = noCand && kind!=='member' && hasActionRows;
    const candOpts = cur => cands.map(c=>`<option value="${esc(c.id)}"${c.id===cur?' selected':''}>${esc(c.label)}</option>`).join('');
    const optHtml = (cur, extra) => (extra||'') + candOpts(cur);
    const actionRow = a => {
      const t = `<span class="rs-t">${esc(a.title)}</span>`;
      if(kind==='member'){
        let rows='';
        if(Array.isArray(a.assignedToIds) && a.assignedToIds.includes(id))
          rows += `<div class="rs-row">${t}<em class="rs-k">assignee</em><select class="rs-sel" data-rid="${esc(a.id+'_asg')}"><option value="">— pick —</option><option value="__remove__">— remove this assignee —</option>${candOpts('')}</select></div>`;
        if(a.createdById===id)
          rows += `<div class="rs-row">${t}<em class="rs-k">created by</em><select class="rs-sel" data-rid="${esc(a.id+'_cr')}"><option value="">— pick —</option><option value="__snap__">— keep name snapshot —</option>${candOpts('')}</select></div>`;
        return rows;
      }
      return `<div class="rs-row">${t}<select class="rs-sel" data-rid="${esc(a.id)}"><option value="">— pick —</option>${candOpts('')}</select></div>`;
    };
    let html = `<p class="ed-desc" style="margin-bottom:10px">⚠ <b>${esc(label)}</b> is referenced by ${live.length} action(s)` + (soft.length? ` and ${soft.length} deleted action(s)`: '') + (refs.members.length? ` and ${refs.members.length} member(s)`: '') + `. Reassign every reference — nothing is deleted silently.</p>`;
    if(live.length){
      html += `<div class="ed-section-h">Actions (${live.length})</div>`
        + `<div class="rs-bulk">Reassign all: <select id="rsAll" class="rs-sel rs-all"><option value="">— pick —</option>${candOpts('')}</select></div>`
        + live.map(actionRow).join('');
    }
    if(soft.length){
      html += `<div class="ed-section-h rs-soft-h">Deleted actions (${soft.length}) — reassign, or remove permanently</div>`
        + soft.map(actionRow).join('');
    }
    if(kind==='discipline' && refs.members.length){
      html += `<div class="ed-section-h">Members' discipline (${refs.members.length})</div>`
        + refs.members.map(m=>`<div class="rs-row"><span class="rs-t">${esc(m.name)}</span><select class="rs-sel" data-rid="m_${esc(m.id)}" data-empty-ok="1"><option value="">— none —</option>${candOpts(m.disciplineId||'')}</select></div>`).join('');
    }
    if(refs.projects.length) html += `<p class="form-hint">Also removes <b>${esc(label)}</b> from ${refs.projects.length} project assignment list(s) — configuration only, not data.</p>`;
    if(blockNoCand) html += `<p class="form-hint" style="color:#C0392B">No other ${kind} exists — create another one first, then try deleting again.</p>`;
    $('rsBody').innerHTML = html;
    const validate = ()=>{
      const sels=[...$('rsBody').querySelectorAll('.rs-sel:not(.rs-all)')];
      $('rsDelete').disabled = blockNoCand || sels.some(s=>!String(s.value).length && s.dataset.emptyOk!=='1');
    };
    const all=$('rsAll'); if(all) all.onchange=()=>{
      const v=all.value;
      $('rsBody').querySelectorAll('.rs-sel:not(.rs-all):not([data-empty-ok])').forEach(s=>{ s.value=v; });
      validate();
    };
    $('rsBody').querySelectorAll('.rs-sel').forEach(s=>s.onchange=validate);
    $('rsDelete').onclick=()=>{
      $('rsBody').querySelectorAll('.rs-sel:not(.rs-all)').forEach(sel=>{
        const v=sel.value; const rid=sel.dataset.rid;
        if(!String(v).length && sel.dataset.emptyOk!=='1') return;
        if(rid.indexOf('m_')===0){ const m=state.members.find(x=>x.id===rid.slice(2)); if(m) m.disciplineId=v||''; return; }
        const a=state.actions.find(x=>String(x.id)===rid); if(!a) return;
        if(kind==='member'){
          if(rid.endsWith('_asg')){
            if(v==='__remove__'){ if(a.deleted) state.actions=state.actions.filter(x=>x.id!==a.id); else a.assignedToIds=(a.assignedToIds||[]).filter(x=>x!==id); }
            else if(v){ a.assignedToIds=(a.assignedToIds||[]).map(x=>x===id?v:x); if(!a.assignedToIds.includes(v)) a.assignedToIds.push(v); }
          } else if(rid.endsWith('_cr')){
            if(v==='__snap__'){ a.createdById=''; a.createdByName=label; }
            else if(v){ a.createdById=v; delete a.createdByName; }
            else if(a.deleted){ a.createdById=''; a.createdByName=label; }
          }
          return;
        }
        if(v==='__remove__' && a.deleted){ state.actions=state.actions.filter(x=>x.id!==a.id); return; }
        if(kind==='project') a.projectId=v;
        else if(kind==='discipline') a.disciplineId=v;
        else if(kind==='status'){ a.statusId=v; delete a.statusLabel; }
        else if(kind==='priority'){ a.priorityId=v; delete a.priorityLabel; }
      });
      performDelete(kind, id);
      closeModalBox('reassignModal');
      markDataDirty(); reRender(); refresh(); toast(cap(kind)+' deleted — references reassigned — Save Actions to persist');
    };
    $('rsCancel').onclick=()=>closeModalBox('reassignModal');
    $('rsClose').onclick=()=>closeModalBox('reassignModal');
    openModalBox('reassignModal');
    validate();
  }
  // Members: soft "left" flag (a member may leave the project; record is kept).
  function markLeftMember(id){
    const m=state.members.find(x=>x.id===id); if(!m) return;
    if(!confirm(`Mark "${m.name}" as left? The member record is kept so past assignments stay readable. They are removed from project member lists.`)) return;
    m.left=true; m.deletedOn=todayStr();
    state.projects.forEach(p=>{ if(Array.isArray(p.memberIds)) p.memberIds=p.memberIds.filter(x=>x!==id); });
    markDataDirty(); renderMembersList(); refresh(); toast('Member marked as left — Save Actions to persist');
  }
  function restoreMember(id){
    const m=state.members.find(x=>x.id===id); if(!m) return;
    m.left=false; m.deletedOn='';
    markDataDirty(); renderMembersList(); refresh(); toast('Member restored — Save Actions to persist');
  }
  function renderManagedList(type){ // Projects — Name | Code
    setEdTop('Settings / Projects');
    const list = state.projects;
    const COLS='1.6fr 1fr 30px';
    const rowHtml = p => `<div class="lm-item lm-member" data-id="${esc(p.id)}" style="grid-template-columns:${COLS}">
      <input data-f="name" placeholder="Name" value="${esc(p.name||'')}" />
      <input data-f="code" placeholder="Code" value="${esc(p.code||'')}" />
      <button class="lm-mini del" title="Delete">🗑</button>
    </div>`;
    $('edBody').innerHTML = `<p class="ed-desc">Projects are managed here only — name and code. Per-project discipline and member assignment is done through pop-up selection in the Disciplines and Members panels. Deleting a project also removes its actions.</p>
      ${list.length>8?'<input class="lm-filter" id="pjFilter" type="text" placeholder="Filter projects…" />':''}
      <div class="lm-list" id="pjList">
        <div class="lm-head" style="grid-template-columns:${COLS}"><span>Name</span><span>Code</span><span></span></div>
        ${list.map(rowHtml).join('') || '<div class="lm-empty">No projects yet.</div>'}
      </div>
      <div class="ed-actions"><button class="btn" id="pjAdd">+ Add project</button></div>`;
    const bind = row => bindStdRow(row, list, {
      fields:['name','code'],
      create: vals => vals.name.trim() ? ensureProjectLists({ id:uid('p'), name:vals.name.trim(), code:String(vals.code||'').trim() }) : null,
      delConfirm: id => true,
      onRemove: id => requestDelete('project', id, ()=>renderManagedList(type))
    });
    $('edBody').querySelectorAll('.lm-member').forEach(bind);
    $('pjAdd').onclick=()=>{
      const div=document.createElement('div'); div.className='lm-item lm-member'; div.dataset.id='__new__'; div.style.gridTemplateColumns=COLS;
      div.innerHTML=`<input data-f="name" placeholder="Name" /><input data-f="code" placeholder="Code" /><button class="lm-mini del" title="Delete">🗑</button>`;
      $('pjList').appendChild(div); bind(div);
      const fi=div.querySelector('[data-f="name"]'); if(fi) fi.focus();
    };
    const fi=$('pjFilter'); if(fi) fi.oninput=e=>{
      const q=e.target.value.trim().toLowerCase();
      $('pjList').querySelectorAll('.lm-member').forEach(row=>{ row.style.display = (!q || (row.textContent||'').toLowerCase().includes(q)) ? '' : 'none'; });
    };
  }

  // ---- Schema v3 Reference Points (ISS-18): project-anchored schedule milestones ----
  function renderReferencePoints(){
    setEdTop('Settings / Reference Points');
    const list = state.referencePoints||[];
    const pOpts = (cur) => '<option value="">— none —</option>' + state.projects.map(p=>`<option value="${esc(p.id)}"${p.id===cur?' selected':''}>${esc(p.name)}</option>`).join('');
    const COLS='1.6fr 1fr 1fr 30px';
    const rowHtml = r => `<div class="lm-item lm-member" data-id="${esc(r.id)}" style="grid-template-columns:${COLS}">
      <input class="lm-inp" data-f="name" placeholder="Name (e.g. Tender date)" value="${esc(r.name||'')}" />
      <input class="lm-inp" data-f="date" type="date" value="${esc(r.date||'')}" />
      <select class="lm-inp" data-f="projectId">${pOpts(r.projectId||'')}</select>
      <button class="lm-mini del" title="Delete">🗑</button>
    </div>`;
    $('edBody').innerHTML = `<p class="ed-desc">Reference points are project-anchored milestones (gate dates, handoffs, tender deadlines). They are referenced by action dependencies so a whole set of actions can float against one shared date. Deleting a reference point leaves any dependency that used it flagged ⚠ (re-link in the action editor).</p>
      <div class="lm-list" id="rpList">
        <div class="lm-head" style="grid-template-columns:${COLS}"><span>Name</span><span>Date</span><span>Project</span><span></span></div>
        ${list.map(rowHtml).join('') || '<div class="lm-empty">No reference points yet.</div>'}
      </div>
      <div class="ed-actions"><button class="btn" id="rpAdd">+ Add reference point</button></div>`;
    const commitRow = row=>{
      const id=row.dataset.id; const r = id==='__new__' ? null : (state.referencePoints.find(x=>x.id===id));
      const get = f => row.querySelector(`[data-f="${f}"]`).value;
      if(!r){
        if(!get('name') && !get('date') && !get('projectId')) return;
        const nv = normReferencePoint({ name:get('name'), date:get('date'), projectId:get('projectId') });
        state.referencePoints.push(nv); row.dataset.id=nv.id; markDataDirty();
      } else {
        ['name','date','projectId'].forEach(f=>{ if(String(r[f]||'')!==String(get(f)||'')){ r[f]=get(f); markDataDirty(); } });
      }
    };
    $('rpList').querySelectorAll('.lm-item').forEach(row=>{
      row.querySelectorAll('input,select').forEach(f=>f.addEventListener('change', ()=>commitRow(row)));
      row.querySelector('.del').onclick=()=>{
        const id=row.dataset.id;
        state.referencePoints = state.referencePoints.filter(x=>x.id!==id);
        // flag any dependency that used it (ISS-18 cleanup handled in editor warnings)
        markDataDirty(); renderReferencePoints();
      };
    });
    $('rpAdd').onclick=()=>{
      const div=document.createElement('div'); div.className='lm-item lm-member'; div.dataset.id='__new__'; div.style.gridTemplateColumns=COLS;
      div.innerHTML=`<input class="lm-inp" data-f="name" placeholder="Name" /><input class="lm-inp" data-f="date" type="date" /><select class="lm-inp" data-f="projectId">${pOpts('')}</select><button class="lm-mini del" title="Delete">🗑</button>`;
      $('rpList').appendChild(div);
      div.querySelectorAll('input,select').forEach(f=>f.addEventListener('change', ()=>commitRow(div)));
      div.querySelector('.del').onclick=()=>{ div.remove(); };
      div.querySelector('[data-f="name"]').focus();
    };
  }

  // ---- Custom Fields (ISS-28 Phase 3 MVP) ----
  // ① Key is auto-generated from the label and shown readonly. ② Catalog edits mark setup.json dirty.
  // ③ A custom field is only ACTIVE for a project once that project enables it (Configure…).
  function renderCustomFields(){
    setEdTop('Settings / Custom Fields');
    const list = state.customFields || [];
    const COLS='1fr 1.3fr 1fr 1fr 30px';
    const rowHtml = f => `<div class="lm-item lm-member" data-id="${esc(f.id)}" style="grid-template-columns:${COLS}">
      <input data-f="label" placeholder="Label" value="${esc(f.label||'')}" />
      <input data-f="key" placeholder="auto (readonly)" value="${esc(f.key||'')}" readonly title="Auto-generated from Label" />
      <select data-f="type">${CUSTOM_FIELD_TYPES.map(t=>`<option value="${t}"${t===f.type?' selected':''}>${t}</option>`).join('')}</select>
      <input data-f="options" placeholder="Options (comma-separated, for select/multiselect)" value="${esc((f.options||[]).join(', '))}" />
      <button class="lm-mini del" title="Delete">🗑</button>
    </div>`;
    $('edBody').innerHTML = `<p class="ed-desc">Global catalog of custom fields. The <b>key</b> is generated automatically from the <b>Label</b> in lowercase and is read-only; it is the stable ID stored in <b>action.custom[key]</b>. A field is <b>only active for a project once you enable it there</b> via the project's <b>Configure…</b> button below. Deleting a field is blocked while any action has a value for it.</p>
      ${list.length>8?'<input class="lm-filter" id="cfFilter" type="text" placeholder="Filter custom fields…" />':''}
      <div class="lm-list" id="cfList">
        <div class="lm-head" style="grid-template-columns:${COLS}"><span>Label</span><span>Key (auto)</span><span>Type</span><span>Options</span><span></span></div>
        ${list.map(rowHtml).join('') || '<div class="lm-empty">No custom fields yet.</div>'}
      </div>
      <div class="ed-actions"><button class="btn" id="cfAdd">+ Add custom field</button></div>
      <div class="ed-section-h" style="margin-top:18px">Activate per project</div>
      <p class="ed-desc">Click <b>Configure…</b> on a project to choose which global fields are enabled for it (and add project-local fields). Fields not enabled for a project do not appear in that project's action editor.</p>
      ${state.projects.map(p=>`<div class="proj-block"><span class="nm">${esc(p.name)}</span><span class="scount">${(p.customFieldKeys||[]).length} active · ${(p.customFields||[]).length} local</span><button class="btn" id="pcfBtn_${esc(p.id)}">Configure…</button></div>`).join('') || '<div class="lm-empty">No projects yet.</div>'}`;
    const bind = row => bindStdRow(row, list, {
      fields:['label','type','options'],
      create: vals => {
        const lb = String(vals.label||'').trim(); if(!lb) return null;
        const k = generateCustomFieldKey(lb, list.map(x=>x.key));
        const opt = (vals.options||'').split(',').map(s=>s.trim()).filter(Boolean);
        return normCustomField({ label:lb, key:k, type:vals.type, options: opt.length?opt:null });
      },
      setupDirty: true,
      // After the ghost row is promoted to a real field, write the auto key into the
      // readonly Key field so it stays visible (covers blur / Return / first commit).
      afterCreate: (row, o) => { const kEl=row.querySelector('[data-f="key"]'); if(kEl) kEl.value = o.key||''; },
      delConfirm: id => true,
      onRemove: id => requestDelete('customfield', id, ()=>renderCustomFields())
    });
    // Live-preview the auto key inside a NEW (ghost) row: as the user types/commits/blurs Label,
    // show the would-be key in the readonly Key field (not yet committed).
    $('edBody').querySelectorAll('.lm-member').forEach(row=>{
      bind(row);
      if(row.dataset.id==='__new__'){
        const lab=row.querySelector('[data-f="label"]'); const key=row.querySelector('[data-f="key"]');
        if(lab && key){
          const preview=()=>{ key.value = lab.value.trim() ? generateCustomFieldKey(lab.value, list.map(x=>x.key)) : ''; };
          lab.addEventListener('input', preview);
          lab.addEventListener('change', preview);   // covers Return / blur
          lab.addEventListener('blur', preview);
        }
      }
    });
    $('cfAdd').onclick=()=>{
      const div=document.createElement('div'); div.className='lm-item lm-member'; div.dataset.id='__new__'; div.style.gridTemplateColumns=COLS;
      div.innerHTML=`<input data-f="label" placeholder="Label" /><input data-f="key" placeholder="auto (readonly)" readonly /><select data-f="type">${CUSTOM_FIELD_TYPES.map(t=>`<option value="${t}">${t}</option>`).join('')}</select><input data-f="options" placeholder="Options (comma-separated)" /><button class="lm-mini del" title="Delete">🗑</button>`;
      $('cfList').appendChild(div); bind(div);
      const fi=div.querySelector('[data-f="label"]'); if(fi) fi.focus();
    };
    const fi=$('cfFilter'); if(fi) fi.oninput=e=>{
      const q=e.target.value.trim().toLowerCase();
      $('cfList').querySelectorAll('.lm-member').forEach(row=>{ row.style.display = (!q || (row.textContent||'').toLowerCase().includes(q)) ? '' : 'none'; });
    };
    state.projects.forEach(p=>{ const b=$('pcfBtn_'+p.id); if(b) b.onclick=()=>openProjectCustomFieldsModal(p.id); });
  }
  // Per-project custom fields modal: enable/disable global fields + add local fields
  function openProjectCustomFieldsModal(pid){
    const p=projById(pid); if(!p) return;
    ensureProjectLists(p);
    const render=()=>{
      const global = (state.customFields || []).map(f=>normCustomField(f));
      const enabled = new Set(p.customFieldKeys || []);
      const local = (p.customFields || []).map(f=>normCustomField(f));
      const rows = global.map(f=>{
        const on = enabled.has(f.key);
        return `<div class="pm-row" data-key="${esc(f.key)}">
          <input type="checkbox" class="pcf-chk" ${on?'checked':''} />
          <span class="nm">${esc(f.label)} <em class="cf-type-tag">${esc(f.type)}</em></span>
          <span class="nm">${esc(f.key)}</span>
        </div>`;
      }).join('');
      const lrows = local.map(f=>{
        return `<div class="pm-row pcf-local" data-key="${esc(f.key)}">
          <span class="pcf-local-badge">local</span>
          <span class="nm">${esc(f.label)} <em class="cf-type-tag">${esc(f.type)}</em></span>
          <span class="nm">${esc(f.key)}</span>
          <button class="pm-mini" data-del="${esc(f.key)}" title="Remove local field">✕</button>
        </div>`;
      }).join('');
      $('pmBody').innerHTML = `<input class="asm-filter" id="pcfFilter" type="text" placeholder="Filter fields…" />
        <div class="ed-section-h" style="margin:0 0 8px">Global fields (check = enabled for this project)</div>
        <div class="lm-list">${rows||'<div class="lm-empty">No global fields.</div>'}</div>
        <div class="ed-section-h" style="margin:16px 0 8px">Project-local fields</div>
        <div class="lm-list">${lrows||'<div class="lm-empty">No local fields.</div>'}</div>
        <div class="ed-actions"><button class="btn" id="pcfAddLocal">+ Add local field</button></div>
        <p class="form-hint">Local fields are scoped to this project only and merge with enabled globals at runtime.</p>`;
      const fi=$('pcfFilter'); if(fi) fi.oninput=render;
      $('pmBody').querySelectorAll('.pcf-chk').forEach(c=>c.onchange=()=>{
        const key=c.closest('.pm-row').dataset.key;
        if(c.checked){ enabled.add(key); }
        else enabled.delete(key);
        p.customFieldKeys = [...enabled]; markDataDirty();
      });
      $('pmBody').querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>{
        const key=b.dataset.del;
        p.customFields = (p.customFields||[]).filter(f=>f.key!==key);
        enabled.delete(key); // also remove from enabled if present
        p.customFieldKeys = [...enabled];
        markDataDirty(); render();
      });
      $('pcfAddLocal').onclick=()=>{
        const k = prompt('Local field key (lowercase, underscore, space):');
        if(!k || !validateCustomFieldKey(k)){ toast('Invalid key'); return; }
        if((p.customFields||[]).some(f=>f.key===k) || enabled.has(k)){ toast('Key already used'); return; }
        const t = prompt('Label:'); if(!t){ return; }
        const ty = prompt('Type: '+CUSTOM_FIELD_TYPES.join(', '));
        if(!CUSTOM_FIELD_TYPES.includes(ty)){ toast('Invalid type'); return; }
        const opt = prompt('Options (comma-separated, for select/multiselect):') || '';
        p.customFields = (p.customFields||[]).concat(normCustomField({ key:k.trim(), label:t.trim(), type:ty, options: opt.split(',').map(s=>s.trim()).filter(Boolean) }));
        enabled.add(k.trim());
        p.customFieldKeys = [...enabled];
        markDataDirty(); render();
      };
    };
    openProjectModal('Custom Fields — '+p.name, '', ()=>{ refresh(); toast('Project custom fields updated — Save Actions to persist'); });
    render();
  }
  // ---- ISS-60: Action Types (meeting-discussion tags) — global catalog in setup.json ----
  // Mirrors the Custom Fields model: one global catalog, enabled per project via
  // project.actionTypeIds[] (empty array = all types offered).
  function deleteActionType(id, reRender){
    if(!(state.actionTypes||[]).some(x=>x.id===id)) return;
    if(!confirm('Delete this action type from the global catalog?')) return;
    state.actionTypes = (state.actionTypes||[]).filter(x=>x.id!==id);
    // Drop the id from any per-project enablement lists.
    state.projects.forEach(p=>{ if(Array.isArray(p.actionTypeIds)) p.actionTypeIds=p.actionTypeIds.filter(x=>x!==id); });
    markSetupDirty(); if(reRender) reRender(); refresh(); toast('Action type deleted — Save Settings to persist');
  }
  function renderActionTypes(){
    setEdTop('Settings / Action Types');
    const list = state.actionTypes || [];
    const COLS='1fr 30px';
    const rowHtml = f => `<div class="lm-item lm-member" data-id="${esc(f.id)}" style="grid-template-columns:${COLS}">
      <input data-f="label" placeholder="Action type (e.g. Client Instruction)" value="${esc(f.label||'')}" />
      <button class="lm-mini del" title="Delete">🗑</button>
    </div>`;
    $('edBody').innerHTML = `<p class="ed-desc">Global catalog of <b>action types</b> — tags used on the dated detail log (e.g. Client Instruction, Internal Design Change). A type is <b>offered in a project's editor only after you enable it there</b> (via the project's <b>Configure…</b> button below). A project with <b>no types configured shows all</b> global types; once you pick a subset, only that subset is offered. Catalog edits are saved to <b>setup.json</b>.</p>
      ${list.length>8?'<input class="lm-filter" id="atFilter" type="text" placeholder="Filter action types…" />':''}
      <div class="lm-list" id="atList">
        <div class="lm-head" style="grid-template-columns:${COLS}"><span>Label</span><span></span></div>
        ${list.map(rowHtml).join('') || '<div class="lm-empty">No action types yet.</div>'}
      </div>
      <div class="ed-actions"><button class="btn" id="atAdd">+ Add action type</button></div>
      <div class="ed-section-h" style="margin-top:18px">Enabled per project</div>
      <p class="ed-desc">Click <b>Configure…</b> on a project to choose which action types are enabled for it. Types not enabled for a project are not offered in that project's detail-log editor.</p>
      ${state.projects.map(p=>`<div class="proj-block"><span class="nm">${esc(p.name)}</span><span class="scount">${(p.actionTypeIds||[]).length? (p.actionTypeIds.length+' enabled') : 'all (none configured)'}</span><button class="btn" id="patBtn_${esc(p.id)}">Configure…</button></div>`).join('') || '<div class="lm-empty">No projects yet.</div>'}`;
    const bind = row => bindStdRow(row, list, {
      fields:['label'],
      create: vals => {
        const lb = String(vals.label||'').trim(); if(!lb) return null;
        if((state.actionTypes||[]).some(x=>String(x.label||'').toLowerCase()===lb.toLowerCase())){ toast('Action type already exists'); return null; }
        return normActionType(lb, (state.actionTypes||[]).length);
      },
      setupDirty: true,
      delConfirm: id => true,
      onRemove: id => requestDelete('actiontype', id, ()=>renderActionTypes())
    });
    $('edBody').querySelectorAll('.lm-member').forEach(row=>bind(row));
    $('atAdd').onclick=()=>{
      const div=document.createElement('div'); div.className='lm-item lm-member'; div.dataset.id='__new__'; div.style.gridTemplateColumns=COLS;
      div.innerHTML=`<input data-f="label" placeholder="Action type (e.g. Client Instruction)" /><button class="lm-mini del" title="Delete">🗑</button>`;
      $('atList').appendChild(div); bind(div);
      const fi=div.querySelector('[data-f="label"]'); if(fi) fi.focus();
    };
    const fi=$('atFilter'); if(fi) fi.oninput=e=>{
      const q=e.target.value.trim().toLowerCase();
      $('atList').querySelectorAll('.lm-member').forEach(row=>{ row.style.display = (!q || (row.textContent||'').toLowerCase().includes(q)) ? '' : 'none'; });
    };
    state.projects.forEach(p=>{ const b=$('patBtn_'+p.id); if(b) b.onclick=()=>openProjectActionTypesModal(p.id); });
  }
  function openProjectActionTypesModal(pid){
    const p=projById(pid); if(!p) return;
    ensureProjectLists(p);
    const render=()=>{
      const global = (state.actionTypes||[]).map(t=>normActionType(t));
      const enabled = new Set(p.actionTypeIds || []);
      const rows = global.map(t=>{
        const on = enabled.has(t.id);
        return `<div class="pm-row" data-id="${esc(t.id)}">
          <input type="checkbox" class="pat-chk" ${on?'checked':''} />
          <span class="nm">${esc(t.label)}</span>
        </div>`;
      }).join('');
      $('pmBody').innerHTML = `<input class="asm-filter" id="patFilter" type="text" placeholder="Filter action types…" />
        <div class="ed-section-h" style="margin:0 0 8px">Action types (check = enabled for this project)</div>
        <div class="lm-list">${rows||'<div class="lm-empty">No global action types — add them in Settings → Action Types first.</div>'}</div>
        <p class="form-hint">No types checked = <b>all</b> global types are offered in this project's editor. Check a subset to limit the choices to only those.</p>`;
      const fi=$('patFilter'); if(fi) fi.oninput=render;
      $('pmBody').querySelectorAll('.pat-chk').forEach(c=>c.onchange=()=>{
        const id=c.closest('.pm-row').dataset.id;
        if(c.checked){ enabled.add(id); } else enabled.delete(id);
        p.actionTypeIds = [...enabled]; markDataDirty();
      });
    };
    openProjectModal('Action Types — '+p.name, '', ()=>{ refresh(); toast('Project action types updated — Save Actions to persist'); });
    render();
  }

  function renderHelpMain(){
    const t=state.selection.help;
    const art = state.setup.help[t] || BUILTIN_HELP_MD[t] || { title:t, body:'' };
    setEdTop('Help / '+(art.title||t));
    $('edBody').innerHTML=`<h1 class="ed-title">${esc(art.title||t)}</h1><div class="help-body">${mdToHtml(art.body)||'<p>No article.</p>'}</div>`;
  }
