# Build Angular project and deploy the published files to Azure Static Web App
param(
    [string]$Configuration = "prod",
    [string]$WebAppName = "eastasia-static-angular",
    [string]$ResourceGroup = "eastasia-rg1",
    [string]$Location = "East Asia"
)

$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $PSScriptRoot

# Ensure the Azure Static Web Apps extension is installed
$staticWebExt = az extension list --query "[?name=='staticwebapp']" -o tsv
if (-not $staticWebExt) {
    Write-Host "Installing Azure Static Web Apps extension..."
    az extension add --name staticwebapp | Out-Null
}

# Build the Angular project
$buildScript = Join-Path $PSScriptRoot 'install-build.ps1'
Write-Host "Building Angular project..."
& $buildScript -Configuration $Configuration
Write-Host "Build completed"

$sourcePath = Join-Path $root 'employee-app/dist/employee-app'


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

# Deploy the published files
Write-Host "Uploading $sourcePath to $WebAppName..."
az staticwebapp upload --name $WebAppName --resource-group $ResourceGroup `
    --source $sourcePath | Out-Null

Write-Host "Deployment completed to $WebAppName"
