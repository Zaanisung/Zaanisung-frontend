import React, { useState } from "react";
import type { FullUser } from "../../../types/user";
import { Loader } from "../../../components/ui/Loader";
import { SectionCard, settingsInputClass } from "./SectionCard";
import { User, Save } from "lucide-react";

interface ProfileCardProps {
  user: FullUser | null;
  updatingProfile: boolean;
  profileError: string | null;
  profileMessage: string | null;
  onUpdateProfile: (data: { name?: string; phone?: string; email?: string }) => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  updatingProfile,
  profileError,
  profileMessage,
  onUpdateProfile,
}) => {
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name, phone, email });
  };

  return (
    <SectionCard icon={<User className="w-4 h-4 text-gold" />} title="Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
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
              className={settingsInputClass}
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
              className={settingsInputClass}
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
            className={settingsInputClass}
          />
        </div>

        {profileError && (
          <p className="text-xs text-red-600 dark:text-red-400">{profileError}</p>
        )}
        {profileMessage && (
          <p className="text-xs text-green-600 dark:text-green-400">{profileMessage}</p>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={updatingProfile}
            className="min-h-[44px] px-5 text-xs uppercase tracking-wider font-bold text-ink bg-gold hover:bg-gold-600 disabled:opacity-50 transition-colors flex items-center gap-2 rounded-lg"
          >
            {updatingProfile ? <Loader variant="dots" size="sm" /> : <Save className="w-4 h-4" />}
            <span>Save Profile</span>
          </button>
        </div>
      </form>
    </SectionCard>
  );
};