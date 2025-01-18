"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDbConnection = void 0;
const core_1 = require("@/core");
const initializeDbConnection = async () => {
    await core_1.sequelize.authenticate();
    await core_1.sequelize.sync();
    core_1.logger.info('Connection has been established successfully.');
};
exports.initializeDbConnection = initializeDbConnection;
