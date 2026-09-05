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
import { ProductCard } from "../components/ProductCard";
import { ThemeToggle } from "../components/ThemeToggle";

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
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      {/* ─── Landing Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-black/10 dark:border-white/15 bg-white/80 dark:bg-black backdrop-blur-md">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-16 sm:h-[72px] flex items-center justify-between">
          <Logo className="h-9 w-9 sm:h-10 sm:w-10" showWordmark />
          <nav className="hidden md:flex items-center space-x-8 text-xs uppercase tracking-widest text-black/45 dark:text-white/45">
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
            <ThemeToggle isDark={isDark} onToggle={onToggleTheme} />
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
        <div className="w-full min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] px-4 sm:px-8 lg:px-12 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <span className="inline-flex items-center gap-2 border border-[#D4AF37]/40 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold px-3 py-1.5 mb-6 self-start">
              <Sparkles className="w-3.5 h-3.5" />
              Zaanisung Ent. GH
            </span>
            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Fragrance that
              <span className="block italic text-[#D4AF37] mt-2">endures.</span>
            </h1>
            <p className="mt-6 text-base sm:text-lg text-black/60 dark:text-white/60 leading-relaxed max-w-2xl">
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
            <div className="mt-12 grid grid-cols-3 gap-4 text-center sm:text-left">
              <div>
                <Gem className="w-5 h-5 text-[#D4AF37] mx-auto sm:mx-0" />
                <p className="text-xs text-black/60 dark:text-white/60 mt-2 leading-snug">
                  Premium Oils
                </p>
              </div>
              <div>
                <ShieldCheck className="w-5 h-5 text-[#D4AF37] mx-auto sm:mx-0" />
                <p className="text-xs text-black/60 dark:text-white/60 mt-2 leading-snug">
                  Authentic &<br />Verified
                </p>
              </div>
              <div>
                <Truck className="w-5 h-5 text-[#D4AF37] mx-auto sm:mx-0" />
                <p className="text-xs text-black/60 dark:text-white/60 mt-2 leading-snug">
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
            className="relative flex flex-col"
          >
            <div className="rounded-lg border border-black/10 dark:border-white/15 bg-white/90 dark:bg-white/5 backdrop-blur-xl p-8 sm:p-10 shadow-2xl flex-1 flex flex-col justify-center">
              {showForm ? (
                <>
                  <span className="inline-flex items-center gap-2 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold mb-3">
                    <BadgeCheck className="w-4 h-4" />
                    Join Zaanisung
                  </span>
                  <h2
                    className="text-2xl sm:text-3xl font-light text-black dark:text-white"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {mode === "signup" ? "Create your account" : "Welcome back"}
                  </h2>
                  <p className="text-sm text-black/60 dark:text-white/60 mt-2 mb-6">
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

                  <div className="mt-6 pt-2">
                    <button
                      type="button"
                      onClick={() => { setMode(mode === "signup" ? "login" : "signup"); setError(null); }}
                      className="text-xs text-black/60 dark:text-white/60 hover:text-[#D4AF37] transition-colors"
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
                    className="text-2xl sm:text-3xl font-light text-black dark:text-white"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {isLoggedIn ? `Welcome, ${currentUser.name.split(" ")[0]}` : justCreated ? "You're all set" : "Welcome back"}
                  </h2>
                  <p className="text-sm text-black/60 dark:text-white/60 mt-3 mb-8">
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
                    className="mt-4 text-[11px] uppercase tracking-widest text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white font-semibold min-h-[44px]"
                  >
                    Browse the Collection
                  </button>
                </div>
              )}
            </div>

            {/* Floating tag */}
            <div className="hidden lg:flex absolute -bottom-5 -left-6 items-center gap-2 border border-black/10 dark:border-white/15 bg-white dark:bg-black px-4 py-3 rounded shadow-xl">
              <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
              <span className="text-xs text-black/60 dark:text-white/60">
                Rated <span className="text-black dark:text-white font-bold">4.9/5</span> by shoppers across Ghana
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── FEATURED COLLECTIONS ───────────────────────────────────── */}
      <section id="collections" className="bg-white dark:bg-black">
        <div className="w-full min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] px-4 sm:px-8 lg:px-12 py-16 sm:py-24 flex flex-col justify-center">
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
                className="text-3xl sm:text-4xl font-light mt-2 text-black dark:text-white"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Signature Collection
              </h2>
            </div>
            <button
              type="button"
              onClick={onBrowseShop}
              className="text-xs uppercase tracking-widest text-black/60 dark:text-white/60 hover:text-[#D4AF37] transition-colors min-h-[44px] flex items-center gap-2"
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {isLoadingProducts ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse aspect-square bg-white dark:bg-white/5 rounded" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-sm text-black/45 dark:text-white/45 py-10">
              New fragrances are being prepared. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
              {featured.map((product, i) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <ProductCard
                    product={product}
                    onSelect={onSelectProduct}
                    onAddToCart={onAddToCart}
                    isAdded={recentlyAddedId === product.id}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── ABOUT (split-screen) ───────────────────────────────────── */}
      <section id="about" className="bg-white dark:bg-black">
        <div className="w-full min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] px-4 sm:px-8 lg:px-12 py-16 sm:py-24 grid lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">Our Story</span>
            <h2
              className="text-3xl sm:text-4xl font-light mt-2 text-black dark:text-white leading-snug"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Born in the North.
              <span className="block italic text-[#D4AF37]">Worn everywhere.</span>
            </h2>
            <p className="mt-6 text-black/60 dark:text-white/60 leading-relaxed">
              Zaanisung is an artisanal fragrance house rooted in Tamale, Ghana.
              We blend rare oils and extracts into bold, long-lasting compositions
              inspired by the warmth of the savanna and the energy of Ghanaian life.
            </p>
            <p className="mt-4 text-black/60 dark:text-white/60 leading-relaxed">
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
                  <p className="text-2xl sm:text-3xl font-light text-black dark:text-white">{stat.value}</p>
                  <p className="text-[11px] uppercase tracking-widest text-black/45 dark:text-white/45 mt-1">{stat.label}</p>
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
            className="grid grid-cols-2 gap-5 auto-rows-fr"
          >
            {[
              { q: "\"The last scent I bought lasts all day. Truly premium.\"", a: "Akosua K.", role: "Accra" },
              { q: "\"Finally a Ghanaian fragrance that feels world-class.\"", a: "Kwame B.", role: "Kumasi" },
              { q: "\"The packaging alone is a gift-worthy experience.\"", a: "Adjoa S.", role: "Tamale" },
              { q: "\"Wear it to work, wear it to weddings — it never fades.\"", a: "Yaw M.", role: "Takoradi" },
            ].map((t, i) => (
              <div
                key={i}
                className={`rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 p-6 sm:p-8 flex flex-col justify-center min-h-[200px] lg:min-h-[240px] ${
                  i % 2 === 1 ? "lg:translate-y-6" : ""
                }`}
              >
                <div className="flex items-center gap-0.5 text-[#D4AF37] mb-3">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <p className="text-sm text-black/85 dark:text-white/85 leading-relaxed">"{t.q}"</p>
                <p className="mt-4 text-xs text-black/45 dark:text-white/45">
                  — <span className="text-black dark:text-white font-semibold">{t.a}</span>, {t.role}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── CRAFT / WHY US (split-screen) ──────────────────────────── */}
      <section id="craft" className="bg-white dark:bg-black">
        <div className="w-full min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] px-4 sm:px-8 lg:px-12 py-16 sm:py-24 flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-14"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold">The Craft</span>
            <h2
              className="text-3xl sm:text-4xl font-light mt-2 text-black dark:text-white"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Why Zaanisung
            </h2>
            <p className="mt-4 text-black/60 dark:text-white/60">
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
                  className="group rounded-lg border border-black/10 dark:border-white/15 bg-white dark:bg-white/5 p-7 sm:p-9 hover:border-[#D4AF37]/50 hover:bg-white dark:hover:bg-white/5 transition-all lg:min-h-[300px] flex flex-col justify-center"
                >
                  <div className="w-12 h-12 flex items-center justify-center border border-[#D4AF37]/40 bg-[#D4AF37]/10 mb-6 group-hover:rotate-6 transition-transform">
                    <Icon className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                  <h3 className="text-black dark:text-white font-semibold tracking-wide">{f.title}</h3>
                  <p className="text-sm sm:text-base text-black/60 dark:text-white/60 mt-2.5 leading-relaxed">{f.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-white dark:bg-black">
        <div className="pointer-events-none absolute inset-0" />
        <div className="w-full min-h-[calc(100vh-64px)] sm:min-h-[calc(100vh-72px)] px-4 sm:px-8 lg:px-12 py-20 sm:py-24 text-center relative flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2
              className="text-3xl sm:text-5xl font-light text-black dark:text-white leading-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Ready to find your signature scent?
            </h2>
            <p className="mt-4 text-black/60 dark:text-white/60 max-w-2xl mx-auto">
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
