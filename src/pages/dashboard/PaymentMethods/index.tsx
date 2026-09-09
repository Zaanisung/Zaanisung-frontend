import React, { useState } from "react";
import type { PaymentMethod } from "../../../types/user";
import { EmptyState } from "../../../components/ui/EmptyState";
import { Plus, CreditCard } from "lucide-react";
import { PaymentMethodCard } from "./PaymentMethodCard";
import { AddPaymentMethodModal } from "./AddPaymentMethodModal";

export interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (
    data: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }
  ) => void;
  onDeletePaymentMethod: (id: string) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
}

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentMethods,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  onSetDefaultPaymentMethod,
}) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="w-full space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow text-black/45 dark:text-white/45 mb-1">
            Billing
          </p>
          <h2 className="text-2xl font-light text-black dark:text-white font-brand-serif">
            Payment Methods
          </h2>
        </div>
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="min-h-[44px] rounded-lg px-4 py-2 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] flex items-center gap-2 shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_32px_-8px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          <span>Add Method</span>
        </button>
      </div>

      {paymentMethods.length === 0 ? (
        <EmptyState
          icon={<CreditCard className="w-16 h-16 text-gold" />}
          title="No Payment Methods Yet"
          message="Add a payment method to complete your purchases faster."
          action={
            <button
              type="button"
              onClick={() => setShowModal(true)}
              className="min-h-[44px] rounded-lg px-5 py-2.5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-all duration-[400ms]"
            >
              Add Your First Method
            </button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((pm) => (
            <PaymentMethodCard
              key={pm._id}
              pm={pm}
              onDelete={onDeletePaymentMethod}
              onSetDefault={onSetDefaultPaymentMethod}
            />
          ))}
        </div>
      )}

      <AddPaymentMethodModal
        open={showModal}
        isFirstMethod={paymentMethods.length === 0}
        onClose={() => setShowModal(false)}
        onAdd={onAddPaymentMethod}
      />
    </div>
  );
};