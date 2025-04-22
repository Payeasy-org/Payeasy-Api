'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('user');
    if (!tableDefinition.sessionId) {
      await queryInterface.addColumn('user', 'sessionId', {
        type: Sequelize.STRING(255),
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('user');
    if (tableDefinition.sessionId) {
      await queryInterface.removeColumn('user', 'sessionId');
    }
  },
};
