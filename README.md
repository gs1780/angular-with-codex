# Angular With Codex

## Helper Scripts

This repository includes PowerShell scripts to build the Angular application and deploy the static output to Azure Static Web Apps.

### Usage

```powershell
pwsh ./scripts/build-and-publish.ps1 -Configuration prod -ZipName publish.zip
```

The `build-and-publish.ps1` script (not shown in this repo) demonstrates how to create a ZIP archive from the `dist/employee-app` folder. The deployment script described below now uploads the folder directly instead of creating an archive.

### Deploy to Azure

Ensure that the Azure Static Web Apps CLI extension is installed or updated so
the `upload` command is available:

```powershell
az extension add --name staticwebapp
```

Run the `deploy-eastasia-static-app.ps1` script to build the Angular project and
push the generated files to an Azure Static Web App. The script checks whether
the static web app exists and creates it using `az staticwebapp create` if
necessary. The build output from `dist/employee-app` is uploaded directly using
`az staticwebapp upload`.

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
