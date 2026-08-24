# Git Workflow Guide — WorkBuddy + Cross-Workstation

> How to clone, commit to GitHub, and keep your local folder in sync with the
> remote from inside WorkBuddy. WSL is **optional** — if it is unavailable (e.g. a
> managed company machine), commit from **Windows PowerShell over HTTPS + PAT**
> instead (see §2b). Built from our session discussion.

---

## 1. Clone a Git repo to a local folder

WorkBuddy opens each session in a **timestamped workspace**, e.g.:

```
C:\Users\frank\WorkBuddy\2026-08-15-23-22-25\
```

Cloning puts the repo in a subfolder of whatever directory you're in:

```bash
git clone https://github.com/<user>/<repo>.git
# -> C:\Users\frank\WorkBuddy\2026-08-15-23-22-25\<repo>\
```

The folder contains:
- your project files
- a hidden `.git/` directory = the full local Git database (history, branches, config)

**Key facts:**
- Everything is **local on this machine** until you `git push`. Nothing lives in
  the cloud by WorkBuddy itself.
- The GitHub **connector** (sidebar) is *optional* — it adds issue/PR browsing.
  It is **not** required for `commit` / `push`.

### One-time auth setup (required for push)

GitHub no longer accepts passwords over HTTPS. Pick one:

**Option A — SSH key (recommended):**
```bash
ssh-keygen -t ed25519 -C "you@example.com"
# add the contents of ~/.ssh/id_ed25519.pub to GitHub:
#   GitHub → Settings → SSH and GPG keys → New SSH key
# then clone with the SSH URL:
git clone git@github.com:<user>/<repo>.git
```

**Option B — Personal Access Token (PAT):**
- Create a token with `repo` scope at GitHub → Settings → Developer settings → PAT.
- Use it **instead of your password** when Git prompts during `push`.

> **Windows-only caveat:** an SSH key created *inside* WSL is invisible to Windows
> PowerShell, so `git@github.com:...` fails with `Permission denied (publickey)`
> on a machine where WSL isn't installed. In that case **use Option B (HTTPS +
> PAT) from PowerShell** — no WSL and no Windows SSH key needed. See §2b.

Also set your identity once:
```bash
git config --global user.name  "Your Name"
git config --global user.email "you@example.com"
```

---

## 2. Link WSL and commit to GitHub

Your WSL repos are reachable from WorkBuddy via the Windows **`\\wsl$` mount**,
not by launching a Linux shell.

**Path mapping:**
```
Windows Explorer : \\wsl$\Ubuntu\home\franklin\dsai\
Git Bash         : //wsl$/Ubuntu/home/franklin/dsai/
```

We confirmed your repos live at:
```
//wsl$/Ubuntu/home/franklin/dsai/      (≈20 repos: dsai-*, fastapi-primer, ...)
```

**What works from here:**
- Read / search / edit files ✅
- `git status`, `git diff`, `git add`, `git commit` on the mount path ✅

**Important caveats:**
- The `wsl` command (and `wsl --list`, launching a Linux shell) can be **blocked
  by the sandbox security policy** ("System Tools" disabled). When that happens,
  you cannot run Linux-native tooling (e.g. a venv created inside WSL) from here —
  only Windows-side file I/O on those files.
- Editing through the `\\wsl$` mount can have line-ending / permission quirks.

**Recommendation:** For committing a *Linux-native* repo, prefer running Git
**inside WSL** (your normal WSL terminal) so the repo's metadata and line endings
stay consistent. Use WorkBuddy's mount access mainly for browsing, searching, and
light edits. If you must commit via the mount, run `git status` right after to
confirm nothing unexpected changed.

---

## 2b. Windows-only workstation — PowerShell + HTTPS + PAT (no WSL)

On a managed/company machine **WSL may be unavailable**, and the SSH key you set
up lives *inside* WSL — so `git@github.com:<user>/<repo>.git` fails with
`Permission denied (publickey)` when run from Windows PowerShell. Solution: commit
**from Windows PowerShell over HTTPS using a Personal Access Token (PAT)**. No
WSL, no Windows SSH key required.

**One-time: create a PAT**
- GitHub → avatar → **Settings → Developer settings → Personal access tokens → Tokens (classic)**
- **Generate new token** (set an expiry, check the **`repo`** scope), then **copy
  the token** (shown only once — store it safely).

**Clone / commit / push from PowerShell**
```powershell
cd C:\Users\franklin.song\WorkBuddy          # your stable working dir
git clone https://github.com/chinwarsoon/workbuddy.git
cd workbuddy
git checkout main
git pull --ff-only
# ... edit files (e.g. copy a project into action-log/) ...
git add action-log                           # stage only what you changed
git status                                   # verify .workbuddy / secrets are NOT staged
git commit -m "feat: ..."
git push origin main                         # Git Credential Manager reuses the cached PAT
```
- When Git prompts: **Username** = your GitHub login (`chinwarsoon`);
  **Password** = the **PAT** (not your account password; input is not echoed).
- After the first push, **Git Credential Manager (GCM)** caches the PAT — later
  `push`/`pull` usually need no re-entry.

**Clear a cached/bad credential** (auth fails after a password change or typo):
```powershell
cmdkey /delete:git:https://github.com
```
Then re-run `git push` and re-enter Username + PAT.

**Corporate proxy / network blocks** (timeout or connection refused to github.com):
```powershell
git config --global http.proxy  http://<proxy-host>:<port>
git config --global https.proxy http://<proxy-host>:<port>
```

---

## 3. Share a project across workstations (same login, different PC)

This is the part that surprised us earlier — worth being explicit:

- **Chat history is NOT synced.** Each session's conversation lives only on the
  machine where it happened.
- **Session folders are NOT synced.** The timestamped
  `C:\Users\frank\WorkBuddy\<date-time>\` folders are per-machine, per-session.
  A repo cloned in one session does not appear in another session — even on the
  same PC, and certainly not on a different one.
- **Identity/memory files are local** (`~/.workbuddy/` — SOUL.md, USER.md, etc.).
  They don't travel with your account automatically.

**So how DO you share work across machines?**

The repo on **GitHub is the shared artifact** — not the local folder. The flow:

```
Workstation A                 GitHub (source of truth)          Workstation B
clone ───────────────▶  push  ───────────────▶  pull / clone
   ↑                                                            │
   └──────────────────────  pull  ◀───────────────────────────┘
```

Steps on each new workstation:
```bash
git clone git@github.com:<user>/<repo>.git
cd <repo>
# ... work, then:
git add .
git commit -m "feat: ..."
git push
```
On the other machine: `git pull` to get the latest.

**To also carry over your identity/memory files**, copy
`C:\Users\frank\.workbuddy\` between machines — or, better, point your working
   directory at a **cloud-synced folder** (OneDrive / Dropbox) so context persists.

---

## 3b. Keep your local folder and GitHub in sync

The local clone and the GitHub remote drift apart the moment either side changes.
Treat **GitHub (`main`) as the source of truth** and sync explicitly.

**Pull before you start, push when you stop:**
```powershell
cd C:\Users\franklin.song\WorkBuddy\workbuddy
git checkout main
git pull --ff-only          # fast-forward only; refuses if it would rewrite history
# ... make & commit changes ...
git push origin main
```

**Verify the two are in sync:**
```powershell
git status                  # "nothing to commit, working tree clean" => local == last commit
git log --oneline -3        # compare local HEAD with GitHub's main
git fetch origin
git rev-parse HEAD origin/main    # identical hashes on both => fully synced
```
- If `git status` shows untracked/modified files, they are **not** on GitHub yet —
  `git add` + `git commit` + `git push` to sync them.
- If `git pull --ff-only` is refused, someone pushed conflicting history; fetch and
  inspect (`git log --oneline origin/main..HEAD`) before a normal merge/pull.
- After pushing, confirm on GitHub: the file's "last commit" updates and
  `https://github.com/chinwarsoon/workbuddy/action-log` reflects your changes.

## 3c. Automated review-first sync — `git-sync.bat` (Windows, no WSL)

For a one-command, **review-before-you-push** flow on a Windows-only machine, use
the bundled `git-sync.bat` at the repo root
(`C:\Users\franklin.song\WorkBuddy\workbuddy\git-sync.bat`).

It runs **`git fetch` only (no merge)**, then prints a side-by-side comparison so
you decide what to do:

| Block | Meaning | Command |
|-------|---------|---------|
| A | Local uncommitted changes | `git status -s` |
| B | Commits **ahead** of GitHub → will be **pushed** | `git log origin/main..HEAD` |
| C | Commits **behind** GitHub → will be **pulled** | `git log HEAD..origin/main` |
| D | Line-level diff vs GitHub | `git diff --stat HEAD origin/main` |

Then a menu lets you choose:
`1` pull only · `2` push only · `3` pull then push · `4` commit local changes then push · `5` full diff · `6` re-fetch · `0` exit.

**Usage**
```powershell
cd C:\Users\franklin.song\WorkBuddy\workbuddy
.\git-sync.bat
```
or just double-click the file in Explorer. It auto-detects the repo via
`cd /d "%~dp0"`, so it works from any location and has **no hardcoded path**.

**Notes**
- Pull uses `git pull --ff-only`, so it refuses if a pull would rewrite history
  (same safety as §3b). Resolve manually with `git pull --rebase` if needed.
- Option `4` stages everything with `git add -A`. If you do **not** want
  `git-sync.bat` itself committed, add it to `.gitignore`, or stage specific
  files and use option `2` (push only).
- The script is currently untracked. Commit it if you want it shared in the repo
  (portable — no machine-specific paths); otherwise keep it local.
- **`git-sync.bat` is the single sync entry point — do NOT create a separate
  `git-commit-push.bat`.** Its menu option `4` already does stage + commit + push,
  and option `2` does push-only, both with the same `--ff-only` safety. A second
  dedicated commit-push script would be redundant. For a quick one-shot without the
  menu, run the manual commands in §3b instead of writing a new `.bat`.

---

## 4. Recommendations for a clean collaboration workflow

Follow these so the repo — not the session folder — is what everyone shares.

### Repository as single source of truth
- Never treat a WorkBuddy timestamped session folder as "the project." Clone from
  GitHub onto each machine. The remote repo is what travels between workstations.

### Use a stable, persistent working directory
- Instead of relying on the auto-generated timestamped folder, clone into a fixed
  path you control (e.g. a `Projects/` folder or a cloud-synced dir). This keeps
  the repo in the same place across sessions.

### Branching strategy (trunk-based — good for most)
```
main ─────●────●────●────●────●───   (always deployable)
           \  /      \  /
            ●         ●              (short-lived feature branches)
```
- Name branches by intent: `feat/user-auth`, `fix/login-redirect`, `chore/deps`.
- Branch from the latest `main`:
  ```bash
  git fetch origin
  git checkout -b feat/my-feature origin/main
  ```

### Commits
- **Atomic** — one logical change per commit, independently revertable.
- **Conventional** — `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`.
  ```bash
  git commit -m "feat: add retry logic to GitHub API client"
  ```

### Before opening a PR
```bash
git fetch origin
git rebase -i origin/main      # squash fixups, reword messages
git push --force-with-lease    # safe force-push to YOUR branch only
```
- **Never force-push shared branches** (`main`, `develop`). Use `--force-with-lease`,
  never plain `--force`.

### Merging
```bash
git checkout main
git merge --no-ff feat/my-feature     # or squash-merge via PR
git branch -d feat/my-feature
git push origin --delete feat/my-feature
```

### Cross-workstation hygiene
- Pull before you start, push when you stop — keeps both machines in sync.
- For WSL-native repos, commit inside WSL; for Windows-native repos, commit from
  WorkBuddy. Don't mix the two on the same repo to avoid line-ending churn.
- Use **SSH keys** on every workstation so `push`/`pull` never blocks on auth.

---

## Quick reference

| Task | Command |
|------|---------|
| Clone (HTTPS) | `git clone https://github.com/<user>/<repo>.git` (PAT as password) |
| Clone (SSH)   | `git clone git@github.com:<user>/<repo>.git` (needs WSL/Windows SSH key) |
| New branch    | `git checkout -b feat/x origin/main` |
| Stage + commit| `git add . && git commit -m "feat: ..."` |
| Push          | `git push -u origin feat/x` |
| Sync local→remote | `git checkout main && git pull --ff-only` then `git push origin main` |
| Review-first sync | `.\git-sync.bat` (fetch → compare A/B/C/D → pick pull/push) |
| Verify synced | `git rev-parse HEAD origin/main` (same hash = in sync) |
| Clear cached cred | `cmdkey /delete:git:https://github.com` (re-enter PAT next push) |
| Safe force    | `git push --force-with-lease` |
| Access WSL    | `//wsl$/Ubuntu/home/<user>/<repo>/` (only if WSL installed) |

---

*Generated from session discussion. WSL is optional — on a Windows-only (no WSL)
machine, use PowerShell + HTTPS + PAT (§1 Option B, §2b). Adjust paths
(`franklin.song`, `Ubuntu`, `dsai`) to match your actual setup.*
