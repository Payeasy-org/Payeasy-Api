import { Product } from '@/api/shopping/interfaces';
import { IntegrationService, Provider } from '../types';

export class RetailrIntegrationService implements IntegrationService {
    private provider: Provider = { name: 'Retailr' };

    private products: Product[] = [
        { sku: 'R123', name: 'Retailr Laptop', price: 1600 },
        { sku: 'R124', name: 'Retailr Smartphone', price: 900 },
    ];

    getProvider(): Provider {
        return this.provider;
    }

    async fetchProduct(sku: string): Promise<Product> {
        const product = this.products.find((p) => p.sku === sku);
        if (!product) {
            throw new Error(`Retailr: Product with SKU ${sku} not found`);
        }
        return product;
    }

    async searchProducts(query: string): Promise<Product[]> {
        return this.products.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()));
    }
}


