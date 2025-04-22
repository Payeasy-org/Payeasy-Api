import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { UnAuthorizedError,BadRequestError } from '@/core';
import { AddCartItemDTO, UpdateCartItemDTO } from '../dto/cart.dto';
import { User } from '@/api/user/models/user.model';


interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    totalPerProduct: number;
}

interface Cart {
    id: string; 
    items: CartItem[]; 
    totalItems: number; 
    totalAmount: number; 
}

type AuthRequest = Request & {
    userId?: string;
    session: Session & SessionData & { cart?: Cart };
};

export const addCartItem = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) throw new UnAuthorizedError('Not authenticated');

    const { productId, name, price, quantity, imageUrl } = req.body as AddCartItemDTO;
    if (!productId || !name || price == null || !quantity) {
        throw new BadRequestError('missing required fields');
        return;
    }
    const user = await User.findByPk(userId);
    console.log(`userId: ${userId}, userId: ${req.userId}, sessionID: ${req.sessionID} user details : ${JSON.stringify(user)}`);
    if (!user) {
        throw new BadRequestError('user not found');
        return;
    }
    if (!user.sessionId) {
        await User.update({ sessionId: req.sessionID }, { where: { id: userId } });
    }
    // Validate session matches stored one to avoid hijack/stale state :contentReference[oaicite:5]{index=5}
    // else if (user.sessionId !== req.sessionID) {
    //     throw new BadRequestError('Session mismatch please re-login');
     
    // }


    if (!req.session.cart) {
        req.session.cart = {
            id: req.sessionID,
            items: [],
            totalItems: 0,
            totalAmount: 0,
        };
    }

    const cart = req.session.cart;

    const existing = cart.items.find((item: CartItem) => item.productId === productId);
    if (existing) {
        existing.quantity += quantity;
        existing.totalPerProduct = existing.quantity * existing.price;
    } else {
        cart.items.push({
            productId,
            name,
            price,
            quantity,
            imageUrl,
            totalPerProduct: price * quantity,
        });
    }

    // Recalculate totals with Array.reduce :contentReference[oaicite:7]{index=7}
    cart.totalItems = cart.items.reduce((sum: number, item: CartItem) => sum + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum: number, item: CartItem) => sum + item.totalPerProduct, 0);
    req.session.save((err: Error | null) => {
        if (err) {
            console.error('Session save error:', err);
            throw new BadRequestError('failed to save the cart');
        } else {
            res.status(200).json({data:cart});
        }
    });
};


export const getCartItems = (req: AuthRequest, res: Response): void => {
    if (!req.userId) {
        throw new BadRequestError('not authenticated')

    }
    // Return empty cart structure if none exists :contentReference[oaicite:9]{index=9}
    if (!req.session.cart) {
        throw new BadRequestError('bad session');
        return
    }
    const cart = req.session.cart || {
        id: req.sessionID,
        items: [],
        totalItems: 0,
        totalAmount: 0,
    };
    res.status(200).json({data:cart});
};




export const removeCartItem = (req: AuthRequest, res: Response): void => {
    const userId = req.userId;
    const { productId } = req.params as { productId: string };
    if (!userId || !productId) {
        throw new BadRequestError('missing requird parameters');

    }

    const cart = req.session.cart;
    if (!cart) {
       throw new BadRequestError('cart is empty');
    }

    // Filter out the item
    cart.items = cart.items.filter((i: CartItem) => i.productId !== Number(productId));

    // Recompute totals
    cart.totalItems = cart.items.reduce((sum: number, i: CartItem) => sum + i.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum: number, i: CartItem) => sum + i.totalPerProduct, 0);

    req.session.save((err: Error | null) => {
        if (err) {
            console.error('Session save error:', err);
            throw new BadRequestError('failed to remove item');
        } else {
            res.status(200).json({data:cart});
        }
    });
};


export const clearCart = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    // Destroy session and clear user.sessionId :contentReference[oaicite:10]{index=10}
    req.session.destroy(async (err: Error | null) => {
        if (err) {
            console.error('Session destroy error:', err);
            res.status(500).json({ message: 'Failed to clear cart' });
        } else {
            await User.update({ sessionId: null as unknown as string }, { where: { id: userId } });
            res.clearCookie('sid').status(200).json({ message: 'Cart cleared' });
        }
    });
};
