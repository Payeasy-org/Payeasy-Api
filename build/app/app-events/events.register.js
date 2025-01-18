"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const core_1 = require("@/core");
const mails_1 = require("@/core/services/mails");
const sms_1 = require("@/core/services/sms");
/**
 * Event Listener Registry.
 */
exports.register = {
    'app:up': () => {
        core_1.logger.info(`Server started successfully on port ${core_1.config.port}`);
        if (core_1.config.appEnvironment !== 'development') {
            console.log(`Server started successfully on port ${core_1.config.port}`);
        }
    },
    'cache:connection:established': () => core_1.logger.info(`Cache connection established`),
    'event:registeration:succesful': () => core_1.logger.info('Events listeners registered'),
    'event:sendMail': mails_1.sendEmail,
    'event:sendSms': sms_1.sendSMS,
};
