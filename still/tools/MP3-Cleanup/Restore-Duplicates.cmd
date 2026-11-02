@echo off
setlocal
powershell.exe -NoProfile -STA -ExecutionPolicy Bypass -File "%~dp0Still-MP3-Cleanup.ps1" -Restore
echo.
pause
