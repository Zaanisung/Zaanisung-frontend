import React, { useEffect, useState } from "react";
import { OrderItem, Product } from "../types";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { PaymentMethodLogo } from "../components/PaymentMethodLogo";
import { ProductImage } from "../components/ui/ProductImage";
import { GHANA_PHONE_REGEX, STORAGE_KEYS } from "../constants";
import type { PlaceOrderData } from "../router/types";
import * as api from "../services";
import { getErrorMessage } from "../services";
import { ArrowLeft, CheckCircle2, ShieldCheck, Smartphone, Banknote, CreditCard, Landmark, ExternalLink, RotateCw, Info } from "lucide-react";

export interface CheckoutProps {
  items: OrderItem[];
  defaultName?: string;
  defaultPhone?: string;
  defaultCity?: string;
  /** Signed-in buyer's saved delivery address used to prefill the form. */
  savedAddress?: {
    recipientName?: string;
    phone?: string;
    streetAddress?: string;
    city?: string;
    digitalAddress?: string;
  };
  products?: Product[];
  onBackToCart: () => void;
  onPlaceOrder: (orderData: PlaceOrderData) => Promise<void>;
}

export const Checkout: React.FC<CheckoutProps> = ({
  items,
  defaultName = "",
  defaultPhone = "",
  defaultCity = "",
  savedAddress,
  products = [],
  onBackToCart,
  onPlaceOrder,
}) => {
  const [name, setName] = useState(savedAddress?.recipientName || defaultName);
  const [phone, setPhone] = useState(savedAddress?.phone || defaultPhone);
  const [address, setAddress] = useState(savedAddress?.streetAddress || "");
  const [city, setCity] = useState(savedAddress?.city || defaultCity);
  const [digitalAddress, setDigitalAddress] = useState(savedAddress?.digitalAddress || "");
  const [paymentMethod, setPaymentMethod] = useState<"Mobile Money" | "Cash on Delivery" | "Bank / Transfer" | "Paystack (Card)">("Mobile Money");
  const [momoNumber, setMomoNumber] = useState(defaultPhone);
  const [momoNetwork, setMomoNetwork] = useState("MTN");
  const [paystackEmail, setPaystackEmail] = useState("");
  const [pendingPayment, setPendingPayment] = useState<{
    reference: string;
    authorizationUrl: string;
    dummy: boolean;
  } | null>(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEYS.PENDING_PAYMENT);
      return raw ? (JSON.parse(raw) as { reference: string; authorizationUrl: string; dummy: boolean }) : null;
    } catch {
      return null;
    }
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Survives a refresh with the same payment reference, so "Re-Open Pay"
  // cannot initialize a second (duplicate) transaction for the same order.
  useEffect(() => {
    if (pendingPayment) {
      sessionStorage.setItem(STORAGE_KEYS.PENDING_PAYMENT, JSON.stringify(pendingPayment));
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.PENDING_PAYMENT);
    }
  }, [pendingPayment]);

  // Use the live catalog price wherever known so the charged amount matches the
  // server-recomputed total (guards against stale captured cart prices, F-16).
  const total = items.reduce(
    (sum, item) =>
      sum +
      (products.find((p) => p.id === item.productId || p.name === item.name)?.price ?? item.price) *
        item.quantity,
    0
  );

  const buildOrderData = (paymentReference?: string): PlaceOrderData => ({
    items,
    total,
    customerName: name.trim(),
    customerPhone: phone.trim(),
    deliveryAddress: address.trim(),
    deliveryCity: city.trim(),
    digitalAddress: digitalAddress.trim() ? digitalAddress.trim().toUpperCase() : undefined,
    paymentMethod:
      paymentMethod === "Mobile Money" ? `${paymentMethod} (${momoNetwork})` : paymentMethod,
    paymentReference,
    ...(paymentMethod === "Mobile Money" ? { momoNumber: momoNumber.trim(), momoNetwork } : {}),
    ...(paymentMethod === "Paystack (Card)" ? { billingEmail: paystackEmail.trim() } : {}),
  });

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
    if (!city.trim()) {
      setError("Please provide your delivery city or town.");
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
    if (paymentMethod === "Paystack (Card)" && !paystackEmail.trim()) {
      setError("Please provide your card billing email address.");
      return;
    }
    if (items.length === 0) {
      setError("Your bag is empty. Please add a fragrance before checking out.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Paystack requires two steps: initialize → pay → verify → place order.
      if (paymentMethod === "Paystack (Card)") {
        const init = await api.initializePayment({
          amount: total,
          currency: "GHS",
          meta: {
            customerPhone: phone.trim(),
            customerName: name.trim(),
            ...(paystackEmail.trim() ? { billingEmail: paystackEmail.trim() } : {}),
          },
        });
        const payment = {
          reference: init.reference,
          authorizationUrl: init.authorization_url,
          dummy: !!init.dummy,
        };
        setPendingPayment(payment);

        if (payment.dummy) {
          // Paystack sandbox (test) mode: verification succeeds instantly.
          await api.verifyPayment(payment.reference);
          await onPlaceOrder(buildOrderData(payment.reference));
          setPendingPayment(null);
          return;
        }

        // Live mode: open the hosted Paystack checkout, then the customer
        // clicks "I've paid — verify" to confirm before the order is placed.
        window.open(payment.authorizationUrl, "_blank", "noopener,noreferrer");
        return;
      }

      await onPlaceOrder(buildOrderData());
    } catch (err) {
      setError(getErrorMessage(err, "An unexpected error occurred. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyPaystack = async () => {
    if (!pendingPayment) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await api.verifyPayment(pendingPayment.reference);
      if (result.status !== "SUCCESS") {
        setError("Your payment has not been confirmed yet. Please try again shortly.");
        return;
      }
      await onPlaceOrder(buildOrderData(pendingPayment.reference));
      setPendingPayment(null);
    } catch (err) {
      setError(getErrorMessage(err, "Could not verify your payment. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPaystack = () => {
    setPendingPayment(null);
    setError(null);
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

      <div className="relative overflow-hidden surface-glass-strong rounded-2xl p-5 sm:p-8 shadow-lift">

        <div className="relative pb-2 mb-6">
          <h2
            className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif"
          >
            Express Checkout
          </h2>
          <p className="text-[11px] uppercase tracking-widest text-gold font-semibold mt-1">
            Zaanisung Fast Direct Order
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
            <div className="space-y-3 text-sm">
              {items.map((i, idx) => {
                const product = products.find(
                  (p) => p.id === i.productId || p.name === i.name
                );
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-11 h-14 flex-shrink-0 overflow-hidden rounded-lg border border-black/10 dark:border-white/15">
                        <ProductImage
                          src={product?.imageUrl || i.imageUrl}
                          alt={i.name}
                          className="w-full h-full"
                        />
                      </div>
                      <span className="text-black/70 dark:text-white/80 truncate">
                        {i.quantity}&times; {i.name}
                      </span>
                    </div>
                    <span className="font-semibold text-black dark:text-white font-mono flex-shrink-0">
                      {(i.price * i.quantity).toFixed(2)} GHS
                    </span>
                  </div>
                );
              })}
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
              label="City / Town"
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Tamale, Kumasi, Accra"
              helperText="Your order is routed to the correct delivery hub based on this"
              required
            />

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(
                [
                  {
                    id: "Mobile Money",
                    label: "Mobile Money",
                    desc: "MTN MoMo, Telecel, AT",
                    icon: Smartphone,
                  },
                  {
                    id: "Cash on Delivery",
                    label: "Cash on Delivery",
                    desc: "Pay on receipt",
                    icon: Banknote,
                  },
                  {
                    id: "Paystack (Card)",
                    label: "Paystack (Card)",
                    desc: "Visa, Mastercard, Verve",
                    icon: CreditCard,
                  },
                  {
                    id: "Bank / Transfer",
                    label: "Bank / Transfer",
                    desc: "Counter or online transfer",
                    icon: Landmark,
                  },
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

            {/* Payment instructions so the buyer knows what happens next */}
            {paymentMethod !== "Paystack (Card)" && (
              <div className="flex gap-2.5 p-3.5 rounded-xl surface-glass-tint text-[12px] text-black/60 dark:text-white/70">
                <Info className="w-4 h-4 shrink-0 mt-0.5 text-gold" />
                <span>
                  {paymentMethod === "Mobile Money" &&
                    "After you place your order, our team will text this number to arrange payment. Keep your phone reachable."}
                  {paymentMethod === "Cash on Delivery" &&
                    "Pay the delivery courier in cash when your order arrives. Exact change is appreciated."}
                  {paymentMethod === "Bank / Transfer" &&
                    "We'll text or email you our bank details within 24 hours. Your order is confirmed once the payment reflects."}
                </span>
              </div>
            )}

            {paymentMethod === "Mobile Money" && (
              <div className="p-4 surface-glass-tint mt-3 space-y-3">
                <label className="text-[11px] uppercase tracking-widest text-gold font-bold block">
                  Select Mobile Money Network
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { value: "MTN", label: "MTN MoMo" },
                    { value: "Telecel", label: "Telecel Cash" },
                    { value: "AT", label: "AT Money" },
                  ] as const).map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setMomoNetwork(value)}
                      className={`min-h-[52px] py-2 px-2 text-[11px] uppercase tracking-wider font-bold border rounded-xl transition-all flex flex-col items-center justify-center gap-1.5 ${
                        momoNetwork === value
                          ? "border-gold bg-gold/5 shadow-xs"
                          : "border-black/10 dark:border-white/15 bg-white dark:bg-white/5 text-black/70 dark:text-white/80"
                      }`}
                    >
                      <PaymentMethodLogo
                        className="w-10 h-6 object-contain"
                        provider={label}
                      />
                      <span className={momoNetwork === value ? "text-black dark:text-white" : ""}>
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
                <Input
                  label={`${momoNetwork || "MoMo"} Account Number`}
                  type="tel"
                  value={momoNumber}
                  onChange={(e) => setMomoNumber(e.target.value)}
                  placeholder="+233 24 000 0000"
                />
              </div>
            )}

            {paymentMethod === "Paystack (Card)" && (
              <div className="p-4 surface-glass-tint mt-3 space-y-3">
                <label className="text-[11px] uppercase tracking-widest text-gold font-bold block">
                  Pay with Debit / Credit Card
                </label>
                <Input
                  label="Billing Email"
                  type="email"
                  value={paystackEmail}
                  onChange={(e) => setPaystackEmail(e.target.value)}
                  placeholder="you@mail.com"
                  helperText="Receipts and payment confirmation go to this address"
                  autoComplete="email"
                />

                {pendingPayment?.dummy ? (
                  <div className="rounded-xl p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300">
                    Test payment successful. Placing your order…
                  </div>
                ) : pendingPayment ? (
                  <div className="space-y-3">
                    <div className="rounded-xl p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
                      A secure Paystack checkout opened in a new tab. Complete the
                      payment there, then confirm here.
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="md"
                        isLoading={isSubmitting}
                        onClick={handleVerifyPaystack}
                        className="flex-1"
                      >
                        <CheckCircle2 className="w-4 h-4 mr-1.5" /> I've Paid — Verify
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="md"
                        onClick={() => window.open(pendingPayment.authorizationUrl, "_blank", "noopener,noreferrer")}
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4 mr-1.5" /> Re-Open Pay
                      </Button>
                    </div>
                    <button
                      type="button"
                      onClick={resetPaystack}
                      className="text-[11px] uppercase tracking-widest text-black/45 dark:text-white/45 hover:text-ink dark:hover:text-white font-semibold inline-flex items-center gap-1 min-h-[44px] transition-colors"
                    >
                      <RotateCw className="w-3 h-3" /> Start Over
                    </button>
                  </div>
                ) : (
                  <p className="text-[11px] text-black/50 dark:text-white/50">
                    You'll be redirected to Paystack's secure hosted checkout after
                    pressing Confirm & Place Order.
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Place Order Primary Action */}
          <div className="pt-5">
            {pendingPayment && !pendingPayment.dummy ? null : (
              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isSubmitting}
                className="w-full font-bold shadow-xs"
              >
                Confirm & Place Order — {total.toFixed(2)} GHS
              </Button>
            )}
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
