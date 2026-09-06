// Audit all 4 JSON packs for any field that could render the quiz card empty.
const fs = require("fs");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning/content";
const PACKS = ["freq-1k.json","freq-2k.json","freq-3k.json","freq-4k.json"];

function isBlank(s){
  return s === undefined || s === null || (typeof s === "string" && s.trim() === "");
}

for(const f of PACKS){
  const p = JSON.parse(fs.readFileSync(DIR+"/"+f,"utf8"));
  const W = p.words || [];
  console.log("\n========= "+f+"  total words: "+W.length+" =========");

  // For each quiz-relevant field combo, list every offender.
  const fields = ["word","ipa","pos","def","defEn","ex","exzh","exEn","emoji"];
  for(const fld of fields){
    const miss = W.filter(x => isBlank(x[fld]));
    if(miss.length){
      console.log("  missing/blank `"+fld+"`: "+miss.length);
      miss.slice(0,5).forEach(x => console.log("    - "+x.word));
    }
  }

  // Specifically: words where def AND defEn are both blank
  // (would render `""` in any language mode)
  const bothDefBlank = W.filter(x => isBlank(x.def) && isBlank(x.defEn));
  console.log("  def AND defEn both blank: "+bothDefBlank.length);
  bothDefBlank.forEach(x => console.log("    ! "+x.word));

  // Words where ex AND exEn AND exzh are all blank
  const allExBlank = W.filter(x => isBlank(x.ex) && isBlank(x.exEn) && isBlank(x.exzh));
  console.log("  ex+exEn+exzh all blank: "+allExBlank.length+" (first 3: "+allExBlank.slice(0,3).map(x=>x.word).join(",")+")");

  // Suspicious: def is a single char / looks like a stray pos tag
  const shortDef = W.filter(x => typeof x.def === "string" && x.def.trim().length > 0 && x.def.trim().length < 3);
  if(shortDef.length){
    console.log("  def shorter than 3 chars: "+shortDef.length);
    shortDef.slice(0,5).forEach(x => console.log("    ? "+x.word+" -> "+JSON.stringify(x.def)));
  }

  // Suspicious: defEn that is a single letter like "n" / "v" (known ECDICT defect from history)
  const posOnlyDefEn = W.filter(x => typeof x.defEn === "string" && /^[a-z]\.?$|^[a-z]\.[a-z]?\.?$/i.test(x.defEn.trim()));
  if(posOnlyDefEn.length){
    console.log("  defEn looks like pos tag only: "+posOnlyDefEn.length);
    posOnlyDefEn.slice(0,5).forEach(x => console.log("    ? "+x.word+" -> "+JSON.stringify(x.defEn)));
  }

  // unicode escapes that may render as literal "\n" (historical ECDICT bug)
  const hasLiteralN = W.filter(x => JSON.stringify(x).includes("\\n"));
  if(hasLiteralN.length){
    console.log("  entries containing literal \\n in any string: "+hasLiteralN.length);
    hasLiteralN.slice(0,5).forEach(x => console.log("    \\n in "+x.word+" fields: "+Object.keys(x).filter(k=>typeof x[k]==="string"&&x[k].includes("\n")).join(",")));
  }
}