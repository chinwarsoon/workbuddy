// Revision 1.5 | 2026-11-28 | CodeBuddy (AI) | I-166 close — the S-curve header probe reads --thead-bg / --thead-fg instead of the old navy / white pair.
// Revision 1.4 | 2026-11-28 | AWS Quick (AI) | I-166 / common C-08 — add the `themes` block so harness Tier 8 (lintThemes, rev 1.47) runs for MDL instead of SKIPping.
// Revision 1.3 | 2026-11-27 | CodeBuddy (AI) | Spec §3.7 rev 1.113 — declare MDL doneDwellMs 3000 for assertion 53.
// Revision 1.2 | 2026-11-26 | CodeBuddy (AI) | I-164 W3 — enable the gated Tier 7 welcome and check 51 for MDL.
// checks/mdl.mjs — harness config for the MDL dashboard (EXAMPLE).
// This is project data, not part of the universal harness core: replace it (and ppp.mjs) with
// your own dashboard's config when you reuse harness-layout elsewhere.
// Tier 3 is fully supported: pipeline is modular (src/).
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const mdlRoot = resolve(here, '../../MDL');

export default {
  // Paths
  htmlPath:       resolve(mdlRoot, 'MDL-Dashboard.html'),
  srcDir:         resolve(mdlRoot, 'src'),
  xlsxReaderPath: resolve(mdlRoot, 'src/xlsx-reader.mjs'),
  pipelinePath:   resolve(mdlRoot, 'src/pipeline.mjs'),
  renderPath:     resolve(mdlRoot, 'src/render.mjs'),
  defaultWorkbook: resolve(mdlRoot, 'TWRP C3B2 - Master Document List.xlsx'),

  // Tier 3 — exercise the left sidebar toggle and verify the content still fills the row.
  sidebarToggle: true,

  // Tier 3 — DOM selectors for KPI values.
  // The MDL dashboard renders KPI cards in document order; selectors use data-kpi
  // attributes if present, otherwise positional .kpi .v fallbacks.
  kpiSelectors: {
    totalPlanned:  '.kpi:nth-child(1) .v',
    submitted:     '.kpi:nth-child(2) .v',
    overdueFirst:  '[data-kpi="overdueFirst"] .v',
  },

  // Tier 3 — filter trigger button selector (opens the Discipline filter panel)
  filterTriggerSelector: '.tf-btn',

  // Tier 3 — validation issue count (I-160: Shown issues chip)
  validationCountSelector: '[data-validation-count]',
  validationPage: 'Validation',

  // Tier 4 — layout geometry (I-90 grid foundation; I-89 executable sample)
  samplePath: resolve(mdlRoot, 'Arch/sample-data-tables.html'),
  geometry: {
    tableSelector:  'table.ds-table',
    expectedRowH:   40,   // --ds-row-h
    expectedHeadH:  40,   // --ds-head-h
    sampleRowLimit: 12,   // rows measured per table
    tolerance:      0.5,  // px
  },

  // Tier 4c — table chrome (compulsory)
  chrome: {
    titleSelector: '.panel-head h2',  // every table panel title
    headerFragmentSelector: '.vheadtab', // thead-only split header: no scroller, paired with a body table
    multiRow:      true,              // enforce grouped-header stacking + scrollbar-gutter rules (MDL matrix)
    layout:        true,              // enforce alignment / sort-glyph / column-sizing rules (I-102)
    splitHeader:   true,              // enforce split-header pairing: gap / corners / column rule / alignment / fit / lock-step (I-103)
    controlContrast: true,            // every visible control must have readable text (contrast ≥ 3:1) — I-105
    colMinWidth:   60,                // hard floor for every column (spec §18: replace with per-type minima)
    // I-162 — only these grid tables pin two columns. Overdue and Validation Rules use the grid
    // for width and visibility, but their approved designs do not pin identity columns.
    pinnedGridKeys: ['issue', 'detail'],
    minGridTables:  2,
    scrollProbe:   240,               // px scrolled to prove the header sticks
    tolerance:     2,                 // px
  },

  // Tier 2 — spec §3.1 / §3.5: every page must keep its warning and filter strips
  // outside the scrolling body, and the body must scroll when content exceeds one screen.
  contentScroll: {
    zoneSelector:  '[data-shell="content"]',
    bodySelector:  '[data-shell="body"]',
    probeHeight:   2000, // px; forces overflow without depending on workbook row count
    probeScroll:   80,   // px; proves the container moves
    tolerance:     1,    // px
  },

  // Tier 5 — spec §4.2 rev 1.103: attached-table gap, board fit, header rotation
  // and themed header fill. Config-gated; independent of cfg.c1 (MDL has none).
  boardTable: {
    pages:                 ['Progress'],
    gridSelector:          '.curve-card .curve-c1-grid',
    plotSelector:          '.curve-card .curve-c1-plot',
    tableSelector:         '.curve-card .curve-c1-table',
    headerCellSelector:    '.curve-card .curve-c1-table thead th.g-axis',
    headerSpanSelector:    '.curve-card .curve-c1-table thead th.g-axis span',
    gapVar:                '--c1-plot-table-gap',
    expectedGap:           10,
    manyClass:             'c1-many',
    csvSelector:           '.curve-card .chart-actions .csv',
    pngSelector:           '.curve-card .chart-actions .dl',
    headerFillVar:         '--thead-bg',
    headerTextVar:         '--thead-fg',
    centerBandSelector:    '.curve-card .curve-c1-plot .sc-hover-band',
    centerTolerance:       2,
    tolerance:             0.5,
  },

  // Tier 5 — spec §7.2.16: one shared row / column / intersection crosshair.
  tableCrosshair: {
    tableSelector: 'table[data-table-crosshair]',
    cellSelector:  'table[data-table-crosshair] tbody td[data-col-id]:visible',
    hoverWaitMs:   80,
    outside:       { x: 5, y: 5 },
    pages:         ['Overview', 'Progress', 'Overdue', 'Validation', 'Documents'],
    // §7.2.16 chart-linked tables keep .col-active and add NO competing .col-hover.
    // MDL's Issue Progress C1 table carries this class instead of sub's .c1-table.
    chartLinkedClass: 'curve-c1-table',
  },

  // Tier 6 — spec §4.6: KPI cards carry one shared hover window.
  hover: {
    ariaHidden: true,
    boards: [],
    kpi: { name: 'KPI card', selector: '.kpi-card', snap: false, cursor: 'help' },
  },

  // Tier 7 — spec §3.7 rev 1.107: MDL adopts the shared welcome module (I-164, W3).
  welcome: {
    mode: 'auto',
    files: 1,
    doneDwellMs: 3000,
    forbiddenText: ['TWRP C3B2'],
    loadCheck: true,
    // I-165 / spec §3.7.5 rev 1.110 — a non-required workbook for the 48 / 52 extra-file pick.
    extraFile: resolve(mdlRoot, 'TWRP C3B2 - Document Submittal Log.xlsx'),
  },

  // Tier 8 — spec §18.4 / §8.2 assertion 54 (I-166 / common C-08): six-theme AA contrast sweep.
  // Uses the harness default theme list and AA pairs (common/tokens/tokens.schema.json); MDL has
  // no theme-specific overrides to declare here, so the block only needs to exist to un-SKIP Tier 8.
  themes: {},
};
