# SKILL: harness-layout

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.1 | 2026-10-24 | Codex | Updated shell checks and project-local asset rules. |

**Location**: `harness-layout/` (this folder; self-contained — copy it to any project)
**Purpose**: Universal, **spec-driven** layout evaluation harness — reusable for any future project.
**Spec reference**: the design spec is resolved at run time via `--spec`, defaulting to the bundled `spec/Dashboard-UI-Design-Spec.md` copy. Generic shell checks follow Dashboard UI Design Spec §3.1. Dashboard-specific data and pipeline checks belong in each dashboard check module or project test suite.

---

## What this harness does

It runs three tiers of automated checks against a compiled dashboard HTML file:

| Tier | Name | Needs browser? | Needs workbook? | What it checks |
|------|------|---------------|----------------|----------------|
| 1 | Universal structure | No | No | Project-local assets, stable shell markers, semantic tokens, viewport behavior, action semantics |
| 2 | Browser shell | Yes (Playwright) | No | Shell zone presence and geometry, content-zone order, warning-area bounds, sidebar controls |
| 3 | Data + filter | Yes (Playwright) | Yes (.xlsx) | Pipeline ground-truth KPIs vs rendered DOM values; filter round-trip; W-FORMULA banner |
| 4 | Layout geometry | Yes (Playwright) | Yes (.xlsx) | **Rendered** table metrics: row height, header height, `table-layout:fixed`, `<colgroup>` vs rendered columns, cell truncation, one row metric across all tables (I-90); plus the I-89 executable sample |
| 4b | L3 capabilities | Yes (Playwright) | Yes (.xlsx) | Pinned columns, column chooser, column resize (I-95) and windowing invariants (I-96), driven through the UI |
| 4c | Table chrome | Yes (Playwright) | Best-effort | **Compulsory**: table-title colour consistency and sticky table headers |

---

## File structure

```
harness-layout/
├── harness.mjs          ← main runner (all tiers; auto-discovers dashboards from checks/)
├── package.json         ← Playwright only
├── SKILL.md             ← this file
├── spec/                ← bundled design-spec copy (self-contained default; override with --spec)
└── checks/
    ├── mdl.mjs          ← MDL dashboard config (Tier 3 fully supported)
    ├── ppp.mjs          ← PPP dashboard config (Tier 3 limited — I-76)
    └── <name>.mjs       ← add your own to support a new project
```

---

## How to run

```bash
cd harness-layout
npm install
npx playwright install chromium   # first time only

# All dashboards, all tiers (Tier 3 uses defaultWorkbook from each config)
node harness.mjs

# Single dashboard
node harness.mjs --dashboard mdl

# Single tier
node harness.mjs --dashboard mdl --tier 1

# Tier 3 with explicit workbook path
node harness.mjs --dashboard mdl --tier 3 --workbook "../MDL/TWRP C3B2 - Master Document List.xlsx"
```

Exit code 0 = all checks passed. Exit code 1 = one or more failures. Tier 1 runs without Chromium. Browser tiers fail when Chromium cannot launch.

---

## Tier 1 checks (universal structure — `runTier1`)

- Viewport metadata and root shell markers are present.
- Dashboard does not load `common/universal_ui_design.css` or `.js`.
- Content markers exist.
- External assets use local/root-relative paths. A project-local UI stylesheet and script must be linked. Actions do not use `div` or `td` as buttons.
- Pipeline checks run only when a dashboard config provides `srcDir`.

## Tier 2 checks (shell geometry — `runTier2`)

Checks the shell before data load. The six `data-shell` zones must exist and be visible. It checks the
36 px title bar, 48 px icon bar, full-width 22 px status bar, 260 px initial left sidebar, side-by-side sidebar/content order, a
positive flexible content width, full-viewport locked scrolling, ordered content zones, warning bounds,
and both sidebar toggle and resize controls. It does not require a separate onboarding page or hide the shell before load.

## Tier 3 checks (data + filter — `runTier3`)

**Requires**: `pipelinePath` set in the dashboard config (MDL only until I-76 resolved).

### Ground-truth computation (Node, no browser)
Imports `xlsx-reader.mjs`, `pipeline.mjs`, `render.mjs` directly.
Runs `readXlsx → buildModel → deriveView` with the default filter state (all disciplines,
all non-excluded stages). Captures `view.kpis` as ground truth.

### Browser-side verification
Injects the workbook bytes into the page via `window._loadFile(file)` (if exposed) or
a synthetic `DragEvent` on `.drop`. Waits for `.status-bar:not([hidden])` to confirm render.

**KPI comparisons** (selectors from `cfg.kpiSelectors`):
- `totalPlanned`: DOM value must equal `gt.totalPlanned`.
- `submitted`: DOM value must equal `gt.submitted` (if selector configured).
- `overdueFirst`: DOM value must equal `gt.overdueFirst` (if selector configured).

**Filter round-trip**:
1. Clicks the filter trigger (`.tf-btn`).
2. Deselects all, then selects only the first discipline.
3. Closes the panel (Escape).
4. Reads the `totalPlanned` KPI again.
5. Asserts it equals `deriveView(model, { disciplines: new Set([firstDisc]), … }).kpis.totalPlanned`.

**Validation issue count** (if `validationCountSelector` configured):
DOM count must equal `view.issues.length`.

**W-FORMULA banner** (if model has formula-error warnings):
- `#errBanner` must be visible.
- Number of `.sys-banner-item.fatal` strips must be ≥ number of W-FORMULA warnings.

**Status bar content**: must contain the string representation of `gt.totalPlanned`.

---

## Tier 4 checks (layout geometry — `runTier4`)

**Requires**: Playwright. The live pass also needs `pipelinePath` and a workbook; the sample pass needs
`samplePath`.

Tier 4 measures what a string search cannot: the geometry the browser actually renders.

1. **I-89 sample** — opens `cfg.samplePath` (static, no data needed) and measures every visible
   `table.ds-table`. Findings here are **advisory (WARN)**: the sample is an archived review artefact that
   predates the I-90 rollout, so it is reported but never fails the run.
2. **I-90 live** — loads the real workbook into `cfg.htmlPath`, then measures every visible table **strictly**.

Per table:
- `table-layout` computes to `fixed` (I-90 RC-1).
- `<colgroup>` column count equals the rendered column count. A fragment table pairs a `thead`-only table with a
  body-only table, so either count satisfies the check; the non-applicable assertions are skipped.
- Header row height equals `expectedHeadH` (default 40 px).
- Data-row heights are uniform (spread ≤ `tolerance`) **and** each equals `expectedRowH` (default 40 px).
  Rows measuring 0 px are collapsed/not rendered — excluded and reported as `n collapsed`.
- Body cells truncate (`text-overflow: ellipsis` or `overflow: hidden`).

Across all tables: **one** row metric (max − min ≤ `tolerance`) — this is the core I-90 requirement.

Windowed tables (I-96) carry two `tr.win-pad` spacer rows whose whole job is to hold the scroll height.
They are reported as `padRows` and are **never** measured as data rows; the harness asserts there are
exactly two and that each height is an exact multiple of the row height.

### Tier 4b — L3 capabilities (`lintL3`)

Driven through the real UI in Chromium with the workbook loaded. Because the fixed status bar and the
error banner overlay the panel headers, interactions are dispatched **in-page** (`element.click()` and
synthetic `PointerEvent`s) rather than through Playwright's mouse.

1. **Pinned columns (I-95 / D38)** — the first two columns of every grid-wired table compute to
   `position: sticky`, carry an opaque background, and sit at `left: 0` / `left: <first column width>`.
2. **Column chooser (I-95)** — opens, offers one selectable checkbox per non-pinned column, and hiding
   one column shrinks the `<colgroup>`, the header and the body cells **together**; the choice is written
   to `localStorage` (`mdl_<key>_cols`). Done for both `detail` and `issue`.
3. **Column resize (I-95)** — a synthetic pointer drag on a `.ds-resize` grip widens the column by the
   dragged distance and the new width is persisted (`mdl_<key>_widths`).
4. **Windowing (I-96)** — the windowed table draws far fewer rows than it has, keeps exactly two spacer
   rows, its scroll height is a multiple of the full list, and the control row still reports the **full**
   count (§4.3 contract).

## Tier 4c checks (table chrome — `lintTableChrome`, **compulsory**)

These two rules are **blocking**: any violation fails the run (never WARN, never SKIP when there is
something to check). They run whenever a page is loaded; without a pipeline module the workbook is still
handed over by file drop so the panels render and the rules are enforced.

1. **Table title colour consistency** — every visible title matching `chrome.titleSelector` must resolve
   to the *same* computed colour, that colour must be opaque, and all titles must share one font size and
   weight. Distinct colours are reported side by side (e.g. `rgb(15, 45, 82) | rgb(255, 0, 0)`).
2. **Sticky table headers** — for every rendered `table.ds-table` with a header:
   - **every** header row computes to `position: sticky`;
   - **single-row** headers anchor at `top: 0`; **grouped (multi-row)** headers *stack* — row 0 at `top: 0`,
     row *n* at `top: (sum of the heights of the rows above it)`, so the bands stay visible together with no
     overlap and no gap. A `top: 0` on a second band is a **failure** (it would pile on the band above);
   - the background is opaque (rows must not show through);
   - **scroll proof**: scrolling the container by `scrollProbe` px must leave **every** header row where
     sticky pinned it (moved ≤ `tolerance`, stacking order preserved). Computed style alone is not accepted.
3. **Header-band colour consistency** — within one header row every **non-pinned** cell resolves to the
   *same* background; the group band and the leaf band must use the *same palette*. A per-column emphasis
   (e.g. the selected-month tint) is allowed only if it runs the full column height, not if it splits a band.
   Pinned identity columns intentionally carry an opaque white background and are exempt from this rule.
4. **Scrollbar gutter** — a **grouped** header that lives inside a scroll container must use the split-header
   pattern (`.vheadtab` + `--ds-sbw` gutter, header rendered *outside* the scroller) so the vertical scrollbar
   sits **under** the header, not beside it. Single-row headers are exempt (the I-90 sticky rule covers them).
5. **Layout rules (gated by `chrome.layout`)** — when the dashboard's spec owns column/alignment rules (MDL
   sets `layout: true`), these run in addition:
   - **Header vertical alignment** is `middle` (not `top`); a wrapped header label stays centred.
   - **Header/body alignment match** — the header of a column uses the *same* `text-align` as its body cells
     (a right-aligned numeric column must not have a left-aligned header).
   - **Sort affordance at the trailing edge** — every sortable header's indicator (▲/▼/⇅) sits at the header's
     right edge (`margin-left:auto`), not mid-cell beside the label.
   - **Column minimum** — every column width ≥ `chrome.colMinWidth` (default 60 px); per-type minima are a spec
     concern beyond the hard floor.
   - **Truncation** — non-pinned body cells carry `overflow:hidden; text-overflow:ellipsis` (the table does not
     let long content grow the row height).
   - **Fit policy** — when the column-sum fits the display area the table fills it (proportional to declared
     widths); when it exceeds it a horizontal scrollbar is present and no column is clipped.

**Declared exception — header fragments.** A thead-only table (MDL's `.vheadtab`) has no scroller of its
own; it is aligned in lock-step with the body table beside it, so `sticky` is meaningless there. The
exception is *verified*, not assumed: a non-sticky header is accepted only when it matches
`chrome.headerFragmentSelector`, has no `.tableScroll` parent **and** has a paired scrolling body table.
Anything else is a failure. (The fragment is also excluded from the layout rules, since its gutter column is
intentionally narrower than `colMinWidth`.)

6. **Split-header pairing (gated by `chrome.splitHeader`)** — when a dashboard uses `.vheadtab` fragments
   (MDL sets `splitHeader: true`), the exemption above is paid for with these invariants, one per defect
   that shipped in MDL I-103:
   - **Gap** — the fragment's bottom is flush with the scroller's top (≤ 1 px).
   - **One container** — the wrapper has a border radius while the inner scroller has none, no border and
     no top margin.
   - **Column rule in place** — the fragment's cell is a **containing block** (`position` ≠ `static`) *and*
     the `::after` resolves to a 1 px absolutely-positioned rule. Checking only the pseudo-element can
     never fail: it keeps its own `position:absolute` even when the cell goes static.
   - **Header/data alignment** — each header cell's `text-align` equals that of its data column, paired by
     **rendered left edge**, not by index (a grouped header's `rowspan` offsets child indices).
   - **Column boundaries** — header and body columns coincide (≤ 2 px). The trailing `.ds-gut` spacer is
     excluded: it is not a column and has no body counterpart.
   - **Width equality** — fragment width == scroller width == body width.
   - **Fit** — no horizontal overflow; **lock-step** — if the body scrolls sideways, the header moves with
     it (skipped as N/A when the body does not scroll).

## Dashboard config schema (`checks/*.mjs`)

```js
export default {
  // Required
  htmlPath: '/absolute/path/to/Dashboard.html',

  // Tier 1 — set to null if not modularised (PPP I-76)
  srcDir:          '/absolute/path/to/src',
  xlsxReaderPath:  '/absolute/path/to/src/xlsx-reader.mjs',
  pipelinePath:    '/absolute/path/to/src/pipeline.mjs',
  renderPath:      '/absolute/path/to/src/render.mjs',

  // Tier 3 — default workbook (overridden by --workbook CLI arg)
  defaultWorkbook: '/absolute/path/to/workbook.xlsx',

  // Tier 3 — CSS selectors for KPI .v elements
  kpiSelectors: {
    totalPlanned: '.kpi:nth-child(1) .v',
    submitted:    '.kpi:nth-child(2) .v',   // null = skip
    overdueFirst: '[data-kpi="overdueFirst"] .v',  // null = skip
  },

  // Tier 3 — filter trigger button selector
  filterTriggerSelector: '.tf-btn',

  // Tier 3 — validation panel issue count element selector (null = skip)
  validationCountSelector: null,

  // Tier 4 — layout geometry
  samplePath: '/absolute/path/to/Arch/sample-data-tables.html',
  geometry: {
    tableSelector:  'table.ds-table',
    expectedRowH:   40,   // --ds-row-h
    expectedHeadH:  40,   // --ds-head-h
    sampleRowLimit: 12,   // rows measured per table
    tolerance:      0.5,  // px
  },

  // Tier 4c — table chrome (compulsory)
  chrome: {
    titleSelector:          '.panel-head h2',
    headerFragmentSelector: '.vheadtab',  // null if the dashboard has no thead-only fragment
    multiRow:               true,   // enforce grouped-header stacking + scrollbar-gutter (MDL matrix); false for dashboards without that spec rule
    layout:                 true,   // enforce alignment / sort-affordance / column-sizing rules (I-102); false elsewhere
    splitHeader:            true,   // enforce split-header pairing rules (spec §7.2.15); false elsewhere
    colMinWidth:            60,     // hard floor for every column (spec §18: replace with per-type minima)
    scrollProbe:            240,          // px scrolled to prove the header sticks
    tolerance:              2,            // px
  },
};
```

---

## Adding a new dashboard

1. Create `checks/<name>.mjs` following the schema above. The harness **auto-discovers** it — no core edit needed.
2. (Obsolete) The `DASHBOARDS` array is gone; dashboards are read from `checks/` at run time.
3. If the dashboard has a modular `src/` pipeline, set all four path fields.
4. If the dashboard is monolithic, set `pipelinePath: null` and log a workplan issue for modularisation.
5. Point at your design spec with `--spec <path>` (defaults to the bundled `spec/Dashboard-UI-Design-Spec.md` copy). The encoded checks correspond to the Dashboard UI Design Spec; adapt the ruleset in `harness.mjs` for a different spec.

---

## Relationship to `MDL/test/test_pipeline.mjs`

`test_pipeline.mjs` is the **unit test** for the pipeline logic (§3.8.5): it runs in Node,
imports `pipeline.mjs` directly, and asserts record counts, KPI values, lookup table contents,
and validation rule sourcing. It does not use a browser.

`harness-layout/harness.mjs` is the **integration test**: it verifies that the compiled,
bundled HTML renders the same numbers that the pipeline computes, and that the UI controls
(filters, warning bar, status bar) behave correctly. It uses Playwright.

Both must pass before a release. `test_pipeline.mjs` is faster and runs first; `harness.mjs`
is the final gate.

---

## Known limitations / open items

| Item | Detail |
|------|--------|
| PPP Tier 3 | Blocked by I-76 (monolithic pipeline). Once `src/` modules are extracted, set `pipelinePath` in `checks/ppp.mjs`. |
| `_loadFile` hook | MDL `render.mjs` exposes `window._loadFile = loadFile` at the end of `boot` (line 2167). Tier 3 injection uses this directly. PPP does not expose it (I-76); the harness falls back to a synthetic `DragEvent` on `.drop`. |
| KPI selectors | `kpiSelectors` in each config must be kept in sync with the dashboard's rendered HTML. If a KPI card is reordered, update the selector. |
| Validation count selector | `validationCountSelector` is `null` in both configs until the validation panel exposes a stable count element (e.g. `[data-count="issues"]`). |

---

## Spec cross-references

| Spec section | What the harness checks |
|---|---|
| §3.5 | errBanner z-index, hidden state, applyBannerState, banner-open, W-FORMULA strips |
| §3.6 | status-bar z-index, hidden before load, padding-bottom:52px |
| §3.7 | Onboarding screen, logo embedded, headline, dropzone, privacy, copyright, expect |
| §3.8.0 | src/ modules exist |
| §3.8.2 | STATE object, write-only render, per-stage try/catch, local date for as-of |
| §3.8.3 | parseCodeSheet, findLookupColumns, buildFieldToCol present |
| §3.8.4 | isExcelError, W-FORMULA present |
| §3.8.5 | This harness IS the §3.8.5 layout harness |
| §4 | panel data-panel, padding 14px 14px 26px |
| §4.2 | scurveAxisMode, rotate(-90 bar labels, cumulative absolute |
| §4.3 | max-height:340px, print release |
| §4.5 | .vchip, .vdetails |
| §5 | .kpi, .subkpi |
| §6 | All canonical :root tokens |
| §6.1 | data-theme / dark |
| §7.1 | min-height:32px, min-height:26px |
| §7.2 | .ds-table, .tableScroll, --ds-row-h, .sev-svg |
| §7.9 | .help-modal hidden initially |
