import { Request, Response } from 'express';
import { getInventoryService } from './seach-product-by-inventory';
import { GetProductDTO, branchProductResponse } from '../../interfaces/product.dto';
import { BadRequestError } from '@/core';


export const searchSupermartProduct = async (req: Request, res: Response): Promise<void> => {
    const { productId, inventoryProvider } = req.body as GetProductDTO;

    if (!productId || !inventoryProvider) {
        throw new BadRequestError('productId and inventoryProvider are required');
    }

    try {
        const service = await getInventoryService(inventoryProvider);

        const rawResponse = await service.getProduct(req,{ product_id: productId });
        if (!rawResponse || rawResponse.status !== 'success' || !rawResponse.data) {
            res.status(404).json({ message: 'Product not found' });
            return;
        }

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
            scannedAt: new Date().toISOString(),
        };

        res.status(200).json(formatted);
    } catch (error: any) {
        const status = error.statusCode || 500;
        res.status(status).json({ message: error.message || 'Internal server error' });
    }
};
