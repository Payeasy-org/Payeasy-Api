import { Request, Response } from 'express';
import axios from 'axios';
import { Transaction } from '../models/transaction.model';
// import { CartItem } from '../models/cart.model';
import { sequelize } from '@/core';

interface CheckoutCartDTO {
  userId: string;
  email: string;
}

export const checkoutCart = async (req: Request, res: Response): Promise<void> => {
  const { userId, email } = req.body as CheckoutCartDTO;

  if (!userId || !email) {
    res.status(400).json({ message: 'Missing required checkout details: userId and email' });
    return;
  }

  let dbTransaction;
  try {
    // // Start a database transaction for atomicity.
    // dbTransaction = await sequelize.transaction();

    // // Retrieve all cart items for the user.
    // const cartItems = await CartItem.findAll({ where: { userId }, transaction: dbTransaction });
    // if (!cartItems || cartItems.length === 0) {
    //   await dbTransaction.rollback();
    //   res.status(400).json({ message: 'Cart is empty' });
    //   return;
    // }

    // // Validate cart items and calculate the total amount.
    // let totalAmount = 0;
    // const cartSummary = [];
    // for (const item of cartItems) {
    //   if (!item.price || item.price <= 0) {
    //     await dbTransaction.rollback();
    //     res.status(400).json({ message: `Invalid price for cart item with id ${item.id}` });
    //     return;
    //   }
    //   totalAmount += Number(item.price) * item.quantity;
    //   cartSummary.push({
    //     productId: item.productId,
    //     quantity: item.quantity,
    //     name: item.name,
    //     price: item.price,
    //   });
    // }

    // if (totalAmount <= 0) {
    //   await dbTransaction.rollback();
    //   res.status(400).json({ message: 'Total amount cannot be zero or negative' });
    //   return;
    // }

    // // Prepare the payload for the Paystack API.
    // const PAYSTACK_API_URL = 'https://api.paystack.co/transaction/initialize';
    // const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY || '';
    // const payload = {
    //   email,
    //   amount: totalAmount, // Ensure this amount is in the correct unit (e.g., kobo)
    //   metadata: { cartSummary },
    // };

    // // Call Paystack to initialize the transaction.
    // let paystackResponse;
    // try {
    //   const response = await axios.post(PAYSTACK_API_URL, payload, {
    //     headers: {
    //       Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    //       'Content-Type': 'application/json',
    //     },
    //   });
    //   paystackResponse = response.data;
    //   if (!paystackResponse || !paystackResponse.status) {
    //     await dbTransaction.rollback();
    //     res.status(500).json({ message: 'Paystack initialization failed' });
    //     return;
    //   }
    // } catch (apiError) {
    //   await dbTransaction.rollback();
    //   console.error('Paystack API call error:', apiError);
    //   res.status(500).json({ message: 'Error initiating Paystack transaction' });
    //   return;
    // }

    // // Create a transaction record in the database.
    // // Note: The cart summary is serialized as a JSON string in the `productId` field.
    // const transactionRecord = await Transaction.create(
    //   {
    //     productId: JSON.stringify(cartSummary),
    //     amount: totalAmount,
    //     email,
    //     transactionRef: paystackResponse.data.reference, // Adjust if the reference field differs
    //     status: 'pending',
    //   },
    //   { transaction: dbTransaction }
    // );

    // // Optionally clear the user's cart after checkout initialization.
    // await CartItem.destroy({ where: { userId }, transaction: dbTransaction });

    // // Commit the transaction.
    // await dbTransaction.commit();

    // res.status(200).json({
    //   message: 'Checkout initiated successfully',
    //   paystack: paystackResponse,
    //   transaction: transactionRecord,
    // });
  } catch (error) {
    if (dbTransaction) {
      // await dbTransaction.rollback();
    }
    console.error('Error during cart checkout:', error);
    res.status(500).json({ message: 'Failed to initiate checkout for cart items' });
  }
};
