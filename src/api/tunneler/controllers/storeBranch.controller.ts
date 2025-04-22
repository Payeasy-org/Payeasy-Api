import { Request, Response } from 'express';
import { Store } from '@/api/store/models/store.model';
import { Location } from '@/api/store/models/location.model';
import { StoreBranch } from '@/api/store/models/storeBranch.model';
import { CreateStoreBranchDTO, StoreBranchResponse } from '../dto/storeBranch.dto';
import { sequelize } from '@/core';

export const createStoreBranch = async (req: Request, res: Response): Promise<void> => {
    const input = req.body as CreateStoreBranchDTO;
    const { storeId, name, contactEmail, contactPhoneNumber, isHeadquarter, location } = input;

    // Basic input validation
    if (!storeId || !name.trim() || !location?.name?.trim()) {
        res.status(400).json({ message: 'storeId, branch name, and location.name are required.' });
        return;
    }

    let tx;
    try {
        // Start transaction
        tx = await sequelize.transaction();

        // 1. Verify Store exists
        const store = await Store.findByPk(storeId, { transaction: tx });
        if (!store) {
            await tx.rollback();
            res.status(404).json({ message: `Store not found (id=${storeId}).` });
            return;
        }

        // 2. Create the Location
        const newLocation = await Location.create(
            {
                name: location.name.trim(),
                latitude: location.latitude,
                longitude: location.longitude,
            },
            { transaction: tx },
        );

        // 3. Prevent duplicate branch names under the same store
        const exists = await StoreBranch.findOne({
            where: { storeId, name: name.trim() },
            transaction: tx,
        });
        if (exists) {
            await tx.rollback();
            res.status(409).json({ message: `Branch '${name}' already exists for this store.` });
            return;
        }

        // 4. Create the StoreBranch, linking to the new Location
        const branch = await StoreBranch.create(
            {
                storeId,
                locationId: newLocation.id,
                name: name.trim(),
                contactEmail: contactEmail ,
                contactPhoneNumber: contactPhoneNumber,
                isHeadquarter: isHeadquarter ?? false,
            },
            { transaction: tx },
        );

        // Commit transaction
        await tx.commit();

        // 5. Build the response payload
        const response: StoreBranchResponse = {
            id: branch.id,
            guid: branch.guid!,
            name: branch.name,
            storeId: branch.storeId,
            location: {
                id: newLocation.id,
                guid: newLocation.guid!,
                name: newLocation.name,
                latitude: Number(newLocation.latitude),
                longitude: Number(newLocation.longitude),
                createdAt: (newLocation as any).createdAt?.toISOString(),
                updatedAt: (newLocation as any).updatedAt?.toISOString(),
            },
            contactEmail: branch.contactEmail,
            contactPhoneNumber: branch.contactPhoneNumber,
            isHeadquarter: branch.isHeadquarter,
            createdAt: (branch as any).createdAt?.toISOString(),
            updatedAt: (branch as any).updatedAt?.toISOString(),
        };

        res.status(201).json({
            message: 'Store branch created successfully',
            data: response,
        });
    } catch (error) {
        if (tx) await tx.rollback();
        console.error('Error creating store branch and location:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
