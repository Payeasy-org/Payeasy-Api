import {
    CreatePlanPayload,
    GetPlansPayload,
    GetSubscriptionsParameters,
    InitializeSubscriptionPayload,
    SubscriptionStrategy,
    UpdatePlansPayload,
} from '@/core/services/payment';
import axios from 'axios';
import { PaystackSubscriptionResponseTypes } from './paystack.interface';

export class PaystackSubscriptionStrategy implements SubscriptionStrategy<PaystackSubscriptionResponseTypes> {
    constructor(private readonly API_KEY: string, private readonly API_URL = 'https://api.paystack.co') {}

    async createPlan(payload: CreatePlanPayload) {
        const response = await axios.post(`${this.API_URL}/plan/`, payload, {
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    }

    async getPlans(payload?: GetPlansPayload) {
        const response = await axios.get(`${this.API_URL}/plan/`, {
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
            params: payload,
        });

        return response.data;
    }
    async updatePlan({ planId, ...data }: UpdatePlansPayload) {
        const response = await axios.put(`${this.API_URL}/plan/${planId}`, data, {
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    }
    async initializeSubscription(payload: InitializeSubscriptionPayload) {
        try {
            const { email, plan, ...data } = payload;

            const response = await axios.post(
                `${this.API_URL}/subscription/`,
                { customer: email, plan, ...data },
                {
                    headers: {
                        Authorization: `Bearer ${this.API_KEY}`,
                        'Content-Type': 'application/json',
                    },
                },
            );

            return response.data;
        } catch (error: any) {
            console.log(error);
            throw new Error(error.response.data?.message);
        }
    }
    async getSubscriptions(params: GetSubscriptionsParameters) {
        const response = await axios.get(`${this.API_URL}/subscription/`, {
            params,
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    }
}
