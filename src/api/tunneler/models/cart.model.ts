import { sequelize } from '@/core';
import { Model, DataTypes, UUIDV4 } from 'sequelize';

export class CartItem extends Model {
  declare id: string;
  declare userId: string;
  declare productId: string;
  declare quantity: number;
  declare name?: string;
  declare price?: number;
}

CartItem.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'CartItem',
    tableName: 'cartItems',
    timestamps: true,
    freezeTableName: true,
  }
);
