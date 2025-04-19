import { Router } from 'express';
import { branchAdminRouter } from './branchAdmin.router';
import { locationRouter } from './location.router';
import { storeRouter } from './store.router';
import { storeBranchRouter } from './storeBranch.router';

export const storeBaseRouter = Router();

storeBaseRouter.use('/', storeRouter);
storeBaseRouter.use('/:storeId/branches', storeBranchRouter);
storeBaseRouter.use('/locations', locationRouter);
storeBaseRouter.use('/:storeId/admins', branchAdminRouter);
