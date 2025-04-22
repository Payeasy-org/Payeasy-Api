import { logger, sequelize } from '@/core';

export const initializeDbConnection = async () => {
    try {
        await sequelize.authenticate();

        await sequelize.sync({ force: false });

        logger.info('Connection has been established successfully.');
    } catch (error) { console.error('Unable to connect to the database:', error);}
};
