const fs=require('fs');
const vm=require('vm');
const path=require('path');
const ROOT='C:/Users/frank/WorkBuddy/workbuddy/english-learning';

const html=fs.readFileSync(path.join(ROOT,'pwa/index.html'),'utf8');
const m=html.match(/<script>([\s\S]*)<\/script>/);
if(!m){ console.error('no script'); process.exit(1); }
let src=m[1];

// robust self-referential proxy for DOM
function makeProxy(){
  const fn=function(){ return makeProxy(); };
  return new Proxy(fn,{
    get(t,p){
      if(p==='length') return 0;
      if(p==='innerHTML'||p==='textContent'||p==='value') return '';
      if(p==='classList') return {add(){},remove(){},toggle(){},contains(){return false;}};
      if(p==='style') return {};
      if(p==='dataset') return {};
      if(p==='files') return [];
      if(p==='then') return undefined; // not a thenable
      return makeProxy();
    },
    set(){ return true; },
    apply(){ return makeProxy(); },
    construct(){ return makeProxy(); }
  });
}
const elProxy=makeProxy();

// fetch stub -> read local content files
function fetchStub(url){
  try{
    let u=String(url).replace(/^\.\//,'').replace(/^\//,'');
    if(u.startsWith('content/')){
      const fp=path.join(ROOT,'pwa',u);
      const txt=fs.readFileSync(fp,'utf8');
      return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve(JSON.parse(txt)),text:()=>Promise.resolve(txt)});
    }
    if(u==='manifest.json'){
      const fp=path.join(ROOT,'pwa','content/manifest.json');
      const txt=fs.readFileSync(fp,'utf8');
      return Promise.resolve({ok:true,status:200,json:()=>Promise.resolve(JSON.parse(txt)),text:()=>Promise.resolve(txt)});
    }
    return Promise.resolve({ok:false,status:404,json:()=>Promise.resolve({}),text:()=>Promise.resolve('')});
  }catch(e){ return Promise.resolve({ok:false,status:404,json:()=>Promise.resolve({}),text:()=>Promise.resolve('')}); }
}

const store={};
const ctx={
  console,
  setTimeout:(f)=>0, clearTimeout(){}, setInterval:()=>0, clearInterval(){},
  fetch:fetchStub,
  requestAnimationFrame:(f)=>0,
  localStorage:{ getItem:k=>store[k]||null, setItem:(k,v)=>{store[k]=String(v);}, removeItem:k=>{delete store[k];} },
  document:new Proxy({},{ get(t,p){
      if(p==='getElementById'||p==='querySelector') return ()=>elProxy;
      if(p==='querySelectorAll') return ()=>[];
      if(p==='createElement') return ()=>elProxy;
      if(p==='getElementById') return ()=>elProxy;
      if(p==='addEventListener') return ()=>{};
      if(p==='body') return elProxy;
      if(p==='documentElement') return elProxy;
      return elProxy;
  }}),
  window:new Proxy({},{ get(t,p){ if(p==='speechSynthesis') return {speak(){},cancel(){}}; if(p==='addEventListener') return ()=>{}; return undefined; }}),
  navigator:new Proxy({},{get(){return undefined;}}),
  speechSynthesis:{speak(){},cancel(){}},
  location:{href:'http://localhost/',protocol:'http:',hostname:'localhost',pathname:'/'},
  JSON, Math, Date, Object, Array, String, Number, Boolean, RegExp, Promise, Error, parseInt, parseFloat, isNaN, encodeURIComponent, decodeURIComponent,
};
ctx.globalThis=ctx; ctx.window=ctx.window||ctx;
// expose internals
src += `
;globalThis.__api={findWordGlobal,flashCardHTML,wordDetailHTML,explainWord,loadContent,
  get PACKS(){return PACKS;}, get WORDS(){return WORDS;}, get state(){return state;},
  setLang(l){state.lang=l;}
};`;
vm.createContext(ctx);
vm.runInContext(src, ctx, {filename:'app.js'});

(async()=>{
  await ctx.__api.loadContent();
  const api=ctx.__api;
  console.log('PACKS loaded:', Object.keys(api.PACKS).length, 'WORDS:', api.WORDS.length);
  for(const wd of ['chunk','aluminum','fin']){
    const w=api.findWordGlobal(wd);
    console.log('\n=== '+wd+' ===');
    console.log('found:', !!w, w?('def='+JSON.stringify(w.def)+' defEn='+JSON.stringify(w.defEn)):'');
    if(w){
      api.setLang('zh');
      const zh=api.explainWord(w);
      api.setLang('en');
      const en=api.explainWord(w);
      console.log('explainWord zh:', JSON.stringify(zh));
      console.log('explainWord en:', JSON.stringify(en));
      // render flashcard back
      const html=api.wordDetailHTML(w);
      console.log('wordDetailHTML contains wd-def:', html.includes('wd-def'));
      // extract the def div content roughly
      const dm=html.match(/<div class="wd-def">([\s\S]*?)<\/div>/);
      console.log('wd-def raw:', dm?dm[1].slice(0,80):'(none)');
    }
  }
})().catch(e=>{ console.error('ERR', e); });
