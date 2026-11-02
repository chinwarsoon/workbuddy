#!/usr/bin/env node
// harness-pipeline — Tier-1 pipeline + design conformance harness.
//
// Layer 1 of the Dashboard-UI-Design-Spec.md §8 two-layer check model
// (Layer 2 = harness-layout, the UI/layout conformance harness).
//
// Auto-discovers checks/<name>.mjs — each default-exports a config object that declares the
// REAL pipeline source, the sub-project workplan, the spec sections it references, and an array
// of assertions. Adding a sub-project = drop a config file; no core change needed.
//
// Usage:
//   node harness.mjs                       # run all discovered sub-projects
//   node harness.mjs --subproject ppp      # run one
//   node harness.mjs --subproject ppp --root /path/to/repo
//   WORKBUDDY_ROOT=/path node harness.mjs  # override repo root
//
// Each assertion records PASS / FAIL / MANUAL via ctx.ok() / ctx.manual(). MANUAL marks items
// that need a browser/render layer (also covered by harness-layout) so they never fake-green.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { repoRoot, loadProject } from './lib/pipeline-probe.mjs';
import { extractSections } from './lib/workplan-extract.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const arg = f => { const i = args.indexOf(f); return i >= 0 ? args[i + 1] : null; };
const target = arg('--subproject');
const all = args.includes('--all') || (!target);
const cliRoot = arg('--root');
const root = cliRoot || repoRoot(here);

const checksDir = path.resolve(here, 'checks');
const files = fs.existsSync(checksDir)
  ? fs.readdirSync(checksDir).filter(f => f.endsWith('.mjs') && !f.startsWith('_'))
  : [];
let names = files.map(f => f.slice(0, -4));
if (target) names = names.filter(n => n === target);
if (!names.length) { console.error('No sub-project configs found in checks/'); process.exit(2); }

let totalPass = 0, totalFail = 0, totalManual = 0;
const logs = {};

for (const name of names){
  const cfg = (await import(pathToFileURL(path.resolve(checksDir, name + '.mjs')).href)).default;
  const proj = await loadProject(cfg, root);
  const workplanPath = cfg.workplan ? path.resolve(root, cfg.workplan) : null;
  const wpSections = extractSections(workplanPath);
  const results = [];
  const ctx = {
    name, title: cfg.title || name,
    pipeline: proj.pipeline, render: proj.render,
    root, workplanPath, specSections: cfg.specSections || [], wpSections,
    fixtures: cfg.fixtures || {},
    makeWorkbook: (cfg.fixtures && cfg.fixtures.makeWorkbook) || null,
    deriveView: proj.render ? (proj.render.deriveView || null) : null,
    ok: (n, c, d) => results.push({ name: n, pass: !!c, manual: false, detail: d || '' }),
    manual: (n, why) => results.push({ name: n, pass: false, manual: true, detail: why }),
  };

  console.log('\n' + '='.repeat(78));
  console.log(`TIER 1 — ${cfg.title || name}`);
  console.log(`  workplan : ${cfg.workplan || '—'} | spec: ${(cfg.specSections || []).join(', ')}`);
  if (proj.pipelineErr) console.log('  pipeline : ' + proj.pipelineErr);
  if (proj.renderErr) console.log('  render   : ' + proj.renderErr + ' (design-behavior assertions → MANUAL)');
  console.log('='.repeat(78));

  for (const a of (cfg.assertions || [])){
    if (a.needs === 'render' && !ctx.render){ ctx.manual(a.id + ' ' + a.desc, 'render not loaded — Layer-2 design behaviors also covered by harness-layout'); continue; }
    if (a.needs === 'pipeline' && !ctx.pipeline){ ctx.manual(a.id + ' ' + a.desc, 'pipeline not loaded'); continue; }
    const before = results.length;
    try { await a.run(ctx); }
    catch (e){ results.push({ name: a.id + ' ' + a.desc, pass: false, manual: false, detail: 'ERROR: ' + e.message }); }
    if (results.length === before) results.push({ name: a.id + ' ' + a.desc, pass: false, manual: false, detail: 'no assertion recorded' });
  }

  const p = results.filter(r => r.pass).length;
  const f = results.filter(r => !r.pass && !r.manual).length;
  const m = results.filter(r => r.manual).length;
  totalPass += p; totalFail += f; totalManual += m;
  for (const r of results){
    const tag = r.manual ? 'MANUAL' : (r.pass ? 'PASS  ' : 'FAIL  ');
    console.log(`  ${tag}  ${r.name}${r.detail ? '  (' + r.detail + ')' : ''}`);
  }
  console.log(`  → ${name}: ${p} pass, ${f} fail, ${m} manual`);
  logs[name] = { pass: p, fail: f, manual: m, workplan: cfg.workplan, specSections: cfg.specSections, results };
}

fs.mkdirSync(path.resolve(here, 'test_output'), { recursive: true });
fs.writeFileSync(path.resolve(here, 'test_output', 'tier1.json'), JSON.stringify(logs, null, 2));
console.log('\n' + '='.repeat(78));
console.log(`TIER 1 TOTAL: ${totalPass} pass, ${totalFail} fail, ${totalManual} manual`);
console.log('='.repeat(78));
process.exit(totalFail ? 1 : 0);
