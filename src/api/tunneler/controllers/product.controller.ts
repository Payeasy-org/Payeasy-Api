import { Request, Response } from 'express';
import { getInventoryService } from '../search-products';
import { GetProductDTO, branchProductResponse } from '../dto/product.dto';
import { BadRequestError } from '@/core';
import { RetailrBranchItemResponse, ResponseDTO } from '@/api/inventory-integration/services/retailr/types/apiResponse';



// export const searchSupermartProduct = async (req: Request, res: Response): Promise<void> => {
//   const { inventoryProvider,productId } = req.body as GetProductDTO;

//   if (!productId|| !inventoryProvider) {
//     res.status(400).json({ message: 'Missing search term' });
//     return;
//   }
 
//   try {
//     const { data } = getInventoryService;

//     const products: branchProductResponse[] = data.data;
//     res.status(200).json(products);
//   } catch (error) {
//     console.error('Error fetching products from Retailr:', error);
//     res.status(500).json({ message: 'Failed to fetch product from Retailr' });
//   }
// };

export const searchSupermartProduct = async (req: Request, res: Response): Promise<void> => {
    const { productId, inventoryProvider } = req.body as GetProductDTO;

    if (!productId || !inventoryProvider) {
        throw new BadRequestError('productId and inventoryProvider are required');
    }

    try {
        const service = await getInventoryService(inventoryProvider);

        const rawResponse = await service.getProduct({ product_id: productId });

        // Check if the response is valid
        if (!rawResponse || rawResponse.status !== 'success' || !rawResponse.data) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }
        console.log('rawResponse', rawResponse);
        const {
            id,
            variant: {
                inventory: { name, brand, categories },

                sku,
            },
            selling_price,
            original_price,
            quantity,
            images,
        } = rawResponse.data;

        const formatted: branchProductResponse = {
            id,
            name,
            sku: sku || undefined,
            price: Number(selling_price ?? original_price ?? 0),
            brand: brand || undefined,
            quantity: quantity || 0,
            imageUrl: images?.[0]?.src || undefined,
            category: categories?.[0]?.name || undefined,
        };

        res.status(200).json(formatted);
    } catch (error: any) {
        const status = error.statusCode || 500;
        res.status(status).json({ message: error.message || 'Internal server error' });
    }
};
