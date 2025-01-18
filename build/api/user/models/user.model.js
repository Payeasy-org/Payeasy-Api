"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const core_1 = require("@/core");
const sequelize_1 = require("sequelize");
const role_model_1 = require("./role.model");
class User extends sequelize_1.Model {
}
exports.User = User;
User.init({
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
    emailVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    providerId: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    provider: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    phoneNumberVerified: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    },
}, {
    modelName: 'user',
    tableName: 'user',
    sequelize: core_1.sequelize,
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
});
// import { Auth, Role } from "@/api/auth";
// import { User } from "@/api/user/models";
User.belongsTo(role_model_1.Role, {
    foreignKey: 'roleId',
    as: 'role',
});
// // Auth.belongsTo(User, { foreignKey: 'userId' })
role_model_1.Role.hasMany(User, {
    foreignKey: 'roleId',
});
