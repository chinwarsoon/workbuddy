# harness-layout

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.1 | 2026-10-24 | Codex | Documented the generic shell geometry checks. |
| 1.2 | 2026-10-30 | opencode (AI) | Added the `samples/` review sample, its measurements and spec conflicts, and the `_shellreview` config. |
| 1.3 | 2026-10-30 | opencode (AI) | Tier 3 can take a per-dashboard `groundTruth` adapter for a model shape that differs from MDL (used by PPP); the default path is unchanged. |
| 1.4 | 2026-11-01 | opencode (AI) | Tier 1 accepts a declared inline classic script; Tier 4c scopes sticky to `.tableScroll`, exempts a split body from the header-height rule, and checks fragment width against body + scrollbar. |

Universal, spec-driven layout evaluation harness — reusable for any future project.

See **[SKILL.md](./SKILL.md)** for the full specification, check catalogue, and AI model context.

## Quick start

```bash
cd harness-layout
npm install
npx playwright install chromium

# Run all tiers against all dashboards (auto-discovered from checks/)
node harness.mjs

# Point at a specific design spec (default: bundled spec/Dashboard-UI-Design-Spec.md; override with --spec)
node harness.mjs --spec path/to/your-spec.md

# MDL only, Tier 1 (structural, no browser)
node harness.mjs --dashboard mdl --tier 1

# MDL Tier 3 with explicit workbook
node harness.mjs --dashboard mdl --tier 3 --workbook "path/to/dashboard.xlsx"
```


### Tier 3 adapter

If a dashboard does not use the MDL model/state shape, set `groundTruth` in its
`checks/*.mjs` config:

```js
groundTruth: async ({ workbookPath, readFileSync, pathToFileURL }) => ({
  model, state, view, kpis: { totalPlanned }, issueCount, demoFilter
})
```

The adapter builds the ground truth from that project's own modules. `view` is compared through
`kpis.totalPlanned` and `issueCount`; the MDL-only dated-series checks are skipped. `demoFilter`
is optional: supply it with a `filterRoundTrip.apply` callback to drive the project's own filter UI.

## Tiers

| Tier | What | Browser | Workbook |
|------|------|---------|----------|
| 1 | Project-local assets, shell markers, theme tokens, viewport behavior, action semantics | No | No |
| 2 | Shell zones and geometry, content-zone order, warning-area bounds, sidebar controls | Yes | No |
| 3 | Pipeline ground-truth KPIs vs rendered DOM; filter round-trip | Yes | Yes |
| 4 | **Rendered** table geometry: row/header heights, `table-layout:fixed`, `<colgroup>` vs columns, cell truncation, one row metric across tables (I-90) + I-89 sample + windowing spacer rows (I-96) | Yes | Yes (sample pass: no) |
| 4b | L3 capabilities: pinned columns, column chooser, column resize (I-95) and windowing invariants (I-96), driven through the UI | Yes | Yes |
| 4c | **Compulsory**: table-title colour consistency; sticky table headers (single-row anchored, grouped headers *stacked* — scroll proof on every band); header-band colour uniformity; scrollbar gutter for grouped headers; and (when `chrome.layout`) header vertical-align, header/body alignment match, sort-glyph trailing edge, column minimum, cell truncation and fit policy; plus (when `chrome.splitHeader`) split-header pairing — gap, one rounded container, column rule in place, header/data alignment, column boundaries, width equality, fit and horizontal lock-step | Yes | Best-effort |
| 6 | **§4.6 hover window** (spec §4.6): per chart board (C1–C4) and KPI card — focusable host + `aria-describedby` → `role="tooltip"` window, `cursor:crosshair` (charts) / `cursor:help` (KPI) affordance, nearest charts expose `.chart-snap`, hover/tap reveals the window (hides on pointer-leave), and the C2 series-row `.ct-l` swatch+label group is guarded | Yes | Best-effort |

```bash
# I-89 / I-90 layout verification only
node harness.mjs --dashboard mdl --tier 4
```

Tier 6 (§4.6 hover window) — added 2026-11-01. It requires a `hover` block in the dashboard
config (see `checks/sub.mjs`); dashboards without one are skipped. It runs a **general side-bar
exploration**: it visits every `[data-page]` menu item and discovers **every** hover-window host by
scanning `[aria-describedby]` → `role="tooltip"` (C1–C4 and KPI cards on any page), then clicks
in-page button switches (segmented controls, tabs, toggles) and re-scans. Run it with:

```bash
node harness.mjs --dashboard sub --tier 6
```

## Dashboard configs (auto-discovered)

The harness reads every `checks/*.mjs` at run time — drop in a new config to add a dashboard, no core edit.

- `checks/mdl.mjs` — MDL (Tier 3 fully supported)
- `checks/ppp.mjs` — PPP (Tier 3 limited — I-76: monolithic pipeline)
- `checks/_shellreview.mjs` — shell review sample. The leading `_` keeps it out of the default run:

```bash
node harness.mjs --dashboard _shellreview --tier 1
node harness.mjs --dashboard _shellreview --tier 2
```

## Samples

`samples/dashboard-shell-sample.html` is a review-only page that renders the shell required by the
root `Dashboard-UI-Design-Spec.md` §3.1–§3.3. It holds no project data. See
**[samples/README.md](./samples/README.md)** for the measurements, the six conflicts between the
spec and `AGENTS.md` §18, the deliberate scope deviations, and the open review questions.

Current state: Tier 1 8 passed / 0 failed / 1 skipped; Tier 2 23 passed / 0 failed.
