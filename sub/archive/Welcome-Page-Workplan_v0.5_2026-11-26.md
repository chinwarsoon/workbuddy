# Welcome Page Redesign — Workplan (WP-WELCOME-001)

| Revision | Date | Author | Summary |
|---|---|---|---|
| 0.5 | 2026-11-26 | AWS Quick (AI) | W2 files written. `common/` 1.0.0 created (9 files; common issue `C-01` `OPEN_PARTIAL` until Node tests run). `harness.mjs` rev 1.41: gated Tier 7 welcome check (43–50) and Tier 1 version check (51); SKILL 1.30, README, harness U017. `.gitignore` adds `common/test_output/`. W2 is PARTIAL: `node common/test/welcome.test.mjs` and a harness run are still needed on a machine with Node.js and Playwright. |
| 0.4 | 2026-11-26 | AWS Quick (AI) | Owner approved the `common/` model (decisions C1–C3): shared welcome code lives in `common/welcome/` and is inlined at build time by each project. `AGENTS.md` rev 1.18 and spec rev 1.108 (§3.9 shared sources, assertion 51) written; harness sync recorded (SKILL 1.29, U016). W2 rewritten to create `common/`; W3–W5 adopt `CommonWelcome`. Decisions D11–D13 added. |
| 0.3 | 2026-11-26 | AWS Quick (AI) | Owner approved W1 and the per-project records. UI spec rev 1.107 written (both copies, SHA256 `1BF42934…41763`); `AGENTS.md` rev 1.17. Issues logged as `OPEN`: MDL `I-164` (workplan §11.35), PPP `I-103` (workplan §8.16 P9, v1.60), Sub `I155` + `I154` (workplan rev 3.37). W1 marked DONE. Saved to `sub/workplan/`. |
| 0.2 | 2026-11-26 | AWS Quick (AI) | Owner instruction: "UI spec update first, then MDL, PPP and Sub in sequence." Phases reordered: W1 spec, W2 shared tokens + harness checks (gated), W3 MDL, W4 PPP, W5 Sub, W6 close-out. Each dashboard phase is a separate approval. Spec text drafted in `Spec-3.7-Welcome-Draft.md`. |
| 0.1 | 2026-11-26 | AWS Quick (AI) | First draft for owner review. Session workspace only; not in the repository. Covers L1–L7, P1–P6, Sub step-2 option A, findings R1–R5 and issue `I154`. |

- **Document ID:** WP-WELCOME-001 (proposed)
- **Location:** `sub/workplan/Welcome-Page-Workplan.md` (main copy). Each project workplan has its own section that points here.
- **Status:** W1 DONE (2026-11-26). W2–W6 OPEN, not started. Each phase starts only after owner approval (AGENTS.md §5 Rules 1, 2, 18).
- **Issues:** MDL `I-164` · PPP `I-103` · Sub `I155`, `I154` — all `OPEN`.
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

### W2 — Create `common/` with the welcome module; gated harness checks (P4, P6) — PARTIAL 2026-11-26

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
- **Result (2026-11-26):** all files written. 31 static checks pass on `common/`. Open: run `node common/test/welcome.test.mjs` and `node harness-layout/harness.mjs` (expect two new SKIP lines per dashboard and unchanged PASS / FAIL counts). Then close common `C-01` and mark W2 DONE.

### W3 — MDL (P1, P3, L1–L7, R3, R4) — `auto` mode — MDL `I-164`, workplan §11.35

- **Update:** `MDL/build.mjs` calls `inlineCommon({ modules: ['welcome'] })` and writes the `common-version` meta tag; `boot()` calls `CommonWelcome.render()` with the MDL configuration from `ui_help.json`; MDL `knowledge.json` records the common version; MDL tests.
- **Content:** one slot; Code-sheet check first, then automatic load; load phases; footer; help link.
- **Remove after adoption:** the old `.welcome*` CSS and markup in `render.mjs` (archive first, §6).
- **Before start:** check `src/render.mjs` for open changes from other MDL work.
- **Close:** enable the MDL welcome and version checks; MDL logs, test report, `knowledge.json`, workplan §11.35.

### W4 — PPP (P3, L1–L7) — `auto` mode — PPP `I-103`, workplan §8.16 (P9)

- **Before start:** read the PPP welcome code (not yet inspected, D8) and report the gaps.
- **Update:** `PPP/build.mjs` calls `inlineCommon` inside the IIFE bundle and writes the meta tag; PPP welcome calls `CommonWelcome.render()` with the PPP configuration; PPP tests.
- **Close:** enable the PPP welcome and version checks; PPP logs, report, `knowledge.json`, workplan P9.

### W5 — Sub (P2, P3, L1–L7, R1, R2, R4, R5) — `confirm` mode — Sub `I155`, `I154`, workplan follow-up phase (rev 3.37)

- **Update:** `sub/build/standalone.mjs` calls `inlineCommon` (common CSS before `dashboard.css`) and writes the meta tag; the welcome markup in the HTML template is replaced by the `CommonWelcome` root; `dashboard.js` passes the Sub configuration and the `acceptSelection` / `readAndBuild` handlers; the three phase points in `readAndBuild()` report to the module; `window._loadFile` uses the Code-sheet check path (`I154`); `render.test.mjs`.
- **Remove after adoption:** the old `.onboarding` / `.welcome-err` CSS and markup (archive first).
- **Close:** enable the Sub welcome and version checks; Sub logs, report, `knowledge.json`; `I155` and `I154` → `RESOLVED`.

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

- All W5 welcome checks pass for MDL, PPP and Sub.
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
