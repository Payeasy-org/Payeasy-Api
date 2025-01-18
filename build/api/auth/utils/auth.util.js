"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authUtil = exports.AuthUtil = void 0;
const core_1 = require("@/core");
const crypto_js_1 = __importDefault(require("crypto-js"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_cache_1 = require("@/app/app-cache");
const core_2 = require("@/core");
const common_1 = require("@/core/common");
const crypto_1 = __importDefault(require("crypto"));
class AuthUtil {
    constructor(encryptorSecretKey = core_1.config.auth.encryptorSecretKey) {
        this.encryptorSecretKey = encryptorSecretKey;
        this.encrypt = (item) => {
            return crypto_js_1.default.AES.encrypt(item, this.encryptorSecretKey).toString();
        };
    }
    _generateToken({ data, secret, expiresIn }) {
        const token = jsonwebtoken_1.default.sign(data, secret, {
            expiresIn,
            jwtid: crypto_1.default.randomUUID(),
        });
        return this.encrypt(token);
    }
    async _extractTokenDetails(encryptedToken, secret) {
        const decryptedToken = this.decrypt(encryptedToken);
        const tokenDetails = this._verifyToken(decryptedToken, secret);
        const tokenPayload = tokenDetails;
        return tokenPayload;
    }
    _verifyToken(token, secret) {
        try {
            jsonwebtoken_1.default.verify(token, secret);
            return jsonwebtoken_1.default.decode(token);
        }
        catch (err) {
            core_2.logger.error(err);
            throw new core_2.UnAuthorizedError(common_1.AppMessages.FAILURE.INVALID_TOKEN_PROVIDED);
        }
    }
    async _blacklistToken(encryptedToken) {
        const decryptedToken = this.decrypt(encryptedToken);
        const decodedToken = jsonwebtoken_1.default.decode(decryptedToken);
        if (!decodedToken || !decodedToken?.exp)
            return;
        const ttl = Math.floor(decodedToken.exp - Date.now() / 1000);
        if (ttl <= 0)
            return;
        await app_cache_1.cache.set(`blacklist:token:${decryptedToken}`, 'true', 'EX', ttl);
    }
    async isTokenBlacklisted(encryptedToken) {
        const decryptedToken = this.decrypt(encryptedToken);
        return (await app_cache_1.cache.get(`blacklist:token:${decryptedToken}`)) !== null;
    }
    decrypt(encryptedString) {
        return crypto_js_1.default.AES.decrypt(encryptedString, this.encryptorSecretKey).toString(crypto_js_1.default.enc.Utf8);
    }
}
exports.AuthUtil = AuthUtil;
exports.authUtil = new AuthUtil();
