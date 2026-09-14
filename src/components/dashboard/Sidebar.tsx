import React from "react";
import type { DashboardPage, DashboardNavPage } from "../../types";
import { Logo } from "../Logo";
import { cn } from "../../utils/cn";
import { ACCOUNT_NAV, isNavActive } from "./navigation";
import { Store, Globe } from "lucide-react";

interface SidebarProps {
  activePage: DashboardPage;
  onNavigate: (page: DashboardNavPage) => void;
  onReturnToStorefront: () => void;
}

/**
 * Desktop navigation keeps labels visible so account tasks do not depend on
 * remembering an icon legend.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onNavigate,
  onReturnToStorefront,
}) => {
  return (
    <aside
      className="hidden lg:flex flex-col bg-ink text-cream/75 flex-shrink-0 sticky top-0 h-screen w-[236px] overflow-hidden"
      aria-label="Dashboard sidebar"
    >
      {/* Gold hairline along the top edge */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gold z-20" aria-hidden="true" />
      <div className="relative flex flex-col flex-1 py-7 px-3">
        <div
          className="absolute -top-24 -right-24 w-44 h-44 orb orb-gold-faint"
          aria-hidden="true"
        />

        {/* Header — logo only, no text, no frame */}
        <div className="relative flex items-center px-2 pb-5">
          <Logo className="h-9 w-9" />
        </div>

        {/* Nav */}
        <nav
          className="flex flex-col gap-1 py-5"
          aria-label="Dashboard Navigation"
          data-tour="dash-nav"
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
                    aria-label={item.label}
                    className={cn(
                      "rounded-xl w-full min-w-0 min-h-[46px] flex items-center gap-3 px-3 py-2 text-left",
                      "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                      active
                        ? "bg-gold text-ink shadow-[0_4px_16px_-8px_rgba(212,175,55,0.38)]"
                        : "text-cream/55 hover:text-cream hover:bg-white/[0.06]"
                    )}
                    >
                    <Icon
                      className={cn(
                        "w-[18px] h-[18px] flex-shrink-0",
                        active && "stroke-[2.2]"
                      )}
                    />
                    <span className="text-xs font-semibold tracking-wide">{item.label}</span>
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
            aria-label="Browse Fragrances"
            className="rounded-xl w-full min-w-0 min-h-[46px] flex items-center gap-3 px-3 py-2 text-cream/60 hover:text-cream hover:bg-white/[0.06] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
>
            <Store className="w-[18px] h-[18px] text-gold flex-shrink-0" />
            <span className="text-xs font-semibold tracking-wide">Browse fragrances</span>
          </button>

          <button
            type="button"
            onClick={onReturnToStorefront}
            aria-label="Public Store"
            className="rounded-xl w-full min-w-0 min-h-[46px] flex items-center gap-3 px-3 py-2 text-cream/60 hover:text-cream hover:bg-white/[0.06] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <Globe className="w-[18px] h-[18px] flex-shrink-0" />
            <span className="text-xs font-semibold tracking-wide">Public store</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
