Param(
    [string]$amuPath # the path to the alternative mod uploader ending in Firaxis.Steamworkshop.exe
)

$amuDirectory = Split-Path -Path $amuPath;
Start-Process `
    -WorkingDirectory $amuDirectory `
    -FilePath "Firaxis.SteamWorkshop.exe" `
    -Wait
