import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { CustomerUser } from "../types";
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
    if (!password.trim() || password.length < 6) {
      setError("Please enter a secure password (at least 6 characters).");
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
    <div className="w-full max-w-md mx-auto py-4 sm:py-8">
      {/* Brand Header */}
      <div className="text-center mb-8 flex flex-col items-center">
        <Logo className="h-16 w-16 mb-3" />
        <h2
          className="text-2xl sm:text-3xl font-light italic tracking-widest text-black dark:text-white font-brand-serif"
        >
          ZAANISUNG
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mt-1">
          Create Customer Account
        </p>
        <p className="text-xs text-black/50 dark:text-white/50 mt-2">
          One-tap checkout and order tracking
        </p>
      </div>

      {/* Register Form */}
      <div className="relative overflow-hidden surface-glass-strong corner-frame-static corner-frame p-6 sm:p-8 shadow-lift">
        <div className="absolute top-0 left-0 right-0 hairline-gold"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 orb orb-gold-faint" aria-hidden="true"></div>

        <form onSubmit={handleSubmit} className="relative space-y-4">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
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
            label="Phone Number (Primary)"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+233 24 000 0000"
            required
          />

          <Input
            label="Email Address (Optional)"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="abena@gmail.com"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-3 font-bold shadow-xs"
          >
            Create Account
          </Button>
        </form>

        <div className="relative mt-4 text-center">
          <div className="w-full hairline-black mb-1" aria-hidden="true"></div>
          <button
            type="button"
            onClick={onNavigateToLogin}
            className="text-xs text-black/85 dark:text-white/85 hover:text-gold dark:hover:text-gold font-medium min-h-[44px] inline-flex items-center justify-center transition-colors"
          >
            Already have an account? <span className="underline ml-1 font-bold">Sign in</span>
          </button>
        </div>
      </div>
    </div>
  );
};
