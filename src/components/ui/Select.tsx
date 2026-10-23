import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', id, ...props }, ref) => {
    const selectId = id || `select-${label ? label.toLowerCase().replace(/\s+/g, '-') : Math.random().toString(36).substr(2, 6)}`;

    return (
      <div className="w-full text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs uppercase tracking-wider font-medium text-[#716C64] mb-1.5">
            {label}
            {props.required && <span className="text-red-700 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={`w-full bg-[#FFFFFF] text-[#171512] px-3.5 py-2.5 pr-10 text-sm border ${
              error ? 'border-red-700' : 'border-[#E4DED3] focus:border-[#171512]'
            } rounded-sm outline-none transition-colors duration-150 appearance-none cursor-pointer ${className}`}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#716C64] pointer-events-none"
          />
        </div>
        {error && <p className="text-xs text-red-800 mt-1 font-medium">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
