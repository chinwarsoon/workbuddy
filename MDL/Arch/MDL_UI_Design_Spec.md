# MDL CONTROL CENTER
## UI/UX Design Specification

Version: 1.0  
Date: 29 Sep 2026

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

---

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

Must support:

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