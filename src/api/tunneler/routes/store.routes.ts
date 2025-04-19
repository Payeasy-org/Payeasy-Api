import { Router } from 'express';
import { searchStore } from '../controllers/store.controller';

export const searchStoreRouter = Router();

// Route to search for a store branch (via QR code ID)
searchStoreRouter.get('/search/:storeBranchId', searchStore);

