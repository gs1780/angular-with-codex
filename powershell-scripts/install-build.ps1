# Install dependencies and build the Angular app
param(
    [string]$Configuration = "dev"
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$projectRoot = Join-Path $root 'employee-app'

Push-Location $projectRoot
try {
    npm install --no-audit --no-fund
    npx ng build --configuration $Configuration
} finally {
    Pop-Location
}

Write-Host "Build completed for configuration: $Configuration"
