param(
    [string]$LiveShareSource = "",
    [string]$ThemeDefaultsSource = "",
    [string]$ThemeSetiSource = ""
)

$ErrorActionPreference = "Stop"

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$userExtensionsSeedPath = Join-Path $repoRoot "build\win32\taxcode-lite\user-extensions"
$builtinExtensionsSeedPath = Join-Path $repoRoot "build\win32\taxcode-lite\builtin-extensions"
$setupIconSeedPath = Join-Path $repoRoot "build\win32\taxcode-lite\setup.ico"

if (-not $LiveShareSource) {
    $LiveShareSource = Join-Path $repoRoot ".vds-profile\extensions\ms-vsliveshare.vsliveshare"
}

if (-not $ThemeDefaultsSource) {
    $ThemeDefaultsSource = Join-Path $repoRoot "extensions\theme-defaults"
}

if (-not $ThemeSetiSource) {
    $ThemeSetiSource = Join-Path $repoRoot "extensions\theme-seti"
}

foreach ($path in @($LiveShareSource, $ThemeDefaultsSource, $ThemeSetiSource)) {
    if (-not (Test-Path $path)) {
        throw "Required source not found: $path"
    }
}

foreach ($seedPath in @($userExtensionsSeedPath, $builtinExtensionsSeedPath)) {
    if (Test-Path $seedPath) {
        Remove-Item -LiteralPath $seedPath -Recurse -Force
    }

    New-Item -ItemType Directory -Force -Path $seedPath | Out-Null
}

Copy-Item -LiteralPath $LiveShareSource -Destination (Join-Path $userExtensionsSeedPath "ms-vsliveshare.vsliveshare") -Recurse -Force
Copy-Item -LiteralPath $ThemeDefaultsSource -Destination (Join-Path $builtinExtensionsSeedPath "theme-defaults") -Recurse -Force
Copy-Item -LiteralPath $ThemeSetiSource -Destination (Join-Path $builtinExtensionsSeedPath "theme-seti") -Recurse -Force
Copy-Item -LiteralPath (Join-Path $repoRoot "resources\win32\code.ico") -Destination $setupIconSeedPath -Force

Write-Host "Prepared TaxCode lite seeds at $userExtensionsSeedPath and $builtinExtensionsSeedPath"
