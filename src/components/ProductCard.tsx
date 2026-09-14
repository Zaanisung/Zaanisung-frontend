import React from "react";
import { Product } from "../types";
import { Plus, Check } from "lucide-react";
import { cn } from "../utils/cn";

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isAdded = false,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <article
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className={cn(
        "group relative flex flex-col h-full cursor-pointer overflow-hidden",
        "bg-[#fffdf9] dark:bg-[#171717] rounded-[18px] border border-black/10 dark:border-white/10",
        "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        "hover:shadow-[0_18px_36px_-24px_rgba(22,19,14,0.45)]",
        "hover:-translate-y-1",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Product image */}
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-[18px] flex-shrink-0 bg-[#ece6da]">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className={cn(
            "absolute inset-0 w-full h-full object-cover object-center",
            "transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
            "group-hover:scale-105"
          )}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* Stock status badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="inline-block rounded-full px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold bg-ink/90 dark:bg-ink/95 text-cream">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="inline-block rounded-full px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold bg-gold text-ink">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="inline-block rounded-full px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium bg-[#fffdf9]/90 text-ink">
              In Stock
            </span>
          )}
        </div>

        {/* Size indicator */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-block rounded-full px-2 py-1 bg-black/65 text-cream/90 text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold">
            100 ml
          </span>
        </div>

      </div>

      {/* Product information */}
      <div className="flex flex-col flex-1 gap-3 p-4 sm:p-5">
        <div className="flex flex-col gap-2 flex-1">
          <span className="eyebrow text-gold/90 block">
            Extrait de parfum
          </span>
          <h3
            className={cn(
              "font-brand-serif font-medium text-ink dark:text-white leading-snug line-clamp-1",
              "transition-colors duration-[400ms]",
              "group-hover:text-gold",
              "text-base sm:text-lg"
            )}
            title={product.name}
          >
            {product.name}
          </h3>

          {product.description && (
            <p className="text-xs text-black/50 dark:text-white/50 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-baseline justify-between">
          <span className="font-bold font-mono text-gold text-base sm:text-lg">
            ₵{product.price.toFixed(2)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-black/45 dark:text-white/55">
            100 ml
          </span>
        </div>

        {/* Action button with mist-inspired styling */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) onAddToCart(product, e);
          }}
          className={cn(
            "w-full min-h-[48px] py-3 px-4 rounded-xl",
            "text-[11px] sm:text-xs uppercase tracking-widest font-bold",
            "flex items-center justify-center gap-2",
            "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
            "select-none active:scale-[0.98]",
            isOutOfStock
              ? "surface-glass text-black/45 dark:text-white/45 cursor-not-allowed border border-black/10 dark:border-white/15"
              : isAdded
                ? "bg-gold text-ink border border-gold-600/40"
                : "bg-ink text-cream dark:bg-gold dark:text-ink border border-ink hover:bg-gold hover:border-gold hover:text-ink hover:scale-[1.01]"
          )}
        >
          {isOutOfStock ? (
            <span>Sold Out</span>
          ) : isAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Added to Cart</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add to Cart</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};
