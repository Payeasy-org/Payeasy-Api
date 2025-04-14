import { sequelize } from '@/core';
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model } from 'sequelize';
import { User } from './user.model';

export class UserCode extends Model<InferAttributes<UserCode>, InferCreationAttributes<UserCode>> {
    declare id: CreationOptional<string>;
    declare userId: ForeignKey<User['id']>;
    declare code: number;
    declare expiresAt: Date;
}

UserCode.init(
    {
        id: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
            defaultValue: DataTypes.UUIDV4,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,

            references: {
                model: User,
                key: 'id',
            },
        },
        code: {
            type: DataTypes.INTEGER({ length: 6 }),
            allowNull: false,
        },
        expiresAt: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        freezeTableName: true,
        tableName: 'userCode',
        modelName: 'userCode',
        timestamps: true,
    },
);
