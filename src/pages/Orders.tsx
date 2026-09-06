import React, { useState } from "react";
import { Order } from "../types";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/ui/StatusBadge";
import { EmptyState } from "../components/ui/EmptyState";
import { ReceiptText, ChevronRight, ArrowLeft } from "lucide-react";

export interface OrdersProps {
  orders: Order[];
  onContinueShopping: () => void;
  selectedOrderId?: string | null;
}

export const Orders: React.FC<OrdersProps> = ({
  orders,
  onContinueShopping,
  selectedOrderId: initialSelectedId = null,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);

  const selectedOrder = orders.find((o) => o.id === selectedId);

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<ReceiptText className="w-6 h-6 stroke-[1.5]" />}
        title="No orders yet"
        message="When you purchase perfumes, your receipts and order updates will appear here."
        action={
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onContinueShopping}
            className="w-full font-bold"
          >
            Browse Perfumes
          </Button>
        }
      />
    );
  }

  // If viewing single order detail
  if (selectedOrder) {
    return (
      <div className="w-full max-w-2xl mx-auto space-y-6">
        <button
          type="button"
          onClick={() => setSelectedId(null)}
          className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-black dark:text-white/60 dark:hover:text-white font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to all orders
        </button>

        <div className="relative overflow-hidden surface-glass-strong p-6 sm:p-8 shadow-lift">
          <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
          <div className="absolute -top-24 -right-24 w-64 h-64 orb orb-gold-faint" aria-hidden="true"></div>

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 gap-2">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 block">
                Order Reference
              </span>
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-black dark:text-white mt-0.5">
                {selectedOrder.id}
              </h2>
            </div>
            <div className="self-start sm:self-auto">
              <StatusBadge status={selectedOrder.status} size="md" />
            </div>
          </div>

          {/* Items Breakdown */}
          <div className="space-y-4 mb-8">
            <h3 className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 font-bold">
              Ordered Fragrances
            </h3>
            <div className="relative flex flex-col divide-y divide-black/10 dark:divide-white/10">
              {selectedOrder.items.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between">
                  <div>
                    <h4
                      className="font-brand-serif text-sm font-medium text-black dark:text-white"
                    >
                      {item.name}
                    </h4>
                    <span className="text-xs text-black/50 dark:text-white/60">
                      Quantity: {item.quantity} × {item.price.toFixed(2)} GHS
                    </span>
                  </div>
                  <span className="text-sm font-bold text-black dark:text-white font-mono">
                    {(item.price * item.quantity).toFixed(2)} GHS
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Logistics / Summary */}
          <div className="relative surface-glass p-4 space-y-2.5 text-xs sm:text-sm">
            {selectedOrder.customerName && (
              <div className="flex justify-between">
                <span className="text-black/50 dark:text-white/50 uppercase tracking-wider text-[11px]">Customer</span>
                <span className="font-medium text-black dark:text-white">{selectedOrder.customerName}</span>
              </div>
            )}
            {selectedOrder.customerPhone && (
              <div className="flex justify-between">
                <span className="text-black/50 dark:text-white/50 uppercase tracking-wider text-[11px]">Phone</span>
                <span className="text-black dark:text-white font-mono">{selectedOrder.customerPhone}</span>
              </div>
            )}
            {selectedOrder.deliveryAddress && (
              <div className="flex justify-between">
                <span className="text-black/50 dark:text-white/50 uppercase tracking-wider text-[11px]">Address</span>
                <span className="text-black dark:text-white text-right max-w-xs">{selectedOrder.deliveryAddress}</span>
              </div>
            )}
            {selectedOrder.paymentMethod && (
              <div className="flex justify-between">
                <span className="text-black/50 dark:text-white/50 uppercase tracking-wider text-[11px]">Payment</span>
                <span className="text-black dark:text-white">{selectedOrder.paymentMethod}</span>
              </div>
            )}
            <div className="pt-3 flex justify-between font-bold">
              <span className="uppercase tracking-widest text-black dark:text-white">Total</span>
              <span className="text-base font-mono text-gold">
                {selectedOrder.total.toFixed(2)} GHS
              </span>
            </div>
          </div>

          <div className="mt-6">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onContinueShopping}
              className="w-full font-bold"
            >
              Order More Perfumes
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Simple list (reference, total, status)
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-baseline justify-between pb-4 mb-6">
        <h2
          className="text-2xl font-light text-black dark:text-white font-brand-serif"
        >
          My Orders
        </h2>
        <span className="text-xs uppercase tracking-widest text-black/45 dark:text-white/50">
          {orders.length} Records
        </span>
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <div
            key={order.id}
            onClick={() => setSelectedId(order.id)}
            className="p-4 sm:p-5 surface-glass-strong hover:border-gold/60 hover:shadow-lift cursor-pointer flex items-center justify-between transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 min-h-[56px]"
          >
            <div className="flex-1 min-w-0 pr-4">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-black dark:text-white">
                  {order.id}
                </span>
                {order.source && (
                  <span
                    className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-bold ${
                      order.source === "ONLINE"
                        ? "bg-white dark:bg-black text-black dark:text-white border border-black/10 dark:border-white/30"
                        : "bg-gold/15 dark:bg-gold text-gold dark:text-black border border-gold/40 dark:border-gold/40"
                    }`}
                  >
                    {order.source}
                  </span>
                )}
              </div>
              <p className="text-xs text-black/50 dark:text-white/50 mt-1 truncate">
                {order.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
              </p>
            </div>

            <div className="flex items-center space-x-4 flex-shrink-0">
              <div className="text-right">
                <span className="text-sm sm:text-base font-bold font-mono text-gold block">
                  {order.total.toFixed(2)} GHS
                </span>
                <span className="text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 font-semibold">
                  {order.status}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-black/45 dark:text-white/45" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
