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
echo   Choose an action:
echo    1) Pull only         (git pull --ff-only origin %BRANCH%)
echo    2) Push only         (git push origin %BRANCH%)
echo    3) Pull then Push
echo    4) Commit local changes, then Push
echo    5) Show full diff    (git diff %BRANCH% %UPSTREAM%)
echo    6) Refresh / re-check (fetch again)
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
