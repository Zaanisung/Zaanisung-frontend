import React from "react";

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
    <div className="inline-flex p-1 surface-glass">
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`min-h-[38px] px-3 text-[10px] uppercase tracking-wider font-bold transition-colors ${
            value === opt.value
              ? "bg-gold text-black"
              : "text-black/45 dark:text-white/45 hover:text-black dark:hover:text-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};