import { ValidationSchema } from '@/core';
import Joi from 'joi';

export const createFarmSchema = {
    inputSchema: Joi.object().keys({
        name: Joi.string().required(),
        state: Joi.string().required(),
        city: Joi.string().required(),
    }),
};

export const createBulkFarmSchema = {
    inputSchema: Joi.object().keys({
        farms: Joi.array().items({
            name: Joi.string().required(),
            state: Joi.string().required(),
            city: Joi.string().required(),
        }),
    }),
};

export const updateFarmSchema = {
    inputSchema: Joi.object().keys({
        name: Joi.string().optional(),
        state: Joi.string().optional(),
        city: Joi.string().optional(),
    }),

    querySchema: Joi.object().keys({
        id: Joi.string().required().length(36),
    }),
};

export const farmQuerySchema = {
    querySchema: Joi.object().keys({
        id: Joi.string().required().length(36),
    }),
};

export const findFarmByIdSchema: ValidationSchema = {
    paramsSchema: Joi.object().keys({
        id: Joi.string().required().length(36),
    }),
};

export const extensionAgentRegisterSchema = {
    inputSchema: Joi.object()
        .keys({
            fullName: Joi.string().min(2).max(60).required(),
            emailAddress: Joi.string().email({ tlds: { allow: false } }),
            phoneNumber: Joi.string().regex(/^\+234\d{10}$/),
        })
        .xor('emailAddress', 'phoneNumber'),
};

export const extensionAgentLoginSchema = {
    inputSchema: Joi.object().keys({
        emailAddress: Joi.string().required(),
        password: Joi.string().required(),
    }),
};

export const extensionAgentApproveSchema = {
    paramsSchema: Joi.object().keys({
        id: Joi.string().required(),
    }),
};
