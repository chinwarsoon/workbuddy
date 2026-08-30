@echo off
setlocal
REM Open EnglishDaily as a chromeless standalone app window (no address bar / favorites bar).
REM On Windows, press Win+Ctrl+T (Microsoft PowerToys -> Always on Top) to pin this window above others.

set "HTML=%~dp0english-learning-tool.html"
set "URL=file:///%HTML:\=/%
set "W=480"
set "H=880"

REM --- Microsoft Edge ---
set "BIN="
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" set "BIN=%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe"
if not defined BIN if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" set "BIN=%ProgramFiles%\Microsoft\Edge\Application\msedge.exe"
if not defined BIN where msedge >nul 2>nul && set "BIN=msedge"

REM --- Google Chrome (fallback) ---
if not defined BIN if exist "%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe" set "BIN=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not defined BIN if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" set "BIN=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not defined BIN where chrome >nul 2>nul && set "BIN=chrome"

if not defined BIN (
  echo Microsoft Edge or Google Chrome was not found.
  echo Please install one of them, then run this launcher again.
  pause
  exit /b 1
)

start "" "%BIN%" --app="%URL%" --window-size=%W%,%H%
