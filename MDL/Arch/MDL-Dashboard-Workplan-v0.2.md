# MDL Dashboard — Developer Workplan v0.2

> **Project**: TWRP C3B2 — Master Document List (MDL) Interactive Dashboard  
> **Version**: 0.2  
> **Date**: 2026-09-29  
> **Status**: Revised proposal — awaiting approval  
> **Basis**: Revision of `MDL-Dashboard-Workplan.md` following senior document-control, UI/UX, and Excel/data-processing review.  
> **Implementation constraint**: **NO CODE WRITTEN UNTIL THIS WORKPLAN IS APPROVED.**

---

## 0. Contents

| § | Section |
|---|---|
| 1 | Summary & Purpose |
| 2 | Guiding Principles |
| 3 | Excel Data Structure & Contract |
| 4 | Data Processing Architecture |
| 5 | Dashboard Modules & UI |
| 6 | Validation Rules |
| 7 | Technical Architecture |
| 8 | Workplan / Waves |
| 9 | Testing & Acceptance Criteria |
| 10 | Definition of Done |
| 11 | Decisions Captured |
| 12 | Open Questions / Assumptions |
| 13 | Future Enhancements |

---

# 1. Summary & Purpose

## 1.1 Overview

A **standalone, offline-first, browser-based interactive dashboard** for the Master Document List workbook:

`MDL/TWRP C3B2 - Master Document List.xlsx`

The dashboard parses `.xlsx` or `.csv` entirely in the browser.

Target characteristics:

- No server.
- No external data transmission.
- No CDN.
- No npm/framework dependency at runtime.
- Single HTML application.
- Excel Code sheet drives lookup/configuration behavior.
- All dashboard calculations derive from one consolidated document model.

## 1.2 Purpose

### Primary

Provide document controllers and discipline leads with a single-page operational view of:

- active document population;
- planned and issued documents;
- approval status;
- schedule status;
- authority submissions;
- data-quality health;
- discipline distribution.

### Secondary

Validate document records against:

- Code-sheet lookup domains;
- document-number composition;
- workflow/state rules;
- date rules;
- referential integrity;
- required metadata;
- uniqueness rules.

### Tertiary

Allow additional UESH disciplines to appear automatically when:

- the discipline exists in the Code!H list; and
- a matching document-list worksheet is added.

---

# 2. Guiding Principles

| Principle | Implementation |
|---|---|
| Offline-first | All parsing, validation, calculations and rendering run locally in the browser |
| Zero runtime dependencies | Single HTML file; no CDN/framework dependency |
| Contract-driven | Code sheet is the source for lookup domains and configurable business metadata |
| Single source of truth | All KPI, chart, filter, validation and detail results derive from the consolidated model |
| Fail-soft | Workbook/data issues are reported without preventing the dashboard from displaying usable information |
| Traceable | Every consolidated record retains source worksheet and source row |
| Normalized | Excel values are normalized before business rules are applied |
| Reconciled | KPI, matrix, chart and detail totals must reconcile |
| Extensible | New disciplines and lookup values can be added through the workbook contract |
| Accessible | Core keyboard, semantic, focus and color-independent accessibility is built into the UI architecture |
| Auditable | Exported results identify source workbook, dashboard version, timestamp and active filters |

---

# 3. Excel Data Structure & Contract

## 3.1 Code sheet = contract source

The Code sheet remains the primary configuration source.

The dashboard reads:

1. column map;
2. lookup domains;
3. UESH Discipline universe;
4. error-code metadata;
5. any supported lifecycle/semantic metadata.

No ordinary business value list is hard-coded in the HTML.

## 3.2 Document-list column map

The document-list layout remains A–Y:

| Col | Field | Type |
|---|---|---|
| A | SNo. | Int |
| B | Stage | Text |
| C | UESH Discipline | Text |
| D | P6 Activity ID | Text |
| E | BQ Number | Text |
| F | System | Text |
| G | Project Code | Text |
| H | Project Prefix | Text |
| I | Doc Type | Text |
| J | Discipline (Code) | Text |
| K | Number | Text |
| L | Rev | Text |
| M | Document No. | Text |
| N | Document Title | Text |
| O | Notes | Text |
| P | As-Built | Boolean |
| Q | Authority | Text |
| R | Vendor Data | Boolean |
| S | Planned 1st Issue Date | Date |
| T | Forecast 1st Issue Date | Date |
| U | Actual 1st Issue Date | Date |
| V | Prolog Number | Text |
| W | Prolog Submission Status | Text |
| X | Latest Approval Date | Date |
| Y | Latest Approval Status | Text |

## 3.3 UESH Discipline

The canonical UESH Discipline universe is read from:

`Code!H`

The current universe contains 20 values.

The dashboard must not assume that this list will remain fixed.

## 3.4 Discipline worksheet discovery

A worksheet is treated as a document-list worksheet only when:

1. its tab name matches a value in the UESH Discipline list; and
2. its header structure conforms to the A–Y document-list contract.

Currently available worksheets remain:

- Project
- QAQC
- Process
- Mech
- BS
- CSA
- ICA
- Electrical

`BQ`, `Notes`, and `Dashboard` remain outside the document-list population.

## 3.5 Authoritative discipline

The authoritative dashboard discipline is:

`Document List column C — UESH Discipline`

The worksheet name is retained only as:

`sourceTab`

This distinction must remain explicit throughout the application.

---

# 4. Data Processing Architecture

## 4.1 Mandatory processing pipeline

The dashboard must process the workbook in this order:

```text
Excel / CSV
    |
    v
Workbook Parser
    |
    v
Workbook Structure Validation
    |
    v
Code Contract
    |
    v
Raw Records
    |
    v
Normalization
    |
    v
Consolidated Document Model
    |
    +----------------------+
    |                      |
    v                      v
Validation Engine      Derived Fields
    |                      |
    +----------+-----------+
               |
               v
          View Model
               |
       +-------+-------+
       |       |       |
       v       v       v
      KPI    Charts  Detail
               |
               v
             Export
```

## 4.2 Raw records vs consolidated records

The implementation must distinguish between:

### Raw records

All candidate rows read from document-list worksheets.

```text
rawRows[]
```

These are used for structural/data-quality checks.

### Consolidated records

Rows that pass the minimum record gate:

```text
Document No. (M) is non-blank after normalization
```

These become:

```text
documents[]
```

### Excluded records

Rows removed from the operational document model must remain traceable:

```text
excludedRows[]
```

with:

- source tab;
- source row;
- exclusion reason.

This resolves the conflict between V-01 and the previous rule that blank Document No. rows were removed before validation.

## 4.3 Record categories

Each raw row should have an explicit processing state:

```text
candidate
valid
inactive
excluded
```

Recommended semantics:

| State | Meaning |
|---|---|
| candidate | Raw populated row being evaluated |
| valid | Has Document No. and is eligible for consolidated model |
| inactive | Has Document No. but lifecycle status excludes it from active counts |
| excluded | Does not satisfy minimum record gate |

## 4.4 Active document rule

The existing business decision remains:

```text
isActiveDoc(row) =
    Document No. is non-blank
    AND Stage is not an excluded lifecycle state
```

Current excluded lifecycle states:

- Deleted
- Void
- Superseded

### Recommended contract improvement

The long-term Code-sheet contract should provide lifecycle metadata rather than requiring the application to know these meanings.

For example:

| Code | Description | Active? | Dashboard Group |
|---|---|---:|---|
| APP | Approved | Yes | Approved |
| AWC | Approved with Comments | Yes | Approved |
| REJ | Rejected | Yes | Rejected |
| Deleted | Deleted | No | Excluded |
| Void | Void | No | Excluded |
| Superseded | Superseded | No | Excluded |

Until such metadata exists, the documented lifecycle exclusion remains the approved temporary business constant.

## 4.5 Active vs planned vs issued

The dashboard must not use "Total Planned" as a synonym for all active records.

Use the following terminology:

### Active Documents

All active records with a valid Document No.

### Planned Documents

Active documents with a Planned 1st Issue Date.

### Issued Documents

Active documents with an Actual 1st Issue Date.

### Approved Documents

Active issued documents with an approval conclusion classified as approved.

This avoids ambiguity in document-control reporting.

## 4.6 Recommended KPI definitions

```text
Active Documents
= active documents

Planned Documents
= active documents with S populated

Issued Documents
= active documents with U populated

Approved Documents
= active documents with approval status classified as APP/AWC

Rejected Documents
= active documents with approval status classified as REJ

Approval Pending
= issued active documents without a final approval conclusion
```

Percentages must always display their denominator.

Examples:

```text
Issue Progress = Issued / Planned
Approval Progress = Approved / Issued
```

If a denominator is zero, display `N/A`, not `0%`.

---

# 5. Dashboard Modules & UI

## 5.1 Information hierarchy

The dashboard should be organized into four levels.

### Level 1 — Document Control Health

Primary user question:

> What requires attention?

Display:

- Active Documents
- Planned Documents
- Issued Documents
- Approved
- Approval Pending
- Overdue
- Validation Errors
- Validation Warnings
- Data Completeness

### Level 2 — Document Control Analysis

Display:

- Documents by Discipline
- Issue progress
- Approval distribution
- Schedule status
- Authority distribution
- Stage distribution
- Document type distribution

### Level 3 — Data Quality

Display:

- issues by discipline;
- issues by rule;
- completeness;
- duplicate document numbers;
- structural workbook issues.

### Level 4 — Detail

Display the filtered document table and validation detail.

## 5.2 KPI cards

Recommended KPI row:

```text
ACTIVE
PLANNED
ISSUED
APPROVED
PENDING
OVERDUE
ERRORS
COMPLETENESS
```

Each KPI must provide a tooltip explaining:

- definition;
- numerator;
- denominator, if applicable;
- active/inactive treatment.

## 5.3 Health panel

A dedicated operational panel should identify:

```text
Overdue documents
Approval problems
Duplicate document numbers
Missing required data
Invalid references
Future dates
Structural workbook problems
```

The health panel should link/filter the detail table where practical.

## 5.4 Charts

Initial charts:

1. Documents by Discipline
2. Issue Progress
3. Approval Distribution
4. As-Built Status
5. Documents by Authority
6. Documents by Doc Type
7. Documents by Stage
8. Schedule / Look-Ahead
9. Validation Issues by Discipline
10. Validation Issues by Rule

The UI should avoid displaying all charts with equal visual weight.

Primary operational charts should be visually prioritized.

## 5.5 Schedule / look-ahead

The schedule module should distinguish:

- overdue;
- due today;
- due within 7 days;
- due within 14 days;
- due within 30 days;
- future.

For documents with Forecast Date and no Actual Date:

```text
Days Overdue = Today - Forecast
```

For issued documents:

```text
Schedule Variance Days = Actual - Forecast
```

The sign convention must be documented in the UI tooltip.

## 5.6 Filters

Global filters:

- UESH Discipline
- Stage
- Authority
- Approval Status
- date range

Controls:

```text
[Reset Filters]
```

A visible filter summary must show:

```text
Active filters
Records shown / total records
```

All KPIs, charts and tables must use the same filtered view model.

## 5.7 Detail table

Default columns should prioritize document-control information:

```text
Document No.
Document Title
UESH Discipline
Stage
Rev
Planned
Forecast
Actual
Prolog No.
Prolog Status
Approval
Approval Date
Authority
Validation
Source
```

Additional columns may be available through a column selector.

Recommended behavior:

- sortable;
- filter-aware;
- frozen key columns where practical;
- pagination or virtual scrolling;
- validation indicator;
- source worksheet and source row for traceability.

## 5.8 Export

Exports must include metadata.

Recommended CSV metadata header:

```text
Source workbook
Dashboard version
Validation timestamp
Filter state
Record count
```

Exports:

- filtered document extract;
- validation issues;
- optional reconciliation report.

PNG chart exports should identify the chart title and active filter state.

---

# 6. Validation Rules

## 6.1 Rule metadata

Every validation rule should conceptually have:

| Attribute | Meaning |
|---|---|
| Rule ID | V-xx |
| Category | Domain / Cross-field / Workflow / Timeline / Referential / Completeness / Uniqueness |
| Trigger | When rule is evaluated |
| Condition | Pass/fail logic |
| Severity | Error / Warning / Info |
| Blocking | Whether the issue prevents a record from being considered valid |
| Message source | Code-sheet error code |
| Affected record | Source row/document |

Severity and blocking status are separate concepts.

## 6.2 Blocking definition

Recommended interpretation:

### Blocking Error

A record cannot be considered fully valid for data-completeness purposes.

### Warning

The record remains operationally usable but requires attention.

### Info

Informational condition with no data-quality penalty.

Therefore:

```text
recordValid = no blocking validation issue
```

rather than:

```text
recordValid = no warning
```

## 6.3 V-01 correction

V-01:

> Document No. blank on an otherwise populated row.

V-01 must run against `rawRows`, not only the consolidated operational table.

Rows with blank Document No. are excluded from `documents[]`, but remain available in validation reporting as:

```text
excludedRows[]
```

This preserves both:

- clean operational calculations;
- visibility of bad source rows.

## 6.4 Existing validation rules

The approved V-01…V-27 rule set remains the baseline.

Rules should be classified as:

- A — Domain / format
- B — Cross-field consistency
- C — Transmission / state machine
- D — Timeline
- E — Referential integrity
- F — Metadata completeness
- G — Uniqueness / enum

No rule wording should be silently changed during implementation without updating this workplan.

## 6.5 Normalization before validation

All relevant text values should be normalized before comparison:

```text
trim whitespace
normalize empty strings
consistent case handling
```

The exact case-sensitivity rule must be defined per field.

Do not silently convert values such as Document No. or codes in a way that changes their business meaning.

## 6.6 Document No. validation

V-17 remains:

```text
Document No. = G-H-I-J-K
```

where:

- G = Project Code
- H = Project Prefix
- I = Doc Type
- J = Discipline Code
- K = Number

The rule must define:

- trimming;
- case sensitivity;
- leading zeros;
- separator behavior;
- placeholder `xxxx` behavior.

## 6.7 Duplicate detection

V-26 must detect duplicates across the complete consolidated population.

Duplicate comparison should use a normalized Document No.

The test should distinguish:

```text
active + active
active + inactive
inactive + inactive
```

At minimum, active-active duplicates are blocking errors.

The exact treatment of active-inactive duplicates should be configurable/documented.

## 6.8 Date normalization

Excel dates must be normalized before validation.

Supported input forms should include:

- Excel serial dates;
- recognized date strings;
- blank/null.

Internally use one normalized date representation.

The parser should not attempt to implement Excel formula evaluation.

For formula cells, use the cached workbook value when available.

## 6.9 Future-date rule

V-23 continues to use the current system date as the baseline.

The UI should show the validation timestamp so the result is reproducible.

---

# 7. Technical Architecture

## 7.1 Conceptual layers

The previous five-layer concept is refined into the following logical architecture:

```text
01 Configuration / Tokens
02 UI Primitives
03 Excel Parser
04 Contract / Normalization
05 Validation / Business Logic
06 View Model
07 UI / Rendering
08 Export / Test
```

The implementation may still be contained in one HTML file.

## 7.2 Data flow

```text
parseXlsx()
parseCSV()
      |
      v
rawWorkbook
      |
      v
contract
      |
      v
rawRows
      |
      v
normalize()
      |
      v
documents[]
      |
      +---- validationIssues[]
      |
      +---- derived fields
      |
      v
viewModel
      |
      v
render(STATE)
```

## 7.3 Derived fields

Calculate once during model construction where practical:

```text
normalizedDocumentNo
isActive
isPlanned
isIssued
isApproved
isRejected
isApprovalPending
isOverdue
daysOverdue
scheduleVarianceDays
approvalGroup
validationErrorCount
validationWarningCount
```

This avoids repeatedly executing expensive calculations during filtering.

## 7.4 Filter indexes

For performance, consider indexes/maps:

```text
byDiscipline
byStage
byAuthority
byApproval
byDocumentNo
bySourceTab
```

Filtering should operate on the validated model rather than re-running validation.

## 7.5 Excel parser requirements

The parser must explicitly define behavior for:

- missing worksheets;
- missing Code sheet;
- missing required columns;
- extra columns;
- duplicate headers;
- blank rows;
- merged cells;
- hidden sheets;
- hidden rows;
- formula cells;
- cached formula values;
- Excel serial dates;
- invalid dates;
- empty strings;
- whitespace-only values;
- unexpected cell types.

Recommended behavior:

| Condition | Response |
|---|---|
| Required sheet missing | Error |
| Required column missing | Error |
| Extra column | Warning / ignore unless configured otherwise |
| Duplicate required header | Error |
| Invalid date | Warning or Error depending on affected rule |
| Formula with cached value | Read cached value |
| Formula without cached value | Warning |
| Blank candidate row | Ignore structurally |
| Blank Document No. on populated row | Exclude operationally + validation issue |

## 7.6 Workbook structure validation

Before document processing, display:

```text
Workbook loaded
Code sheet found
Column contract found
Lookup domains loaded
Document sheets discovered
BQ sheet found
Structural issues
```

The user should be able to see why a workbook is partially processed.

---

# 8. Workplan / Waves

## Wave 0 — Parser + Contract + Structure Validation

### Scope

- XLSX parser
- CSV parser
- Code-sheet contract
- lookup loading
- discipline discovery
- header validation
- workbook structure validation
- BQ sheet discovery/read

### Acceptance

- Workbook loads.
- Code contract is detected.
- 20 UESH disciplines are read from Code!H.
- Current discipline tabs are correctly discovered.
- BQ/Notes/Dashboard are correctly treated.
- A–Y headers are validated.
- Structural errors are reported.
- No business lookup values are hard-coded.

---

## Wave 1 — Consolidated Model + KPI

### Scope

- rawRows
- excludedRows
- documents[]
- normalization
- active/inactive classification
- derived fields
- KPI model
- discipline matrix
- reconciliation logic

### Acceptance

- All discovered document tabs are consolidated.
- Source tab and source row are retained.
- Active count is correct.
- Planned count is correct.
- Issued count is correct.
- Approval counts are correct.
- KPI totals reconcile with the consolidated model.
- Discipline totals reconcile with global totals.

---

## Wave 2 — Validation + Charts + Filters

### Scope

- V-01…V-27
- error-code mapping
- severity/blocking handling
- business rules
- schedule calculations
- charts
- global filters
- health panel

### Acceptance

- Every approved validation rule executes.
- Error wording comes from Code!AI:AJ.
- Lookup values come from Code-sheet blocks.
- No lookup list is hard-coded.
- Validation results are traceable to source records.
- Filters affect KPI, charts and detail table consistently.
- Reconciliation checks pass.

---

## Wave 3 — UI Polish + Accessibility + Export

### Scope

- visual hierarchy
- responsive layout
- semantic HTML
- keyboard navigation
- focus-visible
- print
- reduced motion
- dark mode
- CSV export
- PNG export
- detail-table pagination/virtualization

### Acceptance

- Accessibility requirements pass.
- Exported data matches filtered model.
- Export contains source/version/filter metadata.
- Detail table remains usable with thousands of records.
- No major visual overflow at supported viewport sizes.

---

## Wave 4 — Performance + Regression Hardening

### Scope

- performance benchmarking
- memory checks
- large-workbook tests
- regression suite
- browser compatibility
- final reconciliation

### Target benchmark

Initial engineering target:

| Dataset | Load + Model Target |
|---|---:|
| 1,000 records | < 1 sec |
| 5,000 records | < 2 sec |
| 10,000 records | < 5 sec |

These are engineering targets and should be measured on the selected reference browser/machine.

Measure separately:

- workbook parsing;
- model construction;
- validation;
- initial rendering;
- filtering;
- sorting;
- export.

---

# 9. Testing & Acceptance Criteria

## 9.1 Parser tests

Test:

- XLSX;
- CSV;
- dates;
- booleans;
- blanks;
- formulas;
- missing sheets;
- unexpected columns;
- duplicate headers.

## 9.2 Contract tests

Verify:

- lookup values equal Code-sheet values;
- new lookup values are automatically recognized;
- new UESH discipline values are recognized;
- new matching tabs are automatically discovered;
- changing Code-sheet values does not require source-code modification.

## 9.3 Validation tests

Create controlled test records for:

- valid document;
- missing Document No.;
- invalid Stage;
- invalid UESH Discipline;
- invalid Doc Type;
- invalid Approval;
- invalid Document No.;
- missing Prolog;
- approval without issue;
- future date;
- invalid BQ reference;
- duplicate Document No.;
- missing required fields;
- invalid Boolean values.

## 9.4 UI/model reconciliation tests

The following must always hold:

```text
KPI Active
=
active records in model

Discipline total
=
sum of active records by discipline

Issued
=
active records with Actual Issue Date

Approved
=
active records classified as approved

Detail table count
=
filtered view-model count
```

## 9.5 Export tests

Verify that exported data equals the filtered model.

Verify metadata includes:

- source workbook;
- dashboard version;
- validation timestamp;
- filter state;
- record count.

---

# 10. Definition of Done

The MDL Dashboard is complete only when all of the following are true:

1. The approved workbook loads without manual configuration.
2. The Code-sheet contract is detected and validated.
3. All document-list worksheets are discovered dynamically.
4. All candidate records are processed through the normalization pipeline.
5. Operational records are consolidated into one model.
6. Excluded records remain traceable.
7. Active, planned and issued definitions are implemented separately.
8. All approved validation rules execute.
9. Validation severity and blocking behavior are implemented.
10. Error messages are sourced from Code!AI:AJ.
11. Lookup values are sourced from Code-sheet domains.
12. No ordinary business lookup list is hard-coded.
13. KPI, chart, filter and detail results reconcile.
14. Duplicate detection works across worksheets.
15. Date normalization is deterministic.
16. Workbook structure problems are visible to the user.
17. Global filters affect all views consistently.
18. The detail table supports the expected document volume.
19. Exported data matches the filtered model.
20. Export contains audit metadata.
21. Performance targets are measured and accepted.
22. Accessibility requirements are met.
23. End-to-end tests pass against the reference workbook.
24. Regression tests pass after changes.
25. The final HTML remains offline-capable and zero-runtime-dependency.

---

# 11. Decisions Captured

The following existing decisions remain unchanged:

1. Discipline universe = Code!H UESH Discipline list.
2. Only existing matching discipline tabs are processed.
3. Authoritative dashboard discipline = document-list column C.
4. Source worksheet is retained for traceability, not used as the discipline dimension.
5. Active document count excludes Deleted, Void and Superseded.
6. No ghost/zero bars for disciplines with no document list.
7. Submitted = Actual 1st Issue Date populated.
8. Actual 1st Issue Date = authoritative first submission date.
9. Future-date checks use the current system date.
10. BQ Number is optional; V-24 fires only when populated.
11. Document No. composition uses G-H-I-J-K.
12. Discipline segment in Document No. composition is client Discipline Code column J.
13. `xxxx` represents an on-hold number and remains a warning condition.
14. Error codes/descriptions/severity are intended to be Code-sheet driven.
15. No implementation code before workplan approval.

---

# 12. Open Questions / Assumptions

The previous Q1–Q8 decisions remain resolved.

The following are implementation assumptions requiring confirmation during approval:

### A1 — Code-sheet lifecycle metadata

Current implementation may temporarily use the documented lifecycle exclusion:

```text
Deleted
Void
Superseded
```

Long-term implementation should move lifecycle semantics into the Code-sheet contract.

### A2 — Duplicate normalization

Duplicate Document No. detection will use trimmed/normalized values.

Case sensitivity must follow the project's document-number convention.

### A3 — Formula handling

The dashboard reads cached Excel formula values and does not implement an Excel calculation engine.

### A4 — Hidden/merged content

Hidden worksheets/rows and merged cells require explicit parser behavior during Wave 0 testing.

### A5 — Browser baseline

The project must nominate the supported browser baseline for performance and compatibility testing.

---

# 13. Future Enhancements

Potential backlog:

- Drill-down from charts to documents.
- Cross-tab discipline × document-type coverage.
- Bulk CSV correction workflow.
- Re-export corrected records to Excel.
- Multi-workbook roll-up.
- Historical snapshots.
- Trend analysis between workbook versions.
- Change detection between MDL revisions.
- Configurable lifecycle semantics in Code sheet.
- Configurable dashboard KPI definitions.
- User-defined saved filter views.
- Document-control audit history.

---

# Appendix A — Recommended Model Shape

```javascript
model = {
    metadata: {
        sourceFile,
        dashboardVersion,
        loadedAt,
        workbookAsOf
    },

    contract: {
        columnMap,
        lookups,
        rules
    },

    workbook: {
        sheets,
        structureIssues
    },

    rawRows: [],

    excludedRows: [],

    documents: [
        {
            sourceTab,
            sourceRow,
            fields: {
                A: null,
                B: null,
                // ...
                Y: null
            },

            normalized: {
                documentNo,
                stage,
                discipline,
                authority
            },

            derived: {
                isActive,
                isPlanned,
                isIssued,
                isApproved,
                isRejected,
                isApprovalPending,
                isOverdue,
                daysOverdue,
                scheduleVarianceDays
            },

            validation: {
                errorCount,
                warningCount,
                issues: []
            }
        }
    ],

    reconciliation: {
        passed,
        issues: []
    }
}
```

---

# Appendix B — Recommended Processing Contract

```text
parse
  ↓
structure-check
  ↓
load-contract
  ↓
discover-sheets
  ↓
read-raw-records
  ↓
normalize
  ↓
minimum-record-gate
  ↓
consolidate
  ↓
derive
  ↓
validate
  ↓
reconcile
  ↓
build-view-model
  ↓
render
  ↓
export
```

**Important:** filtering and chart interaction must operate on the already-built model/view model. They must not reparse the workbook or rerun the complete validation engine unless the source data changes.

---

# Appendix C — Senior Review Summary

### Retain

- Contract-driven architecture.
- Consolidated document model.
- Dynamic discipline discovery.
- UESH Discipline column C as authoritative dimension.
- Offline single-file architecture.
- Code-driven error definitions.
- End-to-end testing against the real workbook.

### Correct before implementation

- V-01 / consolidated-record contradiction.
- Active vs planned terminology.
- Severity vs blocking semantics.
- Date and text normalization.
- Duplicate handling.
- Excel parser edge cases.
- Workbook structure validation.
- KPI denominator definitions.
- UI information hierarchy.
- Detail-table scalability.
- Export audit metadata.
- Performance requirements.
- Acceptance criteria.

### Approval recommendation

**Architecture: APPROVE IN PRINCIPLE**

**Workplan v0.1: revise**

**Workplan v0.2: ready for formal project-owner review**

**Coding start condition: only after v0.2 approval.**
