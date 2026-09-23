import React from "react";
import type { PaymentMethod } from "../../../types/user";
import { PAYMENT_METHOD_LABELS } from "../../../constants";
import { PaymentMethodLogo } from "../../../components/PaymentMethodLogo";
import { Popover } from "../../../components/ui/Popover";
import { Star, MoreVertical, Trash2 } from "lucide-react";

interface PaymentMethodCardProps {
  pm: PaymentMethod;
  onDelete: (id: string) => void;
  onSetDefault: (id: string) => void;
}

/** Full-width card (grid cell) showing one saved payment method. */
export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  pm,
  onDelete,
  onSetDefault,
}) => {
  const maskDetails = () => {
    if (pm.type === "MOBILE_MONEY" && pm.details.momoNumber) {
      const num = pm.details.momoNumber;
      return `${pm.details.momoNetwork ?? ""} · ${num.slice(0, 3)}****${num.slice(-2)}`;
    }
    if (pm.type === "CARD" && pm.details.cardLast4) {
      return `${pm.details.cardBrand ?? "Card"} ····${pm.details.cardLast4}`;
    }
    if (pm.type === "BANK" && pm.details.accountNumber) {
      const acc = pm.details.accountNumber;
      return `${pm.details.bankName ?? ""} ····${acc.slice(-4)}`;
    }
    if (pm.type === "CASH") return "Pay on delivery";
    return pm.label;
  };

  return (
    <div className="surface-glass-strong rounded-xl border border-black/10 dark:border-white/15 p-5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <PaymentMethodLogo
            className="w-12 h-8 rounded-lg flex-shrink-0"
            provider={pm.provider}
            type={pm.type}
            details={pm.details}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-ink dark:text-white">
                {pm.label}
              </span>
              {pm.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-lg px-2 py-0.5 bg-gold/10 text-gold text-[10px] uppercase tracking-wider font-bold">
                  <Star className="w-3 h-3 fill-gold" />
                  Default
                </span>
              )}
            </div>
            <p className="text-xs text-black/50 dark:text-white/50 mb-0.5">
              {PAYMENT_METHOD_LABELS[pm.type]}
            </p>
            <p className="text-xs text-black/70 dark:text-white/70 font-mono">
              {maskDetails()}
            </p>
          </div>
        </div>

        {/* Action menu */}
        <Popover
          trigger={
            <button
              type="button"
              className="min-h-[36px] min-w-[36px] rounded-lg flex items-center justify-center text-black/45 dark:text-white/45 hover:text-ink dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-[400ms]"
              aria-label="Payment method options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          }
          content={
            <div className="py-1 min-w-[160px]">
              {!pm.isDefault && (
                <button
                  type="button"
                  onClick={() => onSetDefault(pm._id)}
                  className="w-full px-4 py-2.5 text-left text-sm text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-white flex items-center gap-2 transition-all duration-[400ms]"
                >
                  <Star className="w-4 h-4" />
                  <span>Set as Default</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => onDelete(pm._id)}
                className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-all duration-[400ms]"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            </div>
          }
          position="bottom"
          align="end"
        />
      </div>
    </div>
  );
};