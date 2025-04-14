import { UserCode } from '../models/userCode.model';

export class OTPService {
    constructor(private readonly dbUserCode: typeof UserCode) {}

    createOtp(): number {
        const digits = '123456789';
        const otpLength = 6;

        const otpArray = Array.from({ length: otpLength }, () => +digits[Math.floor(Math.random() * digits.length)]);

        const otp = parseInt(otpArray.join(''), 10);

        return otp;
    }

    createOTPExp(): Date {
        const expirationMinutes = 15;

        const expDate = new Date();

        expDate.setMinutes(expDate.getMinutes() + expirationMinutes);

        return expDate;
    }

    isOTPExpired(expDate: Date) {
        return new Date() > expDate;
    }

    async isOtpValid(userId: string, otp: number): Promise<boolean> {
        const otpData = await this.dbUserCode.findOne({ where: { userId } });

        if (!otpData || otp != otpData.code) return false;

        if (this.isOTPExpired(otpData.expiresAt)) return false;

        return true;
    }

    async storeOTPInDb(userId: string): Promise<number> {
        const otp = this.createOtp();

        const otpExp = this.createOTPExp();

        const otpData = await this.dbUserCode.findOne({ where: { userId } });

        if (otpData) {
            await this.dbUserCode.update({ code: otp, expiresAt: otpExp }, { where: { userId } });
        } else {
            await this.dbUserCode.create({ code: otp, expiresAt: otpExp, userId });
        }

        return otp;
    }
}
