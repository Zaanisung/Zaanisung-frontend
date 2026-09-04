import React, { useState } from "react";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { ArrowLeft } from "lucide-react";
import * as api from "../../api";
import { getErrorMessage } from "../../api";

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
    <div className="min-h-screen bg-[#0A0A0C] text-[#E4E4E7] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-sm">
        <button
          type="button"
          onClick={onReturnToStorefront}
          className="min-h-[44px] inline-flex items-center text-xs uppercase tracking-widest text-gray-400 hover:text-white mb-8 transition-colors font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Customer Store
        </button>

        <div className="text-center mb-8">
          <h1
            className="text-2xl font-light italic tracking-[0.2em] text-white"
            style={{ fontFamily: "Georgia, serif" }}
          >
            ZAANISUNG
          </h1>
          <div className="inline-block bg-[#D4AF37] text-black text-[9px] uppercase tracking-widest px-2 py-0.5 font-bold mt-2">
            Admin Inventory Portal
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Restricted to Zaanisung staff & inventory managers
          </p>
        </div>

        <div className="bg-[#121216] border border-[#22222A] p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 text-xs text-red-300 font-medium">
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
