import React, { useState, useMemo } from "react";
import type { Product } from "../../types";
import { Button } from "../../components/Button";
import {
  PlusCircle,
  Search,
  Edit2,
  Trash2,
  X,
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
            className="text-2xl sm:text-3xl font-light text-black dark:text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
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
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50 dark:text-white/50 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter inventory by name..."
          className="w-full pl-9 pr-8 min-h-[44px] bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 text-black dark:text-white text-xs placeholder-black/50 focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-16 text-center bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 p-6">
          <p className="text-sm text-black/45 dark:text-white/45 mb-4">
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
      <div className="hidden md:block bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#F5F5F5] dark:bg-white/10 text-black/45 dark:text-white/45 uppercase tracking-widest text-[10px]">
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
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-10 h-12 object-cover border border-black/10 dark:border-white/15 bg-white dark:bg-black"
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

                  <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">
                    {p.price.toFixed(2)} GHS
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-black dark:text-white">
                    {p.stock} bottles
                  </td>

                  <td className="py-3 px-4">
                    {isOut ? (
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-red-950 text-red-300 border border-red-800">
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40">
                        Low Stock ({p.stock})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/40">
                        In Stock
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => onQuickSale(p.id)}
                        className="min-h-[36px] px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/30 transition-colors"
                        title="Record physical sale"
                      >
                        Sale
                      </button>

                      <button
                        type="button"
                        onClick={() => onQuickRestock(p.id)}
                        className="min-h-[36px] px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold text-[#D4AF37] hover:bg-[#D4AF37]/10 border border-[#D4AF37]/40 transition-colors"
                        title="Restock units"
                      >
                        Restock
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditProduct(p.id)}
                        className="min-h-[36px] p-2 text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-white/5 transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveProduct(p.id)}
                        className="min-h-[36px] p-2 text-black/50 dark:text-white/50 hover:text-red-400 hover:bg-red-950/20 transition-colors"
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
              className="bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 p-4 flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-14 h-16 object-cover border border-black/10 dark:border-white/15 bg-white dark:bg-black flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-black dark:text-white truncate">
                      {p.name}
                    </h3>
                    {isOut ? (
                      <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-red-950 text-red-300">
                        Out
                      </span>
                    ) : isLow ? (
                      <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#D4AF37]/10 text-[#D4AF37]">
                        Low ({p.stock})
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-[#D4AF37]/10 text-[#D4AF37]">
                        {p.stock} units
                      </span>
                    )}
                  </div>

                  <p className="font-mono font-bold text-[#D4AF37] text-sm mt-1">
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
                  className="min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center"
                >
                  Sale
                </button>

                <button
                  type="button"
                  onClick={() => onQuickRestock(p.id)}
                  className="min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/40 flex items-center justify-center"
                >
                  Restock
                </button>

                <button
                  type="button"
                  onClick={() => onEditProduct(p.id)}
                  className="min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-black/60 dark:text-white/60 bg-white dark:bg-white/5 border border-black/10 dark:border-white/15 flex items-center justify-center"
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => onRemoveProduct(p.id)}
                  className="min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-red-400 bg-red-950/30 border border-red-900/40 flex items-center justify-center"
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
