import { Request, Response } from 'express';
import { Session, SessionData } from 'express-session';
import { UnAuthorizedError, BadRequestError } from '@/core';
import { AddCartItemDTO, UpdateCartItemDTO, Cart, CartItem } from '@/api/shopping/interfaces/cart.dto';
import { User } from '@/api/user/models/user.model';

type AuthRequest = Request & {
    userId?: string;
    session: Session & SessionData & { cart?: Cart };
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