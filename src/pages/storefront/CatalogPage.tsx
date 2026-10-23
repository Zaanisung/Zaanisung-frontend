import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/storefront/ProductCard';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { Select } from '../../components/common/Select';
import { filterProducts, ProductFilters } from '../../utils/inventory';
import { SlidersHorizontal, RotateCcw, Search } from 'lucide-react';

export const CatalogPage: React.FC = () => {
  const { products, routeParams } = useApp();

  const [familyFilter, setFamilyFilter] = useState<string>(routeParams.family || 'All');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'name-asc'>('featured');
  const [catalogSearch, setCatalogSearch] = useState<string>('');

  const families = [
    'All',
    'Woody & Oriental',
    'Amber & Warm',
    'Fresh & Citrus',
    'Floral & Delicate',
    'Gourmand & Spice',
  ];

  const filteredProducts = useMemo(() => {
    const filters: ProductFilters = {
      family: familyFilter,
      onlyInStock: inStockOnly,
      sortBy: sortBy,
      searchQuery: catalogSearch,
    };
    return filterProducts(products, filters);
  }, [products, familyFilter, inStockOnly, sortBy, catalogSearch]);

  const resetFilters = () => {
    setFamilyFilter('All');
    setInStockOnly(false);
    setSortBy('featured');
    setCatalogSearch('');
  };

  const hasActiveFilters = familyFilter !== 'All' || inStockOnly || catalogSearch !== '' || sortBy !== 'featured';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left">
      <Breadcrumbs
        items={[
          { label: 'Home', route: 'home' },
          { label: 'Fragrance Catalog' },
        ]}
      />

      {/* Header and Intro */}
      <div className="mb-10 pb-6 border-b border-[#E4DED3]">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#92733C] block mb-1">
              Atelier Archive
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl text-[#171512] font-normal tracking-tight">
              The Fragrance Repertoire
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#716C64] max-w-md font-light">
            Every creation is matured in small barrels and bottled by hand in Accra. All prices listed in Ghanaian Cedis (GHS).
          </p>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-[#FFFFFF] border border-[#E4DED3] p-4 sm:p-5 rounded-xs mb-8 shadow-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search within catalog */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={catalogSearch}
              onChange={(e) => setCatalogSearch(e.target.value)}
              placeholder="Search by note (e.g. Amber, Rose, Cocoa)..."
              className="w-full bg-[#FAF8F4] text-[#171512] pl-9 pr-4 py-2 text-xs border border-[#E4DED3] rounded-xs focus:border-[#171512] outline-none"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#716C64]" />
          </div>

          {/* Interactive Filter Controls (compliant with Zero-Pill rule: segmented button group) */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 overflow-x-auto py-1 max-w-full">
              {families.map((fam) => (
                <button
                  key={fam}
                  onClick={() => setFamilyFilter(fam)}
                  className={`text-xs px-3 py-1.5 rounded-xs transition-colors whitespace-nowrap cursor-pointer ${
                    familyFilter === fam
                      ? 'bg-[#171512] text-[#F8F5EF] font-medium'
                      : 'bg-[#F0ECE5] text-[#716C64] hover:text-[#171512] hover:bg-[#E4DED3]'
                  }`}
                >
                  {fam}
                </button>
              ))}
            </div>

            {/* In Stock toggle */}
            <label className="flex items-center gap-2 text-xs text-[#171512] ml-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="w-3.5 h-3.5 rounded-xs border-[#E4DED3] text-[#B69A59] focus:ring-[#B69A59]"
              />
              <span>In Stock Only</span>
            </label>
          </div>

          {/* Sort dropdown */}
          <div className="w-full sm:w-48 shrink-0">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              options={[
                { value: 'featured', label: 'Featured Reserve' },
                { value: 'price-asc', label: 'Price: Low to High' },
                { value: 'price-desc', label: 'Price: High to Low' },
                { value: 'name-asc', label: 'Alphabetical' },
              ]}
            />
          </div>
        </div>

        {/* Active Filter Summary and Reset */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-[#E4DED3]/60 flex items-center justify-between text-xs text-[#716C64]">
            <div className="flex items-center gap-2">
              <span>Showing {filteredProducts.length} of {products.length} creations</span>
              {familyFilter !== 'All' && <span>· Family: {familyFilter}</span>}
              {inStockOnly && <span>· In stock only</span>}
              {catalogSearch && <span>· Query: &quot;{catalogSearch}&quot;</span>}
            </div>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1 text-xs text-[#92733C] hover:text-[#171512] cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="py-20 text-center bg-[#FFFFFF] border border-[#E4DED3] rounded-xs p-8">
          <div className="w-12 h-12 rounded-full bg-[#F0ECE5] flex items-center justify-center text-[#716C64] mx-auto mb-3">
            <SlidersHorizontal size={20} />
          </div>
          <h3 className="font-serif text-xl font-medium text-[#171512] mb-1">
            No Fragrances Match Your Filter Criteria
          </h3>
          <p className="text-xs text-[#716C64] max-w-md mx-auto mb-6">
            We currently have no creations matching the selected olfactory notes or criteria. Try resetting filters to explore the full repertoire.
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
