// common/build/inline-common.mjs
// Revision 1.0.0 | 2026-11-26 | AWS Quick (AI) | The ONE helper that the MDL, PPP and Sub builds use to
// inline common modules (AGENTS.md §3 rev 1.18, spec §3.9 rev 1.108). One strip rule set for all builds.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const COMMON = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Read common/manifest.json.
 * @returns {object} manifest
 */
export function readManifest() {
  return JSON.parse(fs.readFileSync(path.join(COMMON, 'manifest.json'), 'utf8'));
}

/**
 * Resolve modules and their dependsOn in manifest order.
 * @param {object} manifest
 * @param {string[]} names requested module names
 * @returns {object[]} module entries
 */
function resolveModules(manifest, names) {
  const byName = new Map(manifest.modules.map(m => [m.name, m]));
  const need = new Set();
  const visit = n => {
    const m = byName.get(n);
    if (!m) throw new Error(`inline-common: unknown module "${n}"`);
    if (need.has(n)) return;
    (m.dependsOn || []).forEach(visit); need.add(n);
  };
  names.forEach(visit);
  return manifest.modules.filter(m => need.has(m.name));
}

/**
 * Remove import lines and export keywords; check the one-export rule (module contract rule 2).
 * @param {string} src module source
 * @param {object} mod manifest entry
 * @param {string} file relative path, for messages
 * @returns {string} stripped source
 */
export function stripModule(src, mod, file) {
  const exports = [...src.matchAll(/^\s*export\s+(?:const|let|var|function|class)\s+([A-Za-z_$][\w$]*)/gm)].map(m => m[1]);
  if (/^\s*export\s*\{/m.test(src) || /^\s*export\s+default/m.test(src)) throw new Error(`inline-common: ${file} uses export {…} or export default; use one named export`);
  if (exports.length !== 1 || exports[0] !== mod.namespace) throw new Error(`inline-common: ${file} must export exactly "${mod.namespace}" (found: ${exports.join(', ') || 'none'})`);
  if (/^\s*import\s/m.test(src) && !(mod.dependsOn || []).length) throw new Error(`inline-common: ${file} imports but has no dependsOn`);
  return src.split('\n').filter(l => !/^\s*import\s/.test(l)).join('\n').replace(/^(\s*)export\s+/gm, '$1');
}

/**
 * Build the inline payload for a project build.
 * @param {{modules:string[]}} opts
 * @returns {{css:string, js:string, version:string, meta:string, modules:object[]}}
 */
export function inlineCommon({ modules }) {
  const manifest = readManifest();
  const list = resolveModules(manifest, modules);
  let css = '', js = '';
  for (const m of list) {
    for (const f of m.css || []) css += `\n/* ===== common/${f} (${m.name} ${m.version}) ===== */\n` + fs.readFileSync(path.join(COMMON, f), 'utf8');
    for (const f of m.js || []) js += `\n/* ===== common/${f} (${m.name} ${m.version}) ===== */\n` + stripModule(fs.readFileSync(path.join(COMMON, f), 'utf8'), m, f);
  }
  if (/<\/script/i.test(js)) js = js.replace(/<\/script/gi, '<\\/script');
  const meta = `<meta name="common-version" content="${manifest.version}">`;
  return { css, js, version: manifest.version, meta, modules: list.map(m => ({ name: m.name, version: m.version })) };
}
