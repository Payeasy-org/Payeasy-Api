"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlBuilder = void 0;
const index_handler_1 = require("./index.handler");
/**
 * Builder class for setting up and configuring a controller handler.
 * This class allows fluent style configuration by chaining method calls.
 */
class ControlBuilder {
    constructor() {
        this.options = {
            isPrivate: false,
        };
    }
    /**
     * Initializes and returns a new instance of ControlBuilder.
     * @returns {ControlBuilder} A new instance of ControlBuilder.
     * @static
     */
    static builder() {
        return new ControlBuilder();
    }
    /**
     * Sets the handler function that will be used to process requests.
     * @param {AnyFunction} func - The function to handle the request.
     * @returns {ControlBuilder} The instance of this builder for chaining.
     */
    setHandler(func) {
        this.handler = func;
        return this;
    }
    /**
     * Sets the validation schema for validating request data.
     * @param {ValidationSchema} schema - The schema to validate the request data.
     * @returns {ControlBuilder} The instance of this builder for chaining.
     */
    setValidator(schema) {
        this.schema = schema;
        return this;
    }
    /**
     * Marks the route as requiring authentication.
     * @returns {ControlBuilder} The instance of this builder for chaining.
     */
    isPrivate() {
        this.options = { ...this.options, isPrivate: true };
        return this;
    }
    /**
     * Specifies roles allowed to access the route. Automatically marks the route as private.
     * @param {...IAuthRole[]} allowed - An array of allowed roles.
     * @returns {ControlBuilder} The instance of this builder for chaining.
     */
    only(...allowed) {
        this.options = { isPrivate: true, allowedRoles: allowed };
        return this;
    }
    /**
     * Builds and returns the controller handler with the configured settings.
     * @returns {ExpressCallbackFunction} The middleware function that handles the request.
     */
    handle() {
        return new index_handler_1.ControllerHandler().handle(this.handler, this.schema, this.options);
    }
}
exports.ControlBuilder = ControlBuilder;
