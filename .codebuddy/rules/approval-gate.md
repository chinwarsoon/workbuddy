---
description: Approval gate — ask before any file, config, or repo change that was not explicitly discussed and approved in this session. Always applied.
alwaysApply: true
---

# Approval Gate (mandatory)

Root source: `AGENTS.md` §5 Rule 1 (Plan before code) and Rule 2 (No edits without approval),
operationalised by §5 Rule 18 (Ask-first).

## Definition

A change is **discussed** only when the user has, in this session, explicitly named the target
(file / path / artifact) AND the intended outcome, AND responded affirmatively to the proposal.
Inference, "obvious next step", best-practice cleanup, or implied scope do NOT count as discussed.

## Hard rules

1. Before ANY mutating action, stop and ask. Mutating actions include: create / edit / delete /
   rename / move (including move-to-`archive/`) any file; `git` add / commit / push / reset /
   checkout / branch; running build or test scripts that write files; installing or upgrading
   dependencies; changing schema or config values; and editing `AGENTS.md` itself or anything
   under `.codebuddy/`.
2. Read-only actions are always allowed and require no approval: read, grep, search, list,
   and read-only `git status`, `git diff`, `git log`, `git show`.
3. Never bundle an undiscussed change with an approved one. One proposal = one explicit decision.
4. If a defect is found while working on an approved task, STOP, report it, and propose the fix
   as its own item. Do not fix it inline "because it's clearly a bug".
5. Never assume approval from silence, a partial answer, a prior session's memory, or a standing instruction about a different file.
6. When in doubt, ask. The cost of one question is lower than one unapproved edit.
7. Work outside an approved workplan's task list requires a new proposal (see `AGENTS.md` §15).

## Required proposal format

Every request for approval must state:

- **Target file(s)** — full path(s).
- **Exact change** — what will be added / removed / modified.
- **Rationale** — why this change is needed.
- **Blast radius** — what else reads, imports, or depends on the target.
- **Rollback note** — how to undo if the change turns out wrong.