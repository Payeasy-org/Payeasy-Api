// DTO for adding an item to the cart.
export interface AddCartItemDTO {
    userId: string;
    productId: number;
    quantity: number;
    name?: string;
    price?: number;
    imageUrl?: string;
    storeId?: number;
}

// DTO for updating a cart item's quantity.
export interface UpdateCartItemDTO {
    userId: string;
    cartItemId: number;
    quantity: number;
}

export interface CartItem {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
    totalPerProduct: number;
}

export interface Cart {
    id: string;
    storeId?: number;
    items: CartItem[];
    totalItems: number;
    totalAmount: number;
}
