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
