import React from "react";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock,
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
    <footer className="bg-white dark:bg-black text-black/60 dark:text-white/60">
      <div className="w-full px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
        {/* Top: column layout on mobile, 4-col split on desktop */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Brand + description */}
          <div className="lg:col-span-1 space-y-5">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-10" />
              <div>
                <span
                  className="text-black dark:text-white text-lg tracking-[0.2em] font-light italic block leading-none"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  ZAANISUNG
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                  Ent. GH Fragrances
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
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
                  className="w-10 h-10 flex items-center justify-center border border-black/10 dark:border-white/15 text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-black dark:text-white text-xs uppercase tracking-[0.2em] font-bold mb-5">
              Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    type="button"
                    onClick={() => onNavigate?.(link.action)}
                    className="text-sm text-black/60 dark:text-white/60 hover:text-[#D4AF37] transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Info */}
          <div>
            <h3 className="text-black dark:text-white text-xs uppercase tracking-[0.2em] font-bold mb-5">
              Company
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 flex-shrink-0" />
                <span>Tamale, Northern Region, Ghana</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a href="tel:+233240000000" className="hover:text-[#D4AF37] transition-colors">
                  +233 24 000 0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a href="mailto:hello@zaanisung.com" className="hover:text-[#D4AF37] transition-colors">
                  hello@zaanisung.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <span>Mon – Sat · 9:00 – 19:00 GMT</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div>
            <h3 className="text-black dark:text-white text-xs uppercase tracking-[0.2em] font-bold mb-5">
              Stay in the loop
            </h3>
            <p className="text-sm text-black/60 dark:text-white/60 mb-4">
              Be first to know about new drops and exclusive offers.
            </p>
            <form
              className="flex"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="you@email.com"
                aria-label="Email address"
                className="flex-1 min-w-0 px-3 py-2.5 text-sm bg-transparent border border-black/10 dark:border-white/15 text-black dark:text-white placeholder-black/40 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
              <button
                type="submit"
                className="min-h-[44px] px-4 bg-[#D4AF37] hover:bg-[#C29E2E] text-black text-xs uppercase tracking-wider font-bold transition-colors"
              >
                Join
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-white dark:bg-black">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.2em] text-black/40 dark:text-white/40">
          <span>&copy; {new Date().getFullYear()} Zaanisung Ent. GH. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <span>Tamale, Ghana</span>
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              <span>Store Open</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
