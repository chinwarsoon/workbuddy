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
  **no bottom border** (the navy block ends cleanly). `z-index:20`.
- Structure (`.bar` > `.inner`): **Brand** left (logo + project title `.ttl`, 17 px / 600,
  white, ellipsis); **Actions** right — meta line `.meta` (workbook · as-of · refresh,
  11 px / opacity .85), the category filter trigger `.tf-btn`, and the primary "Load file"
  action as `.btn.secondary` (white fill, navy text — hover → `--blue` fill).
- The logo is a white chip: `height:36px`, `padding:3px`, `border-radius:6px`,
  `box-shadow:0 1px 3px rgba(0,0,0,.2)`.
- The header is mandatory on every dashboard. Navigation may be a left sidebar (MDL) or
  inline in the header (PPP) — either is permitted (§3.2).

### 3.2 Navigation
- Either a **left sidebar** (MDL pattern: OVERVIEW / REVIEWS / DOCUMENTS / QUALITY /
  SETTINGS) **or** a top-bar nav (PPP pattern). Both are permitted; the header is
  mandatory in either case.

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

### 3.5 System / Config Banner (`.sys-banner`) & Notes (`.note`)
- Region **directly below the header**, above all panels. Hidden / not rendered when there
  are no notices.
- Two visual tiers, by severity:
  - **Fatal / error-level** → full-width `.sys-banner-item.fatal` strip: `--red` background,
    white text, `⛔` icon.
  - **Non-fatal (warning / info)** → MDL `.note` **card**: `#FFF8E1` background,
    `1px solid --amber` border, `border-radius:8px`, `padding:8px 12px`, `#7a5b00` text,
    `margin:10px 0` — soft and contained, **not** a full-bleed strip. Icon: `⚠️` for
    warnings, `ℹ️` for info.
- **Item format** (matches MDL exactly): an **icon** + **bold code** + **message** —
  icon prefix, code wrapped in `<b>` (default `SYSTEM`), then the message. No leading
  severity word and no separator — the icon already conveys severity.
- Shows *system / config* issues only (e.g. missing columns, row-count mismatches);
  per-package data issues live in the Validation panel.

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
- Shown before any data is loaded. A centred `.wcard` on the `--bg` canvas: logo, short
  headline (≈24–26 px / 700), sub-text, an **instructions callout** (`.expect`), a **dropzone**
  (`.drop`, dashed border → `--accent`/tint on drag-over), and the primary **Select file**
  button.
- This is a single-focus **hero** surface, so it may use a **larger radius** (up to ~24 px) than
  data panels; the primary CTA is still the standard Primary button (§7.1) — only its radius is
  relaxed here for the hero moment. Everything else still follows §4–§6.

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
| `⤓ PNG` / `⧉ Copy` | **each chart card** | exports that single chart only |

- Chart cards do **not** get their own Help/Collapse and are **not** individually numbered —
  they inherit the parent panel's number (see numbering rule above). Only the panel shows one.
- **Chart-card titles** follow §8: `h3` (`.panel-head h3`), 13 px / 700 `--navy`, **not**
  uppercase — they are nested sub-panels, unlike the panel's own uppercase `h2`.
- **Collapse must survive re-render**: when a panel's contents are rebuilt via `innerHTML`, keep
  the collapsed flag as a class on the **panel element itself** (which is not replaced) and
  re-derive the toggle button's glyph/`aria-expanded` from it on each render.

---

### 4.2 Combined chart panels (bars + cumulative curve)
When a chart needs to show **both per-period detail and a running total**, use **one** chart with
a single shared time axis instead of two stacked charts:

- **ONE shared y-scale — never dual axes.** Monthly bars (per-period counts) and cumulative
  lines (running totals) are plotted against the **same** scale and the **same** single value
  axis (left, captioned with the unit, e.g. `pkgs`). Rationale: with separate bar/cumulative
  axes the *same number* renders at two different heights — a bar of `5` sits far taller than
  a cumulative point of `5`, which reads as a bug ("the cumulative curve is lower than the
  bar"). A single scale keeps the two representations directly comparable, and the **Bars**
  toggle (below) is the way to inspect the curve on its own.
  - The scale is `max(1, …visible bar values, …visible line values)` — computed over the
    **visible window**, so it rescales as the period window moves. Bars and lines share **one**
    `y(v)` function; no second `y` function may exist for the same plot.
  - Because there is no right axis, the right-side axis padding is minimal (`padR ≈ 18`, not
    the ~52 px a second axis needs). Only **one** set of tick labels is drawn, on the left, plus
    a single unit caption (e.g. `pkgs`) above the axis. Do not label the axis `/mo` and `cum.`
    separately — there is only one scale.
- Every series is drawn **twice**: once as bars, once as a cumulative line. Lines are
  distinguished from their bar counterpart by dash pattern (e.g. Plan `6,3`, Forecast `2,2`,
  Actual solid) and are named `Cum. <series>` in the legend.
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
- **Every non-zero bar shows its value** printed above it (≈9 px). Zero bars are skipped so the
  plot stays readable.
- The time range extends **exactly one extra month** beyond the last data month (not three or
  four) so the last bar is not flush against the plot edge.
- A **Bars** toggle hides the per-period bars so the cumulative curve can be read alone; it lives
  in the panel's control row, not in the chart. Bars are **visible by default**. The button is a
  state toggle, not a momentary action: it carries `aria-pressed` and is dimmed (`opacity:.55`)
  when bars are hidden, so its state is visible without re-reading the chart.
- Period-window controls (**label, From, To, Bars, Reset, date-range text**) sit in **one row**:
  `flex-wrap:nowrap; align-items:center`; the date-range text is `margin-left:auto` and
  `white-space:nowrap`. They must not wrap onto a second line.
- These panels stay **full width** (`.card.full`) — one wide chart, not a 2-column grid.
- **No nested chart title** when a panel holds a single chart: the panel's own `h2` is enough, so
  do not add an `h3` sub-title. The chart's export actions (`⤓ PNG` / `⧉ Copy`) stay in their own
  right-aligned row (`.chart-actions`) directly above the chart.

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

```css
.kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.kpi{background:var(--surface);border:1px solid var(--border);border-top:3px solid var(--blue);
  border-radius:8px;padding:10px}
.kpi .v{font-size:22px;font-weight:700;color:var(--navy)}
.kpi .l{font-size:10px;color:var(--muted);text-transform:uppercase;margin-top:2px}
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
All actions are real `<button>` elements. Variants:

| Variant | Class | Style | Use |
|---|---|---|---|
| Primary | `.btn` | `--blue` solid, white text, radius 6 px, min-height 32 px | main page action (Open file, Load another file) |
| Secondary / Ghost | `.btn.ghost` | white, 1px `--border`, **navy** text; hover → `--blue` fill, white text (MDL `.btn-secondary`) | low-emphasis / alternative action |
| Mini / Icon | `.icon-btn` | 26 px square, 1px `--border`, muted; hover → `--soft`, navy glyph | inline panel actions (Help `?`, Collapse `−`) |
| Text action | `.copyBtn` / `.dlBtn` / `.reset` / `#vExport` | MDL `.btn-secondary`: 12 px / 600 **navy**, min-height 32 px, radius 6 px, glyph + label (`⤓ PNG`, `⧉ Copy`); hover → `--blue` fill, white text | chart exports, period-window Reset, validation Export CSV |
| Filter trigger | `.tf-btn` | text + `▾`, 1px `--border`, radius 6 px; hover → `--soft` | opens the category filter menu |
| Segmented | `.seg button` | joined group, 1px `--border`, radius 6 px, overflow hidden; inactive = white / **navy** text; active `.on` = **`--navy`** fill / white text (MDL `.btn-active`); inactive hover → `--blue` fill | bar/pie toggle, view switch |

- Font 12–14 px / 600. Chart/tool buttons match MDL exactly: 12 px / 600 **navy** text on white,
  `min-height:32px`, `padding:7px 14px`, radius 6 px; **hover = `--blue` fill with white text**
  (not a `--soft` tint). Primary keeps `--blue` (the *action* colour); the segmented control's
  **active state** is `--navy` (a *selection* state, per MDL `.btn-active`) — these are different
  semantics and intentionally different colours.
- Inline panel actions sit in the title row, **right-aligned** as a cluster (see §4); within
  the cluster Help `?` is left of the Collapse `−` toggle.

### 7.2 Tables (`.ds-table`)
One common table style for **every** tabular view. Data tables (benchmark, look-ahead,
overdue) and issue tables (validation) all use `.ds-table`; issue tables add severity + optional
row drill-down on top of the same base — never a second, divergent table style.

- **Header**: `thead th`, `--navy` background, white text, 12–13 px, weight 600. Inside a scroll
  container (`.tableScroll`, §4.3 — `.vtableWrap` is the validation-table instance of it) the
  header is `position:sticky; top:0` so it stays visible while scrolling long lists.
- **Long lists never render unbounded**: put the table in `.tableScroll` (§4.3) so the panel keeps
  a fixed height; the row count is reported in the panel's control row instead.
- **Cells**: 1 px `--border` bottom rule; padding 9 px 10 px; default left-aligned. Numeric
  columns get class `.num` → right-aligned with `tabular-nums`.
- **Zebra**: even body rows `#F9FBFD`; row `:hover` → `--soft` tint.
- **Overflow highlight**: a row tagged `.over` gets `--warn-bg` (overrides zebra).
- **Empty state**: `.empty` muted caption.
- **Issue-table extensions**: severity rendered as a `.sev` chip (`.sev-error` / `.sev-warning`
  / `.sev-info`); rows may be expandable drill-downs (`.ovl-row`, `aria-expanded`, chevron).
- **Accessibility**: every header cell is `<th scope="col">`; use `<th scope="row">` for a leading
  row label.
- Row height ≈ 40 px; no heavy vertical gridlines beyond the 1 px bottom rule.

### 7.3 Status (shared principle)
- **Icon + Text + Colour** for every status (§9). Each dashboard owns its vocabulary.
- Example rendering: `⚠ Error`, `✓ on track`, `✕ behind`.

### 7.4 Charts (SVG)
- Serialise to PNG-safe literals (CSS vars do not resolve in exported SVG):
  navy `#0F2D52`, blue `#1E88E5`, green `#2E7D32`, amber `#F9A825`, red `#C62828`,
  grey `#B8C2CC`, grid `#EDF1F5`.
- S-curve: **red dashed** = project start; **grey** = today (operational as-of).
- **Combined bar + cumulative charts share one y-scale** (§4.2) — never add a second value
  axis. Plot area therefore reserves no right-side axis padding.
- **Categorical colour (bar & pie)**: every category gets its **own** colour — a bar chart must
  never render all bars in one flat accent colour. Both `svgHBar` and `svgPie` fall back to the
  shared categorical palette (`PIE_COLORS`, 12 entries) indexed **by position**, so a given
  category keeps the **same colour when toggling bar ↔ pie**. An explicit semantic colour on an
  item (e.g. status counts) always overrides the palette. Colours cycle when there are more
  categories than palette entries.
- Period window: dual From/To range control + Reset + range message.
- **No duplicate legend**: bar and pie charts label each bar / slice **inside the SVG** (colour
  swatch + category name + value drawn as part of the chart). Do **not** also render an HTML
  legend below the chart — that duplicates information the chart already carries and steals
  vertical space. A legend below the chart is only used when the chart type genuinely cannot
  show labels inline.

### 7.5 Filters / Dropdown / Segmented control
Two selection patterns — pick by interaction:

- **Native select** (`.inter-sel`): single-choice picker (e.g. breakdown dimension).
  12 px / 600, 1px `--border`, radius 8–9 px, white surface, `--ink` text; `:focus-visible`
  2 px `--blue` ring; `max-width:260 px`.
- **Custom dropdown menu** (`.tf-btn` + `.tf-panel`): multi-select filter (e.g. item-category).
  Trigger is a text button ending in `▾`; popover is 1px `--border`, radius 8 px, subtle
  shadow, `min-width:220 px`, `max-width:min(340 px,90vw)`, `max-height:320 px` scroll,
  options ellipsis on long labels. Trigger carries `aria-expanded` + `aria-controls`.
- **Segmented control** (`.seg`) — **the standard single-choice selector** for mutually exclusive
  options (chart type, horizon, view switch). Use it instead of a dropdown when the options are
  few (2–6), short and always visible. Full contract below.
- Generic filter panel: 1px border, radius 8 px, max-width with ellipsis on long labels.

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
- **Toast** (`#toast`): transient message, fixed bottom-centre, high contrast, auto-dismiss.
- **Error banner** (`#errBanner`): fatal *load* errors only — fixed top, full-width, `--red`.
  Distinct from the system / config banner (§3.5), which is for data/config notices.

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

### 7.8 Export / Download actions
All exports are **text-action buttons** (§7.1), grouped in a `.ctool` / `.ctool-footer` row.

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
  domain (e.g. months) — plus a **Reset** text-action button and a **live message** describing
  the active window.
- Used on the S-curve panel to zoom a date range; the red-dashed (project start) and grey
  (today) reference lines stay fixed while the window moves.
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

**Font stack**: `'Segoe UI', system-ui, -apple-system, 'Inter', 'Source Sans Pro', Roboto, Helvetica, Arial, sans-serif`

| Component (class) | Size | Weight | Notes |
|---|---|---|---|
| App-bar title (`.ttl`) | 17 px | 600 | project name, **white on navy app bar**, ellipsis on overflow |
| App-bar meta (`.meta`) | 12 px | 400 | `--muted` |
| Panel title (`h2` / `.card h2`) | 13 px | 700 | **uppercase**, letter-spacing .04 em, navy |
| Sub-panel / Chart title (`h3` / `.panel-head h3`) | 13 px | 700 | navy, **not** uppercase — marks a nested panel |
| Subtitle (`.sub`) | 12.5 px | 400 | `--muted`, sits under the title |
| KPI Number | 22 px (compact) / 28 px (hero) | 700 | navy |
| Body Text | 13–14 px | 400 | `--text` |
| Table Header | 13 px | 600 | white on navy |
| Caption / Label | 12 px | 400–600 | `--muted`, often uppercase |
| Button text | 12–14 px | 600 | — |

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
- Print: black-and-white friendly, landscape tables, visible status indicators,
  `box-shadow:none`, hide filter toolbars.

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

---

## 12. Adoption Status

- **PPP Dashboard** — aligned to v1.0 (tokens, font, KPI panel, symbols applied 2026-10-04).
- **MDL Control Center** — source of the tokens; aligned.
- **Future dashboards** — import §6 `:root` and follow §3–§5 layout; define own status
  vocabulary per §1.

*This standard supersedes ad-hoc styling. Any new dashboard MUST comply before release.*
