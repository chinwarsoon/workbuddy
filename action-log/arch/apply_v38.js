#!/usr/bin/env node
/*
 * apply_v38.js — applies the v38 defect-fix batch (ISS-68/69/70) to ActionTracker.
 * Run from the action-log directory:
 *     cd action-log
 *     node apply_v38.js
 *     node --check js/render.js
 * Then hard-refresh the app (Ctrl+Shift+R).
 *
 * Each replacement is asserted to exist before writing, so a mismatch aborts
 * cleanly instead of corrupting the file.
 *
 * v39 sync (2026-09-02): the CSS 1C step now emits the v39 form of the ISS-70 fix
 * (table-cell + absolutely-pinned Attach/Link). The v38 form (`display:flex` on the
 * Detail <td>) was WRONG — it broke the cell out of table layout and left the Detail
 * column's bottom grid line above the other columns'. Do not re-introduce it.
 *
 * IDEMPOTENT (fixed 2026-09-02): every replacement carries a `mk` marker — a
 * string that exists ONLY in the replacement text, never in the original. If the
 * marker is already present the step is skipped as "already applied". This is
 * required because several replacements keep their own anchor intact after
 * applying (e.g. `function markDirty(a){` is re-emitted at the end of the
 * inserted block), so a plain re-run used to insert the block a SECOND time and
 * break the file with "Identifier 'COL_RES_KEY' has already been declared".
 */
'use strict';
const fs = require('fs');
const path = require('path');

const CSS = path.join(__dirname, 'css', 'styles.css');
const JS  = path.join(__dirname, 'js', 'render.js');

const reps = [
  // ---------- styles.css ----------
  { file: CSS, name: 'CSS 1A-1 .ae-log border model',
    mk: "border-collapse:separate; border-spacing:0;",
    old: ".ae-log{width:100%; border-collapse:collapse; margin-top:4px; table-layout:fixed;}",
    new: ".ae-log{width:100%; border-collapse:separate; border-spacing:0; margin-top:4px; table-layout:fixed;}" },
  { file: CSS, name: 'CSS 1A-2 .ae-log th,td grid',
    mk: "background-clip:padding-box;",
    old: ".ae-log th, .ae-log td{border:1px solid var(--border); padding:7px 10px; text-align:left; font-size:13px; vertical-align:top;}",
    new: ".ae-log th, .ae-log td{border:none; padding:7px 10px; text-align:left; font-size:13px; vertical-align:top; background-clip:padding-box; box-shadow:inset -1px 0 var(--border), inset 0 -1px 0 var(--border);}" },
  { file: CSS, name: 'CSS 1A-3 .ae-log th sticky/opaque',
    mk: ".ae-log th:first-child, .ae-log td:first-child{box-shadow:inset 1px 0 0 var(--border)",
    old: ".ae-log th{background:var(--chip); font-weight:700; color:var(--muted); text-transform:uppercase; font-size:11px; letter-spacing:.04em; position:sticky; top:0; z-index:2;}",
    new: ".ae-log th:first-child, .ae-log td:first-child{box-shadow:inset 1px 0 0 var(--border), inset -1px 0 var(--border), inset 0 -1px 0 var(--border);}\n  .ae-log th{background:var(--chip); font-weight:700; color:var(--muted); text-transform:uppercase; font-size:11px; letter-spacing:.04em; position:sticky; top:0; z-index:3; box-shadow:inset 1px 0 0 var(--border), inset -1px 0 var(--border), inset 0 1px 0 var(--border), inset 0 -1px 0 var(--border);}" },
  { file: CSS, name: 'CSS 1B-1 resizer hit area',
    mk: "width:10px; height:100%; cursor:col-resize;",
    old: ".ae-col-resizer{position:absolute; top:0; right:0; width:7px; height:100%; cursor:col-resize; user-select:none; z-index:3;}",
    new: ".ae-col-resizer{position:absolute; top:0; right:0; width:10px; height:100%; cursor:col-resize; user-select:none; z-index:4;}" },
  { file: CSS, name: 'CSS 1B-2 resizer visible grip',
    mk: ".ae-col-resizer::after{content:\"\";",
    old: ".ae-col-resizer:hover{background:var(--accent); opacity:.22;}",
    new: ".ae-col-resizer::after{content:\"\"; position:absolute; top:18%; right:3px; width:2px; height:64%; background:var(--border); border-radius:1px;}\n  .ae-col-resizer:hover::after, .ae-col-resizer.active::after{background:var(--accent);}\n  .ae-col-resizer:hover{background:var(--accent); opacity:.14;}" },
  { file: CSS, name: 'CSS 1C ISS-70/72 detail bottom-pin (v39 form)',
    mk: ".ae-log td.ae-log-detail{vertical-align:top; position:relative;",
    old: ".ae-log-meta{vertical-align:top;}",
    new: ".ae-log-meta{vertical-align:top;}\n  /* ISS-70 re-fix (v39 / ISS-72): the Detail cell MUST stay a real table-cell — a flex <td>\n     gets wrapped in an anonymous cell, so its grid lines stop at the content box, not the\n     row height. Reserve room at the bottom and pin Attach/Link into it instead. */\n  .ae-log td.ae-log-detail{vertical-align:top; position:relative; padding-bottom:42px;}\n  .ae-log td.ae-log-detail .ae-log-text{width:100%;}\n  .ae-log td.ae-log-detail .ae-img-ctl{position:absolute; left:10px; right:10px; bottom:7px; margin-top:0; flex-wrap:nowrap;}\n  .ae-log td.ae-log-detail .ae-link-img{min-width:0;}" },
  { file: CSS, name: 'CSS 1D narrow focus-grid',
    mk: ".focus-grid{grid-template-columns:1fr;}",
    old: ".focus-grid{grid-template-columns:1fr 1fr;}",
    new: ".focus-grid{grid-template-columns:1fr;}" },
  { file: CSS, name: 'CSS 1D narrow padding/meta',
    mk: "    .ae-log-meta-h{width:auto; min-width:120px;}",
    old: ".ed-subhead, .ed-body{padding-left:16px; padding-right:16px;}",
    new: ".ed-subhead, .ed-body{padding-left:16px; padding-right:16px;}\n    .ed-body{padding:16px;}\n    .ae-log-meta-h{width:auto; min-width:120px;}" },

  // ---------- js/render.js ----------
  { file: JS, name: 'JS 2E row handle',
    mk: "<th class=\"ae-log-row-h\"><span class=\"ae-col-resizer\"",
    old: "<th class=\"ae-log-row-h\"></th>",
    new: "<th class=\"ae-log-row-h\"><span class=\"ae-col-resizer\" data-col=\"row\"></span></th>" },
  { file: JS, name: 'JS 2E date handle',
    mk: "Date<span class=\"ae-col-resizer\"",
    old: "<th class=\"ae-log-date\">Date</th>",
    new: "<th class=\"ae-log-date\">Date<span class=\"ae-col-resizer\" data-col=\"date\"></span></th>" },
  { file: JS, name: 'JS 2E detail handle',
    mk: "Detail<span class=\"ae-col-resizer\"",
    old: "<th>Detail</th>",
    new: "<th>Detail<span class=\"ae-col-resizer\" data-col=\"detail\"></span></th>" },
  { file: JS, name: 'JS 2E meta handle',
    mk: "Meta<span class=\"ae-col-resizer\"",
    old: "<th class=\"ae-log-meta-h\">Meta</th>",
    new: "<th class=\"ae-log-meta-h\">Meta<span class=\"ae-col-resizer\" data-col=\"meta\"></span></th>" },
  { file: JS, name: 'JS 2F detail cell class',
    mk: "<td class=\"ae-log-detail\">",
    old: "<td><textarea class=\"ae-log-text\" rows=\"2\">",
    new: "<td class=\"ae-log-detail\"><textarea class=\"ae-log-text\" rows=\"2\">" },
  { file: JS, name: 'JS 2G bind call',
    mk: "\n    bindColResizers(a);",
    old: "    bindFocusCells(a);",
    new: "    bindFocusCells(a);\n    bindColResizers(a);" },
  { file: JS, name: 'JS 2H bindColResizers fn',
    mk: "const COL_RES_KEY='aeLogColWidths';",
    old: "  function markDirty(a){",
    new: [
"  // ---- ISS-67/69: user-resizable ae-log columns (drag handles on the 4 th) ----",
"  // Widths stored as percentages in localStorage['aeLogColWidths']; the dragged column",
"  // and its neighbour trade width so the total stays 100% and the drag is always visible.",
"  const COL_RES_KEY='aeLogColWidths';",
"  const COL_RES_DEFAULTS={row:6, date:16, detail:58, meta:20}; // sum 100 (%)",
"  let _colDrag=null, _colResizeDocBound=false;",
"  function _bindColResizeDoc(){",
"    if(_colResizeDocBound) return; _colResizeDocBound=true;",
"    document.addEventListener('mousemove', e=>{",
"      if(!_colDrag) return;",
"      const dpx=e.clientX-_colDrag.startX;",
"      const dPct=(dpx/_colDrag.tableW)*100;",
"      let nk=_colDrag.wk+dPct, nn=_colDrag.wn-dPct;",
"      const MIN=4; // ~48px on a ~1200px editor",
"      if(nk<MIN){ nk=MIN; nn=_colDrag.wk+_colDrag.wn-MIN; }",
"      if(nn<MIN){ nn=MIN; nk=_colDrag.wk+_colDrag.wn-MIN; }",
"      _colDrag.w[_colDrag.k]=nk; _colDrag.w[_colDrag.nk]=nn;",
"      _colDrag.th.style.width=nk+'%';",
"      const nth=_colDrag.th.nextElementSibling || _colDrag.th.previousElementSibling;",
"      if(nth) nth.style.width=nn+'%';",
"    });",
"    document.addEventListener('mouseup', ()=>{",
"      if(!_colDrag) return;",
"      const active=document.querySelector('.ae-col-resizer.active');",
"      if(active) active.classList.remove('active');",
"      document.body.classList.remove('ae-col-resizing');",
"      try{ localStorage.setItem(COL_RES_KEY, JSON.stringify(_colDrag.w)); }catch(e){}",
"      _colDrag=null;",
"    });",
"  }",
"  function bindColResizers(a){",
"    const table=document.getElementById('aeLog'); if(!table) return;",
"    const head=table.querySelector('thead'); if(!head) return;",
"    const ths=[].slice.call(head.querySelectorAll('th'));",
"    let w=COL_RES_DEFAULTS;",
"    try{ const s=JSON.parse(localStorage.getItem(COL_RES_KEY)); if(s&&typeof s==='object') w=Object.assign({},COL_RES_DEFAULTS,s); }catch(e){}",
"    ths.forEach(th=>{ const c=th.querySelector('.ae-col-resizer'); if(c&&w[c.dataset.col]!=null) th.style.width=w[c.dataset.col]+'%'; });",
"    head.querySelectorAll('.ae-col-resizer').forEach(h=>{",
"      h.addEventListener('mousedown', e=>{",
"        e.preventDefault(); e.stopPropagation();",
"        const th=h.closest('th'); const k=h.dataset.col;",
"        const cols=['row','date','detail','meta'];",
"        const idx=cols.indexOf(k);",
"        const nk=(idx<cols.length-1)?cols[idx+1]:cols[idx-1];",
"        _colDrag={k, nk, startX:e.clientX, wk:w[k], wn:w[nk], tableW:table.getBoundingClientRect().width, th, w};",
"        h.classList.add('active');",
"        document.body.classList.add('ae-col-resizing');",
"      });",
"    });",
"    _bindColResizeDoc();",
"  }",
"",
"  function markDirty(a){"
    ].join('\n') },
];

let applied = 0, skipped = 0, failed = 0;

function applyRep(r, src){
  // Idempotency guard: the marker exists only in the applied text.
  if (r.mk && src.indexOf(r.mk) !== -1) {
    console.log('  · already applied  [' + r.name + ']');
    skipped++;
    return src;
  }
  if (src.indexOf(r.old) === -1) {
    console.error('  ⚠ SKIP [' + r.name + ']: old string not found (file differs — apply manually).');
    failed++;
    return src;
  }
  console.log('  ✓ ' + r.name);
  applied++;
  return src.replace(r.old, r.new);
}

console.log('Applying v38 to:');
console.log('  ' + CSS);
console.log('  ' + JS);
console.log('');

// Read both files once, then run every replacement for that file in sequence.
const cache = {};
for (const f of [CSS, JS]) {
  try { cache[f] = fs.readFileSync(f, 'utf8'); }
  catch (e) { console.error('  ✗ cannot read', f, '-', e.message); process.exitCode = 1; }
}
for (const r of reps) {
  if (cache[r.file] == null) { failed++; continue; }
  cache[r.file] = applyRep(r, cache[r.file]);
}
for (const f of [CSS, JS]) {
  if (cache[f] == null) continue;
  try { fs.writeFileSync(f, cache[f], 'utf8'); }
  catch (e) { console.error('  ✗ cannot write', f, '-', e.message); process.exitCode = 1; }
}

console.log('');
console.log('Summary: ' + applied + ' applied, ' + skipped + ' already applied, ' + failed + ' failed.');
console.log('Done. Next: node --check js/render.js  &&  run_action_log.bat  &&  hard-refresh (Ctrl+Shift+R).');
