#!/usr/bin/env node
// ── STE prose lint — ASD-STE100 Issue 9 ────────────────────────────────────────
// Scans markdown prose for words that ASD-STE100 Issue 9 does NOT approve.
//
// WHY THIS DIRECTION: the lint flags words on the NOT-APPROVED list, not words
// missing from the approved list. The dictionary PDF does not tag determiners,
// numerals or interjections ("(det)", "(num)" and "(int)" never appear in the
// extracted text), so an approved-word list built from the PDF is incomplete and
// would flag correct words such as "the", "is" and "every". The not-approved list
// is reliable: it holds 1247 of the 1274 words the standard lists.
//
// Authority: docs/ASD-STE100-Issue-9/ASD-STE100_Issue9_official.pdf
//
// Usage:
//   node ste-lint.mjs                                   # scan the current directory (markdown + dashboard HTML), advisory
//   node ste-lint.mjs ./AGENTS.md                       # scan one file or directory
//   node ste-lint.mjs --path ./docs --path ./src
//   node ste-lint.mjs path/to/Dashboard.html            # lint a built dashboard's visible text only
//   node ste-lint.mjs --mode hard                       # fail the run on any finding
//   node ste-lint.mjs --top 40 --lines                  # also list file:line for each finding
//   node ste-lint.mjs --words <json> --approved <json>  # point at different word lists
//
// Scope: ASD-STE100 Issue 9 prose for markdown docs AND the visible user-facing text of
// dashboard HTML (KPI labels, panel titles, button labels, validation + status-bar text).
// <script>/<style>/<svg> and HTML tags/attributes are stripped; only rendered text is checked.
//
// Portable: word lists resolve from a bundled ./wordlists/ copy if present, else the canonical
// docs/ASD-STE100-Issue-9/ location. Copy this folder to any project and drop the lists in ./wordlists/
// to run standalone (the official PDF stays the authority reference, not loaded at runtime).
//
// LIMIT: findings are CANDIDATES, not verdicts. The PDF text layer is incomplete (approved list
// 800/875; not-approved 1247/1274) and STE approves a word for a part of speech only. Confirm in
// docs/ASD-STE100-Issue-9/ASD-STE100_Issue9_official.pdf before you change a word.
//
// No browser and no dashboard needed.

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve, relative, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

// ── CLI ───────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const VALUE_FLAGS = new Set(['--words', '--allow', '--mode', '--top', '--exclude', '--path']);
const flagOnce = (name, dflt) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : dflt;
};
const flagMany = name => argv.reduce(
  (acc, a, i) => (a === name && argv[i + 1] && !argv[i + 1].startsWith('--') ? [...acc, argv[i + 1]] : acc), []);

// Word lists default to the bundled copy in ./wordlists/ (self-contained, no project paths).
// Override with --words / --approved to point at your own lists.
const BUNDLED_WORDS = join(HERE, 'wordlists', 'not-approved-words.json');
const BUNDLED_APPROVED = join(HERE, 'wordlists', 'approved-words.json');
const WORDS_JSON = resolve(flagOnce('--words', BUNDLED_WORDS));
const APPROVED_JSON = resolve(flagOnce('--approved', BUNDLED_APPROVED));
const ALLOW_JSON = resolve(flagOnce('--allow', join(HERE, 'ste-allow.json')));
for (const [label, p] of [['not-approved words', WORDS_JSON], ['approved words', APPROVED_JSON]]) {
  if (!existsSync(p)) {
    console.log(`  FAIL ${label} list not found at ${p}`);
    console.log('        Place not-approved-words.json / approved-words.json in ./wordlists/ or pass --words / --approved');
    process.exit(2);
  }
}
const MODE       = flagOnce('--mode', 'advisory');          // advisory | hard
const TOP        = Number(flagOnce('--top', '25'));
const SHOW_LINES = argv.includes('--lines');
const EXCLUDE    = new Set(flagOnce('--exclude', 'node_modules,.git,dist,build,coverage,archive').split(',').filter(Boolean));
const positional = argv.filter((a, i) => !a.startsWith('--') && !(i > 0 && VALUE_FLAGS.has(argv[i - 1])));
const TARGETS    = [...flagMany('--path'), ...positional].map(p => resolve(p));

// ── Result tracking (same shape as harness.mjs) ───────────────────────────────
let pass = 0, fail = 0, warns = 0;
function ok(name, cond, detail = '') {
  if (cond) { pass++; console.log('  PASS', name); }
  else { fail++; console.log('  FAIL', name, detail || ''); }
}
function warn(name, cond, detail = '') {
  if (cond) { pass++; console.log('  PASS', name); }
  else { warns++; console.log('  WARN', name, detail || ''); }
}

// ── Load the not-approved word list ───────────────────────────────────────────
console.log('\n══ STE prose lint — ASD-STE100 Issue 9 ═════════════════════════════');
if (!existsSync(WORDS_JSON)) {
  console.log('  FAIL cannot read the not-approved word list:', WORDS_JSON);
  console.log('  HINT: run the extraction in docs/ASD-STE100-Issue-9/README.md');
  process.exit(2);
}
const doc = JSON.parse(readFileSync(WORDS_JSON, 'utf8'));
const official = doc.official_not_approved_word_count ?? 1274;
const coverage = doc.coverage_percent ?? null;

// STE approves a word FOR A PART OF SPEECH. "use (n)" is not approved; the verb "use" is.
// This lint does not parse part of speech, so a word that appears on BOTH lists is left alone —
// otherwise correct prose ("use the file") is flagged because of a different part of speech.
// Only words that are not approved and never approved anywhere are reported.
const notApproved = new Set(doc.words.map(w => w.toLowerCase()));
let approvedSet = new Set();
if (existsSync(APPROVED_JSON)) {
  approvedSet = new Set(JSON.parse(readFileSync(APPROVED_JSON, 'utf8')).words.map(w => w.toLowerCase()));
}
const banned = new Set([...notApproved].filter(w => !approvedSet.has(w)));

let allow = [];
if (existsSync(ALLOW_JSON)) {
  const a = JSON.parse(readFileSync(ALLOW_JSON, 'utf8'));
  allow = Array.isArray(a) ? a : (a.words || []);
}
const allowSet = new Set(allow.map(w => String(w).toLowerCase()));
console.log(`  INFO: not-approved words loaded = ${notApproved.size} of ${official}`
  + (coverage ? ` (${coverage}% of the standard)` : ''));
console.log(`  INFO: approved words loaded = ${approvedSet.size} — used to suppress part-of-speech conflicts`);
console.log(`  INFO: effective watch list = ${banned.size} words (not approved in any listed part of speech)`);
console.log(`  INFO: technical nouns / verbs allow-listed = ${allowSet.size} (${relative(process.cwd(), ALLOW_JSON)})`);
console.log(`  INFO: word-list source = ${WORDS_JSON !== BUNDLED_WORDS ? 'override --words' : 'bundled ./wordlists/'}`);
if (!TARGETS.length) TARGETS.push(process.cwd());

// ── Collect markdown files ────────────────────────────────────────────────────
function walk(target, out) {
  if (!existsSync(target)) return out;
  if (statSync(target).isFile()) {
    const e = extname(target).toLowerCase();
    if (e === '.md' || e === '.html') out.push(target);
    return out;
  }
  for (const name of readdirSync(target)) {
    if (EXCLUDE.has(name)) continue;
    walk(join(target, name), out);
  }
  return out;
}
const files = [...new Set(TARGETS.flatMap(t => walk(t, [])))].sort();
if (!files.length) {
  console.log('  FAIL no markdown files found under:', TARGETS.join(', '));
  process.exit(2);
}

// ── Strip everything that is not prose ────────────────────────────────────────
// Code, identifiers, paths, URLs, table rows and front matter are EXEMPT
// (AGENTS.md §5 Rule 19e: correctness outranks style).
function stripNonProse(text) {
  return text
    .replace(/^---\n[\s\S]*?\n---\n/, ' ')      // YAML front matter
    .replace(/```[\s\S]*?```/g, ' ')            // fenced code
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/`[^`\n]*`/g, ' ')                 // inline code
    .replace(/<!--[\s\S]*?-->/g, ' ')           // HTML comments
    .replace(/https?:\/\/\S+/g, ' ')            // URLs
    .replace(/\]\([^)]*\)/g, ']')               // link targets
    .replace(/<[^>\n]+>/g, ' ');                // inline HTML
}

// Extract only the VISIBLE text from a dashboard HTML file. Strip script/style/svg/comments,
// then all tags (attributes included), decode the common entities. This is the text a reader
// sees — KPI labels, panel/section titles, button labels, validation + status-bar strings.
// Mirrors ste-lint's markdown exemption philosophy: code/identifiers are not prose.
function extractHtmlText(html) {
  return String(html)
    .replace(/<!--[\s\S]*?-->/gi, ' ')                       // comments
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')             // script blocks
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')              // style blocks
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')                  // svg (skip per direction)
    .replace(/<[^>]+>/g, ' ')                               // all remaining tags (attrs gone)
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, ' ');
}

const WORD_RE = /[A-Za-z][a-z']+/g;
const counts = new Map();          // word -> total occurrences
const perFile = new Map();         // file -> {hits, words}
const lineHits = new Map();        // file -> [{line, word}]

for (const file of files) {
  const ext = extname(file).toLowerCase();
  let lines;
  if (ext === '.html') {
    // Lint the dashboard's visible text only (see extractHtmlText).
    lines = [extractHtmlText(readFileSync(file, 'utf8'))];
  } else {
    lines = stripNonProse(readFileSync(file, 'utf8')).split('\n');
  }
  let hits = 0, words = 0;
  lines.forEach((line, idx) => {
    if (/^\s*\|/.test(line)) return;            // table rows are exempt
    for (const m of line.matchAll(WORD_RE)) {
      const w = m[0].toLowerCase().replace(/'s$/, '').replace(/'$/, '');
      words++;
      if (w.length < 2 || allowSet.has(w)) continue;
      if (!banned.has(w)) continue;
      hits++;
      counts.set(w, (counts.get(w) || 0) + 1);
      if (SHOW_LINES) {
        if (!lineHits.has(file)) lineHits.set(file, []);
        lineHits.get(file).push({ line: idx + 1, word: w });
      }
    }
  });
  perFile.set(file, { hits, words });
}

// ── Report ────────────────────────────────────────────────────────────────────
const totalWords = [...perFile.values()].reduce((a, b) => a + b.words, 0);
const totalHits = [...perFile.values()].reduce((a, b) => a + b.hits, 0);
const pct = totalWords ? ((totalHits / totalWords) * 100).toFixed(2) : '0.00';
console.log(`  INFO: files scanned = ${files.length} · prose + dashboard-text words = ${totalWords}`);

const ranked = [...counts.entries()].sort((a, b) => b[1] - a[1]);
if (ranked.length) {
  console.log(`\n── Most frequent not-approved words (top ${Math.min(TOP, ranked.length)}) ──────`);
  for (const [w, n] of ranked.slice(0, TOP)) console.log(`  ${String(n).padStart(5)}  ${w}`);
}

const worst = [...perFile.entries()].filter(([, v]) => v.hits > 0)
  .sort((a, b) => b[1].hits - a[1].hits).slice(0, 10);
if (worst.length) {
  console.log('\n── Files with the most findings ────────────────────────────────────');
  for (const [f, v] of worst) {
    const share = v.words ? ((v.hits / v.words) * 100).toFixed(2) : '0.00';
    console.log(`  ${String(v.hits).padStart(5)} / ${String(v.words).padStart(6)} words (${share}%)  ${relative(process.cwd(), f)}`);
  }
}

if (SHOW_LINES) {
  console.log('\n── Findings by line (first 40) ────────────────────────────────────');
  let shown = 0;
  for (const [f, arr] of lineHits) {
    for (const h of arr) {
      if (shown++ >= 40) break;
      console.log(`  ${relative(process.cwd(), f)}:${h.line}  ${h.word}`);
    }
    if (shown >= 40) break;
  }
}

console.log('\n── Result ──────────────────────────────────────────────────────────');
const name = `markdown prose + dashboard visible text avoids words that ASD-STE100 Issue 9 does not approve `
  + `(${totalHits} of ${totalWords} checked words are not approved, ${pct}%)`;
if (MODE === 'hard') ok(name, totalHits === 0);
else warn(name, totalHits === 0);

console.log(`\n  ${pass} passed · ${fail} failed · ${warns} advisory`);
console.log('  For the approved alternative, look each word up in the dictionary PDF.');

process.exit(fail > 0 ? 1 : 0);
