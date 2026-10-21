// throwaway: per-column delta for a split-header pair, at the harness viewport
import { chromium } from 'playwright';
import { pathToFileURL, fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';
import { readFileSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const { default: cfg } = await import(pathToFileURL(resolve(here, 'checks/mdl.mjs')).href);
const bytes = Array.from(readFileSync(resolve(here, cfg.defaultWorkbook)));

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(cfg.htmlPath).href);
await page.evaluate(async ([b, name]) => {
  const ab = new Uint8Array(b).buffer;
  const file = new File([ab], name, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  if (typeof window._loadFile === 'function') await window._loadFile(file);
  else {
    const dt = new DataTransfer(); dt.items.add(file);
    const drop = document.querySelector('.drop');
    if (drop) drop.dispatchEvent(new DragEvent('drop', { dataTransfer: dt, bubbles: true }));
  }
}, [bytes, 'wb.xlsx']);
await page.waitForSelector('.status-bar:not([hidden])', { timeout: 15000 }).catch(() => {});
await page.evaluate(() => { document.querySelectorAll('details.vdetails').forEach(d => { d.open = true; }); });
await page.waitForTimeout(700);

const out = await page.evaluate(() => {
  const R = el => el.getBoundingClientRect();
  const r1 = v => Math.round(v * 10) / 10;
  const dump = id => {
    const hd = document.getElementById(id);
    const sc = hd.closest('.splitcard').querySelector('.tableScroll');
    const bt = sc.querySelector('table');
    const rows = [...bt.querySelectorAll('tbody tr')];
    const row = rows.find(x => x.children.length > 1) || rows[0];
    const th = [...hd.querySelectorAll('thead th')].filter(t => !t.classList.contains('ds-gut'));
    const td = [...row.children];
    return {
      vw: window.innerWidth,
      scrollerClient: sc.clientWidth, scrollerOffset: sc.offsetWidth,
      headTableW: r1(R(hd).width), headStyleW: hd.style.width,
      headCols: [...hd.querySelectorAll('colgroup col')].map(c => c.style.width),
      perCol: th.map((t, i) => ({
        col: (t.textContent || '').trim().slice(0, 11),
        dLeft: td[i] ? r1(R(t).left - R(td[i]).left) : null,
        dWidth: td[i] ? r1(R(t).width - R(td[i]).width) : null,
        thW: r1(R(t).width), tdW: td[i] ? r1(R(td[i]).width) : null,
      })),
      gutW: r1(R([...hd.querySelectorAll('thead th')].pop()).width),
    };
  };
  return { issue: dump('vHead'), overdue: dump('ovHead') };
});
console.log(JSON.stringify(out, null, 1));
await browser.close();
