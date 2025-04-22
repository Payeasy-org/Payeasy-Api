// src/api/tunneler/routes/receipt.routes.ts

import { Router } from 'express';
import { authenticateJWT } from '@/api/shopping/middleware/auth.middleware';

import { getAllReceipts } from '../services/users.receipts.ts/get.all.receipts';
import { getReceiptById } from '../services/users.receipts.ts/get.one.receipt';

export const receiptRouter = Router();
receiptRouter.use(authenticateJWT);

receiptRouter.get('/receipt', getAllReceipts);


receiptRouter.get('/receipt/:receiptReference', getReceiptById);


