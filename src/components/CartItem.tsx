import React from "react";
import { OrderItem } from "../types";
import { Trash2 } from "lucide-react";
import { QuantityStepper } from "./ui/QuantityStepper";
import { ProductImage } from "./ui/ProductImage";

export interface CartItemProps {
  item: OrderItem;
  imageUrl?: string;
  maxStock?: number;
  /** Current catalog price — overrides the price captured in the cart item. */
  priceOverride?: number;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  imageUrl,
  maxStock = 99,
  priceOverride,
  onUpdateQuantity,
  onRemove,
}) => {
  const isMaxReached = item.quantity >= maxStock;
  const price = priceOverride ?? item.price;

  return (
    <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 py-5 sm:py-6">
      {/* Product Image - Larger and clear */}
      <div className="w-20 h-26 sm:w-24 sm:h-30 surface-glass flex-shrink-0 border border-black/10 dark:border-white/15 overflow-hidden relative rounded-xl">
        <ProductImage src={imageUrl} alt={item.name} className="w-full h-full" />
      </div>

      {/* Item info - Fluid Mobile Layout */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-gold font-semibold block">
              Fragrance
            </span>
            <h4
              className="font-brand-serif text-sm sm:text-base font-medium text-black dark:text-white truncate"
            >
              {item.name}
            </h4>
            <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
              {price.toFixed(2)} GHS each
            </p>
          </div>

          <span className="text-sm sm:text-base font-bold font-mono text-black dark:text-white flex-shrink-0">
            {(price * item.quantity).toFixed(2)} GHS
          </span>
        </div>

        {isMaxReached && maxStock > 0 && (
          <p className="text-[10px] text-gold dark:text-gold uppercase tracking-widest mt-1">
            Max available: {maxStock} bottles
          </p>
        )}

        {/* Stepper with 44px min tap target */}
        <div className="flex items-center justify-between gap-3 mt-3 sm:mt-4">
          <QuantityStepper
            quantity={item.quantity}
            max={maxStock}
            min={0}
            onDecrease={() => onUpdateQuantity(item.quantity - 1)}
            onIncrease={() => onUpdateQuantity(item.quantity + 1)}
          />

          <button
            type="button"
            onClick={onRemove}
            className="min-h-[44px] px-2.5 text-[11px] uppercase tracking-wider text-black/45 dark:text-white/45 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 ml-auto"
            aria-label={`Remove ${item.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="text-[10px] sm:text-xs">Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
