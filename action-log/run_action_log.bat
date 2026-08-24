@echo off
setlocal enabledelayedexpansion

rem ============================================================
rem  run_action_log.bat
rem  1. Copy index.html + css/styles.css + js/* (7 modules) + setup.json
rem     (WorkBuddy -> Desktop folder)
rem     NOTE: action.json is intentionally NOT copied, so your
rem           real data on the desktop is preserved.
rem     Mirrors the subfolder layout (css/, js/) introduced by the
rem     restructure, so the copied index.html resolves its assets.
rem  2. Ensure a local HTTP server is running on PORT.
rem     - already listening -> leave it alone
rem     - not listening      -> start one in the Desktop folder
rem  3. Open the page in the default browser.
rem
rem  Edit the three paths/values below if your folders differ.
rem ============================================================

rem --- Configuration -----------------------------------------
set "SRC=C:\Users\franklin.song\WorkBuddy\2026-08-12-16-57-22"
set "DST=C:\Users\franklin.song\desktop\twrp c4b\dsai\action_log"
set "PORT=8000"

rem Set FORCE_RESTART=1 to always kill any server on PORT first
rem (use this only if a stale server serves the wrong folder).
set "FORCE_RESTART=0"
rem ----------------------------------------------------------

rem --- choose python interpreter (python, else py launcher) --
set "PY=python"
where python >nul 2>nul || set "PY=py"
where %PY% >nul 2>nul || (echo ERROR: neither python nor py found on PATH. & pause & exit /b 1)

rem --- 1. copy managed files (mirror subfolder layout) -------
if not exist "%DST%" ( mkdir "%DST%" )
if not exist "%DST%\css" ( mkdir "%DST%\css" )
if not exist "%DST%\js" ( mkdir "%DST%\js" )
echo Copying managed files to: %DST%
copy /Y "%SRC%\index.html" "%DST%\index.html"
copy /Y "%SRC%\css\styles.css" "%DST%\css\styles.css"
copy /Y "%SRC%\js\core.js" "%DST%\js\core.js"
copy /Y "%SRC%\js\editor.js" "%DST%\js\editor.js"
copy /Y "%SRC%\js\render.js" "%DST%\js\render.js"
copy /Y "%SRC%\js\settings.js" "%DST%\js\settings.js"
copy /Y "%SRC%\js\report.js" "%DST%\js\report.js"
copy /Y "%SRC%\js\io.js" "%DST%\js\io.js"
copy /Y "%SRC%\js\bootstrap.js" "%DST%\js\bootstrap.js"
copy /Y "%SRC%\setup.json" "%DST%\setup.json"

rem --- 2. server check ---------------------------------------
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
    echo Starting local HTTP server on port %PORT% in: %DST%
    start "ActionLogServer" /D "%DST%" %PY% -m http.server %PORT%
    timeout /t 2 >nul
)

rem --- 3. open the page --------------------------------------
echo Opening http://localhost:%PORT%/index.html
start "" "http://localhost:%PORT%/index.html"

echo.
echo Done. If the page shows old/default data, press Ctrl+Shift+R to hard-refresh.
pause
