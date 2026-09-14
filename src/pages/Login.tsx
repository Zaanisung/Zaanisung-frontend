import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AuthShell } from "../components/auth/AuthShell";
import { CustomerUser } from "../types";
import * as api from "../services";
import { getErrorMessage, IS_DEMO_MODE } from "../services/apiClient";

export interface LoginProps {
  onLogin: (user: CustomerUser) => void;
  onNavigateToRegister: () => void;
  onContinueAsGuest: () => void;
  onReturnToLanding: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  onNavigateToRegister,
  onContinueAsGuest,
  onReturnToLanding,
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
    <AuthShell
      brandStatement="Zaanisung Exclusive Fragrances"
      heading="Welcome Back"
      subheading="Sign in to access your bag and orders"
      panelTitle="Discover Your Signature Scent"
      panelBody="Curated collection of premium fragrances from around the world. Experience luxury perfumery delivered to your doorstep."
      features={[
        "Authentic Designer Fragrances",
        "Fast Delivery Across Ghana",
        "Secure Payment Options",
      ]}
      onBack={onReturnToLanding}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {IS_DEMO_MODE && (
          <div className="rounded-xl p-3 bg-gold/10 border border-gold/40 text-[11px] text-ink/80 dark:text-cream/80 font-medium leading-relaxed">
            <strong className="text-gold">Demo mode</strong> — enter any email/phone and password.
            Include <strong>admin</strong> in the email to sign in as a seller.
          </div>
        )}

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
    </AuthShell>
  );
};