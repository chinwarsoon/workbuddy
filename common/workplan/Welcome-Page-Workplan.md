# Welcome Page Redesign — Workplan (WP-WELCOME-001)

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.3.1 | 2026-11-27 | CodeBuddy (AI) | **Welcome 1.3.1 (spec §3.7 rev 1.113).** Owner decision: after the success hold ends, the painted done step stays visible before the dashboard opens. New `doneDwellMs` config (0–10000 ms, default 0). MDL sets 3000 ms. Dashboard version stays 1.9. Validation: common 73 / 0; MDL build OK (`common-version` 1.3.1); shell 125 / 0; render 190 / 13 pre-existing; harness 282 / 2 (Tier 1 baseline) / 2 advisory / 24 skipped; Tier 7 43–53 and check 51 PASS. See common U014 and MDL TL043. |
| 1.3.0 | 2026-11-27 | CodeBuddy (AI) | **Welcome 1.3.0 (spec §3.7 rev 1.112).** Owner request: the MDL welcome holds 10 seconds before the dashboard opens and shows `Rev 1.9 · © 2026 UESH`. Common changes: `HOLD_MAX` 10000, schema maximum 10000, auto mode keeps step 2 current until load starts, and the done step paints before the opener. MDL keeps dashboard rev 1.9; no MDL version bump. Validation: common 70 / 0; MDL build OK (`common-version` 1.3.0); shell 125 / 0; render 190 / 13 pre-existing; harness 281 / 2 (Tier 1 baseline); Tier 7 43–53 and check 51 PASS. See common U013 and MDL TL041. |
| 1.2.1 | 2026-11-27 | CodeBuddy (AI) | **C-07 fixed.** Welcome 1.2.1 removes the duplicate auto-mode action text. The MDL config keeps one instruction below the task heading. Workplan version aligns with the module version. MDL rebuilt with `common-version` 1.2.1: common 70 / 0; shell 125 / 0; render 190 / 13; harness 281 / 2 (Tier 1 shell-zone baseline), Tier 7 43–53 and check 51 PASS. See common U012 and MDL TL039. |
| 1.2 | 2026-11-27 | AWS Quick (AI) | **W3.1 DONE** (owner run 2026-11-27). common 70 / 0; MDL build OK (common-version 1.2.0); shell 125 / 0; render 190 passed / 13 pre-existing of 203 checks; harness 281 passed / 2 failed (Tier 1 shell-zone baseline) / 2 advisory / 24 skipped; Tier 7 43–53 and check 51 PASS. Common `C-04`, `C-05`, `C-06` and MDL `I-165` RESOLVED. Next: W4 (PPP) on common 1.2.1 / spec rev 1.111. |
| 1.1 | 2026-11-27 | AWS Quick (AI) | **W3.1 re-scoped to welcome 1.2.0 — two-column card** (owner approval 2026-11-27, reference picture; common `C-06`). Spec rev 1.111 written (both copies, SHA256 `2764BA0E…977D81`); `AGENTS.md` 1.22; common 1.2.0 written (1.1.0 not released to PPP or Sub); harness 1.44 written; MDL config texts and test patterns written. Decision D18 added; D15 superseded. W4 and W5 now target 1.2.0 / rev 1.111. W3.1 stays IN PROGRESS until the Node tests, the MDL rebuild and the harness run pass. |
| 1.0 | 2026-11-27 | AWS Quick (AI) | **Phase W3.1 — welcome layout 1.1.0** (owner approval 2026-11-27; common `C-04`, `C-05`; MDL `I-165`). Spec rev 1.110 written (both copies, SHA256 `0E518CFE…0DBE9`); `AGENTS.md` 1.21; common welcome 1.1.0 written; harness 1.43 written; MDL re-adoption edits written (opener handler, `ui_help.json` 1.1, test regexes, `checks/mdl.mjs` `extraFile`). W3.1 is IN PROGRESS: the Node tests, the MDL rebuild and the harness run are still needed. W4 and W5 now target common 1.1.0 and spec rev 1.110. Decisions D14–D17 added. |
| 0.9 | 2026-11-26 | CodeBuddy (AI) | **C-03 resolved.** Welcome 1.0.2 uses a named `role="group"` drop area and the native `Choose file` keyboard path. Spec rev 1.109, harness rev 1.42, common test 32 / 0. MDL rebuilt: harness 269 passed / 2 failed. |
| 0.8 | 2026-11-26 | CodeBuddy (AI) | **W3 marked DONE.** MDL adopted `CommonWelcome` 1.0.1. Common C-02 resolved; C-03 deferred for review before W4. Harness MDL 268 passed / 2 failed. |
| 0.7 | 2026-11-26 | AWS Quick (AI) | **W2 marked DONE** (owner approval). Evidence: common `C-01` `RESOLVED` (common U002): `node common/test/welcome.test.mjs` 28 passed / 0 failed (Node v20.18.0); `node harness-layout/harness.mjs` rev 1.41 gave the expected `SKIP 51` and `SKIP Tier 7` lines for MDL, PPP and Sub, and no new FAIL. Pre-existing FAIL baselines recorded in W2 for W3–W5 to compare against. |
| 0.6 | 2026-11-26 | AWS Quick (AI) | **Moved to `common/workplan/`** (owner instruction: a shared design's workplan belongs to `common/`; each dashboard keeps its own main workplan). This plan now holds the shared design only: decisions, spec (W1), the `common/welcome` module and harness checks (W2), the sequence and a per-dashboard status table. The W3–W5 implementation detail moved into MDL §11.35, PPP §8.16 (P9) and the Sub follow-up phase. The rev 0.5 file is archived as `sub/archive/Welcome-Page-Workplan_v0.5_2026-11-26.md`. Common `C-01` is `RESOLVED` (common U002: 28 / 0 tests; harness six expected SKIP lines, no new FAIL). |
| 0.5 | 2026-11-26 | AWS Quick (AI) | W2 files written. `common/` 1.0.0 created (9 files; common issue `C-01` `OPEN_PARTIAL` until Node tests run). `harness.mjs` rev 1.41: gated Tier 7 welcome check (43–50) and Tier 1 version check (51); SKILL 1.30, README, harness U017. `.gitignore` adds `common/test_output/`. W2 is PARTIAL: `node common/test/welcome.test.mjs` and a harness run are still needed on a machine with Node.js and Playwright. |
| 0.4 | 2026-11-26 | AWS Quick (AI) | Owner approved the `common/` model (decisions C1–C3): shared welcome code lives in `common/welcome/` and is inlined at build time by each project. `AGENTS.md` rev 1.18 and spec rev 1.108 (§3.9 shared sources, assertion 51) written; harness sync recorded (SKILL 1.29, U016). W2 rewritten to create `common/`; W3–W5 adopt `CommonWelcome`. Decisions D11–D13 added. |
| 0.3 | 2026-11-26 | AWS Quick (AI) | Owner approved W1 and the per-project records. UI spec rev 1.107 written (both copies, SHA256 `1BF42934…41763`); `AGENTS.md` rev 1.17. Issues logged as `OPEN`: MDL `I-164` (workplan §11.35), PPP `I-103` (workplan §8.16 P9, v1.60), Sub `I155` + `I154` (workplan rev 3.37). W1 marked DONE. Saved to `sub/workplan/`. |
| 0.2 | 2026-11-26 | AWS Quick (AI) | Owner instruction: "UI spec update first, then MDL, PPP and Sub in sequence." Phases reordered: W1 spec, W2 shared tokens + harness checks (gated), W3 MDL, W4 PPP, W5 Sub, W6 close-out. Each dashboard phase is a separate approval. Spec text drafted in `Spec-3.7-Welcome-Draft.md`. |
| 0.1 | 2026-11-26 | AWS Quick (AI) | First draft for owner review. Session workspace only; not in the repository. Covers L1–L7, P1–P6, Sub step-2 option A, findings R1–R5 and issue `I154`. |

- **Document ID:** WP-WELCOME-001 (proposed)
- **Location:** `common/workplan/Welcome-Page-Workplan.md` (shared design plan, AGENTS.md §3 rev 1.19). Each dashboard's own main workplan holds its implementation plan and points here.
- **Status:** W1, W2 and W3 DONE (2026-11-26). W3.1 DONE (2026-11-27). W4–W6 OPEN, not started. Each phase starts only after owner approval (AGENTS.md §5 Rules 1, 2, 18).
- **Issues:** MDL `I-164` `RESOLVED` · PPP `I-103` `OPEN` · Sub `I155`, `I154` `OPEN`. Common `C-02` and `C-03` `RESOLVED`.
- **Reference mockup:** session artifact `welcome-mockup.html` rev 0.4.

## 0. Contents

1. [Title and description](#1-title-and-description)
2. [Objective](#2-objective)
3. [Scope summary](#3-scope-summary)
4. [Decisions captured](#4-decisions-captured)
5. [Dependencies](#5-dependencies)
6. [Evaluation and alignment with existing architecture](#6-evaluation-and-alignment-with-existing-architecture)
7. [Implementation phases](#7-implementation-phases)
8. [Risks and mitigation](#8-risks-and-mitigation)
9. [Potential future issues](#9-potential-future-issues)
10. [Success criteria](#10-success-criteria)
11. [References](#11-references)

## 1. Title and description

One welcome page design for the three dashboards: MDL, PPP and Sub. A configuration for each dashboard
controls the differences. The configuration gives the title, the instruction, the required files, the
load mode and the load phases. The work changes the spec §3.7 first, then the shared design tokens,
then each dashboard, then the harness.

## 2. Objective

- Make the welcome page clear: one heading, one instruction, one slot for each required file.
- Show the status and the errors on the file that they are about.
- Show the load progress on the welcome page. Today the Sub status message goes to the hidden status bar (R1).
- Remove the differences between the MDL and Sub welcome pages (A6).
- Fix the spec non-conformances F1–F8.

## 3. Scope summary

| ID | Details | Category | Status | Phase |
|---|---|---|---|---|
| L1 | One heading and one instruction. Remove the subtitle and the instruction card. One text scale. | Layout | PLANNED | W3–W5 |
| L2 | One slot for each required file, with four states: needed, checking, accepted, rejected. Errors show on the slot. A set error shows once, above the slots. | Layout | PLANNED | W3–W5 |
| L3 | One primary button. `Choose files` is secondary. Multi-file Load button shows `n of N`. | Layout | PLANNED | W3–W5 |
| L4 | Full-screen drop target with an overlay (AGENTS.md §18.7). | Interaction | PLANNED | W3–W5 |
| L5 | Load phases in the welcome card: Reading → Checking → Building. `aria-busy`; reduced-motion support. | Feedback | PLANNED | W3–W5 |
| L6 | Card width `clamp(480px, 45vw, 640px)`. Card stays fluid. | Layout | PLANNED | W2–W5 |
| L7 | Page footer: privacy note, version, copyright year from code. Help link opens the Help dialog. | Layout | PLANNED | W3–W5 |
| P1 | MDL fixes F1, F2, F4, F5, A1, A2 (merged with L1–L3). | Compliance | PLANNED | W3 |
| P2 | Sub fixes F5, F6, F8, A2, A3, A5 (merged with L1–L3). | Compliance | PLANNED | W5 |
| P3 | All welcome text in `ui_help.json` (MDL, PPP, Sub). | Compliance | PLANNED | W3–W5 |
| P4 | Shared welcome tokens in `common/universal_ui_design.css`. | Design system | PLANNED | W2 |
| P5 | Spec §3.7 and §8.2 changes. | Spec | PLANNED | W1 |
| P6 | Welcome checks in `harness-layout`. | Test | PLANNED | W2 |
| R1 | Sub load status goes to the hidden status bar. Fixed by L5. | Finding | PLANNED | W5 |
| R2 | Sub check status is one text line. Fixed by L2. | Finding | PLANNED | W5 |
| R3 | MDL reads the whole file before any Code-sheet check. | Finding | PLANNED | W3 |
| R4 | No load progress in MDL and Sub. Fixed by L5. | Finding | PLANNED | W3–W5 |
| R5 | Sub test hook `window._loadFile` sorts files by file name. Issue Sub `I154`. | Finding | PLANNED | W5 |

## 4. Decisions captured

| # | Decision | Date |
|---|---|---|
| D1 | L1–L7 approved for the review package. | 2026-11-25 |
| D2 | MDL and PPP: one file, one step. The load starts after the file check. No Load button. | 2026-11-25 |
| D3 | Sub: two files (Master Document List, Document Submittal Log). | 2026-11-25 |
| D4 | Sub step 2: option A — keep the Load click after both files pass. | 2026-11-25 |
| D5 | P1–P6 approved. P1 and P2 merge with L1–L3. | 2026-11-26 |
| D6 | Welcome card stays fluid. The golden ratio applies to the drop area only. | 2026-11-26 |
| D7 | R5 gets an issue record in `sub/log/issue_log.md`. | 2026-11-26 |
| D8 | PPP loads in one step. The PPP welcome code was not inspected. | 2026-11-26 |
| D9 | Main workplan location: `sub/workplan/`. | 2026-11-26 |
| D10 | Sequence: UI spec first, then MDL → PPP → Sub. | 2026-11-26 |
| D11 | Option A: shared source in `common/`, inlined at build time; each delivered HTML stays standalone (C1). | 2026-11-26 |
| D12 | `common/` is designed for many modules (C2). | 2026-11-26 |
| D13 | Only the `welcome` module is established now (C3). | 2026-11-26 |
| D14 | One card height in every welcome state: the drop area and the load stage are one fixed-ratio box (spec §3.7.1 rev 1.110). | 2026-11-27 |
| D15 | ~~The file list is pinned to the bottom of the drop area; the action group is centred above it; gaps 32 px above, 12 px below, 20 px card bottom.~~ Superseded by D18. | 2026-11-27 |
| D16 | 1–6 required files (1–3 one line, 4–6 two columns); a file goes only to the slot of its own type; extra or unrequired files go to one ignored-file summary (common `C-04`). | 2026-11-27 |
| D17 | Success hold after a successful load: default 1.5 s, 0–3 s, `Open now` / Enter / Escape to skip. | 2026-11-27 |
| D18 | Two-column welcome card: top bar (logo, Help), navy guide panel (title, description, three steps, check list) and task panel (heading, instruction, drop box, file list, action row, footer), split 1 : 1.618; fixed column row 600 px; Choose primary until all files are ready (owner reference picture). File list maximum 6. | 2026-11-27 |

## 5. Dependencies

- Spec §3.7 must change (W1) before code changes, because the code must follow the spec.
- Both spec copies must stay byte-identical: root `Dashboard-UI-Design-Spec.md` and `harness-layout/spec/` (spec §3.9).
- W3–W5 need the tokens and gated checks from W2. W4 (PPP) reuses the W3 (MDL) pattern.
- Open MDL issues `I-146`…`I-150` change other MDL areas. Check for conflicts in `MDL/src/render.mjs` before W3.

## 6. Evaluation and alignment with existing architecture

| Area | Alignment |
|---|---|
| Spec §3.7 | L1–L3, L5 and L7 add detail. The card-ratio SHOULD is removed (D6). |
| AGENTS.md §18.1 | Text from `ui_help.json` (P3). No CDN fonts. |
| AGENTS.md §18.2 / §3.9 | Welcome stays a full-screen overlay, inlined into the standalone HTML. |
| AGENTS.md §18.3 | Tokens only in `common/universal_ui_design.css`. No hex in component rules. |
| AGENTS.md §18.7 | Drop on the full page (L4). The default-path `fetch()` button is not shown in standalone delivery (conflict with §3.9; P5 states this). |
| Spec §3.7 content rule | Files are sorted by Dashboard Title, not by file name. `I154` fixes the test hook. |
| Spec §7.1 | Buttons use the 32 px `--btn-h` token. |

**Proposed welcome configuration** (one object for each dashboard, in `ui_help.json` + source contract):

| Key | MDL | PPP | Sub |
|---|---|---|---|
| `files` | 1 (Master Document List) | 1 (Procurement Package Plan) | 2 (Master Document List, Document Submittal Log) |
| `mode` | `auto` | `auto` | `confirm` |
| `phases` | Reading, Checking, Building | Reading, Checking, Building | Reading, Checking, Building |
| Step indicator | No | No | Yes (2 steps) |
| Load button | No | No | Yes |

## 7. Implementation phases

Timeline: to be set by the owner. Timestamp each phase at start and end (§15).

Sequence (owner instruction 2026-11-26): **spec first, then MDL → PPP → Sub**. Each phase starts only
after the owner approves it. Each dashboard phase closes (tests, logs, report) before the next starts.

### W1 — UI spec update (P5) — DONE 2026-11-26

- **Update:** root spec and `harness-layout/spec/` copy to rev 1.107; `AGENTS.md` §18.2 welcome bullet + revision row 1.17.
- **Content:** see draft `Spec-3.7-Welcome-Draft.md` (§3.7.1–3.7.9, §6 tokens, §8.2 assertions 43–50).
- **§8.4:** record MDL, PPP and Sub as open conformance items against 43–50 until W3–W5 close.
- **Success:** both spec copies have the same SHA256; all § references resolve; owner approves the text.
- **Result:** spec rev 1.107 in both copies, SHA256 `1BF42934EAECFB69C4A26F08F1B95F7D1B1ED9FA7A06F24AC808B3EC8E941763`; §3.7.1–§3.7.9, five §6 tokens, §8.2 assertions 43–50; `AGENTS.md` §18.2 bullet + rev 1.17.

### W2 — Create `common/` with the welcome module; gated harness checks (P4, P6) — DONE 2026-11-26

- **Create (new folder, AGENTS.md §3 rev 1.18):**
  - `common/README.md` — module list, module contract, build use, change procedure.
  - `common/manifest.json` — version `1.0.0`, one entry `welcome` (namespace `CommonWelcome`, spec §3.7 rev 1.107).
  - `common/welcome/welcome.css` — §3.7 layout, the five `--welcome-*` tokens, `.cw-*` classes; uses the project theme tokens only.
  - `common/welcome/welcome.mjs` — `export const CommonWelcome = { render(root, config, handlers), … }`: slots, `auto` / `confirm` modes, step indicator, load phases, drag overlay, footer, help link.
  - `common/welcome/welcome.schema.json` — the §3.7.2 configuration schema.
  - `common/build/inline-common.mjs` — `inlineCommon({ modules }) → { css, js, version }`; one strip rule set; fails on more than one top-level export.
  - `common/test/welcome.test.mjs` — Node tests for both modes and all slot and phase states.
  - `common/log/issue_log.md`, `common/log/update_log.md` — canonical logs (IDs `C-nn`).
- **Harness:** new welcome check (assertions 43–50) and version check (assertion 51), both gated per dashboard and off until that dashboard's phase enables them.
- **No project file changes in W2.**
- **Success:** `common/test/` passes; the welcome CSS uses only tokens; the new checks run and skip the not-yet-migrated dashboards.
- **Result (2026-11-26):** all files written; 31 static checks pass on `common/`.
  - `node common/test/welcome.test.mjs`: **28 passed / 0 failed** (Node v20.18.0).
  - `node harness-layout/harness.mjs` (rev 1.41): `SKIP 51 common-version` and `SKIP Tier 7 welcome page` for MDL, PPP and Sub, as expected; no new FAIL (common U002). Sub ran with `python sub/serve.py --port 8765`.
  - Common `C-01` → `RESOLVED`.
- **Pre-existing FAIL baseline at W2** (not caused by W2; each adoption phase compares against it):

| Dashboard | FAIL lines | Checks | Source |
|---|---|---|---|
| MDL | 2 | Tier 1 "dashboard defines stable shell zone markers"; Tier 1 "content declares filter-area and body zones" | Owner run 2026-11-26; matches MDL I-163 record |
| PPP | 2 | Tier 3 "status bar shows selected file and version"; Tier 4c "I-161: every body table uses the shared --ds-zebra colour" | Owner run 2026-11-26; to confirm as pre-existing in PPP P9-01 |
| Sub | 5 (derived) | Not listed here | Common U002 gives nine in total; 9 − 2 − 2 = 5. The Sub FAIL lines were not reviewed in this plan; Sub WEL-S10 records them before adoption. |


### W3–W5 — Dashboard adoption (detail in each dashboard's own workplan)

The implementation plan for each dashboard lives in that dashboard's main workplan. This plan tracks
only the sequence and the status. Order: MDL → PPP → Sub. Each phase starts only after owner approval
and after the previous phase closes.

| Phase | Dashboard | Mode | Main workplan section | Issues | Status |
|---|---|---|---|---|---|
| W3 | MDL | `auto` (1 file) | `MDL/MDL-Dashboard-Workplan.md` §11.35 | MDL `I-164` | DONE 2026-11-26 |
| W3.1 | MDL | `auto` (1 file) | `MDL/MDL-Dashboard-Workplan.md` §11.36 — welcome 1.2.0, two-column card | MDL `I-165`; common `C-04`, `C-05`, `C-06` | DONE 2026-11-27 |
| W4 | PPP | `auto` (1 file) | `PPP/PPP-Dashboard-Workplan.md` §8.16 (P9) | PPP `I-103` | OPEN — not started |
| W5 | Sub | `confirm` (2 files) | `sub/workplan/Sub-Dashboard-Workplan.md` — follow-up phase "Welcome page" | Sub `I155`, `I154` | OPEN — not started |

**Target for W4 and W5 (from 2026-11-27):** common welcome **1.2.0**, spec §3.7 **rev 1.111** (two-column card). The load handler returns an opener function, so the module can show the success hold before the dashboard paints.

**Common rules for every adoption phase** (the dashboard sections carry the project detail):
- The build calls `inlineCommon({ modules: ['welcome'] })` and writes `<meta name="common-version">`.
- The welcome calls `CommonWelcome.render()` with the dashboard's configuration from `ui_help.json`.
- The old welcome CSS and markup are archived before removal (AGENTS.md §6).
- The phase adds the `welcome` block to `harness-layout/checks/<name>.mjs`, which enables Tier 7 and check 51.
- The dashboard's `knowledge.json` records the common version.

### W6 — Close-out

- Final harness run across all three dashboards; §8.4 conformance items closed.
- Cross-reference check of revision numbers (§13); `I154` → `ALIGNED`.

## 8. Risks and mitigation

| Risk | Mitigation |
|---|---|
| MDL code also changes for `I-146`…`I-150`. | Check open MDL work before W3; do W3 after those items close. |
| Spec copies drift. | Edit the root copy, then copy byte-identical; compare SHA256. |
| Load-phase updates slow the load. | Update the DOM only at the three phase points; yield one frame between phases. |
| MDL auto load starts on the wrong file. | Code-sheet check before the full read (R3). |
| PPP welcome code is unknown (D8). | Read the PPP code at the start of W3; report differences before edits. |
| Harness checks fail on old samples. | Gate the new checks by configuration, as for other harness tiers. |

## 9. Potential future issues

- A dashboard with three or more files: the slot model supports N files; the drop area may need more height.
- A default-path load for a served (non-standalone) build: needs a spec decision.
- Remembered file names (`sub-dashboard-file-names`) may need a "last used" hint in the slots.

## 10. Success criteria

- All Tier 7 welcome checks (43–50) and check 51 pass for MDL, PPP and Sub.
- Spec conformance F1–F8 closed.
- No new failures in existing pipeline, render and harness runs.
- Load progress visible on the welcome page in all three dashboards.
- `I154` reaches `RESOLVED`, then `ALIGNED`.

## 11. References

- `Dashboard-UI-Design-Spec.md` rev 1.108, §3.7, §3.9, §7.1, §8.2 (assertions 43–51)
- `AGENTS.md` rev 1.18 §3 (common design code)
- `AGENTS.md` §5, §13, §15, §16, §18.1–18.7, §26, §27
- `.codebuddy/rules/approval-gate.md`
- `MDL/src/render.mjs` — `boot()`, `loadFile`
- `sub/engine/dashboard.js` — `acceptSelection()`, `rejectSelection()`, `readAndBuild()`, `updateFiles()`, `window._loadFile`
- `sub/engine/dashboard.css` — `.welcome-screen`, `.onboarding`, `.welcome-err`
- Review mockup `welcome-mockup.html` rev 0.4 (session artifact, 2026-11-25; not in the repository)
