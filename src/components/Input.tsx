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
            className="text-[11px] font-semibold uppercase tracking-widest text-[#52525B] dark:text-[#A1A1AA]"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixIcon && (
            <div className="absolute left-3.5 text-[#71717A] pointer-events-none flex items-center">
              {prefixIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`w-full min-h-[44px] px-3.5 py-2.5 text-sm bg-white dark:bg-[#141416] text-[#18181B] dark:text-[#F4F4F5] placeholder-gray-400 rounded-none border transition-colors focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] ${
              prefixIcon ? "pl-10" : ""
            } ${suffixIcon ? "pr-10" : ""} ${
              error
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-200 dark:border-[#2C2C32]"
            } ${className}`}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute right-3.5 text-[#71717A] flex items-center">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 font-medium">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-[#71717A]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
