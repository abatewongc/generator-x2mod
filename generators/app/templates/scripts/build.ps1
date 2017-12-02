Param(
    [string]$mod, # your mod's name - this shouldn't have spaces or special characters, and it's usually the name of the first directory inside your mod's source dir
    [string]$srcDirectory, # the path that contains your mod's .XCOM_sln
    [string]$sdkPath, # the path to your SDK installation ending in "XCOM 2 War of the Chosen SDK"
    [string]$gamePath, # the path to your XCOM 2 installation ending in "XCOM 2"
    [bool]$forceFullBuild = $false # force the script to rebuild the base game's scripts, even if they're already built
)

function WriteModMetadata([string]$mod, [string]$sdkPath, [int]$publishedId, [string]$title, [string]$description, [string]$writeTo) {
    Set-Content $writeTo "[mod]`npublishedFileId=$publishedId`nTitle=$title`nDescription=$description`nRequiresXPACK=true"
}

function StageDirectory ([string]$directoryName, [string]$srcDirectory, [string]$targetDirectory) {
    Write-Host "Staging mod $directoryName from source ($srcDirectory/$directoryName) to staging ($targetDirectory/$directoryName)..."

    if (Test-Path "$srcDirectory/$directoryName") {
        Copy-Item "$srcDirectory/$directoryName" "$targetDirectory/$directoryName" -Recurse -WarningAction SilentlyContinue
        Write-Host "Staged."
    }
    else {
        Write-Host "Mod doesn't have any $directoryName."
    }
}

function CheckErrorCode([string] $message) {
    if ($LASTEXITCODE -ne 0) {
        throw $message;
    }
}

# alias params for clarity in the script (we don't want the person invoking this script to have to type the name -modNameCanonical)
$modNameCanonical = $mod
# we're going to ask that people specify the folder that has their .XCOM_sln in it as the -srcDirectory argument, but a lot of the time all we care about is
# the folder below that that contains Config, Localization, Src, etc...
$modSrcRoot = "$srcDirectory/$modNameCanonical"
Write-Host "Building mod $mod from source root $modSrcRoot..."

# clean
$stagingPath = "{0}/XComGame/Mods/{1}/" -f $sdkPath, $modNameCanonical
if (Test-Path $stagingPath) {
    Write-Host "Cleaning mod project at $stagingPath...";
    Remove-Item $stagingPath -Recurse -WarningAction SilentlyContinue;
    Write-Host "Cleaned."
}

# copy source to staging
StageDirectory "Config" $modSrcRoot $stagingPath
StageDirectory "Content" $modSrcRoot $stagingPath
StageDirectory "Localization" $modSrcRoot $stagingPath
StageDirectory "Src" $modSrcRoot $stagingPath
New-Item "$stagingPath/Script" -ItemType Directory

# create mod metadata (.xcommod) file - used by Firaxis' "make" tooling
$x2projPath = "$modSrcRoot/$modNameCanonical.x2proj"
$xcomModPath = "$srcDirectory/$modNameCanonical.XComMod"
$metadataPublishPath = "$sdkPath/XComGame/Mods/$modNameCanonical/$modNameCanonical.XComMod"

if (Test-Path $x2projPath) {
    # if the mod source contains an x2proj (created with ModBuddy), use it to compose and write the metadata
    Write-Host "This mod has an x2proj file at $x2projPath. Reading metadata from there..."

    [xml]$x2projXml = Get-Content -Path "$modSrcRoot/$modNameCanonical.x2proj"
    $modProperties = $x2projXml.Project.PropertyGroup
    $modPublishedId = $modProperties.SteamPublishedId
    $modTitle = $modProperties.Name
    $modDescription = $modProperties.Description
    Write-Host "Read."

    # write mod metadata based on x2proj xml
    Write-Host "Writing mod metadata to $metadataPublishPath..."
    WriteModMetadata -writeTo $metadataPublishPath -mod $modNameCanonical -sdkPath $sdkPath -publishedId $modPublishedId -title $modTitle -description $modDescription
    Write-Host "Written."
}
elseif (Test-Path $xcomModPath) {
    # if the mod already has an .xcommod file in its root (hopefully created with the Yeoman generator?), just copy
    # that to the appropriate location
    Write-Host "This mod has an .XComMod file at $xcomModPath. Copying it to the publish location."
    Write-Host "Copying to $metadataPublishPath..."
    Copy-Item $xcomModPath -Destination $metadataPublishPath -Force
    Write-Host "Copied."
}
else {
    throw "Metadata for your mod couldn't be created. This is usually because you have neither an .x2proj or .XComMod file in your source directory's root."
}

# mirror the SDK's SrcOrig to its Src
Write-Host "Mirroring SrcOrig to Src..."
Robocopy.exe "$sdkPath/Development/SrcOrig" "$sdkPath/Development/Src" *.uc *.uci /S /E /DCOPY:DA /COPY:DAT /PURGE /MIR /NP /R:1000000 /W:30
Write-Host "Mirrored."

# copying the mod's scripts to the script staging location
Write-Host "Copying the mod's scripts to Src..."
Copy-Item "$stagingPath/Src/*" "$sdkPath/Development/Src/" -Force -Recurse -WarningAction SilentlyContinue
Write-Host "Copied."

if ($forceFullBuild) {
    # if a full build was requested, clean all compiled scripts too
    Write-Host "Full build requested. Cleaning all compiled scripts from $sdkPath/XComGame/Script..."
    Remove-Item "$sdkPath\XComGame\Script\*.u"
    Write-Host "Cleaned."
}
else {
    # clean mod's compiled script
    Write-Host "Cleaning existing mod's compiled script from $sdkPath/XComGame/Script..."

    if (Test-Path "$sdkPath\XComGame\Script\$modNameCanonical.u") {
        Remove-Item "$sdkPath\XComGame\Script\$modNameCanonical.u"
    }
    
    Write-Host "Cleaned."
}

# build the base game scripts
Write-Host "Compiling base game scripts..."
& "$sdkPath/binaries/Win64/XComGame.com" make -nopause -unattended
Write-Host "Compiled."
CheckErrorCode "Failed to compile the base game scripts. This probably isn't a problem with your mod. Have you been monkeying around with SrcOrig, perchance?"

# build the mod's scripts
Write-Host "Compiling mod scripts..."
&"$sdkPath/binaries/Win64/XComGame.com" make -nopause -mods $modNameCanonical "$stagingPath"
CheckErrorCode "Failed to compile mod scripts."
Write-Host "Compiled."

# build the mod's shader cache
if (Test-Path -Path "$stagingPath/Content/*" -Include *.upk, *.umap) {
    Write-Host "Precompiling mod shaders..."
    &"$sdkPath/binaries/Win64/XComGame.com" precompileshaders -nopause platform=pc_sm4 DLC=$modNameCanonical
    CheckErrorCode "Failed to precompile mod shaders."
    Write-Host "Precompiled."
}
else {
    Write-Host "Mod doesn't have any shader content. Skipping shader precompilation."
}

# copy compiled mod scripts to the staging area
Write-Host "Copying the compiled mod scripts to staging..."
Copy-Item "$sdkPath/XComGame/Script/$modNameCanonical.u" "$stagingPath/Script" -Force -WarningAction SilentlyContinue
Write-Host "Copied."

# copy all staged files to the actual game's mods folder
$productionPath = "$gamePath/XCom2-WarOfTheChosen/XComGame/Mods/"
Write-Host "Copying all staging files to production..."
if (-Not (Test-Path $productionPath)) {
    New-Item $productionPath -ItemType Directory
}
Copy-Item $stagingPath $productionPath -Force -Recurse -WarningAction SilentlyContinue
Write-Host "Copied."

# we made it!
Write-Host "*** SUCCESS! ***"
Write-Host "$modNameCanonical ready to run."