"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("@/api/user");
const app_1 = require("@/app");
const core_1 = require("@/core");
const mails_1 = require("@/core/services/mails");
const models_1 = require("@auth/models");
const utils_1 = require("@auth/utils");
class ForgotPassword {
    constructor(dbUser, otp_service) {
        this.dbUser = dbUser;
        this.otp_service = otp_service;
        this.handle = async ({ input }) => {
            if (!input)
                throw new core_1.BadRequestError(`Invalid Input`);
            const { platform } = input;
            if (platform === 'email') {
                const { emailAddress } = input;
                const authUser = await this.dbUser.findOne({
                    where: {
                        emailAddress,
                    },
                });
                if (!authUser) {
                    return {
                        code: core_1.HttpStatus.OK,
                        message: `If you have an account with us, You will receive a mail to ${emailAddress}`,
                    };
                }
                const otp = await this.otp_service.storeOTPInDb({
                    userId: authUser.id,
                    receivingMedium: 'EMAIL',
                });
                await (0, app_1.dispatch)('event:sendMail', {
                    to: emailAddress,
                    subject: 'Forgot Password',
                    body: (0, mails_1.accountVerificationMail)({
                        otp: otp?.toString(),
                        fullName: authUser.fullName,
                    }),
                });
                core_1.logger.info('Successfully Sent Forgot Password Mail to ' + emailAddress);
                return {
                    code: core_1.HttpStatus.OK,
                    message: `If you have an account with us, You will receive a mail to ${emailAddress}`,
                };
            }
            // if (platform === 'phone') {
            const { phoneNumber } = input;
            const authUser = await this.dbUser.findOne({
                where: {
                    phoneNumber,
                },
            });
            if (!authUser) {
                return {
                    code: core_1.HttpStatus.OK,
                    message: `If you have an account with us, You will receive an SMS to ${phoneNumber}`,
                };
            }
            const otp = await this.otp_service.storeOTPInDb({
                userId: authUser.id,
                receivingMedium: 'SMS',
            });
            await (0, app_1.dispatch)('event:sendSms', {
                body: `It appears that you Forgot your password. The four-digit code that you can use to reset your password for your account is shown below. ${otp}`,
                phoneNumber,
            });
            core_1.logger.info('Successfully Sent Forgot Password Text to ' + phoneNumber);
            return {
                code: core_1.HttpStatus.OK,
                message: `If you have an account with us, You will receive as SM to ${phoneNumber}`,
            };
            // }
        };
    }
}
const forgotPasswordInstance = new ForgotPassword(user_1.User, new utils_1.OTPService(models_1.OTP));
exports.default = forgotPasswordInstance;
