/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { ensureNoDisposablesAreLeakedInTestSuite } from '../../../../base/test/common/utils.js';
import { getTaxCodeUpdateFromManifest, ITaxCodeUpdateManifest, TaxCodeUpdateProfile } from '../../common/taxCodeUpdate.js';

suite('TaxCodeUpdateManifest', () => {

	ensureNoDisposablesAreLeakedInTestSuite();

	const sha256 = 'a'.repeat(64);
	const createManifest = (version = '1.139.3'): ITaxCodeUpdateManifest => ({
		schemaVersion: 1,
		version,
		release: `taxcode-v${version}`,
		publishedAt: '2026-09-28T00:00:00.000Z',
		profiles: {
			plugins: {
				url: `https://github.com/Taxperia/TaxCode/releases/download/taxcode-v${version}/TaxCode-${version}-Plugins-UserSetup-x64.exe`,
				sha256,
			},
			'no-extensions': {
				url: `https://github.com/Taxperia/TaxCode/releases/download/taxcode-v${version}/TaxCode-${version}-NoExtensions-UserSetup-x64.exe`,
				sha256,
			},
			'low-memory': {
				url: `https://github.com/Taxperia/TaxCode/releases/download/taxcode-v${version}/TaxCode-${version}-LowMemory-UserSetup-x64.exe`,
				sha256,
			},
		},
	});

	for (const profile of ['plugins', 'no-extensions', 'low-memory'] as const) {
		test(`selects the ${profile} installer`, () => {
			const update = getTaxCodeUpdateFromManifest(createManifest(), profile, '1.139.2');
			assert.deepStrictEqual(update, {
				version: 'taxcode-v1.139.3',
				productVersion: '1.139.3',
				timestamp: Date.parse('2026-09-28T00:00:00.000Z'),
				url: createManifest().profiles[profile]?.url,
				sha256hash: sha256,
			});
		});
	}

	test('ignores the installed or an older release', () => {
		assert.deepStrictEqual([
			getTaxCodeUpdateFromManifest(createManifest('1.139.2'), 'plugins', '1.139.2'),
			getTaxCodeUpdateFromManifest(createManifest('1.139.1'), 'plugins', '1.139.2'),
		], [null, null]);
	});

	test('rejects an asset outside the TaxCode GitHub release', () => {
		const original = createManifest();
		const manifest: ITaxCodeUpdateManifest = {
			...original,
			profiles: {
				...original.profiles,
				plugins: { url: 'https://example.com/TaxCode.exe', sha256 },
			},
		};
		assert.throws(() => getTaxCodeUpdateFromManifest(manifest, 'plugins', '1.139.2'), /Invalid TaxCode update asset/);
	});

	test('rejects missing profiles and invalid hashes', () => {
		const original = createManifest();
		assert.throws(() => getTaxCodeUpdateFromManifest({ ...original, profiles: {} }, 'plugins', '1.139.2'), /Invalid TaxCode update asset/);
		assert.throws(() => getTaxCodeUpdateFromManifest({
			...original,
			profiles: { plugins: { url: original.profiles.plugins!.url, sha256: 'bad' } },
		}, 'plugins', '1.139.2'), /Invalid TaxCode update asset/);
	});

	test('rejects invalid versions, releases, timestamps, and profiles', () => {
		const original = createManifest();
		assert.throws(() => getTaxCodeUpdateFromManifest({ ...original, version: 'latest' }, 'plugins', '1.139.2'), /Invalid TaxCode update version/);
		assert.throws(() => getTaxCodeUpdateFromManifest({ ...original, release: 'latest' }, 'plugins', '1.139.2'), /Invalid TaxCode update version/);
		assert.throws(() => getTaxCodeUpdateFromManifest({ ...original, publishedAt: 'invalid' }, 'plugins', '1.139.2'), /Invalid TaxCode update timestamp/);
		assert.throws(() => getTaxCodeUpdateFromManifest(original, 'missing' as TaxCodeUpdateProfile, '1.139.2'), /Invalid TaxCode update asset/);
	});
});
