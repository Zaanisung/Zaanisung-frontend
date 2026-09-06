export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  productId?: string;
  product?: string;
};

export type OrderStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export type OrderSource = "ONLINE" | "PHYSICAL";

export type Order = {
  _id: string;
  id: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  source?: OrderSource;
  createdAt?: string;
  customer?: { _id: string; name: string; email?: string; phone?: string } | string;
  delivery?: {
    address: string;
    city: string;
    phone: string;
  };
  payment?: {
    method: string;
    reference?: string;
  };
  // Flat convenience fields for backward-compatible rendering
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  paymentMethod?: string;
};