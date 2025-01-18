"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaystackPaymentStrategy = void 0;
const axios_1 = __importDefault(require("axios"));
class PaystackPaymentStrategy {
    constructor(API_KEY, API_URL = 'https://api.paystack.co') {
        this.API_KEY = API_KEY;
        this.API_URL = API_URL;
    }
    async initializeTransaction(payload) {
        try {
            const response = await axios_1.default.post(`${this.API_URL}/transaction/initialize`, payload, {
                headers: {
                    Authorization: `Bearer ${this.API_KEY}`,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            throw new Error(error.response.data?.message);
        }
    }
    async verifyTransaction(payload) {
        const { reference } = payload;
        const response = await axios_1.default.get(`${this.API_URL}/transaction/verify/${reference}`, {
            headers: {
                Authorization: `Bearer ${this.API_KEY}`,
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    }
}
exports.PaystackPaymentStrategy = PaystackPaymentStrategy;
