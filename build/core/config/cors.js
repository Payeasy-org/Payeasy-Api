"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const config_1 = require("./config");
const allowedOrigins = [config_1.config.frontendOriginUrl];
const allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
const allowedHeaders = ['Content-Type', 'Authorization'];
exports.corsOptions = {
    methods: allowedMethods,
    allowedHeaders,
    origin: allowedOrigins,
};
