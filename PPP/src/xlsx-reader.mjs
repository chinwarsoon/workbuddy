/* PPP xlsx-reader - extracted from the Procurement-Dashboard.html inline script (I-76, P1).
   Revision 1.0 - 2026-10-30 - opencode (AI): first extraction; behaviour unchanged. */

/* ============== offline XLSX parser (no CDN, no library) ============== */
function colToIndex(ref){ const letters=ref.match(/[A-Z]+/)[0]; let n=0; for(const ch of letters) n=n*26+(ch.charCodeAt(0)-64); return n-1; }
function unescXml(s){ return s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&apos;/g,"'"); }
function parseSharedStrings(xml){
  const out=[]; const siRe=/<si>([\s\S]*?)<\/si>/g; let m;
  while((m=siRe.exec(xml))){ const inner=m[1]; let txt=''; const tRe=/<t[^>]*>([\s\S]*?)<\/t>/g; let t;
    while((t=tRe.exec(inner))) txt+=unescXml(t[1]); out.push(txt); }
  return out;
}
function parseWorkbookSheets(wb, rels){
  const map={}; const relMap={};
  const relRe=/<Relationship[^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g; let r;
  while((r=relRe.exec(rels))) relMap[r[1]]=r[2];
  const sheetRe=/<sheet[^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g; let m;
  while((m=sheetRe.exec(wb))){ let target=relMap[m[2]]||''; if(target){ if(target.startsWith('/')) target=target.slice(1); else if(!target.startsWith('xl/')) target='xl/'+target.replace(/^\.\//,''); } map[m[1]]=target; }
  return map;
}
function parseSheet(xml, shared){
  const sd=xml.match(/<sheetData>([\s\S]*?)<\/sheetData>/); if(!sd) return [];
  const body=sd[1]; const rowRe=/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g;
  const rowsTmp=[]; let maxCol=0,maxRow=0; let m;
  while((m=rowRe.exec(body))){
    const rowIdxM=/\br="(\d+)"/.exec(m[1]); if(!rowIdxM) continue;
    const r=parseInt(rowIdxM[1],10); const rbody=m[2]||'';
    /* note (?: \/> | > ... </c> ): empty styled cells are written as <c r="N2" s="7"/> and must not swallow the next cell */
    const cRe=/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g; let c; const obj={};
    while((c=cRe.exec(rbody))){
      const attrs=c[1], cbody=c[2]||'';
      const refM=/r="([A-Z]+\d+)"/.exec(attrs); const typeM=/\bt="([^"]+)"/.exec(attrs);
      if(!refM) continue; const ref=refM[1]; const col=colToIndex(ref); const row=parseInt(ref.match(/\d+/)[0],10);
      let val=null; const type=typeM?typeM[1]:null;
      if(type==='s'){ const vM=/<v>(\d+)<\/v>/.exec(cbody); if(vM) val=shared[parseInt(vM[1],10)] ?? ''; }
      else if(type==='inlineStr'){ const tM=/<t[^>]*>([\s\S]*?)<\/t>/.exec(cbody); val=tM?tM[1]:''; }
      else if(type==='e'){ val=null; }
      else {
        /* A number cell may carry a cached <v> AND, when it is a formula, an <f>.
           We read ONLY <v> (the last cached result Excel wrote) and deliberately
           ignore <f>: the value is what Excel last computed, the formula text is
           not a value. Known limit — a workbook written by a tool that stores the
           formula WITHOUT caching a result yields null, and such cells surface as
           "not numeric" (V-04) rather than being silently invented. */
        const vM=/<v>([\s\S]*?)<\/v>/.exec(cbody);
        if(vM){ val=vM[1]; if(type!=='str'){ val=isNaN(Number(vM[1]))?vM[1]:Number(vM[1]); } }
      }
      obj[col]=val; if(col>maxCol)maxCol=col; if(row>maxRow)maxRow=row;
    }
    rowsTmp.push({row:r,obj});
  }
  const grid=[];
  for(const rt of rowsTmp){ const arr=new Array(maxCol+1).fill(null); for(const k in rt.obj) arr[k]=rt.obj[k]; grid[rt.row-1]=arr; }
  for(let i=0;i<maxRow;i++) if(!grid[i]) grid[i]=new Array(maxCol+1).fill(null);
  return grid;
}
async function inflateRaw(bytes){
  if(typeof DecompressionStream==='undefined') throw new Error('This browser lacks DecompressionStream; open in a modern Chrome/Edge/Safari.');
  const ds=new DecompressionStream('deflate-raw');
  const w=ds.writable.getWriter(); w.write(bytes); w.close();
  const r=ds.readable.getReader(); const chunks=[]; let total=0,x;
  while(!(x=await r.read()).done){ chunks.push(x.value); total+=x.value.length; }
  const out=new Uint8Array(total); let off=0; for(const c of chunks){ out.set(c,off); off+=c.length; }
  return out;
}
export async function parseXlsx(buf){
  const bytes=new Uint8Array(buf); const dv=new DataView(buf);
  let eocd=-1; for(let i=bytes.length-22;i>=0 && i>bytes.length-65558;i--){ if(bytes[i]===0x50&&bytes[i+1]===0x4B&&bytes[i+2]===0x05&&bytes[i+3]===0x06){eocd=i;break;} }
  if(eocd<0) throw new Error('File is not a valid .xlsx (ZIP).');
  const cdCount=dv.getUint16(eocd+10,true); const cdOffset=dv.getUint32(eocd+16,true);
  const entries=[]; let p=cdOffset;
  for(let i=0;i<cdCount;i++){ if(dv.getUint32(p,true)!==0x02014B50) break;
    const compMethod=dv.getUint16(p+10,true), compSize=dv.getUint32(p+20,true), fnameLen=dv.getUint16(p+28,true), extraLen=dv.getUint16(p+30,true), commentLen=dv.getUint16(p+32,true), localOffset=dv.getUint32(p+42,true);
    const name=new TextDecoder().decode(bytes.subarray(p+46,p+46+fnameLen));
    entries.push({name,compMethod,compSize,localOffset}); p+=46+fnameLen+extraLen+commentLen; }
  const getEntry=n=>entries.find(e=>e.name===n||e.name.endsWith('/'+n));
  async function readEntry(e){ const lh=e.localOffset; const fl=dv.getUint16(lh+26,true), el=dv.getUint16(lh+28,true); const start=lh+30+fl+el; const data=bytes.subarray(start,start+e.compSize);
    if(e.compMethod===0) return data;
    if(e.compMethod===8) return await inflateRaw(data);
    throw new Error('Unsupported compression method '+e.compMethod); }
  const ssE=getEntry('xl/sharedStrings.xml'); const shared=ssE?parseSharedStrings(new TextDecoder().decode(await readEntry(ssE))):[];
  const wb=new TextDecoder().decode(await readEntry(getEntry('xl/workbook.xml')));
  const relsE=getEntry('xl/_rels/workbook.xml.rels'); const rels=relsE?new TextDecoder().decode(await readEntry(relsE)):'';
  const sheetMap=parseWorkbookSheets(wb,rels); const result={};
  for(const [name,path] of Object.entries(sheetMap)){ const e=getEntry(path)||getEntry(path.replace('xl/','')); if(!e) continue;
    result[name]=parseSheet(new TextDecoder().decode(await readEntry(e)),shared); }
  return result;
}
export function parseCSV(text){
  /* RFC 4180 state machine — handles quoted fields, embedded commas/newlines,
     and escaped "" quotes. No lookbehind, so it parses on every browser (incl. Safari < 16.4). */
  const rows=[]; let row=[]; let field=''; let inQuotes=false; const n=text.length; let i=0;
  const pushField=()=>{ row.push(field); field=''; };
  const pushRow=()=>{ pushField(); rows.push(row); row=[]; };
  while(i<n){
    const c=text[i];
    if(inQuotes){
      if(c==='"'){ if(text[i+1]==='"'){ field+='"'; i+=2; continue; } inQuotes=false; i++; continue; }
      field+=c; i++; continue;
    }
    if(c==='"'){ inQuotes=true; i++; continue; }
    if(c===','){ pushField(); i++; continue; }
    if(c==='\r'){ i++; continue; }
    if(c==='\n'){ pushRow(); i++; continue; }
    field+=c; i++;
  }
  if(field!=='' || row.length>0) pushRow();
  return rows.filter(r=>r.some(c=>c!==''));
}
