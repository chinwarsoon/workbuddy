/* Core-verb override list for Phase 1.
   WHY: the source list (google-10000-english) is a WEB corpus, so everyday
   spoken words are ranked far below their real frequency — eat (2706),
   sleep (2683), tired (5620), wash (5151), busy (4047), sit (3683) — while
   web artifacts (page, site, click, copyright) rank high.
   A teacher cannot teach "copyright" before "eat", so these words are
   allowed into the Phase 1 TAUGHT layer even though their web rank is
   1001-5620. Every word here still appears inside the top 10,000 list,
   so the pack stays inside the 0-10k universe.
   The RECOGNITION scaffold (bare words) remains strictly ranks 1-1000. */
module.exports = [
  "door","bed","morning","hour","late","sleep","eat","drink","woman","boy",
  "teacher","letter","strong","tired","move","stop","cold","walk","happy",
  "busy","ready","turn","hear","speak","begin","wait","bring","carry","sit",
  "stand","wash","clean","wear","cut","slow","beautiful","idea","minute",
  "listen","heart","mother","father","photos","hours","words","streets",
  "roads","cars","hands","ends","pays","costs","friends"
];
