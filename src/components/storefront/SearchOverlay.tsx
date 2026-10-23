import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { formatGHS } from '../../utils/currency';
import { Search, X, ArrowRight } from 'lucide-react';
import { getProductPlaceholderSvg } from '../../config/assets';

export const SearchOverlay: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, products, navigateTo } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.toLowerCase().trim();
    return products.filter((p) => {
      const matchName = p.name.toLowerCase().includes(q);
      const matchFamily = p.family.toLowerCase().includes(q);
      const matchSubtitle = p.subtitle.toLowerCase().includes(q);
      const allNotes = [
        ...p.notes.top,
        ...p.notes.heart,
        ...p.notes.base,
      ].join(' ').toLowerCase();
      const matchNotes = allNotes.includes(q);
      return matchName || matchFamily || matchSubtitle || matchNotes;
    });
  }, [searchTerm, products]);

  const quickFamilies = [
    'Oud',
    'Amber',
    'Cocoa',
    'Vetiver',
    'Neroli',
    'Rose',
    'Extrait',
  ];

  return (
    <Modal
      isOpen={isSearchOpen}
      onClose={() => setIsSearchOpen(false)}
      maxWidth="lg"
      title="Search the Fragrance Atelier"
      subtitle="Find perfumes by name, olfactory note, or fragrance family"
    >
      <div className="text-left">
        {/* Search input field */}
        <div className="relative mb-5">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Type 'Oud', 'Ghanaian Cocoa', 'Neroli', or 'Amber'..."
            autoFocus
            className="w-full bg-[#FAF8F4] text-[#171512] pl-10 pr-10 py-3 text-base border border-[#E4DED3] focus:border-[#171512] rounded-sm outline-none transition-colors"
          />
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#716C64]" />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#716C64] hover:text-[#171512]"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Quick Suggestion Filters */}
        <div className="flex flex-wrap items-center gap-1.5 mb-6 text-xs text-[#716C64]">
          <span className="uppercase tracking-wider font-semibold mr-1 text-[11px]">Popular Notes:</span>
          {quickFamilies.map((item) => (
            <button
              key={item}
              onClick={() => setSearchTerm(item)}
              className="px-2.5 py-1 bg-[#F0ECE5] hover:bg-[#E4DED3] text-[#171512] rounded-xs transition-colors cursor-pointer"
            >
              {item}
            </button>
          ))}
        </div>

        {/* Results view */}
        {searchTerm.trim() ? (
          <div>
            <div className="flex items-center justify-between text-xs text-[#716C64] mb-3 pb-2 border-b border-[#E4DED3]">
              <span>Results ({filtered.length})</span>
              {filtered.length > 0 && <span>Prices in GHS</span>}
            </div>

            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm text-[#171512] font-medium mb-1">No matching essences found</p>
                <p className="text-xs text-[#716C64]">
                  Try searching for ingredients like &apos;Rose&apos;, &apos;Cedar&apos;, or &apos;Vanilla&apos;
                </p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1">
                {filtered.map((product) => {
                  const fallback = getProductPlaceholderSvg(product.name, product.family);
                  return (
                    <div
                      key={product.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        navigateTo('product-detail', { productId: product.id });
                      }}
                      className="group flex items-center justify-between p-3 bg-[#FAF8F4] hover:bg-[#F0ECE5] border border-[#E4DED3] rounded-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={product.image || fallback}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = fallback;
                          }}
                          className="w-12 h-14 object-cover rounded-xs border border-[#E4DED3] shrink-0"
                        />
                        <div className="min-w-0">
                          <h5 className="font-serif text-sm font-semibold text-[#171512] group-hover:text-[#92733C] transition-colors truncate">
                            {product.name}
                          </h5>
                          <p className="text-[11px] text-[#716C64] truncate">
                            {product.family} · {product.concentration}
                          </p>
                          <p className="text-[10px] text-[#A8A29E] truncate">
                            Notes: {product.notes.top.concat(product.notes.heart).slice(0, 3).join(', ')}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 ml-4">
                        <span className="text-xs font-semibold text-[#171512] tabular-nums">
                          {formatGHS(product.price)}
                        </span>
                        <ArrowRight size={14} className="text-[#A8A29E] group-hover:text-[#171512] transition-colors" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center border-t border-[#E4DED3] text-xs text-[#716C64]">
            Type any perfume name or fragrance note above to begin browsing.
          </div>
        )}
      </div>
    </Modal>
  );
};
