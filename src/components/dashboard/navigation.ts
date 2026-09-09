import type { DashboardNavPage, DashboardPage } from "../../types";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  Store,
} from "lucide-react";

export interface DashboardNavItem {
  id: DashboardNavPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const ACCOUNT_NAV: { group: string; items: DashboardNavItem[] }[] = [
  {
    group: "Account",
    items: [
      { id: "overview", label: "Overview", icon: LayoutDashboard },
      { id: "orders", label: "My Orders", icon: Package },
      { id: "addresses", label: "Addresses", icon: MapPin },
      { id: "payment-methods", label: "Payment Methods", icon: CreditCard },
      { id: "notifications", label: "Notifications", icon: Bell },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export const BOTTOM_NAV: DashboardNavItem[] = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "shop", label: "Shop", icon: Store },
  { id: "cart", label: "Cart", icon: ShoppingBag },
  { id: "orders", label: "Orders", icon: Package },
  { id: "settings", label: "Settings", icon: Settings },
];

const ALL_NAV_ITEMS: DashboardNavItem[] = ACCOUNT_NAV.flatMap((g) => g.items);

/** A nav link is "active" while the user is one level deeper on that page. */
export function isNavActive(
  page: DashboardNavPage,
  activePage: DashboardPage
): boolean {
  if (page === activePage) return true;
  if (page === "shop" && activePage === "product-details") return true;
  if (page === "cart" && activePage === "checkout") return true;
  if (page === "orders" && activePage === "order-confirmation") return true;
  return false;
}

/** Best-effort human label for the current page (used by the mobile header). */
export function currentPageLabel(activePage: DashboardPage): string {
  return (
    ALL_NAV_ITEMS.find((i) => isNavActive(i.id, activePage))?.label ??
    (activePage === "product-details"
      ? "Fragrance"
      : activePage === "checkout"
        ? "Checkout"
        : activePage === "order-confirmation"
          ? "Order Confirmation"
          : "My Account")
  );
}