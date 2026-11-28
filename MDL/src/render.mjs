// Revision 1.10 | 2026-11-28 | AWS Quick (AI) | Header text/fill root-cause fix: several table-header rules used
// var(--navy)/var(--on-fill) directly — in ocean and presentation themes these two tokens are BOTH dark
// (on-fill is tuned for text on a bright accent button, not navy), so the untinted header text contrast
// was only ~1.1:1, and in sky, --navy equals --accent, making the crosshair edge invisible on headers.
// All header fill/text rules now use var(--thead-bg,var(--navy)) / var(--thead-fg,var(--on-fill)) — the
// tokens actually designed for header surfaces, already AA-safe in every theme and never equal to
// --accent. The crosshair's existing background-color/box-shadow layers inherit the fix automatically
// since they composite over whatever the base background now is.
// Revision 1.9 | 2026-11-28 | CodeBuddy (AI) | Crosshair specificity closure — the C1 row header keeps 700 weight under the curve table rule. A pinned active cell keeps the strong 14%/22% tint when its row is also hovered.
// Revision 1.8 | 2026-11-28 | CodeBuddy (AI) | Spec rev 1.116 — the shared crosshair binder adds ArrowLeft / ArrowRight / ArrowUp / ArrowDown cell movement and makes data cells focusable. Pinned cells layer the tint over their own zebra/soft fill.
// Revision 1.7 | 2026-11-28 | AWS Quick (AI) | Crosshair redesigned to the user's 20-point contract: background-color
// true-alpha tiers (--crosshair-faint/-medium/-strong, moved to common/tokens so each theme sets its own
// AA-verified opacity) replace the opaque linear-gradient fill, so zebra/status colours underneath show
// through. Exactly 3 tiers (was 4 independent opacities). Active-cell outline 1px -> 2px. Column AND row
// headers now get the medium tier, bold text, and a 2px accent edge (bottom / right respectively) — row
// headers previously had no crosshair rule at all. Same fix applied to the Issue Progress C1 table.
// Revision 1.6 | 2026-11-28 | AWS Quick (AI) | User-reported regression: the crosshair overlay/track tokens had been
// aliased to var(--soft), an OPAQUE fill, which hid cell text under dark/ocean/presentation themes and
// made --crosshair-ring/--header-crosshair-accent read as a strong, undampened accent color. Fixed by
// using color-mix(in srgb, var(--accent) N%, var(--surface)) for the three overlay/wash tokens, restoring
// the original rgba(blue,.14/.22/.16)-style translucent wash, now correctly theme-aware. The ring/accent
// (1px/2px border-like, never a fill) stay solid var(--accent) — that part was already correct.
// Revision 1.5 | 2026-11-28 | AWS Quick (AI) | I-166 / common C-08 — theme rework (T1-T5). boot() now calls applyShellPrefs()
// before CommonWelcome.render() so the welcome page honours the saved theme (T1). Theme keys renamed
// navy/sepia -> sky/ocean/presentation to match the spec's six names (old saved values fall back to
// light, the existing fallback). Local :root now holds only MDL-only tokens; the ~45 shared theme-
// definition values and the 12 body[data-theme=...] override blocks are gone, replaced by the inlined
// common/tokens/tokens.css (T2-T4; all 80 in-scope hard-coded hex literals in component rules repointed
// to tokens, 2 left as-is: one inside a code comment, one in an intentional @media print rule). COLORS/
// PALETTE kept as fallback tables only; a new CHART()/CHART_SERIES() helper resolves colors from the live
// theme via getComputedStyle at paint time (T5), same pattern already used by curveExportMarkup().
// Revision 1.3 | 2026-11-27 | CodeBuddy (AI) | Dashboard version 1.9 — APP_VERSION follows the MDL workplan.
// Revision 1.2 | 2026-11-27 | AWS Quick (AI) | I-165 — common welcome 1.1.0: the load handler returns an opener, so CommonWelcome shows the success hold before the dashboard paints (spec §3.7.7 rev 1.110).
// Revision 1.1 | 2026-11-26 | CodeBuddy (AI) | I-164 W3 — replace the local welcome with CommonWelcome.render() and Code-sheet-first handlers.
// render.mjs — DOM rendering + filters + export for the MDL dashboard (browser).
// Uses pipeline.buildModel + xlsx-reader.readXlsx. No external dependencies.
import { readXlsx } from './xlsx-reader.mjs';
import { buildModel, parseCodeSheet, EXCLUDE_STAGES, approvalCategory } from './pipeline.mjs';

const COLORS = { blue:'#1E88E5', green:'#2E7D32', amber:'#F9A825', red:'#C62828', slate:'#64748B', navy:'#0F2D52', grey:'#B8C2CC', blueGrey:'#78909C', purple:'#8E24AA' };
const PALETTE = ['#1E88E5','#2E7D32','#F9A825','#C62828','#64748B','#7E57C2','#26A69A','#EC407A','#8D6E63','#42A5F5','#9CCC65','#FF7043'];
// I-166 / common C-08 (T5) — COLORS/PALETTE below are now fallback tables only. CHART() resolves the
// live theme's --chart-1..6 / semantic tokens at paint time via getComputedStyle, same pattern already
// used by curveExportMarkup() for var(--blue) resolution. Charts built while off-DOM or before first
// paint (rare) fall back to the literal tables so nothing renders unstyled.
const CHART_KEY_TO_VAR = { blue:'blue', green:'green', amber:'amber', red:'red', navy:'navy', slate:'slate',
  grey:'status-neutral-fg', blueGrey:'status-neutral2-fg', purple:'status-purple-fg' };
function CHART(key){
  try{
    const v = getComputedStyle(document.body).getPropertyValue('--'+(CHART_KEY_TO_VAR[key]||key)).trim();
    return v || COLORS[key];
  }catch(e){ return COLORS[key]; }
}
function CHART_SERIES(i){
  try{
    const v = getComputedStyle(document.body).getPropertyValue('--chart-'+(1+(i%6))).trim();
    return v || PALETTE[i%PALETTE.length];
  }catch(e){ return PALETTE[i%PALETTE.length]; }
}
const F = 'font-family="\'Segoe UI\', system-ui, -apple-system, \'Inter\', \'Source Sans Pro\', Roboto, Helvetica, Arial, sans-serif"';
const esc = s => (s == null ? '' : String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const LOGO_DATA = '__LOGO_DATA__'; // replaced with an embedded base64 data-URI at build time
const APP_VERSION = '1.9';
const KPI_TIP_META = {
  'Total Planned': ['Active documents in the planned register.', 'Document No. (M), Stage (B)', 'Count documents with a Document No. and an active Stage.'],
  'Submitted': ['Documents with an authoritative first issue date.', 'Actual 1st Issue Date (U)', 'Count active documents where U is not blank. A date formula error also counts as submitted.'],
  'Approved (APP)': ['Documents approved without comments.', 'Latest Approval Status (Y), U', 'Count active submitted documents whose approval category is APP.'],
  'Approved w/ Comments': ['Documents approved with comments.', 'Latest Approval Status (Y), U', 'Count active submitted documents whose approval category is AWC.'],
  'Rejected (REJ)': ['Documents rejected at review.', 'Latest Approval Status (Y), U', 'Count active submitted documents whose approval category is REJ.'],
  'Not Approved (NAP)': ['Documents marked not approved.', 'Latest Approval Status (Y), U', 'Count active submitted documents whose approval category is NAP.'],
  'Pending Review': ['Submitted documents awaiting an approval outcome.', 'Actual 1st Issue Date (U), Y', 'Count active documents in the Submitted – Pending Review category.'],
  'Not Submitted': ['Active documents with no first issue date.', 'Actual 1st Issue Date (U)', 'Count active documents with blank U and no approval category.'],
  'Record Error': ['Active documents with inconsistent submission or approval data.', 'U, Y, approval classifier', 'Count active documents in the Record Error category.'],
  'Overdue – 1st Sub': ['First submission past its due date.', 'Forecast (T), Planned (S), Actual (U)', 'Count active documents with due ≤ today and blank U. T falls back to S.'],
  'Overdue – Resub': ['Resubmission past the allowed working days.', 'Y, Latest Approval Date (X), U', 'Count REJ/RTR documents more than 14 working days after X.'],
  'Overdue – Client': ['Client review return past the allowed working days.', 'Submission Status (W), U', 'Count SUR documents more than 20 working days after U.'],
  'As-Built Required (YES)': ['Documents that require as-built submission.', 'As-Built (P)', 'Count active documents where P equals YES.'],
  'Vendor Data (YES)': ['Documents to be produced by the vendor.', 'Vendor Data (R)', 'Count active documents where R equals YES.'],
  'Data Completeness': ['Data-quality health of the active register.', 'Validation issues V-17…V-27', 'Percentage of active documents with no issue in the completeness group.'],
  'Active Disciplines': ['Distinct UESH disciplines in the active register.', 'UESH Discipline (C)', 'Count distinct non-blank C values among active documents.'],
};
function kpiTipHtml(label, asof, token){
  const m = KPI_TIP_META[label] || ['KPI detail.', '—', 'No definition is recorded.'];
  const t = token || 'var(--blue)';
  return '<b><span class="kpi-tip-swatch" style="--tip-swatch:' + t + '"></span>' + esc(label) + '</b>'
    + '<div class="chart-tip-row"><span class="k">Purpose</span><span>' + esc(m[0]) + '</span></div>'
    + '<div class="chart-tip-row"><span class="k">Source</span><span>' + esc(m[1]) + '</span></div>'
    + '<div class="chart-tip-row"><span class="k">Calculation</span><span>' + esc(m[2]) + '</span></div>'
    + '<div class="chart-tip-foot"><span>Active scope</span><span>' + esc(asof || 'current selection') + '</span></div>';
}
const kpiSwatch = c => ({ok:'var(--green)',amb:'var(--amber)',warn:'var(--red)',muted:'var(--slate)',err:'var(--error-fg)'})[c] || 'var(--blue)';
const isoStrToDate = iso => { if(!iso) return null; const d = new Date(iso + 'T00:00:00Z'); return isNaN(d) ? null : d; };
function wdBetween(d1, d2){ if(!d1||!d2) return null; let s=1; if(d2<d1){[d1,d2]=[d2,d1];s=-1;} let c=0,cur=new Date(d1.getTime()); while(cur<=d2){ const day=cur.getUTCDay(); if(day!==0&&day!==6)c++; cur.setUTCDate(cur.getUTCDate()+1);} return s*c; }

const CSS = `
/* Theme tokens (bg/surface/text/chrome/nav/accent/status/chart/pchip/ds-zebra, all 6 themes) now come
 * from the inlined common/tokens/tokens.css, placed immediately before this block by build.mjs's
 * inlineCommon({modules:['tokens','welcome']}) call (common C-08 / AGENTS.md §18.4 rev 2026-11-28).
 * This :root only holds the tokens MDL does not share with other dashboards (layout metrics,
 * segmented-control sizing, crosshair accents, and two still-unused legacy tokens --warn/--bad
 * kept for compatibility). --crosshair-* and --header-crosshair-accent now reference var(--accent)/
 * var(--soft) instead of a frozen light-blue literal, so the crosshair correctly follows theme. */
:root{--slate:#64748B;--card:#FFFFFF;--accent2:#2E7D32;--warn:#F9A825;--bad:#C62828;--radius:10px;--font:'Segoe UI',system-ui,-apple-system,'Inter','Source Sans Pro',Roboto,Helvetica,Arial,sans-serif;--warn-border:#F0D38A;--warn-fg-strong:#9a6b00;--accent-soft-border:#BFD8F2;--accent-ink:#1E88E5;--grid:#EDF1F5;--sidebar-w:160px;--nav-bg-hover:rgba(255,255,255,.10);--panel-gap:14px;--btn-h:32px;--seg-h:32px;--crosshair-ring:var(--accent);--header-crosshair-accent:var(--accent);--tool-pad:12px;--tool-gap:10px;--c1-plot-table-gap:10px;--seg-pad-y:6px;--seg-pad-x:10px;--seg-fs:12px;--seg-fw:600;--seg-lh:1.2;--seg-active-bg:var(--navy);--seg-active-fg:var(--on-fill);--seg-hover-bg:var(--surface2);--seg-hover-fg:var(--blue);--seg-pressed-bg:var(--surface3);--seg-focus:var(--blue);--seg-focus-on-active:var(--on-fill);--seg-disabled-opacity:.5}
*{box-sizing:border-box}
.shell-main{display:grid;grid-template-columns:var(--sidebar-w) minmax(0,1fr);flex:1 1 auto;min-height:0;transition:grid-template-columns .12s ease}
body.sidebar-collapsed .shell-main{grid-template-columns:minmax(0,1fr)}
body.sidebar-collapsed [data-shell="left-sidebar"]{display:none}
[data-shell="left-sidebar"]{position:relative;display:flex;flex-direction:column;background:var(--nav-bg);color:var(--nav-fg);min-height:0}
.nav-list,.nav-tools{display:flex;flex-direction:column;gap:2px;padding:10px}
.nav-tools{margin-top:auto;border-top:1px solid rgba(255,255,255,.14)}
.nav-item{min-height:36px;padding:8px 12px;border:0;border-radius:6px;background:var(--nav-bg);color:var(--nav-fg);font-size:14px;font-weight:400;text-align:left;cursor:pointer;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nav-item:hover{background:var(--nav-bg-hover)}
.nav-item.active,.nav-item[aria-current="page"]{background:var(--nav-bg-active);font-weight:600}
.sidebar-resizer{position:absolute;right:-3px;top:0;width:6px;height:100%;cursor:col-resize;z-index:5}
.sidebar-resizer:hover{background:rgba(255,255,255,.18)}
.page-label{font-size:16px;font-weight:600;line-height:1.2;color:var(--chrome-fg);white-space:nowrap;flex:0 0 auto}
.filter-strip{display:flex;align-items:center;gap:8px;min-height:34px;padding:6px 16px;background:var(--surface);border-bottom:1px solid var(--border);font-size:12px;color:var(--muted)}
.content-body{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain}
.panel-area{display:grid;gap:var(--panel-gap);grid-template-columns:repeat(var(--panel-cols,2),minmax(0,1fr));align-items:start}
body[data-layout="one"]{--panel-cols:1}
body[data-layout="two"]{--panel-cols:2}
body[data-layout="three"]{--panel-cols:3}
.panel-area > #kpiPanel{grid-column:1 / -1}
.panel-area > #matrixPanel{grid-column:1 / -1}
.panel-area > .panel[data-page="Validation"]{grid-column:1 / -1}
.panel[data-page]{display:none}
.panel[data-page].page-active{display:block}
.wrap[data-shell="content"]{display:flex;flex-direction:column;flex:1 1 auto;min-height:0;overflow:hidden;max-width:none;margin:0;padding:14px 20px 52px}
html{height:100%;overflow:hidden}
#app{height:100vh;display:grid;grid-template-rows:auto minmax(0,1fr) auto;overflow:hidden}
body{height:100%;margin:0;font-family:var(--font);background:var(--bg);color:var(--text);font-size:13px;line-height:1.45;-webkit-font-smoothing:antialiased;overflow:hidden}
header.app{display:flex;flex-direction:column;position:sticky;top:0;z-index:31;padding:0}
header.app .app-top{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;background:var(--chrome-bg);color:var(--chrome-fg);padding:10px 20px}
header.app .app-menu{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;background:var(--surface);color:var(--text);padding:8px 20px}
header.app .app-menu .actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
header.app .app-menu .filter-group{display:flex;align-items:center;gap:8px;flex-shrink:0}
/* menu controls are borderless (spec §3.1 / §7.1): highlight on hover only, no icons */
header.app .app-menu .btn{border:0;background:transparent}
header.app .app-menu .btn:hover{background:var(--soft)}
/* Primary CTA must keep its solid fill despite the borderless rule above (spec §3.1 / §7.1).
   Without this, background:transparent out-specifies .btn-primary, leaving white text on white. */
header.app .app-menu .btn-primary{background:var(--blue);color:var(--on-fill)}
header.app .app-menu .btn-primary:hover{background:color-mix(in srgb, var(--blue) 85%, black)}
/* Pressed/toggle state (e.g. the Warnings button when the bar is collapsed) must keep its fill.
   Without this, the .app-menu .btn background:transparent rule overrides .btn[aria-pressed=true], leaving
   white text on the white menu bar — the same white-on-white regression as the primary CTA (I-105/I-106). */
header.app .app-menu .btn[aria-pressed="true"]{background:var(--navy);color:var(--on-fill);border-color:var(--navy)}
header.app .app-menu .tf-btn{border:0;background:transparent;color:var(--navy)}
header.app .app-menu .tf-btn:hover{background:var(--soft)}
header.app .app-menu .tf-btn[aria-expanded="true"]{border:0;background:var(--soft)}
header.app .app-menu .tf-btn .tf-cnt{border:0;background:transparent;padding:0 0 0 4px;color:var(--accent-ink);font-weight:700}
header.app .app-menu .tf-btn.is-filtered .tf-cnt{background:transparent;border:0}
/* the Search panel reuses .tf-panel but is shown via .open, not the [hidden] attribute */
header.app .app-menu .tf-panel.search-panel{display:none;width:min(92vw,640px);max-width:min(92vw,640px)}
header.app .app-menu .tf-panel.search-panel.open{display:block}
/* Search popover: column selector + elongated search field + Find/Reset all on ONE row (spec §3.1). */
header.app .app-menu .search-panel .search-row{display:flex;align-items:center;gap:8px;flex-wrap:nowrap}
header.app .brand{display:flex;align-items:center;gap:12px;min-width:0}
header.app .logo{height:36px;width:auto;border-radius:6px;background:var(--surface);padding:3px;box-shadow:0 1px 3px rgba(0,0,0,.2);flex-shrink:0}
header.app .ttl-stack{display:flex;flex-direction:column;gap:2px;min-width:0}
header.app h1.ttl{font-size:17px;margin:0;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
header.app .ttl-stack .sub{font-size:12px;font-weight:500;color:rgba(255,255,255,.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
header.app .meta{font-size:11px;opacity:.85}
header.app .actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
.sys-banner-item{padding:9px 20px;border-bottom:1px solid rgba(0,0,0,.10);font-size:12px;line-height:1.4}
.sys-banner-item:last-child{border-bottom:none}
.sys-banner-item.warn{background:var(--amber);color:var(--warn-fg)}
.sys-banner-item.fatal{background:var(--red);color:var(--on-fill)}
.sys-banner-item.info{background:var(--soft);color:var(--text2)}
.sys-banner-item b{font-weight:700;margin-right:4px}
/* in-flow warning bar (spec §3.5) — unified with load failures */
#errBanner{display:block;flex:0 0 auto;font-size:12px;line-height:1.4;box-shadow:0 2px 10px rgba(0,0,0,.18)}#errBanner[hidden]{display:none}
.wrap{max-width:1320px;margin:0 auto;padding:16px;padding-bottom:52px}
.status-bar{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:6px 14px;background:var(--chrome-bg);color:var(--chrome-fg);font-size:12px;user-select:none;overflow:hidden;border-top:1px solid rgba(255,255,255,.14)}
.status-bar .sb-left,.status-bar .sb-right{display:inline-flex;align-items:center;gap:8px;white-space:nowrap}
.status-bar .sb-right{color:rgba(232,237,243,.82)}
.status-bar b{font-weight:700;opacity:.92}
.status-bar .sb-dot{width:8px;height:8px;border-radius:50%;background:var(--ok-fg);flex:none}
.status-bar .sb-file{max-width:320px;overflow:hidden;text-overflow:ellipsis}
.status-bar .sb-err{color:var(--error-bg)}
@media print{.status-bar{display:none}}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 14px 26px;margin:14px 0;box-shadow:0 1px 2px rgba(15,45,82,.04);position:relative}
.panel[data-panel]::after{content:"Panel " attr(data-panel);position:absolute;right:10px;bottom:8px;font-size:10px;letter-spacing:.04em;color:var(--muted);pointer-events:none}
.panel.panel-flat{border:0;background:transparent;box-shadow:none}
.panel h2{font-size:13px;margin:0 0 10px;color:var(--navy);text-transform:uppercase;letter-spacing:.04em;display:flex;justify-content:space-between}

.kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.kpi{background:var(--surface);border:1px solid var(--border);border-top:3px solid var(--blue);border-radius:8px;padding:10px}
.kpi .v{font-size:22px;font-weight:700;color:var(--navy)} .kpi .l{font-size:10px;color:var(--muted);text-transform:uppercase;margin-top:2px}
.kpi.warn{border-top-color:var(--red)} .kpi.ok{border-top-color:var(--green)} .kpi.amb{border-top-color:var(--amber)}
.kpi.muted{border-top-color:var(--slate)} .kpi.err{border-top-color:var(--accent-purple)}
.subkpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:10px}
.subkpi{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px}
.subkpi .v{font-size:16px;font-weight:700;color:var(--navy)} .subkpi .l{font-size:10px;color:var(--muted)}
.kpi-card{cursor:help}
.kpi-card:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.chart-tip{position:fixed;background:var(--surface);border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow);padding:8px 10px;font-size:11px;font-variant-numeric:tabular-nums;line-height:1.45;color:var(--text);max-width:230px;z-index:30;pointer-events:none;opacity:0;visibility:hidden;transition:opacity 100ms ease}
.chart-tip.show{opacity:1;visibility:visible}
.chart-tip[aria-hidden="true"]{visibility:hidden}
.chart-tip b{font-weight:700}
.chart-tip .chart-tip-row{display:grid;grid-template-columns:76px minmax(0,1fr);gap:8px;margin-top:4px;align-items:start}
.chart-tip .chart-tip-row .k{color:var(--muted)}
.chart-tip .chart-tip-row > :last-child{text-align:left;overflow-wrap:anywhere}
.chart-tip .chart-tip-row > .tip-num{text-align:right}
.chart-tip .kpi-tip-swatch{width:8px;height:8px;border-radius:50%;background:var(--tip-swatch,var(--blue));display:inline-block;margin-right:6px}
.chart-tip-foot{border-top:1px solid var(--border);margin-top:6px;padding-top:6px;display:grid;grid-template-columns:76px minmax(0,1fr);gap:8px;color:var(--muted)}
.chart-tip-foot > :last-child{text-align:left;overflow-wrap:anywhere}
.chart-tip-foot > .tip-num{text-align:right}
.toolbar{display:flex;gap:var(--tool-gap);align-items:center;margin-bottom:6px;flex-wrap:wrap}
.toolbar .tool-filters{display:flex;gap:var(--tool-gap);align-items:center;flex-wrap:wrap}
.toolbar .tool-actions{margin-left:auto;display:flex;gap:var(--tool-gap);align-items:center;flex-wrap:wrap}
.toolbar.matrix-tools{padding:var(--tool-pad);margin-bottom:0}
.toolbar.overdue-tools{padding:var(--tool-pad);margin-bottom:0}
.overdue-tools .cnt{margin-left:0}
.overdue-card.c-card{border:0;padding:0}
.panel-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:10px}
.panel-head h2{margin:0}
.panel-head h3{margin:0;font-size:13px;font-weight:700;color:var(--navy)}
.panel-head .toolbar{margin-bottom:0}
.curve-note{font-size:12px;color:var(--muted);margin:2px 0 8px}
.head-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.chart-actions{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-bottom:6px}
.head-actions .lbl{display:inline-flex;align-items:center;gap:6px;margin:0;font-weight:600;font-size:12px;color:var(--navy)}
.panel-body{display:block}
.panel.collapsed .panel-body{display:none}
.help-modal{position:fixed;inset:0;background:rgba(15,23,42,.45);display:flex;align-items:center;justify-content:center;z-index:50;padding:24px}
.help-modal[hidden]{display:none}
.help-modal .box{background:var(--surface);border:1px solid var(--border);border-radius:12px;max-width:680px;width:100%;max-height:84vh;display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,.25)}
.help-modal .box header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border)}
.help-modal .box header h3{margin:0;font-size:15px;color:var(--navy)}
/* A4: the modal close is a plain .icon-btn — 26 px square, no size/padding override (spec §7.1). */
.help-modal .box .body{overflow:auto;padding:16px 18px;font-size:13px;line-height:1.55;color:var(--text)}
.help-modal .body h4{margin:16px 0 6px;font-size:13px;color:var(--navy)}
.help-modal .body h4:first-child{margin-top:0}
.help-modal .body p{margin:6px 0}
.help-modal .body ul{margin:6px 0;padding-left:20px}
.help-modal .body li{margin:3px 0}
.help-modal .body code{background:var(--bg);padding:1px 5px;border-radius:4px;font-size:12px}
.help-modal .body .def{background:var(--bg);border-left:3px solid var(--navy);padding:8px 12px;border-radius:0 6px 6px 0;margin:8px 0}
.help{font-weight:700}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:32px;padding:7px 14px;font-size:12px;font-weight:600;line-height:1.2;border:1px solid transparent;border-radius:6px;cursor:pointer;transition:background .15s,border-color .15s,color .15s}
.btn:hover{filter:brightness(.97)}
:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.btn-primary{background:var(--blue);color:var(--on-fill);border-color:var(--blue)}
.btn-primary:hover{background:color-mix(in srgb, var(--blue) 85%, black);border-color:color-mix(in srgb, var(--blue) 85%, black)}
.btn-secondary{background:var(--surface);color:var(--navy);border-color:var(--border)}
.btn-secondary:hover{background:var(--blue);color:var(--on-fill);border-color:var(--blue)}
.btn-active{background:var(--navy);color:var(--on-fill);border-color:var(--navy)}
.btn-active:hover{background:color-mix(in srgb, var(--chrome-bg) 85%, black);border-color:color-mix(in srgb, var(--chrome-bg) 85%, black)}
.btn .badge{background:var(--badge-bg);color:var(--on-fill);border-radius:999px;padding:0 6px;font-size:11px;font-weight:700;min-width:16px;text-align:center;line-height:1.5}
.btn[aria-pressed="true"]{background:var(--navy);color:var(--on-fill);border-color:var(--navy)}
.app-menu .warn-toggle{margin-left:6px}
.seg{display:inline-flex;border:1px solid var(--border);border-radius:6px;overflow:hidden}
.seg button{border:0;background:var(--surface);color:var(--navy);padding:7px 14px;min-height:32px;font-size:12px;font-weight:600;cursor:pointer;border-right:1px solid var(--border);text-transform:none;letter-spacing:0}
.seg button:last-child{border-right:0}
.seg button.on{background:var(--navy);color:var(--on-fill)}
.seg button:hover:not(.on){background:var(--blue);color:var(--on-fill)}
.tf-wrap{position:relative;flex-shrink:0}
.tf-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--navy);padding:7px 12px;min-height:32px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap}
.tf-btn:hover{background:var(--soft)}
.tf-btn[aria-expanded="true"]{border-color:var(--accent);background:var(--soft)}
.tf-btn.is-filtered{border-color:var(--accent);color:var(--accent);background:var(--surface)}
.tf-btn .tf-cnt{font-size:10px;background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:1px 6px;border-radius:10px;font-weight:600}
.tf-btn.is-filtered .tf-cnt{background:var(--soft);border-color:var(--accent-soft-border);color:var(--accent-ink)}
.tf-panel{position:absolute;top:calc(100% + 6px);right:0;z-index:40;background:var(--surface);border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow);min-width:220px;max-width:min(340px,90vw);max-height:320px;overflow:auto;padding:10px;color:var(--text)}
.tf-panel[hidden]{display:none}
.search{display:flex;align-items:center;gap:0;background:var(--surface);border:1px solid var(--border);border-radius:6px;min-height:28px;padding:0;flex:0 0 auto;width:320px;max-width:42vw}
.search:focus-within{border-color:var(--accent);box-shadow:0 0 0 2px var(--soft)}
select.inter-sel.is-attached{border:0;border-right:1px solid var(--border);background:var(--bg);color:var(--ink);font:inherit;font-weight:600;font-size:12px;border-radius:6px 0 0 6px;height:26px;padding:0 8px;cursor:pointer}
.search-input{border:0;background:transparent;color:var(--text);font:inherit;font-size:12px;flex:1 1 220px;min-width:0;height:26px;outline:none}
.search-input::placeholder{color:var(--muted)}
.search-btn{background:var(--accent);color:var(--on-fill);border:0;border-radius:0 6px 6px 0;min-height:28px;padding:0 12px;cursor:pointer;font-size:13px;line-height:1}
.search-btn:hover{filter:brightness(.97)}
.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0 0 0 0);border:0}
.tf-panel .tf-all{display:flex;align-items:center;gap:8px;padding:2px;font-size:12px;cursor:pointer}
.tf-panel .tf-all input{accent-color:var(--accent);width:14px;height:14px;flex-shrink:0}
.tf-panel .tf-all b{font-weight:700}
.tf-panel .tf-divider{height:1px;background:var(--border);margin:2px 0 6px}
/* I-115 — the note sits directly under the master, above the divider. Both panels are capped
   scrollers, so a trailing note was unreachable until the item list was scrolled to the end;
   grouping it with the master keeps the control's rule next to the control it describes. */
.tf-panel .tf-hint{margin:2px 2px 6px;font-size:10px;color:var(--muted);line-height:1.35}
.tf-panel .tf-item{display:flex;align-items:center;gap:8px;padding:5px 2px;font-size:12px;cursor:pointer;border-radius:4px}
.tf-panel .tf-item:hover{background:var(--soft)}
.tf-panel .tf-item input{accent-color:var(--accent);width:14px;height:14px;flex-shrink:0}
.tf-panel .tf-item .nc{margin-left:auto;font-size:10px;font-weight:600;color:var(--muted);white-space:nowrap}
.tf-panel .tf-item.tf-nc>span:first-of-type{color:var(--muted)}
/* mark a column header that currently has an active filter */
.ds-table thead th.cf-on{background:var(--soft);color:var(--accent-ink)}
.ds-table thead th.cf-on .sort-lbl{color:var(--accent-ink)}
.sb-loading{opacity:.85;font-weight:600}
.icon-btn{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;min-height:26px;padding:0;font:inherit;font-size:13px;font-weight:600;line-height:1;border:1px solid var(--line);border-radius:6px;background:var(--surface);color:var(--muted);cursor:pointer;transition:background .15s,border-color .15s,color .15s}
.icon-btn:hover{background:var(--soft);color:var(--navy);border-color:var(--line)}
.sc-win .msg{font-size:12px;color:var(--muted);margin-left:auto;white-space:nowrap}
/* Toast (spec §7.10) — fixed, centred, above the status bar (z-index 45) */
#toast{position:fixed;left:50%;bottom:52px;transform:translateX(-50%);display:flex;flex-direction:column;gap:8px;align-items:center;z-index:45;pointer-events:none;max-width:min(92vw,440px)}
.toast{pointer-events:auto;display:flex;align-items:center;gap:8px;min-width:180px;max-width:440px;padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.3;color:var(--on-fill);background:var(--navy);box-shadow:0 6px 20px rgba(15,45,82,.28);opacity:0;transform:translateY(12px);transition:opacity .2s ease,transform .2s ease;cursor:pointer}
.toast.show{opacity:1;transform:translateY(0)}
.toast .ti{flex:none;font-size:14px;line-height:1;font-weight:700}
.toast .tt{overflow:hidden;text-overflow:ellipsis}
.toast-success{background:var(--green)}
.toast-info{background:var(--blue)}
.toast-warning{background:var(--amber);color:var(--warn-fg)}
.toast-error{background:var(--red)}
@media (prefers-reduced-motion: reduce){ .toast{transition:opacity .2s ease;transform:none} .toast.show{transform:none} }
.charts{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch}
.curve-body{display:flex;flex-direction:column;gap:12px}
.curve-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start}
.curve-host{width:100%;overflow-x:auto}
.legend{display:flex;gap:14px;font-size:12px;margin-top:8px;flex-wrap:wrap;color:var(--navy)}
.legend .sw{width:12px;height:12px;border-radius:3px;display:inline-block;margin-right:4px;vertical-align:-1px}
.sc-win .lbl{margin-right:6px;font-size:12px;font-weight:600;color:var(--muted)}
.sc-win .rng{font-size:11px;font-weight:400;color:var(--muted);display:inline-flex;align-items:center;gap:4px}
select.inter-sel{background:var(--surface);border:1px solid var(--border);border-radius:8px;padding:6px 10px;font-size:12px;color:var(--ink);cursor:pointer;max-width:260px}
select.inter-sel:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
@media(max-width:1100px){.kpis{grid-template-columns:repeat(3,1fr)}.subkpis{grid-template-columns:repeat(2,1fr)}}
@media(max-width:880px){.kpis{grid-template-columns:repeat(2,1fr)}.subkpis{grid-template-columns:repeat(2,1fr)}.charts{grid-template-columns:1fr}.curve-grid{grid-template-columns:1fr}}
.chart{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:12px;display:flex;flex-direction:column}
.chart h3{font-size:13px;font-weight:700;margin:0 0 8px;color:var(--navy)}
.chart .chart-host{flex:1 1 auto;display:flex;align-items:center;justify-content:center;min-height:300px}
.chart .chart-host svg{max-width:100%}
.chart svg{display:block;height:auto;max-width:100%}
.filters{display:block}
.filters .grp{border:1px solid var(--border);border-radius:8px;padding:6px 10px;background:var(--surface)}
.filters .lbl{font-size:10px;color:var(--muted);text-transform:uppercase;display:block;margin-bottom:4px}

.chips{display:flex;flex-wrap:wrap;gap:4px;max-width:420px;max-height:130px;overflow:auto;padding-right:4px}
.chips label{font-size:11px;display:inline-flex;align-items:center;gap:3px;background:var(--bg);border:1px solid var(--border);padding:2px 6px;border-radius:12px;cursor:pointer}
.filters .grp-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.filters .grp-head .lbl{margin-bottom:0}
.filters .grp-actions{display:inline-flex;align-items:center;gap:6px}
.filters .badge{font-size:10px;background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:1px 6px;border-radius:10px;font-weight:600}
.filters-help{font-size:11px;color:var(--muted);margin:0 0 8px}
.zone-label{font-size:10px;font-weight:700;color:var(--muted);letter-spacing:1px;text-transform:uppercase;margin:6px 0 6px}
.filters-cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:12px}
.filters-utils{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.filters-utils .grp.util:first-child{flex:1 1 420px;max-width:none}
.filters-utils .grp.util.actions{margin-left:auto}
.filters-utils .grp.util{border:none;background:transparent;padding:0}
.filters #fSearch{width:100%;max-width:560px;margin-top:4px}
.filters .grp.active{border-color:var(--amber);box-shadow:inset 4px 0 0 var(--amber)}
.filters .grp.active .badge{background:var(--warn-bg);border-color:var(--amber);color:var(--warn-fg)}
.filtered-note{font-size:9px;color:var(--warn-fg);margin-top:6px}
table{width:100%;border-collapse:collapse;font-size:12px}
th,td{border-bottom:1px solid var(--border);padding:9px 10px;text-align:left}
th{background:var(--thead-bg,var(--navy));color:var(--thead-fg,var(--on-fill));font-weight:600;position:sticky;top:0;cursor:pointer;user-select:none}
tbody tr:nth-child(even){background:var(--ds-zebra)}
tbody tr:hover{background:var(--soft)}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
.pill{padding:1px 7px;border-radius:999px;font-size:10px;font-weight:600}
.p-app{background:var(--ok-bg);color:var(--ok-fg)} .p-awc{background:var(--warn-bg);color:var(--warn-fg)}
.p-rej{background:var(--error-bg);color:var(--error-fg)} .p-nap{background:var(--grid);color:var(--slate)}
.p-sur{background:var(--soft);color:var(--accent-ink)} .p-rtr{background:var(--status-amber2-bg);color:var(--status-amber2-fg)}
.p-nts{background:var(--ok-bg);color:var(--ok-fg)}
.p-pend{background:var(--soft);color:var(--accent-ink)} .p-unav{background:var(--status-neutral-bg);color:var(--status-neutral-fg)}
.p-nsub{background:var(--status-neutral2-bg);color:var(--status-neutral2-fg)} .p-rerr{background:var(--status-purple-bg);color:var(--status-purple-fg)}
/* §7.2.4 — a severity is a FIXED-SIZE inline SVG on an inner <span>, never a class on the
   <td> (a non-table-cell display value takes the cell out of table formatting, RC-1) and
   never an emoji (per-glyph font metrics make the Sev row taller than its neighbours, RC-4).
   The chip inherits the cell font; only the glyph is sized in px (see .sev-svg). */
.ds-table .sev-error,.ds-table .sev-warning,.ds-table .sev-info{
  display:inline-flex;align-items:center;vertical-align:middle;white-space:nowrap;
  font-size:inherit;line-height:inherit}
.act{color:var(--ok-fg);font-weight:700} .ina{color:var(--slate)}
/* Panel subtitle count chips (spec §4 rev 1.93 / §4.5) */
.pchip-row{display:flex;align-items:center;gap:6px;flex-wrap:nowrap;margin:0 0 10px}
.pchip-row.v-chip-row{margin-bottom:12px}
.pchip{display:inline-flex;align-items:center;gap:5px;height:22px;padding:2px 8px;border:1px solid;border-radius:6px;font-size:11px;font-weight:700;line-height:1.4;white-space:nowrap}
.pchip b{font-weight:700}
.pchip.blue{background:var(--pchip-blue-bg);border-color:var(--pchip-blue-border);color:var(--pchip-blue-ink)}
.pchip.violet{background:var(--pchip-violet-bg);border-color:var(--pchip-violet-border);color:var(--pchip-violet-ink)}
.pchip.green{background:var(--pchip-green-bg);border-color:var(--pchip-green-border);color:var(--pchip-green-ink)}
.pchip.neutral{background:var(--pchip-neutral-bg);border-color:var(--pchip-neutral-border);color:var(--pchip-neutral-ink)}
/* Validation severity chips — one row with the count chips; no emoji in the table cells */
.vchips{display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap}
.vchip{display:inline-flex;align-items:center;gap:4px;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:700;text-transform:capitalize;line-height:1.4;white-space:nowrap}
.vchip.e{background:var(--error-bg);color:var(--error-fg)}
.vchip.w{background:var(--warn-bg);color:var(--warn-fg)}
.vchip.i{background:var(--soft);color:var(--accent-ink)}
.vchip.ok{background:var(--ok-bg);color:var(--ok-fg)}
/* Validation detail: collapsible <details> (starts collapsed) holding #vmap, #vref, the per-issue table */
.vdetails{border-top:1px solid var(--line);margin-top:8px}
.vdetails>summary{cursor:pointer;padding:8px 2px;font-weight:600;color:var(--accent-ink)}
.vdetails>summary:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.vdetails .vbody{padding:4px 0 8px}
.vnote{border:1px solid var(--line);border-radius:8px;background:var(--soft);padding:8px 10px;font-size:12px;color:var(--text);margin:6px 0}
.vrefcard{border:1px solid var(--line);border-radius:8px;overflow:hidden;margin:6px 0}
/* §7.2.15 — the card title band is part of the header: SAME navy, SAME white 12px/600
   as the thead cells. A light band above a navy header reads as two different components. */
.vrefhead{padding:6px 10px;font-size:12px;font-weight:600;color:var(--thead-fg,var(--on-fill));background:var(--thead-bg,var(--navy));border-bottom:1px solid var(--ds-head-rule)}
/* §18 split-header contract (1) — ONE container: header + body read as a single rounded table, so the
   inner scroller's own border, radius and top margin are neutralised. Shared by every split-header
   table; a table must not hand-roll a partial copy of this. */
.splitcard .tableScroll{border:0;border-radius:0;margin-top:0}
/* the matrix shell — same job as .vrefcard for the Rule Reference */
.matrixcard{border:1px solid var(--border);border-radius:10px;overflow:hidden;margin:6px 0}
/* §7.2.15 (1) — ONE bordered, rounded container for a split-header pair. The two shells above keep
   their own radii for the panels that already ship them; this is the generic shell for a
   split-header table that arrives with none of its own (MDL I-116). */
.splitbox{border:1px solid var(--border);border-radius:10px;overflow:hidden;margin:6px 0}
/* MDL I-116 (option i) — the header fragment sits in a CLIPPED scrollport that script scrolls in
   lock-step with the body scroller. Chosen over translating the fragment because it lets a pinned
   header cell stay put with position:sticky, exactly as the pinned body cell below it does — one
   mechanism in both halves, so header and body cannot disagree. */
.splitcard .vheadwrap{overflow:hidden}
/* MDL I-116 — a pinned header cell must use the SAME mechanism as the pinned body cell below it:
   sticky, not relative. §7.2.15 invariant 2 keeps a fragment cell position:relative so it stays a
   containing block for the ::after column rule, but the grid emits a left offset on every pinned
   cell, and "left" means a sticky offset for sticky and a VISUAL DISPLACEMENT for relative — which
   slid the pinned "Doc No" header 70 px clear of its own column. Sticky is also a positioned value,
   so the column rule still paints. */
.splitcard .vheadtab thead th.ds-pinned{position:sticky;z-index:4}
/* §7.2.15 — SPLIT HEADER. The thead element lives OUTSIDE the scroller, so the vertical
   scrollbar starts BELOW the header row instead of running alongside it. The two
   fragments must share one column grid: both are table-layout:fixed carrying the SAME
   <colgroup>, and script gives the header table the scroller's clientWidth — which
   already excludes the vertical scrollbar — so the columns line up exactly. */
.splitcard .vheadtab{margin:0;width:100%}
/* the fragment has no scrolling ancestor, so its cells must not be sticky (the bare
   th rule at the top of the sheet would otherwise stick them to the viewport) — but
   they MUST still be the containing block for the column rule below */
.splitcard .vheadtab thead th{position:relative;border-bottom:1px solid var(--border)}
/* §7.2.2 — column rules are now global (see the rollout block below); the
   Rule-Reference-only copy that lived here has been removed. */
/* the gutter column covers the scrollbar area so the navy is continuous across the
   full card width; it is not a data column and is hidden from assistive tech */
.ds-table .ds-gut{padding:0;border-bottom:0}
.tableScroll{overflow:auto;max-height:340px;margin-top:8px;border:1px solid var(--border);border-radius:10px}
.tableScroll table th{cursor:default}
/* === .ds-table base (spec §7.2) === */
.ds-table{width:100%;border-collapse:collapse;font-size:12px;background:var(--surface);table-layout:fixed}
.ds-table th,.ds-table td{border-bottom:1px solid var(--border);padding:9px 10px;text-align:left;vertical-align:top}
.ds-table thead th{background:var(--thead-bg,var(--navy));color:var(--thead-fg,var(--on-fill));font-size:12px;font-weight:600}
.ds-table th[scope="row"]{font-weight:400}
.ds-table .num{text-align:right;font-variant-numeric:tabular-nums}
.ds-table .enum{text-align:center}
.ds-table .doc-full{white-space:nowrap;overflow:visible;text-overflow:clip}
.ds-table tbody tr:nth-child(even){background:var(--ds-zebra)}
.ds-table tbody tr:hover{background:var(--soft)}
.ds-table .empty{color:var(--muted);text-align:center}
/* === §7.2.3 / §7.2.5 grid discipline — ROLLED OUT GLOBALLY (I-90, from the Rule
   Reference pilot). Row height is ENFORCED by the token rather than left to content
   (RC-8); cells are nowrap + ellipsis so a long value never grows a row (RC-5); and
   <code> inherits the cell font (RC-5). Column widths come from each table's <colgroup>. */
.ds-table th,.ds-table td{
  height:var(--ds-row-h);line-height:var(--ds-cell-lh);font-size:var(--ds-cell-fs);
  vertical-align:middle;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ds-table code{font:inherit}
/* §7.2.2 — column edges: a 1 px rule on the right edge of every header cell. Constant
   width; colour only on hover. Suppressed on grouped-header cells (colspan) and on the
   last data column / gutter so no rule hangs past the table's edge (§7.2.2 (b)). */
.ds-table thead th::after{content:"";position:absolute;top:8px;bottom:8px;right:0;
  width:var(--ds-rule-w);background:var(--ds-head-rule);pointer-events:none}
.ds-table thead th:hover::after{background:var(--ds-head-rule-hi)}
.ds-table thead th[colspan]::after{display:none}
.ds-table thead th:last-child:not(.ds-gut)::after{display:none}
.ds-table thead th.ds-gut::after{display:none}
/* §7.2.2 — the Discipline Summary Matrix paints a column rule on EVERY header cell, including the
   grouped (first) row and the final data column, so no header group reads as one continuous block.
   The gutter stays exempt. Enforced by harness Tier 4g. (Regression: MDL I-108.) */
.matrix thead th[colspan]::after{display:block}
.matrix thead th:last-child:not(.ds-gut)::after{display:block}
/* §7.2.6 — L2 sortable header. The button inherits the navy/white header; the label
   truncates but the indicator (flex:0 0 auto) stays visible at the cell's right edge. */
.ds-table thead th .sort-btn{font:inherit;color:inherit;background:none;border:0;padding:0;margin:0;
  cursor:pointer;display:flex;align-items:center;gap:4px;width:100%;text-align:left}
.ds-table thead th .sort-btn:focus-visible{outline:2px solid var(--blue);outline-offset:1px;border-radius:2px}
.ds-table thead th .sort-lbl{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;min-width:0}
.ds-table thead th .sort-ind{flex:0 0 auto;font-size:9px;line-height:1;opacity:.6;margin-left:auto}
.ds-table thead th[aria-sort="none"] .sort-ind{opacity:.3}
/* numeric (right-aligned) headers: the label + glyph group reads right-aligned as a unit (I-102) */
.ds-table thead th.num .sort-btn{justify-content:flex-end}
.ds-table thead th[aria-sort="ascending"] .sort-ind,.ds-table thead th[aria-sort="descending"] .sort-ind{opacity:1}
/* === §7.2.3 row typography tokens — one size, one line-height, one row height === */
:root{--ds-row-h:40px;--ds-head-h:40px;--ds-cell-fs:12px;--ds-cell-lh:20px;--ds-rule-w:1px;--ds-head-rule:rgba(255,255,255,.38);--ds-head-rule-hi:rgba(255,255,255,.7)}
/* === §7.2.3 / §7.2.5 grid discipline — ROLLED OUT GLOBALLY (I-90) ===
   The width/row-height/ellipsis/column-rule behaviour above is now on .ds-table itself.
   The severity chip went global in I-91 (it is now on an inner <span> in every table, not
   bound to <td>), so only the split-header (.vheadtab), the title band (.vrefhead) and the
   gutter column stay Rule-Reference-only. */
.sev-svg{width:14px;height:14px;flex:0 0 14px;display:block}
.note{background:var(--warn-bg);border:1px solid var(--amber);color:var(--warn-fg);padding:8px 12px;border-radius:8px;font-size:12px;margin:10px 0}
.panel-error{background:var(--error-bg);border:1px solid var(--error-fg);color:var(--error-fg);padding:12px 14px;border-radius:8px;font-size:12px;margin:8px 0;line-height:1.5}
.pe-detail{display:block;margin-top:6px;font-size:11px;opacity:.85}
.sb-err{border-color:var(--error-fg)}
.expand{cursor:pointer;color:var(--blue);font-size:10px;white-space:nowrap;user-select:none;border:0;background:transparent;padding:0;font-family:inherit}
.expand.open{color:var(--navy);font-weight:600}

.matrix{width:100%;border-collapse:collapse;font-size:12px;background:var(--surface)}
.matrix th,.matrix td{border-bottom:1px solid var(--border);padding:4px 8px;text-align:center;white-space:nowrap}
.matrix th:first-child,.matrix td:first-child{text-align:left}
.matrix thead tr.group th{background:var(--thead-bg,var(--navy));color:var(--thead-fg,var(--on-fill));font-weight:700}
.matrix thead tr.group th.tint{background:var(--warn-bg);color:var(--warn-fg)}
.matrix th.tint{background:var(--warn-bg);color:var(--warn-fg)}
.matrix td.col-tint{background:var(--warn-bg)}
.matrix tfoot td{background:var(--bg);font-weight:700;border-top:2px solid var(--navy)}
.matrix tbody tr:nth-child(even){background:var(--ds-zebra)}
.matrix tbody tr.sub{background:var(--soft)}
.matrix tbody tr.sub td.subname{text-align:left;padding-left:22px;color:var(--muted);font-style:italic}
.matrix td.noexp{color:var(--muted);text-align:center}
/* matrix split-header fragment (I-101): the header lives outside the scroller, always visible,
   never sticky — the scrollbar sits under it, not beside it */
/* The matrix fragment inherits the shared .splitcard contract (margin, width, position:relative and
   bottom rule) — position MUST stay relative: it is the containing block for the ::after column rule.
   Alignment needs NO positional rule: §18 centres every data column of a summary cross-tab and keeps the
   leading label column left, which the existing .matrix cell rule and its :first-child override already do
   — and because it comes from the column, header and body cannot drift apart. */
.matrix td{font-variant-numeric:tabular-nums}
/* §18: a summary cross-tab centres every data column. The type class (.num, right) and the
   :first-child override (left) are positional/type rules that can grab the WRONG cell here — the leaf
   row has no Discipline cell (it is rowspanned on the group row), so its first child is a data column
   and centres like the rest, and no leaf cell may be pulled right by .num. */
.matrix thead tr.detail th{text-align:center}
/* centred header: the label centres in the space left of the sort glyph, which stays pinned right.
   Discipline is the one column that reads left, with its data. */
.matrix thead th .sort-lbl{flex:1 1 auto;text-align:center}
.matrix thead tr.group th:first-child .sort-lbl{text-align:left}
#matrixPanel .matrixcard{overflow:hidden}
#matrixPanel .tableScroll{max-height:none}
.ds-table[data-table-crosshair] th:not(.ds-pinned),.ds-table[data-table-crosshair] td:not(.ds-pinned){position:relative}
/* Crosshair v2 (user-specified 20-point contract, 2026-11-28): background-color (true alpha, NOT
   background-image) so the tint blends with whatever the row already painted (zebra, selection,
   status colour) instead of replacing it. Exactly 3 tiers: faint (row/col) < medium (headers) <
   strong (active cell), each color-mix(in srgb, var(--accent) N%, transparent) so it is always
   theme's own accent at a theme-appropriate opacity (--crosshair-faint/-medium/-strong, defined
   per theme in common/tokens/tokens.css). No transition — response must be instant (<=80ms rule). */
.ds-table[data-table-crosshair] tbody tr.row-hover > td,.ds-table[data-table-crosshair] td.col-hover{background-color:var(--crosshair-faint)}
.ds-table[data-table-crosshair] td.cell-hover{background-color:var(--crosshair-strong);box-shadow:inset 0 0 0 2px var(--crosshair-ring)}
.ds-table[data-table-crosshair] th.col-hover{background-color:var(--crosshair-medium);font-weight:700;box-shadow:inset 0 -2px 0 var(--header-crosshair-accent)}
.ds-table[data-table-crosshair] th.cell-hover{background-color:var(--crosshair-medium);font-weight:700;box-shadow:inset 0 0 0 2px var(--crosshair-ring),inset 0 -2px 0 var(--header-crosshair-accent)}
.ds-table[data-table-crosshair] th.rowhead-hover{background-color:var(--crosshair-medium);font-weight:700;box-shadow:inset -2px 0 0 var(--header-crosshair-accent)}
.curve-card .curve-c1-table tbody th.g-label.rowhead-hover{background-color:var(--crosshair-medium);font-weight:700;box-shadow:inset -2px 0 0 var(--header-crosshair-accent)}
.ds-table[data-table-crosshair] :focus-visible{outline:2px solid var(--crosshair-ring);outline-offset:-2px}

.tableScroll thead th{position:sticky;top:0;z-index:2;box-shadow:0 1px 0 var(--border)}
/* === L3 grid (I-95, spec §7.2.13 / §7.2.14) — pinned columns ===
   z-index ladder (§7.2.13): plain td (auto) < pinned td (1) < sticky header th (2) <
   pinned header th (4) < resize grip (5). The pinned cell carries an OPAQUE background
   and re-declares the zebra / hover colours, otherwise scrolled content shows through. */
.ds-table td.ds-pinned{position:sticky;background:var(--surface)}
/* Pinned HEADER cells must keep the navy header fill, not a white one — otherwise the
   inherited white header text (th{color:#fff}) becomes white-on-white (MDL I-105). */
.ds-table th.ds-pinned{position:sticky;background:var(--navy)}
.ds-table td.ds-pinned{z-index:1}
.ds-table thead th.ds-pinned{z-index:4}
.ds-table td.ds-pinned{box-shadow:1px 0 0 var(--border)}
.ds-table td.ds-pinned-edge{box-shadow:1px 0 0 var(--border),4px 0 10px -4px rgba(15,30,50,.28)}
.ds-table tbody tr:nth-child(even) td.ds-pinned{background:var(--ds-zebra)}
.ds-table tbody tr:hover td.ds-pinned{background:var(--soft)}
.ds-table[data-table-crosshair] tbody tr.row-hover > td.ds-pinned,.ds-table[data-table-crosshair] td.ds-pinned.col-hover{background-image:linear-gradient(var(--crosshair-faint),var(--crosshair-faint))}
.ds-table[data-table-crosshair] td.ds-pinned.cell-hover{background-image:linear-gradient(var(--crosshair-strong),var(--crosshair-strong));box-shadow:1px 0 0 var(--border),inset 0 0 0 2px var(--crosshair-ring)}
.ds-table[data-table-crosshair] tbody tr.row-hover > td.ds-pinned.cell-hover{background-image:linear-gradient(var(--crosshair-strong),var(--crosshair-strong));box-shadow:1px 0 0 var(--border),inset 0 0 0 2px var(--crosshair-ring)}
/* column resize grip (I-95, §7.2.13): 6 px wide, ≥24 px hit area via the padded edge */
.ds-resize{position:absolute;top:0;right:-4px;width:9px;height:100%;cursor:col-resize;touch-action:none;z-index:5;border:0;background:transparent;padding:0}
.ds-resize::after{content:"";position:absolute;top:8px;bottom:8px;right:3px;width:2px;background:transparent;border-radius:1px}
.ds-resize:hover::after,.ds-resize.active::after{background:var(--accent)}
/* windowed rendering (I-96, §7.2.8): spacer rows keep the scrollbar length identical */
.ds-table tr.win-pad td{padding:0;border:0;background:transparent;overflow:hidden}
/* §7.10 B7 — COLUMN-VISIBILITY CHOOSER (I-114). This is a LAYOUT control, not a filter: it changes
   which columns are painted and never which rows are returned. It therefore gets its OWN classes
   (.cc-wrap / .cc-btn / .cc-panel) instead of borrowing the filter-trigger look (.tf-*), so it can
   never be mistaken for a row filter. It deliberately carries no count badge and no [aria-expanded]
   active-filter emphasis — the two cues that say "this narrows your rows". */
.cc-wrap{position:relative;flex-shrink:0}
.cc-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--navy);padding:7px 12px;min-height:32px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap}
.cc-btn:hover{background:var(--soft)}
.cc-panel{position:absolute;top:calc(100% + 6px);right:0;z-index:40;background:var(--surface);border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow);min-width:260px;max-width:min(420px,92vw);max-height:380px;overflow:auto;padding:10px}
.cc-panel[hidden]{display:none}
.cc-panel .cc-row{display:flex;align-items:center;gap:8px;padding:4px 2px;font-size:12px}
.cc-panel .cc-row input{flex:0 0 auto}
.cc-panel .cc-row .cc-lbl{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cc-panel .cc-row .cc-pin{font-size:10px;color:var(--muted);flex:0 0 auto}
.cc-panel .cc-row input:disabled+ .cc-lbl{color:var(--muted)}
/* I-115 — the chooser adopts the SAME internal ordering as .tf-panel: master "All columns"
   → note → divider → items → footer. Only the class names differ (§7.10 B7): a layout control
   still gets no count badge and no active-filter emphasis, so it cannot be read as a filter. */
.cc-panel .cc-all{display:flex;align-items:center;gap:8px;padding:2px;font-size:12px;cursor:pointer}
.cc-panel .cc-all input{accent-color:var(--accent);width:14px;height:14px;flex-shrink:0}
.cc-panel .cc-all .cc-lbl{flex:1 1 auto;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.cc-panel .cc-note{margin:2px 2px 6px;font-size:10px;color:var(--muted);line-height:1.35}
.cc-panel .cc-divider{height:1px;background:var(--border);margin:0 0 6px}
.cc-panel .cf-foot{display:flex;align-items:center;gap:8px;padding:8px 2px 2px;margin-top:6px;border-top:1px solid var(--border);font-size:11px;color:var(--muted)}
.cc-panel .cf-foot .cf-cnt{margin-left:auto}
.cc-panel .cf-foot button{font:inherit;font-size:11px;color:var(--accent);background:transparent;border:0;padding:0;cursor:pointer;text-transform:uppercase;letter-spacing:.04em;font-weight:700}
.cc-panel .cf-foot button:hover{text-decoration:underline}
.cnt{margin-left:auto;font-size:11px;color:var(--muted);white-space:nowrap}


.hidden{display:none}
/* I-136 — Issue Progress C1 attached table. All selectors stay inside .curve-card. */
.curve-card{gap:2px}
.curve-card .chart-actions{gap:var(--tool-gap);margin-bottom:8px}
.curve-card .sc-win{flex:0 0 auto;justify-content:flex-start;width:100%;min-width:0;margin-bottom:0}
.curve-card .sc-win .msg{margin-left:0;flex-shrink:0}
.curve-card .c1-ts-body{position:relative;display:flex;flex:1 1 190px;min-width:120px;max-width:440px;height:26px;align-items:center}
.curve-card .c1-timebar{--c1-thumb:14px;position:relative;flex:1;height:26px}
.curve-card .c1-track{position:absolute;left:calc(var(--c1-thumb)/2);right:calc(var(--c1-thumb)/2);top:12px;height:4px;border-radius:2px;background:var(--border)}
.curve-card .c1-fill{position:absolute;top:12px;height:4px;border-radius:2px;background:var(--blue);pointer-events:none;left:var(--c1-fill-left,calc(var(--c1-thumb)/2));width:var(--c1-fill-width,0px)}
.curve-card .c1-ticks{position:absolute;inset:0;pointer-events:none}
.curve-card .c1-tick{position:absolute;top:9px;width:1px;height:6px;background:var(--border)}
.curve-card .c1-tick.is-year{top:7px;height:10px;background:var(--text2)}
.curve-card .c1-tick.is-active{background:var(--blue)}
.curve-card .c1-tick.is-near{top:6px;height:12px;background:var(--blue)}
.curve-card .c1-year{position:absolute;top:-12px;left:0;transform:translateX(-50%);font-size:9px;color:var(--text2);white-space:nowrap}
.curve-card .c1-timebar input[type=range]{position:absolute;left:0;top:0;width:100%;height:26px;margin:0;background:transparent;pointer-events:none;-webkit-appearance:none;appearance:none}
.curve-card .c1-timebar input[type=range]::-webkit-slider-runnable-track{height:26px;background:transparent;border:0}
.curve-card .c1-timebar input[type=range]::-moz-range-track{height:26px;background:transparent;border:0}
.curve-card .c1-timebar input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:var(--c1-thumb);height:var(--c1-thumb);margin-top:6px;border-radius:50%;background:var(--blue);border:2px solid var(--surface);box-shadow:0 0 0 1px var(--blue);cursor:grab;pointer-events:auto;transition:transform .12s ease}
.curve-card .c1-timebar input[type=range]::-moz-range-thumb{width:var(--c1-thumb);height:var(--c1-thumb);border-radius:50%;background:var(--blue);border:2px solid var(--surface);box-shadow:0 0 0 1px var(--blue);cursor:grab;pointer-events:auto;transition:transform .12s ease}
.curve-card .c1-timebar input[type=range]:active::-webkit-slider-thumb,.curve-card .c1-timebar input[type=range]:active::-moz-range-thumb{transform:scale(1.15);cursor:grabbing}
.curve-card .c1-timebar input[type=range]:focus-visible{outline:2px solid var(--blue);outline-offset:2px}
.curve-card .c1-timebar input.wf{z-index:3}
.curve-card .c1-timebar input.wt{z-index:4}
.curve-card .seg{display:inline-flex;border:1px solid var(--border);border-radius:6px;overflow:hidden;flex-shrink:0}
.curve-card .seg-btn{min-height:var(--seg-h);padding:var(--seg-pad-y) var(--seg-pad-x);font:var(--seg-fw) var(--seg-fs)/var(--seg-lh) var(--font-ui);border:0;border-right:1px solid var(--border);background:var(--surface);color:var(--text2);cursor:pointer}
.curve-card .seg-btn:last-child{border-right:0}
.curve-card .seg-btn.active{background:var(--seg-active-bg);color:var(--seg-active-fg)}
.curve-card .seg-btn.active:hover{background:var(--seg-active-bg);color:var(--seg-active-fg)}
.curve-card .seg-btn:not(.active):not(:disabled):hover{background:var(--seg-hover-bg);color:var(--seg-hover-fg)}
.curve-card .seg-btn:not(:disabled):active:not(.active){background:var(--seg-pressed-bg);color:var(--text)}
.curve-card .seg-btn:focus-visible{outline:2px solid var(--seg-focus);outline-offset:-2px}
.curve-card .seg-btn.active:focus-visible{outline-color:var(--seg-focus-on-active)}
.curve-card .curve-host{width:100%;overflow-x:visible}
.curve-card .curve-c1-grid{--c1-gutter:104px;--c1-right-w:52px;display:grid;grid-template-columns:var(--c1-gutter) repeat(var(--c1-cols),minmax(0,1fr));column-gap:0;row-gap:var(--c1-plot-table-gap);align-items:stretch;min-width:0;width:100%}
.curve-card .curve-c1-gutter{grid-column:1;grid-row:1;position:relative;border:1px solid var(--border);border-right:0;border-radius:10px 0 0 10px;background:var(--surface)}
.curve-card .curve-c1-yticks{position:absolute;inset:0;pointer-events:none}
.curve-card .curve-c1-ytick{position:absolute;right:6px;transform:translateY(-50%);font-family:var(--font-ui);font-size:13px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums;color:var(--text2);white-space:nowrap}
.curve-card .curve-c1-ycap{position:absolute;left:2px;top:50%;transform:translateY(-50%) rotate(180deg);writing-mode:vertical-rl;text-orientation:mixed;font-family:var(--font-ui);font-size:11px;font-weight:700;line-height:1;color:var(--text2);white-space:nowrap}
.curve-card .curve-c1-plot{grid-column:2/-1;grid-row:1;position:relative;min-width:0;cursor:crosshair;border:1px solid var(--border);border-radius:0 10px 10px 0;background:var(--surface);overflow:visible}
.curve-card .curve-c1-plot:focus-visible{outline:2px solid var(--blue);outline-offset:-2px}
.curve-card .curve-c1-plot svg{display:block;width:100%;height:auto;overflow:visible}
.curve-card .curve-c1-table{grid-column:1/-1;grid-row:2;width:100%;min-width:0;table-layout:fixed;border-collapse:separate;border-spacing:0;border:1px solid var(--border);border-radius:10px;margin:0}
.curve-card .curve-c1-table caption{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.curve-card .curve-c1-table th,.curve-card .curve-c1-table td{border-right:1px solid var(--line);border-bottom:1px solid var(--line);padding:4px 6px;text-align:right;font-size:11px;font-variant-numeric:tabular-nums;color:var(--text);background:var(--surface)}
.curve-card .curve-c1-table tbody tr:nth-child(even) td{background:var(--ds-zebra)}
.curve-card .curve-c1-table tr>*:last-child{border-right:0}
.curve-card .curve-c1-table tbody tr:last-child>*{border-bottom:0}
.curve-card .curve-c1-table thead th{background:var(--thead-bg,var(--navy));color:var(--thead-fg,var(--on-fill))}
.curve-card .curve-c1-table thead th.corner{text-align:left;color:var(--thead-fg,var(--on-fill));font-size:10px;font-weight:700}
.curve-card .curve-c1-table thead th.g-axis,.curve-card .curve-c1-table thead th.g-label{font-size:11px;font-weight:600;color:var(--thead-fg,var(--on-fill));white-space:nowrap}
.curve-card .curve-c1-table tbody th.g-label{text-align:left;background:var(--surface2);color:var(--text2);font-size:11px;font-weight:600}
.curve-card .curve-c1-table thead th.g-axis span{display:inline-block;writing-mode:horizontal-tb;white-space:nowrap}
.curve-card .curve-c1-table.c1-many thead th.g-axis{height:88px;padding:2px}
.curve-card .curve-c1-table.c1-many thead th.g-axis span{writing-mode:vertical-rl;text-orientation:mixed}
.curve-card .curve-c1-table [data-c1col]:focus-visible{outline:2px solid var(--blue);outline-offset:-2px}
.curve-card .curve-c1-table td.col-active,.curve-card .curve-c1-table th[scope=row].col-active{background-color:var(--crosshair-faint);font-weight:700}
.curve-card .curve-c1-table th[data-c1col].col-active{background-color:var(--crosshair-medium);font-weight:700;box-shadow:inset 0 -2px 0 var(--header-crosshair-accent)}
@media (hover:hover) and (pointer:fine){
.curve-card .curve-c1-table td.cell-hover,.curve-card .curve-c1-table th[scope=row].cell-hover{background-color:var(--crosshair-strong);box-shadow:inset 0 0 0 2px var(--crosshair-ring)}
.curve-card .curve-c1-table th[data-c1col].cell-hover{background-color:var(--crosshair-medium);font-weight:700;box-shadow:inset 0 0 0 2px var(--crosshair-ring),inset 0 -2px 0 var(--header-crosshair-accent)}
}
.curve-card .sc-hover-band{fill:var(--blue);fill-opacity:.08;pointer-events:none;display:none}
.curve-card .chart-snap{stroke:var(--text3);stroke-width:1;stroke-dasharray:3 3;pointer-events:none;display:none}
.curve-card .curve-c1-plot.col-on .sc-hover-band,.curve-card .curve-c1-plot.col-on .chart-snap{display:inline}
.curve-card .curve-mode-dual{color:var(--amber)}
/* §7.2.11 — a bounded scroller capped at 340 px would print every long table as a clipping */
@media print{body{background:#fff}.tableScroll{max-height:none!important;overflow:visible!important}.panel{break-inside:avoid;box-shadow:none}.filters,.toolbar{display:none}header.app{position:static}header.app .app-menu{display:none!important}#errBanner{display:none!important}.panel.collapsed .panel-body{display:block}.ds-table .row-hover,.ds-table .col-hover,.ds-table .cell-hover,.ds-table .rowhead-hover{background:none!important;background-image:none!important;box-shadow:none!important;color:inherit!important;font-weight:inherit!important}.curve-card .chart-tip{display:none!important}.curve-card .sc-hover-band,.curve-card .chart-snap,.curve-card .curve-c1-plot.col-on .sc-hover-band,.curve-card .curve-c1-plot.col-on .chart-snap{display:none!important}.curve-card .col-active,.curve-card .row-hover td,.curve-card .row-hover th[scope=row],.curve-card .cell-hover{background-image:none!important;background-color:transparent!important;box-shadow:none!important;color:inherit!important}}
@media (min-width:1280px){.curve-card .sc-win{flex-wrap:nowrap;min-width:0}.curve-card .sc-win .lbl,.curve-card .sc-win .c1-ts-body,.curve-card .sc-win .msg{white-space:nowrap}.curve-card .sc-win .c1-ts-body{flex:0 1 auto;min-width:220px}}
@media print{.curve-card .chart-actions{display:none!important}.curve-card .sc-win{display:flex!important}.curve-card .c1-ts-body,.curve-card .seg{display:none!important}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
`;

// ---------- SVG chart renderers ----------
function barSVG(title, data){
  const max = Math.max(1, ...data.map(d=>d.value));
  const W=560, padTop=24, padBot=6, targetH=300, nameW=92, valW=44, trackX=nameW+4, trackW=W-nameW-valW-8;
  const n=Math.max(1,data.length), avail=targetH-padTop-padBot;
  const rowH=Math.max(16, Math.min(40, avail/n));                       // spread rows over the common 300px plot height
  const blockH=n*rowH, H=Math.max(targetH, padTop+blockH+padBot);
  const top=padTop+Math.max(0,(targetH-padTop-padBot-blockH)/2);        // centre a short block in the 300px area
  const bh=13;
  let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s+=`<text x="0" y="16" ${F} font-size="12" font-weight="bold" fill="${CHART('navy')}">${esc(title)}</text>`;
  data.forEach((d,i)=>{ const y=top+i*rowH, by=y+(rowH-bh)/2, c=d.color||CHART('blue');
    s+=`<text x="0" y="${(by+10).toFixed(1)}" ${F} font-size="11" fill="${CHART('slate')}">${esc(d.name)}</text>`;
    s+=`<rect x="${trackX}" y="${by.toFixed(1)}" width="${trackW}" height="${bh}" rx="2" fill="#F6F8FA"/>`;
    s+=`<rect x="${trackX}" y="${by.toFixed(1)}" width="${(d.value/max)*trackW}" height="${bh}" rx="2" fill="${c}"/>`;
    s+=`<text x="${W-2}" y="${(by+10).toFixed(1)}" text-anchor="end" ${F} font-size="11" font-weight="bold" fill="${CHART('navy')}">${d.value}</text>`;
  });
  s+=`</svg>`; return s;
}
function pieSVG(title, data){
  const total = Math.max(1, data.reduce((a,b)=>a+b.value,0));
  const cx=150, cy=172, r=112, W=560, H=300;                 // H=300 matches the bar chart's common plot height
  let a0=-Math.PI/2; let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s+=`<text x="0" y="16" ${F} font-size="12" font-weight="bold" fill="${CHART('navy')}">${esc(title)}</text>`;
  data.forEach(d=>{ const a1=a0+(d.value/total)*2*Math.PI, c=d.color||CHART('blue');
    const x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),lg=(a1-a0)>Math.PI?1:0;
    s+=`<path d="M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${lg} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${c}"/>`; a0=a1; });
  let ly=60; data.forEach(d=>{ s+=`<rect x="330" y="${ly-9}" width="10" height="10" rx="2" fill="${d.color||CHART('blue')}"/>`;
    s+=`<text x="346" y="${ly}" ${F} font-size="11" fill="${CHART('slate')}">${esc(d.name)} ${d.value}</text>`; ly+=20; });
  s+=`</svg>`; return s;
}
// I-87: shared single y-scale is the DEFAULT; a separate bar scale engages automatically (and only)
// when the cumulative totals dwarf the monthly bars. Hysteresis stops slider drag flickering.
export function scurveAxisMode({maxCum,maxBar,barsVisible,current}){
  if(!barsVisible || !isFinite(maxBar) || maxBar<=0) return 'single';
  if(!isFinite(maxCum) || maxCum<=0) return 'single';
  const r=maxCum/maxBar;
  if(current==='dual') return r<6 ? 'single' : 'dual';   // retain 6…10, revert below 6
  return r>10 ? 'dual' : 'single';                       // engage above 10
}
const CURVE_GUTTER_W=104, CURVE_RIGHT_W=52, CURVE_PLOT_H=300;
const CURVE_LEG_PAD_L=12, CURVE_LEG_PAD_T=10, CURVE_LEG_ROW_H=18, CURVE_REF_BAND_H=18;
function curveFallbackWidth(cols){ return Math.max(440, cols*64+CURVE_RIGHT_W); }
function curvePlotWidth(st, cols){
  const w=Math.round(st.plot && st.plot.clientWidth ? st.plot.clientWidth : 0);
  return w>0 ? w : curveFallbackWidth(cols);
}
const CURVE_FF='font-family="\'Segoe UI\', system-ui, -apple-system, \'Inter\', \'Source Sans Pro\', Roboto, Helvetica, Arial, sans-serif"';
function curveNiceTicks(M){
  const cap=7;
  let step=1, intervals=cap;
  outer: for(let e=-2;e<=7;e++) for(const base of [1,2,2.5,5]){
    const t=base*Math.pow(10,e), n=Math.ceil(M/t);
    if(n>=1 && n<=cap){ step=t; intervals=n; break outer; }
  }
  const vals=[]; for(let i=0;i<=intervals;i++) vals.push(i*step);
  return {s:step,yMax:intervals*step,intervals,vals};
}
function curveTickText(v){ return v>=1000?String(v/1000).replace(/\.0$/,'')+'k':String(Math.round(v*10)/10); }
function curveLegendEntries(barsVisible, dual){
  const e=[];
  if(barsVisible) [['Planned',CHART('blue'),'bar'],['Forecast',CHART('amber'),'bar'],['Actual',CHART('green'),'bar']]
    .forEach(([lab,c,type])=>e.push({type,lab:dual?lab+' · right':lab,c}));
  [['Cum. Plan',CHART('blue'),'6,3'],['Cum. Forecast',CHART('amber'),'2,2'],['Cum. Actual',CHART('green'),'']]
    .forEach(([lab,c,dash])=>e.push({type:'line',lab:dual?lab+' · left':lab,c,dash}));
  return e;
}
function curveLegendAdv(e){ return e.type==='bar'?15+e.lab.length*7+20:24+e.lab.length*7+20; }
function curveChart(p, from, to, forExport, plotW){
  const idx=[]; for(let i=from;i<=to;i++) idx.push(i);
  const m=Math.max(1,idx.length);
  const barsVisible = curveShowBars!==false;
  const lastValueIdx = k => { const a=p[k]||[]; let l=-1; for(let i=0;i<a.length;i++) if((a[i]||0)>0) l=i; return l; };
  const lastChangeIdx = k => { const a=p[k]||[]; let l=-1; for(let i=0;i<a.length;i++){ const prev=i>0?(a[i-1]||0):0; if((a[i]||0)!==prev) l=i; } return l; };
  const asof=(typeof p.asofIdx==='number')?p.asofIdx:-1;
  const cut={ pNew:lastValueIdx('pNew'), fNew:lastValueIdx('fNew'), aNew:lastValueIdx('aNew'),
              pCum:lastChangeIdx('pCum'), fCum:lastChangeIdx('fCum'), aCum:Math.max(lastChangeIdx('aCum'),asof) };
  const vis = k => idx.filter(i => i>=0 && i<=cut[k]);
  let maxCum=1, maxBar=0;
  ['pCum','fCum','aCum'].forEach(k=>{ vis(k).forEach(i=>{ const v=p[k][i]||0; if(v>maxCum) maxCum=v; }); });
  ['pNew','fNew','aNew'].forEach(k=>{ vis(k).forEach(i=>{ const v=p[k][i]||0; if(v>maxBar) maxBar=v; }); });
  const mode=forExport?curveLastScaleMode:scurveAxisMode({maxCum,maxBar,barsVisible,current:curveLastScaleMode});
  if(!forExport) curveLastScaleMode=mode;
  const dual=mode==='dual';
  const W=Math.max(1, Number(plotW)||curveFallbackWidth(m)), pw=W-CURVE_RIGHT_W, gw=pw/m;
  const entries=curveLegendEntries(barsVisible,dual);
  const padL=CURVE_LEG_PAD_L, padR=dual?CURVE_RIGHT_W:12;
  const budget=Math.max(120,W-padL-padR);
  const perRow=Math.max(1,Math.floor(budget/132));
  const legendRows=Math.max(1,Math.ceil(entries.length/perRow));
  const legendBottom=CURVE_LEG_PAD_T+legendRows*CURVE_LEG_ROW_H;
  const T=legendBottom+CURVE_REF_BAND_H, PH=CURVE_PLOT_H, H=T+PH;
  const maxY=!barsVisible?maxCum:dual?maxCum:Math.max(1,maxCum,maxBar);
  const maxBarY=Math.max(1,maxBar);
  const ticks=curveNiceTicks(maxY);
  const Xc=i=>gw*(idx.indexOf(i)+0.5);
  const Y=v=>T+PH-(v/ticks.yMax)*PH;
  const Yb=v=>T+PH-((dual?v/maxBarY:v/ticks.yMax))*PH;
  const bw=Math.min(18,(gw*0.62)/3);
  const defs=`<defs>${[['blue','Blue'],['amber','Amber'],['green','Green']].map(([tok,n])=>`<linearGradient id="scg${n}" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="var(--${tok})" stop-opacity=".28"/><stop offset="100%" stop-color="var(--${tok})" stop-opacity="0"/></linearGradient>`).join('')}</defs>`;
  let g='';
  [['pCum','scgBlue'],['fCum','scgAmber'],['aCum','scgGreen']].forEach(([k,id])=>{
    const pts=vis(k); if(!pts.length) return;
    const d=`M${Xc(pts[0]).toFixed(1)},${(T+PH).toFixed(1)} `+pts.map(i=>`L${Xc(i).toFixed(1)},${Y(p[k][i]||0).toFixed(1)}`).join(' ')+` L${Xc(pts[pts.length-1]).toFixed(1)},${(T+PH).toFixed(1)} Z`;
    g+=`<path class="sc-area" d="${d}" fill="url(#${id})" stroke="none" pointer-events="none"/>`;
  });
  entries.forEach((e,i)=>{
    const row=Math.floor(i/perRow), dy=row*CURVE_LEG_ROW_H;
    let lx=padL; for(let j=row*perRow;j<i;j++) lx+=curveLegendAdv(entries[j]);
    if(e.type==='bar') g+=`<rect x="${lx}" y="${legendBottom-13-dy}" width="10" height="10" rx="2" fill="${e.c}" opacity="0.55"/><text x="${lx+15}" y="${legendBottom-4-dy}" ${CURVE_FF} font-size="12" fill="#2b3440">${e.lab}</text>`;
    else g+=`<line x1="${lx}" y1="${legendBottom-8-dy}" x2="${lx+18}" y2="${legendBottom-8-dy}" stroke="${e.c}" stroke-width="2.5"${e.dash?` stroke-dasharray="${e.dash}"`:''}/><text x="${lx+24}" y="${legendBottom-4-dy}" ${CURVE_FF} font-size="12" fill="#2b3440">${e.lab}</text>`;
  });
  ticks.vals.forEach(v=>{ const y=Y(v);
    g+=`<line x1="0" y1="${y.toFixed(1)}" x2="${pw.toFixed(1)}" y2="${y.toFixed(1)}" stroke="#EAEFF5" stroke-width="1"/>`; });
  if(dual){
    const rTicks=curveNiceTicks(maxBarY);
    rTicks.vals.forEach(v=>{ const y=Yb(v);
      g+=`<text x="${(pw+6).toFixed(1)}" y="${(y+4).toFixed(1)}" text-anchor="start" ${CURVE_FF} font-size="13" fill="${CHART('blue')}">${curveTickText(v)}</text>`; });
    g+=`<text x="${(pw+6).toFixed(1)}" y="${legendBottom-4}" text-anchor="start" ${CURVE_FF} font-size="13" fill="${CHART('blue')}">per mo</text>`;
    g+=`<line x1="${pw.toFixed(1)}" y1="${T}" x2="${pw.toFixed(1)}" y2="${T+PH}" stroke="${CHART('blue')}" stroke-width="1"/>`;
  }
  if(!forExport){
    g+=`<rect class="sc-hover-band" x="0" y="${T}" width="${gw.toFixed(1)}" height="${PH}"/>`;
    g+=`<line class="chart-snap" x1="0" y1="${T}" x2="0" y2="${T+PH}"/>`;
  }
  if(barsVisible) idx.forEach(i=>{ const xc=Xc(i);
    [['pNew',CHART('blue'),'Planned'],['fNew',CHART('amber'),'Forecast'],['aNew',CHART('green'),'Actual']].forEach(([k,c,lab],bi)=>{
      if(i>cut[k]) return; const v=p[k][i]||0; if(v<=0) return;
      const x=xc-bw*1.5+bi*bw, y=Yb(v), h=T+PH-y;
      g+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${Math.max(1,bw-1.5).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${c}" opacity="0.55"><title>${lab} ${monthLabel(p.months[i])}: ${v}</title></rect>`;
      const tx=(x+(bw-1.5)/2+4).toFixed(1), ty=(y-3).toFixed(1);
      g+=`<text x="${tx}" y="${ty}" text-anchor="start" transform="rotate(-90 ${tx} ${ty})" ${CURVE_FF} font-size="12" fill="#2b3440">${v}</text>`;
    }); });
  [['pCum',CHART('blue'),'6,3','Cum. Plan'],['fCum',CHART('amber'),'2,2','Cum. Forecast'],['aCum',CHART('green'),'','Cum. Actual']].forEach(([k,c,dash,lab])=>{
    const pts=vis(k); if(!pts.length) return;
    g+=`<polyline fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''} points="${pts.map(i=>`${Xc(i).toFixed(1)},${Y(p[k][i]||0).toFixed(1)}`).join(' ')}"/>`;
    pts.forEach(i=>{ const v=p[k][i]||0; g+=`<circle cx="${Xc(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" fill="${c}"><title>${lab} ${monthLabel(p.months[i])}: ${v}</title></circle>`; });
  });
  g+=`<line x1="0" y1="${T+PH}" x2="${pw.toFixed(1)}" y2="${T+PH}" stroke="#C9D4E0" stroke-width="1"/><line x1="0" y1="${T}" x2="0" y2="${T+PH}" stroke="#C9D4E0" stroke-width="1"/>`;
  if(typeof p.projStartIdx==='number' && p.projStartIdx>=from && p.projStartIdx<=to){ const x=Xc(p.projStartIdx), lx=Math.max(28,Math.min(pw-28,x));
    g+=`<line x1="${x.toFixed(1)}" y1="${T-CURVE_REF_BAND_H}" x2="${x.toFixed(1)}" y2="${T+PH}" stroke="#C62828" stroke-width="1.5" stroke-dasharray="5,3"/><text x="${lx.toFixed(1)}" y="${T-5}" text-anchor="middle" ${CURVE_FF} font-size="12" fill="#C62828">Start</text>`; }
  if(typeof p.asofIdx==='number' && p.asofIdx>=from && p.asofIdx<=to){ const x=Xc(p.asofIdx), lx=Math.max(28,Math.min(pw-28,x));
    g+=`<line x1="${x.toFixed(1)}" y1="${T-CURVE_REF_BAND_H}" x2="${x.toFixed(1)}" y2="${T+PH}" stroke="#B8C2CC" stroke-width="1.5" stroke-dasharray="2,2"/><text x="${lx.toFixed(1)}" y="${T-5}" text-anchor="middle" ${CURVE_FF} font-size="12" fill="#68727d">Today</text>`; }
  const points=idx.map(i=>({cx:Xc(i),month:monthLabel(p.months[i]),p:p.pNew[i]||0,f:p.fNew[i]||0,a:p.aNew[i]||0,pc:p.pCum[i]||0,fc:p.fCum[i]||0,ac:p.aCum[i]||0}));
  const svg=`<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Issue Progress chart, ${mode} scale">${defs}${g}</svg>`;
  return {svg,W,H,pw,PH,T,gw,mode,dual,ticks,points,legendRows,yticks:ticks.vals.map(v=>({v,y:Y(v)})),refBand:CURVE_REF_BAND_H};
}
function combinedProgressSVG(p, from, to){ return curveChart(p,from,to,false,0).svg; }
function svgToBlob(svgEl, cb){
  const xml = new XMLSerializer().serializeToString(svgEl);
  const url = 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(xml);
  const img = new Image();
  img.onload = ()=>{ const c=document.createElement('canvas'),scale=2; c.width=img.width*scale; c.height=img.height*scale;
    const ctx=c.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,c.width,c.height); ctx.scale(scale,scale); ctx.drawImage(img,0,0);
    c.toBlob(b=>cb(b),'image/png'); };
  img.onerror = ()=>cb(null); img.src = url;
}
function attachExport(root, getSVG, title){
  const fname = (typeof title==='function'?title():title).replace(/[\\/:*?"<>|·]/g,'_');
  const run = fn => { const tmp=document.createElement('div'); tmp.innerHTML=getSVG(); const el=tmp.querySelector('svg'); if(!el){toast('Nothing to export','info');return;} svgToBlob(el,fn); };
  const dl=root.querySelector('.dl'); if(dl) dl.addEventListener('click',()=>run(b=>{ if(!b){toast('Export failed','error');return;}
    const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=fname+'.png'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000); toast('PNG downloaded','success'); }));
  const cp=root.querySelector('.cp'); if(cp) cp.addEventListener('click',()=>{ if(!navigator.clipboard||!window.ClipboardItem){toast('Clipboard not supported — use PNG','warning');return;}
    run(async b=>{ if(!b){toast('Export failed','error');return;} try{ await navigator.clipboard.write([new ClipboardItem({'image/png':b})]); toast('Copied to clipboard','success'); }
      catch(e){ toast('Clipboard blocked — PNG downloaded','warning'); } }); });
}

// ---------- toast (spec §7.10) ----------
// Single #toast live region hosts stacked toast nodes. Success/info => role=status (polite);
// warning/error => role=alert (assertive). Auto-dismiss scales with length, pauses on hover/focus.
const TOAST_MAX = 3;
let toastActive = [];
let toastQueue = [];
let toastKeydownBound = false;
function toast(message, variant){
  variant = ({success:'success', info:'info', warning:'warning', error:'error'}[variant]) || 'info';
  const el = document.createElement('div');
  el.className = 'toast toast-' + variant;
  const icon = { success:'✓', info:'ⓘ', warning:'⚠', error:'⛔' }[variant];
  const assertive = (variant === 'error' || variant === 'warning');
  el.setAttribute('role', assertive ? 'alert' : 'status');
  el.setAttribute('aria-live', assertive ? 'assertive' : 'polite');
  el.setAttribute('aria-atomic', 'true');
  el.tabIndex = -1;
  el.innerHTML = '<span class="ti">' + icon + '</span><span class="tt">' + esc(message) + '</span>';
  el.addEventListener('click', () => dismissToast(el));
  if (toastActive.length >= TOAST_MAX) { toastQueue.push(el); return; }
  showToast(el);
}
function showToast(el){
  const host = document.getElementById('toast');
  if (!host) return;
  host.insertBefore(el, host.firstChild);
  toastActive.push(el);
  requestAnimationFrame(() => el.classList.add('show'));
  const text = (el.querySelector('.tt').textContent || '');
  const dur = Math.min(8000, 4000 + Math.floor(text.length / 20) * 500);
  el._timer = setTimeout(() => dismissToast(el), dur);
  el.addEventListener('mouseenter', () => clearTimeout(el._timer));
  el.addEventListener('mouseleave', () => { el._timer = setTimeout(() => dismissToast(el), 1500); });
  el.addEventListener('focusin', () => clearTimeout(el._timer));
  el.addEventListener('focusout', () => { el._timer = setTimeout(() => dismissToast(el), 1500); });
}
function dismissToast(el){
  if (el._dismissed) return;
  el._dismissed = true;
  clearTimeout(el._timer);
  el.classList.remove('show');
  const finish = () => {
    if (el._finished) return;
    el._finished = true;
    if (el.parentNode) el.remove();
    toastActive = toastActive.filter(x => x !== el);
    const next = toastQueue.shift();
    if (next) showToast(next);
  };
  el.addEventListener('transitionend', finish, { once: true });
  setTimeout(finish, 400);
}
if (typeof document !== 'undefined' && !toastKeydownBound) {
  toastKeydownBound = true;
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && toastActive.length) dismissToast(toastActive[toastActive.length - 1]);
  });
}

function statusColor(name){
  return ({APP:CHART('green'),AWC:CHART('amber'),REJ:CHART('red'),NAP:CHART('slate'),'Not Available':CHART('grey'),
           'Submitted – Pending Review':CHART('blue'),'Submitted – Status Unavailable':CHART('grey'),
           'Not Submitted':CHART('blueGrey'),'Record Error':CHART('purple'),
           YES:CHART('green'),NO:CHART('slate'),
           'On track':CHART('green'),'At risk':CHART('amber'),
           'Overdue – 1st':CHART('red'),'Overdue – Resub':CHART('red'),'Overdue – Client':CHART('red')})[name] || CHART('blue');
}

// ---------- derived view from filtered records ----------
export function deriveView(model, state){
  const todayISO = model.meta.today; const dT = isoStrToDate(todayISO);
  // Filters combine (AND) and are applied in ONE pass, so no dimension can update in
  // isolation. An empty selection means "nothing selected" → zero rows (Clear behaviour).
  const passSel=(set,v)=> set==null ? true : set.has(v==null?'':v);
  const recs = model.records.filter(r=>{
    if(!passSel(state.disciplines, r.fields['UESH Discipline'])) return false;
    if(!passSel(state.stages, r.stage)) return false;
    if(state.search){ const col=state.searchCol||'Document No.'; const q=state.search.toLowerCase(); const v=(r.fields[col]!=null?String(r.fields[col]):'').toLowerCase(); if(!v.includes(q)) return false; }
    return true;
  });
  // Excluded stages are not counted by default (single rule — no separate "include excluded"
  // toggle). They only enter the numbers when the user deliberately ticks them in the filter.
  const active = recs.filter(r => r.isActive || (state.stages && state.stages.has(r.stage)));
  const activeSet = new Set(active.map(r=>r.sourceTab+'!'+r.rownum));
  const issues = model.issues.filter(i => activeSet.has(i.sourceTab+'!'+i.rownum) && (!state.rule || i.code===state.rule));

  // KPIs
  const cnt = p => active.filter(p).length;
  // I-78: approval-derived KPIs come from the single approvalCategory classifier (I-77) — the
  // submission gate (Actual 1st Issue Date) takes precedence over Latest Approval Status, so the
  // four approval KPIs count Case 3 only; three new cards surface Pending Review / Not Submitted /
  // Record Error. The submission gate treats a date formula-error as present.
  const catCount = {};
  active.forEach(r => { const c = approvalCategory(r); catCount[c] = (catCount[c]||0)+1; });
  const isSubmitted = r => (r.fields['Actual 1st Issue Date']||'')!=='' || !!(r.fieldErrors && r.fieldErrors.has('Actual 1st Issue Date'));
  const kpis = {
    totalPlanned: active.length,
    submitted: active.filter(isSubmitted).length,
    approvedAPP: catCount['APP']||0,
    approvedAWC: catCount['AWC']||0,
    rejected: catCount['REJ']||0,
    notApproved: catCount['NAP']||0,
    pendingReview: catCount['Submitted – Pending Review']||0,
    notSubmitted: catCount['Not Submitted']||0,
    recordError: catCount['Record Error']||0,
    asBuiltYes: cnt(r=>r.fields['As-Built']==='YES'),
    vendorYes: cnt(r=>r.fields['Vendor Data']==='YES'),
    activeDisciplines: new Set(active.map(r=>r.discipline).filter(Boolean)).size,
    disciplineTotal: model.contract.lookups.uesh.codes.size,
    completeness: null,
  };
  const cg = new Set(model.completenessGroup);
  const bad = new Set(); issues.forEach(i=>{ if(cg.has(i.code)) bad.add(i.sourceTab+'!'+i.rownum); });
  kpis.completeness = active.length ? Math.round((1-bad.size/active.length)*1000)/10 : null;
  const firstOverdue = active.filter(r=>{const t=r.fields['Forecast 1st Issue Date']||r.fields['Planned 1st Issue Date'];const dt=isoStrToDate(t);return t&&dt&&(r.fields['Actual 1st Issue Date']||'')===''&&wdBetween(dt,dT)>=1;});
  // I-82: gate on approvalCategory so a REJ without a submission date (Record Error) is NOT a real
  // resub-overdue; a date formula-error in Actual 1st Issue Date still counts as submitted. RTR is
  // gated on the same error-aware submission flag.
  const subOverdue = active.filter(r=>{
    const y=r.fields['Latest Approval Status'];
    const u=(r.fields['Actual 1st Issue Date']||'')!=='' || !!(r.fieldErrors && r.fieldErrors.has('Actual 1st Issue Date'));
    if(!(approvalCategory(r)==='REJ' || (y==='RTR' && u))) return false;
    const x=r.fields['Latest Approval Date'];
    return x && wdBetween(isoStrToDate(x),dT) > model.contract.reviewRules.resubmissionDuration;
  });
  const cliOverdue = active.filter(r=>{const w=r.fields['Submission Status'],u=r.fields['Actual 1st Issue Date'];return w==='SUR'&&u&&wdBetween(isoStrToDate(u),dT)>model.contract.reviewRules.firstClientReview;});
  const overdueDelay=(type,r)=>{
    const f=r.fields;
    if(type==='first'){ const t=f['Forecast 1st Issue Date']||f['Planned 1st Issue Date']; const d=isoStrToDate(t); const w=d?wdBetween(d,dT):null; return w==null?'':Math.max(0,w); }
    if(type==='sub'){ const x=isoStrToDate(f['Latest Approval Date']); const w=x?wdBetween(x,dT):null; return w==null?'':Math.max(0,w-model.contract.reviewRules.resubmissionDuration); }
    const u=isoStrToDate(f['Actual 1st Issue Date']); const w=u?wdBetween(u,dT):null; return w==null?'':Math.max(0,w-model.contract.reviewRules.firstClientReview);
  };
  firstOverdue.forEach(r=>r.delay=overdueDelay('first',r));
  subOverdue.forEach(r=>r.delay=overdueDelay('sub',r));
  cliOverdue.forEach(r=>r.delay=overdueDelay('cli',r));
  const ov=new Set([...firstOverdue,...subOverdue,...cliOverdue].map(r=>r.sourceTab+'!'+r.rownum));
  kpis.overdueFirst=firstOverdue.length; kpis.overdueResubmission=subOverdue.length; kpis.overdueClientReview=cliOverdue.length;
  const keyOf=r=>r.sourceTab+'!'+r.rownum;
  const foSet=new Set(firstOverdue.map(keyOf)), soSet=new Set(subOverdue.map(keyOf)), coSet=new Set(cliOverdue.map(keyOf));

  // charts
  const gc=(fn,scope)=>{const m={};scope.forEach(r=>{const k=fn(r);if(k==null||k==='')return;m[k]=(m[k]||0)+1;});return m;};
  const toArr=m=>Object.entries(m).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
  // I-80: Approval chart now shows the full approvalCategory split (gated on Actual 1st Issue Date) —
  // APP/AWC/REJ/NAP, Submitted – Pending Review, Submitted – Status Unavailable, Not Submitted, Record
  // Error — instead of a single "Not Available" bucket.
  const appStatus = toArr(gc(r=>approvalCategory(r), active));
  const atRisk=active.filter(r=>{const t=r.fields['Forecast 1st Issue Date']||r.fields['Planned 1st Issue Date'];return t&&(r.fields['Actual 1st Issue Date']||'')===''&&isoStrToDate(t)>dT&&wdBetween(dT,isoStrToDate(t))<=14;});
  const onTrack=active.filter(r=>{const k=r.sourceTab+'!'+r.rownum;return !ov.has(k)&&!atRisk.includes(r);});
  const dqDisc={}; issues.forEach(i=>{if(i.discipline)dqDisc[i.discipline]=(dqDisc[i.discipline]||0)+1;});
  const charts={
    docsByDiscipline: toArr(gc(r=>r.discipline,active)),
    issueProgress:[{name:'Planned',value:cnt(r=>(r.fields['Planned 1st Issue Date']||'')!=='')},{name:'Forecast',value:cnt(r=>(r.fields['Forecast 1st Issue Date']||'')!=='')},{name:'Actual',value:cnt(r=>(r.fields['Actual 1st Issue Date']||'')!=='')}],
    approvalStatus: appStatus,
    asBuilt:[{name:'YES',value:cnt(r=>r.fields['As-Built']==='YES')},{name:'NO',value:cnt(r=>r.fields['As-Built']==='NO')}],
    byAuthority: toArr(gc(r=>r.fields['Authority'],active)),
    byDocType: toArr(gc(r=>r.fields['Doc Type'],active)),
    scheduleVariance:[{name:'On track',value:onTrack.length},{name:'At risk',value:atRisk.length},{name:'Overdue – 1st',value:firstOverdue.length},{name:'Overdue – Resub',value:subOverdue.length},{name:'Overdue – Client',value:cliOverdue.length}],
    dqByDiscipline: toArr(dqDisc),
    dqByRule: toArr(gc(i=>i.code,issues)),
  };
  // ----- Issue-progress timeline (S-curve + monthly bar) -----
  const DATE_FIELDS=['Planned 1st Issue Date','Forecast 1st Issue Date','Actual 1st Issue Date'];
  const pdate=v=>{ const d=isoStrToDate(v||''); return (d&&!isNaN(d.getTime()))?d:null; };
  let dataMin=null, maxD=null;
  model.records.forEach(r=>{ DATE_FIELDS.forEach(f=>{ const d=pdate(r.fields[f]); if(d){ if(!dataMin||d<dataMin)dataMin=d; if(!maxD||d>maxD)maxD=d; } }); });
  // Project-start anchor = Code!B6 (meta.projectStartDate; A6 is the label cell); fall back to
  // the earliest data month only when B6 is blank. B6 is the authoritative origin for date curves.
  const psDate = model.meta.projectStartDate ? isoStrToDate(model.meta.projectStartDate) : null;
  const projStart = psDate || dataMin || dT;   // anchor marked on the curve
  if(!maxD) maxD=dT;
  // Always show the whole month range (no clipping): the timeline starts at the earlier of the
  // project-start anchor and the earliest document date, so documents dated before B6 are still
  // plotted (never silently dropped). The project-start month is flagged with a marker.
  const tlStart = (dataMin && dataMin < projStart) ? dataMin : projStart;
  maxD=new Date(maxD.getFullYear(),maxD.getMonth()+1,1);                 // +1 month buffer
  // The project-start month is ALWAYS part of the range, even when B6 lies beyond every
  // document date — otherwise there would be no month slot to draw its marker on.
  if(psDate){ const psMon=new Date(psDate.getFullYear(),psDate.getMonth(),1); if(psMon>maxD) maxD=psMon; }
  const months=[]; { let c=new Date(tlStart.getFullYear(),tlStart.getMonth(),1), e=new Date(maxD.getFullYear(),maxD.getMonth(),1); while(c<=e){ months.push(c.getFullYear()+'-'+String(c.getMonth()+1).padStart(2,'0')); c.setMonth(c.getMonth()+1); } }
  const mi=m=>months.indexOf(m);
  const pMon=r=>mi((r.fields['Planned 1st Issue Date']||'').slice(0,7));
  const fMon=r=>{ const f=r.fields['Forecast 1st Issue Date']||r.fields['Planned 1st Issue Date']; return f?mi(f.slice(0,7)):-1; };   // forecast missing -> plan fallback
  const aMon=r=>{ const a=r.fields['Actual 1st Issue Date']; return a?mi(a.slice(0,7)):-1; };
  const n=months.length;
  const pCum=Array(n).fill(0), fCum=Array(n).fill(0), aCum=Array(n).fill(0), pNew=Array(n).fill(0), fNew=Array(n).fill(0), aNew=Array(n).fill(0);
  active.forEach(r=>{ const pi=pMon(r); if(pi>=0){pCum[pi]++;pNew[pi]++;} const fi=fMon(r); if(fi>=0){fCum[fi]++;fNew[fi]++;} const ai=aMon(r); if(ai>=0){aCum[ai]++;aNew[ai]++;} });
  for(let i=1;i<n;i++){ pCum[i]+=pCum[i-1]; fCum[i]+=fCum[i-1]; aCum[i]+=aCum[i-1]; }   // cumulative
  const projStartIdx = months.indexOf((model.meta.projectStartDate||'').slice(0,7));
  const asofMonth = (model.meta.today||'').slice(0,7);
  const asofIdx = months.indexOf(asofMonth);
  const monthlyProgress={ months, pCum, fCum, aCum, pNew, fNew, aNew, projStartIdx, asofIdx, projStartLabel: model.meta.projectStartDate || '' };
  const curMonth = matrixMonthSel || asofMonth;
  const matrix = buildMatrix(active, foSet, soSet, coSet, curMonth);
  const matrixMonths = monthOptions(model.records, asofMonth, model.meta.projectStartDate).map(ym=>({value:ym, label:monthLabel(ym)+(ym===asofMonth?' (as-of)':''), asof:ym===asofMonth}));
  return { recs, active, issues, kpis, charts, matrix, monthlyProgress, firstOverdue, subOverdue, cliOverdue, curMonth, matrixMonths };
}
function buildMatrix(active, foSet, soSet, coSet, curMonth){
  const map={};
  const keyOf=r=>r.sourceTab+'!'+r.rownum;
  const planMo = r => !!curMonth && (r.fields['Planned 1st Issue Date']||'').slice(0,7)===curMonth;
  const fcastMo = r => !!curMonth && (r.fields['Forecast 1st Issue Date']||r.fields['Planned 1st Issue Date']||'').slice(0,7)===curMonth;
  const actualMo = r => !!curMonth && (r.fields['Actual 1st Issue Date']||'').slice(0,7)===curMonth;
  const bump=(o,r)=>{ const k=keyOf(r); o.Planned++;
    // I-79: Submitted is error-aware (a date formula-error counts as submitted), matching the KPI.
    if((r.fields['Actual 1st Issue Date']||'')!=='' || !!(r.fieldErrors && r.fieldErrors.has('Actual 1st Issue Date'))) o.Submitted++;
    if(planMo(r)) o.PlanMo++; if(fcastMo(r)) o.FcastMo++; if(actualMo(r)) o.ActualMo++;
    // I-79: approval split derives from the single approvalCategory classifier (Case 3 only) — a doc
    // with an approval code but no submission date lands in Record Error, not in an approval column.
    const cat = approvalCategory(r);
    if(cat==='APP') o.Approved++; else if(cat==='AWC') o.AWC++; else if(cat==='REJ') o.REJ++; else if(cat==='NAP') o.NAP++;
    if(foSet.has(k)) o.ov1++; if(soSet.has(k)) o.ov2++; if(coSet.has(k)) o.ov3++;
  };
  active.forEach(r=>{
    const d=r.discipline||'—';
    if(!map[d]) map[d]={discipline:d,Planned:0,Submitted:0,PlanMo:0,FcastMo:0,ActualMo:0,Approved:0,AWC:0,REJ:0,NAP:0,ov1:0,ov2:0,ov3:0,stages:{}};
    const m=map[d]; bump(m,r);
    const st=r.stage||'—';
    if(!m.stages[st]) m.stages[st]={stage:st,Planned:0,Submitted:0,PlanMo:0,FcastMo:0,ActualMo:0,Approved:0,AWC:0,REJ:0,NAP:0,ov1:0,ov2:0,ov3:0};
    bump(m.stages[st],r);
  });
  return Object.values(map)
    .map(m=>({ ...m, stages: Object.values(m.stages).sort((a,b)=> a.stage<b.stage?-1: a.stage>b.stage?1:0) }))
    .sort((a,b)=> b.Planned - a.Planned);
}

// ---------- render ----------
let MODEL=null, STATE=null, WRAP=null;
let chartView={ doc:{base:'docsByDiscipline',type:'bar'}, iss:{base:'dqByDiscipline',type:'bar'} };
let scurveWin=null;
let curveShowBars=true;        // I-86: Bars toggle state (shared with the period window)
let curveLastScaleMode='single'; // I-87: active scale mode, retained during the 6…10 hysteresis band
let curvePreset=null;          // I-136: active preset name. null means a manual range.
let curveState=null;           // I-136: live DOM and geometry state for one Issue Progress panel.
let matrixMonthSel='';   // '' => use as-of month; otherwise a YYYY-MM chosen in the Matrix header
let matrixCurMonth='';   // effective month currently shown in the matrix (for the PNG/Copy export)
const collapsed = new Set();
const MONTHS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function monthLabel(ym){ if(!ym||ym.length!==7) return 'This Mth'; const [y,m]=ym.split('-'); return MONTHS[(+m)-1]+' '+y; }
function monthOptions(records, asof, projectStart){
  // Continuous (gap-free) range so every month in the project's life is selectable, even
  // with no submissions. The start month is the EARLIER of the project start (Code!B6) and
  // the earliest planned/forecast/actual first-issue date in the data — matching the
  // Issue-Progress "whole month range" rule, so months before B6 are reachable too.
  let dMin=null, dMax=null;
  for(const r of (records||[])){
    for(const f of ['Planned 1st Issue Date','Forecast 1st Issue Date','Actual 1st Issue Date']){
      const v=(r.fields&&r.fields[f])||''; const ym=v.slice(0,7); if(/^\d{4}-\d{2}$/.test(ym)){
        if(dMin===null||ym<dMin) dMin=ym;
        if(dMax===null||ym>dMax) dMax=ym;
      }
    }
  }
  const ps = (projectStart && /^\d{4}-\d{2}/.test(projectStart)) ? projectStart.slice(0,7) : null;
  let start = (ps && dMin) ? (ps < dMin ? ps : dMin) : (ps || dMin);   // earlier of B6 and earliest data
  let end = dMax;
  if(asof){ if(end===null||asof>end) end=asof; if(start===null||asof<start) start=asof; }
  const out=[];
  if(start && end && start<=end){
    let [y,m]=start.split('-').map(Number);
    const [ey,em]=end.split('-').map(Number);
    while(y<ey || (y===ey && m<=em)){
      out.push(String(y).padStart(4,'0')+'-'+String(m).padStart(2,'0'));
      if(++m>12){ m=1; y++; }
    }
  }
  return out;
}
let statusBarEl = null;
let tfDocBound = false;
let renderIssues = [];
let crosshairBound = false;
let crosshairState = null;
let crosshairObserver = null;
let kpiTipBound = false;
let kpiTipHost = null;
function getPref(key, def){ try{ const v=localStorage.getItem('mdl_'+key); if(v==null) return def; if(typeof def === 'boolean') return v === 'true'; if(typeof def === 'number') return Number(v); return v; }catch(e){ return def; } }
function setPref(key, val){ try{ localStorage.setItem('mdl_'+key, val); }catch(e){} }
const SHELL_PAGES = ['Overview','Progress','Overdue','Validation','Documents'];
let currentPage = 'Overview';
function slugify(s){ return String(s==null?'':s).trim().replace(/\.(xlsx|xlsm)$/i,'').replace(/[^A-Za-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || 'MDL'; }
function localDateISO(){ const d=new Date(); const p=n=>String(n).padStart(2,'0'); return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate()); }
function applyShellPrefs(){
  const theme=['light','dark','sky','ocean','presentation','contrast'].includes(getPref('theme','light')) ? getPref('theme','light') : 'light';
  const layout=['one','two','three'].includes(getPref('layout','two')) ? getPref('layout','two') : 'two';
  document.body.dataset.theme = theme;
  document.body.dataset.layout = layout;
  const t=document.getElementById('themeSel'); if(t) t.value=theme;
  const l=document.getElementById('layoutSel'); if(l) l.value=layout;
}
function setPage(page){
  if(!SHELL_PAGES.includes(page)) page='Overview';
  currentPage=page;
  document.body.dataset.page = page.toLowerCase();
  document.querySelectorAll('[data-shell="left-sidebar"] .nav-item[data-page]').forEach(b=>{
    const on=b.dataset.page===page;
    b.classList.toggle('active',on);
    if(on) b.setAttribute('aria-current','page'); else b.removeAttribute('aria-current');
  });
  document.querySelectorAll('.panel[data-page]').forEach(p=>p.classList.toggle('page-active',p.dataset.page===page));
  const label=document.getElementById('activePageLabel'); if(label) label.textContent=page;
}
function assignCrosshairIds(){
  document.querySelectorAll('.panel-area table.ds-table').forEach(t=>{
    t.setAttribute('data-table-crosshair','');
    t.querySelectorAll('.ds-gut').forEach(c=>c.removeAttribute('data-col-id'));
    const thead=t.querySelector('thead');
    if(thead && !thead.querySelector('[data-col-id]')){
      const rows=[...thead.querySelectorAll('tr')], leaf=rows[rows.length-1];
      if(leaf) [...leaf.children].forEach((c,i)=>{ if(!c.classList.contains('ds-gut')){ c.dataset.colId='c'+i; c.tabIndex=0; } });
    }
    t.querySelectorAll('tbody tr,tfoot tr').forEach(tr=>{
      [...tr.children].forEach((c,i)=>{
        if(c.classList.contains('ds-gut')) return;
        if(!c.dataset.colId) c.dataset.colId='c'+i;
        c.tabIndex=0;
      });
    });
  });
  if(!crosshairObserver && typeof MutationObserver === 'function'){
    const area=document.querySelector('.panel-area');
    if(area){ crosshairObserver=new MutationObserver(()=>assignCrosshairIds()); crosshairObserver.observe(area,{childList:true,subtree:true}); }
  }
}
function clearCrosshair(){
  if(!crosshairState) return;
  crosshairState.cell.classList.remove('cell-hover');
  if(crosshairState.row) crosshairState.row.classList.remove('row-hover');
  if(crosshairState.rowHead) crosshairState.rowHead.classList.remove('rowhead-hover');
  crosshairState.cols.forEach(c=>c.classList.remove(crosshairState.linked?'col-active':'col-hover'));
  if(crosshairState.linked && curveState) curveSyncColumn(curveState,-1);
  crosshairState=null;
}
function applyCrosshair(cell){
  const table=cell && cell.closest ? cell.closest('table[data-table-crosshair]') : null;
  const id=cell && cell.dataset ? cell.dataset.colId : null;
  if(!table || !table.closest('.panel-area') || !id){ clearCrosshair(); return; }
  if(crosshairState && crosshairState.cell===cell) return;
  clearCrosshair();
  const scope=table.closest('.ds-split') || table.closest('.matrixcard') || table.closest('.splitcard') || table;
  const cols=[...scope.querySelectorAll('[data-col-id]')].filter(c=>c.dataset.colId===id);
  const row=cell.closest('tr');
  if(row && row.closest('tbody')) row.classList.add('row-hover');
  // Row header: the leading th[scope=row] in this same row (req 7 — right-edge accent, header tier).
  const rowHead=row ? row.querySelector('th[scope="row"]') : null;
  if(rowHead && rowHead!==cell) rowHead.classList.add('rowhead-hover');
  const linked=table.classList.contains('curve-c1-table');
  if(linked){ if(curveState && curveState.table===table) curveSyncColumn(curveState,Number(cell.dataset.c1col)); }
  else cols.forEach(c=>c.classList.add('col-hover'));
  cell.classList.add('cell-hover');
  crosshairState={cell,row,rowHead,cols,linked};
}
function bindTableCrosshair(){
  if(crosshairBound) return;
  crosshairBound=true;
  const finePointer=typeof window.matchMedia !== 'function' || window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.addEventListener('pointermove', e=>{
    if(!finePointer) return;
    const cell=e.target && e.target.closest ? e.target.closest('[data-col-id]') : null;
    applyCrosshair(cell);
  });
  document.addEventListener('pointerdown', e=>{
    if(e.pointerType!=='touch') return;
    const cell=e.target && e.target.closest ? e.target.closest('[data-col-id]') : null;
    if(cell){ applyCrosshair(cell); setTimeout(clearCrosshair,400); }
  });
  document.addEventListener('keydown', e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key)) return;
    const cell=e.target && e.target.closest ? e.target.closest('[data-col-id]') : null;
    if(!cell || cell.classList.contains('ds-gut')) return;
    const table=cell.closest('table[data-table-crosshair]');
    if(!table) return;
    const cells=[...table.querySelectorAll('[data-col-id]')];
    let target=null;
    if(e.key==='ArrowLeft' || e.key==='ArrowRight'){
      const rowCells=cells.filter(c=>c.parentElement===cell.parentElement);
      const i=rowCells.indexOf(cell);
      if(i>=0) target=rowCells[i+(e.key==='ArrowRight'?1:-1)];
    } else {
      const colCells=cells.filter(c=>c.dataset.colId===cell.dataset.colId);
      const i=colCells.indexOf(cell);
      if(i>=0) target=colCells[i+(e.key==='ArrowDown'?1:-1)];
    }
    if(target){ e.preventDefault(); target.focus(); applyCrosshair(target); }
  });
  document.addEventListener('focusin', e=>{
    const target=e.target;
    const cell=target && target.closest ? (target.closest('[data-col-id]') || (target.matches && target.matches('tr') ? target.querySelector('td[data-col-id]') : null)) : null;
    applyCrosshair(cell);
  });
  document.addEventListener('focusout', clearCrosshair);
  document.addEventListener('pointerleave', clearCrosshair, true);
  window.addEventListener('blur', clearCrosshair);
  window.addEventListener('beforeprint', clearCrosshair);
}
function hideKpiTip(){
  const tip=document.getElementById('kpiTip'); if(!tip) return;
  tip.classList.remove('show'); tip.setAttribute('aria-hidden','true'); tip.textContent=''; kpiTipHost=null;
}
function showKpiTip(host){
  const tip=document.getElementById('kpiTip'); if(!tip) return;
  if(kpiTipHost!==host){ tip.innerHTML=host.getAttribute('data-tip')||''; kpiTipHost=host; }
  tip.removeAttribute('aria-hidden'); tip.classList.add('show');
  const r=host.getBoundingClientRect();
  const vw=window.innerWidth||document.documentElement.clientWidth||0;
  const vh=window.innerHeight||document.documentElement.clientHeight||0;
  const tw=tip.offsetWidth||230, th=tip.offsetHeight||100;
  let left=r.left+r.width/2-tw/2, top=r.bottom+6;
  if(top+th>vh-4) top=Math.max(4,r.top-th-6);
  left=Math.max(4,Math.min(left,Math.max(4,vw-tw-4)));
  tip.style.left=left+'px'; tip.style.top=top+'px';
}
function bindKpiHover(){
  if(kpiTipBound) return;
  kpiTipBound=true;
  document.addEventListener('pointermove', e=>{
    const host=e.target && e.target.closest ? e.target.closest('.kpi-card[data-tip]') : null;
    if(host) showKpiTip(host); else hideKpiTip();
  });
  document.addEventListener('pointerdown', e=>{
    const host=e.target && e.target.closest ? e.target.closest('.kpi-card[data-tip]') : null;
    if(host && e.pointerType!=='mouse') showKpiTip(host);
  });
  document.addEventListener('focusin', e=>{
    const host=e.target && e.target.closest ? e.target.closest('.kpi-card[data-tip]') : null;
    if(host) showKpiTip(host); else hideKpiTip();
  });
  document.addEventListener('focusout', hideKpiTip);
  document.addEventListener('pointerleave', hideKpiTip, true);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') hideKpiTip(); });
  document.addEventListener('click', e=>{
    if(!(e.target && e.target.closest && e.target.closest('.kpi-card[data-tip]'))) hideKpiTip();
  });
  window.addEventListener('blur', hideKpiTip);
  window.addEventListener('beforeprint', hideKpiTip);
}
let settingsModalEl=null;
function ensureSettingsModal(){
  if(settingsModalEl) return settingsModalEl;
  const m=document.createElement('div'); m.className='help-modal'; m.hidden=true;
  m.innerHTML=`<div class="box" role="dialog" aria-modal="true" aria-labelledby="settingsTitle"><header><h3 id="settingsTitle">Settings</h3><button class="close icon-btn" title="Close settings" aria-label="Close settings">✕</button></header><div class="body"><p><label for="themeSel"><strong>Theme</strong></label> <select id="themeSel" class="inter-sel" aria-label="Theme"><option value="light">Light</option><option value="dark">Dark</option><option value="sky">Sky</option><option value="ocean">Ocean</option><option value="presentation">Presentation</option><option value="contrast">Contrast</option></select></p><p><label for="layoutSel"><strong>Layout</strong></label> <select id="layoutSel" class="inter-sel" data-setting="layout" aria-label="Panel layout"><option value="one">One</option><option value="two">Two</option><option value="three">Three</option></select></p><div class="note">Layout changes the panel grid. KPI density stays controlled separately.</div></div></div>`;
  m.addEventListener('click', e=>{ if(e.target===m) m.hidden=true; });
  m.querySelector('.close').onclick=()=>{ m.hidden=true; };
  m.querySelector('#themeSel').addEventListener('change', e=>{ setPref('theme',e.target.value); applyShellPrefs(); });
  m.querySelector('#layoutSel').addEventListener('change', e=>{ setPref('layout',e.target.value); applyShellPrefs(); });
  (document.body||document.documentElement).appendChild(m);
  settingsModalEl=m; return m;
}
function openSettings(){ const m=ensureSettingsModal(); applyShellPrefs(); m.hidden=false; }
function openDashboardHelp(){
  const m=ensureHelpModal();
  m.querySelector('#helpTitle').textContent='MDL Dashboard — shell and navigation';
  m.querySelector('#helpBody').innerHTML='<p>Use the left sidebar to open Overview, Progress, Overdue, Validation and Documents. Settings holds Theme and Layout. The top menu Search and discipline / stage filters apply to every panel.</p><p class="note">Export downloads one XLSX workbook with one worksheet per rendered table. Breakdown is not enabled for MDL.</p>';
  m.hidden=false;
}
const CRC32_TABLE = (()=>{ const t=new Uint32Array(256); for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c=(c&1)?(0xEDB88320^(c>>>1)):(c>>>1); t[n]=c>>>0; } return t; })();
function crc32(u8){ let c=0xFFFFFFFF; for(let i=0;i<u8.length;i++) c=CRC32_TABLE[(c^u8[i])&0xFF]^(c>>>8); return (c^0xFFFFFFFF)>>>0; }
function utf8Bytes(s){
  if(typeof TextEncoder === 'function') return new TextEncoder().encode(s);
  const out=[]; for(let i=0;i<s.length;i++){ let c=s.charCodeAt(i); if(c<0x80) out.push(c); else if(c<0x800){ out.push(0xC0|(c>>6),0x80|(c&63)); } else { out.push(0xE0|(c>>12),0x80|((c>>6)&63),0x80|(c&63)); } }
  return new Uint8Array(out);
}
function zipFiles(files){
  const chunks=[], central=[]; let offset=0; const dosTime=0, dosDate=0x21;
  for(const f of files){
    const name=utf8Bytes(f.name), data=utf8Bytes(f.data), crc=crc32(data);
    const lh=new Uint8Array(30); const lv=new DataView(lh.buffer);
    lv.setUint32(0,0x04034b50,true); lv.setUint16(4,20,true); lv.setUint16(6,0x0800,true); lv.setUint16(8,0,true);
    lv.setUint16(10,dosTime,true); lv.setUint16(12,dosDate,true); lv.setUint32(14,crc,true);
    lv.setUint32(18,data.length,true); lv.setUint32(22,data.length,true); lv.setUint16(26,name.length,true); lv.setUint16(28,0,true);
    chunks.push(lh,name,data);
    const ch=new Uint8Array(46); const cv=new DataView(ch.buffer);
    cv.setUint32(0,0x02014b50,true); cv.setUint16(4,20,true); cv.setUint16(6,20,true); cv.setUint16(8,0x0800,true);
    cv.setUint16(10,0,true); cv.setUint16(12,dosTime,true); cv.setUint16(14,dosDate,true); cv.setUint32(16,crc,true);
    cv.setUint32(20,data.length,true); cv.setUint32(24,data.length,true); cv.setUint16(28,name.length,true);
    cv.setUint32(42,offset,true); central.push(ch,name);
    offset += lh.length + name.length + data.length;
  }
  const cdSize=central.reduce((n,p)=>n+p.length,0); const end=new Uint8Array(22); const ev=new DataView(end.buffer);
  ev.setUint32(0,0x06054b50,true); ev.setUint16(8,files.length,true); ev.setUint16(10,files.length,true);
  ev.setUint32(12,cdSize,true); ev.setUint32(16,offset,true);
  return new Blob([...chunks,...central,end],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
}
function xmlEsc(s){ return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;'); }
function colRef(n){ let s=''; n++; while(n>0){ const m=(n-1)%26; s=String.fromCharCode(65+m)+s; n=Math.floor((n-1)/26); } return s; }
function sheetXml(t){
  const head=(t.headers&&t.headers.length?[t.headers]:[]);
  const rows=head.concat(t.rows||[]);
  const body=rows.map((r,ri)=>'<row r="'+(ri+1)+'">'+r.map((v,ci)=>'<c r="'+colRef(ci)+(ri+1)+'" t="inlineStr"><is><t xml:space="preserve">'+xmlEsc(v)+'</t></is></c>').join('')+'</row>').join('');
  return '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>'+body+'</sheetData></worksheet>';
}
function workbookTables(){
  const out=[];
  document.querySelectorAll('.panel').forEach(panel=>{
    panel.querySelectorAll('table').forEach(tbl=>{
      if(tbl.classList.contains('vheadtab')) return;
      const rows=[...tbl.tBodies].flatMap(tb=>[...tb.rows]).filter(r=>!r.classList.contains('win-pad')).map(r=>[...r.cells].filter(c=>!c.classList.contains('ds-gut')).map(c=>c.textContent.trim()));
      if(!rows.length) return;
      const htab=tbl.closest('.splitcard') && tbl.closest('.splitcard').querySelector('.vheadtab');
      const hr=tbl.tHead && tbl.tHead.rows[tbl.tHead.rows.length-1] || htab && htab.tHead && htab.tHead.rows[htab.tHead.rows.length-1];
      const headers=hr?[...hr.cells].filter(c=>!c.classList.contains('ds-gut')).map(c=>c.textContent.trim()):[];
      out.push({name:panel.dataset.label||panel.id||'Table',headers,rows});
    });
  });
  return out;
}
function buildWorkbook(tables){
  const files=[], used=new Set();
  const sheets=tables.map((t,i)=>{ let n=String(t.name||('Sheet '+(i+1))).replace(/[\\/?*\[\]:]/g,'_').slice(0,31)||('Sheet '+(i+1)); if(used.has(n)) n=(n.slice(0,27)+'_'+(i+1)).slice(0,31); used.add(n); return {n,r:'rId'+(i+1)}; });
  files.push({name:'[Content_Types].xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'+sheets.map((s,i)=>'<Override PartName="/xl/worksheets/sheet'+(i+1)+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>').join('')+'</Types>'});
  files.push({name:'_rels/.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>'});
  files.push({name:'xl/workbook.xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+sheets.map((s,i)=>'<sheet name="'+xmlEsc(s.n)+'" sheetId="'+(i+1)+'" r:id="'+s.r+'"/>').join('')+'</sheets></workbook>'});
  files.push({name:'xl/_rels/workbook.xml.rels',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+sheets.map((s,i)=>'<Relationship Id="'+s.r+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+(i+1)+'.xml"/>').join('')+'<Relationship Id="rIdS" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>'});
  files.push({name:'xl/styles.xml',data:'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs></styleSheet>'});
  tables.forEach((t,i)=>files.push({name:'xl/worksheets/sheet'+(i+1)+'.xml',data:sheetXml(t)}));
  return zipFiles(files);
}
function exportWorkbook(){
  const tables=workbookTables();
  if(!tables.length){ toast('No tables to export.'); return; }
  const blob=buildWorkbook(tables), url=URL.createObjectURL(blob), a=document.createElement('a');
  a.href=url; a.download=xp('all-tables')+'.xlsx'; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),2000); toast('Workbook exported: '+tables.length+' worksheets.');
}
function getFilterDefs(model){
  // Two filters only: Discipline + Stage.
  // IMPORTANT (population rule): data options come from the VALUES ACTUALLY PRESENT in the
  // workbook's document-list tabs — there is no master list, so an ordinary value that appears
  // in no row is never offered (the list grows/shrinks with the data); a '（blank）' option only
  // appears when some row leaves that column empty.
  // Exception — the excluded stages (Deleted/Void/Superseded): they are ALWAYS offered, even
  // when no row uses them yet, but they are recorded in `noCount` so they start deselected
  // (unchecked) and are not counted on load. Ticking one deliberately includes it.
  // This is why those three must be appended rather than discovered: the counting rule itself
  // references them, so hiding them whenever the data happens to be clean would hide the rule.
  const disc=[...new Set(model.records.map(r=>r.discipline).filter(Boolean))].sort();
  const stgPresent=[...new Set(model.records.map(r=>r.stage).filter(Boolean))].sort();
  const stg=stgPresent.concat(EXCLUDE_STAGES.filter(s=>!stgPresent.includes(s)));
  return [
    {key:'disciplines',label:'Discipline',items:disc,noCount:[],hasBlank:model.records.some(r=>!r.discipline)},
    {key:'stages',label:'Stage',items:stg,noCount:stg.filter(s=>EXCLUDE_STAGES.includes(s)),hasBlank:model.records.some(r=>!r.stage)},
  ];
}
// All selectable options for a dimension (data values + optional blank).
function optsOf(d){ return d.items.concat(d.hasBlank ? [''] : []); }
// The counted baseline: everything except the never-counted values. Used for initial state,
// for the All button and for deciding whether the badge reads "All".
function baseOpts(d){ return d.items.filter(v => !(d.noCount||[]).includes(v)).concat(d.hasBlank ? [''] : []); }
function isBaseSet(d, state){ const b = baseOpts(d), s = state[d.key]; return !!s && s.size === b.length && b.every(v => s.has(v)); }
function bannerItemsHTML(warnings){
  if(!warnings || !warnings.length) return '';
  return warnings.map(w => {
    const cls = w.level === 'fatal' ? 'fatal' : (w.level === 'info' ? 'info' : 'warn');
    const ic = w.level === 'fatal' ? '⛔' : (w.level === 'info' ? 'ℹ️' : '⚠️');
    return `<div class="sys-banner-item ${cls}">${ic} <b>${esc(w.code || 'SYSTEM')}</b>${esc(w.message || '')}</div>`;
  }).join('');
}
// --- in-flow warning bar (#errBanner, spec §3.5) ---
// Visibility is driven by ONE resolver, applyBannerState(), so the user's persisted collapse
// preference is always respected — including notices appended *after* the user collapsed the bar.
function expandBanner(b, ctx){
  b.hidden = false;
}
function collapseBanner(b){
  b.hidden = true;
}
function closeBanner(b){            // teardown: no notices left
  b.hidden = true; b.innerHTML = '';
}
function applyBannerState(b, ctx){
  ctx = ctx || (document.querySelector('header.app') ? 'dash' : 'welcome');
  if(!b) return;
  if(!b.children.length){ closeBanner(b); }
  else if(getPref('hideWarnings', false)){ collapseBanner(b); }
  else { expandBanner(b, ctx); }
  refreshWarnBtn();
}
// Keep the app-bar toggle in sync: present only when ≥1 notice, shows the count, reflects aria-pressed.
function refreshWarnBtn(){
  const btn = document.getElementById('warnBtn'); if(!btn) return;
  const bar = document.getElementById('errBanner');
  const n = bar ? bar.querySelectorAll('.sys-banner-item').length : 0;
  const hide = getPref('hideWarnings', false);
  btn.hidden = n === 0;
  btn.setAttribute('aria-pressed', String(hide));
  const badge = btn.querySelector('.badge'); if(badge) badge.textContent = n;
  const lab = btn.querySelector('#warnLabel'); if(lab) lab.textContent = 'Warnings';
  // Stable label + accessible name: the title is always "Warnings" with the count in the badge —
  // it must NOT invert to "Show/Hide warnings" when the bar is collapsed (spec §3.1 / §7.1).
  btn.setAttribute('aria-label', `Data-quality warnings (${n})`);
}
function showBanner(warnings){
  const b = document.getElementById('errBanner'); if(!b) return;
  b.innerHTML = bannerItemsHTML(warnings);   // empty string is fine — resolver tears down
  applyBannerState(b, document.querySelector('header.app') ? 'dash' : 'welcome');
}
function showError(msg){
  let b = document.getElementById('errBanner');
  if(!b){ b = document.createElement('div'); b.id = 'errBanner'; b.setAttribute('role','alert'); b.setAttribute('aria-live','assertive'); document.body.appendChild(b); }
  b.innerHTML = '<div class="sys-banner-item fatal">⛔ <b>Load failed</b> ' + esc(msg) + ' &nbsp;·&nbsp; press F12 → Console for the full trace.</div>';
  applyBannerState(b, document.querySelector('header.app') ? 'dash' : 'welcome');
}
// Append a single notice strip to the unified bar (spec §3.5). Used for notices that are only
// known after the initial render (render failures, discovered config) so they never fall back to
// in-flow cards — the bar stays the only warning surface.
function addBannerNotice(level, code, message, tag){
  const b = document.getElementById('errBanner');   if(!b) return;
const cls = level === 'fatal' ? 'fatal' : (level === 'info' ? 'info' : 'warn');
  const ic = level === 'fatal' ? '⛔' : (level === 'info' ? 'ℹ️' : '⚠️');
  const d = document.createElement('div');
  d.className = 'sys-banner-item ' + cls;
  if(tag) d.dataset.banner = tag;
  d.innerHTML = `${ic} <b>${esc(code || 'SYSTEM')}</b>${esc(message || '')}`;
  b.appendChild(d);
  applyBannerState(b, document.querySelector('header.app') ? 'dash' : 'welcome');
}
function removeBannerNotices(tag){
  const b = document.getElementById('errBanner'); if(!b) return;
  b.querySelectorAll('.sys-banner-item[data-banner="' + tag + '"]').forEach(n => n.remove());
  applyBannerState(b, document.querySelector('header.app') ? 'dash' : 'welcome');   // re-measure / teardown
}
function renderDashboard(root, model){
  MODEL = model; WRAP = null; collapsed.clear(); scurveWin = null; curvePreset = null; curveState = null; matrixMonthSel = ''; toastActive.length = 0; toastQueue.length = 0;   // full reset on a fresh load
  currentPage = 'Overview';
  const defs = getFilterDefs(model);
  const initSet = d => new Set(baseOpts(d));
  STATE = { disciplines:initSet(defs[0]), stages:initSet(defs[1]), search:'', searchCol:'Document No.', rule:null, sort:{col:null,dir:1} };
  root.innerHTML = `<style>${CSS}</style>`;
  bindTableCrosshair();
  bindKpiHover();
  const header = document.createElement('header'); header.className='app';
  const titleText = model.meta.projectTitle || (model.meta.workbookName ? model.meta.workbookName.replace(/\.(xlsx|xlsm)$/i,'') : 'Dashboard');
  const filterBtn = d => `<div class="tf-wrap"><button id="tfBtn_${d.key}" class="tf-btn" title="Applies to all panels — filters the whole dashboard" aria-expanded="false" aria-haspopup="true" aria-controls="tfPanel_${d.key}">${esc(d.label)}<span class="tf-cnt" id="tfCnt_${d.key}"></span></button><div class="tf-panel" id="tfPanel_${d.key}" role="group" aria-label="Filter every panel by ${esc(d.label.toLowerCase())}" hidden></div></div>`;
  const colOpts = model.contract.fieldOrder.map(f => `<option value="${esc(f)}"${f==='Document No.'?' selected':''}>${esc(f)}</option>`).join('');
  const subLine = model.meta.dashboardTitle ? `<div class="sub">${esc(model.meta.dashboardTitle)}</div>` : '';
  header.innerHTML = `<div class="app-top" data-shell="titlebar"><div class="brand"><img class="logo" src="${LOGO_DATA}" alt="logo"><div class="ttl-stack"><h1 class="ttl">${esc(titleText)}</h1>${subLine}<div class="meta">Project start ${esc(model.meta.projectStartDate || '—')} · as of ${esc(model.meta.today)}</div></div></div><span class="page-label" id="activePageLabel" aria-live="polite">Overview</span></div>
<div class="app-menu" data-shell="menubar"><div class="actions"><button id="sidebarToggle" class="btn" type="button" data-shell-toggle="left-sidebar" aria-label="Collapse left sidebar" title="Toggle left sidebar">☰</button><button id="reload" class="btn btn-primary">Load Workbook</button><button id="exportWorkbook" class="btn" type="button" title="Download all data tables as one XLSX workbook">Export</button></div><div class="filter-group">${defs.map(filterBtn).join('')}<div class="tf-wrap"><button id="searchToggle" class="btn" type="button" title="Applies to all panels — filters the whole dashboard" aria-haspopup="dialog" aria-controls="searchPanel">Search</button><div class="tf-panel search-panel" id="searchPanel" role="dialog" aria-label="Search documents — filters every panel"><div class="search-row"><div class="search" style="flex:1 1 auto;width:auto;min-width:240px;max-width:none"><select id="fCol" class="inter-sel is-attached" aria-label="Search column">${colOpts}</select><input id="fSearch" class="search-input" type="search" value="${esc(STATE.search)}" placeholder="Search Document No.…" aria-label="Search value"></div><button id="fGo" class="btn btn-primary" type="button">Find</button><button id="fReset" class="btn" type="button">Reset</button></div></div></div><button id="warnBtn" class="btn warn-toggle" aria-pressed="false" aria-label="Data-quality warnings (0)" hidden><span class="badge">0</span> <span id="warnLabel">Warnings</span></button></div></div>`;
  root.appendChild(header);

  const shell = document.createElement('div'); shell.className='shell-main'; root.appendChild(shell);
  const sidebar = document.createElement('aside'); sidebar.dataset.shell='left-sidebar'; sidebar.setAttribute('aria-label','Primary navigation');
  sidebar.innerHTML = `<div class="nav-list" role="group" aria-label="Pages">${SHELL_PAGES.map(p=>`<button class="nav-item${p==='Overview'?' active':''}" type="button" data-page="${esc(p)}"${p==='Overview'?' aria-current="page"':''}>${esc(p)}</button>`).join('')}</div><div class="nav-tools" role="group" aria-label="Dashboard tools"><button id="settingsBtn" class="nav-item" type="button">Settings</button><button id="helpBtn" class="nav-item" type="button">Help</button></div><div class="sidebar-resizer" data-shell-resize="left-sidebar" role="separator" aria-orientation="vertical" aria-label="Resize left sidebar"></div>`;
  shell.appendChild(sidebar);
  const wrap = document.createElement('div'); wrap.className='wrap'; wrap.dataset.shell='content'; shell.appendChild(wrap); WRAP = wrap;

  const eb = document.createElement('div'); eb.id='errBanner'; eb.dataset.shell='warnings'; eb.setAttribute('role','alert'); eb.setAttribute('aria-live','assertive'); wrap.appendChild(eb);
  showBanner(model.warnings);
  const filterArea = document.createElement('div'); filterArea.className='filter-strip'; filterArea.dataset.shell='filter-area'; filterArea.id='filterArea'; wrap.appendChild(filterArea);
  const contentBody = document.createElement('div'); contentBody.className='content-body'; contentBody.dataset.shell='body'; wrap.appendChild(contentBody);
  const panelArea = document.createElement('div'); panelArea.className='panel-area'; contentBody.appendChild(panelArea);

  statusBarEl = document.createElement('div'); statusBarEl.id='statusBar'; statusBarEl.dataset.shell='statusbar'; statusBarEl.className='status-bar'; statusBarEl.innerHTML='<span class="sb-loading">Loading dashboard…</span>'; root.appendChild(statusBarEl);
  if(!document.getElementById('toast')){ const th=document.createElement('div'); th.id='toast'; root.appendChild(th); }

  const fSearch = header.querySelector('#fSearch'), fCol = header.querySelector('#fCol');
  const searchPanel = header.querySelector('#searchPanel'), searchToggle = header.querySelector('#searchToggle');
  const runSearch = () => { STATE.search = fSearch.value; STATE.searchCol = fCol.value; renderAll(wrap); };
  const closeSearch = () => { if(searchPanel) searchPanel.classList.remove('open'); };
  fSearch.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); runSearch(); closeSearch(); } else if(e.key === 'Escape'){ fSearch.value=''; STATE.search=''; renderAll(wrap); closeSearch(); } });
  header.querySelector('#fGo').addEventListener('click', () => { runSearch(); closeSearch(); });
  header.querySelector('#fReset').addEventListener('click', () => { fSearch.value=''; runSearch(); closeSearch(); });
  fCol.addEventListener('change', () => { fSearch.placeholder = 'Search ' + fCol.value + '…'; if(STATE.search) runSearch(); });
  if(searchToggle && searchPanel){
    searchToggle.addEventListener('click', e => { e.stopPropagation(); searchPanel.classList.toggle('open'); });
    document.addEventListener('click', e => { if(searchPanel && !searchPanel.contains(e.target) && !searchToggle.contains(e.target)) closeSearch(); });
  }
  const warnBtn = header.querySelector('#warnBtn');
  if(warnBtn) warnBtn.addEventListener('click', () => {
    setPref('hideWarnings', !getPref('hideWarnings', false));
    applyBannerState(document.getElementById('errBanner'));
  });
  header.querySelector('#sidebarToggle').addEventListener('click', e => {
    const collapsedNow = document.body.classList.toggle('sidebar-collapsed');
    e.currentTarget.setAttribute('aria-label', collapsedNow ? 'Expand left sidebar' : 'Collapse left sidebar');
    setTimeout(()=>applyBannerState(document.getElementById('errBanner')),0);
  });
  const resizer = sidebar.querySelector('[data-shell-resize]');
  resizer.addEventListener('pointerdown', e => {
    e.preventDefault(); resizer.setPointerCapture(e.pointerId);
    const move = ev => document.body.style.setProperty('--sidebar-w', Math.max(140, Math.min(280, ev.clientX)) + 'px');
    const up = () => { resizer.removeEventListener('pointermove',move); resizer.removeEventListener('pointerup',up); };
    resizer.addEventListener('pointermove',move); resizer.addEventListener('pointerup',up);
  });
  sidebar.querySelectorAll('.nav-item[data-page]').forEach(b => b.addEventListener('click', () => setPage(b.dataset.page)));
  document.getElementById('settingsBtn').addEventListener('click', openSettings);
  document.getElementById('helpBtn').addEventListener('click', () => openDashboardHelp());
  header.querySelector('#exportWorkbook').addEventListener('click', exportWorkbook);

  if(model.contract.noListYetDisciplines.length){
    addBannerNotice('info', 'CONFIG', `UESH disciplines with no document list yet (auto-discovered, shown for structure only): ${model.contract.noListYetDisciplines.join(', ')}.`);
  }

  const addPanel = (id, label, page) => { const p=document.createElement('div'); p.className='panel'; p.id=id; p.dataset.panel=''; p.dataset.label=label; if(page){p.dataset.page=page; if(page==='Overview')p.classList.add('page-active');} panelArea.appendChild(p); return p; };
  addPanel('kpiPanel','KPI Overview','Overview');
  const mp=addPanel('matrixPanel','Discipline Summary Matrix','Overview');
  const chartsPanel=addPanel('chartsPanel','Interactive Chart','Progress'); chartsPanel.innerHTML='<h2>Interactive Chart</h2>';
  const grid=document.createElement('div'); grid.className='charts'; chartsPanel.appendChild(grid);
  const curvePanel=addPanel('curvePanel','Issue Progress','Progress');
  curvePanel.innerHTML='<div class="panel-head"><h2>Issue Progress</h2><div class="head-actions" id="curveActions"></div></div>';
  const cbody=document.createElement('div'); cbody.className='curve-body'; curvePanel.appendChild(cbody);
  addPanel('overduePanel','Overdue List','Overdue');
  addPanel('validationRulesPanel','Validation Rules','Validation');
  addPanel('validationIssuesPanel','Validation Issues','Validation');
  addPanel('detailPanel','Document Detail Table','Documents');

  applyShellPrefs();
  setPage('Overview');
  document.getElementById('reload').onclick = ()=> boot(root);
  requestAnimationFrame(()=>renderAll(wrap));
}
function renderAll(wrap){
  WRAP = wrap;
  applyShellPrefs();
  const v = deriveView(MODEL, STATE);
  try { wireFilterChips(MODEL, STATE, ()=>renderAll(wrap), refreshData); }
  catch(e){ console.error('[wireFilterChips]', e); }
  renderData(wrap, v);
}
function refreshData(){ renderData(WRAP, deriveView(MODEL, STATE)); }
function renderData(wrap, v){
  v = v || deriveView(MODEL, STATE);
  applyShellPrefs();
  setPage(currentPage);
  renderIssues = [];
  const safe = (label, id, fn) => { const p = document.getElementById(id); try { fn(p); } catch(e){ reportPanelError(label, p, e); } };
  safe('KPI Overview', 'kpiPanel', p => renderKPIs(p, v.kpis, MODEL));
  safe('Discipline Summary Matrix', 'matrixPanel', p => renderMatrix(p, v.matrix, v.matrixMonths, v.curMonth));
  safe('Charts', 'chartsPanel', p => renderCharts(p.querySelector('.charts'), v.charts));
  safe('Issue Progress', 'curvePanel', p => renderCurvePanel(p.querySelector('.curve-body'), v.monthlyProgress));
  safe('Overdue List', 'overduePanel', p => renderOverdue(p, {first:v.firstOverdue,sub:v.subOverdue,cli:v.cliOverdue}, MODEL));
  safe('Validation Rules', 'validationRulesPanel', p => renderValidationRules(p, v.issues, MODEL));
  safe('Validation Issues', 'validationIssuesPanel', p => renderValidationIssues(p, v.issues, MODEL));
  safe('Document Detail Table', 'detailPanel', p => renderDetail(p, v.recs, MODEL, STATE, ()=>renderAll(wrap)));
  ['kpiPanel','matrixPanel','chartsPanel','curvePanel','overduePanel','validationRulesPanel','validationIssuesPanel','detailPanel'].forEach(id => { try { ensureCollapse(document.getElementById(id)); } catch(e){ console.error('[collapse] '+id, e); } });
  [...wrap.querySelectorAll('.panel')].forEach((p,i)=>{ p.dataset.panel = String(i+1); });
  assignCrosshairIds();
  renderStatusBar(v);
  showRenderIssues();
}

function filterSummary(){
  const defs = getFilterDefs(MODEL);
  const parts=[];
  defs.forEach(d=>{
    const s=STATE[d.key]; const total=optsOf(d).length;
    parts.push(d.label+': '+(isBaseSet(d,STATE)?'All':((s?s.size:0)+'/'+total)));
  });
  if(STATE.search) parts.push('Search '+STATE.searchCol+': "'+STATE.search+'"');
  const allDefault = defs.every(d=>isBaseSet(d,STATE)) && !STATE.search;
  return allDefault ? 'All documents (no filter applied)' : parts.join(' · ');
}
function renderStatusBar(v){
  if(!statusBarEl || !MODEL) return;
  const m=MODEL.meta, q=s=>esc(s);
  const gen = m.generatedAt ? m.generatedAt.slice(0,19).replace('T',' ') : '';
  const months=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const parts=(m.generatedAt||'').slice(0,10).split('-');
  const updated=parts.length===3 && months[Number(parts[1])-1] ? Number(parts[2])+' '+months[Number(parts[1])-1]+' '+parts[0] : '';
  const fa = document.getElementById('filterArea'); if(fa) fa.textContent = 'Global filters — ' + filterSummary();
  const fileTitle = q(m.workbookName||'') + (gen? ' · Generated '+q(gen) : '');
  const issueText = renderIssues && renderIssues.length ? '<span class="sb-err"><b>Render issues:</b> '+renderIssues.length+'</span>' : '';
  const right='MDL Dashboard v'+APP_VERSION+(updated?' · Updated '+updated:'')+' · © UESH 2026';
  statusBarEl.innerHTML = '<span class="sb-left"><span class="sb-dot" title="Workbook loaded"></span>'
    + '<span class="sb-file" title="'+fileTitle+'"><b>File:</b> '+q(m.workbookName||'—')+'</span>' + issueText + '</span>'
    + '<span class="sb-right">'+q(right)+'</span>';
}
function reportPanelError(label, panel, e){
  console.error('[render] '+label, e);
  const msg = (e && e.message) ? e.message : String(e);
  renderIssues.push({label, msg});
  if(!panel) return;
  let body = panel.querySelector('.panel-body');
  if(!body){ body = document.createElement('div'); body.className='panel-body'; }
  body.innerHTML = `<div class="panel-error"><b>⚠️ This panel could not be rendered.</b><br>${esc(label)} — ${esc(msg)}<br><span class="pe-detail">Open the browser console for the full error stack.</span></div>`;
  if(!panel.querySelector('.panel-body')) panel.appendChild(body);
}
function showRenderIssues(){
  removeBannerNotices('render');
  if(!renderIssues.length) return;
  const n = renderIssues.length;
  const names = renderIssues.map(r=>r.label).join(', ');
  addBannerNotice('warn', 'RENDER', `${n} panel${n>1?'s':''} failed to render: ${names}. See the affected panel(s) for details; the rest of the dashboard is unaffected.`, 'render');
}

function wireCollapse(panel){
  const btn = panel.querySelector('.collapse'); if(!btn) return;
  const apply = ()=>{ const on = collapsed.has(panel.id); panel.classList.toggle('collapsed', on); btn.textContent = on ? '+' : '−'; btn.title = on ? 'Expand panel' : 'Collapse panel'; };
  apply();
  btn.onclick = ()=>{ if(collapsed.has(panel.id)) collapsed.delete(panel.id); else collapsed.add(panel.id); apply(); };
}
function ensureCollapse(panel){
  if(!panel) return;
  let head=null;
  for(const ch of panel.children){ if(ch.classList && ch.classList.contains('panel-head')){ head=ch; break; } }
  if(!head){
    let h2=null;
    for(const ch of panel.children){ if(ch.tagName==='H2'){ h2=ch; break; } }
    if(!h2) return;
    head=document.createElement('div'); head.className='panel-head';
    panel.insertBefore(head, h2); head.appendChild(h2);
  }
  let ha=null;
  for(const ch of head.children){ if(ch.classList && ch.classList.contains('head-actions')){ ha=ch; break; } }
  if(!ha){ ha=document.createElement('div'); ha.className='head-actions'; head.appendChild(ha); }
  let body=null;
  for(const ch of panel.children){ if(ch.classList && ch.classList.contains('panel-body')){ body=ch; break; } }
  if(!body){
    body=document.createElement('div'); body.className='panel-body';
    let nxt=head.nextSibling;
    while(nxt){ const after=nxt.nextSibling; body.appendChild(nxt); nxt=after; }
    panel.appendChild(body);
  }
  let help = ha.querySelector('.help');
  if(!help){
    help = document.createElement('button'); help.className='help icon-btn'; help.textContent='?'; help.title='Panel help'; help.setAttribute('aria-label','Panel help');
    const coll = ha.querySelector('.collapse');
    if(coll) ha.insertBefore(help, coll); else ha.appendChild(help);
  }
  let has=false;
  for(const ch of ha.children){ if(ch.classList && ch.classList.contains('collapse')){ has=true; break; } }
  if(!has){
    const cb=document.createElement('button'); cb.className='collapse icon-btn'; cb.textContent='−'; cb.title='Collapse panel';
    ha.appendChild(cb);
  }
  help.onclick = ()=>openHelp(panel.id);
  wireCollapse(panel);
}
const HELP = {
  welcome:{title:'MDL welcome — required workbook',body:`
<h4>What you need</h4>
<p>Choose one Master Document List workbook. Use a readable <code>.xlsx</code> or <code>.xlsm</code> file.</p>
<h4>How the file is checked</h4>
<p>The Code sheet must set <strong>Dashboard Title</strong> to <code>Master Document List</code>. The file name is not used for this check.</p>
<p class="note">After the check passes, the dashboard opens automatically. Use <strong>Open now</strong> to open it sooner.</p>
`},
  kpiPanel:{title:'KPI Overview — Panel 1',body:`
<h4>What it shows</h4>
<p>Headline counts for the documents currently in view.</p>
<h4>Source data</h4>
<p>The active documents (definition below), from the document list on the Code sheet (columns A–Y). Every count respects the Filter Panel.</p>
<h4>How the numbers are worked out</h4>
<ul>
<li><strong>Total Planned</strong> — number of active documents.</li>
<li><strong>Submitted</strong> — active documents with a value in <em>Actual 1st Issue Date</em> (col U); a spreadsheet formula-error in that cell counts as submitted.</li>
<li><strong>Approved (APP) / Approved w/ Comments (AWC) / Rejected (REJ) / Not Approved (NAP)</strong> — derived from the single approval classifier, which gates on <em>Actual 1st Issue Date</em> (col U) over <em>Latest Approval Status</em> (col Y): these four count only documents that are BOTH submitted and carry the matching approval code (Case 3). The classifier also produces three further cards: <strong>Pending Review</strong> (submitted, no approval status yet), <strong>Not Submitted</strong> (no Actual 1st Issue Date and no approval), and <strong>Record Error</strong> (an approval status present without a submission date, or an unrecognized status code — the record must be corrected first).</li>
<li><strong>Overdue – 1st Sub / Resub / Client</strong> — the three overdue counts (same rules as Panel 5).</li>
<li><strong>As-Built Required (YES) / Vendor Data (YES)</strong> — active documents where <em>As-Built</em> (col P) / <em>Vendor Data</em> (col R) is "YES" (a requirement / by-vendor flag, not a submission status).</li>
<li><strong>Active Disciplines</strong> — the number of different <em>UESH Discipline</em> (col C) values.</li>
<li><strong>Data Completeness</strong> — the share of active documents that pass the completeness data-quality checks (rules V-17 to V-27 in the Code sheet Error Code block); see Panel 6.</li>
</ul>
<div class="def"><strong>Active document</strong> — a document whose <em>Stage</em> (col B) is not Deleted, Void, or Superseded. Those three stages are always excluded from counting, so they are not offered in the top-bar <b>Stage</b> filter.</div>
`},
  filterPanel:{title:'Search & Filters',body:`
<h4>Filters (top bar)</h4>
<p>The <b>Discipline</b> and <b>Stage</b> buttons in the top bar narrow every panel to the documents you want to study.</p>
<h4>Source data</h4>
<p>The two lists come from <em>UESH Discipline</em> (C) and <em>Stage</em> (B). Each list starts fully selected; <strong>Select All / Clear</strong> includes or excludes a whole list, or tick individual values.</p>
<h4>Search (top bar, second row)</h4>
<ul>
<li>Pick <b>one column</b> from the dropdown — it is populated automatically from the workbook's mapped fields (e.g. Document No., Document Title, UESH Discipline).</li>
<li>Type a value and press <b>Enter</b> (or click the magnifier) to filter. Typing alone does not filter; <b>Esc</b> clears.</li>
<li>Search matches a substring <b>within that one column only</b> — it does not span multiple columns.</li>
</ul>
<h4>Effect</h4>
<p>The selection and search are applied to KPI, Matrix, Charts, Issue Progress, Overdue, Validation, and Document Detail — they all read the same chosen documents.</p>
`},
  matrixPanel:{title:'Discipline Summary Matrix — Panel 2',body:`
<h4>What it shows</h4>
<p>Documents grouped by <em>UESH Discipline</em> (C), with a per-stage breakdown you can open row by row.</p>
<h4>Source data</h4>
<p>The active documents; columns used are <em>Stage</em> (B), <em>UESH Discipline</em> (C), <em>Planned 1st Issue Date</em> (S), <em>Forecast 1st Issue Date</em> (T), <em>Actual 1st Issue Date</em> (U), <em>Latest Approval Status</em> (Y), and the three overdue markers.</p>
<h4>How it is worked out</h4>
<ul>
<li>One row per discipline, ordered by number of planned documents (largest first). A bold <strong>TOTAL</strong> row at the bottom sums every column across all disciplines.</li>
<li>The columns are grouped under header bands — <strong>Total Submission</strong>, <strong>Submission — (month) (selected month)</strong>, <strong>Approval</strong>, and <strong>Overdue</strong>. The three "this month" submission columns are shaded light yellow to show they react to the Month selector.</li>
<li>Columns: <strong>Total Planned</strong> (all active documents in the discipline), <strong>Total Submitted</strong> shown as "count (percent)" — e.g. "95 (31%)" — where the percent is that discipline's submitted documents as a share of the project's <strong>Total Planned</strong> (all disciplines); and three "this month" submission counts — <strong>Plan (month)</strong> (documents whose <em>Planned 1st Issue Date</em> is in the chosen month), <strong>Forecast (month)</strong> (whose <em>Forecast 1st Issue Date</em>, or <em>Planned</em> if forecast is blank, is in the chosen month), and <strong>Actual (month)</strong> (whose <em>Actual 1st Issue Date</em> is in the chosen month) — then Approved (APP), Approved w/ Comments (AWC), Rejected (REJ), Not Approved (NAP), and three overdue counts (1st-sub, Resubmission, Client-review). All numbers are centre-aligned.</li>
<li><strong>Month selector</strong> (matrix tool row, left group inside the table card): chooses which month the three shaded "Plan / Forecast / Actual" columns count. It defaults to the as-of month (marked "(as-of)" in the list). The list is a <em>continuous</em> range from the <strong>earlier of the project start date (Code!B6) and the earliest planned/forecast/actual first-issue date in the data</strong> — so months before the declared project start are also reachable — through the as-of month, extended to the latest data month if it lies beyond as-of. Every month in the project's life is listed, including months with no submissions. Changing it only re-counts those three shaded columns — Total Planned, Total Submitted, the approval split, and the three overdue counts are all-time / as-of-today totals and do not change.</li>
<li>Click <strong>▸ stages</strong> to reveal that discipline's per-<em>Stage</em> (col B) breakdown with the same columns.</li>
<li><strong>▾ Expand all / ▸ Collapse all</strong> open or close every discipline's stages.</li>
<li><strong>⤓ PNG (full) / ⧉ Copy</strong> save or copy a picture of the fully expanded table for the current selection.</li>
</ul>
<p>Disciplines with no stage recorded show "—"; the overdue counts match Panel 5 and the KPI figures.</p>
`},
  chartsPanel:{title:'Interactive Chart',body:`
<h4>What it shows</h4>
<p>Interactive bar / pie charts counting documents (or data-quality issues) by a category you choose.</p>
<h4>Source data</h4>
<p>Documents charts use the active documents and columns <em>UESH Discipline</em> (C), <em>Stage</em> (B), <em>Authority</em> (Q), <em>Latest Approval Status</em> (Y), <em>Doc Type</em> (I). Issues charts use the validation issues (Panel 7) and their discipline.</p>
<h4>How it is worked out</h4>
<ul>
<li>Pick a category from the dropdown (Discipline, Stage, Authority, Approval, Doc Type, or a data-quality breakdown) — the chart shows how many documents fall in each value.</li>
<li>The <strong>Approval</strong> chart shows the full approval split, gated on <em>Actual 1st Issue Date</em> (col U): APP, AWC, REJ, NAP (only when submitted), plus <em>Submitted – Pending Review</em>, <em>Submitted – Status Unavailable</em>, <em>Not Submitted</em>, and <em>Record Error</em> (an approval status present without a submission date, or an unrecognized status code).</li>
<li>The <strong>Schedule Variance</strong> chart splits documents into On track, At risk, and the three Overdue groups.</li>
<li>Switch <strong>Bar / Pie</strong>; if a category has more than 12 values the chart stays a bar.</li>
<li><strong>⤓ PNG / ⧉ Copy</strong> export the chart shown.</li>
</ul>
<div class="def"><strong>At risk</strong> — a document not yet issued whose forecast or planned date is still ahead but no more than 14 working days away.</div>
`},
  curvePanel:{title:'Issue Progress (S-Curve & Monthly)',body:`
<h4>What it shows</h4>
<p>Issuance progress over time — a single chart combining the cumulative S-curve lines and the per-month bars on one shared count axis (no dual axis).</p>
<h4>Source data</h4>
<p><em>Planned 1st Issue Date</em> (S), <em>Forecast 1st Issue Date</em> (T), <em>Actual 1st Issue Date</em> (U) of the active documents.</p>
<p>The time axis always shows the <strong>whole month range</strong> covered by the actual document log — anchored at the <strong>earliest document date</strong> (the same anchor rule as the PPP dashboard's S-curve), through the latest document date (plus one extra month). When <strong>Code!B6</strong> lies outside that span it is still included so its <strong>Start</strong> marker can be drawn. Documents dated before the project start are <strong>never dropped</strong>; they simply plot to the left of the Start marker.</p>
<h4>How it is worked out</h4>
<ul>
<li><strong>S-Curve</strong> — for each month, a running total of documents with a Planned, Forecast (or Planned if forecast blank), or Actual date in that month or earlier.</li>
<li><strong>Monthly bar</strong> — the same three series counted only in the month they occur (not running totals).</li>
<li>The <strong>window slider</strong> (Period) selects which months are shown and <strong>scopes the S-curve data</strong>: the cumulative lines show progress <strong>within the selected window</strong> (anchored at the window start), while the monthly bars show per-month new counts. The red-dashed <strong>Start</strong> and grey-dashed <strong>Today</strong> reference lines stay fixed. The selected range appears at the end of the time bar row and the as-of date appears in the title bar, so the window is never confused with the current-date calculations (which stay anchored to the as-of date).</li>
<li>A red dashed <strong>vertical line</strong> marks <strong>Start</strong> (project start date, <strong>Code!B6</strong>); a grey dashed vertical line marks <strong>Today</strong> (the as-of system date). The project-start month is always included in the range. Both lines carry in-chart labels; no explanatory caption is printed under the chart.</li>
</ul>
<div class="def"><strong>Forecast fallback</strong> — when <em>Forecast 1st Issue Date</em> (T) is blank, <em>Planned 1st Issue Date</em> (S) is used in its place.</div>
<div class="def"><strong>Pre-project-start dates</strong> — a document whose Planned/Forecast/Actual date is earlier than Code!B6 is flagged as <strong>V-28</strong> in the Validation panel (Panel 6); it still appears on the curve to the left of the PS marker.</div>
`},
  overduePanel:{title:'Overdue List — Panel 5',body:`
<h4>What it shows</h4>
<p>Every overdue document in one table, with its dates and how late it is.</p>
<h4>Source data / columns (exact Code-sheet headers)</h4>
<p><em>Prolog Number</em> (V), <em>Document No.</em> (M), <em>Number</em> (K), <em>Document Title</em> (N), <em>UESH Discipline</em> (C), <em>Overdue Type</em> (derived), <em>Planned 1st Issue Date</em> (S), <em>Forecast 1st Issue Date</em> (T), <em>Actual 1st Issue Date</em> (U), <em>Latest Approval Date</em> (X), <em>Latest Approval Status</em> (Y), <em>Submission Status</em> (W), <em>Delay (days)</em> (derived).</p>
<h4>How a document becomes overdue</h4>
<ul>
<li><strong>1st-submission</strong>: forecast or planned first-issue date (T, or S if T blank) is on or before today, and <em>Actual 1st Issue Date</em> (U) is still empty.</li>
<li><strong>Resubmission</strong>: <em>Latest Approval Status</em> (Y) is REJ or RTR, and working days since <em>Latest Approval Date</em> (X) exceed the resubmission window defined in the Code sheet (commonly 14 working days).</li>
<li><strong>Client-review</strong>: <em>Submission Status</em> (W) is SUR, and working days since <em>Actual 1st Issue Date</em> (U) exceed the first client review window defined in the Code sheet (commonly 20 working days).</li>
</ul>
<h4>Delay (days)</h4>
<p>1st-submission = calendar days from today back to the forecast/planned date; Resubmission = working days since latest approval date minus the resubmission window; Client-review = working days since actual first issue date minus the first client review window.</p>
<h4>How it is grouped</h4>
<p>Rows are sorted by <em>Delay (days)</em> descending. The <strong>Overdue Type</strong> dropdown filters to one type. The top-bar <strong>Discipline</strong> / <strong>Stage</strong> filters narrow the whole list. Lists over 200 rows use Previous and Next. <strong>⤓ CSV</strong> downloads all filtered rows, not only the current page, with the same columns.</p>
<div class="def"><strong>Working days</strong> — Monday to Friday; Saturday and Sunday are not counted.</div>
`},
  validationRulesPanel:{title:'Validation Rules — Panel 6',body:`
<h4>What it shows</h4>
<p>One row for each fired validation rule. The row shows severity, code, group, the rule text and the number of issues.</p>
<h4>Source data</h4>
<p>Code-sheet Error block <code>Code!AI2:AL</code>: Error Code AI, Group AJ, Rule AK, Severity AL. The code sheet is the source of truth.</p>
`},
  validationIssuesPanel:{title:'Validation Issues — Panel 7',body:`
<h4>What it shows</h4>
<p>Data-quality problems found in the document list, with severity and the affected document.</p>
<h4>Source data</h4>
<p>Findings from checking every document row against the Code-sheet lookup tables — <em>Stage</em> (B), <em>UESH Discipline</em> (C), <em>Doc Type</em> (I), <em>Discipline (Code)</em> (J), <em>Authority</em> (Q), <em>Latest Approval Status</em> (Y), <em>Project Code</em> (G) — and the business rules in the <strong>Error Code block</strong> on the Code sheet (<code>Code!AI2:AL</code>: Error Code AI, Group AJ, Rule AK, Severity AL). That block holds the 28 rules V-01…V-28 (e.g., blank/missing document, invalid stage/discipline/doc-type/authority/approval/project code, document-number format mismatch, approval/date inconsistencies, future dates, duplicate document numbers, missing required fields, excluded-but-incomplete, and <strong>V-28</strong> — a Planned/Forecast/Actual 1st-issue date earlier than the project start date <code>Code!B6</code>).</p>
<p class="note" style="margin-top:6px"><strong>Routing:</strong> this panel shows <em>data-quality</em> details only. <em>System / processing</em> warnings (e.g. “List End Row exceeded”) and fatal errors appear in the <strong>top banner</strong> above the panels, never here.</p>
<h4>How it is worked out</h4>
<ul>
<li>Every data-quality issue for a document in the current global selection (top-bar Discipline / Stage) is shown.</li>
<li>Each row shows severity, rule code, the message, <em>Document No.</em> (M), <em>UESH Discipline</em> (C), and the source tab/row.</li>
<li>Lists over 200 rows use Previous, Next and a page jump. The <strong>Rule</strong> select filters this panel only.</li>
<li><strong>⤓ CSV</strong> downloads all filtered rows, not only the current page. The file name uses <code>&lt;project&gt;_issue_list_YYYY-MM-DD.csv</code>.</li>
</ul>
<div class="def"><strong>Severity</strong> — Error, Warning, or Info, taken from the Code sheet Error Code block.</div>
<div class="def"><strong>Decision D33</strong> — MDL owns blank-field validation. A blank MDL <em>Document No.</em> on a populated row is an MDL issue.</div>
`},
  detailPanel:{title:'Document Detail Table — Panel 8',body:`
<h4>What it shows</h4>
<p>The full document list for the current selection, one row per document, exactly as recorded.</p>
<h4>Source data</h4>
<p>The active documents, all columns A–Y of the Code-sheet document list plus the source tab and row.</p>
<h4>How it is used</h4>
<ul>
<li>Click any column header to sort by that column.</li>
<li>This table is the raw source behind every other panel (KPI, Matrix, Charts, Overdue, Validation all read these same rows).</li>
<li><strong>⤓ CSV</strong> downloads the chosen rows as <code>MDL_document_list.csv</code>.</li>
</ul>
`}
};
let helpModalEl=null;
function ensureHelpModal(){
  if(helpModalEl) return helpModalEl;
  const m=document.createElement('div'); m.className='help-modal'; m.hidden=true;
  m.innerHTML=`<div class="box" role="dialog" aria-modal="true" aria-labelledby="helpTitle"><header><h3 id="helpTitle"></h3><button class="close icon-btn" title="Close help" aria-label="Close help">✕</button></header><div class="body" id="helpBody"></div></div>`;
  m.addEventListener('click', e=>{ if(e.target===m) m.hidden=true; });
  m.querySelector('.close').onclick=()=>{ m.hidden=true; };
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && !m.hidden) m.hidden=true; });
  (document.body||document.documentElement).appendChild(m);
  helpModalEl=m; return m;
}
function openHelp(id){
  const h=HELP[id]; if(!h) return;
  const m=ensureHelpModal();
  m.querySelector('#helpTitle').textContent=h.title;
  m.querySelector('#helpBody').innerHTML=h.body;
  m.hidden=false;
}
function renderKPIs(panel, k, model){
  const asof = (model && model.meta && model.meta.today) || '';
  const cards = [
    {id:'totalPlanned',l:'Total Planned',v:k.totalPlanned,c:''},{id:'submitted',l:'Submitted',v:k.submitted,c:'ok'},
    {id:'approvedAPP',l:'Approved (APP)',v:k.approvedAPP,c:'ok'},{id:'approvedAWC',l:'Approved w/ Comments',v:k.approvedAWC,c:'amb'},
    {id:'rejected',l:'Rejected (REJ)',v:k.rejected,c:'warn'},{id:'notApproved',l:'Not Approved (NAP)',v:k.notApproved,c:''},
    {id:'pendingReview',l:'Pending Review',v:k.pendingReview,c:''},{id:'notSubmitted',l:'Not Submitted',v:k.notSubmitted,c:'muted'},
    {id:'recordError',l:'Record Error',v:k.recordError,c:'err'},
    {id:'overdueFirst',l:'Overdue – 1st Sub',v:k.overdueFirst,c:'warn'},{id:'overdueResubmission',l:'Overdue – Resub',v:k.overdueResubmission,c:'warn'},
    {id:'overdueClientReview',l:'Overdue – Client',v:k.overdueClientReview,c:'warn'}];
  const sub = [
    {id:'asBuiltYes',l:'As-Built Required (YES)',v:k.asBuiltYes},{id:'vendorYes',l:'Vendor Data (YES)',v:k.vendorYes},
    {id:'completeness',l:'Data Completeness',v:(k.completeness==null?'N/A':k.completeness+'%')},{id:'activeDisciplines',l:'Active Disciplines',v:k.activeDisciplines+' / '+(k.disciplineTotal||0)}];
  const card = (base,item) => `<div class="${base} kpi-card ${item.c||''}" data-kpi="${item.id}" data-tip="${esc(kpiTipHtml(item.l,asof,kpiSwatch(item.c)))}" tabindex="0" aria-describedby="kpiTip"><div class="v">${item.v}</div><div class="l">${esc(item.l)}</div></div>`;
  panel.innerHTML = `<div class="panel-head"><h2>KPI Overview</h2><div class="head-actions"><button class="collapse icon-btn" title="Collapse panel" aria-label="Collapse panel">−</button></div></div>
    <div class="panel-body"><div class="kpis">${cards.map(c=>card('kpi',c)).join('')}</div>
    <div class="subkpis">${sub.map(s=>card('subkpi',s)).join('')}</div>
    <div id="kpiTip" class="chart-tip kpi-tip" role="tooltip" aria-hidden="true"></div></div>`;
  wireCollapse(panel);
}

function wireFilterChips(model, state, rerender, dataOnly){
  const defs = getFilterDefs(model);
  const el = (pre, d) => document.getElementById(pre + d.key);   // 'tfBtn_' | 'tfPanel_' | 'tfCnt_'

  // (Filters & Utilities panel removed — Search + Reset now live in the sticky header; spec §4.7 / I-62)

  // Trigger badge (PPP wording): "All [dimension]" at the counted baseline, "N of M selected"
  // when partial, "None selected" when empty. .is-filtered accent whenever not "All".
  const sync = d => {
    const s = state[d.key], total = optsOf(d).length, n = s ? s.size : 0;
    const cnt = el('tfCnt_', d), btn = el('tfBtn_', d);
    let txt;
    if(isBaseSet(d, state)) txt = '';
    else if(n === 0) txt = ' (none)';
    else txt = ` (${n})`;
    if(cnt) cnt.textContent = txt;
    if(btn) btn.classList.toggle('is-filtered', !isBaseSet(d, state));
  };
  // Selection changes update state + the trigger badge immediately, but the (possibly heavy) data
  // re-render is deferred until the filter dropdown is closed — see spec §7.5. This keeps multi-select
  // filtering of large datasets smooth (no re-derive on every individual toggle).
  let filterDirty = false;
  const applyAll = () => { defs.forEach(sync); filterDirty = true; };

  // ---------- one dropdown per dimension (PPP: master "All" checkbox + dismiss hint) ----------
  defs.forEach(d => {
    const p = el('tfPanel_', d); if(!p) return;
    p.hidden = true;
    const allChk = isBaseSet(d, state);
    // I-115 — ordering: master "All <dimension>" → note → divider → item list.
    p.innerHTML = `<label class="tf-all"><input type="checkbox" id="tfAll_${d.key}" ${allChk?'checked':''}> <b>All ${esc(d.label)}</b></label>
      <div class="tf-hint">Changes apply when this list is closed.</div>
      <div class="tf-divider"></div>
      <div class="tf-list">${optsOf(d).map(v => { const off=(d.noCount||[]).includes(v); return `<label class="tf-item${off?' tf-nc':''}" title="${off?'Present in the list but never counted until you tick it':''}"><input type="checkbox" value="${esc(v)}" ${state[d.key].has(v) ? 'checked' : ''}><span>${esc(v === '' ? '（blank）' : v)}</span>${off?'<span class="nc">not counted</span>':''}</label>`; }).join('')}</div>`;
    const master = p.querySelector('#tfAll_' + d.key);
    const boxes = [...p.querySelectorAll('.tf-item input[type=checkbox]')];
    const applyBoxes = () => {
      const checked = boxes.filter(c => c.checked).map(c => c.value);
      if(checked.length === boxes.length){ state[d.key] = new Set(baseOpts(d)); master.checked = true; }
      else { state[d.key] = new Set(checked); master.checked = false; }
      applyAll();
    };
    boxes.forEach(cb => { cb.onchange = applyBoxes; });
    master.onchange = e => {
      if(e.target.checked){ state[d.key] = new Set(baseOpts(d)); boxes.forEach(c => c.checked = true); }
      else { state[d.key] = new Set(); boxes.forEach(c => c.checked = false); }
      applyAll();
    };
    sync(d);
  });

  // search + reset wiring now lives in renderDashboard (header control); see spec §4.7 / I-62

  // ---------- dropdown behaviour: only one open at a time ----------
  const closeAll = except => {
    let closedAny = false;
    defs.forEach(d => {
      if(d.key === except) return;
      const p = el('tfPanel_', d), b = el('tfBtn_', d);
      if(p && !p.hidden){ p.hidden = true; closedAny = true; }
      if(b) b.setAttribute('aria-expanded', 'false');
    });
    if(closedAny && filterDirty){ filterDirty = false; dataOnly(); }   // commit the deferred re-render once
  };
  if(!tfDocBound){
    tfDocBound = true;
    document.addEventListener('click', e => { if(!(e.target.closest && e.target.closest(POPOVER_WRAP))) closeAll(null); });
    document.addEventListener('keydown', e => { if(e.key === 'Escape') closeAll(null); });
  }
  defs.forEach(d => {
    const b = el('tfBtn_', d), p = el('tfPanel_', d);
    if(!b || !p) return;
    b.onclick = e => {
      e.stopPropagation();
      const wasOpen = !p.hidden;
      closeAll(d.key);                       // close any other open dropdown (commits its re-render)
      if(wasOpen){                           // closing this dropdown → commit the deferred re-render
        p.hidden = true;
        b.setAttribute('aria-expanded', 'false');
        if(filterDirty){ filterDirty = false; dataOnly(); }
      } else {
        p.hidden = false;
        b.setAttribute('aria-expanded', 'true');
      }
    };
  });
}

function matrixReportHTML(matrix){
  const ml = monthLabel(matrixCurMonth);
  const totalPlanned = matrix.reduce((a,m)=>a+(m.Planned||0),0) || 1;
  const subFmt = v => v + ' (' + Math.round((v/totalPlanned)*100) + '%)';
  const tint = ' class="col-tint"';
  const head = `<thead>`
    + `<tr class="group">`
    + `<th rowspan="2" scope="row">Discipline</th>`
    + `<th colspan="2" scope="colgroup">Total Submission</th>`
    + `<th colspan="3" scope="colgroup">Submission — ${ml} (selected month)</th>`
    + `<th colspan="4" scope="colgroup">Approval</th>`
    + `<th colspan="3" scope="colgroup">Overdue</th>`
    + `<th rowspan="2" aria-label="Expand stages"></th>`
    + `</tr>`
    + `<tr class="detail">`
    + `<th scope="col">Total Planned</th><th scope="col">Total Submitted</th>`
    + `<th scope="col">Plan</th><th scope="col">Forecast</th><th scope="col">Actual</th>`
    + `<th scope="col">APP</th><th scope="col">AWC</th><th scope="col">REJ</th><th scope="col">NAP</th>`
    + `<th scope="col">1st</th><th scope="col">Resub</th><th scope="col">Client</th>`
    + `</tr></thead>`;
  const body = matrix.map(m=>{
    const disc = `<tr><td>${esc(m.discipline)}</td><td>${m.Planned}</td><td>${subFmt(m.Submitted)}</td><td${tint}>${m.PlanMo}</td><td${tint}>${m.FcastMo}</td><td${tint}>${m.ActualMo}</td><td>${m.Approved}</td><td>${m.AWC}</td><td>${m.REJ}</td><td>${m.NAP}</td><td>${m.ov1}</td><td>${m.ov2}</td><td>${m.ov3}</td></tr>`;
    const subs = m.stages.map(s=>`<tr class="sub"><td class="subname">${esc(s.stage)}</td><td>${s.Planned}</td><td>${s.Submitted}</td><td${tint}>${s.PlanMo}</td><td${tint}>${s.FcastMo}</td><td${tint}>${s.ActualMo}</td><td>${s.Approved}</td><td>${s.AWC}</td><td>${s.REJ}</td><td>${s.NAP}</td><td>${s.ov1}</td><td>${s.ov2}</td><td>${s.ov3}</td></tr>`).join('');
    return disc + subs;
  }).join('');
  const tot = matrix.reduce((a,m)=>{ a.Planned+=m.Planned; a.Submitted+=m.Submitted; a.PlanMo+=m.PlanMo; a.FcastMo+=m.FcastMo; a.ActualMo+=m.ActualMo; a.Approved+=m.Approved; a.AWC+=m.AWC; a.REJ+=m.REJ; a.NAP+=m.NAP; a.ov1+=m.ov1; a.ov2+=m.ov2; a.ov3+=m.ov3; return a; }, {Planned:0,Submitted:0,PlanMo:0,FcastMo:0,ActualMo:0,Approved:0,AWC:0,REJ:0,NAP:0,ov1:0,ov2:0,ov3:0});
  const tfoot = `<tfoot><tr><td>TOTAL</td><td>${tot.Planned}</td><td>${subFmt(tot.Submitted)}</td><td${tint}>${tot.PlanMo}</td><td${tint}>${tot.FcastMo}</td><td${tint}>${tot.ActualMo}</td><td>${tot.Approved}</td><td>${tot.AWC}</td><td>${tot.REJ}</td><td>${tot.NAP}</td><td>${tot.ov1}</td><td>${tot.ov2}</td><td>${tot.ov3}</td><td></td></tr></tfoot>`;
  const tvar = (name, fallback) => { try { return getComputedStyle(document.body).getPropertyValue(name).trim() || fallback; } catch { return fallback; } };
  const cSurface = tvar('--surface','#fff'), cNavy = tvar('--navy','#0F2D52'), cLine = tvar('--line','#d8e0ea');
  const cZebra = tvar('--ds-zebra','#F9FBFD'), cBg = tvar('--bg','#F6F8FA'), cSub = tvar('--ds-sub-bg','#F2F6FB'), cMuted = tvar('--muted','#6b7785');
  const css = `.matrix{width:100%;border-collapse:collapse;font-size:12px;background:${cSurface}}
    .matrix th,.matrix td{border-bottom:1px solid ${cLine};padding:4px 8px;text-align:center;white-space:nowrap}
    .ds-table thead th{background:${cNavy};color:#fff;font-weight:600}
    .matrix th:first-child,.matrix td:first-child{text-align:left}
    .matrix thead tr.group th{background:${cNavy};color:#fff;font-weight:700}
    .matrix thead tr.group th.tint{background:#FFF9C4;color:#7a5b12}
    .matrix th.tint{background:#FFF9C4;color:#7a5b12}
    .matrix td.col-tint{background:#FFF9C4}
    .matrix tfoot td{background:${cBg};font-weight:700;border-top:2px solid ${cNavy}}
    .matrix tbody tr:nth-child(even){background:${cZebra}}
    .matrix tbody tr.sub{background:${cSub}}
    .matrix tbody tr.sub td.subname{text-align:left;padding-left:22px;color:${cMuted};font-style:italic}`;
  return `<div xmlns="http://www.w3.org/1999/xhtml"><style>${css}</style><table class="matrix ds-table"><caption class="sr-only">Discipline Summary Matrix — document counts by discipline per month, with a TOTAL row.</caption><colgroup><col style="width:150px"><col style="width:96px"><col style="width:116px"><col style="width:140px"><col style="width:140px"><col style="width:140px"><col style="width:64px"><col style="width:64px"><col style="width:64px"><col style="width:64px"><col style="width:64px"><col style="width:64px"><col style="width:70px"><col style="width:60px"></colgroup>${head}<tbody>${body}</tbody>${tfoot}</table></div>`;
}
function matrixSVG(matrix){
  const totalStages = matrix.reduce((a,m)=>a + m.stages.length, 0);
  const totalRows = 3 + matrix.length + totalStages;   // group + detail + discipline rows + sub rows + TOTAL
  const W = 1080, H = totalRows*24 + 24;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}"><foreignObject x="0" y="0" width="${W}" height="${H}">${matrixReportHTML(matrix)}</foreignObject></svg>`;
}
function matrixCSV(matrix, curMonth){
  const cell = v => { const t = v==null?'' : String(v); return /[",\n\r]/.test(t) ? '"'+t.replace(/"/g,'""')+'"' : t; };
  const totalPlanned = matrix.reduce((a,m)=>a+(m.Planned||0),0) || 1;
  const pct = v => Math.round((v/totalPlanned)*100);
  const mLabel = curMonth || 'all';
  const cols = ['Discipline','Total Planned','Total Submitted','Submitted %','Plan ('+mLabel+')','Forecast ('+mLabel+')','Actual ('+mLabel+')','APP','AWC','REJ','NAP','Overdue 1st','Overdue Resub','Overdue Client'];
  const out = [cols.map(cell).join(',')];
  matrix.forEach(m=>{
    out.push([m.discipline, m.Planned, m.Submitted, pct(m.Submitted), m.PlanMo, m.FcastMo, m.ActualMo, m.Approved, m.AWC, m.REJ, m.NAP, m.ov1, m.ov2, m.ov3].map(cell).join(','));
    (m.stages||[]).forEach(s=> out.push(['  '+s.stage, s.Planned, s.Submitted, pct(s.Submitted), s.PlanMo, s.FcastMo, s.ActualMo, s.Approved, s.AWC, s.REJ, s.NAP, s.ov1, s.ov2, s.ov3].map(cell).join(',')));
  });
  const t = matrix.reduce((a,m)=>{ ['Planned','Submitted','PlanMo','FcastMo','ActualMo','Approved','AWC','REJ','NAP','ov1','ov2','ov3'].forEach(k=>a[k]+=(m[k]||0)); return a; }, {Planned:0,Submitted:0,PlanMo:0,FcastMo:0,ActualMo:0,Approved:0,AWC:0,REJ:0,NAP:0,ov1:0,ov2:0,ov3:0});
  out.push(['TOTAL', t.Planned, t.Submitted, pct(t.Submitted), t.PlanMo, t.FcastMo, t.ActualMo, t.Approved, t.AWC, t.REJ, t.NAP, t.ov1, t.ov2, t.ov3].map(cell).join(','));
  return out.join('\r\n');
}
// ---------- table-kit: L2 sorting (I-92) ----------
// Type-aware comparator core. Empty / null / NaN always sort LAST (RC-6). dir = +1 asc, -1 desc.
function dsCmp(a, b, type, order){
  // Empty always sorts LAST (RC-6). The em/en dash is this dashboard's universal
  // "no value" placeholder (a blank discipline renders as '—', a blank issue Field as
  // '—'), so it is empty for sorting too — otherwise the blank row jumps to the top of
  // an ascending sort in one table while it sinks to the bottom in another.
  const empty = v => {
    if(v==null) return true;
    if(typeof v==='number') return isNaN(v);
    const s=String(v).trim();
    return s==='' || s==='—' || s==='–';
  };
  const ea=empty(a), eb=empty(b);
  if(ea&&eb) return 0; if(ea) return 1; if(eb) return -1;
  let r;
  if(type==='num') r=(+a)-(+b);
  else if(type==='date'){ const x=Date.parse(a), y=Date.parse(b); r=(!isNaN(x)&&!isNaN(y))?x-y:String(a).localeCompare(String(b),'en',{numeric:true,sensitivity:'base'}); }
  else if(type==='enum' && Array.isArray(order)){ const ai=order.indexOf(a), bi=order.indexOf(b); r=(ai<0?order.length:ai)-(bi<0?order.length:bi); }
  else r=String(a).localeCompare(String(b),'en',{numeric:true,sensitivity:'base'});
  return r;
}
// sort a COPY, stable (ties keep original order). get(r,key) returns the cell value.
function dsSorted(rows, cols, active, get){
  if(!active || !active.col) return rows;
  const col = cols.find(c=>c.key===active.col); if(!col) return rows;
  const base = rows.map((r,i)=>({r,i}));
  base.sort((A,B)=>{
    let v = dsCmp(get(A.r,active.col), get(B.r,active.col), col.type, col.order);
    if(v!==0) return v*active.dir;
    return A.i-B.i;
  });
  return base.map(o=>o.r);
}
// alignment follows the column type in the model, not the DOM position (spec §18)
const alignClassOf = c => (c.type === 'num' || c.type === 'date') ? 'num' : (c.type === 'enum' ? 'enum' : '');
const cellClasses = (c, extra) => [...new Set([c.cls, alignClassOf(c), extra].filter(Boolean))].join(' ');
// build <thead> cells from cols + active sort state (button + aria-sort + indicator)
function sortHeadCells(cols, active){
  return cols.map(c=>{
    // carry the column's alignment class onto the header, so the header aligns with
    // the body cells of the same column.
    const clsName = cellClasses(c);
    const cls = clsName ? ` class="${clsName}"` : '';
    if(!c.sortable) return `<th scope="col"${cls}>${esc(c.label)}</th>`;
    const dir = (active && active.col===c.key) ? active.dir : 0;
    const aria = dir===0 ? 'none' : dir===1 ? 'ascending' : 'descending';
    const ind = dir===0 ? '⇅' : dir===1 ? '▲' : '▼';
    return `<th scope="col" aria-sort="${aria}"${cls}><button type="button" class="sort-btn" data-col="${esc(c.key)}"><span class="sort-lbl">${esc(c.label)}</span><span class="sort-ind" aria-hidden="true">${ind}</span></button></th>`;
  }).join('');
}
// wire a delegated click handler on scrollEl so dynamically-replaced headers (renderHead)
// keep working. onSort re-renders the body; renderHead (optional) returns fresh <thead>
// innerHTML so aria-sort/indicators refresh.
function wireSort(scrollEl, cols, active, onSort, key, renderHead){
  const refresh = ()=>{ if(renderHead){ const th=scrollEl.querySelector('thead'); if(th) th.innerHTML=renderHead(); } };
  scrollEl.addEventListener('click', (e)=>{
    const btn = e.target.closest('.sort-btn');
    if(!btn) return;
    const col = btn.dataset.col;
    let dir = (active.col===col) ? active.dir : 0;
    dir = dir===0 ? 1 : (dir===1 ? -1 : 1);   // none→asc→desc→asc (two-state indicator, §7.2.6)
    active.col = col; active.dir = dir;
    if(key) setPref(key, dir+'|'+col);
    refresh(); onSort(active);
  });
}

// ---------- table-kit: L2 column filtering (I-93) ----------
// The filter state for one table is an object keyed by column key:
//   { '<colKey>': { kind:'text'|'enum'|'num'|'date', value:<per kind> } }
// where `value` is:
//   text  -> string (case-insensitive contains; '' means no filter)
//   enum  -> Set of selected values (filter keeps rows whose value is in the Set; the
//            whole row is kept when the Set is empty AND the column key is absent)
//   num   -> { min:'', max:'' } (any blank bound means unconstrained on that side)
//   date  -> { min:'', max:'' } (ISO date strings; same semantics as num)

// ONE delegated listener pair serves ALL popovers (the column-visibility chooser). Binding a
// document listener per popover would strand listeners across re-renders, so only OPEN popovers
// are tracked and entries whose panel was replaced by a later render are pruned via isConnected.
// Every popover trigger wrapper: the global filter chips (`.tf-wrap`) and the I-114 column-visibility
// chooser (`.cc-wrap`). Both must be recognised by the click-outside / Esc delegation below.
const POPOVER_WRAP = '.tf-wrap,.cc-wrap';
const CF_OPEN = new Set();
let cfBound = false;
function cfBindDoc(){
  if(cfBound) return; cfBound = true;
  document.addEventListener('click', e => {
    CF_OPEN.forEach(o => {
      if(!o.pop.isConnected){ CF_OPEN.delete(o); return; }          // stale: panel re-rendered
      if(e.target.closest && e.target.closest(POPOVER_WRAP) === o.wrap) return;
      o.pop.hidden = true; o.btn.setAttribute('aria-expanded','false'); CF_OPEN.delete(o);
    });
  });
  document.addEventListener('keydown', e => {
    if(e.key !== 'Escape') return;
    CF_OPEN.forEach(o => { o.pop.hidden = true; o.btn.setAttribute('aria-expanded','false'); });
    CF_OPEN.clear();
  });
}
function cfToggle(o){
  if(!o.pop.hidden){ o.pop.hidden = true; o.btn.setAttribute('aria-expanded','false'); CF_OPEN.delete(o); return; }
  o.build();                    // rows (and the facet scan) are built on FIRST OPEN, not per render
  o.pop.hidden = false; o.btn.setAttribute('aria-expanded','true'); CF_OPEN.add(o);
}
// ---------- windowed rendering (I-96, spec §7.2.8) ----------
// Renders only the visible window plus `overscan` rows, with spacer rows above and
// below so the scrollbar still represents the FULL list. The control row keeps
// reporting the full count (§4.3 contract); sorting, filtering, search and export
// keep reading the full array — windowing is a rendering detail and never enters
// the data layer.
const WINDOW_THRESHOLD = 500;          // D39: windowing engages above 500 rows
function makeWindow(scrollEl, opts){
  const tbody = scrollEl && scrollEl.querySelector('tbody');
  const total = opts.total;
  if(!tbody || total() <= WINDOW_THRESHOLD) return { enabled:false, redraw:()=>{} };
  let rowH = opts.rowHeight || 40, first = -1, last = -1, raf = 0;
  const pad = n => Math.max(0, Math.round(n));
  const paint = () => {
    raf = 0;
    // an unmeasurable scroller (e.g. a hidden panel or a non-layout environment)
    // cannot compute a window: fall back to the full body so nothing is lost
    if(!scrollEl.clientHeight){ tbody.innerHTML = opts.full(); first = -1; last = -1; return; }
    const n = total();
    const start = Math.max(0, Math.floor(scrollEl.scrollTop / rowH) - opts.overscan);
    const end   = Math.min(n, Math.ceil((scrollEl.scrollTop + scrollEl.clientHeight) / rowH) + opts.overscan);
    if(start === first && end === last) return;
    first = start; last = end;
    // measure the real row height once from a rendered row, then trust it
    const real = tbody.querySelector('tr:not(.win-pad)');
    if(real){ const h = real.getBoundingClientRect().height; if(h > 0) rowH = h; }
    tbody.innerHTML =
      `<tr class="win-pad" aria-hidden="true"><td colspan="999" style="height:${pad(start*rowH)}px"></td></tr>`
      + opts.render(start, end)
      + `<tr class="win-pad" aria-hidden="true"><td colspan="999" style="height:${pad((n-end)*rowH)}px"></td></tr>`;
  };
  const schedule = () => { if(!raf) raf = requestAnimationFrame(paint); };
  scrollEl.addEventListener('scroll', schedule, { passive:true });
  if(typeof ResizeObserver === 'function') new ResizeObserver(schedule).observe(scrollEl);
  // print release: the windowed body would print ~60 rows, so print the full list
  const full = () => { if(raf) cancelAnimationFrame(raf); raf = 0; tbody.innerHTML = opts.full(); first = -1; last = -1; };
  window.addEventListener('beforeprint', full);
  window.addEventListener('afterprint', () => { first = -1; last = -1; paint(); });
  paint();
  return { enabled:true, redraw: () => { first = -1; last = -1; paint(); } };
}

// ---------- L3 grid kit (I-95): pinned columns, column chooser, column resize ----------
// One grid object per table. It owns the VISIBLE column list (pinned columns first,
// then the rest in model order), the persisted widths, and the three capabilities of
// spec §7.2.5. The renderer keeps producing the cell contents; the grid only decides
// which columns exist, in what order, how wide they are and which are pinned — so
// <colgroup>, header and body can never disagree (the RC-1…RC-8 defect family).
const GRID_DEF = {
  detail: {
    pinned: ['__src', 'Document No.'],
    core:   ['__src', 'Document No.', '__active', 'UESH Discipline', 'Stage',
             'Planned 1st Issue Date', 'Submission Status', 'Latest Approval Status'],
    widths: { '__src':120, '__active':70, 'Document No.':150 },
    max: 640
  },
  validation_rules: {
    pinned: [],
    core:   ['severity', 'code', 'group', 'description', 'count'],
    widths: { severity:110, code:90, group:130, description:420, count:70 },
    max: 640
  },
  issue: {
    pinned: ['severity', 'code'],
    core:   ['severity', 'code', 'docNo', 'field', 'value', 'message', 'sourceTab', 'rownum'],
    widths: { severity:70, code:90, docNo:110, field:120, value:130, message:360, sourceTab:110, rownum:60 },
    max: 640
  },
  overdue: {
    pinned: [],   // no pinned columns — keeps the current left-to-right order
    core:   ['Prolog Number','Document No.','Document Title','Number','UESH Discipline','Overdue Type',
             'Planned 1st Issue Date','Forecast 1st Issue Date','Actual 1st Issue Date',
             'Latest Approval Date','Latest Approval Status','Submission Status','Delay (days)'],
    widths: { 'Prolog Number':110, 'Document No.':180, 'Document Title':420, 'Number':70, 'UESH Discipline':130,
              'Overdue Type':90, 'Planned 1st Issue Date':140, 'Forecast 1st Issue Date':140, 'Actual 1st Issue Date':140,
              'Latest Approval Date':140, 'Latest Approval Status':150, 'Submission Status':140, 'Delay (days)':80 },
    max: 640
  }
};
function makeGrid(key, cols){
  const def = GRID_DEF[key] || {};
  const known = new Set(cols.map(c => c.key));
  const pinned = (def.pinned || []).filter(k => known.has(k));
  const core   = (def.core || cols.map(c => c.key)).filter(k => known.has(k));
  const defW   = def.widths || {};
  let widths = {};
  try { widths = JSON.parse(getPref(key + '_widths', '') || '{}') || {}; } catch(e) { widths = {}; }
  Object.keys(widths).forEach(k => { if(!known.has(k)) delete widths[k]; });
  // true once the user has resized anything: a deliberate width choice is respected and never
  // auto-shrunk (see grid.fit below — the fit pass is for the shipped defaults, not the user's).
  // I-163: this is live state, not a one-shot snapshot, so a drag that persists a width is honoured.
  let custom = Object.keys(widths).length > 0;
  let others = [];
  const raw = getPref(key + '_cols', '');
  others = raw ? raw.split(',').filter(k => known.has(k) && !pinned.includes(k)) : core.filter(k => !pinned.includes(k));
  const widthOf = k => (widths[k] != null ? widths[k] : (defW[k] != null ? defW[k] : 130));
  // I-163 — the minimum width is content-aware: the rendered header label must stay visible, and the
  // resize handle may never go below the column's type floor. Explicit per-column `min` still wins
  // when the owner wants a wider floor (Overdue uses 180/420 for long document values).
  const typeFloorOf = c => {
    switch (c && c.type) {
      case 'enum': case 'boolean': case 'severity': return 64;
      case 'date': return 110;
      case 'identifier': return 120;
      case 'checkbox': return 28;
      case 'text': return 90;
      default: return 64;
    }
  };
  const labelMinCache = new Map();
  const measureLabelWidth = text => {
    if (labelMinCache.has(text)) return labelMinCache.get(text);
    let w = 0;
    try {
      const span = document.createElement('span');
      span.style.cssText = 'position:absolute;left:-9999px;top:0;visibility:hidden;white-space:nowrap;font-size:12px;font-weight:600;line-height:1.2';
      span.textContent = text || '';
      document.body.appendChild(span);
      w = span.getBoundingClientRect().width;
      span.remove();
    } catch(e) { w = 0; }
    if (!(w > 0)) {
      try {
        const ctx = document.createElement('canvas').getContext('2d');
        if (ctx) { ctx.font = '600 12px system-ui, sans-serif'; w = ctx.measureText(text || '').width; }
      } catch(e) { w = 0; }
    }
    if (!(w > 0)) w = (text || '').length * 6.8;   // jsdom / no-layout fallback
    labelMinCache.set(text, w);
    return w;
  };
  const minOf = k => {
    const c = cols.find(x => x.key === k);
    if (!c) return 60;
    // 20px cell padding + a small gutter allowance; sortable headers also reserve the glyph.
    const glyph = c.sortable ? 18 : 0;
    return Math.max(c.min || 0, typeFloorOf(c), Math.ceil(measureLabelWidth(c.label) + 22 + glyph));
  };
  const visible = () => pinned.map(k => cols.find(c => c.key === k))
    .concat(cols.filter(c => others.includes(c.key)));
  // sticky offset = the summed width of every preceding visible column, so the pinned
  // block stays glued to the left edge whatever the user has resized (I-95 §7.2.13)
  const leftOf = k => { let left = 0; for (const c of visible()) { if (c.key === k) return left; left += widthOf(c.key); } return left; };
  const colEls = table => [...table.querySelectorAll('colgroup col')];
  // keep every pinned cell's `left` in sync with the real column widths
  const applyOffsets = table => {
    let left = 0;
    visible().forEach(c => {
      const w = widthOf(c.key);
      table.querySelectorAll(`th.ds-pinned[data-col="${c.key}"],td.ds-pinned[data-col="${c.key}"]`)
        .forEach(el => { el.style.left = left + 'px'; });
      left += w;
    });
  };
  const grid = {
    key, pinned, cols,
    visible,
    widthOf,
    colgroupHTML: () => `<colgroup>${visible().map(c => `<col style="width:${widthOf(c.key)}px">`).join('')}</colgroup>`,
    // a header cell for one visible column: pinned class + sort button + resize grip
    th: (c, active) => {
      const pin = pinned.includes(c.key) ? 'ds-pinned' : '';
      const edge = (pinned.length && pinned[pinned.length - 1] === c.key) ? 'ds-pinned-edge' : '';
      const off = pin ? ` style="left:${leftOf(c.key)}px"` : '';
      const cls = cellClasses(c);
      const inner = c.sortable ? sortHeadCells([c], active)
        : `<th scope="col"${cls ? ` class="${cls}"` : ''}>${esc(c.label)}</th>`;
      // splice data-col on, then MERGE the pinned/edge classes into the CELL's own class. Never emit a
      // second class attribute (the browser honours only the first). Operate on the <th> OPENING TAG
      // only: a sortable cell also contains a <button class="sort-btn">, and a naive first-match would
      // merge into the button and leave the cell itself unpinned.
      let out = inner.replace(/^<th /, `<th data-col="${esc(c.key)}"${off} `);
      const extra = [pin, edge].filter(Boolean).join(' ');
      if (extra) {
        const gt = out.indexOf('>');
        const open = out.slice(0, gt), rest = out.slice(gt);
        out = (/class="[^"]*"/.test(open)
          ? open.replace(/class="([^"]*)"/, (m, cur) => `class="${(cur + ' ' + extra).trim()}"`)
          : open.replace(/^<th /, `<th class="${extra}" `)) + rest;
      }
      return out;
    },
    headRow: active => `<tr>${visible().map(c => grid.th(c, active)).join('')}</tr>`,
    // a body cell for one visible column
    td: (c, inner, extra) => {
      const pin = pinned.includes(c.key) ? ' ds-pinned' : '';
      const edge = (pinned.length && pinned[pinned.length - 1] === c.key) ? ' ds-pinned-edge' : '';
      const off = pin ? ` style="left:${leftOf(c.key)}px"` : '';
      const cls = cellClasses(c, [pin.trim(), edge.trim(), extra].filter(Boolean).join(' '));
      return `<td data-col="${esc(c.key)}"${cls ? ` class="${cls}"` : ''}${off}>${inner}</td>`;
    },
    setWidth(k, px, persist) {
      widths[k] = Math.max(minOf(k), Math.min(def.max || 640, Math.round(px)));
      // I-163 — a persisted user width is a deliberate choice. The next container-change fit pass
      // must not shrink it back to the shipped defaults.
      if(persist){ custom = true; setPref(key + '_widths', JSON.stringify(widths)); }
    },
    // §7.2.15 invariant 5 (clarified 2026-10-21, MDL I-116) — the table MUST fit the display area
    // whenever fitting is achievable, because a default wider than the display area is a
    // non-conformant width choice, not an unavoidable constraint. Fitting is ACHIEVABLE when the sum
    // of the columns' minimum widths is <= the available width; when it is not, horizontal scrolling
    // is genuinely unavoidable and the caller leaves the scrollbar (and proves lock-step instead).
    // Shrink proportionally to each column's slack above its floor, so a wide column gives up more
    // than a narrow one. Never persisted: a fit is a property of the CURRENT viewport, not a width
    // choice, and re-deriving it each render is what makes it correct across viewport changes.
    fit(available) {
      const cols = visible();
      if(!cols.length || !(available > 0) || custom) return false;
      const max = def.max || 640;
      const total = cols.reduce((a, c) => a + widthOf(c.key), 0);
      if(total === available) return false;                                 // already exact
      if(total < available) {
        // I-163 — scale up to fill the display area. The table must not leave an unused white band
        // when fitting is achievable; this is the MDL §18 grow-to-fill branch.
        let sum = 0;
        cols.forEach(c => {
          const w = Math.min(max, Math.max(minOf(c.key),
            Math.floor(widthOf(c.key) * available / total)));
          widths[c.key] = w; sum += w;
        });
        // absorb rounding loss on the widest column that still has room, then on any column below max
        let left = available - sum;
        for (let i = 0; left > 0 && i < cols.length * 2; i++) {
          const c = cols[i % cols.length];
          if (widths[c.key] < max) { widths[c.key]++; left--; }
        }
        return true;
      }
      const floor = cols.reduce((a, c) => a + Math.min(widthOf(c.key), minOf(c.key)), 0);
      if(floor >= available) return false;                                  // unavoidable — scrollbar
      const over = total - available;
      const slack = cols.reduce((a, c) => a + Math.max(0, widthOf(c.key) - minOf(c.key)), 0);
      if(!slack) return false;
      cols.forEach(c => {
        const w = widthOf(c.key), min = minOf(c.key);
        widths[c.key] = Math.min(max, Math.max(min,
          Math.round(w - over * (Math.max(0, w - min) / slack))));
      });
      return true;                                                          // caller must repaint
    },
    resetWidths() {
      widths = {};
      custom = false;
      setPref(key + '_widths', '{}');
    },
    hiddenCount: () => cols.length - visible().length,
    refresh: null      // set by the renderer: rebuild colgroup + head + body
  };
  // --- column chooser: a LAYOUT control with its own classes (§7.10 B7, I-114) ---
  grid.chooser = host => {
    // §7.10 B7 (I-114) — its OWN classes: a column-visibility control must never wear the
    // filter-trigger look, so it carries no count badge and no active-filter emphasis.
    const wrap = document.createElement('div'); wrap.className = 'cc-wrap';
    const btn = document.createElement('button'); btn.className = 'cc-btn'; btn.id = 'ccBtn_' + key;
    btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-controls', 'ccPanel_' + key);
    const label = () => { const n = grid.hiddenCount();
      btn.textContent = `Columns (${cols.length - n} of ${cols.length}) ▾`; };
    label(); wrap.appendChild(btn);
    const pop = document.createElement('div'); pop.className = 'cc-panel'; pop.id = 'ccPanel_' + key;
    pop.setAttribute('role', 'group'); pop.setAttribute('aria-label', 'Choose the columns to show'); pop.hidden = true;
    let built = false;
    // I-115 — the chooser adopts the same internal ordering as .tf-panel: master → note →
    // divider → items → footer. The master ranges over the NON-PINNED columns only: pinned
    // identity columns are permanently checked and disabled (see the row builder below), so
    // a master over the full set could never read as checked. Tri-state: checked = every
    // non-pinned column shown, indeterminate = some hidden, unchecked = all hidden.
    const freeCols = () => cols.filter(c => !pinned.includes(c.key));
    const boxEls = () => [...pop.querySelectorAll('.cc-row input')];
    let mcb = null, footCnt = null;
    const syncMaster = () => {
      const f = freeCols(), on = f.filter(c => others.includes(c.key)).length;
      if(mcb){ mcb.checked = !!f.length && on === f.length; mcb.indeterminate = on > 0 && on < f.length; }
      if(footCnt) footCnt.textContent = `${grid.hiddenCount()} hidden`;
    };
    const build = () => { if(built) return; built = true;
      const head = document.createElement('div'); head.className = 'cc-all';
      mcb = document.createElement('input'); mcb.type = 'checkbox'; mcb.id = 'ccAll_' + key;
      const mlbl = document.createElement('label'); mlbl.className = 'cc-lbl'; mlbl.htmlFor = mcb.id;
      const mtxt = document.createElement('b'); mtxt.textContent = 'All columns';
      mlbl.appendChild(mtxt);
      head.appendChild(mcb); head.appendChild(mlbl);
      pop.appendChild(head);
      // note: only meaningful where identity columns are pinned/locked
      if(pinned.length){
        const note = document.createElement('div'); note.className = 'cc-note';
        note.textContent = 'Pinned columns are always shown.';
        pop.appendChild(note);
      }
      const div = document.createElement('div'); div.className = 'cc-divider';
      pop.appendChild(div);
      mcb.addEventListener('change', () => {
        others = mcb.checked ? freeCols().map(c => c.key) : [];
        setPref(key + '_cols', others.join(','));
        boxEls().forEach(b => { if(!b.disabled) b.checked = mcb.checked; });
        syncMaster(); label(); if(grid.refresh) grid.refresh();
      });
      cols.forEach(c => {
        const row = document.createElement('div'); row.className = 'cc-row';
        const cb = document.createElement('input'); cb.type = 'checkbox'; cb.id = 'cc_' + key + '_' + c.key;
        cb.checked = visible().some(v => v.key === c.key);
        if(pinned.includes(c.key)) { cb.disabled = true; cb.title = 'Always shown — an identity column'; }
        cb.addEventListener('change', () => {
          if(pinned.includes(c.key)) return;
          if(cb.checked) { if(!others.includes(c.key)) others.push(c.key); }
          else others = others.filter(k => k !== c.key);
          setPref(key + '_cols', others.join(','));
          syncMaster(); label(); if(grid.refresh) grid.refresh();
        });
        const lbl = document.createElement('label'); lbl.className = 'cc-lbl'; lbl.htmlFor = cb.id; lbl.textContent = c.label;
        row.appendChild(cb); row.appendChild(lbl);
        if(pinned.includes(c.key)) { const p = document.createElement('span'); p.className = 'cc-pin'; p.textContent = 'pinned'; row.appendChild(p); }
        pop.appendChild(row);
      });
      const foot = document.createElement('div'); foot.className = 'cf-foot';
      foot.innerHTML = `<span class="cf-cnt">${grid.hiddenCount()} hidden</span><button type="button">Reset to defaults</button>`;
      footCnt = foot.querySelector('.cf-cnt');
      foot.querySelector('button').onclick = () => {
        others = core.filter(k => !pinned.includes(k));
        setPref(key + '_cols', others.join(','));
        boxEls().forEach(i => { i.checked = i.disabled || others.includes(i.id.replace('cc_' + key + '_', '')); });
        syncMaster(); label(); if(grid.refresh) grid.refresh();
      };
      pop.appendChild(foot);
      syncMaster();
    };
    wrap.appendChild(pop);
    host.insertBefore(wrap, host.firstChild);
    btn.onclick = e => { e.stopPropagation(); cfToggle({ wrap, btn, pop, build }); };
  };
  // --- column resize: 6 px grip per header, pointer drag, double-click auto-fit ---
  // MDL I-116 — with a split header the header cells live in their own table, so the two halves must
  // be resized as one: the grip is attached to (and clicked in) the header table, while the resulting
  // width is written to BOTH colgroups and the sticky offsets are re-applied to BOTH halves. A table
  // with its thead inside the scroller passes no headTable and behaves exactly as before.
  grid.resizer = (table, headTable) => {
    const host = headTable || table;                        // where the header cells and grips live
    const halves = headTable ? [host, table] : [table];     // every colgroup / pinned set to update
    const colAt = i => halves.map(t => colEls(t)[i]).filter(Boolean);
    const grips = () => [...host.querySelectorAll('.ds-resize')];
    // add the grip to every header cell (idempotent — the header is rebuilt on sort)
    const addGrips = () => visible().forEach((c, i) => {
      const th = host.querySelectorAll('thead th')[i]; if(!th || th.querySelector('.ds-resize')) return;
      const g = document.createElement('span'); g.className = 'ds-resize'; g.dataset.col = c.key;
      g.title = 'Drag to resize · double-click to fit';
      th.appendChild(g);
    });
    addGrips();
    // one write, both halves — a width that reaches only one colgroup is a visible misalignment
    const setWidth = (k, w) => {
      colAt(visible().findIndex(c => c.key === k)).forEach(col => { col.style.width = w + 'px'; });
      halves.forEach(applyOffsets);
    };
    host.addEventListener('pointerdown', e => {
      const g = e.target.closest && e.target.closest('.ds-resize'); if(!g) return;
      e.preventDefault();
      const k = g.dataset.col;
      const idx = visible().findIndex(c => c.key === k);
      const col = colEls(host)[idx]; if(!col) return;
      const startW = col.getBoundingClientRect().width || grid.widthOf(k);
      const startX = e.clientX;
      g.classList.add('active');
      const move = ev => {
        const w = startW + (ev.clientX - startX);
        grid.setWidth(k, w, false);
        setWidth(k, grid.widthOf(k));
      };
      const up = ev => {
        const w = startW + (ev.clientX - startX);
        grid.setWidth(k, w, true);
        setWidth(k, grid.widthOf(k));
        g.classList.remove('active');
        document.removeEventListener('pointermove', move);
        document.removeEventListener('pointerup', up);
      };
      document.addEventListener('pointermove', move);
      document.addEventListener('pointerup', up);
    });
    host.addEventListener('dblclick', e => {
      const g = e.target.closest && e.target.closest('.ds-resize'); if(!g) return;
      const k = g.dataset.col;
      const idx = visible().findIndex(c => c.key === k);
      const col = colEls(host)[idx]; if(!col) return;
      // auto-fit measures the widest real cell: body values AND the header label, in both halves
      const cells = halves.reduce((a, t) => a.concat(
        [...t.querySelectorAll(`tbody td[data-col="${k}"],thead th[data-col="${k}"]`)]), []);
      const w = Math.max(minOf(k), Math.min((def.max || 640),
        ...cells.map(c => Math.ceil(c.scrollWidth) + 20)));
      grid.setWidth(k, w, true);
      setWidth(k, w);
    });
    return { addGrips };
  };
  return grid;
}

// §18 split-header contract — ONE shared implementation for every split-header table (the Rule
// Reference and the Discipline Summary Matrix). The header fragment lives OUTSIDE the scroller, so
// script must hold the pair in lock-step:
//   * width = the body table's rendered width + the vertical scrollbar, so the navy runs the full card
//     width while the DATA columns match the body exactly (sizing to the scroller instead leaves the
//     header narrower than an overflowing body, and sizing to clientWidth leaves a white notch);
//   * --ds-sbw = the scrollbar width, reserved by the fragment's trailing gutter column;
//   * the fragment sits in a clipped scrollport (.vheadwrap) whose scrollLeft is set to the body
//     scroller's. MDL I-116 option (i): chosen over translateX(-scrollLeft) because a pinned header
//     cell can then stay put with position:sticky, exactly as the pinned body cell below it does —
//     ONE mechanism in both halves, so they cannot disagree. Both scrollports are the same width, so
//     the scrollable overflow, and therefore every column boundary, matches at any offset;
//   * ResizeObserver, not a window resize listener — a scrollbar can appear or vanish with no resize.
function wireSplitHeader(panel, headSel, bodySel){
  const hd = panel.querySelector(headSel), sc = panel.querySelector(bodySel);
  // §7.2.15 (6) — one implementation. Every split header ships the .vheadwrap scrollport; a
  // fragment without one is a wiring mistake, not a case to fall back for.
  const port = hd && hd.parentElement && hd.parentElement.classList.contains('vheadwrap') ? hd.parentElement : null;
  if(!hd || !sc || !port) return;
  // MDL I-116 — ONE column grid means the fragment's DATA columns are the body's own rendered widths
  // and every leftover pixel belongs to the gutter. Both tables are `width:100%; table-layout:fixed`,
  // so whenever the columns sum to LESS than the display area the browser spreads the slack across the
  // columns — and it does that for the fragment but not for the body, which desynchronised every
  // boundary (the Issue grid drifted 212 px at the last column). Driving each data column from the
  // body's REAL width and handing the remainder to the gutter makes the halves identical by
  // construction rather than by coincidence.
  const syncWidth = () => {
    const bt = sc.querySelector('table');
    const bw = bt ? bt.offsetWidth : sc.clientWidth;
    const sb = Math.max(0, sc.offsetWidth - sc.clientWidth);
    hd.style.setProperty('--ds-sbw', sb + 'px');
    hd.style.width = (bw + sb) + 'px';
    const cols = [...hd.querySelectorAll('colgroup col')];
    const gut = cols.length ? cols[cols.length - 1] : null;
    const hasGut = !!gut && gut.classList.contains('ds-gut');
    const data = hasGut ? cols.slice(0, -1) : cols;
    // a windowed body may not have painted a row yet — fall back to the declared colgroup
    const row = bt ? [...bt.querySelectorAll('tbody tr')].find(r => r.children.length > 1) : null;
    const cells = row ? [...row.children] : [];
    let sum = 0;
    data.forEach((c, i) => {
      const w = cells[i] ? cells[i].getBoundingClientRect().width : parseFloat(c.style.width);
      if(!(w > 0)) return;
      c.style.width = w + 'px';
      sum += w;
    });
    if(hasGut) gut.style.width = Math.max(0, (bw + sb) - sum) + 'px';
  };
  const syncScroll = () => { if(port.scrollLeft !== sc.scrollLeft) port.scrollLeft = sc.scrollLeft; };
  const sync = () => { syncWidth(); syncScroll(); };
  sync();
  sc.addEventListener('scroll', syncScroll, { passive: true });
  if(typeof ResizeObserver === 'function') new ResizeObserver(sync).observe(sc);
  else window.addEventListener('resize', sync);
  // the column set can change with no resize at all (chooser, sort rebuild, fit pass), and each of
  // those rewrites the BODY colgroup — so that rewrite is what re-syncs the pair. Writing only to the
  // fragment's columns keeps this from feeding back on itself.
  const bt = sc.querySelector('table');
  if(bt && typeof MutationObserver === 'function'){
    const cg = bt.querySelector('colgroup');
    if(cg) new MutationObserver(sync).observe(cg, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });
  }
}
// §7.2.15 invariant 5 (I-116) — the pair MUST fit the display area whenever it can. The fit is
// re-derived whenever the scroller resizes: measuring once at render time is wrong (the panel has not
// reached its final width — that alone left 89 px of overflow), and a window resize listener misses a
// scrollbar appearing with no resize event. Re-fitting is idempotent: once the columns fit, the
// grid's fit pass does nothing, so this cannot loop.
function fitToScroller(grid, sc, repaint){
  if(!sc) return;
  // I-163 — fit on a CONTAINER change only, never because a column changed the scrollport box.
  // Caching clientWidth is what separates a sidebar toggle from a scrollbar appearing.
  let lastW = -1;
  const run = () => {
    const w = sc.clientWidth;
    if(w === lastW) return;
    lastW = w;
    if(grid.fit(w)) repaint();
  };
  run();
  requestAnimationFrame(run);
  if(typeof ResizeObserver === 'function') new ResizeObserver(run).observe(sc);
  else window.addEventListener('resize', run);
}

function renderMatrix(panel, matrix, months, curMonth){
  matrixCurMonth = curMonth;
  const ml = monthLabel(curMonth);
  const totalPlanned = matrix.reduce((a,m)=>a+(m.Planned||0),0) || 1;
  const subFmt = v => v + ' (' + Math.round((v/totalPlanned)*100) + '%)';
  const tint = ' class="col-tint"';
  // Discipline Summary Matrix — column sorting removed (request 2026-10-19, MDL I-110).
  // The table now always renders in its fixed default order: the row sequence produced by
  // buildModel (Planned-descending, the established "no sort" baseline). No header sort
  // buttons, no aria-sort indicators, no persisted sort preference. The TOTAL row stays
  // pinned last (in <tfoot>). The displayed rows, drill rows and CSV/PNG export all read
  // `mrows` — a single source with no sort state to maintain.
  let mrows = matrix.slice();
  const MATRIX_IDS = ['discipline','planned','submitted','plan','fcast','actual','app','awc','rej','nap','ov1','ov2','ov3','stages'];
  const mId = i => ' data-col-id="' + MATRIX_IDS[i] + '"';
  const matrixThead = ()=>{
    // Static headers (sorting removed 2026-10-19, MDL I-110): no sort buttons / aria-sort /
    // sort indicators. §18 centres a summary cross-tab's data columns, and the header carries
    // exactly what the body carries (a plain <td>), so header and data cannot diverge.
    const disc = `<th rowspan="2" scope="row"${mId(0)} tabindex="0">Discipline</th>`;
    const L = (k,i) => `<th scope="col"${mId(i+1)} tabindex="0">${esc(k)}</th>`;
    const COLS = ['Total Planned','Total Submitted','Plan','Forecast','Actual','APP','AWC','REJ','NAP','1st','Resub','Client'];
    return `<tr class="group">${disc}`
      + `<th colspan="2" scope="colgroup">Total Submission</th>`
      + `<th colspan="3" scope="colgroup">Submission — ${ml} (selected month)</th>`
      + `<th colspan="4" scope="colgroup">Approval</th>`
      + `<th colspan="3" scope="colgroup">Overdue</th>`
      + `<th rowspan="2" aria-label="Expand stages"${mId(13)} tabindex="0"></th>`
      // trailing gutter cell matching the reserved --ds-sbw column, so the header spans every column
      + `<th class="ds-gut" rowspan="2" aria-hidden="true"></th>`
      + `</tr>`
      + `<tr class="detail">${COLS.map(L).join('')}</tr>`;
  };
  // Split-header layout (I-101): the two-row header lives in a thead-only fragment (.vheadtab)
  // OUTSIDE the scroll container, so the vertical scrollbar sits UNDER it (not beside it) and the
  // two header bands stay stacked and always visible. The body table sits inside .tableScroll. The
  // fragment reserves a trailing gutter column (--ds-sbw) matching the scrollbar width so its columns
  // align with the body.
  // §18 fit policy: widths are content-derived (widest of the header label vs the body values), not
  // literals, and the sum stays BELOW the display area so table-layout:fixed scales the columns up to
  // fill it instead of overflowing. The Plan/Forecast/Actual columns were 140px for 2-3 digit counts,
  // which forced a horizontal scrollbar; they are now sized to their content.
  const matrixColW = [150,92,112,88,88,88,62,62,62,62,62,62,68,56];
  const colsHTML = matrixColW.map(w=>`<col style="width:${w}px">`).join('');
  const headBody = `<colgroup>${colsHTML}</colgroup>`;
  const headFrag = `<colgroup>${colsHTML}<col class="ds-gut" style="width:var(--ds-sbw,0px)"></colgroup>`;
  const matrixRows = arr => arr.map(m=>{
    const exp = m.stages.length ? `<td${mId(13)}><button class="expand" type="button" data-d="${esc(m.discipline)}" aria-expanded="false" title="Expand stages">▸ stages</button></td>` : `<td class="noexp"${mId(13)}>—</td>`;
    return `<tr tabindex="0"><td${mId(0)}>${esc(m.discipline)}</td><td${mId(1)}>${m.Planned}</td><td${mId(2)}>${subFmt(m.Submitted)}</td>`
      + `<td${tint}${mId(3)}>${m.PlanMo}</td><td${tint}${mId(4)}>${m.FcastMo}</td><td${tint}${mId(5)}>${m.ActualMo}</td>`
      + `<td${mId(6)}>${m.Approved}</td><td${mId(7)}>${m.AWC}</td><td${mId(8)}>${m.REJ}</td><td${mId(9)}>${m.NAP}</td>`
      + `<td${mId(10)}>${m.ov1}</td><td${mId(11)}>${m.ov2}</td><td${mId(12)}>${m.ov3}</td>${exp}</tr>`;
  }).join('');
  const rows = matrixRows(mrows);
  const tot = matrix.reduce((a,m)=>{ a.Planned+=m.Planned; a.Submitted+=m.Submitted; a.PlanMo+=m.PlanMo; a.FcastMo+=m.FcastMo; a.ActualMo+=m.ActualMo; a.Approved+=m.Approved; a.AWC+=m.AWC; a.REJ+=m.REJ; a.NAP+=m.NAP; a.ov1+=m.ov1; a.ov2+=m.ov2; a.ov3+=m.ov3; return a; }, {Planned:0,Submitted:0,PlanMo:0,FcastMo:0,ActualMo:0,Approved:0,AWC:0,REJ:0,NAP:0,ov1:0,ov2:0,ov3:0});
  const tfoot = `<tfoot><tr><td${mId(0)}>TOTAL</td><td${mId(1)}>${tot.Planned}</td><td${mId(2)}>${subFmt(tot.Submitted)}</td>`
    + `<td${tint}${mId(3)}>${tot.PlanMo}</td><td${tint}${mId(4)}>${tot.FcastMo}</td><td${tint}${mId(5)}>${tot.ActualMo}</td>`
    + `<td${mId(6)}>${tot.Approved}</td><td${mId(7)}>${tot.AWC}</td><td${mId(8)}>${tot.REJ}</td><td${mId(9)}>${tot.NAP}</td>`
    + `<td${mId(10)}>${tot.ov1}</td><td${mId(11)}>${tot.ov2}</td><td${mId(12)}>${tot.ov3}</td><td${mId(13)}></td></tr></tfoot>`;
  panel.innerHTML = `<div class="panel-head"><h2>Discipline Summary Matrix</h2><div class="head-actions"></div></div>`
    + `<div class="panel-body">`
    // §18 split-header contract (1): header + body share ONE bordered, rounded container, so the pair
    // reads as a single table with continuous corners instead of a square header over a rounded box.
    + `<div class="toolbar matrix-tools"><div class="tool-filters"></div><div class="tool-actions"><button class="ea btn btn-secondary" title="Expand every discipline">▾ Expand all</button><button class="ca btn btn-secondary" title="Collapse all disciplines">▸ Collapse all</button><button class="dl btn btn-secondary" title="Export fully-expanded report as PNG">⤓ PNG (full)</button><button class="cp btn btn-secondary" title="Copy fully-expanded report image">⧉ Copy</button><button class="csv btn btn-secondary" title="Download discipline summary matrix (disciplines + stages) as CSV">⤓ CSV</button></div></div>`
    + `<div class="matrixcard splitcard">`
    + `<div class="vheadwrap"><table class="matrix ds-table vheadtab" id="matrixHead"><caption class="sr-only">Discipline Summary Matrix — column headers.</caption>${headFrag}<thead>${matrixThead()}</thead></table></div>`
    + `<div class="tableScroll"><table class="matrix ds-table" id="matrixBody"><caption class="sr-only">Discipline Summary Matrix — a cross-tab of document counts by discipline per month, with a TOTAL row that is always last.</caption>${headBody}<tbody>${rows}</tbody>${tfoot}</table></div>`
    + `</div></div>`;
  const subRowsHTML = m => (m?m.stages:[]).map(s=>`<tr class="sub" tabindex="0"><td class="subname"${mId(0)}>${esc(s.stage)}</td><td${mId(1)}>${s.Planned}</td><td${mId(2)}>${s.Submitted}</td><td${tint}${mId(3)}>${s.PlanMo}</td><td${tint}${mId(4)}>${s.FcastMo}</td><td${tint}${mId(5)}>${s.ActualMo}</td><td${mId(6)}>${s.Approved}</td><td${mId(7)}>${s.AWC}</td><td${mId(8)}>${s.REJ}</td><td${mId(9)}>${s.NAP}</td><td${mId(10)}>${s.ov1}</td><td${mId(11)}>${s.ov2}</td><td${mId(12)}>${s.ov3}</td><td${mId(13)}></td></tr>`).join('');
  const collapseAll = () => { panel.querySelectorAll('tr.sub').forEach(r=>r.remove());
    panel.querySelectorAll('.expand').forEach(e=>{ e.classList.remove('open'); e.textContent='▸ stages'; e.setAttribute('aria-expanded','false'); e.title='Expand stages'; }); };
  // I-96b: the drill rows come from the display sequence (mrows), never from a stale
  // copy, so a stage row always follows its parent in the current row order.
  const openOne = td => { const m=mrows.find(x=>x.discipline===td.dataset.d); td.closest('tr').insertAdjacentHTML('afterend', subRowsHTML(m)); td.classList.add('open'); td.textContent='▾ stages'; td.setAttribute('aria-expanded','true'); td.title='Collapse stages'; };
  const bindExpand = ()=> panel.querySelectorAll('.expand').forEach(td=>td.onclick=()=>{
    const wasOpen = td.classList.contains('open');
    collapseAll();
    if(!wasOpen) openOne(td);
  });
  bindExpand();
  // Sorting removed (2026-10-19, MDL I-110): the matrix headers are now static labels, so no
  // click-to-sort handler is wired. The displayed rows, drill rows and CSV/PNG export all read
  // `mrows` (the fixed default order), keeping them a single source with no sort state to maintain.
  // §18 split-header contract (3, 5): width pin + gutter + horizontal lock-step, via the shared helper
  // (the same one the Rule Reference uses) so the matrix cannot drift from the contract again.
  wireSplitHeader(panel, '#matrixHead', '.tableScroll');
  const fitMatrix = () => {
    const sc = panel.querySelector('.tableScroll'); if(!sc) return false;
    const avail = sc.clientWidth; if(!(avail > 0)) return false;
    const minW = 60, sum = () => matrixColW.reduce((a,w)=>a+w,0);
    if(sum() <= avail) return false;
    const floor = matrixColW.reduce((a,w)=>a+Math.min(w,minW),0);
    if(floor >= avail) return false;
    const over = sum() - avail;
    const slack = matrixColW.reduce((a,w)=>a+Math.max(0,w-minW),0);
    if(!slack) return false;
    const next = matrixColW.map(w=>Math.max(minW, Math.round(w - over*(Math.max(0,w-minW)/slack))));
    let diff = next.reduce((a,w)=>a+w,0) - avail;
    while(diff > 0){
      let idx = -1, max = minW;
      next.forEach((w,i)=>{ if(w > max){ max = w; idx = i; } });
      if(idx < 0) break;
      next[idx]--; diff--;
    }
    matrixColW.splice(0, matrixColW.length, ...next);
    const cols = matrixColW.map(w=>`<col style="width:${w}px">`).join('');
    const bodyCG = panel.querySelector('#matrixBody colgroup');
    const headCG = panel.querySelector('#matrixHead colgroup');
    if(!bodyCG || !headCG) return false;
    bodyCG.innerHTML = cols;
    headCG.innerHTML = cols + '<col class="ds-gut" style="width:var(--ds-sbw,0px)"></col>';
    return true;
  };
  const runFit = () => { fitMatrix(); };
  runFit();
  requestAnimationFrame(runFit);
  if(typeof ResizeObserver === 'function') new ResizeObserver(runFit).observe(panel.querySelector('.tableScroll'));
  else window.addEventListener('resize', runFit);
  const toolRow = panel.querySelector('.matrix-tools');
  const msel=document.createElement('label'); msel.className='lbl month-sel';
  msel.innerHTML='<span>Month:</span>';
  const sel=document.createElement('select'); sel.className='inter-sel';
  (months||[]).forEach(o=>{ const op=document.createElement('option'); op.value=o.value; op.textContent=o.label; if(o.value===curMonth) op.selected=true; sel.appendChild(op); });
  sel.title='Choose the month for the Plan / Forecast / Actual columns';
  msel.appendChild(sel);
  toolRow.querySelector('.tool-filters').appendChild(msel);
  sel.onchange=()=>{ matrixMonthSel=sel.value; renderAll(WRAP); };
  wireCollapse(panel);
  toolRow.querySelector('.ea').onclick = ()=>{ collapseAll(); panel.querySelectorAll('.expand').forEach(openOne); };
  toolRow.querySelector('.ca').onclick = ()=> collapseAll();
  attachExport(toolRow, ()=> matrixSVG(mrows), xp('Discipline_Matrix'));
  toolRow.querySelector('.csv').onclick = ()=>{ downloadCSV(xp('Discipline_Matrix_'+(curMonth||'all'))+'.csv', matrixCSV(mrows, curMonth)); toast('CSV downloaded','success'); };
}

function renderInteractive(host, charts, groupKey){
  host.innerHTML='';
  const BREAKDOWNS=[
    {group:'Documents', items:[
      {label:'Discipline', key:'docsByDiscipline', mode:'cycle'},
      {label:'Approval Status', key:'approvalStatus', mode:'status'},
      {label:'As-Built Status', key:'asBuilt', mode:'status'},
      {label:'Authority', key:'byAuthority', mode:'cycle'},
      {label:'Doc Type / Stage', key:'byDocType', mode:'cycle'},
      {label:'Schedule Variance', key:'scheduleVariance', mode:'status'}]},
    {group:'Issues', items:[
      {label:'DQ by Rule', key:'dqByRule', mode:'cycle'},
      {label:'DQ by Discipline', key:'dqByDiscipline', mode:'cycle'}]}];
  const groups = groupKey==='iss' ? BREAKDOWNS.filter(g=>g.group==='Issues') : BREAKDOWNS.filter(g=>g.group==='Documents');
  const view = chartView[groupKey];
  const findItem = key => { for(const g of groups) for(const it of g.items) if(it.key===key) return it; return null; };
  if(!findItem(view.base)) view.base = groups[0].items[0].key;
  const groupLabel=groups[0].group;

  const h=document.createElement('h3');
  view.type = getPref('chart-'+groupKey, view.type);
  const sel=document.createElement('select'); sel.className='inter-sel';
  groups.forEach(g=>{ const og=document.createElement('optgroup'); og.label=g.group;
    g.items.forEach(it=>{ const o=document.createElement('option'); o.value=it.key; o.textContent=it.label; if(it.key===view.base) o.selected=true; og.appendChild(o); });
    sel.appendChild(og); });
  const toolbar=document.createElement('div'); toolbar.className='toolbar';
  toolbar.innerHTML=`<span class="seg" role="group" aria-label="Chart type"><button data-t="bar" data-key="${groupKey}">Bar</button><button data-t="pie" data-key="${groupKey}">Pie</button></span><button class="dl btn btn-secondary">⤓ PNG</button><button class="cp btn btn-secondary">⧉ Copy</button>`;
  const chartHost=document.createElement('div'); chartHost.className='chart-host';
  const draw=()=>{
    const it=findItem(view.base); const data=charts[it.key]||[];
    const colored=data.map((d,i)=>({...d, color: it.mode==='status'? statusColor(d.name) : (d.color||CHART_SERIES(i))}));
    const tooMany=data.length>12; const type=(tooMany&&view.type==='pie')?'bar':view.type;
    h.textContent=groupLabel+(tooMany&&view.type==='pie'?' — pie hidden (too many categories)':'');
    chartHost.innerHTML=type==='pie'? pieSVG(it.label, colored) : barSVG(it.label, colored);
    toolbar.querySelectorAll('.seg button').forEach(b=> b.classList.toggle('on', b.dataset.t===type));
  };
  sel.onchange=()=>{ view.base=sel.value; draw(); };
  toolbar.querySelectorAll('.seg button').forEach(b=> b.onclick=()=>{ view.type=b.dataset.t; setPref('chart-'+groupKey, view.type); draw(); });
  attachExport(toolbar, ()=>chartHost.innerHTML, ()=> xp(findItem(view.base).label));
  const head=document.createElement('div'); head.className='head-actions chart-actions'; head.appendChild(sel); head.appendChild(toolbar);
  host.appendChild(h); host.appendChild(head); host.appendChild(chartHost);
  draw();
}

function renderCharts(grid, charts){
  grid.innerHTML='';
  const docCard=document.createElement('div'); docCard.className='chart';
  renderInteractive(docCard, charts, 'doc');
  const issCard=document.createElement('div'); issCard.className='chart';
  renderInteractive(issCard, charts, 'iss');
  grid.appendChild(docCard); grid.appendChild(issCard);
}

function curveLoadPreset(){ try{ return localStorage.getItem('mdl-ip-preset')||'All'; }catch(e){ return 'All'; } }
function curveStorePreset(name){ try{ localStorage.setItem('mdl-ip-preset',name); }catch(e){} }
function curvePresetRange(name, p, toIdx){
  const n=p.months.length, last=n-1;
  const to=(typeof toIdx==='number'&&toIdx>=0&&toIdx<=last)?toIdx:((typeof p.asofIdx==='number'&&p.asofIdx>=0&&p.asofIdx<=last)?p.asofIdx:last);
  if(name==='All') return [0,last];
  if(name==='YTD'){
    const asof=(typeof p.asofIdx==='number'&&p.asofIdx>=0&&p.asofIdx<=last)?p.asofIdx:last;
    const year=(p.months[asof]||'').slice(0,4);
    let first=p.months.findIndex(m=>m.slice(0,4)===year);
    if(first<0) first=Math.max(0,asof-3);
    return [Math.min(first,asof),asof];
  }
  const size=Number(name.replace('M',''))||6;
  return [Math.max(0,to-size+1),to];
}
function curveUpdateTimebar(st){
  const max=Math.max(0,st.progress.months.length-1), denom=Math.max(1,max);
  const pos=i=>`calc(var(--c1-thumb)/2 + (100% - var(--c1-thumb)) * ${(i/denom).toFixed(6)})`;
  st.wf.max=st.wt.max=String(max);
  st.wf.value=String(scurveWin.from); st.wt.value=String(scurveWin.to);
  st.wf.setAttribute('aria-valuetext',monthLabel(st.progress.months[scurveWin.from]));
  st.wt.setAttribute('aria-valuetext',monthLabel(st.progress.months[scurveWin.to]));
  st.tb.dataset.c1period=JSON.stringify({from:scurveWin.from,to:scurveWin.to});
  st.tb.style.setProperty('--c1-fill-left',pos(scurveWin.from));
  st.tb.style.setProperty('--c1-fill-width',`calc((100% - var(--c1-thumb)) * ${((scurveWin.to-scurveWin.from)/denom).toFixed(6)})`);
  st.ticks.innerHTML=st.progress.months.map((m,i)=>{
    const isYear=(m||'').slice(5,7)==='01';
    const cls=`c1-tick${isYear?' is-year':''}${i>=scurveWin.from&&i<=scurveWin.to?' is-active':''}${(i===scurveWin.from||i===scurveWin.to)?' is-near':''}`;
    return `<i class="${cls}" data-c1month="${i}" style="left:${pos(i)}">${isYear?`<span class="c1-year">${(m||'').slice(0,4)}</span>`:''}</i>`;
  }).join('');
  st.segBtns.forEach(b=>{ const on=b.dataset.preset===curvePreset; b.classList.toggle('active',on); b.setAttribute('aria-pressed',String(on)); });
}
function curveTableMarkup(p, from, to){
  const idx=[]; for(let i=from;i<=to;i++) idx.push(i);
  const caption='<caption>Issue progress by reporting month, with the chart column for each month.</caption>';
  const col=`<colgroup><col style="width:var(--c1-gutter)"><col span="${idx.length}"><col style="width:var(--c1-right-w)"></colgroup>`;
  const head='<thead><tr><th scope="col" class="corner">Reporting Month</th>'+
    idx.map((i,j)=>`<th scope="col" class="g-axis" data-c1col="${j}" data-col-id="c${j}" tabindex="0"><span>${monthLabel(p.months[i])}</span></th>`).join('')+
    '<th aria-hidden="true"></th></tr></thead>';
  const rows=[['Planned','pNew'],['Forecast','fNew'],['Actual','aNew'],['Cum. Plan','pCum'],['Cum. Forecast','fCum'],['Cum. Actual','aCum']];
  const body='<tbody>'+rows.map(([lab,k])=>'<tr><th scope="row" class="g-label">'+lab+'</th>'+
    idx.map((i,j)=>`<td data-c1col="${j}" data-col-id="c${j}" tabindex="0">${p[k][i]||0}</td>`).join('')+
    '<td aria-hidden="true"></td></tr>').join('')+'</tbody>';
  return caption+col+head+body;
}
function curveTipHTML(pt){
  const sw=(token,lab,v)=>`<div class="chart-tip-row"><span class="k"><i class="kpi-tip-swatch" style="--tip-swatch:var(--${token})"></i>${lab}</span><span class="tip-num">${v}</span></div>`;
  return `<b>${esc(pt.month)}</b>`+sw('blue','Planned',pt.p)+sw('amber','Forecast',pt.f)+sw('green','Actual',pt.a)+
    `<div class="chart-tip-foot"><span>Cum. Plan</span><span class="tip-num">${pt.pc}</span></div>`+
    `<div class="chart-tip-foot"><span>Cum. Forecast</span><span class="tip-num">${pt.fc}</span></div>`+
    `<div class="chart-tip-foot"><span>Cum. Actual</span><span class="tip-num">${pt.ac}</span></div>`;
}
function curveClearCrosshair(st){
  st.table.querySelectorAll('.col-active').forEach(el=>el.classList.remove('col-active'));
}
function curveSyncColumn(st,index){
  curveClearCrosshair(st);
  st.plot.classList.toggle('col-on',index>=0);
  const band=st.plot.querySelector('.sc-hover-band'), snap=st.plot.querySelector('.chart-snap');
  if(band && index>=0) band.setAttribute('x',(index*(st.gw||0)).toFixed(1));
  if(snap && index>=0){ const x=((index+0.5)*(st.gw||0)).toFixed(1); snap.setAttribute('x1',x); snap.setAttribute('x2',x); }
  if(index>=0) st.table.querySelectorAll('[data-c1col]').forEach(el=>{ if(Number(el.dataset.c1col)===index) el.classList.add('col-active'); });
  st.active=index;
}
function curveHideTip(st){
  st.tip.classList.remove('show'); st.tip.setAttribute('aria-hidden','true'); st.tip.textContent=''; st.tip.innerHTML='';
  curveSyncColumn(st,-1);
}
function curveTipAt(st,index,clientX,clientY){
  const pt=st.points[index]; if(!pt) return;
  st.tip.removeAttribute('aria-hidden'); st.tip.innerHTML=curveTipHTML(pt); st.tip.classList.add('show');
  const rect=st.plot.getBoundingClientRect(), geo=JSON.parse(st.plot.dataset.geo||'{"W":1,"H":1}');
  const scale=rect.width/(geo.W||1);
  let x=clientX==null?rect.left+(index+0.5)*(st.gw||0)*scale:clientX;
  let y=clientY==null?rect.top+8:clientY;
  const tw=st.tip.offsetWidth||220, th=st.tip.offsetHeight||130;
  if(x+14+tw>window.innerWidth-4) x=Math.max(4,x-14-tw); else x+=14;
  if(y+14+th>window.innerHeight-4) y=Math.max(4,y-14-th); else y+=14;
  st.tip.style.left=Math.max(4,x)+'px'; st.tip.style.top=Math.max(4,y)+'px';
  curveSyncColumn(st,index);
}
function curveNearest(st,clientX,clientY){
  const rect=st.plot.getBoundingClientRect(), geo=JSON.parse(st.plot.dataset.geo||'{"W":1,"H":1}');
  const scale=rect.width/(geo.W||1), ux=(clientX-rect.left)/scale, uy=clientY-rect.top;
  let best=0, dist=Infinity;
  st.points.forEach((p,i)=>{ const dx=p.cx-ux, dy=uy-(geo.H||300)/2, d=dx*dx+dy*dy; if(d<dist){dist=d;best=i;} });
  return best;
}
function curveExportMarkup(st){
  const p=st.progress, cols=[]; for(let i=scurveWin.from;i<=scurveWin.to;i++) cols.push(i);
  const W=curvePlotWidth(st, cols.length);
  const g=curveChart(p,scurveWin.from,scurveWin.to,true,W);
  let chart=g.svg.replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'');
  try{ const cs=getComputedStyle(document.body);
    ['blue','amber','green'].forEach(n=>{ const v=cs.getPropertyValue('--'+n).trim()||COLORS[n]; chart=chart.split(`var(--${n})`).join(v); });
  }catch(e){ ['blue','amber','green'].forEach(n=>{ chart=chart.split(`var(--${n})`).join(COLORS[n]); }); }
  const yTicks=g.yticks.map(t=>`<text x="-8" y="${(t.y+4).toFixed(1)}" text-anchor="end" font-family="Segoe UI, Arial, sans-serif" font-size="13" fill="#6b7785">${curveTickText(t.v)}</text>`).join('');
  const rowH=20, headH=24, tableH=headH+6*rowH;
  let tableGap=10, headFill='#0F2D52', headFg='#fff';
  try{ const cs=getComputedStyle(document.body);
    tableGap=parseFloat(cs.getPropertyValue('--c1-plot-table-gap'))||tableGap;
    headFill=cs.getPropertyValue('--thead-bg').trim()||cs.getPropertyValue('--navy').trim()||headFill;
    headFg=cs.getPropertyValue('--thead-fg').trim()||headFg;
  }catch(e){}
  const tableY=g.H+tableGap, H=tableY+tableH;
  const gutter=CURVE_GUTTER_W, right=CURVE_RIGHT_W, cw=g.pw/Math.max(1,cols.length), sx=gutter+cols.length*cw;
  let t=`<rect x="0" y="${tableY}" width="${W}" height="${tableH}" fill="#fff"/>`;
  const cell=(x,y,w,h,text,align,header)=>{
    t+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h}" fill="${header?headFill:'#fff'}" stroke="#D8E0EA" stroke-width="1"/>`;
    t+=`<text x="${(align==='right'?x+w-5:x+5).toFixed(1)}" y="${y+h-5}" text-anchor="${align==='right'?'end':'start'}" font-family="Segoe UI, Arial, sans-serif" font-size="11" fill="${header?headFg:'#2B3440'}">${text}</text>`;
  };
  cell(0,tableY,gutter,headH,'Reporting Month','left',true);
  cols.forEach((i,j)=>cell(gutter+j*cw,tableY,cw,headH,monthLabel(p.months[i]),'right',true));
  cell(sx,tableY,right,headH,'','left',true);
  [['Planned','pNew'],['Forecast','fNew'],['Actual','aNew'],['Cum. Plan','pCum'],['Cum. Forecast','fCum'],['Cum. Actual','aCum']].forEach(([lab,k],r)=>{
    const y=tableY+headH+r*rowH;
    cell(0,y,gutter,rowH,lab,'left',false);
    cols.forEach((i,j)=>cell(gutter+j*cw,y,cw,rowH,String(p[k][i]||0),'right',false));
    cell(sx,y,right,rowH,'','left',false);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-60 0 ${W+60} ${H}" width="${W+60}" height="${H}"><rect x="-60" y="0" width="${W+60}" height="${H}" fill="#fff"/>${chart}${yTicks}${t}</svg>`;
}
function curveSVGToBlob(markup, cb){
  const url='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(markup);
  const img=new Image();
  img.onload=()=>{ const c=document.createElement('canvas'),scale=2; c.width=img.width*scale; c.height=img.height*scale;
    const ctx=c.getContext('2d'); ctx.fillStyle='#fff'; ctx.fillRect(0,0,c.width,c.height); ctx.scale(scale,scale); ctx.drawImage(img,0,0);
    c.toBlob(b=>cb(b),'image/png'); };
  img.onerror=()=>cb(null); img.src=url;
}
function curveAttachExport(st){
  const run=fn=>{ curveHideTip(st); curveSVGToBlob(curveExportMarkup(st),fn); };
  st.dl.onclick=()=>run(b=>{ if(!b){toast('Export failed','error');return;}
    const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=xp('Issue_Progress')+'.png'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000); toast('PNG downloaded','success'); });
  st.cp.onclick=()=>{ if(!navigator.clipboard||!window.ClipboardItem){toast('Clipboard not supported — use PNG','warning');return;}
    run(async b=>{ if(!b){toast('Export failed','error');return;} try{ await navigator.clipboard.write([new ClipboardItem({'image/png':b})]); toast('Copied to clipboard','success'); }
      catch(e){ toast('Clipboard blocked — PNG downloaded','warning'); } }); };
}
function curveTableCSV(st){
  const p=st.progress, idx=[]; for(let i=scurveWin.from;i<=scurveWin.to;i++) idx.push(i);
  if(!idx.length){ toast('Nothing to export','info'); return; }
  const lines=[[ 'Reporting Month',...idx.map(i=>monthLabel(p.months[i])) ].map(csvCell).join(',')];
  [['Planned','pNew'],['Forecast','fNew'],['Actual','aNew'],['Cum. Plan','pCum'],['Cum. Forecast','fCum'],['Cum. Actual','aCum']].forEach(([label,key])=>{
    lines.push([label,...idx.map(i=>p[key][i]||0)].map(csvCell).join(','));
  });
  downloadCSV(xp('Issue_Progress_Table')+'.csv',lines.join('\n'));
  toast('CSV downloaded','success');
}
function curveDraw(st){
  const a=scurveWin.from, b=scurveWin.to, cols=b-a+1;
  const W=curvePlotWidth(st, cols);
  const g=curveChart(st.progress,a,b,false,W);
  st.grid.style.setProperty('--c1-cols',String(cols));
  st.plot.innerHTML=g.svg;
  st.plot.dataset.geo=JSON.stringify({W:g.W,H:g.H,pw:g.pw,gw:g.gw});
  const yt=st.gutter.querySelector('.curve-c1-yticks');
  if(yt) yt.innerHTML=g.yticks.map(t=>`<span class="curve-c1-ytick" style="top:${(t.y/g.H*100).toFixed(2)}%">${curveTickText(t.v)}</span>`).join('');
  st.points=g.points; st.gw=g.gw;
  st.table.classList.toggle('c1-many',cols>13); st.table.classList.toggle('c1-few',cols<=13);
  if(st.csv) st.csv.hidden=!(cols>0);
  st.table.innerHTML=curveTableMarkup(st.progress,a,b);
  st.msg.textContent=`${monthLabel(st.progress.months[a])} – ${monthLabel(st.progress.months[b])}`;
  st.dualNote.textContent=g.dual?'Monthly bars use the right-hand scale; Cum. lines use the left cumulative scale.':'';
  curveUpdateTimebar(st);
  curveSyncColumn(st,-1);
}
function curveBind(st){
  const input=which=>{
    const source=which==='from'?st.wf:st.wt, other=which==='from'?st.wt:st.wf;
    const v=Math.max(0,Math.min(st.progress.months.length-1,+source.value));
    if(which==='from' && v>scurveWin.to){ scurveWin.to=v; other.value=String(v); }
    if(which==='to' && v<scurveWin.from){ scurveWin.from=v; other.value=String(v); }
    scurveWin[which]=v; curvePreset=null; curveUpdateTimebar(st);
  };
  st.wf.oninput=()=>input('from'); st.wt.oninput=()=>input('to');
  st.wf.onchange=()=>curveDraw(st); st.wt.onchange=()=>curveDraw(st);
  st.segBtns.forEach(btn=>btn.onclick=()=>{
    curvePreset=btn.dataset.preset; curveStorePreset(curvePreset);
    const r=curvePresetRange(curvePreset,st.progress,scurveWin.to); scurveWin={from:r[0],to:r[1]}; curveUpdateTimebar(st); curveDraw(st);
  });
  st.barsBtn.onclick=()=>{ curveShowBars=!(curveShowBars!==false);
    st.barsBtn.setAttribute('aria-pressed',String(curveShowBars)); st.barsBtn.style.opacity=curveShowBars?'1':'0.55'; curveDraw(st); };
  curveAttachExport(st);
  st.plot.addEventListener('pointermove',e=>{ if(e.pointerType==='touch')return; curveTipAt(st,curveNearest(st,e.clientX,e.clientY),e.clientX,e.clientY); });
  st.plot.addEventListener('pointerleave',()=>curveHideTip(st));
  st.plot.addEventListener('focus',()=>curveTipAt(st,0,null,null));
  st.plot.addEventListener('blur',()=>curveHideTip(st));
  st.plot.addEventListener('keydown',e=>{
    if(e.key==='Escape'){ curveHideTip(st); return; }
    if(e.key==='ArrowRight'||e.key==='ArrowLeft'){ e.preventDefault();
      const next=Math.max(0,Math.min(st.points.length-1,st.active+(e.key==='ArrowRight'?1:-1))); curveTipAt(st,next,null,null); }
  });
  st.plot.addEventListener('pointerdown',e=>{ if(e.pointerType!=='touch') return;
    curveTipAt(st,curveNearest(st,e.clientX,e.clientY),e.clientX,e.clientY); });
  document.addEventListener('pointerdown',e=>{ if(curveState===st && !st.card.contains(e.target)) curveHideTip(st); });
  document.addEventListener('keydown',e=>{ if(curveState===st && e.key==='Escape') curveHideTip(st); });
}
function renderCurvePanel(body, progress){
  if(curveState && curveState.ro) curveState.ro.disconnect();
  curveState=null; body.innerHTML='';
  const n=progress.months.length; if(!n) return;
  if(curvePreset==null) curvePreset=curveLoadPreset();
  if(!scurveWin || scurveWin.from>n-1 || scurveWin.to>n-1 || scurveWin.from>scurveWin.to){
    const r=curvePresetRange(curvePreset,progress); scurveWin={from:r[0],to:r[1]};
  }
  scurveWin.to=Math.min(scurveWin.to,n-1); scurveWin.from=Math.min(scurveWin.from,n-1);
  if(scurveWin.from>scurveWin.to){ const t=scurveWin.from; scurveWin.from=scurveWin.to; scurveWin.to=t; }
  const card=document.createElement('div'); card.className='chart curve-card'; body.appendChild(card);
  const cluster=document.createElement('div'); cluster.className='head-actions chart-actions'; card.appendChild(cluster);
  const win=document.createElement('div'); win.className='toolbar sc-win';
  win.innerHTML='<span class="lbl">Period</span><div class="c1-ts-body">'+
    '<div class="c1-timebar"><div class="c1-track"></div><div class="c1-fill"></div><div class="c1-ticks"></div>'+
    '<input type="range" class="wf" data-c1period="from" min="0" step="1" aria-label="Period start month"><input type="range" class="wt" data-c1period="to" min="0" step="1" aria-label="Period end month"></div>'+
    '</div>'+
    '<div class="seg" role="group" aria-label="Period presets">'+
    ['6M','12M','24M','YTD','All'].map(name=>`<button type="button" class="seg-btn" data-preset="${name}" aria-pressed="false">${name}</button>`).join('')+
    '</div><span class="msg"></span>';
  card.appendChild(win);
  const barsBtn=document.createElement('button'); barsBtn.className='ctl-bars btn btn-secondary'; barsBtn.textContent='Bars'; barsBtn.title='Show / hide the monthly bars'; barsBtn.setAttribute('aria-pressed', String(curveShowBars!==false)); barsBtn.style.opacity=curveShowBars?'1':'0.55';
  cluster.appendChild(barsBtn);
  const csv=document.createElement('button'); csv.className='csv btn btn-secondary'; csv.textContent='⤓ CSV'; csv.title='Download the attached table as CSV'; csv.hidden=!progress.months.length;
  cluster.appendChild(csv);
  const dl=document.createElement('button'); dl.className='dl btn btn-secondary'; dl.textContent='⤓ PNG'; dl.title='Export chart as PNG';
  const cp=document.createElement('button'); cp.className='cp btn btn-secondary'; cp.textContent='⧉ Copy'; cp.title='Copy chart image';
  cluster.appendChild(dl); cluster.appendChild(cp);
  const host=document.createElement('div'); host.className='curve-host'; card.appendChild(host);
  const grid=document.createElement('div'); grid.className='curve-c1-grid'; host.appendChild(grid);
  const gutter=document.createElement('div'); gutter.className='curve-c1-gutter'; gutter.innerHTML='<div class="curve-c1-yticks"></div><span class="curve-c1-ycap">Documents</span>'; grid.appendChild(gutter);
  const plot=document.createElement('div'); plot.className='curve-c1-plot'; plot.tabIndex=0; plot.setAttribute('role','group'); plot.setAttribute('aria-label','Issue Progress chart and hover columns'); plot.setAttribute('aria-describedby','curveChartTip'); grid.appendChild(plot);
  const table=document.createElement('table'); table.className='ds-table curve-c1-table'; table.setAttribute('data-table-crosshair',''); grid.appendChild(table);
  const tip=document.createElement('div'); tip.className='chart-tip'; tip.id='curveChartTip'; tip.setAttribute('role','tooltip'); tip.setAttribute('aria-hidden','true'); card.appendChild(tip);
  const dualNote=document.createElement('div'); dualNote.className='curve-note'; card.appendChild(dualNote);
  const st={card,win,plot,table,tip,dualNote,msg:win.querySelector('.msg'),wf:win.querySelector('.wf'),wt:win.querySelector('.wt'),tb:win.querySelector('.c1-timebar'),ticks:win.querySelector('.c1-ticks'),segBtns:[...win.querySelectorAll('.seg-btn')],barsBtn,csv,dl,cp,gutter,host,grid,progress,points:[],gw:0,active:-1,lastW:0,ro:null};
  csv.onclick=()=>curveTableCSV(st);
  curveState=st; curveBind(st); curveDraw(st);
  if(typeof ResizeObserver!=='undefined'){
    st.ro=new ResizeObserver(()=>{ const w=Math.round(st.plot.clientWidth||0); if(w && w!==st.lastW){ st.lastW=w; curveDraw(st); } });
    st.ro.observe(st.plot);
  }
}
const OVERDUE_COLS=[
  {h:'Prolog Number', f:'Prolog Number'},
  {h:'Document No.', f:'Document No.', cls:'doc-full', min:180},
  {h:'Document Title', f:'Document Title', cls:'doc-full', min:420},
  {h:'Number', f:'Number'},
  {h:'UESH Discipline', f:'UESH Discipline'},
  {h:'Overdue Type', f:null},
  {h:'Planned 1st Issue Date', f:'Planned 1st Issue Date'},
  {h:'Forecast 1st Issue Date', f:'Forecast 1st Issue Date'},
  {h:'Actual 1st Issue Date', f:'Actual 1st Issue Date'},
  {h:'Latest Approval Date', f:'Latest Approval Date'},
  {h:'Latest Approval Status', f:'Latest Approval Status'},
  {h:'Submission Status', f:'Submission Status'},
  {h:'Delay (days)', f:null, num:true}
];
// Fallback labels ONLY for workbooks that predate the `Overdue Type Code` block (Code!AN:AO).
const OVERDUE_TYPES_FALLBACK=[
  {key:'first', label:'1st-submission'},
  {key:'sub', label:'Resubmission'},
  {key:'cli', label:'Client-review'}
];
/* I-114 — workplan §4A.6: the Overdue flavours are workbook data, so their labels come from the
   Code sheet lookup block (`Overdue Type Code` -> `Overdue Type`), exactly like every other lookup.
   The three KEYS stay structural — they select the delay formula (§4A.4), the month-matrix bands and
   the KPI/chart rows — so codes in the sheet that have no formula behind them are ignored; adding a
   fourth flavour remains a code change, not a workbook edit. */
function overdueTypesOf(model){
  const blk = model && model.contract && model.contract.lookups && model.contract.lookups.overdueType;
  const items = (blk && blk.items) || [];
  if(!items.length) return OVERDUE_TYPES_FALLBACK;
  const byCode = {};
  items.forEach(it => { if(it && it.code) byCode[it.code] = it.label || it.code; });
  return OVERDUE_TYPES_FALLBACK.map(t => ({ key: t.key, label: byCode[t.key] || t.label }));
}
function renderOverdue(panel, o, model){
  const OVERDUE_TYPES = overdueTypesOf(model);
  const PAGE_SIZE = 200;
  // L2 column model (I-92): every column sortable; dates sort as dates, statuses as enums,
  // Delay as a number; empty cells sort last. The L3 grid (I-95) owns column order / widths /
  // the show-hide chooser / the resize grips, so the renderer only produces cell contents.
  const overdueCols = OVERDUE_COLS.map(c=>({
    key: c.h, label: c.h, h: c.h, sortable:true, f: c.f, num: c.num, cls: c.cls, min: c.min,
    type: c.num ? 'num' : (/Date$/.test(c.h) ? 'date' : (c.h==='Latest Approval Status' || c.h==='Submission Status' ? 'enum' : 'text')),
    order: c.h==='Latest Approval Status' ? ['APP','AWC','REJ','NAP'] : c.h==='Submission Status' ? ['SUR','RTR','NTS'] : undefined,
    get: x => c.f===null ? (c.h==='Overdue Type' ? x.type : (c.h==='Delay (days)' ? (x.r.delay==null?'':x.r.delay) : '')) : (x.r.fields[c.f]||'')
  }));
  const oget = (x,key)=>{ const c=overdueCols.find(k=>k.key===key); return c ? c.get(x) : ''; };
  const recs=[];
  OVERDUE_TYPES.forEach(t=> (o[t.key]||[]).forEach(r=> recs.push({r, type:t.label})));
  // The global Discipline/Stage chips own cross-panel scope. Overdue Type is the only
  // panel-local row filter. It narrows the rows already derived in S4.
  let rows = recs;
  const osort = {col:'Delay (days)', dir:-1};
  const sp = getPref('overdue_sort','');
  if(/^(-?1)\|/.test(sp)){ const [d,c]=sp.split('|'); if(overdueCols.some(x=>x.key===c)){ osort.col=c; osort.dir=Number(d); } }
  rows = dsSorted(rows, overdueCols, osort, oget);
  const colVal=(c,x)=>{
    if(c.f===null){ if(c.h==='Overdue Type') return x.type; if(c.h==='Delay (days)') return (x.r.delay==null?'':x.r.delay); }
    return x.r.fields[c.f]||'';
  };

  const grid = makeGrid('overdue', overdueCols);
  // §7.2.15 — one header fragment outside the scroller, with a gutter for the scrollbar.
  const ovHeadRow = ()=>grid.headRow(osort).replace('</tr>', '<th class="ds-gut" aria-hidden="true"></th></tr>');
  const ovFragCols = ()=>grid.colgroupHTML().replace('</colgroup>', '<col class="ds-gut" style="width:var(--ds-sbw,0px)"></colgroup>');
  let ovPage = 1;
  let sel = null;
  const visibleRows = ()=> rows.filter(x=>!sel || !sel.value || x.type===sel.value);
  const pageCount = ()=> Math.max(1, Math.ceil(visibleRows().length/PAGE_SIZE));
  const ovRow = x=>`<tr>${grid.visible().map(c=>grid.td(c, esc(colVal(c,x)))).join('')}</tr>`;
  const ovEmpty = ()=>`<tr><td class="empty" colspan="${grid.visible().length}">${((sel && sel.value) || rows.length<recs.length)?'No overdue documents match the current filter.':'No overdue documents'}</td></tr>`;
  const tbody = ()=>{
    const rs = visibleRows().slice((ovPage-1)*PAGE_SIZE, ovPage*PAGE_SIZE);
    return rs.length ? rs.map(ovRow).join('') : ovEmpty();
  };
  const countText = ()=>{
    const n = visibleRows().length, pc = pageCount();
    const base = (sel && sel.value && rows.length<recs.length) ? `${n} of ${recs.length} docs` : `${n} docs`;
    return pc>1 ? `${base} · Page ${ovPage} / ${pc}` : base;
  };
  panel.innerHTML=`<div class="panel-head"><h2>Overdue List</h2><div class="head-actions"></div></div>
    <div class="panel-body"><div class="c-card overdue-card">
      <div class="toolbar overdue-tools">
        <div class="tool-filters">
          <label class="lbl">Overdue Type:
            <select class="inter-sel" id="ovType" title="Filters this table only — the Overdue List" aria-label="Filter the Overdue List by type — this table only">
              <option value="">All</option>
              ${OVERDUE_TYPES.map(t=>`<option value="${t.label}">${t.label}</option>`).join('')}
            </select>
          </label>
          <span class="cnt" id="ovCnt">${countText()}</span>
          <button type="button" class="pg btn btn-secondary" data-ov-page="prev" title="Previous page" aria-label="Previous page">Previous</button>
          <button type="button" class="pg btn btn-secondary" data-ov-page="next" title="Next page" aria-label="Next page">Next</button>
        </div>
        <div class="tool-actions">
          <button class="csv btn btn-secondary" id="ovCsv" title="Download consolidated overdue list as CSV">⤓ CSV</button>
        </div>
      </div>
      <div class="splitbox splitcard">
        <div class="vheadwrap"><table class="ds-table vheadtab" id="ovHead"><caption class="sr-only">Overdue List — column headers.</caption>${ovFragCols()}<thead>${ovHeadRow()}</thead></table></div>
        <div class="tableScroll"><table class="ds-table"><caption class="sr-only">Overdue List — documents past their planned or forecast issue date, with the delay in days.</caption>${grid.colgroupHTML()}<tbody id="ovBody">${tbody()}</tbody></table></div>
      </div>
    </div></div>`;
  const tbl = panel.querySelector('.tableScroll table');
  const ovHead = panel.querySelector('#ovHead');
  const sc = panel.querySelector('.tableScroll');
  sel = panel.querySelector('#ovType');
  const toolActions = panel.querySelector('.tool-actions');
  const csvBtn = panel.querySelector('#ovCsv');
  const prevBtn = panel.querySelector('[data-ov-page="prev"]');
  const nextBtn = panel.querySelector('[data-ov-page="next"]');
  const paint = ()=>{
    const pc = pageCount();
    if(ovPage > pc) ovPage = pc;
    panel.querySelector('#ovBody').innerHTML = tbody();
    panel.querySelector('#ovCnt').textContent = countText();
    const n = visibleRows().length;
    csvBtn.hidden = n === 0;
    prevBtn.hidden = nextBtn.hidden = pc <= 1;
    prevBtn.disabled = ovPage <= 1;
    nextBtn.disabled = ovPage >= pc;
  };
  sel.onchange=()=>{ ovPage=1; paint(); };
  prevBtn.onclick=()=>{ ovPage=Math.max(1, ovPage-1); paint(); };
  nextBtn.onclick=()=>{ ovPage=Math.min(pageCount(), ovPage+1); paint(); };
  // L3 grid: chooser + resize. The chooser is a layout control, so it sits in tool-actions.
  const oResize = grid.resizer(tbl, ovHead);
  grid.chooser(toolActions);
  grid.refresh = () => {
    const cg = tbl.querySelector('colgroup'); if(cg) cg.innerHTML = grid.colgroupHTML().replace(/^<colgroup>|<\/colgroup>$/g, '');
    const hcg = ovHead.querySelector('colgroup'); if(hcg) hcg.innerHTML = ovFragCols().replace(/^<colgroup>|<\/colgroup>$/g, '');
    const th = ovHead.querySelector('thead'); if(th) th.innerHTML = ovHeadRow();
    oResize.addGrips();
    paint();
  };
  fitToScroller(grid, sc, () => grid.refresh());
  wireSplitHeader(panel, '#ovHead', '.tableScroll');
  wireSort(ovHead, overdueCols, osort, ()=>{ rows=dsSorted(rows, overdueCols, osort, oget); ovPage=1; paint(); oResize.addGrips(); }, 'overdue_sort', ovHeadRow);
  paint();
  csvBtn.onclick=()=>{
    const rs = visibleRows();
    if(!rs.length){ toast('Nothing to export','info'); return; }
    const header=OVERDUE_COLS.map(c=>c.h);
    const lines=[header.join(',')].concat(rs.map(x=>OVERDUE_COLS.map(c=>colVal(c,x)).map(csvCell).join(',')));
    downloadCSV(xp('Overdue')+'.csv', lines.join('\n'));
    toast('CSV downloaded','success');
  };
}
/* Shared validation facts. One source for both top-level panels. */
function validationInfo(issues, model){
  /* §7.2.4 — a table severity is a fixed-size inline SVG, never an emoji. */
  const SEV_SVG = {
    Error:'<svg class="sev-svg" viewBox="0 0 14 14" width="14" height="14" role="img" aria-label="Error"><circle cx="7" cy="7" r="6" fill="var(--red)"/><path d="M4.7 4.7l4.6 4.6M9.3 4.7l-4.6 4.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
    Warning:'<svg class="sev-svg" viewBox="0 0 14 14" width="14" height="14" role="img" aria-label="Warning"><path d="M7 1.3l5.7 10.4H1.3z" fill="var(--amber)"/><path d="M7 5.1v3.1" stroke="#543a00" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="10.3" r=".85" fill="#543a00"/></svg>',
    Info:'<svg class="sev-svg" viewBox="0 0 14 14" width="14" height="14" role="img" aria-label="Info"><circle cx="7" cy="7" r="6" fill="var(--blue)"/><path d="M7 6.3v3.9" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="4" r=".85" fill="#fff"/></svg>'
  };
  const sevKey = s => s==='Error'?'error':(s==='Warning'?'warning':'info');
  const cnt = {error:0, warning:0, info:0};
  const msgByCode = {};
  issues.forEach(i => { cnt[sevKey(i.severity)]++; if(!(i.code in msgByCode)) msgByCode[i.code] = i.message; });
  const eb = (model && model.contract && model.contract.errorBlock) || {map:{}, order:[]};
  const fired = [...new Set(issues.map(i=>i.code))].sort();
  const cntByCode = {};
  issues.forEach(i => { cntByCode[i.code] = (cntByCode[i.code]||0)+1; });
  const ruleRows = fired.map(code => {
    const r = eb.map[code] || {};
    return {severity:r.severity||'Warning', code, group:r.group||'—',
            description:r.rule||msgByCode[code]||'', count:cntByCode[code]||0};
  });
  return {SEV_SVG, sevKey, cnt, total:issues.length, eb, fired, cntByCode, msgByCode,
          rulesLoaded:(eb.order||[]).length, ruleRows};
}
const pchipHtml = (family,label,count,countAttrs='') =>
  `<span class="pchip ${family}" data-pchip="${family}" data-pchip-count="${count}">${esc(label)} <b${countAttrs}>${Number(count).toLocaleString()}</b></span>`;

/* Panel 1 — fired rule reference. No meta note, no card title, no row-count label. */
function renderValidationRules(panel, issues, model){
  const info = validationInfo(issues, model);
  const rules = info.ruleRows;
  const ruleCols = [
    {key:'severity', label:'Severity', sortable:false, type:'enum', order:['Error','Warning','Info']},
    {key:'code', label:'Code', sortable:false, type:'text'},
    {key:'group', label:'Group', sortable:false, type:'text'},
    {key:'description', label:'Description', sortable:false, type:'text'},
    {key:'count', label:'Count', sortable:false, type:'num'}
  ];
  const grid = makeGrid('validation_rules', ruleCols);
  const ruleRowHTML = r => `<tr>${grid.visible().map(c=>{
    const inner = c.key==='severity'
      ? `<span class="sev-${info.sevKey(r.severity)}">${info.SEV_SVG[r.severity]||info.SEV_SVG.Warning}</span>`
      : c.key==='code' ? `<code>${esc(r.code)}</code>`
      : esc(r[c.key]==null?'—':r[c.key]);
    return grid.td(c, inner);
  }).join('')}</tr>`;
  const ruleHead = ()=>grid.headRow({col:'',dir:1}).replace('</tr>', '<th class="ds-gut" aria-hidden="true"></th></tr>');
  const ruleColsHTML = ()=>grid.colgroupHTML().replace('</colgroup>', '<col class="ds-gut" style="width:var(--ds-sbw,0px)"></colgroup>');
  panel.innerHTML=`<div class="panel-head"><h2>Validation Rules</h2><div class="head-actions"></div></div>
    <div class="panel-body">
      <div class="pchip-row v-chip-row" data-panel-subtitle>${pchipHtml('violet','Loaded rules',info.rulesLoaded)}${pchipHtml('neutral','Fired rules',rules.length)}</div>
      <div class="c-card validation-rules-card" id="vref">
        <div class="toolbar validation-rules-tools"><div class="tool-filters"></div><div class="tool-actions"><button id="vrCsv" class="csv btn btn-secondary" title="Download fired validation rules as CSV">⤓ CSV</button></div></div>
        <div class="splitbox splitcard">
          <div class="vheadwrap"><table class="ds-table vheadtab" id="vrHead"><caption class="sr-only">Fired validation rules — column headers.</caption>${ruleColsHTML()}<thead>${ruleHead()}</thead></table></div>
          <div class="tableScroll"><table class="ds-table"><caption class="sr-only">Fired validation rules — one row per rule code with its occurrence count.</caption>${grid.colgroupHTML()}<tbody>${rules.length?rules.map(ruleRowHTML).join(''):`<tr>${grid.visible().map(()=>'<td class="empty"></td>').join('')}</tr>`}</tbody></table></div>
        </div>
      </div>
    </div>`;
  const sc = panel.querySelector('.validation-rules-card .tableScroll');
  const tbl = sc && sc.querySelector('table');
  const head = panel.querySelector('#vrHead');
  const csvBtn = panel.querySelector('#vrCsv');
  csvBtn.hidden = rules.length === 0;
  csvBtn.onclick=()=>{
    if(!rules.length){ toast('Nothing to export','info'); return; }
    const head=['Severity','Code','Group','Description','Count'];
    const lines=[head.join(',')].concat(rules.map(r=>[r.severity,r.code,r.group,r.description,r.count].map(csvCell).join(',')));
    downloadCSV(xp('validation_rules')+'.csv', lines.join('\n'));
    toast('CSV downloaded','success');
  };
  const resize = (tbl && head) ? grid.resizer(tbl, head) : null;
  grid.chooser(panel.querySelector('.tool-actions'));
  grid.refresh = ()=>{
    if(tbl){ const cg=tbl.querySelector('colgroup'); if(cg) cg.innerHTML=grid.colgroupHTML().replace(/^<colgroup>|<\/colgroup>$/g,''); }
    if(head){
      const hcg=head.querySelector('colgroup'); if(hcg) hcg.innerHTML=ruleColsHTML().replace(/^<colgroup>|<\/colgroup>$/g,'');
      const th=head.querySelector('thead'); if(th) th.innerHTML=ruleHead();
    }
    if(resize) resize.addGrips();
  };
  if(sc) fitToScroller(grid, sc, ()=>grid.refresh());
  wireSplitHeader(panel, '#vrHead', '.validation-rules-card .tableScroll');
}

/* Panel 2 — per-issue table with local Rule filter and 200-row pagination. */
function renderValidationIssues(panel, issues, model){
  const info = validationInfo(issues, model);
  const PAGE_SIZE = 200;
  const issueCols = [
    {key:'severity', label:'Severity', sortable:true, type:'enum', order:['Error','Warning','Info']},
    {key:'code', label:'Rule', sortable:true, type:'text'},
    {key:'docNo', label:'Doc No', sortable:true, type:'text'},
    {key:'field', label:'Field', sortable:true, type:'text'},
    {key:'value', label:'Value', sortable:true, type:'text'},
    {key:'message', label:'Message', sortable:true, type:'text'},
    {key:'sourceTab', label:'Source Tab', sortable:true, type:'text'},
    {key:'rownum', label:'Row', sortable:true, type:'num'}
  ];
  const issueGet = (i,key)=>i[key];
  const grid = makeGrid('issue', issueCols);
  const sevChips = info.total
    ? `<span class="vchip e">Error ${info.cnt.error}</span><span class="vchip w">Warning ${info.cnt.warning}</span><span class="vchip i">Info ${info.cnt.info}</span>`
    : `<span class="vchip ok">No issues</span>`;
  const ruleDescOf = code => { const r=info.eb.map[code]||{}; return r.rule||info.msgByCode[code]||''; };
  const ruleOpts = `<option value="">All rules</option>` + info.fired.map(code=>
    `<option value="${esc(code)}">${esc(code)} — ${esc(ruleDescOf(code))} (${info.cntByCode[code]})</option>`).join('');
  const isort = {col:'', dir:1};
  const isp = getPref('issue_sort','');
  if(/^(-?1)\|/.test(isp)){ const [d,c]=isp.split('|'); if(issueCols.some(x=>x.key===c)){ isort.col=c; isort.dir=Number(d); } }
  let ruleSel = '', page = 1;
  const filtered = ()=> ruleSel ? issues.filter(i=>i.code===ruleSel) : issues;
  const sortedView = ()=> dsSorted(filtered(), issueCols, isort, issueGet);
  const pageCount = ()=> Math.max(1, Math.ceil(sortedView().length/PAGE_SIZE));
  const countText = ()=>{
    const n = sortedView().length, pc = pageCount();
    const base = (ruleSel && n<info.total) ? `${n} of ${info.total} issues` : `${info.total} issue${info.total===1?'':'s'}`;
    return pc>1 ? `${base} · Page ${page} / ${pc}` : base;
  };
  const issueRowHTML = i => `<tr>${grid.visible().map(c=>{
    const inner = c.key==='severity'
      ? `<span class="sev-${info.sevKey(i.severity)}">${info.SEV_SVG[i.severity]||info.SEV_SVG.Warning}</span>`
      : esc(i[c.key]==null?'—':i[c.key]);
    return grid.td(c, inner);
  }).join('')}</tr>`;
  const issueEmpty = ()=>`<tr><td class="empty" colspan="${grid.visible().length}">No issues to display.</td></tr>`;
  const pageRows = ()=> sortedView().slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const issueHeadRow = ()=> grid.headRow(isort).replace('</tr>', '<th class="ds-gut" aria-hidden="true"></th></tr>');
  const issueFragCols = ()=> grid.colgroupHTML().replace('</colgroup>', '<col class="ds-gut" style="width:var(--ds-sbw,0px)"></colgroup>');
  panel.innerHTML=`<div class="panel-head"><h2>Validation Issues</h2><div class="head-actions"></div></div>
    <div class="panel-body">
      <div class="pchip-row v-chip-row" data-panel-subtitle>${pchipHtml('green','All issues',info.total)}${pchipHtml('neutral','Shown issues',info.total,' data-validation-count')}<span class="vchips" id="vChips">${sevChips}</span></div>
      <div class="c-card validation-issues-card">
        <div class="toolbar validation-tools">
          <div class="tool-filters">
            <label class="lbl">Rule:<select class="inter-sel" id="vRule" title="Filters this table only — the Validation Issues panel" aria-label="Filter issues by rule code — this panel only">${ruleOpts}</select></label>
            <button type="button" class="pg btn btn-secondary" data-vpage="prev" title="Previous page" aria-label="Previous issue page">Previous</button>
            <label class="lbl">Page:<select class="inter-sel" id="vPage" title="Jump to an issue page" aria-label="Jump to an issue page"></select></label>
            <button type="button" class="pg btn btn-secondary" data-vpage="next" title="Next page" aria-label="Next issue page">Next</button>
            <span class="cnt" id="vCnt">${countText()}</span>
          </div>
          <div class="tool-actions"><button id="vCsv" class="csv btn btn-secondary" title="Download all filtered validation issues as CSV">⤓ CSV</button></div>
        </div>
        <div class="splitbox splitcard">
          <div class="vheadwrap"><table class="ds-table vheadtab" id="vHead"><caption class="sr-only">Validation issue list — column headers.</caption>${issueFragCols()}<thead>${issueHeadRow()}</thead></table></div>
          <div class="tableScroll vtableWrap"><table class="ds-table"><caption class="sr-only">Validation issue list — every individual issue found, with severity, rule, document number, field, value, message, source tab and row number.</caption>${grid.colgroupHTML()}<tbody id="vBody">${pageRows().length?pageRows().map(issueRowHTML).join(''):issueEmpty()}</tbody></table></div>
        </div>
      </div>
    </div>`;
  const vsc = panel.querySelector('.vtableWrap');
  const vTbl = vsc && vsc.querySelector('table');
  const vHead = panel.querySelector('#vHead');
  const ruleSelEl = panel.querySelector('#vRule');
  const pageSelEl = panel.querySelector('#vPage');
  const csvBtn = panel.querySelector('#vCsv');
  const prevBtn = panel.querySelector('[data-vpage="prev"]');
  const nextBtn = panel.querySelector('[data-vpage="next"]');
  const paint = ()=>{
    const pc = pageCount();
    if(page>pc) page=pc;
    const rows = pageRows(), n = sortedView().length;
    panel.querySelector('#vBody').innerHTML = rows.length ? rows.map(issueRowHTML).join('') : issueEmpty();
    panel.querySelector('#vCnt').textContent = countText();
    const shown = panel.querySelector('[data-validation-count]');
    if(shown){ shown.textContent = n.toLocaleString(); shown.parentElement.dataset.pchipCount = String(n); }
    csvBtn.hidden = n === 0;
    prevBtn.hidden = nextBtn.hidden = pageSelEl.hidden = pc <= 1;
    prevBtn.disabled = page <= 1;
    nextBtn.disabled = page >= pc;
    pageSelEl.innerHTML = Array.from({length:pc},(_,i)=>`<option value="${i+1}"${i+1===page?' selected':''}>${i+1} / ${pc}</option>`).join('');
  };
  ruleSelEl.onchange = ()=>{ ruleSel = ruleSelEl.value; page = 1; paint(); };
  prevBtn.onclick = ()=>{ page = Math.max(1, page-1); paint(); };
  nextBtn.onclick = ()=>{ page = Math.min(pageCount(), page+1); paint(); };
  pageSelEl.onchange = ()=>{ page = Math.max(1, Math.min(pageCount(), Number(pageSelEl.value)||1)); paint(); };
  const resize = (vTbl && vHead) ? grid.resizer(vTbl, vHead) : null;
  grid.chooser(panel.querySelector('.tool-actions'));
  grid.refresh = ()=>{
    if(vTbl){ const cg=vTbl.querySelector('colgroup'); if(cg) cg.innerHTML=grid.colgroupHTML().replace(/^<colgroup>|<\/colgroup>$/g,''); }
    if(vHead){
      const hcg=vHead.querySelector('colgroup'); if(hcg) hcg.innerHTML=issueFragCols().replace(/^<colgroup>|<\/colgroup>$/g,'');
      const th=vHead.querySelector('thead'); if(th) th.innerHTML=issueHeadRow();
    }
    if(resize) resize.addGrips();
    paint();
  };
  if(vsc) fitToScroller(grid, vsc, ()=>grid.refresh());
  wireSplitHeader(panel, '#vHead', '.vtableWrap');
  wireSort(vHead, issueCols, isort, ()=>{ page=1; paint(); if(resize) resize.addGrips(); }, 'issue_sort', issueHeadRow);
  paint();
  csvBtn.onclick=()=>{
    const rs = sortedView();
    if(!rs.length){ toast('Nothing to export','info'); return; }
    downloadCSV(xp('issue_list')+'.csv', issuesCSV(model, rs));
    toast('CSV downloaded','success');
  };
}
function renderDetail(panel, recs, model, state, rerender){
  const cols = model.contract.fieldOrder;
  state.sort = state.sort || {col:'', dir:1};
  // L2 column model (I-92): Source Tab (not sorted), Active (enum), then contract fields (text).
  const detailCols = [
    {key:'__src', label:'Source Tab', sortable:false},
    {key:'__active', label:'Active', sortable:true, type:'enum', order:['Yes','No']},
    ...cols.map(c=>({key:c, label:c, sortable:true, type:'text'}))
  ];
  const detailGet = (r,key)=> key==='__src' ? r.sourceTab : key==='__active' ? (r.isActive?'Yes':'No') : (r.fields[key]);
  // No in-panel column filters (removed 2026-10-20): the Document Detail Table shows every
  // active document, scoped only by the global Discipline/Stage chips (top bar).
  // restore persisted sort (§7.2.6)
  const sp = getPref('detail_sort','');
  if(/^(-?1)\|/.test(sp)){ const [d,c]=sp.split('|'); if(detailCols.some(x=>x.key===c)) state.sort={col:c, dir:Number(d)}; }
  const detailHeadRow = () => grid.headRow(state.sort);
  // L3 grid (I-95): Source Tab + Document No. pinned (D38), widths, chooser, resize
  const grid = makeGrid('detail', detailCols);
  const detailCell = (c, r) => {
    if(c.key === '__src') return esc(r.sourceTab);
    if(c.key === '__active') return `<span class="${r.isActive?'act':'ina'}">${r.isActive?'Y':'N'}</span>`;
    if(c.key === 'Latest Approval Status'){   // I-80: show the derived approval category, not just the raw code
      const cat = approvalCategory(r);
      const m = {'APP':'p-app','AWC':'p-awc','REJ':'p-rej','NAP':'p-nap','Submitted – Pending Review':'p-pend','Submitted – Status Unavailable':'p-unav','Not Submitted':'p-nsub','Record Error':'p-rerr'};
      const cls = m[cat] || '';
      const label = ['APP','AWC','REJ','NAP'].includes(cat) ? (r.fields['Latest Approval Status']||'') : cat;
      return { html: esc(label), cls };
    }
    const val = r.fields[c.key]; const cls = statusPill(c.key, val); return { html: esc(val), cls };
  };
  const detailRowHTML = r => `<tr>${grid.visible().map(c => {
      const v = detailCell(c, r);
      return grid.td(c, typeof v === 'string' ? v : v.html, typeof v === 'string' ? '' : v.cls);
    }).join('')}</tr>`;
  const detailEmpty = () => `<tr><td class="empty" colspan="${grid.visible().length}">No documents to display.</td></tr>`;
  let rows = recs;
  if(state.sort.col){ rows = dsSorted(rows, detailCols, state.sort, detailGet); }
  const setCnt = () => { const c = panel.querySelector('#dCnt'); if(c) c.textContent = (rows.length<recs.length) ? `${rows.length} of ${recs.length} docs` : `${rows.length} docs`; };
  const paintBody = () => { const tb = panel.querySelector('tbody'); if(tb) tb.innerHTML = rows.length ? rows.map(detailRowHTML).join('') : detailEmpty(); };
  const renderBody = () => { if(win && win.enabled) win.redraw(); else paintBody(); setCnt(); };
  // §7.2.15 — the fragment's header row carries the gutter CELL as well as the gutter column, so the
  // fragment's column count matches its <colgroup> and the navy runs the full card width. aria-hidden:
  // it reserves the scrollbar, it is not a column.
  const detailFragHead = () => detailHeadRow().replace('</tr>', '<th class="ds-gut" aria-hidden="true"></th></tr>');
  // §7.2.15 (4) — ONE column grid: the fragment carries the body's columns plus the .ds-gut gutter.
  const detailFragCols = () => grid.colgroupHTML().replace('</colgroup>', '<col class="ds-gut" style="width:var(--ds-sbw,0px)"></colgroup>');
  panel.innerHTML=`<div class="panel-head"><h2>Document Detail Table</h2>
      <div class="head-actions"><button id="dCsv" class="csv btn btn-secondary" title="Download document list as CSV">⤓ CSV</button><span class="cnt" id="dCnt">${rows.length} docs</span></div></div>
    <div class="splitbox splitcard">`
    + `<div class="vheadwrap"><table class="ds-table vheadtab" id="dHead"><caption class="sr-only">Document Detail Table — column headers.</caption>${detailFragCols()}<thead>${detailFragHead()}</thead></table></div>`
    + `<div class="tableScroll"><table class="ds-table"><caption class="sr-only">Document Detail Table — one row per document: Source Tab and Active identify the record, followed by the ${cols.length} contract fields.</caption>${grid.colgroupHTML()}<tbody>
    ${rows.length?rows.map(detailRowHTML).join(''):detailEmpty()}
    </tbody></table></div>`
    + `</div>`;
  setCnt();
  const sc = panel.querySelector('.tableScroll');
  const dHead = panel.querySelector('#dHead');
  // L3 windowing (I-96): only the visible window is drawn; the count stays the full one
  const win = makeWindow(sc, {
    rowHeight: 40, overscan: 8, total: () => rows.length,
    render: (s, e) => rows.slice(s, e).map(detailRowHTML).join(''),
    full: () => rows.length ? rows.map(detailRowHTML).join('') : detailEmpty()
  });
  // I-116 — the sort buttons now live in the HEADER FRAGMENT, so that is what the handler binds to.
  wireSort(dHead, detailCols, state.sort, ()=>{ rows = dsSorted(rows, detailCols, state.sort, detailGet); renderBody(); }, 'detail_sort', detailFragHead);
  // No in-panel column filters on this panel (removed 2026-10-20); the column-visibility
  // chooser below is the only popover here.
  panel.querySelector('.head-actions');
  // L3 grid (I-95): chooser + resize; grips are re-attached whenever the header is rebuilt
  // I-116 — the header lives in its own table, so the resizer is given BOTH halves: grips attach in
  // the fragment, and every width is written to both colgroups.
  const dResize = grid.resizer(sc.querySelector('table'), dHead);
  grid.chooser(panel.querySelector('.head-actions'));
  grid.refresh = () => {
    const t = sc.querySelector('table');
    const cg = t.querySelector('colgroup'); if(cg) cg.innerHTML = grid.colgroupHTML().replace(/^<colgroup>|<\/colgroup>$/g, '');
    if(dHead){
      const hcg = dHead.querySelector('colgroup'); if(hcg) hcg.innerHTML = detailFragCols().replace(/^<colgroup>|<\/colgroup>$/g, '');
      const th = dHead.querySelector('thead'); if(th) th.innerHTML = detailFragHead();
    }
    dResize.addGrips();
    renderBody();
  };
  // §18 split-header contract (3, 5) — width pin + gutter + horizontal lock-step, shared helper.
  // This is the UNAVOIDABLE case of §7.2.15 invariant 5: 27 columns at a 60 px floor need 1620 px
  // against a 1216 px panel, so the scrollbar stays and lock-step is what the invariant requires.
  wireSplitHeader(panel, '#dHead', '.tableScroll');
  // §7.2.10 — export parity: the CSV MUST read the same sorted array the renderer used
  panel.querySelector('#dCsv').onclick=()=>{ if(!rows.length){ toast('Nothing to export','info'); return; } downloadCSV(xp('document_list')+'.csv', docsCSV(model, rows)); toast('CSV downloaded','success'); };
}
function statusPill(field, val){
  if(field==='Latest Approval Status'){ return ({APP:'p-app',AWC:'p-awc',REJ:'p-rej',NAP:'p-nap'})[val]||''; }
  if(field==='Submission Status'){ return ({SUR:'p-sur',RTR:'p-rtr',NTS:'p-nts'})[val]||''; }
  return '';
}

// ---------- CSV ----------
function csvCell(v){ const s=v==null?'':String(v); return /[",\n]/.test(s)?'"'+s.replace(/"/g,'""')+'"':s; }
function issuesCSV(model, issues){ const head=['Error Code','Severity','Doc No','Field','Value','Message','Source Tab','Row'];
  const lines=[head.join(',')]; issues.forEach(i=>lines.push([i.code,i.severity,i.docNo,i.field,i.value,i.message,i.sourceTab,i.rownum].map(csvCell).join(','))); return lines.join('\n'); }
function docsCSV(model, recs){ const cols=model.contract.fieldOrder; const head=['Source Tab','Active',...cols];
  const lines=[head.join(',')]; recs.forEach(r=>lines.push([r.sourceTab,r.isActive?1:0,...cols.map(c=>r.fields[c])].map(csvCell).join(','))); return lines.join('\n'); }
function downloadCSV(name, text){ const b=new Blob(['\uFEFF'+text],{type:'text/csv;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=name; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
const projPrefix = () => { const m=MODEL&&MODEL.meta; const t=(m&&m.projectTitle)||((MODEL&&MODEL.contract&&MODEL.contract.lookups&&MODEL.contract.lookups.projectCode&&MODEL.contract.lookups.projectCode.codes[0])||'MDL'); return slugify(t); };
const xp = b => projPrefix() + '_' + slugify(b) + '_' + localDateISO();

// ---------- boot / welcome ----------
export function boot(root){
  let pending = null;
  applyShellPrefs(); // I-166 / common C-08 fix T1 — read the saved theme before the welcome page paints,
                      // so it doesn't always show light. DOM lookups inside applyShellPrefs() for shell
                      // controls (#themeSel etc.) are guarded with `if(el)` and simply no-op pre-load.
  if (WELCOME_CONFIG.themePicker) WELCOME_CONFIG.themePicker.current = document.body.dataset.theme || 'light';
  const welcome = CommonWelcome.render(root, WELCOME_CONFIG, {
    inspect: async file => {
      try {
        const wb = await readXlsx(await file.arrayBuffer());
        const codeSheet = wb.sheets['Code'] || { rows: [] };
        const meta = parseCodeSheet(codeSheet).meta;
        const dashboardTitle = meta['Dashboard Title'] == null ? '' : String(meta['Dashboard Title']);
        const projectTitle = meta['Project Title'] == null ? '' : String(meta['Project Title']);
        const want = WELCOME_CONFIG.files[0].dashboardTitle;
        if (dashboardTitle !== want) {
          return { ok: false, dashboardTitle, projectTitle,
            reason: `The Dashboard Title is "${dashboardTitle || 'blank'}". Expected "${want}".` };
        }
        pending = wb;
        return { ok: true, dashboardTitle, projectTitle };
      } catch (err) {
        return { ok: false, reason: `"${file.name}" could not be read as an Excel workbook. ${err?.message || ''}` };
      }
    },
    load: async (filesByKey, report) => {
      report(0);
      await new Promise(r => setTimeout(r, 0));
      const file = filesByKey[WELCOME_CONFIG.files[0].key];
      const wb = pending || await readXlsx(await file.arrayBuffer());
      report(1);
      await new Promise(r => setTimeout(r, 0));
      const model = buildModel(wb, { workbookName: file.name });
      report(2);
      await new Promise(r => setTimeout(r, 0));
      pending = null;
      // I-165 — return the opener; CommonWelcome calls it after the success hold (spec §3.7.7 rev 1.110).
      return () => renderDashboard(root, model);
    },
    onHelp: () => openHelp('welcome'),
    onThemeChange: key => { setPref('theme', key); applyShellPrefs(); },
    onStatus: (level, message) => {
      if (level === 'error') console.error(message);
      else if (level === 'warning') console.warn(message);
    },
  });
  // Expose for harness-layout Tier 3 and Tier 7 injection (§3.8.5) — never called in normal browser use.
  if (typeof window !== 'undefined') window._loadFile = f => welcome.accept([f]);
}
