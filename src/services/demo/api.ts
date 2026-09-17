/**
 * Persisted demo backend.
 *
 * When VITE_DEMO_MODE=true the real `fetch` call in apiClient is replaced by
 * these handlers, so the whole frontend can be exercised end-to-end with dummy
 * data. Unlike the earlier in-memory implementation, the entire "database" is
 * stored in localStorage:
 *
 *  - accounts created through Registration persist across reloads,
 *  - sign-in/sign-out creates and clears a real demo session,
 *  - product edits, orders, stock movements and profile changes survive
 *    reloads, exactly like a real backend would.
 *
 * There is NO automatic account: everyone starts signed out on the landing
 * page. Use the one-tap "demo account" button (rich showcase customer) or
 * register your own account. Admin login uses the seeded seller account:
 *   admin@zaanisung.demo / Admin@12345
 */

import type { Address, PaymentMethod, AppNotification, AdminUser } from "../../types";
import {
  seedProducts,
  seedShowcaseAccount,
  seedAdminAccount,
  seedAdminCustomers,
  seedNotifications,
  seedOrders,
  createEmptyProfile,
  standardizedPlaceholder,
} from "./data";
import type { DemoAccount, DemoOrder, DemoProduct } from "./data";

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

// ─── localStorage persistence ──────────────────────────────────────────────
const DB_KEY = "zaanisung-demo-db-v1";
const SESSION_KEY = "zaanisung-demo-session-v1";

interface DemoMovement {
  _id: string;
  product: { _id: string; name: string } | string;
  quantityChange: number;
  type: "RESTOCK" | "ONLINE_SALE" | "PHYSICAL_SALE" | "MANUAL_ADJUSTMENT" | "RETURN";
  reason?: string;
  reference?: string;
  createdAt: string;
}

interface DemoDb {
  version: 1;
  seq: number;
  products: DemoProduct[];
  accounts: DemoAccount[];
  customers: AdminUser[];
  orders: DemoOrder[];
  notifications: AppNotification[];
  movements: DemoMovement[];
}

function seedDb(): DemoDb {
  const showcase = seedShowcaseAccount();
  const admin = seedAdminAccount();
  const showcaseCustomer = {
    _id: showcase.id,
    name: showcase.name,
    email: showcase.email,
    phone: showcase.phone,
  };
  return {
    version: 1,
    seq: 3100,
    products: seedProducts(),
    accounts: [showcase, admin],
    customers: seedAdminCustomers(),
    orders: seedOrders(showcaseCustomer),
    notifications: seedNotifications(showcase.id),
    movements: [
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
    ],
  };
}

function readStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* storage unavailable — carry on in memory */
  }
}

function loadDb(): DemoDb {
  const raw = readStorage(DB_KEY);
  if (!raw) return seedDb();
  try {
    const parsed = JSON.parse(raw) as DemoDb;
    if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.accounts)) return seedDb();
    return parsed;
  } catch {
    return seedDb();
  }
}

// Eagerly load so mutations affect a stable singleton across the session.
const db = loadDb();

function saveDb(): void {
  writeStorage(DB_KEY, JSON.stringify(db));
}

let sessionUserId: string | null = readStorage(SESSION_KEY);
treeShakeSession();

function treeShakeSession(): void {
  if (sessionUserId && !db.accounts.some((a) => a.id === sessionUserId)) {
    sessionUserId = null;
  }
}

function setSession(userId: string | null): void {
  sessionUserId = userId;
  if (userId) writeStorage(SESSION_KEY, userId);
  else {
    try { window.localStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
  }
  if (userId && !db.accounts.some((a) => a.id === userId)) {
    db.accounts.push(accountsFromUserId(userId));
    saveDb();
  }
}

function accountsFromUserId(userId: string | null): DemoAccount {
  const showcase = seedShowcaseAccount();
  if (userId === "demo-customer-1" || userId === showcase.id) return showcase;
  const admin = seedAdminAccount();
  if (userId === "demo-admin-1" || userId === admin.id) return admin;
  throw new Error(`Unknown demo account: ${userId}`);
}

const nextId = (prefix: string) => `${prefix}-${(db.seq++).toString(36).toUpperCase()}`;

// ─── Session / auth helpers ────────────────────────────────────────────────
function requireSession(): DemoAccount {
  const account = db.accounts.find((a) => a.id === sessionUserId);
  if (!account) throw new DemoError(401, "Not signed in.");
  return account;
}

function requireAdmin(): DemoAccount {
  const account = requireSession();
  if (account.role !== "ADMIN") throw new DemoError(403, "Admin access required.");
  return account;
}

function authUserOf(account: DemoAccount) {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    phone: account.phone,
    role: account.role,
  };
}

function findProduct(id: string): DemoProduct {
  const p = db.products.find((x) => x._id === id);
  if (!p) throw new DemoError(404, "Product not found.");
  return p;
}

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function orderOf(o: DemoOrder): DemoOrder {
  return clone(o);
}

function accountOf(account: DemoAccount) {
  return clone(account.profile);
}

function matchAccount(account: DemoAccount, raw: string): boolean {
  const q = raw.trim().toLowerCase();
  if (!q) return false;
  return (
    account.email?.toLowerCase() === q ||
    account.phone?.replace(/[\s-]/g, "") === q.replace(/[\s-]/g, "")
  );
}

// ─── Router ───────────────────────────────────────────────────────────────
type Handler = (params: string[], body: Record<string, unknown>, query: URLSearchParams) => unknown;

interface Route {
  method: string;
  path: string[];
  handler: Handler;
}

const ROUTES: Route[] = [
  // ── Catalog (public) ──────────────────────────────────────────────────
  {
    method: "GET",
    path: ["products"],
    handler: () => ({
      products: db.products
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
      requireAdmin();
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
      db.products.unshift(product);
      saveDb();
      return { product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "PATCH",
    path: ["products", ":id"],
    handler: ([id], body) => {
      requireAdmin();
      const product = findProduct(id);
      if (typeof body.name === "string" && body.name.trim()) product.name = body.name.trim();
      if (typeof body.description === "string") product.description = body.description;
      if (typeof body.price === "number") product.price = body.price;
      if (typeof body.imageUrl === "string") product.imageUrl = body.imageUrl;
      if (typeof body.stock === "number") product.stock = Math.max(0, body.stock);
      if (typeof body.isActive === "boolean") product.isActive = body.isActive;
      product.updatedAt = new Date().toISOString();
      saveDb();
      return { product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "DELETE",
    path: ["products", ":id"],
    handler: ([id]) => {
      requireAdmin();
      const index = db.products.findIndex((x) => x._id === id);
      if (index === -1) throw new DemoError(404, "Product not found.");
      const [removed] = db.products.splice(index, 1);
      saveDb();
      return { message: "Product removed.", product: clone({ ...removed, id: removed._id }) };
    },
  },

  // ── Admin: AI product-image standardization ──────────────────────────
  // Demo mode simulates the real OpenAI workflow locally with a deterministic
  // "standardized" placeholder, so the approve / reject / regenerate flow can
  // be exercised end-to-end without any API key.
  {
    method: "GET",
    path: ["admin", "ai-image", "status"],
    handler: () => requireAdmin() && { enabled: true },
  },
  {
    method: "POST",
    path: ["admin", "ai-image", "standardize"],
    handler: (_p, body) => {
      requireAdmin();
      if (typeof body.imageUrl !== "string" || !body.imageUrl) {
        throw new DemoError(400, "A valid image URL is required.");
      }
      return { imageUrl: standardizedPlaceholder("Zaanisung") };
    },
  },
  {
    method: "POST",
    path: ["admin", "ai-image", "products", ":id", "standardize"],
    handler: ([id], body) => {
      requireAdmin();
      const product = findProduct(id);
      const requested = typeof body.imageUrl === "string" ? body.imageUrl : product.imageUrl;
      const prev = product.imageStandardization;
      product.imageStandardization = {
        status: "needs_review",
        originalImageUrl: prev?.originalImageUrl ?? requested,
        generatedImageUrl: standardizedPlaceholder(product.name),
        approvedImageUrl: prev?.approvedImageUrl ?? null,
        requestedImageUrl: requested,
        lastError: null,
        updatedAt: new Date().toISOString(),
      };
      product.updatedAt = new Date().toISOString();
      saveDb();
      return { product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "POST",
    path: ["admin", "ai-image", "products", ":id", "approve"],
    handler: ([id]) => {
      requireAdmin();
      const product = findProduct(id);
      const state = product.imageStandardization;
      const candidate = state?.generatedImageUrl;
      if (state?.status !== "needs_review" || !candidate) {
        throw new DemoError(400, "No AI-generated image is awaiting approval.");
      }
      product.imageUrl = candidate;
      product.imageStandardization = {
        status: "approved",
        originalImageUrl: state?.originalImageUrl ?? product.imageUrl,
        generatedImageUrl: candidate,
        approvedImageUrl: candidate,
        requestedImageUrl: state?.requestedImageUrl ?? null,
        lastError: null,
        updatedAt: new Date().toISOString(),
      };
      product.updatedAt = new Date().toISOString();
      saveDb();
      return { product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "POST",
    path: ["admin", "ai-image", "products", ":id", "reject"],
    handler: ([id]) => {
      requireAdmin();
      const product = findProduct(id);
      const state = product.imageStandardization;
      if (state?.status !== "needs_review" || !state.generatedImageUrl) {
        throw new DemoError(400, "No AI-generated image is awaiting review.");
      }
      product.imageStandardization = {
        ...state,
        status: "rejected",
        lastError: null,
        updatedAt: new Date().toISOString(),
      };
      product.updatedAt = new Date().toISOString();
      saveDb();
      return { product: clone({ ...product, id: product._id }) };
    },
  },

  // ── Auth ─────────────────────────────────────────────────────────────
  {
    method: "POST",
    path: ["auth", "register"],
    handler: (_p, body) => {
      const name = String(body.name ?? "").trim();
      const password = String(body.password ?? "");
      if (!name) throw new DemoError(400, "Please enter your full name.");
      if (password.length < 8) throw new DemoError(400, "Password must be at least 8 characters.");

      const email = typeof body.email === "string" ? body.email.trim() : undefined;
      const phone = typeof body.phone === "string" ? body.phone.trim() : undefined;
      if (email || phone) {
        const conflict = db.accounts.some((a) =>
          (email && a.email?.toLowerCase() === email.toLowerCase()) ||
          (phone && matchAccount(a, phone))
        );
        if (conflict) {
          throw new DemoError(409, "An account with that email or phone already exists.");
        }
      }

      const account: DemoAccount = {
        id: nextId("DEMO-U"),
        name,
        email,
        phone,
        password,
        role: "CUSTOMER",
        createdAt: new Date().toISOString(),
        profile: createEmptyProfile({
          id: nextId("DEMO-U"),
          name,
          email,
          phone,
          role: "CUSTOMER",
        }),
      };
      account.profile.id = account.id;
      db.accounts.push(account);
      saveDb();
      setSession(account.id);
      return { user: authUserOf(account) };
    },
  },
  {
    method: "POST",
    path: ["auth", "login"],
    handler: (_p, body) => {
      const identifier = String(body.identifier ?? "").trim();
      const password = String(body.password ?? "");
      if (!identifier || !password) throw new DemoError(400, "Please enter your email/phone and password.");
      const account = db.accounts.find((a) => matchAccount(a, identifier));
      if (!account || account.password !== password) {
        throw new DemoError(401, "Invalid credentials. Please try again.");
      }
      setSession(account.id);
      return { user: authUserOf(account) };
    },
  },
  {
    method: "POST",
    path: ["auth", "demo"],
    handler: (_p, body) => {
      const role = String(body.role ?? "CUSTOMER");
      if (role === "ADMIN") {
        let admin = db.accounts.find((a) => a.role === "ADMIN");
        if (!admin) {
          admin = seedAdminAccount();
          db.accounts.push(admin);
          saveDb();
        }
        setSession(admin.id);
        return { user: authUserOf(admin) };
      }
      let showcase = db.accounts.find((a) => a.id === "demo-customer-1");
      if (!showcase) {
        showcase = seedShowcaseAccount();
        db.accounts.push(showcase);
        db.orders.unshift(...seedOrders({ _id: showcase.id, name: showcase.name, email: showcase.email, phone: showcase.phone }));
        saveDb();
      }
      setSession(showcase.id);
      return { user: authUserOf(showcase) };
    },
  },
  {
    method: "POST",
    path: ["auth", "logout"],
    handler: () => {
      setSession(null);
      return { message: "Logged out." };
    },
  },
  {
    method: "GET",
    path: ["auth", "me"],
    handler: () => ({ user: authUserOf(requireSession()) }),
  },
  {
    method: "PATCH",
    path: ["auth", "change-password"],
    handler: (_p, body) => {
      const account = requireSession();
      const current = String(body.currentPassword ?? "");
      if (current && account.password !== current) {
        throw new DemoError(400, "Your current password is incorrect.");
      }
      const nextPassword = String(body.newPassword ?? "");
      if (nextPassword.length < 8) throw new DemoError(400, "New password must be at least 8 characters.");
      account.password = nextPassword;
      saveDb();
      return { message: "Password updated.", user: clone(account.profile) };
    },
  },

  // ── Profile / account (session-scoped) ────────────────────────────────
  { method: "GET", path: ["me"], handler: () => ({ user: accountOf(requireSession()) }) },
  {
    method: "PATCH",
    path: ["me"],
    handler: (_p, body) => {
      const account = requireSession();
      if (typeof body.name === "string" && body.name.trim()) {
        account.name = body.name.trim();
        account.profile.name = account.name;
      }
      if (typeof body.phone === "string") {
        account.phone = body.phone;
        account.profile.phone = account.phone;
      }
      if (typeof body.email === "string") {
        account.email = body.email;
        account.profile.email = account.email;
      }
      saveDb();
      return { user: accountOf(account) };
    },
  },
  {
    method: "POST",
    path: ["me", "addresses"],
    handler: (_p, body) => {
      const account = requireSession();
      const profile = account.profile;
      const address: Address = {
        _id: nextId("DEMO-A"),
        label: String(body.label ?? "Address"),
        recipientName: String(body.recipientName ?? account.name),
        phone: String(body.phone ?? account.phone ?? ""),
        streetAddress: String(body.streetAddress ?? ""),
        city: String(body.city ?? ""),
        region: String(body.region ?? "Northern"),
        digitalAddress: typeof body.digitalAddress === "string" ? body.digitalAddress : undefined,
        postalCode: typeof body.postalCode === "string" ? body.postalCode : undefined,
        landmark: typeof body.landmark === "string" ? body.landmark : undefined,
        isDefault: Boolean(body.isDefault) || profile.addresses.length === 0,
      };
      if (address.isDefault) profile.addresses.forEach((a) => (a.isDefault = false));
      profile.addresses.push(address);
      saveDb();
      return { user: accountOf(account) };
    },
  },
  {
    method: "PATCH",
    path: ["me", "addresses", ":id"],
    handler: ([id], body) => {
      const account = requireSession();
      const address = account.profile.addresses.find((a) => a._id === id);
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
      saveDb();
      return { user: accountOf(account) };
    },
  },
  {
    method: "DELETE",
    path: ["me", "addresses", ":id"],
    handler: ([id]) => {
      const account = requireSession();
      account.profile.addresses = account.profile.addresses.filter((a) => a._id !== id);
      saveDb();
      return { user: accountOf(account) };
    },
  },
  {
    method: "PATCH",
    path: ["me", "addresses", ":id", "default"],
    handler: ([id]) => {
      const account = requireSession();
      account.profile.addresses.forEach((a) => (a.isDefault = a._id === id));
      saveDb();
      return { user: accountOf(account) };
    },
  },
  {
    method: "POST",
    path: ["me", "payment-methods"],
    handler: (_p, body) => {
      const account = requireSession();
      const profile = account.profile;
      const method: PaymentMethod = {
        _id: nextId("DEMO-PAY"),
        type: (body.type as PaymentMethod["type"]) || "MOBILE_MONEY",
        provider: String(body.provider ?? "MTN"),
        label: String(body.label ?? "Payment method"),
        details: (body.details as PaymentMethod["details"]) || {},
        isDefault: Boolean(body.isDefault) || profile.paymentMethods.length === 0,
      };
      if (method.isDefault) profile.paymentMethods.forEach((m) => (m.isDefault = false));
      profile.paymentMethods.push(method);
      saveDb();
      return { user: accountOf(account) };
    },
  },
  {
    method: "PATCH",
    path: ["me", "payment-methods", ":id", "default"],
    handler: ([id]) => {
      const account = requireSession();
      account.profile.paymentMethods.forEach((m) => (m.isDefault = m._id === id));
      saveDb();
      return { user: accountOf(account) };
    },
  },
  {
    method: "DELETE",
    path: ["me", "payment-methods", ":id"],
    handler: ([id]) => {
      const account = requireSession();
      account.profile.paymentMethods = account.profile.paymentMethods.filter((m) => m._id !== id);
      saveDb();
      return { user: accountOf(account) };
    },
  },
  {
    method: "PATCH",
    path: ["me", "appearance"],
    handler: (_p, body) => {
      const account = requireSession();
      account.profile.appearance = {
        ...(account.profile.appearance || {}),
        accentColor: typeof body.accentColor === "string" ? body.accentColor : undefined,
      };
      saveDb();
      return { user: accountOf(account) };
    },
  },
  {
    method: "PATCH",
    path: ["me", "preferences"],
    handler: (_p, body) => {
      const account = requireSession();
      account.profile.notificationPrefs = {
        orderUpdates: typeof body.orderUpdates === "boolean" ? body.orderUpdates : account.profile.notificationPrefs?.orderUpdates ?? true,
        promotions: typeof body.promotions === "boolean" ? body.promotions : account.profile.notificationPrefs?.promotions ?? false,
        sms: typeof body.sms === "boolean" ? body.sms : account.profile.notificationPrefs?.sms ?? true,
        email: typeof body.email === "boolean" ? body.email : account.profile.notificationPrefs?.email ?? true,
      };
      saveDb();
      return { user: accountOf(account) };
    },
  },

  // ── Notifications (session-scoped) ───────────────────────────────────
  {
    method: "GET",
    path: ["notifications"],
    handler: () => {
      const account = requireSession();
      const owned = db.notifications.filter((n) => !n.data?.userId || n.data.userId === account.id);
      return { notifications: clone(owned) };
    },
  },
  {
    method: "PATCH",
    path: ["notifications", ":id", "read"],
    handler: ([id]) => {
      requireSession();
      const notification = db.notifications.find((n) => n._id === id);
      if (!notification) throw new DemoError(404, "Notification not found.");
      notification.readAt = notification.readAt || new Date().toISOString();
      saveDb();
      return { notification: clone(notification) };
    },
  },
  {
    method: "POST",
    path: ["notifications", "read-all"],
    handler: () => {
      const account = requireSession();
      db.notifications
        .filter((n) => !n.data?.userId || n.data.userId === account.id)
        .forEach((n) => (n.readAt = n.readAt || new Date().toISOString()));
      saveDb();
      return { message: "All notifications marked as read." };
    },
  },

  // ── Orders ───────────────────────────────────────────────────────────
  {
    method: "POST",
    path: ["orders"],
    handler: (_p, body) => {
      const account = requireSession();
      const productPayload = (body.products as { productId: string; quantity: number }[]) ?? [];
      if (productPayload.length === 0) throw new DemoError(400, "Your bag is empty.");

      const items = productPayload.map(({ productId, quantity }) => {
        const product = findProduct(productId);
        const qty = Math.min(Math.max(1, quantity), Math.max(0, product.stock));
        product.stock = Math.max(0, product.stock - qty);
        product.updatedAt = new Date().toISOString();
        db.movements.unshift({
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
      const order: DemoOrder = {
        _id: reference,
        id: reference,
        items,
        total: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
        status: "PENDING",
        source: "ONLINE",
        customer: {
          _id: account.id,
          name: account.name,
          email: account.email,
          phone: account.phone,
        },
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
      db.orders.unshift(order);
      saveDb();
      return { order: orderOf(order) };
    },
  },
  {
    method: "GET",
    path: ["orders"],
    handler: () => {
      const account = requireSession();
      const owned = db.orders.filter((o) => o.customer._id === account.id);
      return { orders: clone(owned) };
    },
  },
  {
    method: "GET",
    path: ["orders", ":id"],
    handler: ([id]) => {
      const account = requireSession();
      const order = db.orders.find((o) => o._id === id && o.customer._id === account.id);
      if (!order) throw new DemoError(404, "Order not found.");
      return { order: orderOf(order) };
    },
  },

  // ── Admin / seller ───────────────────────────────────────────────────
  {
    method: "GET",
    path: ["admin", "orders"],
    handler: () => {
      requireAdmin();
      return { orders: clone(db.orders) };
    },
  },
  {
    method: "PATCH",
    path: ["admin", "orders", ":id", "status"],
    handler: ([id], body) => {
      requireAdmin();
      const order = db.orders.find((o) => o._id === id);
      if (!order) throw new DemoError(404, "Order not found.");
      const status = String(body.status ?? "");
      const allowed = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
      if (!allowed.includes(status)) throw new DemoError(400, "Invalid status.");
      order.status = status as DemoOrder["status"];
      saveDb();
      return { order: orderOf(order) };
    },
  },
  {
    method: "GET",
    path: ["admin", "users"],
    handler: () => {
      requireAdmin();
      const registered: AdminUser[] = db.accounts.map((a) => ({
        id: a.id,
        name: a.name,
        email: a.email,
        phone: a.phone,
        role: a.role,
        isEmailVerified: a.profile.isEmailVerified,
        isPhoneVerified: a.profile.isPhoneVerified,
        createdAt: a.createdAt,
      }));
      const extra = db.customers.filter((c) => !registered.some((r) => r.id === c.id));
      return { users: clone([...registered, ...extra]) };
    },
  },
  {
    method: "DELETE",
    path: ["admin", "users", ":id"],
    handler: ([id]) => {
      requireAdmin();
      const index = db.accounts.findIndex((u) => u.id === id);
      if (index === -1) {
        const staticIndex = db.customers.findIndex((c) => c.id === id);
        if (staticIndex === -1) throw new DemoError(404, "User not found.");
        const [removed] = db.customers.splice(staticIndex, 1);
        saveDb();
        return { message: "Account removed.", user: removed };
      }
      if (db.accounts[index].role === "ADMIN") {
        throw new DemoError(403, "Admin accounts cannot be removed.");
      }
      const [removed] = db.accounts.splice(index, 1);
      saveDb();
      return { message: "Account removed.", user: { id: removed.id } };
    },
  },
  {
    method: "GET",
    path: ["admin", "dashboard"],
    handler: () => {
      requireAdmin();
      const today = new Date().toDateString();
      return {
        totalProducts: db.products.length,
        lowStockCount: db.products.filter((p) => p.isActive && p.stock > 0 && p.stock <= 3).length,
        outOfStockCount: db.products.filter((p) => p.stock <= 0).length,
        todaysOrders: db.orders.filter((o) => new Date(o.createdAt).toDateString() === today).length,
        pendingOrders: db.orders.filter((o) => o.status === "PENDING").length,
        recentActivity: clone(db.movements.slice(0, 6)),
      };
    },
  },
  {
    method: "POST",
    path: ["admin", "inventory", "restock"],
    handler: (_p, body) => {
      requireAdmin();
      const product = findProduct(String(body.productId ?? ""));
      const quantity = Math.max(1, Number(body.quantity) || 0);
      product.stock += quantity;
      product.updatedAt = new Date().toISOString();
      db.movements.unshift({
        _id: nextId("DEMO-MV"),
        product: { _id: product._id, name: product.name },
        quantityChange: quantity,
        type: "RESTOCK",
        reason: "Restock from supplier",
        createdAt: new Date().toISOString(),
      });
      saveDb();
      return { message: "Stock restocked.", product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "POST",
    path: ["admin", "inventory", "record-sale"],
    handler: (_p, body) => {
      requireAdmin();
      const product = findProduct(String(body.productId ?? ""));
      const quantity = Math.max(1, Number(body.quantity) || 0);
      if (product.stock < quantity) throw new DemoError(400, "Not enough stock for this sale.");
      product.stock -= quantity;
      product.updatedAt = new Date().toISOString();
      db.movements.unshift({
        _id: nextId("DEMO-MV"),
        product: { _id: product._id, name: product.name },
        quantityChange: -quantity,
        type: "PHYSICAL_SALE",
        reference: String(body.reference ?? "INV"),
        createdAt: new Date().toISOString(),
      });
      saveDb();
      return { message: "Sale recorded.", product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "POST",
    path: ["admin", "inventory", "adjust"],
    handler: (_p, body) => {
      requireAdmin();
      const product = findProduct(String(body.productId ?? ""));
      const change = Math.trunc(Number(body.quantity) || 0);
      product.stock = Math.max(0, product.stock + change);
      product.updatedAt = new Date().toISOString();
      db.movements.unshift({
        _id: nextId("DEMO-MV"),
        product: { _id: product._id, name: product.name },
        quantityChange: change,
        type: "MANUAL_ADJUSTMENT",
        reason: String(body.reason ?? ""),
        createdAt: new Date().toISOString(),
      });
      saveDb();
      return { message: "Stock adjusted.", product: clone({ ...product, id: product._id }) };
    },
  },
  {
    method: "GET",
    path: ["admin", "inventory", "history"],
    handler: (_p, _b, query) => {
      requireAdmin();
      const productId = query.get("productId");
      const list = productId
        ? db.movements.filter((m) =>
            typeof m.product !== "string"
              ? m.product._id === productId
              : m.product === productId
          )
        : db.movements;
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
  options: RequestInit = {}
): Promise<T> {
  await wait(jitter());

  const url = new URL(path, "http://local.host");
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