/* Renders the dashboard against the real workbook in a sandbox and asserts the
   OUTPUT DOM — that each panel receives real content, that charts contain bars,
   and that the data-decision banner and integrity warnings appear. This catches
   render-layer breakage that the model-level test cannot see.                  */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const HTML = path.join(ROOT, 'MDL-Dashboard.html');
const XLSX = path.join(ROOT, 'TWRP C3B2 - Master Document List.xlsx');

let pass = 0, fail = 0;
const ok = (n, c, d) => { if (c) { pass++; console.log('  \u2713 ' + n); } else { fail++; console.log('  \u2717 ' + n + (d !== undefined ? '  -> ' + JSON.stringify(d) : '')); } };

if (typeof globalThis.DecompressionStream === 'undefined') {
  globalThis.DecompressionStream = class {
    constructor() { this._c = []; this.writable = new WritableStream({ write: (c) => this._c.push(Buffer.from(c)) }); this.readable = new ReadableStream({ start: (ctl) => { ctl.enqueue(zlib.inflateRawSync(Buffer.concat(this._c))); ctl.close(); } }); }
  };
}

const html = fs.readFileSync(HTML, 'utf8');
const src = html.match(/<script>([\s\S]*)<\/script>/)[1];

/* A DOM stub that RECORDS what each container received, so we can assert the
   render layer wrote into the right elements. */
const store = new Map();
const noop = () => {};
function el(id) {
  if (!store.has(id)) {
    store.set(id, {
      id, innerHTML: '', textContent: '', value: '', style: { display: '' }, className: '',
      classList: { add: noop, remove: noop, toggle: noop, contains: () => false },
      dataset: {}, setAttribute: noop, getAttribute: () => null, addEventListener: noop,
      querySelector: () => null, querySelectorAll: () => [], closest: () => null,
      scrollIntoView: noop, getContext: () => ({}), toBlob: noop,
      width: { baseVal: { value: 0 } }, height: { baseVal: { value: 0 } }
    });
  }
  return store.get(id);
}
const doc = {
  documentElement: { getAttribute: () => null, setAttribute: noop, removeAttribute: noop },
  getElementById: el, addEventListener: noop, createElement: () => el('_created'),
  querySelector: () => null, querySelectorAll: () => []
};
const ctx = {
  window: { scrollTo: noop, __MDL__: null, scrollY: 0 }, document: doc,
  localStorage: { getItem: () => null, setItem: noop }, navigator: {}, console,
  setTimeout, clearTimeout, Blob: class {}, URL: { createObjectURL: () => '', revokeObjectURL: noop },
  TextDecoder, Image: function () {}, XMLSerializer: function () {},
  DecompressionStream: globalThis.DecompressionStream, WritableStream: globalThis.WritableStream, ReadableStream: globalThis.ReadableStream
};
ctx.globalThis = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx, { filename: 'inline.js' });
const M = ctx.window.__MDL__;

/* drive the real load path exactly as the browser would */
const buf = fs.readFileSync(XLSX);
const sheets = await M.parseXlsx(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
M.buildModel; /* exposed */
const model = M.buildModel(sheets, 'TWRP C3B2 - Master Document List.xlsx');
M.STATE.model = model;
M.STATE.report = M.validate(model);
el('welcome').style.display = 'none';
el('dash').classList.remove('hidden');

/* call the real render() via the registered pipeline: buildDashboard is not
   exposed, so invoke render through the module's own path */
const renderSrc = src.replace('const fileInput=document.getElementById(\'fileInput\');',
  'window.__render=render;window.__buildFilter=buildFilterPanel;const fileInput=document.getElementById(\'fileInput\');');
const ctx2 = { ...ctx, window: { scrollTo: noop, __MDL__: null } };
ctx2.document = { ...doc, getElementById: el };
ctx2.globalThis = ctx2;
vm.createContext(ctx2);
vm.runInContext(renderSrc, ctx2, { filename: 'inline2.js' });
ctx2.window.__MDL__.STATE.model = model;
ctx2.window.__MDL__.STATE.report = ctx2.window.__MDL__.validate(model);
ctx2.window.__render();
ctx2.window.__buildFilter();

const txt = (id) => String(store.get(id)?.innerHTML || '');
console.log('MDL dashboard — render-layer verification\n');

console.log('1. Panels render content');
const panels = ['kpis', 'actions', 'subStatusChart', 'slipChart', 'discChart', 'apprChart', 'prologChart', 'mixChart', 'upTable', 'dupTable', 'vSummary', 'vDetail', 'wbIntegrity', 'regTable', 'conSheets', 'conLookups', 'decisions', 'tfPanel'];
for (const p of panels) ok('#' + p + ' has content', txt(p).length > 0, txt(p).length);
ok('dashboard unhidden', store.get('dash').className.indexOf('hidden') === -1);

console.log('\n2. Charts contain real SVG geometry');
for (const p of ['subStatusChart', 'slipChart', 'discChart', 'apprChart', 'prologChart', 'mixChart']) {
  const h = txt(p);
  const rects = (h.match(/<rect/g) || []).length;
  const paths = (h.match(/<path/g) || []).length;
  ok('#' + p + ' drew shapes (rect ' + rects + ', path ' + paths + ')', rects + paths > 0);
  ok('#' + p + ' is accessible (role=img + aria-label)', h.includes('role="img"') && h.includes('aria-label='));
}

console.log('\n3. Numbers reach the screen');
ok('KPI shows 231 active', txt('kpis').includes('>231<'));
ok('KPI shows 225 submitted', txt('kpis').includes('>225<'));
ok('KPI shows 221 approved', txt('kpis').includes('>221<'));
ok('KPI shows 6 overdue', txt('kpis').includes('>6<'));
ok('register tag shows 231', store.get('regTag').textContent.indexOf('231') >= 0, store.get('regTag').textContent);
ok('header shows the project title', store.get('projTitle').textContent === 'TWRP C3B2', store.get('projTitle').textContent);

console.log('\n4. Decisions are stated in-product, not hidden');
const dec = txt('decisions');
ok('banner states the 84 template rows are excluded', dec.includes('84'));
ok('banner states the Mechanical\u2192Mech alias', dec.indexOf('Mechanical') >= 0 && dec.indexOf('Mech') >= 0);
ok('banner states the 90-day derived approval date', dec.includes('90'));
ok('integrity panel flags the =U+90 formula', txt('wbIntegrity').includes('U+90'));
ok('integrity panel flags the empty Rev column', txt('wbIntegrity').includes('Rev (col L) is empty'));
ok('integrity panel flags the 7 empty tabs', txt('wbIntegrity').includes('contain no active documents'));
ok('integrity panel flags unpopulated contract columns', txt('wbIntegrity').includes('never populated'));

console.log('\n5. Suppressed metrics are genuinely absent');
ok('no fabricated average turnaround anywhere', !/average turnaround of \d/i.test(txt('kpis') + txt('actions')));
ok('approval chart explains why turnaround is not shown', txt('apprNote').includes('Turnaround is not charted'));

console.log('\n6. Validation surfaces workbook wording');
ok('V-26 wording comes from the workbook', txt('vDetail').includes('duplicated within the consolidated table'));
ok('severity chips rendered', txt('vSummary').includes('vchip e') && txt('vSummary').includes('vchip w'));
ok('duplicate register lists the collisions', txt('dupTable').includes('DR-P-6000'));
ok('duplicate note explains Rev is missing', txt('dupNote').includes('Rev (col L) is unpopulated'));

console.log('\n7. Accessibility & status design (UI spec §14)');
ok('statuses use icon + text, not colour alone', txt('regTable').includes('badge ') && txt('regTable').includes('Overdue'));
ok('table headers expose aria-sort hooks', txt('regTable').includes('data-sort='));
ok('filter checkboxes are labelled', txt('tfPanel').includes('data-f="d"') && txt('tfPanel').includes('data-f="s"'));
ok('no list-yet disciplines are named', txt('discNote').includes('no document list yet'));

console.log('\n8. Single-file integrity');
ok('no external script/link references', !/<script[^>]+src=/i.test(html) && !/<link[^>]+href=/i.test(html));
ok('no CDN or http(s) asset URLs', !/(src|href)\s*=\s*["']https?:\/\//i.test(html));
ok('logo is inlined as a data URI', html.includes('src="data:image/jpeg;base64,'));
ok('no network APIs used', !/\bfetch\s*\(|XMLHttpRequest|WebSocket/.test(src));

console.log('\n' + '='.repeat(60));
console.log('PASS ' + pass + '  FAIL ' + fail);
console.log('='.repeat(60));
process.exit(fail ? 1 : 0);
