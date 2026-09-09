import type { DashboardNavPage, AppView } from "../types";

/**
 * Maps a dashboard nav page to its AppView. Exhaustive so that adding a new
 * page to `DashboardNavPage` fails the build until it is handled here.
 */
export function dashboardNavView(page: DashboardNavPage): AppView {
  switch (page) {
    case "overview":
      return { type: "dashboard", page: "overview" };
    case "shop":
      return { type: "dashboard", page: "shop" };
    case "cart":
      return { type: "dashboard", page: "cart" };
    case "checkout":
      return { type: "dashboard", page: "checkout" };
    case "orders":
      return { type: "dashboard", page: "orders" };
    case "addresses":
      return { type: "dashboard", page: "addresses" };
    case "payment-methods":
      return { type: "dashboard", page: "payment-methods" };
    case "notifications":
      return { type: "dashboard", page: "notifications" };
    case "settings":
      return { type: "dashboard", page: "settings" };
    case "profile":
      return { type: "dashboard", page: "profile" };
    case "security":
      return { type: "dashboard", page: "security" };
  }
}