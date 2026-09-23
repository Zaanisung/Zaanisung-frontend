import React from "react";
import { ArrowRight, MapPin, Phone, Mail, BadgeCheck } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "../Button";
import { storyStats } from "./constants";

interface AboutSectionProps {
  onGoToLogin: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onGoToLogin }) => {
  return (
    <section id="about" className="relative overflow-hidden bg-cream dark:bg-black">
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
          className="surface-glass rounded-xl p-8 sm:p-10 flex flex-col items-start justify-center text-left min-h-[210px] lg:min-h-[240px]"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 flex items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <BadgeCheck className="w-5 h-5" />
            </div>
            <h3 className="font-brand-serif text-xl sm:text-2xl font-light text-ink dark:text-white">
              Shop with Confidence
            </h3>
          </div>
          <ul className="space-y-4 text-sm text-black/70 dark:text-white/75">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <span>Crafted and dispatched from Tamale, Northern Region.</span>
            </li>
            <li className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <span>
                Nationwide delivery · Order or enquire on{" "}
                <a href="tel:+233530660355" className="text-gold hover:underline whitespace-nowrap">
                  +233 53 066 0355
                </a>
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <span>
                Questions? Email{" "}
                <a href="mailto:zaanisung7@gmail.com" className="text-gold hover:underline">
                  zaanisung7@gmail.com
                </a>
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </section>
  );
};