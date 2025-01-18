"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const core_1 = require("@/core");
exports.logger = core_1.config.appEnvironment === 'production' ? (0, core_1.prodDevLogger)() : (0, core_1.buildDevLogger)();
