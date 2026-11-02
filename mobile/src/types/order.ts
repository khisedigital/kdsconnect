import type { Id, Money } from './common';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  id: Id;
  productId: Id;
  productName: string;
  quantity: number;
  unitPrice: Money;
  lineTotal: Money;
}

export interface Order {
  id: Id;
  retailerId: Id;
  supplierId: Id;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: Money;
  shipping?: Money;
  total: Money;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: Id;
  quantity: number;
  unitPrice: Money;
  productName: string;
}

export interface Cart {
  items: CartItem[];
  updatedAt: string;
}
