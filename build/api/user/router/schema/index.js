"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extensionAgentApproveSchema = exports.extensionAgentLoginSchema = exports.extensionAgentRegisterSchema = exports.findFarmByIdSchema = exports.farmQuerySchema = exports.updateFarmSchema = exports.createBulkFarmSchema = exports.createFarmSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.createFarmSchema = {
    inputSchema: joi_1.default.object().keys({
        name: joi_1.default.string().required(),
        state: joi_1.default.string().required(),
        city: joi_1.default.string().required(),
    }),
};
exports.createBulkFarmSchema = {
    inputSchema: joi_1.default.object().keys({
        farms: joi_1.default.array().items({
            name: joi_1.default.string().required(),
            state: joi_1.default.string().required(),
            city: joi_1.default.string().required(),
        }),
    }),
};
exports.updateFarmSchema = {
    inputSchema: joi_1.default.object().keys({
        name: joi_1.default.string().optional(),
        state: joi_1.default.string().optional(),
        city: joi_1.default.string().optional(),
    }),
    querySchema: joi_1.default.object().keys({
        id: joi_1.default.string().required().length(36),
    }),
};
exports.farmQuerySchema = {
    querySchema: joi_1.default.object().keys({
        id: joi_1.default.string().required().length(36),
    }),
};
exports.findFarmByIdSchema = {
    paramsSchema: joi_1.default.object().keys({
        id: joi_1.default.string().required().length(36),
    }),
};
exports.extensionAgentRegisterSchema = {
    inputSchema: joi_1.default.object()
        .keys({
        fullName: joi_1.default.string().min(2).max(60).required(),
        emailAddress: joi_1.default.string().email({ tlds: { allow: false } }),
        phoneNumber: joi_1.default.string().regex(/^\+234\d{10}$/),
    })
        .xor('emailAddress', 'phoneNumber'),
};
exports.extensionAgentLoginSchema = {
    inputSchema: joi_1.default.object().keys({
        emailAddress: joi_1.default.string().required(),
        password: joi_1.default.string().required(),
    }),
};
exports.extensionAgentApproveSchema = {
    paramsSchema: joi_1.default.object().keys({
        id: joi_1.default.string().required(),
    }),
};
