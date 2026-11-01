# P5 — Close-Out and Conformance Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-30 | opencode (AI) | P5 (T8.8.17): §3.8 recorded CONFORMING; records and logs aligned; P6 remains |

**Document ID**: PPP-RPT-P5-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.42 §8.7–§8.8
**Related issue**: I-76 (pipeline delivery; P6 shell conformance remains)

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. Conformance record (§3.8)
5. Acceptance criteria
6. Verification evidence
7. Files changed
8. Recommendations and lessons

## 2. Objective and scope

Close the data-pipeline work: record the §3.8 verdict, align the workplan, knowledge base and the
three logs, and state honestly what remains. P5 changes no code. Out of scope: the P6 shell, panel,
KPI, token and component conformance.

## 3. Method and environment

| Item | Value |
|---|---|
| Evidence source | reports P1–P4, logs TL004–TL009, workplan §8.7–§8.8 |
| Verification | `node build.mjs`, five test files, `harness.mjs --dashboard ppp --tier 1|2|3` |
| Runtime | Windows, Node v20.18.0, Playwright Chromium |

## 4. Conformance record (§3.8)

| Clause | Status | Evidence |
|---|---|---|
| §3.8.0 module structure, standalone delivery | CONFORMING | `src/` modules + `build.mjs`; one inline IIFE; `file://` load proves no server, no import, no fetch |
| §3.8.1 S0–S6, single S4, write-only S5 | CONFORMING | `parseXlsx`, `buildModel`, `validate`, `deriveView`, paint-only renderers, `boot` |
| §3.8.2 rules 1–10 | CONFORMING | one aggregation; single `STATE`; no re-parse; per-stage boundaries; S3 keeps `#dash`; local-date as-of |
| §3.8.3 contract from the workbook | CONFORMING | labels and `Column-X` refs read at runtime; rename fixture in `test_edges` |
| §3.8.4 blank/error normalization, `W-FORMULA` | CONFORMING | ten tokens; absent in S2; per-field counts; fatal banner notice, not an issue |
| §3.8.5 testability | CONFORMING | import-based 71/71; 212 assertions overall; harness Tier 3 ground truth 3/0 |

No pipeline clause is open. The shell clauses (§3.1–§3.7) and the panel/visual clauses (§4–§8) are
not part of this verdict; they are P6.

## 5. Acceptance criteria

| # | Criterion | Status |
|---|---|---|
| 1 | Modules exist; build writes the page; `file://` with no server/import/fetch/external reference | MET (P1, P4 artifact test) |
| 2 | `deriveView` is the only aggregation; old per-panel paths deleted | MET (P2) |
| 3 | `isExcelError`; token is absent and excluded; `W-FORMULA` fires on a fixture | MET (P3, edge tests) |
| 4 | A validation failure keeps the dashboard visible | MET (P2; S3 boundary) |
| 5 | Complete suite, all panels/filters, harness Tiers 1–3 | PARTIAL — 212 assertions and Tier 3 pass; Tiers 1–2 are P6 shell items |
| 6 | P6 shell, panels, tokens, components, §8.2 assertions | OPEN — P6 |

## 6. Verification evidence

| Check | Result |
|---|---|
| `node build.mjs` | 173,930 bytes, 2,021 bundle lines; one inline script; idempotent |
| `test_units` | 37 passed, 0 failed |
| `test_pipeline` | 71 passed, 0 failed (imports `src/`) |
| `test_edges` | 22 passed, 0 failed |
| `test_build` | 19 passed, 0 failed (`file://` KPI match, no console error) |
| `test_panels` | 63 passed, 0 failed (all panels, filters, CSV) |
| **Total** | **212 assertions, 0 failed** |
| Harness Tier 3 | 3 passed, 0 failed, 5 skipped |
| Harness Tier 1 | 6 passed, 3 failed — shell markers / module-script marker (P6; marker conflicts with D8) |
| Harness Tier 2 | 1 passed, 10 failed, 12 skipped — shell geometry and sidebar (P6) |

## 7. Files changed

| File | Change | Revision |
|---|---|---|
| `PPP-Dashboard-Workplan.md` | Rev 1.42: §8.7 CONFORMING, acceptance ticks, progress, history | 1.42 |
| `knowledge.json` | 1.14.0: pipeline CONFORMING note | 1.14.0 |
| `log/issue_log.md` | No new issue; I-80/I-81/I-82 unchanged | 1.4 |
| `log/test_log.md` | TL009 close-out verification | — |
| `log/update_log.md` | U029 documentation revision | — |
| `workplan/reports/P5_closeout_report.md` | New | 1.0 |

## 8. Recommendations and lessons

- Keep the §3.8 verdict separate from the shell verdict. "CONFORMING" here means the data pipeline,
  not the visual shell; conflating them would overstate P6 progress.
- Do not tick criterion 5 while Tiers 1–2 fail. The suite is green at the data layers, but the
  criterion names Tiers 1–3.
- P6 must resolve the Tier 1 module-script marker against D8 (single inlined classic script). A
  documented deviation, or an inline `type="module"` bundle, is the decision point.
- The close-out run is repeatable: build, five tests, three tiers, in that order.
