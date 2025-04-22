
import { Request, Response } from 'express';
import axios from 'axios';
import { UnAuthorizedError } from '@/core';
import { Session, SessionData } from 'express-session';

import { Receipt } from '../../models/receipt.model';
import { User } from '@/api/user/models/user.model';
import { StoreBranch } from '@/api/store/models/storeBranch.model';

type AuthRequest = Request & {
    userId?: string;
    session: Session & SessionData & { cart?: any };
};



export const checkoutCart = async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) throw new UnAuthorizedError('Not authorized');

    const cart = req.session.cart;
    if (!cart || !cart.items.length) {
        return res.status(400).json({ message: 'Cart is empty' });
    }

    const amountKobo = Math.round(cart.totalAmount * 100);
    const user = await User.findByPk(userId);

    const { data } = await axios.post(
        'https://api.paystack.co/transaction/initialize',
        {
            email: user!.emailAddress,
            amount: amountKobo,
            metadata: { cart: cart.items },
        },
        {
            headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
        },
    );

      console.log(`transaction reference: ${data.data.reference}`);
    req.session.transaction = {
        reference: data.data.reference,
        amount: amountKobo,
        storeId: cart.storeId,
        status: 'pending',
        createdAt: new Date(),
    };

   
    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            return res.status(500).json({ message: 'Failed to initialize payment' });
        }

        res.json({ authorizationUrl: data.data.authorization_url });
    });
};




