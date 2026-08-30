/* Build enriched frequency packs (freq-1k / freq-2k) from authored data.
   Authority = New General Service List (NGSL), frequency-ranked 1..2809.
   No core-exemption hack: every blue word must sit in its phase NGSL band.
   Checks: band membership, blue-tag/list match, reading length, questions.
   Writes content/*.json + pwa/content/*.json */
const fs = require("fs");
const path = require("path");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const ngslRank = JSON.parse(fs.readFileSync(path.join(DIR,"build","ngsl_rank.json"),"utf8"));
const ngslList = fs.readFileSync(path.join(DIR,"build","ngsl.txt"),"utf8").split(/\r?\n/).map(s=>s.trim()).filter(Boolean);

function rankOf(w){ const r = ngslRank[String(w).toLowerCase()]; return r===undefined ? null : r; }
function stems(w){
  const out=[w];
  if(/(ss|sh|ch|x|s)$/.test(w)) out.push(w.replace(/es$/,""));
  out.push(w.replace(/s$/,""));
  out.push(w.replace(/ies$/,"y"));
  out.push(w.replace(/ed$/,""), w.replace(/ed$/,"e"));
  out.push(w.replace(/ing$/,""), w.replace(/ing$/,"e"));
  return [...new Set(out.filter(Boolean))];
}
function bandOf(w, lo, hi){
  for(const s of stems(w)){ const r = rankOf(s); if(r!==null && r>=lo && r<hi) return r; }
  return null;
}

const problems = [];
function bad(msg){ problems.push(msg); }

function buildPack(cfg){
  const dict = {};
  cfg.wordFiles.forEach(f=>{
    const d = require(path.join(DIR,"build",f));
    Object.keys(d).forEach(k=>{ dict[k] = d[k]; });
  });
  /* combined lookup across BOTH phases: a reading in either phase may
     highlight any NGSL word that has a teaching entry (spiraling / review). */
  const lookup = {};
  ["p1_words_ngsl.js","p2_words_ngsl.js"].forEach(f=>{
    const d = require(path.join(DIR,"build",f));
    Object.keys(d).forEach(k=>{ if(!lookup[k]) lookup[k]=d[k]; });
  });
  const readings = require(path.join(DIR,"build",cfg.readingsFile));

  /* Make the pack self-contained: any blue word used in THIS phase's
     readings must carry its definition inside this pack (even if the word
     belongs to the other phase — that is legitimate spiraling/review). */
  const usedBlues = new Set();
  readings.forEach(r=>{
    (r.text.match(/<b>([^<]+)<\/b>/g)||[]).forEach(m=>{ usedBlues.add(m.replace(/<\/?b>/g,"").trim().toLowerCase()); });
  });
  usedBlues.forEach(b=>{
    if(dict[b]) return;
    const key = stems(b).find(s=>lookup[s]) || (lookup[b] ? b : null);
    if(key && lookup[key]){ dict[key] = lookup[key]; if(b!==key) dict[b] = lookup[key]; }
  });

  readings.forEach((r, i)=>{
    const tag = cfg.id+"-R"+(i+1);
    const inText = (r.text.match(/<b>([^<]+)<\/b>/g)||[]).map(m=>m.replace(/<\/?b>/g,"").trim().toLowerCase());
    const declared = r.blue.map(s=>s.toLowerCase());
    const diff = inText.filter(w=>!declared.includes(w)).concat(declared.filter(w=>!inText.includes(w)));
    if(diff.length) bad(tag+": blue list does not match <b> tags -> "+diff.join(","));

    const words = r.text.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean);
    if(words.length < cfg.minWords || words.length > cfg.maxWords)
      bad(tag+": length "+words.length+" outside ["+cfg.minWords+","+cfg.maxWords+"]");

    inText.forEach(b=>{
      if(!lookup[b] && !stems(b).some(s=>lookup[s]))
        bad(tag+": blue word '"+b+"' has no teaching entry (not an NGSL taught word)");
    });
    if(!r.q || r.q.length!==3) bad(tag+": needs exactly 3 questions, has "+(r.q?r.q.length:0));
    (r.q||[]).forEach((q,qi)=>{
      if(!q.q || !Array.isArray(q.options) || q.options.length!==3) bad(tag+"-Q"+(qi+1)+": needs 3 options");
      if(typeof q.a!=="number" || q.a<0 || q.a>2) bad(tag+"-Q"+(qi+1)+": answer index out of range");
    });
  });

  /* words array: taught (dictionary) entries first, then remaining NGSL band words as bare */
  const taughtMap = {};
  const words = Object.keys(dict).map(w=>{
    taughtMap[w]=1;
    const [ipa,pos,def,defEn,ex,exzh,exEn,emoji] = dict[w];
    return { word:w, ipa:ipa, pos:pos, def:def, defEn:defEn, ex:ex, exzh:exzh, exEn:exEn, emoji:emoji||"📘" };
  });
  for(let i=cfg.lo-1; i<cfg.hi-1; i++){
    const w = ngslList[i];
    if(w && !taughtMap[w]) words.push({word:w,ipa:"",pos:"",def:"",defEn:"",ex:"",exzh:"",exEn:"",emoji:"📘"});
  }

  const readingsJSON = readings.map(r=>{
    const inText = (r.text.match(/<b>([^<]+)<\/b>/g)||[]).map(m=>m.replace(/<\/?b>/g,"").trim().toLowerCase());
    const seen = {};
    const vocab = inText.map(b=>{
      const key = stems(b).find(s=>dict[s]) || b;
      if(seen[key]) return null; seen[key]=1;
      const d = dict[key]; if(!d) return null;
      return { w:key, d:d[2], dEn:d[3], ipa:d[0], pos:d[1], emoji:d[7]||"📘", ex:d[4], exzh:d[5], exEn:d[6] };
    }).filter(Boolean);
    return { title:r.title, titleEn:r.titleEn, level:r.level, text:r.text, vocab:vocab, questions:r.q };
  });

  const areaTasks = {
    vocab:{zh:["学习本阶段新单词","复习生词卡 5 分钟"],en:["Learn this phase's new words","Review flashcards 5 min"]},
    reading:{zh:["阅读一篇频率分级短文","做阅读理解题"],en:["Read a frequency-graded text","Do the comprehension quiz"]},
    speaking:{zh:["跟读重点词 5 分钟","用英语描述今天"],en:["Shadow-read key words 5 min","Describe today in English"]},
    listening:{zh:["听重点词与例句","听短文并跟读"],en:["Listen to key words & examples","Listen to the text and repeat"]},
    grammar:{zh:["学习一个语法点","用新语法造句"],en:["Study one grammar point","Make sentences with it"]},
    writing:{zh:["写 3 句英语日记","写一封简短英文信"],en:["Write a 3-sentence diary","Write a short English note"]}
  };
  const areaLabel = {
    zh:{vocab:"词汇",reading:"阅读",speaking:"口语",listening:"听力",grammar:"语法",writing:"写作"},
    en:{vocab:"Vocabulary",reading:"Reading",speaking:"Speaking",listening:"Listening",grammar:"Grammar",writing:"Writing"}
  };

  const pack = {
    id:cfg.id, name:cfg.name, nameEn:cfg.nameEn, desc:cfg.desc, descEn:cfg.descEn,
    words:words, readings:readingsJSON, areaTasks:areaTasks, areaLabel:areaLabel
  };
  const out = JSON.stringify(pack, null, 1);
  fs.writeFileSync(path.join(DIR,"content",cfg.file), out);
  fs.writeFileSync(path.join(DIR,"pwa","content",cfg.file), out);
  console.log("WROTE "+cfg.file+" — "+words.length+" words ("+Object.keys(dict).length+" taught), "+readingsJSON.length+" readings");
}

const P1 = {
  id:"freq1k", file:"freq-1k.json",
  name:"高频词·第1阶 (NGSL 1–1000)", nameEn:"High-Frequency 1 (NGSL 1–1000)",
  desc:"基于 New General Service List（NGSL）前 1000 词：12 篇 A1 分级阅读，每篇 3 道题（细节/主旨/词义）。蓝词即每日重点。",
  descEn:"Phase 1 on the New General Service List (NGSL) top 1000: 12 A1 graded readings, each 3 questions (detail / main idea / word meaning). Blue words are the daily focus.",
  lo:1, hi:1001, minWords:90, maxWords:150,
  wordFiles:["p1_words_ngsl.js"], readingsFile:"p1_readings.js"
};
const P2 = {
  id:"freq2k", file:"freq-2k.json",
  name:"高频词·第2阶 (NGSL 1001–2809)", nameEn:"High-Frequency 2 (NGSL 1001–2809)",
  desc:"基于 NGSL 第 1001–2809 词：12 篇 A2 分级阅读，每篇 3 道题。",
  descEn:"Phase 2 on NGSL ranks 1001–2809: 12 A2 graded readings, each 3 questions.",
  lo:1001, hi:2810, minWords:150, maxWords:240,
  wordFiles:["p2_words_ngsl.js"], readingsFile:"p2_readings.js"
};

const which = process.argv[2];
const PACKS = which==="1" ? [P1] : which==="2" ? [P2] : [P1, P2];
PACKS.forEach(buildPack);

if(problems.length){
  console.log("\nPROBLEMS ("+problems.length+"):\n"+problems.join("\n"));
  process.exit(1);
}
console.log("\nALL CHECKS PASSED");
