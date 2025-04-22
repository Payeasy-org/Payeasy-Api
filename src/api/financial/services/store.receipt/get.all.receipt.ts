// src/api/tunneler/controllers/storePayments.controller.ts

import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { BadRequestError } from '@/core';

import { StorePayment } from '../../models/storePayment.model';
import { Receipt } from '../../models/receipt.model';
import { User } from '@/api/user/models/user.model';
import { StoreBranch } from '@/api/store/models/storeBranch.model';
import { Location } from '@/api/store/models/location.model';

export const getAllStorePayments = async (req: Request, res: Response) => {
    try {
        const {storeId} = req.body;
        if (!storeId) {
            throw new BadRequestError('Missing storeBranchId');
        }

        const payments = await StorePayment.findAll({
            where: { storeId },
            attributes: {
                exclude: ['createdAt', 'updatedAt'], 
            },
            order: [['updatedAt', 'DESC']],
        });

        const receiptRefs = payments.map((p) => p.receiptReference!).filter(Boolean) as string[];
        const userIds = Array.from(new Set(payments.map((p) => p.userId)));

        const [receipts, users] = await Promise.all([
            Receipt.findAll({
                where: { receiptReference: { [Op.in]: receiptRefs } },
            }),
            User.findAll({
                where: { id: userIds },
                attributes: ['id', 'fullName', 'emailAddress'],
            }),
        ]);

        const branch = await StoreBranch.findByPk(storeId);
        if (!branch) throw new BadRequestError('Store branch not found');
        const location = await Location.findByPk(branch.locationId);
        if (!location) throw new BadRequestError('Location not found');

        const userById = new Map(users.map((u) => [u.id, u]));
        const receiptByRef = new Map(receipts.map((r) => [r.receiptReference, r]));

        const data = payments.map((p) => {
            const user = userById.get(p.userId)!;
            const receipt = receiptByRef.get(p.receiptReference!)!;
            const items = (receipt.cart as any).items || []; 

            return {
                id: p.id,
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
                    receiptRef: p.receiptReference,
                    amount: p.amount,
                    status: p.status,
                },
                items: items.map((it: any) => ({
                    productId: it.productId,
                    name: it.name,
                    unitPrice: it.price,
                    quantity: it.quantity,
                    totalPerProduct: it.totalPerProduct,
                })),
                totalItems: items.reduce((sum: number, i: any) => sum + i.quantity, 0),
                totalAmount: items.reduce((sum: number, i: any) => sum + i.totalPerProduct, 0),
            };
        });

        const summary = {
            totalPayments: data.length,
            totalAmount: data.reduce((sum, x) => sum + x.payment.amount, 0),
        };

        return res.json({ data: { summary, payments: data } });
    } catch (err: any) {
        console.error('Error fetching store payments:', err);
        throw new BadRequestError('Failed to fetch store payments');
    }
};
