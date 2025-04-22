import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare fullName: string;
    declare emailAddress: string;
    declare emailVerified: CreationOptional<boolean>;
    declare password: string | null;
    declare providerId: CreationOptional<string>;
    declare provider: string;
    declare sessionId: CreationOptional<string>;
}

User.init(
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
        emailVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sessionId: {
            type: DataTypes.STRING,
            defaultValue: null,
            allowNull: true,
        },
        providerId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        modelName: 'user',
        tableName: 'user',
        sequelize,
        timestamps: true,
        freezeTableName: true,
        paranoid: true,
    },
);
