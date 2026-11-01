param([ValidateSet('dev','preview')][string]$Task = 'dev')
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
$bookTaskTemp = Join-Path (Get-Location) '.artifacts/temp'
New-Item -ItemType Directory -Force -Path $bookTaskTemp | Out-Null
$env:TEMP = $bookTaskTemp
$env:TMP = $bookTaskTemp
$env:npm_config_cache = Join-Path $bookTaskTemp 'npm-cache'
if ($env:HTTPS_PROXY -or $env:HTTP_PROXY) { $env:NODE_USE_ENV_PROXY = '1' }
if ($Task -eq 'dev') {
  & npm.cmd run content:sync
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
  & node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5183 --strictPort
} else {
  & node node_modules/vite/bin/vite.js preview --host 127.0.0.1 --port 4183 --strictPort
}
exit $LASTEXITCODE
