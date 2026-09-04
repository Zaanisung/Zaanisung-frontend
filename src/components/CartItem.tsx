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
    <div className="flex items-start sm:items-center gap-3.5 sm:gap-5 py-4 sm:py-5 border-b border-gray-100 dark:border-[#22222A] last:border-none">
      {/* Product Image - Larger and clear */}
      <div className="w-20 h-26 sm:w-24 sm:h-30 bg-[#F5F4F0] dark:bg-[#1A1A22] flex-shrink-0 border border-gray-200 dark:border-[#282832] overflow-hidden relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover object-center"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs uppercase tracking-widest text-gray-400 bg-gray-100 dark:bg-gray-800">
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
              className="font-brand-serif text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100 truncate"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              {item.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {item.price.toFixed(2)} GHS each
            </p>
          </div>

          <span className="text-sm sm:text-base font-bold font-mono text-gray-900 dark:text-gray-100 flex-shrink-0">
            {(item.price * item.quantity).toFixed(2)} GHS
          </span>
        </div>

        {isMaxReached && maxStock > 0 && (
          <p className="text-[10px] text-amber-600 dark:text-amber-400 uppercase tracking-widest mt-1">
            Max available: {maxStock} bottles
          </p>
        )}

        {/* Stepper with 44px min tap target */}
        <div className="flex items-center justify-between gap-3 mt-3 sm:mt-4">
          <div className="inline-flex items-center border border-gray-300 dark:border-[#2C2C38] bg-white dark:bg-[#16161C]">
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.quantity - 1)}
              className="w-10 h-10 min-h-[40px] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22222C] transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-9 text-center text-xs font-bold font-mono text-gray-900 dark:text-gray-100">
              {item.quantity}
            </span>
            <button
              type="button"
              disabled={isMaxReached}
              onClick={() => onUpdateQuantity(item.quantity + 1)}
              className="w-10 h-10 min-h-[40px] flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#22222C] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onRemove}
            className="min-h-[44px] px-2.5 text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors flex items-center gap-1.5 ml-auto"
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
