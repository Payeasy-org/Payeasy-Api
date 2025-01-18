import { RefreshTokenPayload } from '@/api/auth/interfaces';
import { authUtil } from '@/api/auth/utils';
import { cache } from '@/app/app-cache';
import { BadRequestError, config, ControllerArgs, HttpStatus, UnAuthorizedError } from '@/core';

class RefreshToken {
    constructor() {}

    handle = async ({ input, request }: ControllerArgs<RefreshTokenPayload>) => {
        const oldAccessToken = request.headers.authorization?.split(' ')[1];

        if(!oldAccessToken) {
            throw new UnAuthorizedError("Unauthorized: No Access Token Provided")
        }

        if (!input?.refreshToken) {
            throw new BadRequestError('Bad Request: No refresh token provided');
        }

        const { refreshToken: oldRefreshToken } = input;

        const tokenPayload = await authUtil._extractTokenDetails(oldRefreshToken, config.auth.refreshTokenSecret);

        if (!tokenPayload) {
            throw new BadRequestError('Unauthorized: Invalid refresh token');
        }

        const refreskTokenIsValid = await cache.get(`${tokenPayload?.id}_REFRESH_TOKEN`);

        if (!refreskTokenIsValid || refreskTokenIsValid !== oldRefreshToken) {
            throw new BadRequestError('Unauthorized: Invalid refresh token');
        }

        await authUtil._blacklistToken(oldAccessToken);

        const newAccessToken = authUtil._generateToken({
            data: {id:tokenPayload.id},
            expiresIn: config.auth.accessTokenExpiresIn,
            secret: config.auth.accessTokenSecret,
        });

        const newRefreshToken = authUtil._generateToken({
            data: { id: tokenPayload.id },
            expiresIn: config.auth.refreshTokenExpiresIn,
            secret: config.auth.refreshTokenSecret,
        });

        await cache.set(`${tokenPayload?.id}_REFRESH_TOKEN`, newRefreshToken);

        await new Promise((resolve, reject) => {
            request.login(tokenPayload, { session: false }, (err: Error) => {
                if (err) {
                    return reject(err);
                }

                return resolve(newAccessToken);
            });
        });

        return {
            code: HttpStatus.OK,
            message: 'Token Refreshed Successfully',
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        };
    };
}

const refreshTokenInstance = new RefreshToken();
export default refreshTokenInstance;
