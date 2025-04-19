import { Request, Response } from 'express';
import { StoreBranch } from '@/api/store/models/storeBranch.model';
import { Store } from '@/api/store/models/store.model';
import { Location } from '@/api/store/models/location.model';
import { GetStoreBranchDTO, StoreBranchResponse } from '../dto/store.dto';

// Get store branch details (name, store, and location) based on the QR scan
export const searchStore = async (req: Request, res: Response): Promise<void> => {
    const { storeBranchId } = req.params as unknown as GetStoreBranchDTO;

    try {
        // Ensure your associations are defined in your Sequelize models.
        const branch = await StoreBranch.findByPk(storeBranchId, {
            include: [
                { model: Store, as: 'store', attributes: ['name'] },
                { model: Location, as: 'location', attributes: ['name', 'latitude', 'longitude'] },
            ],
        });

        if (!branch) {
            res.status(404).json({ message: 'Store branch not found' });
            return;
        }

        const response: StoreBranchResponse = {
            id: branch.id,
            branchName: branch.name,
            storeName: (branch as any).store?.name || 'N/A',
            locationName: (branch as any).location?.name || 'N/A',
            latitude: (branch as any).location?.latitude || 0,
            longitude: (branch as any).location?.longitude || 0,
            createdAt: (branch as any).createdAt?.toISOString() || new Date().toISOString(),
            updatedAt: (branch as any).updatedAt?.toISOString() || new Date().toISOString(),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving store branch:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
