const fs=require("fs");
const DIR="C:/Users/frank/WorkBuddy/workbuddy/english-learning/content";
for(const f of ["freq-1k.json","freq-2k.json","freq-3k.json","freq-4k.json"]){
  const p=JSON.parse(fs.readFileSync(DIR+"/"+f,"utf8"));
  const w=p.words;
  const noDefEn=w.filter(x=>!x.defEn || x.defEn==="").length;
  const noExEn=w.filter(x=>!x.exEn || x.exEn==="").length;
  const noDef=w.filter(x=>!x.def || x.def==="").length;
  const noEx=w.filter(x=>!x.ex || x.ex==="").length;
  console.log(f, "words:", w.length, "missing defEn:", noDefEn, "missing exEn:", noExEn, "missing def:", noDef, "missing ex:", noEx);
}