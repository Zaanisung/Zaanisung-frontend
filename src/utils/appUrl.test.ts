import { describe, expect, it } from "vitest";
import { hashToView, viewToHash } from "./appUrl";
import type { AppView } from "../types";

describe("appUrl codec", () => {
  const roundTrip = (view: AppView, expectedHash: string) => {
    const hash = viewToHash(view);
    expect(hash).toBe(expectedHash);
    expect(hashToView("#" + hash)).toEqual(view);
  };

  it("maps landing views", () => {
    roundTrip({ type: "landing" }, "/");
    roundTrip({ type: "landing", section: "about" }, "/home/about");
    roundTrip({ type: "landing", section: "craft" }, "/home/craft");
    roundTrip({ type: "landing", section: "collections" }, "/home/collections");
  });

  it("maps customer storefront views", () => {
    roundTrip({ type: "customer", page: "shop" }, "/shop");
    roundTrip({ type: "customer", page: "cart" }, "/cart");
    roundTrip({ type: "customer", page: "checkout" }, "/checkout");
    roundTrip({ type: "customer", page: "orders" }, "/orders");
    roundTrip({ type: "customer", page: "account" }, "/account");
    roundTrip({ type: "customer", page: "login" }, "/login");
    roundTrip({ type: "customer", page: "register" }, "/register");
    roundTrip({ type: "customer", page: "product-details", productId: "p1" }, "/product/p1");
    roundTrip({ type: "customer", page: "order-confirmation", orderId: "o1" }, "/confirm/o1");
  });

  it("maps dashboard views", () => {
    roundTrip({ type: "dashboard", page: "overview" }, "/dashboard/overview");
    roundTrip({ type: "dashboard", page: "shop" }, "/dashboard/shop");
    roundTrip({ type: "dashboard", page: "orders" }, "/dashboard/orders");
    roundTrip({ type: "dashboard", page: "notifications" }, "/dashboard/notifications");
    roundTrip({ type: "dashboard", page: "product-details", productId: "p2" }, "/dashboard/product/p2");
  });

  it("maps admin views", () => {
    roundTrip({ type: "admin", page: "dashboard" }, "/admin/dashboard");
    roundTrip({ type: "admin", page: "inventory" }, "/admin/inventory");
    roundTrip({ type: "admin", page: "users" }, "/admin/users");
    roundTrip({ type: "admin", page: "add-product" }, "/admin/add-product");
    roundTrip({ type: "admin", page: "edit-product", productId: "p3" }, "/admin/edit/p3");
    roundTrip({ type: "admin", page: "record-sale" }, "/admin/sale");
    roundTrip({ type: "admin", page: "record-sale", initialProductId: "p4" }, "/admin/sale/p4");
    roundTrip({ type: "admin", page: "restock", initialProductId: "p5" }, "/admin/restock/p5");
  });

  it("accepts fragments with or without the leading hash", () => {
    expect(hashToView("")).toEqual({ type: "landing" });
    expect(hashToView("#")).toEqual({ type: "landing" });
    expect(hashToView("/shop")).toEqual({ type: "customer", page: "shop" });
    expect(hashToView("#/shop")).toEqual({ type: "customer", page: "shop" });
    expect(hashToView("#/home/about")).toEqual({ type: "landing", section: "about" });
  });

  it("falls back to overview for an empty dashboard route", () => {
    expect(hashToView("#/dashboard")).toEqual({ type: "dashboard", page: "overview" });
  });

  it("returns null for unknown routes", () => {
    expect(hashToView("#/unknown-route")).toBeNull();
    expect(hashToView("#/product")).toBeNull();
    expect(hashToView("#/admin/edit")).toBeNull();
    expect(hashToView("#/shop/extra")).toBeNull();
  });
});