'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (qi, Sequelize) => {
    await qi.createTable('receipts', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      userId: { type: Sequelize.UUID, allowNull: false },
      sessionId: { type: Sequelize.STRING, allowNull: false },
      cart: { type: Sequelize.JSONB, allowNull: false },
      totalAmount: { type: Sequelize.FLOAT, allowNull: false },
      paymentStatus: {
        type: Sequelize.ENUM('paid', 'failed'), allowNull: false
      },
      createdAt: {
        allowNull: false, type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false, type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    });
  },
  down: async (qi) => {
    await qi.dropTable('receipts');
    await qi.sequelize.query('DROP TYPE IF EXISTS "enum_receipts_paymentStatus";');
  }
};
