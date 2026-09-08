import React from "react";
import { cn } from "../../utils/cn";

export type OrderBadgeStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface StatusBadgeProps {
  status: OrderBadgeStatus;
  size?: "sm" | "md";
  className?: string;
}

const STATUS_TONES: Record<OrderBadgeStatus, string> = {
  PENDING: "bg-gold/90 text-ink border border-gold/30 shadow-[0_0_0_1px_rgba(212,175,55,0.15)]",
  CONFIRMED: "surface-glass-strong text-ink dark:text-cream border border-black/15 dark:border-white/20",
  SHIPPED: "bg-ink dark:bg-cream text-cream dark:text-ink border border-ink/80 dark:border-cream/80",
  DELIVERED: "bg-gold/90 text-ink border border-gold/30 shadow-[0_0_0_1px_rgba(212,175,55,0.15)]",
  CANCELLED: "bg-red-950/80 text-red-300 border border-red-800/60 backdrop-blur-sm",
};

const SIZE_CLASSES: Record<NonNullable<StatusBadgeProps["size"]>, string> = {
  sm: "px-2.5 py-1 text-[10px] tracking-wider rounded-lg",
  md: "px-3 py-1.5 text-xs tracking-widest rounded-xl",
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
  className,
}) => {
  const tone = STATUS_TONES[status] ?? STATUS_TONES.PENDING;

  return (
    <span
      className={cn(
        "inline-block uppercase font-bold text-center",
        SIZE_CLASSES[size],
        tone,
        className
      )}
    >
      {status}
    </span>
  );
};