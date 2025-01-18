"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const core_1 = require("@/core");
const express_1 = require("express");
const services_1 = require("../services");
const schema_1 = require("./schema");
exports.userRouter = (0, express_1.Router)();
/***********  FARMERS  ***********/
exports.userRouter
    .route('/farmer/farm')
    .get(core_1.ControlBuilder.builder()
    .setHandler(services_1.farmService.findAllForFarmer)
    .handle())
    .post(core_1.ControlBuilder.builder()
    .isPrivate()
    .setValidator(schema_1.createFarmSchema)
    .setHandler(services_1.farmService.create)
    .handle())
    .patch(core_1.ControlBuilder.builder()
    .isPrivate()
    .setValidator(schema_1.updateFarmSchema)
    .setHandler(services_1.farmService.update)
    .handle())
    .delete(core_1.ControlBuilder.builder()
    .isPrivate()
    .setValidator(schema_1.farmQuerySchema)
    .setHandler(services_1.farmService.delete)
    .handle());
exports.userRouter.post('/farmer/farm/:id', core_1.ControlBuilder.builder()
    .isPrivate()
    .setValidator(schema_1.findFarmByIdSchema)
    .setHandler(services_1.farmService.findById)
    .handle());
exports.userRouter.post('/farmer/farm/bulk', core_1.ControlBuilder.builder()
    .isPrivate()
    .only('FARMER')
    .setValidator(schema_1.createBulkFarmSchema)
    .setHandler(services_1.farmService.bulkCreate)
    .handle());
