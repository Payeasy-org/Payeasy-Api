import { BadRequestError, config, logger } from '@/core';
import { ServerError } from '@/core/errors/serverError';
import axios from 'axios';
import { RetailrLoginResponse, RetailrBranchItemResponse, ResponseDTO } from '@/api/inventory-integration/services/retailr/types/apiResponse';

export class RetailrIntegrationService {
    private payeasyEmail: string = config.inventories.retailr.email;
    private payeasyPassword: string = config.inventories.retailr.password;
    private apiUrl: string = 'https://api.retailr.co/api/v1';

    validateConfig(config: Record<string, any>) {
        if (!config?.store_id) throw new BadRequestError('No store_id Provided');
        if (!config?.branch_id) throw new BadRequestError('No branch_id Provided');
    }

    /**
     * Fetch product details from Retailr
     * @param data store_id, branch_id, product_id
     * @returns RetailrBranchItemResponse | null
     */
    async getProduct(data: { product_id: number }): Promise<ResponseDTO | null> {
        const { product_id } = data;

        if (!product_id) {
            logger.error('Missing store_id, branch_id, or product_id');
            return null;
        }

        try {
            const token = await this.authenticate();

            if (!token) {
                logger.error('Could not authenticate into Retailr');
                return null;
            }

            const response = await axios.get<ResponseDTO>(`${this.apiUrl}/branch-items/${product_id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.status === 'success') {
                return response.data; // This is the entire ResponseDTO object
            } else {
                logger.error(`Retailr API Error: ${response.data.message}`);
                return null;
            }
        } catch (error: any) {
            logger.error(`Retailr Fetch Error: ${error.message}`);
            return null;
        }
    }

    private async authenticate(): Promise<string> {
        try {
            const response = await axios.post<RetailrLoginResponse>(`${this.apiUrl}/users/login/`, {
                email: this.payeasyEmail,
                password: this.payeasyPassword,
            });

            return response.data?.data?.access;
        } catch (error: any) {
            if (error.response) {
                logger.error(`Retailr Authentication Failed: ${error.response.data.message || error.response.statusText}`);
            }
            throw new ServerError(`Authentication error: ${error.message}`);
        }
    }
}
