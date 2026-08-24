@echo off
setlocal enabledelayedexpansion
rem ============================================================
rem  archive_cleanup.bat
rem  Move non-required dev/orphan files into the arch/ folder.
rem  Safe to re-run (skips files already moved).
rem ============================================================
set "ROOT=C:\Users\franklin.song\WorkBuddy\2026-08-12-16-57-22"
set "ARC=%ROOT%\arch"
if not exist "%ARC%" mkdir "%ARC%"
echo Archiving non-required files into: %ARC%
for %%F in (syntaxcheck.js _b1_loadcheck.js action-panel-example.html index.html.bak overview.md) do (
  if exist "%ROOT%\%%F" (
    move /Y "%ROOT%\%%F" "%ARC%\%%F" >nul && echo   moved  %%F
  ) else (
    echo   skip   %%F  (already archived or missing)
  )
)
echo.
echo Remaining files in root:
dir /b "%ROOT%"
pause
