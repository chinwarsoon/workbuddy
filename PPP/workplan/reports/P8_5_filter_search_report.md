# P8.5 - Category Filter and Search Compliance Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P8.5 (T8.8.40, T8.8.41): filter trigger and panel per B1; affixed search submit per A5; 286 assertions |

**Document ID**: PPP-RPT-P8.5-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.57 §8.14
**Related issue**: I-99

## 1. Index

1. Index
2. Reported behaviour
3. Spec requirements
4. What changed
5. Tests and evidence
6. Screenshots
7. Recommendations

## 2. Reported behaviour

The menu-bar category filter and the search control did not match the control spec: the filter trigger
had a funnel icon and a caret, used 11 px uppercase text with a visible border, and showed its state by
rewriting the label; the panel lacked the note and footer; the search field had no affixed submit.

## 3. Spec requirements (B1 / A5, normative)

- B1 trigger: text plus a **count badge**, 12 px / 600, **borderless in the menu bar**, **no caret**,
  hover soft, selected cue `is-filtered` plus the badge.
- Floating panel order: **master → note → divider → scrollable list → footer** (actions and counts).
- A5 search: `.search-btn` **affixed to the input**, accent fill, white glyph, radius `0 6px 6px 0`.
- The menu bar stays one row; Search is a panel, not an inline field.

## 4. What changed

- Trigger: two icons removed; label "Categories"; count badge (10 px / 700) shown only when filtered;
  `.is-filtered` state replaces the old label rewriting; 12 px / 600; transparent border and fill.
- Panel: master "All Categories", note, 1 px divider, scrollable item list (max 240 px), footer with
  "N of M selected" and Reset; the panel is a flex column with a 320 px cap.
- Search: input and affixed `.search-btn` in one row; the button applies the current text; Enter also
  applies; Escape still closes.
- Help copy now says "Categories" instead of "All Categories".

## 5. Tests and evidence

| Layer | Result |
|---|---|
| Built-artifact layer | 60 passed (six new: trigger size/weight, border, no icons, panel order, badge state, search submit) |
| All five layers | 37 + 71 + 22 + 60 + 96 = **286 assertions, 0 failed** |
| Measured | Trigger 12 px / 600, transparent border, 0 icons; badge "15" with "15 of 16 selected"; reset returns to all; search button 36 px, accent `rgb(30,136,229)`, right radius 6 px |
| Harness | Tier 1 9/0, Tier 2 23/0, Tier 3 3/0 (filter round-trip), Tier 4 78/0, 0 advisories |

## 6. Screenshots

`p8_5_filter_panel.png` - the filter panel with master, note, divider, list and footer.
`p8_5_filter_search.png` - the search panel with the affixed submit and a live result.

## 7. Recommendations

1. Keep the trigger label stable; state belongs on the badge and the `is-filtered` class.
2. Keep the floating panel order fixed; new controls go in the footer only.
3. Any search input on a dashboard uses the affixed `.search-btn` submit.
