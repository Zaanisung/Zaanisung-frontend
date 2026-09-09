import React from "react";
import type { AppRouterProps } from "./props";
import { AdminRouter } from "./AdminRouter";
import { LandingRouter } from "./LandingRouter";
import { DashboardRouter } from "./DashboardRouter";
import { CustomerRouter } from "./CustomerRouter";

export type { AppRouterProps } from "./props";
export type {
  PlaceOrderData,
  PhysicalSaleData,
  NewProductData,
} from "./types";

/**
 * Top-level view dispatcher. Each view type (landing / customer / dashboard /
 * admin) is handled by a dedicated sub-router that receives only the props it
 * needs.
 */
export const AppRouter: React.FC<AppRouterProps> = (props) => {
  const { view } = props;
  if (view.type === "admin") return <AdminRouter {...props} />;
  if (view.type === "landing") return <LandingRouter {...props} />;
  if (view.type === "dashboard") return <DashboardRouter {...props} />;
  if (view.type === "customer") return <CustomerRouter {...props} />;
  return null;
};