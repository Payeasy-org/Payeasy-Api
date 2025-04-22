import { Request, Response } from 'express';
import { Receipt } from '../../models/receipt.model';
import { User } from '@/api/user/models/user.model';
import { StoreBranch } from '@/api/store/models/storeBranch.model';
import { Location } from '@/api/store/models/location.model';
import { BadRequestError } from '@/core';

export const getAllReceipts = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId!;
        if (!userId) {
            throw new BadRequestError('Missing userId');
        }

        const receipts = await Receipt.findAll({ where: { userId } });

        if (receipts.length === 0) {
            return res.json({ data: [] });
        }
        const branchIds = Array.from(new Set(receipts.map((r) => r.storeId)));
        const branches = await StoreBranch.findAll({ where: { id: branchIds } });
        const locations = await Location.findAll({ where: { id: branches.map((b) => b.locationId) } });
        const user = await User.findByPk(userId, { attributes: ['id', 'fullName', 'emailAddress'] });

        const branchById = new Map(branches.map((b) => [b.id, b]));
        const locById = new Map(locations.map((l) => [l.id, l]));

        const payload = receipts.map((r) => {
            const branch = branchById.get(r.storeId)!;
            const location = locById.get(branch.locationId)!;
            const cart = r.cart as any;

            return {
                receiptReference: r.receiptReference,

                user: {
                    id: user?.id,
                    fullName: user?.fullName,
                    emailAddress: user?.emailAddress,
                },
                store: {
                    id: branch.id,
                    name: branch.name,
                    location: {
                        name: location.name,
                        latitude: Number(location.latitude),
                        longitude: Number(location.longitude),
                    },
                },
                cart:
                    cart?.items?.map((item: any) => ({
                        productId: item.productId,
                        name: item.name,
                        unitPrice: item.price,
                        quantity: item.quantity,
                        totalPerProduct: item.totalPerProduct,
                    })) || [],
                totalItems: cart?.totalItems || 0,
                totalAmount: cart?.totalPrice || 0,
            };
        });

        res.json({ data: payload });
    } catch (error) {
        console.error('Error fetching receipts:', error);
        throw new BadRequestError('Failed to fetch receipts');
    }
};
