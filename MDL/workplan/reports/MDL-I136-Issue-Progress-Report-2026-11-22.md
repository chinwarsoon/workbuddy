# MDL I-136 — Issue Progress Conformance Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-22 | CodeBuddy (AI) | Final report for I-136. Records implementation, defects found during validation, verification and closure. |

## 1. Issue

I-136 records that the production Issue Progress panel did not meet the shared UI design spec. The
panel used fixed Y gridlines, an unwrapped legend, gated bar labels and a Y-max filter that kept bar
values when Bars was off. It had no C1 dual-handle time bar, no attached table and no chart hover
window. The dual-scale note, zone borders, header colours and crosshair styling were incomplete.

The issue is recorded in `MDL/mdl-issues.md` revision 1.59 and `MDL/log/issue_log.md` revision 1.17.

## 2. Basis

- Approved visual reference: `MDL/Arch/issue-progress-spec-review.html`.
- Workplan: `MDL/workplan/MDL-I136-Issue-Progress-Workplan.md`.
- Shared standard: `harness-layout/spec/Dashboard-UI-Design-Spec.md` §4.2, §4.6 and §7.2.16.
- Approval: P4, P5 and P6 approved 2026-11-22 by chinwarsoon.

## 3. Changes

### Phase 1 — chart geometry and axes

`MDL/src/render.mjs`:

- Replaced five fixed gridlines with nice ticks from `{1, 2, 2.5, 5} × 10^k`.
- Limited the chart to seven intervals.
- Moved the in-SVG legend above the plot and wrapped it into rows.
- Set a fixed 52 px right reserve in every scale mode.
- Coloured the right axis and its ticks in dual mode.
- Added dual-scale captions and legend axis attribution.
- Printed every non-zero bar value.
- Excluded bar values from `maxY` when Bars was off.
- Added hidden `.sc-hover-band` and `.chart-snap` elements for non-export SVG.

### Phase 2 — C1 time bar and attached table

`MDL/src/render.mjs`:

- Replaced the two labelled sliders with one dual-handle C1 time bar.
- Added one tick per reporting month and one fill between the two handles.
- Added presets `6M`, `12M`, `24M`, `YTD` and `All`.
- Stored the selected preset in `localStorage` under `mdl-ip-preset`.
- Added a native attached table with caption, column groups, headers, row headers and a right spacer column.
- Added scoped CSS for the C1 board, table, header colours and shared column state.
- Kept chart and table on one month index.

### Phase 3 — hover, crosshair, export and print

`MDL/src/render.mjs`:

- Added one `.chart-tip` hover window with pointer, touch and keyboard support.
- Added chart to table and table to chart column sync.
- Added `.col-on` to show the hidden chart band and snap line.
- Added `.col-active`, `.col-hover`, `.row-hover` and `.cell-hover` to table cells.
- Added `data-col-id` to attached-table month cells for the shared crosshair rule.
- Removed hover state from PNG, Copy and print output.
- Removed an invalid write to a nonexistent mode element found during the browser probe.

`MDL/MDL-Dashboard.html` was rebuilt from source. Final size: 296,804 B.

## 4. Defects found during validation

### P5 — attached table did not opt into the shared crosshair

Tier 5 of the layout harness failed the Progress page check. The new attached table had `data-c1col`
cells but no `data-col-id` cells. The fix added `data-col-id` to the month headers and body cells,
removed `.col-hover` in `curveClearCrosshair()`, and added scoped `.col-hover` CSS.

### P6 — runtime error in `curveDraw()`

The first Chromium probe found `TypeError: Cannot set properties of undefined (setting 'textContent')`
at both viewports. `curveDraw()` wrote to `st.modeEl`, but the state object had no member with that
name and no mode element was created. The fix deleted the two invalid writes. The dual-scale note and
SVG axis captions already show the scale state.

Both defects were raised as separate approval items. Neither was fixed inline.

## 5. Verification

| Check | Result |
|---|---|
| `node --check src/render.mjs` | PASS |
| Lint check on `MDL/src/render.mjs` | 0 diagnostics |
| `node build.mjs` | PASS, 296,804 B |
| `node test/test_pipeline.mjs` | 96 passed / 7 failed |
| `node test/test_shell.mjs` | Cannot start. Package `jsdom` is missing. |
| `node test/test_grid.mjs` | Cannot start. Package `jsdom` is missing. |
| Full layout harness with cached Playwright | 201 passed / 10 failed / 2 advisory / 22 skipped |
| Tier 5 layout harness | 36 passed / 0 failed / 0 advisory / 3 skipped |
| Chromium at 1366 × 768 | No console errors. Band width 64.7 px equals one table column. |
| Chromium at 1920 × 1080 | No console errors. Band width 106.5 px equals one table column. |
| Hover behavior | Table hover and chart hover show band, snap line and active column. |
| Print behavior | Print mode hides band and snap line. |
| Presets | `All` reports 31/31 months. `6M` reports 6/31 months. |

The pipeline result matches the recorded baseline. The full harness failure count is 10, lower than
the recorded baseline of 11. The pass and skip counts differ from the older baseline. An exact harness
inventory can be a separate task if one is required.

## 6. Residual notes

- I-121 remains open. This report closes only I-136.
- No shared spec or harness file changed.
- No project dependency was installed. The `jsdom` suites remain unavailable in this environment.
- The approved sample remains in `MDL/Arch/` as the visual reference.

## 7. Rollback

Restore `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, the workplan and the logs from Git, then rebuild
`MDL-Dashboard.html`. No data file or external system was changed.

## 8. Closure

I-136 is RESOLVED. The implementation, approved fixes, test evidence and log references are recorded in
`MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md` and `MDL/log/test_log.md`.
