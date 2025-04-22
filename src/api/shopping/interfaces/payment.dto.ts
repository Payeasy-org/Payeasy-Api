// Request DTO for initiating a payment checkout via Paystack
export interface PaymentCheckoutDTO {
    productId: string;
    amount: number; // In the smallest currency unit (e.g., kobo for Naira)
    email: string;
}
