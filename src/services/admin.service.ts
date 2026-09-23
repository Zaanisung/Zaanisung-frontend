import { request } from "./apiClient";
import type { Order } from "./order.service";
import type { AdminUser } from "../types";

export async function getAllOrders(opts?: {
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
  return request(`/admin/orders${qs ? `?${qs}` : ""}`);
}

export async function updateOrderStatus(
  id: string,
  status: string
): Promise<{ order: Order }> {
  return request(`/admin/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function getAllUsers(opts?: {
  page?: number;
  limit?: number;
}): Promise<{
  users: AdminUser[];
  pagination?: { total: number; page: number; limit: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (opts?.page) query.set("page", String(opts.page));
  if (opts?.limit) query.set("limit", String(opts.limit));
  const qs = query.toString();
  return request(`/admin/users${qs ? `?${qs}` : ""}`);
}

export async function deleteUser(id: string): Promise<{ message: string }> {
  return request(`/admin/users/${id}`, { method: "DELETE" });
}