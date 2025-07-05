# Open the locally running Angular app in the default browser
param(
    [int]$Port = 4200
)

$ErrorActionPreference = 'Stop'

$Url = "http://localhost:$Port/"
Start-Process $Url
