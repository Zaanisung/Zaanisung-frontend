import React, { useState } from "react";
import type { PaymentMethod, PaymentMethodType } from "../../types/user";
import { EmptyState } from "../../components/ui/EmptyState";
import { Modal } from "../../components/ui/Modal";
import { Dropdown } from "../../components/ui/Dropdown";
import { Popover } from "../../components/ui/Popover";
import { PaymentMethodLogo } from "../../components/PaymentMethodLogo";
import {
  Plus,
  Trash2,
  Star,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  MoreVertical,
} from "lucide-react";

export interface PaymentMethodsProps {
  paymentMethods: PaymentMethod[];
  onAddPaymentMethod: (
    data: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }
  ) => void;
  onDeletePaymentMethod: (id: string) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
}

const typeLabels: Record<PaymentMethodType, string> = {
  MOBILE_MONEY: "Mobile Money",
  CARD: "Card",
  BANK: "Bank Transfer",
  CASH: "Cash on Delivery",
};

export const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  paymentMethods,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  onSetDefaultPaymentMethod,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState<PaymentMethodType>("MOBILE_MONEY");
  const [provider, setProvider] = useState("");
  const [label, setLabel] = useState("");
  const [momoNetwork, setMomoNetwork] = useState("");
  const [momoNumber, setMomoNumber] = useState("");
  const [cardLast4, setCardLast4] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");

  const resetForm = () => {
    setType("MOBILE_MONEY");
    setProvider("");
    setLabel("");
    setMomoNetwork("");
    setMomoNumber("");
    setCardLast4("");
    setCardBrand("");
    setBankName("");
    setAccountNumber("");
    setAccountName("");
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const details: PaymentMethod["details"] = {};

    if (type === "MOBILE_MONEY") {
      details.momoNetwork = momoNetwork;
      details.momoNumber = momoNumber;
    } else if (type === "CARD") {
      details.cardLast4 = cardLast4;
      details.cardBrand = cardBrand;
    } else if (type === "BANK") {
      details.bankName = bankName;
      details.accountNumber = accountNumber;
      details.accountName = accountName;
    }

    onAddPaymentMethod({
      type,
      provider,
      label,
      details,
      isDefault: paymentMethods.length === 0,
    });
    resetForm();
  };

  const maskDetails = (pm: PaymentMethod) => {
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

  const inputClass =
    "w-full min-h-[44px] px-4 py-2.5 rounded-lg text-sm surface-glass-strong border border-black/15 dark:border-white/20 text-ink dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";

  const typeOptions = [
    { value: "MOBILE_MONEY", label: "Mobile Money", icon: <Smartphone className="w-4 h-4" /> },
    { value: "CARD", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
    { value: "BANK", label: "Bank Transfer", icon: <Building2 className="w-4 h-4" /> },
    { value: "CASH", label: "Cash on Delivery", icon: <Banknote className="w-4 h-4" /> },
  ];

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
          description="Add a payment method to complete your purchases faster."
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
            <div
              key={pm._id}
              className="surface-glass-strong rounded-xl border border-black/10 dark:border-white/15 p-5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:shadow-[0_0_0_1px_rgba(212,175,55,0.15),0_8px_32px_-8px_rgba(212,175,55,0.25)] hover:-translate-y-0.5"
            >
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
                      {typeLabels[pm.type]}
                    </p>
                    <p className="text-xs text-black/70 dark:text-white/70 font-mono">
                      {maskDetails(pm)}
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
                          onClick={() => onSetDefaultPaymentMethod(pm._id)}
                          className="w-full px-4 py-2.5 text-left text-sm text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/5 hover:text-ink dark:hover:text-white flex items-center gap-2 transition-all duration-[400ms]"
                        >
                          <Star className="w-4 h-4" />
                          <span>Set as Default</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm("Remove this payment method?")) {
                            onDeletePaymentMethod(pm._id);
                          }
                        }}
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
          ))}
        </div>
      )}

      {/* Add Payment Method Modal */}
      <Modal
        isOpen={showModal}
        onClose={resetForm}
        title="Add Payment Method"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Payment Type Dropdown */}
          <Dropdown
            label="Payment Type"
            options={typeOptions}
            value={type}
            onChange={(value) => setType(value as PaymentMethodType)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                Provider
              </label>
              <input
                type="text"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                placeholder="e.g. MTN, Visa, GCB"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                Label
              </label>
              <input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Personal, Business"
                required
                className={inputClass}
              />
            </div>
          </div>

          {/* Conditional fields based on type */}
          {type === "MOBILE_MONEY" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                  Network
                </label>
                <input
                  type="text"
                  value={momoNetwork}
                  onChange={(e) => setMomoNetwork(e.target.value)}
                  placeholder="MTN MoMo, Telecel Cash, AT Money"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="+233 24 000 0000"
                  required
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {type === "CARD" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                  Card Brand
                </label>
                <input
                  type="text"
                  value={cardBrand}
                  onChange={(e) => setCardBrand(e.target.value)}
                  placeholder="Visa, Mastercard, Amex"
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                  Last 4 Digits
                </label>
                <input
                  type="text"
                  value={cardLast4}
                  onChange={(e) => setCardLast4(e.target.value)}
                  placeholder="1234"
                  maxLength={4}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          )}

          {type === "BANK" && (
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. GCB Bank, Ecobank"
                  required
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="1234567890"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                    Account Name
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="John Doe"
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="hairline-black my-4" />

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              className="flex-1 min-h-[48px] rounded-lg px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_32px_-8px_rgba(212,175,55,0.35)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Add Payment Method
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="min-h-[48px] rounded-lg px-5 text-xs uppercase tracking-wider font-bold text-black/70 dark:text-white/70 surface-glass-strong border border-black/15 dark:border-white/20 hover:border-black/25 dark:hover:border-white/30 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
