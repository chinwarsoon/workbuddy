# Git Workflow Guide — WorkBuddy + WSL + Cross-Workstation

> Summary of how to clone, link WSL, commit to GitHub, and collaborate across
> workstations from inside WorkBuddy. Built from our session discussion.

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
| Clone (HTTPS) | `git clone https://github.com/<user>/<repo>.git` |
| Clone (SSH)   | `git clone git@github.com:<user>/<repo>.git` |
| New branch    | `git checkout -b feat/x origin/main` |
| Stage + commit| `git add . && git commit -m "feat: ..."` |
| Push          | `git push -u origin feat/x` |
| Sync          | `git fetch origin && git rebase origin/main` |
| Safe force    | `git push --force-with-lease` |
| Access WSL    | `//wsl$/Ubuntu/home/<user>/<repo>/` |

---

*Generated from session discussion — adjust paths (`franklin`, `Ubuntu`,
`dsai`) to match your actual setup.*
