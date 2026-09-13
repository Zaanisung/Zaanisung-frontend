import type { OrderItem } from "../types";

export interface PlaceOrderData {
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  digitalAddress?: string;
  paymentMethod: string;
  /** Reference returned by initializePayment when checkout used Paystack. */
  paymentReference?: string;
}

export interface PhysicalSaleData {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  paymentMethod: string;
}

export interface NewProductData {
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  stock: number;
}