import React from "react";
import { cn } from "../../utils/cn";

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message?: string;
  action?: React.ReactNode;
  iconClassName?: string;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  action,
  iconClassName,
  className,
}) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden w-full max-w-md mx-auto py-16 px-6 surface-glass-strong rounded-2xl text-center flex flex-col items-center shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]",
        className
      )}
      role="status"
    >
      <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
      <div className="absolute -bottom-20 -left-20 w-56 h-56 orb orb-gold-faint animate-mist-pulse" aria-hidden="true"></div>

      {icon && (
        <div
          className={cn(
            "relative w-14 h-14 rounded-xl surface-glass-tint flex items-center justify-center text-gold mb-4 border border-gold/40",
            iconClassName
          )}
        >
          {icon}
        </div>
      )}

      <h2 className="relative text-xl font-light text-ink dark:text-cream mb-1 font-brand-serif">
        {title}
      </h2>

      {message && (
        <p className="relative text-sm text-black/60 dark:text-white/60 mb-6 leading-relaxed">{message}</p>
      )}

      {action && <div className="relative w-full">{action}</div>}
    </div>
  );
};