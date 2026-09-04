"use strict";

  // ---- Color popover (statuses & priorities): curated palette + native "custom" fallback ----
  let _curTrigger=null;
  function openStatusColorPop(list, id, anchor){
    const pop=$('statusColorPop'); if(!pop) return;
    const idx=list.findIndex(x=>x.id===id); if(idx<0) return;
    const cur=list[idx].color || '#EFEAFB';
    pop.innerHTML = STATUS_PALETTE.map((hex,i)=>`<button class="sw-dot" data-hex="${esc(hex)}" title="${esc(STATUS_SWATCH_NAMES[i]||hex)}" style="background:${esc(hex)}"></button>`).join('')
      + `<label class="sw-custom">Custom <input type="color" id="swCustom" value="${esc(toHex6(cur))}"></label>`;
    const r=anchor.getBoundingClientRect();
    pop.style.left = Math.max(8, Math.min(r.left, window.innerWidth-236))+'px';
    pop.style.top  = Math.min(r.bottom+6, window.innerHeight-180)+'px';
    pop.classList.add('open'); _curTrigger=anchor;
    pop.querySelectorAll('.sw-dot').forEach(b=> b.onclick=()=>{ applyStatusColor(list, idx, b.dataset.hex); closeStatusColorPop(); });
    const ci=$('swCustom'); if(ci) ci.oninput=()=> applyStatusColor(list, idx, ci.value);
    document.removeEventListener('click', _outsideClose);
    setTimeout(()=> document.addEventListener('click', _outsideClose), 0);
  }
  function applyStatusColor(list, idx, hex){ const s=list[idx]; if(!s) return; s.color=hex; markDataDirty(); refresh(); if(_curTrigger) _curTrigger.style.background=hex; }
  function closeStatusColorPop(){ const pop=$('statusColorPop'); if(pop){ pop.classList.remove('open'); pop.innerHTML=''; } document.removeEventListener('click', _outsideClose); _curTrigger=null; }
  function _outsideClose(e){ const pop=$('statusColorPop'); if(pop && !pop.contains(e.target) && !(e.target.classList && e.target.classList.contains('sw-trigger'))) closeStatusColorPop(); }
  // ---- Export to Word / Excel ----
  async function msoDownload(filename, html, mime){
    if(window.showSaveFilePicker){
      const r = await saveViaPicker(filename, '﻿'+html, mime);
      if(r.ok){ toast('Exported '+filename); return; }
      if(r.aborted) return;
    }
    const blob = new Blob(['﻿'+html], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href), 4000);
    toast('Exported '+filename);
  }
  function createdOnOf(a){
    return a.createdOn || (a.history && a.history[0] && typeof a.history[0].d==='string' && /^\d{4}-\d{2}-\d{2}$/.test(a.history[0].d) ? a.history[0].d : '');
  }
  function detailLogRows(a){
    function addLabel(set, label, fn){
      if(!Array.isArray(set)) return '';
      const parts = set.map(fn).filter(Boolean);
      return parts.length ? `<div class="rep-sub"><b>${label}:</b> ${parts.join(', ')}</div>` : '';
    }
    function imgsHtml(r){
      const att=(Array.isArray(r.attachments)?r.attachments:(Array.isArray(r.images)?r.images.map(im=>({name:im.name,src:im.src,type:'image'})):[]));
      if(!att.length) return '';
      return att.map(im=>{
        if((im.type||'image')==='file') return `<br/>🔗 <a href="${esc(normalizeLinkSrc(im.src))}">${esc(im.name||'file')}</a>`;
        if(String(im.src||'').indexOf('data:')===0) return `<br/><img src="${esc(im.src)}" alt="${esc(im.name||'image')}" style="max-width:420px;max-height:320px;border:1px solid #ccc;border-radius:6px" />`;
        return `<br/>📎 ${esc(im.name||'image')} — ${esc(im.src)}`;
      }).join('');
    }
    return (a.detailLog && a.detailLog.length)
      ? a.detailLog.map(r=>{
          const typeIds = addLabel(r.typeIds, 'Type', id=>{ const t=(state.actionTypes||[]).find(x=>x.id===id); return t?t.label:id; });
          const byIds = addLabel(r.actionBy, 'Action by', id=>memberNameById(id));
          const st = r.status ? `<div class="rep-sub"><b>Status:</b> ${esc(statusLabel(r.status))}</div>` : '';
          const due = r.due ? `<div class="rep-sub"><b>Due:</b> ${esc(r.due)}</div>` : '';
          const by = r.editedBy ? `<div class="rep-sub"><b>Edited by:</b> ${esc(memberNameById(r.editedBy))}</div>` : '';
          return `<tr><td>${esc(r.date||'')}</td><td>${typeIds}${byIds}${st}${due}${by}${esc(r.text||'')}${imgsHtml(r)}</td></tr>`;
        }).join('')
      : `<tr><td colspan="2">No entries</td></tr>`;
  }
  function exportWord(acts){
    const sections = acts.map(a=>{
      const meta = `<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:Calibri;width:100%">`
        + `<tr><td><b>Project</b></td><td>${esc(projName(a.projectId))}</td><td><b>Discipline</b></td><td>${esc(discName(a.disciplineId))}</td></tr>`
        + `<tr><td><b>Status</b></td><td>${esc(aStatusLabel(a))}</td><td><b>Due</b></td><td>${esc(a.due||'—')}</td></tr>`
        + `<tr><td><b>Assigned to</b></td><td>${esc(assigneesTxt(a))}</td><td><b>Created by</b></td><td>${esc(creatorName(a))}</td></tr>`
        + `<tr><td><b>Created On</b></td><td>${esc(createdOnOf(a)||'—')}</td><td><b>Dependencies</b></td><td>${esc(actionDeps(a).length?actionDeps(a).map(d=>depLabel(d)).join('; '):'—')}</td></tr>`
        + `</table>`;
      const log = `<table border="1" cellspacing="0" cellpadding="6" style="border-collapse:collapse;font-family:Calibri;width:100%"><tr><th style="text-align:left">Date</th><th style="text-align:left">Detail</th></tr>${detailLogRows(a)}</table>`;
      return `<h2>${esc(a.title)}</h2>${meta}<p style="font-family:Calibri"><b>Description (dated detail log)</b></p>${log}`;
    }).join('<hr/>');
    const html = `<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Actions</title></head><body>${sections}</body></html>`;
    msoDownload('Actions.doc', html, 'application/msword');
  }
  function exportExcel(acts){
    const header = `<tr><th>ID</th><th>Title</th><th>Project</th><th>Discipline</th><th>Status</th><th>Due</th><th>Assigned</th><th>Created By</th><th>Created On</th></tr>`;
    const rows = acts.map(a=>`<tr><td>${a.id}</td><td>${esc(a.title)}</td><td>${esc(projName(a.projectId))}</td><td>${esc(discName(a.disciplineId))}</td><td>${esc(aStatusLabel(a))}</td><td>${esc(a.due||'')}</td><td>${esc(assigneeList(a).join(', '))}</td><td>${esc(a.createdByName||memberNameById(a.createdById)||'')}</td><td>${esc(createdOnOf(a)||'')}</td></tr>`).join('');
    const html = `<!DOCTYPE html><html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Actions</title></head><body><table border="1" cellspacing="0" cellpadding="4">${header}${rows}</table></body></html>`;
    msoDownload('Actions.xls', html, 'application/vnd.ms-excel');
  }
  function openExportModal(){
    exportSel = new Set();
    renderExportFilters();
    openModalBox('exportModal');
  }
  function renderExportFilters(){
    $('exProject').innerHTML   = `<option value="">All</option>` + state.projects.map(p=>`<option value="${p.id}">${esc(p.name)}</option>`).join('');
    $('exDiscipline').innerHTML= `<option value="">All</option>` + state.disciplines.map(d=>`<option value="${d.id}">${esc(d.name)}</option>`).join('');
    $('exStatus').innerHTML    = `<option value="">All</option>` + state.statuses.map(s=>`<option value="${esc(s.id)}">${esc(s.label)}</option>`).join('');
    ['exProject','exDiscipline','exStatus'].forEach(id=>{ const el=$(id); if(el) el.onchange=renderExportList; });
    const q=$('exSearch'); if(q) q.oninput=renderExportList;
    renderExportList();
  }
  function exportFiltered(){
    const pid=$('exProject').value, did=$('exDiscipline').value, st=$('exStatus').value, q=$('exSearch').value.trim().toLowerCase();
    return liveActions().filter(a=>{
      if(pid && a.projectId!==pid) return false;
      if(did && a.disciplineId!==did) return false;
      if(st && aStatusId(a)!==st) return false;
      if(q && !a.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }
  function renderExportList(){
    const all = exportFiltered();
    [...exportSel].forEach(id=>{ if(!all.find(a=>a.id===id)) exportSel.delete(id); });
    const list = all.length ? all.map(a=>`<label class="ex-item"><input type="checkbox" class="ex-chk" value="${a.id}" ${exportSel.has(a.id)?'checked':''}/> <span>${esc(a.title)}</span> <span class="ex-sub">${esc(projName(a.projectId))} · ${esc(aStatusLabel(a))}</span></label>`).join('')
                         : `<div class="lm-empty">No actions match the filters.</div>`;
    $('exList').innerHTML = list;
    $('exList').querySelectorAll('.ex-chk').forEach(c=>c.onchange=()=>{ if(c.checked) exportSel.add(+c.value); else exportSel.delete(+c.value); updateExportCount(); });
    updateExportCount();
  }
  function updateExportCount(){
    const n = exportSel.size;
    const el=$('exCount'); if(el) el.textContent = n + ' selected';
    const btn=$('exExport'); if(btn) btn.disabled = n===0;
  }
  $('exSelectAll').onclick=()=>{ exportFiltered().forEach(a=>exportSel.add(a.id)); renderExportList(); };
  $('exClear').onclick=()=>{ exportSel.clear(); renderExportList(); };
  $('exCancel').onclick=()=>closeModalBox('exportModal');
  $('exClose').onclick=()=>closeModalBox('exportModal');
  $('exExport').onclick=()=>{
    const acts = liveActions().filter(a=>exportSel.has(a.id));
    if(!acts.length) return;
    if($('exFmtWord').checked) exportWord(acts); else exportExcel(acts);
    closeModalBox('exportModal');
  };
