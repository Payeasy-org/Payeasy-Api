// src/api/tunneler/controllers/storePayments.controller.ts

import { Request, Response } from 'express';
import { BadRequestError } from '@/core';

import { StorePayment } from '../../models/storePayment.model';
import { Receipt } from '../../models/receipt.model';
import { User } from '@/api/user/models/user.model';
import { StoreBranch } from '@/api/store/models/storeBranch.model';
import { Location } from '@/api/store/models/location.model';

export const getStorePaymentById = async (req: Request, res: Response) => {
    try {

        const storeId = req.body.storeBranchId
        const paymentId = req.params.id;

        if (!storeId || !paymentId) {
            throw new BadRequestError('Missing storeId or paymentId');
        }

        const payment = await StorePayment.findOne({
            where: { id: paymentId, storeId },
            attributes: { exclude: ['createdAt', 'updatedAt'] },
        });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        const [user, branch] = await Promise.all([
            User.findByPk(payment.userId, { attributes: ['id', 'fullName', 'emailAddress'] }),
            StoreBranch.findByPk(storeId),
        ]);
        if (!user || !branch) {
            throw new BadRequestError('Associated user or branch not found');
        }

        const location = await Location.findByPk(branch.locationId);
        if (!location) {
            throw new BadRequestError('Location not found');
        }

        let items: any[] = [];
        if (payment.receiptReference) {
            const receipt = await Receipt.findOne({ where: { receiptReference: payment.receiptReference } });
            if (receipt && receipt.cart) {
                items = (receipt.cart as any).items || [];
            }
        }

        const data = {
            id: payment.id,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.emailAddress,
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
            payment: {
                receiptRef: payment.receiptReference,
                amount: payment.amount,
                status: payment.status,
            },
            items: items.map((it: any) => ({
                productId: it.productId,
                name: it.name,
                unitPrice: it.price,
                quantity: it.quantity,
                totalPerProduct: it.totalPerProduct,
            })),
            totalItems: items.reduce((sum, i: any) => sum + i.quantity, 0),
            totalAmount: items.reduce((sum, i: any) => sum + i.totalPerProduct, 0),
        };

        return res.json({ data });
    } catch (err: any) {
        console.error('Error fetching payment by ID:', err);
        throw new BadRequestError('Failed to fetch payment details');
    }
};
