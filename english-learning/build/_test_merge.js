// Simulate allWordsGlobal merge-by-quality to confirm the empty-def fin bug is fixed.
const fs=require("fs");
const html=fs.readFileSync(__dirname+"/../pwa/index.html","utf8");
function extractFn(name){
  const re=new RegExp("function\\s+"+name+"\\s*\\([^)]*\\)\\s*\\{");
  const m=re.exec(html); if(!m) throw new Error("not found: "+name);
  let i=m.index+m[0].length-1, depth=0;
  for(;i<html.length;i++){ const c=html[i];
    if(c==="{") depth++; else if(c==="}"){ depth--; if(depth===0) break; } }
  return html.slice(m.index, i+1);
}
const src=extractFn("allWordsGlobal");
// build fns with free vars injected as outer params: PACKS, globalWordsCache
const fn=new Function("PACKS","globalWordsCache", src+"\nreturn allWordsGlobal();");
// Note: allWordsGlobal assigns globalWordsCache=out (local var) but returns out fine.

function run(name, packs, expectFinDef){
  const cache=null; // force rebuild
  const res=fn(packs, cache);
  const fin=res.find(w=>w.word.toLowerCase()==="fin");
  const ok=fin && (fin.def||fin.defEn);
  console.log((ok?"PASS":"FAIL"),"|",name,"| fin.def="+JSON.stringify(fin&&fin.def),"| fin.defEn="+JSON.stringify(fin&&fin.defEn));
  // also ensure no word is silently dropped
  const words=res.map(w=>w.word.toLowerCase());
  console.log("    pool size:", res.length, "contains fin:", words.includes("fin"), "contains serene:", words.includes("serene"));
  return !!ok;
}

// Case 1: imported empty-def pack visited FIRST, official def pack visited SECOND
const importedEmpty={id:"imported", words:[
  {word:"fin", def:"", defEn:""},
  {word:"conduction", def:"", defEn:""},
  {word:"tutor", def:"", defEn:""}
]};
const official={id:"freq3k", words:[
  {word:"fin", def:"鳍", defEn:"a stabilizer on a ship that resembles the fin of a fish"},
  {word:"serene", def:"宁静的", defEn:"calm and peaceful"}
]};
console.log("Case 1: empty imported pack first, official def pack second => expect fin.def filled");
run("imported-first", {imported:importedEmpty, freq3k:official});

// Case 2: reverse order (official first, imported second)
console.log("Case 2: official first, imported empty second => expect fin.def preserved (first wins)");
run("official-first", {freq3k:official, imported:importedEmpty});
