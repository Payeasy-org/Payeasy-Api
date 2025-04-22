
export interface GetProductDTO {
    inventoryProvider: string;
    productId: number;
}

export interface branchProductResponse {
    id: number;
    name: string;
    price: number;
    quantity: number;
    sku?: string; // <--- Added SKU as optional
    brand?: string;
    imageUrl?: string;
    category?: string;
    scannedAt: string;
}
