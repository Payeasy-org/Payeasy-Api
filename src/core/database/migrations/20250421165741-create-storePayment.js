
'use strict';
module.exports = {
  up: async (qi, Sequelize) => {
    await qi.createTable('storePayments', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      storeIdN: { type: Sequelize.INTEGER, allowNull: false },
      receiptReference: { type: Sequelize.UUID, allowNull: false },
     
      userId: { type: Sequelize.STRING, allowNull: false },
      amount: { type: Sequelize.INTEGER, allowNull: false },
      status: { type: Sequelize.ENUM('pending', 'success', 'failed'), allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      deletedAt: { allowNull: true, type: Sequelize.DATE },
    });
  },
  down: async (qi) => {
    await qi.dropTable('storePayments');
    await qi.sequelize.query(`DROP TYPE IF EXISTS enum_storePayments_status;`);
  }
};
