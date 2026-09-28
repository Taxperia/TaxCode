/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IUpdate } from './update.js';

export type TaxCodeUpdateProfile = 'plugins' | 'no-extensions' | 'low-memory';

export interface ITaxCodeUpdateAsset {
	readonly url: string;
	readonly sha256: string;
}

export interface ITaxCodeUpdateManifest {
	readonly schemaVersion: 1;
	readonly version: string;
	readonly release: string;
	readonly publishedAt: string;
	readonly profiles: Readonly<Partial<Record<TaxCodeUpdateProfile, ITaxCodeUpdateAsset>>>;
}

const installerLabels: Readonly<Record<TaxCodeUpdateProfile, string>> = {
	'plugins': 'Plugins',
	'no-extensions': 'NoExtensions',
	'low-memory': 'LowMemory',
};

function parseVersion(version: string): readonly [number, number, number] | undefined {
	const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
	return match ? [Number(match[1]), Number(match[2]), Number(match[3])] : undefined;
}

function compareVersions(first: readonly number[], second: readonly number[]): number {
	for (let index = 0; index < 3; index++) {
		if (first[index] !== second[index]) {
			return first[index] - second[index];
		}
	}

	return 0;
}

export function getTaxCodeUpdateFromManifest(manifest: ITaxCodeUpdateManifest | null, profile: TaxCodeUpdateProfile | undefined, currentVersion: string): IUpdate | null {
	if (!manifest || manifest.schemaVersion !== 1 || !profile || typeof manifest.profiles !== 'object' || manifest.profiles === null) {
		throw new Error('Invalid TaxCode update manifest.');
	}

	const nextVersion = parseVersion(manifest.version);
	const installedVersion = parseVersion(currentVersion);
	if (!nextVersion || !installedVersion || manifest.release !== `taxcode-v${manifest.version}`) {
		throw new Error('Invalid TaxCode update version.');
	}

	if (compareVersions(nextVersion, installedVersion) <= 0) {
		return null;
	}

	const asset = manifest.profiles[profile];
	const expectedAssetName = `TaxCode-${manifest.version}-${installerLabels[profile]}-UserSetup-x64.exe`;
	const expectedUrl = `https://github.com/Taxperia/TaxCode/releases/download/${manifest.release}/${expectedAssetName}`;
	if (!asset || asset.url !== expectedUrl || !/^[a-f\d]{64}$/i.test(asset.sha256)) {
		throw new Error(`Invalid TaxCode update asset for profile '${profile}'.`);
	}

	const timestamp = Date.parse(manifest.publishedAt);
	if (!Number.isFinite(timestamp)) {
		throw new Error('Invalid TaxCode update timestamp.');
	}

	return {
		version: manifest.release,
		productVersion: manifest.version,
		timestamp,
		url: asset.url,
		sha256hash: asset.sha256.toLowerCase(),
	};
}
