export type CustomerTab = "shop" | "orders" | "cart" | "account";
export type AdminTab = "dashboard" | "inventory" | "orders" | "account";

export type AppView =
  | { type: "landing" }
  | { type: "customer"; page: "login" }
  | { type: "customer"; page: "register" }
  | { type: "customer"; page: "shop" }
  | { type: "customer"; page: "product-details"; productId: string }
  | { type: "customer"; page: "cart" }
  | { type: "customer"; page: "checkout" }
  | { type: "customer"; page: "order-confirmation"; orderId: string }
  | { type: "customer"; page: "orders" }
  | { type: "customer"; page: "account" }
  | { type: "admin"; page: "login" }
  | { type: "admin"; page: "dashboard" }
  | { type: "admin"; page: "inventory" }
  | { type: "admin"; page: "add-product" }
  | { type: "admin"; page: "edit-product"; productId: string }
  | { type: "admin"; page: "record-sale"; initialProductId?: string }
  | { type: "admin"; page: "restock"; initialProductId?: string }
  | { type: "admin"; page: "orders" }
  | { type: "admin"; page: "account" };