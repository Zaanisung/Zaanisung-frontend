import React from "react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { CustomerUser } from "../../types";
import { Logo } from "../Logo";
import { Button } from "../Button";
import { navLinks } from "./constants";

interface LandingHeaderProps {
  isLoggedIn: boolean;
  currentUser: CustomerUser | null;
  onBrowseShop: () => void;
  onGoToLogin: () => void;
  onStartShopping: () => void;
  onOpenDashboard?: () => void;
  onCartOpen: () => void;
  cartCount?: number;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  isLoggedIn,
  currentUser,
  onBrowseShop,
  onGoToLogin,
  onStartShopping,
  onOpenDashboard,
  onCartOpen,
  cartCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-[#fffdf9]/95 dark:bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between gap-3 flex-nowrap">
        <Logo className="h-9 sm:h-10 shrink-0" showWordmark />

        <nav className="hidden md:flex items-center space-x-9 text-xs uppercase tracking-[0.18em] font-semibold text-black/55 dark:text-white/55">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative inline-flex items-center min-h-[44px] group"
            >
              {link.label}
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </a>
          ))}
          <button
            type="button"
            onClick={onBrowseShop}
            className="relative inline-flex items-center min-h-[44px] group"
          >
            Shop All
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onCartOpen}
            aria-label={`Open bag (${cartCount} ${cartCount === 1 ? "item" : "items"})`}
            title="Open bag"
            className="relative h-11 w-11 flex items-center justify-center rounded-full border border-black/10 dark:border-white/15 text-ink dark:text-white hover:border-gold hover:text-gold transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-gold text-black text-[10px] font-bold flex items-center justify-center">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </button>

          {isLoggedIn ? (
            <>
              {onOpenDashboard && (
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  aria-label={`My Dashboard (${currentUser?.name ?? "User"})`}
                  title="My Dashboard"
                  className="relative h-11 w-11 flex items-center justify-center rounded-full bg-ink dark:bg-gold text-cream dark:text-ink font-bold text-sm border-2 border-gold/70 dark:border-ink hover:border-gold transition-colors"
                >
                  {(currentUser?.name ?? "U").charAt(0).toUpperCase()}
                </button>
              )}
              <Button variant="primary" size="md" onClick={onStartShopping}>
                Enter Store <ArrowRight className="w-4 h-4 ml-1 hidden min-[380px]:inline" />
              </Button>
            </>
          ) : (
            <Button variant="outline" size="md" onClick={onGoToLogin}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
