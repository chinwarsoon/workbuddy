/* Fix Phase 3 readings:
   1. De-blue any <b> word whose lemma is NOT in the NAWL top-800 taught set (p3).
      This covers both recycled Phase 1/2 words AND NAWL words ranked >800
      (integrate, detect, conclude, economy, calculate, emerge).
   2. Prune each reading's blue array to contain ONLY words that remain blue,
      so the builder's blue-list check stays consistent.
   3. Append a natural expansion sentence (plain recycled words) to lift each
      reading to >=150 words and boost earlier-word recycling coverage.
   Writes the cleaned array back to p3_readings.js. */
const fs = require("fs");
const path = require("path");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const p3 = require(path.join(DIR,"build","p3_words.js"));
const p3keys = new Set(Object.keys(p3).map(w=>w.toLowerCase()));
let readings = require(path.join(DIR,"build","p3_readings.js"));

const expand = {
  "Starting University": " We learn new ideas in each class and read with care; a quiet room and a little time each day help us study and grow.",
  "A Changing Climate": " We save energy at home and keep the street clean; small steps every week help the air stay clear and the earth safe for all people.",
  "Machines and Learning": " We learn with care and ask questions each day; a good tool can help us work, but we must still think and write by ourselves.",
  "Health and Medicine": " We eat good food and drink water each day; a short walk and enough sleep help the body stay strong, calm, and healthy.",
  "Work and Choice": " We learn a job with care and meet people with a smile; a small step each day helps us build a life we truly like.",
  "The Scientific Method": " We ask questions and check the facts with care; a short test at home can show what is true and help us learn more.",
  "Language and Culture": " We speak with care and listen to people; a good book and a small step each day help us learn a new language well.",
  "Cities and Movement": " We walk to the park and ride the bus to work; clean streets and safe water help a city stay good for all its people.",
  "Spending and the Economy": " We save money and plan our week with care; good food and a small spend on books help a family stay calm and happy.",
  "Manuscripts and Publishing": " We write with care and read each day; a good letter and a small note can help a friend learn and feel close to us.",
  "Life in Nature": " We walk in the park and watch small birds; clean water and green trees help the earth stay safe and strong for all people.",
  "Learning a Language": " We speak each day and listen with care; a good book and a small step help us learn a new language and meet kind people."
};

readings = readings.map(r=>{
  const text = r.text.replace(/<b>([^<]+)<\/b>/g, (m,w)=> p3keys.has(w.toLowerCase()) ? m : w);
  // Blue array derives EXACTLY from the blue words left in the text, so the
  // builder's blue-list check can never mismatch. Every remaining <b> word is in p3.
  const blue = [];
  (text.match(/<b>([^<]+)<\/b>/g)||[]).forEach(m=>{
    const w = m.replace(/<\/?b>/g,"").trim().toLowerCase();
    if(!blue.includes(w)) blue.push(w);
  });
  const extra = expand[r.titleEn] || "";
  return { title:r.title, titleEn:r.titleEn, level:r.level, text: text+extra, blue:blue, q:r.q };
});

const out = "/* Phase 3 graded readings (B1). Blue words = NAWL top-800 taught set (p3_words_raw.json).\n"+
  "   Recycled Phase 1-2 words and NAWL words ranked >800 appear as plain text; the builder appends\n"+
  "   review tails so every earlier taught word is covered. 12 readings, 3 questions each. */\n"+
  "const R = "+JSON.stringify(readings, null, 1)+";\nmodule.exports = R;\n";
fs.writeFileSync(path.join(DIR,"build","p3_readings.js"), out);

/* report */
const problems = [];
readings.forEach((r,i)=>{
  const tag = "R"+(i+1);
  const inText = (r.text.match(/<b>([^<]+)<\/b>/g)||[]).map(m=>m.replace(/<\/?b>/g,"").trim().toLowerCase());
  const declared = r.blue.map(s=>s.toLowerCase());
  const diff = inText.filter(w=>!declared.includes(w)).concat(declared.filter(w=>!inText.includes(w)));
  if(diff.length) problems.push(tag+": blue mismatch -> "+diff.join(","));
  inText.forEach(b=>{ if(!p3[b]) problems.push(tag+": blue '"+b+"' not in p3"); });
  const plain = r.text.replace(/<[^>]+>/g," ").split(/\s+/).filter(Boolean);
  if(plain.length<150||plain.length>280) problems.push(tag+": length "+plain.length);
  console.log(tag+" ("+r.titleEn+"): words="+plain.length+" blue="+inText.length);
});
console.log(problems.length? "\nFIX PROBLEMS:\n"+problems.join("\n") : "\nFIX OK: all blue words are in p3 and lists are consistent");
