# harness-layout

Universal layout evaluation harness for workbuddy dashboards.

See **[SKILL.md](./SKILL.md)** for the full specification, check catalogue, and AI model context.

## Quick start

```bash
cd harness-layout
npm install
npx playwright install chromium

# Run all tiers against all dashboards
node harness.mjs

# MDL only, Tier 1 (structural, no browser)
node harness.mjs --dashboard mdl --tier 1

# MDL Tier 3 with explicit workbook
node harness.mjs --dashboard mdl --tier 3 --workbook "../MDL/TWRP C3B2 - Master Document List.xlsx"
```

## Tiers

| Tier | What | Browser | Workbook |
|------|------|---------|----------|
| 1 | CSS tokens (presence **and values**), z-index stack, table grid tokens, pipeline symbols in bundle | No | No |
| 2 | Onboarding screen, header, errBanner, status bar, modal | Yes | No |
| 3 | Pipeline ground-truth KPIs vs rendered DOM; filter round-trip | Yes | Yes |
| 4 | **Rendered** table geometry: row/header heights, `table-layout:fixed`, `<colgroup>` vs columns, cell truncation, one row metric across tables (I-90) + I-89 sample + windowing spacer rows (I-96) | Yes | Yes (sample pass: no) |
| 4b | L3 capabilities: pinned columns, column chooser, column resize (I-95) and windowing invariants (I-96), driven through the UI | Yes | Yes |
| 4c | **Compulsory**: table-title colour consistency; sticky table headers (single-row anchored, grouped headers *stacked* — scroll proof on every band); header-band colour uniformity; scrollbar gutter for grouped headers; and (when `chrome.layout`) header vertical-align, header/body alignment match, sort-glyph trailing edge, column minimum, cell truncation and fit policy; plus (when `chrome.splitHeader`) split-header pairing — gap, one rounded container, column rule in place, header/data alignment, column boundaries, width equality, fit and horizontal lock-step | Yes | Best-effort |

```bash
# I-89 / I-90 layout verification only
node harness.mjs --dashboard mdl --tier 4
```

## Dashboard configs

- `checks/mdl.mjs` — MDL (Tier 3 fully supported)
- `checks/ppp.mjs` — PPP (Tier 3 limited — I-76: monolithic pipeline)
