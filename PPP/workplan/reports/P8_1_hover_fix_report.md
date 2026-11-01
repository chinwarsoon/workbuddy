# P8.1 - Chart Hover Corrections Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P8.1 (T8.8.34, T8.8.35): stale PO hover window fixed; dashed snap line added; 269 assertions |

**Document ID**: PPP-RPT-P8.1-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.52 §8.10
**Related issues**: I-93, I-94

## 1. Index

1. Index
2. Reported defect
3. Cause
4. What changed
5. Tests and evidence
6. Screenshot
7. Recommendations

## 2. Reported defect

On the PO plan versus actual chart:

- the hover window kept the first month's content while the pointer moved to other months;
- no position line appeared at the hovered month.

## 3. Cause

The chart host element itself carried a detail payload (the first month). Any point in the plot that
was not directly on a bar — the gaps, the grid, the plot background — resolved to that host payload,
so the window looked frozen. The binder also had no snap line at all.

## 4. What changed

- **Host payload split.** A chart host now carries only the focus payload (`data-tip-first`); the
  pointer path reads per-point payloads only.
- **Per-month bands (T8.8.34).** The PO plot has one full-height transparent band per visible month,
  carrying that month's payload and a snap position. Every position in the plot now reports the
  month under the pointer. Horizontal bar charts gained a full-row band for the same reason.
- **Snap line (T8.8.35).** One dashed `.chart-snap` line is drawn per hovering chart and moved to the
  band centre; it is hidden on leave, on blur and on scroll. Styling is token-only
  (`--text3`, 1 px, dash 3 3).

## 5. Tests and evidence

| Layer | Result |
|---|---|
| Panels layer | 96 passed (3 new: band count, band payload and snap position, one snap line) |
| Built-artifact layer | 43 passed (3 new: bands exist, the window changes between months, the line is visible and moves) |
| All five layers | 37 + 71 + 22 + 43 + 96 = **269 assertions, 0 failed** |

Browser: moving across three months changed the window text each time and moved the snap line
(x = 130, 258, ...); 0 console errors.

## 6. Screenshot

`workplan/reports/screenshots/p8_1_po_snap.png` - the PO chart with the window open and the dashed
line on the hovered month.

## 7. Recommendations

1. Any new chart that draws a time or ordered axis should add one band per datum; the binder then
   needs no per-chart code.
2. Keep the host payload for focus only; a payload on the host masks per-point updates.
