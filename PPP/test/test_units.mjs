/* Layer 1 - unit tests for the pure helpers (spec §3.8.5, T8.8.12).
 * No DOM, no workbook. Run: node test/test_units.mjs
 * Revision 1.0 - 2026-10-30 - opencode (AI): first unit layer (P4).
 */
import { isExcelError, isAbsent, EXCEL_ERROR_TOKENS, toDate, fmt, colRefToIndex,
         parseCodeSheet, buildFieldToCol, findLookupColumns, CODE_SHEET_KEYS } from '../src/pipeline.mjs';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => {
  if (cond) { pass++; console.log('  PASS  ' + name + (detail ? '  (' + detail + ')' : '')); }
  else { fail++; console.log('  FAIL  ' + name + (detail ? '  (' + detail + ')' : '')); }
};

console.log('='.repeat(72));
console.log('isExcelError / isAbsent');
console.log('='.repeat(72));
ok('ten tokens are defined', EXCEL_ERROR_TOKENS.length === 10, EXCEL_ERROR_TOKENS.join(' '));
for (const t of EXCEL_ERROR_TOKENS) {
  ok('token ' + t + ' matches (case and space insensitive)', isExcelError(t) && isExcelError(' ' + t.toLowerCase() + ' '));
}
ok('a near-token is rejected', !isExcelError('#REFX!'));
ok('a plain string is rejected', !isExcelError('N/A'));
ok('empty string is not a token', !isExcelError(''));
ok('null / number / Date are not tokens', !isExcelError(null) && !isExcelError(42) && !isExcelError(new Date()));
ok('isAbsent: null, undefined, blank and token', [null, undefined, '', '   ', '#div/0!'].every(isAbsent));
ok('isAbsent: real values are present', !isAbsent('x') && !isAbsent(0) && !isAbsent(false));

console.log('='.repeat(72));
console.log('toDate');
console.log('='.repeat(72));
const d1 = toDate('2026-03-19');
ok('ISO text takes the written day', !!d1 && d1.getFullYear() === 2026 && d1.getMonth() === 2 && d1.getDate() === 19, String(d1));
const d2 = toDate('2026-03-19T23:30:00Z');
ok('ISO text with a zone keeps the written day', !!d2 && d2.getDate() === 19, String(d2));
const d3 = toDate(46000);
ok('Excel serial converts (epoch 1899-12-30)', !!d3 && d3.getFullYear() === 2025 && d3.getMonth() === 11 && d3.getDate() === 9, String(d3));
const d4 = toDate('46000');
ok('serial stored as text converts the same way', !!d4 && d4.getTime() === d3.getTime());
const d5 = toDate(new Date(2026, 4, 7, 15, 30));
ok('Date normalises to local midnight', d5.getHours() === 0 && d5.getMinutes() === 0 && d5.getDate() === 7);
ok('blank, token and garbage return null', toDate('') === null && toDate('#REF!') === null && toDate('not a date') === null);

console.log('='.repeat(72));
console.log('colRefToIndex / fmt');
console.log('='.repeat(72));
ok('A -> 0', colRefToIndex('Column-A') === 0);
ok('M -> 12', colRefToIndex('Column-M') === 12);
ok('AA -> 26', colRefToIndex('column-AA') === 26);
ok('bad refs -> -1', colRefToIndex('M') === -1 && colRefToIndex('') === -1 && colRefToIndex(null) === -1);
ok('fmt renders an en-GB date', fmt(new Date(2026, 9, 30)) === '30 Oct 2026', fmt(new Date(2026, 9, 30)));
ok('fmt renders a dash for a non-date', fmt('2026-10-30') === '—' && fmt(null) === '—');

console.log('='.repeat(72));
console.log('contract parsing (labels, not fixed positions)');
console.log('='.repeat(72));
const grid = [
  ['', '', '', '', 'Discipline Description', '', '', '', '', '', 'Package Status'],
  ['Package Title', 'Column-D', 'Text'],
  ['Package No.', 'Column-B', 'Text'],
  ['PO Plan Date', 'Column-R', 'Date'],
];
const { meta, metaTypes } = parseCodeSheet(grid);
ok('labels are read from column A', meta['Package Title'] === 'Column-D' && meta['Package No.'] === 'Column-B');
ok('data types are read from column C', metaTypes['Package Title'] === 'Text' && metaTypes['PO Plan Date'] === 'Date', JSON.stringify(metaTypes));
const f2c = buildFieldToCol(meta);
ok('buildFieldToCol maps title -> D', f2c.title === 3, String(f2c.title));
ok('buildFieldToCol maps packageNo -> B', f2c.packageNo === 1, String(f2c.packageNo));
ok('buildFieldToCol maps poPlan -> R', f2c.poPlan === 17, String(f2c.poPlan));
ok('labels come from the contract keys', CODE_SHEET_KEYS.title === 'Package Title' && CODE_SHEET_KEYS.poPlan === 'PO Plan Date');
const lk = findLookupColumns(grid);
ok('lookup blocks are located by row-1 title', lk.src.discipline === 'E' && lk.src.status === 'K', JSON.stringify(lk.src));
const renamed = grid.map(r => r.slice());
renamed[0][4] = 'Discipline Description (rev 2)';
ok('a renamed lookup title still resolves by prefix', findLookupColumns(renamed).src.discipline === 'E');

console.log('');
console.log('SUMMARY: ' + pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
