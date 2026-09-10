import React, { useState } from "react";
import type { DashboardNavPage, DashboardPage } from "../types";
import { Loader } from "../components/ui/Loader";
import { ErrorBoundary } from "../components/ui/Fallback";
import { Sidebar } from "../components/dashboard/Sidebar";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { MobilePageTitle } from "../components/dashboard/MobilePageTitle";
import { MobileNavDrawer } from "../components/dashboard/MobileNavDrawer";
import { MobileBottomNav } from "../components/dashboard/MobileBottomNav";
import { currentPageLabel } from "../components/dashboard/navigation";
import { STORAGE_KEYS } from "../constants";

export interface UserDashboardLayoutProps {
  children: React.ReactNode;
  activePage: DashboardPage;
  onNavigate: (page: DashboardNavPage) => void;
  onOpenCart: () => void;
  cartCount: number;
  userName: string;
  isDark: boolean;
  onToggleTheme: () => void;
  onReturnToStorefront: () => void;
  onLogout?: () => void;
  loading?: boolean;
}

export const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({
  children,
  activePage,
  onNavigate,
  onOpenCart,
  cartCount,
  userName,
  isDark,
  onToggleTheme,
  onReturnToStorefront,
  onLogout,
  loading = false,
}) => {
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === "1";
  });
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(
        STORAGE_KEYS.SIDEBAR_COLLAPSED,
        next ? "1" : "0"
      );
      return next;
    });
  };

  const handleNavigate = (page: DashboardNavPage) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  return (
    <div className="min-h-screen text-ink dark:text-white flex flex-col md:flex-row bg-cream dark:bg-black weave-bg">
      <Sidebar
        activePage={activePage}
        userName={userName}
        isDark={isDark}
        collapsed={collapsed}
        onToggleTheme={onToggleTheme}
        onNavigate={handleNavigate}
        onToggleCollapsed={toggleCollapsed}
        onReturnToStorefront={onReturnToStorefront}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          cartCount={cartCount}
          isDark={isDark}
          pageLabel={currentPageLabel(activePage)}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenCart={onOpenCart}
          onToggleTheme={onToggleTheme}
        />

        <MobilePageTitle activePage={activePage} />

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-8 lg:px-12 py-6 sm:py-8 pb-24 md:pb-12">
          {loading ? (
            <div className="flex items-center justify-center py-20" role="status">
              <Loader variant="ring" size="lg" />
            </div>
          ) : (
            <ErrorBoundary>{children}</ErrorBoundary>
          )}
        </main>
      </div>

      <MobileNavDrawer
        open={menuOpen}
        activePage={activePage}
        userName={userName}
        onClose={() => setMenuOpen(false)}
        onNavigate={handleNavigate}
        onReturnToStorefront={() => {
          setMenuOpen(false);
          onReturnToStorefront();
        }}
        onLogout={onLogout}
      />

      <MobileBottomNav
        activePage={activePage}
        cartCount={cartCount}
        onNavigate={handleNavigate}
      />
    </div>
  );
};