const fs = require('fs');
const zlib = require('zlib');

// ---- same ZIP/XML logic that will go into the HTML (inflate swapped for node test) ----
function colToIndex(ref){ const letters=ref.match(/[A-Z]+/)[0]; let n=0; for(const ch of letters) n=n*26+(ch.charCodeAt(0)-64); return n-1; }

function parseSharedStrings(xml){
  const out=[]; const siRe=/<si>([\s\S]*?)<\/si>/g; let m;
  while((m=siRe.exec(xml))){ const inner=m[1]; let txt=''; const tRe=/<t[^>]*>([\s\S]*?)<\/t>/g; let t;
    while((t=tRe.exec(inner))) txt+=t[1]; out.push(txt); }
  return out;
}
function parseWorkbookSheets(wb, rels){
  const map={}; const relMap={};
  const relRe=/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g; let r;
  while((r=relRe.exec(rels))) relMap[r[1]]=r[2];
  const sheetRe=/<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g; let m;
  while((m=sheetRe.exec(wb))){ let target=relMap[m[2]]||''; if(target && !target.startsWith('/')) target='xl/'+target.replace(/^\.\//,''); map[m[1]]=target; }
  return map;
}
function parseSheet(xml, shared){
  const sd=xml.match(/<sheetData>([\s\S]*?)<\/sheetData>/); if(!sd) return [];
  const body=sd[1]; const rowRe=/<row[^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g;
  const rowsTmp=[]; let maxCol=0,maxRow=0;
  let m;
  while((m=rowRe.exec(body))){
    const r=parseInt(m[1],10); const rbody=m[2]; const cRe=/<c\b([^>]*)>([\s\S]*?)<\/c>/g; let c; const obj={};
    while((c=cRe.exec(rbody))){
      const attrs=c[1], cbody=c[2];
      const refM=/r="([A-Z]+\d+)"/.exec(attrs); const typeM=/\bt="([^"]+)"/.exec(attrs);
      if(!refM) continue; const ref=refM[1]; const col=colToIndex(ref); const row=parseInt(ref.match(/\d+/)[0],10);
      let val=null; const type=typeM?typeM[1]:null;
      if(type==='s'){ const vM=/<v>(\d+)<\/v>/.exec(cbody); if(vM) val=shared[parseInt(vM[1],10)] ?? ''; }
      else if(type==='inlineStr'){ const tM=/<t[^>]*>([\s\S]*?)<\/t>/.exec(cbody); val=tM?tM[1]:''; }
      else { const vM=/<v>([\s\S]*?)<\/v>/.exec(cbody); if(vM){ val=vM[1]; if(type!=='str'){ val=isNaN(Number(vM[1]))?vM[1]:Number(vM[1]); } } }
      obj[col]=val; if(col>maxCol)maxCol=col; if(row>maxRow)maxRow=row;
    }
    rowsTmp.push({row,obj});
  }
  const grid=[];
  for(const rt of rowsTmp){ const arr=new Array(maxCol+1).fill(null); for(const k in rt.obj) arr[k]=rt.obj[k]; grid[rt.row-1]=arr; }
  for(let i=0;i<maxRow;i++) if(!grid[i]) grid[i]=new Array(maxCol+1).fill(null);
  return grid;
}
function parseXlsx(buf){
  const bytes=new Uint8Array(buf); const dv=new DataView(buf);
  let eocd=-1; for(let i=bytes.length-22;i>=0 && i>bytes.length-65558;i--){ if(bytes[i]===0x50&&bytes[i+1]===0x4B&&bytes[i+2]===0x05&&bytes[i+3]===0x06){eocd=i;break;} }
  if(eocd<0) throw new Error('Not XLSX');
  const cdCount=dv.getUint16(eocd+10,true); const cdOffset=dv.getUint32(eocd+16,true);
  const entries=[]; let p=cdOffset;
  for(let i=0;i<cdCount;i++){ if(dv.getUint32(p,true)!==0x02014B50) break;
    const compMethod=dv.getUint16(p+10,true); const compSize=dv.getUint32(p+20,true); const uncompSize=dv.getUint32(p+24,true);
    const fnameLen=dv.getUint16(p+28,true); const extraLen=dv.getUint16(p+30,true); const commentLen=dv.getUint16(p+32,true);
    const localOffset=dv.getUint32(p+42,true); const name=new TextDecoder().decode(bytes.subarray(p+46,p+46+fnameLen));
    entries.push({name,compMethod,compSize,uncompSize,localOffset}); p+=46+fnameLen+extraLen+commentLen; }
  function getEntry(n){ return entries.find(e=>e.name===n||e.name.endsWith('/'+n)); }
  function readEntry(e){ const lh=e.localOffset; const fl=dv.getUint16(lh+26,true); const el=dv.getUint16(lh+28,true);
    const start=lh+30+fl+el; const data=bytes.subarray(start,start+e.compSize);
    if(e.compMethod===0) return data;
    if(e.compMethod===8) return new Uint8Array(zlib.inflateRawSync(Buffer.from(data)));
    throw new Error('cmp '+e.compMethod); }
  const shared=parseSharedStrings(new TextDecoder().decode(readEntry(getEntry('xl/sharedStrings.xml'))));
  const wb=new TextDecoder().decode(readEntry(getEntry('xl/workbook.xml')));
  const relsE=getEntry('xl/_rels/workbook.xml.rels'); const rels=relsE?new TextDecoder().decode(readEntry(relsE)):'';
  const sheetMap=parseWorkbookSheets(wb,rels);
  const result={};
  for(const [name,path] of Object.entries(sheetMap)){ const e=getEntry(path)||getEntry(path.replace('xl/','')); if(!e) continue;
    result[name]=parseSheet(new TextDecoder().decode(readEntry(e)),shared); }
  return result;
}

const buf=fs.readFileSync('C:/Users/qinghua.song/DSAI/C3B2/PPP/TWRP C3B2 - Procurement Package Plan.xlsx');
const res=parseXlsx(buf);
console.log('SHEETS:', Object.keys(res));
const ppp=res['PPP'];
console.log('PPP rows:', ppp.length, 'cols:', ppp[0].length);
console.log('HEADER:', ppp[0]);
// count titled rows
let titled=0; const titleCol = ppp[0].findIndex(h=>(h||'').toString().toLowerCase().includes('package title'));
for(let r=1;r<ppp.length;r++){ if(ppp[r][titleCol]) titled++; }
console.log('TITLED rows:', titled);
// PO Plan column (T=index19) raw values rows 1-5
const poPlanCol = ppp[0].findIndex(h=>(h||'').toString().toLowerCase().includes('po') && (h||'').toString().toLowerCase().includes('plan'));
console.log('PO Plan col index:', poPlanCol, 'header:', ppp[0][poPlanCol]);
console.log('PO Plan raw rows1-5:', [1,2,3,4,5].map(r=>ppp[r][poPlanCol]));
// Code sheet keys
const code=res['Code'];
console.log('CODE rows:', code.length);
console.log('CODE sample:', code.slice(0,6));
