import { Router } from 'express';
import { branchAdminRouter } from './branchAdmin.router';
import { locationRouter } from './location.router';
import { storeRouter } from './store.router';
import { storeBranchRouter } from './storeBranch.router';

export const apiRouter = Router();

apiRouter.use('/', storeRouter);
apiRouter.use('/:storeId/branches', storeBranchRouter);
apiRouter.use('/locations', locationRouter);
apiRouter.use('/:storeId/admins', branchAdminRouter);
