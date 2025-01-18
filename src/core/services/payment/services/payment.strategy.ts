import {
    BasePaymentResponseTypes,
    InitializeTransactionPayload,
    PaymentMethod,
    PaymentStrategy,
    VerifyTransactionPayload,
} from '@/core/services/payment';
import { PaystackPaymentStrategy } from '../strategies/paystack';

export class PaymentContext<TResponseTypes extends BasePaymentResponseTypes> implements PaymentStrategy<TResponseTypes> {
    private paymentStrategy!: PaymentStrategy<TResponseTypes>;

    constructor(strategy: PaymentMethod) {
        this.setStrategy(strategy);
    }

    setStrategy(strategy: PaymentMethod) {
        switch (strategy.type) {
            case 'Paystack':
                this.paymentStrategy = new PaystackPaymentStrategy(strategy.secret) as PaymentStrategy<TResponseTypes>;
                break;
            default:
                throw new Error('Invalid Payment strategy');
        }
    }

    async initializeTransaction(payload: InitializeTransactionPayload): Promise<TResponseTypes['initializeTransaction']> {
        if (!this.paymentStrategy) {
            throw new Error('Payment strategy not set');
        }
        return await this.paymentStrategy.initializeTransaction(payload);
    }

    async verifyTransaction(payload: VerifyTransactionPayload): Promise<TResponseTypes['verifyTransaction']> {
        if (!this.paymentStrategy) {
            throw new Error('Payment strategy not set');
        }
        return await this.paymentStrategy.verifyTransaction(payload);
    }
}
