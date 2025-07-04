# Delete the Azure App Service created by deploy-to-azure.ps1
param(
    [string]$ResourceGroup = "india-app-service-rg",
    [string]$WebAppName = "angular-static-app-3749",
    [switch]$Force
)

$ErrorActionPreference = 'Stop'

if (-not $Force) {
    $confirmation = Read-Host "Delete app service '$WebAppName' in resource group '$ResourceGroup'? (y/N)"
    if ($confirmation -notmatch '^[Yy]$') {
        Write-Host "Deletion cancelled."
        exit
    }
}

Write-Output "az webapp delete --name $WebAppName --resource-group $ResourceGroup"
az webapp delete --name $WebAppName --resource-group $ResourceGroup

Write-Host "Deletion initiated for: $WebAppName"
