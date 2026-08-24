"use strict";

  // ---- Activity bar ----
  $('activitybar').addEventListener('click', async e=>{ const b=e.target.closest('.abtn[data-p]'); if(b) await setPerspective(b.dataset.p); });
  [['swTop','topbar'],['swActivity','activity'],['swSidebar','sidebar'],['swRight','right'],['swDark','dark']].forEach(([id,key])=>{
    const el=$(id); if(!el) return;
    el.onclick=()=>{ state.layout[key]=!state.layout[key]; setSwitch(el, state.layout[key]); applyLayout(); markSetupDirty(); };
  });
  $('rwSidebar').oninput=e=>{ state.layout.sw=+e.target.value; $('rwSidebarVal').textContent=state.layout.sw; applyLayout(); markSetupDirty(); };
  $('rwRight').oninput=e=>{ state.layout.rw=+e.target.value; $('rwRightVal').textContent=state.layout.rw; applyLayout(); markSetupDirty(); };
  $('layoutClose').onclick=()=>closeModalBox('layoutModal');

  // ---- Right panel + Help modal ----
  bindEl('rpSetting', ()=>{ syncLayoutModal(); openModalBox('layoutModal'); });
  bindEl('rpHelp', ()=>{ openModalBox('helpModal'); });
  $('helpClose').onclick=()=>closeModalBox('helpModal');
  // ---- Modals backdrop close ----
  ['actionModal','layoutModal','helpModal','exportModal','openJsonModal','projectModal','reassignModal'].forEach(id=>{
    $(id).addEventListener('click', e=>{ if(e.target===$(id)) closeModalBox(id); });
  });
  // ---- Keyboard shortcuts ----
  const KEYS={'1':'actions','2':'projects','3':'disciplines','4':'reports','5':'search','6':'settings','7':'help'};
  document.addEventListener('keydown', e=>{
    // Switch widgets: Enter / Space toggles any [role=switch]
    if((e.key==='Enter'||e.key===' '||e.key==='Spacebar') && e.target && e.target.getAttribute && e.target.getAttribute('role')==='switch'){ e.preventDefault(); e.target.click(); return; }
    // Esc: close the topmost open modal, else close the mobile drawer
    if(e.key==='Escape'){
      const open=[...document.querySelectorAll('.backdrop.open')].pop();
      if(open){ closeModalBox(open.id); return; }
      if(document.body.classList.contains('m-show-side')){ closeDrawers(); return; }
    }
    const m=e.metaKey||e.ctrlKey;
    if(m && e.key.toLowerCase()==='s' && e.shiftKey){ e.preventDefault(); saveSetupFile(); return; }
    if(m && e.key.toLowerCase()==='s'){ e.preventDefault(); writeDataFile(); return; }
    if(m && e.key.toLowerCase()==='e'){ e.preventDefault(); openExportModal(); return; }
    if(m && e.key===','){ e.preventDefault(); setPerspective('settings'); return; }
    if(m && KEYS[e.key]){ e.preventDefault(); setPerspective(KEYS[e.key]); }
  });
  // Focus trap (WCAG 2.1.2): Tab stays inside the open modal
  document.addEventListener('keydown', e=>{
    if(e.key!=='Tab') return;
    const open=[...document.querySelectorAll('.backdrop.open')].pop();
    if(!open) return;
    const f=open.querySelectorAll('input,select,textarea,button,[tabindex]:not([tabindex="-1"])');
    if(!f.length) return;
    const first=f[0], last=f[f.length-1], a=document.activeElement;
    if(e.shiftKey && (a===first || !open.contains(a))){ e.preventDefault(); last.focus(); }
    else if(!e.shiftKey && (a===last || !open.contains(a))){ e.preventDefault(); first.focus(); }
  });
  // ---- Init ----
  applyLayout();
  syncLayoutModal();
  setPerspective(state.perspective);
  autoLoad();
  loadDataDir().then(updateStatusbar);
