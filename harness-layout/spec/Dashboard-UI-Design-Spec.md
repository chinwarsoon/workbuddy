# Dashboard UI Design Standard

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.8 | 2026-10-24 | Codex | Made `ui/`, `data/`, and `output/` optional and made module paths project-defined; aligned the harness contract. |
| 1.9 | 2026-10-24 | CodeBuddy (AI) | Adopted the MDL shell model: §3.1/§3.2/§3.6 now define a two-row header (navy title bar + white menu bar) + navy left navigation sidebar; dropped the 48 px icon bar and the right sidebar; moved Settings/Help to the menu bar / modal; use the updated `AGENTS.md` §18.2 shell markers (`titlebar`, `menubar`, `left-sidebar`, `content`, `statusbar`). Default theme is light. |
| 1.30 | 2026-10-27 | CodeBuddy (AI) | §4.2 card-control rule reconciled with the C3 Breakdown panel:
| 1.31 | 2026-10-27 | CodeBuddy (AI) | §4.2 C3 Breakdown further refined:
| 1.32 | 2026-10-27 | CodeBuddy (AI) | §4.2 C3 Breakdown PNG/Copy restored for the Bar cards:
| 1.33 | 2026-10-27 | CodeBuddy (AI) | §4.2 C3 Breakdown summary table gained a Download button: the shared `.c3-summary` table (below the two cards) renders a header with a `⤓ Download` control that exports the current Month / Break-down-by rows as `breakdown-table.csv` (UTF-8 BOM, `.ds-gut` scrollbar spacer skipped). This complements the per-card PNG/Copy (I058). after the I057 div-grid redesign the per-card PNG/Copy buttons serialized a non-existent `<svg>`; they now rebuild the card (bars + vertical axis labels + attached table + legend) as a self-contained native SVG (rects + text) so the existing raster/copy path works for both Bar and Pie views. each card lists the full MDL discipline set (and all submitters) even when a month is zero, and draws its bars inside one aligned CSS grid whose columns also carry the vertical axis labels and an attached per-card data table (Submissions = Total Plan / First Submission / Resubmission / Under Review; Approval Status = the codes). The shared summary table is kept. This extends revision 1.30's shared-control exception. Month + Break-down-by are one shared cluster above the two cards (panel-owned), only PNG/Copy per card; the Pie view shows two donut cards (Submissions, Approval Status), not a consolidated two-ring card. This is the documented exception to "every card owns its controls" for that panel. |
| 1.34 | 2026-10-28 | CodeBuddy (AI) | §4.2 C3 Breakdown bars now carry a y-axis with grid lines + numbers, matching the C1 S-curve and C2 stacked-area panels: each card draws 5 horizontal grid lines at 0 / 25% / 50% / 75% / 100% of a nice maximum (niceCeil of the largest category total), the bars are scaled to that same max, and the numeric tick labels are right-aligned in the metric-label column and flush against the bars (no gap; aligned with the table below). Zero-discipline categories still show the empty grid. The Pie cards are exempt. Decision recorded as I060; review sample `sub/ref/sample-c3-grid-lines.html`. The harness bundled spec (`harness-layout/spec/Dashboard-UI-Design-Spec.md`) was re-synced from this file. |
| 1.35 | 2026-10-28 | CodeBuddy (AI) | §4.2 C2 Submission Flow Funnel layout: the funnel is a **vertical shape to the right of a per-Discipline table** (table left, funnel right). Its **top aligns with the first discipline row** and its **bottom — a cube block for Approved — aligns with the last discipline row** (the table header and Total row are outside the funnel span). Five stages top→bottom: Planned Deliverables → Submitted for Review → Under Review → AWC → Approved. Band widths use **square-root compression** so a large ratio between stages does not make a small stage a razor-thin sliver. Stage label is "Under Review" (not "In Review"); AWC is its own stage, separate from Approved. See `sub/ref/C2-Funnel-Sample.html`. |
| 1.36 | 2026-10-28 | CodeBuddy (AI) | §4.2 C2 Funnel refined per owner review of the first live render: stage names and values moved to a **left label gutter** (right-aligned beside the bands, theme-aware text color) so long names like "Submitted for Review" never clip against a narrow band; the separate legend row was removed (every stage is labeled beside its band); the Approved base is now a **solid square block** (92 px, owner request) instead of a sliver-wide 3D cube whose label overflowed. Funnel column widened to 350 px. Fixed I064 first: the funnel had never rendered because the stage key `underReview` did not match `c2.funnel`'s `inReview`, so every path coordinate was `NaN`. Logged I065; workplan changelog 2.43. |
| 1.29 | 2026-10-27 | CodeBuddy (AI) | §3.4 Responsive layout enhanced with §3.4.1 Panel size fits the screen. Panels MUST follow the content width at every screen scale (including Control + scroll zoom) and MUST NOT keep a first-render pixel width; the KPI panel (auto-fit grid, no fixed widths) is the reference. Scope is panel size only; inner cards may keep a fixed width by requirement (for example, a constant bar width). |
| 1.28 | 2026-10-25 | CodeBuddy (AI) | §4.2 S-curve clarified from the Submittal C1 re-review: the chart-card board is a 1 px border around the whole chart component (control cluster + plot), not an in-plot rectangle, so the one-board / one-card-border rule is unambiguous; the y-max MUST use the raw visible maximum with a small headroom pad (~3%) and MUST NOT be rounded up to a power-of-ten step, so the curves fill the chart height like the MDL reference. Workplan D35 / §7 now include the Forecast bar (`fNew`). |
| 1.27 | 2026-10-25 | CodeBuddy (AI) | §4.2 S-curve hardened from the Submittal C1 review: a Month / Quarter / Year time-grain toggle MAY be offered (rebuckets labels, bars and the cumulative curve); the period window MAY be a bar / brush selection that wraps below when narrow; the control cluster is right-aligned by default and the period selection MAY be left-aligned with the filters (grain, Bars, series multi-select) preceding the exports (PNG, Copy) on the right; the combined-chart legend SHOULD be in-SVG at the bottom (not an HTML `.legend`); dense x-axis labels MAY be inclined (rotated ~40°) hugging the axis with the legend kept clear; and a hover snap line with a floating window is RECOMMENDED. The PNG / Copy, one-board / one-card-border, absolute-cumulative, Start / Today and shared-scale rules were already normative. |
| 1.26 | 2026-10-24 | CodeBuddy (AI) | §4 panel chrome made enforceable. The title row now has its own element — the 10 px gap belongs to the row and the `h2` is `margin:0` — because the sketch previously put the flex on the `h2`, which only works when the buttons sit inside the heading. Four rules added: **numbers follow DOM order, assigned after render** (numbering from construction order produced `1, 2, 4, 3`), with the `::after` badge gated on `[data-panel]` so an unnumbered sub-panel does not render a bare `Panel`; **nested sub-panels inherit the parent's number and show no badge**; **the panel margin yields to a grid gap** (`0` inside a grid that sets `gap`, or the spacing doubles); and **the collapse state outlives the element** — it MUST be persisted in view state, keyed by panel name, and re-applied on render, or a filter change silently re-opens the panel. The sketch CSS is updated to match. |
| 1.25 | 2026-10-24 | CodeBuddy (AI) | The title-bar page label is larger and unstyled. §3.1 revises the active-page rule: the label is now **16 px / 600 at `line-height:1.2`**, one step below the 17 px project title, and is **plain text with no background, padding, border or radius** — a page indicator rather than a badge or pill. Version 1.24 had put it at the menu-bar control scale (12 px / 600) inside a translucent pill. |
| 1.24 | 2026-10-24 | CodeBuddy (AI) | The content toolbar is removed, and the page name and layout toggle move into the shell. §3.3 adds a normative rule: there is no content toolbar — a dashboard MUST NOT render a strip above its panels holding a page heading, subtitle or layout control — and the content zone begins with the optional filter area and then the body. §3.1 adds two rules: **the active page is shown in the title bar** — right-aligned on the bar's 20 px padding, at 12 px / 600, updated on every selection change, announced with `aria-live="polite"`, and not repeated as a heading in the content area — and **the layout toggle lives in the menu bar** — an icon control at the right end after the filter group, never in the content area, using the compact 8 px padding. §3.1's shell markers no longer require a `toolbar` zone. |
| 1.23 | 2026-10-24 | CodeBuddy (AI) | The left-panel width is sized to its menu titles. §3.2 adds a normative rule: `--sidebar-w` is 160 px, derived from the widest title — "Forward Plan" measures 91 px at 14 px / 400, which with the button's 12 px horizontal padding and the panel's 10 px padding needs 135 px, plus 25 px of slack. A dashboard whose menu titles differ MUST derive the width the same way and MUST NOT let a title wrap or clip; resizing MUST clamp at the width where the widest title still fits, 140 px here. |
| 1.22 | 2026-10-24 | CodeBuddy (AI) | The left panel holds menus only. §3.2 adds a normative rule: the left sidebar MUST contain only menu items — the page links, then Settings and Help pinned to the bottom with `margin-top:auto` — and MUST NOT contain a collapse toggle (which belongs in the menu bar), section titles, or divider rules; its resizer MUST remain. §3.1 now records that the `data-shell-toggle="left-sidebar"` control sits in the menu bar rather than in the sidebar, and §3.2 no longer lists Help among the menu-bar contents. |
| 1.21 | 2026-10-24 | CodeBuddy (AI) | The sidebar toggle is compact. §3.1 adds a normative rule: the left-panel toggle is one glyph, so it MUST NOT carry the 14 px horizontal padding of a text control — it uses 8 px horizontally, the gap after it is 8 px rather than the menu bar's 12 px, and it keeps the menu-bar control's 32 px height and 12 px / 600 type, with its left edge on the bar's 20 px padding aligned with the title-bar logo. |
| 1.20 | 2026-10-24 | CodeBuddy (AI) | Title-bar logo and menu-bar control metrics, measured against MDL. §3.1 adds two normative rules: **title-bar logo** — the logo is 36 px tall, MUST NOT shrink (`flex-shrink:0`), and the brand group uses a 12 px gap — and **menu-bar control metrics** — a menu-bar button is 12 px / 600 at `line-height:1.2` with `min-height:32px` and `padding:7px 14px`, while a filter trigger is 12 px / 600 at `line-height:normal` with `min-height:32px` and `padding:7px 12px`; both render 32 px tall. |
| 1.19 | 2026-10-24 | CodeBuddy (AI) | Title-bar and menu-bar spacing. §3.1 adds two normative rules: **title-bar spacing** — the rows stack in a `.ttl-stack` column with a 2 px gap, the project title is 17 px / 600 at `line-height:1.2`, and a dashboard MUST NOT substitute its own line height for the stack — and **menu-bar gap** — 12 px between groups, 8 px inside each group, plus a 6 px left margin on the Warnings toggle. §6 type scale gains two normative rows: title-bar project title 17 px / 600 and title-bar dashboard title 12 px / 500. |
| 1.18 | 2026-10-24 | CodeBuddy (AI) | Menu-bar typography and alignment. §3.1 adds two normative rules: **menu-bar alignment** — the left-panel toggle, the load action and Export are left-aligned, and everything else (filter triggers, Search with its popover, Warnings) is right-aligned, mirroring MDL's `justify-content:space-between` — and **menu-bar type is bold** — every control in the menu bar MUST be 600, never the default body weight. §6 type scale gains a normative row fixing the menu-bar control at 12 px / 600. |
| 1.17 | 2026-10-24 | CodeBuddy (AI) | MDL parity for the filter chrome. §7.1 **B1** no longer requires a caret glyph or a visible border: the trigger is text plus a count badge, and it is **borderless in the menu bar** (the base control keeps 1 px `--border`, which the menu-bar chrome strips). §7.1 **B3** replaces the `.chips label` pill with MDL's structure — an `.tf-all` `All <dimension>` master, a hint, a divider and `.tf-item` value rows — and the grammar table, the global-dimension paragraph and the normative class list now name `tf-all` / `tf-item` instead of `chips`. §6 type scale: the filter menu row is 12 px (was 11 px) and a new normative row fixes the count badge at 10 px / 700. |
| 1.16 | 2026-10-24 | CodeBuddy (AI) | Corrected the shell composition for MDL parity: §3.1 now states the menu bar holds the actions group (the highlighted load primary plus Export), the global filter group (triggers, Search with its popover, Warnings) and Help, that Settings is NOT in the menu bar but a menu in the left side panel, that the menu bar MUST NOT wrap to a second row (the filter group scrolls horizontally instead), and that the load control MUST be the one highlighted `.btn-primary` control. §3.2 now states the left side panel holds page links and Settings and MUST NOT hold workbook-loading controls. |
| 1.15 | 2026-10-24 | CodeBuddy (AI) | Added §6 Typography (normative): one shared `--font-ui` stack and one shared type scale (body 13/1.45, panel h2 13 uppercase, chart-card h3 13/700, KPI value 22/700, KPI label 10 uppercase, icon button 13/600, filter trigger 12/600, filter chip 11, single-select 12/600, title-bar meta 11, system banner 12, severity chip 11/700). Added §7.1: global dimensions MUST be multi-select and MUST use B1 `.tf-btn` + B3 `.chips label` with a count badge and an `All <dimension>` master toggle; B5 is reserved for non-row-filter pickers and the B6 panel-local filter; the menu-bar filter group MUST contain the triggers, Search and Warnings; and the classes `tf-btn` / `chips` / `tf-panel` are normative. |
| 1.14 | 2026-10-24 | CodeBuddy (AI) | Added §3.1 title bar rows (mandatory): the title bar MUST show three rows rendered from model metadata — project title, dashboard title(s) joined with ` · ` when the two workbooks differ, and project start plus as-of date. Added §3.7: workbooks MUST be identified by the `Dashboard Title` in their Code sheet, matched against the contract, never by file name; a selection MUST be inspected in full and committed only when every check passes, rejecting the whole selection (non-readable file, no Code sheet, no dashboard title, unmatched title, same type twice, or differing `Project Title`) with the reason shown and no partial update; the check SHOULD read the Code sheet only. |
| 1.13 | 2026-10-24 | CodeBuddy (AI) | Added §3.9 standalone delivery (mandatory): a dashboard is one self-contained HTML that MUST run from `file://` with no web server — no `fetch` of local files, no cross-file ES-module `import`, stylesheet / config / engine / images inlined, no local `href` or `src` references; source modules stay separate for the test harness. Added conformance assertion 15 in §8.2. |
| 1.12 | 2026-10-24 | CodeBuddy (AI) | Broadened the §7.1 casing rule to **control label casing**. It now names the applicable cases (button labels; a `<label>` rendered as a button; form-control labels for checkbox, radio and select; navigation and menu items) and the excluded cases (prose, sentences, hints, status messages, placeholders, data values, `title` / `aria-label` wording). |
| 1.11 | 2026-10-24 | CodeBuddy (AI) | Added §7.1 button label casing (mandatory): every visible button label MUST use title case, capitalising the first letter of every word. Added §3.7: the welcome instruction card MUST NOT carry a label prefix such as `What this does —`; show only the instruction text. |
| 1.10 | 2026-10-24 | CodeBuddy (AI) | Hardened §3.7 (initial / file-loading state): the welcome is an MDL-style full-screen overlay that hides dashboard chrome until load; fixed-proportion welcome surfaces (file drop area, welcome card) SHOULD use the golden ratio (1 : 1.618); the load buttons MUST live inside the file drop area; and the welcome MUST NOT hardcode a project title (the project/dashboard title renders from the loaded model after load). |
| 1.7 | 2026-10-24 | Codex | Defined stable shell markers and aligned the harness with project-local dashboard assets. |
| 1.6 | 2026-10-24 | Codex | Made dashboard UI assets project-local and aligned the harness contract with the shell spec. |

**Version**: 1.27
**Date**: 2026-10-25
**Last revised**: 2026-10-25 — Dashboard assets are project-local; `common/` does not apply. A dashboard does not require `ui/`, `data/`, or `output/` folders. Each dashboard workplan defines module and configuration paths. The shell geometry and behavior follow `AGENTS.md` §18.2. The warning area stays inside the content area. Prior (2026-10-22) — **generalised**: the spec is now a project-neutral standard. Every
dashboard-specific detail — the two-row header instantiation, the per-dashboard migration state, the
enforcement posture, the legacy class aliases and their migration dates, the regression/issue history —
moved to the owning dashboard's workplan, with a pointer back to the clause it satisfies. Added §0
**Definitions** and §8 **Conformance & Testing** (two-layer check model, 14 required assertions,
enforcement posture, conformance record, definition of done) plus §9 **Adopting this spec**. Prior
(2026-10-21) — §7.2.15 **standardised**: the split header is now required for **every** bounded data table (`.tableScroll`), single-row headers included, and a sticky `<thead>` inside a table scroller is retired; §4.3's container rule aligned to match. Driven by the vertical-scrollbar standardisation review. Later the same day: §7.2.15 invariant 5
clarified — "unavoidable" horizontal scrolling is now defined objectively (Σ minimum column widths >
available width), so the fit requirement is testable. Prior (2026-10-19): §7.2.7 extended with the no-duplicate-filter-dimensions rule (overall requirement; each dashboard records its own dimension list in its workplan, §1). Prior (2026-10-19): §7.2.7 added (Filter population rule: two-tier global-first → panel cascade); S4 Derive row and the two-row header variant hardened to state the cascade. Driven by the filter-behaviour review.
2026-10-18 — §7.2.15 added (split-header / fragment-pairing contract, six normative
clauses) and `.vheadtab` + `.ds-gut` added to the normative class table. Driven by the split-header review.
**Owner**: UI Design
**Applies to**: every internal control-center dashboard — present and future

> This document is the shared source for dashboard layout, components, and behavior. Dashboard pages
> use project-local CSS and JavaScript. `AGENTS.md` §18.2 defines the shell geometry and behavior.
>
> **It is a general standard, not a project log.** This spec states *what any dashboard must do*.
> Anything that belongs to one dashboard — its status vocabulary, its dimension list, its migration
> state, its issue history — lives in **that dashboard's own workplan**. A reference to a specific
> dashboard in this document is either an illustration of a general rule or a pointer to the
> workplan; it is never a rule that applies to one dashboard only.

---

## 0. Definitions

These terms are used normatively throughout this spec.

| Term | Meaning |
|---|---|
| **Dashboard** | One internal control-center application (its own page, pipeline and workplan). |
| **Workplan** | The dashboard's own document: its data contract, module specs, decisions and its **spec-conformance record** (which spec clauses it satisfies, how, and any deviation). Cited from §1. |
| **Panel** | The atomic page unit (§4). The CSS class name is free. |
| **Bounded data table** | A long list rendered inside a scroller with a fixed max-height — never an open-ended list (§4.3). |
| **Split header** | A `<thead>` rendered outside the scroll container as a thead-only fragment, so the vertical scrollbar starts below the header (§7.2.15). |
| **Global dimension** | A filter dimension exposed in the global filter area whose selection re-derives the shared set for **every** panel (§7.2.7). Which dimensions are global is a per-dashboard decision. |
| **`active`** | The single reduced working set produced by S4 Derive after the global dimensions are applied. Every panel derives from it (§3.8, §7.2.7). |
| **Panel filter** | A control that narrows one panel's rows, applied in S5 on top of `active`. It can only narrow further (§7.2.7 pt 2). |
| **Panel-local filter** | A panel filter that affects **only the tables inside its own panel** — never KPIs, charts, the matrix or another panel (§7.2.7 pt 6, §7.1 B6). |
| **Layout control** | A control that changes *how* something is presented (which columns are shown, which sort applies) and never which rows are returned. It must not use filter chrome (§7.1 B7). |
| **Chrome** | The visual treatment of a control — its shape, badge and emphasis. Chrome must let the reader tell a row filter from a layout control (§7.1 B). |
| **Conformance check** | An automated assertion that a rendered dashboard satisfies a normative clause (§8). |

---

## 1. Scope & Governance

- **Shell rules.** Every dashboard follows the shell geometry and behavior in `AGENTS.md` §18.2.
  Dashboard pages are an exception to §18.1's `common/` asset dependency: each project owns its CSS
  and JavaScript. The dashboard project layout in this spec and its workplan also overrides the generic
  folder list in `AGENTS.md` §6 for `ui/`, `data/`, and `output/`; those folders are optional. The dashboard
  spec and harness define the common contract.
- **Project-local UI source.** Each dashboard implements this spec's tokens and shell behavior in its
  project-local assets. The workplan defines their paths. A `ui/` folder is optional. Keep token values,
  shell dimensions, and component behavior aligned with this standard. Do not add a repository-level
  `common/` dependency for dashboards. Test every UI theme.
- **Layout and component rules are mandatory** (§3–§5, §7), subject to the priority rule above.
- **Status vocabularies are per-dashboard.** Each dashboard defines its own status text and
  symbols and records them in its own workplan. What is *shared* is only the **principle**:
  every status carries **Icon + Text + Colour**. Do not copy another dashboard's status labels.
- **Dashboard-specific content belongs in the workplan.** Whenever this spec says a dashboard
  *may* choose, or names a dimension, a label, a migration step or an enforcement posture,
  the choice is recorded in that dashboard's workplan — not here. The workplan then cites the
  spec clause it satisfies, so the two documents stay traceable to each other.
- **Applicability is explicit.** Domain examples (such as package counts, project-start dates, or a Code sheet) apply only when the dashboard has that data. The workplan marks each inapplicable rule as N/A and names the source contract.
- **Philosophy is fixed** (§2). Divergence requires a documented design decision.

---

## 2. Design Philosophy

> Professional Document Control System **first**, Dashboard **second**.

**Style**: Clean Industrial · Swiss Modernist · Enterprise Application

**Influences**: Microsoft Project · Primavera P6 · SharePoint Modern · Engineering
Document-Control Systems · Enterprise Project-Management Platforms

**Design goals** — these guide design; they are not release gates unless a workplan defines a review.
- High information density. Aim to make overdue items and exceptions easy to find.
- Readable during a full work day.
- Accessible controls: use icon + text + colour and meet AA contrast.

**Explicitly avoided**
- Glassmorphism / heavy translucency / blur
- Excessive animation
- Consumer-app styling
- Large decorative charts
- Neon colour themes
- **Apple "Bento" soft-tile aesthetic** (large radii, shadow-only separation, airy
  whitespace) — inappropriate for dense data tools.

---

## 3. App Shell & Layout Architecture

### 3.1 Shared application shell
Every dashboard MUST use the shell in `AGENTS.md` §18.2 (MDL two-row header + left navigation
sidebar): a navy title bar, a white menu bar, a collapsible/resizable navy left sidebar, a
scrollable content area, and a full-width navy status bar. There is no 48 px icon bar and no
right sidebar; primary navigation lives in the left sidebar, and Settings / Help / Detail live
in the menu bar or modal dialogs. Implement the shell in project-local UI assets.

For repeatable automated checks, shell zones MUST carry these stable attributes:
`data-shell="titlebar"`, `menubar`, `left-sidebar`, `content`, and `statusbar`. The `content`
zone MUST contain `data-shell="filter-area"` (optional) and `body` in that order, and MUST NOT
contain a `toolbar` zone (§3.3).
These attributes identify structure; they do not prescribe CSS class names. The left sidebar
control MUST use `data-shell-toggle="left-sidebar"` — that control sits in the **menu bar**, not in
the sidebar itself (§3.2) — and its resizer MUST use `data-shell-resize="left-sidebar"`. If a warning area is present, it MUST use
`data-shell="warnings"` and remain a descendant of the content zone.

- **Title bar rows (mandatory).** The title bar MUST show three rows in this order, rendered from the
  loaded model's metadata and never from static text:
  1. the **project title**;
  2. the **dashboard title(s)** of the loaded workbooks — when the workbooks carry different titles,
     show both, joined with ` · `; omit this row when no dashboard title is available;
  3. the **project start date** and the **as-of date**.

  This mirrors MDL's `.ttl` / `.sub` / `.meta` block.
- **Title-bar spacing (normative).** The three rows stack in a `.ttl-stack` column with a **2 px**
  gap, as MDL's does. The project title is 17 px / 600 with `line-height:1.2`; the dashboard-title
  row is 12 px / 500 and the date row is 11 px / 400, both at the body line height. A dashboard MUST
  NOT substitute its own line height for the stack — setting 1.25 there made the title bar 70 px
  against MDL's 78 px.
- **Title-bar logo (normative).** The logo is **36 px** tall and MUST NOT shrink (`flex-shrink:0`),
  and the brand group holding it uses a **12 px** gap, as MDL does.
- **The active page is shown in the title bar (normative).** The title bar MUST show the currently
  selected left-panel page, **right-aligned** — the bar is `justify-content:space-between` with the
  brand group on the left and this label on the right, sitting on the bar's 20 px padding. The label
  MUST be **16 px / 600 at `line-height:1.2`** — one step below the 17 px project title, so the two do
  not compete — and MUST be **plain text, with no background, padding, border or radius**. It is a
  page indicator, not a badge or a pill. The label MUST update whenever the selection changes and MUST
  announce the change with `aria-live="polite"`. Because the page name lives here, the content area
  MUST NOT repeat it as a heading (§3.3).
The menu bar holds, **on a single row**: the actions group (the highlighted load primary plus
Export), the global filter group (the filter triggers, Search with its popover, and the Warnings
toggle), and the layout toggle at its right end. **Neither Settings nor Help is in the menu bar** —
both are menus in the left side panel (§3.2). The active page name lives in the title bar, not in
the content area (§3.3). Search opens a search panel; it is not an inline text field. Use the
button, sidebar, layout, and help behavior defined by this spec.
- **The menu bar is one row (normative).** The menu bar MUST NOT wrap to a second row.
- **The filter group MUST NOT be a scroll container.** Setting `overflow` on it clips the floating
  filter panels that hang below the menu bar, which makes their toggles unreachable.
- **The load action is the primary.** The control that chooses or reloads the workbooks MUST be the
  one highlighted (`.btn-primary`) control in the menu bar, as MDL's "Load Workbook" is.
- **Menu-bar alignment (normative).** The left-panel toggle, the load action and Export are
  **left-aligned**. Everything else — the filter triggers, Search with its popover, and the Warnings
  toggle — is **right-aligned**. This mirrors MDL, whose menu bar is `justify-content:space-between`
  with the actions group on the left and the filter group on the right. A dashboard MUST NOT render
  the filter group immediately after the actions group with no gap.
- **Menu-bar type is bold (normative).** Every control in the menu bar MUST be **bold (600)**, as
  MDL's are. A dashboard MUST NOT render a menu-bar control at the default body weight.
- **Menu-bar gap (normative).** The menu bar uses a **12 px** gap between its groups and **8 px**
  inside each group, as MDL does, and the Warnings toggle carries a further **6 px** left margin.
- **Menu-bar control metrics (normative).** A menu-bar button is 12 px / 600 at `line-height:1.2`
  with `min-height:32px` and `padding:7px 14px`. A filter trigger is 12 px / 600 at
  `line-height:normal` with `min-height:32px` and `padding:7px 12px`. Both render 32 px tall.
- **The layout toggle lives in the menu bar (normative).** Where a dashboard offers a panel-layout
  control, it MUST be an icon control at the **right end** of the menu bar, after the filter group,
  and MUST NOT sit in the content area. Being an icon, it uses the compact 8 px horizontal padding
  (§3.1) rather than the 14 px of a text control.
- **The sidebar toggle is compact (normative).** The left-panel toggle is a single glyph, so it MUST
  NOT carry the 14 px horizontal padding of a text control. It uses **8 px** horizontally, and the gap
  after it is **8 px**, not the menu bar's 12 px. It keeps the menu-bar control's 32 px height and its
  12 px / 600 type, and its left edge stays on the bar's 20 px padding, aligned with the title-bar
  logo. A dashboard MUST NOT render it as a full-width text control.

### 3.2 Navigation
Use the left sidebar and menu bar described in `AGENTS.md` §18.2. The left sidebar holds primary
navigation (page links), with Settings and Help pinned to its bottom; it MUST NOT hold
workbook-loading controls — those belong in the menu bar (§3.1). The menu bar holds the actions group
and the global filter group with Search and Warnings. A project may change sidebar or menu content,
but it MUST keep the shell controls and behavior defined by this spec (left-sidebar toggle/resize,
menu-bar filter group, warning area inside content).
- **The left panel holds menus only (normative).** The left sidebar MUST contain **only menu items**:
  the page links, then Settings and Help pinned to the bottom (`margin-top:auto`). It MUST NOT contain
  a collapse toggle — that control belongs in the menu bar (§3.1) — and it MUST NOT contain section
  titles or divider rules between its groups. Its resizer MUST remain, carrying
  `data-shell-resize="left-sidebar"`, because the panel stays resizable.
- **Left-panel width (normative).** The left panel MUST be sized to its menu titles, not to an
  arbitrary fixed width. `--sidebar-w` is **160 px**, derived from the widest title: "Forward Plan"
  measures 91 px at 14 px / 400, which with the button's 12 px horizontal padding and the panel's
  10 px padding needs **135 px**, and 25 px of slack is left on top. A dashboard whose menu titles
  differ MUST derive its width the same way — widest title, plus the item's horizontal padding, plus
  the panel's padding — and MUST NOT let a menu title wrap or clip. Resizing MUST clamp at the width
  where the widest title still fits, which is 140 px here.

### 3.3 Content area
The content area owns a scrollable body and **has no toolbar**. Render panels (§4), dashboard metrics
(§5), and any disclaimer in this body. Keep page-level scrolling disabled as required by `AGENTS.md`
§18.2. Panel grids may change with the available content width. Do not set a fixed page width that
reduces the shell's flexible content area.
- **There is no content toolbar (normative).** A dashboard MUST NOT render a horizontal strip above
  its panels holding a page heading, a subtitle, or a layout control. The content zone begins with
  the optional filter area (the warning surface) and then the body. The page name belongs in the
  title bar (§3.1) and the layout toggle in the menu bar (§3.1), so nothing is lost by dropping it.

### 3.4 Responsive layout
The shell rules define sidebar resizing and collapse behavior. Panel and KPI grids MUST fit the
remaining content width without horizontal page scrolling. Each workplan records its grid breakpoints
and the minimum usable width for its controls. Do not change shell breakpoints or sidebar rules.

#### 3.4.1 Panel size fits the screen (screen scale / zoom)
Panels are the outermost content containers: the `.panel` surface, the `.kpi-grid` and the panel-grid
cells. Their size MUST follow the available content width at every screen scale, including browser
zoom set with Control + mouse scroll. A panel MUST NOT keep a first-render pixel width when the
viewport or the zoom changes. It MUST reflow so it always fills the column it occupies.

The KPI panel is the reference pattern. Its cards use an auto-fit grid
(`repeat(auto-fit, minmax(210px, 1fr))`) with no fixed pixel widths, so the cards fill the width and
reflow as the column narrows or widens. Every other panel MUST reach the same result: a fluid grid or
flex container whose columns are `1fr` (or `auto-fit`), never a hard-coded pixel width that freezes
the panel at its first render.

This rule covers panel size only. It does NOT govern the cards, charts or tables inside a panel. An
inner card MAY keep a fixed pixel width where a requirement demands it (for example, a constant bar
width so values compare across months). Such inner fixed widths are out of scope for §3.4.1; the
panel around them MUST still fit the screen. A panel that contains fixed-pixel inner content (for example, a split-header table) MUST re-sync that content on the `window` / `visualViewport` resize event as well as on element resize: browser zoom changes the screen scale without always re-firing an element `ResizeObserver`, so without the window / `visualViewport` listener the inner content keeps its first-render pixel width and does not follow the zoom. The panel grid itself MUST use `minmax(0, 1fr)` tracks with responsive breakpoints (or an `auto-fit` pattern like the KPI grid) so it reflows — dropping columns as the width shrinks — instead of keeping a fixed first-render column count that overflows the screen on zoom; the chosen `data-layout` count is the maximum, not a fixed floor.

This requirement was confirmed in the Submittal dashboard review (panel-fit-to-screen, 2026-10-27):
the KPI panel is the reference, and inner cards with a fixed bar width are explicitly out of scope.

### 3.5 System and configuration notices
Show notices in one warning area inside the content area. The area spans the content area's width and
MUST NOT cover either sidebar. Do not use a viewport-wide fixed bar. The area MUST use `role="alert"`
and `aria-live="assertive"`; hide it when empty. Show fatal, warning, and info notices in that order,
with icon, bold code, and message. Use semantic tokens defined in the dashboard project's UI stylesheet.

The area may collapse, but its button keeps the visible label `Warnings` in both states. A count may
appear in a badge. Keep notices and the count while collapsed. Persist the choice with a project-
prefixed local-storage key. Hide the warning area in print. A parse failure appears as a fatal notice.
Formula-error tokens that can corrupt counts appear as one fatal notice per affected column; see
§3.8.4. Row-level data issues belong in the Validation panel (§4.5).

### 3.6 Status information
Use the full-width status bar from `AGENTS.md` §18.2 (~30 px, navy). Its left and right values are
dashboard-specific and MUST be named in the workplan. Do not prescribe package counts, percent
started, or other domain metrics here. The shared status bar owns its height and position. Keep
scrollable content clear of it through the shell layout; do not add a second fixed bar.

### 3.7 Initial and file-loading state (MDL welcome pattern)
A dashboard shows a welcome / first-run screen before the workbooks load. Follow the MDL pattern:

- **Welcome overlay.** The welcome is a full-screen, centred overlay. It MAY hide the dashboard
  chrome (header, menu bar, sidebars, status bar) until the first successful load — MDL builds the
  shell only after load. Do not show dashboard panels or navigation before load. (This supersedes the
  older "keep the shell visible" guidance; the MDL welcome is the reference behaviour.)
- **Ratio.** The welcome fills the viewport (the MDL ratio: width and height are 100% of the
  viewport, fluid, no fixed aspect ratio, no page scroll) per `AGENTS.md` §18.2. Fixed-proportion
  surfaces on the welcome — the file drop area and the welcome card — SHOULD use the golden ratio
  (1 : 1.618) for their width : height.
- **Load controls live inside the drop area.** The file-drop zone MUST contain its action buttons
  (Choose / Load). The drop zone is both the click target and the drag-and-drop target.
- **The instruction card has no label prefix.** The welcome instruction card MUST NOT carry a lead-in
  label such as `What this does —`. Show only the instruction text; bold the file names inside it.
- **Workbooks are identified by content, not by file name.** A dashboard MUST decide which workbook
  is the Master Document List and which is the Submittal Log by reading the `Dashboard Title` entry
  in that workbook's Code sheet and matching it against the expected values in the source contract
  (§3.8.3). File names vary between projects and MUST NOT be used to classify a workbook.
- **A selection is validated before it is applied.** When workbooks are chosen or dropped, the
  dashboard MUST inspect all of them first and commit the new selection only when every check
  passes. It MUST reject the whole selection and change nothing when: a file is not a readable
  workbook; a file has no Code sheet; the Code sheet carries no `Dashboard Title`; the title matches
  no expected value; two files resolve to the same workbook type; or the two `Project Title` values
  differ. A rejection MUST show the reason on the welcome and MUST leave the previous selection
  intact. No partial update is permitted.
- **Inspection reads only what it needs.** The selection check SHOULD read the Code sheet only, not
  the whole workbook, so checking does not pay the cost of a full parse.
- **No hardcoded project title.** The welcome MUST NOT display a project-specific title, because the
  project title is unknown until the workbooks load. Show at most a generic application label. Render
  the real project / dashboard title from the loaded model in the shell title bar after load, never from
  static HTML.
- **File-loading behaviour.** Use the file-loading panel in `AGENTS.md` §18.7: default-path load where
  the project has a default file, local file picker, drag-and-drop, loaded-file list, and active-file
  status. A dashboard may require related files; its workplan must list each required file, selection
  order, and validation behaviour. Put project-specific instructions in the file panel or `ui_help.json`.

### 3.8 Data-Processing Pipeline (mandatory)

Any dashboard that ingests a workbook (`.xlsx`, `.csv`, or similar) MUST follow this single,
predictable pipeline. **Objective: parse once → normalise once → validate once → derive on demand**,
so filter changes are fast (no re-parse) and every aggregation lives in exactly one place (no
duplicate KPI engine).

#### 3.8.0 Module structure requirement

The dashboard UI MUST use separate, importable JavaScript modules. Do not put the whole pipeline in
one HTML file. Load modules with native browser imports. Do not add a bundler, build step, or npm
runtime dependency. A dashboard workplan defines the module paths. A suitable layout is:

```
<project-root>/<dashboard>.html
<project-root>/<workplan-defined-path>/xlsx-reader.js
<project-root>/<workplan-defined-path>/pipeline.js
<project-root>/<workplan-defined-path>/render.js
```

The HTML file is the project entry page in the project root. A dashboard does not require `data/`
or `output/` folders. Use project-local assets and root-relative paths. Serve the
page with the project `serve.py` required by §18.12. Separate modules make each stage testable and make stage boundaries clear. Any
project-specific data-preparation engine may use its declared stack. The HTML layer still follows
`AGENTS.md` §18.1.

#### 3.8.1 Stages

| # | Stage | Module | Responsibility | Input → Output | Runs |
|---|---|---|---|---|---|
| S0 | Acquire | `xlsx-reader.js` | Read raw bytes from the file input; no parsing. | `File` → `ArrayBuffer` | On file open only |
| S1 | Parse | `xlsx-reader.js` | Parse the container into an in-memory workbook (sheets / rows / cells). | `ArrayBuffer` → `workbook` | On file open only. The raw `workbook` is **discarded after S2** — only the normalised model is retained. |
| S2 | Ingest / Normalize | `pipeline.js` | Turn raw rows into a normalised **record table**: typed fields (Date/Bool coercion), `isActive`, and domain-specific fields; build contract/lookup tables and `meta` (project info, today). **No aggregation or KPI math.** Normalization treats a cell as **absent (`undefined`)** when it is blank (empty after `trim`) **or** a spreadsheet formula-error token — see §3.8.4. | `workbook` → `model{ records[], contract, meta }` | On file open only; held in memory for the session. |
| S3 | Validate | `pipeline.js` | Run row-level, **filter-independent** validation rules once. Emits `issues[]` (per-row data problems) and `warnings[]` (system/config notices). | `records` + validation context → `issues[]`, `warnings[]`, `completenessGroup` | On file open only. |
| S4 | Derive / Aggregate | `render.js` | **On demand**, given the current filter/UI state: apply the **global** filters (`Discipline`, `Stage`, `Search`) to `records` to produce the single shared `active` working set (the first gate), then compute **all** aggregations — KPIs, overdue lists, charts, matrix, completeness% — from `active`. Panel-level filters are applied later, in S5 Render, on top of `active` (see §7.2.7). This is the **sole** source of KPI numbers. | `model` + `STATE` → `view{ active, kpis, issues, charts, panels, … }` | On every filter change / render. |
| S5 | Render | `render.js` | Paint DOM panels from `view`. Write-only: never reads from the DOM to make decisions. | `view` → DOM | On every render. Keep the deferred-render rule: repaint once when the filter dropdown closes, not on every in-dropdown toggle. |
| S6 | React-to-filter | `render.js` | Refresh loop. | user action → `deriveView(model, state)` → `render(view)` | On filter change. **Never re-runs S0–S3; the file is never re-parsed.** |

#### 3.8.2 Mandatory pipeline rules

1. **One source of truth for aggregations.** KPI / chart / overdue math lives in **exactly one**
   place (S4 in `render.js`). A pipeline stage (S2/S3) MUST NOT also compute KPIs that S4
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
   `render(view)` is the only entry point for DOM updates. `deriveView(model, STATE)` returns the view.
8. **Error handling at every stage boundary.** Each stage transition MUST be wrapped in its own
   `try/catch`. A failure in S1 (parse) shows a fatal load error; a failure in S3 (validate)
   shows a validation-failed error but does not hide the dashboard; a failure in S4 (derive)
   shows a render error for the affected panel only. Stages MUST NOT share a single outer
   `try/catch` — that collapses distinct failure modes into one undifferentiated error message.
9. **As-of and project-start are distinct anchors.** `meta.today` (as-of) is the **viewer's
   local system date** — built from local date components, **never** `toISOString()` (UTC), which
   introduces a 1-day off-by-one near local midnight. As-of drives every Overdue / Approval /
   look-ahead / completeness calculation. A project-start date, when the data source provides one is an **x-axis origin for date-curve panels only** (S-curve / throughput); it
   MUST NEVER feed Overdue, approval, or schedule-variance math. On the S-curve the x-axis is
   **anchored at the earliest data date** and carries two reference lines: **Start** (the
   project-start date, red dashed) and **Today** (as-of, using the shared text color).
10. **Blank and formula-error are the same "absent" state.** See §3.8.4.

#### 3.8.3 Source-contract parsing (mandatory)

The input source defines the data contract. The pipeline MUST read field positions, lookup domains,
and validation wording from that contract at runtime. It MUST NOT hard-code source positions or
allowed-value lists. For an Excel workbook with a `Code` sheet, use that sheet as the contract. For
a source without a contract sheet, the dashboard workplan must name the approved schema or header map.

1. **Scan the full contract source** — for a `Code` sheet, do not assume a fixed row range.
2. **Discover by labels** — for a `Code` sheet, match block labels without case sensitivity.
3. **Resolve positions at runtime** — use the source header or field map. Do not hard-code column
   letters, row numbers, or fixed source ranges.
4. **Read values to the end of each block** — use the block rules in the source contract.
5. **Report missing contract fields** — a missing required field is a validation error. A missing
   optional lookup block is a warning. Never replace a missing source value with an empty set silently.
6. **Keep rule text in its contract** — use source rule wording and severity when the source defines
   them. If it does not, use the dashboard workplan rule and report that source in the validation view.

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
testable without the full page or DOM:

- A test harness MUST exist in the project test folder and use the approved project test runner.
- It MUST import the pipeline module directly and run it against representative source data.
- It MUST assert record counts, KPI values, lookup values, and validation counts from known cases.
  Check rule messages and severity against the source contract when it defines them; otherwise check
  them against the dashboard workplan.
- It MUST pass with zero failures before any release. A failing harness blocks release.
- The layout harness (`harness-layout/`) imports `pipeline.js` to compute ground-truth values
  and compares them against what the rendered page shows — this is only possible because the
  pipeline is a separate module (§3.8.0).

### 3.9 Standalone delivery (no web server) — rev 2026-10-24

A dashboard is delivered as **one self-contained HTML file** that MUST run when it is opened directly
from disk, over the `file://` protocol. It MUST NOT require a web server, and it MUST NOT need
network access at runtime.

- **No server.** Opening the file from the file system MUST fully work. Do not document or require a
  local web server (for example `python -m http.server`) in order to use the dashboard.
- **No blocked fetches.** The `file:` origin blocks `fetch` and `XMLHttpRequest` against local files,
  and it blocks an ES-module `import` of one local file from another. A dashboard therefore MUST NOT
  load its configuration, help text, or any other local resource with `fetch`, and MUST NOT rely on
  importing one local script file from another.
- **Inline everything.** The stylesheet, every configuration file, the whole engine, and images MUST
  be inlined in the delivered HTML. Images use a `data:` URI. Configuration is inlined as
  `<script type="application/json">` blocks and read from the DOM.
- **No external references.** The delivered HTML MUST contain no `href` or `src` that points at a
  local file. An inline script may still be `type="module"` — an inline module needs no fetch — but
  it MUST NOT import another file.
- **Sources stay modular.** Inlining applies to the delivered file only. The engine SHOULD remain
  importable modules for the Node test harness (§3.8.5), and a build script SHOULD regenerate the
  delivered HTML from those sources so the two cannot drift.
- **Reference implementation.** MDL is the model: one HTML file, one inline script, no imports and
  no `fetch`.
---

## 4. Panel / Card Standard

A **Panel** is the atomic page unit. **The class name is free** — a dashboard may call it `.panel`,
`.card` or anything else; only the tokens, spacing and behaviour below are fixed. Record the name
a dashboard uses in its own workplan.

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
- **The flex row is the title row, not the heading (normative).** The row is the element that
  wraps the title and the action cluster (`.panel-head` below); the 10 px gap belongs to that row
  (`margin:0 0 10px`) and the `h2` itself is `margin:0`. Putting the flex on the `h2` — as the
  sketch below once did — only works when the buttons are nested *inside* the heading, which puts
  interactive elements inside a heading and leaves the cluster mispositioned the moment a wrapper
  is used instead. A dashboard MUST give the row its own element.
- **Corner panel number**: absolutely positioned bottom-right, `Panel N`, 10 px, muted,
  letter-spacing .04 em, `pointer-events:none`.
- **No explanatory subtitles**: panels do not carry a description line under the title. All
  explanation (what the panel shows, what the lines/labels mean) lives in the **Help modal**
  (§7.9) — never duplicate it in the panel body.
- **Numbering rule**: *every* top-level panel is numbered sequentially in document order
  (`Panel 1`, `Panel 2`, …). The number is static — authored once per panel via the
  `.panel-no` span (or `.panel[data-panel]::after`). Dynamically generated sub-panels
  inside a panel are **not** individually numbered; they inherit the parent panel's number and
  MUST NOT render a badge of their own.
- **Numbers follow DOM order, assigned after render (normative).** A dashboard MUST NOT number
  panels from the order the markup was *built*. A page can construct a panel's HTML before the
  point where it is placed, which silently produces out-of-order numbers — the sub numbered
  `1, 2, 4, 3` before this was fixed. Assign `data-panel` by walking the rendered top-level
  panels in document order. Because nested sub-panels inherit the parent's number, the `::after`
  rule MUST be gated on the attribute's presence (`.panel[data-panel]::after`), or an unnumbered
  sub-panel renders a bare `Panel`.
- **The panel margin yields to a grid gap.** Panels are often children of a grid that already sets
  `gap`; the panel's own `margin:14px 0` then stacks on top of the gap and doubles the spacing.
  Inside such a container the panel margin MUST be `0`.
- **The collapse state outlives the element (normative).** A re-render replaces the panel element,
  so the collapsed state MUST be persisted outside it — in the dashboard's view state, keyed by
  panel name — and re-applied on render. Keeping it only on the element silently re-opens the
  panel on the next filter change or page switch.

```css
.panel{background:var(--surface);border:1px solid var(--border);border-radius:10px;
  padding:14px 14px 26px;margin:14px 0;box-shadow:var(--shadow);position:relative}
.panel-head{display:flex;justify-content:space-between;align-items:center;
  gap:8px;margin:0 0 10px}
.panel h2{font-size:13px;margin:0;color:var(--navy);text-transform:uppercase;
  letter-spacing:.04em;line-height:1.4}
.panel-actions{display:flex;align-items:center;gap:6px;flex-shrink:0}
.panel[data-panel]::after{content:"Panel " attr(data-panel);position:absolute;right:10px;
  bottom:8px;font-size:10px;letter-spacing:.04em;color:var(--muted);pointer-events:none}
.panel-grid>.panel{margin:0}
.panel.collapsed>*:not(.panel-head){display:none}
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
- **C3 Breakdown panel exception.** The C3 Breakdown panel's two cards are fixed-dimension views
  (Submissions, Approval Status) that always share the same period and the same secondary breakdown
  (Discipline / Submitter). Month + Break-down-by therefore live in ONE shared cluster above the cards
  (the panel owns them), and only `⤓ PNG` / `⧉ Copy` stay per card. This is the deliberate deviation from
  "every card owns its controls": two per-card copies would be redundant and read as independent when
  both cards use the identical secondary dimension. Each card also shows the full MDL discipline set (and all submitters) even at zero, and its bars share one CSS grid with the vertical axis labels and an attached per-card data table (Submissions = Total Plan / First Submission / Resubmission / Under Review; Approval Status = the codes). The Pie view renders the same two cards as their own
  donuts (one Submissions donut, one Approval Status donut) — there is no consolidated two-ring card.
- **C3 bar y-axis grid lines + numbers.** To match the C1 S-curve and C2 stacked-area panels, each C3 card
  draws a y-axis on the left of its bar plot. There are **5 horizontal grid lines** (light `.sc-grid`-style rules)
  at 0 / 25% / 50% / 75% / 100% of a **"nice" maximum** — the axis top is `niceCeil` of the largest category
  total (the same rounding C1/C2 use), *not* the raw max — and the bars are scaled to that same nice maximum, so
  the top grid line is a round number and the plot fills its height. The numeric **tick labels (the document
  count)** are right-aligned in the metric-label column and flush against the bars, so there is **no gap** between
  a tick label and the grid line it sits on, and the labels align with the attached data table below. A
  zero-discipline category still renders its empty bar against the full grid. The Pie cards are exempt (they are
  donuts, not bars). Decision recorded as I060; review sample `sub/ref/sample-c3-grid-lines.html`.
- **C2 Submission Flow Funnel (per-Discipline table left, funnel right).** The C2 Funnel view draws a
  **vertical funnel to the right of a per-Discipline table**: the table (Discipline rows + a Total row) is on
  the left, the funnel on the right. The funnel's **top aligns with the first discipline row** and its **bottom
  aligns with the last discipline row** — the table header and Total row sit outside the funnel's vertical span.
  Five stages run top→bottom: **Planned Deliverables → Submitted for Review → Under Review → AWC → Approved**.
  Stage names and values sit in a **left label gutter** (right-aligned beside the bands), so long stage names
  never clip against a narrow band; there is no separate legend row. **Band widths
  use square-root compression** (widest stage = max width; a 14 px floor) so a large ratio between stages (e.g.
  Planned 1000 vs Submitted 100) does not make a small stage a razor-thin sliver. The bottom stage (Approved) is
  drawn as a **solid square block** (owner request 2026-10-28, replacing the cube) so the funnel ends on a solid
  base. The stage label reads
  **Under Review** (not "In Review"); **AWC** is shown as its own stage, separate from Approved. The
  per-Discipline table repeats the five measures with a Total row. Counting rules: Planned Deliverables = MDL
  planned rows (D11); Submitted for Review = distinct `Document No.` with ≥1 submission row (D34); Under Review
  = latest `SUR` with no `Actual Return Date` (D34); AWC and Approved split by the document's first approval code
  (APP vs AWC, C3 All-months rule). See `sub/ref/C2-Funnel-Sample.html`.
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
  - **Scale-mode guardrail (default).** Each workplan MUST confirm these cutoffs against its data and plot size. Let `r = maxCum / maxBar` over the
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
- **The y-max uses the raw visible maximum, not a rounded-up step (rev 2026-10-25).** Compute `yMax = max(1, …visible bar values, …visible line values) × ~1.03` — a small headroom pad so the peak line clears the top edge. Do **not** round the maximum up to a power-of-ten (or other coarse) step; that shrinks the curves to a fraction of the plot height and leaves the top empty. Mirrors the MDL reference, where the curves fill the full chart height.
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
- **The combined-chart legend SHOULD be rendered INSIDE the SVG, at the bottom (in-SVG).** It travels
  with the exported PNG, so an HTML `.legend` div is discouraged — a legend outside the SVG is lost on
  export. It holds the bar swatches (Planned / Actual) and the three `Cum. …` line samples in one row
  beneath the plot.
- **Months are labelled with the `MMM YYYY` template (e.g. `Mar 2026`).** Every month shown in the
  S-curve — the x-axis ticks, the period-window range message, and the `<title>` tooltips — is
  formatted through the shared month-label helper. A raw `YYYY-MM` key, or any `slice()` of it
  (`26-03`), is never rendered: it is not a readable month and it differs from every other date in
  the dashboard. Both dashboards use the same template.
- **A Month / Quarter / Year time-grain toggle MAY be offered on an S-curve.** When present it
  rebuckets the data: the x-axis labels, the bar aggregation and the cumulative curve all follow the
  selected grain — `MMM YYYY` for Month, `Qn YYYY` (e.g. `Q1 2026`) for Quarter, `YYYY` for Year. At
  Quarter / Year the cumulative line plots at each bucket boundary (the cumulative at the bucket end),
  and the `MMM YYYY` template is replaced by the grain template through an extended shared label
  helper (never a raw key).
- **Bar values are printed VERTICALLY — rotated 90°, reading bottom-to-top.** A horizontal count
  above a bar collides with its neighbour as soon as the bars get close together, and the collision
  worsens the more digits the count has. Rotating the label gives it a fixed ~12 px horizontal
  footprint regardless of magnitude, so values never overlap. The label is anchored just above the
  bar top and rotated about that anchor (`text-anchor="start"` + `transform="rotate(-90 x y)"`).
- **Dense x-axis labels MAY be inclined** (rotated ~40°, `text-anchor="start"`) so they hug the axis
  with a **minimised gap** and save horizontal space; wherever inclined, the legend MUST sit **clear
  of the labels** (no overlap) — the bottom padding is sized for the rotated text plus the legend, not
  for the labels alone.
- **Every plotted point on a cumulative line is a SOLID dot — `r=3`, filled with the series
  colour.** Nodes are never hollow rings (`fill="var(--surface)"` with a coloured stroke): a solid dot stays
  legible where series cross — the standard form for every S-curve.
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
- **Every non-zero bar shows its value** printed above it (12 px, matching the bar-combo chart). Zero
  bars are skipped so the plot stays readable.
- The time range extends **exactly one extra month** beyond the last data month (not three or
  four) so the last bar is not flush against the plot edge.
- A **Bars** toggle hides the per-period bars so the cumulative curve can be read alone. It lives in
  the **chart card's** control cluster (§4.1 ownership) — **not** in the chart, and **not** in the
  panel area. Bars are **visible by default**. The button is a state toggle, not a momentary action:
  it carries `aria-pressed` and is dimmed (`opacity:.55`) when bars are hidden, so its state is
  visible without re-reading the chart.
- The card's controls form **one cluster on the card's own board**, directly above the plot
  (**§4.1** ownership). The cluster is **right-aligned by default**; the **period selection** (window
  or brush) MAY instead be **left-aligned** with `margin-right:auto`, pushing the remaining controls
  to the right. Internal order is fixed: **grain toggle (when present) → Bars → series multi-select
  (when present) → date-range text → `⤓ PNG` → `⧉ Copy`** — filters before exports, PNG before Copy.
  `align-items:center`. The cluster prefers a single line and may wrap only when the card is too
  narrow. The **period window MAY be realised as a bar / brush selection** — a single track with two
  drag handles selecting a contiguous range — instead of two separate From / To inputs; when the card
  is too narrow the brush wraps below the cluster row.
- These panels stay **full width** (`.card.full`) — one wide chart, not a 2-column grid.
- **No nested chart title** when a panel holds a single chart: the panel's own `h2` is enough, so
  do not add an `h3` sub-title. The chart component nevertheless draws **its own chart-card board**
  (§4.1) — a 1 px border around the **whole chart component** (control cluster + plot), **not** a
  rectangle drawn inside the plot area — and the control cluster above renders **inside** that board.
- **CSS contract (mandatory, so the rule is testable).**
  `.chart-actions{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:6px}`
  — the cluster right-aligns **to the card**; a cluster that merely carries the class while sitting
  left-aligned in the panel body still violates this rule. And
  `.sc-win .msg{font-size:12px;color:var(--muted);margin-left:auto;white-space:nowrap}` — the range
  text is muted body copy at §8 sizes, never a small green success-coloured label.

- **A hover snap line with a floating window is RECOMMENDED.** Moving the cursor over the plot draws a
  thin vertical dashed line snapped to the nearest time bucket and shows a floating window (an HTML
  overlay positioned near the cursor, **not** inside the SVG) listing that bucket's per-period counts
  (Planned / Actual) and the three cumulative totals. The window is `position:absolute` over the chart
  host with `pointer-events:none` so it never blocks the hover.

### 4.3 Long lists → bounded data table (never an open-ended list)
Any panel whose content is a **list of records that can grow** (look-ahead, overdue packages,
validation issues) must render as a **data table inside a fixed-height scroller** — never as an
open-ended list that stretches the page.

- Container: `.tableScroll` (`max-height:340px; overflow:auto; margin-top:8px;
  border:1px solid --line; border-radius:10px`). The header is rendered as a **split header**
  (§7.2.15): `<thead>` lives outside the scroller, so the panel keeps a stable height no matter how
  many rows match, only the body scrolls, and the **vertical scrollbar starts below the header row**.
  (A sticky in-scroller `thead` was the pre-2026-10-21 pattern and is retired — see §7.2.15.)
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
   the *same* cluster (the panel's CSV export behaves like every other §7.1 A3 export); and the
   **severity summary chips**.
2. **Severity summary chips** (`.vchip`, at the title row): totals for error / warning / info,
   plus a hidden `.ok` **"no issues"** chip shown **only** when the issue count is 0. **Shape
   (normative override)** — use the standard `.e / .w / .i / .ok` colour tiers but **override**
   the generic 999 px pill radius to **6 px**, with **11 px / 700** and `text-transform:capitalize`.
   The generic pill shape does **not** apply to these chips.
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
which keep their 6 px shape with colour fill and are not in a table, so the emoji is
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

*Cross-refs:* table base §7.2 · scroller §4.3 · severity symbols §3.5 · chip shape
(overridden above, §4.5 item 2) · panel action cluster §4.1.

---

## 5. KPI Overview Panel

- First panel on every dashboard. Title `KPI OVERVIEW`, inline `?` (help, **left**) and `−`
  (collapse, **right**) buttons in the right-aligned action cluster, corner panel number.
- **KPI cards** use `repeat(auto-fit, minmax(210px, 1fr))` with a 10 px gap (§18.10). At a
  1310 px content width this gives six 210 px cards. No breakpoint media query is needed:
  `auto-fit` drops to five, four, three, two or one column as the width falls.
- The KPI panel carries **no subtitle** — the per-panel explanation lives in the Help modal
  (§7.9). Do not duplicate explanatory copy in the panel body.

### KPI card
- **Size (normative)**: height **72 px**, width **210 px or more**, `box-sizing: border-box`.
  The height is 4 px of border + 20 px of padding + 48 px of content. It does not change with
  the number of digits. Do not clamp, truncate or scroll the card content.
- White surface, 1px `--border`, **3 px coloured top strip**, radius 8 px, padding 10 px.
- **No box shadow.** A KPI card is flat. `--shadow` (§6) does not apply to it.
- **Number** (`.v`): 22 px, weight 700, colour `--navy`. 28 px is for a single hero KPI only.
- **Label** (`.l`): 10 px, uppercase, `--muted`, `margin-top: 2px`.
- **Do not set `line-height` on `.v` or `.l`.** The inherited 1.45 from the page body is what
  makes the card 72 px high. An override changes the height.
- **Exactly two lines.** A card contains one `.v` element and one `.l` element and nothing else.
  It has no sub-status line, no icon, no gauge, no third line and no nested card.
- **Status strip — five states.** The top strip carries the status. Use one class at a time.

  | Class | Meaning | Token |
  |---|---|---|
  | *(none)* | no status | `--blue` |
  | `.ok` | ok | `--green` |
  | `.amb` | attention | `--amber` |
  | `.warn` | bad | `--red` |
  | `.muted` | not applicable, inactive | `--slate` |
  | `.err` | data error | `#8E24AA` |

  The class name states the colour, not the English word. `.warn` is red and `.amb` is amber.
  Never describe `.warn` as "amber", and never put `.amb` and `.warn` on one card.

### KPI card CSS (normative example)
```css
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:10px}
.kpi{box-sizing:border-box;height:72px;padding:10px;background:var(--surface);
  border:1px solid var(--border);border-top:3px solid var(--blue);border-radius:8px;
  box-shadow:none}
.kpi .v{font-size:22px;font-weight:700;color:var(--navy)}
.kpi .l{font-size:10px;color:var(--muted);text-transform:uppercase;margin-top:2px}
.kpi.ok{border-top-color:var(--green)} .kpi.amb{border-top-color:var(--amber)}
.kpi.warn{border-top-color:var(--red)} .kpi.muted{border-top-color:var(--slate)}
.kpi.err{border-top-color:#8E24AA}
```

> Note: **22 px is standardised** for compact KPI strips. Use 28 px only for a single hero KPI.
> A hero card is exempt from the 72 px height. Record that exemption as a deviation (§8.4).

---

## 6. Project-local design tokens

Each dashboard defines the design tokens in its project-local UI stylesheet. Do not load dashboard
styles from `/common/`. Use the semantic names in the examples below and keep their meaning and values
consistent across dashboards. Define token values for all five themes in `AGENTS.md` §18.4. Use system
font stacks from `AGENTS.md` §18.1; do not require a CDN font.

The shell layout, typography, spacing, and semantic color tokens are part of this shared dashboard
spec. A project may add tokens for its domain, but it MUST NOT change the shared token meanings or
shell geometry. The harness checks shell geometry; theme and contrast checks belong to the applicable
harness tier and dashboard test suite.

### Spacing scale
`4 · 8 · 12 · 16 · 24 · 32 · 48` px. (8 pt-based; use consistently.)

### Radius
- Panel: **10 px** · Card / KPI: **8 px** · Button: **6 px** · Input/select: **8 px**.

### Typography (normative)
- **One shared font stack.** Every dashboard MUST define `--font-ui` with this same stack, so text
  renders identically across dashboards:
  `'Segoe UI', system-ui, -apple-system, 'Inter', 'Source Sans Pro', Roboto, Helvetica, Arial, sans-serif`.
  These are system fonts; no CDN font is loaded (`AGENTS.md` §18.1).
- **One shared type scale.** The sizes below are normative for the elements named. A dashboard MUST
  NOT substitute its own size for them, and MUST NOT introduce a per-dashboard variation.

  | Element | Size | Weight |
  |---|---|---|
  | Body copy | 13 px / 1.45 | 400 |
  | Panel title `h2` | 13 px, uppercase | 600 |
  | Chart-card title `h3` | 13 px | 700 |
  | KPI value (compact strip) | 22 px | 700 |
  | KPI label | 10 px, uppercase | 400 |
  | Icon button (A4) | 13 px | 600 |
  | Menu-bar control (§3.1) | 12 px | 600 |
  | Filter trigger (B1) | 12 px | 600 |
  | Filter menu row (B3) | 12 px | 400 |
  | Filter count badge | 10 px | 700 |
  | Native single-select (B5) | 12 px | 600 |
  | Title-bar project title | 17 px | 600 |
  | Title-bar dashboard title | 12 px | 500 |
  | Title-bar meta line | 11 px | 400 |
  | Status / system banner | 12 px | 400 |
  | Severity chip `.vchip` | 11 px | 700 |

- **Reference.** MDL is the reference implementation of this scale. A dashboard that drifts from it
  renders the same content at a different size, which is the drift this clause prevents.

### Shadow
- Subtle only: `var(--shadow)`. No large/decorative shadows.

### Semantic & tint tokens
Components MUST use the semantic tokens defined in the project-local UI stylesheet for status and tint surfaces. The stylesheet must define all tokens that component rules use. Every dashboard uses the five themes from `AGENTS.md` §18.4;
a dashboard MUST NOT add a separate theme system or a local dark-theme override.

---

## 7. Component Library

### 7.1 Buttons

**Single standard — no per-dashboard button variations.** Every dashboard uses the *same* classes, sizes, colours and hover behaviour, and every action is a real `<button>` element (never a `<td>`/`<div>` with `role="button"`). Buttons fall into three families:

#### A. Action buttons
| Type | Class | Use | Style |
|---|---|---|---|
| A1 Primary | `.btn` / `.btn-primary` | one main action per view highest-emphasis CTA — *Open / Load workbook* only; Print / Save / Export are **not** primary | `--blue` solid, white text, radius 6 px, min-height 32 px |
| A2 Secondary / Ghost | `.btn.ghost` / `.btn-secondary` | low-emphasis alternative / cancel / dismiss; "Load another file" | white, 1px `--border`, **navy** text; hover → `--blue` fill, white text |
| A3 Text action | `.btn-secondary` (glyph + label) | tool / footer-row actions: export, copy, CSV (e.g. `⤓ PNG`, `⧉ Copy`, `⤓ CSV`) | white, **navy** text, glyph + space + label; hover → `--blue` fill, white text |
| A4 Icon / Mini | `.icon-btn` | icon-only: Help `?`, Collapse `−`, Theme, modal close `✕` | `width:26px;height:26px;min-height:26px` — 26 px **square**; radius 6 px; 1px `--line`; `background:var(--surface)`; `color:var(--muted)`; `font:inherit`; **13 px** / 600; `line-height:1`; inline-flex centred. Hover → `--soft` background + `--navy` text. **Must carry `aria-label` + tooltip** |
| A5 Search | `.search-btn` | search submit, affixed to the search input (right edge, single-side radius) | `--accent` fill, white glyph, radius `0 6px 6px 0`, attached to input |

**A3 — one canonical class name (normative).** `.btn-secondary` is the **canonical** A3 class. Every
text action (export / copy / CSV / reset) MUST use it. A dashboard MUST NOT introduce a parallel class
for the same logical control.

**Why the class name is normative, not cosmetic.** The class name is the only link between a rendered
control and the spec rule that governs it. When two dashboards name the same logical control
differently, a style change made to satisfy A3 on one silently misses the other, and no shared
selector exists for a test to assert against. That drift stays invisible until two dashboards are
compared side by side — the precise failure the shared spec exists to prevent. A legacy alias is
therefore **tolerated, never endorsed**: it is written down **in the dashboard's own workplan** so the
divergence is visible and has a defined end state — migration to the canonical name.

**Two consequences of a single shared name (normative).**

- **A text action's class MUST NOT be used as a behaviour hook.** One shared class can no longer
  discriminate two different actions (export vs copy), so behaviour belongs on a **data attribute**
  (for example `data-act="dl"` / `data-act="copy"`) — never on the class.
- **The shared class must be governing, not decorative.** A dashboard MUST wire `.btn-secondary` into
  the rule that actually implements A3 in its stylesheet, so a change to the shared class reaches it.
  A shared class that is declared but not governing is drift waiting to happen.

**Assertion (required).** A conformance check MUST assert that every dashboard carries
`.btn-secondary`, that none introduces a parallel class, and that all declare the same A3 geometry —
the tripwire that stops dashboards drifting apart again (§8).

**Migration status is per-dashboard.** Whether a dashboard already conforms, which legacy names it
shipped, and when it migrated are recorded in its own workplan — never here (§1).

#### B. Selection controls
| Type | Class | Use | Style |
|---|---|---|---|
| B1 Filter trigger | `.tf-btn` | **MULTI-SELECT row filter** — opens a filter menu (Discipline / Stage / Category), distinct from the rows *inside* the menu. **Reserved for controls that narrow rows**; a show/hide-columns control MUST NOT use it (see B7) | text + count badge, radius 6 px, **borderless in the menu bar** — the base control carries 1 px `--border` and the menu-bar chrome strips it; **no caret glyph**; hover → `--soft`; selected → `.is-filtered`, whose visible cue is the count badge |
| B2 Segmented | `.seg button` | single-select among 2–6 inline options (Bar/Pie, month horizon 1m–6m, overdue cases); active `.on` = **`--navy`** fill (a *selection* state, not an action) | joined group, 1px `--border`, radius 6 px, overflow hidden; inactive hover → `--blue` fill |
| B3 Filter rows | `.tf-all` + `.tf-item` | multi-select toggles *inside* the B1 filter menu — an `All <dimension>` master, then a hint, a divider, and the value rows | master 12 px / 700; rows 12 px; row hover → `--soft` |
| B4 Drill / Expand | reuses `.icon-btn` visuals | row drill-down / expand (`▸ stages`) | **must be a real `<button>`** — never a `<td>` or `<div>` with `role="button"`; may be icon or text + icon |
| B5 Native single-select | `.inter-sel` | **SINGLE-SELECT picker** — breakdown dimension, month, type (chart group / matrix Month / Overdue Type); distinct from the multi-select `.tf-btn` filter (B1) and from the `.seg` segmented control (B2) | 12 px / 600, 1px `--border`, radius 8–9 px, white surface, `--ink` text; `:focus-visible` 2 px `--blue` ring; `max-width:260 px`; attached variant `.inter-sel.is-attached` (search-column picker: no own border, left-rounded, right divider) |
| B6 Panel-local filter | `.inter-sel` in the panel's control cluster | a single-value filter that narrows **only the tables inside one panel** (e.g. the issue rule-code filter in the Validation / Issues panel). Resolved in **S5 Render**; it MUST NOT change KPIs, charts, the matrix or any other panel (§7.2.7 pt 6) | as B5 |
| B7 Column-visibility control | own class (`.cc-btn`) | **show/hide columns — a *layout* control, not a filter.** It changes which columns are painted, never which rows are returned. MUST NOT reuse the B1 filter look, filter badge, or `[aria-expanded]` active-filter emphasis | own styling; MAY reuse the floating-panel shape, but without a count badge or active-filter emphasis |

**Multi-select vs single-select — the grammar (normative).** A filter's chrome is chosen by how many values the user may select at once, not by where the control sits:

| | Multi-select | Single-select |
|---|---|---|
| Control | **B1** `.tf-btn` filter trigger + floating menu | **B5** `.inter-sel` labelled native select |
| Toggles inside the menu | **B3** `.tf-all` master + `.tf-item` rows | not applicable |
| Values at once | many (a checkbox list, plus an "All <dimension>" master) | one (an explicit "All / <dimension>" neutral option) |
| Active-state cue | count badge on the trigger + `is-filtered` emphasis | the chosen value is visible in the control itself |

A user must be able to tell, from the chrome alone, both (a) how many values the control accepts and (b) whether it filters **rows**. B7 exists so a layout control can never be mistaken for a row filter.

**Global dimensions are multi-select (normative).** A dimension exposed in the shared global filter
area (§3.1, §3.2) MUST accept **several values at once**, and MUST therefore use **B1** `.tf-btn` with
**B3** `.tf-all` master plus `.tf-item` toggles inside a floating panel and a count badge on the
trigger. A global
filter re-derives the shared `active` set for every panel (§7.2.7 pt 1), so the reader must be able to
select more than one value. A dashboard MUST NOT render a global dimension as a native single-select;
**B5** `.inter-sel` is reserved for single-value pickers that are not row filters (breakdown
dimension, month, type) and for the **B6** panel-local filter. The floating panel MUST open with an
`All <dimension>` master toggle at the top, per the ordering rule below.

**Filter group contents (normative).** The menu-bar filter group MUST contain the global filter
triggers, the Search button with its panel, and the Warnings toggle. Placing Search or Warnings
outside the group breaks the shared grouping and MUST NOT be done.

**Filter class names are normative.** A global filter trigger MUST carry class `tf-btn`, its master
toggle `tf-all`, its value rows `tf-item`, and its panel `tf-panel`. A dashboard MUST NOT invent a
parallel class for the same control.
The reason is the same as for A3 above: the class name is the only link between a rendered control and
the spec rule that governs it, so a parallel name hides the control from every shared selector.

**Floating-panel internal ordering (normative).** Every floating
multi-select panel — the **B1** filter popover and the **B7** column-visibility chooser alike —
MUST lay its contents out in this order:

| # | Region | Rule |
|---|---|---|
| 1 | **Master** | an `All <dimension>` checkbox (`All Disciplines`, `All columns`, …) at the **top**, acting on the panel's whole selectable set |
| 2 | **Note** | the panel's explanatory line, directly beneath the master and above the divider |
| 3 | **Divider** | a 1 px rule separating the header block from the scrollable list |
| 4 | **Item list** | one checkbox row per value — the only region that scrolls |
| 5 | **Footer** | actions and counts only (`Reset to defaults`, `N hidden`) |

The note MUST NOT be placed after the item list. Both panels are `overflow:auto` with a `max-height`
(320 px filter / 380 px chooser), so a trailing note sits below a scrolling list and stays invisible
until the reader scrolls to the very end — while it is precisely the text a first-time reader needs.
The two panels' notes say different things (deferred apply vs immediate apply) and MUST keep their own
wording; only their position is shared.

**Master scope and tri-state (normative).** The master ranges over the **selectable** set only. Where
a panel locks some rows — the chooser's **pinned identity columns are permanently checked and disabled**
— the master MUST be scoped to the remaining (non-pinned) rows and MUST be tri-state: checked when every
non-pinned row is on, **indeterminate** when only some are on, unchecked when none are. A master that
also spans locked rows can never read as checked and would be permanently stuck.
Every item toggle and any reset action MUST re-sync the master (and any footer count), so the header can
never contradict the list below it.

#### C. Indicator (not a button)
| Type | Class | Use | Style |
|---|---|---|---|
| C1 Status pill | `.pill` | status / count badge — **not an action** | 10 px / 600, radius 999, semantic colour variant |

- **Font:** 12–14 px / 600 (A4 icon buttons **13 px**).
- **Hover (A2 / A3):** `--blue` fill, white text — *not* a `--soft` tint.
- **A1 Primary** keeps `--blue` (the *action* colour); the **B2 segmented active state** is `--navy` (a *selection* state) — different semantics, intentionally different colours.
- **Modal is a container, not a button type:** its close `✕` = A4; its footer actions = A1 / A2 / A3.
- **A4 is used ALONE, and must stay 26 px square.** `.icon-btn` is never combined with `.btn`
  If an element has to carry both, `.icon-btn` **must declare its own
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
  warning-toggle open and fails any control below 3:1 contrast or with no accessible name (§8).
  **Each dashboard records its enforcement posture** — *hard* (a failure blocks release) or *advisory*
  (reported, not blocking) — **in its own workplan**, together with the regressions that produced the
  rule. The posture is a project decision; the contrast requirement itself is not.
- **A control's label/title is stable and must not invert its verb with state.** A toggle button's
  accessible name describes the control, not the result of the next click: the `Warnings` toggle therefore
  always reads **`Warnings`** with the count in its badge (`[N] Warnings`), and never flips to `Show warnings`
  / `Hide warnings` when collapsed/expanded. A label that changes verb with state is both confusing and a
  contrast risk (it can force a different colour pair).
- **Control label casing (mandatory).** Every visible label of an interactive control MUST use
  **title case**: capitalize the first letter of every word (`Choose Workbooks`, `Show Warnings`,
  `Remember File Names`). Do not use sentence case (`Choose workbooks`, `Show warnings`).
  *Applicable cases* are: button labels — action, toggle, and icon buttons with visible text
  (`☰ Navigation`); a `<label>` rendered as a button, such as a file-picker label; the label of a
  form control — checkbox, radio, or select (`Show Warnings`, `Remember File Names`, `Theme`); and
  navigation and menu items. *Excluded cases* are: prose and body text, sentences, hints, status
  messages, placeholders, data values, and `title` / `aria-label` attribute wording.

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

#### 7.2.0 Normative class names
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

#### 7.2.7 Filter population rule (global-first → panel cascade) — added 2026-10-19

A dashboard's filters form a **two-tier cascade**. It is applied in this order and never the
reverse; the structure (not just convention) enforces it.

1. **Tier 1 — Global filters run first, in S4 Derive.** The dashboard-defined global filters are combined (AND) into a single pass over the
   master record set and produce one shared, reduced working set (`active`). **Every panel**
   (KPIs, charts, overdue lists, matrix, validation/issue list, document detail) derives from
   this same `active` set, so a global selection re-derives the whole dashboard at once. The
   **matrix month-selector** is the one panel control still resolved inside S4 Derive *on top of*
   the global `active`, because changing the month re-derives the whole cross-tab. A control that
   must not ripple outwards — the **issue rule-code filter** being the canonical case — is NOT
   resolved here; it belongs to point 6.
2. **Tier 2 — Panel filters run in S5 Render, on top of `active`.** A panel may expose **one or
   more single-purpose controls** that narrow only that panel's rows — rows that are already a
   subset of `active`. A panel filter can therefore **only narrow further** — it can never
   re-include a record a global filter excluded, because the panel never receives those records.
   Each such control uses the chrome its cardinality dictates (§7.1 B): **B1 + B3** when several
   values must be selectable at once, **B5 / B6** when the dimension is single-valued. A panel
   control MUST NOT be a generic multi-dimension popover that re-offers a global dimension — see
   point 5.
3. **All filters combine by AND.** Logically the order is associative; the cascade is enforced
   structurally because panels operate on `active`-derived data, not the raw records.
4. **Facet / count populations read the CURRENT data, never a master list.** Filter-popover
   option counts, badge counts and column-distinct lists MUST be computed from the rows currently
   in scope (the already-filtered set), so they always reflect what the user can actually see and
   select — never from the unfiltered master. (Where applicable this is enforced by the
   layout/behaviour harness.)

5. **No duplicate filter dimensions (overall requirement).** A filter dimension appears in exactly
   one place. The dashboard-defined global dimensions live
   **only** in the shared global filter area; a panel MUST NOT re-offer a global dimension, and MUST NOT offer the same dimension
   twice (e.g. a panel that already has a dedicated control for a dimension must not also bundle that
   dimension inside a generic column-filter popover). Panels may filter only on dimensions they own.
   This keeps the global filter the single source of truth for cross-panel scope and prevents two
   controls from issuing contradictory selections.

6. **A panel-local filter stays inside its panel (S5 only).** Some panel filters must narrow the
   panel's *tables* without re-deriving anything else — the canonical case is the **issue
   rule-code filter** on the Validation / Issues panel (§7.1 B6). Such a filter MUST be applied
   in **S5 Render** to the rows already handed to the panel, and MUST NOT feed back into S4
   Derive. It therefore changes **only the tables inside that panel** — never KPIs, never charts,
   never the matrix, never another panel, and never the global `active` set.
   - The panel's own summary blocks (issue/severity summary chips, explanatory note, rule
     reference table) continue to describe the **whole** run, not the filtered subset.
   - Only the filtered table and its row count reflect the selection, using the **`N of M`**
     form whenever `N < M`.
   - Any export reads the **same filtered array the table paints**, so screen and file always
     agree.
   Implementing it by feeding a global state field that S4 already consults is explicitly wrong:
   that silently converts a panel filter into a cross-panel one.

Rationale: a single global `active` guarantees cross-panel consistency (every panel tells the same
story for the same discipline/stage selection) and makes the global filter a hard first gate; panel
filters refine the view locally without re-introducing excluded records. The no-duplicate rule (point 5)
keeps each dimension in exactly one control, so two filters can never issue contradictory selections.

#### 7.2.15 Split header (fragment pairing) — added 2026-10-18

A **split header** moves `<thead>` out of the scroll container into a thead-only fragment
(`.vheadtab`), so the vertical scrollbar starts **below** the header instead of beside it.

**Standardised 2026-10-21 — every bounded data table (`.tableScroll`) uses the split
header, grouped or single-row.** The vertical scrollbar is confined to the body: it scrolls rows only,
the header never moves, and the header band runs the full card width with the trailing `.ds-gut` gutter
reserving the scrollbar width. A sticky `<thead>` inside a table scroller is **retired** — sticky
remains correct for page shell chrome (§3.1) but MUST NOT be used inside a `.tableScroll`.

Why this is standardised rather than left as a choice:

- **A scrollbar is a spatial proxy for the scrollable set.** A full-height track running beside a
  header it never scrolls misstates what it controls, and offsets the track's top edge from row 0.
- **The scrollbar strip breaks the header band.** Inside a scroller the content box excludes the
  scrollbar, so the navy header stops short of the card edge and a scrollbar-coloured seam cuts it at
  the top-right corner — precisely the defect `.ds-gut` exists to prevent ("so the navy is continuous
  across the full card width").
- **It removes an arbitrary split.** The Rule Reference is single-row and split; three other
  single-row tables were sticky. Same header shape, two treatments, no structural reason.

**Migration is per-dashboard.** A dashboard that still ships a sticky `<thead>` inside a
`.tableScroll` is **non-conforming until it migrates**. Which tables it must convert, and when, is
recorded in its own workplan — the same status pattern used for §7.1 A3.

Splitting the header is now the **rule**, not an exception — and a rule that moves the header outside
the scroller MUST be paid for with equivalent invariants. Splitting creates a failure mode sticky
headers do not have: header and body are now two
independent tables that can drift apart, and a drift is invisible to every per-table check (a shipped
matrix once carried six visible defects while the harness reported zero failures). Every one of the
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
5. **Fit, then lock-step** — column widths are content-derived and the pair fits the display area.
   Horizontal scrolling is **unavoidable**, and therefore permitted, **only** when the sum of the
   columns' **minimum** widths exceeds the available width. In every other case the table MUST fit: a
   default wider than the display area is a non-conformant width choice, not an unavoidable constraint.
   Where horizontal scrolling *is* unavoidable, the header MUST follow the body's `scrollLeft`. A header
   that is wider than the body, or that stays put while the body scrolls, is non-conformant.
   (Clarified 2026-10-21: the minimum-sum test makes "unavoidable" verifiable — 13 columns at
   a 60 px floor need 780 px and so must fit a 1216 px panel, while 27 columns need 1620 px and cannot.)
6. **One implementation** — the pairing is wired by a single shared helper used by every split-header
   table. A table MUST NOT hand-roll a partial copy of this contract.

**Alignment across a split header MUST be driven by the column, never by DOM position.** A grouped
header with `rowspan` cells gives the header row different child indices from the body row it labels, so
`nth-child` selectors address different logical columns in each half. Verification MUST therefore pair
header and body cells by their rendered position, not by index.

**Verification** — these are enforced by `harness-layout` Tier 4c under `chrome.splitHeader`: header/body
gap, one rounded container, column rule in place, header-vs-data alignment, column-boundary alignment,
width equality, fit (no horizontal overflow), and horizontal lock-step.

**Matrix exception (grouped matrix header).** A matrix keeps a column rule on **every** header cell —
the grouped (first) row *and* the final data column included — rather than suppressing them; the gutter
stays exempt. The default `ds-table` suppression of `colspan`/last-column rules is therefore overridden
for `.matrix`. This is enforced by harness **Tier 4g** `lintMatrixHeaderRules`, which fails if any
non-gutter header cell lacks its painted `::after` rule (covering all header rows, not just the first
data cell).

---

## 8. Conformance & Testing

A rule that cannot be checked is not a standard. Every normative clause in this spec is therefore
paired with an automated check. This section states **what must be checked, where the checks live,
and what a dashboard must be able to show** to claim conformance.

### 8.1 Two layers of checks

| Layer | Lives in | Checks |
|---|---|---|
| **Shared layout harness** | the shared `harness-layout` project — **generic checks that apply to any dashboard** | shell structure and geometry, chrome and table geometry: split-header invariants, control contrast, floating-panel ordering, search-panel layout, matrix header rules |
| **Per-dashboard suite** | the dashboard's own repository (e.g. `test/`), plus its harness check module | that dashboard's **behaviour**: its pipeline stages, its contract parsing, its derivations, its panel logic, and the dashboard-specific assertions this spec requires |

**The split is deliberate.** A check that is true of *every* dashboard belongs in the shared harness;
a check that is true of *one* dashboard belongs to that dashboard. A dashboard MUST NOT fork a generic
check into its own suite, and the shared harness MUST NOT encode one dashboard's behaviour.

### 8.2 Required conformance assertions (normative)

Each of the following MUST be asserted somewhere in the two layers above, and each cites the clause
it enforces. Where a check needs to know a dashboard's own choice (a class name, a dimension list, an
enforcement posture), that value is supplied **by the dashboard's check module or workplan** — never
hard-coded into the generic check.

| # | Assertion | Clause |
|---|---|---|
| 1 | Every dashboard loads project-local CSS and JS, implements the required shell tokens, and supports all five themes | §1, §3.1, §6 |
| 2 | Every text action follows the dimensions and behavior in this spec | §7.1 A3 |
| 3 | Every action is a real `<button>`; no `<td>`/`<div>` carries `role="button"` | §7.1 |
| 4 | Every control's label meets WCAG AA against its own effective background (≥ 4.5:1, or ≥ 3:1 for large/UI text), including pressed/toggle states | §7.1 |
| 5 | Every control has an accessible name | §7.1 |
| 6 | A filter trigger (`.tf-btn`) is used **only** by controls that narrow rows; a column-visibility control uses its own class and carries no filter badge or active-filter emphasis | §7.1 B1 / B7 |
| 7 | Every floating multi-select panel lays out master → note → divider → item list → footer, and the master re-syncs (tri-state where rows are locked) | §7.1 B |
| 8 | A panel-local filter changes only its own panel's tables; KPIs, charts, the matrix and other panels are unaffected; exports read the same filtered array | §7.2.7 pt 6, §7.1 B6 |
| 9 | No filter dimension is offered twice — a dimension exposed in the global filter area is not re-offered inside a panel | §7.2.7 pt 5 |
| 10 | Every bounded data table uses the split header; no `.tableScroll` contains a sticky `<thead>` | §7.2.15 |
| 11 | The split-header invariants hold: one container, relative containing block, width pin + gutter, one column grid, fit/lock-step, one implementation | §7.2.15 |
| 12 | Header/body cells of a split header are paired by **rendered position**, never by DOM index | §7.2.15 |
| 13 | The parse → derive → render separation holds (S1–S5), and the pipeline is testable per stage | §3.8, §3.8.5 |
| 14 | Source-contract parsing: source positions and allowed values are not hard-coded | §3.8.3 |
| 15 | The delivered HTML is standalone: it runs from `file://` with no web server, contains no `href` / `src` that points at a local file, and uses no `fetch` of local files or cross-file ES-module `import` | §3.9 |
| 16 | Every KPI card is 72 px high and at least 210 px wide, carries a 3 px top strip in a status token, contains exactly two children (`.v`, `.l`), and has no box shadow | §5 |

### 8.3 Pipeline testability

§3.8.5 requires each data stage to be testable in isolation with the project-approved runner. A test
can then locate a failure in one stage instead of the whole page.

### 8.4 Enforcement posture and the conformance record

- A dashboard MUST record, **in its own workplan**, which generic checks it runs, at which tier, and
  whether each is **hard** (a failure blocks release) or **advisory** (reported, not blocking).
- A dashboard MUST record every **deviation** from this spec in its workplan, with the clause it
  deviates from, the reason, and — where the deviation is temporary — the target end state.
- A dashboard's workplan SHOULD cite, per spec clause, where the evidence lives (check name, test
  file, or screenshot), so conformance can be reviewed without re-deriving it.

### 8.5 Definition of done

A dashboard conforms when (a) all generic checks in §8.2 that apply to it pass or are recorded as
advisory-with-reason, (b) its own suite passes, and (c) its workplan carries the conformance record of
§8.4. A new dashboard adopts this spec **before** its first release, not after.

---

## 9. Adopting this spec for a new dashboard

1. Keep dashboard CSS and JavaScript in project-local assets. The workplan defines their paths; a `ui/` folder is optional. Define the tokens and shell behavior required by this spec in those assets; dashboards do not use `common/`.
2. Put the dashboard HTML entry page in the project root. A `data/` or `output/` folder is optional. Provide
   `serve.py` as required by `AGENTS.md` §18.12. Build the shell exactly as stated in §18.2. Use this document for dashboard panels
   (§4), metrics (§5), and shared behaviors (§3, §7).
3. Load `ui_help.json` for labels, help text, defaults, and output names. Confirm that every token used
   by this document exists in the project UI stylesheet for all five themes (§6).
4. Implement the data pipeline with importable stages and no HTML build step (§3.8). Use the source
   file contract that applies to the dashboard (§3.8.3), and test each stage (§8.3).
5. Decide the dashboard-specific status vocabulary, global filter dimensions, and file set. Record
   these choices in the dashboard workplan. The shell and navigation form are not choices.
6. Wire the shared layout harness and add the dashboard's own check module and suite (§8.1).
7. Complete the conformance record (§8.4) before first release (§8.5).
