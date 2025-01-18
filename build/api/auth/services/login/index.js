"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Login = void 0;
const utils_1 = require("@/api/auth/utils");
const store_user_model_1 = require("@/api/store/store-user.model");
const models_1 = require("@/api/user/models");
const app_cache_1 = require("@/app/app-cache");
const core_1 = require("@/core");
class Login {
    constructor(dbUser, dbStoreUser) {
        this.dbUser = dbUser;
        this.dbStoreUser = dbStoreUser;
        this.handle = async (payload, type) => {
            const { input, request } = payload;
            if (!input)
                throw new core_1.BadRequestError(`Invalid login credentials`);
            const { emailAddress, password } = input;
            const normalizedEmail = emailAddress.toLowerCase();
            let user = null;
            if (type === 'user') {
                const existingUser = await this.dbUser.findOne({
                    where: {
                        emailAddress: normalizedEmail,
                        provider: 'local',
                    },
                });
                if (existingUser)
                    user = existingUser;
            }
            // Add store ID here
            if (type === 'store_user') {
                const existingUser = await this.dbStoreUser.findOne({
                    where: {
                        emailAddress: normalizedEmail,
                    },
                });
                if (existingUser)
                    user = existingUser;
            }
            if (!user || user.isSoftDeleted())
                throw new core_1.BadRequestError('Invalid login credentials');
            if (user.password) {
                const isPasswordValid = await (0, core_1.compareHashedData)(password, user.password);
                if (!isPasswordValid)
                    throw new core_1.BadRequestError('Invalid login credentials');
            }
            const tokenPayload = {
                id: user.id,
            };
            const accessToken = await this.handleAccessToken(request, tokenPayload);
            const refreshToken = utils_1.authUtil._generateToken({
                data: tokenPayload,
                expiresIn: core_1.config.auth.refreshTokenExpiresIn,
                secret: core_1.config.auth.refreshTokenSecret,
            });
            await app_cache_1.cache.set(`${user?.id}_REFRESH_TOKEN`, refreshToken);
            if (!accessToken)
                throw new core_1.BadRequestError('Authentication failed');
            core_1.logger.info('Logged In Successfully');
            return {
                code: core_1.HttpStatus.OK,
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
        this.handleAccessToken = (req, user) => {
            const accessToken = utils_1.authUtil._generateToken({
                data: user,
                expiresIn: core_1.config.auth.accessTokenExpiresIn,
                secret: core_1.config.auth.accessTokenSecret,
            });
            return new Promise((resolve, reject) => {
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    return resolve(accessToken);
                });
            });
        };
    }
}
exports.Login = Login;
const loginInstance = new Login(models_1.User, store_user_model_1.StoreUser);
exports.default = loginInstance;
