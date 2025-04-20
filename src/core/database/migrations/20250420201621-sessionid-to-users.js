'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXX-add-sessionid-to-users.js
module.exports = {
  up: async (qi, Sequelize) => {
    await qi.addColumn('users', 'sessionId', { type: Sequelize.STRING, allowNull: true });
  },
  down: async (qi) => {
    await qi.removeColumn('users', 'sessionId');
  }
};

