import React from "react";
import type { AppRouterProps } from "./props";
import type { DashboardNavPage } from "../types";
import { dashboardNavView } from "./navigation";
import { UserDashboardLayout } from "../layouts/UserDashboardLayout";
import { Overview } from "../pages/dashboard/Overview";
import { Shop } from "../pages/Shop";
import { ProductDetails } from "../pages/ProductDetails";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { OrderConfirmation } from "../pages/OrderConfirmation";
import { Orders } from "../pages/Orders";
import { Addresses } from "../pages/dashboard/Addresses";
import { PaymentMethods } from "../pages/dashboard/PaymentMethods";
import { Notifications } from "../pages/dashboard/Notifications";
import { Settings } from "../pages/dashboard/Settings";

type Props = Pick<
  AppRouterProps,
  | "view"
  | "products"
  | "orders"
  | "cart"
  | "customerUser"
  | "isLoadingProducts"
  | "productsError"
  | "recentlyAddedId"
  | "lastConfirmedOrder"
  | "totalCartCount"
  | "notifications"
  | "updatingProfile"
  | "changingPassword"
  | "profileError"
  | "profileMessage"
  | "passwordError"
  | "passwordMessage"
  | "isDark"
  | "onToggleTheme"
  | "onNavigate"
  | "onAddToCart"
  | "onUpdateCartQuantity"
  | "onRemoveCartItem"
  | "onPlaceOrder"
  | "onRetryProducts"
  | "onCustomerLogout"
  | "onUpdateProfile"
  | "onChangePassword"
  | "onAddAddress"
  | "onUpdateAddress"
  | "onDeleteAddress"
  | "onSetDefaultAddress"
  | "onAddPaymentMethod"
  | "onDeletePaymentMethod"
  | "onSetDefaultPaymentMethod"
  | "onUpdateAppearance"
  | "onUpdateNotificationPrefs"
  | "onMarkNotificationRead"
  | "onMarkAllNotificationsRead"
>;

/** Account dashboard views (no marketing footer). Expects `view.type === "dashboard"`. */
export const DashboardRouter: React.FC<Props> = ({
  view,
  products,
  orders,
  cart,
  customerUser,
  isLoadingProducts,
  productsError,
  recentlyAddedId,
  lastConfirmedOrder,
  totalCartCount,
  notifications,
  updatingProfile,
  changingPassword,
  profileError,
  profileMessage,
  passwordError,
  passwordMessage,
  isDark,
  onToggleTheme,
  onNavigate,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onPlaceOrder,
  onRetryProducts,
  onCustomerLogout,
  onUpdateProfile,
  onChangePassword,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  onSetDefaultPaymentMethod,
  onUpdateAppearance,
  onUpdateNotificationPrefs,
  onMarkNotificationRead,
  onMarkAllNotificationsRead,
}) => {
  if (view.type !== "dashboard") return null;

  const navigate: (page: DashboardNavPage) => void = (page) => {
    onNavigate(dashboardNavView(page));
  };

  return (
    <UserDashboardLayout
      activePage={view.page}
      onNavigate={navigate}
      onOpenCart={() => onNavigate({ type: "dashboard", page: "cart" })}
      cartCount={totalCartCount}
      userName={customerUser?.name || ""}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      onReturnToStorefront={() => onNavigate({ type: "landing" })}
      onLogout={onCustomerLogout}
    >
      {view.page === "overview" && (
        <Overview
          user={customerUser}
          orders={orders}
          products={products}
          onNavigate={(page) => onNavigate(dashboardNavView(page))}
        />
      )}

      {view.page === "shop" && (
        <Shop
          products={products}
          isLoading={isLoadingProducts}
          error={productsError}
          onRetry={onRetryProducts}
          onSelectProduct={(p) =>
            onNavigate({ type: "dashboard", page: "product-details", productId: p.id })
          }
          onAddToCart={(p) => onAddToCart(p, 1)}
          recentlyAddedId={recentlyAddedId}
        />
      )}

      {view.page === "product-details" &&
        (() => {
          const product = products.find((p) => p.id === view.productId);
          if (!product)
            return (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="py-12 text-center text-black/50 dark:text-white/50">Fragrance not found.</div>
              </div>
            );
          return (
            <ProductDetails
              product={product}
              onBack={() => onNavigate({ type: "dashboard", page: "shop" })}
              onAddToCart={(p, qty) => onAddToCart(p, qty)}
              onBuyNow={(p, qty) => {
                onAddToCart(p, qty);
                onNavigate({ type: "dashboard", page: "cart" });
              }}
            />
          );
        })()}

      {view.page === "cart" && (
        <Cart
          items={cart}
          products={products}
          onUpdateQuantity={onUpdateCartQuantity}
          onRemoveItem={onRemoveCartItem}
          onProceedToCheckout={() => onNavigate({ type: "dashboard", page: "checkout" })}
          onContinueShopping={() => onNavigate({ type: "dashboard", page: "shop" })}
        />
      )}

      {view.page === "checkout" && (
        <Checkout
          items={cart}
          defaultName={customerUser?.name || ""}
          defaultPhone={customerUser?.phone || ""}
          onBackToCart={() => onNavigate({ type: "dashboard", page: "cart" })}
          onPlaceOrder={onPlaceOrder}
        />
      )}

      {view.page === "order-confirmation" &&
        (() => {
          const order = orders.find((o) => o.id === view.orderId) || lastConfirmedOrder;
          if (!order)
            return (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="py-12 text-center">
                  <p className="text-black/50 dark:text-white/50">No order found.</p>
                </div>
              </div>
            );
          return (
            <OrderConfirmation
              order={order}
              onViewOrder={() => onNavigate({ type: "dashboard", page: "orders" })}
              onContinueShopping={() => onNavigate({ type: "dashboard", page: "shop" })}
            />
          );
        })()}

      {view.page === "orders" && (
        <Orders
          orders={orders}
          onContinueShopping={() => onNavigate({ type: "dashboard", page: "shop" })}
        />
      )}

      {view.page === "addresses" && (
        <Addresses
          addresses={customerUser?.addresses || []}
          onAddAddress={onAddAddress}
          onUpdateAddress={onUpdateAddress}
          onDeleteAddress={onDeleteAddress}
          onSetDefaultAddress={onSetDefaultAddress}
        />
      )}

      {view.page === "payment-methods" && (
        <PaymentMethods
          paymentMethods={customerUser?.paymentMethods || []}
          onAddPaymentMethod={onAddPaymentMethod}
          onDeletePaymentMethod={onDeletePaymentMethod}
          onSetDefaultPaymentMethod={onSetDefaultPaymentMethod}
        />
      )}

      {view.page === "notifications" && (
        <Notifications
          notifications={notifications}
          onMarkRead={onMarkNotificationRead}
          onMarkAllRead={onMarkAllNotificationsRead}
        />
      )}

      {view.page === "settings" && (
        <Settings
          user={customerUser}
          updatingProfile={updatingProfile}
          changingPassword={changingPassword}
          profileError={profileError}
          passwordError={passwordError}
          profileMessage={profileMessage}
          passwordMessage={passwordMessage}
          onUpdateProfile={onUpdateProfile}
          onChangePassword={onChangePassword}
          onUpdateAppearance={onUpdateAppearance}
          onUpdateNotificationPrefs={onUpdateNotificationPrefs}
          onLogout={onCustomerLogout}
        />
      )}
    </UserDashboardLayout>
  );
};