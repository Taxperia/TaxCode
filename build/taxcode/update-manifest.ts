/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { taxCodeBuildProfileNames, type TaxCodeBuildProfileName } from './profile.ts';

const repository = 'Taxperia/TaxCode';
const installerLabels: Readonly<Record<TaxCodeBuildProfileName, string>> = {
	'plugins': 'Plugins',
	'no-extensions': 'NoExtensions',
	'low-memory': 'LowMemory',
};

export function getTaxCodeInstallerAssetName(profile: TaxCodeBuildProfileName, version: string): string {
	return `TaxCode-${version}-${installerLabels[profile]}-UserSetup-x64.exe`;
}

export function stageTaxCodeInstaller(root: string, profile: TaxCodeBuildProfileName, version: string): string {
	const source = path.join(root, '.build', 'win32-x64', `${profile}-user-setup`, 'VSCodeSetup.exe');
	if (!fs.existsSync(source)) {
		throw new Error(`TaxCode installer is missing: ${source}`);
	}

	const outputDirectory = path.join(root, '.build', 'taxcode', 'installers');
	fs.mkdirSync(outputDirectory, { recursive: true });
	const target = path.join(outputDirectory, getTaxCodeInstallerAssetName(profile, version));
	fs.copyFileSync(source, target);
	return target;
}

export function writeTaxCodeUpdateManifestIfComplete(root: string, version: string): string | undefined {
	const outputDirectory = path.join(root, '.build', 'taxcode', 'installers');
	const installerPaths = taxCodeBuildProfileNames.map(profile => ({
		profile,
		path: path.join(outputDirectory, getTaxCodeInstallerAssetName(profile, version)),
	}));
	if (installerPaths.some(installer => !fs.existsSync(installer.path))) {
		return undefined;
	}

	const release = `taxcode-v${version}`;
	const profiles = Object.fromEntries(installerPaths.map(installer => {
		const assetName = path.basename(installer.path);
		return [installer.profile, {
			url: `https://github.com/${repository}/releases/download/${release}/${assetName}`,
			sha256: crypto.createHash('sha256').update(fs.readFileSync(installer.path)).digest('hex'),
		}];
	}));
	const manifest = {
		schemaVersion: 1,
		version,
		release,
		publishedAt: new Date().toISOString(),
		profiles,
	};

	const manifestPath = path.join(outputDirectory, 'taxcode-update.json');
	fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, '\t')}\n`);
	return manifestPath;
}
