import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  isPassword?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, isPassword, type = 'text', className = '', id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || `input-${label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 6)}`;
    const effectiveType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs uppercase tracking-wider font-medium text-[#716C64] mb-1.5">
            {label}
            {props.required && <span className="text-red-700 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={effectiveType}
            className={`w-full bg-[#FFFFFF] text-[#171512] px-3.5 py-2.5 text-sm border ${
              error ? 'border-red-700 focus:border-red-700' : 'border-[#E4DED3] focus:border-[#171512]'
            } rounded-sm outline-none transition-colors duration-150 placeholder:text-[#A8A29E] disabled:bg-[#F0ECE5] disabled:cursor-not-allowed ${
              isPassword ? 'pr-10' : ''
            } ${className}`}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#716C64] hover:text-[#171512] p-1 transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          )}
        </div>
        {error && <p className="text-xs text-red-800 mt-1 font-medium">{error}</p>}
        {helperText && !error && <p className="text-xs text-[#716C64] mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
