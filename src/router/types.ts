import type { OrderItem } from "../types";

export interface PlaceOrderData {
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryCity: string;
  digitalAddress?: string;
  paymentMethod: string;
  /** Reference returned by initializePayment when checkout used Paystack. */
  paymentReference?: string;
  momoNumber?: string;
  momoNetwork?: string;
  /** Billing email for card receipts. */
  billingEmail?: string;
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
  /**
   * When the product is created from an AI-standardized image, this is the
   * pre-standardization upload (preserved server-side as the "original").
   */
  originalImageUrl?: string;
}