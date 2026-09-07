import React from "react";

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
    "inline-flex items-center justify-center font-semibold transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none tracking-[0.06em] whitespace-nowrap active:scale-[0.99] uppercase text-xs min-h-[44px]";

  const sizeStyles = {
    sm: "min-h-[40px] px-4 py-1.5",
    md: "min-h-[44px] px-5 py-2.5",
    lg: "min-h-[50px] px-7 py-3 text-[0.8125rem]",
  };

  const variantStyles = {
    // Luxury gold CTA — luminous gradient, sharp geometric borders
    primary:
      "border border-gold-700/70 bg-[linear-gradient(180deg,#e0bd4c_0%,#d4af37_45%,#c29e2e_100%)] text-ink hover:shadow-[0_16px_36px_-14px_rgba(212,175,55,0.85)] hover:brightness-[1.04] shadow-[0_10px_26px_-14px_rgba(212,175,55,0.7)]",
    // Clean deep-black luxury surface
    dark:
      "bg-ink text-cream hover:bg-ink-800 border border-ink dark:bg-white dark:text-ink dark:hover:bg-cream dark:border-white",
    // Translucent glass surface with crisp border
    secondary:
      "surface-glass-strong text-ink dark:text-white hover:border-gold/60",
    // Minimal outline with gold hover
    outline:
      "bg-transparent hover:bg-ink hover:text-cream text-ink border border-ink dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-ink",
    ghost:
      "bg-transparent hover:bg-black/5 text-ink dark:text-white dark:hover:bg-white/10 border-transparent",
    danger:
      "bg-red-600 hover:bg-red-700 text-white font-bold border border-red-700",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </span>
      ) : (
        children
      )}
    </button>
  );
};