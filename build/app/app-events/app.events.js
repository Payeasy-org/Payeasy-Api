"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dispatch = void 0;
const eventemitter2_1 = require("eventemitter2");
const events_register_1 = require("./events.register");
/**
 * Class representing the application event manager.
 * Extends EventEmitter2 to handle custom application events.
 */
class AppEventManager extends eventemitter2_1.EventEmitter2 {
    /**
     * Creates an instance of AppEventManager.
     * @param {EventListenerMap} eventListenerMap - The map of event keys to their listeners.
     */
    constructor(eventListenerMap) {
        super(); // Initializes the EventEmitter2 base class
        /**
         * Registers event listeners from a given map.
         * @param {EventListenerMap} eventListenerMap - The map containing events and their corresponding listeners.
         * @returns {Promise<void>} A promise that resolves when all listeners have been registered.
         */
        this.register = async (eventListenerMap) => {
            // Process each event key and corresponding listeners from the map
            Object.keys(eventListenerMap).forEach((key) => {
                const listeners = eventListenerMap[key];
                // Check if multiple listeners are registered as an array
                if (Array.isArray(listeners)) {
                    listeners.forEach((listener) => {
                        this.on(key, listener);
                    });
                }
                else {
                    // Register a single listener
                    this.on(key, listeners);
                }
            });
        };
        /**
         * Dispatches an event with optional parameters.
         * @template T - The event key that extends the predefined event keys.
         * @param {T} event - The event key to dispatch.
         * @param {...AppEventListnerMap[T]} values - The parameters to pass with the event.
         * @returns {Promise<void>} A promise that resolves when the event has been dispatched.
         */
        this.dispatch = async (event, ...values) => {
            this.emit(event, ...values);
        };
        // Register all listeners and then dispatch a success event
        this.register(eventListenerMap).then(() => this.dispatch('event:registeration:succesful'));
    }
}
// Create an instance of AppEventManager, passing the event registration map
const { dispatch } = new AppEventManager(events_register_1.register);
exports.dispatch = dispatch;
