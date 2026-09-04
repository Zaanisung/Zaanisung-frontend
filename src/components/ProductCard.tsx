import React from "react";
import { Product } from "../types";
import { Plus, Check, Eye } from "lucide-react";

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
      className={`group relative flex flex-col bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#23232C] hover:border-[#D4AF37] dark:hover:border-[#D4AF37] shadow-xs hover:shadow-md transition-all duration-300 cursor-pointer overflow-hidden ${
        isOutOfStock ? "opacity-80" : ""
      }`}
    >
      {/* Full-Bleed Hero Image Container - Large and prominent */}
      <div className="relative w-full aspect-[3/4] min-h-[220px] sm:min-h-[260px] md:min-h-[280px] bg-[#F5F4F0] dark:bg-[#1A1A22] overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-106 transition-transform duration-500 ease-out"
        />

        {/* Subtle Dark Gradient Overlay at top & bottom for high legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Stock Status Badge - Geometric Luxury Tag */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <span className="inline-block bg-black/90 dark:bg-black text-white text-[9px] sm:text-[10px] px-2.5 py-1 uppercase tracking-widest font-bold backdrop-blur-xs border border-white/20">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="inline-block bg-amber-600/95 text-white text-[9px] sm:text-[10px] px-2.5 py-1 uppercase tracking-widest font-bold shadow-xs">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="inline-block bg-black/80 dark:bg-black/90 text-white text-[9px] sm:text-[10px] px-2 py-0.5 uppercase tracking-wider font-medium backdrop-blur-xs border border-white/10">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View hint on desktop hover */}
        <div className="hidden sm:flex absolute inset-0 items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="px-3.5 py-1.5 bg-black/85 text-white text-[10px] uppercase tracking-widest font-bold border border-white/20 flex items-center gap-1.5 backdrop-blur-xs shadow-lg">
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>View Fragrance</span>
          </span>
        </div>

        {/* Gold Accent Corner geometry */}
        <div className="absolute bottom-0 right-0 w-8 h-8 overflow-hidden pointer-events-none">
          <div className="w-12 h-12 bg-[#D4AF37] transform rotate-45 translate-x-6 translate-y-6 opacity-80 group-hover:opacity-100 transition-opacity"></div>
        </div>
      </div>

      {/* Product Information - Fluid & Mobile-First padding */}
      <div className="p-3.5 sm:p-4 md:p-4.5 flex flex-col flex-1 justify-between gap-3 bg-white dark:bg-[#131317]">
        <div>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-semibold block mb-1">
            Eau de Parfum
          </span>
          <h3
            className="font-brand-serif text-sm sm:text-base md:text-lg font-normal text-gray-900 dark:text-gray-100 leading-snug line-clamp-1 group-hover:text-[#D4AF37] transition-colors"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {product.name}
          </h3>

          <div className="flex items-baseline justify-between mt-1">
            <span className="text-base sm:text-lg font-bold font-mono text-[#D4AF37]">
              {product.price.toFixed(2)} GHS
            </span>
            <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400">
              100 ml
            </span>
          </div>
        </div>

        {/* Action Button - 44px+ min touch target */}
        <button
          type="button"
          disabled={isOutOfStock}
          onClick={(e) => {
            e.stopPropagation();
            if (!isOutOfStock) {
              onAddToCart(product, e);
            }
          }}
          className={`w-full min-h-[44px] py-2.5 px-3 text-[11px] sm:text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 border select-none active:scale-[0.98] ${
            isOutOfStock
              ? "border-gray-200 dark:border-[#262630] text-gray-400 dark:text-gray-600 bg-gray-50 dark:bg-[#18181F] cursor-not-allowed"
              : isAdded
              ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-xs"
              : "border-gray-900 dark:border-gray-200 text-gray-900 dark:text-gray-100 hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] dark:hover:bg-[#D4AF37] dark:hover:text-black dark:hover:border-[#D4AF37]"
          }`}
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
