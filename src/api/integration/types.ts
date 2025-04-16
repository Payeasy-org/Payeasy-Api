import { Product } from '@/api/shopping/interfaces';

export interface Provider {
    name: string;
}

export interface IntegrationService {
    getProvider(): Provider;
    fetchProduct(sku: string): Promise<Product>;
    searchProducts(query: string): Promise<Product[]>;
}
