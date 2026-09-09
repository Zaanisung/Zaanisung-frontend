import React, { useState } from "react";
import type { Order, OrderStatus } from "../../../types";
import { SearchInput } from "../../../components/ui/SearchInput";
import { OrderCard } from "./OrderCard";
import { OrderStatusFilter } from "./OrderStatusFilter";
import type { OrderSourceFilter } from "./OrderStatusFilter";

export interface AdminOrdersProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
];

export const AdminOrders: React.FC<AdminOrdersProps> = ({
  orders,
  onUpdateStatus,
}) => {
  const [filterSource, setFilterSource] = useState<OrderSourceFilter>("ALL");
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

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2 className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif">
            Sales & Orders Log
          </h2>
          <p className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 mt-1">
            Online Store Orders vs Physical Walk-In Sales
          </p>
        </div>

        <OrderStatusFilter value={filterSource} onChange={setFilterSource} />
      </div>

      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by Order ID, fragrance, or customer..."
        ariaLabel="Search orders"
        className="w-full max-w-md"
      />

      {filteredOrders.length === 0 && (
        <div className="relative overflow-hidden surface-glass-strong p-6 text-center py-14 shadow-lift">
          <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />
          <p className="relative text-sm text-black/45 dark:text-white/45">
            No sales or orders match the current criteria.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {filteredOrders.map((order) => (
          <OrderCard
            key={order.id}
            order={order}
            statuses={ORDER_STATUSES}
            onUpdateStatus={onUpdateStatus}
          />
        ))}
      </div>
    </div>
  );
};