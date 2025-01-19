import { sequelize } from '@/core';
import { CreationOptional, DataTypes, ForeignKey, InferAttributes, InferCreationAttributes, Model, UUIDV4 } from 'sequelize';
import { User } from './user.model';

export class Farm extends Model<InferAttributes<Farm>, InferCreationAttributes<Farm>> {
    declare id: CreationOptional<string>;
    declare name: string;
    declare city: string;
    declare state: string;
    declare farmerId: ForeignKey<User['id']>;
}

Farm.init(
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
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        farmerId: {
            type: DataTypes.UUID,
            allowNull: false,

            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        modelName: 'farm',
        tableName: 'farm',
        sequelize,
        timestamps: true,
        freezeTableName: true,
    },
);
