import { Router } from 'express';
import { authenticateJWT } from '@/api/shopping/middleware/auth.middleware';
import { getAllStorePayments } from '../services/store.receipt/get.all.receipt';
import { getStorePaymentById } from '../services/store.receipt/get.one.receipt';

export const storePaymentRouter = Router();
storePaymentRouter.use(authenticateJWT);
storePaymentRouter.get('/store/payments', getAllStorePayments);
storePaymentRouter.get('/store/payments/:id', getStorePaymentById);