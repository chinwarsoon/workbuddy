// fixtures.mjs — synthetic workbook builders for Tier-1 pipeline tests.
// PPP builder produces the in-memory { PPP, Code } grid that PPP's buildModel() accepts
// (proven in PPP/test/lib/wb.mjs). MDL builder produces the { sheets:{name:{rows,maxRow}} }
// shape that MDL's buildModel() expects. No files on disk needed for the pipeline layer.

const colLetter = i => { let s=''; let n=i+1; while(n>0){ const m=(n-1)%26; s=String.fromCharCode(65+m)+s; n=(n-m-1)/26; } return s; };
export { colLetter };

// ---------------------------------------------------------------------------
// PPP
// ---------------------------------------------------------------------------
const PPP_FIELDS = {
  title:0, packageNo:1, discipline:2, criticality:3, status:4, engineer:5, poNo:6,
  leadTime:7, mrPlan:8, mrActual:9, poPlan:10, poActual:11, vdPlan:12, vdActual:13,
  fatPlan:14, fatActual:15, rosPlan:16, rosActual:17, itemCategory:18, supplier:19,
  buyer:20, pe:21, sNo:22, area:23, equipmentTags:24, packageNotes:25, quantity:26
};
const PPP_LABEL = {
  title:'Package Title', packageNo:'Package No.', discipline:'Discipline', criticality:'Criticality',
  leadTime:'Estimate Lead Time', status:'Package Status', poNo:'PO Number', engineer:'Design Engineer',
  supplier:'Supplier', buyer:'Buyer', pe:'Project Engineer', mrPlan:'MR Plan Date', mrActual:'MR Actual Date',
  poPlan:'PO Plan Date', poActual:'PO Actual Date', vdPlan:'VD Approval Plan Date', vdActual:'VD Approval Actual Date',
  fatPlan:'FAT Plan Date', fatActual:'FAT Actual Date', rosPlan:'ROS Plan Date', rosActual:'ROS Actual Date',
  itemCategory:'Item Category', area:'Area', equipmentTags:'Equipment Tags', packageNotes:'Package Notes', quantity:'Quantity'
};

const PPP_DEFAULT_DISC = [['Civil','CIV'],['Mechanical','MEC'],['Electrical','ELE']];
const PPP_DEFAULT_CRIT = [['Low','1'],['Medium','2'],['High','3'],['Critical','4']];
const PPP_DEFAULT_STAT = [['Not Started','NS'],['Material Released','MR'],['Vendor Info','VI'],['PO Issued','PO'],
  ['Vendor Data Approved','VDA'],['Fabrication','FAB'],['FAT','FAT'],['Delivered','DEL'],['Receive Inspection','RI']];
const PPP_DEFAULT_CAT = [['Pump','PMP'],['Valve','VLV'],['Motor','MOT']];
const PPP_DEFAULT_ERRS = [
  ['V-01','Rows inside the data range with a blank Package Title are skipped','info','Structure / Rows','system','check'],
  ['V-02','Value is a number but not a real Excel date','error','Dates','data','check'],
  ['V-03','Text value cannot be read as a date','error','Dates','data','check'],
  ['V-04','Value is not numeric','error','Values / Numeric','data','check'],
  ['V-05','Criticality must be one of the listed values','error','Criticality','data','check'],
  ['V-06','Discipline not found in the Code sheet list','warning','Discipline','data','check'],
  ['V-07','Status not found in the Code sheet list','error','Status','data','check'],
  ['V-08','Stage plan dates are out of sequence','warning','Dates / Stages','data','check'],
  ['V-09','Actual date entered but the Plan is empty','warning','Dates / Stages','data','check'],
  ['V-10','Actual date is later than today','warning','Dates / Stages','data','check'],
  ['V-11','Duplicate Package No.','warning','Identity','data','check'],
  ['V-12','Same engineer written different ways','warning','Engineer','data','check'],
  ['V-13','Rows after List End Row contain a Package Title but are excluded','warning','Structure / Rows','system','check'],
  ['V-14','Lead time missing on more than 50% of packages','warning','Lead time','data','check'],
  ['V-15','Code-sheet config / Data-Type mismatch','error','Config / Code sheet','system','check'],
  ['V-16','Column C has no Data Type values','warning','Config / Code sheet','system','check'],
  ['V-17','Item Category not found in the Code sheet list','info','Category','data','check'],
  ['V-18','Lookup block not found in row 1','warning','Config / Lookup','system','check'],
  ['V-19','Header Row has no value in the Package Title column','warning','Config / Code sheet','system','check'],
  ['V-20','Expected data rows exceed actual parsed rows','warning','Structure / Rows','system','check'],
  ['V-21','Rule code has no row in the Code sheet Error table','warning','Config / Workbook','system','check'],
  ['V-22','Lookup code column is empty','warning','Config / Lookup','system','check'],
  ['V-23','Execution progress = 0 (no Actual dates)','warning','Progress / Execution','data','check'],
  ['V-24','Engineer unassigned','warning','Engineer','data','check'],
  ['V-25','Plan-date inconsistency','warning','Dates / Stages','data','check'],
  ['V-26','PO Actual date is set but PO Number is blank','warning','PO / Procurement','data','check']
];

export function pppMakeWorkbook(packages, opts = {}){
  const N = packages.length;
  const code = [];
  code[0] = ['Discipline Description','Discipline Code','Criticality','Criticality Code',
    'Package Status','Status Code','Item Category','Category Code',
    'Error Code','Error Description','Severity','Group','Kind','Trigger'];
  const disc = opts.disc ?? PPP_DEFAULT_DISC;
  const crit = opts.crit ?? PPP_DEFAULT_CRIT;
  const stat = opts.stat ?? PPP_DEFAULT_STAT;
  const cat  = opts.cat  ?? PPP_DEFAULT_CAT;
  const errs = opts.errs ?? PPP_DEFAULT_ERRS;
  const maxRows = Math.max(disc.length, crit.length, stat.length, cat.length);
  for (let i=0;i<maxRows;i++){
    const r=[];
    if (i<disc.length){ r[0]=disc[i][0]; r[1]=disc[i][1]; }
    if (i<crit.length){ r[2]=crit[i][0]; r[3]=crit[i][1]; }
    if (i<stat.length){ r[4]=stat[i][0]; r[5]=stat[i][1]; }
    if (i<cat.length){ r[6]=cat[i][0]; r[7]=cat[i][1]; }
    code.push(r);
  }
  for (let i=0;i<errs.length;i++){ const r=code[i+1]||(code[i+1]=[]); r[8]=errs[i][0]; r[9]=errs[i][1]; r[10]=errs[i][2]; r[11]=errs[i][3]; r[12]=errs[i][4]; r[13]=errs[i][5]; }
  code.push([],[],[]); // 3 blank rows terminate lookup readers
  code.push(['Project Title', opts.projectTitle || 'Test Project','Text']);
  code.push(['Project Code', opts.projectCode || 'PPP-TEST','Text']);
  code.push(['Client', opts.client || 'Test Client','Text']);
  code.push(['Project Start Date', opts.projectStart !== undefined ? opts.projectStart : '2024-01-15','Date']);
  code.push(['AsOf Date', opts.asOf !== undefined ? opts.asOf : '2024-01-15','Date']);
  code.push(['Header Row','1','Number']);
  code.push(['List End Row', String(N+1),'Number']);
  for (const [f,idx] of Object.entries(PPP_FIELDS)) code.push([PPP_LABEL[f],'Column-'+colLetter(idx), idx===7||idx===26?'Number':(idx>=8&&idx<=17)?'Date':'Text']);

  const ppp=[]; ppp[0]=Object.values(PPP_LABEL);
  for (const p of packages){ const row=new Array(27).fill(null); for (const [f,idx] of Object.entries(PPP_FIELDS)){ if (p[f]!==undefined) row[idx]=p[f]; } ppp.push(row); }
  return { PPP: ppp, Code: code };
}

export function pppPkg(over = {}){
  return Object.assign({
    title:'PKG', packageNo:'P1', discipline:'Civil', criticality:'Low', status:'NS',
    engineer:'Dilip', poNo:'PO1', leadTime:120, mrPlan:'2024-02-01', mrActual:'2024-02-15', poPlan:'2024-03-01', itemCategory:'Pump'
  }, over);
}

// ---------------------------------------------------------------------------
// MDL — { sheets:{ name:{ rows:{r:{A,B,C,...}}, maxRow } } }
// ---------------------------------------------------------------------------
function mrows(arr){ const rows=[]; arr.forEach((r,i)=> rows[i+1]=r); return rows; } // array (1-indexed); MDL reads .length + rows[r]

// Default MDL field -> column-letter map (A..), matching MDL_FIELD_KEYS order.
const MDL_FIELD_KEYS = [
  'SNo.', 'Stage', 'UESH Discipline', 'P6 Activity ID', 'BQ Number', 'System',
  'Project Code', 'Project Prefix', 'Doc Type', 'Discipline', 'Number', 'Rev',
  'Document No.', 'Document Title', 'Notes', 'As-Built', 'Authority', 'Vendor Data',
  'Planned 1st Issue Date', 'Forecast 1st Issue Date', 'Actual 1st Issue Date',
  'Prolog Number', 'Submission Status', 'Latest Approval Date', 'Latest Approval Status'
];
function defaultFieldCols(){
  const m={}; MDL_FIELD_KEYS.forEach((f,i)=> m[f]=colLetter(i)); return m;
}

export function mdlMakeWorkbook(opts = {}){
  const disc = opts.disc || opts.discipline || [['Civil','CIV'],['Mechanical','MEC']];
  const uesh = opts.uesh || disc.map(d=>[d[0],d[1]]);      // UESH discipline = also the tab names
  const docType = opts.docType || [['Calculation Note','CN'],['Drawing','DW']];
  const subStatus = opts.subStatus || [['Submitted','SUB'],['Pending Review','PEND']];
  const approval = opts.approval || [['Approved','APP'],['Rejected','REJ']];
  const projCode = opts.projectCode || [['WBS1','P1']];
  const authority = opts.authority || [['Client','CL']];
  const stage = opts.stage || [['MR','MR Issue'],['PO','PO Issue']];
  const errs = opts.errs || [
    ['V-02','not in list','Error','X'],
    ['V-04','Discipline Code not in list','Error','X'],
    ['V-13','lookup label with empty code','Warning','X']
  ];

  const code = [];
  const hdr = {};
  hdr.K='Stage Code'; hdr.M='UESH Discipline'; hdr.O='WBS Contract Code';
  hdr.Q='Doc Code'; hdr.S='Discipline Code'; hdr.U='Authority Code';
  hdr.W='Submission Status Code'; hdr.Y='Approval Code';
  hdr.AA='Error Code'; hdr.AB='Rule'; hdr.AC='Severity'; hdr.AD='Group';
  code.push(hdr);
  const maxL = Math.max(stage.length,uesh.length,projCode.length,docType.length,disc.length,authority.length,subStatus.length,approval.length,errs.length);
  for (let i=0;i<maxL;i++){
    const r={};
    if (i<stage.length){ r.K=stage[i][0]; r.L=stage[i][1]; }
    if (i<uesh.length){ r.M=uesh[i][0]; r.N=uesh[i][1]; }
    if (i<projCode.length){ r.O=projCode[i][0]; r.P=projCode[i][1]; }
    if (i<docType.length){ r.Q=docType[i][0]; r.R=docType[i][1]; }
    if (i<disc.length){ r.S=disc[i][0]; r.T=disc[i][1]; }
    if (i<authority.length){ r.U=authority[i][0]; r.V=authority[i][1]; }
    if (i<subStatus.length){ r.W=subStatus[i][0]; r.X=subStatus[i][1]; }
    if (i<approval.length){ r.Y=approval[i][0]; r.Z=approval[i][1]; }
    if (i<errs.length){ r.AA=errs[i][0]; r.AB=errs[i][1]; r.AC=errs[i][2]; r.AD=errs[i][3]; }
    code.push(r);
  }
  const metaAdd = (k,v,t)=> code.push({A:k,B:v,C:t});
  metaAdd('Project Start Date', opts.projectStart || '2024-01-01','Date');
  metaAdd('List End Row', String(opts.listEndRow || '50'),'Number');
  metaAdd('Review Duration (First Client Review)','20','Number');
  metaAdd('Resubmission Duration','14','Number');
  const fieldCols = opts.fieldCols || defaultFieldCols();
  for (const [f,col] of Object.entries(fieldCols)) code.push({A:f, B:'Column-'+col, C:''});

  const sheets = { Code: { rows: mrows(code), maxRow: code.length } };

  const docs = opts.docs || defaultDocs(disc, uesh);
  const byTab = {};
  for (const d of docs) (byTab[d.tab] = byTab[d.tab] || []).push(d);
  for (const tab of Object.keys(byTab)){
    const rows = [{}];
    for (const d of byTab[tab]){
      const r={};
      for (const [f,col] of Object.entries(fieldCols)){ if (d[f]!==undefined && d[f]!=='') r[col]=d[f]; }
      rows.push(r);
    }
    sheets[tab] = { rows: mrows(rows), maxRow: rows.length };
  }
  return { sheets };
}

function defaultDocs(disc, uesh){
  const docs=[];
  disc.forEach((d,i)=>{
    // In MDL's lookup convention the CODE column holds the discipline NAME and the
    // DESCRIPTION column holds the short code; the discipline TAB is named after the
    // code-column (name) value, so tab = uesh[i][0].
    const tab = uesh[i] ? uesh[i][0] : d[0];
    docs.push({
      tab, 'SNo.':String(i+1), 'Stage':'MR', 'UESH Discipline':(uesh[i]?uesh[i][0]:d[0]), 'Project Code':'P1',
      'Doc Type':'CN', 'Discipline':d[0], 'Number':String(100+i), 'Document No.':'DOC-'+tab+'-'+i,
      'Document Title':'Document '+i, 'Project Prefix':'PR',
      'Planned 1st Issue Date':'2024-02-01', 'Actual 1st Issue Date':'2024-03-01',
      'Submission Status':'SUB', 'Latest Approval Status':'APP'
    });
  });
  return docs;
}

// Column-letter helper exported for configs that need it.
export const _internal = { defaultFieldCols };

// ---------------------------------------------------------------------------
// action-log — in-memory JS state (single-file SPA, no XLSX / no workbook).
// Raw intent (action objects + lookups + meta) → the state object the
// action-log pipeline consumes. Mirrors PPP/MDL's "raw input → pipeline" split.
// ---------------------------------------------------------------------------
export function alMakeState(actions = [], opts = {}){
  const lookups = opts.lookups || {
    disciplines: opts.disciplines || ['Civil','Mechanical','Electrical'],
    statuses: opts.statuses || ['Not Started','On Hold','In Progress','Completed'],
  };
  const meta = opts.meta || { projectStart: '2024-01-01', asOf: opts.asOf || '2024-06-01' };
  return { actions: actions.map(a => ({ ...a })), lookups, meta };
}

// ---------------------------------------------------------------------------
// english-learning — serialized localStorage snapshot (offline PWA, iPhone Safari).
// Raw intent → the persisted state the PWA reads back. Shape mirrors the PWA's
// localStorage keys (vocabulary / reading / progress). No workbook involved.
// ---------------------------------------------------------------------------
export function elMakeStorage(opts = {}){
  const vocabulary = opts.vocabulary || [
    { word:'apple', phase:1, due:'2024-06-10', box:3, known:false },
    { word:'banana', phase:2, due:'2024-06-12', box:2, known:false },
  ];
  const reading = opts.reading || [
    { id:'r1', title:'A day at school', level:'A1', read:true, lastRead:'2024-06-01' },
  ];
  const progress = opts.progress || { dailyStreak:5, lastDaily:'2024-06-09', readingStreak:2, readingIndependent:true };
  return {
    keys: { vocabulary:'el:vocab', reading:'el:reading', progress:'el:progress' },
    vocabulary, reading, progress,
  };
}

// ---------------------------------------------------------------------------
// sub — TWRP C3B2 Document Submittal Dashboard (two-source join + external contract)
// Raw intent (docs per discipline tab + log rows) → { mdl, log, contract } that
// sub/engine/pipeline.js buildModel(mdl, log, { contract }) consumes. The contract
// mirrors sub/config/pipeline_contract.json (requiredSheets = the 11 discipline tabs;
// requiredFields / requiredHeaders match the shipped pipeline). The single shared "Code"
// sheet inevitably yields harmless cross-table junk: every reader filters by its own
// domain, and stray discipline names have no backing sheet so parseMdl skips them.
// ---------------------------------------------------------------------------
const SUB_DISCIPLINES = [
  ['Project','PRJ'],['Construction','CON'],['QAQC','QAC'],['ICA','ICA'],
  ['Process','PRO'],['BS','BS'],['Mech','MEC'],['Piping','PIP'],
  ['Electrical','ELE'],['CSA','CSA'],['BIM','BIM']
];
const SUB_FIELD_COLS = {
  'SNo.':'A','Stage':'B','UESH Discipline':'C','Project Code':'D','Project Prefix':'E',
  'Doc Type':'F','Discipline':'G','Number':'H','Document No.':'I','Document Title':'J',
  'Notes':'K','Planned 1st Issue Date':'L','Forecast 1st Issue Date':'M','Actual 1st Issue Date':'N'
};
const SUB_LOG_HEADERS = [
  'SNo.','Prolog No.','Prolog Subject','Document No.','Revision','Submitted By',
  'Submission Date','Review Period','Target Return Date','Actual Return Date',
  'Review Turnaround Days','Review Delay Days','Submission Status','Approval Status','Resubmission Required'
];
// Only these MDL fields are dates; the rest are text (including Number, which the
// pipeline treats as text). Setting the wrong type makes normalizeValue drop the value.
const SUB_DATE_FIELDS = new Set(['Planned 1st Issue Date','Forecast 1st Issue Date','Actual 1st Issue Date']);
function subContract(){
  return {
    version:'0.2.0',
    title:'Sub Dashboard Pipeline Contract',
    placeholderTokens:['xxxx'],
    metadataLabels:{ projectTitle:'Project Title', dashboardTitle:'Dashboard Title', projectStart:'Project Start Date' },
    mdl:{ codeSheet:'Code', dashboardTitle:'Master Document List',
      requiredSheets: SUB_DISCIPLINES.map(d=>d[0]),
      requiredFields:['Stage','UESH Discipline','Discipline','Project Code','Project Prefix','Doc Type','Number','Document No.','Document Title','Planned 1st Issue Date','Forecast 1st Issue Date'],
      requiredRecordFields:['Document Title','UESH Discipline','Stage','Doc Type','Discipline','Project Code','Project Prefix','Number'] },
    submittalLog:{ sheet:'SubmittalLog', codeSheet:'Code', dashboardTitle:'Document Submittal Log',
      requiredHeaders: SUB_LOG_HEADERS,
      requiredRecordFields:['Document No.','Prolog No.','Submission Date','Review Period','Target Return Date','Submission Status'],
      voidApprovalValues:['VOID'] }
  };
}
function subCodeSheet(opts){
  const rows = [];
  // table headers MUST sit within the first 10 rows — readCodeTable/readMetadataTable
  // only scan that far to find a header (data rows below are read to maxRow).
  rows.push({A:'Project Metadata Title',B:'Project Metadata Values',C:'Project Metadata Data Type'});
  rows.push({A:'UESH Discipline',B:'UESH Discipline Description'});
  rows.push({A:'Submission Status Code',B:'Submission Status'});
  rows.push({A:'Approval Code',B:'Approval Status'});
  rows.push({A:'Error Code',B:'Rule',C:'Severity',D:'Group'});
  // metadata values + field maps (read to maxRow, no 10-row cap)
  rows.push({A:'Dashboard Title',B:opts.dashboardTitle,C:'Text'});
  rows.push({A:'Project Title',B:opts.projectTitle||'TWRP C3B2',C:'Text'});
  rows.push({A:'Project Start Date',B:opts.projectStart||'2024-01-01',C:'Date'});
  rows.push({A:'Header Row',B:String(opts.headerRow||1),C:'Number'});
  for (const [f,col] of Object.entries(SUB_FIELD_COLS)) rows.push({A:f,B:'Column-'+col,C: SUB_DATE_FIELDS.has(f)?'Date':'Text'});
  // code-table data rows (harmless junk to other readers)
  for (const [name,code] of opts.disciplines) rows.push({A:name,B:code});
  for (const [code,label] of opts.submission) rows.push({A:code,B:label});
  for (const [code,label] of opts.approval) rows.push({A:code,B:label});
  for (const e of opts.errors) rows.push({A:e[0],B:e[1],C:e[2],D:e[3]});
  return { rows: mrows(rows), maxRow: rows.length };
}
function subDiscSheet(rowsData){
  const header = {};
  for (const [f,col] of Object.entries(SUB_FIELD_COLS)) header[col]=f;
  const rows = [header];
  for (const d of rowsData){ const r={}; for (const [f,col] of Object.entries(SUB_FIELD_COLS)){ if (d[f]!==undefined && d[f]!=='') r[col]=d[f]; } rows.push(r); }
  return { rows: mrows(rows), maxRow: rows.length };
}
function hashStr(s){ let h=0; for (let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0; return h; }
function mkSubDoc(sheet, docNo, title, planned, actual){
  return { sheet, 'SNo.':'1','Stage':'MR','UESH Discipline':sheet,'Project Code':'P1','Project Prefix':'PR',
    'Doc Type':'CN','Discipline':sheet,'Number':String(100+(hashStr(docNo)%900)),'Document No.':docNo,
    'Document Title':title,'Planned 1st Issue Date':planned,'Actual 1st Issue Date':actual };
}
function mkSubLog(docNo){
  return { 'SNo.':'1','Prolog No.':'P-001','Prolog Subject':'Subj','Document No.':docNo,'Revision':'0','Submitted By':'Eng',
    'Submission Date':'2024-03-01','Review Period':'20','Target Return Date':'2024-03-21','Actual Return Date':'2024-03-25',
    'Submission Status':'SUB','Approval Status':'APP','Resubmission Required':'NO' };
}
export function subMakeWorkbooks(opts = {}){
  const disciplines = opts.disciplines || SUB_DISCIPLINES;
  const submission = opts.submission || [['SUB','Submitted'],['PEND','Pending Review']];
  const approval = opts.approval || [['APP','Approved'],['REJ','Rejected']];
  const errors = opts.errors || [
    ['V-01','Blank identity','Error','X'],['V-04','Discipline Code not in list','Error','X'],
    ['V-07','Submission Status not in list','Error','X'],['V-08','Approval Status not in list','Error','X'],
    ['V-15','Placeholder token in Document No.','Error','X'],['V-25','Missing required record field','Error','X'],
    ['V-33','Blank Planned 1st Issue Date','Error','X']
  ];
  const contract = subContract();

  let mdlDocs;
  if (opts.big){ mdlDocs = []; for (let i=0;i<opts.big;i++){ const d=disciplines[i%disciplines.length]; mdlDocs.push(mkSubDoc(d[0],'DOC-'+String(i).padStart(5,'0'),'Title '+i,'2024-02-01','2024-03-01')); } }
  else if (opts.empty){ mdlDocs = []; }
  else { mdlDocs = opts.docs || [ mkSubDoc(disciplines[0][0],'DOC-0001','Title 1','2024-02-01','2024-03-01'), mkSubDoc(disciplines[1][0],'DOC-0002','Title 2','2024-02-05','2024-03-05') ]; }

  const logRows = (opts.big || opts.empty) ? [] : (opts.logRows || [ mkSubLog('DOC-0001') ]);

  const mdlSheets = { Code: subCodeSheet({ dashboardTitle:'Master Document List', disciplines, submission, approval, errors }) };
  const bySheet = {};
  for (const d of mdlDocs){ (bySheet[d.sheet] = bySheet[d.sheet]||[]).push(d); }
  for (const name of Object.keys(bySheet)) mdlSheets[name] = subDiscSheet(bySheet[name]);
  for (const [name] of disciplines){ if (!mdlSheets[name]) mdlSheets[name] = subDiscSheet([]); }

  const logHeader = {}; SUB_LOG_HEADERS.forEach((h,i)=> logHeader[colLetter(i)] = h);
  const logData = [logHeader];
  for (const r of logRows){ const row={}; SUB_LOG_HEADERS.forEach((h,i)=>{ if (r[h]!==undefined && r[h]!=='') row[colLetter(i)] = r[h]; }); logData.push(row); }
  const logSheets = {
    SubmittalLog: { rows: mrows(logData), maxRow: logData.length },
    Code: subCodeSheet({ dashboardTitle:'Document Submittal Log', disciplines, submission, approval, errors }),
  };
  return { mdl: { sheets: mdlSheets }, log: { sheets: logSheets }, contract };
}
