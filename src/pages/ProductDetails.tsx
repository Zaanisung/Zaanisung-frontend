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
        className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-black dark:text-white/60 dark:hover:text-white font-semibold transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Fragrances
      </button>

      <div className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2 gap-0 items-stretch">
        {/* Large Prominent Perfume Image Frame */}
        <div className="relative aspect-square bg-white dark:bg-white/5 flex items-center justify-center overflow-hidden border-b md:border-b-0 md:border-r border-black/10 dark:border-white/15">
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
              <span className="bg-[#D4AF37] text-black text-[10px] px-3 py-1.5 uppercase tracking-widest font-bold shadow-md">
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
              className="text-2xl sm:text-3xl lg:text-4xl font-light text-black dark:text-white leading-tight"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {product.name}
            </h1>

            {product.description && (
              <p className="mt-3 text-sm sm:text-base text-black/60 dark:text-white/60 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Volume and price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl lg:text-4xl font-bold font-mono text-[#D4AF37]">
                {product.price.toFixed(2)} GHS
              </span>
              <span className="text-xs uppercase tracking-wider text-black/50 dark:text-white/60">
                • 100ml Extrait de Parfum
              </span>
            </div>

            <p className="text-xs sm:text-sm text-black/60 dark:text-white/60 leading-relaxed pt-2">
              Distilled in small, artisanal batches with aged agarwood oils, rare florals, and botanical resinous bases. Formulated for long-lasting sillage that endures throughout West African climates.
            </p>

            {/* Fragrance Accords Chips */}
            <div className="pt-2">
              <span className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-2">
                Olfactory Profile
              </span>
              <div className="flex flex-wrap gap-2">
                {["Smoky Oud", "Warm Amber", "French Damascena", "Dry Woods", "Golden Vanilla"].map(
                  (accord) => (
                    <span
                      key={accord}
                      className="px-2.5 py-1 bg-white dark:bg-white/5 text-black/70 dark:text-white/70 text-[11px] border border-black/10 dark:border-white/15"
                    >
                      {accord}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Luxury Assurance Highlights */}
            <div className="grid grid-cols-2 gap-3 pt-4 text-[11px] text-black/50 dark:text-white/60">
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
                <span className="w-2 h-2 rounded-full bg-[#D4AF37]/100"></span>
                <span>Ready for Dispatch</span>
              </div>
            </div>
          </div>

          {/* Quantity & Buy Section */}
          <div className="space-y-5 pt-5">
            {!isOutOfStock && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] uppercase tracking-widest text-black/50 dark:text-white/50 font-semibold">
                    Select Quantity (Bottles)
                  </label>
                  <span className="text-xs font-mono font-bold text-[#D4AF37]">
                    Total: {(product.price * quantity).toFixed(2)} GHS
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="inline-flex items-center border border-black/20 dark:border-white/15 bg-white dark:bg-white/10">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                      className="w-12 h-12 flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-[#F5F5F5] dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-base font-bold text-black dark:text-white font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(maxAvailable, quantity + 1))}
                      disabled={quantity >= maxAvailable}
                      className="w-12 h-12 flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-[#F5F5F5] dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <span className="text-xs text-black/45 dark:text-white/50">
                    Max: {maxAvailable} bottles
                  </span>
                </div>
              </div>
            )}

            {/* Primary Action Buttons */}
            {isOutOfStock ? (
              <div className="p-4 bg-white dark:bg-white/10 border border-black/10 dark:border-white/15 text-center">
                <p className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 font-semibold">
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
                      <Check className="w-4 h-4 text-[#D4AF37] stroke-[2.5]" />
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
