# Delete the Azure Static Web App created by deploy-staticwebapp.ps1
param(
    [string]$ResourceGroup = "india-app-service-rg",
    [string]$AppName = "angular-static-app-3749",
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

if (-not $Force) {
    $confirmation = Read-Host "Delete static web app '$AppName' in resource group '$ResourceGroup'? (y/N)"
    if ($confirmation -notmatch '^[Yy]$') {
        Write-Host "Deletion cancelled."
        exit
    }
}

Write-Output "az staticwebapp delete --name $AppName --resource-group $ResourceGroup --yes"
az staticwebapp delete --name $AppName --resource-group $ResourceGroup --yes

Write-Host "Deletion initiated for: $AppName"
