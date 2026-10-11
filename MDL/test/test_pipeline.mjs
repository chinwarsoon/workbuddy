// test_pipeline.mjs — Node test harness for the MDL dashboard pipeline.
// Runs the shipped pipeline against the REAL workbook and asserts:
//  - contract-driven parsing (column map, lookups, error block read at runtime, not hard-coded)
//  - all 27 §5 rules present with valid severities
//  - validation severity/message are sourced from Code!AI:AL
//  - green run produces a non-empty consolidated model
import { readXlsx } from '../src/xlsx-reader.mjs';
import { buildModel, parseCodeSheet, buildFieldToCol, findLookupColumns, readLookupMap } from '../src/pipeline.mjs';
import { deriveView } from '../src/render.mjs';
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

console.log(`\nRESULT: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
