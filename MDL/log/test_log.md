# MDL Dashboard — Test Log

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.27 | 2026-11-25 | CodeBuddy | **TL030** added for I-150 chart-to-table column center alignment and live center measurement. |
| 1.26 | 2026-11-24 | CodeBuddy | **TL029** added for I-149 shared table-header design and live colour comparison. |
| 1.25 | 2026-11-24 | CodeBuddy | **TL028** added for I-148 CSV action, Y-axis caption typography and the live CSV download. |
| 1.24 | 2026-11-24 | CodeBuddy | **TL027** added for I-147 board gap / fit / header fill and the new harness board-contract tier. |
| 1.23 | 2026-11-24 | CodeBuddy | **TL026** added for the I-146 two-row chart head, general spec requirement rev 1.102. |
| 1.22 | 2026-11-23 | CodeBuddy | **TL025** added for the I-145 time-bar fill alignment fix, including live-browser geometry measurement. |
| 1.21 | 2026-11-23 | CodeBuddy | **TL024** added for the rev 1.101 reference-alignment verification of the MDL time bar. |
| 1.20 | 2026-11-23 | CodeBuddy | **TL023** added for the full harness layout verification of the I-137…I-143 build, including the HEAD-build baseline comparison. |
| 1.19 | 2026-11-23 | CodeBuddy | **TL022** added for I-137…I-143 Issue Progress panel verification. |
| 1.18 | 2026-11-22 | CodeBuddy | **TL021** added for I-136 Issue Progress conformance verification. |
| 1.17 | 2026-11-21 | CodeBuddy | **TL020** added for I-135 sidebar toggle behavior verification. |
| 1.16 | 2026-11-21 | CodeBuddy | **TL019** added for I-134 matrix table border and corner verification. |
| 1.15 | 2026-11-21 | CodeBuddy | **TL018** added for harness revision 1.39 table border and corner checks. |
| 1.14 | 2026-11-21 | CodeBuddy | **TL017** added for I-133 corrected border verification. |
| 1.13 | 2026-11-21 | CodeBuddy | **TL016** added for I-133 MDL tool gap and single-border verification. |
| 1.12 | 2026-11-21 | CodeBuddy | **TL015** added for I-133 universal tool-row gap spec verification. |
| 1.11 | 2026-11-21 | CodeBuddy | **TL014** added for I-132 matrix tool row alignment verification. |
| 1.10 | 2026-11-21 | CodeBuddy | **TL013** added for I-131 fixed tooltip label column verification. |
| 1.9 | 2026-11-21 | CodeBuddy | **TL012** added for I-130 hover-window value alignment verification. |
| 1.8 | 2026-11-21 | CodeBuddy | **TL011** added for I-129 KPI hover window verification. Tier 6 config added and selector made generic. |
| 1.7 | 2026-11-21 | CodeBuddy | **TL010** added for I-128 footer metadata and version verification. |
| 1.6 | 2026-11-20 | CodeBuddy | **TL009** added for I-127 status-bar verification. Harness Tier 3 status check updated. |
| 1.5 | 2026-11-20 | CodeBuddy | **TL008** added for I-126 crosshair colour verification. |
| 1.4 | 2026-11-20 | CodeBuddy | **TL007** added for I-124 and I-125 table conformance verification. |
| 1.3 | 2026-11-20 | CodeBuddy | **TL006** added for I-123 matrix full-width and no-scrollbar verification. |
| 1.2 | 2026-11-20 | CodeBuddy | **TL005** added for U003 shell geometry and warning bar verification. TL004 note corrected. |
| 1.1 | 2026-11-20 | CodeBuddy | **TL004** added for I-122 vertical-scroll verification. |
| 1.0 | 2026-11-20 | CodeBuddy | Initial canonical test log. Records TL001–TL003 for the rev 1.96 shell increment. |

## TL001 — Pipeline and grid baseline and final run

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Commands | `node test/test_pipeline.mjs`; `node test/test_grid.mjs` |
| Result | Pipeline: 96 passed / 7 failed. Grid: 42 passed / 1 failed. |
| Baseline | The same results were recorded before and after the shell increment. |
| Finding | No regression from this increment. The failures are pre-existing workbook-data and shared-spec failures. |
| Issues | I-119, I-120 remain open. I-121 records the remaining UI gaps. |

## TL002 — Full render suite

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Command | `node --max-old-space-size=8192 test/test_render.mjs` |
| Result | Not completed. Node reported `FATAL ERROR: Ineffective mark-compacts near heap limit` after about 503 s. |
| Baseline | The same failure occurred before the shell increment. The full workbook render is too large for jsdom in this environment. |
| Finding | No usable result from this suite. The new assertions in `test_render.mjs` are unverified by this run. |
| Workaround | TL003 uses a synthetic model and stubs only the heavy panel renderers. |

## TL004 — I-122 vertical-scroll verification

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl --tier 2` |
| Result | Syntax PASS. Build PASS (262,277 B). Shell suite 23 passed / 0 failed. Harness Tier 2: 50 passed / 3 failed. |
| New checks | 25 harness checks: five pages × five assertions. All 25 passed. Three added shell CSS assertions passed. |
| Geometry failures | `left sidebar and content end at the status bar`; `HTML and body fill viewport with page scrolling disabled`; `warning area stays inside content width`. These failed during I-122 verification. I did not verify an older baseline. U003 fixed them. |
| Finding | The content body scrolls on every MDL page. Warning and filter strips remain outside the scrolling body. |

## TL005 — U003 shell geometry and warning bar verification

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl --tier 2` |
| Result | Syntax PASS. Build PASS (261,484 B). Shell suite 28 passed / 0 failed. Harness Tier 2: 53 passed / 0 failed. |
| New checks | Five new shell assertions cover the grid rows, hidden page scroll, in-flow status bar, in-flow warning bar, and removed padding workaround. |
| Finding | The three geometry failures from TL004 no longer occur. The content body stays the only scroll area. |

## TL030 — I-150 chart-to-table column center verification

| Field | Value |
|---|---|
| Date | 2026-11-25 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node test/test_pipeline.mjs`; `node test/test_grid.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl`; Playwright live center measurement and PNG download |
| Result | Syntax PASS. Build PASS at 302,450 B. Shell **111 passed / 0 failed** (one new I-150 check). Pipeline 96 passed / 7 failed and grid 42 passed / 1 failed at baseline. Harness **219 passed / 10 failed / 2 advisory / 22 skipped** — one new passing center check; 10 failures byte-identical to baseline. |
| Live | At 1440 px, `All` window, 31 months: SVG `viewBox` 451, rendered width 451, scale 1. Center offset chart minus table: column 0 `+0.02 px`, column 15 `+0.23 px`, column 30 `+0.16 px`. Before the fix the offsets were `+0.67 / +20.42 / +39.99 px`. PNG download `TWRP-C3B2_Issue-Progress_2026-11-25.png`. |
| Finding | The harness center probe hovers each month header and transforms the band center through `getScreenCTM()`. It uses the rendered geometry, not the `viewBox` units. No assertion was weakened. |
| Issues | I-150 RESOLVED with owner approval 2026-11-25. Spec copies byte-identical at SHA-256 `48DE0BE7D04E5DFCD88AADB9EFE270E3407964C4F6057EEB4417423080B9ECDB`. |

## TL029 — I-149 shared table-header design verification

| Field | Value |
|---|---|
| Date | 2026-11-24 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node test/test_pipeline.mjs`; `node test/test_grid.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl`; Playwright live colour measurement |
| Result | Syntax PASS. Build PASS at 302,295 B. Shell **110 passed / 0 failed**. Pipeline 96 passed / 7 failed and grid 42 passed / 1 failed at baseline. Harness **218 passed / 10 failed / 2 advisory / 22 skipped** — 10 failures byte-identical to the I-148 baseline, all seven attached-table board checks pass. |
| Live | `--navy` resolves to `rgb(15, 45, 82)`. Attached table `.curve-c1-table thead th.g-axis`: fill `rgb(15, 45, 82)`, text `rgb(255, 255, 255)`, weight 600. Independent `table.ds-table thead th`: fill `rgb(15, 45, 82)`, text `rgb(255, 255, 255)`, weight 700. Fill and text now match. |
| Finding | The first harness run stopped with `ReferenceError: c is not defined`: the header assertion used the evaluate-scope name `c` after leaving `page.evaluate`. It was changed to the config variable `s`. No test threshold was weakened. |
| Issues | I-149 RESOLVED with owner approval 2026-11-24. Spec copies byte-identical at SHA-256 `FBBEF9EE5FB513EB12CC5B70FDF77DF7A235B2264E394AF3891FC2AC4BD16646`. |

## TL028 — I-148 CSV action and Y-axis caption verification

| Field | Value |
|---|---|
| Date | 2026-11-24 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node test/test_pipeline.mjs`; `node test/test_grid.mjs`; `node harness.mjs --dashboard mdl`; Playwright live measurement and a real CSV download |
| Result | Syntax PASS. Build PASS at 302,241 B. Shell **110 passed / 0 failed** (four new I-148 checks). Pipeline 96 passed / 7 failed and grid 42 passed / 1 failed at baseline. Harness **218 passed / 10 failed / 2 advisory / 22 skipped** — one new passing CSV-order check; 10 failures byte-identical to HEAD baseline. |
| Live | Caption offset 0 px from gutter centre, 3 px inset, `writing-mode:vertical-rl`, 180° transform, `font-weight:700` on caption and ticks, both `--text2` = `rgb(71,85,105)`. Screenshot `harness-layout/run-mdl-i148-ycap.png`. CSV: `⤓ CSV` present, visible and before PNG; download `TWRP-C3B2_Issue-Progress-Table_2026-11-24.csv`, UTF-8 BOM, 7 lines (header + six metric rows), month headers from the selected window. |
| Finding | First live run showed computed weight 400 because the `font:` shorthand with `var(--font-ui)` did not apply; explicit `font-family` / `font-size` / `font-weight` properties fixed it and were re-verified. Two static shell assertions were corrected to match exact serializer source text, not weakened. |
| Issues | I-148 RESOLVED with owner approval 2026-11-24. Spec copies byte-identical at SHA-256 `10B2618DA63ABC43F4B763E657F6B88731DA176895B14F0E6E9C261B2F0E5945`. |

## TL027 — I-147 attached-table board contract verification

| Field | Value |
|---|---|
| Date | 2026-11-24 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node test/test_pipeline.mjs`; `node test/test_grid.mjs`; `node harness.mjs --dashboard mdl`; Playwright live measurement at 1280 px and a 2× header crop at 1600 px |
| Result | Syntax PASS. Build PASS at 301,109 B. Shell **106 passed / 0 failed** (six new I-147 checks plus the updated I-147 corner check). Pipeline 96 passed / 7 failed and grid 42 passed / 1 failed, both at baseline. Harness **217 passed / 10 failed / 2 advisory / 22 skipped** — six new passing board-contract checks; the 10 failures are byte-identical to the HEAD baseline set. |
| Live layout | Gap plot → table 10 px; host `clientWidth = scrollWidth = 477 px`; grid `min-width:0`; `c1-many` active with `writing-mode:vertical-rl`, header height 88 px, 32 month headers; header fill `rgb(241,245,249)` = `--surface2`. Screenshots `harness-layout/run-mdl-i147-board.png` and `run-mdl-i147-header-zoom.png`. |
| Finding | The 1280 px thumbnail initially looked clipped; the 2× crop at 1600 px showed clean vertical labels. No further change. The old I-142 check pinned the square shared corner and failed after the gap was introduced; it was updated to the rounded non-shared corner required by rev 1.103, not weakened. |
| Issues | I-147 RESOLVED with owner approval 2026-11-24. Spec copies byte-identical at SHA-256 `8EF6A9CE7BE04E74F657437F6FD59436769A38497C69B4FE21B42D326A27926F`. |

## TL026 — I-146 two-row chart head verification

| Field | Value |
|---|---|
| Date | 2026-11-24 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node test/test_pipeline.mjs`; `node test/test_grid.mjs`; `node harness.mjs --dashboard mdl`; Playwright measurement of the built dashboard with the real workbook |
| Result | Syntax PASS. Build PASS at 300,395 B. Shell **101 passed / 0 failed** (six new I-146 checks). Pipeline 96 passed / 7 failed and grid 42 passed / 1 failed, both at baseline. Harness 211 passed / 10 failed / 2 advisory / 22 skipped, with the 10 failures byte-identical to the HEAD baseline set. |
| Live layout | Card children: tool row → time bar row → chart host. Tool row above and right-aligned; time bar row full width with order `Period → track → chips → date range`. Tool row → time bar row 10 px; time bar row → chart top border 2 px. No project-start caption. Print: tool row / track / chips hidden, period text visible. Screenshot `harness-layout/run-mdl-i146-two-row.png`. |
| Finding | The general rev 1.102 chart-head requirement is satisfied in MDL. A first live run exposed the global `.toolbar{margin-bottom:6px}` still adding 6 px to the chart gap; the scoped `margin-bottom:0` fix was applied and re-verified. |
| Issues | I-146 RESOLVED with owner approval 2026-11-24. Spec copies byte-identical at SHA-256 `4F924B04BEC922B190D90CEF1EB12027C840526054C42B0502BE07ACF82008E5`. |

## TL025 — I-145 time-bar fill alignment verification

| Field | Value |
|---|---|
| Date | 2026-11-23 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node test/test_pipeline.mjs`; `node test/test_grid.mjs`; Playwright measurement scripts against the built dashboard with the real workbook (kept as screenshots, scripts deleted after the run) |
| Result | Syntax PASS. Build PASS at 300,479 B. Shell 95 passed / 0 failed (new sibling-order regression check included). Pipeline 96 passed / 7 failed and grid 42 passed / 1 failed, both at baseline. |
| Live geometry | `All` window: fill top 302.5 px equals track top; fill height 4 px; computed left 7 px and width 206 px match the pinned thumb-compensated formula for from=0, to=30. `12M` window (19..30 of 31): fill left 1023.42 px vs expected 1023.44 px; right edge 1098.95 px vs expected 1098.97 px. Both within 0.02 px. Screenshots: `harness-layout/run-mdl-i145-fix.png`, `harness-layout/run-mdl-i145-fix-12m.png`. |
| Finding | The highlighted period is now in line with the two thumbs, as §4.2 rev 1.101 requires. The defect existed only in the I-144 build (fill nested inside the 4 px track element); the Sub reference DOM already places the fill in the zone. |
| Issues | I-145 RESOLVED with owner approval 2026-11-23. |

## TL024 — Rev 1.101 reference-alignment verification of the MDL time bar

| Field | Value |
|---|---|
| Date | 2026-11-23 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node test/test_pipeline.mjs`; `node test/test_grid.mjs`; `node harness.mjs --dashboard mdl` |
| Result | Syntax PASS. Build PASS at 300,479 B. Shell 94 passed / 0 failed. Pipeline 96 passed / 7 failed. Grid 42 passed / 1 failed. Harness 211 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to the HEAD-build baseline. |
| New checks | Ten source checks cover the rev 1.101 alignment: shared `--seg-*` tokens, navy active fill with the full B2.1 state set, pinned track and fill geometry, solid thumbs with ring and grab cursor, in-track ticks with January year labels, window-interior tick semantics, thumb-compensated positioning, explicit `step="1"`, the current-`to` preset anchor, the Sub cluster composition and the `Month – Month` period text. The existing runtime checks (shared binder, C1 table binder, panel smoke test) still pass unchanged. |
| Finding | The panel renders without error and all new checks pass. Pipeline, grid and harness results equal the recorded baselines, so the redesign introduced no regression. |
| Issues | I-144 is RESOLVED with owner approval 2026-11-23. The recorded run output is kept as `harness-layout/run-mdl-i144.txt`. |

## TL023 — Full harness layout verification of the I-137…I-143 build

| Field | Value |
|---|---|
| Date | 2026-11-23 |
| Commands | `node harness.mjs --dashboard mdl` three times: against the HEAD build (`git show HEAD:MDL/MDL-Dashboard.html`, byte-exact), against the new I-143 build before the harness fix, and against the new build after the harness fix. Output kept as `harness-layout/run-mdl-baseline-head.txt`, `run-mdl-i143.txt` and `run-mdl-i143-v2.txt`. |
| Result | HEAD-build baseline: 201 passed / 10 failed / 2 advisory / 22 skipped — identical to the recorded TL021 baseline. New build before the harness fix: 210 passed / 12 failed / 2 advisory / 22 skipped. New build after the harness fix: 211 passed / 10 failed / 2 advisory / 22 skipped. |
| Finding | The I-137…I-143 fixes turned 9 previously failing checks into passes (Tier 5 C1 geometry: reference band, legend insets, gutter caption, no SVG X labels and related assertions). Two new failures appeared on the Progress page crosshair checks. The probe proved the panel behaviour is spec-correct (`colActive:7, colHover:0`, one row and one intersection cell); the harness took the generic-table path because it recognised chart-linked tables only by the exact classes `c1-table` / `c3-table`. This is a harness detection gap, not a dashboard defect. Fixed as harness-layout `I006` / `U008` with a config-gated `chartLinkedClass: 'curve-c1-table'` in `checks/mdl.mjs`; the check now takes the §7.2.16 chart-linked path (`colActive > 0 && colHover === 0`) and passes. |
| Issues | The 10 remaining failures are byte-for-byte the HEAD-baseline failure set: two Tier 1 shell-marker checks, the I-119 KPI `totalPlanned` and `ICA` filter data mismatches, and six I-95 grid resize failures. None is caused by this change. |

## TL022 — I-137…I-143 Issue Progress panel verification

| Field | Value |
|---|---|
| Date | 2026-11-23 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node test/test_pipeline.mjs`; `node test/test_grid.mjs`; lint check on the edited files |
| Result | Syntax PASS. Build PASS at 298,581 B. Shell 84 passed / 0 failed. Pipeline 96 passed / 7 failed. Grid 42 passed / 1 failed. Lint 0 diagnostics. |
| New checks | Fourteen source checks cover I-137 to I-143: reserved reference band, legend insets, gutter ticks, one caption, no SVG X labels, preset default, handle attributes, index ticks, wide nowrap, print text, blue chip token, shared binder, plot background, chart tap and ARIA, gradients and token resolution. Two runtime checks confirm the shared binder still highlights and clears generic tables. Six runtime checks render the real Issue Progress panel with a six-month synthetic model and confirm gutter ticks, gradients, area paths, one caption, the shared binder and handle attributes. Two more runtime checks confirm that the C1 table highlights and clears through the shared binder. |
| Finding | The panel renders without error. All new checks pass. Pipeline and grid results equal the recorded baseline. The full-workbook `test_render.mjs` remains unrun because it exceeds the sandbox memory limit. |
| Issues | I-137, I-138, I-139, I-140, I-141, I-142 and I-143 are RESOLVED with owner approval 2026-11-23. |

## TL021 — I-136 Issue Progress conformance verification

| Field | Value |
|---|---|
| Date | 2026-11-22 |
| Commands | `node --check src/render.mjs`; lint check on `MDL/src/render.mjs`; `node build.mjs`; `node test/test_pipeline.mjs`; `node test/test_shell.mjs`; `node test/test_grid.mjs`; cached-Playwright harness run for MDL, full and Tier 5; Chromium probe at 1366 × 768 and 1920 × 1080 |
| Result | Syntax PASS. Lint PASS. Build PASS at 296,804 B. Pipeline 96 passed / 7 failed. Full harness 201 passed / 10 failed / 2 advisory / 22 skipped. Tier 5 36 passed / 0 failed / 0 advisory / 3 skipped. Chromium probe: no console errors at either viewport. |
| New checks | The browser probe checks initial preset, band width against one table column, band and snap line computed display before and after table hover and chart hover, print suppression, and the `All` and `6M` preset ranges. The harness Progress-page crosshair check now passes. |
| Finding | The band width equals one table column at both viewports. Hover shows the active column in chart and table. Print hides band and snap line. `All` reports 31/31 months and `6M` reports 6/31 months. The shell and grid suites cannot start because `jsdom` is missing. I did not install it. |
| Issues | I-136 closed. P5 fixed the new shared-crosshair defect. P6 removed the new runtime error. The remaining harness failures are outside this change. |

## TL020 — I-135 sidebar toggle behavior

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check harness.mjs`; `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node harness.mjs --dashboard mdl --tier 2`; `node harness.mjs --dashboard mdl --tier 3`; `node harness.mjs --dashboard mdl --tier 6`; Chromium sidebar probe |
| Result | Syntax PASS. Build PASS (275,103 B). Shell suite 60 passed / 0 failed. Tier 2 reports 52 passed / 0 failed. Tier 6 reports 27 passed / 0 failed / 0 advisory / 0 skipped. |
| New checks | Tier 2 clicks the sidebar toggle and checks sidebar hiding, content width, panel widths, and toggle label. Shell suite adds one collapsed-grid assertion. |
| Finding | Chromium probe gives `160px 1120px` before, `1280px` after, and restores `160px 1120px`. Toggle labels are `Collapse left sidebar` and `Expand left sidebar`. Tier 3 still reports the pre-existing I-95 sample-check failures. |

## TL019 — I-134 matrix table border and corners

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node harness.mjs --dashboard mdl --tier 4` |
| Result | Syntax PASS. Build PASS (275,105 B). Shell suite 59 passed / 0 failed. MDL Tier 4: 71 passed / 6 failed / 2 advisory / 14 skipped. |
| New checks | Four shell assertions cover tool-row order, card border, panel border, and token padding. Harness rev 1.39 border and corner checks pass. |
| Finding | The six Tier 4 failures are the pre-existing I-95 resize-grip checks. The two new table chrome checks now pass. |

## TL018 — Harness table border and corner checks

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check harness.mjs`; `node harness.mjs --dashboard mdl --tier 4`; `node harness.mjs --dashboard sub --tier 4` |
| Result | Syntax PASS. MDL Tier 4: 70 passed / 7 failed. New failure: `split-header #0 [matrixHead]: one visible outer border on the table wrapper`. Sub Tier 4 did not run because the local server on port 8765 was not available. |
| New checks | Tier 4c now asserts one visible outer border on either the split card or the table, and rounded outer corners on both top corners with a clipped container. |
| Finding | The new border assertion catches the current matrix card `border:0`. The corner assertion passes because the card still reports a 10 px radius. |

## TL017 — I-133 corrected border verification

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; Chromium border probe; `node harness.mjs --dashboard mdl --tier 6` |
| Result | Syntax PASS. Build PASS (275,082 B). Chromium probe: `#matrixPanel` `1px solid`, `.matrixcard` `0px none`. Shell suite 59 passed / 0 failed. Tier 6: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| New checks | Shell assertions now require the panel border and reject the matrix card border. Token gap and padding checks stay. |
| Finding | The first fix removed the panel border and kept the card border. This correction reverses those two border decisions and keeps the tool-row token work. |

## TL016 — I-133 tool gaps and single matrix border

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node harness.mjs --dashboard mdl --tier 6` |
| Result | Syntax PASS. Build PASS (275,142 B). Shell suite 58 passed / 0 failed. Tier 6: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| New checks | Four shell assertions cover token definitions, token gaps, matrix tool-row padding, and the flat matrix panel. |
| Finding | The matrix panel no longer draws the panel border. The rounded `.matrixcard` border is the only visible border around the tool row and table. |

## TL015 — I-133 universal tool-row gap spec

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | Spec hash check on both `Dashboard-UI-Design-Spec.md` copies |
| Result | PASS. Both copies have the same SHA-256 hash. |
| New checks | None in MDL code. The matrix double border stays OPEN. |
| Finding | Spec rev 1.99 makes tool-row padding and group gaps universal. No MDL file changed in this update. |

## TL014 — I-132 matrix tool row alignment

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node harness.mjs --dashboard mdl --tier 6` |
| Result | Syntax PASS. Build PASS (275,012 B). Shell suite 54 passed / 0 failed. Tier 6: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| New checks | Four shell assertions cover card placement, right-aligned actions, the left filter group, and exclusion from the panel head. |
| Finding | The first card-placement assertion failed because the built source puts the two card elements on separate lines. The regex now allows the line break. |

## TL013 — I-131 fixed tooltip label column

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node harness.mjs --dashboard mdl --tier 6`; Chromium layout probe for label width |
| Result | Syntax PASS. Build PASS (275,019 B). Shell suite 50 passed / 0 failed. Tier 6: 27 passed / 0 failed / 0 advisory / 0 skipped. Layout probe: 76 px label and value start x=92 for all four labels. |
| New checks | Three shell assertions now expect the 76 px fixed column. |
| Finding | The `auto` column in I-130 gave each row a different value start. The fixed column aligns all values. |

## TL012 — I-130 hover-window value alignment

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `node harness.mjs --dashboard mdl --tier 6` with 60 s and 180 s caps |
| Result | Syntax PASS. Build PASS (275,019 B). Shell suite 50 passed / 0 failed. Spec hash check PASS. Standalone Tier 6 after harness revision 1.38: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| New checks | Three shell assertions cover the two-column grid, left-aligned text values, and the `.tip-num` right-alignment class. |
| Finding | Both spec copies carry rev 1.98 and have the same SHA-256 hash. Tier 6 stalled because `checkHost()` ran 16 evaluations for one shared tip. Revision 1.38 skips checked tips before the evaluation. |

## TL011 — I-129 KPI hover windows

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl`; `node harness.mjs --dashboard mdl --tier 6` |
| Result | Syntax PASS. Build PASS (274,727 B). Shell suite 47 passed / 0 failed. Full harness before the selector fix: 160 passed / 10 failed / 2 advisory / 24 skipped. Standalone Tier 6 after harness revisions 1.35 and 1.36: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| New checks | Six shell assertions cover 16 bound hosts, stable keys, help cursor, tooltip ARIA, the `overdueFirst` key, and show/hide behavior. MDL Tier 6 hover config is added. |
| Finding | The old overdue KPI selector failure is gone after adding `data-kpi`. Tier 6 was initially skipped because it waited for `.page-link`; the selector is now `[data-page]`. Revision 1.35 added load progress. Revision 1.36 removed the body state marker from page discovery, so the initial tooltip check passes. |

## TL010 — I-128 footer metadata and version

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl` |
| Result | Syntax PASS. Build PASS (267,500 B). Shell suite 41 passed / 0 failed. Full harness: 159 passed / 11 failed / 2 advisory / 24 skipped. |
| New checks | The status-bar assertion now checks version `0.1`, generated update date, and copyright. A new assertion confirms the page footer statement is removed. |
| Finding | Version matches the workplan. Footer metadata appears only in the status bar. The 11 remaining failures are earlier shell, KPI, filter, and I-95 sample-check failures. |

## TL009 — I-127 status bar alignment

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl` |
| Result | Syntax PASS. Build PASS (268,448 B). Shell suite 40 passed / 0 failed. Full harness: 159 passed / 11 failed / 2 advisory / 24 skipped. |
| New checks | Three shell assertions cover file and version text, plain left and right groups, and removed chip chrome. Harness Tier 3 now checks selected file and version instead of a domain total. |
| Finding | The status bar now shows state and version only. The old status-bar total failure is gone. The 11 remaining failures are earlier shell, KPI, filter, and I-95 sample-check failures. |

## TL008 — I-126 crosshair colours

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl` |
| Result | Syntax PASS. Build PASS (269,224 B). Shell suite 37 passed / 0 failed. Full harness: 158 passed / 12 failed / 2 advisory / 24 skipped. |
| New checks | Five shell assertions cover the five theme token sets, translucent tracks, intersection layer and ring, header overlay and accent, plus focus parity. |
| Finding | Crosshair colours now follow spec rev 1.97. The 12 remaining failures are the earlier shell, KPI, filter, status, and I-95 sample-check failures. |

## TL007 — I-124 and I-125 table conformance

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl` |
| Result | Syntax PASS. Build PASS (267,053 B). Shell suite 33 passed / 0 failed. Full harness: 158 passed / 12 failed / 2 advisory / 24 skipped. |
| New checks | Two shell assertions cover the restored rounded container and removed height cap. Two shell assertions cover the binder and crosshair styles. Harness Tier 5 now runs the shared crosshair check for MDL. |
| Finding | The two matrix fit failures are gone. All crosshair checks pass. The 12 remaining failures are the pre-existing shell, KPI, filter, status, and I-95 sample-check failures. |

## TL006 — I-123 matrix full width and no inner scrollbars

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Commands | `node --check src/render.mjs`; `node build.mjs`; `node test/test_shell.mjs`; `cd ../harness-layout && node harness.mjs --dashboard mdl --tier 2` |
| Result | Syntax PASS. Build PASS (261,637 B). Shell suite 31 passed / 0 failed. Harness Tier 2: 53 passed / 0 failed. |
| New checks | Three shell assertions cover the full-width matrix panel, visible card, and visible scroller with no height cap. |
| Finding | The matrix spans all panel columns. Its card and scroller add no scrollbars. The page body keeps its scroll. |

## TL003 — Shell runtime suite

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Command | `node test/test_shell.mjs` |
| Result | 20 passed / 0 failed |
| Checks | Stable shell markers, warning area inside content, filter area and body order, toggle and resizer, five approved pages, no Breakdown, Settings and Help, active page label, no Print / Save PDF, top-menu Export, seven numbered panels, page switching, layout and theme persistence, sidebar collapse, XLSX blob, uniform download name. |
| Finding | The rev 1.96 shell increment is verified at runtime. |
