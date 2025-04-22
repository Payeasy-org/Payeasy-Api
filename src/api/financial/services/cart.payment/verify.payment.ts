import { Request, Response } from 'express';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Session, SessionData } from 'express-session';

import { Receipt } from '../../models/receipt.model';
import { StorePayment } from '../../models/storePayment.model';
import { User } from '@/api/user/models/user.model';
import { StoreBranch } from '@/api/store/models/storeBranch.model';
import { Location } from '@/api/store/models/location.model';
import { BadRequestError, UnAuthorizedError } from '@/core';

type AuthRequest = Request & {
    userId?: string;
    session: Session & SessionData & { cart?: any };
};

export const verifyPayment = async (req: AuthRequest, res: Response): Promise<void> => {
    const { reference } = req.body;
    const userId = req.userId;
    if (!userId || !reference) {
        throw new UnAuthorizedError('Missing reference or not authenticated');
    }

    try {
  
        const { data: verifyData } = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        });
        const success = verifyData.data.status === 'success';


        const cart = req.session.cart!;
        const receiptRef = uuidv4();
        await StorePayment.create({
            storeId: cart.storeId,
            userId: userId!,
            amount: cart.totalAmount,
            status: success ? 'success' : 'failed',
            receiptReference: receiptRef,
        });

        if (!success) {
            req.session.destroy((err) => {
                res.clearCookie('sid');
                res.status(400).json({ message: 'Payment failed – please retry' });
            });
        }


        const receipt = await Receipt.create({
            userId: userId!,
            storeId: cart.storeId,
            sessionId: req.sessionID,
            cart,
            totalItems: cart.totalItems,
            totalAmount: cart.totalAmount,
            paymentStatus: 'success',
            paystackReference: reference,
            receiptReference: receiptRef,
        });
        const branch = await StoreBranch.findByPk(cart.storeId);
        if (!branch) throw new BadRequestError('Store branch not found');

        const location = await Location.findByPk(branch.locationId);
        if (!location) throw new BadRequestError('Location not found');

        req.session.destroy(async () => {
            res.clearCookie('sid');
            await User.update({ sessionId: null as any }, { where: { id: userId! } });

            res.status(200).json({
                data: {
                    receipt,
                    store: {
                        name: branch.name,
                        location: {
                            name: location.name,
                            latitude: Number(location.latitude),
                            longitude: Number(location.longitude),
                        },
                    },
                },
            });
        });
    } catch (err: any) {
        console.error('Error verifying payment:', err);
        res.status(500).json({ message: 'Payment verification failed' });
    }
};
