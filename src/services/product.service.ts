import { request } from "./apiClient";

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getProducts(): Promise<{ products: Product[] }> {
  return request("/products");
}

export async function getProduct(id: string): Promise<{ product: Product }> {
  return request(`/products/${id}`);
}

export async function createProduct(data: {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  stock: number;
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