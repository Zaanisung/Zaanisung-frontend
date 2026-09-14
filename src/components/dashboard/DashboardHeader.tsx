import React from "react";
import { Logo } from "../Logo";
import { ShoppingBag } from "lucide-react";
import { FullscreenToggle } from "../ui/FullscreenToggle";

interface DashboardHeaderProps {
  cartCount: number;
  onOpenCart: () => void;
}

/**
 * Dashboard top bar. Deliberately NOT sticky and fully transparent: it scrolls
 * with the page and the cart chip simply floats in its spot as if part of the
 * content, so the header never reads as a separate solid slab.
 */
export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  cartCount,
  onOpenCart,
}) => {
  return (
    <div className="relative px-4 sm:px-8 xl:px-12 py-4 flex items-center justify-between gap-2 flex-nowrap">
      <div className="flex items-center gap-2 min-w-0 pl-1 lg:hidden">
        <Logo className="h-8 w-8 shrink-0" />
        <span className="text-[9px] uppercase tracking-widest bg-gold text-ink px-1.5 py-0.5 font-bold shrink-0 lg:hidden">
          ACCOUNT
        </span>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
        <FullscreenToggle />
        <button
          type="button"
          onClick={onOpenCart}
          className="relative min-h-[44px] min-w-[44px] rounded-full p-2 flex items-center justify-center text-ink/60 dark:text-white/60 bg-cream dark:bg-white/[0.06] border border-black/10 dark:border-white/15 hover:scale-[1.05] active:scale-[0.98] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          aria-label={`Open cart, ${cartCount} ${cartCount === 1 ? "item" : "items"}`}
          data-tour="shop-cart"
        >
          <ShoppingBag className="w-4 h-4 text-gold" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-gold text-ink text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold">
              {cartCount > 99 ? "99+" : cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
};