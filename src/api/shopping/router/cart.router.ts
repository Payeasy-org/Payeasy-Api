import { Router } from 'express';
import { authenticateJWT } from '@/api/shopping/middleware/auth.middleware';
import { sessionMiddleware } from '@/core/cartSession/session';
import { addCartItem } from '@/api/shopping/services/cart/add-to-cart'
import { getCartItems } from '@/api/shopping/services/cart/get-cart-items';
import { removeCartItem } from '@/api/shopping/services/cart/remove-item-from-cart';
import { clearCart } from '@/api/shopping/services/cart/delete-cart';
import { updateCartItemQuantity } from '../services/cart/update-product-quantity';

export const cartRouter = Router();


cartRouter.use(authenticateJWT);
cartRouter.use(sessionMiddleware);


// // Route to add an item to the cart
cartRouter.post('/cart/add', addCartItem);

// // Route to retrieve all cart items for a given user (userId passed as parameter)
cartRouter.get('/', getCartItems);

// update a cart item quantity
cartRouter.put('/update/:productId', updateCartItemQuantity);
// // // Route to clear cart items
cartRouter.delete('/delete', clearCart);

// // // Route to remove an item from the cart (requires userId and cartItemId)
cartRouter.delete('/remove/:productId', removeCartItem);