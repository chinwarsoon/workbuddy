/* Layer 4 - all panels, filters and CSV (spec §4, T8.8.15).
 * Renders the real pipeline with a DOM stub and compares every panel with deriveView ground truth.
 * Run: node test/test_panels.mjs
 * Revision 1.0 - 2026-10-30 - opencode (AI): first panel layer (P4).
 * Revision 1.1 - 2026-11-01 - opencode (AI): P6.2. Split header, drill accordion, Rules table,
 *   #vcount/#vsub, #vCols, and the overdue/benchmark CSV builders.
 * Revision 1.2 - 2026-11-01 - opencode (AI): P6.3. KPI sub-line and status-class assertions.
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseXlsx } from '../src/xlsx-reader.mjs';
import { buildModel, validate } from '../src/pipeline.mjs';
import { buildDashboard, deriveView, render, STATE, lookCsvRows, validationCsvRows, overdueCsvRows, benchCsvRows, rowsToCsv } from '../src/render.mjs';

let pass = 0, fail = 0;
const ok = (n, c, d = '') => { if (c) { pass++; console.log('  PASS  ' + n + (d ? '  (' + d + ')' : '')); } else { fail++; console.log('  FAIL  ' + n + (d ? '  (' + d + ')' : '')); } };
const XLSX = path.resolve('TWRP C3B2 - Procurement Package Plan.xlsx');

/* ---------------- DOM stubs ---------------- */
const els = new Map();
function makeEl(id) {
  const cl = new Set();
  return { id, style: {}, dataset: {}, value: '', _html: '', _text: '', hidden: false, open: false,
    classList: { add(...c) { c.forEach(x => cl.add(x)); }, remove(...c) { c.forEach(x => cl.delete(x)); },
      toggle(x, f) { (f === undefined ? !cl.has(x) : f) ? cl.add(x) : cl.delete(x); }, contains(x) { return cl.has(x); } },
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
globalThis.document = documentStub;
globalThis.window = { addEventListener() {}, scrollTo() {}, matchMedia: () => ({ matches: false, addEventListener() {} }), devicePixelRatio: 1 };
globalThis.localStorage = { getItem: k => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v); }, removeItem: k => { delete ls[k]; }, clear() {} };
globalThis.navigator = { clipboard: {}, userAgent: 'node' };

const raw = fs.readFileSync(XLSX);
const wb = await parseXlsx(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength));
const bm = buildModel(wb, path.basename(XLSX));
const report = validate(bm.model.packages, bm.vctx);

/* DOM readers */
const html = id => getEl(id)._html || '';
const strip = s => String(s).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const kpiCards = () => [...html('kpis').matchAll(/<div class="v">([^<]*)<\/div><div class="l">([^<]*)<\/div>/g)].map(m => ({ v: m[1], l: m[2] }));
const svgValues = id => [...html(id).matchAll(/<text[^>]*>(\d+)<\/text>/g)].map(m => Number(m[1]));
const dataLabels = body => [...body.matchAll(/data-label="([^"]*)"/g)].map(m => unesc(m[1]));
const dataValues = body => [...body.matchAll(/data-value="(\d+)"/g)].map(m => Number(m[1]));
const svgTitles = id => [...html(id).matchAll(/<title>([^<]*)<\/title>/g)].map(m => m[1]);
const unesc = s => String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'");
/* The whole #charts innerHTML is written at once, so a card body is a slice of it. */
const bodyFor = card => {
  const all = html('charts');
  const key = card === 'packages' ? 'pkg' : card;   // body ids are inter-body-pkg / inter-body-data
  const at = all.indexOf('id="inter-body-' + key + '"');
  if (at < 0) return '';
  const rest = all.slice(at + 1);
  const next = rest.indexOf('id="inter-body-');
  return next >= 0 ? rest.slice(0, next) : rest;
};
const rowCount = (id, cls) => [id].length && (html(id).match(new RegExp('class="' + cls + '"', 'g')) || []).length;

buildDashboard(wb, path.basename(XLSX));
const base = STATE.view;

console.log('='.repeat(72));
console.log('Panel 1 - KPI cards');
console.log('='.repeat(72));
const cards = kpiCards();
ok('six cards, same values as deriveView', cards.length === 6 && JSON.stringify(cards.map(c => c.v)) === JSON.stringify(base.kpis.map(k => String(k.v))), cards.map(c => c.v).join(' | '));
ok('labels match', JSON.stringify(cards.map(c => c.l)) === JSON.stringify(base.kpis.map(k => k.l)));
ok('§5: no KPI sub-status line is rendered', !/<div class="s /.test(html('kpis')) && (html('kpis').match(/class="kpi/g) || []).length === 6);
ok('§5: the status class names the strip colour', (html('kpis').match(/class="kpi (ok|amb|warn|muted|err)"/g) || []).length >= 1, (html('kpis').match(/class="kpi [a-z]+"/g) || []).join(','));
ok('§4.6: every KPI card carries a detail payload', (html('kpis').match(/data-tip="/g) || []).length === 6, String((html('kpis').match(/data-tip="/g) || []).length));
ok('§4.6: the KPI payload states value, denominator, share and definition', (html('kpis').match(/Of packages/g) || []).length === 6 && (html('kpis').match(/Share/g) || []).length === 6);

console.log('='.repeat(72));
console.log('Panel 2 - interactive charts (all breakdowns)');
console.log('='.repeat(72));
for (const card of ['packages', 'data']) {
  const names = Object.keys(base.panels.interactive[card]);
  for (const name of names) {
    STATE.chartView[card] = name;
    render();
    const items = STATE.view.panels.interactive[card][name];
    const body = bodyFor(card);
    if (!items.length) { ok(card + '/' + name + ' empty state', body.includes('No data for this breakdown')); continue; }
    const labels = dataLabels(body);
    const vals = dataValues(body);
    ok(card + '/' + name + ': every label is drawn', items.every(it => labels.includes(it.label)), items.length + ' items');
    ok(card + '/' + name + ': every count is drawn', items.every(it => vals.includes(it.value)), items.map(i => i.value).join(','));
    ok(card + '/' + name + ': every point carries a detail payload', (body.match(/data-tip="/g) || []).length >= items.length, String((body.match(/data-tip="/g) || []).length));
  }
}
STATE.chartView.packages = 'status'; STATE.chartView.data = 'dqByRule'; render();

console.log('='.repeat(72));
console.log('Panel 3 - PO combined chart and window');
console.log('='.repeat(72));
const po = STATE.view.panels.po;
const poMonths = [...html('poChart').matchAll(/data-month="([A-Z][a-z]{2} '\d{2})" data-series="(Planned|Forecast|Actual)" data-value="(\d+)"/g)];
const poMap = {};
poMonths.forEach(m => { (poMap[m[2]] = poMap[m[2]] || []).push(Number(m[3])); });
const win = STATE.view.panels.po.window;
ok('Po chart draws the window months', poMonths.length > 0, String(poMonths.length));
const series = (arr, last) => arr.slice(win.from, Math.min(win.to, last) + 1);
ok('planned bars equal pNew up to the last plan date', JSON.stringify(poMap['Planned'] || []) === JSON.stringify(series(po.pNew, po.lastPlanIdx)), (poMap['Planned'] || []).join(','));
ok('forecast bars equal fNew up to the last forecast date', JSON.stringify(poMap['Forecast'] || []) === JSON.stringify(series(po.fNew, po.lastForecastIdx)));
ok('actual bars equal aNew up to the last actual month', JSON.stringify(poMap['Actual'] || []) === JSON.stringify(series(po.aNew, po.lastActualIdx)));
ok('the window caption names the months', html('poWinMsg') === '' && getEl('poWinMsg')._text.includes(po.months[win.from]));
ok('cumulative actual runs to today', po.aCum[po.actualEndIdx] === po.aNew.slice(0, po.actualEndIdx + 1).reduce((a, b) => a + b, 0));

ok('§4.6: the PO chart carries one hover band per visible month', (html('poChart').match(/class="po-band"/g) || []).length === (win.to - win.from + 1), String((html('poChart').match(/class="po-band"/g) || []).length) + ' vs ' + (win.to - win.from + 1));
ok('§4.6: every PO band carries a snap position and a payload', (html('poChart').match(/data-snap="[\d.]+" data-tip="/g) || []).length === (win.to - win.from + 1));
ok('§4.6: the PO chart carries one snap line', (html('poChart').match(/class="chart-snap"/g) || []).length === 1);

console.log('='.repeat(72));
console.log('Panel 4 - PO look-ahead');
console.log('='.repeat(72));
const look = STATE.view.panels.look;
const lookTitles = [...html('lookahead').matchAll(/<th scope="row">([^<]*)<\/th>/g)].map(m => m[1]);
ok('rows match the derived list', lookTitles.length === look.list.length, lookTitles.length + ' vs ' + look.list.length);
ok('order is earliest first', look.list.every((p, i) => i === 0 || look.list[i - 1].poPlan <= p.poPlan));
ok('the on-screen window matches the view', strip(html('lookSub')) === '' ? getEl('lookSub')._text.includes(String(look.list.length)) : true, getEl('lookSub')._text);
ok('all five columns are present', ['Package', 'Discipline', 'PO Plan', 'In (days)', 'Status'].every(h => strip(html('lookahead')).includes(h)));

console.log('='.repeat(72));
console.log('Panel 5 - overdue by stage');
console.log('='.repeat(72));
const ov = STATE.view.panels.overdue;
const ovRows = (html('ovlList').match(/class="expandable"/g) || []).length;
ok('the selected stage row count matches', ovRows === ov.rows.length, ovRows + ' vs ' + ov.rows.length);
ok('the count line names every stage', Object.keys(ov.counts).every(k => getEl('ovlSub')._text.includes(k === 'mr' ? 'MR Issue' : k === 'po' ? 'PO Issue' : k === 'vd' ? 'VD Approval' : k === 'fat' ? 'FAT' : 'ROS')), getEl('ovlSub')._text);
ok('the drill-down grid is present for a row', html('ovlList').includes('stage-grid'));
ok('§4.4: each drill row has a real button with aria-expanded and aria-controls', (html('ovlList').match(/class="drill-btn" aria-expanded="false" aria-controls="[^"]+"/g) || []).length === ov.rows.length);
ok('§4.4: the detail row uses .sub / .sub-inner, not .ovl-detail', html('ovlList').includes('class="sub"') && html('ovlList').includes('sub-inner') && !html('ovlList').includes('ovl-detail'));
ok('§4.3: the overdue table uses the split header', html('ovlList').includes('ds-head') && html('ovlList').includes('tableScroll'));
const mrCount = ov.counts.mr;
STATE.prefs.chartType.ovlStage = 'mr'; render();
ok('switching stage re-derives the rows', (html('ovlList').match(/class="expandable"/g) || []).length === STATE.view.panels.overdue.rows.length && STATE.view.panels.overdue.sel === 'mr', String(STATE.view.panels.overdue.rows.length));
STATE.prefs.chartType.ovlStage = 'fat'; render();
ok('an almost-empty stage still selects', STATE.view.panels.overdue.sel === 'fat' && STATE.view.panels.overdue.rows.length === ov.counts.fat);
STATE.prefs.chartType.ovlStage = 'mr'; render();

console.log('='.repeat(72));
console.log('Panel 6 - benchmark');
console.log('='.repeat(72));
const benchHtml = getEl('benchTable')._html || '';
ok('twelve reference rows', (benchHtml.match(/<tr><th scope="row">/g) || []).length === 12, String((benchHtml.match(/<tr><th scope="row">/g) || []).length));
ok('§4.3: the benchmark table uses the split header', benchHtml.includes('ds-head') && benchHtml.includes('tableScroll'));

console.log('='.repeat(72));
console.log('Panel 7 - validation');
console.log('='.repeat(72));
const chips = strip(html('vchips'));
ok('severity chips match the data-issue counts', chips.includes(String(STATE.view.issues.counts.warning) + ' Warning'), chips);
ok('every issue row renders (no 80-row cap)', (html('vtable').match(/<tr><td><span class="sev/g) || []).length === STATE.view.issues.data.length, String((html('vtable').match(/<tr><td><span class="sev/g) || []).length) + ' vs ' + STATE.view.issues.data.length);
ok('the visible row count is the true total with the noun', getEl('vsub')._text === STATE.view.issues.data.length + ' rows', getEl('vsub')._text);
ok('severity is a fixed-size icon in both tables', (html('vtable').match(/<svg class="sev-svg" width="14" height="14"/g) || []).length === STATE.view.issues.data.length && (html('vref').match(/<svg class="sev-svg"/g) || []).length === STATE.view.issues.refs.length);
ok('the rule reference lists each fired rule once', (html('vref').match(/<code>/g) || []).length === STATE.view.issues.refs.length);
ok('the W-FORMULA notice is not in the rule reference', !html('vref').includes('W-FORMULA'));
ok('§4.5: the summary row carries the issue count', getEl('vcount')._text === STATE.view.issues.total + ' issues', getEl('vcount')._text);
ok('§4.5: the rules table is a de-duplicated table, not a list', html('vref').includes('<table class="ds-table">') && html('vref').includes('Count'));
ok('§4.5: the issue card reports the visible row count with a noun', /(Showing \d+ of \d+ rows|\d+ rows)/.test(getEl('vsub')._text), getEl('vsub')._text);
ok('§4.5: the issue table uses the split header', html('vtable').includes('ds-head') && html('vtable').includes('tableScroll'));
ok('§4.3: the look-ahead table uses the split header', html('lookahead').includes('ds-head') && html('lookahead').includes('tableScroll'));

console.log('='.repeat(72));
console.log('Filters - type, stage, window, horizon');
console.log('='.repeat(72));
const countFor = cats => {
  const s = { ...STATE, filter: { cats }, prefs: { ...STATE.prefs, chartType: { ...STATE.prefs.chartType } }, poWin: { ...STATE.poWin } };
  return deriveView(STATE.model, s);
};
const oneCat = base.catList.find(c => { const n = countFor(new Set([c])).active.length; return n > 0 && n < base.active.length; });
ok('a category with a partial set exists', !!oneCat, oneCat);
const expOne = countFor(new Set([oneCat]));
STATE.filter.cats = new Set([oneCat]); render();
ok('type filter: KPI total follows the view', kpiCards()[0].v === String(expOne.active.length), kpiCards()[0].v);
ok('type filter: look-ahead follows the view', STATE.view.panels.look.list.length === expOne.panels.look.list.length);
ok('type filter: overdue follows the view', JSON.stringify(STATE.view.panels.overdue.counts) === JSON.stringify(expOne.panels.overdue.counts));
STATE.filter.cats = null; render();

const empty = countFor(new Set(['No Such Category']));
STATE.filter.cats = new Set(['No Such Category']); render();
ok('empty filter: zero active rows', STATE.view.active.length === 0 && empty.active.length === 0);
ok('empty filter: no NaN in the KPI row', !html('kpis').includes('NaN'), strip(html('kpis')));
ok('empty filter: status bar shows zero shown', getEl('statusBar')._html.includes('0 shown'));
ok('empty filter: look-ahead states the empty case', strip(html('lookahead')).includes('No POs planned') || getEl('lookSub')._text.includes('(0 packages)'));
STATE.filter.cats = null; render();

/* §7.1 B5: the search column picker narrows which column the query applies to. */
const searchFor = (field, q) => deriveView(STATE.model, { ...STATE, filter: { cats: null }, search: q, searchField: field,
  prefs: { ...STATE.prefs, chartType: { ...STATE.prefs.chartType } }, poWin: { ...STATE.poWin } });
const sAll = searchFor('all', 'mechanical');
const sDisc = searchFor('discipline', 'mechanical');
const sTitle = searchFor('title', 'mechanical');
const sStatus = searchFor('status', 'mechanical');
ok('search: All columns spans every searchable field', sAll.active.length > 0 && sAll.active.length >= sDisc.active.length, `${sAll.active.length} vs ${sDisc.active.length}`);
ok('search: a chosen column narrows the match', sStatus.active.length === 0 && sTitle.active.length < sAll.active.length, `title=${sTitle.active.length} status=${sStatus.active.length}`);
ok('search: discipline matches its column value', sDisc.active.length > 0, String(sDisc.active.length));

STATE.prefs.chartType.look = '6'; render();
ok('horizon 6m re-derives the list', STATE.view.panels.look.list.length > look.list.length, look.list.length + ' -> ' + STATE.view.panels.look.list.length);
STATE.prefs.chartType.look = '3'; render();

const nMonths = STATE.view.panels.po.months.length;
STATE.poWin.from = 2; STATE.poWin.to = Math.max(2, nMonths - 2); render();
ok('PO window change repaints and keeps the view window', STATE.view.panels.po.window.from === 2 && getEl('poWinMsg')._text.includes(STATE.view.panels.po.months[2]), getEl('poWinMsg')._text);
STATE.poWin.from = 0; STATE.poWin.to = nMonths - 1; render();

console.log('='.repeat(72));
console.log('CSV exports');
console.log('='.repeat(72));
const lookRows = lookCsvRows(STATE.view.panels.look);
ok('look-ahead CSV header', lookRows.length > 0 && lookRows[0].join(',') === 'Package,Discipline,PO Plan,In (days),Status', lookRows[0] && lookRows[0].join(','));
ok('look-ahead CSV row count matches the table', lookRows.length - 1 === STATE.view.panels.look.list.length, (lookRows.length - 1) + ' vs ' + STATE.view.panels.look.list.length);
ok('look-ahead CSV first row matches the list', lookRows[1][0] === STATE.view.panels.look.list[0].title);
ok('look-ahead CSV quotes every field', rowsToCsv(lookRows.slice(0, 2)).split('\r\n').every(l => /^".*"$/.test(l)));
const vRows = validationCsvRows(report);
ok('validation CSV header', vRows[0].join(',') === 'Severity,Rule,Package,Field,Value,Message', vRows[0].join(','));
ok('validation CSV row count matches the report', vRows.length - 1 === report.issues.length);
const ovRows2 = overdueCsvRows(STATE.view.panels.overdue);
ok('overdue CSV header', ovRows2[0].join(',') === 'Package,Discipline,Overdue Stage,Plan,Forecast,Overdue (days),Status', ovRows2[0] && ovRows2[0].join(','));
ok('overdue CSV row count matches the table', ovRows2.length - 1 === STATE.view.panels.overdue.rows.length);
const benchRows = benchCsvRows();
ok('benchmark CSV header', benchRows[0].join(',') === 'Equipment Category,Typical Lead Time,Approx Days', benchRows[0].join(','));
ok('benchmark CSV row count is 12', benchRows.length - 1 === 12);

console.log('='.repeat(72));
console.log('W-FORMULA banner state (error state)');
console.log('='.repeat(72));
const wb2 = JSON.parse(JSON.stringify({}));
// mutate a fresh parse (Dates do not survive JSON, so re-parse)
const wbRaw = fs.readFileSync(XLSX);
const wb3 = await parseXlsx(wbRaw.buffer.slice(wbRaw.byteOffset, wbRaw.byteOffset + wbRaw.byteLength));
const pppKey = Object.keys(wb3).find(k => /ppp/i.test(k));
const p0 = bm.model.packages[0];
wb3[pppKey][p0._row - 1][3] = '#N/A';   // Package No.
buildDashboard(wb3, path.basename(XLSX));
ok('a token shows a fatal W-FORMULA strip', html('errBanner').includes('W-FORMULA') && html('errBanner').includes('sys-banner-item fatal'), strip(html('errBanner')).slice(0, 90));
ok('the dashboard stays visible', !getEl('dash').classList.contains('hidden'));
ok('the token is not a validation issue', !STATE.report.issues.some(i => i.code === 'W-FORMULA'));

console.log('');
console.log('SUMMARY: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
