// Subscriptions
export interface BaseSubscriptionResponseTypes {
    createPlan: any;
    getPlans: any;
    updatePlan: any;
    initializeSubscription: any;
    getSubscriptions: any;
}

export type SubscriptionStrategy<TResponseTypes extends BaseSubscriptionResponseTypes> = {
    // Plans
    createPlan(payload: CreatePlanPayload): Promise<TResponseTypes['createPlan']>;
    getPlans(payload?: GetPlansPayload | undefined): Promise<TResponseTypes['getPlans']>;
    updatePlan(payload: UpdatePlansPayload): Promise<TResponseTypes['updatePlan']>;

    // Subscriptions
    initializeSubscription(payload: InitializeSubscriptionPayload): Promise<TResponseTypes['initializeSubscription']>;
    getSubscriptions(payload: GetSubscriptionsParameters): Promise<TResponseTypes['getSubscriptions']>;
};

// TypeScript type
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const planType = ['weekly', 'monthly', 'quarterly', 'biannually'] as const;

export type SubscriptionPlanType = typeof planType[number];

// Plans
export type CreatePlanPayload = {
    name: string;
    amount: number;
    interval: SubscriptionPlanType;
};

export type GetPlansPayload = {
    [key: string]: any;
};

export type UpdatePlansPayload = {
    planId: string;
    [key: string]: any;
};

// Subscriptions
export type InitializeSubscriptionPayload = {
    plan: string;
    email: string;
    firstName: string;
    lastName: string;
    [key: string]: any;
};

export type GetSubscriptionsParameters = {
    [key: string]: any;
};

export type SubscriptionMethod = { type: 'Paystack'; secret: string } | { type: 'Stripe' };

// Payment
export interface BasePaymentResponseTypes {
    initializeTransaction: any;
    verifyTransaction: any;
}

export type PaymentStrategy<TResponseTypes extends BasePaymentResponseTypes> = {
    // Transactions
    initializeTransaction(payload: InitializeTransactionPayload): Promise<TResponseTypes['initializeTransaction']>;
    verifyTransaction(payload: VerifyTransactionPayload): Promise<TResponseTypes['verifyTransaction']>;
};

export interface InitializeTransactionPayload {
    email: string;
    amount: number;
    [key: string]: any;
}

export interface VerifyTransactionPayload {
    reference: string;
}

export type PaymentMethod = { type: 'Paystack'; secret: string } | { type: 'Stripe' };
