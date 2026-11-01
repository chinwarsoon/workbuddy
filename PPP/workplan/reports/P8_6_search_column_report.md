# P8.6 - Search Column Picker Report

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-11-01 | opencode (AI) | P8.6 (T8.8.42): attached search-column picker, field-scoped query, persistence; spec rule + assertion 20; 292 assertions |

**Document ID**: PPP-RPT-P8.6-001
**Status**: COMPLETE
**Workplan**: `PPP-Dashboard-Workplan.md` Rev 1.58 §8.15
**Related issue**: I-100

## 1. Index

1. Index
2. Reported behaviour
3. Spec requirement
4. What changed
5. Tests and evidence
6. Screenshot
7. Recommendations

## 2. Reported behaviour

Search applied the query to every searchable field at once. A reader could not choose which column the
query should match, so a term could return packages for the wrong reason.

## 3. Spec requirement

- §7.1 **B5** defines the attached `.inter-sel.is-attached` as the **search-column picker** (no own
  border, left-rounded, right divider).
- Spec revision 1.55 adds the **search panel composition** rule: one row with the attached picker, a
  flexible input and the A5 submit; the picker offers **All columns** plus each searchable column,
  keeps the choice visible, re-applies the query and never clears it.
- §8.2 assertion 20 covers it.

## 4. What changed

- One row: attached picker (114 px), flexible input, affixed 36 px submit.
- Options: All columns (default), Package title, Package no., Discipline, Item category, Status.
- The query is scoped to the chosen field; **All columns** keeps the previous multi-field search.
- The choice is remembered under `ppp-search-field` and restored on load.
- Changing the column re-applies the current query immediately; it never clears the text.
- The active-filter chip names the column, e.g. `Search (Discipline): mechanical`.
- The placeholder reads "Search the selected column".

## 5. Tests and evidence

| Layer | Result |
|---|---|
| Panels layer | 99 passed (three new derivation tests: All spans fields, a column narrows, discipline matches) |
| Built-artifact layer | 63 passed (four new: six options with All first, attached styling, one row, field behaviour) |
| All five layers | 37 + 71 + 22 + 63 + 99 = **292 assertions, 0 failed** |
| Measured | "mechanical": All 25, Discipline 23, Title 2, Status 0; row tops 133/133/133; picker radius 6 px, right border 0; persistence confirmed; 0 console errors |
| Harness | Tier 1 9/0, Tier 2 23/0, Tier 3 3/0, Tier 4 78/0, 0 advisories |

## 6. Screenshot

`workplan/reports/screenshots/p8_6_search_column.png` - the search panel with the attached column
picker set to Discipline.

## 7. Recommendations

1. Keep the picker first in the row; the input stays flexible so the row fits narrow panels.
2. Any new searchable field must be added to the picker and to the derivation map together.
3. Keep "All columns" as the default; a filtered column must stay visible in the control.
