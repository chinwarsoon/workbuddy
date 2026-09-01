/*
 * 12.1 — Regenerate Phase-2 (freq-2k) example sentences.
 *
 * Problem being fixed (see WORKPLAN §12.1):
 *   - only 14 EN / 11 ZH templates covered all 1879 words (zero variety)
 *   - 100% of exzh pasted the raw English word into the Chinese sentence
 *   - POS was ignored, producing ungrammatical output ("We need to tired a clear answer.")
 *   - ECDICT glosses are noisy ("村庄 a. 乡村的", "在...下方在...下方")
 *
 * Strategy:
 *   1. clean the gloss (strip POS markers, later senses, duplicated halves)
 *   2. correct POS only when the pack says v./adj./adv. but the gloss disagrees
 *   3. pick from a library of 16 semantically-generic frames per POS (topic frames for
 *      nouns sidestep the "the weather helps explain the result" nonsense), rotating
 *      deterministically so neighbouring words never share a frame
 *   4. hand-authored overrides take precedence (build/_p2_overrides.json)
 *
 * Usage:  node build/_gen_p2_examples.js [--apply] [--sample N]
 *         default is dry-run: prints samples + writes build/_p2_preview.txt
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SRC = path.join(ROOT, "pwa", "content", "freq-2k.json");
const CURATED_DIR = path.join(__dirname, "_p2_curated");
const PREVIEW = path.join(__dirname, "_p2_preview.txt");

// Hand-authored sentences live in build/_p2_curated/*.json so they can be added in
// batches without rewriting one huge file. Later files win on key collisions.
function loadOverrides() {
  const out = {};
  if (!fs.existsSync(CURATED_DIR)) return out;
  for (const f of fs.readdirSync(CURATED_DIR).sort()) {
    if (!/\.json$/.test(f)) continue;
    const part = JSON.parse(fs.readFileSync(path.join(CURATED_DIR, f), "utf8"));
    Object.assign(out, part);
  }
  return out;
}

/* ---------------- gloss cleanup ---------------- */

// cut everything from the first inline POS marker: "村庄 a. 乡村的" -> "村庄"
function stripPosMarker(s) {
  return s.replace(/\s+(?:a|n|v|vt|vi|adj|adv|prep|conj|pron|pl|abbr)\.\s+[\s\S]*$/, "").trim();
}

// "在...下方在...下方" -> "在...下方"
function dedupeRepeatedHalf(s) {
  if (s.length >= 4 && s.length % 2 === 0) {
    const h = s.slice(0, s.length / 2);
    if (h === s.slice(s.length / 2)) return h;
  }
  return s;
}

// if the gloss still contains a space, keep the first token when it looks complete
function firstTokenIfSane(s) {
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return s;
  const head = parts[0];
  if (/[的地者人]$/.test(head)) return head;   // "电子的 电子工业协会接口" -> "电子的"
  if (head.length <= 4) return head;           // "保险 确保投保" -> "保险"
  return s;
}

function cleanGloss(def) {
  let g = String(def || "").split(/[,，;；、]/)[0].trim();
  g = stripPosMarker(g);
  g = dedupeRepeatedHalf(g);
  g = firstTokenIfSane(g);
  return g;
}

// adjective frames supply their own 的, so strip it from the gloss
function stripDe(g) {
  return /的$/.test(g) && g.length > 2 ? g.slice(0, -1) : g;
}

/* ---------------- frame libraries ---------------- */

/*
 * Frame design rule: a frame must stay grammatical AND plausible for *every* member
 * of its POS class. That rules out frames that assert specific real-world semantics
 * ("You can see the {w} in this photo" is absurd for `grandmother`).
 * "Topic / comment" frames satisfy this — they work for concrete and abstract nouns alike.
 */
const NOUN_FRAMES = [
  ["Let's talk about the {w} first.", "我们先谈谈{g}。"],
  ["The {w} matters more than you think.", "{g}比你以为的更重要。"],
  ["I know very little about the {w}.", "我对{g}了解很少。"],
  ["We cannot ignore the {w}.", "我们不能忽视{g}。"],
  ["The {w} is not the real problem.", "{g}不是真正的问题。"],
  ["He knows a lot about the {w}.", "他很了解{g}。"],
  ["Nobody explained the {w} to us.", "没有人向我们解释{g}。"],
  ["The {w} came up again today.", "今天又提到了{g}。"],
  ["It is hard to describe the {w} in a few words.", "很难用几句话描述{g}。"],
  ["People often worry about the {w}.", "人们常常为{g}担心。"],
  ["The {w} was the first thing I noticed.", "我首先注意到的就是{g}。"],
  ["She has strong views on the {w}.", "她对{g}有很鲜明的看法。"],
  ["The {w} surprised everyone in the room.", "{g}让在场的所有人都很意外。"],
  ["We keep coming back to the {w}.", "我们总是绕回{g}这个话题。"],
  ["That is where the {w} becomes important.", "那就是{g}变得重要的地方。"],
  ["The {w} says a lot about them.", "{g}很能说明他们的情况。"]
];

/*
 * Verb frames deliberately take NO object: that keeps them usable for both transitive
 * and intransitive verbs. A frame like "We should {w} the plan" breaks on intransitive
 * verbs, and a frame like "We should {w}" breaks on strictly transitive ones — so we
 * only use bare-infinitive completions, which tolerate both.
 */
const VERB_FRAMES = [
  ["We tried to {w}, and it worked.", "我们试着{g}，结果成功了。"],
  ["It is hard to {w} well.", "要把{g}做好很难。"],
  ["They want to {w}, but they cannot.", "他们想{g}，但做不到。"],
  ["Nobody asked us to {w}.", "没有人要求我们{g}。"],
  ["You should not {w} alone.", "你不该独自{g}。"],
  ["It helps to {w} early.", "早点{g}会有帮助。"],
  ["We decided to {w} after all.", "我们最终还是决定{g}。"],
  ["He learned to {w} the hard way.", "他吃了苦头才学会{g}。"],
  ["Do not {w} until you are ready.", "在你准备好之前不要{g}。"],
  ["They had to {w} again and again.", "他们不得不反复{g}。"],
  ["I would rather {w} than wait.", "我宁愿{g}，也不愿等待。"],
  ["She managed to {w} in the end.", "她最终设法{g}了。"],
  ["It took courage to {w}.", "{g}是需要勇气的。"],
  ["We cannot {w} without help.", "没有帮助我们就无法{g}。"],
  ["He offered to {w} for us.", "他主动提出替我们{g}。"],
  ["Nothing happened when we tried to {w}.", "我们试着{g}时，什么也没发生。"]
];

/*
 * Adjective frames avoid the indefinite article entirely — "a {w} example" produces
 * "a illegal example". Predicate and bare-complement positions are article-free.
 */
const ADJ_FRAMES = [
  ["The answer was {w}, and everyone knew it.", "答案是{g}的，大家都知道。"],
  ["We need something more {w}.", "我们需要更{g}的东西。"],
  ["The room felt {w} to me.", "我觉得房间很{g}。"],
  ["It is {w} to say that out loud.", "把那句话说出口是{g}的。"],
  ["She gave a very {w} reply.", "她给出了一个非常{g}的回答。"],
  ["The result was {w}, so they tried again.", "结果很{g}，于是他们又试了一次。"],
  ["Their plan seemed {w} at first.", "他们的计划起初显得很{g}。"],
  ["Most people thought it was {w}.", "大多数人认为它很{g}。"],
  ["He stayed {w} the whole time.", "他全程都很{g}。"],
  ["That sounds {w}, but it is true.", "那听起来{g}，但却是真的。"],
  ["After the change, everything felt {w}.", "改动之后，一切都让人觉得{g}。"],
  ["Keep it {w} and simple.", "保持{g}、简单就好。"],
  ["Nobody expected it to be so {w}.", "没人想到会这么{g}。"],
  ["The idea is {w}, yet people accept it.", "这个想法{g}，但人们接受了它。"],
  ["I have never seen anything so {w}.", "我从未见过这么{g}的东西。"],
  ["It looked {w}, but nobody said a word.", "它看起来{g}，但没人说一句话。"]
];

const ADV_FRAMES = [
  ["He answered the question {w}.", "他{g}回答了这个问题。"],
  ["The two reports differ {w}.", "两份报告{g}不同。"],
  ["She {w} agrees with the final decision.", "她{g}同意最后的决定。"],
  ["It works {w}, so we kept the old rule.", "它{g}有效，所以我们保留了旧规则。"],
  ["The number rose {w} over the year.", "这一数字在一年内{g}上升。"],
  ["They {w} finished before the deadline.", "他们{g}在截止日期前完成了。"],
  ["You can see it {w} in this chart.", "在这张图表中你能{g}看到它。"],
  ["He spoke {w}, so everyone understood.", "他讲得很{g}，所以大家都听懂了。"],
  ["The plan failed {w}, and nobody knew why.", "计划{g}失败了，没人知道原因。"],
  ["I {w} remember what she said.", "我{g}记得她说过的话。"],
  ["The cost fell {w} after the change.", "改动之后成本{g}下降了。"],
  ["He {w} refused to give a reason.", "他{g}拒绝给出理由。"],
  ["The light changed {w} as we watched.", "我们注视着，光线{g}变化着。"],
  ["She {w} opened the door and left.", "她{g}打开门走了出去。"],
  ["That happens {w} in real life.", "这在现实生活中{g}发生。"],
  ["They {w} repeated the same mistake.", "他们{g}重复了同样的错误。"]
];

/*
 * Adverbs are the one class where a frame CANNOT be made universal: manner adverbs
 * ("carefully" -> "他小心地回答了这个问题") fit modifier slots fine, but conjunctive
 * adverbs ("otherwise", "moreover", "hence") do not — they connect clauses and produce
 * "他否则回答了这个问题". Those must come from _p2_overrides.json.
 */
const CONJUNCTIVE_ADV = /^(otherwise|instead|whereas|moreover|nevertheless|furthermore|hence|consequently|whilst|therefore|thus|however|meanwhile|nonetheless|besides|anyway|anymore|altogether|firstly|secondly|twice|neither|anywhere|everywhere|elsewhere|abroad|whenever|wherever|apart|alongside)$/;

/* ---------------- POS resolution ---------------- */

function resolvePos(w, gloss) {
  const p = (w.pos || "n.").trim();
  // only second-guess the pack on the three "open" classes
  if (p === "v." && /的$/.test(gloss)) return "adj.";   // busy/slow/secure were tagged v.
  if (p === "adv." && /的$/.test(gloss)) return "adj.";
  return p;
}

/* ---------------- generation ---------------- */

function pick(frames, seed) {
  return frames[seed % frames.length];
}

function generate(w, i) {
  const g = cleanGloss(w.def);
  const pos = resolvePos(w, g);

  if (pos === "v.") {
    const [en, zh] = pick(VERB_FRAMES, i * 7 + 3);
    return [en.replace("{w}", w.word), zh.replace("{g}", g)];
  }
  if (pos === "adj.") {
    const [en, zh] = pick(ADJ_FRAMES, i * 5 + 1);
    return [en.replace("{w}", w.word), zh.replace("{g}", stripDe(g))];
  }
  if (pos === "adv.") {
    const [en, zh] = pick(ADV_FRAMES, i * 3 + 2);
    return [en.replace("{w}", w.word), zh.replace("{g}", g)];
  }
  const [en, zh] = pick(NOUN_FRAMES, i);
  return [en.replace("{w}", w.word), zh.replace("{g}", g)];
}

/* ---------------- main ---------------- */

function main() {
  const argv = process.argv.slice(2);
  const apply = argv.includes("--apply");
  const sampleArg = argv.indexOf("--sample");
  const sampleN = sampleArg >= 0 ? parseInt(argv[sampleArg + 1], 10) : 24;

  const data = JSON.parse(fs.readFileSync(SRC, "utf8"));
  const words = data.words;
  const overrides = loadOverrides();

  let fromOverride = 0;
  const rows = words.map((w, i) => {
    if (overrides[w.word]) {
      fromOverride++;
      return { word: w.word, pos: w.pos, ex: overrides[w.word][0], exzh: overrides[w.word][1], src: "curated" };
    }
    const [ex, exzh] = generate(w, i);
    return { word: w.word, pos: w.pos, ex, exzh, src: "gen" };
  });

  const preview = rows.map(r => `${r.word}\t[${r.src}]\t${r.ex}\t${r.exzh}`).join("\n");
  fs.writeFileSync(PREVIEW, preview, "utf8");

  // validation
  const problems = [];
  for (const r of rows) {
    if (/[A-Za-z]/.test(r.exzh)) problems.push(`${r.word}: ZH contains latin -> ${r.exzh}`);
    if (/\s{2,}/.test(r.ex)) problems.push(`${r.word}: double space in EN -> ${r.ex}`);
    if (!/[.?!]$/.test(r.ex)) problems.push(`${r.word}: EN not terminated -> ${r.ex}`);
    if (!/[。！？]$/.test(r.exzh)) problems.push(`${r.word}: ZH not terminated -> ${r.exzh}`);
  }

  // conjunctive adverbs cannot be framed — they must be hand-authored
  const needCurate = [];
  words.forEach((w, i) => {
    if (overrides[w.word]) return;
    if (CONJUNCTIVE_ADV.test(w.word)) needCurate.push(w.word);
  });

  const uniqZh = new Set(rows.map(r => r.exzh)).size;
  const uniqEn = new Set(rows.map(r => r.ex)).size;

  console.log(`words                : ${rows.length}`);
  console.log(`curated overrides    : ${fromOverride}`);
  console.log(`generated            : ${rows.length - fromOverride}`);
  console.log(`unique EN sentences  : ${uniqEn}`);
  console.log(`unique ZH sentences  : ${uniqZh}`);
  console.log(`validation problems  : ${problems.length}`);
  problems.slice(0, 20).forEach(p => console.log("   ! " + p));
  console.log(`conjunctive adverbs needing curation: ${needCurate.length}`);
  if (needCurate.length) console.log("   " + needCurate.join(" "));
  console.log(`preview written      : ${PREVIEW}`);

  console.log(`\n--- sample (${sampleN}) ---`);
  const step = Math.max(1, Math.floor(rows.length / sampleN));
  for (let i = 0; i < rows.length && i / step < sampleN; i += step) {
    const r = rows[i];
    console.log(`${r.word} (${r.pos}) [${r.src}]\n   EN: ${r.ex}\n   ZH: ${r.exzh}`);
  }

  if (apply) {
    if (problems.length) {
      console.log("\nABORT: fix validation problems before applying.");
      process.exit(1);
    }
    rows.forEach((r, i) => {
      words[i].ex = r.ex;
      words[i].exzh = r.exzh;
      words[i].exEn = r.ex;
    });
    const out = JSON.stringify(data);
    fs.writeFileSync(path.join(ROOT, "pwa", "content", "freq-2k.json"), out, "utf8");
    fs.writeFileSync(path.join(ROOT, "content", "freq-2k.json"), out, "utf8");
    console.log("\nAPPLIED to pwa/content/freq-2k.json and content/freq-2k.json");
  } else {
    console.log("\n(dry run — pass --apply to write)");
  }
}

main();
