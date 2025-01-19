import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from 'sequelize';

export class OTP extends Model<InferAttributes<OTP>, InferCreationAttributes<OTP>> {
    declare id: CreationOptional<string>;
    declare userId: string;
    declare otp: number;
    declare otpExp: Date;
    declare receivingMedium: 'EMAIL' | 'SMS';
    declare userType: 'USER' | 'STORE_USER';
}

OTP.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        otp: {
            type: DataTypes.INTEGER({ length: 6 }),
            allowNull: false,
        },
        otpExp: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        receivingMedium: {
            type: DataTypes.ENUM('EMAIL', 'SMS'),
            allowNull: false,
        },

        userType: {
            type: DataTypes.ENUM('USER', 'STORE_USER'),
            allowNull: false,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        tableName: 'otp',
        modelName: 'otp',
        timestamps: true,
    },
);
