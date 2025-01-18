"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Register = void 0;
const models_1 = require("@/api/user/models");
const core_1 = require("@/core");
const common_1 = require("@/core/common");
const sequelize_1 = require("sequelize");
class Register {
    constructor(dbUser) {
        this.dbUser = dbUser;
        this.handleUser = async ({ input }) => {
            if (!input)
                throw new core_1.BadRequestError(`Invalid credentials`);
            const { emailAddress, password, phoneNumber } = input;
            const normalizedEmail = emailAddress.toLowerCase();
            const orConditions = [{ emailAddress: normalizedEmail }];
            if (phoneNumber) {
                orConditions.push({ phoneNumber });
            }
            const userExists = await this.dbUser.findOne({
                where: {
                    [sequelize_1.Op.or]: orConditions,
                },
            });
            if (userExists)
                throw new core_1.ConflictError(common_1.AppMessages.FAILURE.ACCOUNT_EXISTS);
            const hashedPassword = await (0, core_1.hashData)(password);
            const newUser = await this.dbUser.create({ ...input, emailAddress: normalizedEmail, password: hashedPassword, provider: 'local' });
            core_1.logger.info('User Account Created Successfully');
            return {
                data: {
                    ...newUser.toJSON(),
                    password: undefined,
                },
                code: core_1.HttpStatus.CREATED,
                message: 'User Created Successfully',
            };
        };
    }
}
exports.Register = Register;
const registerInstance = new Register(models_1.User);
exports.default = registerInstance;
