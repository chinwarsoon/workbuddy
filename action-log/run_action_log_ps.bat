@echo off
setlocal EnableExtensions
rem ============================================================
rem  run_action_log_ps.bat
rem  Launcher for the PowerShell-only ActionTracker server.
rem  No Python, no external packages - uses Windows' built-in
rem  System.Net.HttpListener (via run_action_log.ps1).
rem  Double-click this file, or run it from a command prompt.
rem  Press Ctrl+C in its window to stop the server.
rem ============================================================
set "DIR=%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%DIR%run_action_log.ps1" %*
goto :eof
