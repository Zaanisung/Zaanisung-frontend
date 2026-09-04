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
    "inline-flex items-center justify-center font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37] focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none tracking-wide whitespace-nowrap active:scale-[0.99] uppercase text-xs";

  const sizeStyles = {
    sm: "min-h-[40px] px-3.5 py-1.5",
    md: "min-h-[44px] px-5 py-2.5",
    lg: "min-h-[48px] px-6 py-3 text-sm",
  };

  const variantStyles = {
    // Luxury gold CTA with crisp geometric borders
    primary:
      "bg-[#D4AF37] hover:bg-[#C29E2E] text-black font-bold border border-[#D4AF37]",
    // Clean deep black luxury button
    dark:
      "bg-[#0A0A0A] hover:bg-[#202020] text-white border border-[#222222]",
    // Secondary white button with crisp border
    secondary:
      "bg-white hover:bg-[#F4F4F5] text-[#18181B] border border-gray-200",
    // Minimal outline with gold hover
    outline:
      "bg-transparent hover:bg-black hover:text-white text-black border border-black dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-black",
    // Ghost
    ghost:
      "bg-transparent hover:bg-black/5 text-[#18181B] dark:text-[#E4E4E7] dark:hover:bg-white/10 border-transparent",
    // Danger
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
          <span>Please wait...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
};
