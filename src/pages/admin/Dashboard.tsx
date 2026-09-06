import React from "react";
import type { Product, Order } from "../../types";
import {
  Boxes,
  AlertTriangle,
  XCircle,
  TrendingUp,
  Clock,
  PlusCircle,
  RefreshCw,
} from "lucide-react";

export interface DashboardProps {
  products: Product[];
  orders: Order[];
  onNavigateTo: (page: "inventory" | "orders" | "add-product" | "record-sale" | "restock") => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  products,
  orders,
  onNavigateTo,
}) => {
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock > 0 && p.stock <= 3);
  const outOfStockProducts = products.filter((p) => p.stock <= 0);

  // Today's orders & sales
  const todayOrders = orders.filter((o) => o.createdAt?.toLowerCase().includes("today"));
  const todaySalesTotal = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "PENDING");

  return (
    <div className="w-full space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 pb-2">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif"
          >
            Inventory Overview
          </h2>
          <p className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mt-1">
            Zaanisung Ent. GH Live At-A-Glance
          </p>
        </div>

        {/* Rapid Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onNavigateTo("record-sale")}
            className="min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-bold text-gold bg-gold/15 hover:bg-gold/25 border border-gold/40 flex items-center space-x-1.5 transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-gold" />
            <span>Record Sale</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo("restock")}
            className="min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-bold text-gold bg-gold/10 hover:bg-gold/10 border border-gold/40 flex items-center space-x-1.5 transition-colors"
          >
            <RefreshCw className="w-4 h-4 text-gold" />
            <span>Restock</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigateTo("add-product")}
            className="min-h-[44px] px-3.5 py-2 text-xs uppercase tracking-wider font-bold text-black dark:text-white bg-white dark:bg-white/5 hover:bg-cream dark:hover:bg-white/10 border border-black/10 dark:border-white/15 flex items-center space-x-1.5 transition-colors"
          >
            <PlusCircle className="w-4 h-4 text-gold" />
            <span>+ Add Perfume</span>
          </button>
        </div>
      </div>

      {/* 5 Core Metric Cards (Read at a glance) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Total Products */}
        <div
          onClick={() => onNavigateTo("inventory")}
          className="surface-glass-strong hover:border-gold/60 hover:shadow-lift hover:-translate-y-0.5 p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Total Perfumes
            </span>
            <Boxes className="w-4 h-4 text-black/45 dark:text-white/45 group-hover:text-gold transition-colors" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-black dark:text-white">
            {totalProducts}
          </div>
          <span className="text-[10px] text-black/50 dark:text-white/50 mt-2 block">
            View product list →
          </span>
        </div>

        {/* Low Stock Count */}
        <div
          onClick={() => onNavigateTo("inventory")}
          className={`relative overflow-hidden surface-glass-strong hover:shadow-lift hover:-translate-y-0.5 p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all group ${
            lowStockProducts.length > 0
              ? "border-gold/50 bg-gold/8 hover:border-gold"
              : "hover:border-gold/60"
          }`}
        >
          <div className="flex items-center justify-between text-gold mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Low Stock
            </span>
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-gold">
            {lowStockProducts.length}
          </div>
          <span className="text-[10px] text-black/50 dark:text-white/50 mt-2 block">
            ≤ 3 bottles remaining
          </span>
        </div>

        {/* Out of Stock Count */}
        <div
          onClick={() => onNavigateTo("inventory")}
          className={`relative overflow-hidden surface-glass-strong hover:shadow-lift hover:-translate-y-0.5 p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all group ${
            outOfStockProducts.length > 0
              ? "border-red-900/50 bg-red-950/10 hover:border-red-600"
              : "hover:border-gold/60"
          }`}
        >
          <div className="flex items-center justify-between text-red-500 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Out of Stock
            </span>
            <XCircle className="w-4 h-4" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-red-400">
            {outOfStockProducts.length}
          </div>
          <span className="text-[10px] text-black/50 dark:text-white/50 mt-2 block">
            Needs immediate restock
          </span>
        </div>

        {/* Today's Orders / Sales */}
        <div
          onClick={() => onNavigateTo("orders")}
          className="surface-glass-strong hover:border-gold/60 hover:shadow-lift hover:-translate-y-0.5 p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Today's Volume
            </span>
            <TrendingUp className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-black dark:text-white">
            {todayOrders.length}{" "}
            <span className="text-xs text-black/45 dark:text-white/45 font-sans font-normal">
              ({todaySalesTotal.toFixed(0)} GHS)
            </span>
          </div>
          <span className="text-[10px] text-black/50 dark:text-white/50 mt-2 block">
            Online & physical sales
          </span>
        </div>

        {/* Pending Orders */}
        <div
          onClick={() => onNavigateTo("orders")}
          className="surface-glass-strong hover:border-gold/60 hover:shadow-lift hover:-translate-y-0.5 p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all group col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-black/50 dark:text-white/50 mb-2">
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Pending Orders
            </span>
            <Clock className="w-4 h-4 text-gold" />
          </div>
          <div className="text-2xl sm:text-3xl font-mono font-bold text-gold">
            {pendingOrders.length}
          </div>
          <span className="text-[10px] text-black/50 dark:text-white/50 mt-2 block">
            Awaiting dispatch / confirmation
          </span>
        </div>
      </div>

      {/* Critical Stock Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="relative overflow-hidden surface-glass-strong p-5 shadow-lift">
          <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
          <div className="relative flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-gold" />
              <span>Fragrances Requiring Stock Replenishment</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateTo("restock")}
              className="text-xs text-gold hover:underline uppercase tracking-wider font-semibold"
            >
              Restock Now →
            </button>
          </div>

          <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[...outOfStockProducts, ...lowStockProducts].slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="p-3 surface-glass-tint flex items-center justify-between"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-10 object-cover border border-black/10 dark:border-white/15 flex-shrink-0"
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-black dark:text-white truncate">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-black/45 dark:text-white/45">
                      {item.price.toFixed(2)} GHS
                    </p>
                  </div>
                </div>

                <div className="text-right flex-shrink-0 ml-2">
                  <span
                    className={`inline-block px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      item.stock <= 0
                        ? "bg-red-950 text-red-300 border border-red-800"
                        : "bg-gold/10 text-gold border border-gold/40"
                    }`}
                  >
                    {item.stock <= 0 ? "0 stock" : `${item.stock} left`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders Overview */}
      <div className="relative overflow-hidden surface-glass-strong p-5 shadow-lift">
        <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
        <div className="relative flex items-center justify-between mb-4">
          <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
            Recent Orders & Recorded Sales
          </h3>
          <button
            type="button"
            onClick={() => onNavigateTo("orders")}
            className="text-xs text-gold hover:underline uppercase tracking-wider font-semibold"
          >
            View All ({orders.length}) →
          </button>
        </div>

        <div className="relative flex flex-col divide-y divide-black/10 dark:divide-white/10">
          {orders.slice(0, 4).map((o) => (
            <div
              key={o.id}
              className="py-3 flex items-center justify-between text-xs sm:text-sm"
            >
              <div className="min-w-0 pr-3">
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-black dark:text-white">{o.id}</span>
                  <span
                    className={`text-[9px] uppercase tracking-wider px-1.5 py-0.2 font-bold ${
                      o.source === "ONLINE"
                        ? "bg-black dark:bg-white text-white dark:text-black border border-white/30 dark:border-black/30"
                        : "bg-gold text-black border border-gold/40"
                    }`}
                  >
                    {o.source || "ONLINE"}
                  </span>
                </div>
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
      </div>
    </div>
  );
};
