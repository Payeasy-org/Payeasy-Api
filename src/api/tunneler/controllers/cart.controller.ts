import { Request, Response } from 'express';

import { AddCartItemDTO, UpdateCartItemDTO } from '../dto/cart.dto';

// Add a new item to the cart (or update quantity if it already exists)
export const addCartItem = async (req: Request, res: Response): Promise<void> => {
  const { productId, quantity, name, price } = req.body as AddCartItemDTO;
  const userId = req.userId
  if (!userId || !productId || !quantity) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }
  try {
  //   // Check if the item is already in the cart for this user
  //   let cartItem = await CartItem.findOne({ where: { userId, productId } });
  //   if (cartItem) {
  //     cartItem.quantity += quantity;
  //     await cartItem.save();
  //   } else {
  //     cartItem = await CartItem.create({ userId, productId, quantity, name, price });
  //   }
  //   res.status(200).json(cartItem);
  } catch (error) {
    console.error('Error adding cart item:', error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

// Retrieve all cart items for a given user
export const getCartItems = async (req: Request, res: Response): Promise<void> => {
  const  userId  = req.userId;
  if (!userId) {
    res.status(400).json({ message: 'Missing user id' });
    return;
  }
  try {
    // const cartItems = await CartItem.findAll({ where: { userId } });
    // res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).json({ message: 'Failed to fetch cart items' });
  }
};

// Update the quantity of an item in the cart
export const updateCartItem = async (req: Request, res: Response): Promise<void> => {
  const { userId, cartItemId, quantity } = req.body as UpdateCartItemDTO;
  if (!userId || !cartItemId || !quantity) {
    res.status(400).json({ message: 'Missing required fields' });
    return;
  }
  try {
    // const cartItem = await CartItem.findOne({ where: { id: cartItemId, userId } });
    // if (!cartItem) {
    //   res.status(404).json({ message: 'Cart item not found' });
    //   return;
    // }
    // cartItem.quantity = quantity;
    // await cartItem.save();
    // res.status(200).json(cartItem);
  } catch (error) {
    console.error('Error updating cart item:', error);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

// Remove an item from the cart
export const removeCartItem = async (req: Request, res: Response): Promise<void> => {
  // const { userId, cartItemId } = req.params;
  // if (!userId || !cartItemId) {
  //   res.status(400).json({ message: 'Missing required parameters' });
  //   return;
  // }
  try {
  //   const result = await CartItem.destroy({ where: { id: cartItemId, userId } });
  //   if (result === 0) {
  //     res.status(404).json({ message: 'Cart item not found' });
  //     return;
  //   }
  //   res.status(200).json({ message: 'Cart item removed' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    res.status(500).json({ message: 'Failed to remove cart item' });
  }
};
