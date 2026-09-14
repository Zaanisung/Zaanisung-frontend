/**
 * In-memory demo backend.
 *
 * When VITE_DEMO_MODE=true the real `fetch` call in apiClient is replaced by
 * these handlers, so the whole frontend can be exercised end-to-end with
 * dummy data and every mutation (orders, inventory, profile, payments)
 * updates in-memory state for the session.
 *
 * Demo credentials:
 *   - Customer: any identifier/password → signed in as "Aisha Mohammed".
 *   - Admin (seller): any identifier containing "admin" (e.g. "admin@demo.de")
 *     logs in with the ADMIN role.
 */

import type { Address, PaymentMethod, FullUser, AppNotification } from "../../types";
import {
  seedProducts,
  seedFullUser,
  seedNotifications,
  seedOrders,
} from "./data";
import type { DemoProduct } from "./data";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const jitter = () => 140 + Math.round(Math.random() * 220);

class DemoError extends Error {
  statusCode: number;
  message: string;
  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
  }
}

// ─── In-memory state ──────────────────────────────────────────────────────
const products: DemoProduct[] = seedProducts();
const fullUser: FullUser = seedFullUser();
const notifications: AppNotification[] = seedNotifications();
const customerLookup = {
  _id: fullUser.id,
  name: fullUser.name,
  email: fullUser.email,
  phone: fullUser.phone,
};
const orders = seedOrders(fullUser);

interface DemoMovement {
  _id: string;
  product: { _id: string; name: string } | string;
  quantityChange: number;
  type: "RESTOCK" | "ONLINE_SALE" | "PHYSICAL_SALE" | "MANUAL_ADJUSTMENT" | "RETURN";
  reason?: string;
  reference?: string;
  createdAt: string;
}
const stockMovements: DemoMovement[] = [
  {
    _id: "demo-mv-1",
    product: { _id: "demo-p-1", name: "Noir Intense" },
    quantityChange: 10,
    type: "RESTOCK",
    reason: "Initial stock",
    createdAt: new Date(Date.now() - 6 * 86400000).toISOString(),
  },
  {
    _id: "demo-mv-2",
    product: { _id: "demo-p-3", name: "Sahara Nights" },
    quantityChange: -2,
    type: "ONLINE_SALE",
    reference: "ORD-1042",
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    _id: "demo-mv-3",
    product: { _id: "demo-p-4", name: "Golden Musk" },
    quantityChange: -1,
    type: "PHYSICAL_SALE",
    reference: "INV-001",
    createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

let seq = 3100;
const nextId = (prefix: string) => `${prefix}-${(seq++).toString(36).toUpperCase()}`;

// ─── Helpers ──────────────────────────────────────────────────────────────
function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

function authUserOf(user: FullUser, role: string) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    role,
  };
}

function findProduct(id: string): DemoProduct {
  const p = products.find((x) => x._id === id);
  if (!p) throw new DemoError(404, "Product not found.");
  return p;
}

function returnUser() {
  return { user: clone(fullUser) };
}

// ─── Router ───────────────────────────────────────────────────────────────
type Handler = (params: string[], body: Record<string, unknown>, query: URLSearchParams) => unknown;

interface Route {
  method: string;
  path: string[];
  handler: Handler;
}

const ROUTES: Route[] = [
  // ── Catalog ──────────────────────────────────────────────────────────
  {
    method: "GET",
    path: ["products"],
    handler: () => ({
      products: products
        .filter((p) => p.isActive)
        .map((p) => clone({ ...p, id: p._id })),
    }),
  },
  {
    method: "GET",
    path: ["products", ":id"],
    handler: ([id]) => ({ product: clone({ ...findProduct(id), id }) }),
  },
  {
    method: "POST",
    path: ["products"],
    handler: (_p, body) => {
      const name = String(body.name ?? "").trim();
      if (!name) throw new DemoError(400, "Product name is required.");
      const product: DemoProduct = {
        _id: nextId("DEMO-P"),
        name,
        description: typeof body.description === "string" ? body.description : undefined,
        price: Number(body.price) || 0,
        imageUrl: typeof body.imageUrl === "string" ? body.imageUrl : "",
        stock: Number(body.stock) || 0,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      products.unshift(product);
      return { product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "PATCH",
    path: ["products", ":id"],
    handler: ([id], body) => {
      const product = findProduct(id);
      if (typeof body.name === "string" && body.name.trim()) product.name = body.name.trim();
      if (typeof body.description === "string") product.description = body.description;
      if (typeof body.price === "number") product.price = body.price;
      if (typeof body.imageUrl === "string") product.imageUrl = body.imageUrl;
      if (typeof body.stock === "number") product.stock = Math.max(0, body.stock);
      if (typeof body.isActive === "boolean") product.isActive = body.isActive;
      product.updatedAt = new Date().toISOString();
      return { product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "DELETE",
    path: ["products", ":id"],
    handler: ([id]) => {
      const index = products.findIndex((x) => x._id === id);
      if (index === -1) throw new DemoError(404, "Product not found.");
      const [removed] = products.splice(index, 1);
      return { message: "Product removed.", product: clone({ ...removed, id: removed._id }) };
    },
  },

  // ── Auth ─────────────────────────────────────────────────────────────
  {
    method: "POST",
    path: ["auth", "register"],
    handler: () => ({
      user: authUserOf(fullUser, "CUSTOMER"),
    }),
  },
  {
    method: "POST",
    path: ["auth", "login"],
    handler: (_p, body) => {
      const identifier = String(body.identifier ?? "").toLowerCase();
      const role = identifier.includes("admin") ? "ADMIN" : "CUSTOMER";
      return { user: authUserOf(fullUser, role) };
    },
  },
  {
    method: "POST",
    path: ["auth", "logout"],
    handler: () => ({ message: "Logged out." }),
  },
  {
    method: "GET",
    path: ["auth", "me"],
    handler: () => ({ user: authUserOf(fullUser, fullUser.role) }),
  },
  {
    method: "PATCH",
    path: ["auth", "change-password"],
    handler: () => ({ message: "Password updated.", user: clone(fullUser) }),
  },

  // ── Profile / account ────────────────────────────────────────────────
  { method: "GET", path: ["me"], handler: () => returnUser() },
  {
    method: "PATCH",
    path: ["me"],
    handler: (_p, body) => {
      if (typeof body.name === "string" && body.name.trim()) fullUser.name = body.name.trim();
      if (typeof body.phone === "string") fullUser.phone = body.phone;
      if (typeof body.email === "string") fullUser.email = body.email;
      return returnUser();
    },
  },
  {
    method: "POST",
    path: ["me", "addresses"],
    handler: (_p, body) => {
      const address: Address = {
        _id: nextId("DEMO-A"),
        label: String(body.label ?? "Address"),
        recipientName: String(body.recipientName ?? fullUser.name),
        phone: String(body.phone ?? fullUser.phone ?? ""),
        streetAddress: String(body.streetAddress ?? ""),
        city: String(body.city ?? ""),
        region: String(body.region ?? "Northern"),
        digitalAddress: typeof body.digitalAddress === "string" ? body.digitalAddress : undefined,
        postalCode: typeof body.postalCode === "string" ? body.postalCode : undefined,
        landmark: typeof body.landmark === "string" ? body.landmark : undefined,
        isDefault: Boolean(body.isDefault) || fullUser.addresses.length === 0,
      };
      if (address.isDefault) fullUser.addresses.forEach((a) => (a.isDefault = false));
      fullUser.addresses.push(address);
      return returnUser();
    },
  },
  {
    method: "PATCH",
    path: ["me", "addresses", ":id"],
    handler: ([id], body) => {
      const address = fullUser.addresses.find((a) => a._id === id);
      if (!address) throw new DemoError(404, "Address not found.");
      if (typeof body.label === "string") address.label = body.label;
      if (typeof body.recipientName === "string") address.recipientName = body.recipientName;
      if (typeof body.phone === "string") address.phone = body.phone;
      if (typeof body.streetAddress === "string") address.streetAddress = body.streetAddress;
      if (typeof body.city === "string") address.city = body.city;
      if (typeof body.region === "string") address.region = body.region;
      if (typeof body.digitalAddress === "string") address.digitalAddress = body.digitalAddress;
      if (typeof body.postalCode === "string") address.postalCode = body.postalCode;
      if (typeof body.landmark === "string") address.landmark = body.landmark;
      return returnUser();
    },
  },
  {
    method: "DELETE",
    path: ["me", "addresses", ":id"],
    handler: ([id]) => {
      fullUser.addresses = fullUser.addresses.filter((a) => a._id !== id);
      return returnUser();
    },
  },
  {
    method: "PATCH",
    path: ["me", "addresses", ":id", "default"],
    handler: ([id]) => {
      fullUser.addresses.forEach((a) => (a.isDefault = a._id === id));
      return returnUser();
    },
  },
  {
    method: "POST",
    path: ["me", "payment-methods"],
    handler: (_p, body) => {
      const method: PaymentMethod = {
        _id: nextId("DEMO-PAY"),
        type: (body.type as PaymentMethod["type"]) || "MOBILE_MONEY",
        provider: String(body.provider ?? "MTN"),
        label: String(body.label ?? "Payment method"),
        details: (body.details as PaymentMethod["details"]) || {},
        isDefault: Boolean(body.isDefault) || fullUser.paymentMethods.length === 0,
      };
      if (method.isDefault) fullUser.paymentMethods.forEach((m) => (m.isDefault = false));
      fullUser.paymentMethods.push(method);
      return returnUser();
    },
  },
  {
    method: "PATCH",
    path: ["me", "payment-methods", ":id", "default"],
    handler: ([id]) => {
      fullUser.paymentMethods.forEach((m) => (m.isDefault = m._id === id));
      return returnUser();
    },
  },
  {
    method: "DELETE",
    path: ["me", "payment-methods", ":id"],
    handler: ([id]) => {
      fullUser.paymentMethods = fullUser.paymentMethods.filter((m) => m._id !== id);
      return returnUser();
    },
  },
  {
    method: "PATCH",
    path: ["me", "appearance"],
    handler: (_p, body) => {
      fullUser.appearance = {
        ...(fullUser.appearance || {}),
        accentColor: typeof body.accentColor === "string" ? body.accentColor : undefined,
      };
      return returnUser();
    },
  },
  {
    method: "PATCH",
    path: ["me", "preferences"],
    handler: (_p, body) => {
      fullUser.notificationPrefs = {
        orderUpdates: typeof body.orderUpdates === "boolean" ? body.orderUpdates : fullUser.notificationPrefs?.orderUpdates ?? true,
        promotions: typeof body.promotions === "boolean" ? body.promotions : fullUser.notificationPrefs?.promotions ?? false,
        sms: typeof body.sms === "boolean" ? body.sms : fullUser.notificationPrefs?.sms ?? true,
        email: typeof body.email === "boolean" ? body.email : fullUser.notificationPrefs?.email ?? true,
      };
      return returnUser();
    },
  },

  // ── Notifications ────────────────────────────────────────────────────
  { method: "GET", path: ["notifications"], handler: () => ({ notifications: clone(notifications) }) },
  {
    method: "PATCH",
    path: ["notifications", ":id", "read"],
    handler: ([id]) => {
      const notification = notifications.find((n) => n._id === id);
      if (!notification) throw new DemoError(404, "Notification not found.");
      notification.readAt = notification.readAt || new Date().toISOString();
      return { notification: clone(notification) };
    },
  },
  {
    method: "POST",
    path: ["notifications", "read-all"],
    handler: () => {
      notifications.forEach((n) => (n.readAt = n.readAt || new Date().toISOString()));
      return { message: "All notifications marked as read." };
    },
  },

  // ── Orders ───────────────────────────────────────────────────────────
  {
    method: "POST",
    path: ["orders"],
    handler: (_p, body) => {
      const productPayload = (body.products as { productId: string; quantity: number }[]) ?? [];
      if (productPayload.length === 0) throw new DemoError(400, "Your bag is empty.");

      const items = productPayload.map(({ productId, quantity }) => {
        const product = findProduct(productId);
        const qty = Math.min(Math.max(1, quantity), Math.max(0, product.stock));
        product.stock = Math.max(0, product.stock - qty);
        product.updatedAt = new Date().toISOString();
        stockMovements.unshift({
          _id: nextId("DEMO-MV"),
          product: { _id: product._id, name: product.name },
          quantityChange: -qty,
          type: "ONLINE_SALE",
          reference: nextId("ORD"),
          createdAt: new Date().toISOString(),
        });
        return { product: product._id, name: product.name, price: product.price, quantity: qty };
      });

      const reference = nextId("ORD");
      const order = {
        _id: reference,
        id: reference,
        items,
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        status: "PENDING" as const,
        source: "ONLINE" as const,
        customer: { ...customerLookup },
        delivery: {
          address: String((body.delivery as Record<string, unknown>)?.address ?? ""),
          city: String((body.delivery as Record<string, unknown>)?.city ?? ""),
          phone: String((body.delivery as Record<string, unknown>)?.phone ?? ""),
          digitalAddress: (body.delivery as Record<string, unknown>)?.digitalAddress as string | undefined,
        },
        payment: {
          method: String((body.payment as Record<string, unknown>)?.method ?? ""),
          reference: (body.payment as Record<string, unknown>)?.reference as string | undefined,
        },
        createdAt: new Date().toISOString(),
      };
      orders.unshift(order as (typeof orders)[number]);
      return { order: clone(order) };
    },
  },
  {
    method: "GET",
    path: ["orders"],
    handler: () => ({ orders: clone(orders) }),
  },
  {
    method: "GET",
    path: ["orders", ":id"],
    handler: ([id]) => {
      const order = orders.find((o) => o._id === id);
      if (!order) throw new DemoError(404, "Order not found.");
      return { order: clone(order) };
    },
  },

  // ── Admin / seller ───────────────────────────────────────────────────
  {
    method: "GET",
    path: ["admin", "orders"],
    handler: () => ({ orders: clone(orders) }),
  },
  {
    method: "PATCH",
    path: ["admin", "orders", ":id", "status"],
    handler: ([id], body) => {
      const order = orders.find((o) => o._id === id);
      if (!order) throw new DemoError(404, "Order not found.");
      order.status = (body.status as typeof order.status) ?? order.status;
      return { order: clone(order) };
    },
  },
  {
    method: "GET",
    path: ["admin", "dashboard"],
    handler: () => {
      const today = new Date().toDateString();
      return {
        totalProducts: products.length,
        lowStockCount: products.filter((p) => p.isActive && p.stock > 0 && p.stock <= 3).length,
        outOfStockCount: products.filter((p) => p.stock <= 0).length,
        todaysOrders: orders.filter((o) => new Date(o.createdAt).toDateString() === today).length,
        pendingOrders: orders.filter((o) => o.status === "PENDING").length,
        recentActivity: clone(stockMovements.slice(0, 6)),
      };
    },
  },
  {
    method: "POST",
    path: ["admin", "inventory", "restock"],
    handler: (_p, body) => {
      const product = findProduct(String(body.productId ?? ""));
      const quantity = Math.max(1, Number(body.quantity) || 0);
      product.stock += quantity;
      product.updatedAt = new Date().toISOString();
      stockMovements.unshift({
        _id: nextId("DEMO-MV"),
        product: { _id: product._id, name: product.name },
        quantityChange: quantity,
        type: "RESTOCK",
        reason: "Restock from supplier",
        createdAt: new Date().toISOString(),
      });
      return { message: "Stock restocked.", product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "POST",
    path: ["admin", "inventory", "record-sale"],
    handler: (_p, body) => {
      const product = findProduct(String(body.productId ?? ""));
      const quantity = Math.max(1, Number(body.quantity) || 0);
      if (product.stock < quantity) throw new DemoError(400, "Not enough stock for this sale.");
      product.stock -= quantity;
      product.updatedAt = new Date().toISOString();
      stockMovements.unshift({
        _id: nextId("DEMO-MV"),
        product: { _id: product._id, name: product.name },
        quantityChange: -quantity,
        type: "PHYSICAL_SALE",
        reference: String(body.reference ?? "INV"),
        createdAt: new Date().toISOString(),
      });
      return { message: "Sale recorded.", product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "POST",
    path: ["admin", "inventory", "adjust"],
    handler: (_p, body) => {
      const product = findProduct(String(body.productId ?? ""));
      const change = Math.trunc(Number(body.quantity) || 0);
      product.stock = Math.max(0, product.stock + change);
      product.updatedAt = new Date().toISOString();
      stockMovements.unshift({
        _id: nextId("DEMO-MV"),
        product: { _id: product._id, name: product.name },
        quantityChange: change,
        type: "MANUAL_ADJUSTMENT",
        reason: String(body.reason ?? ""),
        createdAt: new Date().toISOString(),
      });
      return { message: "Stock adjusted.", product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "GET",
    path: ["admin", "inventory", "history"],
    handler: (_p, _b, query) => {
      const productId = query.get("productId");
      const list = productId
        ? stockMovements.filter((m) =>
            typeof m.product !== "string"
              ? m.product._id === productId
              : m.product === productId
          )
        : stockMovements;
      return { movements: clone(list) };
    },
  },

  // ── Payments (always dummy) ──────────────────────────────────────────
  {
    method: "POST",
    path: ["payments", "initialize"],
    handler: () => ({
      reference: nextId("DEMO-PAYSTACK"),
      authorization_url: "https://paystack.test/checkout/demo",
      dummy: true,
      payment: "TEST",
    }),
  },
  {
    method: "POST",
    path: ["payments", "verify"],
    handler: () => ({ status: "SUCCESS", dummy: true }),
  },
];

function matchRoute(method: string, pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  for (const route of ROUTES) {
    if (route.method !== method || route.path.length !== segments.length) continue;
    const params: string[] = [];
    let ok = true;
    for (let i = 0; i < route.path.length; i++) {
      const spec = route.path[i];
      if (spec.startsWith(":")) params.push(segments[i]);
      else if (spec !== segments[i]) {
        ok = false;
        break;
      }
    }
    if (ok) return { handler: route.handler, params };
  }
  return null;
}

/**
 * Handle a request when demo mode is enabled. Mirrors the shape the real
 * backend returns but never touches the network. Unknown endpoints throw a
 * 404 just like a real HTTP client would expect.
 */
export async function demoRequest<T>(
  path: string,
  options: RequestInit = {},
  base?: string
): Promise<T> {
  await wait(jitter());

  const url = new URL(path, base || "http://demo.local");
  const matched = matchRoute((options.method || "GET").toUpperCase(), url.pathname);
  if (!matched) {
    throw new DemoError(404, `Demo mode: no mock for ${options.method || "GET"} ${url.pathname}`);
  }

  let body: Record<string, unknown> = {};
  if (typeof options.body === "string") {
    try {
      body = JSON.parse(options.body);
    } catch {
      /* ignore malformed bodies in demo mode */
    }
  }

  const result = await matched.handler(matched.params, body, url.searchParams);
  return result as T;
}