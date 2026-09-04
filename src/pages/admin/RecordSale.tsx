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
        className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-gray-400 hover:text-white font-semibold mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </button>

      <div className="bg-[#121216] border border-[#1E1E24] p-6 sm:p-8">
        <div className="border-b border-[#1E1E24] pb-4 mb-6">
          <div className="flex items-center space-x-2 text-amber-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Physical Walk-In Sale
            </span>
          </div>
          <h2
            className="text-xl sm:text-2xl font-light text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Record In-Store Sale
          </h2>
          <p className="text-xs text-gray-500 mt-1">
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
            <div className="w-12 h-12 bg-emerald-950 border border-emerald-700 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-semibold text-white">
              Sale Recorded Successfully
            </h3>
            <p className="text-xs text-gray-400">
              Stock automatically updated. Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pick Product */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 block">
                Select Fragrance
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm bg-[#1A1A22] border border-[#2D2D38] text-white focus:outline-none focus:border-[#D4AF37]"
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
              <div className="p-3 bg-[#181820] border border-[#262632] flex items-center justify-between text-xs">
                <span className="text-gray-400">Available Shelf Stock:</span>
                <span className="font-mono font-bold text-white">
                  {selectedProduct.stock} bottles
                </span>
              </div>
            )}

            {/* Enter Quantity */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 block">
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
                className="w-full min-h-[44px] px-3.5 py-2.5 text-base font-mono font-bold bg-[#1A1A22] border border-[#2D2D38] text-white focus:outline-none focus:border-[#D4AF37]"
                placeholder="1"
                required
              />
            </div>

            {/* Payment Method */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 block">
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
                        ? "border-[#D4AF37] bg-[#D4AF37]/15 text-white"
                        : "border-[#2D2D38] text-gray-400 bg-[#1A1A22] hover:text-white"
                    }`}
                  >
                    {method === "Cash on Delivery" ? "Cash" : method}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Due */}
            <div className="pt-4 border-t border-[#1E1E24] flex items-center justify-between text-sm">
              <span className="text-xs uppercase tracking-widest text-gray-400">
                Total Collected
              </span>
              <span className="text-xl font-mono font-bold text-[#D4AF37]">
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
                className="border-[#2D2D38] text-gray-300 hover:text-white"
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
