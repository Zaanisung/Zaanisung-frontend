export type CustomerTab = "shop" | "orders" | "cart" | "account";
export type AdminTab = "dashboard" | "inventory" | "orders" | "users" | "account";

export type DashboardPage =
  | "overview"
  | "shop"
  | "cart"
  | "checkout"
  | "product-details"
  | "order-confirmation"
  | "orders"
  | "addresses"
  | "payment-methods"
  | "notifications"
  | "settings";

/**
 * Dashboard pages that are reachable directly from navigation links.
 * `product-details` and `order-confirmation` require route params and are
 * therefore navigated to with an explicit visitor/order id instead.
 */
export type DashboardNavPage = Exclude<
  DashboardPage,
  "product-details" | "order-confirmation"
>;

export type LandingSection = "collections" | "about" | "craft";

export type AppView =
  | { type: "landing"; section?: LandingSection }
  | { type: "customer"; page: "login" }
  | { type: "customer"; page: "register" }
  | { type: "customer"; page: "shop" }
  | { type: "customer"; page: "product-details"; productId: string }
  | { type: "customer"; page: "cart" }
  | { type: "customer"; page: "checkout" }
  | { type: "customer"; page: "order-confirmation"; orderId: string }
  | { type: "customer"; page: "orders" }
  | { type: "customer"; page: "account" }
  | { type: "dashboard"; page: "overview" }
  | { type: "dashboard"; page: "settings" }
  | { type: "dashboard"; page: "addresses" }
  | { type: "dashboard"; page: "payment-methods" }
  | { type: "dashboard"; page: "notifications" }
  | { type: "dashboard"; page: "orders" }
  | { type: "dashboard"; page: "shop" }
  | { type: "dashboard"; page: "cart" }
  | { type: "dashboard"; page: "checkout" }
  | { type: "dashboard"; page: "order-confirmation"; orderId: string }
  | { type: "dashboard"; page: "product-details"; productId: string }
  | { type: "admin"; page: "login" }
  | { type: "admin"; page: "dashboard" }
  | { type: "admin"; page: "inventory" }
  | { type: "admin"; page: "add-product" }
  | { type: "admin"; page: "edit-product"; productId: string }
  | { type: "admin"; page: "record-sale"; initialProductId?: string }
  | { type: "admin"; page: "restock"; initialProductId?: string }
  | { type: "admin"; page: "orders" }
  | { type: "admin"; page: "users" }
  | { type: "admin"; page: "account" };
