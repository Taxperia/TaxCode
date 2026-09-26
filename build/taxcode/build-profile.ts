/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as cp from 'child_process';
import * as path from 'path';
import packageConfiguration from '../../package.json' with { type: 'json' };
import { isTaxCodeBuildProfileName, taxCodeBuildProfileNames, type TaxCodeBuildProfileName } from './profile.ts';

function runGulpTask(profile: TaxCodeBuildProfileName, task: string): void {
	const root = path.dirname(path.dirname(import.meta.dirname));
	const gulpCli = path.join(root, 'node_modules', 'gulp', 'bin', 'gulp.js');
	const result = cp.spawnSync(process.execPath, ['--experimental-strip-types', '--max-old-space-size=4096', gulpCli, task], {
		cwd: root,
		env: {
			...process.env,
			TAXCODE_BUILD_PROFILE: profile,
			VSCODE_QUALITY: process.env['VSCODE_QUALITY'] ?? 'stable',
			BUILD_SOURCEVERSION: process.env['BUILD_SOURCEVERSION'] ?? packageConfiguration.distro,
		},
		stdio: 'inherit',
	});

	if (result.error) {
		throw result.error;
	}
	if (result.status !== 0) {
		throw new Error(`TaxCode '${profile}' task '${task}' failed with exit code ${result.status ?? 'unknown'}.`);
	}
}

const requestedProfile = process.argv[2] ?? '';
const createSetup = process.argv.includes('--setup');
const runBuild = (profile: TaxCodeBuildProfileName) => {
	runGulpTask(profile, 'vscode-win32-x64-min');
	if (createSetup) {
		runGulpTask(profile, 'vscode-win32-x64-inno-updater');
		runGulpTask(profile, 'vscode-win32-x64-user-setup');
	}
};

if (requestedProfile === 'all') {
	for (const profile of taxCodeBuildProfileNames) {
		runBuild(profile);
	}
} else if (isTaxCodeBuildProfileName(requestedProfile)) {
	runBuild(requestedProfile);
} else {
	console.error(`Usage: node build/taxcode/build-profile.ts <${taxCodeBuildProfileNames.join('|')}|all> [--setup]`);
	process.exitCode = 1;
}
