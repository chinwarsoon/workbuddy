# UI Comparison and Standardisation Matrix

**Reference Standard:** `Dashboard-UI-Design-Spec.md` (through Revision 1.77)  
**Purpose:** Master comparison, migration, and standardisation register aligning legacy dashboard panel implementations (**Current C1** and **Current C3**) with the normative UI Design Standard and target dashboard technology architecture.

---

## 1. Target Technology Allocation & Architecture

The target dashboard architecture enforces a strict separation of concerns across core web technologies:

| Technology | Primary Responsibility | Usage Policy | Spec Reference |
| :--- | :--- | :--- | :--- |
| **HTML5** | App shell, panels, cards, controls, legends (C3), semantic tables, tooltips, ARIA landmarks | **Default** | §3, §4, §7 |
| **CSS3** | Visual appearance, semantic theme tokens, typography, borders, radii, print rules | **Default** | §4, §6, §7 |
| **CSS Grid** | Page layout, panel grids, chart-to-table alignment tracks (`--c1-gutter`, `--c3-gutter`) | **Default** | §3.4, §4.2, §4.7 |
| **CSS Flexbox** | Title bars, menu bars, panel headers, single-row toolbars, control clusters | **Default** | §3.1, §4.1, §4.2 |
| **SVG** | Chart rendering, axes, gridlines, plotted series, in-SVG legends (C1), severity glyphs, PNG/Copy export serialization | **Default** | §4.2, §4.5, §7.2.4 |
| **JavaScript** | Deterministic `S0`–`S6` data pipeline, state management, `ResizeObserver` reflow, delegated hover/crosshair/sync binders | **Default** | §3.8, §4.6, §7.2.16 |
| **Canvas** | High-volume graphics rendering where SVG node count degrades measured performance | **Conditional** | Governance Rule #41 |
| **DOM-to-image** | HTML content rasterization where native SVG serialization is not applicable | **Conditional** | §4.2 |
| **Web Components** | Reusable framework-independent UI encapsulation | **Optional** | §3.8.0 |

### Target Architecture Summary
* **HTML5 — Application Structure:** Shell zones (`data-shell`), Panels, Cards, Controls, Legends (C3), Native Semantic Tables, Tooltips (`.chart-tip`).
* **SVG — Chart Rendering:** Axes (`sc-yaxis-line`), Gridlines (`line.sc-grid`), Plotted Lines, Bars, Solid Dots (`r=3`), Reference Lines (`Start` / `Today`), and Native Export Trees.
* **JavaScript — Behaviour:** `S0`–`S6` Pipeline, Single `STATE` Object, `ResizeObserver` Refit, Delegated Hover & Two-Way Chart/Table Synchronisation.
* **CSS — Global Design System:** `:root` Semantic Tokens (5 Themes), Typography Scale (`--font-ui`), 8 pt Spacing Scale, Responsive Grids, `@media print` Overrides.

---

## 2. UI Comparison and Standardisation Matrix (Items 1–30)

| # | UI Element | Element Type | Current C1 | Current C3 | Recommended Standard Implementation & Spec Alignment |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Outer panel border | HTML + CSS | `.panel` | `.panel` | HTML container (`activePanel`) + shared CSS tokens (`1px solid var(--border)`, `10px` radius, `--surface`, `padding:14px 14px 26px`) (§4). |
| **2** | Inner chart card | HTML + CSS | `.scurve.sc-board` (no `.c-card`) | `.chart.c3-card` | Single-graph panels (C1) omit inner `.c-card` and use `.sc-board` (I068); multi-panel/C3 charts use `.c3-card` (`1px solid var(--border)`, `10px` radius, `padding:12px`) (§4, §4.1). |
| **3** | Panel heading | HTML | `<h2>` | `<h2>` | HTML `<h2>` inside `.panel-head` flex row (`13px`, weight `700`/`600`, uppercase, `--navy`, `letter-spacing:.04em`, `margin:0`) (§4, §6). |
| **4** | Chart legend | HTML / SVG | SVG `.sc-legend` (above plot) | HTML `.c3-legend` (above chart) | Retain **in-SVG** legend above plot for C1 attached-table panels (rev 1.62); retain **HTML `.c3-legend`** above chart in both Bar and Pie views for C3 (rev 1.76), ensuring PNG/Copy serialization preserves top placement. |
| **5** | Y-axis | SVG | SVG `sc-yaxis-line` + dynamic ticks | HTML `.g-yaxis` | Standardise on SVG axis line, horizontal gridlines, and right-aligned dynamic nice-number ticks (`<= 7` intervals, `<= 8` labels, `min ~40px` spacing) (§4.2 rev 1.60/1.64). |
| **6** | Time scope control | HTML input | Dual-handle period track | `<select>` | Retain panel-appropriate HTML controls (dual-handle `step="1"` range track + `.seg` presets for C1; native `.inter-sel` for C3) styled with shared tokens (§4.2 rev 1.66, §7.1 B5). |
| **7** | Visible control label | HTML / ARIA | Visible `Period` label | `aria-label` (no visible label) | Enforce rev 1.77: remove visible `Month` text label on C3 chart selects and supply accessible name via `aria-label`; retain explicit `<label>` where required (§4.1, §4.2). |
| **8** | Grain selector | HTML buttons | Month / Quarter / Year `.seg` | Not applicable | Standardise on §7.5 B2.1 `.seg` segmented-control component (`role="group"`, `<button type="button">`, dynamic `aria-pressed`). |
| **9** | Series / view controls | HTML controls | Series popover + Bars toggle | Breakdown + Bar/Pie `.seg` | Shared HTML control components (`B1` `.tf-btn` multi-select popovers, `B2` `.seg` toggles, `B5` `.inter-sel` single-selects) with strict panel-scoped ownership (§4.1 rev 1.76, §7.1). |
| **10** | Chart toolbar | HTML + CSS Flexbox | `.c1-controls` (single row) | `.c3-controls` (single row) | Enforce single-row Flexbox tool cluster per chart card (`flex-wrap:nowrap` down to `1280px` desktop minimum); prohibit a second head row above C3 chart controls (§4.2 rev 1.67/1.77). |
| **11** | Export controls | HTML buttons | `⤓ PNG` / `⧉ Copy` | `⤓ PNG` / `⧉ Copy` | Shared canonical `.btn-secondary` (`A3`) buttons with `data-act` hooks (`min-height:32px`), ordered `PNG` before `Copy` at far right (§4.2, §7.1 A3). |
| **12** | Toolbar left-group flex | CSS Flexbox | `flex:1 1 520px` / `margin-right:auto` | Left-aligned group (`margin-right:auto`) | Common Flexbox alignment: left-align scope/filter/view controls (`margin-right:auto`) and right-align export controls (§4.1 rev 1.77, §4.2). |
| **13** | Attached table | HTML | Always rendered | Bar view only (`Breakdown Summary` separate) | Native semantic HTML `<table>` (`<caption>`, `<colgroup>`, `<thead>`, `<tbody>`, `scope`) inside chart grid (§4.2 rev 1.73); C3 Summary table rendered as a separate full-width panel below charts with `max-height:none` (§4.1 rev 1.76). |
| **14** | Chart-to-table synchronisation | HTML + JavaScript | `data-c1col`, `.sc-hover-band`, `.chart-snap`, `.col-active` | `data-col-id`, `.c3-grid` band/snap, `.col-active` | Enforce §4.2 rev 1.74/1.75 two-way sync contract: shared `data-col-id` / `data-c1col`, ONE hidden column band (`0.08` opacity), ONE hidden dashed `.chart-snap` line, and border-free `.col-active` cells. |
| **15** | Chart hover detection | SVG + JavaScript | `data-points`, `data-geo` (nearest-mode) | `data-points`, `data-geo` / `data-col-id` (element-mode) | Standardise on SVG/grid event detection bound to `data-points` and `data-geo` via single delegated `bindChartHover()` binder; retire native `<title>` tooltips (§4.6). |
| **16** | Button height | CSS token | `32px` (`min-height:32px`) | `32px` (`min-height:32px`) | Enforce §7.1 rev 1.71 universal `--btn-h: 32px` (`min-height:32px`) for all text-bearing buttons (retiring C1 `compact` 26px chips); restrict `26px` square to icon-only buttons (`A4`, `B4`). |
| **17** | Table crosshair | HTML + CSS + JavaScript | `data-c1col` carve-out | `data-table-crosshair` + `data-col-id` | Enforce §7.2.16 global crosshair: `.row-hover` and `.cell-hover` from shared binder + chart-linked `.col-active` (suppressing competing `.col-hover`). |
| **18** | Panel spacing | CSS Grid / Flexbox | `.panel-grid` (`14px` gap) | Page-scoped 2+1 grid (`14px` gap) | Enforce §4.7 `--panel-gap: 14px` across all top-level panels (zeroing `.panel` margin inside grids); `16px` between chart cards, `12px` between validation cards. |
| **19** | Typography | CSS tokens | Panel-specific overrides | Panel-specific overrides | Enforce §6 `--font-ui` system font stack and normative type scale (`13px` body/h2/h3, `22px` KPI, `12px` controls, `11px` tooltips/meta, `tabular-nums` for numeric cells). |
| **20** | Colour system | CSS custom properties | Shared/local colours | Shared/local colours | Centralised semantic theme tokens (`--surface`, `--surface2`, `--navy`, `--blue`, `--border`, `--line`, `--muted`, `--text`, `--text2`, `--text3`) supporting all 5 themes with zero hard-coded hex (§6). |
| **21** | Spacing system | CSS custom properties | Component-specific spacing | Component-specific spacing | Centralised 8 pt-based spacing scale (`4 · 8 · 12 · 16 · 24 · 32 · 48 px`) and layout gutters (`--c1-gutter: 104px`, `--c3-gutter: 104px`, `--sidebar-w: 160px`) (§3.2, §4.2, §6). |
| **22** | Border and radius | CSS custom properties | Component-specific styles | Component-specific styles | Standardised radii (`10px` panels/cards/tables, `8px` KPIs/inputs/tooltips, `6px` buttons/vchips) and single-border rule (`.c-card:has(.ds-split){border:0}`; `0` radius on shared inner chart-zone edges) (§4, §4.2 rev 1.70, §6). |
| **23** | Hover / focus states | CSS + JavaScript | Component-specific states | Component-specific states | Standardised `:focus-visible` (`2px solid var(--blue)`, `outline-offset:-2px` inside `.seg`, high-contrast light ring on `--navy` active buttons) and WCAG AA contrast (`>= 4.5:1` text, `>= 3:1` UI) (§7.1, §7.5 B2.1). |
| **24** | Responsive layout | CSS Grid / Flexbox | Fluid `1fr` panel reflow | Page-scoped 2+1 grid (stacks at `<= 879px`) | Enforce §3.4.1 `ResizeObserver`-driven reflow with no horizontal page scroll, `auto-fit` KPI grids, and flex-wrap fallback below `1280px`. |
| **25** | Tooltip presentation | HTML + JavaScript | Shared `.chart-tip` | Shared `.chart-tip` | Enforce §4.6 tokenized HTML overlay (`.chart-tip`, `pointer-events:none`, 4-edge clamping, `aria-hidden="true"` + empty text when hidden, closed while cursor is in attached table). |
| **26** | Keyboard and touch | HTML + JavaScript | Panel-specific implementation | Panel-specific implementation | Focusable chart boards (`tabindex="0"`, `aria-describedby`), native `<button>`/`<input>`/`<select>` controls, Escape/blur dismissal, and required touch tap-to-show support (§4.6, §7.1). |
| **27** | PNG / Copy fidelity | SVG + HTML export | SVG + native SVG table rebuild | Native SVG card rebuild (`c3CardToSvg`) | Self-contained native SVG serialization (`<rect>`, `<text>`, resolved token colours, no `<foreignObject>`) preserving top legends and stripping all transient hover/band/snap states (§4.1, §4.2). |
| **28** | Print / PDF behaviour | HTML + CSS print rules | Chart-specific exclusions | Chart/table-specific exclusions | Global `@media print` rules: strip `.row-hover`/`.col-hover`/`.cell-hover`/`.col-active`, hide hover bands/snap lines and interactive sliders/chips (keeping period text), and release `.tableScroll` `max-height` (§4.2, §4.3, §7.2.16). |
| **29** | Control alignment | CSS Flexbox | `.c1-controls` | `.c3-controls` | Shared Flexbox alignment (`align-items:center`, `gap:8px`), title-case visible control labels, and fixed internal control order (§4.2, §7.1). |
| **30** | UI validation | Automated browser testing | Panel-specific assertions | Panel-specific assertions | Enforce §8 two-layer testing (shared `harness-layout` + per-dashboard test suite) covering all **24 normative conformance assertions** (§8.2). |

---

## 3. Additional Technology, Architecture & Governance Standards (Items 31–44)

| # | Standard | Element Type | Recommended Implementation & Spec Alignment (§0–§9) |
| :--- | :--- | :--- | :--- |
| **31** | Component naming | CSS / HTML | Enforce normative class names (`.panel`, `.c-card`, `.ds-table`, `.tableScroll`, `.vheadtab`, `.ds-gut`, `.btn-secondary`, `.tf-btn`, `.tf-all`, `.tf-item`, `.seg`, `.inter-sel`, `.chart-tip`, `.chart-snap`, `.col-active`) and `data-shell` markers (§3.1, §4, §7.1, §7.2.0). |
| **32** | Design tokens | CSS custom properties | Define all semantic colour, typography, spacing, radius, and dimension tokens in `:root` across all **five required themes** (`AGENTS.md` §18.4) in project-local CSS (no `/common/` dependency) (§1, §6). |
| **33** | Component ownership | Architecture | Strict scoping: **Shell** owns titlebar/menubar/sidebar/statusbar (§3.1); **Panel** owns Help `?` and Collapse `−` (§4); **Card** owns its own chart/table controls and exports (§4.1); **Breakdown page** splits C3 into 3 independent panels (`data-c3panel`) (§4.1 rev 1.76). |
| **34** | State management | JavaScript | Single `STATE` object driving deterministic `S0`–`S6` pipeline (`parse once → normalise once → validate once → derive on demand`); write-only S5 DOM render; persisted panel collapse & preset names (§3.8, §4, §4.2). |
| **35** | Loading states | HTML + CSS + JavaScript | MDL full-screen welcome overlay (`1 : 1.618` golden-ratio drop zone/card, load controls inside drop zone, full-selection validation via `Code` sheet `Dashboard Title` before commit) (§3.7). |
| **36** | Empty states | HTML + CSS | Standardized `.empty` table caption/cell, `.ok` severity summary chip when issue count is `0` (§4.5), and `Nothing to export` toast on empty CSV download (§4.3). |
| **37** | Error states | HTML + CSS + JavaScript | Pinned `#errBanner` (`role="alert"`, `aria-live="assertive"`) below menu bar and above filter strip for system/config/formula-error (`W-FORMULA`) notices (§3.5, §3.8.4); row-level issues routed to Validation panel (§4.5). |
| **38** | Data formatting | JavaScript | Shared formatters (`MMM YYYY` / `Qn YYYY` / `YYYY` date templates, local-time `meta.today` without UTC `toISOString()`, explicit units `d` with 1 decimal for durations, `0` instead of blank) (§3.8.2, §4.2, §4.6). |
| **39** | Text overflow | CSS | `text-overflow:ellipsis` on standard `.ds-table` cells; `text-overflow:clip` on `.drill-cell` (`32px` width, `26px` button) (§4.4); full un-truncated Document No. & Title on Forward/Overdue tables (§4). |
| **40** | Browser compatibility | Testing | Desktop-first `1280px` minimum viewport verification, zoom/reflow verification via `ResizeObserver` (§3.4.1), and **standalone `file://` delivery** (single self-contained HTML, no server, no local `fetch` or cross-file imports) (§3.9). |
| **41** | Rendering performance | JavaScript / SVG / Canvas | SVG by default (`H = 300` units, `ResizeObserver` refit); bounded scrollers (`max-height:340px`) with **200-row pagination** (taking precedence over L3 windowing) (§4.3); Canvas conditional on measured volume. |
| **42** | Component testing | Automated testing | Two-layer automated gates: `harness-layout` (Tiers 1–5: geometry, contrast, split-header pairing, matrix rules) + per-stage unit/integration tests for `xlsx-reader.js` and `pipeline.js` (§3.8.5, §8.1). |
| **43** | Design exceptions | Specification / governance | Mandatory **Conformance Record** in each dashboard's workplan (§8.4) documenting every deviation, its spec clause, justification, enforcement posture (`hard` vs `advisory`), and target end state. |
| **44** | Version control | Documentation / testing | Keep root spec and harness-bundled spec byte-identical; preserve historical revision rows verbatim; regenerate standalone HTML build from modular sources via build script to prevent drift (§3.9). |

---

## 4. Prioritised Refactoring & Migration Plan (C1 & C3)

To minimise regression risk, establish the shared CSS tokens, component contracts, and delegated JS controllers first before migrating individual panel markup and class names.

| # | Element | C1 Required Change | C3 Required Change | Priority | Normative Reference |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **1** | Y-axis | Retain SVG (`sc-yaxis-line` + dynamic nice-number ticks) | Migrate HTML `.g-yaxis` to SVG axis + gridlines + dynamic ticks | **P1** | §4.2 rev 1.60 / 1.64 |
| **2** | Chart/table sync | Retain `data-c1col` + `.sc-hover-band` + `.chart-snap` + `.col-active` | Adopt shared `data-col-id` + `.c3-grid` band/snap + border-free `.col-active` | **P1** | §4.2 rev 1.74 / 1.75 |
| **3** | Table crosshair | Retain `.row-hover` / `.cell-hover` + `.col-active` carve-out | Adopt `data-table-crosshair` + `.row-hover` / `.cell-hover` (suppress `.col-hover`) | **P1** | §7.2.16 |
| **4** | Tooltip | Standardise `.chart-tip` (hidden `aria-hidden="true"` + empty text; closed in table) | Standardise `.chart-tip` (hidden `aria-hidden="true"` + empty text; closed in table) | **P1** | §4.6 rev 1.63 / 1.74 |
| **5** | Chart hover | Retain nearest-mode detection (`data-points` / `data-geo`) | Retain element-mode detection (`data-col-id` / `data-points`) | **P1** | §4.6 |
| **6** | Design tokens | Replace duplicated values with `:root` tokens across all 5 themes | Replace duplicated values with `:root` tokens across all 5 themes | **P1** | §6 |
| **7** | Control styling | Retire 26px `compact` chips; adopt `32px` `--btn-h` and §7.5 B2.1 `.seg` rules | Adopt `32px` `--btn-h`, §7.5 B2.1 `.seg` rules, and remove visible `Month` label | **P1** | §7.1 rev 1.71, §7.5 B2.1, §4.2 rev 1.77 |
| **8** | Page & panel structure | Keep single-panel C1 on `Overview` (no inner `.c-card`) | Split into 3 independent panels on `Breakdown` page (`Submissions`, `Approval Status`, `Breakdown Summary`) | **P1** | §3.2, §4.1 rev 1.76 |
| **9** | Toolbar layout | Enforce single-row `.c1-ts` (`flex-wrap:nowrap` at `>= 1280px`) | Enforce single-row tool cluster per chart panel (no second head row above controls) | **P2** | §4.2 rev 1.67 / 1.77 |
| **10** | Chart legend & export | Retain in-SVG top legend; verify native SVG table export fidelity | Retain HTML `.c3-legend` above chart (Bar & Pie); verify native SVG export composition | **P2** | §4.2 rev 1.62 / 1.76 |

---

## 5. Specification Integration Map

The 44 standardisation items map directly to the normative sections of `Dashboard-UI-Design-Spec.md`:

| Specification Section | Covered Matrix Items | Core Normative Scope |
| :--- | :--- | :--- |
| **§0–§2 Definitions, Scope & Philosophy** | #31, #32, #33, #43 | Shared vocabulary, project-local assets, Industrial/Swiss Modernist aesthetic |
| **§3 App Shell, Pipeline & Standalone Delivery** | #18, #24, #33, #34, #35, #37, #40 | Shell zones (`data-shell`), `--sidebar-w:160px`, `ResizeObserver`, `#errBanner`, `S0`–`S6` pipeline, `file://` bundling |
| **§4 Panel, Card, Chart & Hover Standards** | #1–#15, #18, #22, #25, #27 | `.panel` / `.c-card` borders, 3-panel `Breakdown` page, single-row toolbars, dynamic Y ticks, `.chart-tip`, two-way sync |
| **§5 KPI Overview Panel** | #18, #19, #22, #24 | `72px` height, `auto-fit` grid (`minmax(210px, 1fr)`), 5 status top-strip tokens, flat surface |
| **§6 Project-Local Design Tokens** | #19, #20, #21, #22, #32 | `--font-ui` stack, normative type scale, 8 pt spacing scale, radii (`10/8/6px`), 5 themes |
| **§7 Component Library & Table Contracts** | #6–#11, #16, #17, #23, #26, #29, #36, #39 | `32px` text buttons, `26px` icon buttons, `.seg` B2.1 standard, split headers (`.vheadtab` + `.ds-gut`), global crosshair |
| **§8–§9 Conformance, Testing & Adoption** | #30, #41, #42, #43, #44 | Two-layer automated harness, **24 required assertions** (§8.2), workplan conformance records |