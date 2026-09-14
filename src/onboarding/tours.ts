import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  LayoutDashboard,
  Package,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import type { AdminTab } from "../types/nav";

export type OnboardingTourId = "buyer-dashboard" | "admin";

export interface OnboardingStep {
  id: string;
  title: string;
  body: string;
  icon?: LucideIcon;
  /** CSS selector for the spotlight target. Must point at real DOM you visit. */
  selector: string;
  /** Switch admin tab before revealing this step (run once). */
  adminTab?: AdminTab;
}

export interface OnboardingTour {
  id: OnboardingTourId;
  storageKey: string;
  title: string;
  steps: OnboardingStep[];
}

/**
 * Buyer onboarding lives inside the signed-in account dashboard only — the
 * public landing page and storefront are deliberately tour-free.
 */
export const BUYER_DASHBOARD_TOUR: OnboardingTour = {
  id: "buyer-dashboard",
  storageKey: "zaanisung-tour-buyer-dashboard-v1",
  title: "Welcome to your dashboard",
  steps: [
    {
      id: "nav",
      title: "Your account hub",
      body: "Everything about your account lives here — Orders, Addresses, Payment Methods, Notifications and Settings. Use these tabs to move between them.",
      icon: LayoutDashboard,
      selector: "[data-tour='dash-nav']",
    },
    {
      id: "stats",
      title: "At a glance",
      body: "This snapshot shows your order totals, pending activity, what’s in the shop and how many addresses you’ve saved.",
      icon: TrendingUp,
      selector: "[data-tour='dash-overview-stats']",
    },
    {
      id: "orders",
      title: "Track your orders",
      body: "Your latest purchases appear here with their live status. “View all” opens the full order history.",
      icon: ClipboardList,
      selector: "[data-tour='dash-recent-orders']",
    },
    {
      id: "quick-links",
      title: "Jump to any section",
      body: "One tap takes you straight to Addresses, Payment Methods, Settings or Notifications.",
      icon: Sparkles,
      selector: "[data-tour='dash-quick-links']",
    },
    {
      id: "cart",
      title: "Your bag, one tap away",
      body: "The bag icon stays at the top of every account page — review your items or checkout anytime.",
      icon: ShoppingBag,
      selector: "[data-tour='shop-cart']",
    },
    {
      id: "mobile-nav",
      title: "On mobile, same tabs",
      body: "On small screens the same sections live in this bar at the bottom of the page.",
      icon: LayoutDashboard,
      selector: "[data-tour='dash-mobile-nav']",
    },
  ],
};

export const ADMIN_TOUR: OnboardingTour = {
  id: "admin",
  storageKey: "zaanisung-tour-admin-v1",
  title: "Welcome, store manager",
  steps: [
    {
      id: "nav",
      title: "Your control room",
      body: "These tabs run the store: Dashboard for at-a-glance numbers, Inventory, Sales & Orders, Customers and Account.",
      icon: LayoutDashboard,
      selector: "[data-tour='admin-nav']",
    },
    {
      id: "mobile-nav",
      title: "Your control room",
      body: "On mobile the same tabs live in this bar at the bottom of the screen.",
      icon: LayoutDashboard,
      selector: "[data-tour='admin-mobile-nav']",
    },
    {
      id: "stats",
      title: "At a glance",
      body: "Track total perfumes, low and out-of-stock bottles, today’s volume and pending orders all in one row.",
      icon: TrendingUp,
      selector: "[data-tour='admin-stats']",
    },
    {
      id: "alerts",
      title: "Stock alerts",
      body: "Anything running low or sold out appears here, with a one-tap Restock shortcut.",
      icon: AlertTriangle,
      selector: "[data-tour='admin-stock-alerts']",
    },
    {
      id: "recent",
      title: "Recent orders",
      body: "The latest sales at a glance. “View All” jumps straight to the full sales log.",
      icon: ClipboardList,
      selector: "[data-tour='admin-recent-orders']",
    },
    {
      id: "inventory",
      title: "Inventory catalog",
      body: "Every fragrance with its price and stock level. Search finds a scent fast, and “+ Add Perfume” grows the store.",
      icon: Package,
      selector: "[data-tour='admin-inventory']",
      adminTab: "inventory",
    },
    {
      id: "inventory-actions",
      title: "Quick actions",
      body: "Each row has Sale, Restock, Edit and Remove so you can manage a product without leaving the list.",
      icon: Package,
      selector: "[data-tour='admin-inventory-actions']",
    },
    {
      id: "orders",
      title: "Sales & orders log",
      body: "Open any order, and move its status forward as it ships and delivers.",
      icon: ClipboardList,
      selector: "[data-tour='admin-orders']",
      adminTab: "orders",
    },
    {
      id: "orders-filter",
      title: "Online vs walk-in",
      body: "Switch between All Sales, Online Orders and Walk-in Sales to focus on what you need.",
      icon: SlidersHorizontal,
      selector: "[role='group'][aria-label='Filter sales by source']",
    },
    {
      id: "orders-status",
      title: "Update order status",
      body: "Use the status dropdown on an order to confirm, ship or deliver it as you work through the day.",
      icon: BadgeCheck,
      selector: "[data-tour='admin-order-status']",
    },
    {
      id: "customers",
      title: "Your customers",
      body: "Every registered account, searchable by name, email or phone. Admin accounts can’t be removed.",
      icon: Users,
      selector: "[data-tour='admin-users']",
      adminTab: "users",
    },
    {
      id: "account",
      title: "Finish up",
      body: "Switch back to the customer storefront anytime, or exit the admin session here when you’re done.",
      icon: UserCog,
      selector: "[data-tour='admin-account']",
      adminTab: "account",
    },
  ],
};

export const TOURS: Record<OnboardingTourId, OnboardingTour> = {
  "buyer-dashboard": BUYER_DASHBOARD_TOUR,
  admin: ADMIN_TOUR,
};