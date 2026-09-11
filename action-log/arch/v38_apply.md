# v38 — Defect fix batch (v37 regressions)

> Apply by **find → replace** in your editor. Each block lists the exact current string and the replacement.
> Files: `css/styles.css`, `js/render.js`. No token / label / data-model changes.
> Sandbox blocks direct overwrite this session, so this is the canonical patch set.

---

## Root-cause recap (why v37 didn't fix these)

- **ISS-69 (resize did nothing):** the v37 resizer was *never actually applied* — the thead had no `.ae-col-resizer` handles, there was no `bindColResizers()` function, and no call. On top of that, `table-layout:fixed; width:100%` re-normalises any single-column px width to keep the table at 100%, so even a correct handler would have felt inert. Fix = add handles + percentage widths with neighbour compensation.
- **ISS-68 (header bleed):** `border-collapse:collapse` + `position:sticky` th is a known Chrome bug — scrolled rows paint through the th background. Fix = `border-collapse:separate` + box-shadow grid + opaque th.
- **ISS-70 (attach/link not bottom):** Detail `td` was top-aligned; controls sat right under the text, leaving a gap when Meta was taller. Fix = flex column + `margin-top:auto`.
- **Leftover:** narrow-screen `@media(max-width:680px)` still forced `.focus-grid{grid-template-columns:1fr 1fr}` which conflicts with the approved `auto-fit` — cleaned up here too.

---

## Part 1 — `css/styles.css`

### 1A · ISS-68 sticky header bleed (replace lines 170–172)
**Find:**
```
  .ae-log{width:100%; border-collapse:collapse; margin-top:4px; table-layout:fixed;}
  .ae-log th, .ae-log td{border:1px solid var(--border); padding:7px 10px; text-align:left; font-size:13px; vertical-align:top;}
  .ae-log th{background:var(--chip); font-weight:700; color:var(--muted); text-transform:uppercase; font-size:11px; letter-spacing:.04em; position:sticky; top:0; z-index:2;}
```
**Replace:**
```
  .ae-log{width:100%; border-collapse:separate; border-spacing:0; margin-top:4px; table-layout:fixed;}
  /* ISS-68: separate + box-shadow grid (not collapse) so the sticky th background never bleeds through scrolling rows */
  .ae-log th, .ae-log td{border:none; padding:7px 10px; text-align:left; font-size:13px; vertical-align:top; background-clip:padding-box; box-shadow:inset -1px 0 var(--border), inset 0 -1px 0 var(--border);}
  .ae-log th:first-child, .ae-log td:first-child{box-shadow:inset 1px 0 0 var(--border), inset -1px 0 var(--border), inset 0 -1px 0 var(--border);}
  .ae-log th{background:var(--chip); font-weight:700; color:var(--muted); text-transform:uppercase; font-size:11px; letter-spacing:.04em; position:sticky; top:0; z-index:3; box-shadow:inset 1px 0 0 var(--border), inset -1px 0 var(--border), inset 0 1px 0 var(--border), inset 0 -1px 0 var(--border);}
```

### 1B · ISS-69 visible grip + wider hit area (replace lines 183–185)
**Find:**
```
  .ae-col-resizer{position:absolute; top:0; right:0; width:7px; height:100%; cursor:col-resize; user-select:none; z-index:3;}
  .ae-col-resizer:hover{background:var(--accent); opacity:.22;}
  .ae-col-resizing, .ae-col-resizing *{user-select:none !important; cursor:col-resize !important;}
```
**Replace:**
```
  .ae-col-resizer{position:absolute; top:0; right:0; width:10px; height:100%; cursor:col-resize; user-select:none; z-index:4;}
  .ae-col-resizer::after{content:""; position:absolute; top:18%; right:3px; width:2px; height:64%; background:var(--border); border-radius:1px;}
  .ae-col-resizer:hover::after, .ae-col-resizer.active::after{background:var(--accent);}
  .ae-col-resizer:hover{background:var(--accent); opacity:.14;}
  .ae-col-resizing, .ae-col-resizing *{user-select:none !important; cursor:col-resize !important;}
```

### 1C · ISS-70 pin Attach/Link to row bottom (insert after line 188)
**Find:**
```
  .ae-log-meta{vertical-align:top;}
```
**Replace:**
```
  .ae-log-meta{vertical-align:top;}
  /* ISS-70: make the Detail cell a flex column so Attach/Link sit at the bottom of every row */
  .ae-log-detail{display:flex; flex-direction:column; height:100%;}
  .ae-log-detail .ae-log-text{width:100%;}
  .ae-log-detail .ae-img-ctl{margin-top:auto;}
```

### 1D · narrow-screen cleanup (replace lines 512–515)
**Find:**
```
  @media (max-width:680px){
    .focus-grid{grid-template-columns:1fr 1fr;}
    .ed-subhead, .ed-body{padding-left:16px; padding-right:16px;}
  }
```
**Replace:**
```
  @media (max-width:680px){
    .focus-grid{grid-template-columns:1fr;}
    .ed-subhead, .ed-body{padding-left:16px; padding-right:16px;}
    .ed-body{padding:16px;}
    .ae-log-meta-h{width:auto; min-width:120px;}
  }
```

---

## Part 2 — `js/render.js`

### 2E · add resizer handles to thead (replace line 369)
**Find:**
```
        <table class="ae-log" id="aeLog"><thead><tr><th class="ae-log-row-h"></th><th class="ae-log-date">Date</th><th>Detail</th><th class="ae-log-meta-h">Meta</th></tr></thead><tbody id="aeLogBody">${logRows}</tbody></table>
```
**Replace:**
```
        <table class="ae-log" id="aeLog"><thead><tr><th class="ae-log-row-h"><span class="ae-col-resizer" data-col="row"></span></th><th class="ae-log-date">Date<span class="ae-col-resizer" data-col="date"></span></th><th>Detail<span class="ae-col-resizer" data-col="detail"></span></th><th class="ae-log-meta-h">Meta<span class="ae-col-resizer" data-col="meta"></span></th></tr></thead><tbody id="aeLogBody">${logRows}</tbody></table>
```
> Note: handles anchor to the `th` (which is `position:sticky`, i.e. a positioned ancestor) — do **not** add `position:relative` to `th` (it would break the sticky containing block).

### 2F · tag the Detail cell (replace line 435)
**Find:**
```
      + `<td><textarea class="ae-log-text" rows="2">${esc(r.text||'')}</textarea>`
```
**Replace:**
```
      + `<td class="ae-log-detail"><textarea class="ae-log-text" rows="2">${esc(r.text||'')}</textarea>`
```

### 2G · call the resizer binder (replace line 674)
**Find:**
```
    bindFocusCells(a);
```
**Replace:**
```
    bindFocusCells(a);
    bindColResizers(a);
```

### 2H · new `bindColResizers()` (insert just BEFORE `function markDirty(a){`)
**Find:**
```
  function markDirty(a){
```
**Replace:**
```
  // ---- ISS-67/69: user-resizable ae-log columns (drag handles on the 4 th) ----
  // Widths stored as percentages in localStorage['aeLogColWidths']; the dragged column
  // and its neighbour trade width so the total stays 100% and the drag is always visible.
  const COL_RES_KEY='aeLogColWidths';
  const COL_RES_DEFAULTS={row:6, date:16, detail:58, meta:20}; // sum 100 (%)
  let _colDrag=null, _colResizeDocBound=false;
  function _bindColResizeDoc(){
    if(_colResizeDocBound) return; _colResizeDocBound=true;
    document.addEventListener('mousemove', e=>{
      if(!_colDrag) return;
      const dpx=e.clientX-_colDrag.startX;
      const dPct=(dpx/_colDrag.tableW)*100;
      let nk=_colDrag.wk+dPct, nn=_colDrag.wn-dPct;
      const MIN=4; // ~48px on a ~1200px editor
      if(nk<MIN){ nk=MIN; nn=_colDrag.wk+_colDrag.wn-MIN; }
      if(nn<MIN){ nn=MIN; nk=_colDrag.wk+_colDrag.wn-MIN; }
      _colDrag.w[_colDrag.k]=nk; _colDrag.w[_colDrag.nk]=nn;
      _colDrag.th.style.width=nk+'%';
      const nth=_colDrag.th.nextElementSibling || _colDrag.th.previousElementSibling;
      if(nth) nth.style.width=nn+'%';
    });
    document.addEventListener('mouseup', ()=>{
      if(!_colDrag) return;
      const active=document.querySelector('.ae-col-resizer.active');
      if(active) active.classList.remove('active');
      document.body.classList.remove('ae-col-resizing');
      try{ localStorage.setItem(COL_RES_KEY, JSON.stringify(_colDrag.w)); }catch(e){}
      _colDrag=null;
    });
  }
  function bindColResizers(a){
    const table=document.getElementById('aeLog'); if(!table) return;
    const head=table.querySelector('thead'); if(!head) return;
    const ths=[].slice.call(head.querySelectorAll('th'));
    let w=COL_RES_DEFAULTS;
    try{ const s=JSON.parse(localStorage.getItem(COL_RES_KEY)); if(s&&typeof s==='object') w=Object.assign({},COL_RES_DEFAULTS,s); }catch(e){}
    ths.forEach(th=>{ const c=th.querySelector('.ae-col-resizer'); if(c&&w[c.dataset.col]!=null) th.style.width=w[c.dataset.col]+'%'; });
    head.querySelectorAll('.ae-col-resizer').forEach(h=>{
      h.addEventListener('mousedown', e=>{
        e.preventDefault(); e.stopPropagation();
        const th=h.closest('th'); const k=h.dataset.col;
        const cols=['row','date','detail','meta'];
        const idx=cols.indexOf(k);
        const nk=(idx<cols.length-1)?cols[idx+1]:cols[idx-1];
        _colDrag={k, nk, startX:e.clientX, wk:w[k], wn:w[nk], tableW:table.getBoundingClientRect().width, th, w};
        h.classList.add('active');
        document.body.classList.add('ae-col-resizing');
      });
    });
    _bindColResizeDoc();
  }

  function markDirty(a){
```

---

## Part 3 — workplan update (`project_action_log_workplan.md`)

### §2 revision-history table — add one row
```
| v38 | 2026-08-28 | Defect fix batch (v37 regressions) | Fix 3 v37-reported defects: ISS-68 sticky-header bleed, ISS-69 column-resize ineffective / no affordance, ISS-70 Attach/Link not row-bottom. Files: `css/styles.css`, `js/render.js`. |
```

### §11 — insert this block right AFTER the existing v37 Approval block (lines ~685–696)
```
### [2026-08-28] Implementation — Layout polish batch (v37)
- Implemented (user local apply of `v37_apply.md`): sticky `#aeLog` header, `.ae-log td` long-string wrap, focus-card hover body-shade, `.focus-grid` auto-fit, fold-body prose cap (760px), narrow-screen `.ae-log-meta-h`/`.ed-body` tweaks, ISS-67 resizable columns scaffold.
- Status: **Implemented (2026-08-28, v37)**. **Defects found on user test → v38**: ISS-68 (sticky header bleed), ISS-69 (resize never worked — handles/binder were missing), ISS-70 (attach/link not row-bottom).
- Related: §2 v37; §16.4 ISS-67 (implemented, defective) + ISS-68/69/70.

### [2026-08-28] Defect fix batch — v37 regressions (v38)
- Trigger: user tested v37 and reported 3 issues (cannot resize columns; header bleeds on scroll; attach/link not bottom-aligned).
- Decisions (approved, "proceed"): ISS-68 → `border-collapse:separate` + box-shadow separators + opaque th (z-index:3, `background-clip:padding-box`); ISS-69 → real thead handles + `bindColResizers` with percentage widths + neighbour compensation + visible 2px grip; ISS-70 → Detail `td.ae-log-detail` flex column + `.ae-img-ctl{margin-top:auto}`; plus narrow-screen `.focus-grid:1fr` cleanup.
- Files: `css/styles.css`, `js/render.js` (`logRowHtml` + new `bindColResizers`). No token/label/data changes.
- Related: §16.4 ISS-68/69/70.
```

### §16.4 — replace the single ISS-67 row with these four rows
**Find (the existing ISS-67 line):**
```
| ISS-67 | ae-log — user-resizable `#aeLog` columns: drag handles on the 4 `th` (Row / Date / Detail / Meta) to adjust widths; persist per-column widths to `localStorage` (restored on load); Detail is the flexible column. Works with existing `table-layout:fixed`. View-only, no data change. Spawned from approved layout-polish batch (v37, item 5b). | §6.5 / ae-log | Open (approved 2026-08-28, pending implementation) |
```
**Replace with:**
```
| ISS-67 | ae-log — user-resizable `#aeLog` columns: drag handles on the 4 `th` (Row / Date / Detail / Meta); persist widths to `localStorage`; Detail flexible. Spawned from v37 item 5b. | §6.5 / ae-log | **Implemented (2026-08-28, v37)** — user reported columns did NOT resize; root cause: handles/binder never applied + fixed+100% re-normalisation. Re-fixed in v38 (ISS-69). |
| ISS-68 | ae-log — **sticky `#aeLog` header background bleed** on scroll (body shows through). `border-collapse:collapse` + `position:sticky` bug. Fix: `border-collapse:separate; border-spacing:0` + box-shadow 1px separators; opaque th bg + z-index:3 + `background-clip:padding-box`. | §6.5 / ae-log | Open (reported 2026-08-28; batched in v38) |
| ISS-69 | ae-log — **column resize not effective / no affordance** (follow-up ISS-67). Causes: resizer handles + `bindColResizers` were never applied; `fixed`+`100%` re-normalises widths so drag felt inert. Fix: real thead handles + visible 2px grip; percentage widths with neighbour compensation (total stays 100%); persist to `localStorage`. | §6.5 / ae-log | Open (reported 2026-08-28; batched in v38) |
| ISS-70 | ae-log — **Attach / Link not pinned to row bottom**. Fix: Detail `td` `class="ae-log-detail"` (flex column, `height:100%`) + `.ae-img-ctl{margin-top:auto}`. | §6.5 / ae-log | Open (reported 2026-08-28; batched in v38) |
```

---

## Part 4 — local test steps
```powershell
cd action-log
node --check js/render.js   # also: js/core.js js/io.js js/report.js js/settings.js
run_action_log.bat
```
Browser **Ctrl+Shift+R** (hard refresh), then:
1. **ISS-68:** scroll the detail log — header stays opaque, no rows behind it.
2. **ISS-69:** hover a `th` right edge → 2px grip appears; drag → boundary moves, neighbour compensates, total width constant; reload → widths persist (`localStorage.aeLogColWidths`).
3. **ISS-70:** give a row a tall Meta column (edit a Meta line) and short Detail text → 📎 Attach / 🔗 Link sit at the Detail cell bottom.
4. **Narrow:** shrink window <680px → `.focus-grid` is single column, Meta keeps `min-width:120px`, `.ed-body` padding 16px.
```

