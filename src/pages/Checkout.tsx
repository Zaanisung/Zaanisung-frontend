import React, { useState } from "react";
import { OrderItem } from "../types";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
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
    paymentMethod: string;
  }) => void;
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
  const [paymentMethod, setPaymentMethod] = useState<"Mobile Money" | "Cash on Delivery" | "Other">("Mobile Money");
  const [momoNumber, setMomoNumber] = useState(defaultPhone);
  const [momoNetwork, setMomoNetwork] = useState("MTN MoMo");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please provide your delivery recipient name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please provide a contact phone number for delivery.");
      return;
    }
    if (!address.trim()) {
      setError("Please provide your delivery address (House/Street/Location).");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      setIsSubmitting(false);
      onPlaceOrder({
        items,
        total,
        customerName: name.trim(),
        customerPhone: phone.trim(),
        deliveryAddress: address.trim(),
        paymentMethod: paymentMethod === "Mobile Money" ? `${paymentMethod} (${momoNetwork})` : paymentMethod,
      });
    }, 600);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <button
        type="button"
        onClick={onBackToCart}
        className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Bag
      </button>

      <div className="bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] p-5 sm:p-8 shadow-xs">
        <div className="border-b border-gray-200 dark:border-[#22222A] pb-4 mb-6">
          <h2
            className="text-2xl sm:text-3xl font-light text-gray-900 dark:text-gray-100"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Express Checkout
          </h2>
          <p className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold mt-1">
            Zaanisung Ent. GH Fast Direct Order
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary Overview */}
          <div className="bg-gray-50 dark:bg-[#181820] p-4 border border-gray-200 dark:border-[#262632]">
            <h3 className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold mb-3">
              Order Summary ({items.length} {items.length === 1 ? "Fragrance" : "Fragrances"})
            </h3>
            <div className="space-y-2 text-sm">
              {items.map((i, idx) => (
                <div key={idx} className="flex justify-between text-xs sm:text-sm">
                  <span className="text-gray-700 dark:text-gray-300">
                    {i.quantity}x {i.name}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100 font-mono">
                    {(i.price * i.quantity).toFixed(2)} GHS
                  </span>
                </div>
              ))}
              <div className="pt-3 border-t border-gray-200 dark:border-[#2C2C38] flex justify-between font-bold text-sm sm:text-base">
                <span className="uppercase tracking-wider text-gray-900 dark:text-gray-100">Total Due</span>
                <span className="text-[#D4AF37] font-mono">{total.toFixed(2)} GHS</span>
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase tracking-widest text-gray-900 dark:text-gray-100 font-bold flex items-center gap-1.5">
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
              <label className="text-[11px] font-semibold uppercase tracking-widest text-[#52525B] dark:text-[#A1A1AA]">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="House Number, Street Name, Landmark, Area (e.g. Ring Road Central, Accra)"
                className="w-full p-3 text-sm bg-white dark:bg-[#141416] text-[#18181B] dark:text-[#F4F4F5] placeholder-gray-400 border border-gray-200 dark:border-[#2C2C32] focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                required
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-gray-900 dark:text-gray-100 font-bold">
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
                    className={`p-3.5 text-left border min-h-[48px] transition-all ${
                      isSelected
                        ? "border-[#D4AF37] bg-[#D4AF37]/10 text-gray-900 dark:text-gray-100 font-semibold"
                        : "border-gray-200 dark:border-[#282832] text-gray-700 dark:text-gray-300 bg-white dark:bg-[#16161C] hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-1.5">
                        <Icon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span className="text-xs uppercase tracking-wider font-bold">
                          {pm.label}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                      )}
                    </div>
                    <span className="text-[11px] text-gray-500 dark:text-gray-400 block">
                      {pm.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {paymentMethod === "Mobile Money" && (
              <div className="p-4 bg-gray-50 dark:bg-[#181820] border border-gray-200 dark:border-[#2C2C38] mt-3 space-y-3">
                <label className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-bold block">
                  Select Mobile Money Network
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["MTN MoMo", "Telecel Cash", "AT Money"].map((net) => (
                    <button
                      key={net}
                      type="button"
                      onClick={() => setMomoNetwork(net)}
                      className={`min-h-[44px] py-2 px-2 text-[11px] uppercase tracking-wider font-bold border transition-all ${
                        momoNetwork === net
                          ? "border-[#D4AF37] bg-[#D4AF37] text-black shadow-xs"
                          : "border-gray-200 dark:border-[#323240] bg-white dark:bg-[#15151A] text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {net}
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
          <div className="pt-4 border-t border-gray-200 dark:border-[#22222A]">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isSubmitting}
              className="w-full font-bold shadow-xs"
            >
              Confirm & Place Order — {total.toFixed(2)} GHS
            </Button>
            <div className="flex items-center justify-center space-x-1.5 text-gray-400 text-[11px] mt-3 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Safe & Secure Ghanaian Checkout</span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
