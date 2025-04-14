import type { ControllerArgsTypes } from '@/core';

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
    input: { emailAddress: string };
}

export interface ResetPasswordPayload extends ControllerArgsTypes {
    input: {
        emailAddress: string;
        code: string;
        password: string;
    };
}

export interface RefreshTokenPayload extends ControllerArgsTypes {
    input: {
        refreshToken: string;
    };
}
