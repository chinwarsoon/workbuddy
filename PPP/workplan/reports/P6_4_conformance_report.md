# P6.4 - Conformance Record Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P6.4 (T8.8.21): five themes implemented; §8.9 conformance record; P6 closed; 236 assertions |

**Document ID**: PPP-RPT-P6.4-001
**Status**: COMPLETE (P6 CLOSED)
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.47 §8.9
**Related issue**: I-83 (UI conformance) — ALIGNED

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. What changed
5. Tests and evidence
6. Screenshots
7. Conformance result
8. Deviations carried to P7
9. Recommendations

## 2. Objective and scope

Close P6 by (a) implementing the one remaining normative gap from P6.3 — the five themes of §6 /
§8.2 assertion 1 — and (b) writing the conformance record that §8.4 requires: the generic checks
with their tier and posture, the 17 §8.2 assertions with evidence, and every deviation with a
reason and an end state.

## 3. Method and environment

| Item | Value |
|---|---|
| Build | `node build.mjs` from `PPP/` (200,704 bytes, 2,289 bundle lines) |
| Suites | five files, 236 assertions |
| Browser | Playwright Chromium, `file://`, repository workbook; 1440x900 for all five themes; 1280x800 presentation |
| Harness | `node harness.mjs --dashboard ppp --tier 1|2|3|4` |

## 4. What changed

- **Five themes (§6).** `sky`, `ocean` and `presentation` token blocks were added beside `light`
  and `dark`. Each block remaps the structural tokens (`--bg`, `--surface`, `--card`, `--ink`,
  `--text`, `--muted`, `--border`, `--line`, `--soft`, `--row-stripe`, `--heading`, `--grid`) and
  keeps the brand anchors `--navy`/`--blue`, so the navy chrome is stable in every theme.
- **Dark theme repaired.** The dark block now also remaps `--surface`, `--border`, `--text` and
  `--row-stripe`. Twelve component rules that used `color:var(--navy)` for text now use
  `color:var(--ink)`; in light theme `--ink` equals the navy, so the light rendering is unchanged,
  while every dark surface gets readable light text.
- **Theme picker.** `THEMES` lists the five values; `applyTheme()` accepts only a listed value and
  removes the attribute for `light`; the Settings modal renders one button per theme; `syncThemeOpts`
  marks the active one; boot restores the saved value. The storage key stays `ppp-chart-theme`.
- **Conformance record.** §8.9 of the workplan records the generic checks and posture, the §8.2
  assertions 1–17, and deviations D15–D18.

## 5. Tests and evidence

| Layer | File | Result |
|---|---|---|
| Units | `test/test_units.mjs` | 37 passed, 0 failed |
| Pipeline | `test/test_pipeline.mjs` | 71 passed, 0 failed |
| Edges | `test/test_edges.mjs` | 22 passed, 0 failed |
| Built artifact | `test/test_build.mjs` | 28 passed, 0 failed |
| Panels | `test/test_panels.mjs` | 78 passed, 0 failed |
| **Total** | | **236 passed, 0 failed** |

Five new built-artifact assertions: five theme options; five distinct background tokens; KPI value
contrast ≥ 3:1 in every theme (measured 13.37–18.58:1); persistence; and the earlier KPI/CSV checks.

Browser (1440x900): every theme sets its own `data-theme` (light removes it), flips the body and KPI
surface, and keeps KPI value text light on the dark surface; the choice survives a reload; 0 console
errors.

Harness: Tier 1 **8/1** (module-script marker, D17), Tier 2 **23/0**, Tier 3 **3/0**, Tier 4 **70/9**
(the recorded table-chrome deviations), 1 advisory (I-77).

## 6. Screenshots

| File | View |
|---|---|
| `workplan/reports/screenshots/p6_4_1440_light.png` | light theme |
| `workplan/reports/screenshots/p6_4_1440_dark.png` | dark theme |
| `workplan/reports/screenshots/p6_4_1440_sky.png` | sky theme |
| `workplan/reports/screenshots/p6_4_1440_ocean.png` | ocean theme |
| `workplan/reports/screenshots/p6_4_1440_presentation.png` | presentation theme |
| `workplan/reports/screenshots/p6_4_1280_presentation.png` | 1280x800, presentation |

## 7. Conformance result

P6 is **complete**. Of the 17 §8.2 assertions: **14 pass**, **1 passes as advisory** (#4, I-77),
**2 are unverified** (#11 and #12, deviation D18) and **1 is not applicable** (#8, no panel-local
filter). Four deviations are recorded with end states. P6.1–P6.4 are closed; the deviations and the
split-header invariants move to the planned **P7**.

## 8. Deviations carried to P7

| ID | Clause | Summary | End state |
|---|---|---|---|
| D15 | §7.2.15 | The Tier 4c sticky-`thead` check contradicts the mandated split header | Split-aware harness rule (T8.8.24) |
| D16 | §7.2.13/7.2.14 | No column resize grips or pinned columns | Adopt only if column sizing is requested (T8.8.23) |
| D17 | §3.9 vs Tier 1 | Inline classic script versus a module-script marker | Harness accepts the declared standalone form (T8.8.24) |
| D18 | §7.2.15 | No scrollbar gutter or width lock-step; pairing rules not enabled | Implement gutter and lock-step, then enable `chrome.splitHeader` (T8.8.22) |

## 9. Recommendations

1. Treat D18 as the highest-value follow-up: a scrollbar appearing in a body scroller can misalign
   a split header, and only the disabled pairing check would catch it.
2. Keep every new theme a pure token block; never add a per-theme component rule.
3. Re-run the §8.9 record at each release; it is the review surface for conformance.
