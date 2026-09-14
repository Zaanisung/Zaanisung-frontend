import React from "react";
import { cn } from "../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "dark" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none tracking-[0.06em] uppercase text-xs min-h-[44px] min-w-0 max-w-full text-balance transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]";

  const sizeStyles = {
    sm: "min-h-[40px] px-4 py-2 rounded-lg text-[0.6875rem]",
    md: "min-h-[44px] px-6 py-3 rounded-xl",
    lg: "min-h-[50px] px-8 py-3.5 rounded-xl text-[0.8125rem]",
  };

  const variantStyles = {
    // Luxury gold CTA — flat solid fill, no gradient or glow
    primary: cn(
      "bg-gold text-ink font-bold border border-gold-600/40",
      "hover:bg-gold-600 hover:border-gold-700",
      "hover:scale-[1.01] active:scale-[0.98]"
    ),
    // Glassmorphic secondary
    secondary: cn(
      "surface-glass-strong text-ink dark:text-white",
      "border border-black/10 dark:border-white/15",
      "hover:border-gold/40",
      "hover:scale-[1.01] active:scale-[0.99]"
    ),
    // Dark luxury surface
    dark: cn(
      "bg-ink text-cream border border-ink/80",
      "hover:bg-ink-800",
      "dark:bg-white dark:text-ink dark:border-white/80",
      "dark:hover:bg-cream",
      "hover:scale-[1.01] active:scale-[0.99]"
    ),
    // Minimal outline
    outline: cn(
      "bg-transparent border border-ink/20 dark:border-white/20 text-ink dark:text-white",
      "hover:bg-ink hover:text-cream hover:border-ink",
      "dark:hover:bg-white dark:hover:text-ink dark:hover:border-white",
      "hover:scale-[1.01] active:scale-[0.99]"
    ),
    // Ghost (minimal)
    ghost: cn(
      "bg-transparent border border-transparent text-ink dark:text-white",
      "hover:bg-black/5 dark:hover:bg-white/10",
      "hover:scale-[1.01] active:scale-[0.99]"
    ),
    // Danger (destructive)
    danger: cn(
      "bg-red-600 text-white font-bold border border-red-700/50",
      "hover:bg-red-700",
      "hover:scale-[1.01] active:scale-[0.99]"
    ),
  };

  return (
    <button
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="loader-ring h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            role="status"
            aria-label="Loading"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </span>
      ) : (
        children
      )}
    </button>
  );
};