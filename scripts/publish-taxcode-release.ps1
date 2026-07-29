param(
	[Parameter(Mandatory = $true)]
	[string]$Repository,

	[string]$Tag = 'taxcode-v1.121.0',
	[string]$Title = 'TaxCode 1.121.0',
	[string]$NotesFile = 'GITHUB_RELEASE_1.121.0.md',
	[switch]$SkipRepositoryMetadata
)

$ErrorActionPreference = 'Stop'

function Get-GitHubCli {
	$cmd = Get-Command gh -ErrorAction SilentlyContinue
	if ($cmd) {
		return $cmd.Source
	}

	$commonPath = 'C:\Program Files\GitHub CLI\gh.exe'
	if (Test-Path $commonPath) {
		return $commonPath
	}

	throw "Required command 'gh' was not found. Install GitHub CLI and run 'gh auth login' first."
}

$gh = Get-GitHubCli

$root = Resolve-Path (Join-Path $PSScriptRoot '..')
$notesPath = Join-Path $root $NotesFile
$artifactDir = Join-Path $root '.artifacts\release-1.121.0'
$checksumsPath = Join-Path $artifactDir 'SHA256SUMS.txt'
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

New-Item -ItemType Directory -Path $artifactDir -Force | Out-Null

$checksumLines = foreach ($assetPath in $assetPaths) {
	$file = Get-Item $assetPath
	$hash = (Get-FileHash $file.FullName -Algorithm SHA256).Hash
	"$hash  $($file.Name)"
}

$checksumLines | Set-Content -Path $checksumsPath -Encoding ascii

& $gh auth status | Out-Host

if (-not $SkipRepositoryMetadata) {
	$topics = @(
		'taxcode',
		'vscode',
		'vscode-oss',
		'code-oss',
		'windows',
		'electron',
		'typescript',
		'privacy',
		'telemetry-disabled',
		'editor',
		'remote-desktop',
		'low-ram'
	)

	& $gh repo edit $Repository `
		--description 'Privacy-focused Windows desktop code editor distribution built from VS Code OSS.' `
		--homepage "https://github.com/$Repository"

	foreach ($topic in $topics) {
		& $gh repo edit $Repository --add-topic $topic
	}
}

$releaseExists = $false
& $gh release view $Tag --repo $Repository *> $null
if ($LASTEXITCODE -eq 0) {
	$releaseExists = $true
}

if (-not $releaseExists) {
	& $gh release create $Tag --repo $Repository --title $Title --notes-file $notesPath --verify-tag
}

$releaseAssets = @($assetPaths) + @($checksumsPath, (Join-Path $root 'SECURITY-AUDIT.md'))
& $gh release upload $Tag @releaseAssets --repo $Repository --clobber

Write-Host "Release assets uploaded to $Repository / $Tag"
