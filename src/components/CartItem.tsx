import React from "react";
import { OrderItem } from "../types";
import { Plus, Minus, Trash2 } from "lucide-react";

export interface CartItemProps {
  item: OrderItem;
  imageUrl?: string;
  maxStock?: number;
  onUpdateQuantity: (newQuantity: number) => void;
  onRemove: () => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  imageUrl,
  maxStock = 99,
  onUpdateQuantity,
  onRemove,
}) => {
  const isMaxReached = item.quantity >= maxStock;

  return (
    <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 py-5 sm:py-6">
      {/* Product Image - Larger and clear */}
      <div className="w-20 h-26 sm:w-24 sm:h-30 bg-white dark:bg-white/5 flex-shrink-0 border border-black/10 dark:border-white/15 overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-black/45 dark:text-white/45 bg-white dark:bg-white/20">
            Z
          </div>
        )}
      </div>

      {/* Item info - Fluid Mobile Layout */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[9px] uppercase tracking-widest text-[#D4AF37] font-semibold block">
              Fragrance
            </span>
            <h4
              className="font-brand-serif text-sm sm:text-base font-medium text-black dark:text-white truncate"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {item.name}
            </h4>
            <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
              {item.price.toFixed(2)} GHS each
            </p>
          </div>

          <span className="text-sm sm:text-base font-bold font-mono text-black dark:text-white flex-shrink-0">
            {(item.price * item.quantity).toFixed(2)} GHS
          </span>
        </div>

        {isMaxReached && maxStock > 0 && (
          <p className="text-[10px] text-[#D4AF37] dark:text-[#D4AF37] uppercase tracking-widest mt-1">
            Max available: {maxStock} bottles
          </p>
        )}

        {/* Stepper with 44px min tap target */}
        <div className="flex items-center justify-between gap-3 mt-3 sm:mt-4">
          <div className="inline-flex items-center border border-black/20 dark:border-white/15 bg-white dark:bg-white/5">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="w-10 h-10 min-h-[40px] flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-[#F5F5F5] dark:hover:bg-white/10 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center text-xs font-bold font-mono text-black dark:text-white">
              {item.quantity}
            </span>
            <button
              type="button"
              disabled={isMaxReached}
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="w-10 h-10 min-h-[40px] flex items-center justify-center text-black/70 dark:text-white/70 hover:bg-[#F5F5F5] dark:hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

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
