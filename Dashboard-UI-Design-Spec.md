# Dashboard UI Design Standard

**Version**: 1.0
**Date**: 2026-10-04
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

> **MDL variant (accepted 2026-10-11, see MDL workplan §4.0):** MDL ships a **two-row** top bar. Row 1 = logo + a **3-line title block** (project title / dashboard title / project-start + as-of) + Load-workbook / Print buttons. Row 2 = the **Discipline** and **Stage** filter chips **and the search box**, right-aligned as one group. The workbook name is intentionally omitted. This is the documented MDL pattern and the canonical reference for MDL's header. **Fonts follow §8 (single standard) — there is no separate MDL font stack or sizing; the 3-line title uses the §8 sizes (`.ttl` 17/600, then 12/500, then 11/400).**
- The logo is a white chip: `height:36px`, `padding:3px`, `border-radius:6px`,
  `box-shadow:0 1px 3px rgba(0,0,0,.2)`.
- The header is mandatory on every dashboard. Navigation may be a left sidebar (MDL) or
  inline in the header (PPP) — either is permitted (§3.2).

### 3.2 Navigation
-   Either a **left sidebar** (MDL pattern: OVERVIEW / REVIEWS / DOCUMENTS / QUALITY /
  SETTINGS) **or** a top-bar nav (PPP pattern). Both are permitted; the header is
  mandatory in either case.

> **MDL left-nav deferred (accepted 2026-10-08, Decision 34 / workplan I-35):** the MDL left sidebar is **deferred to a future phase**. MDL currently ships a **header-only** layout (two-row top bar, see §3.1 MDL variant). Accepted deviation; revisit before next release.

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
    keeps it visible at a glance. Default state is visible (`localStorage` key `mdl_hideWarnings`,
    `true`/`false`; default `false`).
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
4. **Instructions callout `.expect`** — label **"What this does"** (bold / uppercase, `--blue`, 11 px) + body *"Select your &lt;project&gt; workbook (.xlsx)… Drop it below or click to browse."* (12 px, `--accent-ink`) — `&lt;project&gt;` is project-specific (e.g. "Code-sheet" for MDL, "Procurement Package Plan" for PPP).
5. **Dropzone `.drop`** — a distinct sub-region **inside** the card (not the whole hero), containing: drop text *"Drop your workbook here"* (14 px / 600), hint *"or click to browse"* (12 px, `--muted`, no bottom margin), and the **primary button inside the drop area**, label **"Choose Workbook"** (Primary fill, **14 px**, **padding 12px 22px**).
6. **Privacy + copyright** — *"Works fully offline — your data never leaves this browser"* (11.5 px, `--muted`, centred, optional shield icon) and *"© {year} UESH"* beneath it (11.5 px, `--muted`, `margin-top:6px`).

**Style contract** (canonical values — **PPP is the reference implementation**; design tokens only, no raw literals):
- Container: `min-height:100vh; display:flex; align-items:center; justify-content:center; padding:24px` (the `--bg` body canvas provides the background — no separate background on the container).
- `.wcard` (MDL alias: `.welcome`): `background:var(--card)`; `border:1px solid var(--line)`; `border-radius:24px`; `box-shadow:var(--shadow)`; `padding:48px 48px`; `max-width:480px`; `width:100%`; `text-align:center`.
- `.expect`: `background:var(--soft)`; `border:1px solid var(--accent-soft-border)`; `border-radius:12px`; `padding:12px 16px`; `font-size:12px`; `color:var(--accent-ink)`; `margin-bottom:20px`; `text-align:left`; its `<b>` label `font-size:11px; text-transform:uppercase; letter-spacing:.04em; color:var(--blue); display:block; margin-bottom:3px`.
- `.drop`: `border:1.5px dashed var(--line)`; `border-radius:16px`; `padding:24px 16px`; `margin-bottom:22px`; `cursor:pointer`; `transition:.2s`; **hover / drag-over** → `border-color:var(--accent); background:var(--soft)`.
- `.drop .d-title` (`.big`): `font-size:14px; font-weight:600; margin-bottom:4px`.
- `.drop .d-sub` (`.small`): `font-size:12px; color:var(--muted)` (no bottom margin).
- `.privacy`: `font-size:11.5px; color:var(--muted); margin-top:18px; display:flex; gap:6px; align-items:center; justify-content:center` (optional shield icon).
- `.copyright`: `font-size:11.5px; color:var(--muted); margin-top:6px`.

This is a single-focus **hero** surface, so it may use a **larger radius** (up to ~24 px) than data panels — only the hero card and the dropzone relax radius; the primary CTA is still the standard Primary button (§7.1). Copy is fixed as above; only `<X>` in the headline and the `&lt;project&gt;` noun in the `.expect` body are project-specific. Everything else follows §4–§6.

### 3.8 Data-Processing Pipeline (mandatory)

Any dashboard that ingests a workbook (MDL `.xlsx`, PPP `.xlsx`/`.csv`) MUST follow this single,
predictable pipeline. **Objective: parse once → normalise once → validate once → derive on demand**,
so filter changes are fast (no re-parse) and every aggregation lives in exactly one place (no duplicate
KPI engine).

**Stages**

| # | Stage | Responsibility | Input → Output | Runs |
|---|---|---|---|---|
| S0 | Acquire | Read raw bytes from the file input; no parsing. | `File` → `ArrayBuffer` | On file open only |
| S1 | Parse | Parse the container into an in-memory workbook (sheets / rows / cells). | `ArrayBuffer` → `workbook` | On file open only. The raw `workbook` is **discarded after S2** — only the normalised model is retained. |
| S2 | Ingest / Normalize | Turn raw rows into a normalised **record table**: typed fields (Date/Bool coercion), `isActive`, `discipline`, `stage`, `docNo` (MDL) / `packages[]` (PPP); build contract/lookup tables (`codeInfo`, `lookups`, `statusCanon`) and `meta` (project info, today). **No aggregation or KPI math.** Normalization treats a cell as **absent (`undefined`)** when it is blank (empty after `trim`) **or** a spreadsheet formula-error token — see §3.8.1. | `workbook` → `model{ records[], contract, meta }` | On file open only; held in memory for the session. |
| S3 | Validate | Run row-level, **filter-independent** validation rules once. | `records` + validation context → `issues[]`, `warnings[]`, `completenessGroup` | On file open only. |
| S4 | Derive / Aggregate | **On demand**, given the current filter/UI state: filter `records` → `active`, then compute **all** aggregations — KPIs, overdue lists, charts, matrix, completeness%. This is the **sole** source of KPI numbers. | `model` + `state` → `view{ active, kpis, issues(filtered), charts, matrix, … }` | On every filter change / render. |
| S5 | Render | Paint DOM panels from `view`. | `view` → DOM | On every render. Keep the deferred-render rule: repaint once when the filter dropdown closes, not on every in-dropdown toggle. |
| S6 | React-to-filter | Refresh loop. | user action → `deriveView(model, state)` → `render(view)` | On filter change. **Never re-runs S0–S3; the file is never re-parsed.** |

**Mandatory rules**
1. **One source of truth for aggregations.** KPI / chart / overdue math lives in **exactly one** place
   (S4). A pipeline stage (S2/S3) must **not** also compute KPIs that the view recomputes — that creates a
   duplicate engine and a silent drift risk.
2. **Discard the raw parse.** After S2 retain only the normalised `records` + `contract` + `meta`. Do not
   keep the full parsed `workbook` (larger, never re-read).
3. **Validate once, at load.** Row-level validation (S3) is independent of filters; compute it a single
   time and reuse. Filter-dependent derivations belong in S4.
4. **Derive on demand (fast, no I/O).** S4 recomputes only from the in-memory `records` — fast because
   there is no file read. *Scale-driven, optional*: memoize S4 by a filter key (`disciplines|stages|rule`),
   and/or pre-build row indexes (`Map<discipline, indices>`) so filtering is a lookup rather than a full scan.
5. **No re-parse on filter change.** S6 reuses the in-memory model; re-reading the file on each filter
   toggle is prohibited.
6. **As-of and project-start are distinct anchors.** `meta.today` (as-of) is the **viewer's local
   system date** — built from local date components, **never** `toISOString()` (UTC), which introduces
   a 1-day off-by-one near local midnight. As-of drives every Overdue / Approval / look-ahead /
   completeness calculation. The workbook `Code!B6` **project-start** date is an **x-axis origin for
   date-curve panels only** (S-curve / throughput); it must **never** feed Overdue, approval, or
   schedule-variance math. On the S-curve the x-axis is **anchored at the earliest document date** (same anchor rule as the PPP dashboard's S-curve) and carries two reference lines: **Start** (the `Code!B6` project start, red dashed) and **Today** (as-of, navy solid).
7. **Blank and formula-error are the same "absent" state.** During S2, any raw cell value that is
   blank (empty after `trim`) **or** a spreadsheet formula-error token (`#NULL! #DIV/0! #VALUE! #REF!
   #NAME? #N/A #NUM! #GETTING_DATA #SPILL! #CALC!`, case-insensitive) is normalized to `undefined`.
   This applies to **every** data column (all `fieldOrder` / `columnMap` fields, including the derived
   `discipline` / `stage`), is **not** a per-column opt-in, and means downstream consumers (KPIs,
   filters, charts, validation) never special-case an error token — they simply see a missing field.
   A column that contains any error token also raises a fatal `W-FORMULA` notice (§3.8.1 / §3.5).

**3.8.1 Value normalization — blank and formula-error are equivalent "absent" (standard)**

During **S2**, every raw cell value written into a normalised `fields` entry is treated as **absent
(`undefined`)** when it is either:

- **blank** — the cell is missing/empty, or its text is empty after `trim()`; or
- **a spreadsheet formula-error token** — the cached cell value equals one of `#NULL! #DIV/0! #VALUE!
  #REF! #NAME? #N/A #NUM! #GETTING_DATA #SPILL! #CALC!` (matched case-insensitively, after
  upper-casing).

This is a **single, uniform standard applied to every data column** (all `fieldOrder` / `columnMap`
fields, including the derived `discipline` / `stage` which read those fields) — it is **not** a
per-column opt-in. Blank and error are deliberately treated the same way: an error token is not a
valid value, and counting it as present (or as a bogus category) silently corrupts KPIs, filters,
charts, and validation.

*Implementation:* a shared `isExcelError(v)` predicate (uppercase-normalized token match) lives in
the pipeline; S2 coerces any blank/error to `undefined` and accumulates a per-field **error-token
count**. Downstream consumers (S3/S4, render) simply see a missing field — no special-case token
matching anywhere.

*Fatal data-quality notice (coupled, distinct):* because an error token corrupts count correctness,
S3 emits — **one aggregated entry per affected column** — a fatal `model.warnings` item
`{ level:'fatal', code:'W-FORMULA', tab:<field>, message }` carrying the field label, column letter,
`N of total` error cells, and a recover instruction: *"In Excel, fix the formula errors (e.g. a
referenced sheet such as SubmittalLog may be missing/broken), then force a full recalculation
(Ctrl+Alt+F9) and save the file so values are stored; re-open here."* Recalc alone does **not** cure
a broken reference, so the message says "fix the formula errors." These notices route to the top
`#errBanner` as fatal strips (§3.5) and are **not** pushed to `model.issues` (those are row-keyed
and filtered by `activeSet`, so a column summary would never surface in Panel 12).

**Reference implementation & conformance**
- **PPP is the reference implementation**: `buildModel()` = S2 only (normalises `packages[]` +
  `lookups`/`statusCanon`, discards the raw parse); `validate()` = S3; `renderKPIs` / `renderInteractive` /
  `renderPOMonthly` = S4 (deferred, single source, no duplicate).
- **MDL conformance (closed via I-67)**: `buildModel` was refactored to S2+S3 only — the
  `kpis`/`charts`/`overdueLists` computation was removed and `deriveView` is now the sole S4 source,
  eliminating the duplicate-KPI issue **I-63**. PPP remains the reference implementation.

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
- **Padding**: `… 26px` bottom (MDL `14px 14px 26px`). The 26 px bottom gap reserves clearance for
  the corner panel number (`bottom:8px`) so it **never overlaps** the last card / content line.
  The dynamic Panel 2 container (`#charts`) gets the same `padding-bottom:26px`.
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
Some panels hold several **chart cards** in a grid (e.g. PPP's *Interactive Chart* = Panel 2
with *Packages* + *Data Quality*). The panel shell still carries §4 chrome — bordered surface,
own title row, corner `Panel N`. Controls split strictly by scope (mirrors MDL's chart panels):

| Control | Owner | Notes |
|---|---|---|
| Help `?` | **the panel** | one per panel, in the title-row cluster; opens the modal (§7.9) |
| Collapse `−`/`+` | **the panel** | collapses the whole grid of chart cards; state lives on the panel element so it survives re-render |
| Chart type (Bar/Pie `.seg`) | **each chart card** | **independent per chart** — keyed by card id (e.g. `inter-<cardId>`), so switching one chart must never flip the others (seg contract: §7.5) |
| Breakdown / dimension select | **each chart card** | each card groups by its own dimension |
| Period window (From / To / range text) | **each chart card** | scopes only the chart it belongs to (§7.9) |
| **Bars** toggle | **each chart card** | shows / hides that card's per-period bars |
| `⤓ PNG` / `⧉ Copy` | **each chart card** | exports that single chart only |

- **Related controls belong to the card they act on — never to the panel area (mandatory, shared
  PPP + MDL — rev 2026-10-13).** Any control that affects **one card's** content must sit **on that
  card's board**, in that card's own **right-aligned** control cluster above its plot. It must
  **not** float in the panel's general area — the panel head, the panel body, or a free-standing
  row between cards. Only controls that act on the **whole panel** — Help `?` and Collapse `−`/`+`
  — live on the panel's own title-row cluster. Rationale: a control sitting in the panel area reads
  as scoping the *whole panel*, which misleads as soon as the panel holds several cards, and it
  leaves the card with no board of its own once cards are bordered. This generalises the table above
  to **every** card type (breakdown charts, combined charts, tables) on **both** dashboards:
  **every card owns its controls; the panel owns only its own chrome.** Cluster order is fixed —
  period window → **Bars** → range text → `⤓ PNG` → `⧉ Copy` (§4.2). There is **no Reset** control
  (§7.9).
- Chart cards do **not** get their own Help/Collapse and are **not** individually numbered —
  they inherit the parent panel's number (see numbering rule above). Only the panel shows one.
- **Chart-card titles** follow §8: `h3` (`.panel-head h3`), 13 px / 700 `--navy`, **not**
  uppercase — they are nested sub-panels, unlike the panel's own uppercase `h2`.
- **A chart-card title names the *view*, not the *selection* (mandatory, shared PPP + MDL —
  rev 2026-10-13).** The card heading carries its own **stable group name** — PPP: *Packages* /
  *Data Quality*; MDL: *Documents* / *Issues* — and must **not** track the breakdown currently
  picked in that card's `<select>`. The same principle as §4.3 rule 7 applies ("the panel title
  names the view, not the selection … the horizon is user-changeable, so a title carrying it goes
  stale"): a user-changeable value in a heading either goes stale or merely restates its control.
  The per-card `<select>` already indicates what is applied, so echoing it in the heading is
  redundant. **PPP already ships this; MDL adopts it (workplan I-84)** — one rule, both dashboards
  compliant together. (The chart's *own* plot caption is a plot label, not this heading, and is
  unaffected — see below.)
- **Panel 4 (MDL chart panel) title.** The panel's `h2` MUST read **`Interactive Chart`** — rendered
  uppercase by the §4 `text-transform:uppercase` rule — and **not** `Charts`. This is the canonical
  name shared with PPP's Panel 2 (§4.1) and the matching Help-modal title; it signals the panel holds
  user-switchable interactive charts. The Help-modal entry for this panel likewise uses `Interactive
  Chart` as its title.
- **Panel board + chart-card grid alignment, border & plot height (mandatory) — rev 2026-10-13.** **Every
  panel has one board**: its shell draws a bordered surface per §4 chrome (own title row, corner
  `Panel N`). This applies to panels that hold chart cards too, so `.panel.panel-flat` (`border:0;
  background:transparent; box-shadow:none`) is **not** permitted there — the earlier "frameless chart
  panel" rule is **rescinded**, as it contradicted the panel-chrome rule stated above and is not what
  either dashboard ships (every panel already implements its board). Inside the panel board each
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

- PPP **PO Look-Ahead**: horizon `1m / 2m / 3m / 4m / 6m`, default `3m`, persisted via
  `getPref('look')`.
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
- MDL instantiates four informational sub-tier metrics (not primary KPIs):
  - **As-Built Required (YES)** — count of *active* documents where `As-Built = "YES"`
    (the requirement flag, **not** delivered as-built).
  - **Vendor Data (YES)** — count of *active* documents where `Vendor Data = "YES"`
    (a YES-flag count, **not** grouped by vendor).
  - **Data Completeness** — % of documents passing the completeness validation group
    (`V-17…V-27`), or `N/A` when none exist.
  - **Active Disciplines** — `distinct active disciplines / total disciplines defined in the
    workbook`; the denominator is the **derived universe** from `Code!H`, never hard-coded.
- Labels state exactly what is counted (I-02/I-03 semantics); relabeling guidance in the
  workplan (I-66).

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

> Note: Design spec §16 originally listed KPI Number = 32 px. The shipped MDL build uses
> 22 px for compact strips; **22 px is standardised** here. Use 28 px only for a single
> hero KPI.

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
so they adapt automatically; no per-component dark CSS beyond the token swap (PPP's
`[data-theme="dark"]` is the reference implementation).

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
| B4 Drill / Expand | reuses `.icon-btn` visuals | row drill-down / expand (`▸ stages`) | **must be a real `<button>`** (MDL currently uses a `<td>` — non-compliant, see §13.2.3); may be icon or text + icon |
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

**State classes** (added and removed by script, never hard-coded in markup):

| Class | On | Meaning |
|---|---|---|
| `.ds-dragging` | the `<th>` | its column is currently being resized (§7.2.13) |
| `.ds-resizing` | `<body>` | a resize drag is in progress — suppresses text selection |
| `.scrolled-x` | `.tableScroll` | scrolled horizontally, so the elevation is showing (§7.2.14) |

#### 7.2.1 Maturity levels — pick the level, do not improvise
A "real `<table>`" only guarantees structure and accessibility; it does **not** guarantee a grid,
and it does **not** guarantee interaction. Choose the level the data needs:

| Level | Name | Capabilities | When required |
|---|---|---|---|
| L0 | Layout table | — | **Forbidden.** Never use `<table>` for page layout. |
| L1 | Static read-only table | Semantics + sticky header + zebra / hover only | Small, stable, print-oriented extracts |
| L2 | **Interactive data table** | L1 + sort, filter / search, pagination *or* bounded scroller, column visibility, row hover / selection. Cells stay read-only. | **Minimum for every dashboard data table** |
| L3 | Data grid | L2 + pinned column(s), column resize / reorder, windowed rendering (§7.2.8), `role="grid"` + cell-level keyboard navigation | **Required when a table exceeds 12 columns**, or exceeds ~1 000 rows inside a bounded scroller |
| L4 | Editable spreadsheet | Cell editing, formulas, clipboard | Out of scope for these dashboards; use a dedicated grid product |
| L5 | Specialised variants | Cross-tab / pivot (§7.2.9), expandable, tree, master–detail, responsive card-stack | As required by the data shape |

#### 7.2.2 Presentation base (now normative)
- **Header**: `thead th`, `--navy` background, white text, 12–13 px, weight 600. Inside a scroll
  container (`.tableScroll`, §4.3 — `.vtableWrap` is the validation-table instance of it) the
  header is `position:sticky; top:0` so it stays visible while scrolling long lists.
- **Long lists never render unbounded**: put the table in `.tableScroll` (§4.3) so the panel keeps
  a fixed height; the row count is reported in the panel's control row instead.
- **Cells**: 1 px `--border` bottom rule; padding 9 px 10 px; default left-aligned. Numeric
  columns get class `.num` → right-aligned with `tabular-nums`.
- **Zebra**: even body rows `#F9FBFD`; row `:hover` → `--soft` tint.
- **Overflow highlight**: a row tagged `.over` gets `--warn-bg` (overrides zebra).
- **Empty state**: `.empty` muted caption — **MANDATORY on every table**, including the wide
  detail table. A zero-row `<tbody>` with no message is a defect.
- **Issue-table extensions**: severity rendered as a `.sev` chip (`.sev-error` / `.sev-warning`
  / `.sev-info`); rows may be expandable drill-downs (`.ovl-row`, `aria-expanded`, chevron).
- **Accessibility**: every header cell is `<th scope="col">`; use `<th scope="row">` for a leading
  row label. Every table MUST carry a `<caption>` (visually hidden via `.sr-only` is acceptable).
- **Divider standard (NORMATIVE).** Every rule in a table is **1 px** — one width everywhere. The
  colour follows the surface it sits on, because a rule must keep its contrast against both the
  navy header and the white body:

  | Kind | Where | Width | Colour | On interaction |
  |---|---|---|---|---|
  | Row rule | bottom of every `td` and `thead th` | 1 px | `--border` | never changes |
  | **Column rule** | right edge of **every header cell** — this is how the user sees where a column ends | 1 px | white 38 % on the navy header | brightens to 70 % on hover, solid white while the column is being resized; **the width MUST NOT change** |
  | Freeze rule | right edge of the last pinned column, **full height through the body** | 1 px | `--border` | never changes |

  Four corollaries:
  (a) **the column rule is drawn on the header cell, not on the resize grip.** A grip exists only
  on a resizable table, so a grip-borne rule gives that table a full vertical grid while every
  non-resizable table in the same dashboard shows none — two grid languages side by side. Drawing
  it on the header makes every table identical.
  (b) **No trailing rule past the last column.** Suppressing it by `:last-child` is correct only
  while the header's last cell *is* the last data column. A split header (§7.2.15) appends a
  non-data **gutter column** of class `.ds-gut` (hidden, `aria-hidden`) to absorb the scrollbar
  width; that gutter then becomes `:last-child`, so `th:last-child::after{display:none}` silently
  slides the suppression off the real last column and a spurious rule appears between the last
  column and the gutter — exactly above the scrollbar. The suppression MUST cover the last **two**
  cells (`th:nth-last-child(-n+2)::after{display:none}`) so the gutter and the last data column
  are both rule-free.
  (b2) **A grouped header's spanning cells carry no rule.** The rule is an `::after` on the header
  cell, so on a two-level header (§7.2.9) it also fires on the `colspan` **group** cells — drawing
  a rule at a non-leaf boundary, in the middle of a merged span. Suppress it with
  `th[colspan]::after{display:none}`; the leaf row's cells still carry their rules, so every leaf
  column edge stays visible while the group bands stay clean.
  (c) Where the freeze boundary meets the header it is *already* one of the column rules, so the
  freeze shadow is dropped on the header — **one line per boundary, never two**.
  (d) The body carries **no** vertical rules: the grid stays open so the eye can scan a row without
  interruption. The only vertical rule below the header is the freeze boundary.
  (e) **The title band and the header row are one navy surface, but they are not the same element.**
  When they are made the same colour (§7.2.15, point 1) the header area otherwise has **no visible
  horizontal rule** — the only rule that existed (the title-band bottom border) was deliberately
  removed to merge the two, and the header's own bottom rule sits on the navy→white boundary where
  the colour change already separates them. A **1 px horizontal rule in the head-rule colour
  (`--ds-head-rule`, white 38 %) MUST therefore be placed on the title band's bottom edge**, so the
  header area reads as a title on top of a header rather than one solid block. Consistency: every
  rule inside the navy block (column rules + this band divider) uses the head-rule colour; the
  navy→white boundary uses the grey `--border` already on `thead th`.

#### 7.2.3 Row typography tokens — the grid discipline (NORMATIVE)
A data table is a **grid**, not a flow of text. Row height MUST be uniform and MUST NOT be
derived from cell content. A spreadsheet achieves this by keeping row height constant and letting
content overflow; HTML tables do the opposite by default, so it MUST be imposed explicitly.

| Token | Value | Applies to |
|---|---|---|
| `--ds-row-h` | `40px` | every body row |
| `--ds-head-h` | `40px` | `thead th` — MUST equal `--ds-row-h` |
| `--ds-cell-fs` | `12px` | every cell, header and body, with **no exceptions** |
| `--ds-cell-lh` | `20px` | every cell |
| `--ds-rule-w` | `1px` | **every** rule in the table — rows, columns, freeze boundary. Never a second value (§7.2.2) |
| `--ds-rule-c` | `var(--border)` | a rule on a **light** surface — row rules, freeze boundary |
| `--ds-head-rule` | `rgba(255,255,255,.38)` | the column rule on the **navy header**, at rest |
| `--ds-head-rule-hi` | `rgba(255,255,255,.7)` | the same rule on hover / while resizing |
| `--ds-grip-w` | `6px` | the resize hit area on a header's right edge (§7.2.13) |
| `--z-cell` | `0` | plain `td` — base layer (§7.2.5) |
| `--z-pinned` | `2` | pinned `td` |
| `--z-head` | `3` | header `th` |
| `--z-pinned-head` | `4` | pinned header `th` — top layer |

Rules:
1. **One font size and one line-height per table.** No cell may override `font-size` or
   `line-height`. A chip, badge, `<code>`, icon or status class MUST inherit both.
2. **Single line with ellipsis.** Body cells MUST be `white-space:nowrap; overflow:hidden;
   text-overflow:ellipsis`; the full value goes in `title` or the row drill-down (§4.4).
   Multi-line content is permitted only inside an expanded drill-down, never in a body row.
3. **Uniform height is enforced, not hoped for**: `td{height:var(--ds-row-h)}`. Content MUST NOT
   be allowed to grow the row.
4. **Dense variant.** `.ds-table.compact` (all-numeric cross-tabs) MAY use `--ds-row-h:32px` with
   `padding:4px 8px`, but MUST still satisfy rules 1–3.
5. **Header and body heights MUST match**; mixing them is a defect.

#### 7.2.4 Status glyphs, chips and inline elements (NORMATIVE)
- **A chip / status / severity class MUST NOT be applied to `<td>` or `<th>`.** Setting
  `display:inline-block` (or any non-`table-cell` display) on a cell removes it from the table
  formatting context: the browser wraps it in an anonymous cell, and `padding`,
  `vertical-align`, column width and the 1 px `border-bottom` all silently change meaning. Chips
  belong on an **inner `<span>`**.
- **Emoji MUST NOT be used as a status glyph in a table.** Colour-emoji glyphs resolve to a
  fallback font whose ascent / descent exceed the text font's, inflating the line box beyond the
  declared `line-height` and pulling the glyph off the baseline; the three common severity glyphs
  (`⛔ U+26D4`, `⚠️ U+26A0+FE0F`, `ℹ️ U+2139+FE0F`) each have **different metrics**, so rows
  differ from one another. Use a **fixed-size inline SVG** (14×14, `role="img"` +
  `aria-label="Error | Warning | Info"`), which also removes the screen-reader reading
  inconsistency across platforms.
- **`<code>` inside a table MUST be reset** (`font:inherit` plus an optional chip background). The
  UA `monospace` default resolves to a different size and width and re-introduces the mismatch.
- **Icons are sized in px**, never left to inherit font metrics.

#### 7.2.5 Structural prerequisites (NORMATIVE for L2 / L3)
Every L2 / L3 table MUST be built as `<colgroup>` (one `<col>` per **leaf** column) plus
`table-layout:fixed`. This is the shared prerequisite for pinned columns, column resize,
windowed rendering and single-line ellipsis. Cross-tab headers using `colspan` / `rowspan`
(§7.2.9) MUST still emit one `<col>` per leaf column.

Two construction rules that fail **silently** when got wrong, and have done so in practice:
- **`<caption>` MUST be the first child of `<table>`, before `<colgroup>`.** A rebuild that
  anchors insertion on `firstChild` will otherwise drop or duplicate it.
- **A `<colgroup>` created by assigning `innerHTML` MUST be built inside a `<table>` container,
  not a `<div>`.** The HTML parser discards `<colgroup>` / `<col>` outside a table context, so the
  widths vanish and `table-layout:fixed` then distributes columns by content — producing precisely
  the drift described below.

**The table MUST also be given a DEFINITE width** (`style.width`, not merely `min-width`).
`table-layout:fixed` only honours `<col>` widths when `width` is definite; with `width:auto`
the browser falls back to content-driven sizing, so wide-content columns (e.g. *Notes*,
*Document Title*) absorb space from every other column and **rendered widths silently drift
from the declared ones** — in one measured case by up to 132 px on a single column while the
table total stayed identical.

**Every column MUST have an explicit width — leave no `<col>` on `auto`.** Under
`table-layout:fixed` an `auto` column receives only the **remainder** (table width − sum of the
fixed columns), and that remainder is **clamped at zero**: once the fixed columns' sum reaches the
table's width, the `auto` column disappears entirely rather than forcing a horizontal scroll.
Measured on a 13-column table whose fixed columns totalled 1370 px inside a 1300 px panel — the
`auto` *Document Title* column rendered **0 px wide** and its content vanished. The same mechanism
destroys a many-column table left on `auto`: a 27-column grid sharing the remainder gave every
contract field **39 px**, truncating each to ~5 characters. Give each column a px width and let the
table overflow its scroller horizontally; that is the correct behaviour for a wide grid.

**Pinned-column offsets MUST be measured from the rendered grid, not summed from declared
widths.** Where those two disagree, the frozen columns are pulled apart and the resulting
**gap reads as a thick divider whose width changes as the user drags** — a layout bug
presenting as a visual one. Measure each header cell's rendered width and accumulate.

**Pinned-column stacking — a four-layer ladder.** A pinned cell overlaps the scrolling content,
so the layers MUST be declared explicitly (these refine the generic stacking list in §13 for the
table context):

| Layer | Token | Value |
|---|---|---|
| plain `td` | `--z-cell` | `0` |
| pinned `td` | `--z-pinned` | `2` |
| header `th` | `--z-head` | `3` |
| pinned header `th` | `--z-pinned-head` | `4` |

**A pinned cell MUST declare an OPAQUE background for every state the row can be in** — default,
zebra (`tbody tr:nth-child(even) td.ds-pinned`) and `:hover`. A pinned cell that only sets
`background:#fff` will let the scrolling columns show through it on zebra rows and on hover,
which is the single most common pinned-column defect.

#### 7.2.6 Sorting contract (L2, NORMATIVE)
1. **Trigger**: a real `<button type="button">` inside the `<th>` — never `th.onclick`. Enter /
   Space MUST work and the control MUST be reachable by Tab.
2. **Three states**: unsorted → ascending → descending → **unsorted**. A third state returning to
   the natural order is mandatory; a two-state toggle traps the user inside a sort.
3. **Announce**: `aria-sort="none | ascending | descending"` on the `<th>`, kept in sync.
4. **Affordance**: a `▴` / `▾` indicator. Unsorted columns show a low-opacity indicator on hover
   and focus; **only the active sort column** shows a solid one. Sortable headers MUST show
   `cursor:pointer`.
5. **Default sort**: the table MUST open sorted by the column most relevant to the user's task
   (for overdue / date-driven lists: soonest or most-delayed first) and MUST display that state.
6. **Type-aware comparator** — a single string comparator is a defect:

   | Type | Ascending |
   |---|---|
   | `num` | lowest → highest (numeric, not lexical: `9` before `100`) |
   | `date` | earliest → latest (real date compare, not string) |
   | `text` | `localeCompare`, number-aware (`Doc-2` before `Doc-10`) |
   | `enum` | **business order**, e.g. `APP → AWC → REJ → NAP`, never alphabetical |
   | `bool` | `true` first |

7. **Empty values sort last** in both directions and MUST NOT flip. **A rendered "no value"
   placeholder counts as empty**: where a blank cell is displayed as a dash (`—`), the comparator
   MUST treat that dash as empty too. Otherwise the blank row floats to the top of an ascending
   sort in the table that renders the dash while it sinks to the bottom in the one that leaves the
   cell truly blank — the same record sorting differently in two tables.
8. **Deterministic**: ties MUST fall back to a stable secondary key (e.g. the record id).
9. **Multi-sort** (optional): Shift+click appends a secondary key; show an order badge.
10. **Persistence**: sort state SHOULD persist through `getPref` / `setPref` (§7.5) like other
    view preferences.
11. **Export parity**: the export MUST use the **same** sorted array the renderer used (§7.2.10).
12. **A re-rendered header MUST use event delegation.** Sorting rewrites the `<thead>` to refresh
    `aria-sort` and the indicator. Handlers bound per-button (`btn.onclick`) are destroyed by that
    rewrite, so **only the first click ever works** — the second click lands on a detached button
    that cannot bubble, and the sort silently stops responding. Bind ONE delegated listener on a
    stable ancestor (the scroll container) and match `e.target.closest('.sort-btn')`.
13. **Cross-tab (matrix) sorting** — a cross-tab is not a flat record list; sorting it as one
    breaks the report:
    (a) the **TOTAL row MUST stay last** and MUST NOT be a sortable row — keep it in `<tfoot>`,
    which is never part of the sorted `<tbody>`;
    (b) **drill-down sub-rows MUST follow their parent**, re-inserted from the *sorted* order,
    never from the source order;
    (c) handlers bound to the body (expand / drill) MUST be re-bound after the body is rebuilt.

#### 7.2.7 Filtering contract (L2, NORMATIVE)
- **The two scopes MUST be visually distinguishable.** A *data-source* filter (top-bar search /
  dimension popover) re-scopes the whole dashboard; a *table-scope* filter affects only that
  table. Users routinely confuse them, so the control MUST say which it is (label or placeholder,
  e.g. *"Filter entire dashboard…"* vs *"Filter this table"*).
- **The control shape follows the column type**: text → debounced contains (≥ 300 ms); enumerated
  → multi-select facet **with counts, derived from the current data** (never a master list);
  numeric → `≥` / `≤` or a range; date → a date range.
- **Feedback**: show `N of M rows` in the control row, highlight matched text, mark filtered
  column headers, provide a single "Clear all", and render the `.empty` state when `N = 0`.
- **The empty state MUST say why.** "No overdue documents" and "No overdue documents match the
  current filter." are different statements; showing the unconditional one after the user applied
  a filter reads as data loss. Pick the wording from whether a filter is active.
- **Export parity extends to filtering**: the export MUST read the same *filtered and sorted*
  array the renderer used — not the source rows (§7.2.10). Filter and sort compose: filter
  first, then sort, and both feed the one array.
- **A popover MUST NOT bind a document listener per instance.** Table renderers run again on every
  re-render, so a per-popover `document.addEventListener` strands another listener each pass, and
  that listener captures the full row array — with a 20 k-row table that is an out-of-memory
  crash, not a slow leak. Bind ONE delegated pair for all popovers, track only the **open** ones,
  and prune entries whose panel was replaced by a later render (`isConnected`).
- **Build the popover contents lazily, on first open.** Every enumerated column costs a full pass
  over the rows plus a node per distinct value; doing that for a popover the user never opens is
  pure waste on a hot render path.
- Excluded values (e.g. Deleted / Void / Superseded stages) stay **listed but deselected**, per
  §7.5. This convention belongs to the *data-source* filter: a table-scope facet lists only what
  the rows it was given actually contain.

#### 7.2.8 Long lists: windowing (L3, NORMATIVE)
§4.3 forbids truncating rows, so a table whose *columns × rows* product makes full
materialisation expensive MUST render **only the visible window** (overscan ≈ 8 rows), using
spacer rows to preserve total scroll height. The control row still reports the **full** count
(§4.3) and MAY additionally report how many rows are materialised, so the mechanism is
inspectable during review. Sorting, filtering and exporting all read from the same full array —
windowing is a rendering detail and MUST NOT leak into the data layer.

#### 7.2.9 Cross-tab / matrix tables (`.matrix`) — different rules
A cross-tab (e.g. *Per-Discipline Summary Matrix*) is a pivot, not a detail list, and MUST NOT
inherit the detail-table sort rules:
1. The **totals row (`<tfoot>`) is pinned last** and MUST NEVER participate in sorting.
2. **Drill-down child rows (`.sub`) follow their parent** and MUST NOT be re-sorted into the
   parent sequence.
3. Grouped two-row headers are allowed and MUST map to one `<col>` per leaf column.
4. Every header cell — **including a spacer / drill cell** — MUST have an accessible name
   (`aria-label`); an empty `<th>` is a defect.

#### 7.2.10 Export consistency (NORMATIVE)
A table export (CSV / PNG / copy) MUST contain **exactly the rows on screen** — same filter, same
sort, same window scope. Rendering and exporting MUST read from **one** `sortedRows()` function;
"render sorts, export doesn't" is a defect. See §7.8.

#### 7.2.11 Print (NORMATIVE)
`.tableScroll` caps height at 340 px, so it MUST be released in print:
`@media print{ .tableScroll{max-height:none!important; overflow:visible!important} }`, and any
pinned-column `position:sticky` MUST be neutralised — otherwise every long table prints as a
340 px clipping. The sticky elevation of §7.2.14 MUST be dropped in the same block. See §10.

#### 7.2.12 Table anti-patterns (additive to §11)
| Anti-pattern | Consequence |
|---|---|
| A chip / status / severity class applied to `<td>` | the cell leaves the table formatting context; padding, alignment, width and borders silently change |
| Emoji used as a status glyph | fallback-font metrics inflate the line box and differ per glyph → uneven row heights, off-baseline icons |
| More than one font size or line-height inside a row | baselines cannot align |
| Cell content allowed to wrap and grow the row | the grid degrades into a ragged accordion |
| Sort bound to `th.onclick` | keyboard-inaccessible; no `aria-sort`; no focus |
| Two-state sort toggle | the user cannot return to the natural order |
| One string comparator for all columns | numbers and dates sort wrongly |
| A per-button `onclick` on a header that is re-rendered per sort | only the **first** click works — the rewrite detaches the button, so the second click cannot bubble and the sort silently dies (§7.2.6 (12)) |
| Treating a rendered dash (`—`) placeholder as ordinary text | the blank row floats to the top of an ascending sort in one table and sinks in another (§7.2.6 (7)) |
| Sorting the totals row, or orphaning drill-down children | cross-tab integrity broken |
| A document click / keydown listener bound **per popover instance** | each re-render strands another listener capturing the full row array — out-of-memory on a 20 k-row table (§7.2.7) |
| Building every popover's facets eagerly at render time | a full pass per enumerated column plus a node per value, paid for popovers never opened (§7.2.7) |
| An empty state that does not distinguish "no data" from "filtered out" | reads as data loss after the user applies a filter (§7.2.7) |
| A bounded scroller left capped in print | the PDF shows a 340 px clipping |
| A zero-row `<tbody>` with no `.empty` state | the panel looks broken |
| A divider whose width changes on hover or during drag | the grid appears to resize itself; reads as a rendering glitch |
| A bespoke divider width or colour (e.g. a 2 px freeze boundary, or a tinted shadow) | breaks the eye's horizontal scan and violates the one-width / one-colour rule |
| Two dividers stacked on one boundary (freeze rule + resize cue) | the boundary reads as a double line |
| `table-layout:fixed` with `width:auto` (only `min-width` set) | rendered column widths drift from the declared ones, so pinned columns are pulled apart and the gap reads as a thick divider that changes width while dragging (§7.2.5) |
| Any `<col>` left on `auto` beside fixed-width columns | the auto column gets only the clamped-at-zero remainder and disappears once the fixed columns fill the table width — its content vanishes instead of producing a horizontal scroll (§7.2.5) |
| A many-column grid distributing the remainder across `auto` columns | every column becomes unusably narrow (27 columns → 39 px each); give each a px width and let the table scroll horizontally (§7.2.5) |
| A column rule left on a grouped header's `colspan` cell | draws a vertical line through the middle of a merged span at a non-leaf boundary; suppress `th[colspan]::after` (§7.2.2 (b2)) |
| Pinned offsets summed from declared widths instead of measured from the rendered grid | same visible gap; the error accumulates across columns (§7.2.5) |
| A pinned cell with only one background state | scrolling columns show through it on zebra rows and on hover (§7.2.5) |
| A column rule drawn on the resize grip rather than the header cell | only resizable tables get a grid; the rest look different (§7.2.2) |
| Permanent elevation on the freeze boundary | at `scrollLeft 0` nothing is hidden, so the shadow falsely claims hidden content to the left (§7.2.14) |
| Elevation on a navy header over a white body | maximum contrast already; the shadow reads as heaviness, not depth (§7.2.14) |
| A light title band above a navy header row | the title visually detaches from the table it names; the card reads as two components (§7.2.15) |
| A vertical scrollbar running alongside the header row | implies the header itself scrolls; the header belongs to the data, not to the scroll (§7.2.15) |
| Split-header fragments sized independently | the header collapses or drifts and the columns visibly misalign — sync the header fragment to the scroller's `clientWidth` (§7.2.15) |
| Split-header re-synced on window `resize` only | a scrollbar appearing or disappearing changes `clientWidth` with no resize event; use a `ResizeObserver` on the scroller (§7.2.15) |
| Split-header fragment sized to the scroller's `clientWidth` | the columns align but a white notch one scrollbar wide is left at the top-right of the header; use the border box plus a gutter column (§7.2.15) |
| Split-header cells set to `position:static` | the column rules are an `::after` positioned against the cell, so every header column rule silently disappears; use `relative` (§7.2.15) |
| Split-header column-rule suppression tied to `:last-child` | a split header appends a non-data gutter column which becomes `:last-child`, so the suppression slides off the real last column and a spurious rule appears between it and the scrollbar; cover the last **two** cells (§7.2.2 (b), §7.2.15) |
| Title band and header row made the same navy with the band's bottom border removed | the header area then has no visible horizontal rule and reads as one solid block; the band MUST keep a 1 px head-rule-colour bottom border (§7.2.2 (e), §7.2.15) |
| Dropping the split header's bottom rule | nothing separates the header from the first body row; the rule used to come for free from the sticky header's shadow (§7.2.15) |

#### 7.2.13 Column controls — visibility, width, order (L3, NORMATIVE)
L3 is **required** above 12 columns (§7.2.1), but the three column controls are not equal in
value: **hiding 19 of 27 columns helps far more than hand-dragging 27 widths**, so build them in
this order.

1. **Pinned (frozen) columns.** The identity column(s) — the value that tells the user *which
   record this row is* — MUST be pinned left so it survives horizontal scrolling. Pinning is a
   property of the **column**, not of its position, so it MUST survive hiding and reordering.
   Stacking and backgrounds per §7.2.5.
2. **Column chooser.** A `Columns (N)` control listing every column with a checkbox.
   - It MUST report how many columns are hidden (e.g. `Columns (27) · 19 hidden`) — a hidden
     column the user has forgotten is indistinguishable from missing data.
   - It MUST offer at least one named preset (e.g. *Core 8*) so the user can get back to a sane
     view in one click.
   - State MUST persist through `getPref` / `setPref` (§7.5).
   - Hiding MUST NOT renumber the remaining columns' `<col>` elements: rebuild the `<colgroup>`
     from the *visible* specs and re-run `repin` (§7.2.5).
3. **Column resize.**
   - Hit area `--ds-grip-w` = 6 px on the header's right edge, `cursor:col-resize`; **≥ 24 px on
     touch**.
   - Minimum width 60 px — a column MUST NOT be draggable to nothing.
   - **Double-click = auto-fit**, measured against the rendered rows (header label included),
     capped at ≈ 520 px.
   - Widths persist and MUST ship with a **“Reset widths”** action.
   - **Resizing changes the column width and nothing else.** The divider stays `--ds-rule-w`;
     the grip MUST NOT grow, move offset, or change width on hover or during drag (§7.2.2).
   - **During the drag the whole page MUST stay in resize mode**: `.ds-resizing` on `<body>` sets
     a global `cursor:col-resize` and `user-select:none`. Without it the pointer flips back to the
     text I-beam whenever it crosses a non-grip cell, and the drag paints a text selection across
     the table.
   - The grip SHOULD carry a `title` (e.g. *“Drag to resize · double-click to auto-fit”*) so the
     affordance is discoverable before the user hovers it.
4. **Column order (optional).** If reordering is offered, it MUST NOT be drag-only: provide a
   keyboard-operable alternative (move-left / move-right control), or omit the feature.

#### 7.2.14 Sticky elevation (NORMATIVE)
A sticky element is *floating* only while something is actually passing beneath it. Elevation
MUST therefore be **scroll-aware**, never permanent.

- **Freeze boundary (horizontal scroll).** While `scrollLeft > 0` the last pinned column MUST gain
  a soft shadow on its right edge, layered *outside* the 1 px rule so the two do not fight:
  `box-shadow: var(--ds-rule-w) 0 0 var(--ds-rule-c), 8px 0 10px -6px rgba(15,45,82,.28)`.
  At `scrollLeft === 0` the shadow MUST be **absent** — nothing is hidden yet, so a permanent
  shadow falsely claims hidden content to the left. Header cells carry the elevation **only**,
  because the header already has a column rule on every cell (§7.2.2 corollary c); body cells keep
  both. Cost is one *passive* scroll listener per scroller that toggles a class — nothing more.
- **Header row (vertical scroll).** **No elevation.** A navy header against a white body is already
  maximum contrast, so the 1 px bottom rule is sufficient; a shadow inside a 340 px bounded
  scroller reads as heaviness rather than depth. This is a deliberate, documented exception to the
  generic “sticky headers should show elevation” advice.
- **Print.** Elevation MUST be dropped (§7.2.11) — it signals live scrolling, which has no meaning
  on a static page.

#### 7.2.15 Bounded tables — title band and scroll position (NORMATIVE)
A table that lives inside a card with its own title band is read as **one** component, and the
scrollbar is expected to belong to the **data**, not to the header.

1. **The title band and the header row are the same surface.** The band above the table MUST use
   the *same* background (`--navy`), the *same* foreground (`#fff`) and the *same* type
   (`12px / 600`) as `thead th`. A light band sitting above a navy header reads as two unrelated
   components and visually detaches the title from the table it names. This unification removes the
   band's bottom border (which was the header area's only horizontal rule) and the header's own
   bottom rule sits on the navy→white boundary where colour already separates them — so a **1 px
   horizontal rule in the head-rule colour (`--ds-head-rule`) MUST be placed on the title band's
   bottom edge**, else the header area reads as one solid block with no title/header division. See
   §7.2.2 (e).
2. **The vertical scrollbar MUST start below the header row, not beside it.** A scrollbar that
   runs alongside the header implies the header itself is scrollable content. Achieve this with a
   **split header**: the `<thead>` is emitted as its own `<table>` **outside** the `.tableScroll`,
   and only the body fragment scrolls. The sticky-header-inside-the-scroller pattern cannot
   satisfy this — a scrollbar always spans its own scroll container.
3. **The two fragments MUST share one column grid, AND the header must still reach the card
   edge.** Both are `table-layout:fixed` carrying the **same** `<colgroup>` for the data columns.
   Sizing the header fragment to the scroller's `clientWidth` aligns the columns but leaves a
   **white notch one scrollbar wide at the top-right** — measured at 15 px — because the
   scroller's border box is wider than its client box. So: size the header fragment to the
   scroller's **border box** (`offsetWidth`), and give the header row a trailing **gutter column**
   whose width is the scrollbar width (`offsetWidth − clientWidth`). The navy then runs over the
   scrollbar area and the data columns still line up exactly.
4. **The gutter column is not a column.** It carries no heading, is `aria-hidden`, has no padding
   and no bottom rule. Because it is the **last cell**, the column-rule suppression of §7.2.2 (b)
   must cover the last *two* cells (`th:nth-last-child(-n+2)::after{display:none}`) so the gutter
   **and the last data column** are both rule-free — a `:last-child`-only rule would suppress only
   the gutter and leave a spurious rule between the last column and the scrollbar.
5. **The header fragment MUST have a CSS fallback width of `100%`.** If script does not run, a
   fixed-layout table with no definite width collapses to its fixed columns only.
6. **Re-sync on scroller box change, not on window resize.** A vertical scrollbar appearing or
   disappearing changes `clientWidth` **without** any window `resize` event, so a resize listener
   alone leaves the columns misaligned after a filter changes the row count. Use a
   `ResizeObserver` on the scroller (with a graceful no-op where it is unavailable).
7. **Re-base the header cells, and keep BOTH of their rules.** The fragment has no scrolling
   ancestor, so the global sticky-header rule no longer applies — but its cells MUST still be
   `position:relative`, because the column rules of §7.2.2 are an `::after` positioned against
   the cell: setting them `static` silently removes every column rule in the header. The header's
   **bottom rule** MUST also be kept — it is what separates the header from the first body row,
   and in an unsplit table it arrives for free from the sticky header's shadow. The column-rule
   suppression MUST still cover the last two cells (point 4 / §7.2.2 (b)): the gutter does not
   absorb the spurious rule that would otherwise appear past the last data column.
8. **Accessibility of a split table.** The `<caption>` lives on the **header** fragment (it comes
   first in reading order and carries the column names); the body fragment carries an
   `aria-label` naming it as the data rows. A split table is two tables to a screen reader —
   that is the accepted cost of putting the scrollbar in the right place, and it MUST NOT be
   papered over by hiding the header fragment, which would remove the column names entirely.

### 7.3 Status (shared principle)
- **Icon + Text + Colour** for every status (§9). Each dashboard owns its vocabulary.
- Example rendering: `⚠ Error`, `✓ on track`, `✕ behind`.

### 7.4 Charts (SVG)
- Serialise to PNG-safe literals (CSS vars do not resolve in exported SVG):
  navy `#0F2D52`, blue `#1E88E5`, green `#2E7D32`, amber `#F9A825`, red `#C62828`,
  grey `#B8C2CC`, grid `#EDF1F5`.
- S-curve: **red dashed** = **Start** (project start, workbook `Code!B6`, x-axis origin only); **grey dashed** (`#B8C2CC`, dash `2,2`) = **Today** (operational as-of = the viewer's local system date; see §3.8 rule 6). The x-axis is **anchored at the earliest document date** (same anchor rule as the PPP dashboard's S-curve), so documents dated before the project start still plot (to the left of Start).
- **Combined bar + cumulative charts share one y-scale** (§4.2) — never add a second value
  axis. Plot area therefore reserves no right-side axis padding.
- **Categorical colour (bar & pie)**: every category gets its **own** colour — a bar chart must
  never render all bars in one flat accent colour. Both `svgHBar` and `svgPie` fall back to the
  shared categorical palette (`PIE_COLORS`, 12 entries) indexed **by position**, so a given
  category keeps the **same colour when toggling bar ↔ pie**. An explicit semantic colour on an
  item (e.g. status counts) always overrides the palette. Colours cycle when there are more
  categories than palette entries.
- Period window: dual From/To range control + range message (no Reset — drag to adjust, §7.9).
- **No duplicate legend**: bar and pie charts label each bar / slice **inside the SVG** (colour
  swatch + category name + value drawn as part of the chart). Do **not** also render an HTML
  legend below the chart — that duplicates information the chart already carries and steals
  vertical space. A legend below the chart is only used when the chart type genuinely cannot
  show labels inline.
- **Legend layout (multi-series curve, grandfathered):** when a legend *is* required — e.g. the
  PO/MDL S-curve with Planned / Forecast / Actual bars plus their `Cum. …` lines — it is rendered
  as **one left-aligned row**, laid out sequentially from the left edge (bar swatches as small
  filled rects; cumulative lines as short dashed segments, matching their dash pattern in the
  plot). It is **never** two separate rows, and the items are **not** spread evenly across the
  plot width. Both dashboards use the identical pattern (PPP `#poChart` is the reference).

### 7.5 Filters / Dropdown / Segmented control
Two selection patterns — pick by interaction:

- **Native select** (`.inter-sel`): single-choice picker (e.g. breakdown dimension).
  12 px / 600, 1px `--border`, radius 8–9 px, white surface, `--ink` text; `:focus-visible`
  2 px `--blue` ring; `max-width:260 px`.
  **Mandatory:** every native `<select>` in any dashboard MUST carry `.inter-sel` (or `.inter-sel.is-attached` for the search-column picker). Bare / unstyled `<select>` and dashboard-specific select classes (e.g. `base`, `month-select`) are non-compliant — alias them to `.inter-sel` rather than introducing new classes.
- **Custom dropdown menu** (`.tf-btn` + `.tf-panel`): multi-select filter (e.g. item-category).
  Trigger is a text button ending in `▾`; popover is 1px `--border`, radius 8 px, subtle
  shadow, `min-width:220 px`, `max-width:min(340 px,90vw)`, `max-height:320 px` scroll,
  options ellipsis on long labels. Trigger carries `aria-expanded` + `aria-controls`.
- **Segmented control** (`.seg`) — **the standard single-choice selector** for mutually exclusive
  options (chart type, horizon, view switch). Use it instead of a dropdown when the options are
  few (2–6), short and always visible. Full contract below.
- Generic filter panel: 1px border, radius 8 px, max-width with ellipsis on long labels.

#### Top-bar filter contract (individual buttons) — rev 2026-10-10
Standardised across dashboards on the **PPP filter design** (master "All" checkbox + "None selected"
empty state + `N of M selected` badge). Filters are surfaced as **one trigger per dimension** in the top
title bar — never a single combined "Filters" button:

- **Cap: two filters** shown at once. Each is a `.tf-btn` inside its own `.tf-wrap` (so its
  `.tf-panel` anchors beneath that trigger), carrying `aria-expanded` + `aria-controls`.
- **Trigger label** = dimension name + a count badge:
  - **`All [dimension]`** when every option is selected (e.g. `All Discipline`);
  - **`N of M selected`** when a subset is selected;
  - **`None selected`** when nothing is ticked.
  The trigger takes `.is-filtered` (accent border/text) whenever the selection is **not** "All" — this is
  the *only* filter-state indicator.
- **Panel order**: a **single master "All [dimension]" checkbox at the top** (e.g. `All Discipline`),
  then the option checkbox list, then the dismiss hint (below). The master checkbox selects/deselects
  **every** option in one click. **No separate Clear button** — unchecking the master (or every
  individual option) is how the selection is emptied. **No search box.** The panel is deliberately
  minimal; the only permitted text beyond the options is the one-line dismiss hint.
- **Dismiss hint (required)**: directly under the option list, a single muted line — e.g.
  *"Changes apply when this list is closed."* — explains that selections are committed only when the
  dropdown is dismissed (see the deferred re-render rule below). This is the **only** explanatory text
  allowed in the panel.
- **No global "Clear all"** button in the bar; emptying a dimension is done via its master checkbox.
- **Excluded values are not offered.** Values that are never counted (MDL: `Deleted`, `Void`,
  `Superseded`) are omitted from the option list. The dashboard's existing exclusion rule remains
  the single source of truth — there is **no separate "include excluded" toggle**, so two controls
  can never disagree about the same selection.
- **Empty selection = zero rows.** With the master (and all options) unchecked the badge reads
  `None selected` and the dashboard shows an **empty** result — it never falls back to "no filter /
  show everything" (this corrects PPP's I-57 behaviour; PPP is being brought into line).
- **Filters combine (AND) and update atomically in one pass** — all dimensions are read from one
  state object and every change re-derives the whole dashboard. A dimension must never update in
  isolation, and no second mechanism may govern the same selection.
- **One dropdown open at a time**; closes on outside click or `Escape`.
- **Re-render is deferred until the dropdown closes.** Toggling the master checkbox or an option updates
  the selection state and the trigger badge **immediately**, but the dashboard data panels are **not**
  re-derived on every individual toggle. The (potentially expensive) re-render fires **once**, when the
  dropdown list is dismissed — by outside click, `Escape`, opening a different dropdown, or toggling the
  trigger shut. This keeps multi-select filtering of large datasets smooth (no re-derive on each click)
  while still reflecting the final selection the instant the list closes. The single combined-pass rule
  above still holds: closing the list re-derives the whole dashboard from the one state object. The
  dismiss hint above is what tells the user why the dashboard does not update live.
- **Dimensions are dashboard-specific**: MDL = **Discipline + Stage**; PPP = **Category** (+ `Status`
  rendered as a `.seg`, not a dropdown — see §7.5 segmented control). PPP's shipped filter currently
  deviates (immediate re-render, no dismiss hint, `.active` class instead of `.is-filtered`, and I-57
  empty = all) — bring PPP into line with these rules (**PPP workplan I-75**).

#### Segmented control contract (`.seg` + `data-key` / `data-t`)
Standardised on the PPP implementation. Every segmented control follows this exact mechanism:

```html
<div class="seg" data-key="<preferenceKey>" role="group" aria-label="<what it selects>">
  <button type="button" data-t="bar" class="on" aria-pressed="true">Bar</button>
  <button type="button" data-t="pie" class=""     aria-pressed="false">Pie</button>
</div>
```

| Part | Rule |
|---|---|
| `data-key` | The **preference key** the choice is stored under. |
| `data-t` | The **value** of that option (each `button`). |
| `role="group"` + `aria-label` | Names the group for screen readers. |
| `.on` + `aria-pressed` | Marks the active segment; both must be kept in sync. |

- **No per-instance wiring.** Controls are declared in markup (or rendered as a string) with only
  `data-key` / `data-t`; behaviour comes from **one delegated listener** on the app root that
  reads `e.target.closest('.seg')` → `data-key`, then `closest('button')` → `data-t`, calls
  `setPref`, and re-renders **only the owning component**. Adding a control needs no new JS.
- **One key per independent control.** Controls that must not move together get different keys —
  PPP stores chart type **per chart card** (`inter-packages`, `inter-data`) so switching one chart
  never flips another (§4.1). Never share a key across controls unless they are intentionally
  linked.
- **Namespace by prefix** when controls belong to a group: `inter-<cardId>` for chart cards,
  `look` for the look-ahead horizon (§4.3), `ovlStage` for the overdue-by-stage selector. A prefix
  also lets the delegated handler route the re-render (e.g. any `inter-*` key re-renders the
  interactive chart panel).
- **Single-select only.** A `.seg` selects exactly one option — it is the radio equivalent. Use it
  for "which chart type" / "which horizon" / "which stage"; use the custom dropdown (§7.5) for
  multi-select. PPP's stage filter was **converted from multi-select chips to a `.seg`** for this
  reason: the table now shows **one stage at a time**.
- **Persistence**: `getPref(key)` / `setPref(key, value)` — in-memory `STATE.prefs.chartType` with
  a `localStorage` fallback (`ppp-chart-<key>`), so choices survive reloads. `getPref` returns a
  usable default (`bar`) when nothing is stored.
- **State ↔ DOM sync**: the active segment carries `.on` + `aria-pressed="true"`, and the renderer
  **re-derives them from the stored preference on every render** — a control rebuilt via
  `innerHTML` therefore never shows a stale selection.
- **Validate stored values.** An unknown/corrupt preference falls back to the default instead of
  blanking the view (the horizon validates against its allowed set `1/2/3/4/6`, default `3`).
- **Styling**: §7.1 — inactive = white / **navy** text, active `.on` = **`--navy`** fill / white
  text, inactive hover → `--blue`. Labels are **proper case** (`Bar`, `Pie`, `1m`…`6m`), never
  uppercase; the `.seg` resets `text-transform`/`letter-spacing` so it never inherits the
  uppercase text-action rule when placed inside a `.ctool` row.
- **Options stay short**: 2–6 segments, each 1–2 words. Longer lists belong in a native `select`.

### 7.6 Overlays & Help
- **Help**: the trigger is the `?` icon-btn in the panel title row (§7.7); it opens the centred
  **modal** described in §7.9 (help is a popup window, never an inline disclosure).
- **Toast** (`#toast`): see **§7.10** for the full specification. The toast design is shared by every dashboard (PPP + MDL); only the set of trigger cases differs per dashboard.
- **Error banner** (`#errBanner`): this **is** the unified top warning bar from §3.5 — a single fixed
  top bar that carries both fatal *load* errors (red strip) **and** system / config notices (fatal =
  red, warning = `--amber`, info = neutral). It is not a separate surface. It follows the §3.5 clearance
  rule so it never overlaps content.

---

### 7.7 Icon & Symbol Convention

All dashboards **MUST** use the same glyph for the same control. Do not invent
ad-hoc symbols. This is the single source of truth for UI glyphs (distinct from
per-dashboard *status* symbols, see §1).

| Control | Symbol | State / Notes |
|---|---|---|
| Help / Info | `?` | `icon-btn`, right of panel title; `aria-label` + `title` set; opens the Help modal (§7.9) |
| Collapse / Expand **panel or group** | `−` / `+` | `−` when expanded (click to collapse), `+` when collapsed |
| Drill-down / expand **nested detail** (table row) | `▸` → `▾` | chevron rotates 90° with `aria-expanded` |
| Open **menu / dropdown** (filter, select) | `▾` | static downward chevron |
| Filter | funnel (SVG) + `▾` | `▾` marks an openable menu |
| Chart export — download | `⤓ PNG` (U+2913) | glyph + label on the `.dlBtn` text-action |
| Table export — download | `⤓ CSV` (U+2913) | glyph + label on the CSV text-action (`#vExport`, `#lookExport`) |
| Chart export — clipboard | `⧉ Copy` (U+29C9) | glyph + label on the `.copyBtn` text-action |
| Panel number | `Panel N` | bottom-right corner, 10 px, muted |

**Rules**
- A control type maps to **exactly one** glyph everywhere (no `−` in one place and
  `▾` in another for the same action).
- `−`/`+` = show/hide a section; `▸`/`▾` = reveal nested/drill detail; `▾` (static)
  = open a menu. These three are semantically distinct and intentionally different.
- Primary actions (Copy, Download, Reset, Export, Load another file) use **text
  labels**, not icons, unless horizontal space is critical.
- Every icon button carries `aria-label` + `title`; chevrons use `aria-expanded`;
  decorative glyphs are `aria-hidden` when adjacent text exists.
- Chevrons are rendered from a single CSS/text glyph (`▸` U+25B8, `▾` U+25BE) so
  they stay crisp and consistent — avoid mixing text glyphs with SVG triangles for
  the same metaphor.

### 7.9 Help Modal (`.help-modal`)
Help is a **centred popup**, not an inline box (MDL pattern). One shared modal, opened
per-panel by the header `?` button.
- Overlay: `position:fixed;inset:0;background:rgba(15,23,42,.45);z-index:50;padding:24px`,
  flex-centred. Click outside the box (on the overlay) closes it.
- Box: `background:#fff;border:1px solid --line;border-radius:12px;max-width:680px;
  width:100%;max-height:84vh;display:flex;flex-direction:column;
  box-shadow:0 20px 50px rgba(0,0,0,.25)`.
- Header: `display:flex;justify-content:space-between` with an `h3` title (15 px, `--navy`)
  and a `✕` close button on the right. Body scrolls:
  `overflow:auto;padding:16px 18px;font-size:13px;line-height:1.55;color:#22303f`.
- Body typography: `h4` (13 px `--navy`; first-child `margin-top:0`), `p`/`ul`/`li` spacing,
  `code` (soft bg, `border-radius:4px`), `.def` (soft bg, 3 px `--navy` left border).
- Accessibility: the box has `role="dialog" aria-modal="true"`; **Escape** closes it.
- Content source: a `HELP[id]` map keyed by panel id (title + body HTML); each dashboard
  supplies its own copy.
- The `?` trigger is injected into **every** top-level panel header (MDL attaches one per
  panel), wired to `openHelp(panelId)`.

---

### 7.10 Toast (unified across all dashboards)

> **Rule:** The toast *design* is shared by every dashboard (PPP + MDL). The **only** permitted per-dashboard difference is the set of trigger cases (§7.10.9). No dashboard may alter appearance, position, semantics, behaviour, or variants.

**7.10.1 Purpose.** A toast is a transient, non-modal, auto-dismissing notification that confirms a completed, fire-and-forget action or surfaces a low-priority, time-sensitive notice. It never requires the user to respond and must not interrupt the workflow. It is strictly supplemental — the result of the action must also be observable through the primary UI (status bar or a re-render).

**7.10.2 When NOT to use (both dashboards).** Continuous live state → the fixed status bar (§3.6). A warning / data-quality issue the user must read or act on → inline note / fatal banner (§3.5). A decision or input required → modal (§7.9). Field-level validation → inline on the field. Anything already shown in the status bar → nothing (no duplication / no toast spam).

**7.10.3 Element & semantics.** A single `#toast` live region at the end of `<body>`. Success / Info: `role="status"` + `aria-live="polite"`. Warning / Error: `role="alert"` + `aria-live="assertive"`. `aria-atomic="true"`. Toasts are not interactive targets (no focus, no click handler required for function).

**7.10.4 Position & stacking.** `position:fixed`, horizontally centred (or bottom-right for dense dashboards). `bottom` = status-bar height + gap, so it sits **above** the fixed status bar and never overlaps it. z-index **45** (between the status bar 40 and the modal 50).

**7.10.5 Variants (token-driven, no literal hex).**

| Variant | Token | Icon | Use |
|---|---|---|---|
| Success | `--green` | ✓ | Export / copy succeeded |
| Info | `--blue` | ⓘ | Neutral notice (nothing to export) |
| Warning | `--warn-*` | ⚠ | Recoverable fallback used (clipboard blocked → PNG) |
| Error | `--red` | ⛔ | Action failed |

All colours reference design tokens so they remap with the dark theme; no per-component hex.

**7.10.6 Behaviour.** Auto-dismiss timeout scales with length: base **4 s**, +0.5 s per ~20 characters, capped at **8 s**. **Pause** the timer on hover or keyboard focus; resume on leave. Dismiss on click/`Esc`. **Stack** (newest on top), showing at most **3** at once and queuing the rest — never silently replace an unread toast.

**7.10.7 Motion.** Entrance is a brief fade + slight upward slide. Honour `prefers-reduced-motion: reduce` → opacity only, no transform.

**7.10.8 Content.** ≤ **80 characters**, one line, no technical jargon or codes. Action-oriented phrasing: past tense for confirmations ("CSV downloaded"), present tense for info ("Nothing to export").

**7.10.9 Trigger policy (the only per-dashboard difference).** The trigger *types* are identical on every dashboard (export success, copy success/fallback, empty export, export failure). Each dashboard declares **which named exports** raise a toast; it must not invent a new trigger *type*.

| Trigger event | PPP | MDL |
|---|---|---|
| Chart → Copy: success | ✓ "Chart copied to clipboard" | ✓ |
| Chart → Copy: clipboard blocked → PNG fallback | ✓ "Copied as PNG download" (warning) | ✓ (warning) |
| Chart → Copy: failure | ✓ "Copy failed: …" (error) | ✓ (error) |
| Chart → PNG download: success | ✓ "Downloaded PNG" | ✓ |
| Chart → PNG download: failure | ✓ "Export failed: …" (error) | ✓ (error) |
| Chart → Copy with no SVG | ✓ "Nothing to export" (info) | ✓ (info) |
| Look-ahead CSV: empty | ✓ "Nothing to export" | — (no look-ahead feature) |
| Look-ahead CSV: success | ✓ "Look-ahead exported (N rows)" | — |
| Validation / Issue CSV: empty | ✓ "Nothing to export" | ✓ "Nothing to export" |
| Validation / Issue CSV: success | ✓ "Validation report exported" | ✓ "Issue list exported" / "CSV downloaded" |
| Discipline-matrix CSV: success | — | ✓ "CSV downloaded" |

**7.10.10 Adoption impact.** PPP already has a `#toast` but must be refactored to meet 7.10.3–7.10.7 (token colours, stacking, length-scaled + pausable timeout, error/assertive variant, icon, z-index 45, dismiss). MDL must implement `#toast` from scratch and route its export/copy triggers through it, retiring the inline `.msg` for those cases.

**7.10.11 Acceptance criteria.** (1) `#toast` identical design (token/position/semantics) on PPP and MDL. (2) No literal hex in either toast style. (3) Error path uses `role="alert"`; success/info uses `role="status"`. (4) 3+ rapid triggers stack & queue; none replaced. (5) Timeout scales with length and pauses on hover. (6) Toast never overlaps the status bar at ≥ 320 px width. (7) Each dashboard's triggers match §7.10.9 only.

---

### 7.8 Export / Download actions
All exports are **text-action buttons** (§7.1, type A3), grouped in a `.ctool` / `.ctool-footer` row. (MDL renders them as `.btn-secondary`; PPP as `.dlBtn` / `.copyBtn` — both are the A3 type; the class names differ but the spec'd style is identical.)

| Action | Trigger (class) | Behaviour |
|---|---|---|
| Export CSV | `#vExport` (**`⤓ CSV`**) | Serialises the current data / validation table to `.csv` with a UTF-8 **BOM** (so Excel opens it correctly); filename = project + `- validation report.csv` |
| Export look-ahead CSV | `#lookExport` (**`⤓ CSV`**) | Exports the **look-ahead list as displayed** — same filter, same sort, same horizon — to `.csv` with a UTF-8 BOM; filename = project + `- PO look-ahead <h>m.csv`. Columns mirror the on-screen table |
| Download PNG | `.dlBtn` (`data-svg="<svgId>"`), label **`⤓ PNG`** | Renders the referenced chart SVG to a PNG blob and triggers a file download; filename = project + chart name + `.png` |
| Copy chart | `.copyBtn` (`data-svg="<svgId>"`), label **`⧉ Copy`** | Same PNG written to the **clipboard**; if the clipboard is blocked/unavailable it falls back to a PNG download and shows a toast |

- Label format (MDL): **glyph + space + label**, proper case — `⤓ PNG` (U+2913) and `⧉ Copy`
  (U+29C9). No icons elsewhere; the glyph is part of the label, not a separate element.
- Button order in a tool row matches MDL: `PNG` before `Copy` (exports first, clipboard second).

- Charts MUST serialise to PNG-safe literals (§7.4) so exported colours stay correct.
- CSV string values are double-quoted with embedded quotes escaped (`""`).

### 7.9 Range / Time selection (Period window)
- Component `.sc-win`: a labelled **dual range** — From / To `<input type="range">` sharing one
  domain (e.g. months) — and a **live message** describing the active window. **There is no Reset
  button (rev 2026-10-13):** the window is adjusted **only by dragging From / To**. A
  restore-defaults control merely duplicated what the sliders already do, and the shared `reset`
  styling class made the cluster's buttons indistinguishable to `querySelector('.reset')`, which
  silently bound handlers to the wrong control on **both** dashboards. The window opens at the
  **full range** on every load, so widening the view again means dragging From back to its first
  position. Do not re-add a Reset control here.
- **Every control in a cluster must be independently addressable (mandatory).** Buttons in one
  cluster often share styling classes. Wiring by such a shared class is **forbidden**:
  `querySelector('.class')` binds to the **first** match, leaving the intended control's handler
  unbound or mis-bound. Select by `id` or a dedicated modifier class so each control gets exactly
  its own handler.
- Used on the S-curve panel to scope **which months are shown**: the monthly bars show per-month new counts for the selected window. The cumulative lines are **absolute totals-to-date** (§4.2) and are **never** rebased to the window. The red-dashed (**Start** / project start) and grey-dashed (**Today** / as-of) reference lines stay fixed while the window moves, and the panel shows the range message `Reporting period: … · As-of: {system date}` so the window is never confused with the current-date calculations (§3.8 rule 6). Do **not** append "cumulative within period" — see below.
- **Scope (rev 2026-10-13 — rebasing removed).** The period window affects **only the Issue-Progress
  S-curve** (and its monthly bars) — it selects **which months are shown**. Cumulative lines stay
  **absolute**: they always show the true total-to-date and do **not** change when the window moves
  (§4.2 supersedes the earlier "anchored at the window start" decision of 2026-10-10 / 11). It does
  **not** change the Overdue / Approval / KPI panels, which stay anchored to the as-of (system date,
  §3.8 rule 6). For that reason the "cumulative within period" wording is **retired** — there is
  nothing window-relative left to explain. The global categorical filters (Discipline / Stage) remain
  the single source for filtering the data set; the period is a display window, not a duplicate data
  filter.
- Slider accent uses `accent-color: var(--accent)`.

### 7.10 Chips (filters & summaries)
Two pill uses, both `border-radius:999px`:

- **Filter chip** (`.ovl-btn`, inside `.ovl-filter`): white, 1px `--border`, muted; `:hover`
  → `--accent` border/text; active `.on` → `--accent` fill, white text. Used for multi-select
  filters (e.g. overdue stage).
- **Summary chip** (`.vchip`): coloured by severity — `.e` error (`--error-fg` on `--error-bg`),
  `.w` warning, `.i` info, `.ok` success (`--ok-fg` on `--ok-bg`). Summarises issue counts in
  the Validation panel.

---

## 8. Typography

> **Single standard — applies to EVERY dashboard (PPP + MDL).** There are **no per-dashboard font variations**. MDL must use the exact same font stack, sizes, and weights as PPP (the reference implementation). SVG chart / S-curve text **must inherit the font stack** — never hard-code `Arial` or a reduced stack — **and must be drawn at natural pixel size** (the `<text>` renders at its stated `font-size`; the SVG is **not** stretched with `width:100%`). This matches PPP's **I-70** fix (S-curve) and keeps chart / S-curve text at the intended px instead of being enlarged by responsive scaling.

**Font stack**: `'Segoe UI', system-ui, -apple-system, 'Inter', 'Source Sans Pro', Roboto, Helvetica, Arial, sans-serif`

**Base**: `body` = 13 px, `line-height:1.45`, `-webkit-font-smoothing:antialiased`; colour `--text`.

| Component (class) | Size | Weight | Notes (reference: PPP impl.) |
|---|---|---|---|
| App-bar title (`.ttl`) | 17 px | 600 | project name; **white on navy**; **ellipsis on overflow (single line)** |
| App-bar meta (`.meta`) | 11 px | 400 | white, `opacity:.85` |
| App-bar subtitle (`.sub`) | 12 px | 500 | white, `opacity:.8` |
| Panel title (`h2` / `.card h2`) | 13 px | 700 | **uppercase**, letter-spacing .04 em, navy |
| Sub-panel / Chart title (`h3` / `.panel-head h3`) | 13 px | 700 | navy, **not** uppercase — marks a nested panel |
| KPI Number (`.kpi .v`) | 22 px (compact) / 28 px (hero) | 700 | navy, slight negative letter-spacing |
| KPI / micro label (`.kpi .l`, `.subkpi .l`) | 10 px | 600 | uppercase, letter-spacing .04 em, `--muted` |
| Body text | 13 px | 400 | `--text` |
| Table header (`.ds-table thead th`) | 12 px | 600 | white on navy |
| Caption / label | 12 px | 400–600 | `--muted`; micro-labels (range, chips, badges) may be 11 px |
| Chart / S-curve SVG text | 10–12 px | — | SVG `<text>` inherits `var(--font)`; **explicit `font-size` (10–12 px)**; drawn at **natural pixel size (no `width:100%` stretch)** — per PPP I-70; **never Arial** |
| Button text | 12–14 px | 600 | — |
| Welcome headline (`.wcard h1`) | 25 px | 700 | letter-spacing -.02 em |

---

## 9. Accessibility (mandatory)

1. **Never colour alone.** Every status = Icon + Text + Colour.
2. **Contrast**: body text and statuses meet WCAG AA on their backgrounds.
3. **Focus**: visible `:focus-visible` outline (2 px, `--blue`, offset 2 px) on all
   interactive elements.
4. **Motion**: honour `prefers-reduced-motion` — disable non-essential transitions.
5. **Semantics**: buttons are real `<button>`; tables use `<th scope>`; icons carry
   `aria-label` or are `aria-hidden` with adjacent text.

---

## 10. Responsive & Print

- Breakpoints in §3.4. Tables scroll horizontally on narrow screens; nav collapses.
  A wide table SHOULD pin its identity column while scrolling horizontally (§7.2.1, L3).
- Print: black-and-white friendly, landscape tables, visible status indicators,
  `box-shadow:none`, hide filter toolbars.
- Print: **bounded scrollers must be released** — `.tableScroll{max-height:none!important;
  overflow:visible!important}` and pinned-column `position:sticky` neutralised (§7.2.11).
  Without this, every long table prints as a 340 px clipping, and horizontal scroll prints only
  the visible columns.

---

## 11. Anti-Patterns — DO NOT

| Anti-pattern | Why |
|---|---|
| Apple Bento soft tiles (16–22 px radii, shadow-only separation) | wastes density; wrong register for a data tool |
| Glassmorphism / blur / translucency | MDL explicitly rejects; hurts readability |
| Neon / saturated decorative palettes | unprofessional, fatiguing all-day |
| Consumer-app styling (rounded playful, gradients) | not an enterprise control center |
| Large decorative charts | success criterion is fast exception-spotting, not decoration |
| Colour-only status | fails accessibility |
| A chip / status class on `<td>`, or `display:inline-block` on any cell | the cell leaves the table formatting context — padding, alignment, width and borders silently change (§7.2.4) |
| Emoji as the status glyph in a table | fallback-font metrics inflate the line box and differ per glyph → uneven row heights and off-baseline icons (§7.2.4) |
| Row height derived from cell content | the grid becomes a ragged accordion; the eye cannot scan across a row (§7.2.3) |
| A data table left at L1 (sort / filter absent) | users cannot answer a question the data already contains (§7.2.1) |

---

## 12. Adoption Status

- **PPP Dashboard** — aligned to v1.0 (tokens, font, KPI panel, symbols applied 2026-10-04).
- **MDL Control Center** — source of the tokens; **aligned to v1.0 (~90%+)** after the 2026-10-08/09
  design-standard remediation (workplan I-31…I-50) — see §13.2.9. Only I-35 (left-nav) remains deferred
  per Decision 34; no minor open items; MDL's header uses the accepted **two-row / 3-line-title** variant (2026-10-11, see §3.1 MDL variant + MDL workplan §4.0) and the search box is a single-column, Enter-to-commit control (§7.9 / MDL §4.7) (`.subkpi` documented and chart-card title-style unification closed 2026-10-10). Typography follows the **single §8 standard** (no MDL font deviations — chart / S-curve SVG text inherits the Segoe UI stack, never Arial). Global `[hidden]` reset is now OPTIONAL (MDL's hideable components self-manage hiding). The toast component is now specified in §7.10 (MDL I-59 / PPP I-76).
- **Future dashboards** — import §6 `:root` and follow §3–§5 layout; define own status
  vocabulary per §1.

### 12.1 Governance notes (added 2026-10-09)
- **Global `[hidden]` reset (OPTIONAL):** authors SHOULD include `[hidden]{display:none}` in the `:root`
  stylesheet (or scope it per component, as MDL does via `.help-modal[hidden]` / `.tf-panel[hidden]` + a generic `.hidden` class). Without it,
  `hidden` attributes are not guaranteed to hide elements across UAs — so MDL's per-component scoping is an accepted, equivalent approach.
- **Z-index / stacking:** define an explicit stacking order — base content `z-index:0`,
  sticky table headers `z-index:2`, panel collapse/overlays and the help modal `z-index:50`.
  Avoid ad-hoc `z-index` values; see MDL `:root` and `.help-modal{z-index:50}`.
- **§7 sub-section numbering:** the §7 block is out of order and contains a duplicate
  "§7.9" (*Help Modal* ≈L666 and *Range / Time* ≈L704). Renumber to the canonical sequence
  **§7.6 Overlays & Help · §7.7 Icon & Symbol · §7.8 Export / Download · §7.9 Help Modal ·
  §7.10 Toast · §7.11 Range / Time · §7.12 Chips** (insert Toast as §7.10; shift Range/Time
  and Chips down by one). This removes the collision and seats the new §7.10 Toast spec.
- **Standardisation rule (added 2026-10-10):** when a shared design is standardised, the spec must name
  **one** canonical variant and the source dashboard's implementation is the reference — "both variants
  permitted" is what allowed PPP and MDL to diverge. Applied today to **§7.5 Filters** (PPP's master
  "All" checkbox + `None selected` + `N of M selected` + dismiss hint is canonical; the All/Clear
  button variant is retired) and to **§3.5 Warning bar** (PPP's unified fixed `#errBanner` is canonical;
  the in-flow `.sys-banner` / `.note`-card variant is retired). A standardisation is not complete until
  **both** workplans record the delta — see MDL I-61 / I-62 and PPP I-75.
- **Cross-document update rule (added 2026-10-10):** any change to a shared contract must land in three
  places in the same pass — (1) the spec section (+ its §13.3 compliance row and any stale TODO/cleanup
  bullet), (2) the MDL workplan, (3) the PPP workplan. Stale compliance rows and TODO bullets that
  describe a superseded design are themselves defects and were corrected today (e.g. the §13.3 System
  banner row, the `.sys-banner-item.warn` "unused" bullet).
- **§15 superseded:** Decision 33 promotes this v1.0 spec to the single source of truth; the
  older `MDL/MDL_UI_Design_Spec.md` (formerly §15) is retired and should not be cited.

---

### 12.2 Open issues & change log
| Issue | Decision | MDL | PPP |
|---|---|---|---|
| Validation panel layout (§4.5 rev 2026-10-14): code-sheet result rendered as a **note card**; Rule Reference as a **single card with one row per fired rule** (not individual cards) | approved 2026-10-14 | **Implemented** 2026-10-14 (`renderValidation`) | **Deferred / held** — apply the same layout on the next PPP Validation-panel revision |
| **V-23 future-date rule over-broad** — currently flags *any* of Planned (S) / Forecast (T) / Actual (U) / Latest Approval (X) as "future date" when later than the current system date (`pipeline.mjs` condition `[S,T,U,X]`). Plans (S) and forecasts (T) are forward-looking and may legitimately be earlier **or** later than today; only **Actual 1st Issue Date (U)** ("actual 1st submission date") and **Latest Approval Date (X)** must not be later than the current system date. Proposed fix: restrict the V-23 condition to **`[U, X]`** and set `Field` to the offending column (`Actual 1st Issue Date` / `Latest Approval Date`). | **Open — pending review** (2026-10-14) | Implement in `pipeline.mjs` V-23 (restrict to U, X) | Review PPP future-date rule for the same over-broad S/T logic |
| **Data-table interaction contract (§7.2 rev 2026-10-15)** — the pre-revision §7.2 specified appearance and semantics only, so both dashboards shipped L1 static tables: no sort affordance, no `aria-sort`, a single string comparator, no pinned column, no column chooser, no windowing, no `<caption>`, a zero-row `<tbody>` on the widest table, CSV export not matching the on-screen sort, and a bounded scroller left capped in print. Root cause of the visible symptom (severity column row height and baseline differing from every other column in the same row) traced to eight causes, chief among them a chip class carrying `display:inline-block` applied directly to `<td>` and colour-emoji status glyphs. | **Approved 2026-10-15** — §7.2 now normative: maturity levels L0–L5 (§7.2.1), row typography tokens `--ds-row-h` / `--ds-head-h` / `--ds-cell-fs` / `--ds-cell-lh` (§7.2.3), glyph and chip rules (§7.2.4), `<colgroup>` + `table-layout:fixed` (§7.2.5), sorting (§7.2.6), filtering (§7.2.7), windowing (§7.2.8), cross-tab rules (§7.2.9), export parity (§7.2.10), print (§7.2.11), column controls (§7.2.13), sticky elevation (§7.2.14), bounded-table title band and scroll position (§7.2.15). | **Open — logged, not implemented.** MDL workplan **I-89…I-96**; PPP to be re-audited against the same clauses. | PPP: review Benchmark / Look-Ahead / Stage-grid against §7.2.6–§7.2.8 and adopt the same row typography tokens |

---

## 13. Compliance Audit & Remediation Plan (v1.0)

> **Status of this section:** audit-only. No application code was changed. The phased
> plans in §13.4–§13.5 are proposed; code changes start only after approval.

### 13.1 Purpose, scope & method

This section records a three-way review of the spec against the two shipping
implementations:

| Artefact | File | Notes |
|---|---|---|
| Spec | `Dashboard-UI-Design-Spec.md` | v1.0, §1–§12 |
| PPP | `PPP/Procurement-Dashboard.html` | hand-authored single file; `:root` L8–40, dark theme L299–312 |
| MDL | `MDL/MDL-Dashboard.html` | **generated** by `build.mjs` from `src/render.mjs` (CSS template literal at bundle ≈ L556–706 ⇒ source `src/render.mjs` L14–164; subtract 542 for source line) |

The older `MDL/MDL_UI_Design_Spec.md` was also consulted to find content the v1.0
spec dropped. The review is static (CSS / markup / JS); no runtime smoke test was run.

Priority key used below: **P0** blocker or correctness bug · **P1** high · **P2** medium ·
**P3** low / cleanup · **G** governance / spec text only.

---

### 13.2 UI / UX design evaluation (professional review)

The comparison in §13.3 lists *what differs*. This subsection judges *whether those
differences matter to the user* — using information hierarchy, cognitive load,
scanability, consistency, affordance, feedback and accessibility as the lens, not
line-for-line parity.

#### 13.2.1 Design-system integrity (tokens)
A token set **is** the design language; "copy it verbatim" is not pedantry. MDL ships
only 11 of ~33 tokens and then hard-codes literal hex for surfaces, shadows and
greys. The practical UX consequence is **colour and surface drift**: the same
component cannot be guaranteed consistent across states, and the dark theme cannot be
re-mapped without touching every rule. That directly defeats the spec's stated goal
of one visual family across PPP, MDL and future apps. PPP is fully tokenised, so the
two apps already look like two different systems. **Verdict: this is the root cause of
most MDL deviations, not a cosmetic nit.**

#### 13.2.2 Visual hierarchy & information density
- **Panel subtitles (PPP).** The spec bans explanatory subtitles and funnels all
  explanation into the Help modal precisely so the main view stays a *scan surface*,
  not a *reading surface*. PPP's two `.sub` lines re-introduce competing text beside
  the data and raise cognitive load on the primary screen — a real regression against
  the "document control first, dashboard second" philosophy.
- **Nested chart titles (both).** Hierarchy must read at a glance: a chart card is a
  *sub*-level and must use the non-uppercase `h3`. PPP renders nested titles as
  uppercase `h2`, so a chart card looks like a top-level panel and the page flattens.
  MDL uses two different nested-title sizes in the same app. Either way the user
  cannot instantly tell *section* from *card*.
- **Shadow / radius outliers.** The spec's "subtle shadow only" and restrained radii
  exist to keep the dense, enterprise register and to ban the Apple-Bento soft-tile
  look. MDL's dead `.welcome` block carries a `0 6px 20px` shadow and 14–16 px radii;
  PPP's hero hits 26 px. These add visual weight and noise that work against
  all-day readability.

#### 13.2.3 Consistency & learnability (affordances, glyphs, buttons)
- **Glyph semantics (MDL).** Using `▾`/`▸` for *panel collapse* **and** *row
  drill-down* **and** *bulk expand/collapse* means one symbol carries three meanings.
  Icon consistency is a foundational UX principle (recognition over recall); the
  collision invites mis-clicks ("did I collapse the whole panel?"). This is a genuine
  usability defect, not a style preference. PPP correctly reserves `−`/`+` for panels.
- **Two secondary button styles (PPP).** When the same control looks two different
  ways, users cannot predict behaviour. Consolidating to the one conformant secondary
  (12 px / 600 / 32 px / 7×14 / hover→blue) removes ambiguity.
- **Segmented control (MDL).** Beyond engineering, the `.seg` contract gives users
  *persistent* selection (survives reload) and a single, predictable selection
  pattern. MDL's per-instance bar/pie with in-memory state loses the user's chart-type
  choice on every reload — minor, but annoying across daily sessions.

#### 13.2.4 Scanability & data legibility
- **Table base (MDL).** MDL's bare table — full four-side grid lines, 11 px type,
  5×7 padding, ~24 px rows, no numeric alignment — is **busier and noisier** than
  PPP's `.ds-table` (single bottom rule, 9×10, ~40 px rows, `.num` + tabular figures).
  For a tool whose core task is *spotting overdue counts in ≤5 s*, right-aligned
  tabular numbers are not decoration — they are how the eye compares magnitudes.
  MDL's lack of `.num`/tabular-nums measurably slows numeric scanning.
- **One shared y-axis (MDL curve).** The spec's single-axis rule is a *perception*
  rule: with dual axes the same number renders at two heights and reads as a bug
  ("the curve is lower than the bar"). MDL's two-card layout avoids the dual-axis trap
  but at the cost of redundancy and extra vertical space, and it adds an HTML legend
  under a chart. A legend is *justified* for a multi-series curve (Planned/Forecast/
  Actual) where inline labels are hard — the spec should grandfather that case rather
  than forbid all legends.

#### 13.2.5 Feedback & state (status bar, toast, exports)
- **Status bar (MDL).** A live status bar (total / filtered / started% / as-of /
  filter) is excellent at-a-glance state and supports the 5-second exception goal.
  MDL renders it **before data loads** (empty navy strip) which reads as "something is
  broken". Hidden-until-first-render is the correct UX and is what PPP does.
- **Toast (both).** Now fully specified in **§7.10** (unified design shared by PPP + MDL;
  only the trigger set differs). PPP's *current* implementation still deviates from §7.10
  (literal `rgba(29,29,31,.92)` background, fixed 2200 ms timeout, no stacking, no
  `role=alert` error variant, `pointer-events:none` so it cannot be dismissed) and must be
  refactored (PPP workplan I-76). MDL has no toast yet and must implement §7.10 from scratch
  (MDL workplan I-59), retiring its inline `.msg` for export/copy feedback. Both tracked.

#### 13.2.6 Accessibility (focus, semantics, motion)
- **Focus visibility (MDL).** Only `.btn` has `:focus-visible`; selects, text inputs
  and filter controls do not. For an all-day professional tool used heavily by
  keyboard, an invisible focus position is a hard blocker (WCAG 2.4.7).
- **Table semantics (both).** Neither app emits `scope` on headers. Screen-reader
  users lose the row/column relationships entirely — a clear §7.2 miss.
- **Reduced motion** is correctly honoured by both; good.

#### 13.2.7 Responsive behaviour & cross-device use
- **PPP cascade bug.** The 2-column KPI rule is cancelled by a later, equal-specificity
  rule, so phones stay at 3-up KPIs — cramped numbers, harder to read at a glance.
  This fails the "readable across a full working day" aim on the smallest screens.
- **MDL auto-fit + 920 px only.** Auto-fit is fluid and robust for arbitrary KPI
  counts, but it abandons the *predictable, testable* 6/3/2 breakpoint contract and
  the panel 2→1 collapse, so on tablets panels stay 2-up and get narrow enough that
  tables may overflow with no clear collapse. Predictable breakpoints matter for QA and
  for tablet-using document controllers.

#### 13.2.8 Onboarding & first-run
- The `.expect` instructions callout (present in PPP) sets expectations and lowers
  first-run anxiety — a real onboarding asset. MDL omits it, and its hero carries a
  heavy shadow / wrong headline size, weakening the calm, professional first impression
  the spec wants.

#### 13.2.9 Summary judgement
- **PPP** is ~90% aligned and, from a UX standpoint, the stronger of the two: its
  deviations are mostly contained (responsive cascade, incomplete dark theme, a couple
  of radii, two button styles). Fixing them is low-risk.
- **MDL** is now ~90%+ aligned — on par with PPP — after the design-standard remediation
  completed 2026-10-08/09 (workplan I-31…I-50). The earlier ~55–60% assessment (pre-remediation)
  is obsolete. Remaining gaps are minor and mostly optional: no dark theme (optional per spec),
  left-nav deferred by policy (Decision 34 / I-35), no global `[hidden]{display:none}` reset (OPTIONAL — MDL components self-manage hiding; cosmetic), the toast is now specified in §7.10 and implemented in MDL (MDL I-59 done; PPP I-76 pending refactor),
  and all P3 polish items are now closed (`.subkpi` documented, chart-card title-style unification closed 2026-10-10). The
  previously "damaging" gaps (missing tokens, panel numbering, `.seg`, divergent table system,
  glyph collision, hidden status bar) are all resolved.
- **Process gap:** §12 should state MDL is *partially* aligned (now ~90%+, not the stale
  55–60% figure), so future reviewers are not misled by the obsolete low score.

---

### 13.3 Compliance comparison table

Columns: **Component · Spec requirement (or gap) · Current PPP · Current MDL · Issue
summary · Suggestion & priority.**

| Component | Spec requirement (or gap) | Current PPP | Current MDL | Issue summary | Suggestion & priority |
|---|---|---|---|---|---|
| Design tokens | ~33 tokens copied verbatim; add-only. | All 33 exact. | Full ~34-token `:root` copied verbatim (render.mjs:15); literal hex replaced with tokens. | Resolved — full token set adopted (one-family rule met). | MDL: closed (I-31). Both: replace any residual literal hex (P2). |
| Font stack | Exact Segoe/Inter/Source Sans/Roboto/Helvetica/Arial stack. | Exact. | Full Segoe/Inter/Source Sans/Roboto/Helvetica/Arial stack (§8 verbatim, I-43). | Resolved. | MDL: closed (I-43). |
| Dark theme | Optional; remap tokens only; brand navy/blue fixed. | Remapped + theme toggle added; hex patches → tokens (Phase B). ✅ | None (optional per spec; PPP-only). | MDL dark theme not implemented (optional). | MDL: optional / deferred; PPP: DONE (Phase B). |
| App bar | Sticky navy, `12px 20px`, no border, `z31` (above the `z30` warning bar so the filter dropdown clears it); **brand block left = logo + `.ttl` + `.meta` (meta now LEFT, §3.1 rev 2026-10-09)**; filter + Load file right. | Structure matches; `.meta` now left per §3.1; MDL title read from worksheet (I-52/I-53). | Structure matches; `.ttl` + `.actions` cluster; `.meta` left (I-54/55); title from worksheet (I-52); `.tf-btn` filter triggers + Load + Print present (I-42/58); footer present (I-36). | PPP: `.meta` still RIGHT → track via PPP I-73; MDL footer now present. | MDL: closed (I-36/I-42/I-52); PPP: move `.meta` left (I-73). |
| Navigation | Left sidebar OR top-bar nav; collapse <880. | Inline top-bar nav; condensed at <880 px (Phase B). ✅ | No `<nav>` — left sidebar deferred per Decision 34 (I-35); top-bar filters serve as navigation. | MDL: deferred by policy (not a code defect). | MDL: HOLD (Decision 34); revisit in future phase. PPP: DONE (Phase B). |
| Content wrapper & footer | `1320` centred, `16`/`52` pad; footer = last child inside wrapper. | Exact; footer last child. | Correct wrapper; footer present (`role=contentinfo`, last child, I-36). | Resolved. | MDL: closed (I-36). |
| Responsive | ≥1100 6/2-col; 880–1099 3/1-col; <880 2/1-col + nav collapse. | Cascade fixed: 6/3/2 + panels 2→1 at 1100/880 (Phase A). ✅ | KPI 6→3→2 and panels 2→1 at 1100/880 (render.mjs:135-136). | Resolved (MDL). | MDL: closed (I-37); PPP: DONE (Phase A). |
| System banner | Unified fixed top warning bar (`#errBanner`, §3.5): red=fatal, amber=warning, neutral-blue=info; below app bar; unified with load failures; icon+bold code+msg. | Unified top warning bar (below app bar; red=fatal, amber=warning, neutral-blue=info); `.sys-banner` removed (Phase B); info tier added 2026-10-07. ✅ | Unified `#errBanner` fixed top warning bar (below app bar; red=fatal, amber=warning, neutral-blue=info); mirrors PPP / §3.5 — `sysNoteHTML`/`sysBannerHTML` retired, `.sys-banner` removed. ✅ | Resolved — MDL now matches PPP unified bar (I-41 closed). | MDL: closed (I-41); PPP: DONE (Phase B). |
| Status bar | Fixed bottom, `z40`, navy, hidden until first render, `[hidden]` reset. | Compliant; hidden works. | Shows "Loading dashboard…" until first render (I-32/47); no bare `[hidden]{display:none}` global reset, but `.hidden` class + specific `[hidden]` rules prevent empty-bar. | Mitigated — loading state shown, not empty bar. | MDL: loading state closed (I-32/47); Spec: global `[hidden]` reset OPTIONAL (MDL self-manages; no defect). |
| Onboarding | Standalone hero (no app bar); **embedded** logo; headline `"<X> Dashboard"` 24–26/700; fixed sub-text; `.expect` ("What this does" + body); `.drop` dashed → `--accent`/`--soft` on drag-over with **button inside** + "Choose Workbook"; privacy + "© {year} UESH"; hero radius 24. Full style contract in §3.7 (rev 2026-10-09). | Full-screen hero (no app bar); `.expect`; dashed dropzone 16 px; **button inside** drop "Choose Workbook"; headline "Procurement Package Plan Dashboard" 25/700; logo **embedded**; privacy + "© {year} UESH". | Full-screen hero (**no app bar**); `.expect`; dashed dropzone 16 px; button **inside** drop "Choose Workbook"; headline "Master Document List Dashboard" 25/700; privacy + "© {year} UESH"; hero radius 24. | **Both compliant (rev §3.7, 2026-10-09):** MDL (I-56) and PPP (I-74) match the unified welcome contract — embedded logo, "… Dashboard" headline, fixed sub-text/`.expect`, button inside `.drop` "Choose Workbook", privacy + "© {year} UESH"; MDL welcome geometry aligned to PPP canonical via I-57. | Closed — MDL (I-56/I-57) and PPP (I-74) compliant with rev §3.7 (canonical = PPP). |
| Panel base | White, 1px, r10, `…26px` bottom, `margin:14px 0`, `position:relative`, uppercase 13/700. | `16px 16px 24px`, `margin:14px 0` (Phase D). ✅ | Matches reference exactly (the model). | PPP pad/margin slightly off. | PPP: DONE (Phase D). |
| Panel numbering | Sequential Panel 1,2,3… in document order; static corner; sub-panels not numbered. | `.panel-no` 1→8 correct. | Sequential `Panel N` corner label via `.panel[data-panel]::after` (render.mjs:57); KPI = Panel 1. | Resolved. | MDL: closed (I-38). |
| Panel subtitles | No explanatory subtitle; explanation → Help modal. | Short hint kept; fuller text → Help (Phase C). ✅ | None (ok). | PPP adds forbidden text. | PPP: DONE (Phase C). |
| Chart-card titles | Nested `h3` `.panel-head h3` 13/700 navy, not uppercase. | Chart cards emit `<h3>` in `.panel-head`; panel title `<h2>` (Phase C). ✅ | Unified: both `.chart h3` and `.panel-head h3` now 13px/700 navy (2026-10-10). | MDL compliant. | PPP: DONE (Phase C); MDL: closed (title styles unified to 13/700, 2026-10-10). |
| Combined chart | One chart, **one shared y-axis**; Bars toggle; legend only if inline impossible. | Single S-curve, one axis, Bars toggle. | Merged into one shared-axis chart `combinedProgressSVG` (render.mjs:247). | Resolved (merged). | MDL: closed (I-39, merged). |
| Bounded scroller | `.tableScroll`: `340px`, r10, `margin-top:8px`, sticky head. | Compliant. | `.tableScroll` (340px, r10, margin-top:8px) adopted (I-44). | Resolved. | MDL: closed (I-44). |
| Table base | One `.ds-table`: navy sticky head, single bottom rule, 9×10, `.num` tabular, zebra, hover, `.over`, `.empty`, `.sev`. | Fully compliant. | All four tables use `.ds-table` base (navy sticky head, single bottom rule, 9×10, `.num`, zebra, hover, `.over`, `.empty`, `.sev-*`) (I-50). | **Presentation** resolved — biggest cross-app split closed (I-50). **Interaction + typography contract §7.2.1–§7.2.12 is OPEN**: no sort affordance, no `aria-sort`, single string comparator, no pinned column, no column chooser, no windowing, no `<caption>`, uneven row metrics (chip class on `<td>`, emoji glyphs). | MDL: presentation closed (I-50); **contract OPEN — I-89…I-96**. |
| Table semantics | `<th scope="col">`; leading label `<th scope="row">`. | `scope="row"` on Benchmark/Look-Ahead/Stage-grid (Phase C). ✅ | `th[scope=col]` and `th[scope=row]` present (render.mjs:184 + usage). | Resolved (MDL). | MDL: closed (I-44/I-50); PPP: DONE (Phase C). |
| Row count | Bounded list shows full count in control row. | Shown "(N packages)". | Row-count chips on Overdue/Validation/Detail control rows (I-44). | Resolved. | MDL: closed (I-44). |
| Look-ahead | Forward-only, sorted, distance col, status col, horizon seg (calendar months), CSV = on-screen rows. | Fully compliant (all 9 rules). | Not present (document-focused). | N/A to MDL. | — |
| Drill accordion | One detail open at a time; `aria-expanded` synced; keyboard; chevron rotates. | Mostly ok; chevron coded two ways; cell not `aria-hidden`. | One-open-at-a-time; `aria-expanded` + `role=button` + keyboard (Enter/Space); chevron synced (I-44). | Resolved. | MDL: closed (I-44); PPP: revisit chevron coding. |
| Collapse vs drill glyphs | `−`/`+` collapse; `▸`/`▾` drill; `▾` menu. One glyph per meaning. | `−`/`+` correct; chevron coding only inconsistency. | `−`/`+` for panel collapse; `▾`/`▸` reserved for stage drill (I-40). | Resolved. | MDL: closed (I-40). |
| KPI panel | First; "KPI OVERVIEW"; `?` left + `−` right; corner no.; no subtitle; cards 6→3→2, 3 px strip, 22/700, 10 upper. | Compliant; KPI content changed (2026-10-06): Not Started/blank → PO Issues; still 6 cards. | Card tokens ok; `?` injected left of collapse ok; `.subkpi` sub-tier present (documented 2026-10-10, §5). | MDL compliant (sub-tier documented). | MDL: implemented; Spec: documented `.subkpi` sub-tier (P3 closed 2026-10-10, §5). |
| Primary/Secondary btn | Primary blue 32 px; Secondary white/navy, hover→blue, 12/600/32/7×14/r6. | Standardised on `.btn.ghost`; `.btn.secondary` removed (Phase B). ✅ | `.btn`/`.btn-secondary`/`.btn-active` match. | PPP duplicate secondary. | PPP: DONE (Phase B). |
| Icon button | 26 px **square**, 1px, muted, hover→soft + navy. | `.icon-btn` square 26 ✅. | `.icon-btn` 26 px square + `--soft`/navy hover (renamed from `.btn-mini`, I-43). | Resolved. | MDL: closed (I-43). |
| Focus visibility | `:focus-visible` 2 px blue on **all** interactive. | Buttons + selects covered. | Global `:focus-visible` (2 px blue, offset 2 px) on all interactive (I-43). | Resolved. | MDL: closed (I-43). |
| Segmented control | `.seg` + `data-key`/`data-t`, delegated listener, per-card keys, `getPref`/`setPref`+localStorage, re-derived `.on`/`aria-pressed`, validated, proper-case, 2–6. | Fully compliant. | `.seg` + `data-key`/`data-t`, delegated listener, `getPref`/`setPref`+localStorage, re-derived `.on`/`aria-pressed` (render.mjs:101-105, 1095). | Resolved. | MDL: closed (I-34). |
| Filters/dropdown | Multi = `.tf-btn`+`.tf-panel` popover; single = native select. **Top-bar filter contract (§7.5 rev 2026-10-10, PPP = canonical): one `.tf-btn` per dimension, capped at 2; panel = master "All [dimension]" checkbox (**no Clear button**) + option list + a single one-line dismiss hint; badge `All [dimension]` / `N of M selected` / `None selected` with `.is-filtered` accent; **re-render deferred until the dropdown closes**; excluded values not offered; empty selection = zero rows; AND-combined atomic update.** | **Reference implementation** — single "All Categories" `.tf-btn` with master checkbox + `.tf-divider` + option list; badge `All Categories` / `N of M selected` / `None selected`. Still deviates from rev 2026-10-10 in: `.active` (not `.is-filtered`), **no dismiss hint**, **immediate** re-render, one dropdown only (Category; Status is a `.seg`), and **I-57 empty = all** → must become **zero rows**. | **Two individual top-bar dropdowns (`Discipline`, `Stage`)** following §7.5 rev 2026-10-10 (MDL I-58 + I-61): master "All Discipline" / "All Stage" checkbox, badge `All [dim]`/`N of M selected`/`None selected`, `.is-filtered`, dismiss hint *"Changes apply when this list is closed."*, deferred re-render (I-60). | **MDL compliant** (I-58 / I-60 / I-61); PPP alignment pending via **PPP I-75** (rewritten to rev 2026-10-10). | MDL: closed (I-58, I-60, I-61); PPP: I-75 — two-filter cap (Category + Status), `.is-filtered`, dismiss hint, deferred re-render, empty = zero rows. |
| Toast | Referenced 3×; **now specified** in **§7.10** (unified design; only triggers differ per dashboard). | `role=status` + `aria-live=polite`; lifted clear of status bar; **but deviates from §7.10** — literal bg, fixed 2200 ms, no stacking, no `role=alert` error variant, no dismiss. Refactor required. | Full `#toast` implemented per §7.10 (I-59, 2026-10-09): token variants, `role=status`/`role=alert`, z-index 45 above the status bar, length-scaled + pausable auto-dismiss, stack (max 3) + queue, click/`Esc` dismiss; inline `.msg` retired from export/copy toolbars (S-curve live readout `.msg` kept per §7.10.2). | Spec: defined (§7.10). PPP: refactor to §7.10 (I-76 — pending). MDL: **closed (I-59, 2026-10-09)** — `#toast` implemented, inline `.msg` retired for export/copy. | PPP: I-76 (pending refactor); MDL: I-59 closed. |
| Exports | `⤓ PNG`/`⧉ Copy`/`⤓ CSV`; UTF-8 BOM; `<project> - name.csv`; clipboard fallback→PNG+toast; PNG before Copy. | Fully compliant. | Project-prefixed `<project>-<name>` filenames (I-45); table-as-PNG retained; BOM + order ok. | Resolved (filenames prefixed). | MDL: closed (I-45). |
| Help modal | Centred popup, overlay `rgba(15,23,42,.45)`, box r12/680/84vh, `role=dialog aria-modal`, Esc + click-outside, `HELP[id]`. | Compliant; appended to `body`. | `aria-labelledby` on `.box` + `aria-label='Close help'` on ✕ (I-45). | Resolved. | MDL: closed (I-45). |
| Icon convention | One glyph per control; icon btn `aria-label`+`title`; chevron `aria-expanded`. | Mostly ok; chevron cell not `aria-hidden`. | `✕` now has `aria-label`; glyph collisions resolved (I-40/45). | Resolved. | MDL: closed (I-45). |
| Chips | Filter `.ovl-btn` + summary `.vchip`, both r999. | `.vchip` present; `.ovl-btn` absent (stage filter → `.seg`, intentional). | `.chips label` r12; no `.vchip`. | Spec filter-chip row may be stale. | Spec confirm `.seg` replaces `.ovl-btn`; MDL use 999 (P3). |
| Print & reduced-motion | Print B/W, hide toolbars, no shadow, landscape; honour reduced-motion. | Compliant. | Compliant. | None. | — |
| Repo / governance | "Single source of truth" — but MDL HTML is generated; 3 other HTML copies exist. | Single hand-authored file. | Canonical source = `src/render.mjs`/`src/*.mjs`; `MDL-Dashboard.html` + `Arch/` are build artefacts (rebuild via `node build.mjs`). | Documented in workplan + build.mjs. | MDL: closed (build process); Spec: state provenance in §1 (G). |
| Spec internal defects | — | — | — | Duplicate §7.9; dangling "§16" note; `.meta` 11 vs 12 conflict; two warning palettes (`.note` uses literal `#FFF8E1` vs `--warn-bg` token — still open); naming conflict; §12 "aligned" → corrected to "partially aligned" (I-46). | Fix doc: renumber, correct conflicts, rewrite §12 (G/P1). |
| Spec gaps to add | — | — | — | Global `[hidden]` reset (OPTIONAL — MDL self-manages); no z-index/stacking table; no dark remap list; no radius budget for non-panels; no `scope=row` criterion; no build rule; content dropped from old MDL spec. (Toast spec added 2026-10-09 as §7.10.) | Add S-7…S-21 (G). |

---

### 13.4 Phased remediation — PPP (separate plan)

> **Status (2026-10-06): all four PPP phases COMPLETE.** PPP is now 100% aligned to the
> radius/spacing scale; all originally-flagged off-scale tokens (including the post-plan
> `#toast` / `.grid` / `.curve-grid` items) have been snapped. MDL remediation is **COMPLETE** (2026-10-08/09, workplan I-31…I-50) — see §13.5.

**Phase A — P0 blockers — ✅ DONE**
- Responsive cascade fixed: KPI columns now 6 → 3 → 2 and panels 2 → 1 at the 1100 / 880 px
  breakpoints; the narrower `<880 px` rule wins the cascade and the missing 880–1099 1-column
  panel band is added. No desktop regression.

**Phase B — P1 — ✅ DONE**
- Dark theme: full token remap + a persisted **theme toggle**; the four literal-hex per-component
  patches (`.panel-head h3`, `.inter-sel`, logo, `.chartwrap`) converted to tokens.
- Fatal banner reconciled to a **single unified top warning bar** (fixed just below the navy app
  bar; visible on both welcome and dashboard; red = fatal/load-failure, amber = warning, neutral-blue = info). The
  in-wrapper `.sys-banner` and its builder were removed. §3.5 clearance rule added.
- Duplicate secondary button removed: standardised on `.btn.ghost`; `#reloadBtn` → `class="btn ghost"`.
- Top-bar nav condensed at <880 px (hide `.meta` detail text; let filter + Load wrap).

**Phase C — P2 — ✅ DONE**
- Panel `.sub` subtitles: kept a short inline hint on the benchmark + validation panels; fuller
  text moved into the Help modal (HELP `benchPanel` / `vcard`).
- Chart-card titles now emit `<h3>` inside `.panel-head` (13/700 navy, non-uppercase); the
  Panel-2 title stays `<h2>`. Note: `.card h2` and `.panel-head h3` are **live** (not dead) — the
  original plan bullet was inaccurate; both were retained.
- `.inter-sel` radius 9 → 8; `.tf-btn:hover` → `--soft` background.
- Today reference line colour `#8E8E93` → `#B8C2CC` (PNG-safe; literal used because SVG `stroke`
  attributes cannot resolve `var()`).
- `#toast` given `role="status"` + `aria-live="polite"` and lifted clear of the fixed status bar.
- `th scope="row"` added to the Benchmark, Look-Ahead and Stage-grid leading cells; added
  `.ds-table th[scope="row"]{font-weight:400}` so they keep `td` styling; `attachHelp` now detects
  `[data-collapse-panel]` to prevent a duplicate collapse button on re-render.

**Phase D — P3 — ✅ DONE (strict snap)**
- Radius/spacing snapped to the 4/8/12/16/24/32/48 scale: `.wcard` 26→24 (pad 48/48),
  `.drop` pad 24/16, `.expect` pad 12/16, `.tf-panel` 14→12, `.card` pad 16/16/24 + `margin:14px 0`,
  `.flag` pad 12/16. Confirmed (no code change): help-modal ownership singleton; BOM + project-prefixed
  export filenames already compliant.

**Out-of-plan change (2026-10-06)**
- KPI strip: removed the **Not Started / blank** card and inserted a **PO Issues** card before
  **Delivered / RI** (still 6 cards). PO Issues = packages with an overdue PO today via the shared
  `stageIsOverdue(p,'po',today)` (due = PO Forecast‖PO Plan; overdue if due < today with no PO Actual);
  red if any, green if none — identical to the Overdue-by-Stage "PO Issue" count. KPI Help updated.

**Open items (PPP, low priority)**
- ~~A few off-scale tokens remain outside the Phase D table: `#toast` padding `10px 18px` and
  `.grid` `gap / margin-bottom: 18px`.~~ ✅ Snapped 2026-10-06 → `#toast` now `padding:12px 16px`,
  `.grid` now `gap:16px; margin-bottom:16px`. All originally-planned off-scale tokens are on the
  4/8/12/16/24 scale.
- `.curve-grid` `gap:18px → 16px` snapped 2026-10-06 — the last remaining off-scale token. PPP is
  now 100% on the radius/spacing scale.

---

### 13.5 Phased remediation — MDL (separate plan)

> MDL changes must be made in **`src/render.mjs`** (and `src/*.mjs`), never in the
> generated `MDL-Dashboard.html`. Re-run `node build.mjs` after edits.

> **Status (2026-10-09): COMPLETE.** All four MDL phases (A–D) were implemented
> 2026-10-08/09 (workplan I-31…I-50): full token set, `.ds-table`, `.seg`/`.tf-btn`,
> panel numbering, footer, responsive cascade, combined Issue-Progress chart, glyph
> semantics, banner `.note`, app-bar, font/icon/focus, scroller/accordion, export
> filenames, help a11y, plus spec-doc governance (I-46). Only **I-35 (left-nav) remains
> deferred** per Decision 34. All tracked P2/P3 items are now closed: `.subkpi` documented (§5) and chart-card title-style unification closed 2026-10-10 (`.chart h3` / `.panel-head h3` unified to 13px/700/navy). The global `[hidden]` reset is now OPTIONAL — MDL's hideable components (help-modal, tf-panel) define their own `.foo[hidden]{display:none}` rule and a generic `.hidden` class exists, so there is no current defect; retained only as a defensive one-liner if desired.   (The spec toast component is **closed** — MDL I-59, 2026-10-09; PPP I-76 refactor still pending.)

**Deferred by design (not spec defects):**
- **I-35 — Left-nav panel**: deferred per Decision 34 (MDL mirrors PPP's top-toolbar + horizontal filter bar instead of a left sidebar).
- **I-07 — Reporting-period *filter***: the S-curve period window now **scopes the S-curve data** (cumulative lines shown within the selected window, anchored at the window start; monthly bars show per-month new counts) — implemented 2026-10-11. The dual-label caption `Reporting period: … · As-of: {system date} · cumulative within period` is implemented so the window is never confused with current-date math. (Overdue / Approval / KPI panels remain anchored to the as-of system date.)
- **Schedule & Review Engine (Decision 28 / reviewer 5c–5d)**: the unified per-row **"Current Status"** pipeline and the consolidated **3-Overdue summary** (SLA statuses Due Soon / Due Today / Overdue / Resubmit) are **deferred to future work**. MDL currently exposes the three Overdue flavours (1st-submission, Resubmission, Client-review) as the interim status view; no unified single-status column exists at this stage.
- **Dark theme**: optional per spec (PPP has it; MDL does not).

**Phase A — P0 blockers (mandatory rule / correctness)**
- ✅ **DONE (2026-10-08):** full token set (I-31), status-bar loading state (I-32), `.ds-table` scope/num/severity (I-33), `.seg` + top-bar filter popover (I-34), panel numbering (I-38), app-bar `.ttl`/filter trigger (I-42).
- Add the full canonical `:root` token block (copy §6 verbatim) and stop hard-coding hex.
- (OPTIONAL) Add a global `[hidden]{display:none}` reset — MDL self-manages hiding via per-component rules (`.help-modal[hidden]`, `.tf-panel[hidden]`) plus a generic `.hidden` class, so the status bar shows a loading state rather than an empty bar; no current defect.
- Implement the `.seg` contract: replace the per-instance bar/pie buttons with
  `.seg`+`data-key`/`data-t`, one delegated listener, `getPref`/`setPref` + localStorage,
  and re-derived `.on`/`aria-pressed`. Do this for chart type and for any other
  single-choice selector.
- Replace the bare `table` style with the `.ds-table` base (navy sticky header, single
  bottom rule, 9×10 padding, `.num` + tabular figures, zebra, hover tint, `.over`
  override, `.sev` chips, `.empty` state).

**Phase B — P1 (high-impact alignment)**
- ✅ **DONE (2026-10-08):** footer (I-36), responsive cascade (I-37), combined Issue-Progress chart (I-39), glyph semantics (I-40), non-fatal banner → `.note` (I-41). Left-nav (real `<nav>`) **deferred** per Decision 34 (I-35).
- Add panel numbering: emit `data-panel` (or `.panel-no`) sequentially from Panel 1 in
  document order; fix the HELP-map titles to match (KPI must be Panel 1, etc.).
- Add a `role="contentinfo"` footer as the last child inside the content wrapper.
- Render non-fatal notices as the contained `.note` card; pick one fatal mechanism.
- Implement the responsive cascade (6/3/2 KPI + 2-col→1-col panels at 1100/880, using
  880/1100 instead of the current 920).
- Implement real navigation (left sidebar or top-bar) and its <880 px collapse.
- Use `−`/`+` for panel collapse (not `▾`/`▸`); reserve `▸`/`▾` for row drill-down only.
- Add the app-bar category filter trigger and a "Load file" action.

**Phase C — P2 (medium)**
- ✅ **DONE (2026-10-08/09):** `.tableScroll` (I-44), `scope` + row-count (I-44/I-50), `:focus-visible` (I-43), icon button square (I-43), `.tf-btn` popover (I-34/I-58), drill accordion (I-44), curve merge + filename prefix (I-39/I-45). ✅ **DONE (2026-10-10):** chart-card title-style unification (P2) — `.chart h3` and `.panel-head h3` unified to 13px/700/navy.
- Adopt `.tableScroll` (340 px / r10 / `margin-top:8px`) for long lists.
- ✅ Convert chart-card titles to `.panel-head h3` (13/700, non-uppercase) — done 2026-10-10 (`.chart h3` matched to 13/700 navy).
- Add `scope` to every header; report the row count in each long-list control row.
- Add `:focus-visible` to selects, inputs and filter controls.
- Make the icon button square (26 px) with `--soft`/navy hover.
- Convert the checkbox chip wall to the spec's `.tf-btn` + `.tf-panel` popover (or to a
  999 px filter chip per §7.10).
- Enforce the drill-down accordion: one open at a time, `aria-expanded` kept in sync,
  keyboard operable.
- Decide the curve-chart ruling (one shared-axis chart, or grandfather the two-card
  layout + legend) and align accordingly; prefix CSV/export filenames with the project.

**Phase D — P3 (low / cleanup)**
- ✅ **DONE (2026-10-08/09):** dead `.welcome` CSS removed (I-57), help-modal `aria-labelledby` + ✕ `aria-label` (I-45), repo/provenance note (build process). **Open:** inline `.msg` → spec toast (P3). (Global `[hidden]` reset moved to OPTIONAL — see §13.5 summary.)
- Delete genuinely dead CSS only (confirm no orphaned rules remain). Note: `.sys-banner-item.warn`
  is **not** dead — it is the warning tier of the unified `#errBanner` (spec §3.5).
- Add `aria-labelledby` to the help modal and `aria-label` to the `✕` close button.
- Replace the inline `.msg` copy-failure feedback with the spec's toast (PNG fallback +
  toast) or at minimum make it perceivable.
- Add a repository note: the canonical, editable file is `src/render.mjs`; the bundled
  `MDL-Dashboard.html` and `Arch/` copies are build artefacts.

---

### 13.6 Defects & gaps to fix in this document (governance)

1. **§7.9 is duplicated** (Help Modal at L603 and Range/Time selection at L641) and
   §7.8 Exports sits *after* §7.9. Renumber so §7.8 Exports, §7.9 Help Modal, §7.10
   Range/Time selection, §7.11 Chips — and fix the ambiguous "§7.9" cross-references.
2. **Dangling reference:** §5's note cites "Design spec §16" but this doc has 12
   sections (it meant the old MDL spec §16). Repoint or remove.
3. **Internal contradiction:** §3.1 says `.meta` = 11 px / opacity .85; §8 says
   `.meta` = 12 px / 400 / `--muted`. Pick one (recommend 11 px / .85, the implemented
   value).
4. **Two warning palettes:** §3.5 `.note` = `#FFF8E1`/`#7a5b00` vs §6 tokens
   `--warn-bg:#FFF4D6`/`--warn-fg:#9a6b00`. State which governs notes, chips and row
   highlights (recommend the §6 tokens).
5. ~~**Naming policy conflict:** §4 says panel class name is free, §7.2 mandates `.ds-table`.
   State which class names are normative.~~ **RESOLVED 2026-10-15 (§7.2.0).** Panel / container
   class names remain free (§4); the **table** class names listed in §7.2.0 are normative and
   MUST be used verbatim.
6. **§12 adoption claim is false for MDL.** Rewrite to an explicit exception list once the
   Phase A/B work lands.
7. **Add the missing spec sections** (the "S-" gaps from §13.3): global `[hidden]` reset;
   z-index / stacking table (header 20, status bar 40, modal 50, toast, banner); toast
   component; dark-theme required remap set; radius budget for non-panel surfaces;
   `<th scope="row">` acceptance criterion + the "—" empty-value convention; build /
   provenance governance; and the content dropped from the superseded MDL spec (table
   header height 44 px — **superseded by §7.2.3**: the header row MUST equal `--ds-row-h`
   = 40 px, never a separate 44 px value; success criteria, review-SLA vocabulary,
   print/PDF detail, mobile minimum feature set).

*This standard supersedes ad-hoc styling. Any new dashboard MUST comply before release.*
