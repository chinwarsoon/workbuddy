# MDL Dashboard — Test Log

| Revision | Date | Author | Summary |
|---|---|---|---|
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
