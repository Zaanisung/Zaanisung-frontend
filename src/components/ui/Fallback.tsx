import React from "react";
import { AlertTriangle, RotateCw, ShieldAlert } from "lucide-react";
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
      "flex flex-col items-center justify-center w-full py-12 px-6 text-center",
      className
    )}
    role="alert"
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
        className="mt-5 min-h-[44px] px-5 rounded-lg inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-ink bg-gold hover:bg-gold-600 transition-colors"
      >
        <RotateCw className="w-4 h-4" />
        <span>Try again</span>
      </button>
    )}
  </div>
);

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * A class-based React error boundary that catches any render error thrown
 * by its children and displays a safe, generic fallback UI instead of
 * leaking error messages/code to the frontend.
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Never surface the raw error to the user; only log it for debugging.
    console.error("Unhandled UI error:", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="w-full min-h-[50vh] flex items-center justify-center px-4">
          <div className="relative overflow-hidden w-full max-w-md py-14 px-6 surface-glass-strong rounded-2xl text-center flex flex-col items-center shadow-[0_0_0_1px_rgba(212,175,55,0.1),0_12px_40px_-10px_rgba(0,0,0,0.15)]">
            <div className="relative w-14 h-14 bg-gold/10 flex items-center justify-center text-gold mb-4 border border-gold/40 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="relative text-xl font-light text-black dark:text-white mb-1 font-brand-serif">
              Something went wrong
            </h2>
            <p className="relative text-xs text-black/50 dark:text-white/50 mb-6">
              An unexpected error occurred. Please refresh the page or try again in a moment.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="relative min-h-[44px] px-6 rounded-lg text-xs uppercase tracking-widest font-bold text-ink bg-gold hover:bg-gold-600 transition-colors"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
      "border border-black/10 dark:border-white/15 bg-white/60 dark:bg-white/[0.03] p-5 space-y-3 rounded-xl",
      className
    )}
  >
    <Skeleton className="h-4 w-1/3" />
    <SkeletonText lines={2} />
  </div>
);
