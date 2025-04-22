import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { BadRequestError } from '@/core';
import { Cart, CartItem } from '@/api/shopping/interfaces/cart.dto';

type AuthRequest = Request & {
    userId?: string;
    session: Session & SessionData & { cart?: Cart };
};

export const removeCartItem = (req: AuthRequest, res: Response): void => {
    const userId = req.userId;
    const productId = req.params.productId; // Keep as string
    console.log(`'removeCartItem' ${userId}, product params: ${productId}`);
    try {
        if (!userId || !productId) {
            res.status(400).json({ message: 'Missing required parameters' });
            return;
        }

        const cart = req.session.cart;
        if (!cart) {
            res.status(400).json({ message: 'Cart is empty' });
            return;
        }

        // Compare as strings to handle type differences
        const newItems = cart.items.filter((i: CartItem) => i.productId.toString() !== productId);

        if (newItems.length === cart.items.length) {
            res.status(404).json({
                message: 'Product not found in cart',
                data: cart.items,
            });
            return;
        }

        cart.items = newItems;
        cart.totalItems = cart.items.reduce((sum, i) => sum + i.quantity, 0);
        cart.totalAmount = cart.items.reduce((sum, i) => sum + i.totalPerProduct, 0);

        req.session.save((err: Error | null) => {
            if (err) {
                console.error('Session save error:', err);
                res.status(500).json({ message: 'Failed to remove item' });
                return;
            }
            res.status(200).json({ data: cart });
        });
    } catch (error) {
        throw new BadRequestError('Failed to remove item from cart');
    }
};
