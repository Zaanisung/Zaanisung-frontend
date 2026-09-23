import React, { useState } from "react";
import {
  Instagram,
  Facebook,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";
import { Logo } from "./Logo";

// Business-owned profiles should replace these before launch. Using real
// handles keeps the footer honest (no dead brand links).
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

// There is no newsletter backend yet, so the form composes a pre-filled email
// instead of claiming you've been added to a list that doesn't exist.
const NEWSLETTER_EMAIL = "zaanisung7@gmail.com";

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [newsletterEmail, setNewsletterEmail] = useState("");

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const email = newsletterEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;

    const subject = encodeURIComponent("Newsletter sign-up request");
    const body = encodeURIComponent(`Please add me to the newsletter.\n\nEmail: ${email}`);
    window.open(`mailto:${NEWSLETTER_EMAIL}?subject=${subject}&body=${body}`, "_self");
    setNewsletterEmail("");
  };

  return (
    <footer className="relative bg-ink text-cream/70 mt-auto">
      {/* Gold hairline crown */}
      <div className="absolute top-0 inset-x-0 hairline-gold" aria-hidden="true" />

      <div className="w-full px-4 sm:px-8 lg:px-12 pt-14 sm:pt-18 pb-10">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <Logo className="h-8 sm:h-9" showWordmark />
              <span className="eyebrow text-gold mt-2 block">
                Fragrance House · Tamale, Ghana
              </span>
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
                <a href="tel:+233530660355" className="hover:text-gold transition-colors">
                  +233 53 066 0355
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <a href="mailto:zaanisung7@gmail.com" className="hover:text-gold transition-colors">
                  zaanisung7@gmail.com
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
            <form className="flex gap-2" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                required
                className="flex-1 min-w-0 px-3.5 py-2.5 text-sm rounded-lg bg-transparent border border-white/15 text-cream placeholder-cream/35 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold/20 transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
              />
              <button
                type="submit"
                className="min-h-[44px] px-5 rounded-lg bg-gold hover:bg-gold-600 text-ink text-xs uppercase tracking-wider font-bold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:scale-[1.02] active:scale-[0.98]"
              >
                Join
              </button>
            </form>
            <p className="mt-2 text-xs text-cream/45 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 text-gold flex-shrink-0" />
              Submitting opens a pre-filled email to us — send it and we&apos;ll
              add you to our drop list.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="w-full px-4 sm:px-8 lg:px-12 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] uppercase tracking-[0.2em] text-cream/40">
          <span>&copy; {new Date().getFullYear()} Zaanisung Fragrance House. All rights reserved.</span>
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