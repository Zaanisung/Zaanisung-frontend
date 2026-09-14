import React, { useState } from "react";
import type { FullUser } from "../../../types/user";
import { SectionCard } from "./SectionCard";
import { Palette } from "lucide-react";

const accentSwatches = [
  { value: "#d4af37", label: "Gold" },
  { value: "#1a1a1a", label: "Obsidian" },
  { value: "#8b5e3c", label: "Amber" },
  { value: "#c2b280", label: "Sand" },
  { value: "#4a6741", label: "Sage" },
  { value: "#7c3aed", label: "Violet" },
];

interface AppearanceCardProps {
  user: FullUser | null;
  onUpdateAppearance: (data: {
    accentColor?: string;
  }) => void;
}

export const AppearanceCard: React.FC<AppearanceCardProps> = ({
  user,
  onUpdateAppearance,
}) => {
  const [accentColor, setAccentColor] = useState(
    user?.appearance?.accentColor ?? "#d4af37"
  );

  return (
    <SectionCard icon={<Palette className="w-4 h-4 text-gold" />} title="Appearance">
      <div className="space-y-5">
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
        <p className="text-[10px] leading-relaxed text-black/45 dark:text-white/45">
          Theme follows your device (light/dark) automatically — there is no
          manual light/dark switch.
        </p>
      </div>
    </SectionCard>
  );
};