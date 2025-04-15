import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';
import { StoreByIdPayload } from '@store/interfaces';
import { Store } from '@store/models';

export class DeleteStore {
    constructor(private readonly dbStore: typeof Store) {}

    handle = async (payload: ControllerArgs<StoreByIdPayload>) => {
        const { params } = payload;

        if (!params || !params.id) {
            throw new BadRequestError('Store ID is required');
        }

        const { id } = params;

        // Get the store by ID
        const store = await this.dbStore.findByPk(id);

        if (!store || store.isSoftDeleted()) {
            throw new BadRequestError(`Store with ID ${id} not found`);
        }

        // Soft delete the store
        await store.destroy();

        logger.info(`Store with ID ${id} deleted successfully`);

        return {
            code: HttpStatus.OK,
            message: 'Store deleted successfully',
            data: {
                id,
            },
        };
    };
}

const deleteStoreInstance = new DeleteStore(Store);

export default deleteStoreInstance;
