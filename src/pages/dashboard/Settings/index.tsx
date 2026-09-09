import React from "react";
import type { FullUser } from "../../../types/user";
import { ProfileCard } from "./ProfileCard";
import { SecurityCard } from "./SecurityCard";
import { AppearanceCard } from "./AppearanceCard";
import { NotificationPrefsCard } from "./NotificationPrefsCard";
import { SessionCard } from "./SessionCard";

export interface SettingsProps {
  user: FullUser | null;
  updatingProfile: boolean;
  changingPassword: boolean;
  profileError: string | null;
  passwordError: string | null;
  profileMessage: string | null;
  passwordMessage: string | null;
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

export const Settings: React.FC<SettingsProps> = ({
  user,
  updatingProfile,
  changingPassword,
  profileError,
  passwordError,
  profileMessage,
  passwordMessage,
  onUpdateProfile,
  onChangePassword,
  onUpdateAppearance,
  onUpdateNotificationPrefs,
  onLogout,
}) => {
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

      <ProfileCard
        key={`profile|${user?.name ?? ""}|${user?.phone ?? ""}|${user?.email ?? ""}`}
        user={user}
        updatingProfile={updatingProfile}
        profileError={profileError}
        profileMessage={profileMessage}
        onUpdateProfile={onUpdateProfile}
      />

      <SecurityCard
        changingPassword={changingPassword}
        passwordError={passwordError}
        passwordMessage={passwordMessage}
        onChangePassword={onChangePassword}
      />

      <AppearanceCard
        key={`appearance|${user?.appearance?.theme ?? ""}|${user?.appearance?.accentColor ?? ""}`}
        user={user}
        onUpdateAppearance={onUpdateAppearance}
      />

      <NotificationPrefsCard
        key={`notifs|${user?.notificationPrefs?.orderUpdates}|${user?.notificationPrefs?.promotions}|${user?.notificationPrefs?.sms}|${user?.notificationPrefs?.email}`}
        user={user}
        onUpdateNotificationPrefs={onUpdateNotificationPrefs}
      />

      <SessionCard onLogout={onLogout} />
    </div>
  );
};