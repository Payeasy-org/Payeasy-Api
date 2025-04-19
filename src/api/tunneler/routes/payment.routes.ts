import { Router } from 'express';
import { checkoutCart} from '../controllers/payment.controller';

export const checkoutRouter = Router();

checkoutRouter.post('/checkout', checkoutCart);


