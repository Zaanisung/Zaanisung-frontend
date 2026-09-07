import { request } from "./apiClient";

export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  customer: string | { _id: string; name: string; email?: string; phone?: string };
  items: OrderItem[];
  total: number;
  delivery: {
    address: string;
    city: string;
    phone: string;
    digitalAddress?: string;
  };
  payment: {
    method: string;
    reference?: string;
  };
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export async function placeOrder(data: {
  products: { productId: string; quantity: number }[];
  delivery: { address: string; city: string; phone: string; digitalAddress?: string };
  payment: { method: string; reference?: string };
}): Promise<{ order: Order }> {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyOrders(): Promise<{ orders: Order[] }> {
  return request("/orders");
}

export async function getMyOrder(id: string): Promise<{ order: Order }> {
  return request(`/orders/${id}`);
}