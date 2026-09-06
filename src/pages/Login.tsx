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
    <div className="w-full max-w-md mx-auto py-4 sm:py-8">
      <div className="text-center mb-8 flex flex-col items-center">
        <Logo className="h-16 w-16 mb-3" />
        <h2
          className="text-2xl sm:text-3xl font-light italic tracking-widest text-black dark:text-white font-brand-serif"
        >
          ZAANISUNG
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-gold font-semibold mt-1">
          Exclusive Fragrances • Ent. GH
        </p>
        <p className="text-xs text-black/50 dark:text-white/50 mt-2">
          Sign in to access your bag and orders
        </p>
      </div>

      <div className="relative overflow-hidden surface-glass-strong corner-frame-static corner-frame p-6 sm:p-8 shadow-lift">
        <div className="absolute top-0 left-0 right-0 hairline-gold"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 orb orb-gold-faint" aria-hidden="true"></div>

        <form onSubmit={handleSubmit} className="relative space-y-5">
          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
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
            className="w-full mt-2 font-bold shadow-xs"
          >
            Sign In
          </Button>
        </form>

        <div className="relative mt-4 flex flex-col items-center space-y-3 text-center">
          <div className="w-full hairline-black mb-1" aria-hidden="true"></div>
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-xs text-black/85 dark:text-white/85 hover:text-gold dark:hover:text-gold font-medium min-h-[44px] flex items-center justify-center transition-colors"
          >
            Don't have an account? <span className="underline ml-1 font-bold">Create account</span>
          </button>

          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-[11px] uppercase tracking-widest text-black/45 dark:text-white/45 hover:text-black dark:text-white dark:hover:text-white font-semibold min-h-[44px] flex items-center justify-center transition-colors"
          >
            Skip & Browse Perfumes →
          </button>
        </div>
      </div>
    </div>
  );
};
