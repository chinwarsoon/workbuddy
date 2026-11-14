# TEST-038 — I131 general chart ↔ attached-table column sync

- **Date:** 2026-11-14
- **Author:** CodeBuddy (AI)
- **Issue:** I131
- **Workplan:** rev 3.08 planning → rev 3.09 implementation; §8.2 gate row 19; CS-01–CS-07
- **UI spec:** rev 1.74 in both byte-identical copies

## Scope

Where a chart renders a native attached table in the same chart board and the columns share
the chart X positions, hovering a chart column MUST highlight the same logical column in BOTH
chart and table. Hovering an attached-table column MUST highlight the same logical column in
BOTH table and chart. The state is transient, scoped to the owning chart card, cleared on
pointer leave / blur / Escape / repaint / print, and stripped from PNG / Copy / print.

C1 keeps its `data-c1col` / `.sc-hover-band` / snap line / `.col-active` path as the reference
implementation. C3 Bar cards now share `data-col-id` across `.g-bar`, dimension headers and
value cells and use ONE `.col-active` state per `.c3-card`. C3 Pie, `.c3-summary`,
`breakdown-table.csv`, C2 Funnel, C4, KPI cards, the MDL dashboard and bounded `.ds-table`s
stay out of scope.

## Files verified

- `Dashboard-UI-Design-Spec.md` / `harness-layout/spec/Dashboard-UI-Design-Spec.md` rev 1.74
- `sub/engine/render.js` rev 0.21
- `sub/engine/dashboard.css` rev 2.17
- `sub/engine/dashboard.js` rev 2.10
- `sub/test/render.test.mjs` rev 0.23
- `harness-layout/checks/sub.mjs` rev 1.19
- `harness-layout/harness.mjs` rev 1.30
- `harness-layout/SKILL.md` rev 1.18
- `harness-pipeline/docs/UI-SPEC-COMPLIANCE-REVIEW.md`
- `sub/ref/sample-c3-discipline-table.html`, `sub/ref/sample-c3-grid-lines.html`,
  `sub/sample-c1-table.html`, `sub/sample-c4.html`
- `sub/TWRP C3B2 - Document Submittal Dashboard.html` (generated)

## Results

| Check | Command | Result |
|---|---|---|
| Pipeline suite | `node test/pipeline.test.mjs` | **24 passed / 0 failed / 0 skipped** |
| Render suite | `node test/render.test.mjs` | **52 passed / 0 failed / 0 skipped** |
| Layout Tier 1 (themes) | `node harness.mjs --dashboard sub --tier 1` | **9 passed / 0 failed / 0 skipped** |
| Layout Tier 2 (shell / viewport) | `node harness.mjs --dashboard sub --tier 2` | **23 passed / 0 failed / 0 skipped** |
| Layout Tier 5 | `node harness.mjs --dashboard sub --tier 5` | **167 passed / 0 failed / 0 advisory / 2 skipped** |
| Layout Tier 6 | `node harness.mjs --dashboard sub --tier 6` | **2543 passed / 0 failed / 0 advisory / 0 skipped** |
| Standalone build | `node sub/build/standalone.mjs` twice | identical **401,954 bytes**; SHA256 `E5B0F4554F28CE0E905E84238D00F9AEE65BF63E99D4F4CDC3D2CACAFDE19C5C` |
| Spec copies | SHA256 of both active copies | identical **232,785 bytes**; SHA256 `FD257D78C9F977F7A6D3D79F1D458A6FFE7D7CEB7D52E3ABB63C7E5406677D0B` |
| Syntax | `node --check` on `render.js`, `dashboard.js`, `harness.mjs`, `checks/sub.mjs` | clean |
| Linter | changed files | 0 diagnostics |

Tier 5 rose from the `I130` baseline of 157 passed to **167 passed**. The 10 new checks come
from `lintC3ColumnSync()` (9) and the added `lintC3NativeTable()` `.col-active` assertion (1).
The new section passed:

- bar hover sets ONE shared column id and highlights the bar, header and value cells;
- table hover sets the SAME shared column id and highlights the matching chart bar;
- the second C3 card stays independent;
- the floating `.chart-tip` window stays closed over the attached table;
- no competing `.col-hover` is applied in either direction;
- pointer leave clears every chart-linked `.col-active` node.

`lintC3NativeTable()` now measures `.col-active` on C3 tables instead of `.col-hover`.
`lintTableCrosshair()` treats C3 as chart-linked, so C1 and C3 keep `.col-active` while generic
tables keep `.col-hover`. Tier 6 stayed at 2543 / 0 / 0 / 0, so the C1 and hover-window
regression behaviour did not change.

## Notes and honest gaps

- The two Tier 5 skips are unchanged and pre-existing: the stale `lintC3()` `.c3-board`
  selector and the Analytical page with no visible table. Neither is caused by I131.
- The `lintC3()` PNG / Copy probes still skip because of the same stale selector. Export
  stripping is verified by source-level render tests and by the rebuilt standalone HTML.
- No binary PNG image, clipboard text or PDF/print rendering was measured in this run.
- The two C3 review samples carry a small inline demo binder. It mirrors the production
  pattern for review only; it is not a second implementation in the dashboard.
- `harness-layout/log/*` has no I131 entry. The workplan rev 3.08 excludes that gap and it
  needs a separate owner decision.
- `git diff --check` reports trailing-whitespace warnings from earlier uncommitted changes.
  No `git` commit and no push were made.

## Governance

Issue log rev 1.31 moves `I131` to `RESOLVED`. Update log rev 1.46 / U043 and test log rev
1.41 / TEST-038 record the implementation. `knowledge.json` is version 2.34.0 with revision
2.34. Workplan rev 3.09 marks CS-01–CS-07 and gate row 19 DONE.
