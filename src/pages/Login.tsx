import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AuthShell } from "../components/auth/AuthShell";
import { CustomerUser } from "../types";
import * as api from "../services";
import { getErrorMessage } from "../services/apiClient";

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

  // Forgot-password recovery flow (OTP-based, database-backed).
  const [showForgot, setShowForgot] = useState(false);
  const [recoveryStep, setRecoveryStep] = useState<"request" | "reset" | "done">("request");
  const [recIdentifier, setRecIdentifier] = useState("");
  const [recCode, setRecCode] = useState("");
  const [recPassword, setRecPassword] = useState("");
  const [recLoading, setRecLoading] = useState(false);
  const [recError, setRecError] = useState<string | null>(null);
  const [recInfo, setRecInfo] = useState<string | null>(null);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recIdentifier.trim()) {
      setRecError("Please enter your registered phone number or email.");
      return;
    }
    setRecLoading(true);
    setRecError(null);
    setRecInfo(null);
    try {
      const res = await api.requestPasswordResetOtp(recIdentifier.trim());
      const devHint =
        import.meta.env.DEV && res.devCode
          ? ` (dev code: ${res.devCode} — SMS/email gateway not configured)`
          : "";
      setRecInfo(
        `A verification code has been sent to your phone or email. It expires in ${res.expiresInMinutes} minutes.${devHint}`
      );
      setRecoveryStep("reset");
    } catch (err) {
      setRecError(getErrorMessage(err, "Could not send a reset code. Please try again."));
    } finally {
      setRecLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recCode.trim()) {
      setRecError("Please enter the verification code you received.");
      return;
    }
    if (recPassword.length < 8) {
      setRecError("Your new password must be at least 8 characters long.");
      return;
    }
    setRecLoading(true);
    setRecError(null);
    try {
      await api.resetPasswordWithOtp(recIdentifier.trim(), recCode.trim(), recPassword);
      setRecoveryStep("done");
      setRecInfo("Your password has been reset. You can now sign in with your new password.");
    } catch (err) {
      setRecError(getErrorMessage(err, "Could not reset your password. The code may have expired — request a new one."));
    } finally {
      setRecLoading(false);
    }
  };

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
      {showForgot ? (
        <div className="space-y-5">
          {recInfo && (
            <div className="rounded-xl p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-300 font-medium">
              {recInfo}
            </div>
          )}
          {recError && (
            <div className="rounded-xl p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 font-medium">
              {recError}
            </div>
          )}

          {recoveryStep === "request" && (
            <form onSubmit={handleRequestReset} className="space-y-5">
              <div className="mb-2">
                <h3 className="text-xl font-brand-serif font-light text-ink dark:text-cream mb-1">
                  Reset your password
                </h3>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Enter the phone number or email on your account. We'll send you a
                  one-time code to reset your password.
                </p>
              </div>
              <Input
                label="Phone Number or Email"
                type="text"
                value={recIdentifier}
                onChange={(e) => { setRecIdentifier(e.target.value); if (recError) setRecError(null); }}
                placeholder="+233 24 000 0000 or you@mail.com"
                autoComplete="username"
                required
              />
              <Button type="submit" variant="primary" size="lg" isLoading={recLoading} className="w-full">
                Send Reset Code
              </Button>
            </form>
          )}

          {recoveryStep === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="mb-2">
                <h3 className="text-xl font-brand-serif font-light text-ink dark:text-cream mb-1">
                  Enter the code &amp; your new password
                </h3>
                <p className="text-sm text-black/60 dark:text-white/60">
                  Use the one-time code sent to {recIdentifier.trim()}.
                </p>
              </div>
              <Input
                label="Verification Code"
                type="text"
                value={recCode}
                onChange={(e) => { setRecCode(e.target.value); if (recError) setRecError(null); }}
                placeholder="6-digit code"
                autoComplete="one-time-code"
                inputMode="numeric"
                required
              />
              <Input
                label="New Password"
                type="password"
                value={recPassword}
                onChange={(e) => { setRecPassword(e.target.value); if (recError) setRecError(null); }}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                required
              />
              <Button type="submit" variant="primary" size="lg" isLoading={recLoading} className="w-full">
                Reset Password
              </Button>
            </form>
          )}

          {recoveryStep === "done" && (
            <div className="space-y-4">
              <div className="rounded-xl p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                Your password has been reset successfully.
              </div>
              <Button
                type="button"
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => {
                  setShowForgot(false);
                  setRecoveryStep("request");
                  setRecIdentifier("");
                  setRecCode("");
                  setRecPassword("");
                  setRecInfo(null);
                }}
              >
                Back to Sign In
              </Button>
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              setShowForgot(false);
              setRecoveryStep("request");
              setRecError(null);
              setRecInfo(null);
            }}
            className="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 hover:text-ink dark:hover:text-cream font-semibold min-h-[44px] flex items-center justify-center w-full transition-colors duration-[400ms]"
          >
            ← Back to Sign In
          </button>
        </div>
      ) : (
        <>
          {error && (
            <div className="rounded-xl p-4 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-300 font-medium">
              {error}
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

        <button
          type="button"
          onClick={() => {
            setShowForgot(true);
            setRecError(null);
            setRecInfo(null);
          }}
          className="text-right w-full text-xs font-semibold text-ink/70 dark:text-cream/70 hover:text-gold transition-colors min-h-[44px] flex items-center justify-end"
        >
          Forgot Password?
        </button>

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
        </>
      )}
    </AuthShell>
  );
};