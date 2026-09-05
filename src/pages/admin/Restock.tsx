import React, { useState } from "react";
import type { Product } from "../../types";
import { Button } from "../../components/Button";
import { ArrowLeft, RefreshCw, Check } from "lucide-react";

export interface RestockProps {
  products: Product[];
  initialProductId?: string;
  onBack: () => void;
  onConfirmRestock: (productId: string, quantityAdded: number) => void;
}

export const Restock: React.FC<RestockProps> = ({
  products,
  initialProductId,
  onBack,
  onConfirmRestock,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    initialProductId || products[0]?.id || ""
  );
  const [quantityAdded, setQuantityAdded] = useState("10");
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const selectedProduct = products.find((p) => p.id === selectedProductId);
  const numAdded = parseInt(quantityAdded, 10) || 0;
  const currentStock = selectedProduct ? selectedProduct.stock : 0;
  const newProjectedStock = currentStock + numAdded;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) {
      setError("Please select a perfume to restock.");
      return;
    }
    if (numAdded <= 0) {
      setError("Please enter a restock quantity of at least 1.");
      return;
    }

    onConfirmRestock(selectedProduct.id, numAdded);
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

      <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 p-6 sm:p-8">
        <div className="pb-2 mb-6">
          <div className="flex items-center space-x-2 text-[#D4AF37] mb-1">
            <RefreshCw className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">
              Inventory Inflow
            </span>
          </div>
          <h2
            className="text-xl sm:text-2xl font-light text-black dark:text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Restock Inventory
          </h2>
          <p className="text-xs text-black/50 dark:text-white/50 mt-1">
            Replenish perfume bottle counts from new workshop batches
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/50 border border-red-800 text-xs text-red-300 font-medium mb-6">
            {error}
          </div>
        )}

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-[#D4AF37]/10 border border-[#D4AF37] text-[#D4AF37] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 stroke-[3]" />
            </div>
            <h3 className="text-base font-semibold text-black dark:text-white">
              Inventory Replenished
            </h3>
            <p className="text-xs text-black/45 dark:text-white/45">
              New stock count applied to store. Redirecting...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Pick Product */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-black/45 dark:text-white/45 block">
                Select Fragrance to Restock
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-xs sm:text-sm bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 text-black dark:text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — Current: {p.stock} bottles
                  </option>
                ))}
              </select>
            </div>

            {/* Current vs New stock preview */}
            {selectedProduct && (
              <div className="p-3.5 bg-[#F5F5F5] dark:bg-white/10 border border-black/10 dark:border-white/15 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-black/45 dark:text-white/45 uppercase tracking-wider text-[10px] block">
                    Current Stock
                  </span>
                  <span className="font-mono text-base font-bold text-black/40 dark:text-white/40">
                    {currentStock} bottles
                  </span>
                </div>
                <div>
                  <span className="text-[#D4AF37] uppercase tracking-wider text-[10px] block font-bold">
                    Projected New Stock
                  </span>
                  <span className="font-mono text-base font-bold text-[#D4AF37]">
                    {newProjectedStock} bottles
                  </span>
                </div>
              </div>
            )}

            {/* Enter Quantity Added */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-widest text-black/45 dark:text-white/45 block">
                Quantity Added (Bottles)
              </label>
              <input
                type="number"
                min="1"
                value={quantityAdded}
                onChange={(e) => {
                  setQuantityAdded(e.target.value);
                  setError(null);
                }}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-base font-mono font-bold bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 text-black dark:text-white focus:outline-none focus:border-[#D4AF37]"
                placeholder="10"
                required
              />
            </div>

            {/* Fast Quick-add buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50">
                Quick:
              </span>
              {[5, 10, 20, 50].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuantityAdded(count.toString())}
                  className="px-2.5 py-1 text-[11px] font-mono bg-white dark:bg-white/5 hover:bg-[#F5F5F5] dark:hover:bg-white/10 text-black/60 dark:text-white/60 border border-black/10 dark:border-white/15"
                >
                  +{count}
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="pt-5 flex space-x-3">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1 font-bold"
              >
                Confirm Restock (+{numAdded})
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
