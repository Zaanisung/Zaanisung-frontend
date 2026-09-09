import React, { useState } from "react";
import type { FullUser } from "../../../types/user";
import { SectionCard } from "./SectionCard";
import { Bell } from "lucide-react";

interface NotificationPrefsCardProps {
  user: FullUser | null;
  onUpdateNotificationPrefs: (data: {
    orderUpdates?: boolean;
    promotions?: boolean;
    sms?: boolean;
    email?: boolean;
  }) => void;
}

const PREFS = [
  { key: "orderUpdates" as const, label: "Order Updates" },
  { key: "promotions" as const, label: "Promotions" },
  { key: "sms" as const, label: "SMS Notifications" },
  { key: "email" as const, label: "Email Notifications" },
];

export const NotificationPrefsCard: React.FC<NotificationPrefsCardProps> = ({
  user,
  onUpdateNotificationPrefs,
}) => {
  const [prefs, setPrefs] = useState(() => ({
    orderUpdates: user?.notificationPrefs?.orderUpdates ?? true,
    promotions: user?.notificationPrefs?.promotions ?? false,
    sms: user?.notificationPrefs?.sms ?? false,
    email: user?.notificationPrefs?.email ?? true,
  }));

  const toggle = (key: keyof typeof prefs) => {
    const next = { ...prefs, [key]: !prefs[key] };
    setPrefs(next);
    onUpdateNotificationPrefs({ [key]: next[key] });
  };

  return (
    <SectionCard
      icon={<Bell className="w-4 h-4 text-gold" />}
      title="Notification Preferences"
    >
      <div className="space-y-3">
        {PREFS.map((pref) => (
          <div
            key={pref.key}
            className="flex items-center justify-between py-2 border-b border-black/5 dark:border-white/10 last:border-0"
          >
            <span className="text-sm text-black dark:text-white">{pref.label}</span>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[pref.key]}
              onClick={() => toggle(pref.key)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer transition-colors rounded-full ${
                prefs[pref.key] ? "bg-gold" : "bg-black/20 dark:bg-white/20"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 bg-white shadow-sm transition-transform rounded-full ${
                  prefs[pref.key] ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>
        ))}
      </div>
    </SectionCard>
  );
};