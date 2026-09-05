import React from "react";
import { AdminTab } from "../types";
import { Logo } from "../components/Logo";
import { ThemeToggle } from "../components/ThemeToggle";
import {
  LayoutDashboard,
  Boxes,
  ClipboardList,
  UserCheck,
  PlusCircle,
  TrendingUp,
  RefreshCw,
  Store,
} from "lucide-react";

export interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: AdminTab;
  onChangeTab: (tab: AdminTab) => void;
  onNavigateTo: (page: "add-product" | "record-sale" | "restock") => void;
  onReturnToStorefront: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
  pendingOrdersCount?: number;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeTab,
  onChangeTab,
  onNavigateTo,
  onReturnToStorefront,
  isDark,
  onToggleTheme,
  pendingOrdersCount = 0,
}) => {
  const navItems = [
    { id: "dashboard" as AdminTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "inventory" as AdminTab, label: "Inventory", icon: Boxes },
    {
      id: "orders" as AdminTab,
      label: "Sales/Orders",
      icon: ClipboardList,
      badge: pendingOrdersCount,
    },
    { id: "account" as AdminTab, label: "Account", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col md:flex-row">
      {/* Desktop Sidebar (Visually distinct, darker/denser) */}
      <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-black border-r border-black/10 dark:border-white/15 flex-shrink-0 min-h-screen sticky top-0 h-screen p-6">
        {/* Admin Header */}
        <div className="pb-6 border-b border-black/10 dark:border-white/15">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-9 w-9" />
              <h2
                className="text-lg tracking-[0.2em] font-light italic text-black dark:text-white"
                style={{ fontFamily: "Georgia, serif" }}
              >
                ZAANISUNG
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
              <span className="text-[9px] uppercase tracking-widest bg-[#D4AF37] text-black px-1.5 py-0.5 font-bold">
                ADMIN
              </span>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 mt-1">
            Inventory & Sales Portal
          </p>
        </div>

        {/* Primary Nav */}
        <nav className="flex flex-col space-y-1 py-6 flex-1" aria-label="Admin Navigation">
          <div className="text-[10px] uppercase tracking-[0.2em] text-black/50 dark:text-white/50 mb-2 px-3">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className={`min-h-[44px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-between ${
                  isActive
                    ? "bg-[#D4AF37] text-black font-bold"
                    : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/5"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span
                    className={`px-1.5 py-0.5 text-[10px] font-bold ${
                      isActive ? "bg-black text-[#D4AF37]" : "bg-[#D4AF37] text-black"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Rapid Operations */}
          <div className="pt-6 mt-6">
            <div className="text-[10px] uppercase tracking-[0.2em] text-black/50 dark:text-white/50 mb-2.5 px-3">
              Fast Actions
            </div>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => onNavigateTo("record-sale")}
                className="min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center space-x-2.5 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                <span>Record Sale</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTo("restock")}
                className="min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-[#D4AF37] bg-[#D4AF37]/10 hover:bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center space-x-2.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-[#D4AF37]" />
                <span>Restock</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTo("add-product")}
                className="min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-black/60 dark:text-white/60 bg-white dark:bg-white/5 hover:bg-[#F5F5F5] dark:hover:bg-white/10 border border-black/10 dark:border-white/15 flex items-center space-x-2.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-black/45 dark:text-white/45" />
                <span>+ Add Perfume</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Back to storefront link */}
        <div className="pt-6">
          <button
            type="button"
            onClick={onReturnToStorefront}
            className="w-full min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-widest font-semibold text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/5 flex items-center space-x-2.5 transition-colors"
          >
            <Store className="w-4 h-4 text-[#D4AF37]" />
            <span>Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Admin Header */}
        <header className="md:hidden sticky top-0 z-30 bg-white dark:bg-black border-b border-black/10 dark:border-white/15 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <h2
              className="text-base tracking-[0.2em] font-light italic text-black dark:text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              ZAANISUNG
            </h2>
            <span className="text-[9px] uppercase tracking-widest bg-[#D4AF37] text-black px-1.5 py-0.5 font-bold">
              ADMIN
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            <button
              type="button"
              onClick={onReturnToStorefront}
              className="min-h-[44px] px-3 text-xs uppercase tracking-wider font-semibold text-black/60 dark:text-white/60 bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 flex items-center space-x-1.5"
            >
              <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Store</span>
            </button>
          </div>
        </header>

        {/* Mobile Admin Fast Action Pills */}
        <div className="md:hidden bg-white dark:bg-black px-3 py-3 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => onNavigateTo("record-sale")}
            className="min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center space-x-1.5 whitespace-nowrap"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Record Sale</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTo("restock")}
            className="min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center space-x-1.5 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Restock</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTo("add-product")}
            className="min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold text-black/60 dark:text-white/60 bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 flex items-center space-x-1.5 whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5 text-black/45 dark:text-white/45" />
            <span>+ Add</span>
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-4 sm:py-8 pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Admin Mobile Bottom Navigation */}
      <nav
        id="admin-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-black border-t border-black/10 dark:border-white/15 pb-safe"
        aria-label="Admin Mobile Navigation"
      >
        <div className="grid grid-cols-4 h-16 max-w-md mx-auto px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangeTab(item.id)}
                className={`flex flex-col items-center justify-center min-h-[44px] h-full relative transition-colors ${
                  isActive ? "text-[#D4AF37]" : "text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.2]" : "stroke-[1.6]"}`} />
                  {typeof item.badge === "number" && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[10px] uppercase tracking-widest mt-1 ${
                    isActive ? "text-[#D4AF37] font-bold" : "text-black/45 dark:text-white/45"
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute top-0 w-8 h-[2px] bg-[#D4AF37]" />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
