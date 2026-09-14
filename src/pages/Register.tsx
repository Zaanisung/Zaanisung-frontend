import React, { useState } from "react";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { AuthShell } from "../components/auth/AuthShell";
import { CustomerUser } from "../types";
import { VALIDATION, PASSWORD_REGEX } from "../constants";
import * as api from "../services";
import { getErrorMessage } from "../services";

export interface RegisterProps {
  onRegister: (user: CustomerUser) => void;
  onNavigateToLogin: () => void;
  onReturnToLanding: () => void;
}

export const Register: React.FC<RegisterProps> = ({
  onRegister,
  onNavigateToLogin,
  onReturnToLanding,
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
    <AuthShell
      brandStatement="Zaanisung Exclusive Fragrances"
      heading="Create Account"
      subheading="One-tap checkout and order tracking"
      panelTitle="Join Our Fragrance Community"
      panelBody="Create your account to unlock exclusive access to premium perfumes, personalized recommendations, and seamless checkout."
      features={[
        "One-Tap Checkout Experience",
        "Track Orders in Real-Time",
        "Save Your Favorite Scents",
      ]}
      onBack={onReturnToLanding}
    >
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
    </AuthShell>
  );
};