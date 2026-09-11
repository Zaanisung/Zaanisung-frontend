import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { CustomerUser } from "../types";
import { VALIDATION, PASSWORD_REGEX } from "../constants";
import * as api from "../services";
import { getErrorMessage } from "../services";

export interface RegisterProps {
  onRegister: (user: CustomerUser) => void;
  onNavigateToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onRegister,
  onNavigateToLogin,
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!password.trim() || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      setError(
        `Please enter a secure password (at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters).`
      );
      return;
    }
    if (!PASSWORD_REGEX.test(password)) {
      setError(
        "Password must include an uppercase letter, a lowercase letter, a number and a special character."
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { user } = await api.registerUser({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || undefined,
        password,
      });
      onRegister({
        id: user.id,
        name: user.name,
        phone: user.phone || phone.trim(),
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Registration failed. Please try again."));
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
                Join Our Fragrance Community
              </h2>
              <p className="text-sm text-cream/70 leading-relaxed">
                Create your account to unlock exclusive access to premium perfumes, personalized recommendations, and seamless checkout.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 text-xs uppercase tracking-wider text-cream/60">
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                <span>One-Tap Checkout Experience</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                <span>Track Orders in Real-Time</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gold"></div>
                <span>Save Your Favorite Scents</span>
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
                Create Account
              </h3>
              <p className="text-sm text-black/60 dark:text-white/60">
                One-tap checkout and order tracking
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="rounded-xl p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 font-medium">
                  {error}
                </div>
              )}

              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Abena Serwaa"
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+233 24 000 0000"
                helperText="Primary contact for order updates"
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="abena@gmail.com"
                helperText="Optional - for receipts and notifications"
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                helperText={`Minimum ${VALIDATION.PASSWORD_MIN_LENGTH} characters with uppercase, lowercase, number & special character`}
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="lg"
                isLoading={isLoading}
                className="w-full mt-6"
              >
                Create Account
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-black/10 dark:border-white/10 text-center">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="text-sm text-ink/80 dark:text-cream/80 hover:text-gold transition-colors duration-[400ms] min-h-[44px] flex items-center justify-center w-full"
              >
                Already have an account? <span className="underline ml-1.5 font-semibold">Sign in</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
