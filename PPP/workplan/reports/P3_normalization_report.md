# P3 — Value Normalization Test Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-30 | opencode (AI) | P3 (T8.8.9–T8.8.11) verified: token predicate, blank/error absent in S2, per-field counts, fatal W-FORMULA notice |

**Document ID**: PPP-RPT-P3-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.40 §8.8 (P3)
**Related issue**: I-76 (P1–P3 done; P4–P6 open)
**Spec**: `Dashboard-UI-Design-Spec.md` §3.8.4

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. Test cases and results
5. Success criteria
6. Visible changes
7. Files changed
8. Recommendations and lessons

## 2. Objective and scope

Apply one absent rule to every column: a blank cell and a formula-error token are the same missing
value. Record token counts per field and show one fatal `W-FORMULA` notice per affected column,
without blocking the load and without creating issues. In scope: T8.8.9–T8.8.11. Out of scope:
import-based tests (P4), UI conformance (P6).

## 3. Method and environment

| Item | Value |
|---|---|
| OS / runtime | Windows, Node v20.18.0 |
| Regression | `node test/test_pipeline.mjs` after `node build.mjs` |
| Token unit check | direct import of `isExcelError` and `EXCEL_ERROR_TOKENS` |
| Synthetic corruption | the real workbook grid with `#REF!` in MR Plan and `#N/A` in Package No. |
| Banner check | the built bundle in a Node `vm` with the DOM stub; `#errBanner` and `#dash` inspected |
| Browser check | Playwright Chromium, `file://`, repository workbook |

## 4. Test cases and results

| # | Test | Result |
|---|---|---|
| 1 | All ten tokens accepted, case-insensitive, spaces ignored | PASS — `#NULL! #DIV/0! #VALUE! #REF! #NAME? #N/A #NUM! #GETTING_DATA #SPILL! #CALC!` |
| 2 | Non-tokens rejected | PASS — `#REFX!`, `''`, `null`, a number |
| 3 | Baseline workbook has no token and no warning | PASS |
| 4 | Date token becomes `undefined` | PASS — MR Plan col R |
| 5 | Text token becomes `undefined` | PASS — Package No. col D |
| 6 | One count per affected field with `n`, `total`, label, column | PASS — 1 of 129 each |
| 7 | One fatal `W-FORMULA` per column | PASS — two notices, message names label, column, N of total, recovery |
| 8 | `W-FORMULA` is not an issue | PASS — absent from `report.issues` |
| 9 | Missing data changes validation as expected | PASS — the removed MR Plan fires one rule (102 → 103) |
| 10 | Banner shows the fatal strips | PASS — `sys-banner-item fatal`, `W-FORMULA` text |
| 11 | Banner does not block the load | PASS — `#dash` visible |
| 12 | Regression suite | PASS — **71 passed, 0 failed** |
| 13 | Real workbook KPIs | PASS (changed by design) — Started 69%, 88 of 128 with a status; 19 PO; 129/129 lead time |
| 14 | Browser console | PASS — 0 errors |

## 5. Success criteria

- [x] `isExcelError(v)` with the ten tokens, case-insensitive.
- [x] S2 maps blank or error to `undefined` in every column.
- [x] Per-field token count with field label, column letter and total.
- [x] S3 emits one `level:'fatal'` `W-FORMULA` per column in `model.warnings`.
- [x] The notice routes to `#errBanner`, is not in `model.issues`, and does not block the load.
- [x] 71/71 green; no console error.
- [ ] Import-based test and harness module paths (P4); UI conformance (P6).

## 6. Visible changes (deliberate, from §3.8.4)

- **Started becomes 69%.** The workbook has one package with a blank status. A blank is now absent,
  so the percentage divides by the 128 packages that carry a status: 88 / 128 = 69%. Before, the
  blank reduced the numerator against all 129 packages and showed 68%.
- **The empty Criticality bar is gone.** Four packages have no criticality. An absent value is no
  longer charted as “Not Specified (blank)”.
- No other KPI, panel count, list or warning total changes on this workbook.

## 7. Files changed

| File | Change | Revision |
|---|---|---|
| `src/pipeline.mjs` | `isExcelError`, `isAbsent`, S2 absent rule, per-field counts, `W-FORMULA` warnings | 1.2 |
| `src/render.mjs` | Tallies skip absent; Started denominator; banner shows fatal warnings | 1.2 |
| `Procurement-Dashboard.html` | Regenerated bundle | generated |
| `PPP-Dashboard-Workplan.md` | Rev 1.40: §8.7 §3.8.4 MET, §8.8 P3 progress | 1.40 |
| `knowledge.json` | 1.12.0 | 1.12.0 |

## 8. Recommendations and lessons

- Keep `_raw` untouched: it is the audit copy and the V-rule input, so token evidence survives.
- A formula token in a date column is now indistinguishable from a blank. That is intended; the
  `W-FORMULA` notice is the only signal that the source cell is broken, so it must stay visible.
- P4 must add permanent edge-case tests for the ten tokens and the per-column count; the checks in
  this phase were temporary.
- `deriveView` must keep skipping absent values; a later tally that counts `undefined` would silently
  bring the blanks back.
