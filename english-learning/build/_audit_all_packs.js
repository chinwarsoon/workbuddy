// Audit ALL JSON packs loaded by the manifest, including nce2/3/4 and general.
const fs = require("fs");
const PATH = require("path");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning/content";
const manifest = JSON.parse(fs.readFileSync(DIR+"/manifest.json","utf8"));
console.log("manifest packs:", manifest.packs.map(p=>p.id+" ("+p.file+")").join(", "));

// audit every json in content/
function isBlank(s){ return s===undefined||s===null||(typeof s==="string"&&s.trim()===""); }
const files = fs.readdirSync(DIR).filter(f => f.endsWith(".json") && f !== "manifest.json");
for(const f of files){
  const p = JSON.parse(fs.readFileSync(DIR+"/"+f,"utf8"));
  const W = p.words || [];
  if(W.length === 0) continue;
  const emptyDef = W.filter(x => isBlank(x.def));
  const emptyDefEn = W.filter(x => isBlank(x.defEn));
  const bothEmpty = W.filter(x => isBlank(x.def) && isBlank(x.defEn));
  const noEx = W.filter(x => isBlank(x.ex) && isBlank(x.exEn) && isBlank(x.exzh));
  console.log("\n"+f+" total="+W.length);
  console.log("  empty def:    "+emptyDef.length+"    -> "+emptyDef.slice(0,5).map(x=>x.word).join(","));
  console.log("  empty defEn:  "+emptyDefEn.length+"    -> "+emptyDefEn.slice(0,5).map(x=>x.word).join(","));
  console.log("  BOTH empty:   "+bothEmpty.length);
  if(bothEmpty.length){
    console.log("  *** OFFENDERS ***");
    bothEmpty.forEach(x => console.log("    "+x.word+" | def="+JSON.stringify(x.def)+" defEn="+JSON.stringify(x.defEn)));
  }
  console.log("  all-ex empty: "+noEx.length);
}