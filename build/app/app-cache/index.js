"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = exports.AppCacheManager = void 0;
const ioredis_1 = require("ioredis");
const core_1 = require("@/core");
class AppCacheManager extends ioredis_1.Redis {
    constructor(options) {
        super(options);
        this.read = async (key) => {
            const value = await this.get(key);
            if (!value)
                return null;
            return (await JSON.parse(value));
        };
        this.has = async (key) => {
            return (await this.get(key)) ? true : false;
        };
        this.remove = async (key) => {
            try {
                const keyExists = await this.has(key);
                if (!keyExists)
                    throw new Error(`You tried removing the cache with a key[${key}] that does not exists.`);
                await this.del(key);
                return true;
            }
            catch (err) {
                core_1.logger.debug('Operation failed, key not found in cache');
                // throw the error back to the consumer of the method to handle it.
                throw err;
            }
        };
        core_1.logger.info('cache:connection:established');
        super.on('close', () => {
            this.quit();
            core_1.logger.debug('Cache connection closed');
        });
    }
}
exports.AppCacheManager = AppCacheManager;
exports.cache = new AppCacheManager({
    host: core_1.config.cache.host,
    port: core_1.config.cache.port,
    password: core_1.config.cache.password,
});
