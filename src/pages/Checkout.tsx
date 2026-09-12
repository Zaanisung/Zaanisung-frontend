import React, { useState } from "react";
import { OrderItem } from "../types";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { PaymentMethodLogo } from "../components/PaymentMethodLogo";
import { GHANA_PHONE_REGEX } from "../constants";
import { ArrowLeft, CheckCircle2, ShieldCheck, Smartphone, Banknote, CreditCard } from "lucide-react";

export interface CheckoutProps {
  items: OrderItem[];
  defaultName?: string;
  defaultPhone?: string;
  onBackToCart: () => void;
  onPlaceOrder: (orderData: {
    items: OrderItem[];
    total: number;
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
    digitalAddress?: string;
    paymentMethod: string;
  }) => Promise<void>;
}

export const Checkout: React.FC<CheckoutProps> = ({
  items,
  defaultName = "",
  defaultPhone = "",
  onBackToCart,
  onPlaceOrder,
}) => {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [address, setAddress] = useState("");
  const [digitalAddress, setDigitalAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"Mobile Money" | "Cash on Delivery" | "Other">("Mobile Money");
  const [momoNumber, setMomoNumber] = useState(defaultPhone);
  const [momoNetwork, setMomoNetwork] = useState("MTN MoMo");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide your delivery recipient name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please provide a contact phone number for delivery.");
      return;
    }
    if (!GHANA_PHONE_REGEX.test(phone.trim().replace(/[\s-]/g, ""))) {
      setError("Please enter a valid Ghanaian phone number, e.g. +233 24 551 2890.");
      return;
    }
    if (!address.trim()) {
      setError("Please provide your delivery address (House/Street/Location).");
      return;
    }
    if (digitalAddress.trim() && !/^[A-Za-z]{2}-\d{4}-\d{4}$/.test(digitalAddress.trim())) {
      setError("Please enter a valid Ghana digital address, e.g. NT-0000-0000.");
      return;
    }
    if (paymentMethod === "Mobile Money" && !momoNumber.trim()) {
      setError(`Please provide your ${momoNetwork} account number.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onPlaceOrder({
        items,
        total,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: address.trim(),
        digitalAddress: digitalAddress.trim() ? digitalAddress.trim().toUpperCase() : undefined,
        paymentMethod: paymentMethod === "Mobile Money" ? `${paymentMethod} (${momoNetwork})` : paymentMethod,
      });
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <button
        type="button"
        onClick={onBackToCart}
        className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-black dark:text-white/60 dark:hover:text-white font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Bag
      </button>

      <div className="relative overflow-hidden surface-glass-strong rounded-2xl kente-frame p-5 sm:p-8 shadow-lift">
        <div className="absolute -top-28 -right-28 w-72 h-72 orb orb-gold-faint" aria-hidden="true"></div>

        <div className="relative pb-2 mb-6">
          <h2
            className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif"
          >
            Express Checkout
          </h2>
          <p className="text-[11px] uppercase tracking-widest text-gold font-semibold mt-1">
            Zaanisung Ent. GH Fast Direct Order
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary Overview */}
          <div className="relative overflow-hidden surface-glass-tint p-4">
            <h3 className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 font-bold mb-3">
              Order Summary ({items.length} {items.length === 1 ? "Fragrance" : "Fragrances"})
            </h3>
            <div className="space-y-2 text-sm">
              {items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-black/70 dark:text-white/80">
                    {i.quantity}x {i.name}
                  </span>
                  <span className="font-semibold text-black dark:text-white font-mono">
                    {(i.price * i.quantity).toFixed(2)} GHS
                  </span>
                </div>
              ))}
              <div className="pt-3 flex justify-between font-bold text-sm sm:text-base">
                <span className="uppercase tracking-wider text-black dark:text-white">Total Due</span>
                <span className="text-gold font-mono">{total.toFixed(2)} GHS</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-gold inline-block"></span>
              <span>Delivery Details</span>
            </h3>

            <Input
              label="Recipient Name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Kwame Mensah"
              required
            />

            <Input
              label="Contact Phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+233 24 551 2890"
              helperText="Delivery courier will contact this number upon dispatch"
              required
            />

            <div className="w-full flex flex-col gap-1 text-left">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-black/60 dark:text-white/60">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="House Number, Street Name, Landmark, Area (e.g. Ring Road Central, Accra)"
                className="w-full p-3 text-sm bg-white dark:bg-white/5 text-black dark:text-white placeholder-black/40 border border-black/10 dark:border-white/15 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                required
              />
            </div>

            <Input
              label="Ghana Digital Address (optional)"
              type="text"
              value={digitalAddress}
              onChange={(e) => setDigitalAddress(e.target.value)}
              placeholder="e.g. NT-0000-0000 (Ghana Post)"
              helperText="Ghana Post digital address for precise courier routing"
            />
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-gold inline-block"></span>
              Payment Method
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(
                [
                  { id: "Mobile Money", label: "Mobile Money", desc: "MTN MoMo, Telecel, AT", icon: Smartphone },
                  { id: "Cash on Delivery", label: "Cash on Delivery", desc: "Pay on receipt", icon: Banknote },
                  { id: "Other", label: "Bank / Transfer", desc: "Counter or online transfer", icon: CreditCard },
                ] as const
              ).map((pm) => {
                const isSelected = paymentMethod === pm.id;
                const Icon = pm.icon;
                return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`p-3.5 text-left border min-h-[48px] rounded-xl transition-all ${
                      isSelected
                        ? "border-gold bg-gold/10 text-black font-semibold"
                        : "border-black/10 dark:border-white/15 text-black/70 bg-white dark:bg-white/5 hover:border-black/30"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <Icon className="w-3.5 h-3.5 text-gold" />
                        <span className="text-xs uppercase tracking-wider font-bold">
                          {pm.label}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-gold" />
                      )}
                    </div>
                    <span className="text-[11px] text-black/50 dark:text-white/50 block">
                      {pm.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "Mobile Money" && (
              <div className="p-4 surface-glass-tint mt-3 space-y-3">
                <label className="text-[11px] uppercase tracking-widest text-gold font-bold block">
                  Select Mobile Money Network
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["MTN MoMo", "Telecel Cash", "AT Money"].map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setMomoNetwork(net)}
                      className={`min-h-[52px] py-2 px-2 text-[11px] uppercase tracking-wider font-bold border rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 ${
                        momoNetwork === net
                          ? "border-gold bg-gold/5 shadow-xs"
                          : "border-black/10 dark:border-white/15 bg-white dark:bg-white/5 text-black/70 dark:text-white/80"
                      }`}
                    >
                      <PaymentMethodLogo
                        className="w-10 h-6 object-contain"
                        provider={net}
                      />
                      <span className={momoNetwork === net ? "text-black dark:text-white" : ""}>
                        {net}
                      </span>
                    </button>
                  ))}
                </div>
                <Input
                  label={`${momoNetwork} Account Number`}
                  type="tel"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="+233 24 000 0000"
                />
              </div>
            )}
          </div>

          {/* Place Order Primary Action */}
          <div className="pt-5">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold shadow-xs"
            >
              Confirm & Place Order — {total.toFixed(2)} GHS
            </Button>
            <div className="flex items-center justify-center space-x-1.5 text-black/45 dark:text-white/45 text-[11px] mt-3 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-gold" />
              <span>Safe & Secure Ghanaian Checkout</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
