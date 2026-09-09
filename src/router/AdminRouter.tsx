import React from "react";
import type { AppRouterProps } from "./props";
import { AdminLayout } from "../layouts/AdminLayout";
import { AdminLogin } from "../pages/admin/AdminLogin";
import { Dashboard } from "../pages/admin/Dashboard";
import { Inventory } from "../pages/admin/Inventory";
import { AddProduct } from "../pages/admin/AddProduct";
import { EditProduct } from "../pages/admin/EditProduct";
import { RecordSale } from "../pages/admin/RecordSale";
import { Restock } from "../pages/admin/Restock";
import { AdminOrders } from "../pages/admin/Orders";
import { AdminAccount } from "../pages/admin/Account";

type Props = Pick<
  AppRouterProps,
  | "view"
  | "products"
  | "orders"
  | "adminTab"
  | "isAdminLoggedIn"
  | "isDark"
  | "pendingOrdersCount"
  | "onToggleTheme"
  | "onNavigate"
  | "onAdminTabChange"
  | "onCustomerTabChange"
  | "onRemoveProduct"
  | "onAddProduct"
  | "onUpdateProduct"
  | "onConfirmPhysicalSale"
  | "onConfirmRestock"
  | "onUpdateOrderStatus"
  | "onAdminLoginSuccess"
  | "onAdminLogout"
>;

/** Authenticated admin portal views. Expects `view.type === "admin"`. */
export const AdminRouter: React.FC<Props> = ({
  view,
  products,
  orders,
  adminTab,
  isAdminLoggedIn,
  isDark,
  pendingOrdersCount,
  onToggleTheme,
  onNavigate,
  onAdminTabChange,
  onCustomerTabChange,
  onRemoveProduct,
  onAddProduct,
  onUpdateProduct,
  onConfirmPhysicalSale,
  onConfirmRestock,
  onUpdateOrderStatus,
  onAdminLoginSuccess,
  onAdminLogout,
}) => {
  if (view.type !== "admin") return null;

  if (!isAdminLoggedIn) {
    return (
      <AdminLogin
        isDark={isDark}
        onToggleTheme={onToggleTheme}
        onLoginSuccess={onAdminLoginSuccess}
        onReturnToStorefront={() => onCustomerTabChange("shop")}
      />
    );
  }

  return (
    <AdminLayout
      activeTab={adminTab}
      onChangeTab={onAdminTabChange}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      pendingOrdersCount={pendingOrdersCount}
      onNavigateTo={(targetPage) => {
        if (targetPage === "add-product") onNavigate({ type: "admin", page: "add-product" });
        else if (targetPage === "record-sale") onNavigate({ type: "admin", page: "record-sale" });
        else if (targetPage === "restock") onNavigate({ type: "admin", page: "restock" });
      }}
      onReturnToStorefront={() => onCustomerTabChange("shop")}
    >
      {view.page === "dashboard" && (
        <Dashboard
          products={products}
          orders={orders}
          onNavigateTo={(target) => {
            if (target === "inventory") onAdminTabChange("inventory");
            else if (target === "orders") onAdminTabChange("orders");
            else if (target === "add-product") onNavigate({ type: "admin", page: "add-product" });
            else if (target === "record-sale") onNavigate({ type: "admin", page: "record-sale" });
            else if (target === "restock") onNavigate({ type: "admin", page: "restock" });
          }}
        />
      )}

      {view.page === "inventory" && (
        <Inventory
          products={products}
          onAddProduct={() => onNavigate({ type: "admin", page: "add-product" })}
          onEditProduct={(id) => onNavigate({ type: "admin", page: "edit-product", productId: id })}
          onRemoveProduct={onRemoveProduct}
          onQuickSale={(id) => onNavigate({ type: "admin", page: "record-sale", initialProductId: id })}
          onQuickRestock={(id) => onNavigate({ type: "admin", page: "restock", initialProductId: id })}
        />
      )}

      {view.page === "add-product" && (
        <AddProduct onBack={() => onAdminTabChange("inventory")} onSave={onAddProduct} />
      )}

      {view.page === "edit-product" &&
        (() => {
          const prodToEdit = products.find((p) => p.id === view.productId);
          if (!prodToEdit)
            return (
              <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-black/45 dark:text-white/45">Perfume not found.</div>
              </div>
            );
          return (
            <EditProduct
              product={prodToEdit}
              onBack={() => onAdminTabChange("inventory")}
              onUpdate={onUpdateProduct}
            />
          );
        })()}

      {view.page === "record-sale" && (
        <RecordSale
          products={products}
          initialProductId={view.initialProductId}
          onBack={() => onAdminTabChange("dashboard")}
          onConfirmSale={onConfirmPhysicalSale}
        />
      )}

      {view.page === "restock" && (
        <Restock
          products={products}
          initialProductId={view.initialProductId}
          onBack={() => onAdminTabChange("dashboard")}
          onConfirmRestock={onConfirmRestock}
        />
      )}

      {view.page === "orders" && (
        <AdminOrders orders={orders} onUpdateStatus={onUpdateOrderStatus} />
      )}

      {view.page === "account" && (
        <AdminAccount
          onLogout={onAdminLogout}
          onReturnToStore={() => onCustomerTabChange("shop")}
        />
      )}
    </AdminLayout>
  );
};