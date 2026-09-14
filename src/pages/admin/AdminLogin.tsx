import React, { useState } from "react";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Logo } from "../../components/Logo";
import { ArrowLeft } from "lucide-react";
import * as api from "../../services";
import { getErrorMessage, IS_DEMO_MODE } from "../../services/apiClient";

export interface AdminLoginProps {
  onLoginSuccess: () => void;
  onReturnToStorefront: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onReturnToStorefront,
}) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim() || !password.trim()) {
      setError("Please enter your email/phone and password.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { user } = await api.loginUser(identifier, password);
      if (user.role !== "ADMIN") {
        setError("This account does not have admin access.");
        return;
      }
      onLoginSuccess();
    } catch (err) {
      setError(getErrorMessage(err, "Invalid credentials. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
    <div className="absolute top-20 right-24 w-72 h-72 orb orb-gold-faint animate-mist-pulse" aria-hidden="true"></div>
    <div className="absolute -bottom-24 left-1/4 w-80 h-80 orb orb-gold-faint animate-mist-float" aria-hidden="true"></div>

    <div className="relative w-full max-w-sm z-10">
        <button
          type="button"
          onClick={onReturnToStorefront}
          className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white mb-8 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customer Store
        </button>

        <div className="text-center mb-8 flex flex-col items-center">
          <Logo className="h-14 w-14 mb-3" />
          <h1
            className="text-2xl font-light tracking-[0.2em] text-black dark:text-white font-brand-serif"
          >
            ZAANISUNG
          </h1>
          <div className="inline-block rounded-lg bg-gold text-black text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold mt-2">
            Admin Inventory Portal
          </div>
          <p className="text-xs text-black/50 dark:text-white/50 mt-2">
            Restricted to Zaanisung staff & inventory managers
          </p>
        </div>

        <div className="relative overflow-hidden surface-glass-strong rounded-2xl p-6 sm:p-8 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
          <div className="absolute top-0 left-0 right-0 hairline-gold"></div>
          <form onSubmit={handleSubmit} className="relative space-y-4">
            {IS_DEMO_MODE && (
              <div className="p-3 bg-gold/10 border border-gold/40 text-[11px] text-ink/80 dark:text-cream/80 font-medium rounded-xl leading-relaxed">
                <strong className="text-gold">Demo mode</strong> — enter any email containing <strong>admin</strong> (e.g. admin@demo.de) and any password to access the seller portal.
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 text-xs text-red-300 font-medium rounded-xl">
                {error}
              </div>
            )}

            <Input
              label="Email or Phone"
              type="text"
              value={identifier}
              onChange={(e) => { setIdentifier(e.target.value); if (error) setError(null); }}
              placeholder="admin@zaanisung.com or phone"
              autoComplete="username"
              autoFocus
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
              className="w-full mt-2"
            >
              Access Admin Portal
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
