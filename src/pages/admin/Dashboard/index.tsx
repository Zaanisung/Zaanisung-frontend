import React from "react";
import type { Product, Order } from "../../../types";
import { Skeleton, ListRowSkeleton } from "../../../components/ui/Skeleton";
import {
  Boxes,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  PlusCircle,
  RefreshCw,
} from "lucide-react";
import { StatCard } from "./StatCard";
import { StockAlertsCard } from "./StockAlertsCard";
import { RecentOrdersCard } from "./RecentOrdersCard";

export interface DashboardProps {
  products: Product[];
  orders: Order[];
  isLoadingProducts?: boolean;
  isLoadingOrders?: boolean;
  onNavigateTo: (page: "inventory" | "orders" | "add-product" | "record-sale" | "restock") => void;
}

/** True when the given timestamp falls on the current calendar day (local time). */
const isToday = (value?: string | Date | null): boolean => {
  if (!value) return false;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return false;
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
};

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  orders,
  isLoadingProducts = false,
  isLoadingOrders = false,
  onNavigateTo,
}) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 3);
  const outOfStockProducts = products.filter((p) => p.stock <= 0);

  const todayOrders = orders.filter((o) => isToday(o.createdAt));
  const todaySalesTotal = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING");

  return (
    <div className="w-full space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif">
            Inventory Overview
          </h2>
          <p className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mt-1">
            Zaanisung Live At-A-Glance
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTo("record-sale")}
            className="rounded-lg min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-bold text-gold surface-glass-tint hover:bg-gold/25 border border-gold/40 flex items-center space-x-1.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <TrendingUp className="w-4 h-4 text-gold" />
            <span>Record Sale</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo("restock")}
            className="rounded-lg min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-bold text-gold surface-glass-tint hover:bg-gold/20 border border-gold/40 flex items-center space-x-1.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <RefreshCw className="w-4 h-4 text-gold" />
            <span>Restock</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo("add-product")}
            className="rounded-lg min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-bold text-black dark:text-white surface-glass hover:bg-cream dark:hover:bg-white/10 border border-black/10 dark:border-white/15 flex items-center space-x-1.5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
          >
            <PlusCircle className="w-4 h-4 text-gold" />
            <span>+ Add Perfume</span>
          </button>
        </div>
      </div>

      {isLoadingProducts || isLoadingOrders ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="relative overflow-hidden surface-glass-strong p-6 shadow-lift rounded-[18px]"
              >
                <Skeleton width={96} height={12} />
                <Skeleton width={48} height={28} className="mt-4" />
                <Skeleton width={72} height={12} className="mt-3" />
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <ListRowSkeleton />
            <ListRowSkeleton />
            <ListRowSkeleton />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
        <StatCard
          label="Total Perfumes"
          value={totalProducts}
          caption="View product list →"
          icon={<Boxes className="w-4 h-4 text-black/45 dark:text-white/45 group-hover:text-gold transition-colors duration-[400ms]" />}
          onClick={() => onNavigateTo("inventory")}
        />

        <StatCard
          label="Low Stock"
          value={lowStockProducts.length}
          caption="≤ 3 bottles remaining"
          icon={<AlertTriangle className="w-4 h-4" />}
          onClick={() => onNavigateTo("inventory")}
          tone="gold"
          active={lowStockProducts.length > 0}
        />

        <StatCard
          label="Out of Stock"
          value={outOfStockProducts.length}
          caption="Needs immediate restock"
          icon={<XCircle className="w-4 h-4" />}
          onClick={() => onNavigateTo("inventory")}
          tone="red"
          active={outOfStockProducts.length > 0}
        />

        <StatCard
          label="Today's Volume"
          value={
            <>
              {todayOrders.length}{" "}
              <span className="text-xs text-black/45 dark:text-white/45 font-sans font-normal">
                ({todaySalesTotal.toFixed(0)} GHS)
              </span>
            </>
          }
          caption="Online & physical sales"
          icon={<TrendingUp className="w-4 h-4 text-gold" />}
          onClick={() => onNavigateTo("orders")}
        />

        <StatCard
          label="Pending Orders"
          value={pendingOrders.length}
          caption="Awaiting dispatch / confirmation"
          icon={<Clock className="w-4 h-4 text-gold" />}
          onClick={() => onNavigateTo("orders")}
          className="col-span-2 sm:col-span-1"
        />
      </div>

      <StockAlertsCard
        lowStock={lowStockProducts}
        outOfStock={outOfStockProducts}
        onRestock={() => onNavigateTo("restock")}
      />

      <RecentOrdersCard
        orders={orders}
        onViewAll={() => onNavigateTo("orders")}
      />
        </>
      )}
    </div>
  );
};