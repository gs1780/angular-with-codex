# Build Angular project, create zip, and deploy to Azure Static Web App
param(
    [string]$Configuration = "prod",
    [string]$WebAppName = "eastasia-static-angular",
    [string]$ResourceGroup = "eastasia-rg1",
    [string]$Location = "East Asia",
    [string]$ZipName = "publish.zip",
    [string]$SevenZipPath = "7z"
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot

# Build and archive the Angular project
$buildScript = Join-Path $PSScriptRoot 'install-build-zip.ps1'
& $buildScript -Configuration $Configuration -ZipName $ZipName -SevenZipPath $SevenZipPath

$zipPath = Join-Path $root $ZipName


# Ensure the static web app exists, creating it if necessary
$exists = az staticwebapp show --name $WebAppName --resource-group $ResourceGroup --query "name" -o tsv 2>$null
if (-not $exists) {
    az staticwebapp create --name $WebAppName --resource-group $ResourceGroup `
        --location $Location --sku Free | Out-Null
}

# Deploy the zipped build output
az staticwebapp upload --name $WebAppName --resource-group $ResourceGroup `
    --artifact-path $zipPath | Out-Null

Write-Host "Deployment completed to $WebAppName"
