# Wave 4 Report — Dashboard UI and Workbook Loading

| Revision | Date | Author | Summary |
|---|---|---|---|
| 0.1 | 2026-10-24 | Codex | Recorded the Wave 4 dashboard, workbook loading, and browser harness results. |

**Document ID**: SUB-REPORT-W4-001  
**Workplan**: `sub/workplan/Sub-Dashboard-Workplan.md` (Document ID `SUB-WP-001`, revision 2.0)  
**Status**: COMPLETE  
**Start**: Timestamp not captured; work began in the prior execution turn  
**End**: 2026-10-24 02:01 UTC

## Index

1. [Objective and scope](#1-objective-and-scope)
2. [Execution summary](#2-execution-summary)
3. [Method and environment](#3-method-and-environment)
4. [Results and success criteria](#4-results-and-success-criteria)
5. [Files created or changed](#5-files-created-or-changed)
6. [Recommendations and lessons](#6-recommendations-and-lessons)

## 1. Objective and scope

Build the dashboard UI and browser file-load flow. Keep the dashboard HTML in the project root. Run the dashboard layout harness in Chromium and update project records.

## 2. Execution summary

Added the project-root dashboard page, project-local styling and runtime modules, help configuration, and local Python server. The load flow accepts the MDL and Submittal Log workbooks and passes them to the Wave 3 reader and pipeline. The dashboard renders overview, submission, validation, forward-plan, analytics, help, and settings views from shared state.

The layout harness now targets the live project-root page. It injects both workbooks and checks the live dashboard. The supported Chromium environment completed the shell and table geometry checks. I003 is resolved.

## 3. Method and environment

- Node.js 20.20.2 ran the pipeline and render tests.
- Python 3.13.11 and jsonschema 4.26.0 ran the knowledge schema tests.
- Playwright Chromium ran harness Tiers 2–4 against the local dashboard server.
- Syntax checks passed for dashboard, render, pipeline, reader, and harness modules. UI help and knowledge JSON parsed successfully.
- Source workbooks were loaded for checks. The dashboard did not write to them.

## 4. Results and success criteria

| Check | Result | Detail |
|---|---|---|
| Dashboard page location and project-local assets | PASS | Tier 1: 9 passed, 0 failed. The HTML is in the project root and does not load repository `common/` assets. |
| Shell and viewport geometry | PASS | Tier 2: 24 passed, 0 failed. All shell zones, dimensions, sidebar controls, warning width, and viewport fit pass. |
| Workbook load and derived data | PASS | Tier 3: 4 passed, 0 failed, 4 skipped. Planned total 7,513, BIM filter count 11, validation issues 14,867, and status-bar total match the pipeline. |
| Table and control layout | PASS | Tier 4: 65 passed, 0 failed, 10 skipped, 0 advisory warnings. Checks include table geometry, sticky headers, pinned columns, chooser, resize, issue windowing, contrast, search, and warning controls. |
| Pipeline and render tests | PASS | `npm test`: 12 pipeline tests and 4 render tests passed. |
| Knowledge schema tests | PASS | 4 tests passed for EKS, sub, graph nodes/edges, and invalid edge structure. |
| Formula warning checks | NOT APPLICABLE | The current workbooks contain no formula-error cells; the related Tier 3 checks skip. |
| Wave 4 acceptance | COMPLETE | Both workbook files load into the dashboard flow. The UI and integration checks pass. Report and logs are filed. |

## 5. Files created or changed

| Path | Change |
|---|---|
| `sub/TWRP C3B2 - Document Submittal Dashboard.html` | Added the project-root dashboard shell and runtime entry point. |
| `sub/engine/dashboard.css` | Added project-local shell, themes, and component styles. |
| `sub/engine/dashboard.js` | Added workbook loading, filters, navigation, and shell interactions. |
| `sub/engine/render.js` | Added derived dashboard views and table rendering. |
| `sub/config/ui_help.json` | Added help, labels, and runtime UI text. |
| `sub/serve.py` | Added the local static server. |
| `sub/test/render.test.mjs` | Added render and shared-filter tests. |
| `sub/package.json` | Added the serial pipeline and render test command. |
| `harness-layout/harness.mjs` | Added paired-workbook and live-page layout checks. |
| `harness-layout/checks/sub.mjs` | Configured the live Sub dashboard target and check pages. |
| `sub/knowledge.json` | Recorded the completed Wave 4 architecture and issue status. |
| `sub/workplan/Sub-Dashboard-Workplan.md` | Marked Wave 4 complete and updated the revision. |
| `sub/log/issue_log.md` | Resolved I003 with browser test evidence. |
| `sub/log/update_log.md` | Recorded Wave 4 delivery. |
| `sub/log/test_log.md` | Recorded Wave 4 test and harness results. |

## 6. Recommendations and lessons

Run Wave 5 regression checks for missing or swapped files, workbook structure, duplicate MDL IDs, orphan rows, multiple submissions, calculated fields, and filter totals. Then complete the manual owner review in Wave 6.
