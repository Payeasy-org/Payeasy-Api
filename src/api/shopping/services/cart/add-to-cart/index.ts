import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { UnAuthorizedError, BadRequestError } from '@/core';
import { AddCartItemDTO, UpdateCartItemDTO,Cart,CartItem } from '@/api/shopping/interfaces/cart.dto';
import { User } from '@/api/user/models/user.model';

type AuthRequest = Request & {
    userId?: string;
    session: Session & SessionData & { cart?: Cart };
};

export const addCartItem = async (req: AuthRequest, res: Response): Promise<void> => {

    try {
        const userId = req.userId;
        if (!userId) throw new UnAuthorizedError('Not authenticated');

        const { productId, name, price, quantity, imageUrl,storeId } = req.body as AddCartItemDTO;
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

        if (!req.session.cart) {
            req.session.cart = {
                id: req.sessionID,
                items: [],
                totalItems: 0,
                totalAmount: 0,
                storeId: storeId,   
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
                res.status(200).json({ data: cart });
            }
        });
    } catch (error) {
        throw new BadRequestError('Failed to add item to cart');
        
    }
};