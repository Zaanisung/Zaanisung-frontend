import { useState, useEffect, useCallback } from "react";
import {
  Product,
  OrderItem,
  Order,
  OrderStatus,
  CustomerUser,
  CustomerTab,
  AdminTab,
  AppView,
} from "./types";
import * as api from "./api";
import { getErrorMessage } from "./api";
import { CustomerLayout } from "./layouts/CustomerLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Shop } from "./pages/Shop";
import { ProductDetails } from "./pages/ProductDetails";
import { Cart } from "./pages/Cart";
import { Checkout } from "./pages/Checkout";
import { OrderConfirmation } from "./pages/OrderConfirmation";
import { Orders } from "./pages/Orders";
import { Account } from "./pages/Account";

// Admin Pages
import { AdminLogin } from "./pages/admin/AdminLogin";
import { Dashboard } from "./pages/admin/Dashboard";
import { Inventory } from "./pages/admin/Inventory";
import { AddProduct } from "./pages/admin/AddProduct";
import { EditProduct } from "./pages/admin/EditProduct";
import { RecordSale } from "./pages/admin/RecordSale";
import { Restock } from "./pages/admin/Restock";
import { AdminOrders } from "./pages/admin/Orders";
import { AdminAccount } from "./pages/admin/Account";

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  const [view, setView] = useState<AppView>({ type: "customer", page: "shop" });
  const [customerTab, setCustomerTab] = useState<CustomerTab>("shop");
  const [adminTab, setAdminTab] = useState<AdminTab>("dashboard");

  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState<string | null>(null);

  // Dark mode detection
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const applyTheme = (e: MediaQueryList | MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };
    applyTheme(mediaQuery);
    mediaQuery.addEventListener("change", applyTheme);
    return () => mediaQuery.removeEventListener("change", applyTheme);
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

  // Customer tab sync
  const handleCustomerTabChange = (tab: CustomerTab) => {
    setCustomerTab(tab);
    if (tab === "shop") setView({ type: "customer", page: "shop" });
    else if (tab === "orders") setView({ type: "customer", page: "orders" });
    else if (tab === "cart") setView({ type: "customer", page: "cart" });
    else if (tab === "account") setView({ type: "customer", page: "account" });
  };

  // Admin tab sync
  const handleAdminTabChange = (tab: AdminTab) => {
    setAdminTab(tab);
    if (tab === "dashboard") setView({ type: "admin", page: "dashboard" });
    else if (tab === "inventory") setView({ type: "admin", page: "inventory" });
    else if (tab === "orders") setView({ type: "admin", page: "orders" });
    else if (tab === "account") setView({ type: "admin", page: "account" });
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
  const handlePlaceOrder = async (orderData: {
    items: OrderItem[];
    total: number;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    paymentMethod: string;
  }) => {
    try {
      const productsPayload = orderData.items.map((item) => ({
        productId: item.productId || "",
        quantity: item.quantity,
      }));

      const { order } = await api.placeOrder({
        products: productsPayload,
        delivery: {
          address: orderData.deliveryAddress,
          city: "Accra",
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
  const handleConfirmPhysicalSale = async (data: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    paymentMethod: string;
  }) => {
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
  const handleAddProduct = async (newProd: { name: string; price: number; imageUrl: string; stock: number }) => {
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

  // ─── RENDER ADMIN VIEWS ──────────────────────────────────────────
  if (view.type === "admin") {
    if (!isAdminLoggedIn) {
      return (
        <AdminLogin
          onLoginSuccess={() => {
            setIsAdminLoggedIn(true);
            setView({ type: "admin", page: "dashboard" });
            setAdminTab("dashboard");
          }}
          onReturnToStorefront={() => {
            setView({ type: "customer", page: "shop" });
            setCustomerTab("shop");
          }}
        />
      );
    }

    return (
      <AdminLayout
        activeTab={adminTab}
        onChangeTab={handleAdminTabChange}
        pendingOrdersCount={pendingOrdersCount}
        onNavigateTo={(targetPage) => {
          if (targetPage === "add-product") setView({ type: "admin", page: "add-product" });
          else if (targetPage === "record-sale") setView({ type: "admin", page: "record-sale" });
          else if (targetPage === "restock") setView({ type: "admin", page: "restock" });
        }}
        onReturnToStorefront={() => {
          setView({ type: "customer", page: "shop" });
          setCustomerTab("shop");
        }}
      >
        {view.page === "dashboard" && (
          <Dashboard
            products={products}
            orders={orders}
            onNavigateTo={(target) => {
              if (target === "inventory") { setView({ type: "admin", page: "inventory" }); setAdminTab("inventory"); }
              else if (target === "orders") { setView({ type: "admin", page: "orders" }); setAdminTab("orders"); }
              else if (target === "add-product") setView({ type: "admin", page: "add-product" });
              else if (target === "record-sale") setView({ type: "admin", page: "record-sale" });
              else if (target === "restock") setView({ type: "admin", page: "restock" });
            }}
          />
        )}

        {view.page === "inventory" && (
          <Inventory
            products={products}
            onAddProduct={() => setView({ type: "admin", page: "add-product" })}
            onEditProduct={(id) => setView({ type: "admin", page: "edit-product", productId: id })}
            onRemoveProduct={handleRemoveProduct}
            onQuickSale={(id) => setView({ type: "admin", page: "record-sale", initialProductId: id })}
            onQuickRestock={(id) => setView({ type: "admin", page: "restock", initialProductId: id })}
          />
        )}

        {view.page === "add-product" && (
          <AddProduct
            onBack={() => { setView({ type: "admin", page: "inventory" }); setAdminTab("inventory"); }}
            onSave={handleAddProduct}
          />
        )}

        {view.page === "edit-product" &&
          (() => {
            const prodToEdit = products.find((p) => p.id === view.productId);
            if (!prodToEdit) return <div className="text-gray-400">Perfume not found.</div>;
            return (
              <EditProduct
                product={prodToEdit}
                onBack={() => { setView({ type: "admin", page: "inventory" }); setAdminTab("inventory"); }}
                onUpdate={handleUpdateProduct}
              />
            );
          })()}

        {view.page === "record-sale" && (
          <RecordSale
            products={products}
            initialProductId={view.initialProductId}
            onBack={() => { setView({ type: "admin", page: "dashboard" }); setAdminTab("dashboard"); }}
            onConfirmSale={handleConfirmPhysicalSale}
          />
        )}

        {view.page === "restock" && (
          <Restock
            products={products}
            initialProductId={view.initialProductId}
            onBack={() => { setView({ type: "admin", page: "dashboard" }); setAdminTab("dashboard"); }}
            onConfirmRestock={handleConfirmRestock}
          />
        )}

        {view.page === "orders" && (
          <AdminOrders orders={orders} onUpdateStatus={handleUpdateOrderStatus} />
        )}

        {view.page === "account" && (
          <AdminAccount
            onLogout={() => {
              api.logoutUser().catch(() => {});
              setIsAdminLoggedIn(false);
              setCustomerUser(null);
              setView({ type: "customer", page: "shop" });
              setCustomerTab("shop");
            }}
            onReturnToStore={() => {
              setView({ type: "customer", page: "shop" });
              setCustomerTab("shop");
            }}
          />
        )}
      </AdminLayout>
    );
  }

  // ─── RENDER CUSTOMER VIEWS ───────────────────────────────────────
  return (
    <CustomerLayout
      activeTab={customerTab}
      onChangeTab={handleCustomerTabChange}
      cartCount={totalCartCount}
      onOpenAdmin={() => {
        setView({ type: "admin", page: isAdminLoggedIn ? "dashboard" : "login" });
      }}
    >
      {view.page === "login" && (
        <Login
          onLogin={(user) => {
            setCustomerUser(user);
            setView({ type: "customer", page: "shop" });
            setCustomerTab("shop");
          }}
          onNavigateToRegister={() => setView({ type: "customer", page: "register" })}
          onContinueAsGuest={() => {
            setView({ type: "customer", page: "shop" });
            setCustomerTab("shop");
          }}
        />
      )}

      {view.page === "register" && (
        <Register
          onRegister={(user) => {
            setCustomerUser(user);
            setView({ type: "customer", page: "shop" });
            setCustomerTab("shop");
          }}
          onNavigateToLogin={() => setView({ type: "customer", page: "login" })}
        />
      )}

      {view.page === "shop" && (
        <Shop
          products={products}
          isLoading={isLoadingProducts}
          error={productsError}
          onRetry={fetchProducts}
          onSelectProduct={(p) => setView({ type: "customer", page: "product-details", productId: p.id })}
          onAddToCart={(p) => handleAddToCart(p, 1)}
          recentlyAddedId={recentlyAddedId}
        />
      )}

      {view.page === "product-details" &&
        (() => {
          const product = products.find((p) => p.id === view.productId);
          if (!product) return <div className="py-12 text-center text-gray-500">Fragrance not found.</div>;
          return (
            <ProductDetails
              product={product}
              onBack={() => setView({ type: "customer", page: "shop" })}
              onAddToCart={(p, qty) => handleAddToCart(p, qty)}
              onBuyNow={(p, qty) => {
                handleAddToCart(p, qty);
                setView({ type: "customer", page: "checkout" });
              }}
            />
          );
        })()}

      {view.page === "cart" && (
        <Cart
          items={cart}
          products={products}
          onUpdateQuantity={handleUpdateCartQuantity}
          onRemoveItem={handleRemoveCartItem}
          onProceedToCheckout={() => setView({ type: "customer", page: "checkout" })}
          onContinueShopping={() => { setView({ type: "customer", page: "shop" }); setCustomerTab("shop"); }}
        />
      )}

      {view.page === "checkout" && (
        <Checkout
          items={cart}
          defaultName={customerUser?.name || ""}
          defaultPhone={customerUser?.phone || ""}
          onBackToCart={() => setView({ type: "customer", page: "cart" })}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {view.page === "order-confirmation" &&
        (() => {
          const order = orders.find((o) => o.id === view.orderId) || lastConfirmedOrder;
          if (!order) return <div className="py-12 text-center"><p className="text-gray-500">No order found.</p></div>;
          return (
            <OrderConfirmation
              order={order}
              onViewOrder={() => { setView({ type: "customer", page: "orders" }); setCustomerTab("orders"); }}
              onContinueShopping={() => { setView({ type: "customer", page: "shop" }); setCustomerTab("shop"); }}
            />
          );
        })()}

      {view.page === "orders" && (
        <Orders
          orders={orders}
          onContinueShopping={() => { setView({ type: "customer", page: "shop" }); setCustomerTab("shop"); }}
        />
      )}

      {view.page === "account" && (
        <Account
          user={customerUser}
          onLogout={async () => {
            await api.logoutUser().catch(() => {});
            setCustomerUser(null);
            setView({ type: "customer", page: "login" });
          }}
          onNavigateToLogin={() => setView({ type: "customer", page: "login" })}
          onSwitchToAdmin={() => {
            setView({ type: "admin", page: isAdminLoggedIn ? "dashboard" : "login" });
          }}
        />
      )}
    </CustomerLayout>
  );
}
