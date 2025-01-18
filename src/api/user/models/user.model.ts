import { sequelize } from '@/core';
import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { Role } from './role.model';

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    declare fullName: string;
    declare emailAddress: string;
    declare emailVerified: CreationOptional<boolean>;
    declare password: string | null;
    declare providerId: CreationOptional<string>;
    declare provider: string;
    declare phoneNumber: CreationOptional<string>;
    declare phoneNumberVerified: CreationOptional<boolean>;
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
        providerId: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        provider: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        },

        phoneNumberVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
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

// import { Auth, Role } from "@/api/auth";
// import { User } from "@/api/user/models";

User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
});

// // Auth.belongsTo(User, { foreignKey: 'userId' })

Role.hasMany(User, {
    foreignKey: 'roleId',
});
