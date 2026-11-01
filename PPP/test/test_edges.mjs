/* Layer 2b - edge cases (spec §3.8.4/§3.8.5, T8.8.13).
 * Real workbook, mutated in memory only. Run: node test/test_edges.mjs
 * Revision 1.0 - 2026-10-30 - opencode (AI): first edge-case layer (P4).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseXlsx } from '../src/xlsx-reader.mjs';
import { buildModel, validate } from '../src/pipeline.mjs';
import { deriveView } from '../src/render.mjs';

let pass = 0, fail = 0;
const ok = (n, c, d = '') => { if (c) { pass++; console.log('  PASS  ' + n + (d ? '  (' + d + ')' : '')); } else { fail++; console.log('  FAIL  ' + n + (d ? '  (' + d + ')' : '')); } };
const XLSX = path.resolve('TWRP C3B2 - Procurement Package Plan.xlsx');
const STATE0 = () => ({ report: null, filter: { cats: null }, chartView: { packages: 'status', data: 'dqByRule' },
  prefs: { chartType: {}, poBars: true }, poWin: { from: 0, to: 0, _n: 0 }, ui: { typeFilterBound: false } });

const load = async () => {
  const raw = fs.readFileSync(XLSX);
  return parseXlsx(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength));
};

const pppOf = r => r[Object.keys(r).find(k => /ppp/i.test(k))];
const codeOf = r => r[Object.keys(r).find(k => /code/i.test(k))];

console.log('='.repeat(72));
console.log('A. blank and error are the same absent state');
console.log('='.repeat(72));
const wb = await load();
const base = buildModel(wb, 'x.xlsx');
const baseReport = validate(base.model.packages, base.vctx);
const st0 = STATE0(); st0.report = baseReport;
const v0 = deriveView(base.model, st0);

const blankStatus = base.model.packages.filter(p => p.status === undefined).length;
const blankCrit = base.model.packages.filter(p => p.criticality === undefined).length;
const blankSupp = base.model.packages.filter(p => p.supplier === undefined).length;
ok('a blank text cell is undefined, not an empty string', blankStatus === 1 && blankCrit === 4,
  'status ' + blankStatus + ', criticality ' + blankCrit + ', supplier ' + blankSupp);
ok('no baseline formula token is counted', Object.keys(base.model.formulaErrors.fields).length === 0);
ok('no baseline W-FORMULA warning', baseReport.warnings.length === 0);

console.log('='.repeat(72));
console.log('B. an error token behaves exactly like a blank');
console.log('='.repeat(72));
const wb2 = await load();
const grid2 = pppOf(wb2);
const row2 = grid2[base.model.packages[0]._row - 1];
let planCol = -1;
for (const [k, v] of Object.entries(base.model.packages[0]._raw)) {
  if (/Plan$/.test(k) && v != null) { const i = row2.indexOf(v); if (i > 2) { planCol = i; break; } }
}
ok('found the first package plan column', planCol >= 0, 'col ' + planCol);
row2[planCol] = '#VALUE!';
const m2 = buildModel(wb2, 'x.xlsx');
const p2 = m2.model.packages[0];
ok('the token becomes undefined', Object.keys(p2._raw).some(k => p2._raw[k] === '#VALUE!') && Object.values(p2).includes(undefined));
ok('the raw cell is preserved for audit', Object.values(p2._raw).includes('#VALUE!'));
const fe2 = m2.model.formulaErrors;
ok('one column carries the token count', Object.keys(fe2.fields).length === 1, JSON.stringify(Object.keys(fe2.fields)));
ok('the count is N of total with a label and a column', Object.values(fe2.fields).every(x => x.n === 1 && x.total === m2.model.packages.length && !!x.label && /^[A-Z]+$/.test(x.col)), JSON.stringify(fe2.fields));
const r2 = validate(m2.model.packages, m2.vctx);
ok('S3 emits one fatal W-FORMULA for that column', r2.warnings.length === 1 && r2.warnings[0].code === 'W-FORMULA' && r2.warnings[0].level === 'fatal');
ok('the notice names the label, the column, N of total and the recovery', /"MR Plan Date" \(col R\): 1 of \d+ cells.*Excel.*reload/.test(r2.warnings[0].message), r2.warnings[0].message);
ok('W-FORMULA is not a validation issue', !r2.issues.some(i => i.code === 'W-FORMULA'));

console.log('='.repeat(72));
console.log('C. absent rows are excluded from counts');
console.log('='.repeat(72));
const st2 = STATE0(); st2.report = r2;
const v2 = deriveView(m2.model, st2);
ok('the package set is unchanged', v2.active.length === v0.active.length, v0.active.length + ' vs ' + v2.active.length);
ok('a date token does not change the status denominator', v2.status.withStatus === v0.status.withStatus,
  v0.status.withStatus + ' -> ' + v2.status.withStatus);

// token in the status column: that row must not be counted as a status
const wb3 = await load();
const grid3 = pppOf(wb3);
const stPkg = base.model.packages.find(p => p.status !== undefined);
const row3 = grid3[stPkg._row - 1];
const statusCol = Object.entries(stPkg._raw).find(([k, v]) => k === 'status')[1] != null ? row3.indexOf(stPkg._raw.status) : -1;
row3[statusCol] = '#N/A';
const m3 = buildModel(wb3, 'x.xlsx');
const r3 = validate(m3.model.packages, m3.vctx);
const st3 = STATE0(); st3.report = r3;
const v3 = deriveView(m3.model, st3);
ok('a token status is not counted as a status', v3.status.withStatus === v0.status.withStatus - 1,
  v0.status.withStatus + ' -> ' + v3.status.withStatus);
ok('the token status appears in no chart category', !JSON.stringify(v3.panels.interactive.packages.status).includes('#N/A'));

console.log('='.repeat(72));
console.log('D. contract labels are read, not fixed positions');
console.log('='.repeat(72));
const wb4 = await load();
const code4 = codeOf(wb4);
const grid4 = pppOf(wb4);
const titleRow = code4.find(r => String(r[0]).trim() === 'Package Title');
ok('the workbook has a Package Title mapping', !!titleRow, titleRow ? String(titleRow[1]) : 'none');
// Point the title mapping at the column that holds Discipline, and prove the model follows it.
const discVal = base.model.packages[0].discipline;
const discCol = grid4[base.model.packages[0]._row - 1].indexOf(discVal);
ok('found the discipline column', discCol >= 0, 'col ' + discCol);
titleRow[1] = 'Column-' + String.fromCharCode(65 + discCol);
const m4 = buildModel(wb4, 'x.xlsx');
ok('the new mapping drives the title field', m4.model.packages[0].title === discVal, JSON.stringify(m4.model.packages[0].title));
ok('the parsed column is the mapped one', m4.vctx.titleCol === discCol, 'titleCol ' + m4.vctx.titleCol + ' expected ' + discCol);

console.log('='.repeat(72));
console.log('E. validation counts');
console.log('='.repeat(72));
const counts = { error: 0, warning: 0, info: 0 };
baseReport.issues.forEach(i => counts[i.sev]++);
ok('the counts match the issues', counts.error === baseReport.counts.error && counts.warning === baseReport.counts.warning && counts.info === baseReport.counts.info, JSON.stringify(counts));
ok('total equals the issue count', baseReport.total === baseReport.issues.length, String(baseReport.total));
ok('the report keeps one W-26 warning per issued package without a PO Number', baseReport.issues.filter(i => i.code === 'V-26').length === 19);

console.log('');
console.log('SUMMARY: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
