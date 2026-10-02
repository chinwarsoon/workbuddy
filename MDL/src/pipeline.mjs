// pipeline.mjs — builds the consolidated document model from a parsed workbook.
// Pure logic (no DOM). Consumed by render (browser) and test_pipeline (Node).
import { colToNum, numToCol } from './xlsx-reader.mjs';

const EXCLUDE_STAGES = ['Deleted', 'Void', 'Superseded'];

// ---- Excel serial date helpers ----
function excelSerialToISO(serial){
  if(typeof serial !== 'number' || !isFinite(serial)) return null;
  const ms = Math.round((serial - 25569) * 86400 * 1000);
  const d = new Date(ms);
  if(isNaN(d)) return null;
  return d.toISOString().slice(0, 10);
}
function isoToDate(iso){ if(!iso) return null; const d = new Date(iso + 'T00:00:00Z'); return isNaN(d) ? null : d; }
// Tolerant parse of the project-start cell (Code!A6): Excel serial, ISO, or text date.
function parseProjectStart(cell){
  if(cell == null || cell === '') return null;
  if(typeof cell === 'number' && isFinite(cell)) return excelSerialToISO(cell);
  const s = String(cell).trim();
  if(/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  const d = new Date(s);
  if(!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
  return null;
}
// Tolerant parse of the "List End Row" cell (Code!B8): numeric; default 4000.
function parseListEndRow(cell){
  if(cell == null || cell === '') return 4000;
  const n = typeof cell === 'number' ? cell : parseInt(String(cell).replace(/[^\d]/g, ''), 10);
  return (isFinite(n) && n > 0) ? n : 4000;
}
function workingDaysBetween(d1, d2){
  // signed working-day count from d1 to d2 (Mon–Fri only), weekends excluded
  if(!d1 || !d2) return null;
  let sign = 1; if(d2 < d1){ [d1, d2] = [d2, d1]; sign = -1; }
  let count = 0; let cur = new Date(d1.getTime());
  while(cur <= d2){
    const day = cur.getUTCDay();
    if(day !== 0 && day !== 6) count++;
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return sign * count;
}

function normalizeBool(v){
  if(v === true || v === 'YES' || v === 'TRUE') return 'YES';
  if(v === false || v === 'NO' || v === 'FALSE') return 'NO';
  if(v === '' || v == null) return '';
  return String(v).toUpperCase().trim();
}

function readBlock(sheet, codeCol){
  const items = []; const codes = new Set();
  const labelCol = numToCol(colToNum(codeCol) + 1);
  for(let r = 2; r <= sheet.maxRow; r++){
    const row = sheet.rows[r]; if(!row) continue;
    const code = row[codeCol];
    if(code == null || code === '') continue;
    const label = row[labelCol] != null ? String(row[labelCol]) : '';
    items.push({ code: String(code), label });
    codes.add(String(code));
  }
  return { items, codes };
}

function readErrorBlock(sheet){
  const map = {}; const order = [];
  for(let r = 2; r <= sheet.maxRow; r++){
    const row = sheet.rows[r]; if(!row) continue;
    const code = row.AI; if(code == null || code === '') continue;
    map[String(code)] = { group: row.AJ != null ? String(row.AJ) : '', rule: row.AK != null ? String(row.AK) : '', severity: row.AL != null ? String(row.AL) : 'Warning' };
    order.push(String(code));
  }
  return { map, order };
}

export function buildModel(workbook, options = {}){
  const today = options.today ? isoToDate(options.today) : new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const codeSheet = workbook.sheets['Code'];

  // --- project start date (Code!B6, value column) — x-axis anchor for time-based views ---
  // Code!A6 is the label ("Project Start Date"); the actual date value is in B6.
  const projectStartDate = parseProjectStart(codeSheet.rows[6] && codeSheet.rows[6].B);
  // --- List End Row (Code!B8) — advisory row limit; data beyond it is kept, not dropped ---
  const listEndRow = parseListEndRow(codeSheet.rows[8] && codeSheet.rows[8].B);

  // --- column map (rows 12-36) ---
  const columnMap = {}; const fieldOrder = [];
  for(let r = 12; r <= 36; r++){
    const row = codeSheet.rows[r]; if(!row) continue;
    const field = row.A; const raw = row.B; const type = row.C;
    if(!field || !raw) continue;
    const letter = String(raw).replace(/^Column-/, '').replace(/[^A-Za-z]/g, '').toUpperCase();
    columnMap[field] = { letter, type: (type || '').trim(), index: colToNum(letter) };
    fieldOrder.push(field);
  }
  const letterOf = f => columnMap[f] ? columnMap[f].letter : null;
  const typeOf = f => columnMap[f] ? columnMap[f].type : null;

  // --- review durations (rows 9-11) ---
  const reviewRules = { firstClientReview: 20, subsequentClientReview: 14, resubmissionDuration: 14 };
  for(let r = 9; r <= 11; r++){
    const row = codeSheet.rows[r]; if(!row) continue;
    const name = String(row.A || ''); const val = parseInt(row.B, 10);
    if(isNaN(val)) continue;
    if(/first client review/i.test(name)) reviewRules.firstClientReview = val;
    else if(/subsequent/i.test(name)) reviewRules.subsequentClientReview = val;
    else if(/resubmission/i.test(name)) reviewRules.resubmissionDuration = val;
  }

  // --- lookup blocks ---
  const lookups = {
    stage: readBlock(codeSheet, 'E'),
    uesh: readBlock(codeSheet, 'H'),
    projectCode: readBlock(codeSheet, 'K'),
    prefix: readBlock(codeSheet, 'N'),
    docType: readBlock(codeSheet, 'Q'),
    disciplineCode: readBlock(codeSheet, 'T'),
    authority: readBlock(codeSheet, 'Z'),
    submissionStatus: readBlock(codeSheet, 'AC'),
    approval: readBlock(codeSheet, 'AF'),
  };
  const errorBlock = readErrorBlock(codeSheet);

  // --- BQ reference set ---
  const bqSheet = workbook.sheets['BQ'];
  const bqSet = new Set();
  if(bqSheet){ for(let r = 2; r <= bqSheet.maxRow; r++){ const v = bqSheet.rows[r] && bqSheet.rows[r].A; if(v != null && v !== '') bqSet.add(String(v)); } }

  // --- discipline tab discovery ---
  const ueshNames = [...lookups.uesh.codes];
  const available = [], noListYet = [], excluded = ['BQ', 'Notes', 'Dashboard', 'Code'];
  Object.keys(workbook.sheets).forEach(name => {
    if(excluded.includes(name)) return;
    if(ueshNames.includes(name)) available.push(name);
    else noListYet.push(name); // a non-document-list tab that is not a known discipline
  });
  const noListYetDisciplines = ueshNames.filter(n => !available.includes(n));

  // --- consolidate ---
  const records = [];
  const blankDocIssues = [];
  const warnings = [];
  for(const tab of available){
    const sheet = workbook.sheets[tab]; if(!sheet) continue;
    let tabMaxDataRow = 1;
    for(let r = 2; r <= sheet.maxRow; r++){
      const row = sheet.rows[r]; if(!row) continue;
      const hasContent = Object.values(row).some(v => v !== '' && v != null);
      if(hasContent && r > tabMaxDataRow) tabMaxDataRow = r;
      const fields = {};
      fieldOrder.forEach(f => {
        let v = row[letterOf(f)];
        if(v == null) return;
        if(typeOf(f) === 'Date' && typeof v === 'number'){ const iso = excelSerialToISO(v); if(iso) v = iso; }
        else if(typeOf(f) === 'Boolean'){ v = normalizeBool(v); }
        else v = (typeof v === 'string') ? v : String(v);
        fields[f] = v;
      });
      const docNo = fields['Document No.'];
      if(docNo == null || docNo === ''){
        // V-01: populated row with blank Document No. (still surfaced, not added)
        const otherwise = Object.keys(fields).some(k => k !== 'Document No.' && fields[k] !== '' && fields[k] != null);
        if(otherwise) blankDocIssues.push({ code: 'V-01', sourceTab: tab, rownum: r });
        continue;
      }
      const stage = fields['Stage'] || '';
      const isActive = !EXCLUDE_STAGES.includes(stage);
      records.push({ sourceTab: tab, rownum: r, fields, discipline: fields['UESH Discipline'] || '', stage, isActive, docNo });
    }
    if(tabMaxDataRow > listEndRow){
      warnings.push({ level:'warn', code:'W-ENDROW', tab, actual: tabMaxDataRow, limit: listEndRow,
        message: `List End Row (Code!B8 = ${listEndRow}) exceeded on tab "${tab}": ${tabMaxDataRow} data rows found. All rows are included (none dropped); raise Code!B8 if this is expected.` });
    }
  }

  // --- validation ---
  const issues = [];
  const severityOf = code => (errorBlock.map[code] && errorBlock.map[code].severity) || 'Warning';
  const messageOf = code => (errorBlock.map[code] && errorBlock.map[code].rule) || (`Rule ${code} (generic message)`);
  const mkIssue = (code, rec) => ({
    code, severity: severityOf(code), message: messageOf(code),
    sourceTab: rec ? rec.sourceTab : null, rownum: rec ? rec.rownum : null,
    docNo: rec ? rec.docNo : null, discipline: rec ? rec.discipline : null
  });
  const inSet = (set, v) => v != null && v !== '' && set.has(String(v));

  // V-13 (contract): lookup block with label but empty code
  Object.entries(lookups).forEach(([key, blk]) => {
    blk.items.forEach(it => { if(it.label && !it.code) issues.push({ code: 'V-13', severity: severityOf('V-13'), message: messageOf('V-13') + ` (block ${key})`, sourceTab: 'Code', rownum: null, docNo: null, discipline: null }); });
  });
  blankDocIssues.forEach(b => issues.push(mkIssue('V-01', b)));

  // duplicate Document No. (V-26)
  const docCount = {};
  records.forEach(rec => { const k = rec.docNo; docCount[k] = (docCount[k] || 0) + 1; });

  for(const rec of records){
    const f = rec.fields;
    const M = f['Document No.'];
    const B = f['Stage'] || '';
    const C = f['UESH Discipline'] || '';
    const J = f['Discipline'] || '';
    const I = f['Doc Type'] || '';
    const Q = f['Authority'] || '';
    const W = f['Submission Status'] || '';
    const G = f['Project Code'] || '';
    const H = f['Project Prefix'] || '';
    const K = f['Number'] || '';
    const Y = f['Latest Approval Status'] || '';
    const E = f['BQ Number'] || '';
    const P = f['As-Built'] || '';
    const R = f['Vendor Data'] || '';
    const S = f['Planned 1st Issue Date'] || '';
    const T = f['Forecast 1st Issue Date'] || '';
    const U = f['Actual 1st Issue Date'] || '';
    const V = f['Prolog Number'] || '';
    const X = f['Latest Approval Date'] || '';
    const N = f['Document Title'] || '';

    if(!inSet(lookups.stage.codes, B)) issues.push(mkIssue('V-02', rec));
    if(!inSet(lookups.uesh.codes, C)) issues.push(mkIssue('V-03', rec));
    if(J !== '' && !inSet(lookups.disciplineCode.codes, J)) issues.push(mkIssue('V-04', rec));
    if(I !== '' && !inSet(lookups.docType.codes, I)) issues.push(mkIssue('V-05', rec));
    if(Q !== '' && !inSet(lookups.authority.codes, Q)) issues.push(mkIssue('V-06', rec));
    if(W !== '' && !inSet(lookups.submissionStatus.codes, W)) issues.push(mkIssue('V-07', rec));
    if(Y !== '' && !inSet(lookups.approval.codes, Y)) issues.push(mkIssue('V-08', rec));
    if(P === 'YES' && U === '') issues.push(mkIssue('V-10', rec));
    if(EXCLUDE_STAGES.includes(B)) issues.push(mkIssue('V-12', rec));
    if(G !== '' && !inSet(lookups.projectCode.codes, G)) issues.push(mkIssue('V-14', rec));
    if(/xxxx/i.test(M)) issues.push(mkIssue('V-15', rec));
    // V-17 composition G-H-I-J-K (J = client Discipline Code)
    if(G && H && I && J && K){ const expected = [G, H, I, J, K].join('-'); if(M !== expected) issues.push(mkIssue('V-17', rec)); }
    if((W !== '') !== (V !== '')) issues.push(mkIssue('V-19', rec));
    if(U !== '' && (V === '' || W === '')) issues.push(mkIssue('V-18', rec));
    if(Y === 'APP' && X === '') issues.push(mkIssue('V-11', rec));
    if(W === 'RTR' && (Y === '' || /void/i.test(Y))) issues.push(mkIssue('V-16', rec));
    if(['APP', 'AWC', 'REJ', 'NAP'].includes(Y) && (U === '' || X === '')) issues.push(mkIssue('V-20', rec));
    if(X !== '' && (Y === '' || (U !== '' && isoToDate(X) < isoToDate(U)))) issues.push(mkIssue('V-21', rec));
    // V-09 date order — fire ONCE per document even if multiple pairs are out of order
    if((S && T && isoToDate(T) < isoToDate(S)) ||
       (T && U && isoToDate(U) < isoToDate(T)) ||
       (S && U && isoToDate(U) < isoToDate(S))) issues.push(mkIssue('V-09', rec));
    if(U !== '' && (S === '' || T === '')) issues.push(mkIssue('V-22', rec));
    // V-23 — fire ONCE per document if any date is in the future
    if([S, T, U, X].some(d => d && isoToDate(d) && isoToDate(d) > today)) issues.push(mkIssue('V-23', rec));
    // V-28: a 1st-issue date precedes the declared project start date (Code!B6). Fires once per
    // document if any of Planned/Forecast/Actual is earlier than projectStartDate (only when B6 set).
    if(projectStartDate){ const ps = isoToDate(projectStartDate);
      if((S && isoToDate(S) && isoToDate(S) < ps) || (T && isoToDate(T) && isoToDate(T) < ps) || (U && isoToDate(U) && isoToDate(U) < ps))
        issues.push(mkIssue('V-28', rec)); }
    if(E !== '' && !bqSet.has(String(E))) issues.push(mkIssue('V-24', rec));
    const required = [N, C, B, I, J, G, H, K];
    if(required.some(v => v === '' || v == null)) issues.push(mkIssue('V-25', rec));
    if(docCount[M] > 1) issues.push(mkIssue('V-26', rec));
    const boolVal = v => (v === 'YES' || v === 'NO' || v === '');
    if(!boolVal(P) || !boolVal(R)) issues.push(mkIssue('V-27', rec));
  }

  // --- KPIs (active only) ---
  const active = records.filter(r => r.isActive);
  const cnt = pred => active.filter(pred).length;
  const kpis = {
    totalPlanned: active.length,
    submitted: cnt(r => (r.fields['Actual 1st Issue Date'] || '') !== ''),
    approvedAPP: cnt(r => r.fields['Latest Approval Status'] === 'APP'),
    approvedAWC: cnt(r => r.fields['Latest Approval Status'] === 'AWC'),
    rejected: cnt(r => r.fields['Latest Approval Status'] === 'REJ'),
    notApproved: cnt(r => r.fields['Latest Approval Status'] === 'NAP'),
    asBuiltYes: cnt(r => r.fields['As-Built'] === 'YES'),
    vendorYes: cnt(r => r.fields['Vendor Data'] === 'YES'),
  };

  // --- Overdue (3 flavours) ---
  const dT = isoToDate(todayISO);
  const firstOverdue = active.filter(r => { const t = r.fields['Forecast 1st Issue Date'] || r.fields['Planned 1st Issue Date']; return t && (r.fields['Actual 1st Issue Date'] || '') === '' && isoToDate(t) <= dT; });
  const subsequentOverdue = active.filter(r => {
    const y = r.fields['Latest Approval Status']; const x = r.fields['Latest Approval Date']; const u = r.fields['Actual 1st Issue Date'];
    return u && ['REJ', 'RTR'].includes(y) && x && workingDaysBetween(isoToDate(x), dT) > reviewRules.resubmissionDuration;
  });
  const clientReviewOverdue = active.filter(r => {
    const w = r.fields['Submission Status']; const u = r.fields['Actual 1st Issue Date'];
    return w === 'SUR' && u && workingDaysBetween(isoToDate(u), dT) > reviewRules.firstClientReview;
  });
  kpis.overdueFirst = firstOverdue.length;
  kpis.overdueResubmission = subsequentOverdue.length;
  kpis.overdueClientReview = clientReviewOverdue.length;

  // --- Data completeness % (passing V-17..V-27) ---
  const completenessGroup = new Set(['V-17','V-18','V-19','V-20','V-21','V-22','V-23','V-24','V-25','V-26','V-27']);
  const activeKeys = new Set(active.map(r => r.sourceTab + '!' + r.rownum));
  const activeBad = new Set();
  issues.forEach(i => { if(completenessGroup.has(i.code) && activeKeys.has(i.sourceTab + '!' + i.rownum)) activeBad.add(i.sourceTab + '!' + i.rownum); });
  kpis.completeness = active.length ? Math.round((1 - activeBad.size / active.length) * 1000) / 10 : null;
  kpis.activeDisciplines = new Set(active.map(r => r.discipline).filter(Boolean)).size;

  // --- Charts ---
  const groupCount = (keyFn, scope) => { const m = {}; scope.forEach(r => { const k = keyFn(r); if(k == null || k === '') return; m[k] = (m[k] || 0) + 1; }); return m; };
  const toArr = m => Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
  const approvalMap = groupCount(r => r.fields['Latest Approval Status'] || '—', active);
  const approvalStatus = [
    { name: 'APP', value: approvalMap['APP'] || 0 },
    { name: 'AWC', value: approvalMap['AWC'] || 0 },
    { name: 'REJ', value: approvalMap['REJ'] || 0 },
    { name: 'NAP', value: approvalMap['NAP'] || 0 },
    { name: 'Not Available', value: active.filter(r => !['APP','AWC','REJ','NAP'].includes(r.fields['Latest Approval Status'] || '')).length },
  ];
  const charts = {
    docsByDiscipline: toArr(groupCount(r => r.discipline, active)),
    issueProgress: [
      { name: 'Planned', value: cnt(r => (r.fields['Planned 1st Issue Date'] || '') !== '') },
      { name: 'Forecast', value: cnt(r => (r.fields['Forecast 1st Issue Date'] || '') !== '') },
      { name: 'Actual', value: cnt(r => (r.fields['Actual 1st Issue Date'] || '') !== '') },
    ],
    approvalStatus,
    asBuilt: [
      { name: 'YES', value: cnt(r => r.fields['As-Built'] === 'YES') },
      { name: 'NO', value: cnt(r => r.fields['As-Built'] === 'NO') },
    ],
    byAuthority: toArr(groupCount(r => r.fields['Authority'], active)),
    byDocType: toArr(groupCount(r => r.fields['Doc Type'], active)),
    scheduleVariance: (() => {
      const ov = new Set([...firstOverdue, ...subsequentOverdue, ...clientReviewOverdue].map(r => r.sourceTab + '!' + r.rownum));
      const atRisk = active.filter(r => { const t = r.fields['Forecast 1st Issue Date'] || r.fields['Planned 1st Issue Date']; return t && (r.fields['Actual 1st Issue Date'] || '') === '' && isoToDate(t) > dT && workingDaysBetween(dT, isoToDate(t)) <= 14; });
      const onTrack = active.filter(r => { const k = r.sourceTab + '!' + r.rownum; return !ov.has(k) && !atRisk.includes(r); });
      return [
        { name: 'On track', value: onTrack.length },
        { name: 'At risk', value: atRisk.length },
        { name: 'Overdue – 1st', value: firstOverdue.length },
        { name: 'Overdue – Resub', value: subsequentOverdue.length },
        { name: 'Overdue – Client', value: clientReviewOverdue.length },
      ];
    })(),
    dqByDiscipline: [],
    dqByRule: toArr(groupCount(i => i.code, issues)),
  };
  const dqDisc = {}; issues.forEach(i => { if(i.discipline){ dqDisc[i.discipline] = (dqDisc[i.discipline] || 0) + 1; } });
  charts.dqByDiscipline = toArr(dqDisc);

  const overdueLists = {
    first: firstOverdue.map(r => ({ docNo: r.docNo, discipline: r.discipline, forecast: r.fields['Forecast 1st Issue Date'], sourceTab: r.sourceTab })),
    subsequent: subsequentOverdue.map(r => ({ docNo: r.docNo, discipline: r.discipline, lastOutcome: r.fields['Latest Approval Status'], approvalDate: r.fields['Latest Approval Date'], sourceTab: r.sourceTab })),
    clientReview: clientReviewOverdue.map(r => ({ docNo: r.docNo, discipline: r.discipline, submitted: r.fields['Actual 1st Issue Date'], sourceTab: r.sourceTab })),
  };

  return {
    meta: { generatedAt: new Date().toISOString(), workbookName: options.workbookName || '', today: todayISO, projectStartDate, listEndRow },
    contract: { columnMap, fieldOrder, reviewRules, errorBlock, noListYetDisciplines, lookups },
    tabs: { available, noListYet, excluded },
    records, issues, warnings, kpis, charts, overdueLists, completenessGroup: [...completenessGroup],
  };
}
