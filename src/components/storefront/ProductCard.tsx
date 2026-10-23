import React, { useState } from 'react';
import { Product } from '../../types';
import { formatGHS } from '../../utils/currency';
import { useApp } from '../../context/AppContext';
import { getProductPlaceholderSvg } from '../../config/assets';
import { Eye, Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { navigateTo, addToCart } = useApp();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const defaultVariant = product.sizes[0] || { size: '100ml', price: product.price, stock: product.stock };
  const fallbackSvg = getProductPlaceholderSvg(product.name, product.family);
  const isOutOfStock = product.stock <= 0;

  return (
    <div
      className="group flex flex-col text-left transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Visual Container (Lead with Imagery 65%-75% of height on neutral surface) */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#F0ECE5] border border-[#E4DED3] transition-transform duration-300 group-hover:-translate-y-1">
        <img
          src={imageError ? fallbackSvg : product.image}
          alt={`Bottle of ${product.name} ${product.concentration} by ${product.brand}`}
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />

        {/* Quiet out-of-stock overlay if applicable */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-[#FAF8F4]/80 backdrop-blur-xs flex items-center justify-center p-4">
            <span className="text-xs uppercase tracking-widest font-semibold text-[#716C64] border-b border-[#716C64] pb-0.5">
              Allocation Exhausted
            </span>
          </div>
        )}

        {/* Quick action buttons on hover */}
        {!isOutOfStock && (
          <div
            className={`absolute bottom-3 inset-x-3 flex items-center gap-2 transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, defaultVariant.size as any, 1);
              }}
              aria-label={`Quick add ${product.name} to flacon`}
              className="flex-1 bg-[#171512]/90 hover:bg-[#171512] text-[#F8F5EF] text-xs font-medium py-2 px-3 backdrop-blur-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer rounded-xs"
            >
              <Plus size={14} />
              <span>Add to Flacon</span>
            </button>
            <button
              onClick={() => navigateTo('product-detail', { productId: product.id })}
              aria-label={`View details for ${product.name}`}
              className="bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] text-[#171512] p-2 backdrop-blur-xs transition-colors cursor-pointer rounded-xs"
            >
              <Eye size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Metadata Container (Clean unboxed text metadata with typographic separators) */}
      <div className="pt-4 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 text-[11px] text-[#716C64] uppercase tracking-wider mb-1">
          <span>{product.brand}</span>
          <span aria-hidden="true">·</span>
          <span>{product.family}</span>
        </div>

        <button
          onClick={() => navigateTo('product-detail', { productId: product.id })}
          className="text-left font-serif text-lg font-medium text-[#171512] group-hover:text-[#92733C] transition-colors truncate cursor-pointer"
        >
          {product.name}
        </button>

        <p className="text-xs text-[#716C64] line-clamp-1 mt-0.5 font-light">
          {product.subtitle}
        </p>

        <div className="mt-2.5 pt-2 border-t border-[#E4DED3]/60 flex items-center justify-between text-sm">
          <span className="font-medium text-[#171512] tabular-nums">
            {formatGHS(product.price)}
          </span>
          <span className="text-xs text-[#716C64]">
            {defaultVariant.size}
          </span>
        </div>
      </div>
    </div>
  );
};
