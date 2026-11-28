# common/ — Issue Log

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.10 | 2026-11-28 | CodeBuddy (AI) | **C-08 crosshair regression closed.** Spec rev 1.116 adds arrow-key navigation; tokens 1.3.1 sets strong 14% / 22%; pinned cells layer the tint; harness 1.51 checks arrow keys, row-head availability, the computed 2px ring, the pinned strong tier and body theme. Validated in U019 and MDL TL045 — tokens 178 / 0, shell 127 / 0, harness 366 / 2 baseline, no crosshair failure. |
| 1.9 | 2026-11-28 | CodeBuddy (AI) | **C-08 resolved.** Six-theme chrome tokens, welcome theme picker, and MDL adoption closed. Status summary `IN_PROGRESS` 1 → 0, `RESOLVED` 7 → 8. Validated in MDL TL044 — tokens 160 / 0, welcome 73 / 0, grid 45 / 45, shell 125 / 0, render 190 / 13 pre-existing, harness 343 / 2 baseline. |
| 1.7 | 2026-11-28 | CodeBuddy (AI) | **Reconstructed after the file was accidentally cleared.** Rebuilt from U001–U012 and `common/workplan/Welcome-Page-Workplan.md`. No byte-exact backup existed. All seven issues stay `RESOLVED`. |
| 1.8 | 2026-11-28 | AWS Quick (AI) | **`C-08` logged**, `IN_PROGRESS`, for the chrome-token / six-theme rework (new `common/tokens` module, welcome 1.4.0 theme picker). Files written; Node tests not yet run. |
| 1.6 | 2026-11-27 | AWS Quick (AI) | **C-04, C-05 and C-06 → `RESOLVED`.** C-05 is superseded by C-06. Evidence in U011. |
| 1.5 | 2026-11-27 | AWS Quick (AI) | **C-06 logged.** Two-column welcome card (spec rev 1.111). Evidence in U009. |
| 1.4 | 2026-11-27 | AWS Quick (AI) | **C-04 and C-05 logged.** File classification rule and fixed-size welcome box (spec rev 1.110). Evidence in U008. |
| 1.3 | 2026-11-26 | CodeBuddy (AI) | **C-03 → `RESOLVED`.** Named `role="group"` drop area and native file button. Evidence in U006. |
| 1.2 | 2026-11-26 | CodeBuddy (AI) | **C-02 → `RESOLVED`.** Removed `role="button"` from `.cw-drop`. **C-03 → `DEFERRED_REVIEW`.** Evidence in U005. |
| 1.1 | 2026-11-26 | CodeBuddy (AI) | **C-01 → `RESOLVED`.** Common tests 28 / 0 and harness SKIP lines with no new FAIL. Evidence in U002. |
| 1.0 | 2026-11-26 | AWS Quick (AI) | **Log created** with common 1.0.0. C-01 logged. Evidence in U001. |

---

## 1. Title and description

**common/ — Issue Log** — the shared design source used by the dashboards in this repository.

Single log for every issue raised against the `common/` design source: its status, the evidence behind it,
the work item that closed it, and the dated update that records the close. This log uses the canonical
five-section format from AGENTS.md §26.11.

| Field | Value |
|---|---|
| Log status | **ACTIVE** — the one and only issue log for `common/` |
| ID scheme | `C-nn` (shared namespace; keep `common` in cross-references, e.g. `common C-07`) |
| IDs used | C-01 … C-08 |
| Next free ID | **C-09** |
| Format | Canonical (AGENTS.md §26.11) |
| Related sources | `common/log/update_log.md` (U001–U014) · `common/workplan/Welcome-Page-Workplan.md` · `common/manifest.json` · `Dashboard-UI-Design-Spec.md` §3.7 · `AGENTS.md` §3 and §18.2 |
| Row count | 8 |
| Recovery note | Reconstructed on 2026-11-28 from update-log and workplan evidence. The file was empty and untracked. No byte-exact backup existed. |

**How to read this log**

- §2 defines the status codes and severity markers.
- §3 counts all ten status codes and gives the grand total.
- §4 lists open work in processing order, then the closed issues in ID order.
- §5 holds the full register in ID order with the nine canonical fields.

---

## 2. Legend

### 2.1 Status codes

The **code** is the source of truth. The marker is for display only. Codes follow AGENTS.md §26.3.

| Code | Marker | Meaning |
|---|---|---|
| `OPEN` | 🔴 | Issue raised and accepted, no implementation started |
| `IN_PROGRESS` | 🟣 | Approved work under way |
| `DEFERRED` | ⏸️ | Parked with a recorded rationale |
| `DEFERRED_STUDY` | 🔍 | Parked for study before a decision |
| `DEFERRED_REVIEW` | ⏳ | Parked for owner review |
| `WONT_IMPLEMENT` | ⛔ | Closed with a recorded decision not to implement |
| `OPEN_PARTIAL` | 🟠 | Part of the issue is delivered, part is still open |
| `APPROVED` | 🔵 | Approved for implementation, work not started |
| `RESOLVED` | ✅ | Work delivered and verified |
| `ALIGNED` | 🔗 | Resolved and documentation sync completed |

### 2.2 Severity markers

| Marker | Meaning |
|---|---|
| 🟠 High | A defect that blocks a tier check or a keyboard path |
| 🟡 Medium | A design or behavior gap that needs a change |
| — | Not stated in the source evidence |

---

## 3. Status summary

All ten codes are listed with zero counts included (AGENTS.md §26.3).

| Code | Count | IDs |
|---|---:|---|
| `OPEN` 🔴 | 0 | — |
| `IN_PROGRESS` 🟣 | 0 | — |
| `DEFERRED` ⏸️ | 0 | — |
| `DEFERRED_STUDY` 🔍 | 0 | — |
| `DEFERRED_REVIEW` ⏳ | 0 | — |
| `WONT_IMPLEMENT` ⛔ | 0 | — |
| `OPEN_PARTIAL` 🟠 | 0 | — |
| `APPROVED` 🔵 | 0 | — |
| `RESOLVED` ✅ | 8 | C-01, C-02, C-03, C-04, C-05, C-06, C-07, C-08 |
| `ALIGNED` 🔗 | 0 | — |
| **Total** | **8** | C-01 … C-08 (8 resolved) |

---

## 4. Priority resolution sequence

### 4.1 Pending list

No issue is in progress. The next free ID is C-09.

### 4.2 Closed list

| # | Issue | Closed | Status | Evidence |
|---:|---|---|---|---|
| 1 | C-01 | 2026-11-26 | `RESOLVED` ✅ | U001, U002 |
| 2 | C-02 | 2026-11-26 | `RESOLVED` ✅ | U005 |
| 3 | C-03 | 2026-11-26 | `RESOLVED` ✅ | U005, U006 |
| 4 | C-04 | 2026-11-27 | `RESOLVED` ✅ | U008, U011 |
| 5 | C-05 | 2026-11-27 | `RESOLVED` ✅ | U008, U011, superseded by C-06 |
| 6 | C-06 | 2026-11-27 | `RESOLVED` ✅ | U009, U011 |
| 7 | C-07 | 2026-11-27 | `RESOLVED` ✅ | U012 |
| 8 | C-08 | 2026-11-28 | `RESOLVED` ✅ | U019, MDL TL045 |

---

## 5. Issue table

Canonical fields: `ID | Date | Phase | Severity | Title | Description | Status | Tasks | Resolution`
(AGENTS.md §26.2).

| ID | Date | Phase | Severity | Title | Description | Status | Tasks | Resolution |
|---|---|---|---|---|---|---|---|---|
| **C-01** | 2026-11-26 | W2 | — | Create shared design source | U001 created `common/` 1.0.0 with the README, manifest, welcome module, schema, inline helper, tests and both logs. No dashboard file changed. | `RESOLVED` ✅ — 2026-11-26 | WP-WELCOME-001 W2 | U002 closed after common tests 28 / 0 and harness SKIP lines with no new FAIL. |
| **C-02** | 2026-11-26 | W3 | 🟠 High | Remove invalid drop-area role | U005 found `role="button"` on `.cw-drop`, which failed Tier 1. | `RESOLVED` ✅ — 2026-11-26 | WP-WELCOME-001 W3 | U005 removed the role in welcome 1.0.1 and updated the manifest, README 1.0.2 and test. |
| **C-03** | 2026-11-26 | W3 | 🟠 High | Named drop area with native button | U005 logged an unnamed drop area and a duplicate tab stop. U006 set a named `role="group"` with no `tabindex` and the native `Choose file` button as the keyboard path. | `RESOLVED` ✅ — 2026-11-26 | WP-WELCOME-001 W3 | U006 updated spec rev 1.109 and harness assertion 45. Common 32 / 0. MDL harness 269 passed / 2 failed. |
| **C-04** | 2026-11-27 | W3 | 🟡 Medium | File classification rule | U008 added a pure `plan()`, the own-type slot rule, an ignored-file summary and support for 1–6 files. | `RESOLVED` ✅ — 2026-11-27 | WP-WELCOME-001 W3 | U008 delivered welcome 1.1.0. U011 closed with common 70 / 0 and harness 281 passed / 2 failed. |
| **C-05** | 2026-11-27 | W3 | 🟡 Medium | Fixed-size welcome box | U008 kept one box for the drop area and the load stage so the card height stayed fixed. C-06 later replaced this layout with the two-column card. | `RESOLVED` ✅ — 2026-11-27 | WP-WELCOME-001 W3 | U008 delivered the fixed box. U011 closed as resolved because C-06 superseded the design. |
| **C-06** | 2026-11-27 | W3.1 | 🟡 Medium | Two-column welcome card | U009 delivered the spec rev 1.111 card: top bar with Help, navy guide panel, task panel, file list and footer. | `RESOLVED` ✅ — 2026-11-27 | WP-WELCOME-001 W3.1 | U009 delivered welcome 1.2.0. U011 closed with common 70 / 0, shell 125 / 0, render 190 / 13 pre-existing and Tier 7 PASS. |
| **C-07** | 2026-11-27 | W3.1 | 🟡 Medium | Duplicate auto-mode instruction | U012 found the `actAuto` text twice under the task heading in auto mode. | `RESOLVED` ✅ — 2026-11-27 | WP-WELCOME-001 W3.1 | U012 removed the duplicate in welcome 1.2.1. Common 70 / 0. Shell 125 / 0. Harness 281 passed / 2 failed. |
| **C-08** | 2026-11-28 | W4 | 🟡 Medium | Chrome surfaces fill with one navy token; Sky/Ocean/Presentation near-identical darks; no theme control before load; crosshair overlay opaque instead of translucent | Owner review 2026-11-27/28 with a reworked sample (theme-sample.html rev 0.3, approved). The title bar, status bar and table header all pointed at one hard-coded dark `--navy`, so `light` never read as light. `sky`, `ocean` and `presentation` were hue-shifted copies of one dark theme with no distinct identity. No Settings dialog exists before the first load, so the welcome page always showed in `light` regardless of the saved preference. **Reopened 2026-11-28**: a prior `RESOLVED` mark on this row (citing MDL TL044 — tokens 160/0, welcome 73/0, harness 343/2) does not match the owner's own fresh test run the same day (`MDL-Dashboard.html` still stale at common-version 1.3.1; welcome 69/4; render 189/14; harness 305/40 incl. 36 Tier 8 failures) — the two accounts conflict and have not been reconciled; treat the earlier `RESOLVED` entry as unverified until a fresh build and test run confirms one or the other. Separately, the owner then reported the crosshair rendering with a strong, undampened colour and unreadable background text; traced to `--crosshair-track`/`-intersection`/`-overlay` being painted as an OPAQUE `background-image` fill (first via `var(--soft)`, a mistaken fix, then via `color-mix(..., var(--surface))`, still opaque) instead of a true translucent overlay — violating the owner's 20-point crosshair contract on 5 points (opaque fill hides zebra/status colour; outline 1px not 2px; no bold headers; no row-header right edge; one flat opacity instead of light/dark-differentiated tiers). | `RESOLVED` ✅ — 2026-11-28 | common `workplan/Theme-Rework-Workplan.md` (WP-THEME-001) | New `common/tokens` module (six themes incl. `contrast`; `--chrome-*` / `--thead-*` / `--nav-*` tokens; distinct accent per theme) and welcome 1.4.1 `themePicker` config key delivered. `tokens.css` 1.3.0 adds `--crosshair-faint/-medium/-strong`, a true `color-mix(in srgb, var(--accent) N%, transparent)` 3-tier ladder (7/13/14% light-family, 12/20/22% dark-family, all AA-verified against `--surface` and `--ds-zebra`). MDL `render.mjs` rev 1.7 repaints the crosshair with `background-color` (true alpha, blends with zebra/status colour underneath), a 2px outline, bold headers, and a new row-header right-edge rule. MDL was rebuilt and the full suite was rerun. Tokens 178 / 0, Welcome 73 / 0, Grid 45 / 45, Shell 127 / 0, Render 190 / 203 (13 pre-existing), Harness 366 / 2 baseline. Arrow keys, row-head availability, the 2px ring and the pinned strong tier all pass. See U019 and MDL TL045. |
