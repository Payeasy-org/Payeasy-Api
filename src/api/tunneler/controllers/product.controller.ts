import { Request, Response } from 'express';
import axios from 'axios';
import { GetProductDTO, RetailrProductResponse } from '../dto/product.dto';

const RETAILR_API_URL = 'https://api.retailr.io/products/search';
const RETAILR_API_KEY = process.env.RETAILR_API_KEY || '';

export const searchRetailrProduct = async (req: Request, res: Response): Promise<void> => {
  const { searchTerm } = req.body as GetProductDTO;

  if (!searchTerm) {
    res.status(400).json({ message: 'Missing search term' });
    return;
  }
 
  try {
    const { data } = await axios.post(RETAILR_API_URL, { query: searchTerm }, {
      headers: {
        Authorization: `Bearer ${RETAILR_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    const products: RetailrProductResponse[] = data.data;
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products from Retailr:', error);
    res.status(500).json({ message: 'Failed to fetch product from Retailr' });
  }
};
