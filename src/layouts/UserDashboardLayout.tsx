import React, { useState } from "react";
import type { DashboardNavPage, DashboardPage } from "../types";
import { Loader } from "../components/ui/Loader";
import { ErrorBoundary } from "../components/ui/Fallback";
import { Sidebar } from "../components/dashboard/Sidebar";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { MobileNavDrawer } from "../components/dashboard/MobileNavDrawer";
import { MobileBottomNav } from "../components/dashboard/MobileBottomNav";
import { currentPageLabel } from "../components/dashboard/navigation";

export interface UserDashboardLayoutProps {
  children: React.ReactNode;
  activePage: DashboardPage;
  onNavigate: (page: DashboardNavPage) => void;
  onOpenCart: () => void;
  cartCount: number;
  userName: string;
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
  onReturnToStorefront,
  onLogout,
  loading = false,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleNavigate = (page: DashboardNavPage) => {
    setMenuOpen(false);
    onNavigate(page);
  };

  return (
    <div className="min-h-screen text-ink dark:text-white flex flex-col lg:flex-row bg-cream dark:bg-black">
      <Sidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        onReturnToStorefront={onReturnToStorefront}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          cartCount={cartCount}
          pageLabel={currentPageLabel(activePage)}
          onOpenMenu={() => setMenuOpen(true)}
          onOpenCart={onOpenCart}
        />

        {/* Page content */}
        <main className="flex-1 px-4 sm:px-8 xl:px-12 py-6 sm:py-8 pb-28 lg:pb-12">
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