# P4 — Five-Layer Test Suite Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-30 | opencode (AI) | P4 (T8.8.12–T8.8.16) verified: 212 assertions, Tier 3 ground truth, I-82 fixed |

**Document ID**: PPP-RPT-P4-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.41 §8.8 (P4)
**Related issues**: I-76 (P1–P4 done), I-82 (NaN in an empty filter, fixed)

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. Layer results
5. Harness (Tier 1–3)
6. Defect found and fixed (I-82)
7. Success criteria
8. Files created and changed
9. Recommendations and lessons

## 2. Objective and scope

Replace the single `vm` harness with a complete suite that (a) imports the pipeline modules,
(b) covers unit, integration, edge, artifact and every-panel behaviour, (c) asserts CSV content,
and (d) gives the layout harness a Tier 3 ground truth. In scope: T8.8.12–T8.8.16. Out of scope:
P5 documentation close-out (this report is part of it) and P6 shell conformance.

## 3. Method and environment

| Item | Value |
|---|---|
| OS / runtime | Windows, Node v20.18.0 |
| Commands | `node build.mjs`; `node test/test_units.mjs`; `node test/test_pipeline.mjs`; `node test/test_edges.mjs`; `node test/test_build.mjs`; `node test/test_panels.mjs` |
| Harness | `node harness.mjs --dashboard ppp --tier 1|2|3` from `harness-layout/` |
| Browser | Playwright Chromium from `harness-layout/node_modules`, `file://` URL, repository workbook |
| Baseline | TL007: 71/71, KPIs 129 / 69% / 19 / 0% / 129 / 129 |

## 4. Layer results

| Layer | File | Assertions | Result |
|---|---|---|---|
| 1 Unit | `test/test_units.mjs` | 37 | PASS — ten tokens, absent predicate, `toDate` (ISO, serial, text serial, Date), `colRefToIndex`, `fmt`, contract parsing and a renamed lookup title |
| 2 Integration | `test/test_pipeline.mjs` | 71 | PASS — imports `src/`; no `<script>` extraction, no `vm`. Assertions unchanged |
| 2b Edge cases | `test/test_edges.mjs` | 22 | PASS — blank ≡ token, token count per column, labels and column letters, W-FORMULA warnings, token rows excluded from counts, contract mapping rename, validation counts |
| 3 Build artifact | `test/test_build.mjs` | 19 | PASS — one inline script, no local/external reference, no import/fetch, script parses; built bundle renders the same six KPIs as `deriveView`; `file://` Chromium load matches and has no console error |
| 4 All panels | `test/test_panels.mjs` | 63 | PASS — KPIs; all 11 interactive breakdowns; PO bars/curves/window; look-ahead rows/order/columns; overdue per stage and drill-down; benchmark 12 rows; validation counts and rule reference; type/stage/window/horizon filters; empty filter (no `NaN`); both CSV exports; W-FORMULA banner with `#dash` visible |

**Total: 212 assertions, 0 failed.**

## 5. Harness (T8.8.16)

`checks/ppp.mjs` now sets `srcDir`, `xlsxReaderPath`, `pipelinePath`, `renderPath`, and supplies a
`groundTruth` adapter because the PPP model, state and view shapes differ from MDL. `harness.mjs`
supports an optional adapter without changing the MDL path (MDL has no adapter).

| Tier | Result | Notes |
|---|---|---|
| 3 | **3 passed, 0 failed, 5 skipped** | KPI 129 = pipeline 129; category filter 5 = pipeline 5; status bar 129. Skipped: submitted / overdue selectors (not configured), validation count (not configured), W-FORMULA (no tokens in the workbook) |
| 1 | 6 passed, 3 failed | Shell zone markers, filter-area/body zones and the module-script marker. P6 scope; the module-script marker conflicts with D8 (single inlined file) |
| 2 | 1 passed, 10 failed, 12 skipped | Shell layout and sidebar checks; P6 scope |

The Tier 1/2 failures are recorded here, not hidden. They are shell-conformance work (P6), not P4
regressions.

## 6. Defect found and fixed (I-82)

A category filter that matches no package set `T = 0`; four KPI ratios then divided by zero and
printed `NaN`. `deriveView` now uses `pctOf(n)` and a guarded denominator. The empty view shows
`0`, `0%`, `0/0` and `0 shown`, and the new panel test asserts that `NaN` never appears.

## 7. Success criteria

- [x] Layer 1 unit tests for the pure helpers.
- [x] Layer 2 pipeline test imports the modules; 71 assertions unchanged.
- [x] Edge cases: blank/token equivalence, per-column counts, absent rows excluded, contract rename.
- [x] Built artifact: static checks plus rendered-KPI comparison, including `file://`.
- [x] Every panel, every filter, CSV headers and rows, empty and formula-error states.
- [x] Harness module paths set; Tier 3 ground truth passes; Tiers 1–3 run.
- [ ] Tier 1/2 shell conformance — P6.

## 8. Files created and changed

| File | Change | Revision |
|---|---|---|
| `test/test_units.mjs` | New | 1.0 |
| `test/test_edges.mjs` | New | 1.0 |
| `test/test_build.mjs` | New | 1.0 |
| `test/test_panels.mjs` | New | 1.0 |
| `test/test_pipeline.mjs` | Import-based rewrite; 71 assertions kept | 1.1 |
| `src/pipeline.mjs` | Exports for the tests | 1.2 |
| `src/render.mjs` | Exports, pure CSV builders, NaN guard | 1.2 |
| `harness-layout/harness.mjs` | Optional `groundTruth` adapter | 1.3 |
| `harness-layout/checks/ppp.mjs` | Paths + adapter + filter round-trip | 1.1 |
| `PPP-Dashboard-Workplan.md` | Rev 1.41 | 1.41 |
| `knowledge.json`, `log/issue_log.md`, `log/test_log.md`, `log/update_log.md` | Records | — |

## 9. Recommendations and lessons

- Test through the module exports, not the built file; build only in the artifact layer. The built
  file once hid a duplicate function declaration that ES modules reject.
- A pure helper for CSV rows made the exported file testable without a browser or a download.
- Repainting a panel replaces its child nodes; bind listeners on the container (already fixed for
  the type filter).
- The harness Tier 1 module-script check and D8 (one inlined file) conflict; resolve the wording in
  the P6 conformance record rather than changing the delivery model.
- Keep `file://` in the build layer: it proved the delivered page loads without a server.
