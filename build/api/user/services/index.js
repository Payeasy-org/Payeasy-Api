"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.farmService = void 0;
const models_1 = require("../models");
const farm_1 = require("./farm");
exports.farmService = new farm_1.FarmService(models_1.Farm);
