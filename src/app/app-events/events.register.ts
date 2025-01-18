import { config, logger } from '@/core';
import { sendEmail } from '@/core/services/mails';
import { sendSMS } from '@/core/services/sms';

/**
 * Event Listener Registry.
 */
export const register = {
    'app:up': () => {
        logger.info(`Server started successfully on port ${config.port}`);

        if (config.appEnvironment !== 'development') {
            console.log(`Server started successfully on port ${config.port}`);
        }
    },
    'cache:connection:established': () => logger.info(`Cache connection established`),
    'event:registeration:succesful': () => logger.info('Events listeners registered'),
    'event:sendMail': sendEmail,
    'event:sendSms': sendSMS,
};
