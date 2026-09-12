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

/** Horizontal, tightly-organized card used on the dashboard (compact mode). */
const CompactCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isAdded,
}) => {
  const isOutOfStock = product.stock <= 0;

  return (
    <article
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className={cn(
        "group relative flex flex-col sm:flex-row sm:items-stretch h-full cursor-pointer overflow-hidden rounded-2xl",
        "bg-[rgba(249,247,242,0.94)] dark:bg-ink-900/75 border border-black/10 dark:border-white/12",
        "shadow-[0_1px_2px_rgba(10,10,10,0.04),0_6px_20px_-12px_rgba(10,10,10,0.14)]",
        "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        "hover:border-gold/50 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.12),0_10px_28px_-14px_rgba(212,175,55,0.22)] hover:-translate-y-0.5",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Image — fixed-ish left column on desktop, full width strip on mobile */}
      <div className="relative aspect-[4/3] sm:aspect-auto sm:w-[38%] lg:w-[42%] sm:flex-shrink-0 overflow-hidden">
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5 pointer-events-none opacity-50" />

        {/* Stock status badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          {isOutOfStock ? (
            <span className="inline-block rounded-lg px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold bg-ink/90 text-cream border border-white/20 backdrop-blur-md">
              Sold Out
            </span>
          ) : product.stock <= 3 ? (
            <span className="inline-block rounded-lg px-2 py-0.5 text-[9px] uppercase tracking-widest font-bold bg-gold text-ink">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="inline-block rounded-lg px-2 py-0.5 text-[9px] uppercase tracking-wider font-medium bg-ink/70 text-cream border border-white/10 backdrop-blur-md">
              In Stock
            </span>
          )}
        </div>

        {/* Size indicator */}
        <div className="absolute bottom-2 right-2 z-10">
          <span className="inline-block rounded-lg px-2 py-0.5 bg-black/60 text-cream/90 text-[9px] uppercase tracking-widest font-semibold border border-white/15 backdrop-blur-md">
            100 ml
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 min-w-0 gap-1.5 p-3.5 sm:p-4">
        <div className="flex flex-col gap-1">
          <span className="eyebrow text-gold/90 block text-[9px]">
            Eau de Parfum
          </span>
          <h3
            className="font-brand-serif font-medium text-ink dark:text-white leading-snug line-clamp-1 transition-colors duration-[400ms] group-hover:text-gold text-sm"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        <div className="mt-auto pt-2">
          <div className="hairline-black my-1" aria-hidden="true" />
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-bold font-mono text-gold text-sm">
              ₵{product.price.toFixed(2)}
            </span>
            {!isOutOfStock && (
              <span className="text-[9px] uppercase tracking-wider text-black/40 dark:text-white/50">
                Premium Oil
              </span>
            )}
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={(e) => {
              e.stopPropagation();
              if (!isOutOfStock) onAddToCart(product, e);
            }}
            className={cn(
              "w-full min-h-[44px] mt-2.5 px-3 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold",
              "flex items-center justify-center gap-1.5",
              "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
              "select-none active:scale-[0.98]",
              isOutOfStock
                ? "surface-glass text-black/45 dark:text-white/45 cursor-not-allowed border border-black/10 dark:border-white/15"
                : isAdded
                  ? "gold-gradient-bg text-ink border border-gold-600/30 shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_32px_-8px_rgba(212,175,55,0.35)]"
                  : "surface-glass-strong text-ink dark:text-white border border-black/15 dark:border-white/20 hover:gold-gradient-bg hover:text-ink hover:border-gold-600/30 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_32px_-8px_rgba(212,175,55,0.25)]"
            )}
          >
            {isOutOfStock ? (
              <span>Sold Out</span>
            ) : isAdded ? (
              <>
                <Check className="w-4 h-4 stroke-[2.5]" />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export const ProductCard: React.FC<ProductCardProps> = (props) => {
  if (props.compact) return <CompactCard {...props} />;

  const { product, onSelect, onAddToCart, isAdded = false } = props;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 3;

  return (
    <article
      id={`product-card-${product.id}`}
      onClick={() => onSelect(product)}
      className={cn(
        "group relative flex flex-col h-full cursor-pointer overflow-hidden",
        "surface-glass-strong rounded-2xl kente-frame",
        "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
        "hover:shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_12px_40px_-10px_rgba(212,175,55,0.35),0_6px_20px_-6px_rgba(212,175,55,0.25)]",
        "hover:-translate-y-1 hover:scale-[1.01]",
        isOutOfStock && "opacity-70"
      )}
    >
      {/* Product image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden rounded-t-2xl flex-shrink-0">
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

        {/* Soft mist overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/5 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity duration-[400ms]" />

        {/* Stock status badge */}
        <div className="absolute top-3 right-3 z-10">
          {isOutOfStock ? (
            <span className="inline-block rounded-lg px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold bg-ink/90 dark:bg-ink/95 text-cream border border-white/20 backdrop-blur-md">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="inline-block rounded-lg px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-widest font-bold bg-gold text-ink shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_32px_-8px_rgba(212,175,55,0.35)]">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="inline-block rounded-lg px-2.5 py-1 text-[9px] sm:text-[10px] uppercase tracking-wider font-medium bg-ink/70 text-cream border border-white/10 backdrop-blur-md">
              In Stock
            </span>
          )}
        </div>

        {/* Quick view hint on hover (keeps the product image fully visible) */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-[400ms] pointer-events-none">
          <span className="rounded-xl px-4 py-2 bg-ink/90 text-cream text-[10px] uppercase tracking-widest font-bold border border-gold/40 flex items-center gap-2 backdrop-blur-md shadow-lift">
            <Eye className="w-3.5 h-3.5 text-gold" />
            <span>View Fragrance</span>
          </span>
        </div>

        {/* Size indicator */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="inline-block rounded-lg px-2 py-1 bg-black/60 text-cream/90 text-[9px] sm:text-[10px] uppercase tracking-widest font-semibold border border-white/15 backdrop-blur-md">
            100 ml
          </span>
        </div>

        {/* Soft gold accent corner */}
        <div className="absolute bottom-0 right-0 w-16 h-16 overflow-hidden pointer-events-none opacity-50 group-hover:opacity-70 transition-opacity duration-[400ms]">
          <div className="w-24 h-24 bg-gradient-radial from-gold/30 to-transparent rounded-full transform translate-x-8 translate-y-8 blur-2xl"></div>
        </div>
      </div>

      {/* Product information */}
      <div className="flex flex-col flex-1 gap-3 p-5">
        <div className="flex flex-col gap-2 flex-1">
          <span className="eyebrow text-gold/90 block">
            Eau de Parfum
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

        <div className="hairline-black my-1" aria-hidden="true" />

        <div className="flex items-baseline justify-between">
          <span className="font-bold font-mono text-gold text-base sm:text-lg">
            ₵{product.price.toFixed(2)}
          </span>
          <span className="text-[10px] uppercase tracking-wider text-black/45 dark:text-white/55">
            Premium Oil
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
            "w-full min-h-[46px] py-3 px-4 rounded-xl",
            "text-[11px] sm:text-xs uppercase tracking-widest font-bold",
            "flex items-center justify-center gap-2",
            "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
            "select-none active:scale-[0.98]",
            isOutOfStock
              ? "surface-glass text-black/45 dark:text-white/45 cursor-not-allowed border border-black/10 dark:border-white/15"
              : isAdded
                ? "gold-gradient-bg text-ink border border-gold-600/30 shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_32px_-8px_rgba(212,175,55,0.35)]"
                : "surface-glass-strong text-ink dark:text-white border border-black/15 dark:border-white/20 hover:gold-gradient-bg hover:text-ink hover:border-gold-600/30 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_32px_-8px_rgba(212,175,55,0.25)] hover:scale-[1.02]"
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