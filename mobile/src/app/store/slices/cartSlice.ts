import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { CartItem, Money } from '../../../types';

export interface CartState {
  items: CartItem[];
  updatedAt: string | null;
}

const initialState: CartState = {
  items: [],
  updatedAt: null,
};

export interface AddCartItemPayload {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: Money;
}

export interface UpdateCartItemPayload {
  productId: string;
  quantity: number;
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addCartItem(state, action: PayloadAction<AddCartItemPayload>) {
      const existing = state.items.find(i => i.productId === action.payload.productId);
      if (existing) {
        existing.quantity += action.payload.quantity;
      } else {
        state.items.push({ ...action.payload });
      }
      state.updatedAt = new Date().toISOString();
    },
    updateCartItem(state, action: PayloadAction<UpdateCartItemPayload>) {
      const item = state.items.find(i => i.productId === action.payload.productId);
      if (!item) {
        return;
      }
      if (action.payload.quantity <= 0) {
        state.items = state.items.filter(i => i.productId !== action.payload.productId);
      } else {
        item.quantity = action.payload.quantity;
      }
      state.updatedAt = new Date().toISOString();
    },
    removeCartItem(state, action: PayloadAction<{ productId: string }>) {
      state.items = state.items.filter(i => i.productId !== action.payload.productId);
      state.updatedAt = new Date().toISOString();
    },
    clearCart(state) {
      state.items = [];
      state.updatedAt = new Date().toISOString();
    },
  },
});

export const { addCartItem, updateCartItem, removeCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
