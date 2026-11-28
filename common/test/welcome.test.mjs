// common/test/welcome.test.mjs
// Revision 1.4.1 | 2026-11-28 | CodeBuddy (AI) | The inlined CSS header check uses the welcome module version, not the common manifest version.
// Revision 1.3.1 | 2026-11-27 | CodeBuddy (AI) | Spec rev 1.113 — doneDwellMs accepts 3000 / 10000 and rejects 10001.
// Revision 1.3.0 | 2026-11-27 | CodeBuddy (AI) | Spec rev 1.112 — successHoldMs accepts 10000 and rejects 10001.
// Revision 1.2.1 | 2026-11-27 | AWS Quick (AI) | Choose test allows the btn-primary class (the 1.2.0 source adds it while a file is not ready).
// Revision 1.2.0 | 2026-11-27 | AWS Quick (AI) | C-06 — two-column layout: top bar Help, left guide panel (title, description, steps, checks), task panel (drop box, file list below, action row), checks[] / description validation, Choose primary until all files are ready. 1.1.0 single-column layout tests replaced.
// Revision 1.1.0 | 2026-11-27 | AWS Quick (AI) | C-04 / C-05 — plan() slot rules (own type only, ignored summary, set errors), files[] max 6, successHoldMs, ready state, fixed-box CSS, gap tokens, visible Choose button. The keydown test now checks that no key handler opens the picker (the success hold needs Enter / Escape).
// Revision 1.0.2 | 2026-11-26 | CodeBuddy (AI) | C-03 — assert the named group drop area and the native Choose keyboard path.
// Run: node common/test/welcome.test.mjs   (no browser, no project, no dependency)
import { CommonWelcome } from '../welcome/welcome.mjs';
import { inlineCommon, stripModule, readManifest } from '../build/inline-common.mjs';
import vm from 'node:vm';
import fs from 'node:fs';

let pass = 0, fail = 0;
const ok = (name, cond) => { cond ? pass++ : fail++; console.log(`${cond ? 'PASS' : 'FAIL'}  ${name}`); };

const one = { title: 'Master Document List Dashboard', instruction: 'Load the project workbook to start.', help: 'What file do I need?', mode: 'auto',
  files: [{ key: 'mdl', name: 'Master Document List', dashboardTitle: 'Master Document List' }] };
const two = { ...one, title: 'Document Submittal Dashboard', mode: 'confirm',
  files: [{ key: 'mdl', name: 'Master Document List', dashboardTitle: 'Master Document List' }, { key: 'log', name: 'Document Submittal Log', dashboardTitle: 'Document Submittal Log' }] };

// --- config validation (§3.7.2)
ok('valid auto config', CommonWelcome.validateConfig(one).length === 0);
ok('valid confirm config', CommonWelcome.validateConfig(two).length === 0);
ok('auto with 2 files is rejected', CommonWelcome.validateConfig({ ...two, mode: 'auto' }).length > 0);
ok('confirm with 1 file is rejected', CommonWelcome.validateConfig({ ...one, mode: 'confirm' }).length > 0);
ok('duplicate file keys rejected', CommonWelcome.validateConfig({ ...two, files: [two.files[0], two.files[0]] }).length > 0);
ok('non-data logo rejected (§3.9)', CommonWelcome.validateConfig({ ...one, logo: { src: 'logo.png' } }).length > 0);
const many = n => ({ ...two, files: Array.from({ length: n }, (_, i) => ({ key: 'f' + i, name: 'File ' + i, dashboardTitle: 'T' + i })) });
ok('6 files accepted (§3.7.2 rev 1.110)', CommonWelcome.validateConfig(many(6)).length === 0);
ok('7 files rejected (max 6)', CommonWelcome.validateConfig(many(7)).length > 0);
ok('duplicate dashboardTitle rejected', CommonWelcome.validateConfig({ ...two, files: [two.files[0], { ...two.files[1], dashboardTitle: two.files[0].dashboardTitle }] }).length > 0);
ok('successHoldMs 0 and 10000 accepted', CommonWelcome.validateConfig({ ...one, successHoldMs: 0 }).length === 0 && CommonWelcome.validateConfig({ ...one, successHoldMs: 10000 }).length === 0);
ok('checks[] with 6 entries rejected', CommonWelcome.validateConfig({ ...one, checks: ['a', 'b', 'c', 'd', 'e', 'f'] }).length > 0);
ok('checks[] with 3 entries and a description accepted', CommonWelcome.validateConfig({ ...one, checks: ['a', 'b', 'c'], description: 'd' }).length === 0);
ok('successHoldMs 10001 / -1 / 1.5 rejected', [10001, -1, 1.5].every(v => CommonWelcome.validateConfig({ ...one, successHoldMs: v }).length > 0));
ok('doneDwellMs 0 / 3000 / 10000 accepted', [0, 3000, 10000].every(v => CommonWelcome.validateConfig({ ...one, doneDwellMs: v }).length === 0));
ok('doneDwellMs 10001 / -1 / 1.5 rejected', [10001, -1, 1.5].every(v => CommonWelcome.validateConfig({ ...one, doneDwellMs: v }).length > 0));

// --- reducer (§3.7.4, §3.7.7)
const s0 = { slots: { mdl: { state: 'needed' }, log: { state: 'needed' } }, alert: '', view: 'slots', phase: -1 };
const s1 = CommonWelcome.reduce(s0, { type: 'accept', key: 'mdl', fileName: 'a.xlsx', dashboardTitle: 'Master Document List' });
ok('accept sets one slot only', s1.slots.mdl.state === 'accepted' && s1.slots.log.state === 'needed');
const s2 = CommonWelcome.reduce(s1, { type: 'reject', key: 'log', fileName: 'b.xlsx', reason: 'no Code sheet' });
ok('file error stays on its slot; other slot stays accepted', s2.slots.log.state === 'rejected' && s2.slots.mdl.state === 'accepted');
const s3 = CommonWelcome.reduce(s2, { type: 'phase', index: 1 });
ok('phase moves to loading view', s3.view === 'loading' && s3.phase === 1);
const s4 = CommonWelcome.reduce(s3, { type: 'fail', index: 1, reason: 'x' });
ok('fail returns to slots with alert and retry', s4.view === 'slots' && s4.alert === 'x' && s4.retry === true && s4.slots.mdl.state === 'accepted');
ok('reducer does not mutate input', s1.slots.log.state === 'needed');
const s5 = CommonWelcome.reduce(s3, { type: 'ready', phases: 3 });
ok('ready state after load (success hold)', s5.view === 'ready' && s5.phase === 3);
ok('done after ready', CommonWelcome.reduce(s5, { type: 'done' }).view === 'done');

// --- plan(): slot rules for a picked set (§3.7.5 rev 1.110, C-04)
const need = { mdl: { state: 'needed' }, log: { state: 'needed' } };
const F = n => ({ name: n });
const okR = (t, p = 'P1') => ({ ok: true, dashboardTitle: t, projectTitle: p });
const p1 = CommonWelcome.plan(two, [{ file: F('a.xlsx'), r: okR('Master Document List') }, { file: F('b.xlsx'), r: okR('Document Submittal Log') },
  { file: F('c.xlsx'), r: { ok: false, reason: 'no Code sheet' } }, { file: F('ppp.xlsx'), r: okR('Procurement Package Plan') }, { file: F('n.docx'), r: { ok: false, reason: 'not a workbook' } }], need);
ok('5 picked: 2 used, both slots accepted', p1.used === 2 && p1.picked === 5 && p1.slots.mdl.state === 'accepted' && p1.slots.log.state === 'accepted');
ok('5 picked: 3 ignored, listed with reasons', p1.ignored.length === 3 && p1.ignored.every(x => x.file && x.reason));
const p2 = CommonWelcome.plan(two, [{ file: F('a.xlsx'), r: okR('Master Document List') }, { file: F('c.xlsx'), r: { ok: false, reason: 'no Code sheet' } }], need);
ok('untyped failure never marks another slot (C-04)', p2.slots.log.state === 'needed' && p2.ignored.length === 1);
const p3 = CommonWelcome.plan(two, [{ file: F('b.xlsx'), r: { ok: false, dashboardTitle: 'Document Submittal Log', reason: 'no Project Title' } }], need);
ok('typed failure marks its own slot only', p3.slots.log.state === 'rejected' && p3.slots.mdl.state === 'needed' && p3.ignored.length === 0);
const p4 = CommonWelcome.plan(two, [{ file: F('a.xlsx'), r: okR('Master Document List') }, { file: F('a2.xlsx'), r: okR('Master Document List') }], need);
ok('two files of one type give a set error', !!p4.setError && !p4.slots);
const p5 = CommonWelcome.plan(two, [{ file: F('a.xlsx'), r: okR('Master Document List', 'P1') }, { file: F('b.xlsx'), r: okR('Document Submittal Log', 'P2') }], need);
ok('project mismatch gives a set error', !!p5.setError);
const p6 = CommonWelcome.plan(two, [{ file: F('b2.xlsx'), r: { ok: false, dashboardTitle: 'Document Submittal Log', reason: 'x' } }],
  { mdl: { state: 'needed' }, log: { state: 'accepted', fileName: 'b.xlsx', dashboardTitle: 'Document Submittal Log', projectTitle: 'P1' } });
ok('a failed file never replaces an accepted slot', p6.slots.log.state === 'accepted' && p6.ignored.length === 1);
const p7 = CommonWelcome.plan(one, [{ file: F('c.xlsx'), r: { ok: false, reason: 'no Code sheet' } }], { mdl: { state: 'needed' } });
ok('auto mode: a failed file marks the one slot', p7.slots.mdl.state === 'rejected');
ok('plan does not mutate the input slots', need.mdl.state === 'needed' && need.log.state === 'needed');
ok('reasons are raw text (escaped once, at output)', CommonWelcome.plan(two, [{ file: F('x.xlsx'), r: okR('A & B') }], need).ignored[0].reason.includes('A & B'));

// --- module contract: no project data, no literal colour in CSS
const src = fs.readFileSync(new URL('../welcome/welcome.mjs', import.meta.url), 'utf8');
ok('module holds no project title / file name', !/TWRP|C3B2|\.xlsx['"]/.test(src.replace(/accept="\.xlsx,\.xlsm"/, '')));
ok('no div/td role=button (Tier 1)', !/<(?:div|td)\b[^>]*role=["']button["']/i.test(src));
ok('drop area is a named group', /class="cw-box cw-drop[^"]*" role="group" aria-label=/.test(src));
ok('drop area is not in the tab order', !/class="cw-drop"[^>]*tabindex/.test(src));
ok('no key handler opens the file picker (C-03)', !/onKey[\s\S]{0,600}input\.click\(/.test(src.slice(src.indexOf('const onKey'), src.indexOf('const onChange'))));
ok('Choose control is a native button', /<button type="button" class="btn cw-choose[^"]*">/.test(src));
ok('success hold has an Open now button and role=status', src.includes('cw-open') && /class="cw-ready" role="status"/.test(src));
ok('done step waits doneDwellMs before the opener', /dwellTimer = setTimeout\(reveal, dwell\)/.test(src));
ok('top bar holds the Help button', /<header class="cw-topbar">[\s\S]{0,600}class="cw-help"/.test(src));
ok('left guide panel has title, steps and checks', /<aside class="cw-left">[\s\S]{0,900}class="cw-title"[\s\S]{0,600}class="cw-steps"[\s\S]{0,600}cw-checks/.test(src));
ok('right panel order: intro → box → list header → slots → actions → footer', (() => { const r = src.slice(src.indexOf('<div class="cw-right">')); const o = ['cw-intro', 'cw-body', 'cw-lh', 'cw-slots', 'cw-actions', 'cw-foot'].map(c => r.indexOf(`class="${c}`)); return o.every((v, i) => v > 0 && (i === 0 || v > o[i - 1])); })());
ok('file list is outside the drop box', !/class="cw-box cw-drop[\s\S]{0,1200}class="cw-slots/.test(src.slice(src.indexOf('function paint'), src.indexOf('function slotHtml'))));
ok('Choose is primary until every file is ready', /cw-choose\$\{n < N \? ' btn-primary' : ''\}/.test(src));
ok('Open dashboard is primary only when every file is ready', /cw-load\$\{canOpen \? ' btn-primary' : ''\}/.test(src));
ok('the current step is marked aria-current', src.includes('aria-current="step"'));
const css = fs.readFileSync(new URL('../welcome/welcome.css', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
ok('CSS has no hex colour', !/#[0-9a-fA-F]{3,8}\b/.test(css));
ok('CSS has no rgb()/hsl() literal', !/\b(?:rgb|rgba|hsl|hsla)\(/.test(css));
ok('CSS has no min-height override', !/min-height/.test(css));
ok('CSS classes use the .cw- prefix', [...css.matchAll(/\.([a-z][\w-]*)/g)].every(m => m[1].startsWith('cw-') || ['btn', 'btn-primary', 'is-on', 'is-now', 'is-done', 'is-checking', 'is-accepted', 'is-rejected', 'is-running', 'is-failed', 'is-err', 'is-dense', 'is-cols', 'is-ready', 'is-auto', 'is-confirm'].includes(m[1])));
ok('card width token defined', css.includes('--welcome-card-w:'));
ok('screen is fixed with overflow:auto (§3.7.1)', /\.cw-screen\{[^}]*position:fixed[^}]*overflow:auto/.test(css));
ok('card has no aspect-ratio (§3.7.1)', !/\.cw-card\{[^}]*aspect-ratio/.test(css));
ok('drop box has no aspect-ratio (height from --welcome-drop-h)', !/\.cw-(?:box|drop)\{[^}]*aspect-ratio/.test(css));
ok('reduced motion is respected (§3.7.7)', /prefers-reduced-motion:reduce/.test(css));
ok('drop box and stage share one fixed-height row (§3.7.1 rev 1.111)', /\.cw-right\{[^}]*grid-template-rows:auto var\(--welcome-drop-h\)/.test(css) && /\.cw-box\{[^}]*overflow:hidden/.test(css));
ok('card height is fixed by the columns (600 px row fits 1280 × 720)', /\.cw-card\{[^}]*grid-template-rows:auto var\(--welcome-card-h\)/.test(css) && /--welcome-card-h:600px/.test(css));
ok('columns split 1 : 1.618', /\.cw-cols\{[^}]*grid-template-columns:minmax\(0,1fr\) minmax\(0,1\.618fr\)/.test(css));
ok('columns stack below 900 px', /@media \(max-width:900px\)\{[^}]*\}\.cw-cols\{grid-template-columns:minmax\(0,1fr\)\}/.test(css));
ok('file list scrolls inside its row only', /\.cw-slots\{[^}]*overflow:auto/.test(css));
ok('4–6 files use two columns', /\.cw-slots\.is-cols\{[^}]*grid-template-columns:1fr 1fr/.test(css));
ok('layout tokens defined', ['card-w', 'card-h', 'card-radius', 'logo-h', 'drop-h', 'gap', 'slot-h', 'left-bg', 'left-fg'].every(k => css.includes(`--welcome-${k}:`)));
ok('action row uses the small gap', /\.cw-actions\{[^}]*margin-top:var\(--welcome-gap\)/.test(css));
ok('Choose button is styled by the module (visible on every project)', /\.cw-choose\{[^}]*border:1px solid var\(--blue\)/.test(css) && /\.cw-choose\.btn-primary\{[^}]*background:var\(--blue\)/.test(css));
ok('short-viewport exception releases the card height', /@media \(max-height:699px\)\{\.cw-card\{grid-template-rows:auto auto\}\}/.test(css));

// --- inline helper (spec §3.9 rev 1.108)
const man = readManifest();
const welcomeMod = man.modules.find(m => m.name === 'welcome');
const out = inlineCommon({ modules: ['welcome'] });
ok('version from manifest', out.version === man.version && out.meta === `<meta name="common-version" content="${man.version}">`);
ok('inlined JS has no import / export', !/^\s*(import|export)\s/m.test(out.js));
ok('inlined JS parses', (() => { try { new vm.Script(out.js); return true; } catch { return false; } })());
ok('inlined JS defines only CommonWelcome at top level', (() => { const c = vm.createContext({}); vm.runInContext(out.js + ';this.__n=typeof CommonWelcome', c); return c.__n === 'object'; })());
ok('inlined CSS carries the module header', out.css.includes(`common/welcome/welcome.css (welcome ${welcomeMod.version})`));
ok('two exports fail the build', (() => { try { stripModule('export const CommonWelcome={};\nexport const x=1;', man.modules[0], 't'); return false; } catch { return true; } })());
ok('unknown module fails the build', (() => { try { inlineCommon({ modules: ['nope'] }); return false; } catch { return true; } })());

console.log(`\n${pass} passed / ${fail} failed`);
process.exit(fail ? 1 : 0);
