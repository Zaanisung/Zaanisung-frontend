import React, { useEffect, useState } from "react";
import type { PaymentMethod, PaymentMethodType } from "../../../types/user";
import { Modal } from "../../../components/ui/Modal";
import { Dropdown } from "../../../components/ui/Dropdown";
import { GHANA_PHONE_REGEX } from "../../../constants";
import {
  Smartphone,
  CreditCard,
  Building2,
  Banknote,
} from "lucide-react";

interface AddPaymentMethodModalProps {
  open: boolean;
  /** When the user has no saved methods yet, the first one is made default. */
  isFirstMethod?: boolean;
  onClose: () => void;
  onAdd: (
    data: Omit<PaymentMethod, "_id" | "isDefault"> & { isDefault?: boolean }
  ) => void;
}

const inputClass =
  "w-full min-h-[44px] px-4 py-2.5 rounded-lg text-sm surface-glass-strong border border-black/15 dark:border-white/20 text-ink dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";

const typeOptions: { value: PaymentMethodType; label: string; icon: React.ReactNode }[] = [
  { value: "MOBILE_MONEY", label: "Mobile Money", icon: <Smartphone className="w-4 h-4" /> },
  { value: "CARD", label: "Card", icon: <CreditCard className="w-4 h-4" /> },
  { value: "BANK", label: "Bank Transfer", icon: <Building2 className="w-4 h-4" /> },
  { value: "CASH", label: "Cash on Delivery", icon: <Banknote className="w-4 h-4" /> },
];

/** Modal form for adding a new payment method. */
export const AddPaymentMethodModal: React.FC<AddPaymentMethodModalProps> = ({
  open,
  isFirstMethod = false,
  onClose,
  onAdd,
}) => {
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
  const [error, setError] = useState<string | null>(null);

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
    setError(null);
  };

  useEffect(() => {
    if (open) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      resetForm();
    }
  }, [open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (type === "MOBILE_MONEY" && !GHANA_PHONE_REGEX.test(momoNumber.trim().replace(/[\s-]/g, ""))) {
      setError("Please enter a valid Ghanaian Mobile Money number, e.g. +233 24 000 0000.");
      return;
    }
    if (type === "CARD" && !/^\d{4}$/.test(cardLast4.trim())) {
      setError("Please enter the last 4 digits of your card.");
      return;
    }
    if (type === "BANK" && accountNumber.trim().length < 4) {
      setError("Please enter a valid bank account number.");
      return;
    }

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

    onAdd({ type, provider, label, details, isDefault: isFirstMethod });
    onClose();
  };

  return (
    <Modal isOpen={open} onClose={onClose} title="Add Payment Method" size="lg">
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
        )}

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
                inputMode="numeric"
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
            onClick={onClose}
            className="min-h-[48px] rounded-lg px-5 text-xs uppercase tracking-wider font-bold text-black/70 dark:text-white/70 surface-glass-strong border border-black/15 dark:border-white/20 hover:border-black/25 dark:hover:border-white/30 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] active:scale-[0.98]"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
};