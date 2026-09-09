import React from "react";
import type { Product } from "../../../types";
import { ProductImage } from "../../../components/ui/ProductImage";
import { Edit2, Trash2 } from "lucide-react";
import {
  getStockStatus,
  statusBadgeClass,
  statusLabel,
} from "./stockStatus";

interface DesktopTableProps {
  products: Product[];
  onQuickSale: (productId: string) => void;
  onQuickRestock: (productId: string) => void;
  onEditProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
}

export const DesktopTable: React.FC<DesktopTableProps> = ({
  products,
  onQuickSale,
  onQuickRestock,
  onEditProduct,
  onRemoveProduct,
}) => {
  return (
    <div className="relative hidden md:block rounded-xl surface-glass-strong overflow-hidden shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
      <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />
      <table className="relative w-full text-left text-xs sm:text-sm">
        <thead className="bg-cream dark:bg-white/10 text-black/45 dark:text-white/45 uppercase tracking-widest text-[10px]">
          <tr>
            <th className="py-3.5 px-4 font-semibold">Fragrance</th>
            <th className="py-3.5 px-4 font-semibold">Price</th>
            <th className="py-3.5 px-4 font-semibold">Current Stock</th>
            <th className="py-3.5 px-4 font-semibold">Stock Status</th>
            <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const kind = getStockStatus(p.stock);
            return (
              <tr key={p.id} className="hover:bg-white dark:hover:bg-white/5 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-3">
                    <ProductImage
                      src={p.imageUrl}
                      alt={p.name}
                      className="rounded-lg w-10 h-12 border border-black/10 dark:border-white/15 bg-white dark:bg-black"
                    />
                    <div>
                      <span className="font-semibold text-black dark:text-white block">
                        {p.name}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50">
                        ID: {p.id}
                      </span>
                    </div>
                  </div>
                </td>

                <td className="py-3 px-4 font-mono font-bold text-gold">
                  {p.price.toFixed(2)} GHS
                </td>

                <td className="py-3 px-4 font-mono font-semibold text-black dark:text-white">
                  {p.stock} bottles
                </td>

                <td className="py-3 px-4">
                  <span
                    className={`rounded-lg px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold ${statusBadgeClass(kind)}`}
                  >
                    {statusLabel(kind, p.stock)}
                  </span>
                </td>

                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => onQuickSale(p.id)}
                      className="rounded-lg min-h-[36px] px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold text-gold hover:bg-gold/10 border border-gold/30 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                      title="Record physical sale"
                    >
                      Sale
                    </button>

                    <button
                      type="button"
                      onClick={() => onQuickRestock(p.id)}
                      className="rounded-lg min-h-[36px] px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold text-gold hover:bg-gold/10 border border-gold/40 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                      title="Restock units"
                    >
                      Restock
                    </button>

                    <button
                      type="button"
                      onClick={() => onEditProduct(p.id)}
                      className="rounded-lg min-h-[36px] p-2 text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/5 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                      title="Edit product"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onRemoveProduct(p.id)}
                      className="rounded-lg min-h-[36px] p-2 text-black/50 dark:text-white/50 hover:text-red-400 hover:bg-red-950/20 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
                      title="Remove product"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};