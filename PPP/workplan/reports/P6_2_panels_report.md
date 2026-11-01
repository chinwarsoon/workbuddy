# P6.2 - Panels Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P6.2 (T8.8.19): panels 1-7 conform to spec 4-4.5; 225 assertions green; Tier 2 23/0 |

**Document ID**: PPP-RPT-P6.2-001
**Status**: COMPLETE (P6 overall IN PROGRESS)
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.45 8.8 (P6.2)
**Related issue**: I-83 (UI conformance; P6.3-P6.4 open)

## 1. Index

1. Index
2. Objective and scope
3. Method and environment
4. What changed
5. Tests and evidence
6. Screenshots
7. Deviations and carried items
8. What remains (P6.3-P6.4)
9. Recommendations

## 2. Objective and scope

Bring panels 1-7 to the panel standard of spec 4-4.5: one title row per panel with Help and
Collapse, a DOM-order panel number, chart control ownership, bounded tables with a split header,
the overdue drill-down accordion, and the validation panel layout. Out of scope: the shell
(P6.1, complete), KPI/tokens/components 5-7 (P6.3), the 8 record (P6.4).

## 3. Method and environment

| Item | Value |
|---|---|
| Build | `node build.mjs` from `PPP/` (198,254 bytes, 2,283 bundle lines) |
| Suites | five files, 225 assertions |
| Browser | Playwright Chromium, `file://`, repository workbook, 1440x900, light and dark |
| Harness | `node harness.mjs --dashboard ppp --tier 1|2|3|4` |

## 4. What changed

- **Panel chrome (4).** All seven panels are direct children of `#dashBody`. `setupPanels()` runs
  after every render: it numbers each panel in DOM order (`data-panel` + a `Panel N` label), ensures
  a `.panel-head` with the title and an action cluster, and injects the Help `?` and Collapse `-`
  buttons. The collapse state is stored in `STATE.ui.collapsed` and `localStorage` (`ppp-pc-<id>`),
  so it survives a filter, a search and a reload. The `#kpiToggle` re-render bug is removed.
- **Chart control ownership (4.1, 4.2).** Each single chart sits in a `.c-card`; its controls sit
  above the plot, right-aligned, inside the same card. The PO combo chart owns its window, its bars
  toggle, the message and its PNG/Copy buttons. The look-ahead card owns the horizon segment, the
  CSV and the row count.
- **Bounded tables (4.3, 7.2.15).** New `splitTable(cols, headRows, bodyRows)` builds a fixed header
  (`table.ds-head`, with `colgroup`) plus a 340 px `.tableScroll` body table. It is used by
  look-ahead, overdue, validation and benchmark. Every tool row shows a row count (`#lookSub`,
  `#ovlSub`, `#vsub`, `#benchSub`) and a CSV button. Table CSS is now
  `table-layout: fixed` with 40 px rows and ellipsis truncation.
- **Drill-down (4.4).** Each overdue row is `tr.expandable` with a real
  `<button class="drill-btn" aria-expanded="false" aria-controls="ovld-...">` holding a
  `.drill-chev` that rotates 90 degrees when open. The detail is a sibling `tr.sub` >
  `td[colspan]` > `.sub-inner`. Only one row is open; a second open closes the first. The
  click/Enter/Space path uses the button, not the row.
- **Validation panel (4.5).** The `<details>` disclosure and `#vdetails` are removed. The panel
  shows a `.v-summary` (`#vcount` = "N issues", severity chips, `#vmap`), a Rules card whose table
  has one row per fired code (Sev, Code, Group, Description, Count), and an Issues card with a
  `.table-head` (title, count, `#vCols`, `#vExport`). `#vCols` toggles the Value and Message
  columns: 6 -> 4 -> 6. `#vsub` reports "N rows" or "Showing 80 of N rows".
- **Benchmark.** The static table markup is replaced by `renderBenchmark()` from `BENCH_ROWS`, so
  the benchmark uses the same split header as every other table.
- **CSV.** `overdueCsvRows(ov)` and `benchCsvRows()` are added and exported; `#ovlExport` and
  `#benchExport` are wired. The validation and look-ahead CSV paths are unchanged.
- **Removed.** All static `.panel-no` spans, the per-card collapse/help wiring from the old
  interactive panel, and the `attachHelp()` bootstrap hook (replaced by `setupPanels()`).

## 5. Tests and evidence

| Layer | File | Result |
|---|---|---|
| Units | `test/test_units.mjs` | 37 passed, 0 failed |
| Pipeline | `test/test_pipeline.mjs` | 71 passed, 0 failed |
| Edges | `test/test_edges.mjs` | 22 passed, 0 failed |
| Built artifact | `test/test_build.mjs` | 19 passed, 0 failed |
| Panels | `test/test_panels.mjs` | 76 passed, 0 failed |
| **Total** | | **225 passed, 0 failed** |

New panel assertions: split header on all four tables; `.expandable` row count; `drill-btn`
`aria-expanded`/`aria-controls`; `.sub`/`.sub-inner` (no `.ovl-detail`); `#vcount` text; Rules table
with a Count column; `#vsub` row-count text; overdue and benchmark CSV headers and row counts.

Browser checks (1440x900, `file://`):

- Panels numbered 1-7 in DOM order; every panel has Help and Collapse; no `.sub` subtitle remains.
- Collapse survives a search change (state `collapsed`, glyph `+`, `aria-expanded="false"`).
- Drill-down: the button opens its row, a second button closes the first, one row open, chevron
  `matrix(0, 1, -1, 0, 0, 0)` (90 degrees).
- `#vCols`: 6 -> 4 -> 6 columns.
- Split header: the header top is unchanged after the body scrolls 120 px.
- 0 console errors.

Harness:

| Tier | Result |
|---|---|
| Tier 1 | 8 passed, 1 failed (module-script marker, D8 conflict) |
| Tier 2 | 23 passed, 0 failed |
| Tier 3 | 3 passed, 0 failed |
| Tier 4 | 70 passed, 9 failed (was 23 failed at HEAD) |

## 6. Screenshots

| File | View |
|---|---|
| `workplan/reports/screenshots/p6_2_1440.png` | full page, light theme, 1440x900 |
| `workplan/reports/screenshots/p6_2_1440_dark.png` | full page, dark theme, 1440x900 |

## 7. Deviations and carried items

- **Tier 4c "sticky header" checks fail by design.** The harness looks for a `position: sticky`
  `thead` inside the scroller. Spec 4.3 / 7.2.15 requires the opposite: a fixed header outside the
  scroller. The split header passes the layout intent (the header does not move when the body
  scrolls) but not the harness selector. This is the same class of conflict as the Tier 1
  module-script marker (D8).
- **Tier 4b I-95 resize grips are absent.** Pinning two columns and adding resize grips to every
  header is not part of spec 4.3 and was not in the P6 baseline. Carried to P6.4 as a decision.
- **One I-90 "header height = 0" finding.** It reports the body table of a split pair, which has no
  `thead` by design.
- **AGENTS.md 18** still conflicts with the spec (universal `common/` assets, 48 px icon bar, right
  sidebar). The spec wins for this dashboard; reconciling AGENTS.md needs a separate approval.
- Tier 4 was not part of the P6.1 baseline (Tiers 1-3 only). The count is recorded here so that no
  regression is hidden: 23 fails at HEAD, 9 now.

## 8. What remains (P6.3-P6.4)

- **P6.3** - KPI strip 5 (72 px card, 22 px/700 value, 10 px label, 3 px strip), tokens 6, components
  7; remove remaining hardcoded colour values.
- **P6.4** - the 8 conformance record, the final screenshots, and a decision on the Tier 1
  module-script marker, the Tier 4c sticky check and the I-95 grips.

## 9. Recommendations

1. Keep `splitTable()` as the only table builder; do not reintroduce a `thead` inside a scroller.
2. Keep panel collapse state in `setupPanels()` only; panel-specific code must not toggle it.
3. Decide the Tier 4 deviations in P6.4 in one place, then record them in 8.3, so the harness and
   the spec no longer disagree silently.
