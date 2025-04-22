import { Router } from 'express';
import { searchStore } from '../services/search.store.location';
import { searchSupermartProduct } from '../services/search.store.product';
import { authenticateJWT } from '@/api/shopping/middleware/auth.middleware';



export const storeRouter = Router();


storeRouter.use(authenticateJWT);

storeRouter.get('/searchStorelocation/:storeBranchGuid', searchStore);

//search productlocation
storeRouter.post('/search', searchSupermartProduct);





// //demo create a branch

// tunnelerRouter.post('/branch', createStoreBranch);

// // Route to handle checkout process
// tunnelerRouter.post('/checkout', checkoutCart);

// //get product














