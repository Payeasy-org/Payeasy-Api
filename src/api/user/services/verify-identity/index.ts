import { OTP } from '@/api/auth';
import { OTPService } from '@/api/auth/utils';
import { User } from '@/api/user';
import { dispatch } from '@/app';
import { BadRequestError, ControllerArgs, HttpStatus, logger, UnAuthorizedError } from '@/core';
import { accountVerificationMail } from '@/core/services/mails';
import { Op } from 'sequelize';
import { ResendVerifyIdentityEmailPayload, VerifyIdentityPayload } from '../../interfaces';

class VerifyIdentity {
    constructor(private readonly dbUser: typeof User, private readonly otp_service: OTPService) {}

    handle = async ({ input }: ControllerArgs<VerifyIdentityPayload>) => {
        if (!input) throw new BadRequestError(`Invalid Input`);

        const { emailAddress, phoneNumber, otp, platform } = input;

        const queryConditions: any[] = [];

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
                [Op.or]: queryConditions,
            },
        });

        if (!user) throw new BadRequestError('Invalid User');

        const otpValid = await this.otp_service.isOtpValid(user.id, Number(otp));

        if (!otpValid) throw new BadRequestError('Invalid OTP');

        if (platform === 'email') {
            await this.dbUser.update(
                { emailVerified: true },
                {
                    where: {
                        id: user.id,
                    },
                },
            );
        }

        if (platform === 'phone') {
            await this.dbUser.update(
                { phoneNumberVerified: true },
                {
                    where: {
                        id: user.id,
                    },
                },
            );
        }

        logger.info('Identity Verified Successfully');

        return {
            code: HttpStatus.OK,
            message: 'Identity Verified Successfully',
        };
    };

    resendVerificationMessage = async ({ input }: ControllerArgs<ResendVerifyIdentityEmailPayload>) => {
        if (!input) throw new BadRequestError(`Invalid Input`);

        const { emailAddress, phoneNumber, platform } = input;

        const queryConditions: any[] = [];

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
                [Op.or]: queryConditions,
            },
        });

        if (!user) throw new UnAuthorizedError('Invalid User');

        if (platform === 'email') {
            const otp = await this.otp_service.storeOTPInDb({
                userId: user.id,
                receivingMedium: 'EMAIL',
            });

            await dispatch('event:sendMail', {
                to: emailAddress,
                subject: 'Verify Account',
                body: accountVerificationMail({
                    otp: otp?.toString(),
                    fullName: user.fullName,
                }),
            });

            logger.info('Successfully Sent Mail');

            return {
                code: HttpStatus.OK,
                message: 'Code Resent Successfully',
            };
        }

        const otp = await this.otp_service.storeOTPInDb({
            userId: user.id,
            receivingMedium: 'SMS',
        });

        await dispatch('event:sendSms', {
            body: `It appears that you are in the process of logging in to your account. The six-digit code that you can use to log in on your account is shown below. ${otp}`,
            phoneNumber: user.phoneNumber,
        });

        logger.info('Successfully Sent SMS');

        return {
            code: HttpStatus.OK,
            message: 'Code Resent Successfully',
        };
    };
}

const verifyIdentityInstance = new VerifyIdentity(User, new OTPService(OTP));
export default verifyIdentityInstance