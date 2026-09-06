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
        "relative overflow-hidden w-full max-w-md mx-auto py-16 px-6 surface-glass-strong corner-frame-static corner-frame text-center flex flex-col items-center shadow-lift",
        className
      )}
    >
      <div className="absolute top-0 left-0 right-0 hairline-gold" aria-hidden="true"></div>
      <div className="absolute -bottom-20 -left-20 w-56 h-56 orb orb-gold-faint" aria-hidden="true"></div>

      {icon && (
        <div
          className={cn(
            "relative w-14 h-14 bg-gold/10 flex items-center justify-center text-gold mb-4 border border-gold/40",
            iconClassName
          )}
        >
          {icon}
        </div>
      )}

      <h2 className="relative text-xl font-light text-black dark:text-white mb-1 font-brand-serif">
        {title}
      </h2>

      {message && (
        <p className="relative text-xs text-black/50 dark:text-white/50 mb-6">{message}</p>
      )}

      {action && <div className="relative w-full">{action}</div>}
    </div>
  );
};