import React, { useState } from "react";
import type { Order, OrderStatus } from "../../types";
import { SearchInput } from "../../components/ui/SearchInput";
import { ShoppingCart, Store } from "lucide-react";

export interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateStatus,
}) => {
  const [filterSource, setFilterSource] = useState<"ALL" | "ONLINE" | "PHYSICAL">("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((o) => {
    if (filterSource !== "ALL" && (o.source || "ONLINE") !== filterSource) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchId = o.id.toLowerCase().includes(q);
      const matchCustomer = (o.customerName || "").toLowerCase().includes(q);
      const matchItems = o.items.some((i) => i.name.toLowerCase().includes(q));
      return matchId || matchCustomer || matchItems;
    }
    return true;
  });

  const allStatuses: OrderStatus[] = [
    "PENDING",
    "CONFIRMED",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif"
          >
            Sales & Orders Log
          </h2>
          <p className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 mt-1">
            Online Store Orders vs Physical Walk-In Sales
          </p>
        </div>

        {/* Source Filter Switcher */}
        <div className="inline-flex p-1 surface-glass">
          {(["ALL", "ONLINE", "PHYSICAL"] as const).map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => setFilterSource(source)}
              className={`min-h-[38px] px-3 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                filterSource === source
                  ? "bg-gold text-black"
                  : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white"
              }`}
            >
              {source === "ALL" ? "All Sales" : source === "ONLINE" ? "Online Orders" : "Walk-in Sales"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by Order ID, fragrance, or customer..."
        ariaLabel="Search orders"
        className="w-full max-w-md"
      />

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="relative overflow-hidden surface-glass-strong p-6 text-center py-14 shadow-lift">
          <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
          <p className="relative text-sm text-black/45 dark:text-white/45">
            No sales or orders match the current criteria.
          </p>
        </div>
      )}

      {/* Orders List / Table */}
      <div className="space-y-3">
        {filteredOrders.map((order) => {
          const isPhysical = order.source === "PHYSICAL";

          return (
            <div
              key={order.id}
              className="relative overflow-hidden surface-glass-strong hover:border-gold/50 hover:shadow-lift p-4 sm:p-5 transition-all"
            >
              <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-black dark:text-white">
                    {order.id}
                  </span>

                  {/* High visibility SOURCE BADGE: ONLINE vs PHYSICAL */}
                  {isPhysical ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-gold text-black border border-gold/40 text-[10px] font-bold uppercase tracking-wider">
                      <Store className="w-3 h-3 text-black dark:text-white" />
                      <span>Physical Store</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black border border-white/30 dark:border-black/30 text-[10px] font-bold uppercase tracking-wider">
                      <ShoppingCart className="w-3 h-3 text-gold" />
                      <span>Online Order</span>
                    </span>
                  )}

                  <span className="text-black/50 dark:text-white/50 text-xs">
                    {order.createdAt || "Recent"}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-base font-mono font-bold text-gold">
                    {order.total.toFixed(2)} GHS
                  </span>

                  {/* Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="min-h-[36px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs uppercase tracking-wider font-semibold text-black dark:text-white px-2 py-1 focus:outline-none focus:border-gold"
                  >
                    {allStatuses.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Items in order */}
              <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 font-bold block">
                    Fragrances Deducted:
                  </span>
                  <p className="text-black/60 dark:text-white/60 font-medium">
                    {order.items.map((it) => `${it.quantity}x ${it.name} (${it.price.toFixed(2)} GHS)`).join(", ")}
                  </p>
                </div>

                {/* Customer / Dispatch Details */}
                <div className="text-left sm:text-right text-black/45 dark:text-white/45 text-[11px] space-y-0.5">
                  <p>
                    <span className="text-black/50 dark:text-white/50 uppercase tracking-wider">Customer:</span>{" "}
                    <span className="text-black dark:text-white font-medium">{order.customerName || "Store Walk-In"}</span>
                  </p>
                  {order.customerPhone && (
                    <p>
                      <span className="text-black/50 dark:text-white/50 uppercase tracking-wider">Phone:</span>{" "}
                      <span>{order.customerPhone}</span>
                    </p>
                  )}
                  {order.paymentMethod && (
                    <p>
                      <span className="text-black/50 dark:text-white/50 uppercase tracking-wider">Payment:</span>{" "}
                      <span className="text-gold">{order.paymentMethod}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
