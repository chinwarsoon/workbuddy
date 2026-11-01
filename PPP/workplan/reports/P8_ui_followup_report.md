# P8 - UI Conformance Follow-up Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P8 (T8.8.25-T8.8.32): hover detail, four-page routing, full validation list with icons, component polish, contrast hard; 263 assertions; Tier 4 79/0 |

**Document ID**: PPP-RPT-P8-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.51 §8.9
**Related issues**: I-77, I-84 to I-92

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. What changed
5. Tests and evidence
6. Screenshots
7. Decisions
8. Not adopted / carried
9. Recommendations

## 2. Objective and scope

Close the nine UI issues from the 2026-11-01 conformance review and the contrast finding: show detail
on hover for charts and KPI cards (mouse, keyboard, touch), reduce the menu and give each page only
its own panels, render the complete validation list with standard severity marks, and fix the small
component mismatches. No pipeline, contract or validation-rule change.

## 3. Method and environment

| Item | Value |
|---|---|
| Build | `node build.mjs` from `PPP/` (212,418 bytes, 2,403 bundle lines) |
| Suites | five files, 263 assertions |
| Browser | Playwright Chromium, `file://`, repository workbook, 1440x900, light and dark |
| Harness | `node harness.mjs --dashboard ppp --tier 1|2|3|4`, three table pages measured |

## 4. What changed

- **Chart detail (T8.8.25, T8.8.26).** One shared `.chart-tip` window and one delegated binder. Bar
  and pie points, PO month bars, cumulative points and month labels carry a payload with the label,
  one row per series (swatch plus value), the total and the share. The window is cursor-relative,
  flips at the right and bottom edges, never re-renders on movement, and also opens on keyboard focus
  of a chart host and on touch press. Native SVG titles are retired; the chart area uses a crosshair
  cursor and no longer clips the window.
- **KPI detail (T8.8.27).** Every card is focusable and carries name, exact value, denominator with
  noun, share and a one-line definition. The window sits below the card; the card uses a help cursor.
- **Page routing (T8.8.28).** Four menu items: Overview (KPI and charts), PO Schedule (PO plan versus
  actual, look-ahead), Overdue, and Data Quality (benchmark, validation). Only the current page's
  panels render; the page title follows the menu; the last page is restored; print output is the
  current page.
- **Validation completeness (T8.8.29, T8.8.30).** The 80-row cap is removed (101 of 101 rows render);
  the count reads "N rows"; severity is one flat 14x14 inline icon per tier (red circle-cross, amber
  triangle, blue circle-i) in both the rules and the issue table.
- **Component polish (T8.8.31).** The expander is 26 px with a 6 px radius and an accessible name;
  the column control has its own class and a visible pressed state; the header fragment also carries
  the normative fragment class.
- **Contrast (T8.8.32).** The active menu item uses an opaque fill and meets 3:1; the horizon chip
  already met the floor after the P6.3 token work. Control contrast is now enforced hard.

## 5. Tests and evidence

| Layer | Result |
|---|---|
| Units | 37 passed |
| Pipeline | 71 passed |
| Edges | 22 passed |
| Built artifact | 40 passed (12 new: pages, hover, icons, contrast) |
| Panels | 93 passed (15 new: detail payloads, no cap, icons, per-point values) |
| **Total** | **263 passed, 0 failed** |

Harness: Tier 1 9/0, Tier 2 23/0, Tier 3 3/0, Tier 4 79/0 with **0 advisories** (three pages
measured: schedule, overdue, quality).

Browser checks: KPI hover shows the full payload below the card; keyboard focus on a chart host shows
the first point's window; bar hover shows label, count, total and share; pie hover does the same;
pages switch and restore; 101 rows and 101 icons render; 0 console errors.

## 6. Screenshots

`p8_overview_kpi_tip.png`, `p8_overview_chart_tip.png`, `p8_schedule.png`, `p8_overdue.png`,
`p8_quality.png`, `p8_overview_dark.png`, `p8_quality_dark.png`.

## 7. Decisions

| ID | Decision |
|---|---|
| D22 | Benchmark and validation form the fourth page, Data Quality |
| D23 | Print output is the current page |
| D24 | The chart percentage base is the chart total (single series equals the filtered set) |
| D25 | The last page is remembered on reload |
| D26 | Frozen validation columns are not adopted |

## 8. Not adopted / carried

- **I-91 frozen validation columns** is not adopted because the table does not scroll sideways.
  Reopen it if sideways scrolling or a narrow freeze is introduced.
- **Tier 4c page coverage** relies on the harness `layoutPages` mechanism; a new page that carries a
  table must be added there.

## 9. Recommendations

1. Keep one tip payload builder per chart and never reintroduce native titles.
2. Add a page to `layoutPages` whenever it gains a table.
3. Keep control contrast hard; the P8 fix removed the last advisory.
