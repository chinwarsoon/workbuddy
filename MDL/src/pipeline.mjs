// pipeline.mjs — builds the consolidated document model from a parsed workbook.
// Pure logic (no DOM). Consumed by render (browser) and test_pipeline (Node).

export const EXCLUDE_STAGES = ['Deleted', 'Void', 'Superseded'];

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
// Handles BOTH a raw serial number AND a serial stored as TEXT — parseCodeSheet
// stringifies metadata values, so "46096" arrives as a string. A numeric string is
// treated as an Excel serial; otherwise Date() would read it as year 46096.
function parseProjectStart(cell){
  if(cell == null || cell === '') return null;
  let serial = NaN;
  if(typeof cell === 'number' && isFinite(cell)) serial = cell;
  else if(typeof cell === 'string' && /^\d{1,6}(\.\d+)?$/.test(cell.trim())) serial = parseFloat(cell);
  if(isFinite(serial)) return excelSerialToISO(serial);
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

function normalizeBool(v){
  if(v === true || v === 'YES' || v === 'TRUE') return 'YES';
  if(v === false || v === 'NO' || v === 'FALSE') return 'NO';
  if(v === '' || v == null) return '';
  return String(v).toUpperCase().trim();
}

// Spreadsheet formula-error tokens. A cell whose cached value equals one of these is not a valid
// value; it is treated as absent (undefined) during normalization (spec §3.8.1) and counted so a
// fatal W-FORMULA warning can be raised per affected column.
const EXCEL_ERROR_TOKENS = new Set([
  '#NULL!', '#DIV/0!', '#VALUE!', '#REF!', '#NAME?', '#N/A', '#NUM!',
  '#GETTING_DATA', '#SPILL!', '#CALC!'
]);
export function isExcelError(v){
  if(typeof v !== 'string') return false;
  const s = v.trim().toUpperCase();
  return s !== '' && EXCEL_ERROR_TOKENS.has(s);
}

// I-77: single approval-status classifier, gated on the submission date.
// `Actual 1st Issue Date` (col U) is the gate `u`; `Latest Approval Status` (col Y) is `a`.
// A formula-error cell counts as PRESENT for the gate (a corrupt date must not be silently
// treated as "not submitted") and as an error state for the status. This is the one source of
// truth for the approval KPIs (I-78), the Panel 3 matrix (I-79), the Panel 4 chart (I-80) and
// the Panel 8 table pills. Record Error stays a single umbrella (approval without submission,
// or any unrecognized status code) — the user must correct the record first.
const APPROVAL_CODES = new Set(['APP', 'AWC', 'REJ', 'NAP']);

function fieldHasError(r, f){ return !!(r.fieldErrors && r.fieldErrors.has(f)); }
function fieldPresent(r, f){
  const v = r.fields[f];
  return (v !== undefined && v !== null && String(v).trim() !== '') || fieldHasError(r, f);
}

export function approvalCategory(r){
  const u = fieldPresent(r, 'Actual 1st Issue Date');
  const f = 'Latest Approval Status';
  const aRaw = r.fields[f];
  let a;
  if(fieldHasError(r, f)) a = 'error';
  else if(aRaw === undefined || aRaw === null || String(aRaw).trim() === '') a = 'blank';
  else if(APPROVAL_CODES.has(aRaw)) a = aRaw;   // APP / AWC / REJ / NAP
  else a = 'invalid';                           // unrecognized present value

  if(u){
    if(a === 'error') return 'Submitted – Status Unavailable';
    if(a === 'blank') return 'Submitted – Pending Review';
    if(a === 'invalid') return 'Record Error';
    return a;                                   // APP / AWC / REJ / NAP
  }
  // not submitted
  if(a === 'invalid') return 'Record Error';     // bad status code, no submission
  if(a === 'error' || a === 'blank') return 'Not Submitted';
  return 'Record Error';                         // known approval code but no submission (Case 4a)
}

// ============================================================================
// Code-sheet table-discovery helpers (canonical names shared with the PPP
// dashboard, per spec §3.1.1). The Code sheet is a set of TABLES discovered at
// runtime — no hardcoded row/column ranges.
// ============================================================================

// 0-based column index -> letter  (e.g. 31 -> "AF")
export function colLetter(i){ let n=i+1,s=''; while(n>0){ const m=(n-1)%26; s=String.fromCharCode(65+m)+s; n=(n-m-1)/26; } return s; }
// "Column-AE" -> 0-based index
export function colRefToIndex(ref){
  if(!ref) return -1;
  const m = String(ref).match(/Column-([A-Z]+)/i);
  if(!m) return -1;
  let idx = 0;
  for(const ch of m[1].toUpperCase()) idx = idx*26 + (ch.charCodeAt(0)-64);
  return idx-1;
}

// The vocabulary of expected document-list field labels (the contract's field
// catalogue). Positions are resolved at runtime from the Code column map, so a
// field may live on any row. 'Latest Approval Status' is included deliberately:
// it sits at row 37 in the source workbook and was previously dropped by the
// hard-coded 12–36 scan.
const MDL_FIELD_KEYS = [
  'SNo.', 'Stage', 'UESH Discipline', 'P6 Activity ID', 'BQ Number', 'System',
  'Project Code', 'Project Prefix', 'Doc Type', 'Discipline', 'Number', 'Rev',
  'Document No.', 'Document Title', 'Notes', 'As-Built', 'Authority', 'Vendor Data',
  'Planned 1st Issue Date', 'Forecast 1st Issue Date', 'Actual 1st Issue Date',
  'Prolog Number', 'Submission Status', 'Latest Approval Date', 'Latest Approval Status'
];

// Expected lookup-block header texts (row 1), keyed by logical name. The code
// column is matched exactly (or by prefix, case-insensitive) and the description
// column is always code+1. Blocks are separated by blank columns, which are
// skipped naturally because we match by header, not by position.
const LOOKUP_HEADERS = {
  stage:         ['Stage Code'],
  uesh:          ['UESH Discipline'],
  projectCode:   ['WBS Contract Code'],
  prefix:        ['PROJECT PREFIX'],
  docType:       ['Doc Code'],
  disciplineCode:['Discipline Code'],
  authority:     ['Authority Code'],
  submissionStatus:['Submission Status Code'],
  approval:      ['Approval Code'],
  errorCode:     ['Error Code'],
  errorRule:     ['Rule'],
  errorSeverity: ['Severity'],
  errorGroup:    ['Group'],
};

// Scan the WHOLE Code sheet (label in A, value in B, type in C). Returns
// keyed-by-label metadata; positions are never assumed.
export function parseCodeSheet(codeSheet){
  const meta = {}, metaTypes = {};
  for(let r = 2; r < codeSheet.rows.length; r++){
    const row = codeSheet.rows[r]; if(!row) continue;
    const key = row.A; const val = row.B; const t = row.C;
    if(key == null || String(key).trim() === '') continue;
    if(val == null || String(val).trim() === '') continue;
    const k = String(key).trim();
    meta[k] = String(val).trim();
    if(t != null && String(t).trim() !== '') metaTypes[k] = String(t).trim();
  }
  return { meta, metaTypes };
}

// Field label -> column index, resolved from the Code column map.
export function buildFieldToCol(meta){
  const map = {};
  for(const field of MDL_FIELD_KEYS){
    const colRef = meta[field];
    if(colRef != null){
      const idx = colRefToIndex(colRef);
      if(idx >= 0) map[field] = idx;
    }
  }
  return map;
}

// Field -> DataType map (from the Code!C column).
export function parseFieldTypes(codeSheet){
  const types = {}; let found = 0;
  for(let r = 2; r < codeSheet.rows.length; r++){
    const row = codeSheet.rows[r]; if(!row) continue;
    const key = row.A, t = row.C;
    if(key == null || String(key).trim() === '') continue;
    if(t == null || String(t).trim() === '') continue;
    types[String(key).trim()] = String(t).trim(); found++;
  }
  return { types, found };
}

// Locate each lookup block by its ROW-1 HEADER text. Exact match wins, then
// case-insensitive prefix. Returns { idx, src } keyed by LOOKUP_HEADERS keys.
export function findLookupColumns(codeSheet){
  const hdr = codeSheet.rows[1] || {};
  const idx = {}, src = {};
  const N = h => String(h == null ? '' : h).replace(/\s+/g, ' ').trim().toLowerCase();
  for(const [k, rawNames] of Object.entries(LOOKUP_HEADERS)){
    const names = rawNames.map(N);  // normalize for case-insensitive matching (spec §3.1.1)
    let found = -1;
    for(let c = 0; c < 100; c++){ const h = N(hdr[colLetter(c)]); if(h && names.indexOf(h) >= 0){ found = c; break; } }
    if(found < 0){ for(let c = 0; c < 100; c++){ const h = N(hdr[colLetter(c)]); if(h && names.some(n => h.indexOf(n) === 0)){ found = c; break; } } }
    if(found >= 0){ idx[k] = found; src[k] = colLetter(found); }
  }
  return { idx, src };
}

// Read a column's values from `start` (first data-row index in rows[]) downward;
// stop after 3 consecutive blanks (safety cap +300). Mirrors PPP readLookupCol.
export function readLookupCol(sheet, c, start){
  if(c == null) return [];
  const out = []; let blankRun = 0;
  for(let r = start; r < sheet.rows.length && r < start + 300; r++){
    const row = sheet.rows[r]; if(!row){ blankRun++; if(blankRun >= 3) break; continue; }
    const v = row[colLetter(c)];
    if(v == null || String(v).trim() === ''){ blankRun++; if(blankRun >= 3) break; continue; }
    blankRun = 0; out.push(String(v).trim());
  }
  return out;
}

// Read a code -> description map for a lookup block.
export function readLookupMap(sheet, codeCol, descCol, start){
  if(codeCol == null) return {};
  const map = {}; let blankRun = 0;
  for(let r = start; r < sheet.rows.length && r < start + 300; r++){
    const row = sheet.rows[r]; if(!row){ blankRun++; if(blankRun >= 3) break; continue; }
    const c = row[colLetter(codeCol)];
    if(c == null || String(c).trim() === ''){ blankRun++; if(blankRun >= 3) break; continue; }
    blankRun = 0;
    const d = (descCol == null || row[colLetter(descCol)] == null) ? '' : String(row[colLetter(descCol)]).trim();
    map[String(c).trim()] = d;
  }
  return map;
}

export function buildModel(workbook, options = {}){
  const today = options.today ? isoToDate(options.today) : new Date();
  // As-of date for ALL Overdue / Approval / look-ahead / completeness math = the VIEWER'S
// LOCAL calendar day, not UTC. Building from toISOString() (UTC) caused a 1-day off-by-one
// near local midnight (e.g. 10pm ET => next-day UTC). Use local date components.
const todayISO = options.today
  ? String(options.today).slice(0, 10)
  : (() => { const n = new Date(); const p = x => String(x).padStart(2, '0'); return `${n.getFullYear()}-${p(n.getMonth() + 1)}-${p(n.getDate())}`; })();
  const codeSheet = workbook.sheets['Code'];
  const warnings = []; // declared once, up front, so discovery warnings are recorded early

  // --- metadata block: read by LABEL across the whole Code sheet (no fixed rows) ---
  const cs = parseCodeSheet(codeSheet);
  const codeMeta = cs.meta; const metaTypes = cs.metaTypes;
  // --- project start date / List End Row / titles — read from metadata by label ---
  const projectStartDate = parseProjectStart(codeMeta['Project Start Date']);
  const listEndRow = parseListEndRow(codeMeta['List End Row']);
  const projectTitle = (codeMeta['Project Title'] != null && codeMeta['Project Title'] !== '') ? String(codeMeta['Project Title']) : null;
  const dashboardTitle = (codeMeta['Dashboard Title'] != null && codeMeta['Dashboard Title'] !== '') ? String(codeMeta['Dashboard Title']) : null;

  // --- column map: discover field -> column from the Code sheet by label (no 12–36 bound) ---
  const colRefs = buildFieldToCol(codeMeta);
  const fieldTypes = parseFieldTypes(codeSheet).types;
  const columnMap = {}; const fieldOrder = [];
  for(const f of MDL_FIELD_KEYS){
    const idx = colRefs[f];
    if(idx == null){ warnings.push({ level:'warn', code:'V-COL', tab:'Code', message:`Column-map row missing for field "${f}" — field will be empty.` }); continue; }
    const letter = colLetter(idx);
    columnMap[f] = { letter, type: (fieldTypes[f] || '').trim(), index: idx + 1 };
    fieldOrder.push(f);
  }
  const letterOf = f => columnMap[f] ? columnMap[f].letter : null;
  const typeOf = f => columnMap[f] ? columnMap[f].type : null;

  // --- review durations: read from metadata by label (regex), not fixed rows 9–11 ---
  const reviewRules = { firstClientReview: 20, resubmissionDuration: 14 };
  for(const [k, v] of Object.entries(codeMeta)){
    if(/first client review/i.test(k)) reviewRules.firstClientReview = parseInt(v, 10) || reviewRules.firstClientReview;
    else if(/resubmission/i.test(k)) reviewRules.resubmissionDuration = parseInt(v, 10) || reviewRules.resubmissionDuration;
  }

  // --- lookup blocks: discover each by its row-1 header (no fixed column letters) ---
  const lk = findLookupColumns(codeSheet);
  for(const [k, hdr] of Object.entries(LOOKUP_HEADERS)){
    if(lk.idx[k] == null) warnings.push({ level:'warn', code:'V-18', tab:'Code', message:`Lookup block not found in row 1: "${hdr[0]}".` });
  }
  const lookupBlock = (codeKey) => {
    const codeIdx = lk.idx[codeKey];
    if(codeIdx == null) return { items: [], codes: new Set() };
    const map = readLookupMap(codeSheet, codeIdx, codeIdx + 1, 2);
    const items = Object.entries(map).map(([code, label]) => ({ code, label }));
    const codes = new Set(Object.keys(map));
    return { items, codes };
  };
  const lookups = {
    stage: lookupBlock('stage'),
    uesh: lookupBlock('uesh'),
    projectCode: lookupBlock('projectCode'),
    prefix: lookupBlock('prefix'),
    docType: lookupBlock('docType'),
    disciplineCode: lookupBlock('disciplineCode'),
    authority: lookupBlock('authority'),
    submissionStatus: lookupBlock('submissionStatus'),
    approval: lookupBlock('approval'),
  };
  // --- Error block: code -> {group, rule, severity} via discovered columns ---
  const eCode = lk.idx['errorCode'];
  const errorBlock = { map: {}, order: [] };
  if(eCode != null){
    const eRule = readLookupMap(codeSheet, eCode, lk.idx['errorRule'], 2);
    const eSev  = readLookupMap(codeSheet, eCode, lk.idx['errorSeverity'], 2);
    const eGrp  = readLookupMap(codeSheet, eCode, lk.idx['errorGroup'], 2);
    for(const c of Object.keys(eRule)){
      errorBlock.map[c] = { group: eGrp[c] || '', rule: eRule[c] || '', severity: eSev[c] || 'Warning' };
      errorBlock.order.push(c);
    }
  }

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
  const errorCounts = {};   // I-74: per-field count of spreadsheet formula-error cells
  const blankDocIssues = [];
  for(const tab of available){
    const sheet = workbook.sheets[tab]; if(!sheet) continue;
    let tabMaxDataRow = 1;
    for(let r = 2; r <= sheet.maxRow; r++){
      const row = sheet.rows[r]; if(!row) continue;
      const hasContent = Object.values(row).some(v => v !== '' && v != null);
      if(hasContent && r > tabMaxDataRow) tabMaxDataRow = r;
      const fields = {};
      const fieldErrors = new Set();   // I-77: per-record set of fields whose raw cell was a formula-error token
      fieldOrder.forEach(f => {
        let v = row[letterOf(f)];
        if(v == null || v === '') return;                       // blank -> absent (undefined)
        if(typeof v === 'string' && isExcelError(v)){           // formula error -> absent + counted
          errorCounts[f] = (errorCounts[f] || 0) + 1;
          fieldErrors.add(f);
          return;
        }
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
      records.push({ sourceTab: tab, rownum: r, fields, fieldErrors, discipline: fields['UESH Discipline'] || '', stage, isActive, docNo });
    }
    if(tabMaxDataRow > listEndRow){
      warnings.push({ level:'warn', code:'W-ENDROW', tab, actual: tabMaxDataRow, limit: listEndRow,
        message: `List End Row (Code!B8 = ${listEndRow}) exceeded on tab "${tab}": ${tabMaxDataRow} data rows found. All rows are included (none dropped); raise Code!B8 if this is expected.` });
    }
  }

  // --- I-74/I-75: aggregate formula-error cells into ONE fatal warning per affected column ---
  // (deliberately NOT pushed to model.issues — those are row-keyed and filtered by activeSet, so a
  // column summary would never surface in Panel 12). They route to the top errBanner as fatal.
  for(const f of fieldOrder){
    const n = errorCounts[f];
    if(!n) continue;
    warnings.push({
      level: 'fatal', code: 'W-FORMULA', tab: f,
      message: `${f} (column ${letterOf(f)}) contains ${n} spreadsheet formula-error cell${n === 1 ? '' : 's'} (e.g. #VALUE!). These are not valid values and silently corrupt counts, so the affected KPIs / metrics are untrustworthy. In Excel, fix the formula errors (e.g. a referenced sheet such as SubmittalLog may be missing or broken), then force a full recalculation (Ctrl+Alt+F9) and save the file so values are stored; re-open here.`
    });
  }

  // --- I-82: Record Error consistency notice (distinct from W-FORMULA, condition summary) ---
  // Fires where Latest Approval Status is present (any value, incl. unrecognized) but Actual 1st
  // Issue Date is absent — the record must be corrected before approval KPIs are trustworthy.
  // A date formula-error counts as present, and an invalid status code WITH a submission date is a
  // separate Record Error handled by the KPI/chart, not this notice.
  const recErrDocs = records.filter(r => {
    const a = r.fields['Latest Approval Status'];
    const aPresent = a !== undefined && a !== null && String(a).trim() !== '' && !(r.fieldErrors && r.fieldErrors.has('Latest Approval Status'));
    const uAbsent = (r.fields['Actual 1st Issue Date'] || '') === '' && !(r.fieldErrors && r.fieldErrors.has('Actual 1st Issue Date'));
    return aPresent && uAbsent;
  });
  if(recErrDocs.length){
    warnings.push({
      level: 'warn', code: 'W-RECERR', tab: 'Process',
      message: `${recErrDocs.length} document(s) have an approval status but no Actual 1st Issue Date (Record Error). Correct the record(s) — add the submission date or remove the stray status — before relying on the approval KPIs.`
    });
  }

  // --- validation ---
  const issues = [];
  const severityOf = code => (errorBlock.map[code] && errorBlock.map[code].severity) || 'Warning';
  const messageOf = code => (errorBlock.map[code] && errorBlock.map[code].rule) || (`Rule ${code} (generic message)`);
  // `field` = the source column the business rule checks; `value` = the offending cell value
  // the pipeline found (the validation result). Both surface in the Validation panel (spec §4.5).
  const mkIssue = (code, rec, field, value) => ({
    code, severity: severityOf(code), message: messageOf(code),
    sourceTab: rec ? rec.sourceTab : null, rownum: rec ? rec.rownum : null,
    docNo: rec ? rec.docNo : null, discipline: rec ? rec.discipline : null,
    field: field || null, value: (value === undefined ? null : value)
  });
  const inSet = (set, v) => v != null && v !== '' && set.has(String(v));

  // V-13 (contract): lookup block with label but empty code
  Object.entries(lookups).forEach(([key, blk]) => {
    blk.items.forEach(it => { if(it.label && !it.code) issues.push({ code: 'V-13', severity: severityOf('V-13'), message: messageOf('V-13') + ` (block ${key})`, sourceTab: 'Code', rownum: null, docNo: null, discipline: null, field: 'lookup block (' + key + ')', value: it.label }); });
  });
  blankDocIssues.forEach(b => issues.push(mkIssue('V-01', b, 'Document No.', '(blank)')));

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

    if(!inSet(lookups.stage.codes, B)) issues.push(mkIssue('V-02', rec, 'Stage', B));
    if(!inSet(lookups.uesh.codes, C)) issues.push(mkIssue('V-03', rec, 'UESH Discipline', C));
    if(J !== '' && !inSet(lookups.disciplineCode.codes, J)) issues.push(mkIssue('V-04', rec, 'Discipline Code', J));
    if(I !== '' && !inSet(lookups.docType.codes, I)) issues.push(mkIssue('V-05', rec, 'Doc Type', I));
    if(Q !== '' && !inSet(lookups.authority.codes, Q)) issues.push(mkIssue('V-06', rec, 'Authority', Q));
    if(W !== '' && !inSet(lookups.submissionStatus.codes, W)) issues.push(mkIssue('V-07', rec, 'Submission Status', W));
    if(Y !== '' && !inSet(lookups.approval.codes, Y)) issues.push(mkIssue('V-08', rec, 'Latest Approval Status', Y));
    if(P === 'YES' && U === '') issues.push(mkIssue('V-10', rec, 'Actual 1st Issue Date', U));
    if(EXCLUDE_STAGES.includes(B)) issues.push(mkIssue('V-12', rec, 'Stage', B));
    if(G !== '' && !inSet(lookups.projectCode.codes, G)) issues.push(mkIssue('V-14', rec, 'Project Code', G));
    if(/xxxx/i.test(M)) issues.push(mkIssue('V-15', rec, 'Document No.', M));
    // V-17 composition G-H-I-J-K (J = client Discipline Code)
    if(G && H && I && J && K){ const expected = [G, H, I, J, K].join('-'); if(M !== expected) issues.push(mkIssue('V-17', rec, 'Document No.', M)); }
    if((W !== '') !== (V !== '')) issues.push(mkIssue('V-19', rec, 'Submission Status', W));
    if(U !== '' && (V === '' || W === '')) issues.push(mkIssue('V-18', rec, 'Actual 1st Issue Date', U));
    if(Y === 'APP' && X === '') issues.push(mkIssue('V-11', rec, 'Latest Approval Status', Y));
    if(W === 'RTR' && (Y === '' || /void/i.test(Y))) issues.push(mkIssue('V-16', rec, 'Submission Status', W));
    if(['APP', 'AWC', 'REJ', 'NAP'].includes(Y) && (U === '' || X === '')) issues.push(mkIssue('V-20', rec, 'Latest Approval Status', Y));
    if(X !== '' && (Y === '' || (U !== '' && isoToDate(X) < isoToDate(U)))) issues.push(mkIssue('V-21', rec, 'Latest Approval Date', X));
    // V-09 date order — fire ONCE per document even if multiple pairs are out of order
    if((S && T && isoToDate(T) < isoToDate(S)) ||
       (T && U && isoToDate(U) < isoToDate(T)) ||
       (S && U && isoToDate(U) < isoToDate(S))) issues.push(mkIssue('V-09', rec, 'Date Order', 'dates out of order'));
    if(U !== '' && (S === '' || T === '')) issues.push(mkIssue('V-22', rec, 'Actual 1st Issue Date', U));
    // V-23 — fire ONCE per document if any date is in the future
    { const fut=[S,T,U,X].find(d=>d&&isoToDate(d)&&isoToDate(d)>today); if(fut) issues.push(mkIssue('V-23', rec, 'Future Date', fut)); }
    // V-28: a 1st-issue date precedes the declared project start date (Code!B6). Fires once per
    // document if any of Planned/Forecast/Actual is earlier than projectStartDate (only when B6 set).
    if(projectStartDate){ const ps = isoToDate(projectStartDate);
      const pre=[S,T,U].find(d=>d&&isoToDate(d)&&isoToDate(d)<ps);
      if(pre) issues.push(mkIssue('V-28', rec, '1st Issue Date', pre)); }
    if(E !== '' && !bqSet.has(String(E))) issues.push(mkIssue('V-24', rec, 'BQ Number', E));
    const required = [N, C, B, I, J, G, H, K];
    { const miss = required.filter(v => v === '' || v == null); if(miss.length) issues.push(mkIssue('V-25', rec, 'Required Field', miss.join(', '))); }
    if(docCount[M] > 1) issues.push(mkIssue('V-26', rec, 'Document No.', M));
    const boolVal = v => (v === 'YES' || v === 'NO' || v === '');
    if(!boolVal(P) || !boolVal(R)) issues.push(mkIssue('V-27', rec, 'Vendor Data', !boolVal(P)?P:R));
  }

  // --- Data-completeness group (S3 contract) ---
  // The set of validation codes that count toward the data-completeness %. It is a
  // validation constant (not an aggregation) and is consumed by deriveView (S4) to compute
  // the completeness %. The actual aggregation now lives solely in deriveView (spec §3.8),
  // so buildModel performs S2 (normalise) + S3 (validate) only — no KPI/chart math here.
  const completenessGroup = new Set(['V-17','V-18','V-19','V-20','V-21','V-22','V-23','V-24','V-25','V-26','V-27']);

  return {
    meta: { generatedAt: new Date().toISOString(), workbookName: options.workbookName || '', today: todayISO, projectStartDate, listEndRow, projectTitle, dashboardTitle },
    contract: { columnMap, fieldOrder, reviewRules, errorBlock, noListYetDisciplines, lookups },
    tabs: { available, noListYet, excluded },
    records, issues, warnings, completenessGroup: [...completenessGroup],
  };
}
