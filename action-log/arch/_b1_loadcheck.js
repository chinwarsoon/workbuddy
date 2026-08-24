const fs = require('fs');
function makeProxy(){
  const target = function(){ return makeProxy(); };
  return new Proxy(target, {
    get(t, prop){
      if(prop==='style') return makeProxy();
      if(prop==='dataset') return {};
      if(prop==='classList') return { add(){}, remove(){}, toggle(){}, contains(){return false;} };
      if(prop==='children') return [];
      if(prop==='length') return 0;
      if(prop==='value'||prop==='textContent'||prop==='innerHTML') return '';
      if(prop==='offsetWidth') return 0;
      if(prop==='files') return [];
      if(prop==='querySelectorAll') return ()=>[];
      if(prop==='querySelector') return ()=>makeProxy();
      if(prop==='closest') return ()=>makeProxy();
      if(['appendChild','removeChild','insertBefore','remove','setAttribute','removeAttribute','addEventListener','removeEventListener','focus','blur','select','click','append','prepend','insertAdjacentHTML','contains'].includes(prop)) return ()=>{};
      if(['onclick','onchange','oninput','onkeydown','onload'].includes(prop)) return null;
      return makeProxy();
    },
    set(){ return true; },
    apply(){ return makeProxy(); }
  });
}
const fakeEl = makeProxy();
global.document = { getElementById:()=>fakeEl, querySelector:()=>fakeEl, querySelectorAll:()=>[], createElement:()=>fakeEl, addEventListener:()=>{}, body:fakeEl, documentElement:fakeEl, activeElement:fakeEl };
global.window = { addEventListener:()=>{}, showSaveFilePicker:undefined, location:{ href:'file:///x/index.html' } };
global.location = global.window.location;
global.setTimeout = ()=>0; global.clearTimeout = ()=>{}; global.setInterval = ()=>0; global.clearInterval = ()=>{};
global.indexedDB = { open:()=>({ onupgradeneeded:null, onsuccess:null, onerror:null }) };
global.fetch = ()=>Promise.reject(new Error('no fetch in harness'));
global.URL = class { constructor(){ this.href=''; } createObjectURL(){return '';} revokeObjectURL(){} };
global.Blob = class { constructor(){} };
global.confirm = ()=>false; global.alert = ()=>{};
global.FileReader = class { readAsText(){} };
const order = ['core.js','editor.js','report.js','io.js','render.js','settings.js','bootstrap.js'];
let code = '';
for(const f of order) code += '\n;// === '+f+' ===\n' + fs.readFileSync(f,'utf8');
try{ new Function(code)(); console.log('LOAD OK — all 7 modules evaluated, no top-level reference errors'); }
catch(e){ console.error('LOAD ERROR:', e.message); console.error(e.stack.split('\n').slice(0,6).join('\n')); process.exit(1); }
