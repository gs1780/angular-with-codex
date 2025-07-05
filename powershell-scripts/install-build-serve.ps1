# Install dependencies, build the Angular app, and serve it locally
param(
    [string]$Configuration = "dev",
    [string]$Host = "localhost",
    [int]$Port = 4200
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$projectRoot = Join-Path $root 'employee-app'

Push-Location $projectRoot
try {
    npm install --no-audit --no-fund
    npx ng build --configuration $Configuration
    npx ng serve --host $Host --port $Port --open
} finally {
    Pop-Location
}
