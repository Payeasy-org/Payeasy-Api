import { BadRequestError } from '@/core';
import { RetailrIntegrationService } from './inventoryProvider/retailr';

/**
 * Supported inventory providers.
 */
export enum Providers {
    Retailr = 'RETAILR',
}

/**
 * Validates whether the given provider string is supported.
 */
export const isValidInventory = (input: string): input is Providers => {
    return Object.values(Providers).includes(input as Providers);
};

/**
 * Factory to return the appropriate inventory integration service
 * based solely on the provider identifier.
 */
export const getInventoryService= (inventoryProvider: string) => {
    if (!isValidInventory(inventoryProvider)) {
        throw new BadRequestError(`Invalid inventory provider: ${inventoryProvider}`);
    }

    switch (inventoryProvider) {
        case Providers.Retailr:
            return new RetailrIntegrationService();
        default:
            // This branch should never be hit due to the validation above
            throw new BadRequestError(`No service implemented for provider: ${inventoryProvider}`);
    }
};
