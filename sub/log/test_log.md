# Submittal Dashboard Test Log

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-24 | Codex | Recorded the passing Wave 3 pipeline tests and source workbook totals. |
| 1.2 | 2026-10-24 | Codex | Recorded Wave 4 unit, schema, and Tier 1–4 browser harness results. |
| 1.1 | 2026-10-24 | Codex | Reconciled the Wave 3 test record with the final 12-test run. |
| 0.9 | 2026-10-24 | Codex | Logged the passing shared knowledge schema tests. |
| 0.8 | 2026-10-24 | Codex | Logged the harness Tier 1 result against the archived sample. |
| 0.7 | 2026-10-24 | Codex | Logged the harness syntax and knowledge JSON syntax checks after the folder and path updates. |
| 0.6 | 2026-10-24 | Codex | Clarified the Wave 2 folder check after the dashboard-specific folder decision. |
| 0.5 | 2026-10-24 | Codex | Logged the final Wave 2 scaffold checks and schema blocker. |
| 0.4 | 2026-10-24 | Codex | Logged Wave 2 scaffold checks and the schema validation blocker. |
| 0.3 | 2026-10-24 | Codex | Corrected the previous harness result details and logged Wave 1 as not applicable. |
| 0.2 | 2026-10-24 | Codex | Logged that Wave 1 required no runtime tests. |
| 0.1 | 2026-10-24 | Codex | Recorded layout harness validation. |

## Tests

| PHASE-004 | 2026-10-24 | Wave 4 | Dashboard UI, two-workbook loading, and layout | `npm test`; knowledge schema unittest; harness Tiers 1–4 | PASS | 16 Node tests pass (12 pipeline, 4 render); 4 knowledge schema tests pass. Harness: T1 9 pass; T2 24 pass; T3 4 pass, 4 skipped; T4 65 pass, 0 fail, 10 skipped, 0 advisory warnings. W-FORMULA checks skip because neither source workbook has formula errors. See Wave 4 report. |
| TEST-012 | 2026-10-24 | T4.1 | Live project-root dashboard | `node harness.mjs --dashboard sub --tier 1` | PASS | 9 passed, 0 failed, 0 skipped. Checks root page, project-local assets, stable shell zones, and required content zones. |
| TEST-013 | 2026-10-24 | T4.1 | Live dashboard shell | `node harness.mjs --dashboard sub --tier 2` | PASS | 24 passed, 0 failed, 0 skipped. Checks shell geometry, warning width, sidebar controls, and viewport fit in Chromium. |
| TEST-014 | 2026-10-24 | T4.1 | Live dashboard data and filters | `node harness.mjs --dashboard sub --tier 3` | PASS | 4 passed, 0 failed, 4 skipped. Planned total 7,513, BIM filter count 11, validation issue count 14,867, and status bar total match the pipeline. Formula warning checks skip because no formula-error cells exist. |
| TEST-015 | 2026-10-24 | T4.1 | Live dashboard tables and controls | `node harness.mjs --dashboard sub --tier 4` | PASS | 65 passed, 0 failed, 10 skipped, 0 advisory warnings. Checks table geometry, pinned columns, column chooser, resizing, issue windowing, contrast, sticky headers, and warning/search controls. |
| TEST-016 | 2026-10-24 | T4.1 | Dashboard JavaScript and JSON configuration | `node --check` for dashboard, render, pipeline, XLSX reader, and harness modules; JSON parse for UI help and knowledge files | PASS | All syntax and JSON parse checks pass. |

| ID | Date | Task | Target | Command | Result | Details |
|---|---|---|---|---|---|---|
| PHASE-002 | 2026-10-24 | Wave 2 | Project scaffold and initial knowledge record | See Wave 2 report | PASS | Folder checks, schema validation, and schema tests pass. See Wave 2 and Wave 2.1 reports. |
| TEST-004 | 2026-10-24 | Wave 2 | Project scaffold | Python scaffold assertion: required folders, knowledge fields, and test locations | PASS | At the original check, the generic project folders and `workplan/reports/` existed; required knowledge sections existed; no test files existed outside `sub/test/`. The dashboard folder rule was later narrowed: `ui/`, `data/`, and `output/` are optional. |
| TEST-005 | 2026-10-24 | Wave 2 | `sub/knowledge.json` | `python -m json.tool sub/knowledge.json` | PASS | The file is valid JSON syntax. This does not establish schema validity. |
| TEST-006 | 2026-10-24 | Wave 2 | `sub/knowledge.json` against `config/schemas/knowledge_base_schema.json` | Initial schema validation | BLOCKED (historical) | The shared schema was absent at the initial scaffold check. I002 was later resolved; see TEST-010 and the Wave 2.1 report. |
| TEST-007 | 2026-10-24 | Folder-scope alignment | `harness-layout/harness.mjs`; `harness-layout/checks/sub.mjs` | `node --check harness-layout/harness.mjs && node --check harness-layout/checks/sub.mjs` | PASS | Both modified harness files pass JavaScript syntax checks. The browser geometry tier was not run. |
| TEST-008 | 2026-10-24 | Folder-scope alignment | `sub/knowledge.json` | `python -m json.tool sub/knowledge.json` | PASS | Knowledge file parses as valid JSON. This does not establish schema validity. |
| TEST-009 | 2026-10-24 | Folder-scope alignment | Archived sub dashboard sample and revised Tier 1 asset checks | `node harness-layout/harness.mjs --dashboard sub --tier 1` | FAIL (expected legacy sample) | 5 passed, 3 failed, 1 skipped. The sample loads from `sub/archive/`; its local CSS check passes. Three shell/module checks fail because this archived mockup predates the current shell markers and module implementation. |
| PHASE-002.1 | 2026-10-24 | Wave 2.1 | Shared knowledge schema | `python -m unittest discover -s sub/test -p 'test_knowledge_schema.py' -v` | PASS | Four tests pass. The schema validates against Draft 7, both source files validate, a page-to-function graph validates, and an edge without a target ID fails validation. |
| TEST-010 | 2026-10-24 | Wave 2.1 | Shared knowledge schema and graph structures | `python -m unittest discover -s sub/test -p 'test_knowledge_schema.py' -v` | PASS | 4 tests passed using Python 3.13.11 and jsonschema 4.26.0. JSON Schema does not check duplicate node IDs or whether edge endpoint IDs exist. |
| PHASE-003 | 2026-10-24 | Wave 3 | XLSX parsing, normalization, validation, joins, and row calculations | `npm test` (from `sub/`) | PASS | 12 tests pass. Current totals: 7,717 MDL row candidates (7,631 with document numbers); 183 dated submissions, 129 returned, and 54 open. Returned-row formula comparisons: 258, with no differences. See the Wave 3 report. |
| TEST-011 | 2026-10-24 | Wave 3 | Sub dashboard pipeline | `node test/pipeline.test.mjs` (from `sub/`) | PASS | Covers source parsing, required headers and sheets, error-level duplicate MDL IDs, ambiguous and multiple links, orphan rows, workbook-defined status rules, delay calculations, formula errors, and formula-cache comparisons. |
| PHASE-001 | 2026-10-24 | Wave 1 | Workplan approval and stack choice | Not applicable | NOT APPLICABLE | Wave 1 changed planning records only. No runtime tests were required. See `workplan/reports/Wave-1-Approval-and-Stack-Decision.md`. |
| TEST-001 | 2026-10-24 | T0.1 | `sub/archive/Document-Submittal-Dashboard-Sample.html` | `node --check harness-layout/harness.mjs` | PASS | Harness syntax check passed. |
| TEST-002 | 2026-10-24 | T0.1 | Current sub dashboard sample | `node harness-layout/harness.mjs --dashboard sub --tier 1` | FAIL (expected legacy sample) | 4 passed, 4 failed, 1 skipped. The static sample predates the required shell markers and project-local UI stylesheet and script links. These failures show that the sample does not conform; they do not indicate a harness pass. |
| TEST-003 | 2026-10-24 | T0.1 | Browser shell harness | `node harness-layout/harness.mjs --dashboard sub --tier 2` | FAIL (environment) | Chromium launch failed with `Operation not permitted` in the sandbox. The runtime geometry assertions were not executed. |
