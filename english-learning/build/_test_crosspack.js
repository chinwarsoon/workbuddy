/* Cross-pack flashcard smoke test (jsdom).
   Verifies:
   1. Migration: old "pack::word" cards fold into global "word" keys with
      conservative merge (soonest due, least advanced schedule, union packs).
   2. Migration is idempotent.
   3. dueCardsGlobal() spans packs; dueCards() is scoped to active pack words.
   4. isLearned() recognizes words learned in ANY pack (cross-pack capture).
   5. captureLearnedInPack() creates a card for already-learned pack words.
   6. learnWord() re-uses an existing schedule (no reset) and adds provenance.
   7. rateCard() Easy multiplier is x2.2.
   8. Badge shows the GLOBAL due count; globalflash mode renders.
   9. importData path migrates old backups (spot-check via migrateState). */
const fs = require("fs");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync("C:/Users/frank/WorkBuddy/workbuddy/english-learning/pwa/index.html", "utf8");

const TODAY = new Date();
const fmt = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today = fmt(TODAY);
const past = fmt(new Date(TODAY.getTime()-86400000));
const future = fmt(new Date(TODAY.getTime()+90*86400000));

const oldState = {
  startDate: "2026-08-01", lang: "zh", activePack: "general",
  learnedWords: [
    {word:"book", date:"2026-08-01", pack:"general"},
    {word:"book", date:"2026-08-02", pack:"freq1k"},
    {word:"river", date:"2026-08-02", pack:"freq2k"}
  ],
  readingsDone: [], bookmarks: [], notes: "",
  flashcards: {
    "general::book":  {ease:2.5, interval:6, reps:3, due:past},
    "freq1k::book":   {ease:2.2, interval:4, reps:2, due:future},
    "freq2k::river":  {ease:2.5, interval:0, reps:0, due:today},
    "freq1k::future": {ease:2.5, interval:30, reps:4, due:future}
  },
  streak: {count:1, last:null}, plan: null,
  reminder: {enabled:false, time:"20:00"}, activity: {}, quizResults: [],
  dailyCount: 2, speechRate: 0.85
};

let fail = 0;
const ok = (cond, msg) => { console.log((cond ? "  ✓ " : "  ✗ ") + msg); if(!cond) fail++; };

const dom = new JSDOM(html, {
  url: "https://localhost/app/index.html",
  runScripts: "dangerously",
  pretendToBeVisual: true,
  beforeParse(window){
    window.localStorage.setItem("englishDaily_v1", JSON.stringify(oldState));
    if(!window.speechSynthesis){
      window.speechSynthesis = { getVoices: () => [], speak(){}, cancel(){} };
    }
  }
});

const w = dom.window;
const ev = code => w.eval(code);

setTimeout(() => {
  try{
    console.log("=== 1. migration to global keys ===");
    const keys = ev("JSON.stringify(Object.keys(state.flashcards).sort())");
    ok(JSON.parse(keys).join(",") === "book,future,river", "keys are global words: " + keys);
    const book = JSON.parse(ev("JSON.stringify(state.flashcards['book'])"));
    ok(book.ease === 2.2 && book.interval === 4 && book.reps === 2 && book.due === past,
       "merged book card conservative (ease 2.2, interval 4, reps 2, soonest due): " + JSON.stringify(book));
    ok(Array.isArray(book.packs) && book.packs.join("+") === "general+freq1k", "packs union: " + book.packs.join("+"));
    ok(Array.isArray(JSON.parse(ev("JSON.stringify(state.flashcards['river'].packs)"))) , "river card has packs tag");

    console.log("=== 2. migration idempotent ===");
    ev("state = migrateState(state);");
    const book2 = JSON.parse(ev("JSON.stringify(state.flashcards['book'])"));
    ok(book2.ease === 2.2 && book2.due === past && book2.packs.join("+") === "general+freq1k",
       "second migrate is a no-op");

    console.log("=== 3. due queues ===");
    const dg = ev("dueCardsGlobal().length");
    ok(dg === 2, "dueCardsGlobal = 2 (book due past + river due today; future not): " + dg);
    const riverDue = ev("dueCardsGlobal().indexOf('river')>=0");
    ok(riverDue, "river (learned in freq2k) appears in global due queue");

    console.log("=== 4. cross-pack isLearned ===");
    ok(ev("isLearned('river')") === true, "river learned in freq2k counts as learned (global)");
    ok(ev("isLearned('zebra-zzz-none')") === false, "unknown word not learned");

    console.log("=== 5. captureLearnedInPack ===");
    ev("state.learnedWords.push({word: WORDS[0].word, date:'', pack:'otherPack'}); captureLearnedInPack();");
    const w0 = ev("WORDS[0].word.toLowerCase()");
    const cap = JSON.parse(ev("JSON.stringify(state.flashcards['" + w0 + "'])"));
    ok(!!cap && cap.due === today && cap.packs.indexOf("general") >= 0,
       "already-learned word of active pack got a card with due=today: " + JSON.stringify(cap));

    console.log("=== 6. learnWord reuses schedule ===");
    const w1 = ev("WORDS[1].word");
    ev("learnWord('" + w1 + "')");
    const c1 = JSON.parse(ev("JSON.stringify(state.flashcards['" + w1.toLowerCase() + "'])"));
    ok(c1.packs.indexOf("general") >= 0, "learnWord created card with pack provenance");
    // simulate switching pack: same word learned again elsewhere
    ev("state.activePack = 'otherPack'; learnWord('" + w1 + "');");
    const c2 = JSON.parse(ev("JSON.stringify(state.flashcards['" + w1.toLowerCase() + "'])"));
    ok(c2.packs.join("+").indexOf("otherPack") >= 0 && c2.reps === c1.reps && c2.due === c1.due,
       "re-learning in another pack keeps schedule, adds provenance: " + JSON.stringify(c2));
    ev("state.activePack = 'general';");

    console.log("=== 7. rateCard Easy multiplier x2.2 ===");
    ev("state.flashcards['" + w1.toLowerCase() + "'].interval = 10; state.flashcards['" + w1.toLowerCase() + "'].reps = 5;");
    ev("rateCard('" + w1 + "', 5);");
    const c3 = JSON.parse(ev("JSON.stringify(state.flashcards['" + w1.toLowerCase() + "'])"));
    ok(c3.interval === 22, "Easy on interval 10 -> 22 (x2.2): " + c3.interval);

    console.log("=== 8. badge + globalflash mode ===");
    ev("renderMe();");
    const badge = w.document.getElementById("reviewBadge");
    ok(badge && badge.style.display !== "none" && parseInt(badge.textContent) >= 2,
       "nav badge shows global due count >= 2: " + (badge && badge.textContent));
    ev("reviewMode='globalflash'; globalQueue=[]; renderReview();");
    const ra = w.document.getElementById("reviewArea").innerHTML;
    ok(/跨包待复习|due across all packs/.test(ra), "globalflash renders queue: " + ra.slice(0, 80).replace(/\n/g," "));
    // rating in global mode advances the global queue
    const qBefore = ev("globalQueue.length");
    const firstWord = ev("globalQueue[0]");
    ev("flashFlipped = true; rateFlash('" + firstWord + "', 3);");
    ok(ev("globalQueue.length") === qBefore - 1, "rateFlash advances global queue");

    console.log("=== 9. free mode untouched ===");
    ev("reviewMode='allflash'; allFlashQueue=[]; renderReview();");
    ok(/自由复习|free review|全部单词/i.test(w.document.getElementById("reviewArea").innerHTML), "allflash still renders");

    console.log(fail === 0 ? "\nALL PASS" : "\nFAILURES: " + fail);
    process.exit(fail === 0 ? 0 : 1);
  }catch(e){
    console.error("TEST ERROR:", e);
    process.exit(1);
  }
}, 800);
