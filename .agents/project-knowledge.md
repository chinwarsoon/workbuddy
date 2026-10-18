---
description: Create, inspect, update, and validate a project's machine-readable knowledge base using repository guidance
mode: subagent
---

# Project Knowledge Management

| Revision | Date | Author | Summary |
|---|---|---|---|
| 1.0 | 2026-10-17 | Codex | Initial general skill for project-root-based knowledge.json management. |

Use this skill whenever a task involves a project's `knowledge.json`: initial creation, architecture or workflow documentation, phase completion updates, validation, or troubleshooting. The skill applies to whichever project is selected for the task. Do not assume a project name, folder name, schema variant, or project-specific subfolder.

## 1. Establish the target project

1. Use the project explicitly named by the user or the project containing the requested work. In a monorepo, determine the project root from the repository layout, project metadata, and task context; do not assume the current working directory is the project root.
2. If more than one project could be the target and the choice changes the content, ask which project. Do not choose a hardcoded subproject as the default.
3. Read the repository and applicable project-level `AGENTS.md` / `agent_rule.md` instructions. Review the target project's `knowledge.json`, if present, before proposing changes.
4. Follow repository scan rules: prioritize the target `knowledge.json`; exclude backup folders, dot-files/folders, and test folders when scanning implementation context. Review relevant workplans for the requested phase.
5. Resolve all file references from the selected project root. Use paths that are accurate for that project; do not copy another project's folder layout or paths.

## 2. Knowledge base purpose and required content

Treat `knowledge.json` as the project's machine-readable blueprint and charter for AI-assisted maintenance. It should describe the real project and point to source-of-truth files; it should not duplicate entire schemas, workplans, source files, or logs.

Every project knowledge base must cover the repository requirements in `AGENTS.md` §2:

- **Project metadata:** canonical name, version, description, purpose, and useful status/date metadata.
- **Architecture overview:** key modules, data flows, and integration points.
- **Domain concepts:** core entities, relationships, and terminology.
- **Key schemas:** references to primary schema files, with versions only when verified.
- **Workflows:** primary operational workflows and entry points.
- **Functions:** important functions, entry points, and data-processing pipelines.
- **Data flows:** sources, transformations, destinations, and applicable quality checks.
- **Dependencies:** external services, libraries, and infrastructure.
- **Known issues:** current limitations, technical debt, and open questions.

Projects may also record sections such as `data_quality_checks`, `initiation_integrity`, counters, or `revision_history` when useful or required by the local schema. These are optional extensions unless project instructions or the validated schema make them required. Existing examples share the main concepts but vary in detail and representation; do not force optional sections or one example's object shape onto every project.

When architecture overview and detailed data-flow sections both exist, make their roles clear: keep the overview concise and ensure detailed flows agree with it. Avoid conflicting duplicate descriptions.

## 3. Create a knowledge base when it is missing

Repository policy requires a `<project-root>/knowledge.json` for each project. If it is missing:

1. Treat knowledge-base creation as the first project task and complete it before further project development.
2. Follow the plan and approval gates in the applicable instructions. Create a workplan in the target project's workplan area before implementation when required.
3. Inspect project metadata, root files, configuration/schema references, entry points, architecture, and known issues. Use current source evidence; do not infer unimplemented features from plans or TODOs.
4. Declare the canonical project name and abbreviation in `project_metadata.name` as required by `AGENTS.md` §1, following the established form (for example, `Canonical Name (ABBR)`). When updating an existing project, preserve its approved value exactly; do not introduce an alternate name or a competing abbreviation field.
5. Populate all required content from §2. Start with a concise, accurate baseline and mark unknowns as unknown or open questions rather than fabricating detail.
6. Add the file's revision/version history in the target project's established format. Do not invent a schema `$id` or claim schema validation if no authoritative schema is available.

## 4. Update an existing knowledge base

- Preserve its valid local schema, field names, ordering conventions, and useful project-specific extensions. Make narrow, reviewable edits and retain meaningful history.
- Update the knowledge base at every workplan phase completion, as required by `AGENTS.md` §5.10. Keep version, last-updated date, and revision history consistent with the actual change.
- Verify module/function names, entry points, paths, workflow stages, schema versions, dependencies, and issue status against current source files and active project logs. Separate implemented behavior from planned work and stubs.
- Keep the canonical project name aligned with `project_metadata.name`; before phase completion, search the project for conflicting names as required by `AGENTS.md` §1.
- Add or revise known issues only with evidence. Keep issue status and references aligned with the active issue log; do not silently close old issues or duplicate long issue narratives.
- Keep detailed change plans, test reports, and event history in their workplan/log artifacts. The knowledge base summarizes and links to them where helpful.
- Do not modify project code, schemas, configs, or unrelated documentation merely to make the knowledge file appear complete. Log discovered defects and track them in an approved follow-up task.

## 5. Schema and content validation

First check the shared repository configuration location defined by `AGENTS.md` §3 for the authoritative `knowledge_base_schema.json` and confirm it applies to the target project. Do not assume this shared schema is inside the target project's own configuration folder.

- If the schema exists, inspect it and validate the complete JSON instance against it using the project's available validation workflow. Report the validator and result.
- If the schema is absent, do not claim schema validation. Record the missing-schema limitation in the task report and, when required, the owning project's issue log. Perform only clearly labeled structural checks against `AGENTS.md` and the target project's established format.
- Do not add a substitute schema, secondary hardcoded field list, or guessed fallback. Schema/config absence is a surfaced issue under the repository SSOT rules.

For every creation or update, check:

1. The file parses as JSON, with no duplicate object keys.
2. Required sections from `AGENTS.md` are present and use the target schema's expected types and shapes where known.
3. The canonical project name and version agree with project metadata and root version sources.
4. Referenced project files and schemas exist at the stated paths, and paths are rooted in the correct project.
5. Workflow entry points and listed functions/modules exist and match current behavior; plans and stubs are not described as implemented.
6. Data-flow sources, transformations, destinations, integration points, and quality checks agree across the knowledge base and source configuration/code.
7. Dependencies and known issues are current and traceable; no stale issue IDs or retired-log references are presented as active.
8. Revision history and last-updated metadata describe the actual change.

When concepts span three or more independent sources, follow the cross-source alignment audit in `AGENTS.md`: enumerate sources and reconcile names, fields/types, IDs, versions, and relationships before completion.

## 6. Workplan, logging, and revision gates

- Review related workplans before implementation. Follow the target project's workplan, approval, report, and logging requirements.
- Update the target project's knowledge base as part of each completed phase and cross-reference its workplan/report when useful.
- Log issues and updates in the target project's own log folders. Do not put one project's tracking entry in another project's issue log merely because the skill is shared.
- Apply revision metadata to every changed file using that file's local convention. For Markdown documents, use the repository's top-of-file revision table; for JSON, follow the authoritative schema/project convention and preserve revision history.
- Mark a knowledge-base task complete only when required content is accurate and validated to the extent the available schema/tooling allows. Structural scaffolding with unknown or stub content must be identified as partial or planned.

## 7. Completion report

Report the target project root and `knowledge.json` path, the sections changed, the source files used to verify facts, schema availability and validation result, revision metadata updates, and any open issues or assumptions. State explicitly when schema validation was unavailable. Do not imply changes were made to other subprojects.
