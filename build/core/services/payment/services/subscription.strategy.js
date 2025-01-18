"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionContext = void 0;
const paystack_1 = require("../strategies/paystack");
class SubscriptionContext {
    constructor(strategy) {
        this.setStrategy(strategy);
    }
    setStrategy(strategy) {
        switch (strategy.type) {
            case 'Paystack':
                this.subscriptionStrategy = new paystack_1.PaystackSubscriptionStrategy(strategy.secret);
                break;
            default:
                throw new Error('Invalid Subscription strategy');
        }
    }
    async createPlan(payload) {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.createPlan(payload);
    }
    async getPlans(payload) {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.getPlans(payload);
    }
    async updatePlan(payload) {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.updatePlan(payload);
    }
    async initializeSubscription(payload) {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.initializeSubscription(payload);
    }
    async getSubscriptions(payload) {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.getSubscriptions(payload);
    }
}
exports.SubscriptionContext = SubscriptionContext;
