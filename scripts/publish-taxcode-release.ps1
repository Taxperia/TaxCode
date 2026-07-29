param(
	[Parameter(Mandatory = $true)]
	[string]$Repository,

	[string]$Tag = 'taxcode-v1.121.0',
	[string]$Title = 'TaxCode 1.121.0',
	[string]$NotesFile = 'GITHUB_RELEASE_1.121.0.md'
)

$ErrorActionPreference = 'Stop'

function Require-Command {
	param([string]$Name)
	if (-not (Get-Command $Name -ErrorAction SilentlyContinue)) {
		throw "Required command '$Name' was not found. Install GitHub CLI and run 'gh auth login' first."
	}
}

Require-Command gh

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$notesPath = Join-Path $root $NotesFile
$assets = @(
	'TaxCodeVDSUserSetup.exe',
	'TaxCodeLiteUserSetup.exe',
	'TaxCodeNoTelemetryUserSetup.exe',
	'TaxCodePluginsUserSetup.exe'
)

if (-not (Test-Path $notesPath)) {
	throw "Release notes file not found: $notesPath"
}

$assetPaths = foreach ($asset in $assets) {
	$path = Join-Path $root $asset
	if (-not (Test-Path $path)) {
		throw "Release asset not found: $path"
	}

	$path
}

gh auth status | Out-Host

$releaseExists = $false
& gh release view $Tag --repo $Repository *> $null
if ($LASTEXITCODE -eq 0) {
	$releaseExists = $true
}

if (-not $releaseExists) {
	gh release create $Tag --repo $Repository --title $Title --notes-file $notesPath
}

gh release upload $Tag @assetPaths --repo $Repository --clobber

Write-Host "Release assets uploaded to $Repository / $Tag"
