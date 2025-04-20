// DTO for adding an item to the cart.
export interface AddCartItemDTO {
  userId: string;
  productId:  number;
  quantity: number;
  name?: string;  
  price?: number;  
}

// DTO for updating a cart item's quantity.
export interface UpdateCartItemDTO {
  userId: string;
  cartItemId: number;
  quantity: number;
}
