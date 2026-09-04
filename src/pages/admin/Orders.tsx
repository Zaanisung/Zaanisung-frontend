import React, { useState } from "react";
import type { Order, OrderStatus } from "../../types";
import { Search, ShoppingCart, Store, X } from "lucide-react";

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E24] pb-4">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-light text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Sales & Orders Log
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
            Online Store Orders vs Physical Walk-In Sales
          </p>
        </div>

        {/* Source Filter Switcher */}
        <div className="inline-flex p-1 bg-[#121216] border border-[#22222A]">
          {(["ALL", "ONLINE", "PHYSICAL"] as const).map((source) => (
            <button
              key={source}
              type="button"
              onClick={() => setFilterSource(source)}
              className={`min-h-[38px] px-3 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                filterSource === source
                  ? "bg-[#D4AF37] text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {source === "ALL" ? "All Sales" : source === "ONLINE" ? "Online Orders" : "Walk-in Sales"}
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by Order ID, fragrance, or customer..."
          className="w-full pl-9 pr-8 min-h-[44px] bg-[#121216] border border-[#22222A] text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="py-16 text-center bg-[#121216] border border-[#1E1E24] p-6">
          <p className="text-sm text-gray-400">
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
              className="bg-[#121216] border border-[#1E1E24] hover:border-[#2B2B36] p-4 sm:p-5 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E1E24] pb-3 mb-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-sm font-bold text-white">
                    {order.id}
                  </span>

                  {/* High visibility SOURCE BADGE: ONLINE vs PHYSICAL */}
                  {isPhysical ? (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-purple-950/80 text-purple-300 border border-purple-800 text-[10px] font-bold uppercase tracking-wider">
                      <Store className="w-3 h-3 text-purple-400" />
                      <span>Physical Store</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-blue-950/80 text-blue-300 border border-blue-800 text-[10px] font-bold uppercase tracking-wider">
                      <ShoppingCart className="w-3 h-3 text-blue-400" />
                      <span>Online Order</span>
                    </span>
                  )}

                  <span className="text-gray-500 text-xs">
                    {order.createdAt || "Recent"}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="text-base font-mono font-bold text-[#D4AF37]">
                    {order.total.toFixed(2)} GHS
                  </span>

                  {/* Status Dropdown */}
                  <select
                    value={order.status}
                    onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
                    className="min-h-[36px] bg-[#1A1A22] border border-[#2E2E3C] text-xs uppercase tracking-wider font-semibold text-white px-2 py-1 focus:outline-none focus:border-[#D4AF37]"
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold block">
                    Fragrances Deducted:
                  </span>
                  <p className="text-gray-300 font-medium">
                    {order.items.map((it) => `${it.quantity}x ${it.name} (${it.price.toFixed(2)} GHS)`).join(", ")}
                  </p>
                </div>

                {/* Customer / Dispatch Details */}
                <div className="text-left sm:text-right text-gray-400 text-[11px] space-y-0.5">
                  <p>
                    <span className="text-gray-500 uppercase tracking-wider">Customer:</span>{" "}
                    <span className="text-white font-medium">{order.customerName || "Store Walk-In"}</span>
                  </p>
                  {order.customerPhone && (
                    <p>
                      <span className="text-gray-500 uppercase tracking-wider">Phone:</span>{" "}
                      <span>{order.customerPhone}</span>
                    </p>
                  )}
                  {order.paymentMethod && (
                    <p>
                      <span className="text-gray-500 uppercase tracking-wider">Payment:</span>{" "}
                      <span className="text-amber-300">{order.paymentMethod}</span>
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
