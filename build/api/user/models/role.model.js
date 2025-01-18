"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Role = void 0;
const core_1 = require("@/core");
const sequelize_1 = require("sequelize");
class Role extends sequelize_1.Model {
}
exports.Role = Role;
Role.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: sequelize_1.UUIDV4,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
}, {
    modelName: 'role',
    tableName: 'role',
    sequelize: core_1.sequelize,
    timestamps: true,
    freezeTableName: true,
});
