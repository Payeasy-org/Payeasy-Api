// import { Model, DataTypes } from 'sequelize';
// import { sequelize } from '@/core';

// export class Transaction extends Model {
//     declare id: number;
//     declare userId: string;
//     declare storeId: string;
//     declare reference: string;
//     declare amount: number;
//     declare status: 'pending' | 'success' | 'failed';
// }

// Transaction.init(
//     {
//         id: {
//             type: DataTypes.INTEGER,
//             autoIncrement: true,x
//             primaryKey: true,
//         },
//         userId: {
//             type: DataTypes.UUID,
//             allowNull: false,
//         },
//         reference: {
//             type: DataTypes.STRING,
//             allowNull: false,
//             unique: true,
//         },
//         storeId: { type: DataTypes.UUID, allowNull: false },
//         amount: {
//             type: DataTypes.INTEGER,
//             allowNull: false,
//             comment: 'Amount in Kobo',
//         },
//         status: {
//             type: DataTypes.ENUM('pending', 'success', 'failed'),
//             allowNull: false,
//             defaultValue: 'pending',
//         },
//     },
//     {
//         sequelize,
//         tableName: 'Transaction',
//         timestamps: true,
//     },
// );
