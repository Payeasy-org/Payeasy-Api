"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.passport = void 0;
const utils_1 = require("@/api/auth/utils");
const models_1 = require("@/api/user/models");
const core_1 = require("@/core");
const common_1 = require("@/core/common");
const passport_1 = require("passport");
const passport_google_oauth_1 = require("passport-google-oauth");
const passport_jwt_1 = __importStar(require("passport-jwt"));
class Passport extends passport_1.Passport {
    constructor(dbUser) {
        super();
        this.dbUser = dbUser;
        this.initialisePassportAuthentication = (app) => {
            exports.passport.serializeUser((user, done) => {
                process.nextTick(() => {
                    done(null, user);
                });
            });
            exports.passport.deserializeUser(async (data, done) => {
                try {
                    const user = await models_1.User.findByPk(data.id);
                    if (user) {
                        return done(null, {
                            id: user.id,
                        });
                    }
                }
                catch (err) {
                    return done(err, null);
                }
            });
            this.googleStrategy(app);
            this.jwtStrategy();
        };
        this.googleStrategy = (app) => {
            const GoogleStrategy = passport_google_oauth_1.OAuth2Strategy;
            const googleAuthOptions = {
                ...core_1.config.google,
                passReqToCallback: true,
            };
            exports.passport.use(new GoogleStrategy(googleAuthOptions, this.googleVerifyCallback));
            app.get(`${common_1.API_SUFFIX}/auth/google`, exports.passport.authenticate('google', {
                scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
            }));
            app.get(`${common_1.API_SUFFIX}/auth/google/callback`, exports.passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
                if (!req.user)
                    throw new core_1.UnAuthorizedError('Invalid User');
                const accessToken = utils_1.authUtil._generateToken({
                    data: req.user,
                    expiresIn: core_1.config.auth.accessTokenExpiresIn,
                    secret: core_1.config.auth.accessTokenSecret,
                });
                const refreshToken = utils_1.authUtil._generateToken({
                    data: req.user,
                    expiresIn: core_1.config.auth.refreshTokenExpiresIn,
                    secret: core_1.config.auth.refreshTokenSecret,
                });
                return res
                    .status(308)
                    .cookie('jwt', accessToken, {
                    httpOnly: true,
                })
                    .set({
                    Location: `${core_1.config.frontendOriginUrl}?provider=google&accessToken=${accessToken}&refreshToken=${refreshToken}`,
                })
                    .send({
                    message: 'Authenticated Successfully!',
                });
            });
            return app;
        };
        this.jwtStrategy = () => {
            const strategyOptions = {
                jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
                secretOrKey: core_1.config.auth.accessTokenSecret,
            };
            const JWTStrategy = passport_jwt_1.default.Strategy;
            exports.passport.use(new JWTStrategy(strategyOptions, this.jwtVerifyCallback));
        };
        this.googleVerifyCallback = async (req, _, __, profile, done) => {
            try {
                const user = await this.dbUser.findOne({
                    where: {
                        providerId: profile.id,
                    },
                });
                if (user) {
                    return done(null, {
                        id: user.id,
                    });
                }
            }
            catch (error) {
                return done(error, null);
            }
            if (!profile.emails || profile?.emails?.length <= 0)
                return done('No Verified Email', null);
            const verifiedEmail = profile.emails?.find((email) => email.value) || profile?.emails[0];
            const transaction = await core_1.sequelize.transaction();
            try {
                const userWithSameEmail = await this.dbUser.findOne({
                    where: {
                        emailAddress: verifiedEmail.value,
                    },
                });
                if (userWithSameEmail && userWithSameEmail.provider == 'local') {
                    userWithSameEmail.providerId = profile.id;
                    await userWithSameEmail.save();
                    return done(null, {
                        id: userWithSameEmail.id,
                    });
                }
                const newUser = await this.dbUser.create({
                    fullName: profile.displayName,
                    provider: profile.provider,
                    providerId: profile.id,
                    emailAddress: verifiedEmail.value,
                    password: null,
                }, { transaction });
                core_1.logger.info('Account Created with Google Successfully');
                transaction.commit();
                if (newUser) {
                    return done(null, {
                        id: newUser.id,
                    });
                }
            }
            catch (error) {
                core_1.logger.error('Error with google auth: ', error);
                transaction.rollback();
                return done(error, null);
            }
        };
        this.jwtVerifyCallback = async (jwtPayload, done) => {
            const userId = jwtPayload.data._id;
            if (!userId)
                return done(new Error('Invalid User Id'));
            try {
                const user = await models_1.User.findByPk(userId);
                if (user) {
                    return done(null, {
                        id: user.id,
                    });
                }
            }
            catch (error) {
                return done(error);
            }
        };
    }
}
exports.passport = new Passport(models_1.User);
