export type Product = {
  _id: string;
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};

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

export type CustomerUser = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role?: string;
};

export type CustomerTab = "shop" | "orders" | "cart" | "account";
export type AdminTab = "dashboard" | "inventory" | "orders" | "account";

export type AppView =
  | { type: "landing" }
  | { type: "customer"; page: "login" }
  | { type: "customer"; page: "register" }
  | { type: "customer"; page: "shop" }
  | { type: "customer"; page: "product-details"; productId: string }
  | { type: "customer"; page: "cart" }
  | { type: "customer"; page: "checkout" }
  | { type: "customer"; page: "order-confirmation"; orderId: string }
  | { type: "customer"; page: "orders" }
  | { type: "customer"; page: "account" }
  | { type: "admin"; page: "login" }
  | { type: "admin"; page: "dashboard" }
  | { type: "admin"; page: "inventory" }
  | { type: "admin"; page: "add-product" }
  | { type: "admin"; page: "edit-product"; productId: string }
  | { type: "admin"; page: "record-sale"; initialProductId?: string }
  | { type: "admin"; page: "restock"; initialProductId?: string }
  | { type: "admin"; page: "orders" }
  | { type: "admin"; page: "account" };
