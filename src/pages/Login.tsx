import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { Logo } from "../components/Logo";
import { CustomerUser } from "../types";
import * as api from "../api";
import { getErrorMessage } from "../api";

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
          className="text-2xl sm:text-3xl font-light italic tracking-widest text-gray-900 dark:text-gray-100"
          style={{ fontFamily: "Georgia, serif" }}
        >
          ZAANISUNG
        </h2>
        <p className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] font-semibold mt-1">
          Exclusive Fragrances • Ent. GH
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Sign in to access your bag and orders
        </p>
      </div>

      <div className="bg-white dark:bg-[#131317] border border-gray-200 dark:border-[#22222A] p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-5">
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

        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-[#202028] flex flex-col items-center space-y-3 text-center">
          <button
            type="button"
            onClick={onNavigateToRegister}
            className="text-xs text-gray-800 dark:text-gray-200 hover:text-[#D4AF37] dark:hover:text-[#D4AF37] font-medium min-h-[44px] flex items-center justify-center transition-colors"
          >
            Don't have an account? <span className="underline ml-1 font-bold">Create account</span>
          </button>

          <button
            type="button"
            onClick={onContinueAsGuest}
            className="text-[11px] uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white font-semibold min-h-[44px] flex items-center justify-center transition-colors"
          >
            Skip & Browse Perfumes →
          </button>
        </div>
      </div>
    </div>
  );
};
