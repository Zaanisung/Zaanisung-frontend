import React, { useState } from "react";
import { Product } from "../types";
import { Plus, Check } from "lucide-react";
import { cn } from "../utils/cn";
import { resolveApiUrl } from "../services/apiClient";
import { LOW_STOCK_THRESHOLD } from "../constants";

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isAdded?: boolean;
}

/** Minimal monogram placeholder shown while/when no real product image is available. */
const ImageFallback: React.FC<{ name: string }> = ({ name }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-[#f1ece2] dark:bg-white/5">
    <span className="font-brand-serif text-3xl font-light text-gold select-none">
      {name.trim().charAt(0).toUpperCase() || "Z"}
    </span>
  </div>
);

/**
 * Art-directed luxury product profile.
 *
 * The composition is intentionally NOT a boxed e-commerce card: no container
 * border, card background, divider lines or heavy shadow. The product image is
 * the visual subject; text sits below it with quiet hierarchy. On small screens
 * the card keeps the full column width so the fragrance never gets cramped.
 */
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isAdded = false,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= LOW_STOCK_THRESHOLD;
  const [imgFailed, setImgFailed] = useState(false);
  const hasImage = Boolean(product.imageUrl) && !imgFailed;

  return (
    <article
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className="group relative flex h-full cursor-pointer flex-col"
    >
      {/* Product image — the focus of the composition */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl bg-[#f1ece2] dark:bg-white/5">
        {hasImage ? (
          <img
            src={resolveApiUrl(product.imageUrl)}
            alt={product.name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <ImageFallback name={product.name} />
        )}

        {isOutOfStock && (
          <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-cream">
            Sold Out
          </span>
        )}
      </div>

      {/* Product information — quiet, aligned, hierarchy-driven */}
      <div className="flex flex-1 flex-col gap-1.5 px-0.5 pt-3 sm:gap-2 sm:pt-4">
        <h3
          className="line-clamp-1 font-brand-serif text-base font-medium leading-snug text-ink dark:text-white transition-colors duration-300 group-hover:text-gold"
          title={product.name}
        >
          {product.name}
        </h3>

        {product.description && (
          <p className="line-clamp-1 text-xs leading-relaxed text-black/55 dark:text-white/55">
            {product.description}
          </p>
        )}

        {isLowStock && !isOutOfStock && (
          <p className="text-[10px] font-semibold uppercase tracking-widest text-gold">
            Only {product.stock} left
          </p>
        )}

        <div className="flex items-center justify-between gap-3 pt-1.5 sm:pt-2">
          <span className="font-mono text-[15px] font-bold text-ink dark:text-white sm:text-base">
            {product.price.toFixed(2)}{" "}
            <span className="text-[10px] font-semibold uppercase text-black/50 dark:text-white/50">
              GHS
            </span>
          </span>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onAddToCart(product, e);
            }}
            aria-label={
              isAdded
                ? `${product.name} added to bag`
                : `Add ${product.name} to bag`
            }
            className={cn(
              "inline-flex min-h-[44px] items-center justify-center gap-1.5 rounded-full px-4 text-[11px] uppercase tracking-widest font-bold",
              "border transition-all duration-300 active:scale-[0.97]",
              isOutOfStock
                ? "cursor-not-allowed border-black/10 text-black/40 dark:border-white/15 dark:text-white/40"
                : isAdded
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-black/15 text-ink dark:border-white/25 dark:text-white hover:border-gold hover:text-gold"
            )}
          >
            {isOutOfStock ? (
              <span>Sold Out</span>
            ) : isAdded ? (
              <>
                <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                <span>Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};