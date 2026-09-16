import React from "react";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../Button";
import { storyStats } from "./constants";

interface AboutSectionProps {
  onGoToLogin: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onGoToLogin }) => {
  return (
    <section id="about" className="relative overflow-hidden bg-cream dark:bg-black">
      <div className="absolute top-0 inset-x-0 hairline-black" aria-hidden="true" />
      <div className="scene-bg scene-about" aria-hidden="true" />
      <div className="relative z-10 w-full min-h-screen px-4 sm:px-8 lg:px-12 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col justify-center"
        >
          <span className="eyebrow text-gold">Our Story</span>
          <h2 className="font-brand-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-light mt-3 leading-snug text-balance">
            Born in the North.
            <span className="text-gold block mt-1 pb-1">Worn everywhere.</span>
          </h2>
          <p className="mt-6 text-black/70 dark:text-white/75 leading-relaxed max-w-lg">
            Zaanisung is an artisanal fragrance house rooted in Tamale, Ghana.
            We blend rare oils and extracts into bold, long-lasting compositions
            inspired by the warmth of the savanna and the energy of Ghanaian life.
          </p>
          <p className="mt-4 text-black/70 dark:text-white/75 leading-relaxed max-w-lg">
            Every bottle is curated, numbered and finished by hand — a piece of
            Ghana you can wear, to keep and to gift.
          </p>

          <div className="mt-9 grid grid-cols-3 gap-6 max-w-lg">
            {storyStats.map((stat) => (
              <div key={stat.label} className="border-l-2 border-gold pl-4">
                <p className="font-brand-serif text-2xl sm:text-3xl font-light text-ink dark:text-white">
                  {stat.value}
                </p>
                <p className="eyebrow text-black/60 dark:text-white/60 mt-1.5">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <Button variant="primary" size="lg" className="mt-10 w-fit" onClick={onGoToLogin}>
            Shop the Collection <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="surface-glass rounded-xl p-8 sm:p-10 flex flex-col items-center justify-center text-center min-h-[210px] lg:min-h-[240px]"
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold mb-5">
            <Star className="w-5 h-5" />
          </div>
          <h3 className="font-brand-serif text-xl sm:text-2xl font-light text-ink dark:text-white">
            Customer Reviews — Coming Soon
          </h3>
          <p className="mt-3 text-sm text-black/60 dark:text-white/70 leading-relaxed max-w-md">
            We're collecting real, verified feedback from shoppers across Ghana.
            Genuine reviews will appear here soon.
          </p>
        </motion.div>
      </div>
    </section>
  );
};