// Request DTO for product search on Retailr's API
export interface GetProductDTO {
  searchTerm: string;
  storeBranchId?: string; // Optional: if you want to track the store context
}

// Expected response structure from Retailr (simplified)
export interface RetailrProductResponse {
  id: string;
  name: string;
  price: number;
  brand?: string;
  imageUrl?: string;
  category?: string;
}
