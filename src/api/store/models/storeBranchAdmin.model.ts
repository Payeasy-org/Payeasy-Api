import { sequelize } from '@/core';
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { Store } from './store.model';

export class StoreBranchAdmin extends Model<InferAttributes<StoreBranchAdmin>, InferCreationAttributes<StoreBranchAdmin>> {
    declare id: CreationOptional<number>;
    declare guid: CreationOptional<string>;
    declare fullName: string;
    declare storeId: ForeignKey<Store['id']>;
    declare emailAddress: string;
    declare password: string;
    declare isEnabled: CreationOptional<boolean>;
}

StoreBranchAdmin.init(
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
            allowNull: true,
        },

        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: Store,
                key: 'id',
            },
        },

        isEnabled: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        modelName: 'storeBranchAdmin',
        tableName: 'storeBranchAdmin',
        sequelize,
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
    },
);
