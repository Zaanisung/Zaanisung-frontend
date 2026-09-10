import React from "react";
import { Logo } from "../Logo";
import { ThemeToggle } from "../ThemeToggle";
import { Menu, ShoppingBag } from "lucide-react";

interface DashboardHeaderProps {
  cartCount: number;
  isDark: boolean;
  pageLabel: string;
  onOpenMenu: () => void;
  onOpenCart: () => void;
  onToggleTheme: () => void;
}

/** Sticky top bar shown on every screen size (with the cart always visible). */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  cartCount,
  isDark,
  pageLabel,
  onOpenMenu,
  onOpenCart,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-white/75 dark:bg-black/60 backdrop-blur-xl px-3 py-3 flex items-center justify-between gap-2 flex-nowrap">
      <div className="flex items-center gap-1 min-w-0 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenMenu}
          aria-label="Open navigation menu"
          className="min-h-[44px] min-w-[44px] p-2 flex items-center justify-center text-ink/60 dark:text-white/60 hover:text-gold transition-colors md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 min-w-0 pl-1">
          <Logo className="h-8 w-8 shrink-0" />
          <h2 className="font-brand-serif text-base tracking-[0.14em] font-light text-ink dark:text-white hidden min-[380px]:inline leading-none">
            ZAANISUNG
          </h2>
          {/* Desktop page label */}
          <span className="hidden md:inline-flex items-center text-[10px] uppercase tracking-widest text-black/50 dark:text-white/60 font-semibold pl-4 border-l border-black/10 dark:border-white/15 min-w-0 truncate">
            {pageLabel}
          </span>
          {/* Mobile account chip */}
          <span className="text-[9px] uppercase tracking-widest bg-gold text-ink px-1.5 py-0.5 font-bold shrink-0 md:hidden">
            ACCOUNT
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={onOpenCart}
          className="relative min-h-[44px] min-w-[44px] rounded-lg p-2 flex items-center justify-center text-ink/60 dark:text-white/60 bg-white/60 dark:bg-white/[0.06] border border-black/10 dark:border-white/15 hover:scale-[1.05] active:scale-[0.98] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
        >
          <ShoppingBag className="w-4 h-4 text-gold" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gold text-ink text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
        <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </header>
  );
};