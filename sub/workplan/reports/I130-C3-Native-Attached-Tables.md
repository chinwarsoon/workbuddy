# TEST-037 — I130 C3 native attached tables

- **Date:** 2026-11-13
- **Author:** CodeBuddy (AI)
- **Issue:** I130
- **Workplan:** rev 3.06 planning → rev 3.07 implementation; §8.2 gate row 18
- **UI spec:** rev 1.73 in both byte-identical copies

## Scope

C3 Bar cards now keep one bar-plot CSS grid in row 1 and add one native
`<table class="c3-table" data-table-crosshair>` per card in row 2. Each table has a visually
hidden `<caption>`, a `<colgroup>`, `<thead>`, `<tbody>`, `scope`, and shared `data-col-id`
values. `.c3-card` carries `role="group"`. C3 CSS rules are scoped to `.c3-table` / `.c3-grid`.
The Pie view, the full-width `.c3-summary`, `breakdown-table.csv`, `c3Metrics`, hover payloads
and pipeline data are unchanged.

## Files verified

- `sub/engine/render.js` rev 0.20
- `sub/engine/dashboard.css` rev 2.16
- `sub/engine/dashboard.js` rev 2.9
- `sub/test/render.test.mjs` rev 0.22
- `harness-layout/checks/sub.mjs` rev 1.18
- `harness-layout/harness.mjs` rev 1.29
- `harness-layout/SKILL.md` rev 1.17
- `Dashboard-UI-Design-Spec.md` / `harness-layout/spec/Dashboard-UI-Design-Spec.md` rev 1.73
- `sub/ref/sample-c3-discipline-table.html`, `sub/ref/sample-c3-grid-lines.html`,
  `sub/ref/sample-c4.html`
- `sub/TWRP C3B2 - Document Submittal Dashboard.html` (generated)

## Results

| Check | Command | Result |
|---|---|---|
| Pipeline suite | `node test/pipeline.test.mjs` | **24 passed / 0 failed / 0 skipped** |
| Render suite | `node test/render.test.mjs` | **51 passed / 0 failed / 0 skipped** |
| Layout Tier 1 (themes) | `node harness.mjs --dashboard sub --tier 1` | **9 passed / 0 failed / 0 skipped** |
| Layout Tier 2 (shell / viewport) | `node harness.mjs --dashboard sub --tier 2` | **23 passed / 0 failed / 0 skipped** |
| Layout Tier 5 | `node harness.mjs --dashboard sub --tier 5` | **157 passed / 0 failed / 0 advisory / 2 skipped** |
| Layout Tier 6 | `node harness.mjs --dashboard sub --tier 6` | **2543 passed / 0 failed / 0 advisory / 0 skipped** |
| Standalone build | `node sub/build/standalone.mjs` twice | identical **394,772 bytes**; SHA256 `5E0BAD34FB197233C8958720CAA7D5D334B1364D87BD20F3D0D87F7797AB4296` |
| Spec copies | SHA256 of both active copies | identical **227,198 bytes**; SHA256 `7D9A33D801E23A3CDAFEA0D476F741A5246FE370AE972353D3F7015C7A6D6AF3` |
| Syntax | `node --check` on `render.js`, `dashboard.js`, `harness.mjs` | clean |
| Linter | changed files | 0 diagnostics |

The Tier 5 C3 native-table section passed:

- two Bar cards and two native attached tables;
- caption, colgroup, thead, tbody, `scope`, `data-col-id` and `role="group"`;
- header and value cells share the logical-column ids;
- bar and table column centres align within 2 px;
- hover highlights one row, one logical column, one intersection cell and the header column;
- hover classes clear on pointer leave.

## Notes and honest gaps

- The remaining Tier 5 skips are the pre-existing C3 `lintC3()` stale `.c3-board` selector and the
  Analytical page with no visible table. Neither is caused by I130.
- The `lintC3()` PNG / Copy probes still skip because of that separate stale selector. The export
  change is verified by source-level render tests (`table.querySelectorAll('tr')`,
  `withTransientTableHoverStripped(table, addTableText)`) and the rebuilt standalone HTML.
- No binary PNG image, clipboard text or PDF/print rendering was measured in this run.
- `breakdown-table.csv` code was not changed; the unchanged suites cover its existing behaviour.
- `git diff --check` reports trailing-whitespace warnings from earlier uncommitted changes. A direct
  scan of the files edited in this task found no trailing whitespace. No `git` commit and no push.

## Governance

Issue log rev 1.29 moves `I130` to `RESOLVED`. Update log rev 1.45 / U042 and test log rev 1.40 /
TEST-037 record the implementation. Workplan rev 3.07 marks CT-01–CT-07 and gate row 18 DONE.
