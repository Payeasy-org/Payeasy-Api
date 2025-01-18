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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv = __importStar(require("dotenv"));
const joi_1 = __importDefault(require("joi"));
dotenv.config();
// Define validation schema for environment variables
const envSchema = joi_1.default.object()
    .keys({
    NODE_ENV: joi_1.default.string().valid('development', 'production', 'staging').required(),
    PORT: joi_1.default.number().required(),
    ACCESS_TOKEN_SECRET: joi_1.default.string().required(),
    ACCESS_TOKEN_EXP: joi_1.default.string().required(),
    REFRESH_TOKEN_SECRET: joi_1.default.string().allow('').required(),
    REFRESH_TOKEN_EXP: joi_1.default.string().required(),
    ENCRYPTOR_SECRET_KEY: joi_1.default.string().required(),
    GOOGLE_CLIENT_ID: joi_1.default.string().required(),
    GOOGLE_CLIENT_SECRET: joi_1.default.string().required(),
    SERVER_API_URL: joi_1.default.string().required(),
    DATABASE_NAME: joi_1.default.string().required(),
    DATABASE_HOST: joi_1.default.string().required(),
    DATABASE_USER: joi_1.default.string().required(),
    DATABASE_PASSWORD: joi_1.default.string().allow('').required(),
    DATABASE_TYPE: joi_1.default.string().required(),
    REDIS_HOST: joi_1.default.string().required(),
    REDIS_PORT: joi_1.default.string().required(),
    REDIS_PASSWORD: joi_1.default.string().allow('').required(),
    CLOUDINARY_NAME: joi_1.default.string().required(),
    CLOUDINARY_API_KEY: joi_1.default.string().required(),
    CLOUDINARY_API_SECRET: joi_1.default.string().required(),
    SENDGRID_API_KEY: joi_1.default.string().required(),
    SENDGRID_EMAIL: joi_1.default.string().required(),
    TWILIO_SID: joi_1.default.string().required(),
    TWILIO_AUTH_TOKEN: joi_1.default.string().required(),
    TWILIO_PHONE_NUMBER: joi_1.default.number().required(),
    DEFAULT_EXTENSION_AGENT_PASSWORD: joi_1.default.string().required(),
    PAYSTACK_SECRET_KEY: joi_1.default.string().required(),
    FRONTEND_LIVE_ORIGIN: joi_1.default.string().required(),
})
    .unknown();
// Validate environment variables against the schema
const { value: validatedEnvVars, error: validationError } = envSchema.prefs({ errors: { label: 'key' } }).validate(process.env);
// Throw an error if validation fails
if (validationError) {
    throw new Error(`Config validation error: ${validationError.message}`);
}
exports.config = Object.freeze({
    port: validatedEnvVars.PORT,
    appEnvironment: validatedEnvVars.NODE_ENV,
    auth: {
        accessTokenSecret: validatedEnvVars.ACCESS_TOKEN_SECRET,
        accessTokenExpiresIn: validatedEnvVars.ACCESS_TOKEN_EXP,
        refreshTokenSecret: validatedEnvVars.REFRESH_TOKEN_SECRET,
        refreshTokenExpiresIn: validatedEnvVars.REFRESH_TOKEN_EXP,
        encryptorSecretKey: validatedEnvVars.ENCRYPTOR_SECRET_KEY,
    },
    google: {
        clientID: validatedEnvVars.GOOGLE_CLIENT_ID,
        clientSecret: validatedEnvVars.GOOGLE_CLIENT_SECRET,
        callbackURL: `${validatedEnvVars.SERVER_API_URL}/auth/google/callback`,
    },
    db: {
        dbUser: validatedEnvVars.DATABASE_USER,
        dbPassword: validatedEnvVars.DATABASE_PASSWORD,
        dbHost: validatedEnvVars.DATABASE_HOST,
        dbName: validatedEnvVars.DATABASE_NAME,
        dbType: validatedEnvVars.DATABASE_TYPE,
    },
    cache: {
        port: parseInt(process.env.REDIS_PORT),
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
    },
    cloudinary: {
        cloudName: validatedEnvVars.CLOUDINARY_NAME,
        apiKey: validatedEnvVars.CLOUDINARY_API_KEY,
        apiSecret: validatedEnvVars.CLOUDINARY_API_SECRET,
        assetsFolder: 'GREENHURB_ASSETS',
    },
    sendGrid: {
        sendGridApikey: validatedEnvVars.SENDGRID_API_KEY,
        sendgrid_email: validatedEnvVars.SENDGRID_EMAIL,
    },
    twilio: {
        twilio_sid: validatedEnvVars.TWILIO_SID,
        twilio_auth_token: validatedEnvVars.TWILIO_AUTH_TOKEN,
        twilio_phone_number: validatedEnvVars.TWILIO_PHONE_NUMBER,
    },
    frontendOriginUrl: validatedEnvVars.FRONTEND_LIVE_ORIGIN,
    paystack: {
        secretKey: validatedEnvVars.PAYSTACK_SECRET_KEY,
    },
    passwords: {
        extensionAgent: validatedEnvVars.DEFAULT_EXTENSION_AGENT_PASSWORD,
    },
});
