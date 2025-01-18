"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.googleAuthSchema = {
    inputSchema: joi_1.default.object().keys({
        code: joi_1.default.string().required(),
        roleId: joi_1.default.string().length(36).required().label('Role ID is required and must be exactly 36 characters'),
    }),
};
