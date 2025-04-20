// DTO for store branch lookup (from QR code scanning)
export interface GetStoreBranchDTO {
    storeBranchGuid: string;
}

// Response interface for store branch details
export interface StoreBranchResponse {
    id: number;
    branchName: string;
    storeId: number;
    locationName: string;
    inventoryUsed: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
}
