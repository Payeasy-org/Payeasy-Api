import { logger, sequelize } from '@/core';

export const initializeDbConnection = async () => {
    await sequelize.authenticate();

    await sequelize.sync({force:true});

    logger.info('Connection has been established successfully.');
};
