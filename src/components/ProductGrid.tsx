import React, { useState, useMemo } from "react";
import { Product } from "../types";
import { ProductCard } from "./ProductCard";
import { SearchInput } from "./ui/SearchInput";
import { Loader } from "./ui/Loader";
import { AlertCircle, LayoutGrid, Square } from "lucide-react";
import { cn } from "../utils/cn";

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
  const [mobileLayout, setMobileLayout] = useState<"grid" | "showcase">("showcase");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        if (!p.name.toLowerCase().includes(q)) return false;
      }

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
    <div className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 border-b border-black/10 dark:border-white/10 pb-6">
        <div>
          <span className="eyebrow text-gold">The Collection</span>
          <h2 className="font-brand-serif text-3xl sm:text-4xl md:text-[2.75rem] font-light leading-tight text-ink dark:text-white mt-2">
            Curated Fragrances
          </h2>
          <p className="text-[11px] uppercase tracking-[0.2em] text-black/50 dark:text-white/55 mt-2 font-semibold">
            Handcrafted artisanal scents & rare ouds
          </p>
        </div>

        {/* Search */}
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search fragrance name..."
          ariaLabel="Search perfumes"
          className="w-full lg:w-80"
        />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none flex-1">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setActiveFilter(opt.id)}
              className={cn(
                "min-h-[40px] px-4 py-1.5 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-all border rounded-full",
                activeFilter === opt.id
                  ? "bg-ink text-cream border-ink dark:bg-gold dark:text-ink dark:border-gold"
                  : "bg-white/60 dark:bg-white/[0.05] text-black/60 dark:text-white/65 border-black/15 dark:border-white/15 hover:border-gold hover:text-ink dark:hover:text-white"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Mobile layout toggle */}
        <div className="flex items-center gap-1 bg-white/60 dark:bg-white/[0.08] p-1 border border-black/15 dark:border-white/15 sm:hidden flex-shrink-0 rounded-full">
          <button
            type="button"
            onClick={() => setMobileLayout("grid")}
            className={cn(
              "p-2 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors rounded-full",
              mobileLayout === "grid" ? "bg-ink text-cream dark:bg-white dark:text-ink" : "text-black/45 dark:text-white/45"
            )}
            title="Compact Grid"
            aria-label="Compact grid view"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setMobileLayout("showcase")}
            className={cn(
              "p-2 min-h-[36px] min-w-[36px] flex items-center justify-center transition-colors rounded-full",
              mobileLayout === "showcase" ? "bg-ink text-cream dark:bg-white dark:text-ink" : "text-black/45 dark:text-white/45"
            )}
            title="Large Cards"
            aria-label="Large cards view"
          >
            <Square className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between text-xs text-black/50 dark:text-white/60 -mt-1">
        <span>
          Showing{" "}
          <strong className="text-ink dark:text-white">
            {filteredProducts.length}
          </strong>{" "}
          {filteredProducts.length === 1 ? "perfume" : "perfumes"}
        </span>
        {activeFilter !== "ALL" && (
          <button
            type="button"
            onClick={() => setActiveFilter("ALL")}
            className="text-gold hover:underline uppercase text-[10px] tracking-wider font-bold"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="py-24 flex items-center justify-center">
          <Loader variant="circles" size="lg" />
        </div>
      ) : error ? (
        <div className="py-16 flex items-center justify-center">
          <div className="relative overflow-hidden w-full max-w-md mx-auto px-6 py-12 surface-glass-strong rounded-2xl text-center flex flex-col items-center shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
            <div className="w-12 h-12 rounded-xl surface-glass-tint flex items-center justify-center text-gold mb-4 border border-gold/40">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-black/70 dark:text-white/70 font-medium mb-5">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="min-h-[44px] px-6 py-2.5 text-[11px] uppercase tracking-widest font-bold bg-ink dark:bg-white text-white dark:text-ink hover:bg-gold hover:text-ink transition-colors rounded-lg"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 flex items-center justify-center">
          <div className="relative overflow-hidden w-full max-w-md mx-auto px-6 py-14 surface-glass-strong rounded-2xl text-center flex flex-col items-center shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
            <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
            <div className="absolute -bottom-20 -left-20 w-56 h-56 orb orb-gold-faint animate-mist-pulse" aria-hidden="true"></div>
            <div className="relative w-12 h-12 rounded-xl border border-gold/40 surface-glass-tint flex items-center justify-center text-gold mb-4">
              <span className="font-brand-serif text-xl font-light">Z</span>
            </div>
            <h3 className="relative font-brand-serif text-lg font-normal text-ink dark:text-white mb-1">
              {searchQuery || activeFilter !== "ALL"
                ? "No matching fragrances found"
                : "No perfumes available yet."}
            </h3>
            <p className="relative text-xs text-black/50 dark:text-white/50 mb-6">
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
                className="relative min-h-[44px] px-6 py-2.5 text-[11px] uppercase tracking-widest font-bold border border-ink dark:border-white text-ink dark:text-white hover:bg-ink hover:text-cream dark:hover:bg-white dark:hover:text-ink transition-colors rounded-lg"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "grid gap-4 sm:gap-6",
            mobileLayout === "showcase"
              ? "grid-cols-1 min-[520px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          )}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onAddToCart={onAddToCart}
              isAdded={recentlyAddedId === product.id}
              compact={mobileLayout === "grid"}
            />
          ))}
        </div>
      )}
    </div>
  );
};