# P7 - Split Header and Harness Acceptance Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P7 (T8.8.22, T8.8.24): split-header contract implemented, four deviations closed; all tiers pass except one advisory |

**Document ID**: PPP-RPT-P7.1-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.48 §8.9
**Related issue**: I-83 (ALIGNED) — deviations D15–D18

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. What changed
5. Tests and evidence
6. Screenshots
7. Deviations closed
8. What remains
9. Recommendations

## 2. Objective and scope

Close the four deviations recorded at P6.4. In scope: the §7.2.15 split-header contract (one
container, containing block, width pin with a scrollbar gutter, one column grid, fit and lock-step,
one implementation) and the harness acceptances that the spec requires (D15, D17, and the I-95
declaration for D16). Out of scope: column sizing and resize grips, which this dashboard does not
offer (D16 closed as N/A).

## 3. Method and environment

| Item | Value |
|---|---|
| Build | `node build.mjs` from `PPP/` (203,680 bytes, 2,325 bundle lines) |
| Suites | five files, 236 assertions |
| Browser | Playwright Chromium, `file://`, repository workbook, 1440x900 and 1280x800, light and dark |
| Harness | `node harness.mjs --dashboard ppp --tier 1|2|3|4` |

## 4. What changed

- **One implementation (`src/render.mjs`).** `splitTable()` now emits
  `.ds-split.splitcard` → `.vheadwrap` (clipped header port) → fragment table, then
  `.tableScroll` → body table. The fragment carries one extra `<col class="ds-gut">` and one
  `<th class="ds-gut" aria-hidden="true">`.
- **Width pin, gutter and lock-step.** New `syncSplitTable()` reads the body table width and the
  scrollbar width, sets `--ds-sbw`, pins the fragment to `body + scrollbar`, copies every body
  column width onto the fragment's column, gives the remainder to the gutter, and mirrors
  `scrollLeft`. `syncAllSplits()` binds one `ResizeObserver` per pair and is called from `render()`.
- **Container and column rule (CSS).** `.ds-split` is one bordered, 10 px-radius, `overflow:hidden`
  box; the inner `.tableScroll` keeps no border, radius or margin, so the pair reads as one table.
  Header cells are `position:relative` and carry a 1 px absolutely-positioned `::after` rule.
- **Alignment.** The overdue drill column header is centred to match its `.drill-cell` body cells.
- **Harness (`harness.mjs`).** Tier 1 accepts a declared inline classic script (`inlineClassicScript`).
  Sticky is scoped to tables inside a `.tableScroll`; a declared fragment is exempt and must pair
  with a body. The body half of a split pair is exempt from the I-90 header-height rule. The
  split-header width check compares the fragment to **body + scrollbar** rather than the body alone.
- **Dashboard check module (`checks/ppp.mjs`).** Declares `headerFragmentSelector`,
  `splitHeader`, `inlineClassicScript: true` and `minGridTables: 0`.

## 5. Tests and evidence

| Layer | File | Result |
|---|---|---|
| Units | `test/test_units.mjs` | 37 passed, 0 failed |
| Pipeline | `test/test_pipeline.mjs` | 71 passed, 0 failed |
| Edges | `test/test_edges.mjs` | 22 passed, 0 failed |
| Built artifact | `test/test_build.mjs` | 28 passed, 0 failed |
| Panels | `test/test_panels.mjs` | 78 passed, 0 failed |
| **Total** | | **236 passed, 0 failed** |

Harness:

| Tier | Before P7 | After P7 |
|---|---|---|
| Tier 1 | 8 passed, 1 failed | **9 passed, 0 failed** |
| Tier 2 | 23 passed, 0 failed | **23 passed, 0 failed** |
| Tier 3 | 3 passed, 0 failed | **3 passed, 0 failed** |
| Tier 4 | 70 passed, 9 failed | **85 passed, 0 failed** (1 advisory: I-77) |

Measured on the four split pairs at 1440x900:

| Measure | Result |
|---|---|
| Header/body gap | 0 px |
| Header cell vs body cell left delta | 0 px |
| Fragment width vs body + gutter | equal |
| Horizontal overflow | 0 px |
| Header movement while the body scrolls 200 px | 0 px |
| Container radius / scroller radius | 10 px / 0 px |

Harness split-header assertions: gap, one rounded container, column rule, alignment, column
boundaries, width + gutter and fit all pass for all four pairs; lock-step passes where overflow is
forced and is skipped where the pair fits.

## 6. Screenshots

| File | View |
|---|---|
| `workplan/reports/screenshots/p7_1440_light.png` | 1440x900, light |
| `workplan/reports/screenshots/p7_1440_dark.png` | 1440x900, dark |
| `workplan/reports/screenshots/p7_1280_dark.png` | 1280x800, dark |

## 7. Deviations closed

| ID | Resolution |
|---|---|
| D15 | The harness now scopes sticky to `.tableScroll` and compares the fragment to body + scrollbar; the split header is verified by its own checks instead of the retired sticky rule |
| D16 | Closed as N/A: PPP offers no column sizing; `minGridTables: 0` declares it, and the I-95 checks pass vacuously |
| D17 | Closed: `inlineClassicScript: true` is declared and accepted for a single inline classic IIFE (§3.9 delivery) |
| D18 | Closed: gutter, width pin and lock-step implemented; `chrome.splitHeader` enabled and passing |

## 8. What remains

Nothing in P7. The §8.2 assertion set is now 15 pass, 1 advisory (#4, I-77) and 1 N/A (#8). The only
open conformance item is the I-77 `3m` chip contrast, which is an advisory finding by decision.

## 9. Recommendations

1. Keep `syncSplitTable()` as the only pairing implementation; do not hand-roll a second copy.
2. When a scrollbar is visible (non-overlay platforms), the gutter takes its width automatically;
   verify the pair on one classic-scrollbar machine before release.
3. Re-run the §8.9 record at each release; it is the review surface for conformance.
