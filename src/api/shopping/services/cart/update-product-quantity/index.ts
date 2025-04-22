import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { BadRequestError } from '@/core';
import { Cart, CartItem } from '@/api/shopping/interfaces/cart.dto';

type AuthRequest = Request & {
    userId?: string;
    session: Session & SessionData & { cart?: Cart };
};

export const updateCartItemQuantity = (req: AuthRequest, res: Response): void => {
    const userId = req.userId;
    const productId = req.params.productId;
    const { quantity } = req.body;

    try {

        if (!userId || !productId || quantity === undefined) {
            res.status(400).json({ message: 'Missing required parameters' });
            return;
        }

        if (!Number.isInteger(quantity) || quantity < 1) {
            res.status(400).json({ message: 'Quantity must be a positive integer' });
            return;
        }

        const cart = req.session.cart;
        if (!cart || cart.items.length === 0) {
            res.status(404).json({ message: 'Cart is empty' });
            return;
        }

        // Find the item index using string comparison
        const itemIndex = cart.items.findIndex((item: CartItem) => item.productId.toString() === productId);

        if (itemIndex === -1) {
            res.status(404).json({ message: 'Product not found in cart' });
            return;
        }

        // Update the quantity and recalculate totals
        const updatedItem = cart.items[itemIndex];
        updatedItem.quantity = quantity;
        updatedItem.totalPerProduct = updatedItem.price * quantity;

        // Update cart totals
        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalAmount = cart.items.reduce((sum, item) => sum + item.totalPerProduct, 0);

        req.session.save((err: Error | null) => {
            if (err) {
                console.error('Session save error:', err);
                res.status(500).json({ message: 'Failed to update quantity' });
                return;
            }
            res.status(200).json({
                message: 'Quantity updated successfully',
                data: cart,
            });
        });
    } catch (error) {
        throw new BadRequestError('Failed to update cart item quantity');
    }
};
