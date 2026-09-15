import React from "react";
import { BadgeCheck, CheckCircle2, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { CustomerUser } from "../../types";
import { Input } from "../Input";
import { Button } from "../Button";
import { DemoAuthNote } from "../auth/DemoAuthNote";
import { IS_DEMO_MODE } from "../../services/apiClient";
import { firstName } from "../../utils/name";
import { cn } from "../../utils/cn";

export type AuthMode = "signup" | "login";

interface LandingAuthCardProps {
  mode: AuthMode;
  showForm: boolean;
  isLoggedIn: boolean;
  justCreated: boolean;
  currentUser: CustomerUser | null;
  name: string;
  identifier: string;
  password: string;
  error: string | null;
  isLoading: boolean;
  onModeChange: (mode: AuthMode) => void;
  onNameChange: (value: string) => void;
  onIdentifierChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onStartShopping: () => void;
  onBrowseShop: () => void;
  onOpenDashboard?: () => void;
  onDemoAccount?: (user: CustomerUser) => void;
}

export const LandingAuthCard: React.FC<LandingAuthCardProps> = ({
  mode,
  showForm,
  isLoggedIn,
  justCreated,
  currentUser,
  name,
  identifier,
  password,
  error,
  isLoading,
  onModeChange,
  onNameChange,
  onIdentifierChange,
  onPasswordChange,
  onSubmit,
  onStartShopping,
  onBrowseShop,
  onOpenDashboard,
  onDemoAccount,
}) => {
  return (
    <motion.div
      id="auth-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
      className="relative flex flex-col lg:max-w-lg w-full justify-self-end lg:justify-self-center"
    >
      <div className="surface-glass-strong rounded-2xl p-7 sm:p-9 flex flex-col justify-center shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
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
            <div className="inline-flex self-start p-1 border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.06] mb-6 rounded-full">
              {(["signup", "login"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => onModeChange(m)}
                  className={cn(
                    "min-h-[44px] px-4 text-[10px] uppercase tracking-wider font-bold transition-colors rounded-full",
                    mode === m
                      ? "bg-ink text-cream dark:bg-gold dark:text-ink"
                      : "text-black/50 dark:text-white/50 hover:text-ink dark:hover:text-white"
                  )}
                >
                  {m === "signup" ? "Create" : "Sign in"}
                </button>
              ))}
            </div>

            <form onSubmit={onSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-950/40 border border-red-800 text-xs text-red-300 font-medium rounded-xl">
                  {error}
                </div>
              )}

              {mode === "signup" && (
                <Input
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={(e) => onNameChange(e.target.value)}
                  placeholder="Ama Mensah"
                  autoComplete="name"
                />
              )}

              <Input
                label="Phone or Email"
                type="text"
                value={identifier}
                onChange={(e) => onIdentifierChange(e.target.value)}
                placeholder="+233 24 000 0000 or you@mail.com"
                autoComplete="username"
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                required
              />

              <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                {mode === "signup" ? "Create Account" : "Sign In"}
              </Button>
            </form>

            {IS_DEMO_MODE && onDemoAccount && (
              <div className="mt-4">
                <DemoAuthNote compact onSuccess={onDemoAccount} />
              </div>
            )}

            <button
              type="button"
              onClick={() => onModeChange(mode === "signup" ? "login" : "signup")}
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
            <div className="w-16 h-16 bg-gold/15 border border-gold/50 flex items-center justify-center mx-auto mb-6 rounded-xl">
              <CheckCircle2 className="w-8 h-8 text-gold" />
            </div>
            <h2 className="font-brand-serif text-2xl sm:text-3xl font-light text-ink dark:text-white">
              {isLoggedIn
                ? `Welcome, ${firstName(currentUser?.name)}`
                : justCreated
                  ? "You're all set"
                  : "Welcome back"}
            </h2>
            <p className="text-sm text-black/60 dark:text-white/60 mt-3 mb-8">
              {isLoggedIn
                ? "Your store is ready — explore the latest drops."
                : "Start exploring our artisanal fragrance collection."}
            </p>

            <Button
              variant="primary"
              size="lg"
              onClick={isLoggedIn && onOpenDashboard ? onOpenDashboard : onStartShopping}
              className="w-full"
            >
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
    </motion.div>
  );
};