import React, { useEffect, useState } from "react";
import { Logo } from "../Logo";
import { Input } from "../Input";
import { Button } from "../Button";
import { CustomerUser } from "../../types";
import { VALIDATION, PASSWORD_REGEX, PASSWORD_RULE_MESSAGE } from "../../constants";
import * as api from "../../services";
import { getErrorMessage } from "../../services";
import { cn } from "../../utils/cn";
import { X, Lock } from "lucide-react";

export interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  /** Called with the freshly signed-in / registered user. */
  onSuccess: (user: CustomerUser) => void;
}

type Tab = "login" | "register";

/**
 * Compact sign-in / create-account modal used to gate checkout for guests.
 * Visually self-contained (no storefront chrome) and reuses the same API calls
 * as the full Login / Register pages.
 */
export const AuthModal: React.FC<AuthModalProps> = ({ open, onClose, onSuccess }) => {
  const [tab, setTab] = useState<Tab>("login");
  const [name, setName] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) {
      window.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    // Reset transient state each time the modal opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setError(null);
    setIsLoading(false);
  }, [open]);

  const switchTab = (next: Tab) => {
    setTab(next);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (tab === "register") {
      if (!name.trim()) {
        setError("Please enter your full name.");
        return;
      }
      if (!identifier.trim()) {
        setError("Please enter your phone number or email.");
        return;
      }
      if (!password.trim() || password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
        setError(`Please enter a secure password (at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters).`);
        return;
      }
      if (!PASSWORD_REGEX.test(password)) {
        setError(PASSWORD_RULE_MESSAGE);
        return;
      }
    } else {
      if (!identifier.trim()) {
        setError("Please enter your phone number or email.");
        return;
      }
      if (!password.trim()) {
        setError("Please enter your password.");
        return;
      }
    }

    setIsLoading(true);
    setError(null);

    try {
      const user =
        tab === "register"
          ? (
              await api.registerUser({
                name: name.trim(),
                phone: /^\d/.test(identifier.trim())
                  ? identifier.trim()
                  : undefined,
                email: identifier.includes("@") ? identifier.trim() : undefined,
                password,
              })
            ).user
          : (
              await api.loginUser(identifier, password)
            ).user;

      onSuccess({
        id: user.id,
        name: user.name,
        phone: user.phone || "",
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Something went wrong. Please try again."));
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-heading"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl surface-glass-strong shadow-lift animate-zoom-in">
        <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />

        <div className="flex items-start justify-between p-5 pb-0">
          <div className="flex-1 min-w-0">
            <Logo className="h-6 sm:h-7" showWordmark />
            <span className="eyebrow text-gold mt-1 flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Secure Checkout
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-black/50 dark:text-white/50 hover:text-ink dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-5 pt-4">
          <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/10">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => switchTab(t)}
                className={cn(
                  "min-h-[44px] rounded-lg text-[11px] uppercase tracking-widest font-bold transition-colors",
                  tab === t
                    ? "bg-gold text-ink shadow-xs"
                    : "text-black/55 dark:text-white/55 hover:text-black dark:hover:text-white"
                )}
              >
                {t === "login" ? "Sign In" : "Create Account"}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-sm text-black/60 dark:text-white/65">
            {tab === "login"
              ? "Sign in to continue to checkout. Your bag is safe."
              : "Create an account to complete your order."}
          </div>

          {error && (
            <div className="rounded-xl p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300 font-medium">
              {error}
            </div>
          )}

          {tab === "register" && (
            <Input
              label="Full Name"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError(null);
              }}
              placeholder="e.g. Abena Serwaa"
              autoComplete="name"
              required
            />
          )}

          <Input
            label="Phone Number or Email"
            type="text"
            value={identifier}
            onChange={(e) => {
              setIdentifier(e.target.value);
              if (error) setError(null);
            }}
            placeholder={tab === "register" ? "+233 24 000 0000" : "you@mail.com or +233..."}
            autoComplete="username"
            required
            autoFocus
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
            autoComplete={tab === "login" ? "current-password" : "new-password"}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full"
          >
            {tab === "login" ? "Sign In & Continue" : "Create Account & Continue"}
          </Button>

          <button
            type="button"
            onClick={onClose}
            className="w-full text-center text-[11px] uppercase tracking-widest text-black/45 dark:text-white/45 hover:text-ink dark:hover:text-white font-semibold min-h-[44px] transition-colors"
          >
            Continue Shopping as Guest
          </button>
        </form>
      </div>
    </div>
  );
};