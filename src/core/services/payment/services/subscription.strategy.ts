import {
    BaseSubscriptionResponseTypes,
    CreatePlanPayload,
    GetPlansPayload,
    GetSubscriptionsParameters,
    InitializeSubscriptionPayload,
    SubscriptionMethod,
    SubscriptionStrategy,
    UpdatePlansPayload,
} from '@/core/services/payment';
import { PaystackSubscriptionStrategy } from '../strategies/paystack';

export class SubscriptionContext<TResponseTypes extends BaseSubscriptionResponseTypes> implements SubscriptionStrategy<TResponseTypes> {
    private subscriptionStrategy!: SubscriptionStrategy<TResponseTypes>;

    constructor(strategy: SubscriptionMethod) {
        this.setStrategy(strategy);
    }

    setStrategy(strategy: SubscriptionMethod) {
        switch (strategy.type) {
            case 'Paystack':
                this.subscriptionStrategy = new PaystackSubscriptionStrategy(strategy.secret) as SubscriptionStrategy<TResponseTypes>;
                break;
            default:
                throw new Error('Invalid Subscription strategy');
        }
    }

    async createPlan(payload: CreatePlanPayload): Promise<TResponseTypes['createPlan']> {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.createPlan(payload);
    }

    async getPlans(payload?: GetPlansPayload): Promise<TResponseTypes['getPlans']> {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.getPlans(payload);
    }

    async updatePlan(payload: UpdatePlansPayload): Promise<TResponseTypes['updatePlan']> {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.updatePlan(payload);
    }

    async initializeSubscription(payload: InitializeSubscriptionPayload): Promise<TResponseTypes['initializeSubscription']> {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.initializeSubscription(payload);
    }

    async getSubscriptions(payload: GetSubscriptionsParameters): Promise<TResponseTypes['getSubscriptions']> {
        if (!this.subscriptionStrategy) {
            throw new Error('Subscription strategy not set');
        }
        return await this.subscriptionStrategy.getSubscriptions(payload);
    }
}
