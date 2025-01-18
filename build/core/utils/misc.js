"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computDateFromEpoch = exports.isDateExpired = exports.computeExpiryDate = exports.generateRandStr = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateRandStr = (len) => {
    return crypto_1.default.randomBytes(len / 2).toString('hex');
};
exports.generateRandStr = generateRandStr;
const computeExpiryDate = (timeInSeconds) => {
    return new Date(Date.now() + timeInSeconds * 1000);
};
exports.computeExpiryDate = computeExpiryDate;
const isDateExpired = (date) => {
    return date <= new Date(Date.now());
};
exports.isDateExpired = isDateExpired;
const computDateFromEpoch = (epochTime) => {
    return new Date(epochTime * 1000);
};
exports.computDateFromEpoch = computDateFromEpoch;
