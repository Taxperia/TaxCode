/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import * as fs from 'fs';

/**
 * Removes the Authenticode certificate table reference from a PE file. The
 * certificate blob is truncated when it is the final file payload. This keeps
 * local unsigned TaxCode builds patchable even when the Windows SDK is absent.
 */
export function stripPortableExecutableSignature(filePath: string): boolean {
	const contents = fs.readFileSync(filePath);
	if (contents.length < 0x40 || contents.readUInt16LE(0) !== 0x5A4D) {
		throw new Error(`Not a valid Windows executable: ${filePath}`);
	}

	const peHeaderOffset = contents.readUInt32LE(0x3C);
	const optionalHeaderOffset = peHeaderOffset + 24;
	if (optionalHeaderOffset + 2 > contents.length || contents.readUInt32LE(peHeaderOffset) !== 0x00004550) {
		throw new Error(`Not a valid PE file: ${filePath}`);
	}

	const optionalHeaderMagic = contents.readUInt16LE(optionalHeaderOffset);
	const dataDirectoryOffset = optionalHeaderMagic === 0x10B
		? optionalHeaderOffset + 96
		: optionalHeaderMagic === 0x20B
			? optionalHeaderOffset + 112
			: undefined;
	if (dataDirectoryOffset === undefined) {
		throw new Error(`Unsupported PE optional header in: ${filePath}`);
	}

	const certificateDirectoryOffset = dataDirectoryOffset + (4 * 8);
	if (certificateDirectoryOffset + 8 > contents.length) {
		throw new Error(`Invalid PE certificate directory in: ${filePath}`);
	}

	const certificateOffset = contents.readUInt32LE(certificateDirectoryOffset);
	const certificateSize = contents.readUInt32LE(certificateDirectoryOffset + 4);
	if (certificateOffset === 0 || certificateSize === 0) {
		return false;
	}
	if (certificateOffset > contents.length || certificateSize > contents.length - certificateOffset) {
		throw new Error(`Invalid Authenticode certificate range in: ${filePath}`);
	}

	contents.fill(0, certificateDirectoryOffset, certificateDirectoryOffset + 8);
	const certificateEnd = certificateOffset + certificateSize;
	fs.writeFileSync(filePath, certificateEnd === contents.length ? contents.subarray(0, certificateOffset) : contents);
	return true;
}
