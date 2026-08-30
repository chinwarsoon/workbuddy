const { JSDOM } = require("jsdom");
const fs = require("fs");
(async () => {
  const html = fs.readFileSync("english-learning-tool.html","utf-8");
  // controllable speech stub
  let spoken=[];
  const dom = new JSDOM(html, {
    runScripts:"dangerously", resources:"usable", pretendToBeVisual:true,
    url:"file://"+process.cwd()+"/",
    beforeParse(w){
      const s={}; w.localStorage={getItem:k=>s[k]||null,setItem:(k,v)=>s[k]=v,removeItem:k=>delete s[k]};
      w.SpeechSynthesisUtterance = class { constructor(t){ this.text=t; } };
      w.speechSynthesis = {
        _u:null,
        cancel(){ /* noop */ },
        speak(u){ spoken.push(u.text); u._onend=u.onend; setTimeout(()=>{ if(u.onend) u.onend(); },0); }
      };
      // stub audio play
      w.HTMLMediaElement.prototype.play = function(){ this._played=true; return Promise.resolve(); };
      w.HTMLMediaElement.prototype.pause = function(){ this._played=false; };
    }
  });
  await new Promise(r=>setTimeout(r,500));
  const w = dom.window;
  let pass=0, fail=0;
  const ok=(c,m)=>{ if(c){pass++;} else {fail++; console.log("FAIL:",m);} };

  // 1) enter All Words mode
  w.eval('reviewMode="allflash"; allFlashQueue=shuffle(WORDS.map(x=>x.word)); flashFlipped=false; renderReview();');
  const area = w.document.getElementById("reviewArea");
  ok(!!w.document.getElementById("listenToggle"), "listen card rendered (listenToggle button present)");
  ok(!!w.document.getElementById("listenProgress"), "listen progress span present");
  ok(!!w.document.querySelector(".flash"), "flip card still rendered above listen card");

  // 2) start listening -> should speak word then example, advance idx
  spoken=[];
  w.listenStart();
  ok(w.eval("listenOn")===true, "listenOn true after start");
  // silent wav keepalive audio should be playing
  const keep = w.document.getElementById("listenKeep");
  ok(keep && keep._played===true && /data:audio\/wav/.test(keep.getAttribute("src")||""), "screen-off keepalive audio is playing (silent wav)");
  await new Promise(r=>setTimeout(r,60)); // let chain run a few ticks
  ok(spoken.length>=2, "spoke at least word+sentence ("+spoken.length+" utterances)");
  ok(w.eval("listenIdx")>=1, "listenIdx advanced after word+sentence ("+w.eval("listenIdx")+")");

  // 3) stop halts further speech
  const before = spoken.length;
  w.listenStop();
  ok(w.eval("listenOn")===false, "listenOn false after stop");
  ok(keep._played===false, "keepalive audio paused after stop");
  await new Promise(r=>setTimeout(r,40));
  ok(spoken.length===before, "no new utterances after stop");

  // 4) switchTab stops listening
  w.listenStart();
  ok(w.eval("listenOn")===true, "listenOn true again");
  w.switchTab("plan");
  ok(w.eval("listenOn")===false, "switchTab stopped listening");

  // 5) reviewmode switch stops listening
  w.eval('reviewMode="flash"; renderReview();');
  w.listenStart();
  w.eval('reviewMode="allflash"; document.querySelectorAll("#reviewSeg button").forEach(b=>b.classList.toggle("active", b.dataset.mode==="allflash")); allFlashQueue=shuffle(WORDS.map(x=>x.word)); renderReview();');
  ok(w.eval("listenOn")===false, "changing review mode stopped listening");

  // 6) tap speak button stops listening (so card pronunciation wins)
  w.listenStart();
  const spBtn = w.document.querySelector('#reviewArea [data-act="speak"]') || w.document.querySelector('[data-act="speak"]');
  if(spBtn){ spBtn.click(); }
  ok(w.eval("listenOn")===false, "tapping a 🔊 speak button stops the listener");

  console.log("\nRESULT: "+pass+" passed, "+fail+" failed");
  process.exit(fail?1:0);
})().catch(e=>{ console.error("ERR", e && e.stack || e); process.exit(2); });
