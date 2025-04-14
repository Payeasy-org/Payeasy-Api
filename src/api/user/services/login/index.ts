import { cache } from '@/app/app-cache';
import { BadRequestError, compareHashedData, config, ControllerArgs, HttpStatus, ITokenSignedPayload, logger } from '@/core';
import { LoginPayload } from '@user/interfaces';
import { Request } from 'express';
import { User } from '@user/models';
import { authUtil } from '@user/utils';

export class Login {
    constructor(private readonly dbUser: typeof User) {}

    handle = async (payload: ControllerArgs<LoginPayload>) => {
        const { input, request } = payload;

        if (!input) throw new BadRequestError(`Invalid login credentials`);

        const { emailAddress, password } = input;

        const normalizedEmail = emailAddress.toLowerCase();

        let user: User | null = null;

        const existingUser = await this.dbUser.findOne({
            where: {
                emailAddress: normalizedEmail,
                provider: 'local',
            },
        });

        if (existingUser) user = existingUser;

        if (!user || user.isSoftDeleted()) throw new BadRequestError('Invalid login credentials');

        if (user.password) {
            const isPasswordValid = await compareHashedData(password, user.password);

            if (!isPasswordValid) throw new BadRequestError('Invalid login credentials');
        }

        const tokenPayload = {
            id: user.id,
        };

        const accessToken = await this.handleAccessToken(request, tokenPayload);

        const refreshToken = authUtil._generateToken({
            data: tokenPayload,
            expiresIn: config.auth.refreshTokenExpiresIn,
            secret: config.auth.refreshTokenSecret,
        });

        await cache.set(`${user?.id}_REFRESH_TOKEN`, refreshToken);

        if (!accessToken) throw new BadRequestError('Authentication failed');

        logger.info('Logged In Successfully');

        return {
            code: HttpStatus.OK,
            message: 'Logged in Successfully',
            data: {
                user: {
                    ...user.toJSON(),
                    password: undefined,
                },
                tokens: {
                    accessToken,
                    refreshToken,
                },
            },
        };
    };

    private handleAccessToken = (req: Request, user: ITokenSignedPayload): Promise<string> => {
        const accessToken = authUtil._generateToken({
            data: user,
            expiresIn: config.auth.accessTokenExpiresIn,
            secret: config.auth.accessTokenSecret,
        });

        return new Promise((resolve, reject) => {
            req.login(user, { session: false }, (err: Error) => {
                if (err) {
                    return reject(err);
                }

                return resolve(accessToken);
            });
        });
    };
}

const loginInstance = new Login(User);

export default loginInstance;
