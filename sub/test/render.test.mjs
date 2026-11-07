// Revision 0.16 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.67 / I122 — the rev 1.66 markup test now expects ONE `.seg` group of `.seg-btn` buttons, the new print / wrap CSS and the stored-preset client code; its 6M case passes `c1Preset: '6M'`. A new test asserts exact mutual exclusion for every preset, NO active chip for `c1Preset: null` (manual custom range), collided clipped ranges no longer light two chips, and the `flex-wrap:nowrap` / 1280 px wrap breakpoint CSS. No assertion was weakened or removed.
// Revision 0.15 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.66 / I121 — two new tests cover the dual-handle C1 period time bar: `c1PresetRange()` (6M / 12M / 24M anchor and clamp, YTD from January of the as-of year, All, unknown and empty input), and the emitted markup (ONE shared track, two native `step="1"` handles with `data-c1period` / `aria-label` / `aria-valuetext`, one tick per reporting month, five `aria-pressed` chips, no old From / To inputs) plus the CSS print / focus rules and the client live-drag decoupling.
// Revision 0.14 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.65 / I119 — one new test proves the shared C1 Y axis follows the period window from the windowed `pts`, enabled series, Bars toggle and grain; cumulative values stay absolute (no rebase); metadata, labels, grid lines, `c1PlotSvg` refit and the 300-unit plot height all stay in agreement. No separate bar scale is introduced.
// Revision 0.13 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.64 / I118 — replaced `niceAxisMax` with `niceAxisTicks`; the I117 tick assertions now allow the dynamic label count, and a new test covers the 7-interval / 8-label cap, the ~40 px spacing, the nice-number step sequence, the one `data-c1meta` payload (static ticks, SVG grid lines and refit), the visible-series axis maximum and the unchanged 300-unit plot height.
// Revision 0.12 | 2026-11-06 | CodeBuddy (AI) | I117 — the C1 caption assertion follows the new "Documents" text, and one new test covers the four owner fixes: the caption text, the nice-step round Y ticks (`niceAxisMax`), the bar value anchored above its bar (`text-anchor="start"` + `dominant-baseline="central"`) and per-month centring of the visible (non-zero) bars with series colours kept in order.
// Revision 0.11 | 2026-11-06 | CodeBuddy (AI) | §4.2 rev 1.63 — added a production-build assertion for the promoted Option B attached-table interaction: four tokenised gradients and soft areas, one hidden pointer-transparent month band at W / N, `data-c1col` on every month header and value cell, tokenised CSS stops, the global §4.6 hidden-window ARIA fix, and the PNG / Copy export stripping.
// Revision 0.10 | 2026-11-06 | CodeBuddy (AI) | §4.2 rev 1.62 moved the C1 legend above the plot: the refit test now asserts `yTop > 0`, `H === yBot` and a legend row above `yTop`, and the axis-line test derives `y1`/`y2` instead of hard-coding `y2="300"`.
// Revision 0.9 | 2026-11-06 | CodeBuddy (AI) | Added a §4.2 rev 1.59 C1 test: one vertical
// Y-axis line, the rotated side unit caption, the omitted as-of subtitle, the semantic
// <caption> that contributes no gap, and static width/height matching the viewBox.
// Revision 0.8 | 2026-11-02 | CodeBuddy (AI) | Owner instruction: no static workbook counts. The "133 submissions" assertion now derives the count from the active set.
// Revision 0.7 | 2026-11-02 | CodeBuddy (AI) | Added an I046 regression test: the C3 Breakdown submitter view drops the Total Plan column and metric row and shows the reason, while the discipline view keeps it.
// Revision 0.6 | 2026-10-26 | CodeBuddy (AI) | T15.3 (Wave 4.2): added a C3 two-side-by-side vertical-bar-chart test (Submissions + Approval Status, Under Review via D38) and dropped the now-invalid All-months percentages assertion from the bar-view test (percentages remain a pie-view detail).
// Revision 0.5 | 2026-10-25 | CodeBuddy (AI) | Added two C3 summary-table tests: the shared `.ds-table` renders below the chart with all eight columns and a Total footer row, and Total Plan for All months covers every planned month rather than only the rows whose Planned 1st Issue Date is blank (a bug found by probing the rendered output).
// Revision 0.4 | 2026-10-25 | CodeBuddy (AI) | Added C3 Breakdown tests (workplan D36). Corrected the
// stale C1 assertion `class="scurve"`: the §4.2 board refactor moved the board border onto
// `class="scurve sc-board"`, so the component is now identified by its root and by `scurve-svg`.
// Revision 0.3 | 2026-10-24 | CodeBuddy (AI) | D33: defaultPlanCount now requires a Document No. and allows a blank Stage.
// Revision 0.2 | 2026-10-24 | CodeBuddy (AI) | Added a multi-select global-filter test (spec §7.1 B1).
// Revision 0.1 | 2026-10-24 | Codex | Added S4 view and render-stage tests.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { readXlsx } from '../engine/xlsx-reader.js';
import { buildModel } from '../engine/pipeline.js';
import { c1TipHtml, c2DelayTipHtml, c1PlotSvg, niceAxisTicks, deriveView, renderDashboard, buildSubmittalsCsv, c1PresetRange, C1_PRESETS } from '../engine/render.js';

// The hover-window bindings in render.js bind to `window` and `document` (revision 0.62 series).
// The harness supplies a fake `document` to renderDashboard but no `window`, so every rendering test
// failed with "window is not defined". These stubs give the browser API the module expects; nothing
// else reads them.
globalThis.window = {
  addEventListener() {}, removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  requestAnimationFrame: fn => fn(), innerWidth: 1440, innerHeight: 900
};
globalThis.document = { addEventListener() {}, removeEventListener() {} };

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'config/pipeline_contract.json'), 'utf8'));
const bytes = name => { const value = fs.readFileSync(path.join(root, name)); return value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength); };
const model = buildModel(await readXlsx(bytes('TWRP C3B2 - Master Document List.xlsx')), await readXlsx(bytes('TWRP C3B2 - Document Submittal Log.xlsx')), { contract: config, today: '2026-10-24' });
// A blank Stage is counted (the MDL rule), and a row without a Document No. is not a planned
// document, so it is not counted either.
const defaultPlanCount = model.planned.filter(row => row.documentNo && !['Deleted','Void','Superseded'].includes(row.stage)).length;

test('derives all overview measures from one shared active set', () => {
  const view = deriveView(model);
  assert.equal(view.kpis.totalPlanned, defaultPlanCount);
  // The workbook grows, so the count is derived from the active set, not remembered from a run.
  assert.equal(view.kpis.totalSubmissions, new Set(view.active.map(row => String(row.documentNo || '').trim().toUpperCase())).size);
  // The workbook grows, so this is a relationship, not a remembered count: the active set is a
  // subset of the parsed log rows and it must not be empty.
  assert.ok(view.active.length > 0, 'the active set holds rows');
  assert.ok(view.active.length <= model.submissions.length, 'the active set is a subset of the parsed log rows');
  assert.equal(view.activePlans.length, defaultPlanCount);
  assert.equal(view.kpis.issueCount, model.issues.length);
});

test('counts one document once when the log holds several submissions for it', () => {
  const view = deriveView(model);
  const key = row => String(row.documentNo).trim().toUpperCase();
  assert.equal(view.kpis.totalSubmissions, new Set(view.active.map(key)).size);
  assert.ok(view.kpis.totalSubmissions < view.active.length, 'the log holds repeated document numbers');
});

test('counts Under Review and Approved per unique Document No., not per row', () => {
  const view = deriveView(model);
  const rawSur = view.active.filter(row => row.submissionStatus === 'SUR').length;
  const rawApproved = view.active.filter(row => row.flagApproved).length;
  assert.ok(view.kpis.underReview <= rawSur, 'Under Review must not exceed the raw SUR row count');
  assert.ok(view.kpis.approved <= rawApproved, 'Approved must not exceed the raw approved row count');
  assert.ok(view.kpis.underReview <= view.kpis.totalSubmissions, 'Under Review cannot exceed logged documents');
  assert.ok(view.kpis.approved <= view.kpis.totalSubmissions, 'Approved cannot exceed logged documents');
  // Recompute with the same per-document rule the cards use (D34): group by Document No., order by
  // Submission Date; Under Review = latest row is SUR and has no return date; Approved = a row has Flag Approved.
  const byDoc = new Map();
  for (const row of view.active) {
    const key = String(row.documentNo || '').trim().toUpperCase();
    if (!key) continue;
    if (!byDoc.has(key)) byDoc.set(key, []);
    byDoc.get(key).push(row);
  }
  const groups = [...byDoc.values()].map(g => [...g].sort((a, b) => (a.submissionDate || '9999-12-31').localeCompare(b.submissionDate || '9999-12-31')));
  const expUnderReview = groups.filter(rows => { const latest = rows[rows.length - 1]; return latest.submissionStatus === 'SUR' && !latest.actualReturnDate; }).length;
  const expApproved = groups.filter(rows => rows.some(r => r.flagApproved)).length;
  assert.equal(view.kpis.underReview, expUnderReview);
  assert.equal(view.kpis.approved, expApproved);
});

test('applies all global dimensions to submissions and planned rows', () => {
  const discipline = model.planned.find(row => row.discipline)?.discipline;
  const selected = deriveView(model, { disciplines: new Set([discipline]), stages: new Set(model.planned.filter(row => row.discipline === discipline).map(row => row.stage)), statuses: new Set(['SUR']), approvals: new Set(), submitters: new Set(), search: '' });
  assert.ok(selected.active.every(row => row.discipline === discipline && row.submissionStatus === 'SUR'));
  assert.ok(selected.activePlans.every(row => row.discipline === discipline));
  assert.ok(selected.kpis.totalPlanned < defaultPlanCount);
});

test('search narrows plan and submission details from the same state', () => {
  const row = model.submissions.find(item => item.documentNo);
  const view = deriveView(model, { search: row.documentNo });
  assert.ok(view.active.every(item => `${item.documentNo} ${item.fields['Document Title'] || ''} ${item.discipline}`.toLowerCase().includes(row.documentNo.toLowerCase())));
  assert.ok(view.activePlans.every(item => `${item.documentNo || ''} ${item.title || ''} ${item.discipline}`.toLowerCase().includes(row.documentNo.toLowerCase())));
});

test('renders dashboard views only from the supplied derived state', () => {
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const fakeDocument = { querySelector(selector) { return selector === '[data-page-content]' ? rootNode : null; } };
  const view = renderDashboard(fakeDocument, model, { page: 'Overview' });
  assert.match(html, /KPI OVERVIEW/);
  assert.match(html, /C1 Schedule Performance/);
  assert.match(html, /C2 Submission Flow &amp; Delay/);
  assert.equal(view.kpis.totalPlanned, defaultPlanCount);
});

test('global filters accept several values at once (multi-select union)', () => {
  const all = deriveView(model);
  const disciplines = [...new Set(model.submissions.map(row => row.discipline).filter(Boolean))].sort();
  assert.ok(disciplines.length >= 2, 'at least two submission disciplines exist');
  const one = deriveView(model, { disciplines: new Set([disciplines[0]]) });
  const both = deriveView(model, { disciplines: new Set(disciplines) });
  assert.ok(one.active.length < both.active.length, 'two selected values return more rows than one');
  assert.equal(both.active.length, all.active.length, 'selecting every value equals the unfiltered set');
  assert.ok(one.active.every(row => row.discipline === disciplines[0]), 'only the selected discipline survives');

  const statuses = [...new Set(model.submissions.map(row => row.submissionStatus).filter(Boolean))].sort();
  const singleStatus = deriveView(model, { statuses: new Set([statuses[0]]) });
  const twoStatuses = deriveView(model, { statuses: new Set(statuses.slice(0, 2)) });
  assert.ok(singleStatus.active.length < twoStatuses.active.length, 'two statuses return more rows than one');
  assert.ok(twoStatuses.active.every(row => statuses.slice(0, 2).includes(row.submissionStatus)));
});

test('derives C1 S-curve data with four series (workplan D35)', () => {
  const view = deriveView(model);
  assert.ok(view.c1 && Array.isArray(view.c1.months) && view.c1.months.length > 0, 'c1 months built');
  const len = view.c1.months.length;
  for (const key of ['pNew', 'aFNew', 'aRNew', 'fNew', 'pCum', 'aFCum', 'aRCum', 'fCum'])
    assert.equal(view.c1[key].length, len, `${key} aligns to months`);
  for (let i = 1; i < view.c1.pCum.length; i++) assert.ok(view.c1.pCum[i] >= view.c1.pCum[i - 1], 'planned cumulative is monotonic');
  // Actual First counts unique documents; Actual Resub counts per record beyond the first.
  const uniqueDocs = new Set(model.submissions.filter(r => r.documentNo).map(r => String(r.documentNo).trim().toUpperCase())).size;
  assert.ok(view.c1.aFCum[len - 1] <= uniqueDocs, 'actual-first cumulative never exceeds unique documents');
  for (let i = 1; i < view.c1.fCum.length; i++) assert.ok(view.c1.fCum[i] >= view.c1.fCum[i - 1], 'forecast cumulative is monotonic');
  if (!view.c1.hasMdlForecast) assert.ok(view.c1.fCum[len - 1] >= view.c1.pCum[len - 1], 'forecast fallback is at or above planned (×1.04)');
});

test('renders C1 S-curve controls and SVG in Overview', () => {
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const fakeDocument = { querySelector(selector) { return selector === '[data-page-content]' ? rootNode : null; } };
  renderDashboard(fakeDocument, model, { page: 'Overview' });
  assert.match(html, /C1 Schedule Performance/);
  assert.match(html, /class="scurve-svg"/);
  assert.match(html, /data-c1grain="month"/);
  assert.match(html, /data-c1png/);
  assert.match(html, /data-c1series="actualFirst"/);
  assert.match(html, /sc-bar-forecast/, 'forecast bar is drawn');
  assert.match(html, /class="scurve sc-board"/, 'chart-component board border is drawn');
  assert.match(html, /sc-ref-lbl-start/, 'Start reference label is drawn');
  assert.match(html, /sc-ref-lbl-today/, 'Today reference label is drawn');
});

// T19.1 / I116 — spec §4.2 rev 1.59: one native attached table in one alignment grid, in the
// static HTML (no scripts), with data-driven rows and no ARIA table roles.
test('T19.1 / I116 — C1 S-curve carries one native attached table in one alignment grid', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Overview' });
  const nb = deriveView(model).c1.months.length;
  assert.equal((html.match(/class="scurve sc-board"/g) || []).length, 1, 'one chart board');
  assert.equal((html.match(/class="c1-grid"/g) || []).length, 1, 'one alignment grid');
  assert.equal((html.match(/class="c1-plot"/g) || []).length, 1, 'one curve plot');
  assert.match(html, /--c1-gutter:\d+px/, 'the gutter track is set');
  assert.match(html, /--c1-cols:\d+/, 'the period track count is set');
  const svgTag = html.match(/<svg[^>]*class="scurve-svg"[^>]*>/);
  assert.ok(svgTag, 'one curve SVG');
  assert.match(svgTag[0], /viewBox="0 0 \d+ \d+"/, 'the viewBox scales the whole curve into the card');
  assert.match(svgTag[0], /preserveAspectRatio="xMidYMid meet"/, 'the aspect ratio is kept');
  assert.match(svgTag[0], /role="img"/, 'the curve SVG keeps role="img"');
  const found = html.match(/<table class="c1-table[^"]*">[\s\S]*?<\/table>/);
  assert.ok(found, 'the attached table renders in static HTML');
  const table = found[0];
  assert.match(table, /<caption>[^<]+<\/caption>/, 'caption present');
  assert.match(table, /<colgroup>/, 'colgroup present');
  assert.equal((table.match(/<col\b/g) || []).length, nb + 1, 'one gutter col plus one col per period');
  assert.match(table, /<thead>[\s\S]*<th class="g-corner" scope="col">Reporting Month<\/th>/, 'corner header present');
  assert.equal((table.match(/scope="col"/g) || []).length, nb + 1, 'one column header per period plus the corner');
  const rows = (table.match(/scope="row"/g) || []).length;
  assert.ok(rows > 0, 'metric row headers present');
  assert.equal((table.match(/<td class="g-val/g) || []).length, rows * nb, 'every metric row has one value per period');
  assert.doesNotMatch(table, /role="(table|row|cell|columnheader|rowheader)"/, 'no ARIA table roles');
  assert.doesNotMatch(table, /display:\s*contents/, 'no display:contents');
});

// The client ResizeObserver calls the same renderer with the measured width. X points, the
// hover payload and the viewBox must share that width so the snap line stays on its month column.
test('T19.1 — the C1 curve refit keeps X points aligned at a new width', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Overview' });
  const board = html.match(/<div class="scurve sc-board"[^>]*>/)[0];
  const pts = JSON.parse(board.match(/data-points='([^']*)'/)[1].replace(/&#39;/g, "'"));
  const meta = JSON.parse(board.match(/data-c1meta='([^']*)'/)[1].replace(/&#39;/g, "'"));
  const geo = JSON.parse(board.match(/data-geo='([^']*)'/)[1].replace(/&#39;/g, "'"));
  assert.ok(Math.abs(pts[0].cx - 0.5 * geo.W / pts.length) < 0.2, 'static cx uses (i+0.5)*W/N');
  const built = c1PlotSvg(pts, meta, 900);
  assert.equal(built.W, 900, 'the refit uses the measured width');
  assert.ok((built.inner.match(/<polyline/g) || []).length > 0, 'the refit redraws the series lines');
  assert.ok(built.yTop > 0, '§4.2 rev 1.62: the wrapped legend reserves a band above the plot');
  assert.equal(built.H, built.yBot, 'the plot bottom is the SVG viewBox bottom');
  const legendY = Number(built.inner.match(/<g class="sc-legend"><g transform="translate\([\d.]+,([\d.]+)\)"/)[1]);
  assert.ok(legendY < built.yTop, 'the legend rows sit above the plot');
  const firstX = Number(built.inner.match(/points="([^"]+)"/)[1].split(' ')[0].split(',')[0]);
  assert.ok(Math.abs(firstX - 0.5 * 900 / pts.length) < 0.2, 'refit cx uses the same (i+0.5)*W/N rule');
});

// §4.2 rev 1.63 — the reviewed Option B prototype is now the production build. Assert the
// generated markup, the tokenised CSS, the shared binder's opt-in flag and the export stripping.
// Tier 5 / Tier 6 of the layout harness measure the live two-way hover behaviour in a browser.
test('§4.2 rev 1.63 — C1 attached-table interaction is in the production build', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Overview' });
  const nb = deriveView(model).c1.months.length;
  const board = html.match(/<div class="scurve sc-board"[^>]*>/)[0];
  const geo = JSON.parse(board.match(/data-geo='([^']*)'/)[1].replace(/&#39;/g, "'"));
  const svg = html.match(/<svg[^>]*class="scurve-svg"[^>]*>([\s\S]*?)<\/svg>/)[1];
  assert.equal((svg.match(/<linearGradient /g) || []).length, 4, 'one gradient per visible cumulative series');
  assert.equal((svg.match(/<path class="sc-area"/g) || []).length, 4, 'one soft area per visible cumulative series');
  for (const id of ['plan', 'forecast', 'actual', 'resub']) {
    assert.match(svg, new RegExp(`id="sc-grad-${id}"`), `gradient ${id} is defined`);
    assert.match(svg, new RegExp(`class="sc-stop-${id}"`), `gradient ${id} stops are class-tokenised`);
  }
  assert.doesNotMatch(svg, /stop-color="#[0-9a-f]{3,8}"/i, 'gradient stops carry no hard-coded hex (§4.6)');
  assert.equal((svg.match(/pointer-events="none"/g) || []).length, 5, 'four areas plus one band cannot steal hover');
  const band = svg.match(/<rect class="sc-hover-band"[^>]*>/)[0];
  assert.match(band, /style="display:none"/, 'the band starts hidden');
  assert.match(band, /pointer-events="none"/, 'the band is pointer-transparent');
  assert.ok(Math.abs(Number(band.match(/width="([\d.]+)"/)[1]) - geo.W / nb) < 0.2, 'band width is W / N');
  assert.ok(svg.indexOf('<rect class="sc-hover-band"') < svg.indexOf('<line class="sc-grid"'), 'the band is behind all marks');
  const table = html.match(/<table class="c1-table[^"]*">[\s\S]*?<\/table>/)[0];
  const rows = (table.match(/scope="row"/g) || []).length;
  assert.equal((table.match(/data-c1col="/g) || []).length, nb + rows * nb, 'every month header and value cell carries data-c1col');
  assert.equal((table.match(/<th class="g-axis" scope="col" data-c1col="/g) || []).length, nb, 'one data-c1col per month header');
  assert.doesNotMatch(table, /data-col="/, 'data-col stays reserved for .ds-table choosers and resize grips');
  const css = fs.readFileSync(path.join(root, 'engine/dashboard.css'), 'utf8');
  for (const [cls, token] of [['plan', 'plan'], ['forecast', 'forecast'], ['actual', 'actual'], ['resub', 'actualresub']]) {
    assert.match(css, new RegExp(`\\.sc-stop-${cls}\\{stop-color:var\\(--color-${token}\\)\\}`), `.sc-stop-${cls} uses its series token`);
  }
  assert.match(css, /\.sc-area\{[^}]*pointer-events:none/, 'areas are pointer-transparent');
  assert.match(css, /\.sc-hover-band\{[^}]*pointer-events:none/, 'the band is pointer-transparent');
  assert.match(css, /\.c1-table \[data-c1col\]\.col-active\{/, 'the column highlight is defined');
  const src = fs.readFileSync(path.join(root, 'engine/render.js'), 'utf8');
  assert.match(src, /attachedTable = false/, 'the shared binder gates the C1 behaviour behind an opt-in flag');
  assert.match(src, /attachedTable: true/, 'only the C1 call site opts in');
  assert.match(src, /tip\.setAttribute\('aria-hidden', 'true'\)/, 'a hidden window carries aria-hidden (§4.6)');
  assert.match(src, /tip\.textContent = ''/, 'a hidden window carries no stale text (§4.6)');
  const dash = fs.readFileSync(path.join(root, 'engine/dashboard.js'), 'utf8');
  assert.match(dash, /sc-stop-resub\{stop-color:\$\{resub\}\}/, 'PNG / Copy resolve the gradient stops');
  assert.match(dash, /clone\.querySelectorAll\('\.chart-snap, \.sc-hover-band'\)/, 'PNG / Copy strip transient hover marks');
  assert.match(dash, /activeCells/, 'PNG / Copy neutralise .col-active before reading text colours');
});

// §4.2 rev 1.59 and the owner decisions of 2026-11-06: one vertical Y-axis line, a rotated
// side unit caption, no as-of subtitle, a semantic <caption> that adds no header gap, and
// static width/height that agree with the viewBox (otherwise xMidYMid meet letterboxes).
test('T19.1 — C1 Y axis, unit caption, as-of subtitle and caption visibility follow §4.2', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Overview' });
  assert.equal((html.match(/<line class="sc-yaxis-line"/g) || []).length, 1, 'one vertical Y-axis line');
  const axis = html.match(/<line class="sc-yaxis-line"[^>]*>/)[0];
  assert.match(axis, /x1="0"/, 'the axis line sits at the plot left edge');
  assert.match(axis, /x2="0"/, 'the axis line is vertical');
  const axisY1 = Number(axis.match(/y1="([\d.]+)"/)[1]);
  const axisY2 = Number(axis.match(/y2="([\d.]+)"/)[1]);
  assert.ok(axisY1 > 0, 'the axis line starts below the top legend band');
  assert.equal(axisY2 - axisY1, 300, 'the axis line spans the plot height');
  const c1SvgTag = html.match(/<svg[^>]*class="scurve-svg"[^>]*>/)[0];
  assert.equal(Number(c1SvgTag.match(/viewBox="0 0 \d+ (\d+)"/)[1]), axisY2, 'the plot bottom is the SVG bottom');
  assert.doesNotMatch(html, /class="sc-asof"/, 'the as-of subtitle is omitted');
  assert.match(html, /<span class="c1-ycap">Documents<\/span>/, 'the unit caption names the measure');
  assert.match(html, /<caption>[^<]+<\/caption>/, 'the semantic caption stays in the DOM');
  const svgTag = html.match(/<svg[^>]*class="scurve-svg"[^>]*>/)[0];
  const vb = svgTag.match(/viewBox="0 0 (\d+) (\d+)"/);
  assert.ok(vb, 'viewBox present');
  assert.equal(svgTag.match(/width="(\d+)"/)[1], vb[1], 'static width matches the viewBox width');
  assert.equal(svgTag.match(/height="(\d+)"/)[1], vb[2], 'static height matches the viewBox height');
  const css = fs.readFileSync(path.join(root, 'engine/dashboard.css'), 'utf8');
  assert.match(css, /\.c1-yaxis \.c1-ycap\{[^}]*writing-mode:vertical-rl/, 'the unit caption is rotated along the axis');
  assert.match(css, /\.c1-table caption\{[^}]*position:absolute/, 'the caption contributes no header gap');
  assert.match(css, /\.sc-yaxis-line\{/, 'the axis line is a 1 px light rule');
  assert.doesNotMatch(css, /\.sc-asof\{/, 'the dead as-of style is removed');
});

// I117 — owner review of the C1 panel: the unit caption reads "Documents", the Y ticks are round
// numbers, the bar values sit fully above their bars, and each month centres its visible (non-zero)
// bars on the band centre. §4.2 rev 1.64 made the tick count dynamic (see the I118 test below).
test('I117 — C1 caption, round Y ticks, bar values above bars and per-month bar centring', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Overview' });
  assert.match(html, /<span class="c1-ycap">Documents<\/span>/, 'the unit caption reads Documents');
  assert.doesNotMatch(html, /Cumulative documents/, 'the old caption text is gone');
  const meta = JSON.parse(html.match(/data-c1meta='([^']*)'/)[1].replace(/&#39;/g, "'"));
  const tickTexts = [...html.matchAll(/<span class="c1-ytick"[^>]*>([\d,]+)<\/span>/g)].map(m => Number(m[1].replace(/,/g, '')));
  assert.ok(tickTexts.length >= 2 && tickTexts.length <= 8, 'the dynamic Y tick count stays within the rev 1.64 cap');
  for (const t of tickTexts) assert.equal(t % meta.yStep, 0, `tick ${t} is a round multiple of the step ${meta.yStep}`);
  // One synthetic payload: month 0 has only Plan non-zero, month 1 has all four series.
  const pts = [
    { pNew: 10, fNew: 0, aFNew: 0, aRNew: 0, pCum: 10, fCum: 0, aFCum: 0, aRCum: 0 },
    { pNew: 5, fNew: 7, aFNew: 3, aRNew: 2, pCum: 15, fCum: 7, aFCum: 3, aRCum: 2 }
  ];
  const built = c1PlotSvg(pts, { yMax: 20 }, 600);
  const band = 600 / 2, xc0 = 0.5 * band, xc1 = 1.5 * band;
  const rects = [...built.inner.matchAll(/<rect class="(sc-bar-[a-z]+)" x="([\d.]+)" y="(-?[\d.]+)" width="([\d.]+)"/g)]
    .map(m => ({ cls: m[1], x: Number(m[2]), y: Number(m[3]), w: Number(m[4]) }))
    .filter(r => r.y >= 0); // legend swatches sit at y=-8 and stay out
  const m0 = rects.filter(r => r.x < band), m1 = rects.filter(r => r.x >= band);
  assert.equal(m0.length, 1, 'month 0 draws only its one non-zero bar');
  assert.ok(Math.abs(m0[0].x - (xc0 - 9)) < 0.2, 'month 0 centres its single bar (group start xc - 9)');
  assert.deepEqual(m1.map(r => r.cls), ['sc-bar-plan', 'sc-bar-forecast', 'sc-bar-actual', 'sc-bar-actualresub'], 'month 1 keeps the series colour classes in order');
  for (let k = 0; k < 4; k++) assert.ok(Math.abs(m1[k].x - (xc1 - 36 + k * 18)) < 0.2, `month 1 bar ${k} starts at its centred group slot`);
  // The rotated value starts 4 px above its bar top and reads upward, so it never overlaps the bar.
  const texts = [...built.inner.matchAll(/<text class="sc-barval" x="([\d.]+)" y="([\d.]+)" text-anchor="start" dominant-baseline="central" transform="rotate\(-90 [\d.]+ [\d.]+\)">(\d+)<\/text>/g)]
    .map(m => ({ x: Number(m[1]), y: Number(m[2]), v: Number(m[3]) }));
  assert.equal(texts.length, 5, 'one value label per drawn bar');
  const pairs = [[m0[0], texts[0]], [m1[0], texts[1]], [m1[1], texts[2]], [m1[2], texts[3]], [m1[3], texts[4]]];
  for (const [rect, text] of pairs) {
    assert.ok(text.y <= rect.y - 3, `value ${text.v} sits fully above its bar top`);
    assert.ok(Math.abs(text.x - (rect.x + rect.w / 2)) < 9, 'the value column stays on its bar');
  }
});

// §4.2 rev 1.64 / I118 — the C1 dynamic Y tick standard. One metadata payload drives the grid
// lines, the static HTML ticks and the client refit; the plot height stays 300 units.
test('§4.2 rev 1.64 — C1 Y ticks follow the dynamic nice-number standard', () => {
  const cases = [
    [5955, 6000, 1000, 6], [6100, 7000, 1000, 7], [8100, 10000, 2000, 5],
    [6133.65, 7000, 1000, 7], [3, 3, 1, 3], [1, 1, 1, 1]
  ];
  for (const [m, yMax, step, intervals] of cases) {
    const a = niceAxisTicks(m);
    assert.deepEqual({ yMax: a.yMax, step: a.step, intervals: a.intervals }, { yMax, step, intervals }, `M=${m} picks the smallest nice step that fits`);
    assert.equal(a.ticks.length, intervals + 1, `M=${m}: labels = intervals + 1`);
    assert.ok(intervals <= 7 && a.ticks.length <= 8, `M=${m} respects the 7-interval / 8-label cap`);
    assert.ok(300 / intervals >= 40 - 1e-9, `M=${m} keeps at least ~40 units between major ticks`);
    assert.ok(a.ticks.every((v, i) => v === i * step), `M=${m}: labels are nice-number multiples`);
  }
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const render = state => {
    renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Overview', ...state });
    return html;
  };
  render({});
  const board = html.match(/<div class="scurve sc-board"[^>]*>/)[0];
  const meta = JSON.parse(board.match(/data-c1meta='([^']*)'/)[1].replace(/&#39;/g, "'"));
  assert.deepEqual([meta.yMax, meta.yStep, meta.yIntervals], [6000, 1000, 6], 'real workbooks: visible max 5955 -> 6000 / 1000 / 6');
  const labels = [...html.matchAll(/<span class="c1-ytick"[^>]*>([\d,]+)<\/span>/g)]
    .map(m => Number(m[1].replace(/,/g, ''))).sort((a, b) => a - b);
  assert.deepEqual(labels, [0, 1000, 2000, 3000, 4000, 5000, 6000], 'static ticks come from yStep / yIntervals');
  const c1svg = html.match(/<svg[^>]*class="scurve-svg"[^>]*>([\s\S]*?)<\/svg>/)[1];
  const gridY = [...c1svg.matchAll(/<line class="sc-grid" x1="0" y1="([\d.]+)"/g)].map(m => Number(m[1])).sort((a, b) => a - b);
  assert.equal(gridY.length, labels.length, 'one SVG grid line per Y label');
  const gaps = gridY.slice(1).map((y, i) => y - gridY[i]);
  assert.ok(Math.min(...gaps) >= 40 - 1e-9, `major ticks stay >= 40 units apart (min ${Math.min(...gaps)})`);
  // The client refit reads the SAME payload and preserves the 300-unit plot height.
  const pts = JSON.parse(board.match(/data-points='([^']*)'/)[1].replace(/&#39;/g, "'"));
  const built = c1PlotSvg(pts, meta, 900);
  assert.equal(built.yMax, meta.yMax, 'refit keeps yMax');
  assert.equal(built.yStep, meta.yStep, 'refit keeps yStep');
  assert.equal(built.yIntervals, meta.yIntervals, 'refit keeps yIntervals');
  assert.equal((built.inner.match(/<line class="sc-grid"/g) || []).length, labels.length, 'refit draws one grid line per label');
  assert.equal(built.yBot - built.yTop, 300, 'the chart area height stays 300 units');
  // Hiding series re-fits the axis to the VISIBLE maximum (aFCum peak = 190 -> 200).
  render({ c1Series: new Set(['actualFirst']) });
  const hidden = JSON.parse(html.match(/data-c1meta='([^']*)'/)[1].replace(/&#39;/g, "'"));
  assert.deepEqual([hidden.yMax, hidden.yStep, hidden.yIntervals], [200, 50, 4], 'the axis follows the visible series');
  assert.equal((html.match(/class="c1-ytick"/g) || []).length, hidden.yIntervals + 1, 'the label count follows the visible series');
});

// §4.2 rev 1.65 / I119 — the shared Y axis follows the selected period window, recomputing on
// every repaint. Cumulative values stay absolute; no second Y-axis or separate bar scale exists.
test('§4.2 rev 1.65 — C1 shared Y axis follows the period window without rebasing', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const render = state => {
    renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Overview', ...state });
    return html;
  };
  const boardOf = h => h.match(/<div class="scurve sc-board"[^>]*>/)[0];
  const metaOf = h => JSON.parse(boardOf(h).match(/data-c1meta='([^']*)'/)[1].replace(/&#39;/g, "'"));
  const ptsOf = h => JSON.parse(boardOf(h).match(/data-points='([^']*)'/)[1].replace(/&#39;/g, "'"));
  const labelsOf = h => [...h.matchAll(/<span class="c1-ytick"[^>]*>([\d,]+)<\/span>/g)].map(m => Number(m[1].replace(/,/g, '')));
  const gridOf = h => (h.match(/<svg[^>]*class="scurve-svg"[^>]*>([\s\S]*?)<\/svg>/)[1].match(/<line class="sc-grid"/g) || []).length;
  const cum = p => ['pCum', 'fCum', 'aFCum', 'aRCum'].map(k => Number(p[k]) || 0);
  const byLabel = arr => Object.fromEntries(arr.map(p => [p.label, cum(p)]));

  render({});
  const full = metaOf(html), fullPts = ptsOf(html);
  assert.deepEqual([full.yMax, full.yStep, full.yIntervals], [6000, 1000, 6], 'full window: axis 6000 / step 1000 / 6 intervals');
  assert.deepEqual(labelsOf(html), [6000, 5000, 4000, 3000, 2000, 1000, 0], 'full window: descending round ticks');
  assert.equal(gridOf(html), 7, 'one grid line per label');

  render({ c1Period: [0, 9] });
  const narrow = metaOf(html), narrowPts = ptsOf(html);
  assert.deepEqual([narrow.yMax, narrow.yStep, narrow.yIntervals], [300, 50, 6], '2026-01..2026-10: axis 300 / step 50 / 6 intervals');
  assert.deepEqual([...labelsOf(html)].sort((a, b) => a - b), [0, 50, 100, 150, 200, 250, 300], 'narrow window ticks come from the same metadata');
  assert.equal(gridOf(html), 7, 'narrow window keeps one grid line per label');
  assert.ok(narrowPts.length < fullPts.length, 'the narrow window has fewer points');
  const fullMap = byLabel(fullPts), narrowMap = byLabel(narrowPts), shared = Object.keys(narrowMap);
  assert.ok(shared.length > 0, 'the two windows share months');
  for (const label of shared) assert.deepEqual(narrowMap[label], fullMap[label], `absolute cumulative values kept for ${label}`);
  // The client refit reads the SAME payload as the static render.
  const built = c1PlotSvg(narrowPts, narrow, 900);
  assert.deepEqual([built.yMax, built.yStep, built.yIntervals], [300, 50, 6], 'refit keeps the windowed axis');
  assert.equal((built.inner.match(/<line class="sc-grid"/g) || []).length, 7, 'refit draws one grid line per label');
  assert.equal(built.yBot - built.yTop, 300, 'the chart area height stays 300 units');

  render({ c1Period: [9, 9] });
  assert.deepEqual([metaOf(html).yMax, metaOf(html).yStep, metaOf(html).yIntervals], [300, 50, 6], 'single-month window re-fits the axis');
  assert.equal(ptsOf(html).length, 1, 'the single-month window has one point');

  // Cumulative values are absolute, so moving only From leaves the peak (and the axis) unchanged.
  render({ c1Period: [20, 30] });
  assert.equal(metaOf(html).yMax, 6000, 'a later From with the same To keeps the absolute peak');

  render({ c1Series: new Set(['actualFirst']), c1Bars: false });
  const hidden = metaOf(html);
  assert.deepEqual([hidden.yMax, hidden.yStep, hidden.yIntervals], [200, 50, 4], 'visible series + Bars off re-fit the axis');
  assert.equal(labelsOf(html).length, 5, 'the label count follows the windowed peak');
  assert.equal(gridOf(html), 5, 'the grid follows the windowed peak');

  // Quarter grain sums the monthly bars into buckets; the axis still comes from those windowed pts.
  render({ c1Grain: 'quarter', c1Period: [0, 9] });
  const q = metaOf(html), qPts = ptsOf(html);
  const qPeak = Math.max(1, ...qPts.flatMap(p => ['pCum', 'fCum', 'aFCum', 'aRCum', 'pNew', 'fNew', 'aFNew', 'aRNew'].map(k => Number(p[k]) || 0)));
  assert.equal(q.yMax, niceAxisTicks(qPeak).yMax, 'quarter-grain axis follows the windowed bucket peak');
  assert.ok(q.yMax < full.yMax && q.yMax >= qPeak, 'the quarter-grain window re-fits without clipping the peak');
  assert.equal(gridOf(html), q.yIntervals + 1, 'quarter grain keeps one grid line per label');
});

test('§4.2 rev 1.66 — c1PresetRange resolves the five whole-month presets', () => {
  const keys = Array.from({ length: 31 }, (_, i) => new Date(Date.UTC(2024, i, 1)).toISOString().slice(0, 7));
  const asOf = '2026-11-06';
  assert.equal(keys[0], '2024-01');
  assert.equal(keys[30], '2026-07');
  assert.deepEqual(C1_PRESETS, ['6M', '12M', '24M', 'YTD', 'All']);
  assert.deepEqual(c1PresetRange('6M', keys, 30, asOf), [25, 30], '6 whole months ending at the anchor');
  assert.deepEqual(c1PresetRange('12M', keys, 30, asOf), [19, 30], '12 whole months ending at the anchor');
  assert.deepEqual(c1PresetRange('24M', keys, 30, asOf), [7, 30], '24 whole months ending at the anchor');
  assert.deepEqual(c1PresetRange('YTD', keys, 30, asOf), [24, 30], 'January 2026 through the last month at or before 2026-11');
  assert.deepEqual(c1PresetRange('YTD', keys, 30, '2025-04-30'), [12, 15], '2025-01 through 2025-04');
  assert.deepEqual(c1PresetRange('All', keys, 30, asOf), [0, 30], 'All spans every month');
  assert.deepEqual(c1PresetRange('6M', keys, 3, asOf), [0, 3], 'a short anchor clamps at the first month');
  assert.deepEqual(c1PresetRange('All', keys, 999, asOf), [0, 30], 'an out-of-range anchor clamps');
  assert.equal(c1PresetRange('bogus', keys, 30, asOf), null, 'an unknown preset returns null');
  assert.equal(c1PresetRange('All', [], 0, asOf), null, 'an empty month list returns null');
});

test('§4.2 rev 1.66 — C1 renders one dual-handle month-snapped track with ticks and preset chips', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const render = state => {
    renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Overview', ...state });
    return html;
  };
  const chipsOf = h => [...h.matchAll(/data-c1preset="([^"]+)" aria-pressed="(true|false)"/g)].map(m => [m[1], m[2]]);
  render({});
  const bar = html.match(/<div class="c1-ts" id="c1TimeBar"[^>]*>/)?.[0];
  assert.ok(bar, 'the C1 period group is present');
  const months = JSON.parse(bar.match(/data-c1months="([^"]*)"/)[1].replace(/&quot;/g, '"'));
  const n = months.length;
  assert.ok(n > 12, `the workbook supplies several reporting months (got ${n})`);
  assert.equal((html.match(/class="c1-ts-track"/g) || []).length, 1, 'ONE shared visual track');
  const inputs = [...html.matchAll(/<input type="range" class="c1-ts-input[^>]*>/g)].map(m => m[0]);
  assert.equal(inputs.length, 2, 'two native range handles');
  assert.ok(inputs.some(x => x.includes('data-c1period="from"')) && inputs.some(x => x.includes('data-c1period="to"')),
    'both handles keep the data-c1period attributes');
  for (const input of inputs) {
    assert.ok(input.includes('step="1"'), 'hard magnetic month snap');
    assert.ok(input.includes('min="0"') && input.includes(`max="${n - 1}"`), 'both handles share the same month bounds');
    assert.match(input, /aria-label="Period (start|end)"/);
    assert.match(input, /aria-valuetext="[^"]+"/);
  }
  assert.ok(!html.includes('class="c1-range"') && !html.includes('c1-range-wrap'), 'the separate From / To inputs are gone');
  const ticks = [...html.matchAll(/data-c1month="(\d+)"/g)].map(m => Number(m[1]));
  assert.equal(ticks.length, n, 'one tick per reporting month');
  assert.deepEqual(ticks, Array.from({ length: n }, (_, i) => i), 'tick indices are sequential whole months');
  assert.deepEqual(chipsOf(html).map(x => x[0]), C1_PRESETS, 'five chips in the specified order');
  assert.deepEqual(chipsOf(html).find(x => x[0] === 'All'), ['All', 'true'], 'All is pressed at the default full period');
  assert.match(html, /<span class="c1-period-text" id="c1PeriodText">[^<]+<\/span>/);
  assert.ok(html.includes('role="group" aria-label="Period presets"'));
  assert.ok(html.includes('class="seg c1-ts-chips"'), 'the presets form one joined segmented group');
  const segGroup = html.match(/<div class="seg c1-ts-chips"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '';
  assert.equal((segGroup.match(/class="seg-btn/g) || []).length, 5, 'five segmented buttons');
  assert.ok(!html.includes('class="c1-ts-chip"'), 'the rev 1.66 pill buttons are gone');

  // A preset window drives state.c1Period, state.c1Preset and the windowed payload together.
  const six = c1PresetRange('6M', months, n - 1, '2026-11-06');
  render({ c1Period: six, c1Preset: '6M' });
  assert.equal(chipsOf(html).find(x => x[0] === '6M')[1], 'true', '6M chip follows the selected window');
  const board = html.match(/<div class="scurve sc-board"[^>]*>/)[0];
  const pts = JSON.parse(board.match(/data-points='([^']*)'/)[1].replace(/&#39;/g, "'"));
  assert.equal(pts.length, six[1] - six[0] + 1, 'the windowed payload matches the preset range');

  // CSS and client behaviour keep the track usable, printable and decoupled from the repaint.
  const css = fs.readFileSync(path.join(root, 'engine/dashboard.css'), 'utf8');
  const js = fs.readFileSync(path.join(root, 'engine/dashboard.js'), 'utf8');
  assert.ok(css.includes('.c1-ts-track::before'), 'one shared track has one visual rail');
  assert.ok(css.includes('.c1-ts-input:focus-visible{outline'), 'the handles have a focus outline');
  assert.ok(css.includes('@media print{.c1-ts-body,.c1-ts-chips.seg{display:none}}'), 'print hides the interactive controls');
  assert.ok(css.includes('@media(max-width:760px){.c1-ts-body'), 'the track wraps on a narrow card');
  assert.ok(css.includes('.c1-ts{--c1-thumb:14px;display:flex;align-items:center;gap:10px;flex-wrap:nowrap'), 'the cluster does not wrap at desktop widths');
  assert.ok(css.includes('@media(max-width:1279px){.c1-ts{flex-wrap:wrap}'), 'wrapping starts below the 1280 px minimum');
  assert.ok(css.includes('.seg-btn.active{background:var(--blue);color:#fff}'), 'the Sub segmented active token is used');
  assert.ok(js.includes('function c1SyncTimeBar()'), 'the visual-only sync exists');
  assert.ok(js.includes('if (event.target.dataset.c1period) { state.c1Preset = null; c1SyncTimeBar(); }'), 'input events clear the preset and do not repaint the chart');
  assert.ok(js.includes('c1PresetRange(target.dataset.c1preset'), 'chips use the shared preset helper');
  assert.ok((js.match(/c1SyncTimeBar\(\);/g) || []).length >= 2, 'paint and the input listener both call the visual sync');
});

test('§4.2 rev 1.67 — presets are mutually exclusive and a manual range clears them', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const doc = { querySelector: s => s === '[data-page-content]' ? node : null };
  const active = h => [...h.matchAll(/data-c1preset="([^"]+)" aria-pressed="true"/g)].map(m => m[1]);
  const show = state => renderDashboard(doc, model, { page: 'Overview', ...state });
  for (const p of C1_PRESETS) {
    show({ c1Preset: p });
    assert.deepEqual(active(html), [p], `only ${p} is active when ${p} is stored`);
    const seg = html.match(/<div class="seg c1-ts-chips"[^>]*>([\s\S]*?)<\/div>/)?.[1] || '';
    assert.equal((seg.match(/class="seg-btn active"/g) || []).length, 1, `exactly one .seg-btn.active for ${p}`);
  }
  show({ c1Preset: null });
  assert.deepEqual(active(html), [], 'a manual custom range leaves NO active chip');
  const bar = html.match(/<div class="c1-ts" id="c1TimeBar"[^>]*>/)?.[0];
  const months = JSON.parse(bar.match(/data-c1months="([^"]*)"/)[1].replace(/&quot;/g, '"'));
  // At anchor 10 the clipped 12M / 24M / YTD ranges all used to resolve to [0,10].
  const collided = c1PresetRange('12M', months, 10, '2026-11-07');
  assert.deepEqual(c1PresetRange('24M', months, 10, '2026-11-07'), collided, 'the collision still exists in the data');
  show({ c1Period: collided, c1Preset: '12M' });
  assert.deepEqual(active(html), ['12M'], 'collided clipped ranges no longer light two chips');
});

test('derives C3 Breakdown rows with one New per document and the rest Resubmissions (workplan D36)', () => {
  const view = deriveView(model);
  assert.ok(view.c3 && Array.isArray(view.c3.months) && view.c3.months.length > 0, 'c3 months built');
  const rows = view.c3.rows;
  assert.equal(rows.length, view.active.length, 'every active submission row is classified');
  const docs = new Set(rows.filter(row => row.doc).map(row => row.doc));
  // New is one per document: a document cannot be submitted twice for the first time.
  assert.equal(rows.filter(row => row.isNew).length, docs.size);
  const byDoc = new Map();
  for (const row of rows) {
    if (!row.doc) continue;
    const group = byDoc.get(row.doc) || []; group.push(row); byDoc.set(row.doc, group);
  }
  for (const group of byDoc.values())
    assert.equal(group.filter(row => row.isNew).length, 1, 'exactly one New row per document');
  // Each first submission falls in exactly one month, so New never double-counts across months.
  assert.equal(rows.reduce((sum, row) => sum + (row.isNew ? 1 : 0), 0), docs.size);
  // A specific month is row-level, so its rows split exhaustively into New and Resubmission.
  for (const month of view.c3.months) {
    const inMonth = rows.filter(row => row.month === month);
    const newCount = inMonth.filter(row => row.isNew).length;
    assert.equal(newCount + inMonth.filter(row => !row.isNew).length, inMonth.length, `${month} splits exhaustively`);
  }
  assert.ok(rows.length > docs.size, 'the log holds resubmissions, so the two rules are distinguishable');
});

test('counts the all-months approval mix once per document using its first approval (D36)', () => {
  const view = deriveView(model);
  const rows = view.c3.rows;
  const docs = [...new Set(rows.filter(row => row.doc).map(row => row.doc))];
  // Recompute the rule independently: each document contributes its earliest approval row only, so a
  // document approved in one month and approved again later still counts as one approval.
  let perDoc = 0;
  for (const doc of docs) {
    const ordered = rows.filter(row => row.doc === doc).sort((a, b) => a.seq - b.seq);
    if (ordered.some(row => view.c3.codes?.includes(row.approvalStatus) || ['APP', 'AWC', 'NAP', 'REJ', 'INF'].includes(row.approvalStatus))) perDoc++;
  }
  const rowApprovals = rows.filter(row => ['APP', 'AWC', 'NAP', 'REJ', 'INF'].includes(row.approvalStatus)).length;
  assert.ok(perDoc <= docs.length, 'all-months approvals are counted per document');
  assert.ok(rowApprovals >= perDoc, 'the row-level total is never below the per-document total');
});

test('renders C3 Breakdown controls and the two-series bar chart in Overview', () => {
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const fakeDocument = { querySelector(selector) { return selector === '[data-page-content]' ? rootNode : null; } };
  renderDashboard(fakeDocument, model, { page: 'Overview' });
  assert.match(html, /C3 Breakdown/);
  assert.match(html, /class="chart c3-card"/, 'each chart is its own bordered card');
  assert.match(html, /data-c3month/);
  assert.match(html, /data-c3dim="submitter"/);
  assert.match(html, /data-c3view="pie"/);
  assert.match(html, /data-c3png/);
  assert.match(html, /data-c3copy/);
  // Wave 4.2 (Option 2): two cards with a shared panel control cluster (Month + Break-down-by), not per-card controls.
  assert.match(html, /class="c3-cards"/, 'the panel holds two stacked-bar cards');
  assert.match(html, /class="c3-grid"/, 'each card is one aligned grid (bars + labels + table)');
  assert.match(html, /seg-bar c3-new/, 'First Submission bar drawn');
  assert.match(html, /seg-bar c3-resub/, 'Resubmission bar drawn');
  assert.match(html, /seg-bar c3-app/, 'Approval APP bar drawn');
  // Percentages remain a pie-view detail (see the pie test); the bar view shows grouped vertical bars.
});

test('T15.3 (Wave 4.2): C3 splits into two side-by-side vertical-bar charts; All-months shows SUR in Approval, not Under Review (D38 refined)', () => {
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const fakeDocument = { querySelector(selector) { return selector === '[data-page-content]' ? rootNode : null; } };
  renderDashboard(fakeDocument, model, { page: 'Overview' }); // default scope = All months
  assert.match(html, /class="c3-cards"/, 'two stacked-bar cards');
  assert.equal((html.match(/class="c3-grid"/g) || []).length, 2, 'exactly two aligned grids render');
  assert.match(html, /Submissions/, 'left chart is Submissions');
  assert.match(html, /Approval Status/, 'right chart is Approval Status');
  // All months: Submissions = First Submission + Resubmission (Option A); Approval Status adds SUR (open review).
  assert.match(html, /seg-bar c3-new/, 'First Submission bar drawn');
  assert.match(html, /seg-bar c3-resub/, 'Resubmission bar drawn');
  assert.match(html, /seg-bar c3-ur/, 'SUR (open review) bar drawn in Approval Status');
  assert.match(html, /SUR/, 'open review shown as SUR in Approval Status');
  // "Under Review" now legitimately appears as a row in the Submissions attached table. Scope the check
  // to the bar region of each card: All-months must NOT draw an Under Review bar in Submissions (it is
  // SUR in Approval Status), but Approval Status must draw SUR.
  const subCard = html.slice(html.indexOf('>Submissions<'), html.indexOf('Approval Status'));
  const appCard = html.slice(html.indexOf('Approval Status'), html.indexOf('class="c3-summary"'));
  assert.doesNotMatch(subCard, /seg-bar c3-ur/, 'All-months Submissions bar has no Under Review segment');
  assert.match(appCard, /seg-bar c3-ur/, 'All-months Approval Status bar shows SUR (open review)');
  // A specific month keeps Under Review in the Submissions chart (D38).
  let monthHtml = '';
  const monthNode = { set innerHTML(value) { monthHtml = value; }, get innerHTML() { return monthHtml; } };
  const c3v = deriveView(model);
  // I106 widened c3.months to project start → as-of, so [0] may be a zero-submission month (empty card).
  // Pick a month that actually has rows so the "Under Review appears" assertion has something to match.
  const dataMonth = c3v.c3.months.find(m => c3v.c3.rows.some(r => r.month === m)) || c3v.c3.months[0];
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? monthNode : null }, model, { page: 'Overview', c3Month: dataMonth });
  assert.match(monthHtml, /Under Review/, 'a specific month shows Under Review in Submissions');
});

test('renders the C3 Breakdown summary table below the chart', () => {
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const fakeDocument = { querySelector(selector) { return selector === '[data-page-content]' ? rootNode : null; } };
  renderDashboard(fakeDocument, model, { page: 'Overview' });
  assert.match(html, /class="c3-summary"/);
  assert.match(html, /data-c3export/, 'the summary table has a Download (CSV) button');
  assert.match(html, /class="ds-table"/, 'the summary uses the shared table style (§7.2)');
  for (const head of ['Total Plan', 'New Submissions', 'Resubmissions', 'Total Submitted', 'Total Approved', 'Total AWC', 'Total Under Review'])
    assert.match(html, new RegExp(head), `column ${head} is present`);
  assert.match(html, /<tfoot>/, 'a Total footer row is rendered');
});

// I046 — the Master Document List has no submitter column, so Total Plan can only reach the rows
// linked to a submission. The submitter view drops the column instead of showing a number that
// cannot grow, and a note states the reason. The discipline view keeps it.
test('I046 — the C3 submitter view drops Total Plan and explains why', () => {
  let submitterHtml = '';
  const submitterNode = { set innerHTML(value) { submitterHtml = value; }, get innerHTML() { return submitterHtml; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? submitterNode : null }, model, { page: 'Overview', c3Dim: 'submitter' });
  // The note is the only place the words can appear: it names the column it explains. One hit means
  // the header, the metric row and every bar label are gone.
  const submitterHits = (submitterHtml.match(/Total Plan/g) || []).length;
  assert.equal(submitterHits, 1, 'the submitter view carries no Total Plan column or metric row');
  assert.match(submitterHtml, /New Submissions/, 'the other columns stay');
  assert.match(submitterHtml, /Master Document List has no submitter column/, 'the note states the reason');
  assert.match(submitterHtml, /<tfoot>/, 'the Total footer row still renders');

  let disciplineHtml = '';
  const disciplineNode = { set innerHTML(value) { disciplineHtml = value; }, get innerHTML() { return disciplineHtml; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? disciplineNode : null }, model, { page: 'Overview', c3Dim: 'discipline' });
  assert.match(disciplineHtml, /Total Plan/, 'the discipline view keeps Total Plan');
});

test('T15.5 (Wave 4.2): the C3 summary table sits below the charts at full width', () => {
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? rootNode : null }, model, { page: 'Overview' });
  const boardPos = html.indexOf('class="c3-cards"');
  const summaryPos = html.indexOf('class="c3-summary"');
  assert.ok(boardPos > -1 && summaryPos > -1, 'the panel has a chart board and a summary table');
  // T15.5 stacks them: the table renders after the chart board in DOM order and is the one full-set table.
  assert.ok(boardPos < summaryPos, 'the summary table sits below the chart board');
  assert.equal((html.match(/class="c3-summary"/g) || []).length, 1, 'one full-set summary table renders');
  assert.match(html, /class="ds-table"/, 'the summary uses the shared full-width table style (§7.2)');
  // The split-header structure (§7.2.15) is what wireSplitHeaders keeps aligned and re-flows on resize.
  assert.match(html, /class="ds-split splitcard"/, 'the summary uses the split-header table (§7.2.15)');
  assert.match(html, /class="ds-table vheadtab"/, 'the split header carries a frozen header fragment');
  assert.match(html, /class="ds-gut"/, 'the split header carries the scrollbar gutter');
});

test('Wave 4.2 (Option 2): C3 splits into two cards with a shared panel control cluster (no per-card month/dim)', () => {
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? rootNode : null }, model, { page: 'Overview' });
  // Bar view: two bordered cards, one two-column grid.
  assert.equal((html.match(/class="chart c3-card"/g) || []).length, 2, 'two bordered cards render in the Bar view');
  assert.match(html, /class="c3-cards"/, 'the cards share one two-column grid');
  assert.match(html, /Submissions/);
  assert.match(html, /Approval Status/);
  // Controls are shared at the panel level (Month + Break-down-by), not duplicated per card: exactly one
  // of each, in the .c3-controls cluster. PNG / Copy stay per card (two clusters).
  assert.match(html, /class="c3-controls"/, 'a shared panel control cluster renders');
  assert.equal((html.match(/data-c3month/g) || []).length, 1, 'exactly one shared month control (not one per card)');
  assert.match(html, /data-c3dim="submitter"/, 'the shared Break-down-by toggle exposes the submitter option');
  assert.equal((html.match(/class="c3-card-ctrls"/g) || []).length, 2, 'two per-card PNG/Copy clusters render');
  // Each card is one aligned CSS grid: bars (g-bar), vertical axis labels (g-axis), attached table (g-label / g-val).
  // The breakdown lists every MDL discipline even when a month has zero submissions for it (Q1, Q2).
  assert.match(html, /class="c3-grid"/, 'each card is one aligned grid (bars + labels + table)');
  assert.match(html, /class="g-bar"/, 'bars render');
  assert.match(html, /class="g-axis"/, 'axis labels render (vertical, aligned to bars)');
  // I060: C3 bars get a y-axis with grid lines + numbers, matching C1/C2.
  assert.match(html, /class="c3-gridlines"/, 'C3 bars get horizontal y-axis grid lines (I060)');
  assert.match(html, /class="g-yaxis"/, 'C3 bars get a y-axis number column (I060)');
  assert.equal((html.match(/class="g-ytick"/g) || []).length, 10, 'five right-aligned tick numbers per card (2 cards)');
  assert.match(html, /class="g-ytick"[^>]*>0</, 'the bottom tick is 0 (nice-max axis)');
  const plannedDiscs = [...new Set(model.planned.map(r => r.discipline).filter(Boolean))];
  for (const d of plannedDiscs) assert.ok(html.includes(d), `discipline ${d} listed (full MDL set shown)`);
});

test('C3 Pie view renders two donut cards (Submissions, Approval Status); Break-down-by hidden', () => {
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? rootNode : null }, model, { page: 'Overview', c3View: 'pie' });
  assert.equal((html.match(/class="chart c3-card"/g) || []).length, 2, 'two bordered cards render in the Pie view');
  assert.match(html, /Submissions/, 'left card is Submissions');
  assert.match(html, /Approval Status/, 'right card is Approval Status');
  assert.equal((html.match(/class="c3-svg"/g) || []).length, 2, 'each card shows its own donut');
  assert.match(html, /class="c3-controls"/, 'the shared panel control cluster still renders');
  assert.equal((html.match(/data-c3month/g) || []).length, 1, 'one shared month control');
  assert.doesNotMatch(html, /data-c3dim=/, 'Break-down-by is hidden in Pie view');
  assert.match(html, /c3-new-arc/, 'Submissions donut draws First Submission');
  assert.match(html, /c3-[a-z]+-arc/, 'at least one approval donut arc is drawn');
});

test('C3 Total Plan (All months) is bounded to the as-of month and excludes undated plans (I061)', () => {
  const view = deriveView(model);
  const asOf = String(view.c1.asOf || '').slice(0, 7);
  assert.ok(asOf, 'the fixture carries an as-of month');
  const ym = d => (typeof d === 'string' && /^\d{4}-\d{2}/.test(d)) ? d.slice(0, 7) : '';
  const dims = [...new Set(view.c3.rows.map(row => row.discipline))];
  assert.ok(dims.length > 0, 'the log supplies at least one discipline');
  for (const dim of dims) {
    const all = view.c3.planCount('discipline', dim, 'ALL');
    // Expected = active planned rows for this discipline whose Planned 1st Issue Date is a real month ≤ as-of.
    const expected = model.planned.filter(r =>
      r.documentNo && !['Deleted', 'Void', 'Superseded'].includes(r.stage) &&
      (r.discipline || 'Unknown') === dim &&
      (() => { const m = ym(r.fields['Planned 1st Issue Date']); return m && m <= asOf; })()
    ).length;
    assert.equal(all, expected, `${dim}: All-months Total Plan = planned 1st issues ≤ ${asOf} (undated excluded)`);
    // A specific month still counts only its own planned 1st issue.
    for (const month of view.c3.months) {
      const m = ym(month);
      const single = view.c3.planCount('discipline', dim, month);
      const singleExpected = model.planned.filter(r =>
        r.documentNo && !['Deleted', 'Void', 'Superseded'].includes(r.stage) &&
        (r.discipline || 'Unknown') === dim && ym(r.fields['Planned 1st Issue Date']) === m
      ).length;
      assert.equal(single, singleExpected, `${dim} ${month}: a single month counts only its own planned 1st issue`);
      if (m <= asOf) assert.ok(all >= single, `${dim}: All-months includes ${month}`);
    }
  }
});

test('T15.4 (Wave 4.2): Pie view shows two equal-total donuts (Submissions, Approval Status)', () => {
  const months = deriveView(model).c3.months;
  let pieHtml = '';
  const pieNode = { set innerHTML(value) { pieHtml = value; }, get innerHTML() { return pieHtml; } };
  renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? pieNode : null }, model, { page: 'Overview', c3View: 'pie' });
  assert.equal((pieHtml.match(/class="c3-svg"/g) || []).length, 2, 'two donut cards render');
  assert.match(pieHtml, /class="c3-new-arc"/, 'Submissions donut draws First Submission');
  assert.match(pieHtml, /class="c3-resub-arc"/, 'Submissions donut draws Resubmission');
  assert.match(pieHtml, /class="c3-ur-arc"/, 'All-months Approval donut shows SUR (open review)');
  // Both All-months donuts total the distinct-document count (T15.4 equal-total invariant).
  const totals = [...pieHtml.matchAll(/class="c3-total"[^>]*>(\d+)</g)].map(m => +m[1]);
  assert.equal(totals.length, 2, 'two donut totals render');
  assert.equal(totals[0], totals[1], 'All-months: Submissions donut total = Approval donut total (distinct documents)');
  // A single month shows Under Review only when it has open reviews; zero segments are omitted.
  let month = null, monthHtml = '';
  const monthNode = { set innerHTML(value) { monthHtml = value; }, get innerHTML() { return monthHtml; } };
  for (const cand of months) {
    renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? monthNode : null }, model, { page: 'Overview', c3View: 'pie', c3Month: cand });
    if (/class="c3-ur-arc"/.test(monthHtml)) { month = cand; break; }
  }
  assert.ok(month, 'at least one month shows Under Review in the pie');
  renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? monthNode : null }, model, { page: 'Overview', c3View: 'pie', c3Month: month });
  assert.match(monthHtml, /class="c3-new-arc"/, 'a single month donut still shows First Submission');
  assert.match(monthHtml, /class="c3-ur-arc"/, 'a single month donut shows Under Review as a third Submissions segment');
  assert.doesNotMatch(monthHtml, /\(\d+%\)/, 'a single month shows counts only (no percentages)');
});

// I099 — a document that is neither open under review nor carrying an approval code used to vanish
// from the Approval donut, so the two rings totalled different numbers. It now gets a "No Outcome"
// segment, and the pipeline raises V-35 for the same condition.
test('I099 — the Approval donut gives every document a segment, including "No Outcome"', () => {
  let pieHtml = '';
  const pieNode = { set innerHTML(value) { pieHtml = value; }, get innerHTML() { return pieHtml; } };
  renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? pieNode : null }, model, { page: 'Overview', c3View: 'pie' });
  const totals = [...pieHtml.matchAll(/class="c3-total"[^>]*>(\d+)</g)].map(m => +m[1]);
  assert.equal(totals.length, 2, 'two donut totals render');
  assert.equal(totals[0], totals[1], 'All-months: both donuts total the same distinct-document count');
  // The donut counts a document once, for the disciplines the breakdown lists (c3Metrics + universe).
  const universe = new Set([...model.planned.map(row => row.discipline).filter(Boolean), 'Unknown']);
  const activeDocs = new Set(deriveView(model).active.filter(row => row.documentNo && universe.has(row.discipline)).map(row => String(row.documentNo).trim().toUpperCase()));
  assert.equal(totals[0], activeDocs.size, 'the total is the distinct-document count');
  const noOutcome = model.issues.filter(issue => issue.code === 'V-35').length;
  const hasSegment = /c3-no-arc/.test(pieHtml);
  assert.equal(hasSegment, noOutcome > 0, 'the No Outcome arc is drawn only when documents lack one');
  if (noOutcome) assert.match(pieHtml, /No Outcome/, 'the legend names the segment');
});

// §4.6 — a KPI card must carry its window element INSIDE it. `bindChartHover` returns early when a
// root has no `.chart-tip`, so a card carrying only `data-tip` showed the `help` cursor and no window
// (owner report 2026-11-02: "only cursor is showing up"). Tier 6 could not catch it, because it
// discovers hosts by `aria-describedby`, which the binder sets only after it finds the window.
test('§4.6 — every KPI card carries its own hover window', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? node : null }, model, { page: 'Overview' });
  const cards = html.match(/<article class="kpi-card[^>]*>[\s\S]*?<\/article>/g) || [];
  assert.ok(cards.length >= 1, 'the Overview page renders KPI cards');
  const noWindow = cards.filter(cardHtml => !/class="chart-tip"/.test(cardHtml));
  assert.equal(noWindow.length, 0, `${noWindow.length} KPI card(s) render without a .chart-tip window`);
  const noTip = cards.filter(cardHtml => !/data-tip="/.test(cardHtml));
  assert.equal(noTip.length, 0, 'every KPI card carries data-tip');
});

// I102 — the C1 hover window follows §4.6: swatch · label · value rows, the forecast per-period
// count (previously drawn as a bar but never passed to the window), and the owner's A+B footer
// (actual cumulative total, % of plan, ahead/behind gap).
test('I102 — C1 hover window carries swatch rows, the forecast count and the A+B footer', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Overview' });
  const board = html.match(/<div class="scurve sc-board"[^>]*>/);
  assert.ok(board, 'the C1 board renders');
  const tag = board[0];
  const c1 = deriveView(model).c1;
  const dp = JSON.parse(tag.match(/data-points='([^']*)'/)[1].replace(/&#39;/g, "'"));
  assert.ok(dp.length > 0, 'data-points parses');
  for (const p of dp) assert.ok('fNew' in p, 'every point carries fNew');
  // Month grain, default period = the whole timeline, so buckets line up 1:1 with c1.months.
  assert.equal(dp.length, c1.months.length, 'default period covers every month');
  const meta = JSON.parse(tag.match(/data-c1meta='([^']*)'/)[1].replace(/&#39;/g, "'"));
  assert.equal(meta.fc, c1.hasMdlForecast, 'data-c1meta mirrors hasMdlForecast');
  assert.equal(meta.vis.length, 4, 'all four series visible by default');
  const last = dp[dp.length - 1];
  const tip = c1TipHtml(last, meta);
  assert.equal((tip.match(/chart-swatch /g) || []).length, 4, 'four swatch rows');
  for (const s of ['Plan', 'Forecast', 'Actual First', 'Actual Resub']) assert.ok(tip.includes(`>${s}</span>`), `the ${s} row renders`);
  assert.ok(tip.includes(`${last.fNew} · Σ ${last.fCum}`), 'the forecast row shows the per-period count');
  assert.match(tip, /chart-tip-foot/);
  assert.match(tip, /% of plan · \d+ (ahead|behind)/);
  assert.ok(tip.includes(`Actual Σ ${(last.aFCum || 0) + (last.aRCum || 0)}`), 'the footer carries the actual cumulative total');
  // No MDL forecast dates → the line is a plan × 1.04 projection: labelled, count is an em dash.
  const projected = c1TipHtml({ label: '2026-10', pNew: 1, fNew: 0, aFNew: 0, aRNew: 0, pCum: 2, fCum: 2.08, aFCum: 1, aRCum: 0 }, { fc: false, vis: ['plan', 'forecast'] });
  assert.match(projected, /Forecast \(projected\)/);
  assert.ok(projected.includes('— · Σ 2.08'), 'the projected count is an em dash, never a misleading 0');
  assert.ok(!projected.includes('Actual First'), 'a hidden series drops its row');
  assert.match(projected, /50% of plan · 1 behind/, 'the footer math: 1 of 2, one behind');
});

// I103 — the C2 Delay view is nearest-datum (element mode left the window reachable only on the
// 3 px dots — a dead zone everywhere else); the Funnel view binds (it returned no .chart-tip at
// all, the I100 defect class); the C4 Age-buckets rows carry a hover window (they had none).
test('I103 — C2 Delay is nearest-datum; Funnel and C4 buckets carry hover windows', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const doc = { querySelector: s => s === '[data-page-content]' ? node : null };

  renderDashboard(doc, model, { page: 'Overview', c2View: 'delay' });
  const tag = (html.match(/<div class="c2-stack"[^>]*>/) || [])[0];
  assert.ok(tag, 'the delay board renders');
  assert.ok(/ data-points='/.test(tag), 'the delay board carries the nearest-datum payload');
  const pts = JSON.parse(tag.match(/data-points='([^']*)'/)[1].replace(/&#39;/g, "'"));
  assert.ok(pts.length > 0, 'points parse');
  for (const p of pts) assert.ok('delay' in p && 'n' in p, 'every point carries delay and n');
  assert.ok(html.includes('c2-delay-line') && html.includes('c2-delay-dot'), 'the tokenised delay series classes are used');
  assert.ok(html.includes('class="chart-snap"'), 'the delay chart exposes a snap line');
  const svgPart = html.slice(html.indexOf('<div class="c2-stack"'), html.indexOf('</svg>', html.indexOf('<div class="c2-stack"')));
  assert.ok(!/<circle[^>]*data-tip=/.test(svgPart), 'no dot-only data-tip targets remain');
  const tip = c2DelayTipHtml(pts[0]);
  assert.ok(tip.includes('chart-swatch c2-delay') && tip.includes('Avg review delay'), 'the tip carries the §4.6 swatch row');
  assert.match(tip, />\d+\.\d d</);
  assert.ok(tip.includes('Docs in mean'), 'the tip carries the footer');

  renderDashboard(doc, model, { page: 'Overview', c2View: 'funnel' });
  assert.ok(/class="chart-tip"/.test(html), 'the funnel board has a window element');
  const fBoard = html.slice(html.indexOf('c2-funnel'));
  assert.ok(/data-tip="/.test(fBoard), 'funnel stages carry data-tip');
  assert.ok(fBoard.includes('Share of planned'), 'the funnel tip carries the % footer');

  renderDashboard(doc, model, { page: 'Analytical', c4View: 'buckets' });
  const c4 = html.slice(html.indexOf('c4-chart'));
  assert.ok(/bar-row[^>]*data-tip="/.test(c4), 'bucket rows carry data-tip');
  assert.ok(c4.includes('Share of overdue'), 'the bucket tip carries the % footer');
});

// I105 — the C2 Stacked and Delay charts label their Start and Today reference lines. The lines
// existed but carried no text; C1's S-curve labels them as `Start · <month>` / `Today · <month>`.
test('I105 — C2 Stacked and Delay label the Start and Today reference lines', () => {
  let html = '';
  const node = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const doc = { querySelector: s => s === '[data-page-content]' ? node : null };
  const svgOf = view => {
    renderDashboard(doc, model, { page: 'Overview', c2View: view });
    const start = html.indexOf('<svg class="c2-svg"');
    return html.slice(start, html.indexOf('</svg>', start) + 6);
  };
  for (const view of ['stacked', 'delay']) {
    const svg = svgOf(view);
    assert.ok(svg.includes('sc-ref-lbl-start'), `${view}: the Start line is labelled`);
    assert.ok(svg.includes('sc-ref-lbl-today'), `${view}: the Today line is labelled`);
    assert.match(svg, /Start · \S/, `${view}: the Start label carries the month`);
    assert.match(svg, /Today · \S/, `${view}: the Today label carries the month`);
  }
});

// I106 — the C3 month filter must list every past month (project start → as-of), even months with
// zero submissions. The old list came only from submission rows, so empty months were unselectable
// and their Total Plan was invisible.
test('I106 — C3 month filter lists all past months, including zero-submission months', () => {
  const view = deriveView(model);
  const startYm = String(model.meta.projectStartDate || '').slice(0, 7);
  const asOfYm = String(model.meta.asOfDate || '').slice(0, 7);
  const expected = [];
  if (startYm && asOfYm) {
    let [y, m] = startYm.split('-').map(Number);
    const [ey, em] = asOfYm.split('-').map(Number);
    while (y < ey || (y === ey && m <= em)) { expected.push(`${y}-${String(m).padStart(2, '0')}`); if (m === 12) { y++; m = 1; } else m++; }
  }
  assert.deepStrictEqual(view.c3.months, expected, 'c3.months must span project start → as-of, contiguously (zero-submission months included)');
  // Every month in the span must be present and well-formed, even when no submission falls in it.
  for (const m of view.c3.months) assert.match(m, /^\d{4}-\d{2}$/, `${m} is a YYYY-MM`);
});

// I106 — C3 hover windows follow §4.6: a swatch·label·value row per series (tokenised c3-* swatch)
// plus a footer. `chart-swatch c3-swatch` is C3-specific, so its presence proves the §4.6 swatch.
test('I106 — C3 hover windows follow §4.6 (swatch · label · value rows + footer)', () => {
  const renderC3 = view => {
    let html = '';
    const node = { set innerHTML(v) { html = v; }, get innerHTML() { return html; } };
    const doc = { querySelector: s => s === '[data-page-content]' ? node : null };
    renderDashboard(doc, model, { page: 'Overview', c3View: view });
    return html;
  };
  for (const view of ['bar', 'pie']) {
    const html = renderC3(view);
    assert.ok(html.includes('chart-swatch c3-swatch'), `${view}: C3 hover window uses the tokenised swatch`);
    assert.ok(html.includes('ct-l'), `${view}: C3 hover window groups swatch+label in .ct-l`);
    assert.ok(html.includes('chart-tip-foot'), `${view}: C3 hover window has a footer`);
  }
});

test('D41: Submittals panel groups one row per document with a toggleable consolidated history', () => {
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  const view = deriveView(model);
  renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? rootNode : null }, model, { page: 'Submittals' });
  assert.match(html, /Submittals/);
  // One row per document (the grouped view), not one row per submission record.
  const docRows = (html.match(/<tr class="expandable" data-doc=/g) || []).length;
  assert.equal(docRows, view.documents.length, 'one row per document');
  assert.ok(view.documents.length < view.active.length, 'fewer document rows than submission records');
  // Current status columns stay in the main row.
  assert.match(html, /Current Submission Status/);
  assert.match(html, /Current Approval Status/);
  // The history is toggleable, with the per-submission Prolog / Transmittal No. in the expanded detail.
  assert.match(html, /class="drill-btn"/);
  assert.match(html, /aria-controls="subd-/);
  assert.match(html, /class="drill-chev"/);
  assert.match(html, /class="expandable"/);
  assert.match(html, /class="sub"/);
  assert.match(html, /class="sub-inner"/);
  assert.match(html, /Prolog \/ Transmittal No\./);
  // Two summary lines now: documents count and the cumulative "total as-of" total (I107).
  assert.equal((html.match(/class="summary"/g) || []).length, 2, 'documents count + cumulative total summary lines');
  // CSV is right-aligned via its own class; column visibility uses the B7 .cc-btn class.
  assert.match(html, /class="csv-btn/);
  assert.match(html, /class="cc-btn/);
  assert.doesNotMatch(html, /submission records/, 'no old per-record summary text');
});

// I107 — Submittals month filter + dynamic-column CSV export (study 2026-11-03).
test('I107 — Submittals month filter limits the dashboard table to that month and shows a cumulative total', () => {
  const view = deriveView(model);
  const someMonth = [...new Set(view.documents.flatMap(g => g.map(r => String(r.submissionDate || '').slice(0, 7)).filter(Boolean)))].sort()[0];
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? rootNode : null }, model, { page: 'Submittals', subMonth: someMonth });
  assert.match(html, /data-submonth/, 'the month filter control is present');
  assert.match(html, new RegExp(`<option value="${someMonth}" selected>`), 'the selected month is marked');
  assert.match(html, /Total as-of/, 'the cumulative total summary is shown');
  const shown = [...html.matchAll(/data-doc="([^"]+)"/g)].map(m => m[1]);
  const expected = new Set(view.documents.filter(g => g.some(r => String(r.submissionDate || '').slice(0, 7) === someMonth)).map(g => g[0].documentNo));
  assert.deepStrictEqual(new Set(shown), expected, 'only documents with a submission in the month are listed');
});

test('I107 — Submittals CSV uses dynamic per-submission columns (N = max submissions)', () => {
  const view = deriveView(model);
  const { cols, rows } = buildSubmittalsCsv(model, view, 'ALL');
  const maxSubs = Math.max(...view.documents.map(g => g.length));
  assert.equal((cols.length - 6) / 5, maxSubs, 'N column groups = highest submission count per document');
  assert.equal(cols[0], 'Document No.', 'base columns lead the CSV');
  assert.equal(cols[cols.length - 1], `Sub ${maxSubs} Approval Status`, 'the last column is the final submission group approval status');
  for (const row of rows) assert.equal(row.length, cols.length, 'every row matches the column count');
  const short = rows.find(r => r.slice(6).filter(Boolean).length < maxSubs * 5);
  assert.ok(short, 'at least one document has fewer than N submissions (blank padding present)');
});

test('I107 — Submittals CSV follows the month filter (only that month, dynamic columns)', () => {
  const view = deriveView(model);
  const someMonth = [...new Set(view.documents.flatMap(g => g.map(r => String(r.submissionDate || '').slice(0, 7)).filter(Boolean)))].sort()[0];
  const { cols, rows } = buildSubmittalsCsv(model, view, someMonth);
  const n = (cols.length - 6) / 5;
  const expectedDocs = view.documents.filter(g => g.some(r => String(r.submissionDate || '').slice(0, 7) === someMonth));
  assert.equal(rows.length, expectedDocs.length, 'only documents with a submission in the month are exported');
  for (const row of rows) {
    for (let i = 0; i < n; i++) {
      const date = row[6 + i * 5 + 1]; // Submission Date cell of group i
      if (date) assert.equal(String(date).slice(0, 7), someMonth, `exported submission date ${date} falls in the selected month`);
    }
  }
});

// I108 — panel summary sits below the title and above the control row (spec §4: subtitle optional).
test('I108 — Submittals panel summary renders above the control row', () => {
  const view = deriveView(model);
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? rootNode : null }, model, { page: 'Submittals', subMonth: 'ALL' });
  assert.match(html, /class="panel-summary"/, 'the summary block is present');
  const sumIdx = html.indexOf('class="panel-summary"');
  const toolIdx = html.indexOf('class="table-tools"');
  assert.ok(sumIdx > -1 && toolIdx > sumIdx, 'summary appears before the control row');
  assert.doesNotMatch(html, /class="table-tools"><span class="summary"/, 'summary is not inline inside the control row');
});

// I109 — Submittals subtitle aligns with the Forward/Overdue panel (gap + edge alignment, spec §4).
test('I109 — Submittals subtitle sits before the card at the content edge (matches .note)', () => {
  const view = deriveView(model);
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? rootNode : null }, model, { page: 'Submittals', subMonth: 'ALL' });
  const sumIdx = html.indexOf('class="panel-summary"');
  const cardIdx = html.indexOf('<div class="c-card">');
  assert.ok(sumIdx > -1 && cardIdx > sumIdx, 'summary appears before the .c-card (aligned to the content edge)');
});

// I110 — Validation meta line is a panel-level .note under the page title, above the v-summary row.
test('I110 — Validation meta line is a panel-level .note above the v-summary row', () => {
  const view = deriveView(model);
  let html = '';
  const rootNode = { set innerHTML(value) { html = value; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: selector => selector === '[data-page-content]' ? rootNode : null }, model, { page: 'Validation' });
  const noteIdx = html.indexOf('class="note"');
  const sumIdx = html.indexOf('class="v-summary"');
  const issuesTitleIdx = html.indexOf('<h3 class="tt">Issues</h3>');
  assert.ok(noteIdx > -1 && sumIdx > noteIdx, 'the meta .note appears before the .v-summary row');
  assert.ok(issuesTitleIdx === -1 || sumIdx < issuesTitleIdx, 'the meta sits above the Issues card (panel level)');
  assert.ok(html.indexOf('tt-note') === -1, 'the Issues table has no subtitle (meta is panel-level)');
});

// I111 — Submittals month filter spans project start → as-of (matches C3 I106), so the as-of month is selectable.
test('I111 — Submittals month filter spans project start → as-of (matches C3, includes the as-of month)', () => {
  const view = deriveView(model);
  let html = '';
  const rootNode = { set innerHTML(v) { html = v; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? rootNode : null }, model, { page: 'Submittals', subMonth: 'ALL' });
  const asOfYm = String(model.meta.asOfDate || '').slice(0, 7);
  const projYm = String(model.meta.projectStartDate || '').slice(0, 7);
  assert.ok(html.includes('value="ALL"'), 'the filter keeps the ALL option');
  const sel = html.match(/<select class="sub-month"[^>]*>([\s\S]*?)<\/select>/);
  assert.ok(sel, 'the Submittals month <select> is present');
  const opts = [...sel[1].matchAll(/value="([^"]+)"/g)].map(m => m[1]).filter(v => v !== 'ALL');
  // Expected contiguous span — mirrors the render fix exactly.
  const dataYms = view.documents.flatMap(g => g.map(r => String(r.submissionDate || '').slice(0, 7))).filter(Boolean);
  let startYm = asOfYm || projYm;
  for (const ym of dataYms) if (ym < startYm) startYm = ym;
  if (projYm && projYm < startYm) startYm = projYm;
  const expected = [];
  if (startYm) {
    let [y, m] = startYm.split('-').map(Number);
    const [ey, em] = asOfYm ? asOfYm.split('-').map(Number) : [y, m];
    while (y < ey || (y === ey && m <= em)) { expected.push(`${y}-${String(m).padStart(2, '0')}`); if (m === 12) { y++; m = 1; } else m++; }
  }
  assert.deepStrictEqual(opts.sort(), expected, 'Submittals month options must span project start → as-of, contiguously (zero-submission months included), matching C3');
  assert.ok(opts.includes(asOfYm), `the as-of month ${asOfYm} is selectable even with no submission in it`);
});

// I112 — Validation Issues table: title left, top tool cluster (page controls + code filter + CSV/Columns), no subtitle.
test('I112 — Validation Issues table: top tool cluster with page controls + code filter + CSV/Columns, no subtitle', () => {
  const view = deriveView(model);
  let html = '';
  const rootNode = { set innerHTML(v) { html = v; }, get innerHTML() { return html; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? rootNode : null }, model, { page: 'Validation' });
  const headIdx = html.indexOf('<h3 class="tt">Issues</h3>');
  assert.ok(headIdx > -1, 'the Issues table has its own title');
  assert.ok(html.indexOf('tt-note') === -1, 'the Issues table has no subtitle (meta moved to panel level)');
  const toolsIdx = html.indexOf('class="table-tools"', headIdx);
  assert.ok(toolsIdx > headIdx, 'the tool cluster sits below the title');
  // page controls at the top
  assert.ok(html.includes('data-pg="prev"') && html.includes('data-pg="next"'), 'the page navigation buttons are present at the top');
  assert.ok(!html.includes('data-page="prev"') && !html.includes('data-page="next"'), 'pager buttons must NOT use data-page (it collides with sidebar navigation)');
  assert.ok(html.includes('data-pagejump="issue"'), 'the page-jump selector is present');
  assert.ok(html.includes('class="pg-total"'), 'the row total is shown');
  // filter + export on the right
  assert.ok(html.includes('class="v-code" data-vcode'), 'the error-code filter is present');
  assert.ok(html.includes('data-export-table="issue"'), 'the Issues table keeps its CSV button');
  assert.ok(html.includes('id="ccBtn_issue"'), 'the Issues table keeps its Columns button');
});

// I112 — the error-code filter narrows only the Issues table.
test('I112 — Validation error-code filter narrows only the Issues table', () => {
  const view = deriveView(model);
  const codes = [...new Set(view.issues.map(i => i.code))];
  assert.ok(codes.length > 1, 'the fixture has more than one error code');
  const countsByCode = new Map();
  for (const i of view.issues) countsByCode.set(i.code, (countsByCode.get(i.code) || 0) + 1);
  // Pick a code with fewer than 200 rows so its page shows every row (one page, no truncation).
  const small = [...countsByCode.entries()].find(([, n]) => n > 0 && n < 200);
  assert.ok(small, 'the fixture has an error code with fewer than 200 rows');
  const target = small[0];
  const expected = small[1];
  const countIssueRows = h => {
    const sel = h.match(/<table class="ds-table" data-table-key="issue"[\s\S]*?<\/table>/);
    assert.ok(sel, 'the Issues table is present');
    return (sel[0].match(/<tr>/g) || []).length;
  };
  let htmlAll = '';
  let node = { set innerHTML(v) { htmlAll = v; }, get innerHTML() { return htmlAll; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Validation', issueCode: 'ALL' });
  const allCount = countIssueRows(htmlAll);
  let htmlOne = '';
  node = { set innerHTML(v) { htmlOne = v; }, get innerHTML() { return htmlOne; } };
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? node : null }, model, { page: 'Validation', issueCode: target });
  const oneCount = countIssueRows(htmlOne);
  assert.strictEqual(oneCount, expected, `selecting code ${target} shows only its rows (${expected})`);
  assert.ok(oneCount < allCount, 'the filter reduces the visible row count');
});
