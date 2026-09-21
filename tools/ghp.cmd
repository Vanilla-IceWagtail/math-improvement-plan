@echo off
rem ---------------------------------------------------------------------------
rem ghp.cmd - run gh with a temporary proxy injected.
rem
rem Wrapper around ghp.ps1 that also bypasses the PowerShell execution policy,
rem so you can call it from cmd.exe, Git Bash, or any tool that spawns commands.
rem
rem Usage:
rem     tools\ghp.cmd auth status
rem     tools\ghp.cmd repo view
rem     tools\ghp.cmd -NoProxy api user
rem ---------------------------------------------------------------------------
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0ghp.ps1" %*
exit /b %ERRORLEVEL%
