import type { ControllerArgsTypes } from '@/core';
import { AuthPlatform } from './module.types';

export interface LoginPayload extends ControllerArgsTypes {
    input: {
        emailAddress: string;
        password: string;
    };
}

export interface SignupPayload extends ControllerArgsTypes {
    input: {
        fullName: string;
        emailAddress: string;
        phoneNumber?: string;
        password: string;
    };
}

export interface ForgotPasswordPayload extends ControllerArgsTypes {
    input: AuthPlatform;
}

export interface ResetPasswordPayload extends ControllerArgsTypes {
    input: Omit<AuthPlatform, 'platform'> & {
        otp: string;
        password: string;
    };
}

export interface RefreshTokenPayload extends ControllerArgsTypes {
    input: {
        refreshToken: string;
    };
}
