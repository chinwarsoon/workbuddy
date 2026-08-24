@echo off
rem ActionTracker restructure: move modules into subfolders, then syntax-check.
rem Run from the project root: double-click, or in a terminal: .\restructure.bat
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo [1/3] Creating subfolders...
if not exist css mkdir css
if not exist js mkdir js
if not exist assets mkdir assets
if not exist assets\pictures mkdir assets\pictures

echo [2/3] Moving styles and modules...
if exist styles.css move /y styles.css css\styles.css >nul
if exist core.js move /y core.js js\core.js >nul
if exist editor.js move /y editor.js js\editor.js >nul
if exist report.js move /y report.js js\report.js >nul
if exist io.js move /y io.js js\io.js >nul
if exist render.js move /y render.js js\render.js >nul
if exist settings.js move /y settings.js js\settings.js >nul
if exist bootstrap.js move /y bootstrap.js js\bootstrap.js >nul

echo [3/3] Syntax checks...
rem Locate node: try PATH first, then the WorkBuddy-managed node binary.
set NODE=node
where node >nul 2>nul
if errorlevel 1 (
  if exist "%USERPROFILE%\.workbuddy\binaries\node\versions\22.22.2\node.exe" set "NODE=%USERPROFILE%\.workbuddy\binaries\node\versions\22.22.2\node.exe"
  if exist "C:\Users\franklin.song\.workbuddy\binaries\node\versions\22.22.2\node.exe" set "NODE=C:\Users\franklin.song\.workbuddy\binaries\node\versions\22.22.2\node.exe"
)

set FAIL=0
pushd js
for %%f in (core.js editor.js report.js io.js render.js settings.js bootstrap.js) do (
  "%NODE%" --check "%%f" 2>nul
  if errorlevel 1 (
    echo FAIL: %%f
    set FAIL=1
  ) else (
    echo OK: %%f
  )
)
popd

if "%FAIL%"=="1" (
  echo.
  echo One or more files failed syntax check - fix before opening index.html.
) else (
  echo.
  echo All checks passed. Open index.html to use the app.
)
pause
