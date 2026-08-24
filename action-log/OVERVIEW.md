# ActionTracker 文件清理与本地启动改造 — 概览

> 本回合 Bash / PowerShell 均不可用（"Connection lost"），凡需 shell 的操作已改为「提供命令由你本地执行」，与你平时手动跑命令的习惯一致。

## 本次已完成的改动（不依赖 shell）

### 1. `action-log/run_action_log.bat` — 重写
- 移除「复制到桌面」整段逻辑（`SRC` / `DST` / 9 行 `copy` 全部删除）。
- 改用 `%~dp0`（.bat 所在目录 = `action-log\`）作为根，**就地**启动本地 HTTP 服务，**不再复制任何文件**，因此天然吃到本文件夹的真实 `action.json` / `setup.json`。
- 保留端口占用检测 + `FORCE_RESTART=1` 兜底 + 打开 `http://localhost:8000/index.html` + 硬刷新提示。

### 2. `action-log/js/io.js` — `autoLoad()` 的 `file://` 分支改造
- 满足「**HTML 也可直接双击打开，无需本地服务器**」：双击 `index.html`（file://）时先尝试 `fetch('./action.json')`；
  - Firefox 等允许同目录读取 → 直接加载真实数据；
  - Chrome 拦截 fetch → **静默回退到内置样例数据**，不再弹出「选择 JSON 文件」阻塞弹窗。
- 状态栏提示用户可用顶栏「Set data folder / Import」随时加载真实 `action.json`。
- `http://` 服务模式行为不变（仍 fetch `action.json` / `setup.json`）。

### 3. `action-log/assets/pictures/.gitkeep` — 新建
- 让图片审查功能（`writePictureToAssets`）有真实落地目录；图片文件本身已被 `.gitignore` 忽略，仅保留文件夹占位。

## 待你在本地执行（命令见下，本回合无法代跑）

### A. 把两个退役脚本移入 `arch/`
```bat
cd /d "C:\Users\franklin.song\WorkBuddy\workbuddy\action-log"
move restructure.bat arch\
move archive_cleanup.bat arch\
```

### B. 删除两份重复副本
⚠️ **操作前请二次确认路径无误。建议先送回收站（可恢复）：**
```powershell
$shell = New-Object -ComObject Shell.Application
foreach ($p in @(
  "C:\Users\franklin.song\WorkBuddy\2026-08-12-16-57-22",
  "C:\Users\franklin.song\desktop\twrp c4b\dsai\action_log"
)) { if (Test-Path $p) { $shell.NameSpace(0xA).MoveHere($p); Write-Host "已送回收站: $p" } }
```
> 永久删除（不可恢复）命令：`rmdir /s /q "<上面的路径>"`

## 未改动项
- `seedData` 的 `schemaVersion:2` 按你的要求**保持不动**（仅内置样例，真实数据以 `action.json` 为准）。
- 顶层 `git-sync.bat` / `git-workflow-guide.md` / `README.md` 未动。
