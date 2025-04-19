import { Product } from '@/api/shopping/interfaces';

export enum Providers {
    Retailr = 'RETAILR',
}

export const inventoryProviders = Object.values(Providers) as string[];

/**
 * Base abstract class for all inventory integration services.
 * @param {Providers} providerName - The name of the provider.
 * @returns {IntegrationService} An instance of an integration service.
 * @throws Will throw an error if the provider is not supported.
 *
 * Each subclass must implement methods to validate its configuration
 * and test connectivity to the provider's system.
 * @usecase: The provider could be determined dynamically; here it's hardcoded for the example.
 *      const svc = IntegrationService.createFromProvider(Providers.Retailr);
 *      svc.validateConfig(storePayload);
 *      Retrieve the integration service for the given provider.
 *      const product = await svc.fetchProduct('R123');
 */
export abstract class IntegrationService {
    protected constructor(protected readonly providerName: Providers) {}

    /**
     * Validates the configuration parameters required by this integration.
     * E.g., API keys, store IDs, client secrets, etc.
     * @param config - the raw onboarding payload for the store
     * @throws Error if required parameters are missing or malformed
     */
    abstract validateConfig(config: Record<string, any>): void;

    /**
     * Attempts to connect to the provider's system using the validated config.
     * Should perform a lightweight API call (e.g., fetch store info) to confirm credentials.
     * @returns a promise that resolves to true if the connection is successful, false otherwise
     */
    abstract testConnection(config: Record<string, any>): Promise<boolean>;

    /**
     * Fetches details for a single product by its SKU from the provider.
     * @param sku - the stock keeping unit identifier of the product
     * @returns a promise resolving to the Product details
     * @throws Error if the product is not found or the request fails
     */
    abstract fetchProduct(sku: string): Promise<Product>;

    /**
     * Searches for products matching a query string in the provider's catalog.
     * @param query - the search term to filter products
     * @returns a promise resolving to an array of matching Product items
     */
    abstract searchProducts(query: string): Promise<Product[]>;
}
