/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function getTaxCodeWindowsBrandAssetsDirectory(repoRoot: string): string {
	return path.join(repoRoot, '.build', 'taxcode', 'win32');
}

export function ensureTaxCodeWindowsBrandAssets(repoRoot: string): string {
	const sourceIcon = path.join(repoRoot, 'taxcode.ico');
	if (!fs.existsSync(sourceIcon)) {
		throw new Error(`TaxCode icon is missing: ${sourceIcon}`);
	}

	const outputDirectory = getTaxCodeWindowsBrandAssetsDirectory(repoRoot);
	const scriptPath = path.join(repoRoot, 'build', 'taxcode', 'generate-brand-assets.ps1');
	cp.execFileSync('powershell.exe', [
		'-NoLogo',
		'-NoProfile',
		'-NonInteractive',
		'-ExecutionPolicy',
		'Bypass',
		'-File',
		scriptPath,
		'-SourceIcon',
		sourceIcon,
		'-OutputDirectory',
		outputDirectory,
	], { stdio: 'inherit' });

	return outputDirectory;
}
