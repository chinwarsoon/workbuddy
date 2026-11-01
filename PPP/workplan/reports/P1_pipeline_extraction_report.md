# P1 — Pipeline Extraction Test Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-30 | opencode (AI) | P1 (T8.8.1–T8.8.5) verified: modules extracted, build generated, 71/71, browser load, no behaviour change |

**Document ID**: PPP-RPT-P1-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.38 §8.8 (P1)
**Related issue**: I-76 (P1 done; P2–P6 open)

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. Test cases and results
5. Success criteria
6. Files created and changed
7. Recommendations and lessons

## 2. Objective and scope

Move the inline pipeline into importable modules without a behaviour change, and make the delivered
page a generated, standalone file. In scope: T8.8.1–T8.8.5. Out of scope: `deriveView` (P2),
`isExcelError` / `W-FORMULA` (P3), import-based tests (P4), UI conformance (P6).

## 3. Method and environment

| Item | Value |
|---|---|
| OS / runtime | Windows, Node v20.18.0 |
| Test command | `node test/test_pipeline.mjs` (from `PPP/`) |
| Build command | `node build.mjs` |
| Browser check | Playwright Chromium, `file://` URL, the repository workbook loaded through `#fileInput` |
| Baseline | 71 passed, 0 failed (TL003) |

## 4. Test cases and results

| # | Test | Result |
|---|---|---|
| 1 | `src/xlsx-reader.mjs`, `src/pipeline.mjs`, `src/render.mjs` exist and import in Node | PASS — exports `parseXlsx, parseCSV`; contract, model, validate; `boot` |
| 2 | Every original function is preserved | PASS — 96 of 96, plus `boot`; 27 consts unchanged |
| 3 | `build.mjs` writes the delivered HTML and the bundle parses | PASS — `vm.Script` check; 1 script block, no `src`, no `link`, no `import`, no `fetch` |
| 4 | Regression suite on the built page | PASS — **71 passed, 0 failed**; V-26 = 19, errors = 0 |
| 5 | Page loads from `file://` | PASS — no console error, `#dash` visible |
| 6 | Rendered values unchanged | PASS — 129 packages, 68% started, 19 PO issued, 81 V-08, 19 V-26 |
| 7 | Build is idempotent | PASS — identical SHA-256 on a second run |
| 8 | `render.mjs` has no DOM side effect on import | PASS — Node import succeeds; all wiring runs in `boot()` |

## 5. Success criteria

- [x] Three modules and `build.mjs` exist (§3.8.0).
- [x] Delivered HTML is one standalone file with no server and no external reference.
- [x] 71/71 stays green after the split.
- [x] No visible change: KPI values and warning counts are the same.
- [x] No page error from `file://`.
- [ ] `deriveView`, `isExcelError`, `W-FORMULA`, import tests and harness module paths — P2–P4.

## 6. Files created and changed

| File | Change | Revision |
|---|---|---|
| `src/xlsx-reader.mjs` | New: S0/S1 (`parseXlsx`, `parseCSV`) | 1.0 |
| `src/pipeline.mjs` | New: contract, S2 (`buildModel`), S3 (`validate`) | 1.0 |
| `src/render.mjs` | New: S4–S6, `boot()` | 1.0 |
| `build.mjs` | New: inline packager with parse check and backtick guard | 1.0 |
| `Procurement-Dashboard.html` | Regenerated inline script | 1.32 |
| `PPP-Dashboard-Workplan.md` | Rev 1.38: §8.7 status, §8.8 progress | 1.38 |
| `knowledge.json` | 1.10.0: module paths, I-76 status | 1.10.0 |

## 7. Recommendations and lessons

- Keep `src/` as the only place to edit code; the HTML script block is generated.
- Do not move DOM wiring back to module scope: it would break Node imports and Tier 3.
- Top-level IIFEs are easy to miss in a split. Search `^(\(function|document\.)` before declaring a
  module DOM-free.
- Harness Tier 1 still reports the three expected shell failures and the module check is not
  configured; both are P6 / T8.8.16 scope, not P1 regressions.
