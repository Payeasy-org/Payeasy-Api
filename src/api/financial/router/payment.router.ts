// File: src/api/tunneler/routes/payment.routes.ts

import { Router } from 'express'; // :contentReference[oaicite:0]{index=0}
import { authenticateJWT } from '@/api/shopping/middleware/auth.middleware';
import { checkoutCart } from '../services/cart.payment/checkout.cart';
import { verifyPayment } from '../services/cart.payment/verify.payment';
import { sessionMiddleware } from '@/core/cartSession/session';

export const cartPaymentRouter = Router();

cartPaymentRouter.use(sessionMiddleware); 
cartPaymentRouter.use(authenticateJWT); 
cartPaymentRouter.post('/checkout', checkoutCart); 


cartPaymentRouter.post('/verify', verifyPayment); 

