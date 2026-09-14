import React from "react";
import type { Order, OrderStatus } from "../../../types";
import { ShoppingCart, Store } from "lucide-react";

interface OrderCardProps {
  order: Order;
  statuses: OrderStatus[];
  onUpdateStatus: (orderId: string, newStatus: OrderStatus) => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  statuses,
  onUpdateStatus,
}) => {
  const isPhysical = order.source === "PHYSICAL";

  return (
    <div className="relative overflow-hidden surface-glass-strong hover:border-gold/50 hover:shadow-lift p-4 sm:p-5 transition-all rounded-xl">
      <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-sm font-bold text-black dark:text-white">
            {order.id}
          </span>

          {isPhysical ? (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-gold text-black border border-gold/40 text-[10px] font-bold uppercase tracking-wider rounded-full">
              <Store className="w-3 h-3 text-black dark:text-white" />
              <span>Physical Store</span>
            </span>
          ) : (
            <span className="inline-flex items-center space-x-1 px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black border border-white/30 dark:border-black/30 text-[10px] font-bold uppercase tracking-wider rounded-full">
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

          <select
            value={order.status}
            onChange={(e) => onUpdateStatus(order.id, e.target.value as OrderStatus)}
            className="min-h-[44px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 text-xs uppercase tracking-wider font-semibold text-black dark:text-white px-2 py-1 focus:outline-none focus:border-gold rounded-full"
            data-tour="admin-order-status"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 font-bold block">
            Fragrances Deducted:
          </span>
          <p className="text-black/60 dark:text-white/60 font-medium">
            {order.items.map((it) => `${it.quantity}x ${it.name} (${it.price.toFixed(2)} GHS)`).join(", ")}
          </p>
        </div>

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
};