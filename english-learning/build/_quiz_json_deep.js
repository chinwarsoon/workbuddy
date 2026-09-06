// Deep dive: check for any subtle JSON issue that could cause empty quiz card.
// 1) Words with empty string "" (different from undefined)
// 2) Words with whitespace-only strings
// 3) Words where defEn starts with a pos tag like "n. " / "v. "
// 4) Duplicate words
// 5) Words with emoji-only def
const fs = require("fs");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning/content";
const PACKS = ["freq-1k.json","freq-2k.json","freq-3k.json","freq-4k.json"];

for(const f of PACKS){
  const p = JSON.parse(fs.readFileSync(DIR+"/"+f,"utf8"));
  const W = p.words || [];
  console.log("\n=== "+f+" ===");

  // 1) def === "" literal empty string
  const emptyStrDef = W.filter(x => x.def === "");
  const emptyStrDefEn = W.filter(x => x.defEn === "");
  console.log("def === \"\": "+emptyStrDef.length+"  defEn === \"\": "+emptyStrDefEn.length);

  // 2) whitespace-only
  const ws = W.filter(x => typeof x.def === "string" && x.def.trim() === "" && x.def !== "");
  console.log("def whitespace-only: "+ws.length);

  // 3) pos-tag-looking defEn
  const posTagDefEn = W.filter(x => typeof x.defEn === "string" && /^(n|v|adj|adv|prep|conj|pron|interj|art|num|aux)\.?\s*$/i.test(x.defEn.trim()));
  console.log("defEn is pos-tag only: "+posTagDefEn.length);

  // 4) emoji-only def
  const emojiDef = W.filter(x => typeof x.def === "string" && /^[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]+$/u.test(x.def.trim()));
  console.log("def is emoji-only: "+emojiDef.length);

  // 5) duplicates
  const seen = new Map();
  for(const w of W){
    seen.set(w.word, (seen.get(w.word)||0)+1);
  }
  const dups = [...seen.entries()].filter(([k,v]) => v > 1);
  console.log("duplicate headwords: "+dups.length+" "+ (dups.slice(0,5).map(d=>d[0]+"x"+d[1]).join(",")));

  // 6) Look at the actual content of defEn for all words missing ipa (likely garbage)
  const noIpa = W.filter(x => !x.ipa);
  if(noIpa.length){
    console.log("no-ipa words (showing defEn for first 5):");
    noIpa.slice(0,5).forEach(x => console.log("   "+x.word+" | defEn="+JSON.stringify(x.defEn)+" | def="+JSON.stringify(x.def)));
  }
}