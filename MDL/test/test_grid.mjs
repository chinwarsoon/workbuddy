// Regression test for the L3 grid kit (I-95) and windowed rendering (I-96).
// Runs the bundle in a jsdom + node-vm context WITHOUT rendering the dashboard,
// so it stays fast and memory-safe (the full-render test needs ~10 GB for the
// 21 866-row issue list and cannot run in every environment).
// Run from the MDL directory:  node test/test_grid.mjs
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(ROOT, 'MDL-Dashboard.html');

const html = fs.readFileSync(HTML, 'utf8');
const scriptMatch = html.match(/<script type="module">([\s\S]*?)<\/script>/);
if (!scriptMatch) { console.error('FAIL: no module script found in bundle'); process.exit(1); }
// expose the internals this test drives (the bundle strips exports during build)
const code = scriptMatch[1]
  + '\nglobalThis.__mg=makeGrid;globalThis.__mw=makeWindow;globalThis.__wt=WINDOW_THRESHOLD;';

const dom = new JSDOM('<!doctype html><html><body><div id="app"></div></body></html>',
  { url: 'http://localhost/', pretendToBeVisual: true });
const { window } = dom;
const ctx = {
  window, document: window.document, navigator: window.navigator, localStorage: window.localStorage,
  HTMLElement: window.HTMLElement, Image: window.Image, XMLSerializer: window.XMLSerializer,
  Blob: window.Blob, URL: window.URL, console,
  requestAnimationFrame: cb => setTimeout(() => cb(Date.now()), 0),
  cancelAnimationFrame: id => clearTimeout(id),
  setTimeout, clearTimeout, TextDecoder, Response: globalThis.Response,
  WritableStream: globalThis.WritableStream, ReadableStream: globalThis.ReadableStream,
};
ctx.DecompressionStream = class {
  constructor() { this._c = []; let ctrl = null;
    this.writable = new globalThis.WritableStream({ write: c => this._c.push(Buffer.from(c)), close: () => { try { ctrl.enqueue(zlib.inflateRawSync(Buffer.concat(this._c))); ctrl.close(); } catch (e) { ctrl.error(e); } } });
    this.readable = new globalThis.ReadableStream({ start: c => { ctrl = c; } }); }
};
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(code, ctx, { filename: 'bundle.js' });

const D = window.document;
const checks = [];
const ok = (name, cond, extra = '') => checks.push({ name, pass: !!cond, extra });

const makeGrid = ctx.__mg, makeWindow = ctx.__mw;
const FIELD_ORDER = ['Document No.', 'UESH Discipline', 'Stage', 'Planned 1st Issue Date',
  'Submission Status', 'Latest Approval Status', 'Authority', 'Discipline (Code)',
  'Vendor Data', 'As-Built', 'Actual 1st Issue Date', 'Actual Approval Date', 'Planned Approval Date',
  'Forecast 1st Issue Date', 'Latest Approval Status Date', 'Client Review Date', 'Rev', 'Description',
  'Contractor', 'Consultant', 'Doc Type', 'Rev No', 'Sheet No', 'Zone', 'Building', 'Level', 'Grid Ref'];
const detailCols = [
  { key: '__src', label: 'Source Tab', sortable: false },
  { key: '__active', label: 'Active', sortable: true, type: 'enum', order: ['Yes', 'No'] },
  ...FIELD_ORDER.map(c => ({ key: c, label: c, sortable: true, type: 'text' }))
];

// --- clean slate for every assertion block ---
const clean = () => { window.localStorage.clear(); };

// ---------- I-95: column model ----------
clean();
let g = makeGrid('detail', detailCols);
const vis = g.visible().map(c => c.key);
ok('grid: default view is the eight core columns (D37)',
  JSON.stringify(vis) === JSON.stringify(['__src', 'Document No.', '__active', 'UESH Discipline', 'Stage',
    'Planned 1st Issue Date', 'Submission Status', 'Latest Approval Status']), vis.join(','));
ok('grid: the pinned identity columns come FIRST (D38)', vis[0] === '__src' && vis[1] === 'Document No.', vis.slice(0, 2).join(','));
// 29 columns total = __src + __active + 27 contract fields; 8 visible → 21 hidden
ok('grid: 21 of 29 columns are hidden by default (D37)', g.hiddenCount() === 21, `hidden=${g.hiddenCount()}`);
ok('grid: colgroup carries one <col> per visible column',
  (g.colgroupHTML().match(/<col /g) || []).length === vis.length);
ok('grid: pinned cells carry .ds-pinned, the last one .ds-pinned-edge',
  g.td(detailCols[0], 'x').includes('ds-pinned') && !g.td(detailCols[0], 'x').includes('ds-pinned-edge')
  && g.td({ key: 'Document No.' }, 'x').includes('ds-pinned-edge')
  && !g.td({ key: 'Stage' }, 'x').includes('ds-pinned'),
  g.td({ key: 'Document No.' }, 'x').slice(0, 80));
const head = g.headRow({ col: '', dir: 1 });
ok('grid: a non-sortable column still renders a plain header cell (no sort button)',
  head.includes('Source Tab') && head.includes('scope="col"')
  && !/data-col="__src"[^>]*sort-lbl/.test(head) && head.includes('sort-lbl'),
  head.slice(0, 110));

// ---------- I-95: persistence (D40) ----------
clean();
window.localStorage.setItem('mdl_detail_widths', JSON.stringify({ '__src': 200 }));
g = makeGrid('detail', detailCols);
ok('grid: persisted widths win over the defaults', g.widthOf('__src') === 200, `${g.widthOf('__src')}px`);
ok('grid: unknown persisted widths are dropped', g.widthOf('Nope') === 130);
window.localStorage.setItem('mdl_detail_cols', '__active,Stage');
g = makeGrid('detail', detailCols);
ok('grid: persisted visibility is restored, pinned columns always kept',
  JSON.stringify(g.visible().map(c => c.key)) === JSON.stringify(['__src', 'Document No.', '__active', 'Stage']),
  g.visible().map(c => c.key).join(','));
ok('grid: hidden count follows the restored view', g.hiddenCount() === 25, `hidden=${g.hiddenCount()}`);

// ---------- I-95: width clamping ----------
clean();
g = makeGrid('detail', detailCols);
g.setWidth('Stage', 5, false);
ok('grid: width is clamped to the 60 px minimum', g.widthOf('Stage') === 60, `${g.widthOf('Stage')}px`);
g.setWidth('Stage', 5000, false);
ok('grid: width is clamped to the 640 px maximum', g.widthOf('Stage') === 640, `${g.widthOf('Stage')}px`);

// ---------- I-95: issue-list grid ----------
clean();
const issueCols = [
  { key: 'severity', label: 'Severity', sortable: true, type: 'enum' },
  { key: 'code', label: 'Rule', sortable: true, type: 'text' },
  { key: 'docNo', label: 'Doc No', sortable: true, type: 'text' },
  { key: 'field', label: 'Field', sortable: true, type: 'text' },
  { key: 'value', label: 'Value', sortable: true, type: 'text' },
  { key: 'message', label: 'Message', sortable: true, type: 'text' },
  { key: 'sourceTab', label: 'Source Tab', sortable: true, type: 'text' },
  { key: 'rownum', label: 'Row', sortable: true, type: 'num' }
];
const gi = makeGrid('issue', issueCols);
ok('grid: the issue list shows all eight columns and pins Severity + Doc No',
  gi.hiddenCount() === 0 && gi.visible()[0].key === 'severity' && gi.visible()[1].key === 'docNo',
  gi.visible().map(c => c.key).join(','));

// ---------- I-96: windowed rendering ----------
clean();
ok('windowing threshold is 500 rows (D39)', ctx.__wt === 500, String(ctx.__wt));

// a scroller jsdom can measure: clientHeight / scrollTop are defined on the element
const mkScroller = (rows, h) => {
  const sc = D.createElement('div'); sc.className = 'tableScroll';
  const t = D.createElement('table'); t.className = 'ds-table';
  const tb = D.createElement('tbody');
  tb.innerHTML = rows.map(() => '<tr><td>x</td></tr>').join('');
  t.appendChild(tb); sc.appendChild(t); D.body.appendChild(sc);
  Object.defineProperty(sc, 'clientHeight', { value: h, configurable: true });
  Object.defineProperty(sc, 'scrollTop', { value: 0, configurable: true, writable: true });
  return { sc, tb };
};
const rowsOf = n => Array.from({ length: n }, (_, i) => ({ i }));

let small = mkScroller(rowsOf(400), 340);
let w = makeWindow(small.sc, { rowHeight: 40, overscan: 8, total: () => 400, render: (s, e) => 'FULL', full: () => 'FULL' });
ok('windowing stays OFF at or below the threshold', w.enabled === false);

let big = mkScroller(rowsOf(600), 340);
let painted = '';
w = makeWindow(big.sc, {
  rowHeight: 40, overscan: 8, total: () => 600,
  render: (s, e) => { painted = `${s}:${e}`; return `<tr><td>${s}-${e}</td></tr>`; },
  full: () => '<tr><td>FULL</td></tr>'
});
ok('windowing engages above the threshold', w.enabled === true);
ok('windowing draws the visible window plus overscan only',
  painted === '0:17', painted);           // floor(0/40)-8=0 … ceil((0+340)/40)+8=17
ok('windowing keeps the scroll height with spacer rows',
  big.tb.querySelectorAll('tr.win-pad').length === 2
  && big.tb.querySelectorAll('tr.win-pad td')[0].style.height === '0px'
  && big.tb.querySelectorAll('tr.win-pad td')[1].style.height === `${(600 - 17) * 40}px`,
  [...big.tb.querySelectorAll('tr.win-pad td')].map(td => td.style.height).join(' / '));
ok('windowing reports the full body as a STRING (regression: full() must return HTML)',
  (() => { const f = makeWindow(big.sc, { rowHeight: 40, overscan: 8, total: () => 600, render: () => '', full: () => '<tr><td>FULL</td></tr>' });
           return f.enabled === true; })());
ok('windowing: redraw after a sort/filter re-paints the window',
  // scrollTop 4000 / 40 px = row 100 − 8 overscan = 92; (4000+340)/40 = 108.5 → 109 + 8 overscan = 117
  (() => { big.sc.scrollTop = 4000; w.redraw(); return painted === '92:117'; })(), painted);
ok('windowing: an unmeasurable scroller falls back to the full body',
  (() => { Object.defineProperty(big.sc, 'clientHeight', { value: 0, configurable: true });
           w.redraw();
           return big.tb.innerHTML === '<tr><td>FULL</td></tr>'; })());

let pass = 0;
for (const c of checks) { console.log((c.pass ? 'PASS' : 'FAIL') + ' - ' + c.name + (c.extra ? '  [' + c.extra + ']' : '')); if (c.pass) pass++; }
console.log(`\n${pass}/${checks.length} checks passed`);
process.exit(pass === checks.length ? 0 : 1);
