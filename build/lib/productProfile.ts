/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import fs from 'fs';
import path from 'path';
import baseProduct from '../../product.json' with { type: 'json' };

export type ProductConfiguration = typeof baseProduct;

type InstallerProfileConfiguration = {
	readonly argvFile?: string;
	readonly builtinExtensionsDir?: string;
	readonly settingsFile?: string;
	readonly userExtensionsDir?: string;
};

type ProductProfileConfiguration = {
	readonly installer?: InstallerProfileConfiguration;
	readonly product?: Partial<ProductConfiguration>;
};

export type ResolvedInstallerProfileConfiguration = {
	readonly argvFile: string;
	readonly builtinExtensionsDir: string;
	readonly settingsFile: string;
	readonly userExtensionsDir: string;
};

export type ResolvedProductProfileConfiguration = {
	readonly id: string;
	readonly installer: ResolvedInstallerProfileConfiguration;
	readonly product: Partial<ProductConfiguration>;
};

const root = path.dirname(path.dirname(import.meta.dirname));
const profilesDir = path.join(root, 'build', 'win32', 'profiles');
const profileEnvVar = 'TAXCODE_BUILD_PROFILE';
const defaultProfileId = 'default';

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function mergeObjects<T extends Record<string, unknown>>(base: T, overrides: Partial<T>): T {
	const result: Record<string, unknown> = { ...base };

	for (const [key, value] of Object.entries(overrides)) {
		if (isPlainObject(result[key]) && isPlainObject(value)) {
			result[key] = mergeObjects(result[key] as Record<string, unknown>, value);
		} else if (value !== undefined) {
			result[key] = value;
		}
	}

	return result as T;
}

function resolveProfilePath(relativePath?: string): string {
	if (!relativePath) {
		return '';
	}

	return path.isAbsolute(relativePath) ? relativePath : path.join(root, relativePath);
}

export function getBuildProfileId(): string {
	const configuredProfile = process.env[profileEnvVar]?.trim();
	return configuredProfile ? configuredProfile : defaultProfileId;
}

export function getProductProfile(profileId = getBuildProfileId()): ResolvedProductProfileConfiguration {
	if (profileId === defaultProfileId) {
		return {
			id: defaultProfileId,
			installer: {
				argvFile: '',
				builtinExtensionsDir: '',
				settingsFile: '',
				userExtensionsDir: ''
			},
			product: {}
		};
	}

	const profilePath = path.join(profilesDir, `${profileId}.json`);
	if (!fs.existsSync(profilePath)) {
		throw new Error(`Unknown build profile '${profileId}'. Expected ${profilePath} to exist.`);
	}

	const parsedProfile = JSON.parse(fs.readFileSync(profilePath, 'utf8')) as ProductProfileConfiguration;
	return {
		id: profileId,
		installer: {
			argvFile: resolveProfilePath(parsedProfile.installer?.argvFile),
			builtinExtensionsDir: resolveProfilePath(parsedProfile.installer?.builtinExtensionsDir),
			settingsFile: resolveProfilePath(parsedProfile.installer?.settingsFile),
			userExtensionsDir: resolveProfilePath(parsedProfile.installer?.userExtensionsDir)
		},
		product: parsedProfile.product ?? {}
	};
}

export function getEffectiveProduct(profileId = getBuildProfileId()): ProductConfiguration {
	return mergeObjects(baseProduct as ProductConfiguration & Record<string, unknown>, getProductProfile(profileId).product as Partial<ProductConfiguration & Record<string, unknown>>) as ProductConfiguration;
}

export function getArtifactBaseName(profileId = getBuildProfileId()): string {
	if (profileId === defaultProfileId) {
		return 'VSCode';
	}

	return getEffectiveProduct(profileId).nameShort;
}

export function getPackageOutputFolderName(platform: string, arch: string, profileId = getBuildProfileId()): string {
	const baseName = getArtifactBaseName(profileId);
	return `${baseName}-${platform}-${arch}`;
}
