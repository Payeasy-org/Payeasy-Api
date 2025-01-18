"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startApp = void 0;
const http_1 = require("http");
const app_1 = require("@/app");
const core_1 = require("@/core");
const startApp = async () => {
    const server = (0, http_1.createServer)(app_1.app);
    server.listen(core_1.config.port, () => (0, app_1.dispatch)('app:up'));
};
exports.startApp = startApp;
