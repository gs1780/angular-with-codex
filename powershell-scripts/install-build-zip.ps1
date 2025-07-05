# Install dependencies, build the Angular app, and zip the output using 7-Zip
param(
    [string]$Configuration = "prod",
    [string]$ZipName = "publish.zip",
    [string]$SevenZipPath = "7z"
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

$distDir = Join-Path $projectRoot 'dist/employee-app'
if (!(Test-Path $distDir)) {
    Write-Error "Build output directory not found: $distDir"
    exit 1
}

$zipPath = Join-Path $root $ZipName
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Push-Location $distDir
try {
    & $SevenZipPath a -tzip $zipPath ./*
} finally {
    Pop-Location
}

Write-Host "Archive created at $zipPath"
