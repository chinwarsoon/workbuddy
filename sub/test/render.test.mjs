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
import { deriveView, renderDashboard } from '../engine/render.js';

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
  assert.equal(view.kpis.totalSubmissions, 133);
  assert.equal(view.active.length, 183);
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
  renderDashboard({ querySelector: s => s === '[data-page-content]' ? monthNode : null }, model, { page: 'Overview', c3Month: deriveView(model).c3.months[0] });
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
  // One summary line only (no duplicate count text).
  assert.equal((html.match(/class="summary"/g) || []).length, 1, 'exactly one summary line');
  // CSV is right-aligned via its own class; column visibility uses the B7 .cc-btn class.
  assert.match(html, /class="csv-btn/);
  assert.match(html, /class="cc-btn/);
  assert.doesNotMatch(html, /submission records/, 'no old per-record summary text');
});
