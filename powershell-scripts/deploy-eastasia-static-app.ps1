# Build Angular project, create zip, and deploy to Azure Static Web App
param(
    [string]$Configuration = "prod",
    [string]$WebAppName = "eastasia-static-angular",
    [string]$ResourceGroup = "eastasia-rg1",
    [string]$Location = "East Asia",
    [string]$ZipName = "publish.zip",
    [string]$SevenZipPath = 'C:\Program Files\7-Zip\7z.exe'
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot

# Ensure the Azure Static Web Apps extension is installed
$staticWebExt = az extension list --query "[?name=='staticwebapp']" -o tsv
if (-not $staticWebExt) {
    Write-Host "Installing Azure Static Web Apps extension..."
    az extension add --name staticwebapp | Out-Null
}

# Build and archive the Angular project
$buildScript = Join-Path $PSScriptRoot 'install-build-zip.ps1'
Write-Host "Building Angular project and creating archive..."
& $buildScript -Configuration $Configuration -ZipName $ZipName -SevenZipPath $SevenZipPath
Write-Host "Package build finished"

$zipPath = Join-Path $root $ZipName


# Ensure the static web app exists, creating it if necessary
Write-Host "Checking for static web app $WebAppName in $ResourceGroup..."
try {
    $exists = az staticwebapp show --name $WebAppName --resource-group $ResourceGroup --query "name" -o tsv -ErrorAction Stop
} catch {
    $exists = $null
}

if (-not $exists) {
    Write-Host "Static web app not found. Creating $WebAppName..."
    az staticwebapp create --name $WebAppName --resource-group $ResourceGroup `
        --location $Location --sku Free | Out-Null
    Write-Host "Static web app created"
} else {
    Write-Host "Static web app exists"
}

# Deploy the zipped build output
Write-Host "Uploading package $zipPath to $WebAppName..."
az staticwebapp upload --name $WebAppName --resource-group $ResourceGroup `
    --artifact-path $zipPath | Out-Null

Write-Host "Deployment completed to $WebAppName"
