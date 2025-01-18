"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreUser = void 0;
const core_1 = require("@/core");
const sequelize_1 = require("sequelize");
class StoreUser extends sequelize_1.Model {
}
exports.StoreUser = StoreUser;
StoreUser.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
    },
    fullName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    emailAddress: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    store_id: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    modelName: 'store_user',
    tableName: 'store_user',
    sequelize: core_1.sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
});
