import { useState, useEffect, useCallback } from "react";
import {
  Product,
  Order,
  OrderItem,
  OrderStatus,
  CustomerUser,
  CustomerTab,
  AdminTab,
  AppView,
} from "./types";
import * as api from "./services";
import { getErrorMessage } from "./services";
import { AppRouter } from "./router";
import type {
  PlaceOrderData,
  PhysicalSaleData,
  NewProductData,
} from "./router";

const THEME_KEY = "zaanisung-theme";

function getInitialDark(): boolean {
  if (typeof window === "undefined") return false;
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored === "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [view, setView] = useState<AppView>({ type: "landing" });
  const [customerTab, setCustomerTab] = useState<CustomerTab>("shop");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");

  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Theme: manual toggle persists; otherwise follows OS/browser preference
  const [isDark, setIsDark] = useState<boolean>(getInitialDark);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applySystemTheme = (e: MediaQueryList | MediaQueryListEvent) => {
      if (!window.localStorage.getItem(THEME_KEY)) setIsDark(e.matches);
    };
    applySystemTheme(mediaQuery);
    mediaQuery.addEventListener("change", applySystemTheme);
    return () => mediaQuery.removeEventListener("change", applySystemTheme);
  }, []);

  const handleToggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      window.localStorage.setItem(THEME_KEY, next ? "dark" : "light");
      return next;
    });
  };

  const handleNavigate = useCallback((nextView: AppView) => {
    setView(nextView);
  }, []);

  // Check auth on mount
  useEffect(() => {
    api.getMe().then(({ user }) => {
      setCustomerUser({
        id: user.id,
        name: user.name,
        phone: user.phone || "",
        email: user.email,
        role: user.role,
      });
      if (user.role === "ADMIN") setIsAdminLoggedIn(true);
    }).catch(() => {});
  }, []);

  // Fetch products
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
    } catch { /* silent */ }
  }, [customerUser, isAdminLoggedIn]);

  // Navigation helpers
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
    setCustomerUser(user);
  };

  const handleRegister = (user: CustomerUser) => {
    setCustomerUser(user);
    handleStartShopping();
  };

  const handleLandingLogin = (user: CustomerUser) => {
    setCustomerUser(user);
    if (user.role === "ADMIN") {
      setIsAdminLoggedIn(true);
      setView({ type: "admin", page: "dashboard" });
      setAdminTab("dashboard");
    }
  };

  const handleLogin = (user: CustomerUser) => {
    setCustomerUser(user);
    if (user.role === "ADMIN") {
      setIsAdminLoggedIn(true);
      setView({ type: "admin", page: "dashboard" });
      setAdminTab("dashboard");
    } else {
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
    setView({ type: "customer", page: "login" });
  };

  // Cart operations
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

  // Place order
  const handlePlaceOrder = async (orderData: PlaceOrderData) => {
    try {
      const productsPayload = orderData.items.map((item) => ({
        productId: item.productId || "",
        quantity: item.quantity,
      }));

      const { order } = await api.placeOrder({
        products: productsPayload,
        delivery: {
          address: orderData.deliveryAddress,
          city: "Tamale",
          phone: orderData.customerPhone,
        },
        payment: {
          method: orderData.paymentMethod,
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
      alert(getErrorMessage(err, "Failed to place order"));
    }
  };

  // Admin: Record Physical Sale
  const handleConfirmPhysicalSale = async (data: PhysicalSaleData) => {
    try {
      await api.recordPhysicalSale(data.productId, data.quantity);
      fetchProducts();
      refreshOrders();
    } catch (err) {
      alert(getErrorMessage(err, "Failed to record sale"));
    }
  };

  // Admin: Restock
  const handleConfirmRestock = async (productId: string, quantityAdded: number) => {
    try {
      await api.restockProduct(productId, quantityAdded);
      fetchProducts();
    } catch (err) {
      alert(getErrorMessage(err, "Failed to restock"));
    }
  };

  // Admin: Add Product
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

  // Admin: Edit Product
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

  // Admin: Remove Product
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

  // Admin: Update Order Status
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

  return (
    <AppRouter
      view={view}
      products={products}
      orders={orders}
      cart={cart}
      customerUser={customerUser}
      isAdminLoggedIn={isAdminLoggedIn}
      customerTab={customerTab}
      adminTab={adminTab}
      isLoadingProducts={isLoadingProducts}
      productsError={productsError}
      recentlyAddedId={recentlyAddedId}
      lastConfirmedOrder={lastConfirmedOrder}
      pendingOrdersCount={pendingOrdersCount}
      totalCartCount={totalCartCount}
      isDark={isDark}
      onToggleTheme={handleToggleTheme}
      onNavigate={handleNavigate}
      onCustomerTabChange={handleCustomerTabChange}
      onAdminTabChange={handleAdminTabChange}
      onAddToCart={handleAddToCart}
      onUpdateCartQuantity={handleUpdateCartQuantity}
      onRemoveCartItem={handleRemoveCartItem}
      onPlaceOrder={handlePlaceOrder}
      onConfirmPhysicalSale={handleConfirmPhysicalSale}
      onConfirmRestock={handleConfirmRestock}
      onAddProduct={handleAddProduct}
      onUpdateProduct={handleUpdateProduct}
      onRemoveProduct={handleRemoveProduct}
      onUpdateOrderStatus={handleUpdateOrderStatus}
      onCreateAccount={handleCreateAccount}
      onRegister={handleRegister}
      onLogin={handleLogin}
      onLandingLogin={handleLandingLogin}
      onContinueAsGuest={handleContinueAsGuest}
      onStartShopping={handleStartShopping}
      onGoToLogin={handleGoToLogin}
      onRetryProducts={fetchProducts}
      onAdminLoginSuccess={handleAdminLoginSuccess}
      onAdminLogout={handleAdminLogout}
      onCustomerLogout={handleCustomerLogout}
    />
  );
}