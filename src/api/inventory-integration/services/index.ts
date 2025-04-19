import { IntegrationService, Providers } from '../interfaces';
import { RetailrIntegrationService } from './retailr';

/**
 * Factory method to create an IntegrationService for a given provider.
 * Validates that the provider is supported and returns the corresponding service.
 * @param providerName - the name of the integration provider
 */
export function createIntegrationService(provider: Providers): IntegrationService {
    switch (provider) {
        case Providers.Retailr:
            return new RetailrIntegrationService(provider);

        default:
            throw new Error(`Unsupported integration provider: ${provider}`);
    }
}
