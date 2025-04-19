import { Router } from 'express';
import { searchRetailrProduct } from '../controllers/product.controller';

export const searchRetailrRouter= Router();

// Route to search for a product using Retailr’s API
searchRetailrRouter.post('/search', searchRetailrProduct);


