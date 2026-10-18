---
description: Find, update, validate, and cross-reference project issue logs without losing existing issue history
mode: subagent
---

# Issue Log Management

**Revision:** 1.1  
**Date:** 2026-10-17  
**Author:** Codex  
**Summary:** Added a cross-project canonical record, status-code, lifecycle, and ID-scope standard while retaining legacy formats.

Use this skill whenever identifying, recording, updating, validating, or closing issues in a project issue log. Treat the applicable project instructions and the target log's established format as authoritative. Preserve issue history and use narrow edits.

## 1. Find the right log and its conventions

1. Read the repository `AGENTS.md` and applicable project-level `AGENTS.md` or `agent_rule.md` before editing.
2. Locate the target project's `knowledge.json` and inspect its issue-log/workflow references when available.
3. Search the project for `issue_log.md` files and determine which one is active. Projects may use a single log, phase-specific logs, or archived/retired logs. Do not write to a retired or archived log when an active source is identified.
4. Review the target log's heading structure, ID pattern, status vocabulary, severity vocabulary, entry template, and nearby entries. Review linked workplans and `update_log.md` / `test_log.md` entries when relevant.
5. Match the target log's existing format. The canonical format below applies to new logs or logs explicitly migrated under an approved workplan. Do not convert a legacy or phase-specific log during ordinary maintenance. If shared guidance conflicts with a log's established structure, preserve its history and flag the conflict for a separate, approved alignment task.

## 2. Canonical issue record and project-wide IDs

For new or explicitly migrated logs, use these nine fields in this order:

`| ID | Date | Phase | Severity | Title | Description | Status | Tasks | Resolution |`

- At discovery, require `ID`, `Date`, `Severity`, `Title`, `Description`, and `Status`. Use `—` for an unassigned phase, tasks, or resolution.
- During planning, fill in task IDs and approval details. During implementation, update status and task progress while retaining discovery context.
- At closure, record task IDs, a concise resolution, and required update/test/workplan references. Keep detailed test and implementation evidence in the linked artifacts.
- Use specific `[ ]` / `[x]` closure criteria for complex issues.
- IDs are unique across a project's active issue-log set, including active phase-specific logs. Determine the active set from `knowledge.json` or project instructions. When no phase-specific arrangement is declared, use `<project>/log/issue_log.md`. Archived and retired logs are read-only history and do not reset ID allocation. Preserve project-specific ID syntax.

## 3. Approval and planning gates

- Follow the repository's plan-before-code and no-edits-without-approval rules. Present a concrete proposed change and wait for explicit approval before modifying files when required by project instructions.
- Create or update the applicable workplan before implementation when required. Review related workplans first. Do not treat issue-log maintenance as approval to implement the underlying fix.
- Record only verified facts. If root cause, severity, owner, dates, or resolution evidence are unknown, mark them as pending or state the uncertainty instead of inventing details.

## 4. Record a new issue

1. Assign the next ID using the target log's established ID scheme. Search the full relevant log set (including active phase logs, where IDs are shared) to avoid reusing an ID.
2. Add the issue promptly after discovery. Include the timestamp/date required by that log.
3. Describe the observed behavior, context, impact, and evidence. Separate confirmed root cause from hypotheses.
4. Set severity and status using the log's own legend. Do not introduce a new marker or reinterpret an existing marker without an approved convention change.
5. Link the issue to a workplan/task when one exists. For planned work, record task IDs and approval state as prescribed by the project workflow.
6. For complex issues, include specific, verifiable closure criteria. Keep each criterion testable and tie completed criteria to task or test evidence.

## 5. Update and close an issue

- Preserve the issue ID and original discovery context. Update the existing entry rather than appending a duplicate issue for the same defect.
- On progress, update status, task links, and evidence without claiming completion prematurely.
- On resolution, document a concise cause and resolution summary, files or components changed when known, and links/IDs for update and test records where available.
- Mark an issue resolved only after its defined closure criteria are verified. Use the project's aligned status (such as `📐 Aligned`) when required architecture/workplan synchronization is complete; otherwise leave the documentation alignment outstanding and accurately reflect that state.
- Follow project-specific cross-reference requirements. In the repository's standardized lifecycle, resolved/aligned issues need task references and an update-log reference; completed code/schema/fix tasks need test-log evidence. Record approval details for transitions that require approval.
- Do not rewrite or summarize away prior evidence. If a correction is needed, make the smallest targeted change and retain a clear audit trail.

## 6. Protect log structure and history

For canonical logs governed by `AGENTS.md` §5.17:

1. Before editing, verify the metadata header, legend, status summary, priority resolution sequence, and issue table are present and in the required order. This is five sections, not four.
2. Make targeted edits only. Never replace the entire issue-log file with a reconstructed version. Use the repository's targeted replacement/edit mechanism for an issue-log change.
3. After editing, regenerate the status summary by stable status code (all ten codes, including zeros, plus grand total); validate legend entries, priority references/counts, project-wide issue ID continuity/duplicates, and nine-field table rows as specified by §5.17.
4. Preserve markdown table structure. Escape or rephrase literal pipe characters in cell text so they do not create extra columns.

Apply canonical layout checks only when that structure governs the target log. Many repository logs use narrative entries or separate phase files; do not force the canonical table or headings onto them. Instead, validate invariants supported by that format: no duplicate IDs across active logs, valid links, consistent statuses, and no accidental loss of entries.

## 7. Status codes and lifecycle

For canonical logs, the status code is the source of truth; an emoji may follow as a display marker. Never count or infer status from emoji alone.

| Code | Status |
|---|---|
| `OPEN` | Open |
| `IN_PROGRESS` | In Progress |
| `DEFERRED` | Deferred |
| `DEFERRED_STUDY` | Deferred for further study |
| `DEFERRED_REVIEW` | Deferred for further review |
| `WONT_IMPLEMENT` | Won't Implement |
| `OPEN_PARTIAL` | Open (partial) |
| `APPROVED` | Approved |
| `RESOLVED` | Resolved |
| `ALIGNED` | Aligned |

Status summaries count every code, including zero counts, and show a grand total.

Every issue follows these five stages where the project's workflow applies:

1. **Record and evaluate:** capture the issue, severity, priority, and phase.
2. **Plan and approve:** define tasks and obtain the required approval before implementation.
3. **Implement and update:** complete approved tasks and record the update-log entry.
4. **Test and verify:** document results and verify closure criteria.
5. **Close and align:** update issue status and synchronize affected workplans/docs.

For canonical logs, use these evidence-gated transitions: `OPEN → APPROVED` after task definition and explicit approval; `APPROVED → IN_PROGRESS` when implementation starts; `IN_PROGRESS → RESOLVED` only after tasks and closure criteria are verified; `RESOLVED → ALIGNED` after required documentation synchronization. A transition to a deferred, study, review, won't-implement, or partial state needs a recorded rationale. Deferred issues may return to `OPEN` or `APPROVED` when work resumes. Reopen `RESOLVED`, `ALIGNED`, or `WONT_IMPLEMENT` issues as `OPEN` only when new evidence, recurrence, or a changed decision justifies it; record the reason and create a separate issue if the new work is distinct. Use the target log's legend for legacy logs.

## 8. Final validation checklist

Before finishing an issue-log change, confirm:

- The correct active log was edited and its existing format was preserved.
- The issue ID is unique across the project's active log set and matches its numbering convention.
- Required date, status, severity, description, task, and resolution fields are present for that format.
- Status and severity agree with the target log's legend.
- Issue, workplan, update-log, and test-log references resolve and describe consistent work.
- Resolved status is supported by evidence; required workplan alignment is recorded where applicable.
- Required summaries were recalculated by status code; counts, priority references, table fields, and ID sequences were checked where applicable.
- No unrelated entries or historical content were removed or rewritten.
- Required workplan, update log, test log, and phase report artifacts were updated when the project workflow calls for them.

Report any pre-existing structural or cross-reference defects separately from defects introduced by the current edit. Do not silently broaden the task to repair unrelated history.
