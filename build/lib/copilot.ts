/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';
import * as path from 'path';

/**
 * The platforms that @github/copilot ships platform-specific packages for.
 * These are the `@github/copilot-{platform}` optional dependency packages.
 */
export const copilotPlatforms = [
	'darwin-arm64', 'darwin-x64',
	'linux-arm64', 'linux-x64',
	'win32-arm64', 'win32-x64',
];

/**
 * Converts VS Code build platform/arch to the values that Node.js reports
 * at runtime via `process.platform` and `process.arch`.
 *
 * The copilot SDK's `loadNativeModule` looks up native binaries under
 * `prebuilds/${process.platform}-${process.arch}/`, so the directory names
 * must match these runtime values exactly.
 */
function toNodePlatformArch(platform: string, arch: string): { nodePlatform: string; nodeArch: string } {
	// alpine is musl-linux; Node still reports process.platform === 'linux'
	let nodePlatform = platform === 'alpine' ? 'linux' : platform;
	let nodeArch = arch;

	if (arch === 'armhf') {
		// VS Code build uses 'armhf'; Node reports process.arch === 'arm'
		nodeArch = 'arm';
	} else if (arch === 'alpine') {
		// Legacy: { platform: 'linux', arch: 'alpine' } means alpine-x64
		nodePlatform = 'linux';
		nodeArch = 'x64';
	}

	return { nodePlatform, nodeArch };
}

/**
 * Returns a glob filter that strips @github/copilot platform packages
 * for architectures other than the build target.
 *
 * For platforms the copilot SDK doesn't natively support (e.g. alpine, armhf),
 * ALL platform packages are stripped - that's fine because the copilot CLI SDK
 * resolves `node-pty` from the embedder (VS Code) first via `hostRequire`,
 * falling back to its bundled copy only if the embedder can't provide it.
 */
export function getCopilotExcludeFilter(platform: string, arch: string): string[] {
	const { nodePlatform, nodeArch } = toNodePlatformArch(platform, arch);
	const targetPlatformArch = `${nodePlatform}-${nodeArch}`;
	const nonTargetPlatforms = copilotPlatforms.filter(p => p !== targetPlatformArch);

	// Strip wrong-architecture @github/copilot-{platform} packages.
	// All copilot prebuilds are stripped by .moduleignore; the copilot CLI SDK
	// resolves `node-pty` from VS Code's own node_modules via `hostRequire`.
	const excludes = nonTargetPlatforms.map(p => `!**/node_modules/@github/copilot-${p}/**`);

	const pvRecorderPlatformArch = nodePlatform === 'win32'
		? nodeArch === 'x64' ? 'windows/amd64' : nodeArch === 'arm64' ? 'windows/arm64' : undefined
		: nodePlatform === 'darwin'
			? nodeArch === 'x64' ? 'mac/x86_64' : nodeArch === 'arm64' ? 'mac/arm64' : undefined
			: nodePlatform === 'linux' && nodeArch === 'x64' ? 'linux/x86_64' : undefined;
	const pvRecorderTargets = ['linux/x86_64', 'mac/arm64', 'mac/x86_64', 'windows/amd64', 'windows/arm64'];
	const nonTargetPvRecorderPaths = pvRecorderTargets
		.filter(p => p !== pvRecorderPlatformArch)
		.map(p => `!**/node_modules/@github/copilot/pvrecorder/node_modules/@picovoice/pvrecorder-node/lib/${p}/**`);
	const foundryTargets = ['darwin-arm64', 'linux-x64', 'win32-arm64', 'win32-x64'];
	const nonTargetFoundryPaths = foundryTargets
		.filter(p => p !== targetPlatformArch)
		.map(p => `!**/node_modules/@github/copilot/foundry-local-sdk/node_modules/foundry-local-sdk/prebuilds/${p}/**`);
	const copilotSdkTargets = ['darwin-arm64', 'darwin-x64', 'linux-arm64', 'linux-x64', 'win32-arm64', 'win32-x64'];
	const nonTargetCopilotSdkPaths = copilotSdkTargets
		.filter(p => p !== targetPlatformArch)
		.map(p => `!**/node_modules/@github/copilot/sdk/prebuilds/${p}/**`);
	const nodePtyTargets = ['darwin-arm64', 'darwin-x64', 'linux-arm64', 'linux-x64', 'win32-arm64', 'win32-x64'];
	const nonTargetNodePtyPaths = nodePtyTargets
		.filter(p => p !== targetPlatformArch)
		.map(p => `!**/node_modules/node-pty/prebuilds/${p}/**`);
	const audioCapturePlatformArch = `${nodeArch}-${nodePlatform}`;
	const audioCaptureTargets = ['arm64-darwin', 'arm64-win32', 'arm64-linux', 'x64-win32', 'x64-darwin', 'x64-linux'];
	const nonTargetAudioCapturePaths = audioCaptureTargets
		.filter(p => p !== audioCapturePlatformArch)
		.map(p => `!**/node_modules/@anthropic-ai/claude-agent-sdk/vendor/audio-capture/${p}/**`);

	return ['**', ...excludes, ...nonTargetPvRecorderPaths, ...nonTargetFoundryPaths, ...nonTargetCopilotSdkPaths, ...nonTargetNodePtyPaths, ...nonTargetAudioCapturePaths];
}

/**
 * Materializes the copilot CLI ripgrep shim directly inside the built-in copilot extension.
 *
 * This is used when copilot is shipped as a built-in extension so startup does
 * not need to create the shim at runtime. The destination layout matches the
 * runtime shim logic in the copilot extension:
 * - ripgrep:  node_modules/@github/copilot/sdk/ripgrep/bin/{platform-arch}
 * - marker:   node_modules/@github/copilot/shims.txt
 *
 * Note: `node-pty` is no longer shimmed. The copilot CLI SDK resolves
 * `node-pty` from the embedder (VS Code) via `hostRequire` and falls back to
 * its bundled copy only if that fails.
 *
 * Failures throw to fail the build because built-in packaging must guarantee
 * this artifact is present.
 */
export function prepareBuiltInCopilotRipgrepShim(platform: string, arch: string, builtInCopilotExtensionDir: string, appNodeModulesDir: string): void {
	const { nodePlatform, nodeArch } = toNodePlatformArch(platform, arch);
	const platformArch = `${nodePlatform}-${nodeArch}`;

	const extensionNodeModules = path.join(builtInCopilotExtensionDir, 'node_modules');
	const copilotBase = path.join(extensionNodeModules, '@github', 'copilot');
	if (!fs.existsSync(copilotBase)) {
		throw new Error(`[prepareBuiltInCopilotRipgrepShim] Copilot package directory not found at ${copilotBase}`);
	}

	const copilotSdkBase = path.join(copilotBase, 'sdk');

	const ripgrepSource = path.join(appNodeModulesDir, '@vscode', 'ripgrep', 'bin');
	if (!fs.existsSync(ripgrepSource)) {
		throw new Error(`[prepareBuiltInCopilotRipgrepShim] ripgrep source not found at ${ripgrepSource}`);
	}

	const ripgrepDest = path.join(copilotSdkBase, 'ripgrep', 'bin', platformArch);
	const shimMarkerPath = path.join(copilotBase, 'shims.txt');

	try {
		fs.mkdirSync(ripgrepDest, { recursive: true });
		fs.cpSync(ripgrepSource, ripgrepDest, { recursive: true });

		fs.writeFileSync(shimMarkerPath, 'Shims created successfully');
		console.log(`[prepareBuiltInCopilotRipgrepShim] Materialized ripgrep shim for ${platformArch} in ${builtInCopilotExtensionDir}`);
	} catch (err) {
		throw new Error(`[prepareBuiltInCopilotRipgrepShim] Failed to materialize ripgrep shim for ${platformArch}: ${err}`);
	}
}
