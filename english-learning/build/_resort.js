const fs=require('fs');
const DIR='C:/Users/frank/WorkBuddy/workbuddy/english-learning/build/';
const ngslRank=JSON.parse(fs.readFileSync(DIR+'ngsl_rank.json','utf8'));
const load=f=>require(DIR+f);
const dicts=[load('p1_words_a.js'),load('p1_words_b.js'),load('p2_words_a.js'),load('p2_words_b.js')];
const irr={children:'child',men:'man',women:'woman',feet:'foot',teeth:'tooth',mice:'mouse',geese:'goose',people:'person',best:'good',better:'good',worst:'bad',worse:'bad',less:'little',more:'many',most:'many',fewest:'few',thought:'think',thoughts:'think',bought:'buy',built:'build',paid:'pay',saw:'see',went:'go',came:'come',did:'do',made:'make',took:'take',gave:'give'};
function lemma(w){
  if(ngslRank[w]!==undefined) return w;
  if(irr[w]) return irr[w];
  let s=w, tries=[];
  if(/ies$/.test(s)) tries.push(s.slice(0,-3)+'y');
  if(/(ses|ches|shes|xes)$/.test(s)) tries.push(s.slice(0,-2));
  else if(/s$/.test(s)&&!/ss$/.test(s)) tries.push(s.slice(0,-1));
  if(/ied$/.test(s)) tries.push(s.slice(0,-3)+'y');
  if(/ed$/.test(s)){ tries.push(s.slice(0,-2)); tries.push(s.slice(0,-1)); }
  if(/ing$/.test(s)){ tries.push(s.slice(0,-3)); tries.push(s.slice(0,-3)+'e'); if(/ying$/.test(s)) tries.push(s.slice(0,-4)+'ie'); }
  if(/er$/.test(s)){ tries.push(s.slice(0,-2)); tries.push(s.slice(0,-1)); }
  if(/est$/.test(s)){ tries.push(s.slice(0,-3)); tries.push(s.slice(0,-2)); }
  if(/ly$/.test(s)) tries.push(s.slice(0,-2));
  for(const t of tries){ if(ngslRank[t]!==undefined) return t; }
  return null;
}
const p1={}, p2={}, dropped=[];
dicts.forEach(d=>{
  Object.keys(d).forEach(w=>{
    const lem=lemma(w);
    if(lem===null){ dropped.push(w); return; }
    const r=ngslRank[lem];
    if(r<=1000) p1[w]=d[w]; else p2[w]=d[w];
  });
});
const dump=o=>'module.exports = '+JSON.stringify(o,null,1)+';\n';
fs.writeFileSync(DIR+'p1_words_ngsl.js',dump(p1));
fs.writeFileSync(DIR+'p2_words_ngsl.js',dump(p2));
// rank span check
const r1=Object.keys(p1).map(w=>ngslRank[lemma(w)]).filter(x=>x);
const r2=Object.keys(p2).map(w=>ngslRank[lemma(w)]).filter(x=>x);
console.log('P1 entries:',Object.keys(p1).length,'| rank span',Math.min(...r1),'-',Math.max(...r1));
console.log('P2 entries:',Object.keys(p2).length,'| rank span',Math.min(...r2),'-',Math.max(...r2));
console.log('Dropped (no NGSL lemma):',dropped.length,'=>',dropped.join(' '));
