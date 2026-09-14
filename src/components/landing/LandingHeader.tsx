import React, { useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { CustomerUser } from "../../types";
import { Logo } from "../Logo";
import { Button } from "../Button";
import { NavbarKenteBorder } from "../ui/NavbarKenteBorder";
import { navLinks } from "./constants";

interface LandingHeaderProps {
  isLoggedIn: boolean;
  currentUser: CustomerUser | null;
  onBrowseShop: () => void;
  onGoToLogin: () => void;
  onStartShopping: () => void;
  onOpenDashboard?: () => void;
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({
  isLoggedIn,
  currentUser,
  onBrowseShop,
  onGoToLogin,
  onStartShopping,
  onOpenDashboard,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-[#fffdf9]/95 dark:bg-black/90 backdrop-blur-xl">
      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between gap-3 flex-nowrap">
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
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-full border border-black/10 dark:border-white/15 text-ink dark:text-white"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav className="md:hidden border-t border-black/10 dark:border-white/10 bg-[#fffdf9] dark:bg-[#101010] px-4 py-4 grid grid-cols-2 gap-2" aria-label="Mobile primary navigation">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={closeMenu} className="min-h-[48px] px-4 flex items-center rounded-xl border border-black/10 dark:border-white/10 text-xs uppercase tracking-widest font-bold">
              {link.label}
            </a>
          ))}
          <button type="button" onClick={() => { closeMenu(); onBrowseShop(); }} className="min-h-[48px] px-4 flex items-center rounded-xl bg-ink dark:bg-gold text-cream dark:text-ink text-xs uppercase tracking-widest font-bold text-left">
            Shop all
          </button>
        </nav>
      )}
      <NavbarKenteBorder />
    </header>
  );
};
