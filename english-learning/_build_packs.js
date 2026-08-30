/* Build freq-1k.json and freq-2k.json from a real frequency list.
   Verifies every blue <b> word belongs to the correct band, then writes packs. */
const fs = require("fs");
const path = require("path");
const DIR = "C:/Users/frank/WorkBuddy/workbuddy/english-learning";
const LIST = fs.readFileSync(path.join(DIR, "_g10k.txt"), "utf8")
  .split(/\r?\n/).map(s => s.trim().toLowerCase()).filter(Boolean);
const rank = w => { const i = LIST.indexOf(w.toLowerCase()); return i < 0 ? null : i + 1; };

function emptyWord(w){ return { word:w, ipa:"", pos:"", def:"", defEn:"", ex:"", exzh:"", exEn:"", emoji:"📘" }; }

/* ---- vocab helper: word -> {ipa,pos,def,defEn,ex,exzh,exEn,emoji} ---- */
function V(ipa,pos,def,defEn,ex,exzh,exEn,emoji){ return {ipa,pos,def,defEn,ex,exzh,exEn,emoji:emoji||"📘"}; }

/* ================= PHASE 1 (top 1000) ================= */
const R1 = {
  title:"在家的早晨", titleEn:"Morning at Home", level:"A1",
  text:"Every <b>day</b> I <b>open</b> the window of my <b>home</b>. My <b>family</b> has <b>food</b> and <b>water</b>. We <b>feel</b> <b>good</b> and <b>talk</b>. I <b>love</b> my home.",
  vocab:{
    day:V("/deɪ/","n.","一天","a period of 24 hours","We meet every day.","我们每天见面。","We meet each day.","📅"),
    open:V("/ˈoʊpən/","v.","打开","move to let light/air in","I open the window.","我打开窗户。","I open the window.","🪟"),
    home:V("/hoʊm/","n.","家","the place you live","I love my home.","我爱我的家。","I love my home.","🏠"),
    family:V("/ˈfæməli/","n.","家庭","people you live with","My family is kind.","我的家人很和善。","My family is kind.","👨‍👩‍👧"),
    food:V("/fuːd/","n.","食物","things you eat","We need food.","我们需要食物。","We need food.","🍎"),
    water:V("/ˈwɔːtər/","n.","水","clear liquid to drink","I drink water.","我喝水。","I drink water.","💧"),
    feel:V("/fiːl/","v.","感觉","sense in the mind","I feel happy.","我感到开心。","I feel happy.","💗"),
    good:V("/ɡʊd/","adj.","好的","of high quality","This is good.","这很好。","This is good.","👍"),
    talk:V("/tɔːk/","v.","交谈","speak with someone","We talk a lot.","我们聊很多。","We talk a lot.","💬"),
    love:V("/lʌv/","v.","爱","like very much","I love my home.","我爱我的家。","I love my home.","❤️")
  },
  questions:[
    {q:"What does the writer open every day?", options:["The door","The window","The book"], a:1},
    {q:"How does the writer feel about home?", options:["Does not like it","Loves it","Never goes home"], a:1}
  ]
};
const R2 = {
  title:"在学校", titleEn:"At School", level:"A1",
  text:"<b>school</b> is a <b>good</b> <b>place</b>. I <b>read</b> a <b>book</b> and <b>learn</b> new <b>word</b>s. My <b>friend</b> and I <b>play</b> after <b>class</b>. We <b>talk</b> and laugh. I <b>like</b> school.",
  vocab:{
    school:V("/skuːl/","n.","学校","a place to learn","I go to school.","我去上学。","I go to school.","🏫"),
    good:V("/ɡʊd/","adj.","好的","of high quality","A good book.","一本好书。","A good book.","👍"),
    place:V("/pleɪs/","n.","地方","a location","This is a nice place.","这是个好地方。","This is a nice place.","📍"),
    read:V("/riːd/","v.","阅读","look at words and understand","I read a book.","我读一本书。","I read a book.","📖"),
    book:V("/bʊk/","n.","书","pages with writing","A small book.","一本小书。","A small book.","📚"),
    learn:V("/lɜːrn/","v.","学习","get new knowledge","I learn words.","我学单词。","I learn words.","🧠"),
    word:V("/wɜːrd/","n.","单词","a unit of language","New words.","新单词。","New words.","🔤"),
    friend:V("/frend/","n.","朋友","a person you like","She is my friend.","她是我的朋友。","She is my friend.","🤝"),
    play:V("/pleɪ/","v.","玩耍","have fun","We play outside.","我们在外面玩。","We play outside.","🎮"),
    class:V("/klæs/","n.","课","a lesson at school","After class.","下课后。","After class.","📝"),
    talk:V("/tɔːk/","v.","交谈","speak with someone","We talk.","我们交谈。","We talk.","💬"),
    laugh:V("/læf/","v.","笑","show you are happy","We laugh a lot.","我们常笑。","We laugh a lot.","😄"),
    like:V("/laɪk/","v.","喜欢","enjoy","I like school.","我喜欢学校。","I like school.","🥰")
  },
  questions:[
    {q:"What does the writer do with a book?", options:["Eats it","Reads it","Sells it"], a:1},
    {q:"What do the writer and friend do after class?", options:["Sleep","Play and talk","Cry"], a:1}
  ]
};
const R3 = {
  title:"我的小房子", titleEn:"My Small House", level:"A1",
  text:"This is my <b>house</b>. It is <b>small</b> but <b>new</b>. My <b>family</b> and I <b>love</b> it. We have <b>food</b> and <b>water</b> here. A <b>friend</b> visits us.",
  vocab:{
    house:V("/haʊs/","n.","房子","a building to live in","A small house.","一间小房子。","A small house.","🏠"),
    small:V("/smɔːl/","adj.","小的","not big","A small book.","一本小书。","A small book.","🔹"),
    new:V("/njuː/","adj.","新的","recently made","A new house.","一间新房子。","A new house.","✨"),
    family:V("/ˈfæməli/","n.","家庭","people you live with","My family.","我的家人。","My family.","👨‍👩‍👧"),
    love:V("/lʌv/","v.","爱","like very much","We love it.","我们爱它。","We love it.","❤️"),
    food:V("/fuːd/","n.","食物","things you eat","We have food.","我们有食物。","We have food.","🍎"),
    water:V("/ˈwɔːtər/","n.","水","clear liquid","We drink water.","我们喝水。","We drink water.","💧"),
    friend:V("/frend/","n.","朋友","a person you like","A friend visits.","一位朋友来访。","A friend visits.","🤝")
  },
  questions:[
    {q:"Is the house big?", options:["Yes, very big","No, it is small","It is a school"], a:1},
    {q:"Who visits them?", options:["A friend","A teacher","No one"], a:0}
  ]
};
const R4 = {
  title:"好天气", titleEn:"Nice Weather", level:"A1",
  text:"The <b>weather</b> is <b>good</b>. We have free <b>time</b>. I <b>open</b> the door and go to the <b>park</b>. The <b>sun</b> is warm. My <b>friend</b> and I <b>run</b> in the park.",
  vocab:{
    weather:V("/ˈweðər/","n.","天气","the state of the sky","Nice weather.","好天气。","Nice weather.","🌤️"),
    good:V("/ɡʊd/","adj.","好的","of high quality","Good weather.","好天气。","Good weather.","👍"),
    time:V("/taɪm/","n.","时间","hours and minutes","Free time.","空闲时间。","Free time.","⏰"),
    open:V("/ˈoʊpən/","v.","打开","move to let light/air in","I open the door.","我打开门。","I open the door.","🪟"),
    park:V("/pɑːrk/","n.","公园","green open space","A nice park.","一个漂亮的公园。","A nice park.","🌳"),
    sun:V("/sʌn/","n.","太阳","the star that gives light","The sun is warm.","太阳很暖。","The sun is warm.","☀️"),
    friend:V("/frend/","n.","朋友","a person you like","My friend.","我的朋友。","My friend.","🤝"),
    run:V("/rʌn/","v.","跑","move fast on feet","We run.","我们跑。","We run.","🏃")
  },
  questions:[
    {q:"Where do they go?", options:["The park","The school","The shop"], a:0},
    {q:"What is warm?", options:["The door","The sun","The book"], a:1}
  ]
};
const R5 = {
  title:"一本好书", titleEn:"A Good Book", level:"A1",
  text:"I <b>read</b> a <b>book</b> every <b>day</b>. The <b>story</b> is <b>small</b> but <b>good</b>. I <b>see</b> new <b>word</b>s and <b>learn</b> them. A <b>child</b> can <b>read</b> it too.",
  vocab:{
    read:V("/riːd/","v.","阅读","look at words and understand","I read daily.","我每天阅读。","I read daily.","📖"),
    book:V("/bʊk/","n.","书","pages with writing","A good book.","一本好书。","A good book.","📚"),
    day:V("/deɪ/","n.","一天","a period of 24 hours","Every day.","每一天。","Every day.","📅"),
    story:V("/ˈstɔːri/","n.","故事","told events","A small story.","一个小故事。","A small story.","📜"),
    small:V("/smɔːl/","adj.","小的","not big","A small story.","一个小故事。","A small story.","🔹"),
    good:V("/ɡʊd/","adj.","好的","of high quality","A good book.","一本好书。","A good book.","👍"),
    see:V("/siː/","v.","看见","notice with eyes","I see new words.","我看见新单词。","I see new words.","👀"),
    word:V("/wɜːrd/","n.","单词","a unit of language","New words.","新单词。","New words.","🔤"),
    learn:V("/lɜːrn/","v.","学习","get new knowledge","I learn them.","我学习它们。","I learn them.","🧠"),
    child:V("/tʃaɪld/","n.","孩子","a young person","A child reads.","一个孩子在读书。","A child reads.","🧒")
  },
  questions:[
    {q:"How often does the writer read?", options:["Every day","Never","Once a year"], a:0},
    {q:"Who else can read the book?", options:["A child","A dog","No one"], a:0}
  ]
};
const R6 = {
  title:"我的朋友", titleEn:"My Friend", level:"A1",
  text:"My <b>friend</b> likes to <b>help</b> me. We <b>talk</b> and <b>give</b> gifts. I <b>love</b> my friend. We <b>meet</b> at <b>school</b> and <b>play</b>. <b>time</b> with friends is <b>good</b>.",
  vocab:{
    friend:V("/frend/","n.","朋友","a person you like","My friend.","我的朋友。","My friend.","🤝"),
    help:V("/help/","v.","帮助","make a task easier","He helps me.","他帮我。","He helps me.","🤲"),
    talk:V("/tɔːk/","v.","交谈","speak with someone","We talk.","我们交谈。","We talk.","💬"),
    give:V("/ɡɪv/","v.","给","hand to someone","I give gifts.","我送礼物。","I give gifts.","🎁"),
    love:V("/lʌv/","v.","爱","like very much","I love my friend.","我爱我的朋友。","I love my friend.","❤️"),
    meet:V("/miːt/","v.","遇见","come together","We meet at school.","我们在学校见面。","We meet at school.","🤝"),
    school:V("/skuːl/","n.","学校","a place to learn","At school.","在学校。","At school.","🏫"),
    play:V("/pleɪ/","v.","玩耍","have fun","We play.","我们玩耍。","We play.","🎮"),
    time:V("/taɪm/","n.","时间","hours and minutes","Good time.","美好时光。","Good time.","⏰"),
    good:V("/ɡʊd/","adj.","好的","of high quality","Time is good.","时光美好。","Time is good.","👍")
  },
  questions:[
    {q:"What does the friend like to do?", options:["Help","Sleep","Run away"], a:0},
    {q:"Where do they meet?", options:["At school","At a shop","On a bus"], a:0}
  ]
};

/* ================= PHASE 2 (ranks 1001-3000) ================= */
const P1 = {
  title:"去村庄的旅程", titleEn:"A Trip to the Village", level:"A2",
  text:"We take a <b>trip</b> to a <b>village</b>. The <b>distance</b> is long, but the weather is fine. We <b>walk</b> and <b>stop</b> to <b>rest</b>. A man shows us a <b>forest</b>. It is a <b>safe</b> place.",
  vocab:{
    trip:V("/trɪp/","n.","旅行","a journey","A long trip.","一次长途旅行。","A long trip.","🧳"),
    village:V("/ˈvɪlɪdʒ/","n.","村庄","a small town","A quiet village.","一个安静的村庄。","A quiet village.","🏡"),
    distance:V("/ˈdɪstəns/","n.","距离","space between two points","A long distance.","很远的距离。","A long distance.","📏"),
    walk:V("/wɔːk/","v.","步行","move on foot","We walk slowly.","我们慢慢走。","We walk slowly.","🚶"),
    stop:V("/stɑːp/","v.","停下","no longer move","We stop to rest.","我们停下来休息。","We stop to rest.","⏹️"),
    rest:V("/rest/","v.","休息","relax","We rest here.","我们在此休息。","We rest here.","😌"),
    forest:V("/ˈfɔːrɪst/","n.","森林","land with many trees","A green forest.","一片绿森林。","A green forest.","🌲"),
    safe:V("/seɪf/","adj.","安全的","not in danger","A safe place.","一个安全的地方。","A safe place.","🛡️")
  },
  questions:[
    {q:"Where do they take a trip?", options:["To a village","To a city school","To a shop"], a:0},
    {q:"Why do they stop?", options:["To buy food","To rest","To sleep all day"], a:1}
  ]
};
const P2 = {
  title:"药与健康", titleEn:"Medicine and Health", level:"A2",
  text:"My <b>father</b> visits a <b>hospital</b>. The doctor gives him <b>medicine</b>. He is a <b>patient</b> now. He must <b>rest</b> and <b>drink</b> water. After some days he is well again.",
  vocab:{
    father:V("/ˈfɑːðər/","n.","父亲","a male parent","My father.","我的父亲。","My father.","👨"),
    hospital:V("/ˈhɑːspɪtl/","n.","医院","a place to treat illness","At the hospital.","在医院。","At the hospital.","🏥"),
    medicine:V("/ˈmedɪsn/","n.","药","something to treat illness","Take medicine.","吃药。","Take medicine.","💊"),
    patient:V("/ˈpeɪʃnt/","n.","病人","a person under care","He is a patient.","他是个病人。","He is a patient.","🛌"),
    rest:V("/rest/","v.","休息","relax","He must rest.","他必须休息。","He must rest.","😌"),
    drink:V("/drɪŋk/","v.","喝","take liquid in","Drink water.","喝水。","Drink water.","🥤")
  },
  questions:[
    {q:"Who visits the hospital?", options:["The teacher","The father","The child"], a:1},
    {q:"What does the doctor give him?", options:["Water only","Medicine","A book"], a:1}
  ]
};
const P3 = {
  title:"我们的蓝色星球", titleEn:"Our Blue Planet", level:"A2",
  text:"The <b>earth</b> is our <b>planet</b>. It has <b>ocean</b>s and <b>forest</b>s. We must <b>protect</b> nature. Every <b>season</b> is a little different. The weather changes.",
  vocab:{
    earth:V("/ɜːrθ/","n.","地球","our world","The blue earth.","蓝色的地球。","The blue earth.","🌍"),
    planet:V("/ˈplænɪt/","n.","行星","a world in space","Our planet.","我们的行星。","Our planet.","🪐"),
    ocean:V("/ˈoʊʃn/","n.","海洋","a large sea","A big ocean.","一片大海洋。","A big ocean.","🌊"),
    forest:V("/ˈfɔːrɪst/","n.","森林","land with many trees","Green forests.","绿色森林。","Green forests.","🌲"),
    protect:V("/prəˈtekt/","v.","保护","keep safe","Protect nature.","保护自然。","Protect nature.","🛡️"),
    season:V("/ˈsiːzn/","n.","季节","spring/summer/autumn/winter","Every season.","每个季节。","Every season.","🍂")
  },
  questions:[
    {q:"What does our planet have?", options:["Only deserts","Oceans and forests","No water"], a:1},
    {q:"What should we do for nature?", options:["Protect it","Cut all trees","Ignore it"], a:0}
  ]
};
const P4 = {
  title:"艰难的选择", titleEn:"A Difficult Choice", level:"A2",
  text:"I have a <b>difficult</b> <b>choice</b>. A company offers me a <b>career</b>. I must <b>consider</b> it. It is a good <b>chance</b> to <b>develop</b> myself. I think about it every day.",
  vocab:{
    difficult:V("/ˈdɪfɪkəlt/","adj.","困难的","not easy","A difficult task.","一项困难的任务。","A difficult task.","😣"),
    choice:V("/tʃɔɪs/","n.","选择","picking one of many","A hard choice.","艰难的选择。","A hard choice.","🔀"),
    career:V("/kəˈrɪr/","n.","职业","a long job path","A good career.","一份好职业。","A good career.","💼"),
    consider:V("/kənˈsɪdər/","v.","考虑","think about","I consider it.","我考虑它。","I consider it.","🤔"),
    chance:V("/tʃæns/","n.","机会","a possibility","A good chance.","好机会。","A good chance.","🍀"),
    develop:V("/dɪˈveləp/","v.","发展","grow better","Develop myself.","提升自己。","Develop myself.","📈")
  },
  questions:[
    {q:"What is difficult for the writer?", options:["A choice","A book","The weather"], a:0},
    {q:"What does the chance help with?", options:["Develop himself","Sleep more","Forget work"], a:0}
  ]
};
const P5 = {
  title:"学习一门语言", titleEn:"Learning a Language", level:"A2",
  text:"I <b>listen</b> to <b>song</b>s and read books every day. My teacher helps me <b>improve</b>. I want to <b>speak</b> well. I also want to <b>understand</b> films in that language.",
  vocab:{
    listen:V("/ˈlɪsn/","v.","听","pay attention by ear","I listen to songs.","我听歌。","I listen to songs.","👂"),
    song:V("/sɔːŋ/","n.","歌曲","music with words","A happy song.","一首欢快的歌。","A happy song.","🎵"),
    improve:V("/ɪmˈpruːv/","v.","提高","get better","Help me improve.","帮我提高。","Help me improve.","📈"),
    speak:V("/spiːk/","v.","说","talk in a language","I want to speak.","我想说。","I want to speak.","🗣️"),
    understand:V("/ˌʌndərˈstænd/","v.","理解","know the meaning","Understand films.","理解电影。","Understand films.","💡")
  },
  questions:[
    {q:"What does the writer listen to?", options:["Songs","The radio news only","Nothing"], a:0},
    {q:"What does the writer want to do?", options:["Speak and understand","Forget the language","Sleep"], a:0}
  ]
};
const P6 = {
  title:"城市与自然", titleEn:"City and Nature", level:"A2",
  text:"The <b>population</b> of big cities is large. People need green space and <b>peace</b>. Parks give <b>comfort</b> and fresh air. The <b>situation</b> is better when we <b>protect</b> nature.",
  vocab:{
    population:V("/ˌpɑːpjuˈleɪʃn/","n.","人口","number of people","A large population.","大量人口。","A large population.","👥"),
    peace:V("/piːs/","n.","宁静","calm and quiet","We need peace.","我们需要宁静。","We need peace.","🕊️"),
    comfort:V("/ˈkʌmfərt/","n.","舒适","a feeling of ease","Parks give comfort.","公园带来舒适。","Parks give comfort.","🛋️"),
    situation:V("/ˌsɪtʃuˈeɪʃn/","n.","情况","how things are","The situation is better.","情况好转。","The situation is better.","🧭"),
    protect:V("/prəˈtekt/","v.","保护","keep safe","Protect nature.","保护自然。","Protect nature.","🛡️")
  },
  questions:[
    {q:"What is large in big cities?", options:["The population","The forests","The peace"], a:0},
    {q:"What helps the situation?", options:["Protecting nature","Cutting parks","Ignoring air"], a:0}
  ]
};

const READINGS_1 = [R1,R2,R3,R4,R5,R6];
const READINGS_2 = [P1,P2,P3,P4,P5,P6];

/* ----- verify bands ----- */
let problems = [];
function checkBand(words, lo, hi, label){
  words.forEach(w=>{
    const r = rank(w);
    if(r===null){ problems.push(label+": word not in list -> "+w); }
    else if(r<lo || r>=hi){ problems.push(label+": "+w+" rank "+r+" outside ["+lo+","+hi+")"); }
  });
}
function blueWords(r){ return (r.text.match(/<b>([^<]+)<\/b>/g)||[]).map(m=>m.replace(/<\/?b>/g,"").trim().toLowerCase()); }
READINGS_1.forEach((r,i)=>checkBand(blueWords(r),1,1001,"P1R"+(i+1)));
READINGS_2.forEach((r,i)=>checkBand(blueWords(r),1001,3001,"P2R"+(i+1)));

if(problems.length){
  console.log("BAND CHECK FAILED:\n"+problems.join("\n"));
  process.exit(1);
}
console.log("BAND CHECK PASSED: all blue words in correct bands.");

/* ----- build WORDS arrays ----- */
function buildWords(readings, lo, hi){
  const taughtOrder = [];
  const taughtMap = {};
  readings.forEach(r=>{
    blueWords(r).forEach(b=>{
      const key = b.toLowerCase();
      if(!taughtMap[key]){ taughtMap[key]=1; taughtOrder.push(key); }
    });
  });
  const words = [];
  taughtOrder.forEach(k=>{
    const v = readings.find(r=>blueWords(r).includes(k)).vocab[k];
    words.push({ word:k, ipa:v.ipa, pos:v.pos, def:v.def, defEn:v.defEn, ex:v.ex, exzh:v.exzh, exEn:v.exEn, emoji:v.emoji });
  });
  // append the rest of the band as empty-shape entries (frequency scaffold)
  for(let i=lo-1;i<hi-1;i++){
    const w = LIST[i];
    if(!taughtMap[w]) words.push(emptyWord(w));
  }
  return words;
}
function toReadingJSON(r){
  return {
    title:r.title, titleEn:r.titleEn, level:r.level, text:r.text,
    vocab: Object.keys(r.vocab).map(k=>{ const v=r.vocab[k]; return {w:k, d:v.def, dEn:v.defEn, ipa:v.ipa, pos:v.pos, emoji:v.emoji, ex:v.ex, exzh:v.exzh, exEn:v.exEn}; }),
    questions:r.questions
  };
}
const areaTasks = {
  vocab:{zh:["学习本阶段新单词","复习生词卡 5 分钟"],en:["Learn this phase's new words","Review flashcards 5 min"]},
  reading:{zh:["阅读一篇频率分级短文","做阅读理解题"],en:["Read a frequency-graded text","Do the comprehension quiz"]},
  speaking:{zh:["跟读重点词 5 分钟","用英语描述今天"],en:["Shadow-read key words 5 min","Describe today in English"]},
  listening:{zh:["听重点词与例句","看短视频跟读"],en:["Listen to key words & examples","Watch a short video & repeat"]},
  grammar:{zh:["学习一个语法点","用新语法造句"],en:["Study one grammar point","Make sentences with it"]},
  writing:{zh:["写 3 句英语日记","写一封简短英文信"],en:["Write a 3-sentence diary","Write a short English note"]}
};
const areaLabel = {
  zh:{vocab:"词汇",reading:"阅读",speaking:"口语",listening:"听力",grammar:"语法",writing:"写作"},
  en:{vocab:"Vocabulary",reading:"Reading",speaking:"Speaking",listening:"Listening",grammar:"Grammar",writing:"Writing"}
};

const pack1 = {
  id:"freq1k", name:"高频词·第1阶 (0–1000)", nameEn:"High-Frequency 1 (0–1000)",
  desc:"按真实使用频率排序的第 1 阶段词包：前 1000 词 + 6 篇 A1 分级阅读。蓝词即每日重点。",
  descEn:"Phase 1 by real usage frequency: top 1000 words + 6 A1 graded readings. Blue words are the daily focus.",
  words: buildWords(READINGS_1,1,1001),
  readings: READINGS_1.map(toReadingJSON),
  areaTasks, areaLabel
};
const pack2 = {
  id:"freq2k", name:"高频词·第2阶 (1001–3000)", nameEn:"High-Frequency 2 (1001–3000)",
  desc:"按真实使用频率排序的第 2 阶段词包：第 1001–3000 词 + 6 篇 A2 分级阅读。",
  descEn:"Phase 2 by real usage frequency: ranks 1001–3000 + 6 A2 graded readings.",
  words: buildWords(READINGS_2,1001,3001),
  readings: READINGS_2.map(toReadingJSON),
  areaTasks, areaLabel
};
fs.writeFileSync(path.join(DIR,"content","freq-1k.json"), JSON.stringify(pack1,null,1));
fs.writeFileSync(path.join(DIR,"content","freq-2k.json"), JSON.stringify(pack2,null,1));
console.log("WROTE freq-1k.json ("+pack1.words.length+" words, "+pack1.readings.length+" readings)");
console.log("WROTE freq-2k.json ("+pack2.words.length+" words, "+pack2.readings.length+" readings)");
