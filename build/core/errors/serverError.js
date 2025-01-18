"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerError = void 0;
const utils_1 = require("../utils");
const apiError_1 = require("./apiError");
class ServerError extends apiError_1.ApiError {
    constructor(message) {
        super(message);
        this._statusCode = utils_1.HttpStatus.INTERNAL_SERVER_ERROR;
        this._details = null;
        this._message = message;
        Object.setPrototypeOf(this, ServerError.prototype);
    }
    get statusCode() {
        return this._statusCode;
    }
    get message() {
        return this._message;
    }
    get details() {
        return this._details;
    }
}
exports.ServerError = ServerError;
