import React from "react";
import { ArrowRight, Star } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../Button";
import { cn } from "../../utils/cn";
import { storyStats, testimonials } from "./constants";

interface AboutSectionProps {
  onGoToLogin: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onGoToLogin }) => {
  return (
    <section id="about" className="relative bg-cream dark:bg-black">
      <div className="absolute top-0 inset-x-0 hairline-black" aria-hidden="true" />
      <div className="scene-bg scene-about" aria-hidden="true" />
      <div className="relative z-10 w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
          className="grid grid-cols-2 gap-4 sm:gap-5 auto-rows-fr"
        >
          {testimonials.map((t, i) => (
            <div
              key={i}
              className={cn(
                "surface-glass rounded-xl p-6 sm:p-7 flex flex-col justify-center min-h-[210px] lg:min-h-[240px] transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-1",
                i % 2 === 1 && "lg:translate-y-8 lg:hover:translate-y-7"
              )}
            >
              <div className="flex items-center gap-0.5 text-gold mb-3">
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="font-brand-serif text-sm sm:text-[0.9375rem] text-ink/85 dark:text-white/85 leading-relaxed">
                "{t.q}"
              </p>
              <p className="mt-5 text-xs text-black/45 dark:text-white/45">
                — <span className="text-ink dark:text-white font-semibold">{t.a}</span>, {t.role}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};