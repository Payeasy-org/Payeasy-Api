import { IntegrationService } from '@/api/inventory-integration/services';
import { BadRequestError, ControllerArgs, HttpStatus, logger } from '@/core';
import { CreateStorePayload } from '@store/interfaces';
import { Store } from '@store/models';

export class CreateStore {
    constructor(private readonly dbStore: typeof Store) {}

    handle = async (payload: ControllerArgs<CreateStorePayload>) => {
        const { input } = payload;

        if (!input) throw new BadRequestError('Store creation data is required');

        const { name } = input;

        // Check if a store with the same name already exists
        const existingStore = await this.dbStore.findOne({
            where: {
                name,
            },
        });

        if (existingStore) {
            throw new BadRequestError(`A store with the name '${name}' already exists`);
        }

        const inventory = IntegrationService.createFromProvider(input?.inventoryProvider);
        inventory.validateConfig(input?.config);

        const ok = await inventory.testConnection(input?.config);
        if (!ok) throw new Error(`Could not connect to ${input?.inventoryProvider} - Please Check Config`);

        const store = await this.dbStore.create({ ...input, inventoryUsed: input?.inventoryProvider });

        logger.info(`Store created successfully with ID: ${store.id}`);

        return {
            code: HttpStatus.CREATED,
            message: 'Store created successfully',
            data: {
                store: store.toJSON(),
            },
        };
    };
}

const createStoreInstance = new CreateStore(Store);

export default createStoreInstance;
