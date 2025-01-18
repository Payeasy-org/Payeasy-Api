"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTP = void 0;
const core_1 = require("@/core");
const sequelize_1 = require("sequelize");
class OTP extends sequelize_1.Model {
}
exports.OTP = OTP;
OTP.init({
    id: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: sequelize_1.DataTypes.UUIDV4,
    },
    userId: {
        type: sequelize_1.DataTypes.UUID,
        allowNull: false,
    },
    otp: {
        type: sequelize_1.DataTypes.INTEGER({ length: 6 }),
        allowNull: false,
    },
    otpExp: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
    },
    receivingMedium: {
        type: sequelize_1.DataTypes.ENUM('EMAIL', 'SMS'),
        allowNull: false,
    },
    userType: {
        type: sequelize_1.DataTypes.ENUM('USER', 'STORE_USER'),
        allowNull: false,
    },
}, {
    sequelize: core_1.sequelize,
    freezeTableName: true,
    tableName: 'otp',
    modelName: 'otp',
    timestamps: true,
});
