# Action Log — User Manual: How to Run

> **Action Log** (a.k.a. *ActionTracker*) is a single-page web app for tracking project actions.
> This manual explains how to start it in different situations. Pick the case that matches you.

## Quick reference

| You are…                              | Run this                  | From where                                  | Requires                |
|---------------------------------------|---------------------------|---------------------------------------------|-------------------------|
| Developer deploying an update         | `run_action_log.bat`      | dev folder                                  | Python on PATH          |
| Anyone, no Python installed           | `run_action_log_ps.bat`   | dev folder **or** Z: folder                 | Windows only (.NET built-in) |
| Team member (end user)                | `run_action_log_ps.bat`   | Z: shared folder                            | Mapped Z: drive         |
| Quick read-only look                  | open `index.html`         | any folder                                  | just a browser          |

The Z: deploy folder is:\
`Z:\7. Engineering\01-Eng Mgmt\01 Action Log`

The dev folder is:\
`C:\Users\qinghua.song\DSAI\workbuddy\action-log`

---

## Case 1 — Developer: deploy to Z: and launch (full update)

Use this when you changed the code (`index.html`, `css\`, `js\`) and want to push it to the shared Z: drive.

1. Open the **dev folder**: `C:\Users\qinghua.song\DSAI\workbuddy\action-log`
2. Double-click **`run_action_log.bat`**.
3. It copies `index.html`, `css\`, `js\`, and the launcher trio to the Z: folder, then starts a local server and opens the app in your browser.
4. Keep the **"ActionLogServer"** window open while using the app. Close it to stop.

> Requires **Python** on PATH. If it says *"no Python interpreter found"*, use Case 2 instead.

---

## Case 2 — No Python? Use the PowerShell launcher (recommended for most)

This uses Windows' built-in `.NET` web server — **no Python, no install**.

1. Double-click **`run_action_log_ps.bat`** (same folder).
2. It runs `run_action_log.ps1`, which starts the server and opens the app automatically.
3. Press **Ctrl+C** in that window to stop the server.

You can run this from the **dev folder** (it deploys to Z: first) **or directly from the Z: folder** (it just serves what is already there).

---

## Case 3 — End user: run directly from the Z: shared drive

This is the normal way team members use the app. Nothing to install.

1. Make sure the **Z: drive is mapped** (network drive to the shared location).
2. Open `Z:\7. Engineering\01-Eng Mgmt\01 Action Log`.
3. Double-click **`run_action_log_ps.bat`**.
4. The app launches from Z: and opens in the browser.

> `run_action_log.bat` also works from Z:, but it needs Python. Prefer the `_ps` version for end users.

---

## Case 4 — Just open the file (file://, read-only quick look)

- Double-click **`index.html`** from Z: or the dev folder.
- Good for a **quick read-only view** with zero setup.
- **Limitations in `file://` mode:** the browser blocks some features — e.g. "save picture to folder" (needs a server context) and clicking `file://` links. For full functionality, use Case 2 or 3.

---

## Customizing

| Goal                    | How                                                                 |
|-------------------------|---------------------------------------------------------------------|
| Different port (ps1)    | `.\run_action_log.ps1 -Port 8080`                                    |
| Different folder (ps1)  | `.\run_action_log.ps1 -Dst "D:\some\folder"`                         |
| Different port (bat)    | edit `set "PORT=8000"` near the top of `run_action_log.bat`         |

---

## Troubleshooting

- **Port busy** → the server auto-tries 8001…8015. If all are busy, close other servers or set a fixed port with `-Port`.
- **Z: not mapped** → map the network drive first, or pass `-Dst "real\path"` to the ps1.
- **Browser shows an old page** → press **Ctrl+Shift+R** (hard refresh) to bypass the cache.
- **"No Python interpreter found"** → use `run_action_log_ps.bat` instead.
- **Server window closed** → the app stops; re-run the launcher.

---

## Saving & working folder (read this before you lose work)

Action Log never auto-saves. You decide when to write your data to disk.

**Where the Save buttons are**
- **Save Actions** — writes `action.json` (the data). Disabled until you make a change.
- **Save Settings** — writes `setup.json` (the UI config). Disabled until you change a setting.
- Both live in the **right panel (Quick Actions)**. The top-bar **⋯** menu no longer has Save buttons — use the right panel or the keyboard.
- **Inline action editor** — there is **no Save button at the top of the editor** either. As you edit a field inline, the change is held in memory and is written into the data automatically the moment you click **Save Actions** / **Save Settings** or press **Ctrl/Cmd+S**. Switching to another action also keeps your edits (they are flushed before the switch). The only save controls are the right panel and the keyboard shortcuts above.
- Keyboard: **Ctrl/Cmd + S** = Save Actions · **Ctrl/Cmd + Shift + S** = Save Settings.

**The Working Folder (where files are written)**
- Click **Select Working Folder** (right panel) or **Working folder…** (⋯ menu). A popup shows the current folder and a **Choose folder…** button.
- Setting the folder does **not** save anything — it only tells Save where to write.
- You can pick **any drive** (it is not locked to Z:). Use a different folder per project.
- The folder is remembered by the browser (Chromium) between sessions.
- The Working Folder popup also shows the **default deploy folder** (`Z:\7. Engineering\01-Eng Mgmt\01 Action Log` — the folder the launcher serves the app from). That line is a **read-only reference** to help you match the status-bar folder name to the real on-disk location; it does **not** take part in saving. You may choose any folder — the chosen working folder need not be that deploy folder.
- **Click-to-copy:** in that popup, click the deploy-path text or the **Copy** button to copy the full path to your clipboard (a `✓ Copied` label flashes and a toast confirms). On `file://` / Firefox the app falls back to a compatible copy method automatically.

**File links — display is cleaned automatically**
- When you paste a `file:///` folder/file URL (or a Windows path like `Z:\…`) into the **File links → Add link** box, the link chip shows a **clean path** — no `file:///` prefix and no `%20` escapes (e.g. `Z:\7. Engineering\01-Eng Mgmt\03 Master List\01-PPP`). The link still opens the real file/folder on click; only the *display* is prettified. Web URLs keep showing their file name.

**Browser limits — why a status bar badge exists**
| Browser / mode            | Working folder picker | Save behaviour                                            |
|---------------------------|-----------------------|-----------------------------------------------------------|
| Chromium (Edge/Chrome/Brave) over `http(s):` or `file://` | Yes | Writes `action.json` / `setup.json` **directly into the chosen folder** — no re-prompt |
| Firefox                   | No                    | **Downloads** the file — save it next to `index.html`    |
| `file://` double-click (Chrome) | No              | **Downloads** the file — save it next to `index.html`    |

The status bar on the right shows a badge: **✓ direct disk write** (Chromium) or **⚠ download-only** (Firefox / file://). If it says download-only, Save will drop a file in your Downloads folder — move it next to `index.html` so the app loads it next time.

> **Why only the folder *name* shows, not the full path:** browsers refuse to reveal the real OS path of a chosen folder (security). The status bar shows the folder name plus the file name and the last save time. That is all the browser exposes.

**The status bar (bottom of the screen) tells you at a glance**
- Source dot — amber **●** means you have **unsaved changes**; green/blue/grey means the loaded source.
- **📁 folder name** — the current working folder, or *Not set*.
- **Saved YYYY-MM-DD HH:MM:SS** — time of the last successful save, or *Not saved yet*.
- **● unsaved** — appears whenever there are changes to save.

**Switching panels with unsaved changes**
- If you try to switch perspective (e.g. Actions → Reports) or open Settings while there are unsaved changes, a message pops up: *"You have unsaved changes. Save before switching to another panel."* Click **OK** to stay, then use Save. There is no auto-save.

---

## Notes on data

- `action.json` / `setup.json` are **NOT** copied by the launchers. They hold your live data and UI config and are git-ignored. They live in whatever folder the app runs from (Z: for the team).
- The dev folder ships with **embedded seed data**, so the app works even before any `action.json` exists.

---

*Files involved:* `run_action_log.bat` (Python launcher), `run_action_log_ps.bat` (PowerShell launcher stub), `run_action_log.ps1` (PowerShell server). All three are copied to Z: automatically during deploy.
