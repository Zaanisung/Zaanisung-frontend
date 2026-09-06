import React from "react";
import { cn } from "../../utils/cn";

export type OrderBadgeStatus = "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";

export interface StatusBadgeProps {
  status: OrderBadgeStatus;
  size?: "sm" | "md";
  className?: string;
}

const STATUS_TONES: Record<OrderBadgeStatus, string> = {
  PENDING: "bg-gold text-black border border-gold",
  CONFIRMED: "bg-white dark:bg-black text-black dark:text-white border border-black/15 dark:border-white/30",
  SHIPPED: "bg-black dark:bg-white text-white dark:text-black",
  DELIVERED: "bg-gold text-black border border-gold",
  CANCELLED: "bg-red-950 text-red-300 border border-red-800",
};

const SIZE_CLASSES: Record<NonNullable<StatusBadgeProps["size"]>, string> = {
  sm: "px-2.5 py-0.5 text-[10px] tracking-wider",
  md: "px-3 py-1 text-xs tracking-widest",
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