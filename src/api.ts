const API_BASE = "/api";

export function getErrorMessage(err: unknown, fallback: string): string {
  if (typeof err === "object" && err !== null && "message" in err) {
    const m = (err as { message?: unknown }).message;
    if (typeof m === "string" && m) return m;
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const data = await res.json();

  if (!res.ok) {
    throw { statusCode: res.status, message: data.message || "Request failed" };
  }

  return data as T;
}

// ─── Auth ────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: "CUSTOMER" | "ADMIN";
}

export async function registerUser(data: {
  name: string;
  email?: string;
  phone?: string;
  password: string;
}): Promise<{ user: AuthUser }> {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function loginUser(
  identifier: string,
  password: string
): Promise<{ user: AuthUser }> {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, password }),
  });
}

export async function logoutUser(): Promise<{ message: string }> {
  return request("/auth/logout", { method: "POST" });
}

export async function getMe(): Promise<{ user: AuthUser }> {
  return request("/auth/me");
}

// ─── Products ────────────────────────────────────────────────────────

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

// ─── Orders ──────────────────────────────────────────────────────────

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
  delivery: { address: string; city: string; phone: string };
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

// ─── Admin Orders ────────────────────────────────────────────────────

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

// ─── Admin Inventory ─────────────────────────────────────────────────

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

// ─── Admin Dashboard ─────────────────────────────────────────────────

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
