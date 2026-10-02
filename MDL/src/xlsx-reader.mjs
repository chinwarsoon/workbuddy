// xlsx-reader.mjs — zero-dependency .xlsx reader (ZIP + XML).
// Runs in Node (v18+) and modern browsers (DecompressionStream + Response are global).
// Reads: sharedStrings, workbook sheet map, and any worksheet as { rows:[ {A:val,...} ] , maxRow }.
// Dates are returned as Excel serial numbers; the pipeline converts them using the Code column-map "Date" type.

const EOCD = 0x06054b50;
const CDH  = 0x02014b50;
const LFH  = 0x04034b50;

export function colToNum(letters){ let n=0; for(const ch of letters.toUpperCase()) n=n*26+(ch.charCodeAt(0)-64); return n; }
export function numToCol(n){ let s=''; while(n>0){ const r=(n-1)%26; s=String.fromCharCode(65+r)+s; n=Math.floor((n-1)/26); } return s; }

async function inflateRaw(bytes){
  const ds = new DecompressionStream('deflate-raw');
  const w = ds.writable.getWriter();
  w.write(bytes); w.close();
  const buf = await new Response(ds.readable).arrayBuffer();
  return new Uint8Array(buf);
}

async function unzip(buf){
  const bytes = new Uint8Array(buf);
  const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  // locate End Of Central Directory (scan from tail)
  let eocd = -1;
  const min = Math.max(0, bytes.length - 65557);
  for(let i=min; i<=bytes.length-22; i++){
    if(dv.getUint32(i, true) === EOCD){ eocd = i; break; }
  }
  if(eocd < 0) throw new Error('Not a valid ZIP/XLSX (EOCD not found)');
  const cdOffset = dv.getUint32(eocd+16, true);
  const total = dv.getUint16(eocd+10, true);
  const files = {};
  let p = cdOffset;
  for(let i=0; i<total; i++){
    if(dv.getUint32(p, true) !== CDH) break;
    const method = dv.getUint16(p+10, true);
    const compSize = dv.getUint32(p+20, true);
    const nameLen = dv.getUint16(p+28, true);
    const extraLen = dv.getUint16(p+30, true);
    const commentLen = dv.getUint16(p+32, true);
    const lho = dv.getUint32(p+42, true);
    const nameBytes = bytes.subarray(p+46, p+46+nameLen);
    const name = new TextDecoder().decode(nameBytes);
    // local header: nameLen/extraLen at +26/+28
    const lNameLen = dv.getUint16(lho+26, true);
    const lExtraLen = dv.getUint16(lho+28, true);
    const dataStart = lho + 30 + lNameLen + lExtraLen;
    let data = bytes.subarray(dataStart, dataStart + compSize);
    if(method === 8) data = await inflateRaw(data);
    files[name] = data;
    p = p + 46 + nameLen + extraLen + commentLen;
  }
  return files;
}

function decodeUtf8(bytes){ return new TextDecoder().decode(bytes); }

// minimal attribute extractor for a single tag's attribute string
function attrs(str){
  const out = {};
  const re = /([\w:]+)\s*=\s*"([^"]*)"/g; let m;
  while((m = re.exec(str))) out[m[1]] = m[2];
  return out;
}

function parseSharedStrings(xmlBytes){
  const xml = decodeUtf8(xmlBytes || new Uint8Array());
  const list = [];
  const siRe = /<si>([\s\S]*?)<\/si>/g; let m;
  while((m = siRe.exec(xml))){
    const inner = m[1];
    let text = '', t;
    const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g;
    while((t = tRe.exec(inner))) text += t[1];
    list.push(text);
  }
  return list;
}

function parseWorkbook(xmlBytes){
  const xml = decodeUtf8(xmlBytes || new Uint8Array());
  const sheets = {}; // name -> rId
  const sRe = /<sheet\b([^>]*)>/g; let m;
  while((m = sRe.exec(xml))){
    const a = attrs(m[1]);
    if(a.name && a['r:id']) sheets[a.name] = a['r:id'];
  }
  return sheets;
}

function parseRels(xmlBytes){
  const xml = decodeUtf8(xmlBytes || new Uint8Array());
  const map = {}; // Id -> Target
  const rRe = /<Relationship\b([^>]*)>/g; let m;
  while((m = rRe.exec(xml))){
    const a = attrs(m[1]);
    if(a.Id && a.Target) map[a.Id] = a.Target;
  }
  return map;
}

function cellValue(tagInner, shared){
  // tagInner is the text of a <c ...>...</c> block
  const a = attrs(tagInner);
  const t = a.t || '';
  const isMatch = /<is>([\s\S]*?)<\/is>/.exec(tagInner);
  let vText = '';
  if(isMatch){
    const tRe = /<t[^>]*>([\s\S]*?)<\/t>/g; let tm;
    while((tm = tRe.exec(isMatch[1]))) vText += tm[1];
  } else {
    const vMatch = /<v>([\s\S]*?)<\/v>/.exec(tagInner);
    if(vMatch) vText = vMatch[1];
  }
  const v = vText.trim();
  if(v === '') return undefined;
  if(t === 's') return shared[parseInt(v,10)] ?? v;
  if(t === 'inlineStr' || t === 'str') return v;
  if(t === 'b') return v === '1' || v === 'true';
  // default: number (also covers date serials — pipeline converts by column type)
  if(/^-?\d+(\.\d+)?$/.test(v)) return parseFloat(v);
  return v;
}

function parseSheet(xmlBytes, shared){
  const xml = decodeUtf8(xmlBytes || new Uint8Array());
  const rows = []; // 1-based; rows[0] unused
  // find each <c ...>...</c> OR self-closing (Excel never self-closes <c> with content, but be safe)
  const cRe = /<c\b([\s\S]*?)<\/c>/g; let m;
  while((m = cRe.exec(xml))){
    const block = m[1] + '</c>'; // ensure we have closing for attrs+inner
    const open = /<c\b([^>]*)>/.exec(m[1].split('>')[0] + '>');
    const a = attrs(open ? open[1] : m[1]);
    const ref = a.r; if(!ref) continue;
    const col = ref.replace(/\d+$/, '');
    const rowNum = parseInt(ref.match(/\d+$/)[0], 10);
    const val = cellValue(block, shared);
    if(val === undefined) continue;
    if(!rows[rowNum]) rows[rowNum] = {};
    rows[rowNum][col] = val;
  }
  let maxRow = 0;
  for(let i=1;i<rows.length;i++) if(rows[i]) maxRow = i;
  return { rows, maxRow };
}

export async function readXlsx(buffer){
  const files = await unzip(buffer);
  const shared = parseSharedStrings(files['xl/sharedStrings.xml']);
  const sheetRid = parseWorkbook(files['xl/workbook.xml']);
  const rels = parseRels(files['xl/_rels/workbook.xml.rels']);
  const sheets = {};
  for(const name of Object.keys(sheetRid)){
    const rid = sheetRid[name];
    let target = rels[rid] || '';
    target = target.replace(/^\//, '');
    const key = (target.startsWith('xl/') ? target : 'xl/' + target);
    const data = files[key];
    sheets[name] = data ? parseSheet(data, shared) : { rows: [], maxRow: 0 };
  }
  return { sheets, sharedStrings: shared };
}
