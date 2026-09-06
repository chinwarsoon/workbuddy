// Phase 3 audit: same word across packs with semantic divergence
// Strategy: scan all packs, group words by lemma (lowercase), compare their `def`.
// If same word has materially different def across packs → flag as polysemy candidate.
// Then for each unflagged word, check whether the def is "generic" vs "context-fit".

const fs = require('fs');
const PACKS = ['freq-1k','freq-2k','freq-3k','freq-4k','general','nce2','nce3','nce4'];

function j(p){ return JSON.parse(fs.readFileSync('content/'+p+'.json','utf8')); }
function wkey(w){ return String(w).toLowerCase().trim(); }

// Collect all words grouped by pack
const data = {};
for(const p of PACKS) data[p] = j(p);

// Index by lemma -> [ {pack, word, def, defEn, ex, exzh} ]
const idx = {};
for(const p of PACKS){
  for(const w of data[p].words){
    if(!w || !w.word) continue;
    const k = wkey(w.word);
    (idx[k] = idx[k] || []).push({ pack:p, word:w.word, def:w.def, defEn:w.defEn, ex:w.ex, exzh:w.exzh });
  }
}

let stats = {
  totalUniqueLemmas: 0,
  multiPackLemmas: 0,
  sameDefAcrossPacks: 0,
  differentDefCrossPack: 0,
  examplesCrossPack: [],
};

// Step 1: count
for(const k of Object.keys(idx)){
  stats.totalUniqueLemmas++;
  const arr = idx[k];
  if(arr.length < 2) continue;
  stats.multiPackLemmas++;
  const defs = new Set(arr.map(x => String(x.def||'').trim()));
  if(defs.size === 1){
    stats.sameDefAcrossPacks++;
  } else {
    stats.differentDefCrossPack++;
    if(stats.examplesCrossPack.length < 30){
      stats.examplesCrossPack.push({
        word: arr[0].word,
        packs: arr.map(x => ({ pack:x.pack, def:x.def, defEn:x.defEn, ex:(x.ex||'').slice(0,50) }))
      });
    }
  }
}

// Step 2: pick a sample of 25 high-freq words (multi or single) to eyeball
const HG = ['one','way','year','well','thing','time','good','make','back','work','right','think','come','take','place','water','run','see','look','use','long','day','say','find','have'];
const samples = [];
for(const w of HG){
  const k = wkey(w);
  if(!idx[k]) continue;
  samples.push({
    word: idx[k][0].word,
    lemma: k,
    packs: idx[k].map(x => ({ pack:x.pack, def:x.def, defEn:x.defEn, ex:x.ex, exzh:x.exzh })),
  });
}

// Also: scan all multi-pack words for short "single-character-class" defs that
// might be too narrow (e.g., "well"="井"  misses the adverb sense).
// Heuristic: if def has ≤3 CJK chars and the lemma is in a word list of common polysemous adjs/advs,
// flag for human review.
const COMMON_ADV_ADJ_EN = new Set([
  'well','just','only','right','still','already','yet','even','also','too',
  'very','much','far','long','often','always','never','sometimes','usually',
  'down','up','in','out','on','off','over','under','about','through',
  'around','across','along','within','without','before','after','since','until',
  'against','among','between','toward','forward','backward','straight','hard',
  'fast','slow','early','late','close','near','high','low','deep','wide',
  'narrow','thin','thick','rich','poor','clean','dirty','full','empty','open',
  'close','tight','loose','heavy','light','hot','cold','warm','cool','wet',
  'dry','bright','dark','clear','plain','quiet','loud','cheap','expensive','safe',
  'sound','fair','fine','big','small','little','great','good','bad','new','old',
  'young','real','true','false','right','wrong','left','sure','certain',
]);
const contextualRisk = [];
for(const k of Object.keys(idx)){
  const arr = idx[k];
  const first = arr[0];
  const defStr = String(first.def||'').trim();
  // crude narrowness: def cjk count ≤ 2 OR def ends without an adj/adv marker
  // We focus on English polysemy-prone words
  if(COMMON_ADV_ADJ_EN.has(k)){
    // if def doesn't contain typical multiple-meaning words, flag
    contextualRisk.push({
      word: first.word,
      packsFound: [...new Set(arr.map(x => x.pack))],
      def: first.def,
      defEn: first.defEn,
      ex: first.ex,
      exzh: first.exzh,
    });
  }
}

const out = {
  overview: {
    totalUniqueLemmas: stats.totalUniqueLemmas,
    multiPackLemmas: stats.multiPackLemmas,
    crossPackSameDef: stats.sameDefAcrossPacks,
    crossPackDifferentDef: stats.differentDefCrossPack,
  },
  highFreqSamples: samples,
  crossPackPolysemyExamples: stats.examplesCrossPack.slice(0, 15),
  contextualRiskWords: contextualRisk.slice(0, 30),
};

fs.writeFileSync('build/_p3_audit.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out, null, 2));
