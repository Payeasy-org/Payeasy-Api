import { BadRequestError, ConflictError, ControllerArgs, HttpStatus, logger, sequelize, UnAuthorizedError } from '@/core';
import { CreateFarmPayload, CreateMultipleFarmPayload, DeleteFarmPayload, FindFarmByIdPayload, UpdateFarmPayload } from '../../interfaces';
import { Farm } from '../../models';

export class FarmService {
    constructor(private readonly dbFarm: typeof Farm) {}

    async create({ input, user }: ControllerArgs<CreateFarmPayload>) {
        if (!input) throw new BadRequestError('No Input!');

        if (!user) throw new UnAuthorizedError('Unauthorized');

        const { name, city, state } = input;

        const existingFarm = await this.dbFarm.findOne({
            where: { name },
        });

        if (existingFarm) throw new ConflictError('Farm Exists!');

        const createdFarm = await this.dbFarm.create({
            city,
            name,
            state,
            farmerId: user.id,
        });

        return {
            code: HttpStatus.CREATED,
            data: createdFarm,
            message: 'Farm created successfully',
        };
    }

    async bulkCreate({ input, user }: ControllerArgs<CreateMultipleFarmPayload>) {
        if (!input) throw new BadRequestError('No Input!');

        if (!user) throw new UnAuthorizedError('Unauthorized');

        const transaction = await sequelize.transaction();

        try {
            const createdFarms = await Promise.all(
                input.farm.map(async (farm) => {
                    const { name, city, state } = farm;

                    const existingFarm = await this.dbFarm.findOne({
                        where: { name },
                    });

                    if (existingFarm) throw new ConflictError('Farm Exists!');

                    const createdFarm = await this.dbFarm.create({
                        city,
                        name,
                        state,
                        farmerId: user.id,
                    });

                    return createdFarm;
                }),
            );

            return {
                code: HttpStatus.CREATED,
                data: createdFarms,
                message: 'Farm created successfully',
            };
        } catch (error: any) {
            transaction.rollback();

            logger.error(error?.message || 'Error while Bulk Creating Farms: Transaction failed, rolled back all operations');

            throw new Error('Error while Creating Farms');
        }
    }

    async findAllForFarmer({ user }: ControllerArgs) {
        if (!user) throw new UnAuthorizedError('Unauthorized!');

        const farms = await this.dbFarm.findAll({
            where: { farmerId: user.id },
        });

        return {
            code: HttpStatus.OK,
            data: farms,
            message: 'Farms Fetched successfully',
        };
    }

    async findById({ params }: ControllerArgs<FindFarmByIdPayload>) {
        if (!params) throw new BadRequestError('No Input!');

        const { id } = params;

        const farm = await this.dbFarm.findAll({
            where: { id },
        });

        if (!farm) throw new BadRequestError('Invalid Farm Id');

        return {
            code: HttpStatus.OK,
            data: farm,
            message: 'Farm Fetched successfully',
        };
    }

    async update({ input, query, user }: ControllerArgs<UpdateFarmPayload>) {
        if (!input) throw new BadRequestError('No Input!');

        if (!user) throw new UnAuthorizedError('Unauthorized');

        const { id } = query;

        const existingFarm = await this.dbFarm.findOne({
            where: { id },
        });

        if (!existingFarm) throw new BadRequestError('Invalid Farm');

        await existingFarm.update({ ...input });

        await existingFarm.save();

        return {
            code: HttpStatus.OK,
            data: existingFarm,
            message: 'Farm Updated successfully',
        };
    }

    async delete({ query, user }: ControllerArgs<DeleteFarmPayload>) {
        if (!query) throw new BadRequestError('No Input!');

        if (!user) throw new UnAuthorizedError('Unauthorized');

        const { id } = query;

        const existingFarm = await this.dbFarm.findOne({
            where: { id },
        });

        if (!existingFarm) throw new BadRequestError('Invalid Farm!');

        await this.dbFarm.destroy({
            where: { id },
        });

        return {
            code: HttpStatus.NO_CONTENT,
            message: 'Farm Deleted successfully',
        };
    }
}
