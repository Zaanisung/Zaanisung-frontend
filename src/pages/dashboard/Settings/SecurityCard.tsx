import React, { useState } from "react";
import { Loader } from "../../../components/ui/Loader";
import { VALIDATION, PASSWORD_REGEX } from "../../../constants";
import { SectionCard, settingsInputClass } from "./SectionCard";
import { Lock } from "lucide-react";

interface SecurityCardProps {
  changingPassword: boolean;
  passwordError: string | null;
  passwordMessage: string | null;
  onChangePassword: (data: { currentPassword: string; newPassword: string }) => void;
}

export const SecurityCard: React.FC<SecurityCardProps> = ({
  changingPassword,
  passwordError,
  passwordMessage,
  onChangePassword,
}) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordInputError, setPasswordInputError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordInputError(null);
    if (!newPassword || newPassword.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      setPasswordInputError(
        `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters.`
      );
      return;
    }
    if (!PASSWORD_REGEX.test(newPassword)) {
      setPasswordInputError(
        "Password must include an uppercase letter, a lowercase letter, a number and a special character."
      );
      return;
    }
    onChangePassword({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
  };

  return (
    <SectionCard icon={<Lock className="w-4 h-4 text-gold" />} title="Security">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className={settingsInputClass}
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            minLength={VALIDATION.PASSWORD_MIN_LENGTH}
            placeholder={`At least ${VALIDATION.PASSWORD_MIN_LENGTH} chars with uppercase, lowercase, number & special character`}
            className={settingsInputClass}
          />
        </div>

        {passwordInputError && (
          <p className="text-xs text-red-600 dark:text-red-400">{passwordInputError}</p>
        )}
        {!passwordInputError && passwordError && (
          <p className="text-xs text-red-600 dark:text-red-400">{passwordError}</p>
        )}
        {passwordMessage && (
          <p className="text-xs text-green-600 dark:text-green-400">{passwordMessage}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={changingPassword}
            className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 disabled:opacity-50 transition-colors flex items-center gap-2 rounded-lg"
          >
            {changingPassword ? <Loader variant="dots" size="sm" /> : <Lock className="w-4 h-4" />}
            <span>Update Password</span>
          </button>
        </div>
      </form>
    </SectionCard>
  );
};