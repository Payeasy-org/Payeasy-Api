import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';

export class Store extends Model<InferAttributes<Store>, InferCreationAttributes<Store>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare description: CreationOptional<string>;
    declare authKey: CreationOptional<string>;
    declare dashboardUrl: CreationOptional<string>;
}

Store.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
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
        authKey: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        dashboardUrl: {
            type: DataTypes.STRING,
            allowNull: true,
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
