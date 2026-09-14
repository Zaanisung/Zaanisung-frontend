import React from "react";
import type { Order, OrderStatus } from "../../../types";
import { ClipboardList, ArrowRight } from "lucide-react";

interface RecentOrdersCardProps {
  orders: Order[];
  onViewAll: () => void;
}

const STATUS_STYLES: Partial<Record<OrderStatus, string>> = {
  PENDING: "bg-gold/12 text-gold border-gold/40",
  CONFIRMED: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30",
  SHIPPED: "bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/30",
  DELIVERED: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  CANCELLED: "bg-red-500/10 text-red-500 border-red-500/30",
};

const STATUS_FALLBACK =
  "bg-black/5 dark:bg-white/10 text-black/60 dark:text-white/60 border-black/10 dark:border-white/15";

export const RecentOrdersCard: React.FC<RecentOrdersCardProps> = ({
  orders,
  onViewAll,
}) => {
  const recent = orders.slice(0, 4);

  return (
    <div
      className="relative overflow-hidden rounded-[18px] surface-glass-strong p-4 sm:p-5 shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]"
      data-tour="admin-recent-orders"
    >
      <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true" />
      <div className="relative flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-xs uppercase tracking-widest text-black dark:text-white font-bold flex items-center gap-2 min-w-0">
          <ClipboardList className="w-4 h-4 text-gold flex-shrink-0" />
          <span className="truncate">Recent Orders</span>
        </h3>
        <button
          type="button"
          onClick={onViewAll}
          className="inline-flex items-center gap-1 min-h-[44px] px-3 rounded-full text-[10px] text-gold border border-transparent hover:border-gold/40 hover:bg-gold/10 uppercase tracking-wider font-bold transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]"
        >
          View All ({orders.length})
          <ArrowRight className="w-3.5 h-3.5 text-gold" />
        </button>
      </div>

      <div className="relative flex flex-col divide-y divide-black/10 dark:divide-white/10">
        {recent.length === 0 && (
          <p className="py-6 text-center text-sm text-black/45 dark:text-white/45">
            No sales yet — new online and walk-in sales will appear here.
          </p>
        )}
        {recent.map((o) => {
          const statusClass = STATUS_STYLES[o.status] ?? STATUS_FALLBACK;
          return (
            <div
              key={o.id}
              className="py-3 flex items-center justify-between gap-3 min-w-0"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center flex-wrap gap-2">
                  <span className="font-mono font-bold text-black dark:text-white text-sm">
                    {o.id}
                  </span>
                  <span
                    className={`rounded-full text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold ${
                      o.source === "ONLINE"
                        ? "bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50 border border-black/10 dark:border-white/15"
                        : "bg-gold/12 text-gold border border-gold/40"
                    }`}
                  >
                    {o.source || "ONLINE"}
                  </span>
                </div>
                <p className="text-black/45 dark:text-white/45 text-xs truncate mt-1 min-w-0">
                  {o.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <span className="block font-bold text-gold font-mono tabular-nums text-sm">
                  {o.total.toFixed(2)} GHS
                </span>
                <span
                  className={`inline-block mt-1 rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold ${statusClass}`}
                >
                  {o.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};