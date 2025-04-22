import { Request, Response } from 'express';
import { BadRequestError } from '@/core';

import { Receipt } from '../../models/receipt.model';
import { User } from '@/api/user/models/user.model';
import { StoreBranch } from '@/api/store/models/storeBranch.model';
import { Location } from '@/api/store/models/location.model';

export const getReceiptById = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId!;
        const receiptReference = req.params.receiptReference;
        console.log('receiptReference', receiptReference,`reference ${JSON.stringify(req.params)}`);  
        const receipt = await Receipt.findOne({
            where: { receiptReference, userId },
        });
        if (!receipt) {
            throw new BadRequestError('Receipt not found');
        }

        const [user, branch] = await Promise.all([
            User.findByPk(userId, { attributes: ['id', 'fullName', 'emailAddress'] }),
            StoreBranch.findByPk(receipt.storeId),
        ]);

        if (!user) throw new BadRequestError('User not found');
        if (!branch) throw new BadRequestError('Store branch not found');

        const location = await Location.findByPk(branch.locationId);
        if (!location) throw new BadRequestError('Location not found');

        const cart = receipt.cart as any;

        const payload = {
            receiptReference: receipt.receiptReference,
            totalItems: cart?.totalItems || 0,
            totalAmount: cart?.totalPrice || 0,
            user: {
                id: user.id,
                fullName: user.fullName,

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
        };

        res.json({ data: payload });
    } catch (error) {
        console.error('Error fetching receipt:', error);
        throw new BadRequestError('Failed to fetch receipt');
    }
};
