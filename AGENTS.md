# Repository Guidelines

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.1 | 2026-10-17 | Codex | Clarified cross-project issue record fields, status codes, lifecycle transitions, ID scope, and legacy-log preservation. |
| 1.2 | 2026-10-20 | CodeBuddy (AI) | Added §5 Rule 18 — machine-enforceable ask-first approval gate for any change not explicitly discussed (rules 1–2 made operational). |
| 1.3 | 2026-10-22 | CodeBuddy (AI) | Added §5 Rule 19 — every English reply must follow ASD-STE100 Simplified Technical English, Issue 9 (Jan 2025). Verified against the official copy: 53 rules in 9 sections, dictionary of 875 approved and 1,274 non-approved words. Paired with the always-applied rule file `.codebuddy/rules/asd-ste100-reply-style.md`. |
| 1.4 | 2026-10-22 | CodeBuddy (AI) | Bundled the ASD-STE100 Issue 9 standard: `docs/ASD-STE100-Issue-9/` now holds the official PDF, an approved-word list (800 of 875) and a not-approved-word list (1,247 of 1,274). Note: §6 forbids unexpected top-level directories; `docs/` was used because the user approved that path for this shared standard. |
| 1.5 | 2026-10-22 | CodeBuddy (AI) | Added the STE prose lint `harness-writing/ste-lint.mjs` (+ `ste-allow.json`, npm scripts `ste-lint` and `ste-lint:hard`; the tool was later moved out of `harness-layout`, which is layout/visual only). It flags words the standard does not approve. Direction changed after testing: it checks the NOT-APPROVED list, not the approved list, because the PDF text layer is incomplete — `(det)`, `(num)` and `(int)` never appear, and the approved list would flag correct words such as "the" and "is". Findings are candidates; the PDF wins. Updated §5 Rule 19f and the rule file §15. |
| 1.6 | 2026-10-22 | CodeBuddy (AI) | §5 restructure, **step 1 of 5** — §26 extended with **§26.11 Canonical Log Sections**, **§26.12 Issue ID Scope and Active Log Selection**, **§26.13 Safe Editing and Validation** and **§26.14 Required Validation Workflow**; §26.2, §26.3 and §26.6 gained the row-lifecycle, legend/counting and "not resolved on planned work" rules. The detail came from §5 Rule 17a–g, which is **left in place and unchanged at this step** — nothing was deleted. New subsections were appended (not inserted) because `MDL/mdl-issues.md` cites §26.3, §26.5, §26.6 and §26.9 by number. |
| 1.7 | 2026-10-22 | CodeBuddy (AI) | §5 restructure, **step 2 of 5** — added **§27 Project Logs**, **§28 Relocation and Import-Path Integrity**, **§29 Pattern-Defect Fix Breadth** and **§30 Path Resolution SSOT and No Hardcoded Fallbacks**, holding the detail of §5 Rules 4, 11, 12, 15 and 16. Those rules are **left in place and unchanged** — nothing was deleted. Two facts recorded honestly: no `*_log.md` files exist in this repository yet, and `global_paths` / `resolve_paths()` / `default_base_path()` appear only in this document with no implementation, so §27 and §30 are target designs rather than descriptions of current behaviour. |
| 1.8 | 2026-10-22 | CodeBuddy (AI) | §5 restructure, **step 3 of 5** — two small additions so that two rules can later shrink to one sentence: §6 gained **Archive before delete** (from §5 Rule 3) and §11 gained **Messaging and error logging** (from §5 Rule 9). §5 Rules 3 and 9 are **left in place and unchanged** — nothing was deleted. Note: the §11 bullet renders Rule 9's wording as "use" (not "utilize") and "health of code execution" (not "healthyness"); the two typos in §5 Rule 9 itself are unchanged and still pending a decision. |
| 1.9 | 2026-10-22 | CodeBuddy (AI) | §5 restructure, **pre-step-4 gap closure (the two HIGH items)**. **Decision: the cross-source audit threshold is 3+.** §24 said 5+ in two places, which contradicted §5 Rule 13; both now read 3+, so the threshold does not silently weaken when Rule 13 shrinks. §2 gained a **Lifecycle** block holding the four provisions of §5 Rule 10 that it was missing: creation at project inception (and as the first task when a project is scaffolded), update at every phase completion, and the compliance gate (a project without `knowledge.json` is not compliant and must get one before further development). Cross-references added to §15 and §27. §5 is unchanged — nothing deleted. |
| 1.10 | 2026-10-22 | CodeBuddy (AI) | §5 restructure, **pre-step-4 gap closure (the four MEDIUM items) plus the typo correction**. §23.2 gained **pre-bootstrap services run first** (logger, telemetry/heartbeat and project-root discovery must run before any bootstrap phase) and **clean failure** (if `common.library` is not importable, exit with a human-readable message — never a bare `ModuleNotFoundError` traceback). §15 gained **Plan before code** (create the workplan and wait for approval before implementing, approval per §5 Rule 18). `asd-ste100-reply-style.md` §15 gained the **`--mode hard` restriction** (do not run hard mode on legacy prose; it fails on words the standard may approve). §5 Rule 9 typo corrected: **"utilize" → "use"** and **"healthyness" → "the health of"**; the §11 bullet written in step 3 now matches Rule 9 verbatim. |
| 1.11 | 2026-10-22 | CodeBuddy (AI) | §5 restructure, **pre-step-4: the three remaining details are kept, not dropped.** Decision: keep them; final wording to be discussed later. §26.2 now requires a **concise** `Title`, an **evidence-based** `Description`, and an ID unique within the active log set (from Rule 17a). §26.14 step 1 now adds *"Review its local conventions before you edit"* (from Rule 17). `approval-gate.md` rule 5 now adds *"a standing instruction about a different file"* to the no-implied-consent list (from Rule 18e). All three now live in their target sections, so §5 can shrink without losing them. |
| 1.12 | 2026-10-22 | CodeBuddy (AI) | §5 restructure, **step 4 of 5 — §5 is now an index.** Each of the 19 rules is one sentence ending with a pointer to the section that holds its detail. **Rule numbers and order are unchanged.** Removed from §5, each already reproduced in its named destination: sub-items **17a–g** (→ §26.2, §26.7, §26.11–§26.14), **18a–g** (→ `.codebuddy/rules/approval-gate.md`) and **19a–f** (→ `.codebuddy/rules/asd-ste100-reply-style.md`); the long text of **rules 10–16** (→ §2, §23, §24, §28, §29, §30); and the broken **"see §5.6"** in rule 10, which had no target. §5 shrank from 76 to 25 lines. **No rule was lost** — every clause was checked against its destination in the pre-step-4 review (revisions 1.9–1.11), which added the missing detail to §2, §15, §23.2 and §24, aligned the audit threshold to 3+, corrected two typos, and updated eight stale §5 references in `MDL/mdl-issues.md`. |
| 1.13 | 2026-10-22 | CodeBuddy (AI) | §5 restructure, **step 5 of 5 — final verification. The restructure is complete.** Audited the whole document: all **28** internal § references resolve; all **19** rules are present and in order, each with a working pointer (**16** to a section, **2** to a rule file, **1** to Rule 18); all **12** destination sections carry their rule's substance; **no** dangling reference remains in `approval-gate.md`, `asd-ste100-reply-style.md`, `MDL/mdl-issues.md` or the STE README; **no** malformed table; section numbers 1–30 ascending. §5 is **26 lines**, down from 77. **No clause was lost** — every clause of every removed rule was checked against its destination before step 4 ran, and the gaps found in that review were closed first (revisions 1.9–1.11). |
| 1.14 | 2026-10-22 | CodeBuddy (AI) | §1 Projects split into three subsections. **§1.1 Projects in this repository** adds the five project folders of `workbuddy` (remote `https://github.com/chinwarsoon/workbuddy`): `action-log/`, `english-learning/`, `MDL/`, `PPP/`, `sub/`. **§1.2 Shared folders in this repository** adds `docs/` and `harness-layout/`, which are not projects. **§1.3 Projects in another repository** keeps the four original rows — `code_tracer/`, `eks/`, `dcc/`, `releases/` — and records that they are **not in this repository**; they were confirmed present in `chinwarsoon/Engineering-and-Design`. Their purposes and Python versions are unchanged. The project naming convention text after the tables is unchanged. |
| 1.15 | 2026-10-24 | CodeBuddy (AI) | **§18.2 shell rewritten to the MDL model.** The dashboard shell is now a two-row header (navy title bar + white menu bar) above a navy left navigation sidebar and a full-width navy status bar. Removed the 48 px icon bar and the right sidebar; navigation lives in the left sidebar, Settings/Help/Detail move to menu-bar buttons and modal dialogs; global filters live in the menu-bar filter group. **§18.3** dimension tokens updated (dropped `--icon-bar-w`/`--right-sidebar-w`, added `--menubar-h`). **§18.4** default theme is now `light` and the theme picker moved to the menu bar. |

## 1. Projects

This repository is **`workbuddy`** — `https://github.com/chinwarsoon/workbuddy`. §1.1 lists the
projects it holds. §1.2 lists the shared folders that are not projects. §1.3 lists the projects of
another repository that this document also names.

### 1.1 Projects in this repository

| Folder | Purpose | Stack |
|--------|---------|-------|
| `action-log/` | ActionTracker — action log web application | HTML, CSS, JS |
| `english-learning/` | English learning tool with content packs, installable as a PWA | HTML, JS |
| `MDL/` | Master Document List dashboard (TWRP C3B2) | Node.js build, HTML output |
| `PPP/` | Procurement Package Plan dashboard (TWRP C3B2) | HTML |
| `sub/` | Submittal data — Document Submittal Log and Monthly Submissions dashboard (TWRP C3B2) | Python build, HTML output |

### 1.2 Shared folders in this repository

These folders are not projects. Every project in §1.1 may use them.

| Folder | Purpose |
|--------|---------|
| `docs/` | Shared standards. Holds `ASD-STE100-Issue-9/`. See §5 Rule 19. |
| `harness-layout/` | Shared layout harness and the STE prose lint. See §5 Rule 19. |

### 1.3 Projects in another repository

These folders are **not in this repository**. They belong to
**`chinwarsoon/Engineering-and-Design`** — `https://github.com/chinwarsoon/Engineering-and-Design`.

| Folder | Purpose | Python Version |
|--------|---------|----------------|
| `code_tracer/` | Static call-graph analyser + interactive dashboard | 3.10+ |
| `eks/` | Engineering Knowledge System (schema-driven registry) | 3.13 (conda) |
| `dcc/` | Document Control (legacy, data processing) | 3.13 (conda) |
| `releases/` | Packaged zip releases | — |

**Project naming convention:** Each project listed above must have a single canonical name and abbreviation declared in its `knowledge.json` under `project_metadata.name`. All code, documentation, READMEs, CLI help text, `pyproject.toml` `name` field, and UI elements must use this canonical name. A project-wide grep for alternative names is required before each phase completion.

## 2. Project Knowledge Base

1. Project Knowledge Base will explain how a project is planned and implemented. It will be used by team for maintainance, troubleshooting, furture development with AI assistance. The main purpose is not for human consumption but for AI assistance and automation. It essentially serves as the machine-readable `software blueprint and project charter`.
2. Each project will contain following entities:
- folders and files
- modules, engines, clasess, tests, functions with codes
- schema files and environment for project setups
- input data
- output data
- user interface
- documentation for workplan, test reprots, logs
3. entities will have:
- metadata: such as name, version, date, description, purpose
- logics and relationships: such as dependencies, relationships, intergration points, workflows, functions, data flows, etc.
- actions: such as tests, workflows, functions, etc.
- permissions: such as boundaries, domains area, etc
4. Each project must maintain a `knowledge.json` file at the project root containing:

- **Project metadata**: name, version, description, purpose
- **Architecture overview**: key modules, data flows, integration points
- **Domain concepts**: core entities, relationships, terminology
- **Key schemas**: references to primary schema files (from `config/`)
- **Workflows**: primary operational workflows and entry points
- **Functions**: primary functions, entry points, data processing pipelines
- **Data flows**: data flow diagrams, data flow details, data quality checks
- **Dependencies**: external services, libraries, infrastructure
- **Known issues**: technical debt, limitations, open questions

**Location**: `<project>/knowledge.json`
**Schema**: Defined in `config/schemas/knowledge_base_schema.json` (shared)

**Lifecycle:**

- **Creation**: create `knowledge.json` at project inception. When a project is scaffolded,
  creating it is the **first task**, populated with initial metadata, architecture overview, and
  known issues.
- **Update**: update it as part of **every phase completion**, alongside the workplan (§15) and the
  project logs (§27).
- **Compliance**: a project without `knowledge.json` is **not in compliance**. Create one before
  any further development.

5. Automated troubleshooting agent must manage the project effectively:
- automated root-cause analysis (RCA)
- Automomous Testing Execution (ATE)
- Change Impact Traveability (CIT)

## 3. Shared Configuration

A shared `config/` folder exists at the repository root for cross-project schemas and configuration. A shared `common/` folder exists for cross-project UI design system files:

```
config/
  schemas/           # Shared schema definitions (e.g., knowledge_base_schema.json)
common/
  universal_ui_design.css  # Shared CSS design system (5 themes, shell layout, components)
  universal_ui_design.js   # Shared JS library (theme/sidebar/layout/toast/modal/file/table/utils)
  universal_ui_design.md   # Documentation covering both CSS and JS
```

## 4. Key Commands

```bash
# code_tracer — install and run
pip install ./code_tracer/engine
code-tracer /path/to/project
python code_tracer/engine/launch.py /path/to/project

# code_tracer — Docker
TARGET_DIR=/path/to/project docker compose -f code_tracer/engine/docker-compose.yml up

# code_tracer — tests (unittest)
python -m pytest code_tracer/test/

# code_tracer — frontend
cd code_tracer/engine/frontend && npm start
npm test  # React tests

# EKS — tests (pytest, must run from repo root)
python -m pytest eks/test/

# EKS — environment
conda env create -f eks/eks.yml
conda activate eks
```

## 5. Critical Workflow Rules (from `agent_rule.md`)

§5 is the **index of mandatory rules**. Each rule is one sentence. The detail — the definitions,
the exceptions, the procedure and the acceptance criteria — lives in the section named beside
each rule. Read that section before you act on the rule.

1. **Plan before code**: Create a workplan and get approval before you implement anything. See §15.
2. **No edits without approval**: Present every change and wait for explicit approval before you edit. See Rule 18.
3. **Archive before delete**: Move files to `archive/` instead of deleting them. See §6.
4. **Log everything**: Write issues, updates and tests to the project's three logs. See §27.
5. **Workplan required**: Give every task a workplan in `<project>/workplan/` and update it as work proceeds. See §15.
6. **Test reports after phases**: Produce a test report in `<project>/workplan/reports/` after each phase. See §16.
7. **Revision control**: Give every file revision metadata. See §13.
8. **Review related workplans**: Read the related workplans before you start an implementation. See §15.
9. **Messaging and errors**: Make every module, engine and function report status, errors and warnings. See §11.
10. **Knowledge base required**: Keep a `knowledge.json` at every project root, from inception onward. See §2.
11. **Relocation validation**: Update every import path that a relocation breaks, in the same edit cycle. See §28.
12. **Fix breadth**: Fix every occurrence of a pattern defect in one edit, not only the one you found. See §29.
13. **Cross-source alignment audit**: Audit every source that shares a concept before you close the feature. See §24.
14. **Pre-bootstrap safety**: Guard every non-stdlib import individually before any bootstrap phase. See §23.
15. **Path resolution SSOT**: Resolve every path through the schema-driven `global_paths`. See §30.
16. **Hardcoded fallback removal**: Never duplicate a schema or config value in code. See §30.
17. **Issue log integrity**: Preserve each active issue log's format and follow the canonical record. See §26.
18. **Ask-first approval gate**: Ask for explicit approval before any mutating action not already discussed. See `.codebuddy/rules/approval-gate.md`.
19. **Reply style — ASD-STE100 Issue 9**: Write every English reply in Simplified Technical English. See `.codebuddy/rules/asd-ste100-reply-style.md`.

## 6. Folder Convention (all projects)

Each project must use this subfolder layout:

```
archive/    config/     data/       output/     test/
ui/         engine/     log/        docs/       workplan/
knowledge.json          # Required at project root
```

Do not add unexpected top-level directories.

**Archive before delete**: move a file to `archive/` instead of deleting it. Do not remove a file
until it has been archived, and preserve its revision history when you move it (§13, §5 Rule 3).

**Directory validation:** At project creation and at each phase completion, verify all required directories exist at the project root: `archive/`, `config/`, `data/`, `output/`, `test/`, `ui/`, `engine/`, `log/`, `docs/`, `workplan/`. Missing directories must be created (empty scaffolding) before the phase can be marked complete. Directory names are case-sensitive (lowercase) and must match exactly — `Log/` is not a substitute for `log/`.

### 6.1 Test Folder — Single Source of Truth

**`<project>/test/` is the one and only location for all test functions** belonging to that project. This rule applies regardless of project structure:

- Every test file (`test_*.py`) must reside in `<project>/test/` — no exceptions.
- Test files found in `engine/`, `workflow/`, `tools/`, sub-module `tests/` directories, or any location other than `<project>/test/` violate this convention.
- Embedded test directories (e.g., `<project>/workflow/*/test/`, `<project>/engine/*/tests/`) must be migrated to `<project>/test/`. During migration, create a subfolder within `<project>/test/` (e.g., `test/processor_engine/`) to preserve logical grouping while obeying the single-root rule.
- Test runtime artifacts (generated files, output directories, temp databases) must be placed in `<project>/test_output/` or use `tempfile.TemporaryDirectory` for automatic cleanup. They must never leak to the repository root.
- At each phase completion, verify zero test files exist outside `<project>/test/`.

## 7. Files and Context

When scanning code for context, ignore:
- Files under any `backup/` folder
- Dot-folders and dot-files (`.git`, `.vscode`, etc.)
- Markdown files (`.md`) not in `workplan` folder
- Test folders

Also include:
- `<project>/knowledge.json` — project knowledge base (high priority)

## 8. Data Column Priority (EKS / dcc)

When processing tabular data:

**Rules:**
- No sorting before forward fill.
- Forward fill must never overwrite existing values.
- Always check for duplicate columns in the data frame.

**Priority order:**
1. **Priority 1 — Meta columns** (such as Project_Code, Department, etc.): forward-fill first. Null-handling must be "bounded" (stop if row index jumps or new file starts).
2. **Priority 2 — Relational keys** (such as Document_ID, Revision, etc.): validate, never blind-fill. If `Document_Revision` is null, trigger a lookup or flag a validation error.
3. **Priority 3 — Derived columns** (such as Submission_Closed, Days_Overdue, etc.): recalculate every run. Never have manual data.

**Processing sequence:**
1. Impute Priority 1: such as fill missing Project/Session info to anchor rows.
2. Validate Priority 2: such as ensure every document has an ID and a Revision.
3. Calculate Priority 3: such as run logic from `submission_closed_schema.json`.

## 9. Schema Pattern

Schemas follow a 3-layer inheritance model:
- `*_base_schema.json` — shared `definitions`
- `*_setup_schema.json` — `properties` and `$ref` to base
- `*_config.json` — actual values

Three parallel schema sets: **core** (eks_*), **asset** (eks_asset_*), **ontology** (eks_ontology_*).

**Schema rules:**
- Flat structure; use array of objects, avoid array of lists.
- Use `definitions` for repetitive objects.
- `additionalProperties: false` on important property controls.
- Define `required` for properties if applicable.
- Each schema file must have `$schema`, `$id`, `title`, `description`, `version`, `allof`, `$ref` calls if applicable.
- Schema loader must support all `$ref` types: string, object, nested object, recursive.
- Use Unified Schema Registry (URIs) — every schema gets a unique permanent `$id`.
- Pattern-based discovery for organizing schema files.

**Fragment pattern (asset):** Asset types compose schema fragments defined in `eks_asset_base_schema.json` (13 fragments: item_core, process_conditions, manufacturer, etc.). Conditional fragments bind to `device_type_code` values.

**New schema set checklist:** When introducing a new schema set, verify all of:
1. Base file exists (`*_base_schema.json`) with shared `definitions` and `$schema`/`$id`/`title`/`version`
2. Setup file exists (`*_setup_schema.json`) with `allOf` → `$ref` to base, property declarations, and `additionalProperties: false` on important controls
3. Config file exists (`*_config.json`) with actual values and no schema metadata fields (`$schema`, `$id`, `version`, `title`, `description` in data instances)
4. Config validates against setup schema before first commit
5. Schema loader discovers the new set and validates it at startup
6. At least one test validates the new schema chain end-to-end

## 10. Module Design

- Module design for all functions and classes.
- `__init__.py` shall only contain import statements and version information.
- SSOT (Single Source of Truth) for all global parameters, variables, keys, codes, values, names, paths, files that outlive a single function.
- Schema-driven design for global parameters that outlive a single function.
- **SSOT verification**: Before adding any named definition (type, constant, version string, identifier, key), search the entire project to confirm it does not already exist under a different name. If a semantic equivalent exists, use `$ref` or import instead of redefining. For version numbers, each project must declare a single `__version__` in its root `__init__.py`; all other components must import from there.

## 11. Function Coding

- Every function gets a standardized docstring explaining purpose, parameters, and return values.
- Breadcrumb comments tracing parameter flow.
- **Messaging and error logging**: every module, engine and function must report status, errors,
  warnings, and data-quality and data-integrity issues through the project's messaging and error
  logging, so that the health of code execution is observable. Use the message catalog and error
  codes of §19, and the tiered severity levels of §12.

## 12. Debugging (agent_rule.md Section 6)

**Tiered logging** (categorized by severity):
- Level 0: silent / only errors
- Level 1: status/info — milestone progress, high-level workflow status, system snapshot
- Level 2: warning/debug — warnings, variable values, path resolutions
- Level 3: trace — OS-specific path slashes, JSON raw extraction, deep technical info

**Debug Object:** Collect all debug info into a single dict, save to `debug_log.json`, pass to `format_report`, print at end of workflow.

**Trace table:** Track parameter flow, resolved values, source, and status. Add timestamp/duration for each step.

**Print formatting:** Indent messages per hierarchy level of calling functions. Use a global depth counter that increments on entry, decrements on exit.

**Messages:** Always include function name or module name and calling context in warning/debug/trace messages.

**Global parameter tracing:** Log state before and after every major transformation.

**Fail-fast:** Implement fail-fast metadata in functions to stop execution on critical errors.

## 13. Revision Control

Apply revision control to every file created or modified:

- **All files:** Include revision number, date, summary of change, and author.
- **Markdown/docs:** Top-of-file revision table with `Revision`, `Date`, `Author`, `Summary`.
- **Code files:** Header comment block or module docstring with revision metadata.
- **Config/schema files:** Standard metadata fields (`version`, `title`, `description`, `revisionHistory`) plus comments if necessary.
- **Log updates:** Update `update_log.md` in the project `log/` folder on every file revision.
- **Archiving:** Preserve revision entries when archiving or renaming; archived files retain history.
- **Numbering:** Use consistent semantics (e.g. `0.1`, `1.0`, `1.1`, `2.0`); increment for each substantive update.
- **Cross-reference validation:** When any file's version or revision metadata changes, all files that reference or document that file must be updated in the same edit cycle. Use `grep` across the project to identify all reference sites before committing the change. If a referenced file has 3+ stale references, create an issue and defer the version bump until all references are corrected.

## 14. Documentation

Documentation must include all that apply:
1. Overall summary
2. Content index
3. Key features
4. Documentation map
5. Quick start and Mermaid workflow/chart
6. Module/function structure
7. List of functions
8. I/O table
9. Global Parameter Trace Matrix
10. Details of each function/module
11. Debugging and troubleshooting
12. Usage examples
13. Best practice and pending issues
14. Development test result
15. Dependencies and environment
16. Coding/programming engineering standard achieved

## 15. Workplan

Every task gets a workplan in `<project>/workplan/`:

**Required sections:**
- Title and description
- Document ID, revision control, version history, status
- Object
- Scope summary (ID, details, category, status, related phase)
- Index of content with links
- Dependencies with other tasks
- Evaluation and alignment with existing architecture
- Implementation phases with task breakdown, each containing:
  - Timeline, milestones, deliverables
  - What will be updated/created
  - Risks and mitigation
  - Potential future issues
  - Success criteria
  - References (files, reports, code)

**Rules:**
- Always update the workplan when there are changes.
- **Plan before code**: create the workplan and wait for approval before you implement. Approval is governed by §5 Rule 18.
- Always review related workplans before starting implementation.
- Always log issues to `issue_log.md` under the workplan's parent folder.
- Always generate a report per phase in `<project>/workplan/reports/`.
- Always update logs in `<project>/log/`.
- Timestamp all phases and steps.
- **Feature completion definition**: A feature is only "complete" (✅) when its core business logic is implemented and tested. Structural scaffolding (stubs, placeholder returns, `# TODO` blocks, "foundation in place" with no runtime effect) must be marked as 🔶 PARTIAL or 🔷 PLANNED, never ✅. A feature that always returns a null/fixed value is not complete. A parser that returns "Implementation Pending" is not complete. Document which sub-capabilities are stubs in the task description and link to the deferred issue.
- **Phase scope freeze**: Once a phase workplan is marked COMPLETE, no new tasks may be added to it. Newly discovered work must be captured in a follow-up phase workplan (e.g., Phase 1.2, Phase 1.3) or in the next major phase. The only exception is urgent bug fixes, which must be logged as issues and tracked separately from the phase task list. A phase should only be marked COMPLETE when its scope is fully delivered and no additional tasks are anticipated.

## 16. Test Reports

Test reports go in `<project>/workplan/reports/` after each workplan phase:

**Required sections:**
- Title and description
- Document ID, revision control, version history, status
- Index of content with links
- Test objective, scope, execution summary
- Test methodology, environment, tools
- Test phases, steps, cases, status, detailed results
- Test success criteria and checklist
- Files archived, modified, version controlled
- Recommendations for future actions
- Lessons learned

**Rules:**
- Log issues to `issue_log.md` under the workplan's parent folder.
- Update `update_log.md` in `<project>/log/`.
- Cross-reference reports to workplan files.
- Timestamp all phases and steps.

## 17. Function Table and Call Graph

When documenting modules, provide:
- All functions in a module/engine/class
- Function calling sequence
- Function description and purpose
- Function parameters (in) and return values (out)
- Function dependencies and relationships
- Function error/exception handling
- Function tracing and status reporting
- Function UI and interaction

## 18. UI Web Design

All HTML files must follow these rules:

### 18.1 Dependencies and Stack

- Interactive standalone webpage — no build step, no bundler.
- All UIs must use the shared design system from `common/` as their primary CSS and JS dependency. Use `<link rel="stylesheet" href="/common/universal_ui_design.css">` and `<script src="/common/universal_ui_design.js">` as the base. Individual pages add only page-specific overrides via an inline `<style>` block. Project-specific CSS files (e.g. `eks.css`, `dcc-design-system.css`) must only contain overrides and extensions — they must never re-declare design tokens or duplicate shell layout classes already defined in the universal system.
- Schema-driven: all labels, help text, stage definitions, output file names, and default values are stored in `ui_help.json` and loaded at runtime via `fetch()`.
- Zero npm runtime dependencies in the HTML layer. **No external CDN fonts** — use `font-family: system-ui, -apple-system, 'Segoe UI', sans-serif` as the primary font stack so pages render correctly on corporate networks that block `fonts.googleapis.com`. CDN fonts may be used only as an `@import` with a `font-display: swap` fallback that degrades gracefully when blocked.
- Always set `Cache-Control: no-cache` meta tags so reloads always reflect the latest server output.
- All asset paths (CSS, JS, JSON) must be root-relative (e.g. `/common/universal_ui_design.css`, `/ui/eks.css`) or relative to the HTML file's own directory — never hardcoded absolute paths. This ensures files load correctly regardless of the working directory from which `serve.py` is started.

### 18.2 Layout (VS Code shell model)

The page body uses the MDL two-row header (navy title bar + white menu bar) above a navy left
navigation sidebar and a flexible content area, with a full-width navy status bar at the bottom.
The shell fills the viewport exactly with no page scroll:

```
┌──────────────────────── title bar (full width, navy) ────────────────────────┐
│ logo (white chip) + title stack (project title h1 + meta line)                │
├──────────────────────── menu bar (full width, white) ────────────────────────┤
│ actions (Load / Export / Print) │ filter group + Search + Warnings + Settings/Help │
├──────────────┬────────────────────────────────────────────────────────────────┤
│ left sidebar │ content area (toolbar + scrollable body)                        │
│ (navy,       │                                                                │
│ resizable)   │                                                                │
├──────────────┴────────────────────────────────────────────────────────────────┤
│ status bar (full width, navy)                                                  │
└────────────────────────────────────────────────────────────────────────────────┘
```

- **Title bar** — spans full width, navy. Holds the logo (in a white chip) and a title stack: the project title (`h1`) and a meta line (e.g. project start · as-of date). No breadcrumb.
- **Menu bar** — spans full width, white, directly below the title bar. The left cluster holds actions (Load Data / Export / Print). The right cluster holds the global filter group (filter chips), a Search button, a Warnings toggle (with count badge), and Settings / Help buttons. Settings and Help open modal dialogs.
- **Left sidebar** — navy, collapsible (width → 0 with a CSS transition) and resizable by dragging a 5 px right-edge handle. Holds primary navigation (page links) and the file-loading panel (choose workbooks, drop zone, file list, Load button). Toggle via a menu-bar button or the left-edge handle.
- **No 48 px icon bar.** Primary navigation lives in the left sidebar, not an icon strip.
- **No right sidebar.** Settings, Help, and Detail move to menu-bar buttons and modal dialogs.
- **Content area** — flex: 1; owns a toolbar strip (page title, spacer, action buttons) and a scrollable body. The shared global filter area, when present, lives in the menu-bar filter group (not a separate content strip); the warning area stays inside the content body per the dashboard UI spec §3.5.
- **Status bar** — fixed strip at the bottom, navy, ~30 px; left side shows current state / selected file; right side shows the version string.
- **Welcome (pre-load)** — follows `Dashboard-UI-Design-Spec.md` §3.7: a full-screen centred overlay that hides this chrome (header, menu bar, sidebars, status bar) until the first successful load. The welcome fills the viewport (MDL ratio, fluid, no fixed aspect ratio, no page scroll); its fixed-proportion surfaces (file drop area, welcome card) SHOULD use the golden ratio (1 : 1.618); the load buttons MUST live inside the file drop area; and the welcome MUST NOT hardcode a project title (the project/dashboard title renders from the loaded model after load).
- **Standalone delivery** — follows `Dashboard-UI-Design-Spec.md` §3.9: the dashboard is delivered as one self-contained HTML that MUST run from `file://` with no web server. It MUST NOT use `fetch` for local files or a cross-file ES-module `import` (the `file:` origin blocks both); the stylesheet, config, engine and images MUST be inlined, and the delivered HTML MUST contain no `href` / `src` pointing at a local file. Engine sources stay as importable modules for the Node tests.
- `html, body` must be `height: 100%; overflow: hidden` so the shell fills the viewport exactly without page scroll.
- Custom scrollbar: 6 px width, transparent track, border-colored thumb.

### 18.3 CSS Design System

All design tokens are defined once in `common/universal_ui_design.css` under `:root` / `[data-theme="dark"]` (and all 5 theme variants). Required token groups:

| Group | Variables |
|---|---|
| Surfaces | `--bg`, `--surface`, `--surface2`, `--surface3` |
| Borders | `--border` |
| Text | `--text`, `--text2`, `--text3` |
| Accent | `--accent`, `--accent-alt` |
| Semantic | `--success`, `--warning`, `--danger`, `--info` |
| Tag | `--tag-bg`, `--tag-border` |
| Table | `--row-stripe`, `--row-hover`, `--th-bg`, `--th-hover` |
| Dimensions | `--sidebar-w`, `--titlebar-h`, `--menubar-h`, `--statusbar-h` |
| Radii | `--radius`, `--radius-sm`, `--radius-lg` |
| Fonts | `--font-ui` (system-ui), `--font-mono` (JetBrains Mono) |

**SSOT rule**: `common/universal_ui_design.css` is the single source of truth for all design tokens and shell layout classes. Project-specific CSS files (e.g. `eks.css`, `dcc-design-system.css`) must never redefine these tokens — they import the universal file and only add project-specific overrides or additional component rules. All component colors must reference `var(--token)` — never hardcoded hex in component rules. A project-wide grep for hardcoded hex values used as colors (not neutral border grays) is required before each phase completion.

### 18.4 Theme System

- Five themes: `light` (default), `dark`, `sky`, `ocean`, `presentation`.
- Applied by setting `data-theme` attribute on `<html>` (or `<body>`).
- Theme selection persisted to `localStorage` key `<project>-theme` and restored on load.
- Theme picker: a button in the menu bar opens a dropdown menu; each option shows a color dot + label. Active option is marked with `.active` class.
- Theme transition: `transition: background 0.25s, color 0.25s` on `body` for smooth switching.

### 18.5 Sidebar Accordion

Left (and right) sidebar content is organized into collapsible accordion sections:

- `.sb-section` — container with bottom border.
- `.sb-section-header` — clickable row with icon, label, and a right-aligned chevron arrow (`▼`).
- `.sb-section-body` — collapsible content; hidden by adding `.closed` to the parent `.sb-section` (chevron rotates −90°).
- Toggle on click of any `.sb-section-header`.

### 18.6 Drag-to-Resize Sidebars

Both sidebars must support mouse drag resizing (`comUI.sidebar.resize()` from the universal JS library):

- Left sidebar: 5 px handle at right edge (`.com-resizer.left-resizer`, `right: -2px`).
- Right sidebar: 5 px handle at left edge (`.com-resizer.right-resizer`, `left: -2px`).
- On hover and while dragging, handle background transitions to `--accent` color with a visible 2 px × 32 px center bar.
- Minimum sidebar width: 120 px; maximum: 480 px (enforced in the `mousemove` handler).
- Width persisted to `localStorage` per sidebar key via the `storageKey` option.

### 18.7 File Loading Panel

Every tool that loads files must implement:

- **Fetch pipeline file** button — loads a well-known default path (e.g. `../output/processed_*.csv`) via `fetch()`.
- **Load local file** button — opens `<input type="file">` picker.
- **Drag-and-drop** — accept `dragover` / `drop` events on the full page body to load files.
- **Loaded files list** — displays all files loaded in the current session; highlights the active file.
- Status bar always reflects the currently active file name.
- Panel is collapsible via its icon bar button.

### 18.8 Layout Switching

- A 🔲 layout toggle button in the title bar cycles the content area through column layouts (1-col → 2-col → 3-col → back to 1-col).
- Layout state persisted to `localStorage`.

### 18.9 Help System

- All help text, about text, revision info, stage definitions, output file names, option labels, and default paths are stored in `ui_help.json` at the `ui/` folder root.
- Pages load `ui_help.json` on startup via `fetch('ui_help.json')` (or a relative path).
- The right sidebar renders a **Help** view when the ❓ icon bar button is clicked; content is built from `ui_help.json` keys.
- The right sidebar renders a **Detail** view (with a ← Back button) when a KPI card, stage card, or output file is clicked — content is generated from live data + config.
- If `ui_help.json` fails to load, all panels must degrade gracefully (show "unavailable" message, never crash).

### 18.10 KPI and Stage Cards

Dashboards that display pipeline or data metrics must use card components:

- **KPI cards** — grid of metric tiles (`display: grid; grid-template-columns: repeat(auto-fit, minmax(210px, 1fr))`). Each card is 72 px high and shows exactly two lines: a 22 px value and a 10 px uppercase label. A 3 px top strip carries the status colour. There is no sub-label, no gauge and no box shadow. `Dashboard-UI-Design-Spec.md` §5 is the normative rule.
- **Stage cards** — one card per pipeline stage; each shows a numbered emoji icon, stage name, meta line (truncated with ellipsis), status text (PENDING / RUNNING / PASS / FAIL), and a 4 px progress bar.
- **Stage cards** must be clickable (`cursor: pointer`): hover state adds `border-color: var(--accent)` + `box-shadow: 0 0 0 1px var(--accent)`. KPI cards are not clickable: they carry no action, so they get no `cursor: pointer` and no hover ring.
- Stage status colors: PASS → `--success`, FAIL → `--danger`, RUNNING → `--accent`, PENDING → `--text3`.
- Health gauge bar uses a CSS gradient: `linear-gradient(90deg, var(--danger), var(--warning), var(--success))`.

### 18.11 Data Table Viewer

When displaying tabular JSON or CSV data:

- Render as `<table>` with sortable column headers (click to toggle asc/desc, show `▲` / `▼` indicator).
- Cap display to 50 rows by default; show row count footer.
- For JSON files with multiple arrays: use a tab bar (`.dt-tab-bar` / `.dt-tab`) to switch between arrays plus a **Raw JSON** tab.
- For text files: display first 10 KB inline in a monospace block.
- CSV/Excel files: open in a new browser tab (no inline preview).

### 18.12 Local HTTP Server (`serve.py`)

Each project that has a UI must include a `serve.py` at the project root. Requirements:

**Stack and dependencies:**
- **Zero external dependencies** — use only Python stdlib (`http.server`, `socketserver`, `subprocess`, `threading`, `json`, `uuid`, `argparse`, `pathlib`).
- Designed to run on restricted corporate computers: no conda environment, no pip install, no admin rights required for the launcher itself. Engine backends may require their own environments but the HTTP layer must be stdlib-only.

**Server class:**
- **`ReusableTCPServer`** — subclass `socketserver.TCPServer` with `allow_reuse_address = True` and `daemon_threads = True`. Prevents port-in-use errors on restart; ensures background threads do not block process exit.
- Override `handle_error` to suppress `ConnectionResetError` silently (DEBUG log only, no traceback). Browsers frequently reset idle connections and this floods the console.
- `if __name__ == "__main__"` guard around all startup code.

**Port handling:**
- Accept `--port` via `argparse`; default port 5000.
- Before binding, probe the port with `socket.connect_ex(("127.0.0.1", port))`. If occupied, automatically try the next port up to 10 increments and print the resolved port clearly: `Serving on http://localhost:{port}`.
- On `OSError: [Errno 10048]` (Windows) or `[Errno 98]` (Linux), print a human-readable message and suggest `--port <other>`.

**Root index page — dynamic tool launcher:**
- `GET /` returns a **dynamically generated** HTML page (`_build_index()`), not a static file. Regenerated on every request so new HTML files appear without restarting the server.
- Scans configured `SCAN_DIRS` (e.g. `["ui"]`) recursively for `*.html`, skipping `EXCLUDE_DIRS` (`node_modules`, `archive`, `backup`, `__pycache__`, `static`, `templates`).
- Groups files by folder with an icon and label per folder (`FOLDER_LABELS` dict).
- Provides a live search input (client-side JS, no server round-trip).
- Uses GitHub-dark inline styles — **no external CSS or font CDN dependency** — so the index renders on offline/restricted networks.
- Status bar shows total tool count and server port.

**Static file serving:**
- All non-API, non-root `GET` requests fall through to `SimpleHTTPRequestHandler` initialised with `directory = ROOT` where `ROOT = Path(__file__).parent.resolve()` (resolved absolutely at import time, never at request time).
- HTML files reference assets at root-relative paths (e.g. `/ui/eks.css`) — **never** at paths that assume a specific working directory.
- Apply a `Path.is_relative_to(ROOT)` security check on every resolved file path before serving. Return 403 if the path escapes `ROOT`.

**CORS:**
- `do_OPTIONS` returns HTTP 204 with `Access-Control-Allow-Origin: *`, `Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS`, `Access-Control-Allow-Headers: Content-Type`.
- All API JSON responses include `Access-Control-Allow-Origin: *`.

**Cache busting:**
- Override `end_headers()` to inject `Cache-Control: no-cache, no-store, must-revalidate` + `Pragma: no-cache` + `Expires: 0` on every response.

**Request routing** (priority order, first match wins — use `urllib.parse.unquote(self.path).split("?")[0]` for all path matching):

| Method | Path pattern | Handler |
|---|---|---|
| GET | `/` | `_build_index()` — dynamic tool-picker page |
| GET/POST/PUT/DELETE | `/api/v{N}/*` | Proxy → phase backend on `localhost:500{N}` |
| GET/POST | `/api/*` | 404 JSON — un-versioned, rejected |
| GET/POST | `/ollama/*` | Proxy → `localhost:11434` (Ollama LLM) |
| OPTIONS | `*` | CORS preflight |
| GET | anything else | `SimpleHTTPRequestHandler` static file |

**API proxy** (`_proxy`):
- Strip versioned prefix and forward to the target backend port. Pass through request body, `Content-Type`, and response status code.
- Catch `urllib.error.HTTPError` (forward status + body), `urllib.error.URLError` (502 + JSON), bare `Exception` (500 + JSON). Never propagate as unformatted traceback to the browser.
- Timeout: 120s for long-running pipelines.
- If the target backend is not reachable (connection refused), return `{"error": "Phase {N} backend not running on port 500{N}. Start it with: python eks/ui/backend/phase{N}_server.py"}` with HTTP 503 — not a generic 502.

**Ollama proxy** (`_proxy_ollama`):
- Strip `/ollama` prefix and forward to `localhost:11434`. Handles GET and POST. Timeout: 30s.
- If Ollama is not running, return `{"error": "Ollama not running on port 11434"}` with HTTP 503.

**Logging:**
- Suppress 200 and 304 log lines. Only print non-success codes to keep the console clean during polling.

### 18.13 Backend Phase Server Convention

Each phase of a multi-phase pipeline system must have its own dedicated backend server for running and testing that phase independently. Requirements:

**Design:**
- One backend server per phase: `phase{N}_server.py` in `<project>/ui/backend/`.
- Default port `BASE_PORT + N` where `BASE_PORT` is the launcher port (e.g. launcher on 5000 → phase servers on 5001, 5002, etc.).
- Each server uses only stdlib `http.server` for phases that do not require async production serving. The final user-facing phase may use FastAPI + uvicorn.

**Standalone operation (restricted computer requirement):**
- Every phase server **must** run standalone with `python phase{N}_server.py --port 500{N}` — no launcher required. This is the primary development and testing mode.
- The conda/virtual environment for that phase must be activated separately. The server should detect missing dependencies at startup and print a clear error: `Missing: duckdb. Run: pip install duckdb==1.5.1` rather than a bare `ModuleNotFoundError` traceback.
- Accept `--port` via `argparse`. If the default port is occupied, apply the same auto-probe logic as the launcher.

**Health endpoint:**
- Implement `GET /api/v{N}/status` as the first handled route, returning `{"status": "healthy", "version": "...", "phase": N, "timestamp": "..."}`. This endpoint must succeed even if optional heavy dependencies (Neo4j, Qdrant) are unavailable — report their availability in the response body rather than failing.

**Phase scope:**
- Each server exposes endpoints for its own phase only. Cross-phase data access (e.g. Phase 2 reading Phase 1's DuckDB registry) is done via direct Python import — not via HTTP calls between phase servers.

**Concurrency guard:**
- Return HTTP 409 if a long-running job is already `running` when a new start request arrives.
- Use `threading.RLock` for all shared state. One pipeline execution per phase server at a time.

**DuckDB cross-process safety:**
- Phases that open the shared DuckDB registry must use `_with_retry(fn, retries=3, delay=0.5)` on all read and write operations to handle lock contention when multiple phase servers run simultaneously.
- Document clearly in each phase server which database operations are read-only vs read-write.

**CORS:**
- Every response includes `Access-Control-Allow-Origin: *`.

### 18.14 Icons (Unicode)

Standard icon assignments across all project UIs:

| Purpose | Icon |
|---|---|
| File load / folder | 📂 |
| Help | ❓ |
| Settings / options | ⚙️ |
| Tree / hierarchy | 🌳 |
| Info | ℹ️ |
| Pipeline / dashboard | 📊 |
| Layout toggle | 🔲 |
| Run / execute | ▶ |
| Refresh | 🔄 |
| Success / pass | ✓ |
| Failure / error | ✗ |

### 18.15 Shared JS Library (`comUI`)

All UIs must use `common/universal_ui_design.js` for reusable interactive logic. The library exposes a `window.comUI` namespace with these modules:

| Module | Functions | Purpose |
|--------|-----------|---------|
| `comUI.theme` | `apply(name, storageKey)`, `initPicker(storageKey)` | Apply theme, toggle dropdown, persist to localStorage |
| `comUI.sidebar` | `resize(sbId, handleId, opts)`, `accordion(scopeEl)` | Drag-to-resize sidebars, collapsible accordion sections |
| `comUI.layout` | `toggle(btnId, opts)` | Cycle 1-col → 2-col → 3-col layout modes |
| `comUI.toast` | `show(msg, type, duration)` | Fixed-position notification with auto-dismiss |
| `comUI.modal` | `open(id)`, `close(id)`, `init(id)` | Overlay modal with background-click-to-close |
| `comUI.file` | `setupDropZone(zoneId, onFile)`, `readFileAsText(file)`, `readFileAsJSON(file)`, `readFileAsDataURL(file)` | Drag-drop zone, FileReader promises |
| `comUI.table` | `makeSortable(tableId)` | Column header click sort with ▲/▼ indicators |
| `comUI.utils` | `escHtml(s)`, `formatNum(n)`, `formatBytes(b)`, `setStatus(el, msg)`, `setStatusBar(leftMsg, rightMsg)` | Formatting and status bar helpers |

**Rules:**
- Include `<script src="/common/universal_ui_design.js">` before any page-specific JS.
- Use `comUI.*` functions instead of reimplementing theme toggle, sidebar resize, accordion, toast, modal, or layout switching in each page.
- Storage keys should follow the `<project>-<feature>` convention (e.g. `eks-theme`, `dcc-layout`, `code-tracer-sidebar-w`).
- The library has zero external dependencies — it is vanilla JS (ES5-compatible) with no npm imports.

### 18.16 Icon Bar and File Loading (from universal JS)

The `comUI.file.setupDropZone()` function implements the drag-and-drop requirements of §18.7. The `comUI.layout.toggle()` function implements the layout switching requirements of §18.8. Theme picker dropdown HTML structure must match:

```html
<button class="com-theme-btn" id="themeBtn">🎨 <span class="com-theme-dot"></span> Theme</button>
<div class="com-theme-menu">
  <div class="com-theme-opt active" data-theme="dark"><span class="com-theme-dot" style="background:#0d1117"></span> Dark</div>
  <div class="com-theme-opt" data-theme="light"><span class="com-theme-dot" style="background:#ffffff"></span> Light</div>
  <div class="com-theme-opt" data-theme="sky"><span class="com-theme-dot" style="background:#0b1a2e"></span> Sky</div>
  <div class="com-theme-opt" data-theme="ocean"><span class="com-theme-dot" style="background:#0a1929"></span> Ocean</div>
  <div class="com-theme-opt" data-theme="presentation"><span class="com-theme-dot" style="background:#000000"></span> Presentation</div>
</div>
```

Initialize with: `comUI.theme.initPicker('myapp-theme')`.

## 19. Data Health, Score, and Errors

### 19.1 Error Code Lifecycle

Every error code must complete a full lifecycle across 5+ sources:

1. **Define** — error code constant declared in the code module that raises it.
2. **Register** — code added to `<project>/config/schemas/<project>_error_config.json` with `id`, `category`, `message_template`, `severity`, and `resolution` fields.
3. **Validate** — code pattern must match the regex in `<project>_error_config_base.json`. Unknown pattern formats cause silent lookup failures in `ErrorManager`.
4. **Document** — code format and ranges must appear in the project's pipeline message/error design document (e.g., Appendix D).
5. **Resolve** — all code consumers (ErrorManager, BootstrapManager, pipeline orchestrator, test suite) must be able to resolve the code at runtime.

**Error code format conventions:**

All error codes must follow the canonical `X-X-X-XXXX` pattern with 4-digit IDs (review directive 2026-08-08; I289). Legacy formats (`P1-BOOT-{reason}`, `P1-SETUP-{type}{id}`, `B-{module}-{id}`, `S-{cat}-S-{id}`) are retired:

- `S-{cat}-S-{id4}` — system/infrastructure errors (e.g., `S-B-S-0603`)
- `B-{cat}-S-{id4}` — universal bootstrap errors (e.g., `B-C-S-0001`, `B-H-S-0001`)
- `P{phase}-{module}-{id4}` — data pipeline / phase errors (e.g., `P1-SETUP-FOLDERS` if used must carry 4-digit suffix)

**Cross-source validation checklist:** When adding or changing any error code, verify:
- [ ] Code exists in `error_config.json` (registered with all metadata fields)
- [ ] Pattern matches regex in `error_code_base.json`
- [ ] Code format documented in design doc (Appendix D or equivalent)
- [ ] All 5 sources agree on the same `id`, `category`, and `severity`
- [ ] Test exercises the error path and verifies the resolved code

### 19.2 Message Catalog Management

- Every status, milestone, warning, and info message must be registered in `<project>_message_config.json` with a unique `id`.
- The message manager must use the correct project-specific catalog file (e.g., `eks_message_config.json`, not the generic `message_config.json`).
- Message catalog and error catalog must be kept in sync: every bootstrap phase, every pipeline phase, and every major operation must have corresponding entries in both catalogs.
- When a message ID is added to the catalog, the corresponding message-format definition must be added to the message base schema.

### 19.3 Independent Error Codes

Each business logic unit (function, phase, module) must have at least one independent error code defined to trace related errors. No two distinct error conditions may share the same error code. Error codes must be granular enough that a log entry uniquely identifies the failure point without additional context.

## 20. Neurogram, Compact Workplans, Records, and Logs for Knowledge of Each Project Folder

Refer to `dcc/workplan/ui_design/log_neurogram/`. Generate a neurogram network JSON file (`dcc_log_graph.json`) in the respective `<project>/output/` folder. Ensure details can be compacted into the JSON file.

## 21. Testing Notes

- `code_tracer` tests use `unittest`; `eks` tests use `pytest`.
- EKS tests must run from the repository root: `python -m pytest eks/test/`.
- EKS tests expect config files at `eks/config/` (relative to repo root).
- Test runtime artifacts go to `<project>/test_output/` (per §6.1). EKS tests create `eks/test_output/` for generated files and `eks/output/eks_registry.db` for the registry database.
- Test output directories (`test_output/`) must be added to `.gitignore` at both repository root and per-project levels.
- Test files that use relative paths (e.g., `Path("test_output/...")`) must scope those paths within the project directory (e.g., `Path("eks/test_output/...")`). Bare `Path("test_output/...")` resolves to the CWD (repo root) and violates §6.1.
- code_tracer tests use `unittest.main()` and can be run directly or via pytest.

**Minimum test coverage:**
- Every engine module (files in `engine/core/`, `engine/parsers/`, etc.) must have at least one test file exercising its primary entry points.
- Every public function should have at least one happy-path test.
- Every HTTP/WebSocket endpoint must have at least one integration test.
- A module with zero tests may not be marked as "complete" in any workplan.
- Test coverage gaps (modules without tests) must be logged as issues and tracked in the next phase workplan.

## 22. Formatting

- Prettier config at root: `printWidth: 100`, `singleQuote: true`, `endOfLine: "lf"`.

## 23. Bootstrap and Pre-Bootstrap Safety

### 23.1 Universal BootstrapManager Pattern

Every pipeline project must use a universal `BootstrapManager` (from `common/library/bootstrap/`) as the single entry point for initialization. The manager runs 8 standardized phases:

| Phase | Name | Purpose |
|-------|------|---------|
| P1 | CLI Parse | Parse command-line arguments for verbosity, paths, and overrides |
| P2 | Paths | Resolve project root, config dir, data dir, output dir via `resolve_paths()` |
| P3 | Config Registry | Load `ConfigRegistry` from schema/config files |
| P4 | Defaults | Apply schema-driven defaults for unset parameters |
| P5 | Schema Registry | Load and validate all schema files |
| P6 | Environment | OS detection + `test_environment()` dependency verification |
| P7 | Readiness Gate | Run `ValidationManager` (folder/file existence, required dependencies) |
| P8 | Parameters | Finalize system parameters (log level, retry, timeout, cache TTL) |

A project-specific subclass (e.g., `EKSBootstrapManager`) injects project-specific hooks: `ConfigRegistry` adapter, validation manager, CLI parser, path resolver, and ErrorManager/MessageManager factories.

### 23.2 Pre-Bootstrap Infrastructure (`_preload_infrastructure()`)

Before any bootstrap phase runs, the pipeline entry point must execute a **pure-stdlib** preload function that guards all `common.library` imports:

- Every non-stdlib import must be individually `try/except ImportError`-guarded.
- Every failure must immediately `print(msg, file=sys.stderr)` — errors are never silently collected.
- All variables must be pre-bound to safe defaults (`None`) before any step runs — a failure in step N must never cause `NameError` in step N+1.
- The preload function returns imported **classes** (not instantiated objects) — logger and heartbeat are instantiated in `main()` after the preload gate passes.
- **Pre-bootstrap services run first**: the logger, telemetry/heartbeat, and project-root discovery must all be running **before any bootstrap phase begins** — before P1 of §23.1 — not during one.
- **Clean failure**: if `common.library` is not importable, the entry point must exit with a human-readable message. Never surface a bare `ModuleNotFoundError` traceback to the user.
- Repository root must be injected into `sys.path` via a pure-stdlib walk (find ancestor containing both `<project>/` and `common/` anchors) before any import is attempted.

### 23.3 Environment/Dependency Check

- Bootstrap Phase 6 must run `test_environment()` from `common/library/core/system/tester.py` to verify all required/optional dependencies.
- `test_environment()` must maintain a `_PIP_TO_IMPORT` mapping for pip-name-to-import-name mismatches: `python-docx` → `docx`, `qdrant-client` → `qdrant_client`, `pymupdf` → `fitz`, `scikit-learn` → `sklearn`, etc.
- All dependencies listed in `eks.yml` (conda environment) must also be listed in the config `dependencies.required` or `dependencies.optional` section — the two sources must stay in sync.
- If `test_environment()` returns `ready=False`, bootstrap must raise a structured `BootstrapError` with the missing dependency names and installation instructions (e.g., "Run: conda activate eks && pip install <package>").

### 23.4 Ghost/Stale Directory Prevention

- Empty legacy directories (e.g., `eks/eks/`) can cause `discover_project_root()` to return the wrong project root, silently doubling path prefixes.
- Before path resolution, scan for and archive/delete any stale subdirectories that match the project anchor name.
- `discover_project_root()` must fall through to `default_base_path(anchor)` when an anchor directory exists but is empty or contains only irrelevant files.

## 24. Cross-Source Alignment Audit

When a concept (error code format, message ID, field name, configuration value, version number) spans **3+** independent sources, a formal cross-reference audit must be performed before the feature can be marked complete:

**Typical multi-source concepts and their sources:**
1. **Error codes**: `error_code_base.json` (pattern), `error_config.json` (registration), `error_setup_schema.json` (properties), design doc (Appendix D), library code (BootstrapError), project code (raise site)
2. **Message IDs**: `message_base.json` (format), `message_config.json` (registration), `message_setup_schema.json` (properties), design doc (Appendix D), message manager code
3. **Global paths**: `base_schema.json` (definitions), `config.json` (values), path resolver code, pipeline entry point, bootstrap manager, server code
4. **System parameters**: `base_schema.json` (definitions), `config.json` (values), `system_parameters` helper, pipeline entry point, each consumer module

**Audit procedure:**
1. List all sources where the concept appears.
2. For each source, verify: format names match, regex patterns accept all registered values, field names and types are consistent, and version numbers are aligned.
3. Run `grep` for the concept's identifiers across the entire project and `common/library/` — ensure no stale references to old names/formats exist.
4. Any mismatch in any source is a blocking defect — the feature is not complete until **all** sources agree.

## 25. File Output Lifecycle Management

### 25.1 Write-Only vs Read-Back Files

- **Read-back files** (registry databases, checkpoint state used by resume logic) must be persisted with unique names per job/run and have a documented retention policy.
- **Write-only files** (pipeline status JSON, debug logs, progress snapshots that are only served via in-memory API) must use a **single overwrite file** (e.g., `pipeline_output.json`) — never accumulate per-job copies.
- Before implementing any file output, document whether the file is ever read back by any code path. If the answer is "no", use the single-overwrite pattern.

### 25.2 Output Directory Hygiene

- `output/` directories accumulate files over repeated pipeline runs. Per-job JSON files grow unbounded (N runs × M JSON files). Implement one of:
  - Single overwrite file (preferred for write-only data)
  - Capped retention (keep last K files, delete oldest)
  - Explicit cleanup phase in the pipeline lifecycle
- At each phase completion, check `output/` for accumulated stale files and clean them up.
- Checkpoint files that are never used by resume/restart logic are dead code and should be removed — not just commented out.

## 26. Issue Lifecycle Management

Every pipeline project must follow a standardized 5-stage issue lifecycle from discovery through closure. Detailed design reference: `<project>/workplan/appendix_k_issue_management.md`. Log structure, ID scope, safe editing and the validation workflow are in §26.11–§26.14.

### 26.1 Five-Stage Lifecycle

Every issue progresses through these stages:

```
① RECORD & EVALUATE → ② PLAN & APPROVE → ③ IMPLEMENT & UPDATE → ④ TEST & VERIFY → ⑤ CLOSE & ALIGN
```

| Stage | Exit Criteria | Artifacts |
|-------|--------------|-----------|
| ① | Severity, priority, phase assigned | issue log status `OPEN` |
| ② | Tasks defined and approved | Task rows `🔷 PLANNED`; issue status `APPROVED` |
| ③ | All tasks `✅ COMPLETE`; update_log entry written | update_log entry `Uxxx` |
| ④ | Test results documented; closure criteria met | test_log entry `TLxxx` |
| ⑤ | Issue closed; workplan updated | issue status `RESOLVED` or `ALIGNED` |

### 26.2 Canonical Issue Log Record — 9 Fields

Canonical issue tables use this column layout:

```
| ID | Date | Phase | Severity | Title | Description | Status | Tasks | Resolution |
```

- This is the canonical format for new issue logs and logs migrated under an approved workplan. Existing project or phase logs retain their established format until explicitly migrated.
- At discovery, `ID`, `Date`, `Severity`, `Title`, `Description`, and `Status` are required. `Phase` may be `—` until assigned. The `ID` must be unique within the project's active log set (§26.12). Write a **concise** `Title` and an **evidence-based** `Description`. `Tasks` and `Resolution` may be `—` until planning or closure.
- **Tasks** holds task ID(s) implementing the issue (e.g. `T1.99.31` or `T1.21/T1.22`) and links to the workplan task table.
- **Resolution** uses the structured format with ` — `-separated segments (see §26.5); populate segments as evidence becomes available.
- **As the issue progresses**: during planning add task IDs and required approval evidence; during implementation update status and task progress **without replacing the discovery context**; at closure record task IDs, a concise resolution, and the required update / test / workplan references. Keep detailed implementation and test results in their respective logs and reports, and link to them.

### 26.3 Status Codes and Display Markers

| Code | Display marker | Status | Meaning |
|:-----|:--------------:|:-------|:--------|
| `OPEN` | 🔴 | Open | Not yet addressed; active in queue |
| `IN_PROGRESS` | ⏳ | In Progress | Approved work is currently being implemented |
| `DEFERRED` | ⏸️ | Deferred | Moved to a future phase with rationale |
| `DEFERRED_STUDY` | 🔷 | Deferred for further study | More investigation is required before a decision |
| `DEFERRED_REVIEW` | 🔶 | Deferred for further review | Requires discussion or review before action |
| `WONT_IMPLEMENT` | ⛔ | Won't Implement | Explicitly rejected or out of scope, with rationale |
| `OPEN_PARTIAL` | 🟠 | Open (partial) | Partial progress exists; closure criteria remain |
| `APPROVED` | 🟢 | Approved | Tasks are defined and approved; implementation has not started |
| `RESOLVED` | ✅ | Resolved | Fix is implemented and verified; documentation alignment may remain |
| `ALIGNED` | 📐 | Aligned | Issue is resolved and required workplan/docs are synchronized |

The code is authoritative for status transitions and counts. A marker is presentation only; parsers and summaries must use the code. Canonical summaries list all ten codes, including zero counts, and a grand total.

Record the code in the Status field; an optional display marker may follow it. The log legend defines each code and its permitted transitions. Never count by display marker alone.

### 26.4 Severity Markers

| Marker | Severity | Meaning |
|:------:|:---------|:--------|
| 🔴 | Critical | Blocks phase completion |
| 🟠 | High | Significant impact; workaround needed |
| 🟡 | Medium | Moderate impact; can proceed |
| 🟢 | Low | Minor, cosmetic, or non-blocking |
| 🔷 | Deferred | Moved to future phase; not currently blocking |

### 26.5 Resolution Column — Structured Format

The Resolution column uses segments separated by ` — ` (space-emdash-space):

```
Updates: Uxxx — Tests: TLxxx — Close: {summary} — Workplan: {filename} vX→vY — Approved: date by author
```

| Segment | Purpose | Required? |
|---------|---------|:---------:|
| `Updates:` | Update log entry IDs (Uxxx) | Recommended for `RESOLVED`/`ALIGNED` |
| `Tests:` | Test log entry IDs (TLxxx) | Optional |
| `Close:` | 1-line human-readable summary | Optional |
| `Workplan:` | Workplan file name + version change (e.g. `phase_1_foundation_workplan.md v3.71→v3.72`) | Recommended for `ALIGNED` |
| `Approved:` | Who approved and when | Required for `APPROVED` |

### 26.6 Approval Gate

Between task planning and implementation, every issue must pass an approval gate:

- `OPEN` → `APPROVED`: tasks are defined and explicitly approved; `Resolution` records `Approved: YYYY-MM-DD by {author}`.
- `APPROVED` → `IN_PROGRESS`: implementation begins.
- `IN_PROGRESS` → `RESOLVED`: tasks and closure criteria are implemented and verified.
- `RESOLVED` → `ALIGNED`: required workplan and documentation synchronization is complete.
- A transition to a deferred, study, review, won't-implement, or partial state requires a rationale in the issue record. Deferred issues may return to `OPEN` or `APPROVED` when work resumes.
- A `RESOLVED`, `ALIGNED`, or `WONT_IMPLEMENT` issue may return to `OPEN` only with new evidence, recurrence, or a changed decision recorded in the issue; create a separate issue when the new work is distinct.
- Do not mark an issue `RESOLVED` based only on planned work.

### 26.7 Per-Issue Closure Criteria (Checklist)

Complex issues should embed a checklist of closure criteria in the Description column, using standard `[ ]` / `[x]` markdown format:

```
[x] Fix search path — Done T1.99.31
[x] Add 2 regression tests — Done TL003
[x] Verify 277/277 green — Result: all pass
```

Each item is a specific, verifiable claim. Simple issues (single-task, trivial) may omit the checklist.

### 26.8 Workplan Alignment

Issues that change pipeline architecture, task tables, config schemas, or shared libraries must transition from `RESOLVED` to `ALIGNED` after the workplan is updated. The Resolution `Workplan:` segment records the file name and version change.

The status `ALIGNED` is a superset of `RESOLVED` — every aligned issue was first resolved, then had its documentation sync completed.

### 26.9 Cross-Reference Integrity Rules

**Rule 1 — Resolved Issue Completeness**: Every `RESOLVED` or `ALIGNED` issue must have its Tasks column populated and its Resolution reference at least one `U{xxx}`.

**Rule 2 — Task Test Coverage**: Every `[Code]`, `[Schema]`, `[Fix]` task with status `✅ COMPLETE` must have its Tests column populated (at least one `TLxxx`).

**Rule 3 — Update Log Consistency**: Every `Uxxx` marked `✅ Done` must reference at least one `Ixxx` and one `T{phase}.{seq}`.

**Rule 4 — Approval Gate**: Issues transitioning from `OPEN` to `APPROVED` must record `Approved: {date} by {author}` in Resolution.

**Rule 5 — Workplan Alignment**: Architecture-impacting issues should transition to `ALIGNED` and reference the workplan file+version in Resolution.

### 26.10 Task Table — Tests Column Policy

In the workplan task table (`appendix_p1.4` or equivalent), the Tests column follows these rules:

| Task category | Tests column policy |
|:--------------|:--------------------|
| `[Code]` | Required — at least one `TLxxx` |
| `[Schema]` | Required — at least one `TLxxx` |
| `[Fix]` | Required — at least one `TLxxx` |
| `[Config]` | Recommended |
| `[Testing]` | Required — self-referencing (`TLxxx` for the test file itself) |
| `[Docs]` | Optional — `—` is acceptable |
| `[Cleanup]` | Optional — `—` is acceptable |
| `[Init]` | Optional — `—` is acceptable |

### 26.11 Canonical Log Sections

A canonical log has five ordered sections:

1. Metadata header
2. Legend
3. Status summary
4. Priority resolution sequence
5. Issue table

The status summary and the priority resolution sequence are required for canonical logs. Legacy
logs need not be retrofitted unless an approved migration requires it.

### 26.12 Issue ID Scope and Active Log Selection

Issue IDs are unique across the project's active issue-log set, including phase-specific active
logs. The project must identify its active log or log set in `knowledge.json` or in project
guidance. If no phase-specific scheme is declared, use `<project>/log/issue_log.md` as the
canonical location.

Archived or retired logs are read-only history and do not reset ID allocation. Preserve the
established ID syntax; use a project-wide sequence unless project guidance explicitly defines
another globally unique scheme.

### 26.13 Safe Editing and Validation

Never replace an entire issue log with reconstructed content. Use targeted edits, preserve all
unrelated entries, escape or rephrase literal pipes in table cells, and validate all
cross-references after each edit.

For canonical logs:

- Recount all ten status codes (§26.3).
- Confirm priority-sequence IDs exist in the issue table and that listed counts match.
- Check IDs for duplicates and gaps in the project's defined sequence (§26.12).
- Verify each table row has the expected nine fields (§26.2).

For legacy logs, run the equivalent checks supported by their format without imposing canonical
headings or columns.

### 26.14 Required Validation Workflow

Do these five steps before you finish an edit to an issue log:

1. Confirm the target is the active log, and note its format and ID scheme (§26.12). Review its local conventions before you edit.
2. Check required fields, status and approval evidence, and references for the changed issue.
3. Recalculate canonical summaries and priority counts where present (§26.3).
4. Check ID uniqueness and sequence across the active log set, and verify table formatting where
   applicable.
5. Confirm that no unrelated entries or historical content were removed or rewritten.

## 27. Project Logs

Every project keeps **three logs**. Write to them as work proceeds, not at the end of a phase.

| Log | Records | Entry ID |
|:----|:--------|:---------|
| `issue_log.md` | one record per issue, from discovery to closure | `Ixxx` |
| `update_log.md` | one entry per file revision | `Uxxx` |
| `test_log.md` | one entry per test run | `TLxxx` |

- Keep all three in `<project>/log/`. §26.12 names `<project>/log/issue_log.md` as the canonical
  issue log; §13 requires an `update_log.md` entry on every file revision.
- An issue's Resolution references its `Uxxx` (§26.9 Rule 1). A workplan task's Tests column
  references a `TLxxx` (§26.10).
- Do not create a log entry without the artifact it references: §26.9 Rule 3 requires every `Uxxx`
  marked done to reference at least one `Ixxx` and one `T{phase}.{seq}`.
- A project that names or locates its logs differently must record that in `knowledge.json`.
  MDL currently uses `MDL/mdl-issues.md`; treat that as its declared convention until it migrates.
- No `*_log.md` files exist in this repository yet. Treat §27 as the target convention for new
  projects and for migration.

## 28. Relocation and Import-Path Integrity

When any file or package is relocated:

1. Run a project-wide `grep` for every import path that references the old location.
2. Update every match **in the same edit cycle**.
3. Run the full test suite after the change.
4. If no test exercises the relocated code, add one before you close the migration task.

A relocation is not complete until all four steps are done.

## 29. Pattern-Defect Fix Breadth

When you fix a pattern-based defect — not a single-instance bug:

1. Use `grep` to find **all** occurrences of the broken pattern across the entire project.
2. Update all matches **in the same edit**.
3. Record the search pattern in the task description, so the same fix can be re-applied if the
   pattern returns.

§13 applies the same breadth rule to revision metadata: when a file's version or revision changes,
every file that references it updates in the same edit cycle.

## 30. Path Resolution SSOT and No Hardcoded Fallbacks

**Path resolution.** Resolve every directory and file path through the schema-driven `global_paths`
definitions, with this precedence:

```
CLI argument  >  Schema default  >  code-native fallback
```

- Never use hardcoded path literals — for example `parent.parent.parent`, `"data"`, `"output"`.
- Use anchor-folder-based discovery (`default_base_path(anchor)`) to find the project root, then
  derive every sub-path from `global_paths` schema values.
- Every path must flow through `resolve_paths()`, so one schema change updates all consumers.

**No hardcoded fallback lists.** Never maintain a hardcoded list — required folders, required
files, dependency lists, default paths — that duplicates a value already defined in a schema or
config file. If the config is absent, raise a descriptive error. Never fall back silently to a
second source of truth. Hardcoded duplicates diverge over time and violate SSOT.

**How the two rules relate.** The `code-native fallback` in the precedence chain is a last resort
for *locating the project root* when no CLI argument and no schema value exist. It is not a licence
to duplicate schema-defined values in code. No-hardcoded-fallbacks forbids the duplication;
path-resolution permits only the final fallback step.

**Implementation status.** `global_paths`, `resolve_paths()` and `default_base_path()` appear only
in this document. No code in this repository implements them yet. Treat §30 as the target design;
it does not describe current behaviour.
