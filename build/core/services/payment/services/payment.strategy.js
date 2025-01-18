"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentContext = void 0;
const paystack_1 = require("../strategies/paystack");
class PaymentContext {
    constructor(strategy) {
        this.setStrategy(strategy);
    }
    setStrategy(strategy) {
        switch (strategy.type) {
            case 'Paystack':
                this.paymentStrategy = new paystack_1.PaystackPaymentStrategy(strategy.secret);
                break;
            default:
                throw new Error('Invalid Payment strategy');
        }
    }
    async initializeTransaction(payload) {
        if (!this.paymentStrategy) {
            throw new Error('Payment strategy not set');
        }
        return await this.paymentStrategy.initializeTransaction(payload);
    }
    async verifyTransaction(payload) {
        if (!this.paymentStrategy) {
            throw new Error('Payment strategy not set');
        }
        return await this.paymentStrategy.verifyTransaction(payload);
    }
}
exports.PaymentContext = PaymentContext;
