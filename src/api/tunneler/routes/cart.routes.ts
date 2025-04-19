import { Router } from 'express';
import { addCartItem, getCartItems, updateCartItem, removeCartItem } from '../controllers/cart.controller';


export const cartRouter = Router();
// Route to add an item to the cart
cartRouter.post('/add', addCartItem);

// Route to retrieve all cart items for a given user (userId passed as parameter)
cartRouter.get('/:userId', getCartItems);

// Route to update a cart item
cartRouter.put('/update', updateCartItem);

// Route to remove an item from the cart (requires userId and cartItemId)
cartRouter.delete('/remove/:userId/:cartItemId', removeCartItem);
