// Universal pre-deploy cache-bump for ALL phases.
//
// P1/P2 have no per-phase generator script in the repo (only _gen_p3/_gen_p4
// exist), so per-script SW wiring isn't possible. This is the single source of
// truth: it derives the SW cache name from a hash of the served content and
// rewrites pwa/sw.js. Run it BEFORE every `workbuddy_cloudstudio_deploy` of
// pwa/ so that ANY content edit — including manual P1/P2 JSON edits — forces
// devices to re-download fresh packs (no manual cache-version edits ever).
require('./_bump_sw.js');
console.log('SW cache bumped from content hash. Now deploy pwa/ to push fresh content.');
