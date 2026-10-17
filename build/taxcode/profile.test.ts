/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'node:assert/strict';
import product from '../../product.json' with { type: 'json' };
import { applyTaxCodeBuildProfile, getTaxCodeBuildFolderName, getTaxCodeBuildProfile, taxCodeBuildProfileNames } from './profile.ts';

for (const name of taxCodeBuildProfileNames) {
	const profile = getTaxCodeBuildProfile({ TAXCODE_BUILD_PROFILE: name });
	const configuredProduct = applyTaxCodeBuildProfile(product, profile);
	const defaultChatAgent = (configuredProduct as unknown as { readonly defaultChatAgent?: unknown }).defaultChatAgent;
	assert.equal(configuredProduct.taxCodeProfile, name);
	assert.equal(configuredProduct.enableTelemetry, false);
	assert.equal(configuredProduct.removeTelemetryMachineId, true);
	assert.equal(configuredProduct.showTelemetryOptOut, false);
	assert.equal(configuredProduct.quality, 'stable');
	assert.equal(configuredProduct.updateUrl, 'https://github.com/Taxperia/TaxCode/releases/latest/download/taxcode-update.json');
	assert.equal(configuredProduct.taxCodeUpdateManifestUrl, configuredProduct.updateUrl);
	assert.deepEqual(configuredProduct.builtInExtensionsEnabledWithAutoUpdates, []);
	assert.equal(getTaxCodeBuildFolderName('win32', 'x64', profile), `${profile.artifactName}-win32-x64`);

	if (profile.includeExtensions) {
		assert.equal(configuredProduct.taxCodeExtensionsEnabled, true);
		assert.equal(configuredProduct.taxCodeDisableAuthentication, false);
		assert.ok(configuredProduct.extensionsGallery);
		assert.ok(configuredProduct.trustedExtensionAuthAccess);
		assert.ok(defaultChatAgent);
	} else {
		assert.equal(configuredProduct.taxCodeExtensionsEnabled, false);
		assert.equal(configuredProduct.taxCodeDisableAuthentication, true);
		assert.deepEqual(configuredProduct.builtInExtensions, []);
		assert.deepEqual(configuredProduct.taxCodeAllowedSystemExtensions, ['taxperia.theme-taxcode']);
		assert.equal(configuredProduct.extensionsGallery, undefined);
		assert.equal(configuredProduct.trustedExtensionAuthAccess, undefined);
		assert.equal(configuredProduct.voiceWsUrl, undefined);
		assert.ok(defaultChatAgent);
	}

	for (const forbiddenProperty of ['aiConfig', 'appCenter', 'crashReporter', 'tasConfig', 'telemetryUrl', 'telemetryKey']) {
		assert.equal((configuredProduct as Record<string, unknown>)[forbiddenProperty], undefined, `${forbiddenProperty} must not be present in TaxCode builds`);
	}
}

const lite = applyTaxCodeBuildProfile(product, getTaxCodeBuildProfile({ TAXCODE_BUILD_PROFILE: 'low-memory' }));
assert.equal(lite.taxCodeLowMemoryMode, true);
assert.equal(lite.taxCodeDefaultMaxOldSpaceSize, 512);
assert.deepEqual(lite.taxCodeMemoryLimitOptions, [256, 512, 768, 1024]);
assert.equal(lite.taxCodeDisableHardwareAcceleration, true);

console.log('TaxCode build profiles are valid.');
