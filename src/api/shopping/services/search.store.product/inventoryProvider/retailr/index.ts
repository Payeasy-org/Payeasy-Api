import { BadRequestError, config, logger } from '@/core';
import { ServerError } from '@/core/errors/serverError';
import axios from 'axios';
import { RetailrLoginResponse, RetailrBranchItemResponse, ResponseDTO } from '@/api/inventory-integration/services/retailr/types/apiResponse';
import { Request } from 'express';

export class RetailrIntegrationService {
  private apiUrl = 'https://api.retailr.co/api/v1';
  private email = config.inventories.retailr.email;
  private password = config.inventories.retailr.password;

  validateConfig(cfg: Record<string, any>) {
    if (!cfg.store_id)  throw new BadRequestError('No store_id Provided');
    if (!cfg.branch_id) throw new BadRequestError('No branch_id Provided');
  }

  
  private async getToken(req: Request): Promise<string> {
    let token: string | undefined = req.session.retailrToken;

    if (token) {
      return token;
    }
    try {
      const { data } = await axios.post<RetailrLoginResponse>(
        `${this.apiUrl}/users/login/`,
        { email: this.email, password: this.password }
      );
      token = data.data.access;
      req.session.retailrToken = token;

      req.session.save(err => {
        if (err) logger.error('Failed to save session token:', err);
      });
      return token;
    } catch (err: any) {
      logger.error(`Retailr Authentication Failed: ${err.response?.data?.message || err.message}`);
      throw new ServerError(`Authentication error: ${err.message}`);
    }
  }

 
  async getProduct(
    req: Request,
    data: { product_id: number }
  ): Promise<ResponseDTO | null> {
    const { product_id } = data;
    if (!product_id) {
      logger.error('Missing product_id');
      return null;
    }

    try {
      const token = await this.getToken(req);
      const resp = await axios.get<ResponseDTO>(
        `${this.apiUrl}/branch-items/${product_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (resp.data.status === 'success') {
        return resp.data;
      } else {
        logger.error(`Retailr API Error: ${resp.data.message}`);
        return null;
      }
    } catch (err: any) {
      // If auth error, clear token so next call will re-auth
      if (err.response?.status === 401) {
        // @ts-ignore
        delete req.session.retailrToken;
      }
      logger.error(`Retailr Fetch Error: ${err.message}`);
      return null;
    }
  }
}
