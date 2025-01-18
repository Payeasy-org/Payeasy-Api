import { cache } from '@/app/app-cache';
import { config, HttpStatus, UnAuthorizedError } from '@/core';
import type { NextFunction, Request, Response } from 'express';
import { authUtil } from '../../utils';

export class Logout {
    constructor() {}

    handle = async (req: Request, res: Response, next: NextFunction) => {
        const accessToken = req.header('Authorization')?.split(' ')[1];

        if (!accessToken) {
            throw new UnAuthorizedError('Unauthorized: No access token provided');
        }

        const data = await authUtil._extractTokenDetails(accessToken, config.auth.accessTokenSecret);

        if (!data) {
            throw new UnAuthorizedError('Unauthorized: Invalid token data');
        }

        await authUtil._blacklistToken(accessToken);
        await cache.remove(`${data?.id}_REFRESH_TOKEN`);

        req.logout(function (err) {
            if (err) {
                return next(err);
            }

            return res.status(HttpStatus.NO_CONTENT).send({ message: 'Logged out Successfully' });
        });
    };
}

const logoutInstance = new Logout();
export default logoutInstance;
