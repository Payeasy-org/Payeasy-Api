// DTO for adding an item to the cart.
export interface AddCartItemDTO {
  userId: string;
  productId: string;
  quantity: number;
  name?: string;   // Optional product name snapshot
  price?: number;  // Optional product price snapshot
}

// DTO for updating a cart item's quantity.
export interface UpdateCartItemDTO {
  userId: string;
  cartItemId: string;
  quantity: number;
}
