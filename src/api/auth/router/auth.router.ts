import { Router } from 'express';

import { ControlBuilder } from '@/core';
import {
    forgotPassword,
    login,
    logout,
    refreshToken,
    register,
    resetPassword,
} from '../services';
import {
    forgotPasswordSchema,
    loginSchema,
    refreshTokenSchema,
    resetPasswordSchema,
    signUpSchema,
} from './schema';

export const authRouter = Router();

authRouter
    .post(
        '/login',
        ControlBuilder.builder()
            .setValidator(loginSchema)
            .setHandler((data) => login.handle(data, 'user'))
            .handle(),
    )

    .post(
        '/register',
        ControlBuilder.builder()
            .setValidator(signUpSchema)
            .setHandler(register.handleUser)
            .handle(),
    )

    .post(
        '/forgot-password',
        ControlBuilder.builder()
            .setHandler(forgotPassword.handle)
            .setValidator(forgotPasswordSchema)
            .handle(),
    )

    .post(
        '/reset-password',
        ControlBuilder.builder()
            .setHandler(resetPassword.handle)
            .setValidator(resetPasswordSchema)
            .handle(),
    )

    .post(
        '/refresh-token',
        ControlBuilder.builder()
            .isPrivate()
            .setHandler(refreshToken.handle)
            .setValidator(refreshTokenSchema)
            .handle(),
    )

    // .get(
    //     '/refresh-token',
    //     ControlBuilder.builder()
    //         .isPrivate()
    //         .setHandler(refreshToken.handle)
    //         .setValidator(refreshTokenSchema)
    //         .handle(),
    // )

    .get('/logout', logout.handle);

