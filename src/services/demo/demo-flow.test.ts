import { describe, it, expect, beforeEach } from "vitest";
import { demoRequest } from "./api";

// The demo backend keeps an in-memory singleton that is seeded once on import,
// then persisted to localStorage. Keep tests in file order: each spec builds on
// the previous one's session/state.

interface ApiUser {
  id: string;
  name: string;
  email?: string;
  role: string;
}

const auth = async (body: Record<string, unknown>) => {
  const res = await demoRequest<{ user: ApiUser }>("/auth/login", {
    method: "POST",
    body: JSON.stringify(body),
  });
  return res.user;
};

describe("demo backend (persisted)", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts signed out; sign-in 401s", async () => {
    await expect(demoRequest("/me")).rejects.toMatchObject({ statusCode: 401 });
    await expect(demoRequest("/auth/me")).rejects.toMatchObject({ statusCode: 401 });
    await expect(demoRequest("/orders")).rejects.toMatchObject({ statusCode: 401 });
  });

  it("one-tap demo customer creates a rich account", async () => {
    const { user } = await demoRequest<{ user: ApiUser }>("/auth/demo", {
      method: "POST",
      body: JSON.stringify({}),
    });
    expect(user.role).toBe("CUSTOMER");
    expect(user.id).toBe("demo-customer-1");

    const me = await demoRequest<{ user: { name: string; addresses: unknown[] } }>("/me");
    expect(me.user.name).toBe("Aisha Mohammed");
    expect(me.user.addresses.length).toBeGreaterThan(0);

    const orders = await demoRequest<{ orders: unknown[] }>("/orders");
    expect(orders.orders.length).toBe(3);

    const notifs = await demoRequest<{ notifications: unknown[] }>("/notifications");
    expect(notifs.notifications.length).toBe(3);

    const products = await demoRequest<{ products: { _id: string; stock: number }[] }>("/products");
    expect(products.products.length).toBe(8);
  });

  it("placing an order decrements stock and scopes to the buyer", async () => {
    await demoRequest("/auth/demo", { method: "POST", body: JSON.stringify({}) });
    const before = await demoRequest<{ products: { _id: string; stock: number }[] }>("/products");
    const target = before.products.find((p) => p.stock > 0)!;

    const { order } = await demoRequest<{ order: { id: string; total: number; items: unknown[] } }>(
      "/orders",
      {
        method: "POST",
        body: JSON.stringify({
          products: [{ productId: target._id, quantity: 1 }],
          delivery: { address: "1 Test St", city: "Tamale", phone: "+233200000000" },
          payment: { method: "Cash on Delivery" },
        }),
      }
    );
    expect(order.items.length).toBe(1);

    const after = await demoRequest<{ products: { _id: string; stock: number }[] }>("/products");
    const updated = after.products.find((p) => p._id === target._id)!;
    expect(updated.stock).toBe(target.stock - 1);

    const mine = await demoRequest<{ orders: { id: string }[] }>("/orders");
    expect(mine.orders.some((o) => o.id === order.id)).toBe(true);
  });

  it("register → logout → login round-trips a brand-new account", async () => {
    const { user } = await demoRequest<{ user: ApiUser }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "Abena Serwaa", phone: "+233241112222", password: "Abena@123" }),
    });
    expect(user.role).toBe("CUSTOMER");

    const empty = await demoRequest<{ orders: unknown[] }>("/orders");
    expect(empty.orders.length).toBe(0);

    await demoRequest("/auth/logout", { method: "POST" });
    await expect(demoRequest("/me")).rejects.toMatchObject({ statusCode: 401 });

    await expect(
      demoRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ identifier: "+233241112222", password: "wrongpass" }),
      })
    ).rejects.toMatchObject({ statusCode: 401 });

    const again = await auth({ identifier: "+233241112222", password: "Abena@123" });
    expect(again.name).toBe("Abena Serwaa");
  });

  it("duplicate register conflicts; demo customer is idempotent", async () => {
    await demoRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "Dupe", phone: "+233500000000", password: "Dupe@12345" }),
    });
    await expect(
      demoRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name: "Dupe2", phone: "+233500000000", password: "Dupe@12345" }),
      })
    ).rejects.toMatchObject({ statusCode: 409 });

    const a = await demoRequest<{ user: ApiUser }>("/auth/demo", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const b = await demoRequest<{ user: ApiUser }>("/auth/demo", {
      method: "POST",
      body: JSON.stringify({}),
    });
    expect(a.user.id).toBe(b.user.id);
  });

  it("admin can demo-login, view dashboard/orders/users, restock and delete users", async () => {
    await demoRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "To Delete", phone: "+233600000000", password: "Delete@123" }),
    });

    const admin = await demoRequest<{ user: ApiUser }>("/auth/demo", {
      method: "POST",
      body: JSON.stringify({ role: "ADMIN" }),
    });
    expect(admin.user.role).toBe("ADMIN");

    await expect(demoRequest("/admin/dashboard")).resolves.toMatchObject({ totalProducts: 8 });

    const orders = await demoRequest<{ orders: { status: string }[] }>("/admin/orders");
    expect(orders.orders.length).toBeGreaterThan(0);

    const users = await demoRequest<{ users: { id: string; name: string }[] }>("/admin/users");
    expect(users.users.some((u) => u.name === "To Delete")).toBe(true);
    expect(users.users.some((u) => u.name === "Aisha Mohammed")).toBe(true);

    const restock = await demoRequest<{ product: { stock: number } }>("/admin/inventory/restock", {
      method: "POST",
      body: JSON.stringify({ productId: "demo-p-4", quantity: 5 }),
    });
    expect(restock.product.stock).toBe(5);

    const target = users.users.find((u) => u.name === "To Delete")!;
    await demoRequest(`/admin/users/${target.id}`, { method: "DELETE" });
    const after = await demoRequest<{ users: { id: string }[] }>("/admin/users");
    expect(after.users.some((u) => u.id === target.id)).toBe(false);
  });

  it("scopes customer orders away from other sign-ins", async () => {
    await demoRequest("/auth/demo", { method: "POST", body: JSON.stringify({}) });
    await demoRequest("/auth/logout", { method: "POST" });
    await demoRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name: "Solo", phone: "+233700000000", password: "Solo@12345" }),
    });
    const mine = await demoRequest<{ orders: unknown[] }>("/orders");
    expect(mine.orders.length).toBe(0);
  });
});