

import { sequelize } from '@/core';
import { UUID } from 'crypto';
import { Model, DataTypes, CreationOptional, InferAttributes, InferCreationAttributes, UUIDV4 } from 'sequelize';

export class Receipt extends Model<InferAttributes<Receipt>, InferCreationAttributes<Receipt>> {
    declare id: CreationOptional<string>;
    declare userId: string;
    declare sessionId: string;
    declare storeId: number;
    declare cart: CreationOptional<object>; // JSONB object
    declare totalItems: number;
    declare totalAmount: number;
    declare paymentStatus: 'pending' | 'success' | 'failed';
    declare paystackReference: CreationOptional<string | null>;
    declare receiptReference: CreationOptional<string | null>;
}

Receipt.init(
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        sessionId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        cart: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        storeId: { type: DataTypes.INTEGER, allowNull: false },
        totalItems: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        totalAmount: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        paymentStatus: {
            type: DataTypes.ENUM('pending', 'success', 'failed'),
            allowNull: false,
            defaultValue: 'pending',
        },
        paystackReference: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        receiptReference: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        modelName: 'receipt',
        tableName: 'receipts',
        sequelize,
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
    },
);
