# Project Action Log — Workplan & Issue/Requirements Log

> **Document role**: Master workplan for the single-file **Project Action Log / Action Tracker** (`index.html`). It consolidates architecture, design decisions, the issue register, and the success checklist. It is a **living document** — future issues, requirements, and updates are appended here (see §11 *Logging convention*).
> **Primary artifact**: `index.html` (single-file SPA) + `action.json` (data) + `setup.json` (UI config).
> **Notes on verification**: all code changes were verified by *structural review only* (the shell was unavailable for live browser/runtime checks). Items marked "implemented (structural)" still need a Chrome smoke test (see §10.5 and §14).

---

## 1. Summary

The Project Action Log is a single-file HTML application (Apple-style, token-driven) that tracks actions across **projects → disciplines → statuses / priorities / members**. It evolved from a "create card" UI into a fully **inline-editable detail panel** with schema-driven metadata and a dual-file persistence model.

**Current maturity (as of 2026-08-20):**
- **Dual-file architecture**: `action.json` (pure business data) + `setup.json` (pure UI config), each with its own Save button and dirty-check.
- **Schema v2 (SSOT)**: every list item carries a stable unique `id`; actions reference projects/disciplines/statuses/priorities/members **by id**, eliminating rename/delete orphans and silent data loss.
- **Five standardized Settings lists** (Projects, Disciplines, Members, Statuses, Priorities) share one inline-list component; popups are reserved for *selection only*.
- **Soft-delete** for actions (status `Deleted`, kept until physically removed in Settings → Deleted); **soft-delete (left)** for members (record kept, references always resolvable).
- **Blocking reassign-on-delete**: deleting any referenced list item requires the user to reassign (or explicitly remove) every reference first — no cascade, no silent loss.
- **UI quality pass**: dark-mode accent, selection tokens, colored report bars, sticky modal footers, empty-state CTAs, unsaved-change guard, a11y (focus-visible, ARIA, Esc-to-close, keyboard nav).

**Status of Schema v3 (relations + scheduling, §9.4)**: **Phase 1 (asset-split, ISS-01…ISS-10) Done**; **Phase 2 relations Done** — B1 parent/child WBS (ISS-11/12/13) and B2 `deps[]`/reference points (ISS-14…ISS-18/25/26) implemented; **B3 scheduling Done** — `schedule` object + leaf editor (ISS-19/20), duration-weighted progress rollup (ISS-21), Info status + `isScheduled()` exclusion (ISS-22), WBS-conflict guard (ISS-33), Split dependency inheritance (ISS-34) — all implemented, `node --check` passed on all 7 files; **live browser smoke test (ISS-32) pending**. B4 consistency (ISS-23/24) and Phase 3 (custom fields + workflow rules, ISS-28/ISS-29) still open; P2 refinements: tree "Unassigned" node (ISS-30 — Done), dependsOn warning on physical delete (ISS-31 — plan proposed).

---

## 2. Revision History

| Rev | Date | Author / Trigger | Scope |
|-----|------|-----------------|-------|
| v1 | 2026-08-19 | Initial working session | Started as `workplan_schema_split.md` (dual-file + priority + soft-delete plan) |
| v2 | 2026-08-19 | Iteration rounds | Added UI review (§10), soft-delete (§11), multi-assignee (§12), per-project disciplines (§13), list standardization (§14), data-consistency audit (§15), schema v2 deletion redesign (§16) |
| v3 | 2026-08-20 | User request | **Renamed & restructured** into `project_action_log_workplan.md`; added Summary, Revision History, TOC, Requirements for AI Agents, Workflow Logic charts, Function Table, Metadata & Relations, Schema/SSOT/Back-compat, Issue List + Success Checklist, Deliverables, Glossary, Constraints/Risks, References. Converted to a living log (§11). |
| v4 | 2026-08-20 | User request | Expanded §5.1 into two explicit launch approaches (Local HTTP server vs Direct `file://` open) and added §5.5 behavior matrix for Save/Load/Export/Import across the two modes. |
| v5 | 2026-08-20 | Live test (desktop copy) | **Issue found & fixed**: served page silently showed defaults despite `action.json` returning HTTP 200. Root cause was twofold — (a) **stale browser cache** of an older `index.html` (resolved by hard refresh `Ctrl+Shift+R`), and (b) `autoLoad()` swallowed `res.json()` errors so any real failure looked identical to "file not found". Hardened `autoLoad()` in WorkBuddy `index.html` to be **UTF-8 BOM-tolerant** and to **surface the real HTTP status / parse error** in the toast + console. Logged under §11 (`2026-08-20` Issue entries). |
| v6 | 2026-08-20 | User approval (design review) | Adopted **Schema v3** (parent/child WBS ≤3 tiers, `deps[]` FS/SS/FF/SF+lag with same-project rule, `referencePoints[]` cross-project anchors, multi-date `schedule`, `progress` duration-weighted parent rollup, "Info" status → schedule-excluded) and **file-split architecture** (asset split: `index.html` shell + `styles.css` + 7 JS modules; `gantt.html` deferred to future). Added §9.4, §9.5, §16 (canonical Issue & Task Register ISS-01…ISS-27). All future work tracked by issue ID. |
| v7 | 2026-08-20 | User request (clarity) | **Consolidated §10 into §16.** §10 retired to a pointer; its historical UI-review (P0-1…P2-c) and data-consistency (DC-1…DC-5) issues moved to §16.5 (closed archive), and its v2 Definition of Done moved to §16.6. Registered open functions F18–F21 as new ISS-28…ISS-31, plus ISS-32 for the long-pending Chrome smoke test (formerly a DoD checkbox). §7 F18–F21 now cross-reference their ISS IDs. §16 is now the single source of truth for all work. |
| v8 | 2026-08-20 | Cleanup pass | Reconciled stale cross-references and schema narrative: §6.4 → §16.5.1; §7 F10/F11/F12 §16.8/§16/§16.9 → §8.1–§8.2/§5.3/§9.3; F18–F21 refs off §6.x/§15.6 onto ISS-28…ISS-31; §11 & §14 dead "§10.3" → §16.4 ISS-32; §15 ISS range → ISS-01…ISS-32; §16.4 ISS-30 ref fixed. Clarified §1/§9 that Schema v3 is *designed & adopted* but **not yet implemented** (still v2 in code). |
| v9 | 2026-08-20 | Executed ISS-01…ISS-10 | **Phase 1 asset-split refactor completed** (pure restructure, no behavior change): extracted `styles.css` (old `<style>` 7–333); split the single IIFE into 7 classic `<script>` modules — `core.js`, `editor.js`, `report.js`, `io.js`, `render.js`, `settings.js`, `bootstrap.js` (load order validated by a node harness; no top-level cross-module reference errors); rewrote `index.html` to a shell (`<link>` + 7 ordered `<script src>`, IIFE wrapper removed, 2522→309 lines); updated `run_action_log.bat` to copy all 8 assets. `index.html.bak` kept as a rollback. **ISS-32 (Chrome smoke test of both launch modes) still pending** — must confirm after copy + hard refresh. ISS-11…ISS-26 (Schema v3) are now unblocked. |
| v10 | 2026-08-20 | Executed ISS-11…14…18, 25, 26 | **Phase 2 (B1+B2) Schema v3 relations implemented**: B1 (ISS-11/12/13) parent/child WBS + 3-tier cap + Split/+Sub-action + read-only rollup; B2 (ISS-14/15/16/17/18/25/26) `deps[]` (FS/SS/FF/SF+lag) replaces `dependsOn`, dependency editor with cycle + same-project validation, Reference Points managed list in Settings, `CURRENT_SCHEMA`→3, v2→v3 migration (`dependsOn`→`deps[FS,0]`) in `applyDataset`, seed + serialize emit v3. Verified by direct re-read only (Bash sandbox down all session — `node --check` and headless harness could not run). **ISS-32 still pending**; B3 (ISS-19…22) + B4 (ISS-23/24) remain open. |
| v11 | 2026-08-20 | Plan approval (B3) | **B3 scope frozen & workplan updated** (no code yet). Approved: Info = system default status (seed); progress bar in detail panel only; summary actions roll up & hide `schedule`/`progress`/`deps`; Split copies **inbound** deps to both sub-actions, keeps **outbound** deps on the summary (Option A). **NEW ISS-33** (WBS-conflict guard `wouldCreateWbsConflict` → `⚠ same WBS`) and **NEW ISS-34** (Split dependency inheritance) added to §9.4 + §16.2. Code deferred to after review + when agent Bash shell recoverable for `node --check`. |
| v12 | 2026-08-20 | Executed ISS-19/20/21/22/33/34 | **B3 (Schema v3 scheduling) implemented**: `core.js` — `rollupParent` duration-weighted progress + date rollup, `isScheduled(a)`, `wouldCreateWbsConflict`, `INFO_STATUS_ID`; `io.js` — seed adds Info, migration adds `schedule{}` + `progress`, serialize emits both; `editor.js` — `createChild` defaults `schedule{}`/`progress:0`, `splitIntoSubactions` copies inbound deps to both children (ISS-34); `render.js` — leaf-only Schedule grid (plan/forecast/actual dates + duration), Progress slider (0–100, toast at 100%), parent actions hide Schedule/Progress/Deps; `styles.css` — `.ae-schedule-grid`, `.ae-progress-wrap`; `node --check` passed on all 7 files. **Pending: browser hard-refresh smoke test (ISS-32)**. |
| v13 | 2026-08-21 | User feedback (B3 acceptance) | New issues from B3 test pass: **ISS-35** predefined statuses read-only (Info always present), **ISS-36** default duration 0.3 for new actions, **ISS-37** parent/child dependency consolidated read-only view (design + implement). Plan submitted, **awaiting approval** (review-first) — no code written yet. |
| v14 | 2026-08-21 | Executed ISS-35/36/37 | **User approved** (with tweaks): ① Info always present + 7 built-in statuses read-only in Settings (label/color/delete locked); `applyDataset` back-fills missing built-ins and sets `dataDirty` so the **old `action.json` is updated on next Save**; `normStatus` tags `builtin`, `serializeData` round-trips it, embedded `seedData` gains Info. ② Default `duration` changed from 0.3 → **0** for new actions and +Sub-action. ③ Parent (summary) shows a **consolidated, read-only dependency view** (union of its own + all sub-actions' `deps[]`, each row annotated with the referencing child(ren)). `node --check` passed on all 5 edited files (`core.js`, `io.js`, `editor.js`, `render.js`, `settings.js`) + `styles.css`/`index.html`. **ISS-32 browser smoke test still pending.** |
| v15 | 2026-08-21 | Executed ISS-38 | **Status list de-duplication bug fix**: renamed `ensureBuiltinStatuses` → `normalizeStatuses` (in `io.js`); it now builds exactly the 7 built-in statuses (each once, preserving saved color) and keeps only user statuses whose label does NOT collide with a built-in — dropping duplicates (by id/label) and user statuses that shadow a built-in label (the source of the duplicate-status bug). Embedded `seedData` default list's user status `Deleted` removed (default = exactly 7 system statuses). Settings "Built-in" tag switched to English. `dataDirty` set when the list is cleaned so the old `action.json` is updated on next Save. `node --check` passed on `io.js` + `settings.js`. |
| v16 | 2026-08-21 | Executed ISS-32/23/24 (B4) | **B4 — delete logic**: **ISS-32 closed** (user browser smoke test passed). **ISS-23** — parent with sub-actions cannot be deleted (`deleteAction` blocks via toast); sub-action `↑ Promote` button shown **only in the action panel** (`renderActionTop`, `isChild`); `promoteToTopLevel(a)` in `editor.js` detaches `parentId` and refreshes. **ISS-24** — delete now opens a **custom confirmation modal** (`#delConfirmModal` in `index.html` + `.dc-*` styles in `styles.css`) listing all affected dependency links (Outbound / Inbound with source title + total count); on confirm, `softDeleteAction` drops every inbound link (`predKind:'action' && predId===a.id`) from other actions and clears the action's own `deps[]`, then toasts the removed count. Both delete entry points (action panel + read-only detail view) route through `deleteAction`. `node --check` could NOT be run (agent Bash sandbox transport broke this session) — **user to run locally**: `node --check core.js io.js editor.js render.js settings.js`. |
| v17 | 2026-08-21 | ISS-23 refinement (user test feedback) | **Promote now moves ONE level up, not to root**: `promoteToTopLevel` renamed `promoteAction`; it reparents the node to its **immediate parent's level** (`a.parentId = parentOf(currentParent)`), so a tier-3 node under a tier-2 parent becomes a tier-2 sibling of its parent (still under the same grandparent) instead of jumping to the root. `deps[]`/`schedule` preserved. Button title + toast updated. `node --check` could NOT be run (agent Bash sandbox transport broke) — **user to run locally**: `node --check editor.js ; node --check render.js`. |
| v18 | 2026-08-21 | Executed ISS-30 | **Tree hierarchy overhaul**: (1) standardized per-level indent — `treePad(level)=8+level*(state.layout.treeIndent||16)`, default step **16px**, configurable via new **Settings → Layout → "Tree indent" slider** (0–40, step 2), persisted to `setup.json` (`appearance.treeIndent` round-tripped in `serializeSetup`/`applySetup`, defaulted in `state.layout`). (2) **Highlighted project tiles** — `.tnode.project` gets accent fill + radius + 34px height; selected state shows a left accent bar via `--tile-sel`. (3) **Unassigned virtual node** (F20): per-project `Unassigned` discipline node aggregating actions with empty `disciplineId`, read-only, with proper WBS rooting; its `+`/empty-leaf create discipline-less actions. `node --check` could NOT be run (agent Bash sandbox transport broke) — **user to run locally**: `node --check core.js io.js settings.js render.js`. |
| v19 | 2026-08-21 | ISS-30 bug fix (user feedback) | **Unassigned node was invisible**: it was gated by `if(unassigned.length)`, so it only rendered when at least one discipline-less action already existed — an empty bucket (the common case) never appeared. Fix: render the `Unassigned` node **always** (matching real discipline nodes, which always render). It now shows a live count (0 when empty) and the "No actions yet / + Add action" empty state; during an active filter it is hidden only if nothing under it matches. `node --check` pending (agent Bash sandbox transport down) — user to run locally: `node --check render.js`. |
| v20 | 2026-08-21 | ISS-30 structure refinement (user feedback) | **Restructured the tree hierarchy** so it is no longer "messy": each project now shows **one `Unassigned` node (lvl 1)** that nests **empty disciplines (lvl 2, click → "no actions yet" + "+ Add action")** and **discipline-less actions (lvl 2)**; **disciplines that HAVE actions stay at the project level (lvl 1)** with their actions (lvl 2). All nodes use the configurable per-level indent (`treePad`), and the empty-leaf now inherits the proper indent level (added `emptyLeaf(pid,did,level)` helper) so everything under `Unassigned` is correctly indented. `node --check` pending (agent Bash sandbox transport down) — user to run locally: `node --check render.js`. |
| v21 | 2026-08-21 | ISS-30 refinement (user feedback) | **Moved the `Unassigned` node to the bottom of each project tree**: `renderTreeBody` now renders disciplines-with-actions first (lvl 1) and the `Unassigned` node last (lvl 1), so it always sits at the bottom of a project's subtree; indentation levels and all Unassigned behavior (expand, empty-state, discipline-less actions) unchanged. `node --check` pending (agent Bash sandbox transport down) — user to run locally: `node --check render.js`. **User confirmed correct (2026-08-21).** |
| v22 | 2026-08-21 | Executed ISS-31 (Option B + reuse #delConfirmModal + block per ISS-23 pattern) | **Physical-delete dependency guard (ISS-31, Option B)**: when the user tries to permanently remove one or more soft-deleted actions in Settings → Deleted, the handler now scans **all actions (live + soft-deleted)** for inbound `deps[]` edges (`predKind:'action'` pointing into the selected IDs). If any live inbound references exist, a blocking warning is shown via the **existing `#delConfirmModal`** (reused per user instruction), listing each referencing action + dependency type (FS/SS/FF/SF) + lag + total count, with an OK-only button. The modal is styled exactly like the soft-delete confirm (ISS-24) and the message follows the "block, don't auto-strip" pattern (ISS-23): the whole batch is blocked, nothing is removed until the user clears the dependencies manually. If no live inbound refs exist, the lightweight native `confirm()` fires and the purge proceeds as before. Implemented in `settings.js`: new `inboundRefsForPurge(targetIds)` + `showPurgeBlockedModal(refs,totalSelected)`, plugged into `$('dlRemove').onclick`. `node --check` pending (agent Bash sandbox down) — **user to run locally**: `node --check settings.js`. |
| v23 | 2026-08-21 | Executed ISS-28 (Custom Fields Framework, Phase 3 MVP) | **Custom fields (F18, Phase 3 MVP) — implemented**: global catalog in `setup.json` (`customFields[]`); action values in `action.custom{}` keyed by field `key`; 8 types; Key auto-generated + readonly (derived from Label via `generateCustomFieldKey`, `^[a-z][a-z0-9_ ]*$` enforced, unique). Per-project enablement (`project.customFieldKeys[]`) + project-local fields (`project.customFields[]`) are serialized in **`action.json` alongside the project**, but a field is **only ACTIVE for a project once enabled there** (GetCustomFieldsForProject filters by customFieldKeys; Configure… modal lists the global catalog for selection). Defaults per type. Catalog edits mark **setup.json dirty** (was data); the global catalog was removed from `serializeData` (no longer duplicated into action.json). Files: `core.js`, `io.js`, `settings.js` (`renderCustomFields` auto-key readonly, `bindStdRow` gains `setupDirty` opt, `customFieldKey` preview, `deleteCustomField`→markSetupDirty), `render.js`, `styles.css`. `node --check` pending (agent Bash sandbox down) — **user to run locally**: `node --check core.js io.js settings.js render.js`. |
| v24 | 2026-08-24 | Cleanup + archive + picture review feature | Retired `syntaxcheck.js` (broken by asset-split restructure → `arch/`); archived `index.html.bak` (pre-split rollback no longer needed), `_b1_loadcheck.js` (load harness superseded by per-module `node --check`), `action-panel-example.html` (early prototype), `overview.md` (superseded by this workplan) into `arch/`; implemented picture-link review feature (assets/pictures + link/embed/Chromium + review lightbox). See §11 (2026-08-24 entries). |
| v25 | 2026-08-24 | Design review — UI principle compliance of detail-panel redesign | Logged §6.5 (redesign spec + 10 principle-compliance issues with proposed solutions) and ISS-39…ISS-48 in §16.4; added §11 entry. No app files changed (review-first; design-log only). |
| v26 | 2026-08-24 | Implemented detail-panel redesign (ISS-39…ISS-48) | In `render.js`/`styles.css`/`index.html`: added `#edSubhead`, `renderActionSubhead`, restructured `renderActionEditor` (Focus area + folded Schedule/Dependencies/Custom Fields/History/Preview), `bindFocusCells` + focus mgmt, `updateDepBadge` (dependency warning badge). Project/Discipline/Creator kept as hidden selects so save/load/preview unchanged. No text/title altered. |
| v27 | 2026-08-24 | Post-v26 polish + §5.1 compliance fixes | (1) `run_action_log.bat`: unmissable English hard-refresh notice (Ctrl/Cmd+Shift+R) at launch; (2) `styles.css`: `#id` restyled as a round accent disc (`.ed-sh-id`), and `.ed-sh-inner` no longer centered (dropped `max-width:860px; margin:0 auto`) so the subhead content width matches `.ed-body` (left edge aligned at 32px); (3) `core.js` `renderMain()`: hide `#edSubhead` on every non-Actions perspective (badge + identity show ONLY when updating an action); (4) `io.js` `autoLoad()`: restored §5.1 file:// behavior — Firefox auto-fetches `./action.json`, Chrome (fetch blocked) shows the startup modal (`promptPickJson`) to pick `action.json` + working folder; removed the earlier silent sample-fallback regression. Cleared `dataDirty`/`setupDirty` after load so navigation is never blocked on open. Web UI text/section labels unchanged; §6.5 / ISS-39…ISS-48 still implemented. |
| v28 | 2026-08-24 | Subhead/Default metadata + focus-cell color/overdue | (1) `render.js renderActionSubhead`: added **Created by** + **Created on** as read-only chips on the *same* Project/Discipline/Status row; Status chip now adopts the **setting color** (`statusStyle`, bg + contrast text). (2) Focus `Status`/`Priority` cells render + live-update with the **setting color** via `syncFocusDisplays` (repaints bg+text, not text-only). (3) `Due date` cell turns **red background when overdue** (`isOverdue` = due < today AND status ≠ Completed); `#fvDue` + cell toggle `.overdue`. (4) Focus value now **updates immediately** when a dropdown/picker selection changes (enriched `syncFocusDisplays`, already wired through existing `onEdit`). Files: `js/render.js` (`renderActionSubhead`, `syncFocusDisplays`, `isOverdue`, initial `#fvStatus`/`#fvPriority` color), `css/styles.css` (`.sh-status`, `.focus-value.s-on/.p-on`, `.focus-cell.overdue`). Intentional folds (Dependencies/Schedule/Custom Fields/History) unchanged. No labels changed beyond re-showing existing "Created by"/"Created on". |
| v29 | 2026-08-24 (post-v28 fix, committed later) | Fix: focus cell not updating on popover selection | `syncFocusDisplays(a)` was reading the action object `a`, but `a.statusId`/`a.priorityId`/`a.assignedToIds`/`a.due` are only written at **save time**; seg/assignee click handlers move the `.on` class live, so the cell kept the stale value/color. Fix: `syncFocusDisplays` now reads the **live selection** from the popover controls (`selectedSeg`/`selectedPriority`/`selectedAssignees`/`$('aeDue').value`) and repaints color + text + `.overdue`; `aeDue` input also calls `syncFocusDisplays`. File: `js/render.js`. §5.1 / §6.5 unchanged. See §11 (post-v28 bug-fix entry) + §16.4 ISS-57. |
| v30 | 2026-08-26 | `git-sync.bat` — option 7 (fork-safe sync) | Added **option 7 = Commit + Pull --rebase + Push** to `git-sync.bat` (new `:commitrebasepush` block) for the diverged-fork case (both local and GitHub have new commits). Also rewrote every menu option with plain-English explanatory notes (1 Pull only / 2 Push only / 3 Pull then Push / 4 Commit+Push / 5 Show diff / 6 Refresh / 7 Commit+Rebase+Push / 0 Exit), each noting when to use it and the ff-only failure mode. Conflict hint: `git add <file> && git rebase --continue`, abort with `git rebase --abort`. Only the helper `.bat` changed; no app code. Logging-only change tracked in §11 + §16.4 ISS-58. |
| v31 | 2026-08-27 | Requirement/design review — ae-log (dated detail log) meeting-workflow redesign | Logged the ae-log redesign proposal (P1–P5) with approved decisions + new ISS-59…ISS-66 in §16.4. P1 extends `detailLog[]` rows with meeting fields (`editedBy` / `typeIds` multi-select / `actionBy` multi-select / `due` + `dueHistory` / `status`); P2 = ↑/↓ row reorder; P3 = filter/sort toolbar; P4 = Export minutes; P5 = `@ref` expand-on-export. Recorder auto-default deferred to a future welcome page (ISS-66, pending). No app code written (review-first). |
| v32 | 2026-08-27 | Implemented ISS-60 — Action Types collection (per-project assignable) | Added `state.actionTypes` global catalog (setup.json) mirroring customFields; per-project enablement via `project.actionTypeIds[]` (empty = all global offered, subset = only those). Seed = Internal/Vendor/Client Design Change, Design Development, Client Instruction. Settings → Action Types UI with per-project Configure… modal. Files: `core.js`, `io.js`, `settings.js`. No token/label changes beyond the new "Action Types" Setting title. Pending `node --check` (agent Bash sandbox down) + browser smoke test + commit. |
| v33 | 2026-08-27 | Implemented ISS-59 + ISS-61 + ISS-65 — ae-log row meeting fields, ↑/↓ reorder, back-compat | Extended `detailLog[]` rows with `editedBy` / `typeIds[]` (multi-select from project's enabled action types) / `actionBy[]` (members multi-select) / `due` + `dueHistory[]` / `status` (row segment). Row UI rewritten in `logRowHtml`/`bindLogRow` (inline chip pickers, status segment, date, edited-by select, ↑/↓ move); collected via `readLogRowData` in `saveInlineAction` + `syncPreview`. `report.js detailLogRows` now renders the new fields (foundation for ISS-63 Export minutes). `io.js` load + `bindLogRow` first-bind apply field defaults so legacy rows keep loading (ISS-65). CSS added for the new controls. Files: `js/render.js`, `js/report.js`, `js/io.js`, `css/styles.css`. Pending `node --check` (agent Bash sandbox down) + browser smoke test + commit. |
| v34 | 2026-08-27 | ISS-59 layout restructure — adopted trailing single Meta column (Option A) | Per user review, the 8-column inline-editing table was replaced by a 4-column layout: `Row`(↑/↓/✕) · `Date` · **`Detail`(widest)** · `Meta`(trailing single column stacking Type/Action by/Due/Status/Edited by as current-value-only lines). Multi-select columns show only current values (NOT all options); each Meta line is clickable and opens a popover editor (`#aeMetaPop` in `index.html`, `openMetaPop` in `render.js`) — approved **Option A** (per-field click-to-edit). `readLogRowData` now reads from `row.dataset` (synced by the popover). `table-layout:fixed` + fixed column widths guarantee Detail owns the bulk width. Files: `js/render.js`, `css/styles.css`, `index.html`. Pending `node --check` + browser smoke test + commit. |
| v35 | 2026-08-27 | Bug-fix (ISS-59) — Meta popover not opening | User report: "click meta column, no popup window for updating values". Root cause: `openMetaPop` still contained `_rowAction = a;` — a leftover from the v33 refactor that removed the `let _rowAction` declaration; under `"use strict"` the assignment throws `ReferenceError` on every click, aborting before `pop.classList.add('open')`. Fix: deleted the dead line (`js/render.js`); also corrected two stale CSS selectors introduced when the popover markup moved to `.modal/.m-head/…` (`.ae-meta-pop .modal-body` → `#aeMetaPopBody`; descendant `.ae-mv-list label` → `label.ae-mv-list` + cursor). Verified popover markup/IDs and `.backdrop.open` CSS all consistent. Pending user `node --check` + browser re-test. |
| v36 | 2026-08-28 | Layout fix — editor (`.ae`) and all `edBody` content now fill full width | User report: "ae has wide right space inside edbody… all items inside edbody, such as aelog can not fill up whole width". Root cause: FOUR stacked `max-width:860px` caps limited the editor: `.ae` (styles.css:158), the global `#edBody > *` (styles.css:160 — the real blocker, capped every direct child of the editor body), `.focus-grid` (475), and `.fold` (499). Fix: removed all four caps so the editor, `#aeLog` table, `.focus-grid` cards, `.fold` groups (Dependencies/Schedule/History) and `.ae-customfields` all span the full `edBody` content width. `.ed-desc` helper paragraphs intentionally kept at `max-width:720px` for readable prose measure. Files: `css/styles.css` only. No JS, tokens, or text changes. Pending browser re-test (Ctrl+Shift+R). |
| v37 | 2026-08-28 | Layout polish batch — approved (pending implementation) | User-approved 6-item UI polish from the 2026-08-28 design review (post-v36 full-width). (1) Sticky `#aeLog` header: `.ae-log thead th{position:sticky; top:0; z-index:1}`. (2) Detail-table long-string wrap: add `overflow-wrap:anywhere; word-break:break-word` to `.ae-log td` (defensive vs URL/`@ref` overflow in `table-layout:fixed`). (3) **Corrected**: focus-card hover ALREADY exists (styles.css:475 = accent border + 3px `--sel-bg` ring); user wants the **body fill also shaded** on hover (\"body edge shading highlighted\") → extend the existing `.focus-cell:hover, .focus-cell:focus-visible` rule with `background:var(--tile-hover)`. (4) `.focus-grid` → `repeat(auto-fit, minmax(220px,1fr))` so 5 cards flow across on wide screens (was fixed `repeat(3,1fr)`). (5a) Prose readability cap (~720–760px) on fold-body / long description text while data blocks stay full-width. (5b) **new ISS-67** — user-resizable `#aeLog` columns (drag handles on `th`, widths persisted to localStorage). (6) Narrow-screen: `.ae-log-meta-h` shrinks + `.ed-body` padding reduces at ≤680px. Files: `css/styles.css` (1–4,5a,6) + `js/render.js` (5b handles). No token/label changes. Status: **Approved (2026-08-28); pending implementation**. |
| v38 | 2026-09-02 | Defect fix batch (v37 regressions) | Fix 3 v37-reported defects: **ISS-68** sticky-header bleed, **ISS-69** column-resize ineffective / no affordance, **ISS-70** Attach/Link not pinned to row bottom. Also lands the v37 resizer (ISS-67) that was never wired — root cause: the thead had no `.ae-col-resizer` handles, no `bindColResizers()` function and no call. Applied via `apply_v38.js` (15 asserted replacements: 8 in `css/styles.css`, 7 in `js/render.js`). No token / label / data-model changes. Status: **Implemented (2026-09-02, v38)** — pending `node --check` on all 7 modules + browser smoke test (ISS-68/69/70) + commit. |
| v39 | 2026-09-02 | ae-log defect fix batch (v38 regressions) | User browser test of v38 reported 2 remaining defects: **ISS-72** the Detail column's bottom grid line sat above the Date/Meta bottom lines, and **ISS-73** the "Description — dated detail log" heading floated detached above the table. ISS-72 root cause: the v38 ISS-70 fix put `display:flex` on the Detail `<td>`, which takes the cell out of table layout (the browser wraps it in an anonymous cell), so its box-shadow grid lines ended at the content box instead of the row height. Fix: the Detail cell stays a real table-cell (`position:relative` + `padding-bottom:42px`) and Attach/Link is absolutely pinned to the cell bottom (`left/right:10px; bottom:7px`), plus `flex-wrap:nowrap` / `min-width:0` on the link input so a narrow column cannot make the control wrap over the text. ISS-73 fix: heading moved INSIDE `.ae-log-wrap` (`render.js renderActionEditor`) so it reads as the table's caption; the 8px + 4px stack becomes a single 6px (`.ae-log-wrap > .ed-section-h{margin:0 0 6px}`, `.ae-log{margin-top:0}`). `apply_v38.js` step CSS 1C re-pointed at the v39 form so a re-run cannot reintroduce the flex `<td>`. Files: `css/styles.css`, `js/render.js`, `apply_v38.js`. No token / label / data-model changes. Status: **Implemented (2026-09-02, v39)** — pending `node --check` + browser smoke test + commit. |
| v40 | 2026-09-02 | Defect fix — pinned ae-log column header still lets rows show through (ISS-74) | User browser test of v39: "when scroll down, description table header still floating above table. table should not shown partially above header space". Verified layout: the scroll container is `#edBody` (`overflow:auto`) and `#edSubhead` is its **sibling**, so the subhead's `position:sticky` never engages — the only element that pins is `.ae-log th`. Root cause: v38 depended on a single guard (`z-index:3` on the sticky `th`), which is not enough because the rows carry real form controls (date input / textarea / buttons) and the absolutely-pinned Attach/Link bar from ISS-72; those paint over a plainly-stacked sticky table cell despite the opaque `th` background. Fix, three independent guards in `css/styles.css`: `.ae-log thead{position:sticky; top:0; z-index:6}` (row-group becomes a stacking context — every row descendant paints below the band); `.ae-log th` keeps `position:sticky; top:0; z-index:6` + `will-change:transform` (own compositing layer, defeats the form-control bleed, and covers engines without sticky row-groups); `.ae-log tbody{isolation:isolate}`. Band painted twice (`background-color` + matching `linear-gradient`) for guaranteed opacity, plus an outer `0 1px 0` bottom hairline; restored the missing `inset 0 1px 0` top hairline on the first `th`. Files: `css/styles.css` only. No JS / token / label / data-model changes. Status: **Implemented (2026-09-02, v40)** — pending `node --check` on all 7 modules + browser smoke test + commit. |
| v41 | 2026-09-03 | ae-log Attach/File-link restructure (ISS-75) |
| v42 | 2026-09-04 | ae-log compact detail table (ISS-77) | Replaced the inline Attach/File-link editor (ISS-75's UI) with an on-demand **attachment popover** (`#aeAttachPop`) opened from a **count chip** (paperclip SVG + count) in the Detail cell — keeps the `attachments[]` data model + hyperlink rendering from ISS-75 and removes the always-visible inline editor that was eating vertical space. Added a **3-letter Status short-code** in the compact Meta column: neutral pill + coloured dot + configurable code (hover reveals the full label); code editable in **Settings → Statuses** (new `code` input column), fallback `defaultStatusCode(label)`. Meta `By`/`Edited by` use `initials()` short codes. No emoji (SVG paperclip + SVG doc icon). Files: `js/render.js`, `js/settings.js`, `js/core.js`, `css/styles.css`, `index.html`. Status: **Implemented (2026-09-04, v42)** — pending `node --check` (render.js/settings.js/core.js) + browser smoke test (popover add/remove pictures + file links; count chip syncs; status pill = dot + code; Settings status code persists) + commit. | User design review of the dated-detail-log Attach/Link control raised 4 points: (1) Attach + text box + Link on one row confuses; (2) "Attach" reads as any-file but is picture-only; (3) Link should accept ANY file link and generate a hyperlink (not an image); (4) clear divider between picture-attach and file-link. Decisions (approved, "proceed"): allow the file-link picker to select MULTIPLE files (each → an absolute blob: URL) AND a paste-URL box (absolute / web URL); render file links as clickable hyperlinks (📄 name ↗, new-tab). **Data-model change**: `detailLog[i].images[]` (picture-only) renamed to `detailLog[i].attachments[]` with `{name, src, type:'image'|'file'}`; `io.js applyDataset` migrates legacy `images`→`attachments` (type:'image') and drops the old key. UI: two labeled groups — **🖼 Picture** (`🖼 Add pictures`, multi image/* picker, embeddings/saves as before) and **🔗 File link** (paste-URL box + `＋ Add link` + `📂 Browse files` multi-picker → blob URLs) — separated by a divider; the v39 absolute-pinned bar is removed (now in-flow, which also closes the ISS-72 overlap risk). `renderChips` branches by `type` (pictures = thumbnails, file links = hyperlink chips); report.js + reportHtml render file links as real hyperlinks (Word export too). Files: `js/render.js`, `js/report.js`, `js/io.js`, `css/styles.css`. No token changes. **Known limitation**: `blob:` URLs from the file picker are session-scoped (die on reload) — per user's "absolute / web URL" choice; paste-URL links persist. | **Implemented (2026-09-03, v41)** — pending `node --check` on render.js/report.js/io.js + browser smoke test (multi-picture, multi-file-link, hyperlink open, report/Word) + commit. |

---

## 3. Table of Contents

1. [Summary](#1-summary)
2. [Revision History](#2-revision-history)
3. [Table of Contents](#3-table-of-contents)
4. [Requirements for AI Agents](#4-requirements-for-ai-agents)
5. [Overall Workflow Logic](#5-overall-workflow-logic)
6. [Layout Design](#6-layout-design)
7. [Function Table](#7-function-table)
8. [Metadata & Relations](#8-metadata--relations)
9. [Schema / SSOT / Backward Compatibility](#9-schema--ssot--backward-compatibility)
   - 9.4 [Schema v3 (relations + scheduling)](#94-schema-v3-relations--scheduling)
   - 9.5 [File-split architecture](#95-file-split-architecture)
10. [Issue List — Retired (moved to §16)](#10-issue-list--retired-moved-to-16)
11. [Future Backlog & Open Items (Living Log)](#11-future-backlog--open-items-living-log)
12. [Deliverables](#12-deliverables)
13. [Glossary](#13-glossary)
14. [Known Constraints & Risks](#14-known-constraints--risks)
15. [References](#15-references)
16. [Issue & Task Register (canonical)](#16-issue--task-register-canonical)

---

## 4. Requirements for AI Agents

Any AI agent (or human collaborator) working on this project **must** follow these conventions. They are derived from approved decisions and repeated user feedback.

### 4.1 Working mode (review-first)
- **Propose before implementing.** For any non-trivial change, first present a plan / summary for review. Do not modify `index.html`, `action.json`, or `setup.json` until the user approves.
- **Language**: reply in **English** for technical summaries by default; switch to **Chinese** when the user asks for a review/discussion.
- The user runs commands manually on Windows (`C:\Users\franklin.song`); the agent provides complete, copy-run snippets only — it does **not** auto-run or auto-preview in a browser unless explicitly asked.

### 4.2 File ownership & persistence
- **`action.json`** holds *business data only*: `members`, `statuses`, `priorities`, `projects`, `disciplines`, `actions`. Changing any of these marks **Save Actions** dirty.
- **`setup.json`** holds *UI config only*: `brand`, `appearance`, `labels`, `defaultView`, `help` (markdown), `reports`, `filters`. Changing any of these marks **Save Settings** dirty.
- Status colors and priority definitions live in `action.json` (they are *data*), **not** `setup.json` — editing them triggers **Save Actions**, never Save Settings.
- On load, missing/illegal `setup.json` fields **fall back to built-in defaults**; the app must never crash.
- **No silent data loss**: any delete/rename that affects references must be surfaced to the user (reassign modal, orphan fallback fields, or explicit "(not in project)" labels).

### 4.3 Design system (Apple-style tokens)
- Accent `#0066CC`; dark-mode accent `#0A84FF` (set via `body.dark{--accent}`).
- Surface `#F5F5F7`; ink `#1D1D1F`; muted text `#6E6E73` (≥4.5:1 on white).
- Font **Inter**; modal radius 18px; pill buttons 22px; tree-node radius 9px.
- Status / priority colors are **schema-driven**; text color on a swatch uses `textOn()` (brightness-adaptive).
- Content width capped at **860px** in the editor body (`#edBody > *{max-width:860px}`).

### 4.4 Reference model (SSOT)
- Every list item has a unique `id`. Actions reference items **by id**, never by label/name.
- Renaming an item keeps its `id` → all references remain valid automatically.
- Deleting a referenced item is **blocked** until the user reassigns (or explicitly removes) every reference via the reassign modal.

### 4.5 Browser capability boundaries
- Use the **File System Access API** (`showSaveFilePicker` / `showOpenFilePicker` / `showDirectoryPicker`) for in-place file writes on Chromium.
- On non-Chromium browsers, fall back to **download** and tell the user explicitly ("Downloading … (browser can't write directly)") — never say "Saved".
- Persist the chosen data folder via `IndexedDB` (`dataDirHandle`) so pickers reopen in the right place.

### 4.6 Logging future work (see §11)
- New issues / requirements / updates are appended to §11 using the fixed entry template. Bump the revision history (§2) when a milestone lands.

---

## 5. Overall Workflow Logic

### 5.1 Startup / data loading — two launch approaches

The app can be opened in **two ways**. The launch mode decides whether data loads
automatically or through a picker.

**Approach A — Local HTTP server (recommended for daily use / development)**
```bash
cd "/c/Users/franklin.song/WorkBuddy/2026-08-12-16-57-22"
python -m http.server 8000
# then open  http://localhost:8000/index.html
```
- Served over `http://localhost` (a secure context), so the page **auto-fetches**
  `action.json` + `setup.json` from the served directory on startup — **no picker, no modal**.
- The working folder is implicitly the served directory; later Saves/Exports reuse it.
- IndexedDB `dataDirHandle` persists the folder so pickers reopen in the right place.

**Approach B — Direct file open (`file://`)**
- Open `index.html` by double-clicking it or via a `file://` URL.
- Browsers **block `fetch()` of sibling files** on `file://` for security, so the app cannot
  auto-load. It shows a **startup modal** instead:
  1. Pick `action.json` (required) via `showOpenFilePicker`.
  2. Optionally pick `setup.json`.
  3. Pick the **default working folder** via `showDirectoryPicker` (Option A: JSON first, then
     folder). The `DirectoryHandle` is persisted in IndexedDB so Save/Export/Import default there.
- If `setup.json` is skipped, the app falls back to built-in UI defaults.

Both approaches converge on the same apply + render pipeline:
```
applyDataset(json)  ──► schema migration (v1→v2) + orphan fallback
applySetup(json)    ──► brand / labels / defaultView / help / reports / filters
        │
        ▼
render()  →  editor / tree / reports / search / settings
```

**Load-path resilience (added in v5 — see §11 `2026-08-20` issue):**
- `autoLoad()` now reads the body as **text** and strips a leading **UTF-8 BOM** (`\uFEFF`) before `JSON.parse`, so files saved by editors that inject a BOM no longer fail silently.
- Any non-200, parse error, or fetch failure is captured and shown in the startup toast (e.g. `"action.json unloaded (HTTP 404) — started empty"` or `"… (parse error: …)"`) and logged to the console — instead of silently falling back to built-in defaults. A 200 with valid JSON is applied normally.
- **Operational note (cache trap):** when you maintain a *copy* of the files in a second folder and re-run the server there, the browser may serve a **stale cached `index.html`**, which makes it look like data "won't load". Always **hard-refresh** (`Ctrl+Shift+R`) after copying files over. See §11.

### 5.2 Save model (dual button + dirty check)
```
User change
  │
  ├─ data change (action / project / discipline / member / status / priority)
  │        └─► markDataDirty()  ──► enable Save Actions (+ flash) + top-bar "● unsaved" pulse
  │
  └─ settings change (brand / labels / help / defaultView / reports / filters / layout)
           └─► markSetupDirty() ──► enable Save Settings (+ flash) + top-bar "● unsaved" pulse

Click Save Actions  ──► serializeData()  ──► write action.json  ──► clear dataDirty
Click Save Settings ──► serializeSetup() ──► write setup.json  ──► clear setupDirty

Leave guard: setPerspective / selectNode / import / close ──► confirmSaveBeforeLeave()
             (if dirty → confirm "Save before leaving?")  +  beforeunload listener
```

### 5.3 Delete with blocking reassign (no cascade, no silent loss)
```
Click delete on a list item
  │
  ▼
referencesOf(kind, id)   ── counts actions / members / project-config references
  │
  ├─ 0 references  ──► confirm("Delete 'X'?")  ──► delete
  │
  └─ >0 references ──► open #reassignModal (blocking)
          • header: "Delete 'X' — N action(s) reference it"
          • "Reassign all" batch dropdown + per-row dropdown
          • Project/Discipline: required, no "none"
          • Status/Priority: can fall back to default
          • Member assignee row: "— remove —"; createdBy row: "— keep name snapshot —"
          • Soft-deleted actions: separate group, each row "— Remove permanently —" (Option C)
          • Project-config references: auto-removed (shown as an info line)
          • Delete button enabled only when every row has a valid value
          └─► performDelete()  ──► markDataDirty()
```

### 5.4 Schema migration (v1 → v2) on load
```
applyDataset(json):
  if schemaVersion < 2:
     status (label)        → statusId (+ statusLabel orphan fallback if unmapped)
     priority (label)      → priorityId (+ priorityLabel)
     assignedTo (name[])   → assignedToIds (+ assignedToNames)
     createdBy (name)      → createdById (+ createdByName)
     DO NOT auto-create unmapped labels/names  (preserve for manual fix)
  serializeData()  → writes v2 (drops legacy fields + _prevStatus*)
```

### 5.5 Launch-mode behavior matrix (Save / Load / Export / Import)

| Operation | Approach A — HTTP server (`http://localhost`) | Approach B — Direct open (`file://`) |
|-----------|----------------------------------------------|--------------------------------------|
| **Load on startup** | Automatic `fetch` of `action.json` + `setup.json` from the served directory; no user action | Startup modal: pick `action.json` (+ optional `setup.json`), then pick the working folder; no auto-fetch is possible |
| **Working folder** | The served directory (implicit); persisted to IndexedDB for pickers | The folder chosen at startup; persisted to IndexedDB for pickers |
| **Save Actions / Save Settings** | In-place write into the served folder via FS Access API (`showSaveFilePicker`); folder defaults to served dir | In-place write into the chosen working folder via FS Access API; folder defaults to the picked dir |
| **Chromium vs others** | FS Access in-place writes supported; Firefox/Safari → **download** with explicit "can't write directly" notice | Same model: Chrome in-place writes; Firefox/Safari → download with the same notice |
| **Export** | `showSaveFilePicker` defaults to served folder; non-Chromium → download blob | `showSaveFilePicker` defaults to working folder; non-Chromium → download blob |
| **Import** | `showOpenFilePicker` defaults to served folder; replaces current dataset (dirty-guard) | `showOpenFilePicker` defaults to working folder; replaces current dataset (dirty-guard) |

**Net difference:** the launch mode only changes **how data gets in on startup** (auto-fetch vs
picker) and the **default folder** used by every later Save/Export/Import dialog. The editor,
schema, validation, and dirty-guard behavior are identical across both modes. Prefer
**Approach A** for a frictionless load (and for any automated test); use **Approach B** when you
only have the file and no server handy (e.g., opening from a shared/USB folder). On `file://`,
the working-folder handle is persisted so re-runs skip the folder pick; see §14 for browser-support
caveats.

---

## 6. Layout Design

### 6.1 Shell (desktop-first, four-panel + status bar)
```
┌─────────┬──────────┬──────────────────────┬────────────┐
│ Activity│ Sidebar  │ Editor (single content│ Right panel│
│ bar 56px│ 260px    │ area, minmax(0,1fr))  │ 300px      │
├─────────┴──────────┴──────────────────────┴────────────┤
│ Status bar 30px (data source + counts)                 │
└────────────────────────────────────────────────────────┘
```
- Activity rail, sidebar, right panel are each independently hideable and resizable (180–360 / 220–380); all driven by `setup.json` and persisted.
- **Top bar (48px)**: brand + breadcrumb + `⋯` overflow menu (+ `☰` drawer on ≤900px). Save/Export are mirrored in the `⋯` menu so they stay reachable when the right panel is hidden.
- **Right panel "Quick Actions"**: `Save Actions` (primary) · `Save Settings` · `Export` · `Import…` · `Layout…` · `Help`.

### 6.2 Perspectives (each defines both left + main panel)
Actions (tree + inline editor) · Projects (list + dashboard) · Disciplines (list + cross-project) · Reports (types + chart) · Search (filters + results) · Settings / Help (sections + articles).

### 6.3 Inline editor (main panel)
- Meta grid: R1 Project · Discipline — R2 Created by · Created On (RO) · Assigned to (multi) · Depends on — R3 Due · Status (segment) — R4 Priority (segment under status) — R5 Description (dated detail log table) — Update history.
- Live preview reuses the same `reportHtml()` render source as the Word/Excel export (single source of truth).

### 6.4 Design review status
Full review recorded in `layout-review.md`. Status: **Sprint 1, 2, and 3 all implemented (structural)**. Key resolved items: mobile drawer entry, `.rp-btn.primary`, brand-blue unification, status-bar purification, empty-state CTAs, sticky modal footers, dark accent, selection tokens, colored report bars, a11y (focus-visible/ARIA/Esc/keyboard), `--muted` contrast, dead-code cleanup. See §16.5.1 for the itemized checklist (§10 was retired into §16).

---

### 6.5 Action detail panel redesign (2026-08-24) — UI principle compliance review

> **Evaluation object**: the proposed action-detail panel rebuild (conclusions from the 2026-08-24 multi-round review).
> **Frameworks**: Nielsen 10 usability heuristics · WCAG 2.1/2.2 · Apple HIG · Fitts's Law · Gestalt · Miller's Law.
> **Status**: **implemented (2026-08-24)** — see §11 entry and §16.4 (ISS-39…ISS-48 status). All element IDs preserved; data flow (save/load/preview) unchanged. Cross-references §16.4.

**Proposed layout (accepted direction, as of 2026-08-24)**
1. **edTop** (fixed 56px): `Save` · `+ New Action` · `+ Sub-action` · `Split` · `↑ Promote` · `Delete` — unchanged.
2. **Subhead** (new sticky, read-only): highlighted title + identity chips (`Project` / `Discipline` / `Status` current values).
3. **Focus area** (blue-framed, click value to edit; `Project`/`Discipline` removed — they are locked + already shown read-only in Subhead):
   - Row 1 `Assigned to` / `Due date` — pencil glyph **persistent at rest** (intensifies on hover/focus)
   - Row 2 `Status` / `Priority` / `Progress` — pencil glyph **persistent at rest** (parent: `Progress` = equal-height read-only rollup placeholder)
4. **`Description — dated detail log`** — main workspace.
5. Folded **`Schedule & Dependencies`** (collapsed by default, header carries warning badge).
6. Folded **`Custom Fields`** (title unchanged).
7. Folded **`Update history`**.
8. Folded **`Live preview — tabulated report`**.

**Principle-compliance issues found**

| ID | Severity | Violated principle | Issue | Proposed solution |
|----|----------|--------------------|-------|-------------------|
| ISS-39 | P1 | WCAG 2.1.1 / 2.4.7 / 1.4.1; Nielsen #4 / #6 | The "click-to-edit" pencil and the "locked" lock glyph appear **only on `:hover`** — keyboard-only and touch users get **no affordance** to discover editability; hover-only also fails WCAG 1.4.1 (not color/icon alone). | **AGREED 2026-08-24 (user decision #1)**: make affordance **persistent at rest** — editable values always show a faint pencil glyph / dashed underline; locked values always show a lock glyph; intensify on hover/focus; add `:focus-visible` ring; non-text contrast ≥3:1 (1.4.11). |
| ISS-40 | P1 | Nielsen #1 (visibility of status); WCAG 1.4.1 | If dependency warnings (cycle / cross-project) live only *inside* the collapsed `Schedule & Dependencies` group, the user misses critical state. | Collapsed header always shows a **text + icon** badge (e.g. `⚠ 1 cycle`), never color-only. |
| ISS-41 | P1 | Nielsen #4 / #6 (consistency; recognition over recall) | "Click value to edit" + inline editors + folded groups is a **non-standard hybrid**; `Description`/`Schedule` are inline while Focus items are popover-edit → inconsistent. | Unify the affordance visual cue across all editable Focus items; consider keeping the two highest-frequency fields (`Status`/`Priority`) as **always-on controls** rather than click-to-reveal — logged as a trade-off to confirm. |
| ISS-42 | P2 | Apple HIG; Nielsen #8 (minimalist) | Two stacked sticky bars (edTop 56px + Subhead) crowd the content area; on short viewports the `Description` workspace is squeezed. | Keep Subhead to a single slim row; or merge Subhead into the edTop region as one sticky block (only one sticky boundary); verify at 768 / 1024 / 1440. |
| ISS-43 | P2 | WCAG 2.5.5 (target size); Fitts's Law | If the click target is only the small value text, the touch target is too small. | Make each Focus cell a **≥44px tall hit area** with ≥8px gaps; the whole cell is clickable, not just the text. |
| ISS-44 | P1 | WCAG 2.1.2 (no keyboard trap) / 2.4.3; ARIA AP | A popover editor opened on click, without focus management, can trap keyboard focus or scramble focus order. | Use the popover pattern (`aria-haspopup` / `aria-expanded`); close on `Esc` and click-outside; focus moves into the first control on open and **returns to the trigger** on close; no modal trap. |
| ISS-45 | P2 | Nielsen #8; Miller's Law | `Project` / `Discipline` appear in **both** Subhead (read-only) and Focus row 1 (locked read-only); `Status` appears in **both** Subhead and Focus row 3 — redundant exposure. | **RESOLVED 2026-08-24 (user decision #2)**: `Project`/`Discipline` **removed from Focus** (locked + already shown read-only in Subhead). `Status` intentionally kept in both Subhead (read-only overview) and Focus row 2 (editable control) as a deliberate overview/control mirror, not redundancy. |
| ISS-46 | P2 | Nielsen #4 (consistency) | Parent (summary) actions have no `Progress`; hiding it shifts Focus row 3 (Status/Priority/Progress → Status/Priority) and misaligns vs leaf rows. | Render an **equal-height read-only rollup placeholder** (e.g. "— rolled up" or the computed %) so parent/leaf cells stay aligned. |
| ISS-47 | P1 | Nielsen #5 (error prevention) / #10 (help) | Values that look like static text are secretly editable → accidental activation and unnoticed edits. | Clear hover/focus cue + `cursor:pointer` + `title` tooltip; the popover is visually distinct (border/shadow); `Esc`/outside-click cancels; ensure the edTop dirty pulse fires so state is always visible. |
| ISS-48 | P2 | WCAG 1.4.11 (non-text contrast ≥3:1) | Dimmed-at-rest affordance glyphs may drop below the 3:1 non-text contrast minimum. | Pick a rest-state color/opacity that still meets ≥3:1 against `#F5F5F7`/`#FFFFFF`; verify with a contrast tool. |

**Confirmed decisions (carry-over, no change)**
- `Project` / `Discipline` are **locked** (cannot be edited) — satisfies "updates stay within the current project/discipline".
- **2026-08-24 user decision #1 (ISS-39)**: edit affordances (`Project`/`Discipline` lock glyph + other fields' pencil) must be **persistent at rest**, not hover-only — required for keyboard/touch discoverability (WCAG 2.1.1 / 2.4.7 / 1.4.1 / 1.4.11).
- **2026-08-24 user decision #2 (ISS-45)**: **remove `Project` / `Discipline` from the Focus area** — they are locked and already shown read-only in Subhead; Focus now = Row 1 `Assigned to` / `Due date`, Row 2 `Status` / `Priority` / `Progress`.
- **No text / section title is changed** unless the user explicitly approves new copy in review (e.g. the folded-group title `Schedule & Dependencies`, and whether to rename `Custom Fields`, both pending approval).
- Design tokens unchanged (`#0066CC / #F5F5F7 / #1D1D1F / Inter / 18px radius / 900px breakpoint`).
- Only structure / order / grouping / folding / interaction change — **zero field and zero data-logic changes**.

---

## 7. Function Table

| # | Function | Status | Where / Notes |
|---|----------|--------|---------------|
| F1 | Inline action editor (all fields editable) | ✅ Done | `renderActionEditor`, `reportHtml()` single source |
| F2 | Tree nav Project → Discipline → Action | ✅ Done | `renderTreeBody`, per-project discipline filtering |
| F3 | Dual-file save (Save Actions / Save Settings) | ✅ Done | `serializeData`/`serializeSetup`, dirty-check |
| F4 | Schema-driven status & priority colors | ✅ Done | JSON colors, `textOn()` adaptive |
| F5 | Priority metadata + editor row + By Priority report | ✅ Done | §7 / `renderPrioritySeg`, seed+setup updated |
| F6 | Multi-assignee (chips, project-filtered) | ✅ Done | §12 `renderAssigneePicker` |
| F7 | Per-project disciplines & members (catalog + assign) | ✅ Done | §13 `project.disciplineIds`/`memberIds`, `#projectModal` |
| F8 | Standardized 5 Settings lists (inline CRUD) | ✅ Done | §14 `bindStdRow`, removed `listManager` popup |
| F9 | Soft-delete actions (Deleted status) | ✅ Done | §11 `liveActions()`, Settings → Deleted |
| F10 | Soft-delete members ("left") | ✅ Done | §8.1–§8.2 `left` flag, Left-members group |
| F11 | Blocking reassign-on-delete (no cascade) | ✅ Done | §5.3 `referencesOf`, `#reassignModal` (Option C) |
| F12 | Schema v2 id-based references + migration | ✅ Done | §9.3 `CURRENT_SCHEMA`, `applyDataset` |
| F13 | Markdown help articles | ✅ Done | `mdToHtml` (escape-then-render) |
| F14 | Configurable reports & filters (setup.json) | ✅ Done (basic) | `evalWhere`, id-based filters |
| F15 | Unsaved-change guard (nav + beforeunload) | ✅ Done | `confirmSaveBeforeLeave`, top-bar pulse |
| F16 | File System Access API folder picker + IndexedDB | ✅ Done (Chromium) | download fallback on others |
| F17 | Word / Excel export (filters + select) | ✅ Done | right-panel drawer, MSO HTML blob |
| F18 | Custom fields (Phase 3 MVP) | ✅ Done | ISS-28 |
| F19 | Workflow rules engine (Phase 3) | ⬜ Open | deferred — ISS-29 |
| F20 | Tree "Unassigned" discipline node | ⬜ Open | optional — ISS-30 |
| F21 | dependsOn warning on physical delete (Option B: block, reuse #delConfirmModal, ISS-23 pattern) | ✅ Done | ISS-31 |

---

## 8. Metadata & Relations

### 8.1 Entities (in `action.json`)

| Entity | Key fields | Relations |
|--------|-----------|-----------|
| **Member** | `id, name, initials, role, disciplineId, left, deletedOn` | assigned to actions via `assignedToIds[]`; created actions via `createdById`; belongs to projects via `project.memberIds[]`; optional `disciplineId` |
| **Project** | `id, name, code, disciplineIds[], memberIds[]` | owns actions (`action.projectId`); enables a subset of disciplines/members (cascade filter, not cascade delete) |
| **Discipline** | `id, name` | referenced by actions (`action.disciplineId`), members (`member.disciplineId`), projects (`project.disciplineIds[]`) |
| **Status** | `id, label, color` | referenced by actions (`action.statusId`); `deleted` is a reserved status for soft-delete |
| **Priority** | `id, label, color` | referenced by actions (`action.priorityId`) |
| **Action** | `id, title, projectId, disciplineId, statusId, priorityId, due, assignedToIds[], createdById, dependsOn, description, detailLog[], history[], deleted` | the central record; references all above by id |

### 8.2 Relation rules
- **Reference-by-id only.** No action stores a status label or member name directly.
- **Per-project scoping**: an action can only use disciplines/members present in its project's `disciplineIds`/`memberIds`. Current values not in the project are shown as "(not in project)" and hidden from new selection — never silently cleared.
- **Soft-delete semantics**: `action.deleted` (or `statusId=deleted`) hides from live views but keeps the record; member `left` keeps the record and all references resolvable.
- **No cascade delete**: removing a project/discipline/member/status/priority never deletes actions; it is blocked until references are reassigned (§5.3).

---

## 9. Schema / SSOT / Backward Compatibility

### 9.1 Single Source of Truth (SSOT)
- The **id** is the SSOT for every reference. Labels/names are display-only and may change freely.
- Display helpers resolve id → label/name at render time: `statusLabel(id)`, `priorityLabel(id)`, `assigneeList(ids)`, `creatorName(id)`.
- Unknown id → neutral fallback ("(unknown)" / orphan label retained in a `*Label`/`*Names` field).

### 9.2 Schema v2 shape (current implementation)

> **Note:** Schema **v3** (§9.4) is the approved next schema (relations + scheduling) but is **not yet implemented** in `index.html` — it lands after the asset-split refactor (ISS-01…ISS-10). Until then the app writes/reads v2.
```jsonc
{
  "schemaVersion": 2,
  "members":     [{ "id":"m_fs","name":"FS","initials":"FS","role":"PM","disciplineId":"" }],
  "statuses":    [{ "id":"in-progress","label":"In Progress","color":"#D7E9FF" }],
  "priorities":  [{ "id":"high","label":"High","color":"#FFE1BD" }],
  "projects":    [{ "id":"p1","name":"Project Atlas","code":"ATLAS",
                    "disciplineIds":["d1","d2"],"memberIds":["m_fs","m_mk"] }],
  "disciplines": [{ "id":"d1","name":"Design" }],
  "actions":     [{ "id":38,"title":"…","projectId":"p1","disciplineId":"d1",
                    "statusId":"in-progress","priorityId":"high",
                    "assignedToIds":["m_mk"],"createdById":"m_fs",
                    "description":"…","history":[{"d":"…","t":"…"}] }]
}
```
(Orphan fallback fields `statusLabel` / `priorityLabel` / `assignedToNames` / `createdByName` are written when a v1 value cannot be mapped, so no data is lost on migration.)

### 9.3 Backward compatibility
- **v1 → v2 auto-migration** in `applyDataset` (label/name → id). Unmapped values are preserved as orphan fallback fields, **not** auto-created — the user fixes them manually in the editor (orphan options render as "⚠ old name (deleted — pick one)" and block save until resolved).
- `setup.json` is independent; missing fields fall back to built-ins. No legacy `settings` block is required inside `action.json` (old `settings` is migrated out on first Save).

### 9.4 Schema v3 (relations + scheduling) — adopted 2026-08-20

Two relation types, kept separate (WBS vs network logic):

**Decomposition (parent/child):** `parentId` (top-level `null`), **max 3 tiers**. Tier-3 needing more split → new top-level action + dependency link. Parent (summary) dates & progress are **read-only, rolled up** from children (MS-Project summary-task model). **Confirmed decision (2026-08-20):** a summary (parent) action's `schedule`, `progress`, and `deps` are all **auto-calculated / hidden in the UI** (user may "update" only in the sense that they reflect children; manual entry disabled). A parent with children cannot carry a meaningful own schedule.

**Workflow (dependency):** `deps[]` replaces the scalar `dependsOn`. Each edge:
```jsonc
{ "predId":"a09", "predKind":"action", "type":"FS", "lag":0 }
```
- `type` ∈ **FS / SS / FF / SF**; `lag` in **calendar days**, ± (negative = lead). CPM constraint semantics:
  - FS: `succPlanStart ≥ predPlanFinish + lag`
  - SS: `succPlanStart ≥ predPlanStart + lag`
  - FF: `succPlanFinish ≥ predPlanFinish + lag`
  - SF: `succPlanFinish ≥ predPlanStart + lag`
  - (`predPlanFinish = predPlanStart + predDuration`)
- **Same project only**: `predKind:'action'` must point to an action in the same `projectId`; cross-project uses `predKind:'ref'`.
- **WBS conflict guard** (ISS-33, NEW): in addition to cycle detection, forbid dependency edges that are **not loops but self-contradictory in the WBS** — a parent depending on its own descendant, a child depending on its own ancestor, or any cross ancestor/descendant link. Cycle detection (`wouldCreateCycle`) only catches loops; the new `wouldCreateWbsConflict(aId,predId)` walks the ancestor chain of `aId` and the descendant subtree of `predId` (and vice-versa as needed) to flag `⚠ same WBS`. Cross-project deps remain allowed (flagged `⚠ different project`); WBS-conflict check applies to `predKind:'action'` where both ends share the WBS tree.
- **Split dependency inheritance** (ISS-34, NEW — approved decision): `splitIntoSubactions` turns the action into a pure summary and creates two sub-actions. **Inbound** dependencies (other actions whose `deps` reference the split action as `predId`) are **copied to BOTH** new sub-actions (new `rowKey` each). The split action's **outbound** dependencies are **kept on the split action** (now hidden in UI, Option A — no data loss, reversible). Rationale: sub-actions inherit the predecessor constraints; the summary retains its own downstream edges without duplication.

**Reference points (cross-project anchor):** top-level `referencePoints[]`, single-date milestone, **predecessor-only** (never a successor). Renders as a diamond in gantt.
```jsonc
"referencePoints":[ { "id":"ref_01","label":"TWRP-C4B pile cap done","projectId":"p_x","date":"2026-10-01","note":"" } ]
```

**Multi-date schedule (leaf only):** parent has no `schedule` object (rolled up).
```jsonc
"schedule": {
  "planStart":"2026-09-01", "duration":10,            // planFinish = planStart + duration
  "forecastStart":"2026-09-03", "forecastFinish":"2026-09-12",
  "actualStart":null, "actualFinish":null
}
```
Slip = `forecastFinish − planFinish` (positive = behind). Units = **calendar days**.

**Progress:** leaf action carries manual `progress` (0–100). Parent `progress` = **duration-weighted rollup** `Σ(child.progress × child.duration) / Σ child.duration` (read-only). `progress = 100` → **inform only** (toast), never auto-forces status to Completed.

**Info-only actions:** status list gains an **"Info"** status. An action is **excluded from scheduling / gantt** when it has **no `planStart`** OR its `statusId` resolves to **Info**. (Status-driven exclusion — no extra boolean flag.)

**Full v3 action shape:**
```jsonc
{
  "schemaVersion": 3,
  "referencePoints":[ { "id":"ref_01","label":"…","projectId":"p_x","date":"2026-10-01","note":"" } ],
  "actions":[ {
    "id":"a12", "parentId":null, "projectId":"p1",
    "deps":[
      { "predId":"a09","predKind":"action","type":"FS","lag":0 },
      { "predId":"ref_01","predKind":"ref","type":"FS","lag":0 }
    ],
    "assignedToIds":["m3"], "priorityId":"p2", "statusId":"s2",
    "progress":40,
    "schedule":{ "planStart":"2026-09-01","duration":10,
                 "forecastStart":"2026-09-03","forecastFinish":"2026-09-12",
                 "actualStart":null,"actualFinish":null }
  } ]
}
```

**Consistency (extends v2 safeguards):**
- 3-tier depth cap; "split" on tier-3 redirects to new top-level + link.
- Cycle detection (DFS) on dep-create; reject if it would form a loop.
- Same-project dep validation (reject cross-project `action` refs).
- Delete parent → promote children one level OR block (reuse reassign-on-delete).
- Delete predecessor → auto-unlink that edge + notice (weak association).
- Orphan `predId` → render "(unknown)" not crash.
- **v2 → v3 migration** (in `applyDataset`): `dependsOn:"a09"` → `deps:[{predId:"a09",predKind:"action",type:"FS",lag:0}]`; actions lacking `schedule` → dates pending (user fills later); `CURRENT_SCHEMA` bumped to `3`.

### 9.5 File-split architecture — adopted 2026-08-20 (asset split, NOT page split)

`index.html` is a SPA that shares in-memory `state` across views and supports two launch modes (§5.1). Splitting into **separate HTML pages** (action.html / setting.html) would break state continuity and duplicate the shell, so we split by **asset type** instead, keeping one SPA document. External `<link>`/`<script src>` with relative paths load under **both** `file://` and `http://` (only `fetch()` of JSON is blocked under file://, already handled by the picker).

| File | Source (current `index.html` lines) | Responsibility |
|------|--------------------------------------|----------------|
| `index.html` | shell + body markup + includes | Entry point only |
| `styles.css` | 7–333 | All CSS |
| `core.js` | 627–839 | `state`, `CURRENT_SCHEMA`, normalize/find helpers, `applyDataset`, `applySetup` |
| `io.js` | 2130–2401 | `resolveDataUrl`, IndexedDB, `loadDataDir`, `saveViaPicker`, `serializeData/Setup`, `autoLoad`, `downloadJson`, `promptPickJson` |
| `render.js` | 839–1015, 1999–2129 | Sidebar/main/tree renderers, toolbar, topbar, save buttons, status bar |
| `editor.js` | 1015–1201, 1857–1999 | Action detail/editor, create modal, status/priority/assignee segs, log rows |
| `settings.js` | 1201–1502, 1502–1857, 1734–1856 | Managed lists, color list, discipline panel, reassign modal, members left/restore |
| `report.js` | 1235–1348, 2060–2130 | Reports, search, export (Word/Excel), help |
| `bootstrap.js` | 2401–2522 | Init, event wiring, keyboard, `autoLoad()` call |
| `gantt.html` | *(new, future — ISS-27)* | Separate document; fetches same `action.json`; plan/forecast/actual bars + dep arrows + critical path |

> `run_action_log.bat` must copy `styles.css` + the 7 JS files (ISS-10). No behavior change intended — this is a pure refactor (ISS-01…ISS-09) done **before** v3 features land, so v3 edits target clean modules.

---

## 10. Issue List — Retired (content moved to §16)

> All historical issues, the v2 Definition of Done, and open items formerly listed here were **consolidated into the canonical §16 Issue & Task Register**: historical closed issues → §16.5, Definition of Done → §16.6, open backlog (incl. F18–F21) → §16.4. Refer to §16 as the single source of truth for all work.

---

## 11. Future Backlog & Open Items (Living Log)

> Future task execution is tracked in the canonical **§16 Issue & Task Register** — refer there for all pending `ISS-xx` work; this section remains a dated narrative log.

> **Logging convention** — append new entries in this format so the workplan stays a usable issue/requirements log:
> ```
> ### [YYYY-MM-DD] <Type: Issue | Requirement | Update> — <short title>
> - Reported by / trigger: …
> - Detail: …
> - Decision / status: … (Open | In progress | Done | Deferred)
> - Related: §<section>
> ```

### [2026-08-20] Update — B3 (ISS-19/20/21/22/33/34) Schema v3 scheduling implemented
- **Reported by / trigger**: User confirmed B2 all passed; B3 plan approved (v11)
- **Detail**: 
  - `core.js`: `rollupParent` now returns duration-weighted progress (`Σ(child.progress×child.duration)/Σchild.duration`), planStart/planFinish/duration rollup from leaf schedules; added `isScheduled(a)` (has `planStart` AND status≠Info); added `wouldCreateWbsConflict(aId,predId)` walking ancestor chain + descendant subtree; added `INFO_STATUS_ID='info'`.
  - `io.js`: empty-file seed now includes "Info" status; `applyDataset` migration adds `schedule:{}` and `progress:0` to actions lacking them; `serializeData` emits `schedule` and `progress`.
  - `editor.js`: `createChild` initializes `schedule:{}` + `progress:0`; `splitIntoSubactions` copies inbound dependencies to both new sub-actions (new `rowKey`), keeps outbound deps on the split action (Option A).
  - `render.js`: leaf actions show Schedule grid (Plan Start, Duration, Forecast Start/Finish, Actual Start/Finish) + Progress slider (0–100, readout, toast at 100%); parent actions show rollup note and hide Schedule/Progress/Deps entirely.
  - `styles.css`: `.ae-schedule-grid` (2-col), `.ae-progress-wrap` (slider + value), responsive collapse at ≤1180px.
  - All 7 JS files pass `node --check` (verified in user PowerShell).
- **Decision / status**: Done (code complete, pending browser smoke test)
- **Related**: §9.4, §16.2, ISS-19/20/21/22/33/34

### [2026-08-21] Requirement/Update — B3 acceptance feedback (predefined statuses read-only + default duration 0.3 + parent/child dep design)
- Reported by / trigger: user confirmed "so far others are ok" after B3 test pass; raised 3 refinements.
- Detail:
  - **① Info not in list + predefined read-only**: B3 only added Info to the `createDataFile` seed, so a previously-generated `action.json` (lacking Info) still omits it. New decision: predefined statuses are **read-only / non-deletable** (B3 Q1 earlier allowed rename/delete — that is reversed). Fix = back-fill built-in statuses on load + `builtin` flag + Settings list hides delete & disables edit for built-ins; only user-created statuses are add/edit/delete-able.
  - **② Default duration 0.3**: new actions (+Sub-action) default `schedule.duration = 0.3`; Schedule editor shows 0.3 as the empty-default.
  - **③ Parent/child dependency management**: parent already hides the dep editor; proposal = show a **consolidated, read-only per-child dependency rollup** instead of leaving it blank, so the parent's full predecessor network is visible without editable conflicts. Decision pending user choice (consolidated view vs blank).
- Decision / status: **Done (v14)** — code implemented & `node --check` passed; tracking ISS-35 / ISS-36 / ISS-37.
- Related: §9.4, ISS-35, ISS-36, ISS-37.

### Open items carried from implementation
- **[2026-08-20] Requirement — Phase 3 custom fields**: add `customFields` (setup.json defs) + `action.custom{}` values; dynamic editor/table columns. *Status: In Progress (ISS-28, plan approved 2026-08-21).*
- **[2026-08-20] Requirement — Phase 3 workflow rules**: `rules[]` engine on status change etc. *Status: Deferred (ISS-29).*
- **[2026-08-20] Issue — Tree "Unassigned" node**: actions whose discipline is unassigned to the project are unreachable from the tree (global-aggregate only). *Status: Done (v21, 2026-08-21).*
- **[2026-08-20] Issue — dependsOn on physical delete**: when permanently removing an action in Settings → Deleted, warn if other actions `dependsOn` it. *Status: Open (P2).*
- **[2026-08-20] Update — Live verification**: all "Done" items are structurally verified only; schedule a Chrome smoke test. *Status: Open.*

### [2026-08-21] Update — ISS-30 refinement: Unassigned pinned to bottom of project tree
- Reported by / trigger: user confirmed tree v20 worked but asked "unassigned should be at the bottom of a project tree".
- Detail: `render.js` `renderTreeBody` reorder only — per project (when expanded), disciplines-with-actions render first (lvl 1), then the `Unassigned` node (lvl 1) renders last. Indentation levels unchanged (discipline/Unassigned=1, their actions=2, empty-discipline empty-state=3); Unassigned still always-present, expand / empty-state / discipline-less-action behavior unchanged.
- Decision / status: **Done (v21)** — code complete; user confirmed correct. `node --check` pending (agent Bash sandbox transport down) — user to run locally.
- Related: §7 F20, ISS-30, §16.4.

### [2026-08-20] Issue — Served page showed default/sample data though `action.json` returned HTTP 200
- Reported by / trigger: user copied files to a desktop folder, ran `python -m http.server`, opened `http://localhost:8000/index.html`; page showed built-in defaults instead of real TWRP C4B data.
- Detail: console `fetch('action.json')` returned `200` and the file on disk was valid; yet the page stayed on defaults. Two causes:
  1. **Stale browser cache** — an older `index.html` was cached from earlier `file://` sessions, so the *newer* loader logic wasn't running. Resolved by hard refresh (`Ctrl+Shift+R`); real data then loaded correctly.
  2. **Silent error swallowing in `autoLoad()`** — the original code did `await res.json()` inside a `try/catch` that discarded all errors, so any parse/BOM/HTTP failure was indistinguishable from "file not found" and silently fell back to built-in defaults. A 200 with no visible error hid the real problem.
- Decision / status: **Done (structural)** in WorkBuddy `index.html` — `autoLoad()` now (a) strips a UTF-8 BOM before `JSON.parse`, and (b) captures the real HTTP status / parse error and shows it in the startup toast + console instead of failing silently. User must hard-refresh after manually copying files to a second folder (cache trap). *Live Chrome smoke test still pending (see §16.4 ISS-32).*
- Related: §5.1, §5.5, §14.

### [2026-08-20] Requirement — Copy-to-second-folder workflow hygiene
- Reported by / trigger: user keeps the WorkBuddy copy as source of truth and manually copies `index.html`/`action.json`/`setup.json` to a desktop folder for daily use.
- Detail: manual copy + server restart can serve a stale `index.html` (browser cache), producing confusing "data won't load" symptoms that are actually a cache problem, not a data/code problem.
- Decision / status: **Done (guidance)** — documented the hard-refresh (`Ctrl+Shift+R`) requirement in §5.1; deferred adding a runtime version/fingerprint badge (optional, pending user request). *Status: Deferred (optional enhancement).*
- Related: §5.1, §14.

### [2026-08-24] Update — Project folder cleanup & archive
- Reported by / trigger: user requested a cleanup check; retire `syntaxcheck.js`, archive non-required files into `arch/`.
- Detail:
  - `syntaxcheck.js` — retired (broken by the asset-split restructure: it extracted inline `<script>` from `index.html`, but scripts are now external `js/*.js`; also superseded by per-module `node --check` in `restructure.bat`). Moved to `arch/`.
  - `index.html.bak` — pre-restructure (flat single-file) rollback copy; restructure confirmed working, so the rollback is no longer needed. Moved to `arch/`.
  - `_b1_loadcheck.js` — Node load/eval harness used during ISS-09 to validate module load order; reads `core.js` etc. at root (now in `js/`), so broken; superseded by per-module `node --check`. Moved to `arch/`.
  - `action-panel-example.html` — early standalone layout prototype (reference only, not the running app). Moved to `arch/`.
  - `overview.md` — earlier implementation summary, explicitly superseded by this workplan (§12). Moved to `arch/`; it also holds the picture-link feature design (now implemented — see next entry), preserved for history.
  - Kept at root: `index.html`, `css/`, `js/`, `action.json`, `setup.json`, `assets/`, `restructure.bat`, `run_action_log.bat`, `layout-review.md` (active reference), this workplan.
- Decision / status: Done (archive via `archive_cleanup.bat`; root now holds only the running app + active docs/tooling). `node --check` not runnable by agent (shell down) — user to run.
- Related: §12, §15.

### [2026-08-24] Update — Picture-link review feature implemented
- Reported by / trigger: user wanted the action "description list" (dated detail log) to support pictures for visual review.
- Detail:
  - New `assets/pictures/` folder; `detailLog[i].images = [{name, src}]`.
  - Three storage rules (user-confirmed): (1) user pre-places image in `assets/pictures/` and links it → stored as relative link; (2) picking a file NOT in `assets/pictures/` → embedded as `data:` URL (never lost); (3) on Chromium with a data folder set, the picked file is auto-copied into `assets/pictures/` and a relative link used.
  - Each log row: `📎 Attach` (file picker) + `🔗 Link` (paste relative link) + thumbnail chips; invalid/missing link → broken-image + error state (no probe).
  - Review lightbox (`#imgReviewModal`) opens on chip/link click; supports download/close. Live preview + Word export render `<img>` (relative link = path; `data:` = inline).
  - Files touched: `io.js` (`writePictureToAssets`, `applyDataset` defaults `images:[]`), `render.js` (row UI, chips, lightbox, serialize), `report.js` (export), `styles.css` (chips/lightbox), `index.html` (lightbox modal). Confirmed working by user after restructure.
- Decision / status: Done (implemented 2026-08-21; restructure + bat updates 2026-08-24). Not previously tracked in this workplan — added here for SSOT.
- Related: `arch/overview.md` (design detail), `assets/pictures/`.

### [2026-08-24] Issue/Requirement — Action detail panel redesign: UI principle compliance review
- Reported by / trigger: user asked to verify the proposed detail-panel redesign (2026-08-24 review conclusions) against web UI design principles and to log issues + proposed solutions in the workplan **before any code change**.
- Detail: evaluated the accepted redesign (fixed edTop + new sticky Subhead + Focus area with 3 rows + folded groups) against Nielsen heuristics, WCAG 2.1/2.2, Apple HIG, Fitts, Gestalt, Miller. Found **10 principle-compliance issues**; the most critical is **ISS-39 — hover-only affordances**: the pencil (edit) and lock (locked) glyphs appear only on `:hover`, so keyboard-only and touch users cannot discover editability (violates WCAG 2.1.1 / 2.4.7 / 1.4.1 and Nielsen #6). Full issue table + proposed solutions recorded in **§6.5**; tracked as **ISS-39…ISS-48** in §16.4 (status: Open / design review). No app files changed — design-log only (review-first).
- Decision / status: **Open (design review, pending user approval of the issue list + solutions)**. No code written. Next step: user approves the issue set and the proposed solutions; implementation then proceeds review-first (structure/CSS only, no field/data changes, no text/title changes without approval).
- Related: §6.5, §16.4 (ISS-39…ISS-48), §4.1 (review-first), §4.3 (design tokens).

### [2026-08-24] Decision — Detail-panel redesign: two confirmations (ISS-39 / ISS-45)
- Trigger: user reply "1. agree 2. remove project and discipline in focus area."
- **Decision #1 (ISS-39, P1 hover-only affordances)**: confirmed — editable/locked affordances must be **persistent at rest** (pencil / dashed underline / lock glyph always visible; intensify on hover/focus; `:focus-visible` ring; non-text contrast ≥3:1). The previous "show only on `:hover`" sketch is rejected. §6.5 Focus spec updated; ISS-39 status → Agreed.
- **Decision #2 (ISS-45, P2 redundant display)**: confirmed — **`Project` / `Discipline` removed from the Focus area**. Rationale: they are locked (cannot be edited) and already shown read-only in Subhead, so a second copy in Focus added no value and risked redundancy. **Revised Focus layout**: Row 1 `Assigned to` / `Due date`; Row 2 `Status` / `Priority` / `Progress` (parent: `Progress` = equal-height read-only rollup placeholder). `Status` remains in both Subhead (read-only overview) and Focus row 2 (editable control) — kept deliberately as overview/control mirror. §6.5 Focus spec + ISS-45 updated; ISS-45 status → Resolved.
- Status: design review continues for the remaining ISS-40…ISS-48. **No app files / UI text changed** — documentation only (review-first).

### [2026-08-24] Implementation — Detail-panel redesign (ISS-39…ISS-48)
- Trigger: user reply "now can you proceed updates for iss-39 to iss-48 now" (after the two decisions in the entry above).
- Detail: implemented the agreed redesign in `js/render.js` + `css/styles.css` + `index.html`:
  - `index.html`: added `#edSubhead` between `#edTop` and `#edBody`.
  - `render.js`: `renderActionSubhead(a)` (sticky read-only title + Project/Discipline/Status chips with lock glyphs); `renderActionEditor(a)` restructured to **Subhead → Focus area (Assigned/Due row1, Status/Priority/Progress row2 as click-to-edit cells) → Description → folded Schedule / Dependencies / Custom Fields / Update history / Live preview**; `bindFocusCells(a)` (popover open/close + focus mgmt, Esc/outside-close returns focus), `syncFocusDisplays(a)`, `updateDepBadge(a)`; Project/Discipline/Creator kept as **hidden selects** so `saveInlineAction`/`syncPreview` data flow is unchanged (they are locked).
  - `styles.css`: `.ed-subhead`, `.focus*` (44px cells, persistent SVG affordance glyphs at rest), `.fold*/.fold-badge` (dependency warning badge on the collapsed Dependencies header), `.ae-hidden`.
  - ISS coverage: 39 persistent affordances · 40 dependency badge · 41 unified click-to-edit · 42 slim sticky subhead · 43 44px targets · 44 focus mgmt · 45 Project/Discipline removed from Focus (locked + in Subhead) · 46 parent rollup placeholder for Progress · 47 clear affordance + cancel + dirty pulse · 48 glyph contrast uses `--muted`/accent.
  - **No text/section title changed**; only structure/grouping/folding/interaction. Design tokens unchanged.
- Status: **Implemented; pending `node --check js/render.js` + browser smoke test + commit**. No app files broken by design (IDs preserved). Next: user runs `node --check` locally (agent Bash sandbox intermittently down), then `git add -A && git commit`.

- **Feed-next bug fix (2026-08-24, post-v26): page-start load flagged dirty.** Symptom: opening index.html (no edits) then navigating showed "unsaved changes — Save before leaving". Root cause: `normalizeStatuses()` (io.js ~L254) sets `state.dataDirty=true` when `action.json` is missing a built-in status (e.g. old files without `Info`); also `applyDataset` promotes legacy `settings` to `setupDirty`. Fix: `autoLoad()` now clears `dataDirty`/`setupDirty` after the initial load (user hasn't edited); normalization/legacy hints remain as toasts only — navigation is no longer blocked on open. Import path (importViaPicker) is untouched and still flags dirty when needed. No UI text changed.
- Related: io.js `autoLoad` (http + file:// branches); §16.4 ISS-39…ISS-48 (already implemented).

### [2026-08-24] Requirement/Update — v27 polish + §5.1 compliance (batch)
- Reported by / trigger: user verified the v26 layout in-browser and requested four adjustments; also flagged that the file:// startup modal (required by §5.1) had regressed to a silent sample fallback.
- Decisions + changes:
  1. **`run_action_log.bat`** — launch now prints an unmissable English block telling the user to **hard-refresh (Ctrl+Shift+R / Cmd+Shift+R)** after every file update; clarified the header comment that file:// shows a startup modal. (Text-only; no app change.)
  2. **Node badge (`#id`)** — restyled as a **round accent disc** (white fill, `#0066CC` 2px ring, `#0066CC` text; dark mode `#0A84FF`). Only present on the Actions perspective (see #4).
  3. **Subhead / body width alignment** — `.ed-sh-inner` no longer centered (`max-width:860px; margin:0 auto` removed); subhead now spans the same 32px-padded content width as `.ed-body`, so left edges line up on wide screens.
  4. **Subhead scope** — `#edSubhead` is now cleared + hidden in `core.js renderMain()` whenever `state.perspective !== 'actions'` (no-selection case already handled inside `renderActionsMain`). The badge + identity bar therefore appear **only when updating an action**.
  5. **file:// startup modal restored (§5.1)** — `io.js autoLoad()` file:// branch: Firefox auto-fetches `./action.json` (same-folder read allowed), Chrome (fetch blocked) calls the existing `promptPickJson()` → `#openJsonModal` (pick `action.json` + set working folder). The earlier silent sample-fallback regression is removed. http branch untouched (auto-load, no modal). `dataDirty`/`setupDirty` still cleared after load.
- Status: **Implemented (v27)**. Files: `run_action_log.bat`, `css/styles.css` (`.ed-sh-id`, `.ed-sh-inner`), `js/core.js` (`renderMain`), `js/io.js` (`autoLoad`). No button/section labels changed, no data logic changed, tokens unchanged. Pending `node --check` (agent Bash sandbox intermittently down — user runs locally) + browser smoke test + commit.
- Related: §5.1 (Approach A/B), §6.5, §16.4 ISS-39…ISS-48 (still implemented), v27 row.

### [2026-08-24] Requirement/Update — v28 subhead metadata + focus color/overdue (batch)
- Reported by / trigger: user verified v27 in-browser and requested (1) show Created by/on in subhead, on the same row as Project/Discipline/Status; (2) keep intentionally-folded groups as-is; (3) Focus Status/Priority adopt the Setting color, Due date red background when overdue (not when Completed); (4) focus value updates immediately on dropdown selection.
- Changes (all Implemented, v28):
  1. `js/render.js` `renderActionSubhead(a)`: added `Created by` + `Created on` read-only chips in the same `.ed-sh-meta` row; `#shStatus` chip now carries `style="statusStyle(a.statusId)"` (setting color).
  2. `js/render.js` `renderActionEditor`: `#fvStatus`/`#fvPriority` initial markup carries `s-on`/`p-on` class + inline `statusStyle`/`priorityStyle`.
  3. `js/render.js` `syncFocusDisplays(a)`: now repaints `#fvStatus`/`#fvPriority` bg+text on change; toggles `.overdue` on the Due cell. New `isOverdue(a)` = `a.due < todayStr() && status !== 'Completed'`.
  4. `css/styles.css`: `.sh-status` (rounded setting-color chip), `.focus-value.s-on/.p-on` (rounded colored chip), `.focus-cell.overdue` + `.focus-value.overdue` (red bg/text, token-consistent with `.fold-badge`).
- Status: **Implemented (v28)**. Files: `js/render.js`, `css/styles.css`. No button/section labels added beyond re-showing existing "Created by"/"Created on"; intentional folds unchanged; tokens unchanged. Pending `node --check` (agent sandbox intermittently down) + browser smoke test + commit.
- Related: §6.5, §16.4 ISS-54…ISS-56, v28 row.

### [2026-08-24] Bug fix (post-v28): focus cell not updating on popover selection
- Reported by / trigger: user re-tested v28 — changing Status/Priority/Assignee/Due **inside the focus-pop** did not refresh the focus cell immediately.
- Root cause: `syncFocusDisplays(a)` read the values from the action object `a`, but `a.statusId`/`a.priorityId`/`a.assignedToIds`/`a.due` are only written at **save time** (`saveInlineAction`). The seg/assignee click handlers DO move the `.on` class live, but `syncFocusDisplays` was reading the stale `a`, so the cell kept the old value/color.
- Fix: `syncFocusDisplays(a)` now reads the **live selection from the popover controls** — `selectedSeg($('aeSeg'))`, `selectedPriority($('aePriority'))`, `selectedAssignees($('aeAssignee'))`, and `$('aeDue').value` — then repaints `#fvStatus`/`#fvPriority`/Subhead `#shStatus` color + text, `#fvAssignee` text, and toggles `.overdue` on the Due cell. `aeDue` `input` handler now also calls `syncFocusDisplays(a)` (was only setting `#fvDue` text, so the red overdue background didn't toggle live). No new IDs; `statusLabel`/`priorityLabel`/`selectedSeg`/`selectedPriority`/`selectedAssignees` all pre-existing.
- Status: **Fixed (post-v28)** in `js/render.js`. Pending `node --check` + browser smoke test + commit.
- Related: v28, §16.4 ISS-56 (now ISS-57).

### [2026-08-26] Requirement/Update — `git-sync.bat` option 7 (fork-safe sync)
- Reported by / trigger: user wanted a one-command path for the diverged-fork case (local uncommitted/committed changes AND GitHub has other new commits), after a manual sync succeeded.
- Changes (Implemented, v30): added **option 7 = Commit + Pull --rebase + Push** (`git add -A` → `git commit` → `git pull --rebase origin <branch>` → `git push`), with a `:commitrebasepush` block; on rebase conflict/abort it prints the resolve steps (`git add <file> && git rebase --continue`) and the safe undo (`git rebase --abort`). Rewrote the menu so **every option has a plain-English note** (1 Pull only, 2 Push only, 3 Pull then Push, 4 Commit+Push, 5 Show diff, 6 Refresh, 7 Commit+Rebase+Push, 0 Exit) including when to use it and that 1/3 fail on a diverged fork (ff-only).
- Status: **Implemented (v30)** in `git-sync.bat` only. No app code touched. Intentional folds / detail-panel behavior unchanged. Pending `node --check` (n/a for .bat) + commit.
- Related: v30 row, §16.4 ISS-58.

### [2026-08-27] Requirement/Design review — ae-log (dated detail log) meeting-workflow redesign
- Reported by / trigger: user asked to evaluate the ae-log dated detail table for meeting-discussion workflow improvements; proposal approved through P1–P5 with refinements.
- Approved decisions:
  - **P1 — structured per-row fields** (extends `detailLog[i]`): `editedBy` (recorder; member single-select, manually editable now), `typeIds:[]` (**multi-select** action types from a new `actionTypes` settings collection), `actionBy:[]` (responsible members, multi-select from `state.members`), `due` (commit date) + `dueHistory:[]` (due-change trail), `status` (row status, reuses statuses incl. On Hold / Not Started).
  - **P2 — row reorder**: per-row **↑/↓ buttons** (swap with adjacent; DOM order = save order). Drag-reorder + session undo deferred as a later enhancement.
  - **P3 — filter/sort toolbar** above `#aeLog` (by `typeIds` / `actionBy` / `status` / `date`; asc/desc); view-only.
  - **P4 — Export minutes**: new button reusing `reportHtml`/`detailLogRows` to emit a minutes view (title + metadata + extended log table Date/Type/Action by/Due/Status/Detail) via existing `msoDownload`.
  - **P5 — `@ref` lightweight references**: `@<id>` (action) / `@img:<name>` (picture) stored as plain text in `detailLog[i].text`; resolved into readable text **only at export** (P4) via `expandRefs(text)`; never silently dropped (raw ref retained); missing refs → muted `→ #id [action not found]`, deleted actions → `→ #id <title> [deleted]`; broken image refs mirror existing `.broken` handling.
  - **Recorder auto-default (`editedBy`) deferred**: a welcome page / recorder setting is added **later**; recorded as pending **ISS-66**. Interim: `editedBy` is manually editable per row.
- Data-model / back-compat: `io.js` load must default the new `detailLog[i]` fields (ISS-65) so legacy rows (date/text/images only) keep loading.
- Status: **Open (design approved, pending implementation — review-first)**. No app files changed. Next: user approves this workplan update, then code proceeds review-first (structure/CSS only, IDs preserved, tokens unchanged).
- Related: §6.5, §16.4 ISS-59…ISS-66.

### [2026-08-27] Implementation — ISS-60 Action Types collection (per-project assignable)
- Reported by / trigger: user said "proceed ISS-60" and added constraint "action type can be also assigned to projects differently".
- Changes (Implemented, v32): `state.actionTypes` global catalog in setup.json (mirrors customFields); per-project enablement via `project.actionTypeIds[]` — empty array falls back to **all** global types, a configured subset limits the editor choices to only those. Seed 5 types (Internal/Vendor/Client Design Change, Design Development, Client Instruction); add/rename/delete via Settings → Action Types; a project's Configure… modal toggles which types are enabled. Files: `js/core.js` (model + `getActionTypesForProject`), `js/io.js` (load/serialize), `js/settings.js` (`renderActionTypes` / `openProjectActionTypesModal` / `deleteActionType`). No token/label changes beyond the new "Action Types" Setting title.
- Status: **Implemented (v32)**. Pending `node --check` (agent Bash sandbox down — **user to run locally**: `node --check js/core.js js/io.js js/settings.js`) + browser smoke test + commit.
- Related: §16.4 ISS-60; feeds ISS-59 (`typeIds` multi-select).

### [2026-08-27] Implementation — ISS-59 + ISS-61 + ISS-65 (ae-log row meeting fields + ↑/↓ + back-compat)
- Reported by / trigger: user said "proceed the next issue" after ISS-60 — next approved items were ISS-59 (row fields) and ISS-61 (↑/↓ reorder), with ISS-65 (back-compat) required alongside.
- Changes (Implemented, v33):
  - `js/render.js`: rewrote `#aeLog` thead (Date / Type / Action by / Due / Status / Detail / Edited by / controls); `logRowHtml(i,r,a)` now renders per-row inline chip pickers for `typeIds` (from `getActionTypesForProject(a.projectId)`) and `actionBy` (project members), a status `segment`, a `due` date, an `editedBy` single-select, and ↑/↓ move buttons; `bindLogRow` wires chips / segment / ↑↓ / defaults (ISS-65); `readLogRowData(row,a)` collects the new fields; `saveInlineAction` + `syncPreview` now persist them.
  - `js/report.js`: `detailLogRows` extended to render Type / Action by / Status / Due / Edited by under each row (foundation for ISS-63 Export minutes).
  - `js/io.js`: `applyDataset` applies field defaults on load (ISS-65).
  - `css/styles.css`: `.ae-log-controls` / `.ae-row-mv` / `.ae-rchips` / `.ae-rseg` / `.ae-rdue` / `.ae-rby` / `.ae-log-by` styling (Apple tokens, no color change).
- Status: **Implemented (v33)**. Pending `node --check` (agent Bash sandbox down — **user to run locally**: `node --check js/render.js js/report.js js/io.js js/core.js js/settings.js`) + browser smoke test + commit.
- Related: §16.4 ISS-59 / ISS-61 / ISS-65; ISS-63 (Export minutes) and ISS-64 (`@ref`) remain open.

### [2026-08-27] Redesign — ISS-59 table layout adopted (trailing Meta column, Option A)
- Reported by / trigger: user review of the v33 8-column inline-editing table — three points: (1) Detail must own the most space; (2) multi-select columns should show current values ONLY, not all options; (3) ↑/↓/✕ belong in one column. Then: "move Detail right after Row+Date; put Type/Action by/Due/Status/Edited by in one trailing column." Finally: "use Option A to edit meta column" (each Meta line clickable → popover, not one combined editor).
- Changes (Implemented, v34): `render.js` `logRowHtml` → 4 columns (`Row` · `Date` · `Detail` · `Meta`); `Meta` stacks 5 fields as current-value mini-chips; `bindLogRow` opens `#aeMetaPop` per line (`openMetaPop`); popover editors: Type/Action by = checkbox multi-select, Due = date, Status = segment, Edited by = select; on change `setMetaState` writes `row.dataset` + re-renders the Meta line; `readLogRowData` reads `row.dataset`. `index.html` gained `#aeMetaPop`; `css/styles.css` restyled `.ae-log-rown`, `.ae-log-meta`, `.ae-meta-line`, `.chip-mini`, `.ae-meta-pop` and switched `.ae-log` to `table-layout:fixed` with fixed col widths. `table-layout:fixed` guarantees Detail the bulk width.
- Status: **Implemented (v34)**. Pending `node --check` (agent Bash sandbox down — **user to run locally**: `node --check js/render.js js/report.js js/io.js js/core.js js/settings.js`) + browser smoke test + commit.
- Related: §16.4 ISS-59; ISS-63 / ISS-64 still open.

### [2026-08-27] Bug-fix — ISS-59 Meta popover never opened (v35)
- Reported by / trigger: user — "click meta column, no popup window for updating values".
- Root cause: `js/render.js` `openMetaPop` kept `_rowAction = a;` from before the v33 refactor; the `let _rowAction` declaration (and `lastActionForRow`) were deleted when `setMetaState(row,s)` became `setMetaState(row,a,s)`. Under `"use strict"` (line 1 of render.js) assigning an undeclared variable throws `ReferenceError`, so the handler aborted before `pop.classList.add('open')` — no popover, matching the report.
- Changes: removed the dead `_rowAction = a;` line; fixed two stale CSS selectors after the popover markup rename (`.ae-meta-pop .modal-body` → `#aeMetaPopBody{min-height:40px}`, `.ae-meta-pop .ae-mv-list label` → `.ae-meta-pop label.ae-mv-list` + cursor:pointer). Audited the rest of the click chain: `bindLogRow` click binding (render.js:714), 5 `.ae-meta-line[data-meta]` seeds, popover branch handlers, `aeMetaPopDone/Close` + backdrop close, `.backdrop.open` CSS — all consistent.
- Status: **Fixed (v35)**. Pending user local `node --check js/render.js` + browser re-test (Ctrl+Shift+R).
- Related: §2 v35; §16.4 ISS-59.

### [2026-08-28] Layout fix — editor + all `edBody` content now fill full width (v36)
- Reported by / trigger: user — "ae has wide right space inside edbody… all items inside edbody, such as aelog can not fill up whole width of edbody" → after diagnosis, user chose **Option A+** ("make sure all items inside edbody can fill up to the full width").
- Root cause: not just `.ae`. Four stacked `max-width:860px` caps limited the editor area:
  1. `.ae{…max-width:860px}` (styles.css:158) — the editor wrapper.
  2. `#edBody > *{max-width:860px}` (styles.css:160) — **the real blocker**: capped EVERY direct child of the editor body, so `.ae` stayed 860px even if its own cap were removed; also governs Projects/Disciplines/Reports/Search/Settings/Help views.
  3. `.focus-grid{…max-width:860px}` (styles.css:475) — the Assigned-to/Due/Status/Priority/Progress card row.
  4. `.fold{…max-width:860px}` (styles.css:499) — Dependencies / Schedule / Update history disclosure blocks.
- Changes (css/styles.css only): removed all four `max-width:860px`; deleted the now-orphaned "Consistent content measure for every perspective" comment at line 160. Net effect: `.ae`, `#aeLog`, `.focus-grid`, `.fold`, and `.ae-customfields` all span the full `edBody` content width (left-aligned, no centering). `.ed-desc` helper paragraphs intentionally kept at `max-width:720px` for readable prose. No JS / token / text changes.
- Verification note: `#aeLog` uses `table-layout:fixed; width:100%` so the Detail column absorbs the extra width (consistent with ISS-59 "Detail owns the bulk"). `.focus-grid` is `repeat(3,1fr)` and `.ae-crow` is `1fr 1fr`, both distribute evenly when widened.
- Status: **Fixed (v36)**. Pending user browser re-test (Ctrl+Shift+R) + commit.
- Related: §2 v36; §16.4 (layout, no new ISS).

### [2026-08-28] Approval — Layout polish batch (v37 candidate)

- Reported by / trigger: user said "as professional UI designer, check if any further layout design improvements should be considered" → I summarized a 6-item review → user approved **all 6** with two refinements: (a) **re-check focus-card hover** — it ALREADY exists (`css/styles.css:475` = accent border + 3px `--sel-bg` ring); they want the **body fill also shaded** on hover, not a new hover from scratch; (b) for item 5 they also want **user-adjustable column widths** in the detail table.
- Approved decisions:
  1. **Sticky `#aeLog` header** — scroll the editor, Date/Detail/Meta headers stay visible (`.ae-log thead th{position:sticky; top:0; z-index:1}`).
  2. **Detail-table cell long-string wrap** — `overflow-wrap:anywhere; word-break:break-word` on `.ae-log td`; defensive against URL / `@ref` long tokens blowing the `table-layout:fixed` cell.
  3. **Focus-card hover body-shade (CORRECTED)** — no new selector; extend the existing `.focus-cell:hover, .focus-cell:focus-visible` rule with `background:var(--tile-hover)` so the card body fill is also shaded on hover ("body edge shading highlighted"), keeping the existing accent border + ring.
  4. **`.focus-grid` auto-fit** — `repeat(auto-fit, minmax(220px,1fr))` (5 cards across on wide, 3 on medium, 2 on narrow) replacing fixed `repeat(3,1fr)`.
  5. **Prose readability cap** (~720–760px) on fold-body / long description text; data blocks (table, focus, folds) stay full-width. **Plus new ISS-67**: resizable `#aeLog` columns (drag handles on `th`, persist widths to localStorage).
  6. **Narrow-screen tweaks** — `.ae-log-meta-h` shrinks + `.ed-body` padding reduces at ≤680px.
- Status: **Approved (2026-08-28); pending implementation**. Files: `css/styles.css` (1–4, 5a, 6) + `js/render.js` (5b handles). No token/label changes.
- Related: §2 v37; §16.4 ISS-67 (new).

### [2026-08-28] Implementation — Layout polish batch (v37)
- Implemented (user local apply of `v37_apply.md`): sticky `#aeLog` header, `.ae-log td` long-string wrap, focus-card hover body-shade, `.focus-grid` auto-fit, fold-body prose cap (760px), narrow-screen `.ae-log-meta-h`/`.ed-body` tweaks, ISS-67 resizable columns scaffold.
- Status: **Implemented (2026-08-28, v37)**. **Defects found on user test → v38**: ISS-68 (sticky header bleed), ISS-69 (resize never worked — handles/binder were missing), ISS-70 (attach/link not row-bottom).
- Related: §2 v37; §16.4 ISS-67 (implemented, defective) + ISS-68/69/70.

### [2026-09-02] Defect fix batch — v37 regressions (v38)
- Trigger: user tested v37 and reported 3 issues (cannot resize columns; header bleeds on scroll; attach/link not bottom-aligned).
- Decisions (approved, "proceed"): ISS-68 → `border-collapse:separate` + box-shadow separators + opaque th (z-index:3, `background-clip:padding-box`); ISS-69 → real thead handles + `bindColResizers` with percentage widths + neighbour compensation + visible 2px grip; ISS-70 → Detail `td.ae-log-detail` flex column + `.ae-img-ctl{margin-top:auto}`; plus narrow-screen `.focus-grid:1fr` cleanup.
- Files: `css/styles.css`, `js/render.js` (thead handles + `bindColResizers`). No token/label/data changes.
- Applied via `apply_v38.js` — 15 asserted replacements (8 CSS + 7 JS); this also lands the v37 resizer (ISS-67) that was never wired.
- Status: **Implemented (2026-09-02, v38)** — pending `node --check` on all 7 modules + browser smoke test (ISS-68/69/70) + commit.
- Related: §2 v38; §16.4 ISS-67/68/69/70.

### [2026-09-02] Fix — v38 double-apply corrupted render.js (ISS-71)
- Trigger: `apply_v38.js` was run **twice**. The script was **not idempotent**: any replacement whose anchor text survives inside its own inserted text re-applied on the second run — `function markDirty(a){` (JS 2H), `bindFocusCells(a);` (JS 2G), `.ae-log-meta{vertical-align:top;}` (CSS 1C) and `.ed-subhead, .ed-body{…}` (CSS 1D padding). The other replacements happened to consume their own anchor, so they self-guarded by accident.
- Damage: `bindColResizers(a);` emitted twice and the whole ISS-67/69 block inserted twice → `node --check js/render.js` failed with `SyntaxError: Identifier 'COL_RES_KEY' has already been declared` (render.js:739). In `styles.css` the ISS-70 flex block and the ≤680px `.ed-body` / `.ae-log-meta-h` rules were duplicated.
- Fix: de-duplicated by hand — `render.js` now has one `bindColResizers(a);` call (line 675) and one block (683–733); `styles.css` has one ISS-70 block and one ≤680px rule. Verified: all 4 `th` handles present in `renderActionEditor` (line 369), Detail `td` carries `class="ae-log-detail"` (line 435). `apply_v38.js` hardened with a per-replacement **`mk` marker** (a string that exists only in the new text, never in the old) → re-runs now report "already applied" instead of re-inserting; both files are read once, patched in sequence, written once, with an applied / already-applied / failed summary.
- Status: **De-duplicated 2026-09-02** — pending `node --check` on all 7 modules + `apply_v38.js` + browser smoke test (ISS-68/69/70) + commit.
- Related: §2 v38; §16.4 ISS-71.

### [2026-09-02] Fix — ae-log grid + heading spacing (v39)
- Trigger: user browser test of v38 — "action description header line is still floating above table. detail column bottom line is not aligned with other columns".
- **ISS-72 (Detail bottom line misaligned):** root cause is the v38 ISS-70 *mechanism itself* — `.ae-log-detail{display:flex; flex-direction:column; height:100%}` on a `<td>` removes that cell from table layout; the browser wraps it in an anonymous table-cell, so the cell's box-shadow grid lines (bottom + both vertical separators) were drawn at the flex box's content height rather than the row height. Fix: revert to a real table-cell — `.ae-log td.ae-log-detail{vertical-align:top; position:relative; padding-bottom:42px;}` with `.ae-img-ctl{position:absolute; left:10px; right:10px; bottom:7px; margin-top:0; flex-wrap:nowrap;}` and `.ae-link-img{min-width:0;}`. The ISS-70 bottom-pin behaviour is preserved; the reserved 42px sits below the Meta column's natural height (~124px), so row heights are unchanged in practice.
- **ISS-73 (heading floating above the table):** `.ae` is a flex column with `gap:0`, so the entire gap was the heading's inline `margin:0 0 8px` plus `.ae-log{margin-top:4px}` = 12px of dead space directly under a `<hr class="ae-divider">` carrying `margin:22px 0 16px` — the label read as orphaned. Fix: heading relocated inside `.ae-log-wrap` (`js/render.js` `renderActionEditor`) so it belongs to the table block as its caption, with `margin:0 0 6px` and `.ae-log{margin-top:0}`. Text unchanged.
- Files: `css/styles.css` (2 blocks), `js/render.js` (heading relocated into the wrapper), `apply_v38.js` (CSS 1C step re-pointed at the v39 form so a re-run cannot reintroduce the broken flex `<td>`).
- Status: **Implemented (2026-09-02, v39)** — pending `node --check` on all 7 modules + browser smoke test + commit.

### [2026-09-02] Fix — pinned ae-log header still letting rows show through (v40)
- Trigger: user browser test of v39 — "when scroll down, description table header still floating above table. table should not shown partially above header space".
- Confirmed layout facts before changing anything: the scroll container is `#edBody` (`overflow:auto`); `#edSubhead` is a **sibling** of `#edBody`, so its `position:sticky; top:0; z-index:5` never engages — the only element that actually pins is `.ae-log th`. So the symptom is the pinned column header (Date / Detail / Meta) failing to cover the rows scrolling beneath it, i.e. ISS-68 is still not actually fixed.
- Root cause: v38 relied on a single guard — `z-index:3` on the sticky `th`. That is not sufficient here, because the rows it must cover contain **real form controls** (`<input type="date">`, `<textarea>`, buttons) plus the **absolutely-pinned Attach/Link bar** introduced by the ISS-72 fix; those paint over a plainly-stacked sticky table cell even though the `th` background is opaque.
- Fix (three independent guards, `css/styles.css`): (1) `.ae-log thead{position:sticky; top:0; z-index:6}` — the row-group becomes a stacking context so every row descendant paints strictly below the header band; (2) `.ae-log th` keeps its own `position:sticky; top:0; z-index:6` for engines without sticky row-groups, plus `will-change:transform` to promote the header to its own compositing layer (defeats the form-control bleed); (3) `.ae-log tbody{isolation:isolate}` so row content can never escape above the band. Background painted twice (`background-color` + matching `linear-gradient`) so the band stays opaque even if a theme ever makes `--chip` translucent; outer `0 1px 0 var(--border)` hairline gives the pinned band a crisp bottom edge. Also restored the missing top hairline on the first `th` (`.ae-log th:first-child` previously dropped `inset 0 1px 0`).
- Files: `css/styles.css` only. No JS, no token / label / data-model changes.
- Status: **Implemented (2026-09-02, v40)** — pending `node --check` on all 7 modules + browser smoke test + commit.
- Open question to user: if "description header" meant the grey "Description — dated detail log" label rather than the Date/Detail/Meta column row, that label is **not** sticky and scrolls away under the pinned band — it can be pinned together with the column header if wanted (needs a fixed offset, so confirm first).
- Related: §2 v40; §16.4 ISS-74 (new), ISS-68 (re-fixed).

### [2026-09-03] Requirement/Implementation — ae-log Attach/File-link restructure (ISS-75)
- Reported by / trigger: user design review of the dated-detail-log Attach/Link control (4 points: one-row cramming; "Attach" implies any-file but is picture-only; Link should accept any file link + generate a hyperlink; clear divider between picture-attach and file-link). Two follow-up answers: file-link picker may select MULTIPLE files; links use absolute / web URLs.
- Detail:
  - **Data-model change**: `detailLog[i].images[]` (picture-only) renamed to `detailLog[i].attachments[]` with `{name, src, type:'image'|'file'}`. `io.js applyDataset` migrates legacy `images` → `attachments` (type:'image') and deletes the old `images` key; `serializeData` round-trips `attachments` (via `...rest`). All read/write sites updated: `render.js` (`logRowHtml`, `bindLogRow`, `renderChips`, `collectLogAttachments`, `syncPreview`, `saveInlineAction`, `reportHtml`), `report.js` (`detailLogRows`), `io.js`.
  - **UI**: two labeled groups in the Detail cell — **🖼 Picture** (`🖼 Add pictures` = multi image/* picker; embeds as data: URL or saves to `assets/pictures/` on Chromium, as before) and **🔗 File link** (paste-URL box + `＋ Add link` + `📂 Browse files` multi-picker → each selected file becomes an absolute `blob:` URL). Separated by a divider; the v39 absolute-pinned bar is removed (control now in-flow at the cell bottom) — this also closes the ISS-72 overlap/clip risk.
  - **Rendering**: `renderChips` branches by `type` — pictures = thumbnail chips (click → review lightbox); file links = clickable hyperlink chips (📄 name ↗, open new tab). `reportHtml` + `report.js` render file links as real hyperlinks (Word export too); pictures keep the existing lightbox link / inline-image behavior.
  - **Known limitation**: `blob:` URLs from `📂 Browse files` are session-scoped (invalid after reload); paste-URL (absolute / web) links persist across reload + save.
- Decision / status: **Implemented (2026-09-03, v41)** — pending `node --check` (render.js / report.js / io.js) + browser smoke test + commit.
- Related: §2 v41; §16.4 ISS-75; §6.5.

### [2026-09-04] Requirement/Implementation — compact ae-log detail table (ISS-77)
- Trigger: design-review follow-up to ISS-75/76 — the inline Picture/File-link editor (two labeled groups in the Detail cell) consumed too much vertical space on every row even when empty, and the Meta Status column was too wide / the user may not remember status colours.
- Decisions (approved across the review): (1) replace the inline editor with an **on-demand popover** opened by a **count chip** (paperclip SVG + attachment count) in the Detail cell — the popover reuses the ISS-75 Picture / File-link groups + the `attachments[]` model; (2) **no emoji** — SVG icons (paperclip, document); (3) keep the Meta column's existing vertical 5-line design (Type / By / Due / Status / Edited by), each value a pill; (4) Status pill = **neutral pill + coloured dot + 3-letter code** (hover reveals full label) — the dot carries the colour so colours need not be memorised, and the **code is configurable per status in Settings**; (5) other Meta values (By / Edited by) use **short codes** (`initials()`) to minimise Meta width; (6) record all updates in the workplan.
- Changes:
  - `js/render.js`: (a) `logMetaStatus` / `renderMetaInRow` Status line → neutral `.chip-mini.st` pill + `<span class="ae-dot">` (status colour) + 3-letter `statusCode(r.status)`; (b) `logMetaBy` / `logMetaEditedBy` → `initials(n)` short codes; (c) `logRowHtml` Detail cell → `.ae-attach-chip` button (paperclip SVG + `.ae-attach-count`) instead of the inline editor; (d) `bindLogRow` → chip click opens `openAttachPop(row,a)` + `updateAttachCount(row)`; (e) `renderChips(arr, container, dataRow)` rewritten to a **3-arg** signature so it can render into the popover body; (f) new `openAttachPop` / `closeAttachPop` / `updateAttachCount` (the `#aeAttachPop` modal) + `normalizeLinkSrc` (local `C:\` paths → `file://`, quotes stripped); file-link chips use an SVG doc icon (no 📄 emoji); (g) `collectLogAttachments` / `syncPreview` / `saveInlineAction` unchanged (already use `attachments[]` + `collectLogAttachments`).
  - `js/settings.js` (`renderColorList`): statuses gain a **`code` input column** (3-letter, A–Z, max 3); built-in statuses keep label/colour locked but their code IS editable; `bindStdRow` commits `code`; `clAdd` ghost row + header include the code column. Priorities keep the 3-column layout.
  - `js/core.js`: `defaultStatusCode(label)` (already present) derives the code; `normStatus` carries `code`; `statusCode(s)` resolves it. No new helpers needed beyond what shipped with ISS-75.
  - `css/styles.css`: `.ae-attach-chip` (absolute top-right of Detail cell), `.ae-attach-count`, `.chip-mini.st` neutral + `.ae-dot` coloured, `.ae-attach-pop` popover, `.cl-code` input styling.
  - `index.html`: added `#aeAttachPop` modal (mirrors `#aeMetaPop`).
- Supersedes the **inline-editor UI** portion of ISS-75 (v41) — the `attachments[]` data model, the Picture/File-link grouping, and the hyperlink rendering from ISS-75 are retained; only the always-visible control moves into the popover. ISS-76 (row auto-fit + minimized rows) remains valid and now also benefits from the removed inline editor.
- Status: **Implemented (2026-09-04, v42)** — pending `node --check` (render.js / settings.js / core.js) + browser smoke test + commit.
- Related: §2 v42; §16.4 ISS-77; supersedes ISS-75's UI (data model retained).

*(New issues/requirements/updates get appended here following the convention above.)*

### [2026-08-20] Requirement/Update — B3 plan approved (schedule + progress + Info + WBS-conflict + Split-inheritance)
- Reported by / trigger: user confirmed B3 scope after parent/child × dependency review.
- Detail / approved decisions:
  - **Q1 (Info status)**: Info is a **system default status** (same tier as "In Progress"), added to seed; user may rename/delete via Statuses list. (ISS-22)
  - **Q2 (progress bar location)**: progress shown in the **detail panel only** (not in sidebar list rows). (ISS-21)
  - **Summary-task model**: a parent with children → its `schedule`/`progress`/`deps` are rolled-up / hidden in UI; manual entry disabled. (ISS-20, ISS-21, ISS-34 Option A)
  - **Split inbound deps**: copied to **both** new sub-actions. (ISS-34)
  - **Split outbound deps**: kept on the (now summary) split action, hidden in UI — **Option A** chosen (no data loss, reversible). (ISS-34)
  - **NEW ISS-33**: `wouldCreateWbsConflict` — forbid non-cycle but WBS-self-contradictory dependency edges (parent↔descendant, ancestor↔descendant), surfaced as `⚠ same WBS` alongside `⚠ cycle` / `⚠ different project`.
- Decision / status: **Plan approved — awaiting code (B3) after review.** Code was NOT written yet (review-first; also agent Bash shell was down, so `node --check` could not run). *Status: Open (plan approved).*
- Related: §9.4, ISS-19…ISS-22, ISS-33, ISS-34.

---

## 12. Deliverables

| File | Purpose | State |
|------|---------|-------|
| `index.html` | Single-file app (editor, tree, settings, export, load/save, schema v2) | ✅ Implemented (structural) |
| `action.json` | Sample business data (schema v2) | ✅ Current |
| `setup.json` | UI config (brand/labels/help/reports/filters) | ✅ Current |
| `layout-review.md` | UI design evaluation + sprint status | ✅ Reference |
| `layout-review.md` | UI design evaluation + sprint status | ✅ Reference (root) |
| `arch/overview.md` | Earlier implementation summary; picture-link feature design | 🗄️ Archived 2026-08-24 (superseded by this workplan) |
| `arch/action-panel-example.html` | Early layout prototype | 🗄️ Archived 2026-08-24 (reference only) |
| `arch/syntaxcheck.js` | Throwaway Node syntax check (broken by restructure) | 🗄️ Retired → Archived 2026-08-24 |
| `arch/_b1_loadcheck.js` | Node load/eval harness (ISS-09, broken by restructure) | 🗄️ Archived 2026-08-24 |
| `arch/index.html.bak` | Pre-restructure (flat) rollback copy | 🗄️ Archived 2026-08-24 (no longer needed) |
| `restructure.bat` | One-time asset-split move into css/ js/ assets/ | ✅ Done (re-run not needed) |
| `run_action_log.bat` | Copy code to desktop + serve + open | ✅ Active utility (updated for subfolders) |
| `archive_cleanup.bat` | Move non-required files into `arch/` | ✅ Utility (run once) |

---

## 13. Glossary

| Term | Meaning |
|------|---------|
| **SSOT** | Single Source of Truth — the stable `id` that all references resolve to. |
| **Schema v2** | Current data schema where actions reference list items by `id` (was label/name in v1). |
| **Orphan fallback** | When a v1 label/name can't map to an id, it's preserved in a `*Label`/`*Names` field so no data is lost. |
| **Soft delete (action)** | Action marked `deleted`/`statusId=deleted`; hidden from live views, kept in JSON until physically removed in Settings → Deleted. |
| **Left member** | Member with `left:true`; record kept, references still resolvable, hidden from active pickers. |
| **Reassign modal** | `#reassignModal` — blocking dialog requiring the user to reassign/remove every reference before deleting a list item. |
| **Standard list** | The shared inline CRUD component (`.lm-head` + rows + ghost-add) used by all five Settings lists. |
| **liveActions()** | Filtered action list excluding soft-deleted actions; used by every view/count. |
| **Quick Actions** | Right-panel button group: Save Actions · Save Settings · Export · Import · Layout · Help. |
| **FS Access API** | File System Access API (`showSaveFilePicker` etc.); Chromium-only in-place file writes. |

---

## 14. Known Constraints & Risks

- **Browser support**: File System Access API is Chromium-only. Firefox/Safari fall back to download with an explicit "can't write directly" notice. Pickers reopen in the last folder via `IndexedDB`.
- **Verification gap**: During development the shell was unavailable, so changes were validated by *structural review* only. A Chrome smoke test is still required (see §16.4 ISS-32).
- **`beforeunload` text**: Modern browsers show a generic leave-confirmation; custom "unsaved" copy is shown via the persistent top-bar "● unsaved" pulse instead.
- **Per-project discipline scope**: Reports / Disciplines view remain *global* aggregates (catalog semantics); only the tree filters per project. Optional "Unassigned" node is still open (§11).
- **Phase 3 deferred**: custom fields and workflow rules are not yet built; the data model leaves room for them but no UI exists.

---

## 15. References

- `layout-review.md` — UI design evaluation, sprint plan, and per-item status (supersedes the inline §10 review here; read for full evidence).
- `arch/overview.md` — earlier implementation summary + picture-link feature design (schema v1 era; archived 2026-08-24, kept for history).
- `action.json` / `setup.json` — canonical current data & config; the schema described in §8–§9 is realized here.
- `index.html` — the implementation; section references in this doc (§7, §9) map to functions/helpers within it.
- Design skills: `ardot-design-core`, `ardot-design-router` (used for design-to-code workflow and routing).
- Original `workplan_schema_split.md` — predecessor of this document (renamed to `project_action_log_workplan.md` on 2026-08-20; content merged and restructured).
- **§9.4** Schema v3 design (relations + scheduling) — the canonical spec for ISS-11…ISS-26.
- **§9.5** File-split architecture (asset split: `index.html` + `styles.css` + 7 JS modules) — the spec for ISS-01…ISS-10.
- **§16** Issue & Task Register (ISS-01…ISS-32) — the canonical, issue-ID-indexed task list for all pending work.

---

## 16. Issue & Task Register (canonical — refer here for all pending work)

> **How to use:** every future change is an `ISS-xx`. Status: `Open` → `In Progress` → `Done`. Implementation is **review-first**: design the change, get approval, then implement. On close, add a one-line update under §11 and bump §2. Design lives in §9.4 / §9.5. This register is the **single source of truth** for all work — open backlog (§16.4), historical closed issues (§16.5), and the Definition of Done (§16.6); the former §10 was retired into it.

### 16.1 A — File restructure (asset split; pure refactor, do first)
| ID | Issue | Design ref | Status |
|----|-------|-----------|--------|
| ISS-01 | Extract `styles.css` from `index.html` lines 7–333; link via `<link>` | §9.5 | Done |
| ISS-02 | Create `core.js` (state, schema, normalize/find, `applyDataset/Setup`) | §9.5 | Done |
| ISS-03 | Create `io.js` (resolveDataUrl, IDB, load/save/serialize, `autoLoad`, download) | §9.5 | Done |
| ISS-04 | Create `render.js` (sidebar/main/tree, topbar, save buttons, status bar) | §9.5 | Done |
| ISS-05 | Create `editor.js` (action editor, create modal, segs, log) | §9.5 | Done |
| ISS-06 | Create `settings.js` (lists, reassign, members, modals) | §9.5 | Done |
| ISS-07 | Create `report.js` (reports, search, export) | §9.5 | Done |
| ISS-08 | Create `bootstrap.js` (init, event wiring, `autoLoad()` call) | §9.5 | Done |
| ISS-09 | Rewrite `index.html` as shell (`<link>`+`<script src>`); verify file:// **and** http:// load | §9.5 | Done |
| ISS-10 | Update `run_action_log.bat` to copy `styles.css` + 7 JS files | §9.5 | Done |

### 16.2 B — Schema v3: relations & scheduling
| ID | Issue | Design ref | Status |
|----|-------|-----------|--------|
| ISS-11 | Add `parentId` + 3-tier depth validation | §9.4 | Done |
| ISS-12 | "Split into sub-actions" + parent/child tree rendering in sidebar | §9.4 | Done |
| ISS-13 | Parent rollup — read-only summary (child count + completion %); date min/max + duration-weighted progress finalized in B3 once `schedule` lands | §9.4 | Done |
| ISS-14 | Add `deps[]` (replace `dependsOn`): predId/predKind/type/lag | §9.4 | Done |
| ISS-15 | Dependency editor UI (predecessor picker + type dropdown + lag input) | §9.4 | Done |
| ISS-16 | CPM constraint validation (FS/SS/FF/SF + lag) + cycle detection | §9.4 | Done |
| ISS-17 | Same-project dependency validation (reject cross-project `action` refs) | §9.4 | Done |
| ISS-18 | Add `referencePoints[]` (cross-project anchor, predecessor-only) | §9.4 | Done |
| ISS-19 | Add multi-date `schedule` object (planStart/duration/forecast/actual) — **leaf only** | §9.4 | **Done** |
| ISS-20 | Schedule editor UI (multi-date inputs) — **hidden/disabled on summary (parent) actions** | §9.4 | **Done** |
| ISS-21 | `progress` field (leaf manual 0–100; parent = **duration-weighted rollup** `Σ(child.progress×child.duration)/Σ child.duration`, read-only) + progress=100 inform-only (no auto-Completed); **progress bar shown in detail panel only** | §9.4 | **Done** |
| ISS-22 | "Info" status = **system default metadata** (same tier as "In Progress"), added to seed; status-driven schedule exclusion (`isScheduled(a)` = has `planStart` AND status≠Info) | §9.4 | **Done** |
| ISS-33 | **WBS conflict guard** (NEW): forbid dependency edges that form a non-cycle but self-contradictory WBS link — a parent depending on its descendant, a child depending on its ancestor, or any cross-ancestor/descendant dependency. Walks ancestor chain + descendant subtree; surfaces `⚠ same WBS` in `depWarn`. Complements `wouldCreateCycle` (which only catches loops). | §9.4 | **Done** |
| ISS-34 | **Split dependency inheritance** (NEW, captures approved decision): on `splitIntoSubactions`, inbound dependencies (other actions depending on the split action) are **copied to BOTH new sub-actions**; the split action's **outbound** dependencies are **kept on the split action** (now a pure summary) and hidden in the UI (Option A — no data loss, reversible). | §9.4 | **Done** |
| ISS-35 | **Predefined statuses read-only** (CHANGED decision vs B3 Q1): the 7 seeded statuses (pending / in-progress / completed / blocked / on-hold / not-started / info) become **built-in** — label + color are read-only and **cannot be deleted** in Settings → Statuses. User may only **add**, **update**, and **delete user-created** statuses. Guarantee Info is always present: `applyDataset` back-fills any missing built-in status **and sets `dataDirty` so the old `action.json` is updated on next Save**; `normStatus` tags `builtin`; `serializeData` round-trips `builtin`; embedded `seedData` also gains Info. | §9.4 | **Done** |
| ISS-36 | **Default duration = 0** for new actions: `modalSave` (new action) and `createChild` (+Sub-action) initialize `schedule:{ duration: 0 }`; Schedule editor shows `0` as the default when `duration` is empty (clearing still stores empty). (Changed from originally proposed 0.3 → 0 per user.) | §9.4 | **Done** |
| ISS-37 | **Parent/child dependency management (read-only consolidation)**: parent (summary) shows **no editable dependency editor** (already hidden); instead show a **consolidated, read-only dependency view** — union of the parent's own `deps[]` + all sub-actions' `deps[]`, each row annotated with which source(s) reference it (`parent` / sub-action titles). Children keep their own editable `deps[]`. Consistent with the summary-task model (schedule/progress/deps all roll up). Implemented via `consolidatedDeps()` + `renderDepSummaryHtml()` (editor) and `reportDepsHtml()` (shared report/export). | §9.4 | **Done** |
| ISS-38 | **Status list de-duplication + default list = system statuses only** (bug fix from user test): `ensureBuiltinStatuses` renamed to `normalizeStatuses` — builds exactly the 7 built-in statuses (each once, preserving saved color), then keeps user statuses that do NOT collide with a built-in label; any duplicate (by id or label) and any user status shadowing a built-in label is dropped. This eliminates the duplicate-status bug (a user-added status with a built-in label was double-marked as built-in) and ensures the default list holds only system statuses. Embedded `seedData` default list has the user status `Deleted` removed (now exactly 7 system statuses). Settings "Built-in" tag switched to English. `dataDirty` set when the list is cleaned so the old `action.json` is updated on next Save. | §9.4 | **Done** |
| ISS-23 | **Delete-parent protection + child promotion**: a parent (summary) action that still has sub-actions **cannot be deleted** — `deleteAction` blocks with a toast naming the sub-action count. A sub-action can be **independently promoted one level up** via a new `↑ Promote` button shown **only in the action panel** (`renderActionTop`, when `a.parentId!=null`); `promoteAction(a)` in `editor.js` reparents the node to its **immediate parent's level** (becomes a sibling of its current parent — `a.parentId = parentOf(parent)`), NOT all the way to the root; `deps[]`/`schedule` are kept, then it refreshes. No tree right-click menu (per user decision). Refinement (2026-08-21): promotion moved from "to root" to "one level up" per user test feedback. | §9.4, §5.3 | **Done** |
| ISS-24 | **Delete clears all dependency links + custom confirm**: before deleting, a **custom confirmation modal** (`#delConfirmModal`, ISS-24) lists every affected link — "Outbound" (this action depends on) and "Inbound" (other actions depend on this, with source title), plus the total count — so the user can assess impact and confirm. On confirm, `softDeleteAction` drops all inbound links (`predKind:'action' && predId===a.id`) from every other action and clears the action's own `deps[]` (outbound); toast reports `# removed`. Both soft-delete entry points route through `deleteAction`, so the protection + confirm apply to the action panel and the read-only detail view alike. | §9.4 | **Done** |
| ISS-25 | v2→v3 migration (`dependsOn`→`deps[FS,0]`; no `schedule`→pending) | §9.4 | Done |
| ISS-26 | `CURRENT_SCHEMA`→3 + migration detection + seed update | §9.4 | Done |

### 16.3 C — gantt (future, after index.html v3 finalized)
| ID | Issue | Design ref | Status |
|----|-------|-----------|--------|
| ISS-27 | `gantt.html`: plan/forecast/actual bars + dep arrows (by type) + **critical path (CPM)** + reference-point diamonds + today line + slip coloring | §9.4, §9.5 | Open (future) |

### 16.4 D — Open backlog / deferred (from §7 F18–F21 + open DoD)
| ID | Issue | Design ref | Status |
|----|-------|-----------|--------|
| ISS-28 | F18 Custom fields framework (Phase 3 MVP) | §7 F18 | **Done** (implemented 2026-08-21) |
| ISS-29 | F19 Workflow rules engine (Phase 3) | §7 F19 | Open (deferred) |
| ISS-30 | **Tree hierarchy + Unassigned node (F20)**: standardized per-level indent (`treePad(level)=8+level*(treeIndent||16)`, default 16px, configurable in Settings → Layout, persisted to `setup.json`); **highlighted project tiles** (accent fill + left accent bar on select). **Restructured tree** (user feedback): per project → (a) **one `Unassigned` node (lvl 1)** containing **disciplines with no actions (lvl 2, expand → "no actions yet" + "+ Add action")** AND **discipline-less actions (lvl 2)**; (b) **disciplines WITH actions (lvl 1)** with their actions (lvl 2). `node --check` pending (agent Bash sandbox down) — **user to run locally**: `node --check render.js`. (v21: `Unassigned` node pinned to the **bottom** of the per-project subtree.) | §7 F20, §9.4 | **Done** |
| ISS-31 | F21 dependsOn warning on physical delete — **Option B implemented 2026-08-21 (reuse #delConfirmModal, block per ISS-23 pattern)**: `$('dlRemove')` now calls `inboundRefsForPurge(targetIds)` → if any live inbound `deps[]` exist, `#delConfirmModal` opens with a blocking warning listing each referencing action + edge type (FS/SS/FF/SF) + lag + total count, OK-only; nothing is purged until the user manually clears those dependencies. If no live inbound refs, lightweight native `confirm()` fires and purge proceeds. Reference-point edges (`predKind:'ref'`) ignored. `node --check` pending (agent Bash sandbox down) — **user to run locally**: `node --check settings.js`. | §7 F21 | **Done** |
| ISS-32 | Live browser smoke test (Chrome): dual-file load, dirty buttons, reassign modal on referenced delete, member "left" keeps name, v1→v2 migration writes v2 | §16.6 DoD | **Done** (user confirmed on 2026-08-21) |
| ISS-39 | Detail-panel redesign — hover-only affordances (a11y / discoverability): "click-to-edit" pencil + "locked" lock glyph show only on `:hover` → keyboard & touch users can't discover editability (WCAG 2.1.1 / 2.4.7 / 1.4.1; Nielsen #4/#6). Make affordance persistent at rest + `:focus-visible`. | §6.5 | Agreed (solution confirmed 2026-08-24; pending implementation) |
| ISS-40 | Folded `Schedule & Dependencies` must surface dependency warnings (cycle / cross-project) via a text+icon badge, not color-only (Nielsen #1; WCAG 1.4.1). | §6.5 | Implemented (2026-08-24; pending node --check + commit) |
| ISS-41 | Hybrid "click-value-to-edit" + inline + folded model is inconsistent with platform form conventions (Nielsen #4/#6); unify affordance; consider always-on controls for Status/Priority. | §6.5 | Implemented (2026-08-24; pending node --check + commit) |
| ISS-42 | Double sticky (edTop + subhead) crowds content area on short viewports (Apple HIG; Nielsen #8); slim subhead / merge into one sticky block; verify 768/1024/1440. | §6.5 | Implemented (2026-08-24; pending node --check + commit) |
| ISS-43 | Focus value cells need ≥44px touch target (WCAG 2.5.5; Fitts's Law). | §6.5 | Implemented (2026-08-24; pending node --check + commit) |
| ISS-44 | Click-to-edit popover needs focus management (no trap; Esc / outside-close; return focus to trigger) — WCAG 2.1.2 / 2.4.3; ARIA. | §6.5 | Implemented (2026-08-24; pending node --check + commit) |
| ISS-45 | Redundant display of Project/Discipline (Subhead + Focus row1) and Status (Subhead + Focus row3) — confirm intentional or trim (Nielsen #8; Miller). | §6.5 | Resolved (user decision 2026-08-24: Project/Discipline removed from Focus; Status kept as overview/control mirror) |
| ISS-46 | Parent (summary) lacks Progress → layout shift in Focus row3; render equal-height read-only rollup placeholder (Nielsen #4). | §6.5 | Implemented (2026-08-24; pending node --check + commit) |
| ISS-47 | Static-looking values are secretly editable → accidental-activation risk (Nielsen #5/#10); add clear affordance + cancel path + dirty pulse. | §6.5 | Implemented (2026-08-24; pending node --check + commit) |
| ISS-48 | Dimmed affordance glyphs may drop below WCAG 1.4.11 non-text contrast (≥3:1); verify rest-state color/opacity. | §6.5 | Implemented (2026-08-24; pending node --check + commit) |
| ISS-49 | `run_action_log.bat` hard-refresh notice was easy to miss (single trailing line); stale cached page made it look like data "won't load". | §5.1 | Implemented (2026-08-24, v27): launch prints a bold bordered block — press Ctrl+Shift+R (Cmd+Shift+R) after every file update; reads action.json/setup.json from the .bat folder; notes to check action.json exists. Text-only change. |
| ISS-50 | Action node number (`#id`) was plain grey text; weak visual anchor for "which action am I updating". | §6.5 | Implemented (2026-08-24, v27): `.ed-sh-id` restyled as a round accent disc (white fill, `#0066CC` 2px ring/text; dark `#0A84FF`); only present on the Actions perspective. |
| ISS-51 | Subhead (`.ed-sh-inner`) was centered at `max-width:860px`, so on wide screens it did NOT align with the `Description` body below (left edges diverged). | §6.5 | Implemented (2026-08-24, v27): dropped `max-width:860px; margin:0 auto`; subhead now spans the same 32px-padded content width as `.ed-body` → left edges aligned. |
| ISS-52 | Subhead + node badge leaked onto non-Actions perspectives (e.g. Projects/Reports/Settings) because `renderMain()` never cleared `#edSubhead` when switching away from Actions. | §6.5 | Implemented (2026-08-24, v27): `core.js renderMain()` clears + hides `#edSubhead` whenever `state.perspective!=='actions'`; badge/identity now show ONLY when updating an action. |
| ISS-53 | file:// double-click regressed from §5.1 (startup modal) to a silent sample fallback — the "Choose JSON file" / working-folder modal no longer appeared. | §5.1 | Implemented (2026-08-24, v27): `io.js autoLoad()` file:// branch restored — Firefox auto-fetches `./action.json`; Chrome (fetch blocked) calls `promptPickJson()` → `#openJsonModal` (pick action.json + set folder). http branch untouched (auto-load, no modal). |
| ISS-54 | Created by / Created on became invisible after the v26 redesign (data retained, UI dropped). | §6.5 | Implemented (2026-08-24, v28): shown as read-only chips on the same Subhead row as Project/Discipline/Status; "Created on" not editable. No data schema change. |
| ISS-55 | Focus `Status`/`Priority` values were plain text, not matching the Setting-defined color pattern. | §6.5 | Implemented (2026-08-24, v28): cells render + live-update with `statusStyle`/`priorityStyle` (setting color, bg+contrast text); Subhead `#shStatus` mirrors the same color. |
| ISS-56 | Overdue `Due date` gave no visual alert; focus value did not refresh on dropdown selection. | §6.5 | Implemented (2026-08-24, v28): `Due date` cell gets red background when overdue (`isOverdue` = due < today AND status ≠ Completed); `syncFocusDisplays` repaints Status/Priority color + toggles overdue on every selection change. **Bug fix (post-v28)**: `syncFocusDisplays` was reading `a` (written only at save) so popover changes didn't reflect; now reads live selection from the controls (`selectedSeg`/`selectedPriority`/`selectedAssignees`/`$('aeDue').value`). |
| ISS-57 | (Tracking alias) Post-v28 focus-cell-not-updating fix — same fix as ISS-56's bug-fix line; recorded as a discrete issue after user re-test. | §6.5 | Fixed (2026-08-24, v29): `syncFocusDisplays` reads live popover selection; `aeDue` input calls it. Verified in §11 post-v28 entry. |
| ISS-58 | `git-sync.bat` lacked a fork-safe sync path (only `--ff-only` Pull / Commit+Push); diverged forks (local + GitHub both have new commits) had no one-command option. | Repo tooling (§12 deliverables) | Implemented (2026-08-26, v30): added **option 7 = Commit + Pull --rebase + Push** + rewrote every menu option with plain-English usage notes; conflict/abort hints included. Helper `.bat` only; no app code. |
| ISS-59 | ae-log P1 — extend `detailLog[]` row with meeting fields: `editedBy`, `typeIds:[]` (multi-select from `getActionTypesForProject`), `actionBy:[]` (members multi-select), `due`+`dueHistory:[]`, `status`. **Approved layout (2026-08-27)**: 4 cols = `Row`(↑/↓/✕) · `Date` · **`Detail`(widest)** · `Meta`(trailing single col stacking the 5 fields as current-value-only lines). **Option A**: each Meta line clickable → popover editor (`#aeMetaPop`); multi-select cols show only current values. `readLogRowData` reads `row.dataset`. Live preview `detailLogRows` (report.js) shows the fields. Files: `render.js`, `report.js`, `io.js`, `css/styles.css`, `index.html` (popover). | §6.5 / ae-log | **Implemented (2026-08-27)**; **fixed 2026-08-27 (v35)** — popover click threw `ReferenceError` on dead `_rowAction = a;` under strict mode (removed); stale CSS selectors corrected. Pending user `node --check` + browser smoke test + commit |
| ISS-60 | ae-log P1 — add `actionTypes` settings collection (mirrors customFields model: global catalog in setup.json; per-project enablement via `project.actionTypeIds[]`; empty array = all global types offered, subset = only those offered). Seed: Internal Design Change, Vendor Change, Client Design Change, Design Development, Client Instruction; user add/rename/delete in Settings → Action Types. Powers the `typeIds` multi-select (ISS-59). Files: `core.js` (`state.actionTypes`, `normActionType`, `DEFAULT_ACTION_TYPES`, `getActionTypesForProject`), `io.js` (load + `serializeSetup.actionTypes` + `projects[].actionTypeIds`), `settings.js` (`renderActionTypes`, `openProjectActionTypesModal`, `deleteActionType`, SETSECTIONS entry). No app-code token/label changes beyond new Setting title "Action Types". | §6.5 / settings | **Implemented (2026-08-27)**; pending `node --check` (agent Bash sandbox down — user to run locally) + browser smoke test + commit |
| ISS-61 | ae-log P2 — row reorder via per-row **↑/↓ buttons** (swap with adjacent; marks dirty; DOM order = data order). Low-accident, reversible, keyboard-accessible. Implemented in `bindLogRow` (`.ae-row-mv` buttons) + CSS. | §6.5 / ae-log | **Implemented (2026-08-27)**; pending `node --check` + commit |
| ISS-62 | ae-log P3 — filter/sort toolbar above `#aeLog` (by `typeIds` / `actionBy` / `status` / `date`; asc/desc). View-only, no data change. | §6.5 / ae-log | Open |
| ISS-63 | ae-log P4 — "Export minutes" button reusing `reportHtml` / `detailLogRows` to emit a minutes view (title + metadata + extended log table: Date / Type / Action by / Due / Status / Detail) via existing `msoDownload` (Word / Excel). | §6.5 / report | Open |
| ISS-64 | ae-log P5 — lightweight `@ref` in `detailLog[i].text` (`@<id>`→action, `@img:<name>`→picture); resolved into readable text **only at export** (ISS-63) via `expandRefs(text)`; never silently dropped (raw ref retained); missing ref → muted `→ #id [action not found]`; deleted action → `→ #id <title> [deleted]`; broken image refs mirror existing `.broken` handling. | §6.5 / ae-log | Open |
| ISS-65 | ae-log P1 — data-model back-compat: `io.js` load-time defaulting for `detailLog[i]` fields (`editedBy`, `typeIds:[]`, `actionBy:[]`, `due`, `dueHistory:[]`, `status`) so legacy rows keep loading; same defaults also applied in `bindLogRow` on first bind. | §9.3 / io.js | **Implemented (2026-08-27)**; pending `node --check` + commit |
| ISS-66 | ae-log P1 (DEFERRED) — welcome page / recorder setting: a recorder (current user) selector that **auto-defaults new log rows' `editedBy`**. **User decision: deferred** (welcome page added later); record as pending. Interim: `editedBy` manually editable per row (ISS-59). When built, store `state.setup.recorder` (setup.json); location TBD (Settings selector v1, welcome modal later). | §6.5 / ae-log | Open (deferred) |
| ISS-67 | ae-log — user-resizable `#aeLog` columns: drag handles on the 4 `th` (Row / Date / Detail / Meta); persist widths to `localStorage`; Detail flexible. Spawned from v37 item 5b. | §6.5 / ae-log | **Implemented (2026-09-02, v38)** — user reported columns did NOT resize; root cause: handles/binder never applied + `fixed`+`100%` re-normalisation. Re-fixed in v38 (ISS-69). Pending browser smoke test. |
| ISS-68 | ae-log — **sticky `#aeLog` header background bleed** on scroll (body shows through). `border-collapse:collapse` + `position:sticky` bug. Fix: `border-collapse:separate; border-spacing:0` + box-shadow 1px separators; opaque th bg + z-index:3 + `background-clip:padding-box`. | §6.5 / ae-log | **Implemented (2026-09-02, v38)**; **STILL BLEEDING on user test → re-fixed 2026-09-02 (v40, ISS-74)** — `z-index:3` on the cell alone could not out-rank the row form controls / pinned Attach-Link bar |
| ISS-69 | ae-log — **column resize not effective / no affordance** (follow-up ISS-67). Causes: resizer handles + `bindColResizers` were never applied; `fixed`+`100%` re-normalises widths so drag felt inert. Fix: real thead handles + visible 2px grip; percentage widths with neighbour compensation (total stays 100%); persist to `localStorage`. | §6.5 / ae-log | **Implemented (2026-09-02, v38)** — pending browser smoke test |
| ISS-70 | ae-log — **Attach / Link not pinned to row bottom**. Fix: Detail `td` gets `class="ae-log-detail"` (flex column, `height:100%`) + `.ae-img-ctl{margin-top:auto}`. | §6.5 / ae-log | **Implemented (2026-09-02, v38)**; **mechanism replaced 2026-09-02 (v39, ISS-72)** — the flex `<td>` broke the row grid; now table-cell + absolute pin, bottom-pin behaviour kept |
| ISS-71 | `apply_v38.js` is **not idempotent** — running it twice re-inserts every replacement whose anchor survives inside its own inserted text (JS 2G/2H, CSS 1C/1D-padding), producing a duplicated `bindColResizers` block and `SyntaxError: Identifier 'COL_RES_KEY' has already been declared`. Fix: de-duplicated `js/render.js` + `css/styles.css` by hand; script hardened with a per-replacement `mk` marker (exists only in the new text) so re-runs report "already applied"; files read once, patched in sequence, written once, with a summary line. | tooling / apply_v38.js | **Fixed (2026-09-02, v38)** — pending `node --check` |
| ISS-72 | ae-log — **Detail column bottom grid line not aligned with the other columns** (v38 regression). Root cause: the v38 ISS-70 fix set `display:flex` on the Detail `<td>`, removing it from table layout (wrapped in an anonymous cell) so its box-shadow grid lines ended at the content box instead of the row height. Fix: keep `display:table-cell` — `position:relative` + `padding-bottom:42px`, Attach/Link pinned absolutely (`left/right:10px; bottom:7px`, `flex-wrap:nowrap`, link input `min-width:0`). ISS-70 bottom-pin behaviour preserved. | §6.5 / ae-log | **Implemented (2026-09-02, v39)** — pending `node --check` + browser smoke test |
| ISS-73 | ae-log — **"Description — dated detail log" heading floated detached above the table**. `.ae` is a flex column with `gap:0`, so the only gap was the heading's `margin-bottom:8px` + `.ae-log{margin-top:4px}` (12px dead space under a 16px-margin divider). Fix: heading relocated INSIDE `.ae-log-wrap` (`js/render.js`) so it reads as the table caption; `margin:0 0 6px` + `.ae-log{margin-top:0}`. No text change. | §6.5 / ae-log | **Implemented (2026-09-02, v39)** — pending `node --check` + browser smoke test |
| ISS-74 | ae-log — **pinned column header still lets the table show through / above the header band on scroll** (v38 ISS-68 regression, found in v39 browser test). Verified: the only element that actually pins is `.ae-log th` (`#edSubhead` is a **sibling** of the `#edBody` scroll container, so its own `position:sticky` never engages). Root cause: v38 used a single guard — `z-index:3` on the sticky `th` — which cannot out-rank the row content it must cover (`<input type="date">`, `<textarea>`, buttons, and the absolutely-pinned Attach/Link bar from ISS-72); the `th` background was already opaque, so this is a paint-order failure, not a transparency one. Fix (`css/styles.css`): three independent guards — (1) `.ae-log thead{position:sticky; top:0; z-index:6}` makes the row-group a stacking context so every row descendant paints below the band; (2) `.ae-log th` keeps `position:sticky; top:0; z-index:6` + `will-change:transform` (own compositing layer; also covers engines without sticky row-groups); (3) `.ae-log tbody{isolation:isolate}`. Plus double-painted band background (`background-color` + matching `linear-gradient`) for guaranteed opacity, outer `0 1px 0` bottom hairline, and the missing `inset 0 1px 0` top hairline restored on the first `th`. | §6.5 / ae-log | **Implemented (2026-09-02, v40)** — pending `node --check` + browser smoke test |
| ISS-75 | ae-log — **Attach/File-link restructure**: the dated-detail-log Attach/Link control (from ISS-70/72) conflated "upload a picture" with "reference a file link", put both on one cramped row, and rendered every stored item as a `<img>` (so a PDF/path/URL link showed as a broken image). Approved fix (2026-09-03): (a) split into two labeled groups with a divider — **🖼 Picture** (`🖼 Add pictures`, multi image/* picker, embeds/saves as before) and **🔗 File link** (paste-URL box + `＋ Add link` + `📂 Browse files` multi-picker); (b) **data-model rename** `detailLog[i].images[]` → `detailLog[i].attachments[]` with `{name, src, type:'image'|'file'}`; `io.js applyDataset` migrates legacy `images` → `attachments` (type:'image') and deletes the old key; (c) render file links as clickable hyperlinks (📄 name ↗, new-tab) instead of `<img>` — `renderChips` branches by `type`, `reportHtml` + `report.js detailLogRows` render file links as real `<a>` (Word export too); (d) remove the v39 absolute-pinned bar (control now in-flow) — this also closes the ISS-72 overlap/clip risk; the v40 sticky-header guards are unaffected. **Known limitation**: `blob:` URLs produced by the `📂 Browse files` picker are session-scoped (invalid after reload); paste-URL links (absolute / web) persist. Files: `js/render.js`, `js/report.js`, `js/io.js`, `css/styles.css`. | §6.5 / ae-log | **Implemented (2026-09-03, v41)** — inline-editor UI **superseded 2026-09-04 by ISS-77** (replaced by an on-demand popover; `attachments[]` data model + hyperlink rendering retained). Remaining open item: `node --check` (render.js/report.js/io.js) + browser smoke test (multi-picture, multi-file-link, hyperlink open, report/Word render) + commit |
| ISS-76 | ae-log — **Detail row height auto-fit + minimized attachment rows** (ISS-75 follow-up, 2026-09-03): (1) each dated-detail-log `<textarea>` now auto-sizes to its content (`autosizeTextarea` → height = scrollHeight) on render, on `input`, on column-resize, and on window `resize`, so the **Detail row height always equals its full content** with no inner scrollbar; (2) Picture/File-link rows are **minimized automatically** — an empty chip row (`.ae-img-row`/`.ae-link-row`) is hidden via `:empty`, and a group hides its header + chip row (`.has-items`) and the inter-group divider (`.ae-attach:not(.has-any)`) until it holds items, so a row with no attachments collapses to just the two compact "add" controls. `renderChips` toggles `has-items`/`has-any`; `bindLogRow` wires the autosize; `bindColResizers` re-fits on drag/resize. Files: `js/render.js`, `css/styles.css`. | §6.5 / ae-log | **Implemented (2026-09-03)** — pending `node --check` (render.js) + browser smoke test (tall text auto-fits; empty rows collapse; divider hidden when no items) + commit |
| ISS-77 | ae-log — **compact detail table**: replace the inline Attach/File-link editor (ISS-75's UI) with an on-demand **attachment popover** (`#aeAttachPop`) opened from a **count chip** (paperclip SVG + count) in the Detail cell; add a **3-letter Status short-code** in the Meta column (neutral pill + coloured dot + configurable code; hover reveals label; code editable in **Settings → Statuses**); Meta `By`/`Edited by` use `initials()` short codes. No emoji (SVG paperclip + doc icon). | §6.5 / ae-log | **Implemented (2026-09-04, v42)** — pending `node --check` (render.js/settings.js/core.js) + browser smoke test (popover add/remove pictures + file links; count chip syncs; status pill = dot + code; Settings status code persists) + commit |

### 16.5 E — Historical closed issues (moved from §10; reference only)
*These were completed in prior phases. Kept as an audit trail; do not re-open unless regressing.*

#### 16.5.1 UI design review (from `layout-review.md`)
| ID | Issue | Resolution | Status |
|----|-------|-----------|--------|
| P0-1 | No mobile drawer entry for side/right panels | Added `☰` + scrim + Esc; `m-show-side`/`m-show-right` wired | ✅ Done |
| P0-2 | `.rp-btn.primary` undefined | Added primary/dirty/disabled styles (later dirty highlight removed per user) | ✅ Done |
| P1-3 | Two blues (`#0A84FF` vs `#0066CC`) | Unified to `var(--accent)` | ✅ Done |
| P1-4 | Right panel redundant + no scroll | Trimmed buttons; `overflow-y:auto` | ✅ Done |
| P1-5 | Search detail ≠ inline editor | Reused `reportHtml()`; removed duplicate | ✅ Done |
| P1-6 | Help text stale (claimed hover delete) | Rewrote to actual controls | ✅ Done |
| P1-7 | Status bar mixed duties | Purified to status-only; actions moved up | ✅ Done |
| P1-8 | Inconsistent form label placement | Unified to label-on-top 2-col grid | ✅ Done |
| P1-9 | Content width inconsistent | `#edBody > *{max-width:860px}` | ✅ Done |
| P2-a | No focus-visible / ARIA / Esc | Added globally; 6 modals dialog+focus-trap | ✅ Done |
| P2-b | `--muted` low contrast | `#8A8A8E → #6E6E73` (AA) | ✅ Done |
| P2-c | Dead CSS (`.b-*`, `.sb-btn`, `density`) | Removed; dropped `density` field | ✅ Done |

#### 16.5.2 Data-consistency & deletion issues (from §15–§16 audit)
| ID | Issue | Resolution | Status |
|----|-------|-----------|--------|
| DC-1 | Member delete/renamed → orphan + silent loss on save | id-based `assignedToIds`; reassign modal; "(not in list)" chips | ✅ Done |
| DC-2 | Status/Priority rename → orphan + `ensureStatus` resurrection | id-based `statusId`/`priorityId`; rename safe | ✅ Done |
| DC-3 | Filter literals drift after rename | Filters now compare by `findStatus(...).id` | ✅ Done |
| DC-4 | `member.disciplineId` not cleaned on discipline delete | Handled in reassign modal (set to none) | ✅ Done |
| DC-5 | Cascade delete of actions on project/discipline delete | Removed; blocking reassign instead | ✅ Done |

### 16.6 Definition of Done (moved from §10.3)
*Completed items are the v2 baseline. Open items are tracked in §16.4 (ISS-32 smoke test; ISS-28/ISS-29 Phase 3).*
- [x] All five metadata lists standardized to one inline component; no `listManager` popup remains.
- [x] Status & priority colors editable and persisted; no code-only color maps.
- [x] Every action references projects/disciplines/statuses/priorities/members **by id**.
- [x] Deleting any referenced item is blocked until reassigned; no cascade delete of actions.
- [x] Soft-deleted actions and "left" members keep their records and remain resolvable.
- [x] Save Actions / Save Settings are independent, dirty-checked, and flash on enable.
- [x] Unsaved changes warn on navigation and on `beforeunload`.
- [x] UI review Sprint 1/2/3 items resolved (a11y, contrast, layout, empty states).
- [ ] **Live browser smoke test passed** (Chrome) — see **ISS-32**.
- [ ] Phase 3 (custom fields + rules) — **ISS-28 done, ISS-29 deferred**.

### 16.7 Recommended execution order
- **Phase 1 — restructure (no behavior change):** ISS-01 → ISS-10. Do first so v3 edits land in clean modules; verify both launch modes still work after each file move.
- **Phase 2 — v3 features:** ISS-11…ISS-13 (parent/child) → ISS-14…ISS-18 (deps + reference points) → ISS-19…ISS-22 (schedule + progress + Info) → ISS-23…ISS-26 (consistency + migration). Keep review-first per issue.
- **Phase 3 — gantt:** ISS-27, only after Phase 2 closed.
- **Open backlog (group D):** ISS-28…ISS-31 are deferred/optional — schedule after Phase 2; **ISS-32 (smoke test) should be closed as soon as a browser is available.**
