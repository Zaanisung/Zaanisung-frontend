import type {
  AppView,
  DashboardPage,
  LandingSection,
  AdminTab,
} from "../types";

/**
 * URL codec for the app's views.
 *
 * The app is a single-page application served from the root path, so routing
 * uses the URL hash fragment (no server rewrites needed). Every serialisable
 * view maps to a unique, shareable path:
 *
 *   #/                            → landing (home)
 *   #/home/collections|about|craft → landing section deep link
 *   #/shop | /cart | /checkout | /orders | /account | /login | /register
 *   #/product/:productId           → storefront product details
 *   #/confirm/:orderId             → storefront order confirmation
 *   #/dashboard[/overview|shop|cart|checkout|orders|addresses|payment-methods|notifications|settings]
 *   #/dashboard/product/:productId → dashboard product details
 *   #/admin[/dashboard|inventory|orders|users|account]
 *   #/admin/add-product
 *   #/admin/edit/:productId
 *   #/admin/sale[/:productId]      → record a sale (optionally pre-selected)
 *   #/admin/restock[/:productId]   → restock (optionally pre-selected)
 */

const LANDING_SECTIONS: LandingSection[] = ["collections", "about", "craft"];

const CUSTOMER_PAGES: Record<string, "shop" | "cart" | "checkout" | "orders" | "account" | "login" | "register"> = {
  shop: "shop",
  cart: "cart",
  checkout: "checkout",
  orders: "orders",
  account: "account",
  login: "login",
  register: "register",
};

const DASHBOARD_PAGES: Partial<Record<string, DashboardPage>> = {
  overview: "overview",
  shop: "shop",
  cart: "cart",
  checkout: "checkout",
  orders: "orders",
  addresses: "addresses",
  "payment-methods": "payment-methods",
  notifications: "notifications",
  settings: "settings",
};

const ADMIN_PAGES: Partial<Record<string, AdminTab>> = {
  dashboard: "dashboard",
  inventory: "inventory",
  orders: "orders",
  users: "users",
  account: "account",
};

export const viewToHash = (view: AppView): string => {
  switch (view.type) {
    case "landing":
      return view.section ? `/home/${view.section}` : "/";
    case "customer":
      if (view.page === "product-details") return `/product/${view.productId}`;
      if (view.page === "order-confirmation") return `/confirm/${view.orderId}`;
      return `/${view.page}`;
    case "dashboard":
      if (view.page === "product-details") return `/dashboard/product/${view.productId}`;
      return `/dashboard/${view.page}`;
    case "admin":
      if (view.page === "add-product") return "/admin/add-product";
      if (view.page === "edit-product") return `/admin/edit/${view.productId}`;
      if (view.page === "record-sale")
        return view.initialProductId
          ? `/admin/sale/${view.initialProductId}`
          : "/admin/sale";
      if (view.page === "restock")
        return view.initialProductId
          ? `/admin/restock/${view.initialProductId}`
          : "/admin/restock";
      return `/admin/${view.page}`;
  }
};

const toCustomerPage = (
  page: string | undefined
):
  | { type: "customer"; page: "shop" | "cart" | "checkout" | "orders" | "account" | "login" | "register" }
  | null => {
  if (!page) return null;
  const resolved = CUSTOMER_PAGES[page];
  return resolved ? { type: "customer", page: resolved } : null;
};

const toDashboardPage = (segments: string[]): AppView | null => {
  const page = segments[0];
  if (page === "product" && segments[1]) {
    return { type: "dashboard", page: "product-details", productId: segments[1] };
  }
  const resolved = page ? DASHBOARD_PAGES[page] : "overview";
  return resolved ? ({ type: "dashboard", page: resolved } as AppView) : null;
};

const toAdminPage = (segments: string[]): AppView | null => {
  const page = segments[0];
  if (!page) return { type: "admin", page: "dashboard" };
  if (page === "add" || page === "add-product") {
    return { type: "admin", page: "add-product" };
  }
  if (page === "edit" && segments[1]) {
    return { type: "admin", page: "edit-product", productId: segments[1] };
  }
  if (page === "sale") {
    return segments[1]
      ? { type: "admin", page: "record-sale", initialProductId: segments[1] }
      : { type: "admin", page: "record-sale" };
  }
  if (page === "restock") {
    return segments[1]
      ? { type: "admin", page: "restock", initialProductId: segments[1] }
      : { type: "admin", page: "restock" };
  }
  const resolved = ADMIN_PAGES[page];
  return resolved ? ({ type: "admin", page: resolved } as AppView) : null;
};

/**
 * Parse a hash fragment (with or without the leading "#") into a view.
 * Returns null for fragments that cannot be mapped, so callers can ignore
 * unknown URLs instead of crashing the app.
 */
export const hashToView = (hash?: string | null): AppView | null => {
  const raw = (hash ?? "").replace(/^#/, "");
  const segments = raw.split("/").filter((segment) => segment.length > 0);

  const first = segments[0];
  if (!first) return { type: "landing" };

  switch (first) {
    case "home": {
      if (segments[1] && LANDING_SECTIONS.includes(segments[1] as LandingSection)) {
        return { type: "landing", section: segments[1] as LandingSection };
      }
      return { type: "landing" };
    }
    case "shop":
    case "cart":
    case "checkout":
    case "orders":
    case "account":
    case "login":
    case "register":
      return segments.length === 1 ? toCustomerPage(first) : null;
    case "product":
      return segments[1]
        ? { type: "customer", page: "product-details", productId: segments[1] }
        : null;
    case "confirm":
      return segments[1]
        ? { type: "customer", page: "order-confirmation", orderId: segments[1] }
        : null;
    case "dashboard":
      return toDashboardPage(segments.slice(1));
    case "admin":
      return toAdminPage(segments.slice(1));
    default:
      return null;
  }
};