# P2 — Derive Step and Stage Boundaries Test Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-30 | opencode (AI) | P2 (T8.8.6–T8.8.8) verified: one derive step, paint-only renderers, state moved into STATE, per-stage boundaries |

**Document ID**: PPP-RPT-P2-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.39 §8.8 (P2)
**Related issue**: I-76 (P1–P2 done; P3–P6 open)

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. Test cases and results
5. Success criteria
6. Files created and changed
7. Recommendations and lessons

## 2. Objective and scope

Make S4 a single aggregation step and S5 a paint-only layer, with no behaviour change. In scope:
`deriveView`, removal of per-panel counts, state consolidation, per-stage error boundaries.
Out of scope: `isExcelError` / `W-FORMULA` (P3), import-based tests (P4), UI conformance (P6).

## 3. Method and environment

| Item | Value |
|---|---|
| OS / runtime | Windows, Node v20.18.0 |
| Test command | `node test/test_pipeline.mjs` (from `PPP/`) |
| Build command | `node build.mjs` |
| Browser check | Playwright Chromium, `file://` URL, repository workbook through `#fileInput` |
| Ground truth | `deriveView` imported directly in Node on the same workbook |
| Baseline | TL005: 71 passed, 0 failed; KPIs 129 / 68% / 19 / 0% / 129 / 129 |

## 4. Test cases and results

| # | Test | Result |
|---|---|---|
| 1 | One S4 step: every aggregation in `deriveView` | PASS — no `filteredPackages`, no per-panel `tally` on filtered packages, no renderer-side counts |
| 2 | Regression suite | PASS — **71 passed, 0 failed**; 101 data warnings + 1 system notice; errors 0 |
| 3 | KPI values unchanged | PASS — 129 total, 68% started, 19 PO issued, 0% delivered, 129/129 lead time, 129/129 engineer |
| 4 | `deriveView` ground truth matches the DOM | PASS — active 129, 16 categories, look-ahead 64, overdue MR 73 / PO 11 / VD 14 / FAT 1 / ROS 6, chips 101 warnings |
| 5 | Type filter re-derives everything | PASS — uncheck one category → 124 packages, 69% started, status bar 124 shown; single category `Instrument` → 33 packages, 21 look-ahead rows, 10 overdue rows |
| 6 | "None selected" keeps the dashboard populated (I-57) | PASS — 129 packages and full charts; label says None selected |
| 7 | Look-ahead horizon change | PASS — 3m → 64 rows; 6m → 95 rows; window text follows |
| 8 | Overdue stage change and drill-down | PASS — FAT shows 1 row; MR shows 73; one detail row opens at a time |
| 9 | Chart breakdown and Bar/Pie per card | PASS — status → engineer (13 items), pie renders 9 paths (8 + Other); data card → by discipline |
| 10 | Collapse state survives a re-render | PASS |
| 11 | PO bars toggle | PASS — bars 50 → 0 |
| 12 | PO period window survives re-render | PASS — `2026-05 → 2027-12` kept after an overdue-stage change |
| 13 | Saved prefs honoured on load | PASS — saved `ovlStage=ros` shows ROS; saved `look=6` shows 95 rows |
| 14 | Browser console | PASS — 0 errors, 0 page errors |

Boundary checks (code review and construction):

- S1/S2: a parse or model failure is fatal; the welcome overlay stays and no dashboard shows.
- S3: an exception from `validate()` is caught, converted to a `VALIDATE` system issue, and the dashboard
  stays visible with the notice in `#errBanner`.
- S4: an exception from `deriveView` is caught, reported in `#errBanner`, and the previous DOM stays.
- S5: each panel keeps its own `safeCall` and shows “Chart error” in place.

## 5. Success criteria

- [x] One `deriveView(model, STATE)` returns `active`, `kpis`, `issues`, `panels`.
- [x] Renderers paint only; the old per-panel count paths are deleted.
- [x] All remaining UI state lives in `STATE`.
- [x] One error boundary per stage; S3 does not hide `#dash`.
- [x] 71/71 green; rendered values unchanged; no console error.
- [ ] `isExcelError`, `W-FORMULA`, import-based tests, harness module paths, UI conformance — P3, P4, P6.

## 6. Files created and changed

| File | Change | Revision |
|---|---|---|
| `src/render.mjs` | `deriveView`, paint-only renderers, STATE consolidation, boundaries | 1.1 |
| `src/pipeline.mjs` | `STAGES`, `todayMidnight`, `stageDue`, `stageIsOverdue` exported | 1.1 |
| `Procurement-Dashboard.html` | Regenerated bundle | generated |
| `PPP-Dashboard-Workplan.md` | Rev 1.39: §8.7 rows, §8.8 progress, revision row | 1.39 |
| `knowledge.json` | 1.11.0: architecture, I-76 | 1.11.0 |

## 7. Recommendations and lessons

- Keep the view shape stable; P4 tests should assert against `deriveView` directly.
- A repainted panel loses listeners bound to its children. Use one delegated listener on the
  persistent container (the type filter does this now).
- Duplicate function declarations pass a `vm.Script` parse in sloppy mode but fail an ES module
  import. P4's import-based test would have caught the duplicate `interCardBody` immediately.
- The PO window is domain-keyed: it must not reset on a filter change, only on a new workbook.
