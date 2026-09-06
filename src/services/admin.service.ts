import { request } from "./apiClient";
import type { Order } from "./order.service";
import type { StockMovement } from "./inventory.service";

export async function getAllOrders(): Promise<{ orders: Order[] }> {
  return request("/admin/orders");
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

export interface DashboardData {
  totalProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  todaysOrders: number;
  pendingOrders: number;
  recentActivity: StockMovement[];
}

export async function getDashboard(): Promise<DashboardData> {
  return request("/admin/dashboard");
}