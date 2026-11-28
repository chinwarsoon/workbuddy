// common/test/tokens.test.mjs
// Revision 1.0.1 | 2026-11-28 | CodeBuddy (AI) | Spec rev 1.116 — resolve color-mix(..., transparent) crosshair tints over surface and zebra before measuring AA.
// Revision 1.0.0 | 2026-11-28 | AWS Quick (AI) | C-07 — Node tests for the common/tokens module: completeness
// against the token contract (tokens.schema.json) and WCAG AA contrast per theme (spec §8.2 assertion 54).
// Run: node common/test/tokens.test.mjs   (no browser, no project, no dependency)
import fs from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond, detail = '') => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`); };

const css = fs.readFileSync(new URL('../tokens/tokens.css', import.meta.url), 'utf8');
const schema = JSON.parse(fs.readFileSync(new URL('../tokens/tokens.schema.json', import.meta.url), 'utf8'));
const { themes, requiredTokens, aaPairs } = schema.default;

// --- module contract: pure CSS, no project data, no literal selectors beyond :root / [data-theme] ---
const cssNoComments = css.replace(/\/\*[\s\S]*?\*\//g, '');
ok('no selector other than :root / [data-theme="…"]', !/[^}]*\{/.test(cssNoComments.replace(/(?:\:root,)?\[data-theme="\w+"\]\{[^}]*\}/g, '').trim()));
ok('module holds no project title / file name', !/TWRP|C3B2|MDL Dashboard|Procurement|Submittal/.test(css));

// --- parse each theme block ---
/** @param {string} name theme key @returns {Record<string,string>} resolved token map */
function parseTheme(name) {
  const re = new RegExp(`(?:\\:root,)?\\[data-theme="${name}"\\]\\{([^}]*)\\}`);
  const m = cssNoComments.match(re);
  if (!m) return null;
  return Object.fromEntries([...m[1].matchAll(/(--[\w-]+):([^;]+)/g)].map(x => [x[1], x[2].trim()]));
}
/** Resolve one level of var(--x) aliasing within a theme's own map. */
function resolve(map, key, depth = 0) {
  const v = map[key];
  if (v == null || depth > 5) return null;
  const ref = v.match(/^var\((--[\w-]+)\)$/);
  return ref ? resolve(map, ref[1], depth + 1) : v;
}

const parsed = {};
for (const t of themes) {
  const map = parseTheme(t);
  ok(`theme "${t}" block exists`, !!map);
  parsed[t] = map || {};
}

// --- completeness: every theme defines every required token ---
for (const t of themes) {
  const missing = requiredTokens.filter(k => !(k in parsed[t]));
  ok(`theme "${t}" defines all ${requiredTokens.length} required tokens`, missing.length === 0, missing.join(', '));
}

// --- WCAG AA contrast (spec §8.2 assertion 54) ---
const hex = v => { const m = (v || '').trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) return null; let h = m[1]; if (h.length === 3) h = [...h].map(c => c + c).join(''); return h.toLowerCase(); };
const lum = h => { const c = [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16) / 255).map(x => x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
/** Blend a `color-mix(in srgb, var(--accent) N%, transparent)` tint over a base token. */
function blendTint(map, mix, baseKey) {
  const m = String(mix || '').match(/^color-mix\(in srgb, var\((--[\w-]+)\) (\d+(?:\.\d+)?)%, transparent\)$/);
  if (!m) return null;
  const accent = hex(resolve(map, m[1])), base = hex(resolve(map, baseKey));
  if (!accent || !base) return null;
  const a = Number(m[2]) / 100;
  return [0, 2, 4].map(i => Math.round(parseInt(accent.slice(i, i + 2), 16) * a + parseInt(base.slice(i, i + 2), 16) * (1 - a)).toString(16).padStart(2, '0')).join('');
}

for (const t of themes) {
  for (const { label, fg, bg, minRatio } of aaPairs) {
    const F = hex(resolve(parsed[t], fg));
    const bgRaw = resolve(parsed[t], bg);
    let r = null;
    if (F && bgRaw && bg.startsWith('--crosshair-')) {
      const bases = ['--surface', '--ds-zebra'].map(k => blendTint(parsed[t], bgRaw, k)).filter(Boolean);
      const ratios = bases.map(b => ratio(F, b));
      if (ratios.length) r = Math.min(...ratios);
    } else {
      const B = hex(bgRaw);
      if (F && B) r = ratio(F, B);
    }
    ok(`${t}: ${label} (${fg} on ${bg}) >= ${minRatio}:1`, r != null && r >= minRatio, r != null ? `${r.toFixed(2)}:1` : 'unresolved colour');
  }
}

// --- distinct identity guard (prevents a future regression to "all darks look the same") ---
// Dark-family themes must not share the same --chrome-bg; light-family themes must not share --accent.
const darkThemes = themes.filter(t => t !== 'light' && t !== 'sky' && t !== 'contrast');
const chromeBgs = darkThemes.map(t => resolve(parsed[t], '--chrome-bg'));
ok('dark-family themes (dark/ocean/presentation) use distinct --chrome-bg values', new Set(chromeBgs).size === chromeBgs.length, chromeBgs.join(', '));
const accents = themes.map(t => resolve(parsed[t], '--accent'));
ok('every theme uses a distinct --accent colour', new Set(accents).size === accents.length, accents.join(', '));

console.log(`\n${pass} passed / ${fail} failed`);
process.exit(fail ? 1 : 0);
