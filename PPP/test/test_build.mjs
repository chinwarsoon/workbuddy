/* Layer 3 - built-artifact test (spec §3.9/§3.8.5, T8.8.14).
 * 1. Static checks on Procurement-Dashboard.html: one inline script, no local or external
 *    reference, no import, no fetch, and the script parses.
 * 2. Render the BUILT script in a Node vm with a DOM stub and compare its KPI cards with the
 *    ground truth from deriveView (src import).
 * 3. Open the file from file:// in Chromium when playwright is available, load the workbook and
 *    compare the rendered KPI values with the same ground truth.
 * Run: node test/test_build.mjs
 * Revision 1.0 - 2026-10-30 - opencode (AI): first build layer (P4).
 * Revision 1.1 - 2026-11-01 - opencode (AI): P6.3. Asserts the 72 px two-line KPI card and the canonical .btn-secondary CSV actions.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseXlsx } from '../src/xlsx-reader.mjs';
import { buildModel, validate } from '../src/pipeline.mjs';
import { deriveView } from '../src/render.mjs';

let pass = 0, fail = 0, skip = 0;
const ok = (n, c, d = '') => { if (c) { pass++; console.log('  PASS  ' + n + (d ? '  (' + d + ')' : '')); } else { fail++; console.log('  FAIL  ' + n + (d ? '  (' + d + ')' : '')); } };
const info = m => console.log('  INFO  ' + m);

const HTML = path.resolve('Procurement-Dashboard.html');
const XLSX = path.resolve('TWRP C3B2 - Procurement Package Plan.xlsx');
const html = fs.readFileSync(HTML, 'utf8');
const scriptBlocks = [...html.matchAll(/<script\b[^>]*>/gi)];
const scriptCode = (html.match(/<script>([\s\S]*)<\/script>/) || [])[1] || '';

console.log('='.repeat(72));
console.log('A. artifact shape (spec §3.9)');
console.log('='.repeat(72));
ok('the file exists and is not empty', html.length > 100000, html.length + ' bytes');
ok('exactly one script block', scriptBlocks.length === 1 && (html.match(/<\/script>/g) || []).length === 1, String(scriptBlocks.length));
ok('the script is inline (no src)', !/<script[^>]*\ssrc\s*=/i.test(html));
ok('no ES import statement in the script', !/^\s*import\s/m.test(scriptCode) && !/\bfrom\s+['"]\.{1,2}\//.test(scriptCode));
ok('no dynamic import or fetch', !/\bimport\s*\(/.test(scriptCode) && !/\bfetch\s*\(/.test(scriptCode) && !/XMLHttpRequest/.test(scriptCode));
const localHref = [...html.matchAll(/\b(?:href|src)\s*=\s*["']([^"']+)["']/gi)].map(m => m[1])
  .filter(v => !/^(#|data:|https?:|mailto:)/i.test(v));
ok('no local href/src reference', localHref.length === 0, localHref.join(', ') || 'none');
const https = [...html.matchAll(/https?:\/\/[^\s"'<>]+/gi)].map(m => m[0]);
const nonSvg = https.filter(u => !/^http:\/\/www\.w3\.org\/2000\/svg$/.test(u));
ok('no external http(s) reference except the SVG namespace', nonSvg.length === 0, nonSvg.join(', ') || 'none');
ok('no CDN font or stylesheet', !/fonts\.(googleapis|gstatic)|cdnjs|unpkg|jsdelivr/i.test(html));
ok('no module script tag', !/<script[^>]*type\s*=\s*["']module/i.test(html));
try { new vm.Script(scriptCode, { filename: 'built.js' }); ok('the built script parses', true); }
catch (e) { ok('the built script parses', false, e.message); }

console.log('='.repeat(72));
console.log('B. built artifact renders the same KPI values as the source pipeline');
console.log('='.repeat(72));
const raw = fs.readFileSync(XLSX);
const buf = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
const wb = await parseXlsx(buf);
const bm = buildModel(wb, path.basename(XLSX));
const report = validate(bm.model.packages, bm.vctx);
const state = { report, filter: { cats: null }, chartView: { packages: 'status', data: 'dqByRule' },
  prefs: { chartType: {}, poBars: true }, poWin: { from: 0, to: 0, _n: 0 }, ui: { typeFilterBound: false } };
const gt = deriveView(bm.model, state);

const els = new Map();
function makeEl(id) {
  const cl = new Set();
  return { id, style: {}, dataset: {}, value: '', _html: '', _text: '', hidden: false,
    classList: { add() {}, remove() {}, toggle() {}, contains() { return false; } },
    addEventListener() {}, removeEventListener() {}, appendChild(n) { return n; }, removeChild() {},
    insertBefore() {}, setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    querySelector() { return null; }, querySelectorAll() { return []; }, closest() { return null; },
    click() {}, focus() {}, remove() {}, getBoundingClientRect() { return { width: 1, height: 1, top: 0, left: 0 }; },
    get innerHTML() { return this._html; }, set innerHTML(v) { this._html = String(v); },
    get textContent() { return this._text; }, set textContent(v) { this._text = String(v); } };
}
const getEl = id => { if (!els.has(id)) els.set(id, makeEl(id)); return els.get(id); };
const documentStub = { getElementById: getEl, createElement: t => makeEl(t), querySelector: s => getEl('sel:' + s),
  querySelectorAll: () => [], addEventListener() {}, body: makeEl('body'), documentElement: makeEl('html'),
  head: makeEl('head'), readyState: 'complete', title: 'test' };
const ls = {};
const sandbox = { document: documentStub,
  window: { addEventListener() {}, scrollTo() {}, matchMedia: () => ({ matches: false, addEventListener() {} }), devicePixelRatio: 1 },
  localStorage: { getItem: k => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: k => { delete ls[k]; } },
  navigator: { clipboard: {}, userAgent: 'node' }, setTimeout, clearTimeout, setInterval, clearInterval,
  console, TextDecoder, TextEncoder, Blob, URL: Object.assign(Object.create(URL), { createObjectURL: () => 'blob:x', revokeObjectURL() {} }),
  DecompressionStream, atob, btoa, crypto, location: { href: 'file:///built.html' } };
sandbox.self = sandbox; sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const closeIdx = scriptCode.lastIndexOf('})();');
const hooked = scriptCode.slice(0, closeIdx) + 'globalThis.__H={buildDashboard,STATE};' + scriptCode.slice(closeIdx);
try {
  vm.runInContext(hooked, sandbox, { filename: 'built.js' });
  sandbox.__H.buildDashboard(wb, path.basename(XLSX));
  const kpiHtml = getEl('kpis')._html;
  const values = [...kpiHtml.matchAll(/<div class="v">([^<]*)<\/div>/g)].map(m => m[1]);
  ok('the built page renders six KPI cards', values.length === 6, values.join(' | '));
  ok('built KPI values equal deriveView', JSON.stringify(values) === JSON.stringify(gt.kpis.map(k => String(k.v))),
    values.join(' | ') + '  vs  ' + gt.kpis.map(k => k.v).join(' | '));
  ok('the built status bar is written', getEl('statusBar')._html.includes('129 packages'));
  ok('the built validation panel reports the same warning count', getEl('vchips')._html.includes(String(gt.issues.counts.warning)));
  ok('the built page keeps #dash visible after load', !getEl('dash').classList.contains('hidden'));
} catch (e) {
  ok('the built script runs', false, (e.stack || e.message).split('\n').slice(0, 3).join(' | '));
}

console.log('='.repeat(72));
console.log('C. file:// browser check (Chromium)');
console.log('='.repeat(72));
const pwEntry = path.resolve('..', 'harness-layout', 'node_modules', 'playwright', 'index.mjs');
let chromium = null;
try { if (fs.existsSync(pwEntry)) chromium = (await import(pathToFileURL(pwEntry).href)).chromium; }
catch (e) { info('playwright import failed: ' + e.message); }
if (!chromium) {
  skip++;
  info('SKIP: playwright not available - run the harness in harness-layout for the browser tier');
} else {
  const errors = [];
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', e => errors.push('pageerror: ' + e.message));
    await page.goto(pathToFileURL(HTML).href);
    await page.setInputFiles('#fileInput', XLSX);
    await page.waitForSelector('#dash:not([hidden])', { timeout: 60000 });
    await page.waitForTimeout(500);
    const dom = await page.$$eval('#kpis .kpi .v', els => els.map(e => e.textContent.trim()));
    ok('file:// load renders the KPI cards', dom.length === 6, dom.join(' | '));
    ok('file:// KPI values equal deriveView', JSON.stringify(dom) === JSON.stringify(gt.kpis.map(k => String(k.v))), dom.join(' | '));
    ok('file:// load has no console error', errors.length === 0, errors.slice(0, 2).join(' | '));
    ok('file:// status bar is visible', await page.isVisible('#statusBar'));
    /* §5 KPI card: 72 px, exactly two lines, no sub-status line, status strip from a class. */
    const kpi = await page.evaluate(() => {
      const cards = [...document.querySelectorAll('#kpis .kpi')];
      return {
        n: cards.length,
        heights: cards.map(c => c.getBoundingClientRect().height),
        lines: cards.map(c => c.children.length),
        subs: document.querySelectorAll('#kpis .s').length,
        classes: cards.map(c => c.className),
        strip: getComputedStyle(cards[1]).borderTopColor,
        value: getComputedStyle(cards[1].querySelector('.v')).fontSize,
      };
    });
    ok('§5: every KPI card is 72 px high', kpi.heights.every(h => Math.abs(h - 72) < 0.5), kpi.heights.join(','));
    ok('§5: every KPI card has exactly two lines', kpi.lines.every(n => n === 2), kpi.lines.join(','));
    ok('§5: no KPI sub-status line', kpi.subs === 0, String(kpi.subs));
    ok('§5: KPI status class drives the top strip', kpi.classes.some(c => /kpi (ok|amb|warn|muted|err)/.test(c)) && kpi.strip !== 'rgb(30, 136, 229)', kpi.classes.join(' | '));
    /* §7.1 A3: one canonical text-action class; no parallel .csv-btn. */
    const a3 = await page.evaluate(() => ({
      csv: document.querySelectorAll('[data-act="csv"]').length,
      legacy: document.querySelectorAll('.csv-btn').length,
      allSecondary: [...document.querySelectorAll('[data-act="csv"]')].every(b => b.classList.contains('btn-secondary')),
    }));
    ok('§7.1: CSV actions are .btn-secondary with a data-act hook', a3.csv === 4 && a3.allSecondary && a3.legacy === 0, JSON.stringify(a3));
    /* §6 / §8.2 #1: the five themes exist, each remaps the tokens, and text stays readable. */
    const measure = () => page.evaluate(() => {
      const lum = rgb => { const [r, g, b] = rgb.match(/\d+/g).map(Number).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      const card = document.querySelector('#kpis .kpi');
      const v = card.querySelector('.v');
      return { attr: document.documentElement.getAttribute('data-theme'),
        bg: getComputedStyle(document.body).backgroundColor,
        surface: getComputedStyle(card).backgroundColor,
        contrast: Math.round(ratio(getComputedStyle(v).color, getComputedStyle(card).backgroundColor) * 100) / 100 };
    });
    const out = [];
    await page.click('#settingsBtn');
    const opts = await page.locator('[data-theme-opt]').count();
    for (const t of ['light', 'dark', 'sky', 'ocean', 'presentation']) {
      await page.click(`[data-theme-opt="${t}"]`);
      await page.waitForTimeout(60);
      const m = await measure();
      m.theme = t;
      out.push(m);
    }
    await page.evaluate(() => document.querySelectorAll('.help-modal').forEach(m => { m.hidden = true; }));
    const distinctBg = new Set(out.map(t => t.bg)).size;
    ok('§6: five themes are offered in Settings', opts === 5, String(opts));
    ok('§6: each theme sets its own background token', distinctBg === 5, out.map(t => t.theme + '=' + t.bg).join(' | '));
    ok('§6: KPI value text stays readable in every theme (>= 3:1)', out.every(t => t.contrast >= 3), out.map(t => t.theme + '=' + t.contrast).join(' '));
    ok('§6: the chosen theme is persisted', await page.evaluate(() => localStorage.getItem('ppp-chart-theme') === 'presentation'));

    /* §P8: page routing, detail payloads and severity icons. */
    const pages = await page.evaluate(() => {
      const vis = () => [...document.querySelectorAll('#dashBody > [data-page]')]
        .filter(e => getComputedStyle(e).display !== 'none').map(e => e.id);
      const nav = [...document.querySelectorAll('.sb-item[data-page]')].map(b => b.getAttribute('data-page'));
      const out = { nav, initial: vis() };
      out.tabindex = [...document.querySelectorAll('#kpis .kpi')].every(c => c.getAttribute('tabindex') === '0' && c.hasAttribute('data-tip'));
      out.chartHosts = [...document.querySelectorAll('.chartwrap')].map(w => w.getAttribute('tabindex') === '0' && w.hasAttribute('data-tip-first'));
      out.nativeTitles = (document.querySelectorAll('#charts title, #poChart title').length);
      out.sev = { rows: document.querySelectorAll('#vtable tbody tr').length,
                  icons: document.querySelectorAll('#vtable svg.sev-svg').length,
                  flat: getComputedStyle(document.querySelector('#vtable .sev')).backgroundColor };
      document.querySelector('.sb-item[data-page="schedule"]').click();
      out.schedule = vis();
      document.querySelector('.sb-item[data-page="overdue"]').click();
      out.overdue = vis();
      document.querySelector('.sb-item[data-page="quality"]').click();
      out.quality = vis();
      out.title = document.getElementById('pageName').textContent;
      out.stored = localStorage.getItem('ppp-page');
      document.querySelector('.sb-item[data-page="overview"]').click();
      return out;
    });
    ok('P8: four menu items', JSON.stringify(pages.nav) === JSON.stringify(['overview', 'schedule', 'overdue', 'quality']), pages.nav.join(','));
    ok('P8: the overview page shows only KPI and charts', JSON.stringify(pages.initial) === JSON.stringify(['kpiPanel', 'charts']), pages.initial.join(','));
    ok('P8: the schedule page shows only PO plan and look-ahead', JSON.stringify(pages.schedule) === JSON.stringify(['scPanel', 'lookPanel']), pages.schedule.join(','));
    ok('P8: the overdue page shows only the overdue panel', JSON.stringify(pages.overdue) === JSON.stringify(['ovlPanel']), pages.overdue.join(','));
    ok('P8: the quality page shows benchmark and validation', JSON.stringify(pages.quality) === JSON.stringify(['benchPanel', 'vcard']), pages.quality.join(','));
    ok('P8: the page title follows the page', pages.title === 'Data Quality', pages.title);
    ok('P8: the page is persisted', pages.stored === 'quality', String(pages.stored));

    /* §4 / assertion 19: stacked panels and stacked cards keep a real gap. */
    const gaps = await page.evaluate(() => {
      const vis = () => [...document.querySelectorAll('#dashBody > [data-page]')].filter(e => getComputedStyle(e).display !== 'none');
      const out = {};
      const measure = name => { const els = vis(); out[name] = els.slice(1).map((e, i) => Math.round(e.getBoundingClientRect().top - els[i].getBoundingClientRect().bottom)); };
      document.querySelector('.sb-item[data-page="overview"]').click(); measure('overview');
      document.querySelector('.sb-item[data-page="schedule"]').click(); measure('schedule');
      document.querySelector('.sb-item[data-page="quality"]').click(); measure('quality');
      const cards = [...document.querySelectorAll('#vcard .c-card')];
      out.cards = cards.slice(1).map((e, i) => Math.round(e.getBoundingClientRect().top - cards[i].getBoundingClientRect().bottom));
      document.querySelector('.sb-item[data-page="overview"]').click();
      const chartCards = [...document.querySelectorAll('#charts .c-card')];
      out.chartCards = chartCards.slice(1).map((e, i) => Math.round(e.getBoundingClientRect().left - chartCards[i].getBoundingClientRect().right));
      return out;
    });
    const gapOk = g => g >= 12 && g <= 16;
    ok('§4: stacked panels are separated (never touching)', gaps.overview.every(gapOk) && gaps.schedule.every(gapOk) && gaps.quality.every(gapOk), JSON.stringify(gaps));
    ok('§4: stacked validation cards are separated by 12 px', gaps.cards.length > 0 && gaps.cards.every(g => g >= 12 && g <= 14), JSON.stringify(gaps.cards));
    ok('§4.1: the two chart cards are separated', gaps.chartCards.length > 0 && gaps.chartCards.every(g => g >= 12), JSON.stringify(gaps.chartCards));
    ok('P8: KPI cards are focusable and carry detail', pages.tabindex === true);
    ok('P8: every chart host is focusable and carries detail', pages.chartHosts.length >= 2 && pages.chartHosts.every(Boolean), JSON.stringify(pages.chartHosts));
    ok('P8: native SVG titles are retired', pages.nativeTitles === 0, String(pages.nativeTitles));
    ok('P8: severity icons are fixed-size and flat', pages.sev.rows > 0 && pages.sev.icons === pages.sev.rows && pages.sev.flat === 'rgba(0, 0, 0, 0)', JSON.stringify(pages.sev));

    const navContrast = await page.evaluate(() => {
      const el = document.querySelector('.sb-item.active');
      const lum = rgb => { const [r, g, b] = rgb.match(/\d+/g).map(Number).map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
      return { ratio: Math.round(ratio(getComputedStyle(el).color, getComputedStyle(el).backgroundColor) * 100) / 100,
               bg: getComputedStyle(el).backgroundColor };
    });
    ok('§7.1: the active menu item meets the 3:1 control-contrast floor', navContrast.ratio >= 3, JSON.stringify(navContrast));

    /* P8.1: the PO hover window follows the month, and the snap line tracks it. */
    await page.click('.sb-item[data-page="schedule"]');
    await page.waitForTimeout(250);
    const poHover = await page.evaluate(() => {
      const bands = [...document.querySelectorAll('#poChart rect.po-band')];
      if (bands.length < 3) return { bands: bands.length };
      const tipEl = () => document.querySelector('.chart-tip');
      const snap = () => document.querySelector('#poChart .chart-snap');
      const fire = b => b.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 20, clientY: 20, pointerType: 'mouse' }));
      fire(bands[0]);
      const a = { tip: tipEl().textContent, x: snap().getAttribute('x1'), display: snap().style.display };
      fire(bands[2]);
      const b = { tip: tipEl().textContent, x: snap().getAttribute('x1'), display: snap().style.display };
      return { bands: bands.length, a, b, changed: a.tip !== b.tip, moved: a.x !== b.x, shown: b.display !== 'none' };
    });
    ok('P8.1: every PO month has a hover band', poHover.bands >= 3, String(poHover.bands));
    ok('P8.1: the hover window updates when the pointer moves to another month', poHover.changed === true, poHover.changed ? 'changed' : 'stale');
    ok('P8.1: the snap line is visible and tracks the hovered month', poHover.shown === true && poHover.moved === true, `shown=${poHover.shown} moved=${poHover.moved}`);

    /* §3.5 / assertion 18: the notice area is pinned below the menu bar, not in the scroller. */
    const banner = await page.evaluate(async () => {
      const b = document.getElementById('errBanner');
      b.innerHTML = '<div class="sys-banner-item info">Notice</div>';
      b.style.display = 'block';
      await new Promise(r => requestAnimationFrame(r));
      const outside = !b.closest('#dashBody');
      const mb = document.querySelector('.menubar').getBoundingClientRect().bottom;
      const top0 = b.getBoundingClientRect().top;
      const sc = document.getElementById('dashBody');
      const before = sc.scrollTop;
      sc.scrollTop = 240;
      await new Promise(r => requestAnimationFrame(r));
      const top1 = b.getBoundingClientRect().top;
      const scrolled = sc.scrollTop;
      sc.scrollTop = before;
      b.style.display = 'none'; b.innerHTML = '';
      return { outside, mb: Math.round(mb), top0: Math.round(top0), top1: Math.round(top1), stable: Math.abs(top0 - top1) < 1, scrolled, visible: true };
    });
    ok('§3.5: the notice area is outside the scrolling body', banner.outside === true);
    ok('§3.5: the notice area sits directly below the menu bar', banner.top0 >= banner.mb - 1 && banner.top0 <= banner.mb + 12, `banner=${banner.top0} menu=${banner.mb}`);
    ok('§3.5: scrolling the panels does not move the notice area', banner.stable === true && banner.scrolled > 10, `top ${banner.top0}->${banner.top1} scrolled=${banner.scrolled}`);

    /* §3.4.1: the layout reflows on any viewport width change (another screen, resize, zoom). */
    const readLayout = () => page.evaluate(() => {
      const cb = document.getElementById('dashBody');
      const po = document.getElementById('poChart');
      const svg = po && po.querySelector('svg');
      const split = [...document.querySelectorAll('.splitcard')].find(s => s.offsetHeight);
      const h = split && split.querySelector('table.vheadtab');
      const b = split && split.querySelector('.tableScroll table');
      return {
        doc: document.documentElement.scrollWidth, win: window.innerWidth,
        overflow: cb.scrollWidth - cb.clientWidth,
        poHost: po ? po.clientWidth : null,
        poSvg: svg ? Math.round(svg.getBoundingClientRect().width) : null,
        splitDelta: h && b ? Math.round(h.getBoundingClientRect().width - b.getBoundingClientRect().width) : null,
      };
    });
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.waitForTimeout(350);
    await page.evaluate(() => document.querySelector('.sb-item[data-page="schedule"]').click());
    await page.waitForTimeout(350);
    const at1024 = await readLayout();
    await page.setViewportSize({ width: 800, height: 800 });
    await page.waitForTimeout(350);
    await page.evaluate(() => document.querySelector('.sb-item[data-page="quality"]').click());
    await page.waitForTimeout(350);
    const at800 = await readLayout();
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.waitForTimeout(350);
    await page.evaluate(() => document.querySelector('.sb-item[data-page="overview"]').click());
    ok('§3.4.1: no horizontal page or content scroll at 1024', at1024.doc === at1024.win && at1024.overflow === 0, JSON.stringify(at1024));
    ok('§3.4.1: the PO chart follows its host width at 1024', at1024.poSvg !== null && at1024.poSvg <= at1024.poHost, `${at1024.poSvg} <= ${at1024.poHost}`);
    ok('§3.4.1: the split header matches its body at 1024', Math.abs(at1024.splitDelta) <= 2, String(at1024.splitDelta));
    ok('§3.4.1: no horizontal scroll at 800', at800.doc === at800.win && at800.overflow === 0, JSON.stringify(at800));
    ok('§3.4.1: the validation split header re-syncs at 800', at800.splitDelta !== null && Math.abs(at800.splitDelta) <= 2, String(at800.splitDelta));

    /* §7.1 B1 / A5: the category filter and the search control match the spec. */
    const controls = await page.evaluate(() => {
      const b = document.getElementById('tfBtn'), cs = getComputedStyle(b);
      const badge = document.getElementById('tfCount');
      const panel = document.getElementById('tfPanel');
      const head = panel.querySelector('.tf-head');
      const go = document.getElementById('searchGo'), gs = getComputedStyle(go);
      const pop = document.getElementById('searchPop');
      pop.classList.add('open');
      const goW = Math.round(go.getBoundingClientRect().width);
      const col = document.getElementById('searchCol'), ccs = getComputedStyle(col);
      const rowTops = [...document.querySelector('.search-row').children].map(e => Math.round(e.getBoundingClientRect().top));
      pop.classList.remove('open');
      const cat = panel.querySelector('.tf-cat');
      cat.checked = false; cat.dispatchEvent(new Event('change', { bubbles: true }));
      const picked = {
        badge: badge.textContent, hidden: badge.hidden,
        filtered: b.classList.contains('is-filtered'),
        foot: (document.getElementById('tfFoot') || {}).textContent || '',
      };
      document.getElementById('tfReset').click();
      return {
        size: cs.fontSize, weight: cs.fontWeight, border: cs.borderTopColor, bg: cs.backgroundColor,
        triggerSvgs: b.querySelectorAll('svg').length,
        badgeHidden: badge.hidden,
        panelOrder: [...panel.children].map(e => e.className),
        headOrder: head ? [...head.children].map(e => e.className) : [],
        hasNote: !!(panel.querySelector('.tf-note')), hasDivider: !!(panel.querySelector('.tf-divider')), hasFooter: !!(panel.querySelector('.tf-foot')),
        goW: goW, goBg: gs.backgroundColor, goRadius: gs.borderTopRightRadius,
        rowItems: document.querySelector('.search-row').children.length,
        colOptions: [...col.options].map(o => o.value), colClass: col.className,
        colBorderRight: ccs.borderRightWidth, colRadius: ccs.borderTopLeftRadius, rowTops,
        picked,
      };
    });
    ok('§7.1 B1: the filter trigger is 12 px / 600', controls.size === '12px' && controls.weight === '600', `${controls.size}/${controls.weight}`);
    ok('§7.1 B1: the filter trigger is borderless and transparent in the menu bar', controls.border === 'rgba(0, 0, 0, 0)' && controls.bg === 'rgba(0, 0, 0, 0)', `${controls.border} / ${controls.bg}`);
    ok('§7.1 B1: the filter trigger carries no icon or caret', controls.triggerSvgs === 0, String(controls.triggerSvgs));
    ok('§7.1 B1: the panel order is master + note + divider, then the list, then the footer',
      JSON.stringify(controls.panelOrder) === JSON.stringify(['tf-head', 'tf-list', 'tf-foot']) && controls.hasNote && controls.hasDivider && controls.hasFooter, JSON.stringify(controls.panelOrder));
    ok('§7.1 B1: a selection shows the count badge and the filtered state', controls.picked.hidden === false && controls.picked.badge !== '0' && controls.picked.filtered === true && /selected/.test(controls.picked.foot), JSON.stringify(controls.picked));
    ok('§7.1 A5: the search submit is affixed, accent-filled and right-rounded', controls.goW === 36 && controls.goBg === 'rgb(30, 136, 229)' && controls.goRadius === '6px' && controls.rowItems === 3, JSON.stringify(controls));
    ok('§7.1 B5: the search row carries an attached column picker with All columns first',
      JSON.stringify(controls.colOptions) === JSON.stringify(['all', 'title', 'packageNo', 'discipline', 'itemCategory', 'status']) &&
      controls.colClass.includes('inter-sel') && controls.colClass.includes('is-attached'), JSON.stringify(controls.colOptions));
    ok('§7.1 B5: the attached picker is left-rounded with no right border, on the same row',
      controls.colRadius === '6px' && controls.colBorderRight === '0px' && new Set(controls.rowTops).size === 1, JSON.stringify({ r: controls.colRadius, b: controls.colBorderRight, t: controls.rowTops }));
    const byField = await page.evaluate(async () => {
      const set = (field, q) => {
        const s = document.getElementById('searchCol'); s.value = field; s.dispatchEvent(new Event('change', { bubbles: true }));
        document.getElementById('searchInput').value = q; document.getElementById('searchGo').click();
      };
      const total = () => document.querySelector('#kpis .kpi .v').textContent;
      const wait = () => new Promise(r => setTimeout(r, 250));
      const pop = document.getElementById('searchPop'); pop.classList.add('open');
      set('all', 'mechanical'); await wait(); const all = total();
      set('discipline', 'mechanical'); await wait(); const disc = total();
      set('status', 'mechanical'); await wait(); const status = total();
      set('all', ''); await wait(); pop.classList.remove('open');
      return { all, disc, status };
    });
    ok('§7.1 B5: the picker narrows the query to the chosen column',
      Number(byField.all) > 0 && Number(byField.disc) > 0 && Number(byField.status) === 0 && Number(byField.disc) <= Number(byField.all),
      JSON.stringify(byField));
    await page.click('.sb-item[data-page="overview"]');
  } finally { await browser.close(); }
}

console.log('');
console.log('SUMMARY: ' + pass + ' passed, ' + fail + ' failed' + (skip ? ', ' + skip + ' skipped' : ''));
process.exit(fail ? 1 : 0);
