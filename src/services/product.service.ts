import { request } from "./apiClient";
import type { ImageStandardization } from "../types/product";

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
  imageStandardization?: ImageStandardization;
  createdAt: string;
  updatedAt: string;
}

export async function getProducts(opts?: {
  page?: number;
  limit?: number;
}): Promise<{
  products: Product[];
  pagination?: { total: number; page: number; limit: number; totalPages: number };
}> {
  const query = new URLSearchParams();
  if (opts?.page) query.set("page", String(opts.page));
  if (opts?.limit) query.set("limit", String(opts.limit));
  const qs = query.toString();
  return request(`/products${qs ? `?${qs}` : ""}`);
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  originalImageUrl?: string;
}): Promise<{ product: Product }> {
  return request("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateProduct(
  id: string,
  data: Partial<{ name: string; description: string | null; price: number; imageUrl: string | null; stock: number; isActive: boolean }>
): Promise<{ product: Product }> {
  return request(`/products/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProduct(
  id: string
): Promise<{ message: string; product: Product }> {
  return request(`/products/${id}`, { method: "DELETE" });
}

// ─── Admin AI product-image standardization ────────────────────────────

/**
 * Whether the backend has AI image standardization configured. When disabled
 * the admin forms simply hide the "standardize with AI" control.
 */
export async function getAiImageStatus(): Promise<{ enabled: boolean }> {
  return request("/admin/ai-image/status");
}

/**
 * Standardize a standalone image (used by the add-product form, where the
 * product doesn't exist yet). Returns the generated candidate data URL.
 */
export async function standardizeImage(
  imageUrl: string
): Promise<{ imageUrl: string }> {
  return request("/admin/ai-image/standardize", {
    method: "POST",
    body: JSON.stringify({ imageUrl }),
  });
}

/** Generate a candidate for an existing product. */
export async function standardizeProductImage(
  productId: string,
  imageUrl?: string
): Promise<{ product: Product }> {
  return request(`/admin/ai-image/products/${productId}/standardize`, {
    method: "POST",
    body: JSON.stringify(imageUrl ? { imageUrl } : {}),
  });
}

/** Approve the latest candidate; it becomes the product's live image. */
export async function approveProductImage(
  productId: string
): Promise<{ product: Product }> {
  return request(`/admin/ai-image/products/${productId}/approve`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

/** Reject the latest candidate; the current image stays untouched. */
export async function rejectProductImage(
  productId: string
): Promise<{ product: Product }> {
  return request(`/admin/ai-image/products/${productId}/reject`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}