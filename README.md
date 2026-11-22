# workbuddy

`workbuddy` is a repository of engineering dashboards and shared tools for TWRP C3B2.

## Projects

| Folder | Purpose | How to run |
|---|---|---|
| `action-log/` | ActionTracker — action log web application | Open `action-log/index.html` in a browser. On the configured Windows deploy machine, run `action-log/run_action_log.bat`. |
| `english-learning/` | English learning tool with content packs and PWA support | Open `english-learning/english-learning-tool.html` in a browser. On Windows, run `english-learning/open-app.bat` for a standalone app window. |
| `MDL/` | Master Document List dashboard for TWRP C3B2 | From `MDL/`, run `node build.mjs`, then open `MDL-Dashboard.html`. |
| `PPP/` | Procurement Package Plan dashboard for TWRP C3B2 | From `PPP/`, run `node build.mjs`, then open `Procurement-Dashboard.html`. |
| `sub/` | Document Submittal Log and Monthly Submissions dashboard | From `sub/`, run `python serve.py`, then open `http://127.0.0.1:8000/`. |
| `EPC-Design-Management/` | EPC engineering and design management research and tool blueprint | Open `EPC-Design-Management/index.html` in a browser. |

## Shared folders

| Folder | Purpose |
|---|---|
| `config/` | Shared schemas |
| `docs/` | Shared standards |
| `harness-layout/` | Layout harness and checks |
| `harness-pipeline/` | Pipeline harness and checks |
| `harness-writing/` | STE prose lint and word lists |

## Other folders

| Folder | Purpose |
|---|---|
| `archive/` | Archived files kept for reference |
| `yurui/` | Small standalone HTML demo |

## Internal folders

| Folder | Purpose |
|---|---|
| `.agents/` | Agent knowledge and issue notes |
| `.git/` | Git metadata |
| `.vscode/` | Editor settings |

## Root files

| File | Purpose |
|---|---|
| `.gitattributes` | Line-ending rules |
| `.gitignore` | Files that Git must ignore |
| `AGENTS.md` | Repository rules and guidance |
| `Dashboard-UI-Design-Spec.md` | Shared dashboard UI design standard |
| `README.md` | Repository introduction (this file) |
| `git-sync.bat` | Windows review-first sync helper |
| `git-workflow-guide.md` | Git clone, commit, pull and push guide |
| `repo_issue_log.md` | Repository-wide issue log |

## Git workflow

- Use `git-sync.bat` for review-first pull and push.
- See `git-workflow-guide.md` for clone, commit, pull and push steps.
- See `AGENTS.md` for repository rules.

## Line endings

- Text files use `LF`.
- `.bat` files use `CRLF`.
- The rule is in `.gitattributes`.

## Repo-wide issues

- See `repo_issue_log.md`.
