# Build and run the Angular app then open the landing page in the specified browser
param(
    [string]$Configuration = "dev",
    [string]$Browser = "chrome"
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$projectRoot = Join-Path $root 'employee-app'

Push-Location $projectRoot
try {
    npm install --no-audit --no-fund
    $npx = if ($IsWindows) { 'npx.cmd' } else { 'npx' }
    $serveProcess = Start-Process -FilePath $npx -ArgumentList @('ng','serve','--configuration',$Configuration,'--no-open') -NoNewWindow -PassThru
} finally {
    Pop-Location
}

Start-Sleep -Seconds 5

Start-Process -FilePath $Browser -ArgumentList 'http://localhost:4200'

Wait-Process $serveProcess
