import React from "react";
import type { FullUser } from "../../types/user";
import type { Order } from "../../types/order";
import type { Product } from "../../types/product";
import type { DashboardNavPage } from "../../types/nav";
import { ProductCard } from "../../components/ProductCard";
import { Skeleton, ProductCardSkeleton, ListRowSkeleton } from "../../components/ui/Skeleton";
import { startOnboarding } from "../../onboarding/onboardingBus";
import {
  MapPin,
  CreditCard,
  Settings,
  Bell,
  ShoppingBag,
  Package,
  Clock,
  Store,
  CircleHelp,
} from "lucide-react";

export interface OverviewProps {
  user: FullUser | null;
  orders: Order[];
  products: Product[];
  isLoadingProducts?: boolean;
  isLoadingOrders?: boolean;
  onNavigate: (page: DashboardNavPage) => void;
  onSelectProduct?: (product: Product) => void;
  onAddToCart?: (product: Product, e: React.MouseEvent) => void;
  recentlyAddedId?: string | null;
}

export const Overview: React.FC<OverviewProps> = ({
  user,
  orders,
  products,
  isLoadingProducts = false,
  isLoadingOrders = false,
  onNavigate,
  onSelectProduct,
  onAddToCart = () => {},
  recentlyAddedId,
}) => {
  const featuredProducts = products.slice(0, 4);
  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const activeOrders = orders.filter(
    (o) => o.status === "CONFIRMED" || o.status === "SHIPPED"
  );
  const recentOrders = orders.slice(0, 5);

  const quickLinks = [
    {
      label: "Addresses",
      icon: <MapPin className="w-5 h-5" />,
      page: "addresses" as DashboardNavPage,
    },
    {
      label: "Payment Methods",
      icon: <CreditCard className="w-5 h-5" />,
      page: "payment-methods" as DashboardNavPage,
    },
    {
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      page: "settings" as DashboardNavPage,
    },
    {
      label: "Notifications",
      icon: <Bell className="w-5 h-5" />,
      page: "notifications" as DashboardNavPage,
    },
  ];

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="eyebrow text-black/45 dark:text-white/45 mb-1">
            Welcome Back
          </p>
          <h2 className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif">
            Hello{user?.name ? `, ${user.name.split(" ")[0]}` : ""}
          </h2>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            Here is a snapshot of your account activity.
          </p>
        </div>
        <button
          type="button"
          onClick={() => startOnboarding("buyer-dashboard")}
          aria-label="Replay the dashboard walkthrough"
          title="Replay walkthrough"
          className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-black/45 dark:text-white/50 hover:text-gold border border-transparent hover:border-gold/40 transition-colors"
        >
          <CircleHelp className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4" data-tour="dash-overview-stats">
        {isLoadingOrders || isLoadingProducts ? (
          <>
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-black/10 dark:border-white/15 surface-glass p-4 sm:p-5 flex flex-col justify-between"
              >
                <Skeleton width={96} height={12} />
                <Skeleton width={40} height={28} className="mt-3" />
              </div>
            ))}
          </>
        ) : (
          <>
            <div
              onClick={() => onNavigate("orders")}
              className="rounded-xl border border-black/10 dark:border-white/15 surface-glass p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:border-gold/60 hover:-translate-y-0.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group"
            >
              <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Total Orders
                </span>
                <Package className="w-4 h-4 text-black/45 dark:text-white/45 group-hover:text-gold transition-colors" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-black dark:text-white">
                {orders.length}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 dark:border-white/15 surface-glass p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Active / Pending
                </span>
                <Clock className="w-4 h-4 text-gold" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-gold">
                {activeOrders.length + pendingOrders.length}
              </div>
            </div>

            <div className="rounded-xl border border-black/10 dark:border-white/15 surface-glass p-4 sm:p-5 flex flex-col justify-between">
              <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Products Available
                </span>
                <Store className="w-4 h-4 text-black/45 dark:text-white/45" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-black dark:text-white">
                {products.length}
              </div>
            </div>

            <div
              onClick={() => onNavigate("addresses")}
              className="rounded-xl border border-black/10 dark:border-white/15 surface-glass p-4 sm:p-5 flex flex-col justify-between cursor-pointer hover:border-gold/60 hover:-translate-y-0.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group"
            >
              <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
                <span className="text-[10px] uppercase tracking-widest font-bold">
                  Saved Info
                </span>
                <MapPin className="w-4 h-4 text-black/45 dark:text-white/45 group-hover:text-gold transition-colors" />
              </div>
              <div className="text-2xl sm:text-3xl font-mono font-bold text-black dark:text-white">
                {user?.addresses?.length ?? 0}
                <span className="text-xs text-black/45 dark:text-white/45 font-sans font-normal ml-1">
                  addr
                </span>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="rounded-xl border border-black/10 dark:border-white/15 surface-glass p-5 sm:p-6" data-tour="dash-recent-orders">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
            Recent Orders
          </h3>
          {orders.length > 0 && (
            <button
              type="button"
              onClick={() => onNavigate("orders")}
              className="text-xs text-gold hover:underline uppercase tracking-wider font-semibold min-h-[44px] flex items-center transition-colors duration-[400ms]"
            >
              View all ({orders.length}) →
            </button>
          )}
        </div>

        {isLoadingOrders ? (
          <div className="space-y-3">
            <ListRowSkeleton />
            <ListRowSkeleton />
            <ListRowSkeleton />
          </div>
        ) : recentOrders.length === 0 ? (
          <p className="text-sm text-black/50 dark:text-white/50 py-4">
            No orders yet. Start shopping to see your orders here.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-transparent">
            {recentOrders.map((o) => (
              <div
                key={o.id}
                className="py-3 flex items-center justify-between text-xs sm:text-sm"
              >
                <div className="min-w-0 pr-3">
                  <span className="font-mono font-bold text-black dark:text-white">
                    {o.id}
                  </span>
                  <p className="text-black/45 dark:text-white/45 text-xs truncate mt-0.5">
                    {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="font-bold text-gold">
                    {o.total.toFixed(2)} GHS
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50 block">
                    {o.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 font-bold mb-4">
          Quick Links
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" data-tour="dash-quick-links">
          {quickLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => onNavigate(link.page)}
              className="rounded-xl border border-black/10 dark:border-white/15 surface-glass p-4 min-w-0 min-h-[44px] flex items-center gap-2.5 hover:border-gold/60 hover:bg-gold/5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group text-left"
            >
              <span className="text-black/45 dark:text-white/45 group-hover:text-gold transition-colors flex-shrink-0">
                {link.icon}
              </span>
              <span className="text-xs uppercase tracking-wider font-semibold text-black dark:text-white min-w-0 leading-tight truncate">
                {link.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {(isLoadingProducts ? [1, 2, 3] : featuredProducts).length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 font-bold">
              Featured Fragrances
            </h3>
            {!isLoadingProducts && (
              <button
                type="button"
                onClick={() => onNavigate("shop")}
                className="text-xs text-gold hover:underline uppercase tracking-wider font-semibold min-h-[44px] flex items-center transition-colors duration-[400ms]"
              >
                View all ({products.length}) →
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 min-[460px]:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 xl:gap-5">
            {isLoadingProducts ? (
              <>
                <ProductCardSkeleton />
                <ProductCardSkeleton />
                <ProductCardSkeleton />
              </>
            ) : (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct || (() => {})}
                  onAddToCart={onAddToCart}
                  isAdded={recentlyAddedId === product.id}
                />
              ))
            )}
          </div>
        </div>
      )}

      <div
        onClick={() => onNavigate("shop")}
        className="relative overflow-hidden rounded-xl border border-gold/40 surface-glass-tint p-6 sm:p-8 cursor-pointer hover:bg-gold/12 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gold/10 blur-3xl pointer-events-none animate-mist-pulse" />
        <div className="relative flex items-center justify-between">
          <div>
            <h3 className="text-sm sm:text-base font-brand-serif text-black dark:text-white font-light">
              Discover Our Collection
            </h3>
            <p className="text-xs text-black/50 dark:text-white/50 mt-1">
              Explore our curated selection of luxury fragrances.
            </p>
          </div>
          <ShoppingBag className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
        </div>
      </div>
    </div>
  );
};
