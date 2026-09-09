import React from "react";
import type { Order } from "../../../types";

interface RecentOrdersCardProps {
  orders: Order[];
  onViewAll: () => void;
}

export const RecentOrdersCard: React.FC<RecentOrdersCardProps> = ({
  orders,
  onViewAll,
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl surface-glass-strong p-5 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
      <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />
      <div className="relative flex items-center justify-between mb-4">
        <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold">
          Recent Orders & Recorded Sales
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="text-xs text-gold hover:underline uppercase tracking-wider font-semibold transition-colors duration-[400ms]"
        >
          View All ({orders.length}) →
        </button>
      </div>

      <div className="relative flex flex-col divide-y divide-black/10 dark:divide-white/10">
        {orders.slice(0, 4).map((o) => (
          <div
            key={o.id}
            className="py-3 flex items-center justify-between text-xs sm:text-sm"
          >
            <div className="min-w-0 pr-3">
              <div className="flex items-center space-x-2">
                <span className="font-mono font-bold text-black dark:text-white">{o.id}</span>
                <span
                  className={`rounded-md text-[9px] uppercase tracking-wider px-1.5 py-0.2 font-bold ${
                    o.source === "ONLINE"
                      ? "bg-black dark:bg-white text-white dark:text-black border border-white/30 dark:border-black/30"
                      : "bg-gold text-black border border-gold/40"
                  }`}
                >
                  {o.source || "ONLINE"}
                </span>
              </div>
              <p className="text-black/45 dark:text-white/45 text-xs truncate mt-0.5">
                {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
              </p>
            </div>

            <div className="text-right flex-shrink-0">
              <span className="font-bold text-gold">
                {o.total.toFixed(2)} GHS
              </span>
              <span className="text-[10px] uppercase tracking-wider text-black/50 dark:text-white/50 block">
                {o.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};