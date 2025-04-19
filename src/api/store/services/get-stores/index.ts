import { ControllerArgs, HttpStatus, logger } from '@/core';
import { GetStoresPayload } from '@store/interfaces';
import { Store } from '@store/models';

export class GetAllStores {
    constructor(private readonly dbStore: typeof Store) {}

    handle = async (payload: ControllerArgs<GetStoresPayload>) => {
        const { query } = payload;
        const page = query?.page || 1;
        const limit = query?.limit || 10;
        const offset = (page - 1) * limit;

        const { rows: stores, count: total } = await this.dbStore.findAndCountAll({
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });

        logger.info(`Retrieved ${stores.length} stores from database`);

        return {
            code: HttpStatus.OK,
            message: 'Stores retrieved successfully',
            data: {
                stores: stores.map((store) => store.toJSON()),
                pagination: {
                    total,
                    page,
                    limit,
                    pages: Math.ceil(total / limit),
                },
            },
        };
    };
}

const getAllStoresInstance = new GetAllStores(Store);

export default getAllStoresInstance;
