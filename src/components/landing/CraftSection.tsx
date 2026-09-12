import React from "react";
import { motion } from "motion/react";
import { craftFeatures } from "./constants";

export const CraftSection: React.FC = () => {
  return (
    <section id="craft" className="relative bg-white dark:bg-black">
      <div className="absolute top-0 inset-x-0 hairline-black" aria-hidden="true" />
      <div className="scene-bg scene-craft" aria-hidden="true" />
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-14"
        >
          <span className="eyebrow text-gold">The Craft</span>
          <h2 className="font-brand-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-light mt-3">
            Why Zaanisung
          </h2>
          <p className="mt-4 text-black/70 dark:text-white/75 max-w-xl mx-auto">
            Everything we do is designed around a single promise — scent that
            lasts as long as the memory you make with it.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {craftFeatures.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="surface-glass rounded-xl group p-7 sm:p-8 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] lg:min-h-[300px] flex flex-col justify-center hover:-translate-y-1.5 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_12px_40px_-10px_rgba(212,175,55,0.35),0_6px_20px_-6px_rgba(212,175,55,0.25)]"
              >
                <div className="w-12 h-12 flex items-center justify-center border border-gold/40 bg-gold/10 mb-6 group-hover:bg-gold/15 transition-colors rounded-xl">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="font-brand-serif text-lg font-medium tracking-wide text-ink dark:text-white">
                  {f.title}
                </h3>
                <p className="text-sm sm:text-base text-black/60 dark:text-white/60 mt-2.5 leading-relaxed">
                  {f.text}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};