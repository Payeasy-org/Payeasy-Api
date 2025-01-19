import { ResetPasswordPayload } from '@/api/auth/interfaces';
import { OTPService } from '@/api/auth/utils';
import { User } from '@/api/user';
import { BadRequestError, ControllerArgs, hashData, HttpStatus, logger } from '@/core';
import { Op } from 'sequelize';
import { OTP } from '../../models';

class ResetPassword {
    constructor(private readonly dbUser: typeof User, private readonly otp_service: OTPService) {}

    handle = async ({ input }: ControllerArgs<ResetPasswordPayload>) => {
        if (!input) throw new BadRequestError(`Invalid Input`);

        const { emailAddress, otp, password, phoneNumber } = input;

        const orConditions: Record<string, string>[] = [{ emailAddress: emailAddress.toLowerCase() }];

        if (phoneNumber) {
            orConditions.push({ phoneNumber });
        }

        const authUser = await this.dbUser.findOne({
            where: {
                [Op.or]: orConditions,
            },
        });

        if (!authUser) throw new BadRequestError('Invalid User');

        const otpValid = await this.otp_service.isOtpValid(authUser.id, Number(otp));

        if (!otpValid) throw new BadRequestError('Invalid OTP');

        const hashPassword = await hashData(password);

        await this.dbUser.update({ password: hashPassword }, { where: { [Op.or]: orConditions} });

        logger.info('Password Changed Successfully');

        return {
            code: HttpStatus.OK,
            message: 'Password Changed Successfully',
        };
    };
}

const resetPasswordInstance = new ResetPassword(User, new OTPService(OTP));
export default resetPasswordInstance;
