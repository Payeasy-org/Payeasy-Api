import { Request, Response } from 'express';
import { StoreBranch } from '@/api/store/models/storeBranch.model';
import { Store } from '@/api/store/models/store.model';
import { Location } from '@/api/store/models/location.model';
import { GetStoreBranchDTO, StoreBranchResponse } from '../dto/store.dto';

// Get store branch details (name, store, and location) based on the QR scan
// export const searchStore = async (req: Request, res: Response): Promise<void> => {
//     const { storeBranchId } = req.params as unknown as GetStoreBranchDTO;

//     try {
//         // Ensure your associations are defined in your Sequelize models.
//         const branch = await StoreBranch.findByPk(storeBranchId, {
//             include: [
//                 { model: Store, as: 'store', attributes: ['name'] },
//                 { model: Location, as: 'location', attributes: ['name', 'latitude', 'longitude'] },
//             ],
//         });

//         if (!branch) {
//             res.status(404).json({ message: 'Store branch not found' });
//             return;
//         }

//         const response: StoreBranchResponse = {
//             id: branch.id,
//             branchName: branch.name,
//             storeName: (branch as any).store?.name || 'N/A',
//             locationName: (branch as any).location?.name || 'N/A',
//             latitude: (branch as any).location?.latitude || 0,
//             longitude: (branch as any).location?.longitude || 0,
//             createdAt: (branch as any).createdAt?.toISOString() || new Date().toISOString(),
//             updatedAt: (branch as any).updatedAt?.toISOString() || new Date().toISOString(),
//         };

//         res.status(200).json(response);
//     } catch (error) {
//         console.error('Error retrieving store branch:', error);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };
// File: tunneller/controllers/store.controller.ts





// export const searchStore = async (req: Request, res: Response): Promise<void> => {
//   // Extract the GUID from the QR scan
//     const { storeBranchId } = req.params as unknown as GetStoreBranchDTO;
//     console.log(`store branch id ${storeBranchId}`)

//   try {
//     // 1. Find the branch by GUID (not primary key ID) :contentReference[oaicite:0]{index=0}
//       const store = await Store.findOne({
//           where: {
//               "guid":
//                   storeBranchId
//           }
//       });

//     if (!store) {
//       res.status(404).json({ message: 'Store branch not found' });
//       return;
//     }

//     // 2. Lookup the parent Store by branch.storeId :contentReference[oaicite:1]{index=1}
//     const storeBranch = await StoreBranch.findByPk(store.id);
//     if (!store) {
//       res.status(404).json({ message: 'Parent store not found for this branch' });
//       return;
//     }

//     // 3. Lookup the Location by branch.locationId :contentReference[oaicite:2]{index=2}
//     const location = await Location.findByPk(storeBranch.locationId);
//     if (!location) {
//       res.status(404).json({ message: 'Location not found for this branch' });
//       return;
//     }

//     // 4. Build and return the response
//     const response: StoreBranchResponse = {
//         id: storeBranch?.id,
//         branchName: storeBranch?.name,
//         storeName: store.name,
//         locationName: location.name,
//         latitude: Number(location.latitude),
//         longitude: Number(location.longitude),
//         createdAt: (storeBranch as any).createdAt?.toISOString(),
//         updatedAt: (storeBranch as any).updatedAt?.toISOString(),
//     };

//     res.status(200).json(response);
//   } catch (error) {
//     console.error('Error retrieving store branch:', error);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// };

export const searchStore = async (req: Request, res: Response): Promise<void> => {
    const { storeBranchGuid } = req.params as unknown as GetStoreBranchDTO;
    console.log(`Store Branch GUID: ${storeBranchGuid}`);

    try {
        // 1. Find the branch by its GUID
        const storeBranch = await StoreBranch.findOne({
            where: { guid: storeBranchGuid },
        });

        if (!storeBranch) {
            res.status(404).json({ message: 'Store branch not found' });
            return;
        }

        // 2. Lookup the parent store
        const store = await Store.findByPk(storeBranch.storeId);
        if (!store) {
            res.status(404).json({ message: 'Parent store not found for this branch' });
            return;
        }

        // 3. Lookup the branch location
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
            inventoryUsed:store.inventoryUsed,
            createdAt: (storeBranch as any).createdAt?.toISOString(),
            updatedAt: (storeBranch as any).updatedAt?.toISOString(),
        };

        res.status(200).json(response);
    } catch (error) {
        console.error('Error retrieving store branch:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
