// DTO for store branch lookup (from QR code scanning)
export interface GetStoreBranchDTO {
    storeBranchId: string;
}

// Response interface for store branch details
export interface StoreBranchResponse {
    id: string;
    branchName: string;
    storeName: string;
    locationName: string;
    latitude: number;
    longitude: number;
    createdAt: string;
    updatedAt: string;
}
