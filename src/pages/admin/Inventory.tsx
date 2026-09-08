import React, { useState, useMemo } from "react";
import type { Product } from "../../types";
import { Button } from "../../components/Button";
import { SearchInput } from "../../components/ui/SearchInput";
import { ProductImage } from "../../components/ui/ProductImage";
import {
  PlusCircle,
  Edit2,
  Trash2,
} from "lucide-react";

export interface InventoryProps {
  products: Product[];
  onAddProduct: () => void;
  onEditProduct: (productId: string) => void;
  onRemoveProduct: (productId: string) => void;
  onQuickSale: (productId: string) => void;
  onQuickRestock: (productId: string) => void;
}

export const Inventory: React.FC<InventoryProps> = ({
  products,
  onAddProduct,
  onEditProduct,
  onRemoveProduct,
  onQuickSale,
  onQuickRestock,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase().trim();
    return products.filter((p) => p.name.toLowerCase().includes(q));
  }, [products, searchQuery]);

  return (
    <div className="w-full space-y-6">
      {/* Header & Primary "+ Add Perfume" Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-light text-black dark:text-white font-brand-serif"
          >
            Perfume Inventory
          </h2>
          <p className="text-xs uppercase tracking-widest text-black/45 dark:text-white/45 mt-1">
            {products.length} Products Catalogued
          </p>
        </div>

        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onAddProduct}
          className="flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Add Perfume</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <SearchInput
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Filter inventory by name..."
        ariaLabel="Filter inventory"
        className="w-full max-w-md"
      />

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="relative overflow-hidden rounded-xl surface-glass-strong p-6 text-center py-16 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
          <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
          <p className="relative text-sm text-black/45 dark:text-white/45 mb-4">
            {searchQuery
              ? `No perfumes matching "${searchQuery}".`
              : "No perfumes in the inventory catalog yet."}
          </p>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onAddProduct}
          >
            + Add First Perfume
          </Button>
        </div>
      )}

      {/* Desktop Table View */}
      <div className="relative hidden md:block rounded-xl surface-glass-strong overflow-hidden shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
        <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
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
            {filteredProducts.map((p) => {
              const isOut = p.stock <= 0;
              const isLow = p.stock > 0 && p.stock <= 3;

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
                    {isOut ? (
                      <span className="rounded-lg px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-red-950 text-red-300 border border-red-800">
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="rounded-lg px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-gold/10 text-gold border border-gold/40">
                        Low Stock ({p.stock})
                      </span>
                    ) : (
                      <span className="rounded-lg px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-gold/10 text-gold border border-gold/40">
                        In Stock
                      </span>
                    )}
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

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-3">
        {filteredProducts.map((p) => {
          const isOut = p.stock <= 0;
          const isLow = p.stock > 0 && p.stock <= 3;

          return (
            <div
              key={p.id}
              className="relative overflow-hidden rounded-xl surface-glass-strong p-4 flex flex-col space-y-3 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]"
            >
              <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>

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
                    {isOut ? (
                      <span className="rounded-lg px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-red-950 text-red-300">
                        Out
                      </span>
                    ) : isLow ? (
                      <span className="rounded-lg px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-gold/10 text-gold">
                        Low ({p.stock})
                      </span>
                    ) : (
                      <span className="rounded-lg px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-gold/10 text-gold">
                        {p.stock} units
                      </span>
                    )}
                  </div>

                  <p className="font-mono font-bold text-gold text-sm mt-1">
                    {p.price.toFixed(2)} GHS
                  </p>
                  <p className="text-[11px] text-black/45 dark:text-white/45">Stock: {p.stock} bottles</p>
                </div>
              </div>

              {/* Action Buttons (44px min tap targets) */}
              <div className="grid grid-cols-4 gap-2 pt-3">
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
    </div>
  );
};
