# Dashboard UI Design Standard

**Version**: 1.2
**Date**: 2026-10-15
**Last revised**: 2026-10-18 — §7.2.15 added (split-header / fragment-pairing contract, six normative
clauses) and `.vheadtab` + `.ds-gut` added to the normative class table. Driven by MDL I-103.
**Owner**: UI Design
**Applies to**: PPP Dashboard, MDL Control Center, and all future internal dashboards

> This document is the **single source of truth** for page layout and visual style across
> every internal control-center dashboard. It is intentionally platform/brand-agnostic in
> *structure* but fixed in *tokens* so that PPP, MDL, and future apps render as one family.

---

## 1. Scope & Governance

- **Tokens are canonical.** Every dashboard imports the `:root` block in §6 verbatim. A
  dashboard may *add* tokens but **must not** override the canonical values.
- **Layout rules are mandatory** (§3–§5). Component styling is mandatory (§7).
- **Status vocabularies are per-dashboard.** PPP defines its own status text/symbols;
  MDL defines its own. What is *shared* is only the **principle**: every status carries
  **Icon + Text + Colour** (§9). Do not copy another dashboard's status labels.
- **Philosophy is fixed** (§2). Divergence requires a documented design decision.

---

## 2. Design Philosophy

> Professional Document Control System **first**, Dashboard **second**.

**Style**: Clean Industrial · Swiss Modernist · Enterprise Application

**Influences**: Microsoft Project · Primavera P6 · SharePoint Modern · Engineering
Document-Control Systems · Enterprise Project-Management Platforms

**Must deliver**
- High information density and fast scannability (spot overdue/exceptions in ≤5 s).
- Readable at a glance across a full working day.
- Accessibility by default (icon + text + colour, AA contrast).

**Explicitly avoided**
- Glassmorphism / heavy translucency / blur
- Excessive animation
- Consumer-app styling
- Large decorative charts
- Neon colour themes
- **Apple "Bento" soft-tile aesthetic** (large radii, shadow-only separation, airy
  whitespace) — inappropriate for dense data tools. See §11.

---

## 3. App Shell & Layout Architecture

### 3.1 Header / App bar (mandatory)
- Sticky top bar, full width, **`--navy` background, white text**, `padding:12px 20px`,
  **no bottom border** (the navy block ends cleanly). `z-index:31` — the app bar must sit **above** the
  fixed warning bar (`#errBanner`, `z-index:30`, §3.5), so the filter dropdown (a child of the app bar)
  clears the banner when it opens.
- Structure (`.bar` > `.inner`): **Brand** left — a vertical stack beside the logo
  containing the project title `.ttl` (17 px / 600, white, ellipsis; **may wrap to two
  lines** for long names) **and, directly beneath it, the meta line `.meta`** (workbook ·
  as-of · refresh, 11 px / opacity .85). **Actions** right — the category filter trigger
  `.tf-btn` and the primary "Load file" action as `.btn.secondary` (white fill, navy text —
  hover → `--blue` fill). The meta line is placed **in the brand block on the left** (not on
  the right with the actions) so the right side stays clear for action buttons.
- A dashboard MAY ship a **two-row** top bar when the title block requires more vertical
  space (e.g. a 3-line title: project title / dashboard title / project-start + as-of). In
  that case Row 1 carries the logo + title block + primary actions, and Row 2 carries filter
  chips + search, right-aligned as one group. Fonts follow §8 regardless of row count — there
  is no separate font stack or sizing for the multi-row variant. Document the deviation in the
  dashboard's own workplan.
- **MDL menu-bar variant (documented in MDL-Dashboard-Workplan §4.0):** the two rows scroll-stick as one
  unit. Row 1 = title bar (logo + 3-line title block, **no action buttons**). Row 2 = menu bar with a
  **left actions cluster** (`Load Workbook` as the single A1 Primary CTA, `Print / Save PDF` secondary)
  and a **right filter group** (global `Discipline` / `Stage` multi-select chips, a `Search` button that
  reveals a popover panel, and the `Warnings` toggle, §3.5). The menu-bar controls are **borderless and
  icon-free** — text-only labels; the count shows as a parenthetical on the chip, the badge carries the
  warning count — and **highlight on hover** with a soft tint; the only filled element is the Primary CTA.
  The `Warnings` toggle always shows the label **`Warnings`** with the count in its badge (e.g. `[4] Warnings`);
  its title must **not** invert to `Show warnings` / `Hide warnings` when the bar is collapsed/expanded — the
  toggle still collapses/expands the bar, but the label stays stable (see §7.1). `Search` is a button, not an
  inline box. The Discipline/Stage chips are **global** (one selection
  re-derives the single filtered set for every panel). All controls obey the §7.1 contrast mandate.
- **Search popover layout (MDL).** The Search dialog lays its controls out in a **single row** — column
  selector, an **elongated** search field, then `Find` / `Reset` — so nothing wraps or stacks onto a second
  line. The search field must be wide enough to be usable (≥ 200px when the popover is open; the popover
  itself is allowed to grow to ~640px so the field can extend). Enforced by the layout harness **Tier 4f**
  `lintSearchPanel` (MDL runs it with the contrast setting; fails if the controls are not on one row or the
  search field is too narrow).
- The logo is a white chip: `height:36px`, `padding:3px`, `border-radius:6px`,
  `box-shadow:0 1px 3px rgba(0,0,0,.2)`.
- The header is mandatory on every dashboard. Navigation may be a left sidebar (MDL) or
  inline in the header (PPP) — either is permitted (§3.2).

### 3.2 Navigation
- Either a **left sidebar** or a top-bar nav. Both are permitted; the header is mandatory
  in either case. A dashboard MAY defer the left sidebar to a future phase — document the
  deferral in the dashboard's own workplan.

### 3.3 Content Area
- Centered container, `max-width:1320px`, `margin:0 auto`, `padding:16px` top/left/right
  with `padding-bottom:52px` (clears the fixed status bar). The `16px` top padding is the
  **gap between the header and the first panel/banner**.
- Vertical stack of **Panels** (§4). Wide dashboards may use a 2-column grid that
  collapses to 1 column under 880 px.
- A **KPI Overview panel** sits at the very top (§5).
- **Footer**: the disclaimer footer (`footer[role=contentinfo]`, 11.5 px, `--muted`, centred)
  is the **last child inside the content wrapper** — never a sibling outside it. Being inside
  the wrapper is what gives it the horizontal inset *and* the status-bar clearance below it
  (§3.6).

### 3.4 Responsive
| Width | Layout |
|---|---|
| ≥ 1100 px | KPI 6-col; panels 2-col grid |
| 880–1099 px | KPI 3-col; panels 1-col |
| < 880 px | KPI 2-col; single column; nav collapses |

### 3.5 System / Config Warning Bar (`#errBanner`) — rev 2026-10-10
Standardised across dashboards on the **PPP design** — a single **fixed top warning bar** that unifies
system / config notices **and** fatal load failures (spec §7.10 `#errBanner`). One bar, three severity
tiers, sitting just below the app bar.

- **Element**: a single `#errBanner` at the end of the dashboard root, `position:fixed; left:0; right:0`,
  `z-index:30` — the **app bar is `z-index:31`**, so the bar stacks *above* the banner; the filter
  dropdown is a child of the app bar and therefore paints above the banner. Banner sits below toast
  `45` / modal `50`. It carries `role="alert"` +
  `aria-live="assertive"`. `display:none` until populated.
- **Position**: **just below the app bar** — `top` equals the app bar's rendered height (measured at open
  time, since the bar is sticky / fixed). On the welcome / onboarding screen (no app bar, §3.7) it is
  pinned to `top:0`. In both cases the bar is **full-width**.
- **Three severity tiers**, each `icon + bold code + message` (rendered as `.sys-banner-item` strips,
  ordered fatal → warning → info top-to-bottom, one line each, code **bold** then message — no separator,
  the icon conveys severity):
  - **Fatal / error-level** → `--red` background, white text, `⛔`.
  - **Warning** → `--amber` background (`#F9A825`), dark text, `⚠️`.
  - **Info** → neutral `#e8eef5` background, `#33526b` text, `ℹ️` — a calmer tier distinct from warning,
    used for FYI notices that need no action (e.g. skipped rows).
- **Item format**: an **icon** + **bold code** + **message** — icon prefix, code wrapped in `<b>`
  (default `SYSTEM`), then the message. No leading severity word and no separator — the icon already
  conveys severity.
- **Unified with load failures**: a failed workbook parse shows a `fatal` strip ("Load failed …") in the
  same bar (per §7.10). There is **no separate** in-flow warning area and **no** `.note`-card variant for
  system / config notices — the bar is the only surface for them. (Incidental in-flow FYI notes that are
  not system / config warnings may still use the generic `.note` style.)
- **Shows *system / config* issues only** (e.g. missing columns, row-count mismatches); per-package data
  issues live in the Validation panel.
- **Exception — fatal `W-FORMULA`**: a data column (any `fieldOrder` field) that contains spreadsheet
  formula-error tokens (e.g. `#VALUE!`) raises a **fatal** notice in this bar, even though it is a
  data-quality condition. Rationale: an error token is not a valid value and silently corrupts
  counts/KPIs, so it must be fatal-level and shown here, not deferred to the Validation panel. One
  aggregated entry per affected column (see §3.8.1).
- **Dismissible (user-toggleable)** — mandatory: the bar is shown by default, but the user may collapse it.
  **Single visibility resolver (hard requirement).** All code paths that open the bar — `showBanner`,
  `showError`, `addBannerNotice`, and `removeBannerNotices` — MUST route through one resolver
  (`applyBannerState`) that decides visibility from the persisted preference. This is what guarantees a
  notice appended *after* the user collapsed the bar does **not** pop it back open, and that re-render /
  re-open restores the user's choice.
  - **Control placement & survival.** The toggle is a real `<button>` in the **title bar, immediately
    following the search control** (within `.app-bar`), **not** inside `#errBanner` itself, so it survives
    being hidden. It is rendered only when ≥1 notice exists. It shows a **count badge** (e.g. `⚠ N`, where
    `N` is the live notice count) **and a separate text label that must NOT repeat that number** — the
    label is `Warnings` when the bar is open and `Show warnings` when collapsed (the badge already carries
    the count, so restating `N` in the label is forbidden; `⚠ [N] Show warnings` is correct,
    `⚠ [N] Show N warnings` is a defect). It exposes `aria-pressed` plus a dynamic `aria-label`
    (`Hide data-quality warnings` when open / `Show data-quality warnings` when collapsed) — the
    `aria-label` must likewise not restate the count, so screen readers do not announce `N` twice
    (badge + label). Clicking it flips the persisted preference and re-runs the resolver.
  - **Collapse ≠ teardown.** Collapsing only hides the bar (preserving its inner HTML + badges) so
    re-expansion is instant; it is distinct from tearing the bar down when it becomes empty (no notices),
    which clears its content. Hiding is cosmetic only — the underlying warnings remain and keep counting
    toward the badge; a fatal notice (e.g. `W-FORMULA`) can be collapsed but is never removed, and the badge
    keeps it visible at a glance. Default state is visible (persisted via a dashboard-prefixed `localStorage`
    key, e.g. `<dashboard>_hideWarnings`; `true`/`false`; default `false`).
  - **Print.** The bar is always hidden when **printing**, regardless of the toggle. Drive visibility with the
    `hidden` attribute (not an inline `display`), and make the print rule `display:none !important` so it
    cannot be overridden. (Do not leave an inline `display:block` on the bar, or it defeats the print hide.)
  - **Clearance** (below) still applies when the bar is shown: `body.banner-open` + `--banner-h` reserve the
    wrapper height so content is never overlapped.
- **Clearance rule (overlap prevention)** — mandatory, mirrors §3.6: because the bar is `position:fixed`,
  the content wrapper reserves its height. When the bar is open, add `body.banner-open` and set a
  `--banner-h` custom property to the bar's measured height; the wrapper's top padding becomes
  `calc(16px + var(--banner-h))`, **preserving** the existing `16px` app-bar-to-content gap beneath the
  reserved space. Remove both when the bar is dismissed. On print the bar is hidden and the reserved
  padding released.

### 3.6 Status Bar (`.status-bar`)
- **Fixed bottom** (`position:fixed;left:0;right:0;bottom:0`), full width, `z-index:40`,
  `--navy` background, white text (`#E8EDF3`), `font-size:12px`, single line
  (`display:flex;align-items:center;gap:8px;padding:6px 14px;overflow:hidden`).
- `border-top:1px solid rgba(255,255,255,.14)`. Hidden (`[hidden]{display:none}`) until the
  first successful render.
- Shows **live** status: total packages, filtered count, started %, as-of date, active
  filter. Updates on every render / filter change.
- **Clearance rule (overlap prevention)** — mandatory: because the bar is `position:fixed`, the
  **last** element in the page flow needs clearance *below* it. Keep **every** flow element
  (including the footer) **inside** the content wrapper, which carries `padding-bottom:52px`.
  Do **not** place the footer outside the wrapper, and do **not** rely on `body` padding as the
  clearance mechanism — both leave the fixed bar covering content.

### 3.7 Load / Onboarding screen
Mandatory. Shown before any data is loaded, as a **standalone hero surface** — the top app bar / navigation is **not** displayed on this screen.

**Layout (vertical order, centred hero card on the `--bg` canvas):**
1. **Logo** — **embedded** (base64; never an external `asset/` reference), centred, height **52 px** (`display:block; margin:0 auto 18px`).
2. **Headline** — text format **`"<X> Dashboard"`** (the dashboard name + " Dashboard"); font **25 px / 700**, `letter-spacing:-.02em`, colour inherits `--text`, `margin-bottom:8px`.
3. **Sub-text** (one line) — *"Interactive dashboard. Load the workbook to validate data, explore status and details."*; font **14 px**, colour `--muted`, `margin-bottom:26px` (line-height inherits body 1.45).
4. **Instructions callout `.expect`** — label **"What this does"** (bold / uppercase, `--blue`, 11 px) + body *"Select your &lt;project&gt; workbook (.xlsx)… Drop it below or click to browse."* (12 px, `--accent-ink`) — `&lt;project&gt;` is project-specific.
5. **Dropzone `.drop`** — a distinct sub-region **inside** the card (not the whole hero), containing: drop text *"Drop your workbook here"* (14 px / 600), hint *"or click to browse"* (12 px, `--muted`, no bottom margin), and the **primary button inside the drop area**, label **"Choose Workbook"** (Primary fill, **14 px**, **padding 12px 22px**).
6. **Privacy + copyright** — *"Works fully offline — your data never leaves this browser"* (11.5 px, `--muted`, centred, optional shield icon) and *"© {year} UESH"* beneath it (11.5 px, `--muted`, `margin-top:6px`).

**Style contract** (canonical values — design tokens only, no raw literals):
- Container: `min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px` (the `--bg` body canvas provides the background — no separate background on the container).
- `.wcard`: `background:var(--card)`; `border:1px solid var(--line)`; `border-radius:24px`; `box-shadow:var(--shadow)`; `padding:48px 48px`; `max-width:480px`; `width:100%`; `text-align:center`.
- `.expect`: `background:var(--soft)`; `border:1px solid var(--accent-soft-border)`; `border-radius:12px`; `padding:12px 16px`; `font-size:12px`; `color:var(--accent-ink)`; `margin-bottom:20px`; `text-align:left`; its `<b>` label `font-size:11px; text-transform:uppercase; letter-spacing:.04em; color:var(--blue); display:block; margin-bottom:3px`.
- `.drop`: `border:1.5px dashed var(--line)`; `border-radius:16px`; `padding:24px 16px`; `margin-bottom:22px`; `cursor:pointer`; `transition:.2s`; **hover / drag-over** → `border-color:var(--accent); background:var(--soft)`.
- `.drop .d-title` (`.big`): `font-size:14px; font-weight:600; margin-bottom:4px`.
- `.drop .d-sub` (`.small`): `font-size:12px; color:var(--muted)` (no bottom margin).
- `.privacy`: `font-size:11.5px; color:var(--muted); margin-top:18px; display:flex; gap:6px; align-items:center; justify-content:center` (optional shield icon).
- `.copyright`: `font-size:11.5px; color:var(--muted); margin-top:6px`.

This is a single-focus **hero** surface, so it may use a **larger radius** (up to ~24 px) than data panels — only the hero card and the dropzone relax radius; the primary CTA is still the standard Primary button (§7.1). Copy is fixed as above; only `<X>` in the headline and the `&lt;project&gt;` noun in the `.expect` body are project-specific. Everything else follows §4–§6.

### 3.8 Data-Processing Pipeline (mandatory)

Any dashboard that ingests a workbook (`.xlsx`, `.csv`, or similar) MUST follow this single,
predictable pipeline. **Objective: parse once → normalise once → validate once → derive on demand**,
so filter changes are fast (no re-parse) and every aggregation lives in exactly one place (no
duplicate KPI engine).

#### 3.8.0 File structure requirement

The pipeline MUST be implemented as **separate, importable modules** — not as functions buried
inside a monolithic HTML file. The canonical structure is:

```
src/
├── xlsx-reader.mjs   ← S0 / S1: file acquisition and workbook parsing
├── pipeline.mjs      ← S2 / S3: normalisation and validation
└── render.mjs        ← S4 / S5 / S6: derivation, rendering, filter loop
build.mjs             ← bundles src/ into a single offline HTML for distribution
```

Rationale: separate modules make each stage independently testable in Node without a browser,
enable the layout harness to import the pipeline and compute ground-truth values, and make stage
boundaries visible and enforceable. A monolithic single-file implementation is permitted only as
a prototype; it MUST be refactored to the modular structure before the dashboard is considered
production-ready.

#### 3.8.1 Stages

| # | Stage | Module | Responsibility | Input → Output | Runs |
|---|---|---|---|---|---|
| S0 | Acquire | `xlsx-reader.mjs` | Read raw bytes from the file input; no parsing. | `File` → `ArrayBuffer` | On file open only |
| S1 | Parse | `xlsx-reader.mjs` | Parse the container into an in-memory workbook (sheets / rows / cells). | `ArrayBuffer` → `workbook` | On file open only. The raw `workbook` is **discarded after S2** — only the normalised model is retained. |
| S2 | Ingest / Normalize | `pipeline.mjs` | Turn raw rows into a normalised **record table**: typed fields (Date/Bool coercion), `isActive`, and domain-specific fields; build contract/lookup tables and `meta` (project info, today). **No aggregation or KPI math.** Normalization treats a cell as **absent (`undefined`)** when it is blank (empty after `trim`) **or** a spreadsheet formula-error token — see §3.8.4. | `workbook` → `model{ records[], contract, meta }` | On file open only; held in memory for the session. |
| S3 | Validate | `pipeline.mjs` | Run row-level, **filter-independent** validation rules once. Emits `issues[]` (per-row data problems) and `warnings[]` (system/config notices). | `records` + validation context → `issues[]`, `warnings[]`, `completenessGroup` | On file open only. |
| S4 | Derive / Aggregate | `render.mjs` | **On demand**, given the current filter/UI state: filter `records` → `active`, then compute **all** aggregations — KPIs, overdue lists, charts, matrix, completeness%. This is the **sole** source of KPI numbers. | `model` + `state` → `view{ active, kpis, issues(filtered), charts, matrix, … }` | On every filter change / render. |
| S5 | Render | `render.mjs` | Paint DOM panels from `view`. Write-only: never reads from the DOM to make decisions. | `view` → DOM | On every render. Keep the deferred-render rule: repaint once when the filter dropdown closes, not on every in-dropdown toggle. |
| S6 | React-to-filter | `render.mjs` | Refresh loop. | user action → `deriveView(model, state)` → `render(view)` | On filter change. **Never re-runs S0–S3; the file is never re-parsed.** |

#### 3.8.2 Mandatory pipeline rules

1. **One source of truth for aggregations.** KPI / chart / overdue math lives in **exactly one**
   place (S4 in `render.mjs`). A pipeline stage (S2/S3) MUST NOT also compute KPIs that S4
   recomputes — that creates a duplicate engine and a silent drift risk where the two engines
   diverge without any error being raised.
2. **Discard the raw parse.** After S2 retain only the normalised `records` + `contract` + `meta`.
   Do not keep the full parsed `workbook` object — it is larger and never re-read.
3. **Validate once, at load.** Row-level validation (S3) is filter-independent; compute it once
   and reuse the result. Filter-dependent derivations belong in S4, not S3.
4. **Derive on demand — no I/O.** S4 recomputes only from the in-memory `records` — fast because
   there is no file read. *Scale-driven, optional*: memoize S4 by a filter key, and/or pre-build
   row indexes (`Map<dimension, indices>`) so filtering is a lookup rather than a full scan.
5. **No re-parse on filter change.** S6 reuses the in-memory model. Re-reading the file on each
   filter toggle is prohibited.
6. **Render is write-only.** S5 writes to the DOM; it never reads from the DOM to make a
   decision. All state lives in the `model` and `state` objects, not in DOM attributes.
7. **Single STATE object.** All UI state (active filters, preferences, open panels, sort order)
   lives in one `STATE` object. No state is stored in DOM attributes and read back by logic.
   `render(STATE)` is the only entry point for DOM updates.
8. **Error handling at every stage boundary.** Each stage transition MUST be wrapped in its own
   `try/catch`. A failure in S1 (parse) shows a fatal load error; a failure in S3 (validate)
   shows a validation-failed error but does not hide the dashboard; a failure in S4 (derive)
   shows a render error for the affected panel only. Stages MUST NOT share a single outer
   `try/catch` — that collapses distinct failure modes into one undifferentiated error message.
9. **As-of and project-start are distinct anchors.** `meta.today` (as-of) is the **viewer's
   local system date** — built from local date components, **never** `toISOString()` (UTC), which
   introduces a 1-day off-by-one near local midnight. As-of drives every Overdue / Approval /
   look-ahead / completeness calculation. The workbook **project-start** date (read from the Code
   sheet by label) is an **x-axis origin for date-curve panels only** (S-curve / throughput); it
   MUST NEVER feed Overdue, approval, or schedule-variance math. On the S-curve the x-axis is
   **anchored at the earliest data date** and carries two reference lines: **Start** (the
   project-start date, red dashed) and **Today** (as-of, navy solid).
10. **Blank and formula-error are the same "absent" state.** See §3.8.4.

#### 3.8.3 Contract-driven parsing (mandatory)

The workbook's Code sheet is the **single source of truth** for all field positions, lookup
domains, and validation rule wording. The pipeline MUST discover these at runtime — never
hard-code column letters, row numbers, or allowed-value lists in application code.

1. **Scan the whole Code sheet** — never assume a fixed range such as rows 1–11 or 12–36.
2. **Locate blocks by row-1 header text** — every lookup block advertises its name in row 1.
   Discovery matches header text case-insensitively; an exact match wins, a prefix match is the
   fallback.
3. **Blank column = table separator** — blocks are discovered independently by header text, so
   intervening blank columns are naturally skipped.
4. **Label-driven column map** — the column map is built by matching each expected field's label
   to the `ColumnLetter` stored in the sheet; the field's position is always resolved at runtime.
5. **Dynamic value read** — a lookup block is read from row 2 downward until 3 consecutive blank
   rows. No fixed end row.
6. **Warn, don't drop** — if an expected block header is not found, raise a validation warning
   instead of silently returning an empty set.
7. **Contract = vocabulary, not layout** — the only code-owned constants are the expected
   label/header names; positions (which row, which column) are entirely workbook-owned. Adding
   or moving a column in the workbook requires no code change.
8. **Validation rule wording and severity come from the workbook** — the Code sheet Error table
   (located by row-1 header text) is the source of truth for every rule's message and severity.
   A rule with no matching row falls back to a generic message and Warning severity — this
   fallback MUST itself raise a warning so the gap is visible.

#### 3.8.4 Value normalization — blank and formula-error are equivalent "absent"

During **S2**, every raw cell value written into a normalised `fields` entry is treated as
**absent (`undefined`)** when it is either:

- **blank** — the cell is missing/empty, or its text is empty after `trim()`; or
- **a spreadsheet formula-error token** — the cached cell value equals one of `#NULL! #DIV/0!
  #VALUE! #REF! #NAME? #N/A #NUM! #GETTING_DATA #SPILL! #CALC!` (matched case-insensitively).

This is a **single, uniform standard applied to every data column** — it is **not** a per-column
opt-in. Blank and error are deliberately treated the same way: an error token is not a valid
value, and counting it as present silently corrupts KPIs, filters, charts, and validation.

*Implementation:* a shared `isExcelError(v)` predicate lives in the pipeline; S2 coerces any
blank/error to `undefined` and accumulates a per-field error-token count. Downstream consumers
(S3/S4, render) simply see a missing field — no special-case token matching anywhere.

*Fatal data-quality notice:* because an error token corrupts count correctness, S3 emits one
aggregated entry per affected column — a fatal `model.warnings` item
`{ level:'fatal', code:'W-FORMULA', tab:<field>, message }` carrying the field label, column
letter, `N of total` error cells, and a recovery instruction. These notices route to `#errBanner`
as fatal strips (§3.5) and are **not** pushed to `model.issues` (those are row-keyed and filtered
by `activeSet`).

#### 3.8.5 Testability requirement

Because the pipeline is implemented as importable modules (§3.8.0), it MUST be independently
testable in Node without a browser or DOM:

- A test harness (`test/test_pipeline.mjs`) MUST exist and run with `node test/test_pipeline.mjs`.
- It MUST import `pipeline.mjs` directly and run it against the real workbook file.
- It MUST assert: record count, KPI values, lookup table contents (proving no hard-coded lists),
  validation issue counts, and that every rule's message/severity is sourced from the workbook.
- It MUST pass with zero failures before any release. A failing harness blocks the build.
- The layout harness (`harness-layout/`) imports `pipeline.mjs` to compute ground-truth values
  and compares them against what the rendered page shows — this is only possible because the
  pipeline is a separate module (§3.8.0).
---

## 4. Panel / Card Standard

A **Panel** is the atomic page unit (the example CSS uses `.panel`; PPP uses `.card` — the
class name is free, the tokens below are fixed).

```
┌───────────────────────────────────────────────┐
│ KPI OVERVIEW                    ( ? ) ( − )     │   ← title row: title left, actions right
│                                                  │
│   …panel content (charts / tables / cards)…     │
│                                                  │
│                                Panel 14          │   ← corner panel number, bottom-right
└───────────────────────────────────────────────┘
```

- **Surface**: white (`--surface`); 1px solid `--border`; radius 10 px; subtle shadow.
- **Position**: `relative` (so the panel number can anchor).
- **Padding**: `14px 14px 26px`. The 26 px bottom gap reserves clearance for the corner panel number
  (`bottom:8px`) so it **never overlaps** the last card / content line. Dynamic chart containers
  get the same `padding-bottom:26px`.
- **Title**: 13 px, weight 700, **uppercase**, colour `--navy`, letter-spacing .04 em,
  margin 0 0 10 px.
- **Title row**: `display:flex; justify-content:space-between; align-items:center`.
  Panel title left; an **action cluster pinned to the far right** containing Help `?` and the
  Collapse `−` toggle. **Order within the cluster: Help `?` is LEFT of Collapse `−`** — the
  toggle is always the rightmost control. Inject the `?` as the first child of `.panel-actions`
  so this holds even when a toggle is already present.
- **Corner panel number**: absolutely positioned bottom-right, `Panel N`, 10 px, muted,
  letter-spacing .04 em, `pointer-events:none`.
- **No explanatory subtitles**: panels do not carry a description line under the title. All
  explanation (what the panel shows, what the lines/labels mean) lives in the **Help modal**
  (§7.9) — never duplicate it in the panel body.
- **Numbering rule**: *every* top-level panel is numbered sequentially in document order
  (`Panel 1`, `Panel 2`, …). The number is static — authored once per panel via the
  `.panel-no` span (or `.panel[data-panel]::after`). Dynamically generated sub-panels
  inside a panel are **not** individually numbered; they inherit the parent panel's number.

```css
.panel{background:var(--surface);border:1px solid var(--border);border-radius:10px;
  padding:14px 14px 26px;margin:14px 0;box-shadow:var(--shadow);position:relative}
.panel h2{font-size:13px;margin:0 0 10px;color:var(--navy);text-transform:uppercase;
  letter-spacing:.04em;display:flex;justify-content:space-between;align-items:center}
.panel[data-panel]::after{content:"Panel " attr(data-panel);position:absolute;right:10px;
  bottom:8px;font-size:10px;letter-spacing:.04em;color:var(--muted);pointer-events:none}
```

### 4.1 Panels containing charts (control ownership)
Some panels hold several **chart cards** in a grid. The panel shell still carries §4 chrome — bordered surface, own title row, corner `Panel N`. Controls split strictly by scope:

| Control | Owner | Notes |
|---|---|---|
| Help `?` | **the panel** | one per panel, in the title-row cluster; opens the modal (§7.9) |
| Collapse `−`/`+` | **the panel** | collapses the whole grid of chart cards; state lives on the panel element so it survives re-render |
| Chart type (Bar/Pie `.seg`) | **each chart card** | **independent per chart** — keyed by card id (e.g. `inter-<cardId>`), so switching one chart must never flip the others (seg contract: §7.5) |
| Breakdown / dimension select | **each chart card** | each card groups by its own dimension |
| Period window (From / To / range text) | **each chart card** | scopes only the chart it belongs to (§7.9) |
| **Bars** toggle | **each chart card** | shows / hides that card's per-period bars |
| `⤓ PNG` / `⧉ Copy` | **each chart card** | exports that single chart only |

- **Related controls belong to the card they act on — never to the panel area (mandatory).** Any
  control that affects **one card's** content must sit **on that card's board**, in that card's own
  **right-aligned** control cluster above its plot. It must **not** float in the panel's general
  area — the panel head, the panel body, or a free-standing row between cards. Only controls that
  act on the **whole panel** — Help `?` and Collapse `−`/`+` — live on the panel's own title-row
  cluster. Rationale: a control sitting in the panel area reads as scoping the *whole panel*, which
  misleads as soon as the panel holds several cards, and it leaves the card with no board of its own
  once cards are bordered. This applies to **every** card type (breakdown charts, combined charts,
  tables): **every card owns its controls; the panel owns only its own chrome.** Cluster order is
  fixed — period window → **Bars** → range text → `⤓ PNG` → `⧉ Copy` (§4.2). There is **no Reset**
  control (§7.9).
- Chart cards do **not** get their own Help/Collapse and are **not** individually numbered —
  they inherit the parent panel's number (see numbering rule above). Only the panel shows one.
- **Chart-card titles** follow §8: `h3` (`.panel-head h3`), 13 px / 700 `--navy`, **not**
  uppercase — they are nested sub-panels, unlike the panel's own uppercase `h2`.
- **A chart-card title names the *view*, not the *selection* (mandatory).** The card heading
  carries its own **stable group name** and must **not** track the breakdown currently picked in
  that card's `<select>`. A user-changeable value in a heading either goes stale or merely restates
  its control. The per-card `<select>` already indicates what is applied, so echoing it in the
  heading is redundant. (The chart's *own* plot caption is a plot label, not this heading, and is
  unaffected.)
- **Interactive chart panel title.** The panel's `h2` MUST read **`Interactive Chart`** — rendered
  uppercase by the §4 `text-transform:uppercase` rule — and **not** `Charts`. This is the canonical
  name for a panel holding user-switchable interactive charts; the matching Help-modal entry uses
  the same title.
- **Panel board + chart-card grid alignment, border & plot height (mandatory).** **Every
  panel has one board**: its shell draws a bordered surface per §4 chrome (own title row, corner
  `Panel N`). This applies to panels that hold chart cards too, so `.panel.panel-flat` (`border:0;
  background:transparent; box-shadow:none`) is **not** permitted there. Inside the panel board each
  **chart card is exactly one bordered surface** (`.chart`: 1px solid `--border`, `border-radius:10px`);
  a card must **never** be wrapped in a second `.chart` element, since card-in-card draws a *double*
  border and is **forbidden**. A panel therefore draws **one** border and each of its chart cards draws
  **one** border — two distinct, non-nested surfaces. **This also applies to a panel that holds a
  single chart** (§4.2 combined chart panels): the plot is wrapped in **one chart card** drawing its
  own board **inside** the panel board, even though such a panel has no card grid and no card title.
  Cards sit in a 2-up grid (`.charts`) with
  `align-items:stretch` so the cards are **always equal in height** and their borders align on both top
  and bottom even when one chart has far more categories than the other. Each card's border is its only
  frame. The chart
  drawing area (`.chart-host`) flexes (`flex:1`) with a **shared `min-height` of 300 px**, and **both
  chart types MUST render at the same 300 px plot height** — the bar renderer distributes its rows over
  300 px (`rowH` derived from the row count, clamped, with short blocks centred) and the pie renderer
  uses `H=300`. A pie and a horizontal bar chart must therefore occupy the **same vertical extent**, so
  the two chart areas are aligned in height (do not let one chart's canvas be shorter than the other's).
- **Collapse must survive re-render**: when a panel's contents are rebuilt via `innerHTML`, keep
  the collapsed flag as a class on the **panel element itself** (which is not replaced) and
  re-derive the toggle button's glyph/`aria-expanded` from it on each render.

---

### 4.2 Combined chart panels (bars + cumulative curve)
When a chart needs to show **both per-period detail and a running total**, use **one** chart with
a single shared time axis instead of two stacked charts:

- **Shared y-scale by default; a separate bar scale is a documented exception (rev 2026-10-13).**
  Monthly bars (per-period counts) and cumulative lines (running totals) are normally plotted
  against the **same** scale and the **same** single value axis (left, captioned with the unit,
  e.g. `pkgs` / `docs`). Rationale: with separate bar/cumulative axes the *same number* renders
  at two different heights — a bar of `5` sits far taller than a cumulative point of `5`, which
  reads as a bug ("the cumulative curve is lower than the bar"). A single scale keeps the two
  representations directly comparable, and the **Bars** toggle (below) is the way to inspect the
  curve on its own. **Shared is the default mode; the guardrail below is the one exception.**
  - In **shared** mode the scale is `max(1, …visible bar values, …visible line values)` — computed
    over the **visible window**, so it rescales as the period window moves. Bars and lines share
    **one** `y(v)` function; no second `y` function may exist for the same plot.
  - In **shared** mode there is no right axis, so the right-side axis padding is minimal
    (`padR ≈ 18`, not the ~52 px a second axis needs). Only **one** set of tick labels is drawn,
    on the left, plus a single unit caption above the axis. Do not label the axis `/mo` and
    `cum.` separately — there is only one scale.
  - **Scale-mode guardrail (mandatory, every combined chart).** Let `r = maxCum / maxBar` over the
    visible window, where `maxCum` is the largest cumulative value and `maxBar` the largest
    monthly bar value.
    - `maxBar == 0`, or the **Bars** toggle is off → **shared** (a separate scale is meaningless).
    - `r > 10` → engage **separate scales automatically**. Justification: above this ratio the
      tallest bar occupies under ~1/10 of the plot height (< ~30 px in a 300 px plot), too small
      for its printed value label — it reads as a sliver. Because cumulative totals can be one to
      two orders of magnitude larger than any single month, this is where the shared scale stops
      being usable.
    - `r < 6` → revert to **shared**. Between 6 and 10 the active mode is **retained** (hysteresis),
      so dragging the From / To sliders cannot flicker the axis on and off.
    - A **Shared / Separate** control may be offered so a reader can override the automatic
      decision; it defaults to **Shared** and is a state toggle (carries `aria-pressed`, persisted).
      Whichever mode is active, each axis always **auto-fits** its own family: a user is **never**
      allowed a free-form bar-height multiplier, because that would let one month be drawn taller
      than the running total (a false reading) and would make exported PNGs non-reproducible.
  - **Whenever separate scales are active** these mitigations are mandatory, because the original
    "two heights for one number" hazard is then live: both axes captioned (left `… cumulative`,
    right `… per month`); the right axis line **and its ticks** coloured to the bar family; the
    legend states which axis each family uses (bars → right, `Cum. …` lines → left); and a note
    states *"Monthly bars use the right-hand scale; Cum. lines use the left cumulative scale."*
    `padR` widens to ~52 px while separate. Cross-family height comparison is **never** valid.
- **Cumulative values are ABSOLUTE — never rebased to the window (rev 2026-10-13).** A cumulative
  point always shows the true running total from the start of the series, so the value read off
  the chart is the real total-to-date and it does **not** change when the period window moves. Do
  **not** subtract the pre-window cumulative (no "anchoring at the window start"): that turns the
  numbers into deltas that silently change as the reader drags the window, and it forced a
  "cumulative within period" caption to explain them. The window selects **which months are
  shown**; it never re-zeroes the curve.
- Every series is drawn **twice**: once as bars, once as a cumulative line. Lines are
  distinguished from their bar counterpart by dash pattern (e.g. Plan `6,3`, Forecast `2,2`,
  Actual solid) and are named `Cum. <series>` in the legend.
- **Months are labelled with the `MMM YYYY` template (e.g. `Mar 2026`).** Every month shown in the
  S-curve — the x-axis ticks, the period-window range message, and the `<title>` tooltips — is
  formatted through the shared month-label helper. A raw `YYYY-MM` key, or any `slice()` of it
  (`26-03`), is never rendered: it is not a readable month and it differs from every other date in
  the dashboard. Both dashboards use the same template.
- **Bar values are printed VERTICALLY — rotated 90°, reading bottom-to-top.** A horizontal count
  above a bar collides with its neighbour as soon as the bars get close together, and the collision
  worsens the more digits the count has. Rotating the label gives it a fixed ~12 px horizontal
  footprint regardless of magnitude, so values never overlap. The label is anchored just above the
  bar top and rotated about that anchor (`text-anchor="start"` + `transform="rotate(-90 x y)"`).
- **Every plotted point on a cumulative line is a SOLID dot — `r=3`, filled with the series
  colour.** Nodes are never hollow rings (`fill="#fff"` with a coloured stroke): a solid dot stays
  legible where series cross and is the form used by the PPP S-curve.
- **Forecast is always drawn** — it is never hidden merely because the Forecast column is sparse.
  The fallback is applied **per item**: a package with no Forecast date contributes to the
  Forecast series using its **Plan** date (mirrors *due = Forecast ∥ Plan*). When the whole
  column is blank the Forecast series legitimately mirrors Plan instead of disappearing.
- **Bars are the INDIVIDUAL period quantity, never cumulative.** Keep the two representations as
  two separate arrays: per-period counts feed the bars, the running total feeds the lines. Never
  accumulate the per-period array in place and then alias it to the cumulative series — that
  silently turns the bars into cumulative values.
- **Every series stops at its last real date — Actual runs to TODAY.** Plan and Forecast (bars
  and curves) end at the last period holding that kind of date, so no curve is drawn as a
  misleading flat tail; if there is no such date the series is drawn as nothing (never a flat
  zero line). Cumulative **Actual** is the exception: it runs through **today** (not merely the
  last actual month) so achieved progress stays readable up to the reporting date. Actual *bars*
  still stop at the last month with an actual PO.
- **Every non-zero bar shows its value** printed above it (12 px, matching PPP `svgPoCombo`). Zero
  bars are skipped so the plot stays readable.
- The time range extends **exactly one extra month** beyond the last data month (not three or
  four) so the last bar is not flush against the plot edge.
- A **Bars** toggle hides the per-period bars so the cumulative curve can be read alone. It lives in
  the **chart card's** control cluster (§4.1 ownership) — **not** in the chart, and **not** in the
  panel area. Bars are **visible by default**. The button is a state toggle, not a momentary action:
  it carries `aria-pressed` and is dimmed (`opacity:.55`) when bars are hidden, so its state is
  visible without re-reading the chart.
- The card's controls form **one right-aligned cluster on the card's own board**, directly above the
  plot, in this fixed order: **period window (label, From, To) → Bars → date-range text →
  `⤓ PNG` → `⧉ Copy`** — exports last, PNG before Copy. `align-items:center`. The cluster prefers a
  single line and may wrap only when the card is too narrow to hold it. The date-range text closes
  the window group with `margin-left:auto` and `white-space:nowrap`.
- These panels stay **full width** (`.card.full`) — one wide chart, not a 2-column grid.
- **No nested chart title** when a panel holds a single chart: the panel's own `h2` is enough, so
  do not add an `h3` sub-title. The plot nevertheless draws **its own chart-card board** (§4.1), and
  the control cluster above renders **inside** that board.
- **CSS contract (mandatory, so the rule is testable).**
  `.chart-actions{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:6px}`
  — the cluster right-aligns **to the card**; a cluster that merely carries the class while sitting
  left-aligned in the panel body still violates this rule. And
  `.sc-win .msg{font-size:12px;color:var(--muted);margin-left:auto;white-space:nowrap}` — the range
  text is muted body copy at §8 sizes, never a small green success-coloured label.

### 4.3 Long lists → bounded data table (never an open-ended list)
Any panel whose content is a **list of records that can grow** (look-ahead, overdue packages,
validation issues) must render as a **data table inside a fixed-height scroller** — never as an
open-ended list that stretches the page.

- Container: `.tableScroll` (`max-height:340px; overflow:auto; margin-top:8px;
  border:1px solid --line; border-radius:10px`) with `thead th{position:sticky;top:0}`. The panel
  therefore keeps a stable height no matter how many rows match; only the table scrolls.
- The **row count is shown in the control row** (e.g. `PO Plan from … to … (N packages)`), so the
  full size is still communicated even though the list is clipped.
- Row content: one record per row, no duplicated paragraph text; numeric columns right-aligned
  with `.num` + tabular figures.
- **Windowing (L3, §7.2.8).** Because the list is never truncated, a table whose *columns × rows*
  product makes full DOM materialisation expensive MUST render only the visible window. The
  control row still reports the **full** count.
- **Print (§7.2.11).** `.tableScroll` MUST be released inside `@media print`, otherwise the 340 px
  cap clips every long table in the exported PDF.
- **Panel title must not hard-code the filter value.** Name the panel after the *view*
  (`PO Look-Ahead`), not after the current selection (`3-Month PO Look-Ahead`) — the horizon is
  a user control, so the title describing it goes stale the moment the user changes it.

#### Horizon / range filters
When a list is scoped by a time window, expose the window as a **segmented control** (§7.5) in
the panel's control row, not as a hard-coded constant:

- Typical options: `1m / 2m / 3m / 4m / 6m`, default `3m`, persisted via a dashboard preference key.
- The horizon is measured in **calendar months** (`new Date(y, m + n, d)`), never a fixed day
  count such as `+90 days` — a day count drifts against the calendar and does not mean what the
  label says.
- Changing the horizon **re-renders only that panel**; the last data set is cached by the
  renderer so the control can redraw without a full dashboard reload.
- The control sits in **one row** with its label and the count text (same rule as §4.2's period
  window): `flex-wrap:nowrap; align-items:center`, count text `margin-left:auto`.

#### Look-ahead lists — general requirement
A **look-ahead** is any panel answering *"what is coming up in the next N periods"*. Every
look-ahead list must satisfy all of the following, on every dashboard:

1. **It is a data table** in a bounded scroller (§4.3 above) — not a prose list, and not a chart
   of the same rows. Rows are one record each; no duplicated paragraph text.
2. **Forward-looking only.** The window starts at **today / the operational as-of** — never at the
   project start. Anything already **completed is excluded**: if the tracked milestone has an
   *Actual* date, the item is done and must not appear in a forward-looking list (this is the same
   canonical done-rule as Overdue — *Actual present ⇒ stage complete*).
3. **Sorted ascending by the due date**, so the soonest item is always the first row.
4. **Shows the distance to the due date** as a numeric, right-aligned column (`.num`, tabular
   figures) — e.g. `In (days)` — so urgency is readable without mental arithmetic.
5. **Carries the current status** column so the reader can see at a glance whether the item is
   still open.
6. **The window is a control, not a constant** — exposed as the horizon filter above. Never
   hard-code `90 days` or any other span, and never require a metadata/config row just to widen
   the window.
7. **The panel title names the view, not the selection** (`PO Look-Ahead`, never
   `3-Month PO Look-Ahead`) — the horizon is user-changeable, so a title carrying it goes stale.
8. **The row count is reported in the control row** (`… (N packages)`), because the list is
   clipped by the scroller and the reader cannot count rows to get the total.
9. **It offers a `⤓ CSV` download** (§7.8) in the same control row as the horizon filter. The
   exported rows must be **exactly the rows on screen** — same filter, same sort, same horizon —
   so the renderer caches the resolved list and the exporter serialises that cache rather than
   re-deriving it (re-deriving risks a silent mismatch). Empty list ⇒ `Nothing to export` toast,
   never an empty file.

- A look-ahead is the mirror image of an **overdue / delay** list: overdue is backward-looking
  (`due < as-of`), look-ahead is forward-looking (`as-of ≤ due ≤ as-of + horizon`), and the two
  must never overlap because of rule 2.

### 4.4 Drill-down (row detail) — accordion, one open at a time
Expandable detail inside a table row (I-62 pattern: metadata + stage grid + that row's issues)
must behave as an **accordion**:

- **Only one detail may be open at a time.** Opening a row closes any other open row before it
  opens. A stack of expanded details turns a bounded list back into an unbounded wall of nested
  content, which defeats §4.3.
- The detail is a sibling `<tr>` with `hidden` toggled; its owning row carries
  `aria-expanded`, and the two must always be updated together — including when the row is closed
  *programmatically* by the accordion, not just by a click on itself.
- Rows are operable by **pointer and keyboard** (`tabindex="0"`, Enter / Space) via a delegated
  listener on the table container.
- The expand affordance is the chevron `▸` → rotated on `aria-expanded="true"` (§7.7).
- Re-rendering the table (e.g. after a filter change) collapses everything — detail state is not
  preserved across a rebuild, which is acceptable because the row set has changed.

---

### 4.5 Validation panel (per-package data issues) — rev 2026-10-14

Shows the **row-level validation results produced by S3** (filter-independent, run once at
load). It is **distinct from** the §3.5 system/config warning bar: that bar carries only
*system/config* notices (missing columns, row-count mismatches) plus the fatal `W-FORMULA`
exception; the Validation panel carries the *per-package data* issues. Both can be present at
once.

**Components, in this order (one panel):**

1. **Title row** — panel title `Validation`; inline `?` (help `vcard`, **left**) and `−`
   (collapse, **right**) in the right-aligned action cluster (§4.1); a **CSV export** button in
   the *same* cluster (no change to existing MDL CSV behaviour); and the **severity summary chips**.
2. **Severity summary chips** (`.vchip`, at the title row): totals for error / warning / info,
   plus a hidden `.ok` **"no issues"** chip shown **only** when the issue count is 0. **Shape =
   the PPP form** — keep the `.e / .w / .i / .ok` colour tiers from §7.10 but **override** its
   default `border-radius:999px` to **6 px**, with **11 px / 700** and `text-transform:capitalize`.
   (Deliberate PPP parity; the generic 999px pill of §7.10 does **not** apply to these chips.)
3. **Collapsible detail** — a `<details>` element that **starts collapsed**; the user toggles it
   open. Contains, in order:
   - **(a) Code-sheet validation summary** (`#vmap`): a **note card** (single `.note`-style box,
     **not** a heading-plus-list) reporting whether the workbook's Code sheet is coherent — columns
     mapped (e.g. `A → AP`), the Error-table rule count loaded, and each lookup table's completeness
     (empty/missing lookups flagged). Answers *"is the workbook structurally valid?"* before the
     per-issue list.
   - **(b) Rule reference** (`#vref`): **one card**, **one row per fired rule code** (de-duplicated),
     laid out as a small table — `severity symbol · code · group · description · count`. **Never
     individual per-rule cards.** Wording priority: the Error table on the Code sheet is the source
     of truth; if a code is absent there, the dashboard supplies the description (flagged as such).
   - **(c) Per-issue table** (`.vtableWrap`, an instance of `.tableScroll` / `.ds-table`, §4.3 &
     §7.2): the full issue list.

**Per-issue table columns:** severity **first**, then `Rule · Doc No · Field · Value · Message`
(+ `Source Tab` / `Row` where the dashboard tracks them). Severity renders as a **bare `.sev`
glyph** — a **fixed-size inline SVG** (14×14, `role="img"` + `aria-label`, §7.2.4), one shape
per tier (red circle-cross / amber triangle / blue circle-i), *not* the colour-emoji `⛔ ⚠️ ℹ️`
whose per-glyph font metrics inflate the row and differ between severities. **The `.sev` glyph
must be flat: no filled circular / pill background, no `border-radius`, no padding** — it sits
inline inside the cell without overlapping cell borders. The glyph lives on an **inner `<span>`**
that carries `.sev-error` / `.sev-warning` / `.sev-info`; that class MUST NOT be applied to the
`<td>` (§7.2.4). This applies to **both** the per-issue table *(c)* and the Rule Reference table
*(b)* (`#vref`), which share those classes. (Distinct from the §4.5.2 `.vchip` summary chips,
which keep their 6px PPP shape with colour fill and are not in a table, so the emoji is
allowable there.)

- **Field** = the column the *business rule* (Code-sheet Error block) checks — a real source
  column name (e.g. `Actual 1st Issue Date`, `Latest Approval Date`, `Rev`, `CUESH Discipline`).
- **Value** = the *validation result* — the specific offending cell value the pipeline found,
  **never** a pass/fail flag.

**No row cap.** Every issue renders inside the `.tableScroll` scroller (§4.3); the row count is
reported in the title/control row, **not** by truncating. (The previous 80-row truncation is
removed.) Empty state: zero issues → `.empty` caption in the table and the `.ok` chip shown; the
`<details>` may still be opened to inspect `#vmap` / `#vref`.

**Explanatory note placement.** The panel's short `.note` (issue count + *"sourced from the Code
sheet Error block"*) sits **above** the collapsed `<details>` toggle — **never below it**. The
toggle already hides the heavy `#vmap` / `#vref` / table content; the note must stay visible
without expanding, so it cannot be buried inside the collapsed region.

**Help:** `vcard` in the Help modal (§7.9) carries the longer explanation; the panel body keeps
only the short inline hint.

*Cross-refs:* table base §7.2 · scroller §4.3 · severity symbols §3.5 · chip colour tiers §7.10
(shape overridden above) · help §7.9.

---

## 5. KPI Overview Panel

- First panel on every dashboard. Title `KPI OVERVIEW`, inline `?` (help, **left**) and `−`
  (collapse, **right**) buttons in the right-aligned action cluster, corner panel number.
- **KPI cards** in a responsive grid (6 → 3 → 2 columns), gap 10 px.
- The KPI panel carries **no subtitle** — the per-panel explanation lives in the Help modal
  (§7.9). Do not duplicate explanatory copy in the panel body.

### KPI card
- White surface, 1px `--border`, **3 px coloured top strip**, radius 8 px, padding 10 px.
- Top-strip colour: `--blue` by default; `--green` (ok), `--amber` (warn), `--red` (bad)
  when the card carries a status.
- **Number**: 22 px (compact strip) / 28 px (hero), weight 700, colour `--navy`.
- **Label**: 10 px, uppercase, `--muted`.
- **Optional sub-status line**: icon + text + colour (§9).

### KPI sub-tier (`.subkpi`)
- Below the main KPI cards, a secondary grid of **compact info chips** (`.subkpi`) surfaces
  supporting status counts. Each chip shows a **value** (`.subkpi .v`, 16 px / 700 / `--navy`)
  and a **label** (`.subkpi .l`, 10 px / `--muted`).
- The sub-tier metric set is **dashboard-specific** — each dashboard defines its own informational
  chips appropriate to its domain (e.g. flag counts, completeness %, active dimension counts).
- Labels state exactly what is counted; the denominator for any ratio must be derivable from the
  workbook contract, never hard-coded.

```css
.kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.kpi{background:var(--surface);border:1px solid var(--border);border-top:3px solid var(--blue);
  border-radius:8px;padding:10px}
.kpi .v{font-size:22px;font-weight:700;color:var(--navy)}
.kpi .l{font-size:10px;color:var(--muted);text-transform:uppercase;margin-top:2px}
.subkpi{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px}
.subkpi .v{font-size:16px;font-weight:700;color:var(--navy)} .subkpi .l{font-size:10px;color:var(--muted)}
.kpi.warn{border-top-color:var(--red)} .kpi.ok{border-top-color:var(--green)} .kpi.amb{border-top-color:var(--amber)}
```

> Note: **22 px is standardised** for compact KPI strips. Use 28 px only for a single hero KPI.

---

## 6. Design Tokens (canonical — copy verbatim)

```css
:root{
  /* Brand */
  --navy:#0F2D52;      /* Primary — Dark Navy */
  --blue:#1E88E5;      /* Accent — Engineering Blue */
  --green:#2E7D32;     /* Success — Green */
  --amber:#F9A825;     /* Warning — Amber */
  --red:#C62828;       /* Critical — Red */
  --slate:#64748B;     /* Neutral — Slate Grey */
  /* Surfaces */
  --bg:#F6F8FA;        /* Background — Off White */
  --surface:#FFFFFF;   /* Surface — White */
  --border:#D9E1E8;    /* Border — Light Grey */
  --text:#1F2A37;      /* Body text */
  --muted:#64748B;     /* Secondary text */
  /* Aliases */
  --card:#FFFFFF; --line:#D9E1E8; --ink:#0F2D52;
  --accent:#1E88E5; --accent2:#2E7D32;
  --warn:#F9A825; --bad:#C62828;
  --soft:#E8F1FD;      /* light-blue highlight tint */
  --shadow:0 1px 2px rgba(15,45,82,.04);
  --radius:10px;
  --font:'Segoe UI',system-ui,-apple-system,'Inter','Source Sans Pro',Roboto,Helvetica,Arial,sans-serif;
  /* Semantic status tokens (MDL palette) */
  --warn-bg:#FFF4D6; --warn-border:#F0D38A; --warn-fg:#9a6b00; --warn-fg-strong:#9a6b00;
  --error-bg:#FDE8E8; --error-fg:#C62828;
  --ok-bg:#E6F4EA; --ok-fg:#2E7D32;
  --accent-soft-border:#BFD8F2; --accent-ink:#1E88E5;
  --grid:#EDF1F5;
}
```

### Colour reference
| Token | Hex | Role |
|---|---|---|
| `--navy` | `#0F2D52` | Primary, headings, KPI numbers |
| `--blue` | `#1E88E5` | Accent, actions, links, KPI top-strip default |
| `--green` | `#2E7D32` | Success / ok |
| `--amber` | `#F9A825` | Warning / caution |
| `--red` | `#C62828` | Critical / overdue |
| `--slate` | `#64748B` | Neutral |
| `--bg` | `#F6F8FA` | Page background |
| `--surface` | `#FFFFFF` | Cards / panels |
| `--border` | `#D9E1E8` | 1px outlines |
| `--text` | `#1F2A37` | Body text |
| `--muted` | `#64748B` | Secondary / captions |

### Spacing scale
`4 · 8 · 12 · 16 · 24 · 32 · 48` px. (8 pt-based; use consistently.)

### Radius
- Panel: **10 px** · Card / KPI: **8 px** · Button: **6 px** · Input/select: **8 px**.

### Shadow
- Subtle only: `0 1px 2px rgba(15,45,82,.04)`. No large/decorative shadows.

### Semantic & tint tokens
The canonical `:root` also ships **tint / semantic** tokens that every component MUST use for
status/tint surfaces (do not hard-code hex in components):
`--soft` (light-blue highlight), `--accent` (= `--blue`), `--accent-ink`, `--accent-soft-border`,
`--warn-bg` / `--warn-border` / `--warn-fg`, `--error-bg` / `--error-fg`, `--ok-bg` / `--ok-fg`.

### 6.1 Dark theme (optional, token-driven)
Dashboards MAY offer a dark theme. Because every colour is a token, dark mode is achieved by
**re-mapping token values only** (e.g. `--bg`/`--surface` → dark, `--text`/`--muted` → light;
keep `--navy`/`--blue` as brand anchors). Components must reference tokens — never literal hex —
so they adapt automatically; no per-component dark CSS beyond the token swap (use a
`[data-theme="dark"]` attribute selector on the root element).

---

## 7. Component Library

### 7.1 Buttons

**Single standard — no per-dashboard button variations.** MDL and PPP use the *same* classes, sizes, colours and hover behaviour, and every action is a real `<button>` element (never a `<td>`/`<div>` with `role="button"`). Buttons fall into three families:

#### A. Action buttons
| Type | Class | Use | Style |
|---|---|---|---|
| A1 Primary | `.btn` / `.btn-primary` | **one per screen** highest-emphasis CTA — *Open / Load workbook* only; Print / Save / Export are **not** primary | `--blue` solid, white text, radius 6 px, min-height 32 px |
| A2 Secondary / Ghost | `.btn.ghost` / `.btn-secondary` | low-emphasis alternative / cancel / dismiss; "Load another file" | white, 1px `--border`, **navy** text; hover → `--blue` fill, white text |
| A3 Text action | `.btn-secondary` (glyph + label); PPP also uses `.dlBtn` / `.copyBtn` | tool / footer-row actions: export, copy, CSV (e.g. `⤓ PNG`, `⧉ Copy`, `⤓ CSV`) | white, **navy** text, glyph + space + label; hover → `--blue` fill, white text |
| A4 Icon / Mini | `.icon-btn` | icon-only: Help `?`, Collapse `−`, Theme, modal close `✕` | **PPP is the reference implementation.** `width:26px;height:26px;min-height:26px` — 26 px **square**; radius 6 px; 1px `--line`; `background:#fff`; `color:var(--muted)`; `font:inherit`; **13 px** / 600; `line-height:1`; inline-flex centred. Hover → `--soft` background + `--navy` text. **Must carry `aria-label` + tooltip** |
| A5 Search | `.search-btn` | search submit, affixed to the search input (right edge, single-side radius) | `--accent` fill, white glyph, radius `0 6px 6px 0`, attached to input |

#### B. Selection controls
| Type | Class | Use | Style |
|---|---|---|---|
| B1 Filter trigger | `.tf-btn` | **opens** a filter menu (Discipline / Stage / Category `▾`) — distinct from the chips *inside* the menu | text + `▾`, 1px `--border`, radius 6 px; hover → `--soft`; selected → `.is-filtered` / `.active` emphasis |
| B2 Segmented | `.seg button` | single-select among 2–6 inline options (Bar/Pie, month horizon 1m–6m, overdue cases); active `.on` = **`--navy`** fill (a *selection* state, not an action) | joined group, 1px `--border`, radius 6 px, overflow hidden; inactive hover → `--blue` fill |
| B3 Filter chips | `.chips label` | multi-select toggles *inside* the filter menu (checkboxes styled as pills) | 11 px, rounded pill |
| B4 Drill / Expand | reuses `.icon-btn` visuals | row drill-down / expand (`▸ stages`) | **must be a real `<button>`** — never a `<td>` or `<div>` with `role="button"`; may be icon or text + icon |
| B5 Native single-select | `.inter-sel` | single-choice picker — breakdown dimension, month, type (chart group / matrix Month / Overdue Type); distinct from multi-select `.tf-btn` filter and from the `.seg` segmented control | 12 px / 600, 1px `--border`, radius 8–9 px, white surface, `--ink` text; `:focus-visible` 2 px `--blue` ring; `max-width:260 px`; attached variant `.inter-sel.is-attached` (search-column picker: no own border, left-rounded, right divider) |

#### C. Indicator (not a button)
| Type | Class | Use | Style |
|---|---|---|---|
| C1 Status pill | `.pill` | status / count badge — **not an action** | 10 px / 600, radius 999, semantic colour variant |

- **Font:** 12–14 px / 600 (A4 icon buttons **13 px**, per PPP).
- **Hover (A2 / A3):** `--blue` fill, white text — *not* a `--soft` tint.
- **A1 Primary** keeps `--blue` (the *action* colour); the **B2 segmented active state** is `--navy` (a *selection* state) — different semantics, intentionally different colours.
- **Modal is a container, not a button type:** its close `✕` = A4; its footer actions = A1 / A2 / A3.
- **A4 is used ALONE, and must stay 26 px square.** `.icon-btn` is never combined with `.btn`
  (PPP: `class="icon-btn"`). If an element has to carry both, `.icon-btn` **must declare its own
  `min-height:26px`**: CSS resolves `min-height` *over* `height`, so a bare `height:26px` still
  renders **32 px** tall — A1/A2/A3 carry `min-height:32px` — while the source still reads
  "26 px square" and passes a text-only check.
- Inline panel actions sit in the title row, **right-aligned** as a cluster (see §4); within the cluster Help `?` is left of Collapse `−`.
- **Text contrast is mandatory (WCAG AA).** Every control's label must meet AA contrast against its *own*
  effective background — ≥ 4.5:1 for normal text, ≥ 3:1 for large/bold or UI text. A borderless/ghost rule
  must **never** leave white text on a white or transparent background: the Primary CTA (A1) keeps its solid
  `--blue` fill + white text, and pinned/sticky header buttons keep the header fill.
  **Toggle/pressed states must also keep their fill** — e.g. the Warnings button when the bar is collapsed
  carries `aria-pressed="true"` (white text); a `background:transparent` ghost rule must not override that
  pressed fill and drop the label onto the page background. Enforced by the layout harness **Tier 4d
  `controlContrast`** check, which forces the Search panel, each filter-chip dropdown, and the pressed
  warning-toggle open and fails any control below 3:1 contrast or with no accessible name; MDL runs it hard,
  PPP advisory. (Regressions: MDL I-105, I-106.)
- **A control's label/title is stable and must not invert its verb with state.** A toggle button's
  accessible name describes the control, not the result of the next click: the `Warnings` toggle therefore
  always reads **`Warnings`** with the count in its badge (`[N] Warnings`), and never flips to `Show warnings`
  / `Hide warnings` when collapsed/expanded. A label that changes verb with state is both confusing and a
  contrast risk (it can force a different colour pair). (Regression: MDL I-107.)

### 7.2 Tables (`.ds-table`) — rev 2026-10-15

> **Why this revision exists.** The pre-2026-10-15 §7.2 specified *appearance and semantics
> only*. Because none of it was enforceable, both shipped dashboards produced tables that are
> semantically correct (`<table>` + `<th scope>`) yet visually ragged and interaction-free — most
> visibly a severity column whose row height and baseline differ from every other column in the
> same row. §7.2.1–§7.2.12 below add the **normative interaction and typography contract**.
> Every **MUST** is a testable acceptance criterion.

One common table style for **every** tabular view. Data tables (benchmark, look-ahead,
overdue) and issue tables (validation) all use `.ds-table`; issue tables add severity + optional
row drill-down on top of the same base — never a second, divergent table style.

#### 7.2.0 Normative class names (closes §13.6 open item 5)
These class names are **normative** and MUST be used verbatim. A dashboard MAY add its own
classes alongside them but MUST NOT substitute them; panel / container class names remain free
(§4).

| Class | Role |
|---|---|
| `.ds-table` | the one table style (`.ds-table.compact` = dense numeric variant, §7.2.3) |
| `.tableScroll` | bounded scroller (§4.3); `.vtableWrap` is its validation instance |
| `.num` | right-aligned numeric cell with tabular figures |
| `.empty` | empty-state cell |
| `.over` | overflow-highlighted row |
| `.sub` | drill-down child row |
| `.matrix` | cross-tab variant (§7.2.9) |
| `.th-wrap` / `.lb` | flex wrapper inside `<th>`, and the header label span inside it |
| `.ds-sort` | the real `<button>` inside a sortable `<th>` (§7.2.6) |
| `.ds-pinned` | a pinned (frozen) cell — a property of the column, not the position (§7.2.13) |
| `.ds-pinned-edge` | the **last** pinned cell; carries the freeze rule and the elevation (§7.2.14) |
| `.ds-resize` | the `--ds-grip-w` resize hit area on a header's right edge (§7.2.13) |
| `.ds-spacer` | a windowing spacer row (§7.2.8) |
| `.sev-error` / `.sev-warning` / `.sev-info` | severity state, on an **inner span** (§7.2.4) |
| `.sev-chip` / `.sev-svg` | that inner chip span, and the fixed-size status SVG inside it |
| `.vheadtab` | thead-only **header fragment** of a split header, rendered outside the scroller (§7.2.15) |
| `.ds-gut` | trailing gutter cell / column reserving the scrollbar width in that fragment (§7.2.15) |

**State classes** (added and removed by script, never hard-coded in markup):

| Class | On | Meaning |
|---|---|---|
| `.ds-dragging` | the `<th>` | its column is current
---

#### 7.2.15 Split header (fragment pairing) — added 2026-10-18

A **split header** moves `<thead>` out of the scroll container into a thead-only fragment
(`.vheadtab`), so the vertical scrollbar starts **below** the header instead of beside it. It is the
required pattern for a **grouped** header that lives inside a scroller (§7.2.9); a single-row header MAY
stay inside the scroller and use `position:sticky` instead.

The fragment is a **declared exception** to the sticky rule — and an exception MUST be paid for with
equivalent invariants. Splitting the header creates a new failure mode: header and body are now two
independent tables that can drift apart, and a drift is invisible to every per-table check (a shipped
MDL matrix carried six visible defects while the harness reported zero failures). Every one of the
following MUST hold. Omitting any single one produces a visible defect, so the set is normative, not
advisory.

1. **One container** — header and body MUST be wrapped in a single bordered, rounded box with
   `overflow:hidden`, and the inner scroller's own `border`, `border-radius` and `margin-top` MUST be
   neutralised, so the pair reads as one table with continuous corners. Left at its defaults,
   `.tableScroll` gives an 8 px gap under the header and a square header sitting on a rounded box.
2. **Containing block** — the fragment's cells MUST stay `position:relative` (never `static`): they are
   the containing block for the absolutely-positioned column-rule pseudo-element (§7.2.2). Setting
   `static` removes every column rule, while the pseudo-element itself still reports
   `position:absolute` — so a check that inspects only the pseudo-element can never detect it.
3. **Width pin + gutter** — script MUST pin the fragment's width to the body table's rendered width
   **plus** the scrollbar, and keep `--ds-sbw` in sync via a `ResizeObserver` (not a window resize
   listener: a scrollbar can appear or vanish with no resize event). Sizing to `clientWidth` leaves a
   white notch over the scrollbar; sizing to the *scroller* leaves the header narrower than an
   overflowing body.
4. **One column grid** — both fragments use `table-layout:fixed` and the same data-column widths; only
   the header adds the trailing `.ds-gut` gutter column.
5. **Fit, then lock-step** — column widths are content-derived and the pair fits the display area. If
   horizontal scrolling is unavoidable, the header MUST follow the body's `scrollLeft`. A header that is
   wider than the body, or that stays put while the body scrolls, is non-conformant.
6. **One implementation** — the pairing is wired by a single shared helper used by every split-header
   table. A table MUST NOT hand-roll a partial copy of this contract.

**Alignment across a split header MUST be driven by the column, never by DOM position.** A grouped
header with `rowspan` cells gives the header row different child indices from the body row it labels, so
`nth-child` selectors address different logical columns in each half. Verification MUST therefore pair
header and body cells by their rendered position, not by index.

**Verification** — these are enforced by `harness-layout` Tier 4c under `chrome.splitHeader`: header/body
gap, one rounded container, column rule in place, header-vs-data alignment, column-boundary alignment,
width equality, fit (no horizontal overflow), and horizontal lock-step.

**Matrix exception (Discipline Summary Matrix).** The matrix keeps a column rule on **every** header cell —
the grouped (first) row *and* the final data column included — rather than suppressing them; the gutter
stays exempt. The default `ds-table` suppression of `colspan`/last-column rules (§7.2.2) is therefore
overridden for `.matrix`. This is enforced by harness **Tier 4g** `lintMatrixHeaderRules`, which fails if
any non-gutter header cell lacks its painted `::after` rule (covering all header rows, not just the first
data cell). (Regression: MDL I-108.)
