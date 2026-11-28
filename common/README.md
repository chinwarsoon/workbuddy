# common/ — shared design source for the dashboards

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0.11 | 2026-11-28 | CodeBuddy (AI) | Module table aligned with `manifest.json` 1.4.4: `tokens` 1.3.1, `welcome` 1.4.1. Spec rev 1.116 adds arrow-key crosshair navigation. |
| 1.0.9 | 2026-11-27 | CodeBuddy (AI) | Welcome module 1.3.1 (spec rev 1.113): `doneDwellMs` holds the painted done step before the opener. MDL sets 3000 ms; dashboard version stays 1.9. |
| 1.0.10 | 2026-11-28 | AWS Quick (AI) | Module table: added `tokens` 1.0.0 (new); `welcome` -> 1.4.0 (optional top-bar `themePicker`). Removed `tokens` from the future-candidates note, since it now exists. |
| 1.0.8 | 2026-11-27 | CodeBuddy (AI) | Welcome module 1.3.0 (spec rev 1.112): 10000 ms hold limit, visible step 2 in auto mode, and the done step before the dashboard opener. MDL holds 10 seconds with `Rev 1.9 · © 2026 UESH`; dashboard version stays 1.9. |
| 1.0.7 | 2026-11-27 | CodeBuddy (AI) | Welcome module 1.2.1: removed the duplicate `actAuto` text (common C-07). One instruction sits below the task heading. |
| 1.0.6 | 2026-11-27 | AWS Quick (AI) | Welcome module 1.2.0 (spec rev 1.111): two-column card (top bar, guide panel, task panel). Config gains `description`, `checks[]` and `brand`. 1.1.0 was not released to PPP or Sub. |
| 1.0.5 | 2026-11-27 | AWS Quick (AI) | Welcome module 1.1.0 (spec rev 1.110): fixed-height layout, file list at the bottom of the drop area, 1–6 files, ignored-file summary, success hold. Load handlers may return an opener function for the success hold. |
| 1.0.4 | 2026-11-26 | AWS Quick (AI) | Module table: MDL adopted `welcome` 1.0.2 (W3 DONE); PPP and Sub not yet adopted. Docs only. |
| 1.0.3 | 2026-11-26 | CodeBuddy (AI) | Welcome module 1.0.2: named `role="group"` drop area, `Choose file` as the keyboard path (common C-03). |
| 1.0.2 | 2026-11-26 | CodeBuddy (AI) | Welcome module 1.0.1: removed `div role="button"` from the drop area (common C-02). |
| 1.0.1 | 2026-11-26 | AWS Quick (AI) | Added `workplan/` for shared-design workplans (AGENTS.md §3 rev 1.19). First: `workplan/Welcome-Page-Workplan.md` (WP-WELCOME-001). |
| 1.0.0 | 2026-11-26 | AWS Quick (AI) | Created with the `welcome` module (UI spec §3.7 rev 1.107). Build-time only (AGENTS.md §3 rev 1.18, spec §3.9 rev 1.108). WP-WELCOME-001 W2. |

## 1. Purpose

`common/` holds design **source** code that more than one dashboard uses. Each project build inlines
the modules it needs into its single HTML file. A delivered HTML never references `common/`, so it can
be copied and run alone from `file://` (spec §3.9).

## 2. Workplans

| Workplan | ID | Scope |
|---|---|---|
| `workplan/Welcome-Page-Workplan.md` | WP-WELCOME-001 | Shared welcome design (spec §3.7). Each dashboard's own workplan holds its adoption tasks: MDL §11.35, PPP §8.16, Sub follow-up phase. |

## 2a. Modules

| Module | Version | Namespace | Spec | Used by |
|---|---|---|---|---|
| `tokens` | 1.3.1 | — (CSS-only) | §6 / AGENTS.md §18.4 rev 2026-11-28 | MDL adopted through `build.mjs`; PPP (W4) and Sub (W5) — not yet adopted |
| `welcome` | 1.4.1 | `CommonWelcome` | §3.7 rev 1.116 | MDL — adopted 1.4.1 (theme picker, common `C-08`); PPP (W4) and Sub (W5) — not yet adopted |

Other modules (shell, xlsx, controls, table, chart) are future candidates. Each needs an
approved workplan. See §6. (`tokens` is no longer a candidate — it exists, see the table above.)

## 3. Module contract (every module)

1. Build-time only. No `href`, `src`, `import` or `fetch` to `common/` in a delivered HTML.
2. Exactly one top-level export: `export const Common<Name> = { … }`. No other top-level names.
3. No imports, except modules listed in its manifest `dependsOn` (inlined first by the helper).
4. No project data. All project values (titles, files, phases, text, version, logo) are passed in.
5. CSS: tokens only, no literal colour in a component rule; class names use the module prefix
   (`welcome` → `.cw-*`); no `min-height` override on buttons.
6. CSS order: project theme tokens → common module CSS → project overrides. A project MUST NOT
   redeclare a token that a common module defines.
7. Revision header (§13) in every file; a docstring for every function (§11); status and errors go
   to the `onStatus` callback that the project passes in.
8. A Node test in `common/test/` that runs with no browser and no project.

## 4. Use in a project build

```js
import { inlineCommon } from '../common/build/inline-common.mjs';
const common = inlineCommon({ modules: ['welcome'] });
// common.css  → put BEFORE the project CSS
// common.js   → put BEFORE the project code in the single inline script
// common.meta → put in <head>: <meta name="common-version" content="1.0.0">
```

## 5. Change procedure (AGENTS.md §3, §24, §29)

1. Log the issue in `common/log/issue_log.md` (`C-nn`); get owner approval.
2. Edit the module. Bump the module version and the manifest version (semver).
3. Run `node common/test/welcome.test.mjs`.
4. In the same edit cycle, rebuild, test and harness-check every dashboard that uses the module, and
   add an update-log record in each project. Or record a pin in that dashboard's workplan.

## 6. Adding a module

Approved workplan + `C-nn` issue → `common/<name>/` + manifest entry + test file + a row in §2 →
migrate one dashboard first, then the others, each in its own phase → archive the replaced code (§6).
