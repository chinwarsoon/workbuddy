#!/usr/bin/env node
// run.mjs — cross-subproject Tier-1 orchestrator for harness-pipeline.
//
// Runs every discovered sub-project (harness.mjs --all), aggregates test_output/tier1.json, prints
// one combined verdict, and exits non-zero if any sub-project has a FAIL. This is the
// top-level "did the pipelines still work per workplan?" gate the AI test engineer runs
// before any edit — Tier 1 of the §8 two-layer model (Tier 2 = harness-layout, Tier 3 = data).
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const harness = path.resolve(here, 'harness.mjs');

// Run the per-subproject harness; forward its output live.
const r = spawnSync(process.execPath, [harness, '--all'], {
  cwd: here, encoding: 'utf8', stdio: ['ignore', 'inherit', 'inherit'],
});

let logs = {};
try { logs = JSON.parse(fs.readFileSync(path.resolve(here, 'test_output', 'tier1.json'), 'utf8')); } catch {}

let pass = 0, fail = 0, manual = 0;
const rows = [];
for (const [name, v] of Object.entries(logs)) {
  const p = v.pass || 0, f = v.fail || 0, m = v.manual || 0;
  pass += p; fail += f; manual += m;
  rows.push(`| ${name} | ${p} | ${f} | ${m} |`);
}

console.log('\n' + '='.repeat(78));
console.log('TIER 1 — ALL SUB-PROJECTS (harness-pipeline)');
console.log('| Sub-project | Pass | Fail | Manual |');
console.log('|-------------|------|------|--------|');
if (rows.length) console.log(rows.join('\n'));
else console.log('| (none discovered) | — | — | — |');
console.log(`| **Total** | **${pass}** | **${fail}** | **${manual}** |`);
console.log('='.repeat(78));

let verdict, mark;
if (fail > 0) { verdict = 'FAIL — fix pipeline/design before merge'; mark = '❌'; }
else if (manual > 0) { verdict = 'MANUAL — automated green, design items need render/harness-layout'; mark = '👀'; }
else { verdict = 'PASS'; mark = '✅'; }

console.log(`${mark} TIER 1 VERDICT: ${verdict}`);
console.log(`   total — pass:${pass}  fail:${fail}  manual:${manual}`);
process.exit(fail > 0 ? 1 : 0);
