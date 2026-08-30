/* Phase 2 graded readings (A2). Blue words come from p2_words_a/b.js.
   Each reading: 150-240 words, 10-14 blue words, 3 questions
   (detail / main idea / vocabulary-in-context). */
const R = [
{
  title:"村庄之旅", titleEn:"A Trip to the Village", level:"A2",
  text:"Last summer we took a short <b>trip</b> to a small <b>village</b> in the north. The <b>distance</b> from the city is about sixty miles, and the road crosses an old <b>bridge</b> over a wide <b>river</b>. We stopped at a <b>farm</b> to <b>rest</b> and bought fresh bread from the <b>owner</b>. In the afternoon we walked in the <b>forest</b> behind the village. The <b>ground</b> was soft and the air was cool. There were <b>animals</b> everywhere, and the place felt very <b>safe</b> and quiet. The whole <b>tour</b> took five hours, but nobody was tired. Before we left, the owner told us about an outdoor market on Sunday. I want to go back in <b>winter</b>, because the <b>season</b> changes everything here. My <b>favorite</b> part was the last hour, when the light went down behind the trees and the whole village became quiet. We took many photos, and I still look at them when I need a rest from the city.",
  blue:["trip","village","distance","bridge","river","farm","rest","owner","forest","ground","animals","safe","tour","winter","season","favorite"],
  q:[
    {q:"How far is the village from the city?",options:["About sixty miles","About six miles","About six hundred miles"],a:0},
    {q:"What is the reading mainly about?",options:["A day trip from the city to a village","Moving to a new house","Working on a farm"],a:0},
    {q:"In the text, \"fresh\" bread is bread that is...",options:["newly made","very old","very cheap"],a:0}
  ]
},
{
  title:"在医院", titleEn:"At the Hospital", level:"A2",
  text:"My father went to the <b>hospital</b> last month. The <b>doctor</b> asked about the <b>pain</b> in his back and took some <b>blood</b> for a test. The <b>patient</b> in the next bed was much older and had a different <b>disease</b>. The doctor said the problem was not serious, and he gave my father a <b>drug</b> to take twice a day with food. He also said regular exercise would help. There was no <b>operation</b>, and that was a great relief for all of us. The <b>medicine</b> cost very little, and the nurses were kind. Two weeks later the pain was gone. My father now walks for thirty minutes every morning. He says a small <b>injury</b> or a small pain is a <b>warning</b> from your body, and you should listen to it before it becomes <b>significant</b>. He also eats more vegetables and drinks more water. The doctor told him to come back in six months for a check.",
  blue:["hospital","doctor","pain","blood","patient","disease","drug","operation","medicine","injury","warning","significant"],
  q:[
    {q:"What did the doctor do first?",options:["Asked about the pain and took blood","Gave an operation","Sent him home"],a:0},
    {q:"What is the main idea?",options:["A hospital visit that ended well","How to become a doctor","The cost of medicine"],a:0},
    {q:"In the text, a \"warning\" from your body is...",options:["a sign that something is wrong","a kind of drug","a hospital document"],a:0}
  ]
},
{
  title:"我们的星球", titleEn:"Our Planet", level:"A2",
  text:"The <b>earth</b> is the only <b>planet</b> we can live on. Most of it is <b>ocean</b>, and the water is very <b>deep</b> in some places. On the land we have large <b>forest</b>s, and every <b>plant</b> and animal there is part of one system. But we produce too much <b>waste</b>, and the <b>damage</b> is now easy to see: dirty rivers, dead trees and plastic in the <b>sea</b>. This is a worldwide problem, not a local one. The good news is that simple habits help. We can use less water, keep the <b>ground</b> clean, and protect the wild <b>animals</b> near our towns. My teacher says the earth does not need saving; we need saving from ourselves. In our town we now clean the river twice a year, and the water is much better. Every small action has an impact, and together they are <b>significant</b>. The habits themselves are not difficult; they only need to be regular.",
  blue:["earth","planet","ocean","deep","forest","plant","waste","damage","sea","ground","animals","significant"],
  q:[
    {q:"What covers most of the earth?",options:["Ocean","Forest","Sand"],a:0},
    {q:"What is the writer's main message?",options:["Simple daily habits can reduce the damage","The earth cannot be saved","Plastic is good for the sea"],a:0},
    {q:"In the text, \"worldwide\" means...",options:["happening in all parts of the world","only in one town","only near the sea"],a:0}
  ]
},
{
  title:"选择职业", titleEn:"Choosing a Career", level:"A2",
  text:"Last year I had to make a difficult <b>choice</b> about my <b>career</b>. A large company offered me a job in another city, and I had to <b>consider</b> it carefully. The pay was good, but the work was not <b>develop</b>ing the skills I wanted. My manager said it was a great <b>chance</b> and that I should <b>apply</b> for the senior role later. In the end I said no. It was a hard <b>decision</b>, because the money was <b>significant</b> for my family. But I believed the new role would give me more <b>responsibility</b> and a better future. Six months later the same company called me again with a better <b>opportunity</b>. I took the <b>interview</b> and got the job. Sometimes waiting is the best <b>strategy</b>. I also learned that a career is not a straight road. You can say no, wait, and still arrive at the right place, as long as you know what you want to develop.",
  blue:["choice","career","consider","develop","chance","apply","decision","significant","responsibility","opportunity","interview","strategy"],
  q:[
    {q:"Why did the writer first say no to the job?",options:["It did not develop the skills wanted","The pay was too low","The city was too small"],a:0},
    {q:"What lesson does the reading suggest?",options:["Waiting can bring a better opportunity","Always take the first offer","Never change jobs"],a:0},
    {q:"In the text, \"senior\" role means a role that is...",options:["higher in level","for young students","only for one month"],a:0}
  ]
},
{
  title:"提高英语", titleEn:"Improving Your English", level:"A2",
  text:"Many students ask me how to <b>improve</b> their English. The answer is <b>simply</b> time and habit, not talent. Read something in English every day, even a short text, and try to <b>understand</b> the new words from the sentence around them. Keep a small notebook for useful <b>expression</b>s, because native speakers use the same phrases again and again. Listen to the language on your way to work, and repeat what you hear out loud. A short <b>session</b> every day is better than one long lesson at the weekend. Do not worry about mistakes; they are part of real <b>communication</b>. If you want to <b>master</b> a <b>foreign</b> language, you must be patient. Your <b>progress</b> will feel slow, but one day you will notice that you are thinking in English without trying. Find a reason that matters to you: a job, a person, or a film you want to understand without subtitles. That reason will keep you going on the days when study feels heavy.",
  blue:["improve","simply","understand","expression","session","communication","master","foreign","progress"],
  q:[
    {q:"What does the writer say is better than one long weekend lesson?",options:["A short session every day","One long lesson a month","Only reading books"],a:0},
    {q:"What is the main advice of the reading?",options:["Daily habit matters more than talent","Only native speakers can help","Never make mistakes"],a:0},
    {q:"In the text, \"patient\" means you should...",options:["accept slow progress without stopping","wait for a teacher","study only at night"],a:0}
  ]
},
{
  title:"城市生活", titleEn:"City Life", level:"A2",
  text:"The <b>population</b> of our city has grown fast in ten years. New blocks were <b>built</b> in the <b>northern</b> part, and the roads are now full of <b>traffic</b> every morning. Public <b>transport</b> is cheap, but it is crowded at eight. The biggest problem is <b>housing</b>: the <b>rent</b> for a small flat is now higher than a monthly salary. Young people often share a flat with three or four others. On the good side, the city has excellent <b>facilities</b>: a large library, a modern sports <b>hall</b> and a swimming <b>pool</b>. Most people here come from other places, so the city feels open and <b>modern</b>. It is noisy and expensive, but it also gives you chances that a small town cannot. Most young people I know still want to stay, because the city gives them work and freedom. A small town is quieter, but it cannot offer the same future.",
  blue:["population","built","northern","traffic","transport","housing","rent","facilities","hall","pool","modern"],
  q:[
    {q:"What is the biggest problem in the city?",options:["Housing and rent","The weather","The food"],a:0},
    {q:"How does the writer describe the city overall?",options:["Noisy and expensive, but full of chances","Quiet and cheap","Small and boring"],a:0},
    {q:"In the text, \"crowded\" means...",options:["full of people","very clean","very fast"],a:0}
  ]
},
{
  title:"电子设备", titleEn:"Our Devices", level:"A2",
  text:"Every <b>electronic</b> <b>device</b> in my home has a <b>screen</b>, and I look at them for too many hours a day. My computer <b>monitor</b> is large, which is good for work, but my eyes are tired in the evening. The battery on my phone never lasts a whole day now, so I carry a small power pack. A good internet <b>connection</b> is necessary for almost everything I do, from paying bills to talking to my parents. The <b>useful</b> side is clear: I can work from home two days a week. The bad side is that I check messages during dinner. Last month I made a rule: no <b>operations</b> on any device after nine at night. It was difficult for one week, and then it became <b>normal</b>. I also turned off most message alerts, and that single change saved me almost an hour a day. In the evenings I read a book instead, and my sleep is much better.",
  blue:["electronic","device","screen","monitor","connection","useful","operations","normal"],
  q:[
    {q:"What problem does the writer have with the phone?",options:["The battery does not last a day","The screen is broken","It has no connection"],a:0},
    {q:"What rule did the writer make?",options:["No devices after nine at night","No work from home","No internet at all"],a:0},
    {q:"In the text, \"power pack\" is something that...",options:["gives extra battery","takes photos","sends messages"],a:0}
  ]
},
{
  title:"乘飞机旅行", titleEn:"Travelling by Plane", level:"A2",
  text:"Our <b>flight</b> to the capital leaves at six in the morning, so we must be at the airport two hours early. I <b>reserve</b> the seats online and pay for the <b>ticket</b> with a card, because they <b>charge</b> extra at the desk. I always keep my travel <b>documents</b> in one small bag: passport, ticket and the address of our hotel. The <b>schedule</b> says we arrive before noon, and our destination is only twenty minutes from the airport by <b>transport</b>. Flying is fast, but the waiting is the hard part. I take a book, some water and a little food, because the prices inside the airport are high. Last year our plane was three hours late, and that was <b>simply</b> part of travelling. Now I always plan one extra day. The worst part of any journey is the queue at security, so I wear simple shoes and keep my bag light. Little things like that make travelling much easier.",
  blue:["flight","reserve","ticket","charge","documents","schedule","transport","simply"],
  q:[
    {q:"Why must they arrive two hours early?",options:["The flight leaves at six in the morning","The airport is far","They have no documents"],a:0},
    {q:"What does the writer advise at the end?",options:["Plan one extra day for delays","Never fly again","Always buy food at the airport"],a:0},
    {q:"In the text, \"charge extra\" means they...",options:["ask for more money","give a discount","lose the ticket"],a:0}
  ]
},
{
  title:"家庭预算", titleEn:"The Family Budget", level:"A2",
  text:"At the start of every month my wife and I write down our <b>budget</b>. Our <b>income</b> comes from two <b>sources</b>: my job and her small shop. We then list what is <b>necessary</b>: rent, food, transport and the children's school costs. After that we see what is left. We try to <b>spend</b> less on things we do not need, and we cook at home <b>instead</b> of eating out four times a week. Last year we had a lot of <b>debt</b>, and that was a hard time for us. Now we keep a small amount of <b>funds</b> for emergencies, on a monthly <b>basis</b>. It is not exciting, but it works. The impact on our life is large: we sleep better and we argue less about money. We also write down every large purchase before we make it, and then we wait two days. Most of the time we do not buy it in the end.",
  blue:["budget","income","sources","necessary","spend","instead","debt","funds","basis"],
  q:[
    {q:"Where does the family income come from?",options:["A job and a small shop","Only one job","Investments only"],a:0},
    {q:"What is the main idea of the reading?",options:["A simple monthly budget reduces stress","Eating out is always better","Debt is impossible to pay"],a:0},
    {q:"In the text, \"emergencies\" are events that are...",options:["sudden and need money now","planned months before","never serious"],a:0}
  ]
},
{
  title:"外出就餐", titleEn:"Eating Out", level:"A2",
  text:"There is a small <b>restaurant</b> near the station that I visit every Friday. The <b>owner</b> is a friendly woman, and her <b>kitchen</b> is small but very clean. The <b>menu</b> changes with the season, which I like, because the food is always fresh. I usually ask what she <b>recommended</b> that day, and I have never been disappointed. Her fish is <b>excellent</b>, and the coffee is the best in this part of the city. The <b>selected</b> wines are cheap and good. Once she gave me the recipe for her soup, and I tried it at home, but it did not taste the same. I think good food is not only about the recipe; it is also about the person who cooks it and the place where you eat it. The restaurant is not expensive either, and that is another reason I go back every week. Good food does not have to cost a lot of money.",
  blue:["restaurant","owner","kitchen","menu","recommended","excellent","selected"],
  q:[
    {q:"Why does the writer like the menu?",options:["It changes with the season","It never changes","It is only in English"],a:0},
    {q:"What does the writer learn about cooking?",options:["Good food is also about the cook and the place","Recipes are useless","Coffee is the only good thing"],a:0},
    {q:"In the text, \"disappointed\" means...",options:["unhappy because something was not as good as hoped","very full after eating","late for dinner"],a:0}
  ]
},
{
  title:"周末运动", titleEn:"Weekend Sport", level:"A2",
  text:"I play <b>football</b> with a small local team every Saturday. There are eleven <b>players</b> in the team, and we <b>train</b> twice a week in the evening. Our coach is a former player, and he says that regular <b>exercise</b> is better than hard exercise once a month. Last weekend the <b>match</b> was very close. The final <b>score</b> was two one, and we did not <b>win</b>, but nobody was angry. One of our players had a small <b>injury</b> and had to rest for two weeks. Since then we all do warm-up exercises before every session. Sport gives me more than <b>strength</b>; it gives me friends and a reason to go outdoor even in the coldest months. That is why I keep playing, year after year. Before every match we now go for a short run together, and that has made the team much stronger. Next season we want to enter a bigger competition.",
  blue:["football","players","train","exercise","match","score","win","injury","strength"],
  q:[
    {q:"How often does the team train?",options:["Twice a week","Once a month","Every day"],a:0},
    {q:"Why does the writer keep playing?",options:["It gives friends and a reason to go outside","It is the only way to win money","The coach forces the team"],a:0},
    {q:"In the text, a \"close\" match is a match that is...",options:["nearly equal between the two sides","played far away","finished very early"],a:0}
  ]
},
{
  title:"冬日节日", titleEn:"A Winter Festival", level:"A2",
  text:"Every year in <b>winter</b> our town holds a small <b>festival</b>. The <b>entire</b> main street is closed to cars for three days, and the <b>locations</b> for music and food are set up in the square. My <b>parents</b> come to stay with us, and we also invite one <b>guest</b> from abroad. It is my <b>favorite</b> time of the year, even though the weather is cold. People sell hot drinks and warm <b>clothing</b>, and children run everywhere. On the last night there is a short <b>race</b> around the square, and the winner gets a small <b>award</b>. The festival is not large or famous, but it brings the whole town together. When the lights go out on the final evening, everyone feels a little sad, and we start waiting for the next <b>season</b>. My father says a town without a festival is a town without a memory. I think he is right.",
  blue:["winter","festival","entire","locations","parents","guest","favorite","clothing","race","award","season"],
  q:[
    {q:"How long does the festival last?",options:["Three days","One evening","One week"],a:0},
    {q:"What does the writer like most about the festival?",options:["It brings the whole town together","It is famous worldwide","It is always warm"],a:0},
    {q:"In the text, \"square\" is most likely...",options:["an open public place in the town","a kind of food","a music instrument"],a:0}
  ]
}
];
module.exports = R;
