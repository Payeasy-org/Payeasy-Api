"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackSubscriptionStrategy = void 0;
const axios_1 = __importDefault(require("axios"));
class PaystackSubscriptionStrategy {
    constructor(API_KEY, API_URL = 'https://api.paystack.co') {
        this.API_KEY = API_KEY;
        this.API_URL = API_URL;
    }
    async createPlan(payload) {
        const response = await axios_1.default.post(`${this.API_URL}/plan/`, payload, {
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    async getPlans(payload) {
        const response = await axios_1.default.get(`${this.API_URL}/plan/`, {
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
            params: payload,
        });
        return response.data;
    }
    async updatePlan({ planId, ...data }) {
        const response = await axios_1.default.put(`${this.API_URL}/plan/${planId}`, data, {
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
    async initializeSubscription(payload) {
        try {
            const { email, plan, ...data } = payload;
            const response = await axios_1.default.post(`${this.API_URL}/subscription/`, { customer: email, plan, ...data }, {
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.log(error);
            throw new Error(error.response.data?.message);
        }
    }
    async getSubscriptions(params) {
        const response = await axios_1.default.get(`${this.API_URL}/subscription/`, {
            params,
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
}
exports.PaystackSubscriptionStrategy = PaystackSubscriptionStrategy;
