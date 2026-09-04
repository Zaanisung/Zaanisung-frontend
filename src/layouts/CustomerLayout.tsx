import React from "react";
import { CustomerTab } from "../types";
import { BottomNav } from "../components/BottomNav";
import { ShoppingBag } from "lucide-react";

export interface CustomerLayoutProps {
  children: React.ReactNode;
  activeTab: CustomerTab;
  onChangeTab: (tab: CustomerTab) => void;
  cartCount: number;
  onOpenAdmin: () => void;
}

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  children,
  activeTab,
  onChangeTab,
  cartCount,
  onOpenAdmin,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0B0B0E] text-gray-900 dark:text-[#F4F4F6] transition-colors">
      {/* Geometric Balance Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 lg:px-10 h-16 sm:h-20 border-b border-gray-800 dark:border-[#1C1C24] bg-[#0A0A0C] text-white shadow-xs">
        <div className="flex items-center space-x-6 lg:space-x-8">
          <button
            type="button"
            onClick={() => onChangeTab("shop")}
            className="text-left focus:outline-none"
          >
            <h1
              className="text-xl sm:text-2xl tracking-[0.2em] font-light italic text-white hover:text-[#D4AF37] transition-colors"
              style={{ fontFamily: "Georgia, serif" }}
            >
              ZAANISUNG
            </h1>
            <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] block font-semibold">
              Ent. GH Fragrances
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-xs uppercase tracking-widest text-gray-400">
            <button
              type="button"
              onClick={() => onChangeTab("shop")}
              className={`min-h-[44px] inline-flex items-center transition-colors ${
                activeTab === "shop" ? "text-[#D4AF37] font-bold" : "hover:text-white"
              }`}
            >
              Shop
            </button>
            <button
              type="button"
              onClick={() => onChangeTab("orders")}
              className={`min-h-[44px] inline-flex items-center transition-colors ${
                activeTab === "orders" ? "text-[#D4AF37] font-bold" : "hover:text-white"
              }`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => onChangeTab("account")}
              className={`min-h-[44px] inline-flex items-center transition-colors ${
                activeTab === "account" ? "text-[#D4AF37] font-bold" : "hover:text-white"
              }`}
            >
              Account
            </button>
          </nav>
        </div>

        {/* Right actions: Cart and Admin button */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Cart button (Desktop & Mobile) */}
          <button
            type="button"
            onClick={() => onChangeTab("cart")}
            className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-white hover:text-[#D4AF37] transition-colors"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute top-1.5 right-1.5 bg-[#D4AF37] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {/* Admin Panel button (44px min touch target) */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="text-[10px] sm:text-[11px] uppercase tracking-widest bg-[#D4AF37] hover:bg-[#C29E2E] text-black px-3 sm:px-4 py-2 sm:py-2.5 font-bold min-h-[44px] inline-flex items-center justify-center transition-colors shadow-xs"
          >
            Admin Portal
          </button>
        </div>
      </header>

      {/* Main Page Area - Fluid responsive max-w with adaptive background */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-5 sm:py-8 pb-28 md:pb-12 bg-[#FBFBFA] dark:bg-[#0B0B0E]">
        {children}
      </main>

      {/* Geometric Balance Minimal Footer */}
      <footer className="border-t border-gray-200 dark:border-[#1E1E26] bg-white dark:bg-[#0A0A0C] px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
        <div className="flex flex-wrap items-center gap-4 sm:gap-8 justify-center sm:justify-start">
          <span>&copy; {new Date().getFullYear()} Zaanisung Ent. GH</span>
          <span>Accra, Ghana</span>
          <span>Artisanal Perfumery</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-800 dark:text-gray-200 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Store Open</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={onChangeTab}
        cartCount={cartCount}
      />
    </div>
  );
};
