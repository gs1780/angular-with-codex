# Build and run the Angular app then open the landing page in the specified browser
param(
    [string]$Configuration = "dev",
    [string]$Browser = "chrome"
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$projectRoot = Join-Path $root 'employee-app'

Push-Location $projectRoot

ng serve --configuration=$Configuration --open