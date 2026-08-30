/* one-off patch: extend A2 readings to 150+ words and fix blue-list mismatches */
const fs = require("fs");
const f = "C:/Users/frank/WorkBuddy/workbuddy/english-learning/build/p2_readings.js";
let s = fs.readFileSync(f, "utf8");
const patches = [
 ["Now he says a small <b>injury</b> or a small pain is a <b>warning</b> from your body, and you should listen to it before it becomes <b>significant</b>.",
  "Now he says a small <b>injury</b> or a small pain is a <b>warning</b> from your body, and you should listen to it before it becomes <b>significant</b>. He also eats more vegetables and drinks more water. The doctor told him to come back in six months for a check."],
 ["My teacher says the earth does not need saving; we need saving from ourselves. Every small action has an <b>impact</b>, and together they are <b>significant</b>.",
  "My teacher says the earth does not need saving; we need saving from ourselves. In our town we now clean the river twice a year, and the water is much better. Every small action has an <b>impact</b>, and together they are <b>significant</b>. The habits themselves are not difficult; they only need to be regular."],
 ["Sometimes waiting is the best <b>strategy</b>.",
  "Sometimes waiting is the best <b>strategy</b>. I also learned that a career is not a straight road. You can say no, wait, and still arrive at the right place, as long as you know what you want to develop."],
 ["Your <b>progress</b> will feel slow, but one day you will notice that you are thinking in English without trying.",
  "Your <b>progress</b> will feel slow, but one day you will notice that you are thinking in English without trying. Find a reason that matters to you: a job, a person, or a film you want to understand without subtitles. That reason will keep you going on the days when study feels heavy."],
 ["It is noisy and expensive, but it also gives you chances that a small town cannot.",
  "It is noisy and expensive, but it also gives you chances that a small town cannot. Most young people I know still want to stay, because the city gives them work and freedom. A small town is quieter, but it cannot offer the same future."],
 ["It was difficult for one week, and then it became <b>normal</b>.",
  "It was difficult for one week, and then it became <b>normal</b>. I also turned off most message alerts, and that single change saved me almost an hour a day. In the evenings I read a book instead, and my sleep is much better."],
 ["Now I always plan one extra day.",
  "Now I always plan one extra day. The worst part of any journey is the queue at security, so I wear simple shoes and keep my bag light. Little things like that make travelling much easier."],
 ["The <b>impact</b> on our life is large: we sleep better and we argue less about money.",
  "The <b>impact</b> on our life is large: we sleep better and we argue less about money. We also write down every large purchase before we make it, and then we wait two days. Most of the time we do not buy it in the end."],
 ["I think good food is not only about the recipe; it is also about the person who cooks it and the place where you eat it.",
  "I think good food is not only about the recipe; it is also about the person who cooks it and the place where you eat it. The restaurant is not expensive either, and that is another reason I go back every week. Good food does not have to cost a lot of money."],
 ["That is why I keep playing, year after year.",
  "That is why I keep playing, year after year. Before every match we now go for a short run together, and that has made the team much stronger. Next season we want to enter a bigger competition."],
 ["it gives me friends and a reason to go <b>outdoor</b> even in winter.",
  "it gives me friends and a reason to go <b>outdoor</b> even in the coldest months."],
 ["When the lights go out on the final evening, everyone feels a little sad, and we start waiting for the next <b>season</b>.",
  "When the lights go out on the final evening, everyone feels a little sad, and we start waiting for the next <b>season</b>. My father says a town without a festival is a town without a memory. I think he is right."]
];
let n = 0;
patches.forEach(function (p) {
  if (s.indexOf(p[0]) >= 0) { s = s.replace(p[0], p[1]); n++; }
  else console.log("NOT FOUND: " + p[0].slice(0, 50));
});
/* winter is no longer a blue word in the sport reading */
s = s.replace('"strength","outdoor","winter"', '"strength","outdoor"');
fs.writeFileSync(f, s);
console.log("applied " + n + " of " + patches.length);
