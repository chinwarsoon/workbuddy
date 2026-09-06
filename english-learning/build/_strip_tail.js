// Strip the legacy "🔁 Review:" forced tail from on-disk freq-3k.json readings
// (in-place, preserving Step ①'s cleaned defs) and align the pack desc with the
// Option-F builder. We do NOT re-run _build_p3.js because its source (p3_words.js)
// still holds the pre-cleaning defs and would undo Step ①.
const fs = require("fs");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const NEW_DESC = "基于 New Academic Word List（NAWL）前 800 学术词：12 篇 B1 分级阅读，每篇 3 道题。阅读中自然复现的第 1–2 阶词以蓝词呈现（点击看释义/发音）；跨阶段复习由你的生词卡完成。蓝词即每日重点。";
const NEW_DESCEN = "Phase 3 on the New Academic Word List (NAWL) top 800: 12 B1 graded readings, each 3 questions. Phase 1–2 words that surface naturally are blue popups (tap for meaning/audio); cross-phase review is handled by your own flashcards. Blue words are the daily focus.";
const targets = ["content/freq-3k.json", "pwa/content/freq-3k.json"];
let total = 0, anyTail = false;
for (const rel of targets) {
  const p = DIR + "/" + rel;
  const pack = JSON.parse(fs.readFileSync(p, "utf8"));
  pack.readings.forEach(r => {
    const i = r.text.indexOf("\n🔁 Review:");
    if (i >= 0) { r.text = r.text.slice(0, i); total++; anyTail = true; }
  });
  pack.desc = NEW_DESC;
  pack.descEn = NEW_DESCEN;
  fs.writeFileSync(p, JSON.stringify(pack, null, 1));
}
console.log("Stripped 🔁 Review tails from " + total + " readings across " + targets.length + " files. anyTailPresent=" + anyTail);
