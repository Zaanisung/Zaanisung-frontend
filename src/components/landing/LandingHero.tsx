import React from "react";
import type { ReactNode } from "react";
import { Sparkles, ArrowRight, ArrowDown } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../Button";
import { trustBadges } from "./constants";

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
    <section className="relative overflow-hidden">
      {/* Ambient backdrop */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 lux-grid lux-grid-fade" />
        <div className="orb orb-gold-strong w-[520px] h-[520px] -top-40 -right-32" />
        <div className="orb orb-gold w-[460px] h-[460px] -bottom-48 -left-40" />
        <div className="orb orb-ink w-[380px] h-[380px] top-1/3 left-1/2 -translate-x-1/2" />
      </div>

      <div className="relative w-full min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-96px)] px-4 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-12 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col justify-center"
        >
          <span className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 text-gold px-3 py-1.5 w-fit">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="eyebrow">Maison de Parfum · Tamale</span>
          </span>

          <h1 className="font-brand-serif text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-6xl xl:text-[4.75rem] font-light tracking-tight mt-7 text-balance">
            Fragrance that
            <span className="gold-gradient-text italic block mt-1 pb-1">endures.</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-black/60 dark:text-white/60 leading-relaxed max-w-xl">
            Hand-crafted in Tamale, Ghana. Zaanisung bottles bold, long-lasting
            scent that moves with you — from the market to the metropolis.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {showForm ? (
              <Button variant="primary" size="lg" onClick={onScrollToAuth}>
                Create Your Account <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            ) : (
              <Button variant="primary" size="lg" onClick={onStartShopping}>
                {isLoggedIn ? "Continue to Store" : "Start Shopping"} <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
            <Button variant="ghost" size="lg" onClick={onBrowseShop}>
              Explore Collections
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 max-w-xl grid grid-cols-3 divide-x divide-black/10 dark:divide-white/10">
            {trustBadges.map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex flex-col items-center sm:items-start px-2 first:pl-0 sm:px-4 sm:first:pl-0">
                  <div className="w-9 h-9 border border-gold/40 bg-gold/10 flex items-center justify-center mb-2.5">
                    <Icon className="w-4 h-4 text-gold" />
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink dark:text-white">
                    {badge.label}
                  </p>
                  <p className="text-[10px] text-black/50 dark:text-white/55 mt-0.5">
                    {badge.sub}
                  </p>
                </div>
              );
            })}
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