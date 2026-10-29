# Wave 3 Report — Data Pipeline

| Revision | Date | Author | Summary |
|---|---|---|---|
| 0.1 | 2026-10-24 | Codex | Recorded S0–S3 pipeline work, validation results, and current workbook findings. |
| 0.2 | 2026-10-24 | Codex | Reconciled the report with the final 12-test run and row-level validation counts. |

**Document ID**: SUB-REPORT-W3-001  
**Workplan**: `sub/workplan/Sub-Dashboard-Workplan.md` (Document ID `SUB-WP-001`, revision 1.8)  
**Status**: COMPLETE  
**Start**: 2026-10-24 01:18 UTC  
**End**: 2026-10-24 01:38 UTC

## Index

1. [Objective and scope](#1-objective-and-scope)
2. [Execution summary](#2-execution-summary)
3. [Method and environment](#3-method-and-environment)
4. [Results and success criteria](#4-results-and-success-criteria)
5. [Files created or changed](#5-files-created-or-changed)
6. [Recommendations and lessons](#6-recommendations-and-lessons)

## 1. Objective and scope

Build and test the workbook reader and S0–S3 pipeline. Read both source workbooks. Normalize rows,
validate source fields and business rules, link submissions only to one matching MDL row, recalculate
turnaround and delay, and compare returned-row results with cached workbook values.

## 2. Execution summary

Added a project-local XLSX reader, pipeline contract, and normalization and validation pipeline. The
pipeline reads field maps, status domains, and rule text from workbook Code sheets. It reads Submittal
Log headers by label. It retains duplicate MDL rows and returns a validation error for each affected
row. It marks links to duplicate MDL numbers as ambiguous and does not assign them to a plan row.

The current inputs contain 7,717 planned row candidates. Of these, 7,631 have a document number and
86 have a blank document number. The log has 183 dated submission rows: 129 returned and 54 open.
There are 232 repeated MDL document numbers (7,353 affected rows), 1,754 placeholder document
numbers, and 5,656 rows with one or more missing required fields. The log has 17 orphan rows, one
ambiguous submission link, and one V-30 timeline issue. The 86 blank MDL document numbers receive
V-01. These are row-level validation results. The pipeline does not change either workbook.

Returned-row calculations match the cached workbook values in 258 comparisons (129 turnaround and
129 delay comparisons). Open delay is recalculated from the local as-of date and target return date.
All 12 pipeline tests pass.

## 3. Method and environment

- Node.js 20.20.2; no runtime dependencies.
- `npm test` from `sub/` runs the pipeline test file.
- `node --check` passed for the reader, pipeline, and test file.
- Tests read the two current workbooks and use a fixed as-of date of 2026-10-24.

## 4. Results and success criteria

| Check | Result | Detail |
|---|---|---|
| Workbook parsing | PASS | Both `.xlsx` workbooks and their named sheets parse. |
| Source contracts | PASS | MDL Code field maps and both workbooks' status and error tables load. Required sheets and headers are checked. |
| Header errors | PASS | Missing and repeated required Submittal Log headers fail with a source-specific message; case and whitespace differences are accepted. |
| MDL IDs and joins | PASS | All MDL rows remain separate. Duplicate IDs raise V-26 Error. Repeated MDL matches stay ambiguous; multiple log submissions to one unique MDL row are allowed. |
| Orphans and rule checks | PASS | V-01, V-15, V-16, V-18, V-20, V-21, V-23, V-25, V-26, V-29, V-30, V-31, and V-33 checks are covered (V-33 added 2026-10-29, post-Wave 3). |
| Calculated fields | PASS | Open delay is zero on or before target and positive after target. Early returned delay remains negative. Turnaround is recalculated from submission and return dates. |
| Formula comparison | PASS | 258 returned-row comparisons; no differences. Open rows are recalculated because cached `TODAY()` results can be stale. |
| Formula-error handling | PASS | Formula-error cells become absent values and produce a fatal field warning. |
| Test suite | PASS | 12 tests pass. |
| Wave 3 acceptance | COMPLETE | S0–S3 pipeline code, tests, workplan, report, and logs are complete. |

## 5. Files created or changed

| Path | Change |
|---|---|
| `sub/engine/xlsx-reader.js` | Added the project-local browser XLSX reader, adapted from MDL. |
| `sub/engine/pipeline.js` | Added source-contract parsing, normalization, validation, linking, and row calculations. |
| `sub/config/pipeline_contract.json` | Added required source sheets, fields, and headers. |
| `sub/package.json` | Added the dependency-free `npm test` command and ES module mode. |
| `sub/test/pipeline.test.mjs` | Added 12 tests for current totals, joins, validations, dates, formulas, and structural errors. |
| `sub/knowledge.json` | Corrected the resolved I002 title and recorded the Wave 3 modules. |
| `sub/workplan/Sub-Dashboard-Workplan.md` | Recorded Wave 3 completion, source totals, and conformance status. |
| `sub/log/issue_log.md` | Recorded the review and current issue state. |
| `sub/log/test_log.md` | Recorded the Wave 3 test result. |
| `sub/log/update_log.md` | Recorded the title correction and Wave 3 work. |

## 6. Recommendations and lessons

Wave 4 can use the returned model directly. It should display row-level validation issues and fatal
formula warnings. Keep the returned-only formula comparison separate from open-row calculations.
S4 aggregation, HTML rendering, the file-load flow, and Chromium layout checks remain for later waves.

