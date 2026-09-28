/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

export const taxCodeBuildProfileNames = ['plugins', 'no-extensions', 'low-memory'] as const;

export type TaxCodeBuildProfileName = typeof taxCodeBuildProfileNames[number];

export interface ITaxCodeProductConfiguration {
	readonly taxCodeProfile: TaxCodeBuildProfileName;
	readonly taxCodeExtensionsEnabled: boolean;
	readonly taxCodeLowMemoryMode: boolean;
	readonly taxCodeDefaultMaxOldSpaceSize?: number;
	readonly taxCodeDisableHardwareAcceleration?: boolean;
}

export interface ITaxCodeBuildProfile {
	readonly name: TaxCodeBuildProfileName;
	readonly artifactName: string;
	readonly includeExtensions: boolean;
	readonly product: Readonly<Record<string, unknown>> & ITaxCodeProductConfiguration;
	readonly removeProductProperties: readonly string[];
}

const commonProduct = {
	quality: 'stable',
	updateUrl: 'https://github.com/Taxperia/TaxCode/releases/latest/download/taxcode-update.json',
	taxCodeUpdateManifestUrl: 'https://github.com/Taxperia/TaxCode/releases/latest/download/taxcode-update.json',
	enableTelemetry: false,
	removeTelemetryMachineId: true,
	showTelemetryOptOut: false,
	builtInExtensionsEnabledWithAutoUpdates: [],
};

const extensionsGallery = {
	serviceUrl: 'https://open-vsx.org/vscode/gallery',
	itemUrl: 'https://open-vsx.org/vscode/item',
	resourceUrlTemplate: 'https://open-vsx.org/vscode/unpkg/{publisher}/{name}/{version}/{path}',
	extensionUrlTemplate: 'https://open-vsx.org/vscode/gallery/{publisher}/{name}/latest',
};

const profiles: Readonly<Record<TaxCodeBuildProfileName, ITaxCodeBuildProfile>> = {
	plugins: {
		name: 'plugins',
		artifactName: 'TaxCode-plugins',
		includeExtensions: true,
		removeProductProperties: [],
		product: {
			...commonProduct,
			nameShort: 'TaxCode',
			nameLong: 'TaxCode',
			applicationName: 'taxcode',
			dataFolderName: '.taxcode',
			sharedDataFolderName: '.taxcode-shared',
			serverApplicationName: 'taxcode-server',
			serverDataFolderName: '.taxcode-server',
			tunnelApplicationName: 'taxcode-tunnel',
			urlProtocol: 'taxcode',
			win32DirName: 'TaxCode',
			win32NameVersion: 'TaxCode',
			win32RegValueName: 'TaxCode',
			win32MutexName: 'taxcode',
			win32TunnelServiceMutex: 'taxcode-tunnelservice',
			win32TunnelMutex: 'taxcode-tunnel',
			win32AppUserModelId: 'TaxCode.Editor',
			win32ShellNameShort: 'TaxCode',
			win32x64AppId: '{{B8A90CF6-4C0A-4AD8-A61B-996E8735D4B1}',
			win32arm64AppId: '{{194C44B3-6A28-4B87-AB1E-04DC5D70C819}',
			win32x64UserAppId: '{{D70CF8CB-8E75-4A65-BE21-3207B451EB69}',
			win32arm64UserAppId: '{{75F724A6-F32D-4708-8243-D9839EA0B340}',
			linuxDesktopName: 'dev.taxcode.TaxCode',
			linuxIconName: 'taxcode',
			darwinBundleIdentifier: 'dev.taxcode.editor',
			extensionsGallery,
			linkProtectionTrustedDomains: ['https://open-vsx.org'],
			taxCodeProfile: 'plugins',
			taxCodeExtensionsEnabled: true,
			taxCodeLowMemoryMode: false,
		},
	},
	'no-extensions': {
		name: 'no-extensions',
		artifactName: 'TaxCode-no-extensions',
		includeExtensions: false,
		removeProductProperties: ['extensionsGallery'],
		product: {
			...commonProduct,
			nameShort: 'TaxCode No Extensions',
			nameLong: 'TaxCode No Extensions',
			applicationName: 'taxcode-no-extensions',
			dataFolderName: '.taxcode-no-extensions',
			sharedDataFolderName: '.taxcode-no-extensions-shared',
			serverApplicationName: 'taxcode-no-extensions-server',
			serverDataFolderName: '.taxcode-no-extensions-server',
			tunnelApplicationName: 'taxcode-no-extensions-tunnel',
			urlProtocol: 'taxcode-no-extensions',
			win32DirName: 'TaxCode No Extensions',
			win32NameVersion: 'TaxCode No Extensions',
			win32RegValueName: 'TaxCodeNoExtensions',
			win32MutexName: 'taxcode-no-extensions',
			win32TunnelServiceMutex: 'taxcode-no-extensions-tunnelservice',
			win32TunnelMutex: 'taxcode-no-extensions-tunnel',
			win32AppUserModelId: 'TaxCode.Editor.NoExtensions',
			win32ShellNameShort: 'TaxCode No Extensions',
			win32x64AppId: '{{3AE0D213-3D4D-4A0D-9A62-A74152F3F7ED}',
			win32arm64AppId: '{{40689AA3-3E89-4EFE-9B48-9265F855B953}',
			win32x64UserAppId: '{{13516CC9-D78C-4D08-A2BC-4E77B84EAB26}',
			win32arm64UserAppId: '{{F45AC1BD-42CA-4190-983B-ED112670BA74}',
			linuxDesktopName: 'dev.taxcode.TaxCode.NoExtensions',
			linuxIconName: 'taxcode-no-extensions',
			darwinBundleIdentifier: 'dev.taxcode.editor.no-extensions',
			builtInExtensions: [],
			linkProtectionTrustedDomains: [],
			taxCodeProfile: 'no-extensions',
			taxCodeExtensionsEnabled: false,
			taxCodeLowMemoryMode: false,
		},
	},
	'low-memory': {
		name: 'low-memory',
		artifactName: 'TaxCode-low-memory',
		includeExtensions: false,
		removeProductProperties: ['extensionsGallery'],
		product: {
			...commonProduct,
			nameShort: 'TaxCode Lite',
			nameLong: 'TaxCode Lite',
			applicationName: 'taxcode-lite',
			dataFolderName: '.taxcode-lite',
			sharedDataFolderName: '.taxcode-lite-shared',
			serverApplicationName: 'taxcode-lite-server',
			serverDataFolderName: '.taxcode-lite-server',
			tunnelApplicationName: 'taxcode-lite-tunnel',
			urlProtocol: 'taxcode-lite',
			win32DirName: 'TaxCode Lite',
			win32NameVersion: 'TaxCode Lite',
			win32RegValueName: 'TaxCodeLite',
			win32MutexName: 'taxcode-lite',
			win32TunnelServiceMutex: 'taxcode-lite-tunnelservice',
			win32TunnelMutex: 'taxcode-lite-tunnel',
			win32AppUserModelId: 'TaxCode.Editor.Lite',
			win32ShellNameShort: 'TaxCode Lite',
			win32x64AppId: '{{BE501574-DAA7-491C-AC20-678A2D2FDADF}',
			win32arm64AppId: '{{9A72CA6B-A712-4FE0-B52C-DBB4CB14994E}',
			win32x64UserAppId: '{{D64E5AA6-D868-4745-BA8B-31BC46291B4F}',
			win32arm64UserAppId: '{{8424AF57-5B0E-42AD-932C-6B07DC9DC116}',
			linuxDesktopName: 'dev.taxcode.TaxCode.Lite',
			linuxIconName: 'taxcode-lite',
			darwinBundleIdentifier: 'dev.taxcode.editor.lite',
			builtInExtensions: [],
			linkProtectionTrustedDomains: [],
			taxCodeProfile: 'low-memory',
			taxCodeExtensionsEnabled: false,
			taxCodeLowMemoryMode: true,
			taxCodeDefaultMaxOldSpaceSize: 512,
			taxCodeDisableHardwareAcceleration: true,
		},
	},
};

export function isTaxCodeBuildProfileName(value: string): value is TaxCodeBuildProfileName {
	return taxCodeBuildProfileNames.includes(value as TaxCodeBuildProfileName);
}

export function getTaxCodeBuildProfile(environment: NodeJS.ProcessEnv = process.env): ITaxCodeBuildProfile {
	const requestedProfile = environment['TAXCODE_BUILD_PROFILE'] ?? 'plugins';
	if (!isTaxCodeBuildProfileName(requestedProfile)) {
		throw new Error(`Unknown TAXCODE_BUILD_PROFILE '${requestedProfile}'. Expected one of: ${taxCodeBuildProfileNames.join(', ')}.`);
	}

	return profiles[requestedProfile];
}

export function applyTaxCodeBuildProfile<T extends object>(baseProduct: T, profile = getTaxCodeBuildProfile()): T & ITaxCodeProductConfiguration {
	const result = structuredClone(baseProduct) as T & Record<string, unknown>;
	for (const property of profile.removeProductProperties) {
		delete result[property];
	}
	Object.assign(result, profile.product);
	return result as T & ITaxCodeProductConfiguration;
}

export function getTaxCodeBuildFolderName(platform: string, arch: string, profile = getTaxCodeBuildProfile()): string {
	return `${profile.artifactName}-${platform}-${arch}`;
}
