import { useState, useEffect, useCallback } from "react";
import type {
  Product,
  Order,
  OrderStatus,
  CustomerUser,
  CustomerTab,
  AdminTab,
  AppView,
  FullUser,
} from "../types";
import * as api from "../services";
import { getErrorMessage } from "../services";
import type {
  PlaceOrderData,
  PhysicalSaleData,
  NewProductData,
} from "../router";
import { normalizeFullUser, toFullUser } from "../utils/user";
import { useTheme } from "./useTheme";
import { showErrorToast } from "../utils/toast";
import { useCatalogData } from "./state/useCatalogData";
import { useOrdersData } from "./state/useOrdersData";
import { useCartData } from "./state/useCartData";
import { useNotificationData } from "./state/useNotificationData";
import { useProfileActions } from "./state/useProfileActions";

/**
 * Central application state hook.
 *
 * Composes the domain slices (catalog, orders, cart, notifications, profile
 * mutations) with the genuinely cross-cutting state that ties them together:
 * the auth session, navigation/view routing, the guest-checkout gate, order
 * placement and the admin operations. Kept out of the component tree so it is
 * unit-testable and gives future developers a single place to add state.
 */
export function useAppState() {
  // ─── Session ────────────────────────────────────────────────────────
  const [customerUser, setCustomerUser] = useState<FullUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // ─── Theme ──────────────────────────────────────────────────────────
  // There is no manual theme toggle: the theme always follows the host
  // system (`prefers-color-scheme`). Only the brand accent color is taken
  // from the signed-in user's saved Settings.
  useTheme(
    customerUser?.appearance?.accentColor
      ? { accentColor: customerUser.appearance.accentColor }
      : undefined
  );

  // ─── Domain slices (state/*) ────────────────────────────────────────
  const {
    products,
    isLoadingProducts,
    productsError,
    fetchProducts,
  } = useCatalogData();

  const { orders, setOrders, isLoadingOrders, refreshOrders } = useOrdersData(
    customerUser,
    isAdminLoggedIn
  );

  const {
    cart,
    setCart,
    recentlyAddedId,
    isCartOpen,
    onAddToCart,
    onUpdateCartQuantity,
    onRemoveCartItem,
    onCartOpen,
    onCartClose,
  } = useCartData(products);

  const {
    notifications,
    setNotifications,
    onMarkNotificationRead,
    onMarkAllNotificationsRead,
  } = useNotificationData(customerUser);

  const {
    updatingProfile,
    changingPassword,
    profileError,
    profileMessage,
    passwordError,
    passwordMessage,
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
  } = useProfileActions(setCustomerUser);

  // ─── UI / navigation state ──────────────────────────────────────────
  const [view, setView] = useState<AppView>({ type: "landing" });
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [customerTab, setCustomerTab] = useState<CustomerTab>("shop");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);

  // ─── Guest checkout gate ────────────────────────────────────────────
  // Checkout requires a signed-in account (the backend refuses unauthenticated
  // orders). Guests are blocked from the checkout views and shown an auth
  // modal instead; after a successful sign-in the saved target view is then
  // visited so the bag / checkout intent is never lost.
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<AppView | null>(null);

  // ─── Navigation ─────────────────────────────────────────────────────
  const isCheckoutView = (v: AppView): boolean =>
    (v.type === "customer" && v.page === "checkout") ||
    (v.type === "dashboard" && v.page === "checkout");

  const handleNavigate = useCallback(
    (nextView: AppView) => {
      // Guests must sign in before reaching checkout.
      if (isCheckoutView(nextView) && !customerUser) {
        setCheckoutTarget(nextView);
        setIsAuthModalOpen(true);
        return;
      }
      setView(nextView);
    },
    [customerUser]
  );

  // Opens the auth modal from the checkout page when the backend rejects the
  // order request (e.g. an expired session), keeping the bag intact.
  const handleRequireSignIn = useCallback(() => {
    setCheckoutTarget(null);
    setIsAuthModalOpen(true);
  }, []);

  const handleCloseAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
    setCheckoutTarget(null);
  }, []);

  // Completion handler for the auth modal (login OR registration). Routes the
  // user to their intended checkout destination, or to the shop by default.
  const handleAuthModalSuccess = useCallback(
    (user: CustomerUser) => {
      setCustomerUser(toFullUser(user));
      setIsAuthModalOpen(false);
      const target = checkoutTarget;
      setCheckoutTarget(null);

      if (user.role === "ADMIN") {
        setIsAdminLoggedIn(true);
        setAdminTab("dashboard");
        setView({ type: "admin", page: "dashboard" });
        return;
      }
      if (target) {
        setView(target);
        return;
      }
      setView({ type: "customer", page: "shop" });
    },
    [checkoutTarget]
  );

  // ─── Auth bootstrap ─────────────────────────────────────────────────
  useEffect(() => {
    api
      .getMeProfile()
      .then(({ user }) => {
        setCustomerUser(normalizeFullUser(user));
        if (user.role === "ADMIN") setIsAdminLoggedIn(true);
      })
      .catch(() => {})
      .finally(() => setIsBootstrapping(false));
  }, []);

  // ─── Navigation helpers ─────────────────────────────────────────────
  const handleCustomerTabChange = (tab: CustomerTab) => {
    setCustomerTab(tab);
    if (tab === "shop") setView({ type: "customer", page: "shop" });
    else if (tab === "orders") setView({ type: "customer", page: "orders" });
    else if (tab === "cart") setView({ type: "customer", page: "cart" });
    else if (tab === "account") setView({ type: "customer", page: "account" });
  };

  const handleAdminTabChange = (tab: AdminTab) => {
    setAdminTab(tab);
    if (tab === "dashboard") setView({ type: "admin", page: "dashboard" });
    else if (tab === "inventory") setView({ type: "admin", page: "inventory" });
    else if (tab === "orders") setView({ type: "admin", page: "orders" });
    else if (tab === "users") setView({ type: "admin", page: "users" });
    else if (tab === "account") setView({ type: "admin", page: "account" });
  };

  const handleStartShopping = () => {
    setCustomerTab("shop");
    setView({ type: "customer", page: "shop" });
  };

  const handleContinueAsGuest = handleStartShopping;

  const handleGoToLogin = () => {
    setView({ type: "customer", page: "login" });
  };

  const handleCreateAccount = (user: CustomerUser) => {
    setCustomerUser(toFullUser(user));
  };

  const handleRegister = (user: CustomerUser) => {
    setCustomerUser(toFullUser(user));
    handleStartShopping();
  };

  const handleLandingLogin = (user: CustomerUser) => {
    setCustomerUser(toFullUser(user));
    if (user.role === "ADMIN") {
      setIsAdminLoggedIn(true);
      setView({ type: "admin", page: "dashboard" });
      setAdminTab("dashboard");
    }
  };

  const handleLogin = (user: CustomerUser) => {
    setCustomerUser(toFullUser(user));
    if (user.role === "ADMIN") {
      setIsAdminLoggedIn(true);
      setView({ type: "admin", page: "dashboard" });
      setAdminTab("dashboard");
    } else if (view.type === "customer" && view.page === "login") {
      handleStartShopping();
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminLoggedIn(true);
    setView({ type: "admin", page: "dashboard" });
    setAdminTab("dashboard");
  };

  const handleAdminLogout = () => {
    api.logoutUser().catch(() => {});
    setIsAdminLoggedIn(false);
    setCustomerUser(null);
    handleStartShopping();
  };

  const handleCustomerLogout = async () => {
    await api.logoutUser().catch(() => {});
    setCustomerUser(null);
    setNotifications([]);
    setView({ type: "customer", page: "login" });
  };

  const handleOpenDashboard = () => {
    setView({ type: "dashboard", page: "overview" });
  };

  // ─── Order placement ────────────────────────────────────────────────
  const statusCodeOf = (err: unknown): number | undefined =>
    typeof err === "object" && err !== null && "statusCode" in err
      ? (err as { statusCode?: unknown }).statusCode as number
      : undefined;

  const handlePlaceOrder = async (orderData: PlaceOrderData) => {
    const productsPayload = orderData.items.map((item) => ({
      productId: item.productId || "",
      quantity: item.quantity,
    }));

    try {
      const { order } = await api.placeOrder({
        products: productsPayload,
        delivery: {
          address: orderData.deliveryAddress,
          city: orderData.deliveryCity || "Tamale",
          phone: orderData.customerPhone,
          ...(orderData.customerName ? { recipientName: orderData.customerName } : {}),
          ...(orderData.digitalAddress ? { digitalAddress: orderData.digitalAddress } : {}),
        },
        payment: {
          method: orderData.paymentMethod,
          ...(orderData.paymentReference
            ? { reference: orderData.paymentReference }
            : {}),
          ...(orderData.momoNumber ? { momoNumber: orderData.momoNumber } : {}),
          ...(orderData.momoNetwork ? { momoNetwork: orderData.momoNetwork } : {}),
          ...(orderData.billingEmail ? { email: orderData.billingEmail } : {}),
        },
      });

      const newOrder: Order = {
        _id: order._id,
        id: order._id,
        items: order.items,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        delivery: order.delivery,
        payment: order.payment,
        customerName: customerUser?.name,
        customerPhone: order.delivery?.phone || customerUser?.phone,
        deliveryAddress: order.delivery ? `${order.delivery.address}, ${order.delivery.city}` : undefined,
        paymentMethod: order.payment?.method,
      };

      setOrders((prev) => [newOrder, ...prev]);
      setCart([]);
      setLastConfirmedOrder(newOrder);
      // Route the confirmation to the surface the checkout started from
      // (storefront vs dashboard), never bouncing the buyer across shells.
      setView(
        view.type === "dashboard"
          ? { type: "dashboard", page: "order-confirmation", orderId: order._id }
          : { type: "customer", page: "order-confirmation", orderId: order._id }
      );

      // Refresh products to update stock
      fetchProducts();
    } catch (err) {
      // Session expired mid-checkout → reopen the sign-in modal without
      // losing the bag, and surface a friendlier message.
      if (statusCodeOf(err) === 401) {
        handleRequireSignIn();
        throw new Error("Please sign in to complete your order.", { cause: err });
      }
      throw err;
    }
  };

  // ─── Admin: Record Physical Sale ────────────────────────────────────
  const handleConfirmPhysicalSale = async (data: PhysicalSaleData) => {
    try {
      await api.recordPhysicalSale(data.productId, data.quantity);
      fetchProducts();
      refreshOrders();
    } catch (err) {
      showErrorToast(getErrorMessage(err, "Failed to record sale"));
    }
  };

  // ─── Admin: Restock ─────────────────────────────────────────────────
  const handleConfirmRestock = async (productId: string, quantityAdded: number) => {
    try {
      await api.restockProduct(productId, quantityAdded);
      fetchProducts();
    } catch (err) {
      showErrorToast(getErrorMessage(err, "Failed to restock"));
    }
  };

  // ─── Admin: Add Product ─────────────────────────────────────────────
  const handleAddProduct = async (newProd: NewProductData) => {
    try {
      await api.createProduct(newProd);
      fetchProducts();
      setView({ type: "admin", page: "inventory" });
      setAdminTab("inventory");
    } catch (err) {
      showErrorToast(getErrorMessage(err, "Failed to add product"));
    }
  };

  // ─── Admin: Edit Product ────────────────────────────────────────────
  const handleUpdateProduct = async (updated: Product) => {
    try {
      await api.updateProduct(updated._id, {
        name: updated.name,
        description: updated.description ?? null,
        price: updated.price,
        imageUrl: updated.imageUrl || null,
        stock: updated.stock,
      });
      fetchProducts();
      setView({ type: "admin", page: "inventory" });
      setAdminTab("inventory");
    } catch (err) {
      showErrorToast(getErrorMessage(err, "Failed to update product"));
    }
  };

  // ─── Admin: Remove Product ──────────────────────────────────────────
  // Confirmation is handled by the calling UI (ConfirmDialog) so this fires
  // only after the admin has explicitly confirmed the removal.
  const handleRemoveProduct = async (productId: string) => {
    try {
      await api.deleteProduct(productId);
      fetchProducts();
    } catch (err) {
      showErrorToast(getErrorMessage(err, "Failed to remove product"));
    }
  };

  // ─── Admin: Update Order Status ─────────────────────────────────────
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      showErrorToast(getErrorMessage(err, "Failed to update order status"));
    }
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === "PENDING"
  ).length;

  return {
    // state
    view,
    products,
    orders,
    cart,
    customerUser,
    isAdminLoggedIn,
    customerTab,
    adminTab,
    isLoadingProducts,
    isLoadingOrders,
    productsError,
    recentlyAddedId,
    lastConfirmedOrder,
    isCartOpen,
    pendingOrdersCount,
    totalCartCount,
    notifications,
    updatingProfile,
    changingPassword,
    profileError,
    profileMessage,
    passwordError,
    passwordMessage,
    isBootstrapping,
    // guest checkout auth gate
    isAuthModalOpen,
    onRequireSignIn: handleRequireSignIn,
    onCloseAuthModal: handleCloseAuthModal,
    onAuthModalSuccess: handleAuthModalSuccess,
    // navigation
    onNavigate: handleNavigate,
    onCustomerTabChange: handleCustomerTabChange,
    onAdminTabChange: handleAdminTabChange,
    // auth
    onCreateAccount: handleCreateAccount,
    onRegister: handleRegister,
    onLogin: handleLogin,
    onLandingLogin: handleLandingLogin,
    onContinueAsGuest: handleContinueAsGuest,
    onStartShopping: handleStartShopping,
    onGoToLogin: handleGoToLogin,
    onAdminLoginSuccess: handleAdminLoginSuccess,
    onAdminLogout: handleAdminLogout,
    onCustomerLogout: handleCustomerLogout,
    onOpenDashboard: handleOpenDashboard,
    // data / refresh
    onRetryProducts: fetchProducts,
    // cart
    onAddToCart,
    onUpdateCartQuantity,
    onRemoveCartItem,
    onCartOpen,
    onCartClose,
    onPlaceOrder: handlePlaceOrder,
    // admin
    onConfirmPhysicalSale: handleConfirmPhysicalSale,
    onConfirmRestock: handleConfirmRestock,
    onAddProduct: handleAddProduct,
    onUpdateProduct: handleUpdateProduct,
    onRemoveProduct: handleRemoveProduct,
    onUpdateOrderStatus: handleUpdateOrderStatus,
    // profile
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
  };
}