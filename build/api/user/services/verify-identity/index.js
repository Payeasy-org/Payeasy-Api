"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("@/api/auth");
const utils_1 = require("@/api/auth/utils");
const user_1 = require("@/api/user");
const app_1 = require("@/app");
const core_1 = require("@/core");
const mails_1 = require("@/core/services/mails");
const sequelize_1 = require("sequelize");
class VerifyIdentity {
    constructor(dbUser, otp_service) {
        this.dbUser = dbUser;
        this.otp_service = otp_service;
        this.handle = async ({ input }) => {
            if (!input)
                throw new core_1.BadRequestError(`Invalid Input`);
            const { emailAddress, phoneNumber, otp, platform } = input;
            const queryConditions = [];
            if (emailAddress) {
                queryConditions.push({ emailAddress });
            }
            if (phoneNumber) {
                queryConditions.push({ phoneNumber });
            }
            if (queryConditions.length === 0) {
                throw new Error('Either emailAddress or phoneNumber must be provided.');
            }
            const user = await this.dbUser.findOne({
                where: {
                    [sequelize_1.Op.or]: queryConditions,
                },
            });
            if (!user)
                throw new core_1.BadRequestError('Invalid User');
            const otpValid = await this.otp_service.isOtpValid(user.id, Number(otp));
            if (!otpValid)
                throw new core_1.BadRequestError('Invalid OTP');
            if (platform === 'email') {
                await this.dbUser.update({ emailVerified: true }, {
                    where: {
                        id: user.id,
                    },
                });
            }
            if (platform === 'phone') {
                await this.dbUser.update({ phoneNumberVerified: true }, {
                    where: {
                        id: user.id,
                    },
                });
            }
            core_1.logger.info('Identity Verified Successfully');
            return {
                code: core_1.HttpStatus.OK,
                message: 'Identity Verified Successfully',
            };
        };
        this.resendVerificationMessage = async ({ input }) => {
            if (!input)
                throw new core_1.BadRequestError(`Invalid Input`);
            const { emailAddress, phoneNumber, platform } = input;
            const queryConditions = [];
            if (emailAddress) {
                queryConditions.push({ emailAddress });
            }
            if (phoneNumber) {
                queryConditions.push({ phoneNumber });
            }
            if (queryConditions.length === 0) {
                throw new Error('Either emailAddress or phoneNumber must be provided.');
            }
            const user = await this.dbUser.findOne({
                where: {
                    [sequelize_1.Op.or]: queryConditions,
                },
            });
            if (!user)
                throw new core_1.UnAuthorizedError('Invalid User');
            if (platform === 'email') {
                const otp = await this.otp_service.storeOTPInDb({
                    userId: user.id,
                    receivingMedium: 'EMAIL',
                });
                await (0, app_1.dispatch)('event:sendMail', {
                    to: emailAddress,
                    subject: 'Verify Account',
                    body: (0, mails_1.accountVerificationMail)({
                        otp: otp?.toString(),
                        fullName: user.fullName,
                    }),
                });
                core_1.logger.info('Successfully Sent Mail');
                return {
                    code: core_1.HttpStatus.OK,
                    message: 'Code Resent Successfully',
                };
            }
            const otp = await this.otp_service.storeOTPInDb({
                userId: user.id,
                receivingMedium: 'SMS',
            });
            await (0, app_1.dispatch)('event:sendSms', {
                body: `It appears that you are in the process of logging in to your account. The six-digit code that you can use to log in on your account is shown below. ${otp}`,
                phoneNumber: user.phoneNumber,
            });
            core_1.logger.info('Successfully Sent SMS');
            return {
                code: core_1.HttpStatus.OK,
                message: 'Code Resent Successfully',
            };
        };
    }
}
const verifyIdentityInstance = new VerifyIdentity(user_1.User, new utils_1.OTPService(auth_1.OTP));
exports.default = verifyIdentityInstance;
