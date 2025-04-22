import { Product } from '@/api/shopping/interfaces';
import { BadRequestError, config, logger } from '@/core';
import { ServerError } from '@/core/errors/serverError';
import axios from 'axios';
import { IntegrationService, Providers } from '../../interfaces';
import { RetailrBranchItemResponse, RetailrLoginResponse } from './types/apiResponse';

export class RetailrIntegrationService extends IntegrationService {
    private storeId!: number;
    private branchId!: string;
    private payeasyEmail: string = config.inventories.retailr.email;
    private payeasyPassword: string = config.inventories.retailr.password;
    private apiUrl: string = 'https://api.retailr.co/api/v1';

    public constructor(providerName: Providers) {
        super(providerName);
    }

    validateConfig(config: Record<string, any>) {
        if (!config?.store_id) throw new BadRequestError('No store_id Provided');

        if (!config?.branch_id) throw new BadRequestError('No branch_id Provided');
    }

    async testConnection(data: any): Promise<boolean> {
        const store_id = data?.store_id;
        const branch_id = data?.branch_id;

        if (!store_id || !branch_id) {
            logger.error('No Store Id or Branch Id');
            return false;
        }

        try {
            const token = await this.authenticate();

            if (!token) {
                logger.error('Could not Authenticate into Retailr');

                return false;
            }

            const response = await axios.get<RetailrBranchItemResponse>(`${this.apiUrl}/branch-items`, {
                params: {
                    page_size: 1,
                    store_id,
                    branch_id,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.status === 'success') return true;
        } catch (error) {
            logger.error(`Testing Connection Error - ${error}`);
            return false;
        }

        return false;
    }

    private async authenticate() {
        try {
            const response = await axios.post<RetailrLoginResponse>(`${this.apiUrl}/users/login/`, {
                email: this.payeasyEmail,
                password: this.payeasyPassword,
            });

            return response.data?.data?.access;
        } catch (error: any) {
            if (error.response) {
                logger.error(`Could not Authenticate to Retailr - ${error.response?.data.message || error.response?.statusText} `);
            }

            throw new ServerError(`Authentication error: ${error.message}`);
        }
    }

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
}
