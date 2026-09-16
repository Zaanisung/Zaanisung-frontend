import React from "react";
import { CustomerTab } from "../types";
import { BottomNav } from "../components/BottomNav";
import { Logo } from "../components/Logo";
import { Footer } from "../components/Footer";
import { ErrorBoundary } from "../components/ui/Fallback";
import { FullscreenToggle } from "../components/ui/FullscreenToggle";
import { ShoppingBag } from "lucide-react";
import { cn } from "../utils/cn";

export interface CustomerLayoutProps {
  children: React.ReactNode;
  activeTab: CustomerTab;
  onChangeTab: (tab: CustomerTab) => void;
  cartCount: number;
  onNavigateHome?: () => void;
  onNavigateSection?: (section: "collections" | "about" | "craft") => void;
  userName?: string;
  onOpenDashboard?: () => void;
}

const TABS: { id: CustomerTab; label: string }[] = [
  { id: "shop", label: "Shop" },
  { id: "orders", label: "Orders" },
  { id: "account", label: "Account" },
];

export const CustomerLayout: React.FC<CustomerLayoutProps> = ({
  children,
  activeTab,
  onChangeTab,
  cartCount,
  onNavigateHome,
  onNavigateSection,
  userName,
  onOpenDashboard,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-cream dark:bg-black text-ink dark:text-white transition-colors">
      {/* Glass header */}
      <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-white/75 dark:bg-black/60 backdrop-blur-xl shadow-hairline-inset">
        <div className="absolute top-0 inset-x-0 hairline-gold" aria-hidden="true" />
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between gap-3 flex-nowrap">
          <div className="flex items-center space-x-6 lg:space-x-8 min-w-0">
            <button
              type="button"
              onClick={() => (onNavigateHome ? onNavigateHome() : onChangeTab("shop"))}
              className="text-left focus:outline-none flex items-center gap-3 shrink-0"
              aria-label="Zaanisung home"
            >
              <Logo className="h-9 sm:h-10" showWordmark />
            </button>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center space-x-8" aria-label="Primary">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onChangeTab(tab.id)}
                  className={cn(
                    "relative min-h-[44px] inline-flex items-center text-xs uppercase tracking-[0.18em] font-semibold transition-colors",
                    activeTab === tab.id
                      ? "text-ink dark:text-white"
                      : "text-black/50 dark:text-white/50 hover:text-ink dark:hover:text-white"
                  )}
                >
                  {tab.label}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-[2px] bg-gold transition-transform origin-left",
                      activeTab === tab.id ? "scale-x-100" : "scale-x-0"
                    )}
                  />
                </button>
              ))}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
            {userName && onOpenDashboard && (
              <button
                type="button"
                onClick={onOpenDashboard}
                aria-label={`My Dashboard (${userName})`}
                title="My Dashboard"
                className="relative h-11 w-11 flex items-center justify-center rounded-full bg-ink dark:bg-gold text-cream dark:text-ink font-bold text-sm border-2 border-gold/70 dark:border-ink hover:border-gold transition-colors"
              >
                {userName.charAt(0).toUpperCase()}
              </button>
            )}
            <button
              type="button"
              onClick={() => onChangeTab("cart")}
              className="relative p-2 min-h-[44px] min-w-[44px] rounded-lg flex items-center justify-center text-ink dark:text-white hover:text-gold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] backdrop-blur-md hover:scale-[1.05] active:scale-[0.98]"
              aria-label="Open cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gold text-ink text-[10px] min-w-5 h-5 px-1 rounded-full flex items-center justify-center font-bold">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main page area */}
      <main className="flex-1 w-full px-4 sm:px-8 xl:px-12 py-6 sm:py-10 pb-28 lg:pb-14">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>

      <Footer
        onNavigate={(target) => {
          if (target === "about") {
            onNavigateSection?.("about");
          } else if (target === "home") {
            onNavigateHome?.();
          } else if (target === "shop") {
            onChangeTab("shop");
          } else if (target === "orders") {
            onChangeTab("orders");
          } else if (target === "account") {
            onChangeTab("account");
          }
        }}
      />

      <BottomNav activeTab={activeTab} onChangeTab={onChangeTab} cartCount={cartCount} />

      <FullscreenToggle className="fixed right-4 bottom-[calc(4rem+env(safe-area-inset-bottom)+0.625rem)] lg:right-6 lg:bottom-6 z-50" />
    </div>
  );
};