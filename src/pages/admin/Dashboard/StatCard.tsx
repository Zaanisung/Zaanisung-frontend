import React from "react";
import type { ReactNode } from "react";

export type StatTone = "default" | "gold" | "red";

interface StatCardProps {
  label: string;
  value: ReactNode;
  caption: string;
  icon: ReactNode;
  onClick: () => void;
  tone?: StatTone;
  active?: boolean;
  className?: string;
}

const toneClasses: Record<StatTone, { base: string; active: string }> = {
  default: {
    base: "hover:border-gold/60",
    active: "",
  },
  gold: {
    base: "hover:border-gold/60",
    active: "border-gold/50 bg-gold/8 hover:border-gold",
  },
  red: {
    base: "hover:border-gold/60",
    active: "border-red-900/50 bg-red-950/10 hover:border-red-600",
  },
};

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  caption,
  icon,
  onClick,
  tone = "default",
  active = false,
  className,
}) => {
  const t = toneClasses[tone];
  return (
    <div
      onClick={onClick}
      className={`rounded-xl relative overflow-hidden surface-glass-strong hover:-translate-y-0.5 p-4 sm:p-5 flex flex-col justify-between cursor-pointer transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)] group ${t.base} ${
        active ? t.active : ""
      } ${className ?? ""}`}
    >
      <div
        className={`flex items-center justify-between mb-2 ${
          tone === "gold"
            ? "text-gold"
            : tone === "red"
              ? "text-red-500"
              : "text-black/50 dark:text-white/50"
        }`}
      >
        <span className="text-[10px] uppercase tracking-widest font-bold">{label}</span>
        {icon}
      </div>
      <div
        className={`text-2xl sm:text-3xl font-mono font-bold ${
          tone === "gold"
            ? "text-gold"
            : tone === "red"
              ? "text-red-400"
              : "text-black dark:text-white"
        }`}
      >
        {value}
      </div>
      <span className="text-[10px] text-black/50 dark:text-white/50 mt-2 block">
        {caption}
      </span>
    </div>
  );
};