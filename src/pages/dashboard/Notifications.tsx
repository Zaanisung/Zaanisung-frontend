import React from "react";
import type { AppNotification } from "../../types/user";
import { EmptyState } from "../../components/ui/EmptyState";
import {
  Bell,
  BellDot,
  CheckCheck,
  Inbox,
  Mail,
  Smartphone,
} from "lucide-react";

export interface NotificationsProps {
  notifications: AppNotification[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
}

const channelBadge: Record<AppNotification["channel"], { icon: React.ReactNode; label: string }> = {
  IN_APP: { icon: <Inbox className="w-3 h-3" />, label: "In-App" },
  SMS: { icon: <Smartphone className="w-3 h-3" />, label: "SMS" },
  EMAIL: { icon: <Mail className="w-3 h-3" />, label: "Email" },
};

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffSec = Math.max(0, Math.floor((now - then) / 1000));

  if (diffSec < 60) return "Just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d ago`;
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
}) => {
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <div className="w-full space-y-6">
      <div className="flex items-baseline justify-between">
        <div>
          <p className="eyebrow text-black/45 dark:text-white/45 mb-1">
            Activity Feed
          </p>
          <h2 className="text-2xl font-light text-black dark:text-white font-brand-serif">
            Notifications
          </h2>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={onMarkAllRead}
            className="min-h-[44px] px-4 text-xs uppercase tracking-wider font-bold text-gold border border-gold/40 hover:bg-gold/10 transition-colors flex items-center gap-2"
          >
            <CheckCheck className="w-4 h-4" />
            <span>
              Mark all read{" "}
              <span className="text-[10px] font-mono">({unreadCount})</span>
            </span>
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-6 h-6 stroke-[1.5]" />}
          title="No notifications"
          message="You are all caught up. Updates from orders and promotions will appear here."
        />
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const isUnread = !n.readAt;
            const ch = channelBadge[n.channel];
            return (
              <button
                key={n._id}
                type="button"
                onClick={() => {
                  if (isUnread) onMarkRead(n._id);
                }}
                className={`w-full text-left border p-4 sm:p-5 flex gap-4 transition-all hover:-translate-y-0.5 ${
                  isUnread
                    ? "border-gold/40 bg-gold/5 hover:border-gold/60"
                    : "border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] hover:border-black/20 dark:hover:border-white/25"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {isUnread ? (
                    <BellDot className="w-5 h-5 text-gold" />
                  ) : (
                    <Bell className="w-5 h-5 text-black/30 dark:text-white/30" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3">
                    <h4
                      className={`text-sm font-brand-serif ${
                        isUnread
                          ? "text-black dark:text-white font-medium"
                          : "text-black/60 dark:text-white/60"
                      }`}
                    >
                      {n.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 font-bold bg-black/5 dark:bg-white/10 text-black/50 dark:text-white/50 border border-black/10 dark:border-white/15 flex items-center gap-1">
                        {ch.icon}
                        <span className="hidden sm:inline">{ch.label}</span>
                      </span>
                      {isUnread && (
                        <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-black/50 dark:text-white/50 mt-1 leading-relaxed">
                    {n.body}
                  </p>
                  <span className="text-[10px] text-black/35 dark:text-white/35 mt-2 block">
                    {timeAgo(n.createdAt)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
