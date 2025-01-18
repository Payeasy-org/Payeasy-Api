import { InitializeTransactionPayload, PaymentStrategy, VerifyTransactionPayload } from '@/core/services/payment';
import axios from 'axios';
import { PaystackPaymentResponseTypes } from './paystack.interface';

export class PaystackPaymentStrategy implements PaymentStrategy<PaystackPaymentResponseTypes> {
    constructor(private readonly API_KEY: string, private readonly API_URL = 'https://api.paystack.co') {}

    async initializeTransaction(payload: InitializeTransactionPayload) {
        try {
            const response = await axios.post(`${this.API_URL}/transaction/initialize`, payload, {
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });

            return response.data;
        } catch (error: any) {
            throw new Error(error.response.data?.message);
        }
    }

    async verifyTransaction(payload: VerifyTransactionPayload): Promise<any> {
        const { reference } = payload;

        const response = await axios.get(`${this.API_URL}/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    }
}
