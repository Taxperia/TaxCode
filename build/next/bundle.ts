/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import type * as esbuild from 'esbuild';

const fileHeader = `/*!--------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/`;

export function getBundleOptions(minify: boolean, platform: 'neutral' | 'node'): esbuild.BuildOptions {
	const generateSourceMaps = process.env['TAXCODE_BUILD_WITHOUT_SOURCEMAPS'] !== '1';

	return {
		bundle: true,
		format: 'esm',
		platform,
		target: ['es2024'],
		packages: 'external',
		sourcemap: generateSourceMaps ? 'linked' : false,
		sourcesContent: generateSourceMaps,
		minify,
		treeShaking: true,
		// esbuild emits and scopes the helpers needed by each input. Keep executable
		// code out of banners, which esbuild cannot tree-shake, minify, or rename.
		banner: { js: fileHeader, css: fileHeader },
		write: false,
		logLevel: 'warning',
		logOverride: {
			'unsupported-require-call': 'silent',
		},
		tsconfigRaw: JSON.stringify({
			compilerOptions: {
				experimentalDecorators: true,
				useDefineForClassFields: false
			}
		}),
	};
}
