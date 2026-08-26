@echo off
setlocal EnableDelayedExpansion

rem ============================================================
rem  run_action_log.bat
rem  Launches the ActionTracker app from THIS folder (the folder
rem  the .bat lives in) using a local HTTP server — NO file copy.
rem
rem  The app also works by double-clicking index.html directly
rem  (file:// mode shows a startup modal to pick action.json), but the
rem  local server gives the smoothest read/write access to action.json /
rem  setup.json in this folder and auto-loads them on startup.
rem
rem  Edit PORT below if 8000 is already taken.
rem ============================================================

rem --- Configuration -----------------------------------------
set "ROOT=%~dp0"
set "PORT=8000"
rem Set FORCE_RESTART=1 to always kill any server on PORT first
rem (use this only if a stale server serves the wrong folder).
set "FORCE_RESTART=0"
rem ----------------------------------------------------------

rem --- choose python interpreter (python, else py launcher) --
set "PY=python"
where python >nul 2>nul || set "PY=py"
where %PY% >nul 2>nul || (echo ERROR: neither python nor py found on PATH. & pause & exit /b 1)

rem --- server check -----------------------------------------
set "RUNNING=0"
for /f "tokens=*" %%a in ('netstat -ano 2^>nul ^| findstr /i "LISTENING" ^| findstr /i ":%PORT% "') do set "RUNNING=1"

if "%FORCE_RESTART%"=="1" (
    if "%RUNNING%"=="1" (
        echo FORCE_RESTART: stopping existing server on port %PORT% ...
        for /f "tokens=5" %%p in ('netstat -ano 2^>nul ^| findstr /i "LISTENING" ^| findstr /i ":%PORT% "') do taskkill /PID %%p /F >nul 2>nul
        set "RUNNING=0"
    )
)

if "%RUNNING%"=="1" (
    echo Local server already running on port %PORT% -- leaving it as is.
) else (
    echo Starting local HTTP server on port %PORT% in: %ROOT%
    start "ActionLogServer" /D "%ROOT%" %PY% -m http.server %PORT%
    timeout /t 2 >nul
)

rem --- open the page --------------------------------------
echo Opening http://localhost:%PORT%/index.html
start "" "http://localhost:%PORT%/index.html"

echo.
echo ============================================================
echo  ActionTracker launched
echo  URL : http://localhost:%PORT%/index.html
echo ------------------------------------------------------------
echo  IMPORTANT - your browser may serve a CACHED page.
echo  After EVERY file update, press   Ctrl + Shift + R   (hard refresh).
echo  (macOS: Cmd + Shift + R^)
echo  Notes:
echo   - Reads action.json / setup.json from THIS folder ^(the .bat folder^).
echo   - If you see default/sample data, hard-refresh first.
echo   - If it still shows sample data, check that action.json exists here.
echo  To stop: close the "ActionLogServer" command window.
echo ============================================================
echo.
echo Press any key to close this window...
pause
