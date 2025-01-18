'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
require("module-alias/register");
const core_1 = require("@/core");
const app_1 = require("@/app");
// Initialize the database connection, start the application if successful, or shut down gracefully if an error occurs
(0, core_1.initializeDbConnection)().then(app_1.startApp).catch(core_1.gracefullyShutdown);
// Process-wide error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
    core_1.logger.info('Uncaught exception', error);
    process.exit(1);
});
// Process-wide error handling for unhandled promise rejectionsss
process.on('unhandledRejection', (error) => {
    core_1.logger.info('Unhandled rejection', error);
    process.exit(1);
});
