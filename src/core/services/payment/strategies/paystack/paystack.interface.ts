type PaystackBaseApiResponse<T = undefined> = {
    status: boolean;
    message: string;
    data: T;
};

type PaystackInitializeTransactionResponse = PaystackBaseApiResponse<{
    authorization_url: string;
    access_code: string;
    reference: string;
}>;

type PaystackTransactionStatus = 'abandoned' | 'failed' | 'ongoing' | 'pending' | 'processing' | 'queued' | 'reversed' | 'success';

type PaystackPaymentLog = {
    start_time: number;
    time_spent: number;
    attempts: number;
    errors: number;
    success: boolean;
    mobile: boolean;
    input: any[];
    history: Array<{
        type: string;
        message: string;
        time: number;
    }>;
};

type PaystackCustomerInformation = {
    id: number;
    first_name: string | null;
    last_name: string | null;
    email: string;
    customer_code: string;
    phone: string | null;
    metadata: any | null;
    risk_action: string;
    international_format_phone: string | null;
};

type PaystackTransactionAuthorization = {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name: string | null;
    receiver_bank_account_number: string | null;
    receiver_bank: string | null;
};

type PaystackVerifyTransactionResponse = PaystackBaseApiResponse<{
    id: number;
    domain: string;
    status: PaystackTransactionStatus;
    receipt_number: string | null;
    amount: number;
    gateway_response: string;
    paid_at: string | null;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: { name: string };
    authorization: PaystackTransactionAuthorization | null;
    customer: PaystackCustomerInformation;
    log: PaystackPaymentLog | null;
    plan: any | null;
    order_id: string | null;
    paidAt: string | null;
    createdAt: string;
    requested_amount: number;
    transaction_date: string;
    plan_object: any;
}>;

type PaystackPaymentResponseTypes = {
    initializeTransaction: PaystackInitializeTransactionResponse;

    verifyTransaction: PaystackVerifyTransactionResponse;
};

type PaystackPlan = {
    name: string;
    amount: number;
    interval: string;
    integration: number;
    domain: string;
    currency: string;
    plan_code: string;
    invoice_limit: number;
    send_invoices: boolean;
    send_sms: boolean;
    hosted_page: boolean;
    migrate: boolean;
    is_archived: boolean;
    id: number;
};

type PaystackSubscription = {
    customer: PaystackCustomerInformation;
    plan: PaystackPlan;
    integration: number;
    authorization: PaystackTransactionAuthorization;
    domain: string;
    start: number;
    status: string;
    quantity: number;
    amount: number;
    subscription_code: string;
    email_token: string;
    easy_cron_id: string;
    cron_expression: string;
    next_payment_date: string;
    open_invoice: string;
    id: number;
    createdAt: string;
    updatedAt: string;
};

type PaginationMeta = {
    total: number;
    skipped: number;
    perPage: number;
    page: number;
    pageCount: number;
};

type PaystackCreatePlanResponse = PaystackBaseApiResponse<PaystackPlan>;

type PaystackGetPlansResponse = PaystackBaseApiResponse<PaystackPlan[]>;

type PaystackUpdatePlanResponse = PaystackBaseApiResponse;

type PaystackInitializeSubscriptionResponse = PaystackBaseApiResponse;

type PaystackGetSubscriptionsResponse = PaystackBaseApiResponse<PaystackSubscription[]> & { meta: PaginationMeta };

type PaystackSubscriptionResponseTypes = {
    createPlan: PaystackCreatePlanResponse;

    getPlans: PaystackGetPlansResponse;

    updatePlan: PaystackUpdatePlanResponse;

    initializeSubscription: PaystackInitializeSubscriptionResponse;

    getSubscriptions: PaystackGetSubscriptionsResponse;
};

type PaystackWebhookBody<T = undefined> = {
    event: string;
    data: T;
};

export { PaystackPaymentResponseTypes, PaystackSubscription, PaystackSubscriptionResponseTypes, PaystackWebhookBody };
