import { LoginPayload } from '@/api/auth/interfaces';
import { authUtil } from '@/api/auth/utils';
import { StoreUser } from '@/api/store/store-user.model';
import { User } from '@/api/user/models';
import { cache } from '@/app/app-cache';
import { BadRequestError, compareHashedData, config, ControllerArgs, HttpStatus, ITokenSignedPayload, logger } from '@/core';
import { Request } from 'express';

export class Login {
    constructor(private readonly dbUser: typeof User, private readonly dbStoreUser: typeof StoreUser) {}

    handle = async (payload: ControllerArgs<LoginPayload>, type: 'user' | 'store_user') => {
        const { input, request } = payload;

        if (!input) throw new BadRequestError(`Invalid login credentials`);

        const { emailAddress, password } = input;

        const normalizedEmail = emailAddress.toLowerCase();

        let user: User | StoreUser | null = null;

        if (type === 'user') {
            const existingUser = await this.dbUser.findOne({
                where: {
                    emailAddress: normalizedEmail,
                    provider: 'local',
                },
            });

            if (existingUser) user = existingUser;
        }

        // Add store ID here
        if (type === 'store_user') {
            const existingUser = await this.dbStoreUser.findOne({
                where: {
                    emailAddress: normalizedEmail,
                    
                },
            });

            if (existingUser) user = existingUser;
        }

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

const loginInstance = new Login(User, StoreUser);

export default loginInstance;
