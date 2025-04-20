import { ControlBuilder } from '@/core';
import { Router } from 'express';
import {
    createStore,
    deleteStore,
    getStoreById,
    getStores,
    updateStore,
} from '../services';
import { createStoreSchema,getStoresSchema,storeByIdSchema,updateStoreSchema, } from './schema';

export const storeRouter = Router();

storeRouter
    .post(
        '/',
        ControlBuilder.builder()
            .setValidator(createStoreSchema)
            .setHandler(createStore.handle)
            .handle(),
    )
    .delete(
        '/:id',
        ControlBuilder.builder()
            .setValidator(storeByIdSchema)
            .setHandler(deleteStore.handle)
            .handle(),
    )
    .get(
        '/:id',
        ControlBuilder.builder()
            .setValidator(storeByIdSchema)
            .setHandler(getStoreById.handle)
            .handle(),
    )
    .get(
        '/',
        ControlBuilder.builder()
            .setValidator(getStoresSchema)
            .setHandler(getStores.handle)
            .handle(),
    )
    .put(
        '/:id',
        ControlBuilder.builder()
            .setValidator(updateStoreSchema)
            .setHandler(updateStore.handle)
            .handle(),
    );
