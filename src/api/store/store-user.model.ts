import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';

export class StoreUser extends Model<InferAttributes<StoreUser>, InferCreationAttributes<StoreUser>> {
    declare id: CreationOptional<string>;
    declare fullName: string;
    declare store_id: string;
    declare emailAddress: CreationOptional<string>;
    declare password: string;
    declare role: 'employee' | 'branch_head' | 'managerial_head';
}

StoreUser.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: UUIDV4,
        },

        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        store_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        role: {
            type: DataTypes.STRING,
            allowNull: false,
        },

     
    },
    {
        modelName: 'store_user',
        tableName: 'store_user',
        sequelize,
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
    },
);
