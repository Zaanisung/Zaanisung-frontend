import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, ShoppingBag, User, Menu, X, ShieldCheck } from 'lucide-react';

export const StorefrontHeader: React.FC = () => {
  const {
    navigateTo,
    currentRoute,
    cartCount,
    setIsSearchOpen,
    setIsCartDrawerOpen,
    currentUser,
    isAdmin,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', route: 'home' as const },
    { label: 'Fragrances', route: 'catalog' as const },
    { label: 'The Atelier', route: 'about' as const },
    { label: 'Contact', route: 'contact' as const },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F4]/95 backdrop-blur-md border-b border-[#E4DED3] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Zone 1: Logo */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => navigateTo('home')}
              className="text-left group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A59] flex items-center gap-2"
            >
              <img src="/assets/logo-mark.png" alt="Zaanisung" className="h-10 w-10 object-contain" />
              <span className="font-serif text-xl sm:text-2xl font-medium tracking-[0.25em] text-[#171512] transition-colors group-hover:text-[#B69A59]">
                ZAANISUNG
              </span>
            </button>
          </div>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.18em] font-medium text-[#716C64]">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.label}
                  onClick={() => navigateTo(link.route)}
                  className={`transition-colors hover:text-[#171512] whitespace-nowrap shrink-0 cursor-pointer pb-0.5 border-b-2 ${
                    isActive ? 'border-[#B69A59] text-[#171512]' : 'border-transparent'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Action Controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              aria-label="Open fragrance search"
              className="p-2 text-[#171512] hover:text-[#B69A59] transition-colors cursor-pointer"
            >
              <Search size={19} />
            </button>

            {/* Account Trigger */}
            <button
              onClick={() => navigateTo(currentUser ? 'account' : 'login')}
              aria-label={currentUser ? `Account: ${currentUser.name}` : 'Sign in to your account'}
              className="p-2 text-[#171512] hover:text-[#B69A59] transition-colors cursor-pointer relative"
            >
              <User size={19} />
              {currentUser && (
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#B69A59]" aria-hidden="true" />
              )}
            </button>

            {/* Shopping Flacon / Cart Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              aria-label={`Shopping bag with ${cartCount} items`}
              className="p-2 text-[#171512] hover:text-[#B69A59] transition-colors cursor-pointer relative flex items-center"
            >
              <ShoppingBag size={19} />
              {cartCount > 0 && (
                <span className="ml-1 text-xs font-semibold tabular-nums text-[#171512] bg-[#E4DED3] px-1.5 py-0.5 rounded-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Admin Switcher indicator if logged in as admin */}
            {isAdmin && (
              <button
                onClick={() => navigateTo('admin-dashboard')}
                title="Open Admin Dashboard"
                className="hidden lg:flex items-center gap-1.5 text-[11px] font-semibold text-[#B69A59] bg-[#171512] px-3 py-1.5 rounded-sm hover:bg-[#2A241F] transition-colors cursor-pointer"
              >
                <ShieldCheck size={14} />
                <span>Admin Console</span>
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="p-2 text-[#171512] md:hidden hover:text-[#B69A59] transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E4DED3] bg-[#FAF8F4] px-6 py-6 transition-all">
          <nav className="flex flex-col gap-4 text-sm font-medium tracking-wider uppercase text-[#171512]">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  navigateTo(link.route);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 border-b border-[#E4DED3]/60 hover:text-[#B69A59] transition-colors"
              >
                {link.label}
              </button>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  navigateTo(currentUser ? 'account' : 'login');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 text-xs uppercase tracking-widest text-[#716C64] hover:text-[#171512]"
              >
                {currentUser ? `Account (${currentUser.name})` : 'Sign In / Register'}
              </button>
              {isAdmin && (
                <button
                  onClick={() => {
                    navigateTo('admin-dashboard');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 text-xs uppercase tracking-widest text-[#B69A59] font-semibold"
                >
                  Administrator Console
                </button>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
