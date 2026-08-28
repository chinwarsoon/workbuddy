# v37 Apply Guide — Layout polish batch (incl. ISS-67 resizable columns)

> The sandbox blocked direct edits to existing files this session, so the changes are
> delivered here as exact **find → replace** snippets. Apply them in your editor, then
> run the verification steps at the bottom. No file was modified by the assistant.

---

## 1. `css/styles.css` — narrow-screen media query (Task #25)

**Find** (the `@media (max-width:680px)` block near the end of the file):

```css
  @media (max-width:680px){
    .focus-grid{grid-template-columns:1fr 1fr;}
    .ed-subhead, .ed-body{padding-left:16px; padding-right:16px;}
  }
```

**Replace with:**

```css
  @media (max-width:680px){
    .ae-log-meta-h{width:auto; min-width:120px;}
    .ed-subhead{padding-left:16px; padding-right:16px;}
    .ed-body{padding:16px;}
  }
```

Notes:
- Removes the old `.focus-grid{grid-template-columns:1fr 1fr}` rule that conflicts with the
  new `repeat(auto-fit, minmax(220px,1fr))` (already applied in the prior session).
- Lets the trailing **Meta** column shrink on phones (`width:auto; min-width:120px`).
- Tightens `.ed-body` padding to `16px` all around on narrow screens.

---

## 2. `js/render.js` — resizable `#aeLog` columns (ISS-67)

### 2a. Add drag handles to the table header (thead template)

**Find** (inside `renderActionEditor`, the `<table class="ae-log" id="aeLog">…` line):

```js
        <table class="ae-log" id="aeLog"><thead><tr><th class="ae-log-row-h"></th><th class="ae-log-date">Date</th><th>Detail</th><th class="ae-log-meta-h">Meta</th></tr></thead><tbody id="aeLogBody">${logRows}</tbody></table>
```

**Replace with:**

```js
        <table class="ae-log" id="aeLog"><thead><tr><th class="ae-log-row-h"><span class="ae-col-resizer" data-col="row"></span></th><th class="ae-log-date">Date<span class="ae-col-resizer" data-col="date"></span></th><th>Detail<span class="ae-col-resizer" data-col="detail"></span></th><th class="ae-log-meta-h">Meta<span class="ae-col-resizer" data-col="meta"></span></th></tr></thead><tbody id="aeLogBody">${logRows}</tbody></table>
```

> The `.ae-col-resizer` spans are already styled in `css/styles.css` (`.ae-col-resizer`,
> `.ae-col-resizer:hover`, `.ae-col-resizing`). They anchor to each `<th>` because
> `position:sticky` on `.ae-log th` establishes the containing block for the absolutely
> positioned handle — do **not** add `position:relative` to the `th` (it would override
> the sticky header).

### 2b. Call the binder from `bindActionEditor`

**Find** (end of `bindActionEditor`, the line that calls `bindFocusCells`):

```js
    bindFocusCells(a);
```

**Replace with:**

```js
    bindFocusCells(a);
    bindColResizers();
```

### 2c. Add the new `bindColResizers()` function

Paste this as a top-level function in `render.js` (e.g. right after the `bindActionEditor`
function, before `markDirty`):

```js
  // ISS-67: user-resizable columns in the dated detail log table.
  // Drag the 7px handle on any header's right edge; widths persist in localStorage.
  function bindColResizers(){
    const table = $('aeLog'); if(!table) return;
    const ths = Array.from(table.querySelectorAll('thead th'));
    if(!ths.length) return;
    const KEY = 'aeLogColWidths';
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch(e){ saved = {}; }
    // restore previously saved widths
    ths.forEach(th=>{
      const h = th.querySelector('.ae-col-resizer'); if(!h) return;
      const w = saved[h.dataset.col];
      if(w && !isNaN(w)) th.style.width = w + 'px';
    });
    // wire up drag on each handle
    ths.forEach(th=>{
      const handle = th.querySelector('.ae-col-resizer'); if(!handle) return;
      handle.addEventListener('mousedown', (e)=>{
        e.preventDefault();
        const startX = e.clientX;
        const startW = th.getBoundingClientRect().width;
        document.body.classList.add('ae-col-resizing');
        const onMove = (ev)=>{
          const w = Math.max(48, Math.round(startW + (ev.clientX - startX)));
          th.style.width = w + 'px';
        };
        const onUp = ()=>{
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          document.body.classList.remove('ae-col-resizing');
          const out = {};
          ths.forEach(t=>{ const hh = t.querySelector('.ae-col-resizer'); if(hh) out[hh.dataset.col] = Math.round(t.getBoundingClientRect().width); });
          try { localStorage.setItem(KEY, JSON.stringify(out)); } catch(e){}
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });
  }
```

---

## 3. Verification (run locally)

```powershell
cd action-log
node --check js/render.js
node --check js/core.js
node --check js/io.js
node --check js/report.js
node --check js/settings.js
run_action_log.bat
```

Then in the browser (hard refresh **Ctrl+Shift+R**):
1. Open any action → the detail table header shows a 7px grab handle at each column's right edge.
2. Drag a handle → that column resizes; minimum width is 48px.
3. Reload the page / reopen the action → widths are restored from `localStorage` (`aeLogColWidths`).
4. Narrow the window below 680px → Meta column shrinks to `min-width:120px`, `.ed-body` is 16px.
5. Confirm focus cards still highlight on hover (body fill) and `position:sticky` header stays put on scroll.

---

## 4. Workplan / memory updates (apply in your editor)

- `project_action_log_workplan.md`
  - §2: change the **v37** row status from `Approved (pending implementation)` → `Implemented (2026-08-24)`.
  - §11: add an implementation note under the `2026-08-28 Approval` entry: *"v37 implemented: sticky header + cell wrap, focus hover body-shade, focus-grid auto-fit, prose cap 760px, narrow-screen meta/body fixes, ISS-67 resizable columns."*
  - §16.4 ISS-67: status `Open (approved)` → `Implemented (2026-08-24)`.
- `.workbuddy/memory/2026-08-28.md`: append a one-line implementation record for v37 + ISS-67.

---

## 5. Rollback

If the resizer feels off, the only behavioral change is the `bindColResizers()` call +
function + the four `<span class="ae-col-resizer">` handles in the thead. Remove those three
and the table returns to fixed CSS column widths. The CSS media-query change in §1 is
independent and safe to keep.
