import { dispatch } from '@/app';
import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';
import { accountVerificationMail } from '@/core/services/mails';
import { ForgotPasswordPayload } from '@user/interfaces';
import { UserCode, User } from '@user/models';
import { OTPService } from '@user/utils';

class ForgotPassword {
    constructor(private readonly dbUser: typeof User, private readonly otp_service: OTPService) {}

    handle = async ({ input }: ControllerArgs<ForgotPasswordPayload>) => {
        if (!input) throw new BadRequestError(`Invalid Input`);

        const { emailAddress } = input;

        const user = await this.dbUser.findOne({
            where: {
                emailAddress,
            },
        });

        if (!user) {
            return {
                code: HttpStatus.OK,
                message: `If you have an account with us, You will receive a mail to ${emailAddress}`,
            };
        }

        const otp = await this.otp_service.storeOTPInDb(user.id);

        await dispatch('event:sendMail', {
            to: emailAddress,
            subject: 'Forgot Password',
            body: accountVerificationMail({
                otp: otp?.toString(),
                fullName: user.fullName,
            }),
        });

        logger.info('Successfully Sent Forgot Password Mail to ' + emailAddress);

        return {
            code: HttpStatus.OK,
            message: `If you have an account with us, You will receive a mail to ${emailAddress}`,
        };
    };
}

const forgotPasswordInstance = new ForgotPassword(User, new OTPService(UserCode));
export default forgotPasswordInstance;
