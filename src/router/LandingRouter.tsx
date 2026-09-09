import React from "react";
import type { AppRouterProps } from "./props";
import { Landing } from "../pages/Landing";

type Props = Pick<
  AppRouterProps,
  | "view"
  | "products"
  | "customerUser"
  | "isLoadingProducts"
  | "isDark"
  | "recentlyAddedId"
  | "onToggleTheme"
  | "onNavigate"
  | "onCreateAccount"
  | "onLandingLogin"
  | "onStartShopping"
  | "onGoToLogin"
  | "onOpenDashboard"
  | "onAddToCart"
>;

/** Public marketing landing page. Expects `view.type === "landing"`. */
export const LandingRouter: React.FC<Props> = ({
  view,
  products,
  customerUser,
  isLoadingProducts,
  isDark,
  recentlyAddedId,
  onToggleTheme,
  onNavigate,
  onCreateAccount,
  onLandingLogin,
  onStartShopping,
  onGoToLogin,
  onOpenDashboard,
  onAddToCart,
}) => {
  if (view.type !== "landing") return null;

  return (
    <Landing
      products={products}
      currentUser={customerUser}
      isLoadingProducts={isLoadingProducts}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      onCreateAccount={onCreateAccount}
      onLogin={onLandingLogin}
      onStartShopping={onStartShopping}
      onBrowseShop={onStartShopping}
      onGoToLogin={onGoToLogin}
      onOpenDashboard={onOpenDashboard}
      onSelectProduct={(p) =>
        onNavigate({ type: "customer", page: "product-details", productId: p.id })
      }
      onAddToCart={(p) => onAddToCart(p, 1)}
      recentlyAddedId={recentlyAddedId}
    />
  );
};