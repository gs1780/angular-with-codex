# Angular With Codex

## Helper Scripts

This repository includes a PowerShell script that builds the Angular application and creates a ZIP archive of the published files.

### Usage

```powershell
pwsh ./scripts/build-and-publish.ps1 -Configuration prod -ZipName publish.zip
```

The script installs dependencies, runs the Angular build for the specified configuration, and then archives the `dist/employee-app` output into `publish.zip`. Archive entries use forward slashes so the ZIP can be extracted consistently on any platform.

### Deploy to Azure

Ensure that the Azure Static Web Apps CLI extension is installed or updated so
the `upload` command is available:

```powershell
az extension add --name staticwebapp
```

Run the `deploy-eastasia-static-app.ps1` script to build the Angular project and
push the generated files to an Azure Static Web App. The script checks whether
the static web app exists and creates it using `az staticwebapp create` if
necessary. The ZIP archive created from the Angular build is then uploaded
with `az staticwebapp upload`.

```powershell
pwsh ./powershell-scripts/deploy-eastasia-static-app.ps1
```

Default parameters:
- `ResourceGroup`: `eastasia-rg1`
- `Location`: `East Asia`
- `WebAppName`: `eastasia-static-angular`

## Running with Express

After building the Angular project, deploy the contents of the `dist/` folder along with `server.js` and `package.json` to Azure App Service. The Express server automatically serves files from the generated subfolder (for example `dist/employee-app`) and routes all requests to `index.html`.

On Azure the service will run `npm start` which launches `server.js`.
