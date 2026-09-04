import React from "react";
import { CustomerTab } from "../types";
import { Store, ShoppingBag, ReceiptText, User } from "lucide-react";

export interface BottomNavProps {
  activeTab: CustomerTab;
  onChangeTab: (tab: CustomerTab) => void;
  cartCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  cartCount,
}) => {
  const tabs = [
    { id: "shop" as CustomerTab, label: "Shop", icon: Store },
    { id: "orders" as CustomerTab, label: "Orders", icon: ReceiptText },
    { id: "cart" as CustomerTab, label: "Cart", icon: ShoppingBag, badge: cartCount },
    { id: "account" as CustomerTab, label: "Account", icon: User },
  ];

  return (
    <nav
      id="customer-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0A0A] border-t border-[#222222] pb-safe"
      aria-label="Customer Mobile Navigation"
    >
      <div className="grid grid-cols-4 h-16 max-w-md mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] h-full relative transition-colors ${
                isActive ? "text-[#D4AF37]" : "text-gray-400 hover:text-white"
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 ${isActive ? "stroke-[2.2]" : "stroke-[1.6]"}`} />
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-[#D4AF37] text-black text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] uppercase tracking-widest mt-1 ${
                  isActive ? "text-[#D4AF37] font-bold" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 w-8 h-[2px] bg-[#D4AF37]" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
