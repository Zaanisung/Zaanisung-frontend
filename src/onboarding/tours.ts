import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  BadgeCheck,
  ClipboardList,
  LayoutDashboard,
  Package,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  UserCog,
  Users,
} from "lucide-react";
import type { AdminTab } from "../types/nav";

export type OnboardingTourId = "buyer-landing" | "buyer-shop" | "admin";

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

export const BUYER_LANDING_TOUR: OnboardingTour = {
  id: "buyer-landing",
  storageKey: "zaanisung-tour-buyer-landing-v1",
  title: "Welcome to Zaanisung",
  steps: [
    {
      id: "nav",
      title: "Find your way around",
      body: "Browse the sections above — Collections, About and The Craft — or jump straight into the store with “Enter Store”.",
      icon: Sparkles,
      selector: "[data-tour='landing-nav']",
    },
    {
      id: "hero",
      title: "A scent that stays with you",
      body: "Zaanisung is an extrait perfume house from Tamale. Hit “Explore fragrances” to see the full collection whenever you’re ready.",
      icon: Sparkles,
      selector: "[data-tour='landing-hero']",
    },
    {
      id: "collections",
      title: "Signature Collection",
      body: "These are our most requested extraits. Swipe or drag the row — tap any card to open its details.",
      icon: Package,
      selector: "[data-tour='landing-collections']",
    },
    {
      id: "cta",
      title: "Ready when you are",
      body: "Join Zaanisung for account features like order tracking, addresses and saved payments — or shop instantly as a guest.",
      icon: BadgeCheck,
      selector: "[data-tour='landing-cta']",
    },
  ],
};

export const BUYER_SHOP_TOUR: OnboardingTour = {
  id: "buyer-shop",
  storageKey: "zaanisung-tour-buyer-shop-v1",
  title: "Shopping made simple",
  steps: [
    {
      id: "search",
      title: "Search the catalog",
      body: "Type a fragrance name here and the collection filters instantly as you type.",
      icon: Search,
      selector: "[data-tour='shop-search']",
    },
    {
      id: "filters",
      title: "Quick filters",
      body: "Use these chips to show only in-stock scents or narrow the range by price.",
      icon: SlidersHorizontal,
      selector: "[data-tour='shop-filters']",
    },
    {
      id: "grid",
      title: "Tap a card, or add straight away",
      body: "Open a card for the full scent profile, or press “Add” to drop it into your bag in one tap.",
      icon: ShoppingBag,
      selector: "[data-tour='shop-grid']",
    },
    {
      id: "cart",
      title: "Your bag, always one tap away",
      body: "The bag icon stays right here on every page — check it any time to review or checkout your order.",
      icon: ShoppingBag,
      selector: "[data-tour='shop-cart']",
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
  "buyer-landing": BUYER_LANDING_TOUR,
  "buyer-shop": BUYER_SHOP_TOUR,
  admin: ADMIN_TOUR,
};