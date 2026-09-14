import React from "react";
import { cn } from "../../../utils/cn";

export type OrderSourceFilter = "ALL" | "ONLINE" | "PHYSICAL";

interface OrderStatusFilterProps {
  value: OrderSourceFilter;
  onChange: (value: OrderSourceFilter) => void;
}

const OPTIONS: { value: OrderSourceFilter; label: string }[] = [
  { value: "ALL", label: "All Sales" },
  { value: "ONLINE", label: "Online Orders" },
  { value: "PHYSICAL", label: "Walk-in Sales" },
];

export const OrderStatusFilter: React.FC<OrderStatusFilterProps> = ({
  value,
  onChange,
}) => {
  return (
    <div
      role="group"
      aria-label="Filter sales by source"
      className="flex flex-wrap items-center gap-2 self-start w-full sm:w-auto"
    >
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          aria-pressed={value === opt.value}
          className={cn(
            "flex-1 sm:flex-none min-h-[44px] px-3.5 sm:px-4 rounded-full text-[9px] sm:text-[10px] uppercase tracking-wider font-bold",
            "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
            value === opt.value
              ? "bg-gold text-black shadow-[0_6px_16px_-8px_rgba(212,175,55,0.6)]"
              : "bg-black/[0.04] dark:bg-white/10 text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white hover:bg-black/[0.08] dark:hover:bg-white/15 border border-black/10 dark:border-white/15"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};