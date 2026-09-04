@echo off
setlocal EnableExtensions

rem ============================================================
rem  run_action_log.bat
rem  (1) DEPLOY - copy run-ready files (index.html, css\, js\) to the
rem      Z: deploy folder. action.json / setup.json are NOT copied.
rem      If the source dev folder is missing, the copy is skipped.
rem  (2) SERVE  - start a local HTTP server from the Z: folder and
rem      open index.html in the browser. Auto-picks a free port if
rem      8000 is already held by a stale server.
rem  Linear flow - every step prints to the screen; always pauses.
rem ============================================================

set "SRC=C:\Users\qinghua.song\DSAI\workbuddy\action-log"
set "DST=Z:\7. Engineering\01-Eng Mgmt\01 Action Log"
set "PORT=8000"

echo ============================================================
echo  ActionTracker - deploy + launch
echo ============================================================
echo  Source : %SRC%
echo  Deploy : %DST%
echo  Port   : %PORT% (auto-advances if busy)
echo ============================================================
echo.

echo [1/2] Deploying run-ready files...
if not exist "%SRC%\" (
  echo   [SKIP] Source folder not found: %SRC%
  echo   Will serve whatever already exists on Z:.
) else (
  if not exist "%DST%\" (
    echo   Creating destination: %DST%
    mkdir "%DST%" 2>nul
  )
  if exist "%DST%\" (
    if exist "%DST%\index.html" del /q "%DST%\index.html"
    if exist "%DST%\css" rmdir /s /q "%DST%\css"
    if exist "%DST%\js"  rmdir /s /q "%DST%\js"
    xcopy "%SRC%\index.html" "%DST%\" /y /q >nul && echo   OK: index.html
    if exist "%SRC%\css" ( xcopy "%SRC%\css" "%DST%\css\" /e /i /y /q >nul && echo   OK: css\ ) else echo   WARN: css\ missing in source
    if exist "%SRC%\js"  ( xcopy "%SRC%\js"  "%DST%\js\"  /e /i /y /q >nul && echo   OK: js\  ) else echo   WARN: js\ missing in source
    echo   NOTE: action.json / setup.json are NOT copied.
  ) else (
    echo   ERROR: could not create %DST% - check the Z: drive is mapped.
  )
)
echo.

echo [2/2] Preparing local server from: %DST%
if not exist "%DST%\" (
  echo   ERROR: deploy folder missing: %DST%
  goto :done
)

echo   Deploy folder contents:
dir "%DST%" /b 2>nul
echo.

rem --- find a free port (skip a port held by a stale server) ---
:portloop
netstat -ano 2>nul | findstr /i "LISTENING" | findstr /i ":%PORT% " >nul
if errorlevel 1 goto :portfree
echo   Port %PORT% busy - trying next.
set /a PORT=PORT+1
if %PORT% gtr 8015 (
  echo   ERROR: no free port in 8000-8015. Close other servers, then retry.
  goto :done
)
goto :portloop
:portfree
echo   Using port: %PORT%
echo.

rem --- find python interpreter (plain cmd may lack conda's python) ---
set "PY="
for %%e in (python python3 py) do (
  if not defined PY ( where %%e >nul 2>nul && set "PY=%%e" )
)
if not defined PY (
  for %%p in (
    "%LOCALAPPDATA%\anaconda3\python.exe"
    "%USERPROFILE%\anaconda3\python.exe"
    "%USERPROFILE%\miniconda3\python.exe"
    "%ProgramData%\Anaconda3\python.exe"
    "C:\Python312\python.exe"
    "C:\Python311\python.exe"
    "C:\Python310\python.exe"
    "C:\Python39\python.exe"
  ) do ( if not defined PY ( if exist %%p set "PY=%%~p" ) )
)
if not defined PY (
  echo   ERROR: no Python interpreter found.
  echo   Searched PATH and common Anaconda/Miniconda/CPython locations.
  echo   If you use Anaconda, run this .bat from an Anaconda Prompt, or add python to PATH.
  goto :done
)
echo   Using interpreter: %PY%
"%PY%" --version
echo.

rem --- start the server in its own window (stays open on error) ---
echo   Starting local HTTP server on port %PORT% ...
echo   (a window titled "ActionLogServer" will open and stay open)
start "ActionLogServer" /D "%DST%" cmd /k ""%PY%" -m http.server %PORT%"
timeout /t 3 >nul 2>nul
netstat -ano 2>nul | findstr /i "LISTENING" | findstr /i ":%PORT% " >nul
if not errorlevel 1 (
  echo   Server is now listening on port %PORT%.
) else (
  echo   WARNING: server did not start listening on port %PORT%.
  echo   Check the "ActionLogServer" window for the Python error.
  echo   Manual check - run from an Anaconda/cmd prompt:
  echo     cd /d "%DST%"
  echo     "%PY%" -m http.server %PORT%
)
echo   Opening http://localhost:%PORT%/index.html
start "" "http://localhost:%PORT%/index.html"
echo.
echo ============================================================
echo  ActionTracker launched
echo  URL : http://localhost:%PORT%/index.html
echo  From: %DST%
echo ------------------------------------------------------------
echo  IMPORTANT - your browser may serve a CACHED page.
echo  After EVERY file update, press   Ctrl + Shift + R   (hard refresh).
echo  Notes:
echo   - Reads action.json / setup.json from the Z: deploy folder.
echo   - action.json / setup.json are NOT deployed by this script.
echo   - The "ActionLogServer" window must stay open while using the app.
echo  To stop: close the "ActionLogServer" command window.
echo ============================================================
echo.

:done
echo [END] Script complete.
echo.
echo Press any key to close this window...
pause
