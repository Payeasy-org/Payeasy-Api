import { OTP } from '../models';

type SaveOTPInDB = {
    userId: string;
    receivingMedium: 'EMAIL' | 'SMS';
    isStoreUser?: boolean;
};

export class OTPService {
    constructor(private readonly dbOtp: typeof OTP) {}

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
        const otpData = await this.dbOtp.findOne({ where: { userId } });

        if (!otpData || otp != otpData.otp) return false;

        if (this.isOTPExpired(otpData.otpExp)) return false;

        return true;
    }

    async storeOTPInDb(data: SaveOTPInDB): Promise<number> {
        const { userId, receivingMedium, isStoreUser = false } = data;

        const otp = this.createOtp();

        const otpExp = this.createOTPExp();

        const otpData = await this.dbOtp.findOne({ where: { userId } });

        if (otpData) {
            await this.dbOtp.update({ otp, otpExp }, { where: { userId } });
        } else {
            await this.dbOtp.create({ otp, otpExp, userId, receivingMedium, userType: isStoreUser ? 'STORE_USER' : 'USER' });
        }

        return otp;
    }
}
