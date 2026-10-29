# Wave 18 — Submittals Panel, Drill Cell, and Column Chooser Report

| Field | Value |
|---|---|
| Title | TWRP C3B2 Submittal Dashboard — Wave 18 Submittals panel, drill cell and column chooser |
| Document ID | SUB-REPORT-W18-001 |
| Revision | 1.0 |
| Date | 2026-10-29 |
| Author | CodeBuddy (AI) |
| Status | ✅ COMPLETE |
| Related | Workplan §7 Wave 18 (T18.1–T18.7), revision 2.48; `issue_log.md` I068–I070; `update_log.md` 1.25; `test_log.md` 1.18; spec §4.4 (1.40–1.41), §7.1 (1.42) |

## Index
- [Objective and scope](#objective-and-scope)
- [Methodology and environment](#methodology-and-environment)
- [Changes](#changes)
- [Test cases and results](#test-cases-and-results)
- [Success criteria](#success-criteria)
- [Files modified](#files-modified)
- [Recommendations](#recommendations)
- [Lessons learned](#lessons-learned)

## Objective and scope

Close Wave 18. T18.1–T18.5 delivered the one-row-per-document Submittals panel (I068). This wave end
also fixes two defects found by owner review:

- **I069** — a clipped ellipsis (two dots) painted after the drill chevron in every Submittals row.
- **I070** — the column-visibility chooser did not follow §7.1 B7, and the global filter state did not
  match the data on load.

Scope covers `render.js`, `dashboard.js` and `dashboard.css`, the standalone bundle, both spec copies,
and the workplan and logs.

## Methodology and environment

- Engine: `node --test` over `test/pipeline.test.mjs` and `test/render.test.mjs`.
- Source workbooks: `TWRP C3B2 - Master Document List.xlsx` and `TWRP C3B2 - Document Submittal Log.xlsx`.
- Browser: Playwright Chromium against the standalone HTML on `file://`, with both workbooks loaded
  through `window._loadFiles`. Throwaway probes were deleted after the run.
- Bundle: `node build/standalone.mjs` after every engine or stylesheet edit.

## Changes

- **T18.6 — drill cell (I069, `dashboard.css`)**. `.drill-cell` (specificity 0,1,0) lost the cascade to
  `.ds-table th, .ds-table td` (0,1,1), so it kept `text-overflow:ellipsis` and 10 px padding. The
  24 px `.drill-btn` overflowed the cell, and Chromium painted a clipped ellipsis. The rule is now
  `.ds-table .drill-cell{…padding:0 4px;overflow:hidden;text-overflow:clip}`. The spec's 4 px padding
  applies for the first time, so the chevron moved 6 px toward the column center.
- **T18.7a — chooser (I070, `render.js`)**. One shared `columnChooser(key, headers, chosen, open)`
  builder serves every table. Contents follow the §7.1 order: `All columns` master, note, 1 px
  divider, item list, footer with `Reset to defaults` and `N hidden`. Pinned identity columns are
  listed, ticked and `disabled`, not omitted. The trigger carries `.cc-btn` and `aria-expanded`.
- **T18.7b — chooser state (I070, `dashboard.js`, `dashboard.css`)**. `syncColumnControls()` sets the
  tri-state master and the hidden count after every render. A tick sets `state.openChooser`, so the
  panel stays open. An outside click (document-level listener, any target) and `Escape` close it. The
  panel is 380 px, and only `.cc-list` scrolls.
- **T18.7c — filter selection semantics (I070, `dashboard.js`, `render.js`, spec §7.1 rev 1.42)**.
  `buildFilterDimensions()` + `applyDefaultFilters()` tick all five dimensions from the data on load.
  Blank cells are listed as `(blank)` and compared blank-safely. An empty tick set now filters every
  row out. Only an absent set means "no filter". The master is tri-state. Recorded as D42.

## Test cases and results

| Case | Scope | Result |
|---|---|---|
| Pipeline suite | `test/pipeline.test.mjs` | ✅ 18/18 pass |
| Render suite | `test/render.test.mjs` | ✅ 20/20 pass |
| I069 drill cell | Chromium measured style | ✅ `textOverflow:"clip"`, `clientWidth:32`, `scrollWidth:32`, `overflows:false` (was `ellipsis` / 53) |
| I069 header cell | Chromium measured style | ✅ `clip` |
| I070 regions | Chromium DOM | ✅ master, note, divider, list, footer all present |
| I070 pinned rows | Chromium DOM | ✅ 2 rows, ticked and `disabled`; 5 free rows |
| I070 panel metrics | Chromium computed style | ✅ `max-height:380px`; `.cc-list` `overflow:auto` |
| I070 tick behaviour | Chromium interaction | ✅ panel stays open; count `0→1→2 hidden`; master indeterminate |
| I070 master and reset | Chromium interaction | ✅ `All columns` and `Reset to defaults` restore `0 hidden`, master checked |
| I070 outside click / Escape | Chromium interaction | ✅ panel closes; `aria-expanded="false"` |
| Filters at load | Chromium state | ✅ Discipline 10/10, Stage 9/12 indeterminate, Status 3/3, Approval 6/6, Submitter 16/16 |
| Empty tick set | Chromium state | ✅ Discipline all off → badge `0`, 0 rows (was 133); all on → 10/10 |
| Harness Tier-1/3 | `harness-layout` | ⏸ not run |

## Success criteria

- No truncation mark in the drill cell; the button fits its content box. ✅
- The chooser passes every §7.1 B7 and floating-panel-order rule, read against the menu-bar
  Discipline filter. ✅
- The filter panel and the painted rows agree at load and after every change. ✅
- Both suites pass and the standalone bundle is rebuilt. ✅
- Spec, workplan, issue log, update log and test log all record the two defects. ✅

## Files modified

- `sub/engine/render.js` — `columnChooser`, blank-safe comparisons, empty-set semantics.
- `sub/engine/dashboard.js` — dimension builder, `applyDefaultFilters`, tri-state master,
  `syncColumnControls`, `closeColumnChoosers`, outside click, `Escape`, chooser handlers.
- `sub/engine/dashboard.css` — `.ds-table .drill-cell`, 5-region chooser.
- `sub/TWRP C3B2 - Document Submittal Dashboard.html` — rebuilt (259,121 B).
- `Dashboard-UI-Design-Spec.md` — §4.4 revisions 1.40–1.41; §7.1 revision 1.42; checklist row 17.
- `harness-layout/spec/Dashboard-UI-Design-Spec.md` — same, re-synced.
- `sub/workplan/Sub-Dashboard-Workplan.md` — revision 2.48, T18.6–T18.7, D42.
- `sub/log/issue_log.md` — 0.63, 0.64, I069, I070.

## Recommendations

1. Move the drill-cell and chooser rules into the harness layout check, so a future cascade loss or a
   missing chooser region fails a check instead of waiting for an owner screenshot.
2. Record the `.ds-table .drill-cell` specificity requirement in the spec's §7.2 table section too, so
   new cell classes cannot silently lose to the base cell rule.
3. Run harness Tier-1/3 before the next owner review; Wave 18 shipped without it.

## Lessons learned

- A declaration that is correct in isolation can still lose the cascade. Measure the computed style, do
  not read the rule.
- "Empty set means no filter" was invisible while only two dimensions were initialised. Once all five
  were, the rule surfaced as a real defect. State models need a single, stated meaning.
- One shared builder removed three diverging copies of the chooser in one step.
