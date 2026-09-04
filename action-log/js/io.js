"use strict";

  // ---- Import / Export ----
  function exportData(){ writeDataFile(); }
  const bindEl=(id,fn)=>{ const el=$(id); if(el) el.onclick=fn; };
  bindEl('rpExport', exportData);
  bindEl('rpSaveActions', writeDataFile);
  bindEl('rpSaveSettings', saveSetupFile);
  bindEl('rpImport', importViaPicker);
  bindEl('rpExportMenu', openExportModal);
  // Top bar actions
  bindEl('tbSaveActions', writeDataFile);
  bindEl('tbSaveSettings', saveSetupFile);
  bindEl('tbExportMenu', openExportModal);
  bindEl('tbImport', importViaPicker);
  bindEl('tbCreate', createDataFile);
  bindEl('tbFolder', setDataFolder);
  bindEl('tbDark', ()=>{ state.layout.dark=!state.layout.dark; applyLayout(); markSetupDirty(); });
  bindEl('tbLayout', ()=>{ syncLayoutModal(); openModalBox('layoutModal'); });
  bindEl('tbSettings', ()=>{ setPerspective('settings'); });
  bindEl('tbHelp', ()=>{ openModalBox('helpModal'); });
  // Overflow menu (⋯)
  const tbMore=$('tbMore'), tbPop=$('tbPop');
  if(tbMore && tbPop){
    tbMore.onclick=e=>{ e.stopPropagation(); tbPop.classList.toggle('open'); };
    document.addEventListener('click', e=>{ if(!tbPop.contains(e.target) && e.target!==tbMore) tbPop.classList.remove('open'); });
    tbPop.querySelectorAll('.tb-item').forEach(it=>it.addEventListener('click', ()=>tbPop.classList.remove('open')));
  }
  // Mobile drawers (≤900px): ☰ toggles the sidebar drawer over a scrim
  const tbDrawer=$('tbDrawer'), tbScrim=$('tbScrim');
  function closeDrawers(){ document.body.classList.remove('m-show-side','m-show-right'); if(tbScrim) tbScrim.classList.remove('open'); }
  if(tbDrawer) tbDrawer.onclick=()=>{ const open=document.body.classList.toggle('m-show-side'); if(tbScrim) tbScrim.classList.toggle('open', open); };
  if(tbScrim) tbScrim.onclick=closeDrawers;
  // Right panel collapse removed per user; hide/unhide via Settings → Layout or the Layout modal.
  $('fileInput').onchange=async e=>{
    const f=e.target.files[0]; if(!f) return;
    if(!await confirmSaveBeforeLeave()){ e.target.value=''; return; }
    const r=new FileReader(); r.onload=()=>{
      try{ const d=JSON.parse(r.result);
        applyDataset(d, { name:f.name, path:f.name, source:'imported' });
        // Imported data is clean: no changes to save yet (except legacy upgrades).
        state.dataDirty = !!state.migrated; updateSaveButtons();
        toast('Loaded '+f.name);
        const oj=$('openJsonModal'); if(oj) closeModalBox('openJsonModal');
      }catch(err){ toast('Invalid JSON'); }
    }; r.readAsText(f); e.target.value='';
  };

  async function importViaPicker(opts){
    if(!await confirmSaveBeforeLeave()) return;
    if(!window.showOpenFilePicker){ $('fileInput').click(); return; }
    try{
      const [h] = await window.showOpenFilePicker({
        startIn: dataDirHandle || undefined,
        multiple: false,
        types: [{ description:'JSON', accept: { 'application/json': ['.json'] } }]
      });
      const f = await h.getFile();
      const text = await f.text();
      try{ applyDataset(JSON.parse(text), { name:f.name, path:f.name, source:'imported' });
        // Imported data is clean: no changes to save yet (except legacy upgrades).
        state.dataDirty = !!state.migrated; updateSaveButtons(); toast('Loaded '+f.name); }
      catch(err){ toast('Invalid JSON'); return; }
      const oj=$('openJsonModal'); if(oj) closeModalBox('openJsonModal');
      if(opts && opts.setFolder) await maybeSetDataFolder();
    }catch(e){ if(e && e.name!=='AbortError') toast('Import failed'); }
  }
  // ---- Data source: auto-load + status bar ----
  const DEFAULT_DATA_FILE = 'action.json';
  function resolveDataUrl(){ try { return new URL(DEFAULT_DATA_FILE, location.href); } catch(e){ return null; } }

  // ---- Data-folder handle (so pickers open next to index.html) ----
  // Browsers won't accept an absolute path, so we ask the user to pick the
  // folder once, persist the handle, and pass it as `startIn` to every picker.
  const DATA_DIR_KEY = 'at_data_dir';
  let dataDirHandle = null;
  function idbOpen(){ return new Promise((res,rej)=>{ const r=indexedDB.open('actiontracker',1); r.onupgradeneeded=()=>{ try{ r.result.createObjectStore('kv'); }catch(e){} }; r.onsuccess=()=>res(r.result); r.onerror=()=>rej(r.error); }); }
  async function idbGet(k){ try{ const db=await idbOpen(); return await new Promise((res,rej)=>{ const tx=db.transaction('kv','readonly'); const rq=tx.objectStore('kv').get(k); rq.onsuccess=()=>res(rq.result); rq.onerror=()=>rej(rq.error); }); }catch(e){ return null; } }
  async function idbSet(k,v){ try{ const db=await idbOpen(); await new Promise((res,rej)=>{ const tx=db.transaction('kv','readwrite'); tx.objectStore('kv').put(v,k); tx.oncomplete=()=>res(); tx.onerror=()=>rej(tx.error); }); }catch(e){} }
  async function loadDataDir(){
    if(!window.showDirectoryPicker) return;
    try{ const h=await idbGet(DATA_DIR_KEY); if(!h) return;
      let ok='granted'; try{ ok=await h.requestPermission({mode:'readwrite'}); }catch(e){}
      if(ok==='granted'||ok===undefined) dataDirHandle=h;
    }catch(e){}
  }
  async function setDataFolder(silent){
    if(!window.showDirectoryPicker){ if(!silent) toast('Folder picker needs a Chromium-based browser'); return; }
    try{
      const h=await window.showDirectoryPicker({ mode:'readwrite' });
      let ok='granted'; try{ ok=await h.requestPermission({mode:'readwrite'}); }catch(e){}
      if(ok!=='granted' && ok!==undefined){ if(!silent) toast('Permission denied'); return; }
      dataDirHandle=h; await idbSet(DATA_DIR_KEY, h); updateStatusbar();
      if(!silent) toast('Data folder set: '+h.name);
    }catch(e){ if(e && e.name!=='AbortError' && !silent) toast('Could not set folder'); }
  }
  // Auto-set the working folder right after the user opens a JSON from file://,
  // so subsequent saves/exports start in that folder. Skips if unsupported or a
  // folder is already known (restored from IndexedDB). Fails quietly — the
  // status-bar Folder button remains available as a fallback.
  async function maybeSetDataFolder(){
    if(!window.showDirectoryPicker || dataDirHandle) return;
    try{ await setDataFolder(true); }catch(e){}
  }
  // Save content into the chosen folder via showSaveFilePicker (startIn = data folder).
  async function saveViaPicker(filename, content, mime){
    if(!window.showSaveFilePicker) return false;
    const ext = (filename.split('.').pop()||'json').toLowerCase();
    const accept = mime==='application/json' ? { 'application/json': ['.json'] } : { [mime]: ['.'+ext] };
    try{
      const handle = await window.showSaveFilePicker({ suggestedName: filename, startIn: dataDirHandle || undefined, types: [{ description:'File', accept }] });
      const w = await handle.createWritable(); await w.write(content); await w.close();
      return { ok:true, aborted:false };
    }catch(e){ return { ok:false, aborted: !!(e && e.name==='AbortError') }; }
  }
  // --- Picture storage (detail-log images) ---
  // Writes a File into `assets/pictures/<name>` inside the chosen data folder (Chromium only).
  // Returns the relative URL `assets/pictures/<name>` on success, or null if unavailable.
  // On collision appends _1/_2... before the extension.
  async function writePictureToAssets(file){
    if(!window.showDirectoryPicker || !dataDirHandle) return null;
    try{
      let picDir;
      try{ picDir = await dataDirHandle.getDirectoryHandle('assets', { create:true }); }
      catch(e){ return null; }
      picDir = await picDir.getDirectoryHandle('pictures', { create:true });
      const dot = (file.name.lastIndexOf('.')>0) ? file.name.lastIndexOf('.') : file.name.length;
      const base = file.name.slice(0, dot) || 'image';
      const ext = file.name.slice(dot) || '';
      let name = file.name, n = 1, exists = true;
      while(exists){
        exists = false;
        try{ await picDir.getFileHandle(name); exists = true; }catch(e){ exists = false; }
        if(exists){ name = base + '_' + (n++) + ext; }
      }
      const fh = await picDir.getFileHandle(name, { create:true });
      const w = await fh.createWritable();
      await w.write(file); await w.close();
      return 'assets/pictures/' + name;
    }catch(e){ return null; }
  }
  function srcLabel(s){ return s==='external' ? 'from file' : s==='imported' ? 'from upload' : s==='embedded' ? 'embedded default' : 'missing — no data'; }

  function applyDataset(d, meta){
    d = d || {};
    // --- migration detection: a file without schemaVersion (or older than current) is legacy ---
    const incomingVer = (typeof d.schemaVersion==='number') ? d.schemaVersion : 0;
    state.migrated = (incomingVer < CURRENT_SCHEMA) && meta && meta.source!=='none';
    // --- statuses: normalize -> {id,label,color,builtin}; ensure 7 system statuses always exist (Info included) ---
    state.statuses = (Array.isArray(d.statuses) ? d.statuses : []).map((s,i)=>normStatus(s,i));
    normalizeStatuses();
    state.projects    = (Array.isArray(d.projects) ? d.projects : []).map(ensureProjectLists);
    state.disciplines = Array.isArray(d.disciplines)  ? d.disciplines : [];
    state.customFields = (Array.isArray(d.customFields) ? d.customFields : []).map(f=>normCustomField(f));
    state.actionTypes = (Array.isArray(d.actionTypes) ? d.actionTypes : []).map(normActionType);
    state.referencePoints = (Array.isArray(d.referencePoints) ? d.referencePoints : []).map(normReferencePoint);
    // --- priorities (schema-driven metadata, lives in action.json) ---
    state.priorities = (Array.isArray(d.priorities) ? d.priorities : []).map((p,i)=>normPriority(p,i));
    if(!state.priorities.length) state.priorities = ['Critical','High','Medium','Low'].map((p,i)=>normPriority(p,i));
    if(!state.actionTypes.length) state.actionTypes = DEFAULT_ACTION_TYPES.map((t,i)=>normActionType(t,i));
    // --- members: load declared members (left/active flag kept) ---
    let members = (Array.isArray(d.members) ? d.members : []).map(m=>normMember(m));
    state.actions = (Array.isArray(d.actions) ? d.actions : []).map(a=>{
      if(a && !a.assignedTo && a.assignedBy) a.assignedTo = a.assignedBy; // legacy typo fix
      // assignedTo: string (legacy) -> array of member names
      if(typeof a.assignedTo==='string') a.assignedTo = a.assignedTo ? [a.assignedTo] : [];
      if(!Array.isArray(a.assignedTo)) a.assignedTo = [];
      a.assignedTo = a.assignedTo.filter(Boolean);
      // ---- Schema v2: label/name -> id references; orphans kept as fallback (NO auto-create) ----
      if(a.statusId===undefined && a.status!==undefined){ const st=findStatus(a.status); a.statusId = st? st.id : ''; if(!st) a.statusLabel = a.status; }
      if(a.priorityId===undefined && a.priority!==undefined){ const pr=findPriority(a.priority); a.priorityId = pr? pr.id : ''; if(!pr) a.priorityLabel = a.priority; }
      if(a.assignedToIds===undefined){
        const ids=[], names=[];
        a.assignedTo.forEach(n=>{ const m=members.find(x=>String(x.name||'').toLowerCase()===String(n||'').toLowerCase()); if(m) ids.push(m.id); else names.push(n); });
        a.assignedToIds=ids; if(names.length) a.assignedToNames=names;
      }
      if(a.createdById===undefined && a.createdBy!==undefined){
        const m=members.find(x=>String(x.name||'').toLowerCase()===String(a.createdBy||'').toLowerCase());
        a.createdById = m? m.id : ''; if(!m) a.createdByName = a.createdBy;
      }
      if(!Array.isArray(a.detailLog)) a.detailLog = a.description ? [{date: todayStr(), text: a.description}] : [];
      a.detailLog.forEach(r=>{
        // ISS-75: migrate legacy `images` (picture-only) -> `attachments` with a `type`.
        if(Array.isArray(r.images) && !Array.isArray(r.attachments)){
          r.attachments = r.images.map(im=>({ name: im.name||'image', src: im.src, type:'image' }));
          delete r.images;
        }
        if(!Array.isArray(r.attachments)) r.attachments = [];
        if(!Array.isArray(r.typeIds)) r.typeIds = [];
        if(!Array.isArray(r.actionBy)) r.actionBy = [];
        if(r.due===undefined) r.due = '';
        if(!Array.isArray(r.dueHistory)) r.dueHistory = [];
        if(r.status===undefined) r.status = (state.statuses[0]||{}).id || '';
        if(r.editedBy===undefined) r.editedBy = '';
      });
      if(!a.createdOn){ const h0=(a.history||[])[0]; a.createdOn = (h0 && typeof h0.d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(h0.d)) ? h0.d : todayStr(); }
      // ---- Schema v2 → v3 migration (ISS-25/26): single `dependsOn` int -> `deps[]` ----
      if(Array.isArray(a.deps)){
        a.deps = a.deps.filter(Boolean).map((d,k)=>({ rowKey:k+1, predKind:d.predKind==='reference'?'reference':'action', predId:d.predId, type:DEP_TYPES.includes(d.type)?d.type:'FS', lag:Number.isFinite(+d.lag)?(+d.lag):0 }));
      } else {
        a.deps = [];
        if(a.dependsOn){ a.deps.push({ rowKey:1, predKind:'action', predId:parseInt(a.dependsOn,10), type:'FS', lag:0 }); }
        delete a.dependsOn;
      }
      // ---- Schema v3 (B3): add schedule + progress defaults (ISS-19/21) ----
      if(!a.schedule) a.schedule = {};
      if(!Number.isFinite(a.progress)) a.progress = 0;
      return a;
    });
    state.members = members;
    // Per-project member assignment: legacy/absent lists default to all ACTIVE members (members now loaded).
    state.projects.forEach(p=>{ if(!Array.isArray(p.memberIds)) p.memberIds = members.filter(m=>!m.left).map(m=>m.id); });
    // --- legacy migration: old action.json carried `settings` -> promote to setup.json ---
    if(d.settings){ applySetup(d.settings); state.setupDirty = true; }
    state.nextId      = state.actions.reduce((m,a)=>Math.max(m, (a&&a.id||0)), 0) + 1;
    state.loadedFile  = meta || { name:DEFAULT_DATA_FILE, path:'', source:'embedded' };
    if(Object.keys(state.expanded).length===0){
      const fp=state.projects[0];
      if(fp){ state.expanded['p'+fp.id]=true; const fd=state.disciplines[0]; if(fd) state.expanded['p'+fp.id+'::'+fd.id]=true; }
    }
    if(state.selection.actions && !state.actions.find(a=>a.id===state.selection.actions))
      state.selection.actions = state.actions[0] ? state.actions[0].id : null;
    applyLayout();
    refresh();
    updateStatusbar();
    if(state.migrated) toast('Legacy schema detected — Save to write the upgraded v2 file');
  }

  // ---- Builtin (system) statuses ----
  // 7 system statuses are read-only in Settings (cannot be deleted; label/color locked).
  // They are always present so Info (and the others) survive even on legacy files
  // that predate the Info status. `builtin` is serialized so the flag is persisted.
  const BUILTIN_STATUS_LABELS = ['Pending','In Progress','Completed','Blocked','On Hold','Not Started','Info'];
  function builtinStatusObj(label){ const o = normStatus(label, BUILTIN_STATUS_LABELS.indexOf(label)); o.builtin = true; return o; }
  // Build a clean status list: exactly the 7 built-in system statuses (each once),
  // plus user-created statuses that do NOT collide with a built-in label. Any duplicate
  // (by id or by label) and any user status shadowing a built-in label is dropped, so the
  // list never shows duplicates and the default list holds only system statuses.
  // `builtin` is preserved/assigned so Settings can lock the 7 system rows as read-only.
  function normalizeStatuses(){
    const incoming = state.statuses.map(s=>({
      id: s.id || slug(s.label||''),
      label: s.label || '',
      color: s.color,
      builtin: s.builtin === true || BUILTIN_STATUS_LABELS.some(b=>String(b).toLowerCase()===String(s.label||'').toLowerCase())
    }));
    // 1) Built-ins — exactly BUILTIN_STATUS_LABELS, each once, preserving a saved color.
    const builtins = BUILTIN_STATUS_LABELS.map(label=>{
      const ex = incoming.find(s=>s.builtin && String(s.label||'').toLowerCase()===String(label).toLowerCase());
      if(ex) return { id:ex.id, label, color:ex.color, builtin:true };
      return builtinStatusObj(label);
    });
    const missingBuiltins = BUILTIN_STATUS_LABELS.filter(label=>!incoming.some(s=>s.builtin && String(s.label||'').toLowerCase()===String(label).toLowerCase()));
    // 2) User statuses — drop duplicates (id/label) and built-in-label collisions.
    const seenId = new Set(), seenLbl = new Set();
    const users = [];
    let dropped = false;
    incoming.forEach(s=>{
      if(s.builtin) return;
      const lbl = String(s.label||'').toLowerCase();
      if(seenId.has(s.id) || seenLbl.has(lbl)){ dropped = true; return; }
      if(BUILTIN_STATUS_LABELS.some(b=>String(b).toLowerCase()===lbl)){ dropped = true; return; }
      seenId.add(s.id); seenLbl.add(lbl);
      users.push({ id:s.id, label:s.label, color:s.color, builtin:false });
    });
    state.statuses = [...builtins, ...users];
    if(missingBuiltins.length) toast('Added system status(es): '+missingBuiltins.join(', ')+' — Save to persist');
    else if(dropped) toast('Removed duplicate status(es) — Save to persist');
    if(missingBuiltins.length || dropped) state.dataDirty = true; // persist the cleaned list on Save
  }
  // Serialize the DATA schema (action.json) — no UI settings.
  function serializeData(){
    return {
      schemaVersion: 3,
      members: state.members.map(m=>({ id:m.id, name:m.name, initials:m.initials||m.name||'', role:m.role||'', disciplineId:m.disciplineId||'', left:!!m.left, deletedOn:m.deletedOn||'', color:m.color||'' })),
      statuses: state.statuses.map(s=>({ id:s.id, label:s.label, color:s.color, builtin: !!s.builtin })),
      priorities: state.priorities.map(p=>({ id:p.id, label:p.label, color:p.color })),
      referencePoints: state.referencePoints.map(r=>({ id:r.id, name:r.name||'', date:r.date||'', projectId:r.projectId||'' })),
      projects: state.projects.map(p=>({ ...p, code:p.code||'', customFieldKeys: Array.isArray(p.customFieldKeys)?p.customFieldKeys:[], customFields: Array.isArray(p.customFields)?p.customFields:[], actionTypeIds: Array.isArray(p.actionTypeIds)?p.actionTypeIds:[] })), disciplines: state.disciplines,
      actions: state.actions.map(a=>{
        const { status, priority, assignedTo, createdBy, dependsOn, _prevStatus, _prevStatusId, _prevStatusLabel, ...rest } = a;
        return { ...rest, deleted: !!a.deleted, statusId: a.statusId||'', statusLabel: a.statusLabel||'', priorityId: a.priorityId||'', priorityLabel: a.priorityLabel||'', assignedToIds: Array.isArray(a.assignedToIds)?a.assignedToIds:[], assignedToNames: Array.isArray(a.assignedToNames)?a.assignedToNames:[], createdById: a.createdById||'', createdByName: a.createdByName||'', parentId: (a.parentId==null?null:a.parentId), deps: Array.isArray(a.deps)?a.deps.filter(Boolean).map(d=>({ predKind:d.predKind==='reference'?'reference':'action', predId:d.predId, type:DEP_TYPES.includes(d.type)?d.type:'FS', lag:Number.isFinite(+d.lag)?(+d.lag):0 })):[], schedule: a.schedule||{}, progress: Number.isFinite(+a.progress)?(+a.progress):0, custom: a.custom||{} };
      })
    };
  }
  // Serialize the SETUP schema (setup.json) — UI configuration only.
  function serializeSetup(){
    return {
      schemaVersion: 1,
      brand: state.setup.brand,
      appearance: {
        dark: !!state.layout.dark, activity: !!state.layout.activity, sidebar: !!state.layout.sidebar, right: !!state.layout.right, topbar: !!state.layout.topbar,
        theme: state.layout.theme||'light',
        panelWidths: { sidebar: state.layout.sw||260, right: state.layout.rw||300 },
        treeIndent: state.layout.treeIndent||16
      },
      labels: state.setup.labels,
      defaultView: state.setup.defaultView,
      help: Object.keys(state.setup.help).length
        ? Object.keys(state.setup.help).map(k=>({ id:k, title:state.setup.help[k].title, body:state.setup.help[k].body }))
        : Object.keys(BUILTIN_HELP_MD).map(k=>({ id:k, title:BUILTIN_HELP_MD[k].title, body:BUILTIN_HELP_MD[k].body })),
      reports: (state.setup.reports && state.setup.reports.length) ? state.setup.reports : BUILTIN_REPORTS.map(r=>({id:r.id,label:r.label})),
      filters: (state.setup.filters && state.setup.filters.length) ? state.setup.filters : BUILTIN_FILTERS.map(f=>({id:f.id,label:f.label})),
      customFields: state.customFields.map(f=>({ id:f.id, key:f.key, label:f.label, type:f.type, options:f.options, required:!!f.required, default:f.default, description:f.description||'' })),
      actionTypes: (state.actionTypes||[]).map(f=>({ id:f.id, label:f.label }))
    };
  }

  async function autoLoad(){
    const url = resolveDataUrl();
    if(url && (location.protocol==='http:' || location.protocol==='https:')){
      let dataJson=null, note='';
      try{
        const res = await fetch(url);
        if(!res.ok){ note = 'HTTP '+res.status; }
        else {
          const txt = await res.text();
          const stripped = txt.charCodeAt(0)===0xFEFF ? txt.slice(1) : txt; // strip UTF-8 BOM
          try { dataJson = JSON.parse(stripped); }
          catch(e){ note = 'parse error: '+e.message; }
        }
      }catch(e){ note = 'fetch failed: '+e.message; }
      if(dataJson){
        applyDataset(dataJson, { name:DEFAULT_DATA_FILE, path:url.pathname, source:'external' });
      } else {
        applyDataset({projects:[],disciplines:[],statuses:[],actions:[]}, { name:DEFAULT_DATA_FILE, path:url.pathname, source:'none' });
        toast(DEFAULT_DATA_FILE+' unloaded ('+(note||'empty')+') — started empty. Use Create to write it.');
      }
      // setup.json is optional; missing -> built-in defaults (applySetup not called, lets keep BUILTIN_*)
      try{
        const surl = new URL('setup.json', location.href);
        const sres = await fetch(surl);
        if(sres.ok){
          const stxt = await sres.text();
          const sstripped = stxt.charCodeAt(0)===0xFEFF ? stxt.slice(1) : stxt;
          applySetup(JSON.parse(sstripped));
        } else if(sres.status!==404){
          console.warn('setup.json returned '+sres.status+', using built-in defaults.');
        }
      }catch(e){ console.warn('setup.json load failed ('+e.message+'), using built-in defaults.'); }
      // Page-start load must NOT be flagged dirty — the user hasn't edited anything.
      // Normalization / legacy hints are already surfaced via the toasts above; we don't
      // want to block navigation or show "● unsaved" just for opening the file.
      state.dataDirty=false; state.setupDirty=false; updateSaveButtons();
      updateStatusbar();
      return;
    }
    // file:// (double-click) — no server. Per workplan §5.1, the browser blocks
    // fetch() of sibling files on file:// (Chrome; Firefox allows same-folder reads).
    // So: Firefox auto-loads when fetch succeeds; Chrome (fetch blocked) shows the
    // startup modal (promptPickJson) to pick action.json + set the working folder.
    let dataJson=null, note='';
    try{
      const res = await fetch('./'+DEFAULT_DATA_FILE);
      if(res.ok){
        const txt = await res.text();
        const stripped = txt.charCodeAt(0)===0xFEFF ? txt.slice(1) : txt; // strip UTF-8 BOM
        dataJson = JSON.parse(stripped);
      } else { note = 'HTTP '+res.status; }
    }catch(e){ note = 'fetch blocked (file://): '+e.message; }
    if(dataJson){
      applyDataset(dataJson, { name:DEFAULT_DATA_FILE, path:'(local file)', source:'external' });
      // Page-start load must NOT be flagged dirty — the user hasn't edited anything.
      state.dataDirty=false; state.setupDirty=false; updateSaveButtons();
      updateStatusbar();
    } else {
      // No sibling file reachable (Chrome file://) — restore the §5.1 startup modal
      // so the user can pick action.json + the working folder. No silent sample fallback.
      promptPickJson();
    }
    // setup.json — attempt fetch, else fall back to embedded defaults (no UI impact)
    try{
      const sres = await fetch('./setup.json');
      if(sres.ok){ const stxt = await sres.text(); const sstripped = stxt.charCodeAt(0)===0xFEFF ? stxt.slice(1) : stxt; applySetup(JSON.parse(sstripped)); }
      else { const sseed = document.getElementById('seedSetup'); if(sseed){ try{ applySetup(JSON.parse(sseed.textContent)); }catch(e){} } }
    }catch(e){ const sseed = document.getElementById('seedSetup'); if(sseed){ try{ applySetup(JSON.parse(sseed.textContent)); }catch(e){} } }
  }

  // Shown when the page runs from file:// — asks the user to pick the JSON manually.
  function promptPickJson(){
    const m = $('openJsonModal'); if(!m) return;
    m.classList.add('open');
    const f=m.querySelector('button'); if(f) f.focus();
    $('ojPick').onclick = () => importViaPicker({ setFolder:true });
    $('ojSample').onclick = async () => {
      if(!await confirmSaveBeforeLeave()) return;
      const seed = document.getElementById('seedData');
      if(seed){ try{ applyDataset(JSON.parse(seed.textContent), { name:DEFAULT_DATA_FILE, path:'(embedded)', source:'embedded' }); }catch(e){} }
      else applyDataset({projects:[],disciplines:[],statuses:[],actions:[]}, { name:DEFAULT_DATA_FILE, path:'', source:'none' });
      closeModalBox('openJsonModal');
    };
  }

  // Create an empty data file in the same folder. On Chromium uses the File System
  // Access API to write INTO the HTML's directory; elsewhere falls back to a download.
  async function createDataFile(){
    const empty = {
      schemaVersion: 3,
      members: [],
      statuses: ['Pending','In Progress','Completed','Blocked','On Hold','Not Started','Info'].map((s,i)=>normStatus(s,i)),
      priorities: ['Critical','High','Medium','Low'].map((p,i)=>normPriority(p,i)),
      customFields: [],
      referencePoints: [],
      projects: [], disciplines: [], actions: []
    };
    try{
      if(window.showSaveFilePicker){
        const handle = await window.showSaveFilePicker({
          suggestedName: DEFAULT_DATA_FILE,
          startIn: dataDirHandle || undefined,
          types:[{ description:'JSON', accept:{ 'application/json': ['.json'] } }]
        });
        const w = await handle.createWritable();
        await w.write(JSON.stringify(empty, null, 2));
        await w.close();
        state.loadedFile = { name:DEFAULT_DATA_FILE, path:'(local file)', source:'external' };
        state.dataDirty = false; updateSaveButtons();
        toast('Created empty '+DEFAULT_DATA_FILE);
        updateStatusbar();
        return;
      }
    }catch(e){ /* user cancelled or unsupported -> fall through to download */ }
    const blob = new Blob([JSON.stringify(empty, null, 2)], { type:'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = DEFAULT_DATA_FILE; a.click();
    state.dataDirty = false; updateSaveButtons();
    toast('Downloaded empty '+DEFAULT_DATA_FILE+' (save it next to index.html)');
  }

  function downloadJson(name, text, msg){
    const blob = new Blob([text], {type:'application/json'});
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
    if(msg) toast(msg);
  }

  // Save Actions writes the data file (action.json) into the local folder.
  async function writeDataFile(){
    const text = JSON.stringify(serializeData(), null, 2);
    if(window.showSaveFilePicker){
      try{
        const handle = await window.showSaveFilePicker({
          suggestedName: DEFAULT_DATA_FILE,
          startIn: dataDirHandle || undefined,
          types: [{ description:'JSON', accept: { 'application/json': ['.json'] } }]
        });
        const w = await handle.createWritable(); await w.write(text); await w.close();
        state.loadedFile = { name: handle.name || DEFAULT_DATA_FILE, path: '(local file)', source: 'external' };
        state.dataDirty = false; updateSaveButtons();
        toast('Saved ' + (handle.name || DEFAULT_DATA_FILE));
      }catch(e){ if(e && e.name !== 'AbortError') toast('Save failed: ' + e.message); }
      return;
    }
    downloadJson(DEFAULT_DATA_FILE, text, 'Saved '+DEFAULT_DATA_FILE);
    state.dataDirty = false; updateSaveButtons();
  }

  // Save Settings writes the UI configuration (setup.json). On Chromium it uses
  // the File System Access API; elsewhere it falls back to a DOWNLOAD (the browser
  // cannot write directly), and we tell the user that explicitly.
  async function saveSetupFile(){
    const text = JSON.stringify(serializeSetup(), null, 2);
    if(window.showSaveFilePicker){
      const r = await saveViaPicker('setup.json', text, 'application/json');
      if(r.ok){ state.setupDirty = false; updateSaveButtons(); toast('Saved setup.json'); return; }
      if(r.aborted) return;
    }
    downloadJson('setup.json', text, 'Downloading setup.json (browser can\'t write directly)');
    state.setupDirty = false; updateSaveButtons();
  }

  function updateStatusbar(){
    const el = $('statusbar'); if(!el) return;
    const f = state.loadedFile;
    const src = f ? f.source : 'none';
    const dot  = src==='external' ? 'sb-ext' : src==='imported' ? 'sb-imp' : src==='embedded' ? 'sb-emb' : 'sb-none';
    const name = f ? f.name : 'No data file';
    const path = f ? (f.path||'') : '';
    const srcTxt  = srcLabel(src);
    const migTag  = state.migrated ? '<span class="sb-mig" title="Upgraded from a legacy schema. Click Save to persist the new v1 format.">⚠ legacy → v1</span>' : '';
    const counts = state.projects.length+' projects · '+liveActions().length+' actions';
    const folderChip = dataDirHandle ? '<span class="sb-src">📁 '+esc(dataDirHandle.name)+'</span>' : '';
    // Pure status: source dot + file + folder + legacy tag + counts (no buttons)
    el.innerHTML =
      '<span class="sb-left"><span class="sb-dot '+dot+'"></span>'+
      '<span class="sb-file" title="'+esc(path)+'">Loaded: '+esc(name)+'</span>'+
      folderChip +
      '<span class="sb-src">'+esc(srcTxt)+'</span>'+ migTag +'</span>'+
      '<span class="sb-right"><span class="sb-counts">'+counts+'</span></span>';
    // Top bar brand meta mirrors the same state
    const tf=$('tbFile'); if(tf){ const fname=tf.querySelector('.tb-fname'); if(fname) fname.textContent=name; }
    syncTopbarUnsaved();
  }
  // Top-bar "● unsaved" indicator — kept in sync on every dirty/save change and
  // pulses continuously while there are unsaved changes (amber, infinite).
  function syncTopbarUnsaved(){
    const tm=$('tbMeta'); if(!tm) return;
    const src = state.loadedFile ? state.loadedFile.source : 'none';
    const counts = state.projects.length+' projects · '+liveActions().length+' actions';
    const dirty = state.dataDirty || state.setupDirty;
    tm.innerHTML = (src==='none'?'no data · ':'')+esc(counts)+(dirty?' · <span class="tb-unsaved" title="Unsaved changes — Save Actions / Save Settings">● unsaved</span>':'');
  }
