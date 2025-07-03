# Angular With Codex

## Helper Scripts

This repository includes a PowerShell script that builds the Angular application and creates a ZIP archive of the published files.

### Usage

```powershell
pwsh ./scripts/build-and-publish.ps1 -Configuration prod -ZipName publish.zip
```

The script installs dependencies, runs the Angular build for the specified configuration, and then archives the `dist/employee-app` output into `publish.zip`. Archive entries use forward slashes so the ZIP can be extracted consistently on any platform.
