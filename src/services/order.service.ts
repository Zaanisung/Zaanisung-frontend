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
    recipientName?: string;
    digitalAddress?: string;
  };
  payment: {
    method: string;
    reference?: string;
    momoNumber?: string;
    momoNetwork?: string;
    email?: string;
  };
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export async function placeOrder(data: {
  products: { productId: string; quantity: number }[];
  delivery: { address: string; city: string; phone: string; recipientName?: string; digitalAddress?: string };
  payment: { method: string; reference?: string; momoNumber?: string; momoNetwork?: string; email?: string };
}): Promise<{ order: Order }> {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getMyOrders(opts?: {
  page?: number;
  limit?: number;
}): Promise<{
  orders: Order[];
  pagination?: { total: number; page: number; limit: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (opts?.page) query.set("page", String(opts.page));
  if (opts?.limit) query.set("limit", String(opts.limit));
  const qs = query.toString();
  return request(`/orders${qs ? `?${qs}` : ""}`);
}