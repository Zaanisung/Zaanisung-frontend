import React from "react";
import { Order } from "../types";
import { Button } from "../components/Button";
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
      <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 p-6 sm:p-10 shadow-xs text-center">
        {/* Geometric Check Icon Frame */}
        <div className="w-16 h-16 bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8 text-[#D4AF37] stroke-[2.5]" />
        </div>

        <h2
          className="text-2xl sm:text-3xl font-light text-black dark:text-white mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          Order Confirmed
        </h2>
        <p className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mb-8">
          Thank you for choosing Zaanisung Ent. GH
        </p>

        {/* Order Reference Card */}
        <div className="bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 p-5 mb-8 text-left space-y-3 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-black/50 dark:text-white/50 text-[11px]">Order Reference</span>
            <span className="font-mono font-bold text-black dark:text-white">{order.id}</span>
          </div>

          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-black/50 dark:text-white/50 text-[11px]">Total Paid/Due</span>
            <span className="font-bold font-mono text-[#D4AF37]">{order.total.toFixed(2)} GHS</span>
          </div>

          <div className="flex justify-between">
            <span className="uppercase tracking-widest text-black/50 dark:text-white/50 text-[11px]">Status</span>
            <span className="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-[10px] uppercase tracking-wider font-bold">
              {order.status}
            </span>
          </div>

          {order.paymentMethod && (
            <div className="flex justify-between">
              <span className="uppercase tracking-widest text-black/50 dark:text-white/50 text-[11px]">Payment</span>
              <span className="text-black/85 dark:text-white/85 font-medium">{order.paymentMethod}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3">
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
