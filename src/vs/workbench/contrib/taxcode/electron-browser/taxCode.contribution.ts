/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize, localize2 } from '../../../../nls.js';
import product from '../../../../platform/product/common/product.js';
import { Action2, registerAction2 } from '../../../../platform/actions/common/actions.js';
import { IDialogService } from '../../../../platform/dialogs/common/dialogs.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { IQuickInputService, IQuickPickItem } from '../../../../platform/quickinput/common/quickInput.js';
import { IJSONEditingService } from '../../../services/configuration/common/jsonEditing.js';
import { INativeWorkbenchEnvironmentService } from '../../../services/environment/electron-browser/environmentService.js';
import { IHostService } from '../../../services/host/browser/host.js';

interface ITaxCodeMemoryLimitPick extends IQuickPickItem {
	readonly value: number;
}

class SetTaxCodeMemoryLimitAction extends Action2 {

	constructor() {
		super({
			id: 'taxcode.action.setMemoryLimit',
			title: localize2('taxCode.setMemoryLimit', 'TaxCode: Set RAM Limit'),
			category: localize2('taxCode.category', 'TaxCode'),
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const quickInputService = accessor.get(IQuickInputService);
		const jsonEditingService = accessor.get(IJSONEditingService);
		const environmentService = accessor.get(INativeWorkbenchEnvironmentService);
		const dialogService = accessor.get(IDialogService);
		const hostService = accessor.get(IHostService);

		const options = product.taxCodeMemoryLimitOptions ?? [256, 512, 768, 1024];
		const picks: ITaxCodeMemoryLimitPick[] = options.map(value => ({
			value,
			label: localize('taxCode.memoryLimit.megabytes', "{0} MB", value),
			description: value === product.taxCodeDefaultMaxOldSpaceSize ? localize('taxCode.memoryLimit.recommended', "Recommended") : undefined
		}));

		const selected = await quickInputService.pick(picks, {
			placeHolder: localize('taxCode.memoryLimit.placeholder', "Select the JavaScript heap limit for TaxCode Lite")
		});
		if (!selected) {
			return;
		}

		await jsonEditingService.write(environmentService.argvResource, [{
			path: ['taxcode-memory-limit'],
			value: selected.value
		}], true);

		const { confirmed } = await dialogService.confirm({
			message: localize('taxCode.memoryLimit.restartMessage', "Restart TaxCode to apply the new RAM limit?"),
			detail: localize('taxCode.memoryLimit.restartDetail', "The JavaScript heap limit will be set to {0} MB.", selected.value),
			primaryButton: localize('taxCode.memoryLimit.restartButton', "Restart")
		});

		if (confirmed) {
			await hostService.restart();
		}
	}
}

if (product.taxCodeLowMemoryMode) {
	registerAction2(SetTaxCodeMemoryLimitAction);
}
