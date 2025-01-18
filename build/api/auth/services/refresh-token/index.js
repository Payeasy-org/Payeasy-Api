"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@/api/auth/utils");
const app_cache_1 = require("@/app/app-cache");
const core_1 = require("@/core");
class RefreshToken {
    constructor() {
        this.handle = async ({ input, request }) => {
            const oldAccessToken = request.headers.authorization?.split(' ')[1];
            if (!oldAccessToken) {
                throw new core_1.UnAuthorizedError("Unauthorized: No Access Token Provided");
            }
            if (!input?.refreshToken) {
                throw new core_1.BadRequestError('Bad Request: No refresh token provided');
            }
            const { refreshToken: oldRefreshToken } = input;
            const tokenPayload = await utils_1.authUtil._extractTokenDetails(oldRefreshToken, core_1.config.auth.refreshTokenSecret);
            if (!tokenPayload) {
                throw new core_1.BadRequestError('Unauthorized: Invalid refresh token');
            }
            const refreskTokenIsValid = await app_cache_1.cache.get(`${tokenPayload?.id}_REFRESH_TOKEN`);
            if (!refreskTokenIsValid || refreskTokenIsValid !== oldRefreshToken) {
                throw new core_1.BadRequestError('Unauthorized: Invalid refresh token');
            }
            await utils_1.authUtil._blacklistToken(oldAccessToken);
            const newAccessToken = utils_1.authUtil._generateToken({
                data: { id: tokenPayload.id },
                expiresIn: core_1.config.auth.accessTokenExpiresIn,
                secret: core_1.config.auth.accessTokenSecret,
            });
            const newRefreshToken = utils_1.authUtil._generateToken({
                data: { id: tokenPayload.id },
                expiresIn: core_1.config.auth.refreshTokenExpiresIn,
                secret: core_1.config.auth.refreshTokenSecret,
            });
            await app_cache_1.cache.set(`${tokenPayload?.id}_REFRESH_TOKEN`, newRefreshToken);
            await new Promise((resolve, reject) => {
                request.login(tokenPayload, { session: false }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(newAccessToken);
                });
            });
            return {
                code: core_1.HttpStatus.OK,
                message: 'Token Refreshed Successfully',
                data: {
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken,
                },
            };
        };
    }
}
const refreshTokenInstance = new RefreshToken();
exports.default = refreshTokenInstance;
