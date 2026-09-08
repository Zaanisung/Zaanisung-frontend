import React, { useState } from "react";
import { DashboardPage } from "../types";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { Loader } from "../components/ui/Loader";
import { ErrorBoundary } from "../components/ui/Fallback";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  MapPin,
  CreditCard,
  Bell,
  Settings,
  Store,
  LogOut,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronRight,
} from "lucide-react";
import { cn } from "../utils/cn";

export interface UserDashboardLayoutProps {
  children: React.ReactNode;
  activePage: DashboardPage;
  onNavigate: (page: DashboardPage) => void;
  onOpenCart: () => void;
  cartCount: number;
  userName: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onReturnToStorefront: () => void;
  onLogout?: () => void;
  loading?: boolean;
}

interface NavItem {
  id: DashboardPage;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV: { group: string; items: NavItem[] }[] = [
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

const BOTTOM_NAV: NavItem[] = [
  { id: "overview", label: "Home", icon: LayoutDashboard },
  { id: "shop", label: "Shop", icon: Store },
  { id: "cart", label: "Cart", icon: ShoppingBag },
  { id: "orders", label: "Orders", icon: Package },
  { id: "settings", label: "Settings", icon: Settings },
];

const SIDEBAR_KEY = "zaanisung-dash-sidebar-collapsed";

export const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({
  children,
  activePage,
  onNavigate,
  onOpenCart,
  cartCount,
  userName,
  isDark,
  onToggleTheme,
  onReturnToStorefront,
  onLogout,
  loading = false,
}) => {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_KEY) === "1";
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(SIDEBAR_KEY, next ? "1" : "0");
      return next;
    });
  };

  const handleNavigate = (page: DashboardPage) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  const isActive = (page: DashboardPage) => {
    if (page === activePage) return true;
    if (page === "shop" && activePage === "product-details") return true;
    if (page === "cart" && activePage === "checkout") return true;
    if (page === "orders" && activePage === "order-confirmation") return true;
    return false;
  };

  return (
    <div className="min-h-screen text-ink dark:text-white flex flex-col md:flex-row bg-cream dark:bg-black">
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col bg-ink text-cream/75 flex-shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-none transition-[width] duration-300 ease-in-out",
          collapsed ? "w-[76px]" : "w-[260px] lg:w-[280px]"
        )}
        aria-label="Dashboard sidebar"
      >
        <div
          className={cn(
            "relative flex flex-col min-h-full p-6",
            collapsed && "px-3"
          )}
        >
          <div
            className={cn(
              "absolute -top-24 orb orb-gold-faint",
              collapsed ? "-right-24 w-44 h-44" : "-right-16 w-56 h-56"
            )}
            aria-hidden="true"
          />

          {/* Header */}
          <div
            className={cn(
              "relative pb-6 border-b border-white/10",
              collapsed && "flex items-center justify-center border-b-0 pb-4"
            )}
          >
            <div
              className={cn(
                "flex items-center justify-between",
                collapsed && "justify-center"
              )}
            >
              <div
                className={cn(
                  "flex items-center gap-3",
                  collapsed && "justify-center"
                )}
              >
                <Logo className="h-8 w-8 flex-shrink-0" />
                <div className={cn(collapsed && "hidden")}>
                  <h2 className="font-brand-serif text-lg tracking-[0.14em] font-light italic text-cream leading-none">
                    ZAANISUNG
                  </h2>
                  <span className="text-[9px] uppercase tracking-widest text-gold mt-1 block font-semibold">
                    My Account
                  </span>
                </div>
              </div>
              {!collapsed && (
                <ThemeToggle
                  isDark={isDark}
                  onToggle={onToggleTheme}
                />
              )}
            </div>
            {!collapsed && (
              <p className="eyebrow text-cream/40 mt-4">
                Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}
              </p>
            )}
          </div>

          {/* Nav */}
          <nav className="flex flex-col py-5" aria-label="Dashboard Navigation">
            {NAV.map((group) => (
              <div key={group.group}>
                {!collapsed && (
                  <div className="eyebrow text-cream/40 px-3 pb-2.5">
                    {group.group}
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleNavigate(item.id)}
                        title={collapsed ? item.label : undefined}
                        aria-label={collapsed ? item.label : undefined}
                        className={cn(
                          "relative min-h-[46px] text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-3",
                          collapsed
                            ? "justify-center px-0"
                            : "px-3.5 py-2.5",
                          active
                            ? "bg-gold text-ink font-bold"
                            : "text-cream/55 hover:text-cream hover:bg-white/[0.06]"
                        )}
                      >
                        {active && (
                          <span
                            className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-ink/30"
                            aria-hidden="true"
                          />
                        )}
                        <Icon
                          className={cn(
                            "w-4 h-4 flex-shrink-0",
                            active && "stroke-[2.2]"
                          )}
                        />
                        {!collapsed && <span>{item.label}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom: shop actions + collapse toggle */}
          <div className="flex flex-col gap-1 mt-auto">
            <div
              className={cn(
                "pt-5 mt-5 border-t border-white/10 flex flex-col gap-1",
                collapsed && "pt-4 mt-4 items-stretch border-t-0"
              )}
            >
              <button
                type="button"
                onClick={() => handleNavigate("shop")}
                title="Browse Fragrances"
                aria-label="Browse Fragrances"
                className={cn(
                  "min-h-[46px] text-xs uppercase tracking-widest font-semibold text-cream/60 hover:text-cream hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors",
                  collapsed ? "justify-center px-0" : "px-3.5 py-2.5"
                )}
              >
                <Store className="w-4 h-4 text-gold flex-shrink-0" />
                {!collapsed && <span>Browse Fragrances</span>}
              </button>

              <button
                type="button"
                onClick={onReturnToStorefront}
                title="Public Store"
                aria-label="Public Store"
                className={cn(
                  "min-h-[46px] text-xs uppercase tracking-widest font-semibold text-cream/60 hover:text-cream hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors",
                  collapsed ? "justify-center px-0" : "px-3.5 py-2.5"
                )}
              >
                <Store className="w-4 h-4 text-gold flex-shrink-0" />
                {!collapsed && <span>Public Store</span>}
              </button>
            </div>

            <button
              type="button"
              onClick={toggleCollapsed}
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="min-h-[46px] text-xs uppercase tracking-widest font-semibold text-cream/60 hover:text-cream hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors mt-1"
            >
              {collapsed ? (
                <PanelLeftOpen className="w-4 h-4 flex-shrink-0" />
              ) : (
                <>
                  <PanelLeftClose className="w-4 h-4 text-gold flex-shrink-0" />
                  <span>Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-white/75 dark:bg-black/60 backdrop-blur-xl px-3 py-3 flex items-center justify-between gap-2 flex-nowrap">
          <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Open navigation menu"
              className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-ink/60 dark:text-white/60 hover:text-gold transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 min-w-0 pl-1">
              <Logo className="h-8 w-8 shrink-0" />
              <h2 className="font-brand-serif text-base tracking-[0.14em] font-light italic text-ink dark:text-white hidden min-[380px]:inline leading-none">
                ZAANISUNG
              </h2>
              <span className="text-[9px] uppercase tracking-widest bg-gold text-ink px-1.5 py-0.5 font-bold shrink-0">
                ACCOUNT
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              className="relative min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-ink/60 dark:text-white/60 bg-white/60 dark:bg-white/[0.06] border border-black/10 dark:border-white/15"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-4 h-4 text-gold" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-ink text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
          </div>
        </header>

        {/* Mobile page title + context */}
        <div className="md:hidden bg-white/50 dark:bg-black/30 px-3 py-2.5 border-b border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
          <p className="text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 font-semibold">
            {NAV.flatMap((g) => g.items).find((i) => isActive(i.id))?.label ??
              (activePage === "shop"
                ? "Shop"
                : activePage === "cart"
                  ? "Cart"
                  : activePage === "product-details"
                    ? "Fragrance"
                    : activePage === "checkout"
                      ? "Checkout"
                      : activePage === "order-confirmation"
                        ? "Order Confirmation"
                        : "My Account")}
          </p>
          <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
            Account
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-6 sm:py-8 pb-24 md:pb-12">
          {loading ? (
            <div className="flex items-center justify-center py-20" role="status">
              <Loader variant="ring" size="lg" />
            </div>
          ) : (
            <ErrorBoundary>{children}</ErrorBoundary>
          )}
        </main>
      </div>

      {/* Mobile navigation drawer */}
      {menuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50"
          role="dialog"
          aria-modal="true"
          aria-label="Navigation menu"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 w-[82%] max-w-[320px] bg-cream dark:bg-black text-ink dark:text-white border-r border-black/10 dark:border-white/15 shadow-lift flex flex-col overflow-y-auto scrollbar-none">
            <div className="p-4 border-b border-black/10 dark:border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Logo className="h-8 w-8" />
                <div>
                  <p className="font-brand-serif text-base tracking-[0.14em] font-light italic leading-none">
                    ZAANISUNG
                  </p>
                  <span className="text-[9px] uppercase tracking-widest text-gold mt-1 block font-semibold">
                    My Account
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close navigation menu"
                className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-gold transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userName && (
              <div className="px-4 pt-3 pb-2 border-b border-black/10 dark:border-white/15">
                <p className="eyebrow text-black/45 dark:text-white/45">
                  Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}
                </p>
              </div>
            )}

            <nav className="flex flex-col py-3 px-3" aria-label="Dashboard mobile menu">
              {NAV.map((group) => (
                <div key={group.group}>
                  <div className="eyebrow text-black/45 dark:text-white/45 px-3 pb-2 pt-2">
                    {group.group}
                  </div>
                  <div className="flex flex-col">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.id);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleNavigate(item.id)}
                          className={cn(
                            "relative min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-3",
                            active
                              ? "bg-gold text-ink font-bold"
                              : "text-black/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.06]"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-4 h-4 flex-shrink-0",
                              active && "stroke-[2.2]"
                            )}
                          />
                          <span>{item.label}</span>
                          {active && (
                            <span
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-ink/30 dark:bg-gold"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            <div className="border-t border-black/10 dark:border-white/15 px-3 py-3 flex flex-col gap-1">
              <button
                type="button"
                onClick={() => handleNavigate("shop")}
                className="min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold text-black/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.06] flex items-center gap-3 transition-colors"
              >
                <Store className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Browse Fragrances</span>
                <ChevronRight className="w-3 h-3 ml-auto text-black/30 dark:text-white/30" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onReturnToStorefront();
                }}
                className="min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold text-black/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.06] flex items-center gap-3 transition-colors"
              >
                <Store className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Public Store</span>
                <ChevronRight className="w-3 h-3 ml-auto text-black/30 dark:text-white/30" />
              </button>
            </div>

            <div className="mt-auto p-4 border-t border-black/10 dark:border-white/15">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center gap-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-black/75 border-t border-black/10 dark:border-white/15 pb-safe backdrop-blur-xl"
        aria-label="Dashboard Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
          {BOTTOM_NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigate(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center min-h-[44px] h-full relative transition-colors",
                  active
                    ? "text-gold"
                    : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white"
                )}
              >
                <div className="relative">
                  <Icon
                    className={cn(
                      "w-5 h-5",
                      active ? "stroke-[2.2]" : "stroke-[1.6]"
                    )}
                  />
                  {item.id === "cart" && cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-gold text-ink text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-widest mt-1",
                    active
                      ? "text-gold font-bold"
                      : "text-black/45 dark:text-white/45"
                  )}
                >
                  {item.label}
                </span>
                {active && <span className="absolute top-0 w-8 h-[2px] bg-gold" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};