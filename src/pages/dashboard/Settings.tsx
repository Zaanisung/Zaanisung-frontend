import React, { useState } from "react";
import type { FullUser } from "../../types/user";
import { Button } from "../../components/Button";
import { Loader } from "../../components/ui/Loader";
import {
  User,
  Lock,
  Palette,
  Bell,
  LogOut,
  Save,
} from "lucide-react";

export interface SettingsProps {
  user: FullUser | null;
  updatingProfile: boolean;
  changingPassword: boolean;
  profileError: string | null;
  passwordError: string | null;
  profileMessage: string | null;
  onUpdateProfile: (data: {
    name?: string;
    phone?: string;
    email?: string;
  }) => void;
  onChangePassword: (data: {
    currentPassword: string;
    newPassword: string;
  }) => void;
  onUpdateAppearance: (data: {
    theme?: "light" | "dark" | "system";
    accentColor?: string;
  }) => void;
  onUpdateNotificationPrefs: (data: {
    orderUpdates?: boolean;
    promotions?: boolean;
    sms?: boolean;
    email?: boolean;
  }) => void;
  onLogout: () => void;
}

const accentSwatches = [
  { value: "#d4af37", label: "Gold" },
  { value: "#1a1a1a", label: "Obsidian" },
  { value: "#8b5e3c", label: "Amber" },
  { value: "#c2b280", label: "Sand" },
  { value: "#4a6741", label: "Sage" },
  { value: "#7c3aed", label: "Violet" },
];

export const Settings: React.FC<SettingsProps> = ({
  user,
  updatingProfile,
  changingPassword,
  profileError,
  passwordError,
  profileMessage,
  onUpdateProfile,
  onChangePassword,
  onUpdateAppearance,
  onUpdateNotificationPrefs,
  onLogout,
}) => {
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    user?.appearance?.theme ?? "system"
  );
  const [accentColor, setAccentColor] = useState(
    user?.appearance?.accentColor ?? "#d4af37"
  );

  const [orderUpdates, setOrderUpdates] = useState(
    user?.notificationPrefs?.orderUpdates ?? true
  );
  const [promotions, setPromotions] = useState(
    user?.notificationPrefs?.promotions ?? true
  );
  const [smsNotif, setSmsNotif] = useState(
    user?.notificationPrefs?.sms ?? false
  );
  const [emailNotif, setEmailNotif] = useState(
    user?.notificationPrefs?.email ?? true
  );

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, phone, email });
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onChangePassword({ currentPassword, newPassword });
    setCurrentPassword("");
    setNewPassword("");
  };

  const inputClass =
    "w-full min-h-[44px] px-3 py-2 text-sm bg-white dark:bg-white/5 border border-black/15 dark:border-white/20 text-black dark:text-white placeholder-black/30 dark:placeholder-white/30 focus:outline-none focus:border-gold transition-colors";

  const sectionCard = "border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] p-5 sm:p-6 space-y-5";

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div>
        <p className="eyebrow text-black/45 dark:text-white/45 mb-1">
          Account Configuration
        </p>
        <h2 className="text-2xl font-light text-black dark:text-white font-brand-serif">
          Settings
        </h2>
      </div>

      {/* Profile */}
      <div className={sectionCard}>
        <div className="flex items-center gap-2 pb-3 border-b border-black/5 dark:border-white/10">
          <User className="w-4 h-4 text-gold" />
          <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
            Profile
          </h3>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </div>

          {profileError && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {profileError}
            </p>
          )}
          {profileMessage && (
            <p className="text-xs text-green-600 dark:text-green-400">
              {profileMessage}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={updatingProfile}
              className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {updatingProfile ? (
                <Loader variant="dots" size="sm" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>

      {/* Security */}
      <div className={sectionCard}>
        <div className="flex items-center gap-2 pb-3 border-b border-black/5 dark:border-white/10">
          <Lock className="w-4 h-4 text-gold" />
          <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
            Security
          </h3>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-1.5">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              className={inputClass}
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
              minLength={8}
              className={inputClass}
            />
          </div>

          {passwordError && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {passwordError}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={changingPassword}
              className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {changingPassword ? (
                <Loader variant="dots" size="sm" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              <span>Update Password</span>
            </button>
          </div>
        </form>
      </div>

      {/* Appearance */}
      <div className={sectionCard}>
        <div className="flex items-center gap-2 pb-3 border-b border-black/5 dark:border-white/10">
          <Palette className="w-4 h-4 text-gold" />
          <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
            Appearance
          </h3>
        </div>

        <div className="space-y-5">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-2">
              Theme
            </label>
            <div className="flex gap-2">
              {(["light", "dark", "system"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTheme(t);
                    onUpdateAppearance({ theme: t });
                  }}
                  className={`min-h-[44px] px-4 text-[10px] uppercase tracking-wider font-bold transition-colors ${
                    theme === t
                      ? "text-ink bg-gold border border-gold-700/70"
                      : "text-black/60 dark:text-white/60 border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-widest text-black/45 dark:text-white/45 font-bold block mb-2">
              Accent Color
            </label>
            <div className="flex gap-3">
              {accentSwatches.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  title={s.label}
                  onClick={() => {
                    setAccentColor(s.value);
                    onUpdateAppearance({ accentColor: s.value });
                  }}
                  className={`w-9 h-9 flex-shrink-0 border-2 transition-all ${
                    accentColor === s.value
                      ? "border-gold scale-110 ring-2 ring-gold/40"
                      : "border-black/10 dark:border-white/20 hover:scale-105"
                  }`}
                  style={{ backgroundColor: s.value }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className={sectionCard}>
        <div className="flex items-center gap-2 pb-3 border-b border-black/5 dark:border-white/10">
          <Bell className="w-4 h-4 text-gold" />
          <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
            Notification Preferences
          </h3>
        </div>

        <div className="space-y-3">
          {[
            {
              label: "Order Updates",
              checked: orderUpdates,
              onChange: (v: boolean) => setOrderUpdates(v),
              key: "orderUpdates" as const,
            },
            {
              label: "Promotions",
              checked: promotions,
              onChange: (v: boolean) => setPromotions(v),
              key: "promotions" as const,
            },
            {
              label: "SMS Notifications",
              checked: smsNotif,
              onChange: (v: boolean) => setSmsNotif(v),
              key: "sms" as const,
            },
            {
              label: "Email Notifications",
              checked: emailNotif,
              onChange: (v: boolean) => setEmailNotif(v),
              key: "email" as const,
            },
          ].map((pref) => (
            <div
              key={pref.key}
              className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/10 last:border-0"
            >
              <span className="text-sm text-black dark:text-white">
                {pref.label}
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={pref.checked}
                onClick={() => {
                  const newVal = !pref.checked;
                  pref.onChange(newVal);
                  onUpdateNotificationPrefs({ [pref.key]: newVal });
                }}
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer transition-colors ${
                  pref.checked ? "bg-gold" : "bg-black/20 dark:bg-white/20"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 bg-white shadow-sm transition-transform ${
                    pref.checked ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <div className="border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-black dark:text-white">
              Session
            </h3>
            <p className="text-xs text-black/50 dark:text-white/50 mt-0.5">
              Sign out of your account on this device.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={onLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-950/40 border-red-200 dark:border-red-900 font-bold"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
