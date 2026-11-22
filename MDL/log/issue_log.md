# MDL Dashboard — Issue Log

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.17 | 2026-11-22 | CodeBuddy | **I-136 raised and fixed.** Issue Progress panel now matches the approved sample contract. U019, TL021 and the phase report record the work. |
| 1.16 | 2026-11-21 | CodeBuddy | **I-135 raised and fixed.** Collapsed sidebar keeps the content usable. Tier 2 now checks toggle behavior. |
| 1.15 | 2026-11-21 | CodeBuddy | **I-134 raised and fixed.** Matrix table has its own rounded border. The tool row sits before the table card. |
| 1.14 | 2026-11-21 | CodeBuddy | **I-133 corrected.** Panel border kept. Matrix card border removed. Tool-row tokens retained. |
| 1.13 | 2026-11-21 | CodeBuddy | **I-133 fixed.** Universal tool gaps use tokens. The matrix panel is flat and the tool row has token padding. |
| 1.12 | 2026-11-21 | CodeBuddy | **I-133 raised.** Tool-row gaps generalized in the UI spec. Matrix double border reported and left open. |
| 1.11 | 2026-11-21 | CodeBuddy | **I-132 raised and fixed.** Matrix tool row moved inside the table card with left filters and right actions. |
| 1.10 | 2026-11-21 | CodeBuddy | **I-131 raised and fixed.** MDL tooltip grids now use a fixed 76 px label column. |
| 1.9 | 2026-11-21 | CodeBuddy | **I-130 raised and fixed.** General hover-window value alignment added to the UI spec and MDL. |
| 1.8 | 2026-11-21 | CodeBuddy | **I-129 raised and fixed.** KPI hover windows added for all 16 KPI hosts. Tier 6 config added. |
| 1.7 | 2026-11-21 | CodeBuddy | **I-128 raised and fixed.** Footer metadata moved into the status bar. Version aligned with workplan v0.1. |
| 1.6 | 2026-11-20 | CodeBuddy | **I-127 raised and fixed.** Bottom status bar aligned with the UI spec. Duplicate metric chips removed. |
| 1.5 | 2026-11-20 | CodeBuddy | **I-126 raised and fixed.** Crosshair colours and header overlay aligned with spec rev 1.97. |
| 1.4 | 2026-11-20 | CodeBuddy | **I-124 and I-125 raised and fixed.** Matrix fit and rounded container restored. Shared row, column, and cell crosshair added. |
| 1.3 | 2026-11-20 | CodeBuddy | **I-123 raised and fixed.** Discipline Summary Matrix now spans the content width and has no inner scrollbars. |
| 1.2 | 2026-11-20 | CodeBuddy | **U003 fixed three Tier 2 geometry checks found during I-122 verification.** The earlier record had no baseline proof. |
| 1.1 | 2026-11-20 | CodeBuddy | **I-122 raised and fixed.** Content body had no vertical scrollbar when panels exceeded one screen. Added harness coverage for every page. |
| 1.0 | 2026-11-20 | CodeBuddy | Initial canonical issue log at `MDL/log/issue_log.md`. Records the shell increment decisions. The full historical register stays in `MDL/mdl-issues.md` and remains the active detailed ledger. |

## I-136 — Issue Progress panel conformance

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-22 |
| Closed | 2026-11-22 |
| Issue | I-136 in `MDL/mdl-issues.md` revision 1.61 |
| Work item | T11.21.1–T11.21.11 in `MDL/workplan/MDL-I136-Issue-Progress-Workplan.md` |
| Update | U019 in `MDL/log/update_log.md` |
| Defect | The production Issue Progress panel used five fixed ticks, an unwrapped legend, gated bar labels, a Y-max filter that kept bars when Bars was off, an incomplete dual-scale note, no C1 time bar, no attached table, and no chart hover window. |
| Fix | The panel now uses dynamic nice ticks, a wrapped in-SVG legend, fixed right reserve, dual-scale captions, labels for every non-zero bar, a C1 dual-handle time bar with five presets, a native attached table, and chart and table crosshair sync. Hover state is absent from PNG, Copy and print output. |
| Test | TL021. Syntax and lint PASS. Build PASS at 296,804 B. Pipeline 96 passed / 7 failed. Full harness 201 passed / 10 failed / 2 advisory / 22 skipped. Tier 5 36 passed / 0 failed. Chromium at 1366 × 768 and 1920 × 1080 gives no console errors and correct band, hover, print and preset behavior. |
| Note | P5 fixed a shared-crosshair defect found by the harness. P6 removed an invalid mode-element write found by the browser probe. Approval: 2026-11-22 by chinwarsoon. Full report: `MDL/workplan/reports/MDL-I136-Issue-Progress-Report-2026-11-22.md`. |

## I-35 — Left-sidebar navigation

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-10-08 |
| Closed | 2026-11-20 |
| Owner decision | Reverse Decision 22 and Decision 34 for the shell. Follow spec rev 1.96. |
| Work item | T11.7 in `MDL/MDL-Dashboard-Workplan.md` §11.7 |
| Update | U001 in `MDL/log/update_log.md` |
| Change | Added the five-page sidebar, pinned Settings and Help, active page label, toggle, and resizer. |
| Test | TL003 in `MDL/log/test_log.md` — `test/test_shell.mjs` 20/20 passed. |
| Note | Breakdown is held for MDL by owner direction. |

## I-135 — Collapsed sidebar left the page unusable

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-21 |
| Closed | 2026-11-21 |
| Issue | I-135 in `MDL/mdl-issues.md` revision 1.58 |
| Work item | T11.20 in `MDL/MDL-Dashboard-Workplan.md` §11.20 |
| Update | U018 in `MDL/log/update_log.md` |
| Defect | `display:none` removed the sidebar grid item, so the content moved into the first `0px` column. Content fell to 40 px and panels to 30 px. Harness Tier 2 checked only control presence. |
| Fix | Set `body.sidebar-collapsed .shell-main` to `grid-template-columns:minmax(0,1fr)`. Add `sidebarToggle: true` to the MDL harness config. Add a Tier 2 behavior check that clicks the toggle, verifies sidebar hiding, content width, panel widths, and toggle label, then restores the sidebar. |
| Test | TL020. Chromium probe restores `160px 1120px`. Shell suite 60/60 passed. Tier 2 reports 52 passed / 0 failed. Tier 6 reports 27 passed / 0 failed. |
| Note | Tier 3 still reports the pre-existing I-95 sample-check failures. No spec change. |

## I-134 — Matrix table had no own border and square top corners

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-21 |
| Closed | 2026-11-21 |
| Issue | I-134 in `MDL/mdl-issues.md` revision 1.57 |
| Work item | T11.19 in `MDL/MDL-Dashboard-Workplan.md` §11.19 |
| Update | U017 in `MDL/log/update_log.md` |
| Defect | The matrix card had `border:0`. The tool row occupied the clipped card top, so the table header top corners looked square. |
| Fix | Moved the tool row before `.matrixcard`. Restored `.matrixcard{border:1px solid var(--border);border-radius:10px;overflow:hidden}`. Changed the tool-row padding selector to `.toolbar.matrix-tools`. |
| Test | TL019. Shell suite 59/59 passed. MDL Tier 4 border and corner assertions pass. Six I-95 resize failures remain pre-existing. |
| Note | Harness rev 1.39 exposed the defect. No spec change. |

## I-133 — Tool-row gaps not general; matrix shows a second border

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-21 |
| Closed | 2026-11-21 |
| Issue | I-133 in `MDL/mdl-issues.md` revision 1.55 |
| Work item | T11.18 in `MDL/MDL-Dashboard-Workplan.md` §11.18 |
| Update | U014 in `MDL/log/update_log.md` |
| Defect | Spec rev 1.80 limited tool-row padding and group gaps to Breakdown panels. MDL matrix uses hard-coded 8 px gaps and no tool-row padding. A second border appears around the tool row and table. |
| Evidence | `.panel` drew the outer border. `.matrixcard` drew another rounded border. The tool row used hard-coded `gap:8px` and had no four-side padding. |
| Fix | Spec rev 1.99 makes the gap rule universal. MDL adds `--tool-pad:12px` and `--tool-gap:10px`. `.toolbar` and both control groups use `var(--tool-gap)`. `.matrixcard>.toolbar` uses `padding:var(--tool-pad)`. The rejected first fix used `panel-flat`. The corrected fix keeps `.panel` at `1px solid` and sets `.matrixcard` to `border:0`. |
| Test | TL017. Chromium probe: `#matrixPanel` `1px solid`, `.matrixcard` `0px none`. Shell suite 59/59 passed. Tier 6: 27 passed / 0 failed. Both spec copies have the same SHA-256 hash. |
| Note | The spec change from U013 stays in force. U014 recorded the rejected first fix. U015 records the corrected fix. |

## I-132 — Matrix tool row merged into the title row

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-21 |
| Closed | 2026-11-21 |
| Issue | I-132 in `MDL/mdl-issues.md` revision 1.53 |
| Work item | T11.17 in `MDL/MDL-Dashboard-Workplan.md` §11.17 |
| Update | U012 in `MDL/log/update_log.md` |
| Defect | MDL put the Month filter and all matrix actions in `.panel-head`. §4 requires that row to hold only the title, Help, and Collapse. |
| Fix | Added `.toolbar.matrix-tools` inside `.matrixcard`. Month sits in `.tool-filters`. Five actions sit in `.tool-actions` with `margin-left:auto`. Title row keeps only Help and Collapse. |
| Test | TL014. Shell suite 54/54 passed. Tier 6: 27 passed / 0 failed. |
| Note | No spec file changed. Help text updated for the new tool row location. |

## I-131 — Tooltip value column had no shared left edge

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-21 |
| Closed | 2026-11-21 |
| Issue | I-131 in `MDL/mdl-issues.md` revision 1.52 |
| Work item | T11.16 in `MDL/MDL-Dashboard-Workplan.md` §11.16 |
| Update | U011 in `MDL/log/update_log.md` |
| Defect | I-130 used an `auto` first column on each tooltip row. The value column started at a different x for each label. |
| Fix | Both MDL tooltip grids now use `grid-template-columns:76px minmax(0,1fr)`. The label column has one fixed width. |
| Test | TL013. Chromium measurement gives a 76 px label and value start x=92 for all four labels. Shell suite 50/50 passed. Tier 6: 27 passed / 0 failed. |
| Note | No spec file changed. I-130 remains the general rule; I-131 completes its MDL implementation. |

## I-130 — Hover-window text values were right-aligned

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-21 |
| Closed | 2026-11-21 |
| Issue | I-130 in `MDL/mdl-issues.md` revision 1.51 |
| Work item | T11.15 in `MDL/MDL-Dashboard-Workplan.md` §11.15 |
| Update | U010 in `MDL/log/update_log.md` |
| Defect | Spec §4.6 rev 1.97 used `space-between` for every body row. That put long text values at the right edge. MDL KPI detail text had an uneven left edge. |
| Fix | Both spec copies carry rev 1.98. Body rows and footers use a fixed label column. Text values align left. Numeric values align right. MDL tooltip CSS uses a two-column grid and a `.tip-num` class. |
| Test | TL012. `node test/test_shell.mjs` 50/50 passed. Both spec copies have the same SHA-256 hash. |
| Note | Harness revisions 1.37 and 1.38 added Tier 6 progress lines and skipped repeat checks of one shared tip. Standalone Tier 6 reports 27 passed / 0 failed. |

## I-129 — KPI hover windows missing

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-21 |
| Closed | 2026-11-21 |
| Issue | I-129 in `MDL/mdl-issues.md` revision 1.50 |
| Work item | T11.14 in `MDL/MDL-Dashboard-Workplan.md` §11.14 |
| Update | U009 in `MDL/log/update_log.md` |
| Defect | MDL KPI cards had no §4.6 hover host, tooltip, ARIA link, focus target, or `cursor:help`. MDL Tier 6 was skipped because it had no hover config and waited for `.page-link`. |
| Fix | Added 16 bound KPI hosts, one shared tooltip, KPI definition content, one delegated binder, and MDL hover config. Tier 6 now waits for any `[data-page]` navigation item. |
| Test | TL011. `node test/test_shell.mjs` 47/47 passed. Full harness before the selector fix: 160 passed / 10 failed / 2 advisory / 24 skipped. Standalone Tier 6 after harness revisions 1.35 and 1.36: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| Note | No shared spec file changed. Harness core revisions 1.34 to 1.36 made the wait selector generic, added load progress, and removed the body state marker from Tier 6 page discovery. |

## I-128 — Footer metadata duplicated the status bar

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-21 |
| Closed | 2026-11-21 |
| Issue | I-128 in `MDL/mdl-issues.md` revision 1.49 |
| Work item | T11.13 in `MDL/MDL-Dashboard-Workplan.md` §11.13 |
| Update | U008 in `MDL/log/update_log.md` |
| Defect | The page footer repeated product metadata inside the scroll area. The status bar showed `v1.0`, but the workplan declares `0.1`. The footer date used the browser clock. |
| Fix | Removed the footer and its CSS. Set `APP_VERSION` to `0.1`. Put `Updated <generated date>` and `© UESH 2026` in the status bar right group. Formatted the date from `MODEL.meta.generatedAt`. |
| Test | TL010. `node test/test_shell.mjs` 41/41 passed. Full harness: 159 passed / 11 failed / 2 advisory / 24 skipped. |
| Note | No shared spec or harness file changed. |

## I-127 — Bottom status bar did not match the UI spec

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-20 |
| Closed | 2026-11-20 |
| Issue | I-127 in `MDL/mdl-issues.md` revision 1.48 |
| Work item | T11.12 in `MDL/MDL-Dashboard-Workplan.md` §11.12 |
| Update | U007 in `MDL/log/update_log.md` |
| Defect | The status bar used ten `.sb-panel` chips with duplicate KPI, matrix, title-bar, and filter summaries. The spec asks for selected file state and a version string. |
| Fix | Replaced the chips with plain left and right text groups. Left shows the file state and optional render-issue count. Right shows `MDL Dashboard v1.0`. |
| Test | TL009. `node test/test_shell.mjs` 40/40 passed. Full harness: 159 passed / 11 failed / 2 advisory / 24 skipped. |
| Note | Harness Tier 3 now checks the selected file and version string. No shared spec file changed. |

## I-126 — Crosshair colours did not match spec rev 1.97

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-20 |
| Closed | 2026-11-20 |
| Issue | I-126 in `MDL/mdl-issues.md` revision 1.47 |
| Work item | T11.11 in `MDL/MDL-Dashboard-Workplan.md` §11.11 |
| Update | U006 in `MDL/log/update_log.md` |
| Defect | MDL used `--warn-bg` and `--accent-soft-border` with opaque fills. Spec rev 1.97 requires five tokenised colours, translucent tracks, and a non-destructive header overlay. |
| Fix | Added the five tokens to all themes. Used layered gradients for row, column, and intersection states. Added header overlay and accent rules. Added fine-pointer gating and keyboard focus parity. |
| Test | TL008. `node test/test_shell.mjs` 37/37 passed. Full harness: 158 passed / 12 failed / 2 advisory / 24 skipped. |
| Note | The 12 remaining failures are the earlier shell, KPI, filter, status, and I-95 sample-check failures. |

## I-124 — Matrix overflow and rounded container

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-20 |
| Closed | 2026-11-20 |
| Issue | I-124 in `MDL/mdl-issues.md` revision 1.46 |
| Work item | T11.10 in `MDL/MDL-Dashboard-Workplan.md` §11.10 |
| Update | U005 in `MDL/log/update_log.md` |
| Defect | Matrix columns totalled 1114 px against a 1048 px scroller. I-123 set `overflow:visible`, which hid the overflow and broke spec §7.2.15 invariant 1. |
| Fix | Restored `overflow:hidden` on the matrix card. Kept `max-height:none` on the scroller. Added a resize-aware fit pass with a 60 px minimum. |
| Test | TL007. `node test/test_shell.mjs` 33/33 passed. Harness split-header width and fit checks pass. |
| Note | I-123 opened the defect. I-124 closes it. |

## I-125 — Shared table crosshair missing

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-20 |
| Closed | 2026-11-20 |
| Issue | I-125 in `MDL/mdl-issues.md` revision 1.46 |
| Work item | T11.10 in `MDL/MDL-Dashboard-Workplan.md` §11.10 |
| Update | U005 in `MDL/log/update_log.md` |
| Defect | MDL had no `data-table-crosshair`, no `.row-hover`, no `.col-hover`, and no `.cell-hover`. Spec §7.2.16 requires one shared crosshair for every table. |
| Fix | Added stable `data-col-id` values, one delegated binder, crosshair CSS, print suppression, and the MDL harness crosshair config. |
| Test | TL007. Harness Tier 5 crosshair checks pass on Overview, Overdue, Validation, and Documents. |
| Note | Progress has no visible table. No shared spec change is needed. |

## I-123 — Matrix has inner scrollbars and is not full width

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-20 |
| Closed | 2026-11-20 |
| Issue | I-123 in `MDL/mdl-issues.md` revision 1.45 |
| Work item | T11.9 in `MDL/MDL-Dashboard-Workplan.md` §11.9 |
| Update | U004 in `MDL/log/update_log.md` |
| Defect | `#matrixPanel` occupied one grid column. `#matrixPanel .tableScroll` had `max-height:340px`, so the matrix showed inner scrollbars. |
| Fix | The matrix panel spans all panel columns. Its card and scroller use `overflow:visible`. The 340 px height cap is removed for this table. |
| Test | TL006. `node test/test_shell.mjs` 31/31 passed. Harness Tier 2: 53 passed / 0 failed. |
| Note | The content body stays the page scroll surface. I-124 corrected the `overflow:visible` rule. U005 changed the shared harness config. |

## I-122 — Content body has no vertical scrollbar

| Field | Value |
|---|---|
| Status | RESOLVED ✅ |
| Raised | 2026-11-20 |
| Closed | 2026-11-20 |
| Issue | I-122 in `MDL/mdl-issues.md` revision 1.44 |
| Work item | T11.8 in `MDL/MDL-Dashboard-Workplan.md` §11.8 |
| Update | U002 and U003 in `MDL/log/update_log.md` |
| Spec | §3.1 requires a scrollable content area. §3.5 requires notices outside the scrolling body. |
| Defect | `#app` used `height:100vh` with `overflow:hidden`; the content body had no scroll rule, so lower panels were unreachable. |
| Fix | Shell grid fills remaining height. Content zone is a min-height-zero flex column. Body uses `overflow-y:auto`. Warning and filter strips stay outside the body. U003 fixed three geometry checks found during verification. |
| Test | TL004: `test/test_shell.mjs` 23/23 passed. Harness Tier 2 added 25 scroll checks; all passed. TL005: shell suite 28/28 passed. Tier 2: 53 passed / 0 failed. |
| Note | Three Tier 2 geometry checks failed during I-122 verification. U003 fixed them. |

## I-121 — Remaining rev 1.96 dashboard gaps

| Field | Value |
|---|---|
| Status | OPEN 🔴 |
| Raised | 2026-11-20 |
| Scope | Two-panel Validation with chip subtitles. Pagination above 200 rows. Chart hover windows. Table crosshair hover states. Full token inventory. |
| Work item | Workplan §11.7 implementation scope, outside this increment |
| Change | Not implemented. |
| Test | Not applicable. |
