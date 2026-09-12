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
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
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
          <div className="flex gap-5 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[74%] min-[480px]:w-[46%] md:w-[31%] aspect-[4/3] animate-pulse bg-black/5 dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-2xl" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-sm text-black/45 dark:text-white/45 py-10 border border-dashed border-black/15 dark:border-white/15 p-6 max-w-md rounded-2xl">
            New fragrances are being prepared. Check back soon.
          </p>
        ) : (
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
        )}
      </div>
    </section>
  );
};