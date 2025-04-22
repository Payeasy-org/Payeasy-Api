import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { UnAuthorizedError, BadRequestError } from '@/core';
import { AddCartItemDTO, UpdateCartItemDTO, Cart, CartItem } from '@/api/shopping/interfaces/cart.dto';
import { User } from '@/api/user/models/user.model';

type AuthRequest = Request & {
    userId?: string;
    session: Session & SessionData & { cart?: Cart };
};

export const getCartItems = (req: AuthRequest, res: Response): void => {
    if (!req.userId) {
        throw new BadRequestError('not authenticated');
    }
    // Return empty cart structure if none exists :contentReference[oaicite:9]{index=9}
    if (!req.session.cart) {
        throw new BadRequestError('bad session');
        return;
    }
    const cart = req.session.cart || {
        id: req.sessionID,
        items: [],
        totalItems: 0,
        totalAmount: 0,
    };
    res.status(200).json({ data: cart });
};