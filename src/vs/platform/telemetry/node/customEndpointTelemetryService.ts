/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { IConfigurationService } from '../../configuration/common/configuration.js';
import { IEnvironmentService } from '../../environment/common/environment.js';
import { ILoggerService } from '../../log/common/log.js';
import { IProductService } from '../../product/common/productService.js';
import { ICustomEndpointTelemetryService, ITelemetryData, ITelemetryEndpoint, ITelemetryService } from '../common/telemetry.js';

export class CustomEndpointTelemetryService implements ICustomEndpointTelemetryService {
	declare readonly _serviceBrand: undefined;

	constructor(
		@IConfigurationService _configurationService: IConfigurationService,
		@ITelemetryService _telemetryService: ITelemetryService,
		@ILoggerService _loggerService: ILoggerService,
		@IEnvironmentService _environmentService: IEnvironmentService,
		@IProductService _productService: IProductService
	) { }

	publicLog(_telemetryEndpoint: ITelemetryEndpoint, _eventName: string, _data?: ITelemetryData) {
		// Telemetry is disabled for this product variant.
	}

	publicLogError(_telemetryEndpoint: ITelemetryEndpoint, _errorEventName: string, _data?: ITelemetryData) {
		// Telemetry is disabled for this product variant.
	}
}
