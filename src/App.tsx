import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AnnouncementBar } from './components/storefront/AnnouncementBar';
import { StorefrontHeader } from './components/storefront/StorefrontHeader';
import { StorefrontFooter } from './components/storefront/StorefrontFooter';
import { CartDrawer } from './components/storefront/CartDrawer';
import { SearchOverlay } from './components/storefront/SearchOverlay';
import { ToastContainer } from './components/common/ToastContainer';
import { IntegrationGuideModal } from './components/dev/IntegrationGuideModal';

// Storefront Pages
import { HomePage } from './pages/storefront/HomePage';
import { CatalogPage } from './pages/storefront/CatalogPage';
import { ProductDetailPage } from './pages/storefront/ProductDetailPage';
import { CartPage } from './pages/storefront/CartPage';
import { CheckoutPage } from './pages/storefront/CheckoutPage';
import { OrderConfirmationPage } from './pages/storefront/OrderConfirmationPage';
import { AuthPages } from './pages/storefront/AuthPages';
import { AccountPage } from './pages/storefront/AccountPage';
import { AboutPage } from './pages/storefront/AboutPage';
import { ContactPage } from './pages/storefront/ContactPage';
import { LegalPage } from './pages/storefront/LegalPage';
import { NotFoundPage } from './pages/storefront/NotFoundPage';

// Admin Pages & Shell
import { AdminSidebar } from './components/admin/AdminSidebar';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminProductFormPage } from './pages/admin/AdminProductFormPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

import { FileCode2 } from 'lucide-react';

const MainRouter: React.FC = () => {
  const { currentRoute, setIsIntegrationDocsOpen } = useApp();

  const isAdminRoute = currentRoute.startsWith('admin-');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F4] text-[#171512] font-sans">
      {isAdminRoute ? (
        /* Administrator Experience Shell */
        <div className="flex flex-1 min-h-screen">
          <AdminSidebar />
          <main key={currentRoute} className="flex-1 flex flex-col min-w-0 overflow-y-auto animate-fade-in">
            {currentRoute === 'admin-dashboard' && <AdminDashboardPage />}
            {currentRoute === 'admin-products' && <AdminProductsPage />}
            {currentRoute === 'admin-product-new' && <AdminProductFormPage />}
            {currentRoute === 'admin-product-edit' && <AdminProductFormPage />}
            {currentRoute === 'admin-orders' && <AdminOrdersPage />}
            {currentRoute === 'admin-users' && <AdminUsersPage />}
            {currentRoute === 'admin-settings' && <AdminSettingsPage />}
          </main>
        </div>
      ) : (
        /* Storefront Experience Shell */
        <>
          <AnnouncementBar />
          <StorefrontHeader />
          <main key={currentRoute} className="flex-1 animate-fade-in">
            {currentRoute === 'home' && <HomePage />}
            {currentRoute === 'catalog' && <CatalogPage />}
            {currentRoute === 'product-detail' && <ProductDetailPage />}
            {currentRoute === 'cart' && <CartPage />}
            {currentRoute === 'checkout' && <CheckoutPage />}
            {currentRoute === 'order-confirmation' && <OrderConfirmationPage />}
            {(currentRoute === 'login' ||
              currentRoute === 'register' ||
              currentRoute === 'forgot-password' ||
              currentRoute === 'verify-otp' ||
              currentRoute === 'reset-password') && <AuthPages />}
            {currentRoute === 'account' && <AccountPage />}
            {currentRoute === 'about' && <AboutPage />}
            {currentRoute === 'contact' && <ContactPage />}
            {currentRoute === 'legal' && <LegalPage />}
            {currentRoute === 'not-found' && <NotFoundPage />}
          </main>
          <StorefrontFooter />
        </>
      )}

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <SearchOverlay />
      <ToastContainer />
      <IntegrationGuideModal />

      {/* Floating Developer & Reviewer Specs Trigger (Accessible on all screens) */}
      <button
        onClick={() => setIsIntegrationDocsOpen(true)}
        title="View Integration Architecture & 50-Screen Matrix"
        className="fixed bottom-4 left-4 z-40 bg-[#171512] hover:bg-[#2A241F] text-[#B69A59] border border-[#B69A59]/40 shadow-lg px-3 py-1.5 rounded-xs text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-xs hover:scale-105"
      >
        <FileCode2 size={13} />
        <span>Integration Specs & Matrix</span>
      </button>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
