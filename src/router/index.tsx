import React from "react";
import type {
  AppView,
  CustomerTab,
  AdminTab,
  DashboardNavPage,
  Product,
  Order,
  OrderItem,
  OrderStatus,
  CustomerUser,
  FullUser,
  AppNotification,
  Address,
  PaymentMethod,
} from "../types";
import type {
  PlaceOrderData,
  PhysicalSaleData,
  NewProductData,
} from "./types";

export type {
  PlaceOrderData,
  PhysicalSaleData,
  NewProductData,
} from "./types";

/**
 * Props for <AppRouter />. All state is owned by the useAppState hook; these
 * props are a read-only projection of it. There is deliberately no theme
 * toggle in here — theming is driven by the signed-in user's saved appearance
 * settings (or the OS scheme for guests).
 */
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
  isLoadingOrders: boolean;
  productsError: string | null;
  recentlyAddedId: string | null;
  lastConfirmedOrder: Order | null;
  isCartOpen: boolean;
  pendingOrdersCount: number;
  totalCartCount: number;
  notifications: AppNotification[];
  updatingProfile: boolean;
  changingPassword: boolean;
  profileError: string | null;
  profileMessage: string | null;
  passwordError: string | null;
  passwordMessage: string | null;
  isBootstrapping: boolean;
  isAuthModalOpen: boolean;
  onRequireSignIn: () => void;
  onCloseAuthModal: () => void;
  onAuthModalSuccess: (user: CustomerUser) => void;
  onNavigate: (view: AppView) => void;
  onCustomerTabChange: (tab: CustomerTab) => void;
  onAdminTabChange: (tab: AdminTab) => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onUpdateCartQuantity: (productId: string, quantity: number) => void;
  onRemoveCartItem: (productId: string) => void;
  onCartOpen: () => void;
  onCartClose: () => void;
  onPlaceOrder: (data: PlaceOrderData) => Promise<void>;
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
  onUpdateAppearance: (data: { accentColor?: string }) => void;
  onUpdateNotificationPrefs: (data: { orderUpdates?: boolean; promotions?: boolean; sms?: boolean; email?: boolean }) => void;
  onMarkNotificationRead: (id: string) => void;
  onMarkAllNotificationsRead: () => void;
}

/** Maps a dashboard nav page to its AppView (exhaustive by construction). */
function dashboardNavView(page: DashboardNavPage): AppView {
  switch (page) {
    case "overview":
      return { type: "dashboard", page: "overview" };
    case "shop":
      return { type: "dashboard", page: "shop" };
    case "cart":
      return { type: "dashboard", page: "cart" };
    case "checkout":
      return { type: "dashboard", page: "checkout" };
    case "orders":
      return { type: "dashboard", page: "orders" };
    case "addresses":
      return { type: "dashboard", page: "addresses" };
    case "payment-methods":
      return { type: "dashboard", page: "payment-methods" };
    case "notifications":
      return { type: "dashboard", page: "notifications" };
    case "settings":
      return { type: "dashboard", page: "settings" };
    case "profile":
      return { type: "dashboard", page: "profile" };
    case "security":
      return { type: "dashboard", page: "security" };
  }
}

/**
 * Single top-level view dispatcher for the whole app.
 *
 * Surfacing every view (landing / auth / storefront / dashboard / admin) in one
 * file keeps the mental model of the app small: the union of possible routes is
 * literally the `AppView` type, and each variant maps to exactly one subtree.
 * The global mini-cart drawer and the guest-checkout auth modal also live here
 * so they are available on every shopping surface.
 */
export const AppRouter: React.FC<AppRouterProps> = (props) => {
  const { view } = props;

  // ─── Admin portal ───────────────────────────────────────────────────
  if (view.type === "admin") {
    return (
      <AdminPortal
        {...props}
        activeTab={props.adminTab}
        isAdminLoggedIn={props.isAdminLoggedIn}
      />
    );
  }

  // ─── Landing page (deep-linkable sections) ──────────────────────────
  if (view.type === "landing") {
    return (
      <>
        <LandingPage {...props} initialSection={view.section} />
        <AppOverlays {...props} />
      </>
    );
  }

  // ─── Customer storefront & account dashboard ────────────────────────
  const isDashboard = view.type === "dashboard";

  let body: React.ReactElement;
  if (view.type === "customer") {
    body = <CustomerStore {...props} activeTab={props.customerTab} />;
  } else {
    body = <UserDashboard {...props} />;
  }

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
      <MiniCartLayer {...props} cartView={cartView} checkoutView={checkoutView} shopView={shopView} />
      <AppOverlays {...props} />
    </>
  );
};

// ─── Landing page ────────────────────────────────────────────────────────

const LandingPage: React.FC<AppRouterProps & { initialSection?: "collections" | "about" | "craft" }> = (props) => {
  const { products, customerUser, isLoadingProducts, initialSection } = props;
  return (
    <Landing
      products={products}
      currentUser={customerUser}
      isLoadingProducts={isLoadingProducts}
      initialSection={initialSection}
      onCreateAccount={props.onCreateAccount}
      onLogin={props.onLandingLogin}
      onStartShopping={props.onStartShopping}
      onBrowseShop={props.onStartShopping}
      onGoToLogin={props.onGoToLogin}
      onOpenDashboard={props.onOpenDashboard}
      onSelectProduct={(p) =>
        props.onNavigate({ type: "customer", page: "product-details", productId: p.id })
      }
      onAddToCart={(p) => props.onAddToCart(p, 1)}
      recentlyAddedId={props.recentlyAddedId}
    />
  );
};

// ─── Customer storefront (with footer; auth pages are standalone) ───────

const CustomerStore: React.FC<AppRouterProps & { activeTab: CustomerTab }> = (props) => {
  const { view, activeTab } = props;

  // Full-bleed auth pages render WITHOUT the storefront chrome.
  if (view.type !== "customer") return null;
  if (view.page === "login") {
    return (
      <Login
        onLogin={props.onLogin}
        onNavigateToRegister={() => props.onNavigate({ type: "customer", page: "register" })}
        onContinueAsGuest={props.onContinueAsGuest}
        onReturnToLanding={() => props.onNavigate({ type: "landing" })}
      />
    );
  }
  if (view.page === "register") {
    return (
      <Register
        onRegister={props.onRegister}
        onNavigateToLogin={() => props.onNavigate({ type: "customer", page: "login" })}
        onReturnToLanding={() => props.onNavigate({ type: "landing" })}
      />
    );
  }

  return (
    <CustomerLayout
      activeTab={activeTab}
      onChangeTab={props.onCustomerTabChange}
      cartCount={props.totalCartCount}
      onNavigateHome={() => props.onNavigate({ type: "landing" })}
      onNavigateSection={(section) => props.onNavigate({ type: "landing", section })}
      userName={props.customerUser?.name || ""}
      onOpenDashboard={props.onOpenDashboard}
    >
      {view.page === "shop" && (
        <Shop
          products={props.products}
          isLoading={props.isLoadingProducts}
          error={props.productsError}
          onRetry={props.onRetryProducts}
          onSelectProduct={(p) => props.onNavigate({ type: "customer", page: "product-details", productId: p.id })}
          onAddToCart={(p) => props.onAddToCart(p, 1)}
          recentlyAddedId={props.recentlyAddedId}
        />
      )}

      {view.page === "product-details" &&
        (() => {
          const product = props.products.find((p) => p.id === view.productId);
          if (!product)
            return (
              <NotFoundPage
                title="Fragrance not found"
                hint="The fragrance you're looking for is no longer available."
                onBack={() => props.onCustomerTabChange("shop")}
                onHome={() => props.onNavigate({ type: "landing" })}
              />
            );
          return (
            <ProductDetails
              product={product}
              onBack={() => props.onNavigate({ type: "customer", page: "shop" })}
              onAddToCart={(p, qty) => props.onAddToCart(p, qty)}
              onBuyNow={(p, qty) => {
                props.onAddToCart(p, qty);
                props.onNavigate({ type: "customer", page: "checkout" });
              }}
            />
          );
        })()}

      {view.page === "cart" && (
        <Cart
          items={props.cart}
          products={props.products}
          onUpdateQuantity={props.onUpdateCartQuantity}
          onRemoveItem={props.onRemoveCartItem}
          onProceedToCheckout={() => props.onNavigate({ type: "customer", page: "checkout" })}
          onContinueShopping={() => props.onCustomerTabChange("shop")}
        />
      )}

      {view.page === "checkout" && (
        <Checkout
          items={props.cart}
          defaultName={props.customerUser?.name || ""}
          defaultPhone={props.customerUser?.phone || ""}
          onBackToCart={() => props.onNavigate({ type: "customer", page: "cart" })}
          onPlaceOrder={props.onPlaceOrder}
        />
      )}

      {view.page === "order-confirmation" &&
        (() => {
          const order = props.orders.find((o) => o.id === view.orderId) || props.lastConfirmedOrder;
          if (!order)
            return (
              <NotFoundPage
                title="Order not found"
                hint="We couldn't find that order. It may have been removed."
                onBack={() => props.onCustomerTabChange("orders")}
                onHome={() => props.onNavigate({ type: "landing" })}
              />
            );
          return (
            <OrderConfirmation
              order={order}
              onViewOrder={() => props.onCustomerTabChange("orders")}
              onContinueShopping={() => props.onCustomerTabChange("shop")}
            />
          );
        })()}

      {view.page === "orders" && (
        <Orders
          orders={props.orders}
          isLoadingOrders={props.isLoadingOrders}
          onContinueShopping={() => props.onCustomerTabChange("shop")}
        />
      )}

      {view.page === "account" && (
        <Account
          user={props.customerUser}
          onLogout={props.onCustomerLogout}
          onNavigateToLogin={props.onGoToLogin}
          onOpenDashboard={props.onOpenDashboard}
        />
      )}
    </CustomerLayout>
  );
};

// ─── Account dashboard (no marketing footer) ─────────────────────────────

const UserDashboard: React.FC<AppRouterProps> = (props) => {
  const { view } = props;
  if (view.type !== "dashboard") return null;

  const navigate: (page: DashboardNavPage) => void = (page) => {
    props.onNavigate(dashboardNavView(page));
  };

  return (
    <UserDashboardLayout
      activePage={view.page}
      onNavigate={navigate}
      onOpenCart={props.onCartOpen}
      cartCount={props.totalCartCount}
      userName={props.customerUser?.name || ""}
      onReturnToStorefront={() => props.onNavigate({ type: "landing" })}
      onLogout={props.onCustomerLogout}
    >
      {view.page === "overview" && (
        <Overview
          user={props.customerUser}
          orders={props.orders}
          products={props.products}
          isLoadingProducts={props.isLoadingProducts}
          isLoadingOrders={props.isLoadingOrders}
          onNavigate={navigate}
          onSelectProduct={(p) =>
            props.onNavigate({ type: "dashboard", page: "product-details", productId: p.id })
          }
          onAddToCart={(p) => props.onAddToCart(p, 1)}
          recentlyAddedId={props.recentlyAddedId}
        />
      )}

      {view.page === "shop" && (
        <Shop
          products={props.products}
          isLoading={props.isLoadingProducts}
          error={props.productsError}
          onRetry={props.onRetryProducts}
          onSelectProduct={(p) =>
            props.onNavigate({ type: "dashboard", page: "product-details", productId: p.id })
          }
          onAddToCart={(p) => props.onAddToCart(p, 1)}
          recentlyAddedId={props.recentlyAddedId}
        />
      )}

      {view.page === "product-details" &&
        (() => {
          const product = props.products.find((p) => p.id === view.productId);
          if (!product)
            return (
              <NotFoundPage
                title="Fragrance not found"
                hint="The fragrance you're looking for is no longer available."
                onBack={() => props.onNavigate({ type: "dashboard", page: "shop" })}
                onHome={() => props.onNavigate({ type: "landing" })}
              />
            );
          return (
            <ProductDetails
              product={product}
              onBack={() => props.onNavigate({ type: "dashboard", page: "shop" })}
              onAddToCart={(p, qty) => props.onAddToCart(p, qty)}
              onBuyNow={(p, qty) => {
                props.onAddToCart(p, qty);
                props.onNavigate({ type: "dashboard", page: "cart" });
              }}
            />
          );
        })()}

      {view.page === "cart" && (
        <Cart
          items={props.cart}
          products={props.products}
          onUpdateQuantity={props.onUpdateCartQuantity}
          onRemoveItem={props.onRemoveCartItem}
          onProceedToCheckout={() => props.onNavigate({ type: "dashboard", page: "checkout" })}
          onContinueShopping={() => props.onNavigate({ type: "dashboard", page: "shop" })}
        />
      )}

      {view.page === "checkout" && (
        <Checkout
          items={props.cart}
          defaultName={props.customerUser?.name || ""}
          defaultPhone={props.customerUser?.phone || ""}
          onBackToCart={() => props.onNavigate({ type: "dashboard", page: "cart" })}
          onPlaceOrder={props.onPlaceOrder}
        />
      )}

      {view.page === "order-confirmation" &&
        (() => {
          const order = props.orders.find((o) => o.id === view.orderId) || props.lastConfirmedOrder;
          if (!order)
            return (
              <NotFoundPage
                title="Order not found"
                hint="We couldn't find that order. It may have been removed."
                onBack={() => props.onNavigate({ type: "dashboard", page: "orders" })}
                onHome={() => props.onNavigate({ type: "landing" })}
              />
            );
          return (
            <OrderConfirmation
              order={order}
              onViewOrder={() => props.onNavigate({ type: "dashboard", page: "orders" })}
              onContinueShopping={() => props.onNavigate({ type: "dashboard", page: "shop" })}
            />
          );
        })()}

      {view.page === "orders" && (
        <Orders
          orders={props.orders}
          isLoadingOrders={props.isLoadingOrders}
          onContinueShopping={() => props.onNavigate({ type: "dashboard", page: "shop" })}
        />
      )}

      {view.page === "addresses" && (
        <Addresses
          addresses={props.customerUser?.addresses || []}
          onAddAddress={props.onAddAddress}
          onUpdateAddress={props.onUpdateAddress}
          onDeleteAddress={props.onDeleteAddress}
          onSetDefaultAddress={props.onSetDefaultAddress}
        />
      )}

      {view.page === "payment-methods" && (
        <PaymentMethods
          paymentMethods={props.customerUser?.paymentMethods || []}
          onAddPaymentMethod={props.onAddPaymentMethod}
          onDeletePaymentMethod={props.onDeletePaymentMethod}
          onSetDefaultPaymentMethod={props.onSetDefaultPaymentMethod}
        />
      )}

      {view.page === "notifications" && (
        <Notifications
          notifications={props.notifications}
          onMarkRead={props.onMarkNotificationRead}
          onMarkAllRead={props.onMarkAllNotificationsRead}
        />
      )}

      {view.page === "settings" && (
        <Settings
          user={props.customerUser}
          updatingProfile={props.updatingProfile}
          changingPassword={props.changingPassword}
          profileError={props.profileError}
          passwordError={props.passwordError}
          profileMessage={props.profileMessage}
          passwordMessage={props.passwordMessage}
          onUpdateProfile={props.onUpdateProfile}
          onChangePassword={props.onChangePassword}
          onUpdateAppearance={props.onUpdateAppearance}
          onUpdateNotificationPrefs={props.onUpdateNotificationPrefs}
          onLogout={props.onCustomerLogout}
        />
      )}
    </UserDashboardLayout>
  );
};

// ─── Admin portal ────────────────────────────────────────────────────────

const AdminPortal: React.FC<AppRouterProps & { activeTab: AdminTab }> = (props) => {
  const { view, activeTab, isAdminLoggedIn } = props;
  if (view.type !== "admin") return null;

  if (!isAdminLoggedIn) {
    return (
      <AdminLogin
        onLoginSuccess={props.onAdminLoginSuccess}
        onReturnToStorefront={() => props.onCustomerTabChange("shop")}
      />
    );
  }

  return (
    <AdminLayout
      activeTab={activeTab}
      onChangeTab={props.onAdminTabChange}
      pendingOrdersCount={props.pendingOrdersCount}
      onNavigateTo={(targetPage) => {
        if (targetPage === "add-product") props.onNavigate({ type: "admin", page: "add-product" });
        else if (targetPage === "record-sale") props.onNavigate({ type: "admin", page: "record-sale" });
        else if (targetPage === "restock") props.onNavigate({ type: "admin", page: "restock" });
      }}
      onReturnToStorefront={() => props.onCustomerTabChange("shop")}
    >
      {view.page === "dashboard" && (
        <Dashboard
          products={props.products}
          orders={props.orders}
          isLoadingProducts={props.isLoadingProducts}
          isLoadingOrders={props.isLoadingOrders}
          onNavigateTo={(target) => {
            if (target === "inventory") props.onAdminTabChange("inventory");
            else if (target === "orders") props.onAdminTabChange("orders");
            else if (target === "add-product") props.onNavigate({ type: "admin", page: "add-product" });
            else if (target === "record-sale") props.onNavigate({ type: "admin", page: "record-sale" });
            else if (target === "restock") props.onNavigate({ type: "admin", page: "restock" });
          }}
        />
      )}

      {view.page === "inventory" && (
        <Inventory
          products={props.products}
          isLoadingProducts={props.isLoadingProducts}
          onAddProduct={() => props.onNavigate({ type: "admin", page: "add-product" })}
          onEditProduct={(id) => props.onNavigate({ type: "admin", page: "edit-product", productId: id })}
          onRemoveProduct={props.onRemoveProduct}
          onQuickSale={(id) => props.onNavigate({ type: "admin", page: "record-sale", initialProductId: id })}
          onQuickRestock={(id) => props.onNavigate({ type: "admin", page: "restock", initialProductId: id })}
        />
      )}

      {view.page === "add-product" && (
        <AddProduct onBack={() => props.onAdminTabChange("inventory")} onSave={props.onAddProduct} />
      )}

      {view.page === "edit-product" &&
        (() => {
          const prodToEdit = props.products.find((p) => p.id === view.productId);
          if (!prodToEdit)
            return (
              <NotFoundPage
                title="Perfume not found"
                hint="This perfume has been removed or doesn't exist."
                onBack={() => props.onAdminTabChange("inventory")}
                onHome={() => props.onNavigate({ type: "landing" })}
              />
            );
          return (
            <EditProduct
              product={prodToEdit}
              onBack={() => props.onAdminTabChange("inventory")}
              onUpdate={props.onUpdateProduct}
            />
          );
        })()}

      {view.page === "record-sale" && (
        <RecordSale
          products={props.products}
          initialProductId={view.initialProductId}
          onBack={() => props.onAdminTabChange("dashboard")}
          onConfirmSale={props.onConfirmPhysicalSale}
        />
      )}

      {view.page === "restock" && (
        <Restock
          products={props.products}
          initialProductId={view.initialProductId}
          onBack={() => props.onAdminTabChange("dashboard")}
          onConfirmRestock={props.onConfirmRestock}
        />
      )}

      {view.page === "orders" && (
        <AdminOrders
          orders={props.orders}
          isLoadingOrders={props.isLoadingOrders}
          onUpdateStatus={props.onUpdateOrderStatus}
        />
      )}

      {view.page === "users" && <UserManagement />}

      {view.page === "account" && (
        <AdminAccount
          onLogout={props.onAdminLogout}
          onReturnToStore={() => props.onCustomerTabChange("shop")}
        />
      )}
    </AdminLayout>
  );
};

// ─── Global overlays ─────────────────────────────────────────────────────

interface MiniCartLayerProps extends AppRouterProps {
  cartView: AppView;
  checkoutView: AppView;
  shopView: AppView;
}

const MiniCartLayer: React.FC<MiniCartLayerProps> = (props) => (
  <MiniCartDrawer
    open={props.isCartOpen}
    items={props.cart}
    products={props.products}
    onClose={props.onCartClose}
    onViewBag={() => {
      props.onCartClose();
      props.onNavigate(props.cartView);
    }}
    onCheckout={() => {
      props.onCartClose();
      props.onNavigate(props.checkoutView);
    }}
    onBrowse={() => {
      props.onCartClose();
      props.onNavigate(props.shopView);
    }}
    onUpdateQuantity={props.onUpdateCartQuantity}
    onRemoveItem={props.onRemoveCartItem}
  />
);

const AppOverlays: React.FC<AppRouterProps> = (props) => (
  <AuthModal
    open={props.isAuthModalOpen}
    onClose={props.onCloseAuthModal}
    onSuccess={props.onAuthModalSuccess}
  />
);

// ─── Page imports (kept at the bottom to make the dispatch above readable) ──
import { Landing } from "../pages/Landing";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Shop } from "../pages/Shop";
import { ProductDetails } from "../pages/ProductDetails";
import { Cart } from "../pages/Cart";
import { Checkout } from "../pages/Checkout";
import { OrderConfirmation } from "../pages/OrderConfirmation";
import { Orders } from "../pages/Orders";
import { Account } from "../pages/Account";
import { CustomerLayout } from "../layouts/CustomerLayout";
import { UserDashboardLayout } from "../layouts/UserDashboardLayout";
import { Overview } from "../pages/dashboard/Overview";
import { Addresses } from "../pages/dashboard/Addresses";
import { PaymentMethods } from "../pages/dashboard/PaymentMethods";
import { Notifications } from "../pages/dashboard/Notifications";
import { Settings } from "../pages/dashboard/Settings";
import { AdminLogin } from "../pages/admin/AdminLogin";
import { AdminLayout } from "../layouts/AdminLayout";
import { Dashboard } from "../pages/admin/Dashboard";
import { Inventory } from "../pages/admin/Inventory";
import { AddProduct } from "../pages/admin/AddProduct";
import { EditProduct } from "../pages/admin/EditProduct";
import { RecordSale } from "../pages/admin/RecordSale";
import { Restock } from "../pages/admin/Restock";
import { AdminOrders } from "../pages/admin/Orders";
import { AdminAccount } from "../pages/admin/Account";
import { UserManagement } from "../pages/admin/Users";
import { MiniCartDrawer } from "../components/MiniCartDrawer";
import { AuthModal } from "../components/auth/AuthModal";
import { NotFoundPage } from "../components/ui/NotFoundPage";