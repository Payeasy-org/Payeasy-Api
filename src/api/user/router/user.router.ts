import { ControlBuilder } from '@/core';
import { Router } from 'express';
import { farmService } from '../services';
import {
    createBulkFarmSchema,
    createFarmSchema,
    extensionAgentApproveSchema,
    extensionAgentLoginSchema,
    extensionAgentRegisterSchema,
    farmQuerySchema,
    findFarmByIdSchema,
    updateFarmSchema,
} from './schema';

export const userRouter = Router();

/***********  FARMERS  ***********/
userRouter
    .route('/farmer/farm')
    .get(
        ControlBuilder.builder()
            .setHandler(farmService.findAllForFarmer)
            .handle(),
    )

    .post(
        ControlBuilder.builder()
            .isPrivate()
            .setValidator(createFarmSchema)
            .setHandler(farmService.create)
            .handle(),
    )

    .patch(
        ControlBuilder.builder()
            .isPrivate()
            .setValidator(updateFarmSchema)
            .setHandler(farmService.update)
            .handle(),
    )

    .delete(
        ControlBuilder.builder()
            .isPrivate()
            .setValidator(farmQuerySchema)
            .setHandler(farmService.delete)
            .handle(),
    );

userRouter.post(
    '/farmer/farm/:id',

    ControlBuilder.builder()
        .isPrivate()
        .setValidator(findFarmByIdSchema)
        .setHandler(farmService.findById)
        .handle(),
);

userRouter.post(
    '/farmer/farm/bulk',

    ControlBuilder.builder()
        .isPrivate()
        .only('FARMER')
        .setValidator(createBulkFarmSchema)
        .setHandler(farmService.bulkCreate)
        .handle(),
);
