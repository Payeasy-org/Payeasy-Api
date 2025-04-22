import { Request, Response } from 'express';
import { StoreBranch } from '@/api/store/models/storeBranch.model';
import { Store } from '@/api/store/models/store.model';
import { Location } from '@/api/store/models/location.model';
import { GetStoreBranchDTO, StoreBranchResponse } from '../../interfaces/store.dto';

export const searchStore = async (req: Request, res: Response): Promise<void> => {
    const { storeBranchGuid } = req.params as unknown as GetStoreBranchDTO;
    console.log(`Store Branch GUID: ${storeBranchGuid}`);

    try {
        const storeBranch = await StoreBranch.findOne({
            where: { guid: storeBranchGuid },
        });

        if (!storeBranch) {
            res.status(404).json({ message: 'Store branch not found' });
            return;
        }

        const store = await Store.findByPk(storeBranch.storeId);
        if (!store) {
            res.status(404).json({ message: 'Parent store not found for this branch' });
            return;
        }

        const location = await Location.findByPk(storeBranch.locationId);
        if (!location) {
            res.status(404).json({ message: 'Location not found for this branch' });
            return;
        }

        // 4. Build the response
        const response: StoreBranchResponse = {
            id: storeBranch.id,
            branchName: storeBranch.name,
            storeId: store.id,
            locationName: location.name,
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
            inventoryUsed: store.inventoryUsed,
            createdAt: (storeBranch as any).createdAt?.toISOString(),
            updatedAt: (storeBranch as any).updatedAt?.toISOString(),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving store branch:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
