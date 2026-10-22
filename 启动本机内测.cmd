@echo off
setlocal
cd /d "%~dp0"
if not exist ".artifacts\temp" mkdir ".artifacts\temp"
set "TEMP=%CD%\.artifacts\temp"
set "TMP=%TEMP%"
set "npm_config_cache=%CD%\.artifacts\npm-cache"
if defined HTTPS_PROXY set "NODE_USE_ENV_PROXY=1"
if defined HTTP_PROXY set "NODE_USE_ENV_PROXY=1"
call npm.cmd run dev
pause
