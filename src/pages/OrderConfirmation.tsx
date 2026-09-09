import React from "react";
import { Order } from "../types";
import { Button } from "../components/Button";
import { StatusBadge } from "../components/ui/StatusBadge";
import { Check } from "lucide-react";

export interface OrderConfirmationProps {
  order: Order;
  onViewOrder: () => void;
  onContinueShopping: () => void;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  order,
  onViewOrder,
  onContinueShopping,
}) => {
  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4">
      <div className="relative overflow-hidden surface-glass-strong rounded-2xl p-6 sm:p-10 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)] text-center">
        <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
        <div className="absolute -top-28 -left-24 w-72 h-72 orb orb-gold-faint animate-mist-pulse" aria-hidden="true"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 orb orb-gold-faint" aria-hidden="true"></div>

        {/* Geometric Check Icon Frame */}
        <div className="relative w-16 h-16 bg-gold/15 border border-gold/40 flex items-center justify-center mx-auto mb-6 rounded-xl">
          <Check className="w-8 h-8 text-gold stroke-[2.5]" />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-light text-black dark:text-white mb-2 font-brand-serif"
        >
          Order Confirmed
        </h2>
        <p className="relative text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mb-8">
          Thank you for choosing Zaanisung Ent. GH
        </p>

        {/* Order Reference Card */}
        <div className="relative surface-glass-tint p-5 mb-8 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-black/50 dark:text-white/50 text-[11px]">Order Reference</span>
            <span className="font-mono font-bold text-black dark:text-white">{order.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-black/50 dark:text-white/50 text-[11px]">Total Paid/Due</span>
            <span className="font-bold font-mono text-gold">{order.total.toFixed(2)} GHS</span>
          </div>

          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-black/50 dark:text-white/50 text-[11px]">Status</span>
            <StatusBadge status={order.status} size="sm" />
          </div>

          {order.paymentMethod && (
            <div className="flex justify-between">
              <span className="uppercase tracking-widest text-black/50 dark:text-white/50 text-[11px]">Payment</span>
              <span className="text-black/85 dark:text-white/85 font-medium">{order.paymentMethod}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="relative space-y-3">
          <Button
            type="button"
            variant="primary"
            size="lg"
            onClick={onViewOrder}
            className="w-full font-bold shadow-xs"
          >
            View Order Receipt
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onContinueShopping}
            className="w-full font-bold"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};
