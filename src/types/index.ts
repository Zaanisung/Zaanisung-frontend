export type FragranceFamily = 
  | 'Woody & Oriental'
  | 'Amber & Warm'
  | 'Fresh & Citrus'
  | 'Floral & Delicate'
  | 'Gourmand & Spice';

export interface OlfactoryNotes {
  top: string[];
  heart: string[];
  base: string[];
}

export interface BottleVariant {
  size: '50ml' | '100ml' | '200ml';
  price: number;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  brand: string;
  family: FragranceFamily;
  concentration: 'Extrait de Parfum' | 'Eau de Parfum';
  price: number; // Base price for default size (usually 100ml)
  sizes: BottleVariant[];
  stock: number; // Overall available stock
  description: string;
  story?: string;
  notes: OlfactoryNotes;
  image: string;
  secondaryImage?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  origin?: string;
}

export interface CartItem {
  id: string; // unique item key: productId-size
  productId: string;
  product: Product;
  size: '50ml' | '100ml' | '200ml';
  quantity: number;
  unitPrice: number;
}

export interface Address {
  id: string;
  label: string; // e.g. "Home", "Office - Airport City"
  fullName: string;
  phone: string;
  street: string;
  city: string;
  region: string; // Greater Accra, Ashanti, Western, etc.
  additionalNotes?: string;
  isDefault: boolean;
}

export type PaymentMethod = 'paystack' | 'mobile_money' | 'card_on_delivery';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type FulfillmentStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  name: string;
  size: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  image: string;
}

export interface Order {
  id: string;
  reference: string; // e.g. ZAA-2026-8941
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  shippingAddress: Address;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  trackingNumber?: string;
  deliveryEstimatedDate?: string;
  paystackReference?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'admin';
  createdAt: string;
  addresses: Address[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'order' | 'account' | 'boutique';
  actionUrl?: string;
}

export interface AdminStats {
  grossSalesGHS: number;
  ordersCount: number;
  pendingOrdersCount: number;
  lowStockItemsCount: number;
  customersCount: number;
}
