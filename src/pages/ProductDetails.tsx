import React, { useState } from "react";
import { Product } from "../types";
import { Button } from "../components/Button";
import { ArrowLeft, Plus, Minus, Check, Sparkles, Droplet, ShieldCheck, Truck } from "lucide-react";

export interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onBuyNow: (product: Product, quantity: number) => void;
}

export const ProductDetails: React.FC<ProductDetailsProps> = ({
  product,
  onBack,
  onAddToCart,
  onBuyNow,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const maxAvailable = Math.max(0, product.stock);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    onAddToCart(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;
    onBuyNow(product, quantity);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Back button with 44px tap target */}
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Fragrances
      </button>

      <div className="bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#23232C] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
        {/* Large Prominent Perfume Image Frame */}
        <div className="relative aspect-[3/4] sm:aspect-[4/5] md:aspect-auto min-h-[340px] sm:min-h-[420px] md:min-h-[520px] bg-[#F5F4F0] dark:bg-[#1A1A22] flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#23232C]">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center"
          />

          {/* Stock Badge */}
          <div className="absolute top-4 right-4 z-10">
            {isOutOfStock ? (
              <span className="bg-black/90 dark:bg-black text-white text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold backdrop-blur-xs border border-white/20">
                Sold Out
              </span>
            ) : isLowStock ? (
              <span className="bg-amber-600 text-white text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold shadow-md">
                Only {product.stock} Left in Stock
              </span>
            ) : (
              <span className="bg-black/85 dark:bg-black text-white text-[10px] px-3 py-1 uppercase tracking-widest font-medium backdrop-blur-xs border border-white/10">
                In Stock ({product.stock} Available)
              </span>
            )}
          </div>

          {/* Gold brand corner */}
          <div className="absolute bottom-0 right-0 w-10 h-10 overflow-hidden pointer-events-none">
            <div className="w-16 h-16 bg-[#D4AF37] transform rotate-45 translate-x-8 translate-y-8"></div>
          </div>
        </div>

        {/* Product Details & Purchase Actions */}
        <div className="p-5 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
              <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold">
                Zaanisung Master Collection
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 dark:text-gray-100 leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.name}
            </h1>

            {/* Volume and price */}
            <div className="flex items-baseline gap-3 pt-2 border-t border-gray-100 dark:border-[#22222A]">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono text-[#D4AF37]">
                {product.price.toFixed(2)} GHS
              </span>
              <span className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">
                • 100ml Extrait de Parfum
              </span>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed pt-2">
              Distilled in small, artisanal batches with aged agarwood oils, rare florals, and botanical resinous bases. Formulated for long-lasting sillage that endures throughout West African climates.
            </p>

            {/* Fragrance Accords Chips */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 font-bold block mb-2">
                Olfactory Profile
              </span>
              <div className="flex flex-wrap gap-2">
                {["Smoky Oud", "Warm Amber", "French Damascena", "Dry Woods", "Golden Vanilla"].map(
                  (accord) => (
                    <span
                      key={accord}
                      className="px-2.5 py-1 bg-gray-100 dark:bg-[#1C1C24] text-gray-700 dark:text-gray-300 text-[11px] border border-gray-200 dark:border-[#2C2C38]"
                    >
                      {accord}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Luxury Assurance Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 dark:border-[#22222A] text-[11px] text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <Droplet className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>35% Pure Perfume Oil</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Express Ghana Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>100% Authentic Batch</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Ready for Dispatch</span>
              </div>
            </div>
          </div>

          {/* Quantity & Buy Section */}
          <div className="space-y-5 pt-4 border-t border-gray-200 dark:border-[#22222A]">
            {!isOutOfStock && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">
                    Select Quantity (Bottles)
                  </label>
                  <span className="text-xs font-mono font-bold text-[#D4AF37]">
                    Total: {(product.price * quantity).toFixed(2)} GHS
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="inline-flex items-center border border-gray-300 dark:border-[#2E2E3C] bg-white dark:bg-[#181820]">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-12 h-12 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#22222C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-base font-bold text-gray-900 dark:text-gray-100 font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
                      disabled={quantity >= maxAvailable}
                      className="w-12 h-12 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#22222C] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    Max: {maxAvailable} bottles
                  </span>
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            {isOutOfStock ? (
              <div className="p-4 bg-gray-50 dark:bg-[#181820] border border-gray-200 dark:border-[#2E2E3C] text-center">
                <p className="text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400 font-semibold">
                  This fragrance is currently sold out in all Ghana workshops.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="primary"
                  size="lg"
                  onClick={handleBuyNow}
                  className="flex-1 font-bold shadow-xs"
                >
                  Buy Now — {(product.price * quantity).toFixed(2)} GHS
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={handleAddToCart}
                  className="flex-1 font-bold"
                >
                  {isAdded ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-4 h-4 text-emerald-500 stroke-[2.5]" />
                      Added to Bag
                    </span>
                  ) : (
                    "Add to Cart"
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
