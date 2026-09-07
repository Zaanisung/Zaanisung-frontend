import React from "react";
import { Product } from "../types";
import { Plus, Check, Eye } from "lucide-react";
import { cn } from "../utils/cn";

export interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isAdded?: boolean;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isAdded = false,
  compact = false,
}) => {
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <article
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className={cn(
        "group relative flex flex-col h-full border transition-all duration-300 cursor-pointer overflow-hidden",
        "surface-glass corner-frame hover:shadow-gold-glow hover:-translate-y-1",
        isOutOfStock && "opacity-80"
      )}
    >
      {/* Signature top hairline */}
      <div className="absolute top-0 left-0 right-0 hairline-gold z-20" aria-hidden="true" />

      {/* Full-bleed perfume image — wider 4:3 framing */}
      <div className="relative w-full aspect-[4/3] bg-white dark:bg-white/5 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/0 to-black/10 pointer-events-none opacity-70 group-hover:opacity-50 transition-opacity duration-300" />

        {/* Stock status badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="inline-block bg-ink/90 text-cream text-[9px] sm:text-[10px] px-2.5 py-1 uppercase tracking-widest font-bold border border-white/20">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="inline-block bg-gold text-ink text-[9px] sm:text-[10px] px-2.5 py-1 uppercase tracking-widest font-bold shadow-gold-glow">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="inline-block bg-ink/70 text-cream text-[9px] sm:text-[10px] px-2.5 py-1 uppercase tracking-wider font-medium border border-white/10 backdrop-blur-sm">
              In Stock
            </span>
          )}
        </div>

        {/* Quick view hint */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center bg-ink/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="px-3.5 py-1.5 bg-ink/85 text-cream text-[10px] uppercase tracking-widest font-bold border border-gold/40 flex items-center gap-1.5 backdrop-blur-sm shadow-lift">
            <Eye className="w-3.5 h-3.5 text-gold" />
            <span>View Fragrance</span>
          </span>
        </div>

        {/* Size chip + gold corner accent */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-block px-2 py-1 bg-black/55 text-cream/90 text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold border border-white/15 backdrop-blur-sm">
            100 ml
          </span>
        </div>

        <div className="absolute bottom-0 right-0 w-9 h-9 overflow-hidden pointer-events-none">
          <div className="w-14 h-14 bg-gold transform rotate-45 translate-x-7 translate-y-7 opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </div>

      {/* Product information */}
      <div
        className={cn(
          "flex flex-col flex-1 gap-2.5",
          compact ? "p-3.5" : "p-4 sm:p-5"
        )}
      >
        <div className="flex flex-col gap-1.5 flex-1">
          <span className="eyebrow text-gold text-opacity-90 block">
            Eau de Parfum
          </span>
          <h3
            className={cn(
              "font-brand-serif font-medium text-ink dark:text-white leading-snug line-clamp-1 group-hover:text-gold transition-colors",
              compact ? "text-sm" : "text-base sm:text-lg"
            )}
            title={product.name}
          >
            {product.name}
          </h3>

          {!compact && product.description && (
            <p className="mt-0.5 text-xs text-black/50 dark:text-white/50 leading-relaxed line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="hairline-black" aria-hidden="true" />

        <div className="flex items-baseline justify-between mt-auto">
          <span className={cn("font-bold font-mono text-gold", compact ? "text-sm" : "text-base sm:text-lg")}>
            {product.price.toFixed(2)} GHS
          </span>
          {!compact && (
            <span className="text-[10px] uppercase tracking-wider text-black/45 dark:text-white/55">
              Extrait Oil
            </span>
          )}
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
            "w-full min-h-[46px] py-2.5 px-3 text-[11px] sm:text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 border select-none active:scale-[0.98]",
            isOutOfStock
              ? "border-black/10 dark:border-white/15 text-black/45 dark:text-white/45 bg-white/60 dark:bg-white/[0.08] cursor-not-allowed"
              : isAdded
                ? "bg-gold text-ink border-gold shadow-gold-glow"
                : "border-ink/60 dark:border-white/25 text-ink dark:text-white hover:bg-gold hover:text-ink hover:border-gold dark:hover:bg-gold dark:hover:text-ink dark:hover:border-gold"
          )}
        >
          {isOutOfStock ? (
            <span>Sold Out</span>
          ) : isAdded ? (
            <>
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Added to Bag</span>
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