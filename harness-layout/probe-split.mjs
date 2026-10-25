import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const subRoot = resolve(here, '../sub');
const html = resolve(subRoot, 'TWRP C3B2 - Document Submittal Dashboard.html');
const mdl = resolve(subRoot, 'TWRP C3B2 - Master Document List.xlsx');
const log = resolve(subRoot, 'TWRP C3B2 - Document Submittal Log.xlsx');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
await page.goto(`file://${html}`);
await page.waitForTimeout(400);
const bl = Array.from(readFileSync(mdl));
const ll = Array.from(readFileSync(log));
await page.evaluate(async ([b, n, c, m]) => {
  const f = new File([new Uint8Array(b).buffer], n, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const g = new File([new Uint8Array(c).buffer], m, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  await window._loadFiles(f, g);
}, [bl, 'MDL.xlsx', ll, 'LOG.xlsx']);
await page.waitForSelector('.panel', { timeout: 20000 });
await page.locator('[data-page="Submittals"]').first().click();
await page.waitForTimeout(600);

const out = await page.evaluate(async () => {
  const res = [];
  const R = el => el.getBoundingClientRect();
  for (const frag of document.querySelectorAll('.vheadtab')) {
    const card = frag.closest('.splitcard') || frag.parentElement;
    const sc = card && card.querySelector('.tableScroll');
    const body = sc && sc.querySelector('table.ds-table');
    if (!sc || !body) continue;
    const leaf = [...frag.querySelectorAll('thead tr')].pop();
    const pin = [...leaf.children].find(c => c.classList.contains('ds-pinned'));
    const bpin = body.querySelector('tbody tr:not(.win-pad) td.ds-pinned');
    const before = {
      key: frag.dataset.tableKey || null,
      gapTop: +(R(sc).top - R(frag).bottom).toFixed(1),
      headCols: [...frag.querySelectorAll('colgroup col')].slice(0, 3).map(c => c.style.width || '-'),
      bodyCols: [...body.querySelectorAll('colgroup col')].slice(0, 3).map(c => c.style.width || '-'),
      pinLeft: pin ? +R(pin).left.toFixed(1) : null,
      bpinLeft: bpin ? +R(bpin).left.toFixed(1) : null,
      pinGap: (pin && bpin) ? +Math.abs(R(pin).left - R(bpin).left).toFixed(1) : null,
      scLeft: +R(sc).left.toFixed(1), fragLeft: +R(frag).left.toFixed(1),
      overflow: sc.scrollWidth - sc.clientWidth
    };
    const port = frag.parentElement.classList.contains('vheadwrap') ? frag.parentElement : null;
    const oldW = sc.style.width, oldPW = port ? port.style.width : '';
    const w = Math.max(240, sc.clientWidth - 400) + 'px';
    sc.style.width = w; if (port) port.style.width = w;
    await new Promise(r => setTimeout(r, 120));
    const max = sc.scrollWidth - sc.clientWidth;
    sc.scrollLeft = max;
    if (port) port.scrollLeft = max;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const after = {
      max,
      pinLeft: pin ? +R(pin).left.toFixed(1) : null,
      bpinLeft: bpin ? +R(bpin).left.toFixed(1) : null,
      pinGap: (pin && bpin) ? +Math.abs(R(pin).left - R(bpin).left).toFixed(1) : null,
      scLeft: +R(sc).left.toFixed(1), fragLeft: +R(frag).left.toFixed(1),
      portScroll: port ? port.scrollLeft : null,
      scScroll: sc.scrollLeft,
      headW: frag.style.width, bodyW: body.style.width
    };
    sc.scrollLeft = 0; sc.style.width = oldW; if (port) { port.style.width = oldPW; port.scrollLeft = 0; }
    res.push({ before, after });
    await new Promise(r => setTimeout(r, 80));
  }
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
