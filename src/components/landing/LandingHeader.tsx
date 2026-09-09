import React from "react";
import { ArrowRight } from "lucide-react";
import { CustomerUser } from "../../types";
import { Logo } from "../Logo";
import { Button } from "../Button";
import { ThemeToggle } from "../ThemeToggle";
import { navLinks } from "./constants";

interface LandingHeaderProps {
  isDark: boolean;
  isLoggedIn: boolean;
  currentUser: CustomerUser | null;
  onToggleTheme: () => void;
  onBrowseShop: () => void;
  onGoToLogin: () => void;
  onStartShopping: () => void;
  onOpenDashboard?: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  isDark,
  isLoggedIn,
  currentUser,
  onToggleTheme,
  onBrowseShop,
  onGoToLogin,
  onStartShopping,
  onOpenDashboard,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-white/70 dark:bg-black/55 backdrop-blur-xl">
      <div className="absolute top-0 inset-x-0 hairline-gold" aria-hidden="true" />
      <div className="w-full px-3 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between gap-3 flex-nowrap">
        <Logo
          className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
          showWordmark
          wordmarkClassName="hidden min-[480px]:inline text-base sm:text-lg tracking-[0.16em]"
        />

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
          <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
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