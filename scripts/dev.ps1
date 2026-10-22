param(
  [ValidateSet('dev', 'check', 'build', 'preview', 'test', 'typecheck')]
  [string]$Task = 'dev'
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)

# 仅影响当前开发进程，沿用现有 Node，不改用户系统设置或移动其他文件。
$taskTempDirectory = Join-Path (Split-Path -Parent $PSScriptRoot) '.artifacts/temp'
New-Item -ItemType Directory -Force -Path $taskTempDirectory | Out-Null
$env:TEMP = $taskTempDirectory
$env:TMP = $taskTempDirectory
$env:npm_config_cache = Join-Path $taskTempDirectory 'npm-cache'
# Node 24 supports the same proxy environment as the browser/PowerShell.
if ($env:HTTPS_PROXY -or $env:HTTP_PROXY) { $env:NODE_USE_ENV_PROXY = '1' }
& npm.cmd run $Task
exit $LASTEXITCODE
