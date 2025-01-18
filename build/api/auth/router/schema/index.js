"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccountValidateSchema = exports.signUpSchema = exports.resetPasswordSchema = exports.resendVerifyAccountMessageSchema = exports.refreshTokenSchema = exports.loginSchema = exports.forgotPasswordSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const signUpSchema = {
    inputSchema: joi_1.default.object().keys({
        fullName: joi_1.default.string().min(2).max(60).required().label('Full name is required and must be between 2 and 60 characters'),
        emailAddress: joi_1.default.string()
            .required()
            .email({ tlds: { allow: false } })
            .label('Valid email is required'),
        phoneNumber: joi_1.default.string()
            .regex(/^\+234\d{10}$/)
            .label('Valid phone number is required'),
        password: joi_1.default.string()
            .min(8)
            .required()
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/)
            .label('Password is required and must be at least 8 characters. It should include at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!).'),
    }),
};
exports.signUpSchema = signUpSchema;
const loginSchema = {
    inputSchema: joi_1.default.object().keys({
        emailAddress: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
};
exports.loginSchema = loginSchema;
const resendVerifyAccountMessageSchema = {
    inputSchema: joi_1.default.object().keys({
        platform: joi_1.default.string().required().valid('email', 'phone'),
        emailAddress: joi_1.default.alternatives().conditional('platform', {
            is: 'email',
            then: joi_1.default.string()
                .required()
                .email({ tlds: { allow: false } }),
            otherwise: joi_1.default.optional(),
        }),
        phoneNumber: joi_1.default.alternatives().conditional('platform', {
            is: 'phone',
            then: joi_1.default.string()
                .required()
                .regex(/^\+234\d{10}$/),
            otherwise: joi_1.default.optional(),
        }),
    }),
};
exports.resendVerifyAccountMessageSchema = resendVerifyAccountMessageSchema;
const verifyAccountValidateSchema = {
    inputSchema: joi_1.default.object().keys({
        platform: joi_1.default.string().required().valid('email', 'phone'),
        otp: joi_1.default.string().length(6).required(),
        emailAddress: joi_1.default.alternatives().conditional('platform', {
            is: 'email',
            then: joi_1.default.string()
                .required()
                .email({ tlds: { allow: false } }),
            otherwise: joi_1.default.optional(),
        }),
        phoneNumber: joi_1.default.alternatives().conditional('platform', {
            is: 'phone',
            then: joi_1.default.string()
                .required()
                .regex(/^\+234\d{10}$/),
            otherwise: joi_1.default.optional(),
        }),
    }),
};
exports.verifyAccountValidateSchema = verifyAccountValidateSchema;
const forgotPasswordSchema = {
    inputSchema: joi_1.default.object().keys({
        platform: joi_1.default.string().required().valid('email', 'phone'),
        emailAddress: joi_1.default.alternatives().conditional('medium', {
            is: 'email',
            then: joi_1.default.string()
                .required()
                .email({ tlds: { allow: false } }),
            otherwise: joi_1.default.optional(),
        }),
        phoneNumber: joi_1.default.alternatives().conditional('medium', {
            is: 'phone',
            then: joi_1.default.string()
                .required()
                .regex(/^\+234\d{10}$/),
            otherwise: joi_1.default.optional(),
        }),
    }),
};
exports.forgotPasswordSchema = forgotPasswordSchema;
const resetPasswordSchema = {
    inputSchema: joi_1.default.object().keys({
        platform: joi_1.default.string().required().valid('email', 'phone'),
        otp: joi_1.default.string().length(6).required(),
        password: joi_1.default.string().required(),
        emailAddress: joi_1.default.alternatives().conditional('medium', {
            is: 'email',
            then: joi_1.default.string()
                .required()
                .email({ tlds: { allow: false } }),
            otherwise: joi_1.default.optional(),
        }),
        phoneNumber: joi_1.default.alternatives().conditional('medium', {
            is: 'phone',
            then: joi_1.default.string()
                .required()
                .regex(/^\+234\d{10}$/),
            otherwise: joi_1.default.optional(),
        }),
    }),
};
exports.resetPasswordSchema = resetPasswordSchema;
const refreshTokenSchema = {
    inputSchema: joi_1.default.object().keys({
        refreshToken: joi_1.default.string().required(),
    }),
};
exports.refreshTokenSchema = refreshTokenSchema;
