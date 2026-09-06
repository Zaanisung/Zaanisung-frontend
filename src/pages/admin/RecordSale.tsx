import React, { useState } from "react";
import type { Product } from "../../types";
import { Button } from "../../components/Button";
import { ArrowLeft, TrendingUp, Check } from "lucide-react";

export interface RecordSaleProps {
  products: Product[];
  initialProductId?: string;
  onBack: () => void;
  onConfirmSale: (data: {
    productId: string;
    productName: string;
    price: number;
    quantity: number;
    paymentMethod: string;
  }) => void;
}

export const RecordSale: React.FC<RecordSaleProps> = ({
  products,
  initialProductId,
  onBack,
  onConfirmSale,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || products[0]?.id || ""
  );
  const [quantity, setQuantity] = useState("1");
  const [paymentMethod, setPaymentMethod] = useState<"Cash on Delivery" | "Mobile Money" | "Other">("Cash on Delivery");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const numQuantity = parseInt(quantity, 10) || 0;
  const maxStock = selectedProduct ? selectedProduct.stock : 0;
  const totalAmount = (selectedProduct?.price || 0) * numQuantity;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError("Please select a perfume.");
      return;
    }
    if (numQuantity <= 0) {
      setError("Please enter a valid quantity of 1 or more.");
      return;
    }
    if (numQuantity > maxStock) {
      setError(`Cannot sell ${numQuantity} units. Only ${maxStock} in stock.`);
      return;
    }

    onConfirmSale({
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      price: selectedProduct.price,
      quantity: numQuantity,
      paymentMethod,
    });

    setIsSuccess(true);
    setTimeout(() => {
      onBack();
    }, 900);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="relative overflow-hidden surface-glass-strong p-6 sm:p-8 shadow-lift">
        <div className="absolute top-0 left-0 right-0 hairline-gold"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 orb orb-gold-faint" aria-hidden="true"></div>

        <div className="relative pb-2 mb-6">
          <div className="flex items-center space-x-2 text-gold mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Physical Walk-In Sale
            </span>
          </div>
          <h2
            className="text-xl sm:text-2xl font-light text-black dark:text-white font-brand-serif"
          >
            Record In-Store Sale
          </h2>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            Instantly log physical retail sale & deduct from stock
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-xs text-red-300 font-medium mb-6">
            {error}
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-gold/10 border border-gold text-gold flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-semibold text-black dark:text-white">
              Sale Recorded Successfully
            </h3>
            <p className="text-xs text-black/45 dark:text-white/45">
              Stock automatically updated. Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pick Product */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-black/45 dark:text-white/45 block">
                Select Fragrance
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 text-black dark:text-white focus:outline-none focus:border-gold"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.stock <= 0}>
                    {p.name} — {p.price.toFixed(2)} GHS ({p.stock} in stock)
                    {p.stock <= 0 ? " [OUT OF STOCK]" : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Product summary pill */}
            {selectedProduct && (
              <div className="p-3 surface-glass-tint flex items-center justify-between text-xs">
                <span className="text-black/45 dark:text-white/45">Available Shelf Stock:</span>
                <span className="font-mono font-bold text-black dark:text-white">
                  {selectedProduct.stock} bottles
                </span>
              </div>
            )}

            {/* Enter Quantity */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-black/45 dark:text-white/45 block">
                Quantity Sold
              </label>
              <input
                type="number"
                min="1"
                max={maxStock || 1}
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-base font-mono font-bold bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 text-black dark:text-white focus:outline-none focus:border-gold"
                placeholder="1"
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-black/45 dark:text-white/45 block">
                Payment Collected
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["Cash on Delivery", "Mobile Money", "Other"] as const).map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`min-h-[44px] px-2 text-[10px] uppercase tracking-wider font-semibold border transition-colors ${
                      paymentMethod === method
                        ? "border-gold bg-gold/15 text-black dark:text-white"
                        : "border-black/10 dark:border-white/15 text-black/45 dark:text-white/45 bg-white dark:bg-white/5 hover:text-black dark:hover:text-white"
                    }`}
                  >
                    {method === "Cash on Delivery" ? "Cash" : method}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Due */}
            <div className="pt-5 flex items-center justify-between text-sm">
              <span className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45">
                Total Collected
              </span>
              <span className="text-xl font-mono font-bold text-gold">
                {totalAmount.toFixed(2)} GHS
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex space-x-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={maxStock <= 0}
                className="flex-1 font-bold"
              >
                Confirm Sale & Deduct Stock
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={onBack}
                className="border-black/10 dark:border-white/15 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
