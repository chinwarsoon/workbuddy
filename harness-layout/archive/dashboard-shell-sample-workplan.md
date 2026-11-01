# Dashboard Shell Sample — Workplan

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-30 | opencode (AI) | First issue. Records the shell study, the review sample (Rev 1.1), the measured evidence, the spec conflicts, and the open review decisions. Status: FOR REVIEW. |

- **Document ID:** HARNESS-SHELL-WP-001
- **Status:** 🔶 FOR REVIEW — the artefact is built and verified; decisions D1–D7 are open.
- **Object:** the application shell that the root `Dashboard-UI-Design-Spec.md` requires, studied and
  rendered as a review sample before any project dashboard adopts it.
- **Owner:** repository owner.
- **Related:** `harness-layout/README.md` Rev 1.2, `harness-layout/samples/README.md` Rev 1.0,
  `harness-layout/samples/dashboard-shell-sample.html` Rev 1.1.

## 1. Index

1. Index
2. Scope summary
3. Dependencies
4. Evaluation and alignment
5. Phases and task breakdown
6. Risks and mitigation
7. Success criteria
8. Review decisions
9. References

## 2. Scope summary

| ID | Item | Category | Status | Phase |
|---|---|---|---|---|
| S1 | Read the shell rules in the root spec (§3.1–§3.3, §3.5, §3.6, §4, §5, §6, §7.1, §7.2, §8) and in `AGENTS.md` §18 | Study | ✅ COMPLETE | P1 |
| S2 | Build a standalone sample page with all five shell zones | Code | ✅ COMPLETE | P2 |
| S3 | Add a harness config for the sample (excluded from the default run) | Code | ✅ COMPLETE | P2 |
| S4 | Capture screenshots for review (light, dark, dark + Settings, 1280, search) | Evidence | ✅ COMPLETE | P3 |
| S5 | Measure the shell and record the spec conflicts | Study | ✅ COMPLETE | P3 |
| S6 | Write the study/review document and link it from the harness README | Docs | ✅ COMPLETE | P4 |
| S7 | Resolve decisions D1–D7 and align one source of truth | Review | 🔶 FOR REVIEW | P5 |

Out of scope: changing any project dashboard, changing the root spec, adding a welcome overlay or a
pipeline area to the sample, and loading real workbook data.

## 3. Dependencies

| Dependency | Use | State |
|---|---|---|
| `Dashboard-UI-Design-Spec.md` (root) | Normative shell, panels, KPI, tokens, tables | Present; newer than `AGENTS.md` 1.15 |
| `harness-layout/spec/Dashboard-UI-Design-Spec.md` | Bundled copy for the harness | Present |
| `AGENTS.md` §18 | Competing shell rules | Present |
| `harness-layout/harness.mjs` | Tier 1 and Tier 2 checks | Present |
| Playwright Chromium | Tier 2 and screenshots | Installed |
| `sub/TWRP C3B2 - Document Submittal Dashboard.html` | Reference implementation of the five zones | Present |

## 4. Evaluation and alignment

- The sample follows the harness config pattern used by `checks/mdl.mjs`, `checks/ppp.mjs` and
  `checks/sub.mjs`; the leading `_` in `_shellreview.mjs` keeps it out of the default run.
- The sample is self-contained (inline CSS and module script, no external asset), which matches the
  standalone-delivery rule of the spec §3.9 and the harness rule that a dashboard must not depend on
  repository `common/` assets.
- Design tokens are copied from spec §6 and are theme-scoped, so all five themes can be reviewed.
- No project dashboard is changed, so no project workplan, `knowledge.json`, or `log/` entry is
  affected.

## 5. Phases and task breakdown

### P1 — Study (2026-10-30)

- Read the root spec sections named in S1 and the reference shell in
  `sub/TWRP C3B2 - Document Submittal Dashboard.html`.
- Compare the spec shell with `AGENTS.md` §18.2, §18.4, §18.7 and §18.8.
- Deliverable: the conflict list in `samples/README.md` §4.

### P2 — Sample build (2026-10-30)

| Task | Item | Files | Status |
|---|---|---|---|
| T2.1 | Title bar: logo chip, title, meta line, right-aligned page label | `samples/dashboard-shell-sample.html` | ✅ COMPLETE |
| T2.2 | One-row menu bar: toggle, Load, Export; filters, Search, Warnings; layout toggle at the right end | same | ✅ COMPLETE |
| T2.3 | Menu-only navy sidebar with Settings and Help pinned to the bottom; collapse and drag resize (180–480 px) | same | ✅ COMPLETE |
| T2.4 | Content: warning area then body; KPI panel at full width; two panels below; no toolbar | same | ✅ COMPLETE |
| T2.5 | Status bar, five themes, Settings and Help dialogs, page switch, filter and search popovers, layout cycle | same | ✅ COMPLETE |
| T2.6 | Revision 1.1: chip text at `--text` with a status dot; `--amber-ink` for warning codes; sidebar 190 px | same | ✅ COMPLETE |
| T2.7 | Harness config, explicit only | `checks/_shellreview.mjs` | ✅ COMPLETE |

### P3 — Verification (2026-10-30)

| Task | Check | Result |
|---|---|---|
| T3.1 | `node harness.mjs --dashboard _shellreview --tier 1` | 8 passed, 0 failed, 1 skipped (no pipeline) |
| T3.2 | `node harness.mjs --dashboard _shellreview --tier 2` | 23 passed, 0 failed |
| T3.3 | Geometry: title bar 77.7 px, menu bar 49 px, sidebar 190 px, status bar 30 px, KPI 72 px | Measured |
| T3.4 | KPI columns: 5 at 1440 (6 cards → 5 + 1), 4 at 1280 (4 + 2); no horizontal overflow | Measured |
| T3.5 | Sidebar collapses to 0 and resizes to 310 px; layout cycles 1 → 2 → 3; page switch keeps the shell | Measured |
| T3.6 | Screenshots: light, dark, dark + Settings, 1280, search | `samples/*.png` |

### P4 — Documentation (2026-10-30)

- `samples/README.md` Rev 1.0: anatomy, measurements, findings, conflicts, deviations, review asks.
- `harness-layout/README.md` Rev 1.2: revision row, Samples section, `_shellreview` command.
- This workplan Rev 1.0.

### P5 — Review (pending)

- Owner decides D1–D7 in §8.
- Then update one source of truth (spec or `AGENTS.md` §18) in the same edit cycle (§24, §29).
- Then a follow-up phase adopts the approved shell in a project dashboard. That phase gets its own
  workplan; this one is closed at that point.

## 6. Risks and mitigation

| Risk | Impact | Mitigation |
|---|---|---|
| Spec and `AGENTS.md` §18 diverge | Two competing shells; each dashboard picks differently | D1–D7; then align one source |
| Sidebar 160 px too narrow for "Forward and Overdue" | Wrapped labels; uneven shell rhythm | Sample uses 190 px; D1 decides |
| Sample drifts from a real dashboard | The review baseline does not survive adoption | Adopt the sample markup as the baseline; keep the harness checks |
| Tier 2 depends on Playwright | Skips on a machine without Chromium | Tier 1 still validates structure |
| The sample is mistaken for a product page | Wrong expectations in review | README states review-only scope; no real data |

## 7. Success criteria

- [x] The sample renders all five shell zones at 1440 and 1280 with no page scroll and no horizontal
      overflow.
- [x] Tier 1 and Tier 2 pass with zero failures.
- [x] Measurements and conflicts are written down and reproducible.
- [ ] D1–D7 are decided and recorded.
- [ ] One source of truth (spec or `AGENTS.md` §18) is updated to match the decision.

## 8. Review decisions

| ID | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | Sidebar width | Keep 160 px and shorten the label, or raise to 190 px | Raise to 190 px; the longest label needs about 179 px |
| D2 | Settings and Help | Left sidebar bottom (spec §3.2) or menu bar (`AGENTS.md` §18.2) | Left sidebar bottom, as the spec and the sample show |
| D3 | File loading | Menu-bar `Load Workbook` (spec §3.2) or left-sidebar panel (`AGENTS.md` §18.7) | Menu bar, as the spec |
| D4 | Content toolbar | None (spec §3.3) or a toolbar strip (`AGENTS.md` §18.2) | None, as the spec |
| D5 | Layout toggle | Menu-bar right end (spec §3.2) or title bar (`AGENTS.md` §18.8) | Menu-bar right end, as the spec |
| D6 | Theme picker | Menu-bar dropdown (`AGENTS.md` §18.4) or none in the menu bar (spec §3.2) | Keep it in Settings until the spec names a place |
| D7 | Panel title weight | 700 (spec §4) or 600 (spec §6 type scale) | 600, to match the type scale |

## 9. References

- `Dashboard-UI-Design-Spec.md` — §3.1 title bar, §3.2 menu bar and sidebar, §3.3 content, §3.5
  warnings, §3.6 status bar, §3.7 welcome, §3.8 pipeline, §3.9 standalone delivery, §4 panels,
  §5 KPI cards, §6 tokens, §7.2 tables, §8 conformance.
- `AGENTS.md` — §5 Rules 1–2 and 18, §13 revision control, §15 workplan, §18.2/§18.4/§18.7/§18.8.
- `harness-layout/samples/dashboard-shell-sample.html` Rev 1.1.
- `harness-layout/samples/README.md` Rev 1.0.
- `harness-layout/checks/_shellreview.mjs`.
- `harness-layout/harness.mjs` Tier 1 and Tier 2.
- `sub/TWRP C3B2 - Document Submittal Dashboard.html` — reference shell.
