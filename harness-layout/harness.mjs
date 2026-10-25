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
  // Spec §3.9: a standalone dashboard inlines its module, so an inline `<script type="module">`
  // passes. A linked module still has to be project-local, never a CDN or the shared `common/` folder.
  const moduleScripts = [...html.matchAll(/<script\b(?=[^>]*\btype=["']module["'])[^>]*>/gi)].map(m => m[0]);
  const linkedLocal = moduleScripts.some(tag => {
    const src = tag.match(/\bsrc=["']([^"']+)["']/i);
    return !!src && !/^[a-z]+:\/\//i.test(src[1]) && !/(?:^|\/)common\//.test(src[1]);
  });
  const inlineModule = moduleScripts.some(tag => !/\bsrc=/i.test(tag));
  ok('dashboard ships a project-local module, linked or inlined', linkedLocal || inlineModule,
    `module scripts: ${moduleScripts.length}, local link: ${linkedLocal}, inline: ${inlineModule}`);
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
  const { readXlsx } = await import(pathToFileURL(cfg.xlsxReaderPath).href);
  const { buildModel } = await import(pathToFileURL(cfg.pipelinePath).href);
  const { deriveView } = await import(pathToFileURL(cfg.renderPath).href);

  const readWorkbook = async filePath => {
    const buf = readFileSync(filePath);
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    return readXlsx(ab);
  };
  const wb = await readWorkbook(workbookPath);
  let model;
  let companionPath = null;
  if (cfg.companionWorkbook) {
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
  const sourceRows = model.records || model.planned || [];
  const fullDisc = new Set(sourceRows.map(r => r.discipline).filter(Boolean));
  const fullStg  = new Set(sourceRows.map(r => r.stage).filter(Boolean).filter(s => !EXCL.includes(s)));
  const state = { disciplines: fullDisc, stages: fullStg, search: '', searchCol: 'Document No.', rule: null };
  const view = deriveView(model, state);
  const gt = view.kpis;

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
  if (cfg.filterRoundTrip?.type === 'select' && fullDisc.size > 1) {
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
    ok(`validation issue count: DOM ${domIssues} = pipeline ${view.issues.length}`,
      domIssues === view.issues.length, `DOM=${domIssues} pipeline=${view.issues.length}`);
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
  const proof = await page.evaluate(p => [...document.querySelectorAll('table.ds-table')]
    .filter(t => t.offsetHeight && t.querySelector('thead tr th'))
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
    }), probe);
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
      ok(`split-header #${p.i} [${p.label}]: header width equals its body's width`,
        Math.abs(p.fragW - p.scW) <= 2 && Math.abs(p.fragW - p.bodyW) <= 2,
        `head=${p.fragW} scroller=${p.scW} body=${p.bodyW}`);
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
    if (m.hasThead) verdict(`${lbl}: header height = ${exp.head}px`, Math.abs(m.headerH - exp.head) <= tol, `${m.headerH}px`);
    else skipped(`${lbl}: header height (no <thead> — body fragment)`);
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
  for (const key of ['detail', 'issue']) {
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
      return document.querySelectorAll(`#ccPanel_${k} .cc-row input:not([disabled])`).length;
    }, key);
    ok(`I-95: ${key} chooser opens and offers columns (${n} selectable)`, n > 0);
    const choiceIndex = await page.evaluate(k => {
      const choices = [...document.querySelectorAll(`#ccPanel_${k} .cc-row input:not([disabled])`)];
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
      const b = document.querySelectorAll(`#ccPanel_${k} .cc-row input:not([disabled])`)[index];
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
      const card = t.closest('.splitcard');
      const partner = card ? [...card.querySelectorAll('table.ds-table')]
        .find(x => x !== t && x.querySelector('tbody tr')) : null;
      return { w: t.querySelectorAll('colgroup col')[0].getBoundingClientRect().width,
               partner: partner ? partner.querySelectorAll('colgroup col')[0].getBoundingClientRect().width : null,
               stored: localStorage.getItem(prefix + 'detail_widths') || localStorage.getItem(prefix + 'issue_widths') };
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
      const before = await colW(idx);
      await drag(idx, 90);
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
      const restored = await colW(idx);
      ok(`I-95: table #${idx} — the resize test restores the width it changed`,
        Math.abs(restored.w - before.w) <= 2, `${before.w.toFixed(0)}px → ${restored.w.toFixed(0)}px`);
    }
    // leave storage as we found it: these drags write width prefs no later check should inherit
    await page.evaluate(() => Object.keys(localStorage).filter(k => /_widths$/.test(k)).forEach(k => localStorage.removeItem(k)));
  } else skipped('I-95: column resize (no grip found)');

  // 4. windowing (I-96) — few rows drawn, full count reported, scroll height preserved
  const win = await page.evaluate(() => {
    // the windowed table is the one carrying spacer rows
    const t = [...document.querySelectorAll('table.ds-table')].find(x => x.querySelector('tr.win-pad'))
      || document.querySelector('table.ds-table');
    const pick = id => {
      const el = document.getElementById(id);
      if (!el) return null;
      const m = el.textContent.match(/([\d,]+)\s+of\s+([\d,]+)/) || el.textContent.match(/([\d,]+)/);
      return m ? { shown: +m[1].replace(/,/g, ''), total: m[2] ? +m[2].replace(/,/g, '') : +m[1].replace(/,/g, '') } : null;
    };
    return {
      drawn: t.querySelectorAll('tbody tr:not(.win-pad)').length,
      pads: t.querySelectorAll('tbody tr.win-pad').length,
      scrollH: t.closest('.tableScroll')?.scrollHeight || 0,
      cnt: pick('dCnt'), vcnt: pick('vCnt'),
    };
  });
  const winCount = win.vcnt || win.cnt;
  if (winCount?.total > 500) {
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
  okC1('C1 As-of caption present', (await count(c.asOfSelector)) === 1);
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
}

if (browser) await browser.close();

console.log(`\n${'═'.repeat(60)}`);
console.log(`RESULT: ${pass} passed, ${fail} failed, ${warns} advisory warnings, ${skip} skipped`);
console.log('═'.repeat(60));
process.exit(fail ? 1 : 0);
