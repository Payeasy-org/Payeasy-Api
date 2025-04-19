import { sequelize } from '@/core';
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { Store } from './store.model';
import { Location } from './location.model';

export class StoreBranch extends Model<InferAttributes<StoreBranch>, InferCreationAttributes<StoreBranch>> {
    declare id: CreationOptional<number>;
    declare guid: CreationOptional<string>;
    declare name: string;
    declare storeId: ForeignKey<Store['id']>;
    declare locationId: ForeignKey<Location['id']>;
    declare contactEmail: CreationOptional<string>;
    declare contactPhoneNumber: CreationOptional<string>;
    declare isHeadquarter: CreationOptional<boolean>;
}

StoreBranch.init(
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
        },

        storeId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: Store,
                key: 'id',
            },
        },
        locationId: {
            type: DataTypes.INTEGER,
            allowNull: false,

            references: {
                model: Location,
                key: 'id',
            },
        },
        contactEmail: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        contactPhoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        isHeadquarter: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
    },
    {
        modelName: 'storeBranch',
        tableName: 'storeBranch',
        sequelize,
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
    },
);
