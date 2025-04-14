import { BadRequestError, ConflictError, ControllerArgs, hashData, HttpStatus, logger } from '@/core';
import { AppMessages } from '@/core/common';
import { SignupPayload } from '@user/interfaces';
import { User } from '@user/models';
import { Op } from 'sequelize';

export class Register {
    constructor(private readonly dbUser: typeof User) {}

    handleUser = async ({ input }: ControllerArgs<SignupPayload>) => {
        if (!input) throw new BadRequestError(`Invalid credentials`);

        const { emailAddress, password, phoneNumber } = input;

        const normalizedEmail = emailAddress.toLowerCase();

        const orConditions: Record<string, string>[] = [{ emailAddress: normalizedEmail }];

        if (phoneNumber) {
            orConditions.push({ phoneNumber });
        }

        const userExists = await this.dbUser.findOne({
            where: {
                [Op.or]: orConditions,
            },
        });

        if (userExists) throw new ConflictError(AppMessages.FAILURE.ACCOUNT_EXISTS);

        const hashedPassword = await hashData(password);

        const newUser = await this.dbUser.create({ ...input, emailAddress: normalizedEmail, password: hashedPassword, provider: 'local' });

        logger.info('User Account Created Successfully');

        return {
            data: {
                ...newUser.toJSON(),
                password: undefined,
            },
            code: HttpStatus.CREATED,
            message: 'User Created Successfully',
        };
    };
}

const registerInstance = new Register(User);

export default registerInstance;
