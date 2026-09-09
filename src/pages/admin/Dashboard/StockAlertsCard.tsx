import React from "react";
import type { Product } from "../../../types";
import { AlertTriangle } from "lucide-react";

interface StockAlertsCardProps {
  lowStock: Product[];
  outOfStock: Product[];
  onRestock: () => void;
}

export const StockAlertsCard: React.FC<StockAlertsCardProps> = ({
  lowStock,
  outOfStock,
  onRestock,
}) => {
  const needsAttention = lowStock.length > 0 || outOfStock.length > 0;
  if (!needsAttention) return null;

  return (
    <div className="relative overflow-hidden rounded-xl surface-glass-strong p-5 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
      <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />
      <div className="relative flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-gold" />
          <span>Fragrances Requiring Stock Replenishment</span>
        </h3>
        <button
          type="button"
          onClick={onRestock}
          className="text-xs text-gold hover:underline uppercase tracking-wider font-semibold transition-colors duration-[400ms]"
        >
          Restock Now →
        </button>
      </div>

      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...outOfStock, ...lowStock].slice(0, 6).map((item) => (
          <div
            key={item.id}
            className="rounded-lg p-3 surface-glass-tint flex items-center justify-between"
          >
            <div className="flex items-center space-x-3 min-w-0">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="rounded-lg w-10 h-10 object-cover border border-black/10 dark:border-white/15 flex-shrink-0"
              />
              <div className="truncate">
                <p className="text-xs font-semibold text-black dark:text-white truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-black/45 dark:text-white/45">
                  {item.price.toFixed(2)} GHS
                </p>
              </div>
            </div>

            <div className="text-right flex-shrink-0 ml-2">
              <span
                className={`inline-block rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  item.stock <= 0
                    ? "bg-red-950 text-red-300 border border-red-800"
                    : "bg-gold/10 text-gold border border-gold/40"
                }`}
              >
                {item.stock <= 0 ? "0 stock" : `${item.stock} left`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};