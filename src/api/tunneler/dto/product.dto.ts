// Request DTO for product search on Retailr's API
export interface GetProductDTO {
  inventoryProvider: string;
  productId: number; 
}

// Expected response structure from Retailr (simplified)
export interface branchProductResponse {
    id: number;
    name: string;
    price: number;
    quantity: number;
    sku?: string; // <--- Added SKU as optional
    brand?: string;
    imageUrl?: string;
    category?: string;
}
