import { Product } from '@/api/shopping/interfaces';
import { IntegrationService } from '..';

export class RetailrIntegrationService extends IntegrationService {
    private storeId!: string;
    private branchId!: string;
    private payeasyEmail!: string;
    private payeasyPassword!: string;

    private products: Product[] = [
        { sku: 'R123', name: 'Retailr Laptop', price: 1600 },
        { sku: 'R124', name: 'Retailr Smartphone', price: 900 },
    ];

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

    async testConnection(data: any): Promise<boolean> {
        return true;
    }

    validateConfig(config: Record<string, any>): boolean {
        return true;
    }
}
