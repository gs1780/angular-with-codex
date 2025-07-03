# Build Angular app and deploy to Azure App Service
param(
    [string]$Configuration = "dev",
    [string]$ResourceGroup = "india-app-service-rg",
    [string]$PlanName = "india-app-plan-3749",
    [string]$Location = "Central India",
    [string]$WebAppName = "angular-static-app-3749"
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

$zipPath = Join-Path $root 'publish.zip'
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [IO.Compression.ZipFile]::Open($zipPath, [IO.Compression.ZipArchiveMode]::Create)
Get-ChildItem -Path $distDir -Recurse | Where-Object { -not $_.PSIsContainer } | ForEach-Object {
    $relativePath = $_.FullName.Substring($distDir.Length + 1) -replace '\\','/'
    [IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $_.FullName, $relativePath) | Out-Null
}
$zip.Dispose()

# Create the Web App and deploy the ZIP
# The pipe character must be escaped for the underlying cmd process
# so use `node^|20-lts` to specify the runtime version.
az webapp create --resource-group $ResourceGroup --plan $PlanName --name $WebAppName --runtime node^|20-lts --query name -o tsv
az webapp deploy --resource-group $ResourceGroup --name $WebAppName --src-path $zipPath

Write-Host "Deployment complete: $WebAppName"
