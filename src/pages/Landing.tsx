import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Gem,
  RefreshCcw,
  Heart,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  BadgeCheck,
} from "lucide-react";
import { motion } from "motion/react";
import { Product, CustomerUser } from "../types";
import * as api from "../api";
import { getErrorMessage } from "../api";
import { Logo } from "../components/Logo";
import { Footer } from "../components/Footer";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

export interface LandingProps {
  products: Product[];
  currentUser: CustomerUser | null;
  isLoadingProducts: boolean;
  onCreateAccount: (user: CustomerUser) => void;
  onLogin: (user: CustomerUser) => void;
  onStartShopping: () => void;
  onBrowseShop: () => void;
  onGoToLogin: () => void;
}

const SESSION_KEY = "zaanisung_landing";

export const Landing: React.FC<LandingProps> = ({
  products,
  currentUser,
  isLoadingProducts,
  onCreateAccount,
  onLogin,
  onStartShopping,
  onBrowseShop,
  onGoToLogin,
}) => {
  const [mode, setMode] = useState<"signup" | "login">("signup");
  const [hasAccount, setHasAccount] = useState<boolean>(
    typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "signed"
  );

  // Name + contact + password (shared by both modes)
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

  // Once we have a real logged-in user, they've moved past onboarding
  // (handled by isLoggedIn/showForm which already take precedence).

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (mode === "signup" && !name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!identifier.trim() || !password.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { user } = await api.registerUser({
          name: name.trim(),
          phone: /^\d/.test(identifier.trim()) ? identifier.trim() : undefined,
          email: identifier.includes("@") ? identifier.trim() : undefined,
          password,
        });
        sessionStorage.setItem(SESSION_KEY, "signed");
        setHasAccount(true);
        setJustCreated(true);
        onCreateAccount({
          id: user.id,
          name: user.name,
          phone: user.phone || "",
          email: user.email,
          role: user.role,
        });
      } else {
        const { user } = await api.loginUser(identifier, password);
        sessionStorage.setItem(SESSION_KEY, "signed");
        setHasAccount(true);
        onLogin({
          id: user.id,
          name: user.name,
          phone: user.phone || "",
          email: user.email,
          role: user.role,
        });
      }
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  const featured = products.slice(0, 6);
  const isLoggedIn = !!currentUser;
  const showForm = !isLoggedIn && !justCreated;

  return (
    <div className="min-h-screen bg-[#0B0B0E] text-[#F4F4F6]">
      {/* ─── Landing Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-[#1C1C24] bg-[#0A0A0C]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-[72px] flex items-center justify-between">
          <Logo className="h-9 w-9 sm:h-10 sm:w-10" showWordmark />
          <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest text-gray-400">
            <a
              href="#collections"
              className="hover:text-[#D4AF37] transition-colors min-h-[44px] inline-flex items-center"
            >
              Collections
            </a>
            <a
              href="#about"
              className="hover:text-[#D4AF37] transition-colors min-h-[44px] inline-flex items-center"
            >
              About
            </a>
            <a
              href="#craft"
              className="hover:text-[#D4AF37] transition-colors min-h-[44px] inline-flex items-center"
            >
              The Craft
            </a>
            <button
              type="button"
              onClick={onBrowseShop}
              className="hover:text-[#D4AF37] transition-colors min-h-[44px] inline-flex items-center"
            >
              Shop All
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <Button variant="primary" size="sm" onClick={onStartShopping}>
                Enter Store <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            ) : hasAccount ? (
              <Button variant="outline" size="sm" onClick={onGoToLogin}>
                Sign In
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={onBrowseShop}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Decorative glows */}
        <div className="pointer-events-none absolute -top-32 -right-32 w-[420px] h-[420px] rounded-full bg-[#D4AF37]/10 blur-3xl" />
        <div className="pointer-events-none absolute top-1/3 -left-40 w-[400px] h-[400px] rounded-full bg-purple-700/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <span className="inline-flex items-center gap-2 border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              Zaanisung Ent. GH
            </span>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Fragrance that
              <span className="block italic text-[#D4AF37] mt-1">endures.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-[#A1A1AA] leading-relaxed max-w-xl">
              Hand-crafted in Tamale, Ghana. Zaanisung bottles bold, long-lasting
              scent that moves with you — from the market to the metropolis.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {showForm ? (
                <Button variant="primary" size="lg" onClick={() => document.getElementById("auth-card")?.scrollIntoView({ behavior: "smooth" })}>
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
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-[#1C1C24] pt-8 text-center sm:text-left">
              <div>
                <Gem className="w-5 h-5 text-[#D4AF37] mx-auto sm:mx-0" />
                <p className="text-xs text-[#A1A1AA] mt-2 leading-snug">
                  Premium Oils
                </p>
              </div>
              <div>
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] mx-auto sm:mx-0" />
                <p className="text-xs text-[#A1A1AA] mt-2 leading-snug">
                  Authentic &<br />Verified
                </p>
              </div>
              <div>
                <Truck className="w-5 h-5 text-[#D4AF37] mx-auto sm:mx-0" />
                <p className="text-xs text-[#A1A1AA] mt-2 leading-snug">
                  Nationwide<br />Delivery
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right: Auth card (hero-first sign up) OR welcome panel */}
          <motion.div
            id="auth-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative"
          >
            <div className="rounded-lg border border-[#22222C] bg-[#101014]/90 backdrop-blur-xl p-8 sm:p-10 shadow-2xl">
              {showForm ? (
                <>
                  <span className="inline-flex items-center gap-2 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold mb-3">
                    <BadgeCheck className="w-4 h-4" />
                    Join Zaanisung
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl font-light text-white"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {mode === "signup" ? "Create your account" : "Welcome back"}
                  </h2>
                  <p className="text-sm text-[#A1A1AA] mt-2 mb-6">
                    {mode === "signup"
                      ? "Your personal fragrance concierge. Save, order and track effortlessly."
                      : "Sign in to access your orders and favourites."}
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-950/40 border border-red-800 text-xs text-red-300 font-medium rounded">
                        {error}
                      </div>
                    )}

                    {mode === "signup" && (
                      <Input
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => { setName(e.target.value); if (error) setError(null); }}
                        placeholder="Ama Mensah"
                        autoComplete="name"
                      />
                    )}

                    <Input
                      label={mode === "signup" ? "Phone or Email" : "Phone or Email"}
                      type="text"
                      value={identifier}
                      onChange={(e) => { setIdentifier(e.target.value); if (error) setError(null); }}
                      placeholder="+233 24 000 0000 or you@mail.com"
                      autoComplete="username"
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (error) setError(null); }}
                      placeholder="••••••••"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      required
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      isLoading={isLoading}
                      className="w-full font-bold"
                    >
                      {mode === "signup" ? "Create Account" : "Sign In"}
                    </Button>
                  </form>

                  <div className="mt-6 pt-5 border-t border-[#20202A]">
                    <button
                      type="button"
                      onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(null); }}
                      className="text-xs text-[#A1A1AA] hover:text-[#D4AF37] transition-colors"
                    >
                      {mode === "signup" ? (
                        <>Already have an account? <span className="font-bold underline">Sign in</span></>
                      ) : (
                        <>New here? <span className="font-bold underline">Create account</span> instead</>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/50 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-7 h-7 text-[#D4AF37]" />
                  </div>
                  <h2
                    className="text-2xl sm:text-3xl font-light text-white"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {isLoggedIn ? `Welcome, ${currentUser.name.split(" ")[0]}` : justCreated ? "You're all set" : "Welcome back"}
                  </h2>
                  <p className="text-sm text-[#A1A1AA] mt-3 mb-8">
                    {isLoggedIn
                      ? "Your store is ready — explore the latest drops."
                      : "Start exploring our artisanal fragrance collection."}
                  </p>
                  <Button variant="primary" size="lg" onClick={onStartShopping} className="w-full font-bold">
                    {isLoggedIn ? "Enter the Store" : "Start Shopping"} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                  <button
                    type="button"
                    onClick={onBrowseShop}
                    className="mt-4 text-[11px] uppercase tracking-widest text-[#A1A1AA] hover:text-white font-semibold min-h-[44px]"
                  >
                    Browse the Collection
                  </button>
                </div>
              )}
            </div>

            {/* Floating tag */}
            <div className="hidden lg:flex absolute -bottom-5 -left-6 items-center gap-2 border border-[#22222C] bg-[#0A0A0C] px-4 py-3 rounded shadow-xl">
              <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-xs text-[#A1A1AA]">
                Rated <span className="text-white font-bold">4.9/5</span> by shoppers across Ghana
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED COLLECTIONS ───────────────────────────────────── */}
      <section id="collections" className="bg-[#0E0E12] border-y border-[#1C1C24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
          >
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">Selected for you</span>
              <h2
                className="text-3xl sm:text-4xl font-light mt-2 text-white"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Signature Collection
              </h2>
            </div>
            <button
              type="button"
              onClick={onBrowseShop}
              className="text-xs uppercase tracking-widest text-[#A1A1AA] hover:text-[#D4AF37] transition-colors min-h-[44px] flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse aspect-[3/4] bg-[#16161C] rounded" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-sm text-[#71717A] py-10">
              New fragrances are being prepared. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {featured.map((product, i) => (
                <motion.button
                  key={product._id}
                  type="button"
                  onClick={onBrowseShop}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                  className="group relative overflow-hidden rounded-lg bg-[#121218] border border-[#1E1E26] text-left"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[#16161C]">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Gem className="w-8 h-8 text-[#3F3F46]" />
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-white truncate">{product.name}</h3>
                    {product.description && (
                      <p className="text-xs text-[#71717A] mt-1 line-clamp-2">{product.description}</p>
                    )}
                    <p className="text-[#D4AF37] font-bold mt-2 text-sm">
                      GH₵ {product.price.toLocaleString()}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── ABOUT (split-screen) ───────────────────────────────────── */}
      <section id="about" className="bg-[#0B0B0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">Our Story</span>
            <h2
              className="text-3xl sm:text-4xl font-light mt-2 text-white leading-snug"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Born in the North.
              <span className="block italic text-[#D4AF37]">Worn everywhere.</span>
            </h2>
            <p className="mt-6 text-[#A1A1AA] leading-relaxed">
              Zaanisung is an artisanal fragrance house rooted in Tamale, Ghana.
              We blend rare oils and extracts into bold, long-lasting compositions
              inspired by the warmth of the savanna and the energy of Ghanaian life.
            </p>
            <p className="mt-4 text-[#A1A1AA] leading-relaxed">
              Every bottle is curated, numbered and finished by hand — a piece of
              Ghana you can wear, to keep and to gift.
            </p>

            <div className="mt-8 grid grid-cols-3 gap-6">
              {[
                { value: "100%", label: "Artisanal Blends" },
                { value: "24H+", label: "Long-Lasting" },
                { value: "500+", label: "Happy Customers" },
              ].map((stat) => (
                <div key={stat.label} className="border-l-2 border-[#D4AF37] pl-4">
                  <p className="text-2xl sm:text-3xl font-light text-white">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-[#71717A] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <Button variant="primary" size="lg" className="mt-10" onClick={onGoToLogin}>
              Shop the Collection <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { q: "\"The last scent I bought lasts all day. Truly premium.\"", a: "Akosua K.", role: "Accra" },
              { q: "\"Finally a Ghanaian fragrance that feels world-class.\"", a: "Kwame B.", role: "Kumasi" },
              { q: "\"The packaging alone is a gift-worthy experience.\"", a: "Adjoa S.", role: "Tamale" },
              { q: "\"Wear it to work, wear it to weddings — it never fades.\"", a: "Yaw M.", role: "Takoradi" },
            ].map((t, i) => (
              <div
                key={i}
                className={`rounded-lg border border-[#1E1E26] bg-[#101014] p-6 ${
                  i % 2 === 1 ? "lg:translate-y-6" : ""
                }`}
              >
                <div className="flex items-center gap-0.5 text-[#D4AF37] mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-[#C9C9D2] leading-relaxed">"{t.q}"</p>
                <p className="mt-4 text-xs text-[#71717A]">
                  — <span className="text-white font-semibold">{t.a}</span>, {t.role}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CRAFT / WHY US (split-screen) ──────────────────────────── */}
      <section id="craft" className="bg-[#0E0E12] border-y border-[#1C1C24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-14"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">The Craft</span>
            <h2
              className="text-3xl sm:text-4xl font-light mt-2 text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Why Zaanisung
            </h2>
            <p className="mt-4 text-[#A1A1AA]">
              Everything we do is designed around a single promise — scent that
              lasts as long as the memory you make with it.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Gem, title: "Premium Oils", text: "High-concentration perfume oils for all-day sillage." },
              { icon: RefreshCcw, title: "Long-Lasting", text: "Formulated to endure from morning till midnight." },
              { icon: Heart, title: "Made with Love", text: "Small-batch craft, numbered and finished by hand." },
              { icon: ShieldCheck, title: "Trusted & Secure", text: "Secure ordering and nationwide delivery from Tamale." },
            ].map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="group rounded-lg border border-[#1E1E26] bg-[#101014] p-7 hover:border-[#D4AF37]/50 hover:bg-[#14141A] transition-all"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/40 bg-[#D4AF37]/10 mb-5 group-hover:rotate-6 transition-transform">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-white font-semibold tracking-wide">{f.title}</h3>
                  <p className="text-sm text-[#A1A1AA] mt-2 leading-relaxed">{f.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#0B0B0E]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#D4AF37]/10 via-transparent to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl sm:text-5xl font-light text-white leading-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Ready to find your signature scent?
            </h2>
            <p className="mt-4 text-[#A1A1AA] max-w-xl mx-auto">
              Create a free account to browse, save and order our exclusive
              collection — delivered anywhere in Ghana.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {showForm ? (
                <Button variant="primary" size="lg" onClick={() => document.getElementById("auth-card")?.scrollIntoView({ behavior: "smooth" })}>
                  Join Zaanisung <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              ) : (
                <Button variant="primary" size="lg" onClick={onStartShopping}>
                  {isLoggedIn ? "Continue to Store" : "Start Shopping"} <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              )}
              <Button variant="outline" size="lg" onClick={onBrowseShop}>
                Browse Without Joining
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FOOTER ─────────────────────────────────────────────────── */}
      <Footer
        onNavigate={(target) => {
          if (target === "about" || target === "home") {
            document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
          } else if (target === "shop") {
            onBrowseShop();
          } else if (target === "orders" || target === "account") {
            onGoToLogin();
          }
        }}
      />
    </div>
  );
};
