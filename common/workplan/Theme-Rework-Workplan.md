# Theme System Rework — Workplan (WP-THEME-001)

| Revision | Date | Author | Summary |
|---|---|---|---|
| 0.4 | 2026-11-28 | CodeBuddy (AI) | **Crosshair regression validated.** CSS specificity fixes, test-probe closure, MDL rebuild at 436,311 bytes and a full suite rerun. Tokens 178 / 0, shell 127 / 0, harness 366 / 2 baseline, no crosshair failure. MDL version stays 1.9. See MDL TL045. |
| 0.3 | 2026-11-28 | CodeBuddy (AI) | **Crosshair regression closed for spec rev 1.116.** Arrow-key navigation, pinned-cell tint, strong-tier ranges, token test resolver and harness checks complete. MDL version stays 1.9. Validated in rev 0.4 — see MDL TL045. |
| 0.2 | 2026-11-28 | CodeBuddy (AI) | **W4 and W5 DONE.** Node tests run after the MDL rebuild; MDL theme close in render 1.6 and config 1.9.4. W6 (PPP and Sub adoption) stays PLANNED. Validated in MDL TL044 — tokens 160 / 0, welcome 73 / 0, grid 45 / 45, shell 125 / 0, render 190 / 13 pre-existing, harness 343 / 2 baseline. |
| 0.1 | 2026-11-28 | AWS Quick (AI) | **Workplan created.** Owner-approved theme-rework package drafted in session (`Theme-Rework-Review-Package.md`, `theme-sample.html` rev 0.3). Steps W1–W6 defined. W1 and W2 applied; W3–W6 pending. |

---

## 1. Title and description

**Theme System Rework — Workplan** — the shared design plan for the six-theme chrome-token rework
raised as common issue `C-08`. Owned under `common/workplan/` because the design (tokens, chrome
rules, welcome theme picker) is shared across every dashboard, per the standing rule that a
shared-design workplan lives here and each dashboard keeps its own workplan section pointing back
to it (see `AGENTS.md` §3, and `Welcome-Page-Workplan.md` D9/D10 for the precedent).

| Field | Value |
|---|---|
| Plan status | **MDL adoption DONE** — W1 to W5 complete. W6 (PPP and Sub adoption) stays PLANNED. |
| Issue | common `C-08` (chrome-token / six-theme rework) |
| Related sources | `common/log/issue_log.md` (C-08) · `common/log/update_log.md` (U016+) · `AGENTS.md` §18.4 rev 2026-11-28 · `Dashboard-UI-Design-Spec.md` §6 / §8.2 rev 1.114 · `harness-layout/harness.mjs` rev 1.47 (Tier 8) |
| Each dashboard's own workplan | MDL: own workplan section tracks adoption; PPP and Sub: not yet started |

## 2. Problem found (owner review, 2026-11-27/28)

- T1: MDL's `boot()` never called `applyShellPrefs()`, so the welcome page always rendered `light`
  regardless of the saved theme preference.
- T2: MDL's old `dark` theme gave `--welcome-left-bg`/`-fg` near-identical dark values (~1.03:1) —
  unreadable.
- T3: MDL's `dark` theme never overrode status colors (OK/warn/error/chip), so dark mode kept
  light-tuned colors on a dark background.
- T4: ~65 hard-coded hex colors found directly in MDL's CSS template literal, bypassing tokens.
- T5: chart colors came from fixed JS arrays (`COLORS`, `PALETTE`) that never varied by theme.
- Naming mismatch: MDL used `light, dark, navy, contrast, sepia`; the spec's six names are
  `light, dark, sky, ocean, presentation, contrast`.
- No mechanism existed for a user to change theme on the welcome page (no Settings dialog before
  the first file loads).
- Owner rejected the first sample draft (dark-navy-everywhere "light" theme, near-identical
  sky/ocean/presentation darks) and approved the rebuilt rev 0.3 sample: chrome tokens split from
  page-painting fill, six themes each with a distinct hue family, and a welcome-page theme picker.

## 3. Work items

| # | Item | Area | Status | Phase |
|---|---|---|---|---|
| W1 | `AGENTS.md` §18.4 rewrite (six themes; chrome-token rule; distinct-accent rule; welcome picker required) + spec §6/§8.2 additions (new tokens; assertion 54). | Spec | **DONE** | W1 |
| W2 | New `common/tokens` module (`tokens.css`, `tokens.schema.json`, `common/test/tokens.test.mjs`); `common/manifest.json` entry; `common/welcome` → 1.4.0 (`themePicker` config key, menu markup, `onThemeChange` call, matching CSS); `common/README.md` module table. | common | **DONE** | W2 |
| W3 | Harness Tier 8 `lintThemes()` in `harness.mjs` (config-gated by `cfg.themes`, same SKIP pattern as Tier 7); `SKILL.md` and `update_log.md` sync rows. | harness-layout | **DONE** | W2 |
| W4 | Node test run of `common/test/tokens.test.mjs` and the full common suite against the new module. | common | **DONE** | W2 |
| W5 | MDL adoption: call `applyShellPrefs()` before `CommonWelcome.render()` (fixes T1); wire `WELCOME_CONFIG.themePicker`; delete the local hard-coded `:root`/`[data-theme]` CSS blocks for the inlined `common/tokens/tokens.css`; replace `COLORS`/`PALETTE` JS arrays with a `CHART()` function reading `--chart-1..6` at paint time; rename MDL's theme keys `navy`/`sepia` → `sky`/`ocean`/`presentation` (old saved values fall back to `light`, the existing fallback — not a crash). `MDL/build.mjs` tokens inlining. MDL's own issue-log row and workplan section. | MDL | **DONE** | W3 |
| W6 | PPP and Sub theme adoption. | PPP, Sub | PLANNED | W4–W5 |

## 4. Decisions captured

| # | Decision | Date |
|---|---|---|
| D1 | Six themes: `light, dark, sky, ocean, presentation, contrast`. Each needs a distinct accent/chart family — no hue-shifted duplicate darks. | 2026-11-27 |
| D2 | Chrome surfaces (title bar, status bar, table header, nav rail) get their own tokens (`--chrome-*`, `--thead-*`, `--nav-*`), not one hard-coded navy fill. Navy becomes an accent, not a page-painting color. | 2026-11-27 |
| D3 | `presentation` theme uses a warm amber accent (not blue) for projector visibility. | 2026-11-27 |
| D4 | A theme picker is required on the welcome page (no Settings dialog exists before the first load). The `common/welcome` module renders the control but never touches `localStorage`/`document.documentElement` itself — the project's own existing Settings handler keeps doing the persistence/apply, preserving the "no project data / no global side effect" module contract. | 2026-11-27 |
| D5 | Workplan location: `common/workplan/Theme-Rework-Workplan.md` (shared-design rule, same as Welcome-Page-Workplan.md D9/D10). | 2026-11-28 |
| D6 | Sequence: spec first (W1), then `common/tokens` + `common/welcome` + harness Tier 8 (W2), then MDL adoption (W3), then PPP/Sub (W4–W5). | 2026-11-28 |
| D7 | Next free common issue ID is `C-08` (confirmed by re-reading the live issue log before use — an earlier draft had assumed the now-taken `C-07`). | 2026-11-28 |

## 5. Validation status

| Step | Common tests | Harness | Notes |
|---|---|---|---|
| W2 (tokens + welcome 1.4.1) | Tokens 160 / 0. Welcome 73 / 0. | — | Run after the MDL rebuild. See MDL TL044. |
| W3 (Tier 8) | — | Harness 343 passed / 2 failed (Tier 1 baseline) / 2 advisory / 24 skipped | `lintThemes()` runs for MDL through `cfg.themes`; assertion 54 checks the delivered welcome theme picker. |
