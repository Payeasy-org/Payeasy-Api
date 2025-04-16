import { RetailrIntegrationService } from './retailr';
import { IntegrationService } from './types';

/**
 * Returns an instance of the appropriate IntegrationService.
 *
 * @param {string} providerName - The name of the provider.
 * @returns {IntegrationService} An instance of an integration service.
 * @throws Will throw an error if the provider is not supported.
 * 
 * @usecase: The provider could be determined dynamically; here it's hardcoded for the example.
 *      const selectedProvider = 'Retailr';
 *      Retrieve the integration service for the given provider.
 *      const integrationService = IntegrationServiceFactory.getService(selectedProvider);
 *      const product = await integrationService.fetchProduct('R123');
 */
export class IntegrationServiceFactory {
    static getService(providerName: string): IntegrationService {
        switch (providerName.toLowerCase()) {
            case 'retailr':
                return new RetailrIntegrationService();

            default:
                throw new Error(`Provider ${providerName} is not supported`);
        }
    }
}
