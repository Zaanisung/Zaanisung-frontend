import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { formatGHS } from '../../utils/currency';
import { getStockStatus } from '../../utils/inventory';
import { getProductPlaceholderSvg } from '../../config/assets';
import { Plus, Minus, ShoppingBag, ShieldCheck, Truck, Sparkles, Check } from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { selectedProduct, addToCart, navigateTo, products } = useApp();

  // If no product selected, default to first product
  const product = selectedProduct || products[0];

  const [selectedSize, setSelectedSize] = useState<'50ml' | '100ml' | '200ml'>('100ml');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="font-serif text-2xl">Product not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigateTo('catalog')}>
          Return to Catalog
        </Button>
      </div>
    );
  }

  const currentVariant = product.sizes.find((s) => s.size === selectedSize) || product.sizes[0] || {
    size: selectedSize,
    price: product.price,
    stock: product.stock,
  };

  const isOutOfStock = currentVariant.stock <= 0;
  const stockStatus = getStockStatus(currentVariant.stock);

  const images = [
    product.image,
    product.secondaryImage || product.image,
  ].filter(Boolean);

  const fallbackSvg = getProductPlaceholderSvg(product.name, product.family);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    addToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 text-left">
      <Breadcrumbs
        items={[
          { label: 'Home', route: 'home' },
          { label: 'Catalog', route: 'catalog' },
          { label: product.family, route: 'catalog', params: { family: product.family } },
          { label: product.name },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: PRODUCT GALLERY */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative aspect-4/5 w-full overflow-hidden bg-[#F0ECE5] border border-[#E4DED3] rounded-xs shadow-xs">
            <img
              src={imageError ? fallbackSvg : images[activeImageIndex] || fallbackSvg}
              alt={`${product.name} flacon`}
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="h-full w-full object-cover object-center transition-all duration-300"
            />
            {isOutOfStock && (
              <div className="absolute inset-0 bg-[#FAF8F4]/80 backdrop-blur-xs flex items-center justify-center p-6">
                <span className="font-serif text-lg tracking-widest uppercase text-[#716C64] border-b border-[#716C64] pb-1">
                  Allocation Exhausted
                </span>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-24 overflow-hidden rounded-xs border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-[#B69A59]' : 'border-[#E4DED3] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`View ${idx + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          {/* Olfactory Notes Architecture */}
          <div className="mt-12 pt-8 border-t border-[#E4DED3]">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#92733C] block mb-4">
              Olfactory Architecture
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Top Notes */}
              <div className="p-4 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#716C64] block mb-2">
                  01 · Top Notes
                </span>
                <ul className="text-xs text-[#171512] space-y-1 font-medium">
                  {product.notes.top.map((n) => (
                    <li key={n}>— {n}</li>
                  ))}
                </ul>
              </div>

              {/* Heart Notes */}
              <div className="p-4 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#716C64] block mb-2">
                  02 · Heart Notes
                </span>
                <ul className="text-xs text-[#171512] space-y-1 font-medium">
                  {product.notes.heart.map((n) => (
                    <li key={n}>— {n}</li>
                  ))}
                </ul>
              </div>

              {/* Base Notes */}
              <div className="p-4 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#716C64] block mb-2">
                  03 · Base Notes
                </span>
                <ul className="text-xs text-[#171512] space-y-1 font-medium">
                  {product.notes.base.map((n) => (
                    <li key={n}>— {n}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CONTIGUOUS PURCHASE MODULE */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
          <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 sm:p-8 rounded-xs shadow-xs">
            {/* Metadata Header */}
            <div className="flex items-center justify-between text-xs text-[#716C64] mb-2 uppercase tracking-wider">
              <span>{product.brand} · {product.concentration}</span>
              <StatusBadge status={stockStatus} type="stock" />
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl text-[#171512] font-medium tracking-tight mb-2">
              {product.name}
            </h1>

            <p className="text-xs text-[#716C64] font-light leading-relaxed mb-6">
              {product.subtitle}
            </p>

            {/* Price display in Tabular Numbers */}
            <div className="pb-6 mb-6 border-b border-[#E4DED3] flex items-baseline gap-3">
              <span className="font-serif text-3xl font-semibold text-[#171512] tabular-nums">
                {formatGHS(currentVariant.price)}
              </span>
              <span className="text-xs text-[#716C64]">
                Incl. taxes & delivery eligibility
              </span>
            </div>

            {/* Size Variant Selector */}
            <div className="mb-6">
              <label className="block text-xs uppercase tracking-wider font-semibold text-[#716C64] mb-2.5">
                Flacon Volume: <span className="text-[#171512] font-bold">{selectedSize}</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {product.sizes.map((v) => {
                  const isSelected = selectedSize === v.size;
                  return (
                    <button
                      key={v.size}
                      onClick={() => setSelectedSize(v.size)}
                      className={`p-2.5 border text-center transition-all cursor-pointer rounded-xs ${
                        isSelected
                          ? 'border-[#171512] bg-[#171512] text-[#F8F5EF]'
                          : 'border-[#E4DED3] bg-[#FAF8F4] text-[#171512] hover:border-[#171512]'
                      }`}
                    >
                      <div className="text-xs font-semibold">{v.size}</div>
                      <div className="text-[11px] tabular-nums mt-0.5 opacity-80">
                        {formatGHS(v.price, false)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity and Primary Buy CTA */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-wider text-[#716C64] font-semibold w-20">
                  Quantity:
                </span>
                <div className="flex items-center border border-[#E4DED3] rounded-xs bg-[#FAF8F4]">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    aria-label="Decrease quantity"
                    className="p-2 text-[#716C64] hover:text-[#171512] disabled:opacity-40 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="px-4 text-xs font-semibold tabular-nums text-[#171512]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= currentVariant.stock || isOutOfStock}
                    aria-label="Increase quantity"
                    className="p-2 text-[#716C64] hover:text-[#171512] disabled:opacity-40 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
                <span className="text-xs text-[#716C64]">
                  ({currentVariant.stock} flacons remaining)
                </span>
              </div>

              <Button
                variant={isOutOfStock ? 'secondary' : 'gold'}
                size="lg"
                fullWidth
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                leftIcon={addedAnimation ? <Check size={18} /> : <ShoppingBag size={18} />}
              >
                {isOutOfStock
                  ? 'Reserve Allocation Exhausted'
                  : addedAnimation
                  ? 'Added to Flacon Bag'
                  : `Add to Flacon · ${formatGHS(currentVariant.price * quantity)}`}
              </Button>
            </div>

            {/* Reassurance list */}
            <div className="pt-6 border-t border-[#E4DED3] space-y-2 text-xs text-[#716C64]">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#92733C] shrink-0" />
                <span>Complimentary white-glove Accra delivery over GH₵ 1,500</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-[#92733C] shrink-0" />
                <span>100% genuine formulation sealed with tamper-proof seal</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#92733C] shrink-0" />
                <span>Includes 2ml complimentary discovery sample of choice</span>
              </div>
            </div>
          </div>

          {/* Description & Story */}
          <div className="bg-[#FFFFFF] border border-[#E4DED3] p-6 rounded-xs shadow-xs text-left">
            <h4 className="font-serif text-lg font-semibold text-[#171512] mb-2">The Creation Story</h4>
            <p className="text-xs text-[#716C64] leading-relaxed mb-4">
              {product.description}
            </p>
            {product.story && (
              <p className="text-xs text-[#92733C] italic leading-relaxed border-l-2 border-[#B69A59] pl-3 py-1">
                &ldquo;{product.story}&rdquo;
              </p>
            )}
          </div>

          {/* Sillage & Application Ritual Guide */}
          <div className="bg-[#FAF8F4] border border-[#E4DED3] p-6 rounded-xs text-left space-y-3">
            <h4 className="font-serif text-base font-semibold text-[#171512]">
              Sillage & Application Ritual
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs text-[#716C64]">
              <div>
                <span className="font-semibold text-[#171512] block">Longevity</span>
                <span>12–16 Hours on Skin</span>
              </div>
              <div>
                <span className="font-semibold text-[#171512] block">Sillage Aura</span>
                <span>Intense & Sovereign</span>
              </div>
            </div>
            <p className="text-[11px] text-[#716C64] pt-2 border-t border-[#E4DED3]/60 leading-relaxed">
              Warm 1–2 sprays between the inner wrists without rubbing, then press gently to the carotid pulse points and nape of the neck.
            </p>
          </div>
        </div>
      </div>

      {/* COMPLEMENTARY CREATIONS SECTION */}
      <div className="mt-20 pt-12 border-t border-[#E4DED3]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#92733C] block mb-1">
              Atelier Pairings
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#171512] font-semibold">
              Complementary Repertoire
            </h3>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('catalog')}
          >
            View All Creations
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {products
            .filter((p) => p.id !== product.id)
            .slice(0, 3)
            .map((related) => {
              const relFallback = getProductPlaceholderSvg(related.name, related.family);
              return (
                <div
                  key={related.id}
                  onClick={() => navigateTo('product-detail', { productId: related.id })}
                  className="group bg-[#FFFFFF] border border-[#E4DED3] rounded-xs overflow-hidden cursor-pointer hover:border-[#171512] transition-all p-4 flex flex-col justify-between"
                >
                  <div className="relative aspect-4/5 overflow-hidden bg-[#F0ECE5] rounded-xs mb-3">
                    <img
                      src={related.image || relFallback}
                      alt={related.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#716C64] block">
                      {related.family}
                    </span>
                    <h5 className="font-serif text-base font-semibold text-[#171512] group-hover:text-[#92733C] transition-colors">
                      {related.name}
                    </h5>
                    <p className="text-xs font-semibold text-[#171512] tabular-nums mt-1">
                      {formatGHS(related.price)}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
