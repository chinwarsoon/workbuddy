// render.mjs — DOM rendering + filters + export for the MDL dashboard (browser).
// Uses pipeline.buildModel + xlsx-reader.readXlsx. No external dependencies.
import { readXlsx } from './xlsx-reader.mjs';
import { buildModel, EXCLUDE_STAGES, approvalCategory } from './pipeline.mjs';

const COLORS = { blue:'#1E88E5', green:'#2E7D32', amber:'#F9A825', red:'#C62828', slate:'#64748B', navy:'#0F2D52', grey:'#B8C2CC', blueGrey:'#78909C', purple:'#8E24AA' };
const PALETTE = ['#1E88E5','#2E7D32','#F9A825','#C62828','#64748B','#7E57C2','#26A69A','#EC407A','#8D6E63','#42A5F5','#9CCC65','#FF7043'];
const F = 'font-family="\'Segoe UI\', system-ui, -apple-system, \'Inter\', \'Source Sans Pro\', Roboto, Helvetica, Arial, sans-serif"';
const esc = s => (s == null ? '' : String(s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const LOGO_DATA = '__LOGO_DATA__'; // replaced with an embedded base64 data-URI at build time
const isoStrToDate = iso => { if(!iso) return null; const d = new Date(iso + 'T00:00:00Z'); return isNaN(d) ? null : d; };
function wdBetween(d1, d2){ if(!d1||!d2) return null; let s=1; if(d2<d1){[d1,d2]=[d2,d1];s=-1;} let c=0,cur=new Date(d1.getTime()); while(cur<=d2){ const day=cur.getUTCDay(); if(day!==0&&day!==6)c++; cur.setUTCDate(cur.getUTCDate()+1);} return s*c; }

const CSS = `
:root{--navy:#0F2D52;--blue:#1E88E5;--green:#2E7D32;--amber:#F9A825;--red:#C62828;--slate:#64748B;--bg:#F6F8FA;--surface:#FFFFFF;--border:#D9E1E8;--text:#1F2A37;--muted:#64748B;--card:#FFFFFF;--line:#D9E1E8;--ink:#0F2D52;--accent:#1E88E5;--accent2:#2E7D32;--warn:#F9A825;--bad:#C62828;--soft:#E8F1FD;--shadow:0 1px 2px rgba(15,45,82,.04);--radius:10px;--font:'Segoe UI',system-ui,-apple-system,'Inter','Source Sans Pro',Roboto,Helvetica,Arial,sans-serif;--warn-bg:#FFF4D6;--warn-border:#F0D38A;--warn-fg:#9a6b00;--warn-fg-strong:#9a6b00;--error-bg:#FDE8E8;--error-fg:#C62828;--ok-bg:#E6F4EA;--ok-fg:#2E7D32;--accent-soft-border:#BFD8F2;--accent-ink:#1E88E5;--grid:#EDF1F5}
*{box-sizing:border-box}
body{margin:0;font-family:var(--font);background:var(--bg);color:var(--text);font-size:13px;line-height:1.45;-webkit-font-smoothing:antialiased}
header.app{display:flex;flex-direction:column;position:sticky;top:0;z-index:31;padding:0}
header.app .app-top{display:flex;justify-content:space-between;align-items:center;gap:12px;width:100%;background:var(--navy);color:#fff;padding:10px 20px}
header.app .app-menu{display:flex;align-items:center;justify-content:space-between;gap:12px;width:100%;background:#fff;color:var(--text);padding:8px 20px}
header.app .app-menu .actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
header.app .app-menu .filter-group{display:flex;align-items:center;gap:8px;flex-shrink:0}
/* menu controls are borderless (spec §3.1 / §7.1): highlight on hover only, no icons */
header.app .app-menu .btn{border:0;background:transparent}
header.app .app-menu .btn:hover{background:var(--soft)}
/* Primary CTA must keep its solid fill despite the borderless rule above (spec §3.1 / §7.1).
   Without this, background:transparent out-specifies .btn-primary, leaving white text on white. */
header.app .app-menu .btn-primary{background:var(--blue);color:#fff}
header.app .app-menu .btn-primary:hover{background:#0f56a8}
/* Pressed/toggle state (e.g. the Warnings button when the bar is collapsed) must keep its fill.
   Without this, the .app-menu .btn background:transparent rule overrides .btn[aria-pressed=true], leaving
   white text on the white menu bar — the same white-on-white regression as the primary CTA (I-105/I-106). */
header.app .app-menu .btn[aria-pressed="true"]{background:var(--navy);color:#fff;border-color:var(--navy)}
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
header.app .logo{height:36px;width:auto;border-radius:6px;background:#fff;padding:3px;box-shadow:0 1px 3px rgba(0,0,0,.2);flex-shrink:0}
header.app .ttl-stack{display:flex;flex-direction:column;gap:2px;min-width:0}
header.app h1.ttl{font-size:17px;margin:0;font-weight:600;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
header.app .ttl-stack .sub{font-size:12px;font-weight:500;color:rgba(255,255,255,.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
header.app .meta{font-size:11px;opacity:.85}
header.app .actions{display:flex;align-items:center;gap:8px;flex-shrink:0}
.welcome-screen{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
.welcome{max-width:480px;width:100%;margin:0;text-align:center;background:var(--card);border:1px solid var(--line);border-radius:24px;box-shadow:var(--shadow);padding:48px 48px;line-height:1.45}
.welcome .wlogo{height:52px;width:auto;margin:0 auto 18px;display:block}
.welcome h1{margin:0 0 8px;font-size:25px;font-weight:700;letter-spacing:-.02em}
.welcome .sub{color:var(--muted);font-size:14px;margin:0 0 26px}
.welcome .expect{background:var(--soft);border:1px solid var(--accent-soft-border);border-radius:12px;padding:12px 16px;font-size:12px;color:var(--accent-ink);margin:0 0 20px;text-align:left}
.welcome .expect b{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--blue);margin-bottom:3px}
.welcome .drop{border:1.5px dashed var(--line);border-radius:16px;padding:24px 16px;margin-bottom:22px;cursor:pointer;transition:.2s;text-align:center}
.welcome .drop.hover{border-color:var(--accent);background:var(--soft)}
.welcome .drop .d-title{font-weight:600;font-size:14px;color:var(--text);margin-bottom:4px}
.welcome .drop .d-sub{font-size:12px;color:var(--muted);margin-bottom:0}
.welcome .drop .err{color:var(--red);font-size:12px;margin-top:10px}
.welcome .privacy{font-size:11.5px;color:var(--muted);margin-top:18px;display:flex;gap:6px;align-items:center;justify-content:center}
.welcome .privacy svg{width:13px;height:13px;fill:var(--muted)}
.welcome .btn{font-size:14px;padding:12px 22px;min-height:0;line-height:1.45}
.welcome .copyright{font-size:11.5px;color:var(--muted);margin-top:6px}
.sys-banner-item{padding:9px 20px;border-bottom:1px solid rgba(0,0,0,.10);font-size:12px;line-height:1.4}
.sys-banner-item:last-child{border-bottom:none}
.sys-banner-item.warn{background:var(--amber);color:#5a3d00}
.sys-banner-item.fatal{background:var(--red);color:#fff}
.sys-banner-item.info{background:#e8eef5;color:#33526b}
.sys-banner-item b{font-weight:700;margin-right:4px}
/* fixed top warning bar (PPP standard, spec §3.5) — unified with load failures */
#errBanner{display:block;position:fixed;left:0;right:0;z-index:30;font-size:12px;line-height:1.4;box-shadow:0 2px 10px rgba(0,0,0,.18)}#errBanner[hidden]{display:none}
body.banner-open .wrap{padding-top:calc(16px + var(--banner-h,0px))}
.wrap{max-width:1320px;margin:0 auto;padding:16px;padding-bottom:52px}
.status-bar{position:fixed;left:0;right:0;bottom:0;z-index:40;display:flex;align-items:center;gap:8px;padding:6px 14px;background:var(--navy);color:#E8EDF3;font-size:12px;user-select:none;overflow:hidden;border-top:1px solid rgba(255,255,255,.14)}
.status-bar .sb-panel{display:inline-flex;align-items:center;gap:6px;padding:3px 9px;border:1px solid rgba(255,255,255,.20);border-radius:6px;white-space:nowrap}
.status-bar .sb-panel b{font-weight:700;opacity:.92}
.status-bar .sb-dot{width:8px;height:8px;border-radius:50%;background:#37d67a;flex:none}
.status-bar .sb-file{max-width:240px;overflow:hidden;text-overflow:ellipsis}
.status-bar .sb-bar{width:54px;height:6px;border-radius:3px;background:rgba(255,255,255,.22);overflow:hidden;flex:none}
.status-bar .sb-bar i{display:block;height:100%;background:#37d67a}
@media print{.status-bar{display:none}}
.panel{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:14px 14px 26px;margin:14px 0;box-shadow:0 1px 2px rgba(15,45,82,.04);position:relative}
.panel[data-panel]::after{content:"Panel " attr(data-panel);position:absolute;right:10px;bottom:8px;font-size:10px;letter-spacing:.04em;color:var(--muted);pointer-events:none}
.panel.panel-flat{border:0;background:transparent;box-shadow:none}
.panel h2{font-size:13px;margin:0 0 10px;color:var(--navy);text-transform:uppercase;letter-spacing:.04em;display:flex;justify-content:space-between}

.kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px}
.kpi{background:var(--surface);border:1px solid var(--border);border-top:3px solid var(--blue);border-radius:8px;padding:10px}
.kpi .v{font-size:22px;font-weight:700;color:var(--navy)} .kpi .l{font-size:10px;color:var(--muted);text-transform:uppercase;margin-top:2px}
.kpi.warn{border-top-color:var(--red)} .kpi.ok{border-top-color:var(--green)} .kpi.amb{border-top-color:var(--amber)}
.kpi.muted{border-top-color:var(--slate)} .kpi.err{border-top-color:#8E24AA}
.subkpis{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:10px}
.subkpi{background:var(--bg);border:1px solid var(--border);border-radius:8px;padding:8px 10px}
.subkpi .v{font-size:16px;font-weight:700;color:var(--navy)} .subkpi .l{font-size:10px;color:var(--muted)}
.toolbar{display:flex;gap:8px;align-items:center;margin-bottom:6px;flex-wrap:wrap}
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
.help-modal .box{background:#fff;border:1px solid var(--border);border-radius:12px;max-width:680px;width:100%;max-height:84vh;display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,.25)}
.help-modal .box header{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border)}
.help-modal .box header h3{margin:0;font-size:15px;color:var(--navy)}
/* A4: the modal close is a plain .icon-btn — 26 px square, no size/padding override (spec §7.1). */
.help-modal .box .body{overflow:auto;padding:16px 18px;font-size:13px;line-height:1.55;color:#22303f}
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
.btn-primary{background:var(--blue);color:#fff;border-color:var(--blue)}
.btn-primary:hover{background:#1565c0;border-color:#1565c0}
.btn-secondary{background:#fff;color:var(--navy);border-color:var(--border)}
.btn-secondary:hover{background:var(--blue);color:#fff;border-color:var(--blue)}
.btn-active{background:var(--navy);color:#fff;border-color:var(--navy)}
.btn-active:hover{background:#0b2240;border-color:#0b2240}
.btn .badge{background:#e0533d;color:#fff;border-radius:999px;padding:0 6px;font-size:11px;font-weight:700;min-width:16px;text-align:center;line-height:1.5}
.btn[aria-pressed="true"]{background:var(--navy);color:#fff;border-color:var(--navy)}
.app-menu .warn-toggle{margin-left:6px}
.seg{display:inline-flex;border:1px solid var(--border);border-radius:6px;overflow:hidden}
.seg button{border:0;background:#fff;color:var(--navy);padding:7px 14px;min-height:32px;font-size:12px;font-weight:600;cursor:pointer;border-right:1px solid var(--border);text-transform:none;letter-spacing:0}
.seg button:last-child{border-right:0}
.seg button.on{background:var(--navy);color:#fff}
.seg button:hover:not(.on){background:var(--blue);color:#fff}
.tf-wrap{position:relative;flex-shrink:0}
.tf-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:6px;background:#fff;color:var(--navy);padding:7px 12px;min-height:32px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap}
.tf-btn:hover{background:var(--soft)}
.tf-btn[aria-expanded="true"]{border-color:var(--accent);background:var(--soft)}
.tf-btn.is-filtered{border-color:var(--accent);color:var(--accent);background:#fff}
.tf-btn .tf-cnt{font-size:10px;background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:1px 6px;border-radius:10px;font-weight:600}
.tf-btn.is-filtered .tf-cnt{background:var(--soft);border-color:var(--accent-soft-border);color:var(--accent-ink)}
.tf-panel{position:absolute;top:calc(100% + 6px);right:0;z-index:40;background:#fff;border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow);min-width:220px;max-width:min(340px,90vw);max-height:320px;overflow:auto;padding:10px;color:var(--text)}
.tf-panel[hidden]{display:none}
.search{display:flex;align-items:center;gap:0;background:var(--surface);border:1px solid var(--border);border-radius:6px;min-height:28px;padding:0;flex:0 0 auto;width:320px;max-width:42vw}
.search:focus-within{border-color:var(--accent);box-shadow:0 0 0 2px var(--soft)}
select.inter-sel.is-attached{border:0;border-right:1px solid var(--border);background:var(--bg);color:var(--ink);font:inherit;font-weight:600;font-size:12px;border-radius:6px 0 0 6px;height:26px;padding:0 8px;cursor:pointer}
.search-input{border:0;background:transparent;color:var(--text);font:inherit;font-size:12px;flex:1 1 220px;min-width:0;height:26px;outline:none}
.search-input::placeholder{color:var(--muted)}
.search-btn{background:var(--accent);color:#fff;border:0;border-radius:0 6px 6px 0;min-height:28px;padding:0 12px;cursor:pointer;font-size:13px;line-height:1}
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
.icon-btn{display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;min-height:26px;padding:0;font:inherit;font-size:13px;font-weight:600;line-height:1;border:1px solid var(--line);border-radius:6px;background:#fff;color:var(--muted);cursor:pointer;transition:background .15s,border-color .15s,color .15s}
.icon-btn:hover{background:var(--soft);color:var(--navy);border-color:var(--line)}
.sc-win .msg{font-size:12px;color:var(--muted);margin-left:auto;white-space:nowrap}
/* Toast (spec §7.10) — fixed, centred, above the status bar (z-index 45) */
#toast{position:fixed;left:50%;bottom:52px;transform:translateX(-50%);display:flex;flex-direction:column;gap:8px;align-items:center;z-index:45;pointer-events:none;max-width:min(92vw,440px)}
.toast{pointer-events:auto;display:flex;align-items:center;gap:8px;min-width:180px;max-width:440px;padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.3;color:#fff;background:var(--navy);box-shadow:0 6px 20px rgba(15,45,82,.28);opacity:0;transform:translateY(12px);transition:opacity .2s ease,transform .2s ease;cursor:pointer}
.toast.show{opacity:1;transform:translateY(0)}
.toast .ti{flex:none;font-size:14px;line-height:1;font-weight:700}
.toast .tt{overflow:hidden;text-overflow:ellipsis}
.toast-success{background:var(--green)}
.toast-info{background:var(--blue)}
.toast-warning{background:var(--amber);color:#3a2a00}
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
.filters .grp{border:1px solid var(--border);border-radius:8px;padding:6px 10px;background:#fff}
.filters .lbl{font-size:10px;color:var(--muted);text-transform:uppercase;display:block;margin-bottom:4px}

.chips{display:flex;flex-wrap:wrap;gap:4px;max-width:420px;max-height:130px;overflow:auto;padding-right:4px}
.chips label{font-size:11px;display:inline-flex;align-items:center;gap:3px;background:var(--bg);border:1px solid var(--border);padding:2px 6px;border-radius:12px;cursor:pointer}
.filters .grp-head{display:flex;align-items:center;justify-content:space-between;gap:8px}
.filters .grp-head .lbl{margin-bottom:0}
.filters .grp-actions{display:inline-flex;align-items:center;gap:6px}
.filters .badge{font-size:10px;background:var(--bg);border:1px solid var(--border);color:var(--muted);padding:1px 6px;border-radius:10px;font-weight:600}
.filters-help{font-size:11px;color:#7A8A99;margin:0 0 8px}
.zone-label{font-size:10px;font-weight:700;color:#9AA7B4;letter-spacing:1px;text-transform:uppercase;margin:6px 0 6px}
.filters-cats{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:12px}
.filters-utils{display:flex;flex-wrap:wrap;gap:12px;align-items:center}
.filters-utils .grp.util:first-child{flex:1 1 420px;max-width:none}
.filters-utils .grp.util.actions{margin-left:auto}
.filters-utils .grp.util{border:none;background:transparent;padding:0}
.filters #fSearch{width:100%;max-width:560px;margin-top:4px}
.filters .grp.active{border-color:#E0A100;box-shadow:inset 4px 0 0 #E0A100}
.filters .grp.active .badge{background:#FFF4D6;border-color:#E0A100;color:#9a6b00}
.filtered-note{font-size:9px;color:#9A6B00;margin-top:6px}
table{width:100%;border-collapse:collapse;font-size:12px}
th,td{border-bottom:1px solid var(--border);padding:9px 10px;text-align:left}
th{background:var(--navy);color:#fff;font-weight:600;position:sticky;top:0;cursor:pointer;user-select:none}
tbody tr:nth-child(even){background:var(--bg)}
tbody tr:hover{background:var(--soft)}
td.num,th.num{text-align:right;font-variant-numeric:tabular-nums}
.ds-table .over{background:var(--warn-bg)}
.pill{padding:1px 7px;border-radius:999px;font-size:10px;font-weight:600}
.p-app{background:var(--ok-bg);color:var(--ok-fg)} .p-awc{background:var(--warn-bg);color:var(--warn-fg)}
.p-rej{background:var(--error-bg);color:var(--error-fg)} .p-nap{background:var(--grid);color:var(--slate)}
.p-sur{background:var(--soft);color:var(--accent-ink)} .p-rtr{background:#FFF0E0;color:#b5651d}
.p-nts{background:var(--ok-bg);color:var(--ok-fg)}
.p-pend{background:#E3F2FD;color:#0D47A1} .p-unav{background:#ECEFF1;color:#546E7A}
.p-nsub{background:#E8EEF1;color:#37474F} .p-rerr{background:#F3E5F5;color:#6A1B9A}
/* §7.2.4 — a severity is a FIXED-SIZE inline SVG on an inner <span>, never a class on the
   <td> (a non-table-cell display value takes the cell out of table formatting, RC-1) and
   never an emoji (per-glyph font metrics make the Sev row taller than its neighbours, RC-4).
   The chip inherits the cell font; only the glyph is sized in px (see .sev-svg). */
.ds-table .sev-error,.ds-table .sev-warning,.ds-table .sev-info{
  display:inline-flex;align-items:center;vertical-align:middle;white-space:nowrap;
  font-size:inherit;line-height:inherit}
.act{color:var(--ok-fg);font-weight:700} .ina{color:var(--slate)}
/* Validation-panel severity summary chips — PPP shape (spec §4.5 overrides §7.10's 999px pill) */
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
.vrefhead{padding:6px 10px;font-size:12px;font-weight:600;color:#fff;background:var(--navy);border-bottom:1px solid var(--ds-head-rule)}
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
.ds-table{width:100%;border-collapse:collapse;font-size:12px;background:#fff;table-layout:fixed}
.ds-table th,.ds-table td{border-bottom:1px solid var(--border);padding:9px 10px;text-align:left;vertical-align:top}
.ds-table thead th{background:var(--navy);color:#fff;font-size:12px;font-weight:600}
.ds-table th[scope="row"]{font-weight:400}
.ds-table .num{text-align:right;font-variant-numeric:tabular-nums}
.ds-table tbody tr:nth-child(even){background:#F9FBFD}
.ds-table tbody tr:hover{background:var(--soft)}
.ds-table .over{background:var(--warn-bg)}
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
.ds-table thead th .sort-btn:focus-visible{outline:2px solid #2b6cb0;outline-offset:1px;border-radius:2px}
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
.note{background:#FFF8E1;border:1px solid var(--amber);color:#7a5b00;padding:8px 12px;border-radius:8px;font-size:12px;margin:10px 0}
.disclaimer{margin-top:18px;padding-top:10px;border-top:1px solid var(--border);text-align:center;font-size:11.5px;color:var(--muted)}
.panel-error{background:var(--error-bg);border:1px solid var(--error-fg);color:var(--error-fg);padding:12px 14px;border-radius:8px;font-size:12px;margin:8px 0;line-height:1.5}
.pe-detail{display:block;margin-top:6px;font-size:11px;opacity:.85}
.sb-dot-err{background:var(--red)}
.sb-err{border-color:var(--error-fg)}
.expand{cursor:pointer;color:var(--blue);font-size:10px;white-space:nowrap;user-select:none;border:0;background:transparent;padding:0;font-family:inherit}
.expand.open{color:var(--navy);font-weight:600}

.matrix{width:100%;border-collapse:collapse;font-size:12px;background:#fff}
.matrix th,.matrix td{border-bottom:1px solid var(--border);padding:4px 8px;text-align:center;white-space:nowrap}
.matrix th:first-child,.matrix td:first-child{text-align:left}
.matrix thead tr.group th{background:var(--navy);color:#fff;font-weight:700}
.matrix thead tr.group th.tint{background:#FFF9C4;color:#7a5b12}
.matrix th.tint{background:#FFF9C4;color:#7a5b12}
.matrix td.col-tint{background:#FFF9C4}
.matrix tfoot td{background:var(--bg);font-weight:700;border-top:2px solid var(--navy)}
.matrix tbody tr:nth-child(even){background:#fafcff}
.matrix tbody tr.sub{background:#F2F6FB}
.matrix tbody tr.sub td.subname{text-align:left;padding-left:22px;color:var(--muted);font-style:italic}
.matrix td.noexp{color:#c2ccd6;text-align:center}
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

.tableScroll thead th{position:sticky;top:0;z-index:2;box-shadow:0 1px 0 var(--border)}
/* === L3 grid (I-95, spec §7.2.13 / §7.2.14) — pinned columns ===
   z-index ladder (§7.2.13): plain td (auto) < pinned td (1) < sticky header th (2) <
   pinned header th (4) < resize grip (5). The pinned cell carries an OPAQUE background
   and re-declares the zebra / hover colours, otherwise scrolled content shows through. */
.ds-table td.ds-pinned{position:sticky;background:#fff}
/* Pinned HEADER cells must keep the navy header fill, not a white one — otherwise the
   inherited white header text (th{color:#fff}) becomes white-on-white (MDL I-105). */
.ds-table th.ds-pinned{position:sticky;background:var(--navy)}
.ds-table td.ds-pinned{z-index:1}
.ds-table thead th.ds-pinned{z-index:4}
.ds-table td.ds-pinned{box-shadow:1px 0 0 var(--border)}
.ds-table td.ds-pinned-edge{box-shadow:1px 0 0 var(--border),4px 0 10px -4px rgba(15,30,50,.28)}
.ds-table tbody tr:nth-child(even) td.ds-pinned{background:#F9FBFD}
.ds-table tbody tr:hover td.ds-pinned{background:var(--soft)}
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
.cc-btn{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--border);border-radius:6px;background:#fff;color:var(--navy);padding:7px 12px;min-height:32px;font-size:12px;font-weight:600;cursor:pointer;white-space:nowrap}
.cc-btn:hover{background:var(--soft)}
.cc-panel{position:absolute;top:calc(100% + 6px);right:0;z-index:40;background:#fff;border:1px solid var(--border);border-radius:8px;box-shadow:var(--shadow);min-width:260px;max-width:min(420px,92vw);max-height:380px;overflow:auto;padding:10px}
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
/* §7.2.11 — a bounded scroller capped at 340 px would print every long table as a clipping */
@media print{body{background:#fff}.tableScroll{max-height:none!important;overflow:visible!important}.panel{break-inside:avoid;box-shadow:none}.filters,.toolbar{display:none}header.app{position:static}header.app .app-menu{display:none!important}#errBanner{display:none!important}body.banner-open .wrap{padding-top:16px}.panel.collapsed .panel-body{display:block}}
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
  s+=`<text x="0" y="16" ${F} font-size="12" font-weight="bold" fill="${COLORS.navy}">${esc(title)}</text>`;
  data.forEach((d,i)=>{ const y=top+i*rowH, by=y+(rowH-bh)/2, c=d.color||COLORS.blue;
    s+=`<text x="0" y="${(by+10).toFixed(1)}" ${F} font-size="11" fill="${COLORS.slate}">${esc(d.name)}</text>`;
    s+=`<rect x="${trackX}" y="${by.toFixed(1)}" width="${trackW}" height="${bh}" rx="2" fill="#F6F8FA"/>`;
    s+=`<rect x="${trackX}" y="${by.toFixed(1)}" width="${(d.value/max)*trackW}" height="${bh}" rx="2" fill="${c}"/>`;
    s+=`<text x="${W-2}" y="${(by+10).toFixed(1)}" text-anchor="end" ${F} font-size="11" font-weight="bold" fill="${COLORS.navy}">${d.value}</text>`;
  });
  s+=`</svg>`; return s;
}
function pieSVG(title, data){
  const total = Math.max(1, data.reduce((a,b)=>a+b.value,0));
  const cx=150, cy=172, r=112, W=560, H=300;                 // H=300 matches the bar chart's common plot height
  let a0=-Math.PI/2; let s=`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">`;
  s+=`<text x="0" y="16" ${F} font-size="12" font-weight="bold" fill="${COLORS.navy}">${esc(title)}</text>`;
  data.forEach(d=>{ const a1=a0+(d.value/total)*2*Math.PI, c=d.color||COLORS.blue;
    const x0=cx+r*Math.cos(a0),y0=cy+r*Math.sin(a0),x1=cx+r*Math.cos(a1),y1=cy+r*Math.sin(a1),lg=(a1-a0)>Math.PI?1:0;
    s+=`<path d="M${cx},${cy} L${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${lg} 1 ${x1.toFixed(2)},${y1.toFixed(2)} Z" fill="${c}"/>`; a0=a1; });
  let ly=60; data.forEach(d=>{ s+=`<rect x="330" y="${ly-9}" width="10" height="10" rx="2" fill="${d.color||COLORS.blue}"/>`;
    s+=`<text x="346" y="${ly}" ${F} font-size="11" fill="${COLORS.slate}">${esc(d.name)} ${d.value}</text>`; ly+=20; });
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
function combinedProgressSVG(p, from, to){
  const FF='font-family="\'Segoe UI\', system-ui, -apple-system, \'Inter\', \'Source Sans Pro\', Roboto, Helvetica, Arial, sans-serif"';
  const idx=[]; for(let i=from;i<=to;i++) idx.push(i);
  const m=idx.length, H=380, T=16, B=64, padL=46, nb=3;
  const barsVisible = curveShowBars!==false;
  // I-86: each series stops at its last real date; cumulative Actual runs through today.
  const lastValueIdx = k => { const a=p[k]||[]; let l=-1; for(let i=0;i<a.length;i++) if((a[i]||0)>0) l=i; return l; };
  const lastChangeIdx = k => { const a=p[k]||[]; let l=-1; for(let i=0;i<a.length;i++){ const prev=i>0?(a[i-1]||0):0; if((a[i]||0)!==prev) l=i; } return l; };
  const asof=(typeof p.asofIdx==='number')?p.asofIdx:-1;
  const cut={ pNew:lastValueIdx('pNew'), fNew:lastValueIdx('fNew'), aNew:lastValueIdx('aNew'),
              pCum:lastChangeIdx('pCum'), fCum:lastChangeIdx('fCum'), aCum:Math.max(lastChangeIdx('aCum'),asof) };
  const vis = k => idx.filter(i => i>=0 && i<=cut[k]);
  let maxCum=1, maxBar=0;
  ['pCum','fCum','aCum'].forEach(k=>{ vis(k).forEach(i=>{ const v=p[k][i]||0; if(v>maxCum) maxCum=v; }); });
  ['pNew','fNew','aNew'].forEach(k=>{ vis(k).forEach(i=>{ const v=p[k][i]||0; if(v>maxBar) maxBar=v; }); });
  const mode=scurveAxisMode({maxCum,maxBar,barsVisible,current:curveLastScaleMode}); curveLastScaleMode=mode;
  const padR=(mode==='dual')?52:18;
  const W=Math.max(440, m*64+padL+padR), pw=W-padL-padR, ph=H-T-B;   // I-85: width scales with month count
  const maxY=Math.max(1,maxCum,(mode==='dual'?0:maxBar)), maxBarY=Math.max(1,maxBar);
  const gw=pw/m, bw=Math.min(18,(gw*0.62)/nb);                        // I-86: PPP bar geometry
  const Xc=i=> padL+gw*idx.indexOf(i)+gw/2;
  const Y =v=> T+ph-(v/maxY)*ph;
  const Yb=v=> T+ph-((mode==='dual'? v/maxBarY : v/maxY))*ph;
  let g='';
  for(let i=0;i<5;i++){ const v=Math.round(maxY*i/4), y=Y(v);          // I-86: 5 gridlines, 13 px
    g+=`<line x1="${padL}" y1="${y}" x2="${padL+pw}" y2="${y}" stroke="#EAEFF5" stroke-width="1"/><text x="${padL-6}" y="${y+4}" text-anchor="end" ${FF} font-size="13" fill="#6b7785">${v}</text>`; }
  g+=`<text x="${padL-6}" y="${T-4}" text-anchor="end" ${FF} font-size="13" fill="#6b7785">Docs</text>`;
  if(mode==='dual'){
    for(let i=0;i<5;i++){ const v=Math.round(maxBarY*i/4), y=Yb(v);
      g+=`<text x="${padL+pw+6}" y="${y+4}" text-anchor="start" ${FF} font-size="13" fill="#6b7785">${v}</text>`; }
    g+=`<text x="${padL+pw+6}" y="${T-4}" text-anchor="start" ${FF} font-size="13" fill="#6b7785">per mo</text>`;
    g+=`<line x1="${padL+pw}" y1="${T}" x2="${padL+pw}" y2="${T+ph}" stroke="#C9D4E0" stroke-width="1"/>`;
  }
  if(barsVisible) idx.forEach(i=>{ const xc=Xc(i);
    [['pNew',COLORS.blue,'Planned'],['fNew',COLORS.amber,'Forecast'],['aNew',COLORS.green,'Actual']].forEach(([k,c,lab],bi)=>{
      if(i>cut[k]) return; const v=p[k][i]||0; if(v<=0) return;
      const x=xc-bw*1.5+bi*bw, y=Yb(v), h=T+ph-y;
      g+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${(bw-1.5).toFixed(1)}" height="${h.toFixed(1)}" rx="2" fill="${c}" opacity="0.55"><title>${lab} ${monthLabel(p.months[i])}: ${v}</title></rect>`;
      /* I-88: the value above each bar is printed VERTICALLY (rotate -90°, reads bottom-to-top).
         Horizontal digits collide as soon as the bars get close together; a rotated label keeps a
         fixed ~12 px footprint no matter how many digits the count has. */
      if(bw>=9){ const tx=(x+(bw-1.5)/2+4).toFixed(1), ty=(y-3).toFixed(1);
        g+=`<text x="${tx}" y="${ty}" text-anchor="start" transform="rotate(-90 ${tx} ${ty})" ${FF} font-size="12" fill="#2b3440">${v}</text>`; }
    }); });
  [['pCum',COLORS.blue,'6,3','Cum. Plan'],['fCum',COLORS.amber,'2,2','Cum. Forecast'],['aCum',COLORS.green,'','Cum. Actual']].forEach(([k,c,dash,lab])=>{
    const pts=vis(k); if(!pts.length) return;                          // I-86: PPP dash + 2.5 weight + round caps
    g+=`<polyline fill="none" stroke="${c}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''} points="${pts.map(i=>`${Xc(i).toFixed(1)},${Y(p[k][i]||0).toFixed(1)}`).join(' ')}"/>`;
    // I-88: nodes are SOLID dots filled with the series colour (PPP #poChart) — never hollow rings.
    pts.forEach(i=>{ const v=p[k][i]||0; g+=`<circle cx="${Xc(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3" fill="${c}"><title>${lab} ${monthLabel(p.months[i])}: ${v}</title></circle>`; });
  });
  g+=`<line x1="${padL}" y1="${T+ph}" x2="${padL+pw}" y2="${T+ph}" stroke="#C9D4E0" stroke-width="1"/><line x1="${padL}" y1="${T}" x2="${padL}" y2="${T+ph}" stroke="#C9D4E0" stroke-width="1"/>`;
  // I-88: month axis uses the shared `MMM YYYY` template (e.g. "Mar 2026") — never a raw "26-03" slice.
  idx.forEach(i=>{ g+=`<text x="${Xc(i).toFixed(1)}" y="${T+ph+16}" text-anchor="middle" ${FF} font-size="13" fill="#6b7785">${monthLabel(p.months[i])}</text>`; });
  if(typeof p.projStartIdx==='number' && p.projStartIdx>=from && p.projStartIdx<=to){ const x=Xc(p.projStartIdx);
    g+=`<line x1="${x.toFixed(1)}" y1="${T}" x2="${x.toFixed(1)}" y2="${T+ph}" stroke="#C62828" stroke-width="1.5" stroke-dasharray="5,3"/><text x="${x.toFixed(1)}" y="${T-4}" text-anchor="middle" ${FF} font-size="13" fill="#C62828">Start</text>`; }
  if(typeof p.asofIdx==='number' && p.asofIdx>=from && p.asofIdx<=to){ const x=Xc(p.asofIdx);
    g+=`<line x1="${x.toFixed(1)}" y1="${T}" x2="${x.toFixed(1)}" y2="${T+ph}" stroke="#B8C2CC" stroke-width="1.5" stroke-dasharray="2,2"/><text x="${x.toFixed(1)}" y="${T-4}" text-anchor="middle" ${FF} font-size="13" fill="#68727d">Today</text>`; }
  // I-86/I-88: in-SVG legend — ONE left-aligned row, laid out sequentially from the left edge
  // (mirrors PPP #poChart: swatches for bars, dashed segments for cum lines; not two rows spread across width).
  let lx=padL;
  if(barsVisible){
    [['Planned',COLORS.blue],['Forecast',COLORS.amber],['Actual',COLORS.green]].forEach(([lab,c])=>{
      g+=`<rect x="${lx}" y="${H-13}" width="10" height="10" rx="2" fill="${c}" opacity="0.55"/><text x="${lx+15}" y="${H-4}" ${FF} font-size="13" fill="#2b3440">${lab}</text>`;
      lx+=15+lab.length*7+20; });
  }
  [['Cum. Plan',COLORS.blue,'6,3'],['Cum. Forecast',COLORS.amber,'2,2'],['Cum. Actual',COLORS.green,'']].forEach(([lab,c,dash])=>{
    g+=`<line x1="${lx}" y1="${H-8}" x2="${lx+18}" y2="${H-8}" stroke="${c}" stroke-width="2.5"${dash?` stroke-dasharray="${dash}"`:''}/><text x="${lx+24}" y="${H-4}" ${FF} font-size="13" fill="#2b3440">${lab}</text>`;
    lx+=24+lab.length*7+20; });
  return `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMid meet">${g}</svg>`;
}
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
  return ({APP:COLORS.green,AWC:COLORS.amber,REJ:COLORS.red,NAP:COLORS.slate,'Not Available':COLORS.grey,
           'Submitted – Pending Review':COLORS.blue,'Submitted – Status Unavailable':COLORS.grey,
           'Not Submitted':COLORS.blueGrey,'Record Error':COLORS.purple,
           YES:COLORS.green,NO:COLORS.slate,
           'On track':COLORS.green,'At risk':COLORS.amber,
           'Overdue – 1st':COLORS.red,'Overdue – Resub':COLORS.red,'Overdue – Client':COLORS.red})[name] || COLORS.blue;
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
function getPref(key, def){ try{ const v=localStorage.getItem('mdl_'+key); if(v==null) return def; if(typeof def === 'boolean') return v === 'true'; if(typeof def === 'number') return Number(v); return v; }catch(e){ return def; } }
function setPref(key, val){ try{ localStorage.setItem('mdl_'+key, val); }catch(e){} }
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
// --- fixed top warning bar (#errBanner, PPP design, spec §3.5) ---
// Visibility is driven by ONE resolver, applyBannerState(), so the user's persisted collapse
// preference is always respected — including notices appended *after* the user collapsed the bar.
function expandBanner(b, ctx){
  b.hidden = false;
  const h = b.offsetHeight;
  if(h){ document.documentElement.style.setProperty('--banner-h', h + 'px'); document.body.classList.add('banner-open'); }
  if(ctx === 'welcome'){ document.body.classList.add('banner-welcome'); b.style.top = '0px'; }
  else { const hdr = document.querySelector('header.app'); b.style.top = (hdr ? hdr.offsetHeight : 0) + 'px'; }
}
function collapseBanner(b){
  b.hidden = true;
  document.body.classList.remove('banner-open', 'banner-welcome');
  document.documentElement.style.removeProperty('--banner-h');
}
function closeBanner(b){            // teardown: no notices left
  b.hidden = true; b.innerHTML = ''; b.removeAttribute('style');
  document.body.classList.remove('banner-open', 'banner-welcome');
  document.documentElement.style.removeProperty('--banner-h');
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
// in-flow cards — the fixed bar stays the only warning surface.
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
  MODEL = model; WRAP = null; collapsed.clear(); scurveWin = null; matrixMonthSel = ''; toastActive.length = 0; toastQueue.length = 0;   // full reset on a fresh load
  const defs = getFilterDefs(model);
  const initSet = d => new Set(baseOpts(d));
  STATE = { disciplines:initSet(defs[0]), stages:initSet(defs[1]), search:'', searchCol:'Document No.', rule:null, sort:{col:null,dir:1} };
  root.innerHTML = `<style>${CSS}</style>`;
  const header = document.createElement('header'); header.className='app';
  const titleText = model.meta.projectTitle || (model.meta.workbookName ? model.meta.workbookName.replace(/\.(xlsx|xlsm)$/i,'') : 'Dashboard');
  // I-94 (part 2b) — the control states the scope it acts on: the menu-bar filters are GLOBAL, so the
// tooltip and the panel's accessible name both say so, which is what distinguishes them from the
// panel-local controls (Overdue Type / Rule) that carry the opposite wording.
const filterBtn = d => `<div class="tf-wrap"><button id="tfBtn_${d.key}" class="tf-btn" title="Applies to all panels — filters the whole dashboard" aria-expanded="false" aria-haspopup="true" aria-controls="tfPanel_${d.key}">${esc(d.label)}<span class="tf-cnt" id="tfCnt_${d.key}"></span></button><div class="tf-panel" id="tfPanel_${d.key}" role="group" aria-label="Filter every panel by ${esc(d.label.toLowerCase())}" hidden></div></div>`;
  const colOpts = model.contract.fieldOrder.map(f => `<option value="${esc(f)}"${f==='Document No.'?' selected':''}>${esc(f)}</option>`).join('');
  // Bug-fix: .sub rendered conditionally — only when dashboardTitle is set (fixes "dashboard
  // title not hard-coded when absent" test failure; previously always rendered with '|| Dashboard').
  const subLine = model.meta.dashboardTitle ? `<div class="sub">${esc(model.meta.dashboardTitle)}</div>` : '';
  // Bug-fix: filter chips (.tf-wrap) moved into .actions so the test selector
  // `header.app .actions .tf-wrap` finds them (and .actions button count reaches ≥3).
  // Row 1 (title bar): logo + title block only — no action buttons here (spec §3.1).
  // Row 2 (menu bar): left actions cluster + right filter group; borderless, text-only, hover-highlight.
  header.innerHTML = `<div class="app-top"><div class="brand"><img class="logo" src="${LOGO_DATA}" alt="logo"><div class="ttl-stack"><h1 class="ttl">${esc(titleText)}</h1>${subLine}<div class="meta">Project start ${esc(model.meta.projectStartDate || '—')} · as of ${esc(model.meta.today)}</div></div></div></div>
<div class="app-menu"><div class="actions"><button id="reload" class="btn btn-primary">Load Workbook</button><button id="aPrint" class="btn">Print / Save PDF</button></div><div class="filter-group">${defs.map(filterBtn).join('')}<div class="tf-wrap"><button id="searchToggle" class="btn" type="button" title="Applies to all panels — filters the whole dashboard" aria-haspopup="dialog" aria-controls="searchPanel">Search</button><div class="tf-panel search-panel" id="searchPanel" role="dialog" aria-label="Search documents — filters every panel"><div class="search-row"><div class="search" style="flex:1 1 auto;width:auto;min-width:240px;max-width:none"><select id="fCol" class="inter-sel is-attached" aria-label="Search column">${colOpts}</select><input id="fSearch" class="search-input" type="search" value="${esc(STATE.search)}" placeholder="Search Document No.…" aria-label="Search value"></div><button id="fGo" class="btn btn-primary" type="button">Find</button><button id="fReset" class="btn" type="button">Reset</button></div></div></div><button id="warnBtn" class="btn warn-toggle" aria-pressed="false" aria-label="Data-quality warnings (0)" hidden><span class="badge">0</span> <span id="warnLabel">Warnings</span></button></div></div>`;
  root.appendChild(header);
  // Wire the header search control: single column, commit on Enter (or button); Esc clears.
  // The control lives in a collapsible Search panel (spec §4.7 / §5.1) — the "Search" button toggles it.
  const fSearch = header.querySelector('#fSearch'), fCol = header.querySelector('#fCol');
  const searchPanel = header.querySelector('#searchPanel'), searchToggle = header.querySelector('#searchToggle');
  const runSearch = () => { STATE.search = fSearch.value; STATE.searchCol = fCol.value; renderAll(wrap); };
  const closeSearch = () => { if(searchPanel) searchPanel.classList.remove('open'); };
  fSearch.addEventListener('keydown', e => { if(e.key === 'Enter'){ e.preventDefault(); runSearch(); closeSearch(); } else if(e.key === 'Escape'){ fSearch.value=''; STATE.search=''; renderAll(wrap); closeSearch(); } });
  header.querySelector('#fGo').addEventListener('click', () => { runSearch(); closeSearch(); });
  header.querySelector('#fReset').addEventListener('click', () => { fSearch.value=''; runSearch(); closeSearch(); });
  fCol.addEventListener('change', () => { fSearch.placeholder = 'Search ' + fCol.value + '…'; });
  if(searchToggle && searchPanel){
    searchToggle.addEventListener('click', e => { e.stopPropagation(); searchPanel.classList.toggle('open'); });
    document.addEventListener('click', e => { if(searchPanel && !searchPanel.contains(e.target) && !searchToggle.contains(e.target)) closeSearch(); });
  }
  // Dismissible warning bar (spec §3.5): toggle collapse; persisted in localStorage.
  const warnBtn = header.querySelector('#warnBtn');
  if(warnBtn) warnBtn.addEventListener('click', () => {
    setPref('hideWarnings', !getPref('hideWarnings', false));
    applyBannerState(document.getElementById('errBanner'));
  });

  // --- Unified top warning bar (#errBanner, PPP design, spec §3.5): system/config
  // notices + load failures in one fixed bar below the app bar. ---
  if(!document.getElementById('errBanner')){
    const eb = document.createElement('div'); eb.id='errBanner';
    eb.setAttribute('role','alert'); eb.setAttribute('aria-live','assertive');
    root.appendChild(eb);
  }
  showBanner(model.warnings);

  const wrap = document.createElement('div'); wrap.className='wrap'; root.appendChild(wrap); WRAP = wrap;
  statusBarEl = document.createElement('div'); statusBarEl.id='statusBar'; statusBarEl.className='status-bar'; statusBarEl.innerHTML='<span class="sb-loading">Loading dashboard…</span>'; root.appendChild(statusBarEl);
  if(!document.getElementById('toast')){ const th=document.createElement('div'); th.id='toast'; root.appendChild(th); }

  // no-list-yet disciplines — a config notice, routed to the unified #errBanner (spec §3.5)
  if(model.contract.noListYetDisciplines.length){
    addBannerNotice('info', 'CONFIG', `UESH disciplines with no document list yet (auto-discovered, shown for structure only): ${model.contract.noListYetDisciplines.join(', ')}.`);
  }

  // KPI panel
  const kp = document.createElement('div'); kp.className='panel'; kp.id='kpiPanel'; kp.dataset.panel='1';
  wrap.appendChild(kp);
  // (Filters & Utilities panel removed — Search + Reset moved into the sticky header; spec §4.7 / I-62)
  // Matrix — Bug-fix: was data-panel='3', skipping '2' (caused "all 8 panels numbered" failure)
  const mp = document.createElement('div'); mp.className='panel'; mp.id='matrixPanel'; mp.dataset.panel='2';
  wrap.appendChild(mp);
  // Charts (Documents / Issues breakdowns, side by side)
  const chartsPanel = document.createElement('div'); chartsPanel.className='panel'; chartsPanel.id='chartsPanel'; chartsPanel.dataset.panel='3';
  chartsPanel.innerHTML='<h2>Interactive Chart</h2>';
  const grid=document.createElement('div'); grid.className='charts'; chartsPanel.appendChild(grid);
  wrap.appendChild(chartsPanel);
  // Issue Progress (S-Curve & Monthly), below charts
  const curvePanel = document.createElement('div'); curvePanel.className='panel'; curvePanel.id='curvePanel'; curvePanel.dataset.panel='4';
  curvePanel.innerHTML='<div class="panel-head"><h2>Issue Progress</h2><div class="head-actions" id="curveActions"></div></div>';
  const cbody=document.createElement('div'); cbody.className='curve-body'; curvePanel.appendChild(cbody);
  wrap.appendChild(curvePanel);
  // Overdue
  const op=document.createElement('div'); op.className='panel'; op.id='overduePanel'; op.dataset.panel='5'; wrap.appendChild(op);
  // Validation
  const vp=document.createElement('div'); vp.className='panel'; vp.id='validationPanel'; vp.dataset.panel='6'; wrap.appendChild(vp);
  // Detail
  const dp=document.createElement('div'); dp.className='panel'; dp.id='detailPanel'; dp.dataset.panel='7'; wrap.appendChild(dp);
  // Disclaimer footer (spec §3.3 — role=contentinfo, last child of .wrap)
  const footer=document.createElement('footer'); footer.className='disclaimer'; footer.setAttribute('role','contentinfo');
  footer.textContent='Standalone Dashboard. Updated on '+new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'})+'. Copyright UESH 2026.';
  wrap.appendChild(footer);

  document.getElementById('reload').onclick = ()=> boot(root);
  document.getElementById('aPrint').onclick = ()=> window.print();
  requestAnimationFrame(()=>renderAll(wrap));
}
function renderAll(wrap){
  WRAP = wrap;
  const v = deriveView(MODEL, STATE);
  try { wireFilterChips(MODEL, STATE, ()=>renderAll(wrap), refreshData); }
  catch(e){ console.error('[wireFilterChips]', e); }
  renderData(wrap, v);
}
function refreshData(){ renderData(WRAP, deriveView(MODEL, STATE)); }
function renderData(wrap, v){
  v = v || deriveView(MODEL, STATE);
  renderIssues = [];
  const safe = (label, id, fn) => { const p = document.getElementById(id); try { fn(p); } catch(e){ reportPanelError(label, p, e); } };
  safe('KPI Overview', 'kpiPanel', p => renderKPIs(p, v.kpis, MODEL));
  safe('Discipline Summary Matrix', 'matrixPanel', p => renderMatrix(p, v.matrix, v.matrixMonths, v.curMonth));
  safe('Charts', 'chartsPanel', p => renderCharts(p.querySelector('.charts'), v.charts));
  safe('Issue Progress', 'curvePanel', p => renderCurvePanel(p.querySelector('.curve-body'), v.monthlyProgress));
  safe('Overdue List', 'overduePanel', p => renderOverdue(p, {first:v.firstOverdue,sub:v.subOverdue,cli:v.cliOverdue}, MODEL));
  safe('Validation Issues', 'validationPanel', p => renderValidation(p, v.issues, MODEL));
  safe('Document Detail Table', 'detailPanel', p => renderDetail(p, v.recs, MODEL, STATE, ()=>renderAll(wrap)));
  ['kpiPanel','matrixPanel','chartsPanel','curvePanel','overduePanel','validationPanel','detailPanel'].forEach(id => { try { ensureCollapse(document.getElementById(id)); } catch(e){ console.error('[collapse] '+id, e); } });
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
  const m=MODEL.meta, k=v.kpis||{};
  const q = s => esc(s);
  const total = MODEL.records ? MODEL.records.length : 0;
  const planned = k.totalPlanned||0, submitted = k.submitted||0;
  const pct = planned ? Math.round(submitted/planned*100) : 0;
  const valid = v.active ? v.active.length : 0;
  const asof = m.today||'';
  const gen = m.generatedAt ? m.generatedAt.slice(0,19).replace('T',' ') : '';
  const fsum = filterSummary();
  const fileTitle = q(m.workbookName||'') + (gen? ' · Generated '+q(gen) : '');
  statusBarEl.innerHTML =
    '<span class="sb-panel"><span class="sb-dot" title="Workbook loaded"></span><span class="sb-file" title="'+fileTitle+'"><b>File:</b> '+esc(m.workbookName||'—')+'</span></span>'+
    '<span class="sb-panel" title="Total planned active documents"><b>Planned:</b> '+planned+'</span>'+
    '<span class="sb-panel" title="Documents with an Actual 1st Issue Date"><b>Submitted:</b> '+submitted+'</span>'+
    '<span class="sb-panel" title="1st-submission progress = Submitted / Planned"><b>1st-sub:</b> '+pct+'% <span class="sb-bar"><i style="width:'+pct+'%"></i></span></span>'+
    '<span class="sb-panel" title="Active documents (excluded stages removed) of '+total+' total rows"><b>Valid:</b> '+valid+'/'+total+'</span>'+
    '<span class="sb-panel" title="Overdue 1st-submission count"><b>Overdue:</b> '+(k.overdueFirst||0)+'</span>'+
    '<span class="sb-panel" title="Data completeness % (passing rules V-17…V-27)"><b>Completeness:</b> '+(k.completeness==null?'N/A':k.completeness+'%')+'</span>'+
    '<span class="sb-panel" title="Distinct UESH disciplines among active documents"><b>Disciplines:</b> '+(k.activeDisciplines||0)+'</span>'+
    '<span class="sb-panel" title="Reporting / as-of date used for overdue calculation"><b>As-of:</b> '+q(asof)+'</span>'+
    '<span class="sb-panel sb-filter" title="'+q(fsum)+'"><b>Filter:</b> '+esc(fsum)+'</span>';
  if(renderIssues && renderIssues.length){
    statusBarEl.innerHTML += '<span class="sb-panel sb-err"><span class="sb-dot sb-dot-err"></span><b>Render issues:</b> '+renderIssues.length+'</span>';
  }
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
<li><strong>Month selector</strong> (top of the panel, left of the toolbar): chooses which month the three shaded "Plan / Forecast / Actual" columns count. It defaults to the as-of month (marked "(as-of)" in the list). The list is a <em>continuous</em> range from the <strong>earlier of the project start date (Code!B6) and the earliest planned/forecast/actual first-issue date in the data</strong> — so months before the declared project start are also reachable — through the as-of month, extended to the latest data month if it lies beyond as-of. Every month in the project's life is listed, including months with no submissions. Changing it only re-counts those three shaded columns — Total Planned, Total Submitted, the approval split, and the three overdue counts are all-time / as-of-today totals and do not change.</li>
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
<p>Documents charts use the active documents and columns <em>UESH Discipline</em> (C), <em>Stage</em> (B), <em>Authority</em> (Q), <em>Latest Approval Status</em> (Y), <em>Doc Type</em> (I). Issues charts use the validation issues (Panel 6) and their discipline.</p>
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
<li>The <strong>window slider</strong> (Reporting period) selects which months are shown and <strong>scopes the S-curve data</strong>: the cumulative lines show progress <strong>within the selected window</strong> (anchored at the window start), while the monthly bars show per-month new counts. The red-dashed <strong>Start</strong> and navy <strong>Today</strong> reference lines stay fixed. A caption under the chart shows <strong>Reporting period: … · As-of: {system date} · cumulative within period</strong> so the window is never confused with the current-date calculations (which stay anchored to the as-of date).</li>
<li>A red dashed <strong>vertical line</strong> marks <strong>Start</strong> (project start date, <strong>Code!B6</strong>); a solid navy line marks <strong>Today</strong> (the as-of system date). The project-start month is always included in the range, and the panel prints both as a caption.</li>
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
<p>Rows sorted by <em>UESH Discipline</em> (C), then Overdue Type, then Document Number; discipline shown on every row. The <strong>Overdue Type</strong> dropdown filters to one type. The top-bar <strong>Discipline</strong> / <strong>Stage</strong> filters narrow the whole list. <strong>⤓ CSV</strong> downloads the visible rows as <code>MDL_Overdue.csv</code> with the same columns.</p>
<div class="def"><strong>Working days</strong> — Monday to Friday; Saturday and Sunday are not counted.</div>
`},
  validationPanel:{title:'Validation Issues — Panel 6',body:`
<h4>What it shows</h4>
<p>Data-quality problems found in the document list, with severity and the affected document.</p>
<h4>Source data</h4>
<p>Findings from checking every document row against the Code-sheet lookup tables — <em>Stage</em> (B), <em>UESH Discipline</em> (C), <em>Doc Type</em> (I), <em>Discipline (Code)</em> (J), <em>Authority</em> (Q), <em>Latest Approval Status</em> (Y), <em>Project Code</em> (G) — and the business rules in the <strong>Error Code block</strong> on the Code sheet (<code>Code!AI2:AL</code>: Error Code AI, Group AJ, Rule AK, Severity AL). That block holds the 28 rules V-01…V-28 (e.g., blank/missing document, invalid stage/discipline/doc-type/authority/approval/project code, document-number format mismatch, approval/date inconsistencies, future dates, duplicate document numbers, missing required fields, excluded-but-incomplete, and <strong>V-28</strong> — a Planned/Forecast/Actual 1st-issue date earlier than the project start date <code>Code!B6</code>).</p>
<p class="note" style="margin-top:6px"><strong>Routing:</strong> this panel shows <em>data-quality</em> details only. <em>System / processing</em> warnings (e.g. “List End Row exceeded”) and fatal errors appear in the <strong>top banner</strong> above the panels, never here.</p>
<h4>How it is worked out</h4>
<ul>
<li>Every data-quality issue for a document in the current global selection (top-bar Discipline / Stage) is shown.</li>
<li>Each row shows severity, rule code, the message, <em>Document No.</em> (M), <em>UESH Discipline</em> (C), and the source tab/row.</li>
<li><strong>⤓ CSV</strong> downloads the issues as a CSV named after the project (<code>&lt;project&gt;-issue_list.csv</code>).</li>
</ul>
<div class="def"><strong>Severity</strong> — Error, Warning, or Info, taken from the Code sheet Error Code block.</div>
`},
  detailPanel:{title:'Document Detail Table — Panel 7',body:`
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
  const cards = [
    {l:'Total Planned',v:k.totalPlanned,c:''},{l:'Submitted',v:k.submitted,c:'ok'},
    {l:'Approved (APP)',v:k.approvedAPP,c:'ok'},{l:'Approved w/ Comments',v:k.approvedAWC,c:'amb'},
    {l:'Rejected (REJ)',v:k.rejected,c:'warn'},{l:'Not Approved (NAP)',v:k.notApproved,c:''},
    {l:'Pending Review',v:k.pendingReview,c:''},{l:'Not Submitted',v:k.notSubmitted,c:'muted'},
    {l:'Record Error',v:k.recordError,c:'err'},
    {l:'Overdue – 1st Sub',v:k.overdueFirst,c:'warn'},{l:'Overdue – Resub',v:k.overdueResubmission,c:'warn'},
    {l:'Overdue – Client',v:k.overdueClientReview,c:'warn'}];
  const sub = [
    {l:'As-Built Required (YES)',v:k.asBuiltYes},{l:'Vendor Data (YES)',v:k.vendorYes},
    {l:'Data Completeness',v:(k.completeness==null?'N/A':k.completeness+'%')},{l:'Active Disciplines',v:k.activeDisciplines+' / '+(k.disciplineTotal||0)}];
  panel.innerHTML = `<div class="panel-head"><h2>KPI Overview</h2><div class="head-actions"><button class="collapse icon-btn" title="Collapse panel" aria-label="Collapse panel">−</button></div></div>
    <div class="panel-body"><div class="kpis">${cards.map(c=>`<div class="kpi ${c.c}"><div class="v">${c.v}</div><div class="l">${esc(c.l)}</div></div>`).join('')}</div>
    <div class="subkpis">${sub.map(s=>`<div class="subkpi"><div class="v">${esc(s.v)}</div><div class="l">${esc(s.l)}</div></div>`).join('')}</div></div>`;
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
  const css = `.matrix{width:100%;border-collapse:collapse;font-size:12px;background:#fff}
    .matrix th,.matrix td{border-bottom:1px solid #d8e0ea;padding:4px 8px;text-align:center;white-space:nowrap}
    .ds-table thead th{background:#1f3a5f;color:#fff;font-weight:600}
    .matrix th:first-child,.matrix td:first-child{text-align:left}
    .matrix thead tr.group th{background:#1f3a5f;color:#fff;font-weight:700}
    .matrix thead tr.group th.tint{background:#FFF9C4;color:#7a5b12}
    .matrix th.tint{background:#FFF9C4;color:#7a5b12}
    .matrix td.col-tint{background:#FFF9C4}
    .matrix tfoot td{background:#eef2f7;font-weight:700;border-top:2px solid #1f3a5f}
    .matrix tbody tr:nth-child(even){background:#fafcff}
    .matrix tbody tr.sub{background:#f2f6fb}
    .matrix tbody tr.sub td.subname{text-align:left;padding-left:22px;color:#6b7785;font-style:italic}`;
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
// build <thead> cells from cols + active sort state (button + aria-sort + indicator)
function sortHeadCells(cols, active){
  return cols.map(c=>{
    // carry the column's alignment class (num ⇒ right) onto the header, so the header aligns with
    // the body cells of the same column (§18: alignment follows the data type).
    const clsName = [c.cls, c.type === 'num' ? 'num' : ''].filter(Boolean).join(' ');
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
    min: 60, max: 640
  },
  issue: {
    pinned: ['severity', 'docNo'],
    core:   ['severity', 'docNo', 'code', 'field', 'value', 'message', 'sourceTab', 'rownum'],
    widths: { severity:70, docNo:110, code:90, field:120, value:130, message:300, sourceTab:110, rownum:60 },
    min: 60, max: 640
  },
  overdue: {
    pinned: [],   // no pinned columns — keeps the current left-to-right order
    core:   ['Prolog Number','Document No.','Number','Document Title','UESH Discipline','Overdue Type',
             'Planned 1st Issue Date','Forecast 1st Issue Date','Actual 1st Issue Date',
             'Latest Approval Date','Latest Approval Status','Submission Status','Delay (days)'],
    widths: { 'Prolog Number':110, 'Document No.':120, 'Number':70, 'Document Title':200, 'UESH Discipline':130,
              'Overdue Type':90, 'Planned 1st Issue Date':140, 'Forecast 1st Issue Date':140, 'Actual 1st Issue Date':140,
              'Latest Approval Date':140, 'Latest Approval Status':150, 'Submission Status':140, 'Delay (days)':80 },
    min: 60, max: 640
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
  const custom = Object.keys(widths).length > 0;
  let others = [];
  const raw = getPref(key + '_cols', '');
  others = raw ? raw.split(',').filter(k => known.has(k) && !pinned.includes(k)) : core.filter(k => !pinned.includes(k));
  const widthOf = k => (widths[k] != null ? widths[k] : (defW[k] != null ? defW[k] : 130));
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
      const cls = [c.cls, c.type === 'num' ? 'num' : ''].filter(Boolean).join(' ');
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
      return `<td data-col="${esc(c.key)}" class="${pin}${edge}${extra ? ' ' + extra : ''}"${off}>${inner}</td>`;
    },
    setWidth(k, px, persist) {
      widths[k] = Math.max(def.min || 60, Math.min(def.max || 640, Math.round(px)));
      if(persist) setPref(key + '_widths', JSON.stringify(widths));
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
      const min = def.min || 60, max = def.max || 640;
      const total = cols.reduce((a, c) => a + widthOf(c.key), 0);
      if(total <= available) return false;                                  // already fits
      const floor = cols.reduce((a, c) => a + Math.min(widthOf(c.key), min), 0);
      if(floor >= available) return false;                                  // unavoidable — scrollbar
      const over = total - available;
      const slack = cols.reduce((a, c) => a + Math.max(0, widthOf(c.key) - min), 0);
      if(!slack) return false;
      cols.forEach(c => {
        const w = widthOf(c.key);
        widths[c.key] = Math.min(max, Math.max(min,
          Math.round(w - over * (Math.max(0, w - min) / slack))));
      });
      return true;                                                          // caller must repaint
    },
    resetWidths() {
      widths = {};
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
        setWidth(k, w);
      };
      const up = ev => {
        const w = startW + (ev.clientX - startX);
        grid.setWidth(k, w, true);
        setWidth(k, w);
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
      const w = Math.max((def.min || 60), Math.min((def.max || 640),
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
  const run = () => { if(grid.fit(sc.clientWidth)) repaint(); };
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
  const matrixThead = ()=>{
    // Static headers (sorting removed 2026-10-19, MDL I-110): no sort buttons / aria-sort /
    // sort indicators. §18 centres a summary cross-tab's data columns, and the header carries
    // exactly what the body carries (a plain <td>), so header and data cannot diverge.
    const disc = `<th rowspan="2" scope="row">Discipline</th>`;
    const L = k => `<th scope="col">${esc(k)}</th>`;
    const COLS = ['Total Planned','Total Submitted','Plan','Forecast','Actual','APP','AWC','REJ','NAP','1st','Resub','Client'];
    return `<tr class="group">${disc}`
      + `<th colspan="2" scope="colgroup">Total Submission</th>`
      + `<th colspan="3" scope="colgroup">Submission — ${ml} (selected month)</th>`
      + `<th colspan="4" scope="colgroup">Approval</th>`
      + `<th colspan="3" scope="colgroup">Overdue</th>`
      + `<th rowspan="2" aria-label="Expand stages"></th>`
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
    const exp = m.stages.length ? `<td><button class="expand" type="button" data-d="${esc(m.discipline)}" aria-expanded="false" title="Expand stages">▸ stages</button></td>` : `<td class="noexp">—</td>`;
    return `<tr><td>${esc(m.discipline)}</td><td>${m.Planned}</td><td>${subFmt(m.Submitted)}</td>`
      + `<td${tint}>${m.PlanMo}</td><td${tint}>${m.FcastMo}</td><td${tint}>${m.ActualMo}</td>`
      + `<td>${m.Approved}</td><td>${m.AWC}</td><td>${m.REJ}</td><td>${m.NAP}</td>`
      + `<td>${m.ov1}</td><td>${m.ov2}</td><td>${m.ov3}</td>${exp}</tr>`;
  }).join('');
  const rows = matrixRows(mrows);
  const tot = matrix.reduce((a,m)=>{ a.Planned+=m.Planned; a.Submitted+=m.Submitted; a.PlanMo+=m.PlanMo; a.FcastMo+=m.FcastMo; a.ActualMo+=m.ActualMo; a.Approved+=m.Approved; a.AWC+=m.AWC; a.REJ+=m.REJ; a.NAP+=m.NAP; a.ov1+=m.ov1; a.ov2+=m.ov2; a.ov3+=m.ov3; return a; }, {Planned:0,Submitted:0,PlanMo:0,FcastMo:0,ActualMo:0,Approved:0,AWC:0,REJ:0,NAP:0,ov1:0,ov2:0,ov3:0});
  const tfoot = `<tfoot><tr><td>TOTAL</td><td>${tot.Planned}</td><td>${subFmt(tot.Submitted)}</td>`
    + `<td${tint}>${tot.PlanMo}</td><td${tint}>${tot.FcastMo}</td><td${tint}>${tot.ActualMo}</td>`
    + `<td>${tot.Approved}</td><td>${tot.AWC}</td><td>${tot.REJ}</td><td>${tot.NAP}</td>`
    + `<td>${tot.ov1}</td><td>${tot.ov2}</td><td>${tot.ov3}</td><td></td></tr></tfoot>`;
  panel.innerHTML = `<div class="panel-head"><h2>Discipline Summary Matrix</h2><div class="head-actions"></div></div>`
    + `<div class="panel-body">`
    // §18 split-header contract (1): header + body share ONE bordered, rounded container, so the pair
    // reads as a single table with continuous corners instead of a square header over a rounded box.
    + `<div class="matrixcard splitcard">`
    + `<div class="vheadwrap"><table class="matrix ds-table vheadtab" id="matrixHead"><caption class="sr-only">Discipline Summary Matrix — column headers.</caption>${headFrag}<thead>${matrixThead()}</thead></table></div>`
    + `<div class="tableScroll"><table class="matrix ds-table" id="matrixBody"><caption class="sr-only">Discipline Summary Matrix — a cross-tab of document counts by discipline per month, with a TOTAL row that is always last.</caption>${headBody}<tbody>${rows}</tbody>${tfoot}</table></div>`
    + `</div></div>`;
  const subRowsHTML = m => (m?m.stages:[]).map(s=>`<tr class="sub"><td class="subname">${esc(s.stage)}</td><td>${s.Planned}</td><td>${s.Submitted}</td><td${tint}>${s.PlanMo}</td><td${tint}>${s.FcastMo}</td><td${tint}>${s.ActualMo}</td><td>${s.Approved}</td><td>${s.AWC}</td><td>${s.REJ}</td><td>${s.NAP}</td><td>${s.ov1}</td><td>${s.ov2}</td><td>${s.ov3}</td><td></td></tr>`).join('');
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
  const toolbar = document.createElement('div'); toolbar.className='toolbar';
  toolbar.innerHTML = `<button class="ea btn btn-secondary" title="Expand every discipline">▾ Expand all</button><button class="ca btn btn-secondary" title="Collapse all disciplines">▸ Collapse all</button><button class="dl btn btn-secondary" title="Export fully-expanded report as PNG">⤓ PNG (full)</button><button class="cp btn btn-secondary" title="Copy fully-expanded report image">⧉ Copy</button><button class="csv btn btn-secondary" title="Download discipline summary matrix (disciplines + stages) as CSV">⤓ CSV</button>`;
  const headActions = panel.querySelector('.head-actions');
  const msel=document.createElement('label'); msel.className='lbl month-sel';
  msel.innerHTML='<span>Month:</span>';
  const sel=document.createElement('select'); sel.className='inter-sel';
  (months||[]).forEach(o=>{ const op=document.createElement('option'); op.value=o.value; op.textContent=o.label; if(o.value===curMonth) op.selected=true; sel.appendChild(op); });
  sel.title='Choose the month for the Plan / Forecast / Actual columns';
  msel.appendChild(sel);
  headActions.insertBefore(msel, headActions.firstChild);
  sel.onchange=()=>{ matrixMonthSel=sel.value; renderAll(WRAP); };
  headActions.appendChild(toolbar);
  const cb=document.createElement('button'); cb.className='collapse icon-btn'; cb.textContent='−'; cb.title='Collapse panel'; cb.setAttribute('aria-label','Collapse panel'); headActions.appendChild(cb);
  wireCollapse(panel);
  toolbar.querySelector('.ea').onclick = ()=>{ collapseAll(); panel.querySelectorAll('.expand').forEach(openOne); };
  toolbar.querySelector('.ca').onclick = ()=> collapseAll();
  attachExport(toolbar, ()=> matrixSVG(mrows), xp('Discipline_Matrix'));
  toolbar.querySelector('.csv').onclick = ()=>{ downloadCSV(xp('Discipline_Matrix_'+(curMonth||'all'))+'.csv', matrixCSV(mrows, curMonth)); toast('CSV downloaded','success'); };
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
    const colored=data.map((d,i)=>({...d, color: it.mode==='status'? statusColor(d.name) : (d.color||PALETTE[i%PALETTE.length])}));
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

function renderCurvePanel(body, progress){
  body.innerHTML='';
  const n=progress.months.length;
  if(!scurveWin) scurveWin={from:0,to:n-1};
  if(scurveWin.to>n-1) scurveWin.to=n-1;
  if(scurveWin.from>n-1) scurveWin.from=n-1;
  if(scurveWin.from>scurveWin.to){ const t=scurveWin.from; scurveWin.from=scurveWin.to; scurveWin.to=t; }
  // I-85/I-88: plot + all related controls wrapped in one chart card board; cluster is right-aligned
  // to the card (spec §4.1 ownership — every card owns its controls; §4.2 single cluster order:
  // period window -> Bars -> PNG -> Copy). No Reset (removed 2026-10-13).
  const card=document.createElement('div'); card.className='chart'; body.appendChild(card);
  const cluster=document.createElement('div'); cluster.className='head-actions chart-actions'; card.appendChild(cluster);
  const win=document.createElement('div'); win.className='toolbar sc-win';
  win.innerHTML=`<span class="lbl">Period window</span><label class="rng">From <input type="range" class="wf" min="0" max="${n-1}" value="${scurveWin.from}"></label><label class="rng">To <input type="range" class="wt" min="0" max="${n-1}" value="${scurveWin.to}"></label><span class="msg"></span>`;
  cluster.appendChild(win);
  const barsBtn=document.createElement('button'); barsBtn.className='ctl-bars btn btn-secondary'; barsBtn.textContent='Bars'; barsBtn.title='Show / hide the monthly bars'; barsBtn.setAttribute('aria-pressed', String(curveShowBars!==false)); barsBtn.style.opacity=curveShowBars?'1':'0.55';
  cluster.appendChild(barsBtn);
  const dl=document.createElement('button'); dl.className='dl btn btn-secondary'; dl.textContent='⤓ PNG'; dl.title='Export chart as PNG';
  const cp=document.createElement('button'); cp.className='cp btn btn-secondary'; cp.textContent='⧉ Copy'; cp.title='Copy chart image';
  cluster.appendChild(dl); cluster.appendChild(cp);
  const note=document.createElement('div'); note.className='curve-note';
  if(progress.projStartLabel) note.innerHTML=`Project start: <b>${esc(progress.projStartLabel)}</b> · red dashed line = project start, grey line = today`;
  card.appendChild(note);
  const host=document.createElement('div'); host.className='curve-host'; card.appendChild(host);
  const dualNote=document.createElement('div'); dualNote.className='curve-note'; card.appendChild(dualNote);
  const draw=()=>{ const a=scurveWin.from, b=scurveWin.to;
    host.innerHTML=combinedProgressSVG(progress,a,b);
    // I-88: window range uses the same `MMM YYYY` template as the axis, not the raw YYYY-MM key.
    const msg=win.querySelector('.msg'); if(msg) msg.textContent=`${monthLabel(progress.months[a])} → ${monthLabel(progress.months[b])}  (${b-a+1}/${n} months)`;
    dualNote.textContent = curveLastScaleMode==='dual' ? 'Monthly bars use the right-hand scale; Cum. lines use the left cumulative scale.' : ''; };
  win.querySelector('.wf').oninput=e=>{ scurveWin.from=+e.target.value; draw(); };
  win.querySelector('.wt').oninput=e=>{ scurveWin.to=+e.target.value; draw(); };
  barsBtn.onclick=()=>{ curveShowBars=!(curveShowBars!==false);
    barsBtn.setAttribute('aria-pressed', String(curveShowBars)); barsBtn.style.opacity=curveShowBars?'1':'0.55'; draw(); };
  attachExport(cluster, ()=>host.innerHTML, xp('Issue_Progress'));
  draw();
}
const OVERDUE_COLS=[
  {h:'Prolog Number', f:'Prolog Number'},
  {h:'Document No.', f:'Document No.'},
  {h:'Number', f:'Number'},
  {h:'Document Title', f:'Document Title'},
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
  // L2 column model (I-92): every column sortable; dates sort as dates, statuses as enums,
  // Delay as a number; empty cells sort last. The L3 grid (I-95) owns column order / widths /
  // the show-hide chooser / the resize grips, so the renderer only produces cell contents.
  const overdueCols = OVERDUE_COLS.map(c=>({
    key: c.h, label: c.h, h: c.h, sortable:true, f: c.f, num: c.num,
    type: c.num ? 'num' : (/Date$/.test(c.h) ? 'date' : (c.h==='Latest Approval Status' ? 'enum' : c.h==='Submission Status' ? 'enum' : 'text')),
    order: c.h==='Latest Approval Status' ? ['APP','AWC','REJ','NAP'] : c.h==='Submission Status' ? ['SUR','RTR','NTS'] : undefined,
    get: x => c.f===null ? (c.h==='Overdue Type' ? x.type : (c.h==='Delay (days)' ? (x.r.delay==null?'':x.r.delay) : '')) : (x.r.fields[c.f]||'')
  }));
  const oget = (x,key)=>{ const c=overdueCols.find(k=>k.key===key); return c ? c.get(x) : ''; };
  const recs=[];
  OVERDUE_TYPES.forEach(t=> (o[t.key]||[]).forEach(r=> recs.push({r, type:t.label})));
  // L2 column filtering (I-93): per the workplan §4.0.1 reversal, the Overdue List panel offers NO
  // in-panel column filters. The global Discipline/Stage chips (top bar) own the cross-panel scope and
  // the Overdue Type dropdown (rendered below) owns its own dimension, so there is no per-column filter
  // state here. Rows therefore start as the full overdue set and are narrowed only by the Overdue Type
  // dropdown.
  let rows = recs;
  // default sort: Delay (days) descending (§7.2.6 point 5 — see the most overdue first)
  const osort = {col:'Delay (days)', dir:-1};
  const sp = getPref('overdue_sort','');
  if(/^(-?1)\|/.test(sp)){ const [d,c]=sp.split('|'); if(overdueCols.some(x=>x.key===c)){ osort.col=c; osort.dir=Number(d); } }
  rows = dsSorted(rows, overdueCols, osort, oget);
  const colVal=(c,x)=>{
    if(c.f===null){ if(c.h==='Overdue Type') return x.type; if(c.h==='Delay (days)') return (x.r.delay==null?'':x.r.delay); }
    return x.r.fields[c.f]||'';
  };

  // L3 grid (I-95): widths / chooser / resize. The grid decides column order & widths; the
  // renderer only fills cells. (No columns pinned, so the current left-to-right order is kept.)
  const grid = makeGrid('overdue', overdueCols);
  // §7.2.15 — the header row carries the gutter CELL as well as the gutter column, so the fragment's
  // column count matches its <colgroup> and the navy runs the full card width (the matrix and the
  // Rule Reference do the same). It is aria-hidden: it is not a column, it reserves the scrollbar.
  const ovHeadRow = ()=>grid.headRow(osort).replace('</tr>', '<th class="ds-gut" aria-hidden="true"></th></tr>');
  // §7.2.15 (4) — ONE column grid: the header fragment carries the body's columns plus the trailing
  // .ds-gut gutter that reserves the scrollbar width, so the navy runs the full card width.
  const ovFragCols = ()=>grid.colgroupHTML().replace('</colgroup>', '<col class="ds-gut" style="width:var(--ds-sbw,0px)"></colgroup>');
  const ovRow = x=>`<tr class="over">${grid.visible().map(c=>grid.td(c, esc(colVal(c,x)), c.num?'num':'')).join('')}</tr>`;
  // an empty result must say WHY: filtered-out rows are a different story from "no overdue data"
  const ovEmpty = tf=>`<tr><td class="empty" colspan="${grid.visible().length}">${(rows.length<recs.length||tf)?'No overdue documents match the current filter.':'No overdue documents'}</td></tr>`;
  const tbody=tf=>{ const rs=rows.filter(x=>!tf||x.type===tf);
    return rs.length?rs.map(ovRow).join(''):ovEmpty(tf); };
  const filtered = rows.length < recs.length;
  const cntText = filtered ? `${rows.length} of ${recs.length} docs` : `${rows.length} docs`;
  panel.innerHTML=`<div class="panel-head">
      <h2>Overdue List</h2>
      <div class="head-actions">
        <label class="lbl">Overdue Type:
          <select class="inter-sel" id="ovType" title="Filters this table only — the Overdue List" aria-label="Filter the Overdue List by type — this table only">
            <option value="">All</option>
            ${OVERDUE_TYPES.map(t=>`<option value="${t.label}">${t.label}</option>`).join('')}
          </select>
        </label>
        <button class="csv btn btn-secondary" id="ovCsv" title="Download consolidated overdue list as CSV">⤓ CSV</button>
        <span class="cnt" id="ovCnt">${cntText}</span>
      </div>
    </div>
    <div class="splitbox splitcard">`
    + `<div class="vheadwrap"><table class="ds-table vheadtab" id="ovHead"><caption class="sr-only">Overdue List — column headers.</caption>${ovFragCols()}<thead>${ovHeadRow()}</thead></table></div>`
    + `<div class="tableScroll"><table class="ds-table"><caption class="sr-only">Overdue List — documents past their planned or forecast issue date, with the delay in days.</caption>${grid.colgroupHTML()}<tbody id="ovBody">${tbody('')}</tbody></table></div>`
    + `</div>`;
  const tbl = panel.querySelector('.tableScroll table');
  const ovHead = panel.querySelector('#ovHead');
  const sc = panel.querySelector('.tableScroll');
  const sel=panel.querySelector('#ovType');
  const headActions = panel.querySelector('.head-actions');
  // Per workplan §4.0.1 reversal, there is no per-column filter popover/button here — only the
  // Overdue Type dropdown (below) narrows the list; the global Discipline/Stage chips own the rest.
  sel.onchange=()=>{
    rows = dsSorted(recs.filter(x=>!sel.value||x.type===sel.value), overdueCols, osort, oget);
    panel.querySelector('#ovBody').innerHTML = tbody(sel.value);
    const c = panel.querySelector('#ovCnt');
    if(c) c.textContent = (rows.length<recs.length) ? `${rows.length} of ${recs.length} docs` : `${rows.length} docs`;
  };
  // -- L3 grid (I-95): chooser + resize. The header is rebuilt on every sort, so the grips are
  //    re-attached in the sort callback and whenever the grid refreshes (chooser). --
  // I-116 — the header now lives in its own table, so the resizer is given BOTH halves: grips are
  // attached in the fragment, and every width is written to both colgroups.
  const oResize = grid.resizer(tbl, ovHead);
  grid.chooser(headActions);
  grid.refresh = () => {
    const cg = tbl.querySelector('colgroup'); if(cg) cg.innerHTML = grid.colgroupHTML().replace(/^<colgroup>|<\/colgroup>$/g, '');
    const hcg = ovHead.querySelector('colgroup'); if(hcg) hcg.innerHTML = ovFragCols().replace(/^<colgroup>|<\/colgroup>$/g, '');
    const th = ovHead.querySelector('thead'); if(th) th.innerHTML = ovHeadRow();
    oResize.addGrips();
    panel.querySelector('#ovBody').innerHTML = tbody(sel.value);
  };
  // §7.2.15 invariant 5 — the pair MUST fit the display area whenever it can (13 columns at a 60 px
  // floor need 780 px, so a 1216 px panel is achievable). Re-derived on resize because the fit
  // belongs to the viewport, not to the render.
  fitToScroller(grid, sc, () => grid.refresh());
  // §18 split-header contract (3, 5) — width pin + gutter + horizontal lock-step, shared helper.
  wireSplitHeader(panel, '#ovHead', '.tableScroll');
  // L2 sorting (I-92) via the shared handler. The sort buttons now live in the HEADER FRAGMENT, so
  // that — not the scroller — is what the handler binds to; grips are re-attached after the rebuild.
  wireSort(ovHead, overdueCols, osort, ()=>{ rows = dsSorted(rows, overdueCols, osort, oget); panel.querySelector('#ovBody').innerHTML=tbody(sel.value); oResize.addGrips(); }, 'overdue_sort', ovHeadRow);
  panel.querySelector('#ovCsv').onclick=()=>{
    const tf=sel.value; const rs=rows.filter(x=>!tf||x.type===tf);
    if(!rs.length){ toast('Nothing to export','info'); return; }
    const header=OVERDUE_COLS.map(c=>c.h);
    const lines=[header.join(',')].concat(rs.map(x=>OVERDUE_COLS.map(c=>colVal(c,x)).map(csvCell).join(',')));
    downloadCSV(xp('Overdue')+'.csv', lines.join('\n'));
    toast('CSV downloaded','success');
  };
}
function renderValidation(panel, issues, model){
  const SEV = { Error:'⛔', Warning:'⚠️', Info:'ℹ️' };
  /* §7.2.4 — in a table a severity MUST be a FIXED-SIZE inline SVG, never an emoji.
     A colour emoji (⛔ ⚠️ ℹ️) resolves to the system emoji font, whose ascent and
     descent are larger than the text font's AND differ per glyph. That is what made
     the Sev row taller than every other column and made one row differ from the next
     (RC-4). An SVG sized in px has identical metrics for all three states. */
  const SEV_SVG = {
    Error:'<svg class="sev-svg" viewBox="0 0 14 14" width="14" height="14" role="img" aria-label="Error"><circle cx="7" cy="7" r="6" fill="var(--red)"/><path d="M4.7 4.7l4.6 4.6M9.3 4.7l-4.6 4.6" stroke="#fff" stroke-width="1.6" stroke-linecap="round"/></svg>',
    Warning:'<svg class="sev-svg" viewBox="0 0 14 14" width="14" height="14" role="img" aria-label="Warning"><path d="M7 1.3l5.7 10.4H1.3z" fill="var(--amber)"/><path d="M7 5.1v3.1" stroke="#543a00" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="10.3" r=".85" fill="#543a00"/></svg>',
    Info:'<svg class="sev-svg" viewBox="0 0 14 14" width="14" height="14" role="img" aria-label="Info"><circle cx="7" cy="7" r="6" fill="var(--blue)"/><path d="M7 6.3v3.9" stroke="#fff" stroke-width="1.5" stroke-linecap="round"/><circle cx="7" cy="4" r=".85" fill="#fff"/></svg>'
  };
  const sevKey = s => s==='Error'?'error':(s==='Warning'?'warning':'info');
  const cnt = { error:0, warning:0, info:0 };
  const msgByCode = {};
  issues.forEach(i => { cnt[sevKey(i.severity)]++; if(!(i.code in msgByCode)) msgByCode[i.code] = i.message; });
  const total = issues.length;
  const chips = total
    ? `<span class="vchip e">${SEV.Error} ${cnt.error} Error${cnt.error===1?'':'s'}</span>`
      + `<span class="vchip w">${SEV.Warning} ${cnt.warning} Warning${cnt.warning===1?'':'s'}</span>`
      + `<span class="vchip i">${SEV.Info} ${cnt.info} Info${cnt.info===1?'':'s'}</span>`
    : `<span class="vchip ok">✓ No issues</span>`;
  // (b) Rule reference — ONE card, ONE row per fired code (never individual cards); count per code added
  const eb = (model && model.contract && model.contract.errorBlock) || { map:{}, order:[] };
  const fired = [...new Set(issues.map(i=>i.code))].sort();
  const cntByCode = {}; issues.forEach(i => { cntByCode[i.code] = (cntByCode[i.code] || 0) + 1; });
  const vref = fired.map(code => { const r = eb.map[code] || {}; const sym = SEV_SVG[r.severity] || SEV_SVG.Warning;
    const desc = r.rule || msgByCode[code] || ''; const grp = r.group || '—';
    // §7.2.4 — the severity class sits on an inner <span>, NEVER on the <td>: a
    // display value other than table-cell takes a cell out of the table formatting
    // context, so it stops being a cell and sizes itself independently (RC-1).
    // §7.2.3 — cells are nowrap + ellipsis, so the full text goes in title.
    return `<tr><td><span class="sev-${sevKey(r.severity || 'Warning')}">${sym}</span></td><td><code>${esc(code)}</code></td><td title="${esc(grp)}">${esc(grp)}</td><td title="${esc(desc)}">${esc(desc)}</td><td class="num">${cntByCode[code] || 0}</td></tr>`; }).join('');
  // (a) Code-sheet validation summary — rendered as a NOTE CARD (spec §4.5)
  const cm = (model && model.contract) || {};
  const mapped = cm.columnMap ? Object.keys(cm.columnMap).length : 0;
  const rulesLoaded = (eb.order||[]).length;
  const lookups = cm.lookups || {};
  const lkEmpty = Object.entries(lookups).filter(([k,b]) => !(b.items||[]).length).map(([k]) => k);
  const lkCount = Object.keys(lookups).length;
  const lkText = lkCount ? (lkEmpty.length ? `${lkCount} lookup tables (${lkEmpty.length} empty: ${lkEmpty.join(', ')})` : `${lkCount} lookup tables (all populated)`) : 'no lookup tables';
  const vmap = `Code-sheet validation: <b>${mapped}</b> columns mapped · <b>${rulesLoaded}</b> error rules loaded · ${lkText}.`;
  // L2 sorting for the per-issue list (I-92). Severity is an enum (Error→Warning→Info),
  // Row is numeric, the rest text. Empty values sort last via dsCmp.
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
  const issueGet = (i,key)=> i[key];
  /* I-114 — PANEL-LOCAL RULE-CODE FILTER (shared spec §7.10 B6 + §7.2.7 pt 6).
     No in-panel column filters here (removed 2026-10-20); this single-select is the panel's only
     filter. It is resolved HERE in S5 on the rows already handed to the panel and must NEVER feed
     back into S4 Derive, so KPIs, charts, the matrix and every other panel stay untouched. The
     severity summary chips, the note below and the Rule Reference keep describing the WHOLE run —
     only the issue table and its count reflect the selection (`N of M issues`). */
  const ruleDescOf = code => { const r = eb.map[code] || {}; return r.rule || msgByCode[code] || ''; };
  let ruleSel = '';
  const ruleOpts = `<option value="">All rules</option>` + fired.map(code =>
    `<option value="${esc(code)}">${esc(code)} — ${esc(ruleDescOf(code))} (${cntByCode[code]})</option>`).join('');
  const issueListFor = () => ruleSel ? issues.filter(i => i.code === ruleSel) : issues;
  const issueCntText = n => (n < total)
    ? `${n} of ${total} issues`
    : `${total} issue${total===1?'':'s'}`;
  const isort = {col:'', dir:1};
  const isp = getPref('issue_sort','');
  if(/^(-?1)\|/.test(isp)){ const [d,c]=isp.split('|'); if(issueCols.some(x=>x.key===c)){ isort.col=c; isort.dir=Number(d); } }
  let issueView = dsSorted(issueListFor(), issueCols, isort, issueGet);
  // `win` / `paintBody` are declared below; this closure resolves them when called (always
  // after initialisation, since only the select's change handler triggers it).
  const refreshIssueBody = () => { if(win && win.enabled) win.redraw(); else paintBody(); };
  const onRuleChange = () => {
    ruleSel = ruleSelEl.value;
    issueView = dsSorted(issueListFor(), issueCols, isort, issueGet);
    refreshIssueBody();
    const c = panel.querySelector('#vCnt'); if(c) c.textContent = issueCntText(issueView.length);
  };
  // L3 grid (I-95): visible columns (Severity + Doc No pinned), widths, chooser, resize
  const grid = makeGrid('issue', issueCols);
  const issueRowHTML = i => `<tr>${grid.visible().map(c => {
      const inner = c.key === 'severity' ? `<span class="sev-${sevKey(i.severity)}">${SEV_SVG[i.severity]||SEV_SVG.Warning}</span>`
        : c.key === 'docNo' ? esc(i.docNo)
        : c.key === 'rownum' ? `<span class="num">${esc(i.rownum)}</span>`
        : esc(i[c.key]==null?'—':i[c.key]);
      return grid.td(c, inner, c.key === 'rownum' ? 'num' : '');
    }).join('')}</tr>`;
  const issueRows = list => list.map(issueRowHTML).join('');
  const issueEmpty = () => `<tr><td class="empty" colspan="${grid.visible().length}">No issues to display.</td></tr>`;
  // §7.2.15 — the header row carries the gutter CELL as well as the gutter column, so the fragment's
  // column count matches its <colgroup> and the navy runs the full card width. aria-hidden: it
  // reserves the scrollbar, it is not a column.
  const issueHeadRow = ()=> grid.headRow(isort).replace('</tr>', '<th class="ds-gut" aria-hidden="true"></th></tr>');
  // §7.2.15 (4) — ONE column grid: the fragment carries the body's columns plus the .ds-gut gutter.
  const issueFragCols = ()=>grid.colgroupHTML().replace('</colgroup>', '<col class="ds-gut" style="width:var(--ds-sbw,0px)"></colgroup>');
  panel.innerHTML=`<div class="panel-head"><h2>Validation Issues</h2>
      <div class="head-actions"><span class="vchips" id="vChips">${chips}</span><label class="lbl">Rule:<select class="inter-sel" id="vRule" title="Filters this table only — the Validation / Issues tables" aria-label="Filter issues by rule code — this panel only">${ruleOpts}</select></label><button id="vCsv" class="csv btn btn-secondary" title="Download validation issue list as CSV">⤓ CSV</button><span class="cnt" id="vCnt">${issueCntText(issueView.length)}</span></div></div>
    <div class="note">${total} issue${total===1?'':'s'} across ${fired.length} rule${fired.length===1?'':'s'}. All wording &amp; severity sourced from the Code sheet Error block (Code!AI:AL) — none hard-coded.</div>
    <details class="vdetails"><summary>Validation detail — code-sheet check, rule reference, full issue list</summary>
      <div class="vbody">
        <div class="vnote" id="vmap">${vmap}</div>
        <div class="vrefcard splitcard" id="vref"><div class="vrefhead">Rule Reference (fired)</div><div class="vheadwrap"><table class="ds-table vheadtab"><caption class="sr-only">Rule Reference — the data-quality rules that fired in this run, with severity, code, group, description and the number of occurrences.</caption><colgroup><col style="width:56px"><col style="width:110px"><col style="width:140px"><col><col style="width:70px"><col style="width:var(--ds-sbw,0px)"></colgroup><thead><tr><th scope="col">Sev</th><th scope="col">Code</th><th scope="col">Group</th><th scope="col">Description</th><th scope="col" class="num">Count</th><th class="ds-gut" aria-hidden="true"></th></tr></thead></table></div><div class="tableScroll"><table class="ds-table" aria-label="Rule Reference data rows"><colgroup><col style="width:56px"><col style="width:110px"><col style="width:140px"><col><col style="width:70px"></colgroup><tbody>${vref||'<tr><td class="empty" colspan="5">No rules fired.</td></tr>'}</tbody></table></div></div>
        <div class="splitbox splitcard">`
        + `<div class="vheadwrap"><table class="ds-table vheadtab" id="vHead"><caption class="sr-only">Validation issue list — column headers.</caption>${issueFragCols()}<thead>${issueHeadRow()}</thead></table></div>`
        + `<div class="tableScroll vtableWrap"><table class="ds-table"><caption class="sr-only">Validation issue list — every individual issue found, with severity, rule, document number, field, value, message, source tab and row number.</caption>${grid.colgroupHTML()}<tbody id="vBody">${issueView.length?issueRows(issueView):issueEmpty()}</tbody></table></div>`
        + `</div>
      </div>
    </details>`;
  panel.querySelector('#vCsv').onclick=()=>{ if(!issueView.length){ toast('Nothing to export','info'); return; } downloadCSV(xp('issue_list')+'.csv', issuesCSV(model, issueView)); toast('CSV downloaded','success'); };
  // L2 sorting (I-92): delegated handler on the scroll container, so the header (rebuilt on
  // each sort) keeps working; the CSV reads the same sorted array the table shows.
  const vsc = panel.querySelector('.vtableWrap');
  const vTbl = vsc ? vsc.querySelector('table') : null;
  const vHead = panel.querySelector('#vHead');
  // L3 windowing (I-96) + a body painter that both paths share
  const paintBody = () => { const tb = panel.querySelector('#vBody'); if(tb) tb.innerHTML = issueView.length ? issueRows(issueView) : issueEmpty(); };
  const fullBody = () => issueView.length ? issueRows(issueView) : issueEmpty();
  const win = makeWindow(vsc, {
    rowHeight: 40, overscan: 8, total: () => issueView.length,
    render: (s, e) => issueView.slice(s, e).map(issueRowHTML).join(''), full: fullBody
  });
  // I-116 — the sort buttons now live in the HEADER FRAGMENT, so that is what the handler binds to.
  if(vHead) wireSort(vHead, issueCols, isort, ()=>{
      issueView = dsSorted(issueView, issueCols, isort, issueGet);
      if(win.enabled) win.redraw(); else paintBody();
    }, 'issue_sort', issueHeadRow);
  // I-114 — wire the panel-local rule filter. Sorting re-sorts the CURRENT (already filtered)
  // subset, so the selection survives a sort; CSV reads `issueView`, so export parity is automatic.
  const ruleSelEl = panel.querySelector('#vRule');
  if(ruleSelEl) ruleSelEl.onchange = onRuleChange;
  // No in-panel column filters on this panel (removed 2026-10-20); the column-visibility
  // chooser below is the only popover here.
  const iHead = panel.querySelector('.head-actions');
  // L3 grid (I-95): chooser + resize. The header is rebuilt on every sort, so the grips
  // are re-attached whenever the grid refreshes.
  // I-116 — the header now lives in its own table, so the resizer is given BOTH halves: grips attach
  // in the fragment, and every width is written to both colgroups.
  const iResize = (vTbl && vHead) ? grid.resizer(vTbl, vHead) : null;
  grid.chooser(iHead);
  grid.refresh = () => {
    if(vTbl){
      const cg = vTbl.querySelector('colgroup'); if(cg) cg.innerHTML = grid.colgroupHTML().replace(/^<colgroup>|<\/colgroup>$/g, '');
    }
    if(vHead){
      const hcg = vHead.querySelector('colgroup'); if(hcg) hcg.innerHTML = issueFragCols().replace(/^<colgroup>|<\/colgroup>$/g, '');
      const th = vHead.querySelector('thead'); if(th) th.innerHTML = issueHeadRow();
    }
    if(iResize) iResize.addGrips();
    if(win.enabled) win.redraw(); else paintBody();
  };
  // §7.2.15 invariant 5 — the pair MUST fit the display area whenever it can.
  fitToScroller(grid, vsc, () => grid.refresh());
  // §18 split-header contract (3, 5) — width pin + gutter + horizontal lock-step, shared helper.
  wireSplitHeader(panel, '#vHead', '.vtableWrap');
  /* §7.2.15 — keep the split header on the same column grid as the body AND cover the
     scrollbar area. The header fragment is sized to the scroller's BORDER box (so the
     navy reaches the card edge instead of leaving a white notch), and its gutter column
     is given the scrollbar width, so the five data columns still line up exactly.
     Re-synced whenever the scroller's box changes — a scrollbar appearing or disappearing
     changes clientWidth with no window resize, so a resize listener is not enough. */
  // §18 split-header contract — the shared helper; the Rule Reference and the matrix now share ONE
  // implementation, so neither can drift from the contract.
  wireSplitHeader(panel, '#vref .vheadtab', '#vref .tableScroll');
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
const projPrefix = () => { const n=(MODEL&&MODEL.meta&&MODEL.meta.workbookName)||'MDL'; return n.replace(/\.(xlsx|xlsm)$/i,''); };
const xp = b => projPrefix() + '-' + b;

// ---------- boot / welcome ----------
export function boot(root){
  const year = new Date().getFullYear();
  root.innerHTML = `<style>${CSS}</style>
  <div class="welcome-screen"><div class="welcome">
    <img class="wlogo" src="${LOGO_DATA}" alt="logo">
    <h1>Master Document List Dashboard</h1>
    <p class="sub">Interactive dashboard. Load the workbook to validate data, explore status and details.</p>
    <div class="expect"><b>What this does</b> — Select your Code-sheet workbook (.xlsx)… Drop it below or click to browse.</div>
    <div class="drop">
      <div class="d-title">Drop your workbook here</div>
      <div class="d-sub">or click to browse</div>
      <label class="btn btn-primary">Choose Workbook<input type="file" id="file" accept=".xlsx,.xlsm" style="display:none"></label>
    </div>
    <div class="privacy"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 1 3 5v6c0 5 3.4 9.7 9 11 5.6-1.3 9-6 9-11V5l-9-4zm0 10.9h7c-.5 4-3 7.3-7 8.3V12H5V6.3l7-3.1V12z"/></svg> Works fully offline — your data never leaves this browser</div>
    <div class="copyright">© ${year} UESH</div>
  </div></div>`;
  const input = root.querySelector('#file');
  const drop = root.querySelector('.drop');
  const loadFile = async f => {
    if(!f) return;
    try{
      const buf = await f.arrayBuffer();
      const wb = await readXlsx(buf);
      const model = buildModel(wb, { workbookName: f.name });
      renderDashboard(root, model);
    }catch(err){ console.error(err); showError('Failed to parse workbook: ' + err.message); }
  };
  input.onchange = e => { const f = e.target.files[0]; if(f) loadFile(f); };
  ['dragenter','dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.add('hover'); }));
  ['dragleave','dragend'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('hover'); }));
  drop.addEventListener('drop', e => { e.preventDefault(); e.stopPropagation(); drop.classList.remove('hover'); const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]; if(f) loadFile(f); });
  // Expose for harness-layout Tier 3 injection (§3.8.5) — never called in normal browser use.
  if(typeof window !== 'undefined') window._loadFile = loadFile;
}
