"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Farm = void 0;
const core_1 = require("@/core");
const sequelize_1 = require("sequelize");
const user_model_1 = require("./user.model");
class Farm extends sequelize_1.Model {
}
exports.Farm = Farm;
Farm.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    city: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    farmerId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        references: {
            model: user_model_1.User,
            key: 'id',
        },
    },
}, {
    modelName: 'farm',
    tableName: 'farm',
    sequelize: core_1.sequelize,
    timestamps: true,
    freezeTableName: true,
});
