/* PPP pipeline - extracted from the Procurement-Dashboard.html inline script (I-76, P1).
   Revision 1.0 - 2026-10-30 - opencode (AI): first extraction; behaviour unchanged.
   Revision 1.1 - 2026-10-30 - opencode (AI): P2. STAGES, todayMidnight, stageDue and
     stageIsOverdue moved here from render.mjs. validate() used them as implicit globals, so the
     module could not run on its own when imported in Node.
   Revision 1.2 - 2026-10-30 - opencode (AI): P3. isExcelError() and one S2 normalization rule:
     a blank cell and a formula-error token both become absent (undefined). Per-field error-token
     counts are recorded, and S3 emits one fatal W-FORMULA notice per affected column. */

/* ============== Code-sheet contract (v2) ==============
   Row 1 = headers for the whole sheet.
   A = Title / field label   B = Value   C = Data Type (Date / Text / Number)
     · Rows 2–8    : project metadata  (A=label, B=value,  C=type)
     · Rows 9+     : PPP column map    (A=label, B="Column-X", C=type)
   Extra columns may be inserted after C in future, therefore every lookup
   block is located by its ROW-1 TITLE, never by a fixed column letter:
     "Discipline Description" · "Criticality" · "Package Status" · "Item Category"
======================================================== */
export const CODE_SHEET_KEYS = {
  title:'Package Title', discipline:'Discipline', criticality:'Criticality', leadTime:'Estimate Lead Time',
  status:'Package Status', poNo:'PO Number', engineer:'Design Engineer', supplier:'Supplier', buyer:'Buyer', pe:'Project Engineer',
  mrPlan:'MR Plan Date', mrForecast:'MR Forecast Date', mrActual:'MR Actual Date',
  poPlan:'PO Plan Date', poForecast:'PO Forecast Date', poActual:'PO Actual Date',
  vdPlan:'VD Approval Plan Date', vdForecast:'VD Approval Forecast Date', vdActual:'VD Approval Actual Date',
  fatPlan:'FAT Plan Date', fatForecast:'FAT Forecast Date', fatActual:'FAT Actual Date',
  rosPlan:'ROS Plan Date', rosForecast:'ROS Forecast Date', rosActual:'ROS Actual Date',
  sNo:'S No.', packageNo:'Package No.', itemCategory:'Item Category', area:'Area',
  equipmentTags:'Equipment Tags', packageNotes:'Package Notes', quantity:'Quantity'
};
/* Every Code field whose label ends in "Date" is a date column. We always parse these as
   Dates in buildModel — independent of the (sometimes blank/missing) Data Type column — so the
   model field is a real Date that the S-curve, Look-Ahead and Overdue-by-Stage views (all of
   which require `instanceof Date`) can rely on. Without this, those views silently render empty
   ("Nothing to export") while the tables still show dates because they normalise via toDate(). */
export const DATE_FIELDS = Object.keys(CODE_SHEET_KEYS).filter(f => /Date$/.test(CODE_SHEET_KEYS[f]));
export const REV_CODE_KEYS = Object.fromEntries(Object.entries(CODE_SHEET_KEYS).map(([f,l])=>[String(l).trim().toLowerCase(), f]));


export const LOOKUP_HEADERS = {
  discipline:     ['discipline description','discipline desc','discipline name'],
  disciplineCode: ['discipline code','discipline'],
  criticality:    ['criticality','criticality description','criticality desc'],
  criticalityCode:['criticality code','criticality'],
  status:         ['package status','package status description','status description'],
  statusCode:     ['status code','status'],
  category:       ['item category','item category description','category description'],
  categoryCode:   ['category code','category code description'],
  /* I-11: the Error table (Code!Q:V) — a code -> rule-text MAP, not a value list.
     Located by row-1 header text like every other block, so the pair may move. */
  errorCode:      ['error code','error id','validation code'],
  errorDescription:['error description','error message','error text'],
  errorSeverity:  ['severity'],
  errorGroup:     ['group'],
  errorKind:      ['kind'],
  errorTrigger:   ['trigger','trigger check']
};
/* header text is matched case-insensitively; exact match wins, then prefix match */
function colLetter(i){ let n=i+1,s=''; while(n>0){ const m=(n-1)%26; s=String.fromCharCode(65+m)+s; n=(n-m-1)/26; } return s; }

export function colRefToIndex(ref){
  if(!ref) return -1;
  const m = String(ref).match(/Column-([A-Z]+)/i);
  if(!m) return -1;
  let idx = 0;
  for(const ch of m[1].toUpperCase()) idx = idx*26 + (ch.charCodeAt(0)-64);
  return idx-1;
}
export function parseCodeSheet(codeGrid){
  const meta = {}, metaTypes = {};
  for(let r=0;r<codeGrid.length;r++){
    const row=codeGrid[r]; if(!row) continue;
    const key=row[0]; const val=row[1];
    if(key==null || String(key).trim()==='') continue;
    if(val==null || String(val).trim()==='') continue;
    meta[String(key).trim()] = val;
    const t=normType(row[2]);            /* column C = Data Type */
    if(t) metaTypes[String(key).trim()] = t;
  }
  return {meta, metaTypes};
}
export function buildFieldToCol(meta){
  const map = {};
  for(const [field, codeKey] of Object.entries(CODE_SHEET_KEYS)){
    const colRef = meta[codeKey];
    if(colRef != null){
      const idx = colRefToIndex(colRef);
      if(idx >= 0) map[field] = idx;
    }
  }
  return map;
}
export const TYPE_ALIASES={date:'Date',datetime:'Date',d:'Date',number:'Number',numeric:'Number',num:'Number',int:'Number',integer:'Number',n:'Number',text:'Text',string:'Text',str:'Text',t:'Text',s:'Text'};
function normType(v){
  if(v==null) return '';
  const k=String(v).trim().toLowerCase();
  if(!k) return '';
  if(TYPE_ALIASES[k]) return TYPE_ALIASES[k];
  for(const key in TYPE_ALIASES){ if(k.indexOf(key)===0) return TYPE_ALIASES[key]; }
  return '';
}
function parseFieldTypes(codeGrid){
  const types={}; let found=0;
  for(let r=0;r<codeGrid.length;r++){
    const row=codeGrid[r]; if(!row) continue;
    const a=row[0]; if(a==null||a==='') continue;
    const b=row[1];
    if(!(typeof b==='string' && /^column-/i.test(b))) continue;
    const field=REV_CODE_KEYS[String(a).trim().toLowerCase()];
    if(!field) continue;
    const t=normType(row[2]);
    if(t){ types[field]=t; found++; }
  }
  return {types,found};
}
export function findLookupColumns(codeGrid){
  const hdr=codeGrid[0]||[]; const idx={}, src={};
  const N=h=>String(h==null?'':h).replace(/\s+/g,' ').trim().toLowerCase();
  for(const [k,names] of Object.entries(LOOKUP_HEADERS)){
    let found=-1;
    for(let c=0;c<hdr.length;c++){ const h=N(hdr[c]); if(h && names.indexOf(h)>=0){ found=c; break; } }
    if(found<0){ for(let c=0;c<hdr.length;c++){ const h=N(hdr[c]); if(h && names.some(n=>h.indexOf(n)===0)){ found=c; break; } } }
    if(found>=0){ idx[k]=found; src[k]=colLetter(found); }
  }
  return {idx,src};
}
function readLookupCol(grid,c,start){
  if(c==null) return [];
  const out=[]; let blankRun=0;
  for(let r=start;r<grid.length && r<start+300;r++){
    const row=grid[r]; if(!row){ blankRun++; if(blankRun>=3) break; continue; }
    const v=row[c];
    if(v==null||String(v).trim()===''){ blankRun++; if(blankRun>=3) break; continue; }
    blankRun=0; out.push(String(v).trim());
  }
  return out;
}
/* I-11: read a code column paired with a description column into { CODE: text }.
   Read ROW BY ROW on purpose: zipping two independently-skipped columns would
   shift every later entry if a single description cell were blank. Stops after
   3 consecutive blank code cells, same rule as readLookupCol(). */
function readLookupMap(grid,codeCol,descCol,start){
  if(codeCol==null) return {};
  const map={}; let blankRun=0;
  for(let r=start;r<grid.length && r<start+300;r++){
    const row=grid[r];
    const c=row?row[codeCol]:null;
    if(c==null||String(c).trim()===''){ blankRun++; if(blankRun>=3) break; continue; }
    blankRun=0;
    const d=(descCol==null||!row||row[descCol]==null)?'':String(row[descCol]).trim();
    map[String(c).trim()]=d;
  }
  return map;
}

/* ============== utils ============== */
export function toDate(v){
  if(v==null||v==='') return null;
  // (1) Excel serial number — epoch 1899-12-30. The canonical conversion is (serial - 25569):
  //     the 25569 constant already absorbs Excel's 1900 leap-year bug, so NO extra -1 is
  //     needed (an extra s-=1 shifts every date back by one day — the old off-by-one bug).
  //     Re-anchor the resulting UTC midnight to LOCAL midnight so display is timezone-stable.
  if(typeof v==='number'){
    if(v>40000&&v<70000){ const d=new Date((v-25569)*86400000); return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); }
    return null;
  }
  // (2) ISO / text date — take the WRITTEN calendar day, ignoring any time or zone suffix
  //     (e.g. "2026-03-19", "2026-03-19T00:00:00", "2026-03-19T00:00:00Z" all => 19 Mar 2026).
  if(typeof v==='string'){
    const t=v.trim();
    // bare Excel serial stored as TEXT (e.g. "46218") — still a date, parse it as a serial.
    if(/^\d{5}(\.\d+)?$/.test(t)){ const n=parseFloat(t); if(n>40000&&n<70000){ const d=new Date((n-25569)*86400000); return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()); } return null; }
    const m=/^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(t);
    if(m) return new Date(+m[1], (+m[2])-1, +m[3]);
    const d=new Date(t); if(isNaN(d)) return null; return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  // (3) already a Date — normalize to its LOCAL calendar-day midnight.
  if(v instanceof Date) return new Date(v.getFullYear(), v.getMonth(), v.getDate());
  return null;
}
/* Spreadsheet formula-error tokens (spec §3.8.4). A cached error value is never data. */
export const EXCEL_ERROR_TOKENS = ['#NULL!','#DIV/0!','#VALUE!','#REF!','#NAME?','#N/A','#NUM!','#GETTING_DATA','#SPILL!','#CALC!'];
const EXCEL_ERROR_SET = new Set(EXCEL_ERROR_TOKENS);

/* True when the cell text is a formula-error token. Case-insensitive; surrounding spaces ignored. */
export function isExcelError(v){
  if(typeof v!=='string') return false;
  return EXCEL_ERROR_SET.has(v.trim().toUpperCase());
}

/* One absent rule for every column: missing, blank after trim, or an error token. */
export function isAbsent(v){
  return v==null || (typeof v==='string' && (v.trim()==='' || isExcelError(v)));
}

export function fmt(d){ if(!(d instanceof Date)) return '—'; return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); }
export function monthShort(d){ return ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]+' '+String(d.getFullYear()).slice(2); }
export function sameMonth(d,m){ return d.getFullYear()===m.getFullYear()&&d.getMonth()===m.getMonth(); }

/* Canonical stage model (I-61). One definition; the validation rules, the stage chart and the
   overdue list all derive their keys and labels from it. */
export const STAGES=[['mr','MR','MR Issue'],['po','PO','PO Issue'],['vd','VD','VD Approval'],['fat','FAT','FAT'],['ros','ROS','ROS']];

/* Operational as-of date: local midnight today. Never toISOString(), which shifts the day. */
export function todayMidnight(){ const t=new Date(); t.setHours(0,0,0,0); return t; }

/* Forecast is a managerial estimate; the due date for display falls back to Plan. */
export function stageDue(p,k){ return p[k+'Forecast']||p[k+'Plan']; }

/* Canonical overdue test. Anchored to the Plan (committed baseline) date only:
   Plan present && Plan < today && Actual absent. A Forecast never clears overdue. */
export function stageIsOverdue(p,k,today){ const plan=p[k+'Plan']; return !!(plan && !p[k+'Actual'] && plan<today); }

export function parseWorkbook(result){
  const pppKey = Object.keys(result).find(k=>/ppp/i.test(k)) || Object.keys(result).find(k=>!/code/i.test(k)) || Object.keys(result)[0];
  const ppp = result[pppKey];
  const codeKey = Object.keys(result).find(k=>/code/i.test(k));
  const code = codeKey ? result[codeKey] : (Object.values(result)[1]||null);
  if(!ppp||ppp.length<2) throw new Error('No PPP sheet with data found.');
  if(!code||!code.length) throw new Error('No Code sheet found — column mappings required.');
  return {ppp, code, codeKey, pppKey};
}

export function buildModel(result, filename){
  const {ppp, code} = parseWorkbook(result);

  const cs = parseCodeSheet(code);
  const codeMeta = cs.meta, metaTypes = cs.metaTypes;
  const fieldToCol = buildFieldToCol(codeMeta);
  if(fieldToCol.title == null) throw new Error('Code sheet missing "Package Title" column mapping.');

  const ft = parseFieldTypes(code);
  const hasTypes = ft.found>0;
  const typeFor = f => ft.types[f] || 'Text';
  const dateFields = Object.keys(fieldToCol).filter(f=>typeFor(f)==='Date');

  const lk = findLookupColumns(code); const li = lk.idx, lsrc = lk.src;
  /* I-11: the rule text lives in the workbook, so the business owns the wording.
     Deliberately NOT part of lookupMeta — lookupMeta describes the four symbol
     lookups (exactly what V-18 checks); the Error table is a code -> text map. */
  const errorTable = readLookupMap(code, li.errorCode, li.errorDescription, 1);
  const errorSeverity = readLookupMap(code, li.errorCode, li.errorSeverity, 1);
  const errorGroup = readLookupMap(code, li.errorCode, li.errorGroup, 1);
  const errorKind = readLookupMap(code, li.errorCode, li.errorKind, 1);
  const errorTrigger = readLookupMap(code, li.errorCode, li.errorTrigger, 1);
  const lookups = {
    discipline: readLookupCol(code, li.discipline, 1),
    disciplineCode: readLookupCol(code, li.disciplineCode, 1),
    criticalityCode: readLookupCol(code, li.criticalityCode, 1),
    criticality: readLookupCol(code, li.criticality, 1),
    statusCode: readLookupCol(code, li.statusCode, 1),
    status: readLookupCol(code, li.status, 1),
    category: readLookupCol(code, li.category, 1),
    categoryCode: readLookupCol(code, li.categoryCode, 1)
  };
  /* n = values in the DESCRIPTION column, codeN = values in the paired CODE column.
     They are two different numbers and must never be conflated: a workbook can
     carry the header for a code column and leave the body blank (Category Code N
     is exactly that), so reporting the description count against the code column
     letter would claim data that is not there. */
  const lookupMeta = {
    discipline:{col:lsrc.discipline||null, n:lookups.discipline.length, title:'Discipline Description', codeCol:lsrc.disciplineCode||null, codeN:lookups.disciplineCode.length},
    criticality:{col:lsrc.criticality||null, n:lookups.criticality.length, title:'Criticality', codeCol:lsrc.criticalityCode||null, codeN:lookups.criticalityCode.length},
    status:{col:lsrc.status||null, n:lookups.status.length, title:'Package Status', codeCol:lsrc.statusCode||null, codeN:lookups.statusCode.length},
    category:{col:lsrc.category||null, n:lookups.category.length, title:'Item Category', codeCol:lsrc.categoryCode||null, codeN:lookups.categoryCode.length}
  };

  const hrRaw=codeMeta['Header Row'], lrRaw=codeMeta['List End Row'];
  const hrNum=Number(hrRaw), lrNum=Number(lrRaw);
  const headerRowValid = hrRaw!=null && hrRaw!=='' && Number.isFinite(hrNum);
  const lastRowValid = lrRaw!=null && lrRaw!=='' && Number.isFinite(lrNum);
  const headerRow = headerRowValid ? hrNum-1 : 0;
  const lastRow = lastRowValid ? lrNum-1 : Math.max(0, ppp.length-1);

  const packages=[]; let skipped=0;
  const formulaHits={};   // field -> count of formula-error cells (§3.8.4)
  for(let r=headerRow+1; r<=lastRow && r<ppp.length; r++){
    const row=ppp[r]; if(!row) continue;
    const title = row[fieldToCol.title];
    if(isAbsent(title)){ skipped++; continue; }
    const pkg={ _raw:{}, _row:r+1 };
    for(const [field, colIdx] of Object.entries(fieldToCol)){
      const raw = row[colIdx];
      pkg._raw[field] = raw;                       // raw cell kept for audit and for the V-rules
      if(isExcelError(raw)) formulaHits[field]=(formulaHits[field]||0)+1;

      /* S2 (§3.8.4): blank and error token are the SAME absent state. Every later stage only
         sees a missing field, so no stage matches a token as text. */
      if(isAbsent(raw)){ pkg[field]=undefined; continue; }
      const t = typeFor(field);
      // Date columns are parsed as Dates regardless of the (often blank/missing) Data Type column.
      // Otherwise pkg.<dateField> stays a raw serial/string and the S-curve, Look-Ahead and
      // Overdue-by-Stage views (which all require a real Date) silently render empty.
      if(DATE_FIELDS.includes(field) || t==='Date'){
        const d=toDate(raw);
        pkg[field]=(d && !isNaN(d)) ? d : undefined;
      }
      else if(t==='Number'){
        const n=Number(raw);
        pkg[field]=Number.isFinite(n) ? n : undefined;
      }
      else pkg[field]=String(raw);
    }

    pkg.id = pkg.packageNo || pkg.title || ('row '+pkg._row);
    packages.push(pkg);
  }
  if(!packages.length) throw new Error('No packages with a Package Title found in the specified range.');

  /* One aggregated entry per affected column (§3.8.4). The label is the contract label; the
     column letter is the one the mapping resolved, not a guess. */
  const formulaFields={};
  Object.keys(formulaHits).forEach(f=>{
    const ci=fieldToCol[f];
    formulaFields[f]={ n:formulaHits[f], total:packages.length,
      label:CODE_SHEET_KEYS[f]||f, col:ci!=null?colLetter(ci):'' };
  });
  const formulaErrors={ total:packages.length, fields:formulaFields };

  /* Project Start Date lives in the Code sheet (cell "Project Start Date",
     with a fallback to the legacy "AsOf Date" label for older files). The
     operational reporting date (asOf) is always today and is NOT read from
     the Code sheet. */
  const pStartVal = codeMeta['Project Start Date'] || codeMeta['AsOf Date'];
  const projStartDate = pStartVal ? toDate(pStartVal) : null;
  if(pStartVal && (!projStartDate || isNaN(projStartDate))) throw new Error('Invalid Project Start Date in Code sheet.');

  const projectTitle = codeMeta['Project Title'] || filename.replace(/\.xlsx?$/i,'').replace(/\.csv$/i,'');
  /* canonical status: accepts either the code (NS) or the full description */
  const statusCanon=(function(){
    const m={}; const descs=lookups.status||[], codes=lookups.statusCode||[];
    descs.forEach((d,i)=>{ const dd=String(d).trim(); m[dd.toLowerCase()]=dd; if(codes[i]!=null) m[String(codes[i]).trim().toLowerCase()]=dd; });
    return v=>{ const s=String(v==null?'':v).trim(); return m[s.toLowerCase()]||s; };
  })();

  const model = { project:{title:projectTitle, code:codeMeta['Project Code']||'', client:codeMeta['Client']||'', startDate:projStartDate},
       packages, lookups, lookupMeta, statusCanon, errorTable, formulaErrors, warnings:[],
       codeInfo:{ hasTypes, typeCount:ft.found, fieldCount:Object.keys(fieldToCol).length, metaTypes,
                  errorCount:Object.keys(errorTable).length, errorCodeCol:lsrc.errorCode||null, errorDescCol:lsrc.errorDescription||null,
                  errorSeverityCol:lsrc.errorSeverity||null, errorGroupCol:lsrc.errorGroup||null, errorKindCol:lsrc.errorKind||null, errorTriggerCol:lsrc.errorTrigger||null } };

  /* validation inputs that are not part of the clean domain model */
  const vctx = { lookups, projStart:projStartDate, headerRow, lastRow, pppGrid:ppp, titleCol:fieldToCol.title,
    hasTypes, typeCount:ft.found, skipped, dateFields, metaTypes, lookupMeta, codeMeta,
    errorTable, errorCodeCol:lsrc.errorCode||null, errorDescCol:lsrc.errorDescription||null,
    errorSeverity, errorGroup, errorSeverityCol:lsrc.errorSeverity||null, errorGroupCol:lsrc.errorGroup||null,
    errorKind, errorTrigger, errorKindCol:lsrc.errorKind||null, errorTriggerCol:lsrc.errorTrigger||null,
    hrRaw, lrRaw, headerRowDefault:!headerRowValid, lastRowDefault:!lastRowValid, formulaErrors };

  return {model, vctx};
}

/* ============== validation ============== */
export function validate(pkgs, ctx){
  const issues=[];
  /* I-11: the Code sheet Error table (cols Q:V) is the authoritative wording for
     every rule code. Each issue carries it as `desc` so the panel can show the
     same text the business maintains in Excel. A code with no row gets `desc`
     = '' -> the rule's own built-in message stands, and V-21 warns (never errors). */
  const errTable=(ctx&&ctx.errorTable)||{};
  const errSev=(ctx&&ctx.errorSeverity)||{};
  const errGroup=(ctx&&ctx.errorGroup)||{};
  const errKind=(ctx&&ctx.errorKind)||{};
  const errTrigger=(ctx&&ctx.errorTrigger)||{};
  const ruleText=code=>{ const t=errTable[String(code)]; return t==null?'':String(t).trim(); };
  const normSev=s=>{ const w=String(s==null?'':s).trim().toLowerCase(); return (w==='error'||w==='warning'||w==='info')?w:null; };
  const normKind=k=>{ const w=String(k==null?'':k).trim().toLowerCase(); return (w==='system'||w==='data')?w:null; };
  const add=(sev,code,pkg,field,value,msg)=>{
    const s=normSev(errSev[String(code)])||sev;   // worksheet Severity is the single source of truth (I-11/I-65)
    const k=normKind(errKind[String(code)])||((pkg==null||pkg==='—')?'system':'data'); // worksheet Kind is the single source of truth (I-66)
    issues.push({sev:s,code,pkg:pkg||'—',field:field||'—',value:value==null?'':String(value),msg,desc:ruleText(code),group:String(errGroup[String(code)]||'').trim(),kind:k,trigger:String(errTrigger[String(code)]||'').trim()});
  };
  const T=pkgs.length;
  const L=ctx.lookups||{};
  const norm=s=>String(s==null?'':s).trim().toLowerCase();
  const set=a=>new Set((a||[]).map(norm));
  const stages=STAGES; // canonical stage set (I-61)

  if(ctx.headerRowDefault) add('error','V-15','—','Code!Header Row', ctx.hrRaw==null?'':ctx.hrRaw, 'Header Row missing or not numeric — used default (row 1 as header).');
  if(ctx.lastRowDefault) add('error','V-15','—','Code!List End Row', ctx.lrRaw==null?'':ctx.lrRaw, 'List End Row missing or not numeric — used default (last data row).');
  if(!ctx.projStart) add('error','V-15','—','Code!Project Start Date','','Project Start Date missing or invalid');
  if(!ctx.hasTypes) add('warning','V-16','—','Code!C (Data Type)','','Column C has no Data Type values — all fields default to Text. Fill column C to make parsing and validation data-driven.');

  const mt=ctx.metaTypes||{};
  const psType = mt['Project Start Date'] || mt['AsOf Date'];
  if(psType && psType!=='Date') add('warning','V-15','—','Code!Project Start Date',psType,'Data Type in column C is "'+psType+'" — expected Date');
  ['Header Row','List End Row'].forEach(k=>{ if(mt[k] && mt[k]!=='Number') add('warning','V-15','—','Code!'+k,mt[k],'Data Type in column C is "'+mt[k]+'" — expected Number'); });
  Object.entries(ctx.lookupMeta||{}).forEach(([k,v])=>{
    if(!v.col||!v.n) add('warning','V-18','—','Code!'+v.title,'not found','Lookup block "'+v.title+'" was not found in row 1 — '+k+' values cannot be checked against the Code sheet');
  });
  /* V-22: a lookup block whose CODE column is located but empty while its
     DESCRIPTION column carries values is a silent data gap — packages keyed by
     code (e.g. status "NS") cannot be cross-checked, and V-05/V-06/V-07/V-17
     only match the code set. The UI already shows "(empty)" (renderCodeMap);
     this makes it a formal warning. App-only (like V-21): no Code!Q:R row needed.
     Deliberately distinct from V-18, which fires on a missing/empty description
     column, not on an empty code column. */
  Object.entries(ctx.lookupMeta||{}).forEach(([k,v])=>{
    if(v.codeCol && v.codeN===0 && v.n>0)
      add('warning','V-22','—','Code!'+v.codeCol,'empty',
          'Code column "'+v.codeCol+'" for '+v.title+' is empty while the description column has '+v.n+' values — packages keyed by code cannot be validated.');
  });

  const noCount={}, noRaw={}; const personVariants={};
  let ltMissing=0, critBlank=0; let anyActual=0, mrPlanCount=0, poPlanCount=0;
  /* Per-package validation rules (I-32): each rule is self-contained — it
     receives the package, its display id, the validation context and the issue
     emitter. Adding a rule = one entry here; the traversal and the panel /
     counter / CSV export all derive automatically from add(). (I-46 folds in:
     the duplicate-Package-No key is normalised so " PKG-01 " and "PKG-01"
     collapse, while the raw value is still shown on the report.) */
  const RULES = [
    { code:'V-07', sev:'error', run(p,id,ctx,add){
        const L=ctx.lookups||{}; const stSet=set(L.status), stCodeSet=set(L.statusCode);
        if(p.status && (stSet.size||stCodeSet.size) && !stSet.has(norm(p.status)) && !stCodeSet.has(norm(p.status)))
          add('error','V-07',id,'Package Status',p.status,'Status not found in the Code sheet list');
    }},
    { code:'V-06', sev:'warning', run(p,id,ctx,add){
        const L=ctx.lookups||{}; const discSet=set(L.discipline), discCodeSet=set(L.disciplineCode);
        if(p.discipline && discSet.size && !discSet.has(norm(p.discipline)) && !discCodeSet.has(norm(p.discipline)))
          add('warning','V-06',id,'Discipline',p.discipline,'Discipline not found in the Code sheet list');
    }},
    { code:'V-17', sev:'info', run(p,id,ctx,add){
        const L=ctx.lookups||{}; const catSet=set(L.category);
        if(p.itemCategory && catSet.size && !catSet.has(norm(p.itemCategory)))
          add('info','V-17',id,'Item Category',p.itemCategory,'Item Category not found in the Code sheet list — for reference only');
    }},
    { code:'V-24', sev:'warning', run(p,id,ctx,add){
        const rawE=p._raw['engineer'];
        if(rawE==null || String(rawE).trim()==='') add('warning','V-24',id,'Design Engineer','','Engineer unassigned — package has no Design Engineer');
    }},
    { code:'V-05', sev:'error', run(p,id,ctx,add){
        const L=ctx.lookups||{}; const critSet=set(L.criticalityCode), critDescSet=set(L.criticality);
        if(p.criticality!=null && p.criticality!==''){
          if((critSet.size||critDescSet.size) && !critSet.has(norm(p.criticality)) && !critDescSet.has(norm(p.criticality)))
            add('error','V-05',id,'Criticality',p.criticality,'Criticality must be one of: '+Array.from(critSet).join(', '));
        }
    }},
    { code:'V-04', sev:'error', run(p,id,ctx,add){
        ['quantity','leadTime'].forEach(f=>{
          const raw=p._raw[f];
          if(raw!=null && raw!=='' && isNaN(Number(raw))) add('error','V-04',id,f,raw,'Value is not numeric');
        });
    }},
    { code:'V-02', sev:'error', run(p,id,ctx,add){
        ctx.dateFields.forEach(f=>{
          const raw=p._raw[f];
          if(raw==null||raw==='') return;
          if(p[f]==null){
            if(typeof raw==='number') add('error','V-02',id,f,raw,'Not a real Excel date — the number '+raw+' looks like a placeholder (e.g. 60 / 90 / 120)');
            else add('error','V-03',id,f,raw,'Text value cannot be read as a date');
          }
        });
    }},
    { code:'V-08', sev:'warning', run(p,id,ctx,add){
        for(let i=0;i<stages.length-1;i++){
          const a=p[stages[i][0]+'Plan'], b=p[stages[i+1][0]+'Plan'];
          if(a&&b&&a>b) add('warning','V-08',id,stages[i][1]+' → '+stages[i+1][1]+' Plan',fmt(a)+' > '+fmt(b),'Stage plan dates are out of sequence');
        }
    }},
    { code:'V-09', sev:'warning', run(p,id,ctx,add){
        stages.forEach(([k,n])=>{ const pl=p[k+'Plan'], ac=p[k+'Actual']; if(ac&&!pl) add('warning','V-09',id,n+' Actual',fmt(ac),'Actual date entered but '+n+' Plan is empty'); });
    }},
    { code:'V-10', sev:'warning', run(p,id,ctx,add){
        stages.forEach(([k,n])=>{ const ac=p[k+'Actual']; if(ac&&ac>todayMidnight()) add('warning','V-10',id,n+' Actual',fmt(ac),'Actual date is later than today ('+fmt(todayMidnight())+')'); });
    }},
    { code:'V-26', sev:'warning', run(p,id,ctx,add){
        /* I-81 (Rev 1.31): a PO Actual date is the ONLY evidence that a package
           has a PO issued, so an issued package must also carry a PO Number.
           The check is deliberately one-way. PO Number is NOT shown in the
           look-ahead / overdue tables: those list packages with no PO issued,
           where the value has no meaning. A missing PO Number is a warning,
           not an error, while the business fills column M. */
        if(p.poActual instanceof Date && !isNaN(p.poActual) && String(p.poNo||'').trim()==='')
          add('warning','V-26',id,'PO Number',fmt(p.poActual),'PO Actual date is set but PO Number is blank');
    }}
  ];

  pkgs.forEach(p=>{
    const id = p.id;
    /* I-46: normalise the duplicate-detection key; keep the raw value for display */
    if(p.packageNo){ const nk=norm(p.packageNo); noCount[nk]=(noCount[nk]||0)+1; if(noRaw[nk]==null) noRaw[nk]=p.packageNo; }

    if(p.criticality==null||p.criticality==='') critBlank++;
    if(p.leadTime==null) ltMissing++;
    if(STAGES.some(([k])=> p[k+'Actual'])) anyActual++;
    if(p.mrPlan) mrPlanCount++;
    if(p.poPlan) poPlanCount++;

    /* V-12 (I-25): group engineer spellings that differ ONLY in whitespace or
       slash spacing ("Dilip/Siva" vs "Dilip / Siva" vs "Siva /Dilip").
       The key is a loose form (separators + runs of spaces collapsed to one
       space); the Set holds the DISTINCT RAW spellings seen under that key.
       This is what makes V-12 reachable: the previous code added the raw string
       to a Set keyed by that same raw string, so every Set had size 1 and the
       rule could never fire. The key is used for comparison only — the report
       always shows the untouched values. */
    const rawE=p._raw['engineer'];
    if(rawE!=null&&String(rawE).trim()!==''){
      const shown=String(rawE).trim();
      const key=shown.toLowerCase().replace(/\s*\/\s*/g,'/').replace(/\s+/g,' ');
      (personVariants[key]=personVariants[key]||new Set()).add(shown);
    }

    RULES.forEach(r=>r.run(p,id,ctx,add));
  });

  Object.entries(noCount).forEach(([k,v])=>{ if(v>1) add('warning','V-11',noRaw[k],'Package No.',noRaw[k],'Duplicate Package No. — appears '+v+' times'); });
  Object.values(personVariants).forEach(s=>{ if(s.size>1) add('warning','V-12','—','Design Engineer',Array.from(s).join('  |  '),'Same engineer written different ways — counted as '+s.size+' separate people in the Engineer chart. Align the spelling in Excel.'); });
  if(critBlank>0) add('warning','V-05','—','Criticality',critBlank+' / '+T,'Criticality empty on '+critBlank+' package(s) — the inspection view stays empty');
  if(T && ltMissing > T*0.5) add('warning','V-14','—','Estimate Lead Time',ltMissing+' / '+T,'Lead time missing on '+ltMissing+' packages ('+Math.round(ltMissing/T*100)+'%)');
  if(T && anyActual===0) add('warning','V-23','—','All stages',T+' pkgs','Execution progress = 0 — no Actual dates entered in any stage for any package');
  if(T && mrPlanCount < T*0.3 && poPlanCount > T*0.5) add('warning','V-25','—','Plan dates',mrPlanCount+' / '+poPlanCount,'Plan-date inconsistency — MR Plan entered for only '+mrPlanCount+' of '+T+' packages while PO Plan is entered for '+poPlanCount);

  if(ctx.pppGrid && ctx.lastRow!=null){
    let extra=0;
    for(let r=ctx.lastRow+1;r<ctx.pppGrid.length;r++){
      const row=ctx.pppGrid[r]; if(!row) continue;
      const v=row[ctx.titleCol];
      if(v!=null&&String(v).trim()!=='') extra++;
    }
    if(extra>0) add('warning','V-13','—','PPP rows beyond List End Row',extra+' row(s)','Row(s) after row '+(ctx.lastRow+1)+' contain a Package Title but are excluded by List End Row');
  }
  if(ctx.skipped) add('info','V-01','—','Package Title',ctx.skipped+' row(s)','Row(s) inside the range have no Package Title and were skipped');

  // V-19: verify Header Row points at a real header (title column must be non-blank)
  if(ctx.pppGrid && ctx.headerRow!=null && !isNaN(ctx.headerRow)){
    const hrow=ctx.pppGrid[ctx.headerRow];
    const hval=hrow ? hrow[ctx.titleCol] : null;
    if(hval==null||String(hval).trim()==='')
      add('warning','V-19','—','PPP Header Row',ctx.codeMeta&&ctx.codeMeta['Header Row'],
        'Header Row '+((ctx.headerRow)+1)+' in the PPP sheet has no value in the Package Title column — Code sheet Header Row may be out of sync with the PPP layout');
  }

  // V-20: expected row count vs actual parsed
  if(ctx.headerRow!=null && ctx.lastRow!=null && !isNaN(ctx.headerRow) && !isNaN(ctx.lastRow)){
    const expected=ctx.lastRow - ctx.headerRow;
    const actual=T + (ctx.skipped||0);
    if(actual < expected)
      add('warning','V-20','—','PPP row count',actual+' of '+expected,
        'Expected '+(expected)+' data rows (Header Row '+(ctx.headerRow+1)+' to List End Row '+(ctx.lastRow+1)+') but only '+actual+' rows had content — '+(expected-actual)+' row(s) were completely blank and ignored');
  }

  /* V-21 (I-11): a rule code that appears in this report but has no row in the
     Code sheet Error table falls back to the wording built into the dashboard.
     Severity is WARNING only, by agreement — the dashboard must never error
     merely because the worksheet lags behind. The message names the exact codes
     to add under "Error Code" / "Error Description".
     V-21 excludes itself from the check: a rule should not audit its own
     documentation, otherwise the worksheet could never reach a clean state. */
  if(!ctx.errorCodeCol){
    add('warning','V-21','—','Code!Q:V','not found','No "Error Code" / "Error Description" block was found in Code row 1 — every rule falls back to the wording built into the dashboard.');
  } else {
    const undocumented=[...new Set(issues.map(i=>i.code))].filter(c=>c!=='V-21'&&!ruleText(c)).sort();
    if(undocumented.length)
      add('warning','V-21','—','Code!Q:V',undocumented.join(', '),undocumented.length+' rule code(s) used in this report have no row in the Code sheet Error table — the built-in wording is shown instead. Add '+undocumented.join(', ')+' under "Error Code" / "Error Description" to make the worksheet the single source of truth.');
  }

  const counts={error:0,warning:0,info:0};
  issues.forEach(i=>counts[i.sev]++);
  const order={error:0,warning:1,info:2};
  issues.sort((a,b)=> (order[a.sev]-order[b.sev]) || a.code.localeCompare(b.code));

  /* §3.8.4: one fatal notice per column that contained a formula-error token. These are NOT
     issues: they are not row-keyed, they do not enter the filtered issue table, and they never
     change a count. They route to #errBanner. */
  const warnings=[];
  const fe=(ctx&&ctx.formulaErrors)||{fields:{}};
  Object.keys(fe.fields).forEach(f=>{
    const x=fe.fields[f];
    warnings.push({ level:'fatal', code:'W-FORMULA', tab:f,
      message:'"'+x.label+'" (col '+x.col+'): '+x.n+' of '+x.total+' cells hold a formula-error token. Fix the source cells in Excel, then reload.' });
  });
  return {counts, issues, total:issues.length, packages:T, warnings};
}
