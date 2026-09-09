import React from "react";
import type { AppRouterProps } from "./props";
import { CustomerLayout } from "../layouts/CustomerLayout";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Shop } from "../pages/Shop";
import { ProductDetails } from "../pages/ProductDetails";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { OrderConfirmation } from "../pages/OrderConfirmation";
import { Orders } from "../pages/Orders";
import { Account } from "../pages/Account";

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
  | "customerTab"
  | "totalCartCount"
  | "isDark"
  | "onToggleTheme"
  | "onNavigate"
  | "onCustomerTabChange"
  | "onAddToCart"
  | "onUpdateCartQuantity"
  | "onRemoveCartItem"
  | "onPlaceOrder"
  | "onRetryProducts"
  | "onRegister"
  | "onLogin"
  | "onContinueAsGuest"
  | "onGoToLogin"
  | "onOpenDashboard"
  | "onCustomerLogout"
>;

/** Public storefront (customer layout with marketing footer). Expects `view.type === "customer"`. */
export const CustomerRouter: React.FC<Props> = ({
  view,
  products,
  orders,
  cart,
  customerUser,
  isLoadingProducts,
  productsError,
  recentlyAddedId,
  lastConfirmedOrder,
  customerTab,
  totalCartCount,
  isDark,
  onToggleTheme,
  onNavigate,
  onCustomerTabChange,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onPlaceOrder,
  onRetryProducts,
  onRegister,
  onLogin,
  onContinueAsGuest,
  onGoToLogin,
  onOpenDashboard,
  onCustomerLogout,
}) => {
  if (view.type !== "customer") return null;

  return (
    <CustomerLayout
      activeTab={customerTab}
      onChangeTab={onCustomerTabChange}
      cartCount={totalCartCount}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      onNavigateHome={() => onNavigate({ type: "landing" })}
      userName={customerUser?.name || ""}
      onOpenDashboard={onOpenDashboard}
    >
      {view.page === "login" && (
        <Login
          onLogin={onLogin}
          onNavigateToRegister={() => onNavigate({ type: "customer", page: "register" })}
          onContinueAsGuest={onContinueAsGuest}
        />
      )}

      {view.page === "register" && (
        <Register
          onRegister={onRegister}
          onNavigateToLogin={() => onNavigate({ type: "customer", page: "login" })}
        />
      )}

      {view.page === "shop" && (
        <Shop
          products={products}
          isLoading={isLoadingProducts}
          error={productsError}
          onRetry={onRetryProducts}
          onSelectProduct={(p) => onNavigate({ type: "customer", page: "product-details", productId: p.id })}
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
              onBack={() => onNavigate({ type: "customer", page: "shop" })}
              onAddToCart={(p, qty) => onAddToCart(p, qty)}
              onBuyNow={(p, qty) => {
                onAddToCart(p, qty);
                onNavigate({ type: "customer", page: "checkout" });
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
          onProceedToCheckout={() => onNavigate({ type: "customer", page: "checkout" })}
          onContinueShopping={() => onCustomerTabChange("shop")}
        />
      )}

      {view.page === "checkout" && (
        <Checkout
          items={cart}
          defaultName={customerUser?.name || ""}
          defaultPhone={customerUser?.phone || ""}
          onBackToCart={() => onNavigate({ type: "customer", page: "cart" })}
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
              onViewOrder={() => onCustomerTabChange("orders")}
              onContinueShopping={() => onCustomerTabChange("shop")}
            />
          );
        })()}

      {view.page === "orders" && (
        <Orders orders={orders} onContinueShopping={() => onCustomerTabChange("shop")} />
      )}

      {view.page === "account" && (
        <Account
          user={customerUser}
          onLogout={onCustomerLogout}
          onNavigateToLogin={onGoToLogin}
          onOpenDashboard={onOpenDashboard}
        />
      )}
    </CustomerLayout>
  );
};