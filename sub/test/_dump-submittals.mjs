import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readXlsx } from '../engine/xlsx-reader.js';
import { buildModel } from '../engine/pipeline.js';
import { renderDashboard } from '../engine/render.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const config = JSON.parse(fs.readFileSync(path.join(root, 'config/pipeline_contract.json'), 'utf8'));
const bytes = name => { const v = fs.readFileSync(path.join(root, name)); return v.buffer.slice(v.byteOffset, v.byteOffset + v.byteLength); };
const model = buildModel(await readXlsx(bytes('TWRP C3B2 - Master Document List.xlsx')), await readXlsx(bytes('TWRP C3B2 - Document Submittal Log.xlsx')), { contract: config, today: '2026-10-24' });
let html = '';
const rootNode = { set innerHTML(v) { html = v; }, get innerHTML() { return html; } };
renderDashboard({ querySelector: s => s === '[data-page-content]' ? rootNode : null }, model, { page: 'Submittals' });

const lines = [];
const i = html.indexOf('drill-btn');
lines.push('--- around drill-btn ---');
lines.push(html.slice(Math.max(0, i - 320), i + 460));
const h = html.indexOf('vheadtab');
lines.push('--- around vheadtab ---');
lines.push(html.slice(h, h + 700));
for (const token of ['••', '⋮', '·', 'dots', 'grip']) {
  lines.push(`token ${JSON.stringify(token)}: ${html.includes(token)}`);
}
console.log(lines.join('\n'));
