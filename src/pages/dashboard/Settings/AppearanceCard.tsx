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
    theme?: "light" | "dark" | "system";
    accentColor?: string;
  }) => void;
}

export const AppearanceCard: React.FC<AppearanceCardProps> = ({
  user,
  onUpdateAppearance,
}) => {
  const [theme, setTheme] = useState<"light" | "dark" | "system">(
    user?.appearance?.theme ?? "system"
  );
  const [accentColor, setAccentColor] = useState(
    user?.appearance?.accentColor ?? "#d4af37"
  );

  return (
    <SectionCard icon={<Palette className="w-4 h-4 text-gold" />} title="Appearance">
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
    </SectionCard>
  );
};