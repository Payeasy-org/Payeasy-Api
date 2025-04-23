import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';

export class Location extends Model<InferAttributes<Location>, InferCreationAttributes<Location>> {
    declare id: CreationOptional<number>;
    declare guid: CreationOptional<string>;
    declare name: string;
    declare latitude: number;
    declare longitude: number;
}

Location.init(
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

        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
        },
    },
    {
        modelName: 'location',
        tableName: 'location',
        sequelize,
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
    },
);
