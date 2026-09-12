import React from "react";
import type { DashboardPage, DashboardNavPage } from "../../types";
import { Logo } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";
import { cn } from "../../utils/cn";
import { ACCOUNT_NAV, isNavActive } from "./navigation";
import { Store, Globe } from "lucide-react";

interface SidebarProps {
  activePage: DashboardPage;
  userName: string;
  isDark: boolean;
  collapsed: boolean;
  onToggleTheme: () => void;
  onNavigate: (page: DashboardNavPage) => void;
  onToggleCollapsed: () => void;
  onReturnToStorefront: () => void;
}

/**
 * Desktop icon-rail sidebar for the account dashboard.
 * Active state is shown purely by the gold background — no text labels,
 * no side indicator bar, and it never scrolls (fits the viewport).
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  userName: _userName,
  isDark,
  collapsed: _collapsed,
  onToggleTheme,
  onNavigate,
  onToggleCollapsed: _onToggleCollapsed,
  onReturnToStorefront,
}) => {
  return (
    <aside
      className="hidden md:flex flex-col bg-ink text-cream/75 flex-shrink-0 sticky top-0 h-screen w-[78px] overflow-hidden"
      aria-label="Dashboard sidebar"
    >
      {/* Kente crown — woven Ghanaian trim along the top edge */}
      <div className="absolute top-0 inset-x-0 h-[6px] kente-band z-20" aria-hidden="true" />
      <div className="relative flex flex-col flex-1 py-5 px-2.5">
        <div
          className="absolute -top-24 -right-24 w-44 h-44 orb orb-gold-faint"
          aria-hidden="true"
        />

        {/* Header */}
        <div className="relative pb-4 border-b border-white/10 flex flex-col items-center gap-3">
          <Logo className="h-8 w-8 flex-shrink-0" />
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
        </div>

        {/* Nav */}
        <nav
          className="flex flex-col gap-1 py-4"
          aria-label="Dashboard Navigation"
        >
          {ACCOUNT_NAV.map((group) => (
            <div key={group.group} className="flex flex-col gap-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = isNavActive(item.id, activePage);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    title={item.label}
                    aria-label={item.label}
                    className={cn(
                      "rounded-lg w-full min-w-0 min-h-[46px] flex items-center justify-center px-0 py-2",
                      "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                      active
                        ? "bg-gold text-ink shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_4px_16px_-4px_rgba(212,175,55,0.3)]"
                        : "text-cream/55 hover:text-cream hover:bg-white/[0.06]"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] flex-shrink-0",
                        active && "stroke-[2.2]"
                      )}
                    />
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Bottom: shop actions */}
        <div className="flex flex-col gap-1 mt-auto pt-4 border-t border-white/10">
          <button
            type="button"
            onClick={() => onNavigate("shop")}
            title="Browse Fragrances"
            aria-label="Browse Fragrances"
            className="rounded-lg w-full min-w-0 min-h-[46px] flex items-center justify-center px-0 py-2 text-cream/60 hover:text-cream hover:bg-white/[0.06] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
>
            <Store className="w-[18px] h-[18px] text-gold flex-shrink-0" />
          </button>

          <button
            type="button"
            onClick={onReturnToStorefront}
            title="Public Store"
            aria-label="Public Store"
            className="rounded-lg w-full min-w-0 min-h-[46px] flex items-center justify-center px-0 py-2 text-cream/60 hover:text-cream hover:bg-white/[0.06] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <Globe className="w-[18px] h-[18px] flex-shrink-0" />
          </button>
        </div>
      </div>
    </aside>
  );
};