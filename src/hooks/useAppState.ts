import { useState, useEffect, useCallback } from "react";
import type {
  Product,
  Order,
  OrderItem,
  OrderStatus,
  CustomerUser,
  CustomerTab,
  AdminTab,
  AppView,
  FullUser,
  AppNotification,
  Address,
  PaymentMethod,
} from "../types";
import * as api from "../services";
import { getErrorMessage } from "../services";
import type {
  PlaceOrderData,
  PhysicalSaleData,
  NewProductData,
} from "../router";
import { useTheme } from "./useTheme";

function normalizeFullUser(user: FullUser): FullUser {
  return {
    ...user,
    phone: user.phone || "",
    addresses: Array.isArray(user.addresses) ? user.addresses : [],
    paymentMethods: Array.isArray(user.paymentMethods) ? user.paymentMethods : [],
    notificationPrefs: user.notificationPrefs || {
      orderUpdates: true,
      promotions: false,
      sms: true,
      email: true,
    },
  };
}

function toFullUser(u: CustomerUser): FullUser {
  return normalizeFullUser({
    id: u.id,
    name: u.name,
    email: u.email,
    phone: u.phone || "",
    role: u.role,
    isEmailVerified: false,
    isPhoneVerified: false,
    passwordMustChange: false,
    addresses: [],
    paymentMethods: [],
  });
}

/**
 * Central application state hook.
 *
 * Owns every piece of cross-cutting UI state (auth session, cart, catalog,
 * orders, notifications, profile mutations, admin operations) and returns the
 * props needed by <AppRouter />. Keeping this out of the component tree makes
 * it unit-testable and gives future developers a single place to add state.
 */
export function useAppState() {
  // ─── Core data ──────────────────────────────────────────────────────
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerUser, setCustomerUser] = useState<FullUser | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
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

  // ─── UI / navigation state ──────────────────────────────────────────
  const [view, setView] = useState<AppView>({ type: "landing" });
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [customerTab, setCustomerTab] = useState<CustomerTab>("shop");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // ─── Guest checkout gate ────────────────────────────────────────────
  // Checkout requires a signed-in account (the backend refuses unauthenticated
  // orders). Guests are blocked from the checkout views and shown an auth
  // modal instead; after a successful sign-in the saved target view is then
  // visited so the bag / checkout intent is never lost.
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [checkoutTarget, setCheckoutTarget] = useState<AppView | null>(null);

  // ─── Profile mutation feedback ──────────────────────────────────────
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

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

  // ─── Notifications ──────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    try {
      const { notifications: items } = await api.getNotifications();
      setNotifications(Array.isArray(items) ? items : []);
    } catch {
      /* silent */
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (customerUser) fetchNotifications();
  }, [customerUser, fetchNotifications]);

  // ─── Products ───────────────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    setProductsError(null);
    try {
      const { products: apiProducts } = await api.getProducts();
      const mapped: Product[] = apiProducts.map((p) => ({
        _id: p._id,
        id: p._id,
        name: p.name,
        description: p.description,
        price: p.price,
        imageUrl: p.imageUrl || "",
        stock: p.stock,
        isActive: p.isActive,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      }));
      setProducts(mapped);
    } catch (err) {
      setProductsError(getErrorMessage(err, "Failed to load products"));
    } finally {
      setIsLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
  }, [fetchProducts]);

  const refreshOrders = useCallback(async () => {
    try {
      const isAdmin = customerUser?.role === "ADMIN" || isAdminLoggedIn;
      const data = isAdmin ? await api.getAllOrders() : await api.getMyOrders();
      const mapped: Order[] = data.orders.map((o) => ({
        _id: o._id,
        id: o._id,
        items: o.items,
        total: o.total,
        status: o.status,
        createdAt: o.createdAt,
        customer: o.customer,
        delivery: o.delivery,
        payment: o.payment,
        customerName: typeof o.customer === "object" && o.customer ? o.customer.name : undefined,
        customerPhone: o.delivery?.phone || (typeof o.customer === "object" && o.customer ? o.customer.phone : undefined),
        deliveryAddress: o.delivery ? `${o.delivery.address}, ${o.delivery.city}` : undefined,
        paymentMethod: o.payment?.method,
      }));
      setOrders(mapped);
    } catch {
      /* silent */
    }
  }, [customerUser, isAdminLoggedIn]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (customerUser || isAdminLoggedIn) refreshOrders();
  }, [customerUser, isAdminLoggedIn, refreshOrders]);

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

  // ─── Profile mutations ──────────────────────────────────────────────
  const handleUpdateProfile = async (data: {
    name?: string;
    phone?: string;
    email?: string;
  }) => {
    setUpdatingProfile(true);
    setProfileError(null);
    setProfileMessage(null);
    try {
      const { user } = await api.updateProfile(data);
      setCustomerUser(normalizeFullUser(user));
      setProfileMessage("Changes saved.");
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not update your profile."));
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setChangingPassword(true);
    setPasswordError(null);
    setPasswordMessage(null);
    setProfileError(null);
    setProfileMessage(null);
    try {
      const { user } = await api.changePassword(data);
      setCustomerUser(normalizeFullUser(user));
      setPasswordMessage("Password updated.");
    } catch (err) {
      setPasswordError(getErrorMessage(err, "Could not update your password."));
    } finally {
      setChangingPassword(false);
    }
  };

  const handleAddAddress = async (
    data: Omit<Address, "_id" | "isDefault"> & { isDefault?: boolean }
  ) => {
    setProfileError(null);
    try {
      const { user } = await api.addAddress(data);
      setCustomerUser(normalizeFullUser(user));
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not add the address."));
    }
  };

  const handleUpdateAddress = async (id: string, data: Partial<Omit<Address, "_id">>) => {
    setProfileError(null);
    try {
      const { user } = await api.updateAddress(id, data);
      setCustomerUser(normalizeFullUser(user));
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not update the address."));
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!window.confirm("Remove this address?")) return;
    setProfileError(null);
    try {
      const { user } = await api.deleteAddress(id);
      setCustomerUser(normalizeFullUser(user));
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not remove the address."));
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    setProfileError(null);
    try {
      const { user } = await api.setDefaultAddress(id);
      setCustomerUser(normalizeFullUser(user));
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not set the default address."));
    }
  };

  const handleAddPaymentMethod = async (
    data: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }
  ) => {
    setProfileError(null);
    try {
      const { user } = await api.addPaymentMethod(data);
      setCustomerUser(normalizeFullUser(user));
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not add the payment method."));
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    if (!window.confirm("Remove this payment method?")) return;
    setProfileError(null);
    try {
      const { user } = await api.deletePaymentMethod(id);
      setCustomerUser(normalizeFullUser(user));
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not remove the payment method."));
    }
  };

  const handleSetDefaultPaymentMethod = async (id: string) => {
    setProfileError(null);
    try {
      const { user } = await api.setDefaultPaymentMethod(id);
      setCustomerUser(normalizeFullUser(user));
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not set the default payment method."));
    }
  };

  const handleUpdateAppearance = async (data: {
    accentColor?: string;
  }) => {
    setProfileError(null);
    try {
      const { user } = await api.updateAppearance(data);
      setCustomerUser(normalizeFullUser(user));
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not update your appearance."));
    }
  };

  const handleUpdateNotificationPrefs = async (data: {
    orderUpdates?: boolean;
    promotions?: boolean;
    sms?: boolean;
    email?: boolean;
  }) => {
    setProfileError(null);
    try {
      const { user } = await api.updateNotificationPrefs(data);
      setCustomerUser(normalizeFullUser(user));
    } catch (err) {
      setProfileError(getErrorMessage(err, "Could not update your preferences."));
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      const { notification } = await api.markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, readAt: notification.readAt } : n))
      );
    } catch {
      /* silent */
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, readAt: n.readAt || new Date().toISOString() })));
    } catch {
      /* silent */
    }
  };

  // ─── Cart ───────────────────────────────────────────────────────────
  const handleAddToCart = (product: Product, quantity = 1) => {
    if (product.stock <= 0) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          name: product.name,
          price: product.price,
          quantity: Math.min(product.stock, quantity),
          productId: product.id,
        },
      ];
    });
    setRecentlyAddedId(product.id);
    setTimeout(() => setRecentlyAddedId(null), 1500);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    const maxStock = product ? product.stock : 99;
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.min(maxStock, quantity) }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.productId !== productId));
  };

  const handleCartOpen = useCallback(() => setIsCartOpen(true), []);

  const handleCartClose = useCallback(() => setIsCartOpen(false), []);

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
            city: "Tamale",
            phone: orderData.customerPhone,
            ...(orderData.digitalAddress ? { digitalAddress: orderData.digitalAddress } : {}),
          },
          payment: {
            method: orderData.paymentMethod,
            ...(orderData.paymentReference
              ? { reference: orderData.paymentReference }
              : {}),
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
      setView({ type: "customer", page: "order-confirmation", orderId: order._id });

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
      alert(getErrorMessage(err, "Failed to record sale"));
    }
  };

  // ─── Admin: Restock ─────────────────────────────────────────────────
  const handleConfirmRestock = async (productId: string, quantityAdded: number) => {
    try {
      await api.restockProduct(productId, quantityAdded);
      fetchProducts();
    } catch (err) {
      alert(getErrorMessage(err, "Failed to restock"));
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
      alert(getErrorMessage(err, "Failed to add product"));
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
      alert(getErrorMessage(err, "Failed to update product"));
    }
  };

  // ─── Admin: Remove Product ──────────────────────────────────────────
  const handleRemoveProduct = async (productId: string) => {
    if (window.confirm("Are you sure you want to remove this perfume from inventory?")) {
      try {
        await api.deleteProduct(productId);
        fetchProducts();
      } catch (err) {
        alert(getErrorMessage(err, "Failed to remove product"));
      }
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
      alert(getErrorMessage(err, "Failed to update order status"));
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
    onAddToCart: handleAddToCart,
    onUpdateCartQuantity: handleUpdateCartQuantity,
    onRemoveCartItem: handleRemoveCartItem,
    onCartOpen: handleCartOpen,
    onCartClose: handleCartClose,
    onPlaceOrder: handlePlaceOrder,
    // admin
    onConfirmPhysicalSale: handleConfirmPhysicalSale,
    onConfirmRestock: handleConfirmRestock,
    onAddProduct: handleAddProduct,
    onUpdateProduct: handleUpdateProduct,
    onRemoveProduct: handleRemoveProduct,
    onUpdateOrderStatus: handleUpdateOrderStatus,
    // profile
    onUpdateProfile: handleUpdateProfile,
    onChangePassword: handleChangePassword,
    onAddAddress: handleAddAddress,
    onUpdateAddress: handleUpdateAddress,
    onDeleteAddress: handleDeleteAddress,
    onSetDefaultAddress: handleSetDefaultAddress,
    onAddPaymentMethod: handleAddPaymentMethod,
    onDeletePaymentMethod: handleDeletePaymentMethod,
    onSetDefaultPaymentMethod: handleSetDefaultPaymentMethod,
    onUpdateAppearance: handleUpdateAppearance,
    onUpdateNotificationPrefs: handleUpdateNotificationPrefs,
    onMarkNotificationRead: handleMarkNotificationRead,
    onMarkAllNotificationsRead: handleMarkAllNotificationsRead,
  };
}