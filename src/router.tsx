import type {
  Product,
  Order,
  OrderItem,
  OrderStatus,
  CustomerUser,
  CustomerTab,
  AdminTab,
  DashboardPage,
  AppView,
  FullUser,
  AppNotification,
  Address,
  PaymentMethod,
} from "./types";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { UserDashboardLayout } from "./layouts/UserDashboardLayout";
import { Landing } from "./pages/Landing";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Shop } from "./pages/Shop";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { Orders } from "./pages/Orders";
import { Account } from "./pages/Account";
import { AdminLogin } from "./pages/admin/AdminLogin";
import { Dashboard } from "./pages/admin/Dashboard";
import { Inventory } from "./pages/admin/Inventory";
import { AddProduct } from "./pages/admin/AddProduct";
import { EditProduct } from "./pages/admin/EditProduct";
import { RecordSale } from "./pages/admin/RecordSale";
import { Restock } from "./pages/admin/Restock";
import { AdminOrders } from "./pages/admin/Orders";
import { AdminAccount } from "./pages/admin/Account";
import { Overview } from "./pages/dashboard/Overview";
import { Addresses } from "./pages/dashboard/Addresses";
import { PaymentMethods } from "./pages/dashboard/PaymentMethods";
import { Notifications } from "./pages/dashboard/Notifications";
import { Settings } from "./pages/dashboard/Settings";

export interface PlaceOrderData {
  items: OrderItem[];
  total: number;
  customerName: string;
  customerPhone: string;
  deliveryAddress: string;
  digitalAddress?: string;
  paymentMethod: string;
}

export interface PhysicalSaleData {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  paymentMethod: string;
}

export interface NewProductData {
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  stock: number;
}

export interface AppRouterProps {
  view: AppView;
  products: Product[];
  orders: Order[];
  cart: OrderItem[];
  customerUser: FullUser | null;
  isAdminLoggedIn: boolean;
  customerTab: CustomerTab;
  adminTab: AdminTab;
  isLoadingProducts: boolean;
  productsError: string | null;
  recentlyAddedId: string | null;
  lastConfirmedOrder: Order | null;
  pendingOrdersCount: number;
  totalCartCount: number;
  notifications: AppNotification[];
  updatingProfile: boolean;
  changingPassword: boolean;
  profileError: string | null;
  profileMessage: string | null;
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (view: AppView) => void;
  onCustomerTabChange: (tab: CustomerTab) => void;
  onAdminTabChange: (tab: AdminTab) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveCartItem: (productId: string) => void;
  onPlaceOrder: (data: PlaceOrderData) => void;
  onConfirmPhysicalSale: (data: PhysicalSaleData) => void;
  onConfirmRestock: (productId: string, quantityAdded: number) => void;
  onAddProduct: (data: NewProductData) => void;
  onUpdateProduct: (product: Product) => void;
  onRemoveProduct: (productId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  onCreateAccount: (user: CustomerUser) => void;
  onRegister: (user: CustomerUser) => void;
  onLogin: (user: CustomerUser) => void;
  onLandingLogin: (user: CustomerUser) => void;
  onContinueAsGuest: () => void;
  onStartShopping: () => void;
  onGoToLogin: () => void;
  onRetryProducts: () => void;
  onAdminLoginSuccess: () => void;
  onAdminLogout: () => void;
  onCustomerLogout: () => void;
  onOpenDashboard: () => void;
  onUpdateProfile: (data: { name?: string; phone?: string; email?: string }) => void;
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => void;
  onAddAddress: (data: Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean }) => void;
  onUpdateAddress: (id: string, data: Partial<Omit<Address, "_id">>) => void;
  onDeleteAddress: (id: string) => void;
  onSetDefaultAddress: (id: string) => void;
  onAddPaymentMethod: (data: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }) => void;
  onDeletePaymentMethod: (id: string) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
  onUpdateAppearance: (data: { theme?: "light" | "dark" | "system"; accentColor?: string }) => void;
  onUpdateNotificationPrefs: (data: { orderUpdates?: boolean; promotions?: boolean; sms?: boolean; email?: boolean }) => void;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
}

export const AppRouter: React.FC<AppRouterProps> = ({
  view,
  products,
  orders,
  cart,
  customerUser,
  isAdminLoggedIn,
  customerTab,
  adminTab,
  isLoadingProducts,
  productsError,
  recentlyAddedId,
  lastConfirmedOrder,
  pendingOrdersCount,
  totalCartCount,
  isDark,
  onToggleTheme,
  onNavigate,
  onCustomerTabChange,
  onAdminTabChange,
  onAddToCart,
  onUpdateCartQuantity,
  onRemoveCartItem,
  onPlaceOrder,
  onConfirmPhysicalSale,
  onConfirmRestock,
  onAddProduct,
  onUpdateProduct,
  onRemoveProduct,
  onUpdateOrderStatus,
  onCreateAccount,
  onRegister,
  onLogin,
  onLandingLogin,
  onContinueAsGuest,
  onStartShopping,
  onGoToLogin,
  onRetryProducts,
  onAdminLoginSuccess,
  onAdminLogout,
  onCustomerLogout,
  notifications,
  updatingProfile,
  changingPassword,
  profileError,
  profileMessage,
  onOpenDashboard,
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
  // ─── ADMIN VIEWS ────────────────────────────────────────────────
  if (view.type === "admin") {
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
            if (!prodToEdit) return <div className="text-black/45 dark:text-white/45">Perfume not found.</div>;
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
  }

  // ─── LANDING (public, standalone) ───────────────────────────────
  if (view.type === "landing") {
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
        onSelectProduct={(p) =>
          onNavigate({ type: "customer", page: "product-details", productId: p.id })
        }
        onAddToCart={(p) => onAddToCart(p, 1)}
        recentlyAddedId={recentlyAddedId}
      />
    );
  }

  // ─── CUSTOMER DASHBOARD (dedicated, no footer) ──────────────────
  if (view.type === "dashboard") {
    const navigate: (page: DashboardPage) => void = (page) => {
      onNavigate({ type: "dashboard", page } as AppView);
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
      >
        {view.page === "overview" && (
          <Overview
            user={customerUser}
            orders={orders}
            products={products}
            onNavigate={(page) =>
              onNavigate({ type: "dashboard", page } as AppView)
            }
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
              return <div className="py-12 text-center text-black/50 dark:text-white/50">Fragrance not found.</div>;
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
              return <div className="py-12 text-center"><p className="text-black/50 dark:text-white/50">No order found.</p></div>;
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
            passwordError={profileError}
            profileMessage={profileMessage}
            onUpdateProfile={onUpdateProfile}
            onChangePassword={onChangePassword}
            onUpdateAppearance={onUpdateAppearance}
            onUpdateNotificationPrefs={onUpdateNotificationPrefs}
            onLogout={onCustomerLogout}
          />
        )}
      </UserDashboardLayout>
    );
  }

  // ─── CUSTOMER VIEWS ─────────────────────────────────────────────
  return (
    <CustomerLayout
      activeTab={customerTab}
      onChangeTab={onCustomerTabChange}
      cartCount={totalCartCount}
      isDark={isDark}
      onToggleTheme={onToggleTheme}
      onNavigateHome={() => onNavigate({ type: "landing" })}
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
          if (!product) return <div className="py-12 text-center text-black/50 dark:text-white/50">Fragrance not found.</div>;
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
          if (!order) return <div className="py-12 text-center"><p className="text-black/50 dark:text-white/50">No order found.</p></div>;
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