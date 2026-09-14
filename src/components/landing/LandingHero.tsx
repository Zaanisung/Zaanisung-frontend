import React from "react";
import type { ReactNode } from "react";
import { Sparkles, ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../Button";

interface LandingHeroProps {
  showForm: boolean;
  isLoggedIn: boolean;
  onStartShopping: () => void;
  onBrowseShop: () => void;
  onScrollToAuth: () => void;
  authPanel: ReactNode;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  showForm,
  isLoggedIn,
  onStartShopping,
  onBrowseShop,
  onScrollToAuth,
  authPanel,
}) => {
  return (
    <section className="relative overflow-hidden" data-tour="landing-hero">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="scene-bg scene-hero" />
        <div className="orb orb-gold w-[520px] h-[520px] -top-48 -right-36 animate-mist-float" />
        <div className="orb orb-gold-faint w-[420px] h-[420px] -bottom-56 -left-40 animate-mist-drift" />
      </div>

      {/* Soft blend into the next section */}
      <div className="absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-[#fffdf9] sm:from-[#fffdf9] to-transparent dark:from-black/60 dark:sm:from-black/70 pointer-events-none" aria-hidden="true" />

      <div className="relative z-10 w-full max-w-[1440px] mx-auto min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-96px)] px-4 sm:px-8 lg:px-12 py-12 sm:py-20 lg:py-12 grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <span className="inline-flex items-center gap-2 text-gold w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="eyebrow">Maison de Parfum · Tamale</span>
          </span>

          <h1 className="font-brand-serif text-[3.15rem] leading-[0.96] sm:text-6xl lg:text-6xl xl:text-[4.9rem] font-normal tracking-[-0.035em] mt-7 text-balance">
            A scent that
            <span className="text-gold block mt-1 pb-1 italic">stays with you.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-black/70 dark:text-white/80 leading-relaxed max-w-xl">
            Extrait perfumes made in Tamale for the moments people remember. Bold,
            long-lasting, and entirely your own.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button variant="primary" size="lg" onClick={onBrowseShop}>
              Explore fragrances <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
            {showForm ? <Button variant="ghost" size="lg" onClick={onScrollToAuth}>Create an account</Button> : <Button variant="ghost" size="lg" onClick={onStartShopping}>{isLoggedIn ? "My account" : "Continue shopping"}</Button>}
          </div>
        </motion.div>

        {authPanel}
      </div>

      {/* Scroll hint */}
      <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-black/40 dark:text-white/40 animate-bounce pointer-events-none">
        <span className="eyebrow text-[0.5625rem]">Scroll</span>
        <ArrowDown className="w-3.5 h-3.5" />
      </div>
    </section>
  );
};
