import React from "react";
import type { AppRouterProps } from "./props";
import type { AppView } from "../types";
import { AdminRouter } from "./AdminRouter";
import { LandingRouter } from "./LandingRouter";
import { DashboardRouter } from "./DashboardRouter";
import { CustomerRouter } from "./CustomerRouter";
import { MiniCartDrawer } from "../components/MiniCartDrawer";

export type { AppRouterProps } from "./props";
export type {
  PlaceOrderData,
  PhysicalSaleData,
  NewProductData,
} from "./types";

/**
 * Top-level view dispatcher. Each view type (landing / customer / dashboard /
 * admin) is handled by a dedicated sub-router that receives only the props it
 * needs. The global mini-cart drawer is rendered here so it is available on
 * every shopping surface the moment an item is added.
 */
export const AppRouter: React.FC<AppRouterProps> = (props) => {
  const { view } = props;

  if (view.type === "admin") return <AdminRouter {...props} />;

  let body: React.ReactElement;
  if (view.type === "landing") body = <LandingRouter {...props} />;
  else if (view.type === "dashboard") body = <DashboardRouter {...props} />;
  else if (view.type === "customer") body = <CustomerRouter {...props} />;
  else return null;

  const isDashboard = view.type === "dashboard";
  const cartView: AppView = isDashboard
    ? { type: "dashboard", page: "cart" }
    : { type: "customer", page: "cart" };
  const checkoutView: AppView = isDashboard
    ? { type: "dashboard", page: "checkout" }
    : { type: "customer", page: "checkout" };
  const shopView: AppView = isDashboard
    ? { type: "dashboard", page: "shop" }
    : { type: "customer", page: "shop" };

  return (
    <>
      {body}
      <MiniCartDrawer
        open={props.isCartOpen}
        items={props.cart}
        products={props.products}
        onClose={props.onCartClose}
        onViewBag={() => {
          props.onCartClose();
          props.onNavigate(cartView);
        }}
        onCheckout={() => {
          props.onCartClose();
          props.onNavigate(checkoutView);
        }}
        onBrowse={() => {
          props.onCartClose();
          props.onNavigate(shopView);
        }}
        onUpdateQuantity={props.onUpdateCartQuantity}
        onRemoveItem={props.onRemoveCartItem}
      />
    </>
  );
};