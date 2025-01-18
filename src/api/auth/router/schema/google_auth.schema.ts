import Joi from 'joi';

export const googleAuthSchema = {
    inputSchema: Joi.object().keys({
        code: Joi.string().required(),
        roleId: Joi.string().length(36).required().label('Role ID is required and must be exactly 36 characters'),
    }),
};
