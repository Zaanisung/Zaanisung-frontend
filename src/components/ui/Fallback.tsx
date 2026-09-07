import React from "react";
import { AlertTriangle, RotateCw } from "lucide-react";
import { cn } from "../../utils/cn";

/**
 * Fallback / error components. Errors shown to users are intentionally
 * vague — we never leak internal details.
 */

interface ErrorFallbackProps {
  title?: string;
  hint?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = "Something went wrong",
  hint = "Please try again in a moment.",
  onRetry,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center py-12 px-6 text-center",
      className
    )}
  >
    <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gold/10 border border-gold/30 mb-4">
      <AlertTriangle className="w-6 h-6 text-gold" aria-hidden="true" />
    </div>
    <h3 className="font-serif text-lg tracking-wide text-ink dark:text-white">{title}</h3>
    <p className="mt-1.5 text-sm text-black/50 dark:text-white/50 max-w-sm">{hint}</p>
    {onRetry && (
      <button
        type="button"
        onClick={onRetry}
        className="mt-5 min-h-[44px] px-5 inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-ink bg-gold hover:bg-gold-600 transition-colors"
      >
        <RotateCw className="w-4 h-4" />
        <span>Try again</span>
      </button>
    )}
  </div>
);

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div className={cn("skeleton rounded-md", className)} aria-hidden="true" />
);

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({
  lines = 3,
  className,
}) => (
  <div className={cn("space-y-2", className)} aria-hidden="true">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={cn("h-3.5", i === lines - 1 ? "w-2/3" : "w-full")}
      />
    ))}
  </div>
);

export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={cn(
      "border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] p-5 space-y-3",
      className
    )}
  >
    <Skeleton className="h-4 w-1/3" />
    <SkeletonText lines={2} />
  </div>
);
