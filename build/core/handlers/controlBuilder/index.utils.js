"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateIncomingRequest = exports.parseIncomingRequest = void 0;
const core_1 = require("@/core");
const parseIncomingRequest = (req) => {
    return {
        input: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
        user: req.user,
        files: parseFileContents(req.files),
        request: req,
    };
};
exports.parseIncomingRequest = parseIncomingRequest;
const parseFileContents = (files) => {
    if (!files)
        return null;
    const fileObjects = {};
    for (const key in files) {
        const file = files[key];
        fileObjects[key] = file;
    }
    return fileObjects;
};
/**
 * Validate the request data against the provided schema.
 * @param {ValidationSchema} schema The schema definitions for query, params, and input.
 * @param {ParsedRequestContext} controllerArgs The parsed controller arguments.
 * @private
 */
const validateIncomingRequest = (schema, controllerArgs) => {
    const { querySchema, paramsSchema, inputSchema } = schema;
    const { input, params, query } = controllerArgs;
    try {
        if (inputSchema)
            (0, core_1.joiValidate)(inputSchema, input);
        if (querySchema)
            (0, core_1.joiValidate)(querySchema, query);
        if (paramsSchema)
            (0, core_1.joiValidate)(paramsSchema, params);
    }
    catch (error) {
        throw new core_1.UnProcessableError(error.message.replaceAll('"', ''));
    }
};
exports.validateIncomingRequest = validateIncomingRequest;
