# P8.4 - Responsive Reflow Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P8.4 (T8.8.38, T8.8.39): reflow on any width change and navigation below 820 px; 280 assertions |

**Document ID**: PPP-RPT-P8.4-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.56 §8.13
**Related issues**: I-97, I-98

## 1. Index

1. Index
2. Reported behaviour
3. Cause
4. What changed
5. Tests and evidence
6. Screenshot
7. Recommendations

## 2. Reported behaviour

When the window moved to a narrower display (or was resized), the page did not reflow: the content
column gained a horizontal scrollbar, the PO chart stayed at its first width and the split tables did
not shrink. Below 820 px the sidebar disappeared, so page navigation was unreachable.

## 3. Cause

- Panels were grid items with the default `min-width:auto`, so a wide child locked the column width.
- The PO chart was rendered at a width computed once, with a fixed SVG width.
- The validation table used fixed pixel columns that could not shrink.
- The look-ahead control-row text could not shrink, pushing the CSV button out.
- The shell hid the sidebar with `display:none` below 820 px; the toggle only changed a class.

## 4. What changed

- Panels carry `min-width:0`; the content column can shrink.
- The PO chart is drawn at its host width and redrawn by a `ResizeObserver` on any width change (320 px
  floor); it no longer keeps a first-render width.
- Validation columns are percentages (6/12/24/14/12%) with Message taking the rest; the split header
  re-syncs through the existing observer.
- The control-row message truncates with an ellipsis instead of overflowing.
- Below 820 px the sidebar starts collapsed (0 px) instead of hidden; the menu-bar toggle opens it to
  160 px. Navigation is reachable and the content keeps the full width by default.

## 5. Tests and evidence

| Layer | Result |
|---|---|
| Built-artifact layer | 54 passed (5 new: 1024 and 800 px overflow, chart width, split-header delta at both widths) |
| All five layers | 37 + 71 + 22 + 54 + 96 = **280 assertions, 0 failed** |
| Measured | 24 page x width combinations (4 pages x 6 widths) with zero overflow and zero split-header delta |
| Narrow viewport | 800 px: sidebar 0 px collapsed, toggle opens 160 px, content overflow 0 |
| Harness | Tier 1 9/0, Tier 2 23/0, Tier 3 3/0, Tier 4 78/0, 0 advisories |

## 6. Screenshot

`workplan/reports/screenshots/p8_4_narrow.png` - 800 px wide with the sidebar collapsed and the quality
page fitted.

## 7. Recommendations

1. Any new chart must take its width from its host and redraw on resize; never compute a width once.
2. Any new table column set should use percentages, not fixed pixels, so the table shrinks with its card.
3. Keep navigation reachable at every width; collapsing is preferred to hiding.
