#---------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.
#---------------------------------------------------------------------------------------------

param(
	[Parameter(Mandatory = $true)]
	[string]$SourceIcon,

	[Parameter(Mandatory = $true)]
	[string]$OutputDirectory,

	[Parameter(Mandatory = $true)]
	[string]$InstallerResourcesDirectory
)

$ErrorActionPreference = 'Stop'

Add-Type -AssemblyName System.Drawing

$resolvedSource = (Resolve-Path -LiteralPath $SourceIcon).Path
$resolvedOutput = [System.IO.Path]::GetFullPath($OutputDirectory)
$resolvedInstallerResources = (Resolve-Path -LiteralPath $InstallerResourcesDirectory).Path
[System.IO.Directory]::CreateDirectory($resolvedOutput) | Out-Null

$source = [System.Drawing.Image]::FromFile($resolvedSource)
try {
	$assets = @{
		'code_70x70.png' = 70
		'code_150x150.png' = 150
	}

	foreach ($asset in $assets.GetEnumerator()) {
		$size = [int]$asset.Value
		$bitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
		try {
			$bitmap.SetResolution(96, 96)
			$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
			try {
				$graphics.Clear([System.Drawing.Color]::Transparent)
				$graphics.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
				$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
				$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
				$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
				$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
				$graphics.DrawImage($source, 0, 0, $size, $size)
			} finally {
				$graphics.Dispose()
			}

			$outputPath = Join-Path $resolvedOutput $asset.Key
			$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)
		} finally {
			$bitmap.Dispose()
		}
	}

	$installerAssets = Get-ChildItem -LiteralPath $resolvedInstallerResources -Filter 'inno-*.bmp'
	foreach ($template in $installerAssets) {
		$templateImage = [System.Drawing.Image]::FromFile($template.FullName)
		try {
			$width = $templateImage.Width
			$height = $templateImage.Height
		} finally {
			$templateImage.Dispose()
		}

		$bitmap = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
		try {
			$bitmap.SetResolution(96, 96)
			$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
			try {
				$graphics.Clear([System.Drawing.Color]::White)
				$graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
				$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
				$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
				$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality

				$isSmall = $template.Name.StartsWith('inno-small-', [System.StringComparison]::OrdinalIgnoreCase)
				$scale = if ($isSmall) { 0.78 } else { 0.72 }
				$logoSize = [int][Math]::Floor([Math]::Min($width, $height) * $scale)
				$x = [int][Math]::Floor(($width - $logoSize) / 2)
				$y = [int][Math]::Floor(($height - $logoSize) / 2)
				$graphics.DrawImage($source, $x, $y, $logoSize, $logoSize)
			} finally {
				$graphics.Dispose()
			}

			$outputPath = Join-Path $resolvedOutput $template.Name
			$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Bmp)
		} finally {
			$bitmap.Dispose()
		}
	}
} finally {
	$source.Dispose()
}
