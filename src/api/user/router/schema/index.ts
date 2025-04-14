import Joi from 'joi';

const signUpSchema = {
    inputSchema: Joi.object().keys({
        fullName: Joi.string().min(2).max(60).required().label('Full name is required and must be between 2 and 60 characters'),

        emailAddress: Joi.string()
            .required()
            .email({ tlds: { allow: false } })
            .label('Valid email is required'),

        phoneNumber: Joi.string()
            .regex(/^\+234\d{10}$/)
            .label('Valid phone number is required'),

        password: Joi.string()
            .min(8)
            .required()
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/)
            .label(
                'Password is required and must be at least 8 characters. It should include at least one uppercase letter, one lowercase letter, one digit, and one special character (@#$%^&+=!).',
            ),
    }),
};

const loginSchema = {
    inputSchema: Joi.object().keys({
        emailAddress: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

const resendVerifyAccountMessageSchema = {
    inputSchema: Joi.object().keys({
        emailAddress: Joi.string()
            .required()
            .email({ tlds: { allow: false } }),
    }),
};

const verifyAccountValidateSchema = {
    inputSchema: Joi.object().keys({
        otp: Joi.string().length(6).required(),

        emailAddress: Joi.string()
            .required()
            .email({ tlds: { allow: false } }),
    }),
};

const forgotPasswordSchema = {
    inputSchema: Joi.object().keys({
        emailAddress: Joi.string()
            .required()
            .email({ tlds: { allow: false } }),
    }),
};

const resetPasswordSchema = {
    inputSchema: Joi.object().keys({
        otp: Joi.string().length(6).required(),
        password: Joi.string().required(),

        emailAddress: Joi.string()
            .required()
            .email({ tlds: { allow: false } }),
    }),
};

const refreshTokenSchema = {
    inputSchema: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};

export {
    forgotPasswordSchema,
    loginSchema,
    refreshTokenSchema,
    resendVerifyAccountMessageSchema,
    resetPasswordSchema,
    signUpSchema,
    verifyAccountValidateSchema,
};
