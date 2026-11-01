# P8.3 - Panel Separation Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P8.3 (T8.8.37): stacked panels separated by 14 px; card gaps verified; spec §4 + assertion 19 |
| 1.1 | 2026-11-01 | opencode (AI) | Spec promoted the rule to a dedicated normative section §4.7; assertion 19 now cites it. No code change. |

**Document ID**: PPP-RPT-P8.3-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.54 §8.12
**Related issue**: I-96

## 1. Index

1. Index
2. Reported behaviour
3. Cause
4. What changed
5. Tests and evidence
6. Screenshot
7. Recommendations

## 2. Reported behaviour

After page routing, a page can carry two panels (Overview, PO Schedule, Data Quality). Their borders
touched: there was no separation between panels.

## 3. Cause

The content column was a plain block, and the panel margin had been set to 0 for the earlier
multi-panel layout. Nothing supplied a gap, so consecutive panel borders met.

## 4. What changed

- **Content column.** It is now a single-column grid with a **14 px** gap, matching the panel margin
  the spec defines. Hidden pages are `display:none`, so they take no space and add no gap.
- **Cards inside a panel.** Checked and kept: 16 px between the two chart cards, 12 px between the
  validation cards.
- **Spec.** The rule is now its own normative section **§4.7 Panel spacing** (14 px on both axes,
  container gap or panel margin but never both, never 0, hidden panels add nothing, print keeps it,
  card spacing inside a panel stays separate). §8.2 assertion 19 cites §4.7.

## 5. Tests and evidence

| Layer | Result |
|---|---|
| Built-artifact layer | 49 passed (3 new: panel gaps on three pages, validation card gap 12 px, chart card gap 16 px) |
| All five layers | 37 + 71 + 22 + 49 + 96 = **275 assertions, 0 failed** |
| Measured | Overview 14 px, PO Schedule 14 px, Data Quality 14 px |
| Harness | Tier 1 9/0, Tier 2 23/0, Tier 3 3/0, Tier 4 79/0, 0 advisories |

## 6. Screenshot

`workplan/reports/screenshots/p8_3_panel_gaps.png` - the Overview page with a clear gap between the
KPI panel and the chart panel.

## 7. Recommendations

1. Keep panel spacing in the container gap; never re-add a panel margin inside the grid.
2. A new page with two panels needs no extra CSS: the container gap applies automatically.
