import React from "react";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
} from "lucide-react";
import { Logo } from "./Logo";

const socials = [
  { label: "Instagram", icon: Instagram, href: "https://instagram.com" },
  { label: "Facebook", icon: Facebook, href: "https://facebook.com" },
  { label: "Twitter / X", icon: Twitter, href: "https://x.com" },
];

const quickLinks = [
  { label: "Shop Perfumes", action: "shop" as const },
  { label: "About Us", action: "about" as const },
  { label: "My Orders", action: "orders" as const },
  { label: "My Account", action: "account" as const },
];

export interface FooterProps {
  onNavigate?: (target: "shop" | "about" | "orders" | "account" | "home") => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="relative bg-ink text-cream/70 mt-auto">
      {/* Gold hairline crown */}
      <div className="absolute top-0 inset-x-0 hairline-gold" />

      <div className="w-full px-4 sm:px-8 lg:px-12 pt-14 sm:pt-18 pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <div>
                <span className="font-brand-serif text-cream text-xl tracking-[0.16em] font-light block leading-none">
                  ZAANISUNG
                </span>
                <span className="eyebrow text-gold mt-1.5 block">
                  Ent. GH Fragrances
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-md">
              Zaanisung is an artisanal fragrance house based in Tamale, Ghana.
              We curate exclusive, long-lasting perfumes that capture the spirit
              of modern Ghanaian elegance — bottled, numbered, and made to be
              remembered.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 rounded-lg flex items-center justify-center border border-white/15 text-cream/70 hover:text-ink hover:border-gold hover:bg-gold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.1] active:scale-[0.95]"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow text-cream mb-5">Explore</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(link.action)}
                    className="text-sm text-cream/60 hover:text-gold transition-colors text-left inline-flex items-center group"
                  >
                    <span>{link.label}</span>
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 -translate-y-0.5 group-hover:opacity-100 group-hover:translate-y-0 transition-all" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow text-cream mb-5">Company</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span>Tamale, Northern Region, Ghana</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="tel:+233240000000" className="hover:text-gold transition-colors">
                  +233 24 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:hello@zaanisung.com" className="hover:text-gold transition-colors">
                  hello@zaanisung.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-gold flex-shrink-0" />
                <span>Mon – Sat · 9:00 – 19:00 GMT</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="eyebrow text-cream mb-5">Stay in the loop</h3>
            <p className="text-sm text-cream/60 mb-4">
              Be first to know about new drops and exclusive offers.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="you@email.com"
                aria-label="Email address"
                className="flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-lg bg-transparent border border-white/15 text-cream placeholder-cream/35 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 rounded-lg bg-gold hover:bg-gold-600 text-ink text-xs uppercase tracking-wider font-bold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_32px_-8px_rgba(212,175,55,0.35)]"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.2em] text-cream/40">
          <span>&copy; {new Date().getFullYear()} Zaanisung Ent. GH. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span>Tamale, Ghana</span>
            <div className="flex items-center gap-2 text-gold">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse"></span>
              <span>Store Open</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};