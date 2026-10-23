import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../../components/storefront/ProductCard';
import { Button } from '../../components/common/Button';
import { ArrowRight, ShieldCheck, Truck, Sparkles, Award } from 'lucide-react';
import { PRODUCT_IMAGES } from '../../config/assets';

export const HomePage: React.FC = () => {
  const { navigateTo, products } = useApp();

  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 4);
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 3);

  return (
    <div className="space-y-24 md:space-y-32 pb-24">
      {/* SECTION 1: EDITORIAL HERO */}
      <section className="relative pt-6 sm:pt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            {/* Left Column: Headline & Intent */}
            <div className="lg:col-span-7 flex flex-col justify-center text-left py-8 sm:py-16">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#92733C] font-semibold mb-6">
                <span>The Ghanaian Haute Parfumerie</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171512] font-normal leading-[1.12] tracking-tight text-balance mb-6">
                Essence of Sovereignty, Crafted in Accra
              </h1>

              <p className="text-base sm:text-lg text-[#716C64] font-light leading-relaxed max-w-xl mb-10 text-balance">
                Rare botanical extractions, single-estate Ashanti cocoa, and aged agarwood resins distilled with classical French technique for discerning wearers.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigateTo('catalog')}
                  rightIcon={<ArrowRight size={16} />}
                >
                  Explore Fragrances
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigateTo('about')}
                >
                  Discover the Atelier
                </Button>
              </div>

              {/* Quiet editorial trust indicators */}
              <div className="mt-14 pt-8 border-t border-[#E4DED3] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="font-serif text-2xl font-semibold text-[#171512] tabular-nums">
                    30%
                  </div>
                  <div className="text-[11px] text-[#716C64] uppercase tracking-wider mt-0.5">
                    Extrait Concentration
                  </div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-semibold text-[#171512] tabular-nums">
                    48h
                  </div>
                  <div className="text-[11px] text-[#716C64] uppercase tracking-wider mt-0.5">
                    Accra Courier Service
                  </div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-semibold text-[#171512] tabular-nums">
                    GHS
                  </div>
                  <div className="text-[11px] text-[#716C64] uppercase tracking-wider mt-0.5">
                    Verified Cedi Pricing
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Anchor */}
            <div className="lg:col-span-5 relative min-h-[420px] lg:min-h-full">
              <div className="relative h-full w-full overflow-hidden bg-[#E8DFD1] border border-[#E4DED3] rounded-xs shadow-sm">
                <img
                  src={PRODUCT_IMAGES.hero_bottle}
                  alt="ZAANISUNG Flacon on travertine stone"
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-left">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#DFCA8E] block mb-1">
                    Signature Creation
                  </span>
                  <h3 className="font-serif text-2xl font-medium tracking-wide">
                    Oud Royale Extrait
                  </h3>
                  <p className="text-xs text-[#E8DFD1] mt-1 font-light">
                    Cambodian Agarwood & Taif Rose
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CURATED COLLECTION GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 pb-4 border-b border-[#E4DED3]">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#92733C] block mb-1">
              Curated Selection
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#171512] font-normal tracking-tight">
              Featured Flacons
            </h2>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('catalog')}
            rightIcon={<ArrowRight size={14} />}
          >
            View Complete Catalog
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 3: EDITORIAL BRAND MOMENT */}
      <section className="bg-[#171512] text-[#F8F5EF] py-20 sm:py-28 my-12 border-y border-[#2A241F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-4/3 overflow-hidden bg-[#2A241F] border border-[#3A352F] rounded-xs">
              <img
                src={PRODUCT_IMAGES.atelier_story}
                alt="Perfumery laboratory copper alembic and glassware in Accra"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="lg:col-span-6 text-left space-y-6">
              <span className="text-xs uppercase tracking-[0.25em] text-[#B69A59] font-semibold block">
                Artisanal Distillation
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal leading-[1.18] text-[#F8F5EF] text-balance">
                Where West African Terroir Meets Haute Parfumerie
              </h2>
              <p className="text-sm sm:text-base text-[#D6D3D1] font-light leading-relaxed">
                ZAANISUNG was conceived to articulate the rich olfactory heritage of Ghana through high-concentration Extraits de Parfum. Each composition balances precious regional harvests—from pure Ashanti single-origin cocoa absolute to Volta water mist—with the most revered resins of the ancient spice roads.
              </p>
              <div className="pt-2">
                <Button
                  variant="gold"
                  size="md"
                  onClick={() => navigateTo('about')}
                  rightIcon={<ArrowRight size={15} />}
                >
                  Read Our Philosophy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: BEST SELLERS & REPERTOIRE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#92733C] block mb-1">
            Private Reserves
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#171512] font-normal tracking-tight mb-3">
            Most Coveted Creations
          </h2>
          <p className="text-xs sm:text-sm text-[#716C64]">
            Celebrated extraits treasured by fragrance connoisseurs in Accra and international collectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* SECTION 5: BRAND REASSURANCE & SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FFFFFF] border border-[#E4DED3] p-8 sm:p-12 rounded-xs shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs text-[#92733C] shrink-0">
                <Truck size={20} />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#171512] mb-1">
                  Ghana Nationwide Delivery
                </h4>
                <p className="text-xs text-[#716C64] leading-relaxed">
                  Complimentary temperature-controlled courier delivery across Greater Accra over GH₵ 1,500. Regional shipping to Kumasi, Takoradi, and Tamale.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs text-[#92733C] shrink-0">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#171512] mb-1">
                  Paystack Encrypted Checkout
                </h4>
                <p className="text-xs text-[#716C64] leading-relaxed">
                  Direct payment processing supporting MTN Mobile Money, Telecel Cash, AT Money, and domestic/international Visa and Mastercard.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FAF8F4] border border-[#E4DED3] rounded-xs text-[#92733C] shrink-0">
                <Sparkles size={20} />
              </div>
              <div>
                <h4 className="font-serif text-base font-semibold text-[#171512] mb-1">
                  Haute Extraction Purity
                </h4>
                <p className="text-xs text-[#716C64] leading-relaxed">
                  Every flacon is hand-numbered and matured for a minimum of twelve weeks to guarantee deep sillage and exceptional longevity on the skin.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
