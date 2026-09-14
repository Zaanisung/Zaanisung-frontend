import React, { useEffect, useState } from "react";
import type { DashboardPage, DashboardNavPage } from "../../types";
import { cn } from "../../utils/cn";
import {
  BOTTOM_NAV,
  MORE_NAV,
  isNavActive,
  isMoreNavActive,
} from "./navigation";
import { MoreHorizontal } from "lucide-react";

interface MobileBottomNavProps {
  activePage: DashboardPage;
  cartCount: number;
  onNavigate: (page: DashboardNavPage) => void;
}

/** Fixed bottom navigation bar on small screens with a "More" drop-up. */
export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activePage,
  cartCount,
  onNavigate,
}) => {
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMoreOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen]);

  const moreActive = isMoreNavActive(activePage);

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream/90 dark:bg-black/85 border-t border-black/10 dark:border-white/15 pb-safe backdrop-blur-xl"
      aria-label="Dashboard Mobile Navigation"
      data-tour="dash-mobile-nav"
    >
      {/* Tap-through backdrop while the More menu is open */}
      {moreOpen && (
        <div
          onClick={() => setMoreOpen(false)}
          aria-hidden="true"
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
        />
      )}

      {/* Drop-up menu for the remaining tabs */}
      <div
        className={cn(
          "absolute inset-x-0 bottom-full z-10 px-3 pb-2 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          moreOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
        )}
      >
        <div
          role="menu"
          aria-label="More dashboard pages"
          className="relative mx-auto max-w-md rounded-2xl border border-black/10 dark:border-white/15 bg-cream dark:bg-ink text-ink dark:text-white shadow-lift overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3.5 flex items-center justify-between border-b border-black/10 dark:border-white/10">
            <span className="eyebrow text-black/45 dark:text-white/45">
              More
            </span>
            <button
              type="button"
              onClick={() => setMoreOpen(false)}
              aria-label="Close more menu"
              className="min-h-[44px] min-w-[44px] p-2 -m-2 flex items-center justify-center rounded-lg text-black/50 dark:text-white/50 hover:text-gold transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="p-2 flex flex-col">
            {MORE_NAV.map((item) => {
              const Icon = item.icon;
              const active = isNavActive(item.id, activePage);
              return (
                <button
                  key={item.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMoreOpen(false);
                    onNavigate(item.id);
                  }}
                  className={cn(
                    "relative min-h-[46px] px-3.5 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-3",
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
                  <span className="truncate min-w-0">{item.label}</span>
                  {active && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-ink/30 dark:bg-gold rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Nav bar */}
      <div className="relative grid grid-cols-5 h-16 max-w-md mx-auto px-1">
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
              {active && <span className="absolute top-0 w-8 h-[2px] bg-gold rounded-full" />}
            </button>
          );
        })}

        {/* More button */}
        <button
          type="button"
          onClick={() => setMoreOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={moreOpen}
          aria-label="More dashboard pages"
          className={cn(
            "flex flex-col items-center justify-center min-h-[44px] h-full relative transition-colors",
            moreActive || moreOpen
              ? "text-gold"
              : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white"
          )}
        >
          <MoreHorizontal
            className={cn("w-5 h-5", moreActive || moreOpen ? "stroke-[2.2]" : "stroke-[1.6]")}
          />
          <span
            className={cn(
              "text-[10px] uppercase tracking-widest mt-1",
              moreActive || moreOpen
                ? "text-gold font-bold"
                : "text-black/45 dark:text-white/45"
            )}
          >
            More
          </span>
          {(moreActive || moreOpen) && (
            <span className="absolute top-0 w-8 h-[2px] bg-gold rounded-full" />
          )}
        </button>
      </div>
    </nav>
  );
};