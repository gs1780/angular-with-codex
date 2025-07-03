# Angular With Codex

## Helper Scripts

This repository includes a PowerShell script that builds the Angular application and creates a ZIP archive of the published files.

### Usage

```powershell
pwsh ./scripts/build-and-publish.ps1 -Configuration prod -ZipName publish.zip
```

The script installs dependencies, runs the Angular build for the specified configuration, and then archives the `dist/employee-app` output into `publish.zip`. Archive entries use forward slashes so the ZIP can be extracted consistently on any platform.

### Deploy to Azure

Use the `deploy-to-azure.ps1` script to build the Angular project with the default `dev` configuration and push the static content to an Azure App Service. The script assumes the resource group and app service plan already exist and will create the web app if needed.

```powershell
pwsh ./scripts/deploy-to-azure.ps1
```

Default parameters:
- `ResourceGroup`: `india-app-service-rg`
- `PlanName`: `india-app-plan-3749`
- `Location`: `Central India`
- `WebAppName`: `angular-static-app-3749`
