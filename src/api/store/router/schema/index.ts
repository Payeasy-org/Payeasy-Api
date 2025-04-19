import { inventoryProviders } from '@/api/inventory-integration/interfaces';
import Joi from 'joi';

const paginationSchema = Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).default(10),
}).unknown(false);

const createStoreSchema = {
    inputSchema: Joi.object().keys({
        name: Joi.string().required(),
        description: Joi.string().required(),
        inventoryProvider: Joi.string()
            .valid(...inventoryProviders)
            .required(),
        config: Joi.object().pattern(Joi.string(), Joi.any()).required(),
    }),
};

const storeByIdSchema = {
    paramsSchema: Joi.object().keys({
        id: Joi.string().required().length(36),
    }),
};
const getStoresSchema = {
    querySchema: paginationSchema,
};

const updateStoreSchema = {
    paramsSchema: Joi.object().keys({
        id: Joi.string().required().length(36),
    }),
    inputSchema: Joi.object()
        .keys({
            name: Joi.string(),
            description: Joi.string(),
        })
        .required(),
};

export { createStoreSchema, getStoresSchema, storeByIdSchema, updateStoreSchema };
