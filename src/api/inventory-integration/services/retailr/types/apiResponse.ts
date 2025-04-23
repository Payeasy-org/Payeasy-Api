import { RetailrInventoryItem, RetailrUser } from './interfaces';

interface BaseApiResponse {
    status: string;
    message: string;
}

export interface RetailrLoginResponse extends BaseApiResponse {
    data: {
        user: RetailrUser;
        refresh: string;
        access: string;
    };
}



export interface RetailrBranchItemResponse extends BaseApiResponse {
    data: {
        count: number;
        next: string | null;
        previous: string | null;
        results: RetailrInventoryItem[];
    };
}