// Revision 0.1 | 2026-11-14 | CodeBuddy (AI) | Sample page for the new Breakdown page
// (I133 / UI spec rev 1.76), rendered inside the real Option-B app shell so the design
// can be reviewed against the UI spec. Uses the real dashboard.css and the real
// derived data through the REAL render path: `renderDashboard(..., { page: 'Breakdown' })`
// emits the three independent panels (Submissions, Approval Status, Breakdown Summary),
// so borders, spacing, controls, legend order and the `Others` label are exactly what the
// delivered dashboard renders. The engine is NOT modified.
// Output: sub/ref/sample-breakdown.html.
import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import { readXlsx } from '../engine/xlsx-reader.js';
import { buildModel } from '../engine/pipeline.js';
import { renderDashboard } from '../engine/render.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => fs.readFileSync(path.join(ROOT, rel), 'utf8');

// --- real data -------------------------------------------------------------
const config = JSON.parse(read('config/pipeline_contract.json'));
const bytes = n => { const v = fs.readFileSync(path.join(ROOT, n)); return v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength); };
const model = buildModel(await readXlsx(bytes('TWRP C3B2 - Master Document List.xlsx')), await readXlsx(bytes('TWRP C3B2 - Document Submittal Log.xlsx')), { contract: config, today: '2026-10-24' });
const asOf = model.meta.asOfDate;

// renderDashboard binds to `window` / `document` (hover windows, resize, print).
// The same stubs the render tests use let the module run inside Node; nothing else
// reads them, and the emitted HTML is what a browser would show on first paint.
globalThis.window = {
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  requestAnimationFrame: fn => fn(), innerWidth: 1440, innerHeight: 900
};
globalThis.document = { addEventListener() {}, removeEventListener() {} };

let html = '';
const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? node : null }, model, { page: 'Breakdown' });

// --- assemble page inside the real Option-B shell ---------------------------
const css = read('engine/dashboard.css');
const page = `<!doctype html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Breakdown — Sample (UI-spec review, I133)</title>
<style>${css}</style>
<style>
  .sample-meta{font-size:11px;color:var(--text3);margin:0 0 10px}
</style>
</head>
<body class="loaded">
  <div class="app">
    <header class="app-bar">
      <div class="app-top">
        <div class="brand">
          <div class="ttl-stack">
            <h1 class="ttl">Document Submittal Dashboard</h1>
            <div class="meta">SUB · Breakdown page sample (review, I133)</div>
          </div>
        </div>
        <div class="page-title" id="page-title">Breakdown</div>
      </div>
      <div class="app-menu">
        <button class="btn" data-shell-toggle="left-sidebar" title="Toggle navigation panel" aria-label="Toggle navigation panel">&#9776;</button>
        <div class="actions">
          <button class="btn btn-primary" disabled>Load Workbook</button>
          <button class="btn" disabled>Export</button>
        </div>
        <button class="btn" title="Change layout" aria-label="Change layout">&#9638;</button>
      </div>
    </header>
    <main class="shell-row">
      <aside class="left-sidebar">
        <nav class="sb-menu page-links">
          <button class="page-link" data-page="Overview">Overview</button>
          <button class="page-link active" data-page="Breakdown">Breakdown</button>
          <button class="page-link" data-page="Submittals">Submittals</button>
          <button class="page-link" data-page="Validation">Validation</button>
          <button class="page-link" data-page="Forward and Overdue">Forward and Overdue</button>
          <button class="page-link" data-page="Analytical">Analytical</button>
        </nav>
        <nav class="sb-bottom">
          <button class="page-link" id="settings-button">Settings</button>
          <button class="page-link" id="help-button">Help</button>
        </nav>
      </aside>
      <section class="content">
        <div class="filter-area"></div>
        <div class="content-body">
          <p class="sample-meta">Sample for UI-spec review (I133 / rev 1.76) — real data (as of ${asOf}), real render path. The sidebar lists Breakdown directly under Overview. Three independent panels: Submissions, Approval Status (side by side) and Breakdown Summary (full width). Each panel owns its Month / Break-down-by / view state; the legend sits above each chart; the orphan discipline reads Others.</p>
          <div data-page-content>${html}</div>
        </div>
      </section>
    </main>
  </div>
</body>
</html>`;

const TARGET = path.join(ROOT, 'ref', 'sample-breakdown.html');
fs.writeFileSync(TARGET, page);
const panels = (html.match(/<section class="panel/g) || []).length;
console.log(`Sample Breakdown page written: ${TARGET} (${page.length.toLocaleString()} bytes)`);
console.log(`panels rendered: ${panels} (expect 3); legend blocks: ${(html.match(/class="c3-legend"/g) || []).length} (expect 2); Others hits: ${(html.match(/Others/g) || []).length}`);
