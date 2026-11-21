# MDL Dashboard — Update Log

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.17 | 2026-11-21 | CodeBuddy | **U018 — I-135 sidebar toggle page layout.** MDL source, built HTML, tests, shared harness config, workplan, issue ledger, and logs updated. |
| 1.16 | 2026-11-21 | CodeBuddy | **U017 — I-134 matrix table border and corners.** MDL source, built HTML, tests, workplan, issue ledger, and logs updated. |
| 1.15 | 2026-11-21 | CodeBuddy | **U016 — harness rev 1.39 adds table border and corner checks.** Shared harness and MDL logs updated. No MDL code changed. |
| 1.14 | 2026-11-21 | CodeBuddy | **U015 — I-133 correction: keep the panel border and remove the matrix card border.** Source, built HTML, tests, workplan, issue ledger, and logs updated. |
| 1.13 | 2026-11-21 | CodeBuddy | **U014 — I-133 MDL fix for tool gaps and single matrix border.** Source, built HTML, tests, workplan, issue ledger, and logs updated. |
| 1.12 | 2026-11-21 | CodeBuddy | **U013 — I-133 spec update for universal tool-row gaps.** Both spec copies updated to rev 1.99. MDL code unchanged. |
| 1.11 | 2026-11-21 | CodeBuddy | **U012 — I-132 matrix tool row alignment.** MDL source, built HTML, tests, workplan, issue ledger, and logs updated. |
| 1.10 | 2026-11-21 | CodeBuddy | **U011 — I-131 fixed tooltip label column.** MDL source, built HTML, tests, workplan, issue ledger, and logs updated. |
| 1.9 | 2026-11-21 | CodeBuddy | **U010 — I-130 general hover-window value alignment.** Both spec copies, MDL source, built HTML, tests, workplan, issue ledger, and logs updated. |
| 1.8 | 2026-11-21 | CodeBuddy | **U009 — I-129 KPI hover windows.** MDL source, built HTML, tests, workplan, issue ledger, logs, and harness config updated. |
| 1.7 | 2026-11-21 | CodeBuddy | **U008 — I-128 footer metadata moved into the status bar.** MDL source, built HTML, tests, workplan, issue ledger, and logs updated. |
| 1.6 | 2026-11-20 | CodeBuddy | **U007 — I-127 status bar aligned with the UI spec.** MDL source, built HTML, tests, workplan, issue ledger, logs, and harness Tier 3 updated. |
| 1.5 | 2026-11-20 | CodeBuddy | **U006 — I-126 crosshair colours aligned with spec rev 1.97.** MDL source, built HTML, tests, workplan, issue ledger, and logs updated. |
| 1.4 | 2026-11-20 | CodeBuddy | **U005 — I-124 and I-125 table conformance.** Matrix fit, rounded container, and shared crosshair fixed. Shared harness config updated. |
| 1.3 | 2026-11-20 | CodeBuddy | **U004 — I-123 matrix full width and no inner scrollbars.** MDL source, built HTML, tests, workplan, issue ledger, and logs updated. |
| 1.2 | 2026-11-20 | CodeBuddy | **U003 — shell geometry and warning bar fix.** Corrected the three Tier 2 failures found during I-122 verification. |
| 1.1 | 2026-11-20 | CodeBuddy | **U002 — I-122 vertical-scroll fix.** MDL source, built HTML, tests, workplan, logs, report, and harness-layout check updated. |
| 1.0 | 2026-11-20 | CodeBuddy | Initial canonical update log. Records U001 for the rev 1.96 shell increment. |

## U018 — Sidebar toggle page layout

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-135 in `MDL/log/issue_log.md` |
| Work item | T11.20 in `MDL/MDL-Dashboard-Workplan.md` §11.20 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `harness-layout/checks/mdl.mjs`, `harness-layout/harness.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | The collapsed shell now uses `grid-template-columns:minmax(0,1fr)`. Tier 2 adds a behavior check for sidebar hiding, content width, panel widths, and toggle label. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 275,103 B. Chromium probe restores `160px 1120px`. Shell suite 60 passed / 0 failed. Tier 2 reports 52 passed / 0 failed. Tier 6 reports 27 passed / 0 failed. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | Tier 3 still reports the pre-existing I-95 sample-check failures. |

## U017 — Matrix table border and corners

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-134 in `MDL/log/issue_log.md` |
| Work item | T11.19 in `MDL/MDL-Dashboard-Workplan.md` §11.19 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Moved the tool row before the table card. Restored the rounded 1 px table card border. Updated the tool-row padding selector and shell assertions. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 275,105 B. Shell suite 59 passed / 0 failed. MDL Tier 4: 71 passed / 6 failed; the new border and corner checks pass. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | Harness rev 1.39 provided the detection. No spec change. |

## U016 — Harness table border and corner checks

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | Related to I-133 |
| Work item | T11.18 in `MDL/MDL-Dashboard-Workplan.md` §11.18 |
| Status | DONE |
| Files changed | `harness-layout/harness.mjs`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Harness revision 1.39 collects split-card and body-table border data. Tier 4c now asserts one visible outer border and rounded outer corners. |
| Validation | Syntax PASS. MDL Tier 4 reports the new border failure for the matrix card. Sub Tier 4 needs a local server and was not run. |
| Rollback | Remove the two Tier 4c assertions and the added border/corner fields from the `pairs` evaluator. |
| Note | No MDL code changed. The new failure confirms the harness gap is closed. |

## U015 — I-133 correction: panel border kept

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-133 in `MDL/log/issue_log.md` |
| Work item | T11.18 in `MDL/MDL-Dashboard-Workplan.md` §11.18 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Removed the `panel-flat` call. Set `.matrixcard` to `border:0`. Kept tool-row tokens, token gaps, and token padding. Shell assertions now require the panel border and reject the card border. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 275,082 B. Chromium probe: panel `1px solid`, card `0px none`. Shell suite 59 passed / 0 failed. Tier 6: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | U014 recorded the rejected first fix. U015 supersedes it. |

## U014 — Tool gaps and single matrix border

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-133 in `MDL/log/issue_log.md` |
| Work item | T11.18 in `MDL/MDL-Dashboard-Workplan.md` §11.18 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Added `--tool-pad` and `--tool-gap`. Tool rows and control groups now use token gaps. The matrix tool row gets token padding. `renderMatrix()` adds `panel-flat`, so only the table card border remains. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 275,142 B. Shell suite 58 passed / 0 failed. Tier 6: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | U013 spec rev 1.99 stays in force. |

## U013 — Universal tool-row gaps in the UI spec

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-133 in `MDL/log/issue_log.md` |
| Work item | T11.18 in `MDL/MDL-Dashboard-Workplan.md` §11.18 |
| Status | DONE (spec only) |
| Files changed | `Dashboard-UI-Design-Spec.md`, `harness-layout/spec/Dashboard-UI-Design-Spec.md`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Added rev 1.99. §4 now requires equal tool-row padding from `--tool-pad` and group gaps from `--tool-gap` in all panels. §6 adds both tokens and makes the C3 tokens aliases. |
| Validation | Both spec copies have the same SHA-256 hash. No MDL code changed. |
| Rollback | Restore both spec copies and the ledger/log files from Git. |
| Note | The matrix double border is logged as OPEN. No code fix yet. |

## U012 — Matrix tool row alignment

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-132 in `MDL/log/issue_log.md` |
| Work item | T11.17 in `MDL/MDL-Dashboard-Workplan.md` §11.17 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Added `.toolbar.matrix-tools` inside `.matrixcard`. Month moved to `.tool-filters`. Five actions moved to `.tool-actions` with `margin-left:auto`. Title row keeps only Help and Collapse. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 275,012 B. Shell suite 54 passed / 0 failed. Tier 6: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | No spec file changed. No harness file changed. |

## U011 — Fixed tooltip label column

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-131 in `MDL/log/issue_log.md` |
| Work item | T11.16 in `MDL/MDL-Dashboard-Workplan.md` §11.16 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Both tooltip grids now use `grid-template-columns:76px minmax(0,1fr)`. Shell assertions expect the fixed column. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 275,019 B. Chromium measurement gives value start x=92 for all four labels. Shell suite 50 passed / 0 failed. Tier 6: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | No spec file changed. No harness file changed. |

## U010 — General hover-window value alignment

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-130 in `MDL/log/issue_log.md` |
| Work item | T11.15 in `MDL/MDL-Dashboard-Workplan.md` §11.15 |
| Status | DONE |
| Files changed | `Dashboard-UI-Design-Spec.md`, `harness-layout/spec/Dashboard-UI-Design-Spec.md`, `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Added a general two-column alignment rule to §4.6 of both spec copies. MDL tooltip rows and footer now use a fixed label column. Text aligns left and `.tip-num` aligns right. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 275,019 B. Shell suite 50 passed / 0 failed. Both spec copies have the same SHA-256 hash. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | Harness revisions 1.37 and 1.38 added Tier 6 progress lines and skipped repeat checks of one shared tip. No product code changed. |

## U009 — KPI hover windows

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-129 in `MDL/log/issue_log.md` |
| Work item | T11.14 in `MDL/MDL-Dashboard-Workplan.md` §11.14 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md`, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs` |
| Change | Added 16 bound KPI hover hosts, one shared tooltip, definition content, one delegated binder, and MDL Tier 6 config. The harness now waits for any `[data-page]` nav item. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 274,727 B. Shell suite 47 passed / 0 failed. Full harness before the selector fix: 160 passed / 10 failed / 2 advisory / 24 skipped. Standalone Tier 6 after harness revisions 1.35 and 1.36: 27 passed / 0 failed / 0 advisory / 0 skipped. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | The 10 harness failures are earlier shell, KPI ground-truth, filter, and I-95 sample-check failures. No shared spec file changed. Harness core revisions 1.35 and 1.36 are included in this update. |

## U008 — Footer metadata moved into the status bar

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-128 in `MDL/log/issue_log.md` |
| Work item | T11.13 in `MDL/MDL-Dashboard-Workplan.md` §11.13 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Removed the page footer and its CSS. Set the dashboard version to workplan v0.1. Moved update date and copyright into the status bar right group. Removed one unused CSS rule. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 267,500 B. Shell suite 41 passed / 0 failed. Full harness: 159 passed / 11 failed / 2 advisory / 24 skipped. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | The 11 remaining failures are earlier shell, KPI, filter, and I-95 sample-check failures. No shared spec or harness file changed. |

## U007 — Status bar aligned with the UI spec

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Issue | I-127 in `MDL/log/issue_log.md` |
| Work item | T11.12 in `MDL/MDL-Dashboard-Workplan.md` §11.12 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md`, `harness-layout/harness.mjs` |
| Change | Removed status-bar chip chrome and duplicate metrics. Added left file state with optional render-issue count and right version string. Updated Tier 3 to check file and version. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 268,448 B. Shell suite 40 passed / 0 failed. Full harness: 159 passed / 11 failed / 2 advisory / 24 skipped. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | The 11 remaining failures are earlier shell, KPI, filter, and I-95 sample-check failures. No shared spec file changed. |

## U006 — Crosshair colours aligned with spec rev 1.97

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Issue | I-126 in `MDL/log/issue_log.md` |
| Work item | T11.11 in `MDL/MDL-Dashboard-Workplan.md` §11.11 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Added five crosshair tokens to all themes. Replaced opaque hover fills with tokenised translucent layers. Added header overlay and accent rules. Added fine-pointer gating, keyboard focus parity, and matrix focus targets. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 269,224 B. Shell suite 37 passed / 0 failed. Full harness: 158 passed / 12 failed / 2 advisory / 24 skipped. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | No shared spec or harness file changed in U006. |

## U005 — Matrix fit, border, and shared crosshair

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Issues | I-124 and I-125 in `MDL/log/issue_log.md` |
| Work item | T11.10 in `MDL/MDL-Dashboard-Workplan.md` §11.10 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md`, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs` |
| Change | Restored the matrix rounded container and added a resize-aware fit pass. Added stable column IDs and one delegated row, column, and cell crosshair. Enabled the MDL harness check. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 267,053 B. Shell suite 33 passed / 0 failed. Full harness: 158 passed / 12 failed / 2 advisory / 24 skipped. The 2 matrix failures and all crosshair checks pass. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | The 12 remaining harness failures are outside this change. No shared spec file changed. |

## U004 — Matrix full width and no inner scrollbars

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Issue | I-123 in `MDL/log/issue_log.md` |
| Work item | T11.9 in `MDL/MDL-Dashboard-Workplan.md` §11.9 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
| Change | Made the matrix panel span all panel columns. Removed its 340 px height cap and set its card and scroller to `overflow:visible`. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 261,637 B. Shell suite 31 passed / 0 failed. Harness Tier 2: 53 passed / 0 failed. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | No shared spec or harness file changed. |

## U003 — Shell geometry and warning bar

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Issue | I-122 verification findings in `MDL/log/issue_log.md` |
| Work item | T11.8 in `MDL/MDL-Dashboard-Workplan.md` §11.8 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/log/update_log.md`, `MDL/log/issue_log.md`, `MDL/log/test_log.md`, `MDL/workplan/reports/MDL-I122-Vertical-Scroll-Report-2026-11-20.md` |
| Change | Changed `#app` to a three-row grid. Set `html` and `body` to hidden page scroll. Put the status bar and warning bar in document flow. Kept the content body as the only scroll area. |
| Validation | Syntax PASS. Build wrote `MDL-Dashboard.html` at 261,484 B. Shell suite 28 passed / 0 failed. Harness Tier 2: 53 passed / 0 failed. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. Restore the deleted raw output file from Git if needed. |
| Note | The raw Tier 2 output file was deleted. No spec file changed. |

## U002 — I-122 content vertical scrolling

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Issue | I-122 in `MDL/log/issue_log.md` |
| Work item | T11.8 in `MDL/MDL-Dashboard-Workplan.md` §11.8 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/log/issue_log.md`, `MDL/log/test_log.md`, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs`, `MDL/workplan/reports/MDL-I122-Vertical-Scroll-Report-2026-11-20.md` |
| Change | Added vertical scroll to the content body, made the shell grid fill the viewport height, and added a reusable Tier 2 vertical-scroll probe for every page. |
| Validation | Syntax check passed. Build wrote `MDL-Dashboard.html` at 262,277 B. Shell suite 23/23 passed. Harness Tier 2 added 25 checks; all passed. Three geometry checks failed then. U003 fixed them. |
| Rollback | Restore the listed files from Git history and rebuild `MDL-Dashboard.html`. |
| Note | No spec file changed. |

## U001 — Rev 1.96 shell increment

| Field | Value |
|---|---|
| Date | 2026-11-20 |
| Issue | I-35 in `MDL/log/issue_log.md` |
| Work item | T11.7 in `MDL/MDL-Dashboard-Workplan.md` §11.7 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/mdl-issues.md`, `MDL/test/test_render.mjs`, `MDL/test/test_shell.mjs`, `MDL/log/issue_log.md`, `MDL/log/test_log.md` |
| Change | Added spec shell markers, left navigation, active page label, Settings and Help, theme and layout state, top-menu Export, inlined XLSX writer, and uniform download names. Removed Print / Save PDF. Held Breakdown for MDL. |
| Validation | `node --check src/render.mjs` passed. `node build.mjs` wrote `MDL-Dashboard.html` at 262,109 B. Tests recorded in TL001–TL003. |
| Rollback | Restore the previous `src/render.mjs`, rebuild `MDL-Dashboard.html`, and restore the previous workplan and logs from Git history. |
| Note | Other rev 1.96 gaps remain open under I-121. |
