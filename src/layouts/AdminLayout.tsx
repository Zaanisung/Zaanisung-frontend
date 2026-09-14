import React from "react";
import { AdminTab } from "../types";
import { Logo } from "../components/Logo";
import { ErrorBoundary } from "../components/ui/Fallback";
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  Users,
  UserCheck,
  PlusCircle,
  TrendingUp,
  RefreshCw,
  Store,
} from "lucide-react";
import { cn } from "../utils/cn";

export interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  onNavigateTo: (page: "add-product" | "record-sale" | "restock") => void;
  onReturnToStorefront: () => void;
  pendingOrdersCount?: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onChangeTab,
  onNavigateTo,
  onReturnToStorefront,
  pendingOrdersCount = 0,
}) => {
  const navItems = [
    { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory" as AdminTab, label: "Inventory", icon: Boxes },
    {
      id: "orders" as AdminTab,
      label: "Orders",
      icon: ClipboardList,
      badge: pendingOrdersCount,
    },
    { id: "users" as AdminTab, label: "Customers", icon: Users },
    { id: "account" as AdminTab, label: "Account", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen text-ink dark:text-white flex flex-col md:flex-row bg-cream dark:bg-black">
      {/* Desktop sidebar — deep ink console surface. Compact enough to never scroll. */}
      <aside
        className="relative hidden lg:flex flex-col w-[240px] bg-ink text-cream/75 border-r border-white/10 flex-shrink-0 sticky top-0 h-screen overflow-hidden"
        aria-label="Admin sidebar"
      >
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gold z-20" aria-hidden="true" />
        <div className="relative flex flex-col flex-1 min-h-0 px-3 pt-6 pb-5">
          <div
            className="absolute -top-24 -right-24 w-56 h-56 orb orb-gold-faint"
            aria-hidden="true"
          />

          {/* Brand — logo only, no text, no frame. Transparent PNG on its own. */}
          <div className="relative flex items-center justify-center pb-6 px-2">
            <Logo className="h-9 w-9" />
          </div>

          {/* Primary nav */}
          <nav
            className="relative flex flex-col gap-1 min-h-0"
            aria-label="Admin Navigation"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChangeTab(item.id)}
                  className={cn(
                    "rounded-lg relative w-full min-w-0 min-h-[44px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center justify-between gap-2",
                    isActive
                      ? "bg-gold text-ink font-bold"
                      : "text-cream/55 hover:text-cream hover:bg-white/[0.06]"
                  )}
                >
                  {isActive && (
                    <span
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-ink/30 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={cn("w-4 h-4 flex-shrink-0", isActive && "stroke-[2.2]")} />
                    <span className="truncate min-w-0">{item.label}</span>
                  </div>
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span
                      className={cn(
                        "rounded-full min-w-[20px] h-[20px] px-1.5 text-[10px] font-bold inline-flex items-center justify-center",
                        isActive ? "bg-ink text-gold" : "bg-gold text-ink"
                      )}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Storefront — pinned to the bottom */}
          <div className="relative mt-auto pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onReturnToStorefront}
              className="rounded-lg w-full min-w-0 min-h-[44px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold text-cream/60 hover:text-cream hover:bg-white/[0.06] flex items-center gap-2.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            >
              <Store className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="truncate min-w-0">Storefront</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main admin column */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header — transparent, scrolls with the page */}
        <header className="lg:hidden px-3 pt-3 flex items-center justify-between gap-2 flex-nowrap">
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            <Logo className="h-8 w-8 shrink-0" />
            <span className="rounded-md text-[9px] uppercase tracking-widest bg-gold text-ink px-1.5 py-0.5 font-bold shrink-0">
              ADMIN
            </span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={onReturnToStorefront}
              className="rounded-lg min-h-[44px] px-3 text-xs uppercase tracking-wider font-semibold text-ink/60 dark:text-white/60 surface-glass border border-black/10 dark:border-white/15 flex items-center gap-1.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
            >
              <Store className="w-3.5 h-3.5 text-gold" />
              <span>Store</span>
            </button>
          </div>
        </header>

        {/* Mobile fast-action pills */}
        <div className="lg:hidden px-3 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => onNavigateTo("record-sale")}
            className="rounded-lg min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold text-gold bg-gold/10 border border-gold/40 flex items-center gap-1.5 whitespace-nowrap transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <TrendingUp className="w-3.5 h-3.5 text-gold" />
            <span>Record Sale</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTo("restock")}
            className="rounded-lg min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold text-gold bg-gold/10 border border-gold/40 flex items-center gap-1.5 whitespace-nowrap transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold" />
            <span>Restock</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTo("add-product")}
            className="rounded-lg min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold text-ink/60 dark:text-white/60 surface-glass border border-black/10 dark:border-white/15 flex items-center gap-1.5 whitespace-nowrap transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <PlusCircle className="w-3.5 h-3.5 text-gold" />
            <span>+ Add</span>
          </button>
        </div>

        {/* Page content — top padding matches sidebar so both headers align */}
        <main className="flex-1 px-4 sm:px-8 xl:px-12 py-6 pb-28 lg:pb-12">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav
        id="admin-bottom-nav"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-black/75 border-t border-black/10 dark:border-white/15 pb-safe backdrop-blur-xl"
        aria-label="Admin Mobile Navigation"
      >
        <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className={cn(
                  "flex flex-col items-center justify-center min-h-[44px] h-full relative transition-colors",
                  isActive ? "text-gold" : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white"
                )}
              >
                <div className="relative">
                  <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.2]" : "stroke-[1.6]")} />
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-gold text-ink text-[9px] font-bold rounded-full flex items-center justify-center shadow-[0_0_0_2px_rgba(0,0,0,0.1)]">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "text-[10px] uppercase tracking-widest mt-1 truncate max-w-full px-0.5",
                    isActive ? "text-gold font-bold" : "text-black/45 dark:text-white/45"
                  )}
                >
                  {item.label}
                </span>
                {isActive && <span className="absolute top-0 w-8 h-[2px] bg-gold rounded-full" />}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};