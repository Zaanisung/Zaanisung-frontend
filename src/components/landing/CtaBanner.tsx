import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../Button";

interface CtaBannerProps {
  showForm: boolean;
  isLoggedIn: boolean;
  onStartShopping: () => void;
  onBrowseShop: () => void;
  onScrollToAuth: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({
  showForm,
  isLoggedIn,
  onStartShopping,
  onBrowseShop,
  onScrollToAuth,
}) => {
  return (
    <section className="relative overflow-hidden bg-cream dark:bg-black">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="scene-bg scene-cta" />
      </div>

      <div className="relative z-10 w-full min-h-screen px-4 sm:px-8 lg:px-12 py-20 sm:py-24 text-center flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="surface-glass-strong rounded-2xl max-w-4xl mx-auto px-6 sm:px-14 py-14 sm:py-16 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]"
        >
          <span className="eyebrow text-gold">Begin your ritual</span>
          <h2 className="font-brand-serif text-3xl sm:text-5xl font-light leading-tight mt-4 text-balance">
            Ready to find your signature scent?
          </h2>
          <p className="mt-5 text-black/60 dark:text-white/60 max-w-xl mx-auto">
            Create a free account to browse, save and order our exclusive
            collection — delivered anywhere in Ghana.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            {showForm ? (
              <Button variant="primary" size="lg" onClick={onScrollToAuth}>
                Join Zaanisung <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={onStartShopping}>
                {isLoggedIn ? "Continue to Store" : "Start Shopping"} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
            <Button variant="outline" size="lg" onClick={onBrowseShop}>
              Browse Without Joining
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};