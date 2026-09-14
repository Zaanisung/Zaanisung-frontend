import React from "react";
import { Logo } from "../Logo";
import { ArrowLeft, Home } from "lucide-react";

interface NotFoundPageProps {
  title?: string;
  hint?: string;
  onBack?: () => void;
  onHome?: () => void;
  className?: string;
}

/**
 * Friendly "lost" page shown whenever a route asks for something that
 * doesn't exist (missing product, unknown order, dead link…). It never
 * reveals error codes or internal details — just a quiet, branded hint and
 * easy ways to get back.
 */
export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  title = "This page has drifted off",
  hint = "The page you're looking for doesn't exist or has moved. Let's get you back to the fragrances.",
  onBack,
  onHome,
  className,
}) => (
  <div
    className={
      "relative w-full min-h-[70vh] flex items-center justify-center px-4 overflow-hidden " +
      (className ?? "")
    }
  >
    {/* Oversized ghost 404 — purely decorative */}
    <div
      className="absolute select-none pointer-events-none inset-x-0 text-center font-brand-serif text-[12rem] leading-none text-black/[0.04] dark:text-white/[0.05] tracking-widest"
      aria-hidden="true"
    >
      404
    </div>

    <div className="relative flex flex-col items-center text-center max-w-md py-14">
      <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4 mb-6">
        <Logo className="h-10 w-10" />
      </div>

      <h1 className="text-3xl font-brand-serif font-light text-ink dark:text-white">
        {title}
      </h1>
      <p className="mt-3 text-sm text-black/50 dark:text-white/50 max-w-sm">{hint}</p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="min-h-[44px] px-5 rounded-lg inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-black/60 dark:text-white/60 surface-glass border border-black/10 dark:border-white/15 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go back</span>
          </button>
        )}
        {onHome && (
          <button
            type="button"
            onClick={onHome}
            className="min-h-[44px] px-5 rounded-lg inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-ink bg-gold hover:bg-gold-600 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Back to home</span>
          </button>
        )}
      </div>
    </div>
  </div>
);