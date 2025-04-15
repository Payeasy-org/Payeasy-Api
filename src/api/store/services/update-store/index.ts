import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';
import { UpdateStorePayload } from '@store/interfaces';
import { Store } from '@store/models';

export class UpdateStore {
    constructor(private readonly dbStore: typeof Store) {}

    handle = async (payload: ControllerArgs<UpdateStorePayload>) => {
        const { input, params } = payload;

        if (!input || !params.id) {
            throw new BadRequestError('Store ID and update data are required');
        }

        // Get the store by ID
        const store = await this.dbStore.findByPk(params.id);

        if (!store || store.isSoftDeleted()) {
            throw new BadRequestError(`Store with ID ${params.id} not found`);
        }
        const name = input?.name;

        // Check if name is being updated and if it conflicts with an existing store
        if (name && name !== store.name) {
            const existingStore = await this.dbStore.findOne({
                where: {
                    name,
                },
            });

            if (existingStore) {
                throw new BadRequestError(`A store with the name '${name}' already exists`);
            }
        }

        // Update the store
        await store.update(input);

        logger.info(`Store with ID ${params.id} updated successfully`);

        return {
            code: HttpStatus.OK,
            message: 'Store updated successfully',
            data: {
                store: store.toJSON(),
            },
        };
    };
}

const updateStoreInstance = new UpdateStore(Store);

export default updateStoreInstance;
