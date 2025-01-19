import { EventEmitter2 as Event } from 'eventemitter2';

import { type EventListenerMap, type Listener } from '../../core';
import { type AppEventListnerMap, type eventKeys } from './event.types';
import { register } from './events.register';

/**
 * Class representing the application event manager.
 * Extends EventEmitter2 to handle custom application events.
 */
class AppEventManager extends Event {
    /**
     * Creates an instance of AppEventManager.
     * @param {EventListenerMap} eventListenerMap - The map of event keys to their listeners.
     */
    constructor(eventListenerMap: EventListenerMap) {
        super(); // Initializes the EventEmitter2 base class
        // Register all listeners and then dispatch a success event
        this.register(eventListenerMap).then(() => this.dispatch('event:registeration:succesful'));
    }

    /**
     * Registers event listeners from a given map.
     * @param {EventListenerMap} eventListenerMap - The map containing events and their corresponding listeners.
     * @returns {Promise<void>} A promise that resolves when all listeners have been registered.
     */
    private register = async (eventListenerMap: EventListenerMap): Promise<void> => {
        // Process each event key and corresponding listeners from the map
        Object.keys(eventListenerMap).forEach((key: string) => {
            const listeners: Listener[] | Listener = eventListenerMap[key];
            // Check if multiple listeners are registered as an array
            if (Array.isArray(listeners)) {
                listeners.forEach((listener: Listener) => {
                    this.on(key, listener);
                });
            } else {
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
    public dispatch = async <T extends eventKeys = eventKeys>(event: T, ...values: AppEventListnerMap[T]): Promise<void> => {
        this.emit(event, ...values);
    };
}

// Create an instance of AppEventManager, passing the event registration map
const { dispatch } = new AppEventManager(register);

export { dispatch };
