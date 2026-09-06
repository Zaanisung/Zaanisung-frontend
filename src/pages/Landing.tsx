import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  ArrowDown,
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
import * as api from "../services";
import { getErrorMessage } from "../services";
import { Carousel } from "../components/Carousel";
import { Logo } from "../components/Logo";
import { Footer } from "../components/Footer";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { ProductCard } from "../components/ProductCard";
import { ThemeToggle } from "../components/ThemeToggle";
import { cn } from "../utils/cn";

export interface LandingProps {
  products: Product[];
  currentUser: CustomerUser | null;
  isLoadingProducts: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onCreateAccount: (user: CustomerUser) => void;
  onLogin: (user: CustomerUser) => void;
  onStartShopping: () => void;
  onBrowseShop: () => void;
  onGoToLogin: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  recentlyAddedId?: string | null;
}

const SESSION_KEY = "zaanisung_landing";

const navLinks = [
  { label: "Collections", href: "#collections" },
  { label: "About", href: "#about" },
  { label: "The Craft", href: "#craft" },
];

const trustBadges = [
  { icon: Gem, label: "Premium Oils", sub: "High concentration" },
  { icon: ShieldCheck, label: "Authentic", sub: "Verified batches" },
  { icon: Truck, label: "Nationwide", sub: "Delivery from Tamale" },
];

export const Landing: React.FC<LandingProps> = ({
  products,
  currentUser,
  isLoadingProducts,
  isDark,
  onToggleTheme,
  onCreateAccount,
  onLogin,
  onStartShopping,
  onBrowseShop,
  onGoToLogin,
  onSelectProduct,
  onAddToCart,
  recentlyAddedId,
}) => {
  const [mode, setMode] = useState<"signup" | "login">(() =>
    typeof window !== "undefined" && window.sessionStorage.getItem(SESSION_KEY) === "signed"
      ? "login"
      : "signup"
  );

  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [justCreated, setJustCreated] = useState(false);

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

  const featured = products.slice(0, 8);
  const isLoggedIn = !!currentUser;
  const showForm = !isLoggedIn && !justCreated;

  const scrollToAuth = () =>
    document.getElementById("auth-card")?.scrollIntoView({ behavior: "smooth", block: "center" });

  return (
    <div className="min-h-screen bg-cream dark:bg-black text-ink dark:text-white">
      {/* ─── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-white/70 dark:bg-black/55 backdrop-blur-xl">
        <div className="absolute top-0 inset-x-0 hairline-gold" aria-hidden="true" />
        <div className="w-full px-3 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between gap-3 flex-nowrap">
          <Logo
            className="h-9 w-9 sm:h-10 sm:w-10 shrink-0"
            showWordmark
            wordmarkClassName="hidden min-[480px]:inline text-base sm:text-lg tracking-[0.16em]"
          />

          <nav className="hidden md:flex items-center space-x-9 text-xs uppercase tracking-[0.18em] font-semibold text-black/55 dark:text-white/55">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative inline-flex items-center min-h-[44px] group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </a>
            ))}
            <button
              type="button"
              onClick={onBrowseShop}
              className="relative inline-flex items-center min-h-[44px] group"
            >
              Shop All
              <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
            {isLoggedIn ? (
              <Button variant="primary" size="md" onClick={onStartShopping}>
                Enter Store <ArrowRight className="w-4 h-4 ml-1 hidden min-[380px]:inline" />
              </Button>
            ) : (
              <Button variant="outline" size="md" onClick={onGoToLogin}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* ─── HERO ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Ambient backdrop */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute inset-0 lux-grid lux-grid-fade" />
          <div className="orb orb-gold-strong w-[520px] h-[520px] -top-40 -right-32" />
          <div className="orb orb-gold w-[460px] h-[460px] -bottom-48 -left-40" />
          <div className="orb orb-ink w-[380px] h-[380px] top-1/3 left-1/2 -translate-x-1/2" />
        </div>

        <div className="relative w-full min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-96px)] px-4 sm:px-8 lg:px-12 py-14 sm:py-20 lg:py-12 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
          {/* Left: copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <span className="inline-flex items-center gap-2 border border-gold/40 bg-gold/10 text-gold px-3 py-1.5 w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="eyebrow">Maison de Parfum · Tamale</span>
            </span>

            <h1 className="font-brand-serif text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-6xl xl:text-[4.75rem] font-light tracking-tight mt-7 text-balance">
              Fragrance that
              <span className="gold-gradient-text italic block mt-1 pb-1">endures.</span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-black/60 dark:text-white/60 leading-relaxed max-w-xl">
              Hand-crafted in Tamale, Ghana. Zaanisung bottles bold, long-lasting
              scent that moves with you — from the market to the metropolis.
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              {showForm ? (
                <Button variant="primary" size="lg" onClick={scrollToAuth}>
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
            <div className="mt-12 max-w-xl grid grid-cols-3 divide-x divide-black/10 dark:divide-white/10">
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="flex flex-col items-center sm:items-start px-2 first:pl-0 sm:px-4 sm:first:pl-0">
                    <div className="w-9 h-9 border border-gold/40 bg-gold/10 flex items-center justify-center mb-2.5">
                      <Icon className="w-4 h-4 text-gold" />
                    </div>
                    <p className="text-xs font-bold uppercase tracking-wider text-ink dark:text-white">
                      {badge.label}
                    </p>
                    <p className="text-[10px] text-black/50 dark:text-white/55 mt-0.5">
                      {badge.sub}
                    </p>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right: auth card OR continue panel — always present */}
          <motion.div
            id="auth-card"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
            className="relative flex flex-col lg:max-w-lg w-full justify-self-end lg:justify-self-center"
          >
            <div className="surface-glass-strong corner-frame corner-frame-static p-7 sm:p-9 flex flex-col justify-center shadow-lift">
              {showForm ? (
                <>
                  <div className="mb-6">
                    <span className="inline-flex items-center gap-2 text-gold">
                      <BadgeCheck className="w-4 h-4" />
                      <span className="eyebrow">Join Zaanisung</span>
                    </span>
                    <h2 className="font-brand-serif text-2xl sm:text-[1.75rem] font-light text-ink dark:text-white mt-2">
                      {mode === "signup" ? "Create your account" : "Welcome back"}
                    </h2>
                    <p className="text-sm text-black/60 dark:text-white/60 mt-1.5">
                      {mode === "signup"
                        ? "Your personal fragrance concierge. Save, order and track effortlessly."
                        : "Sign in to access your orders and favourites."}
                    </p>
                  </div>

                  {/* Mode toggle */}
                  <div className="inline-flex self-start p-1 border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] mb-6">
                    {(["signup", "login"] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setMode(m);
                          setError(null);
                        }}
                        className={cn(
                          "min-h-[38px] px-4 text-[10px] uppercase tracking-wider font-bold transition-colors",
                          mode === m
                            ? "bg-ink text-cream dark:bg-gold dark:text-ink"
                            : "text-black/50 dark:text-white/50 hover:text-ink dark:hover:text-white"
                        )}
                      >
                        {m === "signup" ? "Create" : "Sign in"}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                      <div className="p-3 bg-red-950/40 border border-red-800 text-xs text-red-300 font-medium">
                        {error}
                      </div>
                    )}

                    {mode === "signup" && (
                      <Input
                        label="Full Name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (error) setError(null);
                        }}
                        placeholder="Ama Mensah"
                        autoComplete="name"
                      />
                    )}

                    <Input
                      label="Phone or Email"
                      type="text"
                      value={identifier}
                      onChange={(e) => {
                        setIdentifier(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="+233 24 000 0000 or you@mail.com"
                      autoComplete="username"
                      required
                    />

                    <Input
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="••••••••"
                      autoComplete={mode === "signup" ? "new-password" : "current-password"}
                      required
                    />

                    <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                      {mode === "signup" ? "Create Account" : "Sign In"}
                    </Button>
                  </form>

                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signup" ? "login" : "signup");
                      setError(null);
                    }}
                    className="mt-5 text-xs text-black/60 dark:text-white/60 hover:text-gold transition-colors text-center"
                  >
                    {mode === "signup" ? (
                      <>Already have an account? <span className="font-bold underline">Sign in</span></>
                    ) : (
                      <>New here? <span className="font-bold underline">Create account</span> instead</>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-2">
                  <div className="w-16 h-16 bg-gold/15 border border-gold/50 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-8 h-8 text-gold" />
                  </div>
                  <h2 className="font-brand-serif text-2xl sm:text-3xl font-light text-ink dark:text-white">
                    {isLoggedIn
                      ? `Welcome, ${currentUser.name.split(" ")[0]}`
                      : justCreated
                        ? "You're all set"
                        : "Welcome back"}
                  </h2>
                  <p className="text-sm text-black/60 dark:text-white/60 mt-3 mb-8">
                    {isLoggedIn
                      ? "Your store is ready — explore the latest drops."
                      : "Start exploring our artisanal fragrance collection."}
                  </p>

                  <Button variant="primary" size="lg" onClick={onStartShopping} className="w-full">
                    {isLoggedIn ? "Continue to Dashboard" : "Start Shopping"} <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>

                  <button
                    type="button"
                    onClick={onBrowseShop}
                    className="mt-4 eyebrow text-black/60 dark:text-white/60 hover:text-ink dark:hover:text-white font-semibold min-h-[44px] inline-flex items-center"
                  >
                    Browse the Collection
                  </button>
                </div>
              )}
            </div>

            {/* Floating rating chip */}
            <div className="hidden lg:flex absolute -bottom-6 -left-7 items-center gap-2.5 surface-glass px-4 py-3 shadow-lift">
              <Star className="w-4 h-4 fill-gold text-gold" />
              <span className="text-xs text-black/60 dark:text-white/60">
                Rated <span className="text-ink dark:text-white font-bold">4.9/5</span> by shoppers across Ghana
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scroll hint */}
        <div className="hidden md:flex absolute bottom-6 left-1/2 -translate-x-1/2 flex-col items-center gap-1.5 text-black/40 dark:text-white/40 animate-bounce pointer-events-none">
          <span className="eyebrow text-[0.5625rem]">Scroll</span>
          <ArrowDown className="w-3.5 h-3.5" />
        </div>
      </section>

      {/* ─── SIGNATURE COLLECTION (carousel) ────────────────────────── */}
      <section id="collections" className="relative bg-white dark:bg-black">
        <div className="absolute top-0 inset-x-0 hairline-black" aria-hidden="true" />
        <div className="w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10"
          >
            <div>
              <span className="eyebrow text-gold">Selected for you</span>
              <h2 className="font-brand-serif text-3xl sm:text-4xl lg:text-[2.75rem] font-light mt-3 text-balance">
                Signature Collection
              </h2>
              <p className="text-sm text-black/55 dark:text-white/55 mt-2 max-w-md">
                Our most requested extraits — each bottle numbered, each batch finished by hand.
              </p>
            </div>
            <button
              type="button"
              onClick={onBrowseShop}
              className="group text-xs uppercase tracking-widest font-semibold text-black/60 dark:text-white/60 hover:text-gold transition-colors min-h-[44px] inline-flex items-center gap-2 w-fit"
            >
              View All
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          {isLoadingProducts ? (
            <div className="flex gap-5 overflow-hidden">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="shrink-0 w-[74%] min-[480px]:w-[46%] md:w-[31%] aspect-[4/3] animate-pulse bg-black/5 dark:bg-white/[0.06] border border-black/10 dark:border-white/10" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-sm text-black/45 dark:text-white/45 py-10 border border-dashed border-black/15 dark:border-white/15 p-6 max-w-md">
              New fragrances are being prepared. Check back soon.
            </p>
          ) : (
            <Carousel
              items={featured}
              keyExtractor={(p) => p.id}
              renderItem={(product, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: Math.min(index, 3) * 0.06 }}
                  className="h-full"
                >
                  <ProductCard
                    product={product}
                    onSelect={onSelectProduct}
                    onAddToCart={onAddToCart}
                    isAdded={recentlyAddedId === product.id}
                  />
                </motion.div>
              )}
              ariaLabel="Signature collection carousel"
            />
          )}
        </div>
      </section>

      {/* ─── ABOUT / STORY ──────────────────────────────────────────── */}
      <section id="about" className="relative bg-cream dark:bg-black">
        <div className="absolute top-0 inset-x-0 hairline-black" aria-hidden="true" />
        <div className="w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
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
              <span className="gold-gradient-text italic block mt-1 pb-1">Worn everywhere.</span>
            </h2>
            <p className="mt-6 text-black/60 dark:text-white/60 leading-relaxed max-w-lg">
              Zaanisung is an artisanal fragrance house rooted in Tamale, Ghana.
              We blend rare oils and extracts into bold, long-lasting compositions
              inspired by the warmth of the savanna and the energy of Ghanaian life.
            </p>
            <p className="mt-4 text-black/60 dark:text-white/60 leading-relaxed max-w-lg">
              Every bottle is curated, numbered and finished by hand — a piece of
              Ghana you can wear, to keep and to gift.
            </p>

            <div className="mt-9 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { value: "100%", label: "Artisanal Blends" },
                { value: "24H+", label: "Long-Lasting" },
                { value: "500+", label: "Happy Customers" },
              ].map((stat) => (
                <div key={stat.label} className="border-l-2 border-gold pl-4">
                  <p className="font-brand-serif text-2xl sm:text-3xl font-light text-ink dark:text-white">
                    {stat.value}
                  </p>
                  <p className="eyebrow text-black/45 dark:text-white/45 mt-1.5">
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
            {[
              { q: "The last scent I bought lasts all day. Truly premium.", a: "Akosua K.", role: "Accra" },
              { q: "Finally a Ghanaian fragrance that feels world-class.", a: "Kwame B.", role: "Kumasi" },
              { q: "The packaging alone is a gift-worthy experience.", a: "Adjoa S.", role: "Tamale" },
              { q: "Wear it to work, wear it to weddings — it never fades.", a: "Yaw M.", role: "Takoradi" },
            ].map((t, i) => (
              <div
                key={i}
                className={cn(
                  "surface-glass corner-frame p-6 sm:p-7 flex flex-col justify-center min-h-[210px] lg:min-h-[240px] transition-transform duration-300 hover:-translate-y-1",
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

      {/* ─── CRAFT / WHY US ─────────────────────────────────────────── */}
      <section id="craft" className="relative bg-white dark:bg-black">
        <div className="absolute top-0 inset-x-0 hairline-black" aria-hidden="true" />
        <div className="w-full px-4 sm:px-8 lg:px-12 py-16 sm:py-24">
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
            <p className="mt-4 text-black/60 dark:text-white/60 max-w-xl mx-auto">
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
                  className="surface-glass corner-frame group p-7 sm:p-8 hover:shadow-gold-glow transition-all lg:min-h-[300px] flex flex-col justify-center hover:-translate-y-1.5"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-gold/40 bg-gold/10 mb-6 group-hover:bg-gold/15 transition-colors">
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

      {/* ─── CTA BANNER ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-cream dark:bg-black">
        <div className="absolute top-0 inset-x-0 hairline-black" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="orb orb-gold w-[560px] h-[560px] -top-48 left-1/2 -translate-x-1/2" />
        </div>

        <div className="relative w-full px-4 sm:px-8 lg:px-12 py-20 sm:py-28 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="surface-glass-strong corner-frame corner-frame-static max-w-4xl mx-auto px-6 sm:px-14 py-14 sm:py-16 shadow-lift"
          >
            <span className="eyebrow text-gold">Begin your ritual</span>
            <h2 className="font-brand-serif text-3xl sm:text-5xl font-light leading-tight mt-4 text-balance">
              Ready to find your signature scent?
            </h2>
            <p className="mt-5 text-black/60 dark:text-white/60 max-w-xl mx-auto">
              Create a free account to browse, save and order our exclusive
              collection — delivered anywhere in Ghana.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              {showForm ? (
                <Button variant="primary" size="lg" onClick={scrollToAuth}>
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