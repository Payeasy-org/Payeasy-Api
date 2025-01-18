"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControllerHandler = void 0;
const core_1 = require("@/core");
const index_utils_1 = require("./index.utils");
/**
 * Handles HTTP requests by providing methods for authentication, authorization, validation, and controller execution.
 */
class ControllerHandler {
    constructor() {
        /**
         * Creates a middleware function to handle the request and execute the controller function.
         *
         * it parses the controller arguments from the request.
         * then it valiates the request data against the provided schema.
         * afterwards, it executes the controller function and handle its response.
         *
         * @param {AnyFunction} controllerFn The controller function to execute.
         * @param {ValidationSchema} [schema={}] The schema to validate the request data against.
         * @param {ControllerHandlerOptions} options Configuration options for handling the request.
         * @returns {ExpressCallbackFunction} The Express middleware function.
         */
        this.handle = (controllerFn, schema = {}, options) => {
            return async (req, res, next) => {
                try {
                    const controllerArgs = (0, index_utils_1.parseIncomingRequest)(req);
                    if (schema)
                        (0, index_utils_1.validateIncomingRequest)(schema, controllerArgs);
                    const controllerResult = await controllerFn(controllerArgs);
                    if (!controllerResult) {
                        res.status(core_1.HttpStatus.OK).send({ status: true });
                        return;
                    }
                    const { code, headers, ...data } = controllerResult;
                    res.set({ ...headers })
                        .status(code ?? core_1.HttpStatus.OK)
                        .send(data);
                }
                catch (error) {
                    core_1.logger.error(`Controller-Handler Error: ${error}`);
                    next(error);
                }
            };
        };
    }
}
exports.ControllerHandler = ControllerHandler;
