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
await page.locator('[data-page="Validation"]').first().click();
await page.waitForTimeout(700);

const out = await page.evaluate(async () => {
  const res = [];
  const R = el => el.getBoundingClientRect();
  for (const frag of document.querySelectorAll('.vheadtab')) {
    const card = frag.closest('.splitcard');
    const sc = card && card.querySelector('.tableScroll');
    const body = sc && sc.querySelector('table');
    if (!sc || !body) continue;
    const leaf = [...frag.querySelectorAll('thead tr')].pop();
    const pin = [...leaf.children].find(c => c.classList.contains('ds-pinned'));
    const rec = { key: frag.dataset.tableKey || null, rows: body.querySelectorAll('tbody tr').length };
    rec.headers = body.querySelectorAll('thead tr').length;
    rec.bodyHtml = body.outerHTML.slice(0, 120);
    const bPin = body.querySelector('tbody tr:not(.win-pad) td.ds-pinned');
    rec.bPinNow = bPin ? { left: +R(bPin).left.toFixed(1), w: +R(bPin).width.toFixed(1), conn: bPin.isConnected, inSc: bPin.closest('.tableScroll') === sc, pos: getComputedStyle(bPin).position } : null;
    rec.pinNow = pin ? { left: +R(pin).left.toFixed(1), pos: getComputedStyle(pin).position } : null;
    const port = frag.parentElement;
    const oldW = sc.style.width, oldPW = port.style.width;
    sc.style.width = (sc.clientWidth - 400) + 'px';
    port.style.width = (sc.clientWidth) + 'px';
    await new Promise(r => setTimeout(r, 150));
    const max = sc.scrollWidth - sc.clientWidth;
    sc.scrollLeft = max;
    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
    const bPin2 = body.querySelector('tbody tr:not(.win-pad) td.ds-pinned');
    rec.after = {
      max,
      pin: pin ? +R(pin).left.toFixed(1) : null,
      bPin: bPin2 ? +R(bPin2).left.toFixed(1) : null,
      bConn: bPin2 ? bPin2.isConnected : null,
      bInSc: bPin2 ? bPin2.closest('.tableScroll') === sc : null,
      sameNode: bPin === bPin2,
      bodyW: body.style.width, headW: frag.style.width,
      scW: sc.clientWidth, scScrollW: sc.scrollWidth,
      tbodyRows: body.querySelectorAll('tbody tr').length
    };
    sc.scrollLeft = 0; sc.style.width = oldW; port.style.width = oldPW;
    await new Promise(r => setTimeout(r, 100));
    const bPin3 = body.querySelector('tbody tr:not(.win-pad) td.ds-pinned');
    rec.afterRestore = { bConn: bPin3 ? bPin3.isConnected : null, same: bPin === bPin3 };
    res.push(rec);
  }
  return res;
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
