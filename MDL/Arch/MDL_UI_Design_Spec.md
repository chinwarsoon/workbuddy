# MDL CONTROL CENTER
## UI/UX Design Specification

Version: 1.0
Date: 29 Sep 2026
Last revised: 2026-10-19 — CodeBuddy — §11 (Filtering System) expanded to state the two-tier
global-first → panel filter cascade and to reference the shared `Dashboard-UI-Design-Spec.md` §7.2.7 (Filter
population rule), which was added to close the dangling code citation. Driven by MDL filter-behaviour review.
2026-10-18 — chinwarsoon — §18 (Table Standards): alignment re-scoped per table class (summary
cross-tab centres numeric columns, transactional tables keep `number → right`), alignment keyed on the column
key and never `nth-child`, sort affordance covers centred headers, fit policy content-derived with proportional
shrink-to-fit, and the split-header contract made normative as six clauses. Contradicting clause removed (the
former "The Discipline Summary Matrix must not centre numeric figures").

---

# 1. Design Philosophy

The application shall be designed as a:

> Professional Document Control System first, Dashboard second.

The primary objective is to enable Document Controllers, Engineers, Coordinators, and Project Managers to quickly identify:

- Overdue actions
- Upcoming submissions
- Client review status
- Approval progress
- Data quality issues

The user should be able to keep the application open throughout the working day and immediately identify items requiring attention.

---

# 2. Visual Direction

Style:

- Clean Industrial
- Swiss Modernist
- Enterprise Application

Influences:

- Microsoft Project
- Primavera P6
- SharePoint Modern Experience
- Engineering Document Control Systems
- Enterprise Project Management Platforms

Avoid:

- Glassmorphism
- Excessive animations
- Consumer-app styling
- Large decorative charts
- Neon color themes

---

# 3. Layout Structure

```

┌──────────────────────────────────────────────────────────────┐
│ MDL CONTROL CENTER                         TWRP C3B2        │
│ Master Document List                       29 Sep 2026      │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ OVERVIEW      │ DOCUMENT CONTROL HEALTH                      │
│ Reviews       │                                              │
│ Documents     │ Active     Submitted     Approved  Overdue   │
│ Quality       │                                              │
│               │                                              │
│               │ Action Required                              │
│               │                                              │
├───────────────┴──────────────────────────────────────────────┤
│ Upcoming Submissions                                         │
├──────────────────────────────────────────────────────────────┤
│ Discipline Analysis                                          │
├──────────────────────────────────────────────────────────────┤
│ Document Detail / Action List                                │
└──────────────────────────────────────────────────────────────┘

```

---

# 4. Navigation Structure

## Left Navigation

### OVERVIEW

- Dashboard
- Control Health
- Submission Forecast

### REVIEWS

- Client Reviews
- Contractor Reviews
- SLA Aging
- Resubmissions

### DOCUMENTS

- Document Register
- Discipline Analysis
- Authority Matrix
- Approval Status

### QUALITY

- Validation
- Missing Data
- Duplicate Records
- Workbook Issues

### SETTINGS

- Configuration
- Refresh Data
- User Preferences

---

# 5. Header Design

The header remains fixed at the top.

Contents:

- Application Name
- Project Name
- Package Name
- Global Search
- Last Refresh Date
- User Profile

Example:

```

MDL CONTROL CENTER

Project: TWRP C3B2
Last Refresh: 29 Sep 2026 08:00

[ Search Documents ]

```


# 6. Dashboard Overview Page

## KPI Section

Display as cards.

```

┌─────────┐
│ Active  │
│ 1,245   │
└─────────┘

┌─────────┐
│Submitted│
│ 1,012   │
└─────────┘

┌─────────┐
│Approved │
│ 821     │
└─────────┘

┌─────────┐
│Overdue  │
│ 47      │
└─────────┘

```

### KPI Card Rules

- White background
- Light border
- Minimal shadow
- Large number
- Small label

---

# 7. Action Required Section

Most important section of the application.

Display directly below KPI cards.

Example:

```

ACTION REQUIRED

⚠ Overdue Submissions               12

⚠ Client Reviews Overdue             8

⚠ Resubmissions Pending             15

⚠ Validation Errors                  6

```

Requirements:

- Entire row clickable
- Sorted by severity
- Count visible
- Color coded

---

# 8. Submission Forecast

Display upcoming workload.

Categories:

- Next 7 Working Days
- Next 14 Working Days
- Next 30 Working Days

Example:

```

7 WD        14 WD       30 WD

18          31          72

```

Recommended visualization:

- Small bar chart
- Compact trend chart

Not more than 25% of screen height.

---

# 9. Review Management Page

## Review SLA Status

Display:

- Within SLA
- Due Soon
- Due Today
- Overdue

Preferred chart:

- Horizontal stacked bar chart

Avoid:

- Pie charts
- Donut charts

---

## Review Aging

Groups:

- 0-5 WD
- 6-10 WD
- 11-20 WD
- >20 WD

Purpose:

Identify review backlog severity.

---

# 10. Document Register Page

This shall be the largest and most detailed module.

## Table Columns

- Document Number
- Document Title
- Discipline
- Originator
- Revision
- Current Status
- Review Code
- Authority
- Due Date
- Aging
- Remarks

Example:

| Document No | Discipline | Status | Due Date | Aging |
|-------------|------------|---------|----------|--------|
| P-123-001 | Process | Review Overdue | 18 Sep | 8 WD |
| M-456-023 | Mechanical | Resubmit | 22 Sep | 5 WD |
| E-234-011 | Electrical | Due Soon | 30 Sep | 2 WD |

---

# 11. Filtering System

The MDL Control Center applies a **two-tier filter cascade** (normative in the shared
`Dashboard-UI-Design-Spec.md` §7.2.7):

1. **Global filters first (S4 Derive).** The menu-bar `Discipline` and `Stage` multi-select chips
   and the document `Search` are combined (AND) into one pass over the master record set and produce
   a single shared, reduced working set. **Every panel** — KPIs, charts, the Overdue list, the
   Discipline Summary Matrix, the validation/issue list and the Document Detail table — derives from
   this same set, so one selection re-derives the whole dashboard at once.
2. **Panel filters second (S5 Render).** Each panel's own column-level filters (text / enum /
   numeric / date) and the matrix month-selector then narrow that panel's rows, which are already a
   subset of the global set. A panel filter can only narrow further — it can never re-include a
   record a global filter excluded.

Must support per-column filtering on:

- Discipline
- Status
- Authority
- Originator
- Reviewer
- Revision
- Review Code
- Date Range

Search Features:

- Global document search
- Fuzzy search
- Multi-column filtering

---

# 12. Discipline Analysis

Display:

- Process
- Mechanical
- Piping
- Electrical
- Instrumentation
- Civil
- Structural

Metrics:

- Total Documents
- Submitted
- Approved
- Overdue
- Pending Reviews

Use compact visualizations only.

---

# 13. Quality Module

## Validation Dashboard

Display:

```

Missing Revisions                12

Duplicate Document Numbers        3

Invalid Status Codes             5

Missing Dates                    7

Authority Conflicts              1

```

Purpose:

Enable rapid identification of data issues.

---

## Duplicate Detection

Display:

| Document No | Duplicate Count |
|------------|----------------|
| P-123-001 | 2 |
| E-234-011 | 3 |

---

## Missing Data

Display records containing:

- Blank revision
- Missing due date
- Missing authority
- Missing review code

---

# 14. Status Design

Do not rely on color alone.

Every status shall contain:

- Icon
- Text
- Color

## Status Library

| Status | Display |
|----------|----------|
| Approved | ✅ Approved |
| Within SLA | 🔵 Within SLA |
| Due Soon | 🟠 Due Soon |
| Due Today | 🟡 Due Today |
| Overdue | 🔴 Overdue |
| Resubmit | ↺ Resubmit |
| Validation Error | ⚠ Error |

Accessibility compliance required.

---

# 15. Design Tokens

## Colors

### Primary

```

#0F2D52

```

Dark Navy

### Accent

```

#1E88E5

```

Engineering Blue

### Success

```

#2E7D32

```

Green

### Warning

```

#F9A825

```

Amber

### Critical

```

#C62828

```

Red

### Neutral

```

#64748B

```

Slate Grey

### Background

```

#F6F8FA

```

Off White

### Surface

```

#FFFFFF

```

White

### Border

```

#D9E1E8

```

Light Grey

---

# 16. Typography

Preferred Fonts:

- Segoe UI
- Inter
- Source Sans Pro

Scale:

| Usage | Size |
|---------|---------|
| Page Title | 28px |
| Section Title | 20px |
| KPI Number | 32px |
| Body Text | 14px |
| Table Header | 13px |
| Caption | 12px |

---

# 17. Spacing Scale

Use consistent spacing values:

```

4px
8px
12px
16px
24px
32px
48px

```

---

# 18. Table Standards

## Table Header

- Sticky header
- Light grey background

### Sticky-header rules (single-row and grouped)

- Every header row that scrolls with its table **must** compute to `position: sticky`.
- **Single-row header** (one `<thead>` row): the header sticks at `top: 0` of its scroll container.
- **Grouped / multi-row header** (two or more `<thead>` rows, e.g. the Discipline Summary
  Matrix): the rows must **stack**, not pile up. Row 0 sticks at `top: 0`; row *n* sticks at
  `top: (sum of the heights of every header row above it)`. Each row's stacking offset is derived
  from the real rendered row heights, so a `rowspan` cell that spans two bands does **not** shift the
  offset of the band below it. Consequence: after scrolling, the group band and the leaf band stay
  visible together, top band above bottom band, with no overlap and no gap.
- Every sticky header cell carries an **opaque** background so body rows never show through.

### Header-band colour rule

- Within one header row ("band") every cell resolves to the **same** background colour.
- A per-column emphasis (for example the "current month" tint on the Summary Matrix) is allowed, but it
  must run the **full height of the column**: both header bands **and** the body cells of those columns
  get the emphasis, or the emphasis is confined to the body only. Splitting a single band — painting one
  group cell a different colour from its siblings — is forbidden: the group band and the leaf band must
  use the **same colour palette**.
- The live dashboard and any exported copy (PNG / print) must agree on header colours.

### Scrollbar gutter

- A table that lives inside a scroll container (`.tableScroll`) and has **vertical overflow** must keep
  its header clear of the scrollbar.
- **Grouped headers** must therefore be rendered with the **split-header pattern** already used by the
  Rule Reference: the header is a separate, non-scrolling fragment (`vheadtab`) sitting **outside** the
  body's scroll container, so the vertical scrollbar sits **under** the header rather than beside it; the
  fragment reserves a trailing gutter column of the scrollbar width (`--ds-sbw`) so its columns stay
  aligned with the body.
- **Single-row headers** may remain inside the scroller (the I-90 sticky rule covers them); the scrollbar
  sitting beside a one-row header is acceptable.
- **Split-header contract** — a `vheadtab` fragment (used here by the Discipline Summary Matrix) is a
  declared exception to the sticky rule, and the exception is paid for with the pairing invariants in the
  **shared spec §7.2.15** (one container · containing block · width pin + gutter · one column grid · fit
  then lock-step · one implementation). That section is the single source of truth and is normative for
  both dashboards; it is enforced by `harness-layout` Tier 4c under `chrome.splitHeader`.

### Cell & header alignment

- **Header cells** compute to `vertical-align: middle` (not `top`); a wrapped/long header label stays
  vertically centred.
- **Data alignment follows the column's data type**, not a blanket left. This applies to the
  transactional tables (Overdue, Document Detail, Validation issues):
  - `text` / identifier columns (e.g. Document No., Source Tab) → **left**.
  - `number` / `currency` / `date` → **right**, with `font-variant-numeric: tabular-nums` so figures line up.
  - `boolean` / `status` / `severity` → **centre**.
- **Summary cross-tab matrices centre every data column, numeric ones included.** The Discipline Summary
  Matrix is a cross-tab of comparable counts read as a grid, so its figures are **centred** — still with
  `font-variant-numeric: tabular-nums` so digits line up — and only the leading label column stays **left**.
  (The type-based `right` rule above is scoped to transactional tables and does **not** apply here; these
  two statements are not in conflict because they govern different table classes.)
- **The header of a column must use the same alignment as its body cells.** This is the invariant that
  matters: a centred numeric column gets a centred header, a right-aligned one a right-aligned header.
  Alignment must therefore be derived from the **column's key in the column model**, never from DOM
  position — positional selectors (`nth-child`) are invalid for alignment, because a grouped header with
  `rowspan` cells gives the header row different child indices from the body row it labels.

### Sort affordance

- A sortable column's indicator (▲ / ▼ / ⇅) is pinned to the **trailing (right) edge** of the header
  cell, independent of the label's alignment.
- **Left-aligned header** — the label stays left and only the glyph hugs the right edge (e.g.
  `margin-left:auto` on the indicator).
- **Right-aligned header** — the label-and-glyph group reads right-aligned as a unit.
- **Centred header** — the label centres within the space to the left of the indicator, and the indicator
  still hugs the right edge. (Centring the label and pinning the glyph are not in conflict: the glyph is
  taken out of the centring calculation.)
- The indicator must never sit mid-cell or immediately after the label with empty space to its right.

### Column sizing (min / max / truncation / fit)

- Every column declares a **minimum width** derived from its type floor plus the rendered header-label
  width (+ sort-glyph allowance); the resize handle cannot go below it. Replace the single global `60px`
  floor with per-type minima (boolean/severity ≈ 64, date ≈ 110, identifier ≈ 120, text ≈ 90, checkbox ≈ 28).
- Every column declares a **maximum width**; content beyond it **truncates** with an ellipsis
  (`overflow:hidden; text-overflow:ellipsis`, with a `title` tooltip) — or wraps to a fixed line count
  then ellipsis. Truncation applies to **all** cells, not only pinned ones.
- **Fit policy**: the table uses `table-layout:fixed; width:100%`. Column widths are derived from **content**
  (the widest of the header label vs the rendered body values), not fixed literals, and are then scaled:
  when the column-sum is below the display area the columns scale proportionally **up** to fill it; when the
  declared sum **exceeds** the display area the columns scale proportionally **down to fit**, so the table
  fills the display area instead of overflowing it. A horizontal scrollbar is a last resort, not the default.
  (Header/body lock-step for a split-header table is specified in the split-header contract above, not here.)

## Row Height

```

40px

```

## Header Height

```

44px

```

## Borders

```

1px solid #D9E1E8

```

Rules:

- Minimal zebra striping
- Prioritize readability
- Fixed first column optional

---

# 19. Buttons

## Primary

Background:

```

#1E88E5

```

Text:

```

White

```

Examples:

- Submit
- Save
- Refresh

## Secondary

Border only

Examples:

- Cancel
- Export
- Back

---

# 20. Badges

Approved:

```

Green

```

Overdue:

```

Red

```

Due Soon:

```

Amber

```

Review:

```

Blue

```

---

# 21. Export Requirements

Support:

- Excel Export
- PDF Export
- CSV Export

Report Formats:

- A4 Portrait
- A3 Landscape

---

# 22. Responsive Behaviour

Primary Target:

Desktop

Secondary:

Tablet

Minimum Features on Mobile:

- Search
- Status Check
- View Document Details

Avoid full desktop table layouts on mobile.

---

# 23. Print Mode

Required.

Must support:

- Black-and-white printing
- Readable status indicators
- Landscape tables
- PDF generation

---

# 24. Success Criteria

The application shall enable users to:

1. Identify overdue actions within 5 seconds.
2. Locate a document within 10 seconds.
3. Review project document health at a glance.
4. Detect data-quality issues immediately.
5. Operate effectively throughout the workday without visual clutter.

---

# Final Design Statement

The MDL Control Center shall present a professional, industrial, engineering-focused user experience emphasizing document control efficiency, review tracking, data quality, and actionable information rather than decorative dashboard elements.