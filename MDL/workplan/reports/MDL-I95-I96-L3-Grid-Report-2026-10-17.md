| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-17 | chinwarsoon | Implementation + verification report for workplan `../MDL-I95-I96-L3-Grid-Workplan.md`, phases 1–6. |

# MDL — I-95 / I-96 L3 grid: implementation & verification report

**Date**: 2026-10-17 · **Workplan**: `MDL/workplan/MDL-I95-I96-L3-Grid-Workplan.md` (v1.1, approved)
**Scope**: phases 1–6 in one session · **Result**: all six phases implemented and verified;
**I-95 / I-96 remain open pending recorded closure approval (§26.6)**.

---

## 1. What was built

| Phase | Capability | Where |
|---|---|---|
| 1 | Windowed rendering — only the visible window + 8 rows overscan is drawn; two spacer rows preserve the scroll height; the control row keeps reporting the **full** count | `makeWindow()` in `MDL/src/render.mjs`, applied to the Document Detail table and the Validation Issue list |
| 2 | Pinned first two columns (`Source Tab` + `Document No.` for Detail, `Severity` + `Doc No` for the issue list) — sticky, opaque, `left` offsets derived from the real column widths, `.ds-pinned-edge` on the last pinned cell | `.ds-pinned` / `.ds-pinned-edge` CSS + `makeGrid()` cell/header emission |
| 3 | Column chooser — a "Columns (29)" / "Columns (8)" popover with one checkbox per column, pinned columns locked, "Reset to defaults", persisted | `makeGrid().chooser()` |
| 4 | Column resize — 9 px grip per header, pointer drag, double-click auto-fit, 60 px minimum / 640 px maximum, persisted, pinned offsets re-anchored on every change | `makeGrid().resizer()` |
| 5 | Matrix residuals — drill-down rows now read from the **sorted** sequence; one `<col>` per leaf column; spacer `<th rowspan="2">` given `aria-label="Expand stages"` (both the live and the export copy of the matrix) | `openOne`, `matrixReportHTML`, `renderMatrix` |
| 6 | Verification — new unit test file, new harness tier, full runs | see §2 |

**Design note (the one rule that shaped everything):** `<colgroup>`, header cells and body cells are all
derived from a single `grid.visible()` list inside one `makeGrid()` object. That is the structural guard
against the RC-1…RC-8 column-drift family that I-90 fixed.

---

## 2. Verification evidence

### 2.1 New unit test — `MDL/test/test_grid.mjs` (21 checks, 21 pass)

Runs the built bundle in jsdom without rendering the dashboard, so it is fast and memory-safe:

- column model: 8 core columns visible by default (D37), 21 of 29 hidden, pinned columns first (D38),
  `.ds-pinned` / `.ds-pinned-edge` classes, plain header cell for the non-sortable Source Tab;
- persistence (D40): widths and visibility survive a fresh `makeGrid`, unknown keys dropped,
  pinned columns cannot be removed, width clamping at 60 / 640 px;
- windowing (D39): threshold 500, off below / on above, window `0:17` at scrollTop 0,
  spacer heights `0px` + `23320px`, redraw repaints `92:117` at scrollTop 4000,
  unmeasurable scroller falls back to the full body;
- **regression guard**: `full()` must return HTML (a void painter silently wrote the string
  "undefined" into `<tbody>` — found and fixed during this session).

### 2.2 Layout harness — new Tier 4b (16 checks, 16 pass)

`harness-layout/harness.mjs` gained a **Tier 4b: L3 capabilities** section driven through the real UI in
Chromium with the real workbook:

```
PASS I-95: every table pins two columns with position:sticky (D38)
PASS I-95: pinned cells carry an OPAQUE background (no bleed-through)
PASS I-95: pinned column 1 at left:0, column 2 offset by the first column width
PASS I-95: resize grips present on every table header (D36)
PASS I-95: detail chooser opens and offers columns (25 selectable)
PASS I-95: detail chooser hides one column — colgroup, header and body all shrink together
PASS I-95: detail chooser persists the choice (D40)
PASS I-95: issue chooser opens and offers columns (6 selectable)
PASS I-95: issue chooser hides one column — colgroup, header and body all shrink together
PASS I-95: issue chooser persists the choice (D40)
PASS I-95: dragging a grip widens the column
PASS I-95: the new width is persisted (D40)
PASS I-96: a windowed table draws far fewer rows than it has
PASS I-96: spacer rows present (scroll height preserved)
PASS I-96: the control row still reports the FULL count (§4.3 contract)
PASS I-96: scroll height ≈ full list × row height
```

Tier 4 (I-90 geometry) also still passes, now with windowing awareness: spacer rows are reported
separately and are **never** measured as data rows.

### 2.3 Full runs

| Run | Result |
|---|---|
| `node harness.mjs --dashboard mdl` (tiers 1–4 + 4b) | **167 passed, 9 failed**, 2 advisory warnings, 14 skipped |
| Same run against the pre-change (`HEAD`) renderer | 153 passed, **13 failed** — the same 9 plus 4 L3 checks that did not exist yet |
| `node test/test_grid.mjs` | 21 / 21 pass |
| `node test/test_pipeline.mjs` | 99 passed / 4 failed — identical to `HEAD` (data discrepancy, see §3) |

The 9 remaining harness failures and the 4 pipeline failures are **pre-existing and unrelated** to
I-95 / I-96 — they reproduce unchanged with the `HEAD` renderer:

- Tier 1: `role="alert"` missing, render "write-only" comment missing, `data-theme` missing (3);
- Tier 2: onboarding screen not visible, `STATE` object not exposed (2);
- Tier 3 + pipeline: KPI / filter / active-count mismatch **7 392 vs 7 323** (4) — the workbook's
  excluded-stage records are absent, a data-level discrepancy already logged.

### 2.4 Known limitation of the unit suite

`MDL/test/test_render.mjs` cannot run in this environment: it renders the whole dashboard in jsdom and
needs ~10 GB of heap (it OOMs at 6 GB and 12 GB, **with and without** these changes). Windowing removes
that cost in a real browser, but jsdom has no layout, so the unmeasurable-scroller fallback renders the
full body. `test_grid.mjs` was added specifically to keep the new code covered regardless.

---

## 3. Behaviour that changed for the user

| Before | After |
|---|---|
| All ~21 866 rows × 29 columns built at once | ~17–60 rows drawn; scroll height preserved by spacers |
| Scrolling right loses the document number | `Source Tab` + `Document No.` stay pinned (issue list: `Severity` + `Doc No`) |
| All 29 columns always shown | "Columns (29)" chooser, default 8, remembered |
| Column widths fixed by the stylesheet | Drag or double-click to resize, remembered, resettable |
| Matrix drill-down rows could jump to the wrong discipline after sorting | They follow their parent |

CSV export, sorting, filtering, search and the KPI counts are unchanged: windowing is a rendering
detail only and never enters the data layer (I-96 invariant, D39).

---

## 4. Files changed

| File | Change |
|---|---|
| `MDL/src/render.mjs` | `makeWindow()`, `makeGrid()` (chooser + resizer + pinned cell/header emission), CSS for `.ds-pinned` / `.ds-pinned-edge` / `.ds-resize` / `.win-pad` / chooser rows, both tables rewired, matrix residuals |
| `MDL/MDL-Dashboard.html` | rebuilt by `node build.mjs` |
| `MDL/test/test_grid.mjs` | **new** — 21 unit checks for the L3 kit and windowing |
| `harness-layout/harness.mjs` | Tier 4b (`lintL3`), spacer-row aware measurement, `padRows` reporting |
| `harness-layout/SKILL.md`, `README.md` | Tier 4b documented |
| `MDL/mdl-issues.md` | evidence + status notes for I-95 / I-96 (revision 1.4) |

---

## 5. What is still open

1. **Closure approval** — `Approved: <date> by <author>` is required before I-95 / I-96 may move to
   `RESOLVED` (§26.6). They stay `OPEN` / `OPEN_PARTIAL` until then.
2. **`ALIGNED`** — blocked by I-97 (the workplan still carries dangling "§12 I-xx" references).
3. **Manual pass** — print output (§7.2.11) has a `beforeprint` full-body fallback that is coded but not
   exercised by an automated check; worth one manual look.
4. **Pre-existing failures** (9 harness / 4 pipeline) are candidate issues from the I-97 queue.
