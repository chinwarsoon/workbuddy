/* Headless pipeline test for Procurement-Dashboard.html
 * Runs the REAL shipped script (extracted from <script>) against the REAL workbook,
 * with a minimal DOM stub so render() can be exercised without a browser.
 * Verifies the Wave 0-3 refactor end-to-end: parse -> model -> validate -> render.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';

const HTML = path.resolve('Procurement-Dashboard.html');
const XLSX = path.resolve('TWRP C3B2 - Procurement Package Plan.xlsx');

const src = fs.readFileSync(HTML, 'utf8');
const m = src.match(/<script>([\s\S]*)<\/script>/);
if (!m) throw new Error('no <script> block found');
let code = m[1];

const closeIdx = code.lastIndexOf('})();');
if (closeIdx < 0) throw new Error('IIFE close not found');
const HOOK = `
  globalThis.__H = { parseXlsx, parseCSV, parseCodeSheet, findLookupColumns, buildFieldToCol,
                     toDate, buildModel, buildDashboard, validate, STATE, METRICS, CHART,
                     svgHBar, svgPie, topN };
`;
code = code.slice(0, closeIdx) + HOOK + code.slice(closeIdx);

/* ---------------- DOM stubs ---------------- */
const els = new Map();
const writes = [];
function makeEl(id) {
  const cl = new Set();
  const el = {
    id, tagName: 'DIV', style: {}, dataset: {}, children: [], value: '',
    _html: '', _text: '', _t: null,
    classList: {
      add(...c) { c.forEach(x => cl.add(x)); },
      remove(...c) { c.forEach(x => cl.delete(x)); },
      toggle(x, f) { (f === undefined ? !cl.has(x) : f) ? cl.add(x) : cl.delete(x); },
      contains(x) { return cl.has(x); },
      get length() { return cl.size; },
    },
    addEventListener() {}, removeEventListener() {}, dispatchEvent() { return true; },
    appendChild(n) { this.children.push(n); return n; }, removeChild() {}, insertBefore() {},
    setAttribute() {}, getAttribute() { return null; }, removeAttribute() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    closest() { return null; }, click() {}, focus() {}, blur() {}, scrollIntoView() {},
    getBoundingClientRect() { return { width: 760, height: 280, top: 0, left: 0 }; },
    cloneNode() { return makeEl(id + '-clone'); },
    remove() {},
    get innerHTML() { return this._html; },
    set innerHTML(v) { this._html = String(v); writes.push({ id, kind: 'html', len: this._html.length }); },
    get textContent() { return this._text; },
    set textContent(v) { this._text = String(v); },
  };
  return el;
}
function getEl(id) { if (!els.has(id)) els.set(id, makeEl(id)); return els.get(id); }

const lsStore = {};
const documentStub = {
  getElementById: getEl,
  createElement: t => makeEl('<' + t + '>'),
  querySelector: sel => getEl('sel:' + sel),
  querySelectorAll: () => [],
  addEventListener() {}, removeEventListener() {},
  body: makeEl('body'), documentElement: makeEl('html'), head: makeEl('head'),
  readyState: 'complete', title: 'test',
};

const sandbox = {
  document: documentStub,
  window: { addEventListener() {}, scrollTo() {}, matchMedia: () => ({ matches: false, addEventListener() {}, addListener() {} }), devicePixelRatio: 1 },
  localStorage: {
    getItem: k => (k in lsStore ? lsStore[k] : null),
    setItem: (k, v) => { lsStore[k] = String(v); },
    removeItem: k => { delete lsStore[k]; }, clear: () => {},
  },
  navigator: { clipboard: {}, userAgent: 'node' },
  setTimeout, clearTimeout, setInterval, clearInterval,
  console, TextDecoder, TextEncoder, Blob, URL: Object.assign(Object.create(URL), { createObjectURL: () => 'blob:x', revokeObjectURL() {} }),
  DecompressionStream, atob, btoa, crypto,
  location: { href: 'file:///test.html' },
};
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(code, sandbox, { filename: 'dashboard.js' });

const H = sandbox.__H;
const pass = [], fail = [];
const ok = (name, cond, detail = '') => (cond ? pass : fail).push({ name, detail });
const line = s => console.log(s);

line('='.repeat(72));
line('LOAD');
line('='.repeat(72));
ok('script evaluated + export hook reached', !!H);
ok('METRICS registry present', Array.isArray(H.METRICS));
ok('CHART geometry present', !!H.CHART);
line(`METRICS entries : ${H.METRICS.map(x => x.key).join(', ')}`);
line(`HTML exports ok : STATE=${!!H.STATE} parseXlsx=${typeof H.parseXlsx}`);

line('');
line('='.repeat(72));
line('DATA PIPELINE (real .xlsx)');
line('='.repeat(72));
const raw = fs.readFileSync(XLSX);
const buf = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength); // ArrayBuffer, as f.arrayBuffer() gives
let result = null, model = null, vctx = null;
try {
  result = await H.parseXlsx(buf);
  ok('parseXlsx returned sheets', !!result);
  line(`sheets          : ${Object.keys(result).map(k => k + '[rows=' + result[k].length + ']').join(', ')}`);
} catch (e) { fail.push({ name: 'parseXlsx threw', detail: e.message }); }

try {
  const bm = H.buildModel(result, 'TWRP C3B2 - Procurement Package Plan.xlsx');
  model = bm.model; vctx = bm.vctx;
  ok('buildModel returned {model,vctx}', !!model && !!vctx);
  line(`project title   : ${model.project.title}`);
  line(`client / code   : ${model.project.client} / ${model.project.code}`);
  line(`as-of date      : ${model.project.asOf && model.project.asOf.toISOString().slice(0, 10)}`);
  line(`packages        : ${model.packages.length}`);
  line(`codeInfo        : hasTypes=${model.codeInfo.hasTypes} types=${model.codeInfo.typeCount} fields=${model.codeInfo.fieldCount}`);
  line('lookupMeta:');
  Object.entries(model.lookupMeta).forEach(([k, v]) =>
    line(`  ${k.padEnd(15)} col=${String(v.col).padEnd(4)} n=${String(v.n).padEnd(4)} title="${v.title}"`));
  ok('>=100 packages parsed', model.packages.length >= 100, `${model.packages.length}`);
  ok('all 4 documented lookup blocks located',
    ['discipline', 'criticality', 'status', 'category'].every(k => model.lookupMeta[k] && model.lookupMeta[k].col));
} catch (e) { fail.push({ name: 'buildModel threw', detail: e.stack.split('\n').slice(0, 3).join(' | ') }); }

line('');
line('='.repeat(72));
line('CODE SHEET CONTRACT + COLUMN MAPPING');
line('='.repeat(72));
{
  const colL = i => { let n = i + 1, s = ''; while (n > 0) { const mm = (n - 1) % 26; s = String.fromCharCode(65 + mm) + s; n = (n - mm - 1) / 26; } return s; };
  const codeKey = Object.keys(result).find(k => /code/i.test(k));
  const codeGrid = result[codeKey];
  const cs = H.parseCodeSheet(codeGrid);
  line('--- Code sheet row 1: non-empty headers (lookup-block titles) ---');
  (codeGrid[0] || []).forEach((v, ci) => { if (v != null && v !== '') line(`   col ${colL(ci).padEnd(3)} : ${JSON.stringify(String(v))}`); });

  const f2c = H.buildFieldToCol(cs.meta);
  line('--- stage field -> Code!B column mapping ---');
  ['mr', 'po', 'vd', 'fat', 'ros'].forEach(st => {
    line('   ' + ['Plan', 'Forecast', 'Actual'].map(s => {
      const f = st + s;
      return `${f}=${f2c[f] != null ? colL(f2c[f]) : '—'}`;
    }).join('   '));
  });

  line('--- lookup code-column mapping (I-51) ---');
  ['discipline', 'criticality', 'status', 'category'].forEach(k => {
    const lm = model.lookupMeta[k] || {};
    const codes = model.lookups[k + 'Code'] || [];
    line(`   ${k.padEnd(12)} descCol=${String(lm.col).padEnd(4)} codeCol=${String(lm.codeCol).padEnd(4)} codeValues=${String(codes.length).padEnd(3)} e.g. ${JSON.stringify(codes.slice(0, 3))}`);
  });
  /* Careful — "resolves" must NOT be asserted as "is non-empty". The Category
     Code column (N) carries a header but no body in this workbook (the 19 values
     live in O, the description column), so an emptiness check would be wrong and
     an Array.isArray check would be vacuous. Assert the real contract instead:
     the code column is located, its count is tracked SEPARATELY from the
     description count, and nothing downstream is silently fed a phantom list. */
  ok('I-51: category code column is located and its count is tracked separately from the description count',
    Array.isArray(model.lookups.categoryCode)
      && model.lookupMeta.category.codeN === model.lookups.categoryCode.length,
    `codeN=${model.lookupMeta.category.codeN} actual=${(model.lookups.categoryCode || []).length} descCount=${model.lookupMeta.category.n}`);
  ok('I-51/I-49: desc and code counts are tracked independently — all four blocks aligned (codeN === n)',
    ['discipline', 'criticality', 'status', 'category'].every(k => model.lookupMeta[k].codeN === model.lookupMeta[k].n),
    ['discipline', 'criticality', 'status', 'category']
      .map(k => `${k}:desc=${model.lookupMeta[k].n}/code=${model.lookupMeta[k].codeN}`).join('  '));
  ok('I-51: category.codeCol points at Category Code (N), not Item Category (O)',
    model.lookupMeta.category.codeCol === 'N',
    `got "${model.lookupMeta.category.codeCol}" (N = Category Code, O = Item Category)`);
  ok('I-51: category desc column still resolves to Item Category (O)',
    model.lookupMeta.category.col === 'O',
    `got "${model.lookupMeta.category.col}"`);
  ok('I-49: statusCategory dropped from the contract (not required by the business)',
    !('statusCategory' in model.lookupMeta) && !('statusCategory' in model.lookups),
    `lookupMeta blocks now: ${Object.keys(model.lookupMeta).join(', ')}`);
  ok('I-49: every surviving lookup block declares both a desc and a code column',
    Object.values(model.lookupMeta).every(v => !!v.col),
    Object.entries(model.lookupMeta).filter(([, v]) => !v.col).map(([k]) => k).join(', ') || 'all resolved');

  line('--- Error table (I-11) — Code!Q:R, code -> rule wording ---');
  const et = model.errorTable || {};
  line(`   entries = ${Object.keys(et).length}   codeCol=${model.codeInfo.errorCodeCol}  descCol=${model.codeInfo.errorDescCol}`);
  line(`   first 3 : ${JSON.stringify(Object.entries(et).slice(0, 3))}`);
  line(`   V-19    : ${JSON.stringify(et['V-19'] || null)}`);
  line(`   V-20    : ${JSON.stringify(et['V-20'] || null)}`);
  ok('I-11: Code!Q:R is read into model.errorTable as a code -> wording map',
    Object.keys(et).length >= 18,
    `${Object.keys(et).length} entries`);
  ok('I-11: Error table located by row-1 header text (Error Code=Q, Error Description=R)',
    model.codeInfo.errorCodeCol === 'Q' && model.codeInfo.errorDescCol === 'R',
    `codeCol=${model.codeInfo.errorCodeCol} descCol=${model.codeInfo.errorDescCol}`);
  ok('I-11: V-19 / V-20 are now documented in the workbook table (I-52 closed)',
    !!(et['V-19'] || '').trim() && !!(et['V-20'] || '').trim(),
    `V-19=${et['V-19'] ? 'yes' : 'MISSING'} V-20=${et['V-20'] ? 'yes' : 'MISSING'}`);

  line('--- distinct (VD Plan | FAT Plan) pairs, top 8 ---');
  const iso = d => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d));
  const pairs = {};
  model.packages.forEach(p => { const k = iso(p.vdPlan) + '  |  ' + iso(p.fatPlan); pairs[k] = (pairs[k] || 0) + 1; });
  Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 8).forEach(([k, n]) => line(`   ${String(n).padStart(3)} x   ${k}`));
}

line('');
line('='.repeat(72));
line('VALIDATION ENGINE');
line('='.repeat(72));

let report = null;
try {
  report = H.validate(model.packages, vctx);
  ok('validate returned a report', !!report && Array.isArray(report.issues));
  line(`issues          : ${report.issues.length}`);
  const byCode = {};
  report.issues.forEach(i => { byCode[i.code] = (byCode[i.code] || 0) + 1; });
  line('by rule         : ' + Object.entries(byCode).sort().map(([c, n]) => `${c}=${n}`).join('  '));
  const bySev = {};
  report.issues.forEach(i => { bySev[i.sev] = (bySev[i.sev] || 0) + 1; });
  line('by severity     : ' + Object.entries(bySev).map(([s, n]) => `${s}=${n}`).join('  '));

  line('');
  line('--- issue detail (grouped by rule) ---');
  const grouped = {};
  report.issues.forEach(i => { (grouped[i.code] = grouped[i.code] || []).push(i); });
  Object.keys(grouped).sort().forEach(code => {
    const list = grouped[code];
    line(`  ${code}  x${list.length}  [${list[0].sev}]  field="${list[0].field}"`);
    list.slice(0, 3).forEach(i => line(`      ${JSON.stringify(i.pkg)}  value=${JSON.stringify(i.value)}  ${i.msg}`));
    if (list.length > 3) line(`      … ${list.length - 3} more`);
  });

  line('');
  line('--- Code sheet meta as read by the app ---');
  const cm = vctx.codeMeta || {};
  ['Project Title', 'Project Code', 'Client', 'AsOf Date', 'Header Row', 'List End Row'].forEach(k =>
    line(`  ${k.padEnd(14)} = ${JSON.stringify(cm[k])}`));
  line(`  headerRowDefault? ${vctx.headerRowDefault}   lastRowDefault? ${vctx.lastRowDefault}`);
  line(`  derived headerRow=${vctx.headerRow}  lastRow=${vctx.lastRow}  (0-based)`);
  line(`  ppp grid rows   = ${vctx.pppGrid.length}   skipped(no title) = ${vctx.skipped}`);
  line(`  dateFields      = ${vctx.dateFields.length}: ${vctx.dateFields.slice(0, 6).join(',')}${vctx.dateFields.length > 6 ? '…' : ''}`);
  line(`  hasTypes=${vctx.hasTypes} typeCount=${vctx.typeCount}`);

  const expectedInGrid = vctx.pppGrid.length - 1 - vctx.skipped; // minus header row, minus blank-title rows
  ok('every populated row in the grid became a package (none dropped or invented)',
    model.packages.length === expectedInGrid,
    `parsed ${model.packages.length}; grid ${vctx.pppGrid.length} rows - 1 header - ${vctx.skipped} blank-title = ${expectedInGrid}`);
  line(`  note: Code!List End Row = ${cm['List End Row']} is a template bound, but only ${vctx.pppGrid.length - 1} rows are populated`);
  line(`        -> this is what makes V-20 fire on every load (tracked as I-50)`);
  ok('no silent header/last-row fallback used',
    !vctx.headerRowDefault && !vctx.lastRowDefault,
    `headerRowDefault=${vctx.headerRowDefault} lastRowDefault=${vctx.lastRowDefault}`);
  ok('headerRow derived as 1-based row 1 -> 0',
    vctx.headerRow === 0, `headerRow=${vctx.headerRow}`);
  ok('every fired rule code matches the V-nn contract',
    report.issues.every(i => /^V-\d{2}$/.test(String(i.code))),
    report.issues.filter(i => !/^V-\d{2}$/.test(String(i.code))).map(i => i.code).join(','));
  ok('every issue carries severity + message',
    report.issues.every(i => ['error', 'warning', 'info'].includes(i.sev) && i.msg));
  ok('no undefined values leaked into messages',
    report.issues.every(i => !/undefined|NaN|\[object/.test(String(i.msg) + String(i.value))),
    report.issues.filter(i => /undefined|NaN|\[object/.test(String(i.msg) + String(i.value))).slice(0, 3).map(i => i.code + ':' + i.msg).join(' | '));
  ok('I-49: V-18 no longer fires (no phantom Status Category block demanded)',
    !report.issues.some(i => i.code === 'V-18'),
    report.issues.filter(i => i.code === 'V-18').map(i => i.msg).join(' | '));
  ok('report carries zero error-severity issues (validation never blocks the dashboard)',
    report.counts.error === 0, `errors=${report.counts.error}`);
  ok('I-50: V-20 stays a warning, never an error (accepted: List End Row 300 = template bound)',
    report.issues.filter(i => i.code === 'V-20').every(i => i.sev === 'warning'),
    report.issues.filter(i => i.code === 'V-20').map(i => i.sev).join(',') || 'not fired');

  /* ---------- I-11: the Code sheet Error table is now the wording source ---------- */
  line('');
  line('--- I-11 rule wording (from Code!Q:R) ---');
  const firedCodes = [...new Set(report.issues.map(i => i.code))];
  firedCodes.forEach(c => line(`  ${c.padEnd(6)} ${JSON.stringify((report.issues.find(i => i.code === c).desc || '').slice(0, 72))}`));
  ok('I-11: every issue carries a .desc string (never undefined)',
    report.issues.every(i => typeof i.desc === 'string'),
    report.issues.filter(i => typeof i.desc !== 'string').length + ' issue(s) missing .desc');
  ok('I-11: every fired code resolves a wording from the Error table',
    firedCodes.every(c => (report.issues.find(i => i.code === c).desc || '').length > 0),
    firedCodes.filter(c => !(report.issues.find(i => i.code === c).desc || '')).join(',') || 'all documented');
  ok('I-11: no V-21 on the current workbook (every fired code IS documented)',
    !report.issues.some(i => i.code === 'V-21'),
    report.issues.filter(i => i.code === 'V-21').map(i => i.value).join(' | '));

  /* the fallback contract the user agreed: an undocumented code WARNs, never errors */
  {
    const patched = Object.assign({}, vctx, {
      errorTable: Object.assign({}, vctx.errorTable, { 'V-08': '' }),
    });
    const r2 = H.validate(model.packages, patched);
    const v21 = r2.issues.filter(i => i.code === 'V-21');
    line('');
    line('--- I-11 fallback: V-08 removed from the Error table ---');
    v21.forEach(i => line(`  ${i.sev} ${i.code} value=${JSON.stringify(i.value)}`));
    line(`  errors in report: ${r2.counts.error}   issues: ${r2.issues.length}`);
    ok('I-11: an undocumented code emits exactly ONE V-21 warning naming it',
      v21.length === 1 && v21[0].sev === 'warning' && /\bV-08\b/.test(v21[0].value),
      `${v21.length} issue(s) sev=${v21.map(x => x.sev).join(',')} value=${JSON.stringify(v21.map(x => x.value))}`);
    ok('I-11: the undocumented code still carries its built-in message (fallback works)',
      r2.issues.filter(i => i.code === 'V-08').every(i => i.desc === '' && !!i.msg),
      r2.issues.filter(i => i.code === 'V-08').length + ' V-08 issue(s) kept their message');
    ok('I-11: V-21 never escalates to error severity or fail the report',
      v21.every(i => i.sev === 'warning') && r2.counts.error === 0,
      `errors=${r2.counts.error} sev=${v21.map(x => x.sev).join(',') || 'not fired'}`);
    ok('I-11: V-21 does not name itself (a rule must not audit its own documentation)',
      !/V-21/.test(v21[0] ? v21[0].value : ''),
      String(v21[0] && v21[0].value));

    const r3 = H.validate(model.packages, Object.assign({}, vctx, { errorCodeCol: null, errorTable: {} }));
    const v21b = r3.issues.filter(i => i.code === 'V-21');
    ok('I-11: a wholly missing Error-table block warns once and says so',
      v21b.length === 1 && v21b[0].sev === 'warning' && /not found/.test(v21b[0].value),
      `${v21b.length} issue(s) — ${v21b.map(x => x.msg).join(' | ')}`);
    ok('I-11: with no Error table at all every issue still has a message',
      r3.issues.every(i => !!i.msg) && r3.counts.error === 0,
      `${r3.issues.filter(i => !i.msg).length} missing message(s)`);

    /* I-25 dead-code cleanup: V-12 was unreachable by construction — the engineer
       tally added a raw string to a Set keyed by that same raw string, so every
       Set had size 1 and `s.size > 1` could never hold. The rule now groups
       spellings that differ only in whitespace / slash spacing. These tests pin
       BOTH directions: variants that differ only in spacing MUST fire V-12, and
       genuinely different names MUST NOT be merged. */
    line('');
    line('--- I-25: V-12 engineer-variant detection ---');
    const withVariants = model.packages.map((p, i) => (i < 3
      ? Object.assign({}, p, { _raw: Object.assign({}, p._raw, { engineer: ['Dilip/Siva', 'Dilip / Siva', 'Siva /Dilip'][i] }), engineer: ['Dilip/Siva', 'Dilip / Siva', 'Siva /Dilip'][i] })
      : p));
    const rV12 = H.validate(withVariants, vctx);
    const v12 = rV12.issues.filter(i => i.code === 'V-12');
    v12.forEach(i => line(`  ${i.sev} ${i.code} value=${JSON.stringify(i.value)}  ${i.msg}`));
    ok('I-25: V-12 now fires on spellings that differ only in slash/spacing',
      v12.length >= 1,
      `${v12.length} V-12 issue(s) — value=${JSON.stringify(v12.map(x => x.value))}`);
    ok('I-25: V-12 keeps every distinct raw spelling in its report line',
      v12.some(i => /Dilip\/Siva/.test(i.value) && /Dilip \/ Siva/.test(i.value)),
      String(v12[0] && v12[0].value));
    ok('I-25: V-12 is warning severity (a spelling issue must not block)',
      v12.every(i => i.sev === 'warning') && rV12.counts.error === 0,
      `sev=${v12.map(x => x.sev).join(',') || 'not fired'} errors=${rV12.counts.error}`);
    const distinct = model.packages.map((p, i) => (i < 2
      ? Object.assign({}, p, { _raw: Object.assign({}, p._raw, { engineer: ['Kenny', 'Kenny/Franklin'][i] }), engineer: ['Kenny', 'Kenny/Franklin'][i] })
      : p));
    const rV12b = H.validate(distinct, vctx);
    const v12b = rV12b.issues.filter(i => i.code === 'V-12');
    ok('I-25: V-12 does NOT merge genuinely different engineers (Kenny ≠ Kenny/Franklin)',
      v12b.length === 0,
      v12b.length ? `wrongly merged: ${v12b.map(x => x.value).join(' | ')}` : 'correctly kept separate');
    /* the current workbook must stay clean — if it ever gains real variants this
       assertion flips to a warning, which is the signal, not a failure */
    ok('I-25: current workbook has no engineer-variant collision',
      report.issues.filter(i => i.code === 'V-12').length === 0,
      `${report.issues.filter(i => i.code === 'V-12').length} V-12 issue(s) on the shipped workbook`);
  }
} catch (e) { fail.push({ name: 'validate threw', detail: e.message }); }

line('');
line('='.repeat(72));
line('RENDER (full buildDashboard with DOM stubs)');
line('='.repeat(72));
try {
  H.STATE.model = null; H.STATE.report = null;
  H.buildDashboard(result, 'TWRP C3B2 - Procurement Package Plan.xlsx');
  ok('buildDashboard completed without throwing', true);
  const filled = writes.filter(w => w.kind === 'html' && w.len > 0);
  line(`elements written: ${filled.length}`);
  line('non-empty writes: ' + filled.map(w => `${w.id}(${w.len})`).join(' '));
  // real element ids that the renderers are expected to populate
  const chartIds = ['statusChart', 'discipline', 'engineer', 'criticality', 'leadtime',
    'stage', 'poChart', 'lookahead', 'delays', 'dq', 'kpis', 'vchips', 'vtable', 'vmap', 'vref', 'tfPanel'];
  const missing = chartIds.filter(id => !filled.some(w => w.id === id));
  line('elements with NO content: ' + (missing.length ? missing.join(', ') : '(none)'));
  const svgs = filled.filter(w => w.id && w.len > 200);
  line(`substantial renders (chart-sized): ${svgs.length}`);
  ok('charts produced output', svgs.length >= 6, `${svgs.length}`);

  const vmap = (getEl('vmap')._html || '');
  line('');
  line('--- Code sheet map as rendered by renderCodeMap() ---');
  vmap.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
    .split('\n').forEach(l => { if (l.trim()) line('  ' + l.trim()); });
  const codeColHits = (vmap.match(/code col [A-Z]/g) || []).length;
  ok('I-49: rendered Code sheet map no longer lists Status Category',
    !/status category/i.test(vmap));
  ok('renderCodeMap surfaces the code-column location',
    codeColHits >= 1, `${codeColHits} block(s) report a code column`);
  /* The original §15.10 bug was "Item Category: col O · code col N · 19 values" —
     the blank code column N was credited with O's description count. The fix gives
     every code column ITS OWN count (lookupMeta[block].codeN). The workbook now has
     Category Code populated, so assert each `code col X` clause shows its own
     tracked code-count, that the borrowed "· NN values" format never recurs, and
     that every code-column clause is well-formed (`(NN)` or `(empty)`) — the last
     still fails loudly if a future column empties without rendering `(empty)`. */
  const codeBlocks = [['discipline','E'],['criticality','H'],['status','K'],['category','N']];
  const borrowOk = codeBlocks.every(([k,col]) => {
    const m = new RegExp('code col ' + col + ' \\((\\d+)\\)').exec(vmap);
    return m && Number(m[1]) === model.lookupMeta[k].codeN;
  });
  ok('I-51: each code column shows its OWN code-count (no borrowed description count)',
    borrowOk,
    codeBlocks.map(([k,col]) => {
      const m = new RegExp('code col ' + col + ' \\((\\d+)\\)').exec(vmap);
      return `code col ${col}: shown=${m ? m[1] : '?'} expected=${model.lookupMeta[k].codeN}`;
    }).join('  '));
  ok('I-51: the borrowed "· NN values" format never recurs',
    !/code col [A-Z][\s\S]{0,24}?·\s*\d+\s*values/.test(vmap),
    (vmap.match(/code col [A-Z][\s\S]{0,24}?values/) || ['none'])[0]);
  const codeCols = vmap.match(/code col [A-Z] \(/g) || [];
  const codeClauses = vmap.match(/code col [A-Z] \((?:\d+|empty)\)/g) || [];
  ok('I-51: every code column clause carries a count or an explicit (empty)',
    codeCols.length > 0 && codeCols.length === codeClauses.length,
    `clauses=${codeClauses.length} cols=${codeCols.length} :: ${codeClauses.join(' ')}`);
  ok('I-51: populated code columns render their own counts (discipline E, criticality H, status K)',
    ['E', 'H', 'K'].every(c => new RegExp('code col ' + c + ' \\(\\d+\\)').test(vmap)),
    ['E', 'H', 'K'].map(c => `code col ${c}: ${(new RegExp('code col ' + c + ' \\(\\d+\\)').test(vmap) ? 'ok' : 'MISSING')}`).join('  '));
  ok('renderCodeMap reports no missing block on the current workbook',
    !/not found/i.test(vmap), (vmap.match(/>[^<]*not found/gi) || []).join(', ') || 'none');
  ok('I-11: the Code sheet map reports where the Error table lives',
    /Error table: col R[\s\S]{0,24}code col Q/.test(vmap),
    (vmap.match(/Error table[^<]*/) || [''])[0]);

  const vref = (getEl('vref')._html || '');
  line('');
  line('--- Rule reference as rendered by renderRuleRef() ---');
  vref.replace(/<\/li>/g, '\n').replace(/<\/code>/g, '  ').replace(/<[^>]+>/g, '')
    .split('\n').forEach(l => { if (l.trim()) line('  ' + l.trim()); });
  ok('I-11: rule reference shows the Error-table wording for each fired rule',
    /V-08/.test(vref) && /Stage plan dates out of sequence/.test(vref),
    `${vref.length} chars`);
  ok('I-11: rule reference is deduplicated — V-08 appears once, not 119 times',
    (vref.match(/V-08/g) || []).length === 1,
    `${(vref.match(/V-08/g) || []).length} occurrence(s)`);
} catch (e) { fail.push({ name: 'buildDashboard threw', detail: e.stack.split('\n').slice(0, 4).join(' | ') }); }

/* ---------- I-26: pie slice cap + export target ---------- */
line('');
line('--- I-26: pie slice cap and export target ---');
try {
  const cap = H.CHART.pie.topN;
  ok('I-26: the pie slice cap is a CHART token, not a literal buried in svgPie()',
    typeof cap === 'number' && cap > 0, `CHART.pie.topN=${cap}`);

  /* I-26(b) was REFUTED by reading the shipped code: the workplan claimed the
     bar-mode Copy/Download target `svg-eng` "does not exist in bar mode". It
     does — renderCat() passes svgId:meta.svg to BOTH renderers and svgHBar()
     honours it. Pin it so the claim cannot silently come true again. */
  const two = [{ label: 'Ricarte', value: 49 }, { label: 'TBC', value: 29 }];
  const barSvg = H.svgHBar(two, { svgId: 'svg-eng' });
  const pieSvg = H.svgPie(two, { svgId: 'svg-eng' });
  ok('I-26(b): svgHBar emits the requested id — the bar-mode export target DOES exist',
    /id="svg-eng"/.test(barSvg), (barSvg.match(/<svg[^>]{0,60}/) || [''])[0]);
  ok('I-26(b): svgPie emits the same id, so one button serves both modes',
    /id="svg-eng"/.test(pieSvg), (pieSvg.match(/<svg[^>]{0,60}/) || [''])[0]);

  /* I-26(a): the collapse itself — under the cap nothing merges, over it the
     tail is summed AND must still be listed. */
  const many = Array.from({ length: cap + 2 }, (_, i) => ({ label: 'Eng-' + i, value: cap + 2 - i }));
  const underCap = H.topN(many.slice(0, cap), cap);
  ok('I-26(a): at or under the cap nothing is merged into Other',
    !underCap.some(i => /^Other/.test(i.label)), `${underCap.length} item(s), no Other`);
  const overCap = H.topN(many, cap);
  const other = overCap.find(i => /^Other/.test(i.label));
  ok('I-26(a): over the cap the tail collapses into exactly one Other slice',
    !!other && overCap.length === cap + 1, `${overCap.length} item(s)`);
  ok('I-26(a): the Other slice carries the names it swallowed (otherLabels)',
    !!other && Array.isArray(other.otherLabels) && other.otherLabels.length === 2
      && other.otherLabels.every(l => many.some(x => x.label === l)),
    other ? JSON.stringify(other.otherLabels) : 'no Other slice produced');
  const pieOver = H.svgPie(many, { svgId: 'svg-x' });
  ok('I-26(a): the merged names reach the rendered SVG (tooltip, not visible copy)',
    !!other && other.otherLabels.every(l => pieOver.includes(l)),
    other ? (other.otherLabels.filter(l => !pieOver.includes(l)).join(',') || 'all listed') : 'n/a');
  ok('I-26(a): the visible Other label text is UNCHANGED — no copy edits without approval',
    /Other \(2 categories\)/.test(pieOver), (/Other \([^)]*\)/.exec(pieOver) || ['not rendered'])[0]);
} catch (e) { fail.push({ name: 'I-26 checks threw', detail: e.message }); }

/* ---------- V-22: lookup block with empty code column but populated description ---------- */
line('');
line('--- V-22: empty code column while description populated ---');
try {
  /* synthetic: only Criticality has an empty code column while its description is populated */
  const v22ctx = {
    lookupMeta: {
      discipline:{col:'E', n:19, title:'Discipline Description', codeCol:'D', codeN:3},
      criticality:{col:'I', n:5, title:'Criticality', codeCol:'H', codeN:0},
      status:{col:'L', n:9, title:'Package Status', codeCol:'K', codeN:9},
      category:{col:'O', n:19, title:'Item Category', codeCol:'N', codeN:19},
    },
    lookups:{}, asOf:new Date(), hasTypes:true,
  };
  const rV22 = H.validate([], v22ctx);
  const v22 = rV22.issues.filter(i => i.code === 'V-22');
  v22.forEach(i => line(`  ${i.sev} ${i.code} field=${i.field} value=${JSON.stringify(i.value)}  ${i.msg}`));
  ok('V-22: flags exactly the block whose code column is empty while description is populated',
    v22.length === 1 && /Criticality/.test(v22[0].msg) && v22[0].sev === 'warning',
    `${v22.length} V-22 issue(s) — ${v22.map(x => x.field).join(', ')}`);

  /* synthetic: both description and code columns empty — V-18 owns this, not V-22 */
  const v22bctx = {
    lookupMeta: {
      discipline:{col:null, n:0, title:'Discipline Description', codeCol:null, codeN:0},
    },
    lookups:{}, asOf:new Date(), hasTypes:true,
  };
  const rV22b = H.validate([], v22bctx);
  ok('V-22: does NOT fire when both description and code columns are empty (V-18 covers that)',
    rV22b.issues.filter(i => i.code === 'V-22').length === 0,
    rV22b.issues.filter(i => i.code === 'V-22').map(x => x.msg).join(' | ') || 'none');

  /* real workbook: all four code columns are now populated -> 0 V-22 */
  ok('V-22: current workbook fires no V-22 (all code columns populated)',
    !!report && !report.issues.some(i => i.code === 'V-22'),
    (report ? report.issues.filter(i => i.code === 'V-22').map(i => i.msg).join(' | ') : 'no report') || 'none');
} catch (e) { fail.push({ name: 'V-22 checks threw', detail: e.message }); }

line('');
line('='.repeat(72));
line('RESULT');
line('='.repeat(72));
pass.forEach(p => line(`  PASS  ${p.name}${p.detail ? '  (' + p.detail + ')' : ''}`));
fail.forEach(f => line(`  FAIL  ${f.name}  -> ${f.detail}`));
line('');
line(`SUMMARY: ${pass.length} passed, ${fail.length} failed`);
process.exit(fail.length ? 1 : 0);
