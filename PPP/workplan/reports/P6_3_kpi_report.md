# P6.3 - KPI, Tokens and Components Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P6.3 (T8.8.20): KPI §5, tokens §6, components §7; 232 assertions; `.csv-btn` retired |

**Document ID**: PPP-RPT-P6.3-001
**Status**: COMPLETE (P6 overall IN PROGRESS)
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.46 §8.8 (P6.3)
**Related issue**: I-83 (UI conformance; P6.4 open)

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. What changed
5. Tests and evidence
6. Screenshots
7. Deviations and carried items
8. What remains (P6.4)
9. Recommendations

## 2. Objective and scope

Bring the KPI strip to spec §5, replace colour literals in component rules with tokens per §6, and
align the component families of §7 (action buttons, icon buttons, segmented control, tables) with
one canonical class per logical control. Out of scope: the five-theme token set (recorded as an open
gap), and the §8 conformance record (P6.4).

## 3. Method and environment

| Item | Value |
|---|---|
| Build | `node build.mjs` from `PPP/` (198,563 bytes, 2,286 bundle lines) |
| Suites | five files, 232 assertions |
| Browser | Playwright Chromium, `file://`, repository workbook, 1440x900 and 1000x900, light and dark |
| Harness | `node harness.mjs --dashboard ppp --tier 1|2|3|4` |

## 4. What changed

- **KPI data (§5).** `deriveView` cards now carry a status class (`ok`, `amb`, `warn`) instead of a
  colour token key, and the sub-status text is removed. Every card is exactly two lines.
- **KPI paint (§5).** `renderKPIs()` writes `<div class="kpi ok"><div class="v">…</div><div class="l">…</div></div>`.
  No inline `border-top-color`; the class sets the strip.
- **KPI CSS (§5).** `.kpis` is `repeat(auto-fit,minmax(210px,1fr))` with a 10 px gap; `.kpi` is
  `box-sizing:border-box;height:72px` with a 3 px strip and 8 px radius; `.v` is 22 px/700 navy;
  `.l` is 10 px/400 uppercase muted with `margin-top:2px`; no `line-height` override on either, so the
  inherited 1.45 keeps the card at 72 px. `.ok`, `.amb`, `.warn`, `.muted`, `.err` strips added.
  Column-count media queries removed (`auto-fit` handles the width); the D14 layout toggle keeps its
  explicit 3/2-column overrides.
- **Panel titles (§6).** `.card h2` is now 13 px/600 (was 700); chart-card `h3` stays 13 px/700.
- **Tokens (§6).** Component rules no longer use colour literals: `--on-navy`, `--on-navy-soft`,
  `--navy-dark`, `--text2`, `--row-stripe` and `--err` are defined in `:root` and replace the
  previous `#fff`, `#E8EDF3`, `#0b2240`, `#334155`, `#F9FBFD` and `#8E24AA` values. Token fallbacks
  were removed from the system banner rules. `--font-ui` now holds the shared font stack and
  `--font` aliases it.
- **Components (§7.1).** The four CSV buttons moved from the parallel `.csv-btn` class to the
  canonical `.btn-secondary` with `data-act="csv"`; the `.csv-btn` CSS is deleted and the
  `.table-tools` margin rule targets `.btn-secondary`. `.icon-btn` declares `min-height:26px` so it
  stays 26 px square, and uses `var(--surface)` instead of `#fff`.

## 5. Tests and evidence

| Layer | File | Result |
|---|---|---|
| Units | `test/test_units.mjs` | 37 passed, 0 failed |
| Pipeline | `test/test_pipeline.mjs` | 71 passed, 0 failed |
| Edges | `test/test_edges.mjs` | 22 passed, 0 failed |
| Built artifact | `test/test_build.mjs` | 24 passed, 0 failed |
| Panels | `test/test_panels.mjs` | 78 passed, 0 failed |
| **Total** | | **232 passed, 0 failed** |

New assertions: KPI cards are 72 px, have exactly two children, no `.s`, and a status class that
changes the strip; the CSV actions are `.btn-secondary` with `data-act` and no `.csv-btn` remains;
the panel HTML has no KPI sub-line and uses status class names.

Browser checks (1440x900 and 1000x900, `file://`):

| Check | Result |
|---|---|
| Card height / width | 72 px / 234 px at 1440 |
| Children per card / sub-lines | 2 / 0 |
| Value font | 22 px, 700 |
| Label font | 10 px, 400 |
| Strip colours | blue (none), green (`ok`), red (`warn`) |
| Icon button | 26 x 26 px, `min-height:26px` |
| Panel title | 13 px, 600 |
| CSV actions | 4 `.btn-secondary` with `data-act="csv"`, 0 `.csv-btn`; download works |
| Narrow 1000 px | 3 columns, no horizontal overflow |
| Console errors | 0 |

Harness:

| Tier | Result |
|---|---|
| Tier 1 | 8 passed, 1 failed (module-script marker, D8 conflict) |
| Tier 2 | 23 passed, 0 failed |
| Tier 3 | 3 passed, 0 failed |
| Tier 4 | 70 passed, 9 failed (identical to P6.2) |

## 6. Screenshots

| File | View |
|---|---|
| `workplan/reports/screenshots/p6_3_1440.png` | full page, light, 1440x900 |
| `workplan/reports/screenshots/p6_3_1440_dark.png` | full page, dark, 1440x900 |

## 7. Deviations and carried items

- **Only light and dark themes exist.** Spec §6 requires the five themes of `AGENTS.md` §18.4
  (`light`, `dark`, `sky`, `ocean`, `presentation`). PPP implements two. The dark block also remaps
  `--card` but not `--surface`, so KPI and button surfaces stay white in dark mode. Remapping it now
  would put navy text on a dark surface (`.btn-secondary`), so it needs a paired text-token decision
  rather than a one-line change. Recorded in §8.3 as **PARTIAL** and carried to P6.4.
- **Tier 4 residuals unchanged** (9 fails): the split-header-versus-sticky check and the I-95 resize
  grips. Not caused by P6.3; carried to P6.4.
- **AGENTS.md §18** still conflicts with the spec (universal `common/` assets, icon bar, right
  sidebar). The spec wins here; reconciling AGENTS.md needs separate approval.

## 8. What remains (P6.4)

- The §8 conformance record and the final screenshot set.
- A decision on the Tier 1 module-script marker, the Tier 4c sticky check, the I-95 grips and the
  §6 five-theme gap; record each as either adopted work or a documented deviation.

## 9. Recommendations

1. Treat `--surface` and `--on-navy` as a pair: a dark surface needs a light-text rule, so decide
   both together in P6.4.
2. Keep status class names on KPI data (`ok`/`amb`/`warn`) and never reintroduce a colour key.
3. Keep `.btn-secondary` as the only text-action class; use `data-act` for behaviour.
