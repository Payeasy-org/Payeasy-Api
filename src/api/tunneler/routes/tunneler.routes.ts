import { Router } from 'express';
import { searchStore } from '../controllers/store.controller';
import { searchSupermartProduct } from '../controllers/product.controller';
import { checkoutCart } from '../controllers/payment.controller';
import { addCartItem, getCartItems,removeCartItem,clearCart } from '../controllers/cart.controller';
import { createStoreBranch } from '../controllers/storeBranch.controller';
import { authenticateJWT } from '../middleware/auth.middleware';
import { sessionMiddleware } from '@/core/cartSession/session';


export const tunnelerRouter = Router();

tunnelerRouter.use(authenticateJWT);
//demo create a branch

tunnelerRouter.post('/branch', createStoreBranch);


// Route to handle checkout process
tunnelerRouter.post('/checkout', checkoutCart);

//get product

tunnelerRouter.post('/search', searchSupermartProduct);


// Route to search for a store branch (via QR code ID)
tunnelerRouter.get('/search/:storeBranchGuid', searchStore);

//cart middleware for sessions
tunnelerRouter.use(sessionMiddleware);
// tunnelerRouter.use(checkSessionAlive);
// tunnelerRouter.use(checkSessionMatch)



// Route to add an item to the cart
tunnelerRouter.post('/cart/add', addCartItem);

// Route to retrieve all cart items for a given user (userId passed as parameter)
tunnelerRouter.get('/:userId', getCartItems);

// // Route to clear cart items
tunnelerRouter.delete('/delete', clearCart);

// // Route to remove an item from the cart (requires userId and cartItemId)
tunnelerRouter.put('/remove/:productId', removeCartItem);






