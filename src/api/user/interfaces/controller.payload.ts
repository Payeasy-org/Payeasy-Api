import type { ControllerArgsTypes } from '@/core';
import { FarmPayload } from './module.types';
import { AuthPlatform } from '@/api/auth/interfaces';

export interface CreateFarmPayload extends ControllerArgsTypes {
    input: FarmPayload;
}

export interface CreateMultipleFarmPayload extends ControllerArgsTypes {
    input: {
        farm: FarmPayload[];
    };
}

export interface FindFarmByIdPayload extends ControllerArgsTypes {
    params: {
        id: string;
    };
}

export interface UpdateFarmPayload extends ControllerArgsTypes {
    input: Partial<FarmPayload>;

    query: {
        id: string;
    };
}

export interface DeleteFarmPayload extends ControllerArgsTypes {
    query: {
        id: string;
    };
}

export interface ExtensionAgentSignupPayload extends ControllerArgsTypes {
    input: {
        fullName: string;
        emailAddress: string;
        phoneNumber: string;
    };
}

export interface ApproveExtensionAgentPayload extends ControllerArgsTypes {
    params: {
        id: string;
    };
}

export interface VerifyIdentityPayload extends ControllerArgsTypes {
    input: AuthPlatform & {
        otp: string;
    };
}

export interface ResendVerifyIdentityEmailPayload extends ControllerArgsTypes {
    input: AuthPlatform;
}
