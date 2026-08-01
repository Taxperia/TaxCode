/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CancellationToken } from '../../../../base/common/cancellation.js';
import { Disposable } from '../../../../base/common/lifecycle.js';
import { URI } from '../../../../base/common/uri.js';
import { localize, localize2 } from '../../../../nls.js';
import { MenuId, registerAction2, Action2 } from '../../../../platform/actions/common/actions.js';
import { Categories } from '../../../../platform/action/common/actionCommonCategories.js';
import { IConfigurationService } from '../../../../platform/configuration/common/configuration.js';
import { ConfigurationScope, Extensions as ConfigurationExtensions, IConfigurationRegistry } from '../../../../platform/configuration/common/configurationRegistry.js';
import { ServicesAccessor } from '../../../../platform/instantiation/common/instantiation.js';
import { ILogService } from '../../../../platform/log/common/log.js';
import { INotificationService, NotificationPriority, Severity } from '../../../../platform/notification/common/notification.js';
import { IOpenerService } from '../../../../platform/opener/common/opener.js';
import { IProductService } from '../../../../platform/product/common/productService.js';
import { asJson, IRequestService, NO_FETCH_TELEMETRY } from '../../../../platform/request/common/request.js';
import { Registry } from '../../../../platform/registry/common/platform.js';
import { IStorageService, StorageScope, StorageTarget } from '../../../../platform/storage/common/storage.js';
import { IWorkbenchContribution, registerWorkbenchContribution2, WorkbenchPhase } from '../../../common/contributions.js';

const TAXCODE_UPDATE_CHECK_ON_STARTUP = 'taxcode.update.checkOnStartup';
const TAXCODE_UPDATE_IGNORED_VERSION_STORAGE_KEY = 'taxcode.githubUpdate.ignoredVersion';
const DEFAULT_TAXCODE_RELEASE_API_URL = 'https://api.github.com/repos/Taxperia/TaxCode/releases/latest';
const DEFAULT_TAXCODE_RELEASE_URL = 'https://github.com/Taxperia/TaxCode/releases/latest';

interface IGitHubLatestRelease {
	readonly tag_name?: string;
	readonly name?: string;
	readonly html_url?: string;
	readonly draft?: boolean;
	readonly prerelease?: boolean;
}

interface IParsedVersion {
	readonly major: number;
	readonly minor: number;
	readonly patch: number;
	readonly label: string;
}

interface ITaxCodeUpdateResult {
	readonly latestVersion: IParsedVersion;
	readonly tagName: string;
	readonly releaseUrl: string;
}

class TaxCodeGithubUpdateContribution extends Disposable implements IWorkbenchContribution {

	static readonly ID = 'workbench.contrib.taxcodeGithubUpdate';

	constructor(
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IProductService private readonly productService: IProductService,
		@IRequestService private readonly requestService: IRequestService,
		@INotificationService private readonly notificationService: INotificationService,
		@IOpenerService private readonly openerService: IOpenerService,
		@IStorageService private readonly storageService: IStorageService,
		@ILogService private readonly logService: ILogService
	) {
		super();

		void this.checkForUpdatesOnStartup();
	}

	private async checkForUpdatesOnStartup(): Promise<void> {
		if (!this.configurationService.getValue<boolean>(TAXCODE_UPDATE_CHECK_ON_STARTUP)) {
			return;
		}

		try {
			await checkForTaxCodeUpdates({
				manual: false,
				productService: this.productService,
				requestService: this.requestService,
				notificationService: this.notificationService,
				openerService: this.openerService,
				storageService: this.storageService,
				logService: this.logService
			});
		} catch (error) {
			this.logService.trace('TaxCode GitHub update check failed', error);
		}
	}
}

async function checkForTaxCodeUpdates(context: {
	readonly manual: boolean;
	readonly productService: IProductService;
	readonly requestService: IRequestService;
	readonly notificationService: INotificationService;
	readonly openerService: IOpenerService;
	readonly storageService: IStorageService;
	readonly logService: ILogService;
}): Promise<void> {
	const productUpdate = context.productService.taxcodeUpdate;
	if (productUpdate?.enabled === false) {
		if (context.manual) {
			context.notificationService.info(localize('taxcodeUpdate.disabled', "TaxCode GitHub update checks are disabled for this build."));
		}
		return;
	}

	const currentVersion = parseVersion(context.productService.version);
	if (!currentVersion) {
		context.logService.warn(`TaxCode GitHub update check skipped: invalid current version '${context.productService.version}'.`);
		return;
	}

	const releaseApiUrl = productUpdate?.releaseApiUrl ?? DEFAULT_TAXCODE_RELEASE_API_URL;
	const releaseUrl = productUpdate?.releaseUrl ?? DEFAULT_TAXCODE_RELEASE_URL;
	const latest = await fetchLatestRelease(context.requestService, releaseApiUrl, releaseUrl, context.logService);
	if (!latest) {
		if (context.manual) {
			context.notificationService.warn(localize('taxcodeUpdate.unavailable', "TaxCode could not check GitHub Releases right now."));
		}
		return;
	}

	if (compareVersions(latest.latestVersion, currentVersion) <= 0) {
		if (context.manual) {
			context.notificationService.info(localize('taxcodeUpdate.upToDate', "TaxCode is up to date."));
		}
		return;
	}

	const ignoredVersion = context.storageService.get(TAXCODE_UPDATE_IGNORED_VERSION_STORAGE_KEY, StorageScope.APPLICATION);
	if (!context.manual && ignoredVersion === latest.tagName) {
		return;
	}

	showUpdateNotification(latest, context.productService.version, context.notificationService, context.openerService, context.storageService);
}

async function fetchLatestRelease(requestService: IRequestService, releaseApiUrl: string, fallbackReleaseUrl: string, logService: ILogService): Promise<ITaxCodeUpdateResult | undefined> {
	const requestResult = await requestService.request({
		type: 'GET',
		url: releaseApiUrl,
		disableCache: true,
		timeout: 15000,
		headers: {
			'Accept': 'application/vnd.github+json',
			'User-Agent': 'TaxCode'
		},
		callSite: NO_FETCH_TELEMETRY
	}, CancellationToken.None);

	if (requestResult.res.statusCode !== 200) {
		logService.warn(`TaxCode GitHub update check failed: HTTP ${requestResult.res.statusCode}.`);
		return undefined;
	}

	const release = await asJson<IGitHubLatestRelease>(requestResult);
	if (!release || release.draft || release.prerelease || !release.tag_name) {
		return undefined;
	}

	const latestVersion = parseVersion(release.tag_name);
	if (!latestVersion) {
		logService.warn(`TaxCode GitHub update check ignored release with non-semver tag '${release.tag_name}'.`);
		return undefined;
	}

	return {
		latestVersion,
		tagName: release.tag_name,
		releaseUrl: release.html_url ?? fallbackReleaseUrl
	};
}

function showUpdateNotification(update: ITaxCodeUpdateResult, currentVersion: string, notificationService: INotificationService, openerService: IOpenerService, storageService: IStorageService): void {
	notificationService.prompt(
		Severity.Info,
		localize('taxcodeUpdate.available', "TaxCode {0} is available. You are using {1}.", update.latestVersion.label, currentVersion),
		[
			{
				label: localize('taxcodeUpdate.openRelease', "Open Release"),
				run: () => {
					void openerService.open(URI.parse(update.releaseUrl));
				}
			},
			{
				label: localize('taxcodeUpdate.ignoreVersion', "Ignore This Version"),
				isSecondary: true,
				run: () => {
					storageService.store(TAXCODE_UPDATE_IGNORED_VERSION_STORAGE_KEY, update.tagName, StorageScope.APPLICATION, StorageTarget.USER);
				}
			}
		],
		{
			priority: NotificationPriority.DEFAULT
		}
	);
}

function parseVersion(value: string | undefined): IParsedVersion | undefined {
	if (!value) {
		return undefined;
	}

	const match = /(\d+)\.(\d+)\.(\d+)/.exec(value);
	if (!match) {
		return undefined;
	}

	return {
		major: Number(match[1]),
		minor: Number(match[2]),
		patch: Number(match[3]),
		label: `${match[1]}.${match[2]}.${match[3]}`
	};
}

function compareVersions(a: IParsedVersion, b: IParsedVersion): number {
	if (a.major !== b.major) {
		return a.major - b.major;
	}
	if (a.minor !== b.minor) {
		return a.minor - b.minor;
	}
	return a.patch - b.patch;
}

registerAction2(class TaxCodeCheckForUpdatesAction extends Action2 {
	constructor() {
		super({
			id: 'taxcode.checkForUpdates',
			title: localize2('taxcodeUpdate.checkForUpdates', "TaxCode: Check for Updates..."),
			category: Categories.Help,
			f1: true,
			menu: [{
				id: MenuId.MenubarHelpMenu,
				group: '1_welcome',
				order: 6
			}]
		});
	}

	async run(accessor: ServicesAccessor): Promise<void> {
		await checkForTaxCodeUpdates({
			manual: true,
			productService: accessor.get(IProductService),
			requestService: accessor.get(IRequestService),
			notificationService: accessor.get(INotificationService),
			openerService: accessor.get(IOpenerService),
			storageService: accessor.get(IStorageService),
			logService: accessor.get(ILogService)
		});
	}
});

Registry.as<IConfigurationRegistry>(ConfigurationExtensions.Configuration).registerConfiguration({
	id: 'taxcode',
	order: 10,
	title: localize('taxcodeConfigurationTitle', "TaxCode"),
	type: 'object',
	properties: {
		[TAXCODE_UPDATE_CHECK_ON_STARTUP]: {
			scope: ConfigurationScope.APPLICATION,
			type: 'boolean',
			default: true,
			description: localize('taxcode.update.checkOnStartup.description', "Controls whether TaxCode checks GitHub Releases for a newer version after startup. This sends one non-telemetry GitHub Releases API request.")
		}
	}
});

registerWorkbenchContribution2(TaxCodeGithubUpdateContribution.ID, TaxCodeGithubUpdateContribution, WorkbenchPhase.Eventually);
