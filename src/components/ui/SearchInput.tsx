import React from "react";
import { cn } from "../../utils/cn";
import { Search, X } from "lucide-react";

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  ariaLabel = "Search",
  className,
}) => (
  <div className={cn("relative w-full", className)}>
    <Search
      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/50 dark:text-white/50 pointer-events-none"
      aria-hidden="true"
    />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className="w-full pl-9 pr-8 min-h-[44px] surface-glass text-black dark:text-white text-xs placeholder-black/50 focus:outline-none focus:border-gold transition-colors"
    />
    {value && (
      <button
        type="button"
        onClick={() => onChange("")}
        className="absolute right-3 top-1/2 -translate-y-1/2 min-h-[32px] min-w-[32px] flex items-center justify-center text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors"
        aria-label="Clear search"
      >
        <X className="w-4 h-4" />
      </button>
    )}
  </div>
);