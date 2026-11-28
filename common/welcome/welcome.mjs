// common/welcome/welcome.mjs
// Revision 1.3.1 | 2026-11-27 | CodeBuddy (AI) | Spec rev 1.113 — doneDwellMs holds the painted done step before the opener; label `Step 3 complete — opening…`.
// Revision 1.4.0 | 2026-11-28 | AWS Quick (AI) | C-08 / AGENTS.md §18.4 rev 2026-11-28 — optional themePicker config: a top-bar theme button (colour dot + label) beside Help, for the pre-load theme switch. The module renders the menu and calls h.onThemeChange(key); it does NOT touch localStorage or document.documentElement itself (no project data / no global side effect — the project's own handler, the same one Settings already uses, applies the theme and persists <project>-theme).
// Revision 1.4.1 | 2026-11-28 | AWS Quick (AI) | Test fixes from a user-run test report: precomputed themePickerHtml so the Help button
// stays within the Tier-7-style proximity check of the topbar; renamed menu item class is-active -> cw-is-active
// (the .cw- prefix test); the theme dot's border now reads var(--border) instead of a literal rgba().
// Revision 1.3.0 | 2026-11-27 | CodeBuddy (AI) | Spec rev 1.112 — hold limit 10000 ms; auto mode keeps step 2 current until load starts; done step paints before the dashboard opener.
// Revision 1.2.1 | 2026-11-27 | CodeBuddy (AI) | C-07 — remove the duplicate actAuto text; keep one instruction under the task heading.
// Revision 1.2.0 | 2026-11-27 | AWS Quick (AI) | C-06 — spec §3.7 rev 1.111: two-column card (navy guide panel left, task panel right, 1 : 1.618); top bar with logo and Help; three progress steps in the left panel for every mode; drop box of fixed height above the file list; file list below the drop box with a count and the ignored-file chip; Choose is primary until every file is ready, then Open dashboard; footer inside the task panel; config gains description, checks and brand.
// Revision 1.1.0 | 2026-11-27 | AWS Quick (AI) | C-04 / C-05 — spec §3.7 rev 1.110: one fixed-ratio box for the drop area and the load stage (card height does not change between states); file list pinned to the bottom of the drop area; 1–3 one-line slots, 4–6 two-column compact slots (files[] max 6); a file goes only to the slot of its own type, other files go to one ignored-file summary (C-04); set error in the top zone; success hold with Open now; visible Choose button.
// Revision 1.0.2 | 2026-11-26 | CodeBuddy (AI) | C-03 — named role=group drop area; Choose file is the keyboard path.
// Build-time only (AGENTS.md §3). ONE top-level export (module contract rule 2): CommonWelcome.
// The module holds no project data: the project passes the §3.7.2 configuration and the handlers.
// The module does not read files. The project's inspect() handler reads the Code sheet (§3.7.5).

export const CommonWelcome = (() => {
  const MAX_FILES = 6, HOLD_DEFAULT = 1500, HOLD_MAX = 10000, DWELL_DEFAULT = 0, DWELL_MAX = 10000;
  const DEFAULT_LABELS = {
    still: 'Still needed', checking: 'Checking the Code sheet…', remove: 'Remove',
    chooseOne: 'Choose file', chooseMany: 'Choose files',
    dropTitleOne: 'Drop your workbook here', dropTitleMany: 'Drop your workbooks here', or: 'or',
    hintAuto: 'The dashboard opens as soon as the file passes the check.',
    load: 'Open dashboard', loadAgain: 'Open again', loading: 'Loading…', opening: 'Opening…',
    heading: 'Start with your workbook', headingMany: 'Start with your workbooks',
    stepA: 'Choose your workbook', stepAMany: 'Choose the {n} workbooks',
    stepAText: 'Drop the Code-sheet .xlsx file here, or browse for it.', stepATextMany: 'Drop all {n} files at once, or one at a time.',
    stepB: 'Automatic check', stepBText: 'Each workbook is checked as it is added, before anything opens.',
    stepC: 'Open the dashboard', stepCText: 'It opens as soon as the file passes the check.', stepCTextMany: 'Open it when every file is ready.',
    checksHead: 'What the check looks for', filesHead: 'Your files', readyCount: '{n} of {N} ready',
    countChip: '{n} of {N} file', countChipMany: '{n} of {N} files', fileTypes: '.xlsx / .xlsm only',
    actAuto: '', actMany: 'Add all {N} workbooks and let them pass the check to open the dashboard.',
    actReady: 'All files passed the check. Open the dashboard.', actBusy: 'Loading — please wait.',
    overlayOne: 'Release to load the workbook', overlayMany: 'Release to add the files',
    overlaySub: 'Drop anywhere on the page',
    dropName: 'Drop the workbooks here, or use Choose files',
    dropNameOne: 'Drop the workbook here, or use Choose file',
    duplicate: 'Two files are the same workbook type: {title}. Choose one of each.',
    projectMismatch: 'The Project Title values do not match: {a} and {b}. Choose files from the same project. The previous selection is unchanged.',
    noMatch: 'Dashboard Title "{title}" is not a required workbook.',
    unreadable: 'Not a readable Excel workbook.',
    onlyOne: 'Only one workbook is needed.',
    ignored: '{used} of {total} files used · {count} ignored', details: 'Details', ignoredHead: 'Ignored files',
    ready: 'Dashboard ready', openingIn: 'Opening in {s} s', openNow: 'Open now',
    theme: 'Theme',
    doneNote: 'Step 3 complete — opening…',
  };

  /** Escape text for HTML. @param {*} v @returns {string} */
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  /** Fill {name} placeholders with RAW text. Escape once, at output. @param {string} s @param {object} p @returns {string} */
  const fill = (s, p) => String(s).replace(/\{(\w+)\}/g, (_, k) => String(p[k] ?? ''));

  /**
   * Check a welcome configuration against the §3.7.2 rules (schema subset, no dependency).
   * @param {object} cfg welcome configuration
   * @returns {string[]} problems; empty when valid
   */
  function validateConfig(cfg) {
    const e = [];
    if (!cfg || typeof cfg !== 'object') return ['config is not an object'];
    for (const k of ['title', 'instruction', 'help']) if (!cfg[k] || typeof cfg[k] !== 'string') e.push(`${k} is required`);
    if (!Array.isArray(cfg.files) || !cfg.files.length) e.push('files[] needs at least one entry');
    else {
      if (cfg.files.length > MAX_FILES) e.push(`files[] allows at most ${MAX_FILES} entries (spec §3.7.2 rev 1.110)`);
      cfg.files.forEach((f, i) => { if (!f.key || !f.name || !f.dashboardTitle) e.push(`files[${i}] needs key, name and dashboardTitle`); });
      if (new Set(cfg.files.map(f => f.key)).size !== cfg.files.length) e.push('files[].key must be unique');
      if (new Set(cfg.files.map(f => f.dashboardTitle)).size !== cfg.files.length) e.push('files[].dashboardTitle must be unique');
      const want = cfg.files.length === 1 ? 'auto' : 'confirm';
      if (cfg.mode !== want) e.push(`mode must be "${want}" for ${cfg.files.length} file(s)`);
    }
    if (cfg.successHoldMs !== undefined && !(Number.isInteger(cfg.successHoldMs) && cfg.successHoldMs >= 0 && cfg.successHoldMs <= HOLD_MAX)) e.push(`successHoldMs must be an integer 0–${HOLD_MAX}`);
    if (cfg.doneDwellMs !== undefined && !(Number.isInteger(cfg.doneDwellMs) && cfg.doneDwellMs >= 0 && cfg.doneDwellMs <= DWELL_MAX)) e.push(`doneDwellMs must be an integer 0–${DWELL_MAX}`);
    if (cfg.logo?.src && !/^data:/.test(cfg.logo.src)) e.push('logo.src must be a data: URI (spec §3.9)');
    if (cfg.checks !== undefined && !(Array.isArray(cfg.checks) && cfg.checks.length <= 5 && cfg.checks.every(x => typeof x === 'string' && x))) e.push('checks[] must hold 0–5 non-empty strings (spec §3.7.3 rev 1.111)');
    if (cfg.description !== undefined && typeof cfg.description !== 'string') e.push('description must be a string');
    if (cfg.themePicker !== undefined) {
      const tp = cfg.themePicker;
      if (!Array.isArray(tp.themes) || !tp.themes.length) e.push('themePicker.themes[] must hold at least one entry');
      else if (tp.themes.some(x => !x.key || !x.label || !x.dot)) e.push('themePicker.themes[] entries need key, label and dot');
      if (tp.current && !(tp.themes || []).some(x => x.key === tp.current)) e.push('themePicker.current must match a themes[].key');
    }
    return e;
  }

  /**
   * Pure state reducer for the welcome. Exported for Node tests.
   * @param {object} s current state
   * @param {object} a action {type, ...}
   * @returns {object} next state
   */
  function reduce(s, a) {
    const slots = { ...s.slots };
    switch (a.type) {
      case 'checking': for (const k of a.keys) slots[k] = { state: 'checking' }; return { ...s, slots, alert: '' };
      case 'accept': slots[a.key] = { state: 'accepted', fileName: a.fileName, dashboardTitle: a.dashboardTitle, projectTitle: a.projectTitle }; return { ...s, slots };
      case 'reject': slots[a.key] = { state: 'rejected', fileName: a.fileName, reason: a.reason }; return { ...s, slots };
      case 'remove': slots[a.key] = { state: 'needed' }; return { ...s, slots, alert: '', ignored: [], picked: 0, used: 0 };
      case 'restore': return { ...s, slots: { ...a.slots }, alert: a.alert || '', ignored: a.ignored || [], picked: a.picked || 0, used: a.used || 0 };
      case 'phase': return { ...s, view: 'loading', phase: a.index, failed: null, alert: '', ignored: [] };
      case 'fail': return { ...s, view: 'slots', phase: a.index, failed: a.index, alert: a.reason, retry: true };
      case 'ready': return { ...s, view: 'ready', phase: a.phases };
      case 'done': return { ...s, view: 'done' };
      default: return s;
    }
  }

  /**
   * Decide what a picked set of files does to the slots (§3.7.5 rev 1.110, C-04). Pure; exported for tests.
   * A file goes only to the slot of its own type (by Dashboard Title). A failed file marks a slot only
   * when its type is known and that slot is not already accepted (in auto mode: the one slot). Every
   * other failed or unrequired file is ignored and listed in the summary; it never changes a slot.
   * @param {object} cfg welcome configuration
   * @param {{file:{name:string}, r:{ok:boolean, dashboardTitle?:string, projectTitle?:string, reason?:string}}[]} results
   * @param {object} beforeSlots slots before this pick
   * @param {object} [L] labels
   * @returns {{setError:string}|{slots:object, accepted:object, ignored:{file:string,reason:string}[], used:number, picked:number}}
   */
  function plan(cfg, results, beforeSlots, L = DEFAULT_LABELS) {
    const multi = cfg.files.length > 1;
    const typed = results.map(x => {
      const f = x.r.dashboardTitle ? cfg.files.find(c => c.dashboardTitle === x.r.dashboardTitle) || null : null;
      const r = x.r.ok && !f ? { ...x.r, ok: false, reason: fill(L.noMatch, { title: x.r.dashboardTitle }) } : x.r;
      return { file: x.file, r, f };
    });
    const ok = typed.filter(x => x.r.ok);
    const keys = ok.map(x => x.f.key);
    const dup = keys.findIndex((k, i) => keys.indexOf(k) !== i);
    if (dup >= 0) return { setError: fill(L.duplicate, { title: ok[dup].r.dashboardTitle }) };
    const slots = { ...beforeSlots }, accepted = {};
    for (const x of ok) { slots[x.f.key] = { state: 'accepted', fileName: x.file.name, dashboardTitle: x.r.dashboardTitle, projectTitle: x.r.projectTitle }; accepted[x.f.key] = x.file; }
    const projects = [...new Set(Object.values(slots).filter(v => v.state === 'accepted').map(v => v.projectTitle).filter(Boolean))];
    if (projects.length > 1) return { setError: fill(L.projectMismatch, { a: projects[0], b: projects[1] }) };
    const ignored = [], rejectedNow = new Set();
    for (const x of typed.filter(y => !y.r.ok)) {
      const target = multi ? x.f : cfg.files[0];
      const reason = x.r.reason || L.unreadable;
      if (target && slots[target.key].state !== 'accepted' && !rejectedNow.has(target.key)) {
        slots[target.key] = { state: 'rejected', fileName: x.file.name, reason }; rejectedNow.add(target.key);
      } else ignored.push({ file: x.file.name, reason });
    }
    return { slots, accepted, ignored, used: ok.length, picked: typed.length };
  }

  /** Count accepted slots. @param {object} s @returns {number} */
  const acceptedCount = s => Object.values(s.slots).filter(x => x.state === 'accepted').length;

  /**
   * Render the welcome and wire its behaviour.
   * @param {HTMLElement} root element that receives the welcome screen
   * @param {object} cfg §3.7.2 welcome configuration
   * @param {object} h handlers:
   *   inspect(file) → Promise<{ok, dashboardTitle, projectTitle, reason}> reads the Code sheet only;
   *   load(filesByKey, report) → Promise<opener|void>; report(i) marks phase i running; throw {phase, message} to fail.
   *     Return a function that reveals the dashboard; the module calls it after the success hold (§3.7.7 rev 1.110).
   *     A load that returns nothing opens the dashboard itself and gets no hold (1.0.x behaviour).
   *   onHelp(); onStatus(level, message) for §11 messaging.
   * @returns {{ destroy():void, state():object, accept(files:File[]):Promise<void> }}
   */
  function render(root, cfg, h = {}) {
    const problems = validateConfig(cfg);
    const status = (lvl, msg) => { try { h.onStatus?.(lvl, 'CommonWelcome: ' + msg); } catch { /* never block */ } };
    if (problems.length) { status('error', 'invalid config — ' + problems.join('; ')); throw new Error('CommonWelcome config: ' + problems.join('; ')); }
    const L = { ...DEFAULT_LABELS, ...(cfg.labels || {}) };
    const N = cfg.files.length, multi = N > 1;
    const phases = cfg.phases?.length ? cfg.phases : ['Reading the workbook', 'Checking the data', 'Building the dashboard'];
    const hold = cfg.successHoldMs ?? HOLD_DEFAULT;
    const dwell = cfg.doneDwellMs ?? DWELL_DEFAULT;
    const cols = N >= 4 ? ' is-cols' : '';
    const files = {};
    let s = { slots: Object.fromEntries(cfg.files.map(f => [f.key, { state: 'needed' }])), alert: '', ignored: [], picked: 0, used: 0, view: 'slots', phase: -1, failed: null, retry: false };
    let opener = null, holdTimer = null, dwellTimer = null, tick = null, popOpen = false;
    const set = a => { s = reduce(s, a); paint(); };
    const doc = root.ownerDocument;
    const year = new Date().getFullYear();

    const many = (one, more) => multi ? more : one;
    const themePickerHtml = cfg.themePicker ? `<div class="cw-theme"><button type="button" class="cw-theme-btn" aria-haspopup="true" aria-expanded="false"><span class="cw-theme-dot" aria-hidden="true"></span><span class="cw-theme-label">${esc(L.theme)}</span></button><div class="cw-theme-menu" role="menu" hidden></div></div>` : '';
    root.innerHTML = `<div class="cw-screen" role="main">
      <div class="cw-center"><section class="cw-card ${multi ? 'is-confirm' : 'is-auto'}" aria-labelledby="cw-title">
        <header class="cw-topbar">
          <div class="cw-brand">${cfg.logo?.src ? `<img class="cw-logo" src="${esc(cfg.logo.src)}" alt="${esc(cfg.logo.alt || '')}">` : ''}
            ${cfg.brand?.name ? `<span class="cw-brand-t"><b>${esc(cfg.brand.name)}</b>${cfg.brand.tagline ? `<small>${esc(cfg.brand.tagline)}</small>` : ''}</span>` : ''}</div>
          <div class="cw-topbar-actions">${themePickerHtml}<button type="button" class="cw-help"><span class="cw-help-ic" aria-hidden="true">?</span>${esc(cfg.help)}</button></div>
        </header>
        <div class="cw-cols">
          <aside class="cw-left">
            <h1 class="cw-title" id="cw-title">${esc(cfg.title)}</h1>
            ${cfg.description ? `<p class="cw-desc">${esc(cfg.description)}</p>` : ''}
            <ol class="cw-steps" aria-label="Progress"></ol>
            ${cfg.checks?.length ? `<div class="cw-checks"><h2 class="cw-checks-h">${esc(L.checksHead)}</h2><ul>${cfg.checks.map(x => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
          </aside>
          <div class="cw-right">
            <div class="cw-intro"><h2 class="cw-h">${esc(many(L.heading, L.headingMany))}</h2><p class="cw-instr">${esc(cfg.instruction)}</p></div>
            <div class="cw-body"></div>
            <div class="cw-lh"><span class="cw-lh-t">${esc(L.filesHead)}<span class="cw-sum-host"></span></span><span class="cw-lh-n"></span></div>
            <ul class="cw-slots${cols}" aria-live="polite"></ul>
            <div class="cw-pop-host"></div>
            <div class="cw-actions"><span class="cw-act"></span><p class="cw-act-t"></p></div>
            <footer class="cw-foot"><span>${esc(cfg.footer?.privacy || '')}</span><span>${esc(cfg.footer?.version || '')}${cfg.footer?.version ? ' · ' : ''}© ${year} ${esc(cfg.footer?.owner || '')}</span></footer>
          </div>
        </div>
      </section></div>
      <input type="file" class="cw-input" accept=".xlsx,.xlsm" ${multi ? 'multiple' : ''} hidden>
    </div>
    <div class="cw-overlay" aria-hidden="true"><div class="cw-overlay-box">${esc(multi ? L.overlayMany : L.overlayOne)}<small>${esc(L.overlaySub)}</small></div></div>`;
    const $ = sel => root.querySelector(sel);
    const input = $('.cw-input');

    /** Repaint steps, drop box, file list, summary and actions from state. */
    function paint() {
      const n = acceptedCount(s), busy = s.view === 'loading', after = s.view === 'ready' || s.view === 'done';
      // left panel: three steps, the same in every mode (§3.7.6 rev 1.111)
      const checking = Object.values(s.slots).some(x => x.state === 'checking');
      const step = after || busy ? 3 : multi ? (n === N ? 3 : (n > 0 || checking ? 2 : 1)) : (checking || n > 0 ? 2 : 1);
      const steps = [[many(L.stepA, fill(L.stepAMany, { n: N })), many(L.stepAText, fill(L.stepATextMany, { n: N }))],
        [L.stepB, L.stepBText], [L.stepC, many(L.stepCText, L.stepCTextMany)]];
      $('.cw-steps').innerHTML = steps.map(([t, d], i) => {
        const k = i + 1, c = (k < step || (k === 3 && s.view === 'done')) ? 'is-done' : k === step ? 'is-now' : '';
        return `<li class="cw-step ${c}"${c === 'is-now' ? ' aria-current="step"' : ''}><span class="cw-step-n" aria-hidden="true">${c === 'is-done' ? '✓' : k}</span><span><b>${esc(t)}</b><span class="cw-step-d">${esc(d)}</span></span></li>`;
      }).join('');
      // drop box or load stage — one fixed-height box (§3.7.1 rev 1.111)
      if (busy || after) {
        const at = after ? phases.length : s.phase;
        $('.cw-body').innerHTML = `<div class="cw-box cw-stage${after ? ' is-ready' : ''}">
          <ol class="cw-phases" aria-live="polite"${busy ? ' aria-busy="true"' : ''}>${phases.map((p, i) => {
            const c = i < at ? 'is-done' : i === at ? 'is-running' : '';
            return `<li class="cw-phase ${c}"><span class="cw-phase-d" aria-hidden="true">${c === 'is-done' ? '✓' : ''}</span>${esc(p)}${c === 'is-running' ? '…' : ''}</li>`;
          }).join('')}</ol>
          ${after ? `<div class="cw-ready" role="status"><span class="cw-ready-ic" aria-hidden="true">✓</span><div><b>${esc(L.ready)}</b><div class="cw-ready-s">${s.view === 'done' ? esc(L.doneNote) : esc(fill(L.openingIn, { s: (hold / 1000).toFixed(1) }))}</div></div>
            <button type="button" class="btn cw-open"${s.view === 'done' ? ' disabled' : ''}>${esc(L.openNow)}</button></div>` : ''}
          <div class="cw-bar"><i style="width:${after ? 100 : Math.round(Math.max(0, at) / phases.length * 100)}%"></i></div></div>`;
      } else {
        const err = !!s.alert;
        $('.cw-body').innerHTML = `<div class="cw-box cw-drop" role="group" aria-label="${esc(multi ? L.dropName : L.dropNameOne)}">
          <span class="cw-count">${esc(fill(many(L.countChip, L.countChipMany), { n, N }))}</span>
          <div class="cw-top${err ? ' is-err' : ''}">
            <span class="cw-drop-ic" aria-hidden="true">${err ? '!' : '⇪'}</span>
            <div class="cw-alert" role="alert">${esc(s.alert)}</div>
            <div class="cw-drop-t">${esc(multi ? L.dropTitleMany : L.dropTitleOne)}</div>
            <div class="cw-or">${esc(L.or)}</div>
            <button type="button" class="btn cw-choose${n < N ? ' btn-primary' : ''}">${esc(multi ? L.chooseMany : L.chooseOne)}</button>
            <div class="cw-prog" aria-hidden="true"><i style="width:${Math.round(n / N * 100)}%"></i></div>
            <div class="cw-types">${esc(L.fileTypes)}</div>
          </div></div>`;
      }
      // file list below the box: states only, rows never added or removed (§3.7.4 rev 1.111)
      $('.cw-slots').innerHTML = cfg.files.map((f, i) => slotHtml(f, i)).join('');
      $('.cw-lh-n').textContent = fill(L.readyCount, { n, N });
      const k = s.ignored.length;
      $('.cw-sum-host').innerHTML = k ? `<span class="cw-sum" role="status" data-ignored="${k}">${esc(fill(L.ignored, { used: s.used, total: s.picked, count: k }))}
          <button type="button" class="cw-sum-d" aria-expanded="${popOpen}" aria-controls="cw-pop">${esc(L.details)}</button></span>` : '';
      $('.cw-pop-host').innerHTML = k ? `<div class="cw-pop" id="cw-pop" role="region" aria-label="${esc(L.ignoredHead)}"${popOpen ? '' : ' hidden'}><b>${esc(L.ignoredHead)}</b>
          <ul>${s.ignored.map(x => `<li><b>${esc(x.file)}</b> — ${esc(x.reason)}</li>`).join('')}</ul></div>` : '';
      // action row: Open dashboard (confirm mode) becomes primary only when every file is ready (§3.7.6 rev 1.111)
      const canOpen = n === N && !(s.alert && !s.retry) && !busy && !after;
      $('.cw-act').innerHTML = multi
        ? `<button type="button" class="btn cw-load${canOpen ? ' btn-primary' : ''}" ${canOpen ? '' : 'disabled'}>${esc(busy ? L.loading : after ? L.opening : s.retry ? L.loadAgain : n < N ? `${L.load} (${n} of ${N})` : L.load)} <span aria-hidden="true">→</span></button>`
        : '';
      $('.cw-act-t').textContent = busy || after ? L.actBusy : n === N ? L.actReady : many(L.actAuto, fill(L.actMany, { N }));
      if (busy) root.querySelectorAll('button').forEach(b => { if (!b.classList.contains('cw-help')) b.disabled = true; });
    }

    /** Render the theme menu options and keep the button's dot/label in sync with cfg.themePicker.current. */
    function paintTheme() {
      const tp = cfg.themePicker; if (!tp) return;
      const cur = tp.themes.find(x => x.key === tp.current) || tp.themes[0];
      $('.cw-theme-dot').style.background = cur.dot;
      $('.cw-theme-label').textContent = cur.label;
      $('.cw-theme-menu').innerHTML = tp.themes.map(x => `<button type="button" role="menuitem" class="${x.key === cur.key ? 'cw-is-active' : ''}" data-theme-key="${esc(x.key)}">
        <span class="cw-theme-dot" aria-hidden="true" style="background:${esc(x.dot)}"></span>${esc(x.label)}</button>`).join('');
    }

    /** One slot. One line for 1–3 files; compact (icon status) for 4–6. @param {object} f @param {number} i @returns {string} */
    function slotHtml(f, i) {
      const x = s.slots[f.key], st = x.state;
      const mark = st === 'accepted' ? '✓' : st === 'rejected' ? '!' : i + 1;
      const full = st === 'accepted' ? `${x.fileName} · ${x.dashboardTitle}` : st === 'rejected' ? x.reason : st === 'checking' ? L.checking : L.still;
      const icon = { accepted: '✓', rejected: '✗', checking: '⟳', needed: '○' }[st];
      const text = cols ? icon : `${st === 'checking' ? '' : icon + ' '}${full}`;
      const rm = st === 'accepted' || st === 'rejected';
      return `<li class="cw-slot is-${st}" data-key="${esc(f.key)}" title="${esc(f.name + ' — ' + full)}"><span class="cw-slot-n" aria-hidden="true">${mark}</span>
        <span class="cw-slot-name"><b>${esc(f.name)}</b></span><span class="cw-slot-st"${cols ? ' aria-hidden="true"' : ''}>${esc(text)}</span>
        ${rm ? `<button type="button" class="cw-remove" data-remove="${esc(f.key)}" aria-label="${esc(L.remove + ' ' + f.name)}">✕</button>` : '<span></span>'}${cols ? `<span class="cw-sr">${esc(full)}</span>` : ''}</li>`;
    }

    /**
     * Check the picked files, then commit them (§3.7.5 rev 1.110). File errors go to the slot of their
     * own type; unrequired or untyped files go to the ignored summary; set errors go to the alert.
     * @param {File[]} picked
     */
    async function accept(picked) {
      if (!picked.length || s.view !== 'slots') return;
      let extra = [];
      if (!multi && picked.length > 1) { extra = picked.slice(1).map(f => ({ file: f.name, reason: L.onlyOne })); picked = picked.slice(0, 1); }
      const beforeSlots = { ...s.slots }, beforeFiles = { ...files };
      if (!multi) set({ type: 'checking', keys: [cfg.files[0].key] });
      const results = [];
      for (const file of picked) {
        let r;
        try { r = await h.inspect(file); } catch (e) { r = { ok: false, reason: L.unreadable + (e?.message ? ' ' + e.message : '') }; }
        results.push({ file, r: r || { ok: false, reason: L.unreadable } });
      }
      const p = plan(cfg, results, beforeSlots, L);
      popOpen = false;
      if (p.setError) { set({ type: 'restore', slots: beforeSlots, alert: p.setError }); status('warning', 'set error: ' + p.setError); return; }
      for (const k of Object.keys(files)) delete files[k];
      Object.assign(files, beforeFiles, p.accepted);
      for (const k of Object.keys(p.slots)) if (p.slots[k].state !== 'accepted') delete files[k];
      const ignored = [...p.ignored, ...extra];
      set({ type: 'restore', slots: p.slots, alert: '', ignored, picked: p.picked + extra.length, used: p.used });
      ignored.forEach(x => status('warning', `ignored: ${x.file} — ${x.reason}`));
      if (!multi && p.slots[cfg.files[0].key].state === 'accepted') {
        await new Promise(r => (typeof requestAnimationFrame === 'function'
          ? requestAnimationFrame(() => requestAnimationFrame(r))
          : setTimeout(r, 0)));
        await load();
      }
    }

    /** Run the load phases, then the success hold (§3.7.7 rev 1.110). */
    async function load() {
      popOpen = false;
      set({ type: 'phase', index: 0 });
      let out;
      try {
        out = await h.load({ ...files }, i => set({ type: 'phase', index: i }));
      } catch (e) {
        const i = Number.isInteger(e?.phase) ? e.phase : Math.max(0, s.phase);
        set({ type: 'fail', index: i, reason: e?.message || String(e) });
        status('error', 'load failed at phase ' + i + ': ' + (e?.message || e));
        return;
      }
      opener = typeof out === 'function' ? out : null;
      if (!opener || hold <= 0) { finish(); return; }
      const end = Date.now() + hold;
      set({ type: 'ready', phases: phases.length });
      const bar = $('.cw-stage .cw-bar > i');
      if (bar) {
        bar.style.transitionDuration = '0ms'; bar.style.width = '100%';
        const go = () => { bar.style.transitionDuration = hold + 'ms'; bar.style.width = '0%'; };
        if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => requestAnimationFrame(go)); else go();
      }
      $('.cw-open')?.focus();
      tick = setInterval(() => { const el = $('.cw-ready-s'); if (el) el.textContent = fill(L.openingIn, { s: (Math.max(0, end - Date.now()) / 1000).toFixed(1) }); }, 100);
      holdTimer = setTimeout(finish, hold);
      status('info', `load complete; success hold ${hold} ms`);
    }

    /** End the hold and reveal the dashboard. Safe to call twice. */
    function finish() {
      clearTimeout(holdTimer); clearTimeout(dwellTimer); clearInterval(tick); holdTimer = dwellTimer = tick = null;
      if (s.view === 'done') return;
      set({ type: 'done' });
      const o = opener; opener = null;
      const reveal = () => {
        try { o?.(); } catch (e) { status('error', 'open failed: ' + (e?.message || e)); }
        status('info', 'opened');
      };
      if (dwell > 0) { dwellTimer = setTimeout(reveal, dwell); status('info', `done-step dwell ${dwell} ms`); }
      else if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => requestAnimationFrame(reveal));
      else setTimeout(reveal, 0);
    }

    // ----- events -----
    const onClick = ev => {
      const t = ev.target;
      if (t.closest('.cw-remove')) { const k = t.closest('.cw-remove').dataset.remove; delete files[k]; set({ type: 'remove', key: k }); return; }
      if (t.closest('.cw-help')) { h.onHelp?.(); return; }
      if (t.closest('.cw-theme-btn')) {
        const open = $('.cw-theme-menu').hidden; $('.cw-theme-menu').hidden = !open;
        $('.cw-theme-btn').setAttribute('aria-expanded', String(open)); return;
      }
      if (t.closest('[data-theme-key]')) {
        const key = t.closest('[data-theme-key]').dataset.themeKey;
        cfg.themePicker.current = key; paintTheme(); $('.cw-theme-menu').hidden = true;
        $('.cw-theme-btn').setAttribute('aria-expanded', 'false'); h.onThemeChange?.(key); return;
      }
      if (t.closest('.cw-load')) { load(); return; }
      if (t.closest('.cw-open')) { finish(); return; }
      if (t.closest('.cw-sum-d')) {
        popOpen = !popOpen; const pop = $('#cw-pop'); if (pop) pop.hidden = !popOpen;
        t.closest('.cw-sum-d').setAttribute('aria-expanded', String(popOpen)); return;
      }
      if (t.closest('.cw-pop') || t.closest('.cw-sum')) return;
      if (!t.closest('.cw-theme')) { const m = $('.cw-theme-menu'); if (m && !m.hidden) { m.hidden = true; $('.cw-theme-btn')?.setAttribute('aria-expanded', 'false'); } }
      if (s.view === 'slots' && (t.closest('.cw-choose') || t.closest('.cw-drop'))) input.click();
    };
    const onKey = ev => {
      if (s.view === 'ready' && (ev.key === 'Enter' || ev.key === 'Escape')) { ev.preventDefault(); finish(); return; }
      if (popOpen && ev.key === 'Escape') { popOpen = false; const pop = $('#cw-pop'); if (pop) pop.hidden = true; $('.cw-sum-d')?.setAttribute('aria-expanded', 'false'); $('.cw-sum-d')?.focus(); }
    };
    const onChange = () => { accept([...input.files]); input.value = ''; };
    const ov = root.querySelector('.cw-overlay');
    let depth = 0;
    const onDragEnter = ev => { if (s.view !== 'slots') return; ev.preventDefault(); depth++; ov.classList.add('is-on'); };
    const onDragOver = ev => { ev.preventDefault(); };
    const onDragLeave = () => { depth = Math.max(0, depth - 1); if (!depth) ov.classList.remove('is-on'); };
    const onDrop = ev => { ev.preventDefault(); depth = 0; ov.classList.remove('is-on'); accept([...(ev.dataTransfer?.files || [])]); };
    root.addEventListener('click', onClick); input.addEventListener('change', onChange);
    doc.addEventListener('keydown', onKey);
    doc.addEventListener('dragenter', onDragEnter); doc.addEventListener('dragover', onDragOver);
    doc.addEventListener('dragleave', onDragLeave); doc.addEventListener('drop', onDrop);
    paint(); status('info', `rendered (${cfg.mode}, ${N} file(s), hold ${hold} ms)`);
    paintTheme();

    return {
      state: () => JSON.parse(JSON.stringify(s)),
      /** Test hook: same path as a user drop (§3.7.5 — classify by Dashboard Title). */
      accept,
      destroy() {
        clearTimeout(holdTimer); clearTimeout(dwellTimer); clearInterval(tick);
        root.removeEventListener('click', onClick); doc.removeEventListener('keydown', onKey);
        doc.removeEventListener('dragenter', onDragEnter); doc.removeEventListener('dragover', onDragOver);
        doc.removeEventListener('dragleave', onDragLeave); doc.removeEventListener('drop', onDrop);
        root.innerHTML = '';
      },
    };
  }

  return Object.freeze({ version: '1.4.0', MAX_FILES, DEFAULT_LABELS, validateConfig, reduce, plan, render });
})();
