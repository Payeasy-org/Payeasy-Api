import { User } from '@/api/user';
import { dispatch } from '@/app';
import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';
import { accountVerificationMail } from '@/core/services/mails';
import { ForgotPasswordPayload } from '@auth/interfaces';
import { OTP } from '@auth/models';
import { OTPService } from '@auth/utils';

class ForgotPassword {
    constructor(private readonly dbUser: typeof User, private readonly otp_service: OTPService) {}

    handle = async ({ input }: ControllerArgs<ForgotPasswordPayload>) => {
        if (!input) throw new BadRequestError(`Invalid Input`);

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
                    code: HttpStatus.OK,
                    message: `If you have an account with us, You will receive a mail to ${emailAddress}`,
                };
            }

            const otp = await this.otp_service.storeOTPInDb({
                userId: authUser.id,
                receivingMedium: 'EMAIL',
            });

            await dispatch('event:sendMail', {
                to: emailAddress,
                subject: 'Forgot Password',
                body: accountVerificationMail({
                    otp: otp?.toString(),
                    fullName: authUser.fullName,
                }),
            });

            logger.info('Successfully Sent Forgot Password Mail to ' + emailAddress);

            return {
                code: HttpStatus.OK,
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
                code: HttpStatus.OK,
                message: `If you have an account with us, You will receive an SMS to ${phoneNumber}`,
            };
        }

        const otp = await this.otp_service.storeOTPInDb({
            userId: authUser.id,
            receivingMedium: 'SMS',
        });

        await dispatch('event:sendSms', {
            body: `It appears that you Forgot your password. The four-digit code that you can use to reset your password for your account is shown below. ${otp}`,
            phoneNumber,
        });

        logger.info('Successfully Sent Forgot Password Text to ' + phoneNumber);

        return {
            code: HttpStatus.OK,
            message: `If you have an account with us, You will receive as SM to ${phoneNumber}`,
        };
        // }
    };
}

const forgotPasswordInstance = new ForgotPassword(User, new OTPService(OTP));
export default forgotPasswordInstance;
