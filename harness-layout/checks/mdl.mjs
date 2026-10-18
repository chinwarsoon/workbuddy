// checks/mdl.mjs — harness config for the MDL dashboard.
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

  // Tier 3 — validation panel issue count
  validationCountSelector: null,  // set once the panel exposes a count element

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
    scrollProbe:   240,               // px scrolled to prove the header sticks
    tolerance:     2,                 // px
  },
};
