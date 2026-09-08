import React, { forwardRef } from "react";
import { cn } from "../utils/cn";

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
      <div className="w-full flex flex-col gap-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="eyebrow text-black/55 dark:text-white/55"
          >
            {label}
            {props.required && <span className="text-gold ml-1">*</span>}
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
            className={cn(
              "w-full min-h-[46px] px-4 py-3 text-sm rounded-xl",
              "surface-glass-strong",
              "text-ink dark:text-white",
              "placeholder-ink/35 dark:placeholder-white/35",
              "border border-black/10 dark:border-white/15",
              "focus:outline-none focus:ring-2 focus:ring-gold/30 focus:border-gold/50",
              "focus:shadow-[0_0_0_1px_rgba(212,175,55,0.2),0_8px_32px_-8px_rgba(212,175,55,0.25)]",
              "transition-all duration-[400ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              prefixIcon && "pl-10",
              suffixIcon && "pr-10",
              error && "border-red-500/50 focus:ring-red-500/30 focus:border-red-500",
              className
            )}
            {...props}
          />
          {suffixIcon && (
            <div className="absolute right-3.5 text-black/45 dark:text-white/45 flex items-center">
              {suffixIcon}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 font-medium flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span>{error}</span>
          </p>
        )}
        {!error && helperText && (
          <p className="text-xs text-black/45 dark:text-white/45">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";