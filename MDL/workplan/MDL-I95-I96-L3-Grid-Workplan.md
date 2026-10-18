# Workplan — I-95 / I-96: L3 Grid Capabilities & Windowed Rendering

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-17 | chinwarsoon | Initial plan. Decisions D36–D40 recorded in `../mdl-issues.md` §6.1. **DRAFT — pending approval.** |
| 1.1 | 2026-10-17 | chinwarsoon | Phases rewritten in plain English with worked examples (code references kept as "Code it touches"). |
| 1.2 | 2026-10-17 | chinwarsoon | Approved and executed (phases 1–6). Implementation + verification report at `reports/MDL-I95-I96-L3-Grid-Report-2026-10-17.md`; I-95 / I-96 closed in `../mdl-issues.md`. |

---

## 1. Title and description

Implementation of the two remaining data-table issues of the MDL dashboard:

- **I-95** — L3 grid capabilities for the 27-column Document Detail table: pinned identity columns, a
  "Columns (27)" chooser, and column resize (spec §7.2.1, §7.2.5, §7.2.13, §7.2.14).
- **I-96** — windowed rendering for large tables plus the residual cross-tab (matrix) sort rules
  (spec §7.2.8, §7.2.9).

Both build on the I-90 grid foundation (`<colgroup>` + `table-layout:fixed` + 40 px row metrics),
which closed on 2026-10-17.

## 2. Document control

| Field | Value |
|---|---|
| Document ID | `MDL/workplan/MDL-I95-I96-L3-Grid-Workplan.md` |
| Status | **COMPLETE — approved 2026-10-17, phases 1–6 executed and verified.** Report: `../workplan/reports/MDL-I95-I96-L3-Grid-Report-2026-10-17.md`; I-95 / I-96 closed in `../mdl-issues.md` (revision 1.5). |
| Version history | 1.0 — 2026-10-17 — initial plan · 1.1 — 2026-10-17 — phases rewritten in plain English with examples |
| Issues covered | MDL I-95 (`OPEN 🔴`), I-96 (`OPEN_PARTIAL 🟠`) |
| Decisions | D36–D40 in `../mdl-issues.md` §6.1 |
| Phase reports | `MDL/workplan/reports/` (one per phase, §15) |

## 3. Object

Deliver, on the real workbook, for **both** the Document Detail table and the Validation Issue list table:

1. pinned first two columns (Source Tab + Document No.),
2. a checkbox column chooser with an eight-column default and persistence,
3. column resize (grip, auto-fit, minimum width, reset, persistence),
4. windowed rendering above 500 rows with full-count reporting,
5. the residual matrix cross-tab rules (sorted drill source, one `<col>` per leaf column, spacer `aria-label`).

## 4. Scope summary

| ID | Detail | Category | Status | Related phase |
|---|---|---|---|---|
| I-95 | Pinned columns + column chooser + column resize (Detail **and** Issue list, D36) | Enhancement / High 🟠 | OPEN | Phase 2–4 |
| I-96 | Windowed rendering (>500 rows, D39) + matrix cross-tab residuals | Performance / High 🟠 | OPEN_PARTIAL (cross-tab rules done in I-92) | Phase 1, 5 |
| I-97 | Workplan alignment (dangling "§12 I-xx" refs, §8/§9 duplication) | Documentation | candidate | after this plan |

Out of scope: changing the data layer, CSV export content (export keeps reading the full sorted array),
PPP dashboard (its own `I-nn` sequence), the ~33-token `:root` adoption (Decision 35).

## 5. Index

| § | Section |
|---|---|
| 1 | Title and description |
| 2 | Document control |
| 3 | Object |
| 4 | Scope summary |
| 5 | Index |
| 6 | Dependencies |
| 7 | Evaluation and alignment with existing architecture |
| 8 | Implementation phases (8.1–8.6) |
| 9 | Risks and mitigation |
| 10 | Potential future issues |
| 11 | Success criteria (closure) |
| 12 | References |

## 6. Dependencies with other tasks

| Dependency | State | Note |
|---|---|---|
| I-90 grid foundation (`<colgroup>`, `table-layout:fixed`, `--ds-row-h`) | **RESOLVED 2026-10-17** | prerequisite for pin/chooser/resize |
| I-92 / I-93 (L2 sort + column filters, `wireSort`, `attachColFilters`) | RESOLVED | the popover and sort patterns this plan reuses |
| I-62a severity glyphs, I-89/I-90 harness | RESOLVED | Tier 4 geometry harness is the verification vehicle |
| I-97 workplan alignment | open | gates `RESOLVED → ALIGNED` |
| `harness-layout` Tier 4 | needs extension | Phase 6 adds assertions for pin/chooser/resize/windowing |

## 7. Evaluation and alignment with existing architecture

The dashboard already ships every primitive this plan needs, so no new architecture is introduced:

| Existing facility | Location | Reused by |
|---|---|---|
| `getPref` / `setPref` (localStorage, `mdl_*` prefix) | `src/render.mjs:760-761` | chooser visibility, column widths (D40) |
| `.tf-btn` / `.tf-panel` / `.tf-item` popover CSS | `src/render.mjs:119-126` | the column chooser |
| `attachColFilters()` (I-93 popover behaviour, `restoreFlt`) | `src/render.mjs` | shape of `attachColChooser()` |
| `wireSort()` + `dsSorted()` (I-92) | `src/render.mjs` | re-sorting a windowed body |
| Split header + `--ds-sbw` gutter sync | `src/render.mjs:2021-2056` | header stays aligned with the body grid |
| `renderDetail()` → `bodyHTML()` / `renderBody()` (rewrites `tbody` only) | `src/render.mjs:2057-2130` | pinned cells + windowing without touching the data layer |
| `detailCols` / `issueCols` column models | `src/render.mjs:2062`, `:1984` | single source for `<colgroup>`, header and body cells |
| Matrix `<tfoot>` TOTAL pinned, `openOne` accordion | `src/render.mjs:1342`, `:1322`, `:1320-1327` | I-96b residuals |

Alignment checks performed: `AGENTS.md` §5.15 (concept spanning ≥3 sources) — the column set, the
column keys and the persisted keys must agree across `render.mjs`, `mdl-issues.md` (D36–D40) and
`Dashboard-UI-Design-Spec.md` §7.2; a mismatch is a blocking defect and is re-checked in Phase 6.

## 8. Implementation phases

Six phases, one work session each. Every phase ends with a report in `MDL/workplan/reports/` and a
short update of `mdl-issues.md`.

**What you will have when all six are done:** the Document Detail table and the Validation Issue
list table scroll fast even with ~22 000 rows, the first two columns (Source Tab, Document No.) stay
in view when you scroll right, a "Columns (27)" button lets you show only the columns you care about
(and remembers your choice), you can drag column edges to resize them, and the summary matrix keeps
its drill-down rows attached to the right discipline after sorting.

### 8.1 Phase 1 — Only draw the rows you can see (windowing, I-96a)

| | |
|---|---|
| **What you get** | The Document Detail table (~21 866 rows) and the Issue list (~7 392 rows) scroll and sort smoothly. Today the browser builds all 27 × 21 866 ≈ 200 000 cells in one go, so every sort, filter or search makes the page stutter. |
| **What we build** | A "window renderer": it draws only the rows currently visible, plus 8 rows above and below as a buffer, and puts blank spacer rows above and below so the scrollbar still represents the full length of the list. |
| **Example** | You jump to the middle of the document list. The browser holds about 60 rows at a time; the caption still reads "21 866 of 21 866 docs", because the count is calculated from the full list, not from what is drawn. |
| **The one rule** | Windowing only affects drawing. Sorting, filtering, search and the CSV export still work on the complete list, so nothing can disagree with what is on screen. |
| **When it kicks in** | Only for tables with more than 500 rows (D39). Smaller tables (matrix, overdue, rule reference) keep rendering as they do today. |
| **Code it touches** | `renderDetail()` and the issue-list renderer in `src/render.mjs` (~2057–2130). No change to the data layer. |
| **Done when** | Both big tables scroll and re-sort with no full-page rebuild, and the count caption still shows the true total. |

### 8.2 Phase 2 — Freeze the first two columns (I-95c)

| | |
|---|---|
| **What you get** | Scrolling right keeps **Source Tab** and **Document No.** in view — the same idea as Excel's freeze panes. Today the document number scrolls out of sight and you lose track of which row you are reading. |
| **What we build** | Sticky cells with an opaque background, and a clear layering order so the frozen cells sit above the scrolled ones: normal cell < frozen cell < header < the corner where a frozen cell meets the header. The frozen columns also cannot be hidden by the chooser. |
| **Example** | You scroll all the way right to read "Latest Approval Status" for a document and can still see "DOC-0142" pinned on the left edge. |
| **Watch-out** | The striped and hover background colours must be re-declared for the frozen cells, otherwise scrolled text shows through them — this is an explicit requirement of I-95. |
| **Code it touches** | New `.ds-pinned` / `.ds-pinned-edge` styles and `position:sticky;left:0` on the first two columns of both tables (`src/render.mjs`). |
| **Done when** | Scrolling right keeps the identity columns visible with no text bleeding through, and the harness can measure sticky cells in the first two columns. |

### 8.3 Phase 3 — A "Columns (27)" chooser (I-95a)

| | |
|---|---|
| **What you get** | A button labelled "Columns (27)" next to the CSV button. Clicking it opens a checklist of all 27 columns, with the 8 core ones already ticked (D37). It also tells you how many columns are hidden ("hidden 19 columns"), and remembers your choice after a reload. |
| **Example** | A planner unticks everything except Document No., UESH Discipline, Planned 1st Issue Date and Submission Status. 24 columns disappear, the table fits on screen, and after closing the browser the same four columns are still there tomorrow. |
| **What we build** | A new `attachColChooser()` that copies the existing Discipline / Stage filter popover, so it looks, opens and closes exactly like the filters you already use. |
| **Watch-out** | Column widths, the header row and the data cells must all be generated from one single list of visible columns. If they disagree, columns drift apart — that is the defect family (RC-1…RC-8) that I-90 just fixed, and it must not come back. |
| **Code it touches** | New function in `src/render.mjs`; the choice is saved with the existing `getPref` / `setPref` helper under `detail_cols` / `issue_cols` (D40). |
| **Done when** | Hiding 19 columns leaves the table perfectly aligned, sorting and CSV are unaffected, and the selection survives a reload. |

### 8.4 Phase 4 — Drag column edges to resize (I-95b)

| | |
|---|---|
| **What you get** | A small grip on the right edge of every column header. Drag it to widen or narrow a column (for example the Description column from 300 px to 500 px), double-click to make the column fit its content, and a "Reset widths" button to go back to the defaults. A column can never become narrower than 60 px, and your widths are remembered. |
| **Example** | You widen "Document Title" to read long titles in one line, then narrow "Source Tab" to give the space back — and next week the widths are still the same. |
| **What we build** | A 6 px resize grip in each header cell, pointer-based dragging, per-column width storage, and the reset action. Hidden columns keep their widths, so un-hiding a column restores it exactly as you left it. |
| **Touch devices** | The grip has a hit area of at least 24 px, so a fingertip works, and a double-tap auto-fits. |
| **Code it touches** | `.ds-resize` style plus pointer handlers in `src/render.mjs`; widths saved under `detail_widths` / `issue_widths` (D40). Because the frozen columns of Phase 2 read their offset from the real column widths, pinning re-anchors itself automatically when you resize. |
| **Done when** | Widths survive a reload, "Reset widths" restores the defaults, and the 60 px minimum is enforced. |

### 8.5 Phase 5 — The summary matrix's last quirks (I-96b)

| | |
|---|---|
| **What you get** | In the Discipline Summary Matrix, when you open a discipline to see its stage rows, those rows stay under their own discipline even after you sort the table by a number — today they can jump to the wrong place. The blank corner cell of the two-row header also gets a proper name for screen readers. |
| **Example** | You sort the matrix by "Overdue – 1st Submission" descending, then open "Structural". Its eight stage rows follow "Structural" down the list instead of staying in their original alphabetical spot. |
| **What we build** | Opening a discipline reads its rows from the sorted order instead of the original order; the grouped header emits one column definition per leaf column; the empty spacer header cell gets an `aria-label`. The accordion behaviour (one discipline open at a time) stays exactly as it is. |
| **Code it touches** | `src/render.mjs` ~1322 (only the source of the rows changes), the matrix column-group emission, and the spacer cells at ~1328 / ~1692. |
| **Done when** | Drill-down rows follow their parent after any sort, and every header cell has an accessible name. |

### 8.6 Phase 6 — Prove it works, then close the two issues

| | |
|---|---|
| **What we do** | 1) Extend the layout harness (Tier 4) with checks for the three new capabilities: sticky first columns, the chooser actually hiding columns, resize writing widths, and windowing keeping the full count and scroll height. 2) Run the pipeline and render unit tests — they must stay green, because the data layer does not change. 3) Run the full harness (tiers 1–4) against the real workbook. 4) A manual pass over both tables, reload persistence and print output. 5) Record tasks, resolution and your approval in `mdl-issues.md`. |
| **Done when** | Harness and tests are green, the manual pass is signed off, and `Approved:` is recorded — I-95 and I-96 then move to `RESOLVED`. `ALIGNED` still waits for I-97 (workplan alignment). |

## 9. Risks and mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Column mis-registration between `<colgroup>`, header and body (I-90 RC-1…RC-8 regression) | columns misalign | single `visibleCols` array + harness geometry assertion |
| Pinned cells let scrolled content bleed through | visual defect | opaque background + re-declared zebra/hover for pinned cells (explicit I-95 requirement) |
| Windowing breaks the §4.3 full-count contract | wrong counts | control row reads the unfiltered/unsorted total; harness asserts it |
| Windowing leaks into data layer | sort/filter/export divergence | sort/filter/export keep reading the full array; CSV unchanged |
| Persisted widths clash with the chooser | stuck layout | "Reset widths" action + chooser stores visibility only |
| 27-column drag on touch | unusable on tablet | ≥24 px hit area, auto-fit on double tap |
| Large single-file bundle grows | load time | keep new code in `src/render.mjs`, rebuild via `build.mjs`, no new dependencies |

## 10. Potential future issues

- Windowed rendering for the matrix and overdue tables if row counts ever exceed 500.
- Column groups (identity / planned / actual / approval / metadata) reusing the matrix grouped-header pattern
  (recorded in the I-95 Updates) — not in this scope.
- `ALIGNED` transition for I-95 / I-96 is blocked by I-97 (workplan alignment) and must be closed separately.
- Candidate issues still queued in `mdl-issues.md` §7 (I-97 … I-100).

## 11. Success criteria (closure)

I-95 closes when: pinned first two columns visible while scrolling (both tables), chooser hides/shows columns
with the eight-column default and persistence, resize works with minimum width and reset, harness Tier 4
asserts all three, and `Approved:` is recorded in the issue row.

I-96 closes when: tables above 500 rows render a window + 8 overscan rows with spacer rows, the full count is
still reported, sorting/filtering/export are unchanged, `openOne` reads the sorted sequence, the grouped
header emits one `<col>` per leaf column, the spacer header has an `aria-label`, and `Approved:` is recorded.

Both then move `RESOLVED → ALIGNED` once I-97 aligns the workplan.

## 12. References

| Reference | Use |
|---|---|
| `MDL/mdl-issues.md` §4 (I-95, I-96 rows), §6.1 (D36–D40), §7 (candidate issues) | issue text, decisions, gaps |
| `Dashboard-UI-Design-Spec.md` §7.2.1 / §7.2.5 / §7.2.8 / §7.2.9 / §7.2.13 / §7.2.14 | L3 requirements |
| `MDL/src/render.mjs:760-761, 119-126, 1322, 1328, 1342, 1659, 1984, 2021-2056, 2057-2130` | integration points |
| `harness-layout/SKILL.md`, `harness.mjs` (Tier 4) | verification harness |
| `MDL/test/test_pipeline.mjs`, `MDL/test/test_render.mjs` | regression suite |
| `AGENTS.md` §5.1, §5.2, §5.15, §15, §26 | process rules |
| `MDL/TWRP C3B2 - Master Document List.xlsx` | verification workbook |
