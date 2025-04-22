import { UUID } from "crypto";


export interface CheckoutResponseDTO {
    authorizationUrl: string;
}

export interface VerifyPaymentDTO {
    reference: string;
}

export interface TransactionDTO {
    id: string;
    userId: string;
    storeId: number;
    reference: string;
    amount: number;
    status: string;
    createdAt: string;
}

export interface ReceiptDTO {
    id: string;
    userId: UUID;
    storeIdN: number;
    cart: any;
    totalItems: number;
    totalAmount: number;
    paymentStatus: string;
    paystackReference: string;
    storeName: string;
    storeLocation: { name: string; latitude: number; longitude: number };
}

export interface StorePaymentDTO {
    id: string;
    storeId: number;
    transactionId: string;
    userId: UUID;
    amount: number;
    status: string;
    createdAt: string;
    user: { fullName: string; emailAddress: string };
    transaction: TransactionDTO;
}
