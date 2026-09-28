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
	assert.equal(configuredProduct.quality, 'stable');
	assert.equal(configuredProduct.updateUrl, 'https://github.com/Taxperia/TaxCode/releases/latest/download/taxcode-update.json');
	assert.equal(configuredProduct.taxCodeUpdateManifestUrl, configuredProduct.updateUrl);
	assert.deepEqual(configuredProduct.builtInExtensionsEnabledWithAutoUpdates, []);
	assert.ok(configuredProduct.trustedExtensionAuthAccess);
	assert.equal(getTaxCodeBuildFolderName('win32', 'x64', profile), `${profile.artifactName}-win32-x64`);

	if (profile.includeExtensions) {
		assert.equal(configuredProduct.taxCodeExtensionsEnabled, true);
		assert.ok(configuredProduct.extensionsGallery);
		assert.ok(defaultChatAgent);
	} else {
		assert.equal(configuredProduct.taxCodeExtensionsEnabled, false);
		assert.deepEqual(configuredProduct.builtInExtensions, []);
		assert.ok(!('extensionsGallery' in configuredProduct));
		assert.ok(defaultChatAgent);
	}
}

const lite = applyTaxCodeBuildProfile(product, getTaxCodeBuildProfile({ TAXCODE_BUILD_PROFILE: 'low-memory' }));
assert.equal(lite.taxCodeLowMemoryMode, true);
assert.equal(lite.taxCodeDefaultMaxOldSpaceSize, 512);
assert.equal(lite.taxCodeDisableHardwareAcceleration, true);

console.log('TaxCode build profiles are valid.');
