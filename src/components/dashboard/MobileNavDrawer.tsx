import React from "react";
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

/** Slide-in navigation drawer for small screens. */
export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({
  open,
  activePage,
  userName,
  onClose,
  onNavigate,
  onReturnToStorefront,
  onLogout,
}) => {
  if (!open) return null;

  return (
    <div
      className="md:hidden fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute left-0 top-0 bottom-0 w-[82%] max-w-[320px] bg-cream dark:bg-black text-ink dark:text-white border-r border-black/10 dark:border-white/15 shadow-lift flex flex-col overflow-y-auto scrollbar-none">
        <div className="p-4 border-b border-black/10 dark:border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Logo className="h-8 w-8" />
            <div>
              <p className="font-brand-serif text-base tracking-[0.14em] font-light italic leading-none">
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
          <div className="px-4 pt-3 pb-2 border-b border-black/10 dark:border-white/15">
            <p className="eyebrow text-black/45 dark:text-white/45">
              Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}
            </p>
          </div>
        )}

        <nav className="flex flex-col py-3 px-3" aria-label="Dashboard mobile menu">
          {ACCOUNT_NAV.map((group) => (
            <div key={group.group}>
              <div className="eyebrow text-black/45 dark:text-white/45 px-3 pb-2 pt-2">
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
                        "relative min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-3",
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
                      <span>{item.label}</span>
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

        <div className="border-t border-black/10 dark:border-white/15 px-3 py-3 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => onNavigate("shop")}
            className="min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold text-black/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.06] flex items-center gap-3 transition-colors"
          >
            <Store className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Browse Fragrances</span>
            <ChevronRight className="w-3 h-3 ml-auto text-black/30 dark:text-white/30" />
          </button>
          <button
            type="button"
            onClick={onReturnToStorefront}
            className="min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-semibold text-black/60 dark:text-white/60 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.06] flex items-center gap-3 transition-colors"
          >
            <Store className="w-4 h-4 text-gold flex-shrink-0" />
            <span>Public Store</span>
            <ChevronRight className="w-3 h-3 ml-auto text-black/30 dark:text-white/30" />
          </button>
        </div>

        <div className="mt-auto p-4 border-t border-black/10 dark:border-white/15">
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onLogout) onLogout();
            }}
            className="w-full min-h-[46px] px-3.5 py-2.5 text-xs uppercase tracking-widest font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center justify-center gap-2 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};