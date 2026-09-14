import React from "react";
import type { Product } from "../../../types";
import { ProductImage } from "../../../components/ui/ProductImage";
import { getStockStatus } from "./stockStatus";

interface MobileCardListProps {
  products: Product[];
  onQuickSale: (productId: string) => void;
  onQuickRestock: (productId: string) => void;
  onEditProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
}

function mobileLabel(kind: "out" | "low" | "in", stock: number): string {
  switch (kind) {
    case "out":
      return "Out";
    case "low":
      return `Low (${stock})`;
    case "in":
      return `${stock} units`;
  }
}

function mobileBadge(kind: "out" | "low" | "in"): string {
  switch (kind) {
    case "out":
      return "bg-red-950 text-red-300";
    case "low":
    case "in":
      return "bg-gold/10 text-gold";
  }
}

export const MobileCardList: React.FC<MobileCardListProps> = ({
  products,
  onQuickSale,
  onQuickRestock,
  onEditProduct,
  onRemoveProduct,
}) => {
  return (
    <div className="lg:hidden space-y-3">
      {products.map((p) => {
        const kind = getStockStatus(p.stock);
        return (
          <div
            key={p.id}
            className="relative overflow-hidden rounded-xl surface-glass-strong p-4 flex flex-col space-y-3 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]"
          >
            <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />

            <div className="relative flex items-center space-x-3">
              <ProductImage
                src={p.imageUrl}
                alt={p.name}
                className="rounded-lg w-14 h-16 border border-black/10 dark:border-white/15 bg-white dark:bg-black flex-shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm text-black dark:text-white truncate">
                    {p.name}
                  </h3>
                  <span className={`rounded-lg px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold ${mobileBadge(kind)}`}>
                    {mobileLabel(kind, p.stock)}
                  </span>
                </div>

                <p className="font-mono font-bold text-gold text-sm mt-1">
                  {p.price.toFixed(2)} GHS
                </p>
                <p className="text-[11px] text-black/45 dark:text-white/45">Stock: {p.stock} bottles</p>
              </div>
            </div>

            <div
              className="grid grid-cols-2 min-[400px]:grid-cols-4 gap-2 pt-3"
              data-tour="admin-inventory-actions"
            >
              <button
                type="button"
                onClick={() => onQuickSale(p.id)}
                className="rounded-lg min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-gold bg-gold/15 border border-gold/40 flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              >
                Sale
              </button>

              <button
                type="button"
                onClick={() => onQuickRestock(p.id)}
                className="rounded-lg min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-gold bg-gold/10 border border-gold/40 flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              >
                Restock
              </button>

              <button
                type="button"
                onClick={() => onEditProduct(p.id)}
                className="rounded-lg min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-black/60 dark:text-white/60 surface-glass border border-black/10 dark:border-white/15 flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              >
                Edit
              </button>

              <button
                type="button"
                onClick={() => onRemoveProduct(p.id)}
                className="rounded-lg min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-red-400 bg-red-950/30 border border-red-900/40 flex items-center justify-center transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              >
                Remove
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};