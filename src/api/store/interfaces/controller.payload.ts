import type { ControllerArgsTypes, PaginationPayload } from '@/core';
import { Store } from '../models';

export interface CreateStorePayload extends ControllerArgsTypes {
    input: {
        name: string;
        description: string;
    };
}

export interface GetStoresPayload extends ControllerArgsTypes {
    query: Partial<PaginationPayload>;
}

export interface StoreByIdPayload extends ControllerArgsTypes {
    params: {
        id: string;
    };
}

export interface UpdateStorePayload extends ControllerArgsTypes {
    params: {
        id: string;
    };
    input: Partial<Store>;
}
