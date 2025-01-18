"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = void 0;
const core_1 = require("@/core");
const twilio_1 = __importDefault(require("twilio"));
class SMSService {
    constructor() {
        this.twilio_client = null;
        this.sendMessages = async (data) => {
            this.create_twilio_client();
            if (!this.twilio_client) {
                throw new core_1.BadRequestError('Twilio Client has not been initialized');
            }
            const response = await this.twilio_client.messages.create({
                from: core_1.config.twilio.twilio_phone_number,
                body: data.body,
                to: data.phoneNumber,
            });
            core_1.logger.info(`SMS Sent Successfully, ${JSON.stringify(response)}`);
            return {
                code: core_1.HttpStatus.OK,
                data: response,
                message: 'SMS Sent Successfully',
            };
        };
    }
    create_twilio_client() {
        const client = (0, twilio_1.default)(core_1.config.twilio.twilio_sid, core_1.config.twilio.twilio_auth_token);
        core_1.logger.info('Twilio Client has been Initialized');
        this.twilio_client = client;
    }
}
exports.sendSMS = new SMSService().sendMessages;
