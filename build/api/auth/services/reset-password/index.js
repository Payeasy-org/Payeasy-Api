"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/api/auth/utils");
const user_1 = require("@/api/user");
const core_1 = require("@/core");
const sequelize_1 = require("sequelize");
const models_1 = require("../../models");
class ResetPassword {
    constructor(dbUser, otp_service) {
        this.dbUser = dbUser;
        this.otp_service = otp_service;
        this.handle = async ({ input }) => {
            if (!input)
                throw new core_1.BadRequestError(`Invalid Input`);
            const { emailAddress, otp, password, phoneNumber } = input;
            const orConditions = [{ emailAddress: emailAddress.toLowerCase() }];
            if (phoneNumber) {
                orConditions.push({ phoneNumber });
            }
            const authUser = await this.dbUser.findOne({
                where: {
                    [sequelize_1.Op.or]: orConditions,
                },
            });
            if (!authUser)
                throw new core_1.BadRequestError('Invalid User');
            const otpValid = await this.otp_service.isOtpValid(authUser.id, Number(otp));
            if (!otpValid)
                throw new core_1.BadRequestError('Invalid OTP');
            const hashPassword = await (0, core_1.hashData)(password);
            await this.dbUser.update({ password: hashPassword }, { where: { [sequelize_1.Op.or]: orConditions } });
            core_1.logger.info('Password Changed Successfully');
            return {
                code: core_1.HttpStatus.OK,
                message: 'Password Changed Successfully',
            };
        };
    }
}
const resetPasswordInstance = new ResetPassword(user_1.User, new utils_1.OTPService(models_1.OTP));
exports.default = resetPasswordInstance;
