import { config } from '@/core';
import CryptoJS from 'crypto-js';
import jwt, { type JwtPayload } from 'jsonwebtoken';

import { cache } from '@/app/app-cache';
import { logger, UnAuthorizedError, type ITokenSignedPayload } from '@/core';
import { AppMessages } from '@/core/common';
import crypto from 'crypto';

export class AuthUtil {
    constructor(private readonly encryptorSecretKey: string = config.auth.encryptorSecretKey) {}

    _generateToken({ data, secret, expiresIn }: { data: ITokenSignedPayload; expiresIn: string; secret: string }): string {
        const token = jwt.sign(data, secret, {
            expiresIn,
            jwtid: crypto.randomUUID(),
        });

        return this.encrypt(token);
    }

    async _extractTokenDetails(encryptedToken: string, secret: string) {
        const decryptedToken = this.decrypt(encryptedToken);
        

        const tokenDetails = this._verifyToken(decryptedToken, secret);

        const tokenPayload = tokenDetails as ITokenSignedPayload;

      

        return tokenPayload;
    }

    _verifyToken(token: string, secret: string): JwtPayload {
        try {
            jwt.verify(token, secret) as JwtPayload;

            return jwt.decode(token) as jwt.JwtPayload;
        } catch (err) {
            logger.error(err);
            throw new UnAuthorizedError(AppMessages.FAILURE.INVALID_TOKEN_PROVIDED);
        }
    }

    async _blacklistToken(encryptedToken: string) {
        const decryptedToken = this.decrypt(encryptedToken);

        const decodedToken = jwt.decode(decryptedToken) as jwt.JwtPayload;

        if (!decodedToken || !decodedToken?.exp) return;

        const ttl = Math.floor(decodedToken.exp - Date.now() / 1000);

        if (ttl <= 0) return;

        await cache.set(`blacklist:token:${decryptedToken}`, 'true', 'EX', ttl);
    }

    async isTokenBlacklisted(encryptedToken: string) {
        const decryptedToken = this.decrypt(encryptedToken);

        return (await cache.get(`blacklist:token:${decryptedToken}`)) !== null;
    }

    private encrypt = (item: string) => {
        return CryptoJS.AES.encrypt(item, this.encryptorSecretKey).toString();
    };

    private decrypt(encryptedString: string): string {
    
        return CryptoJS.AES.decrypt(encryptedString, this.encryptorSecretKey).toString(CryptoJS.enc.Utf8);
    }
}

export const authUtil = new AuthUtil();
