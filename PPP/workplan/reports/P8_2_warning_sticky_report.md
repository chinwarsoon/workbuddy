# P8.2 - Warning Area Placement Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P8.2 (T8.8.36): notice area pinned below the menu bar; spec §3.5 normative + assertion 18; 272 assertions |

**Document ID**: PPP-RPT-P8.2-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.53 §8.11
**Related issue**: I-95

## 1. Index

1. Index
2. Reported behaviour
3. Cause
4. What changed
5. Tests and evidence
6. Screenshot
7. Recommendations

## 2. Reported behaviour

System notices (formula errors, load failures, configuration messages) scrolled out of view with the
panels. The owner requires the notice area to stay attached to the bottom of the menu bar.

## 3. Cause

The notice element lived inside the scrolling page body and relied on `position: sticky` inside that
scroller. Any scroll moved the content, and the sticky rule fought with a negative margin, so the
notice left the screen instead of staying under the menu bar.

## 4. What changed

- **DOM.** The notice area is now the first block of the content column: below the menu bar, above the
  filter strip and above the scrolling body. The content column does not scroll, so the notice stays.
- **CSS.** The fixed and sticky rules are replaced by a normal block in that column; the welcome
  offsets were removed. Hidden when empty, hidden in print, and the Warnings toggle still hides and
  shows it.
- **Spec.** §3.5 gained a normative **Placement** rule (pinned below the menu bar, above the filter
  strip, outside the scrolling body), a revision-history row, and §8.2 assertion 18.

## 5. Tests and evidence

| Layer | Result |
|---|---|
| Built-artifact layer | 46 passed (3 new: outside the scroller, directly below the menu bar, stable while panels scroll 240 px) |
| All five layers | 37 + 71 + 22 + 46 + 96 = **272 assertions, 0 failed** |
| Harness | Tier 1 9/0, Tier 2 23/0 (including "warning area stays inside content width"), Tier 3 3/0, Tier 4 79/0, 0 advisories |

## 6. Screenshot

`workplan/reports/screenshots/p8_2_warning_bar.png` - a notice visible directly below the menu bar
while the panels are scrolled.

## 7. Recommendations

1. Any new notice type stays inside the same area; do not add a second fixed bar.
2. Keep the filter strip below the notice area; the order is notice, filter strip, body.
