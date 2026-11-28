# MDL Dashboard — Update Log

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.52 | 2026-11-28 | CodeBuddy (AI) | **U052 validated.** CSS specificity fixes and harness probe closure. Full suite rerun; crosshair assertions pass. See `TL045`. |
| 1.53 | 2026-11-28 | AWS Quick (AI) | **U053 — I-168 header text/fill root-cause fix.** `render.mjs` rev 1.10: 5 table-header rules moved from `var(--navy)`/`var(--on-fill)` to `var(--thead-bg,var(--navy))`/`var(--thead-fg,var(--on-fill))`. Fixes unreadable header text in ocean/presentation (was ~1.1:1, now 9.0–13.6:1) and an invisible crosshair edge in sky (--navy == --accent there, was 1.00:1, now 3.88:1 via the same existing --accent, no substitution needed). Not yet tested. |
| 1.51 | 2026-11-28 | CodeBuddy (AI) | **U052 — I-167 crosshair contract complete.** Arrow-key navigation, pinned-cell tint, strong-tier ranges, token test resolver, and harness checks. Spec rev 1.116. See `TL045`. |
| 1.50 | 2026-11-28 | CodeBuddy (AI) | **U051 — I-166 theme close.** Themed `--thead-*` header and export, welcome `themePicker`, and current-theme sync. See `TL044`. |
| 1.48 | 2026-11-27 | CodeBuddy (AI) | **U049 — welcome 1.3.1 done-step dwell 3000 ms.** Step 3 paints complete before the dashboard opens. See `TL043`. |
| 1.49 | 2026-11-28 | AWS Quick (AI) | **U050 — theme rework (I-166).** `render.mjs` rev 1.5: `boot()` calls `applyShellPrefs()` (T1); theme keys renamed navy/sepia -> sky/ocean/presentation; local `:root` reduced to MDL-only tokens; shared theme set now comes from inlined `common/tokens/tokens.css`; all 80 in-scope hex literals repointed to tokens; `COLORS`/`PALETTE` kept as fallback, new `CHART()`/`CHART_SERIES()` resolve colors live (T5). `build.mjs` rev 1.2 inlines the `tokens` module. Not yet tested — Node unavailable this session. |
| 1.47 | 2026-11-27 | CodeBuddy (AI) | **U048 — welcome Help is `What file do I need?` and opens welcome-specific help.** Dashboard Help is unchanged. See `TL042`. |
| 1.46 | 2026-11-27 | CodeBuddy (AI) | **U047 — welcome 1.3.0 hold 10000 ms; footer `Rev 1.9 · © 2026 UESH`.** Dashboard version stays 1.9. See `TL041`. |
| 1.45 | 2026-11-27 | CodeBuddy (AI) | **U046 — dashboard version 1.9.** Welcome footer, `APP_VERSION` and status bar follow the MDL workplan. See `TL040`. |
| 1.44 | 2026-11-27 | CodeBuddy (AI) | **U045 — `knowledge.json` now uses the standard `revisionHistory` field.** Docs only. |
| 1.43 | 2026-11-27 | CodeBuddy (AI) | **U044 — MDL workplan revision history established (1.0–1.9).** Docs only. |
| 1.42 | 2026-11-27 | CodeBuddy (AI) | **U043 — rebuilt with common welcome 1.2.1 (C-07).** One instruction below the task heading. See `TL039`. |
| 1.41 | 2026-11-27 | AWS Quick (AI) | **U042 — I-165 closed; rebuilt with common welcome 1.2.0.** See `TL038`. |
| 1.40 | 2026-11-27 | AWS Quick (AI) | **U041 — I-165 render-test fix.** Top-bar Help test reads the `<header>` element. Test only. |
| 1.39 | 2026-11-27 | AWS Quick (AI) | **U040 — I-165 re-scoped to welcome 1.2.0.** `ui_help.json` 1.2, `test_render.mjs` rev 1.4. Rebuild pending. |
| 1.38 | 2026-11-27 | AWS Quick (AI) | **U039 — I-165 welcome 1.1.0 adoption edits.** Opener handler, `ui_help.json` 1.1, test patterns, harness `extraFile`. Rebuild pending. |
| 1.37 | 2026-11-26 | CodeBuddy (AI) | **U038 — rebuilt MDL with common welcome 1.0.2.** C-03 drop-area design adopted. See `TL037`. |
| 1.36 | 2026-11-26 | CodeBuddy (AI) | **U037 — I-164 MDL welcome page adopted from `common/`.** Shared welcome 1.0.1 inlined; old welcome archived and removed. See `TL036`. |
| 1.35 | 2026-11-26 | AWS Quick (AI) | **U036 — welcome plan moved to `common/workplan/`; §11.35 extended.** Docs only. |
| 1.34 | 2026-11-26 | AWS Quick (AI) | **U035 — I-164 logged; workplan §11.35 added.** UI spec rev 1.107 (§3.7 welcome page). Files: `log/issue_log.md` 1.31, `MDL-Dashboard-Workplan.md` §11.35. Docs only; no code, test or build changed. |
| 1.33 | 2026-11-25 | CodeBuddy | **U034 — I-163 Validation Rules resize alignment.** Content-aware minima, grow-to-fill fit, live user-width ownership and one-cell-per-column empty state. See `TL035`. |
| 1.32 | 2026-11-25 | CodeBuddy | **U033 — I-162 harness ground truth and L3 discovery.** Blank discipline included, exact chip selection, page sweep, grid keys and configured pin policy. See `TL034`. |
| 1.31 | 2026-11-25 | CodeBuddy | **U032 — I-161 one zebra token.** Added per-theme `--ds-zebra`, applied it to all table bodies and pinned cells, removed the overdue row fill and aligned matrix export colors. See `TL033`. |
| 1.30 | 2026-11-25 | CodeBuddy | **U031 — I-160 two-panel Validation redesign.** SUB design and spec assertion 36 implemented in MDL. Chips, tool rows, rule CSV / Columns, 200-row pagination and harness count hook added. See `TL032`. |
| 1.29 | 2026-11-25 | CodeBuddy | **U030 — I-151 … I-159 Overdue List conformance.** Tool row, filters/actions split, empty CSV, pagination, document columns, alignment, token gaps and help text fixed. See `TL031`. |
| 1.28 | 2026-11-25 | CodeBuddy | **U029 — I-150 chart column centers match attached-table column centers (spec rev 1.106).** Spec, MDL render and export, harness center check, shell checks, workplan §11.29 and logs updated. Shell suite 111 passed / 0 failed. |
| 1.27 | 2026-11-24 | CodeBuddy | **U028 — I-149 one table-header design for every table type (spec rev 1.105).** Source, built HTML, tests, workplan §11.28, logs and harness header check updated. Shell suite 110 passed / 0 failed. |
| 1.26 | 2026-11-24 | CodeBuddy | **U027 — I-148 attached-table CSV and Y-axis caption typography (spec rev 1.104).** Source, built HTML, tests, workplan §11.27, logs and harness CSV check updated. Shell suite 110 passed / 0 failed. |
| 1.25 | 2026-11-24 | CodeBuddy | **U026 — I-147 attached-table gap, board fit and themed header fill (spec rev 1.103).** Source, built HTML, tests, workplan §11.26, logs and harness checks updated. Shell suite 106 passed / 0 failed. |
| 1.24 | 2026-11-24 | CodeBuddy | **U025 — I-146 general two-row chart head (spec rev 1.102).** Source, built HTML, tests, workplan §11.25, issue log and test log updated. Shell suite 101 passed / 0 failed. |
| 1.23 | 2026-11-23 | CodeBuddy | **U024 — I-145 time-bar fill alignment fixed.** Fill moved to a zone sibling; live-browser geometry verified. Shell suite 95 passed / 0 failed. |
| 1.22 | 2026-11-23 | CodeBuddy | **U023 — time bar and segmented control aligned with the Sub reference design (spec rev 1.101, I-144).** `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, workplan §11.23, issue log, test log. Shell suite 94 passed / 0 failed. |
| 1.21 | 2026-11-23 | CodeBuddy | **U022 — full harness layout verification of the I-137…I-143 build.** MDL test log, workplan and update log updated. Harness detection gap fixed in `harness-layout` (its own `I006` / `U008`). |
| 1.20 | 2026-11-23 | CodeBuddy | **U021 — I-137…I-143 fixed in the Issue Progress panel.** Spec rev 1.100 applied to source, built HTML, tests, workplan, issue log and test log. Shell suite 84 passed / 0 failed. |
| 1.19 | 2026-11-23 | CodeBuddy | **U020 — S-curve spec rev 1.100, I-137…I-143, and the issue-log merge.** Both spec copies, both issue logs, the main workplan, AGENTS.md and all old-path references updated. U020 records the change. No dashboard code changed. |
| 1.18 | 2026-11-22 | CodeBuddy | **U019 — I-136 Issue Progress panel conformance.** MDL source, built HTML, workplan, issue ledger, and logs updated. |
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

## U052 — Crosshair contract complete (I-167)

| Field | Value |
|---|---|
| Date | 2026-11-28 |
| Issue | I-167 (`MDL/log/issue_log.md`), common C-08 |
| Work item | `MDL/MDL-Dashboard-Workplan.md` revision 1.11 |
| Status | DONE |
| Files changed | `Dashboard-UI-Design-Spec.md` and harness copy rev 1.116, `AGENTS.md` 1.26, `MDL/src/render.mjs` 1.9, `common/tokens/tokens.css` 1.3.1, `common/manifest.json` 1.4.4, `common/test/tokens.test.mjs` 1.0.1, `MDL/test/test_shell.mjs` 1.2, `harness-layout/harness.mjs` 1.51, `common/README.md` 1.0.11, `MDL/MDL-Dashboard.html`, and the logs |
| Change | The shared crosshair binder moves the active cell with Arrow keys and makes data cells focusable. Pinned cells layer the crosshair tint over their own zebra / soft fill. Strong tier is 14% for light-family themes and 22% for dark-family themes. CSS specificity keeps the C1 row header bold and the pinned intersection strong. The token test resolves `color-mix(..., transparent)` over surface and zebra before AA measurement. Harness Tier 5 checks ArrowRight, row-head availability, the computed 2px ring and the pinned strong tier. Tier 8 cycles the theme on both `<html>` and `<body>`. |
| Validation | Build OK (`MDL-Dashboard.html` 436,311 bytes). Tokens 178 / 0. Welcome 73 / 0. Pipeline 27 / 5 and 96 / 7 pre-existing. Grid 45 / 45. Shell 127 / 0. Render 190 / 203 (13 pre-existing). Harness 366 passed / 2 failed (Tier 1 baseline) / 2 advisory / 31 skipped. See `TL045`. |
| Rollback | Restore the listed files and rebuild. The last verified state has no arrow-key navigation, pinned cells without crosshair tint, strong 17% / 26%, and harness 343 / 2 baseline. |

## U051 — Theme close (I-166)

| Field | Value |
|---|---|
| Date | 2026-11-28 |
| Issue | I-166 (`MDL/log/issue_log.md`), common C-08 |
| Work item | `MDL/MDL-Dashboard-Workplan.md` revision 1.10; WP-THEME-001 W4–W5 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs` 1.6, `MDL/config/ui_help.json` 1.9.4, `MDL/test/test_shell.mjs` 1.1, `MDL/test/test_grid.mjs` 1.1, `common/test/welcome.test.mjs` 1.4.1, `MDL/MDL-Dashboard.html`, and the logs |
| Change | The S-curve table header and PNG/Copy export read `--thead-bg` / `--thead-fg` with `--navy` / `--on-fill` fallback. The welcome config exposes a six-theme picker. `boot()` sets the current picker entry from the saved theme, and `onThemeChange` persists and applies the selected theme. Stale test expectations for six themes, header tokens, the A3 spec wording, and the CSS header version were corrected. |
| Validation | Tokens 160 / 0. Welcome 73 / 0. Grid 45 / 45. Shell 125 / 0. Render 190 / 13 pre-existing of 203. Harness 343 / 2 (Tier 1 baseline) / 2 advisory / 24 skipped. Pipeline 27 / 5 and 96 / 7 are unchanged stale workbook-data failures. See `TL044`. |
| Rollback | Restore the listed files and rebuild. The last verified state had harness 342 / 3 / 2 advisory / 24 skipped, render 190 / 13, shell 122 / 3, and grid 44 / 45. |

## U049 — Welcome done-step dwell 3000 ms

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | — (owner decision 2026-11-27) |
| Work item | `MDL/MDL-Dashboard-Workplan.md` revision 1.9; WP-WELCOME-001 revision 1.3.1 |
| Status | DONE |
| Files changed | `common/welcome/welcome.mjs` 1.3.1, `common/welcome/welcome.schema.json` 1.3.1, `common/test/welcome.test.mjs` 1.3.1, `common/manifest.json` 1.3.1, `common/workplan/Welcome-Page-Workplan.md` 1.3.1, `common/log/update_log.md` U014, `common/README.md` 1.0.9, both spec copies rev 1.113, `harness-layout/harness.mjs` 1.46, `harness-layout/checks/mdl.mjs` 1.3, `AGENTS.md` 1.24, `MDL/config/ui_help.json` 1.9.3, `MDL/MDL-Dashboard-Workplan.md`, `MDL/MDL-Dashboard.html`, and the MDL logs |
| Change | New `doneDwellMs` config (0–10000 ms, default 0). `finish()` paints `done`, shows `Step 3 complete — opening…`, then waits the configured time before the opener. MDL sets 3000 ms after the 10000 ms success hold. Dashboard version stays 1.9. |
| Validation | Common 73 / 0. Build OK, `common-version` 1.3.1. Shell 125 / 0. Render 190 / 13 pre-existing of 203. Harness 282 / 2 (Tier 1 baseline) / 2 advisory / 24 skipped; Tier 7 43–53 and check 51 PASS. See `TL043`. |
| Rollback | Restore the listed files and rebuild. The last verified state has no done-step dwell and uses the two-frame opener. |

## U048 — Welcome-specific Help

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | — (owner decision 2026-11-27) |
| Work item | `MDL/MDL-Dashboard-Workplan.md` revision 1.9 |
| Status | DONE |
| Files changed | `MDL/config/ui_help.json` 1.9.2, `MDL/src/render.mjs` 1.4, `MDL/MDL-Dashboard-Workplan.md`, `MDL/MDL-Dashboard.html`, and the MDL logs |
| Change | The welcome Help button label is `What file do I need?`. It opens a new `HELP.welcome` dialog about the required workbook, the Code sheet and the `Dashboard Title` rule. The dashboard menu Help keeps its shell and navigation content. |
| Validation | Build OK (`common-version` 1.3.0 unchanged). Shell 125 / 0. Render 190 / 13 pre-existing of 203. Harness 281 / 2 (Tier 1 baseline) / 2 advisory / 24 skipped; Tier 7 43–53 and check 51 PASS. See `TL042`. |
| Rollback | Restore `ui_help.json` and `render.mjs`, then rebuild. The last verified state is welcome label `Help` with dashboard help content. |

## U047 — Welcome hold 10000 ms and Rev 1.9 footer

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | — (owner decision 2026-11-27) |
| Work item | `MDL/MDL-Dashboard-Workplan.md` revision 1.9; WP-WELCOME-001 revision 1.3.0 |
| Status | DONE |
| Files changed | `common/welcome/welcome.mjs` 1.3.0, `common/welcome/welcome.schema.json` 1.3.0, `common/test/welcome.test.mjs` 1.3.0, `common/manifest.json` 1.3.0, `common/workplan/Welcome-Page-Workplan.md` 1.3.0, `common/log/update_log.md` U013, both spec copies rev 1.112, `harness-layout/harness.mjs` 1.45, `AGENTS.md` 1.23, `MDL/config/ui_help.json` 1.9.1, `MDL/knowledge.json` 1.0.3, `MDL/MDL-Dashboard-Workplan.md`, `MDL/MDL-Dashboard.html`, and the MDL logs |
| Change | The welcome ready state holds 10000 ms before the dashboard opens. In auto mode step 2 stays current until the load starts, and the done step paints before the opener runs. The footer shows `Rev 1.9 · © 2026 UESH`. `APP_VERSION` and the status bar stay at 1.9. |
| Validation | Common 70 / 0. Build OK, `common-version` 1.3.0. Shell 125 / 0. Render 190 / 13 pre-existing of 203. Harness 281 / 2 (Tier 1 baseline) / 2 advisory / 24 skipped; Tier 7 43–53 and check 51 PASS. See `TL041`. |
| Rollback | Restore the listed files and rebuild `MDL-Dashboard.html`. The last verified state is common 1.2.1, spec rev 1.111, hold 1500 ms, footer `1.9 · © 2026 UESH`. |

## U046 — Dashboard version 1.9

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | — (owner decision 2026-11-27) |
| Work item | `MDL/MDL-Dashboard-Workplan.md` revision 1.9 |
| Status | DONE |
| Files changed | `MDL/config/ui_help.json` 1.9, `MDL/src/render.mjs` 1.3, `MDL/test/test_shell.mjs` 1.0, `MDL/knowledge.json` 1.0.2, `MDL/MDL-Dashboard-Workplan.md`, `MDL/MDL-Dashboard.html`, and the MDL logs |
| Change | Set the MDL dashboard version to 1.9 in the welcome footer and `APP_VERSION`. The status bar now shows `MDL Dashboard v1.9`. The `common-version` meta stays 1.2.1 as build traceability. |
| Validation | Shell 125 passed / 0 failed. Render 190 passed / 13 pre-existing of 203 checks. Harness 281 passed / 2 failed / 2 advisory / 24 skipped. Tier 7 43–53 and check 51 PASS. See `TL040`. |
| Rollback | Restore `APP_VERSION` and `footer.version` to 0.1, restore the test expectation, and rebuild. |

## U045 — MDL knowledge revision field aligned

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | — (AGENTS.md §13 revision control) |
| Work item | `MDL/knowledge.json` |
| Status | DONE |
| Files changed | `MDL/knowledge.json`, `MDL/log/update_log.md` |
| Change | Renamed `revision_history` to `revisionHistory`. Existing revision entries and the file version are unchanged. |
| Validation | JSON parses. The standard field name is present. |
| Rollback | Rename the field back to `revision_history` and remove this update entry. |

## U044 — MDL workplan revision history established

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | — (AGENTS.md §13 revision control) |
| Work item | `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/update_log.md` |
| Change | Added a top-of-file revision table with revisions 1.0 to 1.9. Rows 1.0–1.7 come from the 7 Git commits touching the workplan. Rows 1.8 and 1.9 record the uncommitted welcome work from 2026-11-26 and 2026-11-27. The `Version: 0.1` field is unchanged; it is the dashboard version shown in the footer. |
| Validation | Revision table checked against `git log --follow` for the workplan. No version or cross-reference changed. |
| Rollback | Delete the inserted revision table and remove this update entry. |

## U043 — MDL rebuilt with common welcome 1.2.1

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | Common C-07 |
| Work item | WP-WELCOME-001 shared design; MDL welcome close-out follow-up |
| Status | RESOLVED |
| Files changed | `MDL/config/ui_help.json` 1.2.1, `MDL/knowledge.json`, `MDL/MDL-Dashboard.html`, and the common and MDL logs |
| Change | The shared module no longer prints the duplicate auto-mode action text. The MDL config keeps `Add the workbook; the dashboard opens once it passes the check.` as the `instruction` below the task heading. The build writes `common-version` 1.2.1. |
| Validation | `node common/test/welcome.test.mjs`: 70 passed / 0 failed. `node MDL/build.mjs`: `common-version` 1.2.1. `node MDL/test/test_shell.mjs`: 125 passed / 0 failed. `node MDL/test/test_render.mjs`: 190 passed / 13 pre-existing of 203 checks. `node harness-layout/harness.mjs --dashboard mdl`: 281 passed / 2 failed / 2 advisory / 24 skipped. Tier 7 43–53 and check 51 PASS. See `TL039`. |
| Rollback | Restore `ui_help.json` 1.2, restore common 1.2.0, and rebuild `MDL-Dashboard.html`. |

## U042 — I-165 closed; MDL rebuilt with common welcome 1.2.0

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | I-165 in `MDL/log/issue_log.md` (RESOLVED) |
| Work item | §11.36 in `MDL/MDL-Dashboard-Workplan.md` (DONE) |
| Files changed | `MDL/MDL-Dashboard.html` (rebuilt by the owner, `common-version` 1.2.0), `MDL/knowledge.json` (common 1.2.0), `MDL/log/issue_log.md` (1.36), `MDL/log/test_log.md` (TL038), `MDL/MDL-Dashboard-Workplan.md` (§11.36) |
| Change | Two-column welcome card from common 1.2.0 inlined; success hold before the dashboard paints. |
| Validation | TL038. |
| Rollback | Restore `common/` 1.0.2 files and the MDL files from `git`, then rebuild. |

## U041 — I-165 render-test fix (top-bar Help)

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | I-165 in `MDL/log/issue_log.md` |
| Files changed | `MDL/test/test_render.mjs` (rev 1.5) |
| Change | The "Help button is in the top bar" test used a 900-character window after `<header class="cw-topbar">`. In the build, the top bar holds the logo as a base64 data URI, so the window ended before `cw-help`. The test now reads the whole `<header>` element. Found by the owner's run; harness assertion 44 already passed through the DOM. |
| Validation | Re-run pending (expected render 191 / 13). |
| Rollback | Restore the test line from `git`. |

## U040 — I-165 re-scoped to welcome 1.2.0 (two-column card)

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | I-165 in `MDL/log/issue_log.md` |
| Work item | §11.36 in `MDL/MDL-Dashboard-Workplan.md` (T11.36.6, T11.36.7) |
| Status | IN PROGRESS — rebuild and test run pending |
| Files changed | `MDL/config/ui_help.json` (1.2), `MDL/test/test_render.mjs` (rev 1.4), `MDL/MDL-Dashboard-Workplan.md` (§11.36), `MDL/log/issue_log.md` (1.35) |
| Change | Guide-panel `description` and `checks[]` (only the two checks the inspect handler runs), task-panel instruction, Help text. Render tests follow the two-column markup. `src/render.mjs` unchanged (opener handler from U039 stays). |
| Validation | Not yet run. `MDL-Dashboard.html` still carries common 1.1.0 until the rebuild. |
| Rollback | Restore the two files from `git` and rebuild. |

## U039 — I-165 welcome 1.1.0 adoption edits

| Field | Value |
|---|---|
| Date | 2026-11-27 |
| Issue | I-165 in `MDL/log/issue_log.md` |
| Work item | §11.36 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | IN PROGRESS — rebuild and test run pending |
| Files changed | `MDL/src/render.mjs` (rev 1.2), `MDL/config/ui_help.json` (1.1), `MDL/test/test_render.mjs` (rev 1.3), `harness-layout/checks/mdl.mjs`, `MDL/MDL-Dashboard-Workplan.md` (§11.36), `MDL/log/issue_log.md` (1.34) |
| Change | The welcome `load` handler returns `() => renderDashboard(root, model)`, so common welcome 1.1.0 shows the success hold before the paint. `successHoldMs: 1500`; instruction and help text aligned. Render-test patterns now match `class="cw-box cw-drop…"` and a slot-list modifier. Harness config gains `extraFile` for assertions 48 / 52. |
| Validation | Not yet run. `MDL-Dashboard.html` is not rebuilt yet; until it is, the delivered file still carries common 1.0.2. |
| Rollback | Restore the four files from `git` and rebuild. |

## U038 — MDL rebuilt with common welcome 1.0.2

| Field | Value |
|---|---|
| Date | 2026-11-26 |
| Issue | Common C-03 |
| Work item | WP-WELCOME-001 shared design; MDL §11.35 close-out follow-up |
| Status | RESOLVED |
| Files changed | `MDL/MDL-Dashboard.html`, `MDL/test/test_render.mjs` (1.2), `MDL/knowledge.json`, and the MDL, common and harness logs |
| Change | Common welcome 1.0.2 drops the focusable `.cw-drop` and uses a named `role="group"` with the native `Choose file` button as the keyboard path. The MDL build inlines the new module and writes `common-version` 1.0.2. |
| Validation | `node common/test/welcome.test.mjs`: 32 passed / 0 failed. `node harness-layout/harness.mjs --dashboard mdl`: 269 passed / 2 failed / 2 advisory / 24 skipped. `node MDL/test/test_render.mjs`: 186 passed / 13 pre-existing failures. See `TL037`. |
| Rollback | Restore welcome 1.0.1 in `common/`, restore the MDL test and rebuild `MDL-Dashboard.html`. |

## U037 — I-164 MDL welcome page adopted from common

| Field | Value |
|---|---|
| Date | 2026-11-26 |
| Issue | I-164 in `MDL/log/issue_log.md` |
| Work item | §11.35 in `MDL/MDL-Dashboard-Workplan.md`; WP-WELCOME-001 W3 |
| Status | RESOLVED |
| Files changed | `MDL/config/ui_help.json` (new), `MDL/knowledge.json` (new), `MDL/build.mjs` (1.1), `MDL/src/render.mjs` (1.1), `MDL/test/test_render.mjs` (1.1), `harness-layout/checks/mdl.mjs` (1.2), `MDL/MDL-Dashboard.html`, `MDL/archive/I-164-welcome-snippets-2026-11-26.txt` (new), and the MDL and common logs |
| Change | `CommonWelcome` 1.0.1 is inlined at build time with its CSS and the `common-version` meta. `boot()` renders from `ui_help.json` in `auto` mode with a Code-sheet check before the full read and three load phases. The old `.welcome*` CSS and `boot()` markup were archived, then removed. The MDL harness config enables Tier 7 and check 51. |
| Validation | `node common/test/welcome.test.mjs`: 29 passed / 0 failed. `node MDL/test/test_shell.mjs`: 125 passed / 0 failed. `node MDL/test/test_render.mjs`: 185 passed / 13 pre-existing failures. `node harness-layout/harness.mjs --dashboard mdl`: 268 passed / 2 pre-existing failures. See `TL036`. |
| Rollback | Restore the listed source files and rebuild `MDL-Dashboard.html`. The archived welcome snippets are in `MDL/archive/`. |

## U036 — Welcome plan moved to common/workplan; §11.35 extended

| Field | Value |
|---|---|
| Date | 2026-11-26 |
| Issue | I-164 in `MDL/log/issue_log.md` |
| Work item | §11.35 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | PLANNED — not started |
| Files changed | `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md` (1.32) |
| Change | The shared plan WP-WELCOME-001 moved from `sub/workplan/` to `common/workplan/Welcome-Page-Workplan.md` (owner instruction). §11.35 gains T11.35.7–T11.35.10 (build inline, archive old welcome, harness config, close-out) and now is the full MDL plan. The I-164 pointer was updated. |
| Validation | None — documentation only. |
| Rollback | Restore §11.35 and the I-164 work-item line from `git`. |

## U035 — I-164 welcome-page gap logged

| Field | Value |
|---|---|
| Date | 2026-11-26 |
| Issue | I-164 in `MDL/log/issue_log.md` |
| Work item | §11.35 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | PLANNED — not started |
| Files changed | `MDL/log/issue_log.md`, `MDL/MDL-Dashboard-Workplan.md` |
| Change | Recorded the MDL welcome-page gap against shared spec §3.7 rev 1.107 / assertions 43–50. Added tasks T11.35.1–T11.35.6 and linked `sub/workplan/Welcome-Page-Workplan.md` phase W3. |
| Validation | None — documentation only. No code, test, build or harness file changed by this entry. |
| Rollback | Remove I-164 and §11.35, then restore the issue-log revision and counts. |
| Note | This entry was added outside the I-163 resize-alignment work. No implementation has started. |

## U034 — Validation Rules resize alignment

| Field | Value |
|---|---|
| Date | 2026-11-25 |
| Issue | I-163 in `MDL/log/issue_log.md` |
| Work item | §11.34 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_grid.mjs`, `MDL/test/test_render.mjs`, `harness-layout/harness.mjs`, `MDL/MDL-Dashboard-Workplan.md`, MDL logs |
| Change | Added content-aware column minima from type floor + header-label width. Added grow-to-fill and kept shrink-to-fit. Made the persisted-width flag live. Cached scroller width so fit runs on container change only. Wrote the clamped width to both colgroups. Replaced the Validation Rules empty state with one cell per visible column. Added harness alignment and label-visibility checks. |
| Validation | Build 309,831 B. Shell 125 / 0. Grid 44 / 1 baseline I-71 failure. Full render 184 / 13 stale failures. Harness 241 passed / 2 failed / 2 advisory / 24 skipped. The two harness failures are the pre-existing Tier 1 shell-zone string checks. |
| Rollback | Restore `MDL/src/render.mjs`, rebuild `MDL/MDL-Dashboard.html`, and restore the tests and harness. No pipeline, spec or schema file changed. |
| Note | The header/body alignment check runs after a real grip drag. The label-visibility check is scoped to `validation_rules` to avoid false failures on intentionally wrapped long headers elsewhere. |

## U033 — Harness ground truth and L3 table discovery

| Field | Value |
|---|---|
| Date | 2026-11-25 |
| Issue | I-162 in `MDL/log/issue_log.md` |
| Work item | §11.33 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs`, `MDL/MDL-Dashboard-Workplan.md`, MDL logs |
| Change | Included blank discipline in harness ground truth. Added `filterDisc` for named chips. Selected chips by exact label. Swept all MDL pages before L3 checks. Used global table indexes and grid keys. Added `pinnedGridKeys` for MDL. Measured rendered cells during resize tests. |
| Validation | Layout harness 236 passed / 2 failed / 2 advisory / 24 skipped. Validation count, KPI total, filter ICA and all four drag / persist checks pass. The two remaining failures are pre-existing Tier 1 shell-zone string checks. |
| Rollback | Restore the two harness files. No dashboard, pipeline, spec or schema file changed. |
| Note | Fixed-layout width restore measurement is skipped. The test still restores the original DOM and storage values. |

## U032 — One zebra token for every table

| Field | Value |
|---|---|
| Date | 2026-11-25 |
| Issue | I-161 in `MDL/log/issue_log.md` |
| Work item | §11.32 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/test/test_render.mjs`, `harness-layout/harness.mjs`, `MDL/MDL-Dashboard-Workplan.md`, MDL logs |
| Change | Added `--ds-zebra` for default, dark, navy, contrast and sepia. Applied it to generic rows, `.ds-table`, matrix rows, C1 attached table cells and pinned even cells. Pinned odd cells now use `--surface`. Removed `.ds-table .over` and the `over` row class. Matrix export reads live theme tokens. |
| Validation | Build 306,700 B. Shell 125 / 0. Grid 42 / 1 baseline I-71 failure. Pipeline 96 / 7 baseline workbook failures. Full render 183 / 196 with 13 unrelated stale failures. Harness 226 passed / 12 failed / 2 advisory / 20 skipped. |
| Rollback | Restore the listed files from Git and run `node build.mjs`. No spec, schema or pipeline file changed. |
| Note | Document Detail remains the reference design. Semantic matrix subrows, TOTAL and current-month tint are unchanged. |

## U031 — Two-panel Validation redesign

| Field | Value |
|---|---|
| Date | 2026-11-25 |
| Issue | I-160 in `MDL/log/issue_log.md` |
| Work item | §11.31 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_render.mjs`, `MDL/test/test_shell.mjs`, `MDL/test/test_grid.mjs`, `harness-layout/checks/mdl.mjs`, `harness-layout/SKILL.md`, `MDL/MDL-Dashboard-Workplan.md`, MDL logs |
| Change | Added `validationRulesPanel` and `validationIssuesPanel`. Both are top-level, numbered and full width. Added pchip tokens for five themes, one chip row per panel, rule CSV / Columns, issue pager with page jump, 200-row pages, full-filtered CSV and updated Help. Pinned Severity and Rule in the issue grid. |
| Validation | Build 306,026 B. Shell 119 / 0. Grid 42 / 1 baseline I-71 failure. Pipeline 96 / 7 baseline workbook failures. Full render 182 / 195 after pagination; 13 failures are stale or outside I-160. Harness 225 passed / 12 failed / 2 advisory / 20 skipped. |
| Rollback | Restore the listed files from Git and run `node build.mjs`. No schema, pipeline or spec file changed. |
| Note | The harness validation-count check exposes the known ground-truth state mismatch that also drives the KPI 7631 / 7445 failure. A separate harness ground-truth issue is proposed. |

## U030 — Overdue List conformance

| Field | Value |
|---|---|
| Date | 2026-11-25 |
| Issue | I-151 … I-159 in `MDL/log/issue_log.md` |
| Work item | §11.30 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_render.mjs`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, MDL logs |
| Change | Moved Overdue controls into one card tool row. Filters sit left and actions sit right. Added 200-row pagination with panel-local page buttons. Hid CSV for an empty result. Moved `Document Title` next to `Document No.` and set wider defaults and per-column minimums. Added type-based alignment helpers. Replaced the hard-coded control gap with tool tokens. Updated help text. |
| Validation | Build 302,980 B. Shell 117 passed / 0 failed. Grid 42 passed / 1 pre-existing I-71 spec-text failure. Pipeline 96 passed / 7 pre-existing workbook-data failures. Layout harness 219 passed / 10 failed / 2 advisory / 22 skipped, with the same 10 failures as the stored baseline. The full jsdom render suite hit the known Node heap limit at 4 GB and 8 GB and produced no result. |
| Rollback | Restore the listed files from Git and run `node build.mjs`. No schema, pipeline or spec file changed. |
| Note | The Overdue part of I-121 is closed. I-121 stays open for other bounded tables. |

## U029 — Chart column centers match attached-table column centers

| Field | Value |
|---|---|
| Date | 2026-11-25 |
| Issue | I-150 in `MDL/log/issue_log.md` |
| Work item | §11.29 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `Dashboard-UI-Design-Spec.md` + harness copy (rev 1.106), `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, workplan and MDL logs, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs`, harness docs |
| Change | Spec rev 1.106 requires every chart column center to match the matching attached-table header center within 2 px. MDL is in scope for geometry while rev 1.74 still excludes it from two-way sync state. Assertion 42 added. `curveChart()` uses the supplied width; `curvePlotWidth()` passes the real `plot.clientWidth` in `curveDraw()` and `curveExportMarkup()`, so the SVG no longer scales below the table tracks. Harness `boardTable` adds a center check with `centerBandSelector` and `centerTolerance:2`. |
| Validation | Syntax PASS. Build 302,450 B. Shell 111 passed / 0 failed; pipeline 96 / 7 and grid 42 / 1 at baseline. Harness 219 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to baseline; all eight board-contract checks pass. Live at 1440 px, 31 months: `viewBox` 451, SVG width 451, scale 1; deltas `+0.02 / +0.23 / +0.16 px` at columns 0 / 15 / 30. PNG download `TWRP-C3B2_Issue-Progress_2026-11-25.png`. |
| Rollback | Restore the listed files from Git and run `node build.mjs`. No pipeline or schema changed. |
| Note | Both spec copies byte-identical at SHA-256 `48DE0BE7D04E5DFCD88AADB9EFE270E3407964C4F6057EEB4417423080B9ECDB`. A hidden panel still uses `curveFallbackWidth()`; the ResizeObserver redraws it with the real width. |

## U028 — ONE table-header design for every table type

| Field | Value |
|---|---|
| Date | 2026-11-24 |
| Issue | I-149 in `MDL/log/issue_log.md` |
| Work item | §11.28 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `Dashboard-UI-Design-Spec.md` + harness copy (rev 1.105), `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, workplan and MDL logs, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs`, harness docs |
| Change | Spec rev 1.105 makes navy fill with white text the one header design for bounded, keyed, semantic and chart-attached tables. The rev 1.103 light attached-table variant is superseded. MDL scoped CSS and PNG / Copy export now resolve `--navy` and set white header text. Harness `boardTable` expects `--navy` fill and `rgb(255, 255, 255)` text; a stale outer-scope variable in that check was corrected. |
| Validation | Syntax PASS. Build 302,295 B. Shell 110 passed / 0 failed; pipeline 96 / 7 and grid 42 / 1 at baseline. Harness 218 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to baseline; all seven board-contract checks pass. Live browser: attached `rgb(15, 45, 82)` / white, independent `rgb(15, 45, 82)` / white. |
| Rollback | Restore the listed files from Git and run `node build.mjs`. No pipeline or schema changed. |
| Note | Both spec copies byte-identical at SHA-256 `FBBEF9EE5FB513EB12CC5B70FDF77DF7A235B2264E394AF3891FC2AC4BD16646`. Chart-specific gap, fit, header rotation, column sync and CSV rules are unchanged. |

## U027 — Attached-table CSV and Y-axis caption typography

| Field | Value |
|---|---|
| Date | 2026-11-24 |
| Issue | I-148 in `MDL/log/issue_log.md` revision 1.25 |
| Work item | §11.27 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `Dashboard-UI-Design-Spec.md` + harness copy (rev 1.104), `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, workplan and MDL logs, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs`, harness docs |
| Change | Added the spec-required `⤓ CSV` action to the chart tool row before PNG, backed by a full-window serializer (month headers + six metric rows, UTF-8 BOM, `xp()` filename) and hidden when the table is empty. Centred the "Documents" caption near the Y axis, rotated it to read bottom-to-top, and made the caption and all Y tick labels bold in `--text2`. Harness board-contract tier now asserts CSV presence, visibility and order before image actions. |
| Validation | Live browser: caption offset 0 px from gutter centre, 3 px inset, `font-weight:700` on caption and ticks, `--text2`, 180° rotation; downloaded `TWRP-C3B2_Issue-Progress-Table_2026-11-24.csv` with BOM and 7 lines. Screenshot `harness-layout/run-mdl-i148-ycap.png`. Shell 110 passed / 0 failed; pipeline 96 / 7 and grid 42 / 1 at baseline; harness 218 passed / 10 failed / 2 advisory / 22 skipped with the 10 failures identical to baseline. |
| Rollback | Restore the listed files from Git and run `node build.mjs`. No pipeline or schema changed. |
| Note | Both spec copies byte-identical at SHA-256 `10B2618DA63ABC43F4B763E657F6B88731DA176895B14F0E6E9C261B2F0E5945`. A `font:` shorthand with `var(--font-ui)` did not apply bold in the browser; explicit `font-weight` properties were used and re-verified. |

## U026 — Attached-table gap, board fit and themed header fill

| Field | Value |
|---|---|
| Date | 2026-11-24 |
| Issue | I-147 in `MDL/log/issue_log.md` revision 1.24 |
| Work item | §11.26 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `Dashboard-UI-Design-Spec.md` + harness copy (rev 1.103), `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, MDL log files, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs`, harness docs |
| Change | General requirements: `--c1-plot-table-gap:10px` separates plot and table with independently rounded corners; `min-width:0` flexible grid stops board scrolling; >13-column tables rotate month headers into an 88 px vertical band; attached-table headers use theme `--surface2` with `--text2` / `--navy` text in render and PNG / Copy export. Harness gains a config-gated general `boardTable` tier checking all three plus fit and corners. |
| Validation | Live at 1280 px: gap 10 px, host `client = scroll = 477 px`, grid `min-width:0`, `c1-many` active, vertical headers 88 px, header fill `rgb(241,245,249)`. Screenshots `run-mdl-i147-board.png` and `run-mdl-i147-header-zoom.png`. Shell 106 passed / 0 failed; pipeline 96 / 7 and grid 42 / 1 at baseline; harness 217 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to baseline, with all six new board-contract checks passing. |
| Rollback | Restore the listed files from Git and run `node build.mjs`. No pipeline or schema changed. |
| Note | Both spec copies byte-identical at SHA-256 `8EF6A9CE7BE04E74F657437F6FD59436769A38497C69B4FE21B42D326A27926F`. The old I-142 square-corner assertion was updated for the separated-zone rule; no assertion was weakened. |

## U025 — General two-row chart head (spec rev 1.102)

| Field | Value |
|---|---|
| Date | 2026-11-24 |
| Issue | I-146 in `MDL/log/issue_log.md` revision 1.23 |
| Work item | §11.25 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `Dashboard-UI-Design-Spec.md` + `harness-layout/spec/` copy (rev 1.102), `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/test_log.md`, `MDL/log/update_log.md` |
| Change | The reviewed chart head became a GENERAL requirement for all dashboards in spec rev 1.102 — not a deviation. §4.2 now requires two rows (right-aligned tool row above, full-width time bar row below, 10 px / 2 px gaps), chips before the period text, no explanatory project-start caption, and the tool row hidden in print; §7.5 B2.1 keeps Sub as the reference for geometry, tokens and states while its one-row composition is superseded. MDL markup/CSS now follow it; the project-start note was removed and the Help text aligned with the rendered lines. |
| Validation | Live browser: tools above and right-aligned, row gaps 10 px / 2 px, text after chips, no project caption, print hides tools / track / chips and keeps the period text. Screenshot `harness-layout/run-mdl-i146-two-row.png`. `node --check src/render.mjs` exit 0; build at 300,395 B; shell 101 passed / 0 failed; pipeline 96 / 7 and grid 42 / 1 at baseline; full harness 211 passed / 10 failed / 2 advisory / 22 skipped with a failure set identical to the HEAD baseline. |
| Rollback | Restore the listed files from Git and run `node build.mjs`. No pipeline or schema changed. |
| Note | Both spec copies are byte-identical at SHA-256 `4F924B04BEC922B190D90CEF1EB12027C840526054C42B0502BE07ACF82008E5`. The sample page in `MDL/Arch/` was the approved review reference and now matches the shipped layout. |

## U024 — Time-bar fill aligned with the thumbs

| Field | Value |
|---|---|
| Date | 2026-11-23 |
| Issue | I-145 in `MDL/log/issue_log.md` revision 1.22 (owner report) |
| Work item | §11.24 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/test_log.md`, `MDL/log/update_log.md` |
| Change | The I-144 markup nested `.c1-fill` inside `.c1-track`, the 4 px line element, so the fill's `top:12px` resolved against the 4 px-tall track box and the highlight rendered below the track. The fill is now a sibling of the track line and ticks inside the 26 px zone, matching the Sub reference DOM. A regression check asserts the sibling order. |
| Validation | Live-browser Playwright measurement of the built dashboard with the real workbook: `All` window — fill top 302.5 px equals track top, height 4 px, computed left 7 px / width 206 px per the pinned formula; `12M` window (19..30 of 31) — fill left 1023.42 px vs expected thumb position 1023.44 px, right edge 1098.95 px vs 1098.97 px. Screenshots `harness-layout/run-mdl-i145-fix.png` and `run-mdl-i145-fix-12m.png`. `node test/test_shell.mjs` 95 passed / 0 failed; `test_pipeline.mjs` 96 passed / 7 failed and `test_grid.mjs` 42 passed / 1 failed, both at baseline. |
| Rollback | Restore the listed files from Git and run `node build.mjs`. No pipeline or schema changed. |
| Note | Spec rev 1.101 already required this alignment; no spec change was needed. The I-144 static shell checks missed it because they matched CSS strings, not nesting — the new check asserts the markup order. |

## U023 — Time bar and segmented control aligned with the Sub reference design

| Field | Value |
|---|---|
| Date | 2026-11-23 |
| Issue | I-144 in `MDL/log/issue_log.md` revision 1.21 |
| Work item | §11.23 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Spec | Spec rev 1.101 — the Sub dashboard is the normative reference implementation; C1 time bar geometry pinned in §4.2; segmented standard in §7.5 B2.1; the MDL / PPP deviation row retired; the 2026-11-23 `--blue` chip decision superseded by the navy active fill |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/test_log.md`, `MDL/log/update_log.md` |
| Change | Added the shared `--seg-*` tokens to `:root` and the full B2.1 state set (hover, active, active-hover, pressed, focus, focus-on-active) to the panel segmented group. Pinned the Sub time bar geometry: `--c1-thumb:14px`, 4 px `--border` track, 4 px `--blue` fill, solid blue thumbs with a 2 px `--surface` border and 1 px `--blue` ring, `grab` / `grabbing` cursors and an active scale of 1.15. Ticks moved inside the track zone with January year labels; window-interior `is-active` and handle `is-near` semantics. Fill and ticks use thumb-compensated `calc()` positioning. Inputs set `step="1"` explicitly. Presets anchor at the current `to` index. Cluster order is label, track, period text, chips; the period text reads `Month – Month`. Removed the dead `wide` class toggle. Defined the previously missing `--surface2` / `--surface3` / `--text2` tokens with a dark-theme set. |
| Validation | `node --check src/render.mjs`: exit 0. `node build.mjs` wrote the bundle at 300,479 bytes. `node test/test_shell.mjs`: 94 passed / 0 failed, including ten new rev 1.101 alignment checks and the runtime panel checks. `node test/test_pipeline.mjs`: 96 passed / 7 failed and `node test/test_grid.mjs`: 42 passed / 1 failed, both at baseline. Full MDL harness: 211 passed / 10 failed / 2 advisory / 22 skipped, failure set identical to the HEAD-build baseline. |
| Rollback | Restore the listed files from Git and run `node build.mjs` again. No data pipeline or schema changed. |
| Note | The spec copies are byte-identical at SHA-256 `85F43B63AE83CF504EDCA6E40EEB45D197CE7099E6B7F42B4CCC4FDFB59EFF16`. Sub dashboard code did not change. |

## U022 — Full harness layout verification of the I-137…I-143 build

| Field | Value |
|---|---|
| Date | 2026-11-23 |
| Issue | I-142 (verification) in `MDL/log/issue_log.md` revision 1.20 |
| Work item | §11.22 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `MDL/log/test_log.md` (TL023), `MDL/MDL-Dashboard-Workplan.md` (§11.22 evidence), `MDL/log/update_log.md`; harness side: `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs`, `harness-layout/SKILL.md`, `harness-layout/log/*` |
| Change | Ran the full MDL layout harness against the HEAD build for a byte-exact baseline, against the new build, and again after a config-gated harness fix. `lintTableCrosshair()` now treats the configured `chartLinkedClass` (`curve-c1-table`) as the §7.2.16 chart-linked family. Recorded as harness `I006` / `U008` / SKILL 1.21. |
| Validation | HEAD baseline 201 passed / 10 failed / 2 advisory / 22 skipped — matches TL021. New build 210 passed / 12 failed before the harness fix; 211 passed / 10 failed after it, with the failure set identical to the baseline. Shell suite 84 passed / 0 failed; pipeline 96 passed / 7 failed and grid 42 passed / 1 failed, both at baseline. |
| Rollback | Revert the listed harness files and MDL log files from Git. No dashboard source or pipeline changed in this entry. |
| Note | The 2 pre-fix Progress failures were a harness detection gap, not a dashboard defect; the probe proved `colActive:7, colHover:0` per spec §7.2.16. The 10 remaining failures are the pre-existing baseline set (I-119 data mismatches, I-95 grid failures, two Tier 1 shell markers). |

## U021 — Issue Progress panel aligned with spec rev 1.100

| Field | Value |
|---|---|
| Date | 2026-11-23 |
| Issue | I-137 … I-143 in `MDL/log/issue_log.md` revision 1.20 |
| Work item | §11.22 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/test_log.md`, `MDL/log/update_log.md` |
| Change | Added an 18-unit reference-label band, 12-unit legend inset, right reserve, 10-unit top pad and 18-unit row pitch. Moved Y ticks into the gutter. Removed the in-SVG `Docs` caption and bottom month labels. Set the preset default to `All`, added `data-c1period`, index-based ticks, the blue active chip, wide nowrap and a scoped print rule. Tokenised the plot fill. Moved the attached table onto the shared binder and kept chart-linked state on `col-active`. Added plot tap-to-show, `aria-describedby`, tokenised gradients and `.sc-area` paths for all three cumulative series. Export now resolves gradient tokens and draws the gutter ticks. |
| Validation | `node build.mjs` wrote the bundle at 298,581 bytes. `node test/test_shell.mjs`: 84 passed / 0 failed, including six panel runtime checks, two C1 binder runtime checks and two generic-table crosshair regression checks. `node test/test_pipeline.mjs`: 96 passed / 7 failed and `node test/test_grid.mjs`: 42 passed / 1 failed, unchanged from baseline. `node --check src/render.mjs`: exit 0. Lint diagnostics: 0. |
| Rollback | Restore the listed files from Git and run `node build.mjs` again. No data pipeline or schema changed. |
| Note | Owner approved P1, P2 and P3 on 2026-11-23 and chose `All`, the shared binder and `--blue`. `test_render.mjs` remains unrun because the full-workbook render exceeds the sandbox memory limit. |

## U020 — S-curve spec review, seven issues, and issue-log consolidation

| Field | Value |
|---|---|
| Date | 2026-11-23 |
| Issue | I-137 … I-143 in `MDL/log/issue_log.md` |
| Work item | §11.22 in `MDL/MDL-Dashboard-Workplan.md` |
| Status | DONE |
| Files changed | `Dashboard-UI-Design-Spec.md`, `harness-layout/spec/Dashboard-UI-Design-Spec.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/Arch/mdl-issues.md` (moved from `MDL/`), `MDL/MDL-Dashboard-Workplan.md`, `AGENTS.md`, `harness-layout/_chk.mjs`, three I95/I96/I136/I122 reports and two phase workplans under `MDL/workplan/` |
| Change | Added spec rev 1.100 to both byte-identical copies with the B1-B8 rules and assertions 37 and 38. Raised seven separate S-curve design issues. Added workplan §11.22. Appended the 133-row historical register to `MDL/log/issue_log.md`. Kept I-137 … I-143 in the per-issue sections and omitted their register rows. Moved the former ledger to `MDL/Arch/mdl-issues.md`. Rewrote every old-path reference in the same edit cycle, including the path in `harness-layout/_chk.mjs`. |
| Validation | Both spec copies have the same SHA-256 hash. One valid reference to the archived path remains. No reference to the former root path remains. Register probe on the merged file: 133 rows, 20 malformed and one unmatched status. The same 20 rows and the same unmatched status exist in the archived copy, so the merge added no new defect. `node test/test_shell.mjs`: 60 passed / 0 failed. `node test/test_pipeline.mjs`: 96 passed / 7 failed. `node test/test_grid.mjs`: 42 passed / 1 failed. Lint diagnostics: 0. |
| Rollback | Restore the listed files from Git and remove `MDL/Arch/mdl-issues.md`. Rebuild nothing: no dashboard source or built HTML changed. |
| Note | `harness-layout/_chk.mjs` still uses `require` in an `.mjs` file, so `node harness-layout/_chk.mjs` raises `ReferenceError: require is not defined in ES module scope`. That is pre-existing. The equivalent CommonJS probe was used for the numbers above. `test_render.mjs` was not run because the full-workbook render exceeds the sandbox memory limit. The 7 pipeline failures and the 1 grid failure pre-date this documentation-only change. Owner decision 2026-11-23: keep both records for 17 issues (I-35 and I-121 … I-136). Each has a per-issue section and a register row. The combined log holds 133 register rows and 24 detailed sections for 140 unique issues. |

## U019 — Issue Progress panel conformance

| Field | Value |
|---|---|
| Date | 2026-11-22 |
| Issue | I-136 in `MDL/log/issue_log.md` |
| Work item | T11.21.1–T11.21.11 in `MDL/workplan/MDL-I136-Issue-Progress-Workplan.md` |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/workplan/MDL-I136-Issue-Progress-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md`, `MDL/workplan/reports/MDL-I136-Issue-Progress-Report-2026-11-22.md` |
| Change | Rebuilt the Issue Progress panel from the approved sample. Replaced fixed ticks and the single legend row. Added a fixed right reserve, dual-scale styling, bar labels for every non-zero bar, a C1 dual-handle time bar with five presets, a native attached table, chart and table crosshair sync, and hidden band and snap line. Export and print remove transient hover state. |
| Validation | Syntax PASS. Lint PASS. Build wrote `MDL-Dashboard.html` at 296,804 B. Pipeline 96 passed / 7 failed. Full harness 201 passed / 10 failed / 2 advisory / 22 skipped. Tier 5 36 passed / 0 failed / 0 advisory / 3 skipped. Chromium at 1366 × 768 and 1920 × 1080 reports no console errors. TL021 records all commands. |
| Rollback | Restore the listed files from Git and rebuild `MDL-Dashboard.html`. |
| Note | P5 fixed a shared-crosshair defect found by the harness. P6 removed an invalid mode-element write found by the browser probe. No shared spec or harness file changed. |

## U018 — Sidebar toggle page layout

| Field | Value |
|---|---|
| Date | 2026-11-21 |
| Issue | I-135 in `MDL/log/issue_log.md` |
| Work item | T11.20 in `MDL/MDL-Dashboard-Workplan.md` §11.20 |
| Status | DONE |
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `harness-layout/checks/mdl.mjs`, `harness-layout/harness.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `Dashboard-UI-Design-Spec.md`, `harness-layout/spec/Dashboard-UI-Design-Spec.md`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `Dashboard-UI-Design-Spec.md`, `harness-layout/spec/Dashboard-UI-Design-Spec.md`, `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md`, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md`, `harness-layout/harness.mjs` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md`, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/update_log.md`, `MDL/log/test_log.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/test/test_shell.mjs`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/log/issue_log.md`, `MDL/log/test_log.md`, `harness-layout/harness.mjs`, `harness-layout/checks/mdl.mjs`, `MDL/workplan/reports/MDL-I122-Vertical-Scroll-Report-2026-11-20.md` |
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
| Files changed | `MDL/src/render.mjs`, `MDL/MDL-Dashboard.html`, `MDL/MDL-Dashboard-Workplan.md`, `MDL/log/issue_log.md`, `MDL/test/test_render.mjs`, `MDL/test/test_shell.mjs`, `MDL/log/issue_log.md`, `MDL/log/test_log.md` |
| Change | Added spec shell markers, left navigation, active page label, Settings and Help, theme and layout state, top-menu Export, inlined XLSX writer, and uniform download names. Removed Print / Save PDF. Held Breakdown for MDL. |
| Validation | `node --check src/render.mjs` passed. `node build.mjs` wrote `MDL-Dashboard.html` at 262,109 B. Tests recorded in TL001–TL003. |
| Rollback | Restore the previous `src/render.mjs`, rebuild `MDL-Dashboard.html`, and restore the previous workplan and logs from Git history. |
| Note | Other rev 1.96 gaps remain open under I-121. |
