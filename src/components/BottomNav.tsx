import React from "react";
import { CustomerTab } from "../types";
import { Store, ShoppingBag, ReceiptText, User } from "lucide-react";
import { cn } from "../utils/cn";

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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-black/10 dark:border-white/15 pb-safe backdrop-blur-xl bg-white/80 dark:bg-black/75"
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
              className={cn(
                "flex flex-col items-center justify-center min-h-[44px] h-full relative transition-colors",
                isActive ? "text-gold" : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.2]" : "stroke-[1.6]")} />
                {typeof tab.badge === "number" && tab.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[17px] h-[17px] px-1 bg-gold text-ink text-[9px] font-bold rounded-full flex items-center justify-center">
                    {tab.badge > 99 ? "99+" : tab.badge}
                  </span>
                )}
              </div>
              <span
                className={cn(
                  "text-[10px] uppercase tracking-widest mt-1",
                  isActive ? "text-gold font-bold" : "text-black/45 dark:text-white/45"
                )}
              >
                {tab.label}
              </span>
              {isActive && <span className="absolute top-0 w-8 h-[2px] bg-gold" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
};