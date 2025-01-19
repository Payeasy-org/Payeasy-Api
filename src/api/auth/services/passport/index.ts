import { authUtil } from '@/api/auth/utils';
import { User } from '@/api/user/models';
import { config, logger, sequelize, UnAuthorizedError } from '@/core';
import { API_SUFFIX } from '@/core/common';
import type { Express, Request } from 'express';
import { Passport as PassportClass, Profile } from 'passport';
import { OAuth2Strategy, VerifyFunction } from 'passport-google-oauth';
import passportJWT, { ExtractJwt, StrategyOptionsWithoutRequest } from 'passport-jwt';

class Passport extends PassportClass {
    constructor(private readonly dbUser: typeof User) {
        super();
    }

    initialisePassportAuthentication = (app: Express) => {
        passport.serializeUser((user, done) => {
            process.nextTick(() => {
                done(null, user);
            });
        });

        passport.deserializeUser(async (data: { id: string }, done) => {
            try {
                const user = await User.findByPk(data.id);

                if (user) {
                    return done(null, {
                        id: user.id,
                    });
                }
            } catch (err) {
                return done(err, null);
            }
        });

        this.googleStrategy(app);

        this.jwtStrategy();
    };

    googleStrategy = (app: Express) => {
        const GoogleStrategy = OAuth2Strategy;

        const googleAuthOptions = {
            ...config.google,
            passReqToCallback: true,
        };

        passport.use(new GoogleStrategy(googleAuthOptions, this.googleVerifyCallback));

        app.get(
            `${API_SUFFIX}/auth/google`,

            passport.authenticate('google', {
                scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email'],
            }),
        );

        app.get(`${API_SUFFIX}/auth/google/callback`, passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
            if (!req.user) throw new UnAuthorizedError('Invalid User');

            const accessToken = authUtil._generateToken({
                data: req.user,
                expiresIn: config.auth.accessTokenExpiresIn,
                secret: config.auth.accessTokenSecret,
            });

            const refreshToken = authUtil._generateToken({
                data: req.user,
                expiresIn: config.auth.refreshTokenExpiresIn,
                secret: config.auth.refreshTokenSecret,
            });

            return res
                .status(308)
                .cookie('jwt', accessToken, {
                    httpOnly: true,
                })
                .set({
                    Location: `${config.frontendOriginUrl}?provider=google&accessToken=${accessToken}&refreshToken=${refreshToken}`,
                })
                .send({
                    message: 'Authenticated Successfully!',
                });
        });

        return app;
    };

    jwtStrategy = () => {
        const strategyOptions: StrategyOptionsWithoutRequest = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('jwt'),
            secretOrKey: config.auth.accessTokenSecret,
        };

        const JWTStrategy = passportJWT.Strategy;

        passport.use(new JWTStrategy(strategyOptions, this.jwtVerifyCallback));
    };

    private googleVerifyCallback = async (req: Request, _: string, __: string, profile: Profile, done: VerifyFunction) => {
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
        } catch (error) {
            return done(error, null);
        }

        if (!profile.emails || profile?.emails?.length <= 0) return done('No Verified Email', null);

        const verifiedEmail = profile.emails?.find((email) => email.value) || profile?.emails[0];

        const transaction = await sequelize.transaction();

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

            const newUser = await this.dbUser.create(
                {
                    fullName: profile.displayName,
                    provider: profile.provider,
                    providerId: profile.id,
                    emailAddress: verifiedEmail.value,
                    password: null,
                },
                { transaction },
            );

            logger.info('Account Created with Google Successfully');

            transaction.commit();

            if (newUser) {
                return done(null, {
                    id: newUser.id,
                });
            }
        } catch (error) {
            logger.error('Error with google auth: ', error);

            transaction.rollback();

            return done(error, null);
        }
    };

    private jwtVerifyCallback = async (jwtPayload: any, done: VerifyFunction) => {
        const userId = jwtPayload.data._id;

        if (!userId) return done(new Error('Invalid User Id'));

        try {
            const user = await User.findByPk(userId);

            if (user) {
                return done(null, {
                    id: user.id,
                });
            }
        } catch (error) {
            return done(error);
        }
    };
}

export const passport = new Passport(User);
