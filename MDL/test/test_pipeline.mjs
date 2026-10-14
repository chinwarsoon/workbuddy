// test_pipeline.mjs — Node test harness for the MDL dashboard pipeline.
// Runs the shipped pipeline against the REAL workbook and asserts:
//  - contract-driven parsing (column map, lookups, error block read at runtime, not hard-coded)
//  - all 27 §5 rules present with valid severities
//  - validation severity/message are sourced from Code!AI:AL
//  - green run produces a non-empty consolidated model
import { readXlsx } from '../src/xlsx-reader.mjs';
import { buildModel, parseCodeSheet, buildFieldToCol, findLookupColumns, readLookupMap, isExcelError, approvalCategory } from '../src/pipeline.mjs';
import { deriveView, scurveAxisMode } from '../src/render.mjs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const here = path.dirname(fileURLToPath(import.meta.url));
const wbPath = path.join(here, '..', 'TWRP C3B2 - Master Document List.xlsx');

let pass = 0, fail = 0;
function ok(name, cond, extra=''){ if(cond){ pass++; console.log('  PASS', name); } else { fail++; console.log('  FAIL', name, extra); } }

if(!fs.existsSync(wbPath)){ console.error('Workbook not found at', wbPath); process.exit(2); }
const buf = fs.readFileSync(wbPath);
const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
const wb = await readXlsx(ab);

console.log('1) Column map (Code!A12:C36)');
const model = buildModel(wb, { workbookName: path.basename(wbPath) });
const map = model.contract.columnMap;
ok('25 fields mapped', Object.keys(map).length === 25, 'got ' + Object.keys(map).length);
const letters = Object.values(map).map(m=>m.letter).sort();
ok('letters span A–Y', letters[0]==='A' && letters[letters.length-1]==='Y', letters.join(','));

console.log('2) Error block (Code!AI:AL) — 28 rules, valid severities');
const eb = model.contract.errorBlock.map;
const codes = Object.keys(eb);
ok('28 error codes present', codes.length === 28, 'got ' + codes.length);
const expected = Array.from({length:28},(_,i)=>'V-'+String(i+1).padStart(2,'0'));
ok('V-01..V-28 all present', expected.every(c=>codes.includes(c)));
const sevDist = {}; codes.forEach(c=>sevDist[eb[c].severity]=(sevDist[eb[c].severity]||0)+1);
ok('severities only Error/Warning/Info', Object.keys(sevDist).every(s=>['Error','Warning','Info'].includes(s)), JSON.stringify(sevDist));
ok('severity distribution 7 Error / 20 Warning / 1 Info', sevDist.Error===7 && sevDist.Warning===20 && (sevDist.Info||0)===1, JSON.stringify(sevDist));

console.log('3) Lookups read at runtime from Code blocks (no hard-coded lists)');
const L = model.contract.lookups;
ok('stage lookup = 19', L.stage.codes.size === 19, 'got ' + L.stage.codes.size);
ok('UESH discipline lookup = 20', L.uesh.codes.size === 20, 'got ' + L.uesh.codes.size);
ok('doc type lookup = 63', L.docType.codes.size === 63, 'got ' + L.docType.codes.size);
ok('discipline-code lookup = 20', L.disciplineCode.codes.size === 20, 'got ' + L.disciplineCode.codes.size);
ok('authority lookup = 6', L.authority.codes.size === 6, 'got ' + L.authority.codes.size);
ok('submission-status lookup = 4', L.submissionStatus.codes.size === 4, 'got ' + L.submissionStatus.codes.size);
ok('approval lookup = 4', L.approval.codes.size === 4, 'got ' + L.approval.codes.size);
ok('known value present: stage NA', L.stage.codes.has('NA'));
ok('known value present: uesh Mech', L.uesh.codes.has('Mech'));
ok('known value present: docType SN', L.docType.codes.has('SN'));
ok('known value present: approval APP', L.approval.codes.has('APP'));

console.log('4) Review durations from Code!A9:C11');
const rr = model.contract.reviewRules;
ok('firstClientReview = 20', rr.firstClientReview === 20, JSON.stringify(rr));
ok('resubmissionDuration = 14', rr.resubmissionDuration === 14);

console.log('5) Discipline tab discovery');
ok('10 discipline tabs available', model.tabs.available.length === 10, JSON.stringify(model.tabs.available));
ok('10 disciplines with no list yet', model.contract.noListYetDisciplines.length === 10, 'got ' + model.contract.noListYetDisciplines.length);

console.log('6) Validation sourcing — severity & message from Code!AI:AL');
const sampled = {};
let sourced = true, msgOk = true;
for(const i of model.issues){
  const def = eb[i.code];
  if(!def) { sourced = false; continue; }
  if(def.severity !== i.severity) sourced = false;
  if(def.rule !== i.message) msgOk = false;
  sampled[i.code] = true;
}
ok('every issue severity matches Error block', sourced);
ok('every issue message matches Error block rule text', msgOk);

console.log('7) Green run — consolidated model is non-empty');
ok('records > 0', model.records.length > 0, 'got ' + model.records.length);
ok('active records > 0', model.records.filter(r=>r.isActive).length > 0);
ok('issues > 0', model.issues.length > 0, 'got ' + model.issues.length);
// S4 (deriveView) is now the sole source of KPIs/charts — buildModel does S2+S3 only (spec §3.8).
const view = deriveView(model, {});
ok('KPI totalPlanned equals active count', view.kpis.totalPlanned === model.records.filter(r=>r.isActive).length);
ok('charts.docsByDiscipline non-empty', view.charts.docsByDiscipline.length > 0);

console.log('7b) KPI split + T‖S fallback (I-01..I-06)');
const todayISO = model.meta.today;
const activeRecs = model.records.filter(r=>r.isActive);
const tOrS = r => (r.fields['Forecast 1st Issue Date']||'') || (r.fields['Planned 1st Issue Date']||'');
const todayD = new Date(todayISO + 'T00:00:00Z');
const wdCount = a => { if(!a) return 0; const s = new Date(a + 'T00:00:00Z'); let c = 0, cur = new Date(s.getTime()); while(cur <= todayD){ const day = cur.getUTCDay(); if(day !== 0 && day !== 6) c++; cur.setUTCDate(cur.getUTCDate() + 1); } return c; };
const recomputedFirst = activeRecs.filter(r=>{ const d=tOrS(r); const U=r.fields['Actual 1st Issue Date']||''; return d!=='' && U==='' && wdCount(d) >= 1; }).length;
ok('deriveView kpis has 3 overdue values', typeof view.kpis.overdueFirst==='number' && typeof view.kpis.overdueResubmission==='number' && typeof view.kpis.overdueClientReview==='number');
ok('overdueFirst uses T‖S fallback (matches recomputed)', view.kpis.overdueFirst === recomputedFirst, `${view.kpis.overdueFirst} vs ${recomputedFirst}`);
ok('scheduleVariance split into 5 (On track/At risk/3 overdue)', view.charts.scheduleVariance.length===5 && view.charts.scheduleVariance.filter(x=>x.name.indexOf('Overdue')===0).length===3);

console.log('8) Contract-driven: lookup value sets equal what is in the workbook');
// independently re-read a block to prove pipeline reads (not hard-codes) values
const code = wb.sheets['Code'];
let stageCount=0; for(let r=2;r<=code.maxRow;r++){ if(code.rows[r] && code.rows[r].E!=null && code.rows[r].E!=='') stageCount++; }
ok('independently counted stage codes = 19', stageCount === 19, 'got ' + stageCount);

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);

// ---------- interactive filter derivation (no DOM) ----------
console.log('9) Interactive filtering (deriveView)');
const base = model.records.filter(r=>r.isActive).length;
// Filter state contract: every counted value is listed in the sets (no set = nothing selected).
const EXCL_STAGES = ['Deleted','Void','Superseded'];
const fullDisc = new Set([...new Set(model.records.map(r=>r.discipline).filter(Boolean))]);
const fullStg  = new Set([...new Set(model.records.map(r=>r.stage).filter(Boolean))].filter(s=>!EXCL_STAGES.includes(s)));
const st = (o={}) => ({ disciplines:o.disciplines||fullDisc, stages:o.stages||fullStg, search:o.search||'', searchCol:o.searchCol||'Document No.', rule:o.rule||null, sort:{col:null,dir:1} });
const all = deriveView(model, st());
ok('default filter → active count', all.active.length === base, `${all.active.length} vs ${base}`);
ok('excluded stages excluded by default', all.active.every(r=>r.isActive));
const oneDisc = deriveView(model, st({ disciplines:new Set(['Process']) }));
ok('discipline filter narrows', oneDisc.active.length > 0 && oneDisc.active.length < base, 'got ' + oneDisc.active.length);
ok('discipline filter only Process', oneDisc.active.every(r=>r.discipline==='Process'));
const exclRecs = model.records.filter(r=>EXCL_STAGES.includes(r.stage));
const incExc = deriveView(model, st({ stages:new Set([...fullStg, ...EXCL_STAGES]) }));
if(exclRecs.length > 0){
  ok('ticking excluded stages grows the set', incExc.active.length > base, `${incExc.active.length} vs ${base}`);
} else {
  ok('ticking excluded stages has no effect (dataset has no excluded-stage records)', incExc.active.length === base, `${incExc.active.length} vs ${base}`);
}
const none = deriveView(model, st({ disciplines:new Set() }));
ok('empty selection → zero rows', none.active.length === 0, `got ${none.active.length}`);
const sampleDoc = model.records.find(r=>r.isActive && r.docNo && r.docNo.length >= 2);
const term = sampleDoc ? sampleDoc.docNo.slice(0, Math.max(1, Math.ceil(sampleDoc.docNo.length/2))).toLowerCase() : 'im';
const search = deriveView(model, st({ searchCol:'Document No.', search:term }));
ok('search narrows by the selected column only (Document No.)', search.active.length > 0 && search.active.every(r=>(r.docNo||'').toLowerCase().includes(term)), term + ' -> ' + search.active.length);
const withIssues = deriveView(model, st({ rule:'V-26' }));
ok('rule filter keeps only that rule’s issues', withIssues.issues.every(i=>i.code==='V-26'));

console.log('9b) deriveView KPI split reflects filtered active set');
ok('deriveView kpis has 3 overdue numbers', typeof all.kpis.overdueFirst==='number' && typeof all.kpis.overdueResubmission==='number' && typeof all.kpis.overdueClientReview==='number');
ok('deriveView overdueFirst matches recomputed', all.kpis.overdueFirst === recomputedFirst, `${all.kpis.overdueFirst} vs ${recomputedFirst}`);

console.log('10) Matrix expansion data (I-12)');
ok('matrix rows are disciplines', all.matrix.length > 0);
ok('matrix rows have 3 overdue columns', all.matrix.every(m=>typeof m.ov1==='number'&&typeof m.ov2==='number'&&typeof m.ov3==='number'));
ok('matrix rows have stages arrays', all.matrix.every(m=>Array.isArray(m.stages)));
const disc = all.matrix.find(m=>m.stages.length>0);
ok('a discipline exposes stage breakdown with all columns', !!disc && disc.stages.every(s=>['Planned','Submitted','Approved','AWC','REJ','NAP','ov1','ov2','ov3'].every(k=>typeof s[k]==='number')));
ok('stage planned sums to discipline planned', !disc || disc.stages.reduce((a,s)=>a+s.Planned,0) === disc.Planned);
ok('stage overdue-1st sums to discipline overdue-1st', !disc || disc.stages.reduce((a,s)=>a+s.ov1,0) === disc.ov1);

console.log('11) Issue-progress timeline (I-16)');
ok('monthlyProgress present', !!all.monthlyProgress);
const mp=all.monthlyProgress;
ok('months non-empty', Array.isArray(mp.months)&&mp.months.length>0);
ok('cumulative planned monotonic non-decreasing', mp.pCum.every((v,i)=> i===0||v>=mp.pCum[i-1]));
ok('cumulative actual <= cumulative planned at end', mp.aCum[mp.aCum.length-1] <= mp.pCum[mp.pCum.length-1]);
const sumNew=mp.pNew.reduce((a,b)=>a+b,0);
ok('monthly planned sums to cumulative end', sumNew === mp.pCum[mp.pCum.length-1], `${sumNew} vs ${mp.pCum[mp.pCum.length-1]}`);

console.log('12) Standardized table discovery — resilience (spec §3.1.1)');
// 12a) a column-map field placed BEYOND row 36 is still discovered (no 12–36 hard bound)
{
  const sheet = { rows: [] };
  sheet.rows[0] = undefined;
  sheet.rows[1] = { A:'Project Metadata Title', B:'Project Metadata Values', C:'Project Metadata Data Type' };
  sheet.rows[12] = { A:'Stage', B:'Column-B', C:'Text' };
  sheet.rows[40] = { A:'Latest Approval Status', B:'Column-Y', C:'Text' };  // beyond the old 12–36 scan
  const { meta } = parseCodeSheet(sheet);
  const refs = buildFieldToCol(meta);
  ok('field beyond row 36 discovered (Latest Approval Status -> Y)', refs['Latest Approval Status'] === 24, 'got ' + refs['Latest Approval Status']);
  ok('regular field still discovered (Stage -> B)', refs['Stage'] === 1, 'got ' + refs['Stage']);
}
// 12b) a lookup block moved to a different column is still discovered by its row-1 header
{
  const sheet = { rows: [] };
  sheet.rows[0] = undefined;
  sheet.rows[1] = { M:'Stage Code', N:'Description' };  // Stage block moved from E:F to M:N
  sheet.rows[2] = { M:'NA', N:'Not Applicable' };
  sheet.rows[3] = { M:'APP', N:'Approved' };
  sheet.rows[4] = { M:'REJ', N:'Rejected' };
  const lk2 = findLookupColumns(sheet);
  ok('moved lookup block discovered at column M', lk2.src.stage === 'M', 'got ' + lk2.src.stage);
  const codes = readLookupMap(sheet, lk2.idx.stage, lk2.idx.stage + 1, 2);
  ok('moved block values read correctly', codes['NA']==='Not Applicable' && codes['APP']==='Approved' && codes['REJ']==='Rejected', JSON.stringify(codes));
}

console.log('13) Blank + formula-error normalization (I-74) and W-FORMULA warning (I-75)');
// 13a) isExcelError predicate
ok('isExcelError detects #VALUE!', isExcelError('#VALUE!') === true);
ok('isExcelError detects #REF!', isExcelError('#REF!') === true);
ok('isExcelError detects #N/A', isExcelError('#N/A') === true);
ok('isExcelError is case/space tolerant', isExcelError('  #value!  ') === true);
ok('isExcelError rejects real values', isExcelError('APP') === false && isExcelError('') === false && isExcelError(42) === false && isExcelError(undefined) === false);

// 13b) a minimal workbook whose Latest Approval Status (col D) and Latest Approval Date (col E)
// contain formula-error tokens; blank + valid values are also present.
{
  const FIELDS = ['SNo.','Stage','UESH Discipline','P6 Activity ID','BQ Number','System','Project Code','Project Prefix','Doc Type','Discipline','Number','Rev','Document No.','Document Title','Notes','As-Built','Authority','Vendor Data','Planned 1st Issue Date','Forecast 1st Issue Date','Actual 1st Issue Date','Prolog Number','Submission Status','Latest Approval Date','Latest Approval Status'];
  const dataCol = f => ({ 'Document No.':'A','Stage':'B','UESH Discipline':'C','Latest Approval Status':'D','Latest Approval Date':'E' }[f] || 'Z');
  const codeRows = new Array(41); codeRows[0] = undefined;
  codeRows[1] = { E:'UESH Discipline', F:'Stage Code' };
  codeRows[2] = { E:'Process', F:'NA' };
  codeRows[3] = { E:'BS', F:'Stage 1' };
  FIELDS.forEach((f, i) => { codeRows[10 + i] = { A:f, B:'Column-' + dataCol(f), C:(f==='Latest Approval Date'?'Date':'Text') }; });
  codeRows[35] = { A:'Project Start Date', B:'2026-01-01' };
  codeRows[36] = { A:'List End Row', B:'4000' };
  codeRows[37] = { A:'Project Title', B:'Test' };
  codeRows[38] = { A:'Dashboard Title', B:'Test' };
  const codeSheet = { rows: codeRows, maxRow: 40 };
  const procRows = new Array(6); procRows[0] = undefined;
  procRows[1] = {};
  procRows[2] = { A:'DOC-1', B:'NA', C:'Process', D:'#VALUE!', E:'#VALUE!' };   // both error cols
  procRows[3] = { A:'DOC-2', B:'Stage 1', C:'Process', D:'APP', E:'2026-05-01' }; // valid
  procRows[4] = { A:'DOC-3', B:'NA', C:'Process', D:'', E:'' };                  // blank
  procRows[5] = { A:'DOC-4', B:'NA', C:'Process', D:'#REF!', E:'2026-06-01' };   // 2nd error in col D
  const procSheet = { rows: procRows, maxRow: 5 };
  const m = buildModel({ sheets: { Code: codeSheet, Process: procSheet } }, { workbookName: 'synthetic.xlsx' });

  ok('4 records built', m.records.length === 4, 'got ' + m.records.length);
  const byNo = n => m.records.find(r => r.docNo === n);
  ok('valid approval status preserved (APP)', byNo('DOC-2').fields['Latest Approval Status'] === 'APP');
  ok('blank approval status -> undefined', byNo('DOC-3').fields['Latest Approval Status'] === undefined, JSON.stringify(byNo('DOC-3').fields['Latest Approval Status']));
  ok('error approval status -> undefined (not "#VALUE!")', byNo('DOC-1').fields['Latest Approval Status'] === undefined && byNo('DOC-4').fields['Latest Approval Status'] === undefined);
  ok('no record keeps an error token', m.records.every(r => !isExcelError(r.fields['Latest Approval Status']) && !isExcelError(r.fields['Latest Approval Date'])));
  ok('error approval date -> undefined', byNo('DOC-1').fields['Latest Approval Date'] === undefined && byNo('DOC-2').fields['Latest Approval Date'] === '2026-05-01');

  const wf = m.warnings.filter(w => w.code === 'W-FORMULA');
  ok('one W-FORMULA warning per errored column (2)', wf.length === 2, 'got ' + wf.length);
  ok('W-FORMULA is fatal', wf.length > 0 && wf.every(w => w.level === 'fatal'));
  const byTab = {}; wf.forEach(w => byTab[w.tab] = w);
  ok('Latest Approval Status warning count = 2', byTab['Latest Approval Status'] && byTab['Latest Approval Status'].message.includes('2 '), (byTab['Latest Approval Status']||{}).message);
  ok('Latest Approval Date warning count = 1', byTab['Latest Approval Date'] && byTab['Latest Approval Date'].message.includes('1 '), (byTab['Latest Approval Date']||{}).message);
  ok('W-FORMULA not duplicated into issues', m.issues.every(i => i.code !== 'W-FORMULA'));
}

console.log('14) approvalCategory classifier + per-field error flag (I-77)');
{
  const FIELDS = ['SNo.','Stage','UESH Discipline','P6 Activity ID','BQ Number','System','Project Code','Project Prefix','Doc Type','Discipline','Number','Rev','Document No.','Document Title','Notes','As-Built','Authority','Vendor Data','Planned 1st Issue Date','Forecast 1st Issue Date','Actual 1st Issue Date','Prolog Number','Submission Status','Latest Approval Date','Latest Approval Status'];
  const dataCol = f => ({ 'Document No.':'A','Stage':'B','UESH Discipline':'C','Latest Approval Status':'D','Latest Approval Date':'E','Actual 1st Issue Date':'Z' }[f] || 'Z');
  const codeRows = new Array(41); codeRows[0] = undefined;
  codeRows[1] = { E:'UESH Discipline', F:'Stage Code' };
  codeRows[2] = { E:'Process', F:'NA' };
  codeRows[3] = { E:'BS', F:'Stage 1' };
  FIELDS.forEach((f, i) => { codeRows[10 + i] = { A:f, B:'Column-' + dataCol(f), C:(f==='Latest Approval Date'?'Date':'Text') }; });
  codeRows[35] = { A:'Project Start Date', B:'2026-01-01' };
  codeRows[36] = { A:'List End Row', B:'4000' };
  codeRows[37] = { A:'Project Title', B:'Test' };
  codeRows[38] = { A:'Dashboard Title', B:'Test' };
  const codeSheet = { rows: codeRows, maxRow: 40 };

  const mk = (no, act, appr) => { const row = { A:no, B:'Stage 1', C:'Process' }; row['Z'] = act; row['D'] = appr; return row; };
  const procRows = new Array(12); procRows[0] = undefined; procRows[1] = {};
  procRows[2]  = mk('DOC-1',  '2026-05-01', 'APP');
  procRows[3]  = mk('DOC-2',  '2026-05-01', '');
  procRows[4]  = mk('DOC-3',  '2026-05-01', '#VALUE!');
  procRows[5]  = mk('DOC-4',  '2026-05-01', 'FOO');
  procRows[6]  = mk('DOC-5',  '', '');
  procRows[7]  = mk('DOC-6',  '', 'APP');
  procRows[8]  = mk('DOC-7',  '', '#REF!');
  procRows[9]  = mk('DOC-8',  '', 'BAR');
  procRows[10] = mk('DOC-9',  '#VALUE!', 'APP');
  procRows[11] = mk('DOC-10', '#VALUE!', '');
  const procSheet = { rows: procRows, maxRow: 11 };
  const m = buildModel({ sheets: { Code: codeSheet, Process: procSheet } }, { workbookName: 'synthetic.xlsx' });
  ok('10 records built', m.records.length === 10, 'got ' + m.records.length);
  const byNo = n => m.records.find(r => r.docNo === n);

  ok('fieldErrors is a Set', byNo('DOC-1').fieldErrors instanceof Set);
  ok('DOC-1 -> APP', approvalCategory(byNo('DOC-1')) === 'APP');
  ok('DOC-2 -> Submitted – Pending Review', approvalCategory(byNo('DOC-2')) === 'Submitted – Pending Review');
  ok('DOC-3 -> Submitted – Status Unavailable', approvalCategory(byNo('DOC-3')) === 'Submitted – Status Unavailable');
  ok('DOC-4 -> Record Error (invalid code, submitted)', approvalCategory(byNo('DOC-4')) === 'Record Error');
  ok('DOC-5 -> Not Submitted', approvalCategory(byNo('DOC-5')) === 'Not Submitted');
  ok('DOC-6 -> Record Error (approval w/o submission)', approvalCategory(byNo('DOC-6')) === 'Record Error');
  ok('DOC-7 -> Not Submitted (status error, no submission)', approvalCategory(byNo('DOC-7')) === 'Not Submitted');
  ok('DOC-8 -> Record Error (invalid code, no submission)', approvalCategory(byNo('DOC-8')) === 'Record Error');
  ok('DOC-9 -> APP (date error counts as submitted)', approvalCategory(byNo('DOC-9')) === 'APP');
  ok('DOC-10 -> Submitted – Pending Review (date error + blank status)', approvalCategory(byNo('DOC-10')) === 'Submitted – Pending Review');

  ok('DOC-3 fieldErrors has Latest Approval Status', byNo('DOC-3').fieldErrors.has('Latest Approval Status'));
  ok('DOC-9 fieldErrors has Actual 1st Issue Date', byNo('DOC-9').fieldErrors.has('Actual 1st Issue Date'));
  ok('DOC-1 fieldErrors empty', byNo('DOC-1').fieldErrors.size === 0);
  ok('DOC-7 fieldErrors has Latest Approval Status', byNo('DOC-7').fieldErrors.has('Latest Approval Status'));

  const recErrWarn = m.warnings.find(w => w.code === 'W-RECERR');
  ok('W-RECERR notice fired for Record Error docs (DOC-6 + DOC-8)', !!recErrWarn && /2 document/.test(recErrWarn.message), recErrWarn ? recErrWarn.message : 'none');
}

console.log('15) I-82: subOverdue gated to approvalCategory (REJ without submission excluded)');
{
  const FIELDS = ['SNo.','Stage','UESH Discipline','P6 Activity ID','BQ Number','System','Project Code','Project Prefix','Doc Type','Discipline','Number','Rev','Document No.','Document Title','Notes','As-Built','Authority','Vendor Data','Planned 1st Issue Date','Forecast 1st Issue Date','Actual 1st Issue Date','Prolog Number','Submission Status','Latest Approval Date','Latest Approval Status'];
  const dataCol = f => ({ 'Document No.':'A','Stage':'B','UESH Discipline':'C','Latest Approval Status':'D','Latest Approval Date':'E','Actual 1st Issue Date':'Z' }[f] || 'Z');
  const codeRows = new Array(41); codeRows[0] = undefined;
  codeRows[1] = { E:'UESH Discipline', F:'Stage Code' };
  codeRows[2] = { E:'Process', F:'NA' };
  codeRows[3] = { E:'BS', F:'Stage 1' };
  FIELDS.forEach((f, i) => { codeRows[10 + i] = { A:f, B:'Column-' + dataCol(f), C:(f==='Latest Approval Date'?'Date':'Text') }; });
  codeRows[35] = { A:'Project Start Date', B:'2026-01-01' };
  codeRows[36] = { A:'List End Row', B:'4000' };
  codeRows[37] = { A:'Project Title', B:'Test' };
  codeRows[38] = { A:'Dashboard Title', B:'Test' };
  const codeSheet = { rows: codeRows, maxRow: 40 };

  const mk = (no, act, appr, apprDate) => { const row = { A:no, B:'Stage 1', C:'Process' }; row['Z'] = act; row['D'] = appr; row['E'] = apprDate; return row; };
  const procRows = new Array(7); procRows[0] = undefined; procRows[1] = {};
  procRows[2] = mk('A', '2026-01-01', 'REJ', '2026-09-01'); // submitted + rejected + overdue -> subOverdue
  procRows[3] = mk('B', '',          'REJ', '');            // Record Error (REJ w/o submission) -> NOT subOverdue
  procRows[4] = mk('C', '2026-01-01', 'REJ', '2026-10-10'); // submitted + rejected but within 14d -> NOT subOverdue
  procRows[5] = mk('D', '',          'APP', '');            // Record Error (APP w/o submission)
  const procSheet = { rows: procRows, maxRow: 6 };
  const model = buildModel({ sheets: { Code: codeSheet, Process: procSheet } }, { today: '2026-10-12', workbookName: 'synthetic.xlsx' });
  const EXCL = ['Deleted','Void','Superseded'];
  const fullDisc = new Set([...new Set(model.records.map(r=>r.discipline).filter(Boolean))]);
  const fullStg = new Set([...new Set(model.records.map(r=>r.stage).filter(Boolean))].filter(s=>!EXCL.includes(s)));
  const view = deriveView(model, { disciplines: fullDisc, stages: fullStg, search:'', searchCol:'Document No.', rule:null, sort:{col:null,dir:1} });
  const keys = view.subOverdue.map(r => r.docNo);

  ok('subOverdue includes submitted+rejected+overdue (A)', keys.includes('A'), keys.join(','));
  ok('subOverdue excludes Record Error REJ w/o date (B)', !keys.includes('B'));
  ok('subOverdue excludes not-yet-overdue REJ (C)', !keys.includes('C'));
  ok('subOverdue count = 1', view.subOverdue.length === 1, 'n=' + view.subOverdue.length);
}

console.log('16) I-87: scurveAxisMode guardrail (shared default, engage >10, revert <6, hysteresis 6-10)');
{
  const M = (maxCum, maxBar, current = 'single', barsVisible = true) => scurveAxisMode({ maxCum, maxBar, barsVisible, current });
  ok('maxBar = 0 -> shared', M(1000, 0) === 'single');
  ok('Bars toggle off -> shared', M(1000, 100, 'single', false) === 'single');
  ok('r = 1 -> shared', M(100, 100) === 'single');
  ok('r = 12 from shared -> separate', M(1200, 100) === 'dual');
  ok('r = 9 from shared -> shared (below the 10 trip)', M(900, 100) === 'single');
  ok('r = 10 exactly -> shared (strict >)', M(1000, 100) === 'single');
  ok('r = 8 while separate -> retained (hysteresis)', M(800, 100, 'dual') === 'dual');
  ok('r = 4 while separate -> reverts to shared', M(400, 100, 'dual') === 'single');
  ok('maxCum = 0 -> shared', M(0, 100) === 'single');
}

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
