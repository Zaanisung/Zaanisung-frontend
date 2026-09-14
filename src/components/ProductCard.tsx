import React, { useState } from "react";
import { Product } from "../types";
import { Plus, Check } from "lucide-react";
import { cn } from "../utils/cn";
import { resolveApiUrl } from "../services/apiClient";

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isAdded?: boolean;
}

/** Minimal monogram placeholder shown while/when no real product image is available. */
const ImageFallback: React.FC<{ name: string }> = ({ name }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#ece6da] dark:bg-white/5">
    <span className="font-brand-serif text-4xl font-light text-gold select-none">
      {name.trim().charAt(0).toUpperCase() || "Z"}
    </span>
    <span className="text-[9px] uppercase tracking-[0.3em] text-black/40 dark:text-white/50 select-none">
      Zaanisung
    </span>
  </div>
);

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isAdded = false,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = Boolean(product.imageUrl) && !imgFailed;

  return (
    <article
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className={cn(
        "group relative flex h-full cursor-pointer flex-col overflow-hidden",
        "bg-[#fffdf9] dark:bg-[#171717] rounded-[18px] border border-black/10 dark:border-white/10",
        "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        "hover:shadow-[0_18px_36px_-24px_rgba(22,19,14,0.45)]",
        "hover:-translate-y-1",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Product image */}
      <div className="relative w-full aspect-square overflow-hidden rounded-t-[18px] flex-shrink-0 bg-[#ece6da]">
        {hasImage ? (
          <img
            src={resolveApiUrl(product.imageUrl)}
            alt={product.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-[600ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group-hover:scale-105"
          />
        ) : (
          <ImageFallback name={product.name} />
        )}

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
      </div>

      {/* Product information */}
      <div className="flex flex-col gap-2 sm:gap-2.5 p-3 sm:p-4 flex-1">
        <div className="flex flex-col gap-1">
          <h3
            className={cn(
              "font-brand-serif font-medium text-ink dark:text-white leading-snug line-clamp-1",
              "text-[15px] sm:text-lg transition-colors duration-[400ms]",
              "group-hover:text-gold"
            )}
            title={product.name}
          >
            {product.name}
          </h3>

          {product.description && (
            <p className="text-[11px] text-black/50 dark:text-white/50 leading-relaxed line-clamp-1">
              {product.description}
            </p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-1">
          <span className="font-bold font-mono text-gold text-[15px] sm:text-lg">
            ₵{product.price.toFixed(2)}
          </span>
          <span className="text-[9px] uppercase tracking-wider text-black/45 dark:text-white/55">
            100 ml
          </span>
        </div>

        {/* Action button */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) onAddToCart(product, e);
          }}
          className={cn(
            "w-full min-h-[40px] sm:min-h-[46px] py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl",
            "text-[10px] sm:text-xs uppercase tracking-widest font-bold",
            "flex items-center justify-center gap-1.5 sm:gap-2",
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
              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span>Added</span>
            </>
          ) : (
            <>
              <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              <span>Add</span>
            </>
          )}
        </button>
      </div>
    </article>
  );
};