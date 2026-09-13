import React, { useEffect } from "react";
import type { DashboardPage, DashboardNavPage } from "../../types";
import { Logo } from "../Logo";
import { cn } from "../../utils/cn";
import { ACCOUNT_NAV, isNavActive } from "./navigation";
import { X, Store, ChevronRight, LogOut } from "lucide-react";

interface MobileNavDrawerProps {
  open: boolean;
  activePage: DashboardPage;
  userName: string;
  onClose: () => void;
  onNavigate: (page: DashboardNavPage) => void;
  onReturnToStorefront: () => void;
  onLogout?: () => void;
}

/**
 * Mobile navigation sheet that slides up from the bottom of the screen.
 *
 * It is opened from the toolbar (hamburger) button in the sticky header and
 * behaves like a clean bottom sheet: rounded top corners, kente gutter, and
 * a backdrop that dismisses it. Scroll is locked on the page body while open.
 */
export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  activePage,
  userName,
  onClose,
  onNavigate,
  onReturnToStorefront,
  onLogout,
}) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div
      className="md:hidden fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Bottom sheet */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 max-h-[82vh] rounded-t-3xl",
          "bg-cream dark:bg-ink text-ink dark:text-white",
          "border-t border-black/10 dark:border-white/15 shadow-lift",
          "flex flex-col overflow-hidden",
          "transition-transform duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
          open ? "translate-y-0" : "translate-y-full pointer-events-none"
        )}
      >
        {/* Kente gutter along the top edge of the sheet */}
        <div className="relative w-full h-1.5 kente-band flex-shrink-0" aria-hidden="true" />

        {/* Grab handle */}
        <div className="flex justify-center pt-2.5 flex-shrink-0" aria-hidden="true">
          <div className="w-10 h-1.5 rounded-full bg-black/15 dark:bg-white/20" />
        </div>

        {/* Header */}
        <div className="px-5 pt-2 pb-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <div>
              <p className="font-brand-serif text-base tracking-[0.14em] font-light leading-none">
                ZAANISUNG
              </p>
              <span className="text-[9px] uppercase tracking-widest text-gold mt-1 block font-semibold">
                My Account
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation menu"
            className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-black/60 dark:text-white/60 hover:text-gold transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {userName && (
          <div className="px-5 py-2.5 border-b border-black/10 dark:border-white/10 flex-shrink-0">
            <p className="eyebrow text-black/45 dark:text-white/45">
              Welcome, {userName.split(" ")[0]}
            </p>
          </div>
        )}

        {/* Nav */}
        <div className="overflow-y-auto scrollbar-none pt-3 pb-3 px-3 flex-1">
          <nav className="flex flex-col" aria-label="Dashboard mobile menu">
            {ACCOUNT_NAV.map((group) => (
              <div key={group.group}>
                <div className="eyebrow text-black/45 dark:text-white/45 px-3 pb-2 pt-1">
                  {group.group}
                </div>
                <div className="flex flex-col">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = isNavActive(item.id, activePage);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onNavigate(item.id)}
                        className={cn(
                          "relative min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-3 rounded-lg",
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

          <div className="px-3 py-3 flex flex-col gap-1">
            <button
              type="button"
              onClick={() => onNavigate("shop")}
              className="min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold text-black/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.06] flex items-center gap-3 transition-colors rounded-lg"
            >
              <Store className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="truncate min-w-0">Browse Fragrances</span>
              <ChevronRight className="w-3 h-3 ml-auto text-black/30 dark:text-white/30" />
            </button>
            <button
              type="button"
              onClick={onReturnToStorefront}
              className="min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold text-black/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.06] flex items-center gap-3 transition-colors rounded-lg"
            >
              <Store className="w-4 h-4 text-gold flex-shrink-0" />
              <span className="truncate min-w-0">Public Store</span>
              <ChevronRight className="w-3 h-3 ml-auto text-black/30 dark:text-white/30" />
            </button>
          </div>
        </div>

        <div className="flex-shrink-0 p-4 border-t border-black/10 dark:border-white/10 pb-safe">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onLogout) onLogout();
            }}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center gap-2 transition-colors rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};