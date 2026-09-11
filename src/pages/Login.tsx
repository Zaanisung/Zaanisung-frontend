import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { CustomerUser } from "../types";
import * as api from "../services";
import { getErrorMessage } from "../services";

export interface LoginProps {
  onLogin: (user: CustomerUser) => void;
  onNavigateToRegister: () => void;
  onContinueAsGuest: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  onNavigateToRegister,
  onContinueAsGuest,
}) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError("Please enter your phone number or email.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { user } = await api.loginUser(identifier, password);
      onLogin({
        id: user.id,
        name: user.name,
        phone: user.phone || identifier,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Invalid credentials. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row">
      {/* Left Side - Branding & Imagery (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-gradient-to-br from-ink via-ink-900 to-ink-800 weave-bg">
        {/* Kente trim along the inner edge */}
        <div className="absolute inset-y-0 right-0 w-2 kente-band kente-band-vertical" aria-hidden="true"></div>
        <div className="absolute bottom-0 inset-x-0 kente-band h-1.5" aria-hidden="true"></div>
        {/* Atmospheric mist effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-96 h-96 orb orb-gold-soft animate-mist-float"></div>
          <div className="absolute bottom-32 right-32 w-80 h-80 orb orb-cream animate-mist-float [animation-delay:2s]"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 orb orb-gold-faint animate-mist-drift"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-16 text-cream w-full items-start text-left">
          <div>
            <Logo className="h-16 w-16 mb-6" />
            <h1 className="text-5xl xl:text-6xl font-light tracking-widest font-brand-serif mb-3">
              ZAANISUNG
            </h1>
            <p className="text-sm uppercase tracking-[0.25em] text-gold-300 font-semibold">
              Exclusive Fragrances • Ent. GH
            </p>
          </div>

          <div className="space-y-8">
            <div className="space-y-4 max-w-md">
              <h2 className="text-2xl xl:text-3xl font-brand-serif font-light leading-relaxed">
                Discover Your Signature Scent
              </h2>
              <p className="text-sm text-cream/70 leading-relaxed">
                Curated collection of premium fragrances from around the world. Experience luxury perfumery delivered to your doorstep.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 text-xs uppercase tracking-wider text-cream/60">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                <span>Authentic Designer Fragrances</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                <span>Fast Delivery Across Ghana</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                <span>Secure Payment Options</span>
              </div>
            </div>
          </div>

          {/* Decorative mist overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/40 to-transparent pointer-events-none"></div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-cream-50 dark:bg-ink-950 relative overflow-hidden">
        {/* Subtle background orbs for mobile/form side */}
        <div className="absolute inset-0 opacity-20 lg:opacity-10">
          <div className="absolute top-20 right-20 w-64 h-64 orb orb-gold-faint animate-mist-pulse"></div>
          <div className="absolute bottom-40 left-20 w-48 h-48 orb orb-cream animate-mist-pulse [animation-delay:1.5s]"></div>
        </div>

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
                Welcome Back
              </h3>
              <p className="text-sm text-black/60 dark:text-white/60">
                Sign in to access your bag and orders
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Phone Number or Email"
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
                autoComplete="current-password"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-6"
              >
                Sign In
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 space-y-4 text-center">
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-sm text-ink/80 dark:text-cream/80 hover:text-gold transition-colors duration-[400ms] min-h-[44px] flex items-center justify-center w-full"
              >
                Don't have an account? <span className="underline ml-1.5 font-semibold">Create account</span>
              </button>

              <button
                type="button"
                onClick={onContinueAsGuest}
                className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-ink dark:hover:text-cream font-semibold min-h-[44px] flex items-center justify-center w-full transition-colors duration-[400ms]"
              >
                Skip & Browse Perfumes →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
