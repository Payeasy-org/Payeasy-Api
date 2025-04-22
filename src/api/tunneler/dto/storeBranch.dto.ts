/**
 * Payload to create a new StoreBranch along with its Location.
 */
export interface CreateStoreBranchDTO {
    storeId: number; // ID of an existing Store
    name: string; // Branch name
    contactEmail?: string; // Optional
    contactPhoneNumber?: string; // Optional
    isHeadquarter?: boolean; // Defaults to false

    // Nested location information
    location: {
        name: string;
        latitude: number;
        longitude: number;
    };
}

/**
 * Response after creation, including both branch and its location.
 */
export interface StoreBranchResponse {
    id: number;
    guid: string;
    name: string;
    storeId: number;
    location: {
        id: number;
        guid: string;
        name: string;
        latitude: number;
        longitude: number;
        createdAt: string;
        updatedAt: string;
    };
    contactEmail: string | null;
    contactPhoneNumber: string | null;
    isHeadquarter: boolean;
    createdAt: string;
    updatedAt: string;
}
