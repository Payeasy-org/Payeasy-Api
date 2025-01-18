"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("@/app");
const core_1 = require("@/core");
const common_1 = require("@/core/common");
const passport_1 = require("@auth/services/passport");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const express_session_1 = __importDefault(require("express-session"));
exports.app = (0, express_1.default)();
// Use the built-in middleware to parse JSON bodies. This allows you to handle JSON payloads.
exports.app.use(express_1.default.json());
// Use cookie-parser middleware to parse cookies attached to the client request object.
exports.app.use((0, cookie_parser_1.default)());
// Use file-upload middleware to handle file uploads.
// Files are stored in temporary files instead of memory for efficient large file handling.
exports.app.use((0, express_fileupload_1.default)({
    useTempFiles: true,
}));
// Enable Cross-Origin Resource Sharing (CORS) with predefined options.
exports.app.use((0, cors_1.default)(core_1.corsOptions));
// Serve static files located in the 'public' directory.
// This directory will now be publicly accessible via HTTP.
exports.app.use(express_1.default.static('public'));
// Use middleware to parse URL-encoded bodies with the querystring library.
// 'extended: false' opts to use the classic encoding.
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use((0, express_session_1.default)({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}));
exports.app.use(passport_1.passport.initialize());
exports.app.use(passport_1.passport.authenticate('session'));
// Mount the API routes under '/api/v1'. All routes inside appRouter will be prefixed with '/api/v1'.
exports.app.use(common_1.API_SUFFIX, app_1.appRouter);
passport_1.passport.initialisePassportAuthentication(exports.app);
exports.app.set('trust proxy', true);
exports.app.use(core_1.notFoundHandler.handle);
exports.app.use(core_1.errorHandler.handle);
