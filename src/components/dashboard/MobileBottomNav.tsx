import React from "react";
import type { DashboardPage, DashboardNavPage } from "../../types";
import { cn } from "../../utils/cn";
import { BOTTOM_NAV, isNavActive } from "./navigation";

interface MobileBottomNavProps {
  activePage: DashboardPage;
  cartCount: number;
  onNavigate: (page: DashboardNavPage) => void;
}

/** Fixed bottom navigation bar on small screens. */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  cartCount,
  onNavigate,
}) => {
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/80 dark:bg-black/75 border-t border-black/10 dark:border-white/15 pb-safe backdrop-blur-xl"
      aria-label="Dashboard Mobile Navigation"
    >
      <div className="grid grid-cols-5 h-16 max-w-md mx-auto px-1">
        {BOTTOM_NAV.map((item) => {
          const Icon = item.icon;
          const active = isNavActive(item.id, activePage);
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
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
  );
};