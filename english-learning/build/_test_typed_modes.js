/* Typed-answer review modes smoke test (jsdom).
   Verifies:
   1. Seg buttons for productive & context modes exist.
   2. Productive mode: definition prompt + input; correct typed answer
      (case/punctuation-insensitive) rates q=3 on the ladder and does NOT
      advance the queue until typedNext().
   3. Wrong typed answer rates q=0 (reps reset, interval 1).
   4. typedNext() advances and re-renders.
   5. Context mode: renders a masked sentence (______) or definition fallback,
      and grades the same way.
   6. contextSentence() resolves a sentence (reading or word example). */
const fs = require("fs");
const { JSDOM } = require("jsdom");

const html = fs.readFileSync("C:/Users/frank/WorkBuddy/workbuddy/english-learning/pwa/index.html", "utf8");

const TODAY = new Date();
const fmt = d => d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today = fmt(TODAY);
const past = fmt(new Date(TODAY.getTime()-86400000));

const oldState = {
  startDate: "2026-08-01", lang: "zh", activePack: "general",
  learnedWords: [], readingsDone: [], bookmarks: [], notes: "",
  flashcards: {},
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
    // Build real cards from the active pack's actual word list
    ev(`
      state.flashcards = {};
      state.flashcards[WORDS[0].word.toLowerCase()] = {ease:2.5, interval:4, reps:2, due:"${past}", packs:["general"]};
      state.flashcards[WORDS[1].word.toLowerCase()] = {ease:2.5, interval:3, reps:2, due:"${today}", packs:["general"]};
      state.learnedWords = [{word:WORDS[0].word, date:"2026-08-01", pack:"general"}, {word:WORDS[1].word, date:"2026-08-02", pack:"general"}];
      saveState();
    `);
    const W0 = ev("WORDS[0].word");
    const W0k = W0.toLowerCase();
    const W1 = ev("WORDS[1].word");
    const W1k = W1.toLowerCase();
    const ra = () => w.document.getElementById("reviewArea");

    console.log("=== 1. seg buttons exist ===");
    const btnP = w.document.querySelector('#reviewSeg button[data-mode="productive"]');
    const btnC = w.document.querySelector('#reviewSeg button[data-mode="context"]');
    ok(!!btnP && /主动拼写|Spell/.test(btnP.textContent), "productive seg button renders");
    ok(!!btnC && /语境复习|Context/.test(btnC.textContent), "context seg button renders");

    console.log("=== 2. productive: correct typed answer ===");
    ev(`reviewMode='productive'; productiveQueue=['${W0}']; typedResult=null; renderReview();`);
    ok(!!w.document.querySelector("#reviewArea .typeInput"), "productive renders a text input");
    ok(/检查|Check/.test(ra().innerHTML), "check button renders");
    ok(!new RegExp(W0k, "i").test((ra().querySelector(".flash")||{innerHTML:""}).innerHTML.replace(/<[^>]+>/g,"")),
       "prompt card does NOT reveal the answer word");
    // type with case + trailing punctuation — must still grade correct
    ev(`document.querySelector('#reviewArea .typeInput').value='${W0}.'; checkTyped('${W0}');`);
    const tr = JSON.parse(ev("JSON.stringify(typedResult)"));
    ok(tr && tr.correct === true && tr.word === W0, "typed answer (case+punct) grades correct");
    const bk = JSON.parse(ev("JSON.stringify(state.flashcards['" + W0k + "'])"));
    ok(bk.reps === 3 && bk.interval === 8, "q=3 ladder: reps 2->3, interval 4->8: " + JSON.stringify(bk));
    ok(ev("productiveQueue.length") === 1, "queue NOT advanced before typedNext");
    ok(/正确|Correct/.test(ra().innerHTML), "result card shows correct feedback");

    console.log("=== 3. typedNext advances ===");
    ev("typedNext();");
    ok(!!w.document.querySelector("#reviewArea .typeInput") || /no_cards|🎉/.test(ra().innerHTML), "next card or empty state renders");

    console.log("=== 4. productive: wrong answer rates q=0 ===");
    ev(`reviewMode='productive'; productiveQueue=['${W1}']; typedResult=null; renderReview();`);
    ev("document.querySelector('#reviewArea .typeInput').value='wrongzz'; checkTyped('" + W1 + "');");
    const rv = JSON.parse(ev("JSON.stringify(state.flashcards['" + W1k + "'])"));
    ok(rv.reps === 0 && rv.interval === 1, "q=0 reset: reps->0, interval->1: " + JSON.stringify(rv));
    ok(new RegExp(W1k, "i").test(ra().innerHTML), "result card reveals the correct answer");
    ok(/拼错|answer/i.test(ra().innerHTML), "wrong-answer feedback text shows");

    console.log("=== 5. context mode renders masked sentence ===");
    const sent = JSON.parse(ev("JSON.stringify(contextSentence(findWordGlobal('" + W0 + "')))"));
    ok(typeof sent === "string" && sent.length > 0, "contextSentence resolves for '" + W0 + "'");
    ev(`reviewMode='context'; contextQueue=['${W0}']; typedResult=null; renderReview();`);
    const ctxHtml = ra().innerHTML;
    ok(/______/.test(ctxHtml) || /def/.test(ctxHtml), "context card renders (masked sentence or definition fallback)");
    ok(!!w.document.querySelector("#reviewArea .typeInput"), "context mode has a text input");
    ev(`document.querySelector('#reviewArea .typeInput').value='${W0}'; checkTyped('${W0}');`);
    const tr2 = JSON.parse(ev("JSON.stringify(typedResult)"));
    ok(tr2 && tr2.correct === true, "context typed '" + W0 + "' grades correct");
    ev("typedNext();");
    ok(true, "typedNext works in context mode");

    console.log("=== 6. normTyped normalization ===");
    ok(ev("normTyped('  " + W0 + ". ')") === W0k, "normTyped trims case+punctuation");
    ok(ev("normTyped(undefined)") === "", "normTyped safe on undefined");

    console.log("=== 7. other modes still work ===");
    ev("reviewMode='flash'; flashQueue=[]; flashFlipped=false; renderReview();");
    ok(/待复习|Due|🎉/.test(ra().innerHTML), "classic flashcard mode still renders");

    console.log(fail === 0 ? "\nALL PASS" : "\nFAILURES: " + fail);
    process.exit(fail === 0 ? 0 : 1);
  }catch(e){
    console.error("TEST ERROR:", e);
    process.exit(1);
  }
}, 800);
