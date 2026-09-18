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
          Thank you for choosing Zaanisung
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

        {(order.paymentMethod || "").startsWith("Mobile Money") && (
          <div className="relative surface-glass-tint p-4 mb-6 text-left text-xs text-black/70 dark:text-white/75">
            <span className="text-gold font-bold uppercase tracking-wider text-[10px] block mb-1.5">
              Next: Approve Payment
            </span>
            You&apos;ll receive a USSD prompt on your phone to approve the payment. If the prompt
            doesn&apos;t appear, reply to the order notification and we&apos;ll resend the request.
          </div>
        )}
        {(order.paymentMethod || "").startsWith("Bank") && (
          <div className="relative surface-glass-tint p-4 mb-6 text-left text-xs text-black/70 dark:text-white/75">
            <span className="text-gold font-bold uppercase tracking-wider text-[10px] block mb-1.5">
              Next: Complete Transfer
            </span>
            We&apos;ll contact you with our bank details to complete your transfer. Your order is
            confirmed once the payment reflects in our account.
          </div>
        )}
        {(order.paymentMethod || "").startsWith("Cash") && (
          <div className="relative surface-glass-tint p-4 mb-6 text-left text-xs text-black/70 dark:text-white/75">
            <span className="text-gold font-bold uppercase tracking-wider text-[10px] block mb-1.5">
              Next: Pay on Delivery
            </span>
            Pay the courier in cash when your order arrives. Exact change is appreciated.
          </div>
        )}

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
