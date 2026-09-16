import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Product } from "../../types";
import { Carousel } from "../Carousel";
import { ProductCard } from "../ProductCard";

interface CollectionSectionProps {
  products: Product[];
  isLoadingProducts: boolean;
  recentlyAddedId?: string | null;
  onBrowseShop: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
}

export const CollectionSection: React.FC<CollectionSectionProps> = ({
  products,
  isLoadingProducts,
  recentlyAddedId,
  onBrowseShop,
  onSelectProduct,
  onAddToCart,
}) => {
  const featured = products.slice(0, 8);

  return (
    <section id="collections" className="relative bg-white dark:bg-black">
      <div className="absolute top-0 inset-x-0 hairline-black" aria-hidden="true" />
      <div className="scene-bg scene-collections" aria-hidden="true" />
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-center py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 px-4 sm:px-8 lg:px-12"
        >
          <div>
            <span className="eyebrow text-gold">Selected for you</span>
            <h2 className="font-brand-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-light mt-3 text-balance">
              Signature Collection
            </h2>
            <p className="text-sm text-black/70 dark:text-white/75 mt-2 max-w-md">
              Our most requested extraits — each bottle numbered, each batch finished by hand.
            </p>
          </div>
          <button
            type="button"
            onClick={onBrowseShop}
            className="group text-xs uppercase tracking-widest font-semibold text-black/75 dark:text-white/75 hover:text-gold transition-colors min-h-[44px] inline-flex items-center gap-2 w-fit"
          >
            View All
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {isLoadingProducts ? (
          <div className="relative flex gap-5 overflow-hidden pl-4 sm:pl-8 lg:pl-12 pr-4 sm:pr-8 lg:pr-12">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[86%] min-[460px]:w-[46%] md:w-[31%] aspect-square animate-pulse bg-black/5 dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-2xl" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-sm text-black/45 dark:text-white/45 py-10 border border-dashed border-black/15 dark:border-white/15 p-6 max-w-md rounded-2xl mx-4 sm:mx-8 lg:mx-12">
            New fragrances are being prepared. Check back soon.
          </p>
        ) : (
          <div className="relative px-4 sm:px-8 lg:px-12">
            {/* Soft edge merges so cards glide off the screen instead of hard-clipping */}
            <div
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 sm:w-14 lg:w-20 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-black dark:via-black/80"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 sm:w-14 lg:w-20 bg-gradient-to-l from-white via-white/80 to-transparent dark:from-black dark:via-black/80"
              aria-hidden="true"
            />
            <Carousel
              items={featured}
              keyExtractor={(p) => p.id}
              renderItem={(product, index) => (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: Math.min(index, 3) * 0.06 }}
                  className="h-full"
                >
                  <ProductCard
                    product={product}
                    onSelect={onSelectProduct}
                    onAddToCart={onAddToCart}
                    isAdded={recentlyAddedId === product.id}
                  />
                </motion.div>
              )}
              ariaLabel="Signature collection carousel"
            />
          </div>
        )}
      </div>
    </section>
  );
};