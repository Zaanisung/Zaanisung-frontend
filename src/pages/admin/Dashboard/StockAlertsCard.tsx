import React, { useState } from "react";
import type { Product } from "../../../types";
import { resolveApiUrl } from "../../../services/apiClient";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { LOW_STOCK_THRESHOLD } from "../../../constants";

interface StockAlertsCardProps {
  lowStock: Product[];
  outOfStock: Product[];
  onRestock: () => void;
}

/** Product thumbnail that degrades gracefully to a monogram when the image
 *  is missing or fails to load. */
const ProductThumb: React.FC<{ product: Product }> = ({ product }) => {
  const [failed, setFailed] = useState(false);
  const src = resolveApiUrl(product.imageUrl);
  if (!src || failed) {
    return (
      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold/15 border border-gold/30 flex-shrink-0">
        <span className="font-brand-serif text-sm text-gold font-semibold select-none">
          {product.name.trim().charAt(0).toUpperCase() || "Z"}
        </span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={product.name}
      loading="lazy"
      onError={() => setFailed(true)}
      className="rounded-full w-10 h-10 object-cover border border-black/10 dark:border-white/15 flex-shrink-0"
    />
  );
};

export const StockAlertsCard: React.FC<StockAlertsCardProps> = ({
  lowStock,
  outOfStock,
  onRestock,
}) => {
  const needsAttention = lowStock.length > 0 || outOfStock.length > 0;

  const items = needsAttention
    ? [...outOfStock, ...lowStock].slice(0, 6)
    : [];
  const criticalCount = outOfStock.length;

  return (
    <div
      className="relative overflow-hidden rounded-[18px] surface-glass-strong p-4 sm:p-5 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]"
      data-tour="admin-stock-alerts"
    >
      <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />
      <div className="relative flex flex-wrap items-center justify-between gap-2 mb-4">
        <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold flex items-center gap-2 min-w-0">
          <AlertTriangle className="w-4 h-4 text-gold flex-shrink-0" />
          <span className="truncate">Stock Alerts</span>
          <span className="rounded-full bg-red-950/10 dark:bg-red-500/15 border border-red-800/40 text-red-500 text-[9px] px-2 py-0.5 font-bold flex-shrink-0">
            {items.length}
          </span>
        </h3>
        <button
          type="button"
          onClick={onRestock}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 rounded-full text-[10px] text-gold bg-gold/10 border border-gold/40 hover:bg-gold/20 uppercase tracking-wider font-bold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        >
          <RefreshCw className="w-3.5 h-3.5 text-gold" />
          <span>Restock Now</span>
        </button>
      </div>

      {needsAttention ? (
        <>
          <div className="relative grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-2.5">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-full surface-glass-tint p-1.5 pr-3 flex items-center gap-2.5 min-w-0"
              >
                <ProductThumb product={item} />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-black dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-[11px] text-black/45 dark:text-white/45 truncate">
                    {item.price.toFixed(2)} GHS
                  </p>
                </div>
                <span
                  className={`inline-block rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider flex-shrink-0 ${
                    item.stock <= 0
                      ? "bg-red-950/10 text-red-500 border border-red-800/40"
                      : "bg-gold/12 text-gold border border-gold/40"
                  }`}
                >
                  {item.stock <= 0 ? "0 stock" : `${item.stock} left`}
                </span>
              </div>
            ))}
          </div>

          {criticalCount > 0 && (
            <p className="relative mt-3 text-[11px] text-red-500/90 leading-snug">
              {criticalCount === 1
                ? "1 fragrance is completely out of stock — restock to avoid losing sales."
                : `${criticalCount} fragrances are completely out of stock — restock to avoid losing sales.`}
            </p>
          )}
        </>
      ) : (
        <div className="relative rounded-xl surface-glass-tint p-4 flex items-center gap-3 min-w-0">
          <span className="w-9 h-9 rounded-full flex items-center justify-center bg-gold/12 border border-gold/30 flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-gold" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-black/70 dark:text-white/75">
              All perfumes are sufficiently stocked
            </p>
            <p className="text-[11px] text-black/45 dark:text-white/45">
              {LOW_STOCK_THRESHOLD} bottles or fewer triggers a low-stock alert.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};