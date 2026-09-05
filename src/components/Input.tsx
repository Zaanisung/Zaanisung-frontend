import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixIcon?: React.ReactNode;
  suffixIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, prefixIcon, suffixIcon, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full flex flex-col gap-1 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[11px] font-semibold uppercase tracking-widest text-black/60 dark:text-white/60"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="absolute left-3.5 text-black/45 dark:text-white/45 pointer-events-none flex items-center">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white dark:bg-white/5 text-black dark:text-white placeholder-black/40 rounded-none border transition-colors focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] ${
              prefixIcon ? "pl-10" : ""
            } ${suffixIcon ? "pr-10" : ""} ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-black/10 dark:border-white/15"
            } ${className}`}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute right-3.5 text-black/45 dark:text-white/45 flex items-center">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-black/45 dark:text-white/45">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
