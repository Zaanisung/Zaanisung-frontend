import React from "react";
import { DashboardPage } from "../types";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import { Loader } from "../components/ui/Loader";
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
  loading = false,
}) => {
  const isActive = (page: DashboardPage) => {
    if (page === activePage) return true;
    // shop/cart share the dashboard shell
    if (page === "overview" && activePage === "overview") return true;
    if (page === "orders" && activePage === "orders") return true;
    return false;
  };

  return (
    <div className="min-h-screen text-ink dark:text-white flex flex-col md:flex-row bg-cream dark:bg-black">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-[260px] lg:w-[280px] bg-ink text-cream/75 border-r border-white/10 flex-shrink-0 min-h-screen sticky top-0 h-screen p-6 overflow-y-auto scrollbar-none">
        <div className="relative">
          <div className="absolute -top-24 -right-16 w-56 h-56 orb orb-gold-faint" aria-hidden="true" />

          {/* Header */}
          <div className="relative pb-6 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-[3px] bg-gradient-to-b from-gold to-gold-700">
                  <div className="bg-ink p-[3px]">
                    <Logo className="h-8 w-8" />
                  </div>
                </div>
                <div>
                  <h2 className="font-brand-serif text-lg tracking-[0.14em] font-light italic text-cream leading-none">
                    ZAANISUNG
                  </h2>
                  <span className="text-[9px] uppercase tracking-widest text-gold mt-1 block font-semibold">
                    My Account
                  </span>
                </div>
              </div>
              <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            </div>
            <p className="eyebrow text-cream/40 mt-4">Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}</p>
          </div>

          {/* Nav */}
          <nav className="flex flex-col py-5" aria-label="Dashboard Navigation">
            {NAV.map((group) => (
              <div key={group.group}>
                <div className="eyebrow text-cream/40 px-3 pb-2.5">{group.group}</div>
                <div className="flex flex-col gap-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.id);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        className={cn(
                          "relative min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-3",
                          active
                            ? "bg-gold text-ink font-bold"
                            : "text-cream/55 hover:text-cream hover:bg-white/[0.06]"
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-ink/30" aria-hidden="true" />
                        )}
                        <Icon className={cn("w-4 h-4", active && "stroke-[2.2]")} />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Shop action */}
            <div className="pt-6 mt-5 border-t border-white/10">
              <button
                type="button"
                onClick={() => onNavigate("shop")}
                className="w-full min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold text-cream/60 hover:text-cream hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
              >
                <Store className="w-4 h-4 text-gold" />
                <span>Browse Fragrances</span>
              </button>

              <button
                type="button"
                onClick={onReturnToStorefront}
                className="w-full min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold text-cream/60 hover:text-cream hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
              >
                <Store className="w-4 h-4 text-gold" />
                <span>Public Store</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-white/75 dark:bg-black/60 backdrop-blur-xl px-3 py-3 flex items-center justify-between gap-2 flex-nowrap">
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <Logo className="h-8 w-8 shrink-0" />
            <h2 className="font-brand-serif text-base tracking-[0.14em] font-light italic text-ink dark:text-white hidden min-[420px]:inline">
              ZAANISUNG
            </h2>
            <span className="text-[9px] uppercase tracking-widest bg-gold text-ink px-1.5 py-0.5 font-bold shrink-0">
              ACCOUNT
            </span>
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

        {/* Mobile quick nav */}
        <div className="md:hidden bg-white/60 dark:bg-black/40 px-3 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none backdrop-blur-sm border-b border-black/5 dark:border-white/10">
          {NAV.flatMap((g) => g.items)
            .filter((i) => i.id !== "overview")
            .map((item) => {
              const Icon = item.icon;
              const active = isActive(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className={cn(
                    "min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold flex items-center gap-1.5 whitespace-nowrap",
                    active
                      ? "text-ink bg-gold"
                      : "text-ink/60 dark:text-white/60 bg-white/70 dark:bg-white/[0.06] border border-black/10 dark:border-white/15"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
        </div>

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-6 sm:py-8 pb-24 md:pb-12">
          {loading ? (
            <div className="flex items-start justify-center py-20" role="status">
              <Loader variant="squares" size="lg" />
            </div>
          ) : (
            children
          )}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-black/75 border-t border-black/10 dark:border-white/15 pb-safe backdrop-blur-xl"
        aria-label="Dashboard Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
          {[
            { id: "overview" as DashboardPage, label: "Home", icon: LayoutDashboard },
            { id: "shop" as DashboardPage, label: "Shop", icon: Store },
            { id: "cart" as DashboardPage, label: "Cart", icon: ShoppingBag, badge: cartCount },
            { id: "orders" as DashboardPage, label: "Orders", icon: Package },
            { id: "settings" as DashboardPage, label: "More", icon: LogOut },
          ].map((item) => {
            const Icon = item.icon;
            const active = item.id === activePage;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => (item.id === "settings" ? onNavigate("settings") : onNavigate(item.id))}
                className={cn(
                  "flex flex-col items-center justify-center min-h-[44px] h-full relative transition-colors",
                  active ? "text-gold" : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5", active ? "stroke-[2.2]" : "stroke-[1.6]")} />
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-gold text-ink text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className={cn("text-[10px] uppercase tracking-widest mt-1", active && "text-gold font-bold")}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
