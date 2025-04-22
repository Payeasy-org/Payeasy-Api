// src/api/tunneler/models/storePayment.model.ts
import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, UUIDV4 } from 'sequelize';
import { sequelize } from '@/core/';

export class StorePayment extends Model<InferAttributes<StorePayment>, InferCreationAttributes<StorePayment>> {
    declare id: CreationOptional<string>;
    declare storeId: number;
    declare amount: number;
    declare status: 'pending' | 'success' | 'failed';
    declare userId: string; // who paid
    declare receiptReference: CreationOptional<string | null>;
}

StorePayment.init(
    {
        id: { type: DataTypes.UUID, defaultValue: UUIDV4, primaryKey: true },
        storeId: { type: DataTypes.INTEGER, allowNull: false },
        userId: { type: DataTypes.STRING, allowNull: false },
        amount: { type: DataTypes.INTEGER, allowNull: false },
        receiptReference: { type: DataTypes.STRING, allowNull: true },
        status: { type: DataTypes.ENUM('pending', 'success', 'failed'), allowNull: false },
    },
    {
        tableName: 'storePayments',
        sequelize,
        timestamps: true,
        paranoid: true,
    },
);
