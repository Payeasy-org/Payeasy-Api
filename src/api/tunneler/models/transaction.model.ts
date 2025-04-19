import { sequelize } from '@/core';
import { Model, DataTypes, UUIDV4 } from 'sequelize';

export class Transaction extends Model {
  declare id: string;
  declare productId: string;
  declare amount: number;
  declare email: string;
  declare transactionRef: string;
  declare status: string; // e.g., pending, successful, failed
}

Transaction.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: UUIDV4,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionRef: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pending',
    },
  },
  {
    sequelize,
    modelName: 'Transaction',
    tableName: 'transactions',
    timestamps: true,
    freezeTableName: true,
    paranoid: true,
  }
);
