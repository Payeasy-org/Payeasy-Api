module.exports = {
  async up(queryInterface, Sequelize) {
    // Step 1: Add a new temporary column with INTEGER type allowing NULL
    await queryInterface.addColumn('receipts', 'storeId_temp', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });


    // Step 2: Copy and cast data from old storeId to storeId_temp
    await queryInterface.sequelize.query(`
  UPDATE "receipts"
  SET "storeId_temp" = CAST("storeId" AS INTEGER)
  WHERE "storeId" IS NOT NULL;
    `);

    // Step 3: Drop the old storeId column
    await queryInterface.removeColumn('receipts', 'storeId');

    // Step 4: Rename storeId_temp to storeId
    await queryInterface.renameColumn('receipts', 'storeId_temp', 'storeId');

    // Step 5: Alter the new storeId column to set NOT NULL
    await queryInterface.changeColumn('receipts', 'storeId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Reverse the changes


    // Step 1: Add a new temporary column with previous type UUID allowing NULL
    await queryInterface.addColumn('receipts', 'storeId_temp', {
      type: Sequelize.UUID,
      allowNull: true,
    });

    // Step 2: Copy data back from storeId to storeId_temp (casting as text)
    await queryInterface.sequelize.query(`
    UPDATE "receipts"
    SET "storeId_temp" = CAST("storeId" AS UUID)
    WHERE "storeId" IS NOT NULL;
`   );

    // Step 3: Drop the current storeId column
    await queryInterface.removeColumn('receipts', 'storeId');

    // Step 4: Rename storeId_temp back to storeId
    await queryInterface.renameColumn('receipts', 'storeId_temp', 'storeId');

    // Step 5: Alter the storeId column to allow NULL
    await queryInterface.changeColumn('receipts', 'storeId', {
      type: Sequelize.UUID,
      allowNull: true,
    });
  }
}