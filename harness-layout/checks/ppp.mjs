// checks/ppp.mjs — harness config for the PPP dashboard.
// Project data, not harness core. Tiers 1–2 check the shared shell; Tier 3 imports the PPP
// modules for ground truth. The PPP model/state shape differs from MDL, so this config supplies a
// `groundTruth` adapter (harness.mjs supports it) and its own filter round-trip steps.
// Revision 1.1 - 2026-10-30 - opencode (AI): I-76 P4. src paths set, Tier 3 adapter added.
// Revision 1.2 - 2026-11-01 - opencode (AI): P7. Split-header gates, inline classic declaration
// and minGridTables: 0 (no resizable grid table) are set.
import { resolve, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pppRoot = resolve(here, '../../PPP');
const src = name => resolve(pppRoot, 'src', name);

export default {
  // Paths
  htmlPath:        resolve(pppRoot, 'Procurement-Dashboard.html'),
  srcDir:          resolve(pppRoot, 'src'),
  xlsxReaderPath:  src('xlsx-reader.mjs'),
  pipelinePath:    src('pipeline.mjs'),
  renderPath:      src('render.mjs'),
  defaultWorkbook: resolve(pppRoot, 'TWRP C3B2 - Procurement Package Plan.xlsx'),
  // P8: the dashboard routes panels by page; measure each page that carries a table.
  layoutPages: ['schedule', 'overdue', 'quality'],

  // Tier 3 — DOM selectors
  kpiSelectors: {
    totalPlanned: '.kpi:nth-child(1) .v',
    submitted:    null,
    overdueFirst: null,
  },

  // PPP computes its own ground truth (model, state and view shapes differ from MDL).
  groundTruth: async ({ workbookPath, readFileSync, pathToFileURL }) => {
    const { parseXlsx } = await import(pathToFileURL(src('xlsx-reader.mjs')).href);
    const { buildModel, validate } = await import(pathToFileURL(src('pipeline.mjs')).href);
    const { deriveView } = await import(pathToFileURL(src('render.mjs')).href);
    const buf = readFileSync(workbookPath);
    const wb = await parseXlsx(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    const { model, vctx } = buildModel(wb, basename(workbookPath));
    const report = validate(model.packages, vctx);
    const mkState = cats => ({ report, filter: { cats }, chartView: { packages: 'status', data: 'dqByRule' },
      prefs: { chartType: {}, poBars: true }, poWin: { from: 0, to: 0, _n: 0 }, ui: { typeFilterBound: false } });
    const view = deriveView(model, mkState(null));

    // Pick a category that narrows the set, and compute its expected total for the UI round-trip.
    let demoFilter = null;
    for (const cat of view.catList) {
      const v = deriveView(model, mkState(new Set([cat])));
      if (v.active.length > 0 && v.active.length < view.active.length) {
        demoFilter = { cat, expected: v.active.length };
        break;
      }
    }
    return { model, state: mkState(null), view,
      kpis: { totalPlanned: view.active.length },
      issueCount: view.issues.data.length,
      demoFilter };
  },

  filterTriggerSelector: '.tf-btn',
  filterRoundTrip: {
    apply: async (page, cfg) => {
      const demo = cfg._adapter && cfg._adapter.demoFilter;
      if (!demo) return null;
      await page.locator('.tf-btn').first().click();
      await page.waitForTimeout(150);
      const all = page.locator('#tfPanel input#tfAll');
      if (await all.isChecked().catch(() => false)) await all.click();   // clear
      const box = page.locator(`#tfPanel .tf-cat[data-cat="${demo.cat}"]`);
      await box.check();
      await page.locator('.tf-btn').first().click();                     // close
      await page.waitForTimeout(300);
      return demo.expected;
    },
  },
  validationCountSelector: null,

  // Tier 4c — table chrome (compulsory)
  chrome: {
    titleSelector: '.panel-head h2, h2',
    scrollProbe:   240,
    tolerance:     2,
    controlContrast: true,
    // P7: the split-header contract is implemented in render.mjs (one helper, gutter, lock-step).
    headerFragmentSelector: 'table.vheadtab',
    splitHeader: 'table.vheadtab',
    // P7 / D16: PPP has no resizable grid tables; column sizing and grips are not offered.
    minGridTables: 0,
  },

  // P7: the delivered page is one standalone classic IIFE (§3.9 / D8); declare it so Tier 1 checks
  // for project-local shipped code instead of module syntax.
  inlineClassicScript: true,
};
