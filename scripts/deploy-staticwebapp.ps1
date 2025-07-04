# Build Angular app and deploy as Azure Static Web App
param(
    [string]$Configuration = "dev",
    [string]$ResourceGroup = "india-app-service-rg",
    [string]$PlanName = "india-app-plan-3749",
    [string]$Location = "Central India",
    [string]$AppName = "angular-static-app-3749"
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot
$projectRoot = Join-Path $root 'employee-app'

# Build the Angular project
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

# Deploy using Azure CLI
Push-Location $root
Write-Output "az staticwebapp create --name $AppName --resource-group $ResourceGroup --location $Location --app-location 'employee-app' --output-location 'dist/employee-app' --sku Free"
az staticwebapp create --name $AppName --resource-group $ResourceGroup --location $Location --app-location 'employee-app' --output-location 'dist/employee-app' --sku Free
Pop-Location

Write-Host "Deployment complete: $AppName"
