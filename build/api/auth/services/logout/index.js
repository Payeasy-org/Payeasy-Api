"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logout = void 0;
const app_cache_1 = require("@/app/app-cache");
const core_1 = require("@/core");
const utils_1 = require("../../utils");
class Logout {
    constructor() {
        this.handle = async (req, res, next) => {
            const accessToken = req.header('Authorization')?.split(' ')[1];
            if (!accessToken) {
                throw new core_1.UnAuthorizedError('Unauthorized: No access token provided');
            }
            const data = await utils_1.authUtil._extractTokenDetails(accessToken, core_1.config.auth.accessTokenSecret);
            if (!data) {
                throw new core_1.UnAuthorizedError('Unauthorized: Invalid token data');
            }
            await utils_1.authUtil._blacklistToken(accessToken);
            await app_cache_1.cache.remove(`${data?.id}_REFRESH_TOKEN`);
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(core_1.HttpStatus.NO_CONTENT).send({ message: 'Logged out Successfully' });
            });
        };
    }
}
exports.Logout = Logout;
const logoutInstance = new Logout();
exports.default = logoutInstance;
