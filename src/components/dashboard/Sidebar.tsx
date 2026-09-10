import React from "react";
import type { DashboardPage, DashboardNavPage } from "../../types";
import { Logo } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";
import { cn } from "../../utils/cn";
import { ACCOUNT_NAV, isNavActive } from "./navigation";
import { Store, PanelLeftClose, PanelLeftOpen } from "lucide-react";

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

/** Desktop sidebar for the account dashboard. */
export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  userName,
  isDark,
  collapsed,
  onToggleTheme,
  onNavigate,
  onToggleCollapsed,
  onReturnToStorefront,
}) => {
  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-ink text-cream/75 flex-shrink-0 sticky top-0 h-screen overflow-y-auto scrollbar-none transition-[width] duration-300 ease-in-out weave-bg",
        collapsed ? "w-[76px]" : "w-[260px] lg:w-[280px]"
      )}
      aria-label="Dashboard sidebar"
    >
      {/* Kente crown — woven Ghanaian trim along the top edge */}
      <div className="absolute top-0 inset-x-0 h-[6px] kente-band z-20" aria-hidden="true" />
      <div
        className={cn(
          "relative flex flex-col min-h-full p-6",
          collapsed && "px-3"
        )}
      >
        <div
          className={cn(
            "absolute -top-24 orb orb-gold-faint",
            collapsed ? "-right-24 w-44 h-44" : "-right-16 w-56 h-56"
          )}
          aria-hidden="true"
        />

        {/* Header */}
        <div
          className={cn(
            "relative pb-6 border-b border-white/10",
            collapsed && "flex items-center justify-center border-b-0 pb-4"
          )}
        >
          <div
            className={cn(
              "flex items-center justify-between",
              collapsed && "justify-center"
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3",
                collapsed && "justify-center"
              )}
            >
              <Logo className="h-8 w-8 flex-shrink-0" />
              <div className={cn(collapsed && "hidden")}>
                <h2 className="font-brand-serif text-lg tracking-[0.14em] font-light text-cream leading-none">
                  ZAANISUNG
                </h2>
                <span className="text-[9px] uppercase tracking-widest text-gold mt-1 block font-semibold">
                  My Account
                </span>
              </div>
            </div>
            {!collapsed && <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />}
          </div>
          {!collapsed && (
            <p className="eyebrow text-cream/40 mt-4">
              Welcome{userName ? `, ${userName.split(" ")[0]}` : ""}
            </p>
          )}
        </div>

        {/* Nav */}
        <nav className="flex flex-col py-5" aria-label="Dashboard Navigation">
          {ACCOUNT_NAV.map((group) => (
            <div key={group.group}>
              {!collapsed && (
                <div className="eyebrow text-cream/40 px-3 pb-2.5">
                  {group.group}
                </div>
              )}
              <div className="flex flex-col gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.id, activePage);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      title={collapsed ? item.label : undefined}
                      aria-label={collapsed ? item.label : undefined}
                      className={cn(
                        "rounded-lg relative w-full min-w-0 min-h-[46px] text-xs uppercase tracking-widest font-semibold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center gap-3",
                        collapsed
                          ? "justify-center px-0"
                          : "px-3.5 py-2.5",
                        active
                          ? "bg-gold text-ink font-bold shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_4px_16px_-4px_rgba(212,175,55,0.3)]"
                          : "text-cream/55 hover:text-cream hover:bg-white/[0.06]"
                      )}
                    >
                      {active && (
                        <span
                          className={cn(
                            "absolute top-1/2 -translate-y-1/2 w-[3px] h-6 bg-ink/30 rounded-full",
                            collapsed ? "left-1" : "left-2"
                          )}
                          aria-hidden="true"
                        />
                      )}
                      <Icon
                        className={cn(
                          "w-4 h-4 flex-shrink-0",
                          active && "stroke-[2.2]"
                        )}
                      />
                      {!collapsed && (
                        <span className="truncate min-w-0">{item.label}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: shop actions + collapse toggle */}
        <div className="flex flex-col gap-1 mt-auto">
          <div
            className={cn(
              "pt-5 mt-5 border-t border-white/10 flex flex-col gap-1",
              collapsed && "pt-4 mt-4 items-stretch border-t-0"
            )}
          >
            <button
              type="button"
              onClick={() => onNavigate("shop")}
              title="Browse Fragrances"
              aria-label="Browse Fragrances"
              className={cn(
                "rounded-lg w-full min-w-0 min-h-[46px] text-xs uppercase tracking-widest font-semibold text-cream/60 hover:text-cream hover:bg-white/[0.06] flex items-center gap-2.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                collapsed ? "justify-center px-0" : "px-3.5 py-2.5"
              )}
            >
              <Store className="w-4 h-4 text-gold flex-shrink-0" />
              {!collapsed && <span className="truncate min-w-0">Browse Fragrances</span>}
            </button>

            <button
              type="button"
              onClick={onReturnToStorefront}
              title="Public Store"
              aria-label="Public Store"
              className={cn(
                "rounded-lg w-full min-w-0 min-h-[46px] text-xs uppercase tracking-widest font-semibold text-cream/60 hover:text-cream hover:bg-white/[0.06] flex items-center gap-2.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                collapsed ? "justify-center px-0" : "px-3.5 py-2.5"
              )}
            >
              <Store className="w-4 h-4 text-gold flex-shrink-0" />
              {!collapsed && <span className="truncate min-w-0">Public Store</span>}
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
              "rounded-lg w-full min-w-0 min-h-[46px] text-xs uppercase tracking-widest font-semibold text-cream/60 hover:text-cream hover:bg-white/[0.06] flex items-center gap-2.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] mt-1",
              collapsed ? "justify-center px-0" : "px-3.5 py-2.5"
            )}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 flex-shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="truncate min-w-0">Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};