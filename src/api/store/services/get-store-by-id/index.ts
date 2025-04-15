import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';
import { StoreByIdPayload } from '@store/interfaces';
import { Store } from '@store/models';

export class GetStoreById {
    constructor(private readonly dbStore: typeof Store) {}

    handle = async (payload: ControllerArgs<StoreByIdPayload>) => {
        const { params } = payload;

        if (!params || !params.id) {
            throw new BadRequestError('Store ID is required');
        }

        const { id } = params;

        const store = await this.dbStore.findByPk(id);

        if (!store || store.isSoftDeleted()) {
            throw new BadRequestError(`Store with ID ${id} not found`);
        }

        logger.info(`Retrieved store with ID: ${store.id}`);

        return {
            code: HttpStatus.OK,
            message: 'Store retrieved successfully',
            data: {
                store: store.toJSON(),
            },
        };
    };
}

const getStoreByIdInstance = new GetStoreById(Store);

export default getStoreByIdInstance;
