/* Phase 1 graded readings (A1). Blue words come from p1_words_a/b.js.
   Each reading: 90-150 words, 10-13 blue words, 3 questions
   (detail / main idea / vocabulary-in-context). */
const R = [
{
  title:"我的家", titleEn:"My Home", level:"A1",
  text:"I <b>live</b> in a small <b>house</b> with my <b>family</b>. There is a big <b>window</b> in every <b>room</b>, so the <b>light</b> is good all day. In the <b>morning</b> I open the window and <b>sit</b> at the <b>table</b>. I read a book and <b>drink</b> some water. My room is not big, but it is <b>clean</b> and warm. The door is always open, because my family comes and goes. At <b>night</b> the house is quiet and I <b>sleep</b> very well. Every weekend we clean the house together, and then we are <b>tired</b> but happy. I love this house.",
  blue:["live","house","family","window","room","light","morning","sit","table","drink","clean","night","sleep","tired"],
  q:[
    {q:"Where does the writer sit in the morning?",options:["At the table","On the bed","Outside the house"],a:0},
    {q:"What is the reading mainly about?",options:["A city with big buildings","The writer's home and life at home","A long trip by car"],a:1},
    {q:"In the text, \"light\" is something that...",options:["makes a room bright","you can eat","costs a lot of money"],a:0}
  ]
},
{
  title:"我的一天", titleEn:"My Day", level:"A1",
  text:"My <b>day</b> starts early. In the <b>morning</b> I wash my face, <b>eat</b> some <b>food</b> and <b>drink</b> a glass of <b>water</b>. Then I go to <b>work</b>. I work for eight <b>hours</b> with a short break at one. In the break I eat with my team and we talk about our plans. I get <b>home</b> at six and I make food with my family. After that I read a book or watch a movie. At <b>night</b> the city is quiet and I <b>sleep</b> for seven hours. On Sunday my day is different, because I do not work and I have more <b>time</b> for my friends.",
  blue:["day","morning","eat","food","drink","water","work","hours","home","night","sleep","time"],
  q:[
    {q:"How long does the writer work?",options:["Eight hours","Seven hours","One hour"],a:0},
    {q:"What is the best title for this reading?",options:["My working day","My new car","A map of the city"],a:0},
    {q:"In the text, a \"break\" is a time to...",options:["rest and eat","sleep for the night","drive home"],a:0}
  ]
},
{
  title:"我的家人与朋友", titleEn:"My Family and Friends", level:"A1",
  text:"Four <b>people</b> <b>live</b> in my <b>home</b>. Every <b>child</b> in my <b>family</b> goes to school, and every adult goes to work. In the evening we <b>sit</b> <b>together</b> and <b>talk</b> about the day, and my mother tells us a short story. My <b>friends</b> also come to our home on Sunday. We <b>eat</b> food, <b>drink</b> water and laugh a lot. I <b>love</b> these people, because they always <b>help</b> me when I have a problem. A home is not only a house; a home is the people inside it. I am happy every evening with them.",
  blue:["people","live","home","child","family","sit","together","talk","friends","eat","drink","love","help"],
  q:[
    {q:"When do the writer's friends come?",options:["On Sunday","Every morning","At night only"],a:0},
    {q:"What does the writer want to say at the end?",options:["A home is about the people, not the building","A house must be very big","Friends should bring money"],a:0},
    {q:"In the text, \"adult\" means...",options:["a grown-up person","a young child","a school teacher"],a:0}
  ]
},
{
  title:"在学校", titleEn:"At School", level:"A1",
  text:"My <b>school</b> is near my <b>home</b>, so I <b>walk</b> there every day. My first <b>class</b> starts at nine. The <b>teacher</b> is kind and every <b>student</b> has a <b>book</b> and some <b>paper</b>. We <b>read</b> a short <b>story</b>, and then we <b>write</b> ten new <b>words</b> in our books. After that I <b>ask</b> one <b>question</b> and the teacher answers it. I <b>learn</b> something new every day. The last class <b>ends</b> at four, and then I go home with my friends. School is not easy, but I like it. My teacher says I am a good student.",
  blue:["school","home","walk","class","teacher","student","book","paper","read","story","write","words","ask","question","learn","ends"],
  q:[
    {q:"What time does the first class start?",options:["At nine","At four","At one"],a:0},
    {q:"What is the reading mainly about?",options:["A normal day at school","Buying books in a shop","A long trip by car"],a:0},
    {q:"In the text, \"kind\" describes a person who is...",options:["friendly and good to others","very busy","very old"],a:0}
  ]
},
{
  title:"学英语", titleEn:"Learning English", level:"A1",
  text:"I <b>learn</b> ten new <b>words</b> every day. In the morning I <b>read</b> a short <b>story</b> and write the new words on <b>paper</b>. In the evening I <b>study</b> for one hour and say the words again and <b>again</b>. I also <b>watch</b> a short <b>movie</b> in English, because I want to hear the language. It is not <b>easy</b>, but it is not very <b>hard</b> either. I want to <b>speak</b> well, so I talk to myself at home. My teacher says: read every day, and you will <b>know</b> more words <b>time</b> after time.",
  blue:["learn","words","read","story","paper","study","again","watch","movie","easy","hard","speak","know","time"],
  q:[
    {q:"How many new words does the writer learn every day?",options:["Ten","Two","One hundred"],a:0},
    {q:"What is the writer's advice, in one line?",options:["Read and study every day","Only watch movies","Never write words down"],a:0},
    {q:"In the text, \"hard\" means...",options:["difficult","heavy","cold"],a:0}
  ]
},
{
  title:"食物与健康", titleEn:"Food and Health", level:"A1",
  text:"Good <b>food</b> and clean <b>water</b> keep my <b>body</b> well. I <b>eat</b> fruit and bread in the morning, and I <b>drink</b> six glasses of water a day. Before I eat, I <b>wash</b> my <b>hands</b>. My room and my kitchen are always <b>clean</b>. When I <b>sleep</b> seven hours and walk every day, I feel <b>strong</b>, not <b>tired</b>. My <b>health</b> is more important than money, because without health I cannot work, and I cannot enjoy my day with my family and friends. I do not eat a lot of bread at night.",
  blue:["food","water","body","eat","drink","wash","hands","clean","sleep","strong","tired","health"],
  q:[
    {q:"How much water does the writer drink a day?",options:["Six glasses","One glass","Ten bottles"],a:0},
    {q:"What is the main idea of the reading?",options:["Simple daily habits keep you healthy","Food in the city is expensive","Water is bad for your body"],a:0},
    {q:"In the text, \"tired\" means...",options:["needing rest","very happy","very hungry"],a:0}
  ]
},
{
  title:"我住的城市", titleEn:"My City", level:"A1",
  text:"I live in a <b>big</b> <b>city</b>. The <b>streets</b> are busy and the <b>roads</b> are full of <b>cars</b>. There is a <b>park</b> <b>near</b> my <b>home</b>, and I <b>walk</b> there every evening. Next to the park there is a small <b>shop</b> and a <b>market</b> with cheap fruit and bread. The <b>air</b> in the park is clean and the light is soft. My city is not <b>beautiful</b> in every <b>place</b>, and some streets are old, but the people are friendly and it is my home, so I <b>like</b> it here.",
  blue:["big","city","streets","roads","cars","park","near","home","walk","shop","market","air","beautiful","place","like"],
  q:[
    {q:"What is next to the park?",options:["A small shop and a market","A hospital","A train station"],a:0},
    {q:"How does the writer feel about the city?",options:["It is home and I like it","I want to leave tomorrow","It is too small for me"],a:0},
    {q:"In the text, \"busy\" streets are streets with...",options:["a lot of cars and people","no people at all","only one shop"],a:0}
  ]
},
{
  title:"去购物", titleEn:"Go Shopping", level:"A1",
  text:"On Saturday I go to a big <b>store</b> with my friend. I want to <b>buy</b> a new bag, but the <b>price</b> is high. The <b>customer</b> before me <b>pays</b> with a card, and I <b>pay</b> with <b>money</b>. Fruit in the <b>market</b> is <b>cheap</b>, so I take some apples for my family. Everything I buy today <b>costs</b> thirty dollars. I do not <b>need</b> a new bag, so I keep my old one and <b>save</b> my money for next week. I also buy a small gift for my mother. My mother says that is a good plan.",
  blue:["store","buy","price","customer","pays","pay","money","market","cheap","costs","need","save"],
  q:[
    {q:"Why does the writer not buy the new bag?",options:["The price is high","The store is closed","The bag is too small"],a:0},
    {q:"What is the reading mainly about?",options:["Shopping and being careful with money","Cooking food at home","A long car trip"],a:0},
    {q:"In the text, \"save\" money means to...",options:["keep it for later","give it to a friend","throw it away"],a:0}
  ]
},
{
  title:"天气与穿着", titleEn:"Weather and Clothes", level:"A1",
  text:"The <b>weather</b> in my city changes fast. In summer the <b>sun</b> is strong and it is very <b>hot</b>, so I <b>wear</b> a light shirt and drink a lot of <b>water</b>. In winter the air is <b>cold</b>, and I wear a coat and sit near the <b>fire</b> at home. When the weather is <b>bad</b>, I stay inside and read a book with my family. My mother always says: look at the sky before you go out, because the <b>light</b> can change in one hour. In spring the air is warm and the park is full of people.",
  blue:["weather","sun","hot","wear","water","cold","fire","bad","light"],
  q:[
    {q:"What does the writer wear in summer?",options:["A light shirt","A thick coat","A warm hat"],a:0},
    {q:"What is the main idea?",options:["Clothes change with the weather","Winter is the best season","Water is expensive"],a:0},
    {q:"In the text, \"changes fast\" means the weather...",options:["becomes different quickly","stays the same all year","is always cold"],a:0}
  ]
},
{
  title:"我的工作", titleEn:"My Job", level:"A1",
  text:"I <b>work</b> in a small <b>office</b> in the city. Our <b>company</b> makes maps, and my <b>manager</b> is a young woman. There are six <b>staff</b> in my <b>team</b>, and we <b>work</b> <b>together</b> every day. The <b>job</b> is not <b>easy</b>, and some days are very <b>busy</b>. I use a <b>computer</b> for eight hours and I talk to many customers. The <b>money</b> is not high, but I <b>like</b> the people here. After work I go home, and I do not think about the office until the next morning. Every Friday our team has a short meeting.",
  blue:["work","office","company","manager","staff","team","together","job","easy","busy","computer","money","like"],
  q:[
    {q:"How many people are in the writer's team?",options:["Six","Two","Twenty"],a:0},
    {q:"Why does the writer like the job?",options:["The people are good","The money is very high","The office is always empty"],a:0},
    {q:"In the text, \"busy\" days are days with...",options:["a lot of work","no work at all","a long holiday"],a:0}
  ]
},
{
  title:"空闲时间", titleEn:"Free Time", level:"A1",
  text:"After work I have two free hours. On Monday and Wednesday I <b>run</b> in the <b>park</b> with a <b>friend</b>. On Friday we <b>play</b> a <b>game</b> with our <b>team</b> at school. At home I <b>listen</b> to <b>music</b> or <b>watch</b> a <b>movie</b> with my family. On Sunday I take <b>photos</b> of the park in the soft <b>light</b> of the evening. Free time is <b>important</b> for me, because after it I <b>feel</b> <b>happy</b> and ready for the next working day. I also read a book in the park when the weather is good.",
  blue:["run","park","friend","play","game","team","listen","music","watch","movie","photos","light","important","feel","happy"],
  q:[
    {q:"What does the writer do on Monday and Wednesday?",options:["Run in the park","Watch a movie at home","Play a game at school"],a:0},
    {q:"Why is free time important for the writer?",options:["It makes the writer feel happy and ready","It costs a lot of money","It is the only time to sleep"],a:0},
    {q:"In the text, \"free hours\" are hours...",options:["with no work","with a lot of work","with no light"],a:0}
  ]
},
{
  title:"一次小旅行", titleEn:"A Short Trip", level:"A1",
  text:"Last month I <b>travel</b> to another <b>city</b> with two friends. We take a car, and my friend drives for three hours. I take a <b>map</b> and find the <b>street</b> where our <b>hotel</b> is. The <b>place</b> is <b>beautiful</b>: a big <b>park</b>, an old <b>building</b> and a quiet <b>market</b>. We <b>visit</b> two museums and <b>stay</b> for two days. I take many photos, because I want to keep this <b>time</b> in my <b>heart</b>. The <b>world</b> is big, and I want to see more of it. Next year I want to travel to another country.",
  blue:["travel","city","map","street","hotel","place","beautiful","park","building","market","visit","stay","time","heart","world"],
  q:[
    {q:"How do they travel to the other city?",options:["By car","By train","By plane"],a:0},
    {q:"What is the reading mainly about?",options:["A short trip to another city","Moving to a new house","Working in a hotel"],a:0},
    {q:"In the text, \"keep this time in my heart\" means...",options:["remember the trip with feeling","write the time on paper","forget the trip soon"],a:0}
  ]
}
];
module.exports = R;
