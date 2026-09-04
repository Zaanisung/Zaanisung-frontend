import React, { useState, useMemo } from "react";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { Search, X, AlertCircle, LayoutGrid, Square } from "lucide-react";

export interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  recentlyAddedId?: string | null;
}

type PriceFilter = "ALL" | "UNDER_400" | "400_450" | "OVER_450" | "IN_STOCK";

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  error = null,
  onRetry,
  onSelectProduct,
  onAddToCart,
  recentlyAddedId,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<PriceFilter>("ALL");
  const [mobileLayout, setMobileLayout] = useState<"grid" | "showcase">("grid");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches = p.name.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Filter chips
      if (activeFilter === "UNDER_400") return p.price < 400;
      if (activeFilter === "400_450") return p.price >= 400 && p.price <= 450;
      if (activeFilter === "OVER_450") return p.price > 450;
      if (activeFilter === "IN_STOCK") return p.stock > 0;

      return true;
    });
  }, [products, searchQuery, activeFilter]);

  const filterOptions: { id: PriceFilter; label: string }[] = [
    { id: "ALL", label: "All Perfumes" },
    { id: "IN_STOCK", label: "In Stock" },
    { id: "UNDER_400", label: "Under 400 GHS" },
    { id: "400_450", label: "400 - 450 GHS" },
    { id: "OVER_450", label: "450+ GHS" },
  ];

  return (
    <div className="w-full flex flex-col gap-5 sm:gap-6">
      {/* Mobile-First Fluid Header & Search */}
      <div className="flex flex-col gap-4 border-b border-gray-200 dark:border-[#22222A] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
          <div>
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-light tracking-tight text-gray-900 dark:text-gray-100"
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
              Curated Fragrances
            </h2>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#D4AF37] mt-1 font-semibold">
              Handcrafted Artisanal Scents & Rare Ouds
            </p>
          </div>

          {/* Search bar - Fluid & touch accessible */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search fragrance name..."
              className="w-full pl-9 pr-9 py-2.5 text-sm bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#262632] text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] dark:focus:border-[#D4AF37] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-black dark:hover:text-white"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills & Mobile View Toggle */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Horizontally scrolling quick-filter pills (no scrollbar) */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none flex-1">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setActiveFilter(opt.id)}
                className={`min-h-[36px] px-3.5 py-1.5 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all border ${
                  activeFilter === opt.id
                    ? "bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-xs"
                    : "bg-white dark:bg-[#15151A] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-[#282832] hover:border-black dark:hover:border-white"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Mobile Display Toggle: 2-col vs 1-col large showcase */}
          <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#17171F] p-1 border border-gray-200 dark:border-[#262632] sm:hidden flex-shrink-0">
            <button
              type="button"
              onClick={() => setMobileLayout("grid")}
              className={`p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors ${
                mobileLayout === "grid"
                  ? "bg-white dark:bg-[#252530] text-black dark:text-white shadow-xs"
                  : "text-gray-400"
              }`}
              title="2 Columns"
              aria-label="2 Columns grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setMobileLayout("showcase")}
              className={`p-1.5 min-h-[32px] min-w-[32px] flex items-center justify-center transition-colors ${
                mobileLayout === "showcase"
                  ? "bg-white dark:bg-[#252530] text-black dark:text-white shadow-xs"
                  : "text-gray-400"
              }`}
              title="Large Showcase"
              aria-label="Large Showcase view"
            >
              <Square className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results summary counter */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            Showing <strong className="text-gray-900 dark:text-gray-100">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? "perfume" : "perfumes"}
          </span>
          {activeFilter !== "ALL" && (
            <button
              type="button"
              onClick={() => setActiveFilter("ALL")}
              className="text-[#D4AF37] hover:underline uppercase text-[10px] tracking-wider font-bold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent animate-spin mb-4"></div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-widest">
            Loading perfumes...
          </p>
        </div>
      ) : error ? (
        <div className="p-8 bg-white dark:bg-[#141418] border border-red-200 dark:border-red-900/50 text-center max-w-md mx-auto my-8">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-sm text-red-700 dark:text-red-400 font-medium mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="min-h-[44px] px-6 py-2 text-[11px] uppercase tracking-widest font-bold bg-black dark:bg-white text-white dark:text-black hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] hover:text-black transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 px-6 bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] text-center flex flex-col items-center max-w-md mx-auto">
          <div className="w-12 h-12 border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] mb-4">
            <span className="text-xl font-light" style={{ fontFamily: "Georgia, serif" }}>Z</span>
          </div>
          <h3
            className="text-lg font-normal text-gray-900 dark:text-gray-100 mb-1"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            {searchQuery || activeFilter !== "ALL"
              ? "No matching fragrances found"
              : "No perfumes available yet."}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-6">
            {searchQuery || activeFilter !== "ALL"
              ? "Try adjusting your search terms or filter selection."
              : "New handcrafted batches are being prepared in our workshop."}
          </p>
          {(searchQuery || activeFilter !== "ALL") && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("ALL");
              }}
              className="min-h-[44px] px-6 py-2.5 text-[11px] uppercase tracking-widest font-bold border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : (
        /* Mobile-First Fluid Grid: Adapts based on mobile toggle & viewport */
        <div
          className={`grid gap-4 sm:gap-6 ${
            mobileLayout === "showcase"
              ? "grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          }`}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
              isAdded={recentlyAddedId === product.id}
            />
          ))}
        </div>
      )}
    </div>
  );
};
