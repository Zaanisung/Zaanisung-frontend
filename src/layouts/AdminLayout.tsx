import React from "react";
import { AdminTab } from "../types";
import { Logo } from "../components/Logo";
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
      label: "Sales/Orders",
      icon: ClipboardList,
      badge: pendingOrdersCount,
    },
    { id: "account" as AdminTab, label: "Account", icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-[#0E0E10] text-[#E4E4E7] flex flex-col md:flex-row">
      {/* Desktop Sidebar (Visually distinct, darker/denser) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0A0A0C] border-r border-[#1E1E24] flex-shrink-0 min-h-screen sticky top-0 h-screen p-6">
        {/* Admin Header */}
        <div className="pb-6 border-b border-[#1E1E24]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Logo className="h-9 w-9" />
              <h2
                className="text-lg tracking-[0.2em] font-light italic text-white"
                style={{ fontFamily: "Georgia, serif" }}
              >
                ZAANISUNG
              </h2>
            </div>
            <span className="text-[9px] uppercase tracking-widest bg-[#D4AF37] text-black px-1.5 py-0.5 font-bold">
              ADMIN
            </span>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-gray-400 mt-1">
            Inventory & Sales Portal
          </p>
        </div>

        {/* Primary Nav */}
        <nav className="flex flex-col space-y-1 py-6 flex-1" aria-label="Admin Navigation">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 px-3">
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
                    : "text-gray-400 hover:text-white hover:bg-[#15151A]"
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
          <div className="pt-6 mt-4 border-t border-[#1E1E24]">
            <div className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2.5 px-3">
              Fast Actions
            </div>
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => onNavigateTo("record-sale")}
                className="min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-amber-300 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 flex items-center space-x-2.5 transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-[#D4AF37]" />
                <span>Record Sale</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTo("restock")}
                className="min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-800/40 flex items-center space-x-2.5 transition-colors"
              >
                <RefreshCw className="w-4 h-4 text-emerald-400" />
                <span>Restock</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTo("add-product")}
                className="min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-semibold text-gray-300 bg-[#15151A] hover:bg-[#202026] border border-[#262630] flex items-center space-x-2.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-gray-400" />
                <span>+ Add Perfume</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Back to storefront link */}
        <div className="pt-4 border-t border-[#1E1E24]">
          <button
            type="button"
            onClick={onReturnToStorefront}
            className="w-full min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-widest font-semibold text-gray-400 hover:text-white hover:bg-[#15151A] flex items-center space-x-2.5 transition-colors"
          >
            <Store className="w-4 h-4 text-[#D4AF37]" />
            <span>Storefront</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Section */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Admin Header */}
        <header className="md:hidden sticky top-0 z-30 bg-[#0A0A0C] border-b border-[#1E1E24] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Logo className="h-8 w-8" />
            <h2
              className="text-base tracking-[0.2em] font-light italic text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              ZAANISUNG
            </h2>
            <span className="text-[9px] uppercase tracking-widest bg-[#D4AF37] text-black px-1.5 py-0.5 font-bold">
              ADMIN
            </span>
          </div>

          <button
            type="button"
            onClick={onReturnToStorefront}
            className="min-h-[44px] px-3 text-xs uppercase tracking-wider font-semibold text-gray-300 bg-[#15151A] border border-[#262630] flex items-center space-x-1.5"
          >
            <Store className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Store</span>
          </button>
        </header>

        {/* Mobile Admin Fast Action Pills */}
        <div className="md:hidden bg-[#0A0A0C] border-b border-[#1E1E24] px-3 py-2 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => onNavigateTo("record-sale")}
            className="min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold text-amber-300 bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center space-x-1.5 whitespace-nowrap"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Record Sale</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTo("restock")}
            className="min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 flex items-center space-x-1.5 whitespace-nowrap"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Restock</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigateTo("add-product")}
            className="min-h-[40px] px-3 text-[10px] uppercase tracking-wider font-bold text-gray-300 bg-[#15151A] border border-[#262630] flex items-center space-x-1.5 whitespace-nowrap"
          >
            <PlusCircle className="w-3.5 h-3.5 text-gray-400" />
            <span>+ Add</span>
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-8 max-w-6xl w-full mx-auto pb-24 md:pb-12">
          {children}
        </main>
      </div>

      {/* Admin Mobile Bottom Navigation */}
      <nav
        id="admin-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0C] border-t border-[#1E1E24] pb-safe"
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
                  isActive ? "text-[#D4AF37]" : "text-gray-500 hover:text-white"
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
                    isActive ? "text-[#D4AF37] font-bold" : "text-gray-400"
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
