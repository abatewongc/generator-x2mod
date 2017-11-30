Param(
    [string]$amlPath # the path to the alternative mod uploader ending in Firaxis.Steamworkshop.exe
)

$amlDirectory = Split-Path -Path $amlPath;
Start-Process `
    -WorkingDirectory $amlDirectory `
    -FilePath "Firaxis.SteamWorkshop.exe" `
    -Wait
