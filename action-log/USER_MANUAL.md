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
- **While a save is running** the Save buttons show a spinner and become briefly unclickable (to block a double save). You can keep editing during the save — a slow save (e.g. over a VPN-mapped drive) captures whatever you type **up to the moment it finishes**, so nothing typed mid-save is lost. The Save Actions button also stays enabled whenever you have an unsaved inline edit, so it never ends up "disabled while the status bar says unsaved".

**The Working Folder (where files are written)**
- Click **Select Working Folder** (right panel) or **Working folder…** (⋯ menu). A popup shows the current folder and a **Choose folder…** button.
- Setting the folder does **not** save anything — it only tells Save where to write.
- You can pick **any drive** (it is not locked to Z:). Use a different folder per project.
- The folder is remembered by the browser (Chromium) between sessions.
- The Working Folder popup also shows the **default deploy folder** (`Z:\7. Engineering\01-Eng Mgmt\01 Action Log` — the folder the launcher serves the app from). That line is a **read-only reference** to help you match the status-bar folder name to the real on-disk location; it does **not** take part in saving. You may choose any folder — the chosen working folder need not be that deploy folder.
- **Click-to-copy:** in that popup, click the deploy-path text or the **Copy** button to copy the full path to your clipboard (a `✓ Copied` label flashes and a toast confirms). On `file://` / Firefox the app falls back to a compatible copy method automatically.
- **If you click Save without a folder set, the app opens this same popup for you** — pick a folder to write directly, or close it to leave your edits in memory (no file is written and no silent download happens).

**File links — display is cleaned automatically**
- When you paste a `file:///` folder/file URL (or a Windows path like `Z:\…`) into the **File links → Add link** box, the link chip shows a **clean path** — no `file:///` prefix and no `%20` escapes (e.g. `Z:\7. Engineering\01-Eng Mgmt\03 Master List\01-PPP`). The link still opens the real file/folder on click; only the *display* is prettified. Web URLs keep showing their file name.

**Browser limits — why a status bar badge exists**
| Browser / mode            | Working folder picker | Save behaviour (folder already set)                     |
|---------------------------|-----------------------|-----------------------------------------------------------|
| Chromium (Edge/Chrome/Brave) over `http(s):` or `file://` | Yes | Writes `action.json` / `setup.json` **directly into the chosen folder** — no re-prompt |
| Firefox                   | No                    | **Downloads** the file — save it next to `index.html`    |
| `file://` double-click (Chrome) | No              | **Downloads** the file — save it next to `index.html`    |

If you use Chromium but have **not yet set a working folder**, Save does **not** write to disk — it opens the Working Folder popup (see above). Choose a folder and it writes directly; close the popup and nothing is saved (you get a toast, and the app never silently downloads behind your back).

The status bar shows a capability badge with three possible states:
- **✓ Direct write** (green) — a working folder is set and Chromium can write straight to disk.
- **⚠ Set folder** (amber) — Chromium supports disk write but no folder is set yet; Save will prompt for one (or download if you skip).
- **⚠ Download-only** (amber) — Firefox / `file://` can't write to disk, so Save drops a file in your Downloads folder. Move it next to `index.html` so the app loads it next time.

> **Why only the folder *name* shows, not the full path:** browsers refuse to reveal the real OS path of a chosen folder (security). The status bar shows the folder name plus the file name and the last save time. That is all the browser exposes.

**The status bar (bottom of the screen) tells you at a glance**
- Source dot — amber **●** means you have **unsaved changes**; green/blue/grey means the loaded source.
- **📁 folder name** — the current working folder, or *Not set*.
- **Saved YYYY-MM-DD HH:MM:SS** (green) — last successful write **to disk**; **Downloaded YYYY-MM-DD HH:MM:SS** (amber) — last save fell back to a downloaded file (no working folder, or the disk write failed). On a fresh open with a file already loaded the bar shows **Loaded** (green), meaning it matches disk; **Not saved yet** only appears when nothing was ever loaded.
- **● unsaved** — appears whenever there are changes to save.
- **Saving…** (blue, with a spinner) — a save is in progress; the four Save buttons also spin and are briefly unclickable.

**Switching panels with unsaved changes**
- If you try to switch perspective (e.g. Actions → Reports) or open Settings while there are unsaved changes, a message pops up: *"You have unsaved changes. Save before switching to another panel."* Click **OK** to stay, then use Save. There is no auto-save.

---

## Filtering & sorting the detail log (ISS-62)

Each action's **Description — dated detail log** table has a small toolbar above it (Filter / sort) so you can focus on relevant rows without changing your data:

- **Type / By / Status** — pick a value to show only rows matching that action type, author, or status. Choose "— all —" to clear.
- **From / To** — narrow by the row's date.
- **Sort** — order rows by Date, Type, Action by, or Status, then toggle **↑ Asc / ↓ Desc**.
- **Clear** — resets every filter and the sort and rebuilds the log in its saved order.

These controls are **view-only**: hiding or reordering rows never changes what is saved. Filtering just hides rows on screen; sorting reorders them for display and is never written back when you Save (the saved order is always the one you arranged with the ↑/↓ buttons). While a sort is active, the ↑/↓ buttons are disabled so the two orderings don't conflict.

---

## Exporting minutes (ISS-63)

When an action is open, the inline editor's top bar (the same bar that holds the breadcrumb) shows an **Export minutes** button on the right. Click it to download a Word document (`.doc`) of that action's dated detail log — ready to drop into meeting minutes.

- **What it exports** — the action's metadata header (Project, Discipline, Status, Due, Assigned to, Created by, Created on, Dependencies) followed by the detail log as a 6-column table: **Date / Type / Action by / Due / Status / Detail**.
- **It exports the view you see** — the rows follow your current ISS-62 filter and sort: hidden rows are skipped and the on-screen order is kept. Adjust the filter/sort first if you want a different selection.
- **It captures unsaved edits** — because the export reads the live table, inline changes you've typed but not yet Saved (a row date, detail text, etc.) are included.
- **No data is changed** — exporting only reads; it never modifies your actions or the saved log order.
- **Attachments & images** — each entry's linked attachments render as clickable hyperlinks inside the Detail column (Word opens them on click).
- **`@ref` not yet expanded** — cross-references written as `@<id>` / `@img:<name>` are exported as plain text for now; resolving them to links is planned for ISS-64.

The file is named `Minutes - <action title>.doc`.

---

## Notes on data

- `action.json` / `setup.json` are **NOT** copied by the launchers. They hold your live data and UI config and are git-ignored. They live in whatever folder the app runs from (Z: for the team).
- The dev folder ships with **embedded seed data**, so the app works even before any `action.json` exists.

---

*Files involved:* `run_action_log.bat` (Python launcher), `run_action_log_ps.bat` (PowerShell launcher stub), `run_action_log.ps1` (PowerShell server). All three are copied to Z: automatically during deploy.
