import React from 'react';
import { Breadcrumbs } from '../../components/common/Breadcrumbs';
import { Button } from '../../components/common/Button';
import { useApp } from '../../context/AppContext';
import { PRODUCT_IMAGES } from '../../config/assets';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 text-left">
      <Breadcrumbs items={[{ label: 'Home', route: 'home' }, { label: 'The Atelier' }]} />

      {/* Hero Editorial */}
      <div className="max-w-3xl mb-16">
        <span className="text-xs uppercase tracking-[0.25em] font-semibold text-[#92733C] block mb-2">
          Atelier Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#171512] font-normal tracking-tight leading-[1.12] mb-6">
          The Ghanaian Essence, Elevated to Haute Parfumerie
        </h1>
        <p className="text-base sm:text-lg text-[#716C64] font-light leading-relaxed">
          ZAANISUNG was established to craft extraordinary luxury fragrances that honor the botanical heritage of West Africa through the meticulous lens of classical extraction and slow maceration.
        </p>
      </div>

      {/* Dual Column Image and Philosophy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-20">
        <div className="lg:col-span-7 aspect-16/10 overflow-hidden bg-[#2A241F] rounded-xs border border-[#E4DED3] shadow-xs">
          <img
            src={PRODUCT_IMAGES.atelier_story}
            alt="Artisanal perfume copper alembics and raw resins in Accra atelier"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#92733C] block">
            The Craft
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#171512]">
            Slow Distillation & Maceration
          </h2>
          <p className="text-xs sm:text-sm text-[#716C64] leading-relaxed">
            Our atelier works closely with master perfumers between Accra and Grasse. We isolate single-estate harvests—pure roasted Ghanaian cocoa absolute, aged Volta riverbank vetiver, and delicate savanna neroli petals—aging them in French oak barrels.
          </p>
          <p className="text-xs sm:text-sm text-[#716C64] leading-relaxed">
            Every creation is formulated at an authentic 25%–30% Extrait de Parfum concentration, ensuring an unmistakable olfactory trail and lasting memory on warm skin.
          </p>
        </div>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-[#E4DED3] mb-16">
        <div className="p-6 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs">
          <span className="font-serif text-xl font-bold text-[#B69A59] block mb-2">01</span>
          <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">
            Noble Extraction
          </h3>
          <p className="text-xs text-[#716C64] leading-relaxed">
            We avoid synthetic shortcuts. Our resins and absolutes are cold-extracted and copper-distilled to preserve the nuanced volatile top notes.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs">
          <span className="font-serif text-xl font-bold text-[#B69A59] block mb-2">02</span>
          <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">
            Ghanaian Terroir
          </h3>
          <p className="text-xs text-[#716C64] leading-relaxed">
            From the fertile soils of the Ashanti highlands to coastal breezes in the Central Region, our accords echo the geographic diversity of Ghana.
          </p>
        </div>

        <div className="p-6 bg-[#FFFFFF] border border-[#E4DED3] rounded-xs">
          <span className="font-serif text-xl font-bold text-[#B69A59] block mb-2">03</span>
          <h3 className="font-serif text-lg font-semibold text-[#171512] mb-2">
            Hand-Numbered Flacons
          </h3>
          <p className="text-xs text-[#716C64] leading-relaxed">
            Every bottle is hand-poured, fitted with an Italian atomizer, and hand-inspected in our Accra studio before release to our clientele.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="p-8 sm:p-12 bg-[#171512] text-[#F8F5EF] rounded-xs text-center border border-[#2A241F]">
        <h3 className="font-serif text-2xl sm:text-3xl font-medium mb-3">
          Discover the Collection
        </h3>
        <p className="text-xs sm:text-sm text-[#A8A29E] max-w-md mx-auto mb-6">
          Experience our sovereign fragrance creations with complimentary shipping across Greater Accra.
        </p>
        <Button variant="gold" size="md" onClick={() => navigateTo('catalog')}>
          Explore Fragrance Repertoire
        </Button>
      </div>
    </div>
  );
};
