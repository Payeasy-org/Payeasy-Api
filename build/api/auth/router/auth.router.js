"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = require("express");
const core_1 = require("@/core");
const services_1 = require("../services");
const schema_1 = require("./schema");
exports.authRouter = (0, express_1.Router)();
exports.authRouter
    .post('/login', core_1.ControlBuilder.builder()
    .setValidator(schema_1.loginSchema)
    .setHandler((data) => services_1.login.handle(data, 'user'))
    .handle())
    .post('/register', core_1.ControlBuilder.builder()
    .setValidator(schema_1.signUpSchema)
    .setHandler(services_1.register.handleUser)
    .handle())
    .post('/forgot-password', core_1.ControlBuilder.builder()
    .setHandler(services_1.forgotPassword.handle)
    .setValidator(schema_1.forgotPasswordSchema)
    .handle())
    .post('/reset-password', core_1.ControlBuilder.builder()
    .setHandler(services_1.resetPassword.handle)
    .setValidator(schema_1.resetPasswordSchema)
    .handle())
    .post('/refresh-token', core_1.ControlBuilder.builder()
    .isPrivate()
    .setHandler(services_1.refreshToken.handle)
    .setValidator(schema_1.refreshTokenSchema)
    .handle())
    .post('/logout', services_1.logout.handle);
