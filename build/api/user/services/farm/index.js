"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FarmService = void 0;
const core_1 = require("@/core");
class FarmService {
    constructor(dbFarm) {
        this.dbFarm = dbFarm;
    }
    async create({ input, user }) {
        if (!input)
            throw new core_1.BadRequestError('No Input!');
        if (!user)
            throw new core_1.UnAuthorizedError('Unauthorized');
        const { name, city, state } = input;
        const existingFarm = await this.dbFarm.findOne({
            where: { name },
        });
        if (existingFarm)
            throw new core_1.ConflictError('Farm Exists!');
        const createdFarm = await this.dbFarm.create({
            city,
            name,
            state,
            farmerId: user.id,
        });
        return {
            code: core_1.HttpStatus.CREATED,
            data: createdFarm,
            message: 'Farm created successfully',
        };
    }
    async bulkCreate({ input, user }) {
        if (!input)
            throw new core_1.BadRequestError('No Input!');
        if (!user)
            throw new core_1.UnAuthorizedError('Unauthorized');
        const transaction = await core_1.sequelize.transaction();
        try {
            const createdFarms = await Promise.all(input.farm.map(async (farm) => {
                const { name, city, state } = farm;
                const existingFarm = await this.dbFarm.findOne({
                    where: { name },
                });
                if (existingFarm)
                    throw new core_1.ConflictError('Farm Exists!');
                const createdFarm = await this.dbFarm.create({
                    city,
                    name,
                    state,
                    farmerId: user.id,
                });
                return createdFarm;
            }));
            return {
                code: core_1.HttpStatus.CREATED,
                data: createdFarms,
                message: 'Farm created successfully',
            };
        }
        catch (error) {
            transaction.rollback();
            core_1.logger.error(error?.message || 'Error while Bulk Creating Farms: Transaction failed, rolled back all operations');
            throw new Error('Error while Creating Farms');
        }
    }
    async findAllForFarmer({ user }) {
        if (!user)
            throw new core_1.UnAuthorizedError('Unauthorized!');
        const farms = await this.dbFarm.findAll({
            where: { farmerId: user.id },
        });
        return {
            code: core_1.HttpStatus.OK,
            data: farms,
            message: 'Farms Fetched successfully',
        };
    }
    async findById({ params }) {
        if (!params)
            throw new core_1.BadRequestError('No Input!');
        const { id } = params;
        const farm = await this.dbFarm.findAll({
            where: { id },
        });
        if (!farm)
            throw new core_1.BadRequestError('Invalid Farm Id');
        return {
            code: core_1.HttpStatus.OK,
            data: farm,
            message: 'Farm Fetched successfully',
        };
    }
    async update({ input, query, user }) {
        if (!input)
            throw new core_1.BadRequestError('No Input!');
        if (!user)
            throw new core_1.UnAuthorizedError('Unauthorized');
        const { id } = query;
        const existingFarm = await this.dbFarm.findOne({
            where: { id },
        });
        if (!existingFarm)
            throw new core_1.BadRequestError('Invalid Farm');
        await existingFarm.update({ ...input });
        await existingFarm.save();
        return {
            code: core_1.HttpStatus.OK,
            data: existingFarm,
            message: 'Farm Updated successfully',
        };
    }
    async delete({ query, user }) {
        if (!query)
            throw new core_1.BadRequestError('No Input!');
        if (!user)
            throw new core_1.UnAuthorizedError('Unauthorized');
        const { id } = query;
        const existingFarm = await this.dbFarm.findOne({
            where: { id },
        });
        if (!existingFarm)
            throw new core_1.BadRequestError('Invalid Farm!');
        await this.dbFarm.destroy({
            where: { id },
        });
        return {
            code: core_1.HttpStatus.NO_CONTENT,
            message: 'Farm Deleted successfully',
        };
    }
}
exports.FarmService = FarmService;
