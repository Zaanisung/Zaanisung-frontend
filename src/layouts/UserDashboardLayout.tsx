import React from "react";
import type { DashboardNavPage, DashboardPage } from "../types";
import { Loader } from "../components/ui/Loader";
import { ErrorBoundary } from "../components/ui/Fallback";
import { Sidebar } from "../components/dashboard/Sidebar";
import { DashboardHeader } from "../components/dashboard/DashboardHeader";
import { MobileBottomNav } from "../components/dashboard/MobileBottomNav";

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
  onReturnToStorefront,
  loading = false,
}) => {
  return (
    <div className="min-h-screen text-ink dark:text-white flex flex-col lg:flex-row bg-cream dark:bg-black">
      <Sidebar
        activePage={activePage}
        onNavigate={onNavigate}
        onReturnToStorefront={onReturnToStorefront}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          cartCount={cartCount}
          onOpenCart={onOpenCart}
        />

        {/* Page content — top padding matches sidebar's vertical start */}
        <main className="flex-1 px-4 sm:px-8 xl:px-12 py-6 pb-28 lg:pb-12">
          {loading ? (
            <div className="flex items-center justify-center py-20" role="status">
              <Loader variant="ring" size="lg" />
            </div>
          ) : (
            <ErrorBoundary>{children}</ErrorBoundary>
          )}
        </main>
      </div>

      <MobileBottomNav
        activePage={activePage}
        cartCount={cartCount}
        onNavigate={onNavigate}
      />
    </div>
  );
};