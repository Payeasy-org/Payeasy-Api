import { inventoryProviders, Providers } from '@/api/inventory-integration/interfaces';
import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';

export class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
    declare id: CreationOptional<number>;
    declare guid: CreationOptional<string>;
    declare name: string;
    declare description: CreationOptional<string>;
    declare dashboardUrl: CreationOptional<string>;
    declare inventoryUsed: Providers;
    declare inventoryConfig: CreationOptional<Record<string, any>>;
}

Store.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },

        guid: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true,
            defaultValue: UUIDV4,
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dashboardUrl: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        inventoryUsed: {
            type: DataTypes.ENUM(...inventoryProviders),
            allowNull: false,
        },
        inventoryConfig: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: {},
        },
    },
    {
        modelName: 'store',
        tableName: 'store',
        sequelize,
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
    },
);
