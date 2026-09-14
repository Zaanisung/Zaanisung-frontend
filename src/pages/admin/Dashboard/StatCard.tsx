import React from "react";
import type { ReactNode } from "react";
import { cn } from "../../../utils/cn";

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

const toneStyles: Record<
  StatTone,
  { iconBox: string; icon: string; value: string; active: string }
> = {
  default: {
    iconBox: "bg-black/[0.05] dark:bg-white/10",
    icon: "text-black/50 dark:text-white/60",
    value: "text-black dark:text-white",
    active: "",
  },
  gold: {
    iconBox: "bg-gold/12 border border-gold/30",
    icon: "text-gold",
    value: "text-gold",
    active: "border-gold/50 bg-gold/[0.06]",
  },
  red: {
    iconBox: "bg-red-950/10 border border-red-800/40",
    icon: "text-red-500",
    value: "text-red-500",
    active: "border-red-900/50 bg-red-950/10",
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
  const t = toneStyles[tone];
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className={cn(
        "group relative w-full min-w-0 cursor-pointer overflow-hidden surface-glass-strong",
        "p-4 sm:p-5 flex flex-col gap-3 transition-all duration-[400ms]",
        "ease-[cubic-bezier(0.25,0.46,0.45,0.94)] hover:-translate-y-0.5",
        "hover:border-gold/50 hover:shadow-[0_16px_36px_-22px_rgba(22,19,14,0.6)]",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/40",
        active && t.active,
        className
      )}
    >
      <div className="flex items-start justify-between gap-2 min-w-0">
        <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-bold text-black/55 dark:text-white/55 leading-snug truncate min-w-0">
          {label}
        </span>
        <span
          className={cn(
            "flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border",
            "transition-colors duration-[400ms]",
            t.iconBox,
            "[&_svg]:w-[18px] [&_svg]:h-[18px] [&_svg]:transition-colors [&_svg]:duration-[400ms]"
          )}
        >
          {icon}
        </span>
      </div>

      <div
        className={cn(
          "text-2xl sm:text-[1.75rem] xl:text-3xl font-mono font-bold leading-none tracking-tight",
          "min-w-0 flex flex-wrap items-baseline gap-x-1.5 tabular-nums",
          t.value
        )}
      >
        {value}
      </div>

      <div className="pt-3 mt-0.5 border-t border-black/[0.06] dark:border-white/10 flex items-center justify-between gap-2 min-w-0">
        <span className="text-[10px] text-black/50 dark:text-white/50 truncate min-w-0">
          {caption}
        </span>
      </div>
    </div>
  );
};