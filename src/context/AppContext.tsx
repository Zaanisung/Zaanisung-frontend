import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Product, 
  CartItem, 
  User, 
  Order, 
  Address, 
  AppNotification, 
  AdminStats, 
  FulfillmentStatus, 
  PaymentStatus 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_USER, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ADMIN_STATS 
} from '../data/mockData';
import { calculateSubtotal, calculateShipping, calculateOrderTotal } from '../utils/cart';

export type AppRoute =
  // Storefront
  | 'home'
  | 'catalog'
  | 'product-detail'
  | 'cart'
  | 'checkout'
  | 'order-confirmation'
  | 'login'
  | 'register'
  | 'forgot-password'
  | 'verify-otp'
  | 'reset-password'
  | 'account'
  | 'about'
  | 'contact'
  | 'legal'
  | 'not-found'
  // Admin
  | 'admin-dashboard'
  | 'admin-products'
  | 'admin-product-new'
  | 'admin-product-edit'
  | 'admin-orders'
  | 'admin-order-detail'
  | 'admin-users'
  | 'admin-settings';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface AppContextType {
  // Navigation & Routing
  currentRoute: AppRoute;
  routeParams: Record<string, string>;
  navigateTo: (route: AppRoute, params?: Record<string, string>) => void;

  // Search & Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;
  isIntegrationDocsOpen: boolean;
  setIsIntegrationDocsOpen: (open: boolean) => void;

  // Catalog
  products: Product[];
  selectedProduct: Product | null;
  addProduct: (product: Omit<Product, 'id'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, size?: '50ml' | '100ml' | '200ml', quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;

  // Auth & Account
  currentUser: User | null;
  isAdmin: boolean;
  loginAsCustomer: () => void;
  loginAsAdmin: () => void;
  logout: () => void;
  updateUserProfile: (data: { name: string; phone: string }) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;

  // Orders
  orders: Order[];
  selectedOrder: Order | null;
  createOrder: (orderData: Omit<Order, 'id' | 'reference' | 'createdAt'>) => Order;
  updateOrderFulfillment: (orderId: string, status: FulfillmentStatus) => void;
  updateOrderPayment: (orderId: string, status: PaymentStatus) => void;

  // Notifications
  notifications: AppNotification[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Admin Stats
  adminStats: AdminStats;

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Routing state
  const [currentRoute, setCurrentRoute] = useState<AppRoute>('home');
  const [routeParams, setRouteParams] = useState<Record<string, string>>({});

  // UI state
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isIntegrationDocsOpen, setIsIntegrationDocsOpen] = useState(false);

  // Data state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [currentUser, setCurrentUser] = useState<User | null>(INITIAL_USER);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [adminStats, setAdminStats] = useState<AdminStats>(INITIAL_ADMIN_STATS);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Initial cart with sample item
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'zaa-01-100ml',
      productId: 'zaa-01',
      product: INITIAL_PRODUCTS[0],
      size: '100ml',
      quantity: 1,
      unitPrice: 2450,
    },
  ]);

  // Read URL Hash for direct route linking & back button support
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (!hash) return;
      const [routePart, queryPart] = hash.split('?');
      if (routePart) {
        const validRoutes: AppRoute[] = [
          'home', 'catalog', 'product-detail', 'cart', 'checkout', 'order-confirmation',
          'login', 'register', 'forgot-password', 'verify-otp', 'reset-password',
          'account', 'about', 'contact', 'legal', 'not-found',
          'admin-dashboard', 'admin-products', 'admin-product-new', 'admin-product-edit',
          'admin-orders', 'admin-order-detail', 'admin-users', 'admin-settings'
        ];
        if (validRoutes.includes(routePart as AppRoute)) {
          setCurrentRoute(routePart as AppRoute);
        }
      }
      if (queryPart) {
        const params: Record<string, string> = {};
        const pairs = queryPart.split('&');
        for (const pair of pairs) {
          const [k, v] = pair.split('=');
          if (k) params[k] = decodeURIComponent(v || '');
        }
        setRouteParams(params);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: AppRoute, params: Record<string, string> = {}) => {
    setCurrentRoute(route);
    setRouteParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Build URL hash
    let hash = `#${route}`;
    const keys = Object.keys(params);
    if (keys.length > 0) {
      const query = keys.map((k) => `${k}=${encodeURIComponent(params[k])}`).join('&');
      hash += `?${query}`;
    }
    window.location.hash = hash;
  };

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product: Product, size: '50ml' | '100ml' | '200ml' = '100ml', quantity = 1) => {
    const variant = product.sizes.find((s) => s.size === size);
    const unitPrice = variant ? variant.price : product.price;
    const itemId = `${product.id}-${size}`;

    setCart((prev) => {
      const existing = prev.find((i) => i.id === itemId);
      if (existing) {
        return prev.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: itemId,
          productId: product.id,
          product,
          size,
          quantity,
          unitPrice,
        },
      ];
    });

    addToast({
      type: 'success',
      title: 'Added to Fragrance Flacon',
      message: `${product.name} (${size}) added to your shopping cart.`,
    });
    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== cartItemId));
    addToast({
      type: 'info',
      title: 'Item Removed',
      message: 'Item removed from your shopping flacon.',
    });
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === cartItemId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = calculateSubtotal(cart.map((i) => ({ price: i.unitPrice, quantity: i.quantity })));

  // Auth operations
  const isAdmin = currentUser?.role === 'admin';

  const loginAsCustomer = () => {
    setCurrentUser(INITIAL_USER);
    addToast({
      type: 'success',
      title: 'Welcome Back',
      message: `Signed in as ${INITIAL_USER.name}.`,
    });
    navigateTo('account');
  };

  const loginAsAdmin = () => {
    setCurrentUser({
      id: 'adm-001',
      name: 'Adwoa Mensah (Director)',
      email: 'adwoa.director@zaanisung.com',
      phone: '0244000111',
      role: 'admin',
      createdAt: '2025-01-15',
      addresses: [],
    });
    addToast({
      type: 'success',
      title: 'Administrator Console',
      message: 'Logged into ZAANISUNG Commerce Operations.',
    });
    navigateTo('admin-dashboard');
  };

  const logout = () => {
    setCurrentUser(null);
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been safely signed out.',
    });
    navigateTo('home');
  };

  const updateUserProfile = (data: { name: string; phone: string }) => {
    if (!currentUser) return;
    setCurrentUser({ ...currentUser, name: data.name, phone: data.phone });
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Your personal preferences have been saved.',
    });
  };

  const addAddress = (addrData: Omit<Address, 'id'>) => {
    if (!currentUser) return;
    const newAddr: Address = {
      ...addrData,
      id: `addr-${Date.now()}`,
    };
    let updatedAddrs = [...currentUser.addresses];
    if (newAddr.isDefault) {
      updatedAddrs = updatedAddrs.map((a) => ({ ...a, isDefault: false }));
    }
    updatedAddrs.push(newAddr);
    setCurrentUser({ ...currentUser, addresses: updatedAddrs });
    addToast({
      type: 'success',
      title: 'Address Added',
      message: `${newAddr.label} saved to your address book.`,
    });
  };

  const updateAddress = (id: string, addrData: Partial<Address>) => {
    if (!currentUser) return;
    let updatedAddrs = currentUser.addresses.map((a) =>
      a.id === id ? { ...a, ...addrData } : a
    );
    if (addrData.isDefault) {
      updatedAddrs = updatedAddrs.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }));
    }
    setCurrentUser({ ...currentUser, addresses: updatedAddrs });
    addToast({
      type: 'success',
      title: 'Address Updated',
      message: 'Delivery details have been refreshed.',
    });
  };

  const deleteAddress = (id: string) => {
    if (!currentUser) return;
    const updatedAddrs = currentUser.addresses.filter((a) => a.id !== id);
    setCurrentUser({ ...currentUser, addresses: updatedAddrs });
    addToast({
      type: 'info',
      title: 'Address Removed',
    });
  };

  const setDefaultAddress = (id: string) => {
    if (!currentUser) return;
    const updatedAddrs = currentUser.addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setCurrentUser({ ...currentUser, addresses: updatedAddrs });
    addToast({
      type: 'success',
      title: 'Default Address Set',
    });
  };

  // Products CRUD
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newProd: Product = {
      ...prodData,
      id: `zaa-${Date.now().toString().slice(-4)}`,
    };
    setProducts((prev) => [newProd, ...prev]);
    addToast({
      type: 'success',
      title: 'Perfume Published',
      message: `${newProd.name} is now visible in the boutique catalog.`,
    });
    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
    addToast({
      type: 'success',
      title: 'Perfume Updated',
      message: 'Product specifications saved successfully.',
    });
  };

  const deleteProduct = (id: string) => {
    const toDelete = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast({
      type: 'info',
      title: 'Product Archived',
      message: `${toDelete?.name || 'Item'} was removed from catalog.`,
    });
  };

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'reference' | 'createdAt'>): Order => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      ...orderData,
      id: `ord-${Date.now()}`,
      reference: `ZAA-2026-${randomSuffix}`,
      createdAt: new Date().toISOString(),
      trackingNumber: `ZAA-EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      deliveryEstimatedDate: 'Within 48 Hours',
    };
    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    
    // Increment admin stats
    setAdminStats((prev) => ({
      ...prev,
      ordersCount: prev.ordersCount + 1,
      grossSalesGHS: prev.grossSalesGHS + newOrder.total,
      pendingOrdersCount: prev.pendingOrdersCount + 1,
    }));

    return newOrder;
  };

  const updateOrderFulfillment = (orderId: string, status: FulfillmentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, fulfillmentStatus: status } : o))
    );
    addToast({
      type: 'success',
      title: 'Order Status Updated',
      message: `Fulfillment status changed to ${status}.`,
    });
  };

  const updateOrderPayment = (orderId: string, status: PaymentStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paymentStatus: status } : o))
    );
    addToast({
      type: 'success',
      title: 'Payment Status Updated',
      message: `Payment marked as ${status}.`,
    });
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast({
      type: 'info',
      title: 'All Caught Up',
      message: 'All notifications marked as read.',
    });
  };

  // Computed selected product or order from route params
  const selectedProduct =
    (routeParams.productId && products.find((p) => p.id === routeParams.productId)) ||
    (currentRoute === 'product-detail' ? products[0] : null);

  const selectedOrder =
    (routeParams.orderId && orders.find((o) => o.id === routeParams.orderId)) ||
    orders[0] ||
    null;

  return (
    <AppContext.Provider
      value={{
        currentRoute,
        routeParams,
        navigateTo,
        isSearchOpen,
        setIsSearchOpen,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        isIntegrationDocsOpen,
        setIsIntegrationDocsOpen,
        products,
        selectedProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        currentUser,
        isAdmin,
        loginAsCustomer,
        loginAsAdmin,
        logout,
        updateUserProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        orders,
        selectedOrder,
        createOrder,
        updateOrderFulfillment,
        updateOrderPayment,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        adminStats,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
