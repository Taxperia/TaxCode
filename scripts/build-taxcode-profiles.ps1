[CmdletBinding()]
param(
	[ValidateSet("vds", "lite", "notelemetry", "plugins", "all")]
	[string[]]$Profile = @("vds", "lite", "notelemetry", "plugins"),

	[ValidateSet("x64", "arm64")]
	[string]$Arch = "x64",

	[ValidateSet("user", "system")]
	[string]$InstallTarget = "user",

	[switch]$Setup
)

$ErrorActionPreference = "Stop"
$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$availableProfiles = @("vds", "lite", "notelemetry", "plugins")
$selectedProfiles = if ($Profile -contains "all") { $availableProfiles } else { $Profile }

function Get-FreeInstallerDrive {
	foreach ($driveLetter in @("T", "U", "V", "W", "X", "Y", "Z")) {
		if (-not (Get-PSDrive -Name $driveLetter -PSProvider FileSystem -ErrorAction SilentlyContinue)) {
			return "$driveLetter`:"
		}
	}

	throw "A free drive letter is required for installer packaging."
}

function Ensure-TaxCodeLiteSeeds {
	$userExtensionsSeedPath = Join-Path $repoRoot "build\win32\taxcode-lite\user-extensions"
	$builtinExtensionsSeedPath = Join-Path $repoRoot "build\win32\taxcode-lite\builtin-extensions"

	if ((Test-Path $userExtensionsSeedPath) -and (Test-Path $builtinExtensionsSeedPath)) {
		return
	}

	$prepareScript = Join-Path $repoRoot "scripts\prepare-taxcode-lite.ps1"
	$defaultLiveShareSource = Join-Path $repoRoot ".vds-profile\extensions\ms-vsliveshare.vsliveshare"

	if (Test-Path $defaultLiveShareSource) {
		& $prepareScript
		if ($LASTEXITCODE -ne 0) {
			throw "Could not prepare TaxCode lite seed extensions."
		}
		return
	}

	Write-Warning "TaxCode lite seed extensions are not present. Run scripts\prepare-taxcode-lite.ps1 before installer packaging if you want the seeded Live Share and theme extensions included."
}

Push-Location $repoRoot
try {
	foreach ($profileId in $selectedProfiles) {
		$env:TAXCODE_BUILD_PROFILE = $profileId
		Write-Host "Building TaxCode profile '$profileId' for win32-$Arch..."

		& npm.cmd run gulp "vscode-win32-$Arch"
		if ($LASTEXITCODE -ne 0) {
			throw "Application packaging failed for profile '$profileId'."
		}

		if ($Setup) {
			if (@("lite", "plugins") -contains $profileId) {
				Ensure-TaxCodeLiteSeeds
			}

			$profileConfig = Get-Content (Join-Path $repoRoot "build/win32/profiles/$profileId.json") -Raw | ConvertFrom-Json
			$appPath = Join-Path (Split-Path $repoRoot -Parent) "$($profileConfig.product.nameShort)-win32-$Arch"
			$installerDrive = Get-FreeInstallerDrive

			try {
				& subst.exe $installerDrive $appPath
				if ($LASTEXITCODE -ne 0) {
					throw "Could not create a short installer source path for profile '$profileId'."
				}

				$env:TAXCODE_SETUP_SOURCE_DIR = "$installerDrive\"
				$env:TAXCODE_SKIP_SETUP_ICON = "1"
				& npm.cmd run gulp "vscode-win32-$Arch-$InstallTarget-setup"
				if ($LASTEXITCODE -ne 0) {
					throw "Installer packaging failed for profile '$profileId'."
				}
			}
			finally {
				Remove-Item Env:\TAXCODE_SETUP_SOURCE_DIR -ErrorAction SilentlyContinue
				Remove-Item Env:\TAXCODE_SKIP_SETUP_ICON -ErrorAction SilentlyContinue
				if ($installerDrive) {
					& subst.exe $installerDrive /D | Out-Null
				}
			}
		}
	}
}
finally {
	Remove-Item Env:\TAXCODE_BUILD_PROFILE -ErrorAction SilentlyContinue
	Remove-Item Env:\TAXCODE_SETUP_SOURCE_DIR -ErrorAction SilentlyContinue
	Pop-Location
}
