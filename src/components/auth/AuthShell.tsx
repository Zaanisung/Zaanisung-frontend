import React from "react";
import { Logo } from "../Logo";

export interface AuthShellProps {
  /** Mobile branding + heading for the form side */
  brandStatement: string;
  heading: string;
  subheading: string;
  /** Left (desktop) panel content */
  panelTitle: string;
  panelBody: string;
  features: string[];
  children: React.ReactNode;
}

/**
 * Shared full-bleed authentication layout (login, register). Two-column on
 * desktop — brand panel left, form right — collapsing to a focused form on
 * mobile. Never renders the storefront chrome (header/footer): auth pages are
 * standalone and visually self-contained.
 */
export const AuthShell: React.FC<AuthShellProps> = ({
  brandStatement,
  heading,
  subheading,
  panelTitle,
  panelBody,
  features,
  children,
}) => {
  return (
    <div className="dark relative min-h-screen w-full overflow-hidden flex flex-col lg:flex-row bg-ink text-cream">
      {/* Full-bleed auth background — main background of the auth container on every screen */}
      <img
        src="/assets/backgrounds/auth-panel.webp"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0 bg-gradient-to-br from-ink/90 via-ink/55 to-ink/85"
        aria-hidden="true"
      ></div>
      {/* Atmospheric mist */}
      <div className="absolute inset-0 opacity-25 pointer-events-none" aria-hidden="true">
        <div className="absolute top-24 left-16 w-96 h-96 orb orb-gold-soft animate-mist-float"></div>
        <div className="absolute bottom-24 right-24 w-80 h-80 orb orb-cream animate-mist-float [animation-delay:2s]"></div>
        <div className="absolute top-1/2 left-1/3 w-72 h-72 orb orb-gold-faint animate-mist-drift"></div>
      </div>

      {/* Left Side - Branding & Imagery (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative z-10">
        {/* Kente trim along the inner edge */}
        <div className="absolute inset-y-0 right-0 kente-divider-auth" aria-hidden="true"></div>
        <div className="absolute bottom-0 inset-x-0 kente-navbar-border" aria-hidden="true"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-16 text-cream w-full items-start text-left">
          <div>
            <Logo className="h-16 w-16 mb-6" />
            <h1 className="text-5xl xl:text-6xl font-light tracking-widest font-brand-serif mb-3">
              ZAANISUNG
            </h1>
            <p className="text-sm uppercase tracking-[0.25em] text-gold-300 font-semibold">
              {brandStatement}
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4 max-w-md">
              <h2 className="text-2xl xl:text-3xl font-brand-serif font-light leading-relaxed">
                {panelTitle}
              </h2>
              <p className="text-sm text-cream/70 leading-relaxed">{panelBody}</p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 text-xs uppercase tracking-wider text-cream/60">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Decorative mist overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative z-10">
        <div className="w-full max-w-md relative z-10">
          {/* Mobile branding */}
          <div className="lg:hidden text-center mb-8 flex flex-col items-center">
            <Logo className="h-14 w-14 mb-3" />
            <h2 className="text-2xl font-light tracking-widest text-ink dark:text-cream font-brand-serif">
              ZAANISUNG
            </h2>
            <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mt-1">
              Exclusive Fragrances
            </p>
          </div>

          {/* Form — no card background */}
          <div className="w-full">
            <div className="mb-8">
              <h3 className="text-2xl sm:text-3xl font-brand-serif font-light text-ink dark:text-cream mb-2">
                {heading}
              </h3>
              <p className="text-sm text-black/60 dark:text-white/60">{subheading}</p>
            </div>

            {children}
          </div>
        </div>
      </div>
      {/* Bottom kente band */}
      <div className="absolute bottom-0 inset-x-0 kente-navbar-border pointer-events-none" aria-hidden="true"></div>
    </div>
  );
};