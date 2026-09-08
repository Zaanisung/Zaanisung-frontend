import React, { useState } from "react";
import type { PaymentMethod, PaymentMethodType } from "../../types/user";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { PaymentMethodLogo } from "../../components/PaymentMethodLogo";
import {
  Plus,
  Trash2,
  Star,
  X,
  CreditCard,
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
  const [showForm, setShowForm] = useState(false);
  const [loading] = useState(false);

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
    setShowForm(false);
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
    "w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-gold transition-colors";

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
        {!showForm && (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="min-h-[44px] px-4 py-2 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Method</span>
          </button>
        )}
      </div>

      {showForm && (
        <div className="border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
              New Payment Method
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as PaymentMethodType)}
                  className={inputClass}
                >
                  <option value="MOBILE_MONEY">Mobile Money</option>
                  <option value="CARD">Card</option>
                  <option value="BANK">Bank Transfer</option>
                  <option value="CASH">Cash on Delivery</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                  Provider
                </label>
                <input
                  type="text"
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  placeholder="e.g. MTN, Visa"
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
                  placeholder="e.g. Personal"
                  required
                  className={inputClass}
                />
              </div>
            </div>

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
                    placeholder="e.g. MTN, Vodafone, AirtelTigo"
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
                    placeholder="e.g. Visa, Mastercard"
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
                    maxLength={4}
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            {type === "BANK" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
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
                    required
                    className={inputClass}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 disabled:opacity-50 transition-colors flex items-center gap-2"
              >
                {loading && <Loader variant="dots" size="sm" />}
                <span>Add Method</span>
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-black/60 dark:text-white/60 border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {paymentMethods.length === 0 && !showForm ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <EmptyState
            icon={<CreditCard className="w-6 h-6 stroke-[1.5]" />}
            title="No payment methods saved"
            message="Add a payment method to speed up checkout."
            action={
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="w-full min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Payment Method</span>
              </button>
            }
          />
        </div>
      ) : (
        <div className="space-y-3">
          {paymentMethods.map((pm) => (
            <div
              key={pm._id}
              className={`border bg-white/60 dark:bg-white/[0.03] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                pm.isDefault
                  ? "border-gold/50 bg-gold/5"
                  : "border-black/10 dark:border-white/15"
              }`}
            >
              <div className="flex items-center gap-4">
                <PaymentMethodLogo
                  className="w-10 h-7 flex-shrink-0 overflow-hidden rounded"
                  provider={pm.provider}
                  type={pm.type}
                  details={pm.details}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-black dark:text-white">
                      {pm.label}
                    </span>
                    {pm.isDefault && (
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-bold bg-gold/15 text-gold border border-gold/40 flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-gold" />
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
                    <span className="text-[10px] uppercase tracking-wider font-bold text-black/40 dark:text-white/40 mr-2">
                      {typeLabels[pm.type]}
                    </span>
                    {maskDetails(pm)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                {!pm.isDefault && (
                  <button
                    type="button"
                    onClick={() => onSetDefaultPaymentMethod(pm._id)}
                    className="min-h-[36px] px-3 text-[10px] uppercase tracking-wider font-bold text-gold border border-gold/40 hover:bg-gold/10 transition-colors flex items-center gap-1"
                  >
                    <Star className="w-3 h-3" />
                    Make default
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onDeletePaymentMethod(pm._id)}
                  className="min-h-[36px] px-3 text-[10px] uppercase tracking-wider font-bold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
