// Revision 1.23 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.67 / I122 — Tier 5 `lintC1TimeBar()` now measures the STORED single selection, not a derived range match. New checks: ONE joined `.seg.c1-ts-chips` group of five `.seg-btn` buttons, EXACTLY one `aria-pressed="true"` and one `.active` at a time, NO active chip after a manual handle `input` / `change`, every preset still selects its whole-month window, and ONE visual control row at `oneRowWidth: 1280` with `flex-wrap:nowrap` on `.c1-ts`. The focus and print rules follow the new `.seg-btn` selectors. Other dashboards keep their Tier 5 behaviour.
// Revision 1.22 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.66 / I121 — Tier 5 gained `lintC1TimeBar()`, a C1-only config-gated probe for the dual-handle period track: exactly one track with two native `step="1"` handles, whole-month values and bounds, one tick per reporting month with no pointer events, the five preset chips with `aria-pressed`, live `input` decoupling from the full `change` repaint, one-month keyboard steps, focus-visible CSS and print-hidden controls. Preset ranges and the shared Y-axis / table payload are measured in the browser. Other dashboards are unchanged.
// Revision 1.21 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.65 / I119 — `measureC1Geometry` now measures the windowed peak and the absolute cumulative values from `data-points`; the four rev 1.64 tick assertions are shared by `assertC1Axis()` and re-run after a period change. `c1PickAxisProbe()` derives the probe window from the DATA (bounds-checked, grain-checked, peak-checked and expected-axis-checked) and returns a SKIP instead of a FAIL when no meaningful shorter window exists. New checks: axis recomputed from the period window, absolute cumulative values unchanged, and a harness-only fill threshold. Both spec copies re-synced byte-identical.
// Revision 1.20 | 2026-11-07 | CodeBuddy (AI) | §4.2 rev 1.64 — Tier 5 C1 geometry no longer asserts a fixed five ticks. `measureC1Geometry` reads `data-c1meta.yMax` / `yStep` / `yIntervals`, the rendered tick labels and the `line.sc-grid` Y coordinates; `lintC1Geometry` asserts metadata/label/grid-line agreement, the 7-interval and 8-label caps, >= ~40 px major-tick spacing, and nice-number label multiples. Both spec copies re-synced byte-identical. Issue I118.
// Revision 1.19 | 2026-11-06 | CodeBuddy (AI) | I-96 windowing check corrected at its source. Since Sub I-112 (2026-11-04) gave large tables pagination instead of windowing, the old probe used `#vCnt` (a paginated table's 16,393-row count) as the trigger and fell back to the first `.ds-table` when no `tr.win-pad` existed — often a header fragment with no `tbody`, so it reported 0 drawn rows and 0 spacers. Tier 4b now requires a real windowed table with spacer rows and skips with an explicit reason when none is present on the view. MDL, which still ships a windowed table, keeps the same four assertions unchanged.
// Revision 1.18 | 2026-11-06 | CodeBuddy (AI) | §4.2 rev 1.63 — Tier 5 gained `lintC1Interaction`, a C1-only opt-in browser probe for the promoted Option B model: four tokenised gradients and soft areas, one hidden pointer-transparent month band at W / N, `data-c1col` coverage, two-way chart / table column sync, chart-only floating window, and the cleared state on pointer-leave. Tier 6 gained the config-driven §4.6 hidden-window ARIA assertions: hidden windows must be aria-hidden AND empty of text, and shown windows must remove the attribute. Both additions are config-gated, so other dashboards are unchanged.
// Revision 1.17 | 2026-11-06 | CodeBuddy (AI) | §4.2 rev 1.62 — the C1 legend now sits ABOVE the
// plot. Tier 5 measures `legendAbovePlot` (legend bottom at or above the first grid line) instead
// of asserting a bottom legend, and `headTopDelta` now compares the `<thead>` to the last grid
// line (the plot's X axis) rather than to the SVG box bottom, so the assertion name matches what
// it measures. The expectation is config-driven via `c1.legendAbovePlot`. Owner decision 1 of
// 2026-11-06 is superseded for attached-table panels.
// Revision 1.16 | 2026-11-06 | CodeBuddy (AI) | Tier 5 gained C1 attached-table geometry checks
// (spec §4.2 rev 1.59 / §8.2 assertion 21). Measured in the browser: bar containment within a
// month column, data-points.cx mapped to month-header centres, grid tracks vs colgroup widths,
// the in-SVG bottom legend, a vertical Y-axis line, a rotated side Y caption, header adjacency
// to the SVG bottom, no separate SVG X labels and no horizontal scroll. The alignment group is
// repeated after the From / To period sliders move. The as-of caption assertion is inverted to
// the spec's "omit the as-of subtitle". Owner decisions 2026-11-06.
// Revision 1.15 | 2026-11-01 | opencode (AI) | P7 / D15, D17: Tier 1 accepts a declared inline
// classic script (cfg.inlineClassicScript) as standalone delivery. Tier 4c scopes sticky to tables
// inside a `.tableScroll`, exempts a split pair's body half from the I-90 header-height rule, and
// compares a fragment's width to body + `--ds-sbw` instead of the body alone. Verified against PPP.
// Revision 1.14 | 2026-10-30 | opencode (AI) | Tier 3 now accepts an optional per-dashboard
// `groundTruth` adapter (cfg.groundTruth({workbookPath, readFileSync, pathToFileURL})). A dashboard
// whose model/state/view shape differs from MDL returns {model, state, view, kpis, issueCount}; the
// MDL-only dated-series checks are skipped for it. The default MDL path is unchanged. Tier 3 also
// honours a cfg.filterRoundTrip.apply(page, cfg) callback, and skips it when it returns null. Added
// for PPP I-76 P4.
// Revision 1.13 | 2026-10-25 | CodeBuddy (AI) | Tier 5 `lintC3` now also checks the C3 summary table: it is present, it shows its eight columns, it has a Total footer row, and it repaints when the Month selector changes.
// Revision 1.12 | 2026-10-25 | CodeBuddy (AI) | Tier 5 now guarantees its own starting state. It
// used to inherit whatever page the previous tier left, which was often unloaded, so every chart
// check failed and `lintC1` blocked until its locator timed out; `ensureLoadedForTier5` now always
// navigates and injects the workbook. Also added Tier 5 `lintC3` for the C3 Breakdown chart
// (workplan D36): two-series structure, component board, Month / Breakdown-by / View toggles and
// PNG / Copy. And fixed an invalid selector in `lintC1`: `[data-c1series]` + `="forecast"` produced
// `[data-c1series]="forecast"`, which threw before any series behaviour could be checked.
// Revision 1.11 | 2026-10-24 | CodeBuddy (AI) | The Tier 1 module check now accepts an inline
// `<script type="module">` as well as a local linked module, because spec §3.9 requires a standalone
// page with no cross-file module. A linked module must still be project-local. Resolves I021.
// Revision 1.10 | 2026-10-24 | CodeBuddy (AI) | Tier 2 now loads the configured workbook before it
// measures the shell, because spec §3.7 hides the chrome behind the welcome overlay until the first
// load. The reveal uses the same injectWorkbook helper as Tier 4. A zone visibility check or a
// geometry check is skipped with a reason when the shell stays hidden, so a missing workbook no
// longer reports 0 x 0 boxes as failures.
// Revision 1.9 | 2026-10-24 | CodeBuddy (AI) | The shell checks now follow spec §3.1: the required
// zones are titlebar, menubar, left-sidebar, content and statusbar. The iconbar and right-sidebar
// requirements are removed. The 36 / 48 / 22 px bar heights and the 260 px sidebar width are removed
// too, because the spec fixes no such values. The checks now assert stack order, containment and a
// 140-320 px sidebar band (§3.2).
// Revision 1.8 | 2026-10-24 | CodeBuddy (AI) | The design spec is now resolved from the repository
// root first and from the bundled spec/ copy second, so the root copy is the authority and the
// harness still runs on its own. The two copies are byte-identical.
// Revision 1.7 | 2026-10-24 | CodeBuddy (AI) | Spec §3.3 removes the content toolbar, so the three
// content-zone checks no longer require a `toolbar` zone: they now assert `filter-area` and `body`.
// Revision 1.6 | 2026-10-24 | CodeBuddy (AI) | The sidebar collapse-control and resize-handle checks
// required two of each, which assumed the old two-sidebar shell. Spec §3.1 says there is no right
// sidebar, so a conforming shell has one — the thresholds are now >= 1. The sub also used to satisfy
// the old threshold only because it carried a duplicate collapse toggle inside the panel; that
// duplicate was removed, so the check would otherwise fail for the wrong reason.
// Revision 1.5 | 2026-10-24 | Codex | Fix dashboard-specific KPI and filter round-trip checks.
// harness.mjs — universal, spec-driven layout evaluation harness. Self-contained: auto-discovers
// dashboards from checks/ and resolves the design spec via --spec, then the repository root copy,
// then a bundled spec/ copy. Reusable for any future project.
// Three tiers:
//   Tier 1 — any HTML: structural / CSS token checks (no data needed)
//   Tier 2 — dashboard shell: header, status bar, warning bar, panel chrome
//   Tier 3 — data + filter verification: pipeline ground-truth vs rendered DOM
//
// Usage:
//   node harness.mjs [--dashboard <name>] [--tier 1|2|3|4] [--workbook <path>] [--spec <path>]
//
//   --dashboard <name>  run one dashboard (auto-discovered from checks/); omit to run all
//   --tier <n>          run only tier n (default: all)
//   --workbook <path>   .xlsx for Tier 3 data verification (else advisory)
//   --spec <path>       design spec to reference (default: the repository root copy of
//                      Dashboard-UI-Design-Spec.md, else the bundled spec/ copy)
//
// Tier 3 requires --workbook pointing to the real .xlsx file.
// Without --dashboard, all configured dashboards in checks/ are run.

import { chromium } from 'playwright';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dashboardUrl = cfg => cfg.pageUrl || pathToFileURL(cfg.htmlPath).href;

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const argVal = (flag) => { const i = args.indexOf(flag); return i >= 0 ? args[i + 1] : null; };
const targetDashboard = argVal('--dashboard');
const targetTier = argVal('--tier') ? Number(argVal('--tier')) : null;
const cliWorkbook = argVal('--workbook');

// ── Dashboard registry (auto-discovered from checks/) ──────────────────────────
// Drop a `checks/<name>.mjs` that default-exports a config object to add a dashboard — no core
// change needed. This makes the harness reusable for any future project, not just the bundled example mdl/ppp dashboards.
const checksDir = resolve(here, 'checks');
const DASHBOARDS = existsSync(checksDir)
  ? readdirSync(checksDir).filter(f => f.endsWith('.mjs') && !f.startsWith('_')).map(f => f.slice(0, -4))
  : [];

// ── Spec resolution (spec-driven, self-contained) ──────────────────────────────
// (1) --spec <path> if given; (2) the repository root copy, which is the authority; (3) the bundled
// spec/ copy, which is byte-identical and keeps the harness portable on its own. The encoded checks
// correspond to the spec you point at.
const argSpec = argVal('--spec');
const ROOT_SPEC = resolve(here, '..', 'Dashboard-UI-Design-Spec.md');
const BUNDLED_SPEC = resolve(here, 'spec', 'Dashboard-UI-Design-Spec.md');
let specPath;
if (argSpec) {
  specPath = resolve(argSpec);
  if (!existsSync(specPath)) { console.log(`  FAIL --spec not found: ${specPath}`); process.exit(2); }
} else if (existsSync(ROOT_SPEC)) {
  specPath = ROOT_SPEC;
} else if (existsSync(BUNDLED_SPEC)) {
  specPath = BUNDLED_SPEC;
} else {
  console.log('  WARN no spec found (no --spec, no root copy, no spec/ copy) — checks run against the encoded ruleset');
  specPath = null;
}
const specSource = argSpec ? '--spec arg'
  : (specPath === ROOT_SPEC ? 'repository root copy'
  : (specPath ? 'bundled copy (spec/)' : 'none — encoded ruleset only'));
console.log(`\n══ harness-layout — spec-driven layout harness ═════════════════════════════`);
console.log(`  INFO: spec = ${specPath || 'none'}  (source: ${specSource})`);

// ── Result tracking ───────────────────────────────────────────────────────────
let pass = 0, fail = 0, skip = 0, warns = 0;
function ok(name, cond, detail = '') {
  if (cond) { pass++; console.log('  PASS', name); }
  else       { fail++; console.log('  FAIL', name, detail || ''); }
}
// advisory verdict: reported, never fails the run (used for archived review artefacts)
function warn(name, cond, detail = '') {
  if (cond) { pass++; console.log('  PASS', name); }
  else       { warns++; console.log('  WARN', name, detail || ''); }
}
function skipped(name) { skip++; console.log('  SKIP', name); }

// ── Tier 1: universal structure (no browser) ─────────────────────────────────
async function runTier1(cfg) {
  console.log('\n── Tier 1: universal structure ─────────────────────────────────');
  const html = readFileSync(cfg.htmlPath, 'utf8');
  ok('HTML document declares viewport sizing', /<meta\s+name=["']viewport["']/i.test(html));
  ok('HTML does not depend on repository common assets', !/(?:^|[\"'])\/?common\/universal_ui_design\.(css|js)/i.test(html));
  ok('dashboard defines stable shell zone markers', ['titlebar','menubar','left-sidebar','content','statusbar']
    .every(zone => html.includes(`data-shell="${zone}"`)));
  ok('content declares filter-area and body zones', ['filter-area','body']
    .every(zone => html.includes(`data-shell="${zone}"`)));
  // Browser-computed styles and warning bounds are checked in Tier 2; CSS may be external.
  const localCss = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/gi)].map(m=>m[1]);
  ok('dashboard CSS is project-local', localCss.some(src => !/^[a-z]+:\/\//i.test(src) && !/(?:^|\/)common\//.test(src)) || /<style\b/i.test(html));
  // Spec §3.9: a standalone dashboard inlines its code. An inline `<script type="module">` passes.
  // A dashboard that declares `inlineClassicScript` (a single classic IIFE, also standalone and
  // fetch-free) passes on the same tier — the marker is about shipping project-local code, not
  // about the module syntax the browser never requires. A linked module must still be project-local.
  const moduleScripts = [...html.matchAll(/<script\b(?=[^>]*\btype=["']module["'])[^>]*>/gi)].map(m => m[0]);
  const linkedLocal = moduleScripts.some(tag => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i);
    return !!src && !/^[a-z]+:\/\//i.test(src[1]) && !/(?:^|\/)common\//.test(src[1]);
  });
  const inlineModule = moduleScripts.some(tag => !/\bsrc=/i.test(tag));
  const inlineClassic = !!cfg.inlineClassicScript
    && /<script\b(?![^>]*\bsrc=)[^>]*>[\s\S]{200,}?<\/script>/i.test(html);
  ok('dashboard ships a project-local module, linked or inlined', linkedLocal || inlineModule || inlineClassic,
    `module scripts: ${moduleScripts.length}, local link: ${linkedLocal}, inline: ${inlineModule}, inline classic declared: ${inlineClassic}`);
  const srcs = [...html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1]);
  ok('dashboard refers to local or root-relative assets', srcs.every(src => !/^[a-z]+:\/\//i.test(src) || src.startsWith('data:')),
    srcs.filter(src => /^[a-z]+:\/\//i.test(src) && !src.startsWith('data:')).join(', '));
  const badActions = (html.match(/<(?:div|td)\b[^>]*role=["']button["']/gi) || []).length;
  ok('actions do not use div or td role=button', badActions === 0, `found ${badActions}`);
  if (cfg.srcDir) {
    ok('configured source directory exists', existsSync(cfg.srcDir));
  } else skipped('pipeline module check (not configured for this dashboard)');
}

// ── Tier 2: dashboard shell checks (spec §3.1, no data loaded) ────────────────
async function revealShell(page, cfg, workbookPath) {
  const box = () => page.evaluate(() => {
    const el = document.querySelector('[data-shell="titlebar"]');
    const r = el && el.getBoundingClientRect();
    return !!r && r.width > 0 && r.height > 0;
  });
  if (await box()) return { loaded: true, reason: 'shell already visible' };
  if (!workbookPath || !existsSync(workbookPath)) return { loaded: false, reason: 'no workbook configured' };
  try {
    await injectWorkbook(page, workbookPath, cfg);
    await page.waitForFunction(() => {
      const el = document.querySelector('[data-shell="titlebar"]');
      const r = el && el.getBoundingClientRect();
      return !!r && r.width > 0 && r.height > 0;
    }, { timeout: 20000 });
  } catch (e) {
    return { loaded: await box(), reason: `load failed: ${e.message.split('\n')[0]}` };
  }
  return (await box()) ? { loaded: true, reason: 'workbook loaded' } : { loaded: false, reason: 'shell still hidden after load' };
}

// Spec §3.7: the welcome overlay hides the shell until the first successful load. Tier 2 therefore
// loads the configured workbook before it measures the shell. If no workbook is available, the
// geometry checks are skipped with a reason instead of failing on a 0 x 0 box.
async function runTier2(page, cfg, workbookPath) {
  console.log('\n── Tier 2: dashboard shell ─────────────────────────────────────');
  await page.goto(dashboardUrl(cfg));
  const reveal = await revealShell(page, cfg, workbookPath);
  console.log(`  INFO: shell visible = ${reveal.loaded} (${reveal.reason})`);
  const zones = ['titlebar', 'menubar', 'left-sidebar', 'content', 'statusbar'];
  for (const zone of zones) {
    const el = page.locator(`[data-shell="${zone}"]`).first();
    ok(`shell zone ${zone} exists`, await el.count() === 1);
    if (reveal.loaded) ok(`shell zone ${zone} is visible`, await el.isVisible().catch(() => false));
    else skipped(`shell zone ${zone} visibility (${reveal.reason})`);
  }
  const shell = await page.evaluate(() => {
    const rect = (name) => {
      const e = document.querySelector(`[data-shell="${name}"]`);
      if (!e) return null;
      const r = e.getBoundingClientRect();
      return { x:r.x, y:r.y, width:r.width, height:r.height, right:r.right, bottom:r.bottom,
        display:getComputedStyle(e).display, position:getComputedStyle(e).position };
    };
    const content = document.querySelector('[data-shell="content"]');
    return { titlebar:rect('titlebar'), menubar:rect('menubar'), left:rect('left-sidebar'),
      content:rect('content'), statusbar:rect('statusbar'),
      viewport:{width:innerWidth,height:innerHeight},
      htmlOverflow:getComputedStyle(document.documentElement).overflow,
      bodyOverflow:getComputedStyle(document.body).overflow,
      htmlHeight:getComputedStyle(document.documentElement).height,
      bodyHeight:getComputedStyle(document.body).height,
      htmlRectHeight:document.documentElement.getBoundingClientRect().height,
      bodyRectHeight:document.body.getBoundingClientRect().height,
      shellAttrs:['filter-area','body'].map(n => !!content?.querySelector(`[data-shell="${n}"]`)),
      warning:rect('warnings') };
  });
  const tol = 2;
  // A geometry check needs a measurable box, so it is skipped when the shell is still hidden.
  const geometry = (name, cond, detail) => (reveal.loaded ? ok(name, cond, detail) : skipped(`${name} (${reveal.reason})`));
  // Spec §3.1: a two-row header — title bar then menu bar. No icon bar and no right sidebar.
  // The spec fixes no pixel height for the bars, so the checks assert order and containment only.
  geometry('title bar sits at the viewport top, spans the width, and has a positive height',
    !!shell.titlebar && Math.abs(shell.titlebar.y)<=tol && shell.titlebar.height>0
    && Math.abs(shell.titlebar.width-shell.viewport.width)<=tol, JSON.stringify(shell.titlebar));
  geometry('menu bar sits directly below the title bar, spans the width, and has a positive height',
    !!shell.menubar && shell.menubar.height>0 && Math.abs(shell.menubar.width-shell.viewport.width)<=tol
    && Math.abs(shell.menubar.y-shell.titlebar.bottom)<=tol, JSON.stringify(shell.menubar));
  geometry('status bar is full-width and anchored to the viewport bottom, with a positive height',
    !!shell.statusbar && shell.statusbar.height>0 && shell.statusbar.x<=tol
    && Math.abs(shell.statusbar.width-shell.viewport.width)<=tol
    && Math.abs(shell.statusbar.bottom-shell.viewport.height)<=tol, JSON.stringify(shell.statusbar));
  geometry('left sidebar and content share one row below the menu bar',
    !!shell.left && !!shell.content && shell.left.x < shell.content.x
    && Math.abs(shell.left.y-shell.menubar.bottom)<=tol && Math.abs(shell.content.y-shell.menubar.bottom)<=tol,
    JSON.stringify({left:shell.left,content:shell.content,menubar:shell.menubar}));
  // Spec §3.2: the sidebar is sized to its menu titles — 160 px here — with a 140 px resize floor.
  geometry('left sidebar width is between 140 and 320 px', !!shell.left && shell.left.width>=140 && shell.left.width<=320,
    JSON.stringify(shell.left));
  geometry('content area has flexible positive width', !!shell.content && shell.content.width>0);
  geometry('left sidebar and content end at the status bar', !!shell.left && !!shell.content && !!shell.statusbar
    && Math.abs(shell.left.bottom-shell.statusbar.y)<=tol
    && Math.abs(shell.content.bottom-shell.statusbar.y)<=tol,
    JSON.stringify({left:shell.left,content:shell.content,statusbar:shell.statusbar}));
  ok('HTML and body fill viewport with page scrolling disabled', Math.abs(shell.htmlRectHeight-shell.viewport.height)<=tol
    && Math.abs(shell.bodyRectHeight-shell.viewport.height)<=tol && shell.htmlOverflow==='hidden' && shell.bodyOverflow==='hidden', JSON.stringify({height:[shell.htmlRectHeight,shell.bodyRectHeight],overflow:[shell.htmlOverflow,shell.bodyOverflow]}));
  ok('content zones filter-area and body exist', shell.shellAttrs.every(Boolean), JSON.stringify(shell.shellAttrs));
  const orderOk = await page.evaluate(() => {
    const c=document.querySelector('[data-shell="content"]');
    const nodes=['filter-area','body'].map(n=>c?.querySelector(`[data-shell="${n}"]`));
    return nodes.every(Boolean) && nodes[0].compareDocumentPosition(nodes[1]) & Node.DOCUMENT_POSITION_FOLLOWING;
  });
  ok('content zones appear filter-area → body', orderOk);
  const warningInside = await page.evaluate(() => {
    const w=document.querySelector('[data-shell="warnings"]'), c=document.querySelector('[data-shell="content"]');
    if (!w) return true; // No warning surface until notices exist.
    if (w.hidden || getComputedStyle(w).display === 'none') return true;
    const a=w.getBoundingClientRect(), b=c?.getBoundingClientRect();
    return !!b && w.closest('[data-shell="content"]')===c && a.left>=b.left-1 && a.right<=b.right+1;
  });
  ok('warning area stays inside content width', warningInside);
  // Spec §3.1: there is no right sidebar, so a conforming shell has ONE collapsible sidebar.
  const toggles = await page.locator('[data-shell-toggle="left-sidebar"]').count();
  ok('sidebar collapse controls are present', toggles >= 1, `found ${toggles}`);
  const resizeHandles = await page.locator('[data-shell-resize="left-sidebar"]').count();
  ok('sidebar resize handles are present', resizeHandles >= 1, `found ${resizeHandles}`);
}

// ── Tier 3: data + filter verification ───────────────────────────────────────
// Imports the pipeline directly (Node, no browser) to compute ground truth,
// then loads the dashboard in a browser and compares rendered values.
async function runTier3(page, cfg, workbookPath) {
  console.log('\n── Tier 3: data + filter verification ──────────────────────────');

  if (!cfg.pipelinePath) {
    console.log('  INFO: no pipelinePath configured — Tier 3 skipped (PPP I-76: monolithic pipeline)');
    skipped('Tier 3 (pipeline not importable)');
    return;
  }
  if (!existsSync(workbookPath)) {
    console.log('  INFO: workbook not found at', workbookPath, '— Tier 3 skipped');
    skipped('Tier 3 (workbook not found)');
    return;
  }

  // ── Ground truth via pipeline import ──
  // A dashboard whose model/state shape differs from MDL may supply cfg.groundTruth().
  // It returns { model, state, view, kpis, issueCount } and the MDL-specific series checks are skipped.
  const adapter = typeof cfg.groundTruth === 'function'
    ? await cfg.groundTruth({ workbookPath, cfg, readFileSync, pathToFileURL })
    : null;
  const { readXlsx } = await import(pathToFileURL(cfg.xlsxReaderPath).href);
  const { buildModel } = await import(pathToFileURL(cfg.pipelinePath).href);
  const { deriveView } = await import(pathToFileURL(cfg.renderPath).href);
  const readWorkbook = async filePath => {
    const buf = readFileSync(filePath);
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return readXlsx(ab);
  };
  const wb = adapter ? null : await readWorkbook(workbookPath);
  let model;
  let companionPath = null;
  if (adapter) {
    model = adapter.model;
  } else if (cfg.companionWorkbook) {
    companionPath = cfg.companionWorkbook;
    if (!existsSync(companionPath)) {
      console.log('  INFO: companion workbook not found at', companionPath, '— Tier 3 skipped');
      skipped('Tier 3 (companion workbook not found)');
      return;
    }
    const companion = await readWorkbook(companionPath);
    const contract = cfg.contractPath ? JSON.parse(readFileSync(cfg.contractPath, 'utf8')) : undefined;
    model = buildModel(wb, companion, { contract, workbookName: workbookPath.split(/[\\/]/).pop(), mdlWorkbookName: workbookPath.split(/[\\/]/).pop(), logWorkbookName: companionPath.split(/[\\/]/).pop() });
  } else {
    model = buildModel(wb, { workbookName: workbookPath.split(/[\\/]/).pop() });
  }

  // Default state: all disciplines, all non-excluded stages
  const EXCL = ['Deleted', 'Void', 'Superseded'];
  const sourceRows = (model.records || model.planned || []);
  const fullDisc = new Set(sourceRows.map(r => r.discipline).filter(Boolean));
  // D33/D43 — a blank Stage is a real filter value: it is listed as "Blank" and every registered
  // document counts. Dropping it from the tick set made the ground truth lose those rows
  // (7,513 instead of 7,631) and reported a false KPI failure.
  const fullStg  = new Set(sourceRows.map(r => r.stage ?? '').filter(s => !EXCL.includes(s)));
  const state = adapter ? adapter.state : { disciplines: fullDisc, stages: fullStg, search: '', searchCol: 'Document No.', rule: null };
  const view = adapter ? adapter.view : deriveView(model, state);
  const gt = adapter ? adapter.kpis : view.kpis;
  const issueCount = adapter ? adapter.issueCount : view.issues.length;

  // ── Load dashboard in browser and inject workbook ──
  const url = dashboardUrl(cfg);
  await page.goto(url);

  // Simulate file drop by injecting the workbook bytes into the page
  const wbBytes = Array.from(readFileSync(workbookPath));
  const companionBytes = companionPath ? Array.from(readFileSync(companionPath)) : null;
  await page.evaluate(async ([bytes, name, otherBytes, otherName]) => {
    const file = new File([new Uint8Array(bytes).buffer], name, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const other = otherBytes ? new File([new Uint8Array(otherBytes).buffer], otherName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) : null;
    if (other && typeof window._loadFiles === 'function') {
      await window._loadFiles(file, other);
    } else if (typeof window._loadFile === 'function') {
      await window._loadFile(file);
    } else {
      const dt = new DataTransfer();
      dt.items.add(file);
      if (other) dt.items.add(other);
      const drop = document.querySelector('.drop');
      if (drop) drop.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
    }
  }, [wbBytes, workbookPath.split(/[\\/]/).pop(), companionBytes, companionPath?.split(/[\\/]/).pop()]);

  // Wait for render (status bar appears after successful load)
  await page.waitForSelector('.status-bar:not([hidden])', { timeout: 15000 }).catch(() => {});

  // ── KPI comparisons ──
  const readKpi = async (selector) => {
    const el = page.locator(selector).first();
    const txt = await el.textContent().catch(() => '');
    return parseInt(txt.replace(/[^0-9]/g, ''), 10) || 0;
  };

  // Total planned
  const domTotal = await readKpi(cfg.kpiSelectors?.totalPlanned || '[data-kpi="totalPlanned"] .v, .kpi:first-child .v');
  ok(`KPI totalPlanned: DOM ${domTotal} = pipeline ${gt.totalPlanned}`, domTotal === gt.totalPlanned, `DOM=${domTotal} pipeline=${gt.totalPlanned}`);

  // §3.3.2 / D43 — a date-axis series plots only rows that carry the plan date, while totals count
  // every registered document. Assert the relationship, not a literal, so a new workbook cannot
  // break the check.
  const datedPlans = adapter ? [] : (model.planned || []).filter(row => row.documentNo
    && fullDisc.has(row.discipline)
    && fullStg.has(row.stage ?? '')
    && /^\d{4}-\d{2}-\d{2}/.test(String(row.fields['Planned 1st Issue Date'] || '')));
  const gtAsOfYm = String(model.meta?.asOfDate || '').slice(0, 7);
  const datedPlansAsOf = datedPlans.filter(row => String(row.fields['Planned 1st Issue Date']).slice(0, 7) <= gtAsOfYm);
  if (!adapter && view.c1 && !view.c1.empty && Array.isArray(view.c1.pCum)) {
    const last = view.c1.pCum[view.c1.pCum.length - 1];
    ok(`C1 planned series plots every dated plan row (${datedPlans.length})`, last === datedPlans.length, `series=${last} dated=${datedPlans.length}`);
  } else {
    if (!adapter) skipped('C1 planned series (no S-curve series in this dashboard)');
  }
  if (!adapter && gtAsOfYm && view.c3 && typeof view.c3.planCount === 'function') {
    const c3Plan = [...fullDisc].reduce((sum, discipline) => sum + view.c3.planCount('discipline', discipline, 'ALL'), 0);
    ok(`C3 All-months Total Plan counts dated plan rows up to ${gtAsOfYm} (${datedPlansAsOf.length})`,
      c3Plan === datedPlansAsOf.length, `c3=${c3Plan} dated=${datedPlansAsOf.length}`);
  } else {
    if (!adapter) skipped('C3 All-months Total Plan (no as-of month or no C3 view)');
  }

  // Submitted
  if (cfg.kpiSelectors?.submitted) {
    const domSub = await readKpi(cfg.kpiSelectors.submitted);
    ok(`KPI submitted: DOM ${domSub} = pipeline ${gt.submitted}`, domSub === gt.submitted, `DOM=${domSub} pipeline=${gt.submitted}`);
  } else skipped('KPI submitted (no selector configured)');

  // Overdue first
  if (cfg.kpiSelectors?.overdueFirst) {
    const domOv = await readKpi(cfg.kpiSelectors.overdueFirst);
    ok(`KPI overdueFirst: DOM ${domOv} = pipeline ${gt.overdueFirst}`, domOv === gt.overdueFirst, `DOM=${domOv} pipeline=${gt.overdueFirst}`);
  } else skipped('KPI overdueFirst (no selector configured)');

  // ── Filter round-trip ──
  // Apply a discipline filter via the real UI control, then verify the DOM count narrows
  if (cfg.filterRoundTrip?.apply) {
    const filteredGt = await cfg.filterRoundTrip.apply(page, { ...cfg, _adapter: adapter });
    if (filteredGt == null) skipped('configured filter (adapter supplied no case)');
    else {
      const domFiltered = await readKpi(cfg.kpiSelectors?.totalPlanned || '[data-kpi="totalPlanned"] .v, .kpi:first-child .v');
      ok(`configured filter: DOM ${domFiltered} = pipeline ${filteredGt}`, domFiltered === filteredGt, `DOM=${domFiltered} pipeline=${filteredGt}`);
    }
  } else if (cfg.filterRoundTrip?.type === 'select' && fullDisc.size > 1) {
    const firstDisc = [...fullDisc].find(discipline => {
      const candidate = deriveView(model, { ...state, disciplines: new Set([discipline]) }).kpis.totalPlanned;
      return candidate > 0 && candidate < gt.totalPlanned;
    }) || [...fullDisc][0];
    const filteredState = { ...state, disciplines: new Set([firstDisc]) };
    const filteredGt = deriveView(model, filteredState).kpis.totalPlanned;
    const filter = page.locator(cfg.filterRoundTrip.selector).first();
    await filter.selectOption(firstDisc);
    await page.waitForTimeout(150);
    const domFiltered = await readKpi(cfg.kpiSelectors?.totalPlanned || '[data-kpi="totalPlanned"] .v, .kpi:first-child .v');
    ok(`filter "${firstDisc}": DOM ${domFiltered} = pipeline ${filteredGt}`, domFiltered === filteredGt, `DOM=${domFiltered} pipeline=${filteredGt}`);
    await filter.selectOption('');
    await page.waitForTimeout(100);
  } else if (cfg.filterTriggerSelector && fullDisc.size > 1) {
    const firstDisc = [...fullDisc][0];
    const filteredState = { ...state, disciplines: new Set([firstDisc]) };
    const filteredView = deriveView(model, filteredState);
    const filteredGt = filteredView.kpis.totalPlanned;

    // Click the filter trigger
    await page.locator(cfg.filterTriggerSelector).first().click();
    // Deselect all then select only firstDisc
    const allCb = page.locator('.tf-all input[type=checkbox]').first();
    if (await allCb.isVisible().catch(() => false)) {
      const checked = await allCb.isChecked();
      if (checked) await allCb.click(); // deselect all
    }
    // Find and click the discipline chip
    const chip = page.locator(`.tf-item:has-text("${firstDisc}") input`).first();
    if (await chip.isVisible().catch(() => false)) {
      await chip.click();
      // Close the filter panel
      await page.keyboard.press('Escape');
      await page.waitForTimeout(300);

      const domFiltered = await readKpi(cfg.kpiSelectors?.totalPlanned || '[data-kpi="totalPlanned"] .v, .kpi:first-child .v');
      ok(`filter "${firstDisc}": DOM ${domFiltered} = pipeline ${filteredGt}`, domFiltered === filteredGt, `DOM=${domFiltered} pipeline=${filteredGt}`);
      // Restore "all disciplines". The round-trip above deliberately narrows the view, and the
      // 'select' branch above restores it with selectOption(''); this branch did not, so every later
      // check measured the FILTERED view — the status-bar total then failed against the unfiltered
      // gt.totalPlanned. Same rule as I-95: a check must restore the state it changed.
      await page.locator(cfg.filterTriggerSelector).first().click();
      const allCbRestore = page.locator('.tf-all input[type=checkbox]').first();
      if (await allCbRestore.isVisible().catch(() => false)) {
        if (!(await allCbRestore.isChecked())) await allCbRestore.click();
      }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(250);
    } else {
      skipped(`filter round-trip (chip for "${firstDisc}" not found)`);
    }
  } else {
    skipped('filter round-trip (no filterTriggerSelector or single discipline)');
  }

  // ── Validation panel issue count ──
  if (cfg.validationCountSelector) {
    if (cfg.validationPage) {
      await page.locator(`[data-page="${cfg.validationPage}"]`).first().click();
      await page.waitForTimeout(100);
    }
    const domIssues = await readKpi(cfg.validationCountSelector);
    ok(`validation issue count: DOM ${domIssues} = pipeline ${issueCount}`,
      domIssues === issueCount, `DOM=${domIssues} pipeline=${issueCount}`);
    if (cfg.validationPage) await page.locator('[data-page="Overview"]').first().click();
  } else skipped('validation issue count (no selector configured)');

  // ── Warning bar: W-FORMULA notices ──
  const wfWarnings = model.warnings.filter(w => w.code === 'W-FORMULA');
  if (wfWarnings.length > 0) {
    const bannerVisible = await page.evaluate(() => {
      const el = document.getElementById('errBanner');
      return el && !el.hidden && getComputedStyle(el).display !== 'none';
    });
    ok('errBanner visible when W-FORMULA warnings present (§3.5)', bannerVisible);
    const fatalStrips = await page.locator('.sys-banner-item.fatal').count();
    ok(`fatal banner strips = W-FORMULA count (${wfWarnings.length})`, fatalStrips >= wfWarnings.length, `DOM=${fatalStrips}`);
  } else {
    skipped('W-FORMULA banner check (no formula errors in workbook)');
    skipped('W-FORMULA banner strip count');
  }

  // ── Status bar content ──
  const sbText = await page.locator('.status-bar').textContent().catch(() => '');
  ok('status bar shows total count', sbText.replaceAll(',', '').includes(String(gt.totalPlanned)));
}

// ── Tier 4: layout geometry — I-90 grid foundation / I-89 executable sample ───
// Measures what Tier 1 cannot: the *rendered* metric of every table (row height,
// header height, fixed layout, colgroup vs rendered columns, cell truncation).
async function injectWorkbook(page, workbookPath, cfg = {}) {
  const bytes = Array.from(readFileSync(workbookPath));
  const companionPath = cfg.companionWorkbook;
  const companionBytes = companionPath && existsSync(companionPath) ? Array.from(readFileSync(companionPath)) : null;
  await page.evaluate(async ([b, name, otherBytes, otherName]) => {
    const file = new File([new Uint8Array(b).buffer], name, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const companion = otherBytes ? new File([new Uint8Array(otherBytes).buffer], otherName, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) : null;
    if (companion && typeof window._loadFiles === 'function') await window._loadFiles(file, companion);
    else if (typeof window._loadFile === 'function') await window._loadFile(file);
    else {
      const dt = new DataTransfer(); dt.items.add(file); if (companion) dt.items.add(companion);
      const drop = document.querySelector('.drop');
      if (drop) drop.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
    }
  }, [bytes, workbookPath.split(/[\\/]/).pop(), companionBytes, companionPath?.split(/[\\/]/).pop()]);
  await page.waitForSelector('.status-bar:not([hidden])', { timeout: 15000 }).catch(() => {});
}

async function measureTables(page, selector, limit) {
  return page.evaluate(([sel, lim]) => {
    const vis = el => !!(el && (el.offsetWidth || el.offsetHeight || el.getClientRects().length));
    const r2 = v => Math.round(v * 100) / 100;
    return Array.from(document.querySelectorAll(sel)).filter(vis).map((t, i) => {
      const cs = getComputedStyle(t);
      const allRows = Array.from(t.querySelectorAll('tbody tr'));
      // I-96: windowing adds spacer rows whose whole job is to carry the scroll height —
      // they are deliberately NOT 40 px, so they are reported separately, never measured.
      const padRows = allRows.filter(r => r.classList.contains('win-pad'));
      const dataRows = allRows.filter(r => !r.classList.contains('win-pad'));
      const head = t.querySelector('thead tr');
      const first = dataRows[0];
      // collapsed / not-yet-rendered rows measure 0 px — exclude them, but report the count
      const zeroRows = dataRows.filter(r => r.getBoundingClientRect().height === 0).length;
      const rows = dataRows.filter(r => r.getBoundingClientRect().height > 0).slice(0, lim);
      const heights = rows.map(r => r2(r.getBoundingClientRect().height));
      const td = first && first.querySelector('td,th');
      const tcs = td ? getComputedStyle(td) : null;
      return {
        i,
        label: (t.getAttribute('aria-label') || t.className || '').trim(),
        tableLayout: cs.tableLayout,
        colgroupCols: t.querySelectorAll('colgroup col').length,
        firstRowCells: first ? first.children.length : 0,
        // a grouped header uses colspan, so count the COLUMNS the row spans (not its raw cell count)
        theadCells: head ? [...head.children].reduce((n, c) => n + (Number(c.getAttribute('colspan')) || 1), 0) : 0,
        hasThead: !!head,
        headerH: head ? r2(head.getBoundingClientRect().height) : null,
        bodyRows: dataRows.length,
        padRows: padRows.length,
        padH: padRows.map(r => r2(r.getBoundingClientRect().height)),
        zeroRows,
        heights,
        tdH: tcs ? tcs.height : null,
        tdOverflow: tcs ? tcs.overflow : null,
        tdTextOverflow: tcs ? tcs.textOverflow : null,
        scrollOverflow: t.scrollWidth > t.clientWidth + 1,
        // A split pair's body half is inside .tableScroll; its header lives in the fragment.
        inSplitBody: !!t.closest('.tableScroll') && !!t.closest('.splitcard'),
      };
    });
  }, [selector, limit]);
}

// ── Tier 4c: table chrome (compulsory) ────────────────────────────────────────
// Two rules that a string search cannot prove, both of which fail the run:
//   1. every table panel title resolves to the SAME colour;
//   2. every table header is really sticky — computed style AND proven by scrolling.
async function lintTableChrome(page, cfg) {
  const ch = cfg.chrome || {};
  const titleSel = ch.titleSelector || '.panel-head h2';
  const probe = ch.scrollProbe ?? 240;     // px scrolled to prove the header sticks
  const tol = ch.tolerance ?? 2;           // px

  const titles = await page.evaluate(sel => [...document.querySelectorAll(sel)]
    .filter(e => e.offsetHeight)
    .map(e => {
      const cs = getComputedStyle(e);
      return { text: (e.textContent || '').trim().slice(0, 42), color: cs.color, size: cs.fontSize, weight: cs.fontWeight };
    }), titleSel);

  const tables = await page.evaluate(() => [...document.querySelectorAll('table.ds-table')]
    .filter(t => t.offsetHeight && t.querySelector('thead tr th')).length);

  console.log(`  INFO: ${titles.length} panel title(s) via "${titleSel}", ${tables} table(s) with a header`);
  if (!titles.length || !tables) {
    skipped('table title colour (no rendered table panel — needs the workbook)');
    skipped('sticky table headers (no rendered table panel — needs the workbook)');
    return;
  }

  // 1. title colour consistency — one colour for every table title
  const colors = [...new Set(titles.map(t => t.color))];
  ok(`table title colour: all ${titles.length} titles resolve to ONE colour`, colors.length === 1,
    colors.join(' | '));
  const opaque = colors.every(c => !/rgba\([^)]*,\s*0\)$/.test(c) && c !== 'transparent');
  ok('table title colour: the shared colour is opaque (not transparent)', opaque, colors.join(' | '));
  const sizes = [...new Set(titles.map(t => `${t.size}/${t.weight}`))];
  ok(`table title metrics: all ${titles.length} titles share one font size and weight`, sizes.length === 1,
    sizes.join(' | '));

  // 2. sticky headers — every table header row must stick, and a GROUPED (multi-row) header must
  //    STACK (row n at top = Σ heights of the rows above it) instead of all piling at top:0.
  //    A declared header fragment (MDL's `.vheadtab`) is a thead-only table that never scrolls: it is
  //    aligned in lock-step with the body beside it, so `sticky` is meaningless there — but that
  //    exception is VERIFIED (no scroller of its own + paired body), not assumed.
  const fragSel = ch.headerFragmentSelector || null;
  const heads = await page.evaluate(fsel => [...document.querySelectorAll('table.ds-table')]
    .filter(t => t.offsetHeight && t.querySelector('thead tr th'))
    .map((t, i) => {
      const sc = t.closest('.tableScroll');
      const rows = [...t.querySelectorAll('thead tr')];
      const rowInfo = rows.map(r => {
        const th = r.querySelector('th');
        const cs = getComputedStyle(th);
        // MDL I-116 — a PINNED cell inside a header fragment is sticky BY DESIGN (option i): it has to
        // stay put exactly as the pinned body cell below it does, which is the whole point of giving
        // the fragment its own scrollport. So the "a fragment is never sticky" rule is asserted against
        // the NON-PINNED cells, and pinned cells are separately asserted to BE sticky.
        const plain = [...r.children].find(c => c.tagName === 'TH' && !c.classList.contains('ds-pinned'));
        const pin = r.querySelector('th.ds-pinned');
        const rect = r.getBoundingClientRect();
        return { pos: cs.position,
                 plainPos: plain ? getComputedStyle(plain).position : cs.position,
                 pinPos: pin ? getComputedStyle(pin).position : null, top: cs.top, z: cs.zIndex,
                 bg: getComputedStyle(r.children[0]).backgroundColor,
                 h: Math.round(rect.height),
                 // pinned identity columns intentionally carry an opaque white background (I-95) — they
                 // are exempt from the band-colour uniformity rule, which targets *non-pinned* cells.
                 cells: [...r.children].filter(c => !c.classList.contains('ds-pinned'))
                   .map(c => getComputedStyle(c).backgroundColor) };
      });
      // MDL I-116 — a split-header fragment may sit inside its own clipped scrollport (.vheadwrap)
      // rather than directly in the card, so the pair is found through the ONE container the spec
      // requires (§7.2.15 invariant 1), not through the fragment's immediate parent. Same rule,
      // one level of indirection: the container must still hold both halves.
      const card = t.closest('.splitcard') || t.parentElement;
      const pairedBody = !!card && !!card.querySelector('.tableScroll table.ds-table tbody tr');
      return { i, label: (t.getAttribute('aria-label') || '').slice(0, 30), rows: rowInfo,
               hasScroller: !!sc, frag: !!(fsel && t.matches(fsel)), pairedBody,
               scrollable: !!sc && sc.scrollHeight > sc.clientHeight + 1,
               grouped: rows.length > 1 };
    }), fragSel);

  // multi-row (grouped) header rules are gated: they apply only where the dashboard's spec owns them
  // (MDL sets chrome.multiRow). Single-row tables are always checked for `top:0` + opaque + band colour.
  const multiRow = !!ch.multiRow;
  const opaqueBG = c => !/rgba\([^)]*,\s*0\)$/.test(c) && c !== 'transparent';
  heads.forEach(h => {
    if (h.frag) {                       // thead-only fragment: no scrolling of its own, must pair with a body
      // MDL I-116 — a non-pinned fragment cell must NOT be sticky, but a pinned one MUST be, so the
      // frozen header column travels with the frozen body column instead of sliding away from it.
      const bad = h.rows.some(r => r.plainPos === 'sticky')
        || h.rows.some(r => r.pinPos && r.pinPos !== 'sticky')
        || h.hasScroller || !h.pairedBody;
      ok(`sticky headers #${h.i}: declared header fragment is not sticky (pinned cells excepted), has no scroller, pairs with a body`,
        !bad, `plainPos=${h.rows.map(r => r.plainPos).join('/')} pinPos=${h.rows.map(r => r.pinPos || '-').join('/')} scroller=${h.hasScroller} paired=${h.pairedBody}`);
      return;
    }
    const stickyRows = h.rows.filter(r => r.pos === 'sticky');
    // §7.2.15 scopes the rule to BOUNDED tables (`.tableScroll`). A table that does not scroll has
    // no header drift to prevent, so `position:sticky` is not required there.
    if (!h.hasScroller) { skipped(`sticky headers #${h.i}: header sticky (table is not inside a .tableScroll)`); return; }
    ok(`sticky headers #${h.i}: every header row computes to position:sticky`,
      stickyRows.length === h.rows.length, h.rows.map(r => r.pos).join('/'));
    if (multiRow && h.rows.length > 1) {
      // grouped header: row 0 at top:0; row n at top = Σ heights of the rows above it (stack, no overlap)
      const stackOff = []; h.rows.reduce((a, r, ri) => (stackOff[ri] = a, a + r.h), 0);
      const bad = h.rows.filter((r, ri) => r.pos === 'sticky' && r.top !== stackOff[ri] + 'px')
        .map((r, ri) => `row${ri}:${r.top}`);
      ok(`sticky headers #${h.i}: ${h.rows.length} header rows STACK (row n at top:Σ rows above, not all at 0)`,
        bad.length === 0, bad.join(' '));
    } else {
      const noTop = stickyRows.filter(r => r.top !== '0px');
      ok(`sticky headers #${h.i}: header anchored at top:0`, noTop.length === 0, noTop.map(r => r.top).join(' '));
    }
    // opaque background on every sticky cell
    const transparent = stickyRows.filter(r => !opaqueBG(r.bg));
    ok(`sticky headers #${h.i}: header carries an opaque background (rows must not show through)`,
      transparent.length === 0, transparent.map(r => r.bg).slice(0, 3).join(', '));
    // 3. header band colour — every cell in one header row shares ONE background (pinned exempt); the
    //    group band and the leaf band must use the SAME palette (a per-column tint runs the full column).
    const badBands = h.rows.map((r, ri) => { const d = [...new Set(r.cells)]; return d.length > 1 ? `row${ri}:${d.join('|')}` : null; }).filter(Boolean);
    ok(`header band #${h.i}: every header row shares ONE colour (pinned cells exempt)`,
      badBands.length === 0, badBands.join(' '));
    const palettes = h.rows.map(r => [...new Set(r.cells)].sort().join('|'));
    ok(`header band #${h.i}: all header rows share the SAME palette`,
      new Set(palettes).size <= 1, palettes.join(' ≠ '));
    // 4. scrollbar gutter — only for grouped headers that live inside a scroller (split-header pattern)
    if (multiRow && h.grouped && h.hasScroller) {
      ok(`scrollbar gutter #${h.i}: a grouped header inside a scroller must use the split-header + --ds-sbw pattern (header outside the scroller)`,
        false, 'header is inside .tableScroll — the scrollbar runs alongside it, not under it');
    }
  });

  // scroll proof: every header row stays glued to the top of its scroller AND keeps its stacking order.
  // After scrolling, row ri must sit at scrollerTop + (its pre-scroll top − first row's pre-scroll top):
  // i.e. each band stays exactly where sticky pinned it, relative to the scroller.
  const proof = await page.evaluate(([p, fsel]) => [...document.querySelectorAll('table.ds-table')]
    .filter(t => t.offsetHeight && t.querySelector('thead tr th')
      && !(fsel && t.matches(fsel)) && !t.closest('.splitcard'))
    .map((t, i) => {
      const sc = t.closest('.tableScroll');
      if (!sc || sc.scrollHeight <= sc.clientHeight + 1) return { i, scrollable: false };
      const tops = () => [...t.querySelectorAll('thead tr')].map(r => +r.querySelector('th').getBoundingClientRect().top.toFixed(1));
      const before = tops();
      const scTopBefore = +sc.getBoundingClientRect().top.toFixed(1);
      sc.scrollTop = p;
      const after = tops();
      const scTopAfter = +sc.getBoundingClientRect().top.toFixed(1);
      const scrolled = sc.scrollTop;
      sc.scrollTop = 0;
      return { i, scrollable: true, before, after, scTopBefore, scTopAfter, scrolled };
    }), [probe, fragSel]);
  const scrollable = proof.filter(p => p.scrollable && p.scrolled > 10);
  if (!scrollable.length) skipped(`sticky headers: scroll proof (no scrollable table scroller)`);
  else scrollable.forEach(p => {
    if (multiRow && p.after.length > 1) {
      // sticky pins row 0 to the scroller top; row ri must keep its pre-scroll offset from row 0
      const okStack = p.after.every((top, ri) => Math.abs(top - (p.scTopAfter + (p.before[ri] - p.before[0]))) <= tol);
      ok(`sticky headers #${p.i}: all ${p.after.length} header rows stay stacked while scrolled ${p.scrolled}px`,
        okStack, `before=${p.before.join(',')} after=${p.after.join(',')} scTop=${p.scTopAfter}`);
    } else {
      const row0 = Math.abs(p.after[0] - p.scTopAfter) <= tol;
      ok(`sticky headers #${p.i}: header stays put while scrolled ${p.scrolled}px`,
        row0, `after=${p.after[0]} scTop=${p.scTopAfter}`);
    }
  });

  // 4b. split-header pairing rules (gated by chrome.splitHeader). A declared fragment is EXEMPT from the
  // sticky / band rules above, so the exemption must be paid for with equivalent invariants here —
  // without them a split header can drift completely unseen (MDL I-103: six visible defects, zero
  // harness failures). Every one of these maps to a defect that shipped.
  if (!ch.splitHeader) { skipped('split-header pairing rules (gap / corners / column rule / alignment / fit / lock-step) — not enabled for this dashboard'); }
  else {
    const pairs = await page.evaluate(fsel => [...document.querySelectorAll('table.ds-table')]
      .filter(t => t.offsetHeight && fsel && t.matches(fsel))
      .map((frag, i) => {
        const cs = el => getComputedStyle(el);
        const R = el => el.getBoundingClientRect();
        // MDL I-116 — the fragment may sit in its own clipped scrollport (.vheadwrap), so the ONE
        // container holding header + body is found by class, not by immediate parent. Same rule.
        const card = frag.closest('.splitcard') || frag.parentElement;
        const sc = card ? card.querySelector('.tableScroll') : null;
        const body = sc ? sc.querySelector('table.ds-table') : null;
        if (!sc || !body) return null;
        const leafRow = [...frag.querySelectorAll('thead tr')].pop();   // the row that LABELS the data
        const leafCells = leafRow ? [...leafRow.children] : [];
        // Pair on DATA columns only: the trailing .ds-gut gutter is a spacer that reserves the
        // scrollbar, not a column, and it has no body counterpart — including it mis-pairs it with the
        // body's last cell and reports a bogus mismatch.
        const dataCells = leafCells.filter(c => !c.classList.contains('ds-gut') && R(c).width > 0);
        // MDL I-116 — a windowed table (I-96) opens with spacer rows, and a spacer carries no data
        // cells: pairing header cells against one is meaningless (it reported a 1142 px misalignment
        // that did not exist). Take the first row that actually carries data.
        const bodyRow = [...body.querySelectorAll('tbody tr')].find(r => !r.classList.contains('win-pad'))
          || body.querySelector('tbody tr');
        const bodyCells = [...(bodyRow || { children: [] }).children];
        // Pair each header cell with the body cell whose left edge is NEAREST. A grouped header with
        // rowspan cells has different child indices from the body row it labels, so index pairing
        // would compare the wrong cells (this is exactly how I-103 defect 4 slipped through).
        let maxDelta = 0; const mism = [];
        dataCells.forEach(hc => {
          const hr = R(hc); if (!hr.width) return;
          let best = null, bestD = Infinity;
          bodyCells.forEach(bc => { const d = Math.abs(R(bc).left - hr.left); if (d < bestD) { bestD = d; best = bc; } });
          if (!best) return;
          maxDelta = Math.max(maxDelta, bestD);
          const ha = cs(hc).textAlign, ba = cs(best).textAlign;
          if (ha !== ba) mism.push(`[${(hc.textContent || '').trim().slice(0, 12)}]:head=${ha}/body=${ba}`);
        });
        const ruleCell = leafCells.find(c => !c.hasAttribute('colspan') && !c.classList.contains('ds-gut')) || leafCells[0];
        // NB: cs() takes one arg — the pseudo-element must be passed to getComputedStyle directly,
        // otherwise the call silently returns the CELL's own style and the check can never fail.
        const ra = ruleCell ? getComputedStyle(ruleCell, '::after') : null;
        return {
          i, label: (frag.id || frag.className || '').slice(0, 28),
          gap: +(R(sc).top - R(frag).bottom).toFixed(2),
          scrollerMarginTop: cs(sc).marginTop,
          cardRadius: card ? cs(card).borderTopLeftRadius : null,
          scrollerRadius: cs(sc).borderTopLeftRadius,
          scrollerBorderW: cs(sc).borderTopWidth,
          fragW: +R(frag).width.toFixed(1), scW: +R(sc).width.toFixed(1), bodyW: +R(body).width.toFixed(1),
          sbw: +Math.max(0, sc.offsetWidth - sc.clientWidth).toFixed(1),
          // the column rule is a positioned ::after — it only paints while the th is a containing block
          rule: ra ? { content: ra.content, position: ra.position, width: ra.width } : null,
          thPosition: ruleCell ? cs(ruleCell).position : null,
          maxDelta: +maxDelta.toFixed(2), mism,
          overW: sc.scrollWidth - sc.clientWidth,
        };
      }).filter(Boolean), fragSel);

    pairs.forEach(p => {
      ok(`split-header #${p.i} [${p.label}]: header sits flush against its body (no gap)`,
        Math.abs(p.gap) <= 1, `gap=${p.gap}px scrollerMarginTop=${p.scrollerMarginTop}`);
      ok(`split-header #${p.i} [${p.label}]: one rounded container — card has radius, inner scroller none`,
        p.cardRadius !== '0px' && p.scrollerRadius === '0px' && p.scrollerMarginTop === '0px' && p.scrollerBorderW === '0px',
        `card=${p.cardRadius} scroller=${p.scrollerRadius}/${p.scrollerBorderW}/${p.scrollerMarginTop}`);
      // The rule only PAINTS IN THE RIGHT PLACE while the cell is a containing block. The ::after keeps
      // its own `position:absolute` even when the cell goes static, so testing the pseudo alone can
      // never fail — the cell's own position must be checked too.
      ok(`split-header #${p.i} [${p.label}]: column rule paints in place (cell is a containing block, ::after is a 1px absolute rule)`,
        p.thPosition !== 'static' && !!p.rule && p.rule.content !== 'none'
          && p.rule.position === 'absolute' && parseFloat(p.rule.width) <= 2,
        `th=${p.thPosition} ::after=${p.rule ? p.rule.position + '/' + p.rule.width : 'none'}`);
      ok(`split-header #${p.i} [${p.label}]: header alignment matches its data column (paired by position)`,
        p.mism.length === 0, p.mism.join(' '));
      ok(`split-header #${p.i} [${p.label}]: header columns align with body columns`,
        p.maxDelta <= 2, `maxDelta=${p.maxDelta}px`);
      ok(`split-header #${p.i} [${p.label}]: header width equals its body's width plus the scrollbar gutter`,
        Math.abs(p.fragW - p.scW) <= 2 && Math.abs(p.fragW - (p.bodyW + p.sbw)) <= 2,
        `head=${p.fragW} scroller=${p.scW} body=${p.bodyW}+sbw=${p.sbw}`);
      ok(`split-header #${p.i} [${p.label}]: columns fit the display area (no horizontal overflow)`,
        p.overW <= 1, `overflow=${p.overW}px`);
    });

    // horizontal lock-step: scroll the body and prove the header moves with it
    const lock = await page.evaluate(async fsel => {
      const out = [];
      for (const frag of [...document.querySelectorAll('table.ds-table')].filter(t => t.offsetHeight && t.matches(fsel))) {
        // MDL I-116 — same one-container lookup as the pairing block above.
        const lockCard = frag.closest('.splitcard') || frag.parentElement;
        const sc = lockCard && lockCard.querySelector('.tableScroll');
        const leaf = [...frag.querySelectorAll('thead tr')].pop();
        if (!sc || !leaf) continue;
        const cells = [...leaf.children];
        // MDL I-116 — measure a NON-PINNED cell for the "moves with the body" claim and a PINNED one
        // for the opposite claim. Measuring the first cell of a pinned pair would test the wrong thing:
        // that cell is meant to stay put.
        const plain = cells.find(c => c.tagName === 'TH' && !c.classList.contains('ds-pinned'));
        const pin = cells.find(c => c.tagName === 'TH' && c.classList.contains('ds-pinned'));
        // Force horizontal overflow so the lock-step is EXERCISED rather than skipped. A pair that
        // happens to fit proves nothing about the case the design exists for: frozen columns on a
        // table that scrolls sideways. Narrowing the SCROLLER (not the table) is what makes this real —
        // the pair's own ResizeObserver re-syncs, exactly as it would on a genuine narrow viewport.
        const forced = sc.scrollWidth - sc.clientWidth <= 1;
        const oldW = sc.style.width;
        // Narrow the BODY scroller AND the header's own scrollport by the same amount. Narrowing only
        // the body leaves the header port wider than its content, so the header has nothing to scroll
        // and the proof silently measures zero movement.
        const port = frag.parentElement && frag.parentElement.classList.contains('vheadwrap') ? frag.parentElement : null;
        const oldPW = port ? port.style.width : '';
        if (forced) {
          const w = Math.max(240, sc.clientWidth - 400) + 'px';
          sc.style.width = w;
          if (port) port.style.width = w;
          await new Promise(r => setTimeout(r, 80));      // let the pair's ResizeObserver re-sync
        }
        const max = sc.scrollWidth - sc.clientWidth;
        const p0 = plain ? plain.getBoundingClientRect().left : null;
        const k0 = pin ? pin.getBoundingClientRect().left : null;
        sc.scrollLeft = max;
        await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
        // Re-query both halves AFTER the scroll. A windowed table re-renders its rows while scrolling,
        // so a body cell captured beforehand is detached by now and would measure 0 — which reads as a
        // false 192 px misalignment rather than the re-render it actually is.
        const liveLeaf = [...frag.querySelectorAll('thead tr')].pop();
        const livePin = liveLeaf ? [...liveLeaf.children].find(c => c.tagName === 'TH' && c.classList.contains('ds-pinned')) : null;
        const liveBody = sc.querySelector('table');
        const bPin = livePin && liveBody ? liveBody.querySelector('tbody tr:not(.win-pad) td.ds-pinned') : null;
        const moved = p0 === null ? null : +(p0 - plain.getBoundingClientRect().left).toFixed(1);
        const pinMoved = k0 === null || !livePin ? null : +(k0 - livePin.getBoundingClientRect().left).toFixed(1);
        const pinGap = (bPin && livePin) ? +Math.abs(livePin.getBoundingClientRect().left - bPin.getBoundingClientRect().left).toFixed(1) : null;
        const scrolled = sc.scrollLeft;
        sc.scrollLeft = 0;
        if (forced) { sc.style.width = oldW; if (port) port.style.width = oldPW; await new Promise(r => setTimeout(r, 80)); }
        out.push({ i: [...document.querySelectorAll(fsel)].indexOf(frag), max, forced,
                   moved, pinMoved, pinGap, scrolled });
      }
      return out;
    }, fragSel);
    lock.forEach(l => {
      if (l.max <= 1) { skipped(`split-header #${l.i}: header follows horizontal scroll — body does not scroll sideways`); return; }
      const tag = l.forced ? ' (overflow forced — the pair fitted at this width)' : '';
      if (l.moved !== null) ok(`split-header #${l.i}: header follows the body's horizontal scroll${tag}`,
        Math.abs(l.moved - l.scrolled) <= 2, `bodyScrolled=${l.scrolled}px headerMoved=${l.moved}px`);
      // MDL I-116 — the frozen header cell must NOT travel, and must stay welded to the frozen body
      // cell below it. That is the entire point of option (i): one mechanism in both halves.
      if (l.pinMoved !== null) {
        ok(`split-header #${l.i}: frozen header column stays put while the body scrolls${tag}`,
          Math.abs(l.pinMoved) <= 1, `pinMoved=${l.pinMoved}px`);
        ok(`split-header #${l.i}: frozen header stays aligned with its frozen body column${tag}`,
          l.pinGap !== null && l.pinGap <= 1, `gap=${l.pinGap}px`);
      }
    });
  }

  // 5. layout rules — alignment, sort affordance, column sizing (gated by chrome.layout; MDL owns these)
  const layout = !!ch.layout;
  if (!layout) { skipped('table layout rules (alignment / sort glyph / sizing) — not enabled for this dashboard'); return; }
  const colMin = ch.colMinWidth ?? 60;
  const lay = await page.evaluate(fragSelector => [...document.querySelectorAll('table.ds-table')]
    .filter(t => t.offsetHeight && t.querySelector('thead tr th') && !(fragSelector && t.matches(fragSelector)))
    .map((t, i) => {
      const sc = t.closest('.tableScroll');
      const head = t.querySelector('thead tr');
      const headCells = head ? [...head.children] : [];
      const bodyFirst = t.querySelector('tbody tr:not(.win-pad)');
      const bodyCells = bodyFirst ? [...bodyFirst.children] : [];
      const n = Math.min(headCells.length, bodyCells.length);
      const alignPairs = [];
      for (let j = 0; j < n; j++) {
        const hc = headCells[j], bc = bodyCells[j];
        if (hc && bc) alignPairs.push({ j, l: (hc.textContent || '').trim().slice(0, 16), h: getComputedStyle(hc).textAlign, b: getComputedStyle(bc).textAlign });
      }
      const sortInds = [...t.querySelectorAll('thead th .sort-ind')].map(ind => {
        const th = ind.closest('th');
        const ir = ind.getBoundingClientRect(), tr = th.getBoundingClientRect();
        const padR = parseFloat(getComputedStyle(th).paddingRight) || 0;
        return Math.abs(ir.right - (tr.right - padR)); // 0 ⇒ indicator pinned to the trailing edge
      });
      const nonPinnedBody = bodyCells.filter(c => !c.classList.contains('ds-pinned')).slice(0, 4);
      const trunc = nonPinnedBody.map(c => { const cs = getComputedStyle(c); return cs.overflow.includes('hidden') && cs.textOverflow === 'ellipsis'; });
      const cols = [...t.querySelectorAll('colgroup col')];
      const colW = cols.map(c => parseFloat(c.style.width) || 0);
      const colRendered = cols.map(c => Math.round(c.getBoundingClientRect().width));
      const sr = sc ? sc.getBoundingClientRect() : null;
      return {
        i, label: (t.getAttribute('aria-label') || t.className || '').slice(0, 30),
        headVAlign: headCells.map(c => getComputedStyle(c).verticalAlign),
        alignPairs, sortInds, trunc,
        colW, colRendered, colCount: cols.length,
        tableW: Math.round(t.getBoundingClientRect().width),
        hasScroller: !!sc,
        scrollW: sc ? sc.scrollWidth : null, clientW: sc ? sc.clientWidth : null,
        scrollerW: sr ? Math.round(sr.width) : null,
      };
    }), fragSel);

  lay.forEach(t => {
    // A. header vertical alignment must be middle
    const vaBad = [...new Set(t.headVAlign)].filter(v => v !== 'middle');
    ok(`layout #${t.i}: every header cell vertical-aligns middle`, vaBad.length === 0, `distinct=${vaBad.join(',') || 'middle'}`);
    // B. header alignment must match its body column (per data type)
    const aBad = t.alignPairs.filter(p => p.h !== p.b).map(p => `col${p.j}[${p.l}]:head=${p.h}/body=${p.b}`);
    ok(`layout #${t.i}: header alignment matches body column alignment (${t.alignPairs.length} columns)`, aBad.length === 0, aBad.join(' '));
    // C. sort indicator pinned to the trailing edge of the header
    if (t.sortInds.length) {
      const cBad = t.sortInds.map(g => g.toFixed(0)).filter(g => +g > 2);
      ok(`layout #${t.i}: every sort indicator sits at the header's trailing edge (${t.sortInds.length} sortable)`,
        cBad.length === 0, `gaps(px)=${cBad.join(',')}`);
    }
    // D. every column meets the minimum width
    const dBad = t.colW.filter(w => w < colMin);
    ok(`layout #${t.i}: every column width ≥ ${colMin}px`, dBad.length === 0, `below=${dBad.length}`);
    // E. non-pinned body cells truncate (overflow:hidden + ellipsis) instead of wrapping the row
    if (t.trunc.length) {
      const eBad = t.trunc.filter(Boolean).length;
      ok(`layout #${t.i}: non-pinned cells truncate (overflow:hidden + ellipsis)`, eBad === t.trunc.length,
        `ellipsis=${eBad}/${t.trunc.length}`);
    }
  });

  // F/G. fit policy + proportional distribution — only for tables inside a scroll container
  lay.filter(t => t.hasScroller).forEach(t => {
    const overflowing = t.scrollW > t.clientW + 1;
    if (overflowing) {
      ok(`layout #${t.i}: horizontal scrollbar present when table wider than display area`,
        t.scrollW > t.clientW, `scrollW=${t.scrollW} clientW=${t.clientW}`);
    } else {
      ok(`layout #${t.i}: table fills the display area when it fits`, Math.abs(t.tableW - t.scrollerW) <= 2,
        `tableW=${t.tableW} scrollerW=${t.scrollerW}`);
      // G. columns scale proportionally to declared widths (no collapsed / dominant column)
      const sumDecl = t.colW.reduce((a, b) => a + b, 0);
      if (sumDecl > 0 && t.colRendered.length) {
        const ratios = t.colW.map((d, j) => (d > 0 ? t.colRendered[j] / d : null)).filter(v => v != null);
        const spread = ratios.length ? Math.max(...ratios) - Math.min(...ratios) : 0;
        ok(`layout #${t.i}: columns scale proportionally to declared widths (even fit)`, spread <= 0.05,
          `spread=${spread.toFixed(3)}`);
      }
    }
  });
}

function lintGeometry(report, tag, exp, tol, strict = true) {
  // strict=false → findings are advisory (WARN): used for archived review artefacts
  const verdict = (name, cond, detail = '') => (strict ? ok : warn)(name, cond, detail);
  if (!report.length) { verdict(`${tag}: at least one rendered table measured`, false, 'no visible tables found'); return; }
  const all = [];
  for (const m of report) {
    const lbl = `${tag} table#${m.i}${m.label ? ' [' + m.label.slice(0, 42) + ']' : ''}`;
    verdict(`${lbl}: table-layout:fixed (I-90 RC-1)`, m.tableLayout === 'fixed', m.tableLayout);
    // a fragment table pairs a thead-only table with a body-only table, so accept either count
    const colsOk = m.colgroupCols > 0 && (m.colgroupCols === m.firstRowCells || m.colgroupCols === m.theadCells);
    verdict(`${lbl}: <colgroup> cols = rendered columns`, colsOk,
      `colgroup=${m.colgroupCols} bodyCells=${m.firstRowCells} theadCells=${m.theadCells}`);
    if (m.hasThead && !m.inSplitBody) verdict(`${lbl}: header height = ${exp.head}px`, Math.abs(m.headerH - exp.head) <= tol, `${m.headerH}px`);
    else skipped(`${lbl}: header height (${m.inSplitBody ? 'body half of a split pair' : 'no <thead> — body fragment'})`);
    if (m.heights.length) {
      const spread = Math.max(...m.heights) - Math.min(...m.heights);
      verdict(`${lbl}: row heights uniform (${m.heights.length}/${m.bodyRows} rows, ${m.zeroRows} collapsed)`,
        spread <= tol, `spread=${spread.toFixed(2)}px`);
      const off = [...new Set(m.heights.filter(h => Math.abs(h - exp.row) > tol))];
      verdict(`${lbl}: every row = ${exp.row}px`, off.length === 0, `offending heights: ${off.slice(0, 5).join(', ')}`);
      all.push(...m.heights);
    } else skipped(`${lbl}: row heights (no rendered <tbody> rows)`);
    if (m.tdOverflow !== null) verdict(`${lbl}: cell truncation (ellipsis/hidden)`,
      m.tdTextOverflow === 'ellipsis' || m.tdOverflow === 'hidden',
      `overflow=${m.tdOverflow} text-overflow=${m.tdTextOverflow}`);
    else skipped(`${lbl}: cell truncation (no body cell — header fragment)`);
    // I-96: a windowed table must carry exactly two spacer rows, each an exact multiple of the row height
    if (m.padRows) {
      const mult = m.padH.every(h => Math.abs(h / exp.row - Math.round(h / exp.row)) <= 0.01);
      verdict(`${lbl}: windowed — 2 spacer rows, heights are row-height multiples (I-96)`,
        m.padRows === 2 && mult, `pads=${m.padRows} heights=${m.padH.join(',')}`);
    } else skipped(`${lbl}: windowing (below the 500-row threshold — whole body rendered)`);
  }
  if (all.length) {
    const spread = Math.max(...all) - Math.min(...all);
    verdict(`${tag}: ONE row metric across all tables (I-90 core)`, spread <= tol,
      `spread=${spread.toFixed(2)}px across ${all.length} rows`);
  }
}

// ── Tier 4b: L3 capabilities (I-95 pinned / chooser / resize, I-96 windowing) ──
// Interacts with the real page: sticky cells, a chooser that really hides a column,
// a drag that really writes a width, and a windowed table that still reports the full count.
async function lintL3(page, cfg = {}) {
  await page.evaluate(() => document.querySelectorAll('details').forEach(item => { item.open = true; }));
  const probe = () => page.evaluate(() => {
    const tables = Array.from(document.querySelectorAll('table.ds-table')).filter(t => t.offsetHeight);
    return tables.map(t => {
      const cells = Array.from(t.querySelectorAll('thead th, tbody tr:not(.win-pad) td'))
        .filter(c => c.classList.contains('ds-pinned'));
      const pin = cells.slice(0, 2).map(c => {
        const cs = getComputedStyle(c);
        return { pos: cs.position, left: cs.left, bg: cs.backgroundColor, z: cs.zIndex };
      });
      return {
        pinnedCount: cells.length,
        cols: cells.slice(0, 2).map(c => c.getAttribute('data-col') || c.textContent.trim().slice(0, 10)),
        pin,
        edge: t.querySelectorAll('.ds-pinned-edge').length,
        grips: t.querySelectorAll('.ds-resize').length,
      };
    });
  });

  const rep = await probe();
  const windowed = rep.length;
  // 1. pinned columns (I-95) — sticky, anchored, opaque
  // Grid tables (the ones carrying resize grips) are the tables expected to pin two columns. Header
  // fragments, the matrix and the plain summary tables pin nothing by design, so the expectation is
  // derived from that set instead of a hard-coded table count (which breaks when a table is split).
  const gripped = rep.filter(r => r.grips > 0);
  const sticky = gripped.filter(r => r.pin.length === 2 && r.pin.every(p => p.pos === 'sticky'));
  const minGridTables = cfg.chrome?.minGridTables ?? 2;
  ok('I-95: every grid table (with resize grips) pins two columns with position:sticky (D38)',
    gripped.length >= minGridTables && sticky.length === gripped.length,
    `${sticky.length}/${gripped.length} grid tables (${rep.length} tables total)`);
  const opaque = rep.every(r => r.pin.every(p => p.bg !== 'rgba(0, 0, 0, 0)' && p.bg !== 'transparent'));
  ok('I-95: pinned cells carry an OPAQUE background (no bleed-through)', opaque,
    rep.flatMap(r => r.pin.map(p => p.bg)).slice(0, 4).join(' | '));
  const anchored = rep.every(r => !r.pin.length || (r.pin[0].left === '0px' && parseFloat(r.pin[1].left) > 0));
  ok('I-95: pinned column 1 at left:0, column 2 offset by the first column width', anchored,
    rep.filter(r => r.pin.length).flatMap(r => r.cols.map((k, i) => `${k}=${r.pin[i].left}`)).slice(0, 4).join(' | '));
  ok('I-95: resize grips present on every table header (D36)',
    rep.filter(r => r.grips > 0).length >= minGridTables, `grips per table: ${rep.map(r => r.grips).join(',')}`);

  // 2. column chooser (I-95) — clicking it must really remove a column
  for (const key of ['subdoc', 'issue']) {
    const btn = page.locator(`#ccBtn_${key}`);
    if (!(await btn.count())) { skipped(`I-95: chooser for ${key} (button not found)`); continue; }
    // the validation panel pairs a thead-only fragment with a body-only table, so pick the one with rows
    const pickTable = k => {
      const b = document.getElementById('ccBtn_' + k);
      const all = [...(b.closest('.panel') || document.body).querySelectorAll('table.ds-table')];
      return all.find(x => x.querySelector('tbody tr')) || all[0];
    };
    // I-116 — with a split header the three things live in TWO tables: the header cells are in the
    // thead-only fragment and the data cells in the body-only table, and the fragment additionally
    // carries a .ds-gut gutter column that is not a data column and must never be counted. Counting
    // the gutter, and reading data cells from the fragment (which has no tbody), is what reported
    // "cols 9→8, th 8→7, body cells 0" for a column that had in fact been removed correctly.
    const snap = k => page.evaluate(kk => {
      const b = document.getElementById('ccBtn_' + kk);
      const all = [...(b.closest('.panel') || document.body).querySelectorAll('table.ds-table')];
      const head = all.find(x => x.querySelectorAll('thead th[data-col]').length > 1);
      const card = head && head.closest('.splitcard');
      // the body half is the table with rows INSIDE the same container — not merely the first table
      // with rows in the panel, which for this panel would be a different pair (the Rule Reference).
      const body = (card && [...card.querySelectorAll('table.ds-table')].find(x => x.querySelector('tbody tr')))
        || (head && head.querySelector('tbody tr') ? head : null);
      const t = body || head || all[0];
      const dataCols = x => [...x.querySelectorAll('colgroup col')].filter(c => !c.classList.contains('ds-gut')).length;
      const row = t.querySelector('tbody tr:not(.win-pad)');
      return { cols: dataCols(t), th: head ? head.querySelectorAll('thead th[data-col]').length : 0,
               body: row ? [...row.children].filter(c => !c.classList.contains('ds-gut')).length : 0 };
    }, k);
    const before = await snap(key);
    // the fixed status bar / error banner overlay the header, so drive the popover in-page
    const n = await page.evaluate(k => {
      document.getElementById('ccBtn_' + k).click();
      return document.querySelectorAll(`#ccPanel_${k} .cc-row input:not([disabled]), #ccPanel_${k} input[data-column-choice]:not([disabled])`).length;
    }, key);
    ok(`I-95: ${key} chooser opens and offers columns (${n} selectable)`, n > 0);
    // §7.1 master scope — the pinned identity columns are permanently checked and disabled, and the
    // master covers only the non-pinned rows. Row class names are not the contract (MDL uses
    // `.cc-row`, SUB uses `.cc-item` plus `data-column-choice`), so this reads the checkbox state.
    const masterState = await page.evaluate(k => {
      const panel = document.getElementById('ccPanel_' + k);
      if (!panel) return null;
      const box = panel.querySelector('input[data-column-all], .cc-all input[type=checkbox]');
      const locked = [...panel.querySelectorAll('input[type=checkbox][disabled]')];
      return { master: Boolean(box), locked: locked.length, lockedChecked: locked.filter(input => input.checked).length };
    }, key);
    ok(`I-95: ${key} chooser has a master and keeps every pinned column checked`,
      Boolean(masterState && masterState.master && masterState.locked === masterState.lockedChecked),
      JSON.stringify(masterState));
    const choiceIndex = await page.evaluate(k => {
      const choices = [...document.querySelectorAll(`#ccPanel_${k} .cc-row input:not([disabled]), #ccPanel_${k} input[data-column-choice]:not([disabled])`)];
      const index = choices.findIndex(input => input.checked);
      if (index >= 0) choices[index].click();
      return index;
    }, key);
    const after = await snap(key);
    ok(`I-95: ${key} chooser hides one column — colgroup, header and body all shrink together`,
      after.cols === before.cols - 1 && after.th === before.th - 1 && after.body === after.cols,
      `cols ${before.cols}→${after.cols}, th ${before.th}→${after.th}, body cells ${after.body}`);
    ok(`I-95: ${key} chooser persists the choice (D40)`,
      await page.evaluate(([k,prefix]) => !!localStorage.getItem(prefix + k + '_cols'), [key, cfg.storagePrefix || 'mdl_']));
    await page.evaluate(([k,index]) => {
      const b = document.querySelectorAll(`#ccPanel_${k} .cc-row input:not([disabled]), #ccPanel_${k} input[data-column-choice]:not([disabled])`)[index];
      if (b) b.click();                                   // restore the column
      document.getElementById('ccBtn_' + k).click();      // close the popover
    }, [key, choiceIndex]);
  }

  // 3. column resize (I-95) — a real drag must change the column and persist the width
  if (await page.locator('table.ds-table .ds-resize').count()) {
    // MDL I-116 — test EVERY table that carries grips, not just the first one on the page. Resizing is
    // wired per table, and with a split header the grip lives in the HEADER FRAGMENT while the width
    // must also reach the body's colgroup: a conversion that broke one table but not another would
    // have gone unseen by a single-grip test (Document Detail's grip was never dragged at all).
    const gripTables = await page.evaluate(() => [...document.querySelectorAll('table.ds-table')]
      .map((t, i) => ({ i, n: t.querySelectorAll('.ds-resize').length })).filter(x => x.n > 0).map(x => x.i));
    const colW = idx => page.evaluate(([i,prefix]) => {
      const t = document.querySelectorAll('table.ds-table')[i];
      // Measure the column the first grip actually resizes (its data-col), not blindly col[0]: the
      // standardized .drill-cell (first column) carries no grip, so col[0] is not the resized column.
      const grip = t.querySelector('.ds-resize');
      const dc = grip ? (grip.getAttribute('data-col') || '0') : '0';
      const pick = x => x.querySelector(`colgroup col[data-col="${dc}"]`)
        || x.querySelectorAll('colgroup col')[Number(dc)];
      const card = t.closest('.splitcard');
      const partner = card ? [...card.querySelectorAll('table.ds-table')]
        .find(x => x !== t && x.querySelector('tbody tr')) : null;
      const col = pick(t), pcol = partner ? pick(partner) : null;
      const tk = t.dataset.tableKey || '';
      return { w: col ? col.getBoundingClientRect().width : 0,
               partner: pcol ? pcol.getBoundingClientRect().width : null,
               stored: tk ? localStorage.getItem(prefix + tk + '_widths') : null };
    }, [idx, cfg.storagePrefix || 'mdl_']);
    const drag = (idx, by) => page.evaluate(([i, d]) => {
      const g = document.querySelectorAll('table.ds-table')[i].querySelector('.ds-resize');
      const r = g.getBoundingClientRect();
      const x = r.x + r.width / 2, y = r.y + r.height / 2;
      // synthetic pointer drag: the grip sits under the fixed header, which Playwright cannot reach
      const opt = cx => ({ clientX: cx, clientY: y, bubbles: true, cancelable: true, pointerId: 1 });
      g.dispatchEvent(new PointerEvent('pointerdown', opt(x)));
      document.dispatchEvent(new PointerEvent('pointermove', opt(x + d)));
      document.dispatchEvent(new PointerEvent('pointerup', opt(x + d)));
    }, [idx, by]);
    for (let ti = 0; ti < gripTables.length; ti++) {
      const idx = gripTables[ti];
      await page.waitForTimeout(600); // let the table layout settle before measuring (avoids transient-width drift)
      const before = await colW(idx);
      await drag(idx, 90);
      await page.waitForTimeout(150);
      const after = await colW(idx);
      ok(`I-95: table #${idx} — dragging a grip widens the column`, after.w > before.w + 40,
        `${before.w.toFixed(0)}px → ${after.w.toFixed(0)}px`);
      // the whole point of the split-header wiring: ONE write must reach BOTH halves.
      if (after.partner !== null) ok(`I-95: table #${idx} — the width reaches the body half too (one write, both colgroups)`,
        Math.abs(after.partner - after.w) <= 1, `fragment=${after.w.toFixed(0)}px body=${after.partner.toFixed(0)}px`);
      if (ti === 0) ok('I-95: the new width is persisted (D40)', !!after.stored && after.stored !== '{}', String(after.stored).slice(0, 60));
      // MDL I-116 — put the column back where it was. The drag above deliberately widens a column, and
      // the split-header "must fit" rule (§7.2.15 invariant 5) governs the SHIPPED DEFAULTS: the fit
      // pass deliberately does not shrink a width the user chose. Leaving the widened state in place
      // made the later fit check measure this test's own handiwork — an 89 px overflow against the
      // 90 px drag, in a table that fits exactly when measured on its own. A check must restore the
      // state it changed, or every check after it is measuring something else.
      await drag(idx, -90);
      await page.waitForTimeout(150);
      const restored = await colW(idx);
      ok(`I-95: table #${idx} — the resize test restores the width it changed`,
        Math.abs(restored.w - before.w) <= 2, `${before.w.toFixed(0)}px → ${restored.w.toFixed(0)}px`);
    }
    // leave storage as we found it: these drags write width prefs no later check should inherit
    await page.evaluate(() => Object.keys(localStorage).filter(k => /_widths$/.test(k)).forEach(k => localStorage.removeItem(k)));
  } else skipped('I-95: column resize (no grip found)');

  // 4. windowing (I-96) — few rows drawn, full count reported, scroll height preserved.
  // I-112 (2026-11-04) makes pagination take precedence over windowing for large tables, so a
  // large control-row count alone is NOT a valid trigger. Require a real windowed table with
  // spacer rows. Without this gate the old fallback selected an arbitrary .ds-table (often a
  // header fragment with no tbody) and asserted windowing on a paginated view: 0 rows drawn.
  const win = await page.evaluate(() => {
    const t = [...document.querySelectorAll('table.ds-table')].find(x => x.querySelector('tr.win-pad'));
    if (!t) return { windowed: false };
    const pick = id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const m = el.textContent.match(/([\d,]+)\s+of\s+([\d,]+)/) || el.textContent.match(/([\d,]+)/);
      return m ? { shown: +m[1].replace(/,/g, ''), total: m[2] ? +m[2].replace(/,/g, '') : +m[1].replace(/,/g, '') } : null;
    };
    return {
      windowed: true,
      drawn: t.querySelectorAll('tbody tr:not(.win-pad)').length,
      pads: t.querySelectorAll('tbody tr.win-pad').length,
      scrollH: t.closest('.tableScroll')?.scrollHeight || 0,
      cnt: pick('dCnt'), vcnt: pick('vCnt'),
    };
  });
  const winCount = win.vcnt || win.cnt;
  if (!win.windowed) {
    skipped('I-96: windowing (no windowed table on this view)');
  } else if (winCount?.total > 500) {
    ok('I-96: a windowed table draws far fewer rows than it has', win.drawn > 0 && win.drawn < 200, `${win.drawn} rows drawn`);
    ok('I-96: spacer rows present (scroll height preserved)', win.pads === 2);
    ok('I-96: the control row still reports the FULL count (§4.3 contract)', !!(winCount && winCount.total > win.drawn), JSON.stringify(winCount));
    ok('I-96: scroll height ≈ full list × row height', win.scrollH > win.drawn * 40 * 10, `${win.scrollH}px for ${JSON.stringify(winCount)}`);
  } else skipped('I-96: windowing (filtered row count is 500 or less)');
}

// ── Tier 4d: control text contrast (spec §5.1 / §A1) ────────────────────────────
// Every visible control must have readable text against its own background. This guards the
// regression where a borderless override (`.app-menu .btn{background:transparent}`) clobbered
// `.btn-primary`, leaving the primary CTA white-on-white (MDL I-105).
async function lintControlContrast(page, cfg) {
  console.log('\n── Tier 4d: control text contrast (§5.1 / §A1) ─────────────');
  const mode = cfg.chrome && cfg.chrome.controlContrast;
  if (!mode) { skipped('control text contrast (not configured)'); return; }

  // Scans every control that is actually laid out and records two defect kinds:
  //  - 'contrast' : text vs effective background ratio < 3:1 (white-on-white, white-on-transparent, …)
  //  - 'no-title': control has no accessible name (textContent / aria-label / title) — a faceless button
  // Collapsible controls (Search panel, filter-chip dropdowns, the pressed warning-toggle) are opened
  // *inside* this single evaluate so a later async re-render can never close them before measurement.
  const scan = (forceWarnPressed) => page.evaluate((forceWarnPressed) => {
    const sp = document.querySelector('#searchPanel'); const spWas = sp && sp.classList.contains('open'); if (sp && !spWas) sp.classList.add('open');
    const chips = [...document.querySelectorAll('.tf-btn')].slice(0, 4);
    const chipStates = chips.map(c => { const p = document.getElementById(c.getAttribute('aria-controls')); const was = p && !p.hasAttribute('hidden'); if (p && !was) p.removeAttribute('hidden'); return { p, was }; });
    const wb = document.getElementById('warnBtn'); const wbWas = wb && wb.getAttribute('aria-pressed');
    if (wb && forceWarnPressed && wbWas !== 'true') wb.setAttribute('aria-pressed', 'true');

    const parseC = s => { const m = s.match(/rgba?\(([^)]+)\)/); if (!m) return null; const q = m[1].split(',').map(parseFloat); return { r: q[0], g: q[1], b: q[2], a: q[3] === undefined ? 1 : q[3] }; };
    const lum = c => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); };
    const ratio = (a, b) => { const L1 = lum(a), L2 = lum(b), hi = Math.max(L1, L2), lo = Math.min(L1, L2); return (hi + 0.05) / (lo + 0.05); };
    const bgOf = el => { let n = el; while (n) { const c = parseC(getComputedStyle(n).backgroundColor); if (c && c.a > 0.05) return c; n = n.parentElement; } return { r: 255, g: 255, b: 255, a: 1 }; };
    const out = [];
    for (const el of document.querySelectorAll('button, .btn, .tf-btn, .chip, .warn-toggle')) {
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) continue; // not laid out (collapsed container we couldn't open) — skip, don't penalise
      const label = ((el.textContent || '').replace(/\s+/g, ' ').trim()) || el.getAttribute('aria-label') || el.getAttribute('title') || '';
      if (!label) out.push({ reason: 'no-title', tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 40), text: '(none)', color: cs.color, bg: cs.backgroundColor, ratio: 0 });
      const fg = parseC(cs.color); if (!fg) continue;
      const bg = bgOf(el);
      const r = ratio(fg, bg);
      if (r < 3.0) out.push({ reason: 'contrast', tag: el.tagName.toLowerCase(), cls: (el.className || '').toString().slice(0, 40), text: label.slice(0, 24), color: cs.color, bg: `rgb(${bg.r}, ${bg.g}, ${bg.b})`, ratio: +r.toFixed(2) });
    }

    if (sp && !spWas) sp.classList.remove('open');
    chipStates.forEach(({ p, was }) => { if (p && !was) p.setAttribute('hidden', ''); });
    if (wb && forceWarnPressed && wbWas !== 'true') wb.setAttribute('aria-pressed', wbWas || 'false');
    return out;
  }, forceWarnPressed);

  const offenders = (await scan(false)).concat(await scan(true));
  const detail = offenders.length ? ' — ' + JSON.stringify(offenders.slice(0, 10)) : '';
  const name = 'every visible control is rendered, labelled, and has readable text (contrast ≥ 3:1)';
  if (mode === 'advisory') warn(name, offenders.length === 0, detail);
  else ok(name, offenders.length === 0, detail);
}

// ── Tier 4e: warning button title is stable (spec §7.1 / I-107) ─────────────────
// The Warnings toggle must always read "Warnings" with the count in its badge; it must NOT invert to
// "Show warnings" / "Hide warnings" when the bar is collapsed/expanded (that was the reported defect).
async function lintWarnButtonTitle(page, cfg) {
  console.log('\n── Tier 4e: warning button title stable (§7.1 / I-107) ────────');
  const mode = cfg.chrome && (cfg.chrome.controlContrast === true || cfg.chrome.controlContrast === 'advisory');
  if (!mode) { skipped('warning button title stability (controlContrast not configured)'); return; }

  const hasWarn = await page.locator('#warnBtn').count();
  if (!hasWarn) { skipped('warning button title stability (no #warnBtn)'); return; }

  const read = () => page.evaluate(() => {
    const b = document.getElementById('warnBtn'); if (!b) return null;
    return { lab: (b.textContent || '').replace(/\s+/g, ' ').trim(), al: b.getAttribute('aria-label') || '', pressed: b.getAttribute('aria-pressed') };
  });

  const before = await read();
  await page.evaluate(() => { const b = document.getElementById('warnBtn'); if (b) b.click(); }).catch(() => {});
  await page.waitForTimeout(100);
  const after = await read();
  await page.evaluate(() => { const b = document.getElementById('warnBtn'); if (b) b.click(); }).catch(() => {});

  const stable = !!(before && after && before.lab === after.lab
    && /warnings/i.test(before.lab)
    && !/show warning|hide warning/i.test(before.lab)
    && !/show warning|hide warning/i.test(after.al));
  const detail = ` before=${JSON.stringify(before)} after=${JSON.stringify(after)}`;
  if (mode === 'advisory') warn('warning button title is stable ("Warnings", not "Show/Hide warnings")', stable, detail);
  else ok('warning button title is stable ("Warnings", not "Show/Hide warnings")', stable, detail);
}

// ── Tier 4f: search popover single-row + elongated field (spec §3.1) ───────────
// The Search dialog must lay out its controls (column selector, search input, Find, Reset) on ONE row,
// with a generously wide search field — not stacked rows. Measured by force-opening the panel *inside*
// one evaluate so an async re-render cannot close it before measurement.
async function lintSearchPanel(page, cfg) {
  console.log('\n── Tier 4f: search popover one-row + long field (§3.1) ───────');
  const mode = cfg.chrome && (cfg.chrome.controlContrast === true || cfg.chrome.controlContrast === 'advisory');
  if (!mode) { skipped('search popover layout (controlContrast not configured)'); return; }
  const hasPanel = await page.locator('#searchPanel').count();
  if (!hasPanel) { skipped('search popover layout (no #searchPanel)'); return; }

  const layout = await page.evaluate(() => {
    const p = document.getElementById('searchPanel'); if (!p) return null;
    const wasOpen = p.classList.contains('open');
    p.classList.add('open');
    const ids = ['fCol', 'fSearch', 'fGo', 'fReset'];
    const els = ids.map(id => document.getElementById(id)).filter(Boolean).map(el => {
      const r = el.getBoundingClientRect();
      return { id: el.id, top: Math.round(r.top), width: Math.round(r.width), left: Math.round(r.left) };
    });
    p.classList.remove('open');
    if (wasOpen) p.classList.add('open');
    return els;
  });

  const tops = layout.map(e => e.top);
  const sameRow = layout.length >= 4 && tops.every(t => Math.abs(t - tops[0]) <= 4);
  const search = layout.find(e => e.id === 'fSearch');
  const longEnough = !!search && search.width >= 200;
  const pass = sameRow && longEnough;
  const name = 'search popover: controls on one row with elongated search field (≥200px)';
  const detail = ` layout=${JSON.stringify(layout)}`;
  if (mode === 'advisory') warn(name, pass, detail);
  else ok(name, pass, detail);
}

// ── Tier 4g: matrix header column rules on EVERY cell (spec §7.2.2 / I-108) ──────
// The Discipline Summary Matrix must paint a column dividing line (the th::after rule) on EVERY header
// cell — the grouped (first) row AND the final data column included. The gutter is exempt. This catches
// the regression where those rules were suppressed (colspan / last-child) leaving blank header groups.
async function lintMatrixHeaderRules(page, cfg) {
  console.log('\n── Tier 4g: matrix header column rules (§7.2.2) ────────────');
  const mode = cfg.chrome && (cfg.chrome.controlContrast === true || cfg.chrome.controlContrast === 'advisory');
  if (!mode) { skipped('matrix header column rules (controlContrast not configured)'); return; }
  const hasMatrix = await page.locator('#matrixHead').count();
  if (!hasMatrix) { skipped('matrix header column rules (no #matrixHead)'); return; }

  const cells = await page.evaluate(() => {
    const out = [];
    for (const th of document.querySelectorAll('#matrixHead thead th')) {
      const cs = getComputedStyle(th), a = getComputedStyle(th, '::after'), r = th.getBoundingClientRect();
      out.push({
        txt: (th.textContent || '').trim().slice(0, 18),
        gutter: th.classList.contains('ds-gut'),
        thPos: cs.position,
        afterDisp: a.display, afterPos: a.position,
        afterW: Math.round(parseFloat(a.width) * 100) / 100,
        afterBg: a.backgroundColor,
        w: Math.round(r.width), h: Math.round(r.height),
      });
    }
    return out;
  });

  const failures = [];
  for (const c of cells) {
    if (c.gutter || (c.w === 0 && c.h === 0)) continue; // gutter / not laid out → exempt
    const okRule = c.afterDisp !== 'none' && c.afterPos === 'absolute'
      && c.afterW >= 0.5 && c.afterW <= 3 && c.thPos !== 'static'
      && !/rgba\([^)]*,\s*0\)|transparent/.test(c.afterBg);
    if (!okRule) failures.push(c);
  }
  const name = 'Discipline Summary Matrix: every header cell paints its column dividing line';
  const detail = failures.length ? ' — missing: ' + JSON.stringify(failures) : '';
  if (mode === 'advisory') warn(name, failures.length === 0, detail);
  else ok(name, failures.length === 0, detail);
}

async function runTier4(page, cfg, workbookPath) {
  console.log('\n── Tier 4: layout geometry (I-90 / I-89) ──────────────────');
  const g = cfg.geometry || {};
  const sel = g.tableSelector || 'table.ds-table';
  const tol = g.tolerance ?? 0.5;
  const exp = { row: g.expectedRowH ?? 40, head: g.expectedHeadH ?? 40 };
  const limit = g.sampleRowLimit ?? 12;

  // I-89 — the executable sample is static: measure it directly
  if (cfg.samplePath && existsSync(cfg.samplePath)) {
    await page.goto(pathToFileURL(cfg.samplePath).href);
    await page.waitForTimeout(250);
    const rep = await measureTables(page, sel, limit);
    console.log(`  INFO: I-89 sample — ${rep.length} visible table(s) — advisory only (archived review artefact)`);
    lintGeometry(rep, `I-89 sample`, exp, tol, false);
  } else skipped('I-89 sample geometry (no samplePath configured)');

  // I-90 — the live dashboard, measured with the real workbook loaded
  const live = !!(cfg.pipelinePath && existsSync(workbookPath) && (!cfg.companionWorkbook || existsSync(cfg.companionWorkbook)));
  if (!live) {
    skipped('I-90 live geometry (workbook or pipelinePath missing)');
  } else {
    for (const layoutPage of cfg.layoutPages || [null]) {
      await page.goto(dashboardUrl(cfg));
      if (cfg.storagePrefix) {
        await page.evaluate(prefix => Object.keys(localStorage).filter(key => key.startsWith(prefix)).forEach(key => localStorage.removeItem(key)), cfg.storagePrefix);
        await page.reload();
      }
      await injectWorkbook(page, workbookPath, cfg);
      if (layoutPage) await page.locator(`[data-page="${layoutPage}"]`).first().click();
      await page.evaluate(() => document.querySelectorAll('details').forEach(item => { item.open = true; }));
      await page.waitForTimeout(100);
      await lintControlContrast(page, cfg);
      await lintWarnButtonTitle(page, cfg);
      await lintSearchPanel(page, cfg);
      await lintMatrixHeaderRules(page, cfg);
      const rep = await measureTables(page, sel, limit);
      console.log(`  INFO: I-90 live (${layoutPage || 'default'}) — ${rep.length} visible table(s) of ${await page.locator(sel).count()} in DOM`);
      lintGeometry(rep, `I-90 live ${layoutPage || ''}`, exp, tol);
      console.log('\n── Tier 4b: L3 capabilities (I-95 / I-96) ──────────────────');
      await lintL3(page, cfg);
    }
  }

  // Tier 4c — table chrome. Compulsory: runs whenever a page is loaded at all. Without a pipeline
  // module (PPP, I-76) the workbook can still be handed to the page by file drop, so the panels
  // render and the chrome rules are actually enforced instead of skipped.
  if (!live) {
    await page.goto(dashboardUrl(cfg));
    if (existsSync(workbookPath)) await injectWorkbook(page, workbookPath, cfg).catch(() => {});
    await lintControlContrast(page, cfg);
    await lintWarnButtonTitle(page, cfg);
    await lintSearchPanel(page, cfg);
    await lintMatrixHeaderRules(page, cfg);
  } else if (cfg.layoutPages?.length) {
    await page.goto(dashboardUrl(cfg));
    await injectWorkbook(page, workbookPath, cfg);
    await page.locator(`[data-page="${cfg.layoutPages.at(-1)}"]`).first().click();
  }
  console.log('\n── Tier 4c: table chrome (compulsory) ───────────────────────');
  await lintTableChrome(page, cfg);
}

// ── Tier 5: C1 attached-table geometry (spec §4.2 rev 1.62 / 1.64 / §8.2 assertion 21) ──
// The four owner-reported details are measured in the browser, not inferred from the
// markup: (1) each bar lies wholly inside its month column and data-points.cx maps to
// the month-header centres, at the default period AND after the From / To sliders move;
// (2) the legend is a child of the SVG and, for an attached-table panel, sits ABOVE the
// first horizontal grid line; (3) a vertical Y-axis line spans the plot at its left edge
// and the Y caption is rotated in grid column 1; (4) the table header row is flush with
// the plot's X axis (the last grid line) and the SVG draws no separate X labels. Owner
// decisions 2026-11-06 omit the as-of subtitle and forbid horizontal scrolling; decision
// 1 is superseded for attached-table panels so the plot bottom can touch the <thead>.
async function measureC1Geometry(page, c) {
  return page.evaluate(cfg => {
    const board = document.querySelector(cfg.boardSelector);
    if (!board) return { missing: true };
    const grid = board.querySelector(cfg.gridSelector);
    const plot = board.querySelector(cfg.plotSelector);
    const svg = plot && plot.querySelector('svg');
    const table = board.querySelector(cfg.tableSelector);
    if (!grid || !plot || !svg || !table) return { missing: true };
    const R = el => {
      const r = el.getBoundingClientRect();
      return {
        l: r.left, t: r.top, r: r.right, b: r.bottom, w: r.width, h: r.height,
        cx: (r.left + r.right) / 2, cy: (r.top + r.bottom) / 2
      };
    };
    const svgBox = R(svg), plotBox = R(plot);
    const heads = [...table.querySelectorAll(cfg.monthHeadSelector)].map(R);
    const corner = table.querySelector(cfg.cornerHeadSelector);
    const headRow = table.querySelector('thead tr');
    const cols = table.querySelectorAll(cfg.colSelector).length;
    const barEls = [...svg.querySelectorAll(cfg.barSelector)];
    const dots = [...svg.querySelectorAll(cfg.dotSelector)].map(R);
    const gridLines = [...svg.querySelectorAll(cfg.gridLineSelector)].map(R);
    const yAxis = grid.querySelector(cfg.yAxisSelector);
    const yTicks = yAxis ? yAxis.querySelectorAll(cfg.yTickSelector).length : 0;
    const yCap = yAxis && yAxis.querySelector(cfg.yCaptionSelector);
    const yCapCs = yCap ? getComputedStyle(yCap) : null;
    const yCapBox = yCap ? R(yCap) : null;
    const legend = svg.querySelector(cfg.legendSelector);
    const legendBox = legend ? R(legend) : null;
    const axisLine = document.querySelector(cfg.axisLineSelector);
    const axisBox = axisLine ? R(axisLine) : null;
    const htmlLegend = document.querySelectorAll(cfg.htmlLegendSelector).length;
    const svgXLabels = svg.querySelectorAll(cfg.svgXLabelSelector).length;
    const gridCs = getComputedStyle(grid);
    const tracks = (gridCs.gridTemplateColumns || '').trim().split(/\s+/).map(parseFloat).filter(Number.isFinite);
    // preserveAspectRatio="xMidYMid meet" can letterbox the viewBox. Derive the real
    // scale and the X offset before comparing SVG units with CSS pixels.
    const vb = svg.viewBox && svg.viewBox.baseVal;
    const scale = vb && vb.width ? Math.min(svgBox.w / vb.width, svgBox.h / vb.height) : 1;
    const offX = vb ? svgBox.l + (svgBox.w - vb.width * scale) / 2 : svgBox.l;
    let pts = [];
    try { pts = JSON.parse((board.getAttribute('data-points') || '[]').replace(/&#39;/g, "'")); } catch (_) {}
    // §4.2 rev 1.64 — the ONE C1 metadata payload is the source of truth for Y ticks.
    // Read it together with the rendered labels and the grid-line Y coordinates (SVG units).
    let c1meta = {};
    try { c1meta = JSON.parse((board.getAttribute('data-c1meta') || '{}').replace(/&#39;/g, "'")); } catch (_) {}
    // §4.2 rev 1.65 — the windowed peak and the absolute cumulative values come from the SAME
    // data-points payload; the enabled series and Bars toggle come from the one metadata object.
    const axisVis = Array.isArray(c1meta.vis) ? c1meta.vis : [];
    const axisBars = c1meta.bars !== false;
    const axisKeys = [];
    if (axisVis.includes('plan')) axisKeys.push('pCum', ...(axisBars ? ['pNew'] : []));
    if (axisVis.includes('forecast')) axisKeys.push('fCum', ...(axisBars ? ['fNew'] : []));
    if (axisVis.includes('actualFirst')) axisKeys.push('aFCum', ...(axisBars ? ['aFNew'] : []));
    if (axisVis.includes('actualResub')) axisKeys.push('aRCum', ...(axisBars ? ['aRNew'] : []));
    const windowPeak = pts.reduce((m, p) => Math.max(m, ...axisKeys.map(k => Number(p[k]) || 0)), 0);
    const cumByLabel = {};
    pts.forEach(p => { cumByLabel[p.label] = ['pCum', 'fCum', 'aFCum', 'aRCum'].map(k => Number(p[k]) || 0); });
    const tickLabels = (yAxis ? [...yAxis.querySelectorAll(cfg.yTickSelector)] : [])
      .map(el => Number(String(el.textContent || '').replace(/,/g, '')))
      .filter(Number.isFinite).sort((a, b) => a - b);
    const gridYUnits = [...svg.querySelectorAll(cfg.gridLineSelector)]
      .map(el => Number(el.getAttribute('y1'))).filter(Number.isFinite).sort((a, b) => a - b);
    const minGridSpacing = gridYUnits.length > 1
      ? Math.min(...gridYUnits.slice(1).map((y, i) => y - gridYUnits[i])) : 0;
    // §4.2 rev 1.65 — acceptance: chart grid lines, HTML axis labels and the hover / refit
    // geometry (data-geo.yTop / yBot) must all represent the SAME Y-axis scale after a period
    // change. PNG/Copy serialise those same .c1-ytick labels, so they follow the same scale.
    let geo = {};
    try { geo = JSON.parse((board.getAttribute('data-geo') || '{}').replace(/&#39;/g, "'")); } catch (_) {}
    const geoTop = Number(geo.yTop), geoBot = Number(geo.yBot), metaMax = Number(c1meta.yMax);
    const gridScaleMaxDelta = (() => {
      if (!(geoBot > geoTop) || !(metaMax > 0) || gridYUnits.length !== tickLabels.length || !gridYUnits.length) return Infinity;
      const expected = tickLabels.map(v => geoBot - (v / metaMax) * (geoBot - geoTop)).sort((a, b) => a - b);
      return Math.max(...expected.map((y, i) => Math.abs(y - gridYUnits[i])));
    })();
    const tol = cfg.alignTolerance;
    const nearest = x => heads.reduce(
      (best, h, i) => Math.abs(h.cx - x) < best.d ? { i, d: Math.abs(h.cx - x) } : best,
      { i: -1, d: Infinity }
    );
    const pointDelta = pts.map((p, i) => heads[i]
      ? Math.abs(offX + Number(p.cx) * scale - heads[i].cx) : Infinity).filter(Number.isFinite);
    const bandW = vb && pts.length ? vb.width / pts.length : 0;
    let barOutside = 0, barWrongColumn = 0;
    barEls.forEach(el => {
      const b = R(el);
      const hit = heads.findIndex(h => b.l >= h.l - tol && b.r <= h.r + tol);
      // The bar's x attribute is in SVG user units. Match it to the month whose
      // data-points.cx it belongs to, then require the rendered box in that SAME
      // column. Containment alone would pass when a stretched SVG shifts the bar
      // into a neighbouring column.
      const ux = parseFloat(el.getAttribute('x')) + parseFloat(el.getAttribute('width')) / 2;
      const idx = bandW > 0 ? pts.findIndex(p => Math.abs(Number(p.cx) - ux) <= bandW / 2 + 1) : -1;
      if (hit < 0 || idx < 0) barOutside++;
      else if (idx !== hit) barWrongColumn++;
    });
    let dotOutside = 0, dotMaxDelta = 0;
    dots.forEach(d => {
      const n = nearest(d.cx);
      if (n.i < 0 || n.d > tol + 2) dotOutside++;
      if (Number.isFinite(n.d)) dotMaxDelta = Math.max(dotMaxDelta, n.d);
    });
    const trackDeltas = heads.map((h, i) => tracks[i + 1] != null ? Math.abs(tracks[i + 1] - h.w) : Infinity);
    if (corner && tracks[0] != null) trackDeltas.push(Math.abs(tracks[0] - R(corner).w));
    const firstGridY = gridLines.length ? Math.min(...gridLines.map(g => g.cy)) : null;
    const lastGridY = gridLines.length ? Math.max(...gridLines.map(g => g.cy)) : null;
    return {
      missing: false,
      pointCount: pts.length, headCount: heads.length, colCount: cols,
      bars: barEls.length, dots: dots.length, gridLines: gridLines.length, yTicks,
      c1meta: {
        yMax: Number(c1meta.yMax) || null,
        yStep: Number(c1meta.yStep) || null,
        yIntervals: Number(c1meta.yIntervals) || null
      },
      tickLabels, minGridSpacing, gridScaleMaxDelta, windowPeak, cumByLabel,
      pointMaxDelta: pointDelta.length ? Math.max(...pointDelta) : Infinity,
      barOutside, barWrongColumn, dotOutside, dotMaxDelta,
      diag: {
        vbW: vb ? vb.width : null, vbH: vb ? vb.height : null,
        svgW: +svgBox.w.toFixed(1), svgH: +svgBox.h.toFixed(1),
        scale: +scale.toFixed(4), inset: +(offX - svgBox.l).toFixed(1),
        svgLeft: +svgBox.l.toFixed(1), plotLeft: +plotBox.l.toFixed(1),
        point0: pts[0] ? Number(pts[0].cx) : null,
        head0: heads[0] ? +heads[0].cx.toFixed(1) : null
      },
      trackMaxDelta: trackDeltas.length ? Math.max(...trackDeltas) : Infinity,
      tracks: tracks.length, tracksExpected: heads.length + 1,
      legendInsideSvg: !!(legend && svg.contains(legend)),
      legendBelowPlot: !!(legendBox && lastGridY != null && legendBox.t >= lastGridY - tol),
      legendAbovePlot: !!(legendBox && firstGridY != null && legendBox.b <= firstGridY + tol),
      legendWithinSvg: !!(legendBox && legendBox.b <= svgBox.b + tol && legendBox.l >= svgBox.l - tol && legendBox.r <= svgBox.r + tol),
      htmlLegend, svgXLabels,
      axisLinePresent: !!axisLine,
      axisVertical: !!(axisBox && axisBox.w <= 2 && axisBox.h > 0),
      axisAtPlotLeft: !!(axisBox && Math.abs(axisBox.l - svgBox.l) <= tol + 2),
      axisSpansPlot: !!(axisBox && lastGridY != null && firstGridY != null && axisBox.h >= (lastGridY - firstGridY) * 0.9),
      yCapPresent: !!yCap,
      yCapRotated: !!(yCapCs && (/vertical/.test(yCapCs.writingMode) || /rotate/.test(yCapCs.transform || ''))),
      yCapInColumn1: !!(yCapBox && yCapBox.l < plotBox.l),
      // §4.2 rev 1.62 — adjacency is measured against the plot's X axis (last grid line),
      // not the SVG box bottom, so a bottom legend band cannot masquerade as a flush join.
      headTopDelta: headRow && lastGridY != null ? Math.abs(R(headRow).t - lastGridY) : Infinity,
      rowGap: parseFloat(gridCs.rowGap) || 0, columnGap: parseFloat(gridCs.columnGap) || 0,
      noHScroll: grid.getBoundingClientRect().width > 0 && grid.scrollWidth <= grid.clientWidth + tol
    };
  }, c);
}

// A repaint rewrites data-points and the viewBox together. Wait until they agree so a
// pending ResizeObserver callback cannot be measured halfway through a refit.
async function waitForC1Stable(page) {
  await page.waitForTimeout(150);
  await page.waitForFunction(() => {
    const b = document.querySelector('.scurve.sc-board');
    const s = b && b.querySelector('svg');
    if (!b || !s || !s.viewBox || !s.viewBox.baseVal) return false;
    return Math.abs(Number(b.getAttribute('data-c1w') || 0) - s.viewBox.baseVal.width) < 2;
  }, null, { timeout: 4000 }).catch(() => {});
}

// Move the From / To range sliders to a different period window. The C1 change handler
// reads both inputs on every change event and repaints, so N changes and both the curve
// payload and the table columns must be rebuilt from the same period count.
async function c1ChangePeriod(page, c) {
  const from = page.locator(c.periodFromSelector), to = page.locator(c.periodToSelector);
  if (!(await from.count()) || !(await to.count())) return null;
  const max = Number(await to.getAttribute('max'));
  const f0 = Number(await from.inputValue()), t0 = Number(await to.inputValue());
  if (!(Number.isFinite(max) && max > 0) || !Number.isFinite(f0) || !Number.isFinite(t0)) return null;
  let f = f0, t = t0;
  if (t0 - f0 >= 2) { f = f0 + 1; t = t0 - 1; }
  else if (t0 < max) t = Math.min(max, t0 + 1);
  else f = Math.max(0, f0 - 1);
  if (f === f0 && t === t0) return null;
  await from.evaluate((el, v) => { el.value = String(v); el.dispatchEvent(new Event('change', { bubbles: true })); }, f);
  await page.waitForTimeout(200);
  await to.evaluate((el, v) => { el.value = String(v); el.dispatchEvent(new Event('change', { bubbles: true })); }, t);
  await waitForC1Stable(page);
  return { f: f0, t: t0 };
}

async function c1RestorePeriod(page, c, original) {
  await page.evaluate(cfg => {
    const a = document.querySelector(cfg.fromSelector), b = document.querySelector(cfg.toSelector);
    if (!a || !b) return;
    a.value = String(cfg.f); b.value = String(cfg.t);
    a.dispatchEvent(new Event('change', { bubbles: true }));
  }, { fromSelector: c.periodFromSelector, toSelector: c.periodToSelector, f: original.f, t: original.t });
  await waitForC1Stable(page);
}

// §4.2 rev 1.64 — the four dynamic-tick assertions are shared so they can be re-run after a
// period change (rev 1.65). `tag` only labels the verdict in the harness output.
function assertC1Axis(g, c, tag) {
  const mt = g.c1meta || {}, labels = g.tickLabels || [];
  const maxI = c.maxTickIntervals ?? 7, minS = c.minTickSpacing ?? 40, maxL = c.maxTickLabels ?? 8;
  const spacingTol = c.tickSpacingTolerance ?? 1;
  ok(`C1 Y ticks are generated from the one chart metadata payload (rev 1.64, ${tag})`,
    mt.yMax > 0 && mt.yStep > 0 && mt.yIntervals >= 1 &&
    labels.length === mt.yIntervals + 1 && g.gridLines === labels.length && g.yTicks === labels.length,
    `yMax=${mt.yMax} step=${mt.yStep} intervals=${mt.yIntervals} labels=${labels.length} gridLines=${g.gridLines} yTicks=${g.yTicks}`);
  ok(`C1 Y ticks respect the 7-interval / 8-label cap (${tag})`,
    mt.yIntervals >= 1 && mt.yIntervals <= maxI && labels.length >= 2 && labels.length <= maxL,
    `intervals=${mt.yIntervals} labels=${labels.length} maxIntervals=${maxI} maxLabels=${maxL}`);
  ok(`C1 major ticks are at least ~40 units apart (${tag})`,
    g.minGridSpacing >= minS - spacingTol,
    `minSpacing=${g.minGridSpacing} min=${minS}`);
  ok(`C1 tick labels are nice-number multiples of yStep with a round top (${tag})`,
    labels.length === mt.yIntervals + 1 && labels.every((v, i) => Math.abs(v - i * mt.yStep) < 1) &&
    Math.abs(mt.yStep * mt.yIntervals - mt.yMax) < 1 &&
    Math.abs(labels[labels.length - 1] - mt.yMax) < 1,
    `labels=${labels.join('/')} step=${mt.yStep} yMax=${mt.yMax}`);
}

// §4.2 rev 1.65 / I119 — pick a SHORTER period window from the DATA, not a fixed fraction.
// The candidate index must be in range, leave at least minAxisProbePoints months, have a
// materially lower peak than the full window AND yield a different nice-number axis. Otherwise
// return a skip reason; an unsuitable dataset must never fail the harness.
async function c1PickAxisProbe(page, c) {
  return page.evaluate(cfg => {
    const board = document.querySelector(cfg.boardSelector);
    const fromEl = document.querySelector(cfg.fromSelector), toEl = document.querySelector(cfg.toSelector);
    if (!board || !fromEl || !toEl) return { skip: 'C1 board or period sliders unavailable' };
    let pts = [], meta = {};
    try { pts = JSON.parse((board.getAttribute('data-points') || '[]').replace(/&#39;/g, "'")); } catch (_) {}
    try { meta = JSON.parse((board.getAttribute('data-c1meta') || '{}').replace(/&#39;/g, "'")); } catch (_) {}
    if (meta.grain !== 'month') return { skip: 'probe requires month grain' };
    const vis = Array.isArray(meta.vis) ? meta.vis : [], bars = meta.bars !== false, keys = [];
    if (vis.includes('plan')) keys.push('pCum', ...(bars ? ['pNew'] : []));
    if (vis.includes('forecast')) keys.push('fCum', ...(bars ? ['fNew'] : []));
    if (vis.includes('actualFirst')) keys.push('aFCum', ...(bars ? ['aFNew'] : []));
    if (vis.includes('actualResub')) keys.push('aRCum', ...(bars ? ['aRNew'] : []));
    const minPoints = cfg.minAxisProbePoints ?? 3;
    const maxI = Math.max(1, Math.min(cfg.maxTickIntervals ?? 7, Math.floor(300 / (cfg.minTickSpacing ?? 40))));
    // Local copy of the standard nice-number rule, used only to check that the probe would
    // actually change the axis. It is not a second source of truth for the dashboard.
    const niceMax = M => {
      const m = Math.max(1, M), pow = 10 ** Math.floor(Math.log10(m / maxI));
      let step = m, n = 1;
      outer: for (let k = 0; k < 16; k++) {
        const base = pow * 10 ** k;
        for (const mult of [1, 2, 2.5, 5]) {
          const s = Math.max(1, mult * base), q = Math.ceil(m / s - 1e-9);
          if (q >= 1 && q <= maxI) { step = s; n = q; break outer; }
        }
      }
      return step * n;
    };
    const peaks = [];
    let running = 0;
    pts.forEach(p => { running = Math.max(running, ...keys.map(k => Number(p[k]) || 0)); peaks.push(running); });
    const fullPeak = peaks[peaks.length - 1] || 0, fullAxis = niceMax(fullPeak);
    const f = Number(fromEl.value), t = Number(toEl.value), maxTo = Number(toEl.max);
    if (!Number.isFinite(f) || !Number.isFinite(t) || !Number.isFinite(maxTo)) return { skip: 'period range values not finite' };
    if (pts.length < minPoints || !(fullPeak > 0)) return { skip: `dataset too short or no positive peak (points=${pts.length}, peak=${fullPeak})` };
    const threshold = fullPeak * (cfg.axisPeakDropRatio ?? 0.9);
    const guess = Math.max(minPoints - 1, Math.min(pts.length - 1, Math.floor((pts.length - 1) * (cfg.axisWindowProbeFraction ?? 0.33))));
    const usable = i => {
      const peak = peaks[i], to = f + i;
      return i >= minPoints - 1 && i < pts.length && peak > 0 && peak <= threshold &&
        to >= f && to <= maxTo && to <= t && niceMax(peak) < fullAxis;
    };
    let idx = -1;
    for (let i = guess; i >= minPoints - 1; i--) if (usable(i)) { idx = i; break; }
    if (idx < 0) for (let i = guess + 1; i < pts.length; i++) if (usable(i)) { idx = i; break; }
    if (idx < 0) return { skip: `no shorter window with a meaningfully lower peak (points=${pts.length}, fullPeak=${fullPeak}, fullAxis=${fullAxis})` };
    return { f, t, to: f + idx, idx, fullPeak, probePeak: peaks[idx], fullAxis, probeAxis: niceMax(peaks[idx]) };
  }, {
    boardSelector: c.boardSelector, fromSelector: c.periodFromSelector, toSelector: c.periodToSelector,
    axisWindowProbeFraction: c.axisWindowProbeFraction, axisPeakDropRatio: c.axisPeakDropRatio,
    minAxisProbePoints: c.minAxisProbePoints, maxTickIntervals: c.maxTickIntervals,
    minTickSpacing: c.minTickSpacing
  });
}

async function c1ApplyAxisWindow(page, c, value) {
  await page.evaluate(({ sel, v }) => {
    const el = document.querySelector(sel);
    if (el) { el.value = String(v); el.dispatchEvent(new Event('change', { bubbles: true })); }
  }, { sel: c.periodToSelector, v: value });
  await waitForC1Stable(page);
}

async function lintC1Geometry(page, cfg) {
  const c = cfg.c1; if (!c) return;
  console.log('\n── Tier 5: C1 attached-table geometry (§4.2 / §8.2 assertion 21) ──');
  const tol = c.alignTolerance ?? 2, adj = c.adjacencyTolerance ?? 2;
  await waitForC1Stable(page);
  const g = await measureC1Geometry(page, c);
  ok('C1 one grid, one plot and one native attached table', !g.missing,
    g.missing ? 'missing .c1-grid / .c1-plot / svg / table.c1-table' : '');
  if (g.missing) return;
  console.log('  INFO C1 viewBox geometry', JSON.stringify(g.diag));
  ok('C1 data-points, month headers and colgroup columns agree',
    g.pointCount > 0 && g.pointCount === g.headCount && g.colCount === g.headCount + 1,
    `points=${g.pointCount} heads=${g.headCount} cols=${g.colCount}`);
  ok('C1 grid tracks and table colgroup share one X boundary',
    g.tracks === g.tracksExpected && g.trackMaxDelta <= tol,
    `tracks=${g.tracks} expected=${g.tracksExpected} maxDelta=${g.trackMaxDelta}`);
  ok('C1 bars lie wholly inside their own month columns',
    g.bars > 0 && g.barOutside === 0 && g.barWrongColumn === 0,
    `bars=${g.bars} outside=${g.barOutside} wrongColumn=${g.barWrongColumn}`);
  ok('C1 line dots snap to month column centres',
    g.dots > 0 && g.dotOutside === 0 && g.dotMaxDelta <= tol,
    `dots=${g.dots} outside=${g.dotOutside} maxDelta=${g.dotMaxDelta}`);
  ok('C1 data-points.cx maps to month column centres', g.pointMaxDelta <= tol,
    `maxDelta=${g.pointMaxDelta} viewBox=${JSON.stringify(g.diag)}`);
  const legendAbove = c.legendAbovePlot === true;
  const legendOk = legendAbove ? g.legendAbovePlot : g.legendBelowPlot;
  ok(`C1 legend sits inside the SVG ${legendAbove ? 'above' : 'below'} the plot`,
    g.legendInsideSvg && legendOk && g.legendWithinSvg && g.htmlLegend === 0,
    `inside=${g.legendInsideSvg} above=${g.legendAbovePlot} below=${g.legendBelowPlot} within=${g.legendWithinSvg} html=${g.htmlLegend}`);
  ok('C1 vertical Y-axis line spans the plot at its left edge',
    g.axisLinePresent && g.axisVertical && g.axisAtPlotLeft && g.axisSpansPlot,
    `present=${g.axisLinePresent} vertical=${g.axisVertical} atLeft=${g.axisAtPlotLeft} spans=${g.axisSpansPlot}`);
  ok('C1 Y caption is rotated along the axis in column 1',
    g.yCapPresent && g.yCapRotated && g.yCapInColumn1,
    `present=${g.yCapPresent} rotated=${g.yCapRotated} inColumn1=${g.yCapInColumn1}`);
  // §4.2 rev 1.64 — dynamic Y ticks. One metadata payload drives labels, grid lines and marks.
  assertC1Axis(g, c, 'full window');
  ok('C1 table header row is flush with the chart X axis', g.headTopDelta <= adj,
    `gap=${g.headTopDelta}px tolerance=${adj}px`);
  ok('C1 chart draws no separate X labels', g.svgXLabels === 0, `svgXLabels=${g.svgXLabels}`);
  ok('C1 grid has zero gaps and no horizontal scroll',
    g.rowGap === 0 && g.columnGap === 0 && g.noHScroll,
    `rowGap=${g.rowGap} columnGap=${g.columnGap} noHScroll=${g.noHScroll}`);

  const original = await c1ChangePeriod(page, c);
  if (!original) {
    skipped('C1 alignment after a time-range change (period sliders unavailable)');
  } else {
    const g2 = await measureC1Geometry(page, c);
    ok('C1 time-range change rebuilds points, headers and colgroup together',
      !g2.missing && g2.pointCount > 0 && g2.pointCount === g2.headCount && g2.colCount === g2.headCount + 1,
      g2.missing ? 'board missing after repaint' : `points=${g2.pointCount} heads=${g2.headCount} cols=${g2.colCount}`);
    if (!g2.missing) {
      ok('C1 bars stay in their month columns after a time-range change',
        g2.bars > 0 && g2.barOutside === 0 && g2.barWrongColumn === 0,
        `bars=${g2.bars} outside=${g2.barOutside} wrongColumn=${g2.barWrongColumn}`);
      ok('C1 line dots stay snapped after a time-range change',
        g2.dots > 0 && g2.dotOutside === 0 && g2.dotMaxDelta <= tol,
        `dots=${g2.dots} outside=${g2.dotOutside} maxDelta=${g2.dotMaxDelta}`);
      ok('C1 data-points.cx stays mapped after a time-range change', g2.pointMaxDelta <= tol,
        `maxDelta=${g2.pointMaxDelta} viewBox=${JSON.stringify(g2.diag)}`);
      ok('C1 grid tracks stay aligned after a time-range change',
        g2.tracks === g2.tracksExpected && g2.trackMaxDelta <= tol,
        `tracks=${g2.tracks} expected=${g2.tracksExpected} maxDelta=${g2.trackMaxDelta}`);
    }
    await c1RestorePeriod(page, c, original);
  }

  // §4.2 rev 1.65 / I119 — after a period change, chart, grid, labels, hover/refit metadata and
  // PNG/Copy must all represent the SAME Y-axis scale. The probe window is chosen from the data;
  // an unsuitable dataset is SKIPPED, never FAILED. axisMinFill is a harness quality criterion.
  const probe = await c1PickAxisProbe(page, c);
  if (!probe || probe.skip) {
    skipped(`C1 window-based Y-axis probe (${probe && probe.skip ? probe.skip : 'probe unavailable'})`);
    return;
  }
  await c1ApplyAxisWindow(page, c, probe.to);
  const g3 = await measureC1Geometry(page, c);
  const tolPeak = c.axisPeakTolerance ?? 1;
  const yMax3 = (g3.c1meta || {}).yMax || 0;
  assertC1Axis(g3, c, 'short window');
  ok('C1 Y-axis maximum is recomputed from the selected period window (rev 1.65)',
    !g3.missing && g3.windowPeak > 0 &&
    Math.abs(g3.windowPeak - probe.probePeak) <= tolPeak &&
    g3.windowPeak < probe.fullPeak &&
    yMax3 >= probe.probePeak - tolPeak && yMax3 < (g.c1meta || {}).yMax &&
    Math.abs(yMax3 - probe.probeAxis) <= tolPeak,
    `fullPeak=${probe.fullPeak} fullYMax=${(g.c1meta || {}).yMax} probePeak=${probe.probePeak} probeAxis=${probe.probeAxis} windowYMax=${yMax3} idx=${probe.idx}`);
  ok('C1 window keeps the axis fill above the harness quality threshold',
    g3.windowPeak / (yMax3 || 1) >= (c.axisMinFill ?? 0.75),
    `fill=${((g3.windowPeak / (yMax3 || 1)) * 100).toFixed(1)}% min=${c.axisMinFill ?? 0.75}`);
  // Absolute cumulative values: every month present in both windows keeps the same four values.
  ok('C1 chart grid, axis labels, hover/refit geometry and PNG/Copy share one Y-axis scale after a period change',
    g3.gridScaleMaxDelta <= tolPeak,
    `maxDelta=${g3.gridScaleMaxDelta} yMax=${yMax3} labels=${(g3.tickLabels || []).join('/')}`);
  const shared = Object.keys(g3.cumByLabel || {}).filter(k => Object.hasOwn(g.cumByLabel || {}, k));
  ok('C1 cumulative values stay absolute after a period change (no rebase)',
    shared.length > 0 && shared.every(k => {
      const a = g.cumByLabel[k], b = g3.cumByLabel[k];
      return a.length === 4 && b.length === 4 && a.every((v, i) => Math.abs(v - b[i]) <= tolPeak);
    }),
    `sharedMonths=${shared.length}`);
  await c1RestorePeriod(page, c, { f: probe.f, t: probe.t });
}

// ── Tier 5: C1 dual-handle period time bar (spec §4.2 rev 1.66 / §8.2 assertion 21) ──
// C1-only and opt-in via cfg.c1.timeBar. Measures the live DOM and the browser's own
// `input` / `change` split, so the drag decoupling and the preset ranges are not inferred.
async function lintC1TimeBar(page, cfg) {
  const t = cfg.c1 && cfg.c1.timeBar;
  if (!t) return;
  console.log('\n── Tier 5: C1 dual-handle period time bar (§4.2 rev 1.66 / 1.67) ──');
  await waitForC1Stable(page);
  // §4.2 rev 1.67 — earlier C1 lint steps end on a manual custom range with NO active chip.
  // Select `All` first so the single-select assertions start from a known preset state.
  await page.locator(`${t.chipSelector}[data-c1preset="All"]`).first().click();
  await waitForC1Stable(page);
  const probe = () => page.evaluate(s => {
    const q = x => document.querySelector(x);
    const qa = x => [...document.querySelectorAll(x)];
    const bar = q(s.barSelector);
    if (!bar) return { missing: true };
    const board = bar.closest('.sc-board');
    const tracks = qa(s.trackSelector).filter(el => bar.contains(el));
    const inputs = tracks.length === 1 ? [...tracks[0].querySelectorAll('input[type="range"]')] : [];
    const from = inputs.find(el => el.dataset.c1period === 'from');
    const to = inputs.find(el => el.dataset.c1period === 'to');
    const ticks = qa(s.tickSelector).filter(el => bar.contains(el));
    const chips = qa(s.chipSelector).filter(el => bar.contains(el));
    let months = [];
    try { months = JSON.parse(bar.dataset.c1months || '[]'); } catch { months = []; }
    let points = [];
    try { points = JSON.parse(board?.getAttribute('data-points') || '[]'); } catch { points = []; }
    return {
      tracks: tracks.length, inputs: inputs.length, hasFrom: !!from, hasTo: !!to,
      steps: inputs.map(el => Number(el.getAttribute('step'))),
      min: from ? Number(from.getAttribute('min')) : -1,
      maxFrom: from ? Number(from.getAttribute('max')) : -1,
      maxTo: to ? Number(to.getAttribute('max')) : -1,
      values: [from ? Number(from.value) : -1, to ? Number(to.value) : -1],
      whole: inputs.every(el => Number.isInteger(Number(el.value))),
      ariaLabels: inputs.every(el => !!el.getAttribute('aria-label')),
      ariaTexts: inputs.every(el => !!el.getAttribute('aria-valuetext')),
      ticks: ticks.length, tickIndices: ticks.map(el => Number(el.dataset.c1month)),
      tickPointer: ticks.every(el => getComputedStyle(el).pointerEvents === 'none'),
      months: months.length, monthsList: months, asOf: bar.dataset.c1asof || '',
      heads: board ? board.querySelectorAll('table.c1-table thead th.g-axis').length : 0,
      points: points.length,
      presets: chips.map(el => el.dataset.c1preset),
      pressed: chips.map(el => el.getAttribute('aria-pressed')),
      pressedMap: chips.reduce((acc, el) => { acc[el.dataset.c1preset] = el.getAttribute('aria-pressed'); return acc; }, {}),
      pressedTrue: chips.filter(el => el.getAttribute('aria-pressed') === 'true').map(el => el.dataset.c1preset),
      activeClass: chips.filter(el => el.classList.contains('active')).map(el => el.dataset.c1preset),
      segGroups: document.querySelectorAll(s.segmentedSelector).length,
      segButtons: document.querySelectorAll(s.segmentedButtonSelector).length,
      chipGroupLabel: !!q(s.chipsSelector)?.getAttribute('aria-label'),
      periodText: (q(s.periodTextSelector)?.textContent || '').trim(),
    };
  }, t);
  const r = await probe();
  ok('C1 period control is ONE dual-handle track with two native range inputs (rev 1.66)',
    !r.missing && r.tracks === 1 && r.inputs === 2 && r.hasFrom && r.hasTo,
    r.missing ? 'no #c1TimeBar' : `tracks=${r.tracks} inputs=${r.inputs} from=${r.hasFrom} to=${r.hasTo}`);
  if (r.missing) return;
  const step = t.periodStep ?? 1;
  ok('C1 time bar snaps magnetically to whole reporting months (step="1")',
    r.steps.length === 2 && r.steps.every(v => v === step) && r.whole &&
    r.min === 0 && r.maxFrom === r.maxTo && r.maxTo === r.months - 1 && r.months > 1,
    `steps=${r.steps} min=${r.min} max=${r.maxFrom}/${r.maxTo} months=${r.months} values=${r.values}`);
  ok('C1 time bar draws one visual-only tick per reporting month',
    r.ticks === r.months && r.tickIndices.every((v, i) => v === i) && r.tickPointer,
    `ticks=${r.ticks} months=${r.months} pointerEventsNone=${r.tickPointer}`);
  ok('C1 presets form ONE joined segmented group of five buttons (rev 1.67)',
    JSON.stringify(r.presets) === JSON.stringify(t.expectedPresets) && r.chipGroupLabel &&
    r.segGroups === 1 && r.segButtons === t.expectedPresets.length,
    `presets=${r.presets} segGroups=${r.segGroups} segButtons=${r.segButtons} groupLabel=${r.chipGroupLabel}`);
  ok('C1 presets are mutually exclusive: exactly ONE active chip (rev 1.67)',
    r.pressedTrue.length === 1 && r.pressedTrue[0] === 'All' &&
    r.activeClass.length === 1 && r.activeClass[0] === 'All' &&
    r.pressed.every(v => v === 'true' || v === 'false'),
    `pressed=${r.pressed} pressedTrue=${r.pressedTrue} activeClass=${r.activeClass}`);
  ok('C1 time bar handles carry aria-label, aria-valuetext and a period text',
    r.ariaLabels && r.ariaTexts && r.periodText.length > 0,
    `labels=${r.ariaLabels} valueTexts=${r.ariaTexts} text="${r.periodText}"`);
  const focusCss = await page.evaluate(() => [...document.styleSheets].some(sheet => {
    try {
      const rules = [...sheet.cssRules];
      return rules.some(rule => /c1-ts-input:focus-visible/.test(rule.cssText) && /outline/.test(rule.cssText)) &&
        rules.some(rule => /c1-ts-chips \.seg-btn:focus-visible/.test(rule.cssText));
    } catch { return false; }
  }));
  ok('C1 time bar inputs and chips have a visible focus-visible outline (rev 1.66)', focusCss,
    `focusCss=${focusCss}`);

  // Live drag: an `input` event alone MUST change only the track visuals, not the chart payload.
  const live = await page.evaluate(s => {
    const bar = document.querySelector(s.barSelector);
    const from = bar?.querySelector('input[data-c1period="from"]');
    const to = bar?.querySelector('input[data-c1period="to"]');
    if (!bar || !from || !to) return null;
    const f = Number(from.value), e = Number(to.value);
    const before = (document.querySelector(s.periodTextSelector)?.textContent || '').trim();
    let el = null;
    if (f + 1 <= e) { from.value = String(f + 1); el = from; }
    else if (e - 1 >= f) { to.value = String(e - 1); el = to; }
    if (!el) return null;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    const board = bar.closest('.sc-board');
    return {
      before,
      after: (document.querySelector(s.periodTextSelector)?.textContent || '').trim(),
      points: JSON.parse(board?.getAttribute('data-points') || '[]').length,
      activeTicks: document.querySelectorAll(`${s.tickSelector}.is-active`).length,
      ariaText: el.getAttribute('aria-valuetext'),
      pressedTrue: [...document.querySelectorAll(s.chipSelector)].filter(c => c.getAttribute('aria-pressed') === 'true').length,
      activeClass: [...document.querySelectorAll(s.chipSelector)].filter(c => c.classList.contains('active')).length,
    };
  }, t);
  ok('C1 input event updates only the track visuals (rev 1.66 live-drag decoupling)',
    !!live && live.after !== live.before && live.points === r.points &&
    live.activeTicks > 0 && !!live.ariaText,
    live ? `before="${live.before}" after="${live.after}" points=${live.points}/${r.points} activeTicks=${live.activeTicks}` : 'probe unavailable');
  ok('C1 manual handle input clears every preset chip (rev 1.67)',
    !!live && live.pressedTrue === 0 && live.activeClass === 0,
    live ? `pressedTrue=${live.pressedTrue} activeClass=${live.activeClass}` : 'probe unavailable');

  // Presets. `All` restores the anchor before each probe, so every preset starts from the same `to`.
  const monthsList = r.monthsList, asOf = r.asOf, last = monthsList.length - 1;
  const expectedRange = (preset, anchor) => {
    const clamp = (f, e) => [Math.max(0, Math.min(f, last)), Math.max(0, Math.min(e, last))];
    const idxOfOrBefore = ym => {
      const hit = monthsList.indexOf(ym);
      if (hit >= 0) return hit;
      let found = 0;
      for (let i = 0; i < monthsList.length; i++) { if (monthsList[i] <= ym) found = i; else break; }
      return found;
    };
    if (preset === '6M') return clamp(anchor - 5, anchor);
    if (preset === '12M') return clamp(anchor - 11, anchor);
    if (preset === '24M') return clamp(anchor - 23, anchor);
    if (preset === 'YTD') {
      const ym = String(asOf).slice(0, 7);
      if (!/^\d{4}-\d{2}$/.test(ym)) return clamp(0, anchor);
      const f = idxOfOrBefore(`${ym.slice(0, 4)}-01`), e = idxOfOrBefore(ym);
      return clamp(Math.min(f, e), Math.max(f, e));
    }
    return [0, last];
  };
  const chipSel = p => `${t.chipSelector}[data-c1preset="${p}"]`;
  for (const preset of t.expectedPresets) {
    await page.locator(chipSel('All')).first().click();
    await waitForC1Stable(page);
    const anchor = (await probe()).values[1];
    const expected = expectedRange(preset, anchor);
    await page.locator(chipSel(preset)).first().click();
    await waitForC1Stable(page);
    const s = await probe();
    ok(`C1 preset ${preset} selects its whole-month window and rebuilds the table from the same N (rev 1.66)`,
      s.values[0] === expected[0] && s.values[1] === expected[1] &&
      s.points === s.values[1] - s.values[0] + 1 && s.heads === s.points &&
      s.pressedMap[preset] === 'true' && s.pressedTrue.length === 1 &&
      s.activeClass.length === 1 && s.activeClass[0] === preset,
      `anchor=${anchor} expected=${expected} got=${s.values} points=${s.points} heads=${s.heads} pressed=${JSON.stringify(s.pressedMap)} pressedTrue=${s.pressedTrue} activeClass=${s.activeClass}`);
  }
  // One keyboard step MUST move exactly one month.
  await page.locator(chipSel('All')).first().click();
  await waitForC1Stable(page);
  const kbBefore = (await probe()).values[0];
  await page.locator(`${t.trackSelector} input[data-c1period="from"]`).first().focus();
  await page.keyboard.press('ArrowRight');
  await waitForC1Stable(page);
  const kb = await probe();
  ok('C1 time bar keyboard step moves exactly one reporting month (rev 1.66)',
    kb.values[0] === kbBefore + step && kb.whole,
    `before=${kbBefore} after=${kb.values[0]} step=${step}`);
  ok('C1 manual handle change leaves NO active preset chip (rev 1.67)',
    kb.pressedTrue.length === 0 && kb.activeClass.length === 0,
    `pressedTrue=${kb.pressedTrue} activeClass=${kb.activeClass}`);
  // §4.2 rev 1.67 — ONE visual row at the 1280 px minimum desktop viewport width.
  const vp = page.viewportSize();
  const oneRowWidth = t.oneRowWidth ?? 1280;
  await page.setViewportSize({ width: oneRowWidth, height: vp?.height ?? 900 });
  await waitForC1Stable(page);
  const rows = await page.evaluate(s => {
    const q = x => document.querySelector(x);
    const tops = el => [...el.children].map(c => Math.round(c.getBoundingClientRect().top));
    const spread = a => (a.length ? Math.max(...a) - Math.min(...a) : 0);
    const ctl = q(s.controlSelector), ts = q(s.barSelector);
    return {
      ctlSpread: ctl ? spread(tops(ctl)) : -1,
      tsSpread: ts ? spread(tops(ts)) : -1,
      tsKids: ts ? ts.children.length : -1,
      flexWrap: ts ? getComputedStyle(ts).flexWrap : '',
    };
  }, t);
  await page.setViewportSize({ width: vp?.width ?? 1440, height: vp?.height ?? 900 });
  await waitForC1Stable(page);
  ok('C1 tools stay on ONE visual row at the 1280 px minimum desktop width (rev 1.67)',
    rows.ctlSpread >= 0 && rows.ctlSpread <= 16 && rows.tsSpread >= 0 &&
    rows.tsSpread <= 16 && rows.tsKids === 4 && rows.flexWrap === 'nowrap',
    `width=${oneRowWidth} ${JSON.stringify(rows)}`);
  // Print keeps the period text but hides the interactive track and chips.
  await page.emulateMedia({ media: 'print' });
  const printed = await page.evaluate(s => {
    const q = x => document.querySelector(x);
    const hidden = x => { const el = q(x); return !!el && getComputedStyle(el).display === 'none'; };
    return {
      body: hidden(s.bodySelector), chips: hidden(s.chipsSelector),
      text: !!q(s.periodTextSelector) && getComputedStyle(q(s.periodTextSelector)).display !== 'none',
    };
  }, t);
  await page.emulateMedia({ media: 'screen' });
  ok('C1 print view hides the interactive track and chips but keeps the period text (rev 1.66)',
    printed.body && printed.chips && printed.text, JSON.stringify(printed));
  await page.locator(chipSel('All')).first().click();
  await waitForC1Stable(page);
}

// ── Tier 5: C1 attached-table interaction (spec §4.2 rev 1.63 / §8.2 assertion 21) ──
// C1-only and opt-in via cfg.c1.interaction. Dispatches synthetic pointer events so the whole
// two-way model is measured in the browser, not inferred from markup: chart hover opens the
// window, table hover keeps the visual sync with the window closed, pointer-leave clears all.
async function lintC1Interaction(page, cfg) {
  const i = cfg.c1 && cfg.c1.interaction;
  if (!i) return;
  console.log('\n── Tier 5: C1 attached-table interaction (§4.2 rev 1.63) ──');
  await waitForC1Stable(page);
  const r = await page.evaluate((sel) => {
    const q = s => document.querySelector(s);
    const qa = s => [...document.querySelectorAll(s)];
    const out = {};
    const board = q('.scurve.sc-board');
    const svg = board && board.querySelector('svg.scurve-svg');
    const tip = board && board.querySelector('.chart-tip');
    if (!board || !svg || !tip) { out.missing = true; return out; }
    const band = q(sel.bandSelector);
    out.areas = qa(sel.areaSelector).length;
    out.gradients = qa(sel.gradientSelector).length;
    out.stops = qa(sel.stopSelector).length;
    out.stopClasses = [...new Set(qa(sel.stopSelector).map(el => el.getAttribute('class')))].sort();
    out.areaPointer = qa(sel.areaSelector).every(el => el.getAttribute('pointer-events') === 'none');
    out.bandPresent = !!band;
    out.bandPointer = !!band && band.getAttribute('pointer-events') === 'none';
    out.bandHidden = !!band && getComputedStyle(band).display === 'none';
    out.bandBehind = !!band && (() => {
      const kids = [...svg.children], at = kids.indexOf(band);
      return at >= 0 && kids.slice(at + 1).some(el => el.matches('line.sc-grid, path.sc-area, polyline, rect[class^="sc-bar-"]'));
    })();
    const vb = (svg.getAttribute('viewBox') || '0 0 0 0').split(/\s+/).map(Number);
    const pts = JSON.parse((board.getAttribute('data-points') || '[]').replace(/&#39;/g, "'"));
    out.bandWidth = band ? Number(band.getAttribute('width')) : 0;
    out.expectedBandWidth = vb[2] / Math.max(1, pts.length);
    out.pointCount = pts.length;
    out.heads = qa(sel.monthHeadSelector).length;
    out.headCols = new Set(qa(sel.monthHeadSelector).map(el => el.getAttribute('data-c1col'))).size;
    out.valueCols = new Set(qa(sel.valueCellSelector).map(el => el.getAttribute('data-c1col'))).size;
    out.dataColLeak = qa('table.c1-table [data-col]').length;

    const fire = (el, type, cx, cy) => el.dispatchEvent(new PointerEvent(type, {
      bubbles: true, cancelable: true, clientX: cx, clientY: cy, pointerId: 1, isPrimary: true
    }));
    const centre = el => { const b = el.getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; };
    const hidden = () => !tip.classList.contains('show') && tip.getAttribute('aria-hidden') === 'true'
      && (tip.textContent || '').trim().length === 0;
    const activeCols = () => [...new Set(qa(sel.activeSelector).map(el => el.getAttribute('data-c1col')))];
    const snapShown = () => { const s = q(sel.snapSelector); return !!s && getComputedStyle(s).display !== 'none'; };
    const bandShown = () => !!band && getComputedStyle(band).display !== 'none';

    const [cx, cy] = centre(svg);
    fire(svg, 'pointermove', cx, cy);
    out.chartTipShown = tip.classList.contains('show') && (tip.textContent || '').trim().length > 0;
    out.chartAriaRemoved = !tip.hasAttribute('aria-hidden');
    out.chartSnap = snapShown();
    out.chartBand = bandShown();
    out.chartX = band ? Number(band.getAttribute('x')) : -1;
    out.chartActive = activeCols();

    const cells = qa(sel.valueCellSelector);
    const cell = cells.find(el => el.getAttribute('data-c1col') === '3') || cells[0];
    const [tx, ty] = centre(cell);
    fire(cell, 'pointermove', tx, ty);
    out.tableTipHidden = hidden();
    out.tableSnap = snapShown();
    out.tableBand = bandShown();
    out.tableActive = activeCols();
    out.tableCol = cell.getAttribute('data-c1col');
    out.tableX = band ? Number(band.getAttribute('x')) : -1;

    const heads = qa(sel.monthHeadSelector);
    const head = heads.find(el => el.getAttribute('data-c1col') === '5') || heads[0];
    const [hx, hy] = centre(head);
    fire(head, 'pointermove', hx, hy);
    out.headTipHidden = hidden();
    out.headActive = activeCols();
    out.headCol = head.getAttribute('data-c1col');

    fire(board, 'pointerleave', 0, 0);
    out.leaveHidden = hidden();
    out.leaveSnap = !snapShown();
    out.leaveBand = !bandShown();
    out.leaveActive = activeCols().length;
    return out;
  }, i);

  ok('C1 rev 1.63 draws four tokenised gradients and four soft areas',
    !r.missing && r.gradients === i.expectedGradients && r.areas === i.expectedAreas
    && r.stops === i.expectedGradients * 2,
    `gradients=${r.gradients} areas=${r.areas} stops=${r.stops}`);
  ok('C1 gradient stops use the four on-chart series classes',
    !r.missing && r.stopClasses.length === 4
    && r.stopClasses.every(v => /^sc-stop-(plan|forecast|actual|resub)$/.test(v)),
    `classes=${JSON.stringify(r.stopClasses)}`);
  ok('C1 areas and month band are pointer-transparent, hidden and behind the marks',
    !r.missing && r.areaPointer && r.bandPresent && r.bandPointer && r.bandHidden && r.bandBehind,
    `areaPointer=${r.areaPointer} band=${r.bandPresent} pointer=${r.bandPointer} hidden=${r.bandHidden} behind=${r.bandBehind}`);
  ok('C1 month band width equals W / N',
    !r.missing && Math.abs(r.bandWidth - r.expectedBandWidth) <= (i.widthTolerance ?? 2),
    `width=${r.bandWidth} expected=${r.expectedBandWidth}`);
  ok('C1 data-c1col covers every month header and value cell',
    !r.missing && r.heads === r.pointCount && r.headCols === r.pointCount
    && r.valueCols === r.pointCount && r.dataColLeak === 0,
    `heads=${r.heads} points=${r.pointCount} headCols=${r.headCols} valueCols=${r.valueCols} dataColLeak=${r.dataColLeak}`);
  ok('C1 chart hover opens the window, band, snap line and column highlight',
    !r.missing && r.chartTipShown && r.chartAriaRemoved && r.chartSnap && r.chartBand
    && r.chartActive.length === 1,
    `tip=${r.chartTipShown} aria=${r.chartAriaRemoved} snap=${r.chartSnap} band=${r.chartBand} active=${JSON.stringify(r.chartActive)}`);
  ok('C1 table hover keeps the visual sync but hides and empties the window',
    !r.missing && r.tableTipHidden && r.tableSnap && r.tableBand
    && r.tableActive.length === 1 && r.tableActive[0] === r.tableCol,
    `tipHidden=${r.tableTipHidden} snap=${r.tableSnap} band=${r.tableBand} active=${JSON.stringify(r.tableActive)} column=${r.tableCol}`);
  ok('C1 table hover moves the band to the hovered month column',
    !r.missing && r.tableCol !== undefined && Math.abs(r.tableX - Number(r.tableCol) * r.expectedBandWidth) <= (i.widthTolerance ?? 2),
    `column=${r.tableCol} x=${r.tableX} width=${r.expectedBandWidth}`);
  ok('C1 month-header hover drives the same column',
    !r.missing && r.headTipHidden && r.headActive.length === 1 && r.headActive[0] === r.headCol,
    `tipHidden=${r.headTipHidden} active=${JSON.stringify(r.headActive)} column=${r.headCol}`);
  ok('C1 pointer-leave clears the band, snap line, highlight and hidden-window ARIA state',
    !r.missing && r.leaveHidden && r.leaveSnap && r.leaveBand && r.leaveActive === 0,
    `hidden=${r.leaveHidden} snap=${r.leaveSnap} band=${r.leaveBand} active=${r.leaveActive}`);
}

// ── Tier 5: C1 Schedule Performance S-Curve (workplan D35) ─────────────────
// Live checks of the combined S-curve card: structure, the Bars toggle, and the
// series multi-filter popup behaviour (it must stay open during a toggle, and
// close only on an outside click or the filter button). Mirrors the top menu bar
// filter behaviour, which lives in the persistent shell and stays open on repaint.
async function lintC1(page, cfg) {
  const c = cfg.c1; if (!c) return;
  console.log('\n── Tier 5: C1 Schedule Performance S-Curve ───────────────────');
  const count = async sel => (await page.locator(sel).count());
  const okC1 = (name, cond, detail = '') => ok(name, cond, detail);
  okC1('C1 panel present', (await count(c.panelSelector)) === 1);
  okC1('C1 svg present', (await count(c.svgSelector)) >= 1);
  const lines = await count(c.lineSelector);
  okC1(`C1 shows ${c.expectedSeries} series lines by default (got ${lines})`, lines === c.expectedSeries, `lines=${lines}`);
  const barsOn = await count(c.barSelector);
  okC1(`C1 bars drawn by default (got ${barsOn})`, barsOn > 0, `bars=${barsOn}`);
  okC1('C1 chart-component board present', (await count(c.boardSelector)) === 1);
  okC1('C1 Start reference line present', (await count(c.refStartSelector)) === 1);
  okC1('C1 Today reference line present', (await count(c.refTodaySelector)) === 1);
  okC1('C1 reference labels present', (await count(c.refLabelSelector)) >= 2);
  // §4.2 rev 1.59 says "Omit the as-of subtitle". The old assertion required one,
  // which conflicted with the spec. Owner decision 2026-11-06: enforce the absence.
  const asOf = await count(c.asOfSelector);
  okC1('C1 omits the as-of subtitle (§4.2 rev 1.59)', asOf === 0, `asOf=${asOf}`);
  // Bar toggle — the Bars button must switch the bars on and off.
  await page.locator(c.barsToggleSelector).click();
  await page.waitForTimeout(150);
  const barsOff = await count(c.barSelector);
  okC1('C1 Bars button hides bars', barsOff === 0, `bars=${barsOff}`);
  await page.locator(c.barsToggleSelector).click();
  await page.waitForTimeout(150);
  const barsBack = await count(c.barSelector);
  okC1('C1 Bars button restores bars', barsBack > 0, `bars=${barsBack}`);
  // Series popup — open, stay open during a toggle, close on outside click.
  await page.locator(c.seriesButtonSelector).click();
  await page.waitForTimeout(150);
  okC1('C1 Series popup opens', await page.locator(c.seriesPanelSelector).isVisible());
  // The config value is an attribute selector already, so the value goes INSIDE the brackets:
  // `[data-c1series]` + `="forecast"]` → `[data-c1series="forecast"]`. Appending `="forecast"`
  // outside produced invalid CSS and threw before any series behaviour could be checked.
  const forecastCb = page.locator(`${c.seriesCheckboxSelector.slice(0, -1)}="forecast"]`);
  if (await forecastCb.count()) {
    await forecastCb.first().uncheck();
    await page.waitForTimeout(150);
    const linesAfter = await count(c.lineSelector);
    okC1(`C1 unchecking a series removes its line (got ${linesAfter})`, linesAfter === c.expectedSeries - 1, `lines=${linesAfter}`);
    await forecastCb.first().check();
    await page.waitForTimeout(150);
    const linesRestored = await count(c.lineSelector);
    okC1('C1 re-checking a series restores its line', linesRestored === c.expectedSeries, `lines=${linesRestored}`);
    okC1('C1 popup stays open after a toggle', await page.locator(c.seriesPanelSelector).isVisible());
  }
  await page.mouse.click(5, 5);
  await page.waitForTimeout(150);
  okC1('C1 popup closes on outside click', !(await page.locator(c.seriesPanelSelector).isVisible()));
  // Geometry runs last: it repaints the board when it moves the period sliders.
  await lintC1Geometry(page, cfg);
  // §4.2 rev 1.63 — the interaction probe runs after the period restore, so the board is back
  // at its default month range and every W / N measurement matches the live payload.
  await lintC1Interaction(page, cfg);
  // §4.2 rev 1.66 — runs last and restores the full period with the `All` chip.
  await lintC1TimeBar(page, cfg);
}

// ── Tier 5: C3 Breakdown (workplan D36) ───────────────────────────────────────
// Live checks of the split-by-dimension card. It must draw two separate series per
// dimension value — Submissions (New + Resubmission) and Approval Status (the five
// codes) — never one stacked bar, because the two come from different log columns.
// Also verifies the component board, the Month selector (All months counts per
// Document No. and shows percentages; a single month is row-level and shows counts
// only), the Breakdown-by toggle and the Bar / Pie toggle.
async function lintC3(page, cfg) {
  const c = cfg.c3; if (!c) return;
  console.log('\n── Tier 5: C3 Breakdown ───────────────────────────────');
  const count = async sel => (await page.locator(sel).count());
  const okC3 = (name, cond, detail = '') => ok(name, cond, detail);
  // The chart only exists once both workbooks are loaded; earlier tiers do that.
  if ((await count(c.boardSelector)) === 0) { skipped('Tier 5 C3 chart (no data loaded in this run)'); return; }
  okC3('C3 chart-component board present', (await count(c.boardSelector)) === 1);
  okC3('C3 svg present', (await count(c.svgSelector)) === 1);
  const newSegs = await count(c.newSegmentSelector);
  const resubSegs = await count(c.resubSegmentSelector);
  okC3(`C3 submissions series drawn, New and Resubmission (got ${newSegs}/${resubSegs})`, newSegs >= 1 && resubSegs >= 1);
  const approvalSegs = await count(c.approvalSegmentSelector);
  okC3(`C3 Approval Status series drawn (got ${approvalSegs})`, approvalSegs >= 1);
  // The approval codes must not be sub-split by New / Resubmission: no segment carries both series.
  okC3('C3 Approval Status is not sub-split by New or Resubmission', (await count('.c3-board rect.c3-new.c3-app')) === 0);
  okC3('C3 PNG control present', (await count(c.pngSelector)) === 1);
  okC3('C3 Copy control present', (await count(c.copySelector)) === 1);
  // The summary table below the chart uses the shared .ds-table style (§7.2).
  okC3('C3 summary table present', (await count(c.summaryTableSelector)) === 1);
  const heads = await count(c.summaryHeadSelector);
  okC3(`C3 summary table shows its 8 columns (got ${heads})`, heads === 8);
  okC3('C3 summary table has a Total footer row', (await count(c.summaryFooterSelector)) === 1);
  // All months is the default: percentages are shown.
  okC3('C3 All months shows percentages', (await count(c.percentTextSelector)) >= 1);
  // A single month is row-level and shows counts only.
  await page.selectOption(c.monthSelector, { index: 1 });
  await page.waitForTimeout(250);
  okC3('C3 single month shows counts only', (await count(c.percentTextSelector)) === 0);
  okC3('C3 still renders after the month change', (await count(c.svgSelector)) === 1);
  const monthRows = await count(`${c.summaryTableSelector} tbody tr`);
  okC3(`C3 summary table follows the month selector (got ${monthRows})`, monthRows >= 1);
  await page.selectOption(c.monthSelector, 'ALL');
  await page.waitForTimeout(250);
  okC3('C3 returning to All months restores percentages', (await count(c.percentTextSelector)) >= 1);
  // Breakdown-by toggle.
  await page.locator(c.submitterSelector).click();
  await page.waitForTimeout(250);
  okC3('C3 break down by Submitter redraws', (await count(c.svgSelector)) === 1);
  await page.locator(c.disciplineSelector).click();
  await page.waitForTimeout(250);
  okC3('C3 break down by Discipline redraws', (await count(c.svgSelector)) === 1);
  // Pie view draws two concentric rings.
  await page.locator(c.pieSelector).click();
  await page.waitForTimeout(250);
  okC3('C3 pie draws the submissions ring', (await count(c.newArcSelector)) >= 1);
  okC3('C3 pie draws the approval ring', (await count(c.appArcSelector)) >= 1);
  await page.locator(c.barSelector).click();
  await page.waitForTimeout(250);
  okC3('C3 Bar view restores the bar chart', (await count(c.svgSelector)) === 1);
}

// Tier 6 loads the workbook and waits for the page navigation (the §4.6 window lives on the
// Analytical and Overview pages; the dashboard defaults to Overview). It only needs the shell +
// data to be ready, then lintHoverWindow navigates to each page.
async function ensureLoadedForTier6(page, cfg, workbookPath) {
  if (!workbookPath || !existsSync(workbookPath)) return false;
  try {
    await page.goto(dashboardUrl(cfg));
    await injectWorkbook(page, workbookPath, cfg);
    await page.waitForSelector('.page-link', { timeout: 20000 });
    return true;
  } catch (error) {
    console.log(`  INFO: Tier 6 could not load the workbook — ${error.message.split('\n')[0]}`);
    return false;
  }
}

// ── Tier 6: §4.6 hover floating window (spec §4.6) ───────────────────────────
// General side-bar exploration. The dashboard renders different content per `[data-page]` menu item
// (Overview, Submittals, Validation, Forward and Overdue, Analytical, Help, Settings). Tier 6 visits
// every menu item, discovers every hover-window host on that view, and also clicks in-page button
// switches (segmented controls, tabs, toggles) so views revealed only by a switch are explored too.
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function discoverPages(page) {
  return page.evaluate(() => {
    const seen = new Set(); const out = [];
    for (const b of document.querySelectorAll('[data-page]')) {
      const name = b.dataset.page; if (!name || seen.has(name)) continue;
      seen.add(name);
      out.push({ name, text: (b.textContent || '').trim() || name });
    }
    return out;
  });
}

async function visitPage(page, name) {
  await page.click(`[data-page="${name}"]`).catch(() => {});
  await sleep(150); // paint() swaps [data-page-content] synchronously; allow layout to settle
}

async function lintHoverWindow(page, cfg) {
  const h = cfg.hover; if (!h) { skipped('Tier 6 hover window (§4.6) — no hover config'); return; }
  console.log('\n── Tier 6: §4.6 hover floating window ────────────────────────');
  const pages = await discoverPages(page);
  if (!pages.length) { skipped('Tier 6 hover window (no side-bar pages found)'); return; }

  // Generic host discovery: every bound window root carries aria-describedby → a role="tooltip" tip and
  // is focusable. This finds C1 (.scurve), C2 (.c2-stack), C3 (.c3-card), C4 (.c4-chart) and KPI
  // (.kpi-card) on every page — charts, KPI cards and any future board, with no hard-coded page list.
  const gatherHosts = async (pageName, viewLabel = '') => page.evaluate(({ boards, pageName, viewLabel }) => {
    const hosts = [...document.querySelectorAll('[aria-describedby]')].filter((board) => {
      const tip = document.getElementById(board.getAttribute('aria-describedby'));
      return tip && (tip.getAttribute('role') === 'tooltip' || (tip.className || '').includes('chart-tip'));
    });
    return hosts.map((board) => {
      const tipId = board.getAttribute('aria-describedby');
      let cursor = 'crosshair', snap = false, ctL = false, nearest = false, name = 'hover host';
      const cls = board.className || '';
      if (cls.includes('kpi-card')) { cursor = 'help'; name = 'KPI card'; }
      for (const b of boards) {
        if (board.matches(b.selector) || board.closest(b.selector)) {
          cursor = b.cursor; ctL = !!b.ctL; name = b.name;
          // `elementViews` names the switch states in which the board works in element mode
          // (per-element data-tip), so the nearest-datum assertions do not apply there.
          const elementView = (b.elementViews || []).includes(viewLabel);
          snap = !!b.snap && !elementView;
          nearest = !!b.nearest && !elementView;
          break;
        }
      }
      if (board.closest('.c2-stack')) ctL = true; // guard C2 grouping wherever it appears
      const rect = board.getBoundingClientRect();
      // `nearestMode` = the board carries a points payload, so the binder snaps to the nearest
      // datum. `nearest` (config) asserts a board that MUST work that way (§4.6 no dead zone).
      return { tipId, cursor, snap, ctL, nearest,
        nearestMode: ['data-points', 'data-c2points'].some(a => board.hasAttribute(a)),
        name, pageName, visible: rect.width > 0 && rect.height > 0 };
    });
  }, { boards: h.boards || [], pageName, viewLabel });

  // §4.6 coverage — the discovery above finds hosts BY `aria-describedby`, and the binder sets that
  // attribute only after it finds the window element. A board that never binds is therefore invisible
  // to every check that follows: all six KPI cards carried `data-tip` but no `.chart-tip`, so no KPI
  // window could open while Tier 6 still reported zero failures (I100). Count what the config says
  // exists and require every one of those hosts to be bound.
  const expectedHosts = [
    ...(h.boards || []).map(board => ({ selector: board.selector, name: board.name })),
    ...(h.kpi ? [{ selector: h.kpi.selector, name: h.kpi.name }] : []),
  ];
  const coveredMax = new Map();
  const checkCoverage = async (pageName) => {
    if (!expectedHosts.length) return;
    const report = await page.evaluate(({ targets }) => targets.map(({ selector }) => {
      const found = [...document.querySelectorAll(selector)];
      const bound = found.filter((el) => {
        const describedBy = el.getAttribute('aria-describedby');
        if (!describedBy) return false;
        const tip = document.getElementById(describedBy);
        return !!tip && (tip.getAttribute('role') === 'tooltip' || (tip.className || '').includes('chart-tip'));
      });
      return { selector, found: found.length, bound: bound.length };
    }), { targets: expectedHosts });
    for (const row of report) {
      if (!row.found) continue; // board is not on this view; presence is asserted after the sweep
      const spec = expectedHosts.find(item => item.selector === row.selector);
      coveredMax.set(row.selector, Math.max(coveredMax.get(row.selector) || 0, row.found));
      ok(`${pageName} · ${spec.name}: every host carries a bound window (${row.bound} of ${row.found})`,
        row.bound === row.found, `${row.found - row.bound} host(s) never received a window`);
    }
  };

  // Run the §4.6 assertions on one host (located by its tip id).
  const checkedTips = new Set();
  const checkHost = async (host) => {
    const r = await page.evaluate(({ tipId, snap, ctL, nearest }) => {
      const sel = '[aria-describedby="' + (window.CSS ? CSS.escape(tipId) : tipId) + '"]';
      const board = document.querySelector(sel);
      const out = { absent: !board };
      if (!board) return out;
      const describedBy = board.getAttribute('aria-describedby');
      out.describedBy = !!describedBy;
      const tip = describedBy ? document.getElementById(describedBy) : null;
      out.tipExists = !!tip;
      out.tipRole = tip ? tip.getAttribute('role') === 'tooltip' : false;
      // §4.6 rev 1.63 — a hidden window MUST be aria-hidden AND free of stale datum text.
      out.initialAriaHidden = tip ? tip.getAttribute('aria-hidden') === 'true' : false;
      out.initialEmpty = tip ? (tip.textContent || '').trim().length === 0 : false;
      out.focusable = board.hasAttribute('tabindex');
      const cs = getComputedStyle(board);
      out.cursor = cs.cursor;
      out.cursorOk = cs.cursor && cs.cursor !== 'auto' && cs.cursor !== 'default'; // affordance present
      if (snap) { const svg = board.querySelector('svg'); out.snap = !!(svg && svg.querySelector('.chart-snap')); }
      const fire = (el, type, cx, cy) => el.dispatchEvent(new PointerEvent(type, { bubbles: true, cancelable: true, clientX: cx, clientY: cy, pointerId: 1, isPrimary: true }));
      // Element mode: dispatch on a concrete [data-tip] child (or the board itself for KPI cards).
      // Nearest mode (C1/C2) has no [data-tip] child, so fall back to a pointermove over the SVG.
      let triggered = false;
      const t = board.matches('[data-tip]') ? board : board.querySelector('[data-tip]');
      if (t) {
        const rr = t.getBoundingClientRect();
        fire(t, 'pointerdown', rr.left + rr.width / 2, rr.top + rr.height / 2);
        fire(t, 'pointermove', rr.left + rr.width / 2, rr.top + rr.height / 2);
        if (tip && tip.classList.contains('show')) triggered = true;
      }
      if (!triggered) {
        const svg = board.querySelector('svg');
        if (svg) { const rr = svg.getBoundingClientRect(); fire(svg, 'pointermove', rr.left + rr.width / 2, rr.top + rr.height / 2); if (tip && tip.classList.contains('show')) triggered = true; }
      } else out.trigger = true;
      if (tip && triggered) {
        out.shown = tip.classList.contains('show');
        const html = tip.innerHTML || '';
        out.hasContent = html.trim().length > 0;
        out.ctL = ctL ? html.includes('ct-l') : true;
        out.shownAria = !tip.hasAttribute('aria-hidden');
        fire(board, 'pointerleave', 0, 0);
        out.hides = !tip.classList.contains('show');
        out.hiddenAria = tip.getAttribute('aria-hidden') === 'true';
        out.hiddenEmpty = (tip.textContent || '').trim().length === 0;
      }
      // §4.6 no dead zone (I103): a nearest-mode chart must reveal the window on a hover over EMPTY
      // chart area, not only on a datum. The C2 Delay view shipped in element mode — its window was
      // reachable only on the 3 px dots, invisible everywhere else. Dispatched on the SVG itself, so
      // the coordinates decide (nearest mode) while the target stays the svg.
      if (nearest) {
        out.nearestMode = ['data-points', 'data-c2points'].some(a => board.hasAttribute(a));
        const svgN = board.querySelector('svg');
        if (svgN && tip) {
          const rr = svgN.getBoundingClientRect();
          fire(svgN, 'pointermove', rr.left + rr.width / 2, rr.top + rr.height / 2);
          out.emptyHoverShows = tip.classList.contains('show') && (tip.innerHTML || '').trim().length > 0;
          fire(board, 'pointerleave', 0, 0);
        }
      }
      return out;
    }, { tipId: host.tipId, snap: host.snap, ctL: host.ctL, nearest: host.nearest });
    if (r.absent) return null;
    if (checkedTips.has(host.tipId)) return null; // avoid recounting the same window across pages/switches
    checkedTips.add(host.tipId);
    const id = `${host.pageName} · ${host.name}`;
    ok(`${id}: host carries aria-describedby`, r.describedBy);
    ok(`${id}: tooltip element exists`, r.tipExists);
    ok(`${id}: window carries role="tooltip"`, r.tipRole);
    ok(`${id}: host is focusable (tabindex)`, r.focusable);
    ok(`${id}: cursor affordance present (got ${r.cursor})`, r.cursorOk);
    // §4.6 rev 1.63 — config-driven so dashboards without the rule keep their current assertions.
    if (h.ariaHidden) {
      ok(`${id}: hidden window starts aria-hidden and empty (§4.6 rev 1.63)`,
        r.initialAriaHidden === true && r.initialEmpty === true,
        `ariaHidden=${r.initialAriaHidden} empty=${r.initialEmpty}`);
    }
    if (host.snap) ok(`${id}: nearest chart exposes .chart-snap line`, r.snap);
    if (host.nearest) {
      ok(`${id}: nearest-datum payload present (§4.6 no dead zone)`, r.nearestMode);
      ok(`${id}: hover on empty chart area reveals the window (§4.6)`, r.emptyHoverShows === true,
        r.nearestMode ? 'the window did not open on empty chart area' : 'the board carries no points payload — element mode?');
    }
    if (r.shown !== undefined) {
      ok(`${id}: window reveals on hover/tap`, r.shown);
      ok(`${id}: window has content`, r.hasContent);
      if (host.ctL) ok(`${id}: series row keeps .ct-l swatch+label group (§4.6)`, r.ctL);
      if (r.hides !== undefined) ok(`${id}: window hides on pointer-leave`, r.hides);
      if (h.ariaHidden) {
        ok(`${id}: shown window removes aria-hidden (§4.6 rev 1.63)`, r.shownAria === true);
        ok(`${id}: hidden window is aria-hidden and empty (§4.6 rev 1.63)`,
          r.hiddenAria === true && r.hiddenEmpty === true,
          `ariaHidden=${r.hiddenAria} empty=${r.hiddenEmpty}`);
      }
    } else if (r.tipExists) {
      warn(`${id}: no hover trigger on this view (view may differ)`, false, 'could not reveal window');
    }
    return r;
  };

  // In-page button switches (segmented controls, tabs, toggles). Action buttons (export/print/etc.)
  // are skipped. Targets are STABLE CSS PATHS, not element handles: one click repaints the page and
  // detaches every collected handle, so the old single up-front collection left all switches after
  // the first silently unclicked (I103 — the C2 Delay view was never verified). After each click the
  // view is re-scanned, coverage included: a re-rendered board that loses its window must fail, not
  // vanish (the funnel view shipped with no `.chart-tip` at all).
  const switchSelector = '.seg button, [role="tab"], button[aria-pressed], [data-view]';
  const collectSwitches = () => page.evaluate((sel) => {
    const path = (el) => {
      const parts = [];
      for (let n = el; n && n.nodeType === 1; n = n.parentElement) {
        if (n.id) { parts.unshift('#' + n.id); return parts.join(' > '); }
        if (n.tagName === 'BODY') { parts.unshift('body'); return parts.join(' > '); }
        const same = [...n.parentElement.children].filter(c => c.tagName === n.tagName);
        parts.unshift(`${n.tagName.toLowerCase()}:nth-of-type(${same.indexOf(n) + 1})`);
      }
      return parts.join(' > ');
    };
    const out = [];
    for (const b of document.querySelectorAll(sel)) {
      if (b.dataset.page) continue;
      if (b.offsetParent === null) continue;
      const sig = (b.className || '') + ' ' + (b.getAttribute('aria-label') || '') + ' ' + (b.textContent || '');
      if (/export|print|file|open|reset|download|close|help|settings/i.test(sig)) continue;
      // Each switch is tested IN ISOLATION from the page's default state, then restored: a seg
      // button restores the sibling that was active at collection time, a standalone toggle
      // (aria-pressed) restores by clicking itself again. Without the restore a view change
      // sticks — clicking Funnel left the C2 board in element mode for the rest of the sweep.
      const group = b.closest('.seg, [role="group"], [role="tablist"]');
      const active = group ? group.querySelector('.active, [aria-selected="true"]') : null;
      out.push({ css: path(b), restore: (active && active !== b) ? path(active) : path(b),
        label: (b.textContent || '').trim() || b.getAttribute('aria-label') || 'switch' });
    }
    return out;
  }, switchSelector);

  for (const p of pages) {
    console.log(`\n  Side-bar page: ${p.text || p.name}`);
    await visitPage(page, p.name);
    await checkCoverage(p.name);
    const hosts = await gatherHosts(p.name);
    for (const ho of hosts) await checkHost(ho);
    const switches = await collectSwitches();
    for (const sw of switches) {
      await page.click(sw.css, { timeout: 2000 }).catch(() => {});
      await sleep(180);
      const label = `${p.name} · ${sw.label}`;
      await checkCoverage(label);
      const swHosts = await gatherHosts(label, sw.label);
      for (const ho of swHosts) await checkHost(ho);
      await page.click(sw.restore, { timeout: 2000 }).catch(() => {});
      await sleep(120);
    }
  }
  // A configured board that appears on no view would otherwise be silently unverifiable, exactly like
  // a host that never binds: the sweep would simply report nothing about it.
  for (const spec of expectedHosts) {
    ok(`§4.6 coverage: "${spec.name}" (${spec.selector}) is present on at least one view`,
      (coveredMax.get(spec.selector) || 0) > 0, 'the configured selector matched nothing on any page');
  }
}

// Tier 5 inspects the rendered charts, so it needs a dashboard that already holds data. Earlier
// tiers navigate the page for their own purposes and can leave it freshly loaded with no workbook,
// which made every Tier 5 check fail (and `lintC1` block on a missing control until it timed out).
// Load the workbook here when nothing is rendered, and report a skip when no workbook is configured.
async function ensureLoadedForTier5(page, cfg, workbookPath) {
  if (!workbookPath || !existsSync(workbookPath)) return false;
  // Always start from a known state. Earlier tiers leave the page wherever they last navigated —
  // sometimes on another page (whose panels exist but hold no chart), sometimes with no data at
  // all — so a stale element from a previous tier cannot be used as the readiness signal.
  const ready = (cfg.c1 && cfg.c1.panelSelector) || (cfg.c3 && cfg.c3.boardSelector) || '.panel';
  try {
    await page.goto(dashboardUrl(cfg));
    await injectWorkbook(page, workbookPath, cfg);
    await page.waitForSelector(ready, { timeout: 20000 });
    return true;
  } catch (error) {
    console.log(`  INFO: Tier 5 could not load the workbook — ${error.message.split('\n')[0]}`);
    return false;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
const needsBrowser = !targetTier || targetTier !== 1;
let browser = null, page = null, browserFailure = '';
if (needsBrowser) {
  try { browser = await chromium.launch(); page = await browser.newPage(); }
  catch (error) { browserFailure = error.message.split('\n')[0]; fail++; console.log(`  FAIL Chromium launch required for browser tiers: ${browserFailure}`); }
}

const dashboards = targetDashboard ? [targetDashboard] : DASHBOARDS;
if (!dashboards.length) console.log('\nNo dashboards discovered (checks/ empty or --dashboard not found). Add a checks/<name>.mjs to run.');

for (const name of dashboards) {
  const cfgPath = resolve(here, 'checks', `${name}.mjs`);
  if (!existsSync(cfgPath)) {
    console.log(`\nNo config found for dashboard "${name}" at ${cfgPath} — skipping.`);
    continue;
  }
  const { default: cfg } = await import(pathToFileURL(cfgPath).href);
  const workbookPath = cliWorkbook ? resolve(cliWorkbook) : (cfg.defaultWorkbook ? resolve(cfg.defaultWorkbook) : '');

  console.log(`\n${'═'.repeat(60)}`);
  console.log(`Dashboard: ${name.toUpperCase()}  |  ${cfg.htmlPath}`);
  console.log('═'.repeat(60));

  if (!targetTier || targetTier === 1) await runTier1(cfg);
  if (!targetTier || targetTier === 2) {
    if (page) await runTier2(page, cfg, workbookPath); else skipped(`Tier 2 browser shell (browser unavailable: ${browserFailure})`);
  }
  if (!targetTier || targetTier === 3) {
    if (page) await runTier3(page, cfg, workbookPath); else skipped(`Tier 3 data + filter (browser unavailable: ${browserFailure})`);
  }
  if (!targetTier || targetTier === 4) {
    if (page) await runTier4(page, cfg, workbookPath); else skipped(`Tier 4 layout geometry (browser unavailable: ${browserFailure})`);
  }
  if (!targetTier || targetTier === 5) {
    if (!page) { skipped('Tier 5 C1 chart (browser unavailable)'); skipped('Tier 5 C3 chart (browser unavailable)'); }
    else if (!(await ensureLoadedForTier5(page, cfg, workbookPath))) { skipped('Tier 5 C1 chart (no dashboard data)'); skipped('Tier 5 C3 chart (no dashboard data)'); }
    else {
      if (cfg.c1) await lintC1(page, cfg); else skipped('Tier 5 C1 chart (no c1 config)');
      if (cfg.c3) await lintC3(page, cfg); else skipped('Tier 5 C3 chart (no c3 config)');
    }
  }
  if (!targetTier || targetTier === 6) {
    if (!cfg.hover) { skipped('Tier 6 hover window (§4.6) — no hover config for this dashboard'); }
    else if (!page) { skipped('Tier 6 hover window (browser unavailable)'); }
    else if (!(await ensureLoadedForTier6(page, cfg, workbookPath))) { skipped('Tier 6 hover window (no dashboard data)'); }
    else { await lintHoverWindow(page, cfg); }
  }
}

if (browser) await browser.close();

console.log(`\n${'═'.repeat(60)}`);
console.log(`RESULT: ${pass} passed, ${fail} failed, ${warns} advisory warnings, ${skip} skipped`);
console.log('═'.repeat(60));
process.exit(fail ? 1 : 0);
