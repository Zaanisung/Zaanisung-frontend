import { request } from "./apiClient";
import type { Product } from "./product.service";

export interface StockMovement {
  _id: string;
  product: { _id: string; name: string } | string;
  quantityChange: number;
  type: "RESTOCK" | "ONLINE_SALE" | "PHYSICAL_SALE" | "MANUAL_ADJUSTMENT" | "RETURN";
  reason?: string;
  reference?: string;
  createdAt: string;
}

export async function restockProduct(
  productId: string,
  quantity: number
): Promise<{ message: string; product: Product }> {
  return request("/admin/inventory/restock", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function recordPhysicalSale(
  productId: string,
  quantity: number
): Promise<{ message: string; product: Product }> {
  return request("/admin/inventory/record-sale", {
    method: "POST",
    body: JSON.stringify({ productId, quantity }),
  });
}

export async function adjustStock(
  productId: string,
  quantity: number,
  reason: string
): Promise<{ message: string; product: Product }> {
  return request("/admin/inventory/adjust", {
    method: "POST",
    body: JSON.stringify({ productId, quantity, reason }),
  });
}

export async function getStockHistory(
  productId?: string
): Promise<{ movements: StockMovement[] }> {
  const query = productId ? `?productId=${productId}` : "";
  return request(`/admin/inventory/history${query}`);
}