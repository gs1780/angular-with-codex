# Build and publish the Angular app then create a zip archive
param(
    [string]$Configuration = "prod",
    [string]$ZipName = "publish.zip"
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

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::Open($zipPath, [IO.Compression.ZipArchiveMode]::Create)

Get-ChildItem -Path $distDir -Recurse | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
    $relativePath = $_.FullName.Substring($distDir.Length + 1) -replace '\\','/'
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relativePath) | Out-Null
}

$zip.Dispose()
Write-Host "Archive created at $zipPath"
