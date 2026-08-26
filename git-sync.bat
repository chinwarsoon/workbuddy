@echo off
setlocal EnableDelayedExpansion
:: git-sync.bat - pull/push helper for the workbuddy repo (review-first)
:: Auto-detects the repo from this script's own folder.
cd /d "%~dp0" || (echo [ERROR] Cannot change to script folder & pause & exit /b 1)

:: Confirm we are inside a git working tree
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo [ERROR] This folder is not a git repository:
  echo   %CD%
  pause
  exit /b 1
)

:: Resolve current branch and its upstream (fallback: origin/<branch>)
FOR /F "tokens=*" %%b IN ('git rev-parse --abbrev-ref HEAD 2^>nul') DO SET BRANCH=%%b
FOR /F "tokens=*" %%u IN ('git rev-parse --abbrev-ref HEAD@{u} 2^>nul') DO SET UPSTREAM=%%u
if not defined UPSTREAM set "UPSTREAM=origin/%BRANCH%"

:menu
cls
echo ============================================================
echo   WorkBuddy Repo Sync
echo   Repo    : %CD%
echo   Branch  : %BRANCH%   Upstream: %UPSTREAM%
echo ============================================================
echo.
echo [1/4] Fetching from GitHub (no merge)...
git fetch origin
if errorlevel 1 (
  echo [ERROR] git fetch failed. Check network / PAT / credentials.
  pause
  goto :eof
)

echo.
echo --- A. Local uncommitted changes (git status -s) ---
git status -s
echo.
echo --- B. Commits AHEAD of GitHub  (will be PUSHED : %UPSTREAM%..%BRANCH%) ---
git log --oneline %UPSTREAM%..%BRANCH%
echo.
echo --- C. Commits BEHIND GitHub    (will be PULLED : %BRANCH%..%UPSTREAM%) ---
git log --oneline %BRANCH%..%UPSTREAM%
echo.
echo --- D. Net line diff vs GitHub  (git diff --stat %BRANCH% %UPSTREAM%) ---
git diff --stat %BRANCH% %UPSTREAM%
echo.
echo ============================================================
echo   Choose an action (read the notes first):
echo ------------------------------------------------------------
echo    1) Pull only      git pull --ff-only   (FAST-FORWARD ONLY)
echo         Use when B is empty (no local commits) and you only want
echo         GitHub's changes. Fails if branches have diverged.
echo    2) Push only      git push             (requires UP-TO-DATE)
echo         Use only when C is empty (GitHub has nothing new) and you
echo         simply want to upload your already-committed local commits.
echo    3) Pull then Push git pull --ff-only + git push
echo         One-shot sync for the simple case: GitHub first, then you.
echo         Still fails if diverged (ff-only cannot merge forks).
echo    4) Commit local changes, then Push   (git add -A + commit + push)
echo         Commits your UNCOMMITTED work, then pushes. If C is NOT
echo         empty (GitHub has other changes) the push will be REJECTED -
echo         use option 7 instead to rebase onto GitHub first.
echo    5) Show full diff  git diff %BRANCH% %UPSTREAM%
echo         Read-only. Inspect exactly what differs before deciding.
echo    6) Refresh / re-check   git fetch again, show menu anew
echo         Re-reads the latest GitHub state (handy after a push).
echo    7) Commit + Pull --rebase + Push  (RECOMMENDED for forks)
echo         Commits your local work, then REBASES it on top of GitHub's
echo         latest (rewrites local history linearly, no merge commit),
echo         then pushes. Use this when BOTH B and C are non-empty
echo         (you and GitHub both have new commits). Resolve any conflict
echo         with git add ^<file^> then git rebase --continue; abort with
echo         git rebase --abort (safe - returns to before the rebase).
echo    0) Exit
echo ============================================================
set /p CHOICE="Enter choice: "

if "%CHOICE%"=="1" goto pull
if "%CHOICE%"=="2" goto push
if "%CHOICE%"=="3" goto pullpush
if "%CHOICE%"=="4" goto commitpush
if "%CHOICE%"=="5" (
  echo.
  git --no-pager diff %BRANCH% %UPSTREAM%
  echo.
  pause
  goto menu
)
if "%CHOICE%"=="6" goto menu
if "%CHOICE%"=="7" goto commitrebasepush
if "%CHOICE%"=="0" goto :eof
echo Invalid choice.
pause
goto menu

:pull
git pull --ff-only origin %BRANCH%
if errorlevel 1 (
  echo [ABORT] Pull failed - likely diverged. Resolve manually (e.g. git pull --rebase).
  pause
  goto menu
)
echo Pull done.
pause
goto menu

:push
git push origin %BRANCH%
if errorlevel 1 (
  echo [ABORT] Push failed.
  pause
  goto menu
)
echo Push done.
pause
goto menu

:pullpush
git pull --ff-only origin %BRANCH%
if errorlevel 1 (
  echo [ABORT] Pull failed - resolve manually before pushing.
  pause
  goto menu
)
git push origin %BRANCH%
if errorlevel 1 (
  echo [ABORT] Push failed.
  pause
  goto menu
)
echo Pull + Push done.
pause
goto menu

:commitpush
set /p MSG="Commit message: "
if "%MSG%"=="" set "MSG=chore: update workbuddy repo"
git add -A
git commit -m "%MSG%"
git push origin %BRANCH%
if errorlevel 1 (
  echo [ABORT] Push failed.
  pause
  goto menu
)
echo Commit + Push done.
pause
goto menu

:commitrebasepush
set /p MSG="Commit message: "
if "%MSG%"=="" set "MSG=chore: update workbuddy repo"
git add -A
git commit -m "%MSG%"
if errorlevel 1 (
  echo [ABORT] Commit failed - nothing committed.
  pause
  goto menu
)
git pull --rebase origin %BRANCH%
if errorlevel 1 (
  echo [ABORT] Rebase stopped due to conflict OR GitHub moved.
  echo   Resolve conflicts, then:  git add ^<file^>  &&  git rebase --continue
  echo   Or to undo safely:       git rebase --abort
  pause
  goto menu
)
git push origin %BRANCH%
if errorlevel 1 (
  echo [ABORT] Push failed.
  pause
  goto menu
)
echo Commit + Rebase + Push done.
pause
goto menu
