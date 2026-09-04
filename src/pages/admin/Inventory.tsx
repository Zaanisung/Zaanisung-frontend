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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E1E24] pb-4">
        <div>
          <h2
            className="text-2xl sm:text-3xl font-light text-white"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Perfume Inventory
          </h2>
          <p className="text-xs uppercase tracking-widest text-gray-400 mt-1">
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
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter inventory by name..."
          className="w-full pl-9 pr-8 min-h-[44px] bg-[#121216] border border-[#22222A] text-white text-xs placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredProducts.length === 0 && (
        <div className="py-16 text-center bg-[#121216] border border-[#1E1E24] p-6">
          <p className="text-sm text-gray-400 mb-4">
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
      <div className="hidden md:block bg-[#121216] border border-[#1E1E24] overflow-hidden">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-[#181820] text-gray-400 uppercase tracking-widest text-[10px] border-b border-[#22222A]">
            <tr>
              <th className="py-3.5 px-4 font-semibold">Fragrance</th>
              <th className="py-3.5 px-4 font-semibold">Price</th>
              <th className="py-3.5 px-4 font-semibold">Current Stock</th>
              <th className="py-3.5 px-4 font-semibold">Stock Status</th>
              <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1E1E24]">
            {filteredProducts.map((p) => {
              const isOut = p.stock <= 0;
              const isLow = p.stock > 0 && p.stock <= 3;

              return (
                <tr key={p.id} className="hover:bg-[#16161D] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-10 h-12 object-cover border border-[#262630] bg-[#0A0A0C]"
                      />
                      <div>
                        <span className="font-semibold text-white block">
                          {p.name}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-gray-500">
                          ID: {p.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">
                    {p.price.toFixed(2)} GHS
                  </td>

                  <td className="py-3 px-4 font-mono font-semibold text-white">
                    {p.stock} bottles
                  </td>

                  <td className="py-3 px-4">
                    {isOut ? (
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-red-950 text-red-300 border border-red-800">
                        Out of Stock
                      </span>
                    ) : isLow ? (
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-amber-950 text-amber-300 border border-amber-800">
                        Low Stock ({p.stock})
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        In Stock
                      </span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => onQuickSale(p.id)}
                        className="min-h-[36px] px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold text-amber-300 hover:bg-[#D4AF37]/10 border border-[#D4AF37]/30 transition-colors"
                        title="Record physical sale"
                      >
                        Sale
                      </button>

                      <button
                        type="button"
                        onClick={() => onQuickRestock(p.id)}
                        className="min-h-[36px] px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold text-emerald-300 hover:bg-emerald-950/40 border border-emerald-800/40 transition-colors"
                        title="Restock units"
                      >
                        Restock
                      </button>

                      <button
                        type="button"
                        onClick={() => onEditProduct(p.id)}
                        className="min-h-[36px] p-2 text-gray-400 hover:text-white hover:bg-[#202028] transition-colors"
                        title="Edit product"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => onRemoveProduct(p.id)}
                        className="min-h-[36px] p-2 text-gray-500 hover:text-red-400 hover:bg-red-950/20 transition-colors"
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
              className="bg-[#121216] border border-[#1E1E24] p-4 flex flex-col space-y-3"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-14 h-16 object-cover border border-[#262630] bg-[#0A0A0C] flex-shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-white truncate">
                      {p.name}
                    </h3>
                    {isOut ? (
                      <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-red-950 text-red-300">
                        Out
                      </span>
                    ) : isLow ? (
                      <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-amber-950 text-amber-300">
                        Low ({p.stock})
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 text-[9px] uppercase tracking-wider font-bold bg-emerald-950 text-emerald-300">
                        {p.stock} units
                      </span>
                    )}
                  </div>

                  <p className="font-mono font-bold text-[#D4AF37] text-sm mt-1">
                    {p.price.toFixed(2)} GHS
                  </p>
                  <p className="text-[11px] text-gray-400">Stock: {p.stock} bottles</p>
                </div>
              </div>

              {/* Action Buttons (44px min tap targets) */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-[#1E1E24]">
                <button
                  type="button"
                  onClick={() => onQuickSale(p.id)}
                  className="min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-amber-300 bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center"
                >
                  Sale
                </button>

                <button
                  type="button"
                  onClick={() => onQuickRestock(p.id)}
                  className="min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center"
                >
                  Restock
                </button>

                <button
                  type="button"
                  onClick={() => onEditProduct(p.id)}
                  className="min-h-[44px] text-[10px] uppercase tracking-wider font-bold text-gray-300 bg-[#1A1A22] border border-[#2D2D38] flex items-center justify-center"
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
